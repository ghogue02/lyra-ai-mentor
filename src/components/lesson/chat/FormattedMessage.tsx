import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, ArrowRight, HelpCircle, RotateCcw } from 'lucide-react';
import { AnimatedDataDisplay } from './AnimatedDataDisplay';
import { AnimatedAnalysisDisplay } from './AnimatedAnalysisDisplay';
import { AnimatedInsightsDisplay } from './AnimatedInsightsDisplay';
import { AnimatedRecommendationsDisplay } from './AnimatedRecommendationsDisplay';

interface FormattedMessageProps {
  content: string;
  isProcessing?: boolean;
  onSendMessage?: (message: string) => void;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ 
  content, 
  isProcessing = false, 
  onSendMessage 
}) => {
  // Check if this is a demo stage message
  const isDemoMessage = content.includes('Demo Progress') || 
                        content.includes('AI Magic Demo') || 
                        content.includes('Step 1:') || 
                        content.includes('Step 2:') || 
                        content.includes('Step 3:') || 
                        content.includes('Step 4:') || 
                        content.includes('Demo Complete') ||
                        content.includes('ready to see AI transform') ||
                        content.includes('Start Demo') ||
                        content.includes('Continue to') ||
                        content.includes('Show Insights') ||
                        content.includes('Get Recommendations');

  const handleDemoAction = (action: string) => {
    if (onSendMessage) {
      // ... keep existing code (demo action handlers)
      if (action === 'continue_loading') {
        onSendMessage('DEMO_STAGE_LOADING');
      } else if (action === 'continue_analysis') {
        onSendMessage('DEMO_STAGE_ANALYSIS');
      } else if (action === 'continue_insights') {
        onSendMessage('DEMO_STAGE_INSIGHTS');
      } else if (action === 'continue_recommendations') {
        onSendMessage('DEMO_STAGE_RECOMMENDATIONS');
      } else if (action === 'restart_demo') {
        onSendMessage('Start the AI demo');
      } else if (action === 'ask_question') {
        onSendMessage('Can you explain what\'s happening in this AI demo step by step?');
      }
    }
  };

  const getDemoControls = () => {
    // ... keep existing code (demo controls logic)
    if (!isDemoMessage || !onSendMessage) return null;

    if (content.includes('AI Magic Demo') || content.includes('ready to see AI transform')) {
      return (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-purple-400 font-medium">Demo Progress: 0%</div>
          </div>
          <Progress value={0} className="h-1.5 mb-3" />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleDemoAction('continue_loading')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-xs h-7"
            >
              <Play className="w-3 h-3 mr-1" />
              Start Demo
            </Button>
            <Button
              onClick={() => handleDemoAction('ask_question')}
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Ask Question
            </Button>
          </div>
        </div>
      );
    }

    if (content.includes('Step 1:') || content.includes('Loading Sample Data')) {
      return (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-purple-400 font-medium">Demo Progress: 25%</div>
          </div>
          <Progress value={25} className="h-1.5 mb-3" />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleDemoAction('continue_analysis')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-xs h-7"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Continue to Analysis
            </Button>
            <Button
              onClick={() => handleDemoAction('ask_question')}
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Ask Question
            </Button>
          </div>
        </div>
      );
    }

    if (content.includes('Step 2:') || content.includes('AI Analysis in Progress')) {
      return (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-purple-400 font-medium">Demo Progress: 50%</div>
          </div>
          <Progress value={50} className="h-1.5 mb-3" />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleDemoAction('continue_insights')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-xs h-7"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Show Insights
            </Button>
            <Button
              onClick={() => handleDemoAction('ask_question')}
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Ask Question
            </Button>
          </div>
        </div>
      );
    }

    if (content.includes('Step 3:') || content.includes('Key Insights Discovered')) {
      return (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-purple-400 font-medium">Demo Progress: 75%</div>
          </div>
          <Progress value={75} className="h-1.5 mb-3" />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleDemoAction('continue_recommendations')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-xs h-7"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Get Recommendations
            </Button>
            <Button
              onClick={() => handleDemoAction('ask_question')}
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Ask Question
            </Button>
          </div>
        </div>
      );
    }

    if (content.includes('Step 4:') || content.includes('Actionable Recommendations') || content.includes('Demo Complete')) {
      return (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-green-400 font-medium">Demo Progress: 100% ✨</div>
          </div>
          <Progress value={100} className="h-1.5 mb-3" />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleDemoAction('restart_demo')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-xs h-7"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Restart Demo
            </Button>
            <Button
              onClick={() => handleDemoAction('ask_question')}
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Ask Question
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            💡 <strong>Pro tip:</strong> This demo used sample data. With your real data, these insights become powerful tools for growth and impact.
          </div>
        </div>
      );
    }

    return null;
  };

  const formatText = (text: string) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Handle data/code blocks with animated display
      if (paragraph.includes('===') || paragraph.includes('CSV') || paragraph.includes('_EXPORT_')) {
        return (
          <AnimatedDataDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle AI analysis content
      if (paragraph.includes('AI Analysis in Progress') || 
          (paragraph.includes('Processing') && paragraph.includes('patterns'))) {
        return (
          <AnimatedAnalysisDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle insights content
      if ((paragraph.includes('PATTERNS DISCOVERED') || paragraph.includes('Hidden Revenue')) &&
          (paragraph.includes('🎯') || paragraph.includes('⚠️') || paragraph.includes('🚀'))) {
        return (
          <AnimatedInsightsDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle recommendations content
      if ((paragraph.includes('Actionable Recommendations') || paragraph.includes('This Week')) &&
          (paragraph.includes('🎯') || paragraph.includes('📧') || paragraph.includes('💰'))) {
        return (
          <AnimatedRecommendationsDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle numbered lists
      if (paragraph.includes('\n') && /^\d+\./.test(paragraph.trim())) {
        const lines = paragraph.split('\n').filter(line => line.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4">
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
              return (
                <li key={lineIndex} className="leading-relaxed">
                  {formatInlineText(cleanLine)}
                </li>
              );
            })}
          </ol>
        );
      }
      
      // Handle bullet lists with emoji or special characters
      if (paragraph.includes('\n') && /^[•·▪▫‣⁃]\s/.test(paragraph.trim())) {
        const lines = paragraph.split('\n').filter(line => line.trim());
        return (
          <ul key={index} className="space-y-2 mb-4">
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^[•·▪▫‣⁃]\s*/, '').trim();
              return (
                <li key={lineIndex} className="leading-relaxed flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>{formatInlineText(cleanLine)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Handle section headers with emojis
      if (/^[🎯🚀⚡📊💡🌟🎉✨🔍💫🎖️🎨]/.test(paragraph)) {
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-purple-600 text-base leading-relaxed animate-fade-in">
              {formatInlineText(paragraph)}
            </h4>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 last:mb-0 leading-relaxed animate-fade-in">
          {formatInlineText(paragraph)}
        </p>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // Convert **text** to bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold text-purple-700">{boldText}</strong>;
      }
      
      // Handle special highlighting for metrics and numbers
      if (/\d+%|\$[\d,]+|[\d,]+\s*(hours|participants|donors)/.test(part)) {
        return <span key={index} className="font-medium text-cyan-600">{part}</span>;
      }
      
      return part;
    });
  };

  return (
    <div className="text-sm leading-relaxed">
      {formatText(content)}
      {getDemoControls()}
    </div>
  );
};
