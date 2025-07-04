import React, { useEffect, useCallback, useRef } from 'react';
import { PerformanceMonitor } from './PerformanceMonitor';
import { PerformanceAlert } from './types';

interface PerformanceMonitorProps {
  children: React.ReactNode;
  onAlert?: (alert: PerformanceAlert) => void;
  enableConsoleLogging?: boolean;
}

// HOC for tracking component performance
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return React.memo((props: P) => {
    const mountTime = useRef<number>(Date.now());
    const renderCount = useRef<number>(0);

    useEffect(() => {
      const loadTime = Date.now() - mountTime.current;
      PerformanceMonitor.trackComponentLoad(componentName, loadTime);
    }, []);

    useEffect(() => {
      const renderStart = Date.now();
      renderCount.current++;
      
      // Use RAF to measure after paint
      requestAnimationFrame(() => {
        const renderTime = Date.now() - renderStart;
        PerformanceMonitor.trackRender(componentName, renderTime);
      });
    });

    return <Component {...props} />;
  });
}

// Main monitoring component
export const PerformanceMonitorComponent: React.FC<PerformanceMonitorProps> = ({ 
  children, 
  onAlert,
  enableConsoleLogging = false 
}) => {
  useEffect(() => {
    // Set up alert handler
    if (onAlert || enableConsoleLogging) {
      const unsubscribe = PerformanceMonitor.onAlert((alert) => {
        // Skip memory leak alerts in development as they're often false positives
        if (import.meta.env.DEV && alert.type === 'memory-leak') {
          return;
        }
        
        if (enableConsoleLogging) {
          const logMethod = alert.severity === 'critical' ? 'error' : 
                          alert.severity === 'error' ? 'warn' : 'log';
          console[logMethod](`[Performance Alert] ${alert.message}`, alert);
        }
        onAlert?.(alert);
      });

      return unsubscribe;
    }
  }, [onAlert, enableConsoleLogging]);

  // Track bundle size on mount
  useEffect(() => {
    // Only track bundle size in production
    if (import.meta.env.DEV) {
      console.log('[PerformanceMonitor] Skipping bundle size tracking in development mode');
      return;
    }
    
    // Estimate bundle size from performance timing
    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource');
      // In production, look for the main bundle files (index-*.js pattern)
      const mainBundles = resources.filter(r => 
        r.name.includes('.js') && 
        (r.name.includes('/assets/index-') || r.name.includes('/assets/bundle-'))
      );
      
      if (mainBundles.length > 0) {
        const totalSize = mainBundles.reduce((sum, script) => {
          // @ts-ignore - transferSize might not be available in all browsers
          return sum + (script.transferSize || 0);
        }, 0);
        
        if (totalSize > 0) {
          PerformanceMonitor.trackBundleSize(totalSize / 1024); // Convert to KB
        }
      }
    }
  }, []);

  return <>{children}</>;
};

// Error boundary with performance tracking
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class PerformanceErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    PerformanceMonitor.trackError(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} />;
      }
      
      return (
        <div className="p-4 border border-red-500 rounded bg-red-50">
          <h2 className="text-red-700 font-bold">Something went wrong</h2>
          <details className="mt-2">
            <summary className="cursor-pointer text-red-600">Error details</summary>
            <pre className="mt-2 text-sm overflow-auto">{this.state.error.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for manual performance tracking
export function usePerformanceTracking(componentName: string) {
  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    const loadTime = Date.now() - mountTime.current;
    PerformanceMonitor.trackComponentLoad(componentName, loadTime);
  }, [componentName]);

  const trackRender = useCallback(() => {
    const renderStart = Date.now();
    renderCount.current++;
    
    requestAnimationFrame(() => {
      const renderTime = Date.now() - renderStart;
      PerformanceMonitor.trackRender(componentName, renderTime);
    });
  }, [componentName]);

  const trackError = useCallback((error: Error) => {
    PerformanceMonitor.trackError(error);
  }, []);

  return { trackRender, trackError, renderCount: renderCount.current };
}