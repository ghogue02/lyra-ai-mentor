import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Settings, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorLogger } from '@/utils/error-handling/ErrorLogger';

interface InteractionPatternErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  patternType: string | null;
  retryCount: number;
  fallbackMode: 'simplified' | 'alternative' | 'none';
}

interface InteractionPatternErrorBoundaryProps {
  children: ReactNode;
  patternType: 'conversational' | 'decision-tree' | 'priority-cards' | 'preference-sliders' | 'timeline-scenario' | 'engagement-tree';
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, patternType: string) => void;
  enableFallbackMode?: boolean;
  maxRetries?: number;
}

export class InteractionPatternErrorBoundary extends Component<InteractionPatternErrorBoundaryProps, InteractionPatternErrorBoundaryState> {
  private errorLogger: ErrorLogger;

  constructor(props: InteractionPatternErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      patternType: null,
      retryCount: 0,
      fallbackMode: 'none'
    };

    this.errorLogger = new ErrorLogger();
  }

  static getDerivedStateFromError(error: Error): Partial<InteractionPatternErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, patternType, enableFallbackMode = true } = this.props;
    
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: `InteractionPattern:${patternType}`,
      patternType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errorId: `pattern_${patternType}_${Date.now()}`
    };

    await this.errorLogger.logError(errorDetails);
    
    this.setState({ 
      errorInfo, 
      patternType,
      fallbackMode: enableFallbackMode ? this.determineFallbackMode(error, patternType) : 'none'
    });
    
    onError?.(error, errorInfo, patternType);
  }

  private determineFallbackMode(error: Error, patternType: string): InteractionPatternErrorBoundaryState['fallbackMode'] {
    const message = error.message.toLowerCase();
    
    // If it's a rendering error, try simplified mode
    if (message.includes('render') || message.includes('hook') || message.includes('state')) {
      return 'simplified';
    }
    
    // If it's a data/prop error, try alternative mode
    if (message.includes('prop') || message.includes('data') || message.includes('undefined')) {
      return 'alternative';
    }
    
    // Complex patterns can try simplified versions
    if (['decision-tree', 'preference-sliders', 'timeline-scenario'].includes(patternType)) {
      return 'simplified';
    }
    
    return 'none';
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
        fallbackMode: 'none'
      });
    }
  };

  private handleSimplifiedMode = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      fallbackMode: 'simplified'
    });
  };

  private handleAlternativeMode = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      fallbackMode: 'alternative'
    });
  };

  private handleReset = () => {
    // Clear any stored pattern state
    const storageKey = `pattern_state_${this.props.patternType}`;
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      fallbackMode: 'none'
    });
  };

  render() {
    const { hasError, error, fallbackMode, retryCount, patternType } = this.state;
    const { children, fallback, maxRetries = 3, enableFallbackMode = true } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Render fallback based on mode
      if (enableFallbackMode && fallbackMode !== 'none') {
        return (
          <InteractionPatternFallback
            patternType={patternType || this.props.patternType}
            fallbackMode={fallbackMode}
            onRetry={this.handleRetry}
            onReset={this.handleReset}
            onSimplified={this.handleSimplifiedMode}
            onAlternative={this.handleAlternativeMode}
            canRetry={retryCount < maxRetries}
            retryCount={retryCount}
            maxRetries={maxRetries}
          />
        );
      }

      // Default error UI
      return (
        <InteractionPatternErrorUI
          error={error}
          patternType={patternType || this.props.patternType}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
          onSimplified={this.handleSimplifiedMode}
          onAlternative={this.handleAlternativeMode}
          canRetry={retryCount < maxRetries}
          retryCount={retryCount}
          maxRetries={maxRetries}
          enableFallbackMode={enableFallbackMode}
        />
      );
    }

    return children;
  }
}

interface InteractionPatternErrorUIProps {
  error: Error;
  patternType: string;
  onRetry: () => void;
  onReset: () => void;
  onSimplified: () => void;
  onAlternative: () => void;
  canRetry: boolean;
  retryCount: number;
  maxRetries: number;
  enableFallbackMode: boolean;
}

