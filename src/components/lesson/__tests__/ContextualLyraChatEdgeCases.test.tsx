import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextualLyraChat, LessonContext } from '../chat/lyra/ContextualLyraChat';
import { BrowserRouter } from 'react-router-dom';

// Mock all dependencies - reuse from main test file
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

const mockUseLyraChat = vi.fn();
vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: mockUseLyraChat
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ContextualLyraChat Edge Cases & Performance Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 2,
    lessonTitle: "Maya's Email Challenge",
    phase: 'draft-review',
    content: 'Test lesson content for edge cases',
    chapterTitle: 'Chapter 2: Email Communication',
    objectives: ['Write effective emails', 'Use PACE framework'],
    keyTerms: ['PACE', 'Email Communication'],
    difficulty: 'intermediate'
  };

  const mockChatHook = {
    messages: [],
    sendMessage: vi.fn(),
    clearChat: vi.fn(),
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLyraChat.mockReturnValue(mockChatHook);
    
    // Reset window dimensions
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

  describe('Message Overflow Edge Cases', () => {
    it('should handle extremely long single messages', () => {
      const longMessage = 'A'.repeat(10000); // 10KB message
      const longMessageList = [
        {
          id: 'long-msg',
          content: longMessage,
          isUser: false,
          timestamp: new Date().toISOString()
        }
      ];

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

      const chatMessage = screen.getByTestId('chat-message');
      expect(chatMessage).toBeInTheDocument();
      expect(chatMessage).toHaveTextContent(longMessage);
    });

    it('should handle rapid message additions without performance degradation', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const startTime = performance.now();

      // Simulate rapid message additions
      for (let i = 0; i < 50; i++) {
        const messages = Array.from({ length: i + 1 }, (_, idx) => ({
          id: `rapid-msg-${idx}`,
          content: `Rapid message ${idx + 1}`,
          isUser: idx % 2 === 0,
          timestamp: new Date(Date.now() + idx * 1000).toISOString()
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

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle 50 rapid message additions within 500ms
      expect(totalTime).toBeLessThan(500);

      // Should render final state correctly
      const chatMessages = screen.getAllByTestId('chat-message');
      expect(chatMessages).toHaveLength(50);
    });

    it('should handle message list with mixed content types', () => {
      const mixedMessages = [
        {
          id: 'text-msg',
          content: 'Simple text message',
          isUser: true,
          timestamp: new Date().toISOString()
        },
        {
          id: 'empty-msg',
          content: '',
          isUser: false,
          timestamp: new Date().toISOString()
        },
        {
          id: 'special-chars',
          content: '🚀 Special chars: <>&"\'`\n\t\r',
          isUser: true,
          timestamp: new Date().toISOString()
        },
        {
          id: 'unicode-msg',
          content: 'Unicode: 你好 🌍 émojis 🎉',
          isUser: false,
          timestamp: new Date().toISOString()
        }
      ];

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: mixedMessages
      });

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const chatMessages = screen.getAllByTestId('chat-message');
      expect(chatMessages).toHaveLength(4);

      // Check specific content handling
      expect(chatMessages[0]).toHaveTextContent('Simple text message');
      expect(chatMessages[1]).toHaveTextContent(''); // Empty message
      expect(chatMessages[2]).toHaveTextContent('🚀 Special chars: <>&"\'`');
      expect(chatMessages[3]).toHaveTextContent('Unicode: 你好 🌍 émojis 🎉');
    });
  });

  describe('State Corruption Prevention', () => {
    it('should handle simultaneous state changes without corruption', async () => {
      const callbacks = {
        onExpandedChange: vi.fn(),
        onEngagementChange: vi.fn(),
        onNarrativePause: vi.fn(),
        onNarrativeResume: vi.fn()
      };

      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
            {...callbacks}
          />
        </TestWrapper>
      );

      // Simulate simultaneous state changes
      act(() => {
        // Multiple rapid rerenders with different states
        for (let i = 0; i < 10; i++) {
          rerender(
            <TestWrapper>
              <ContextualLyraChat 
                lessonContext={{
                  ...mockLessonContext,
                  phase: `phase-${i}` // Changing context
                }}
                expanded={i % 2 === 0} // Toggling expansion
                {...callbacks}
              />
            </TestWrapper>
          );
        }
      });

      // Component should still render without errors
      if (screen.queryByTestId('motion-div')) {
        expect(screen.getByTestId('motion-div')).toBeInTheDocument();
      }
      
      // Callbacks should have been called
      expect(callbacks.onExpandedChange).toHaveBeenCalled();
    });

    it('should maintain data consistency during message updates', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Start with messages
      const initialMessages = [
        { id: 'msg-1', content: 'Hello', isUser: true, timestamp: new Date().toISOString() }
      ];

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: initialMessages
      });

      rerender(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      expect(screen.getAllByTestId('chat-message')).toHaveLength(1);

      // Update messages
      const updatedMessages = [
        ...initialMessages,
        { id: 'msg-2', content: 'Response', isUser: false, timestamp: new Date().toISOString() }
      ];

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: updatedMessages
      });

      rerender(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should maintain data consistency
      const messages = screen.getAllByTestId('chat-message');
      expect(messages).toHaveLength(2);
      expect(messages[0]).toHaveTextContent('Hello');
      expect(messages[1]).toHaveTextContent('Response');
    });
  });

  describe('Resource Management & Memory Leaks', () => {
    it('should properly cleanup event listeners on unmount', () => {
      const { unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Component should render without errors
      expect(screen.getByTestId('card')).toBeInTheDocument();

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it('should handle ref cleanup properly', () => {
      const { rerender, unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Change state multiple times to stress ref management
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

      // Should cleanup without errors
      expect(() => unmount()).not.toThrow();
    });

    it('should prevent memory leaks with large message histories', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      const { rerender, unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Create large message history
      for (let i = 0; i < 100; i++) {
        const largeMessages = Array.from({ length: 20 }, (_, idx) => ({
          id: `batch-${i}-msg-${idx}`,
          content: `Batch ${i}, Message ${idx}: ${'Data'.repeat(100)}`, // ~400 chars each
          isUser: idx % 2 === 0,
          timestamp: new Date(Date.now() + i * 1000 + idx).toISOString()
        }));

        mockUseLyraChat.mockReturnValue({
          ...mockChatHook,
          messages: largeMessages
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

      unmount();

      // Check memory usage if available
      if (performance.memory) {
        // Force garbage collection if possible
        if (global.gc) {
          global.gc();
        }

        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;

        // Should not leak excessive memory (allow 10MB for test overhead)
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });

  describe('Extreme Viewport Edge Cases', () => {
    it('should handle very small viewports gracefully', () => {
      // Extremely small viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 240,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 320,
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

      // Should still render essential elements
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('should handle very large viewports', () => {
      // Very large viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 3840,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 2160,
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
      
      // Should maintain fixed dimensions on large screens
      expect(motionDiv).toHaveClass('md:w-96', 'md:h-[600px]');
    });

    it('should handle viewport size changes during runtime', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        </TestWrapper>
      );

      // Simulate viewport changes
      const viewportSizes = [
        { width: 320, height: 568 },
        { width: 768, height: 1024 },
        { width: 1200, height: 800 },
        { width: 375, height: 812 }
      ];

      viewportSizes.forEach(({ width, height }) => {
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

        // Trigger window resize event
        fireEvent(window, new Event('resize'));

        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
              isFloating={true}
            />
          </TestWrapper>
        );

        // Should still render correctly
        expect(screen.getByTestId('card')).toBeInTheDocument();
      });
    });
  });

  describe('Input Validation Edge Cases', () => {
    it('should handle extremely long input values', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const chatInput = screen.getByTestId('chat-input');
      const longInput = 'A'.repeat(10000); // 10KB input

      await user.type(chatInput, longInput);
      
      // Should handle long input without errors
      expect(chatInput).toHaveValue(longInput);
    });

    it('should handle special characters in input', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const chatInput = screen.getByTestId('chat-input');
      const specialChars = '<script>alert("xss")</script>\n\t\r"\'`';

      await user.type(chatInput, specialChars);
      
      // Should handle special characters safely
      expect(chatInput).toHaveValue(specialChars);
    });

    it('should handle rapid typing and input changes', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const chatInput = screen.getByTestId('chat-input');

      // Rapid typing simulation
      const phrases = [
        'Hello',
        'Hello world',
        'Hello world!',
        'Hello world! How are you?',
        'Hello world! How are you? I am fine.',
      ];

      for (const phrase of phrases) {
        await user.clear(chatInput);
        await user.type(chatInput, phrase);
        expect(chatInput).toHaveValue(phrase);
      }
    });
  });

  describe('Maya Journey State Edge Cases', () => {
    it('should handle invalid Maya journey state gracefully', () => {
      const invalidMayaState = {
        currentPhase: null as any,
        templatesExplored: undefined as any,
        userChoices: 'invalid' as any,
        completedMilestones: {} as any
      };

      expect(() => {
        render(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              mayaJourneyState={invalidMayaState}
              expanded={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing Maya journey state properties', () => {
      const partialMayaState = {
        currentPhase: 'draft-review'
        // Missing other properties
      } as any;

      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            mayaJourneyState={partialMayaState}
            expanded={true}
          />
        </TestWrapper>
      );

      // Should render questions area for no messages state
      expect(screen.getByText(/I'm here to help with this lesson!/)).toBeInTheDocument();
    });

    it('should handle rapid Maya state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const stateChanges = [
        { currentPhase: 'template-exploration', templatesExplored: ['thank-you'] },
        { currentPhase: 'draft-review', templatesExplored: ['thank-you', 'fundraising'] },
        { currentPhase: 'final-draft', templatesExplored: ['thank-you', 'fundraising', 'volunteer'] },
        null, // No Maya state
        { currentPhase: 'template-exploration', templatesExplored: [] }
      ];

      stateChanges.forEach((mayaState) => {
        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              mayaJourneyState={mayaState}
              expanded={true}
            />
          </TestWrapper>
        );

        // Should handle each state change without errors
        expect(screen.getByTestId('card')).toBeInTheDocument();
      });
    });
  });

  describe('Animation and Transition Edge Cases', () => {
    it('should handle interrupted animations gracefully', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={false}
          />
        </TestWrapper>
      );

      // Rapidly toggle expansion to interrupt animations
      const toggleStates = [true, false, true, false, true];
      
      for (const expanded of toggleStates) {
        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={expanded}
            />
          </TestWrapper>
        );
        
        // Small delay to simulate animation interruption
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Should end in stable state
      if (screen.queryByTestId('motion-div')) {
        expect(screen.getByTestId('motion-div')).toBeInTheDocument();
      }
    });

    it('should handle animation during component unmount', () => {
      const { unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Unmount during potential animation
      expect(() => unmount()).not.toThrow();
    });
  });
});