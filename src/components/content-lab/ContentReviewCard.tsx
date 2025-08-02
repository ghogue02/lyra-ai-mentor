import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, MessageSquare, User, Calendar, FileText } from "lucide-react";
import { TemplateContentFormatter } from "@/components/ui/TemplateContentFormatter";
import { format } from "date-fns";

interface ContentReviewCardProps {
  content: {
    id: string;
    title: string;
    content: string;
    content_type: string;
    character_type: string;
    approval_status: string;
    created_at: string;
    source_lesson_id: number | null;
    metadata: any;
  };
}

export const ContentReviewCard = ({ content }: ContentReviewCardProps) => {
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approvalMutation = useMutation({
    mutationFn: async ({ status, feedback }: { status: string; feedback?: string }) => {
      const { error } = await supabase
        .from("generated_content")
        .update({
          approval_status: status,
          approved_at: status === "approved" ? new Date().toISOString() : null,
          metadata: {
            ...content.metadata,
            feedback: feedback || null,
          },
        })
        .eq("id", content.id);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["pending-content"] });
      queryClient.invalidateQueries({ queryKey: ["approved-content"] });
      queryClient.invalidateQueries({ queryKey: ["rejected-content"] });
      
      toast({
        title: "Content Updated",
        description: `Content has been ${status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content status.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    approvalMutation.mutate({ status: "approved", feedback });
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback when rejecting content.",
        variant: "destructive",
      });
      return;
    }
    approvalMutation.mutate({ status: "rejected", feedback });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {content.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {content.character_type}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(content.created_at), "MMM d, yyyy")}
              </span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {content.content_type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Generated Content</Label>
          <div className="mt-2">
            <TemplateContentFormatter 
              content={content.content}
              contentType="general"
              variant="compact"
              showMergeFieldTypes={true}
              className="admin-formatted-content"
            />
          </div>
        </div>

        {content.source_lesson_id && (
          <div className="text-sm text-muted-foreground">
            Source Lesson ID: {content.source_lesson_id}
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <Label htmlFor="feedback">Review Feedback</Label>
          </div>
          <Textarea
            id="feedback"
            placeholder="Add your feedback or comments..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-20"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={handleApprove}
            disabled={approvalMutation.isPending}
            className="flex items-center gap-2"
            variant="default"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={handleReject}
            disabled={approvalMutation.isPending}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};