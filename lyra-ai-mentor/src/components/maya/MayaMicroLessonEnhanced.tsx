import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Timer, 
  ChevronRight, 
  CheckCircle2,
  Heart,
  Sparkles,
  Trophy,
  ArrowLeft,
  Wand2,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { MobileResponsiveWrapper, TouchTarget } from '@/components/ui/mobile-responsive-wrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useAdaptiveAI } from '@/hooks/useAdaptiveAI';
import { enhancedAIService } from '@/services/enhancedAIService';
import { StreamingTextArea } from '@/components/ui/StreamingTextArea';
import { toast } from 'sonner';
import '@/styles/glassmorphism.css';

export interface MicroLessonData {
  id: string;
  lessonNumber: number;
  title: string;
  estimatedTime: number; // in seconds
  objective: string;
  type: 'chat' | 'interactive' | 'practice' | 'demo';
  chatFlow?: ChatMessage[];
  interactiveContent?: React.ComponentType<any>;
  successMetric?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'maya' | 'user' | 'system';
  text: string;
  choices?: string[];
  emotion?: 'worried' | 'hopeful' | 'confident' | 'excited';
  delay?: number; // milliseconds before showing
  animation?: 'fade' | 'slide' | 'bounce';
  showAIButton?: boolean; // New: Show AI magic button
  aiPrompt?: string; // New: Prompt for AI generation
}

interface MayaMicroLessonEnhancedProps {
  lessonData: MicroLessonData;
  onComplete: (metrics: any) => void;
  onBack?: () => void;
}

