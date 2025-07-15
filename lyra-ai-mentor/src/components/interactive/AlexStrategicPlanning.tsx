import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Lightbulb, 
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Plus,
  ArrowRight,
  BarChart3,
  Map,
  Compass
} from 'lucide-react';

interface StrategicPlan {
  id: string;
  name: string;
  timeframe: string;
  vision: string;
  mission: string;
  values: string[];
  strategicGoals: StrategicGoal[];
  keyInitiatives: Initiative[];
  stakeholders: Stakeholder[];
  riskAssessment: Risk[];
  successMetrics: Metric[];
  status: 'draft' | 'in_review' | 'approved' | 'active';
  createdAt: Date;
  lastUpdated: Date;
}

interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  category: 'program' | 'operational' | 'financial' | 'organizational';
  priority: 'critical' | 'high' | 'medium' | 'low';
  targetDate: Date;
  owner: string;
  objectives: Objective[];
  dependencies: string[];
  budget: number;
  progress: number; // 0-100
}

interface Objective {
  id: string;
  title: string;
  description: string;
  measurable: boolean;
  target: string;
  deadline: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
}

interface Initiative {
  id: string;
  name: string;
  description: string;
  goals: string[]; // goal IDs
  timeline: { start: Date; end: Date };
  budget: number;
  resources: string[];
  lead: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
}

interface Stakeholder {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'beneficiary' | 'funder';
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  engagement: string;
  concerns: string[];
}

interface Risk {
  id: string;
  description: string;
  category: 'financial' | 'operational' | 'strategic' | 'compliance';
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
  owner: string;
}

interface Metric {
  id: string;
  name: string;
  description: string;
  type: 'quantitative' | 'qualitative';
  target: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  dataSource: string;
  responsible: string;
}

interface PlanningSession {
  id: string;
  type: 'visioning' | 'goal_setting' | 'swot_analysis' | 'stakeholder_mapping';
  status: 'scheduled' | 'in_progress' | 'completed';
  participants: string[];
  outcomes: string[];
  nextSteps: string[];
}

