
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
    
    // Add AI Magic Demo button if user has engaged enough
    if (chatEngagement?.shouldShowAiDemo) {
      actions.push({
        text: "✨ See AI Magic Demo",
        value: "DUMMY_DATA_MAGIC",
        icon: <Sparkles className="w-3 h-3" />,
        special: true
      });
    }
    
    if (suggestedTask) {
      // Make suggested task more concise for mobile
      const shortTask = suggestedTask.length > 30 ? `${suggestedTask.substring(0, 30)}...` : suggestedTask;
      actions.push({ text: shortTask, value: shortTask });
    }
    
    // Add role-specific discovery prompts phrased as user questions to Lyra
    if (userProfile?.role) {
      const roleActions = {
        'fundraising': [
          { text: "How can AI help with my donor challenges?", value: "How can AI help me navigate my donor engagement challenges?" },
          { text: "What AI tools exist for fundraising?", value: "What AI tools could help me achieve my fundraising goals?" }
        ],
        'programs': [
          { text: "How would AI improve my programs?", value: "How would AI help me improve my program outcomes?" },
          { text: "Can AI help track participants?", value: "Can AI help me better track participant progress and success?" }
        ],
        'operations': [
          { text: "What AI tools reduce my workload?", value: "What AI tools could help reduce my daily operational workload?" },
          { text: "How can I automate repetitive tasks?", value: "How can I use AI to automate my most time-consuming tasks?" }
        ],
        'marketing': [
          { text: "How does AI help reach audiences?", value: "How does AI help nonprofits reach their target audience better?" },
          { text: "Can AI speed up content creation?", value: "Can AI help me create content more efficiently?" }
        ],
        'leadership': [
          { text: "How do I implement AI strategically?", value: "How do I implement AI strategically across my organization?" },
          { text: "What AI challenges should I expect?", value: "What organizational challenges should I expect when adopting AI?" }
        ]
      };
      
      const specificActions = roleActions[userProfile.role as keyof typeof roleActions];
      if (specificActions) {
        actions.push(...specificActions.slice(0, 2)); // Limit to 2 for mobile
      }
    }
    
    // Add general discovery prompts phrased as user questions
    if (lessonContext) {
      actions.push(
        { text: "Can you share real examples?", value: "Can you share a real-world example of this concept in action?" },
        { text: "How does this apply to me?", value: "How would this specifically apply to my organization?" }
      );
    } else {
      actions.push(
        { text: "Where should I start with AI?", value: "Where should someone like me start with AI implementation?" },
        { text: "What are the quickest AI wins?", value: "What are the fastest ways to see AI benefits in my work?" }
      );
    }
    
    return actions.slice(0, 5); // Limit to 5 actions to avoid clutter
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) {
    return null;
  }

  const handleActionClick = (action: any) => {
    if (action.value === "DUMMY_DATA_MAGIC") {
      // Special handling for dummy data magic button
      onQuickAction("DUMMY_DATA_REQUEST");
    } else {
      onQuickAction(action.value || action.text);
    }
  };

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-700 bg-gray-800/50">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 font-medium">
          {userProfile?.first_name ? `Quick prompts for ${userProfile.first_name}:` : 'Quick prompts:'}
          {chatEngagement?.shouldShowAiDemo && (
            <span className="ml-2 text-purple-300">• AI Demo Available!</span>
          )}
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
            key={action.value || action.text}
            variant="outline"
            size="sm"
            onClick={() => handleActionClick(action)}
            className={`flex-shrink-0 text-xs h-7 transition-all duration-200 px-3 whitespace-nowrap ${
              action.special
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-purple-400 text-white hover:from-purple-700 hover:to-cyan-600 hover:border-purple-300 shadow-lg hover:shadow-xl animate-pulse'
                : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500'
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
