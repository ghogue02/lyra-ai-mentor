import { useCallback, useRef, useEffect } from 'react';
import { useCleanup } from './useCleanup';
import { useMemoryManager } from './useMemoryManager';

interface StateEntry<T> {
  value: T;
  lastAccessed: number;
  accessCount: number;
  size: number;
  priority: 'low' | 'medium' | 'high';
}

interface GarbageCollectorOptions {
  maxStateEntries?: number;
  ttl?: number; // Time to live in milliseconds
  gcInterval?: number; // Garbage collection interval
  onStateEvicted?: (key: string, value: any) => void;
  enablePriorityEviction?: boolean;
}

/**
 * Hook for automatic state garbage collection
 * Manages state entries with TTL and LRU eviction
 */
export const useStateGarbageCollector = <T = any>(options: GarbageCollectorOptions = {}) => {
  const {
    maxStateEntries = 100,
    ttl = 300000, // 5 minutes
    gcInterval = 60000, // 1 minute
    onStateEvicted,
    enablePriorityEviction = true
  } = options;

  const { registerCleanup } = useCleanup();
  const { createCache } = useMemoryManager();
  
  const stateMap = useRef<Map<string, StateEntry<T>>>(new Map());
  const accessOrder = useRef<string[]>([]);
  const gcIntervalRef = useRef<number | null>(null);

  // Estimate size of value
  const estimateSize = useCallback((value: T): number => {
    if (value === null || value === undefined) return 0;
    
    try {
      return JSON.stringify(value).length * 2; // Rough estimation
    } catch {
      return 100; // Default size for non-serializable objects
    }
  }, []);

  // Update access order for LRU
  const updateAccessOrder = useCallback((key: string) => {
    const index = accessOrder.current.indexOf(key);
    if (index > -1) {
      accessOrder.current.splice(index, 1);
    }
    accessOrder.current.push(key);
  }, []);

  // Evict state entry
  const evictEntry = useCallback((key: string) => {
    const entry = stateMap.current.get(key);
    if (entry) {
      onStateEvicted?.(key, entry.value);
      stateMap.current.delete(key);
      
      const orderIndex = accessOrder.current.indexOf(key);
      if (orderIndex > -1) {
        accessOrder.current.splice(orderIndex, 1);
      }
    }
  }, [onStateEvicted]);

  // Garbage collection logic
  const runGarbageCollection = useCallback(() => {
    const now = Date.now();
    const entriesToEvict: string[] = [];

    // Find expired entries
    for (const [key, entry] of stateMap.current.entries()) {
      if (now - entry.lastAccessed > ttl) {
        entriesToEvict.push(key);
      }
    }

    // Evict expired entries
    entriesToEvict.forEach(key => evictEntry(key));

    // If still over limit, use LRU or priority eviction
    if (stateMap.current.size > maxStateEntries) {
      const overLimit = stateMap.current.size - maxStateEntries;
      
      if (enablePriorityEviction) {
        // Priority-based eviction (low priority first)
        const sortedEntries = Array.from(stateMap.current.entries())
          .sort(([, a], [, b]) => {
            const priorityOrder = { low: 0, medium: 1, high: 2 };
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            // If same priority, use access count and recency
            return a.accessCount - b.accessCount || a.lastAccessed - b.lastAccessed;
          });
        
        for (let i = 0; i < overLimit && i < sortedEntries.length; i++) {
          evictEntry(sortedEntries[i][0]);
        }
      } else {
        // LRU eviction
        for (let i = 0; i < overLimit && accessOrder.current.length > 0; i++) {
          const oldestKey = accessOrder.current[0];
          evictEntry(oldestKey);
        }
      }
    }

    console.debug(`State GC: Cleaned ${entriesToEvict.length} expired entries, ${stateMap.current.size} remaining`);
  }, [ttl, maxStateEntries, enablePriorityEviction, evictEntry]);

  // Set state with garbage collection awareness
  const setState = useCallback((key: string, value: T, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const now = Date.now();
    const size = estimateSize(value);
    
    const entry: StateEntry<T> = {
      value,
      lastAccessed: now,
      accessCount: 1,
      size,
      priority
    };

    // Update existing entry or create new one
    if (stateMap.current.has(key)) {
      const existingEntry = stateMap.current.get(key)!;
      entry.accessCount = existingEntry.accessCount + 1;
    }

    stateMap.current.set(key, entry);
    updateAccessOrder(key);

    // Trigger GC if over limit
    if (stateMap.current.size > maxStateEntries) {
      runGarbageCollection();
    }
  }, [estimateSize, updateAccessOrder, maxStateEntries, runGarbageCollection]);

  // Get state with access tracking
  const getState = useCallback((key: string): T | undefined => {
    const entry = stateMap.current.get(key);
    if (!entry) return undefined;

    // Check if expired
    const now = Date.now();
    if (now - entry.lastAccessed > ttl) {
      evictEntry(key);
      return undefined;
    }

    // Update access tracking
    entry.lastAccessed = now;
    entry.accessCount++;
    updateAccessOrder(key);

    return entry.value;
  }, [ttl, evictEntry, updateAccessOrder]);

  // Delete state entry
  const deleteState = useCallback((key: string): boolean => {
    const existed = stateMap.current.has(key);
    if (existed) {
      evictEntry(key);
    }
    return existed;
  }, [evictEntry]);

  // Clear all state
  const clearState = useCallback(() => {
    stateMap.current.clear();
    accessOrder.current = [];
  }, []);

  // Get memory usage statistics
  const getStats = useCallback(() => {
    const totalSize = Array.from(stateMap.current.values())
      .reduce((total, entry) => total + entry.size, 0);
    
    const priorityStats = Array.from(stateMap.current.values())
      .reduce((stats, entry) => {
        stats[entry.priority] = (stats[entry.priority] || 0) + 1;
        return stats;
      }, {} as Record<string, number>);

    return {
      totalEntries: stateMap.current.size,
      totalSize,
      maxEntries: maxStateEntries,
      ttl,
      priorityStats,
      oldestAccess: Math.min(...Array.from(stateMap.current.values()).map(e => e.lastAccessed)),
      newestAccess: Math.max(...Array.from(stateMap.current.values()).map(e => e.lastAccessed))
    };
  }, [maxStateEntries, ttl]);

  // Start garbage collection interval
  useEffect(() => {
    gcIntervalRef.current = window.setInterval(runGarbageCollection, gcInterval);
    
    registerCleanup(() => {
      if (gcIntervalRef.current) {
        clearInterval(gcIntervalRef.current);
        gcIntervalRef.current = null;
      }
      clearState();
    });
  }, [gcInterval, runGarbageCollection, registerCleanup, clearState]);

  return {
    setState,
    getState,
    deleteState,
    clearState,
    runGarbageCollection,
    getStats,
    size: stateMap.current.size
  };
};