const InteractionPatternErrorUI: React.FC<InteractionPatternErrorUIProps> = ({
  error,
  patternType,
  onRetry,
  onReset,
  onSimplified,
  onAlternative,
  canRetry,
  retryCount,
  maxRetries,
  enableFallbackMode
}) => {
  const getPatternInfo = (type: string) => {
    switch (type) {
      case 'conversational':
        return {
          name: 'Conversational Flow',
          description: 'Interactive conversation interface',
          suggestions: ['Try simplified text-based interaction', 'Reload the conversation']
        };
      case 'decision-tree':
        return {
          name: 'Decision Tree',
          description: 'Visual decision-making tool',
          suggestions: ['Switch to simplified list view', 'Use alternative selection method']
        };
      case 'priority-cards':
        return {
          name: 'Priority Card System',
          description: 'Drag and drop priority ranking',
          suggestions: ['Try simple button-based selection', 'Use dropdown alternatives']
        };
      case 'preference-sliders':
        return {
          name: 'Preference Sliders',
          description: 'Slider-based preference setting',
          suggestions: ['Use simplified number inputs', 'Try preset option selection']
        };
      case 'timeline-scenario':
        return {
          name: 'Timeline Scenario Builder',
          description: 'Timeline-based scenario planning',
          suggestions: ['Use simplified step-by-step mode', 'Try text-based planning']
        };
      case 'engagement-tree':
        return {
          name: 'Engagement Decision Tree',
          description: 'Interactive engagement planning',
          suggestions: ['Switch to form-based input', 'Use guided questionnaire mode']
        };
      default:
        return {
          name: 'Interaction Pattern',
          description: 'Interactive component',
          suggestions: ['Try basic interaction mode', 'Use alternative interface']
        };
    }
  };

  const patternInfo = getPatternInfo(patternType);

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-orange-900">
              {patternInfo.name} Temporarily Unavailable
            </CardTitle>
            <p className="text-sm text-orange-700">{patternInfo.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {retryCount > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Retry attempt {retryCount} of {maxRetries}. The interaction pattern encountered an issue.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Try these options:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {canRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                className="flex items-center gap-2 justify-start h-auto py-3"
              >
                <RefreshCw className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Try Again</div>
                  <div className="text-xs text-gray-600">Retry the interaction</div>
                </div>
              </Button>
            )}

            {enableFallbackMode && (
              <>
                <Button
                  onClick={onSimplified}
                  variant="outline"
                  className="flex items-center gap-2 justify-start h-auto py-3"
                >
                  <Settings className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">Simplified Mode</div>
                    <div className="text-xs text-gray-600">Basic functionality</div>
                  </div>
                </Button>

                <Button
                  onClick={onAlternative}
                  variant="outline"
                  className="flex items-center gap-2 justify-start h-auto py-3"
                >
                  <Lightbulb className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">Alternative View</div>
                    <div className="text-xs text-gray-600">Different approach</div>
                  </div>
                </Button>
              </>
            )}

            <Button
              onClick={onReset}
              variant="outline"
              className="flex items-center gap-2 justify-start h-auto py-3"
            >
              <RotateCcw className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">Reset</div>
                <div className="text-xs text-gray-600">Clear and restart</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Helpful suggestions */}
        <div className="bg-white/60 p-3 rounded-lg">
          <h5 className="font-medium text-sm text-gray-900 mb-2">Suggestions:</h5>
          <ul className="text-xs text-gray-700 space-y-1">
            {patternInfo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

interface InteractionPatternFallbackProps {
  patternType: string;
  fallbackMode: 'simplified' | 'alternative';
  onRetry: () => void;
  onReset: () => void;
  onSimplified: () => void;
  onAlternative: () => void;
  canRetry: boolean;
  retryCount: number;
  maxRetries: number;
}

const InteractionPatternFallback: React.FC<InteractionPatternFallbackProps> = ({
  patternType,
  fallbackMode,
  onRetry,
  onReset,
  canRetry
}) => {
  const renderFallbackContent = () => {
    switch (patternType) {
      case 'decision-tree':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Quick Decision Guide</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Option 1: Standard Approach
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Option 2: Alternative Method
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Option 3: Custom Solution
              </Button>
            </div>
          </div>
        );
      
      case 'preference-sliders':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Quick Preferences</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Priority Level</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Complexity</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>Simple</option>
                  <option>Moderate</option>
                  <option>Complex</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Simplified Interface</h3>
            <p className="text-sm text-gray-600">
              We've switched to a simplified version while the main interface recovers.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">Continue with Basic Options</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {fallbackMode === 'simplified' ? 'Simplified Mode' : 'Alternative Mode'}
            </Badge>
            <span className="text-sm text-gray-600">
              Temporary interface while main component recovers
            </span>
          </div>
          {canRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry Full Version
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {renderFallbackContent()}
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <Button
            onClick={onReset}
            size="sm"
            variant="ghost"
            className="text-xs"
          >
            Reset and try full version
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractionPatternErrorBoundary;