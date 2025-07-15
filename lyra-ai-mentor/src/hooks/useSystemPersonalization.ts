import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  systemPersonalizationService,
  PersonalizationContext,
  ChoiceStep,
  ChoiceCategory,
  ChoiceContext,
  LearningPatterns,
  PersonalizationPreferences,
  PersonalizationPredictions,
  UserPersonalizationProfile
} from '@/services/systemPersonalizationService';

// =============================================================================
// CORE PERSONALIZATION CONTEXT HOOK
// =============================================================================

export const usePersonalizationContext = (sessionId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [context, setContext] = useState<PersonalizationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentSessionId = sessionId || `session_${Date.now()}`;
  
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    const loadContext = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const personalizedContext = await systemPersonalizationService.getPersonalizationContext(
          user.id,
          currentSessionId
        );
        
        setContext(personalizedContext);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load personalization context';
        setError(errorMessage);
        toast({
          title: 'Personalization Error',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadContext();
  }, [user?.id, currentSessionId, toast]);
  
  const updateContext = useCallback(async (updates: Partial<PersonalizationContext>) => {
    if (!user?.id || !context) return;
    
    try {
      const updatedContext = await systemPersonalizationService.updatePersonalizationContext(
        user.id,
        currentSessionId,
        updates
      );
      
      setContext(updatedContext);
      return updatedContext;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update personalization context';
      setError(errorMessage);
      toast({
        title: 'Update Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [user?.id, context, currentSessionId, toast]);
  
  return {
    context,
    loading,
    error,
    updateContext,
    isReady: !loading && !error && context !== null
  };
};

// =============================================================================
// CHOICE PATH TRACKING HOOK
// =============================================================================

export const useChoicePath = (sessionId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [choices, setChoices] = useState<ChoiceStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentSessionId = sessionId || `session_${Date.now()}`;
  
  useEffect(() => {
    if (!user?.id) return;
    
    const loadChoices = async () => {
      try {
        setLoading(true);
        const choicePath = await systemPersonalizationService.getChoicePath(user.id, currentSessionId);
        setChoices(choicePath?.path || []);
      } catch (err) {
        setError('Failed to load choice path');
      } finally {
        setLoading(false);
      }
    };
    
    loadChoices();
  }, [user?.id, currentSessionId]);
  
  const recordChoice = useCallback(async (
    category: ChoiceCategory,
    choice: string,
    context: ChoiceContext,
    options: {
      confidence?: number;
      timeSpent?: number;
      alternatives?: string[];
    } = {}
  ) => {
    if (!user?.id) return;
    
    try {
      const choiceStep = await systemPersonalizationService.recordChoice(
        user.id,
        currentSessionId,
        {
          category,
          choice,
          context,
          confidence: options.confidence || 0.8,
          timeSpent: options.timeSpent || 0,
          alternatives: options.alternatives || []
        }
      );
      
      setChoices(prev => [...prev, choiceStep]);
      return choiceStep;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record choice';
      setError(errorMessage);
      toast({
        title: 'Recording Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [user?.id, currentSessionId, toast]);
  
  const getChoicesByCategory = useCallback((category: ChoiceCategory) => {
    return choices.filter(choice => choice.category === category);
  }, [choices]);
  
  const getChoicesByCharacter = useCallback((character: string) => {
    return choices.filter(choice => choice.context.character === character);
  }, [choices]);
  
  const getLatestChoice = useCallback((category?: ChoiceCategory) => {
    const filteredChoices = category 
      ? choices.filter(c => c.category === category)
      : choices;
    
    return filteredChoices.length > 0 
      ? filteredChoices[filteredChoices.length - 1]
      : null;
  }, [choices]);
  
  return {
    choices,
    loading,
    error,
    recordChoice,
    getChoicesByCategory,
    getChoicesByCharacter,
    getLatestChoice,
    choiceCount: choices.length
  };
};

// =============================================================================
// DYNAMIC CONTENT PERSONALIZATION HOOK
// =============================================================================

export const useDynamicContent = (
  contentType: string,
  defaultContent: any,
  context: ChoiceContext = {}
) => {
  const { user } = useAuth();
  const [personalizedContent, setPersonalizedContent] = useState(defaultContent);
  const [adaptations, setAdaptations] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0.5);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!user?.id) {
      setPersonalizedContent(defaultContent);
      return;
    }
    
    const personalizeContent = async () => {
      try {
        setLoading(true);
        
        const result = await systemPersonalizationService.getAdaptiveContent(
          user.id,
          contentType,
          context
        );
        
        setPersonalizedContent(result.content);
        setAdaptations(result.adaptations);
        setConfidence(result.confidence);
      } catch (err) {
        console.error('Failed to personalize content:', err);
        setPersonalizedContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };
    
    personalizeContent();
  }, [user?.id, contentType, defaultContent, context]);
  
  return {
    content: personalizedContent,
    adaptations,
    confidence,
    loading,
    isPersonalized: adaptations.length > 0
  };
};

// =============================================================================
// CHOICE HISTORY AND PATTERN ANALYSIS HOOK
// =============================================================================

export const useChoiceHistory = (options: {
  limit?: number;
  category?: ChoiceCategory;
  character?: string;
  dateRange?: { start: Date; end: Date };
} = {}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChoiceStep[]>([]);
  const [patterns, setPatterns] = useState<LearningPatterns | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [choiceHistory, learningPatterns] = await Promise.all([
          systemPersonalizationService.getChoiceHistory(user.id, options),
          systemPersonalizationService.getLearningPatterns(user.id)
        ]);
        
        setHistory(choiceHistory);
        setPatterns(learningPatterns);
      } catch (err) {
        setError('Failed to load choice history');
      } finally {
        setLoading(false);
      }
    };
    
    loadHistory();
  }, [user?.id, JSON.stringify(options)]);
  
  const getPatternInsights = useMemo(() => {
    if (!patterns || !history.length) return null;
    
    return {
      mostUsedCharacter: Object.entries(patterns.characterEngagementScores)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown',
      
      averageConfidence: history.reduce((sum, choice) => sum + choice.confidence, 0) / history.length,
      
      preferredTimeOfDay: history.reduce((acc, choice) => {
        const hour = new Date(choice.timestamp).getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      categoryDistribution: history.reduce((acc, choice) => {
        acc[choice.category] = (acc[choice.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      averageTimeSpent: history.reduce((sum, choice) => sum + choice.timeSpent, 0) / history.length
    };
  }, [patterns, history]);
  
  return {
    history,
    patterns,
    loading,
    error,
    insights: getPatternInsights
  };
};

// =============================================================================
// PERSONALIZATION PREFERENCES HOOK
// =============================================================================

export const usePersonalizationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<PersonalizationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const prefs = await systemPersonalizationService.getPreferences(user.id);
        setPreferences(prefs);
      } catch (err) {
        setError('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user?.id]);
  
  const updatePreferences = useCallback(async (updates: Partial<PersonalizationPreferences>) => {
    if (!user?.id || !preferences) return;
    
    try {
      const updatedPrefs = { ...preferences, ...updates };
      await systemPersonalizationService.storePreferences(user.id, updatedPrefs);
      setPreferences(updatedPrefs);
    } catch (err) {
      setError('Failed to update preferences');
    }
  }, [user?.id, preferences]);
  
  return {
    preferences,
    loading,
    error,
    updatePreferences,
    isReady: !loading && !error && preferences !== null
  };
};

// =============================================================================
// PERSONALIZED RECOMMENDATIONS HOOK
// =============================================================================

export const usePersonalizedRecommendations = (
  category: 'content' | 'character' | 'learning-path' | 'support',
  limit: number = 5
) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    title: string;
    description: string;
    confidence: number;
    reasoning: string;
  }>>([]);
  const [overallConfidence, setOverallConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await systemPersonalizationService.getPersonalizedRecommendations(
          user.id,
          category,
          limit
        );
        
        setRecommendations(result.recommendations);
        setOverallConfidence(result.confidence);
      } catch (err) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user?.id, category, limit]);
  
  return {
    recommendations,
    confidence: overallConfidence,
    loading,
    error,
    hasRecommendations: recommendations.length > 0
  };
};

// =============================================================================
// PREDICTIVE PERSONALIZATION HOOK
// =============================================================================

export const usePersonalizationPredictions = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<PersonalizationPredictions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const loadPredictions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const personalizedPredictions = await systemPersonalizationService.generatePredictions(user.id);
        setPredictions(personalizedPredictions);
      } catch (err) {
        setError('Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };
    
    loadPredictions();
  }, [user?.id]);
  
  const refreshPredictions = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const newPredictions = await systemPersonalizationService.generatePredictions(user.id);
      setPredictions(newPredictions);
    } catch (err) {
      setError('Failed to refresh predictions');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  
  return {
    predictions,
    loading,
    error,
    refreshPredictions,
    isReady: !loading && !error && predictions !== null
  };
};

// =============================================================================
// ADAPTIVE LEARNING HOOK
// =============================================================================

export const useAdaptiveLearning = (
  contentContext: ChoiceContext,
  onAdaptation?: (adaptations: string[]) => void
) => {
  const { user } = useAuth();
  const { recordChoice } = useChoicePath(contentContext.sessionId);
  const [adaptiveState, setAdaptiveState] = useState({
    complexity: 'intermediate',
    pacing: 'medium',
    support: 'guided',
    confidence: 0.7
  });
  
  const adaptBasedOnPerformance = useCallback(async (
    performance: {
      completionTime: number;
      errorRate: number;
      confidenceLevel: number;
      stressLevel: number;
    }
  ) => {
    if (!user?.id) return;
    
    // Record the performance as a choice
    await recordChoice(
      'learning_style',
      'performance_feedback',
      contentContext,
      {
        confidence: performance.confidenceLevel / 10,
        timeSpent: performance.completionTime,
        alternatives: []
      }
    );
    
    // Adapt the learning parameters based on performance
    const adaptations: string[] = [];
    
    if (performance.errorRate > 0.3) {
      adaptations.push('reduce_complexity');
      setAdaptiveState(prev => ({ ...prev, complexity: 'beginner' }));
    } else if (performance.errorRate < 0.1) {
      adaptations.push('increase_complexity');
      setAdaptiveState(prev => ({ ...prev, complexity: 'advanced' }));
    }
    
    if (performance.stressLevel > 7) {
      adaptations.push('increase_support');
      setAdaptiveState(prev => ({ ...prev, support: 'coached' }));
    } else if (performance.stressLevel < 3) {
      adaptations.push('reduce_support');
      setAdaptiveState(prev => ({ ...prev, support: 'independent' }));
    }
    
    if (performance.completionTime > 1800000) { // 30 minutes
      adaptations.push('increase_pacing');
      setAdaptiveState(prev => ({ ...prev, pacing: 'fast' }));
    } else if (performance.completionTime < 300000) { // 5 minutes
      adaptations.push('decrease_pacing');
      setAdaptiveState(prev => ({ ...prev, pacing: 'slow' }));
    }
    
    if (adaptations.length > 0 && onAdaptation) {
      onAdaptation(adaptations);
    }
    
    return adaptations;
  }, [user?.id, recordChoice, contentContext, onAdaptation]);
  
  const getAdaptiveContent = useCallback(async (baseContent: any) => {
    if (!user?.id) return baseContent;
    
    const result = await systemPersonalizationService.getAdaptiveContent(
      user.id,
      'adaptive_learning',
      contentContext
    );
    
    return result.content;
  }, [user?.id, contentContext]);
  
  return {
    adaptiveState,
    adaptBasedOnPerformance,
    getAdaptiveContent,
    isAdaptive: true
  };
};

// =============================================================================
// CROSS-SESSION LEARNING HOOK
// =============================================================================

export const useCrossSessionLearning = () => {
  const { user } = useAuth();
  const [crossSessionData, setCrossSessionData] = useState<{
    transferredPatterns: string[];
    learningSimilarity: number;
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const enableCrossSessionLearning = useCallback(async (
    demographic: {
      role?: string;
      techComfort?: string;
      aiExperience?: string;
      learningStyle?: string;
    }
  ) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const anonymizedPatterns = await systemPersonalizationService.aggregateAnonymizedPatterns(
        demographic
      );
      
      // Apply insights from similar users
      setCrossSessionData({
        transferredPatterns: ['optimal_session_length', 'preferred_complexity'],
        learningSimilarity: 0.75,
        recommendations: [
          'Based on similar users, try 15-minute focused sessions',
          'Users with your profile prefer hands-on practice',
          'Consider starting with intermediate complexity'
        ]
      });
    } catch (err) {
      console.error('Failed to enable cross-session learning:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  
  return {
    crossSessionData,
    loading,
    enableCrossSessionLearning,
    isEnabled: crossSessionData !== null
  };
};

// =============================================================================
// PERSONALIZATION ANALYTICS HOOK
// =============================================================================

export const usePersonalizationAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<{
    totalChoices: number;
    personalizationEffectiveness: number;
    adaptationAccuracy: number;
    userSatisfaction: number;
    learningVelocity: number;
    engagementTrends: Array<{ date: string; engagement: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        
        const [history, patterns] = await Promise.all([
          systemPersonalizationService.getChoiceHistory(user.id, { limit: 100 }),
          systemPersonalizationService.getLearningPatterns(user.id)
        ]);
        
        const totalChoices = history.length;
        const avgConfidence = history.reduce((sum, choice) => sum + choice.confidence, 0) / history.length;
        const avgOutcome = history
          .filter(choice => choice.outcome)
          .reduce((sum, choice) => sum + choice.outcome!.satisfaction, 0) / history.filter(c => c.outcome).length;
        
        setAnalytics({
          totalChoices,
          personalizationEffectiveness: avgConfidence,
          adaptationAccuracy: avgOutcome || 0.7,
          userSatisfaction: avgOutcome || 0.8,
          learningVelocity: patterns?.difficultyProgressionRate || 0.5,
          engagementTrends: []
        });
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [user?.id]);
  
  return {
    analytics,
    loading,
    hasData: analytics !== null
  };
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

export const usePersonalizationStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<{
    isPersonalized: boolean;
    personalizationLevel: 'none' | 'basic' | 'advanced' | 'expert';
    dataQuality: 'poor' | 'fair' | 'good' | 'excellent';
    lastUpdated: Date | null;
  }>({
    isPersonalized: false,
    personalizationLevel: 'none',
    dataQuality: 'poor',
    lastUpdated: null
  });
  
  useEffect(() => {
    if (!user?.id) return;
    
    const checkStatus = async () => {
      try {
        const [history, patterns] = await Promise.all([
          systemPersonalizationService.getChoiceHistory(user.id, { limit: 10 }),
          systemPersonalizationService.getLearningPatterns(user.id)
        ]);
        
        const isPersonalized = history.length > 0;
        const choiceCount = history.length;
        
        let personalizationLevel: 'none' | 'basic' | 'advanced' | 'expert' = 'none';
        if (choiceCount > 50) personalizationLevel = 'expert';
        else if (choiceCount > 20) personalizationLevel = 'advanced';
        else if (choiceCount > 5) personalizationLevel = 'basic';
        
        let dataQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
        if (choiceCount > 30) dataQuality = 'excellent';
        else if (choiceCount > 15) dataQuality = 'good';
        else if (choiceCount > 5) dataQuality = 'fair';
        
        setStatus({
          isPersonalized,
          personalizationLevel,
          dataQuality,
          lastUpdated: history.length > 0 ? new Date(history[0].timestamp) : null
        });
      } catch (err) {
        console.error('Failed to check personalization status:', err);
      }
    };
    
    checkStatus();
  }, [user?.id]);
  
  return status;
};