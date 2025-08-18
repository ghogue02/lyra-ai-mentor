import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Loader2, 
  CheckCircle, 
  Sparkles, 
  Brain, 
  Heart, 
  Users, 
  Target,
  Wand2,
  AlertCircle
} from 'lucide-react';

export interface AIRevealStep {
  id: string;
  title: string;
  description: string;
  content?: string;
  processingMessage: string;
  completionMessage: string;
  icon: React.ReactNode;
  estimatedDuration: number; // in milliseconds
  characterPersonality?: 'thoughtful' | 'analytical' | 'empathetic' | 'strategic';
}

export interface ProgressiveAIRevealProps {
  steps: AIRevealStep[];
  onStepComplete?: (stepId: string, content: string) => void;
  onAllComplete?: () => void;
  className?: string;
  characterName?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  autoAdvance?: boolean;
  pauseBetweenSteps?: number;
  showProgress?: boolean;
  'aria-live'?: 'polite' | 'assertive';
  'aria-label'?: string;
}

const themeColors = {
  carmen: {
    primary: 'text-orange-600',
    secondary: 'text-amber-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'bg-orange-600',
    gradient: 'from-orange-50 to-amber-50'
  },
  sofia: {
    primary: 'text-rose-600',
    secondary: 'text-purple-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accent: 'bg-rose-600',
    gradient: 'from-rose-50 to-purple-50'
  },
  alex: {
    primary: 'text-blue-600',
    secondary: 'text-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'bg-blue-600',
    gradient: 'from-blue-50 to-indigo-50'
  },
  maya: {
    primary: 'text-green-600',
    secondary: 'text-teal-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    accent: 'bg-green-600',
    gradient: 'from-green-50 to-teal-50'
  },
  default: {
    primary: 'text-gray-600',
    secondary: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    accent: 'bg-gray-600',
    gradient: 'from-gray-50 to-gray-100'
  }
};

const personalityAnimations = {
  thoughtful: {
    processing: { rotate: [0, -5, 5, 0], transition: { duration: 2, repeat: Infinity } },
    completion: { scale: [1, 1.1, 1], transition: { duration: 0.5 } }
  },
  analytical: {
    processing: { x: [-2, 2, -2], transition: { duration: 1.5, repeat: Infinity } },
    completion: { y: [0, -10, 0], transition: { duration: 0.6 } }
  },
  empathetic: {
    processing: { scale: [1, 1.05, 1], transition: { duration: 1.8, repeat: Infinity } },
    completion: { rotate: [0, 360], transition: { duration: 0.8 } }
  },
  strategic: {
    processing: { opacity: [1, 0.7, 1], transition: { duration: 1.2, repeat: Infinity } },
    completion: { scale: [1, 1.2, 1], transition: { duration: 0.7 } }
  }
};

