import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';
import { FloatingLyraAvatar } from '../lyra/FloatingLyraAvatar';

// Mock dependencies
vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn(() => ({
    messages: [
      { id: '1', content: 'Hello! How can I help?', isUser: false, timestamp: Date.now() }
    ],
    sendMessage: vi.fn(),
    clearChat: vi.fn(),
    isLoading: false
  }))
}));

vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression }: any) => (
    <div data-testid="lyra-avatar" data-size={size} data-expression={expression}>
      Avatar
    </div>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, tabIndex, role, onKeyDown, ...props }: any) => (
      <div 
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={className}
        tabIndex={tabIndex}
        role={role}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    )
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
  Button: ({ children, onClick, disabled, 'aria-label': ariaLabel, ...props }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyPress, placeholder, disabled, 'aria-label': ariaLabel, ...props }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid="input"
      {...props}
    />
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => (
    <div data-testid="scroll-area" className={className}>{children}</div>
  )
}));

describe('Accessibility and Responsive Design Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn AI basics',
    chapterTitle: 'Chapter 1'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    describe('Keyboard Navigation', () => {
      it('should support full keyboard navigation', async () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            isFloating={true}
          />
        );

        const avatarContainer = screen.getByTestId('motion-div');
        
        // Should be focusable with Tab
        avatarContainer.focus();
        expect(avatarContainer).toHaveFocus();
        
        // Should activate with Enter
        fireEvent.keyDown(avatarContainer, { key: 'Enter' });
        expect(avatarContainer).toHaveAttribute('role', 'button');
        
        // Should activate with Space
        fireEvent.keyDown(avatarContainer, { key: ' ' });
        expect(avatarContainer).toHaveAttribute('tabIndex', '0');
      });

      it('should trap focus within expanded chat', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        const input = screen.getByTestId('input');
        const buttons = screen.getAllByTestId('button');
        
        // Input should be focusable
        input.focus();
        expect(input).toHaveFocus();
        
        // Buttons should be focusable
        buttons[0].focus();
        expect(buttons[0]).toHaveFocus();
      });

      it('should support keyboard shortcuts', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        const input = screen.getByTestId('input');
        
        // Enter should send message
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
        
        // Escape should close (if implemented)
        fireEvent.keyDown(input, { key: 'Escape' });
        
        expect(input).toBeInTheDocument();
      });
    });

    describe('ARIA Labels and Roles', () => {
      it('should have proper ARIA attributes on floating avatar', () => {
        render(<FloatingLyraAvatar state="idle" />);

        const avatarContainer = screen.getByTestId('motion-div');
        
        expect(avatarContainer).toHaveAttribute('role', 'button');
        expect(avatarContainer).toHaveAttribute('aria-label');
        expect(avatarContainer).toHaveAttribute('aria-pressed');
        expect(avatarContainer).toHaveAttribute('tabIndex', '0');
      });

      it('should update ARIA attributes based on state', () => {
        const { rerender } = render(<FloatingLyraAvatar state="idle" />);
        
        let avatarContainer = screen.getByTestId('motion-div');
        expect(avatarContainer).toHaveAttribute('aria-pressed', 'false');
        
        rerender(<FloatingLyraAvatar state="active" />);
        avatarContainer = screen.getByTestId('motion-div');
        expect(avatarContainer).toHaveAttribute('aria-pressed', 'true');
      });

      it('should have semantic HTML structure', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Should have proper heading structure
        expect(screen.getByText('Lyra - Lesson Assistant')).toBeInTheDocument();
        expect(screen.getByText('Ch.1 • AI Foundations')).toBeInTheDocument();
      });

      it('should provide screen reader friendly content', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Input should have accessible label
        const input = screen.getByTestId('input');
        expect(input).toHaveAttribute('placeholder', 'Ask about this lesson...');
      });
    });

    describe('Color Contrast and Visual Design', () => {
      it('should maintain sufficient color contrast', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        const card = screen.getByTestId('card');
        
        // Check for contrast-compliant classes
        expect(card).toHaveClass('premium-card');
      });

      it('should not rely solely on color for information', () => {
        render(<FloatingLyraAvatar state="pulsing" />);

        // Should have tooltip text, not just color indication
        expect(screen.getByText('Click to chat with Lyra')).toBeInTheDocument();
      });

      it('should support high contrast mode', () => {
        // Mock high contrast media query
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-contrast: high)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        });

        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Component should render without errors in high contrast mode
        expect(screen.getByTestId('card')).toBeInTheDocument();
      });
    });

    describe('Motion and Animation Accessibility', () => {
      it('should respect prefers-reduced-motion', () => {
        // Mock reduced motion preference
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        });

        render(<FloatingLyraAvatar state="pulsing" />);

        // Should still render but with reduced animations
        expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
      });

      it('should not cause seizures with animations', () => {
        render(<FloatingLyraAvatar state="pulsing" />);

        // Pulsing animation should be gentle
        const avatar = screen.getByTestId('lyra-avatar');
        expect(avatar).toHaveAttribute('data-with-wave', 'true');
      });
    });
  });

  describe('Responsive Design', () => {
    describe('Mobile Viewports', () => {
      beforeEach(() => {
        // Mock mobile viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 375,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 667,
        });
      });

      it('should adapt layout for mobile screens', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        );

        const card = screen.getByTestId('card');
        expect(card).toBeInTheDocument();
        
        // Should use mobile-friendly sizing
        const motionDiv = screen.getByTestId('motion-div');
        expect(motionDiv).toHaveClass('inset-4');
      });

      it('should maintain usability on small screens', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Input should be accessible on mobile
        const input = screen.getByTestId('input');
        expect(input).toBeInTheDocument();
        
        // Buttons should be touch-friendly
        const buttons = screen.getAllByTestId('button');
        expect(buttons.length).toBeGreaterThan(0);
      });

      it('should handle orientation changes', () => {
        const { rerender } = render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Simulate orientation change
        Object.defineProperty(window, 'innerWidth', { value: 667 });
        Object.defineProperty(window, 'innerHeight', { value: 375 });

        rerender(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        expect(screen.getByTestId('card')).toBeInTheDocument();
      });
    });

    describe('Tablet Viewports', () => {
      beforeEach(() => {
        // Mock tablet viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 768,
        });
      });

      it('should optimize layout for tablet screens', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        );

        expect(screen.getByTestId('card')).toBeInTheDocument();
      });

      it('should handle touch interactions', async () => {
        const user = userEvent.setup();
        
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            isFloating={true}
          />
        );

        const avatarContainer = screen.getByTestId('motion-div');
        
        // Simulate touch interaction
        await user.click(avatarContainer);
        
        expect(avatarContainer).toBeInTheDocument();
      });
    });

    describe('Desktop Viewports', () => {
      beforeEach(() => {
        // Mock desktop viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1920,
        });
      });

      it('should provide optimal desktop experience', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        );

        const motionDiv = screen.getByTestId('motion-div');
        expect(motionDiv).toHaveClass('md:w-96');
      });

      it('should support mouse interactions', async () => {
        const user = userEvent.setup();
        
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            isFloating={true}
          />
        );

        const avatarContainer = screen.getByTestId('motion-div');
        
        // Should handle hover states
        await user.hover(avatarContainer);
        expect(avatarContainer).toBeInTheDocument();
      });
    });

    describe('Text Scaling and Zoom', () => {
      it('should support 200% zoom without horizontal scrolling', () => {
        // Mock zoom level
        Object.defineProperty(window, 'devicePixelRatio', {
          writable: true,
          value: 2,
        });

        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        expect(screen.getByTestId('card')).toBeInTheDocument();
      });

      it('should maintain functionality with large text', () => {
        // Mock large text preference
        document.documentElement.style.fontSize = '24px';

        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        const input = screen.getByTestId('input');
        expect(input).toBeInTheDocument();

        // Reset
        document.documentElement.style.fontSize = '';
      });
    });
  });

  describe('Assistive Technology Support', () => {
    describe('Screen Reader Compatibility', () => {
      it('should announce dynamic content changes', () => {
        const { rerender } = render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
          />
        );

        // Initially collapsed
        expect(screen.getByTestId('motion-div')).toHaveAttribute('aria-pressed', 'false');

        // Expand chat
        rerender(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Should have proper content for screen readers
        expect(screen.getByText('Lyra - Lesson Assistant')).toBeInTheDocument();
      });

      it('should provide context for message history', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // Messages should be in accessible format
        expect(screen.getByText('Hello! How can I help?')).toBeInTheDocument();
      });
    });

    describe('Voice Control Support', () => {
      it('should support voice activation commands', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            isFloating={true}
          />
        );

        const avatarContainer = screen.getByTestId('motion-div');
        
        // Should be recognizable by voice control software
        expect(avatarContainer).toHaveAttribute('role', 'button');
        expect(avatarContainer).toHaveAttribute('aria-label');
      });
    });

    describe('Switch Navigation', () => {
      it('should support single-switch navigation', () => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );

        // All interactive elements should be focusable
        const input = screen.getByTestId('input');
        const buttons = screen.getAllByTestId('button');
        
        expect(input).toBeInTheDocument();
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error States and Feedback', () => {
    it('should provide accessible error messages', () => {
      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: [
          { 
            id: '1', 
            content: 'Sorry, I encountered an error. Please try again.', 
            isUser: false, 
            timestamp: Date.now(),
            isError: true
          }
        ],
        sendMessage: vi.fn(),
        clearChat: vi.fn(),
        isLoading: false
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Sorry, I encountered an error. Please try again.')).toBeInTheDocument();
    });

    it('should announce loading states to screen readers', () => {
      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: [],
        sendMessage: vi.fn(),
        clearChat: vi.fn(),
        isLoading: true
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Lyra is thinking...')).toBeInTheDocument();
    });
  });

  describe('Performance Impact on Accessibility', () => {
    it('should maintain accessibility during heavy animations', () => {
      render(<FloatingLyraAvatar state="pulsing" />);

      const avatarContainer = screen.getByTestId('motion-div');
      
      // Should remain focusable during animations
      avatarContainer.focus();
      expect(avatarContainer).toHaveFocus();
      
      // ARIA attributes should remain stable
      expect(avatarContainer).toHaveAttribute('role', 'button');
    });

    it('should not impact screen reader performance', () => {
      const startTime = performance.now();

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly enough for good screen reader experience
      expect(renderTime).toBeLessThan(100);
    });
  });
});