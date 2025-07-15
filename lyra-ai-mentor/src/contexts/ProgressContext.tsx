import React, { createContext, useContext, useEffect, useState } from 'react';
import { gamificationService, ProgressData, Badge, ComponentProgress } from '@/services/gamificationService';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface ProgressContextType {
  progressData: ProgressData | null;
  badges: Badge[];
  unlockedBadges: Badge[];
  startComponent: (componentId: string) => void;
  completeComponent: (componentId: string, score?: number) => ComponentProgress;
  getComponentProgress: (componentId: string) => ComponentProgress | null;
  getSuggestedNextComponent: () => string | null;
  resetProgress: () => void;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: React.ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // Load initial progress
    refreshProgress();

    // Listen for badge unlock events
    const handleBadgeUnlock = (event: CustomEvent<Badge>) => {
      const badge = event.detail;
      
      // Trigger celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Show notification
      toast.success(
        <div className="flex items-center gap-3">
          <span className="text-2xl">{badge.icon}</span>
          <div>
            <div className="font-semibold">Badge Unlocked!</div>
            <div className="text-sm text-gray-600">{badge.name}</div>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );

      // Refresh progress to update UI
      refreshProgress();
    };

    // Listen for level up events
    const handleLevelUp = (event: CustomEvent<{ level: number }>) => {
      const { level } = event.detail;

      // Bigger celebration for level up
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });

      // Show notification
      toast.success(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-semibold">Level Up!</div>
            <div className="text-sm text-gray-600">You reached level {level}</div>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );

      // Refresh progress
      refreshProgress();
    };

    window.addEventListener('badge-unlocked', handleBadgeUnlock as EventListener);
    window.addEventListener('level-up', handleLevelUp as EventListener);

    return () => {
      window.removeEventListener('badge-unlocked', handleBadgeUnlock as EventListener);
      window.removeEventListener('level-up', handleLevelUp as EventListener);
    };
  }, []);

  const refreshProgress = async () => {
    await gamificationService.loadProgress();
    const progress = gamificationService.getProgress();
    const allBadges = gamificationService.getBadges();
    const unlocked = gamificationService.getUnlockedBadges();

    setProgressData(progress);
    setBadges(allBadges);
    setUnlockedBadges(unlocked);
  };

  const startComponent = (componentId: string) => {
    gamificationService.startComponent(componentId);
  };

  const completeComponent = (componentId: string, score?: number): ComponentProgress => {
    const result = gamificationService.completeComponent(componentId, score);
    
    // Small celebration for component completion
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 45,
      origin: { x: 0.5, y: 0.8 },
      colors: ['#10B981', '#3B82F6', '#8B5CF6']
    });

    // Refresh UI
    refreshProgress();
    
    return result;
  };

  const getComponentProgress = (componentId: string): ComponentProgress | null => {
    return gamificationService.getComponentProgress(componentId);
  };

  const getSuggestedNextComponent = (): string | null => {
    return gamificationService.getSuggestedNextComponent();
  };

  const resetProgress = () => {
    gamificationService.resetProgress();
    refreshProgress();
  };

  const value: ProgressContextType = {
    progressData,
    badges,
    unlockedBadges,
    startComponent,
    completeComponent,
    getComponentProgress,
    getSuggestedNextComponent,
    resetProgress,
    refreshProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};