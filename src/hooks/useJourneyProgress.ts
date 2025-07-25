import { useState, useEffect, useCallback } from 'react';
import { journeyProgressService, UserJourneyProgress, JourneyDefinition, JourneyScore } from '@/services/journeyProgressService';
import { toast } from 'sonner';

interface UseJourneyProgressOptions {
  journeyKey: string;
  autoStart?: boolean;
}

export const useJourneyProgress = ({ journeyKey, autoStart = false }: UseJourneyProgressOptions) => {
  const [progress, setProgress] = useState<UserJourneyProgress | null>(null);
  const [definition, setDefinition] = useState<JourneyDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [currentScore, setCurrentScore] = useState<JourneyScore | null>(null);

  // Load journey definition and progress
  useEffect(() => {
    const loadJourneyData = async () => {
      setLoading(true);
      
      // Load definition
      const def = await journeyProgressService.getJourneyDefinition(journeyKey);
      setDefinition(def);

      if (!def) {
        console.error(`Journey definition not found: ${journeyKey}`);
        setLoading(false);
        return;
      }

      // Load or start progress
      let prog = await journeyProgressService.getJourneyProgress(journeyKey);
      
      if (!prog && autoStart) {
        prog = await journeyProgressService.startJourney(journeyKey);
        if (prog) {
          toast.success(`Started ${def.name}!`);
        }
      }

      setProgress(prog);
      setLoading(false);
    };

    loadJourneyData();
  }, [journeyKey, autoStart]);

  const startJourney = useCallback(async () => {
    if (!definition) return false;

    const prog = await journeyProgressService.startJourney(journeyKey);
    if (prog) {
      setProgress(prog);
      toast.success(`Started ${definition.name}!`);
      return true;
    }
    return false;
  }, [journeyKey, definition]);

  const updateProgress = useCallback(async (updates: Partial<Pick<UserJourneyProgress, 'current_phase' | 'phase_data' | 'completion_data'>>) => {
    const updated = await journeyProgressService.updateJourneyProgress(journeyKey, updates);
    if (updated) {
      setProgress(updated);
      return true;
    }
    return false;
  }, [journeyKey]);

  const nextPhase = useCallback(async (phaseData?: any) => {
    if (!progress || !definition) return false;

    const nextPhaseNum = Math.min(progress.current_phase + 1, definition.total_phases);
    
    return await updateProgress({
      current_phase: nextPhaseNum,
      phase_data: {
        ...progress.phase_data,
        [`phase_${progress.current_phase}`]: phaseData
      }
    });
  }, [progress, definition, updateProgress]);

  const completeJourney = useCallback(async (finalData: any, score?: number) => {
    const completed = await journeyProgressService.completeJourney(journeyKey, finalData, score);
    if (completed) {
      setProgress(completed);
      
      if (definition) {
        toast.success(
          `🎉 Completed ${definition.name}!${score ? ` Score: ${Math.round(score)}%` : ''}`,
          { duration: 5000 }
        );
      }
      
      return true;
    }
    return false;
  }, [journeyKey, definition]);

  const scoreContent = useCallback(async (content: any, phase?: number) => {
    if (!definition?.scoring_enabled) return null;

    setScoring(true);
    const score = await journeyProgressService.scoreJourneyContent(journeyKey, content, phase);
    setCurrentScore(score);
    setScoring(false);

    return score;
  }, [journeyKey, definition]);

  const isCompleted = progress?.is_completed || false;
  const isStarted = progress !== null;
  const currentPhase = progress?.current_phase || 1;
  const totalPhases = definition?.total_phases || 1;
  const progressPercentage = definition ? Math.round((currentPhase / totalPhases) * 100) : 0;

  return {
    // State
    progress,
    definition,
    currentScore,
    loading,
    scoring,
    
    // Status
    isStarted,
    isCompleted,
    currentPhase,
    totalPhases,
    progressPercentage,
    
    // Actions
    startJourney,
    updateProgress,
    nextPhase,
    completeJourney,
    scoreContent
  };
};