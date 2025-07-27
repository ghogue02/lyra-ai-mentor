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
  // Disabled in development to remove notifications
  return null;
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
  // Disabled in development to remove notifications
  return null;
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