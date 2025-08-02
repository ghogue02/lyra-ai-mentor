import React, { useState, useRef, useEffect } from 'react';
import { useChatSimple } from '@/hooks/useChatSimple';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';

interface ChatSimpleProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6', 
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

export const ChatSimple: React.FC<ChatSimpleProps> = ({
  className,
  position = 'bottom-right',
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage, clearMessages } = useChatSimple();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (disabled) return null;

  // Floating avatar (collapsed state)
  if (!isExpanded) {
    return (
      <div className={cn(
        "fixed z-50",
        positionClasses[position],
        className
      )}>
        <div
          className="group cursor-pointer nm-interactive nm-card nm-shadow-floating"
          onClick={() => setIsExpanded(true)}
        >
          <div className="nm-p-sm">
            <LyraAvatar 
              size="lg" 
              withWave={true} 
              expression="helping"
              className="nm-shadow-accent nm-animate-float" 
            />
          </div>
          
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="nm-card nm-glass nm-p-sm nm-text-primary nm-rounded-md">
              <span className="text-xs font-medium whitespace-nowrap">Chat with Lyra</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded chat interface
  return (
    <div className={cn(
      "fixed z-50 max-w-sm w-full",
      positionClasses[position],
      className
    )}>
      <div className="nm-hero-card nm-glass flex flex-col animate-scale-in-spring overflow-hidden h-[600px] w-96">
        {/* Header */}
        <div className="flex items-center justify-between nm-p-lg border-b border-white/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="nm-avatar nm-shadow-subtle">
              <LyraAvatar size="sm" expression="helping" />
            </div>
            <div>
              <h3 className="font-medium text-sm nm-text-primary">Lyra</h3>
              <p className="text-xs nm-text-secondary">AI Learning Companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearMessages}
              className="nm-button-ghost w-8 h-8 flex items-center justify-center nm-rounded-md nm-interactive hover:nm-surface-elevated transition-all duration-200"
              title="Clear chat"
            >
              <svg className="w-4 h-4 nm-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="nm-button-ghost w-8 h-8 flex items-center justify-center nm-rounded-md nm-interactive hover:nm-surface-elevated transition-all duration-200"
              title="Close chat"
            >
              <svg className="w-4 h-4 nm-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto nm-p-lg space-y-4">
          {messages.length === 0 && (
            <div className="text-center nm-text-secondary text-sm">
              <p>Hi! I'm Lyra, your AI learning companion.</p>
              <p>Ask me anything about your lesson!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.isUser ? "flex-row-reverse" : "flex-row"
              )}
            >
              {!message.isUser && (
                <div className="nm-avatar nm-shadow-subtle flex-shrink-0">
                  <LyraAvatar size="sm" expression="helping" />
                </div>
              )}
              <div
                className={cn(
                  "nm-card nm-p-md nm-rounded-xl max-w-[80%]",
                  message.isUser 
                    ? "nm-surface-elevated nm-text-primary ml-auto" 
                    : "nm-surface-sunken nm-text-primary"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="nm-avatar nm-shadow-subtle flex-shrink-0">
                <LyraAvatar size="sm" expression="thinking" />
              </div>
              <div className="nm-card nm-surface-sunken nm-p-md nm-rounded-xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce nm-text-secondary" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce nm-text-secondary" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce nm-text-secondary" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 nm-p-lg border-t border-white/20">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 nm-card nm-surface-sunken nm-p-sm nm-rounded-md nm-text-primary placeholder:nm-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 min-h-[40px] max-h-[120px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="nm-button nm-button-primary flex items-center justify-center w-10 h-10 nm-rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};