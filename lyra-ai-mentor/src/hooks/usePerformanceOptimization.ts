import { useEffect, useRef, useCallback, useState } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Performance optimization hooks
export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return targetRef;
}

// Lazy load images with intersection observer
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const imgRef = useIntersectionObserver(
    useCallback((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && imageSrc !== src) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
          };
          img.onerror = () => {
            setError(new Error('Failed to load image'));
            setIsLoading(false);
          };
        }
      });
    }, [src, imageSrc]),
    { threshold: 0.1 }
  );

  return { imgRef, imageSrc, isLoading, error };
}

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

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

// Throttle hook
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= interval) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, interval);

    return () => {
      clearTimeout(handler);
    };
  }, [value, interval]);

  return throttledValue;
}

// Memoized callback with dependencies
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback, ...deps]);

  return useCallback(
    ((...args) => ref.current?.(...args)) as T,
    [ref]
  );
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 3
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  };
}

// Performance monitoring hook
export function usePerformanceTracking(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const renderTime = performance.now() - mountTime.current;
    
    if (renderCount.current === 1) {
      performanceMonitor.measureComponent(
        `${componentName}-mount`,
        () => console.debug(`${componentName} mounted in ${renderTime.toFixed(2)}ms`)
      );
    }
    
    return () => {
      const totalLifetime = performance.now() - mountTime.current;
      console.debug(
        `${componentName} unmounted after ${renderCount.current} renders and ${totalLifetime.toFixed(2)}ms`
      );
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    mountTime: mountTime.current
  };
}

// Prefetch resources
export function usePrefetch(urls: string[]) {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [urls]);
}

// Request idle callback hook
export function useIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
) {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(
        deadline => callbackRef.current(deadline),
        options
      );
      
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(() => {
        callbackRef.current({
          didTimeout: false,
          timeRemaining: () => 50
        } as IdleDeadline);
      }, 1);
      
      return () => clearTimeout(id);
    }
  }, [options]);
}