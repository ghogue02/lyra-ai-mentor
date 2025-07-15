import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PersonalizationContext,
  ChoiceStep,
  ChoiceCategory,
  ChoiceContext,
  UserPersonalizationProfile,
  PersonalizationPreferences,
  LearningPatterns,
  PersonalizationPredictions,
  systemPersonalizationService
} from '@/services/systemPersonalizationService';
import { personalizationStorageService } from '@/services/personalizationStorageService';
import { useToast } from '@/hooks/use-toast';

// =============================================================================
// PERSONALIZATION CONTEXT INTERFACE
// =============================================================================

interface PersonalizationContextValue {
  // Core state
  context: PersonalizationContext | null;
  isLoading: boolean;
  error: string | null;
  
  // Profile and preferences
  profile: UserPersonalizationProfile | null;
  preferences: PersonalizationPreferences | null;
  patterns: LearningPatterns | null;
  predictions: PersonalizationPredictions | null;
  
  // Choice tracking
  currentSessionId: string;
  recordChoice: (
    category: ChoiceCategory,
    choice: string,
    context: ChoiceContext,
    options?: {
      confidence?: number;
      timeSpent?: number;
      alternatives?: string[];
    }
  ) => Promise<ChoiceStep | undefined>;
  
  // Personalization actions
  updatePreferences: (updates: Partial<PersonalizationPreferences>) => Promise<void>;
  getPersonalizedContent: (contentType: string, defaultContent: any, context?: ChoiceContext) => Promise<any>;
  getRecommendations: (category: 'content' | 'character' | 'learning-path' | 'support', limit?: number) => Promise<any>;
  
  // Adaptive behavior
  adaptToPerformance: (performance: {
    completionTime: number;
    errorRate: number;
    confidenceLevel: number;
    stressLevel: number;
  }) => Promise<string[]>;
  
  // Character affinity
  recordCharacterInteraction: (character: string, interaction: 'positive' | 'negative' | 'neutral', context?: any) => Promise<void>;
  getPreferredCharacter: (context?: ChoiceContext) => string;
  getCharacterAffinityScores: () => Record<string, number>;
  
  // Analytics and insights
  getPersonalizationInsights: () => Promise<{
    effectivenessScore: number;
    adaptationAccuracy: number;
    userSatisfaction: number;
    recommendations: string[];
  }>;
  
  // Utility methods
  refreshPersonalization: () => Promise<void>;
  exportPersonalizationData: () => Promise<any>;
  isPersonalized: boolean;
  personalizationLevel: 'none' | 'basic' | 'advanced' | 'expert';
}

// =============================================================================
// PERSONALIZATION CONTEXT
// =============================================================================

const PersonalizationContext = createContext<PersonalizationContextValue | undefined>(undefined);

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

// =============================================================================
// PERSONALIZATION PROVIDER COMPONENT
// =============================================================================

interface PersonalizationProviderProps {
  children: ReactNode;
  sessionId?: string;
  enableCrossSessionLearning?: boolean;
  enablePredictivePersonalization?: boolean;
  enableRealTimeAdaptation?: boolean;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({
  children,
  sessionId,
  enableCrossSessionLearning = true,
  enablePredictivePersonalization = true,
  enableRealTimeAdaptation = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Core state
  const [context, setContext] = useState<PersonalizationContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Individual components state
  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [preferences, setPreferences] = useState<PersonalizationPreferences | null>(null);
  const [patterns, setPatterns] = useState<LearningPatterns | null>(null);
  const [predictions, setPredictions] = useState<PersonalizationPredictions | null>(null);
  
  // Session management
  const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // =============================================================================
  // INITIALIZATION AND DATA LOADING
  // =============================================================================
  
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    initializePersonalization();
  }, [user?.id, currentSessionId]);
  
  const initializePersonalization = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load all personalization data in parallel
      const [personalizedContext, userProfile, userPreferences, learningPatterns, personalizedPredictions] = await Promise.all([
        systemPersonalizationService.getPersonalizationContext(user!.id, currentSessionId),
        personalizationStorageService.getUserProfile(user!.id),
        personalizationStorageService.getPreferences(user!.id),
        personalizationStorageService.getLearningPatterns(user!.id),
        enablePredictivePersonalization 
          ? personalizationStorageService.getPredictions(user!.id)
          : Promise.resolve(null)
      ]);
      
      setContext(personalizedContext);
      setProfile(userProfile);
      setPreferences(userPreferences);
      setPatterns(learningPatterns);
      setPredictions(personalizedPredictions);
      
