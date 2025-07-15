import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip?: () => void;
  persistKey?: string; // localStorage key to remember completion
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
  persistKey
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check if tutorial was already completed
  useEffect(() => {
    if (persistKey) {
      const completed = localStorage.getItem(`tutorial-${persistKey}-completed`);
      if (completed === 'true') {
        setIsVisible(false);
        return;
      }
    }
    setIsVisible(isActive);
  }, [isActive, persistKey]);

  // Update target element position
  useEffect(() => {
    if (!isVisible || !steps[currentStep]) return;

    const updatePosition = () => {
      const target = document.querySelector(steps[currentStep].target);
      if (target) {
        setTargetRect(target.getBoundingClientRect());
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    // Scroll target into view
    const target = document.querySelector(steps[currentStep].target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, steps, isVisible]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (persistKey) {
      localStorage.setItem(`tutorial-${persistKey}-completed`, 'true');
    }
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    if (persistKey) {
      localStorage.setItem(`tutorial-${persistKey}-completed`, 'true');
    }
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible || !targetRect) return null;

  const step = steps[currentStep];
  const position = step.position || 'bottom';

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Approximate

    switch (position) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - padding,
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + padding,
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
      >
        {/* Backdrop with spotlight effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/60" />
          {/* Spotlight hole */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute bg-transparent"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* Tutorial Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute z-10"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            width: 320,
          }}
        >
          <Card className="relative shadow-2xl border-0">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute right-2 top-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6">
              {/* Step indicator */}
              <div className="flex items-center gap-1 mb-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      index <= currentStep
                        ? 'bg-purple-600'
                        : 'bg-gray-300'
                    )}
                  />
                ))}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{step.content}</p>

              {/* Custom action button */}
              {step.action && (
                <Button
                  onClick={step.action.onClick}
                  variant="outline"
                  size="sm"
                  className="mb-4 w-full"
                >
                  {step.action.label}
                </Button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-gray-500">
                  {currentStep + 1} of {steps.length}
                </span>

                {currentStep === steps.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={handleComplete}
                    className="gap-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                  >
                    Complete
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Arrow pointing to target */}
          <div
            className={cn(
              'absolute w-0 h-0',
              position === 'top' && 'bottom-[-8px] left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white',
              position === 'bottom' && 'top-[-8px] left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white',
              position === 'left' && 'right-[-8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-white',
              position === 'right' && 'left-[-8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-white'
            )}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// Hook to manage tutorial state
export const useTutorial = (tutorialId: string) => {
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`tutorial-${tutorialId}-completed`);
    setHasCompleted(completed === 'true');
  }, [tutorialId]);

  const startTutorial = () => {
    setIsActive(true);
  };

  const completeTutorial = () => {
    localStorage.setItem(`tutorial-${tutorialId}-completed`, 'true');
    setHasCompleted(true);
    setIsActive(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(`tutorial-${tutorialId}-completed`);
    setHasCompleted(false);
  };

  return {
    isActive,
    hasCompleted,
    startTutorial,
    completeTutorial,
    resetTutorial
  };
};

// Pre-built tutorial for common AI tool patterns
export const createAIToolTutorial = (toolName: string): TutorialStep[] => [
  {
    id: 'welcome',
    target: '[data-tutorial="tool-header"]',
    title: `Welcome to ${toolName}!`,
    content: 'This AI-powered tool will help you work smarter, not harder. Let me show you around.',
    position: 'bottom'
  },
  {
    id: 'input',
    target: '[data-tutorial="input-area"]',
    title: 'Start Here',
    content: 'Enter your information or prompt in this area. Be specific for best results.',
    position: 'right'
  },
  {
    id: 'options',
    target: '[data-tutorial="options"]',
    title: 'Customize Your Output',
    content: 'Use these options to tailor the AI response to your exact needs.',
    position: 'left'
  },
  {
    id: 'generate',
    target: '[data-tutorial="generate-button"]',
    title: 'Generate Results',
    content: 'Click here when you\'re ready to see the AI work its magic!',
    position: 'top'
  },
  {
    id: 'output',
    target: '[data-tutorial="output-area"]',
    title: 'Review & Refine',
    content: 'Your AI-generated content appears here. You can edit, copy, or regenerate as needed.',
    position: 'top'
  },
  {
    id: 'help',
    target: '[data-tutorial="help-button"]',
    title: 'Need Help?',
    content: 'Click the help icon anytime for tips, examples, and best practices.',
    position: 'left'
  }
];