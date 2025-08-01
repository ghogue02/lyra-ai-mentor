import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';
import { FloatingLyraAvatar } from '../lyra/FloatingLyraAvatar';
import NarrativeManager from '../lyra/maya/NarrativeManager';

// Create a comprehensive integration test component
const IntegratedLessonComponent = ({ 
  lessonContext,
  onNarrativeComplete 
}: { 
  lessonContext: LessonContext;
  onNarrativeComplete?: () => void;
}) => {
  const [phase, setPhase] = React.useState<'narrative' | 'chat' | 'completed'>('narrative');
  const [narrativePaused, setNarrativePaused] = React.useState(false);
  const [chatExpanded, setChatExpanded] = React.useState(false);
  const [engagementMetrics, setEngagementMetrics] = React.useState({
    chatOpened: false,
    messageCount: 0,
    totalEngagementTime: 0
  });

  const narrativeMessages = [
    {
      id: '1',
      content: 'Welcome to this lesson about AI foundations!',
      emotion: 'excited' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: 'Let me guide you through the key concepts...',
      emotion: 'helpful' as const,
      showAvatar: true
    },
    {
      id: '3',
      content: 'Feel free to ask questions anytime by clicking the chat avatar!',
      emotion: 'encouraging' as const,
      showAvatar: true
    }
  ];

  const handleNarrativeComplete = () => {
    setPhase('completed');
    onNarrativeComplete?.();
  };

  const handleChatOpen = () => {
    setEngagementMetrics(prev => ({ ...prev, chatOpened: true }));
  };

  const handleNarrativePause = () => {
    setNarrativePaused(true);
  };

  const handleNarrativeResume = () => {
    setNarrativePaused(false);
  };

  const handleEngagementChange = (isEngaged: boolean, messageCount: number) => {
    setEngagementMetrics(prev => ({
      ...prev,
      messageCount,
      totalEngagementTime: isEngaged ? prev.totalEngagementTime + 1 : prev.totalEngagementTime
    }));
  };

  return (
    <div data-testid="integrated-lesson">
      {phase === 'narrative' && (
        <div data-testid="narrative-phase">
          <NarrativeManager
            messages={narrativeMessages}
            onComplete={handleNarrativeComplete}
            phaseId="integration-test"
            paused={narrativePaused}
          />
        </div>
      )}

      {phase === 'completed' && (
        <div data-testid="completed-phase">
          <h2>Lesson Completed!</h2>
          <p>Engagement metrics:</p>
          <ul>
            <li>Chat opened: {engagementMetrics.chatOpened ? 'Yes' : 'No'}</li>
            <li>Messages sent: {engagementMetrics.messageCount}</li>
            <li>Engagement time: {engagementMetrics.totalEngagementTime}s</li>
          </ul>
        </div>
      )}

      {/* Chat is always available, floating over content */}
      <ContextualLyraChat
        lessonContext={lessonContext}
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        onChatOpen={handleChatOpen}
        onNarrativePause={handleNarrativePause}
        onNarrativeResume={handleNarrativeResume}
        onEngagementChange={handleEngagementChange}
        isFloating={true}
      />
    </div>
  );
};

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

vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn(() => ({
    messages: [
      { id: '1', content: 'Hello! How can I help you with this lesson?', isUser: false, timestamp: Date.now() }
    ],
    sendMessage: vi.fn().mockResolvedValue(undefined),
    clearChat: vi.fn(),
    isLoading: false
  }))
}));

vi.mock('@/components/ui/VideoAnimation', () => ({
  default: ({ fallbackIcon, className }: any) => (
    <div data-testid="video-animation" className={className}>
      {fallbackIcon}
    </div>
  )
}));

// Mock framer-motion for consistent testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, initial, animate, exit, transition, ...props }: any) => (
      <div 
        onClick={onClick}
        className={className}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} data-testid="motion-button" {...props}>
        {children}
      </button>
    ),
    span: ({ children, animate, transition }: any) => (
      <span data-testid="motion-span">{children}</span>
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, size, variant, ...props }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
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

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyPress, placeholder, disabled, className }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      data-testid="input"
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

