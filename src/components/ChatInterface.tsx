
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, MessageCircle, Trash2, Minimize2 } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useLyraChat } from '@/hooks/useLyraChat';

interface ChatInterfaceProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isExpanded = false, 
  onToggleExpanded,
  lessonContext 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      onToggleExpanded?.();
    }
  };

  const quickActions = [
    "Explain this concept",
    "Give me an example",
    "What's the key takeaway?",
    "How does this apply in practice?"
  ];

  const handleQuickAction = (action: string) => {
    const contextualAction = lessonContext 
      ? `${action} from "${lessonContext.lessonTitle}"`
      : action;
    sendMessage(contextualAction);
  };

  // Floating chat button when collapsed
  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleExpanded}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        onClick={onToggleExpanded}
      />
      
      {/* Chat Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 h-full z-50 transform transition-transform duration-300 ease-out",
        "w-full md:w-[450px] max-w-[450px]",
        isExpanded ? "translate-x-0" : "translate-x-full"
      )}>
        <Card className="h-full border-0 border-l shadow-2xl bg-white/95 backdrop-blur-md rounded-none md:rounded-l-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
            <div className="flex items-center gap-3">
              <LyraAvatar size="sm" withWave={false} />
              <div>
                <h3 className="font-semibold">Lyra</h3>
                <p className="text-xs text-purple-100">
                  {lessonContext ? `Helping with: ${lessonContext.lessonTitle}` : 'Your AI Mentor'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 hidden md:flex"
                title="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-white hover:bg-white/20"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpanded}
                className="text-white hover:bg-white/20"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className={cn(
            "flex flex-col h-full p-0 transition-all duration-300",
            isMinimized && "hidden md:flex"
          )}>
            {/* Quick Actions */}
            {lessonContext && (
              <div className="p-4 border-b bg-gray-50/50">
                <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs hover:bg-purple-50 hover:border-purple-300"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        "p-3 rounded-lg text-sm leading-relaxed",
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
                    <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
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
            
            {/* Input */}
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={lessonContext ? "Ask about this lesson..." : "Ask me anything about AI..."}
                  className="flex-1"
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
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send • Esc to close
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
