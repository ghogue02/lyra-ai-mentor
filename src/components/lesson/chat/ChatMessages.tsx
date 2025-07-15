
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormattedMessage } from './FormattedMessage';
import { Button } from "@/components/ui/button";
import { ArrowDown } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onForceClose?: () => void;
  onSendMessage?: (message: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  engagement,
  messagesEndRef,
  onForceClose,
  onSendMessage
}) => {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  // Get the scroll container reference
  const scrollAreaRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Find the actual scrollable viewport within the ScrollArea
      const viewport = node.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      setScrollContainer(viewport);
    }
  }, []);

  // Check if user is near bottom of scroll
  const isNearBottom = useCallback((container: HTMLElement) => {
    const threshold = 100; // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!scrollContainer) return;

    const nearBottom = isNearBottom(scrollContainer);
    
    // If user scrolled up and away from bottom, mark as user scrolling
    if (!nearBottom && !isUserScrolling) {
      setIsUserScrolling(true);
      setShowScrollToBottom(true);
    }
    
    // If user scrolled back near bottom, resume auto-scroll
    if (nearBottom && isUserScrolling) {
      setIsUserScrolling(false);
      setShowScrollToBottom(false);
    }
  }, [scrollContainer, isUserScrolling, isNearBottom]);

  // Attach scroll listener
  useEffect(() => {
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollContainer, handleScroll]);

  // Auto-scroll logic with user scroll detection
  const scrollToBottom = useCallback((force = false) => {
    if (!messagesEndRef.current) return;
    
    // Always scroll if forced, or if user hasn't manually scrolled up
    if (force || !isUserScrolling) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isUserScrolling, messagesEndRef]);

  // Auto-scroll when messages change (but respect user scroll state)
  useEffect(() => {
    // Force scroll for new conversations or when typing stops
    const lastMessage = messages[messages.length - 1];
    const isNewUserMessage = lastMessage && lastMessage.isUser;
    
    if (isNewUserMessage || !isTyping) {
      // Reset user scrolling state on new user messages
      if (isNewUserMessage) {
        setIsUserScrolling(false);
        setShowScrollToBottom(false);
      }
      scrollToBottom(isNewUserMessage);
    } else {
      // For streaming AI responses, only scroll if user hasn't scrolled up
      scrollToBottom(false);
    }
  }, [messages, isTyping, scrollToBottom]);

  // Manual scroll to bottom when button is clicked
  const handleScrollToBottomClick = () => {
    setIsUserScrolling(false);
    setShowScrollToBottom(false);
    scrollToBottom(true);
  };

  return (
    <div className="relative h-full w-full">
      <ScrollArea ref={scrollAreaRef} className="h-full w-full">
        <div className="space-y-4 py-4 px-3 sm:px-4 min-h-0">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 sm:py-3 ${
                message.isUser 
                  ? 'bg-blue-600 text-white ml-4' 
                  : 'bg-gray-700 text-white mr-4'
              }`}>
                {message.isUser ? (
                  <p className="text-sm leading-relaxed text-white">{message.content}</p>
                ) : (
                  <FormattedMessage content={message.content} onSendMessage={onSendMessage} />
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 mr-4 max-w-[85%] sm:max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-300">Lyra is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            size="sm"
            onClick={handleScrollToBottomClick}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
            title="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
