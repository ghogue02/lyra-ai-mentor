import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, BookOpen, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorLogger } from '@/utils/error-handling/ErrorLogger';

interface CarmenComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  componentType: string | null;
  chapterNumber: number | null;
  retryCount: number;
  showChapterRecovery: boolean;
}

interface CarmenComponentErrorBoundaryProps {
  children: ReactNode;
  componentType: 'engagement-builder' | 'cultural-intelligence' | 'leadership-development' | 'people-management' | 'performance-insights' | 'retention-mastery' | 'talent-acquisition' | 'team-dynamics';
  chapterNumber?: number;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, componentType: string) => void;
  enableChapterRecovery?: boolean;
  maxRetries?: number;
}

export class CarmenComponentErrorBoundary extends Component<CarmenComponentErrorBoundaryProps, CarmenComponentErrorBoundaryState> {
  private errorLogger: ErrorLogger;

  constructor(props: CarmenComponentErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      componentType: null,
      chapterNumber: null,
      retryCount: 0,
      showChapterRecovery: false
    };

    this.errorLogger = new ErrorLogger();
  }

  static getDerivedStateFromError(error: Error): Partial<CarmenComponentErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, componentType, chapterNumber, enableChapterRecovery = true } = this.props;
    
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: `Carmen:${componentType}:Chapter${chapterNumber || 'Unknown'}`,
      componentType,
      chapterNumber,
      characterName: 'Carmen',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errorId: `carmen_${componentType}_${Date.now()}`
    };

    await this.errorLogger.logError(errorDetails);
    
    this.setState({ 
      errorInfo, 
      componentType,
      chapterNumber,
      showChapterRecovery: enableChapterRecovery && this.shouldShowChapterRecovery(error)
    });
    
    onError?.(error, errorInfo, componentType);
  }

  private shouldShowChapterRecovery(error: Error): boolean {
    const message = error.message.toLowerCase();
    // Show chapter recovery for data/state issues but not for critical render errors
    return !message.includes('maximum update depth') && 
           !message.includes('hook') && 
           !message.includes('render');
  }

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
    }
  };

  private handleChapterRecovery = () => {
    const { chapterNumber } = this.state;
    // Clear any chapter-specific data
    const chapterKey = `chapter_${chapterNumber}_progress`;
    const carmenKey = `carmen_${this.props.componentType}_state`;
    
    localStorage.removeItem(chapterKey);
    localStorage.removeItem(carmenKey);
    sessionStorage.removeItem(chapterKey);
    sessionStorage.removeItem(carmenKey);
    
    // Navigate to chapter overview
    if (chapterNumber) {
      window.location.href = `/chapter/${chapterNumber}`;
    } else {
      window.location.href = '/chapter/7'; // Default to Carmen's main chapter
    }
  };

  private handleGoToChapterHub = () => {
    const { chapterNumber } = this.state;
    window.location.href = `/chapter/${chapterNumber || 7}`;
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    const { hasError, error, componentType, chapterNumber, retryCount, showChapterRecovery } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback;
      }

      return (
        <CarmenComponentErrorUI
          error={error}
          componentType={componentType || this.props.componentType}
          chapterNumber={chapterNumber || this.props.chapterNumber}
          onRetry={this.handleRetry}
          onChapterRecovery={this.handleChapterRecovery}
          onGoToChapterHub={this.handleGoToChapterHub}
          onGoHome={this.handleGoHome}
          canRetry={retryCount < maxRetries}
          retryCount={retryCount}
          maxRetries={maxRetries}
          showChapterRecovery={showChapterRecovery}
        />
      );
    }

    return children;
  }
}

interface CarmenComponentErrorUIProps {
  error: Error;
  componentType: string;
  chapterNumber?: number;
  onRetry: () => void;
  onChapterRecovery: () => void;
  onGoToChapterHub: () => void;
  onGoHome: () => void;
  canRetry: boolean;
  retryCount: number;
  maxRetries: number;
  showChapterRecovery: boolean;
}

