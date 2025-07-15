import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Tutorial, TutorialProgress, TutorialContextType } from '../types/tutorial';
import { tutorials } from '../data/tutorials';
import { tutorialAnalytics } from '../services/tutorialAnalytics';

const TutorialContext = createContext<TutorialContextType | null>(null);

const STORAGE_KEY = 'lyra-tutorial-progress';

export { TutorialContext };

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, TutorialProgress>>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to load tutorial progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const startTutorial = useCallback((tutorialId: string) => {
    const tutorial = tutorials.find(t => t.id === tutorialId);
    if (!tutorial) {
      console.error(`Tutorial with id ${tutorialId} not found`);
      return;
    }

    setActiveTutorial(tutorial);
    setCurrentStepIndex(0);

    // Start analytics tracking
    tutorialAnalytics.startTutorialTracking(tutorialId);

    // Update progress
    setProgress(prev => ({
      ...prev,
      [tutorialId]: {
        tutorialId,
        currentStep: 0,
        completed: false,
        startedAt: new Date(),
      },
    }));
  }, []);

  const endTutorial = useCallback(async (completed = false) => {
    if (!activeTutorial) return;

    const tutorialProgress = {
      ...progress[activeTutorial.id],
      completed,
      completedAt: completed ? new Date() : undefined,
      currentStep: currentStepIndex,
    };

    setProgress(prev => ({
      ...prev,
      [activeTutorial.id]: tutorialProgress,
    }));

    // Track completion in analytics
    await tutorialAnalytics.completeTutorial(
      activeTutorial.id,
      tutorialProgress,
      activeTutorial
    );

    setActiveTutorial(null);
    setCurrentStepIndex(0);
  }, [activeTutorial, currentStepIndex, progress]);

  const nextStep = useCallback(() => {
    if (!activeTutorial) return;

    if (currentStepIndex < activeTutorial.steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      
      // Track step progress in analytics
      tutorialAnalytics.trackStepProgress(activeTutorial.id, newIndex);
      
      setProgress(prev => ({
        ...prev,
        [activeTutorial.id]: {
          ...prev[activeTutorial.id],
          currentStep: newIndex,
        },
      }));
    } else {
      // Tutorial completed
      endTutorial(true);
    }
  }, [activeTutorial, currentStepIndex, endTutorial]);

  const previousStep = useCallback(() => {
    if (!activeTutorial || currentStepIndex === 0) return;

    const newIndex = currentStepIndex - 1;
    setCurrentStepIndex(newIndex);
    
    setProgress(prev => ({
      ...prev,
      [activeTutorial.id]: {
        ...prev[activeTutorial.id],
        currentStep: newIndex,
      },
    }));
  }, [activeTutorial, currentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (!activeTutorial || index < 0 || index >= activeTutorial.steps.length) return;

    setCurrentStepIndex(index);
    
    // Track step navigation in analytics
    tutorialAnalytics.trackStepProgress(activeTutorial.id, index);
    
    setProgress(prev => ({
      ...prev,
      [activeTutorial.id]: {
        ...prev[activeTutorial.id],
        currentStep: index,
      },
    }));
  }, [activeTutorial]);

  const skipTutorial = useCallback(async () => {
    if (!activeTutorial) return;

    const tutorialProgress = {
      ...progress[activeTutorial.id],
      skipped: true,
      currentStep: currentStepIndex,
    };

    setProgress(prev => ({
      ...prev,
      [activeTutorial.id]: tutorialProgress,
    }));

    // Track skip in analytics
    await tutorialAnalytics.completeTutorial(
      activeTutorial.id,
      tutorialProgress,
      activeTutorial
    );

    endTutorial(false);
  }, [activeTutorial, currentStepIndex, endTutorial, progress]);

  const resetProgress = useCallback((tutorialId?: string) => {
    if (tutorialId) {
      setProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[tutorialId];
        return newProgress;
      });
    } else {
      setProgress({});
    }
  }, []);

  const getTutorialProgress = useCallback((tutorialId: string) => {
    return progress[tutorialId];
  }, [progress]);

  const isTutorialCompleted = useCallback((tutorialId: string) => {
    return progress[tutorialId]?.completed || false;
  }, [progress]);

  const getCompletionPercentage = useCallback(() => {
    const totalTutorials = tutorials.length;
    const completedTutorials = Object.values(progress).filter(p => p.completed).length;
    return totalTutorials > 0 ? (completedTutorials / totalTutorials) * 100 : 0;
  }, [progress]);

  const value: TutorialContextType = {
    activeTutorial,
    currentStepIndex,
    isActive: !!activeTutorial,
    progress,
    startTutorial,
    endTutorial,
    nextStep,
    previousStep,
    goToStep,
    skipTutorial,
    resetProgress,
    getTutorialProgress,
    isTutorialCompleted,
    getCompletionPercentage,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};