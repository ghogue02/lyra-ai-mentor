
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { ProfileCompletionReminder } from '@/components/ProfileCompletionReminder';
import { InteractiveAiDemo } from './chat/InteractiveAiDemo';
import { FormattedMessage } from './chat/FormattedMessage';
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
    userProfile,
    engagement
  } = useLyraChat(lessonContext);

  console.log('EmbeddedChat: Using engagement from usePersistentChat:', engagement);

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

  const handleAiDemo = () => {
    sendMessage("Show me the AI magic demo");
  };

  // Create enhanced context-aware quick actions with user-question phrasing
  const getQuickActions = () => {
    const actions = [];
    
    // Always include AI Magic Demo as first option
    actions.push({ 
      text: "✨ AI Magic Demo", 
      value: "Show me the AI magic demo",
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
          { text: "AI for donors?", value: "How can AI help me with my donors?" }
        ],
        'programs': [
          { text: "AI for programs?", value: "How would AI help improve my programs?" }
        ],
        'operations': [
          { text: "AI for efficiency?", value: "What AI tools could reduce my workload?" }
        ],
        'marketing': [
          { text: "AI for content?", value: "Can AI help me create content?" }
        ],
        'leadership': [
          { text: "AI strategy?", value: "How do I implement AI in my organization?" }
        ]
      };
      
      const specificActions = roleActions[userProfile.role as keyof typeof roleActions];
      if (specificActions) {
        actions.push(...specificActions.slice(0, 1)); // Limit to 1 for mobile space
      }
    }
    
    // Add general discovery-focused lesson actions (shorter text)
    if (lessonContext) {
      actions.push({ text: "Examples?", value: "Can you share real examples?" });
    } else {
      actions.push({ text: "Getting started?", value: "Where should I start with AI?" });
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

      {/* Interactive AI Demo */}
      <InteractiveAiDemo
        onSendMessage={sendMessage}
        userProfile={userProfile}
        isVisible={engagement?.shouldShowAiDemo || false}
      />

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
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-purple-400 text-white hover:from-purple-700 hover:to-cyan-600'
                    : 'hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
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
                  {message.isUser ? (
                    message.content
                  ) : (
                    <FormattedMessage 
                      content={message.content} 
                      onSendMessage={sendMessage} 
                    />
                  )}
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
                ? `Try "show me AI demo" or ask anything, ${userProfile.first_name}!`
                : "Try 'show me AI demo' or ask anything!"
            }
            className="flex-1 text-sm"
            disabled={isTyping}
          />
          <Button
            onClick={handleAiDemo}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none px-3 shrink-0"
            title="Try AI Magic Demo"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
          Press Enter to send • Click ✨ for AI Magic Demo • Try: "show me AI demo"
        </p>
      </div>
    </div>
  );
};
