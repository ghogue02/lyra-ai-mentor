
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from 'lucide-react';

interface LessonProgressProps {
  completedBlocks: number;
  totalBlocks: number;
  estimatedDuration: number;
  isCompleted?: boolean;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({
  completedBlocks,
  totalBlocks,
  estimatedDuration,
  isCompleted = false
}) => {
  const progressPercentage = totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {estimatedDuration} min
          </Badge>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>
          )}
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
      </div>
    </div>
  );
};
