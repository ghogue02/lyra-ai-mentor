
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from 'lucide-react';

interface LessonProgressProps {
  completedBlocks: number;
  totalBlocks: number;
  completedInteractiveElements: number;
  totalInteractiveElements: number;
  estimatedDuration: number;
  isCompleted?: boolean;
  chatEngagement?: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  onMarkChapterComplete?: () => void;
  hasContentBlocking?: boolean;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({
  completedBlocks,
  totalBlocks,
  completedInteractiveElements,
  totalInteractiveElements,
  isCompleted = false,
  chatEngagement,
  onMarkChapterComplete,
}) => {
  const totalItems = totalBlocks + totalInteractiveElements;
  const completedItems = completedBlocks + completedInteractiveElements;
  const contentComplete = completedItems === totalItems;
  const chatComplete = chatEngagement?.hasReachedMinimum || false;
  const isFullyComplete = contentComplete && chatComplete;

  return (
    <div className="space-y-4">
      {/* Simple checkmark badges */}
      <div className="flex items-center gap-3 flex-wrap">
        {contentComplete ? (
          <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Content Complete
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Reading Progress
          </Badge>
        )}
        
        {chatComplete ? (
          <Badge className="bg-purple-100 text-purple-700 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Chat Complete
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Chat Pending
          </Badge>
        )}
        
        {isCompleted && (
          <Badge className="bg-blue-100 text-blue-700 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Chapter Complete
          </Badge>
        )}
      </div>

      {/* Chapter completion button */}
      {isFullyComplete && !isCompleted && onMarkChapterComplete && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800">Chapter Complete!</h4>
              <p className="text-sm text-green-600 mt-1">
                You've finished all sections. Mark this chapter as complete to continue.
              </p>
            </div>
            <Button
              onClick={onMarkChapterComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Mark Chapter Complete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
