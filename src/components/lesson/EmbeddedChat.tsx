
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Minimize2, Maximize2 } from 'lucide-react';
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

  // Create context-aware quick actions with role-based customization
  const getQuickActions = () => {
    const actions = [];
    
    // Always include the suggested task if available (make it shorter for mobile)
    if (suggestedTask) {
      const shortTask = suggestedTask.length > 25 ? `${suggestedTask.substring(0, 25)}...` : suggestedTask;
      actions.push(shortTask);
    }
    
    // Add role-specific actions based on user profile
    if (userProfile?.role) {
      const roleActions = {
        'fundraising': ['Fundraising tips', 'Donor examples'],
        'programs': ['Program examples', 'Service ideas'],
        'operations': ['Workflow help', 'Efficiency tips'],
        'marketing': ['Marketing ideas', 'Outreach help'],
        'leadership': ['Strategy tips', 'Implementation']
      };
      
      const specificActions = roleActions[userProfile.role as keyof typeof roleActions];
      if (specificActions) {
        actions.push(...specificActions.slice(0, 2)); // Limit to 2 for mobile
      }
    }
    
    // Add general lesson-specific actions (shorter text)
    if (lessonContext) {
      actions.push("Explain", "Key points");
    } else {
      actions.push("Explain", "Examples");
    }
    
    return actions.slice(0, 4); // Limit to 4 actions to avoid clutter
  };

  const quickActions = getQuickActions();

  const handleQuickAction = (action: string) => {
    sendMessage(action);
    
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
                  • Hi {userProfile.first_name}!
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-500">
              {lessonContext ? `About: ${lessonContext.lessonTitle}` : 'Your AI Mentor'}
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
          <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickActions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="flex-shrink-0 text-xs h-7 hover:bg-purple-50 hover:border-purple-300 whitespace-nowrap"
              >
                {action}
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
                ? `Ask me anything, ${userProfile.first_name}...`
                : lessonContext 
                  ? "Ask about this lesson..."
                  : "Ask me anything about AI..."
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
          Press Enter to send
        </p>
      </div>
    </div>
  );
};
