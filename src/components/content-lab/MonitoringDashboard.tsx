import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, AlertTriangle, TrendingUp, Zap, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";

export const MonitoringDashboard = () => {
  const { data: systemMetrics } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      // Get content generation statistics
      const { data: contentData, error: contentError } = await supabase
        .from("generated_content")
        .select("created_at, content_type, character_type, approval_status");
      
      if (contentError) throw contentError;

      // Get scaling job statistics
      const { data: jobsData, error: jobsError } = await supabase
        .from("content_scaling_jobs")
        .select("created_at, status, job_type");
      
      if (jobsError) throw jobsError;

      // Get analysis results
      const { data: analysisData, error: analysisError } = await supabase
        .from("maya_analysis_results")
        .select("created_at, analysis_type, confidence_score");
      
      if (analysisError) throw analysisError;

      // Calculate metrics
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recent24h = contentData.filter(item => new Date(item.created_at) > last24Hours);
      const recent7d = contentData.filter(item => new Date(item.created_at) > last7Days);

      const successRate = contentData.length > 0 ? 
        Math.round((contentData.filter(item => item.approval_status === "approved").length / contentData.length) * 100) : 0;

      const avgConfidence = analysisData.length > 0 ?
        Math.round(analysisData.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / analysisData.length) : 0;

      return {
        totalContent: contentData.length,
        content24h: recent24h.length,
        content7d: recent7d.length,
        successRate,
        avgConfidence,
        totalJobs: jobsData.length,
        failedJobs: jobsData.filter(job => job.status === "failed").length,
        recentActivity: [
          ...contentData.slice(-5).map(item => ({
            type: "content",
            title: `Generated ${item.content_type}`,
            timestamp: item.created_at,
            status: item.approval_status,
          })),
          ...jobsData.slice(-5).map(item => ({
            type: "job",
            title: `Scaling job: ${item.job_type}`,
            timestamp: item.created_at,
            status: item.status,
          })),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10),
      };
    },
  });

  const { data: performanceMetrics } = useQuery({
    queryKey: ["performance-metrics"],
    queryFn: async () => {
      // Simulate performance metrics (in real app, this would come from monitoring service)
      return {
        avgResponseTime: 1200, // ms
        errorRate: 2.1, // %
        throughput: 45, // requests/min
        uptime: 99.8, // %
        estimatedCost: 12.45, // $
      };
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
      case "running":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthStatus = () => {
    if (!systemMetrics || !performanceMetrics) return "loading";
    
    const issues = [];
    if (performanceMetrics.errorRate > 5) issues.push("High error rate");
    if (performanceMetrics.avgResponseTime > 2000) issues.push("Slow response time");
    if (performanceMetrics.uptime < 99) issues.push("Low uptime");
    if (systemMetrics.failedJobs > 5) issues.push("Multiple failed jobs");
    
    return issues.length === 0 ? "healthy" : issues.length < 3 ? "warning" : "critical";
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* System Health Alert */}
      {healthStatus !== "healthy" && (
        <Alert variant={healthStatus === "critical" ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System status: {healthStatus}. {healthStatus === "critical" ? "Immediate attention required." : "Monitor closely."}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.totalContent || 0}</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics?.content24h || 0} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.successRate || 0}%</div>
            <Progress value={systemMetrics?.successRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics?.avgResponseTime || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              Error rate: {performanceMetrics?.errorRate || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${performanceMetrics?.estimatedCost || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity
              </CardTitle>
              <CardDescription>Real-time activity across all ContentLab functions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {systemMetrics?.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(activity.timestamp), "MMM d, yyyy HH:mm")}
                        </div>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <span className="font-medium">{performanceMetrics?.uptime || 0}%</span>
                  </div>
                  <Progress value={performanceMetrics?.uptime || 0} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Error Rate</span>
                    <span className="font-medium">{performanceMetrics?.errorRate || 0}%</span>
                  </div>
                  <Progress value={performanceMetrics?.errorRate || 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performanceMetrics?.throughput || 0}</div>
                <p className="text-sm text-muted-foreground">requests per minute</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Weekly Trends</h4>
                  <div className="text-sm text-muted-foreground">
                    Content generated this week: {systemMetrics?.content7d || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average confidence score: {systemMetrics?.avgConfidence || 0}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">System Health</h4>
                  <div className="text-sm text-muted-foreground">
                    Failed jobs: {systemMetrics?.failedJobs || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total jobs processed: {systemMetrics?.totalJobs || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};