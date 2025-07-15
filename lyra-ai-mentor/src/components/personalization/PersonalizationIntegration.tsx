import React, { ComponentType, useEffect, useState, ReactNode } from 'react';
import { usePersonalization } from './PersonalizationProvider';
import { ChoiceContext, ChoiceCategory } from '@/services/systemPersonalizationService';

// =============================================================================
// HOC FOR PERSONALIZED COMPONENTS
// =============================================================================

interface PersonalizationOptions {
  category: ChoiceCategory;
  trackInteractions?: boolean;
  adaptContent?: boolean;
  trackPerformance?: boolean;
  character?: string;
  enableRealTimeAdaptation?: boolean;
}

export function withPersonalization<T extends Record<string, any>>(
  WrappedComponent: ComponentType<T>,
  options: PersonalizationOptions
) {
  const PersonalizedComponent = (props: T) => {
    const {
      recordChoice,
      getPersonalizedContent,
      adaptToPerformance,
      recordCharacterInteraction,
      currentSessionId,
      isPersonalized
    } = usePersonalization();
    
    const [personalizedProps, setPersonalizedProps] = useState<T>(props);
    const [interactionStartTime, setInteractionStartTime] = useState<number>(Date.now());
    
    // Initialize personalized content
    useEffect(() => {
      if (options.adaptContent && isPersonalized) {
        const personalizeProps = async () => {
          const context: ChoiceContext = {
            character: options.character,
            sessionId: currentSessionId,
            learningPhase: props.learningPhase || 'practice',
            chapter: props.chapter,
            lesson: props.lesson,
            element: props.elementId
          };
          
          const personalizedContent = await getPersonalizedContent(
            options.category,
            props,
            context
          );
          
          setPersonalizedProps({
            ...props,
            ...personalizedContent,
            __personalized: true
          });
        };
        
        personalizeProps();
      }
    }, [props, options.adaptContent, isPersonalized, getPersonalizedContent, currentSessionId]);
    
    // Track interaction start
    useEffect(() => {
      setInteractionStartTime(Date.now());
    }, []);
    
    // Enhanced props with personalization tracking
    const enhancedProps = {
      ...personalizedProps,
      
      // Add choice tracking to onClick handlers
      onClick: options.trackInteractions ? (...args: any[]) => {
        const timeSpent = Date.now() - interactionStartTime;
        
        recordChoice(
          options.category,
          'interaction',
          {
            character: options.character,
            sessionId: currentSessionId,
            chapter: props.chapter,
            lesson: props.lesson,
            element: props.elementId
          },
          {
            timeSpent,
            confidence: 0.8
          }
        );
        
        // Call original onClick if it exists
        if (props.onClick) {
          props.onClick(...args);
        }
      } : props.onClick,
      
      // Add completion tracking
      onComplete: options.trackPerformance ? (performance: {
        completionTime?: number;
        errorRate?: number;
        confidenceLevel?: number;
        stressLevel?: number;
        success?: boolean;
      }) => {
        const actualPerformance = {
          completionTime: performance.completionTime || (Date.now() - interactionStartTime),
          errorRate: performance.errorRate || 0,
          confidenceLevel: performance.confidenceLevel || 7,
          stressLevel: performance.stressLevel || 5,
          ...performance
        };
        
        // Record completion choice
        recordChoice(
          options.category,
          performance.success ? 'completion_success' : 'completion_attempt',
          {
            character: options.character,
            sessionId: currentSessionId,
            chapter: props.chapter,
            lesson: props.lesson,
            element: props.elementId
          },
          {
            timeSpent: actualPerformance.completionTime,
            confidence: actualPerformance.confidenceLevel / 10
          }
        );
        
        // Adapt to performance if enabled
        if (options.enableRealTimeAdaptation) {
          adaptToPerformance(actualPerformance);
        }
        
        // Record character interaction based on success
        if (options.character) {
          recordCharacterInteraction(
            options.character,
            performance.success ? 'positive' : 'negative',
            {
              performance: actualPerformance,
              category: options.category
            }
          );
        }
        
        // Call original onComplete if it exists
        if (props.onComplete) {
          props.onComplete(performance);
        }
      } : props.onComplete,
      
      // Add character feedback tracking
      onCharacterFeedback: (feedback: 'helpful' | 'confusing' | 'encouraging' | 'neutral') => {
        if (options.character) {
          recordCharacterInteraction(
            options.character,
            feedback === 'helpful' || feedback === 'encouraging' ? 'positive' : 
            feedback === 'confusing' ? 'negative' : 'neutral',
            {
              feedbackType: feedback,
              category: options.category
            }
          );
        }
        
        // Call original handler if it exists
        if (props.onCharacterFeedback) {
          props.onCharacterFeedback(feedback);
        }
      }
    };
    
    return <WrappedComponent {...enhancedProps} />;
  };
  
  PersonalizedComponent.displayName = `withPersonalization(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return PersonalizedComponent;
}

// =============================================================================
// CHARACTER-AGNOSTIC PERSONALIZATION HOOKS
// =============================================================================

export const useCharacterPersonalization = (characterName?: string) => {
  const {
    getPreferredCharacter,
    getCharacterAffinityScores,
    recordCharacterInteraction,
    preferences
  } = usePersonalization();
  
  const currentCharacter = characterName || getPreferredCharacter();
  const affinityScores = getCharacterAffinityScores();
  const characterAffinity = affinityScores[currentCharacter] || 0.5;
  
  const recordInteraction = (
    interaction: 'positive' | 'negative' | 'neutral',
    context?: any
  ) => {
    recordCharacterInteraction(currentCharacter, interaction, context);
  };
  
  const getCharacterTone = (): 'gentle' | 'motivational' | 'direct' | 'adaptive' => {
    if (characterAffinity > 0.8) return 'motivational';
    if (characterAffinity < 0.3) return 'gentle';
    return preferences?.encouragementStyle || 'adaptive';
  };
  
  const getCharacterSupportLevel = (): 'minimal' | 'moderate' | 'high' => {
    if (characterAffinity > 0.7) return 'minimal';
    if (characterAffinity < 0.4) return 'high';
    return 'moderate';
  };
  
  return {
    currentCharacter,
    characterAffinity,
    recordInteraction,
    getCharacterTone,
    getCharacterSupportLevel,
    shouldRotateCharacters: preferences?.characterRotation || false
  };
};

export const useContentPersonalization = (contentType: string, defaultContent: any) => {
  const { getPersonalizedContent, preferences, isPersonalized } = usePersonalization();
  const [personalizedContent, setPersonalizedContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isPersonalized) {
      personalizeContent();
    }
  }, [isPersonalized, contentType, defaultContent]);
  
  const personalizeContent = async (context?: ChoiceContext) => {
    setIsLoading(true);
    try {
      const content = await getPersonalizedContent(contentType, defaultContent, context);
      setPersonalizedContent(content);
    } catch (error) {
      console.error('Content personalization error:', error);
      setPersonalizedContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getComplexityLevel = (): 'beginner' | 'intermediate' | 'advanced' => {
    return preferences?.contentComplexity === 'adaptive' ? 'intermediate' : 
           (preferences?.contentComplexity as any) || 'intermediate';
  };
  
  const getPacingPreference = (): 'slow' | 'medium' | 'fast' => {
    return preferences?.contentPacing === 'adaptive' ? 'medium' : 
           (preferences?.contentPacing as any) || 'medium';
  };
  
  const getSupportLevel = (): 'independent' | 'guided' | 'coached' => {
    return preferences?.supportLevel === 'adaptive' ? 'guided' : 
           (preferences?.supportLevel as any) || 'guided';
  };
  
  return {
    content: personalizedContent,
    isLoading,
    personalizeContent,
    getComplexityLevel,
    getPacingPreference,
    getSupportLevel,
    isPersonalized
  };
};

export const useLearningPathPersonalization = () => {
  const { 
    getRecommendations, 
    patterns, 
    predictions,
    adaptToPerformance 
  } = usePersonalization();
  
  const getNextRecommendedContent = async () => {
    const recommendations = await getRecommendations('content', 3);
    return recommendations.recommendations;
  };
  
  const getOptimalSessionLength = (): number => {
    return patterns?.sessionLengthPattern === 'short-bursts' ? 10 :
           patterns?.sessionLengthPattern === 'long-focus' ? 30 : 15;
  };
  
  const getPredictedDifficulty = (contentId: string): 'easy' | 'medium' | 'hard' => {
    // This would use ML models in production
    const readiness = patterns?.readinessForAdvancement || 0.5;
    return readiness > 0.7 ? 'hard' : readiness > 0.4 ? 'medium' : 'easy';
  };
  
  const shouldSuggestBreak = (): boolean => {
    return patterns?.stressResponsePattern === 'sensitive';
  };
  
  const getAdaptiveStrategy = () => {
    return {
      complexity: predictions?.nextOptimalComplexity || 'intermediate',
      duration: predictions?.nextOptimalDuration || 900000, // 15 minutes
      character: predictions?.nextPreferredCharacter || 'maya',
      contentType: predictions?.nextPreferredContentType || 'guided'
    };
  };
  
  return {
    getNextRecommendedContent,
    getOptimalSessionLength,
    getPredictedDifficulty,
    shouldSuggestBreak,
    getAdaptiveStrategy,
    adaptToPerformance
  };
};

// =============================================================================
// PACE INTEGRATION COMPONENTS
// =============================================================================

interface PersonalizedPACEProps {
  children: ReactNode;
  phase: 'present' | 'apply' | 'check' | 'explain';
  character?: string;
  contentType?: string;
  onPhaseComplete?: (performance: any) => void;
}

export const PersonalizedPACE: React.FC<PersonalizedPACEProps> = ({
  children,
  phase,
  character,
  contentType = 'pace_flow',
  onPhaseComplete
}) => {
  const { recordChoice, currentSessionId } = usePersonalization();
  const { currentCharacter, recordInteraction } = useCharacterPersonalization(character);
  const [phaseStartTime] = useState(Date.now());
  
  const handlePhaseComplete = (performance: any) => {
    const timeSpent = Date.now() - phaseStartTime;
    
    // Record PACE phase completion
    recordChoice(
      'learning_style',
      `pace_${phase}_complete`,
      {
        character: currentCharacter,
        sessionId: currentSessionId,
        learningPhase: phase
      },
      {
        timeSpent,
        confidence: performance.confidence || 0.7
      }
    );
    
    // Record character interaction
    recordInteraction(
      performance.success ? 'positive' : 'negative',
      { pace_phase: phase, performance }
    );
    
    if (onPhaseComplete) {
      onPhaseComplete(performance);
    }
  };
  
  return (
    <div className="personalized-pace" data-phase={phase}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onComplete: handlePhaseComplete,
            character: currentCharacter
          });
        }
        return child;
      })}
    </div>
  );
};

// =============================================================================
// CHARACTER EXTENSION COMPONENTS
// =============================================================================

interface CharacterPersonalizationProps {
  character: 'sofia' | 'david' | 'rachel' | 'alex' | 'maya';
  children: ReactNode;
  trackAllInteractions?: boolean;
}

export const CharacterPersonalization: React.FC<CharacterPersonalizationProps> = ({
  character,
  children,
  trackAllInteractions = true
}) => {
  const { recordCharacterInteraction, currentSessionId } = usePersonalization();
  const [interactionCount, setInteractionCount] = useState(0);
  
  useEffect(() => {
    if (trackAllInteractions) {
      // Record character exposure
      recordCharacterInteraction(character, 'neutral', {
        exposure_type: 'view',
        session: currentSessionId
      });
    }
  }, [character, trackAllInteractions, recordCharacterInteraction, currentSessionId]);
  
  const handleInteraction = (type: 'positive' | 'negative' | 'neutral', context?: any) => {
    setInteractionCount(prev => prev + 1);
    recordCharacterInteraction(character, type, {
      ...context,
      interaction_count: interactionCount + 1,
      session: currentSessionId
    });
  };
  
  return (
    <div 
      className={`character-personalization character-${character}`}
      data-character={character}
      data-interactions={interactionCount}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            character,
            onCharacterInteraction: handleInteraction,
            interactionCount
          });
        }
        return child;
      })}
    </div>
  );
};

// =============================================================================
// PERFORMANCE TRACKING WRAPPER
// =============================================================================

interface PerformanceTrackingProps {
  children: ReactNode;
  category: ChoiceCategory;
  trackingId: string;
  autoTrackCompletion?: boolean;
  character?: string;
}

export const PerformanceTracking: React.FC<PerformanceTrackingProps> = ({
  children,
  category,
  trackingId,
  autoTrackCompletion = true,
  character
}) => {
  const { recordChoice, adaptToPerformance, currentSessionId } = usePersonalization();
  const [startTime] = useState(Date.now());
  const [errorCount, setErrorCount] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  
  const trackError = () => {
    setErrorCount(prev => prev + 1);
  };
  
  const trackInteraction = () => {
    setInteractionCount(prev => prev + 1);
  };
  
  const handleCompletion = async (success: boolean, customPerformance?: any) => {
    const completionTime = Date.now() - startTime;
    const errorRate = interactionCount > 0 ? errorCount / interactionCount : 0;
    
    const performance = {
      completionTime,
      errorRate,
      confidenceLevel: customPerformance?.confidenceLevel || (success ? 8 : 4),
      stressLevel: customPerformance?.stressLevel || (errorRate > 0.3 ? 7 : 4),
      ...customPerformance
    };
    
    // Record completion choice
    await recordChoice(
      category,
      success ? 'task_completed' : 'task_attempted',
      {
        character,
        sessionId: currentSessionId,
        trackingId
      },
      {
        timeSpent: completionTime,
        confidence: performance.confidenceLevel / 10
      }
    );
    
    // Adapt to performance
    const adaptations = await adaptToPerformance(performance);
    
    return { performance, adaptations };
  };
  
  useEffect(() => {
    // Track component mount
    recordChoice(
      category,
      'component_mounted',
      {
        character,
        sessionId: currentSessionId,
        trackingId
      }
    );
  }, []);
  
  return (
    <div 
      className="performance-tracking"
      data-tracking-id={trackingId}
      data-category={category}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onError: trackError,
            onInteraction: trackInteraction,
            onCompletion: autoTrackCompletion ? handleCompletion : undefined,
            trackingData: {
              errorCount,
              interactionCount,
              startTime
            }
          });
        }
        return child;
      })}
    </div>
  );
};

// =============================================================================
// ADAPTIVE CONTENT WRAPPER
// =============================================================================

interface AdaptiveContentProps {
  children: ReactNode;
  contentKey: string;
  defaultComplexity?: 'beginner' | 'intermediate' | 'advanced';
  adaptToUser?: boolean;
  character?: string;
}

export const AdaptiveContent: React.FC<AdaptiveContentProps> = ({
  children,
  contentKey,
  defaultComplexity = 'intermediate',
  adaptToUser = true,
  character
}) => {
  const { preferences, patterns } = usePersonalization();
  const [currentComplexity, setCurrentComplexity] = useState(defaultComplexity);
  
  useEffect(() => {
    if (adaptToUser && preferences && patterns) {
      const userComplexity = preferences.contentComplexity === 'adaptive' 
        ? determineOptimalComplexity(patterns)
        : preferences.contentComplexity as any;
      
      setCurrentComplexity(userComplexity || defaultComplexity);
    }
  }, [adaptToUser, preferences, patterns, defaultComplexity]);
  
  const determineOptimalComplexity = (userPatterns: any): 'beginner' | 'intermediate' | 'advanced' => {
    const readiness = userPatterns.readinessForAdvancement || 0.5;
    const progressionRate = userPatterns.difficultyProgressionRate || 0.5;
    
    if (readiness > 0.7 && progressionRate > 0.6) return 'advanced';
    if (readiness < 0.3 || progressionRate < 0.3) return 'beginner';
    return 'intermediate';
  };
  
  return (
    <div 
      className={`adaptive-content complexity-${currentComplexity}`}
      data-content-key={contentKey}
      data-complexity={currentComplexity}
      data-character={character}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            complexity: currentComplexity,
            adapted: adaptToUser,
            character
          });
        }
        return child;
      })}
    </div>
  );
};

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

// All components are already exported individually above