import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ReactContextErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    
    this.setState({
      error,
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    console.error('[React Context Error Boundary] Caught error:', error);
    console.error('[React Context Error Boundary] Error info:', errorInfo);

    if (onError) {
      onError(error, errorInfo);
    }

    // Auto-retry for React context errors
    this.scheduleRetry();
  }

  private scheduleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
      
      console.log(`[React Context Error Boundary] Scheduling retry ${retryCount + 1}/${maxRetries} in ${delay}ms`);
      
      this.retryTimeout = setTimeout(() => {
        this.handleRetry();
      }, delay);
    }
  };

  private handleRetry = () => {
    console.log('[React Context Error Boundary] Attempting retry...');
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { children, maxRetries = 3 } = this.props;

    if (hasError && error) {
      const isMaxRetriesExceeded = retryCount >= maxRetries;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">
                {isMaxRetriesExceeded ? 'Application Error' : 'Loading Issue'}
              </h1>
              
              <p className="text-white/80 mb-6">
                {isMaxRetriesExceeded 
                  ? 'We encountered an error that prevents the app from loading properly.'
                  : `Retrying... (${retryCount}/${maxRetries})`
                }
              </p>

              {isMaxRetriesExceeded && (
                <>
                  <div className="text-left bg-black/20 rounded-lg p-4 mb-6 text-sm">
                    <details className="cursor-pointer">
                      <summary className="font-semibold mb-2 text-yellow-300">
                        Technical Details
                      </summary>
                      <div className="space-y-2 text-white/70">
                        <div>
                          <strong>Error:</strong> {error.message}
                        </div>
                        {errorInfo && (
                          <div>
                            <strong>Component Stack:</strong>
                            <pre className="text-xs mt-1 whitespace-pre-wrap">
                              {errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={this.handleManualRetry}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                    
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Reload Page
                    </button>
                  </div>
                </>
              )}

              {!isMaxRetriesExceeded && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ReactContextErrorBoundary;