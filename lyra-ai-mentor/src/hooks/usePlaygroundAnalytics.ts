import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@/services/analyticsService';
import { useElementAnalytics } from './useElementAnalytics';

export interface PlaygroundAnalyticsConfig {
  elementId?: number;
  elementType?: string;
  lessonId?: number;
  trackPerformance?: boolean;
  trackErrors?: boolean;
  trackUserJourney?: boolean;
  autoTrackInteractions?: boolean;
}

export interface PlaygroundAnalyticsHook {
  // Auto-tracking functions
  trackRef: (element: HTMLElement | null) => void;
  
  // Manual tracking functions
  trackInteraction: (type: string, target: string, metadata?: Record<string, any>) => void;
  trackError: (error: Error | string, context?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number) => void;
  trackExport: (format: string, size: number, duration: number, success: boolean) => void;
  trackTokenUsage: (feature: string, tokens: number) => void;
  
  // User journey tracking
  startJourney: (journeyName: string) => void;
  updateJourney: (step: string, metadata?: Record<string, any>) => void;
  completeJourney: (success: boolean) => void;
  
  // Performance monitoring
  startTimer: (timerName: string) => void;
  stopTimer: (timerName: string) => number;
  
  // Element-specific analytics (if elementId provided)
  elementAnalytics?: ReturnType<typeof useElementAnalytics>;
}

