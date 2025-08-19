import { useEffect, useRef, useCallback } from 'react';

type CleanupFunction = () => void;
type CleanupRegistry = Set<CleanupFunction>;

interface CleanupOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for automatic cleanup management
 * Ensures all registered cleanup functions are called on unmount
 */
export const useCleanup = (options: CleanupOptions = {}) => {
  const { immediate = false, onError } = options;
  const cleanupRegistry = useRef<CleanupRegistry>(new Set());
  const isUnmounted = useRef(false);

  // Register a cleanup function
  const registerCleanup = useCallback((cleanup: CleanupFunction): CleanupFunction => {
    if (isUnmounted.current) {
      // If component is already unmounted, execute immediately
      try {
        cleanup();
      } catch (error) {
        onError?.(error as Error);
      }
      return () => {};
    }

    cleanupRegistry.current.add(cleanup);

    // Return an unregister function
    return () => {
      cleanupRegistry.current.delete(cleanup);
    };
  }, [onError]);

  // Execute all cleanup functions
  const executeCleanup = useCallback(() => {
    if (cleanupRegistry.current.size === 0) return;

    const cleanups = Array.from(cleanupRegistry.current);
    cleanupRegistry.current.clear();

    cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        onError?.(error as Error);
        console.error('Error during cleanup:', error);
      }
    });
  }, [onError]);

  // Execute cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmounted.current = true;
      executeCleanup();
    };
  }, [executeCleanup]);

  // Immediate cleanup if requested
  useEffect(() => {
    if (immediate) {
      return executeCleanup;
    }
  }, [immediate, executeCleanup]);

  // Manual cleanup trigger
  const manualCleanup = useCallback(() => {
    executeCleanup();
  }, [executeCleanup]);

  return {
    registerCleanup,
    manualCleanup,
    isUnmounted: isUnmounted.current,
    cleanupCount: cleanupRegistry.current.size
  };
};

/**
 * Hook for automatic timer cleanup
 */
export const useTimerCleanup = () => {
  const { registerCleanup } = useCleanup();
  const timers = useRef<Set<number>>(new Set());

  const setTimeout = useCallback((callback: () => void, delay: number): number => {
    const timerId = window.setTimeout(() => {
      timers.current.delete(timerId);
      callback();
    }, delay);

    timers.current.add(timerId);
    registerCleanup(() => {
      window.clearTimeout(timerId);
      timers.current.delete(timerId);
    });

    return timerId;
  }, [registerCleanup]);

  const setInterval = useCallback((callback: () => void, delay: number): number => {
    const intervalId = window.setInterval(callback, delay);
    
    timers.current.add(intervalId);
    registerCleanup(() => {
      window.clearInterval(intervalId);
      timers.current.delete(intervalId);
    });

    return intervalId;
  }, [registerCleanup]);

  const clearTimeout = useCallback((timerId: number) => {
    window.clearTimeout(timerId);
    timers.current.delete(timerId);
  }, []);

  const clearInterval = useCallback((intervalId: number) => {
    window.clearInterval(intervalId);
    timers.current.delete(intervalId);
  }, []);

  return {
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    activeTimers: timers.current.size
  };
};

/**
 * Hook for automatic event listener cleanup
 */
export const useEventListenerCleanup = () => {
  const { registerCleanup } = useCleanup();
  const listeners = useRef<Map<Element | Document | Window, Set<string>>>(new Map());

  const addEventListener = useCallback((
    target: Element | Document | Window,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ) => {
    target.addEventListener(type, listener, options);

    // Track the listener
    if (!listeners.current.has(target)) {
      listeners.current.set(target, new Set());
    }
    listeners.current.get(target)!.add(type);

    // Register cleanup
    registerCleanup(() => {
      target.removeEventListener(type, listener, options);
      const targetListeners = listeners.current.get(target);
      if (targetListeners) {
        targetListeners.delete(type);
        if (targetListeners.size === 0) {
          listeners.current.delete(target);
        }
      }
    });
  }, [registerCleanup]);

  return {
    addEventListener,
    activeListeners: Array.from(listeners.current.entries()).reduce(
      (total, [, types]) => total + types.size, 0
    )
  };
};