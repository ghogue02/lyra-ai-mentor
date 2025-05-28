
import { useState, useCallback, useRef } from 'react';
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
  [key: string]: any;
}

export const useTemporaryChat = (lessonContext?: LessonContext) => {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

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
          userId: user.id,
          isDataInsights: true
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

      // Add thinking delay before starting to type
      await new Promise(resolve => setTimeout(resolve, 800));

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
                
                // Natural pacing delays
                let delay = 75; // Base delay
                
                // Longer pauses for punctuation
                if (data.content.includes('.') || data.content.includes('!') || data.content.includes('?')) {
                  delay = 200;
                } else if (data.content.includes(',') || data.content.includes(';')) {
                  delay = 100;
                }
                
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble responding right now. But hey, that just means I'm human-ish! Try asking me again?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, lessonContext, user, session]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const initializeWithMessage = useCallback((initialMessage: string) => {
    const message: Message = {
      id: '1',
      content: initialMessage,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([message]);
  }, []);

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    initializeWithMessage
  };
};
