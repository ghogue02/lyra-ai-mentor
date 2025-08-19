import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useCleanup } from '@/hooks/memory-management/useCleanup';
import { useMemoryManager } from '@/hooks/memory-management/useMemoryManager';
import { useMemoryLeakDetector } from '@/hooks/memory-management/useMemoryLeakDetector';
import { useStateGarbageCollector } from '@/hooks/memory-management/useStateGarbageCollector';

interface AutoCleanupContextType {
  registerCleanup: (cleanup: () => void) => () => void;
  createCache: (name: string, maxSize?: number, ttl?: number) => any;
  createWeakRef: <T extends object>(key: string, object: T) => WeakRef<T>;
  trackDOMReference: (element: Element | null) => () => void;
  trackInteraction: (interactionId: string, state: any, priority?: 'low' | 'medium' | 'high') => void;
  completeInteraction: (interactionId: string) => boolean;
  forceGC: () => void;
  getMemoryStats: () => any;
}

const AutoCleanupContext = createContext<AutoCleanupContextType | null>(null);

interface AutoCleanupProviderProps {
  children: React.ReactNode;
  options?: {
    enableMemoryTracking?: boolean;
    enableLeakDetection?: boolean;
    maxCacheEntries?: number;
    cacheTimeout?: number;
    gcInterval?: number;
    onMemoryWarning?: (metrics: any) => void;
    onLeakDetected?: (report: any) => void;
  };
}

/**
 * Provider for automatic cleanup and memory management
 * Provides centralized memory management for all child components
 */
export const AutoCleanupProvider: React.FC<AutoCleanupProviderProps> = ({
  children,
  options = {}
}) => {
  const {
    enableMemoryTracking = true,
    enableLeakDetection = true,
    maxCacheEntries = 200,
    cacheTimeout = 300000, // 5 minutes
    gcInterval = 60000, // 1 minute
    onMemoryWarning,
    onLeakDetected
  } = options;

  const mountTime = useRef(Date.now());
  const componentCount = useRef(0);

  // Initialize cleanup system
  const cleanup = useCleanup({
    onError: (error) => {
      console.error('AutoCleanupProvider: Cleanup error:', error);
    }
  });

  // Initialize memory manager
  const memoryManager = useMemoryManager({
    trackMetrics: enableMemoryTracking,
    gcInterval,
    warningThreshold: 100 * 1024 * 1024, // 100MB
    onMemoryWarning: (metrics) => {
      console.warn('AutoCleanupProvider: Memory warning:', metrics);
      onMemoryWarning?.(metrics);
    }
  });

  // Initialize leak detector
  const leakDetector = useMemoryLeakDetector({
    componentName: 'AutoCleanupProvider',
    trackEventListeners: enableLeakDetection,
    trackTimers: enableLeakDetection,
    trackMemoryUsage: enableMemoryTracking,
    onLeakDetected: (report) => {
      console.warn('AutoCleanupProvider: Memory leak detected:', report);
      onLeakDetected?.(report);
    }
  });

  // Initialize state garbage collector
  const stateGC = useStateGarbageCollector({
    maxStateEntries: maxCacheEntries,
    ttl: cacheTimeout,
    gcInterval,
    onStateEvicted: (key, value) => {
      console.debug('AutoCleanupProvider: State evicted:', key);
    }
  });

  // Track component lifecycle
  useEffect(() => {
    componentCount.current++;
    console.debug(`AutoCleanupProvider: Component ${componentCount.current} mounted`);

    return () => {
      console.debug(`AutoCleanupProvider: Component unmounted (lifetime: ${Date.now() - mountTime.current}ms)`);
    };
  }, []);

  // Periodic cleanup and monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Run garbage collection
      memoryManager.cleanupCaches();
      stateGC.runGarbageCollection();
      
      // Log statistics
      if (enableMemoryTracking) {
        const stats = {
          caches: memoryManager.totalCaches,
          weakRefs: memoryManager.totalWeakRefs,
          stateEntries: stateGC.size,
          leaks: leakDetector.reports.length,
          metrics: memoryManager.metrics
        };
        console.debug('AutoCleanupProvider: Memory stats:', stats);
      }
    }, gcInterval);

    cleanup.registerCleanup(() => {
      clearInterval(interval);
    });
  }, [enableMemoryTracking, gcInterval, cleanup, memoryManager, stateGC, leakDetector]);

  // Context value
  const contextValue: AutoCleanupContextType = {
    registerCleanup: cleanup.registerCleanup,
    createCache: memoryManager.createCache,
    createWeakRef: memoryManager.createWeakRef,
    trackDOMReference: leakDetector.trackDOMReference,
    trackInteraction: stateGC.setState,
    completeInteraction: stateGC.deleteState,
    forceGC: memoryManager.forceGC,
    getMemoryStats: () => ({
      cleanup: {
        cleanupCount: cleanup.cleanupCount,
        isUnmounted: cleanup.isUnmounted
      },
      memory: {
        metrics: memoryManager.metrics,
        totalCaches: memoryManager.totalCaches,
        totalWeakRefs: memoryManager.totalWeakRefs
      },
      leaks: {
        reports: leakDetector.reports,
        metrics: leakDetector.metrics,
        hasLeaks: leakDetector.hasLeaks,
        hasCriticalLeaks: leakDetector.hasCriticalLeaks
      },
      state: {
        stats: stateGC.getStats(),
        size: stateGC.size
      }
    })
  };

  return (
    <AutoCleanupContext.Provider value={contextValue}>
      {children}
    </AutoCleanupContext.Provider>
  );
};

/**
 * Hook to access the auto cleanup context
 */
export const useAutoCleanup = (): AutoCleanupContextType => {
  const context = useContext(AutoCleanupContext);
  if (!context) {
    throw new Error('useAutoCleanup must be used within an AutoCleanupProvider');
  }
  return context;
};

/**
 * Higher-order component for automatic cleanup
 */
export function withAutoCleanup<T extends object>(
  Component: React.ComponentType<T>,
  cleanupOptions?: {
    componentName?: string;
    trackLeaks?: boolean;
  }
) {
  const WrappedComponent = React.forwardRef<any, T>((props, ref) => {
    const { componentName = Component.displayName || Component.name || 'Unknown' } = cleanupOptions || {};
    
    // Track component lifecycle
    const mountTime = useRef(Date.now());
    const renderCount = useRef(0);
    
    useEffect(() => {
      renderCount.current++;
      
      return () => {
        const lifetime = Date.now() - mountTime.current;
        console.debug(`${componentName}: Unmounted after ${lifetime}ms (${renderCount.current} renders)`);
      };
    }, [componentName]);

    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withAutoCleanup(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

export default AutoCleanupProvider;