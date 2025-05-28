
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, RotateCcw, X } from 'lucide-react';
import { AnimatedDataTable } from './AnimatedDataTable';
import { AnimatedProgressChart } from './AnimatedProgressChart';
import { StreamingText } from './StreamingText';
import { AIProcessingStage } from './AIProcessingStage';

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
  const [showDataTable, setShowDataTable] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const stages: DemoStage[] = ['intro', 'loading', 'analysis', 'insights', 'recommendations', 'complete'];

  useEffect(() => {
    const currentIndex = stages.indexOf(currentStage);
    setProgress((currentIndex / (stages.length - 1)) * 100);
  }, [currentStage]);

  // Reset to intro when component becomes visible
  useEffect(() => {
    if (isVisible) {
      setCurrentStage('intro');
      setIsPlaying(false);
      setProgress(0);
      setShowDataTable(false);
      setShowProcessing(false);
      setShowInsights(false);
    }
  }, [isVisible]);

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
    setShowDataTable(false);
    setShowProcessing(false);
    setShowInsights(false);
  };

  const analysisSteps = [
    { name: "Data Processing", description: "Loading and cleaning donor records", duration: 2000 },
    { name: "Pattern Analysis", description: "Identifying donation patterns", duration: 1800 },
    { name: "Predictive Modeling", description: "Calculating donor scores", duration: 2200 },
    { name: "Insight Generation", description: "Creating recommendations", duration: 1500 }
  ];

  const insightMetrics = [
    { label: "Monthly Donor Impact", value: 67, color: "blue", detail: "67% of revenue from monthly donors" },
    { label: "Email Engagement", value: 34, color: "green", detail: "34% higher response on Thursdays" },
    { label: "At-Risk Donors", value: 47, color: "red", detail: "47 donors showing decline patterns" },
    { label: "Major Gift Potential", value: 23, color: "purple", detail: "23 prospects identified for cultivation" }
  ];

  const executeCurrentStage = () => {
    setIsPlaying(true);
    
    switch (currentStage) {
      case 'intro':
        setTimeout(() => {
          setCurrentStage('loading');
          setShowDataTable(true);
        }, 1000);
        break;
      case 'loading':
        setTimeout(() => {
          setCurrentStage('analysis');
          setShowProcessing(true);
        }, 4000);
        break;
      case 'analysis':
        setTimeout(() => {
          setCurrentStage('insights');
          setShowInsights(true);
        }, 6000);
        break;
      case 'insights':
        setTimeout(() => {
          setCurrentStage('recommendations');
        }, 5000);
        break;
      case 'recommendations':
        setTimeout(() => {
          setCurrentStage('complete');
          setIsPlaying(false);
        }, 3000);
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
          title: "AI Data Analysis Demo",
          content: `${firstName ? `${firstName}, ready` : 'Ready'} to see how AI transforms fundraising data? This demo shows you step-by-step how AI finds patterns and creates insights from messy data.`,
          subtext: "Using sample data to protect privacy",
          actionText: "Start Demo"
        };
      case 'loading':
        return {
          title: "Step 1: Data Processing",
          content: `AI loads fundraising data and handles the messy formatting that would take humans hours to clean.`,
          subtext: "Processing donor records and standardizing formats",
          actionText: isPlaying ? "Processing..." : "Load Data"
        };
      case 'analysis':
        return {
          title: "Step 2: Pattern Recognition",
          content: "AI analyzes thousands of data points to find patterns humans would miss.",
          subtext: "Running advanced algorithms to identify trends",
          actionText: isPlaying ? "Analyzing..." : "Start Analysis"
        };
      case 'insights':
        return {
          title: "Step 3: Key Insights",
          content: "AI reveals actionable insights about donor behavior and opportunities.",
          subtext: "Discovering revenue patterns and donor preferences",
          actionText: isPlaying ? "Generating..." : "Show Insights"
        };
      case 'recommendations':
        return {
          title: "Step 4: Action Plan",
          content: "AI creates specific recommendations you can implement immediately.",
          subtext: "Converting insights into concrete next steps",
          actionText: isPlaying ? "Creating..." : "Get Recommendations"
        };
      case 'complete':
        return {
          title: "Demo Complete",
          content: "You've seen how AI transforms data into actionable insights. Imagine this with actual fundraising data!",
          subtext: "Ready to explore AI for nonprofit work?",
          actionText: "Restart Demo"
        };
      default:
        return null;
    }
  };

  const content = getDemoContent();
  if (!content) return null;

  return (
    <div className="space-y-4">
      <Card className="border-2 border-blue-200 bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900 text-lg">
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

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>

          <div className="space-y-4">
            <div className="min-h-[60px]">
              <StreamingText 
                text={content.content}
                isVisible={true}
                speed={25}
                className="text-gray-700 leading-relaxed"
              />
            </div>
            
            <p className="text-sm text-gray-500">{content.subtext}</p>

            {currentStage === 'loading' && (
              <AnimatedDataTable
                title="Donor Database Sample"
                isVisible={showDataTable}
                onComplete={() => console.log('Data table complete')}
              />
            )}

            {currentStage === 'analysis' && (
              <AIProcessingStage
                title="AI Analysis Engine"
                steps={analysisSteps}
                isVisible={showProcessing}
                onComplete={() => console.log('Processing complete')}
              />
            )}

            {currentStage === 'insights' && (
              <AnimatedProgressChart
                title="Donor Insights Dashboard"
                items={insightMetrics}
                isVisible={showInsights}
                onComplete={() => console.log('Insights complete')}
              />
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={currentStage === 'complete' ? restartDemo : executeCurrentStage}
                disabled={isPlaying}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
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
            </div>

            {currentStage === 'complete' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Next steps:</strong> This demo used sample data. With real fundraising data, these insights become powerful tools for growing impact and revenue.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
