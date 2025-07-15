import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock,
  RefreshCw,
  Sparkles,
  CheckSquare,
  Calendar,
  Target,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { LearningPath } from '@/components/learning/LearningPath';
import { enhancedAIService } from '@/services/enhancedAIService';

interface AutomationElement {
  type: 'trigger' | 'action' | 'benefit';
  label: string;
  emoji: string;
  description: string;
  example?: string;
}

const triggerOptions: AutomationElement[] = [
  { type: 'trigger', label: 'Daily at 9 AM', emoji: '⏰', description: 'Time-based', example: 'Send daily reports' },
  { type: 'trigger', label: 'New Form Submission', emoji: '📝', description: 'Event-based', example: 'Welcome new volunteers' },
  { type: 'trigger', label: 'Task Completion', emoji: '✅', description: 'Action-based', example: 'Follow up after training' },
];

const actionOptions: AutomationElement[] = [
  { type: 'action', label: 'Send Email', emoji: '📧', description: 'Auto-communicate', example: 'Thank you messages' },
  { type: 'action', label: 'Update Spreadsheet', emoji: '📊', description: 'Record data', example: 'Track donations' },
  { type: 'action', label: 'Create Task', emoji: '📋', description: 'Assign work', example: 'Schedule follow-ups' },
];

const benefitOptions: AutomationElement[] = [
  { type: 'benefit', label: 'Save 2 Hours Daily', emoji: '⏱️', description: 'Time back for impact' },
  { type: 'benefit', label: 'Never Miss Follow-ups', emoji: '🎯', description: '100% consistency' },
  { type: 'benefit', label: 'Focus on People', emoji: '❤️', description: 'Less admin, more mission' },
];

