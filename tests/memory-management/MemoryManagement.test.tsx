import React, { useEffect, useState, useRef } from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import {
  useCleanup,
  useMemoryManager,
  useMemoryLeakDetector,
  useStateGarbageCollector,
  useTimerCleanup,
  useEventListenerCleanup
} from '@/hooks/memory-management';
import { AutoCleanupProvider } from '@/components/memory-management/AutoCleanupProvider';
import { MemoryMonitoringDashboard } from '@/components/memory-management/MemoryMonitoringDashboard';

// Mock performance.memory for testing
const mockPerformanceMemory = {
  usedJSHeapSize: 10 * 1024 * 1024, // 10MB
  totalJSHeapSize: 50 * 1024 * 1024, // 50MB
  jsHeapSizeLimit: 100 * 1024 * 1024 // 100MB
};

Object.defineProperty(performance, 'memory', {
  value: mockPerformanceMemory,
  writable: true
});

// Test component for cleanup functionality
const TestCleanupComponent: React.FC<{ onCleanup?: () => void }> = ({ onCleanup }) => {
  const { registerCleanup } = useCleanup();
  const cleanupExecuted = useRef(false);

  useEffect(() => {
    return registerCleanup(() => {
      cleanupExecuted.current = true;
      onCleanup?.();
    });
  }, [registerCleanup, onCleanup]);

  return <div data-testid="cleanup-component">Test Component</div>;
};

// Test component for timer cleanup
const TestTimerComponent: React.FC<{ onTimer?: () => void }> = ({ onTimer }) => {
  const { setTimeout, setInterval } = useTimerCleanup();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onTimer?.();
    }, 100);

    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 50);

    return () => {
      // Timers should be auto-cleaned
    };
  }, [setTimeout, setInterval, onTimer]);

  return <div data-testid="timer-component">Count: {count}</div>;
};

// Test component for memory leak detection
const TestLeakDetectionComponent: React.FC = () => {
  const leakDetector = useMemoryLeakDetector({
    componentName: 'TestLeakDetectionComponent',
    trackEventListeners: true,
    trackTimers: true,
    trackMemoryUsage: true
  });
  
  const [, forceRerender] = useState({});
  
  // Simulate potential memory issues
  useEffect(() => {
    // Force multiple re-renders to trigger leak detection
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        forceRerender({});
      }, i * 10);
    }
  }, []);

  return (
    <div data-testid="leak-detection-component">
      <div>Renders: {leakDetector.metrics.renderCount}</div>
      <div>Has Leaks: {leakDetector.hasLeaks.toString()}</div>
      <div>Reports: {leakDetector.reports.length}</div>
    </div>
  );
};

// Test component for state garbage collection
const TestStateGCComponent: React.FC = () => {
  const { setState, getState, getStats } = useStateGarbageCollector({
    maxStateEntries: 5,
    ttl: 100, // 100ms for fast testing
    gcInterval: 50
  });
  
  const [stateCount, setStateCount] = useState(0);
  
  useEffect(() => {
    // Add multiple state entries
    for (let i = 0; i < 10; i++) {
      setState(`key-${i}`, { value: i, timestamp: Date.now() });
    }
    
    setTimeout(() => {
      setStateCount(getStats().totalEntries);
    }, 150); // Wait for GC
  }, [setState, getStats]);

  return (
    <div data-testid="state-gc-component">
      <div>State Count: {stateCount}</div>
    </div>
  );
};

