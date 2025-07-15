import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Clock, XCircle, TrendingUp, Users, FileText, Zap } from "lucide-react";
import { format } from "date-fns";

export const ApprovalDashboard = () => {
  const { data: contentStats } = useQuery({
    queryKey: ["content-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("approval_status, content_type, character_type, created_at");
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        pending: data.filter(item => item.approval_status === "pending").length,
        approved: data.filter(item => item.approval_status === "approved").length,
        rejected: data.filter(item => item.approval_status === "rejected").length,
        byType: {} as Record<string, number>,
        byCharacter: {} as Record<string, number>,
        recentActivity: data.slice(-10).reverse(),
      };

      data.forEach(item => {
        stats.byType[item.content_type] = (stats.byType[item.content_type] || 0) + 1;
        stats.byCharacter[item.character_type] = (stats.byCharacter[item.character_type] || 0) + 1;
      });

      return stats;
    },
  });

  const { data: scalingJobs } = useQuery({
    queryKey: ["scaling-jobs-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_scaling_jobs")
        .select("status, job_type, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: prototypeSessions } = useQuery({
    queryKey: ["prototype-sessions-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prototype_sessions")
        .select("status, session_name, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  const approvalRate = contentStats ? 
    Math.round((contentStats.approved / (contentStats.approved + contentStats.rejected)) * 100) : 0;

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <Progress value={approvalRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scaling Jobs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalingJobs?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prototype Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prototypeSessions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
          <TabsTrigger value="jobs">Scaling Jobs</TabsTrigger>
          <TabsTrigger value="prototypes">Prototypes</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(contentStats?.byType || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="capitalize">{type}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content by Character</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(contentStats?.byCharacter || {}).map(([character, count]) => (
                    <div key={character} className="flex items-center justify-between">
                      <span className="capitalize">{character}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Scaling Jobs</CardTitle>
              <CardDescription>Latest content scaling operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {scalingJobs?.map((job) => (
                    <div key={job.created_at} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{job.job_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(job.created_at), "MMM d, yyyy HH:mm")}
                        </div>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prototypes">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prototype Sessions</CardTitle>
              <CardDescription>Recent prototype testing sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {prototypeSessions?.map((session) => (
                    <div key={session.created_at} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{session.session_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(session.created_at), "MMM d, yyyy HH:mm")}
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};