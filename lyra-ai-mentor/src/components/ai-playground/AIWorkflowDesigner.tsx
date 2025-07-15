import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GitBranch, Plus, Play, Zap, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '@/services/aiService';

interface AIWorkflowDesignerProps {
  character: {
    name: string;
    role: string;
  };
  onComplete: () => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'ai' | 'human' | 'automation';
  description: string;
  timeMinutes: number;
  aiPrompt?: string;
}

interface Workflow {
  name: string;
  description: string;
  steps: WorkflowStep[];
  totalTime: number;
  aiTime: number;
  humanTime: number;
}

const workflowTemplates = {
  email: {
    name: 'Email Campaign Workflow',
    steps: [
      { type: 'ai', name: 'Generate subject lines', time: 2 },
      { type: 'ai', name: 'Draft email content', time: 5 },
      { type: 'human', name: 'Review and personalize', time: 10 },
      { type: 'automation', name: 'Schedule send', time: 1 }
    ]
  },
  report: {
    name: 'Monthly Report Workflow',
    steps: [
      { type: 'human', name: 'Gather data', time: 30 },
      { type: 'ai', name: 'Analyze trends', time: 5 },
      { type: 'ai', name: 'Generate insights', time: 5 },
      { type: 'ai', name: 'Create first draft', time: 10 },
      { type: 'human', name: 'Final review', time: 15 }
    ]
  },
  social: {
    name: 'Social Media Workflow',
    steps: [
      { type: 'ai', name: 'Generate post ideas', time: 3 },
      { type: 'ai', name: 'Create content', time: 5 },
      { type: 'human', name: 'Add images/review', time: 10 },
      { type: 'automation', name: 'Schedule posts', time: 2 }
    ]
  }
};

export default function AIWorkflowDesigner({ character, onComplete }: AIWorkflowDesignerProps) {
  const [workflow, setWorkflow] = useState<Workflow>({
    name: '',
    description: '',
    steps: [],
    totalTime: 0,
    aiTime: 0,
    humanTime: 0
  });
  const [newStepName, setNewStepName] = useState('');
  const [newStepType, setNewStepType] = useState<'ai' | 'human' | 'automation'>('ai');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<string>('');

  const aiService = AIService.getInstance();

  const addStep = () => {
    if (!newStepName.trim()) return;

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: newStepName,
      type: newStepType,
      description: '',
      timeMinutes: newStepType === 'ai' ? 5 : 10
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    setNewStepName('');
    
    if (workflow.steps.length === 2) {
      onComplete();
    }
  };

  const removeStep = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const updateStepTime = (stepId: string, time: number) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, timeMinutes: time } : step
      )
    }));
  };

  const loadTemplate = (templateKey: keyof typeof workflowTemplates) => {
    const template = workflowTemplates[templateKey];
    const steps: WorkflowStep[] = template.steps.map((step, index) => ({
      id: Date.now().toString() + index,
      name: step.name,
      type: step.type,
      description: '',
      timeMinutes: step.time
    }));

    setWorkflow({
      name: template.name,
      description: `Automated workflow for ${character.role}`,
      steps,
      totalTime: 0,
      aiTime: 0,
      humanTime: 0
    });
  };

  const calculateTimes = () => {
    const totalTime = workflow.steps.reduce((sum, step) => sum + step.timeMinutes, 0);
    const aiTime = workflow.steps.filter(s => s.type === 'ai').reduce((sum, step) => sum + step.timeMinutes, 0);
    const humanTime = workflow.steps.filter(s => s.type === 'human').reduce((sum, step) => sum + step.timeMinutes, 0);
    
    return { totalTime, aiTime, humanTime };
  };

  const simulateWorkflow = async () => {
    if (workflow.steps.length === 0) return;
    
    setIsSimulating(true);
    try {
      const { totalTime, aiTime, humanTime } = calculateTimes();
      const timeSaved = Math.round((aiTime / (totalTime || 1)) * 100);
      
      const response = await aiService.generateResponse({
        prompt: `Analyze this workflow for a ${character.role}:
        
Workflow: ${workflow.name || 'Custom Workflow'}
Steps: ${workflow.steps.map(s => `${s.name} (${s.type})`).join(', ')}
Total time: ${totalTime} minutes
AI automated time: ${aiTime} minutes
Human time: ${humanTime} minutes

Provide a brief analysis of efficiency gains and recommendations for ${character.name}.`,
        context: 'You are a workflow optimization expert.',
        temperature: 0.7
      });

      setSimulationResults(response.content);
    } catch (error) {
      console.error('Error simulating workflow:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'ai': return '🤖';
      case 'human': return '👤';
      case 'automation': return '⚡';
      default: return '📋';
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'ai': return 'bg-blue-100 border-blue-300';
      case 'human': return 'bg-green-100 border-green-300';
      case 'automation': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const times = calculateTimes();

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-indigo-200 bg-indigo-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-900">
            <GitBranch className="h-5 w-5 mr-2" />
            Design AI-Powered Workflows
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Create efficient workflows that combine AI, human input, and automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-indigo-800">
            Map out your processes and discover where AI can save you time. Build workflows 
            that leverage AI for repetitive tasks while keeping human creativity where it matters.
          </p>
        </CardContent>
      </Card>

      {/* Templates */}
      <div>
        <Label>Start with a template</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {Object.entries(workflowTemplates).map(([key, template]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => loadTemplate(key as keyof typeof workflowTemplates)}
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Workflow Builder */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              placeholder="Workflow Name"
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
              className="font-semibold text-lg"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Steps */}
          <div className="space-y-2">
            <AnimatePresence>
              {workflow.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${getStepColor(step.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStepIcon(step.type)}</span>
                      <div>
                        <p className="font-medium">{step.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {step.type}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            <Input
                              type="number"
                              value={step.timeMinutes}
                              onChange={(e) => updateStepTime(step.id, parseInt(e.target.value) || 0)}
                              className="w-16 h-6 text-xs"
                            />
                            <span className="ml-1">min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {workflow.steps.length > 0 && workflow.steps.length < workflow.steps.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>

          {/* Add Step */}
          <div className="flex space-x-2">
            <Input
              placeholder="Step name"
              value={newStepName}
              onChange={(e) => setNewStepName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addStep()}
            />
            <select
              value={newStepType}
              onChange={(e) => setNewStepType(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="ai">AI Task</option>
              <option value="human">Human Task</option>
              <option value="automation">Automation</option>
            </select>
            <Button onClick={addStep}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Time Summary */}
          {workflow.steps.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="text-2xl font-bold">{times.totalTime} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AI Time</p>
                    <p className="text-2xl font-bold text-blue-600">{times.aiTime} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Saved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((times.aiTime / (times.totalTime || 1)) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simulate Button */}
          {workflow.steps.length > 0 && (
            <Button 
              onClick={simulateWorkflow}
              disabled={isSimulating}
              className="w-full"
            >
              {isSimulating ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Simulate Workflow
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Simulation Results */}
      <AnimatePresence>
        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="border-green-200 bg-green-50">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Workflow Analysis:</strong>
                <p className="mt-2 whitespace-pre-wrap">{simulationResults}</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}