import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressWidgetProps {
  componentId: string;
  isCompleted: boolean;
  timeSpent: number;
  characterName?: string;
  characterColor?: string;
  className?: string;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  componentId,
  isCompleted,
  timeSpent,
  characterName,
  characterColor = 'gray',
  className
}) => {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    pink: 'bg-pink-100 text-pink-700 border-pink-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Completion Status */}
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
        <span className="text-sm font-medium">
          {isCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Time Spent */}
      {timeSpent > 0 && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{timeSpent}m</span>
        </div>
      )}

      {/* Character Badge */}
      {characterName && (
        <Badge 
          variant="secondary" 
          className={cn("text-xs", colorClasses[characterColor])}
        >
          {characterName}
        </Badge>
      )}
    </div>
  );
};

interface MiniProgressBarProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

export const MiniProgressBar: React.FC<MiniProgressBarProps> = ({
  value,
  label,
  className
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{label}</span>
          <span className="text-xs font-medium">{value}%</span>
        </div>
      )}
      <Progress value={value} className="h-1.5" />
    </div>
  );
};