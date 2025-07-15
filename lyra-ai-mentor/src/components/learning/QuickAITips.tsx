import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface AITip {
  id: string;
  category: string;
  title: string;
  tip: string;
  example: string;
  emoji: string;
}

const aiTips: AITip[] = [
  {
    id: '1',
    category: 'Prompting',
    title: 'Be Specific Like a Recipe',
    tip: 'AI works best with clear, specific instructions - just like following a recipe!',
    example: 'Instead of "Write email", try "Write a warm, professional email to a concerned parent about their child\'s progress"',
    emoji: '👩‍🍳'
  },
  {
    id: '2',
    category: 'Context',
    title: 'Give AI Background Info',
    tip: 'Context helps AI understand your situation and give better responses',
    example: 'Start with: "I\'m a nonprofit program director who needs to..."',
    emoji: '📚'
  },
  {
    id: '3',
    category: 'Temperature',
    title: 'Adjust AI Creativity',
    tip: 'Temperature controls creativity - low for facts, high for brainstorming',
    example: 'Use low temp (0.3) for reports, high temp (0.8) for creative writing',
    emoji: '🌡️'
  },
  {
    id: '4',
    category: 'Structure',
    title: 'Ask for Step-by-Step',
    tip: 'Adding "step by step" helps AI organize complex responses clearly',
    example: '"Explain step by step how to analyze our donation data"',
    emoji: '📝'
  },
  {
    id: '5',
    category: 'Tone',
    title: 'Describe Your Desired Tone',
    tip: 'Be specific about tone - AI can match any communication style',
    example: '"Professional but friendly" works better than just "formal"',
    emoji: '🎭'
  },
  {
    id: '6',
    category: 'Iteration',
    title: 'Refine and Iterate',
    tip: 'Don\'t accept the first response - ask AI to adjust or improve',
    example: '"Make this more concise" or "Add more empathy"',
    emoji: '🔄'
  },
  {
    id: '7',
    category: 'Examples',
    title: 'Show AI What You Want',
    tip: 'Provide examples of the output style you\'re looking for',
    example: '"Write like this example: [paste your best email]"',
    emoji: '📋'
  },
  {
    id: '8',
    category: 'Constraints',
    title: 'Set Clear Boundaries',
    tip: 'Tell AI what NOT to do as well as what to do',
    example: '"Keep it under 200 words and avoid jargon"',
    emoji: '🚧'
  }
];

interface QuickAITipsProps {
  compact?: boolean;
  category?: string;
}

export const QuickAITips: React.FC<QuickAITipsProps> = ({ compact = false, category }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const filteredTips = category 
    ? aiTips.filter(tip => tip.category === category)
    : aiTips;
  
  const currentTip = filteredTips[currentTipIndex];
  
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  };
  
  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900 text-sm">
                {currentTip.emoji} Quick AI Tip: {currentTip.title}
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                {currentTip.tip}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextTip}
              className="text-yellow-600 hover:text-yellow-700"
            >
              Next tip →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Pro Tips</h3>
              <p className="text-sm text-gray-600">
                Tip {currentTipIndex + 1} of {filteredTips.length}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={prevTip}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={nextTip}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center py-4">
            <span className="text-4xl">{currentTip.emoji}</span>
          </div>
          
          <div>
            <h4 className="font-semibold text-xl text-gray-900 mb-2">
              {currentTip.title}
            </h4>
            <p className="text-gray-700 mb-4">
              {currentTip.tip}
            </p>
          </div>

          <div className="bg-white/70 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Example:
            </p>
            <p className="text-sm text-gray-600 italic">
              "{currentTip.example}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-purple-200">
            <span className="text-sm text-gray-500">
              Category: {currentTip.category}
            </span>
            <div className="flex gap-1">
              {filteredTips.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTipIndex 
                      ? 'bg-purple-600' 
                      : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};