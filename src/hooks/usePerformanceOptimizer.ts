import { useCallback, useEffect, useRef, useState } from 'react';

// ================================
// PERFORMANCE MONITORING HOOKS
// ================================

/**
 * Hook for debouncing function calls to prevent excessive re-renders
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls to limit execution frequency
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for optimized event handlers with automatic cleanup
 */
export function useOptimizedEventHandler<T extends Event>(
  eventType: string,
  handler: (event: T) => void,
  element: HTMLElement | Window | null = null,
  options: AddEventListenerOptions = {}
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const targetElement = element || window;
    if (!targetElement) return;

    const optimizedHandler = (event: Event) => {
      // Use requestIdleCallback if available, otherwise fallback to setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => handlerRef.current(event as T));
      } else {
        setTimeout(() => handlerRef.current(event as T), 0);
      }
    };

    targetElement.addEventListener(eventType, optimizedHandler, {
      passive: true,
      ...options
    });

    return () => {
      targetElement.removeEventListener(eventType, optimizedHandler);
    };
  }, [eventType, element, options]);
}

/**
 * Hook for tracking component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;

    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(
        `Performance warning: ${componentName} took ${renderTime}ms to render (frame #${renderCount.current})`
      );
    }

    startTime.current = Date.now();
  });

  return renderCount.current;
}

/**
 * Hook for memory leak detection and cleanup
 */
export function useMemoryOptimizer() {
  const cleanup = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((cleanupFn: () => void) => {
    cleanup.current.push(cleanupFn);
  }, []);

  useEffect(() => {
    return () => {
      cleanup.current.forEach(fn => fn());
      cleanup.current = [];
    };
  }, []);

  return { addCleanup };
}

/**
 * Hook for intersection observer with performance optimization
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  const ref = useCallback((node: Element | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options]);

  return [ref, isIntersecting];
}

/**
 * Hook for smooth animations with hardware acceleration
 */
export function useGPUOptimizedAnimation() {
  const elementRef = useRef<HTMLElement>(null);

  const enableGPUAcceleration = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.transform = 'translateZ(0)';
      elementRef.current.style.willChange = 'transform, opacity';
    }
  }, []);

  const disableGPUAcceleration = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.willChange = 'auto';
    }
  }, []);

  return {
    ref: elementRef,
    enableGPUAcceleration,
    disableGPUAcceleration
  };
}

/**
 * Hook for optimized resize handling
 */
export function useOptimizedResize(
  callback: () => void,
  delay: number = 100
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callbackRef.current();
      }, delay);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [delay]);
}

/**
 * Hook for virtual scrolling implementation
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  buffer: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useThrottle((event: Event) => {
    const target = event.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, 16); // ~60fps

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  };
}

/**
 * Hook for performance metrics collection
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    fps: number;
    memoryUsage: number;
    renderTime: number;
  }>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
        }));
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return metrics;
}