      // Initialize cross-session learning if enabled
      if (enableCrossSessionLearning && userProfile) {
        await initializeCrossSessionLearning(userProfile);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize personalization';
      setError(errorMessage);
      console.error('Personalization initialization error:', err);
      
      toast({
        title: 'Personalization Error',
        description: 'Some personalization features may not work properly.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const initializeCrossSessionLearning = async (userProfile: UserPersonalizationProfile) => {
    try {
      const demographic = {
        role: userProfile.role,
        techComfort: userProfile.techComfort,
        aiExperience: userProfile.aiExperience,
        learningStyle: userProfile.learningStyle
      };
      
      const aggregatedPatterns = await personalizationStorageService.getAggregatedPatterns(demographic);
      
      // Merge with user's existing patterns
      if (patterns && aggregatedPatterns) {
        const mergedPatterns = mergePatterns(patterns, aggregatedPatterns);
        setPatterns(mergedPatterns);
        await personalizationStorageService.storeLearningPatterns(user!.id, mergedPatterns);
      }
    } catch (err) {
      console.error('Cross-session learning initialization error:', err);
    }
  };
  
  // =============================================================================
  // CHOICE TRACKING
  // =============================================================================
  
  const recordChoice = useCallback(async (
    category: ChoiceCategory,
    choice: string,
    choiceContext: ChoiceContext,
    options: {
      confidence?: number;
      timeSpent?: number;
      alternatives?: string[];
    } = {}
  ): Promise<ChoiceStep | undefined> => {
    if (!user?.id) return;
    
    try {
      const choiceStep = await systemPersonalizationService.recordChoice(
        user.id,
        currentSessionId,
        {
          category,
          choice,
          context: { ...choiceContext, sessionId: currentSessionId },
          confidence: options.confidence || 0.8,
          timeSpent: options.timeSpent || 0,
          alternatives: options.alternatives || []
        }
      );
      
      // Real-time adaptation if enabled
      if (enableRealTimeAdaptation && choiceStep) {
        await handleRealTimeAdaptation(choiceStep);
      }
      
      return choiceStep;
    } catch (err) {
      console.error('Error recording choice:', err);
      toast({
        title: 'Choice Recording Error',
        description: 'Failed to record your choice for personalization.',
        variant: 'destructive'
      });
    }
  }, [user?.id, currentSessionId, enableRealTimeAdaptation, toast]);
  
  const handleRealTimeAdaptation = async (choiceStep: ChoiceStep) => {
    try {
      // Update patterns based on the new choice
      if (patterns) {
        const updatedPatterns = await updatePatternsWithChoice(patterns, choiceStep);
        setPatterns(updatedPatterns);
        await personalizationStorageService.storeLearningPatterns(user!.id, updatedPatterns);
      }
      
      // Update predictions if predictive personalization is enabled
      if (enablePredictivePersonalization) {
        const updatedPredictions = await systemPersonalizationService.generatePredictions(user!.id);
        setPredictions(updatedPredictions);
      }
    } catch (err) {
      console.error('Real-time adaptation error:', err);
    }
  };
  
  // =============================================================================
  // PREFERENCES MANAGEMENT
  // =============================================================================
  
  const updatePreferences = useCallback(async (updates: Partial<PersonalizationPreferences>) => {
    if (!user?.id || !preferences) return;
    
    try {
      const updatedPreferences = { ...preferences, ...updates };
      await personalizationStorageService.storePreferences(user.id, updatedPreferences);
      setPreferences(updatedPreferences);
      
      toast({
        title: 'Preferences Updated',
        description: 'Your personalization preferences have been saved.',
      });
    } catch (err) {
      console.error('Error updating preferences:', err);
      toast({
        title: 'Update Error',
        description: 'Failed to update your preferences.',
        variant: 'destructive'
      });
    }
  }, [user?.id, preferences, toast]);
  
  // =============================================================================
  // PERSONALIZED CONTENT DELIVERY
  // =============================================================================
  
  const getPersonalizedContent = useCallback(async (
    contentType: string,
    defaultContent: any,
    choiceContext: ChoiceContext = {}
  ) => {
    if (!user?.id) return defaultContent;
    
    try {
      const result = await systemPersonalizationService.getAdaptiveContent(
        user.id,
        contentType,
        { ...choiceContext, sessionId: currentSessionId }
      );
      
      return result.content || defaultContent;
    } catch (err) {
      console.error('Error getting personalized content:', err);
      return defaultContent;
    }
  }, [user?.id, currentSessionId]);
  
  const getRecommendations = useCallback(async (
    category: 'content' | 'character' | 'learning-path' | 'support',
    limit: number = 5
  ) => {
    if (!user?.id) return { recommendations: [], confidence: 0 };
    
    try {
      return await systemPersonalizationService.getPersonalizedRecommendations(
        user.id,
        category,
        limit
      );
    } catch (err) {
      console.error('Error getting recommendations:', err);
      return { recommendations: [], confidence: 0 };
    }
  }, [user?.id]);
  
  // =============================================================================
  // ADAPTIVE BEHAVIOR
  // =============================================================================
  
  const adaptToPerformance = useCallback(async (performance: {
    completionTime: number;
    errorRate: number;
    confidenceLevel: number;
    stressLevel: number;
  }): Promise<string[]> => {
    if (!user?.id) return [];
    
    try {
      // Record performance as a choice
      await recordChoice(
        'learning_style',
        'performance_feedback',
        { sessionId: currentSessionId },
        {
          confidence: performance.confidenceLevel / 10,
          timeSpent: performance.completionTime
        }
      );
      
      // Generate adaptive recommendations
      const adaptations: string[] = [];
      
      if (performance.errorRate > 0.3) {
        adaptations.push('reduce_complexity');
      } else if (performance.errorRate < 0.1) {
        adaptations.push('increase_complexity');
      }
      
      if (performance.stressLevel > 7) {
        adaptations.push('increase_support');
      } else if (performance.stressLevel < 3) {
        adaptations.push('reduce_support');
      }
      
      if (performance.completionTime > 1800000) {
        adaptations.push('increase_pacing');
      } else if (performance.completionTime < 300000) {
        adaptations.push('decrease_pacing');
      }
      
      // Update preferences based on adaptations
      if (adaptations.length > 0 && preferences) {
        const preferenceUpdates: Partial<PersonalizationPreferences> = {};
        
        if (adaptations.includes('reduce_complexity')) {
          preferenceUpdates.contentComplexity = 'beginner';
        } else if (adaptations.includes('increase_complexity')) {
          preferenceUpdates.contentComplexity = 'advanced';
        }
        
        if (adaptations.includes('increase_support')) {
          preferenceUpdates.supportLevel = 'coached';
        } else if (adaptations.includes('reduce_support')) {
          preferenceUpdates.supportLevel = 'independent';
        }
        
        if (adaptations.includes('increase_pacing')) {
          preferenceUpdates.contentPacing = 'fast';
        } else if (adaptations.includes('decrease_pacing')) {
          preferenceUpdates.contentPacing = 'slow';
        }
        
        await updatePreferences(preferenceUpdates);
      }
      
      return adaptations;
    } catch (err) {
      console.error('Error adapting to performance:', err);
      return [];
    }
  }, [user?.id, currentSessionId, recordChoice, preferences, updatePreferences]);
  
  // =============================================================================
  // CHARACTER AFFINITY MANAGEMENT
  // =============================================================================
  
  const recordCharacterInteraction = useCallback(async (
    character: string,
    interaction: 'positive' | 'negative' | 'neutral',
    interactionContext: any = {}
  ) => {
    if (!user?.id) return;
    
    try {
      await recordChoice(
        'character_affinity',
        interaction,
        {
          character,
          sessionId: currentSessionId,
          ...interactionContext
        },
        {
          confidence: interaction === 'positive' ? 0.9 : interaction === 'negative' ? 0.1 : 0.5
        }
      );
      
      // Update character affinity in preferences
      if (preferences) {
        const currentAffinity = preferences.characterAffinity[character] || 0.5;
        let newAffinity = currentAffinity;
        
        switch (interaction) {
          case 'positive':
            newAffinity = Math.min(1.0, currentAffinity + 0.1);
            break;
          case 'negative':
            newAffinity = Math.max(0.0, currentAffinity - 0.1);
            break;
          case 'neutral':
            // Slight regression to mean
            newAffinity = currentAffinity * 0.95 + 0.5 * 0.05;
            break;
        }
        
        await updatePreferences({
          characterAffinity: {
            ...preferences.characterAffinity,
            [character]: newAffinity
          }
        });
      }
    } catch (err) {
      console.error('Error recording character interaction:', err);
    }
  }, [user?.id, currentSessionId, recordChoice, preferences, updatePreferences]);
  
  const getPreferredCharacter = useCallback((choiceContext: ChoiceContext = {}): string => {
    if (!preferences || !preferences.characterAffinity) {
      return 'maya'; // Default character
    }
    
    const affinityScores = preferences.characterAffinity;
    const availableCharacters = Object.keys(affinityScores).filter(char => 
      !preferences.characterAvoidance.includes(char)
    );
    
    if (availableCharacters.length === 0) {
      return 'maya';
    }
    
    // Consider context for character selection
    if (choiceContext.chapter === 2) {
      return 'maya'; // Maya is the primary character for Chapter 2
    }
    
    // Return character with highest affinity
    return availableCharacters.reduce((preferred, character) => 
      affinityScores[character] > affinityScores[preferred] ? character : preferred
    );
  }, [preferences]);
  
  const getCharacterAffinityScores = useCallback((): Record<string, number> => {
    return preferences?.characterAffinity || {};
  }, [preferences]);
  
  // =============================================================================
  // ANALYTICS AND INSIGHTS
  // =============================================================================
  
  const getPersonalizationInsights = useCallback(async () => {
    if (!user?.id) {
      return {
        effectivenessScore: 0,
        adaptationAccuracy: 0,
        userSatisfaction: 0,
        recommendations: []
      };
    }
    
    try {
      const analysisResult = await personalizationStorageService.analyzeUserPatterns(user.id);
      
      return {
        effectivenessScore: analysisResult.confidence,
        adaptationAccuracy: analysisResult.confidence * 0.9,
        userSatisfaction: analysisResult.confidence * 0.85,
        recommendations: analysisResult.recommendations
      };
    } catch (err) {
      console.error('Error getting personalization insights:', err);
      return {
        effectivenessScore: 0,
        adaptationAccuracy: 0,
        userSatisfaction: 0,
        recommendations: []
      };
    }
  }, [user?.id]);
  
  // =============================================================================
  // UTILITY METHODS
  // =============================================================================
  
  const refreshPersonalization = useCallback(async () => {
    await initializePersonalization();
  }, []);
  
  const exportPersonalizationData = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      return await personalizationStorageService.exportUserData(user.id);
    } catch (err) {
      console.error('Error exporting personalization data:', err);
      return null;
    }
  }, [user?.id]);
  
  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================
  
  const isPersonalized = Boolean(context && profile && (context.choicePath.path.length > 0));
  
  const personalizationLevel: 'none' | 'basic' | 'advanced' | 'expert' = (() => {
    if (!context || !context.choicePath.path.length) return 'none';
    
    const choiceCount = context.choicePath.path.length;
    if (choiceCount > 50) return 'expert';
    if (choiceCount > 20) return 'advanced';
    if (choiceCount > 5) return 'basic';
    return 'none';
  })();
  
  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================
  
  const mergePatterns = (userPatterns: LearningPatterns, aggregatedPatterns: LearningPatterns): LearningPatterns => {
    // Weighted merge favoring user's existing patterns
    return {
      ...aggregatedPatterns,
      ...userPatterns,
      contentAffinityScores: {
        ...aggregatedPatterns.contentAffinityScores,
        ...userPatterns.contentAffinityScores
      },
      characterEngagementScores: {
        ...aggregatedPatterns.characterEngagementScores,
        ...userPatterns.characterEngagementScores
      },
      characterEffectivenessScores: {
        ...aggregatedPatterns.characterEffectivenessScores,
        ...userPatterns.characterEffectivenessScores
      }
    };
  };
  
  const updatePatternsWithChoice = async (
    currentPatterns: LearningPatterns,
    choiceStep: ChoiceStep
  ): Promise<LearningPatterns> => {
    // Simple pattern update - in production this would be more sophisticated
    const updatedPatterns = { ...currentPatterns };
    
    // Update character engagement if applicable
    if (choiceStep.context.character) {
      const character = choiceStep.context.character;
      updatedPatterns.characterEngagementScores[character] = 
        (updatedPatterns.characterEngagementScores[character] || 0.5) * 0.9 + choiceStep.confidence * 0.1;
    }
    
    // Update content affinity
    if (choiceStep.category) {
      updatedPatterns.contentAffinityScores[choiceStep.category] = 
        (updatedPatterns.contentAffinityScores[choiceStep.category] || 0.5) * 0.9 + choiceStep.confidence * 0.1;
    }
    
    return updatedPatterns;
  };
  
  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  
  const contextValue: PersonalizationContextValue = {
    // Core state
    context,
    isLoading,
    error,
    
    // Profile and preferences
    profile,
    preferences,
    patterns,
    predictions,
    
    // Choice tracking
    currentSessionId,
    recordChoice,
    
    // Personalization actions
    updatePreferences,
    getPersonalizedContent,
    getRecommendations,
    
    // Adaptive behavior
    adaptToPerformance,
    
    // Character affinity
    recordCharacterInteraction,
    getPreferredCharacter,
    getCharacterAffinityScores,
    
    // Analytics and insights
    getPersonalizationInsights,
    
    // Utility methods
    refreshPersonalization,
    exportPersonalizationData,
    isPersonalized,
    personalizationLevel
  };
  
  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};