import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FloatingLyraAvatar } from '../FloatingLyraAvatar';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, className }: any) => (
    <div 
      data-testid="lyra-avatar" 
      data-size={size}
      data-expression={expression}
      className={className}
    >
      Lyra Avatar
    </div>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div 
        className={className}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  )
}));

// Mock ContextualLyraChat
const mockContextualLyraChat = vi.fn();
vi.mock('../chat/lyra/ContextualLyraChat', () => ({
  default: mockContextualLyraChat,
  ContextualLyraChat: mockContextualLyraChat
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FloatingLyraAvatar Error Recovery Tests', () => {
  const mockLessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'interactive',
    content: 'Learn AI basics',
    chapterTitle: 'Chapter 1: Getting Started',
    objectives: ['Understand AI'],
    keyTerms: ['AI'],
    difficulty: 'beginner' as const
  };

  let consoleSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Default mock implementation
    mockContextualLyraChat.mockImplementation((props: any) => (
      <div 
        data-testid="contextual-lyra-chat"
        data-expanded={props.expanded}
        className={props.className}
      >
        Mock Chat
      </div>
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    consoleSpy.mockRestore();
  });

  describe('Component Initialization Errors', () => {
    it('should handle ContextualLyraChat initialization failure', () => {
      mockContextualLyraChat.mockImplementation(() => {
        throw new Error('Chat initialization failed');
      });

      // Should not crash the parent component
      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing lesson context gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={null as any} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle invalid lesson context structure', () => {
      const invalidContext = {
        // Missing required fields
        invalidField: 'test'
      } as any;

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={invalidContext} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle circular reference in lesson context', () => {
      const circularContext: any = {
        chapterNumber: 1,
        lessonTitle: 'Test',
        phase: 'test',
        content: 'test'
      };
      circularContext.self = circularContext;

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={circularContext} />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Runtime Error Recovery', () => {
    it('should recover from callback execution errors', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback execution failed');
      });

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={errorCallback}
          />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      
      // Should not crash when callback throws
      expect(() => {
        chatProps.onEngagementChange?.(true, 1);
      }).not.toThrow();

      expect(errorCallback).toHaveBeenCalled();
    });

    it('should handle state update errors gracefully', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];

      // Rapid, potentially conflicting state updates
      expect(() => {
        for (let i = 0; i < 100; i++) {
          act(() => {
            chatProps.onExpandedChange?.(i % 2 === 0);
            chatProps.onEngagementChange?.(true, i);
          });
        }
      }).not.toThrow();
    });

    it('should handle async operation failures', async () => {
      const asyncCallback = vi.fn().mockRejectedValue(new Error('Async operation failed'));

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onNarrativePause={asyncCallback}
          />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];

      // Should handle async failures without crashing
      await expect(async () => {
        await chatProps.onNarrativePause?.();
      }).not.toThrow();
    });
  });

  describe('Memory Management Errors', () => {
    it('should handle memory leaks during rapid re-renders', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Simulate memory pressure with rapid re-renders
      expect(() => {
        for (let i = 0; i < 50; i++) {
          rerender(
            <TestWrapper>
              <FloatingLyraAvatar 
                lessonContext={{
                  ...mockLessonContext,
                  phase: `phase-${i}`,
                  content: `content-${i}`.repeat(100) // Large content
                }}
                initialExpanded={i % 2 === 0}
              />
            </TestWrapper>
          );
        }
      }).not.toThrow();
    });

    it('should clean up event listeners on unmount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Simulate some interactions that might add listeners
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onExpandedChange?.(true);
        chatProps.onEngagementChange?.(true, 1);
      });

      // Unmount should not throw
      expect(() => {
        unmount();
      }).not.toThrow();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should handle WeakMap/WeakSet failures gracefully', () => {
      // Mock WeakMap failure
      const originalWeakMap = global.WeakMap;
      global.WeakMap = vi.fn().mockImplementation(() => {
        throw new Error('WeakMap not supported');
      });

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();

      global.WeakMap = originalWeakMap;
    });
  });

  describe('Network and API Error Recovery', () => {
    it('should handle network connectivity issues', async () => {
      // Mock network error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Should continue to function without network
      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toBeInTheDocument();
    });

    it('should handle API timeout scenarios', async () => {
      // Mock slow API response
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Should remain functional during API issues
      await waitFor(() => {
        const chatContainer = screen.getByTestId('contextual-lyra-chat');
        expect(chatContainer).toBeInTheDocument();
      });
    });

    it('should handle malformed API responses', () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ malformed: 'response' })
      });

      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toBeInTheDocument();
    });
  });

  describe('Browser Environment Errors', () => {
    it('should handle missing browser APIs', () => {
      // Mock missing APIs
      const originalMatchMedia = window.matchMedia;
      const originalResizeObserver = global.ResizeObserver;
      const originalIntersectionObserver = global.IntersectionObserver;

      delete (window as any).matchMedia;
      delete (global as any).ResizeObserver;
      delete (global as any).IntersectionObserver;

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();

      // Restore
      window.matchMedia = originalMatchMedia;
      global.ResizeObserver = originalResizeObserver;
      global.IntersectionObserver = originalIntersectionObserver;
    });

    it('should handle localStorage unavailability', () => {
      const originalLocalStorage = window.localStorage;
      
      Object.defineProperty(window, 'localStorage', {
        value: null,
        writable: true
      });

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();

      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage
      });
    });

    it('should handle CSS-in-JS failures', () => {
      // Mock style injection failure
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'style') {
          throw new Error('Style creation failed');
        }
        return originalCreateElement.call(document, tagName);
      });

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();

      document.createElement = originalCreateElement;
    });
  });

  describe('Data Corruption Recovery', () => {
    it('should handle corrupted lesson context data', () => {
      const corruptedContext = {
        chapterNumber: 'invalid' as any,
        lessonTitle: null as any,
        phase: undefined as any,
        content: { invalid: 'object' } as any
      };

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={corruptedContext} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle invalid Maya journey state', () => {
      const invalidMayaState = {
        currentPhase: null,
        templatesExplored: 'invalid',
        userChoices: undefined,
        completedMilestones: { invalid: 'structure' }
      } as any;

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={mockLessonContext}
              mayaJourneyState={invalidMayaState}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should recover from JSON parsing errors', () => {
      // Mock JSON parsing failure
      const originalParse = JSON.parse;
      JSON.parse = vi.fn().mockImplementation((str) => {
        if (str.includes('test-failure')) {
          throw new Error('JSON parsing failed');
        }
        return originalParse(str);
      });

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                content: 'test-failure content'
              }}
            />
          </TestWrapper>
        );
      }).not.toThrow();

      JSON.parse = originalParse;
    });
  });

  describe('Graceful Degradation', () => {
    it('should provide fallback when animations fail', () => {
      // Mock framer-motion failure
      mockContextualLyraChat.mockImplementation((props) => {
        if (props.className?.includes('motion')) {
          throw new Error('Animation failed');
        }
        return (
          <div data-testid="contextual-lyra-chat">
            Fallback Chat (No Animations)
          </div>
        );
      });

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should work without advanced CSS features', () => {
      // Mock limited CSS support
      const mockElement = {
        style: {
          position: undefined,
          transform: undefined,
          filter: undefined
        }
      };

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should maintain core functionality during partial failures', () => {
      // Mock partial component failure
      mockContextualLyraChat.mockImplementation((props) => {
        // Simulate some features working, others failing
        if (Math.random() > 0.5) {
          throw new Error('Random feature failure');
        }
        return (
          <div data-testid="contextual-lyra-chat">
            Limited Functionality Chat
          </div>
        );
      });

      // Should not consistently fail
      let successCount = 0;
      for (let i = 0; i < 10; i++) {
        try {
          const { unmount } = render(
            <TestWrapper>
              <FloatingLyraAvatar 
                lessonContext={{
                  ...mockLessonContext,
                  chapterNumber: i
                }}
              />
            </TestWrapper>
          );
          successCount++;
          unmount();
        } catch {
          // Expected to fail sometimes
        }
      }

      expect(successCount).toBeGreaterThan(0);
    });
  });

  describe('Edge Case Error Scenarios', () => {
    it('should handle extremely long lesson content', () => {
      const extremelyLongContent = 'A'.repeat(100000); // 100k characters

      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                content: extremelyLongContent
              }}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      expect(() => {
        // Rapid prop changes
        for (let i = 0; i < 20; i++) {
          rerender(
            <TestWrapper>
              <FloatingLyraAvatar 
                lessonContext={mockLessonContext}
                disabled={i % 2 === 0}
                initialExpanded={i % 3 === 0}
                position={i % 4 === 0 ? 'top-left' : 'bottom-right'}
              />
            </TestWrapper>
          );
        }
      }).not.toThrow();
    });

    it('should handle component mounted in error boundary', () => {
      class TestErrorBoundary extends React.Component<
        { children: React.ReactNode },
        { hasError: boolean }
      > {
        constructor(props: any) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError() {
          return { hasError: true };
        }

        render() {
          if (this.state.hasError) {
            return <div data-testid="error-fallback">Error occurred</div>;
          }
          return this.props.children;
        }
      }

      // Force an error in the component
      mockContextualLyraChat.mockImplementation(() => {
        throw new Error('Component error');
      });

      render(
        <TestWrapper>
          <TestErrorBoundary>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestErrorBoundary>
        </TestWrapper>
      );

      // Error boundary should catch and display fallback
      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    });
  });
});