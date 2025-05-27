
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MessageCircle } from 'lucide-react';

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
  estimatedDuration,
  isCompleted = false,
  chatEngagement,
  onMarkChapterComplete,
  hasContentBlocking = false
}) => {
  const totalItems = totalBlocks + totalInteractiveElements;
  const completedItems = completedBlocks + completedInteractiveElements;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isFullyComplete = progressPercentage === 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>
          )}
          {chatEngagement?.hasReachedMinimum && (
            <Badge className="bg-purple-100 text-purple-700 flex items-center gap-2 animate-fade-in">
              <MessageCircle className="w-3 h-3" />
              Chat Completed
            </Badge>
          )}
          {hasContentBlocking && !chatEngagement?.hasReachedMinimum && (
            <Badge className="bg-orange-100 text-orange-700 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Content Locked
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {completedItems} of {totalItems} sections
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Content blocks: {completedBlocks}/{totalBlocks}</span>
          <span>Interactive elements: {completedInteractiveElements}/{totalInteractiveElements}</span>
        </div>
        
        {chatEngagement && chatEngagement.exchangeCount > 0 && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Chat interactions: {chatEngagement.exchangeCount}/3</span>
            {chatEngagement.hasReachedMinimum ? (
              <span className="text-purple-600 font-medium">✓ Learning goal achieved</span>
            ) : hasContentBlocking ? (
              <span className="text-orange-600 font-medium">Complete to unlock content</span>
            ) : null}
          </div>
        )}
        
        {hasContentBlocking && !chatEngagement?.hasReachedMinimum && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
            <strong>Note:</strong> Some lesson content is locked until you complete the chat interaction above.
          </div>
        )}
      </div>

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
