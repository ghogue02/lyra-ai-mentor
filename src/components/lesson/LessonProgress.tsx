
import React, { memo, useMemo } from 'react';
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

const LessonProgressComponent: React.FC<LessonProgressProps> = ({
  completedBlocks,
  totalBlocks,
  completedInteractiveElements,
  totalInteractiveElements,
  isCompleted = false,
  chatEngagement,
  onMarkChapterComplete,
}) => {
  // Memoize calculations to prevent unnecessary re-renders
  const progressData = useMemo(() => {
    const totalItems = totalBlocks + totalInteractiveElements;
    const completedItems = completedBlocks + completedInteractiveElements;
    const contentComplete = completedItems === totalItems;
    const chatComplete = chatEngagement?.hasReachedMinimum || false;
    const isFullyComplete = contentComplete && chatComplete;

    return {
      totalItems,
      completedItems,
      contentComplete,
      chatComplete,
      isFullyComplete
    };
  }, [
    totalBlocks,
    totalInteractiveElements,
    completedBlocks,
    completedInteractiveElements,
    chatEngagement?.hasReachedMinimum
  ]);

  return (
    <div className="space-y-4">
      {/* Simple checkmark badges with stable references */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge 
          className={
            progressData.contentComplete 
              ? "bg-green-100 text-green-700 flex items-center gap-2"
              : "bg-gray-100 text-gray-600 flex items-center gap-2"
          }
        >
          {progressData.contentComplete ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {progressData.contentComplete ? 'Content Complete' : 'Reading Progress'}
        </Badge>
        
        <Badge 
          className={
            progressData.chatComplete 
              ? "bg-purple-100 text-purple-700 flex items-center gap-2"
              : "bg-gray-100 text-gray-600 flex items-center gap-2"
          }
        >
          {progressData.chatComplete ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {progressData.chatComplete ? 'Chat Complete' : 'Chat Pending'}
        </Badge>
        
        {isCompleted && (
          <Badge className="bg-blue-100 text-blue-700 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Chapter Complete
          </Badge>
        )}
      </div>

      {/* Chapter completion button */}
      {progressData.isFullyComplete && !isCompleted && onMarkChapterComplete && (
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

export const LessonProgress = memo(LessonProgressComponent);
