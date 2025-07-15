import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { exportService } from '@/services/exportService';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Coins, TrendingUp, TrendingDown, DollarSign, Download, AlertCircle } from 'lucide-react';

interface TokenUsageData {
  period: string;
  totalTokens: number;
  totalCost: number;
  byFeature: {
    feature: string;
    tokens: number;
    cost: number;
    percentage: number;
  }[];
  byUser: {
    userId: string;
    userName?: string;
    tokens: number;
    cost: number;
    averagePerSession: number;
  }[];
  trends: {
    date: string;
    tokens: number;
    cost: number;
    uniqueUsers: number;
  }[];
  costAnalysis: {
    totalCost: number;
    averageCostPerUser: number;
    averageCostPerSession: number;
    projectedMonthlyCost: number;
    costTrend: 'increasing' | 'decreasing' | 'stable';
    costTrendPercentage: number;
  };
  topExpensiveOperations: {
    operation: string;
    feature: string;
    tokens: number;
    cost: number;
    timestamp: string;
  }[];
}

const TOKEN_COST_PER_1K = 0.015; // Example cost per 1000 tokens

export function TokenUsageReports() {
  const [usageData, setUsageData] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [view, setView] = useState<'overview' | 'features' | 'users' | 'costs'>('overview');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadTokenUsageData();
  }, [timeRange]);

  const loadTokenUsageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Fetch token usage data
      const { data: tokenData, error: tokenError } = await supabase
        .from('token_usage')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: true });

      if (tokenError) throw tokenError;

      // Process data
      const totalTokens = tokenData?.reduce((sum, t) => sum + t.tokens, 0) || 0;
      const totalCost = (totalTokens / 1000) * TOKEN_COST_PER_1K;

      // Group by feature
      const featureMap = new Map<string, number>();
      const userMap = new Map<string, { tokens: number; sessions: number }>();
      const dailyMap = new Map<string, { tokens: number; users: Set<string> }>();

      tokenData?.forEach(record => {
        // Feature aggregation
        featureMap.set(record.feature, (featureMap.get(record.feature) || 0) + record.tokens);
        
        // User aggregation
        const userData = userMap.get(record.user_id) || { tokens: 0, sessions: 0 };
        userData.tokens += record.tokens;
        userData.sessions += 1;
        userMap.set(record.user_id, userData);
        
        // Daily aggregation
        const date = new Date(record.timestamp).toLocaleDateString();
        const dailyData = dailyMap.get(date) || { tokens: 0, users: new Set() };
        dailyData.tokens += record.tokens;
        dailyData.users.add(record.user_id);
        dailyMap.set(date, dailyData);
      });

      // Convert to arrays and calculate costs
      const byFeature = Array.from(featureMap.entries())
        .map(([feature, tokens]) => ({
          feature,
          tokens,
          cost: (tokens / 1000) * TOKEN_COST_PER_1K,
          percentage: (tokens / totalTokens) * 100
        }))
        .sort((a, b) => b.tokens - a.tokens);

      const byUser = Array.from(userMap.entries())
        .map(([userId, data]) => ({
          userId,
          tokens: data.tokens,
          cost: (data.tokens / 1000) * TOKEN_COST_PER_1K,
          averagePerSession: data.tokens / data.sessions
        }))
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 20); // Top 20 users

      const trends = Array.from(dailyMap.entries())
        .map(([date, data]) => ({
          date,
          tokens: data.tokens,
          cost: (data.tokens / 1000) * TOKEN_COST_PER_1K,
          uniqueUsers: data.users.size
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate cost analysis
      const uniqueUsers = new Set(tokenData?.map(t => t.user_id)).size;
      const totalSessions = tokenData?.length || 0;
      const daysInRange = trends.length;
      const averageDailyTokens = totalTokens / daysInRange;
      const projectedMonthlyCost = (averageDailyTokens * 30 / 1000) * TOKEN_COST_PER_1K;

      // Calculate trend
      const firstHalf = trends.slice(0, Math.floor(trends.length / 2));
      const secondHalf = trends.slice(Math.floor(trends.length / 2));
      const firstHalfAvg = firstHalf.reduce((sum, t) => sum + t.tokens, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, t) => sum + t.tokens, 0) / secondHalf.length;
      const trendPercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

      // Find top expensive operations
      const topExpensiveOperations = tokenData
        ?.sort((a, b) => b.tokens - a.tokens)
        .slice(0, 10)
        .map(op => ({
          operation: `${op.feature}_${op.user_id.slice(0, 8)}`,
          feature: op.feature,
          tokens: op.tokens,
          cost: (op.tokens / 1000) * TOKEN_COST_PER_1K,
          timestamp: op.timestamp
        })) || [];

      setUsageData({
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        totalTokens,
        totalCost,
        byFeature,
        byUser,
        trends,
        costAnalysis: {
          totalCost,
          averageCostPerUser: totalCost / uniqueUsers,
          averageCostPerSession: totalCost / totalSessions,
          projectedMonthlyCost,
          costTrend: trendPercentage > 5 ? 'increasing' : trendPercentage < -5 ? 'decreasing' : 'stable',
          costTrendPercentage: Math.abs(trendPercentage)
        },
        topExpensiveOperations
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load token usage data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    if (!usageData) return;
    
    setExporting(true);
    try {
      await exportService.export({
        title: `Token Usage Report - ${usageData.period}`,
        content: usageData,
        metadata: {
          createdAt: new Date().toISOString(),
          reportType: 'token-usage',
          timeRange
        },
        sections: [
          {
            title: 'Summary',
            type: 'text',
            content: `Total Tokens: ${usageData.totalTokens.toLocaleString()}\nTotal Cost: $${usageData.totalCost.toFixed(2)}\nProjected Monthly Cost: $${usageData.costAnalysis.projectedMonthlyCost.toFixed(2)}`
          },
          {
            title: 'Usage by Feature',
            type: 'table',
            content: usageData.byFeature
          },
          {
            title: 'Top Users',
            type: 'table',
            content: usageData.byUser
          }
        ]
      }, {
        format: 'pdf',
        includeMetadata: true
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !usageData) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading token usage: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Token Usage Reports</h2>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportReport}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageData.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {usageData.period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usageData.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${usageData.costAnalysis.averageCostPerUser.toFixed(2)} per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Monthly</CardTitle>
            {usageData.costAnalysis.costTrend === 'increasing' ? 
              <TrendingUp className="h-4 w-4 text-red-500" /> :
              usageData.costAnalysis.costTrend === 'decreasing' ?
              <TrendingDown className="h-4 w-4 text-green-500" /> :
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            }
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usageData.costAnalysis.projectedMonthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {usageData.costAnalysis.costTrend} {usageData.costAnalysis.costTrendPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Session</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(usageData.totalTokens / (usageData.byUser.reduce((sum, u) => sum + u.averagePerSession, 0) || 1))}
            </div>
            <p className="text-xs text-muted-foreground">
              tokens per session
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">By Feature</TabsTrigger>
          <TabsTrigger value="users">By User</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Usage Trend</CardTitle>
              <CardDescription>Daily token consumption and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="300">
                <AreaChart data={usageData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'cost') return `$${value.toFixed(2)}`;
                      return value.toLocaleString();
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                    name="Tokens"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                    name="Cost ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Unique users per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="200">
                <LineChart data={usageData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="uniqueUsers" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    name="Unique Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution by Feature</CardTitle>
              <CardDescription>Which features consume the most tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="300">
                <PieChart>
                  <Pie
                    data={usageData.byFeature}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={entry => `${entry.feature} (${entry.percentage.toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="tokens"
                  >
                    {usageData.byFeature.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Details</CardTitle>
              <CardDescription>Token consumption and costs by feature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usageData.byFeature.map((feature, index) => (
                  <div key={feature.feature} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <p className="font-medium">{feature.feature}</p>
                        <p className="text-sm text-muted-foreground">
                          {feature.tokens.toLocaleString()} tokens
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${feature.cost.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Token Consumers</CardTitle>
              <CardDescription>Users with highest token usage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="400">
                <BarChart data={usageData.byUser.slice(0, 10)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="userId" 
                    width={100}
                    tickFormatter={(id) => `${id.slice(0, 8)}...`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'cost') return `$${value.toFixed(2)}`;
                      return value.toLocaleString();
                    }}
                  />
                  <Bar dataKey="tokens" fill="#8884d8" name="Tokens" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>Detailed usage statistics per user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {usageData.byUser.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">User {user.userId.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">
                        {user.averagePerSession.toFixed(0)} tokens/session avg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{user.tokens.toLocaleString()} tokens</p>
                      <p className="text-sm text-muted-foreground">${user.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Detailed cost breakdown and projections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Period Cost</p>
                  <p className="text-3xl font-bold">${usageData.totalCost.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Projected Monthly</p>
                  <p className="text-3xl font-bold">${usageData.costAnalysis.projectedMonthlyCost.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Cost Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average per user</span>
                    <span className="font-medium">${usageData.costAnalysis.averageCostPerUser.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average per session</span>
                    <span className="font-medium">${usageData.costAnalysis.averageCostPerSession.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cost per 1K tokens</span>
                    <span className="font-medium">${TOKEN_COST_PER_1K.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Cost Trend</h4>
                  <Badge variant={
                    usageData.costAnalysis.costTrend === 'increasing' ? 'destructive' :
                    usageData.costAnalysis.costTrend === 'decreasing' ? 'default' : 'secondary'
                  }>
                    {usageData.costAnalysis.costTrend} {usageData.costAnalysis.costTrendPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Expensive Operations</CardTitle>
              <CardDescription>Individual operations with highest token consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {usageData.topExpensiveOperations.map((op, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{op.feature}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(op.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{op.tokens.toLocaleString()} tokens</p>
                      <p className="text-sm text-muted-foreground">${op.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}