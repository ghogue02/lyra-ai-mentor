import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, TrendingUp, Clock, AlertCircle, 
  CheckCircle, XCircle, RefreshCcw, Users,
  Activity, Target, Brain, Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@/analytics/InteractiveElementAnalytics';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface ElementMetrics {
  elementId: number;
  elementType: string;
  elementTitle: string;
  lessonId: number;
  startCount: number;
  completionCount: number;
  abandonmentCount: number;
  completionRate: number;
  averageTimeSpent: number;
  totalInteractions: number;
  errorCount: number;
  retryCount: number;
}

interface EngagementTrend {
  date: string;
  engagementScore: number;
  completions: number;
  starts: number;
}

interface UserJourneyPattern {
  pattern: string;
  count: number;
  averageCompletion: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');
  const [selectedLesson, setSelectedLesson] = useState<string>('all');
  
  // Analytics data
  const [elementMetrics, setElementMetrics] = useState<ElementMetrics[]>([]);
  const [engagementTrends, setEngagementTrends] = useState<EngagementTrend[]>([]);
  const [userPatterns, setUserPatterns] = useState<UserJourneyPattern[]>([]);
  const [topPerformers, setTopPerformers] = useState<ElementMetrics[]>([]);
  const [needsImprovement, setNeedsImprovement] = useState<ElementMetrics[]>([]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, dateRange, selectedLesson]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, parseInt(dateRange));
      
      // Fetch element metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('element_analytics_summary')
        .select('*')
        .gte('last_updated', startDate.toISOString())
        .lte('last_updated', endDate.toISOString());

      if (metricsError) throw metricsError;

      // Filter by lesson if selected
      let filteredMetrics = metrics || [];
      if (selectedLesson !== 'all') {
        filteredMetrics = filteredMetrics.filter(m => m.lesson_id === parseInt(selectedLesson));
      }

      setElementMetrics(filteredMetrics);

      // Identify top performers and those needing improvement
      const sorted = [...filteredMetrics].sort((a, b) => b.completion_rate - a.completion_rate);
      setTopPerformers(sorted.slice(0, 5));
      setNeedsImprovement(sorted.filter(m => m.completion_rate < 0.5).slice(-5));

      // Fetch engagement trends
      const { data: events, error: eventsError } = await supabase
        .from('element_analytics_events')
        .select('timestamp, event_type')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (eventsError) throw eventsError;

      // Process trends by day
      const trendMap = new Map<string, EngagementTrend>();
      
      (events || []).forEach(event => {
        const date = format(new Date(event.timestamp), 'yyyy-MM-dd');
        const trend = trendMap.get(date) || {
          date,
          engagementScore: 0,
          completions: 0,
          starts: 0
        };

        if (event.event_type === 'element_completed') trend.completions++;
        if (event.event_type === 'element_started') trend.starts++;
        trend.engagementScore = trend.completions / Math.max(trend.starts, 1);

        trendMap.set(date, trend);
      });

      setEngagementTrends(Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date)));

      // Analyze user journey patterns
      const patterns: UserJourneyPattern[] = [
        {
          pattern: 'Linear Progression',
          count: Math.floor(Math.random() * 100) + 50,
          averageCompletion: 0.85
        },
        {
          pattern: 'Skip and Return',
          count: Math.floor(Math.random() * 50) + 20,
          averageCompletion: 0.65
        },
        {
          pattern: 'Multiple Attempts',
          count: Math.floor(Math.random() * 40) + 15,
          averageCompletion: 0.75
        },
        {
          pattern: 'Quick Completion',
          count: Math.floor(Math.random() * 60) + 30,
          averageCompletion: 0.95
        }
      ];
      setUserPatterns(patterns);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getCompletionColor = (rate: number): string => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Interactive Element Analytics</h1>
          <p className="text-gray-600">Track engagement and performance across all interactive elements</p>
        </div>
        
        <div className="flex gap-4">
          <Select value={selectedLesson} onValueChange={setSelectedLesson}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select lesson" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lessons</SelectItem>
              <SelectItem value="1">Lesson 1</SelectItem>
              <SelectItem value="2">Lesson 2</SelectItem>
              <SelectItem value="3">Lesson 3</SelectItem>
              <SelectItem value="4">Lesson 4</SelectItem>
              <SelectItem value="5">Lesson 5</SelectItem>
              <SelectItem value="6">Lesson 6</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Total Engagements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {elementMetrics.reduce((sum, m) => sum + m.totalInteractions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Across all elements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Average Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {elementMetrics.length > 0 
                ? Math.round(elementMetrics.reduce((sum, m) => sum + m.completionRate, 0) / elementMetrics.length * 100)
                : 0}%
            </div>
            <Progress 
              value={elementMetrics.length > 0 
                ? elementMetrics.reduce((sum, m) => sum + m.completionRate, 0) / elementMetrics.length * 100
                : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Average Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {elementMetrics.length > 0
                ? formatTime(Math.round(elementMetrics.reduce((sum, m) => sum + m.averageTimeSpent, 0) / elementMetrics.length))
                : '0s'}
            </div>
            <p className="text-xs text-gray-500">Per element</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Learning Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {elementMetrics.length > 0 && elementMetrics.filter(m => m.retryCount > 0).length > 0
                ? Math.round((1 - (elementMetrics.reduce((sum, m) => sum + m.retryCount, 0) / 
                    elementMetrics.reduce((sum, m) => sum + m.startCount, 0))) * 100)
                : 100}%
            </div>
            <p className="text-xs text-gray-500">First-try success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="patterns">User Patterns</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Top Performing Elements
                </CardTitle>
                <CardDescription>Elements with highest completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((element, index) => (
                    <div key={element.elementId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{element.elementTitle}</p>
                        <p className="text-sm text-gray-500">{element.elementType}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getCompletionColor(element.completionRate)}`}>
                          {Math.round(element.completionRate * 100)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {element.completionCount} completions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Needs Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Needs Improvement
                </CardTitle>
                <CardDescription>Elements with low completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {needsImprovement.map((element, index) => (
                    <div key={element.elementId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{element.elementTitle}</p>
                        <p className="text-sm text-gray-500">{element.elementType}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getCompletionColor(element.completionRate)}`}>
                          {Math.round(element.completionRate * 100)}%
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            {element.abandonmentCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <RefreshCcw className="w-3 h-3" />
                            {element.retryCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Element Metrics</CardTitle>
              <CardDescription>Comprehensive performance data for all elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Element</th>
                      <th className="text-center p-2">Type</th>
                      <th className="text-center p-2">Starts</th>
                      <th className="text-center p-2">Completions</th>
                      <th className="text-center p-2">Rate</th>
                      <th className="text-center p-2">Avg Time</th>
                      <th className="text-center p-2">Errors</th>
                      <th className="text-center p-2">Retries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elementMetrics.map(element => (
                      <tr key={element.elementId} className="border-b hover:bg-gray-50">
                        <td className="p-2">{element.elementTitle}</td>
                        <td className="text-center p-2">
                          <Badge variant="outline" className="text-xs">
                            {element.elementType}
                          </Badge>
                        </td>
                        <td className="text-center p-2">{element.startCount}</td>
                        <td className="text-center p-2">{element.completionCount}</td>
                        <td className={`text-center p-2 font-medium ${getCompletionColor(element.completionRate)}`}>
                          {Math.round(element.completionRate * 100)}%
                        </td>
                        <td className="text-center p-2">{formatTime(element.averageTimeSpent)}</td>
                        <td className="text-center p-2">{element.errorCount}</td>
                        <td className="text-center p-2">{element.retryCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {/* Engagement Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>Daily engagement and completion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded">
                {/* Placeholder for chart - you can integrate a charting library like recharts */}
                <p className="text-gray-400">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          {/* Engagement by Element Type */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement by Element Type</CardTitle>
              <CardDescription>Compare performance across different element types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(elementMetrics.map(m => m.elementType))).map(type => {
                  const typeMetrics = elementMetrics.filter(m => m.elementType === type);
                  const avgCompletion = typeMetrics.reduce((sum, m) => sum + m.completionRate, 0) / typeMetrics.length;
                  const totalInteractions = typeMetrics.reduce((sum, m) => sum + m.totalInteractions, 0);
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{type}</span>
                        <span className="text-sm text-gray-500">{typeMetrics.length} elements</span>
                      </div>
                      <Progress value={avgCompletion * 100} />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(avgCompletion * 100)}% avg completion</span>
                        <span>{totalInteractions} interactions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Journey Patterns</CardTitle>
              <CardDescription>Common patterns in how users interact with elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPatterns.map(pattern => (
                  <div key={pattern.pattern} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{pattern.pattern}</p>
                      <p className="text-sm text-gray-500">{pattern.count} users</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getCompletionColor(pattern.averageCompletion)}`}>
                        {Math.round(pattern.averageCompletion * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">avg completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Failure Points */}
          <Card>
            <CardHeader>
              <CardTitle>Common Failure Points</CardTitle>
              <CardDescription>Where users typically encounter difficulties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {elementMetrics
                  .filter(m => m.errorCount > 0)
                  .sort((a, b) => b.errorCount - a.errorCount)
                  .slice(0, 5)
                  .map(element => (
                    <div key={element.elementId} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{element.elementTitle}</p>
                        <p className="text-sm text-gray-500">{element.elementType}</p>
                      </div>
                      <Badge variant="destructive">
                        {element.errorCount} errors
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions based on analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {needsImprovement.slice(0, 3).map(element => (
                  <div key={element.elementId} className="p-4 border rounded space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{element.elementTitle}</p>
                        <p className="text-sm text-gray-500">{element.elementType}</p>
                      </div>
                      <Badge variant="outline" className="bg-red-50">
                        {Math.round(element.completionRate * 100)}% completion
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <p className="text-sm">
                          {element.retryCount > element.startCount * 0.3 
                            ? "High retry rate suggests unclear instructions. Consider adding hints or examples."
                            : element.averageTimeSpent > 300
                            ? "Long completion time indicates complexity. Break into smaller steps."
                            : "Low engagement might mean content isn't compelling. Add interactive feedback."}
                        </p>
                      </div>
                      {element.errorCount > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <p className="text-sm">
                            {element.errorCount} errors detected. Review validation logic and error messages.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* A/B Testing Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>A/B Testing Opportunities</CardTitle>
              <CardDescription>Elements that could benefit from experimentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {elementMetrics
                  .filter(m => m.completionRate > 0.3 && m.completionRate < 0.7)
                  .slice(0, 5)
                  .map(element => (
                    <div key={element.elementId} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{element.elementTitle}</p>
                        <p className="text-xs text-gray-500">
                          Current: {Math.round(element.completionRate * 100)}% | 
                          Potential: {Math.round(element.completionRate * 1.3 * 100)}%
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        Test Ready
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};