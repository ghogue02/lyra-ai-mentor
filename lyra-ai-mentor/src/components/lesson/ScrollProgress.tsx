
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  progress: number;
  isCompleted: boolean;
  showLabel?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  progress,
  isCompleted,
  showLabel = true
}) => {
  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-green-600 font-medium">Reading complete</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Reading progress</span>
              </>
            )}
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <Progress 
        value={isCompleted ? 100 : progress} 
        className={cn(
          "h-1 transition-all duration-300",
          isCompleted && "bg-green-100"
        )}
      />
    </div>
  );
};
