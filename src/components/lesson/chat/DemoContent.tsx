
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

interface DemoContentProps {
  stage: string;
  onContinue?: () => void;
}

export const DemoContent: React.FC<DemoContentProps> = ({ stage, onContinue }) => {
  const getDemoStageContent = () => {
    switch (stage) {
      case 'intro':
        return {
          title: '🎯 AI Data Analysis Demo',
          description: 'Ready to see how AI transforms fundraising data? This interactive demo shows you step-by-step how AI finds patterns and creates insights.',
          action: 'Start Demo'
        };
      case 'loading':
        return {
          title: '📊 Step 1: Data Processing',
          description: 'AI loads and processes fundraising data, handling messy formats that would take humans hours to clean.',
          action: 'Continue to Analysis'
        };
      case 'analysis':
        return {
          title: '🔍 Step 2: Pattern Recognition',
          description: 'AI analyzes thousands of data points to find patterns humans would miss.',
          action: 'Show Insights'
        };
      case 'insights':
        return {
          title: '💡 Step 3: Key Insights',
          description: 'AI reveals actionable insights about donor behavior and opportunities.',
          action: 'Get Recommendations'
        };
      case 'complete':
        return {
          title: '✅ Demo Complete',
          description: 'You\'ve seen how AI transforms data into actionable insights. Ready to explore more?',
          action: 'Restart Demo'
        };
      default:
        return null;
    }
  };

  const content = getDemoStageContent();
  if (!content) return null;

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 my-3">
      <h4 className="text-blue-300 font-semibold mb-2">{content.title}</h4>
      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{content.description}</p>
      {onContinue && (
        <Button
          onClick={onContinue}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Play className="w-3 h-3 mr-2" />
          {content.action}
        </Button>
      )}
    </div>
  );
};