export const RachelAutomationLearningPath: React.FC = () => {
  const [selectedElements, setSelectedElements] = useState<{
    trigger?: AutomationElement;
    action?: AutomationElement;
    benefit?: AutomationElement;
  }>({});
  const [automationPlan, setAutomationPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskExample, setTaskExample] = useState('');

  const objectives = [
    {
      id: '1',
      title: 'Identify Automation Opportunities',
      description: 'Spot repetitive tasks that technology can handle for you'
    },
    {
      id: '2',
      title: 'Build Your First Automation',
      description: 'Create a simple workflow that saves you time immediately'
    },
    {
      id: '3',
      title: 'Calculate Time Savings',
      description: 'See the real impact of automation on your daily work'
    }
  ];

  const steps = [
    {
      id: 'learn',
      title: 'Learn Automation Basics',
      duration: '30 seconds',
      type: 'learn' as const,
      content: null,
      completed: false
    },
    {
      id: 'practice',
      title: 'Design Your Automation',
      duration: '2 minutes',
      type: 'practice' as const,
      content: null,
      completed: false
    },
    {
      id: 'apply',
      title: 'Build & Calculate Savings',
      duration: '2.5 minutes',
      type: 'apply' as const,
      content: null,
      completed: false
    }
  ];

  const tips = [
    { id: '1', tip: 'Start small - automate one task that you do every single day', emoji: '🎯' },
    { id: '2', tip: 'If you do it more than twice, it\'s worth automating!', emoji: '✌️' },
    { id: '3', tip: 'Use templates for emails - personalize the greeting, automate the rest', emoji: '📧' },
    { id: '4', tip: 'Connect your calendar to automation tools for time-based triggers', emoji: '📅' },
    { id: '5', tip: 'Track time saved - it adds up faster than you think!', emoji: '⏰' }
  ];

  const handleSelectElement = (element: AutomationElement) => {
    setSelectedElements(prev => ({
      ...prev,
      [element.type]: element
    }));
  };

  const generateAutomationPlan = async () => {
    if (!selectedElements.trigger || !selectedElements.action || !selectedElements.benefit) {
      toast.error('Please select all three automation elements first!');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = `🤖 Your Automation Blueprint

Automation Name: "${selectedElements.trigger.label} → ${selectedElements.action.label}"

How It Works:
1. TRIGGER: ${selectedElements.trigger.emoji} ${selectedElements.trigger.label}
   - Type: ${selectedElements.trigger.description}
   - Example: ${selectedElements.trigger.example}

2. ACTION: ${selectedElements.action.emoji} ${selectedElements.action.label}
   - Type: ${selectedElements.action.description}
   - Example: ${selectedElements.action.example}

3. BENEFIT: ${selectedElements.benefit.emoji} ${selectedElements.benefit.label}
   - Impact: ${selectedElements.benefit.description}

Implementation Steps:
1. Choose your automation tool (Zapier, Make, or IFTTT)
2. Set up trigger: "${selectedElements.trigger.label}"
3. Configure action: "${selectedElements.action.label}"
4. Test with one example
5. Activate and monitor

Time Savings Calculation:
• Manual time per task: ~15 minutes
• Frequency: 5x per week
• Weekly savings: 75 minutes
• Monthly savings: 5 hours
• Yearly savings: 60 hours (1.5 work weeks!)

Pro Tip: This single automation gives you back ${selectedElements.benefit.label.toLowerCase()}!`;

      setAutomationPlan(plan);
      toast.success('Automation plan created!');
    } catch (error) {
      toast.error('Failed to generate automation plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPlan = () => {
    navigator.clipboard.writeText(automationPlan);
    toast.success('Automation plan copied to clipboard!');
  };

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'learn':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                The Automation Formula
              </h3>
              <p className="text-gray-700 mb-4">
                Every automation follows a simple recipe: When THIS happens → Do THAT → Get BENEFIT
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Trigger (When)</p>
                    <p className="text-sm text-gray-600">The starting point - what kicks things off</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-700">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Action (Do)</p>
                    <p className="text-sm text-gray-600">What happens automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-700">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Benefit (Get)</p>
                    <p className="text-sm text-gray-600">The time and energy you save</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Real Example:</p>
                    <p className="text-sm text-blue-700 mt-1">
                      "When volunteer signs up → Send welcome email + Add to spreadsheet + Create onboarding task"
                      <br />
                      <strong>Result:</strong> 20 minutes saved per volunteer!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold text-lg">82%</p>
                  <p className="text-xs text-gray-600">Less time on admin</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-lg">100%</p>
                  <p className="text-xs text-gray-600">Consistent follow-up</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Design Your First Automation</h3>
              <p className="text-gray-600 mt-1">Choose elements that match your daily tasks</p>
            </div>

            {/* Trigger Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">1</span>
                </div>
                When should it start? (Trigger)
              </h4>
              <div className="grid gap-2">
                {triggerOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.trigger?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-700">2</span>
                </div>
                What should happen? (Action)
              </h4>
              <div className="grid gap-2">
                {actionOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.action?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Benefit Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-700">3</span>
                </div>
                What's your goal? (Benefit)
              </h4>
              <div className="grid gap-2">
                {benefitOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.benefit?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Automation Preview */}
            {Object.keys(selectedElements).length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Your Automation:</h4>
                  <div className="space-y-1 text-sm">
                    {selectedElements.trigger && (
                      <p className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        When: {selectedElements.trigger.label} {selectedElements.trigger.emoji}
                      </p>
                    )}
                    {selectedElements.action && (
                      <p className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Then: {selectedElements.action.label} {selectedElements.action.emoji}
                      </p>
                    )}
                    {selectedElements.benefit && (
                      <p className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Result: {selectedElements.benefit.label} {selectedElements.benefit.emoji}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-6">
            {!automationPlan ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Ready to Build Your Automation!</h3>
                <p className="text-gray-600">
                  Let's create your time-saving workflow blueprint
                </p>
                
                {/* Show selected automation */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 max-w-md mx-auto">
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span>Trigger:</span>
                        <span className="font-medium">
                          {selectedElements.trigger?.label} {selectedElements.trigger?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Action:</span>
                        <span className="font-medium">
                          {selectedElements.action?.label} {selectedElements.action?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Benefit:</span>
                        <span className="font-medium">
                          {selectedElements.benefit?.label} {selectedElements.benefit?.emoji}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={generateAutomationPlan}
                  disabled={isGenerating || !selectedElements.trigger || !selectedElements.action || !selectedElements.benefit}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Building automation...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Automation Plan
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>💡 What's next:</strong> You'll get a complete blueprint with setup steps, 
                    time savings calculation, and implementation tips!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Automation Blueprint</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ready to implement
                  </Badge>
                </div>

                {/* Plan Display */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {automationPlan}
                    </pre>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={copyPlan} className="flex-1">
                    <Clock className="w-4 h-4 mr-2" />
                    Save Blueprint
                  </Button>
                  <Button 
                    onClick={() => {
                      setAutomationPlan('');
                      setSelectedElements({});
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Create Another
                  </Button>
                </div>

                {/* Time Savings Visualization */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium text-green-900 mb-2">
                      ⏰ Your Time Savings Impact
                    </h4>
                    <div className="space-y-2 text-sm text-green-800">
                      <p>Daily: 15 minutes saved ✓</p>
                      <p>Weekly: 1.25 hours back ✓✓</p>
                      <p>Monthly: 5 hours for mission work ✓✓✓</p>
                      <p className="font-bold pt-2">
                        That's 60 hours per year for what matters most!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 mb-3">Ready to implement?</p>
                  <p className="text-sm text-gray-500">
                    Popular tools: Zapier (easiest), Make (powerful), or ask your IT team about Microsoft Power Automate!
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LearningPath
      title="Automate Your First Task in 5 Minutes"
      skill="Workflow Automation Mastery"
      estimatedMinutes={5}
      objectives={objectives}
      steps={steps}
      tips={tips}
      onComplete={(data) => {
        console.log('Learning path completed:', data);
        toast.success('You\'re ready to automate and save hours every week!');
      }}
    >
      {renderStepContent(steps.find(s => !s.completed)?.id || 'learn')}
    </LearningPath>
  );
};