import React, { useState } from 'react';
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
  MessageCircle
} from 'lucide-react';
import '@/styles/glassmorphism.css';

interface RecipeBuilderProps {
  onComplete: () => void;
}

interface RecipeIngredient {
  type: 'purpose' | 'audience' | 'tone';
  value: string;
  icon: React.ReactNode;
}

export const MayaEmailRecipeBuilder: React.FC<RecipeBuilderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'purpose' | 'audience' | 'tone' | 'preview' | 'success'>('intro');
  const [recipe, setRecipe] = useState<Record<string, string>>({});
  const [showMayaHelp, setShowMayaHelp] = useState(true);
  const [mayaMessage, setMayaMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const purposes = [
    { id: 'inform', label: 'Inform/Update', example: 'Share news or information' },
    { id: 'request', label: 'Request/Ask', example: 'Need something from recipient' },
    { id: 'thank', label: 'Thank/Appreciate', example: 'Express gratitude' },
    { id: 'invite', label: 'Invite/Welcome', example: 'Invite to event or program' }
  ];
  
  const audiences = [
    { id: 'parent', label: 'Parent/Guardian', example: 'Busy parent needing info' },
    { id: 'donor', label: 'Donor/Supporter', example: 'Someone who gives to Hope Gardens' },
    { id: 'volunteer', label: 'Volunteer', example: 'Community member who helps' },
    { id: 'board', label: 'Board Member', example: 'Leadership and oversight' }
  ];
  
  const tones = [
    { id: 'warm-professional', label: 'Warm & Professional', example: 'Friendly but respectful' },
    { id: 'urgent-caring', label: 'Urgent but Caring', example: 'Important but not pushy' },
    { id: 'grateful-hopeful', label: 'Grateful & Hopeful', example: 'Thankful and optimistic' },
    { id: 'clear-supportive', label: 'Clear & Supportive', example: 'Direct but helpful' }
  ];
  
  const handleSelection = (type: string, value: string) => {
    setRecipe(prev => ({ ...prev, [type]: value }));
    
    // Maya responds to selection
    showMayaResponse(type, value);
    
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
    const purpose = purposes.find(p => p.id === recipe.purpose)?.label;
    const audience = audiences.find(a => a.id === recipe.audience)?.label;
    const tone = tones.find(t => t.id === recipe.tone)?.label;
    
    return `Write an email to ${audience} with a ${tone} tone to ${purpose}`;
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
                        "Let's build the recipe together! I'll show you exactly how I use it to write emails in 5 minutes instead of 32."
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
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Step 1: What's Your Purpose?</h3>
              <p className="text-sm text-gray-600">What do you need this email to do?</p>
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
              {purposes.map(purpose => (
                <TouchTarget
                  key={purpose.id}
                  onClick={() => handleSelection('purpose', purpose.id)}
                  className="w-full"
                >
                  <div className={`glass-card rounded-xl transition-all hover:shadow-md cursor-pointer transform hover:scale-[1.02] ${
                    recipe.purpose === purpose.id ? 'glass-purple border-purple-300 shadow-md' : ''
                  }`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{purpose.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{purpose.example}</p>
                        </div>
                        {recipe.purpose === purpose.id && (
                          <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </TouchTarget>
              ))}
            </div>
          </div>
        );
        
      case 'audience':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Step 2: Who's Your Audience?</h3>
              <p className="text-sm text-gray-600">Who will read this email?</p>
            </div>
            
            {/* Show previous selection */}
            {recipe.purpose && (
              <div className="glass-purple rounded-lg p-3 mb-3 animate-fade-in">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700">Purpose:</span>
                  <span className="font-semibold text-purple-900">
                    {purposes.find(p => p.id === recipe.purpose)?.label}
                  </span>
                </div>
              </div>
            )}
            
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
              {audiences.map(audience => (
                <TouchTarget
                  key={audience.id}
                  onClick={() => handleSelection('audience', audience.id)}
                  className="w-full"
                >
                  <div className={`glass-card rounded-xl transition-all hover:shadow-md cursor-pointer transform hover:scale-[1.02] ${
                    recipe.audience === audience.id ? 'glass-purple border-purple-300 shadow-md' : ''
                  }`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{audience.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{audience.example}</p>
                        </div>
                        {recipe.audience === audience.id && (
                          <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </TouchTarget>
              ))}
            </div>
          </div>
        );
        
      case 'tone':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Heart className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Step 3: Choose Your Tone</h3>
              <p className="text-sm text-gray-600">How do you want your email to feel?</p>
            </div>
            
            {/* Show previous selections */}
            <div className="space-y-2">
              {recipe.purpose && (
                <div className="glass-purple rounded-lg p-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700">Purpose:</span>
                    <span className="font-semibold text-purple-900">
                      {purposes.find(p => p.id === recipe.purpose)?.label}
                    </span>
                  </div>
                </div>
              )}
              {recipe.audience && (
                <div className="glass-purple rounded-lg p-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700">Audience:</span>
                    <span className="font-semibold text-purple-900">
                      {audiences.find(a => a.id === recipe.audience)?.label}
                    </span>
                  </div>
                </div>
              )}
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
              {tones.map(tone => (
                <TouchTarget
                  key={tone.id}
                  onClick={() => handleSelection('tone', tone.id)}
                  className="w-full"
                >
                  <div className={`glass-card rounded-xl transition-all hover:shadow-md cursor-pointer transform hover:scale-[1.02] ${
                    recipe.tone === tone.id ? 'glass-purple border-purple-300 shadow-md' : ''
                  }`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{tone.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{tone.example}</p>
                        </div>
                        {recipe.tone === tone.id && (
                          <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </TouchTarget>
              ))}
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Your Email Recipe is Ready!</h3>
              <p className="text-sm text-gray-600">Here's what you'll tell the AI:</p>
            </div>
            
            <div className="glass-purple rounded-xl shadow-lg">
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Purpose:</span>
                    <Badge variant="secondary">
                      {purposes.find(p => p.id === recipe.purpose)?.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Audience:</span>
                    <Badge variant="secondary">
                      {audiences.find(a => a.id === recipe.audience)?.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Tone:</span>
                    <Badge variant="secondary">
                      {tones.find(t => t.id === recipe.tone)?.label}
                    </Badge>
                  </div>
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
                  Maya says: "Perfect! This recipe will help AI understand exactly what you need. Ready to see the magic?"
                </p>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                setCurrentStep('success');
                setTimeout(onComplete, 2000);
              }}
            >
              Complete Recipe!
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </button>
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
              You've just learned Maya's secret to 5-minute emails!
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">+25 Confidence Points</span>
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

export default MayaEmailRecipeBuilder;