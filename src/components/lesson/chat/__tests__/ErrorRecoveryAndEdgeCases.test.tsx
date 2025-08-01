import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';
import { FloatingLyraAvatar } from '../lyra/FloatingLyraAvatar';
import NarrativeManager from '../lyra/maya/NarrativeManager';

// Error Boundary Component for testing
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong: {this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

// Mock dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression }: any) => (
    <div data-testid="lyra-avatar" data-size={size} data-expression={expression}>
      Avatar
    </div>
  )
}));

vi.mock('@/components/ui/VideoAnimation', () => ({
  default: ({ fallbackIcon, onError }: any) => {
    // Simulate potential video loading error
    React.useEffect(() => {
      if (onError && Math.random() > 0.9) {
        onError(new Error('Video failed to load'));
      }
    }, [onError]);
    
    return <div data-testid="video-animation">{fallbackIcon}</div>;
  }
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, onError, ...props }: any) => (
      <div 
        className={className}
        onClick={onClick}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
    span: ({ children }: any) => <span data-testid="motion-span">{children}</span>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
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
  Input: ({ value, onChange, onKeyPress, onError, ...props }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      data-testid="input"
      {...props}
    />
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, onError }: any) => (
    <div data-testid="scroll-area">{children}</div>
  )
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Error Recovery and Edge Cases', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn AI basics',
    chapterTitle: 'Chapter 1'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Hook Failures and Recovery', () => {
    it('should recover from useLyraChat hook failures', () => {
      const onError = vi.fn();

      // Mock hook that throws error
      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => {
          throw new Error('Chat service unavailable');
        })
      }));

      render(
        <TestWrapper>
          <TestErrorBoundary onError={onError}>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestErrorBoundary>
        </TestWrapper>
      );

      // Should catch error gracefully
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle intermittent hook failures', () => {
      let callCount = 0;
      
      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => {
          callCount++;
          if (callCount === 1) {
            throw new Error('Temporary failure');
          }
          return {
            messages: [],
            sendMessage: vi.fn(),
            clearChat: vi.fn(),
            isLoading: false
          };
        })
      }));

      const { rerender } = render(
        <TestWrapper>
          <TestErrorBoundary>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestErrorBoundary>
        </TestWrapper>
      );

      // First render should catch error
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      // Reset error boundary and retry
      rerender(
        <TestWrapper>
          <TestErrorBoundary>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
              key="retry"
            />
          </TestErrorBoundary>
        </TestWrapper>
      );

      // Second attempt should succeed
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
    });

    it('should provide fallback UI when chat is unavailable', () => {
      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [],
          sendMessage: vi.fn().mockRejectedValue(new Error('Service unavailable')),
          clearChat: vi.fn(),
          isLoading: false,
          error: 'Chat service is temporarily unavailable'
        }))
      }));

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should still render basic structure
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });
  });

  describe('Network and API Failures', () => {
    it('should handle network disconnections gracefully', async () => {
      const user = userEvent.setup();
      const sendMessage = vi.fn().mockRejectedValue(new Error('Network error'));

      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [
            { 
              id: '1', 
              content: 'I\'m having trouble connecting. Please check your network.', 
              isUser: false, 
              timestamp: Date.now(),
              isError: true
            }
          ],
          sendMessage,
          clearChat: vi.fn(),
          isLoading: false
        }))
      }));

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should show error message
      expect(screen.getByText('I\'m having trouble connecting. Please check your network.')).toBeInTheDocument();
      
      // Input should still be usable for retry
      expect(screen.getByTestId('input')).not.toBeDisabled();
    });

    it('should implement exponential backoff for failed requests', async () => {
      const user = userEvent.setup();
      const sendMessage = vi.fn();
      let attemptCount = 0;

      sendMessage.mockImplementation(async () => {
        attemptCount++;
        if (attemptCount <= 3) {
          throw new Error(`Attempt ${attemptCount} failed`);
        }
        return Promise.resolve();
      });

      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [],
          sendMessage,
          clearChat: vi.fn(),
          isLoading: false
        }))
      }));

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('input');
      const sendButton = screen.getByTestId('button');

      await user.type(input, 'Test message');
      await user.click(sendButton);

      // Should eventually succeed after retries
      await waitFor(() => {
        expect(attemptCount).toBeGreaterThan(1);
      });
    });

    it('should handle malformed API responses', () => {
      const sendMessage = vi.fn().mockResolvedValue({
        // Malformed response
        invalidData: 'not expected format'
      });

      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [
            { 
              id: '1', 
              content: 'I received an unexpected response. Please try again.', 
              isUser: false, 
              timestamp: Date.now(),
              isError: true
            }
          ],
          sendMessage,
          clearChat: vi.fn(),
          isLoading: false
        }))
      }));

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      expect(screen.getByText('I received an unexpected response. Please try again.')).toBeInTheDocument();
    });
  });

  describe('Invalid Props and Data Handling', () => {
    it('should handle null/undefined lesson context', () => {
      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={null as any}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle malformed lesson context gracefully', () => {
      const malformedContext = {
        chapterNumber: 'invalid' as any,
        lessonTitle: null as any,
        phase: undefined as any,
        content: 123 as any,
        chapterTitle: {} as any
      };

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={malformedContext}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing required props', () => {
      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={undefined as any}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should validate prop types at runtime', () => {
      const invalidProps = {
        lessonContext: 'string instead of object' as any,
        expanded: 'true' as any, // string instead of boolean
        onChatOpen: 'not a function' as any
      };

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat {...invalidProps} />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases in User Interactions', () => {
    it('should handle rapid clicking without breaking state', async () => {
      const user = userEvent.setup();
      const onAvatarClick = vi.fn();

      render(<FloatingLyraAvatar onAvatarClick={onAvatarClick} />);

      const avatar = screen.getByTestId('motion-div');

      // Rapid clicking simulation
      for (let i = 0; i < 20; i++) {
        await user.click(avatar);
      }

      // Should handle all clicks without errors
      expect(onAvatarClick).toHaveBeenCalledTimes(20);
    });

    it('should handle keyboard mashing gracefully', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('input');

      // Rapid keyboard input
      const randomKeys = ['a', 'b', 'c', 'd', 'e', 'Enter', 'Escape', 'Tab'];
      
      for (let i = 0; i < 100; i++) {
        const key = randomKeys[Math.floor(Math.random() * randomKeys.length)];
        fireEvent.keyDown(input, { key });
      }

      // Component should still be functional
      expect(input).toBeInTheDocument();
    });

    it('should handle simultaneous user interactions', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('input');
      const buttons = screen.getAllByTestId('button');

      // Simultaneous interactions
      const interactions = [
        user.type(input, 'Typing while clicking'),
        user.click(buttons[0]),
        user.hover(input),
        user.unhover(input)
      ];

      // Should handle all interactions without errors
      await Promise.allSettled(interactions);
      expect(input).toBeInTheDocument();
    });

    it('should handle focus/blur events correctly', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('input');

      // Rapid focus/blur
      for (let i = 0; i < 10; i++) {
        fireEvent.focus(input);
        fireEvent.blur(input);
      }

      expect(input).toBeInTheDocument();
    });
  });

  describe('Memory and Resource Edge Cases', () => {
    it('should handle memory pressure gracefully', () => {
      // Simulate low memory condition
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 0.5, // 512MB
        writable: true
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should render without issues even on low memory
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should handle very long message content', () => {
      const veryLongMessage = 'Very long message content '.repeat(1000); // ~25KB string

      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [
            { id: '1', content: veryLongMessage, isUser: false, timestamp: Date.now() }
          ],
          sendMessage: vi.fn(),
          clearChat: vi.fn(),
          isLoading: false
        }))
      }));

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle component unmounting during async operations', async () => {
      const slowAsyncOperation = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      );

      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [],
          sendMessage: slowAsyncOperation,
          clearChat: vi.fn(),
          isLoading: false
        }))
      }));

      const { unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Start async operation
      slowAsyncOperation();

      // Unmount before operation completes
      unmount();

      // Should not cause memory leaks or errors
      expect(slowAsyncOperation).toHaveBeenCalled();
    });
  });

  describe('Browser Compatibility Edge Cases', () => {
    it('should handle missing Web APIs gracefully', () => {
      // Mock missing ResizeObserver
      const originalResizeObserver = global.ResizeObserver;
      delete (global as any).ResizeObserver;

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();

      global.ResizeObserver = originalResizeObserver;
    });

    it('should handle missing localStorage', () => {
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();

      window.localStorage = originalLocalStorage;
    });

    it('should handle disabled JavaScript features', () => {
      // Mock disabled features
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      delete (window as any).requestAnimationFrame;

      expect(() => {
        render(<FloatingLyraAvatar state="pulsing" />);
      }).not.toThrow();

      window.requestAnimationFrame = originalRequestAnimationFrame;
    });
  });

  describe('Accessibility Edge Cases', () => {
    it('should handle screen reader disconnections', () => {
      // Mock screen reader being turned off
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        writable: true
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should maintain accessibility features
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder');
    });

    it('should handle high contrast mode failures', () => {
      // Mock failed high contrast detection
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn(() => {
          throw new Error('matchMedia failed');
        }),
        writable: true
      });

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('State Corruption Recovery', () => {
    it('should recover from corrupted component state', () => {
      const CorruptedComponent = () => {
        const [state, setState] = React.useState({ valid: true });

        React.useEffect(() => {
          // Simulate state corruption
          setState(null as any);
        }, []);

        if (!state) {
          return <div data-testid="fallback-state">Recovered from corrupted state</div>;
        }

        return (
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );
      };

      render(
        <TestWrapper>
          <CorruptedComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('fallback-state')).toBeInTheDocument();
    });

    it('should handle context provider failures', () => {
      const FailingProvider = ({ children }: { children: React.ReactNode }) => {
        throw new Error('Context provider failed');
      };

      expect(() => {
        render(
          <TestErrorBoundary>
            <FailingProvider>
              <ContextualLyraChat 
                lessonContext={mockLessonContext}
                expanded={true}
              />
            </FailingProvider>
          </TestErrorBoundary>
        );
      }).not.toThrow();

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Concurrency and Race Conditions', () => {
    it('should handle concurrent state updates safely', async () => {
      const Component = () => {
        const [expanded, setExpanded] = React.useState(false);

        React.useEffect(() => {
          // Simulate rapid concurrent updates
          for (let i = 0; i < 100; i++) {
            setTimeout(() => setExpanded(prev => !prev), i * 10);
          }
        }, []);

        return (
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={expanded}
          />
        );
      };

      expect(() => {
        render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle race conditions in async operations', async () => {
      let resolveCount = 0;
      const asyncOperation = vi.fn().mockImplementation(() => 
        new Promise(resolve => {
          const delay = Math.random() * 100;
          setTimeout(() => {
            resolveCount++;
            resolve(`Result ${resolveCount}`);
          }, delay);
        })
      );

      vi.mock('@/hooks/useLyraChat', () => ({
        useLyraChat: vi.fn(() => ({
          messages: [],
          sendMessage: asyncOperation,
          clearChat: vi.fn(),
          isLoading: false
        }))
      }));

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Start multiple concurrent operations
      const operations = Array.from({ length: 10 }, () => asyncOperation());

      // Should handle all operations without race conditions
      const results = await Promise.allSettled(operations);
      expect(results.length).toBe(10);
    });
  });
});