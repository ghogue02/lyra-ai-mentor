export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    handler: () => void;
  };
  allowInteraction?: boolean; // Allow interaction with highlighted element
  spotlightPadding?: number; // Padding around highlighted element
  mobilePosition?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // Override position on mobile
}

export interface Tutorial {
  id: string;
  name: string;
  description: string;
  steps: TutorialStep[];
  category?: string;
  estimatedTime?: number; // in minutes
  prerequisites?: string[]; // Other tutorial IDs that should be completed first
}

export interface TutorialProgress {
  tutorialId: string;
  currentStep: number;
  completed: boolean;
  startedAt?: Date;
  completedAt?: Date;
  skipped?: boolean;
}

export interface TutorialContextType {
  // State
  activeTutorial: Tutorial | null;
  currentStepIndex: number;
  isActive: boolean;
  progress: Record<string, TutorialProgress>;
  
  // Actions
  startTutorial: (tutorialId: string) => void;
  endTutorial: (completed?: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  skipTutorial: () => void;
  resetProgress: (tutorialId?: string) => void;
  
  // Helpers
  getTutorialProgress: (tutorialId: string) => TutorialProgress | undefined;
  isTutorialCompleted: (tutorialId: string) => boolean;
  getCompletionPercentage: () => number;
}