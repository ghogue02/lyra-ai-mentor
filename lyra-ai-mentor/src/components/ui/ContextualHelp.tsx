import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, Clock, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getContextualHelp, getSmartTips } from '@/utils/helpContent';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextualHelpProps {
  toolId: string;
  toolCategory: string;
  userProgress?: {
    completedTools: string[];
    currentTool: string;
  };
  usageStats?: {
    count: number;
    lastUsed: Date | null;
  };
  className?: string;
  onDismiss?: () => void;
  onTipAction?: (action: string) => void;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  toolId,
  toolCategory,
  userProgress = { completedTools: [], currentTool: toolId },
  usageStats = { count: 0, lastUsed: null },
  className,
  onDismiss,
  onTipAction
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Get contextual suggestion
  const contextualSuggestion = getContextualHelp(userProgress, toolCategory);
  
  // Get smart tips based on usage
  const smartTips = getSmartTips(toolId, usageStats.count, usageStats.lastUsed);

  // Rotate tips every 10 seconds if user hasn't interacted
  useEffect(() => {
    if (!hasInteracted && smartTips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % smartTips.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [hasInteracted, smartTips.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleTipClick = (tip: string) => {
    setHasInteracted(true);
    onTipAction?.(tip);
  };

  if (!isVisible) return null;

  // Use a simple default style
  const style = {
    bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
    border: 'border-gray-200',
    icon: <Sparkles className="w-5 h-5 text-gray-600" />,
    title: 'Quick Tips'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn('relative', className)}
      >
        <Card className={cn(
          'border shadow-lg overflow-hidden',
          style.border,
          style.bg
        )}>
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {style.icon}
                <h4 className="font-semibold text-sm">{style.title}</h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Smart Tips Carousel */}
            {smartTips.length > 0 && (
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      {smartTips[currentTipIndex]}
                    </p>
                    {smartTips.length > 1 && (
                      <div className="flex gap-1 mt-2">
                        {smartTips.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentTipIndex(index);
                              setHasInteracted(true);
                            }}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full transition-colors',
                              index === currentTipIndex
                                ? 'bg-gray-800'
                                : 'bg-gray-400'
                            )}
                            aria-label={`Tip ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contextual Suggestion */}
            <div className="bg-white/80 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Suggested Next Step:
              </p>
              <p className="text-sm text-gray-700">
                {contextualSuggestion}
              </p>
            </div>

            {/* Quick Stats (if available) */}
            {usageStats.count > 0 && (
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Used {usageStats.count} times</span>
                </div>
                {usageStats.lastUsed && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      Last used {new Date(usageStats.lastUsed).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

// Floating help button that can be placed anywhere
export const FloatingHelpButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-14 h-14 rounded-full shadow-lg',
        'bg-gradient-to-r from-purple-600 to-cyan-500',
        'flex items-center justify-center text-white',
        'hover:shadow-xl transition-all duration-300',
        className
      )}
      aria-label="Get help"
    >
      <AnimatePresence mode="wait">
        {isHovered ? (
          <motion.div
            key="text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-xs font-medium"
          >
            Help
          </motion.div>
        ) : (
          <motion.div
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Progress-aware help suggestions
export const ProgressAwareHelp: React.FC<{
  completedSteps: string[];
  totalSteps: string[];
  currentStep: string;
  className?: string;
}> = ({ completedSteps, totalSteps, currentStep, className }) => {
  const progress = (completedSteps.length / totalSteps.length) * 100;
  
  const getMessage = () => {
    if (progress === 0) {
      return {
        title: 'Welcome! Let\'s get started',
        message: 'This tool will guide you step by step. Each step builds on the last.',
        icon: <Sparkles className="w-5 h-5 text-blue-600" />
      };
    } else if (progress < 50) {
      return {
        title: 'You\'re doing great!',
        message: 'Keep going - you\'re building something amazing.',
        icon: <TrendingUp className="w-5 h-5 text-green-600" />
      };
    } else if (progress < 100) {
      return {
        title: 'Almost there!',
        message: 'Just a few more steps to complete your masterpiece.',
        icon: <Target className="w-5 h-5 text-purple-600" />
      };
    } else {
      return {
        title: 'Congratulations!',
        message: 'You\'ve completed all steps. Time to put it into action!',
        icon: <Sparkles className="w-5 h-5 text-yellow-600" />
      };
    }
  };

  const { title, message, icon } = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'bg-gradient-to-r from-gray-50 to-gray-100',
        'rounded-lg p-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <h5 className="font-medium text-sm text-gray-900">{title}</h5>
          <p className="text-xs text-gray-600 mt-1">{message}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};