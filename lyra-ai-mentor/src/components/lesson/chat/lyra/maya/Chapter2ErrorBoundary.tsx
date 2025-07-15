import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onReset?: () => void;
  allowNavigation?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number;
}

export class Chapter2ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const timeSinceLastError = now - this.state.lastErrorTime;
    
    // Reset error count if enough time has passed
    const errorCount = timeSinceLastError > 60000 ? 1 : this.state.errorCount + 1;

    // Log error details
    console.error('Chapter 2 Error:', error, errorInfo);
    
    // Track error patterns for PACE flow specific issues
    this.trackChapter2Error(error, errorInfo, errorCount);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount,
      lastErrorTime: now
    }));
  }

  private trackChapter2Error = (error: Error, errorInfo: ErrorInfo, count: number) => {
    const errorContext = {
      component: 'Chapter2',
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      count,
      timestamp: new Date().toISOString()
    };

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Chapter 2 Error Details');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Count:', count);
      console.groupEnd();
    }

    // Store in localStorage for debugging
    try {
      const errorLog = JSON.parse(localStorage.getItem('chapter2-errors') || '[]');
      errorLog.push(errorContext);
      // Keep only last 10 errors
      if (errorLog.length > 10) errorLog.shift();
      localStorage.setItem('chapter2-errors', JSON.stringify(errorLog));
    } catch (e) {
      console.warn('Could not log error to localStorage:', e);
    }
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleAutoRetry = () => {
    // Auto-retry after 3 seconds for transient errors
    this.retryTimeoutId = setTimeout(() => {
      this.handleReset();
    }, 3000);
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  getErrorSeverity = (): 'low' | 'medium' | 'high' => {
    const { error, errorCount } = this.state;
    
    // High severity: Multiple errors or critical failures
    if (errorCount >= 3 || error?.message?.toLowerCase().includes('critical')) {
      return 'high';
    }
    
    // Medium severity: AI service or network issues
    if (error?.message?.toLowerCase().includes('ai') || 
        error?.message?.toLowerCase().includes('network') ||
        error?.message?.toLowerCase().includes('fetch')) {
      return 'medium';
    }
    
    return 'low';
  };

  getErrorMessage = (): { title: string; description: string; suggestion: string } => {
    const { error, errorCount } = this.state;
    const severity = this.getErrorSeverity();
    
    // Frequent errors
    if (errorCount >= 3) {
      return {
        title: "Maya's Workshop Needs Attention",
        description: "Something's not working quite right in Maya's communication workshop. Let's try a different approach.",
        suggestion: "Return to the main learning path and try a different chapter, or refresh your browser."
      };
    }
    
    // AI Service errors
    if (error?.message?.toLowerCase().includes('ai') || 
        error?.message?.toLowerCase().includes('openai') ||
        error?.message?.toLowerCase().includes('claude')) {
      return {
        title: "Maya's AI Assistant is Taking a Break",
        description: "The AI that helps Maya generate content is temporarily unavailable.",
        suggestion: "You can still navigate through the workshop manually. The AI features will return shortly."
      };
    }
    
    // Network errors
    if (error?.message?.toLowerCase().includes('network') || 
        error?.message?.toLowerCase().includes('fetch')) {
      return {
        title: "Connection Hiccup",
        description: "Maya's workshop lost connection for a moment.",
        suggestion: "Check your internet connection and try again. Your progress is saved!"
      };
    }
    
    // PACE flow specific errors
    if (error?.message?.toLowerCase().includes('pace') ||
        error?.stack?.includes('maya') ||
        error?.stack?.includes('purpose') ||
        error?.stack?.includes('audience')) {
      return {
        title: "PACE Flow Interruption",
        description: "There was an issue with Maya's PACE methodology workflow.",
        suggestion: "Try refreshing the page to restart the PACE flow. Your learning progress will be preserved."
      };
    }
    
    // Default
    return {
      title: "Maya's Workshop Hiccup",
      description: "Something unexpected happened in Maya's communication workshop.",
      suggestion: "Don't worry - this doesn't affect your learning progress. Let's get back on track!"
    };
  };

  render() {
    if (this.state.hasError) {
      const { title, description, suggestion } = this.getErrorMessage();
      const severity = this.getErrorSeverity();
      const { allowNavigation = true } = this.props;

      // Use custom fallback if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }
      
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full space-y-6"
          >
            <Alert 
              variant={severity === 'high' ? 'destructive' : 'default'} 
              className="border-2 bg-white shadow-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg">{title}</AlertTitle>
              <AlertDescription className="text-base mt-2">
                {description}
              </AlertDescription>
            </Alert>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 What you can do:</h4>
              <p className="text-blue-800 text-sm">{suggestion}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="default"
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              {allowNavigation && (
                <>
                  <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/learning-paths'}
                    variant="outline"
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Learning Paths
                  </Button>
                </>
              )}
            </div>
            
            {/* Auto-retry notification for low severity errors */}
            {severity === 'low' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-sm text-gray-600">
                  🔄 Auto-retrying in 3 seconds...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <motion.div
                    className="bg-purple-600 h-1 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    onAnimationComplete={this.handleAutoRetry}
                  />
                </div>
              </motion.div>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg text-xs">
                <summary className="cursor-pointer font-medium text-gray-700">
                  🔧 Developer Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-600 max-h-40 overflow-y-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with Chapter 2 error boundary
export function withChapter2ErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallbackComponent?: ReactNode;
    onReset?: () => void;
    allowNavigation?: boolean;
  }
) {
  return function WrappedComponent(props: P) {
    return (
      <Chapter2ErrorBoundary {...options}>
        <Component {...props} />
      </Chapter2ErrorBoundary>
    );
  };
}