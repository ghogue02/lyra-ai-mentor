import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FloatingLyraAvatar } from '../FloatingLyraAvatar';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies for visual testing
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
      Lyra Avatar [{expression}]
    </div>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, animate, exit, transition, style, ...props }: any) => (
      <div 
        className={className}
        data-testid="motion-div"
        data-motion-initial={JSON.stringify(initial)}
        data-motion-animate={JSON.stringify(animate)}
        data-motion-exit={JSON.stringify(exit)}
        data-motion-transition={JSON.stringify(transition)}
        style={style}
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
    <span 
      data-testid="badge" 
      data-variant={variant} 
      className={className}
      style={{
        background: className?.includes('gradient') ? 'linear-gradient(to right, cyan, purple)' : undefined
      }}
    >
      {children}
    </span>
  )
}));

// Mock ContextualLyraChat to focus on FloatingLyraAvatar visual behavior
const mockContextualLyraChat = vi.fn();
vi.mock('../chat/lyra/ContextualLyraChat', () => ({
  default: mockContextualLyraChat,
  ContextualLyraChat: mockContextualLyraChat
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FloatingLyraAvatar Visual States Tests', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock ContextualLyraChat to capture visual states
    mockContextualLyraChat.mockImplementation((props: any) => (
      <div 
        data-testid="contextual-lyra-chat"
        data-expanded={props.expanded}
        data-floating={props.isFloating}
        className={props.className}
      >
        <div data-testid="chat-content">
          Mock Chat {props.expanded ? 'Expanded' : 'Collapsed'}
        </div>
      </div>
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Collapsed State Visual Tests', () => {
    it('should show notification pulse animation when collapsed with no messages', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Should render the pulsing notification
      const pulseElements = screen.getAllByTestId('motion-div');
      const pulseDiv = pulseElements.find(div => 
        div.getAttribute('data-motion-animate')?.includes('scale') &&
        div.getAttribute('data-motion-animate')?.includes('opacity')
      );
      
      expect(pulseDiv).toBeInTheDocument();
      
      // Should have gradient background styling
      const pulseElement = pulseDiv?.querySelector('[class*="gradient"]');
      expect(pulseElement).toBeInTheDocument();
    });

    it('should show message count badge when collapsed with engagement', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 3);
      });

      // Should show badge with message count
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('3 messages with Lyra');
      expect(badge).toHaveClass('bg-gradient-to-r', 'from-brand-cyan', 'to-brand-purple');
    });

    it('should handle new message notification correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate new message when collapsed
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      // Should trigger new message notification
      const newMessageElements = screen.getAllByTestId('motion-div');
      const newMessageDiv = newMessageElements.find(div => 
        div.getAttribute('data-motion-initial')?.includes('scale') &&
        div.getAttribute('data-motion-animate')?.includes('scale')
      );
      
      expect(newMessageDiv).toBeInTheDocument();
    });
  });

  describe('Expanded State Visual Tests', () => {
    it('should hide notification elements when expanded', () => {
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
        chatProps.onEngagementChange(true, 5);
      });

      // Badge should not be visible when expanded
      const badgeElements = screen.queryAllByTestId('badge');
      const messageBadge = badgeElements.find(badge => 
        badge.textContent?.includes('messages with Lyra')
      );
      expect(messageBadge).toBeUndefined();
    });

    it('should clear hasNewMessage state when expanded', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate new message while collapsed
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      // Expand the chat
      act(() => {
        chatProps.onExpandedChange(true);
      });

      // New message indicator should be cleared
      const pulseElements = screen.queryAllByTestId('motion-div');
      const newMessagePulse = pulseElements.find(div => 
        div.className?.includes('pulse') || 
        div.getAttribute('data-motion-animate')?.includes('opacity')
      );
      
      // Should not have new message pulse when expanded
      expect(newMessagePulse).toBeUndefined();
    });
  });

  describe('Position-based Visual Layout Tests', () => {
    it('should position elements correctly for bottom-right', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            position="bottom-right"
            initialExpanded={false}
          />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveClass('bottom-6', 'right-6');
    });

    it('should position badges correctly for different positions', () => {
      const positions = ['bottom-left', 'top-right', 'top-left'] as const;
      
      positions.forEach(position => {
        const { unmount } = render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={mockLessonContext}
              position={position}
              initialExpanded={false}
            />
          </TestWrapper>
        );

        // Simulate engagement to show badge
        const chatProps = mockContextualLyraChat.mock.calls[mockContextualLyraChat.mock.calls.length - 1][0];
        act(() => {
          chatProps.onEngagementChange(true, 2);
        });

        // Badge should be positioned relative to avatar position
        const motionDivs = screen.getAllByTestId('motion-div');
        const badgeContainer = motionDivs.find(div => {
          const classList = div.className;
          return classList?.includes(position.includes('bottom') ? 'bottom-20' : 'top-20') &&
                 classList?.includes(position.includes('right') ? 'right-6' : 'left-6');
        });

        expect(badgeContainer).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Animation and Motion Visual Tests', () => {
    it('should have proper animation properties for engagement badge', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      // Check for badge with proper animation setup
      const motionDivs = screen.getAllByTestId('motion-div');
      const badgeContainer = motionDivs.find(div => 
        div.getAttribute('data-motion-initial')?.includes('opacity') &&
        div.getAttribute('data-motion-animate')?.includes('opacity')
      );

      expect(badgeContainer).toBeInTheDocument();
      
      // Should have fade-in animation
      const initialProps = JSON.parse(badgeContainer!.getAttribute('data-motion-initial') || '{}');
      const animateProps = JSON.parse(badgeContainer!.getAttribute('data-motion-animate') || '{}');
      
      expect(initialProps.opacity).toBe(0);
      expect(animateProps.opacity).toBe(1);
    });

    it('should have pulsing animation for notification', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Look for pulsing notification element
      const motionDivs = screen.getAllByTestId('motion-div');
      const pulseContainer = motionDivs.find(div => {
        const animateAttr = div.getAttribute('data-motion-animate');
        return animateAttr?.includes('scale') && animateAttr?.includes('opacity');
      });

      expect(pulseContainer).toBeInTheDocument();
      
      // Should have continuous pulsing animation
      const animateProps = JSON.parse(pulseContainer!.getAttribute('data-motion-animate') || '{}');
      expect(animateProps.scale).toEqual([1, 1.5, 1]);
      expect(animateProps.opacity).toEqual([0.8, 0.2, 0.8]);
    });

    it('should have proper exit animations', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement to show elements
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      // Expand to trigger exit animations
      act(() => {
        chatProps.onExpandedChange(true);
      });

      // Elements should have exit animations defined
      const motionDivs = screen.getAllByTestId('motion-div');
      const elementsWithExitAnimation = motionDivs.filter(div => {
        const exitAttr = div.getAttribute('data-motion-exit');
        return exitAttr && exitAttr !== 'null' && exitAttr !== '{}';
      });

      expect(elementsWithExitAnimation.length).toBeGreaterThan(0);
    });
  });

  describe('CSS Class and Styling Tests', () => {
    it('should apply correct gradient classes to badge', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-gradient-to-r', 'from-brand-cyan', 'to-brand-purple');
      expect(badge).toHaveClass('text-white', 'border-0', 'shadow-lg');
    });

    it('should apply z-index classes correctly', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      const chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveClass('z-50');

      // Simulate engagement to show floating elements
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      // Check floating elements have proper z-index
      const motionDivs = screen.getAllByTestId('motion-div');
      const floatingElements = motionDivs.filter(div => 
        div.className?.includes('z-40')
      );

      expect(floatingElements.length).toBeGreaterThan(0);
    });

    it('should apply pointer-events-none to non-interactive elements', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement to show indicators
      const chatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        chatProps.onEngagementChange(true, 1);
      });

      // Notification elements should have pointer-events-none
      const motionDivs = screen.getAllByTestId('motion-div');
      const nonInteractiveElements = motionDivs.filter(div => 
        div.className?.includes('pointer-events-none')
      );

      expect(nonInteractiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Disabled State Visual Tests', () => {
    it('should not render any visual elements when disabled', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            disabled={true}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('contextual-lyra-chat')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lyra-avatar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Visual Behavior Tests', () => {
    it('should maintain visual consistency across re-renders', () => {
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Simulate engagement
      const initialChatProps = mockContextualLyraChat.mock.calls[0][0];
      act(() => {
        initialChatProps.onEngagementChange(true, 2);
      });

      const initialBadge = screen.getByTestId('badge');
      const initialBadgeText = initialBadge.textContent;

      // Re-render with same props
      rerender(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Re-trigger engagement to maintain state
      const newChatProps = mockContextualLyraChat.mock.calls[mockContextualLyraChat.mock.calls.length - 1][0];
      act(() => {
        newChatProps.onEngagementChange(true, 2);
      });

      const newBadge = screen.getByTestId('badge');
      expect(newBadge.textContent).toBe(initialBadgeText);
    });

    it('should handle rapid visual state changes smoothly', () => {
      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      const chatProps = mockContextualLyraChat.mock.calls[0][0];

      // Rapid state changes
      for (let i = 1; i <= 5; i++) {
        act(() => {
          chatProps.onEngagementChange(true, i);
        });
        
        // Should update badge text correctly
        const badge = screen.getByTestId('badge');
        expect(badge).toHaveTextContent(`${i} message${i > 1 ? 's' : ''} with Lyra`);
      }
    });
  });
});