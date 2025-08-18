/**
 * Shared configuration and utilities for interaction patterns
 */

export interface InteractionPatternConfig {
  patternType: 'conversational' | 'decision-tree' | 'priority-cards' | 'preference-sliders' | 'timeline-scenario';
  characterTheme: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  integrationMode: 'standalone' | 'embedded' | 'modal';
  dataFlow: {
    autoSave: boolean;
    syncWithDynamicPrompt: boolean;
    trackUserInteractions: boolean;
    generateInsights: boolean;
  };
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  customization: {
    theme: Record<string, string>;
    layout: 'compact' | 'standard' | 'expanded';
    animation: 'minimal' | 'standard' | 'rich';
  };
}

export const defaultPatternConfig: InteractionPatternConfig = {
  patternType: 'conversational',
  characterTheme: 'default',
  integrationMode: 'embedded',
  dataFlow: {
    autoSave: true,
    syncWithDynamicPrompt: true,
    trackUserInteractions: true,
    generateInsights: true
  },
  accessibility: {
    screenReader: true,
    keyboardNavigation: true,
    highContrast: false,
    reducedMotion: false
  },
  customization: {
    theme: {},
    layout: 'standard',
    animation: 'standard'
  }
};

/**
 * Creates a configuration for interaction patterns with Carmen integration
 */
export function createInteractionPatternConfig(
  overrides: Partial<InteractionPatternConfig> = {}
): InteractionPatternConfig {
  return {
    ...defaultPatternConfig,
    ...overrides,
    dataFlow: {
      ...defaultPatternConfig.dataFlow,
      ...overrides.dataFlow
    },
    accessibility: {
      ...defaultPatternConfig.accessibility,
      ...overrides.accessibility
    },
    customization: {
      ...defaultPatternConfig.customization,
      ...overrides.customization,
      theme: {
        ...defaultPatternConfig.customization.theme,
        ...overrides.customization?.theme
      }
    }
  };
}

/**
 * Pattern-specific configurations for Carmen components
 */
export const carmenPatternConfigs = {
  performanceInsights: createInteractionPatternConfig({
    patternType: 'conversational',
    characterTheme: 'carmen',
    dataFlow: {
      autoSave: true,
      syncWithDynamicPrompt: true,
      trackUserInteractions: true,
      generateInsights: true
    }
  }),

  engagementBuilder: createInteractionPatternConfig({
    patternType: 'decision-tree',
    characterTheme: 'carmen',
    customization: {
      layout: 'expanded',
      animation: 'rich',
      theme: {
        primary: 'purple-600',
        secondary: 'cyan-500'
      }
    }
  }),

  retentionMastery: createInteractionPatternConfig({
    patternType: 'priority-cards',
    characterTheme: 'carmen',
    dataFlow: {
      autoSave: true,
      syncWithDynamicPrompt: true,
      trackUserInteractions: true,
      generateInsights: true
    }
  }),

  talentAcquisition: createInteractionPatternConfig({
    patternType: 'preference-sliders',
    characterTheme: 'carmen',
    customization: {
      layout: 'standard',
      animation: 'standard',
      theme: {}
    }
  }),

  leadershipDevelopment: createInteractionPatternConfig({
    patternType: 'timeline-scenario',
    characterTheme: 'carmen',
    dataFlow: {
      autoSave: true,
      syncWithDynamicPrompt: true,
      trackUserInteractions: true,
      generateInsights: true
    }
  })
};

/**
 * Integration helpers for DynamicPromptBuilder
 */
export interface PromptIntegration {
  segmentId: string;
  label: string;
  extractValueFromPattern: (data: any) => string;
  formatForPrompt: (value: string) => string;
}

export const createPromptIntegrations = (
  patternType: InteractionPatternConfig['patternType']
): PromptIntegration[] => {
  const integrations: Record<string, PromptIntegration[]> = {
    conversational: [
      {
        segmentId: 'conversation-insights',
        label: 'Conversation Insights',
        extractValueFromPattern: (responses) => {
          return Object.values(responses)
            .map((r: any) => `${r.questionId}: ${r.value}`)
            .join(', ');
        },
        formatForPrompt: (value) => `Based on conversation: ${value}`
      }
    ],
    
    'decision-tree': [
      {
        segmentId: 'decision-path',
        label: 'Decision Path',
        extractValueFromPattern: (state) => {
          return state.decisionPath
            .map((p: any) => p.nodeId)
            .join(' → ');
        },
        formatForPrompt: (value) => `Decision path taken: ${value}`
      }
    ],
    
    'priority-cards': [
      {
        segmentId: 'priority-ranking',
        label: 'Priority Ranking',
        extractValueFromPattern: (cards) => {
          return cards
            .slice(0, 5)
            .map((c: any, i: number) => `${i + 1}. ${c.title}`)
            .join(', ');
        },
        formatForPrompt: (value) => `Top priorities: ${value}`
      }
    ],
    
    'preference-sliders': [
      {
        segmentId: 'preference-values',
        label: 'Preference Values',
        extractValueFromPattern: (values) => {
          return Object.entries(values)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        },
        formatForPrompt: (value) => `Preference settings: ${value}`
      }
    ],
    
    'timeline-scenario': [
      {
        segmentId: 'timeline-events',
        label: 'Timeline Events',
        extractValueFromPattern: (scenarios) => {
          const activeScenario = scenarios[0];
          return activeScenario?.events
            .slice(0, 5)
            .map((e: any) => e.title)
            .join(', ');
        },
        formatForPrompt: (value) => `Key timeline events: ${value}`
      }
    ]
  };

  return integrations[patternType] || [];
};