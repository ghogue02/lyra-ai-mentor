import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, X, Minimize2, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatLyra } from '@/hooks/useChatLyra';

interface ChatLyraProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
    phase?: string;
  };
  mode?: 'floating' | 'embedded';
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initialExpanded?: boolean;
  onEngagementChange?: (engaged: boolean, messageCount: number) => void;
}

const conversationStarters = [
  "What makes AI so powerful for nonprofit work?",
  "How can I get started with AI in my organization?", 
  "What are the most common AI mistakes nonprofits make?",
  "Can you show me a real example of AI helping nonprofits?",
  "What should I know about AI ethics and nonprofits?"
];

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6', 
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
};

const ChatLyra: React.FC<ChatLyraProps> = ({
  lessonContext,
  mode = 'floating',
  className,
  position = 'bottom-right',
  initialExpanded = false,
  onEngagementChange
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded || mode === 'embedded');
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages, isConnected } = useChatLyra({
    lessonContext,
    conversationId: `lyra-${lessonContext?.phase || 'general'}-${Date.now()}`
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Notify parent about engagement
  useEffect(() => {
    if (onEngagementChange) {
      const userMessages = messages.filter(msg => msg.isUser);
      onEngagementChange(userMessages.length > 0, userMessages.length);
    }
  }, [messages, onEngagementChange]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStarterClick = (starter: string) => {
    setInputValue(starter);
    sendMessage(starter);
  };

  if (mode === 'floating' && !isExpanded) {
    return (
      <div className={cn('fixed z-50', positionClasses[position], className)}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-brand-cyan/20 rounded-full blur-lg opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-brand-cyan text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
              <AvatarFallback className="bg-primary text-white text-sm font-bold">LY</AvatarFallback>
            </Avatar>
          </Button>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      mode === 'floating' 
        ? `fixed z-50 w-96 h-[600px] ${positionClasses[position]}` 
        : 'w-full h-full',
      className
    )}>
      <Card className="h-full flex flex-col shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-primary to-brand-cyan text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 border-2 border-white/20">
                <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
                <AvatarFallback className="bg-white/20 text-white text-xs font-bold">LY</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Lyra</h3>
                <div className="flex items-center space-x-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-emerald-400" : "bg-red-400"
                  )} />
                  <span className="text-xs opacity-90">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="text-white hover:bg-white/20 p-1 h-auto"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              {mode === 'floating' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20 p-1 h-auto"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
                      <AvatarFallback className="bg-primary text-white text-xs">LY</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                      <p className="text-sm text-gray-900">
                        Hi! I'm Lyra, your AI learning companion. I'm here to help you explore AI's potential for nonprofit work. What would you like to know?
                      </p>
                    </div>
                  </div>
                  
                  {/* Conversation starters */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground px-2">
                      <Sparkles className="w-3 h-3" />
                      <span>Quick questions to get started:</span>
                    </div>
                    {conversationStarters.slice(0, 3).map((starter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStarterClick(starter)}
                        className="w-full text-left justify-start text-xs h-auto py-2 px-3 bg-white hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        {starter}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.isUser && "flex-row-reverse space-x-reverse"
                  )}
                >
                  {!message.isUser && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
                      <AvatarFallback className="bg-primary text-white text-xs">LY</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-2xl p-3 max-w-[80%]",
                    message.isUser 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-gray-100 text-gray-900 rounded-tl-none"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className={cn(
                      "text-xs mt-1 block",
                      message.isUser ? "text-white/70" : "text-gray-500"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
                    <AvatarFallback className="bg-primary text-white text-xs">LY</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-center">
                  <Badge variant="destructive" className="text-xs">
                    {error}
                  </Badge>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about AI for nonprofits..."
              className="flex-1 min-h-0 h-10 resize-none text-sm"
              rows={1}
              disabled={isLoading || !isConnected}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isConnected}
              size="sm"
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatLyra;