
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, ArrowRight, HelpCircle, RotateCcw } from 'lucide-react';

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
  const isDemoMessage = content.includes('Demo Progress') || content.includes('AI Magic Demo') || content.includes('Step 1:') || content.includes('Step 2:') || content.includes('Step 3:') || content.includes('Step 4:') || content.includes('Demo Complete');

  const handleDemoAction = (action: string) => {
    if (onSendMessage) {
      if (action === 'continue_loading') {
        onSendMessage('DEMO_STAGE_LOADING');
      } else if (action === 'continue_analysis') {
        onSendMessage('DEMO_STAGE_ANALYSIS');
      } else if (action === 'continue_insights') {
        onSendMessage('DEMO_STAGE_INSIGHTS');
      } else if (action === 'continue_recommendations') {
        onSendMessage('DEMO_STAGE_RECOMMENDATIONS');
      } else if (action === 'restart_demo') {
        onSendMessage('Show me how AI transforms messy data into actionable insights! Start the demo.');
      } else if (action === 'ask_question') {
        onSendMessage('Can you explain what\'s happening in this AI demo step by step?');
      }
    }
  };

  const getDemoControls = () => {
    if (!isDemoMessage || !onSendMessage) return null;

    // Determine which stage we're in based on content
    if (content.includes('AI Magic Demo') && content.includes('Ready to see AI transform')) {
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

    if (content.includes('Step 1: Loading Sample Data')) {
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

    if (content.includes('Step 2: AI Analysis in Progress')) {
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

    if (content.includes('Step 3: Key Insights Discovered')) {
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

    if (content.includes('Step 4: Actionable Recommendations') || content.includes('Demo Complete')) {
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
      
      // Handle AI processing indicators with enhanced animations
      if (paragraph.includes('AI Analysis in Progress') || paragraph.includes('Processing patterns')) {
        return (
          <div key={index} className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/30 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-purple-400 font-medium animate-pulse">AI Processing...</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              {paragraph.split('\n').map((line, lineIdx) => (
                <div key={lineIdx} className="flex items-center space-x-2">
                  <span className="text-cyan-400">⚡</span>
                  <span className="animate-fade-in">{line}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      // Handle data/code blocks (for dummy data display)
      if (paragraph.includes('===') || paragraph.includes('CSV') || paragraph.includes('_EXPORT_')) {
        return (
          <div key={index} className="bg-gray-800 text-green-400 p-3 rounded-lg mb-4 font-mono text-xs overflow-x-auto border border-gray-600 relative">
            <div className="absolute top-2 right-2 flex space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <pre className="whitespace-pre-wrap">{paragraph}</pre>
          </div>
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
