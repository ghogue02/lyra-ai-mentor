import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ApplicationErrorBoundary } from './ApplicationErrorBoundary';
import { useErrorNotification } from '@/hooks/error-handling/useErrorNotification';
import { useErrorRecovery } from '@/hooks/error-handling/useErrorRecovery';

interface AsyncErrorBoundaryState {
  asyncError: Error | null;
  promiseRejectionError: Error | null;
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onAsyncError?: (error: Error, source: 'promise' | 'async') => void;
  enableAutoRecovery?: boolean;
}

// Component wrapper to use hooks
const AsyncErrorHandler: React.FC<{
  error: Error;
  source: 'promise' | 'async';
  onRetry: () => void;
  onAsyncError?: (error: Error, source: 'promise' | 'async') => void;
}> = ({ error, source, onRetry, onAsyncError }) => {
  const { showNetworkError, showErrorNotification } = useErrorNotification();
  const { recoverFromError } = useErrorRecovery();

  React.useEffect(() => {
    onAsyncError?.(error, source);

    // Try to categorize and handle the async error
    const handleAsyncError = async () => {
      const message = error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        showNetworkError(error, async () => {
          const recovered = await recoverFromError(error, 'network');
          if (recovered) {
            onRetry();
          }
        });
      } else if (message.includes('chunk') || message.includes('loading')) {
        showErrorNotification(error, {
          severity: 'medium',
          context: 'ChunkLoading',
          showRetryAction: true
        }, {
          onRetry: async () => {
            const recovered = await recoverFromError(error, 'chunk');
            if (recovered) {
              onRetry();
            }
          }
        });
      } else {
        showErrorNotification(error, {
          severity: 'high',
          context: `AsyncError:${source}`,
          showRetryAction: true,
          showReportAction: true
        }, {
          onRetry
        });
      }
    };

    handleAsyncError();
  }, [error, source, onAsyncError, onRetry, showNetworkError, showErrorNotification, recoverFromError]);

  return null;
};

export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  private unhandledRejectionHandler: (event: PromiseRejectionEvent) => void;
  private errorHandler: (event: ErrorEvent) => void;

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      asyncError: null,
      promiseRejectionError: null
    };

    // Bind event handlers
    this.unhandledRejectionHandler = this.handleUnhandledRejection.bind(this);
    this.errorHandler = this.handleAsyncError.bind(this);
  }

  componentDidMount() {
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
    
    // Listen for async errors
    window.addEventListener('error', this.errorHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
    window.removeEventListener('error', this.errorHandler);
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Convert reason to Error if it's not already
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(`Promise rejection: ${String(event.reason)}`);

    this.setState({ promiseRejectionError: error });
    
    // Prevent the default browser behavior (logging to console)
    event.preventDefault();
  }

  private handleAsyncError(event: ErrorEvent) {
    // Only handle errors that aren't caught by React error boundaries
    if (event.error && !event.error._reactErrorBoundary) {
      console.error('Async error:', event.error);
      this.setState({ asyncError: event.error });
      event.preventDefault();
    }
  }

  private clearAsyncError = () => {
    this.setState({ asyncError: null });
  };

  private clearPromiseError = () => {
    this.setState({ promiseRejectionError: null });
  };

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    // This will catch synchronous errors in child components
    return {};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Mark error as handled by React error boundary
    (error as any)._reactErrorBoundary = true;
    console.error('AsyncErrorBoundary caught sync error:', error, errorInfo);
  }

  render() {
    const { asyncError, promiseRejectionError } = this.state;
    const { children, fallback, onAsyncError, enableAutoRecovery = true } = this.props;

    // Handle async errors
    if (asyncError) {
      if (fallback) {
        return (
          <>
            {fallback}
            <AsyncErrorHandler
              error={asyncError}
              source="async"
              onRetry={this.clearAsyncError}
              onAsyncError={onAsyncError}
            />
          </>
        );
      }

      return (
        <ApplicationErrorBoundary
          context="AsyncError"
          enableAutoRecovery={enableAutoRecovery}
          onError={() => onAsyncError?.(asyncError, 'async')}
        >
          <div>
            <AsyncErrorHandler
              error={asyncError}
              source="async"
              onRetry={this.clearAsyncError}
              onAsyncError={onAsyncError}
            />
            {children}
          </div>
        </ApplicationErrorBoundary>
      );
    }

    // Handle promise rejection errors
    if (promiseRejectionError) {
      if (fallback) {
        return (
          <>
            {fallback}
            <AsyncErrorHandler
              error={promiseRejectionError}
              source="promise"
              onRetry={this.clearPromiseError}
              onAsyncError={onAsyncError}
            />
          </>
        );
      }

      return (
        <ApplicationErrorBoundary
          context="PromiseRejection"
          enableAutoRecovery={enableAutoRecovery}
          onError={() => onAsyncError?.(promiseRejectionError, 'promise')}
        >
          <div>
            <AsyncErrorHandler
              error={promiseRejectionError}
              source="promise"
              onRetry={this.clearPromiseError}
              onAsyncError={onAsyncError}
            />
            {children}
          </div>
        </ApplicationErrorBoundary>
      );
    }

    // Wrap children in regular error boundary for sync errors
    return (
      <ApplicationErrorBoundary
        context="AsyncWrapper"
        enableAutoRecovery={enableAutoRecovery}
      >
        {children}
      </ApplicationErrorBoundary>
    );
  }
}

// Hook for handling async errors in functional components
export const useAsyncError = () => {
  const [error, setError] = React.useState<Error | null>(null);
  const { showErrorNotification } = useErrorNotification();
  const { recoverFromError } = useErrorRecovery();

  const throwAsync = React.useCallback((asyncError: Error) => {
    setError(asyncError);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncError = React.useCallback(async (
    asyncError: Error,
    errorType: 'network' | 'chunk' | 'state' | 'unknown' = 'unknown'
  ) => {
    const recovered = await recoverFromError(asyncError, errorType);
    
    if (!recovered) {
      showErrorNotification(asyncError, {
        severity: 'medium',
        context: 'AsyncOperation',
        showRetryAction: true
      }, {
        onRetry: () => clearError()
      });
    }
    
    return recovered;
  }, [recoverFromError, showErrorNotification, clearError]);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { 
    throwAsync, 
    clearError, 
    handleAsyncError,
    hasError: !!error 
  };
};

export default AsyncErrorBoundary;