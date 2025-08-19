import React from 'react';
import { InteractionPatternErrorBoundary } from '@/components/error-boundaries';

interface InteractionPatternWrapperProps {
  children: React.ReactNode;
  patternType: 'conversational' | 'decision-tree' | 'priority-cards' | 'preference-sliders' | 'timeline-scenario' | 'engagement-tree';
  enableFallbackMode?: boolean;
  maxRetries?: number;
}

/**
 * Wrapper component that provides error handling for interaction patterns
 * Use this to wrap any interaction pattern component to ensure robust error recovery
 */
export const InteractionPatternWrapper: React.FC<InteractionPatternWrapperProps> = ({
  children,
  patternType,
  enableFallbackMode = true,
  maxRetries = 3
}) => {
  return (
    <InteractionPatternErrorBoundary
      patternType={patternType}
      enableFallbackMode={enableFallbackMode}
      maxRetries={maxRetries}
      onError={(error, errorInfo, type) => {
        // Log pattern-specific error for analytics
        console.error(`Interaction pattern error in ${type}:`, error);
      }}
    >
      {children}
    </InteractionPatternErrorBoundary>
  );
};

export default InteractionPatternWrapper;