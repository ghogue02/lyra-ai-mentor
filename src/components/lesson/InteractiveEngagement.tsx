
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, Star } from 'lucide-react';
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

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    onInteract();
  };

  const handleUnderstanding = () => {
    onInteract();
  };

  if (isCompleted) {
    return null;
  }

  switch (type) {
    case 'reaction':
      return (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Quick reaction:</span>
          <div className="flex gap-1">
            {['🤔', '💡', '👍'].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-base hover:bg-gray-100 transition-all duration-200 h-8 w-8 p-0",
                  selectedReaction === emoji && "bg-green-100 ring-1 ring-green-200"
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
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm"
          >
            <ThumbsUp className="w-3 h-3" />
            Got it
          </Button>
        </div>
      );

    case 'insight':
      return (
        <div className="flex items-center gap-3">
          <Button
            onClick={onInteract}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm"
          >
            <Star className="w-3 h-3" />
            Key insight
          </Button>
        </div>
      );

    default:
      return null;
  }
};
