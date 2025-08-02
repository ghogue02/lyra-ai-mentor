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
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

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
  showMinimize?: boolean;
  onMinimize?: () => void;
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
  onEngagementChange,
  showMinimize = false,
  onMinimize
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

  const handleStarterClick = async (starter: string) => {
    await sendMessage(starter);
    setInputValue('');
  };

  if (mode === 'floating' && !isExpanded) {
    return (
      <div className={cn('fixed z-50', positionClasses[position], className)}>
        <div className="relative group">
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="nm-button-primary nm-rounded-full nm-shadow-floating nm-glow-soft nm-interactive w-16 h-16"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
              <AvatarFallback className="bg-transparent text-white text-sm font-bold">LY</AvatarFallback>
            </Avatar>
          </Button>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 nm-success nm-rounded-full border-2 border-white animate-pulse" />
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
      <div className="h-full flex flex-col nm-card-elevated nm-rounded-2xl overflow-hidden">

        {/* Messages */}
        <div className="flex-1 p-0 overflow-hidden nm-container">
          <ScrollArea className="h-full nm-p-lg" ref={scrollAreaRef}>
            <div className="space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/lovable-uploads/character-avatars/lyra-avatar.png" alt="Lyra" />
                      <AvatarFallback className="bg-primary text-white text-xs">LY</AvatarFallback>
                    </Avatar>
                    <div className="nm-card-subtle nm-rounded-2xl nm-rounded-tl-none nm-p-md max-w-[80%]">
                      <p className="text-sm nm-text-primary">
                        Hi! I'm Lyra, your AI learning companion. I'm here to help you explore AI's potential for nonprofit work. What would you like to know?
                      </p>
                    </div>
                  </div>
                  
                   {/* Conversation starters */}
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2 text-xs nm-text-muted px-2">
                       <Sparkles className="w-3 h-3" />
                       <span>Quick questions to get started:</span>
                     </div>
                     {conversationStarters.slice(0, 3).map((starter, index) => (
                       <button
                         key={index}
                         onClick={() => handleStarterClick(starter)}
                         className="w-full text-left nm-button nm-interactive nm-rounded-lg nm-p-sm text-xs h-auto nm-text-secondary hover:nm-text-primary transition-colors"
                         disabled={isLoading}
                       >
                         {starter}
                       </button>
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
                     "nm-rounded-2xl nm-p-md max-w-[80%]",
                     message.isUser 
                       ? "nm-button-primary nm-rounded-tr-none text-white" 
                       : "nm-card-subtle nm-rounded-tl-none"
                   )}>
                      {message.isUser ? (
                        <p className="text-sm whitespace-pre-wrap text-white">{message.content}</p>
                      ) : (
                        <div className="chat-message-content">
                          <TemplateContentFormatter 
                            content={message.content}
                            contentType="lesson"
                            variant="compact"
                            showMergeFieldTypes={false}
                            className="nm-text-primary"
                          />
                        </div>
                      )}
                     <span className={cn(
                       "text-xs mt-1 block",
                       message.isUser ? "text-white/70" : "nm-text-muted"
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
                   <div className="nm-card-subtle nm-rounded-2xl nm-rounded-tl-none nm-p-md">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 nm-text-accent rounded-full animate-pulse" />
                       <div className="w-2 h-2 nm-text-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                       <div className="w-2 h-2 nm-text-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
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
        </div>

        {/* Input */}
        <div className="nm-panel nm-p-lg nm-rounded-xl nm-rounded-t-none border-t border-white/10">
          <div className="flex space-x-2 items-center">
            <button
              onClick={clearMessages}
              className="nm-button-secondary nm-rounded-lg p-1 nm-text-accent hover:nm-text-primary transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            {(mode === 'floating' || showMinimize) && (
              <button
                onClick={() => onMinimize ? onMinimize() : setIsExpanded(false)}
                className="nm-button-secondary nm-rounded-lg p-1 nm-text-accent hover:nm-text-primary transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            )}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about AI for nonprofits..."
              className="flex-1 nm-input min-h-0 h-10 resize-none text-sm"
              rows={1}
              disabled={isLoading || !isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isConnected}
              className="nm-button-primary nm-rounded-lg nm-p-sm nm-interactive"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLyra;