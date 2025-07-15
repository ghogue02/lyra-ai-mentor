import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Check, ArrowLeft, Heart, Sparkles, Zap } from 'lucide-react';
import { useAdaptiveUI } from '../../hooks/useAdaptiveUI';
import ProactiveAssistant from '../ui/ProactiveAssistant';
import '../../styles/minimal-ui.css';

interface MayaMicroLessonMinimalProps {
  lessonId: string;
  title: string;
  description: string;
  scenario: string;
  onComplete?: (data: any) => void;
  onBack?: () => void;
  userId?: string;
}

interface LessonStep {
  id: string;
  type: 'intro' | 'learn' | 'practice' | 'apply' | 'reflect';
  content: string;
  prompt?: string;
  hints?: string[];
  successCriteria?: string[];
}

const MayaMicroLessonMinimal: React.FC<MayaMicroLessonMinimalProps> = ({
  lessonId,
  title,
  description,
  scenario,
  onComplete,
  onBack,
  userId
}) => {
  console.log('MayaMicroLessonMinimal props:', { lessonId, title, description, scenario: scenario?.slice(0, 100) });
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const [showNextAction, setShowNextAction] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced adaptive UI with fallbacks
  const adaptiveUIRaw = useAdaptiveUI(userId);
  
  // Create safe wrapper with fallbacks
  const adaptiveUI = React.useMemo(() => {
    if (adaptiveUIRaw) {
      return adaptiveUIRaw;
    }
    
    // Fallback implementation
    return {
      startReading: () => {},
      endReading: () => {},
      getTypewriterSpeed: (char: string, position: number) => {
        // Natural storytelling rhythm
        let speed = 45 + Math.random() * 25; // 45-70ms comfortable pace
        if (['.', '!', '?'].includes(char)) speed += 350; // Storyteller's breath
        if ([',', ';', ':'].includes(char)) speed += 150; // Natural speech pauses
        return speed;
      },
      getAmbientClass: () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'ambient-morning';
        if (hour >= 12 && hour < 17) return 'ambient-afternoon';
        return 'ambient-evening';
      },
      trackInteraction: () => {},
      proactiveHelp: { enabled: false, suggestions: [], dismiss: () => {} },
      shouldSimplify: false,
      shouldSlowDown: false,
      shouldHighlightProgress: false,
      emotionalState: 'neutral' as const,
      engagementLevel: 'medium' as const
    };
  }, [adaptiveUIRaw]);

  // Dynamic lesson steps based on actual lesson content
  const steps: LessonStep[] = React.useMemo(() => {
    console.log('Building steps with:', { lessonId, title, description, scenario: scenario?.slice(0, 50) });
    
    // Ensure we have valid props
    const safeTitle = title || 'Minimal Lesson';
    const safeDescription = description || 'Experience our clean, focused learning interface';
    const safeScenario = scenario || 'This is a demonstration of the minimal UI approach to learning.';
    
    // If this is a real Maya lesson, use condensed real content
    if (lessonId && lessonId.includes('ml-2-5')) {
      return [
        {
          id: 'intro',
          type: 'intro',
          content: `Welcome! This is ${safeTitle} in minimal mode. ${safeDescription}`,
          prompt: 'Ready to experience this lesson?'
        },
        {
          id: 'core',
          type: 'learn',
          content: safeScenario.slice(0, 200) + (safeScenario.length > 200 ? '...' : ''),
          prompt: 'What key insight do you take from this?'
        },
        {
          id: 'apply',
          type: 'apply',
          content: `You've learned the essence of ${safeTitle}. Now let's put it into practice with focused action.`,
          prompt: 'How will you apply this learning?'
        }
      ];
    }
    
    // Robust fallback steps that always work
    return [
      {
        id: 'intro',
        type: 'intro',
        content: `Hi! I'm Maya Rodriguez from Hope Gardens Community Center. Welcome to ${safeTitle} in our minimal UI mode.`,
        prompt: 'Ready to begin this focused learning experience?'
      },
      {
        id: 'learn',
        type: 'learn',
        content: `${safeDescription} This clean interface helps you focus on what matters most - learning and growth without distractions.`,
        prompt: 'What do you think about this approach?'
      },
      {
        id: 'reflect',
        type: 'reflect',
        content: 'You\'ve experienced our minimal UI approach. Every element is designed to support your learning journey with clarity and purpose.',
        prompt: 'What\'s one thing you appreciated about this experience?'
      }
    ];
  }, [lessonId, title, description, scenario]);
  
  console.log('Final steps array:', steps);

  const currentStepData = steps[currentStep];
  
  console.log('Current step data:', {
    currentStep,
    totalSteps: steps.length,
    currentStepData,
    stepsArray: steps
  });

  // Enhanced typewriter effect with better error handling
  useEffect(() => {
    console.log('Typewriter useEffect triggered:', {
      currentStep,
      currentStepData: currentStepData,
      hasContent: !!currentStepData?.content,
      content: currentStepData?.content?.slice(0, 50)
    });
    
    if (!currentStepData?.content) {
      console.log('ERROR: No content for step:', currentStep, currentStepData);
      console.log('Available steps:', steps);
      return;
    }
    
    setIsTyping(true);
    setTypedContent('');
    setShowNextAction(false);
    
    const content = currentStepData.content;
    const wordCount = content.split(' ').length;
    
    console.log('Starting typewriter for:', content.slice(0, 50) + '...');
    
    // Start reading tracking
    if (adaptiveUI?.startReading) {
      adaptiveUI.startReading(wordCount);
    }
    
    let charIndex = 0;
    let isCancelled = false;
    
    const typeNextChar = () => {
      if (isCancelled || charIndex >= content.length) {
        setIsTyping(false);
        setShowNextAction(true);
        if (adaptiveUI?.endReading) {
          adaptiveUI.endReading();
        }
        console.log('Typewriter complete');
        return;
      }
      
      const char = content[charIndex];
      
      // Update content using slice for better performance and accuracy
      setTypedContent(content.slice(0, charIndex + 1));
      charIndex++;
      
      // Natural storytelling rhythm
      const prevChar = charIndex > 1 ? content[charIndex - 2] : '';
      const nextChar = charIndex < content.length ? content[charIndex] : '';
      
      // Get adaptive speed if available
      let speed = 50; // Comfortable storytelling pace
      
      if (adaptiveUI?.getTypewriterSpeed) {
        try {
          // Use adaptive speed but constrain to storytelling range
          speed = Math.max(40, Math.min(100, adaptiveUI.getTypewriterSpeed(char, charIndex)));
        } catch (e) {
          console.warn('Adaptive speed error:', e);
          speed = 50; // Fallback to storytelling pace
        }
      }
      
      // Natural storytelling rhythm adjustments
      speed += Math.random() * 20; // 40-70ms natural variation
      
      // Dramatic storytelling pauses
      if (['.', '!', '?'].includes(char)) {
        speed += 350; // Long pause at sentence end (like breathing)
      } else if ([',', ';'].includes(char)) {
        speed += 180; // Medium pause for natural speech
      } else if ([':'].includes(char)) {
        speed += 250; // Build anticipation
      } else if (char === '-' && nextChar === ' ') {
        speed += 200; // Dramatic dash pause
      }
      
      // Emphasize important words
      if (char === char.toUpperCase() && char !== char.toLowerCase() && prevChar === ' ') {
        speed += 60; // Slow down for emphasis
      }
      
      // Emotional pacing based on content context
      const context = content.slice(Math.max(0, charIndex - 30), charIndex + 30).toLowerCase();
      if (context.includes('amazing') || context.includes('wonderful') || context.includes('excited')) {
        speed *= 0.85; // Slightly faster for excitement
      } else if (context.includes('challenge') || context.includes('struggle') || context.includes('time')) {
        speed *= 1.2; // Slower for serious moments
      } else if (context.includes('transformation') || context.includes('discovery') || context.includes('secret')) {
        speed *= 1.1; // Thoughtful pace for important revelations
      }
      
      // Add micro-pauses for natural rhythm
      if (charIndex % 12 === 0) {
        speed += Math.random() * 25; // Random breath-like pauses
      }
      
      // Formatting pauses
      if (char === '\n') {
        speed += 250; // Pause between paragraphs
      } else if (char === '•') {
        speed += 100; // Brief pause before bullet points
      }
      
      typewriterRef.current = setTimeout(typeNextChar, speed);
    };
    
    // Start typing immediately
    typewriterRef.current = setTimeout(typeNextChar, 50); // Minimal delay
    
    return () => {
      isCancelled = true;
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [currentStep, currentStepData, adaptiveUI]);

  // Track user interactions
  const handleInteraction = useCallback((type: string, target?: string) => {
    adaptiveUI.trackInteraction({
      type: type as any,
      timestamp: Date.now(),
      target
    });
  }, [adaptiveUI]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(e.target.value);
    handleInteraction('type', 'response-input');
  };

  // Handle step progression
  const handleNextStep = useCallback(() => {
    handleInteraction('click', 'next-step');
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setUserResponse('');
    } else {
      setLessonComplete(true);
      if (onComplete) {
        onComplete({
          lessonId,
          responses: steps.map((step, idx) => ({
            step: step.id,
            response: idx === currentStep ? userResponse : ''
          })),
          emotionalState: adaptiveUI.emotionalState,
          engagementLevel: adaptiveUI.engagementLevel
        });
      }
    }
  }, [currentStep, steps.length, userResponse, lessonId, onComplete, adaptiveUI, handleInteraction]);

  // Auto-focus input when shown
  useEffect(() => {
    if (showNextAction && currentStepData.prompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNextAction, currentStepData.prompt]);

  // Calculate progress
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`minimal-ui min-h-screen ${adaptiveUI?.getAmbientClass ? adaptiveUI.getAmbientClass() : 'ambient-afternoon'}`}>
      {/* Enhanced Header with Maya's presence */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="minimal-button-secondary flex items-center gap-2 hover:transform hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </button>
          )}
          <div className="flex items-center gap-2 text-hint text-sm">
            <Heart className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>Minimal UI Mode • {title}</span>
          </div>
        </div>
        
        {/* Enhanced Progress bar with glow */}
        <div className="relative mb-8">
          <div className="minimal-progress">
            <div 
              className="minimal-progress-bar relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </div>
          </div>
          <div className="text-xs text-hint mt-1 text-center">
            Step {currentStep + 1} of {steps.length} • {Math.round(progress)}% Complete
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Enhanced Main content with Maya's character */}
        <div className="minimal-card fade-in relative overflow-hidden">
          {/* Maya's avatar and step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-primary">Maya's Insight</div>
              <div className="text-hint text-sm capitalize">
                {currentStepData?.type || 'learning'} moment
              </div>
            </div>
            {currentStep > 0 && (
              <div className="ml-auto">
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
              </div>
            )}
          </div>

          {/* Enhanced Content with typewriter effect */}
          <div 
            ref={contentRef}
            className="text-primary mb-6 relative"
            onMouseEnter={() => handleInteraction && handleInteraction('hover', 'content')}
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
              <span className="minimal-typewriter text-lg leading-relaxed">
                {typedContent}
                {isTyping && <span className="minimal-typewriter-cursor bg-purple-500" />}
              </span>
            </div>
            
            {/* Subtle reading indicator */}
            {isTyping && (
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-1 h-8 bg-purple-400 rounded-full opacity-30 animate-pulse" />
              </div>
            )}
          </div>

          {/* Interactive area - appears after typing */}
          {showNextAction && (
            <div className="slide-up">
              {currentStepData.prompt && (
                <>
                  <p className="text-secondary mb-4">{currentStepData.prompt}</p>
                  
                  {/* Response input */}
                  {currentStepData.type !== 'intro' && (
                    <textarea
                      ref={inputRef}
                      value={userResponse}
                      onChange={handleInputChange}
                      className="minimal-input mb-4"
                      rows={4}
                      placeholder={adaptiveUI.shouldSimplify 
                        ? "Take your time..." 
                        : "Share your thoughts..."}
                    />
                  )}

                  {/* Hints (if user is struggling) */}
                  {adaptiveUI.shouldSlowDown && currentStepData.hints && (
                    <div className="mb-4">
                      <p className="text-hint mb-2">Need inspiration?</p>
                      <ul className="space-y-1">
                        {currentStepData.hints.map((hint, idx) => (
                          <li key={idx} className="text-hint text-sm">
                            • {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Enhanced Action button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="minimal-button group relative overflow-hidden"
                  disabled={currentStepData?.type !== 'intro' && !userResponse.trim()}
                >
                  <div className="relative z-10 flex items-center">
                    {currentStep === steps.length - 1 ? (
                      <>
                        Complete Lesson
                        <Check className="inline-block w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                      </>
                    ) : (
                      <>
                        Continue Journey
                        <ChevronRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Completion state */}
          {lessonComplete && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white slide-up shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 animate-bounce" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Lesson Complete! 🎉</h3>
                  <p className="opacity-90 text-green-50">
                    You've mastered {title}. Your thoughtful approach will serve you well.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">+10 Confidence Points</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Reading pace indicator */}
        {adaptiveUI?.shouldHighlightProgress && (
          <div className="reading-pace-indicator active" />
        )}
        
        {/* Ambient particles for visual interest */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-300 rounded-full opacity-20 animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-purple-200 rounded-full opacity-25 animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>
      </div>

      {/* Enhanced Proactive Assistant */}
      {adaptiveUI?.proactiveHelp && (
        <ProactiveAssistant
          enabled={adaptiveUI.proactiveHelp.enabled}
          suggestions={adaptiveUI.proactiveHelp.suggestions}
          onDismiss={adaptiveUI.proactiveHelp.dismiss}
          onAccept={(suggestion) => {
            if (handleInteraction) handleInteraction('click', 'proactive-help');
            adaptiveUI.proactiveHelp.dismiss();
          }}
        />
      )}
    </div>
  );
};

export default MayaMicroLessonMinimal;