
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from 'lucide-react';

interface QuickActionsProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  suggestedTask?: string;
  onQuickAction: (action: string) => void;
  userProfile?: {
    role?: string;
    first_name?: string;
  };
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  lessonContext,
  suggestedTask,
  onQuickAction,
  userProfile
}) => {
  const getQuickActions = () => {
    const actions = [];
    
    // Add the magical dummy data button as the first action
    actions.push({
      text: "✨ See AI in Action",
      value: "DUMMY_DATA_MAGIC",
      icon: <Sparkles className="w-3 h-3" />,
      special: true
    });
    
    if (suggestedTask) {
      // Make suggested task more concise for mobile
      const shortTask = suggestedTask.length > 30 ? `${suggestedTask.substring(0, 30)}...` : suggestedTask;
      actions.push({ text: shortTask, value: shortTask });
    }
    
    // Add role-specific discovery prompts
    if (userProfile?.role) {
      const roleActions = {
        'fundraising': [
          { text: "My donor challenges", value: "What are your biggest challenges with donor engagement right now?" },
          { text: "Fundraising goals", value: "Tell me about your current fundraising goals and what's holding you back." }
        ],
        'programs': [
          { text: "Program outcomes", value: "What program outcomes are you trying to improve?" },
          { text: "Participant tracking", value: "How do you currently track participant progress and success?" }
        ],
        'operations': [
          { text: "Daily bottlenecks", value: "What operational tasks take up most of your time each day?" },
          { text: "Efficiency goals", value: "If you could automate one thing at work, what would it be?" }
        ],
        'marketing': [
          { text: "Engagement struggles", value: "What's your biggest challenge in reaching your audience?" },
          { text: "Content creation", value: "How much time do you spend creating content each week?" }
        ],
        'leadership': [
          { text: "Strategic priorities", value: "What are your top 3 strategic priorities for the next year?" },
          { text: "Team challenges", value: "What organizational challenges keep you up at night?" }
        ]
      };
      
      const specificActions = roleActions[userProfile.role as keyof typeof roleActions];
      if (specificActions) {
        actions.push(...specificActions.slice(0, 2)); // Limit to 2 for mobile
      }
    }
    
    // Add general discovery prompts
    if (lessonContext) {
      actions.push(
        { text: "Real examples", value: "Can you share a real-world example of this concept?" },
        { text: "My situation", value: "How would this apply to my specific organization?" }
      );
    } else {
      actions.push(
        { text: "Getting started", value: "Where should someone like me start with AI?" },
        { text: "Quick wins", value: "What's the fastest way to see AI benefits?" }
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
      <p className="text-xs text-gray-400 mb-2 font-medium">
        {userProfile?.first_name ? `Quick prompts for ${userProfile.first_name}:` : 'Quick prompts:'}
      </p>
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