/**
 * Hook for interaction pattern state cleanup
 * Specifically designed for complex UI interaction states
 */
export const useInteractionStateCleanup = () => {
  const { setState, getState, deleteState, clearState, getStats } = useStateGarbageCollector({
    maxStateEntries: 50,
    ttl: 180000, // 3 minutes for interactions
    gcInterval: 30000, // 30 seconds
    enablePriorityEviction: true
  });

  // Track interaction patterns
  const trackInteraction = useCallback((interactionId: string, state: any, priority: 'low' | 'medium' | 'high' = 'medium') => {
    setState(`interaction_${interactionId}`, {
      ...state,
      timestamp: Date.now(),
      type: 'interaction'
    }, priority);
  }, [setState]);

  // Get interaction state
  const getInteractionState = useCallback((interactionId: string) => {
    return getState(`interaction_${interactionId}`);
  }, [getState]);

  // Complete interaction (cleanup)
  const completeInteraction = useCallback((interactionId: string) => {
    return deleteState(`interaction_${interactionId}`);
  }, [deleteState]);

  // Cleanup all interactions
  const clearAllInteractions = useCallback(() => {
    clearState();
  }, [clearState]);

  return {
    trackInteraction,
    getInteractionState,
    completeInteraction,
    clearAllInteractions,
    getStats
  };
};