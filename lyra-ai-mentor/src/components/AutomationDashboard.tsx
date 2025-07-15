import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Activity,
  Calendar,
  Zap,
  Database,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentAutomationPipeline, QueueStatus } from '@/services/contentAutomationPipeline';
import { AutomationScheduler, SchedulerStatus } from '@/services/automationScheduler';

interface AutomationDashboardProps {
  className?: string;
}

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({ className }) => {
  const [pipeline] = useState(new ContentAutomationPipeline());
  const [scheduler] = useState(new AutomationScheduler());
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh
    const interval = setInterval(loadData, 5000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    try {
      const [queueData, schedulerData] = await Promise.all([
        pipeline.getQueueStatus(),
        scheduler.getSchedulerStatus()
      ]);
      
      setQueueStatus(queueData);
      setSchedulerStatus(schedulerData);
    } catch (error) {
      console.error('Error loading automation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScheduler = async () => {
    try {
      await scheduler.start();
      await loadData();
    } catch (error) {
      console.error('Error starting scheduler:', error);
    }
  };

  const handleStopScheduler = async () => {
    try {
      await scheduler.stop();
      await loadData();
    } catch (error) {
      console.error('Error stopping scheduler:', error);
    }
  };

  const handleCreateTestJob = async () => {
    try {
      await pipeline.createJob('single_content', {
        chapterNumber: 4,
        characterId: 'david',
        templateId: 'interactive-builder',
        customVariables: {
          skillName: 'Data Analysis',
          practicalScenario: 'Performance metrics dashboard'
        }
      }, 'medium');
      
      await loadData();
    } catch (error) {
      console.error('Error creating test job:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading automation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automation Dashboard</h1>
          <p className="text-gray-600">Monitor and control the content scaling automation system</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateTestJob} variant="outline">
            Create Test Job
          </Button>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              Queue Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {queueStatus?.queueHealthScore || 0}%
            </div>
            <Progress value={queueStatus?.queueHealthScore || 0} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {queueStatus?.total || 0}
            </div>
            <p className="text-xs text-gray-600">
              {queueStatus?.completed || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Avg Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {queueStatus?.averageProcessingTime 
                ? `${Math.round(queueStatus.averageProcessingTime / 1000)}s`
                : '0s'
              }
            </div>
            <p className="text-xs text-gray-600">
              Per job average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Scheduler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={schedulerStatus?.isRunning ? "default" : "secondary"}>
                {schedulerStatus?.isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleStartScheduler}
                disabled={schedulerStatus?.isRunning}
              >
                <Play className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStopScheduler}
                disabled={!schedulerStatus?.isRunning}
              >
                <Pause className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue">Job Queue</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Job Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Queue Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <Badge variant="outline">{queueStatus?.pending || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing</span>
                  <Badge variant="secondary">{queueStatus?.processing || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="default">{queueStatus?.completed || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Failed</span>
                  <Badge variant="destructive">{queueStatus?.failed || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={handleCreateTestJob}
                  className="w-full"
                  variant="outline"
                >
                  Create Test Job
                </Button>
                <Button 
                  onClick={() => pipeline.processChapterBatch([4, 5], { priority: 'high' })}
                  className="w-full"
                  variant="outline"
                >
                  Process Chapters 4-5
                </Button>
                <Button 
                  onClick={() => pipeline.processLearningPath('Advanced Analytics', [4, 5, 6], ['data-analysis', 'visualization'])}
                  className="w-full"
                  variant="outline"
                >
                  Create Learning Path
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduler Tab */}
        <TabsContent value="scheduler" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Scheduled Tasks
                </CardTitle>
                <CardDescription>
                  Total: {schedulerStatus?.totalTasks || 0} | 
                  Active: {schedulerStatus?.activeTasks || 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schedulerStatus?.upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{task.name}</p>
                        <p className="text-xs text-gray-600">
                          Next: {task.nextRun.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{task.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Runs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schedulerStatus?.recentRuns.map(run => (
                    <div key={run.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">Task Run</p>
                        <p className="text-xs text-gray-600">
                          {run.startTime.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        <span className={`text-xs ${getStatusColor(run.status)}`}>
                          {run.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {schedulerStatus?.systemHealth || 100}%
                </div>
                <Progress value={schedulerStatus?.systemHealth || 100} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">
                  Overall system performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Queue Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {queueStatus?.queueHealthScore || 0}%
                </div>
                <Progress value={queueStatus?.queueHealthScore || 0} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">
                  Job processing efficiency
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {queueStatus?.completed || 0}
                </div>
                <p className="text-xs text-gray-600">
                  Jobs completed today
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{queueStatus?.total || 0}</div>
                  <div className="text-xs text-gray-600">Total Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {queueStatus?.averageProcessingTime 
                      ? `${Math.round(queueStatus.averageProcessingTime / 1000)}s`
                      : '0s'
                    }
                  </div>
                  <div className="text-xs text-gray-600">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {queueStatus && queueStatus.total > 0 
                      ? `${Math.round((queueStatus.completed / queueStatus.total) * 100)}%`
                      : '0%'
                    }
                  </div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{schedulerStatus?.activeTasks || 0}</div>
                  <div className="text-xs text-gray-600">Active Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Queue Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Max Concurrent Jobs</span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retry Attempts</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Queue Health Threshold</span>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Scheduler Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Check Interval</span>
                      <span className="text-sm font-medium">30s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Task History</span>
                      <span className="text-sm font-medium">100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cleanup Interval</span>
                      <span className="text-sm font-medium">24h</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={() => scheduler.createPredefinedTasks()} className="w-full">
                  Create Predefined Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationDashboard;