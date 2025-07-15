import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cog, 
  Users, 
  Zap, 
  GitBranch,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  AlertCircle,
  Sparkles,
  Bot,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkflowStep {
  id: string;
  type: 'human' | 'ai' | 'hybrid';
  task: string;
  time: number;
  automatable: boolean;
  enhancement?: string;
}

interface WorkflowScenario {
  id: string;
  title: string;
  description: string;
  currentProcess: WorkflowStep[];
  painPoints: string[];
  goals: string[];
}

const scenarios: WorkflowScenario[] = [
  {
    id: 'volunteer-onboarding',
    title: 'Volunteer Onboarding Process',
    description: 'Streamline how new volunteers join and get started with your organization.',
    currentProcess: [
      { id: '1', type: 'human', task: 'Receive volunteer application', time: 5, automatable: true },
      { id: '2', type: 'human', task: 'Review application manually', time: 15, automatable: false },
      { id: '3', type: 'human', task: 'Send welcome email', time: 10, automatable: true },
      { id: '4', type: 'human', task: 'Schedule orientation call', time: 20, automatable: true },
      { id: '5', type: 'human', task: 'Conduct orientation', time: 60, automatable: false },
      { id: '6', type: 'human', task: 'Assign first task', time: 15, automatable: false }
    ],
    painPoints: [
      'Takes 2-3 days to respond to new volunteers',
      'Welcome emails are generic and impersonal',
      'Scheduling orientation is time-consuming',
      'Many volunteers drop off before orientation'
    ],
    goals: [
      'Respond to volunteers within 24 hours',
      'Personalize the onboarding experience',
      'Reduce staff time by 50%',
      'Increase volunteer retention by 30%'
    ]
  },
  {
    id: 'donor-acknowledgment',
    title: 'Donor Thank You Process',
    description: 'Enhance how you acknowledge and engage donors after contributions.',
    currentProcess: [
      { id: '1', type: 'human', task: 'Receive donation notification', time: 5, automatable: true },
      { id: '2', type: 'human', task: 'Log donation in spreadsheet', time: 10, automatable: true },
      { id: '3', type: 'human', task: 'Write personalized thank you', time: 20, automatable: false },
      { id: '4', type: 'human', task: 'Generate tax receipt', time: 15, automatable: true },
      { id: '5', type: 'human', task: 'Mail thank you and receipt', time: 10, automatable: true },
      { id: '6', type: 'human', task: 'Update donor database', time: 10, automatable: true }
    ],
    painPoints: [
      'Thank you notes often delayed by 1-2 weeks',
      'Difficult to personalize at scale',
      'Manual data entry is error-prone',
      'No consistent follow-up process'
    ],
    goals: [
      'Thank donors within 48 hours',
      'Maintain personal touch at scale',
      'Eliminate manual data entry',
      'Create automated follow-up sequence'
    ]
  }
];

interface EnhancedStep extends WorkflowStep {
  aiEnhancement?: {
    tool: string;
    description: string;
    timeReduction: number;
  };
}

