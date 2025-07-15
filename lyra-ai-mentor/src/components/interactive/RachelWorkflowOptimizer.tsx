import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Users, 
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowRight,
  Settings
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  currentTime: number; // minutes
  optimizedTime: number; // minutes
  frequency: 'daily' | 'weekly' | 'monthly';
  assignee: string;
  tools: string[];
  painPoints: string[];
  improvementSuggestions: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'admin' | 'programs' | 'fundraising' | 'communications';
  steps: WorkflowStep[];
  totalTimeWeekly: number;
  optimizedTimeWeekly: number;
  timeSavings: number;
  priority: 'high' | 'medium' | 'low';
  lastOptimized?: Date;
}

interface OptimizationSuggestion {
  type: 'automation' | 'tool_change' | 'process_improvement' | 'delegation';
  title: string;
  description: string;
  timeSavings: number;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  steps: string[];
}

const RachelWorkflowOptimizer: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const sampleWorkflows: Workflow[] = [
    {
      id: 'monthly-reporting',
      name: 'Monthly Program Reporting',
      description: 'Collect data, analyze metrics, and create monthly program reports',
      category: 'programs',
      priority: 'high',
      totalTimeWeekly: 360, // 6 hours weekly
      optimizedTimeWeekly: 120, // 2 hours weekly
      timeSavings: 240,
      steps: [
        {
          id: 'data-collection',
          name: 'Data Collection',
          description: 'Gather participation data from multiple sources',
          currentTime: 90,
          optimizedTime: 20,
          frequency: 'monthly',
          assignee: 'Program Manager',
          tools: ['Excel', 'Email', 'Phone calls'],
          painPoints: ['Manual data entry', 'Multiple sources', 'Inconsistent formats'],
          improvementSuggestions: ['Automated data integration', 'Standardized forms', 'Real-time dashboards']
        },
        {
          id: 'analysis',
          name: 'Data Analysis',
          description: 'Calculate metrics and identify trends',
          currentTime: 120,
          optimizedTime: 30,
          frequency: 'monthly',
          assignee: 'Program Manager',
          tools: ['Excel', 'Calculator'],
          painPoints: ['Manual calculations', 'Error-prone formulas', 'Time-consuming'],
          improvementSuggestions: ['Automated calculations', 'Pre-built templates', 'Visualization tools']
        },
        {
          id: 'report-creation',
          name: 'Report Creation',
          description: 'Format data into presentation-ready reports',
          currentTime: 150,
          optimizedTime: 45,
          frequency: 'monthly',
          assignee: 'Program Manager',
          tools: ['Word', 'PowerPoint', 'Email'],
          painPoints: ['Manual formatting', 'Copy-paste errors', 'Version control'],
          improvementSuggestions: ['Report templates', 'Automated formatting', 'Direct data connections']
        }
      ]
    },
    {
      id: 'donor-communications',
      name: 'Donor Communication Workflow',
      description: 'Manage donor thank you letters, updates, and engagement',
      category: 'fundraising',
      priority: 'high',
      totalTimeWeekly: 180, // 3 hours weekly
      optimizedTimeWeekly: 60, // 1 hour weekly
      timeSavings: 120,
      steps: [
        {
          id: 'thank-you-letters',
          name: 'Thank You Letters',
          description: 'Send personalized thank you letters to donors',
          currentTime: 60,
          optimizedTime: 15,
          frequency: 'weekly',
          assignee: 'Development Coordinator',
          tools: ['Word', 'Mail merge', 'Printer'],
          painPoints: ['Manual personalization', 'Printing/mailing', 'Tracking delivery'],
          improvementSuggestions: ['Email automation', 'Template library', 'Automated tracking']
        },
        {
          id: 'donor-updates',
          name: 'Donor Updates',
          description: 'Regular updates on program impact and organizational news',
          currentTime: 90,
          optimizedTime: 30,
          frequency: 'monthly',
          assignee: 'Development Coordinator',
          tools: ['Email platform', 'Canva', 'Photos'],
          painPoints: ['Content creation', 'Design time', 'List management'],
          improvementSuggestions: ['Content calendar', 'Template designs', 'Automated segmentation']
        },
        {
          id: 'engagement-tracking',
          name: 'Engagement Tracking',
          description: 'Track donor engagement and plan follow-up activities',
          currentTime: 30,
          optimizedTime: 15,
          frequency: 'weekly',
          assignee: 'Development Coordinator',
          tools: ['Spreadsheet', 'CRM', 'Email'],
          painPoints: ['Manual tracking', 'Data silos', 'Follow-up timing'],
          improvementSuggestions: ['Integrated CRM', 'Automated scoring', 'Trigger-based follow-ups']
        }
      ]
    }
  ];

  const analyzeWorkflow = async (workflow: Workflow) => {
    setIsAnalyzing(true);
    setCurrentWorkflow(workflow);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate optimization suggestions
    const suggestions: OptimizationSuggestion[] = [
      {
        type: 'automation',
        title: 'Automate Data Collection',
        description: 'Set up automated data feeds from program databases to eliminate manual data entry',
        timeSavings: 70,
        effort: 'medium',
        impact: 'high',
        steps: [
          'Set up API connections to program databases',
          'Create automated data pipeline',
          'Configure daily/weekly sync schedules',
          'Set up data validation rules'
        ]
      },
      {
        type: 'tool_change',
        title: 'Implement Analytics Dashboard',
        description: 'Replace manual Excel analysis with real-time analytics dashboard',
        timeSavings: 90,
        effort: 'high',
        impact: 'high',
        steps: [
          'Select analytics platform (Tableau, Power BI, etc.)',
          'Connect data sources',
          'Build interactive dashboards',
          'Train staff on new tools'
        ]
      },
      {
        type: 'process_improvement',
        title: 'Standardize Report Templates',
        description: 'Create reusable report templates with automatic data population',
        timeSavings: 60,
        effort: 'low',
        impact: 'medium',
        steps: [
          'Design standard report layouts',
          'Create template library',
          'Set up automatic data connections',
          'Train team on template usage'
        ]
      },
      {
        type: 'delegation',
        title: 'Redistribute Workflow Tasks',
        description: 'Delegate routine tasks to administrative staff or volunteers',
        timeSavings: 45,
        effort: 'low',
        impact: 'medium',
        steps: [
          'Identify delegatable tasks',
          'Create task documentation',
          'Train designated staff/volunteers',
          'Set up quality control process'
        ]
      }
    ];
    
    setOptimizationSuggestions(suggestions);
    setIsAnalyzing(false);
  };

  const calculateTotalSavings = () => {
    return optimizationSuggestions.reduce((total, suggestion) => total + suggestion.timeSavings, 0);
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'automation': return Zap;
      case 'tool_change': return Settings;
      case 'process_improvement': return TrendingUp;
      case 'delegation': return Users;
      default: return Lightbulb;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'programs': return 'text-green-600 bg-green-100';
      case 'fundraising': return 'text-purple-600 bg-purple-100';
      case 'communications': return 'text-orange-600 bg-orange-100';
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Workflow Optimizer</CardTitle>
              <CardDescription>
                Analyze and optimize nonprofit workflows to save time and increase efficiency
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentWorkflow ? (
            /* Workflow Selection */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Workflow to Optimize</CardTitle>
                  <CardDescription>Choose a workflow for AI-powered optimization analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleWorkflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => analyzeWorkflow(workflow)}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{workflow.name}</h4>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(workflow.category)} variant="secondary">
                            {workflow.category}
                          </Badge>
                          <Badge variant="outline">
                            {workflow.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-red-50 rounded">
                          <div className="text-lg font-bold text-red-600">{formatTime(workflow.totalTimeWeekly)}</div>
                          <div className="text-xs text-red-600">Current Time/Week</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{formatTime(workflow.optimizedTimeWeekly)}</div>
                          <div className="text-xs text-green-600">Optimized Time/Week</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{formatTime(workflow.timeSavings)}</div>
                          <div className="text-xs text-blue-600">Potential Savings</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Analyze Workflow
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {isAnalyzing ? (
                /* Loading State */
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Analyzing Workflow</h3>
                    <p className="text-purple-600">
                      AI is analyzing "{currentWorkflow.name}" to identify optimization opportunities...
                    </p>
                  </CardContent>
                </Card>
              ) : (
                /* Results */
                <div className="space-y-6">
                  {/* Workflow Overview */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{currentWorkflow.name}</CardTitle>
                          <CardDescription>{currentWorkflow.description}</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => setCurrentWorkflow(null)}>
                          Back to Workflows
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <Clock className="w-6 h-6 mx-auto mb-2 text-red-600" />
                          <div className="text-2xl font-bold text-red-600">{formatTime(currentWorkflow.totalTimeWeekly)}</div>
                          <div className="text-sm text-red-600">Current Weekly Time</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                          <div className="text-2xl font-bold text-green-600">{formatTime(currentWorkflow.optimizedTimeWeekly)}</div>
                          <div className="text-sm text-green-600">Optimized Time</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-2xl font-bold text-blue-600">{formatTime(calculateTotalSavings())}</div>
                          <div className="text-sm text-blue-600">Total Savings</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round((calculateTotalSavings() / currentWorkflow.totalTimeWeekly) * 100)}%
                          </div>
                          <div className="text-sm text-purple-600">Efficiency Gain</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Workflow Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Workflow Analysis</CardTitle>
                      <CardDescription>Step-by-step breakdown of current process</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentWorkflow.steps.map((step, index) => (
                          <div key={step.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{step.name}</h4>
                              <div className="flex gap-2">
                                <Badge variant="outline">{step.assignee}</Badge>
                                <Badge variant="outline">{step.frequency}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <h5 className="font-medium text-sm mb-2">Current vs Optimized Time:</h5>
                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-red-600">{formatTime(step.currentTime)}</div>
                                    <div className="text-xs text-red-600">Current</div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400" />
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{formatTime(step.optimizedTime)}</div>
                                    <div className="text-xs text-green-600">Optimized</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">
                                      -{formatTime(step.currentTime - step.optimizedTime)}
                                    </div>
                                    <div className="text-xs text-blue-600">Savings</div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm mb-2">Tools Used:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {step.tools.map((tool, toolIndex) => (
                                    <Badge key={toolIndex} variant="outline" className="text-xs">
                                      {tool}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-sm text-red-700 mb-2">Pain Points:</h5>
                                <ul className="space-y-1">
                                  {step.painPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="flex items-start gap-2">
                                      <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-red-700">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm text-green-700 mb-2">Improvements:</h5>
                                <ul className="space-y-1">
                                  {step.improvementSuggestions.map((suggestion, suggestionIndex) => (
                                    <li key={suggestionIndex} className="flex items-start gap-2">
                                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-green-700">{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimization Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
                      <CardDescription>AI-powered suggestions to improve efficiency</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {optimizationSuggestions.map((suggestion, index) => {
                          const Icon = getSuggestionIcon(suggestion.type);
                          return (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">{suggestion.title}</h4>
                                    <div className="flex gap-2">
                                      <Badge className={getEffortColor(suggestion.effort)} variant="secondary">
                                        {suggestion.effort} effort
                                      </Badge>
                                      <Badge className={getImpactColor(suggestion.impact)} variant="secondary">
                                        {suggestion.impact} impact
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                                  
                                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock className="w-4 h-4 text-blue-600" />
                                      <span className="font-medium text-blue-800">
                                        Time Savings: {formatTime(suggestion.timeSavings)} per month
                                      </span>
                                    </div>
                                    <div className="text-xs text-blue-600">
                                      Annual savings: {formatTime(suggestion.timeSavings * 12)}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-sm mb-2">Implementation Steps:</h5>
                                    <ol className="space-y-1">
                                      {suggestion.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="flex items-start gap-2">
                                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {stepIndex + 1}
                                          </span>
                                          <span className="text-xs text-gray-700">{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Implementation Roadmap */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800">Implementation Roadmap</CardTitle>
                      <CardDescription className="text-green-600">
                        Recommended order for maximum impact with minimum disruption
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded border">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">1</div>
                          <div className="flex-1">
                            <h4 className="font-medium">Quick Wins (Week 1-2)</h4>
                            <p className="text-sm text-gray-600">Standardize report templates and delegate routine tasks</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800" variant="secondary">Low effort</Badge>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded border">
                          <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold">2</div>
                          <div className="flex-1">
                            <h4 className="font-medium">Medium-term Improvements (Month 1-2)</h4>
                            <p className="text-sm text-gray-600">Implement data automation and basic analytics</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">Medium effort</Badge>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded border">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">3</div>
                          <div className="flex-1">
                            <h4 className="font-medium">Long-term Transformation (Quarter 1)</h4>
                            <p className="text-sm text-gray-600">Deploy advanced analytics platform and full automation</p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800" variant="secondary">High effort</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RachelWorkflowOptimizer;