export function usePlaygroundAnalytics(config: PlaygroundAnalyticsConfig = {}): PlaygroundAnalyticsHook {
  const { user } = useAuth();
  const {
    elementId,
    elementType,
    lessonId,
    trackPerformance = true,
    trackErrors = true,
    trackUserJourney = false,
    autoTrackInteractions = true
  } = config;

  const timers = useRef<Map<string, number>>(new Map());
  const journey = useRef<{ name: string; startTime: number; steps: any[] } | null>(null);
  const trackedElements = useRef<WeakSet<HTMLElement>>(new WeakSet());
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const performanceData = useRef<Map<string, number[]>>(new Map());

  // Use element analytics if elementId is provided
  const elementAnalytics = elementId && elementType && lessonId
    ? useElementAnalytics({ elementId, elementType, lessonId })
    : undefined;

  // Set up intersection observer for visibility tracking
  useEffect(() => {
    if (!autoTrackInteractions) return;

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            analyticsService.trackInteraction({
              type: 'scroll',
              target: entry.target.id || entry.target.className || 'unknown',
              timestamp: new Date().toISOString(),
              metadata: {
                visibilityRatio: entry.intersectionRatio,
                boundingRect: entry.boundingClientRect
              }
            });
          }
        });
      },
      {
        threshold: [0.25, 0.5, 0.75, 1.0]
      }
    );

    return () => {
      intersectionObserver.current?.disconnect();
    };
  }, [autoTrackInteractions]);

  // Set up performance monitoring
  useEffect(() => {
    if (!trackPerformance) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          const values = performanceData.current.get(entry.name) || [];
          values.push(entry.duration);
          performanceData.current.set(entry.name, values);

          // Report performance metrics periodically
          if (values.length >= 10) {
            const average = values.reduce((a, b) => a + b, 0) / values.length;
            const p95 = values.sort((a, b) => a - b)[Math.floor(values.length * 0.95)];
            
            analyticsService.trackInteraction({
              type: 'performance',
              target: entry.name,
              timestamp: new Date().toISOString(),
              metadata: {
                average,
                p95,
                sampleSize: values.length
              }
            });

            // Reset after reporting
            performanceData.current.set(entry.name, []);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => {
      observer.disconnect();
    };
  }, [trackPerformance]);

  // Set up error tracking
  useEffect(() => {
    if (!trackErrors) return;

    const handleError = (event: ErrorEvent) => {
      analyticsService.trackInteraction({
        type: 'error',
        target: event.filename || 'unknown',
        timestamp: new Date().toISOString(),
        metadata: {
          message: event.message,
          line: event.lineno,
          column: event.colno,
          stack: event.error?.stack
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analyticsService.trackInteraction({
        type: 'error',
        target: 'promise',
        timestamp: new Date().toISOString(),
        metadata: {
          reason: event.reason,
          promise: event.promise
        }
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackErrors]);

  const trackRef = useCallback((element: HTMLElement | null) => {
    if (!element || !autoTrackInteractions || trackedElements.current.has(element)) return;

    trackedElements.current.add(element);

    // Set up click tracking
    const handleClick = (e: MouseEvent) => {
      analyticsService.trackInteraction({
        type: 'click',
        target: element.id || element.className || element.tagName,
        timestamp: new Date().toISOString(),
        metadata: {
          text: element.textContent?.slice(0, 50),
          position: { x: e.clientX, y: e.clientY }
        }
      });
    };

    // Set up hover tracking (throttled)
    let hoverTimeout: NodeJS.Timeout;
    const handleMouseEnter = () => {
      hoverTimeout = setTimeout(() => {
        analyticsService.trackInteraction({
          type: 'hover',
          target: element.id || element.className || element.tagName,
          timestamp: new Date().toISOString(),
          metadata: {
            duration: 'start'
          }
        });
      }, 1000); // Track only if hovered for 1+ seconds
    };

    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout);
    };

    // Set up focus tracking
    const handleFocus = () => {
      analyticsService.trackInteraction({
        type: 'focus',
        target: element.id || element.className || element.tagName,
        timestamp: new Date().toISOString()
      });
    };

    element.addEventListener('click', handleClick);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('focus', handleFocus);

    // Observe for visibility tracking
    intersectionObserver.current?.observe(element);

    // Cleanup function
    const cleanup = () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('focus', handleFocus);
      intersectionObserver.current?.unobserve(element);
    };

    // Store cleanup function on the element
    (element as any).__analyticsCleanup = cleanup;
  }, [autoTrackInteractions]);

  const trackInteraction = useCallback((
    type: string,
    target: string,
    metadata?: Record<string, any>
  ) => {
    analyticsService.trackInteraction({
      type: type as any,
      target,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        userId: user?.id,
        elementId,
        elementType,
        lessonId
      }
    });
  }, [user, elementId, elementType, lessonId]);

  const trackError = useCallback((
    error: Error | string,
    context?: Record<string, any>
  ) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    analyticsService.trackInteraction({
      type: 'error',
      target: context?.component || 'unknown',
      timestamp: new Date().toISOString(),
      metadata: {
        message: errorMessage,
        stack: errorStack,
        ...context,
        userId: user?.id,
        elementId,
        elementType,
        lessonId
      }
    });

    // Also track with element analytics if available
    elementAnalytics?.trackError(errorMessage, context);
  }, [user, elementId, elementType, lessonId, elementAnalytics]);

  const trackPerformanceMetric = useCallback((metric: string, value: number) => {
    performance.mark(`${metric}_start`);
    performance.mark(`${metric}_end`);
    performance.measure(metric, `${metric}_start`, `${metric}_end`);

    analyticsService.trackInteraction({
      type: 'performance' as any,
      target: metric,
      timestamp: new Date().toISOString(),
      metadata: {
        value,
        userId: user?.id,
        elementId,
        elementType,
        lessonId
      }
    });
  }, [user, elementId, elementType, lessonId]);

  const trackExport = useCallback(async (
    format: string,
    size: number,
    duration: number,
    success: boolean,
    error?: string
  ) => {
    await analyticsService.trackExport({
      format,
      size,
      duration,
      success,
      error
    });
  }, []);

  const trackTokenUsage = useCallback(async (feature: string, tokens: number) => {
    await analyticsService.trackTokenUsage(feature, tokens);
  }, []);

  const startJourney = useCallback((journeyName: string) => {
    journey.current = {
      name: journeyName,
      startTime: Date.now(),
      steps: []
    };

    trackInteraction('journey_start', journeyName, {
      timestamp: new Date().toISOString()
    });
  }, [trackInteraction]);

  const updateJourney = useCallback((step: string, metadata?: Record<string, any>) => {
    if (!journey.current) return;

    journey.current.steps.push({
      step,
      timestamp: new Date().toISOString(),
      metadata
    });

    trackInteraction('journey_step', step, {
      journeyName: journey.current.name,
      stepNumber: journey.current.steps.length,
      ...metadata
    });
  }, [trackInteraction]);

  const completeJourney = useCallback((success: boolean) => {
    if (!journey.current) return;

    const duration = Date.now() - journey.current.startTime;

    trackInteraction('journey_complete', journey.current.name, {
      success,
      duration,
      steps: journey.current.steps.length,
      completedSteps: journey.current.steps
    });

    journey.current = null;
  }, [trackInteraction]);

  const startTimer = useCallback((timerName: string) => {
    timers.current.set(timerName, Date.now());
    performance.mark(`${timerName}_start`);
  }, []);

  const stopTimer = useCallback((timerName: string): number => {
    const startTime = timers.current.get(timerName);
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    timers.current.delete(timerName);

    performance.mark(`${timerName}_end`);
    performance.measure(timerName, `${timerName}_start`, `${timerName}_end`);

    trackPerformanceMetric(timerName, duration);

    return duration;
  }, [trackPerformanceMetric]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any tracked elements
      trackedElements.current = new WeakSet();
      
      // Complete any ongoing journey
      if (journey.current) {
        completeJourney(false);
      }

      // Clear timers
      timers.current.clear();
    };
  }, [completeJourney]);

  return {
    trackRef,
    trackInteraction,
    trackError,
    trackPerformance: trackPerformanceMetric,
    trackExport,
    trackTokenUsage,
    startJourney,
    updateJourney,
    completeJourney,
    startTimer,
    stopTimer,
    elementAnalytics
  };
}