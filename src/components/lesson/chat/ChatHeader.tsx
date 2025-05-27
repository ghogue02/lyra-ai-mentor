
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, Target } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';

interface ChatHeaderProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  engagement: {
    exchangeCount: number;
    hasReachedMinimum: boolean;
  };
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  lessonContext,
  engagement,
  onClose
}) => {
  const getProgressMessage = () => {
    if (engagement.hasReachedMinimum) {
      return "Great job! You've completed the recommended interaction.";
    }
    const remaining = 3 - engagement.exchangeCount;
    if (engagement.exchangeCount > 0) {
      return `Keep going! ${remaining} more exchange${remaining === 1 ? '' : 's'} to complete your learning session.`;
    }
    return "Start chatting with Lyra to get personalized help!";
  };

  return (
    <DialogHeader className="spacing-mobile spacing-mobile-y border-b border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <LyraAvatar size="md" withWave={true} className="flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-lg sm:text-xl font-bold gradient-text truncate">
              Chat with Lyra
            </DialogTitle>
            {lessonContext?.lessonTitle && (
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                About: {lessonContext.lessonTitle}
              </p>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="mobile-button h-8 w-8 sm:h-10 sm:w-10 p-0 text-gray-400 hover:text-white flex-shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-3 sm:mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
          <span className="flex items-center gap-1 sm:gap-2 text-gray-300 truncate">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
            <span className="truncate">Learning Progress</span>
          </span>
          <Badge 
            variant={engagement.hasReachedMinimum ? "default" : "secondary"} 
            className={`${
              engagement.hasReachedMinimum 
                ? "bg-green-600 text-white" 
                : "bg-gray-600 text-gray-200"
            } text-xs px-2 py-1 flex-shrink-0`}
          >
            {engagement.exchangeCount}/3
          </Badge>
        </div>
        <Progress 
          value={engagement.exchangeCount / 3 * 100} 
          className="h-1.5 sm:h-2 bg-gray-700" 
        />
        <p className="text-xs text-gray-400 leading-relaxed">
          {getProgressMessage()}
        </p>
      </div>
    </DialogHeader>
  );
};
