
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ThumbsUp, Lightbulb, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveEngagementProps {
  type: 'reaction' | 'understanding' | 'highlight' | 'insight';
  onInteract: () => void;
  isCompleted?: boolean;
}

export const InteractiveEngagement: React.FC<InteractiveEngagementProps> = ({
  type,
  onInteract,
  isCompleted = false
}) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState<string>('');

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    onInteract();
  };

  const handleUnderstanding = () => {
    onInteract();
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setHighlightedText(selection.toString());
      onInteract();
    }
  };

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Completed</span>
      </div>
    );
  }

  switch (type) {
    case 'reaction':
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">How does this make you feel?</span>
          <div className="flex gap-1">
            {['🤔', '💡', '👍', '❤️'].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-lg hover:bg-gray-100 transition-all duration-200",
                  selectedReaction === emoji && "bg-green-100 ring-2 ring-green-200"
                )}
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      );

    case 'understanding':
      return (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleUnderstanding}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
          >
            <ThumbsUp className="w-4 h-4" />
            I understand this
          </Button>
        </div>
      );

    case 'highlight':
      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            💡 Highlight important text to continue
          </p>
          {highlightedText && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Highlighted: "{highlightedText.slice(0, 30)}..."
            </Badge>
          )}
        </div>
      );

    case 'insight':
      return (
        <div className="flex items-center gap-3">
          <Button
            onClick={onInteract}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
          >
            <Star className="w-4 h-4" />
            Capture this insight
          </Button>
        </div>
      );

    default:
      return null;
  }
};