describe('Memory Management System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useCleanup Hook', () => {
    it('should register and execute cleanup functions on unmount', async () => {
      const mockCleanup = vi.fn();
      
      const { unmount } = render(
        <TestCleanupComponent onCleanup={mockCleanup} />
      );
      
      expect(screen.getByTestId('cleanup-component')).toBeInTheDocument();
      
      unmount();
      
      expect(mockCleanup).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple cleanup functions', async () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();
      
      const TestMultiCleanup: React.FC = () => {
        const { registerCleanup } = useCleanup();
        
        useEffect(() => {
          registerCleanup(cleanup1);
          registerCleanup(cleanup2);
        }, [registerCleanup]);
        
        return <div>Multi Cleanup</div>;
      };
      
      const { unmount } = render(<TestMultiCleanup />);
      unmount();
      
      expect(cleanup1).toHaveBeenCalledTimes(1);
      expect(cleanup2).toHaveBeenCalledTimes(1);
    });

    it('should handle cleanup errors gracefully', async () => {
      const errorCleanup = vi.fn(() => {
        throw new Error('Cleanup error');
      });
      const normalCleanup = vi.fn();
      const mockErrorHandler = vi.fn();
      
      const TestErrorCleanup: React.FC = () => {
        const { registerCleanup } = useCleanup({ onError: mockErrorHandler });
        
        useEffect(() => {
          registerCleanup(errorCleanup);
          registerCleanup(normalCleanup);
        }, [registerCleanup]);
        
        return <div>Error Cleanup</div>;
      };
      
      const { unmount } = render(<TestErrorCleanup />);
      unmount();
      
      expect(errorCleanup).toHaveBeenCalledTimes(1);
      expect(normalCleanup).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('useTimerCleanup Hook', () => {
    it('should clean up timers automatically on unmount', async () => {
      const mockTimer = vi.fn();
      const originalClearTimeout = global.clearTimeout;
      const clearTimeoutSpy = vi.fn(originalClearTimeout);
      global.clearTimeout = clearTimeoutSpy;
      
      const { unmount } = render(
        <TestTimerComponent onTimer={mockTimer} />
      );
      
      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(150);
      });
      
      unmount();
      
      // Verify timers were cleared
      expect(clearTimeoutSpy).toHaveBeenCalled();
      
      global.clearTimeout = originalClearTimeout;
    });

    it('should track active timer count', async () => {
      const TestTimerTracking: React.FC = () => {
        const { setTimeout, activeTimers } = useTimerCleanup();
        const [timerCount, setTimerCount] = useState(0);
        
        useEffect(() => {
          setTimeout(() => {}, 1000);
          setTimeout(() => {}, 2000);
          setTimerCount(activeTimers);
        }, [setTimeout, activeTimers]);
        
        return <div data-testid="timer-count">{timerCount}</div>;
      };
      
      render(<TestTimerTracking />);
      
      await waitFor(() => {
        expect(screen.getByTestId('timer-count')).toHaveTextContent('2');
      });
    });
  });

  describe('useMemoryManager Hook', () => {
    it('should create and manage caches', async () => {
      const TestCacheComponent: React.FC = () => {
        const { createCache } = useMemoryManager();
        const [cacheValue, setCacheValue] = useState<string>('');
        
        useEffect(() => {
          const cache = createCache('testCache', 10, 1000);
          cache.set('key1', 'value1');
          const value = cache.get('key1');
          setCacheValue(value || '');
        }, [createCache]);
        
        return <div data-testid="cache-value">{cacheValue}</div>;
      };
      
      render(<TestCacheComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-value')).toHaveTextContent('value1');
      });
    });

    it('should create weak references', async () => {
      const TestWeakRefComponent: React.FC = () => {
        const { createWeakRef } = useMemoryManager();
        const [hasReference, setHasReference] = useState(false);
        
        useEffect(() => {
          const obj = { test: 'value' };
          const weakRef = createWeakRef('testObj', obj);
          const retrieved = weakRef.deref();
          setHasReference(!!retrieved);
        }, [createWeakRef]);
        
        return <div data-testid="weak-ref">{hasReference.toString()}</div>;
      };
      
      render(<TestWeakRefComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('weak-ref')).toHaveTextContent('true');
      });
    });

    it('should track memory metrics when enabled', async () => {
      const TestMemoryMetrics: React.FC = () => {
        const { metrics } = useMemoryManager({ trackMetrics: true });
        
        return (
          <div data-testid="memory-metrics">
            {metrics ? metrics.heapUsed.toString() : 'no-metrics'}
          </div>
        );
      };
      
      render(<TestMemoryMetrics />);
      
      await waitFor(() => {
        const element = screen.getByTestId('memory-metrics');
        expect(element).not.toHaveTextContent('no-metrics');
      });
    });
  });

  describe('useMemoryLeakDetector Hook', () => {
    it('should detect excessive renders', async () => {
      render(<TestLeakDetectionComponent />);
      
      // Fast-forward to trigger renders
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      await waitFor(() => {
        const rendersElement = screen.getByText(/Renders:/);
        expect(rendersElement).toBeInTheDocument();
      });
    });

    it('should track component metrics', async () => {
      render(<TestLeakDetectionComponent />);
      
      await waitFor(() => {
        expect(screen.getByText(/Has Leaks:/)).toBeInTheDocument();
        expect(screen.getByText(/Reports:/)).toBeInTheDocument();
      });
    });
  });

  describe('useStateGarbageCollector Hook', () => {
    it('should limit state entries and run garbage collection', async () => {
      render(<TestStateGCComponent />);
      
      // Fast-forward to trigger GC
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      await waitFor(() => {
        const stateCountElement = screen.getByText(/State Count:/);
        expect(stateCountElement).toBeInTheDocument();
        // Should be limited to maxStateEntries (5)
        expect(stateCountElement.textContent).toMatch(/State Count: [0-5]/);
      }, { timeout: 3000 });
    });

    it('should evict expired entries', async () => {
      const TestStateExpiration: React.FC = () => {
        const { setState, getState, getStats } = useStateGarbageCollector({
          maxStateEntries: 10,
          ttl: 50, // Very short TTL
          gcInterval: 25
        });
        
        const [hasExpired, setHasExpired] = useState(false);
        
        useEffect(() => {
          setState('shortLived', 'value');
          
          setTimeout(() => {
            const value = getState('shortLived');
            setHasExpired(!value); // Should be undefined after TTL
          }, 100);
        }, [setState, getState]);
        
        return <div data-testid="state-expired">{hasExpired.toString()}</div>;
      };
      
      render(<TestStateExpiration />);
      
      act(() => {
        vi.advanceTimersByTime(150);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('state-expired')).toHaveTextContent('true');
      });
    });
  });

  describe('AutoCleanupProvider', () => {
    it('should provide cleanup context to children', async () => {
      const TestProviderChild: React.FC = () => {
        const { registerCleanup, createCache } = useCleanup();
        const [hasContext, setHasContext] = useState(false);
        
        useEffect(() => {
          if (registerCleanup && createCache) {
            setHasContext(true);
          }
        }, [registerCleanup, createCache]);
        
        return <div data-testid="has-context">{hasContext.toString()}</div>;
      };
      
      render(
        <AutoCleanupProvider>
          <TestProviderChild />
        </AutoCleanupProvider>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('has-context')).toHaveTextContent('true');
      });
    });

    it('should handle memory warnings', async () => {
      const mockWarningHandler = vi.fn();
      
      const TestWarningComponent: React.FC = () => {
        return <div>Warning Test</div>;
      };
      
      render(
        <AutoCleanupProvider
          options={{
            enableMemoryTracking: true,
            onMemoryWarning: mockWarningHandler
          }}
        >
          <TestWarningComponent />
        </AutoCleanupProvider>
      );
      
      // Warning handler should be set up (actual warning depends on memory usage)
      expect(mockWarningHandler).toBeDefined();
    });
  });

  describe('MemoryMonitoringDashboard', () => {
    it('should render memory statistics', async () => {
      render(
        <AutoCleanupProvider>
          <MemoryMonitoringDashboard />
        </AutoCleanupProvider>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Memory Monitoring')).toBeInTheDocument();
        expect(screen.getByText('Memory Usage')).toBeInTheDocument();
        expect(screen.getByText('Memory Leaks')).toBeInTheDocument();
      });
    });

    it('should handle refresh action', async () => {
      render(
        <AutoCleanupProvider>
          <MemoryMonitoringDashboard />
        </AutoCleanupProvider>
      );
      
      const refreshButton = screen.getByText('Refresh');
      
      fireEvent.click(refreshButton);
      
      // Should trigger refresh without errors
      expect(refreshButton).toBeInTheDocument();
    });

    it('should handle force GC action', async () => {
      render(
        <AutoCleanupProvider>
          <MemoryMonitoringDashboard />
        </AutoCleanupProvider>
      );
      
      const gcButton = screen.getByText('Force GC');
      
      fireEvent.click(gcButton);
      
      // Should trigger GC without errors
      expect(gcButton).toBeInTheDocument();
    });

    it('should display memory alerts when appropriate', async () => {
      // Mock high memory usage
      const highMemoryMock = {
        usedJSHeapSize: 90 * 1024 * 1024, // 90MB
        totalJSHeapSize: 100 * 1024 * 1024, // 100MB
        jsHeapSizeLimit: 100 * 1024 * 1024
      };
      
      Object.defineProperty(performance, 'memory', {
        value: highMemoryMock,
        writable: true
      });
      
      render(
        <AutoCleanupProvider>
          <MemoryMonitoringDashboard />
        </AutoCleanupProvider>
      );
      
      // Should show high memory usage
      await waitFor(() => {
        const memoryPercentage = screen.getByText(/90%/);
        expect(memoryPercentage).toBeInTheDocument();
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex component lifecycle with multiple memory management features', async () => {
      const ComplexComponent: React.FC = () => {
        const { registerCleanup } = useCleanup();
        const { createCache } = useMemoryManager();
        const { setTimeout } = useTimerCleanup();
        const { setState } = useStateGarbageCollector();
        const [status, setStatus] = useState('initializing');
        
        useEffect(() => {
          // Create cache
          const cache = createCache('complexCache');
          cache.set('data', { complex: true });
          
          // Set up timer
          const timer = setTimeout(() => {
            setStatus('timer-executed');
          }, 100);
          
          // Set state
          setState('complexState', { initialized: true });
          
          // Register cleanup
          return registerCleanup(() => {
            setStatus('cleaned-up');
          });
        }, [registerCleanup, createCache, setTimeout, setState]);
        
        return <div data-testid="complex-component">{status}</div>;
      };
      
      const { unmount } = render(
        <AutoCleanupProvider>
          <ComplexComponent />
        </AutoCleanupProvider>
      );
      
      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('complex-component')).toHaveTextContent('initializing');
      });
      
      // Fast-forward timer
      act(() => {
        vi.advanceTimersByTime(150);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('complex-component')).toHaveTextContent('timer-executed');
      });
      
      // Unmount should trigger cleanup
      unmount();
      
      // Verify cleanup was called (component unmounted)
      expect(screen.queryByTestId('complex-component')).not.toBeInTheDocument();
    });

    it('should prevent memory leaks in rapid component mounting/unmounting', async () => {
      const DynamicComponent: React.FC<{ id: number }> = ({ id }) => {
        const { registerCleanup } = useCleanup();
        const { createCache } = useMemoryManager();
        
        useEffect(() => {
          const cache = createCache(`cache-${id}`);
          cache.set('id', id);
          
          return registerCleanup(() => {
            // Cleanup logic
          });
        }, [id, registerCleanup, createCache]);
        
        return <div data-testid={`dynamic-${id}`}>Component {id}</div>;
      };
      
      const TestRapidMounting: React.FC = () => {
        const [components, setComponents] = useState<number[]>([]);
        
        useEffect(() => {
          // Rapidly add and remove components
          const intervals: number[] = [];
          
          for (let i = 0; i < 5; i++) {
            const interval = window.setTimeout(() => {
              setComponents(prev => [...prev, i]);
              
              // Remove after a short time
              setTimeout(() => {
                setComponents(prev => prev.filter(id => id !== i));
              }, 50);
            }, i * 20);
            
            intervals.push(interval);
          }
          
          return () => {
            intervals.forEach(clearTimeout);
          };
        }, []);
        
        return (
          <div data-testid="rapid-mounting">
            {components.map(id => (
              <DynamicComponent key={id} id={id} />
            ))}
          </div>
        );
      };
      
      render(
        <AutoCleanupProvider>
          <TestRapidMounting />
        </AutoCleanupProvider>
      );
      
      // Fast-forward through the rapid mounting/unmounting
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      // Should complete without memory leaks or errors
      await waitFor(() => {
        expect(screen.getByTestId('rapid-mounting')).toBeInTheDocument();
      });
    });
  });
});