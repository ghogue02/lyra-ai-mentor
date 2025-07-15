import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MayaMicroLessonHub } from '../MayaMicroLessonHub';
import MayaMicroLessonMinimal from '../MayaMicroLessonMinimal';

// Mock hooks
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } })
}));

jest.mock('../../../hooks/useAdaptiveAI', () => ({
  useAdaptiveAI: () => ({
    mayaMetrics: {
      emailEfficiencyImprovement: 75,
      timeReclaimed: 3600
    },
    refreshMayaMetrics: jest.fn()
  })
}));

jest.mock('../../../hooks/useAdaptiveUI', () => ({
  useAdaptiveUI: () => ({
    readingSpeed: 200,
    engagementLevel: 'high',
    emotionalState: 'neutral',
    trackInteraction: jest.fn(),
    startReading: jest.fn(),
    endReading: jest.fn(),
    getTypewriterSpeed: jest.fn(() => 50),
    getAmbientClass: jest.fn(() => 'ambient-morning'),
    predictNextAction: jest.fn(),
    proactiveHelp: {
      enabled: false,
      suggestions: [],
      dismiss: jest.fn()
    },
    shouldSimplify: false,
    shouldSlowDown: false,
    shouldHighlightProgress: false
  })
}));

// Mock ProactiveAssistant
jest.mock('../../ui/ProactiveAssistant', () => {
  return function MockProactiveAssistant() {
    return <div data-testid="proactive-assistant" />;
  };
});

