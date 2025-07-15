import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Settings,
  Clock,
  Users,
  Target,
  TrendingUp,
  X,
  Search,
  FileText,
  BarChart3
} from 'lucide-react';

interface ValidationCheck {
  id: string;
  category: 'efficiency' | 'compliance' | 'quality' | 'user_experience';
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  recommendation?: string;
  details?: string;
}

interface WorkflowValidation {
  id: string;
  workflowName: string;
  description: string;
  validationDate: Date;
  overallScore: number;
  checks: ValidationCheck[];
  passedChecks: number;
  totalChecks: number;
  recommendations: string[];
}

interface QuickCheck {
  id: string;
  title: string;
  question: string;
  category: 'process' | 'tools' | 'people' | 'outcomes';
  weight: number;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const RachelWorkflowValidator: React.FC = () => {
  const [currentValidation, setCurrentValidation] = useState<WorkflowValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<Record<string, string>>({});
  const [selectedWorkflow, setSelectedWorkflow] = useState('');

  const quickChecks: QuickCheck[] = [
    {
      id: 'process-clarity',
      title: 'Process Clarity',
      question: 'How clear are the steps in this workflow to new team members?',
      category: 'process',
      weight: 0.2,
      options: [
        { value: 'very-clear', label: 'Very clear - anyone can follow', score: 100 },
        { value: 'mostly-clear', label: 'Mostly clear with minimal guidance', score: 75 },
        { value: 'somewhat-clear', label: 'Some explanation needed', score: 50 },
        { value: 'unclear', label: 'Requires significant training', score: 25 }
      ]
    },
    {
      id: 'time-efficiency',
      title: 'Time Efficiency',
      question: 'How much time does this workflow take compared to similar processes?',
      category: 'process',
      weight: 0.25,
      options: [
        { value: 'very-fast', label: 'Much faster than expected', score: 100 },
        { value: 'fast', label: 'Faster than average', score: 75 },
        { value: 'average', label: 'About average time', score: 50 },
        { value: 'slow', label: 'Takes longer than it should', score: 25 }
      ]
    },
    {
      id: 'error-rate',
      title: 'Error Prevention',
      question: 'How often do errors or mistakes occur in this workflow?',
      category: 'quality',
      weight: 0.2,
      options: [
        { value: 'never', label: 'Rarely or never', score: 100 },
        { value: 'occasionally', label: 'Occasionally (< 5%)', score: 75 },
        { value: 'sometimes', label: 'Sometimes (5-15%)', score: 50 },
        { value: 'frequently', label: 'Frequently (> 15%)', score: 25 }
      ]
    },
    {
      id: 'tool-integration',
      title: 'Tool Integration',
      question: 'How well do the tools and systems work together in this workflow?',
      category: 'tools',
      weight: 0.15,
      options: [
        { value: 'seamless', label: 'Seamlessly integrated', score: 100 },
        { value: 'mostly-smooth', label: 'Mostly smooth transitions', score: 75 },
        { value: 'some-friction', label: 'Some manual handoffs needed', score: 50 },
        { value: 'disconnected', label: 'Lots of manual work between tools', score: 25 }
      ]
    },
    {
      id: 'user-satisfaction',
      title: 'User Satisfaction',
      question: 'How satisfied are people who use this workflow?',
      category: 'people',
      weight: 0.2,
      options: [
        { value: 'very-satisfied', label: 'Very satisfied - love using it', score: 100 },
        { value: 'satisfied', label: 'Generally satisfied', score: 75 },
        { value: 'neutral', label: 'Neutral - gets the job done', score: 50 },
        { value: 'frustrated', label: 'Often frustrated or annoyed', score: 25 }
      ]
    }
  ];

  const sampleWorkflows = [
    'Donor Management Process',
    'Volunteer Onboarding',
    'Event Planning Workflow',
    'Grant Application Process',
    'Monthly Reporting',
    'Program Registration',
    'Custom Workflow'
  ];

  const validateWorkflow = async () => {
    if (!selectedWorkflow) return;
    
    setIsValidating(true);
    
    // Calculate overall score from quick checks
    let totalScore = 0;
    let totalWeight = 0;
    
    quickChecks.forEach(check => {
      const answer = quickCheckAnswers[check.id];
      if (answer) {
        const option = check.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.score * check.weight;
          totalWeight += check.weight;
        }
      }
    });
    
    const overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    
    // Simulate detailed validation checks
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const checks: ValidationCheck[] = [
      {
        id: 'step-documentation',
        category: 'quality',
        name: 'Step Documentation',
        description: 'All workflow steps are clearly documented',
        severity: 'high',
        status: overallScore > 70 ? 'pass' : 'warning',
        recommendation: overallScore <= 70 ? 'Create detailed step-by-step documentation with screenshots' : undefined
      },
      {
        id: 'role-clarity',
        category: 'user_experience',
        name: 'Role Clarity',
        description: 'Responsibilities are clearly defined for each step',
        severity: 'medium',
        status: overallScore > 60 ? 'pass' : 'fail',
        recommendation: overallScore <= 60 ? 'Define clear ownership and responsibilities for each workflow step' : undefined
      },
      {
        id: 'error-handling',
        category: 'quality',
        name: 'Error Handling',
        description: 'Process includes error handling and recovery procedures',
        severity: 'high',
        status: overallScore > 75 ? 'pass' : 'warning',
        recommendation: overallScore <= 75 ? 'Add error handling procedures and rollback steps' : undefined
      },
      {
        id: 'time-tracking',
        category: 'efficiency',
        name: 'Time Tracking',
        description: 'Workflow includes time estimates and tracking',
        severity: 'medium',
        status: overallScore > 65 ? 'pass' : 'warning',
        recommendation: overallScore <= 65 ? 'Add time estimates for each step and track actual completion times' : undefined
      },
      {
        id: 'automation-opportunities',
        category: 'efficiency',
        name: 'Automation Opportunities',
        description: 'Manual steps that could be automated are identified',
        severity: 'medium',
        status: overallScore > 70 ? 'pass' : 'warning',
        recommendation: overallScore <= 70 ? 'Review workflow for repetitive tasks that could be automated' : undefined
      },
      {
        id: 'stakeholder-approval',
        category: 'compliance',
        name: 'Stakeholder Approval',
        description: 'Key stakeholders have reviewed and approved the workflow',
        severity: 'high',
        status: overallScore > 80 ? 'pass' : 'fail',
        recommendation: overallScore <= 80 ? 'Get formal approval from all stakeholders before implementing' : undefined
      },
      {
        id: 'feedback-mechanism',
        category: 'user_experience',
        name: 'Feedback Mechanism',
        description: 'Process includes way to collect and incorporate feedback',
        severity: 'low',
        status: overallScore > 60 ? 'pass' : 'warning',
        recommendation: overallScore <= 60 ? 'Add regular feedback collection and review cycles' : undefined
      },
      {
        id: 'compliance-check',
        category: 'compliance',
        name: 'Compliance Requirements',
        description: 'Workflow meets all relevant regulatory and organizational requirements',
        severity: 'critical',
        status: overallScore > 85 ? 'pass' : 'fail',
        recommendation: overallScore <= 85 ? 'Review compliance requirements and update workflow accordingly' : undefined
      }
    ];
    
    const passedChecks = checks.filter(check => check.status === 'pass').length;
    
    const recommendations = [
      'Document all workflow steps with clear instructions',
      'Implement regular review cycles for continuous improvement',
      'Add automation where possible to reduce manual effort',
      'Create feedback loops with workflow users',
      'Set up performance metrics and monitoring'
    ];
    
    const validation: WorkflowValidation = {
      id: Date.now().toString(),
      workflowName: selectedWorkflow,
      description: `Validation assessment for ${selectedWorkflow}`,
      validationDate: new Date(),
      overallScore,
      checks,
      passedChecks,
      totalChecks: checks.length,
      recommendations
    };
    
    setCurrentValidation(validation);
    setIsValidating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return CheckCircle2;
      case 'fail': return X;
      case 'warning': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'efficiency': return 'text-blue-600 bg-blue-100';
      case 'compliance': return 'text-purple-600 bg-purple-100';
      case 'quality': return 'text-green-600 bg-green-100';
      case 'user_experience': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Workflow Validator</CardTitle>
              <CardDescription>
                Quick verification to ensure your workflows are optimized and compliant
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentValidation ? (
            /* Validation Setup */
            <div className="space-y-6">
              {/* Workflow Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Workflow to Validate</CardTitle>
                  <CardDescription>Choose the workflow you want to assess</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sampleWorkflows.map((workflow) => (
                      <Button
                        key={workflow}
                        variant={selectedWorkflow === workflow ? "default" : "outline"}
                        className="justify-start h-auto p-3"
                        onClick={() => setSelectedWorkflow(workflow)}
                      >
                        {workflow}
                      </Button>
                    ))}
                  </div>
                  {selectedWorkflow === 'Custom Workflow' && (
                    <div className="mt-4">
                      <Input
                        placeholder="Enter custom workflow name..."
                        value={selectedWorkflow === 'Custom Workflow' ? '' : selectedWorkflow}
                        onChange={(e) => setSelectedWorkflow(e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Assessment */}
              {selectedWorkflow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Assessment</CardTitle>
                    <CardDescription>
                      Answer these questions about "{selectedWorkflow}" to help validate the workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {quickChecks.map((check) => (
                      <div key={check.id} className="space-y-3">
                        <div>
                          <h4 className="font-medium">{check.title}</h4>
                          <p className="text-sm text-gray-600">{check.question}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {check.options.map((option) => (
                            <Button
                              key={option.value}
                              variant={quickCheckAnswers[check.id] === option.value ? "default" : "outline"}
                              className="justify-start h-auto p-3 text-left"
                              onClick={() => setQuickCheckAnswers(prev => ({
                                ...prev,
                                [check.id]: option.value
                              }))}
                            >
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs opacity-70">Score: {option.score}/100</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      onClick={validateWorkflow}
                      disabled={isValidating || Object.keys(quickCheckAnswers).length < quickChecks.length}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isValidating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Validating Workflow...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Validate Workflow
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Validation Results */
            <div className="space-y-6">
              {/* Validation Summary */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-purple-800">
                        Validation Results: {currentValidation.workflowName}
                      </CardTitle>
                      <CardDescription className="text-purple-600">
                        Completed on {currentValidation.validationDate.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentValidation(null)}>
                      New Validation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(currentValidation.overallScore)}`}>
                        {currentValidation.overallScore}%
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentValidation.passedChecks}</div>
                      <div className="text-sm text-gray-600">Checks Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentValidation.totalChecks}</div>
                      <div className="text-sm text-gray-600">Total Checks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((currentValidation.passedChecks / currentValidation.totalChecks) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Pass Rate</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Progress 
                      value={(currentValidation.passedChecks / currentValidation.totalChecks) * 100} 
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Check Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Check Results</CardTitle>
                  <CardDescription>Individual assessment of workflow components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentValidation.checks.map((check) => {
                    const StatusIcon = getStatusIcon(check.status);
                    
                    return (
                      <div key={check.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <StatusIcon className={`w-5 h-5 ${getStatusColor(check.status)}`} />
                            <div>
                              <h4 className="font-semibold">{check.name}</h4>
                              <p className="text-sm text-gray-600">{check.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getCategoryColor(check.category)} variant="secondary">
                              {check.category.replace('_', ' ')}
                            </Badge>
                            <Badge className={getSeverityColor(check.severity)} variant="secondary">
                              {check.severity}
                            </Badge>
                          </div>
                        </div>
                        
                        {check.recommendation && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <h5 className="font-medium text-yellow-800 mb-1">Recommendation:</h5>
                            <p className="text-sm text-yellow-700">{check.recommendation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Improvement Recommendations</CardTitle>
                  <CardDescription>Prioritized actions to enhance workflow performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentValidation.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-blue-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Score Breakdown</CardTitle>
                  <CardDescription>How your workflow performed in each category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['efficiency', 'compliance', 'quality', 'user_experience'].map((category) => {
                      const categoryChecks = currentValidation.checks.filter(check => check.category === category);
                      const passed = categoryChecks.filter(check => check.status === 'pass').length;
                      const total = categoryChecks.length;
                      const score = total > 0 ? Math.round((passed / total) * 100) : 0;
                      
                      return (
                        <div key={category} className="p-4 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize">{category.replace('_', ' ')}</h4>
                            <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                          </div>
                          <Progress value={score} className="h-2 mb-2" />
                          <div className="text-sm text-gray-600">
                            {passed} of {total} checks passed
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Validation Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Validation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Validation:</h4>
                  <ul className="space-y-1">
                    <li>• Test workflows with actual users</li>
                    <li>• Document all edge cases and exceptions</li>
                    <li>• Validate with different skill levels</li>
                    <li>• Check compliance requirements thoroughly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Issues:</h4>
                  <ul className="space-y-1">
                    <li>• Unclear step descriptions</li>
                    <li>• Missing error handling procedures</li>
                    <li>• Inadequate user training materials</li>
                    <li>• No feedback collection mechanism</li>
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

export default RachelWorkflowValidator;