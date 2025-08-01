import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  maxRetries?: number;
  context?: string;
}

// Enhanced Error Boundary with recovery mechanisms
export class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, context } = this.props;
    
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: context || 'Unknown',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errorId: this.state.errorId
    };

    console.error('Enhanced Error Boundary caught an error:', errorDetails);
    
    // Call custom error handler
    onError?.(error, errorInfo);
    
    // Update state with error info
    this.setState({ errorInfo });
    
    // Report to error tracking service (if configured)
    this.reportError(errorDetails);
  }

  private reportError = (errorDetails: any) => {
    // In a real app, you would send this to your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    try {
      if (process.env.NODE_ENV === 'production') {
        // Example: window.errorTracker?.captureException(errorDetails);
        console.log('Error reported to tracking service:', errorDetails.errorId);
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1
      });
      
      // Add a small delay before retry to prevent immediate re-failure
      const timeout = setTimeout(() => {
        // Force a re-render
        this.forceUpdate();
      }, 500);
      
      this.retryTimeouts.push(timeout);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    // Clean up timeouts
    this.retryTimeouts.forEach(clearTimeout);
  }

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { children, fallback, showDetails = false, maxRetries = 3 } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return <ErrorFallbackUI 
        error={error}
        errorInfo={errorInfo}
        onRetry={this.handleRetry}
        onReload={this.handleReload}
        showDetails={showDetails}
        retryCount={retryCount}
        maxRetries={maxRetries}
      />;
    }

    return children;
  }
}

// Error Fallback UI Component
interface ErrorFallbackUIProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  onReload: () => void;
  showDetails: boolean;
  retryCount: number;
  maxRetries: number;
}

const ErrorFallbackUI: React.FC<ErrorFallbackUIProps> = ({
  error,
  errorInfo,
  onRetry,
  onReload,
  showDetails,
  retryCount,
  maxRetries
}) => {
  const [showFullError, setShowFullError] = React.useState(false);
  // Use window.location for navigation to avoid Router context dependency

  const canRetry = retryCount < maxRetries;

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto text-red-500 animate-scale-in">
          <AlertTriangle className="w-full h-full" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. An unexpected error occurred.
          </p>
          
          {retryCount > 0 && (
            <p className="text-sm text-orange-600">
              Retry attempt {retryCount} of {maxRetries}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3 justify-center">
            {canRetry && (
              <Button
                onClick={onRetry}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>

          <Button
            onClick={onReload}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            Reload Page
          </Button>
        </div>

        {/* Error Details (Development/Debug) */}
        {showDetails && (
          <div className="space-y-3">
            <Button
              onClick={() => setShowFullError(!showFullError)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Bug className="w-4 h-4" />
              {showFullError ? 'Hide' : 'Show'} Error Details
            </Button>

            {showFullError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-xs space-y-2 animate-expand-down">
                <div>
                  <strong className="text-red-800">Error:</strong>
                  <pre className="mt-1 text-red-700 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                </div>
                
                {error.stack && (
                  <div>
                    <strong className="text-red-800">Stack Trace:</strong>
                    <pre className="mt-1 text-red-600 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                
                {errorInfo?.componentStack && (
                  <div>
                    <strong className="text-red-800">Component Stack:</strong>
                    <pre className="mt-1 text-red-600 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>If this problem persists, please try refreshing the page.</p>
          <p>
            Error ID: <code className="bg-gray-100 px-1 rounded text-gray-700">
              {Date.now().toString(36)}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

// Async Error Boundary for handling Promise rejections
export const AsyncErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => {
  const [asyncError, setAsyncError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setAsyncError(new Error(`Async Error: ${event.reason}`));
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (asyncError) {
    return (
      <EnhancedErrorBoundary fallback={fallback}>
        <div>Async error occurred</div>
      </EnhancedErrorBoundary>
    );
  }

  return <EnhancedErrorBoundary fallback={fallback}>{children}</EnhancedErrorBoundary>;
};

// Hook for handling async errors in components
export const useAsyncError = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const throwAsync = React.useCallback((asyncError: Error) => {
    setError(asyncError);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return throwAsync;
};