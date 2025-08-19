import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Database,
  Memory,
  RefreshCw,
  Trash2,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useMemoryManager } from '@/hooks/memory-management/useMemoryManager';
import { useMemoryLeakDetector } from '@/hooks/memory-management/useMemoryLeakDetector';
import { useStateGarbageCollector } from '@/hooks/memory-management/useStateGarbageCollector';
import { cn } from '@/lib/utils';

interface MemoryMonitoringDashboardProps {
  className?: string;
  refreshInterval?: number;
  showDetailedMetrics?: boolean;
}

export const MemoryMonitoringDashboard: React.FC<MemoryMonitoringDashboardProps> = ({
  className,
  refreshInterval = 5000,
  showDetailedMetrics = true
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Initialize memory management hooks
  const memoryManager = useMemoryManager({
    trackMetrics: true,
    gcInterval: 30000,
    warningThreshold: 50 * 1024 * 1024, // 50MB
    onMemoryWarning: (metrics) => {
      console.warn('Memory warning:', metrics);
    }
  });

  const leakDetector = useMemoryLeakDetector({
    componentName: 'MemoryMonitoringDashboard',
    trackEventListeners: true,
    trackTimers: true,
    trackMemoryUsage: true,
    onLeakDetected: (report) => {
      console.warn('Memory leak detected:', report);
    }
  });

  const stateGC = useStateGarbageCollector({
    maxStateEntries: 100,
    ttl: 300000,
    gcInterval: 60000
  });

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      memoryManager.collectMetrics();
      memoryManager.cleanupCaches();
      stateGC.runGarbageCollection();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh time
    } finally {
      setIsRefreshing(false);
      setLastRefresh(Date.now());
    }
  };

  // Force garbage collection
  const handleForceGC = () => {
    memoryManager.forceGC();
    memoryManager.cleanupCaches();
    stateGC.runGarbageCollection();
  };

  // Clear all caches
  const handleClearCaches = () => {
    memoryManager.cleanupCaches();
    stateGC.clearState();
  };

  // Get memory usage percentage
  const getMemoryUsagePercentage = () => {
    if (!memoryManager.metrics) return 0;
    return Math.round((memoryManager.metrics.heapUsed / memoryManager.metrics.heapTotal) * 100);
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const memoryUsagePercentage = getMemoryUsagePercentage();
  const leakSummary = leakDetector.getLeakSummary();
  const stateStats = stateGC.getStats();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Memory Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time memory usage and leak detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceGC}
          >
            <Zap className="h-4 w-4 mr-2" />
            Force GC
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCaches}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Caches
          </Button>
        </div>
      </div>

      {/* Memory Alerts */}
      {leakDetector.hasCriticalLeaks && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Memory Leaks Detected</AlertTitle>
          <AlertDescription>
            {leakSummary.critical} critical memory leaks found. Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {memoryUsagePercentage > 80 && (
        <Alert variant="destructive">
          <Memory className="h-4 w-4" />
          <AlertTitle>High Memory Usage</AlertTitle>
          <AlertDescription>
            Memory usage is at {memoryUsagePercentage}%. Consider clearing caches or restarting the application.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Memory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryUsagePercentage}%</div>
            <Progress value={memoryUsagePercentage} className="mt-2" />
            {memoryManager.metrics && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatBytes(memoryManager.metrics.heapUsed)} / {formatBytes(memoryManager.metrics.heapTotal)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Memory Leaks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Leaks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leakSummary.total}</div>
            <div className="flex gap-1 mt-2">
              {leakSummary.critical > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {leakSummary.critical} Critical
                </Badge>
              )}
              {leakSummary.high > 0 && (
                <Badge variant="secondary" className="text-xs text-orange-600">
                  {leakSummary.high} High
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Caches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Caches</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryManager.totalCaches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              State entries: {stateStats.totalEntries}
            </p>
            <p className="text-xs text-muted-foreground">
              Cache size: {formatBytes(stateStats.totalSize)}
            </p>
          </CardContent>
        </Card>

        {/* Component Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Component Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leakDetector.metrics.renderCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Renders: {leakDetector.metrics.renderCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Event listeners: {leakDetector.metrics.eventListeners}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      {showDetailedMetrics && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Memory Leak Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Memory Leak Reports
              </CardTitle>
              <CardDescription>
                Recent memory leak detections and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leakDetector.reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No memory leaks detected
                  </p>
                ) : (
                  leakDetector.reports.slice(-5).map((report, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{report.leakType}</p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                    </div>
                  ))
                )}
                {leakDetector.reports.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={leakDetector.clearReports}
                    className="w-full"
                  >
                    Clear Reports
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cache Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Cache Statistics
              </CardTitle>
              <CardDescription>
                Memory usage breakdown and cache performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Total Entries</p>
                    <p className="text-muted-foreground">{stateStats.totalEntries}</p>
                  </div>
                  <div>
                    <p className="font-medium">Cache Size</p>
                    <p className="text-muted-foreground">{formatBytes(stateStats.totalSize)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Max Entries</p>
                    <p className="text-muted-foreground">{stateStats.maxEntries}</p>
                  </div>
                  <div>
                    <p className="font-medium">TTL</p>
                    <p className="text-muted-foreground">{Math.round(stateStats.ttl / 1000)}s</p>
                  </div>
                </div>
                
                {stateStats.priorityStats && Object.keys(stateStats.priorityStats).length > 0 && (
                  <div>
                    <p className="font-medium text-sm mb-2">Priority Distribution</p>
                    <div className="space-y-2">
                      {Object.entries(stateStats.priorityStats).map(([priority, count]) => (
                        <div key={priority} className="flex justify-between text-sm">
                          <span className="capitalize">{priority}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Last updated: {new Date(lastRefresh).toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-4">
          <span>Weak refs: {memoryManager.totalWeakRefs}</span>
          <span>Timers: {leakDetector.metrics.timers}</span>
          <span>DOM refs: {leakDetector.metrics.domReferences}</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryMonitoringDashboard;