import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Workflow, 
  Play, 
  Pause, 
  Settings, 
  RefreshCw, 
  Save,
  Download,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Timer
} from 'lucide-react';

interface AutomationStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  title: string;
  description: string;
  config: Record<string, any>;
  order: number;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface Automation {
  id: string;
  name: string;
  description: string;
  category: 'data_collection' | 'reporting' | 'communication' | 'workflow';
  steps: AutomationStep[];
  isActive: boolean;
  lastRun?: Date;
  runCount: number;
  successRate: number;
  created: Date;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Omit<AutomationStep, 'id' | 'status'>[];
  useCase: string;
}

const RachelAutomationBuilder: React.FC = () => {
  const [currentAutomation, setCurrentAutomation] = useState<Automation | null>(null);
  const [savedAutomations, setSavedAutomations] = useState<Automation[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);

  const automationTemplates: AutomationTemplate[] = [
    {
      id: 'weekly-report',
      name: 'Weekly Impact Report',
      description: 'Automatically generate and send weekly program impact reports',
      category: 'reporting',
      useCase: 'Save 3 hours weekly on manual report generation',
      steps: [
        {
          type: 'trigger',
          title: 'Weekly Schedule',
          description: 'Every Friday at 9 AM',
          config: { schedule: 'weekly', day: 'friday', time: '09:00' },
          order: 0
        },
        {
          type: 'action',
          title: 'Collect Program Data',
          description: 'Gather participation and outcome metrics',
          config: { dataSource: 'program_database', metrics: ['participation', 'completion', 'satisfaction'] },
          order: 1
        },
        {
          type: 'action',
          title: 'Generate Report',
          description: 'Create formatted impact summary',
          config: { template: 'weekly_impact', format: 'pdf' },
          order: 2
        },
        {
          type: 'action',
          title: 'Send to Stakeholders',
          description: 'Email report to board and staff',
          config: { recipients: ['board@nonprofit.org', 'staff@nonprofit.org'], subject: 'Weekly Impact Report' },
          order: 3
        }
      ]
    },
    {
      id: 'donor-followup',
      name: 'Donor Follow-up Sequence',
      description: 'Automated thank you and engagement sequence for new donors',
      category: 'communication',
      useCase: 'Improve donor retention with timely, personalized follow-up',
      steps: [
        {
          type: 'trigger',
          title: 'New Donation Received',
          description: 'When donation amount > $25',
          config: { event: 'donation_received', minAmount: 25 },
          order: 0
        },
        {
          type: 'action',
          title: 'Send Thank You Email',
          description: 'Immediate personalized thank you',
          config: { template: 'donation_thanks', personalization: true },
          order: 1
        },
        {
          type: 'delay',
          title: 'Wait 7 Days',
          description: 'Allow time for initial appreciation',
          config: { duration: 7, unit: 'days' },
          order: 2
        },
        {
          type: 'action',
          title: 'Share Impact Story',
          description: 'Send story showing donation impact',
          config: { template: 'impact_story', personalize_amount: true },
          order: 3
        },
        {
          type: 'delay',
          title: 'Wait 30 Days',
          description: 'Monthly engagement cadence',
          config: { duration: 30, unit: 'days' },
          order: 4
        },
        {
          type: 'action',
          title: 'Monthly Update',
          description: 'Program updates and volunteer opportunities',
          config: { template: 'monthly_update', include_volunteer_ops: true },
          order: 5
        }
      ]
    },
    {
      id: 'volunteer-onboarding',
      name: 'Volunteer Onboarding Flow',
      description: 'Streamlined process for new volunteer registration and training',
      category: 'workflow',
      useCase: 'Reduce volunteer coordinator workload by 60%',
      steps: [
        {
          type: 'trigger',
          title: 'Volunteer Application Submitted',
          description: 'New volunteer completes online application',
          config: { event: 'application_submitted', form: 'volunteer_registration' },
          order: 0
        },
        {
          type: 'condition',
          title: 'Check Background Clear',
          description: 'Verify background check completion',
          config: { field: 'background_check_status', value: 'approved' },
          order: 1
        },
        {
          type: 'action',
          title: 'Send Welcome Package',
          description: 'Email with handbook and next steps',
          config: { template: 'volunteer_welcome', attachments: ['handbook.pdf', 'schedule.pdf'] },
          order: 2
        },
        {
          type: 'action',
          title: 'Schedule Orientation',
          description: 'Book orientation session slot',
          config: { calendar: 'volunteer_orientation', duration: 90 },
          order: 3
        },
        {
          type: 'action',
          title: 'Add to Communication List',
          description: 'Subscribe to volunteer newsletter',
          config: { list: 'volunteer_newsletter', segments: ['new_volunteers'] },
          order: 4
        }
      ]
    }
  ];

  const stepTypes = [
    { 
      id: 'trigger', 
      label: 'Trigger', 
      description: 'What starts the automation',
      color: 'bg-blue-100 text-blue-800',
      icon: Play
    },
    { 
      id: 'condition', 
      label: 'Condition', 
      description: 'Check if criteria are met',
      color: 'bg-yellow-100 text-yellow-800',
      icon: AlertTriangle
    },
    { 
      id: 'action', 
      label: 'Action', 
      description: 'Perform a task',
      color: 'bg-green-100 text-green-800',
      icon: Zap
    },
    { 
      id: 'delay', 
      label: 'Delay', 
      description: 'Wait for specified time',
      color: 'bg-purple-100 text-purple-800',
      icon: Timer
    }
  ];

  const createFromTemplate = (template: AutomationTemplate) => {
    const newAutomation: Automation = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      category: template.category as any,
      steps: template.steps.map((step, index) => ({
        ...step,
        id: `step-${index}`,
        status: 'pending' as const
      })),
      isActive: false,
      runCount: 0,
      successRate: 100,
      created: new Date()
    };
    
    setCurrentAutomation(newAutomation);
  };

  const runAutomation = async () => {
    if (!currentAutomation) return;
    
    setIsRunning(true);
    setRunProgress(0);
    
    // Simulate running each step
    for (let i = 0; i < currentAutomation.steps.length; i++) {
      const step = currentAutomation.steps[i];
      
      // Update step status to running
      const updatedSteps = [...currentAutomation.steps];
      updatedSteps[i] = { ...step, status: 'running' };
      setCurrentAutomation({ ...currentAutomation, steps: updatedSteps });
      
      // Simulate step execution time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update step status to completed
      updatedSteps[i] = { ...step, status: 'completed' };
      setCurrentAutomation({ ...currentAutomation, steps: updatedSteps });
      
      // Update progress
      setRunProgress(((i + 1) / currentAutomation.steps.length) * 100);
    }
    
    // Update automation run statistics
    const updatedAutomation = {
      ...currentAutomation,
      lastRun: new Date(),
      runCount: currentAutomation.runCount + 1,
      isActive: true
    };
    
    setCurrentAutomation(updatedAutomation);
    setIsRunning(false);
  };

  const saveAutomation = () => {
    if (currentAutomation) {
      setSavedAutomations(prev => {
        const existing = prev.find(a => a.id === currentAutomation.id);
        if (existing) {
          return prev.map(a => a.id === currentAutomation.id ? currentAutomation : a);
        }
        return [currentAutomation, ...prev.slice(0, 4)];
      });
    }
  };

  const addStep = (type: string) => {
    if (!currentAutomation) return;
    
    const newStep: AutomationStep = {
      id: `step-${Date.now()}`,
      type: type as any,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: 'Configure this step',
      config: {},
      order: currentAutomation.steps.length,
      status: 'pending'
    };
    
    setCurrentAutomation({
      ...currentAutomation,
      steps: [...currentAutomation.steps, newStep]
    });
  };

  const removeStep = (stepId: string) => {
    if (!currentAutomation) return;
    
    setCurrentAutomation({
      ...currentAutomation,
      steps: currentAutomation.steps.filter(step => step.id !== stepId)
    });
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(t => t.id === type);
    return stepType ? stepType.icon : Zap;
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(t => t.id === type);
    return stepType ? stepType.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'running': return RefreshCw;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Workflow className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Rachel's Automation Builder</CardTitle>
              <CardDescription>
                Design and deploy intelligent workflows to automate nonprofit operations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentAutomation ? (
            /* Template Selection */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choose a Template</CardTitle>
                  <CardDescription>Start with proven automation patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {automationTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => createFromTemplate(template)}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline">{template.steps.length} steps</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800" variant="secondary">
                          {template.category.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-green-600 font-medium">{template.useCase}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Automation</CardTitle>
                  <CardDescription>Build from scratch</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setCurrentAutomation({
                      id: Date.now().toString(),
                      name: 'New Automation',
                      description: 'Custom workflow',
                      category: 'workflow',
                      steps: [],
                      isActive: false,
                      runCount: 0,
                      successRate: 100,
                      created: new Date()
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Custom Automation
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Automation Builder */
            <div className="space-y-6">
              {/* Automation Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Input
                        value={currentAutomation.name}
                        onChange={(e) => setCurrentAutomation({
                          ...currentAutomation,
                          name: e.target.value
                        })}
                        className="text-lg font-semibold border-none p-0 focus:ring-0"
                      />
                      <Textarea
                        value={currentAutomation.description}
                        onChange={(e) => setCurrentAutomation({
                          ...currentAutomation,
                          description: e.target.value
                        })}
                        className="text-sm border-none p-0 focus:ring-0 resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setCurrentAutomation(null)}>
                        Back
                      </Button>
                      <Button size="sm" variant="outline" onClick={saveAutomation}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={runAutomation}
                        disabled={isRunning || currentAutomation.steps.length === 0}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isRunning ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-1" />
                        )}
                        {isRunning ? 'Running...' : 'Test Run'}
                      </Button>
                    </div>
                  </div>
                  {isRunning && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Automation Progress</span>
                        <span>{Math.round(runProgress)}%</span>
                      </div>
                      <Progress value={runProgress} className="h-2" />
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Step Builder */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Step Types Palette */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Steps</CardTitle>
                    <CardDescription>Drag or click to add</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stepTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant="outline"
                          className="w-full justify-start h-auto p-3"
                          onClick={() => addStep(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-600">{type.description}</div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Workflow Canvas */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Workflow Steps</CardTitle>
                      <CardDescription>
                        {currentAutomation.steps.length} steps • Configure each step below
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentAutomation.steps.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Workflow className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Steps Yet</h3>
                          <p>Add steps from the palette to build your automation</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentAutomation.steps.map((step, index) => {
                            const Icon = getStepIcon(step.type);
                            const StatusIcon = getStatusIcon(step.status);
                            
                            return (
                              <div key={step.id} className="relative">
                                <div className="flex items-center gap-4 p-4 border rounded-lg">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(step.type)}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Input
                                        value={step.title}
                                        onChange={(e) => {
                                          const updatedSteps = [...currentAutomation.steps];
                                          updatedSteps[index] = { ...step, title: e.target.value };
                                          setCurrentAutomation({ ...currentAutomation, steps: updatedSteps });
                                        }}
                                        className="font-medium border-none p-0 focus:ring-0"
                                      />
                                      <Badge className={getStepColor(step.type)} variant="secondary">
                                        {step.type}
                                      </Badge>
                                    </div>
                                    <Input
                                      value={step.description}
                                      onChange={(e) => {
                                        const updatedSteps = [...currentAutomation.steps];
                                        updatedSteps[index] = { ...step, description: e.target.value };
                                        setCurrentAutomation({ ...currentAutomation, steps: updatedSteps });
                                      }}
                                      placeholder="Step description..."
                                      className="text-sm border-none p-0 focus:ring-0"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-5 h-5 ${getStatusColor(step.status)} ${
                                      step.status === 'running' ? 'animate-spin' : ''
                                    }`} />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeStep(step.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {index < currentAutomation.steps.length - 1 && (
                                  <div className="flex justify-center my-2">
                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Saved Automations */}
          {savedAutomations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Automations</CardTitle>
                <CardDescription>Your workflow library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAutomations.map((automation) => (
                    <Card key={automation.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{automation.name}</h4>
                          <Badge 
                            className={automation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            variant="secondary"
                          >
                            {automation.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{automation.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{automation.steps.length} steps</span>
                          <span>Run {automation.runCount} times</span>
                          <span>{automation.successRate}% success</span>
                        </div>
                        {automation.lastRun && (
                          <div className="text-xs text-gray-500 mt-1">
                            Last run: {automation.lastRun.toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Automation Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Automation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Best Practices:</h4>
                  <ul className="space-y-1">
                    <li>• Start simple - automate one process at a time</li>
                    <li>• Test thoroughly before going live</li>
                    <li>• Include error handling and fallbacks</li>
                    <li>• Monitor performance and adjust as needed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Automation Ideas:</h4>
                  <ul className="space-y-1">
                    <li>• Weekly program reports</li>
                    <li>• New donor welcome sequences</li>
                    <li>• Volunteer scheduling reminders</li>
                    <li>• Event registration follow-ups</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RachelAutomationBuilder;