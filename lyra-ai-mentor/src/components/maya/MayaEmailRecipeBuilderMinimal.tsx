import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight, Check, Heart, Target, Users } from 'lucide-react';
import { useAdaptiveUI } from '../../hooks/useAdaptiveUI';
import '../../styles/minimal-ui.css';

interface RecipeBuilderMinimalProps {
  onComplete: () => void;
  userId?: string;
}

interface RecipeIngredient {
  type: 'purpose' | 'audience' | 'tone';
  value: string;
  description: string;
}

const MayaEmailRecipeBuilderMinimal: React.FC<RecipeBuilderMinimalProps> = ({
  onComplete,
  userId
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'purpose' | 'audience' | 'tone' | 'review' | 'complete'>('intro');
  const [recipe, setRecipe] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const [showNextAction, setShowNextAction] = useState(false);

  const adaptiveUI = useAdaptiveUI(userId);

  const purposes = [
    { id: 'inform', label: 'Inform parents about progress', description: 'Share updates about their child' },
    { id: 'request', label: 'Request help or information', description: 'Ask for something specific' },
    { id: 'thank', label: 'Thank and appreciate', description: 'Express gratitude for support' },
    { id: 'invite', label: 'Invite to participate', description: 'Welcome to events or programs' }
  ];

  const audiences = [
    { id: 'parent', label: 'Busy parent', description: 'Needs clear, quick information' },
    { id: 'donor', label: 'Community supporter', description: 'Values impact and transparency' },
    { id: 'volunteer', label: 'Active volunteer', description: 'Committed to helping' },
    { id: 'board', label: 'Board member', description: 'Needs strategic overview' }
  ];

  const tones = [
    { id: 'warm', label: 'Warm and friendly', description: 'Personal and caring approach' },
    { id: 'professional', label: 'Professional but approachable', description: 'Respectful and clear' },
    { id: 'urgent', label: 'Urgent but caring', description: 'Important without being pushy' },
    { id: 'celebratory', label: 'Celebratory and joyful', description: 'Sharing good news and achievements' }
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return "Hi! I'm Maya. Let's build your first email recipe together. Think of this as cooking - we need just 3 simple ingredients to create something amazing.";
      case 'purpose':
        return "First ingredient: PURPOSE. What do you want this email to accomplish? Choose what feels right for your situation:";
      case 'audience':
        return "Second ingredient: AUDIENCE. Who will read this email? Understanding your reader helps us choose the right approach:";
      case 'tone':
        return "Final ingredient: TONE. How should this email feel to the reader? The right tone makes all the difference:";
      case 'review':
        return `Perfect! Your email recipe is complete:\n\n🎯 Purpose: ${recipe.purpose}\n👥 Audience: ${recipe.audience}\n❤️ Tone: ${recipe.tone}\n\nThis recipe will help you write emails that connect with your readers and get results!`;
      case 'complete':
        return "You've mastered the Email Recipe Method! Maya uses this exact approach to write professional emails in minutes instead of hours.";
      default:
        return "";
    }
  };

  const getCurrentOptions = () => {
    switch (currentStep) {
      case 'purpose':
        return purposes;
      case 'audience':
        return audiences;
      case 'tone':
        return tones;
      default:
        return [];
    }
  };

  // Typewriter effect
  useEffect(() => {
    const content = getStepContent();
    if (!content) return;

    setIsTyping(true);
    setTypedContent('');
    setShowNextAction(false);

    const wordCount = content.split(' ').length;
    adaptiveUI.startReading(wordCount);

    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < content.length) {
        const char = content[charIndex];
        const speed = adaptiveUI.getTypewriterSpeed(char, charIndex);

        setTypedContent(prev => prev + char);
        charIndex++;

        setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
        setShowNextAction(true);
        adaptiveUI.endReading();
      }
    };

    setTimeout(typeNextChar, 500);
  }, [currentStep, adaptiveUI]);

  const handleOptionSelect = useCallback((optionId: string, optionLabel: string) => {
    adaptiveUI.trackInteraction({
      type: 'click',
      timestamp: Date.now(),
      target: `recipe-${currentStep}-${optionId}`
    });

    setRecipe(prev => ({ ...prev, [currentStep]: optionLabel }));

    // Progress to next step
    setTimeout(() => {
      if (currentStep === 'purpose') {
        setCurrentStep('audience');
      } else if (currentStep === 'audience') {
        setCurrentStep('tone');
      } else if (currentStep === 'tone') {
        setCurrentStep('review');
      }
    }, 500);
  }, [currentStep, adaptiveUI]);

  const handleContinue = useCallback(() => {
    adaptiveUI.trackInteraction({
      type: 'click',
      timestamp: Date.now(),
      target: 'continue-button'
    });

    if (currentStep === 'intro') {
      setCurrentStep('purpose');
    } else if (currentStep === 'review') {
      setCurrentStep('complete');
    } else if (currentStep === 'complete') {
      onComplete();
    }
  }, [currentStep, adaptiveUI, onComplete]);

  const progress = (() => {
    const stepOrder = ['intro', 'purpose', 'audience', 'tone', 'review', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    return ((currentIndex + 1) / stepOrder.length) * 100;
  })();

  return (
    <div className={`minimal-ui min-h-screen ${adaptiveUI.getAmbientClass()}`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="minimal-progress mb-8">
          <div 
            className="minimal-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main content */}
        <div className="minimal-card fade-in">
          {/* Header */}
          <div className="text-hint mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Email Recipe Builder • Step {['intro', 'purpose', 'audience', 'tone', 'review', 'complete'].indexOf(currentStep) + 1} of 6
          </div>

          {/* Content with typewriter effect */}
          <div className="text-primary mb-6">
            <span className="minimal-typewriter">
              {typedContent}
              {isTyping && <span className="minimal-typewriter-cursor" />}
            </span>
          </div>

          {/* Interactive area */}
          {showNextAction && (
            <div className="slide-up">
              {/* Options for selection steps */}
              {(currentStep === 'purpose' || currentStep === 'audience' || currentStep === 'tone') && (
                <div className="space-y-3 mb-6">
                  {getCurrentOptions().map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id, option.label)}
                      className="minimal-button-secondary w-full text-left p-4 rounded-lg transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {currentStep === 'purpose' && <Target className="w-5 h-5 text-purple-600" />}
                          {currentStep === 'audience' && <Users className="w-5 h-5 text-blue-600" />}
                          {currentStep === 'tone' && <Heart className="w-5 h-5 text-pink-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-primary mb-1">{option.label}</div>
                          <div className="text-hint text-sm">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Continue button for other steps */}
              {(currentStep === 'intro' || currentStep === 'review' || currentStep === 'complete') && (
                <div className="flex justify-end">
                  <button
                    onClick={handleContinue}
                    className="minimal-button"
                  >
                    {currentStep === 'complete' ? (
                      <>
                        Complete
                        <Check className="inline-block w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        {currentStep === 'intro' ? 'Start Building' : 'Continue'}
                        <ChevronRight className="inline-block w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Recipe summary for review step */}
          {currentStep === 'review' && Object.keys(recipe).length === 3 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg slide-up">
              <h3 className="font-medium text-green-900 mb-3">Your Email Recipe:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm"><strong>Purpose:</strong> {recipe.purpose}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm"><strong>Audience:</strong> {recipe.audience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  <span className="text-sm"><strong>Tone:</strong> {recipe.tone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Completion celebration */}
          {currentStep === 'complete' && (
            <div className="mt-6 p-6 minimal-card slide-up" style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
              <div className="text-center">
                <Check className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Recipe Master!</h3>
                <p className="opacity-90">
                  You've learned Maya's secret to writing effective emails quickly and confidently.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MayaEmailRecipeBuilderMinimal;