vi.mock '@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, onScrollCapture, className }: any) => (
    <div 
      data-testid="scroll-area" 
      onScroll={onScrollCapture}
      className={className}
    >
      {children}
    </div>
  )
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ContextualLyraChat Integration Tests', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn the basics of artificial intelligence',
    chapterTitle: 'Chapter 1: Getting Started',
    objectives: ['Understand AI basics', 'Learn key concepts'],
    keyTerms: ['AI', 'Machine Learning'],
    difficulty: 'beginner'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Complete Workflow Integration', () => {
    it('should complete full narrative → avatar → chat → resume workflow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onComplete = vi.fn();

      render(
        <TestWrapper>
          <IntegratedLessonComponent 
            lessonContext={mockLessonContext}
            onNarrativeComplete={onComplete}
          />
        </TestWrapper>
      );

      // 1. Should start with narrative phase
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument(); // Floating avatar should be visible

      // 2. Navigate through narrative
      for (let i = 0; i < 3; i++) {
        act(() => {
          vi.advanceTimersByTime(2000); // Complete typing animation
        });
        
        const advanceButton = screen.queryByTestId('button');
        if (advanceButton) {
          await user.click(advanceButton);
        }
      }

      // 3. Complete narrative
      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByTestId('completed-phase')).toBeInTheDocument();
      });

      // 4. Chat avatar should still be available
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();

      // 5. Click avatar to open chat
      const avatarContainer = screen.getByTestId('motion-div');
      await user.click(avatarContainer);

      // 6. Chat should open and show contextual questions
      await waitFor(() => {
        expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      });

      // 7. Should show Chapter 1 specific questions
      expect(screen.getByText('I\'m new to AI - where should I start?')).toBeInTheDocument();

      expect(onComplete).toHaveBeenCalled();
    });

    it('should handle chat opening during narrative (pause/resume)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Start narrative
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();

      // Open chat during narrative
      const avatarContainer = screen.getByTestId('motion-div');
      await user.click(avatarContainer);

      // Chat should open
      await waitFor(() => {
        expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      });

      // Narrative should still be visible but in paused state
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();

      // Close chat by clicking close button
      const closeButton = screen.getByTestId('button');
      await user.click(closeButton);

      // Narrative should resume
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
    });

    it('should track engagement metrics throughout the workflow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const sendMessageMock = vi.fn().mockResolvedValue(undefined);
      
      // Mock useLyraChat to track message sending
      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockReturnValue({
        messages: [
          { id: '1', content: 'Hello!', isUser: false, timestamp: Date.now() },
          { id: '2', content: 'What is AI?', isUser: true, timestamp: Date.now() },
          { id: '3', content: 'AI is...', isUser: false, timestamp: Date.now() }
        ],
        sendMessage: sendMessageMock,
        clearChat: vi.fn(),
        isLoading: false
      });

      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Complete narrative to see engagement metrics
      for (let i = 0; i < 3; i++) {
        act(() => {
          vi.advanceTimersByTime(2000);
        });
        
        const advanceButton = screen.queryByTestId('button');
        if (advanceButton) {
          await user.click(advanceButton);
        }
      }

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Open chat to trigger engagement tracking
      const avatarContainer = screen.getByTestId('motion-div');
      await user.click(avatarContainer);

      await waitFor(() => {
        expect(screen.getByTestId('completed-phase')).toBeInTheDocument();
      });

      // Check engagement metrics
      expect(screen.getByText('Chat opened: Yes')).toBeInTheDocument();
      expect(screen.getByText('Messages sent: 1')).toBeInTheDocument(); // 1 user message
    });
  });

  describe('Cross-Component State Management', () => {
    it('should properly coordinate state between narrative and chat', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Verify initial state
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();

      // Open chat
      await user.click(screen.getByTestId('motion-div'));

      // Verify chat state changes affect narrative
      await waitFor(() => {
        expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      });

      // Both narrative and chat should be visible
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
    });

    it('should handle rapid state changes without errors', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      const avatarContainer = screen.getByTestId('motion-div');

      // Rapidly open and close chat
      for (let i = 0; i < 5; i++) {
        await user.click(avatarContainer);
        
        // Try to close if open
        const closeButton = screen.queryByTestId('button');
        if (closeButton) {
          await user.click(closeButton);
        }
      }

      // Should still be functional
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should recover gracefully from component errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock a failing hook
      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockImplementation(() => {
        throw new Error('Hook failed');
      });

      // Should not crash the entire integration
      expect(() => {
        render(
          <TestWrapper>
            <IntegratedLessonComponent lessonContext={mockLessonContext} />
          </TestWrapper>
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle missing props gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <IntegratedLessonComponent 
              lessonContext={null as any}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle malformed lesson context', () => {
      const malformedContext = {
        chapterNumber: 'invalid' as any,
        lessonTitle: null as any,
        phase: undefined as any,
        content: 123 as any
      };

      expect(() => {
        render(
          <TestWrapper>
            <IntegratedLessonComponent 
              lessonContext={malformedContext}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Performance Under Load', () => {
    it('should handle many rapid interactions efficiently', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      const startTime = performance.now();

      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Perform many interactions rapidly
      const avatarContainer = screen.getByTestId('motion-div');
      
      for (let i = 0; i < 20; i++) {
        await user.click(avatarContainer);
        act(() => {
          vi.advanceTimersByTime(50);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(1000);
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
    });

    it('should handle memory efficiently with long sessions', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Simulate long session with many re-renders
      const { rerender } = render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Multiple re-renders with different contexts
      for (let i = 0; i < 50; i++) {
        const context = {
          ...mockLessonContext,
          chapterNumber: i % 10 + 1,
          lessonTitle: `Lesson ${i}`
        };

        rerender(
          <TestWrapper>
            <IntegratedLessonComponent lessonContext={context} />
          </TestWrapper>
        );
      }

      // Memory usage should not grow excessively
      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not increase by more than 50MB during test
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      }

      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility throughout workflow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Check initial accessibility
      const avatarContainer = screen.getByTestId('motion-div');
      expect(avatarContainer).toHaveAttribute('role', 'button');
      expect(avatarContainer).toHaveAttribute('tabIndex', '0');

      // Test keyboard navigation
      avatarContainer.focus();
      expect(avatarContainer).toHaveFocus();

      // Activate with keyboard
      fireEvent.keyDown(avatarContainer, { key: 'Enter' });

      // Should open chat
      await waitFor(() => {
        expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      });

      // Check chat accessibility
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Ask about this lesson...');
    });

    it('should support screen reader navigation', () => {
      render(
        <TestWrapper>
          <IntegratedLessonComponent lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      // Check ARIA labels
      const avatarContainer = screen.getByTestId('motion-div');
      expect(avatarContainer).toHaveAttribute('aria-label');
      
      const ariaLabel = avatarContainer.getAttribute('aria-label');
      expect(ariaLabel).toContain('Lyra AI Assistant');
    });
  });
});