const AlexStrategicPlanning: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<StrategicPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'initiatives' | 'stakeholders' | 'risks'>('overview');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [plans, setPlans] = useState<StrategicPlan[]>([]);

  const samplePlans: StrategicPlan[] = [
    {
      id: 'strategic-plan-2024',
      name: '2024-2027 Strategic Plan',
      timeframe: '3 years',
      vision: 'To be the leading catalyst for educational equity and opportunity in our region, ensuring every child has access to quality learning experiences.',
      mission: 'We empower underserved communities through innovative educational programs, family support services, and advocacy for systemic change.',
      values: ['Equity', 'Innovation', 'Community', 'Collaboration', 'Excellence'],
      status: 'active',
      createdAt: new Date('2024-01-15'),
      lastUpdated: new Date(),
      strategicGoals: [
        {
          id: 'goal-1',
          title: 'Expand Educational Programs',
          description: 'Increase reach and impact of core educational programming',
          category: 'program',
          priority: 'critical',
          targetDate: new Date('2027-12-31'),
          owner: 'Program Director',
          progress: 45,
          budget: 750000,
          dependencies: ['funding-secured', 'staff-hired'],
          objectives: [
            {
              id: 'obj-1',
              title: 'Serve 500 additional students annually',
              description: 'Expand tutoring and mentoring programs to reach 500 more students',
              measurable: true,
              target: '500 students',
              deadline: new Date('2025-08-31'),
              status: 'in_progress'
            },
            {
              id: 'obj-2',
              title: 'Develop 3 new program locations',
              description: 'Establish satellite programs in underserved neighborhoods',
              measurable: true,
              target: '3 locations',
              deadline: new Date('2026-12-31'),
              status: 'not_started'
            }
          ]
        },
        {
          id: 'goal-2',
          title: 'Strengthen Organizational Capacity',
          description: 'Build sustainable infrastructure and capabilities',
          category: 'organizational',
          priority: 'high',
          targetDate: new Date('2026-12-31'),
          owner: 'Executive Director',
          progress: 30,
          budget: 400000,
          dependencies: ['board-approval', 'capital-campaign'],
          objectives: [
            {
              id: 'obj-3',
              title: 'Implement comprehensive data system',
              description: 'Deploy CRM and program management technology',
              measurable: true,
              target: 'System operational',
              deadline: new Date('2025-06-30'),
              status: 'in_progress'
            },
            {
              id: 'obj-4',
              title: 'Increase staff retention to 90%',
              description: 'Improve compensation and professional development',
              measurable: true,
              target: '90% retention',
              deadline: new Date('2025-12-31'),
              status: 'not_started'
            }
          ]
        },
        {
          id: 'goal-3',
          title: 'Diversify Revenue Streams',
          description: 'Reduce dependence on single funding sources',
          category: 'financial',
          priority: 'high',
          targetDate: new Date('2027-12-31'),
          owner: 'Development Director',
          progress: 25,
          budget: 200000,
          dependencies: ['fundraising-plan', 'board-engagement'],
          objectives: [
            {
              id: 'obj-5',
              title: 'Launch social enterprise',
              description: 'Develop fee-for-service training programs',
              measurable: true,
              target: '$100K annual revenue',
              deadline: new Date('2026-12-31'),
              status: 'not_started'
            }
          ]
        }
      ],
      keyInitiatives: [
        {
          id: 'init-1',
          name: 'Digital Learning Platform',
          description: 'Develop online tutoring and mentoring platform',
          goals: ['goal-1'],
          timeline: { start: new Date('2024-09-01'), end: new Date('2025-08-31') },
          budget: 250000,
          resources: ['Software developers', 'Educational consultants', 'User testing'],
          lead: 'Technology Director',
          status: 'active'
        },
        {
          id: 'init-2',
          name: 'Capital Campaign',
          description: 'Raise $2M for facility expansion and capacity building',
          goals: ['goal-2', 'goal-3'],
          timeline: { start: new Date('2024-06-01'), end: new Date('2026-05-31') },
          budget: 150000,
          resources: ['Fundraising consultant', 'Board committees', 'Marketing materials'],
          lead: 'Executive Director',
          status: 'active'
        }
      ],
      stakeholders: [
        {
          id: 'stakeholder-1',
          name: 'Students and Families',
          type: 'beneficiary',
          influence: 'medium',
          interest: 'high',
          engagement: 'Direct service recipients and program participants',
          concerns: ['Program accessibility', 'Cultural relevance', 'Transportation']
        },
        {
          id: 'stakeholder-2',
          name: 'Board of Directors',
          type: 'internal',
          influence: 'high',
          interest: 'high',
          engagement: 'Governance oversight and strategic guidance',
          concerns: ['Financial sustainability', 'Risk management', 'Community impact']
        },
        {
          id: 'stakeholder-3',
          name: 'Foundation Partners',
          type: 'funder',
          influence: 'high',
          interest: 'medium',
          engagement: 'Grant funding and capacity building support',
          concerns: ['Measurable outcomes', 'Financial accountability', 'Innovation']
        }
      ],
      riskAssessment: [
        {
          id: 'risk-1',
          description: 'Loss of major funding source',
          category: 'financial',
          probability: 'medium',
          impact: 'high',
          mitigation: 'Diversify funding portfolio and build 6-month reserve',
          owner: 'Development Director'
        },
        {
          id: 'risk-2',
          description: 'Staff burnout and turnover',
          category: 'operational',
          probability: 'medium',
          impact: 'medium',
          mitigation: 'Improve compensation, workload management, and support systems',
          owner: 'HR Manager'
        }
      ],
      successMetrics: [
        {
          id: 'metric-1',
          name: 'Student Academic Improvement',
          description: 'Percentage of students showing grade-level progress',
          type: 'quantitative',
          target: '75% of students improve by 1+ grade levels',
          frequency: 'quarterly',
          dataSource: 'Academic assessments',
          responsible: 'Program Manager'
        },
        {
          id: 'metric-2',
          name: 'Financial Sustainability Ratio',
          description: 'Ratio of diversified to total revenue',
          type: 'quantitative',
          target: '60% diversified revenue by 2027',
          frequency: 'annual',
          dataSource: 'Financial statements',
          responsible: 'CFO'
        }
      ]
    }
  ];

  React.useEffect(() => {
    if (plans.length === 0) {
      setPlans(samplePlans);
    }
  }, []);

  const generateStrategicInsights = async () => {
    setIsGeneratingInsights(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const insights = {
      strengths: [
        'Strong community partnerships and stakeholder engagement',
        'Clear mission alignment with current programming',
        'Experienced leadership team with proven track record'
      ],
      opportunities: [
        'Growing demand for educational support services',
        'Potential for technology-enhanced program delivery',
        'Corporate partnership opportunities in region'
      ],
      threats: [
        'Increasing competition for foundation funding',
        'Economic uncertainty affecting donor capacity',
        'Regulatory changes in education sector'
      ],
      recommendations: [
        'Accelerate digital platform development for competitive advantage',
        'Strengthen board fundraising capacity through training',
        'Develop earned revenue streams to reduce grant dependence'
      ]
    };
    
    console.log('Strategic insights generated:', insights);
    setIsGeneratingInsights(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'program': return 'text-blue-600 bg-blue-100';
      case 'operational': return 'text-green-600 bg-green-100';
      case 'financial': return 'text-purple-600 bg-purple-100';
      case 'organizational': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'at_risk': return 'text-red-600 bg-red-100';
      case 'on_hold': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Compass className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Strategic Planning Suite</CardTitle>
              <CardDescription>
                AI-powered strategic planning with collaborative tools and performance tracking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentPlan ? (
            /* Plan Overview */
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{plans.length}</div>
                    <div className="text-sm text-gray-600">Strategic Plans</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {plans.reduce((sum, p) => sum + p.strategicGoals.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Active Goals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {plans.reduce((sum, p) => sum + p.keyInitiatives.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Key Initiatives</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {plans.reduce((sum, p) => 
                        sum + p.strategicGoals.reduce((goalSum, g) => goalSum + g.progress, 0) / p.strategicGoals.length, 0
                      ).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Progress</div>
                  </CardContent>
                </Card>
              </div>

              {/* Plan Cards */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Strategic Plans</CardTitle>
                      <CardDescription>Your organization's strategic planning portfolio</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={generateStrategicInsights}
                        disabled={isGeneratingInsights}
                        variant="outline"
                      >
                        {isGeneratingInsights ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Generate Insights
                          </>
                        )}
                      </Button>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Plan
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans.map((plan) => {
                    const avgProgress = plan.strategicGoals.reduce((sum, goal) => sum + goal.progress, 0) / plan.strategicGoals.length;
                    const activeGoals = plan.strategicGoals.filter(g => g.progress < 100).length;
                    
                    return (
                      <div key={plan.id} 
                           className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                           onClick={() => setCurrentPlan(plan)}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{plan.name}</h4>
                            <p className="text-gray-600">{plan.timeframe} strategic roadmap</p>
                          </div>
                          <Badge className={getStatusColor(plan.status)} variant="secondary">
                            {plan.status}
                          </Badge>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded mb-4">
                          <div className="text-sm font-medium text-blue-800 mb-1">Vision:</div>
                          <div className="text-sm text-blue-700">{plan.vision}</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-600">{plan.strategicGoals.length}</div>
                            <div className="text-xs text-purple-600">Strategic Goals</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-600">{activeGoals}</div>
                            <div className="text-xs text-green-600">Active Goals</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{plan.keyInitiatives.length}</div>
                            <div className="text-xs text-blue-600">Initiatives</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <div className="text-lg font-bold text-orange-600">{Math.round(avgProgress)}%</div>
                            <div className="text-xs text-orange-600">Progress</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Last updated: {plan.lastUpdated.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={avgProgress} className="w-20 h-2" />
                            <Button size="sm" variant="outline">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Plan Detail */
            <div className="space-y-6">
              {/* Plan Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentPlan.name}</CardTitle>
                      <CardDescription>{currentPlan.timeframe} strategic plan</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentPlan(null)}>
                      Back to Plans
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'goals', label: 'Goals', icon: Target },
                  { id: 'initiatives', label: 'Initiatives', icon: TrendingUp },
                  { id: 'stakeholders', label: 'Stakeholders', icon: Users },
                  { id: 'risks', label: 'Risks', icon: AlertTriangle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vision & Mission */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vision & Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">Vision</h4>
                        <p className="text-sm text-gray-700">{currentPlan.vision}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">Mission</h4>
                        <p className="text-sm text-gray-700">{currentPlan.mission}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">Values</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentPlan.values.map((value, index) => (
                            <Badge key={index} variant="outline">{value}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentPlan.strategicGoals.map((goal) => (
                          <div key={goal.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{goal.title}</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-4">
                  {currentPlan.strategicGoals.map((goal) => (
                    <Card key={goal.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <CardDescription>{goal.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getCategoryColor(goal.category)} variant="secondary">
                              {goal.category}
                            </Badge>
                            <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Progress & Timeline</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>Overall Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-3" />
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Target Date:</span> {goal.targetDate.toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Owner:</span> {goal.owner}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Budget:</span> ${goal.budget.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Key Objectives</h4>
                            <div className="space-y-2">
                              {goal.objectives.map((objective) => (
                                <div key={objective.id} className="border rounded p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={getStatusColor(objective.status)} variant="secondary">
                                      {objective.status.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-sm font-medium">{objective.title}</span>
                                  </div>
                                  <div className="text-xs text-gray-600 mb-1">{objective.description}</div>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Target: {objective.target}</span>
                                    <span>Due: {objective.deadline.toLocaleDateString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'initiatives' && (
                <div className="space-y-4">
                  {currentPlan.keyInitiatives.map((initiative) => (
                    <Card key={initiative.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{initiative.name}</h4>
                            <p className="text-gray-600">{initiative.description}</p>
                          </div>
                          <Badge className={getStatusColor(initiative.status)} variant="secondary">
                            {initiative.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium text-sm">Timeline:</span>
                              <div className="text-sm text-gray-600">
                                {initiative.timeline.start.toLocaleDateString()} - {initiative.timeline.end.toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-sm">Budget:</span>
                              <div className="text-sm text-gray-600">${initiative.budget.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="font-medium text-sm">Lead:</span>
                              <div className="text-sm text-gray-600">{initiative.lead}</div>
                            </div>
                          </div>
                          
                          <div>
                            <span className="font-medium text-sm">Resources Needed:</span>
                            <div className="mt-1 space-y-1">
                              {initiative.resources.map((resource, index) => (
                                <div key={index} className="text-sm text-gray-600">• {resource}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'stakeholders' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.stakeholders.map((stakeholder) => (
                    <Card key={stakeholder.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{stakeholder.name}</h4>
                          <Badge variant="outline">{stakeholder.type}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-xs font-medium text-gray-600">Influence</span>
                            <Badge className={getRiskColor(stakeholder.influence)} variant="secondary">
                              {stakeholder.influence}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-600">Interest</span>
                            <Badge className={getRiskColor(stakeholder.interest)} variant="secondary">
                              {stakeholder.interest}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs font-medium text-gray-600">Engagement</div>
                            <div className="text-sm">{stakeholder.engagement}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-600">Key Concerns</div>
                            <ul className="text-sm space-y-1">
                              {stakeholder.concerns.map((concern, index) => (
                                <li key={index}>• {concern}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-4">
                  {currentPlan.riskAssessment.map((risk) => (
                    <Card key={risk.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{risk.description}</h4>
                            <div className="flex gap-2 mb-3">
                              <Badge variant="outline">{risk.category}</Badge>
                              <Badge className={getRiskColor(risk.probability)} variant="secondary">
                                {risk.probability} probability
                              </Badge>
                              <Badge className={getRiskColor(risk.impact)} variant="secondary">
                                {risk.impact} impact
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-sm font-medium text-blue-800 mb-1">Mitigation Strategy:</div>
                          <div className="text-sm text-blue-700">{risk.mitigation}</div>
                          <div className="text-xs text-blue-600 mt-2">Owner: {risk.owner}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Strategic Planning Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Strategic Planning Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Planning:</h4>
                  <ul className="space-y-1">
                    <li>• Start with clear vision and mission alignment</li>
                    <li>• Involve stakeholders in goal-setting process</li>
                    <li>• Set SMART objectives with measurable outcomes</li>
                    <li>• Build in regular review and adjustment cycles</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Implementation Success:</h4>
                  <ul className="space-y-1">
                    <li>• Assign clear ownership and accountability</li>
                    <li>• Break large goals into manageable milestones</li>
                    <li>• Communicate progress regularly to all stakeholders</li>
                    <li>• Celebrate achievements and learn from setbacks</li>
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

export default AlexStrategicPlanning;