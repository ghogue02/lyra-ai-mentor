
// This hook is now deprecated - use ChatContext directly
// Keeping for backward compatibility but redirecting to ChatContext

import { useState } from 'react';
import { useChatActions, useChatState } from '@/components/chat-system/core/ChatContext';

interface LessonContext {
  chapterTitle?: string;
  lessonTitle?: string;
  content?: string;
  phase?: string;
}

export const useLyraChat = (lessonContext?: LessonContext) => {
  const { state } = useChatState();
  const { sendMessage, clearMessages, isLoading } = useChatActions();
  const [inputValue, setInputValue] = useState('');

  return {
    messages: state.messages,
    sendMessage,
    clearChat: clearMessages,
    isLoading,
    isTyping: state.isTyping,
    inputValue,
    setInputValue,
    userProfile: null, // Legacy compatibility - profile is now handled in ChatContext
    engagement: { exchangeCount: 0, hasReachedThreshold: false } // Legacy compatibility
  };
};
