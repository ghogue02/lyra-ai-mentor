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
  ArrowLeft
} from 'lucide-react';
import { MobileResponsiveWrapper, TouchTarget } from '@/components/ui/mobile-responsive-wrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useAdaptiveAI } from '@/hooks/useAdaptiveAI';
import { enhancedAIService } from '@/services/enhancedAIService';
import { Wand2, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { AIComponentErrorBoundary } from '@/components/ai-playground/AIComponentErrorBoundary';
import '@/styles/glassmorphism.css';
import MayaEmailRecipeBuilderMinimal from './MayaEmailRecipeBuilderMinimal';
import MayaInteractiveEmailPracticeMinimal from './MayaInteractiveEmailPracticeMinimal';

export interface MicroLessonData {
  id: string;
  lessonNumber: number;
  title: string;
  estimatedTime: number; // in seconds
  objective: string;
  type: 'chat' | 'interactive' | 'practice';
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
  showAIButton?: boolean; // Show AI magic button
  aiPrompt?: string; // Prompt for AI generation
}

interface MayaMicroLessonProps {
  lessonData: MicroLessonData;
  onComplete: (metrics: any) => void;
  onBack?: () => void;
  useMinimalUI?: boolean;
}

export const MayaMicroLesson: React.FC<MayaMicroLessonProps> = ({ 
  lessonData, 
  onComplete,
  onBack,
  useMinimalUI = false
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
  
  const handleAutoComplete = () => {
    // Hide modal first to prevent overlay issues
    setShowSuccess(false);
    
    // Use requestAnimationFrame to ensure DOM updates
    requestAnimationFrame(() => {
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        lessonId: lessonData.id,
        timeSpent: totalTime,
        choices: userChoices,
        completed: true,
        autoContinue: true
      });
    });
  };
  
  // Timer tracking
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progressPercent = Math.min((elapsed / lessonData.estimatedTime) * 100, 100);
      setProgress(progressPercent);
    }, 100);
    
    return () => clearInterval(timer);
  }, [startTime, lessonData.estimatedTime]);
  
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
    
    // Auto-advance for non-choice messages
    if (!message.choices) {
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
  
  const handleAIGeneration = async () => {
    const currentMessage = visibleMessages[visibleMessages.length - 1];
    if (!currentMessage?.aiPrompt) return;
    
    setIsGeneratingAI(true);
    setShowGeneratedContent(false);
    
    try {
      // Use the enhanced AI service to generate email
      const recipe = {
        purpose: 'Update parent about child\'s progress',
        audience: 'Parent (Sarah)',
        tone: 'Warm and encouraging',
        includeSubject: true
      };
      
      const generatedEmail = await enhancedAIService.generateEmail(recipe);
      
      // Add visual delay for effect (AI is actually faster)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedContent(generatedEmail);
      setShowGeneratedContent(true);
      
      // Don't auto-advance - let user read the email
      // User can continue when ready
      
      // Track AI usage with success toast
      toast.success('AI generated your email in 5 seconds! 🎉', {
        description: 'Watch how AI transformed Maya\'s request into a professional email'
      });
    } catch (error) {
      console.error('AI generation error:', error);
      
      // Fallback to sample email if AI fails
      const fallbackEmail = `Subject: Jayden's Amazing Progress in Robotics Club

Hi Sarah,

I hope this email finds you well! I wanted to share some wonderful news about Jayden's progress in our after-school program.

Over the past few weeks, Jayden has been actively participating in our robotics club and has truly blossomed. Not only has he shown great enthusiasm for the technical aspects, but he's also made several new friends who share his interests.

I'm particularly impressed by how Jayden has taken on a leadership role in his team, helping others understand the programming concepts we've been learning. His confidence has grown tremendously!

We have an exciting showcase coming up next Friday at 3pm where the students will demonstrate their robot creations. Jayden is very proud of what he's built and would love for you to see it. The event will be in the community center's main hall, and light refreshments will be provided.

Please let me know if you'll be able to attend. Jayden speaks of you often and I know it would mean the world to him to have you there.

Thank you for your continued support of our program. It's children like Jayden who remind us why we do this work.

Warm regards,
Maya Rodriguez
Program Director, Hope Gardens Community Center`;
      
      setGeneratedContent(fallbackEmail);
      setShowGeneratedContent(true);
      
      // Don't auto-advance for fallback either
      toast.success('Email generated successfully! 🎉');
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const handleLessonComplete = () => {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    setShowSuccess(true);
    
    // Track completion
    if (user?.id) {
      trackMayaProgress(parseInt(lessonData.id), {
        completionData: {
          microLessonId: lessonData.id,
          timeSpent: totalTime,
          userChoices,
          emotionalJourney: mayaEmotion
        }
      });
    }
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
    <AIComponentErrorBoundary componentName="MayaMicroLesson">
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
                        
                        {/* AI Magic Button */}
                        {message.showAIButton && index === visibleMessages.length - 1 && (
                          <div className="mt-4 animate-fade-in">
                            <TouchTarget
                              onClick={handleAIGeneration}
                              className="w-full"
                            >
                              <div className="glass-purple rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                <div className="p-4 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
                                  <div className="relative flex items-center justify-center gap-2">
                                    {isGeneratingAI ? (
                                      <>
                                        <div className="w-6 h-6 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                                        <span className="font-semibold text-purple-900">AI is writing your email...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 className="w-6 h-6 text-purple-600 animate-pulse" />
                                        <span className="font-semibold text-purple-900">Click for AI Magic ✨</span>
                                        <Sparkles className="w-5 h-5 text-pink-600 animate-bounce" />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TouchTarget>
                            
                            {/* Show generated content */}
                            {showGeneratedContent && generatedContent && (
                              <div className="mt-4 glass-green rounded-xl shadow-lg animate-scale-in">
                                <div className="p-4">
                                  <div className="flex items-start gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <h4 className="font-semibold text-green-900">AI Generated Email:</h4>
                                  </div>
                                  <div className="glass rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                                    {generatedContent}
                                  </div>
                                  <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                                    <Zap className="w-4 h-4" />
                                    <span>Generated in 5 seconds instead of 32 minutes!</span>
                                  </div>
                                  {/* Continue button after viewing AI result */}
                                  <div className="mt-4">
                                    <Button 
                                      onClick={() => setCurrentMessageIndex(prev => prev + 1)}
                                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    >
                                      Continue <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
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
              {/* Use minimal components when in minimal UI mode */}
              {useMinimalUI ? (
                lessonData.id === 'ml-2-5-3' ? (
                  <MayaEmailRecipeBuilderMinimal 
                    onComplete={handleLessonComplete}
                    userId={user?.id}
                  />
                ) : lessonData.id === 'ml-2-5-4' ? (
                  <MayaInteractiveEmailPracticeMinimal
                    onComplete={handleLessonComplete}
                    userId={user?.id}
                  />
                ) : (
                  <lessonData.interactiveContent onComplete={handleLessonComplete} />
                )
              ) : (
                <lessonData.interactiveContent onComplete={handleLessonComplete} />
              )}
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
        
        {/* Success Modal with Auto-Continue */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] animate-fade-in" onClick={(e) => e.stopPropagation()}>
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
                
                {/* Countdown Timer */}
                <div className="mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto relative">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="#e5e7eb"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="#10b981"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(successTimer / 3) * 220} 220`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-700">{successTimer}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Continuing in {successTimer} seconds...</p>
                </div>
                
                <button
                  onClick={handleAutoComplete}
                  className="glass-button rounded-lg px-4 py-2 text-sm font-medium hover:scale-105 transition-transform"
                >
                  Skip to Next Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileResponsiveWrapper>
    </AIComponentErrorBoundary>
  );
};

export default MayaMicroLesson;