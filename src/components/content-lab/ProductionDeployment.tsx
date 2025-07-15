import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Rocket, CheckCircle, AlertTriangle, History, Target, Zap } from "lucide-react";

export const ProductionDeployment = () => {
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: approvedContent } = useQuery({
    queryKey: ["approved-content-for-deployment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ["lessons-for-deployment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, chapter_id")
        .eq("is_published", true)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: contentBlocks } = useQuery({
    queryKey: ["content-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deploymentMutation = useMutation({
    mutationFn: async ({ contentId, lessonId, deploymentType }: { 
      contentId: string; 
      lessonId: string; 
      deploymentType: string; 
    }) => {
      const content = approvedContent?.find(c => c.id === contentId);
      if (!content) throw new Error("Content not found");

      if (deploymentType === "new-block") {
        // Create new content block
        const { error } = await supabase
          .from("content_blocks")
          .insert({
            lesson_id: parseInt(lessonId),
            title: content.title,
            content: content.content,
            type: content.content_type,
            order_index: 999, // Will be adjusted
            metadata: {
              ...(content.metadata as Record<string, any> || {}),
              deployed_from: contentId,
              deployment_date: new Date().toISOString(),
            },
          });

        if (error) throw error;
      } else if (deploymentType === "replace-block") {
        // Update existing content block
        const { error } = await supabase
          .from("content_blocks")
          .update({
            content: content.content,
          metadata: {
            ...(content.metadata as Record<string, any> || {}),
            deployed_from: contentId,
            deployment_date: new Date().toISOString(),
          },
          })
          .eq("id", parseInt(selectedContent));

        if (error) throw error;
      }

      // Mark content as deployed
      const { error: updateError } = await supabase
        .from("generated_content")
        .update({
        metadata: {
          ...(content.metadata as Record<string, any> || {}),
          deployed: true,
          deployment_date: new Date().toISOString(),
          deployed_to_lesson: lessonId,
        },
        })
        .eq("id", contentId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approved-content-for-deployment"] });
      queryClient.invalidateQueries({ queryKey: ["content-blocks"] });
      
      toast({
        title: "Deployment Successful",
        description: "Content has been deployed to production.",
      });
      
      setSelectedContent("");
      setSelectedLesson("");
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeploy = (deploymentType: string) => {
    if (!selectedContent || !selectedLesson) {
      toast({
        title: "Missing Selection",
        description: "Please select both content and lesson.",
        variant: "destructive",
      });
      return;
    }

    deploymentMutation.mutate({
      contentId: selectedContent,
      lessonId: selectedLesson,
      deploymentType,
    });
  };

  const selectedContentData = approvedContent?.find(c => c.id === selectedContent);
  const selectedLessonData = lessons?.find(l => l.id.toString() === selectedLesson);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Deploy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedContent?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Lessons</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Blocks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentBlocks?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deploy">Deploy Content</TabsTrigger>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Deploy Approved Content
              </CardTitle>
              <CardDescription>
                Deploy approved content to production lessons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Content</label>
                  <Select value={selectedContent} onValueChange={setSelectedContent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose content to deploy" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedContent?.map((content) => (
                        <SelectItem key={content.id} value={content.id}>
                          {content.title} ({content.content_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Lesson</label>
                  <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose target lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessons?.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id.toString()}>
                          {lesson.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedContentData && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Content Preview:</strong> {selectedContentData.title}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Type: {selectedContentData.content_type} | Character: {selectedContentData.character_type}
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleDeploy("new-block")}
                  disabled={!selectedContent || !selectedLesson || deploymentMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Rocket className="h-4 w-4" />
                  Deploy as New Block
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDeploy("replace-block")}
                  disabled={!selectedContent || !selectedLesson || deploymentMutation.isPending}
                >
                  Replace Existing Block
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Deployment History
              </CardTitle>
              <CardDescription>
                Track all content deployments and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {approvedContent?.filter(c => (c.metadata as any)?.deployed).map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Deployed: {(content.metadata as any)?.deployment_date ? 
                            new Date((content.metadata as any).deployment_date).toLocaleString() : 
                            "Unknown"}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Deployed
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