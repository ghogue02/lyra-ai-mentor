import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  analyticsService, 
  ElementEventType, 
  trackElementEvent, 
  startTimeTracking, 
  stopTimeTracking,
  ABTestVariant
} from '@/analytics/InteractiveElementAnalytics';

interface UseElementAnalyticsProps {
  elementId: number;
  elementType: string;
  lessonId: number;
  onComplete?: () => void;
  enableABTesting?: boolean;
}

interface UseElementAnalyticsReturn {
  // Tracking functions
  trackStart: () => void;
  trackComplete: () => void;
  trackInteraction: (interactionType: string, data?: Record<string, any>) => void;
  trackPhaseStart: (phaseName: string) => void;
  trackPhaseComplete: (phaseName: string) => void;
  trackError: (error: string, context?: Record<string, any>) => void;
  trackRetry: (attemptNumber: number) => void;
  trackHelp: (helpType: string) => void;
  trackHint: (hintId: string) => void;
  trackAbandonment: () => void;
  
  // Time tracking
  startTimer: (phase?: string) => void;
  stopTimer: (phase?: string) => number;
  
  // A/B testing
  variant?: ABTestVariant;
  trackVariantConversion: () => void;
}

export const useElementAnalytics = ({
  elementId,
  elementType,
  lessonId,
  onComplete,
  enableABTesting = false
}: UseElementAnalyticsProps): UseElementAnalyticsReturn => {
  const { user } = useAuth();
  const hasTrackedStart = useRef(false);
  const variant = useRef<ABTestVariant | undefined>();
  const interactionCount = useRef(0);
  const phaseTimers = useRef<Map<string, number>>(new Map());

  // Track element load on mount
  useEffect(() => {
    if (user && !hasTrackedStart.current) {
      trackElementEvent(
        elementId,
        elementType,
        lessonId,
        user.id,
        ElementEventType.ELEMENT_LOADED
      );
      hasTrackedStart.current = true;
    }

    // Track abandonment on unmount if not completed
    return () => {
      const activePhases = Array.from(phaseTimers.current.keys());
      activePhases.forEach(phase => {
        const timeSpent = stopTimeTracking(elementId, phase);
        if (timeSpent > 0 && user) {
          trackElementEvent(
            elementId,
            elementType,
            lessonId,
            user.id,
            ElementEventType.TIME_SPENT_UPDATE,
            { phase, timeSpent }
          );
        }
      });
    };
  }, [user, elementId, elementType, lessonId]);

  // Initialize A/B testing if enabled
  useEffect(() => {
    const initABTest = async () => {
      if (enableABTesting && user) {
        try {
          const { data: variants } = await supabase
            .from('ab_test_variants')
            .select('*')
            .eq('element_id', elementId)
            .eq('is_active', true);

          if (variants && variants.length > 0) {
            variant.current = analyticsService.selectABTestVariant(variants);
            
            // Track variant assignment
            trackElementEvent(
              elementId,
              elementType,
              lessonId,
              user.id,
              ElementEventType.USER_INTERACTION,
              { variantAssigned: variant.current.variantId }
            );
          }
        } catch (error) {
          console.error('Error initializing A/B test:', error);
        }
      }
    };

    initABTest();
  }, [enableABTesting, user, elementId, elementType, lessonId]);

  const trackStart = useCallback(() => {
    if (!user) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.ELEMENT_STARTED
    );
    startTimeTracking(elementId);
  }, [user, elementId, elementType, lessonId]);

  const trackComplete = useCallback(() => {
    if (!user) return;
    
    const timeSpent = stopTimeTracking(elementId);
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.ELEMENT_COMPLETED,
      { 
        timeSpent, 
        interactionCount: interactionCount.current,
        variantId: variant.current?.variantId 
      }
    );
    
    onComplete?.();
  }, [user, elementId, elementType, lessonId, onComplete]);

  const trackInteraction = useCallback((interactionType: string, data?: Record<string, any>) => {
    if (!user) return;
    
    interactionCount.current++;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.USER_INTERACTION,
      { interactionType, ...data }
    );
  }, [user, elementId, elementType, lessonId]);

  const trackPhaseStart = useCallback((phaseName: string) => {
    if (!user) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.PHASE_STARTED,
      { phaseName }
    );
    
    startTimeTracking(elementId, phaseName);
    phaseTimers.current.set(phaseName, Date.now());
  }, [user, elementId, elementType, lessonId]);

  const trackPhaseComplete = useCallback((phaseName: string) => {
    if (!user) return;
    
    const timeSpent = stopTimeTracking(elementId, phaseName);
    phaseTimers.current.delete(phaseName);
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.PHASE_COMPLETED,
      { phaseName, timeSpent }
    );
  }, [user, elementId, elementType, lessonId]);

  const trackError = useCallback((error: string, context?: Record<string, any>) => {
    if (!user) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.ERROR_OCCURRED,
      { error, ...context }
    );
  }, [user, elementId, elementType, lessonId]);

  const trackRetry = useCallback((attemptNumber: number) => {
    if (!user) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.RETRY_ATTEMPTED,
      { attemptNumber }
    );
  }, [user, elementId, elementType, lessonId]);

  const trackHelp = useCallback((helpType: string) => {
    if (!user) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.HELP_REQUESTED,
      { helpType }
    );
  }, [user, elementId, elementType, lessonId]);

  const trackHint = useCallback((hintId: string) => {
    if (!user) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.HINT_VIEWED,
      { hintId }
    );
  }, [user, elementId, elementType, lessonId]);

  const trackAbandonment = useCallback(() => {
    if (!user) return;
    
    const timeSpent = stopTimeTracking(elementId);
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.ELEMENT_ABANDONED,
      { timeSpent, interactionCount: interactionCount.current }
    );
  }, [user, elementId, elementType, lessonId]);

  const startTimer = useCallback((phase?: string) => {
    startTimeTracking(elementId, phase);
  }, [elementId]);

  const stopTimer = useCallback((phase?: string) => {
    return stopTimeTracking(elementId, phase);
  }, [elementId]);

  const trackVariantConversion = useCallback(() => {
    if (!user || !variant.current) return;
    
    trackElementEvent(
      elementId,
      elementType,
      lessonId,
      user.id,
      ElementEventType.USER_INTERACTION,
      { variantConverted: variant.current.variantId }
    );
  }, [user, elementId, elementType, lessonId]);

  return {
    trackStart,
    trackComplete,
    trackInteraction,
    trackPhaseStart,
    trackPhaseComplete,
    trackError,
    trackRetry,
    trackHelp,
    trackHint,
    trackAbandonment,
    startTimer,
    stopTimer,
    variant: variant.current,
    trackVariantConversion
  };
};