export const ProgressiveAIReveal: React.FC<ProgressiveAIRevealProps> = ({
  steps,
  onStepComplete,
  onAllComplete,
  className,
  characterName = 'AI Assistant',
  characterTheme = 'default',
  autoAdvance = true,
  pauseBetweenSteps = 1500,
  showProgress = true,
  'aria-live': ariaLive = 'polite',
  'aria-label': ariaLabel = 'AI content generation progress'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [stepContents, setStepContents] = useState<Map<string, string>>(new Map());

  const theme = themeColors[characterTheme];
  const currentStep = steps[currentStepIndex];
  const allCompleted = completedSteps.size === steps.length;

  useEffect(() => {
    if (!currentStep || completedSteps.has(currentStep.id)) return;

    const processStep = async () => {
      setProcessingStep(currentStep.id);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, currentStep.estimatedDuration));
      
      // Generate or use provided content
      const content = currentStep.content || `Generated content for ${currentStep.title}`;
      setStepContents(prev => new Map(prev.set(currentStep.id, content)));
      setCompletedSteps(prev => new Set(prev.add(currentStep.id)));
      setProcessingStep(null);
      
      // Notify parent component
      onStepComplete?.(currentStep.id, content);

      // Auto-advance to next step
      if (autoAdvance && currentStepIndex < steps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, pauseBetweenSteps);
      } else if (currentStepIndex === steps.length - 1) {
        onAllComplete?.();
      }
    };

    processStep();
  }, [currentStep, completedSteps, currentStepIndex, steps.length, autoAdvance, pauseBetweenSteps, onStepComplete, onAllComplete]);

  const getStepStatus = (step: AIRevealStep, index: number) => {
    if (completedSteps.has(step.id)) return 'completed';
    if (processingStep === step.id) return 'processing';
    if (index === currentStepIndex) return 'current';
    if (index < currentStepIndex) return 'completed';
    return 'pending';
  };

  const getPersonalityAnimation = (step: AIRevealStep, status: string) => {
    const personality = step.characterPersonality || 'thoughtful';
    const animations = personalityAnimations[personality];
    
    if (status === 'processing') return animations.processing;
    if (status === 'completed') return animations.completion;
    return {};
  };

  return (
    <div 
      className={cn('space-y-6', className)}
      aria-live={ariaLive}
      aria-label={ariaLabel}
      role="region"
    >
      {/* Progress Header */}
      {showProgress && (
        <Card className={cn('border-2', theme.border)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn('font-semibold', theme.primary)}>
                {characterName}'s AI Processing
              </h3>
              <Badge variant="outline" className={theme.primary}>
                {completedSteps.size} / {steps.length}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={cn('h-2 rounded-full', theme.accent)}
                initial={{ width: '0%' }}
                animate={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const content = stepContents.get(step.id);
          const isVisible = index <= currentStepIndex || completedSteps.has(step.id);

          if (!isVisible) return null;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                'border-2 transition-all duration-300',
                status === 'completed' ? `${theme.border} ${theme.bg}` : 'border-gray-200',
                status === 'processing' ? 'shadow-lg' : '',
                status === 'current' ? `${theme.border} shadow-md` : ''
              )}>
                <CardContent className="p-6">
                  {/* Step Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full',
                        status === 'completed' ? theme.accent + ' text-white' : 
                        status === 'processing' ? theme.bg + ' ' + theme.primary : 
                        'bg-gray-100 text-gray-400'
                      )}
                      animate={getPersonalityAnimation(step, status)}
                    >
                      {status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : status === 'processing' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        step.icon
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <h4 className={cn('font-semibold', 
                        status === 'completed' ? theme.primary : 'text-gray-700'
                      )}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {status === 'processing' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center space-x-2"
                      >
                        <Sparkles className={cn('w-4 h-4', theme.secondary)} />
                        <span className={cn('text-sm font-medium', theme.secondary)}>
                          Processing...
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Processing Message */}
                  {status === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={cn('p-3 rounded-lg mb-4', theme.bg)}
                    >
                      <div className="flex items-center space-x-2">
                        <Wand2 className={cn('w-4 h-4', theme.primary)} />
                        <span className={cn('text-sm', theme.primary)}>
                          {step.processingMessage}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Completion Message & Content */}
                  {status === 'completed' && content && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className={cn('p-3 rounded-lg mb-3', theme.bg)}>
                        <div className="flex items-center space-x-2 mb-2">
                          <Heart className={cn('w-4 h-4', theme.primary)} />
                          <span className={cn('text-sm font-medium', theme.primary)}>
                            {step.completionMessage}
                          </span>
                        </div>
                      </div>
                      
                      {/* Generated Content */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                          {content}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* All Complete Message */}
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={cn('border-2', theme.border, theme.bg)}>
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={cn('w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center', theme.accent)}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className={cn('text-xl font-bold mb-2', theme.primary)}>
                  AI Processing Complete!
                </h3>
                <p className="text-gray-600">
                  {characterName} has finished generating all content with care and precision.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressiveAIReveal;