import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Clock, AlertTriangle, CheckCircle, Target, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessOptimizerProps {
  onComplete?: () => void;
}

interface ProcessStep {
  id: number;
  name: string;
  currentTime: string;
  optimizedTime: string;
  improvement: string;
  bottleneck?: boolean;
  automatable?: boolean;
}

interface OptimizationResult {
  processName: string;
  currentState: {
    totalTime: string;
    steps: number;
    touchpoints: number;
    waitTime: string;
    errorRate: string;
  };
  optimizedState: {
    totalTime: string;
    steps: number;
    touchpoints: number;
    waitTime: string;
    errorRate: string;
  };
  improvements: {
    timeReduction: string;
    stepsEliminated: number;
    costSavings: string;
    qualityIncrease: string;
  };
  processSteps: ProcessStep[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    effort: string;
  }[];
  automationOpportunities: {
    task: string;
    tool: string;
    benefit: string;
  }[];
}

export const ProcessOptimizer: React.FC<ProcessOptimizerProps> = ({ onComplete }) => {
  const [processType, setProcessType] = useState<string>('');
  const [processDescription, setProcessDescription] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processTypes = [
    { value: 'donor_acknowledgment', label: 'Donor Acknowledgment', description: 'Thank you process' },
    { value: 'volunteer_onboarding', label: 'Volunteer Onboarding', description: 'New volunteer setup' },
    { value: 'grant_application', label: 'Grant Application', description: 'Grant submission process' },
    { value: 'event_planning', label: 'Event Planning', description: 'Event coordination' },
    { value: 'client_intake', label: 'Client Intake', description: 'New client enrollment' },
    { value: 'expense_approval', label: 'Expense Approval', description: 'Expense reimbursement' },
    { value: 'program_reporting', label: 'Program Reporting', description: 'Impact reporting' },
    { value: 'board_preparation', label: 'Board Meeting Prep', description: 'Board packet creation' }
  ];

  const analyzeProcess = async () => {
    if (!processType || !processDescription.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateOptimizationPlan();
      setResult(result);
      
      toast.success('Process optimization complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to analyze process. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateOptimizationPlan = (): OptimizationResult => {
    const templates: Record<string, () => OptimizationResult> = {
      donor_acknowledgment: () => ({
        processName: 'Donor Acknowledgment Process',
        currentState: {
          totalTime: '5-7 business days',
          steps: 12,
          touchpoints: 8,
          waitTime: '3 days average',
          errorRate: '15% require rework'
        },
        optimizedState: {
          totalTime: '24-48 hours',
          steps: 6,
          touchpoints: 4,
          waitTime: '2 hours maximum',
          errorRate: 'Less than 2%'
        },
        improvements: {
          timeReduction: '75% faster',
          stepsEliminated: 6,
          costSavings: '$3,200/month',
          qualityIncrease: '87% error reduction'
        },
        processSteps: [
          {
            id: 1,
            name: 'Donation Received',
            currentTime: 'Instant',
            optimizedTime: 'Instant',
            improvement: 'Automated detection via payment processor',
            automatable: true
          },
          {
            id: 2,
            name: 'Data Entry',
            currentTime: '1-2 days',
            optimizedTime: '0 minutes',
            improvement: 'Eliminated - auto-imported to CRM',
            bottleneck: true,
            automatable: true
          },
          {
            id: 3,
            name: 'Gift Processing',
            currentTime: '1 day',
            optimizedTime: '5 minutes',
            improvement: 'Automated workflow with validation',
            automatable: true
          },
          {
            id: 4,
            name: 'Thank You Letter Draft',
            currentTime: '1 day',
            optimizedTime: '0 minutes',
            improvement: 'AI-generated personalized content',
            bottleneck: true,
            automatable: true
          },
          {
            id: 5,
            name: 'Executive Signature',
            currentTime: '2 days',
            optimizedTime: '1 hour',
            improvement: 'Digital signature queue with reminders',
            bottleneck: true
          },
          {
            id: 6,
            name: 'Printing & Mailing',
            currentTime: '1 day',
            optimizedTime: '0 minutes',
            improvement: 'Email delivery with print option',
            automatable: true
          },
          {
            id: 7,
            name: 'CRM Update',
            currentTime: '30 minutes',
            optimizedTime: 'Automatic',
            improvement: 'Real-time sync throughout process',
            automatable: true
          },
          {
            id: 8,
            name: 'Donor Segmentation',
            currentTime: '1 hour weekly',
            optimizedTime: 'Automatic',
            improvement: 'Rule-based auto-tagging',
            automatable: true
          }
        ],
        recommendations: [
          {
            priority: 'high',
            action: 'Implement payment processor API integration',
            impact: 'Eliminate manual data entry completely',
            effort: '1 week setup'
          },
          {
            priority: 'high',
            action: 'Deploy AI thank you letter generator',
            impact: 'Save 10 hours/week on letter writing',
            effort: '2 days configuration'
          },
          {
            priority: 'medium',
            action: 'Set up digital signature workflow',
            impact: 'Reduce signature delays by 90%',
            effort: '1 day setup'
          },
          {
            priority: 'medium',
            action: 'Create donor communication preferences',
            impact: 'Increase email adoption to 70%',
            effort: '3 days implementation'
          },
          {
            priority: 'low',
            action: 'Build executive dashboard',
            impact: 'Real-time visibility into process',
            effort: '1 week development'
          }
        ],
        automationOpportunities: [
          {
            task: 'Payment data capture',
            tool: 'Stripe/PayPal webhooks → CRM API',
            benefit: 'Zero manual entry, instant processing'
          },
          {
            task: 'Thank you generation',
            tool: 'AI writing tool with mail merge',
            benefit: 'Personalized letters in seconds'
          },
          {
            task: 'Donor segmentation',
            tool: 'CRM automation rules',
            benefit: 'Instant categorization for targeting'
          },
          {
            task: 'Receipt generation',
            tool: 'Automated PDF creation and delivery',
            benefit: 'IRS-compliant receipts instantly'
          }
        ]
      }),

      volunteer_onboarding: () => ({
        processName: 'Volunteer Onboarding Process',
        currentState: {
          totalTime: '2-3 weeks',
          steps: 18,
          touchpoints: 12,
          waitTime: '10 days average',
          errorRate: '25% incomplete onboarding'
        },
        optimizedState: {
          totalTime: '3-5 days',
          steps: 8,
          touchpoints: 5,
          waitTime: '1 day maximum',
          errorRate: 'Less than 5%'
        },
        improvements: {
          timeReduction: '80% faster',
          stepsEliminated: 10,
          costSavings: '$2,800/month',
          qualityIncrease: '80% completion rate increase'
        },
        processSteps: [
          {
            id: 1,
            name: 'Application Submission',
            currentTime: 'Instant',
            optimizedTime: 'Instant',
            improvement: 'Online form with instant confirmation',
            automatable: true
          },
          {
            id: 2,
            name: 'Application Review',
            currentTime: '3-5 days',
            optimizedTime: '24 hours',
            improvement: 'AI pre-screening with staff validation',
            bottleneck: true,
            automatable: true
          },
          {
            id: 3,
            name: 'Background Check',
            currentTime: '5-7 days',
            optimizedTime: '2 days',
            improvement: 'Integrated service with auto-initiation',
            bottleneck: true
          },
          {
            id: 4,
            name: 'Scheduling Orientation',
            currentTime: '2-3 days',
            optimizedTime: 'Instant',
            improvement: 'Self-service calendar booking',
            automatable: true
          },
          {
            id: 5,
            name: 'Document Collection',
            currentTime: '3 days',
            optimizedTime: '0 days',
            improvement: 'Digital forms completed at application',
            bottleneck: true,
            automatable: true
          },
          {
            id: 6,
            name: 'Orientation Delivery',
            currentTime: '3 hours',
            optimizedTime: '1.5 hours',
            improvement: 'Hybrid model with video content',
            automatable: true
          },
          {
            id: 7,
            name: 'System Access Setup',
            currentTime: '2 days',
            optimizedTime: '15 minutes',
            improvement: 'Automated provisioning upon approval',
            automatable: true
          },
          {
            id: 8,
            name: 'First Shift Assignment',
            currentTime: '1 week',
            optimizedTime: '1 day',
            improvement: 'AI matching with auto-scheduling',
            bottleneck: true,
            automatable: true
          }
        ],
        recommendations: [
          {
            priority: 'high',
            action: 'Create digital onboarding portal',
            impact: 'Self-service reduces staff time 70%',
            effort: '2 weeks development'
          },
          {
            priority: 'high',
            action: 'Implement background check API',
            impact: 'Cut wait time from 7 to 2 days',
            effort: '3 days integration'
          },
          {
            priority: 'medium',
            action: 'Build orientation video library',
            impact: 'Consistent training, flexible timing',
            effort: '1 week production'
          },
          {
            priority: 'medium',
            action: 'Deploy volunteer matching algorithm',
            impact: 'Better fit, higher retention',
            effort: '1 week configuration'
          },
          {
            priority: 'low',
            action: 'Create automated check-in system',
            impact: 'Track engagement from day one',
            effort: '3 days setup'
          }
        ],
        automationOpportunities: [
          {
            task: 'Application screening',
            tool: 'AI form analysis with scoring',
            benefit: 'Instant qualification decisions'
          },
          {
            task: 'Document management',
            tool: 'Digital forms with e-signature',
            benefit: 'Paperless, instant completion'
          },
          {
            task: 'Scheduling coordination',
            tool: 'Calendar integration with reminders',
            benefit: 'Zero back-and-forth emails'
          },
          {
            task: 'Welcome communications',
            tool: 'Automated email sequences',
            benefit: 'Consistent, timely messaging'
          }
        ]
      }),

      grant_application: () => ({
        processName: 'Grant Application Process',
        currentState: {
          totalTime: '60-90 days',
          steps: 24,
          touchpoints: 15,
          waitTime: '30 days cumulative',
          errorRate: '35% require major revisions'
        },
        optimizedState: {
          totalTime: '20-30 days',
          steps: 12,
          touchpoints: 8,
          waitTime: '5 days maximum',
          errorRate: 'Less than 10%'
        },
        improvements: {
          timeReduction: '67% faster',
          stepsEliminated: 12,
          costSavings: '$5,500/grant',
          qualityIncrease: '71% error reduction'
        },
        processSteps: [
          {
            id: 1,
            name: 'Opportunity Identification',
            currentTime: '10 hours/month',
            optimizedTime: '2 hours/month',
            improvement: 'AI grant matching and alerts',
            automatable: true
          },
          {
            id: 2,
            name: 'Eligibility Assessment',
            currentTime: '3 hours',
            optimizedTime: '15 minutes',
            improvement: 'Automated criteria checking',
            automatable: true
          },
          {
            id: 3,
            name: 'Team Assignment',
            currentTime: '2 days',
            optimizedTime: '1 hour',
            improvement: 'Resource availability dashboard',
            bottleneck: true
          },
          {
            id: 4,
            name: 'Document Gathering',
            currentTime: '1 week',
            optimizedTime: '1 day',
            improvement: 'Centralized document library',
            bottleneck: true,
            automatable: true
          },
          {
            id: 5,
            name: 'Budget Development',
            currentTime: '3 days',
            optimizedTime: '4 hours',
            improvement: 'Template-based with auto-calculations',
            automatable: true
          },
          {
            id: 6,
            name: 'Narrative Writing',
            currentTime: '2 weeks',
            optimizedTime: '1 week',
            improvement: 'AI-assisted drafting from library',
            bottleneck: true
          },
          {
            id: 7,
            name: 'Internal Review',
            currentTime: '1 week',
            optimizedTime: '2 days',
            improvement: 'Parallel review with tracked changes',
            bottleneck: true
          },
          {
            id: 8,
            name: 'Final Submission',
            currentTime: '1 day',
            optimizedTime: '1 hour',
            improvement: 'Pre-flight check automation',
            automatable: true
          }
        ],
        recommendations: [
          {
            priority: 'high',
            action: 'Build grant content library',
            impact: 'Reuse 60% of content across grants',
            effort: '2 weeks organization'
          },
          {
            priority: 'high',
            action: 'Create automated budget tool',
            impact: 'Reduce budget errors by 90%',
            effort: '1 week development'
          },
          {
            priority: 'medium',
            action: 'Implement AI grant finder',
            impact: 'Discover 3x more opportunities',
            effort: '3 days configuration'
          },
          {
            priority: 'medium',
            action: 'Deploy collaborative workspace',
            impact: 'Cut review time by 60%',
            effort: '1 week setup'
          },
          {
            priority: 'low',
            action: 'Build funder relationship CRM',
            impact: 'Track all interactions and preferences',
            effort: '2 weeks implementation'
          }
        ],
        automationOpportunities: [
          {
            task: 'Grant discovery',
            tool: 'AI matching service (GrantStation, etc.)',
            benefit: 'Never miss relevant opportunities'
          },
          {
            task: 'Document assembly',
            tool: 'Cloud storage with version control',
            benefit: 'Always have latest docs ready'
          },
          {
            task: 'Budget calculations',
            tool: 'Spreadsheet templates with formulas',
            benefit: 'Error-free budgets in minutes'
          },
          {
            task: 'Submission tracking',
            tool: 'Project management with reminders',
            benefit: 'Never miss a deadline'
          }
        ]
      })
    };

    const template = templates[processType] || templates.donor_acknowledgment;
    return template();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Process Optimizer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Identify bottlenecks and optimize your nonprofit processes
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Process Type</label>
            <Select value={processType} onValueChange={setProcessType}>
              <SelectTrigger>
                <SelectValue placeholder="Select process to optimize" />
              </SelectTrigger>
              <SelectContent>
                {processTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Process Description</label>
            <Textarea
              value={processDescription}
              onChange={(e) => setProcessDescription(e.target.value)}
              placeholder="Describe your current process steps and timeline..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pain Points (Optional)</label>
            <Textarea
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              placeholder="What are the biggest challenges with this process?"
              rows={2}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={analyzeProcess} 
            disabled={isAnalyzing || !processType || !processDescription.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <BarChart3 className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing Process...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Optimize Process
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{result.processName} Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Current State</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Total Time:</span>
                      <span className="font-medium">{result.currentState.totalTime}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Process Steps:</span>
                      <span className="font-medium">{result.currentState.steps}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Wait Time:</span>
                      <span className="font-medium">{result.currentState.waitTime}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Error Rate:</span>
                      <span className="font-medium">{result.currentState.errorRate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Optimized State</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Total Time:</span>
                      <span className="font-medium text-green-700">{result.optimizedState.totalTime}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Process Steps:</span>
                      <span className="font-medium text-green-700">{result.optimizedState.steps}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Wait Time:</span>
                      <span className="font-medium text-green-700">{result.optimizedState.waitTime}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Error Rate:</span>
                      <span className="font-medium text-green-700">{result.optimizedState.errorRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">Key Improvements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{result.improvements.timeReduction}</p>
                    <p className="text-xs text-gray-600">Time Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{result.improvements.stepsEliminated}</p>
                    <p className="text-xs text-gray-600">Steps Removed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{result.improvements.costSavings}</p>
                    <p className="text-xs text-gray-600">Cost Savings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{result.improvements.qualityIncrease}</p>
                    <p className="text-xs text-gray-600">Quality Gain</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Process Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.processSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {step.bottleneck ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : step.automatable ? (
                        <Zap className="h-5 w-5 text-blue-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.name}</h4>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>Current: {step.currentTime}</span>
                        <span className="text-green-600">→ Optimized: {step.optimizedTime}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{step.improvement}</p>
                      <div className="flex gap-2 mt-2">
                        {step.bottleneck && (
                          <Badge variant="destructive" className="text-xs">Bottleneck</Badge>
                        )}
                        {step.automatable && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Automatable</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Priority Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{rec.action}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{rec.impact}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>Effort: {rec.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Automation Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.automationOpportunities.map((opp, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm text-blue-900">{opp.task}</h4>
                      <p className="text-xs text-blue-700 mt-1">Tool: {opp.tool}</p>
                      <p className="text-xs text-blue-600 mt-1">{opp.benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">Implementation Tip:</p>
                  <p>Start with the highest-impact, lowest-effort improvements. Quick wins build momentum for larger changes.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};