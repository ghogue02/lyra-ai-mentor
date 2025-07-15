import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, MousePointer, CheckCircle } from 'lucide-react';

interface ElementStats {
  elementId: number;
  elementType: string;
  elementName: string;
  lessonId: number;
  stats: {
    totalInteractions: number;
    uniqueUsers: number;
    completionRate: number;
    averageTimeSpent: number;
    abandonmentRate: number;
    errorRate: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
  };
  topInteractionTypes: { type: string; count: number }[];
  hourlyDistribution: { hour: number; interactions: number }[];
}

export function PopularElements() {
  const [elements, setElements] = useState<ElementStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [sortBy, setSortBy] = useState<'interactions' | 'users' | 'completion' | 'time'>('interactions');

  useEffect(() => {
    loadElementStats();
  }, [timeRange]);

  const loadElementStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(endDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
      }

      // Fetch element analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('element_analytics_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (analyticsError) throw analyticsError;

      // Process data into element stats
      const elementMap = new Map<number, ElementStats>();

      analyticsData?.forEach(event => {
        if (!elementMap.has(event.element_id)) {
          elementMap.set(event.element_id, {
            elementId: event.element_id,
            elementType: event.element_type,
            elementName: event.element_type, // Would need to fetch actual names
            lessonId: event.lesson_id,
            stats: {
              totalInteractions: 0,
              uniqueUsers: new Set<string>().size,
              completionRate: 0,
              averageTimeSpent: 0,
              abandonmentRate: 0,
              errorRate: 0,
              trend: 'stable',
              trendPercentage: 0
            },
            topInteractionTypes: [],
            hourlyDistribution: Array(24).fill(0).map((_, i) => ({ hour: i, interactions: 0 }))
          });
        }

        const element = elementMap.get(event.element_id)!;
        element.stats.totalInteractions++;
        
        // Track unique users
        const userSet = new Set<string>();
        userSet.add(event.user_id);
        element.stats.uniqueUsers = userSet.size;

        // Track interaction types
        const hour = new Date(event.timestamp).getHours();
        element.hourlyDistribution[hour].interactions++;
      });

      // Calculate completion rates and other metrics
      const { data: summaryData, error: summaryError } = await supabase
        .from('element_analytics_summary')
        .select('*');

      if (summaryError) throw summaryError;

      summaryData?.forEach(summary => {
        const element = elementMap.get(summary.element_id);
        if (element) {
          element.stats.completionRate = summary.completion_rate || 0;
          element.stats.averageTimeSpent = summary.average_time_spent || 0;
          element.stats.abandonmentRate = summary.abandonment_count / (summary.start_count || 1);
          element.stats.errorRate = summary.error_count / (summary.total_interactions || 1);
        }
      });

      // Sort elements
      const sortedElements = Array.from(elementMap.values()).sort((a, b) => {
        switch (sortBy) {
          case 'interactions':
            return b.stats.totalInteractions - a.stats.totalInteractions;
          case 'users':
            return b.stats.uniqueUsers - a.stats.uniqueUsers;
          case 'completion':
            return b.stats.completionRate - a.stats.completionRate;
          case 'time':
            return b.stats.averageTimeSpent - a.stats.averageTimeSpent;
          default:
            return 0;
        }
      });

      setElements(sortedElements.slice(0, 10)); // Top 10 elements
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load element statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const getStatusColor = (rate: number): string => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading popular elements: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Popular Elements</h2>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interactions">Most Interactions</SelectItem>
              <SelectItem value="users">Most Users</SelectItem>
              <SelectItem value="completion">Highest Completion</SelectItem>
              <SelectItem value="time">Most Time Spent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {elements.map((element, index) => (
          <Card key={element.elementId} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>#{index + 1}</span>
                    <span>{element.elementName}</span>
                    <Badge variant="outline">{element.elementType}</Badge>
                  </CardTitle>
                  <CardDescription>Lesson ID: {element.lessonId}</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  {element.stats.trend === 'up' && (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">+{element.stats.trendPercentage}%</span>
                    </>
                  )}
                  {element.stats.trend === 'down' && (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">-{element.stats.trendPercentage}%</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Interactions</span>
                  </div>
                  <p className="text-2xl font-bold">{element.stats.totalInteractions.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Unique Users</span>
                  </div>
                  <p className="text-2xl font-bold">{element.stats.uniqueUsers.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                  </div>
                  <p className={`text-2xl font-bold ${getStatusColor(element.stats.completionRate)}`}>
                    {(element.stats.completionRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Avg Time</span>
                  </div>
                  <p className="text-2xl font-bold">{formatTime(element.stats.averageTimeSpent)}</p>
                </div>
              </div>

              {/* Hourly Distribution Chart */}
              <div>
                <h4 className="text-sm font-medium mb-2">Hourly Activity Distribution</h4>
                <ResponsiveContainer width="100%" height="100">
                  <LineChart data={element.hourlyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(hour) => `${hour}:00`}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      labelFormatter={(hour) => `${hour}:00`}
                      formatter={(value: any) => [value, 'Interactions']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interactions" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Abandonment Rate</p>
                  <p className={`font-medium ${getStatusColor(1 - element.stats.abandonmentRate)}`}>
                    {(element.stats.abandonmentRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className={`font-medium ${getStatusColor(1 - element.stats.errorRate)}`}>
                    {(element.stats.errorRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Score</p>
                  <p className="font-medium">
                    {((element.stats.completionRate * 0.4 + 
                       (1 - element.stats.abandonmentRate) * 0.3 + 
                       (1 - element.stats.errorRate) * 0.3) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}