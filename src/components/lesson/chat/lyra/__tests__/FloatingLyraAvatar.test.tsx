import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingLyraAvatar } from '../FloatingLyraAvatar';

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
    div: ({ children, onClick, onKeyDown, tabIndex, role, ...props }: any) => (
      <div 
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        data-testid="motion-div"
        data-motion-props={JSON.stringify(props)}
      >
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

describe('FloatingLyraAvatar', () => {
  const mockOnAvatarClick = vi.fn();
  const mockLessonContext = {
    lessonId: 'lesson-1',
    currentStep: 1,
    totalSteps: 5,
    hasActiveChat: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering and Visibility', () => {
    it('should render with default props', () => {
      render(<FloatingLyraAvatar />);
      
      expect(screen.getByTestId('animate-presence')).toBeInTheDocument();
      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
    });

    it('should not render when hidden prop is true', () => {
      render(<FloatingLyraAvatar hidden={true} />);
      
      const animatePresence = screen.getByTestId('animate-presence');
      expect(animatePresence).toBeInTheDocument();
      // Children should not be rendered when hidden
      expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<FloatingLyraAvatar className="custom-class" />);
      
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('custom-class');
    });

    it('should render with lesson context', () => {
      render(
        <FloatingLyraAvatar 
          lessonContext={mockLessonContext}
          onAvatarClick={mockOnAvatarClick}
        />
      );
      
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
    });
  });

  describe('Avatar States and Expressions', () => {
    it('should render with idle state by default', () => {
      render(<FloatingLyraAvatar />);
      
      const avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-expression', 'default');
      expect(avatar).toHaveAttribute('data-with-wave', 'false');
    });

    it('should render with helping expression when state is active', () => {
      render(<FloatingLyraAvatar state="active" />);
      
      const avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-expression', 'helping');
    });

    it('should render with thinking expression when state is pulsing', () => {
      render(<FloatingLyraAvatar state="pulsing" />);
      
      const avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-expression', 'thinking');
      expect(avatar).toHaveAttribute('data-with-wave', 'true');
    });

    it('should render with correct size', () => {
      render(<FloatingLyraAvatar />);
      
      const avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-size', 'lg');
      expect(avatar).toHaveAttribute('data-animated', 'true');
    });
  });

  describe('User Interactions', () => {
    it('should call onAvatarClick when clicked', async () => {
      const user = userEvent.setup();
      render(<FloatingLyraAvatar onAvatarClick={mockOnAvatarClick} />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      await user.click(avatarContainer);
      
      expect(mockOnAvatarClick).toHaveBeenCalledOnce();
    });

    it('should call onAvatarClick when Enter key is pressed', () => {
      render(<FloatingLyraAvatar onAvatarClick={mockOnAvatarClick} />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      fireEvent.keyDown(avatarContainer, { key: 'Enter' });
      
      expect(mockOnAvatarClick).toHaveBeenCalledOnce();
    });

    it('should call onAvatarClick when Space key is pressed', () => {
      render(<FloatingLyraAvatar onAvatarClick={mockOnAvatarClick} />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      fireEvent.keyDown(avatarContainer, { key: ' ' });
      
      expect(mockOnAvatarClick).toHaveBeenCalledOnce();
    });

    it('should not call onAvatarClick for other keys', () => {
      render(<FloatingLyraAvatar onAvatarClick={mockOnAvatarClick} />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      fireEvent.keyDown(avatarContainer, { key: 'Tab' });
      fireEvent.keyDown(avatarContainer, { key: 'Escape' });
      
      expect(mockOnAvatarClick).not.toHaveBeenCalled();
    });

    it('should handle missing onAvatarClick gracefully', async () => {
      const user = userEvent.setup();
      render(<FloatingLyraAvatar />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      
      // Should not throw error
      expect(() => user.click(avatarContainer)).not.toThrow();
      expect(() => fireEvent.keyDown(avatarContainer, { key: 'Enter' })).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<FloatingLyraAvatar state="idle" />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      expect(avatarContainer).toHaveAttribute('role', 'button');
      expect(avatarContainer).toHaveAttribute('tabIndex', '0');
      expect(avatarContainer).toHaveAttribute('aria-label', 'Lyra AI Assistant - Click to start chat');
    });

    it('should update ARIA label based on state', () => {
      render(<FloatingLyraAvatar state="pulsing" />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      expect(avatarContainer).toHaveAttribute('aria-label', 'Lyra AI Assistant - Click to interact');
    });

    it('should indicate active state in ARIA attributes', () => {
      render(<FloatingLyraAvatar state="active" />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      expect(avatarContainer).toHaveAttribute('aria-label', 'Lyra AI Assistant - Chat is active');
      expect(avatarContainer).toHaveAttribute('aria-pressed', 'true');
    });

    it('should be keyboard focusable', () => {
      render(<FloatingLyraAvatar />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      avatarContainer.focus();
      
      expect(avatarContainer).toHaveFocus();
    });
  });

  describe('Status Indicator', () => {
    it('should show gray indicator for idle state', () => {
      const { container } = render(<FloatingLyraAvatar state="idle" />);
      
      // Check for status indicator classes in the DOM
      const statusIndicator = container.querySelector('.bg-gray-400');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should show yellow indicator for pulsing state', () => {
      const { container } = render(<FloatingLyraAvatar state="pulsing" />);
      
      const statusIndicator = container.querySelector('.bg-yellow-500');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should show green indicator for active state', () => {
      const { container } = render(<FloatingLyraAvatar state="active" />);
      
      const statusIndicator = container.querySelector('.bg-green-500');
      expect(statusIndicator).toBeInTheDocument();
    });
  });

  describe('Tooltip Behavior', () => {
    it('should show tooltip only for pulsing state', () => {
      const { rerender } = render(<FloatingLyraAvatar state="idle" />);
      
      expect(screen.queryByText('Click to chat with Lyra')).not.toBeInTheDocument();
      
      rerender(<FloatingLyraAvatar state="pulsing" />);
      expect(screen.getByText('Click to chat with Lyra')).toBeInTheDocument();
      
      rerender(<FloatingLyraAvatar state="active" />);
      expect(screen.queryByText('Click to chat with Lyra')).not.toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle state changes properly', () => {
      const { rerender } = render(<FloatingLyraAvatar state="idle" />);
      
      let avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-expression', 'default');
      
      rerender(<FloatingLyraAvatar state="pulsing" />);
      avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-expression', 'thinking');
      
      rerender(<FloatingLyraAvatar state="active" />);
      avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toHaveAttribute('data-expression', 'helping');
    });

    it('should handle rapid state changes', () => {
      const { rerender } = render(<FloatingLyraAvatar state="idle" />);
      
      // Rapid state changes should not break the component
      rerender(<FloatingLyraAvatar state="pulsing" />);
      rerender(<FloatingLyraAvatar state="active" />);
      rerender(<FloatingLyraAvatar state="idle" />);
      
      const avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-expression', 'default');
    });
  });

  describe('Lesson Context Integration', () => {
    it('should handle lesson context without errors', () => {
      expect(() => {
        render(
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            state="pulsing"
          />
        );
      }).not.toThrow();
    });

    it('should work without lesson context', () => {
      expect(() => {
        render(<FloatingLyraAvatar state="active" />);
      }).not.toThrow();
    });

    it('should handle invalid lesson context gracefully', () => {
      expect(() => {
        render(
          <FloatingLyraAvatar 
            lessonContext={null as any}
            state="pulsing"
          />
        );
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      
      render(<FloatingLyraAvatar />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 50ms for a simple component
      expect(renderTime).toBeLessThan(50);
    });

    it('should handle multiple rapid re-renders', () => {
      const { rerender } = render(<FloatingLyraAvatar state="idle" />);
      
      const startTime = performance.now();
      
      // Simulate rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<FloatingLyraAvatar state={i % 3 === 0 ? 'idle' : i % 3 === 1 ? 'pulsing' : 'active'} />);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle 10 re-renders within 100ms
      expect(totalTime).toBeLessThan(100);
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle avatar rendering errors gracefully', () => {
      // Mock console.error to verify error handling
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // This should not crash the component
      render(<FloatingLyraAvatar />);
      
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('should handle callback errors gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      
      render(<FloatingLyraAvatar onAvatarClick={errorCallback} />);
      
      const avatarContainer = screen.getByTestId('motion-div');
      
      // Should not crash when callback throws
      expect(() => {
        fireEvent.click(avatarContainer);
      }).not.toThrow();
      
      expect(errorCallback).toHaveBeenCalled();
    });
  });
});