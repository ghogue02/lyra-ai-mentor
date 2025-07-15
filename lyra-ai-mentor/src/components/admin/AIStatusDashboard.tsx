import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  Zap,
  Brain,
  Download,
  RefreshCw
} from 'lucide-react';
import { aiMonitoringService } from '@/services/aiMonitoringService';
import { getAIConfig } from '@/config/aiConfig';

export const AIStatusDashboard: React.FC = () => {
  const [stats, setStats] = useState(aiMonitoringService.getUsageStats());
  const [refreshing, setRefreshing] = useState(false);
  const config = getAIConfig();

  const refreshStats = async () => {
    setRefreshing(true);
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    setStats(aiMonitoringService.getUsageStats());
    setRefreshing(false);
  };

  const exportData = () => {
    const data = aiMonitoringService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-usage-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const interval = setInterval(refreshStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getRateLimitStatus = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return { color: 'destructive', status: 'Critical' };
    if (percentage >= 70) return { color: 'warning', status: 'High' };
    if (percentage >= 50) return { color: 'secondary', status: 'Medium' };
    return { color: 'default', status: 'Low' };
  };

  const costStatus = getRateLimitStatus(stats.today.totalCost, config.RATE_LIMITS.COST_LIMIT_PER_DAY);
  const requestStatus = getRateLimitStatus(stats.rateLimits.requestsThisMinute, config.RATE_LIMITS.REQUESTS_PER_MINUTE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">AI Usage Dashboard</h2>
          <p className="text-gray-600">Monitor OpenAI API usage, costs, and performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStats}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.today.totalCost.toFixed(2)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Limit: ${config.RATE_LIMITS.COST_LIMIT_PER_DAY}
              </p>
              <Badge variant={costStatus.color as any}>{costStatus.status}</Badge>
            </div>
            <Progress 
              value={(stats.today.totalCost / config.RATE_LIMITS.COST_LIMIT_PER_DAY) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.totalRequests}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                This minute: {stats.rateLimits.requestsThisMinute}
              </p>
              <Badge variant={requestStatus.color as any}>{requestStatus.status}</Badge>
            </div>
            <Progress 
              value={(stats.rateLimits.requestsThisMinute / config.RATE_LIMITS.REQUESTS_PER_MINUTE) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This week: {stats.thisWeek.tokens.toLocaleString()}
            </p>
            <div className="mt-2">
              <Badge variant="outline">
                {stats.rateLimits.tokensThisMinute} tokens/min
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall system health
            </p>
            <div className="mt-2">
              <Badge variant={stats.errorRate > 5 ? 'destructive' : stats.errorRate > 2 ? 'secondary' : 'default'}>
                {stats.errorRate > 5 ? 'Poor' : stats.errorRate > 2 ? 'Fair' : 'Good'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limits Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Rate Limit Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Requests/Minute</span>
                <span className="text-sm text-gray-600">
                  {stats.rateLimits.requestsThisMinute}/{config.RATE_LIMITS.REQUESTS_PER_MINUTE}
                </span>
              </div>
              <Progress value={(stats.rateLimits.requestsThisMinute / config.RATE_LIMITS.REQUESTS_PER_MINUTE) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Requests/Hour</span>
                <span className="text-sm text-gray-600">
                  {stats.rateLimits.requestsThisHour}/{config.RATE_LIMITS.REQUESTS_PER_HOUR}
                </span>
              </div>
              <Progress value={(stats.rateLimits.requestsThisHour / config.RATE_LIMITS.REQUESTS_PER_HOUR) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tokens/Minute</span>
                <span className="text-sm text-gray-600">
                  {stats.rateLimits.tokensThisMinute}/{config.RATE_LIMITS.TOKENS_PER_MINUTE}
                </span>
              </div>
              <Progress value={(stats.rateLimits.tokensThisMinute / config.RATE_LIMITS.TOKENS_PER_MINUTE) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Components (This Week)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topComponents.map((component, index) => (
              <div key={component.component} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="font-medium">{component.component}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{component.requests} requests</span>
                  <Progress 
                    value={(component.requests / stats.topComponents[0].requests) * 100} 
                    className="w-20" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Usage Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.thisWeek.requests}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.thisWeek.tokens.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">${stats.thisWeek.cost.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};