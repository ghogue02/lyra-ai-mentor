import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MessageCircle } from 'lucide-react';
interface LessonProgressProps {
  completedBlocks: number;
  totalBlocks: number;
  estimatedDuration: number;
  isCompleted?: boolean;
  chatEngagement?: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
}
export const LessonProgress: React.FC<LessonProgressProps> = ({
  completedBlocks,
  totalBlocks,
  estimatedDuration,
  isCompleted = false,
  chatEngagement
}) => {
  const progressPercentage = totalBlocks > 0 ? completedBlocks / totalBlocks * 100 : 0;
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {isCompleted && <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>}
          {chatEngagement?.hasReachedMinimum && <Badge className="bg-purple-100 text-purple-700 flex items-center gap-2 animate-fade-in">
              <MessageCircle className="w-3 h-3" />
              Chat Completed
            </Badge>}
        </div>
        <span className="text-sm text-gray-600">
          {completedBlocks} of {totalBlocks} sections
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
        {chatEngagement && chatEngagement.exchangeCount > 0 && <div className="flex justify-between text-xs text-gray-500">
            <span>Chat interactions: {chatEngagement.exchangeCount}/3</span>
            {chatEngagement.hasReachedMinimum && <span className="text-purple-600 font-medium">✓ Learning goal achieved</span>}
          </div>}
      </div>
    </div>;
};