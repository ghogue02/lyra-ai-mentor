import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useChatState, useChatActions } from '../core/ChatContext';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatInput: React.FC = () => {
  const { state } = useChatState();
  const { sendMessage, clearMessages, isLoading } = useChatActions();
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading || state.isTyping) return;
    
    const message = inputValue.trim();
    setInputValue('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [inputValue, isLoading, state.isTyping, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const isDisabled = isLoading || state.isTyping;

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about this lesson..."
            className={cn(
              "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white",
              "resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              "text-sm placeholder-gray-500 transition-all duration-200",
              "min-h-[44px] max-h-[120px]",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
            disabled={isDisabled}
            style={{
              height: 'auto',
              overflow: 'hidden'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>
        
        <motion.button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isDisabled}
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
            "bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300",
            "text-white disabled:text-gray-500",
            "disabled:cursor-not-allowed"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Footer with controls */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {state.messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          className="flex items-center gap-2 mt-2 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex gap-1">
            <motion.div
              className="w-1 h-1 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-1 h-1 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1 h-1 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <span>Sending...</span>
        </motion.div>
      )}
    </div>
  );
};