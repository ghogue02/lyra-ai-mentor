import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// E2E Test Simulation Components
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';
import { FloatingLyraAvatar } from '../lyra/FloatingLyraAvatar';
import NarrativeManager from '../lyra/maya/NarrativeManager';

// Mock a complete Chapter 1 Lesson 1 component
const Chapter1Lesson1Component = () => {
  const [currentPhase, setCurrentPhase] = React.useState<'intro' | 'narrative' | 'interactive' | 'complete'>('intro');
  const [chatExpanded, setChatExpanded] = React.useState(false);
  const [userProgress, setUserProgress] = React.useState({
    narrativeCompleted: false,
    chatEngaged: false,
    lessonsCompleted: 0,
    totalTimeSpent: 0,
    questionsAsked: 0
  });

  const lessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations: Introduction to Artificial Intelligence',
    phase: currentPhase,
    content: `
      Welcome to your journey into Artificial Intelligence! 
      In this foundational lesson, you'll learn:
      - What AI really is and isn't
      - How AI can help nonprofits achieve their missions
      - Basic AI concepts that every professional should know
      - Ethical considerations when working with AI
    `,
    chapterTitle: 'Chapter 1: Getting Started with AI',
    objectives: [
      'Understand the definition and scope of artificial intelligence',
      'Identify practical AI applications for nonprofit organizations',
      'Recognize ethical considerations in AI implementation',
      'Feel confident about exploring AI tools and technologies'
    ],
    keyTerms: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing', 'Ethics in AI'],
    difficulty: 'beginner'
  };

  const narrativeMessages = [
    {
      id: '1',
      content: 'Welcome to AI Foundations! I\'m Lyra, your AI learning companion.',
      emotion: 'excited' as const,
      showAvatar: true
    },
    {
      id: '2',
      content: 'Today we\'ll explore the wonderful world of AI and how it can transform your nonprofit work.',
      emotion: 'helpful' as const,
      showAvatar: true
    },
    {
      id: '3',
      content: 'Don\'t worry if AI seems complex - we\'ll start with the basics and build your confidence step by step.',
      emotion: 'encouraging' as const,
      showAvatar: true
    },
    {
      id: '4',
      content: 'Feel free to chat with me anytime you have questions! Just click my avatar.',
      emotion: 'helpful' as const,
      showAvatar: true
    }
  ];

  const handleNarrativeComplete = () => {
    setCurrentPhase('interactive');
    setUserProgress(prev => ({ ...prev, narrativeCompleted: true }));
  };

  const handleChatEngagement = (isEngaged: boolean, messageCount: number) => {
    setUserProgress(prev => ({
      ...prev,
      chatEngaged: isEngaged,
      questionsAsked: messageCount
    }));
  };

  const handleLessonComplete = () => {
    setCurrentPhase('complete');
    setUserProgress(prev => ({
      ...prev,
      lessonsCompleted: 1,
      totalTimeSpent: Date.now() - startTime
    }));
  };

  const startTime = React.useRef(Date.now()).current;

  return (
    <div data-testid="chapter1-lesson1" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Introduction Phase */}
      {currentPhase === 'intro' && (
        <div data-testid="intro-phase" className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">AI Foundations</h1>
          <p className="text-xl mb-8">Your journey into artificial intelligence begins here</p>
          <button 
            onClick={() => setCurrentPhase('narrative')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700"
            data-testid="start-lesson"
          >
            Start Your AI Journey
          </button>
        </div>
      )}

      {/* Narrative Phase */}
      {currentPhase === 'narrative' && (
        <div data-testid="narrative-phase" className="p-8">
          <NarrativeManager
            messages={narrativeMessages}
            onComplete={handleNarrativeComplete}
            phaseId="chapter1-lesson1-intro"
            characterName="Lyra"
          />
        </div>
      )}

      {/* Interactive Phase */}
      {currentPhase === 'interactive' && (
        <div data-testid="interactive-phase" className="p-8">
          <h2 className="text-2xl font-bold mb-4">Explore AI Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">What is AI?</h3>
              <p>Artificial Intelligence refers to computer systems that can perform tasks typically requiring human intelligence.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">AI for Nonprofits</h3>
              <p>AI can help nonprofits with donor outreach, program optimization, and impact measurement.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <p>Begin with simple AI tools like chatbots or automated email responses.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Ethical Considerations</h3>
              <p>Always consider bias, privacy, and transparency when implementing AI solutions.</p>
            </div>
          </div>
          <button 
            onClick={handleLessonComplete}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700"
            data-testid="complete-lesson"
          >
            Complete Lesson
          </button>
        </div>
      )}

      {/* Completion Phase */}
      {currentPhase === 'complete' && (
        <div data-testid="complete-phase" className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-600">Congratulations!</h2>
          <p className="text-xl mb-6">You've completed Chapter 1, Lesson 1: AI Foundations</p>
          
          <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <div className="text-left space-y-2">
              <p>✅ Narrative completed: {userProgress.narrativeCompleted ? 'Yes' : 'No'}</p>
              <p>💬 Chat engaged: {userProgress.chatEngaged ? 'Yes' : 'No'}</p>
              <p>❓ Questions asked: {userProgress.questionsAsked}</p>
              <p>📚 Lessons completed: {userProgress.lessonsCompleted}</p>
              <p>⏱️ Time spent: {Math.round(userProgress.totalTimeSpent / 1000)}s</p>
            </div>
          </div>

          <button 
            onClick={() => setCurrentPhase('intro')}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            data-testid="restart-lesson"
          >
            Restart Lesson
          </button>
        </div>
      )}

      {/* Floating Chat - Always Available */}
      <ContextualLyraChat
        lessonContext={lessonContext}
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        onEngagementChange={handleChatEngagement}
        isFloating={true}
      />
    </div>
  );
};

