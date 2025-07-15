import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Target, 
  Wand2, 
  BookOpen,
  Database,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { ContentAdaptationEngine } from './ContentAdaptationEngine';
import { DynamicAudienceSelector } from './DynamicAudienceSelector';
import { PathAwareContentStrategy } from './PathAwareContentStrategy';
import { AdaptiveExecutionPanel } from './AdaptiveExecutionPanel';
import { PersonalizedExamples } from './PersonalizedExamples';
import { ContentManagementSystem } from './ContentManagementSystem';

// Workflow step types
interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  active: boolean;
}

interface PersonalizationWorkflowProps {
  initialStep?: number;
  onComplete?: (result: any) => void;
  showExamples?: boolean;
  enableContentManagement?: boolean;
}

export const PersonalizationWorkflow: React.FC<PersonalizationWorkflowProps> = ({
  initialStep = 0,
  onComplete,
  showExamples = true,
  enableContentManagement = true
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [workflowData, setWorkflowData] = useState<{
    audience?: any;
    segments?: any[];
    strategy?: any;
    adaptedContent?: any;
    executedTemplate?: any;
  }>({});

  // Define workflow steps
  const steps: WorkflowStep[] = [
    {
      id: 'audience-selection',
      name: 'Audience Selection',
      description: 'Choose your target audience and segments',
      icon: Users,
      completed: !!workflowData.audience,
      active: currentStep === 0
    },
    {
      id: 'strategy-development',
      name: 'Strategy Development',
      description: 'Get personalized content recommendations',
      icon: Target,
      completed: !!workflowData.strategy,
      active: currentStep === 1
    },
    {
      id: 'content-adaptation',
      name: 'Content Adaptation',
      description: 'Adapt content dynamically to your audience',
      icon: Sparkles,
      completed: !!workflowData.adaptedContent,
      active: currentStep === 2
    },
    {
      id: 'template-execution',
      name: 'Template Execution',
      description: 'Create and execute personalized templates',
      icon: Wand2,
      completed: !!workflowData.executedTemplate,
      active: currentStep === 3
    }
  ];

  // Add optional steps
  if (showExamples) {
    steps.splice(1, 0, {
      id: 'examples',
      name: 'Examples & Inspiration',
      description: 'Browse relevant case studies and examples',
      icon: BookOpen,
      completed: false,
      active: currentStep === 1 && showExamples
    });
  }

  if (enableContentManagement) {
    steps.push({
      id: 'content-management',
      name: 'Content Management',
      description: 'Save and manage your content variations',
      icon: Database,
      completed: false,
      active: currentStep === steps.length
    });
  }

  // Calculate progress
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  // Handle step completion and navigation
  const handleStepComplete = (stepId: string, data: any) => {
    setWorkflowData(prev => ({ ...prev, [stepId.replace('-', '_').replace('-', '_')]: data }));
    
    // Auto-advance to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (onComplete) {
      onComplete({ ...workflowData, [stepId]: data });
    }
  };

  // Handle manual step navigation
  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Reset workflow
  const resetWorkflow = () => {
    setCurrentStep(0);
    setWorkflowData({});
  };

  // Get current step data for context
  const getCurrentStepContext = () => {
    const audience = workflowData.audience?.id || 'all';
    const purpose = workflowData.strategy?.purpose || 'general';
    const goal = workflowData.strategy?.goal || 'engage';
    const context = workflowData.strategy?.context || 'general';

    return { audience, purpose, goal, context };
  };

  const stepContext = getCurrentStepContext();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Workflow Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Dynamic Content Adaptation Workflow</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Create personalized, high-impact content through our guided workflow
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
          <Progress value={progress} className="w-64 h-3" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completedSteps}/{steps.length}</div>
            <div className="text-sm text-muted-foreground">Steps</div>
          </div>
        </div>
      </motion.div>

      {/* Step Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Workflow Steps
            <Button variant="outline" size="sm" onClick={resetWorkflow}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <motion.button
                    onClick={() => goToStep(index)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                      step.active 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : step.completed
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative">
                      <Icon className="w-6 h-6" />
                      {step.completed && (
                        <CheckCircle2 className="w-4 h-4 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs opacity-80">{step.description}</div>
                    </div>
                  </motion.button>
                  
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 0: Audience Selection */}
          {currentStep === 0 && (
            <DynamicAudienceSelector
              contentPurpose="fundraising"
              showSegmentation={true}
              onAudienceSelect={(audience, segments) => {
                handleStepComplete('audience-selection', { audience, segments });
              }}
            />
          )}

          {/* Step 1: Examples (if enabled) */}
          {currentStep === 1 && showExamples && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Examples & Inspiration</CardTitle>
                  <CardDescription>
                    Browse relevant examples and case studies for your selected audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalizedExamples
                    audience={stepContext.audience}
                    purpose={stepContext.purpose}
                    goal={stepContext.goal}
                    context={stepContext.context}
                    onExampleSelect={(example) => {
                      // Examples are for inspiration, auto-advance after viewing
                      setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
                    }}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-center">
                <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                  Continue to Strategy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1 or 2: Strategy Development */}
          {currentStep === (showExamples ? 2 : 1) && (
            <PathAwareContentStrategy
              audience={stepContext.audience}
              purpose={stepContext.purpose}
              goal={stepContext.goal}
              context={stepContext.context}
              onStrategySelect={(strategy) => {
                handleStepComplete('strategy-development', strategy);
              }}
            />
          )}

          {/* Step 2 or 3: Content Adaptation */}
          {currentStep === (showExamples ? 3 : 2) && (
            <ContentAdaptationEngine
              enableRealTimeAdaptation={true}
              onComplete={(adaptedContent) => {
                handleStepComplete('content-adaptation', adaptedContent);
              }}
            />
          )}

          {/* Step 3 or 4: Template Execution */}
          {currentStep === (showExamples ? 4 : 3) && (
            <AdaptiveExecutionPanel
              strategy={workflowData.strategy?.id || 'general'}
              audience={stepContext.audience}
              purpose={stepContext.purpose}
              onExecute={(template, settings) => {
                handleStepComplete('template-execution', { template, settings });
              }}
            />
          )}

          {/* Final Step: Content Management (if enabled) */}
          {enableContentManagement && currentStep === steps.length - 1 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>
                    Save your work and manage your content library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentManagementSystem
                    onContentSelect={(variant) => {
                      console.log('Selected variant:', variant);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Workflow Summary */}
      {completedSteps > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Summary</CardTitle>
            <CardDescription>Review your progress and selections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {workflowData.audience && (
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <div className="font-semibold text-blue-900">Selected Audience</div>
                  <div className="text-blue-700">{workflowData.audience.name}</div>
                  {workflowData.segments && (
                    <div className="text-sm text-blue-600">
                      {workflowData.segments.length} segments selected
                    </div>
                  )}
                </div>
              )}

              {workflowData.strategy && (
                <div className="p-4 bg-green-50 rounded border border-green-200">
                  <div className="font-semibold text-green-900">Content Strategy</div>
                  <div className="text-green-700">{workflowData.strategy.name}</div>
                  <div className="text-sm text-green-600">
                    {workflowData.strategy.tactics?.length || 0} tactics
                  </div>
                </div>
              )}

              {workflowData.adaptedContent && (
                <div className="p-4 bg-purple-50 rounded border border-purple-200">
                  <div className="font-semibold text-purple-900">Adapted Content</div>
                  <div className="text-purple-700">Template optimized</div>
                  <div className="text-sm text-purple-600">
                    {workflowData.adaptedContent.personalizationFields?.length || 0} fields
                  </div>
                </div>
              )}

              {workflowData.executedTemplate && (
                <div className="p-4 bg-orange-50 rounded border border-orange-200">
                  <div className="font-semibold text-orange-900">Template Ready</div>
                  <div className="text-orange-700">Ready for execution</div>
                  <div className="text-sm text-orange-600">
                    {workflowData.executedTemplate.template?.type || 'template'}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Actions */}
      {progress === 100 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Workflow Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Your personalized content adaptation workflow is ready. You can now execute your templates or save them for later use.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button onClick={resetWorkflow} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Workflow
              </Button>
              <Button onClick={() => onComplete?.(workflowData)}>
                <Play className="w-4 h-4 mr-2" />
                Execute Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizationWorkflow;