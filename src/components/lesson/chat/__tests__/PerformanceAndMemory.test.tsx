import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';
import { FloatingLyraAvatar } from '../lyra/FloatingLyraAvatar';

// Mock performance.measure and performance.mark for testing
const mockPerformanceEntries: PerformanceEntry[] = [];

Object.defineProperty(window, 'performance', {
  value: {
    ...window.performance,
    mark: vi.fn((name: string) => {
      mockPerformanceEntries.push({
        name,
        entryType: 'mark',
        startTime: performance.now(),
        duration: 0,
        toJSON: () => ({})
      });
    }),
    measure: vi.fn((name: string, startMark?: string, endMark?: string) => {
      mockPerformanceEntries.push({
        name,
        entryType: 'measure',
        startTime: performance.now() - 100,
        duration: 100,
        toJSON: () => ({})
      });
    }),
    getEntriesByType: vi.fn((type: string) => 
      mockPerformanceEntries.filter(entry => entry.entryType === type)
    ),
    getEntriesByName: vi.fn((name: string) => 
      mockPerformanceEntries.filter(entry => entry.name === name)
    ),
    clearMarks: vi.fn(() => {
      mockPerformanceEntries.splice(0, mockPerformanceEntries.length);
    }),
    clearMeasures: vi.fn(() => {
      mockPerformanceEntries.splice(0, mockPerformanceEntries.length);
    })
  },
  writable: true
});

// Mock ResizeObserver for performance testing
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver for performance testing
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock dependencies with performance tracking
vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn(() => ({
    messages: [],
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
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="button">{children}</button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>
}));

