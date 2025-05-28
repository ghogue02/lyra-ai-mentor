
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Play, Pause, HelpCircle, ArrowRight, RotateCcw, X } from 'lucide-react';

interface InteractiveAiDemoProps {
  onSendMessage: (message: string) => void;
  userProfile?: {
    role?: string;
    first_name?: string;
  };
  isVisible: boolean;
}

type DemoStage = 'intro' | 'loading' | 'analysis' | 'insights' | 'recommendations' | 'complete';

export const InteractiveAiDemo: React.FC<InteractiveAiDemoProps> = ({
  onSendMessage,
  userProfile,
  isVisible
}) => {
  const [currentStage, setCurrentStage] = useState<DemoStage>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const stages: DemoStage[] = ['intro', 'loading', 'analysis', 'insights', 'recommendations', 'complete'];

  useEffect(() => {
    const currentIndex = stages.indexOf(currentStage);
    setProgress((currentIndex / (stages.length - 1)) * 100);
  }, [currentStage]);

  if (!isVisible) {
    return null;
  }

  const proceedToNextStage = () => {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const restartDemo = () => {
    setCurrentStage('intro');
    setIsPlaying(false);
    setProgress(0);
  };

  const askQuestion = () => {
    onSendMessage("Can you explain what's happening in this AI demo step by step?");
    setIsPlaying(false);
  };

  const executeCurrentStage = () => {
    setIsPlaying(true);
    
    switch (currentStage) {
      case 'intro':
        onSendMessage("Show me how AI transforms messy data into actionable insights!");
        setTimeout(() => proceedToNextStage(), 1000);
        break;
      case 'loading':
        onSendMessage("DEMO_STAGE_LOADING");
        setTimeout(() => {
          if (isPlaying) proceedToNextStage();
        }, 4000);
        break;
      case 'analysis':
        onSendMessage("DEMO_STAGE_ANALYSIS");
        setTimeout(() => {
          if (isPlaying) proceedToNextStage();
        }, 5000);
        break;
      case 'insights':
        onSendMessage("DEMO_STAGE_INSIGHTS");
        setTimeout(() => {
          if (isPlaying) proceedToNextStage();
        }, 4000);
        break;
      case 'recommendations':
        onSendMessage("DEMO_STAGE_RECOMMENDATIONS");
        setTimeout(() => {
          if (isPlaying) proceedToNextStage();
        }, 4000);
        break;
      case 'complete':
        setIsPlaying(false);
        break;
    }
  };

  const getDemoContent = () => {
    const role = userProfile?.role || 'nonprofit work';
    const firstName = userProfile?.first_name || '';

    switch (currentStage) {
      case 'intro':
        return {
          title: "🎯 AI Magic Demo",
          content: `${firstName ? `${firstName}, ready` : 'Ready'} to see AI transform your ${role} data? This interactive demo will show you step-by-step how AI finds hidden patterns and creates actionable insights.`,
          subtext: "We'll use sample data so you can see the magic without any setup!",
          actionText: "Start Demo",
          canProceed: true
        };
      case 'loading':
        return {
          title: "📊 Step 1: Loading Sample Data",
          content: `Watch AI load realistic ${role} data that looks messy and overwhelming - just like your real data probably does.`,
          subtext: "This is the kind of data that would take humans hours to process...",
          actionText: isPlaying ? "Processing..." : "Load Data",
          canProceed: true
        };
      case 'analysis':
        return {
          title: "🔍 Step 2: AI Analysis in Progress",
          content: "Now AI analyzes the data, finding patterns that would take humans hours or days to discover.",
          subtext: "AI can process thousands of data points instantly!",
          actionText: isPlaying ? "Analyzing..." : "Start Analysis",
          canProceed: true
        };
      case 'insights':
        return {
          title: "💡 Step 3: Key Insights Discovered",
          content: "Here's where the magic happens - AI reveals hidden insights and trends in your data.",
          subtext: "These are the 'aha!' moments that drive better decisions.",
          actionText: isPlaying ? "Revealing..." : "Show Insights",
          canProceed: true
        };
      case 'recommendations':
        return {
          title: "🚀 Step 4: Actionable Recommendations",
          content: "Finally, AI translates insights into specific actions you can take today.",
          subtext: "From data to decisions in minutes, not months.",
          actionText: isPlaying ? "Generating..." : "Get Recommendations",
          canProceed: true
        };
      case 'complete':
        return {
          title: "✨ Demo Complete!",
          content: "You've just seen how AI transforms raw data into actionable insights. Imagine doing this with YOUR real data!",
          subtext: "Ready to explore how this applies to your specific challenges?",
          actionText: "Restart Demo",
          canProceed: false
        };
      default:
        return null;
    }
  };

  const content = getDemoContent();
  if (!content) return null;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-purple-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {content.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStage('intro')}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Demo Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <p className="text-sm text-gray-700 mb-2">{content.content}</p>
        <p className="text-xs text-gray-500 mb-4">{content.subtext}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={currentStage === 'complete' ? restartDemo : executeCurrentStage}
            disabled={isPlaying}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white flex items-center gap-2"
            size="sm"
          >
            {currentStage === 'complete' ? (
              <RotateCcw className="w-4 h-4" />
            ) : isPlaying ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {content.actionText}
          </Button>

          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={askQuestion}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Ask Question
          </Button>

          {currentStage !== 'intro' && currentStage !== 'complete' && (
            <Button
              variant="outline"
              size="sm"
              onClick={proceedToNextStage}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Skip to Next
            </Button>
          )}
        </div>

        {currentStage === 'complete' && (
          <div className="mt-3 p-3 bg-white/50 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 <strong>Pro tip:</strong> This demo used sample data. With your real data, these insights become powerful tools for growth and impact.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
