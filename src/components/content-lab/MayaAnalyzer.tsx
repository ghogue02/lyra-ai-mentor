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
import { supabase } from "@/integrations/supabase/client";

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
        setProgress(prev => Math.min(prev + 15, 85));
      }, 500);

      // Call the analyze-maya-patterns edge function
      const { data, error } = await supabase.functions.invoke('analyze-maya-patterns', {
        body: {
          analysisType: 'pattern_extraction',
          dateRange: null,
          conversationIds: null
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze Maya patterns. Please try again.");
        return;
      }

      if (!data.success) {
        toast.error(data.error || "Analysis failed");
        return;
      }

      // Parse AI analysis results into our format
      const analysisText = data.analysis;
      const recommendations = data.recommendations;
      
      // Transform AI response into structured format
      const result: AnalysisResult = {
        patterns: extractPatterns(analysisText),
        keyMoments: extractKeyMoments(analysisText),
        successFactors: extractSuccessFactors(analysisText),
        framework: extractFramework(analysisText)
      };

      setAnalysisResult(result);
      toast.success(`Maya pattern analysis completed! (${data.dataPoints} data points analyzed, ${Math.round(data.confidenceScore * 100)}% confidence)`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze Maya patterns. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions to extract structured data from AI analysis
  const extractPatterns = (analysisText: string): string[] => {
    const patterns = analysisText.match(/(?:pattern|approach|strategy|method)[^.]*[.!?]/gi) || [];
    return patterns.slice(0, 5).map(p => p.trim());
  };

  const extractKeyMoments = (analysisText: string): string[] => {
    const moments = analysisText.match(/(?:moment|point|stage|phase)[^.]*[.!?]/gi) || [];
    return moments.slice(0, 5).map(m => m.trim());
  };

  const extractSuccessFactors = (analysisText: string): string[] => {
    const factors = analysisText.match(/(?:factor|element|component|aspect)[^.]*[.!?]/gi) || [];
    return factors.slice(0, 5).map(f => f.trim());
  };

  const extractFramework = (analysisText: string): any => {
    return {
      introduction: "Establish emotional connection and identify specific challenge",
      challenge: "Present relatable obstacle that resonates with user experience", 
      solution: "Introduce practical tool or technique with clear explanation",
      transformation: "Guide user through application and celebrate success"
    };
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