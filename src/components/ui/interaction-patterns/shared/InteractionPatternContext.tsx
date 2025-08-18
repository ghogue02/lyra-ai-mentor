/**
 * Context provider for interaction patterns with shared state management
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { InteractionPatternConfig, createPromptIntegrations } from './patternConfig';
import { PromptSegment } from '../../DynamicPromptBuilder';

interface InteractionPatternState {
  config: InteractionPatternConfig;
  data: any;
  isComplete: boolean;
  promptSegments: PromptSegment[];
  analytics: {
    startTime: Date;
    interactions: number;
    completionTime?: Date;
    patternEffectiveness?: number;
  };
}

interface InteractionPatternContextValue {
  state: InteractionPatternState;
  updateData: (data: any) => void;
  updateConfig: (config: Partial<InteractionPatternConfig>) => void;
  markComplete: () => void;
  generatePromptSegments: () => PromptSegment[];
  trackInteraction: (type: string, data?: any) => void;
  resetState: () => void;
}

const InteractionPatternContext = createContext<InteractionPatternContextValue | null>(null);

export interface InteractionPatternProviderProps {
  children: React.ReactNode;
  initialConfig: InteractionPatternConfig;
  onDataChange?: (data: any, promptSegments: PromptSegment[]) => void;
  onComplete?: (finalData: any, analytics: any) => void;
}

export const InteractionPatternProvider: React.FC<InteractionPatternProviderProps> = ({
  children,
  initialConfig,
  onDataChange,
  onComplete
}) => {
  const [state, setState] = useState<InteractionPatternState>({
    config: initialConfig,
    data: null,
    isComplete: false,
    promptSegments: [],
    analytics: {
      startTime: new Date(),
      interactions: 0
    }
  });

  const updateData = useCallback((data: any) => {
    setState(prev => {
      const newState = {
        ...prev,
        data,
        analytics: {
          ...prev.analytics,
          interactions: prev.analytics.interactions + 1
        }
      };

      // Generate prompt segments if enabled
      if (prev.config.dataFlow.syncWithDynamicPrompt) {
        const integrations = createPromptIntegrations(prev.config.patternType);
        const promptSegments = integrations.map(integration => ({
          id: integration.segmentId,
          label: integration.label,
          value: integration.formatForPrompt(integration.extractValueFromPattern(data)),
          type: 'data' as const,
          color: 'border-l-blue-400',
          required: false
        }));
        newState.promptSegments = promptSegments;

        // Notify parent of changes
        if (onDataChange) {
          onDataChange(data, promptSegments);
        }
      }

      return newState;
    });
  }, [onDataChange]);

  const updateConfig = useCallback((configUpdate: Partial<InteractionPatternConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...configUpdate }
    }));
  }, []);

  const markComplete = useCallback(() => {
    setState(prev => {
      const completedState = {
        ...prev,
        isComplete: true,
        analytics: {
          ...prev.analytics,
          completionTime: new Date(),
          patternEffectiveness: calculateEffectiveness(prev)
        }
      };

      if (onComplete) {
        onComplete(prev.data, completedState.analytics);
      }

      return completedState;
    });
  }, [onComplete]);

  const generatePromptSegments = useCallback((): PromptSegment[] => {
    if (!state.data) return [];

    const integrations = createPromptIntegrations(state.config.patternType);
    return integrations.map(integration => ({
      id: integration.segmentId,
      label: integration.label,
      value: integration.formatForPrompt(integration.extractValueFromPattern(state.data)),
      type: 'data' as const,
      color: 'border-l-blue-400',
      required: false
    }));
  }, [state.data, state.config.patternType]);

  const trackInteraction = useCallback((type: string, data?: any) => {
    if (!state.config.dataFlow.trackUserInteractions) return;

    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        interactions: prev.analytics.interactions + 1
      }
    }));

    // Optional: Send analytics to external service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'interaction_pattern_event', {
        pattern_type: state.config.patternType,
        interaction_type: type,
        character_theme: state.config.characterTheme
      });
    }
  }, [state.config]);

  const resetState = useCallback(() => {
    setState({
      config: initialConfig,
      data: null,
      isComplete: false,
      promptSegments: [],
      analytics: {
        startTime: new Date(),
        interactions: 0
      }
    });
  }, [initialConfig]);

  // Auto-save functionality
  useEffect(() => {
    if (state.config.dataFlow.autoSave && state.data) {
      const saveKey = `interaction-pattern-${state.config.patternType}-${state.config.characterTheme}`;
      localStorage.setItem(saveKey, JSON.stringify({
        data: state.data,
        timestamp: new Date().toISOString()
      }));
    }
  }, [state.data, state.config]);

  const contextValue: InteractionPatternContextValue = {
    state,
    updateData,
    updateConfig,
    markComplete,
    generatePromptSegments,
    trackInteraction,
    resetState
  };

  return (
    <InteractionPatternContext.Provider value={contextValue}>
      {children}
    </InteractionPatternContext.Provider>
  );
};

export const useInteractionPattern = (): InteractionPatternContextValue => {
  const context = useContext(InteractionPatternContext);
  if (!context) {
    throw new Error('useInteractionPattern must be used within an InteractionPatternProvider');
  }
  return context;
};

// Helper function to calculate pattern effectiveness
function calculateEffectiveness(state: InteractionPatternState): number {
  const timeTaken = new Date().getTime() - state.analytics.startTime.getTime();
  const timeInMinutes = timeTaken / (1000 * 60);
  
  // Base effectiveness on completion time and interaction count
  // Lower time and fewer interactions = higher effectiveness
  const timeScore = Math.max(0, 10 - timeInMinutes / 2); // Penalize longer times
  const interactionScore = Math.max(0, 10 - state.analytics.interactions / 5); // Penalize too many interactions
  
  // Weighted average
  return Math.min(10, (timeScore * 0.6 + interactionScore * 0.4));
}

// Hook for pattern-specific analytics
export const usePatternAnalytics = () => {
  const { state, trackInteraction } = useInteractionPattern();
  
  const getAnalyticsSummary = useCallback(() => {
    const { analytics } = state;
    const duration = analytics.completionTime 
      ? analytics.completionTime.getTime() - analytics.startTime.getTime()
      : new Date().getTime() - analytics.startTime.getTime();
    
    return {
      duration: Math.round(duration / 1000), // in seconds
      interactions: analytics.interactions,
      effectiveness: analytics.patternEffectiveness,
      isComplete: state.isComplete,
      patternType: state.config.patternType
    };
  }, [state]);

  return {
    analytics: state.analytics,
    trackInteraction,
    getAnalyticsSummary
  };
};