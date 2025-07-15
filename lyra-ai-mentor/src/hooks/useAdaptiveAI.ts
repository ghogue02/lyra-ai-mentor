import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adaptiveAIService, AdaptiveCoachingSession, MayaPersonalityProfile, PredictiveSupport } from '@/services/adaptiveAIService';
import { progressTrackingService, MayaProgressMetrics } from '@/services/progressTrackingService';

export interface UseAdaptiveAIResult {
  // Profile management
  personalityProfile: MayaPersonalityProfile | null;
  isProfileLoading: boolean;
  updateProfile: (data: Partial<MayaPersonalityProfile>) => Promise<void>;
  
  // Real-time coaching
  coachingSession: AdaptiveCoachingSession | null;
  requestCoaching: (context: {
    currentActivity: string;
    stressLevel?: number;
    timeAvailable?: number;
    specificChallenge?: string;
    character: 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  }) => Promise<void>;
  
  // Predictive support
  predictiveSupport: PredictiveSupport | null;
  getPredictiveSupport: (activities: string[], timeframe: 'today' | 'this-week' | 'this-month') => Promise<void>;
  
  // Maya-specific metrics
  mayaMetrics: MayaProgressMetrics | null;
  refreshMayaMetrics: () => Promise<void>;
  
  // Voice coaching
  startVoiceSession: (sessionType: 'confidence-building' | 'stress-management' | 'skill-practice' | 'real-time-help') => Promise<void>;
  voiceSession: any | null;
  
  // Progress tracking integration
  trackMayaProgress: (elementId: number, metrics: {
    emailTimeBefore?: number;
    emailTimeAfter?: number;
    stressBefore?: number;
    stressAfter?: number;
    confidenceScore?: number;
    completionData?: Record<string, any>;
  }) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useAdaptiveAI = (): UseAdaptiveAIResult => {
  const { user } = useAuth();
  const [personalityProfile, setPersonalityProfile] = useState<MayaPersonalityProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [coachingSession, setCoachingSession] = useState<AdaptiveCoachingSession | null>(null);
  const [predictiveSupport, setPredictiveSupport] = useState<PredictiveSupport | null>(null);
  const [mayaMetrics, setMayaMetrics] = useState<MayaProgressMetrics | null>(null);
  const [voiceSession, setVoiceSession] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize user profile
  useEffect(() => {
    if (user?.id && !personalityProfile) {
      initializeProfile();
    }
  }, [user?.id]);

  const initializeProfile = async () => {
    if (!user?.id) return;
    
    setIsProfileLoading(true);
    try {
      const profile = await adaptiveAIService.createMayaPersonalityProfile(user.id);
      setPersonalityProfile(profile);
    } catch (err) {
      setError('Failed to initialize AI profile');
      console.error('Profile initialization error:', err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const updateProfile = useCallback(async (data: Partial<MayaPersonalityProfile>) => {
    if (!user?.id || !personalityProfile) return;

    try {
      // Update local state immediately
      setPersonalityProfile(prev => prev ? { ...prev, ...data } : null);
      
      // Re-create profile with updated data
      await adaptiveAIService.createMayaPersonalityProfile(user.id, {
        communicationStyle: data.communicationStyle,
        stressLevel: data.currentStressLevel,
        timeAvailable: data.timeConstraints === 'very-busy' ? 5 : data.timeConstraints === 'moderate' ? 15 : 30
      });
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    }
  }, [user?.id, personalityProfile]);

  const requestCoaching = useCallback(async (context: {
    currentActivity: string;
    stressLevel?: number;
    timeAvailable?: number;
    specificChallenge?: string;
    character: 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  }) => {
    if (!user?.id) return;

    try {
      const session = await adaptiveAIService.provideAdaptiveCoaching(user.id, context);
      setCoachingSession(session);
    } catch (err) {
      setError('Failed to get coaching session');
      console.error('Coaching request error:', err);
    }
  }, [user?.id]);

  const getPredictiveSupport = useCallback(async (
    activities: string[],
    timeframe: 'today' | 'this-week' | 'this-month'
  ) => {
    if (!user?.id) return;

    try {
      const support = await adaptiveAIService.providePredictiveSupport(user.id, activities, timeframe);
      setPredictiveSupport(support);
    } catch (err) {
      setError('Failed to get predictive support');
      console.error('Predictive support error:', err);
    }
  }, [user?.id]);

  const refreshMayaMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      const metrics = await progressTrackingService.getMayaTransformationMetrics(user.id);
      setMayaMetrics(metrics);
    } catch (err) {
      setError('Failed to refresh Maya metrics');
      console.error('Maya metrics error:', err);
    }
  }, [user?.id]);

  const startVoiceSession = useCallback(async (
    sessionType: 'confidence-building' | 'stress-management' | 'skill-practice' | 'real-time-help'
  ) => {
    if (!user?.id) return;

    try {
      const session = await adaptiveAIService.startVoiceCoachingSession(user.id, sessionType);
      setVoiceSession(session);
    } catch (err) {
      setError('Failed to start voice session');
      console.error('Voice session error:', err);
    }
  }, [user?.id]);

  const trackMayaProgress = useCallback(async (
    elementId: number,
    metrics: {
      emailTimeBefore?: number;
      emailTimeAfter?: number;
      stressBefore?: number;
      stressAfter?: number;
      confidenceScore?: number;
      completionData?: Record<string, any>;
    }
  ) => {
    if (!user?.id) return;

    try {
      await progressTrackingService.trackMayaEmailProgress(user.id, elementId, metrics);
      
      // Refresh metrics after tracking
      await refreshMayaMetrics();
      
      // Update personality profile if stress/confidence changed significantly
      if (personalityProfile && (metrics.stressAfter || metrics.confidenceScore)) {
        const newStress = metrics.stressAfter || personalityProfile.currentStressLevel;
        if (Math.abs(newStress - personalityProfile.currentStressLevel) > 2) {
          await updateProfile({ currentStressLevel: newStress });
        }
      }
    } catch (err) {
      setError('Failed to track Maya progress');
      console.error('Progress tracking error:', err);
    }
  }, [user?.id, personalityProfile, refreshMayaMetrics, updateProfile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-refresh Maya metrics when profile changes
  useEffect(() => {
    if (personalityProfile && user?.id) {
      refreshMayaMetrics();
    }
  }, [personalityProfile, user?.id, refreshMayaMetrics]);

  return {
    personalityProfile,
    isProfileLoading,
    updateProfile,
    coachingSession,
    requestCoaching,
    predictiveSupport,
    getPredictiveSupport,
    mayaMetrics,
    refreshMayaMetrics,
    startVoiceSession,
    voiceSession,
    trackMayaProgress,
    error,
    clearError
  };
};