export const MayaMicroLessonEnhanced: React.FC<MayaMicroLessonEnhancedProps> = ({ 
  lessonData, 
  onComplete,
  onBack 
}) => {
  const { user } = useAuth();
  const { personalityProfile, trackMayaProgress } = useAdaptiveAI();
  
  // State management
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [startTime] = useState(Date.now());
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTimer, setSuccessTimer] = useState(3); // 3 second countdown
  
  // AI Generation state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  
  // Maya's emotional state
  const [mayaEmotion, setMayaEmotion] = useState<string>('hopeful');
  
  // Timer tracking
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progressPercent = Math.min((elapsed / lessonData.estimatedTime) * 100, 100);
      setProgress(progressPercent);
    }, 100);
    
    return () => clearInterval(timer);
  }, [startTime, lessonData.estimatedTime]);
  
  // Success countdown timer
  useEffect(() => {
    if (showSuccess && successTimer > 0) {
      const timer = setTimeout(() => {
        setSuccessTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && successTimer === 0) {
      handleAutoComplete();
    }
  }, [showSuccess, successTimer]);
  
  // Chat flow management
  useEffect(() => {
    if (lessonData.type === 'chat' && lessonData.chatFlow) {
      processNextMessage();
    }
  }, [currentMessageIndex]);
  
  const processNextMessage = async () => {
    if (!lessonData.chatFlow || currentMessageIndex >= lessonData.chatFlow.length) {
      if (currentMessageIndex > 0) {
        handleLessonComplete();
      }
      return;
    }
    
    const message = lessonData.chatFlow[currentMessageIndex];
    
    // Update Maya's emotion if specified
    if (message.emotion) {
      setMayaEmotion(message.emotion);
    }
    
    // Show typing indicator and typewriter effect for Maya's messages
    if (message.sender === 'maya') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsTyping(false);
      
      // Add message with typewriter effect
      const fullText = message.text;
      let currentText = '';
      setVisibleMessages(prev => [...prev, { ...message, text: '' }]);
      
      // Typewriter effect
      for (let i = 0; i <= fullText.length; i++) {
        currentText = fullText.slice(0, i);
        setVisibleMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentText;
          return newMessages;
        });
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    } else {
      // Add non-Maya messages immediately
      setVisibleMessages(prev => [...prev, message]);
    }
    
    // Auto-advance for non-choice messages and non-AI button messages
    if (!message.choices && !message.showAIButton) {
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, message.delay || 2000);
    }
  };
  
  const handleUserChoice = (messageId: string, choice: string) => {
    setUserChoices(prev => ({ ...prev, [messageId]: choice }));
    
    // Track the choice for adaptive AI
    if (personalityProfile) {
      // Adjust next messages based on choice
    }
    
    // Continue to next message
    setCurrentMessageIndex(prev => prev + 1);
  };
  
  const handleAIGeneration = async (prompt: string) => {
    setIsGeneratingAI(true);
    setShowGeneratedContent(false);
    
    try {
      // Generate email using AI
      const email = await enhancedAIService.generateEmail({
        tone: 'warm and professional',
        recipient: 'concerned parent',
        purpose: 'address concern about child\'s progress',
        context: prompt,
        keyPoints: [
          'Child is doing well overall',
          'Made new friends in the program',
          'Showing improvement in participation',
          'Upcoming showcase event'
        ]
      });
      
      setGeneratedContent(email);
      setShowGeneratedContent(true);
      
      // Show success animation
      toast.success('AI Email Generated! ✨', {
        description: 'Watch how AI transformed your request into a professional email',
        duration: 5000
      });
      
      // Auto-advance after viewing AI result
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, 5000);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      // Fallback content
      const fallbackEmail = `Dear Sarah,

I hope this message finds you well. I wanted to reach out personally to share some wonderful updates about Jayden's progress in our after-school program.

Over the past few weeks, Jayden has really come out of his shell. He's been actively participating in our robotics club and has made several new friends who share his interests. His enthusiasm during activities has been infectious, and he's shown real leadership potential when working on group projects.

I'm excited to invite you to our upcoming showcase next Friday at 3 PM, where Jayden and his team will be presenting their robot design. He's been working hard on this project and I know he'd love to have you there to see what he's accomplished.

Please don't hesitate to reach out if you have any questions or concerns. We're so grateful to have Jayden in our program!

Warm regards,
Maya Rodriguez
Program Director`;
      
      setGeneratedContent(fallbackEmail);
      setShowGeneratedContent(true);
      
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, 5000);
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const handleLessonComplete = () => {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    setShowSuccess(true);
    setSuccessTimer(3); // Reset timer
    
    // Track completion
    if (user?.id) {
      trackMayaProgress(parseInt(lessonData.id.split('-')[3]), {
        completionData: {
          microLessonId: lessonData.id,
          timeSpent: totalTime,
          userChoices,
          emotionalJourney: mayaEmotion,
          aiUsed: showGeneratedContent
        }
      });
    }
  };
  
  const handleAutoComplete = () => {
    setShowSuccess(false);
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    
    // Small delay to ensure modal is hidden before continuing
    setTimeout(() => {
      onComplete({
        lessonId: lessonData.id,
        timeSpent: totalTime,
        choices: userChoices,
        completed: true,
        autoContinue: true,
        aiGenerated: showGeneratedContent
      });
    }, 300);
  };
  
  const getMayaAvatar = () => {
    const avatarClasses = {
      worried: 'from-purple-200 to-pink-200',
      hopeful: 'from-purple-300 to-pink-300',
      confident: 'from-purple-400 to-pink-400',
      excited: 'from-purple-500 to-pink-500'
    };
    
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br shadow-lg relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${avatarClasses[mayaEmotion as keyof typeof avatarClasses]}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white drop-shadow-sm" />
        </div>
      </div>
    );
  };
  
  return (
    <MobileResponsiveWrapper maxWidth="2xl" padding="small">
      <div className="min-h-screen flex flex-col">
        {/* Header - Fixed on mobile */}
        <div className="sticky top-0 z-10 glass-nav">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <TouchTarget onClick={onBack} className="p-2">
                  <ArrowLeft className="w-5 h-5" />
                </TouchTarget>
              )}
              <div>
                <h3 className="font-semibold text-sm">Micro-Lesson {lessonData.lessonNumber}</h3>
                <p className="text-xs text-gray-600">{lessonData.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Timer className="w-3 h-3 mr-1" />
                {Math.ceil(lessonData.estimatedTime / 60)}min
              </Badge>
            </div>
          </div>
          
          {/* Progress bar */}
          <Progress value={progress} className="h-1" />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-20">
          {lessonData.type === 'chat' ? (
            <div className="p-4 space-y-4">
              {/* Chat messages */}
              {visibleMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'maya' ? 'justify-start' : 'justify-end'} ${
                    message.animation === 'slide' ? 'animate-slide-in' : 'animate-fade-in'
                  }`}
                >
                  {message.sender === 'maya' && (
                    <div className="flex gap-3 max-w-[85%]">
                      {getMayaAvatar()}
                      <div>
                        <div className="glass-purple rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="p-3">
                            <p className="text-sm text-purple-900">{message.text}</p>
                          </div>
                        </div>
                        
                        {/* AI Magic Button */}
                        {message.showAIButton && !showGeneratedContent && (
                          <div className="mt-4 animate-fade-in">
                            <Button
                              onClick={() => handleAIGeneration(message.aiPrompt || '')}
                              disabled={isGeneratingAI}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                              {isGeneratingAI ? (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                  AI is writing your email...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-4 h-4 mr-2" />
                                  See the AI Magic! ✨
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                        
                        {/* Generated AI Content */}
                        {message.showAIButton && showGeneratedContent && (
                          <div className="mt-4 space-y-3 animate-fade-in">
                            <div className="glass-green rounded-xl shadow-lg overflow-hidden">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                                <p className="text-xs font-semibold text-white flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  AI Generated Email (5 seconds!)
                                </p>
                              </div>
                              <div className="p-4 max-h-64 overflow-y-auto">
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">
                                  {generatedContent}
                                </pre>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                              <Badge className="bg-purple-100 text-purple-700">
                                <Zap className="w-3 h-3 mr-1" />
                                32 min → 5 sec
                              </Badge>
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ready to send!
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        {/* Choice buttons for Maya's questions */}
                        {message.choices && !userChoices[message.id] && (
                          <div className="mt-3 space-y-2">
                            {message.choices.map((choice, idx) => (
                              <TouchTarget
                                key={idx}
                                onClick={() => handleUserChoice(message.id, choice)}
                                className="w-full"
                              >
                                <div className="glass-button rounded-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                                  <div className="p-3">
                                    <p className="text-sm font-medium">{choice}</p>
                                  </div>
                                </div>
                              </TouchTarget>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {message.sender === 'user' && userChoices[visibleMessages[index - 1]?.id] && (
                    <div className="glass-blue rounded-xl max-w-[85%] shadow-sm">
                      <div className="p-3">
                        <p className="text-sm text-blue-900 font-medium">{userChoices[visibleMessages[index - 1].id]}</p>
                      </div>
                    </div>
                  )}
                  
                  {message.sender === 'system' && (
                    <div className="w-full flex justify-center">
                      <Badge variant="secondary" className="text-xs">
                        {message.text}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  {getMayaAvatar()}
                  <div className="glass-purple rounded-xl">
                    <div className="p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : lessonData.type === 'interactive' && lessonData.interactiveContent ? (
            <div className="p-4">
              <lessonData.interactiveContent onComplete={handleLessonComplete} />
            </div>
          ) : (
            <div className="p-4">
              <div className="glass-card rounded-xl">
                <div className="p-6 text-center">
                  <p>Practice content coming soon...</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Success Modal with Auto-Continue Timer */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="w-full max-w-sm animate-scale-in glass-strong rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="p-6 text-center relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="confetti" />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Micro-Win Unlocked!</h3>
                <p className="text-sm text-green-700 mb-4">
                  {lessonData.title} complete!
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <span className="text-sm font-bold text-yellow-700">+10 Confidence</span>
                </div>
                <Progress value={100} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">Continuing in {successTimer}...</p>
                
                {/* Skip button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoComplete}
                  className="mt-2 text-xs"
                >
                  Skip →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileResponsiveWrapper>
  );
};

export default MayaMicroLessonEnhanced;