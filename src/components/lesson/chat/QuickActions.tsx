
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
      actions.push(suggestedTask);
    }
    
    if (lessonContext) {
      actions.push("Explain this concept in simple terms");
      actions.push("Give me a real nonprofit example");
      actions.push("What's the key takeaway here?");
      actions.push("How can I apply this at my organization?");
    } else {
      actions.push("What should I know about AI?");
      actions.push("How can AI help nonprofits?");
      actions.push("Give me a practical example");
    }
    
    return actions;
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
      <p className="text-xs text-gray-400 mb-3 font-medium">Try these prompts to get started:</p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Button
            key={action}
            variant="outline"
            size="sm"
            onClick={() => onQuickAction(action)}
            className="text-xs h-8 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-colors"
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
};
