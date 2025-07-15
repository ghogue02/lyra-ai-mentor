import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  category: 'culture' | 'operations' | 'financial' | 'governance' | 'impact';
  description: string;
  currentScore: number; // 1-100 scale
  previousScore: number;
  benchmark: number; // industry benchmark
  target: number;
  trend: 'improving' | 'declining' | 'stable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dataPoints: MetricDataPoint[];
  recommendations: string[];
  lastUpdated: Date;
}

interface MetricDataPoint {
  date: Date;
  value: number;
  note?: string;
}

interface HealthAssessment {
  id: string;
  name: string;
  date: Date;
  overallScore: number;
  metrics: HealthMetric[];
  keyFindings: string[];
  criticalIssues: string[];
  recommendations: AssessmentRecommendation[];
  assessor: string;
  methodology: string;
}

interface AssessmentRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  responsibleParty: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred';
}

interface HealthDashboard {
  organizationName: string;
  assessmentDate: Date;
  overallHealthScore: number;
  categoryScores: {
    culture: number;
    operations: number;
    financial: number;
    governance: number;
    impact: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  topStrengths: string[];
  topConcerns: string[];
  trendAnalysis: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
}

const AlexOrganizationalHealth: React.FC = () => {
  const [currentAssessment, setCurrentAssessment] = useState<HealthAssessment | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'metrics' | 'recommendations' | 'trends'>('dashboard');
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [healthDashboard, setHealthDashboard] = useState<HealthDashboard | null>(null);

  const sampleHealthDashboard: HealthDashboard = {
    organizationName: 'Community Impact Foundation',
    assessmentDate: new Date(),
    overallHealthScore: 78,
    categoryScores: {
      culture: 82,
      operations: 75,
      financial: 71,
      governance: 85,
      impact: 79
    },
    riskLevel: 'medium',
    topStrengths: [
      'Strong board governance and oversight',
      'High employee engagement and satisfaction',
      'Clear mission alignment across programs',
      'Effective community partnerships',
      'Transparent financial reporting'
    ],
    topConcerns: [
      'Limited diversification of funding sources',
      'Technology infrastructure needs updating',
      'Staff retention challenges in key positions',
      'Need for improved data collection systems',
      'Succession planning gaps in leadership'
    ],
    trendAnalysis: {
      improving: ['Staff satisfaction', 'Community engagement', 'Program outcomes'],
      declining: ['Donor retention rate', 'Operational efficiency'],
      stable: ['Financial reserves', 'Board effectiveness', 'Volunteer engagement']
    }
  };

  const sampleMetrics: HealthMetric[] = [
    {
      id: 'employee-engagement',
      name: 'Employee Engagement Score',
      category: 'culture',
      description: 'Overall satisfaction and engagement of staff members',
      currentScore: 82,
      previousScore: 78,
      benchmark: 75,
      target: 85,
      trend: 'improving',
      priority: 'high',
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date('2023-12-01'), value: 78 },
        { date: new Date('2024-03-01'), value: 80 },
        { date: new Date('2024-06-01'), value: 82 }
      ],
      recommendations: [
        'Continue professional development programs',
        'Implement flexible work arrangements',
        'Enhance recognition and reward systems'
      ]
    },
    {
      id: 'financial-sustainability',
      name: 'Financial Sustainability Index',
      category: 'financial',
      description: 'Overall financial health and sustainability indicators',
      currentScore: 71,
      previousScore: 73,
      benchmark: 80,
      target: 85,
      trend: 'declining',
      priority: 'critical',
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date('2023-12-01'), value: 73 },
        { date: new Date('2024-03-01'), value: 72 },
        { date: new Date('2024-06-01'), value: 71 }
      ],
      recommendations: [
        'Diversify revenue streams',
        'Increase earned income opportunities',
        'Strengthen major donor relationships',
        'Improve cost management practices'
      ]
    },
    {
      id: 'operational-efficiency',
      name: 'Operational Efficiency Score',
      category: 'operations',
      description: 'Effectiveness of internal processes and systems',
      currentScore: 75,
      previousScore: 77,
      benchmark: 78,
      target: 82,
      trend: 'declining',
      priority: 'medium',
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date('2023-12-01'), value: 77 },
        { date: new Date('2024-03-01'), value: 76 },
        { date: new Date('2024-06-01'), value: 75 }
      ],
      recommendations: [
        'Automate routine administrative tasks',
        'Implement project management software',
        'Streamline approval processes',
        'Upgrade technology infrastructure'
      ]
    },
    {
      id: 'program-impact',
      name: 'Program Impact Effectiveness',
      category: 'impact',
      description: 'Measurement of program outcomes and community impact',
      currentScore: 79,
      previousScore: 76,
      benchmark: 74,
      target: 85,
      trend: 'improving',
      priority: 'high',
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date('2023-12-01'), value: 76 },
        { date: new Date('2024-03-01'), value: 78 },
        { date: new Date('2024-06-01'), value: 79 }
      ],
      recommendations: [
        'Expand data collection on long-term outcomes',
        'Implement participant feedback systems',
        'Develop impact measurement dashboard',
        'Share success stories more broadly'
      ]
    },
    {
      id: 'governance-effectiveness',
      name: 'Board Governance Effectiveness',
      category: 'governance',
      description: 'Quality of board oversight and governance practices',
      currentScore: 85,
      previousScore: 84,
      benchmark: 79,
      target: 88,
      trend: 'improving',
      priority: 'medium',
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date('2023-12-01'), value: 84 },
        { date: new Date('2024-03-01'), value: 85 },
        { date: new Date('2024-06-01'), value: 85 }
      ],
      recommendations: [
        'Enhance board member orientation',
        'Increase board diversity',
        'Improve committee effectiveness',
        'Strengthen strategic oversight'
      ]
    }
  ];

  React.useEffect(() => {
    if (!healthDashboard) {
      setHealthDashboard(sampleHealthDashboard);
    }
  }, []);

  const generateHealthAssessment = async () => {
    setIsGeneratingAssessment(true);
    
    // Simulate assessment generation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const newAssessment: HealthAssessment = {
      id: `assessment-${Date.now()}`,
      name: 'Comprehensive Organizational Health Assessment',
      date: new Date(),
      overallScore: healthDashboard?.overallHealthScore || 78,
      metrics: sampleMetrics,
      keyFindings: [
        'Organization demonstrates strong governance and cultural health',
        'Financial sustainability requires immediate attention and diversification',
        'Operational efficiency declining due to outdated technology systems',
        'Program impact shows positive trends with room for enhanced measurement',
        'Employee engagement above industry benchmark with continued improvement'
      ],
      criticalIssues: [
        'Over-reliance on single funding source creating financial vulnerability',
        'Technology infrastructure limitations affecting productivity',
        'Leadership succession planning needs immediate development'
      ],
      recommendations: [
        {
          id: 'diversify-funding',
          title: 'Implement Revenue Diversification Strategy',
          description: 'Develop comprehensive plan to reduce dependency on single funding source',
          category: 'financial',
          priority: 'critical',
          timeframe: 'immediate',
          effort: 'high',
          impact: 'high',
          responsibleParty: 'Executive Director & Development Team',
          status: 'not_started'
        },
        {
          id: 'tech-upgrade',
          title: 'Technology Infrastructure Modernization',
          description: 'Upgrade core technology systems to improve operational efficiency',
          category: 'operations',
          priority: 'high',
          timeframe: 'short_term',
          effort: 'medium',
          impact: 'high',
          responsibleParty: 'IT Manager & Operations Director',
          status: 'not_started'
        },
        {
          id: 'succession-planning',
          title: 'Leadership Succession Planning',
          description: 'Develop comprehensive succession plans for key leadership positions',
          category: 'governance',
          priority: 'high',
          timeframe: 'medium_term',
          effort: 'medium',
          impact: 'high',
          responsibleParty: 'Board & HR Committee',
          status: 'not_started'
        }
      ],
      assessor: 'Organizational Health Consultant',
      methodology: 'Multi-stakeholder assessment including staff surveys, financial analysis, board interviews, and program evaluation'
    };
    
    setCurrentAssessment(newAssessment);
    setIsGeneratingAssessment(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'culture': return 'text-blue-600 bg-blue-100';
      case 'operations': return 'text-green-600 bg-green-100';
      case 'financial': return 'text-purple-600 bg-purple-100';
      case 'governance': return 'text-orange-600 bg-orange-100';
      case 'impact': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      case 'stable': return Activity;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthIcon = (category: string) => {
    switch (category) {
      case 'culture': return Users;
      case 'operations': return Zap;
      case 'financial': return DollarSign;
      case 'governance': return Shield;
      case 'impact': return Target;
      default: return Heart;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Organizational Health Monitor</CardTitle>
              <CardDescription>
                Comprehensive assessment of organizational wellness and performance indicators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentAssessment ? (
            /* Health Dashboard */
            <div className="space-y-6">
              {/* Overall Health Score */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-purple-800">
                        Overall Health Score: {healthDashboard?.organizationName}
                      </CardTitle>
                      <CardDescription className="text-purple-600">
                        Last assessed: {healthDashboard?.assessmentDate.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(healthDashboard?.overallHealthScore || 0)}`}>
                        {healthDashboard?.overallHealthScore}/100
                      </div>
                      <Badge className={getRiskColor(healthDashboard?.riskLevel || 'medium')} variant="secondary">
                        {healthDashboard?.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Category Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health by Category</CardTitle>
                  <CardDescription>Detailed breakdown of organizational health indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {healthDashboard && Object.entries(healthDashboard.categoryScores).map(([category, score]) => {
                      const Icon = getHealthIcon(category);
                      return (
                        <div key={category} className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                            <Icon className={`w-6 h-6 ${getScoreColor(score)}`} />
                          </div>
                          <div className={`text-xl font-bold ${getScoreColor(score)}`}>{score}</div>
                          <div className="text-sm text-gray-600 capitalize">{category}</div>
                          <Progress value={score} className="h-2 mt-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths and Concerns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">Top Strengths</CardTitle>
                    <CardDescription>Areas where the organization excels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {healthDashboard?.topStrengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">Areas of Concern</CardTitle>
                    <CardDescription>Issues requiring attention and improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {healthDashboard?.topConcerns.map((concern, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Trend Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trend Analysis</CardTitle>
                  <CardDescription>How different areas are changing over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Improving
                      </h4>
                      <ul className="space-y-2">
                        {healthDashboard?.trendAnalysis.improving.map((item, index) => (
                          <li key={index} className="text-sm text-green-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Declining
                      </h4>
                      <ul className="space-y-2">
                        {healthDashboard?.trendAnalysis.declining.map((item, index) => (
                          <li key={index} className="text-sm text-red-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Stable
                      </h4>
                      <ul className="space-y-2">
                        {healthDashboard?.trendAnalysis.stable.map((item, index) => (
                          <li key={index} className="text-sm text-blue-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Assessment Button */}
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-semibold mb-4">Generate Detailed Assessment</h3>
                  <p className="text-gray-600 mb-6">
                    Get a comprehensive organizational health assessment with detailed recommendations
                  </p>
                  <Button 
                    onClick={generateHealthAssessment}
                    disabled={isGeneratingAssessment}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGeneratingAssessment ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating Assessment...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Assessment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Assessment Results */
            <div className="space-y-6">
              {/* Assessment Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentAssessment.name}</CardTitle>
                      <CardDescription>
                        Conducted on {currentAssessment.date.toLocaleDateString()} by {currentAssessment.assessor}
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentAssessment(null)}>
                      Back to Dashboard
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(currentAssessment.overallScore)}`}>
                      Overall Score: {currentAssessment.overallScore}/100
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Key Findings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {currentAssessment.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Critical Issues */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-800">Critical Issues</CardTitle>
                  <CardDescription className="text-red-600">
                    Issues requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {currentAssessment.criticalIssues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Detailed Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Health Metrics</CardTitle>
                  <CardDescription>Breakdown by organizational area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentAssessment.metrics.map((metric) => {
                    const TrendIcon = getTrendIcon(metric.trend);
                    
                    return (
                      <div key={metric.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{metric.name}</h4>
                            <p className="text-sm text-gray-600">{metric.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getCategoryColor(metric.category)} variant="secondary">
                              {metric.category}
                            </Badge>
                            <TrendIcon className={`w-5 h-5 ${getTrendColor(metric.trend)}`} />
                            <div className="text-center">
                              <div className={`text-xl font-bold ${getScoreColor(metric.currentScore)}`}>
                                {metric.currentScore}
                              </div>
                              <div className="text-xs text-gray-600">Score</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{metric.previousScore}</div>
                            <div className="text-xs text-gray-600">Previous</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-sm font-medium">{metric.benchmark}</div>
                            <div className="text-xs text-blue-600">Benchmark</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-sm font-medium">{metric.target}</div>
                            <div className="text-xs text-green-600">Target</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <Badge className={getPriorityColor(metric.priority)} variant="secondary">
                              {metric.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress to Target</span>
                            <span>{Math.round((metric.currentScore / metric.target) * 100)}%</span>
                          </div>
                          <Progress value={Math.min((metric.currentScore / metric.target) * 100, 100)} className="h-2" />
                        </div>
                        
                        {metric.recommendations.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-sm mb-2">Recommendations:</h5>
                            <ul className="space-y-1">
                              {metric.recommendations.slice(0, 3).map((rec, index) => (
                                <li key={index} className="text-xs text-gray-700">• {rec}</li>
                              ))}
                            </ul>
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
                  <CardTitle className="text-lg">Priority Recommendations</CardTitle>
                  <CardDescription>Action items to improve organizational health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentAssessment.recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(rec.priority)} variant="secondary">
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.timeframe.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Effort:</span> {rec.effort}
                        </div>
                        <div>
                          <span className="font-medium">Impact:</span> {rec.impact}
                        </div>
                        <div>
                          <span className="font-medium">Owner:</span> {rec.responsibleParty}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Organizational Health Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Organizational Health Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Regular Assessment:</h4>
                  <ul className="space-y-1">
                    <li>• Conduct health checks quarterly</li>
                    <li>• Use multiple data sources and perspectives</li>
                    <li>• Track trends over time, not just snapshots</li>
                    <li>• Benchmark against similar organizations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Improvement Actions:</h4>
                  <ul className="space-y-1">
                    <li>• Prioritize high-impact, low-effort wins</li>
                    <li>• Address critical issues immediately</li>
                    <li>• Celebrate strengths and build on them</li>
                    <li>• Involve staff in solution development</li>
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

export default AlexOrganizationalHealth;