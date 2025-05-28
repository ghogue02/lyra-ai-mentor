
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormattedMessage } from './FormattedMessage';

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
  return (
    <ScrollArea className="h-full w-full">
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
  );
};
