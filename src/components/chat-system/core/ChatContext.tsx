import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { chatReducer, createInitialState, chatSelectors } from './chatReducer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCleanup, useMemoryManager } from '@/hooks/memory-management';
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
  const { user, session } = useAuth();
  const { registerCleanup } = useCleanup();
  const { createCache, createWeakRef } = useMemoryManager({
    trackMetrics: true,
    onMemoryWarning: (metrics) => {
      console.warn('ChatProvider: Memory warning', metrics);
    }
  });
  const [state, dispatch] = useReducer(
    chatReducer,
    { lessonModule, initialExpanded },
    createInitialState
  );

  // Initialize lesson module and load conversation
  useEffect(() => {
    console.log('ChatContext: Setting lesson module:', lessonModule);
    dispatch({ type: 'SET_LESSON_MODULE', payload: lessonModule });
    if (user && lessonModule) {
      console.log('ChatContext: Initializing chat with user and lesson');
      initializeChat(user, lessonModule);
    } else {
      console.log('ChatContext: Waiting for user or lesson module', { hasUser: !!user, hasLesson: !!lessonModule });
    }

    // Create cache for conversation data
    const conversationCache = createCache('chatConversations', 50, 600000); // 10 min TTL
    const messageCache = createCache('chatMessages', 200, 300000); // 5 min TTL

    // Create weak reference for user data to prevent memory leaks
    if (user) {
      createWeakRef('currentUser', user);
    }

    // Register cleanup for any active requests or subscriptions
    return registerCleanup(() => {
      console.log('ChatContext: Cleaning up chat resources');
      conversationCache.clear();
      messageCache.clear();
    });
  }, [lessonModule, user, createCache, createWeakRef, registerCleanup]);

  const initializeChat = async (user: any, lesson: LessonModule) => {
    dispatch({ type: 'SET_TYPING', payload: true });
    
    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Load or create conversation
      const conversationId = await loadOrCreateConversation(user, lesson, profile);
      
      // Load messages for this conversation
      if (conversationId) {
        await loadMessages(conversationId);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load chat. Please try again.' });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  const loadOrCreateConversation = async (user: any, lesson: LessonModule, profile: any): Promise<string | null> => {
    try {
      // Try to find existing conversation
      const { data: existingConversation } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.chapterNumber)
        .eq('chapter_id', lesson.chapterNumber)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let conversationId = existingConversation?.id;

      if (!existingConversation) {
        // Create new conversation
        const { data: newConversation, error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            lesson_id: lesson.chapterNumber,
            chapter_id: lesson.chapterNumber,
            title: lesson.title || `Lesson ${lesson.chapterNumber} Chat`,
            lesson_context: {
              chapterTitle: lesson.chapterTitle,
              lessonTitle: lesson.title,
              content: lesson.content,
              phase: lesson.phase
            }
          })
          .select()
          .single();

        if (error) throw error;
        conversationId = newConversation.id;

        // Add personalized initial AI message
        const initialMessage = createPersonalizedInitialMessage(profile, lesson);
        await saveMessage(conversationId, initialMessage, false, 0, user.id, lesson.chapterNumber);
      }

      return conversationId;
    } catch (error) {
      console.error('Error loading/creating conversation:', error);
      return null;
    }
  };

  const createPersonalizedInitialMessage = (profile: any, lesson: LessonModule): string => {
    let greeting = `Hi${profile?.first_name ? ` ${profile.first_name}` : ''}! I'm Lyra, and I'm excited to be your AI mentor.`;
    
    if (profile?.organization_name) {
      greeting += ` I see you're working at ${profile.organization_name}`;
      if (profile.organization_type) {
        greeting += ` (${profile.organization_type})`;
      }
      greeting += ` - that's fantastic!`;
    }
    
    greeting += ` I notice you're diving into "${lesson.title}"`;
    
    if (profile?.organization_name) {
      greeting += ` - I'd love to help you explore how this could apply specifically to your work at ${profile.organization_name}.`;
    } else {
      greeting += ` - what's got you most curious about this topic right now?`;
    }

    return greeting;
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data: chatMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('message_order', { ascending: true });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = chatMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.is_user_message,
        timestamp: new Date(msg.created_at),
        characterName: msg.is_user_message ? undefined : 'Lyra'
      }));

      dispatch({ type: 'SET_MESSAGES', payload: formattedMessages });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessage = async (
    conversationId: string,
    content: string,
    isUserMessage: boolean,
    messageOrder: number,
    userId: string,
    lessonId: number
  ) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          lesson_id: lessonId,
          content,
          is_user_message: isUserMessage,
          message_order: messageOrder
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

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
  const { user, session } = useAuth();

  // Helper functions that need to be accessible in sendMessage and clearMessages
  const saveMessage = useCallback(async (
    conversationId: string,
    content: string,
    isUserMessage: boolean,
    messageOrder: number,
    userId: string,
    lessonId: number
  ) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          lesson_id: lessonId,
          content,
          is_user_message: isUserMessage,
          message_order: messageOrder
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  }, []);

  const createPersonalizedInitialMessage = useCallback((profile: any, lesson: LessonModule): string => {
    let greeting = `Hi${profile?.first_name ? ` ${profile.first_name}` : ''}! I'm Lyra, and I'm excited to be your AI mentor.`;
    
    if (profile?.organization_name) {
      greeting += ` I see you're working at ${profile.organization_name}`;
      if (profile.organization_type) {
        greeting += ` (${profile.organization_type})`;
      }
      greeting += ` - that's fantastic!`;
    }
    
    greeting += ` I notice you're diving into "${lesson.title}"`;
    
    if (profile?.organization_name) {
      greeting += ` - I'd love to help you explore how this could apply specifically to your work at ${profile.organization_name}.`;
    } else {
      greeting += ` - what's got you most curious about this topic right now?`;
    }

    return greeting;
  }, []);

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
    if (!text.trim() || !user || !state.currentLesson) return;

    // Prevent duplicate requests
    if (state.isTyping) {
      console.log('🚫 Message sending already in progress, ignoring duplicate request');
      return;
    }

    console.log('📤 sendMessage called with:', text);
    dispatch({ type: 'SET_TYPING', payload: true });

    // Generate unique IDs upfront
    const userMessageId = crypto.randomUUID();
    const aiMessageId = crypto.randomUUID();
    
    console.log('🆔 Generated message IDs:', { userMessageId, aiMessageId });

    try {
      // Find current conversation
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', state.currentLesson.chapterNumber)
        .eq('chapter_id', state.currentLesson.chapterNumber)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single();

      if (!conversation) {
        throw new Error('No conversation found');
      }

      const conversationId = conversation.id;
      const currentMessageOrder = state.messages.length;

      // Add user message to state immediately with unique ID
      const userMessage: ChatMessage = {
        id: userMessageId,
        content: text,
        isUser: true,
        timestamp: new Date(),
        characterName: undefined
      };

      console.log('📝 Adding user message to state:', userMessage);
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Save user message to database
      await saveMessage(conversationId, text, true, currentMessageOrder, user.id, state.currentLesson.chapterNumber);

      // Create AI message placeholder with unique ID
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        content: '',
        isUser: false,
        timestamp: new Date(),
        characterName: 'Lyra'
      };

      console.log('🤖 Adding AI message placeholder to state:', aiMessage);
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

      // Send to AI
      const response = await fetch('https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/chat-with-lyra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0'}`,
        },
        body: JSON.stringify({
          messages: [...state.messages, userMessage].map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          lessonContext: {
            chapterTitle: state.currentLesson.chapterTitle,
            lessonTitle: state.currentLesson.title,
            content: state.currentLesson.content,
            phase: state.currentLesson.phase
          },
          conversationId,
          userId: user.id,
          lessonId: state.currentLesson.chapterNumber,
          messageId: userMessageId,
          responseId: aiMessageId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let aiResponseContent = '';

      // Stream the AI response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                aiResponseContent += data.content;
                console.log('📝 Updating AI message content for ID:', aiMessageId);
                // Update the specific AI message using its unique ID
                dispatch({ 
                  type: 'UPDATE_MESSAGE', 
                  payload: { id: aiMessageId, content: aiResponseContent }
                });
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }

      // Save AI response to database
      if (aiResponseContent) {
        await saveMessage(conversationId, aiResponseContent, false, currentMessageOrder + 1, user.id, state.currentLesson.chapterNumber);
      }

      console.log('✅ Message flow complete:', { userMessageId, aiMessageId, contentLength: aiResponseContent.length });

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message. Please try again.' });
      
      // Remove the failed AI message if it was added
      dispatch({ type: 'REMOVE_MESSAGE', payload: aiMessageId });
      
      setTimeout(() => {
        dispatch({ type: 'CLEAR_ERROR' });
      }, 5000);
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state, user, session, dispatch, saveMessage]);

  const clearMessages = useCallback(async () => {
    if (!user || !state.currentLesson) return;

    try {
      // Find current conversation
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', state.currentLesson.chapterNumber)
        .eq('chapter_id', state.currentLesson.chapterNumber)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single();

      if (conversation) {
        // Delete all messages from this conversation
        await supabase
          .from('chat_messages')
          .delete()
          .eq('conversation_id', conversation.id);

        // Create new initial message
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const initialMessage = createPersonalizedInitialMessage(profile, state.currentLesson);
        await saveMessage(conversation.id, initialMessage, false, 0, user.id, state.currentLesson.chapterNumber);

        // Update state
        const newMessage: ChatMessage = {
          id: '1',
          content: initialMessage,
          isUser: false,
          timestamp: new Date(),
          characterName: 'Lyra'
        };

        dispatch({ type: 'SET_MESSAGES', payload: [newMessage] });
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear chat. Please try again.' });
    }
  }, [user, state.currentLesson, dispatch, createPersonalizedInitialMessage, saveMessage]);

  return {
    toggleExpanded,
    minimize,
    close,
    sendMessage,
    clearMessages,
    isLoading: state.isTyping
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