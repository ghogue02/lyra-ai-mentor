import React, { useState } from 'react';
import { HelpCircle, X, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';

interface CharacterHelpProps {
  characterId: string;
  context: 'email' | 'grant' | 'story' | 'data' | 'workflow' | 'change';
  className?: string;
}

const contextTips: Record<string, Record<string, string[]>> = {
  maya: {
    email: [
      "Start with the sandwich method: positive → request → positive",
      "Use 'we' language to create partnership feeling",
      "Keep paragraphs short - Maya found 3 sentences max works best",
      "Always end with a clear next step or call to action"
    ],
    grant: [
      "Lead with impact numbers from your programs",
      "Use storytelling to make data memorable",
      "Maya's secret: Write the budget justification first",
      "Include testimonials near your ask amount"
    ]
  },
  sofia: {
    story: [
      "Start with a moment, not a statistic",
      "Use sensory details to bring readers into the scene",
      "Sofia's rule: One story, one message",
      "End with transformation, not just resolution"
    ]
  },
  david: {
    data: [
      "Choose one key metric as your North Star",
      "Use comparisons people can visualize",
      "David's trick: Start with the 'so what?'",
      "Three data points maximum per slide"
    ]
  },
  rachel: {
    workflow: [
      "Map the current process before automating",
      "Start with the most repetitive task first",
      "Rachel's insight: Involve the team early",
      "Build in checkpoints for human review"
    ]
  },
  alex: {
    change: [
      "Address fears before presenting benefits",
      "Create small wins in the first week",
      "Alex's approach: Champions, not mandates",
      "Celebrate learning from mistakes publicly"
    ]
  }
};

export const CharacterHelp: React.FC<CharacterHelpProps> = ({
  characterId,
  context,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getStory } = useCharacterStory();
  const story = getStory(characterId);
  
  if (!story) return null;
  
  const tips = contextTips[characterId.toLowerCase()]?.[context] || [];
  
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-purple-600 hover:text-purple-700"
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        {story.name.split(' ')[0]}'s Tips
      </Button>
      
      {isOpen && (
        <Card className="absolute z-50 w-80 p-4 mt-2 right-0 shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: story.color }}
              >
                {story.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{story.name}'s Tips</h4>
                <p className="text-xs text-gray-500">From real experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">
              <Clock className="w-3 h-3 inline mr-1" />
              These tips saved {story.name.split(' ')[0]} {story.timeMetrics.after}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

// Inline help tooltip
export const CharacterTip: React.FC<{
  characterId: string;
  tip: string;
  className?: string;
}> = ({ characterId, tip, className = '' }) => {
  const { getStory } = useCharacterStory();
  const story = getStory(characterId);
  
  if (!story) return null;
  
  return (
    <div className={`flex items-center gap-2 p-2 bg-purple-50 rounded-lg text-sm ${className}`}>
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: story.color }}
      >
        {story.name.charAt(0)}
      </div>
      <p className="text-purple-700">{tip}</p>
    </div>
  );
};