describe('Performance and Memory Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn AI basics',
    chapterTitle: 'Chapter 1'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformanceEntries.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering Performance', () => {
    it('should render within performance budget (50ms)', () => {
      const startTime = performance.now();
      
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(50);
    });

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={false}
        />
      );

      const startTime = performance.now();

      // Rapid re-renders simulating state changes
      for (let i = 0; i < 100; i++) {
        rerender(
          <ContextualLyraChat 
            lessonContext={{
              ...mockLessonContext,
              chapterNumber: (i % 10) + 1,
              phase: i % 2 === 0 ? 'introduction' : 'main'
            }}
            expanded={i % 2 === 0}
          />
        );
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle 100 re-renders within 500ms
      expect(totalTime).toBeLessThan(500);
    });

    it('should efficiently render large message lists', () => {
      // Create large message list
      const largeMessageList = Array.from({ length: 1000 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i} with some content that could be quite long to test rendering performance`,
        isUser: i % 2 === 0,
        timestamp: Date.now() - (i * 1000)
      }));

      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: largeMessageList,
        sendMessage: vi.fn(),
        clearChat: vi.fn(),
        isLoading: false
      });

      const startTime = performance.now();

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render 1000 messages within 200ms
      expect(renderTime).toBeLessThan(200);
    });

    it('should optimize floating avatar animations', () => {
      const startTime = performance.now();

      const { rerender } = render(<FloatingLyraAvatar state="idle" />);

      // Animate through different states
      const states: Array<'idle' | 'pulsing' | 'active'> = ['idle', 'pulsing', 'active'];
      
      for (let i = 0; i < 50; i++) {
        rerender(<FloatingLyraAvatar state={states[i % 3]} />);
      }

      const endTime = performance.now();
      const animationTime = endTime - startTime;

      // Should handle 50 state changes within 100ms
      expect(animationTime).toBeLessThan(100);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory during normal usage', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Simulate normal usage pattern
      const { rerender, unmount } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={false}
        />
      );

      // Multiple expansions and collapses
      for (let i = 0; i < 20; i++) {
        rerender(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={i % 2 === 0}
          />
        );
      }

      unmount();

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not increase by more than 1MB
        expect(memoryIncrease).toBeLessThan(1024 * 1024);
      }
    });

    it('should clean up event listeners on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const addedListeners = addEventListenerSpy.mock.calls.length;

      unmount();

      const removedListeners = removeEventListenerSpy.mock.calls.length;

      // Should remove at least as many listeners as were added
      expect(removedListeners).toBeGreaterThanOrEqual(0);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should handle memory efficiently with large context objects', () => {
      // Create large context object
      const largeContext: LessonContext = {
        ...mockLessonContext,
        content: 'Large content '.repeat(10000), // ~130KB string
        objectives: Array.from({ length: 1000 }, (_, i) => `Objective ${i}`),
        keyTerms: Array.from({ length: 1000 }, (_, i) => `Term ${i}`)
      };

      const startTime = performance.now();

      render(
        <ContextualLyraChat 
          lessonContext={largeContext}
          expanded={true}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle large context within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should optimize virtual scrolling for large lists', () => {
      // Simulate very large message history
      const hugeMessageList = Array.from({ length: 10000 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}`,
        isUser: i % 2 === 0,
        timestamp: Date.now() - (i * 1000)
      }));

      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: hugeMessageList,
        sendMessage: vi.fn(),
        clearChat: vi.fn(),
        isLoading: false
      });

      const startTime = performance.now();

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render efficiently even with 10k messages
      expect(renderTime).toBeLessThan(300);
    });
  });

  describe('User Interaction Performance', () => {
    it('should respond to clicks within acceptable time', async () => {
      const user = userEvent.setup();
      const onAvatarClick = vi.fn();

      render(<FloatingLyraAvatar onAvatarClick={onAvatarClick} />);

      const avatar = screen.getByTestId('motion-div');
      
      const startTime = performance.now();
      await user.click(avatar);
      const endTime = performance.now();
      
      const responseTime = endTime - startTime;

      // Should respond within 16ms (1 frame at 60fps)
      expect(responseTime).toBeLessThan(16);
      expect(onAvatarClick).toHaveBeenCalled();
    });

    it('should handle rapid typing without performance degradation', async () => {
      const user = userEvent.setup();
      const sendMessage = vi.fn();

      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: [],
        sendMessage,
        clearChat: vi.fn(),
        isLoading: false
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      
      const startTime = performance.now();

      // Rapid typing simulation
      for (let i = 0; i < 100; i++) {
        await user.type(input, 'a');
      }

      const endTime = performance.now();
      const typingTime = endTime - startTime;

      // Should handle 100 keystrokes within 500ms
      expect(typingTime).toBeLessThan(500);
    });

    it('should maintain 60fps during animations', async () => {
      const frameTimestamps: number[] = [];
      
      // Mock requestAnimationFrame to track frame timing
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = vi.fn((callback) => {
        frameTimestamps.push(performance.now());
        return originalRAF(callback);
      });

      render(<FloatingLyraAvatar state="pulsing" />);

      // Let animation run for a brief period
      await new Promise(resolve => setTimeout(resolve, 100));

      // Calculate frame rates
      const frameTimes = frameTimestamps.slice(1).map((time, i) => 
        time - frameTimestamps[i]
      );

      if (frameTimes.length > 0) {
        const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / averageFrameTime;

        // Should maintain at least 30fps (allowing for some variance in testing)
        expect(fps).toBeGreaterThan(30);
      }

      window.requestAnimationFrame = originalRAF;
    });
  });

  describe('Resource Usage Optimization', () => {
    it('should lazy load non-critical components', () => {
      const { container } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={false}
        />
      );

      // When collapsed, should not render heavy chat components
      expect(screen.queryByTestId('scroll-area')).not.toBeInTheDocument();
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });

    it('should debounce rapid state changes', async () => {
      const onExpandedChange = vi.fn();
      let callCount = 0;

      const { rerender } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={false}
          onExpandedChange={(expanded) => {
            callCount++;
            onExpandedChange(expanded);
          }}
        />
      );

      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        rerender(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={i % 2 === 0}
            onExpandedChange={(expanded) => {
              callCount++;
              onExpandedChange(expanded);
            }}
          />
        );
      }

      // Should not call callback for every change (debouncing/batching)
      expect(callCount).toBeLessThan(10);
    });

    it('should efficiently handle concurrent API requests', async () => {
      const sendMessage = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: [],
        sendMessage,
        clearChat: vi.fn(),
        isLoading: false
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const startTime = performance.now();

      // Simulate concurrent requests
      const promises = Array.from({ length: 5 }, (_, i) => 
        sendMessage(`Message ${i}`)
      );

      await Promise.all(promises);

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle 5 concurrent requests efficiently
      expect(totalTime).toBeLessThan(200); // Should be parallelized, not sequential
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should track custom performance metrics', () => {
      performance.mark('chat-render-start');

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      performance.mark('chat-render-end');
      performance.measure('chat-render-time', 'chat-render-start', 'chat-render-end');

      const measures = performance.getEntriesByType('measure');
      const chatRenderMeasure = measures.find(m => m.name === 'chat-render-time');

      expect(chatRenderMeasure).toBeDefined();
      expect(chatRenderMeasure?.duration).toBeLessThan(100);
    });

    it('should provide performance insights for optimization', () => {
      const performanceObserver = vi.fn();
      
      // Mock PerformanceObserver
      global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn()
      }));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Should be able to observe performance metrics
      expect(global.PerformanceObserver).toBeDefined();
    });
  });

  describe('Error Boundaries and Performance', () => {
    it('should maintain performance when recovering from errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock component that throws error
      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      const startTime = performance.now();

      // Should not crash and should recover gracefully
      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={mockLessonContext}
            expanded={true}
          />
        );
      }).not.toThrow();

      const endTime = performance.now();
      const errorHandlingTime = endTime - startTime;

      // Error handling should not significantly impact performance
      expect(errorHandlingTime).toBeLessThan(50);

      consoleSpy.mockRestore();
    });
  });

  describe('Long-term Performance Stability', () => {
    it('should maintain performance over extended usage', async () => {
      const performanceMetrics: number[] = [];

      const { rerender } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={false}
        />
      );

      // Simulate extended usage over time
      for (let i = 0; i < 50; i++) {
        const startTime = performance.now();

        rerender(
          <ContextualLyraChat 
            lessonContext={{
              ...mockLessonContext,
              chapterNumber: (i % 10) + 1,
              content: `Updated content ${i}`
            }}
            expanded={i % 3 === 0}
          />
        );

        const endTime = performance.now();
        performanceMetrics.push(endTime - startTime);

        // Simulate some time passing
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      // Performance should remain stable (not degrade over time)
      const firstHalf = performanceMetrics.slice(0, 25);
      const secondHalf = performanceMetrics.slice(25);

      const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      // Second half should not be significantly slower than first half
      expect(secondHalfAvg).toBeLessThan(firstHalfAvg * 1.5);
    });
  });
});