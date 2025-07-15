import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, Zap, Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface RealTimeData {
  activeUsers: number;
  currentSessions: number;
  lastHourInteractions: number;
  avgResponseTime: number;
  errorRate: number;
  tokensLastHour: number;
  topTools: { tool: string; uses: number }[];
  recentActivity: { time: string; users: number; interactions: number }[];
  systemAlerts: { type: 'warning' | 'error' | 'info'; message: string; timestamp: string }[];
  performanceMetrics: { metric: string; value: number; trend: 'up' | 'down' | 'stable' }[];
}

interface RealTimeMetricsProps {
  isLive: boolean;
  lastUpdate: Date;
}

export function RealTimeMetrics({ isLive, lastUpdate }: RealTimeMetricsProps) {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRealTimeData();
    
    if (isLive) {
      const interval = setInterval(loadRealTimeData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLive, lastUpdate]);

  const loadRealTimeData = async () => {
    if (!isLive) return;
    
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get active sessions (last 5 minutes)
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('ai_playground_sessions')
        .select('*')
        .gte('session_start', fiveMinutesAgo.toISOString())
        .is('session_end', null);

      if (sessionsError) throw sessionsError;

      // Get interactions in the last hour
      const { data: recentInteractions, error: interactionsError } = await supabase
        .from('ai_playground_interactions')
        .select('*')
        .gte('created_at', hourAgo.toISOString());

      if (interactionsError) throw interactionsError;

      // Get performance metrics
      const { data: perfMetrics, error: perfError } = await supabase
        .from('ai_playground_performance_metrics')
        .select('*')
        .gte('hour', hourAgo.toISOString())
        .order('hour', { ascending: false });

      if (perfError) throw perfError;

      // Get user engagement data
      const { data: userEngagement, error: engagementError } = await supabase
        .from('ai_playground_user_engagement')
        .select('*')
        .gte('last_active', dayAgo.toISOString());

      if (engagementError) throw engagementError;

      // Get tool analytics
      const { data: toolAnalytics, error: toolError } = await supabase
        .from('ai_playground_tool_analytics')
        .select('*')
        .order('total_uses', { ascending: false })
        .limit(5);

      if (toolError) throw toolError;

      // Process data
      const activeUsers = new Set(activeSessions?.map(s => s.user_id)).size;
      const currentSessions = activeSessions?.length || 0;
      const lastHourInteractions = recentInteractions?.length || 0;
      
      const latestPerf = perfMetrics?.[0];
      const avgResponseTime = latestPerf?.avg_response_time_ms || 0;
      const errorRate = latestPerf ? (latestPerf.error_count / latestPerf.request_count) * 100 : 0;
      const tokensLastHour = latestPerf?.total_tokens_used || 0;

      // Top tools
      const topTools = toolAnalytics?.map(tool => ({
        tool: tool.tool_name,
        uses: tool.total_uses
      })) || [];

      // Recent activity (last 6 hours, hourly breakdown)
      const recentActivity = [];
      for (let i = 5; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStart = new Date(hour.getTime());
        hourStart.setMinutes(0, 0, 0);
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
        
        const hourInteractions = recentInteractions?.filter(interaction => {
          const interactionTime = new Date(interaction.created_at);
          return interactionTime >= hourStart && interactionTime < hourEnd;
        }).length || 0;

        const hourUsers = new Set(
          recentInteractions?.filter(interaction => {
            const interactionTime = new Date(interaction.created_at);
            return interactionTime >= hourStart && interactionTime < hourEnd;
          }).map(i => i.user_id)
        ).size;

        recentActivity.push({
          time: hour.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
          users: hourUsers,
          interactions: hourInteractions
        });
      }

      // System alerts (simulate based on metrics)
      const systemAlerts = [];
      if (errorRate > 5) {
        systemAlerts.push({
          type: 'error' as const,
          message: `High error rate detected: ${errorRate.toFixed(1)}%`,
          timestamp: now.toISOString()
        });
      }
      if (avgResponseTime > 2000) {
        systemAlerts.push({
          type: 'warning' as const,
          message: `Slow response times: ${avgResponseTime.toFixed(0)}ms average`,
          timestamp: now.toISOString()
        });
      }
      if (activeUsers > 100) {
        systemAlerts.push({
          type: 'info' as const,
          message: `High activity: ${activeUsers} active users`,
          timestamp: now.toISOString()
        });
      }

      // Performance metrics
      const performanceMetrics = [
        { 
          metric: 'Response Time', 
          value: avgResponseTime, 
          trend: avgResponseTime > 1500 ? 'up' as const : avgResponseTime < 800 ? 'down' as const : 'stable' as const 
        },
        { 
          metric: 'Active Users', 
          value: activeUsers, 
          trend: 'stable' as const 
        },
        { 
          metric: 'Error Rate', 
          value: errorRate, 
          trend: errorRate > 2 ? 'up' as const : 'down' as const 
        },
        { 
          metric: 'Throughput', 
          value: lastHourInteractions, 
          trend: 'stable' as const 
        }
      ];

      setData({
        activeUsers,
        currentSessions,
        lastHourInteractions,
        avgResponseTime,
        errorRate,
        tokensLastHour,
        topTools,
        recentActivity,
        systemAlerts,
        performanceMetrics
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load real-time data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
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
          <p className="text-destructive">Error loading real-time data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* System Alerts */}
      {data.systemAlerts.length > 0 && (
        <div className="space-y-2">
          {data.systemAlerts.map((alert, index) => (
            <Card key={index} className={`border-l-4 ${
              alert.type === 'error' ? 'border-l-red-500 bg-red-50' :
              alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'error' ? 'text-red-500' :
                      alert.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Last 5 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.currentSessions}</div>
            <p className="text-xs text-muted-foreground">
              Active sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(data.avgResponseTime, { good: 1000, warning: 2000 })}`}>
              {data.avgResponseTime.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Last hour average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(data.errorRate, { good: 1, warning: 5 })}`}>
              {data.errorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Activity (Last 6 Hours)</CardTitle>
            <CardDescription>User activity and interactions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height="300">
              <AreaChart data={data.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Active Users"
                />
                <Area 
                  type="monotone" 
                  dataKey="interactions" 
                  stackId="2"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Interactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top AI Tools</CardTitle>
            <CardDescription>Most used tools in the last hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topTools.map((tool, index) => (
                <div key={tool.tool} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{tool.tool}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{tool.uses} uses</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (tool.uses / data.topTools[0]?.uses) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Real-time system performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.performanceMetrics.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold">
                  {metric.metric === 'Response Time' ? `${metric.value.toFixed(0)}ms` :
                   metric.metric === 'Error Rate' ? `${metric.value.toFixed(1)}%` :
                   metric.value.toFixed(0)}
                </div>
                <Progress 
                  value={metric.metric === 'Error Rate' ? 
                    Math.min(100, (metric.value / 10) * 100) : 
                    Math.min(100, (metric.value / 100) * 10)
                  } 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hourly Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{data.lastHourInteractions}</div>
            <p className="text-sm text-muted-foreground">Last 60 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tokens Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{data.tokensLastHour.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold">All Systems Operational</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}