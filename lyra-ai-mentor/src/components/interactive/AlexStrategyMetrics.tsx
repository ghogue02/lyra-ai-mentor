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
  TrendingDown,
  Target, 
  Users,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Activity,
  Compass,
  Award,
  Clock,
  PieChart
} from 'lucide-react';

interface StrategyMetric {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'impact' | 'growth' | 'stakeholder';
  currentValue: number;
  targetValue: number;
  previousValue: number;
  unit: string;
  dataType: 'currency' | 'percentage' | 'count' | 'ratio';
  frequency: 'monthly' | 'quarterly' | 'annually';
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: Date;
  dataPoints: MetricDataPoint[];
  benchmark?: number;
  owner: string;
}

interface MetricDataPoint {
  date: Date;
  value: number;
  note?: string;
}

interface StrategicInitiative {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  progress: number; // 0-100
  metrics: string[]; // metric IDs
  milestones: Milestone[];
  owner: string;
  impact: 'high' | 'medium' | 'low';
}

interface Milestone {
  id: string;
  title: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
}

interface PerformanceDashboard {
  period: { start: Date; end: Date };
  overallScore: number;
  categoryScores: {
    financial: number;
    operational: number;
    impact: number;
    growth: number;
    stakeholder: number;
  };
  keyAchievements: string[];
  concernAreas: string[];
  recommendations: string[];
}

interface StrategyInsight {
  type: 'success' | 'warning' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  relatedMetrics: string[];
}

