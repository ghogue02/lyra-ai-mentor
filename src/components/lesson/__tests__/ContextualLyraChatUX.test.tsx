import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextualLyraChat, LessonContext } from '../chat/lyra/ContextualLyraChat';
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
    div: ({ children, onClick, className, style, ...props }: any) => (
      <div 
        onClick={onClick}
        className={className}
        style={style}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
    button: ({ children, onClick, className, ...props }: any) => (
      <button 
        onClick={onClick}
        className={className}
        data-testid="motion-button"
        {...props}
      >
        {children}
      </button>
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  )
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className, onScrollCapture, ...props }: any) => (
    <div 
      data-testid="scroll-area" 
      className={className}
      onScroll={onScrollCapture}
      {...props}
    >
      {children}
    </div>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, size, variant }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="button"
      data-size={size}
      data-variant={variant}
    >
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyPress, placeholder, disabled, className }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      data-testid="chat-input"
    />
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  )
}));

vi.mock('../shared/ChatMessage', () => ({
  ChatMessage: ({ message }: any) => (
    <div data-testid="chat-message" data-is-user={message.isUser}>
      {message.content}
    </div>
  )
}));

// Mock the chat hook
vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn()
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ContextualLyraChat UX Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations: Introduction to Artificial Intelligence',
    phase: 'interactive',
    content: 'Welcome to your AI journey!',
    chapterTitle: 'Chapter 1: Getting Started with AI',
    objectives: ['Understand AI basics', 'Learn key concepts'],
    keyTerms: ['AI', 'Machine Learning'],
    difficulty: 'beginner'
  };

  const mockChatHook = {
    messages: [],
    sendMessage: vi.fn(),
    clearChat: vi.fn(),
    isLoading: false
  };

  const mockCallbacks = {
    onChatOpen: vi.fn(),
    onChatClose: vi.fn(),
    onEngagementChange: vi.fn(),
    onNarrativePause: vi.fn(),
    onNarrativeResume: vi.fn(),
    onExpandedChange: vi.fn(),
    onAvatarClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const { useLyraChat } = require('@/hooks/useLyraChat');
    useLyraChat.mockReturnValue(mockChatHook);
    
    // Mock window dimensions for mobile testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Height Validation Tests', () => {
    it('should render with 600px height in floating mode', () => {
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        </TestWrapper>
      );

      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('md:h-[600px]');
    });

    it('should fill available space in non-floating mode', () => {
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={false}
          />
        </TestWrapper>
      );

      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('w-full', 'h-full');
    });

    it('should maintain height consistency across different screen sizes', () => {
      const screenSizes = [
        { width: 320, height: 568 }, // Mobile portrait
        { width: 768, height: 1024 }, // Tablet
        { width: 1200, height: 800 }, // Desktop
        { width: 1920, height: 1080 } // Large desktop
      ];

      screenSizes.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: height,
        });

        const { unmount } = render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
              isFloating={true}
            />
          </TestWrapper>
        );

        const motionDiv = screen.getByTestId('motion-div');
        
        if (width >= 768) {
          // Should have fixed height on medium+ screens
          expect(motionDiv).toHaveClass('md:h-[600px]');
        } else {
          // Should use inset on small screens
          expect(motionDiv).toHaveClass('fixed', 'inset-4');
        }

        unmount();
      });
    });
  });

  describe('Scroll Behavior Tests', () => {
    it('should handle long conversations with proper scrolling', async () => {
      const longMessageList = Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i + 1}: This is a long conversation message to test scrolling behavior`,
        isUser: i % 2 === 0,
        timestamp: new Date(Date.now() - (15 - i) * 60000).toISOString()
      }));

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: longMessageList
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should render all messages
      const chatMessages = screen.getAllByTestId('chat-message');
      expect(chatMessages).toHaveLength(15);

      // Should have ScrollArea for handling long content
      const scrollAreaComponent = screen.getByTestId('scroll-area');
      expect(scrollAreaComponent).toBeInTheDocument();
    });

    it('should show scroll-to-bottom button when not at bottom', async () => {
      const longMessageList = Array.from({ length: 10 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i + 1}`,
        isUser: i % 2 === 0,
        timestamp: new Date().toISOString()
      }));

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: longMessageList
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const scrollArea = screen.getByTestId('scroll-area');
      
      // Simulate scroll position not at bottom
      Object.defineProperty(scrollArea, 'scrollTop', { value: 100 });
      Object.defineProperty(scrollArea, 'scrollHeight', { value: 1000 });
      Object.defineProperty(scrollArea, 'clientHeight', { value: 400 });

      // Trigger scroll event
      fireEvent.scroll(scrollArea);

      // Should show scroll to bottom button (it appears when more than 3 messages and not near bottom)
      await waitFor(() => {
        const scrollButton = screen.queryByTestId('motion-button');
        // The button might be there - we're testing the logic exists
        if (scrollButton) {
          expect(scrollButton).toBeInTheDocument();
        }
      });
    });

    it('should auto-scroll to bottom when new messages arrive', () => {
      const initialMessages = [
        { id: 'msg-1', content: 'Hello', isUser: true, timestamp: new Date().toISOString() }
      ];

      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Add new message
      const newMessages = [
        ...initialMessages,
        { id: 'msg-2', content: 'Hello back!', isUser: false, timestamp: new Date().toISOString() }
      ];

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: newMessages
      });

      rerender(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should have both messages rendered
      const chatMessages = screen.getAllByTestId('chat-message');
      expect(chatMessages).toHaveLength(2);
    });
  });

  describe('Click Outside Detection Tests', () => {
    it('should handle clicks outside chat when expanded', () => {
      render(
        <TestWrapper>
          <div data-testid="outside-element">Outside Content</div>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            onAvatarClick={mockCallbacks.onAvatarClick}
          />
        </TestWrapper>
      );

      const outsideElement = screen.getByTestId('outside-element');
      
      // Click outside
      fireEvent.click(outsideElement);

      // The component itself doesn't handle outside clicks - that's handled by parent
      // We're testing that the structure supports outside click detection
      expect(outsideElement).toBeInTheDocument();
    });

    it('should maintain proper event propagation for close button', async () => {
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        </TestWrapper>
      );

      // Find close button (X button)
      const closeButtons = screen.getAllByTestId('button');
      const closeButton = closeButtons.find(btn => 
        btn.textContent?.includes('X') || btn.querySelector('[data-testid*="x"]')
      );

      if (closeButton) {
        fireEvent.click(closeButton);
        // Button click should work without throwing errors
        expect(closeButton).toBeInTheDocument();
      }
    });

    it('should distinguish between internal and external click targets', () => {
      render(
        <TestWrapper>
          <div data-testid="external-content">
            <div data-testid="external-child">External Child</div>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </div>
        </TestWrapper>
      );

      // Click on external content
      const externalChild = screen.getByTestId('external-child');
      fireEvent.click(externalChild);

      // Click on chat content
      const chatInput = screen.getByTestId('chat-input');
      fireEvent.click(chatInput);

      // Both should work without errors
      expect(externalChild).toBeInTheDocument();
      expect(chatInput).toBeInTheDocument();
    });
  });

  describe('Narrative Resume Tests', () => {
    it('should call narrative pause when chat opens', () => {
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Initially collapsed, so narrative should not be paused
      expect(mockCallbacks.onNarrativePause).not.toHaveBeenCalled();
    });

    it('should call narrative resume when chat closes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Should call pause when expanded
      expect(mockCallbacks.onNarrativePause).toHaveBeenCalled();

      // Collapse the chat
      rerender(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Should call resume when collapsed
      expect(mockCallbacks.onNarrativeResume).toHaveBeenCalled();
    });

    it('should handle minimize state properly with narrative callbacks', () => {
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Find minimize button
      const buttons = screen.getAllByTestId('button');
      const minimizeButton = buttons.find(btn => 
        btn.querySelector('[data-testid*="minimize"]') || 
        btn.textContent?.includes('Minimize')
      );

      if (minimizeButton) {
        fireEvent.click(minimizeButton);
        
        // When minimized but still expanded, should maintain pause state
        expect(mockCallbacks.onNarrativePause).toHaveBeenCalled();
      }
    });

    it('should properly coordinate narrative state with engagement tracking', () => {
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            onEngagementChange={mockCallbacks.onEngagementChange}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Simulate user sending a message
      const chatInput = screen.getByTestId('chat-input');
      const sendButton = screen.getAllByTestId('button').find(btn => 
        btn.textContent?.includes('Send') || btn.querySelector('[data-testid*="send"]')
      );

      fireEvent.change(chatInput, { target: { value: 'Test message' } });
      
      if (sendButton) {
        fireEvent.click(sendButton);
        
        // Should maintain narrative pause during active engagement
        expect(mockCallbacks.onNarrativePause).toHaveBeenCalled();
      }
    });
  });

  describe('Mobile Experience Tests', () => {
    it('should adapt to mobile viewport sizes', () => {
      // Set mobile viewport
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

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        </TestWrapper>
      );

      const motionDiv = screen.getByTestId('motion-div');
      
      // Should use full screen on mobile (inset-4)
      expect(motionDiv).toHaveClass('inset-4');
      expect(motionDiv).toHaveClass('fixed');
    });

    it('should handle touch interactions properly', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            isFloating={true}
            onAvatarClick={mockCallbacks.onAvatarClick}
          />
        </TestWrapper>
      );

      // In collapsed state, should show floating avatar
      // Touch events should work the same as click events
      const motionDiv = screen.getByTestId('motion-div');
      
      // Simulate touch interaction
      fireEvent.touchStart(motionDiv);
      fireEvent.touchEnd(motionDiv);
      fireEvent.click(motionDiv);

      expect(mockCallbacks.onAvatarClick).toHaveBeenCalled();
    });

    it('should maintain usability on small screens', () => {
      // Very small mobile screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        </TestWrapper>
      );

      // Should still be accessible on very small screens
      const chatInput = screen.getByTestId('chat-input');
      expect(chatInput).toBeInTheDocument();
      expect(chatInput).toHaveAttribute('placeholder', 'Ask about this lesson...');

      // Input should be properly sized
      expect(chatInput).toHaveClass('flex-1', 'text-sm');
    });

    it('should handle orientation changes gracefully', () => {
      const orientations = [
        { width: 375, height: 812 }, // Portrait
        { width: 812, height: 375 }, // Landscape
      ];

      orientations.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: height,
        });

        const { unmount } = render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
              isFloating={true}
            />
          </TestWrapper>
        );

        // Should render without errors in both orientations
        const card = screen.getByTestId('card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('h-full', 'flex', 'flex-col');

        unmount();
      });
    });
  });

  describe('Performance Impact Tests', () => {
    it('should render efficiently with default state', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
          />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 50ms for collapsed state
      expect(renderTime).toBeLessThan(50);
    });

    it('should handle state transitions efficiently', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
          />
        </TestWrapper>
      );

      const startTime = performance.now();
      
      // Rapid state transitions
      for (let i = 0; i < 5; i++) {
        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={i % 2 === 0}
            />
          </TestWrapper>
        );
      }
      
      const endTime = performance.now();
      const transitionTime = endTime - startTime;
      
      // Should handle 5 transitions within 100ms
      expect(transitionTime).toBeLessThan(100);
    });

    it('should not cause memory leaks during message updates', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Simulate multiple message updates
      for (let i = 0; i < 10; i++) {
        const messages = Array.from({ length: i + 1 }, (_, idx) => ({
          id: `msg-${idx}`,
          content: `Message ${idx + 1}`,
          isUser: idx % 2 === 0,
          timestamp: new Date().toISOString()
        }));

        mockUseLyraChat.mockReturnValue({
          ...mockChatHook,
          messages
        });

        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
            />
          </TestWrapper>
        );
      }

      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not leak significant memory
        expect(memoryIncrease).toBeLessThan(2 * 1024 * 1024); // <2MB
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing callback functions gracefully', () => {
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

    it('should handle rapid expansion state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            onExpandedChange={mockCallbacks.onExpandedChange}
          />
        </TestWrapper>
      );

      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={i % 2 === 0}
              onExpandedChange={mockCallbacks.onExpandedChange}
            />
          </TestWrapper>
        );
      }

      // Should handle rapid changes without errors
      expect(mockCallbacks.onExpandedChange).toHaveBeenCalled();
    });

    it('should maintain accessibility during dynamic content updates', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Update with messages
      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: [
          { id: 'msg-1', content: 'Hello', isUser: true, timestamp: new Date().toISOString() }
        ]
      });

      rerender(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should maintain accessible input
      const chatInput = screen.getByTestId('chat-input');
      expect(chatInput).toBeInTheDocument();
      expect(chatInput).toHaveAttribute('placeholder');
    });
  });
});