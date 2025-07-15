import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  componentName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class AIComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null,
      errorCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('AI Component Error:', error, errorInfo);
    }

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add error reporting service integration (e.g., Sentry)
      console.error(`[${this.props.componentName || 'AIComponent'}] Error:`, error);
    }

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  getErrorMessage = (): { title: string; description: string } => {
    const { error, errorCount } = this.state;
    
    // Network errors
    if (error?.message?.toLowerCase().includes('network') || 
        error?.message?.toLowerCase().includes('fetch')) {
      return {
        title: "Connection Issue",
        description: "Can't reach the AI service. Please check your internet connection and try again."
      };
    }
    
    // API errors
    if (error?.message?.toLowerCase().includes('api') || 
        error?.message?.toLowerCase().includes('unauthorized')) {
      return {
        title: "AI Service Unavailable",
        description: "The AI is taking a break. Please try again in a moment."
      };
    }
    
    // Rate limit errors
    if (error?.message?.toLowerCase().includes('rate') || 
        error?.message?.toLowerCase().includes('limit') ||
        errorCount > 3) {
      return {
        title: "Slow Down!",
        description: "You're moving fast! Take a breather and try again in a few seconds."
      };
    }
    
    // Default error
    return {
      title: "Oops! Something went wrong",
      description: "Don't worry, even AI makes mistakes sometimes. Let's try again!"
    };
  };

  render() {
    if (this.state.hasError) {
      const { title, description } = this.getErrorMessage();
      
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{description}</AlertDescription>
            </Alert>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.href = '/ai-playground'}
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Playground
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
                <summary className="cursor-pointer font-medium">
                  Developer Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}