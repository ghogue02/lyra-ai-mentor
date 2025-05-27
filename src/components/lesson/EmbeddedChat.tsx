import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { ProfileCompletionReminder } from '@/components/ProfileCompletionReminder';
import { cn } from '@/lib/utils';
import { useLyraChat } from '@/hooks/useLyraChat';

interface EmbeddedChatProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  suggestedTask?: string;
}

export const EmbeddedChat: React.FC<EmbeddedChatProps> = ({ lessonContext, suggestedTask }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    userProfile
  } = useLyraChat(lessonContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    await sendMessage(inputValue);
    inputRef.current?.focus();
    
    // Hide quick actions after first message on mobile to save space
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Create enhanced context-aware quick actions with user-question phrasing
  const getQuickActions = () => {
    const actions = [];
    
    // Magic AI demo button as first action
    actions.push({
      text: "✨ AI Magic Demo",
      value: "DUMMY_DATA_REQUEST",
      special: true
    });
    
    // Always include the suggested task if available (make it shorter for mobile)
    if (suggestedTask) {
      const shortTask = suggestedTask.length > 25 ? `${suggestedTask.substring(0, 25)}...` : suggestedTask;
      actions.push({ text: shortTask, value: shortTask });
    }
    
    // Add role-specific discovery questions phrased as user questions to Lyra
    if (userProfile?.role) {
      const roleActions = {
        'fundraising': [
          { text: "How can AI help my donors?", value: "How can AI help me better engage with my donors?" },
          { text: "What AI fundraising tools exist?", value: "What AI tools are available for fundraising work?" }
        ],
        'programs': [
          { text: "How would AI improve programs?", value: "How would AI help me improve my program outcomes?" },
          { text: "Can AI track participants?", value: "Can AI help me track participant success better?" }
        ],
        'operations': [
          { text: "What AI reduces my workload?", value: "What AI tools could reduce my daily workload?" },
          { text: "How do I automate tasks?", value: "How can I use AI to automate repetitive tasks?" }
        ],
        'marketing': [
          { text: "How does AI help outreach?", value: "How does AI help with audience outreach?" },
          { text: "Can AI create content?", value: "Can AI help me create content more efficiently?" }
        ],
        'leadership': [
          { text: "How do I implement AI?", value: "How should I implement AI across my organization?" },
          { text: "What AI challenges exist?", value: "What challenges should I expect when adopting AI?" }
        ]
      };
      
      const specificActions = roleActions[userProfile.role as keyof typeof roleActions];
      if (specificActions) {
        actions.push(...specificActions.slice(0, 1)); // Limit to 1 for mobile space
      }
    }
    
    // Add general discovery-focused lesson actions (shorter text)
    if (lessonContext) {
      actions.push({ text: "Can you share examples?", value: "Can you share real examples of this?" });
    } else {
      actions.push({ text: "Where should I start?", value: "Where should I start with AI?" });
    }
    
    return actions.slice(0, 4); // Limit to 4 actions to avoid clutter
  };

  const quickActions = getQuickActions();

  const handleQuickAction = (action: any) => {
    sendMessage(action.value || action.text);
    
    // Hide quick actions after use on mobile
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b">
        <div className="flex items-center gap-2 sm:gap-3">
          <LyraAvatar size="sm" withWave={false} />
          <div>
            <h4 className="font-semibold text-purple-600 text-sm sm:text-base">
              Chat with Lyra
              {userProfile?.first_name && (
                <span className="text-xs sm:text-sm text-gray-500 ml-1">
                  • Hi {userProfile.first_name}! 👋
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-500">
              {lessonContext ? `About: ${lessonContext.lessonTitle}` : 'Your AI Learning Mentor'}
              {userProfile?.role && (
                <span className="ml-1 hidden sm:inline">• {userProfile.role} focused</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Profile Completion Reminder */}
      {userProfile && !userProfile.profile_completed && (
        <div className="p-2 sm:p-3 border-b bg-gray-50/50">
          <ProfileCompletionReminder userProfile={userProfile} compact />
        </div>
      )}

      {/* Quick Actions */}
      {showQuickActions && quickActions.length > 0 && (
        <div className="p-2 sm:p-3 border-b bg-gray-50/50">
          <p className="text-xs text-gray-600 mb-2">
            {userProfile?.first_name ? `Quick actions for ${userProfile.first_name}:` : 'Quick actions:'}
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickActions.map((action, index) => (
              <Button
                key={action.value || action.text}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className={`flex-shrink-0 text-xs h-7 transition-all duration-200 whitespace-nowrap ${
                  action.special
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-purple-400 text-white hover:from-purple-700 hover:to-cyan-600 shadow-md'
                    : 'hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                {action.special && <Sparkles className="w-3 h-3 mr-1" />}
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className={cn(
        "flex-1 p-3 sm:p-4",
        isExpanded ? "h-96" : "h-64"
      )}>
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex items-start gap-2 max-w-[85%]",
                message.isUser && "flex-row-reverse"
              )}>
                {!message.isUser && (
                  <LyraAvatar size="sm" withWave={false} className="mt-1" />
                )}
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-lg text-xs sm:text-sm leading-relaxed",
                    message.isUser
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none shadow-sm"
                  )}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <LyraAvatar size="sm" withWave={false} className="mt-1" />
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="border-t p-3 sm:p-4 bg-white">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              userProfile?.first_name 
                ? `What's on your mind, ${userProfile.first_name}?`
                : lessonContext 
                  ? "Ask about this lesson..."
                  : "What questions do you have?"
            }
            className="flex-1 text-sm"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
          Press Enter to send • Try the AI Magic Demo! ✨
        </p>
      </div>
    </div>
  );
};
