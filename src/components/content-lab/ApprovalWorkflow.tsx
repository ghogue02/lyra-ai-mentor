import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentReviewCard } from "./ContentReviewCard";
import { ApprovalDashboard } from "./ApprovalDashboard";
import { ProductionDeployment } from "./ProductionDeployment";
import { MonitoringDashboard } from "./MonitoringDashboard";
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { TemplateContentFormatter } from "@/components/ui/TemplateContentFormatter";

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  content_type: string;
  character_type: string;
  approval_status: string;
  created_at: string;
  source_lesson_id: number | null;
  metadata: any;
}

export const ApprovalWorkflow = () => {
  const [activeTab, setActiveTab] = useState("review");

  const { data: pendingContent, isLoading } = useQuery({
    queryKey: ["pending-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as GeneratedContent[];
    },
  });

  const { data: approvedContent } = useQuery({
    queryKey: ["approved-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as GeneratedContent[];
    },
  });

  const { data: rejectedContent } = useQuery({
    queryKey: ["rejected-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("approval_status", "rejected")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as GeneratedContent[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingContent?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedContent?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedContent?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="review">Content Review</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pending Content Review</h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {pendingContent?.length || 0} items
            </Badge>
          </div>
          
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-4">
              {pendingContent?.map((content) => (
                <ContentReviewCard key={content.id} content={content} />
              ))}
              {(!pendingContent || pendingContent.length === 0) && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">No pending content to review</div>
                  <TemplateContentFormatter 
                    content="All content has been reviewed. New submissions will appear here for approval."
                    contentType="general"
                    variant="compact"
                    showMergeFieldTypes={false}
                    className="admin-formatted-content text-sm"
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="dashboard">
          <ApprovalDashboard />
        </TabsContent>

        <TabsContent value="deployment">
          <ProductionDeployment />
        </TabsContent>

        <TabsContent value="monitoring">
          <MonitoringDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};