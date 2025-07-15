import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Target,
  Lightbulb,
  Trophy,
  ChevronRight,
  Brain,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface LearningStep {
  id: string;
  title: string;
  duration: string;
  type: 'learn' | 'practice' | 'apply';
  content: React.ReactNode;
  completed: boolean;
}

interface AITip {
  id: string;
  tip: string;
  emoji: string;
}

interface LearningPathProps {
  title: string;
  skill: string;
  estimatedMinutes: number;
  objectives: LearningObjective[];
  steps: LearningStep[];
  tips: AITip[];
  onComplete?: (data: {
    completedSteps: string[];
    timeSpent: number;
    skillLevel: number;
  }) => void;
  children: React.ReactNode;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  title,
  skill,
  estimatedMinutes,
  objectives,
  steps,
  tips,
  onComplete,
  children
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());
  const [showTip, setShowTip] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(estimatedMinutes * 60);
  const [phase, setPhase] = useState<'intro' | 'learning' | 'complete'>('intro');

  // Timer countdown
  useEffect(() => {
    if (phase === 'learning' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (completedSteps.size / steps.length) * 100;
  const currentTip = tips[Math.floor(Math.random() * tips.length)];

  const markStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepId);
    setCompletedSteps(newCompleted);
    
    if (newCompleted.size === steps.length) {
      setPhase('complete');
      onComplete?.({
        completedSteps: Array.from(newCompleted),
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        skillLevel: calculateSkillLevel(newCompleted.size)
      });
    }
  };

  const calculateSkillLevel = (completed: number) => {
    const percentage = (completed / steps.length) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    return 1;
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'learn':
        return <Brain className="w-5 h-5" />;
      case 'practice':
        return <Sparkles className="w-5 h-5" />;
      case 'apply':
        return <Rocket className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'learn':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'practice':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'apply':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Phase */}
      {phase === 'intro' && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {title}
            </CardTitle>
            <Badge className="mt-2 text-lg px-4 py-1" variant="secondary">
              Learn: {skill}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time Estimate */}
            <div className="flex items-center justify-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium">~{estimatedMinutes} minutes to complete</span>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white/80 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                What You'll Learn:
              </h3>
              <div className="space-y-3">
                {objectives.map((objective) => (
                  <div key={objective.id} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{objective.title}</p>
                      <p className="text-sm text-gray-600">{objective.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tip */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900">
                <span className="text-lg mr-2">{currentTip.emoji}</span>
                <strong>AI Tip:</strong> {currentTip.tip}
              </p>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button 
                onClick={() => setPhase('learning')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Learning
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Phase */}
      {phase === 'learning' && (
        <div className="space-y-6">
          {/* Progress Header */}
          <Card className="border-0 shadow-md">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeRemaining)} remaining</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Step Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={currentStep === index ? "default" : completedSteps.has(step.id) ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  currentStep === index ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                }`}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  getStepIcon(step.type)
                )}
                {step.title}
              </Button>
            ))}
          </div>

          {/* Current Step Content */}
          <Card className={`border-2 ${getStepColor(steps[currentStep].type)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStepIcon(steps[currentStep].type)}
                  {steps[currentStep].title}
                </CardTitle>
                <Badge className={getStepColor(steps[currentStep].type)}>
                  {steps[currentStep].duration}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tip for this step */}
              {showTip && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-900">
                      <strong>Pro tip:</strong> {tips[currentStep % tips.length].tip}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTip(false)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Dynamic Content Area */}
              <div className="min-h-[400px]">
                {children}
              </div>

              {/* Step Actions */}
              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <Button
                  onClick={() => {
                    markStepComplete(steps[currentStep].id);
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(currentStep + 1);
                      setShowTip(true);
                    }
                    toast.success(`${steps[currentStep].title} completed!`);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {completedSteps.has(steps[currentStep].id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      Complete Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Completion Phase */}
      {phase === 'complete' && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Congratulations! 🎉
            </CardTitle>
            <p className="text-lg text-gray-700 mt-2">
              You've mastered: <strong>{skill}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Completion Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor((Date.now() - startTime) / 60000)} min
                </p>
                <p className="text-sm text-gray-600">Time spent</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {completedSteps.size}/{steps.length}
                </p>
                <p className="text-sm text-gray-600">Steps completed</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-gray-900">
                  Level {calculateSkillLevel(completedSteps.size)}
                </p>
                <p className="text-sm text-gray-600">Skill achieved</p>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Your Key Takeaways:
              </h3>
              <div className="space-y-2">
                {objectives.map((objective) => (
                  <div key={objective.id} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{objective.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Ready to apply your new skills?
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Practice in AI Playground
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};