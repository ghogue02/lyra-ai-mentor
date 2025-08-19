import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Shield, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ErrorLogger } from '@/utils/error-handling/ErrorLogger';
import { ErrorRecoveryManager } from '@/utils/error-handling/ErrorRecoveryManager';
import { NetworkErrorHandler } from '@/utils/error-handling/NetworkErrorHandler';

interface ApplicationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  errorType: 'render' | 'network' | 'state' | 'chunk' | 'unknown';
  recoveryAttempted: boolean;
  isRecovering: boolean;
}

interface ApplicationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  maxRetries?: number;
  context?: string;
  enableAutoRecovery?: boolean;
}

export class ApplicationErrorBoundary extends Component<ApplicationErrorBoundaryProps, ApplicationErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];
  private errorLogger: ErrorLogger;
  private recoveryManager: ErrorRecoveryManager;
  private networkHandler: NetworkErrorHandler;

  constructor(props: ApplicationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      errorType: 'unknown',
      recoveryAttempted: false,
      isRecovering: false
    };

    this.errorLogger = new ErrorLogger();
    this.recoveryManager = new ErrorRecoveryManager();
    this.networkHandler = new NetworkErrorHandler();
  }

  static getDerivedStateFromError(error: Error): Partial<ApplicationErrorBoundaryState> {
    const errorType = ApplicationErrorBoundary.categorizeError(error);
    return {
      hasError: true,
      error,
      errorType,
      errorId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  static categorizeError(error: Error): ApplicationErrorBoundaryState['errorType'] {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('network') || message.includes('fetch') || message.includes('xhr')) {
      return 'network';
    }
    if (message.includes('chunk') || message.includes('loading') || stack.includes('lazy')) {
      return 'chunk';
    }
    if (message.includes('state') || message.includes('reducer') || message.includes('context')) {
      return 'state';
    }
    if (stack.includes('render') || message.includes('react')) {
      return 'render';
    }
    return 'unknown';
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, context, enableAutoRecovery = true } = this.props;
    const { errorType } = this.state;
    
    // Enhanced error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: context || 'Application Root',
      errorType,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errorId: this.state.errorId,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };

    // Log error
    await this.errorLogger.logError(errorDetails);
    
    // Call custom error handler
    onError?.(error, errorInfo);
    
    // Update state with error info
    this.setState({ errorInfo });
    
    // Attempt automatic recovery for certain error types
    if (enableAutoRecovery && this.shouldAttemptAutoRecovery(errorType)) {
      this.attemptAutoRecovery(errorType);
    }
  }

  private getUserId(): string {
    // Get user ID from auth context or localStorage
    try {
      const userData = localStorage.getItem('supabase.auth.token');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.user?.id || 'anonymous';
      }
    } catch {
      // Fallback
    }
    return 'anonymous';
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('error-boundary-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('error-boundary-session-id', sessionId);
    }
    return sessionId;
  }

  private shouldAttemptAutoRecovery(errorType: ApplicationErrorBoundaryState['errorType']): boolean {
    const { retryCount } = this.state;
    const maxAutoRetries = 2;
    
    if (retryCount >= maxAutoRetries) return false;
    
    // Auto-recovery for specific error types
    switch (errorType) {
      case 'network':
      case 'chunk':
        return true;
      case 'state':
        return retryCount < 1; // Only try once for state errors
      default:
        return false;
    }
  }

  private async attemptAutoRecovery(errorType: ApplicationErrorBoundaryState['errorType']) {
    this.setState({ isRecovering: true, recoveryAttempted: true });

    try {
      switch (errorType) {
        case 'network':
          await this.networkHandler.attemptRecovery();
          break;
        case 'chunk':
          await this.recoveryManager.clearChunkCache();
          break;
        case 'state':
          await this.recoveryManager.resetApplicationState();
          break;
      }

      // Wait a moment then retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.handleRetry();
    } catch (recoveryError) {
      console.error('Auto-recovery failed:', recoveryError);
      this.setState({ isRecovering: false });
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        isRecovering: false
      });
      
      // Add a small delay before retry
      const timeout = setTimeout(() => {
        this.forceUpdate();
      }, 500);
      
      this.retryTimeouts.push(timeout);
    }
  };

  private handleReload = () => {
    // Clear any cached data before reload
    this.recoveryManager.clearAllCaches();
    window.location.reload();
  };

  private handleGoHome = () => {
    // Clear error state and navigate home
    this.recoveryManager.clearAllCaches();
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    const reportData = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Create mailto link or send to bug reporting system
    const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Application Error'}`);
    const body = encodeURIComponent(`Error ID: ${errorId}\n\nPlease describe what you were doing when this error occurred:\n\n\n\nTechnical Details:\n${JSON.stringify(reportData, null, 2)}`);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  componentWillUnmount() {
    this.retryTimeouts.forEach(clearTimeout);
  }

  render() {
    const { hasError, error, errorInfo, retryCount, errorType, recoveryAttempted, isRecovering } = this.state;
    const { children, fallback, showDetails = false, maxRetries = 3 } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback;
      }

      return (
        <ApplicationErrorFallbackUI 
          error={error}
          errorInfo={errorInfo}
          errorType={errorType}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          onReportBug={this.handleReportBug}
          showDetails={showDetails}
          retryCount={retryCount}
          maxRetries={maxRetries}
          recoveryAttempted={recoveryAttempted}
          isRecovering={isRecovering}
        />
      );
    }

    return children;
  }
}

interface ApplicationErrorFallbackUIProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  errorType: ApplicationErrorBoundaryState['errorType'];
  onRetry: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onReportBug: () => void;
  showDetails: boolean;
  retryCount: number;
  maxRetries: number;
  recoveryAttempted: boolean;
  isRecovering: boolean;
}

const ApplicationErrorFallbackUI: React.FC<ApplicationErrorFallbackUIProps> = ({
  error,
  errorInfo,
  errorType,
  onRetry,
  onReload,
  onGoHome,
  onReportBug,
  showDetails,
  retryCount,
  maxRetries,
  recoveryAttempted,
  isRecovering
}) => {
  const [showFullError, setShowFullError] = React.useState(false);
  const canRetry = retryCount < maxRetries;

  const getErrorTypeInfo = (type: ApplicationErrorBoundaryState['errorType']) => {
    switch (type) {
      case 'network':
        return {
          icon: <Network className="w-8 h-8 text-blue-600" />,
          title: 'Network Connection Issue',
          description: 'Unable to connect to our servers. Please check your internet connection.',
          color: 'border-blue-200 bg-blue-50'
        };
      case 'chunk':
        return {
          icon: <RefreshCw className="w-8 h-8 text-orange-600" />,
          title: 'Loading Issue',
          description: 'A required component failed to load. This might be due to a network issue.',
          color: 'border-orange-200 bg-orange-50'
        };
      case 'state':
        return {
          icon: <Shield className="w-8 h-8 text-purple-600" />,
          title: 'Application State Error',
          description: 'The application encountered an unexpected state. We\'re working to recover.',
          color: 'border-purple-200 bg-purple-50'
        };
      case 'render':
        return {
          icon: <Bug className="w-8 h-8 text-red-600" />,
          title: 'Component Rendering Error',
          description: 'A component failed to render properly. This is usually a temporary issue.',
          color: 'border-red-200 bg-red-50'
        };
      default:
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          title: 'Unexpected Error',
          description: 'An unexpected error occurred. We apologize for the inconvenience.',
          color: 'border-red-200 bg-red-50'
        };
    }
  };

  const errorTypeInfo = getErrorTypeInfo(errorType);

  if (isRecovering) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-md w-full border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 animate-spin">
              <RefreshCw className="w-full h-full text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Recovering...
            </h2>
            <p className="text-gray-600">
              We're attempting to automatically recover from this error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl w-full space-y-6">
        {/* Error Type Card */}
        <Card className={`${errorTypeInfo.color} border-2`}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4">
              {errorTypeInfo.icon}
            </div>
            <CardTitle className="text-xl">{errorTypeInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-4">{errorTypeInfo.description}</p>
            
            {recoveryAttempted && (
              <Badge variant="outline" className="mb-4">
                Auto-recovery attempted
              </Badge>
            )}
            
            {retryCount > 0 && (
              <p className="text-sm text-orange-600 mb-4">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                onClick={onGoHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
              
              <Button
                onClick={onReload}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              
              <Button
                onClick={onReportBug}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                Report Bug
              </Button>
            </div>

            {/* Helpful suggestions based on error type */}
            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium">Suggestions:</h4>
              {errorType === 'network' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                  <li>Wait a moment and try again</li>
                </ul>
              )}
              {errorType === 'chunk' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>Clear your browser cache</li>
                  <li>Reload the page</li>
                  <li>Try using an incognito window</li>
                </ul>
              )}
              {(errorType === 'state' || errorType === 'render') && (
                <ul className="list-disc list-inside space-y-1">
                  <li>Try refreshing the page</li>
                  <li>Clear browser data and reload</li>
                  <li>Contact support if this persists</li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Details */}
        {showDetails && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Error Details</CardTitle>
                <Button
                  onClick={() => setShowFullError(!showFullError)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  {showFullError ? 'Hide' : 'Show'} Technical Details
                </Button>
              </div>
            </CardHeader>
            
            {showFullError && (
              <CardContent>
                <div className="space-y-4 text-xs">
                  <div>
                    <strong className="text-red-800">Error Message:</strong>
                    <pre className="mt-1 text-red-700 whitespace-pre-wrap break-words bg-red-50 p-2 rounded">
                      {error.message}
                    </pre>
                  </div>
                  
                  {error.stack && (
                    <div>
                      <strong className="text-red-800">Stack Trace:</strong>
                      <pre className="mt-1 text-red-600 whitespace-pre-wrap break-words max-h-32 overflow-y-auto bg-red-50 p-2 rounded">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {errorInfo?.componentStack && (
                    <div>
                      <strong className="text-red-800">Component Stack:</strong>
                      <pre className="mt-1 text-red-600 whitespace-pre-wrap break-words max-h-32 overflow-y-auto bg-red-50 p-2 rounded">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Error ID */}
        <div className="text-center text-xs text-gray-500">
          Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{Date.now().toString(36)}</code>
        </div>
      </div>
    </div>
  );
};

export default ApplicationErrorBoundary;