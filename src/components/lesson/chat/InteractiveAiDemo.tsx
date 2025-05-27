
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Play, Pause, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

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
  const [currentStage, setCurrentStage] = useState<DemoStage | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isVisible && !currentStage) {
    return null;
  }

  const startDemo = () => {
    setCurrentStage('intro');
    setIsPlaying(true);
  };

  const proceedToNextStage = () => {
    const stages: DemoStage[] = ['intro', 'loading', 'analysis', 'insights', 'recommendations', 'complete'];
    const currentIndex = stages.indexOf(currentStage!);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resumeDemo = () => {
    setIsPlaying(true);
  };

  const askQuestion = () => {
    onSendMessage("Can you explain what's happening in this AI demo step by step?");
    setIsPlaying(false);
  };

  const restartDemo = () => {
    setCurrentStage('intro');
    setIsPlaying(true);
  };

  const executeDemoStage = () => {
    switch (currentStage) {
      case 'loading':
        onSendMessage("DEMO_STAGE_LOADING");
        break;
      case 'analysis':
        onSendMessage("DEMO_STAGE_ANALYSIS");
        break;
      case 'insights':
        onSendMessage("DEMO_STAGE_INSIGHTS");
        break;
      case 'recommendations':
        onSendMessage("DEMO_STAGE_RECOMMENDATIONS");
        break;
      default:
        onSendMessage("DUMMY_DATA_REQUEST");
    }
  };

  const closeDemo = () => {
    setCurrentStage(null);
    setIsPlaying(false);
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
          showControls: false
        };
      case 'loading':
        return {
          title: "📊 Step 1: Loading Sample Data",
          content: `I'm going to load realistic ${role} data that looks messy and overwhelming - just like your real data probably does.`,
          subtext: "Watch how AI handles complex, unstructured information...",
          actionText: "Load Data",
          showControls: true
        };
      case 'analysis':
        return {
          title: "🔍 Step 2: AI Analysis in Progress",
          content: "Now I'll analyze the data, finding patterns that would take humans hours or days to discover.",
          subtext: "AI can process thousands of data points instantly!",
          actionText: "Start Analysis",
          showControls: true
        };
      case 'insights':
        return {
          title: "💡 Step 3: Key Insights Discovered",
          content: "Here's where the magic happens - AI reveals hidden insights and trends in your data.",
          subtext: "These are the 'aha!' moments that drive better decisions.",
          actionText: "Show Insights",
          showControls: true
        };
      case 'recommendations':
        return {
          title: "🚀 Step 4: Actionable Recommendations",
          content: "Finally, AI translates insights into specific actions you can take today.",
          subtext: "From data to decisions in minutes, not months.",
          actionText: "Get Recommendations",
          showControls: true
        };
      case 'complete':
        return {
          title: "✨ Demo Complete!",
          content: "You've just seen how AI transforms raw data into actionable insights. Imagine doing this with YOUR real data!",
          subtext: "Ready to explore how this applies to your specific challenges?",
          actionText: "Restart Demo",
          showControls: false
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
            onClick={closeDemo}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </Button>
        </div>

        <p className="text-sm text-gray-700 mb-2">{content.content}</p>
        <p className="text-xs text-gray-500 mb-4">{content.subtext}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={currentStage === 'complete' ? restartDemo : () => {
              executeDemoStage();
              if (currentStage !== 'intro') {
                setTimeout(() => proceedToNextStage(), 2000);
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white flex items-center gap-2"
            size="sm"
          >
            {currentStage === 'complete' ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {content.actionText}
          </Button>

          {content.showControls && (
            <>
              {isPlaying ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pauseDemo}
                  className="flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resumeDemo}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Resume
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

              {currentStage !== 'intro' && (
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
            </>
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
