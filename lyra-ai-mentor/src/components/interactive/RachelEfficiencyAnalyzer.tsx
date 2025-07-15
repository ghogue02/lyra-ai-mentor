import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Target,
  Zap,
  Timer,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface EfficiencyMetric {
  id: string;
  name: string;
  category: 'time' | 'cost' | 'quality' | 'satisfaction';
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
  lastMeasured: Date;
}

interface ProcessAnalysis {
  id: string;
  processName: string;
  description: string;
  timeSpent: number; // minutes per week
  efficiency: number; // percentage
  metrics: EfficiencyMetric[];
  bottlenecks: string[];
  improvements: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface QuickWin {
  id: string;
  title: string;
  description: string;
  implementation: string;
  timeToImplement: number; // hours
  expectedSavings: number; // hours per month
  difficultyLevel: 'easy' | 'medium' | 'hard';
  impact: 'low' | 'medium' | 'high';
}

const RachelEfficiencyAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcessAnalysis | null>(null);
  const [analysisResults, setAnalysisResults] = useState<ProcessAnalysis[]>([]);
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);

  const sampleProcesses: ProcessAnalysis[] = [
    {
      id: 'donor-management',
      processName: 'Donor Management',
      description: 'End-to-end donor relationship management and stewardship',
      timeSpent: 480, // 8 hours per week
      efficiency: 65,
      priority: 'high',
      metrics: [
        {
          id: 'response-time',
          name: 'Thank You Response Time',
          category: 'time',
          currentValue: 3.2,
          targetValue: 1.0,
          unit: 'days',
          trend: 'down',
          impact: 'high',
          lastMeasured: new Date()
        },
        {
          id: 'retention-rate',
          name: 'Donor Retention Rate',
          category: 'quality',
          currentValue: 68,
          targetValue: 80,
          unit: '%',
          trend: 'up',
          impact: 'high',
          lastMeasured: new Date()
        },
        {
          id: 'processing-cost',
          name: 'Cost per Donor Interaction',
          category: 'cost',
          currentValue: 12.50,
          targetValue: 8.00,
          unit: '$',
          trend: 'stable',
          impact: 'medium',
          lastMeasured: new Date()
        }
      ],
      bottlenecks: [
        'Manual data entry for each donation',
        'Inconsistent follow-up timing',
        'Limited personalization at scale',
        'Duplicate communications'
      ],
      improvements: [
        'Automated thank you email system',
        'CRM integration with donation platform',
        'Personalization templates',
        'Communication scheduling automation'
      ]
    },
    {
      id: 'volunteer-coordination',
      processName: 'Volunteer Coordination',
      description: 'Recruiting, scheduling, and managing volunteer activities',
      timeSpent: 360, // 6 hours per week
      efficiency: 72,
      priority: 'high',
      metrics: [
        {
          id: 'scheduling-time',
          name: 'Time to Schedule Volunteers',
          category: 'time',
          currentValue: 45,
          targetValue: 15,
          unit: 'minutes',
          trend: 'down',
          impact: 'medium',
          lastMeasured: new Date()
        },
        {
          id: 'volunteer-satisfaction',
          name: 'Volunteer Satisfaction',
          category: 'satisfaction',
          currentValue: 4.2,
          targetValue: 4.5,
          unit: '/5',
          trend: 'up',
          impact: 'high',
          lastMeasured: new Date()
        },
        {
          id: 'no-show-rate',
          name: 'Volunteer No-Show Rate',
          category: 'quality',
          currentValue: 15,
          targetValue: 5,
          unit: '%',
          trend: 'stable',
          impact: 'medium',
          lastMeasured: new Date()
        }
      ],
      bottlenecks: [
        'Manual scheduling coordination',
        'Limited volunteer availability tracking',
        'No automated reminders',
        'Paper-based check-in process'
      ],
      improvements: [
        'Online scheduling system',
        'Automated reminder system',
        'Digital check-in process',
        'Skills-based volunteer matching'
      ]
    },
    {
      id: 'program-reporting',
      processName: 'Program Reporting',
      description: 'Data collection, analysis, and report generation for programs',
      timeSpent: 240, // 4 hours per week
      efficiency: 58,
      priority: 'critical',
      metrics: [
        {
          id: 'report-creation-time',
          name: 'Monthly Report Creation Time',
          category: 'time',
          currentValue: 6,
          targetValue: 2,
          unit: 'hours',
          trend: 'stable',
          impact: 'high',
          lastMeasured: new Date()
        },
        {
          id: 'data-accuracy',
          name: 'Data Accuracy Rate',
          category: 'quality',
          currentValue: 87,
          targetValue: 95,
          unit: '%',
          trend: 'up',
          impact: 'high',
          lastMeasured: new Date()
        },
        {
          id: 'stakeholder-satisfaction',
          name: 'Report Stakeholder Satisfaction',
          category: 'satisfaction',
          currentValue: 3.8,
          targetValue: 4.3,
          unit: '/5',
          trend: 'stable',
          impact: 'medium',
          lastMeasured: new Date()
        }
      ],
      bottlenecks: [
        'Manual data compilation from multiple sources',
        'Time-consuming formatting and visualization',
        'Inconsistent reporting templates',
        'Limited real-time data access'
      ],
      improvements: [
        'Automated data integration',
        'Standardized report templates',
        'Real-time dashboard implementation',
        'Automated report distribution'
      ]
    }
  ];

  const runEfficiencyAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalysisResults(sampleProcesses);
    
    // Generate quick wins
    const wins: QuickWin[] = [
      {
        id: 'automated-reminders',
        title: 'Automated Email Reminders',
        description: 'Set up automated reminder emails for volunteer shifts and donor follow-ups',
        implementation: 'Configure email automation in your CRM or email platform',
        timeToImplement: 2,
        expectedSavings: 8,
        difficultyLevel: 'easy',
        impact: 'medium'
      },
      {
        id: 'template-library',
        title: 'Communication Template Library',
        description: 'Create standardized templates for common communications',
        implementation: 'Develop templates for thank you notes, volunteer instructions, and program updates',
        timeToImplement: 4,
        expectedSavings: 12,
        difficultyLevel: 'easy',
        impact: 'medium'
      },
      {
        id: 'digital-forms',
        title: 'Digital Forms Implementation',
        description: 'Replace paper forms with digital alternatives for faster processing',
        implementation: 'Use Google Forms or similar tools for applications and feedback',
        timeToImplement: 3,
        expectedSavings: 6,
        difficultyLevel: 'easy',
        impact: 'low'
      },
      {
        id: 'scheduling-tool',
        title: 'Online Scheduling Tool',
        description: 'Implement self-service scheduling for volunteers and meetings',
        implementation: 'Set up Calendly or similar tool with availability windows',
        timeToImplement: 6,
        expectedSavings: 15,
        difficultyLevel: 'medium',
        impact: 'high'
      },
      {
        id: 'dashboard-setup',
        title: 'Performance Dashboard',
        description: 'Create real-time dashboard for key metrics tracking',
        implementation: 'Use Google Data Studio or similar for automated reporting',
        timeToImplement: 8,
        expectedSavings: 20,
        difficultyLevel: 'medium',
        impact: 'high'
      }
    ];
    
    setQuickWins(wins);
    setIsAnalyzing(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Timer;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean) => {
    if (trend === 'stable') return 'text-gray-600';
    const isGoodTrend = (trend === 'up' && isPositive) || (trend === 'down' && !isPositive);
    return isGoodTrend ? 'text-green-600' : 'text-red-600';
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${hours}h`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Efficiency Analyzer</CardTitle>
              <CardDescription>
                Micro-sessions to identify and improve operational efficiency
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {analysisResults.length === 0 ? (
            /* Analysis Trigger */
            <div className="space-y-6">
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">
                    Quick Efficiency Analysis
                  </h3>
                  <p className="text-purple-600 mb-6">
                    Get actionable insights on your nonprofit's operational efficiency in under 5 minutes
                  </p>
                  <Button 
                    onClick={runEfficiencyAnalysis}
                    disabled={isAnalyzing}
                    className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What We'll Analyze</CardTitle>
                  <CardDescription>Key areas of operational efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Time Efficiency</h4>
                        <p className="text-sm text-blue-600">Process duration and bottlenecks</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                      <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Cost Effectiveness</h4>
                        <p className="text-sm text-green-600">Resource allocation and spending</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-800">Quality Metrics</h4>
                        <p className="text-sm text-purple-600">Accuracy and consistency measures</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded">
                      <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-800">Satisfaction Levels</h4>
                        <p className="text-sm text-orange-600">Staff and stakeholder experience</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {/* Overall Summary */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Efficiency Overview</CardTitle>
                  <CardDescription className="text-green-600">
                    Analysis complete • {analysisResults.length} processes evaluated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(analysisResults.reduce((sum, p) => sum + p.efficiency, 0) / analysisResults.length)}%
                      </div>
                      <div className="text-sm text-green-600">Avg Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatTime(analysisResults.reduce((sum, p) => sum + p.timeSpent, 0) / 60)}
                      </div>
                      <div className="text-sm text-blue-600">Weekly Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{quickWins.length}</div>
                      <div className="text-sm text-purple-600">Quick Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatTime(quickWins.reduce((sum, w) => sum + w.expectedSavings, 0))}
                      </div>
                      <div className="text-sm text-orange-600">Potential Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Process Efficiency Breakdown</CardTitle>
                  <CardDescription>Detailed analysis of key organizational processes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResults.map((process) => (
                    <div key={process.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{process.processName}</h4>
                          <p className="text-sm text-gray-600">{process.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(process.priority)} variant="secondary">
                            {process.priority}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">{process.efficiency}%</div>
                            <div className="text-xs text-gray-600">efficiency</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {process.metrics.slice(0, 3).map((metric) => {
                          const TrendIcon = getTrendIcon(metric.trend);
                          const isPositive = metric.name.includes('Rate') || metric.name.includes('Satisfaction');
                          
                          return (
                            <div key={metric.id} className="bg-gray-50 p-3 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{metric.name}</span>
                                <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend, isPositive)}`} />
                              </div>
                              <div className="text-lg font-bold">
                                {metric.currentValue}{metric.unit}
                              </div>
                              <div className="text-xs text-gray-600">
                                Target: {metric.targetValue}{metric.unit}
                              </div>
                              <div className="mt-1">
                                <Progress 
                                  value={Math.min((metric.currentValue / metric.targetValue) * 100, 100)} 
                                  className="h-1"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-red-700 mb-2">Bottlenecks:</h5>
                          <ul className="space-y-1">
                            {process.bottlenecks.slice(0, 3).map((bottleneck, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-red-700">{bottleneck}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Improvements:</h5>
                          <ul className="space-y-1">
                            {process.improvements.slice(0, 3).map((improvement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-green-700">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Wins */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Wins</CardTitle>
                  <CardDescription>Easy implementations with high impact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickWins.map((win) => (
                    <div key={win.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{win.title}</h4>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(win.difficultyLevel)} variant="secondary">
                            {win.difficultyLevel}
                          </Badge>
                          <Badge className={getImpactColor(win.impact)} variant="secondary">
                            {win.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{win.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{formatTime(win.timeToImplement)}</div>
                          <div className="text-xs text-blue-600">Implementation Time</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{formatTime(win.expectedSavings)}</div>
                          <div className="text-xs text-green-600">Monthly Savings</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round((win.expectedSavings / win.timeToImplement) * 100) / 100}x
                          </div>
                          <div className="text-xs text-purple-600">ROI Multiplier</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h5 className="font-medium text-sm mb-1">Implementation:</h5>
                        <p className="text-xs text-gray-700">{win.implementation}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Plan */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">Recommended Action Plan</CardTitle>
                  <CardDescription className="text-purple-600">
                    Prioritized implementation roadmap
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded border">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">1</div>
                      <div className="flex-1">
                        <h4 className="font-medium">This Week: Easy Wins</h4>
                        <p className="text-sm text-gray-600">Focus on template creation and digital forms</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800" variant="secondary">2-4 hours</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded border">
                      <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold">2</div>
                      <div className="flex-1">
                        <h4 className="font-medium">Next 2 Weeks: Automation Setup</h4>
                        <p className="text-sm text-gray-600">Implement scheduling tools and automated reminders</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">6-8 hours</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded border">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">3</div>
                      <div className="flex-1">
                        <h4 className="font-medium">Month 2: Advanced Analytics</h4>
                        <p className="text-sm text-gray-600">Deploy performance dashboards and monitoring</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800" variant="secondary">8-12 hours</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips and Best Practices */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Efficiency Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Measuring Efficiency:</h4>
                  <ul className="space-y-1">
                    <li>• Track time spent on repetitive tasks</li>
                    <li>• Monitor quality and error rates</li>
                    <li>• Measure stakeholder satisfaction</li>
                    <li>• Calculate cost per outcome</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quick Improvement Areas:</h4>
                  <ul className="space-y-1">
                    <li>• Automate routine communications</li>
                    <li>• Standardize common processes</li>
                    <li>• Eliminate duplicate data entry</li>
                    <li>• Create reusable templates</li>
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

export default RachelEfficiencyAnalyzer;