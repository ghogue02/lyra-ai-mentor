import { useContext } from 'react';
import { TutorialContext } from '../contexts/TutorialContext';

export { useTutorial } from '../contexts/TutorialContext';

// Additional tutorial-specific hooks
export const useTutorialStep = (stepId: string) => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorialStep must be used within a TutorialProvider');
  }

  const { activeTutorial, currentStepIndex } = context;
  const currentStep = activeTutorial?.steps[currentStepIndex];
  
  return {
    isActive: currentStep?.id === stepId,
    isHighlighted: currentStep?.target !== undefined,
  };
};

export const useTutorialElement = (elementId: string) => {
  const context = useContext(TutorialContext);
  if (!context) {
    return { shouldHighlight: false };
  }

  const { activeTutorial, currentStepIndex } = context;
  const currentStep = activeTutorial?.steps[currentStepIndex];
  
  return {
    shouldHighlight: currentStep?.target === `[data-tutorial="${elementId}"]`,
    tutorialProps: {
      'data-tutorial': elementId,
    },
  };
};