const AlexStrategyMetrics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<'dashboard' | 'metrics' | 'initiatives' | 'insights'>('dashboard');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const strategyMetrics: StrategyMetric[] = [
    {
      id: 'revenue-growth',
      name: 'Revenue Growth Rate',
      description: 'Annual percentage increase in total organizational revenue',
      category: 'financial',
      currentValue: 12.5,
      targetValue: 15.0,
      previousValue: 8.3,
      unit: '%',
      dataType: 'percentage',
      frequency: 'annually',
      trend: 'improving',
      lastUpdated: new Date(),
      benchmark: 10.0,
      owner: 'Development Director',
      dataPoints: [
        { date: new Date('2022-12-31'), value: 8.3 },
        { date: new Date('2023-12-31'), value: 12.5 }
      ]
    },
    {
      id: 'program-reach',
      name: 'Total Program Participants',
      description: 'Number of individuals served across all programs annually',
      category: 'impact',
      currentValue: 2450,
      targetValue: 3000,
      previousValue: 2180,
      unit: 'people',
      dataType: 'count',
      frequency: 'annually',
      trend: 'improving',
      lastUpdated: new Date(),
      benchmark: 2200,
      owner: 'Program Director',
      dataPoints: [
        { date: new Date('2022-12-31'), value: 2180 },
        { date: new Date('2023-06-30'), value: 2315 },
        { date: new Date('2023-12-31'), value: 2450 }
      ]
    },
    {
      id: 'cost-per-participant',
      name: 'Cost per Participant',
      description: 'Average program cost per individual served',
      category: 'operational',
      currentValue: 850,
      targetValue: 750,
      previousValue: 920,
      unit: '$',
      dataType: 'currency',
      frequency: 'quarterly',
      trend: 'improving',
      lastUpdated: new Date(),
      benchmark: 800,
      owner: 'Operations Manager',
      dataPoints: [
        { date: new Date('2023-03-31'), value: 920 },
        { date: new Date('2023-06-30'), value: 885 },
        { date: new Date('2023-09-30'), value: 850 }
      ]
    },
    {
      id: 'staff-retention',
      name: 'Staff Retention Rate',
      description: 'Percentage of staff retained year-over-year',
      category: 'operational',
      currentValue: 87,
      targetValue: 90,
      previousValue: 82,
      unit: '%',
      dataType: 'percentage',
      frequency: 'annually',
      trend: 'improving',
      lastUpdated: new Date(),
      benchmark: 85,
      owner: 'HR Manager',
      dataPoints: [
        { date: new Date('2022-12-31'), value: 82 },
        { date: new Date('2023-12-31'), value: 87 }
      ]
    },
    {
      id: 'donor-retention',
      name: 'Donor Retention Rate',
      description: 'Percentage of donors who gave in both current and previous year',
      category: 'stakeholder',
      currentValue: 68,
      targetValue: 75,
      previousValue: 71,
      unit: '%',
      dataType: 'percentage',
      frequency: 'annually',
      trend: 'declining',
      lastUpdated: new Date(),
      benchmark: 72,
      owner: 'Development Director',
      dataPoints: [
        { date: new Date('2022-12-31'), value: 71 },
        { date: new Date('2023-12-31'), value: 68 }
      ]
    },
    {
      id: 'program-outcome-rate',
      name: 'Program Success Rate',
      description: 'Percentage of participants achieving defined program outcomes',
      category: 'impact',
      currentValue: 78,
      targetValue: 85,
      previousValue: 74,
      unit: '%',
      dataType: 'percentage',
      frequency: 'quarterly',
      trend: 'improving',
      lastUpdated: new Date(),
      benchmark: 75,
      owner: 'Program Director',
      dataPoints: [
        { date: new Date('2023-03-31'), value: 74 },
        { date: new Date('2023-06-30'), value: 76 },
        { date: new Date('2023-09-30'), value: 78 }
      ]
    }
  ];

  const strategicInitiatives: StrategicInitiative[] = [
    {
      id: 'digital-transformation',
      name: 'Digital Platform Integration',
      description: 'Implement comprehensive CRM and program management system',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 150000,
      status: 'active',
      progress: 65,
      owner: 'Technology Director',
      impact: 'high',
      metrics: ['cost-per-participant', 'staff-retention'],
      milestones: [
        {
          id: 'milestone-1',
          title: 'System Selection Complete',
          dueDate: new Date('2024-03-31'),
          status: 'completed',
          description: 'Vendor selected and contracts signed'
        },
        {
          id: 'milestone-2',
          title: 'Data Migration Complete',
          dueDate: new Date('2024-06-30'),
          status: 'completed',
          description: 'All historical data migrated to new system'
        },
        {
          id: 'milestone-3',
          title: 'Staff Training Complete',
          dueDate: new Date('2024-09-30'),
          status: 'pending',
          description: 'All staff trained on new systems'
        }
      ]
    },
    {
      id: 'revenue-diversification',
      name: 'Revenue Diversification Strategy',
      description: 'Reduce dependency on single funding source through new revenue streams',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-02-28'),
      budget: 75000,
      status: 'active',
      progress: 40,
      owner: 'Executive Director',
      impact: 'high',
      metrics: ['revenue-growth', 'donor-retention'],
      milestones: [
        {
          id: 'milestone-4',
          title: 'Corporate Partnership Program Launch',
          dueDate: new Date('2024-06-30'),
          status: 'completed',
          description: 'New corporate giving program operational'
        },
        {
          id: 'milestone-5',
          title: 'Individual Donor Campaign',
          dueDate: new Date('2024-12-31'),
          status: 'pending',
          description: 'Major donor cultivation campaign underway'
        }
      ]
    }
  ];

  const performanceDashboard: PerformanceDashboard = {
    period: { start: new Date('2024-01-01'), end: new Date('2024-09-30') },
    overallScore: 82,
    categoryScores: {
      financial: 85,
      operational: 79,
      impact: 88,
      growth: 76,
      stakeholder: 72
    },
    keyAchievements: [
      'Exceeded revenue growth target by 12.5% vs 15% goal',
      'Program participant numbers increased 12% year-over-year',
      'Successfully reduced cost per participant by 7.6%',
      'Launched digital transformation initiative on schedule'
    ],
    concernAreas: [
      'Donor retention rate declining for second consecutive year',
      'Staff retention below target despite improvements',
      'Program outcome rates improving but still below target'
    ],
    recommendations: [
      'Implement donor engagement survey to understand retention issues',
      'Accelerate staff development and compensation review',
      'Conduct detailed program outcome analysis to identify improvement opportunities'
    ]
  };

  const strategyInsights: StrategyInsight[] = [
    {
      type: 'success',
      title: 'Cost Efficiency Gains',
      description: 'Digital transformation showing early ROI through reduced administrative costs',
      confidence: 88,
      impact: 'high',
      actionRequired: false,
      relatedMetrics: ['cost-per-participant']
    },
    {
      type: 'warning',
      title: 'Donor Retention Trend',
      description: 'Declining donor retention may impact long-term financial sustainability',
      confidence: 92,
      impact: 'high',
      actionRequired: true,
      relatedMetrics: ['donor-retention', 'revenue-growth']
    },
    {
      type: 'opportunity',
      title: 'Program Scale Potential',
      description: 'Current program success rates support case for expansion funding',
      confidence: 76,
      impact: 'medium',
      actionRequired: false,
      relatedMetrics: ['program-outcome-rate', 'program-reach']
    },
    {
      type: 'risk',
      title: 'Operational Capacity Limits',
      description: 'Staff retention challenges may limit ability to scale programs effectively',
      confidence: 81,
      impact: 'medium',
      actionRequired: true,
      relatedMetrics: ['staff-retention', 'program-reach']
    }
  ];

  const generateStrategicReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date(),
      metrics: strategyMetrics,
      initiatives: strategicInitiatives,
      dashboard: performanceDashboard,
      insights: strategyInsights
    };
    
    console.log('Strategic report generated:', reportData);
    setIsGeneratingReport(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'text-green-600 bg-green-100';
      case 'operational': return 'text-blue-600 bg-blue-100';
      case 'impact': return 'text-purple-600 bg-purple-100';
      case 'growth': return 'text-orange-600 bg-orange-100';
      case 'stakeholder': return 'text-pink-600 bg-pink-100';
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

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'opportunity': return 'text-blue-600 bg-blue-100';
      case 'risk': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'on_hold': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatValue = (value: number, dataType: string, unit: string) => {
    switch (dataType) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'count':
        return value.toLocaleString();
      default:
        return `${value}${unit !== 'count' ? ' ' + unit : ''}`;
    }
  };

  const calculateProgress = (current: number, target: number, baseline: number = 0) => {
    if (baseline === target) return 100;
    return Math.min(((current - baseline) / (target - baseline)) * 100, 100);
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? strategyMetrics 
    : strategyMetrics.filter(m => m.category === selectedCategory);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Strategy Performance Metrics</CardTitle>
              <CardDescription>
                Track strategic initiative performance and organizational key performance indicators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {(['month', 'quarter', 'year'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {(['all', 'financial', 'operational', 'impact', 'growth', 'stakeholder'] as const).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
            
            <div className="flex-1" />
            
            <Button
              onClick={generateStrategicReport}
              disabled={isGeneratingReport}
              variant="outline"
            >
              {isGeneratingReport ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'metrics', label: 'Metrics', icon: Target },
              { id: 'initiatives', label: 'Initiatives', icon: Compass },
              { id: 'insights', label: 'Insights', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeView === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView(tab.id as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Overall Performance */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">Overall Strategic Performance</CardTitle>
                  <CardDescription className="text-purple-600">
                    {performanceDashboard.period.start.toLocaleDateString()} - {performanceDashboard.period.end.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {performanceDashboard.overallScore}/100
                    </div>
                    <div className="text-purple-700">Strategic Performance Score</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(performanceDashboard.categoryScores).map(([category, score]) => (
                      <div key={category} className="text-center p-3 bg-white rounded border">
                        <div className="text-xl font-bold">{score}</div>
                        <div className="text-sm text-gray-600 capitalize">{category}</div>
                        <Progress value={score} className="h-2 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMetrics.slice(0, 6).map((metric) => {
                  const TrendIcon = getTrendIcon(metric.trend);
                  const progress = calculateProgress(metric.currentValue, metric.targetValue, 0);
                  
                  return (
                    <Card key={metric.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getCategoryColor(metric.category)} variant="secondary">
                            {metric.category}
                          </Badge>
                          <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend)}`} />
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-2xl font-bold">
                            {formatValue(metric.currentValue, metric.dataType, metric.unit)}
                          </div>
                          <div className="text-sm text-gray-600">{metric.name}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress to target</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-1" />
                          <div className="text-xs text-gray-500">
                            Target: {formatValue(metric.targetValue, metric.dataType, metric.unit)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Achievements and Concerns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">Key Achievements</CardTitle>
                    <CardDescription>Strategic successes this period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {performanceDashboard.keyAchievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">Areas of Concern</CardTitle>
                    <CardDescription>Issues requiring strategic attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {performanceDashboard.concernAreas.map((concern, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'metrics' && (
            <div className="space-y-4">
              {filteredMetrics.map((metric) => {
                const TrendIcon = getTrendIcon(metric.trend);
                const progress = calculateProgress(metric.currentValue, metric.targetValue, 0);
                
                return (
                  <Card key={metric.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{metric.name}</h4>
                          <p className="text-sm text-gray-600">{metric.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getCategoryColor(metric.category)} variant="secondary">
                            {metric.category}
                          </Badge>
                          <TrendIcon className={`w-5 h-5 ${getTrendColor(metric.trend)}`} />
                          <div className="text-center">
                            <div className="text-xl font-bold">
                              {formatValue(metric.currentValue, metric.dataType, metric.unit)}
                            </div>
                            <div className="text-xs text-gray-600">Current</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm font-medium">
                            {formatValue(metric.previousValue, metric.dataType, metric.unit)}
                          </div>
                          <div className="text-xs text-gray-600">Previous</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-sm font-medium">
                            {formatValue(metric.targetValue, metric.dataType, metric.unit)}
                          </div>
                          <div className="text-xs text-blue-600">Target</div>
                        </div>
                        {metric.benchmark && (
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-sm font-medium">
                              {formatValue(metric.benchmark, metric.dataType, metric.unit)}
                            </div>
                            <div className="text-xs text-green-600">Benchmark</div>
                          </div>
                        )}
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-sm font-medium capitalize">{metric.frequency}</div>
                          <div className="text-xs text-purple-600">Frequency</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Target</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className="h-3" />
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-600">
                        <div>Owner: {metric.owner}</div>
                        <div>Last Updated: {metric.lastUpdated.toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeView === 'initiatives' && (
            <div className="space-y-4">
              {strategicInitiatives.map((initiative) => (
                <Card key={initiative.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{initiative.name}</h4>
                        <p className="text-sm text-gray-600">{initiative.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(initiative.status)} variant="secondary">
                          {initiative.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{initiative.impact} impact</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{initiative.progress}%</div>
                        <div className="text-xs text-blue-600">Progress</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">
                          ${(initiative.budget / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-green-600">Budget</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{initiative.metrics.length}</div>
                        <div className="text-xs text-purple-600">Metrics</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-lg font-bold text-orange-600">
                          {initiative.milestones.filter(m => m.status === 'completed').length}
                        </div>
                        <div className="text-xs text-orange-600">Completed</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{initiative.progress}%</span>
                      </div>
                      <Progress value={initiative.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Start Date:</span> {initiative.startDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span> {initiative.endDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Owner:</span> {initiative.owner}
                      </div>
                      <div>
                        <span className="font-medium">Milestones:</span> {initiative.milestones.length} total
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeView === 'insights' && (
            <div className="space-y-4">
              {strategyInsights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getInsightColor(insight.type)}`}>
                        {insight.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                        {insight.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                        {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4" />}
                        {insight.type === 'risk' && <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                          <Badge variant="outline">{insight.impact} impact</Badge>
                          {insight.actionRequired && (
                            <Badge className="bg-red-100 text-red-700" variant="secondary">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        {insight.relatedMetrics.length > 0 && (
                          <div className="flex gap-2">
                            <span className="text-xs text-gray-500">Related metrics:</span>
                            {insight.relatedMetrics.map((metricId, idx) => {
                              const metric = strategyMetrics.find(m => m.id === metricId);
                              return metric ? (
                                <Badge key={idx} variant="outline">{metric.name}</Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Strategic Performance Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Strategic Metrics Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Measurement:</h4>
                  <ul className="space-y-1">
                    <li>• Focus on leading indicators, not just results</li>
                    <li>• Set realistic but stretch targets</li>
                    <li>• Track both quantity and quality metrics</li>
                    <li>• Review and adjust metrics regularly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Strategic Action:</h4>
                  <ul className="space-y-1">
                    <li>• Use data to drive strategic decisions</li>
                    <li>• Address declining trends quickly</li>
                    <li>• Celebrate and replicate successes</li>
                    <li>• Communicate metrics story to stakeholders</li>
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

export default AlexStrategyMetrics;