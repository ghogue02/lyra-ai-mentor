import { useRef, useCallback, useEffect, useState } from 'react';
import { useCleanup } from './useCleanup';

interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  timestamp: number;
}

interface MemoryManagerOptions {
  trackMetrics?: boolean;
  gcInterval?: number;
  warningThreshold?: number;
  onMemoryWarning?: (metrics: MemoryMetrics) => void;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  size?: number;
}

/**
 * Comprehensive memory management hook
 */
export const useMemoryManager = (options: MemoryManagerOptions = {}) => {
  const {
    trackMetrics = false,
    gcInterval = 30000, // 30 seconds
    warningThreshold = 100 * 1024 * 1024, // 100MB
    onMemoryWarning
  } = options;

  const { registerCleanup } = useCleanup();
  const [metrics, setMetrics] = useState<MemoryMetrics | null>(null);
  const caches = useRef<Map<string, Map<string, CacheEntry<any>>>>(new Map());
  const weakRefs = useRef<Map<string, WeakRef<any>>>(new Map());
  const finalizationRegistry = useRef<FinalizationRegistry<string> | null>(null);

  // Initialize finalization registry
  useEffect(() => {
    if (typeof FinalizationRegistry !== 'undefined') {
      finalizationRegistry.current = new FinalizationRegistry((key: string) => {
        weakRefs.current.delete(key);
        console.debug(`Memory: Object with key '${key}' was garbage collected`);
      });

      registerCleanup(() => {
        finalizationRegistry.current = null;
      });
    }
  }, [registerCleanup]);

  // Memory metrics collection
  const collectMetrics = useCallback((): MemoryMetrics | null => {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        external: memory.usedJSHeapSize,
        arrayBuffers: 0, // Not available in browser
        timestamp: Date.now()
      };
    }
    return null;
  }, []);

  // Create a managed cache
  const createCache = useCallback(<T>(name: string, maxSize = 100, ttl = 300000) => {
    if (!caches.current.has(name)) {
      caches.current.set(name, new Map());
    }

    const cache = caches.current.get(name)!;

    const set = (key: string, value: T): void => {
      // Evict old entries if cache is full
      if (cache.size >= maxSize) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) {
          cache.delete(oldestKey);
        }
      }

      cache.set(key, {
        value,
        timestamp: Date.now(),
        accessCount: 0,
        size: estimateSize(value)
      });
    };

    const get = (key: string): T | undefined => {
      const entry = cache.get(key);
      if (!entry) return undefined;

      // Check TTL
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
        return undefined;
      }

      entry.accessCount++;
      return entry.value;
    };

    const clear = (): void => {
      cache.clear();
    };

    const cleanup = (): void => {
      const now = Date.now();
      for (const [key, entry] of cache.entries()) {
        if (now - entry.timestamp > ttl) {
          cache.delete(key);
        }
      }
    };

    // Register cache cleanup
    registerCleanup(() => {
      cache.clear();
      caches.current.delete(name);
    });

    return {
      set,
      get,
      clear,
      cleanup,
      size: () => cache.size,
      entries: () => Array.from(cache.entries())
    };
  }, [registerCleanup]);

  // Create weak reference
  const createWeakRef = useCallback(<T extends object>(key: string, object: T): WeakRef<T> => {
    const weakRef = new WeakRef(object);
    weakRefs.current.set(key, weakRef);

    // Register with finalization registry
    if (finalizationRegistry.current) {
      finalizationRegistry.current.register(object, key);
    }

    return weakRef;
  }, []);

  // Get weak reference
  const getWeakRef = useCallback(<T>(key: string): T | undefined => {
    const weakRef = weakRefs.current.get(key);
    if (!weakRef) return undefined;

    const object = weakRef.deref();
    if (!object) {
      weakRefs.current.delete(key);
    }
    return object;
  }, []);

  // Force garbage collection (if available)
  const forceGC = useCallback(() => {
    if (typeof gc !== 'undefined') {
      gc();
    } else if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
  }, []);

  // Cleanup all caches
  const cleanupCaches = useCallback(() => {
    const now = Date.now();
    let totalCleaned = 0;

    for (const [name, cache] of caches.current.entries()) {
      const initialSize = cache.size;
      for (const [key, entry] of cache.entries()) {
        // Remove entries older than 5 minutes or with low access count
        if (now - entry.timestamp > 300000 || entry.accessCount === 0) {
          cache.delete(key);
        }
      }
      totalCleaned += initialSize - cache.size;
    }

    console.debug(`Memory: Cleaned ${totalCleaned} cache entries`);
    return totalCleaned;
  }, []);

  // Memory monitoring
  useEffect(() => {
    if (!trackMetrics) return;

    const interval = setInterval(() => {
      const currentMetrics = collectMetrics();
      if (currentMetrics) {
        setMetrics(currentMetrics);

        // Check warning threshold
        if (currentMetrics.heapUsed > warningThreshold) {
          onMemoryWarning?.(currentMetrics);
          cleanupCaches();
        }
      }
    }, gcInterval);

    registerCleanup(() => {
      clearInterval(interval);
    });
  }, [trackMetrics, gcInterval, warningThreshold, onMemoryWarning, collectMetrics, cleanupCaches, registerCleanup]);

  return {
    metrics,
    createCache,
    createWeakRef,
    getWeakRef,
    forceGC,
    cleanupCaches,
    collectMetrics,
    totalCaches: caches.current.size,
    totalWeakRefs: weakRefs.current.size
  };
};

/**
 * Estimate the memory size of an object (approximate)
 */
function estimateSize(obj: any): number {
  let size = 0;
  
  if (obj === null || obj === undefined) {
    return 0;
  }
  
  switch (typeof obj) {
    case 'boolean':
      size = 4;
      break;
    case 'number':
      size = 8;
      break;
    case 'string':
      size = obj.length * 2;
      break;
    case 'object':
      if (Array.isArray(obj)) {
        size = obj.reduce((acc, item) => acc + estimateSize(item), 0);
      } else {
        size = Object.keys(obj).reduce((acc, key) => {
          return acc + estimateSize(key) + estimateSize(obj[key]);
        }, 0);
      }
      break;
    default:
      size = 0;
  }
  
  return size;
}

/**
 * Hook for efficient data structures using WeakMap and WeakSet
 */
export const useWeakDataStructures = () => {
  const { registerCleanup } = useCleanup();
  const weakMaps = useRef<Map<string, WeakMap<object, any>>>(new Map());
  const weakSets = useRef<Map<string, WeakSet<object>>>(new Map());

  const createWeakMap = useCallback(<K extends object, V>(name: string): WeakMap<K, V> => {
    if (!weakMaps.current.has(name)) {
      const weakMap = new WeakMap<K, V>();
      weakMaps.current.set(name, weakMap);
      
      registerCleanup(() => {
        weakMaps.current.delete(name);
      });
    }
    
    return weakMaps.current.get(name) as WeakMap<K, V>;
  }, [registerCleanup]);

  const createWeakSet = useCallback(<T extends object>(name: string): WeakSet<T> => {
    if (!weakSets.current.has(name)) {
      const weakSet = new WeakSet<T>();
      weakSets.current.set(name, weakSet);
      
      registerCleanup(() => {
        weakSets.current.delete(name);
      });
    }
    
    return weakSets.current.get(name) as WeakSet<T>;
  }, [registerCleanup]);

  return {
    createWeakMap,
    createWeakSet,
    totalWeakMaps: weakMaps.current.size,
    totalWeakSets: weakSets.current.size
  };
};