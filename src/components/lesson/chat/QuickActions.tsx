
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  suggestedTask?: string;
  onQuickAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  lessonContext,
  suggestedTask,
  onQuickAction
}) => {
  const getQuickActions = () => {
    const actions = [];
    
    if (suggestedTask) {
      // Make suggested task more concise for mobile
      const shortTask = suggestedTask.length > 30 ? `${suggestedTask.substring(0, 30)}...` : suggestedTask;
      actions.push(shortTask);
    }
    
    if (lessonContext) {
      actions.push("Explain simply");
      actions.push("Show example");
      actions.push("Key takeaway");
      actions.push("How to apply");
    } else {
      actions.push("AI basics");
      actions.push("Nonprofit use");
      actions.push("Examples");
    }
    
    return actions;
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-700 bg-gray-800/50">
      <p className="text-xs text-gray-400 mb-2 font-medium">Quick prompts:</p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {quickActions.map((action) => (
          <Button
            key={action}
            variant="outline"
            size="sm"
            onClick={() => onQuickAction(action)}
            className="flex-shrink-0 text-xs h-7 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-colors px-3 whitespace-nowrap"
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
};
