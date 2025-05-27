
import React from 'react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { FormattedMessage } from './FormattedMessage';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  engagement: {
    hasReachedMinimum: boolean;
  };
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onForceClose: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  messagesEndRef
}) => {
  return (
    <div className="overflow-y-auto p-6 bg-gray-900 min-h-0">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in",
              message.isUser ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex items-start gap-3 max-w-[80%]",
              message.isUser && "flex-row-reverse"
            )}>
              {!message.isUser && (
                <LyraAvatar size="sm" withWave={false} className="mt-1" />
              )}
              <div
                className={cn(
                  "p-4 rounded-lg shadow-lg",
                  message.isUser
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
                )}
              >
                {message.isUser ? (
                  <div className="text-sm leading-relaxed">{message.content}</div>
                ) : (
                  <FormattedMessage content={message.content} />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start gap-3">
              <LyraAvatar size="sm" withWave={false} className="mt-1" />
              <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg rounded-bl-none">
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
    </div>
  );
};
