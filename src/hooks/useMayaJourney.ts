import { useState, useEffect, useCallback } from 'react';
import { MayaJourneyState } from '@/components/lesson/chat/lyra/maya/Chapter2ContextualQuestions';

export interface UseMayaJourneyReturn {
  journeyState: MayaJourneyState;
  setJourneyState: React.Dispatch<React.SetStateAction<MayaJourneyState>>;
  completeStage: (stageName: string) => void;
  updatePaceProgress: (component: keyof MayaJourneyState['paceFrameworkProgress']) => void;
  updateTemplateProgress: (progress: number) => void;
  resetJourney: () => void;
  isStageCompleted: (stageName: string) => boolean;
  getPaceCompletionPercentage: () => number;
}

const defaultJourneyState: MayaJourneyState = {
  completedStages: [],
  currentStage: 'intro',
  paceFrameworkProgress: {
    purpose: false,
    audience: false,
    context: false,
    execution: false
  },
  templateLibraryProgress: 0,
  donorSegmentationComplete: false
};

/**
 * Hook for tracking Maya's journey progress through Chapter 2
 * Manages PACE framework progression, template building, and stage completion
 */
export const useMayaJourney = (initialState?: Partial<MayaJourneyState>): UseMayaJourneyReturn => {
  const [journeyState, setJourneyState] = useState<MayaJourneyState>({
    ...defaultJourneyState,
    ...initialState
  });

  // Complete a stage and advance to next
  const completeStage = useCallback((stageName: string) => {
    setJourneyState(prev => {
      // Avoid duplicates
      if (prev.completedStages.includes(stageName)) {
        return prev;
      }
      
      const newCompletedStages = [...prev.completedStages, stageName];
      
      // Auto-advance current stage based on completion
      let newCurrentStage = prev.currentStage;
      
      const stageProgression = {
        'intro': 'pace-introduction',
        'pace-introduction': 'purpose-identification',
        'purpose-identification': 'audience-analysis',
        'audience-analysis': 'context-awareness',
        'context-awareness': 'execution-planning',
        'execution-planning': 'template-creation',
        'template-creation': 'personalization-practice',
        'personalization-practice': 'maya-mastery-complete'
      };
      
      // If current stage is completed, advance to next
      if (stageName === prev.currentStage) {
        newCurrentStage = stageProgression[prev.currentStage as keyof typeof stageProgression] || prev.currentStage;
      }
      
      return {
        ...prev,
        completedStages: newCompletedStages,
        currentStage: newCurrentStage
      };
    });
  }, []);

  // Update PACE framework component progress
  const updatePaceProgress = useCallback((component: keyof MayaJourneyState['paceFrameworkProgress']) => {
    setJourneyState(prev => ({
      ...prev,
      paceFrameworkProgress: {
        ...prev.paceFrameworkProgress,
        [component]: true
      }
    }));
    
    // Auto-complete related stages
    const componentStageMap = {
      purpose: 'pace-purpose-complete',
      audience: 'pace-audience-complete',
      context: 'pace-context-complete',
      execution: 'pace-execution-complete'
    };
    
    completeStage(componentStageMap[component]);
  }, [completeStage]);

  // Update template library progress (0-100)
  const updateTemplateProgress = useCallback((progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    
    setJourneyState(prev => ({
      ...prev,
      templateLibraryProgress: Math.max(prev.templateLibraryProgress, clampedProgress)
    }));
    
    // Auto-complete stages based on progress
    if (progress >= 25) completeStage('template-discovery');
    if (progress >= 50) completeStage('template-creation-started');
    if (progress >= 75) completeStage('template-library-building');
    if (progress >= 100) completeStage('template-library-complete');
  }, [completeStage]);

  // Reset journey to initial state
  const resetJourney = useCallback(() => {
    setJourneyState({
      ...defaultJourneyState,
      ...initialState
    });
  }, [initialState]);

  // Check if a stage is completed
  const isStageCompleted = useCallback((stageName: string): boolean => {
    return journeyState.completedStages.includes(stageName);
  }, [journeyState.completedStages]);

  // Get PACE framework completion percentage
  const getPaceCompletionPercentage = useCallback((): number => {
    const completed = Object.values(journeyState.paceFrameworkProgress).filter(Boolean).length;
    return (completed / 4) * 100;
  }, [journeyState.paceFrameworkProgress]);

  // Auto-save to localStorage for persistence across sessions
  useEffect(() => {
    const saveKey = 'maya-journey-state';
    try {
      localStorage.setItem(saveKey, JSON.stringify(journeyState));
    } catch (error) {
      console.warn('Could not save Maya journey state to localStorage:', error);
    }
  }, [journeyState]);

  // Load from localStorage on mount
  useEffect(() => {
    const saveKey = 'maya-journey-state';
    try {
      const saved = localStorage.getItem(saveKey);
      if (saved && !initialState) {
        const parsedState = JSON.parse(saved);
        setJourneyState(prev => ({ ...prev, ...parsedState }));
      }
    } catch (error) {
      console.warn('Could not load Maya journey state from localStorage:', error);
    }
  }, [initialState]);

  return {
    journeyState,
    setJourneyState,
    completeStage,
    updatePaceProgress,
    updateTemplateProgress,
    resetJourney,
    isStageCompleted,
    getPaceCompletionPercentage
  };
};

export default useMayaJourney;