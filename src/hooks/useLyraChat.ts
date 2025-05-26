
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useLyraChat = (lessonContext?: LessonContext) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: lessonContext 
        ? `Hi! 👋 I'm Lyra, your AI mentor. I can see you're working on "${lessonContext.lessonTitle}". What questions do you have about this lesson?`
        : "Hi there! 👋 I'm Lyra, your AI mentor. I'm here to help you navigate your learning journey. What questions do you have about AI?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim()) return;

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
      const { data, error } = await supabase.functions.invoke('chat-with-lyra', {
        body: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          lessonContext
        }
      });

      if (error) throw error;

      // Handle streaming response
      const reader = data.getReader();
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
  }, [messages, lessonContext]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: lessonContext 
        ? `Chat cleared! I'm still here to help with "${lessonContext.lessonTitle}". What would you like to know?`
        : "Chat cleared! I'm still here to help with your AI learning journey. What can I assist you with?",
      isUser: false,
      timestamp: new Date()
    }]);
  }, [lessonContext]);

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat
  };
};
