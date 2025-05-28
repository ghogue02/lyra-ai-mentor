
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, RotateCcw } from 'lucide-react';

interface QuickActionsProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  suggestedTask?: string;
  onQuickAction: (action: string) => void;
  onResetChat?: () => void;
  userProfile?: {
    role?: string;
    first_name?: string;
  };
  chatEngagement?: {
    exchangeCount: number;
    shouldShowAiDemo: boolean;
  };
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  lessonContext,
  suggestedTask,
  onQuickAction,
  onResetChat,
  userProfile,
  chatEngagement
}) => {
  const getQuickActions = () => {
    const actions = [];

    // Always show AI Magic Demo as first option
    actions.push({
      text: "✨ Try AI Magic Demo",
      value: "Show me the AI magic demo",
      icon: <Sparkles className="w-3 h-3" />,
      special: true
    });
    
    if (suggestedTask) {
      // Make suggested task more concise for mobile
      const shortTask = suggestedTask.length > 30 ? `${suggestedTask.substring(0, 30)}...` : suggestedTask;
      actions.push({
        text: shortTask,
        value: shortTask
      });
    }

    // Add role-specific discovery prompts phrased as user questions to Lyra
    if (userProfile?.role) {
      const roleActions = {
        'fundraising': [{
          text: "AI for donor engagement?",
          value: "How can AI help me with donor engagement?"
        }],
        'programs': [{
          text: "AI for program outcomes?",
          value: "How would AI help me improve my program outcomes?"
        }],
        'operations': [{
          text: "AI to reduce workload?",
          value: "What AI tools could help reduce my daily workload?"
        }],
        'marketing': [{
          text: "AI for content creation?",
          value: "Can AI help me create content more efficiently?"
        }],
        'leadership': [{
          text: "Implementing AI strategically?",
          value: "How do I implement AI strategically across my organization?"
        }]
      };
      const specificActions = roleActions[userProfile.role as keyof typeof roleActions];
      if (specificActions) {
        actions.push(...specificActions.slice(0, 1)); // Limit to 1 for mobile
      }
    }

    // Add general discovery prompts phrased as user questions
    if (lessonContext) {
      actions.push({
        text: "Real examples?",
        value: "Can you share a real-world example of this?"
      });
    } else {
      actions.push({
        text: "Where to start with AI?",
        value: "Where should I start with AI?"
      });
    }
    
    return actions.slice(0, 4); // Limit to 4 actions to avoid clutter
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) {
    return null;
  }

  const handleActionClick = (action: any) => {
    onQuickAction(action.value || action.text);
  };

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-700 bg-gray-800/50">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 font-medium">
          {userProfile?.first_name ? `Quick prompts for ${userProfile.first_name}:` : 'Quick prompts:'}
        </p>
        {onResetChat && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetChat} 
            className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700" 
            title="Reset chat (Dev)"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleActionClick(action)}
            className={`flex-shrink-0 text-xs h-7 transition-all duration-200 whitespace-nowrap ${
              action.special 
                ? 'bg-gradient-to-r from-blue-600 to-green-500 border-blue-400 text-white hover:from-blue-700 hover:to-green-600'
                : 'text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
            }`}
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.text}
          </Button>
        ))}
      </div>
    </div>
  );
};
