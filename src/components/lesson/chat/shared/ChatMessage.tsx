import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ChatMessageData {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  characterName?: string;
  messageType?: 'text' | 'system' | 'error' | 'success';
  isStreaming?: boolean;
  metadata?: Record<string, any>;
}

interface ChatMessageProps {
  message: ChatMessageData;
  isLatest?: boolean;
  onResend?: (messageId: string) => void;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest = false,
  onResend,
  className
}) => {
  const { id, content, isUser, timestamp, characterName, messageType = 'text', isStreaming = false, metadata } = message;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getMessageIcon = () => {
    if (isUser) return <User className="w-4 h-4" />;
    if (messageType === 'system') return <Bot className="w-4 h-4 text-blue-500" />;
    if (messageType === 'error') return <Bot className="w-4 h-4 text-red-500" />;
    if (messageType === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Bot className="w-4 h-4" />;
  };

  const getMessageStyles = () => {
    if (isUser) {
      return {
        container: 'justify-end',
        card: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500/20',
        maxWidth: 'max-w-[85%] sm:max-w-[80%]'
      };
    }

    if (messageType === 'error') {
      return {
        container: 'justify-start',
        card: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700/50',
        maxWidth: 'max-w-[85%] sm:max-w-[80%]'
      };
    }

    if (messageType === 'system') {
      return {
        container: 'justify-center',
        card: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600',
        maxWidth: 'max-w-[90%]'
      };
    }

    // Lyra's signature cyan/purple gradient
    return {
      container: 'justify-start',
      card: 'bg-gradient-to-r from-brand-cyan/10 to-brand-purple/10 dark:from-brand-cyan/20 dark:to-brand-purple/20 border-brand-cyan/20 dark:border-brand-purple/30',
      maxWidth: 'max-w-[85%] sm:max-w-[80%]'
    };
  };

  const styles = getMessageStyles();

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const StreamingDots = () => (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <motion.div
          className="w-2 h-2 bg-current rounded-full opacity-60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-current rounded-full opacity-60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-current rounded-full opacity-60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-xs opacity-70 ml-2">{characterName || 'AI'} is thinking...</span>
    </div>
  );

  return (
    <motion.div
      className={cn(`flex ${styles.container} mb-4`, className)}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <Card className={cn(
        `${styles.maxWidth} shadow-lg hover:shadow-xl transition-all duration-300`,
        styles.card
      )}>
        <CardContent className="p-3 sm:p-4">
          {/* Message Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <motion.div
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                {getMessageIcon()}
              </motion.div>
              <span className="text-xs font-medium opacity-80">
                {isUser ? 'You' : (characterName || 'AI')}
              </span>
              {messageType !== 'text' && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {messageType}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs opacity-60">
              <Clock className="w-3 h-3" />
              <span>{formatTime(timestamp)}</span>
            </div>
          </div>

          {/* Message Content */}
          <motion.div
            className="text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {isStreaming ? (
              <StreamingDots />
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {content}
              </div>
            )}
          </motion.div>

          {/* Message Metadata */}
          {metadata && Object.keys(metadata).length > 0 && (
            <motion.div
              className="mt-3 pt-2 border-t border-white/10 text-xs opacity-70"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2 }}
            >
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Message Actions */}
          {!isUser && onResend && (
            <motion.div
              className="mt-2 flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => onResend(id)}
                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                Regenerate
              </button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatMessage;