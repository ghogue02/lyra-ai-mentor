import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Clock, 
  Target,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  RefreshCw,
  Download,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickStrategySession {
  id: string;
  title: string;
  type: 'swot' | 'problem_solving' | 'opportunity' | 'crisis_response' | 'innovation';
  duration: number; // minutes
  status: 'active' | 'completed' | 'paused';
  startTime: Date;
  endTime?: Date;
  currentStep: number;
  totalSteps: number;
  outputs: StrategyOutput[];
}

interface StrategyOutput {
  step: number;
  title: string;
  content: string;
  insights: string[];
  actionItems: ActionItem[];
  generated: boolean;
}

interface ActionItem {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short_term' | 'medium_term';
  owner?: string;
  completed: boolean;
}

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TemplateStep[];
  useCase: string;
  outcomes: string[];
}

interface TemplateStep {
  number: number;
  title: string;
  description: string;
  prompts: string[];
  timeAllocation: number; // minutes
  type: 'input' | 'analysis' | 'generation' | 'review';
}

interface RapidInsight {
  category: 'strength' | 'weakness' | 'opportunity' | 'threat' | 'action';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
}

const AlexQuickStrategy: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<QuickStrategySession | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const strategyTemplates: StrategyTemplate[] = [
    {
      id: 'rapid-swot',
      name: 'Rapid SWOT Analysis',
      description: 'Quick assessment of strengths, weaknesses, opportunities, and threats',
      duration: 15,
      difficulty: 'beginner',
      useCase: 'Strategic assessment, planning preparation, decision support',
      outcomes: ['SWOT matrix', 'Priority actions', 'Strategic recommendations'],
      steps: [
        {
          number: 1,
          title: 'Define Focus',
          description: 'Clarify the specific situation, project, or decision for analysis',
          prompts: [
            'What specific challenge or opportunity are you analyzing?',
            'What is the timeframe for this strategic consideration?',
            'Who are the key stakeholders affected?'
          ],
          timeAllocation: 3,
          type: 'input'
        },
        {
          number: 2,
          title: 'Identify Strengths',
          description: 'List internal positive factors and advantages',
          prompts: [
            'What are your organization\'s key strengths in this area?',
            'What resources and capabilities do you have?',
            'What do you do better than competitors?'
          ],
          timeAllocation: 3,
          type: 'input'
        },
        {
          number: 3,
          title: 'Identify Weaknesses',
          description: 'Acknowledge internal limitations and areas for improvement',
          prompts: [
            'What internal factors might hinder success?',
            'Where do you lack resources or capabilities?',
            'What do competitors do better than you?'
          ],
          timeAllocation: 3,
          type: 'input'
        },
        {
          number: 4,
          title: 'Spot Opportunities',
          description: 'External factors that could benefit your organization',
          prompts: [
            'What external trends could benefit you?',
            'What changes in the environment create openings?',
            'What unmet needs could you address?'
          ],
          timeAllocation: 3,
          type: 'input'
        },
        {
          number: 5,
          title: 'Assess Threats',
          description: 'External risks and challenges to address',
          prompts: [
            'What external factors pose risks?',
            'What competitive threats do you face?',
            'What changes could negatively impact you?'
          ],
          timeAllocation: 2,
          type: 'input'
        },
        {
          number: 6,
          title: 'Generate Strategy',
          description: 'AI-powered analysis and strategic recommendations',
          prompts: [],
          timeAllocation: 1,
          type: 'generation'
        }
      ]
    },
    {
      id: 'problem-solver',
      name: 'Rapid Problem Solving',
      description: 'Structured approach to quickly identify solutions',
      duration: 20,
      difficulty: 'intermediate',
      useCase: 'Crisis management, operational challenges, team conflicts',
      outcomes: ['Problem definition', 'Solution options', 'Implementation plan'],
      steps: [
        {
          number: 1,
          title: 'Define Problem',
          description: 'Clearly articulate the specific problem to solve',
          prompts: [
            'What exactly is the problem you\'re facing?',
            'When did this problem first occur?',
            'Who is affected by this problem?',
            'What are the consequences if not resolved?'
          ],
          timeAllocation: 4,
          type: 'input'
        },
        {
          number: 2,
          title: 'Root Cause Analysis',
          description: 'Identify underlying causes rather than symptoms',
          prompts: [
            'What factors contributed to this problem?',
            'What systems or processes broke down?',
            'What assumptions proved incorrect?'
          ],
          timeAllocation: 5,
          type: 'analysis'
        },
        {
          number: 3,
          title: 'Generate Solutions',
          description: 'Brainstorm multiple potential solutions',
          prompts: [
            'What are 3-5 potential solutions?',
            'What would ideal success look like?',
            'What constraints must solutions work within?'
          ],
          timeAllocation: 6,
          type: 'input'
        },
        {
          number: 4,
          title: 'Evaluate Options',
          description: 'Assess solutions for feasibility and impact',
          prompts: [
            'Which solutions are most feasible?',
            'What are the resource requirements?',
            'What are potential risks or downsides?'
          ],
          timeAllocation: 3,
          type: 'analysis'
        },
        {
          number: 5,
          title: 'Action Plan',
          description: 'Create implementation strategy for chosen solution',
          prompts: [],
          timeAllocation: 2,
          type: 'generation'
        }
      ]
    },
    {
      id: 'opportunity-sprint',
      name: 'Opportunity Sprint',
      description: 'Rapid evaluation and planning for new opportunities',
      duration: 12,
      difficulty: 'beginner',
      useCase: 'New partnerships, funding opportunities, program expansion',
      outcomes: ['Opportunity assessment', 'Go/no-go recommendation', 'Next steps'],
      steps: [
        {
          number: 1,
          title: 'Opportunity Overview',
          description: 'Describe the opportunity in detail',
          prompts: [
            'What is the specific opportunity?',
            'Who presented this opportunity?',
            'What is the timeline for decision/action?'
          ],
          timeAllocation: 2,
          type: 'input'
        },
        {
          number: 2,
          title: 'Strategic Fit',
          description: 'Assess alignment with mission and goals',
          prompts: [
            'How does this align with your mission?',
            'What strategic goals would this advance?',
            'Does this fit your organizational capacity?'
          ],
          timeAllocation: 3,
          type: 'analysis'
        },
        {
          number: 3,
          title: 'Resource Requirements',
          description: 'Identify what would be needed to pursue this',
          prompts: [
            'What staff time would be required?',
            'What financial investment is needed?',
            'What new capabilities would you need to develop?'
          ],
          timeAllocation: 3,
          type: 'input'
        },
        {
          number: 4,
          title: 'Risk Assessment',
          description: 'Consider potential downsides and challenges',
          prompts: [
            'What could go wrong with this opportunity?',
            'What are you risking by saying yes?',
            'What are you risking by saying no?'
          ],
          timeAllocation: 2,
          type: 'input'
        },
        {
          number: 5,
          title: 'Decision Framework',
          description: 'AI analysis and recommendation',
          prompts: [],
          timeAllocation: 2,
          type: 'generation'
        }
      ]
    }
  ];

  const sampleInsights: RapidInsight[] = [
    {
      category: 'strength',
      title: 'Strong Community Partnerships',
      description: 'Existing relationships provide foundation for expansion',
      confidence: 92,
      impact: 'high',
      urgency: 'medium'
    },
    {
      category: 'opportunity',
      title: 'Digital Service Delivery',
      description: 'Post-pandemic shift creates demand for online programming',
      confidence: 85,
      impact: 'high',
      urgency: 'high'
    },
    {
      category: 'threat',
      title: 'Funding Competition',
      description: 'Increased competition for limited foundation grants',
      confidence: 78,
      impact: 'medium',
      urgency: 'high'
    },
    {
      category: 'action',
      title: 'Diversify Revenue Streams',
      description: 'Develop earned income and individual donor programs',
      confidence: 88,
      impact: 'high',
      urgency: 'medium'
    }
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && currentSession) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentSession]);

  const startSession = (template: StrategyTemplate) => {
    const newSession: QuickStrategySession = {
      id: `session-${Date.now()}`,
      title: template.name,
      type: 'swot',
      duration: template.duration,
      status: 'active',
      startTime: new Date(),
      currentStep: 1,
      totalSteps: template.steps.length,
      outputs: template.steps.map(step => ({
        step: step.number,
        title: step.title,
        content: '',
        insights: [],
        actionItems: [],
        generated: false
      }))
    };
    
    setCurrentSession(newSession);
    setSelectedTemplate(template);
    setSessionTimer(0);
    setIsTimerRunning(true);
  };

  const completeStep = async () => {
    if (!currentSession || !selectedTemplate) return;
    
    const currentStepTemplate = selectedTemplate.steps[currentSession.currentStep - 1];
    
    if (currentStepTemplate.type === 'generation') {
      setIsGenerating(true);
      
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedOutput = {
        insights: [
          'Strategic alignment with mission strongly favors this direction',
          'Resource requirements are within organizational capacity',
          'Risk mitigation strategies are feasible and effective'
        ],
        actionItems: [
          {
            id: `action-${Date.now()}`,
            description: 'Schedule stakeholder alignment meeting',
            priority: 'high' as const,
            timeframe: 'immediate' as const,
            completed: false
          },
          {
            id: `action-${Date.now() + 1}`,
            description: 'Develop detailed resource allocation plan',
            priority: 'medium' as const,
            timeframe: 'short_term' as const,
            completed: false
          }
        ]
      };
      
      setCurrentSession(prev => prev ? {
        ...prev,
        outputs: prev.outputs.map(output => 
          output.step === prev.currentStep 
            ? { ...output, ...generatedOutput, generated: true }
            : output
        )
      } : null);
      
      setIsGenerating(false);
    } else {
      setCurrentSession(prev => prev ? {
        ...prev,
        outputs: prev.outputs.map(output => 
          output.step === prev.currentStep 
            ? { ...output, content: currentInput }
            : output
        )
      } : null);
    }
    
    setCurrentInput('');
    
    if (currentSession.currentStep < currentSession.totalSteps) {
      setCurrentSession(prev => prev ? {
        ...prev,
        currentStep: prev.currentStep + 1
      } : null);
    } else {
      // Session complete
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'completed',
        endTime: new Date()
      } : null);
      setIsTimerRunning(false);
    }
  };

  const pauseSession = () => {
    setIsTimerRunning(false);
    setCurrentSession(prev => prev ? { ...prev, status: 'paused' } : null);
  };

  const resumeSession = () => {
    setIsTimerRunning(true);
    setCurrentSession(prev => prev ? { ...prev, status: 'active' } : null);
  };

  const endSession = () => {
    setCurrentSession(null);
    setSelectedTemplate(null);
    setSessionTimer(0);
    setIsTimerRunning(false);
    setCurrentInput('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'strength': return 'text-green-600 bg-green-100';
      case 'opportunity': return 'text-blue-600 bg-blue-100';
      case 'weakness': return 'text-orange-600 bg-orange-100';
      case 'threat': return 'text-red-600 bg-red-100';
      case 'action': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Quick Strategy Builder</CardTitle>
              <CardDescription>
                Rapid strategic analysis and decision-making tools for time-sensitive situations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentSession ? (
            /* Template Selection */
            <div className="space-y-6">
              {/* Rapid Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI-Powered Quick Insights</CardTitle>
                  <CardDescription>Instant strategic analysis based on your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sampleInsights.map((insight, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getInsightColor(insight.category)} variant="secondary">
                            {insight.category}
                          </Badge>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                        </div>
                        <h4 className="font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(insight.impact)} variant="outline">
                            {insight.impact} impact
                          </Badge>
                          <Badge className={getPriorityColor(insight.urgency)} variant="outline">
                            {insight.urgency} urgency
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strategy Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Strategy Templates</CardTitle>
                  <CardDescription>Choose a rapid analysis framework for your situation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategyTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{template.name}</h4>
                          <p className="text-gray-600">{template.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(template.difficulty)} variant="secondary">
                            {template.difficulty}
                          </Badge>
                          <Button onClick={() => startSession(template)}>
                            <Play className="w-4 h-4 mr-2" />
                            Start ({template.duration}min)
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Use Case:</div>
                          <div className="text-sm text-gray-600">{template.useCase}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Expected Outcomes:</div>
                          <ul className="text-sm text-gray-600">
                            {template.outcomes.map((outcome, index) => (
                              <li key={index}>• {outcome}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⏱️ {template.duration} minutes</span>
                        <span>📋 {template.steps.length} steps</span>
                        <span>🎯 {template.difficulty} level</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Active Session */
            <div className="space-y-6">
              {/* Session Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentSession.title}</CardTitle>
                      <CardDescription>
                        Step {currentSession.currentStep} of {currentSession.totalSteps} • {formatTime(sessionTimer)} elapsed
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {currentSession.status === 'active' ? (
                        <Button variant="outline" onClick={pauseSession}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={resumeSession}>
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      <Button variant="outline" onClick={endSession}>
                        End Session
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Progress value={(currentSession.currentStep / currentSession.totalSteps) * 100} className="h-2" />
                  </div>
                </CardHeader>
              </Card>

              {/* Current Step */}
              {selectedTemplate && currentSession.status !== 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedTemplate.steps[currentSession.currentStep - 1].title}
                    </CardTitle>
                    <CardDescription>
                      {selectedTemplate.steps[currentSession.currentStep - 1].description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTemplate.steps[currentSession.currentStep - 1].type === 'generation' ? (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                          {isGenerating ? (
                            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                          ) : (
                            <Sparkles className="w-8 h-8 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {isGenerating ? 'Generating AI Analysis...' : 'Ready to Generate'}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            AI will analyze your inputs and provide strategic insights and recommendations
                          </p>
                          <Button 
                            onClick={completeStep} 
                            disabled={isGenerating}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {isGenerating ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Strategy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {selectedTemplate.steps[currentSession.currentStep - 1].prompts.map((prompt, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                              <div className="text-sm text-blue-800 font-medium">💡 {prompt}</div>
                            </div>
                          ))}
                        </div>
                        
                        <Textarea
                          placeholder="Enter your response here..."
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          className="min-h-[120px]"
                        />
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            ⏱️ Recommended time: {selectedTemplate.steps[currentSession.currentStep - 1].timeAllocation} minutes
                          </div>
                          <Button 
                            onClick={completeStep} 
                            disabled={!currentInput.trim()}
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Session Results */}
              {currentSession.status === 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Complete! 🎉</CardTitle>
                    <CardDescription>
                      Your rapid strategy analysis is ready for review and action
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentSession.outputs.map((output) => (
                      <div key={output.step} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{output.title}</h4>
                        
                        {output.content && (
                          <div className="bg-gray-50 p-3 rounded mb-3">
                            <div className="text-sm">{output.content}</div>
                          </div>
                        )}
                        
                        {output.insights.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">AI Insights:</div>
                            <ul className="space-y-1">
                              {output.insights.map((insight, index) => (
                                <li key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                                  🔍 {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {output.actionItems.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Action Items:</div>
                            <div className="space-y-2">
                              {output.actionItems.map((action) => (
                                <div key={action.id} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="text-sm flex-1">{action.description}</span>
                                  <Badge className={getPriorityColor(action.priority)} variant="secondary">
                                    {action.priority}
                                  </Badge>
                                  <Badge variant="outline">{action.timeframe.replace('_', ' ')}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                      <Button variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Start New Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSession.outputs.map((output) => (
                      <div key={output.step} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          output.step < currentSession.currentStep || currentSession.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : output.step === currentSession.currentStep
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {output.step < currentSession.currentStep || currentSession.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            output.step
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            output.step === currentSession.currentStep ? 'text-blue-700' : ''
                          }`}>
                            {output.title}
                          </div>
                          {output.content && (
                            <div className="text-sm text-gray-600">Completed</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Strategy Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Quick Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Rapid Analysis:</h4>
                  <ul className="space-y-1">
                    <li>• Focus on the most critical 2-3 factors</li>
                    <li>• Use time constraints to avoid overthinking</li>
                    <li>• Trust your initial instincts and expertise</li>
                    <li>• Capture key insights for later deep dive</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quick Decisions:</h4>
                  <ul className="space-y-1">
                    <li>• Define clear success criteria upfront</li>
                    <li>• Identify reversible vs. irreversible decisions</li>
                    <li>• Plan for quick feedback and course correction</li>
                    <li>• Document rationale for future reference</li>
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

export default AlexQuickStrategy;