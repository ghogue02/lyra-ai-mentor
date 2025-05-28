
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

  // Calculate dynamic delay based on content progress and type
  const calculateStreamingDelay = (content: string, totalLength: number, isDataInsights: boolean = false) => {
    if (!isDataInsights) {
      // Regular streaming - simple variable speed
      const progress = content.length / Math.max(totalLength, content.length);
      if (progress < 0.2) return 150; // Start slower
      if (progress < 0.5) return 100; // Medium speed
      return 50; // End faster
    }

    // Data Insights - sophisticated variable speed
    const progress = content.length / Math.max(totalLength, content.length);
    const lastChunk = content.slice(-20); // Last 20 characters
    
    // Very slow start for dramatic effect
    if (progress < 0.1) return 300;
    
    // Slow for section headers
    if (lastChunk.includes('Patterns Found') || 
        lastChunk.includes('Action Items') || 
        lastChunk.includes('Hidden Insights')) {
      return 500; // Extra slow for headers
    }
    
    // Gradual speed increase with content-aware pacing
    if (progress < 0.2) return 200; // Still slow for absorption
    if (progress < 0.4) return 150; // Building momentum
    if (progress < 0.6) return 100; // Medium speed
    if (progress < 0.8) return 75;  // Getting faster
    
    // Final burst of speed for conclusion
    return 40;
  };

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

    // Check if this is a data insights request
    const isDataInsights = messageContent.includes('Analyze the donor records') || 
                          messageContent.includes('CSV data') ||
                          messageContent.includes('Patterns Found');

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
          isDataInsights: true,
          useCleanFormatting: true
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
      let estimatedTotalLength = isDataInsights ? 2000 : 1000; // Estimate for delay calculation

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Add thinking delay before starting to type - longer for data insights
      const thinkingDelay = isDataInsights ? 1200 : 800;
      await new Promise(resolve => setTimeout(resolve, thinkingDelay));

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
                
                // Update estimated total length as we receive more content
                if (aiResponseContent.length > estimatedTotalLength) {
                  estimatedTotalLength = aiResponseContent.length + 500;
                }
                
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, content: aiResponseContent }
                    : msg
                ));
                
                // Calculate dynamic delay based on content and progress
                const delay = calculateStreamingDelay(aiResponseContent, estimatedTotalLength, isDataInsights);
                
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
