import React, { useState, useEffect, useCallback } from 'react';
import { PerformanceMonitor } from '@/monitoring/PerformanceMonitor';
import { PerformanceReport, PerformanceAlert, ComponentPerformanceData } from '@/monitoring/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertCircle, 
  AlertTriangle, 
  Activity, 
  Zap, 
  TrendingUp,
  Package,
  Brain,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react';

const PerformanceDashboard: React.FC = () => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const loadReport = useCallback(() => {
    const newReport = PerformanceMonitor.getReport();
    setReport(newReport);
    setAlerts(newReport.alerts);
  }, []);

  useEffect(() => {
    loadReport();

    const unsubscribe = PerformanceMonitor.onAlert((alert) => {
      setAlerts(prev => [...prev, alert]);
    });

    return unsubscribe;
  }, [loadReport]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadReport, 2000);
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, loadReport]);

  const exportReport = () => {
    if (!report) return;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `performance-report-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all performance data?')) {
      PerformanceMonitor.clearMetrics();
      loadReport();
    }
  };

  const getSeverityIcon = (severity: PerformanceAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSeverityColor = (severity: PerformanceAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'error':
        return 'default';
      case 'warning':
        return 'secondary';
    }
  };

  if (!report) {
    return <div className="p-8 text-center">Loading performance data...</div>;
  }

  // Prepare chart data
  const memoryChartData = report.memorySnapshots.map(snapshot => ({
    time: new Date(snapshot.timestamp).toLocaleTimeString(),
    used: (snapshot.usedJSHeapSize / (1024 * 1024)).toFixed(2),
    total: (snapshot.totalJSHeapSize / (1024 * 1024)).toFixed(2),
    limit: (snapshot.jsHeapSizeLimit / (1024 * 1024)).toFixed(2)
  }));

  const componentPerfData = Object.values(report.componentData)
    .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
    .slice(0, 10);

  const errorTypeData = report.errors.map(error => ({
    name: error.errorType,
    value: error.count
  }));

  const metricsOverTime = report.metrics
    .filter(m => m.type === 'render')
    .slice(-50)
    .map(m => ({
      time: new Date(m.timestamp).toLocaleTimeString(),
      value: m.value
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoring since {new Date(report.startTime).toLocaleString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearData}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {alerts.slice(-10).reverse().map((alert) => (
                  <Alert key={alert.id} variant={getSeverityColor(alert.severity)}>
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <AlertTitle className="text-sm">
                          {alert.type.replace(/-/g, ' ').toUpperCase()}
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                          {alert.message}
                        </AlertDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundle Size</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.bundleSize ? `${report.bundleSize.toFixed(0)}KB` : 'N/A'}
            </div>
            <Progress 
              value={report.bundleSize ? (report.bundleSize / 1024) * 100 : 0} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Threshold: 1024KB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.errors.reduce((sum, e) => sum + e.count, 0)} errors
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {report.errors.length} unique error types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components Tracked</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(report.componentData).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total renders: {Object.values(report.componentData).reduce((sum, c) => sum + c.renderCount, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.memorySnapshots.length > 0 
                ? `${(report.memorySnapshots[report.memorySnapshots.length - 1].usedJSHeapSize / (1024 * 1024)).toFixed(0)}MB`
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Threshold: 512MB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Render Performance Over Time</CardTitle>
              <CardDescription>Component render times in milliseconds</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage Over Time</CardTitle>
              <CardDescription>JavaScript heap size in MB</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={memoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="used" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stackId="2"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Performance</CardTitle>
              <CardDescription>Average render times by component</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={componentPerfData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="componentName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageRenderTime" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {Object.values(report.componentData)
                    .sort((a, b) => b.renderCount - a.renderCount)
                    .map((component) => (
                      <div key={component.componentName} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{component.componentName}</h4>
                            <div className="text-sm text-muted-foreground mt-1">
                              <p>Load Time: {component.loadTime}ms</p>
                              <p>Renders: {component.renderCount}</p>
                              <p>Avg Render: {component.averageRenderTime.toFixed(2)}ms</p>
                              <p>Last Render: {component.lastRenderTime}ms</p>
                            </div>
                          </div>
                          {component.loadTime > 100 && (
                            <Badge variant="destructive">Slow Load</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          {errorTypeData.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Error Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={errorTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {errorTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {report.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>{error.errorType} ({error.count} occurrences)</AlertTitle>
                          <AlertDescription>
                            {error.errorMessage}
                            {error.componentStack && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs">Component Stack</summary>
                                <pre className="text-xs mt-1 overflow-auto">{error.componentStack}</pre>
                              </details>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No errors recorded</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;