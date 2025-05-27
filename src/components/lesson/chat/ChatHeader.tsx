
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
    <DialogHeader className="p-6 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LyraAvatar size="md" withWave={true} />
          <div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Chat with Lyra
            </DialogTitle>
            <p className="text-sm text-gray-300">
              {lessonContext 
                ? `Getting help with: ${lessonContext.lessonTitle}`
                : 'Your AI Mentor for Nonprofit Leaders'
              }
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-300">
            <Target className="w-4 h-4 text-purple-400" />
            Learning Progress
          </span>
          <Badge variant={engagement.hasReachedMinimum ? "default" : "secondary"} className={engagement.hasReachedMinimum ? "bg-green-600 text-white" : "bg-gray-600 text-gray-200"}>
            {engagement.exchangeCount}/3 exchanges
          </Badge>
        </div>
        <Progress 
          value={(engagement.exchangeCount / 3) * 100} 
          className="h-2 bg-gray-700"
        />
        <p className="text-xs text-gray-400">{getProgressMessage()}</p>
      </div>
    </DialogHeader>
  );
};
