import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onStepClick?: (step: number) => void;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  showStepIndicators?: boolean;
  progress?: number;
  stepTitles?: string[];
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onStepClick,
  nextButtonText = "Continue",
  nextButtonDisabled = false,
  showStepIndicators = true,
  progress,
  stepTitles = []
}) => {
  const canGoBack = currentStep > 0 && onPrevious;
  const canGoNext = currentStep < totalSteps - 1 && onNext;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{progress}% Complete</span>
          </div>
        </div>
      )}

      {/* Step Indicators */}
      {showStepIndicators && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <button
              key={index}
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep
                  ? 'bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              title={stepTitles[index] || `Step ${index + 1}`}
            >
              {index < currentStep ? '✓' : index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {canGoBack && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
        
        <div>
          {canGoNext && (
            <Button
              onClick={onNext}
              disabled={nextButtonDisabled}
              className="flex items-center gap-2"
            >
              {nextButtonText}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};