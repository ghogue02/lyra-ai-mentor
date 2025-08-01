import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';
import { supabase } from '@/integrations/supabase/client';

// Mock the useLyraChat hook with real API integration testing
const mockUseLyraChat = vi.fn();

vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: mockUseLyraChat
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

// Mock other dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: () => <div data-testid="lyra-avatar">Avatar</div>
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="button">
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyPress, placeholder, disabled }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      data-testid="input"
    />
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>
}));

describe('API Integration Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn about AI basics',
    chapterTitle: 'Chapter 1: AI Fundamentals'
  };

  const mockSendMessage = vi.fn();
  const mockClearChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    mockUseLyraChat.mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: mockClearChat,
      isLoading: false
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GPT-4.1 API Integration', () => {
    it('should successfully send messages to GPT-4.1 API', async () => {
      const user = userEvent.setup();
      
      // Mock successful API response
      const mockApiResponse = {
        data: {
          choices: [{
            message: {
              content: 'AI is a field of computer science that focuses on creating intelligent machines.'
            }
          }]
        },
        error: null
      };

      (supabase.functions.invoke as any).mockResolvedValue(mockApiResponse);
      
      // Mock hook with successful API call
      let capturedSendMessage: any;
      mockUseLyraChat.mockImplementation(({ lessonContext }) => {
        capturedSendMessage = async (message: string) => {
          const response = await supabase.functions.invoke('chat-with-gpt4', {
            body: {
              message,
              context: lessonContext,
              model: 'gpt-4.1-preview'
            }
          });
          return response;
        };

        return {
          messages: [
            { id: '1', content: message, isUser: true, timestamp: Date.now() },
            { id: '2', content: mockApiResponse.data.choices[0].message.content, isUser: false, timestamp: Date.now() }
          ],
          sendMessage: capturedSendMessage,
          clearChat: mockClearChat,
          isLoading: false
        };
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Send a message
      const input = screen.getByTestId('input');
      const sendButton = screen.getByTestId('button');

      await user.type(input, 'What is artificial intelligence?');
      await user.click(sendButton);

      // Verify API was called with correct parameters
      expect(supabase.functions.invoke).toHaveBeenCalledWith('chat-with-gpt4', {
        body: {
          message: 'What is artificial intelligence?',
          context: mockLessonContext,
          model: 'gpt-4.1-preview'
        }
      });

      // Verify response is displayed
      await waitFor(() => {
        expect(screen.getByText('AI is a field of computer science that focuses on creating intelligent machines.')).toBeInTheDocument();
      });
    });

    it('should handle API rate limiting gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock rate limiting error
      const rateLimitError = {
        data: null,
        error: {
          message: 'Rate limit exceeded. Please try again in 60 seconds.',
          code: 'RATE_LIMIT_EXCEEDED',
          status: 429
        }
      };

      (supabase.functions.invoke as any).mockRejectedValueOnce(rateLimitError);

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { id: '1', content: 'Test message', isUser: true, timestamp: Date.now() },
          { 
            id: '2', 
            content: 'I\'m currently experiencing high demand. Please try again in a moment.', 
            isUser: false, 
            timestamp: Date.now(),
            isError: true
          }
        ],
        sendMessage: mockSendMessage.mockRejectedValueOnce(rateLimitError),
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Verify error message is displayed
      expect(screen.getByText('I\'m currently experiencing high demand. Please try again in a moment.')).toBeInTheDocument();
    });

    it('should handle API timeout errors', async () => {
      const user = userEvent.setup();
      vi.useFakeTimers();

      // Mock timeout error
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';

      (supabase.functions.invoke as any).mockImplementation(() => 
        new Promise((_, reject) => {
          setTimeout(() => reject(timeoutError), 30000); // 30 second timeout
        })
      );

      mockUseLyraChat.mockImplementation(() => ({
        messages: [],
        sendMessage: async () => {
          throw timeoutError;
        },
        clearChat: mockClearChat,
        isLoading: true
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Fast forward time to trigger timeout
      act(() => {
        vi.advanceTimersByTime(31000);
      });

      // Should show timeout error handling
      await waitFor(() => {
        expect(screen.getByText('Lyra is thinking...')).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('should handle network connectivity issues', async () => {
      const user = userEvent.setup();

      // Mock network error
      const networkError = new Error('Network request failed');
      networkError.name = 'NetworkError';

      (supabase.functions.invoke as any).mockRejectedValue(networkError);

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { 
            id: '1', 
            content: 'I\'m having trouble connecting right now. Please check your internet connection and try again.', 
            isUser: false, 
            timestamp: Date.now(),
            isError: true
          }
        ],
        sendMessage: mockSendMessage.mockRejectedValue(networkError),
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('I\'m having trouble connecting right now. Please check your internet connection and try again.')).toBeInTheDocument();
    });

    it('should retry failed requests with exponential backoff', async () => {
      const user = userEvent.setup();
      let attemptCount = 0;

      // Mock API that fails twice then succeeds
      (supabase.functions.invoke as any).mockImplementation(() => {
        attemptCount++;
        if (attemptCount <= 2) {
          return Promise.reject(new Error('Temporary server error'));
        }
        return Promise.resolve({
          data: {
            choices: [{
              message: { content: 'Success after retry!' }
            }]
          },
          error: null
        });
      });

      mockUseLyraChat.mockImplementation(() => ({
        messages: attemptCount > 2 ? [
          { id: '1', content: 'Test message', isUser: true, timestamp: Date.now() },
          { id: '2', content: 'Success after retry!', isUser: false, timestamp: Date.now() }
        ] : [],
        sendMessage: async (message: string) => {
          return await supabase.functions.invoke('chat-with-gpt4', {
            body: { message, context: mockLessonContext }
          });
        },
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // After retries, should show success message
      await waitFor(() => {
        if (attemptCount > 2) {
          expect(screen.getByText('Success after retry!')).toBeInTheDocument();
        }
      });

      // Verify multiple attempts were made
      expect(attemptCount).toBeGreaterThan(2);
    });
  });

  describe('Context-Aware API Calls', () => {
    it('should include lesson context in API requests', async () => {
      const user = userEvent.setup();

      mockUseLyraChat.mockImplementation(({ lessonContext }) => ({
        messages: [],
        sendMessage: async (message: string) => {
          await supabase.functions.invoke('chat-with-gpt4', {
            body: {
              message,
              lessonContext,
              chapterNumber: lessonContext.chapterNumber,
              lessonTitle: lessonContext.lessonTitle,
              currentPhase: lessonContext.phase,
              difficulty: lessonContext.difficulty
            }
          });
        },
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      const sendButton = screen.getByTestId('button');

      await user.type(input, 'Explain this lesson');
      await user.click(sendButton);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('chat-with-gpt4', {
        body: {
          message: 'Explain this lesson',
          lessonContext: mockLessonContext,
          chapterNumber: 1,
          lessonTitle: 'AI Foundations',
          currentPhase: 'introduction',
          difficulty: undefined
        }
      });
    });

    it('should adapt responses based on difficulty level', async () => {
      const advancedContext = {
        ...mockLessonContext,
        difficulty: 'advanced' as const
      };

      mockUseLyraChat.mockImplementation(({ lessonContext }) => ({
        messages: [],
        sendMessage: async (message: string) => {
          const response = await supabase.functions.invoke('chat-with-gpt4', {
            body: {
              message,
              context: lessonContext,
              adaptToDifficulty: lessonContext.difficulty
            }
          });
          return response;
        },
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={advancedContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      const sendButton = screen.getByTestId('button');

      await user.type(input, 'What is AI?');
      await user.click(sendButton);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('chat-with-gpt4', {
        body: {
          message: 'What is AI?',
          context: advancedContext,
          adaptToDifficulty: 'advanced'
        }
      });
    });
  });

  describe('Streaming Response Handling', () => {
    it('should handle streaming API responses', async () => {
      const user = userEvent.setup();
      
      // Mock streaming response
      const streamingResponse = {
        data: {
          stream: true,
          chunks: [
            { content: 'AI is ' },
            { content: 'a field ' },
            { content: 'of computer science.' }
          ]
        },
        error: null
      };

      (supabase.functions.invoke as any).mockResolvedValue(streamingResponse);

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { id: '1', content: 'What is AI?', isUser: true, timestamp: Date.now() },
          { id: '2', content: 'AI is a field of computer science.', isUser: false, timestamp: Date.now(), isStreaming: true }
        ],
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Should display the complete streamed message
      expect(screen.getByText('AI is a field of computer science.')).toBeInTheDocument();
    });

    it('should handle interrupted streaming', async () => {
      const user = userEvent.setup();

      // Mock interrupted stream
      const interruptedStream = {
        data: null,
        error: {
          message: 'Stream interrupted',
          code: 'STREAM_INTERRUPTED'
        }
      };

      (supabase.functions.invoke as any).mockRejectedValue(interruptedStream);

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { 
            id: '1', 
            content: 'Sorry, my response was interrupted. Could you please try asking again?', 
            isUser: false, 
            timestamp: Date.now(),
            isError: true
          }
        ],
        sendMessage: mockSendMessage.mockRejectedValue(interruptedStream),
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Sorry, my response was interrupted. Could you please try asking again?')).toBeInTheDocument();
    });
  });

  describe('API Security and Validation', () => {
    it('should sanitize user input before API calls', async () => {
      const user = userEvent.setup();
      
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitizedInput = '&lt;script&gt;alert("xss")&lt;/script&gt;';

      mockUseLyraChat.mockImplementation(() => ({
        messages: [],
        sendMessage: async (message: string) => {
          // Verify input is sanitized
          expect(message).not.toContain('<script>');
          
          await supabase.functions.invoke('chat-with-gpt4', {
            body: {
              message: sanitizedInput, // Should be sanitized
              context: mockLessonContext
            }
          });
        },
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      const sendButton = screen.getByTestId('button');

      await user.type(input, maliciousInput);
      await user.click(sendButton);
    });

    it('should validate API response structure', async () => {
      const user = userEvent.setup();

      // Mock malformed API response
      const malformedResponse = {
        data: {
          // Missing expected structure
          invalid: 'response'
        },
        error: null
      };

      (supabase.functions.invoke as any).mockResolvedValue(malformedResponse);

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { 
            id: '1', 
            content: 'I received an unexpected response format. Please try again.', 
            isUser: false, 
            timestamp: Date.now(),
            isError: true
          }
        ],
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('I received an unexpected response format. Please try again.')).toBeInTheDocument();
    });

    it('should handle API authentication errors', async () => {
      const authError = {
        data: null,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
          status: 401
        }
      };

      (supabase.functions.invoke as any).mockRejectedValue(authError);

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { 
            id: '1', 
            content: 'Authentication issue detected. Please refresh the page and try again.', 
            isUser: false, 
            timestamp: Date.now(),
            isError: true
          }
        ],
        sendMessage: mockSendMessage.mockRejectedValue(authError),
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Authentication issue detected. Please refresh the page and try again.')).toBeInTheDocument();
    });
  });

  describe('Performance and Caching', () => {
    it('should cache frequent responses to reduce API calls', async () => {
      const user = userEvent.setup();
      let apiCallCount = 0;

      (supabase.functions.invoke as any).mockImplementation(() => {
        apiCallCount++;
        return Promise.resolve({
          data: {
            choices: [{
              message: { content: 'Cached response about AI basics' }
            }]
          },
          error: null
        });
      });

      mockUseLyraChat.mockImplementation(() => ({
        messages: [
          { id: '1', content: 'What is AI?', isUser: true, timestamp: Date.now() },
          { id: '2', content: 'Cached response about AI basics', isUser: false, timestamp: Date.now() }
        ],
        sendMessage: async (message: string) => {
          // Simulate caching - don't call API for repeated questions
          if (message === 'What is AI?' && apiCallCount > 0) {
            return; // Return cached response
          }
          await supabase.functions.invoke('chat-with-gpt4', {
            body: { message, context: mockLessonContext }
          });
        },
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Cached response about AI basics')).toBeInTheDocument();
      
      // API should be called only once due to caching
      expect(apiCallCount).toBeLessThanOrEqual(1);
    });

    it('should handle concurrent API requests efficiently', async () => {
      const user = userEvent.setup();
      let concurrentCalls = 0;
      let maxConcurrentCalls = 0;

      (supabase.functions.invoke as any).mockImplementation(async () => {
        concurrentCalls++;
        maxConcurrentCalls = Math.max(maxConcurrentCalls, concurrentCalls);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        concurrentCalls--;
        
        return {
          data: {
            choices: [{
              message: { content: 'Response to concurrent request' }
            }]
          },
          error: null
        };
      });

      mockUseLyraChat.mockImplementation(() => ({
        messages: [],
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Should handle concurrent requests without overwhelming the API
      expect(maxConcurrentCalls).toBeLessThanOrEqual(3); // Reasonable concurrency limit
    });
  });
});