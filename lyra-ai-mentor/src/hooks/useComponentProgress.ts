import { useEffect, useRef } from 'react';
import { useProgress } from '@/contexts/ProgressContext';

interface UseComponentProgressOptions {
  componentId: string;
  autoStart?: boolean;
  completionThreshold?: number; // 0-100, percentage of component interaction to consider "complete"
}

export const useComponentProgress = ({
  componentId,
  autoStart = true,
  completionThreshold = 80
}: UseComponentProgressOptions) => {
  const { startComponent, completeComponent, getComponentProgress } = useProgress();
  const hasStarted = useRef(false);
  const hasCompleted = useRef(false);
  const interactionScore = useRef(0);

  useEffect(() => {
    if (autoStart && !hasStarted.current) {
      hasStarted.current = true;
      startComponent(componentId);
    }

    return () => {
      // Auto-complete on unmount if threshold reached
      if (!hasCompleted.current && interactionScore.current >= completionThreshold) {
        markAsComplete(interactionScore.current);
      }
    };
  }, [componentId, autoStart]);

  const trackInteraction = (points: number = 10) => {
    interactionScore.current = Math.min(100, interactionScore.current + points);
    
    // Auto-complete when threshold is reached
    if (!hasCompleted.current && interactionScore.current >= completionThreshold) {
      markAsComplete(interactionScore.current);
    }
  };

  const markAsComplete = (score?: number) => {
    if (!hasCompleted.current) {
      hasCompleted.current = true;
      completeComponent(componentId, score || interactionScore.current);
    }
  };

  const progress = getComponentProgress(componentId);

  return {
    isCompleted: progress?.completedAt !== undefined,
    timeSpent: progress?.timeSpent || 0,
    trackInteraction,
    markAsComplete,
    progress
  };
};