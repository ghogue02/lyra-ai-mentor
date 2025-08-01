import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { chatReducer, createInitialState, chatSelectors } from './chatReducer';
import { usePersistentChat } from '@/hooks/usePersistentChat';
import type { ChatState, ChatAction, LessonModule, ChatMessage } from '../types/chatTypes';

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
  children: React.ReactNode;
  lessonModule: LessonModule;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  onEngagementChange?: (isEngaged: boolean, messageCount: number) => void;
  initialExpanded?: boolean;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  lessonModule,
  onNarrativePause,
  onNarrativeResume,
  onEngagementChange,
  initialExpanded = false
}) => {
  const [state, dispatch] = useReducer(
    chatReducer,
    { lessonModule, initialExpanded },
    createInitialState
  );

  // Initialize lesson module
  useEffect(() => {
    dispatch({ type: 'SET_LESSON_MODULE', payload: lessonModule });
  }, [lessonModule]);

  // Handle narrative pause/resume based on expansion state
  useEffect(() => {
    if (state.isExpanded && !state.isMinimized) {
      onNarrativePause?.();
    } else {
      onNarrativeResume?.();
    }
  }, [state.isExpanded, state.isMinimized, onNarrativePause, onNarrativeResume]);

  // Handle engagement tracking
  useEffect(() => {
    const userMessageCount = chatSelectors.getUserMessageCount(state);
    onEngagementChange?.(userMessageCount > 0, userMessageCount);
  }, [state.messages, onEngagementChange]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to access chat state (read-only)
export const useChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatState must be used within a ChatProvider');
  }
  return { state: context.state };
};

// Hook to access chat actions
export const useChatActions = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatActions must be used within a ChatProvider');
  }

  const { state, dispatch } = context;

  // Initialize persistent chat hook
  const { sendMessage: persistentSendMessage, clearChat, isLoading } = usePersistentChat({
    chapterTitle: state.currentLesson?.title || 'Chat',
    lessonTitle: state.currentLesson?.title || 'Lesson',
    content: state.currentLesson?.content || '',
    lessonContext: state.currentLesson
  });

  const toggleExpanded = useCallback(() => {
    dispatch({ type: 'TOGGLE_EXPANDED' });
  }, [dispatch]);

  const minimize = useCallback(() => {
    dispatch({ type: 'SET_MINIMIZED', payload: !state.isMinimized });
  }, [dispatch, state.isMinimized]);

  const close = useCallback(() => {
    dispatch({ type: 'SET_EXPANDED', payload: false });
    dispatch({ type: 'SET_MINIMIZED', payload: false });
  }, [dispatch]);

  const sendMessage = useCallback(async (text: string) => {
    dispatch({ type: 'SET_TYPING', payload: true });
    dispatch({ type: 'ADD_MESSAGE', payload: {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date()
    }});

    try {
      await persistentSendMessage(text);
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [dispatch, persistentSendMessage]);

  const clearMessages = useCallback(() => {
    clearChat();
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, [dispatch, clearChat]);

  return {
    toggleExpanded,
    minimize,
    close,
    sendMessage,
    clearMessages,
    isLoading
  };
};

// Hook to access specific selectors
export const useChatSelectors = () => {
  const { state } = useChatState();
  
  return {
    getUserMessageCount: useCallback(() => chatSelectors.getUserMessageCount(state), [state]),
    getLastMessage: useCallback(() => chatSelectors.getLastMessage(state), [state]),
    hasMessages: useCallback(() => chatSelectors.hasMessages(state), [state]),
    isActive: useCallback(() => chatSelectors.isActive(state), [state])
  };
};