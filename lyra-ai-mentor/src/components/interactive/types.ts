// Shared types for interactive components

// Standard completion data for components that track metrics
export interface ComponentCompletionData {
  timeSpent: number;
  recipesCreated?: number;
  transformationViewed?: boolean;
  actionsCompleted?: number;
  score?: number;
  [key: string]: any; // Allow additional component-specific data
}

// Base props for all interactive components
export interface BaseInteractiveComponentProps {
  onComplete?: () => void;
}

// Props for components that track detailed completion metrics
export interface MetricsInteractiveComponentProps {
  onComplete?: (data: ComponentCompletionData) => void;
}

// Learning path specific props
export interface LearningPathComponentProps extends MetricsInteractiveComponentProps {
  characterId?: string;
  lessonId?: string;
}

// AI-powered component specific props
export interface AIComponentProps extends BaseInteractiveComponentProps {
  enableAI?: boolean;
  aiModel?: string;
  temperature?: number;
  maxTokens?: number;
}

// Export type guards
export const hasMetricsCallback = (
  props: BaseInteractiveComponentProps | MetricsInteractiveComponentProps
): props is MetricsInteractiveComponentProps => {
  return 'onComplete' in props && props.onComplete?.length === 1;
};