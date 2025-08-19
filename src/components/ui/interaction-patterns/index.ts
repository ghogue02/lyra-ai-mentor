// Export all interaction pattern components
export { ConversationalFlow } from './ConversationalFlow';
export type { 
  ConversationQuestion, 
  ConversationOption, 
  ConversationResponse,
  ConversationResponses,
  ConversationFlowProps 
} from './ConversationalFlow';

export { InteractiveDecisionTree } from './InteractiveDecisionTree';
export type {
  DecisionNode,
  DecisionChoice,
  DecisionOutcome,
  DecisionPath,
  DecisionTreeState,
  InteractiveDecisionTreeProps
} from './InteractiveDecisionTree';

export { PriorityCardSystem } from './PriorityCardSystem';
export type {
  PriorityCard,
  PriorityGroup,
  PriorityCardSystemProps
} from './PriorityCardSystem';

export { PreferenceSliderGrid } from './PreferenceSliderGrid';
export type {
  PreferenceSlider,
  SliderDependency,
  SliderPreset,
  RadarChartData,
  PreferenceSliderGridProps
} from './PreferenceSliderGrid';

export { TimelineScenarioBuilder } from './TimelineScenarioBuilder';
// TimelineScenarioBuilder types removed due to implementation issues

// Shared utilities
export { createInteractionPatternConfig } from './shared/patternConfig';
export { InteractionPatternProvider, useInteractionPattern } from './shared/InteractionPatternContext';
export { patternAnalytics } from './shared/analytics';
export { patternValidator } from './shared/validation';