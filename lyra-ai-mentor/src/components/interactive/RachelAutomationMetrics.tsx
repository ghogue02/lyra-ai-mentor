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
  Clock, 
  DollarSign, 
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

interface AutomationMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  category: 'efficiency' | 'cost' | 'quality' | 'user_satisfaction';
  trend: 'up' | 'down' | 'stable';
  target?: number;
  description: string;
}

interface AutomationPerformance {
  id: string;
  automationName: string;
  category: 'email' | 'reporting' | 'data_processing' | 'scheduling';
  isActive: boolean;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageExecutionTime: number; // seconds
  timeSavedMonthly: number; // hours
  costSavingsMonthly: number; // dollars
  lastRun: Date;
  errorRate: number; // percentage
  userSatisfactionScore: number; // 1-5
  monthlyMetrics: {
    month: string;
    runs: number;
    successRate: number;
    timeSaved: number;
  }[];
}

interface PerformanceInsight {
  id: string;
  type: 'success' | 'warning' | 'optimization' | 'issue';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  metricAffected: string;
}

const RachelAutomationMetrics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedAutomation, setSelectedAutomation] = useState<string>('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const overallMetrics: AutomationMetric[] = [
    {
      id: 'time-saved',
      name: 'Time Saved',
      value: 127,
      previousValue: 98,
      unit: 'hours',
      category: 'efficiency',
      trend: 'up',
      target: 150,
      description: 'Total time saved through automation this month'
    },
    {
      id: 'cost-savings',
      name: 'Cost Savings',
      value: 3175,
      previousValue: 2450,
      unit: '$',
      category: 'cost',
      trend: 'up',
      target: 4000,
      description: 'Monthly cost savings from automated processes'
    },
    {
      id: 'success-rate',
      name: 'Success Rate',
      value: 94.8,
      previousValue: 92.1,
      unit: '%',
      category: 'quality',
      trend: 'up',
      target: 95,
      description: 'Percentage of successful automation executions'
    },
    {
      id: 'user-satisfaction',
      name: 'User Satisfaction',
      value: 4.3,
      previousValue: 4.1,
      unit: '/5',
      category: 'user_satisfaction',
      trend: 'up',
      target: 4.5,
      description: 'Average user satisfaction score for automated processes'
    },
    {
      id: 'automations-active',
      name: 'Active Automations',
      value: 12,
      previousValue: 9,
      unit: 'count',
      category: 'efficiency',
      trend: 'up',
      target: 15,
      description: 'Number of currently active automation workflows'
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      value: 5.2,
      previousValue: 7.9,
      unit: '%',
      category: 'quality',
      trend: 'down',
      target: 3,
      description: 'Percentage of automation runs that result in errors'
    }
  ];

  const automationPerformance: AutomationPerformance[] = [
    {
      id: 'donor-thank-you',
      automationName: 'Donor Thank You Emails',
      category: 'email',
      isActive: true,
      totalRuns: 347,
      successfulRuns: 341,
      failedRuns: 6,
      averageExecutionTime: 2.3,
      timeSavedMonthly: 28.9,
      costSavingsMonthly: 722,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      errorRate: 1.7,
      userSatisfactionScore: 4.6,
      monthlyMetrics: [
        { month: 'Jan', runs: 298, successRate: 96.3, timeSaved: 24.8 },
        { month: 'Feb', runs: 312, successRate: 97.1, timeSaved: 26.0 },
        { month: 'Mar', runs: 347, successRate: 98.3, timeSaved: 28.9 }
      ]
    },
    {
      id: 'monthly-reports',
      automationName: 'Monthly Report Generation',
      category: 'reporting',
      isActive: true,
      totalRuns: 3,
      successfulRuns: 3,
      failedRuns: 0,
      averageExecutionTime: 14.7,
      timeSavedMonthly: 18.0,
      costSavingsMonthly: 450,
      lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      errorRate: 0,
      userSatisfactionScore: 4.8,
      monthlyMetrics: [
        { month: 'Jan', runs: 1, successRate: 100, timeSaved: 6.0 },
        { month: 'Feb', runs: 1, successRate: 100, timeSaved: 6.0 },
        { month: 'Mar', runs: 1, successRate: 100, timeSaved: 6.0 }
      ]
    },
    {
      id: 'volunteer-reminders',
      automationName: 'Volunteer Shift Reminders',
      category: 'scheduling',
      isActive: true,
      totalRuns: 156,
      successfulRuns: 142,
      failedRuns: 14,
      averageExecutionTime: 1.8,
      timeSavedMonthly: 13.0,
      costSavingsMonthly: 325,
      lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
      errorRate: 9.0,
      userSatisfactionScore: 4.1,
      monthlyMetrics: [
        { month: 'Jan', runs: 134, successRate: 88.8, timeSaved: 11.2 },
        { month: 'Feb', runs: 145, successRate: 91.0, timeSaved: 12.1 },
        { month: 'Mar', runs: 156, successRate: 91.0, timeSaved: 13.0 }
      ]
    },
    {
      id: 'data-backup',
      automationName: 'Daily Data Backup',
      category: 'data_processing',
      isActive: true,
      totalRuns: 93,
      successfulRuns: 91,
      failedRuns: 2,
      averageExecutionTime: 8.2,
      timeSavedMonthly: 31.0,
      costSavingsMonthly: 775,
      lastRun: new Date(Date.now() - 8 * 60 * 60 * 1000),
      errorRate: 2.2,
      userSatisfactionScore: 4.4,
      monthlyMetrics: [
        { month: 'Jan', runs: 31, successRate: 96.8, timeSaved: 10.3 },
        { month: 'Feb', runs: 28, successRate: 96.4, timeSaved: 9.3 },
        { month: 'Mar', runs: 31, successRate: 96.8, timeSaved: 10.3 }
      ]
    }
  ];

  const performanceInsights: PerformanceInsight[] = [
    {
      id: 'success-trending-up',
      type: 'success',
      title: 'Success Rate Improving',
      description: 'Overall automation success rate has increased by 2.7% this month',
      impact: 'high',
      recommendation: 'Continue current optimization strategies and consider expanding successful automations',
      metricAffected: 'success-rate'
    },
    {
      id: 'volunteer-reminders-errors',
      type: 'warning',
      title: 'Volunteer Reminders Error Rate',
      description: 'Volunteer reminder automation has a 9% error rate, higher than target',
      impact: 'medium',
      recommendation: 'Review volunteer contact data quality and email/SMS delivery issues',
      metricAffected: 'volunteer-reminders'
    },
    {
      id: 'cost-savings-target',
      type: 'optimization',
      title: 'Cost Savings Growth Opportunity',
      description: 'Currently at 79% of monthly cost savings target',
      impact: 'medium',
      recommendation: 'Identify additional processes for automation to reach $4,000 target',
      metricAffected: 'cost-savings'
    },
    {
      id: 'donor-emails-performing',
      type: 'success',
      title: 'Donor Email Automation Excellence',
      description: 'Donor thank you automation achieving 98.3% success rate with high satisfaction',
      impact: 'high',
      recommendation: 'Use this automation as a template for other email workflows',
      metricAffected: 'donor-thank-you'
    },
    {
      id: 'monthly-reports-stable',
      type: 'success',
      title: 'Perfect Report Generation',
      description: 'Monthly report automation has 100% success rate for 3 consecutive months',
      impact: 'high',
      recommendation: 'Consider expanding automated reporting to weekly or project-specific reports',
      metricAffected: 'monthly-reports'
    }
  ];

  const generateReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date(),
      metrics: overallMetrics,
      automations: automationPerformance,
      insights: performanceInsights
    };
    
    // In a real app, this would download a PDF or CSV
    console.log('Report generated:', reportData);
    
    setIsGeneratingReport(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean) => {
    if (trend === 'stable') return 'text-gray-600';
    const isGoodTrend = (trend === 'up' && isPositive) || (trend === 'down' && !isPositive);
    return isGoodTrend ? 'text-green-600' : 'text-red-600';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'optimization': return Target;
      case 'issue': return AlertTriangle;
      default: return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'optimization': return 'text-blue-600 bg-blue-100';
      case 'issue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'reporting': return 'text-purple-600 bg-purple-100';
      case 'data_processing': return 'text-green-600 bg-green-100';
      case 'scheduling': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') return `$${value.toLocaleString()}`;
    if (unit === '%') return `${value}%`;
    if (unit === '/5') return `${value}/5`;
    return `${value}${unit === 'count' ? '' : ' ' + unit}`;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
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
              <CardTitle className="text-2xl">Automation Metrics</CardTitle>
              <CardDescription>
                Track automation performance, efficiency gains, and ROI analytics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
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
            
            <div className="flex-1" />
            
            <Button
              onClick={generateReport}
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

          {/* Overall Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Performance</CardTitle>
              <CardDescription>Key automation metrics for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overallMetrics.map((metric) => {
                  const TrendIcon = getTrendIcon(metric.trend);
                  const percentageChange = calculatePercentageChange(metric.value, metric.previousValue);
                  const isPositiveMetric = !metric.name.includes('Error');
                  
                  return (
                    <div key={metric.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{metric.name}</h4>
                        <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend, isPositiveMetric)}`} />
                      </div>
                      
                      <div className="text-2xl font-bold mb-1">
                        {formatValue(metric.value, metric.unit)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className={getTrendColor(metric.trend, isPositiveMetric)}>
                          {percentageChange > 0 ? '+' : ''}{percentageChange}%
                        </span>
                        <span className="text-gray-600">vs last {selectedPeriod}</span>
                      </div>
                      
                      {metric.target && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress to target</span>
                            <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                          </div>
                          <Progress 
                            value={Math.min((metric.value / metric.target) * 100, 100)} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Automation Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Individual Automation Performance</CardTitle>
              <CardDescription>Detailed metrics for each active automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationPerformance.map((automation) => {
                const successRate = (automation.successfulRuns / automation.totalRuns) * 100;
                
                return (
                  <div key={automation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${automation.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <h4 className="font-semibold">{automation.automationName}</h4>
                          <Badge className={getCategoryColor(automation.category)} variant="secondary">
                            {automation.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">User Rating</div>
                        <div className="font-bold">⭐ {automation.userSatisfactionScore}/5</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{Math.round(successRate)}%</div>
                        <div className="text-xs text-green-600">Success Rate</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{automation.totalRuns}</div>
                        <div className="text-xs text-blue-600">Total Runs</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{automation.timeSavedMonthly}h</div>
                        <div className="text-xs text-purple-600">Time Saved</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">${automation.costSavingsMonthly}</div>
                        <div className="text-xs text-yellow-600">Cost Savings</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Last Run:</span> {automation.lastRun.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Avg Execution:</span> {automation.averageExecutionTime}s
                      </div>
                      <div>
                        <span className="font-medium">Error Rate:</span> 
                        <span className={automation.errorRate > 5 ? 'text-red-600' : 'text-green-600'}>
                          {automation.errorRate}%
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Failed Runs:</span> {automation.failedRuns}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Insights</CardTitle>
              <CardDescription>AI-powered analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceInsights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                
                return (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getInsightColor(insight.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline">{insight.impact} impact</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <h5 className="font-medium text-blue-800 text-sm mb-1">Recommendation:</h5>
                          <p className="text-sm text-blue-700">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ROI Summary */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Return on Investment Summary</CardTitle>
              <CardDescription className="text-green-600">
                Quantified benefits of automation investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ${overallMetrics.find(m => m.id === 'cost-savings')?.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Monthly Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {overallMetrics.find(m => m.id === 'time-saved')?.value}h
                  </div>
                  <div className="text-sm text-green-600">Time Recovered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((overallMetrics.find(m => m.id === 'cost-savings')?.value || 0) / 500 * 100)}%
                  </div>
                  <div className="text-sm text-green-600">Estimated ROI</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded border">
                <h4 className="font-medium text-green-800 mb-2">Annual Projection</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Projected Annual Savings:</span>
                    <div className="font-bold text-lg text-green-600">
                      ${((overallMetrics.find(m => m.id === 'cost-savings')?.value || 0) * 12).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-green-700">Time Recovered Annually:</span>
                    <div className="font-bold text-lg text-green-600">
                      {((overallMetrics.find(m => m.id === 'time-saved')?.value || 0) * 12).toLocaleString()} hours
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips and Best Practices */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Metrics Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Key Metrics to Watch:</h4>
                  <ul className="space-y-1">
                    <li>• Success rate (target: &gt;95%)</li>
                    <li>• Error rate (target: &lt;3%)</li>
                    <li>• Time savings vs. goals</li>
                    <li>• User satisfaction scores</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Optimization Actions:</h4>
                  <ul className="space-y-1">
                    <li>• Review failed automation logs weekly</li>
                    <li>• Survey users for satisfaction feedback</li>
                    <li>• Monitor execution times for performance</li>
                    <li>• Calculate ROI quarterly</li>
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

export default RachelAutomationMetrics;