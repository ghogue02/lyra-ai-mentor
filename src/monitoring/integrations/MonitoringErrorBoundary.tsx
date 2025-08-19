/**
 * Enhanced Error Boundary with Monitoring Integration
 * Integrates error tracking with comprehensive monitoring system
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Shield, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { ErrorTracker } from '../core/ErrorTracker';
import { MetricsManager } from '../core/MetricsManager';
import { InteractionAnalytics } from '../analytics/InteractionAnalytics';
import { AlertManager } from '../alerts/AlertManager';
import { ComponentProfiler } from '../core/ComponentProfiler';

interface MonitoringErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  errorType: 'render' | 'network' | 'state' | 'chunk' | 'ai' | 'unknown';
  recoveryAttempted: boolean;
  isRecovering: boolean;
  sessionId: string;
}

interface MonitoringErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  maxRetries?: number;
  context?: string;
  enableAutoRecovery?: boolean;
  componentName?: string;
  enableMonitoring?: boolean;
}

export class MonitoringErrorBoundary extends Component<MonitoringErrorBoundaryProps, MonitoringErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];
  private errorTracker: ErrorTracker;
  private metricsManager: MetricsManager;
  private analytics: InteractionAnalytics;
  private alertManager: AlertManager;
  private profiler: ComponentProfiler;
  private sessionId: string;

  constructor(props: MonitoringErrorBoundaryProps) {
    super(props);
    
    this.sessionId = this.generateSessionId();
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      errorType: 'unknown',
      recoveryAttempted: false,
      isRecovering: false,
      sessionId: this.sessionId
    };

    // Initialize monitoring systems
    this.errorTracker = ErrorTracker.getInstance();
    this.metricsManager = MetricsManager.getInstance();
    this.analytics = InteractionAnalytics.getInstance();
    this.alertManager = AlertManager.getInstance();
    this.profiler = ComponentProfiler.getInstance();

    // Start monitoring if enabled
    if (props.enableMonitoring !== false) {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    this.errorTracker.startTracking();
    this.metricsManager.startCollection();
    this.analytics.startTracking();
    this.alertManager.startMonitoring();
    this.profiler.enable();
  }

  private generateSessionId(): string {
    return `error-boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static getDerivedStateFromError(error: Error): Partial<MonitoringErrorBoundaryState> {
    const errorType = MonitoringErrorBoundary.categorizeError(error);
    return {
      hasError: true,
      error,
      errorType,
      errorId: `eb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  static categorizeError(error: Error): MonitoringErrorBoundaryState['errorType'] {
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
    if (message.includes('ai') || message.includes('openai') || message.includes('claude') || message.includes('llm')) {
      return 'ai';
    }
    if (stack.includes('render') || message.includes('react')) {
      return 'render';
    }
    return 'unknown';
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, context, enableAutoRecovery = true, componentName } = this.props;
    const { errorType, errorId } = this.state;
    
    // Track error with comprehensive monitoring
    const errorTrackingId = this.errorTracker.trackReactError(error, errorInfo, {
      sessionId: this.sessionId,
      userId: this.getUserId(),
      componentName: componentName || context || 'ErrorBoundary'
    });

    // Record performance metrics at time of error
    this.metricsManager.recordMetric(this.sessionId, {
      errorRate: 1,
      timestamp: new Date()
    }, {
      userId: this.getUserId(),
      componentName: componentName || 'ErrorBoundary',
      interactionType: 'error-boundary-catch'
    });

    // Track interaction analytics
    this.analytics.trackInteraction({
      sessionId: this.sessionId,
      userId: this.getUserId(),
      type: 'ai-interaction',
      component: componentName || 'ErrorBoundary',
      element: 'error-catch',
      data: {
        errorType,
        errorId,
        errorMessage: error.message,
        componentStack: errorInfo.componentStack
      },
      success: false
    });

    // Profile component error if component name is provided
    if (componentName) {
      this.profiler.trackError(componentName, error);
    }

    // Create alert for critical errors
    if (errorType === 'ai' || errorType === 'network') {
      this.alertManager.createAlert({
        type: 'error',
        severity: 'high',
        title: `${errorType.toUpperCase()} Error in ${componentName || 'Component'}`,
        message: `Error boundary caught ${errorType} error: ${error.message}`,
        metric: 'errorRate',
        currentValue: 1,
        threshold: 0
      });
    }

    // Enhanced error details for logging
    const errorDetails = {
      errorId,
      errorTrackingId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: context || 'Error Boundary',
      errorType,
      componentName,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.sessionId,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memoryUsage: this.getMemoryUsage(),
      performanceMetrics: this.getPerformanceSnapshot()
    };

    // Log comprehensive error information
    console.error('Error Boundary - Comprehensive Error Details:', errorDetails);
    
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

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getPerformanceSnapshot(): any {
    try {
      return {
        navigation: performance.getEntriesByType('navigation')[0],
        resources: performance.getEntriesByType('resource').length,
        measures: performance.getEntriesByType('measure').length,
        marks: performance.getEntriesByType('mark').length,
        timing: performance.timing
      };
    } catch {
      return null;
    }
  }

  private shouldAttemptAutoRecovery(errorType: MonitoringErrorBoundaryState['errorType']): boolean {
    const { retryCount } = this.state;
    const maxAutoRetries = 2;
    
    if (retryCount >= maxAutoRetries) return false;
    
    switch (errorType) {
      case 'network':
      case 'chunk':
      case 'ai':
        return true;
      case 'state':
        return retryCount < 1;
      default:
        return false;
    }
  }

  private async attemptAutoRecovery(errorType: MonitoringErrorBoundaryState['errorType']) {
    this.setState({ isRecovering: true, recoveryAttempted: true });

    // Track recovery attempt
    this.analytics.trackInteraction({
      sessionId: this.sessionId,
      userId: this.getUserId(),
      type: 'ai-interaction',
      component: 'ErrorBoundary',
      element: 'auto-recovery',
      data: { errorType, attempt: this.state.retryCount + 1 },
      success: false // Will be updated if successful
    });

    try {
      switch (errorType) {
        case 'network':
          await this.recoverFromNetworkError();
          break;
        case 'chunk':
          await this.recoverFromChunkError();
          break;
        case 'state':
          await this.recoverFromStateError();
          break;
        case 'ai':
          await this.recoverFromAIError();
          break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      this.handleRetry();
      
      // Mark recovery as successful
      this.analytics.trackInteraction({
        sessionId: this.sessionId,
        userId: this.getUserId(),
        type: 'ai-interaction',
        component: 'ErrorBoundary',
        element: 'auto-recovery-success',
        data: { errorType },
        success: true
      });
      
    } catch (recoveryError) {
      console.error('Auto-recovery failed:', recoveryError);
      
      this.errorTracker.trackError(recoveryError as Error, {
        sessionId: this.sessionId,
        userId: this.getUserId(),
        component: 'ErrorBoundary',
        action: 'auto-recovery',
        severity: 'medium'
      });
      
      this.setState({ isRecovering: false });
    }
  }

  private async recoverFromNetworkError(): Promise<void> {
    // Clear network caches and retry
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  }

  private async recoverFromChunkError(): Promise<void> {
    // Clear module cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }
  }

  private async recoverFromStateError(): Promise<void> {
    // Clear application state
    try {
      sessionStorage.clear();
      localStorage.removeItem('app-state');
    } catch (error) {
      console.warn('Failed to clear state:', error);
    }
  }

  private async recoverFromAIError(): Promise<void> {
    // Clear AI-related caches and state
    try {
      localStorage.removeItem('ai-chat-state');
      sessionStorage.removeItem('ai-context');
    } catch (error) {
      console.warn('Failed to clear AI state:', error);
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount < maxRetries) {
      // Track retry attempt
      this.analytics.trackInteraction({
        sessionId: this.sessionId,
        userId: this.getUserId(),
        type: 'click',
        component: 'ErrorBoundary',
        element: 'retry-button',
        data: { attempt: retryCount + 1 },
        success: true
      });

      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        isRecovering: false
      });
      
      const timeout = setTimeout(() => {
        this.forceUpdate();
      }, 500);
      
      this.retryTimeouts.push(timeout);
    }
  };

  private handleReload = () => {
    this.analytics.trackInteraction({
      sessionId: this.sessionId,
      userId: this.getUserId(),
      type: 'click',
      component: 'ErrorBoundary',
      element: 'reload-button',
      data: {},
      success: true
    });

    window.location.reload();
  };

  private handleGoHome = () => {
    this.analytics.trackInteraction({
      sessionId: this.sessionId,
      userId: this.getUserId(),
      type: 'navigation',
      component: 'ErrorBoundary',
      element: 'home-button',
      data: {},
      success: true
    });

    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    
    this.analytics.trackInteraction({
      sessionId: this.sessionId,
      userId: this.getUserId(),
      type: 'click',
      component: 'ErrorBoundary',
      element: 'report-bug',
      data: { errorId },
      success: true
    });

    const reportData = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      monitoringData: {
        sessionId: this.sessionId,
        userId: this.getUserId(),
        memoryUsage: this.getMemoryUsage(),
        performanceSnapshot: this.getPerformanceSnapshot()
      }
    };

    const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Application Error'}`);
    const body = encodeURIComponent(
      `Error ID: ${errorId}\n\n` +
      `Please describe what you were doing when this error occurred:\n\n\n\n` +
      `Technical Details:\n${JSON.stringify(reportData, null, 2)}`
    );
    
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  componentWillUnmount() {
    this.retryTimeouts.forEach(clearTimeout);
  }

  render() {
    const { 
      hasError, 
      error, 
      errorInfo, 
      retryCount, 
      errorType, 
      recoveryAttempted, 
      isRecovering 
    } = this.state;
    const { 
      children, 
      fallback, 
      showDetails = false, 
      maxRetries = 3,
      componentName 
    } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback;
      }

      return (
        <MonitoringErrorFallbackUI 
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
          componentName={componentName}
          sessionId={this.sessionId}
          analytics={this.analytics}
        />
      );
    }

    return children;
  }
}

interface MonitoringErrorFallbackUIProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  errorType: MonitoringErrorBoundaryState['errorType'];
  onRetry: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onReportBug: () => void;
  showDetails: boolean;
  retryCount: number;
  maxRetries: number;
  recoveryAttempted: boolean;
  isRecovering: boolean;
  componentName?: string;
  sessionId: string;
  analytics: InteractionAnalytics;
}

const MonitoringErrorFallbackUI: React.FC<MonitoringErrorFallbackUIProps> = ({
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
  isRecovering,
  componentName,
  sessionId,
  analytics
}) => {
  const [showFullError, setShowFullError] = React.useState(false);
  const canRetry = retryCount < maxRetries;

  // Track error UI view
  React.useEffect(() => {
    analytics.trackInteraction({
      sessionId,
      type: 'ai-interaction',
      component: 'ErrorBoundary',
      element: 'error-ui-displayed',
      data: { 
        errorType, 
        componentName,
        retryCount,
        recoveryAttempted 
      },
      success: false
    });
  }, []);

  const getErrorTypeInfo = (type: MonitoringErrorBoundaryState['errorType']) => {
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
      case 'ai':
        return {
          icon: <Bug className="w-8 h-8 text-green-600" />,
          title: 'AI Service Error',
          description: 'There was an issue with the AI service. This is usually temporary.',
          color: 'border-green-200 bg-green-50'
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
            {componentName && (
              <p className="text-sm text-gray-500 mt-2">
                Component: {componentName}
              </p>
            )}
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
            {componentName && (
              <p className="text-sm text-gray-600">Component: {componentName}</p>
            )}
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

            {/* Enhanced suggestions based on error type and monitoring data */}
            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium">Suggestions:</h4>
              {errorType === 'ai' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>The AI service may be temporarily unavailable</li>
                  <li>Check your internet connection</li>
                  <li>Try again in a few moments</li>
                  <li>Contact support if this persists</li>
                </ul>
              )}
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
                  onClick={() => {
                    setShowFullError(!showFullError);
                    analytics.trackInteraction({
                      sessionId,
                      type: 'click',
                      component: 'ErrorBoundary',
                      element: 'toggle-error-details',
                      data: { expanded: !showFullError },
                      success: true
                    });
                  }}
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

                  <div>
                    <strong className="text-blue-800">Monitoring Session:</strong>
                    <p className="mt-1 text-blue-600 bg-blue-50 p-2 rounded">
                      Session ID: {sessionId}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Session ID for debugging */}
        <div className="text-center text-xs text-gray-500">
          Session ID: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
        </div>
      </div>
    </div>
  );
};

export default MonitoringErrorBoundary;