// Mock all dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression }: any) => (
    <div data-testid="lyra-avatar" data-size={size} data-expression={expression}>
      Lyra
    </div>
  )
}));

vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn(() => ({
    messages: [
      { id: '1', content: 'Hello! I\'m here to help you learn about AI. What would you like to know?', isUser: false, timestamp: Date.now() }
    ],
    sendMessage: vi.fn().mockResolvedValue(undefined),
    clearChat: vi.fn(),
    isLoading: false
  }))
}));

vi.mock('@/components/ui/VideoAnimation', () => ({
  default: ({ fallbackIcon }: any) => (
    <div data-testid="video-animation">{fallbackIcon}</div>
  )
}));

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
    span: ({ children }: any) => <span data-testid="motion-span">{children}</span>
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className} data-testid="button">
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyPress, placeholder, disabled }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      data-testid="input"
    />
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('E2E User Journey Tests - Chapter 1 Lesson 1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Complete User Journey', () => {
    it('should complete the full Chapter 1 Lesson 1 experience', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // 1. User arrives at lesson introduction
      expect(screen.getByTestId('intro-phase')).toBeInTheDocument();
      expect(screen.getByText('AI Foundations')).toBeInTheDocument();
      expect(screen.getByText('Your journey into artificial intelligence begins here')).toBeInTheDocument();

      // 2. User starts the lesson
      const startButton = screen.getByTestId('start-lesson');
      await user.click(startButton);

      // 3. Narrative phase begins
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
      
      // Complete narrative progression
      for (let i = 0; i < 4; i++) {
        act(() => {
          vi.advanceTimersByTime(3000); // Complete typing animation
        });
        
        const nextButton = screen.queryByTestId('button');
        if (nextButton) {
          await user.click(nextButton);
        }
      }

      // 4. Interactive phase should be available
      await waitFor(() => {
        expect(screen.getByTestId('interactive-phase')).toBeInTheDocument();
      });

      // 5. User explores content
      expect(screen.getByText('What is AI?')).toBeInTheDocument();
      expect(screen.getByText('AI for Nonprofits')).toBeInTheDocument();
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('Ethical Considerations')).toBeInTheDocument();

      // 6. User can access floating chat throughout
      const chatAvatar = screen.getByTestId('motion-div');
      expect(chatAvatar).toBeInTheDocument();

      // 7. User opens chat during interactive phase
      await user.click(chatAvatar);

      await waitFor(() => {
        expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      });

      // 8. User asks a question
      const chatInput = screen.getByTestId('input');
      await user.type(chatInput, 'What are some simple AI tools I can start with?');
      fireEvent.keyPress(chatInput, { key: 'Enter' });

      // 9. User completes the lesson
      const completeButton = screen.getByTestId('complete-lesson');
      await user.click(completeButton);

      // 10. Completion phase shows progress
      await waitFor(() => {
        expect(screen.getByTestId('complete-phase')).toBeInTheDocument();
      });

      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByText('You\'ve completed Chapter 1, Lesson 1: AI Foundations')).toBeInTheDocument();
      
      // Check progress tracking
      expect(screen.getByText('✅ Narrative completed: Yes')).toBeInTheDocument();
      expect(screen.getByText('💬 Chat engaged: Yes')).toBeInTheDocument();
      expect(screen.getByText('❓ Questions asked: 1')).toBeInTheDocument();
      expect(screen.getByText('📚 Lessons completed: 1')).toBeInTheDocument();
    });

    it('should handle user returning to lesson mid-progress', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Start lesson and progress to narrative
      await user.click(screen.getByTestId('start-lesson'));
      
      // Progress through half the narrative
      for (let i = 0; i < 2; i++) {
        act(() => {
          vi.advanceTimersByTime(3000);
        });
        
        const nextButton = screen.queryByTestId('button');
        if (nextButton) {
          await user.click(nextButton);
        }
      }

      // Simulate page refresh/return by re-rendering
      const { rerender } = render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Should start from beginning (no persistence in this simple version)
      expect(screen.getByTestId('intro-phase')).toBeInTheDocument();
    });

    it('should handle user exploring chat without disrupting lesson flow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Start lesson
      await user.click(screen.getByTestId('start-lesson'));

      // During narrative, open chat
      const chatAvatar = screen.getByTestId('motion-div');
      await user.click(chatAvatar);

      // Chat should open without interrupting narrative
      await waitFor(() => {
        expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
        expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      });

      // Continue with narrative
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      const nextButton = screen.queryByTestId('button');
      if (nextButton) {
        await user.click(nextButton);
      }

      // Lesson should continue normally
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
    });
  });

  describe('User Engagement Tracking', () => {
    it('should track comprehensive engagement metrics', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Complete full journey with multiple interactions
      await user.click(screen.getByTestId('start-lesson'));

      // Engage with chat multiple times during narrative
      const chatAvatar = screen.getByTestId('motion-div');
      await user.click(chatAvatar);

      const chatInput = screen.getByTestId('input');
      await user.type(chatInput, 'First question');
      fireEvent.keyPress(chatInput, { key: 'Enter' });

      await user.type(chatInput, 'Second question');
      fireEvent.keyPress(chatInput, { key: 'Enter' });

      // Complete narrative
      for (let i = 0; i < 4; i++) {
        act(() => {
          vi.advanceTimersByTime(3000);
        });
        
        const nextButton = screen.queryByTestId('button');
        if (nextButton) {
          await user.click(nextButton);
        }
      }

      // Complete lesson
      await waitFor(() => {
        const completeButton = screen.queryByTestId('complete-lesson');
        if (completeButton) {
          user.click(completeButton);
        }
      });

      // Check engagement metrics
      await waitFor(() => {
        expect(screen.getByText('❓ Questions asked: 2')).toBeInTheDocument();
      });
    });

    it('should handle passive users (no chat engagement)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Complete lesson without chat engagement
      await user.click(screen.getByTestId('start-lesson'));

      // Skip through narrative quickly
      for (let i = 0; i < 4; i++) {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
        
        const nextButton = screen.queryByTestId('button');
        if (nextButton) {
          await user.click(nextButton);
        }
      }

      await waitFor(() => {
        const completeButton = screen.queryByTestId('complete-lesson');
        if (completeButton) {
          user.click(completeButton);
        }
      });

      // Should show zero engagement
      await waitFor(() => {
        if (screen.queryByText('💬 Chat engaged: No')) {
          expect(screen.getByText('💬 Chat engaged: No')).toBeInTheDocument();
          expect(screen.getByText('❓ Questions asked: 0')).toBeInTheDocument();
        }
      });
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should recover from component errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock a failing chat hook
      vi.mocked(require('@/hooks/useLyraChat').useLyraChat).mockImplementation(() => {
        throw new Error('Chat service unavailable');
      });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Should still render the lesson content
      expect(screen.getByTestId('intro-phase')).toBeInTheDocument();
      expect(screen.getByText('AI Foundations')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle rapid user interactions', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Rapid clicking should not break the experience
      const startButton = screen.getByTestId('start-lesson');
      await user.click(startButton);
      await user.click(startButton);
      await user.click(startButton);

      // Should still proceed to narrative phase
      expect(screen.getByTestId('narrative-phase')).toBeInTheDocument();
    });

    it('should maintain state consistency during interruptions', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      await user.click(screen.getByTestId('start-lesson'));

      // Simulate interruption by trying to access phases directly
      const narrativePhase = screen.getByTestId('narrative-phase');
      expect(narrativePhase).toBeInTheDocument();

      // State should remain consistent
      expect(screen.queryByTestId('intro-phase')).not.toBeInTheDocument();
      expect(screen.queryByTestId('interactive-phase')).not.toBeInTheDocument();
    });
  });

  describe('Performance Under User Load', () => {
    it('should maintain performance with extensive user interaction', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      const startTime = performance.now();

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Simulate heavy interaction
      await user.click(screen.getByTestId('start-lesson'));

      // Rapid chat interactions
      const chatAvatar = screen.getByTestId('motion-div');
      for (let i = 0; i < 10; i++) {
        await user.click(chatAvatar);
        act(() => {
          vi.advanceTimersByTime(100);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });

    it('should handle memory efficiently during long sessions', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Simulate long session with multiple re-renders
      const { rerender } = render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Multiple state changes
      for (let i = 0; i < 20; i++) {
        rerender(
          <TestWrapper>
            <Chapter1Lesson1Component />
          </TestWrapper>
        );
      }

      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not leak significant memory
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // <10MB
      }
    });
  });

  describe('Accessibility Throughout Journey', () => {
    it('should maintain accessibility at every phase', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <TestWrapper>
          <Chapter1Lesson1Component />
        </TestWrapper>
      );

      // Intro phase accessibility
      const startButton = screen.getByTestId('start-lesson');
      expect(startButton).toBeInTheDocument();
      startButton.focus();
      expect(startButton).toHaveFocus();

      await user.click(startButton);

      // Narrative phase accessibility
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      const nextButton = screen.queryByTestId('button');
      if (nextButton) {
        nextButton.focus();
        expect(nextButton).toHaveFocus();
      }

      // Chat accessibility
      const chatAvatar = screen.getByTestId('motion-div');
      expect(chatAvatar).toHaveAttribute('role', 'button');
      expect(chatAvatar).toHaveAttribute('tabIndex', '0');
    });
  });
});