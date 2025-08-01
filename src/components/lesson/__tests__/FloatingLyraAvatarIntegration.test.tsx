import { describe, it, expect, vi, beforeEach, afterEach, MockedFunction } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingLyraAvatar } from '../FloatingLyraAvatar';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, animated, withWave, className }: any) => (
    <div 
      data-testid="lyra-avatar" 
      data-size={size}
      data-expression={expression}
      data-animated={animated}
      data-with-wave={withWave}
      className={className}
    >
      Lyra Avatar
    </div>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, onKeyDown, tabIndex, role, initial, animate, exit, whileHover, whileTap, transition, className, ...props }: any) => (
      <div 
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        className={className}
        data-testid="motion-div"
        data-motion-props={JSON.stringify({ initial, animate, exit, whileHover, whileTap, transition })}
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

describe('FloatingLyraAvatar Integration Tests', () => {
  const mockLessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations: Introduction to Artificial Intelligence',
    phase: 'interactive',
    content: 'Welcome to your AI journey!',
    chapterTitle: 'Chapter 1: Getting Started with AI',
    objectives: ['Understand AI basics', 'Learn key concepts'],
    keyTerms: ['AI', 'Machine Learning'],
    difficulty: 'beginner' as const
  };

  const mockCallbacks = {
    onEngagementChange: vi.fn(),
    onNarrativePause: vi.fn(),
    onNarrativeResume: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock ContextualLyraChat to capture props and render a simple div
    mockContextualLyraChat.mockImplementation((props: any) => (
      <div 
        data-testid="contextual-lyra-chat"
        data-expanded={props.expanded}
        data-floating={props.isFloating}
        data-lesson-title={props.lessonContext?.lessonTitle}
      >
        Mock ContextualLyraChat
        {props.expanded && <div data-testid="chat-expanded">Chat is expanded</div>}
      </div>
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Visual Appearance Tests', () => {
    it('should render avatar in bottom-right corner with proper styling', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            position="bottom-right"
          />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toBeInTheDocument();
      expect(chatContainer).toHaveClass('fixed', 'z-50', 'bottom-6', 'right-6');
    });

    it('should render avatar in different positions', () => {
      const positions = ['bottom-left', 'top-right', 'top-left'] as const;
      
      positions.forEach(position => {
        const { rerender } = render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={mockLessonContext}
              position={position}
            />
          </TestWrapper>
        );

        const chatContainer = screen.getByTestId('contextual-lyra-chat');
        
        // Check position classes based on position prop
        if (position === 'bottom-left') {
          expect(chatContainer).toHaveClass('bottom-6', 'left-6');
        } else if (position === 'top-right') {
          expect(chatContainer).toHaveClass('top-6', 'right-6');
        } else if (position === 'top-left') {
          expect(chatContainer).toHaveClass('top-6', 'left-6');
        }

        rerender(<div />); // Clean up for next iteration
      });
    });

    it('should apply custom className', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            className="custom-avatar-class"
          />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveClass('custom-avatar-class');
    });

    it('should not render when disabled', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            disabled={true}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('contextual-lyra-chat')).not.toBeInTheDocument();
    });

    it('should render with proper z-index for layering', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveClass('z-50');
    });
  });

  describe('Interaction Flow Tests', () => {
    it('should handle expansion state changes correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Should start collapsed
      let chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveAttribute('data-expanded', 'false');

      // Simulate expansion via ContextualLyraChat's onExpandedChange callback
      const onExpandedChange = mockContextualLyraChat.mock.calls[0][0].onExpandedChange;
      act(() => {
        onExpandedChange(true);
      });

      // Should update to expanded
      await waitFor(() => {
        chatContainer = screen.getByTestId('contextual-lyra-chat');
        expect(chatContainer).toHaveAttribute('data-expanded', 'true');
      });
    });

    it('should trigger narrative pause/resume callbacks', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Get the callbacks passed to ContextualLyraChat
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      
      // Simulate chat opening
      act(() => {
        chatProps.onChatOpen();
      });

      expect(mockCallbacks.onNarrativePause).toHaveBeenCalled();

      // Simulate chat closing
      act(() => {
        chatProps.onChatClose();
      });

      expect(mockCallbacks.onNarrativeResume).toHaveBeenCalled();
    });

    it('should handle engagement tracking correctly', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={mockCallbacks.onEngagementChange}
          />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      
      // Simulate engagement change
      act(() => {
        chatProps.onEngagementChange(true, 3);
      });

      expect(mockCallbacks.onEngagementChange).toHaveBeenCalledWith(true, 3);
    });

    it('should show proper lesson context in chat', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveAttribute('data-lesson-title', mockLessonContext.lessonTitle);
    });
  });

  describe('Engagement Indicators Tests', () => {
    it('should show message count badge when collapsed with messages', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement with messages
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 5);
      });

      // Badge should show message count
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('5 messages with Lyra');
    });

    it('should handle singular message count correctly', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate single message
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('1 message with Lyra');
    });

    it('should not show badge when expanded', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={true}
          />
        </TestWrapper>
      );

      // Simulate engagement
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 3);
      });

      // Badge should not be visible when expanded
      const motionDivs = screen.getAllByTestId('motion-div');
      const badgeContainer = motionDivs.find(div => div.textContent?.includes('messages with Lyra'));
      expect(badgeContainer).toBeUndefined();
    });
  });

  describe('Maya Journey Integration Tests', () => {
    it('should pass Maya journey state to ContextualLyraChat', () => {
      const mayaJourneyState = {
        currentPhase: 'draft-review',
        templatesExplored: ['thank-you', 'fundraising'],
        userChoices: {
          preferredTone: 'warm',
          organizationType: 'community-nonprofit'
        },
        completedMilestones: ['email-basics', 'pace-framework']
      };

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={{
              ...mockLessonContext,
              chapterNumber: 2,
              lessonTitle: "Maya's Email Challenge"
            }}
            mayaJourneyState={mayaJourneyState}
          />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      expect(chatProps.mayaJourneyState).toEqual(mayaJourneyState);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing callback functions gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();

      // Simulate callback calls without actual callbacks
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      
      expect(() => {
        chatProps.onChatOpen?.();
        chatProps.onChatClose?.();
        chatProps.onEngagementChange?.(true, 1);
        chatProps.onNarrativePause?.();
        chatProps.onNarrativeResume?.();
      }).not.toThrow();
    });

    it('should handle rapid state changes without errors', async () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      
      // Rapid state changes
      act(() => {
        chatProps.onExpandedChange(true);
        chatProps.onExpandedChange(false);
        chatProps.onExpandedChange(true);
        chatProps.onEngagementChange(true, 1);
        chatProps.onEngagementChange(true, 2);
        chatProps.onEngagementChange(true, 3);
      });

      // Should still be functional
      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toBeInTheDocument();
    });

    it('should handle invalid lesson context gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={null as any} />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility Tests', () => {
    it('should pass proper accessibility props to ContextualLyraChat', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      expect(chatProps.isFloating).toBe(true);
      expect(chatProps.lessonContext).toEqual(mockLessonContext);
    });

    it('should maintain focus management through expansion states', async () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      
      // Test focus doesn't break during state changes
      act(() => {
        chatProps.onExpandedChange(true);
      });

      act(() => {
        chatProps.onExpandedChange(false);
      });

      // Component should still be accessible
      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms for initial render
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle multiple rapid re-renders efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const startTime = performance.now();
      
      // Multiple rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                phase: `phase-${i}`
              }}
            />
          </TestWrapper>
        );
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle 10 re-renders within 200ms
      expect(totalTime).toBeLessThan(200);
    });

    it('should not cause memory leaks during state changes', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Simulate multiple state changes that could cause leaks
      for (let i = 0; i < 20; i++) {
        const chatProps = mockContextualLyraChat.mock.calls[mockContextualLyraChat.mock.calls.length - 1][0];
        
        act(() => {
          chatProps.onExpandedChange(i % 2 === 0);
          chatProps.onEngagementChange(true, i);
        });
        
        rerender(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                phase: `dynamic-phase-${i}`
              }}
            />
          </TestWrapper>
        );
      }

      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not leak significant memory
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // <5MB
      }
    });
  });

  describe('Responsive Design Tests', () => {
    it('should handle different viewport sizes', () => {
      // Mock different viewport sizes
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1200, height: 800 }  // Desktop
      ];

      viewports.forEach(viewport => {
        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height,
        });

        const { unmount } = render(
          <TestWrapper>
            <FloatingLyraAvatar lessonContext={mockLessonContext} />
          </TestWrapper>
        );

        // Should render without errors at any viewport size
        const chatContainer = screen.getByTestId('contextual-lyra-chat');
        expect(chatContainer).toBeInTheDocument();

        unmount();
      });
    });
  });
});