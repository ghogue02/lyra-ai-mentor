import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Target, 
  Star, 
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Mail,
  MessageCircle
} from 'lucide-react';

interface MetricData {
  label: string;
  current: number;
  previous: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  target?: number;
}

interface WeeklyData {
  week: string;
  emailsSent: number;
  responseTime: number;
  satisfaction: number;
  timeSpent: number;
}

const MayaCommunicationMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics: MetricData[] = [
    {
      label: 'Avg Response Time',
      current: 2.3,
      previous: 4.2,
      unit: 'hours',
      trend: 'up',
      target: 2.0
    },
    {
      label: 'Email Satisfaction',
      current: 94,
      previous: 87,
      unit: '%',
      trend: 'up',
      target: 90
    },
    {
      label: 'Time per Email',
      current: 5.2,
      previous: 12.8,
      unit: 'min',
      trend: 'up',
      target: 5.0
    },
    {
      label: 'Emails Handled',
      current: 47,
      previous: 35,
      unit: 'emails',
      trend: 'up'
    },
    {
      label: 'Follow-up Rate',
      current: 96,
      previous: 78,
      unit: '%',
      trend: 'up',
      target: 95
    },
    {
      label: 'CARE Score',
      current: 92,
      previous: 78,
      unit: '%',
      trend: 'up',
      target: 90
    }
  ];

  const weeklyData: WeeklyData[] = [
    { week: 'Week 1', emailsSent: 35, responseTime: 4.2, satisfaction: 87, timeSpent: 12.8 },
    { week: 'Week 2', emailsSent: 42, responseTime: 3.1, satisfaction: 89, timeSpent: 8.5 },
    { week: 'Week 3', emailsSent: 39, responseTime: 2.8, satisfaction: 91, timeSpent: 6.7 },
    { week: 'Week 4', emailsSent: 47, responseTime: 2.3, satisfaction: 94, timeSpent: 5.2 }
  ];

  const achievements = [
    {
      id: '1',
      title: 'Speed Demon',
      description: 'Reduced average response time by 45%',
      icon: Clock,
      color: 'text-blue-600',
      earned: true
    },
    {
      id: '2',
      title: 'CARE Master',
      description: 'Maintained 90%+ CARE framework score',
      icon: Star,
      color: 'text-purple-600',
      earned: true
    },
    {
      id: '3',
      title: 'Efficiency Expert',
      description: 'Cut email writing time by 60%',
      icon: Target,
      color: 'text-green-600',
      earned: true
    },
    {
      id: '4',
      title: 'Satisfaction Star',
      description: 'Achieve 95%+ satisfaction rating',
      icon: TrendingUp,
      color: 'text-orange-600',
      earned: false
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateChange = (current: number, previous: number) => {
    return Math.abs(((current - previous) / previous) * 100).toFixed(1);
  };

  const getProgressPercentage = (current: number, target?: number) => {
    if (!target) return 100;
    return Math.min(100, (current / target) * 100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Communication Metrics</CardTitle>
                <CardDescription>
                  Track your email performance and improvement over time
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'quarter'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                  className="capitalize"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMetric === metric.label ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedMetric(
                  selectedMetric === metric.label ? null : metric.label
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.current}{metric.unit}
                    </span>
                    <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                      {calculateChange(metric.current, metric.previous)}%
                    </span>
                  </div>

                  {metric.target && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress to target</span>
                        <span>{metric.target}{metric.unit}</span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(metric.current, metric.target)} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    vs. previous {timeRange}: {metric.previous}{metric.unit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Improvement Trend</CardTitle>
              <CardDescription>
                See how your communication skills have improved over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Response Time Trend */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Response Time (hours)
                  </h4>
                  <div className="space-y-2">
                    {weeklyData.map((data, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm font-medium w-16">{data.week}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                          <div 
                            className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(5 - data.responseTime) / 5 * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {data.responseTime}h
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Satisfaction Trend */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Satisfaction Rate (%)
                  </h4>
                  <div className="space-y-2">
                    {weeklyData.map((data, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm font-medium w-16">{data.week}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                          <div 
                            className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${data.satisfaction}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {data.satisfaction}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Communication Achievements
              </CardTitle>
              <CardDescription>
                Milestones in your communication journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${achievement.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {achievement.earned && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                          {achievement.earned && (
                            <Badge className="mt-2 bg-green-100 text-green-800">
                              Unlocked!
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Saved Summary */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Time Savings Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">7.6 min</div>
                  <div className="text-sm text-gray-600">Saved per email</div>
                  <div className="text-xs text-gray-500">vs. 4 weeks ago</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">5.9 hrs</div>
                  <div className="text-sm text-gray-600">Saved this week</div>
                  <div className="text-xs text-gray-500">47 emails processed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">23.6 hrs</div>
                  <div className="text-sm text-gray-600">Total time saved</div>
                  <div className="text-xs text-gray-500">Last 4 weeks</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  What this means for Maya:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Nearly 3 extra work days gained back per month</li>
                  <li>• More time for program development and family engagement</li>
                  <li>• Reduced stress and increased confidence in communications</li>
                  <li>• Higher satisfaction from parents and stakeholders</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaCommunicationMetrics;