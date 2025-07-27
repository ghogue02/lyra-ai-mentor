import React, { useMemo, useCallback, lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';

// Performance optimization interfaces
interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableAnimations: boolean;
  prefersReducedMotion: boolean;
  enablePrefetch: boolean;
  maxConcurrentAnimations: number;
}

interface AssetLoadingState {
  loading: boolean;
  error: boolean;
  loaded: boolean;
  retryCount: number;
}

// Global performance manager
class PerformanceManager {
  private static instance: PerformanceManager;
  private config: PerformanceConfig;
  private loadingStates: Map<string, AssetLoadingState> = new Map();
  private activeAnimations: Set<string> = new Set();
  private observers: Map<string, IntersectionObserver> = new Map();

  private constructor() {
    this.config = {
      enableLazyLoading: true,
      enableAnimations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      enablePrefetch: 'connection' in navigator && (navigator as any).connection?.effectiveType !== 'slow-2g',
      maxConcurrentAnimations: 5
    };

    // Listen for motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.config.prefersReducedMotion = e.matches;
      this.config.enableAnimations = !e.matches;
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  canStartAnimation(id: string): boolean {
    if (!this.config.enableAnimations || this.config.prefersReducedMotion) {
      return false;
    }
    if (this.activeAnimations.size >= this.config.maxConcurrentAnimations) {
      return false;
    }
    this.activeAnimations.add(id);
    return true;
  }

  endAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  getLoadingState(assetId: string): AssetLoadingState {
    return this.loadingStates.get(assetId) || {
      loading: false,
      error: false,
      loaded: false,
      retryCount: 0
    };
  }

  setLoadingState(assetId: string, state: Partial<AssetLoadingState>): void {
    const current = this.getLoadingState(assetId);
    this.loadingStates.set(assetId, { ...current, ...state });
  }

  createIntersectionObserver(
    id: string,
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    if (this.observers.has(id)) {
      this.observers.get(id)!.disconnect();
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });

    this.observers.set(id, observer);
    return observer;
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.activeAnimations.clear();
    this.loadingStates.clear();
  }
}

// Custom hooks for performance
export const usePerformance = () => {
  const manager = useMemo(() => PerformanceManager.getInstance(), []);
  
  const config = useMemo(() => manager.getConfig(), [manager]);
  
  const canAnimate = useCallback((id: string) => {
    return manager.canStartAnimation(id);
  }, [manager]);
  
  const endAnimation = useCallback((id: string) => {
    manager.endAnimation(id);
  }, [manager]);
  
  const getAssetState = useCallback((assetId: string) => {
    return manager.getLoadingState(assetId);
  }, [manager]);
  
  const setAssetState = useCallback((assetId: string, state: Partial<AssetLoadingState>) => {
    manager.setLoadingState(assetId, state);
  }, [manager]);

  return {
    config,
    canAnimate,
    endAnimation,
    getAssetState,
    setAssetState,
    manager
  };
};

// Optimized intersection observer hook
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit & { id?: string }
) => {
  const { manager } = usePerformance();
  const observerId = options?.id || `observer-${Date.now()}`;

  const elementRef = useCallback((element: Element | null) => {
    if (element) {
      const observer = manager.createIntersectionObserver(observerId, callback, options);
      observer.observe(element);
      
      return () => {
        observer.unobserve(element);
      };
    }
  }, [manager, observerId, callback, options]);

  return elementRef;
};

// Component preloader for critical assets
export const useAssetPreloader = (assets: string[]) => {
  const { setAssetState, config } = usePerformance();

  React.useEffect(() => {
    if (!config.enablePrefetch) return;

    const preloadAsset = async (src: string) => {
      try {
        setAssetState(src, { loading: true });
        
        if (src.endsWith('.mp4') || src.endsWith('.webm')) {
          // Preload video
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = src;
          await new Promise((resolve, reject) => {
            video.onloadedmetadata = resolve;
            video.onerror = reject;
          });
        } else {
          // Preload image
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
          });
        }
        
        setAssetState(src, { loading: false, loaded: true, error: false });
      } catch (error) {
        setAssetState(src, { loading: false, error: true });
        console.warn('Failed to preload asset:', src, error);
      }
    };

    // Preload with small delay to not block initial render
    const timer = setTimeout(() => {
      assets.forEach(preloadAsset);
    }, 100);

    return () => clearTimeout(timer);
  }, [assets, config.enablePrefetch, setAssetState]);
};

// Memory-efficient component factory
export const createOptimizedComponent = <T extends Record<string, any>>(
  componentName: string,
  render: React.ComponentType<T>,
  options?: {
    memo?: boolean;
    lazy?: boolean;
    displayName?: string;
  }
): React.ComponentType<T> => {
  const { memo = true, lazy: shouldLazy = false, displayName } = options || {};

  let Component: React.ComponentType<T> = render;

  if (shouldLazy) {
    const LazyComponent = lazy(() => Promise.resolve({ default: render }));
    Component = LazyComponent as React.ComponentType<T>;
  }

  if (memo) {
    Component = React.memo(Component) as React.ComponentType<T>;
  }

  if (displayName) {
    Component.displayName = displayName;
  } else {
    Component.displayName = componentName;
  }

  return Component;
};

// Optimized asset URL generator with caching
const urlCache = new Map<string, string>();

export const getCachedAssetUrl = (path: string, baseUrl?: string): string => {
  const cacheKey = `${baseUrl || ''}/${path}`;
  
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }
  
  const url = baseUrl ? `${baseUrl}/${path}` : path;
  urlCache.set(cacheKey, url);
  return url;
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useMemo(() => performance.now(), []);
  
  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    // Use Performance API if available
    if ('PerformanceObserver' in window) {
      try {
        performance.mark(`${componentName}-render-complete`);
      } catch (error) {
        // Silently fail if performance marking is not supported
      }
    }
  });
  
  return { renderTime: performance.now() - startTime };
};

// Bundle size optimization utilities
export const shouldLoadAsset = (assetUrl: string): boolean => {
  const manager = PerformanceManager.getInstance();
  const config = manager.getConfig();
  
  // Skip heavy assets on slow connections
  if (!config.enablePrefetch && assetUrl.includes('.mp4')) {
    return false;
  }
  
  // Skip animations if disabled
  if (!config.enableAnimations && (assetUrl.includes('animation') || assetUrl.includes('.mp4'))) {
    return false;
  }
  
  return true;
};

export { PerformanceManager };