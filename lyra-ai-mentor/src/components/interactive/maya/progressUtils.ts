import { useState, useEffect } from 'react';
import { MayaJourneyState, MayaJourneyProgress, calculateMayaProgress } from './types';

// Custom hook for Maya progress tracking
export function useMayaProgress(journeyState: MayaJourneyState) {
  const [progress, setProgress] = useState<MayaJourneyProgress>(() => 
    calculateMayaProgress(journeyState)
  );

  useEffect(() => {
    const newProgress = calculateMayaProgress(journeyState);
    setProgress(newProgress);
  }, [journeyState]);

  return progress;
}

// Progress storage utilities
const STORAGE_KEY_PREFIX = 'maya_progress_';

export function saveMayaProgress(componentId: string, journeyState: MayaJourneyState) {
  try {
    const key = `${STORAGE_KEY_PREFIX}${componentId}`;
    const data = {
      journeyState,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save Maya progress:', error);
  }
}

export function loadMayaProgress(componentId: string): MayaJourneyState | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${componentId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    // Check if data is not too old (24 hours)
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data.journeyState;
  } catch (error) {
    console.error('Failed to load Maya progress:', error);
    return null;
  }
}

// Progress animation utilities
export const progressAnimationVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export const stageTransitionConfig = {
  duration: 0.3,
  ease: "easeInOut"
};

// Progress celebration utilities
export function shouldCelebrate(oldProgress: MayaJourneyProgress, newProgress: MayaJourneyProgress): boolean {
  // Celebrate when completing a new skill
  if (newProgress.completedSkills > oldProgress.completedSkills) {
    return true;
  }
  
  // Celebrate when advancing to a new stage
  if (newProgress.currentStageIndex > oldProgress.currentStageIndex) {
    return true;
  }
  
  return false;
}

export function getProgressMessage(progress: MayaJourneyProgress): string {
  const { currentStageIndex, totalStages, completedSkills, totalSkills } = progress;
  
  if (completedSkills === totalSkills) {
    return "🎉 Congratulations! You've mastered all communication skills!";
  }
  
  if (currentStageIndex === totalStages - 1) {
    return "🚀 You're on the final stage! Keep going!";
  }
  
  if (completedSkills === 0) {
    return "👋 Welcome to Maya's journey! Let's build your communication skills.";
  }
  
  if (completedSkills >= totalSkills / 2) {
    return "⭐ Great progress! You're over halfway there!";
  }
  
  return `📈 Stage ${currentStageIndex + 1} of ${totalStages} - Keep up the great work!`;
}

// Export helper for creating consistent progress displays
export function formatProgressText(current: number, total: number): string {
  return `${current}/${total}`;
}

export function formatSkillsText(completed: number, total: number): string {
  const skillWord = completed === 1 ? 'Skill' : 'Skills';
  return `${completed}/${total} ${skillWord} Mastered`;
}

export function formatStageText(current: number, total: number): string {
  return `Stage ${current}/${total}`;
}