import { useEffect, useRef, useCallback, useState } from 'react';
import { useCleanup } from './useCleanup';

interface MemoryLeakReport {
  componentName: string;
  leakType: 'event-listener' | 'timer' | 'subscription' | 'memory' | 'dom-reference';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  stackTrace?: string;
}

interface MemoryLeakDetectorOptions {
  componentName?: string;
  trackEventListeners?: boolean;
  trackTimers?: boolean;
  trackMemoryUsage?: boolean;
  trackDOMReferences?: boolean;
  onLeakDetected?: (report: MemoryLeakReport) => void;
  reportingInterval?: number;
}

interface ComponentMetrics {
  renderCount: number;
  lastRenderTime: number;
  eventListeners: number;
  timers: number;
  memoryUsage: number;
  domReferences: number;
}

/**
 * Hook for detecting and preventing memory leaks
 */
export const useMemoryLeakDetector = (options: MemoryLeakDetectorOptions = {}) => {
  const {
    componentName = 'UnknownComponent',
    trackEventListeners = true,
    trackTimers = true,
    trackMemoryUsage = true,
    trackDOMReferences = true,
    onLeakDetected,
    reportingInterval = 10000 // 10 seconds
  } = options;

  const { registerCleanup } = useCleanup();
  const [reports, setReports] = useState<MemoryLeakReport[]>([]);
  const [metrics, setMetrics] = useState<ComponentMetrics>({
    renderCount: 0,
    lastRenderTime: Date.now(),
    eventListeners: 0,
    timers: 0,
    memoryUsage: 0,
    domReferences: 0
  });

  const initialMetrics = useRef<ComponentMetrics | null>(null);
  const eventListenerCount = useRef(0);
  const timerCount = useRef(0);
  const domReferenceCount = useRef(0);
  const renderCountRef = useRef(0);
  const originalAddEventListener = useRef<typeof addEventListener | null>(null);
  const originalRemoveEventListener = useRef<typeof removeEventListener | null>(null);
  const originalSetTimeout = useRef<typeof setTimeout | null>(null);
  const originalSetInterval = useRef<typeof setInterval | null>(null);
  const originalClearTimeout = useRef<typeof clearTimeout | null>(null);
  const originalClearInterval = useRef<typeof clearInterval | null>(null);

  // Create leak report
  const createLeakReport = useCallback((leakType: MemoryLeakReport['leakType'], description: string, severity: MemoryLeakReport['severity'] = 'medium'): MemoryLeakReport => {
    const report: MemoryLeakReport = {
      componentName,
      leakType,
      severity,
      description,
      timestamp: Date.now(),
      stackTrace: new Error().stack
    };

    setReports(prev => [...prev, report]);
    onLeakDetected?.(report);
    
    return report;
  }, [componentName, onLeakDetected]);

  // Monitor event listeners
  useEffect(() => {
    if (!trackEventListeners || typeof window === 'undefined') return;

    const originalAdd = window.addEventListener;
    const originalRemove = window.removeEventListener;

    // Override addEventListener
    window.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      eventListenerCount.current++;
      return originalAdd.call(this, type, listener, options);
    };

    // Override removeEventListener
    window.removeEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
      eventListenerCount.current = Math.max(0, eventListenerCount.current - 1);
      return originalRemove.call(this, type, listener, options);
    };

    registerCleanup(() => {
      window.addEventListener = originalAdd;
      window.removeEventListener = originalRemove;

      // Check for remaining event listeners
      if (eventListenerCount.current > 0) {
        createLeakReport(
          'event-listener',
          `${eventListenerCount.current} event listeners not cleaned up`,
          eventListenerCount.current > 5 ? 'high' : 'medium'
        );
      }
    });
  }, [trackEventListeners, registerCleanup, createLeakReport]);

  // Monitor timers
  useEffect(() => {
    if (!trackTimers || typeof window === 'undefined') return;

    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalClearTimeout = window.clearTimeout;
    const originalClearInterval = window.clearInterval;

    const activeTimers = new Set<number>();
    const activeIntervals = new Set<number>();

    // Override setTimeout
    window.setTimeout = function(callback: TimerHandler, timeout?: number, ...args: any[]): number {
      const id = originalSetTimeout.call(this, (...callbackArgs) => {
        activeTimers.delete(id);
        timerCount.current = Math.max(0, timerCount.current - 1);
        if (typeof callback === 'function') {
          callback(...callbackArgs);
        }
      }, timeout, ...args);
      
      activeTimers.add(id);
      timerCount.current++;
      return id;
    };

    // Override setInterval
    window.setInterval = function(callback: TimerHandler, timeout?: number, ...args: any[]): number {
      const id = originalSetInterval.call(this, callback, timeout, ...args);
      activeIntervals.add(id);
      timerCount.current++;
      return id;
    };

    // Override clearTimeout
    window.clearTimeout = function(id?: number): void {
      if (id && activeTimers.has(id)) {
        activeTimers.delete(id);
        timerCount.current = Math.max(0, timerCount.current - 1);
      }
      return originalClearTimeout.call(this, id);
    };

    // Override clearInterval
    window.clearInterval = function(id?: number): void {
      if (id && activeIntervals.has(id)) {
        activeIntervals.delete(id);
        timerCount.current = Math.max(0, timerCount.current - 1);
      }
      return originalClearInterval.call(this, id);
    };

    registerCleanup(() => {
      window.setTimeout = originalSetTimeout;
      window.setInterval = originalSetInterval;
      window.clearTimeout = originalClearTimeout;
      window.clearInterval = originalClearInterval;

      // Clean up remaining timers
      activeTimers.forEach(id => originalClearTimeout(id));
      activeIntervals.forEach(id => originalClearInterval(id));

      // Check for timer leaks
      const totalActiveTimers = activeTimers.size + activeIntervals.size;
      if (totalActiveTimers > 0) {
        createLeakReport(
          'timer',
          `${totalActiveTimers} timers not cleaned up (${activeTimers.size} timeouts, ${activeIntervals.size} intervals)`,
          totalActiveTimers > 3 ? 'high' : 'medium'
        );
      }
    });
  }, [trackTimers, registerCleanup, createLeakReport]);

  // Monitor memory usage
  useEffect(() => {
    if (!trackMemoryUsage || typeof performance === 'undefined' || !(performance as any).memory) return;

    const checkMemoryUsage = () => {
      const memory = (performance as any).memory;
      const currentUsage = memory.usedJSHeapSize;
      
      if (!initialMetrics.current) {
        initialMetrics.current = {
          renderCount: 0,
          lastRenderTime: Date.now(),
          eventListeners: 0,
          timers: 0,
          memoryUsage: currentUsage,
          domReferences: 0
        };
        return;
      }

      const memoryIncrease = currentUsage - initialMetrics.current.memoryUsage;
      const threshold = 10 * 1024 * 1024; // 10MB

      if (memoryIncrease > threshold) {
        createLeakReport(
          'memory',
          `Memory usage increased by ${Math.round(memoryIncrease / 1024 / 1024)}MB`,
          memoryIncrease > threshold * 2 ? 'critical' : 'high'
        );
      }

      setMetrics(prev => ({
        ...prev,
        memoryUsage: currentUsage
      }));
    };

    const interval = setInterval(checkMemoryUsage, reportingInterval);
    checkMemoryUsage(); // Initial check

    registerCleanup(() => {
      clearInterval(interval);
    });
  }, [trackMemoryUsage, reportingInterval, registerCleanup, createLeakReport]);

  // Track render count
  useEffect(() => {
    renderCountRef.current++;
    setMetrics(prev => ({
      ...prev,
      renderCount: renderCountRef.current,
      lastRenderTime: Date.now(),
      eventListeners: eventListenerCount.current,
      timers: timerCount.current,
      domReferences: domReferenceCount.current
    }));
  });

  // DOM reference tracker
  const trackDOMReference = useCallback((element: Element | null) => {
    if (!trackDOMReferences) return;
    
    if (element) {
      domReferenceCount.current++;
    }
    
    return () => {
      if (element) {
        domReferenceCount.current = Math.max(0, domReferenceCount.current - 1);
      }
    };
  }, [trackDOMReferences]);

  // Get leak summary
  const getLeakSummary = useCallback(() => {
    const summary = {
      total: reports.length,
      critical: reports.filter(r => r.severity === 'critical').length,
      high: reports.filter(r => r.severity === 'high').length,
      medium: reports.filter(r => r.severity === 'medium').length,
      low: reports.filter(r => r.severity === 'low').length,
      byType: reports.reduce((acc, report) => {
        acc[report.leakType] = (acc[report.leakType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return summary;
  }, [reports]);

  // Clear reports
  const clearReports = useCallback(() => {
    setReports([]);
  }, []);

  return {
    reports,
    metrics,
    trackDOMReference,
    createLeakReport,
    getLeakSummary,
    clearReports,
    hasLeaks: reports.length > 0,
    hasCriticalLeaks: reports.some(r => r.severity === 'critical')
  };
};

/**
 * Hook for React component lifecycle leak detection
 */
export const useComponentLeakDetector = (componentName: string) => {
  const mountTime = useRef(Date.now());
  const renderCount = useRef(0);
  const { registerCleanup } = useCleanup();
  const [isLeaking, setIsLeaking] = useState(false);

  useEffect(() => {
    renderCount.current++;
    
    // Detect excessive re-renders
    if (renderCount.current > 100) {
      console.warn(`Potential memory leak: ${componentName} has rendered ${renderCount.current} times`);
      setIsLeaking(true);
    }
  });

  useEffect(() => {
    const component = {
      name: componentName,
      mountTime: mountTime.current,
      renderCount: renderCount.current
    };

    console.debug(`Component mounted: ${componentName}`);

    registerCleanup(() => {
      const lifetime = Date.now() - mountTime.current;
      console.debug(`Component unmounted: ${componentName} (lifetime: ${lifetime}ms, renders: ${renderCount.current})`);
      
      // Warn about potential leaks
      if (renderCount.current > 50) {
        console.warn(`${componentName} rendered ${renderCount.current} times during its lifetime`);
      }
    });
  }, [componentName, registerCleanup]);

  return {
    renderCount: renderCount.current,
    lifetime: Date.now() - mountTime.current,
    isLeaking
  };
};