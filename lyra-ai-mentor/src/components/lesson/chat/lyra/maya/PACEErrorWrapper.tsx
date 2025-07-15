import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  stageTitle?: string;
  paceStep?: 'Purpose' | 'Audience' | 'Consideration' | 'Email';
  onStageError?: (error: Error) => void;
  onRetry?: () => void;
  allowContinue?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PACEErrorWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`PACE ${this.props.paceStep || 'Stage'} Error:`, error, errorInfo);
    
    // Report to parent component
    if (this.props.onStageError) {
      this.props.onStageError(error);
    }

    // Log PACE-specific error details
    const paceErrorContext = {
      paceStep: this.props.paceStep,
      stageTitle: this.props.stageTitle,
      error: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    };

    try {
      const paceErrors = JSON.parse(localStorage.getItem('pace-flow-errors') || '[]');
      paceErrors.push(paceErrorContext);
      // Keep only last 5 PACE errors
      if (paceErrors.length > 5) paceErrors.shift();
      localStorage.setItem('pace-flow-errors', JSON.stringify(paceErrors));
    } catch (e) {
      console.warn('Could not log PACE error:', e);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  getPACEErrorMessage = (): { title: string; description: string; action: string } => {
    const { paceStep, error } = this.props;
    const { error: stateError } = this.state;
    
    const errorMessage = stateError?.message || error?.message || '';
    
    // AI generation errors
    if (errorMessage.toLowerCase().includes('ai') || 
        errorMessage.toLowerCase().includes('generate')) {
      return {
        title: `${paceStep} Step - AI Helper Unavailable`,
        description: "The AI that helps with suggestions is taking a break. You can still continue manually.",
        action: "Continue without AI assistance"
      };
    }
    
    // Input validation errors
    if (errorMessage.toLowerCase().includes('input') || 
        errorMessage.toLowerCase().includes('validation')) {
      return {
        title: `${paceStep} Step - Input Issue`,
        description: "There's an issue with the information provided. Let's try again.",
        action: "Retry this step"
      };
    }
    
    // Network/service errors
    if (errorMessage.toLowerCase().includes('network') || 
        errorMessage.toLowerCase().includes('fetch')) {
      return {
        title: `${paceStep} Step - Connection Issue`,
        description: "Can't connect to Maya's learning services right now.",
        action: "Try again"
      };
    }
    
    // Default PACE error
    return {
      title: `${paceStep} Step - Temporary Issue`,
      description: "Something went wrong in this part of Maya's PACE methodology.",
      action: "Retry step"
    };
  };

  render() {
    if (this.state.hasError) {
      const { title, description, action } = this.getPACEErrorMessage();
      const { allowContinue = true, paceStep } = this.props;
      
      return (
        <div className="flex items-center justify-center h-full p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4" />
                {action}
              </Button>
              
              {allowContinue && paceStep && paceStep !== 'Email' && (
                <Button
                  onClick={() => {
                    // Skip to next stage - this would need to be handled by parent
                    console.log('Continuing to next PACE step...');
                  }}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Continue to Next Step
                </Button>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
              <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Maya's Tip:</h4>
              <p className="text-sm text-blue-800">
                {paceStep === 'Purpose' && "Even if the AI helper isn't working, you can define your purpose manually based on your communication goals."}
                {paceStep === 'Audience' && "Think about who you're writing to - their concerns, preferences, and what matters to them."}
                {paceStep === 'Consideration' && "Consider what your audience cares about most and how to address their specific needs."}
                {paceStep === 'Email' && "You can still craft your email using the PACE principles you've learned, even without AI assistance."}
                {!paceStep && "The PACE methodology can be applied manually. Trust what you've learned about effective communication."}
              </p>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left">
                <summary className="text-xs text-gray-500 cursor-pointer">
                  Debug Info
                </summary>
                <pre className="text-xs text-red-600 mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                  {this.state.error.toString()}
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

// HOC for wrapping PACE components
export function withPACEErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  paceStep?: Props['paceStep'],
  stageTitle?: string
) {
  return function WrappedPACEComponent(props: P & { onStageError?: (error: Error) => void }) {
    return (
      <PACEErrorWrapper 
        paceStep={paceStep}
        stageTitle={stageTitle}
        onStageError={props.onStageError}
      >
        <Component {...props} />
      </PACEErrorWrapper>
    );
  };
}