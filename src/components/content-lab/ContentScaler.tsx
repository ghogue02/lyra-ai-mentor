import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Zap, Target, Users, BookOpen, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ScalingTarget {
  id: string;
  type: "chapter" | "character" | "lesson";
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
}

interface ScalingJob {
  id: string;
  name: string;
  targets: ScalingTarget[];
  framework: string;
  status: "draft" | "running" | "completed";
  createdAt: Date;
  completedAt?: Date;
}

const availableFrameworks = [
  {
    id: "maya-communication",
    name: "Maya's Communication Framework",
    description: "Challenge-Solution-Transformation cycle with empathetic approach",
    pattern: "Vulnerability → Tool Introduction → Practice → Confidence"
  },
  {
    id: "adaptive-learning",
    name: "Adaptive Learning Pattern",
    description: "Personalized difficulty adjustment based on user progress",
    pattern: "Assessment → Customization → Progression → Mastery"
  },
  {
    id: "collaborative-discovery",
    name: "Collaborative Discovery Framework",
    description: "Peer-to-peer learning with guided exploration",
    pattern: "Exploration → Collaboration → Synthesis → Application"
  }
];

const scalingTargets: ScalingTarget[] = [
  {
    id: "chapter-1",
    type: "chapter",
    name: "Chapter 1: AI Foundations",
    description: "Basic AI concepts and terminology",
    status: "pending",
    progress: 0
  },
  {
    id: "chapter-3",
    type: "chapter", 
    name: "Chapter 3: Advanced Applications",
    description: "Complex AI implementation scenarios",
    status: "pending",
    progress: 0
  },
  {
    id: "sofia-lessons",
    type: "character",
    name: "Sofia's Communication Lessons",
    description: "Voice and presentation focused content",
    status: "pending",
    progress: 0
  },
  {
    id: "david-lessons",
    type: "character",
    name: "David's Data Analysis Lessons", 
    description: "Analytics and problem-solving content",
    status: "pending",
    progress: 0
  },
  {
    id: "rachel-lessons",
    type: "character",
    name: "Rachel's Operations Lessons",
    description: "Process optimization and workflow content",
    status: "pending",
    progress: 0
  }
];

export const ContentScaler = () => {
  const [selectedFramework, setSelectedFramework] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [jobName, setJobName] = useState("");
  const [activeJob, setActiveJob] = useState<ScalingJob | null>(null);
  const [jobHistory, setJobHistory] = useState<ScalingJob[]>([]);

  const startScalingJob = async () => {
    if (!selectedFramework || selectedTargets.length === 0 || !jobName.trim()) {
      toast.error("Please select framework, targets, and enter a job name");
      return;
    }

    try {
      const targets = scalingTargets.filter(target => selectedTargets.includes(target.id));
      const framework = availableFrameworks.find(f => f.id === selectedFramework)!;
      
      const { data, error } = await supabase.functions.invoke('content-scaling', {
        body: {
          action: 'start',
          jobType: 'pattern-application',
          inputData: {
            patterns: framework.pattern,
            targetChapters: targets.filter(t => t.type === 'chapter'),
            targetCharacters: targets.filter(t => t.type === 'character')
          }
        }
      });

      if (error) {
        console.error("Scaling job error:", error);
        toast.error("Failed to start scaling job");
        return;
      }

      const job: ScalingJob = {
        id: data.jobId,
        name: jobName,
        targets: targets.map(t => ({ ...t, status: "pending", progress: 0 })),
        framework: selectedFramework,
        status: "running",
        createdAt: new Date(),
      };

      setActiveJob(job);
      simulateScaling(job);
      toast.success("AI-powered content scaling job started!");
    } catch (error) {
      console.error("Scaling job error:", error);
      toast.error("Failed to start scaling job");
    }
  };

  const simulateScaling = async (job: ScalingJob) => {
    const updatedJob = { ...job };
    
    for (let i = 0; i < updatedJob.targets.length; i++) {
      // Update target status to processing
      updatedJob.targets[i].status = "processing";
      setActiveJob({ ...updatedJob });
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        updatedJob.targets[i].progress = progress;
        setActiveJob({ ...updatedJob });
      }
      
      // Mark as completed
      updatedJob.targets[i].status = "completed";
      setActiveJob({ ...updatedJob });
    }

    // Complete the job
    updatedJob.status = "completed";
    updatedJob.completedAt = new Date();
    setActiveJob({ ...updatedJob });
    setJobHistory(prev => [...prev, updatedJob]);
    
    toast.success("Content scaling job completed!");
  };

  const toggleTarget = (targetId: string) => {
    setSelectedTargets(prev => 
      prev.includes(targetId) 
        ? prev.filter(id => id !== targetId)
        : [...prev, targetId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="new-job" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-job">New Scaling Job</TabsTrigger>
          <TabsTrigger value="active-job">Active Job</TabsTrigger>
          <TabsTrigger value="history">Job History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-job" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Create Scaling Job
              </CardTitle>
              <CardDescription>
                Apply successful patterns across multiple content areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Name</label>
                <Input
                  placeholder="e.g., Maya Framework Rollout Phase 1"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Select Framework</label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a framework to apply..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFrameworks.map((framework) => (
                      <SelectItem key={framework.id} value={framework.id}>
                        <div>
                          <div className="font-medium">{framework.name}</div>
                          <div className="text-sm text-muted-foreground">{framework.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFramework && (
                <Card className="border-primary/20">
                  <CardContent className="pt-4">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Pattern:</div>
                      <div className="text-muted-foreground">
                        {availableFrameworks.find(f => f.id === selectedFramework)?.pattern}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Select Scaling Targets</label>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <div className="space-y-3">
                    {scalingTargets.map((target) => (
                      <div key={target.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Checkbox
                          id={target.id}
                          checked={selectedTargets.includes(target.id)}
                          onCheckedChange={() => toggleTarget(target.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={target.type === "chapter" ? "default" : "secondary"}>
                              {target.type}
                            </Badge>
                            <span className="font-medium">{target.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{target.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Button 
                onClick={startScalingJob}
                className="w-full"
                disabled={!selectedFramework || selectedTargets.length === 0 || !jobName.trim()}
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Scaling Job
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-job" className="space-y-4">
          {!activeJob ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground py-8">
                  No active scaling job. Create one in the "New Scaling Job" tab.
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  {activeJob.name}
                </CardTitle>
                <CardDescription>
                  Framework: {availableFrameworks.find(f => f.id === activeJob.framework)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJob.targets.map((target) => (
                    <div key={target.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(target.status)}
                          <span className="font-medium">{target.name}</span>
                          <Badge variant="outline">{target.type}</Badge>
                        </div>
                        <Badge variant={target.status === "completed" ? "default" : "secondary"}>
                          {target.status}
                        </Badge>
                      </div>
                      <Progress value={target.progress} className="h-2" />
                    </div>
                  ))}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {activeJob.targets.filter(t => t.status === "completed").length} / {activeJob.targets.length} completed
                    </span>
                  </div>
                  <Progress 
                    value={(activeJob.targets.filter(t => t.status === "completed").length / activeJob.targets.length) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {jobHistory.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground py-8">
                  No completed jobs yet. Your scaling job history will appear here.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobHistory.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {job.name}
                      </span>
                      <Badge variant="outline">
                        {job.completedAt?.toLocaleDateString()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {job.targets.length} targets • {availableFrameworks.find(f => f.id === job.framework)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Completed: {job.completedAt?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};