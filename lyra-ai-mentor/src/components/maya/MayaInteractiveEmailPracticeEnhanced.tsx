import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TouchTarget, MobileResponsiveWrapper } from '@/components/ui/mobile-responsive-wrapper';
import { 
  MessageCircle,
  CheckCircle2,
  Edit3,
  Sparkles,
  Send,
  Heart,
  ChevronRight,
  Lightbulb,
  Wand2,
  Copy,
  Zap,
  ArrowRight,
  Info,
  Target
} from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { toast } from 'sonner';
import '@/styles/glassmorphism.css';

interface EmailPracticeProps {
  onComplete: () => void;
}

interface AITip {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: string;
  example?: string;
}

export const MayaInteractiveEmailPracticeEnhanced: React.FC<EmailPracticeProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learn-ai' | 'build-prompt' | 'see-magic' | 'compare' | 'success'>('intro');
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedTips, setSelectedTips] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const emailContext = {
    recipient: 'Sarah Johnson (parent)',
    situation: 'Her son Jayden has been thriving in the robotics club',
    goal: 'Invite her to the showcase and share his progress',
    keyInfo: {
      childName: 'Jayden',
      activity: 'robotics club',
      achievement: 'Built a working robot with his team',
      event: 'Showcase next Friday at 3pm'
    }
  };
  
  const aiTips: AITip[] = [
    {
      id: 'be-specific',
      icon: <Target className="w-4 h-4" />,
      title: 'Be Specific',
      content: 'Tell AI exactly what you need',
      example: 'Instead of "write an email", say "write a warm email to a parent about their child\'s progress"'
    },
    {
      id: 'provide-context',
      icon: <Info className="w-4 h-4" />,
      title: 'Give Context',
      content: 'Share relevant details',
      example: 'Include names, specific achievements, and event details'
    },
    {
      id: 'set-tone',
      icon: <Heart className="w-4 h-4" />,
      title: 'Set the Tone',
      content: 'Describe how you want it to feel',
      example: 'Use words like "warm", "professional", "encouraging", "grateful"'
    },
    {
      id: 'state-purpose',
      icon: <MessageCircle className="w-4 h-4" />,
      title: 'State Your Purpose',
      content: 'Be clear about the email\'s goal',
      example: 'To inform, to invite, to thank, or to request'
    }
  ];
  
  // Timer for comparison
  useEffect(() => {
    if (currentStep === 'see-magic' && !generatedEmail) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 0.1);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [currentStep, generatedEmail]);
  
  const handleTipToggle = (tipId: string) => {
    setSelectedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };
  
  const buildSuggestedPrompt = () => {
    let prompt = 'Write an email to ';
    
    if (selectedTips.includes('be-specific')) {
      prompt += 'parent Sarah Johnson about her son Jayden\'s progress in our robotics club. ';
    } else {
      prompt += 'a parent about their child. ';
    }
    
    if (selectedTips.includes('provide-context')) {
      prompt += 'Mention that Jayden built a working robot with his team and has made new friends. ';
    }
    
    if (selectedTips.includes('set-tone')) {
      prompt += 'Use a warm, encouraging, and professional tone. ';
    }
    
    if (selectedTips.includes('state-purpose')) {
      prompt += 'The purpose is to share his achievements and invite her to our showcase next Friday at 3pm.';
    }
    
    return prompt.trim();
  };
  
  const handleAIGeneration = async () => {
    setIsGeneratingAI(true);
    const startTime = Date.now();
    
    try {
      const email = await enhancedAIService.generateEmail({
        tone: 'warm and professional',
        recipient: 'parent',
        purpose: 'share progress and invite',
        context: userPrompt || buildSuggestedPrompt(),
        keyPoints: [
          'Jayden built a working robot',
          'Made new friends in robotics club',
          'Showcase next Friday at 3pm',
          'Personal invitation to attend'
        ]
      });
      
      const endTime = Date.now();
      const actualTime = (endTime - startTime) / 1000;
      
      setGeneratedEmail(email);
      setTimeElapsed(actualTime);
      
      toast.success(`Email generated in ${actualTime.toFixed(1)} seconds! ✨`, {
        description: 'AI understood your recipe perfectly!',
        duration: 5000
      });
      
    } catch (error) {
      console.error('AI generation failed:', error);
      const fallbackEmail = `Dear Sarah,

I hope this email finds you well. I'm writing with some wonderful news about Jayden's progress in our robotics club at Hope Gardens Community Center.

Over the past few weeks, Jayden has truly excelled. He worked collaboratively with his team to build a fully functioning robot - their creativity and problem-solving skills have been remarkable to witness. Beyond the technical achievements, I'm delighted to share that Jayden has formed strong friendships with his teammates.

I'd like to personally invite you to our Robotics Showcase next Friday at 3 PM. The students will be presenting their projects, and Jayden is excited to show you what he's created. Your presence would mean so much to him.

The showcase will be held in our main activity room, and light refreshments will be served. Please let me know if you can attend - we'd love to celebrate Jayden's achievements with you.

Thank you for your continued support of Jayden's participation in our program. It's a joy to watch him grow and thrive.

Warm regards,
Maya Rodriguez
Program Director`;
      
      setGeneratedEmail(fallbackEmail);
      setTimeElapsed(4.7); // Simulated time
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const renderStep = () => {
    switch(currentStep) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn the AI Magic!</h3>
              <p className="text-sm text-gray-600">
                Let's discover HOW to use AI to write amazing emails
              </p>
            </div>
            
            <div className="glass-purple rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-900 font-medium">
                      "The secret isn't just using AI - it's knowing HOW to talk to it. Let me teach you my 4 magic tips!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('learn-ai')}
            >
              Teach Me the Magic!
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'learn-ai':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Maya's 4 AI Magic Tips</h3>
              <p className="text-sm text-gray-600">Click each tip to add it to your recipe!</p>
            </div>
            
            <div className="space-y-3">
              {aiTips.map((tip) => {
                const isSelected = selectedTips.includes(tip.id);
                
                return (
                  <TouchTarget
                    key={tip.id}
                    onClick={() => handleTipToggle(tip.id)}
                    className="w-full"
                  >
                    <div className={`glass-card rounded-xl transition-all cursor-pointer transform hover:scale-[1.02] ${
                      isSelected ? 'glass-purple border-purple-300 shadow-md' : ''
                    }`}>
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tip.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              {tip.title}
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">{tip.content}</p>
                            {tip.example && (
                              <p className="text-xs text-purple-700 mt-2 italic">
                                Example: {tip.example}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TouchTarget>
                );
              })}
            </div>
            
            {selectedTips.length > 0 && (
              <div className="glass-green rounded-xl p-3 animate-fade-in">
                <p className="text-xs font-semibold text-green-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {selectedTips.length} tip{selectedTips.length !== 1 ? 's' : ''} selected - you're learning fast!
                </p>
              </div>
            )}
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('build-prompt')}
            >
              Build My AI Prompt
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'build-prompt':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Edit3 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Build Your AI Prompt</h3>
              <p className="text-sm text-gray-600">Apply what you learned!</p>
            </div>
            
            <div className="glass-blue rounded-xl shadow-sm p-4">
              <h4 className="text-sm font-semibold mb-2">Your Scenario:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>To:</strong> {emailContext.recipient}</p>
                <p><strong>Situation:</strong> {emailContext.situation}</p>
                <p><strong>Goal:</strong> {emailContext.goal}</p>
              </div>
            </div>
            
            {selectedTips.length > 0 && (
              <div className="glass-purple rounded-xl p-3">
                <p className="text-xs font-semibold text-purple-800 mb-2">
                  Based on your selected tips, try this prompt:
                </p>
                <p className="text-sm text-purple-700 italic">
                  "{buildSuggestedPrompt()}"
                </p>
              </div>
            )}
            
            <div className="glass-card rounded-xl p-4">
              <label className="text-sm font-semibold block mb-2">
                Write your AI prompt:
              </label>
              <textarea
                placeholder={selectedTips.length > 0 
                  ? "Use the suggestion above or write your own..." 
                  : "Tell AI what kind of email you want..."}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full min-h-[100px] resize-none glass-input rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Include who, what, why, and how you want it to sound
              </p>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                if (!userPrompt) {
                  setUserPrompt(buildSuggestedPrompt());
                }
                setCurrentStep('see-magic');
              }}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Generate with AI!
            </button>
          </div>
        );
        
      case 'see-magic':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-pulse" />
              <h3 className="text-lg font-semibold">Watch the Magic!</h3>
            </div>
            
            {!generatedEmail && !isGeneratingAI && (
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="glass-purple rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-purple-900">Your AI Prompt:</p>
                  <p className="text-xs text-purple-700 mt-1 italic">"{userPrompt}"</p>
                </div>
                <Button
                  onClick={handleAIGeneration}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Email Now!
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Time elapsed: {timeElapsed.toFixed(1)}s
                </p>
              </div>
            )}
            
            {isGeneratingAI && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
                  </div>
                  <p className="text-sm font-medium text-purple-900">AI is writing your email...</p>
                  <p className="text-xs text-gray-500">Time: {timeElapsed.toFixed(1)}s</p>
                </div>
              </div>
            )}
            
            {generatedEmail && (
              <div className="space-y-4 animate-fade-in">
                <div className="glass-green rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        AI Generated Email
                      </p>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {timeElapsed.toFixed(1)} seconds!
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {generatedEmail}
                    </pre>
                  </div>
                  <div className="p-3 bg-gray-50 border-t">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedEmail);
                        toast.success('Email copied!');
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Email
                    </Button>
                  </div>
                </div>
                
                <button 
                  className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                  onClick={() => setCurrentStep('compare')}
                >
                  See Time Comparison
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        );
        
      case 'compare':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">The Power of AI!</h3>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h4 className="font-semibold text-center mb-4">Time Comparison</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">Without AI (Maya's old way)</p>
                    <p className="text-sm text-red-700">Writing, rewriting, second-guessing...</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-300">
                    32 minutes
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div>
                    <p className="font-medium text-green-900">With AI (Your way!)</p>
                    <p className="text-sm text-green-700">Clear prompt → Perfect email</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    <Zap className="w-3 h-3 mr-1" />
                    {timeElapsed.toFixed(1)} seconds
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-900 mb-1">
                      {(1920 - timeElapsed).toFixed(0)} seconds saved!
                    </p>
                    <p className="text-sm text-purple-700">
                      That's over 31 minutes for what really matters
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-purple rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-900 font-medium">
                      "You did it! You've learned the secret - it's not just using AI, it's knowing HOW to guide it. You're ready!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                setCurrentStep('success');
                setTimeout(onComplete, 2000);
              }}
            >
              Complete Lesson!
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in shadow-lg">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold">AI Master Unlocked!</h3>
            <p className="text-sm text-gray-600">
              You know the secret to AI email magic!
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-medium">+75 Confidence Points</span>
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                <Zap className="w-3 h-3 mr-1" />
                Email Expert Achievement
              </Badge>
            </div>
          </div>
        );
    }
  };
  
  return (
    <MobileResponsiveWrapper maxWidth="sm" padding="none">
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-full max-w-md">
          {renderStep()}
        </div>
      </div>
    </MobileResponsiveWrapper>
  );
};

export default MayaInteractiveEmailPracticeEnhanced;