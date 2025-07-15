import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Share,
  Play,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Diamond,
  Circle,
  Square
} from 'lucide-react';

interface ProcessStep {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'delay';
  title: string;
  description: string;
  assignee: string;
  timeMinutes: number;
  cost: number;
  dependencies: string[];
  outputs: string[];
  painPoints: string[];
  x: number;
  y: number;
}

interface ProcessFlow {
  id: string;
  name: string;
  description: string;
  category: 'operations' | 'hr' | 'finance' | 'programs';
  steps: ProcessStep[];
  totalTime: number;
  totalCost: number;
  complexity: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

interface Connection {
  from: string;
  to: string;
  condition?: string;
}

const RachelProcessMapper: React.FC = () => {
  const [currentFlow, setCurrentFlow] = useState<ProcessFlow | null>(null);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlows, setSavedFlows] = useState<ProcessFlow[]>([]);

  const processTemplates = [
    {
      id: 'volunteer-onboarding',
      name: 'Volunteer Onboarding Process',
      description: 'Complete workflow for bringing new volunteers into the organization',
      category: 'hr' as const,
      steps: [
        {
          type: 'start' as const,
          title: 'Application Received',
          description: 'Volunteer submits application through website',
          assignee: 'System',
          timeMinutes: 0,
          cost: 0,
          x: 100,
          y: 50
        },
        {
          type: 'process' as const,
          title: 'Application Review',
          description: 'HR reviews application for completeness and fit',
          assignee: 'HR Coordinator',
          timeMinutes: 15,
          cost: 12.5,
          x: 100,
          y: 150
        },
        {
          type: 'decision' as const,
          title: 'Background Check Required?',
          description: 'Determine if role requires background check',
          assignee: 'HR Coordinator',
          timeMinutes: 5,
          cost: 4.17,
          x: 100,
          y: 250
        },
        {
          type: 'process' as const,
          title: 'Background Check',
          description: 'Initiate and process background check',
          assignee: 'HR Coordinator',
          timeMinutes: 60,
          cost: 75,
          x: 250,
          y: 350
        },
        {
          type: 'process' as const,
          title: 'Interview Scheduling',
          description: 'Schedule and conduct volunteer interview',
          assignee: 'Program Manager',
          timeMinutes: 45,
          cost: 45,
          x: 100,
          y: 450
        },
        {
          type: 'process' as const,
          title: 'Orientation Session',
          description: 'Conduct volunteer orientation and training',
          assignee: 'Program Manager',
          timeMinutes: 120,
          cost: 120,
          x: 100,
          y: 550
        },
        {
          type: 'end' as const,
          title: 'Volunteer Active',
          description: 'Volunteer is ready to begin assignments',
          assignee: 'System',
          timeMinutes: 0,
          cost: 0,
          x: 100,
          y: 650
        }
      ]
    },
    {
      id: 'grant-application',
      name: 'Grant Application Process',
      description: 'Process for researching, writing, and submitting grant applications',
      category: 'finance' as const,
      steps: [
        {
          type: 'start' as const,
          title: 'Grant Opportunity Identified',
          description: 'New grant opportunity matching our mission',
          assignee: 'Development Team',
          timeMinutes: 0,
          cost: 0,
          x: 100,
          y: 50
        },
        {
          type: 'process' as const,
          title: 'Eligibility Research',
          description: 'Review requirements and assess fit',
          assignee: 'Grants Manager',
          timeMinutes: 60,
          cost: 60,
          x: 100,
          y: 150
        },
        {
          type: 'decision' as const,
          title: 'Pursue Application?',
          description: 'Decision to proceed based on fit and capacity',
          assignee: 'Executive Director',
          timeMinutes: 30,
          cost: 50,
          x: 100,
          y: 250
        },
        {
          type: 'process' as const,
          title: 'Proposal Writing',
          description: 'Draft comprehensive grant proposal',
          assignee: 'Grants Manager',
          timeMinutes: 480,
          cost: 480,
          x: 100,
          y: 350
        },
        {
          type: 'process' as const,
          title: 'Internal Review',
          description: 'Review by ED and program managers',
          assignee: 'Leadership Team',
          timeMinutes: 120,
          cost: 180,
          x: 100,
          y: 450
        },
        {
          type: 'process' as const,
          title: 'Submission',
          description: 'Final submission through grant portal',
          assignee: 'Grants Manager',
          timeMinutes: 30,
          cost: 30,
          x: 100,
          y: 550
        },
        {
          type: 'end' as const,
          title: 'Application Submitted',
          description: 'Grant application successfully submitted',
          assignee: 'System',
          timeMinutes: 0,
          cost: 0,
          x: 100,
          y: 650
        }
      ]
    }
  ];

  const stepTypes = [
    { 
      id: 'start', 
      label: 'Start', 
      icon: Circle,
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Process beginning'
    },
    { 
      id: 'process', 
      label: 'Process', 
      icon: Square,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Action or task'
    },
    { 
      id: 'decision', 
      label: 'Decision', 
      icon: Diamond,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Decision point'
    },
    { 
      id: 'delay', 
      label: 'Delay', 
      icon: Clock,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Waiting period'
    },
    { 
      id: 'end', 
      label: 'End', 
      icon: Circle,
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Process completion'
    }
  ];

