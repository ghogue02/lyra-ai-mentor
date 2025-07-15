import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface StageProgressionOptions {
  componentId: string;
  totalStages: number;
  allowSkipping?: boolean;
  persistProgress?: boolean;
  onStageChange?: (stage: number) => void;
  onComplete?: () => void;
}

export const useStageProgression = ({
  componentId,
  totalStages,
  allowSkipping = false,
  persistProgress = true,
  onStageChange,
  onComplete
}: StageProgressionOptions) => {
  const storageKey = `maya-stage-${componentId}`;
  
  // Initialize stage from localStorage if persistence is enabled
  const [currentStage, setCurrentStage] = useState<number>(() => {
    if (persistProgress) {
      const saved = localStorage.getItem(storageKey);
      const savedStage = saved ? parseInt(saved, 10) : 0;
      // Validate saved stage is within bounds
      return savedStage >= 0 && savedStage < totalStages ? savedStage : 0;
    }
    return 0;
  });
  
  const [stageHistory, setStageHistory] = useState<number[]>([0]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Calculate progress percentage
  const progress = Math.round((currentStage / (totalStages - 1)) * 100);
  
  // Save stage to localStorage when it changes
  useEffect(() => {
    if (persistProgress) {
      localStorage.setItem(storageKey, currentStage.toString());
    }
  }, [currentStage, persistProgress, storageKey]);
  
  const canMoveToStage = useCallback((targetStage: number): boolean => {
    // Validate stage is within bounds
    if (targetStage < 0 || targetStage >= totalStages) {
      return false;
    }
    
    // If skipping is allowed, any valid stage is accessible
    if (allowSkipping) {
      return true;
    }
    
    // Otherwise, can only move to adjacent stages or visited stages
    const isAdjacent = Math.abs(targetStage - currentStage) === 1;
    const wasVisited = stageHistory.includes(targetStage);
    
    return isAdjacent || wasVisited;
  }, [currentStage, totalStages, allowSkipping, stageHistory]);
  
  const moveToStage = useCallback((targetStage: number): boolean => {
    if (!canMoveToStage(targetStage)) {
      toast.error('Please complete the current step before proceeding');
      return false;
    }
    
    setCurrentStage(targetStage);
    
    // Track stage history
    if (!stageHistory.includes(targetStage)) {
      setStageHistory(prev => [...prev, targetStage]);
    }
    
    // Call stage change callback
    onStageChange?.(targetStage);
    
    // Check if completed
    if (targetStage === totalStages - 1) {
      setIsCompleted(true);
      onComplete?.();
    }
    
    return true;
  }, [canMoveToStage, totalStages, stageHistory, onStageChange, onComplete]);
  
  const nextStage = useCallback((): boolean => {
    return moveToStage(currentStage + 1);
  }, [currentStage, moveToStage]);
  
  const previousStage = useCallback((): boolean => {
    return moveToStage(currentStage - 1);
  }, [currentStage, moveToStage]);
  
  const resetProgression = useCallback(() => {
    setCurrentStage(0);
    setStageHistory([0]);
    setIsCompleted(false);
    if (persistProgress) {
      localStorage.removeItem(storageKey);
    }
  }, [persistProgress, storageKey]);
  
  const isFirstStage = currentStage === 0;
  const isLastStage = currentStage === totalStages - 1;
  
  return {
    currentStage,
    progress,
    isCompleted,
    isFirstStage,
    isLastStage,
    canMoveToStage,
    moveToStage,
    nextStage,
    previousStage,
    resetProgression,
    stageHistory
  };
};

// Stage validation helper for complex flows
export const validateStageTransition = (
  from: string | number,
  to: string | number,
  rules: Record<string, string[]>
): boolean => {
  const fromKey = from.toString();
  const toKey = to.toString();
  
  // If no rules defined, allow all transitions
  if (!rules[fromKey]) {
    return true;
  }
  
  // Check if target stage is in allowed list
  return rules[fromKey].includes(toKey);
};