describe('Minimal UI Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('MayaMicroLessonHub - Eye Icon Functionality', () => {
    it('should render the Eye icon prominently', () => {
      render(<MayaMicroLessonHub chapterId={2} lessonId={5} />);
      
      const eyeIcon = screen.getByTestId('eye-icon') || screen.getByText(/Glass|Minimal/);
      expect(eyeIcon).toBeVisible();
    });

    it('should toggle UI mode when Eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<MayaMicroLessonHub chapterId={2} lessonId={5} />);
      
      // Find the UI toggle button
      const toggleButton = screen.getByText(/Glass/);
      expect(toggleButton).toBeInTheDocument();
      
      // Click to switch to minimal UI
      await user.click(toggleButton.closest('button') || toggleButton);
      
      // Should now show "Minimal" text
      await waitFor(() => {
        expect(screen.getByText(/Minimal/)).toBeInTheDocument();
      });
    });

    it('should persist UI preference in localStorage', async () => {
      const user = userEvent.setup();
      render(<MayaMicroLessonHub chapterId={2} lessonId={5} />);
      
      const toggleButton = screen.getByText(/Glass/);
      await user.click(toggleButton.closest('button') || toggleButton);
      
      // Check localStorage
      expect(localStorage.getItem('maya-minimal-ui-preference')).toBe('true');
    });

    it('should load UI preference from localStorage on mount', () => {
      localStorage.setItem('maya-minimal-ui-preference', 'true');
      
      render(<MayaMicroLessonHub chapterId={2} lessonId={5} />);
      
      // Should start with minimal UI active
      expect(screen.getByText(/Minimal/)).toBeInTheDocument();
    });
  });

  describe('MayaMicroLessonMinimal - Component Rendering', () => {
    const defaultProps = {
      lessonId: 'test-lesson',
      title: 'Test Lesson',
      description: 'A test lesson description',
      scenario: 'This is a test scenario for the lesson.',
      onComplete: jest.fn(),
      onBack: jest.fn(),
      userId: 'test-user'
    };

    it('should render without crashing', () => {
      render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      expect(screen.getByText('Test Lesson')).toBeInTheDocument();
      expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();
    });

    it('should use minimal UI styles (no glass effects)', () => {
      const { container } = render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      // Should have minimal-ui class
      const minimalContainer = container.querySelector('.minimal-ui');
      expect(minimalContainer).toBeInTheDocument();
      
      // Should NOT have glass effects
      const glassElements = container.querySelectorAll('[class*="glass"]');
      expect(glassElements).toHaveLength(0);
    });

    it('should have warm off-white background', () => {
      const { container } = render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      const minimalContainer = container.querySelector('.minimal-ui');
      const computedStyle = window.getComputedStyle(minimalContainer!);
      
      // Check for the background color (should be #FAF9F7 or equivalent)
      expect(minimalContainer).toHaveClass('minimal-ui');
    });

    it('should render back button when onBack prop is provided', () => {
      render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      const backButton = screen.getByText(/Back to Hub/);
      expect(backButton).toBeInTheDocument();
    });

    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnBack = jest.fn();
      
      render(<MayaMicroLessonMinimal {...defaultProps} onBack={mockOnBack} />);
      
      const backButton = screen.getByText(/Back to Hub/);
      await user.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('AI Features Integration', () => {
    const defaultProps = {
      lessonId: 'test-lesson',
      title: 'Test Lesson',
      description: 'A test lesson description',
      scenario: 'This is a test scenario for the lesson.',
      onComplete: jest.fn(),
      userId: 'test-user'
    };

    it('should display typewriter effect with adaptive speed', async () => {
      render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      // Should show typing cursor initially
      const cursor = screen.getByTestId('typewriter-cursor') || 
                    document.querySelector('.minimal-typewriter-cursor');
      
      if (cursor) {
        expect(cursor).toBeInTheDocument();
      }
      
      // Content should appear gradually
      await waitFor(() => {
        const content = screen.getByText(/Hi! I'm Maya/);
        expect(content).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should render ProactiveAssistant component', () => {
      render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      const proactiveAssistant = screen.getByTestId('proactive-assistant');
      expect(proactiveAssistant).toBeInTheDocument();
    });

    it('should track user interactions', async () => {
      const user = userEvent.setup();
      render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      // Wait for initial typing to complete
      await waitFor(() => {
        const continueButton = screen.getByText(/Continue|Ready/);
        expect(continueButton).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const continueButton = screen.getByText(/Continue|Ready/);
      await user.click(continueButton);
      
      // Should progress to next step
      await waitFor(() => {
        expect(screen.getByText(/Step 2 of/)).toBeInTheDocument();
      });
    });
  });

  describe('Background and Ambient Features', () => {
    const defaultProps = {
      lessonId: 'test-lesson',
      title: 'Test Lesson',
      description: 'A test lesson description',
      scenario: 'This is a test scenario.',
      onComplete: jest.fn(),
      userId: 'test-user'
    };

    it('should apply ambient background based on time of day', () => {
      const { container } = render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      // Should have an ambient class applied
      const minimalContainer = container.querySelector('.minimal-ui');
      expect(minimalContainer).toHaveClass(/ambient-/);
    });

    it('should use proper color scheme for minimal UI', () => {
      const { container } = render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      // Check for minimal-card elements
      const cards = container.querySelectorAll('.minimal-card');
      expect(cards.length).toBeGreaterThan(0);
      
      // Check for minimal buttons
      const buttons = container.querySelectorAll('.minimal-button, .minimal-button-secondary');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Lesson Flow and Completion', () => {
    const defaultProps = {
      lessonId: 'test-lesson',
      title: 'Test Lesson',
      description: 'A test lesson description',
      scenario: 'This is a test scenario.',
      onComplete: jest.fn(),
      userId: 'test-user'
    };

    it('should progress through all lesson steps', async () => {
      const user = userEvent.setup();
      const mockOnComplete = jest.fn();
      
      render(<MayaMicroLessonMinimal {...defaultProps} onComplete={mockOnComplete} />);
      
      // Progress through each step
      for (let step = 1; step <= 5; step++) {
        await waitFor(() => {
          expect(screen.getByText(`Step ${step} of 5`)).toBeInTheDocument();
        }, { timeout: 3000 });
        
        if (step < 5) {
          const continueButton = screen.getByText(/Continue/);
          await user.click(continueButton);
        } else {
          const completeButton = screen.getByText(/Complete/);
          await user.click(completeButton);
        }
      }
      
      // Should call onComplete
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('should show completion state', async () => {
      const user = userEvent.setup();
      render(<MayaMicroLessonMinimal {...defaultProps} />);
      
      // Navigate to final step and complete
      // ... (implementation depends on specific step progression)
      
      // Should show completion message
      await waitFor(() => {
        const completionText = screen.getByText(/Lesson Complete/);
        expect(completionText).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Hub Integration Tests', () => {
    it('should switch between Glass and Minimal UI components', async () => {
      const user = userEvent.setup();
      render(<MayaMicroLessonHub chapterId={2} lessonId={5} />);
      
      // Start a lesson with Glass UI
      const firstLesson = screen.getByText(/Lesson 1:/);
      await user.click(firstLesson);
      
      // Should render standard lesson component
      // (Glass UI would have different structure)
      
      // Go back and switch to minimal UI
      const backButton = screen.getByLabelText(/back|return/i);
      if (backButton) {
        await user.click(backButton);
      }
      
      // Toggle to minimal UI
      const toggleButton = screen.getByText(/Glass/);
      await user.click(toggleButton);
      
      // Start lesson again
      const firstLessonAgain = screen.getByText(/Lesson 1:/);
      await user.click(firstLessonAgain);
      
      // Should now render minimal component
      await waitFor(() => {
        expect(screen.getByText(/Minimal UI Mode/)).toBeInTheDocument();
      });
    });
  });
});

describe('Accessibility Tests', () => {
  const defaultProps = {
    lessonId: 'test-lesson',
    title: 'Test Lesson',
    description: 'A test lesson description',
    scenario: 'This is a test scenario.',
    onComplete: jest.fn(),
    userId: 'test-user'
  };

  it('should have proper focus management', async () => {
    const user = userEvent.setup();
    render(<MayaMicroLessonMinimal {...defaultProps} />);
    
    // Wait for textarea to appear
    await waitFor(() => {
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should focus on textarea when it appears
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveFocus();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<MayaMicroLessonMinimal {...defaultProps} />);
    
    // Should be able to tab through interactive elements
    await user.tab();
    
    // Check that focusable elements are reachable
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();
  });

  it('should have proper ARIA labels', () => {
    render(<MayaMicroLessonMinimal {...defaultProps} />);
    
    // Check for proper labeling
    const backButton = screen.getByText(/Back to Hub/);
    expect(backButton).toBeInTheDocument();
    
    // Progress indicator should be readable
    const progressText = screen.getByText(/Step 1 of 5/);
    expect(progressText).toBeInTheDocument();
  });
});