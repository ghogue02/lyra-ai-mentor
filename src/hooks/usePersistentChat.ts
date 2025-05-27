
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface LessonContext {
  chapterTitle?: string;
  lessonTitle?: string;
  content?: string;
  [key: string]: any; // Add index signature to make it compatible with Json type
}

interface ChatConversation {
  id: string;
  user_id: string;
  lesson_id: number;
  chapter_id: number;
  title?: string;
  lesson_context?: any;
  started_at: string;
  last_message_at: string;
  message_count: number;
}

export const usePersistentChat = (
  lessonId: number, 
  chapterId: number, 
  lessonContext?: LessonContext
) => {
  const { user, session } = useAuth(); // Get session from auth context
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load existing conversation when component mounts
  useEffect(() => {
    if (user && lessonId && chapterId) {
      loadOrCreateConversation();
    }
  }, [user, lessonId, chapterId]);

  const loadOrCreateConversation = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Try to find existing conversation for this lesson
      const { data: existingConversation } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .eq('chapter_id', chapterId)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let currentConversationId = existingConversation?.id;

      if (!existingConversation) {
        // Create new conversation - cast lessonContext to Json type
        const { data: newConversation, error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            chapter_id: chapterId,
            title: lessonContext?.lessonTitle || `Lesson ${lessonId} Chat`,
            lesson_context: lessonContext as any // Cast to satisfy Json type
          })
          .select()
          .single();

        if (error) throw error;
        currentConversationId = newConversation.id;

        // Add initial AI message
        const initialMessage = lessonContext 
          ? `Hi! 👋 I'm Lyra, your AI mentor. I can see you're working on "${lessonContext.lessonTitle}". What questions do you have about this lesson?`
          : "Hi there! 👋 I'm Lyra, your AI mentor. I'm here to help you navigate your learning journey. What questions do you have about AI?";

        await saveMessage(currentConversationId, initialMessage, false, 0);
      }

      setConversationId(currentConversationId);

      // Load messages for this conversation
      if (currentConversationId) {
        await loadMessages(currentConversationId);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Set default message if loading fails
      setMessages([{
        id: '1',
        content: lessonContext 
          ? `Hi! 👋 I'm Lyra, your AI mentor. I can see you're working on "${lessonContext.lessonTitle}". What questions do you have about this lesson?`
          : "Hi there! 👋 I'm Lyra, your AI mentor. I'm here to help you navigate your learning journey. What questions do you have about AI?",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const { data: chatMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('message_order', { ascending: true });

      if (error) throw error;

      const formattedMessages = chatMessages.map((msg, index) => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.is_user_message,
        timestamp: new Date(msg.created_at)
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessage = async (
    convId: string, 
    content: string, 
    isUserMessage: boolean, 
    messageOrder: number
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: convId,
          user_id: user.id,
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

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || !conversationId || !user) return;

    const currentMessageOrder = messages.length;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Save user message to database
    await saveMessage(conversationId, messageContent, true, currentMessageOrder);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/chat-with-lyra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0'}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          lessonContext,
          conversationId,
          userId: user.id,
          lessonId
        }),
        signal: abortControllerRef.current.signal
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

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

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
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, content: aiResponseContent }
                    : msg
                ));
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }

      // Save AI response to database
      if (aiResponseContent) {
        await saveMessage(conversationId, aiResponseContent, false, currentMessageOrder + 1);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, lessonContext, conversationId, user, lessonId, session]);

  const clearChat = useCallback(async () => {
    if (!conversationId) return;

    try {
      // Delete all messages from this conversation
      await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);

      // Create new initial message
      const initialMessage = lessonContext 
        ? `Chat cleared! I'm still here to help with "${lessonContext.lessonTitle}". What would you like to know?`
        : "Chat cleared! I'm still here to help with your AI learning journey. What can I assist you with?";

      await saveMessage(conversationId, initialMessage, false, 0);

      setMessages([{
        id: '1',
        content: initialMessage,
        isUser: false,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  }, [conversationId, lessonContext]);

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    isLoading,
    conversationId
  };
};
