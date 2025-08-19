import React from 'react';
import { CarmenComponentErrorBoundary } from '@/components/error-boundaries';

interface CarmenComponentWrapperProps {
  children: React.ReactNode;
  componentType: 'engagement-builder' | 'cultural-intelligence' | 'leadership-development' | 'people-management' | 'performance-insights' | 'retention-mastery' | 'talent-acquisition' | 'team-dynamics';
  chapterNumber?: number;
  enableChapterRecovery?: boolean;
  maxRetries?: number;
}

/**
 * Wrapper component that provides error handling for Carmen's components
 * Use this to wrap any Carmen workshop or lesson component for chapter-aware error recovery
 */
export const CarmenComponentWrapper: React.FC<CarmenComponentWrapperProps> = ({
  children,
  componentType,
  chapterNumber,
  enableChapterRecovery = true,
  maxRetries = 3
}) => {
  return (
    <CarmenComponentErrorBoundary
      componentType={componentType}
      chapterNumber={chapterNumber}
      enableChapterRecovery={enableChapterRecovery}
      maxRetries={maxRetries}
      onError={(error, errorInfo, type) => {
        // Log Carmen-specific error for analytics
        console.error(`Carmen component error in ${type}:`, error);
        
        // Could send to analytics service
        // analytics.track('carmen_component_error', {
        //   componentType: type,
        //   chapterNumber,
        //   error: error.message
        // });
      }}
    >
      {children}
    </CarmenComponentErrorBoundary>
  );
};

export default CarmenComponentWrapper;