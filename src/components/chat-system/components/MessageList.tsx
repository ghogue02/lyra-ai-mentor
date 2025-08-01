import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useChatState } from '../core/ChatContext';
import { LyraAvatar } from '@/components/LyraAvatar';
import { TypewriterText } from './TypewriterText';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    characterName?: string;
  };
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, isLast }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      className={cn(
        "flex gap-3 mb-4",
        message.isUser ? "flex-row-reverse" : "flex-row"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* Avatar */}
      {!message.isUser && (
        <div className="flex-shrink-0">
          <LyraAvatar size="sm" expression="helping" />
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] group",
        message.isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl",
          message.isUser 
            ? "bg-purple-500 text-white rounded-br-md" 
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        )}>
          {/* Use TypewriterText for Lyra's messages, especially the last one */}
          {!message.isUser && isLast ? (
            <TypewriterText 
              text={message.content}
              speed={20}
              showCursor={false}
              className="text-sm leading-relaxed"
            />
          ) : (
            <p className="text-sm leading-relaxed">
              {message.content}
            </p>
          )}
        </div>
        
        {/* Timestamp (hidden by default, shown on hover) */}
        <div className={cn(
          "text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
          message.isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export const MessageList: React.FC = () => {
  const { state } = useChatState();
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {state.messages.map((message, index) => (
        <MessageBubble 
          key={message.id}
          message={message}
          isLast={index === state.messages.length - 1}
        />
      ))}
    </div>
  );
};