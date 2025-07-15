import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';
import { useResponsive } from '../../hooks/useResponsive';

interface SpotlightDimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const GuidedTutorial: React.FC = () => {
  const {
    activeTutorial,
    currentStepIndex,
    isActive,
    nextStep,
    previousStep,
    goToStep,
    skipTutorial,
    endTutorial,
  } = useTutorial();

  const { isMobile } = useResponsive();
  const [spotlightDimensions, setSpotlightDimensions] = useState<SpotlightDimensions | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = activeTutorial?.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === (activeTutorial?.steps.length || 0) - 1;

  // Calculate spotlight dimensions when step changes
  useEffect(() => {
    if (!currentStep?.target) {
      setSpotlightDimensions(null);
      return;
    }

    const updateSpotlight = () => {
      const element = document.querySelector(currentStep.target!);
      if (!element) {
        setSpotlightDimensions(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      const padding = currentStep.spotlightPadding || 8;

      setSpotlightDimensions({
        top: rect.top - padding + window.scrollY,
        left: rect.left - padding + window.scrollX,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Scroll element into view if needed
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    };

    // Initial calculation
    updateSpotlight();

    // Recalculate on resize
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [currentStep]);

  // Position tooltip based on target element and position preference
  const getTooltipPosition = () => {
    if (!spotlightDimensions || !currentStep) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const position = isMobile && currentStep.mobilePosition 
      ? currentStep.mobilePosition 
      : currentStep.position || 'bottom';

    const margin = 16;
    const styles: React.CSSProperties = {};

    switch (position) {
      case 'top':
        styles.bottom = `calc(100vh - ${spotlightDimensions.top}px + ${margin}px)`;
        styles.left = spotlightDimensions.left + spotlightDimensions.width / 2;
        styles.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        styles.top = spotlightDimensions.top + spotlightDimensions.height + margin;
        styles.left = spotlightDimensions.left + spotlightDimensions.width / 2;
        styles.transform = 'translateX(-50%)';
        break;
      case 'left':
        styles.top = spotlightDimensions.top + spotlightDimensions.height / 2;
        styles.right = `calc(100vw - ${spotlightDimensions.left}px + ${margin}px)`;
        styles.transform = 'translateY(-50%)';
        break;
      case 'right':
        styles.top = spotlightDimensions.top + spotlightDimensions.height / 2;
        styles.left = spotlightDimensions.left + spotlightDimensions.width + margin;
        styles.transform = 'translateY(-50%)';
        break;
      case 'center':
        styles.top = '50%';
        styles.left = '50%';
        styles.transform = 'translate(-50%, -50%)';
        break;
    }

    return styles;
  };

  if (!isActive || !activeTutorial || !currentStep) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ pointerEvents: currentStep.allowInteraction ? 'none' : 'auto' }}
      >
        {/* Backdrop with spotlight cutout */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          >
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {spotlightDimensions && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x={spotlightDimensions.left}
                    y={spotlightDimensions.top}
                    width={spotlightDimensions.width}
                    height={spotlightDimensions.height}
                    rx="8"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.75)"
              mask="url(#spotlight-mask)"
              style={{ pointerEvents: 'auto' }}
              onClick={() => !currentStep.allowInteraction && skipTutorial()}
            />
          </svg>
        </div>

        {/* Spotlight border glow */}
        {spotlightDimensions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: spotlightDimensions.top - 2,
              left: spotlightDimensions.left - 2,
              width: spotlightDimensions.width + 4,
              height: spotlightDimensions.height + 4,
            }}
          >
            <div className="absolute inset-0 rounded-lg ring-4 ring-blue-500 ring-opacity-50 animate-pulse" />
          </motion.div>
        )}

        {/* Tutorial tooltip */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute max-w-sm mx-4"
          style={{
            ...getTooltipPosition(),
            pointerEvents: 'auto',
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentStep.title}
              </h3>
              <button
                onClick={() => endTutorial(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {currentStep.content}
            </p>

            {/* Action button if provided */}
            {currentStep.action && (
              <button
                onClick={currentStep.action.handler}
                className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep.action.label}
              </button>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {activeTutorial.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStepIndex
                      ? 'bg-blue-600 dark:bg-blue-400 w-6'
                      : index < currentStepIndex
                      ? 'bg-blue-400 dark:bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousStep}
                disabled={isFirstStep}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isFirstStep
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={skipTutorial}
                className="flex items-center gap-1 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </button>

              <button
                onClick={nextStep}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isLastStep ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};