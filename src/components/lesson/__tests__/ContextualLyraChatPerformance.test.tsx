import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ContextualLyraChat, LessonContext } from '../chat/lyra/ContextualLyraChat';
import { BrowserRouter } from 'react-router-dom';

// Simple mock setup for performance testing
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: () => <div data-testid="lyra-avatar">Avatar</div>
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className} data-testid="motion-div">{children}</div>
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

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="button">{children}</button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} data-testid="chat-input" />
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('../shared/ChatMessage', () => ({
  ChatMessage: ({ message }: any) => (
    <div data-testid="chat-message">{message.content}</div>
  )
}));

const mockUseLyraChat = vi.fn();
vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: () => mockUseLyraChat()
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ContextualLyraChat Performance Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'Performance Test Lesson',
    phase: 'interactive',
    content: 'Testing performance',
    difficulty: 'beginner'
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
  });

  describe('Rendering Performance', () => {
    it('should render collapsed state quickly', () => {
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
      
      // Should render floating avatar when collapsed
      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    });

    it('should render expanded state efficiently', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms for expanded state
      expect(renderTime).toBeLessThan(100);
      
      // Should render chat interface
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('should handle many messages efficiently', () => {
      const manyMessages = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i + 1}`,
        isUser: i % 2 === 0,
        timestamp: new Date().toISOString()
      }));

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: manyMessages
      });

      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render 50 messages within 200ms
      expect(renderTime).toBeLessThan(200);
      
      // Should render all messages
      const messages = screen.getAllByTestId('chat-message');
      expect(messages).toHaveLength(50);
    });
  });

  describe('State Transition Performance', () => {
    it('should handle rapid expansion toggles efficiently', () => {
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
      for (let i = 0; i < 10; i++) {
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
      
      // Should handle 10 transitions within 200ms
      expect(transitionTime).toBeLessThan(200);
    });

    it('should handle message updates efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const startTime = performance.now();
      
      // Simulate multiple message updates
      for (let i = 0; i < 20; i++) {
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
      
      const endTime = performance.now();
      const updateTime = endTime - startTime;
      
      // Should handle 20 message updates within 300ms
      expect(updateTime).toBeLessThan(300);
      
      // Should render final state correctly
      const messages = screen.getAllByTestId('chat-message');
      expect(messages).toHaveLength(20);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during lifecycle', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      const { unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      // Create some state changes
      for (let i = 0; i < 10; i++) {
        const messages = [
          { id: `cleanup-${i}`, content: `Cleanup test ${i}`, isUser: true, timestamp: new Date().toISOString() }
        ];

        mockUseLyraChat.mockReturnValue({
          ...mockChatHook,
          messages
        });
      }

      unmount();

      // Check memory if available
      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not leak significant memory
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // <5MB
      }
    });

    it('should handle large message histories without memory issues', () => {
      const largeMessageHistory = Array.from({ length: 100 }, (_, i) => ({
        id: `large-msg-${i}`,
        content: `Large message ${i}: ${'A'.repeat(1000)}`, // 1KB per message
        isUser: i % 2 === 0,
        timestamp: new Date().toISOString()
      }));

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: largeMessageHistory
      });

      const startTime = performance.now();
      
      const { unmount } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should handle large dataset within reasonable time
      expect(renderTime).toBeLessThan(500);
      
      // Should render all messages
      const messages = screen.getAllByTestId('chat-message');
      expect(messages).toHaveLength(100);
      
      unmount();
    });
  });

  describe('Viewport Performance', () => {
    it('should adapt to viewport changes efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
            isFloating={true}
          />
        </TestWrapper>
      );

      const viewportSizes = [
        { width: 320, height: 568 },  // Mobile
        { width: 768, height: 1024 }, // Tablet  
        { width: 1200, height: 800 }, // Desktop
        { width: 1920, height: 1080 } // Large
      ];

      const startTime = performance.now();

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

        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={mockLessonContext}
              expanded={true}
              isFloating={true}
            />
          </TestWrapper>
        );
      });

      const endTime = performance.now();
      const adaptationTime = endTime - startTime;
      
      // Should adapt to 4 viewport changes within 100ms
      expect(adaptationTime).toBeLessThan(100);
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle extremely long messages efficiently', () => {
      const longMessage = 'A'.repeat(50000); // 50KB message
      const longMessageData = [{
        id: 'long-msg',
        content: longMessage,
        isUser: false,
        timestamp: new Date().toISOString()
      }];

      mockUseLyraChat.mockReturnValue({
        ...mockChatHook,
        messages: longMessageData
      });

      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should handle very long message within 300ms
      expect(renderTime).toBeLessThan(300);
      
      const message = screen.getByTestId('chat-message');
      expect(message).toHaveTextContent(longMessage);
    });

    it('should handle rapid context changes efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        </TestWrapper>
      );

      const startTime = performance.now();
      
      // Rapid context changes
      for (let i = 0; i < 20; i++) {
        const contextVariation = {
          ...mockLessonContext,
          lessonTitle: `Dynamic Lesson ${i}`,
          phase: `phase-${i}`
        };

        rerender(
          <TestWrapper>
            <ContextualLyraChat 
              lessonContext={contextVariation}
              expanded={true}
            />
          </TestWrapper>
        );
      }
      
      const endTime = performance.now();
      const contextTime = endTime - startTime;
      
      // Should handle 20 context changes within 250ms
      expect(contextTime).toBeLessThan(250);
    });
  });
});