import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NarrativeManager from '../NarrativeManager';
import type { NarrativeMessage } from '../NarrativeManager';

// Mock dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size }: any) => (
    <div data-testid="lyra-avatar" data-size={size}>Lyra Avatar</div>
  )
}));

vi.mock('@/components/ui/VideoAnimation', () => ({
  default: ({ src, fallbackIcon, context, className }: any) => (
    <div 
      data-testid="video-animation" 
      data-src={src}
      data-context={context}
      className={className}
    >
      {fallbackIcon}
    </div>
  )
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, size, variant, ...props }: any) => (
    <button 
      onClick={onClick}
      className={className}
      data-size={size}
      data-variant={variant}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  )
}));

// Note: NarrativeManager does not use framer-motion, but mock if needed for other dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, initial, animate, exit, transition, ...props }: any) => (
      <div 
        onClick={onClick}
        className={className}
        data-testid="motion-div"
        data-motion-props={JSON.stringify({ initial, animate, exit, transition })}
        {...props}
      >
        {children}
      </div>
    ),
    span: ({ children, className, animate, transition, ...props }: any) => (
      <span 
        className={className}
        data-testid="motion-span"
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </span>
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

// Global AnimatePresence for any components that might import it
global.AnimatePresence = ({ children }: any) => <div data-testid="animate-presence">{children}</div>;

// Mock timers
vi.useFakeTimers();

describe('NarrativeManager', () => {
  const mockMessages: NarrativeMessage[] = [
    {
      id: '1',
      content: 'Hello, I am Maya!',
      emotion: 'excited',
      delay: 1000,
      showAvatar: true
    },
    {
      id: '2',  
      content: 'I am feeling frustrated about my emails.',
      emotion: 'frustrated',
      delay: 1500,
      showAvatar: true
    },
    {
      id: '3',
      content: 'But I am hopeful we can find a solution!',
      emotion: 'hopeful',
      delay: 2000,
      showAvatar: true
    }
  ];

  const mockCallbacks = {
    onComplete: vi.fn(),
    onInteractionPoint: vi.fn(),
    onReset: vi.fn()
  };

  const mockInteractionPoints = [
    {
      id: 'interaction-1',
      afterMessage: 1,
      content: <div data-testid="interaction-content">What do you think?</div>
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    
    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  describe('Initial Rendering', () => {
    it('should render first message by default', () => {
      render(<NarrativeManager messages={mockMessages} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Maya')).toBeInTheDocument();
      expect(screen.getByTestId('video-animation')).toBeInTheDocument();
    });

    it('should not render if no messages provided', () => {
      render(<NarrativeManager messages={[]} />);

      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should use custom character name', () => {
      render(
        <NarrativeManager 
          messages={mockMessages} 
          characterName="Lyra"
        />
      );

      expect(screen.getByText('Lyra')).toBeInTheDocument();
    });
  });

  describe('Message Display and Typing Effect', () => {
    it('should display typing effect for message content', () => {
      render(<NarrativeManager messages={mockMessages} />);

      // Initially should show empty or partial content
      const messageElement = screen.getByText(/Hello/);
      expect(messageElement).toBeInTheDocument();

      // Should show typing cursor
      expect(screen.getByTestId('motion-span')).toBeInTheDocument();
    });

    it('should complete typing after interval', async () => {
      render(<NarrativeManager messages={mockMessages} />);

      // Fast forward through typing animation
      act(() => {
        vi.advanceTimersByTime(2000); // Advance past typing duration
      });

      expect(screen.getByText('Hello, I am Maya!')).toBeInTheDocument();
    });

    it('should show different emotions with appropriate styling', () => {
      const { rerender } = render(<NarrativeManager messages={mockMessages} />);

      // Check excited emotion styling
      expect(screen.getByTestId('card')).toHaveClass('from-yellow-50');

      // Simulate navigation to frustrated message
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const advanceButton = screen.getByTestId('button');
      fireEvent.click(advanceButton);

      // Should show frustrated styling
      expect(screen.getByTestId('card')).toHaveClass('from-red-50');
    });

    it('should hide avatar when showAvatar is false', () => {
      const messagesWithoutAvatar = [
        { ...mockMessages[0], showAvatar: false }
      ];

      render(<NarrativeManager messages={messagesWithoutAvatar} />);

      expect(screen.queryByTestId('video-animation')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Controls', () => {
    it('should show navigation buttons after typing completes', async () => {
      render(<NarrativeManager messages={mockMessages} />);

      // Complete typing animation
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('should not show back button on first message', () => {
      render(<NarrativeManager messages={mockMessages} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const buttons = screen.getAllByTestId('button');
      // Should only have forward button (1 button total)
      expect(buttons).toHaveLength(1);
    });

    it('should show back button after advancing to second message', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<NarrativeManager messages={mockMessages} />);

      // Complete first message typing
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Click advance button
      const advanceButton = screen.getByTestId('button');
      await user.click(advanceButton);

      // Complete second message typing  
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const buttons = screen.getAllByTestId('button');
      // Should have both back and forward buttons
      expect(buttons.length).toBeGreaterThan(1);
    });

    it('should go back to previous message when back button clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<NarrativeManager messages={mockMessages} />);

      // Navigate to second message
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      await user.click(screen.getByTestId('button'));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Click back button (should be first button)
      const buttons = screen.getAllByTestId('button');
      await user.click(buttons[0]);

      // Should show first message again
      await waitFor(() => {
        expect(screen.getByText('Hello, I am Maya!')).toBeInTheDocument();
      });
    });

    it('should call onComplete when reaching last message', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <NarrativeManager 
          messages={mockMessages} 
          onComplete={mockCallbacks.onComplete}
        />
      );

      // Navigate through all messages
      for (let i = 0; i < mockMessages.length; i++) {
        act(() => {
          vi.advanceTimersByTime(2000);
        });

        const advanceButton = screen.getByTestId('button');
        await user.click(advanceButton);
      }

      // Should complete with slight delay
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(mockCallbacks.onComplete).toHaveBeenCalled();
    });
  });

  describe('Interaction Points', () => {
    it('should show interaction content after specified message', () => {
      render(
        <NarrativeManager 
          messages={mockMessages}
          interactionPoints={mockInteractionPoints}
        />
      );

      // Navigate to message index 1 (where interaction should appear)
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      fireEvent.click(screen.getByTestId('button'));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('interaction-content')).toBeInTheDocument();
    });

    it('should call onInteractionPoint when interaction is dismissed', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <NarrativeManager 
          messages={mockMessages}
          interactionPoints={mockInteractionPoints}
          onInteractionPoint={mockCallbacks.onInteractionPoint}
        />
      );

      // Navigate to interaction point
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      await user.click(screen.getByTestId('button'));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Click advance while interaction is showing
      await user.click(screen.getByTestId('button'));

      expect(mockCallbacks.onInteractionPoint).toHaveBeenCalledWith('interaction-1');
    });
  });

  describe('Auto Advance Mode', () => {
    it('should automatically advance when autoAdvance is true', () => {
      render(
        <NarrativeManager 
          messages={mockMessages}
          autoAdvance={true}
        />
      );

      // Complete typing for first message
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Auto advance should trigger after delay
      act(() => {
        vi.advanceTimersByTime(mockMessages[0].delay || 1500);
      });

      // Should show second message
      expect(screen.getByText(/frustrated/)).toBeInTheDocument();
    });

    it('should not auto advance on last message', () => {
      const singleMessage = [mockMessages[0]];
      render(
        <NarrativeManager 
          messages={singleMessage}
          autoAdvance={true}
          onComplete={mockCallbacks.onComplete}
        />
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        vi.advanceTimersByTime(singleMessage[0].delay || 1500);
      });

      // Should not call onComplete automatically
      expect(mockCallbacks.onComplete).not.toHaveBeenCalled();
    });
  });

  describe('State Persistence', () => {
    it('should save state to sessionStorage', () => {
      const mockSetItem = vi.fn();
      window.sessionStorage.setItem = mockSetItem;

      render(<NarrativeManager messages={mockMessages} phaseId="test-phase" />);

      expect(mockSetItem).toHaveBeenCalledWith(
        'narrative-test-phase',
        expect.stringContaining('"currentMessageIndex":0')
      );
    });

    it('should restore state from sessionStorage if recent', () => {
      const recentState = {
        currentMessageIndex: 1,
        timestamp: Date.now() - 1000 // 1 second ago
      };

      window.sessionStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(recentState));

      render(<NarrativeManager messages={mockMessages} phaseId="test-phase" />);

      // Should restore to message index 1
      expect(screen.getByText(/frustrated/)).toBeInTheDocument();
    });

    it('should not restore stale state', () => {
      const staleState = {
        currentMessageIndex: 2,
        timestamp: Date.now() - (10 * 60 * 1000) // 10 minutes ago
      };

      const mockRemoveItem = vi.fn();
      window.sessionStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(staleState));  
      window.sessionStorage.removeItem = mockRemoveItem;

      render(<NarrativeManager messages={mockMessages} phaseId="test-phase" />);

      // Should start from beginning and clear stale state
      expect(screen.getByText('Hello, I am Maya!')).toBeInTheDocument();
      expect(mockRemoveItem).toHaveBeenCalledWith('narrative-test-phase');
    });
  });

  describe('Stuck Detection and Reset', () => {
    it('should show reset button when stuck on last message', () => {
      render(
        <NarrativeManager 
          messages={[mockMessages[0]]}
          onReset={mockCallbacks.onReset}
        />
      );

      // Complete typing
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Wait for stuck detection timeout
      act(() => {
        vi.advanceTimersByTime(6000);
      });

      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('should call onReset when reset button clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <NarrativeManager 
          messages={[mockMessages[0]]}
          onReset={mockCallbacks.onReset}
        />
      );

      // Trigger stuck state
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      act(() => {
        vi.advanceTimersByTime(6000);
      });

      await user.click(screen.getByText('Reset'));

      expect(mockCallbacks.onReset).toHaveBeenCalled();
    });

    it('should clear sessionStorage on reset', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockRemoveItem = vi.fn();
      window.sessionStorage.removeItem = mockRemoveItem;

      render(
        <NarrativeManager 
          messages={[mockMessages[0]]}
          phaseId="test-phase"
        />
      );

      // Trigger stuck state and reset
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      await user.click(screen.getByText('Reset'));

      expect(mockRemoveItem).toHaveBeenCalledWith('narrative-test-phase');
    });
  });

  describe('Emotion Handling', () => {
    it('should show correct emotion icons', () => {
      const { container } = render(<NarrativeManager messages={mockMessages} />);

      // Should show yellow icon for excited emotion
      expect(container.querySelector('.text-yellow-500')).toBeInTheDocument();
    });

    it('should use correct video animation for emotions', () => {
      render(<NarrativeManager messages={mockMessages} />);

      const videoAnimation = screen.getByTestId('video-animation');
      expect(videoAnimation).toHaveAttribute('data-src', expect.stringContaining('lyra-excited-discovery.mp4'));
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid sessionStorage data gracefully', () => {
      const mockRemoveItem = vi.fn();
      window.sessionStorage.getItem = vi.fn().mockReturnValue('invalid-json');
      window.sessionStorage.removeItem = mockRemoveItem;

      expect(() => {
        render(<NarrativeManager messages={mockMessages} phaseId="test-phase" />);
      }).not.toThrow();

      expect(mockRemoveItem).toHaveBeenCalledWith('narrative-test-phase');
    });

    it('should handle missing callback functions gracefully', () => {
      expect(() => {
        render(<NarrativeManager messages={mockMessages} />);
      }).not.toThrow();
    });

    it('should handle empty messages array', () => {
      expect(() => {
        render(<NarrativeManager messages={[]} />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with many messages', () => {
      const manyMessages = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message content ${i}`,
        emotion: 'neutral' as const,
        showAvatar: true
      }));

      const startTime = performance.now();
      render(<NarrativeManager messages={manyMessages} />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(100);
    });

    it('should clean up timers on unmount', () => {
      const { unmount } = render(<NarrativeManager messages={mockMessages} />);

      // Start some operations that create timers
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Unmount should not cause issues
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<NarrativeManager messages={mockMessages} />);

      const characterName = screen.getByText('Maya');
      expect(characterName).toBeInTheDocument();
    });

    it('should support keyboard navigation for buttons', () => {
      render(<NarrativeManager messages={mockMessages} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const button = screen.getByTestId('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});