import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, Target, TrendingUp, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  patterns: string[];
  keyMoments: string[];
  successFactors: string[];
  framework: {
    introduction: string;
    challenge: string;
    solution: string;
    transformation: string;
  };
}

export const MayaAnalyzer = () => {
  const [analysisInput, setAnalysisInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeMayaPatterns = async () => {
    if (!analysisInput.trim()) {
      toast.error("Please provide Maya interaction data to analyze");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      // Simulate AI analysis - in real implementation, this would call OpenAI
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Mock analysis result - in real implementation, this would come from AI
      const result: AnalysisResult = {
        patterns: [
          "Challenge-Solution-Transformation cycle",
          "Empathetic problem acknowledgment",
          "Practical tool introduction",
          "Immediate application opportunity",
          "Confidence building through success"
        ],
        keyMoments: [
          "Initial vulnerability sharing",
          "Aha moment during tool explanation",
          "First successful implementation",
          "Confidence boost and motivation spike",
          "Readiness for next challenge"
        ],
        successFactors: [
          "Personalized approach to user's specific situation",
          "Balance of emotional support and practical guidance",
          "Interactive elements that engage multiple senses",
          "Progressive difficulty with achievable milestones",
          "Consistent character voice and personality"
        ],
        framework: {
          introduction: "Establish emotional connection and identify specific challenge",
          challenge: "Present relatable obstacle that resonates with user experience",
          solution: "Introduce practical tool or technique with clear explanation",
          transformation: "Guide user through application and celebrate success"
        }
      };

      setAnalysisResult(result);
      toast.success("Maya pattern analysis completed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze Maya patterns. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Maya Interaction Data</label>
          <Textarea
            placeholder="Paste Maya Chapter 2 interaction logs, user feedback, or conversation transcripts here..."
            value={analysisInput}
            onChange={(e) => setAnalysisInput(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={analyzeMayaPatterns} 
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze Maya Patterns"}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4 animate-pulse" />
              Analyzing interaction patterns...
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="grid gap-4">
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Key Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {analysisResult.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Success Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {analysisResult.successFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-1">
                          ✓
                        </Badge>
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Maya Framework Template
              </CardTitle>
              <CardDescription>
                Extracted framework for replicating Maya's success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(analysisResult.framework).map(([phase, description]) => (
                  <div key={phase} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium capitalize mb-1">{phase}</div>
                      <div className="text-sm text-muted-foreground">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Key Moments Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.keyMoments.map((moment, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm">{moment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};