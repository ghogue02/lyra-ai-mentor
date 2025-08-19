// Export all error boundary components
export { ApplicationErrorBoundary } from './ApplicationErrorBoundary';
export { InteractionPatternErrorBoundary } from './InteractionPatternErrorBoundary';
export { CarmenComponentErrorBoundary } from './CarmenComponentErrorBoundary';
export { AsyncErrorBoundary } from './AsyncErrorBoundary';

// Re-export enhanced error boundary from performance module for backward compatibility
export { EnhancedErrorBoundary } from '../performance/ErrorBoundary';

// Export error handling utilities
export { ErrorLogger } from '@/utils/error-handling/ErrorLogger';
export { ErrorRecoveryManager } from '@/utils/error-handling/ErrorRecoveryManager';
export { NetworkErrorHandler } from '@/utils/error-handling/NetworkErrorHandler';

// Export hooks
export { useErrorNotification } from '@/hooks/error-handling/useErrorNotification';
export { useErrorRecovery } from '@/hooks/error-handling/useErrorRecovery';

// Error boundary wrapper component for easy integration
import * as React from 'react';
import { ApplicationErrorBoundary } from './ApplicationErrorBoundary';
import { InteractionPatternErrorBoundary } from './InteractionPatternErrorBoundary';
import { CarmenComponentErrorBoundary } from './CarmenComponentErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  type: 'application' | 'interaction-pattern' | 'carmen-component';
  context?: string;
  patternType?: 'conversational' | 'decision-tree' | 'priority-cards' | 'preference-sliders' | 'timeline-scenario' | 'engagement-tree';
  componentType?: 'engagement-builder' | 'cultural-intelligence' | 'leadership-development' | 'people-management' | 'performance-insights' | 'retention-mastery' | 'talent-acquisition' | 'team-dynamics';
  chapterNumber?: number;
  enableAutoRecovery?: boolean;
  maxRetries?: number;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo, context?: string) => void;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
  type,
  context,
  patternType,
  componentType,
  chapterNumber,
  enableAutoRecovery = true,
  maxRetries = 3,
  showDetails = process.env.NODE_ENV === 'development',
  onError
}) => {
  switch (type) {
    case 'application':
      return React.createElement(ApplicationErrorBoundary, {
        context,
        enableAutoRecovery,
        maxRetries,
        showDetails,
        onError
      }, children);
    
    case 'interaction-pattern':
      if (!patternType) {
        throw new Error('patternType is required for interaction-pattern error boundary');
      }
      return React.createElement(InteractionPatternErrorBoundary, {
        patternType,
        enableFallbackMode: true,
        maxRetries,
        onError
      }, children);
    
    case 'carmen-component':
      if (!componentType) {
        throw new Error('componentType is required for carmen-component error boundary');
      }
      return React.createElement(CarmenComponentErrorBoundary, {
        componentType,
        chapterNumber,
        enableChapterRecovery: true,
        maxRetries,
        onError
      }, children);
    
    default:
      throw new Error(`Unknown error boundary type: ${type}`);
  }
};