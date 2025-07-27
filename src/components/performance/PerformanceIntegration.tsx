import React, { Suspense, memo } from 'react';
import { EnhancedErrorBoundary } from './ErrorBoundary';
import { PerformanceManager } from './PerformanceOptimizer';
import { AccessibilityManager, AccessibleAnimation, SkipLink, LiveRegion } from './AccessibilityEnhancer';
import { OptimizedVideoAnimation } from './OptimizedVideoAnimation';
import { Loader2 } from 'lucide-react';

// Performance-optimized wrapper for the entire application
interface PerformanceWrapperProps {
  children: React.ReactNode;
  enablePerformanceMonitoring?: boolean;
  enableAccessibilityFeatures?: boolean;
  fallbackComponent?: React.ReactNode;
}

const PerformanceWrapper: React.FC<PerformanceWrapperProps> = memo(({
  children,
  enablePerformanceMonitoring = true,
  enableAccessibilityFeatures = true,
  fallbackComponent
}) => {
  React.useEffect(() => {
    // Initialize performance and accessibility managers
    if (enablePerformanceMonitoring) {
      PerformanceManager.getInstance();
    }
    
    if (enableAccessibilityFeatures) {
      AccessibilityManager.getInstance();
    }

    // Add performance observers in development
    if (process.env.NODE_ENV === 'development' && enablePerformanceMonitoring) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }

      return () => observer.disconnect();
    }
  }, [enablePerformanceMonitoring, enableAccessibilityFeatures]);

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading your learning experience...</p>
      </div>
    </div>
  );

  return (
    <EnhancedErrorBoundary
      context="Application Root"
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        console.error('Application Error:', { error, errorInfo });
        // Report to error tracking service in production
      }}
    >
      {enableAccessibilityFeatures && <SkipLink targetId="main-content" />}
      
      <Suspense fallback={fallbackComponent || defaultFallback}>
        <AccessibleAnimation className="min-h-screen">
          {enableAccessibilityFeatures && (
            <LiveRegion priority="polite">
              Application loaded successfully
            </LiveRegion>
          )}
          
          <div id="main-content" className="min-h-screen">
            {children}
          </div>
        </AccessibleAnimation>
      </Suspense>
    </EnhancedErrorBoundary>
  );
});

PerformanceWrapper.displayName = 'PerformanceWrapper';

// Optimized component loader for branded assets
interface OptimizedAssetLoaderProps {
  src: string;
  type: 'video' | 'image';
  fallback: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
  alt?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedAssetLoader: React.FC<OptimizedAssetLoaderProps> = memo(({
  src,
  type,
  fallback,
  priority = 'medium',
  className,
  alt,
  onLoad,
  onError
}) => {
  if (type === 'video') {
    return (
      <OptimizedVideoAnimation
        src={src}
        fallbackIcon={fallback}
        className={className}
        priority={priority}
        onLoad={onLoad}
        onError={onError}
        alt={alt}
        enableAccessibility={true}
      />
    );
  }

  // For images, use a performance-optimized image loader
  return (
    <EnhancedErrorBoundary fallback={fallback}>
      <img
        src={src}
        alt={alt || ''}
        className={className}
        loading={priority === 'high' ? 'eager' : 'lazy'}
        onLoad={onLoad}
        onError={onError}
      />
    </EnhancedErrorBoundary>
  );
});

OptimizedAssetLoader.displayName = 'OptimizedAssetLoader';

// Performance monitoring component for development
const PerformanceMonitor: React.FC = memo(() => {
  const [metrics, setMetrics] = React.useState<{
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
  }>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const startTime = performance.now();
    
    // Use a ref to track renders to avoid infinite loops
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    setMetrics(prev => {
      const newCount = prev.renderCount + 1;
      const newAverage = (prev.averageRenderTime * prev.renderCount + renderTime) / newCount;
      
      return {
        renderCount: newCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverage
      };
    });
  }, []); // Empty dependency array to prevent infinite loop

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>Renders: {metrics.renderCount}</div>
      <div>Last: {metrics.lastRenderTime.toFixed(2)}ms</div>
      <div>Avg: {metrics.averageRenderTime.toFixed(2)}ms</div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

// Bundle analyzer component for development
const BundleAnalyzer: React.FC = memo(() => {
  const [bundleSize, setBundleSize] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Estimate bundle size based on loaded scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;

    const estimateSize = async () => {
      for (const script of scripts) {
        try {
          const response = await fetch((script as HTMLScriptElement).src, { method: 'HEAD' });
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            totalSize += parseInt(contentLength, 10);
          }
        } catch (error) {
          // Silently handle CORS errors
        }
      }
      setBundleSize(totalSize);
    };

    estimateSize();
  }, []);

  if (process.env.NODE_ENV !== 'development' || !bundleSize) return null;

  const sizeInMB = (bundleSize / (1024 * 1024)).toFixed(2);
  const sizeColor = bundleSize > 5 * 1024 * 1024 ? 'text-red-400' : 
                   bundleSize > 2 * 1024 * 1024 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>Bundle Size:</div>
      <div className={sizeColor}>{sizeInMB} MB</div>
    </div>
  );
});

BundleAnalyzer.displayName = 'BundleAnalyzer';

// Accessibility testing component for development
const AccessibilityTester: React.FC = memo(() => {
  const [issues, setIssues] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const runAccessibilityCheck = () => {
      const foundIssues: string[] = [];

      // Check for missing alt attributes
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        foundIssues.push(`${images.length} images without alt text`);
      }

      // Check for missing aria-labels on interactive elements
      const interactiveElements = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      if (interactiveElements.length > 0) {
        foundIssues.push(`${interactiveElements.length} buttons without labels`);
      }

      // Check for proper heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      let hierarchyIssues = 0;
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          hierarchyIssues++;
        }
        lastLevel = level;
      });

      if (hierarchyIssues > 0) {
        foundIssues.push(`${hierarchyIssues} heading hierarchy issues`);
      }

      setIssues(foundIssues);
    };

    // Run check after a delay to allow content to load
    const timer = setTimeout(runAccessibilityCheck, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV !== 'development' || issues.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-900/90 text-white p-3 rounded text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Accessibility Issues:</div>
      {issues.map((issue, index) => (
        <div key={index} className="mb-1">• {issue}</div>
      ))}
    </div>
  );
});

AccessibilityTester.displayName = 'AccessibilityTester';

// Main export for complete performance and accessibility integration
export {
  PerformanceWrapper,
  OptimizedAssetLoader,
  PerformanceMonitor,
  BundleAnalyzer,
  AccessibilityTester
};