import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingLyraAvatar } from '../FloatingLyraAvatar';
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
      Lyra Avatar [{expression}]
    </div>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div 
        onClick={onClick}
        className={className}
        data-testid="motion-div"
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
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  )
}));

// Mock ContextualLyraChat with realistic behavior simulation
const mockContextualLyraChat = vi.fn();
vi.mock('../chat/lyra/ContextualLyraChat', () => ({
  default: mockContextualLyraChat,
  ContextualLyraChat: mockContextualLyraChat
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FloatingLyraAvatar E2E Scenarios', () => {
  const mockLessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations: Introduction to Artificial Intelligence',
    phase: 'interactive',
    content: 'Welcome to your journey into Artificial Intelligence!',
    chapterTitle: 'Chapter 1: Getting Started with AI',
    objectives: [
      'Understand the definition and scope of artificial intelligence',
      'Identify practical AI applications for nonprofit organizations'
    ],
    keyTerms: ['Artificial Intelligence', 'Machine Learning', 'Ethics in AI'],
    difficulty: 'beginner' as const
  };

  let chatCallbacks: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock ContextualLyraChat with realistic behavior
    mockContextualLyraChat.mockImplementation((props: any) => {
      chatCallbacks = props; // Store callbacks for testing
      return (
        <div 
          data-testid="contextual-lyra-chat"
          data-expanded={props.expanded}
          data-floating={props.isFloating}
          className={props.className}
        >
          <div data-testid="chat-content">
            {props.expanded ? 'Chat Expanded' : 'Chat Collapsed'}
          </div>
          {props.expanded && (
            <div data-testid="chat-interface">
              <button 
                data-testid="mock-question-1"
                onClick={() => props.onEngagementChange?.(true, 1)}
              >
                Ask Question 1
              </button>
              <button 
                data-testid="mock-question-2"
                onClick={() => props.onEngagementChange?.(true, 2)}
              >
                Ask Question 2
              </button>
              <button 
                data-testid="minimize-chat"
                onClick={() => props.onExpandedChange?.(false)}
              >
                Minimize
              </button>
            </div>
          )}
        </div>
      );
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete User Journey - First Time Learner', () => {
    it('should guide a new learner through complete avatar interaction', async () => {
      const user = userEvent.setup();
      const mockCallbacks = {
        onEngagementChange: vi.fn(),
        onNarrativePause: vi.fn(),
        onNarrativeResume: vi.fn()
      };

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={mockCallbacks.onEngagementChange}
            onNarrativePause={mockCallbacks.onNarrativePause}
            onNarrativeResume={mockCallbacks.onNarrativeResume}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Step 1: User sees collapsed avatar
      let chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveAttribute('data-expanded', 'false');
      expect(screen.getByTestId('chat-content')).toHaveTextContent('Chat Collapsed');

      // Step 2: User expands chat (curious about AI help)
      act(() => {
        chatCallbacks.onExpandedChange(true);
      });

      chatContainer = screen.getByTestId('contextual-lyra-chat');
      expect(chatContainer).toHaveAttribute('data-expanded', 'true');
      expect(screen.getByTestId('chat-content')).toHaveTextContent('Chat Expanded');
      expect(mockCallbacks.onNarrativePause).toHaveBeenCalled();

      // Step 3: User asks first question
      const question1Button = screen.getByTestId('mock-question-1');
      await user.click(question1Button);

      expect(mockCallbacks.onEngagementChange).toHaveBeenCalledWith(true, 1);

      // Step 4: User asks follow-up question
      const question2Button = screen.getByTestId('mock-question-2');
      await user.click(question2Button);

      expect(mockCallbacks.onEngagementChange).toHaveBeenCalledWith(true, 2);

      // Step 5: User minimizes chat to focus on lesson
      const minimizeButton = screen.getByTestId('minimize-chat');
      await user.click(minimizeButton);

      expect(mockCallbacks.onNarrativeResume).toHaveBeenCalled();

      // Should show engagement indicator
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('2 messages with Lyra');
    });
  });

  describe('Maya Journey Integration Scenarios', () => {
    it('should handle Maya Chapter 2 email writing journey', async () => {
      const mayaJourneyState = {
        currentPhase: 'template-exploration',
        templatesExplored: ['thank-you', 'fundraising-appeal'],
        userChoices: {
          preferredTone: 'warm-professional',
          organizationType: 'community-nonprofit'
        },
        completedMilestones: ['email-basics', 'pace-framework', 'donor-segmentation']
      };

      const mayaLessonContext = {
        chapterNumber: 2,
        lessonTitle: "Maya's Email Challenge: Crafting Compelling Communications",
        phase: 'template-building',
        content: 'Learn how Maya transforms donor communications using AI',
        chapterTitle: 'Chapter 2: Email Mastery with AI',
        objectives: ['Master the PACE framework', 'Personalize at scale'],
        keyTerms: ['PACE', 'Donor Segmentation', 'Email Templates'],
        difficulty: 'intermediate' as const
      };

      const mockMayaCallbacks = {
        onEngagementChange: vi.fn(),
        onNarrativePause: vi.fn(),
        onNarrativeResume: vi.fn()
      };

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mayaLessonContext}
            mayaJourneyState={mayaJourneyState}
            onEngagementChange={mockMayaCallbacks.onEngagementChange}
            onNarrativePause={mockMayaCallbacks.onNarrativePause}
            onNarrativeResume={mockMayaCallbacks.onNarrativeResume}
          />
        </TestWrapper>
      );

      // Maya journey state should be passed to ContextualLyraChat
      expect(chatCallbacks.mayaJourneyState).toEqual(mayaJourneyState);
      expect(chatCallbacks.lessonContext).toEqual(mayaLessonContext);

      // Simulate Maya-specific interaction
      act(() => {
        chatCallbacks.onEngagementChange(true, 1);
      });

      expect(mockMayaCallbacks.onEngagementChange).toHaveBeenCalledWith(true, 1);
    });

    it('should adapt to different Maya journey phases', async () => {
      const journeyPhases = [
        'email-introduction',
        'pace-framework-learning',
        'template-exploration',
        'draft-creation',
        'review-and-refinement',
        'advanced-personalization'
      ];

      for (const phase of journeyPhases) {
        const { unmount } = render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                chapterNumber: 2,
                phase
              }}
              mayaJourneyState={{
                currentPhase: phase,
                templatesExplored: [],
                userChoices: {},
                completedMilestones: []
              }}
            />
          </TestWrapper>
        );

        // Should render successfully for each phase
        const chatContainer = screen.getByTestId('contextual-lyra-chat');
        expect(chatContainer).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe('Engagement Pattern Scenarios', () => {
    it('should handle highly engaged learner pattern', async () => {
      const user = userEvent.setup();
      const engagementTracker = vi.fn();

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={engagementTracker}
            initialExpanded={true}
          />
        </TestWrapper>
      );

      // Simulate rapid, high engagement
      const questionButtons = [
        screen.getByTestId('mock-question-1'),
        screen.getByTestId('mock-question-2')
      ];

      // Multiple rapid questions
      for (let i = 1; i <= 5; i++) {
        const button = questionButtons[i % 2];
        await user.click(button);
        
        // Each click increments engagement
        expect(engagementTracker).toHaveBeenCalledWith(true, i);
      }

      // Should handle high engagement without performance issues
      expect(engagementTracker).toHaveBeenCalledTimes(5);
    });

    it('should handle passive learner pattern', async () => {
      const passiveTracker = vi.fn();

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={passiveTracker}
            initialExpanded={false}
          />
        </TestWrapper>
      );

      // Passive user just observes
      await waitFor(() => {
        const chatContainer = screen.getByTestId('contextual-lyra-chat');
        expect(chatContainer).toBeInTheDocument();
      }, { timeout: 1000 });

      // No engagement should be tracked
      expect(passiveTracker).not.toHaveBeenCalled();

      // Badge should not show message count
      expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
    });

    it('should handle intermittent engagement pattern', async () => {
      const user = userEvent.setup();
      const intermittentTracker = vi.fn();

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={intermittentTracker}
          />
        </TestWrapper>
      );

      // Expand chat
      act(() => {
        chatCallbacks.onExpandedChange(true);
      });

      // Ask a question
      await user.click(screen.getByTestId('mock-question-1'));
      expect(intermittentTracker).toHaveBeenCalledWith(true, 1);

      // Minimize for a while
      await user.click(screen.getByTestId('minimize-chat'));

      // Come back and ask another question
      act(() => {
        chatCallbacks.onExpandedChange(true);
      });

      await user.click(screen.getByTestId('mock-question-2'));
      expect(intermittentTracker).toHaveBeenCalledWith(true, 2);

      // Should maintain engagement state across minimization
      expect(intermittentTracker).toHaveBeenCalledTimes(2);
    });
  });

  describe('Learning Progress Scenarios', () => {
    it('should track learning journey across lesson phases', async () => {
      const progressTracker = vi.fn();
      const phases = ['introduction', 'concepts', 'interactive', 'practice', 'assessment'];

      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={{
              ...mockLessonContext,
              phase: phases[0]
            }}
            onEngagementChange={progressTracker}
          />
        </TestWrapper>
      );

      // Progress through each phase
      for (let i = 0; i < phases.length; i++) {
        rerender(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                phase: phases[i]
              }}
              onEngagementChange={progressTracker}
            />
          </TestWrapper>
        );

        // Simulate engagement in each phase
        act(() => {
          chatCallbacks.onEngagementChange(true, i + 1);
        });

        expect(progressTracker).toHaveBeenCalledWith(true, i + 1);
      }

      // Should have tracked engagement in all phases
      expect(progressTracker).toHaveBeenCalledTimes(phases.length);
    });

    it('should handle lesson completion and celebration', async () => {
      const user = userEvent.setup();
      const completionTracker = vi.fn();

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={{
              ...mockLessonContext,
              phase: 'completion'
            }}
            onEngagementChange={completionTracker}
          />
        </TestWrapper>
      );

      // Simulate completion engagement
      act(() => {
        chatCallbacks.onExpandedChange(true);
      });

      await user.click(screen.getByTestId('mock-question-1'));
      
      // Should track completion interaction
      expect(completionTracker).toHaveBeenCalledWith(true, 1);
    });
  });

  describe('Multi-User Scenario Simulation', () => {
    it('should handle different user types appropriately', async () => {
      const userTypes = [
        { type: 'beginner', engagement: 'low', questions: 1 },
        { type: 'intermediate', engagement: 'medium', questions: 3 },
        { type: 'advanced', engagement: 'high', questions: 5 }
      ];

      for (const userType of userTypes) {
        const tracker = vi.fn();
        
        const { unmount } = render(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                difficulty: userType.type as any
              }}
              onEngagementChange={tracker}
              initialExpanded={true}
            />
          </TestWrapper>
        );

        // Simulate user-type-specific engagement
        for (let i = 1; i <= userType.questions; i++) {
          act(() => {
            chatCallbacks.onEngagementChange(true, i);
          });
        }

        expect(tracker).toHaveBeenCalledTimes(userType.questions);
        expect(tracker).toHaveBeenLastCalledWith(true, userType.questions);

        unmount();
      }
    });
  });

  describe('Error Recovery in User Scenarios', () => {
    it('should maintain user experience during component failures', async () => {
      const user = userEvent.setup();
      const resilientTracker = vi.fn();

      // Mock intermittent failures
      let failureCount = 0;
      mockContextualLyraChat.mockImplementation((props) => {
        failureCount++;
        
        // Fail every 3rd render to simulate intermittent issues
        if (failureCount % 3 === 0) {
          throw new Error('Simulated component failure');
        }

        return (
          <div data-testid="contextual-lyra-chat" data-expanded={props.expanded}>
            <button 
              data-testid="resilient-button"
              onClick={() => props.onEngagementChange?.(true, 1)}
            >
              Resilient Interaction
            </button>
          </div>
        );
      });

      // Should still render successfully most of the time
      let successfulRenders = 0;
      for (let i = 0; i < 10; i++) {
        try {
          const { unmount } = render(
            <TestWrapper>
              <FloatingLyraAvatar 
                lessonContext={{
                  ...mockLessonContext,
                  phase: `test-${i}`
                }}
                onEngagementChange={resilientTracker}
              />
            </TestWrapper>
          );
          
          successfulRenders++;
          
          // Try to interact when successful
          const resilientButton = screen.queryByTestId('resilient-button');
          if (resilientButton) {
            await user.click(resilientButton);
          }
          
          unmount();
        } catch {
          // Expected to fail sometimes due to our mock
        }
      }

      // Should have some successful renders despite failures
      expect(successfulRenders).toBeGreaterThan(5);
    });

    it('should gracefully handle user interaction errors', async () => {
      const user = userEvent.setup();
      const errorTracker = vi.fn();

      // Mock interaction that sometimes fails
      mockContextualLyraChat.mockImplementation((props) => (
        <div data-testid="contextual-lyra-chat">
          <button 
            data-testid="error-prone-button"
            onClick={() => {
              if (Math.random() > 0.5) {
                throw new Error('Random interaction error');
              }
              props.onEngagementChange?.(true, 1);
            }}
          >
            Error-Prone Interaction
          </button>
        </div>
      ));

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={errorTracker}
          />
        </TestWrapper>
      );

      const errorProneButton = screen.getByTestId('error-prone-button');

      // Try clicking multiple times - some should succeed, some fail
      let successfulClicks = 0;
      for (let i = 0; i < 10; i++) {
        try {
          await user.click(errorProneButton);
          successfulClicks++;
        } catch {
          // Expected to fail sometimes
        }
      }

      // Should have had some successful interactions
      expect(successfulClicks).toBeGreaterThan(0);
    });
  });

  describe('Performance Under Real Usage', () => {
    it('should maintain performance during extended user session', async () => {
      const user = userEvent.setup();
      const performanceTracker = vi.fn();

      render(
        <TestWrapper>
          <FloatingLyraAvatar 
            lessonContext={mockLessonContext}
            onEngagementChange={performanceTracker}
            initialExpanded={true}
          />
        </TestWrapper>
      );

      const startTime = performance.now();

      // Simulate extended session with various interactions
      for (let i = 0; i < 20; i++) {
        // Alternate between questions
        const button = i % 2 === 0 ? 
          screen.getByTestId('mock-question-1') : 
          screen.getByTestId('mock-question-2');
        
        await user.click(button);
        
        // Occasionally minimize and expand
        if (i % 5 === 0) {
          await user.click(screen.getByTestId('minimize-chat'));
          act(() => {
            chatCallbacks.onExpandedChange(true);
          });
        }
      }

      const endTime = performance.now();
      const sessionDuration = endTime - startTime;

      // Extended session should complete within reasonable time
      expect(sessionDuration).toBeLessThan(5000); // 5 seconds max
      expect(performanceTracker).toHaveBeenCalledTimes(20);
    });

    it('should handle memory efficiently during long sessions', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Simulate long session with many re-renders
      const { rerender } = render(
        <TestWrapper>
          <FloatingLyraAvatar lessonContext={mockLessonContext} />
        </TestWrapper>
      );

      for (let i = 0; i < 100; i++) {
        rerender(
          <TestWrapper>
            <FloatingLyraAvatar 
              lessonContext={{
                ...mockLessonContext,
                phase: `session-${i}`,
                content: `Dynamic content ${i}`
              }}
            />
          </TestWrapper>
        );

        // Simulate engagement
        act(() => {
          chatCallbacks.onEngagementChange?.(true, i % 10);
        });
      }

      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Should not have excessive memory growth
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // <10MB
      }
    });
  });
});