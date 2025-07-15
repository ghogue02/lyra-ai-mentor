import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchTarget, MobileResponsiveWrapper } from '@/components/ui/mobile-responsive-wrapper';
import { 
  Target, 
  Users, 
  Heart,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Wand2,
  Eye,
  Copy,
  Zap
} from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { toast } from 'sonner';
import '@/styles/glassmorphism.css';

interface RecipeBuilderProps {
  onComplete: () => void;
}

interface RecipeIngredient {
  type: 'purpose' | 'audience' | 'tone';
  value: string;
  label: string;
  emoji: string;
}

export const MayaEmailRecipeBuilderEnhanced: React.FC<RecipeBuilderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'purpose' | 'audience' | 'tone' | 'preview' | 'ai-demo' | 'success'>('intro');
  const [recipe, setRecipe] = useState<RecipeIngredient[]>([]);
  const [showMayaHelp, setShowMayaHelp] = useState(true);
  const [mayaMessage, setMayaMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [showEmailReveal, setShowEmailReveal] = useState(false);
  
  const purposes = [
    { id: 'inform', label: 'Inform/Update', example: 'Share news or information', emoji: '📢' },
    { id: 'request', label: 'Request/Ask', example: 'Need something from recipient', emoji: '📝' },
    { id: 'thank', label: 'Thank/Appreciate', example: 'Express gratitude', emoji: '💌' },
    { id: 'invite', label: 'Invite/Welcome', example: 'Invite to event or program', emoji: '🎯' }
  ];
  
  const audiences = [
    { id: 'parent', label: 'Parent/Guardian', example: 'Busy parent needing info', emoji: '👨‍👩‍👧' },
    { id: 'donor', label: 'Donor/Supporter', example: 'Someone who gives to Hope Gardens', emoji: '💰' },
    { id: 'volunteer', label: 'Volunteer', example: 'Community member who helps', emoji: '🤝' },
    { id: 'board', label: 'Board Member', example: 'Leadership and oversight', emoji: '📊' }
  ];
  
  const tones = [
    { id: 'warm-professional', label: 'Warm & Professional', example: 'Friendly but respectful', emoji: '🤗' },
    { id: 'urgent-caring', label: 'Urgent but Caring', example: 'Important but not pushy', emoji: '🚨' },
    { id: 'grateful-hopeful', label: 'Grateful & Hopeful', example: 'Thankful and optimistic', emoji: '🙏' },
    { id: 'clear-supportive', label: 'Clear & Supportive', example: 'Direct but helpful', emoji: '💪' }
  ];
  
  // Visual persistence of selected ingredients
  const getSelectedIngredient = (type: string) => {
    return recipe.find(r => r.type === type);
  };
  
  const handleSelection = (type: 'purpose' | 'audience' | 'tone', item: any) => {
    const newIngredient: RecipeIngredient = {
      type,
      value: item.id,
      label: item.label,
      emoji: item.emoji
    };
    
    // Update recipe, replacing existing ingredient of same type
    setRecipe(prev => {
      const filtered = prev.filter(r => r.type !== type);
      return [...filtered, newIngredient];
    });
    
    // Maya responds to selection
    showMayaResponse(type, item.id);
    
    // Auto-advance to next step
    setTimeout(() => {
      if (type === 'purpose') setCurrentStep('audience');
      else if (type === 'audience') setCurrentStep('tone');
      else if (type === 'tone') setCurrentStep('preview');
    }, 1500);
  };
  
  const showMayaResponse = async (type: string, value: string) => {
    const responses = {
      purpose: {
        inform: "Great choice! Keeping people informed builds trust. Now, who needs this information?",
        request: "Perfect! Being clear about what you need saves everyone time. Who can help you?",
        thank: "I love starting with gratitude! Who are we thanking today?",
        invite: "Wonderful! Invitations create connection. Who should we invite?"
      },
      audience: {
        parent: "Parents appreciate clear, caring communication. Let's make sure our tone matches!",
        donor: "Donors want to see their impact. Let's choose a tone that honors their generosity!",
        volunteer: "Volunteers give their time freely. Let's show them how valued they are!",
        board: "Board members need professional clarity. Let's find the right balance!"
      },
      tone: {
        'warm-professional': "Perfect balance! This is my favorite - professional but still human.",
        'urgent-caring': "Yes! You can be urgent without being pushy. Let's see your recipe!",
        'grateful-hopeful': "Beautiful choice! Gratitude and hope are powerful together.",
        'clear-supportive': "Excellent! Clear communication IS supportive communication."
      }
    };
    
    const message = responses[type]?.[value] || "Great choice! Let's continue...";
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsTyping(false);
    
    // Typewriter effect
    for (let i = 0; i <= message.length; i++) {
      setMayaMessage(message.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  
  const generatePrompt = () => {
    const purpose = getSelectedIngredient('purpose');
    const audience = getSelectedIngredient('audience');
    const tone = getSelectedIngredient('tone');
    
    return `Write an email to ${audience?.label} with a ${tone?.label} tone to ${purpose?.label}`;
  };
  
  const handleAIGeneration = async () => {
    setIsGeneratingAI(true);
    setShowEmailReveal(false);
    
    try {
      const purpose = getSelectedIngredient('purpose');
      const audience = getSelectedIngredient('audience');
      const tone = getSelectedIngredient('tone');
      
      const email = await enhancedAIService.generateEmail({
        tone: tone?.value || 'warm-professional',
        recipient: audience?.value || 'parent',
        purpose: purpose?.value || 'inform',
        context: 'Hope Gardens Community Center after-school program',
        keyPoints: [
          'Child showing great progress',
          'Made new friends in robotics club',
          'Upcoming showcase next Friday at 3pm',
          'Invitation to attend'
        ]
      });
      
      setGeneratedEmail(email);
      setShowEmailReveal(true);
      
      toast.success('Email Generated in 5 seconds! ✨', {
        description: 'Maya saved 31 minutes and 55 seconds!',
        duration: 5000
      });
      
    } catch (error) {
      console.error('AI generation failed:', error);
      // Fallback content
      const fallbackEmail = `Dear Sarah,

I hope this message finds you well. I wanted to personally reach out to share some wonderful updates about Jayden's progress in our after-school program at Hope Gardens.

Over the past few weeks, Jayden has truly blossomed. He's been actively participating in our robotics club and has made several new friends who share his interests. His enthusiasm and creativity during our sessions have been absolutely inspiring to witness.

I'm thrilled to invite you to our upcoming showcase next Friday at 3 PM, where Jayden and his team will be presenting their robot design. He's put so much effort into this project, and I know it would mean the world to him to have you there.

Please let me know if you can attend. If you have any questions or would like to discuss Jayden's progress further, I'm always happy to chat.

Thank you for entrusting us with Jayden's after-school care. It's a privilege to be part of his growth journey.

Warm regards,
Maya Rodriguez
Program Director, Hope Gardens Community Center`;
      
      setGeneratedEmail(fallbackEmail);
      setShowEmailReveal(true);
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard!');
  };
  
  const renderStep = () => {
    switch(currentStep) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Maya's Real Email Challenge</h3>
              <p className="text-sm text-gray-600">
                "I need to email a parent about their child's progress, but I'm worried about getting the tone right..."
              </p>
            </div>
            
            {showMayaHelp && (
              <div className="glass-purple rounded-xl shadow-sm">
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-900 font-medium">
                        "Let's build the recipe together! I'll show you exactly how I use AI to write emails in 5 seconds instead of 32 minutes."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                setCurrentStep('purpose');
                showMayaResponse('intro', 'start');
              }}
            >
              Let's Build the Recipe!
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'purpose':
      case 'audience':
      case 'tone':
        const stepConfig = {
          purpose: { items: purposes, icon: Target, title: "What's Your Purpose?", subtitle: "What do you need this email to do?" },
          audience: { items: audiences, icon: Users, title: "Who's Your Audience?", subtitle: "Who will read this email?" },
          tone: { items: tones, icon: Heart, title: "Choose Your Tone", subtitle: "How do you want your email to feel?" }
        };
        
        const config = stepConfig[currentStep];
        const Icon = config.icon;
        const stepNumber = currentStep === 'purpose' ? 1 : currentStep === 'audience' ? 2 : 3;
        
        return (
          <div className="space-y-4">
            {/* Recipe Visualization - Persistent across all steps */}
            {recipe.length > 0 && (
              <div className="glass-purple rounded-xl shadow-sm p-3 animate-fade-in">
                <p className="text-xs font-semibold text-purple-800 mb-2">Your Recipe So Far:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.map((ingredient, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {ingredient.emoji} {ingredient.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-center mb-4">
              <Icon className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Step {stepNumber}: {config.title}</h3>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
            
            {(mayaMessage || isTyping) && (
              <div className="glass-purple rounded-xl shadow-sm mb-4 animate-fade-in">
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      {isTyping ? (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <p className="text-sm text-purple-900 font-medium">{mayaMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {config.items.map(item => {
                const isSelected = getSelectedIngredient(currentStep)?.value === item.id;
                
                return (
                  <TouchTarget
                    key={item.id}
                    onClick={() => handleSelection(currentStep as any, item)}
                    className="w-full"
                  >
                    <div className={`glass-card rounded-xl transition-all hover:shadow-md cursor-pointer transform hover:scale-[1.02] ${
                      isSelected ? 'glass-purple border-purple-300 shadow-md' : ''
                    }`}>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <h4 className="font-medium">{item.label}</h4>
                              <p className="text-xs text-gray-600 mt-1">{item.example}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </TouchTarget>
                );
              })}
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Your Email Recipe is Ready!</h3>
              <p className="text-sm text-gray-600">Time to see the AI magic!</p>
            </div>
            
            <div className="glass-purple rounded-xl shadow-lg">
              <div className="p-6">
                <div className="space-y-3">
                  {recipe.map((ingredient, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-2xl">{ingredient.emoji}</span>
                      <div className="flex-1">
                        <p className="text-xs text-purple-700">{ingredient.type.charAt(0).toUpperCase() + ingredient.type.slice(1)}</p>
                        <p className="font-medium text-purple-900">{ingredient.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 glass rounded-lg shadow-inner">
                  <p className="text-sm text-gray-700 mb-2">Your AI prompt:</p>
                  <p className="text-base font-medium text-purple-900">
                    "{generatePrompt()}"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-green rounded-xl shadow-sm">
              <div className="p-4">
                <p className="text-sm text-green-900 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Maya says: "Perfect recipe! Now watch how AI transforms this into a professional email in just 5 seconds!"
                </p>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('ai-demo')}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              See the AI Magic! ✨
            </button>
          </div>
        );
        
      case 'ai-demo':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Wand2 className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-pulse" />
              <h3 className="text-lg font-semibold">AI Email Generation</h3>
              <p className="text-sm text-gray-600">Watch the magic happen!</p>
            </div>
            
            {!showEmailReveal && !isGeneratingAI && (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-sm text-gray-700 mb-4">Ready to see how AI transforms your recipe into a perfect email?</p>
                <Button
                  onClick={handleAIGeneration}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Email Now!
                </Button>
              </div>
            )}
            
            {isGeneratingAI && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
                  </div>
                  <p className="text-sm font-medium text-purple-900">AI is crafting your perfect email...</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      5 seconds
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            
            {showEmailReveal && (
              <div className="space-y-4 animate-fade-in">
                <div className="glass-green rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Generated Email
                      </p>
                      <Badge className="bg-white/20 text-white border-white/30">
                        Done in 5 sec!
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
                      onClick={handleCopyEmail}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Email
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-3">Time Comparison:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Maya's old way:</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        32 minutes
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">With AI recipe:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Zap className="w-3 h-3 mr-1" />
                        5 seconds
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Time saved:</span>
                        <Badge className="bg-purple-100 text-purple-700">
                          31 min 55 sec!
                        </Badge>
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
                  Amazing! Continue
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Recipe Complete!</h3>
            <p className="text-sm text-gray-600">
              You've mastered Maya's AI email recipe method!
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">+50 Confidence Points</span>
            </div>
            <Badge className="bg-purple-100 text-purple-700">
              <Zap className="w-3 h-3 mr-1" />
              32 min → 5 sec transformation!
            </Badge>
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

export default MayaEmailRecipeBuilderEnhanced;