const RachelAutomationBuilder: React.FC<{ onComplete?: (score: number) => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'analyze' | 'design' | 'enhance' | 'complete'>('intro');
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [enhancedWorkflow, setEnhancedWorkflow] = useState<EnhancedStep[]>([]);
  const [teamAlignment, setTeamAlignment] = useState(0);
  const [selectedEnhancements, setSelectedEnhancements] = useState<Set<string>>(new Set());

  const scenario = scenarios[selectedScenario];

  const analyzeWorkflow = () => {
    // Calculate current process metrics
    const totalTime = scenario.currentProcess.reduce((sum, step) => sum + step.time, 0);
    const automatableTime = scenario.currentProcess
      .filter(step => step.automatable)
      .reduce((sum, step) => sum + step.time, 0);
    
    return {
      totalTime,
      automatableTime,
      efficiency: Math.round((automatableTime / totalTime) * 100),
      bottlenecks: scenario.currentProcess.filter(step => step.time > 15).length
    };
  };

  const enhanceWithAI = (stepId: string) => {
    const enhancements: Record<string, any> = {
      '1': {
        tool: 'Form Automation',
        description: 'Auto-capture and validate volunteer data',
        timeReduction: 4
      },
      '3': {
        tool: 'AI Email Assistant',
        description: 'Generate personalized welcome emails',
        timeReduction: 8
      },
      '4': {
        tool: 'Smart Scheduling',
        description: 'AI calendar integration for orientation',
        timeReduction: 15
      }
    };

    if (enhancements[stepId]) {
      setSelectedEnhancements(prev => new Set([...prev, stepId]));
    }
  };

  const buildEnhancedWorkflow = () => {
    const enhanced: EnhancedStep[] = scenario.currentProcess.map(step => {
      if (selectedEnhancements.has(step.id)) {
        const aiEnhancement = {
          tool: 'AI Assistant',
          description: `Automate ${step.task.toLowerCase()}`,
          timeReduction: Math.floor(step.time * 0.7)
        };
        
        return {
          ...step,
          type: 'hybrid' as const,
          time: step.time - aiEnhancement.timeReduction,
          aiEnhancement
        };
      }
      return step;
    });
    
    setEnhancedWorkflow(enhanced);
    setTeamAlignment(calculateTeamAlignment(enhanced));
  };

  const calculateTeamAlignment = (workflow: EnhancedStep[]) => {
    let score = 50; // Base score
    
    // Points for maintaining human touchpoints
    const humanSteps = workflow.filter(step => step.type === 'human').length;
    score += humanSteps * 10;
    
    // Points for efficiency improvements
    const timeReduction = workflow.reduce((sum, step) => 
      sum + (step.aiEnhancement?.timeReduction || 0), 0
    );
    score += Math.min(timeReduction, 30);
    
    // Points for hybrid approach
    const hybridSteps = workflow.filter(step => step.type === 'hybrid').length;
    score += hybridSteps * 5;
    
    return Math.min(score, 100);
  };

  const metrics = analyzeWorkflow();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                    <Cog className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Rachel's Automation Designer</CardTitle>
                    <CardDescription>Build AI workflows that enhance human work</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What You'll Design:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Human-centered AI workflows that enhance, not replace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Process improvements that save time and increase impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Team alignment strategies for AI adoption</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map((s, index) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedScenario(index)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedScenario === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <h4 className="font-semibold mb-1">{s.title}</h4>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setPhase('analyze')} 
                  size="lg" 
                  className="w-full"
                >
                  Analyze Current Process
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'analyze' && (
          <motion.div
            key="analyze"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Current Process Analysis</CardTitle>
                <CardDescription>{scenario.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{metrics.totalTime}min</p>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{metrics.efficiency}%</p>
                    <p className="text-xs text-muted-foreground">Automatable</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{metrics.bottlenecks}</p>
                    <p className="text-xs text-muted-foreground">Bottlenecks</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-muted-foreground">Manual Work</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Current Workflow Steps:</h4>
                  {scenario.currentProcess.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className={`p-2 rounded ${
                        step.automatable ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {step.automatable ? <Bot className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{step.task}</p>
                        <p className="text-xs text-muted-foreground">{step.time} minutes</p>
                      </div>
                      {step.automatable && (
                        <Badge variant="outline" className="text-xs">
                          Automatable
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">Pain Points:</h4>
                  <ul className="space-y-2">
                    {scenario.painPoints.map((pain, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => setPhase('design')}
                  size="lg"
                  className="w-full"
                >
                  Design AI-Enhanced Workflow
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'design' && (
          <motion.div
            key="design"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Design Your AI-Enhanced Workflow</CardTitle>
                <CardDescription>Select which steps to enhance with AI while maintaining human connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-teal-200 bg-teal-50">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <AlertDescription>
                    <strong>Design Principle:</strong> AI should handle repetitive tasks so humans can focus on relationships and complex decisions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {scenario.currentProcess.map((step) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedEnhancements.has(step.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium">{step.task}</h5>
                          <p className="text-sm text-muted-foreground">
                            Current time: {step.time} minutes • 
                            {step.automatable ? ' Can be enhanced with AI' : ' Requires human touch'}
                          </p>
                        </div>
                        {step.automatable && (
                          <Button
                            onClick={() => enhanceWithAI(step.id)}
                            variant={selectedEnhancements.has(step.id) ? "default" : "outline"}
                            size="sm"
                          >
                            {selectedEnhancements.has(step.id) ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Enhanced
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add AI
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      {selectedEnhancements.has(step.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-3 bg-primary/10 rounded"
                        >
                          <p className="text-sm">
                            <strong>AI Enhancement:</strong> Automated {step.task.toLowerCase()} 
                            saves ~{Math.floor(step.time * 0.7)} minutes per instance
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      buildEnhancedWorkflow();
                      setPhase('enhance');
                    }}
                    disabled={selectedEnhancements.size === 0}
                    className="flex-1"
                  >
                    Preview Enhanced Workflow
                    <Play className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setSelectedEnhancements(new Set())}
                    variant="outline"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'enhance' && (
          <motion.div
            key="enhance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your AI-Enhanced Workflow</CardTitle>
                <CardDescription>See the impact of your design choices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Before vs After</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-900">Before Enhancement</p>
                        <p className="text-2xl font-bold text-red-600">{metrics.totalTime} minutes</p>
                        <p className="text-xs text-red-700">100% manual process</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">After Enhancement</p>
                        <p className="text-2xl font-bold text-green-600">
                          {enhancedWorkflow.reduce((sum, step) => sum + step.time, 0)} minutes
                        </p>
                        <p className="text-xs text-green-700">Human + AI collaboration</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Team Alignment Score</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary mb-2">{teamAlignment}%</p>
                        <Progress value={teamAlignment} className="h-3" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>Maintains human touchpoints</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>Reduces repetitive work</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>Clear human-AI collaboration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Enhanced Workflow:</h4>
                  {enhancedWorkflow.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        step.type === 'hybrid' 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/30'
                      }`}
                    >
                      <div className={`p-2 rounded ${
                        step.type === 'hybrid' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {step.type === 'hybrid' ? <Zap className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{step.task}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.time} minutes
                          {step.aiEnhancement && (
                            <span className="text-green-600 ml-2">
                              (-{step.aiEnhancement.timeReduction} min with AI)
                            </span>
                          )}
                        </p>
                      </div>
                      <Badge variant={step.type === 'hybrid' ? 'default' : 'outline'} className="text-xs">
                        {step.type === 'hybrid' ? 'AI-Enhanced' : 'Human'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>Success!</strong> Your workflow saves {metrics.totalTime - enhancedWorkflow.reduce((sum, step) => sum + step.time, 0)} minutes per cycle while keeping humans at the center.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={() => {
                    setPhase('complete');
                    if (onComplete) onComplete(teamAlignment);
                  }}
                  size="lg"
                  className="w-full"
                >
                  Complete Challenge
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg">
              <Cog className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Automation Visionary!</h2>
              <p className="text-lg">You've designed workflows that enhance human potential</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">What You've Mastered:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <GitBranch className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Process Design</h4>
                    <p className="text-sm text-muted-foreground">
                      Map and optimize complex workflows
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Users className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Human-AI Balance</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep people at the center of automation
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Team Alignment</h4>
                    <p className="text-sm text-muted-foreground">
                      Build buy-in for AI transformation
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Impact:</h4>
                  <p className="text-sm">
                    By enhancing just one process, you'll save your team {(metrics.totalTime - enhancedWorkflow.reduce((sum, step) => sum + step.time, 0)) * 20} hours per month, 
                    allowing them to focus on what matters most: your mission.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RachelAutomationBuilder;