  const createFromTemplate = (template: any) => {
    const steps: ProcessStep[] = template.steps.map((step: any, index: number) => ({
      id: `step-${index}`,
      ...step,
      dependencies: index > 0 ? [`step-${index - 1}`] : [],
      outputs: index < template.steps.length - 1 ? [`step-${index + 1}`] : [],
      painPoints: []
    }));

    const totalTime = steps.reduce((sum, step) => sum + step.timeMinutes, 0);
    const totalCost = steps.reduce((sum, step) => sum + step.cost, 0);

    const newFlow: ProcessFlow = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      category: template.category,
      steps,
      totalTime,
      totalCost,
      complexity: totalTime > 300 ? 'high' : totalTime > 120 ? 'medium' : 'low',
      lastUpdated: new Date()
    };

    setCurrentFlow(newFlow);
  };

  const addStep = (type: string, afterStepId?: string) => {
    if (!currentFlow) return;

    const newStep: ProcessStep = {
      id: `step-${Date.now()}`,
      type: type as any,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: 'Click to edit description',
      assignee: 'Unassigned',
      timeMinutes: 15,
      cost: 15,
      dependencies: [],
      outputs: [],
      painPoints: [],
      x: 100,
      y: currentFlow.steps.length * 100 + 50
    };

    const updatedSteps = [...currentFlow.steps, newStep];
    const totalTime = updatedSteps.reduce((sum, step) => sum + step.timeMinutes, 0);
    const totalCost = updatedSteps.reduce((sum, step) => sum + step.cost, 0);

    setCurrentFlow({
      ...currentFlow,
      steps: updatedSteps,
      totalTime,
      totalCost,
      complexity: totalTime > 300 ? 'high' : totalTime > 120 ? 'medium' : 'low'
    });
  };

  const updateStep = (stepId: string, updates: Partial<ProcessStep>) => {
    if (!currentFlow) return;

    const updatedSteps = currentFlow.steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );

    const totalTime = updatedSteps.reduce((sum, step) => sum + step.timeMinutes, 0);
    const totalCost = updatedSteps.reduce((sum, step) => sum + step.cost, 0);

    setCurrentFlow({
      ...currentFlow,
      steps: updatedSteps,
      totalTime,
      totalCost,
      complexity: totalTime > 300 ? 'high' : totalTime > 120 ? 'medium' : 'low'
    });
  };

  const deleteStep = (stepId: string) => {
    if (!currentFlow) return;

    const updatedSteps = currentFlow.steps.filter(step => step.id !== stepId);
    const totalTime = updatedSteps.reduce((sum, step) => sum + step.timeMinutes, 0);
    const totalCost = updatedSteps.reduce((sum, step) => sum + step.cost, 0);

    setCurrentFlow({
      ...currentFlow,
      steps: updatedSteps,
      totalTime,
      totalCost,
      complexity: totalTime > 300 ? 'high' : totalTime > 120 ? 'medium' : 'low'
    });
  };

  const saveFlow = () => {
    if (currentFlow) {
      setSavedFlows(prev => {
        const existing = prev.find(f => f.id === currentFlow.id);
        if (existing) {
          return prev.map(f => f.id === currentFlow.id ? currentFlow : f);
        }
        return [currentFlow, ...prev.slice(0, 4)];
      });
    }
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(t => t.id === type);
    return stepType ? stepType.icon : Square;
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(t => t.id === type);
    return stepType ? stepType.color : 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operations': return 'text-blue-600 bg-blue-100';
      case 'hr': return 'text-green-600 bg-green-100';
      case 'finance': return 'text-purple-600 bg-purple-100';
      case 'programs': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(0)}`;
  };

  const exportFlow = () => {
    if (!currentFlow) return;
    
    const flowData = {
      ...currentFlow,
      exported: new Date().toISOString()
    };
    
    navigator.clipboard.writeText(JSON.stringify(flowData, null, 2));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Rachel's Process Mapper</CardTitle>
              <CardDescription>
                Visualize and document organizational processes for analysis and improvement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentFlow ? (
            /* Template Selection */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Process Templates</CardTitle>
                  <CardDescription>Start with common nonprofit processes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {processTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => createFromTemplate(template)}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{template.name}</h4>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(template.category)} variant="secondary">
                            {template.category}
                          </Badge>
                          <Badge variant="outline">
                            {template.steps.length} steps
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{formatTime(template.steps.reduce((sum: number, step: any) => sum + step.timeMinutes, 0))}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{new Set(template.steps.map((step: any) => step.assignee)).size} roles</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Custom Process</CardTitle>
                  <CardDescription>Build a process map from scratch</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setCurrentFlow({
                      id: Date.now().toString(),
                      name: 'New Process',
                      description: 'Custom process workflow',
                      category: 'operations',
                      steps: [],
                      totalTime: 0,
                      totalCost: 0,
                      complexity: 'low',
                      lastUpdated: new Date()
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Custom Process
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Process Builder */
            <div className="space-y-6">
              {/* Process Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Input
                        value={currentFlow.name}
                        onChange={(e) => setCurrentFlow({
                          ...currentFlow,
                          name: e.target.value
                        })}
                        className="text-lg font-semibold border-none p-0 focus:ring-0"
                      />
                      <Textarea
                        value={currentFlow.description}
                        onChange={(e) => setCurrentFlow({
                          ...currentFlow,
                          description: e.target.value
                        })}
                        className="text-sm border-none p-0 focus:ring-0 resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setCurrentFlow(null)}>
                        Back
                      </Button>
                      <Button size="sm" variant="outline" onClick={saveFlow}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={exportFlow}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{currentFlow.steps.length}</div>
                      <div className="text-sm text-blue-600">Steps</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{formatTime(currentFlow.totalTime)}</div>
                      <div className="text-sm text-green-600">Total Time</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">{formatCost(currentFlow.totalCost)}</div>
                      <div className="text-sm text-purple-600">Estimated Cost</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <Badge className={getComplexityColor(currentFlow.complexity)} variant="secondary">
                        {currentFlow.complexity} complexity
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process Flow Builder */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Step Types Palette */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Steps</CardTitle>
                    <CardDescription>Click to add process elements</CardDescription>
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
                            <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${type.color}`}>
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

                {/* Process Flow Canvas */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Process Flow</CardTitle>
                      <CardDescription>
                        {currentFlow.steps.length} steps • Click steps to edit details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentFlow.steps.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Steps Yet</h3>
                          <p>Add steps from the palette to build your process flow</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentFlow.steps.map((step, index) => {
                            const Icon = getStepIcon(step.type);
                            
                            return (
                              <div key={step.id} className="relative">
                                <div 
                                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedStep?.id === step.id 
                                      ? 'border-purple-300 bg-purple-50' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedStep(step)}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded border-2 flex items-center justify-center ${getStepColor(step.type)}`}>
                                      <Icon className="w-6 h-6" />
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{step.title}</h4>
                                        <Badge className={getStepColor(step.type)} variant="secondary">
                                          {step.type}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                                      <div className="flex gap-4 text-xs text-gray-500">
                                        <span>👤 {step.assignee}</span>
                                        <span>⏱️ {formatTime(step.timeMinutes)}</span>
                                        <span>💰 {formatCost(step.cost)}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedStep(step);
                                          setIsEditing(true);
                                        }}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteStep(step.id);
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {step.painPoints.length > 0 && (
                                    <div className="mt-3 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                      <span className="text-xs text-yellow-600">
                                        {step.painPoints.length} pain point(s) identified
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {index < currentFlow.steps.length - 1 && (
                                  <div className="flex justify-center my-2">
                                    <ArrowDown className="w-5 h-5 text-gray-400" />
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

              {/* Step Details Editor */}
              {selectedStep && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">
                      Edit Step: {selectedStep.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title:</label>
                          <Input
                            value={selectedStep.title}
                            onChange={(e) => updateStep(selectedStep.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description:</label>
                          <Textarea
                            value={selectedStep.description}
                            onChange={(e) => updateStep(selectedStep.id, { description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Assignee:</label>
                          <Input
                            value={selectedStep.assignee}
                            onChange={(e) => updateStep(selectedStep.id, { assignee: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Time (minutes):</label>
                            <Input
                              type="number"
                              value={selectedStep.timeMinutes}
                              onChange={(e) => updateStep(selectedStep.id, { timeMinutes: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Cost ($):</label>
                            <Input
                              type="number"
                              value={selectedStep.cost}
                              onChange={(e) => updateStep(selectedStep.id, { cost: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Pain Points:</label>
                          <Textarea
                            placeholder="List pain points, one per line..."
                            value={selectedStep.painPoints.join('\n')}
                            onChange={(e) => updateStep(selectedStep.id, { 
                              painPoints: e.target.value.split('\n').filter(p => p.trim()) 
                            })}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Saved Processes */}
          {savedFlows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Process Maps</CardTitle>
                <CardDescription>Your process documentation library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedFlows.map((flow) => (
                    <Card key={flow.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{flow.name}</h4>
                          <Badge className={getCategoryColor(flow.category)} variant="secondary">
                            {flow.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{flow.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                          <div>{flow.steps.length} steps</div>
                          <div>{formatTime(flow.totalTime)}</div>
                          <div>{formatCost(flow.totalCost)}</div>
                        </div>
                        <div className="mt-2">
                          <Badge className={getComplexityColor(flow.complexity)} variant="secondary">
                            {flow.complexity} complexity
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Process Mapping Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Process Mapping Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Mapping:</h4>
                  <ul className="space-y-1">
                    <li>• Start with current state, not ideal state</li>
                    <li>• Include all stakeholders in the mapping process</li>
                    <li>• Document pain points and inefficiencies</li>
                    <li>• Use consistent symbols and notation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Process Improvement:</h4>
                  <ul className="space-y-1">
                    <li>• Look for bottlenecks and delays</li>
                    <li>• Identify redundant or unnecessary steps</li>
                    <li>• Consider automation opportunities</li>
                    <li>• Measure before and after changes</li>
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

export default RachelProcessMapper;