const CarmenComponentErrorUI: React.FC<CarmenComponentErrorUIProps> = ({
  error,
  componentType,
  chapterNumber,
  onRetry,
  onChapterRecovery,
  onGoToChapterHub,
  onGoHome,
  canRetry,
  retryCount,
  maxRetries,
  showChapterRecovery
}) => {
  const getComponentInfo = (type: string) => {
    switch (type) {
      case 'engagement-builder':
        return {
          name: 'Carmen\'s Engagement Builder',
          description: 'Personalized employee engagement strategies',
          icon: <Heart className="w-6 h-6 text-purple-600" />,
          suggestions: [
            'Try refreshing the engagement workshop',
            'Return to Chapter 7 and restart the lesson',
            'Check if all your selections were saved'
          ]
        };
      case 'cultural-intelligence':
        return {
          name: 'Cultural Intelligence Workshop',
          description: 'Cross-cultural management insights',
          icon: <Users className="w-6 h-6 text-blue-600" />,
          suggestions: [
            'Restart the cultural assessment',
            'Try the simplified cultural guide',
            'Return to the main workshop menu'
          ]
        };
      case 'leadership-development':
        return {
          name: 'Leadership Development Journey',
          description: 'Strategic leadership growth path',
          icon: <BookOpen className="w-6 h-6 text-green-600" />,
          suggestions: [
            'Restart the leadership assessment',
            'Try the alternative development path',
            'Return to the leadership hub'
          ]
        };
      case 'people-management':
        return {
          name: 'People Management Mastery',
          description: 'Comprehensive people management skills',
          icon: <Users className="w-6 h-6 text-orange-600" />,
          suggestions: [
            'Try the simplified management tools',
            'Restart from the beginning of this lesson',
            'Access the people management resources'
          ]
        };
      default:
        return {
          name: 'Carmen\'s Workshop',
          description: 'People management and leadership training',
          icon: <Heart className="w-6 h-6 text-purple-600" />,
          suggestions: [
            'Try restarting this lesson',
            'Return to the main chapter',
            'Access alternative learning materials'
          ]
        };
    }
  };

  const componentInfo = getComponentInfo(componentType);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-2xl w-full space-y-6">
        {/* Carmen's Message */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              {componentInfo.icon}
            </div>
            <CardTitle className="text-xl text-purple-900">
              Oops! Carmen's Workshop Hit a Snag
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="bg-white/60 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{componentInfo.name}</h3>
              <p className="text-gray-700 text-sm">{componentInfo.description}</p>
            </div>

            {retryCount > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Attempt {retryCount} of {maxRetries} - Carmen is working to resolve this issue.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-purple-100/50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Carmen says:
              </h4>
              <p className="text-purple-800 text-sm italic">
                "Don't worry! Even the best people management strategies sometimes need a moment to regroup. 
                Let's get you back to building those amazing engagement skills!"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recovery Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {canRetry && (
                <Button
                  onClick={onRetry}
                  variant="default"
                  className="flex items-center gap-2 justify-start h-auto py-3 bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">Try Again</div>
                    <div className="text-xs opacity-90">Retry Carmen's workshop</div>
                  </div>
                </Button>
              )}

              {showChapterRecovery && (
                <Button
                  onClick={onChapterRecovery}
                  variant="outline"
                  className="flex items-center gap-2 justify-start h-auto py-3 border-purple-300"
                >
                  <BookOpen className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">Fresh Start</div>
                    <div className="text-xs text-gray-600">Clear data & restart lesson</div>
                  </div>
                </Button>
              )}

              <Button
                onClick={onGoToChapterHub}
                variant="outline"
                className="flex items-center gap-2 justify-start h-auto py-3"
              >
                <BookOpen className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Chapter {chapterNumber || 7}</div>
                  <div className="text-xs text-gray-600">Return to chapter overview</div>
                </div>
              </Button>

              <Button
                onClick={onGoHome}
                variant="outline"
                className="flex items-center gap-2 justify-start h-auto py-3"
              >
                <Home className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Dashboard</div>
                  <div className="text-xs text-gray-600">Go to main dashboard</div>
                </div>
              </Button>
            </div>

            {/* Component-specific suggestions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-sm text-gray-900 mb-2">Suggestions for this workshop:</h5>
              <ul className="text-xs text-gray-700 space-y-1">
                {componentInfo.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress preservation notice */}
            {showChapterRecovery && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Note:</strong> Using "Fresh Start" will clear your progress in this specific lesson. 
                  Your overall chapter progress will be preserved.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Error ID for support */}
        <div className="text-center text-xs text-gray-500">
          If this persists, share this error ID with support: <br />
          <code className="bg-gray-100 px-2 py-1 rounded font-mono">
            CARMEN-{componentType.toUpperCase()}-{Date.now().toString(36)}
          </code>
        </div>
      </div>
    </div>
  );
};

export default CarmenComponentErrorBoundary;