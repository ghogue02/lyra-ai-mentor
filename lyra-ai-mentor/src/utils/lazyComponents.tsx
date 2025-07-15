import React, { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Component loading states
const ComponentLoader = ({ name }: { name?: string }) => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
    <span className="text-sm text-muted-foreground">
      Loading {name || 'component'}...
    </span>
  </div>
);

// Error boundary for lazy components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
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
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <p className="text-sm text-destructive">
              Failed to load component. Please refresh the page.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Wrapper for lazy components with error boundary and loading state
export function withLazyLoading<T extends ComponentType<any>>(
  lazyComponent: () => Promise<{ default: T }>,
  componentName?: string
) {
  const LazyComponent = lazy(lazyComponent);

  return (props: React.ComponentProps<T>) => (
    <LazyErrorBoundary>
      <Suspense fallback={<ComponentLoader name={componentName} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
}

// Preload function for critical components
export function preloadComponent(
  loader: () => Promise<{ default: ComponentType<any> }>
): void {
  loader();
}

// Lazy load heavy components with retry logic
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        lastError = error;
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  });
}

// Intersection Observer for lazy loading on visibility
export function useLazyLoadOnVisible(
  loader: () => void,
  options?: IntersectionObserverInit
) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!elementRef.current || isLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            loader();
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [loader, isLoaded, options]);

  return elementRef;
}

// Dynamic import with resource hints
export function dynamicImportWithHints<T = any>(
  path: string,
  hints?: { preload?: boolean; prefetch?: boolean }
): Promise<T> {
  if (hints?.preload && typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = path;
    document.head.appendChild(link);
  } else if (hints?.prefetch && typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  }

  return import(/* @vite-ignore */ path);
}