import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCleanup, useMemoryManager, useStateGarbageCollector } from '@/hooks/memory-management';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChatLyraProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
    phase?: string;
    chapterNumber?: number;
    currentLessonId?: string | number;
  };
  conversationId?: string;
}

interface UseChatLyraReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isConnected: boolean;
}

export const useChatLyra = ({ lessonContext, conversationId }: UseChatLyraProps = {}): UseChatLyraReturn => {
  const { registerCleanup } = useCleanup();
  const { createCache, createWeakRef } = useMemoryManager({
    trackMetrics: true,
    onMemoryWarning: (metrics) => {
      console.warn('useChatLyra: Memory warning', metrics);
      // Clear message cache on memory pressure
      messageCache?.clear();
    }
  });
  const { setState, getState, deleteState } = useStateGarbageCollector({
    maxStateEntries: 100,
    ttl: 600000, // 10 minutes for chat data
    enablePriorityEviction: true
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Create caches for efficient message and API response management
  const messageCache = createCache('chatMessages', 200, 600000); // 10 min TTL
  const apiResponseCache = createCache('apiResponses', 50, 300000); // 5 min TTL

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !user) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare messages for API
      const apiMessages = [
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: content.trim()
        }
      ];

      // Determine the correct lesson ID based on context
      const determineLessonId = () => {
        if (lessonContext?.currentLessonId && typeof lessonContext.currentLessonId === 'number') {
          return lessonContext.currentLessonId;
        }
        if (lessonContext?.chapterNumber) {
          // Map chapters to their first lesson ID for better context
          const chapterToLessonMap: Record<number, number> = {
            1: 3,   // Chapter 1: Meet Lyra
            2: 5,   // Chapter 2: AI for Your Daily Work (placeholder)
            3: 11,  // Chapter 3: Communication & Storytelling
            4: 15,  // Chapter 4: Data & Decision Making
            5: 19,  // Chapter 5: Automation & Efficiency
            6: 23   // Chapter 6: Organizational Transformation
          };
          return chapterToLessonMap[lessonContext.chapterNumber] || 1;
        }
        return 1; // Default fallback
      };

      // Call the chat-with-lyra function
      const { data, error: apiError } = await supabase.functions.invoke('chat-with-lyra', {
        body: {
          messages: apiMessages,
          lessonContext,
          conversationId: conversationId || crypto.randomUUID(),
          userId: user.id,
          lessonId: determineLessonId(),
          isDummyDataRequest: false,
          isDataInsights: false,
          useCleanFormatting: true
        }
      });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to send message');
      }

      // Handle streaming response
      if (data && data.body) {
        const reader = data.body.getReader();
        const decoder = new TextDecoder();
        let aiResponseContent = '';

        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content: '',
          isUser: false,
          timestamp: new Date(),
        };

        // Add empty AI message that we'll update
        setMessages(prev => [...prev, aiMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  aiResponseContent += parsed.content;
                  
                  // Update the AI message content
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, content: aiResponseContent }
                      : msg
                  ));
                }
              } catch (e) {
                console.error('Error parsing stream data:', e);
              }
            }
          }
        }
      } else {
        throw new Error('No response received from AI');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      setError(errorMessage);
      setIsConnected(false);
      
      // Remove user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, user, lessonContext, conversationId, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isConnected,
  };
};