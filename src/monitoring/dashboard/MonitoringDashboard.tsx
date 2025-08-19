/**
 * Comprehensive Monitoring Dashboard
 * Real-time display of performance metrics, errors, and analytics
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert as UIAlert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  Activity, 
  Brain, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network, 
  Users, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

import { MetricsManager } from '../core/MetricsManager';
import { ErrorTracker } from '../core/ErrorTracker';
import { InteractionAnalytics } from '../analytics/InteractionAnalytics';
import { AlertManager } from '../alerts/AlertManager';
import { 
  PerformanceMetrics, 
  ErrorInfo, 
  Alert, 
  DashboardConfig, 
  InteractionEvent 
} from '../types';

interface DashboardProps {
  sessionId: string;
  userId?: string;
  config?: Partial<DashboardConfig>;
}

export const MonitoringDashboard: React.FC<DashboardProps> = ({
  sessionId,
  userId,
  config = {}
}) => {
  // State
  const [isRealTime, setIsRealTime] = useState(config.enableRealTime ?? true);
  const [timeRange, setTimeRange] = useState<'5m' | '15m' | '1h' | '24h' | '7d'>(config.timeRange || '1h');
  const [refreshInterval, setRefreshInterval] = useState(config.refreshInterval || 5000);
  const [isVisible, setIsVisible] = useState(true);
  
  // Data state
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
  const [stats, setStats] = useState<any>({});

  // Refs
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const metricsManagerRef = useRef<MetricsManager>();
  const errorTrackerRef = useRef<ErrorTracker>();
  const analyticsRef = useRef<InteractionAnalytics>();
  const alertManagerRef = useRef<AlertManager>();

  // Initialize monitoring systems
  useEffect(() => {
    metricsManagerRef.current = MetricsManager.getInstance();
    errorTrackerRef.current = ErrorTracker.getInstance();
    analyticsRef.current = InteractionAnalytics.getInstance();
    alertManagerRef.current = AlertManager.getInstance();

    // Start monitoring
    metricsManagerRef.current.startCollection();
    errorTrackerRef.current.startTracking();
    analyticsRef.current.startTracking();
    alertManagerRef.current.startMonitoring();

    return () => {
      metricsManagerRef.current?.stopCollection();
      errorTrackerRef.current?.stopTracking();
      analyticsRef.current?.stopTracking();
      alertManagerRef.current?.stopMonitoring();
    };
  }, []);

  // Auto-refresh data
  useEffect(() => {
    const refreshData = () => {
      if (!isVisible || !isRealTime) return;
      
      const timeRangeMap = {
        '5m': 5 * 60 * 1000,
        '15m': 15 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      };

      const range = {
        start: new Date(Date.now() - timeRangeMap[timeRange]),
        end: new Date()
      };

      // Fetch metrics
      const fetchedMetrics = metricsManagerRef.current?.getMetrics(range) || [];
      setMetrics(fetchedMetrics);
      
      if (fetchedMetrics.length > 0) {
        setCurrentMetrics(fetchedMetrics[fetchedMetrics.length - 1]);
      }

      // Fetch errors
      const fetchedErrors = errorTrackerRef.current?.getErrors({
        timeRange: range,
        limit: 100
      }) || [];
      setErrors(fetchedErrors);

      // Fetch alerts
      const fetchedAlerts = alertManagerRef.current?.getAlerts({
        timeRange: range,
        limit: 50
      }) || [];
      setAlerts(fetchedAlerts);

      // Fetch interactions
      const fetchedInteractions = analyticsRef.current?.getInteractions({
        timeRange: range,
        limit: 100
      }) || [];
      setInteractions(fetchedInteractions);

      // Update stats
      const errorStats = errorTrackerRef.current?.getErrorStats(range) || {};
      const alertStats = alertManagerRef.current?.getAlertStats(range) || {};
      const interactionStats = analyticsRef.current?.getInteractionStats(range) || {};
      
      setStats({
        errors: errorStats,
        alerts: alertStats,
        interactions: interactionStats
      });
    };

    refreshData(); // Initial load

    if (isRealTime) {
      refreshTimeoutRef.current = setInterval(refreshData, refreshInterval);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  }, [isRealTime, timeRange, refreshInterval, isVisible]);

  // Visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Helper functions
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getTrendIcon = (trend: 'improving' | 'degrading' | 'stable') => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'degrading': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = {
      metrics,
      errors,
      alerts,
      interactions,
      stats,
      exportedAt: new Date().toISOString(),
      timeRange,
      sessionId,
      userId
    };

    const content = format === 'json' ? 
      JSON.stringify(data, null, 2) : 
      'CSV export not implemented yet';
    
    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-data-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time performance and error tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-sm text-gray-600">
              {isRealTime ? 'Live' : 'Paused'}
            </span>
          </div>
          <Switch
            checked={isRealTime}
            onCheckedChange={setIsRealTime}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('json')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Time Range:</span>
        {(['5m', '15m', '1h', '24h', '7d'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Performance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMetrics ? formatDuration(currentMetrics.responseTime) : '--'}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {currentMetrics && getTrendIcon('stable')}
              <span className="ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        {/* Memory Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMetrics ? `${currentMetrics.memoryUsage.toFixed(1)} MB` : '--'}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: currentMetrics ? `${Math.min((currentMetrics.memoryUsage / 200) * 100, 100)}%` : '0%' 
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Errors Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.errors?.unresolved || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.errors?.total || 0} total errors
            </div>
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.interactions?.uniqueUsers || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.interactions?.uniqueSessions || 0} sessions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Current Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentMetrics && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm">{formatDuration(currentMetrics.responseTime)}</span>
                    </div>
                    <Progress value={(currentMetrics.responseTime / 10000) * 100} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">FPS</span>
                      <span className="text-sm">{currentMetrics.fps?.toFixed(0) || '--'}</span>
                    </div>
                    <Progress value={currentMetrics.fps ? (currentMetrics.fps / 60) * 100 : 0} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm">{currentMetrics.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={currentMetrics.cpuUsage} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network Latency</span>
                      <span className="text-sm">
                        {currentMetrics.networkLatency ? formatDuration(currentMetrics.networkLatency) : '--'}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Bundle Information */}
            <Card>
              <CardHeader>
                <CardTitle>Bundle Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {currentMetrics?.bundleSize ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatBytes(currentMetrics.bundleSize)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Bundle Size</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compressed</span>
                        <span>{formatBytes(currentMetrics.bundleSize * 0.3)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cache Hit Rate</span>
                        <span>{((currentMetrics.cacheHitRate || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No bundle data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Error Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Error Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {stats.errors?.unresolved || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Unresolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.errors?.resolved || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats.errors?.bySeverity || {}).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between items-center">
                      <Badge variant="outline" className={getSeverityColor(severity)}>
                        {severity}
                      </Badge>
                      <span className="text-sm">{count as number}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Errors */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {errors.slice(0, 10).map((error) => (
                    <div key={error.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant="outline" 
                              className={getSeverityColor(error.severity)}
                            >
                              {error.severity}
                            </Badge>
                            <Badge variant="outline">{error.source}</Badge>
                          </div>
                          <p className="text-sm font-medium">{error.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {error.timestamp.toLocaleString()}
                          </p>
                        </div>
                        {error.resolved && (
                          <Badge variant="outline" className="bg-green-100">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.filter(alert => !alert.resolved).map((alert) => (
                    <UIAlert key={alert.id}>
                      <AlertTriangle className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <AlertDescription className="mt-2">
                          {alert.message}
                        </AlertDescription>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => alertManagerRef.current?.resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                          {alert.actions?.map((action) => (
                            <Button
                              key={action.id}
                              size="sm"
                              variant="outline"
                              disabled={action.status === 'running'}
                              onClick={() => alertManagerRef.current?.executeAction(alert.id, action.id)}
                            >
                              {action.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </UIAlert>
                  ))}
                  {alerts.filter(alert => !alert.resolved).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No active alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interaction Stats */}
            <Card>
              <CardHeader>
                <CardTitle>User Interactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.interactions?.totalInteractions || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Interactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.interactions?.successRate?.toFixed(1) || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Session Duration</span>
                    <span className="text-sm">
                      {formatDuration(stats.interactions?.avgSessionDuration || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bounce Rate</span>
                    <span className="text-sm">
                      {stats.interactions?.engagementMetrics?.bounceRate?.toFixed(1) || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Interactions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Interactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Chat Sessions</span>
                    <span className="text-sm font-medium">
                      {stats.interactions?.aiInteractionMetrics?.chatSessions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Messages/Session</span>
                    <span className="text-sm font-medium">
                      {stats.interactions?.aiInteractionMetrics?.avgMessagesPerSession?.toFixed(1) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="text-sm font-medium">
                      {formatDuration(stats.interactions?.aiInteractionMetrics?.avgResponseTime || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction Score</span>
                    <span className="text-sm font-medium">
                      {stats.interactions?.aiInteractionMetrics?.satisfactionScore?.toFixed(1) || '--'}/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-500">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Updated</span>
                  <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Refresh Interval</span>
                  <select 
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value={1000}>1s</option>
                    <option value={5000}>5s</option>
                    <option value={10000}>10s</option>
                    <option value={30000}>30s</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real-time</span>
                  <Switch checked={isRealTime} onCheckedChange={setIsRealTime} />
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => exportData('json')}
                >
                  Export JSON
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => exportData('csv')}
                >
                  Export CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};