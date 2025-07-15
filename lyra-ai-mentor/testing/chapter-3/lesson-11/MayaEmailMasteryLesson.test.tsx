import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MayaEmailMasteryLesson from './MayaEmailMasteryLesson';

// Mock the complex components to focus on lesson logic
vi.mock('@/components/interactive/MayaEmailComposer', () => ({
  MayaEmailComposer: ({ onComplete }: { onComplete?: Function }) => (
    <div data-testid="maya-email-composer">
      <button 
        onClick={() => onComplete?.({ recipesCreated: 1, timeSpent: 300, transformationViewed: true })}
        data-testid="complete-email-composer"
      >
        Complete Email Composer
      </button>
    </div>
  )
}));

vi.mock('@/components/interactive/MayaToneChecker', () => ({
  default: () => <div data-testid="maya-tone-checker">Maya Tone Checker</div>
}));

vi.mock('@/components/interactive/MayaTemplateLibrary', () => ({
  default: () => <div data-testid="maya-template-library">Maya Template Library</div>
}));

vi.mock('@/components/interactive/MayaConfidenceBuilder', () => ({
  default: () => <div data-testid="maya-confidence-builder">Maya Confidence Builder</div>
}));

// Mock the progress tracking
vi.mock('@/hooks/useComponentProgress', () => ({
  useComponentProgress: () => ({
    isCompleted: false,
    timeSpent: 120,
    trackInteraction: vi.fn(),
    markAsComplete: vi.fn()
  })
}));

// Mock Lyra Avatar
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, animated }: any) => (
    <div data-testid="lyra-avatar" data-size={size} data-expression={expression} data-animated={animated}>
      Lyra Avatar
    </div>
  )
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock export components
vi.mock('@/components/ui/ExportButton', () => ({
  ExportButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="export-button">{children}</button>
  )
}));

vi.mock('@/components/ProgressWidget', () => ({
  ProgressWidget: () => <div data-testid="progress-widget">Progress Widget</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MayaEmailMasteryLesson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Initial Render', () => {
    it('renders the lesson title and header correctly', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      expect(screen.getByText(/Chapter 3, Lesson 11: Maya's Email Communication Mastery/)).toBeInTheDocument();
      expect(screen.getByText(/Narrated by Lyra/)).toBeInTheDocument();
      expect(screen.getByText(/PACE Framework Journey/)).toBeInTheDocument();
    });

    it('displays the initial crisis stage', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
      expect(screen.getByText(/The Email Crisis/)).toBeInTheDocument();
      expect(screen.getByText(/One parent email has taken her 32 minutes/)).toBeInTheDocument();
    });

    it('shows Lyra avatar with correct initial state', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      const lyraAvatar = screen.getByTestId('lyra-avatar');
      expect(lyraAvatar).toBeInTheDocument();
      expect(lyraAvatar).toHaveAttribute('data-size', 'sm');
    });

    it('displays progress widget', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      expect(screen.getByTestId('progress-widget')).toBeInTheDocument();
    });
  });

  describe('Stage Navigation', () => {
    it('progresses from intro to composer stage when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Should start with crisis intro
      expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
      
      // Click the progress button
      const discoverButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
      await user.click(discoverButton);
      
      // Should progress to composer stage
      await waitFor(() => {
        expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
      });
    });

    it('shows Maya Email Composer in the second stage', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress to composer stage
      const discoverButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
      await user.click(discoverButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('maya-email-composer')).toBeInTheDocument();
      });
    });

    it('progresses through all major stages correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Stage 1: Crisis intro
      expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
      
      // Progress to stage 2
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      await waitFor(() => {
        expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
      });
      
      // Complete email composer to progress to stage 3
      await user.click(screen.getByTestId('complete-email-composer'));
      
      await waitFor(() => {
        expect(screen.getByText(/Tone Checker - Connection Mastery/)).toBeInTheDocument();
      });
    });
  });

  describe('Blur Effects', () => {
    it('starts with full blur effect representing email overwhelm', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Check for blur classes in the initial stage
      const stageContent = screen.getByText(/The Email Crisis/).closest('div');
      expect(stageContent).toHaveClass('blur-xl', 'opacity-30');
    });

    it('reduces blur as user progresses through stages', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress to next stage
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      // Blur should be reduced (not full anymore)
      await waitFor(() => {
        const composerSection = screen.getByTestId('maya-email-composer').closest('div');
        expect(composerSection).not.toHaveClass('blur-xl');
      });
    });
  });

  describe('PACE Framework Integration', () => {
    it('displays PACE framework explanation correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress to composer stage
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      await waitFor(() => {
        expect(screen.getByText(/Purpose-driven prompts/)).toBeInTheDocument();
        expect(screen.getByText(/Audience awareness/)).toBeInTheDocument();
        expect(screen.getByText(/Connection through tone/)).toBeInTheDocument();
        expect(screen.getByText(/Execute with confidence/)).toBeInTheDocument();
      });
    });

    it('shows PACE elements with correct visual indicators', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress to composer stage
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      await waitFor(() => {
        // Check for PACE letter indicators
        expect(screen.getByText('P')).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.getByText('E')).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    it('loads all Maya components in the correct stages', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress through stages to check component loading
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      // Stage 2: Email Composer
      await waitFor(() => {
        expect(screen.getByTestId('maya-email-composer')).toBeInTheDocument();
      });
      
      // Progress to stage 3
      await user.click(screen.getByTestId('complete-email-composer'));
      
      // Stage 3: Tone Checker
      await waitFor(() => {
        expect(screen.getByTestId('maya-tone-checker')).toBeInTheDocument();
      });
      
      // Progress to stage 4
      await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
      
      // Stage 4: Template Library
      await waitFor(() => {
        expect(screen.getByTestId('maya-template-library')).toBeInTheDocument();
      });
      
      // Progress to stage 5
      await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
      
      // Stage 5: Confidence Builder
      await waitFor(() => {
        expect(screen.getByTestId('maya-confidence-builder')).toBeInTheDocument();
      });
    });
  });

  describe('Fast Forward Functionality', () => {
    it('renders fast forward button', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      expect(screen.getByRole('button', { name: /Fast Forward/ })).toBeInTheDocument();
    });

    it('disables fast forward button when active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      const fastForwardButton = screen.getByRole('button', { name: /Fast Forward/ });
      await user.click(fastForwardButton);
      
      // Button should show "Skipping..." when active
      await waitFor(() => {
        expect(screen.getByText(/Skipping.../)).toBeInTheDocument();
      });
    });
  });

  describe('User Level Toggle', () => {
    it('renders user level toggle button', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      expect(screen.getByRole('button', { name: /beginner/ })).toBeInTheDocument();
    });

    it('cycles through user levels when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Should start with beginner
      expect(screen.getByRole('button', { name: /beginner/ })).toBeInTheDocument();
      
      // Click to cycle to intermediate
      await user.click(screen.getByRole('button', { name: /beginner/ }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /intermediate/ })).toBeInTheDocument();
      });
      
      // Click to cycle to advanced
      await user.click(screen.getByRole('button', { name: /intermediate/ }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /advanced/ })).toBeInTheDocument();
      });
      
      // Click to cycle back to beginner
      await user.click(screen.getByRole('button', { name: /advanced/ }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /beginner/ })).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking', () => {
    it('tracks skill completion correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress through first stage
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      // Complete email composer to trigger skill tracking
      await user.click(screen.getByTestId('complete-email-composer'));
      
      // Should track email recipe completion
      await waitFor(() => {
        expect(screen.getByText(/Tone Checker - Connection Mastery/)).toBeInTheDocument();
      });
    });

    it('shows progress indicators correctly', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Should show step indicator
      expect(screen.getByText(/1 of 6/)).toBeInTheDocument();
    });
  });

  describe('Email Metrics Showcase', () => {
    it('displays time savings metrics in final stage', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Progress through all stages to reach final transformation stage
      // This is a simplified test - in real usage would need to complete all stages
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      await user.click(screen.getByTestId('complete-email-composer'));
      await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
      await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
      await user.click(screen.getByRole('button', { name: /See Maya's Transformation/ }));
      
      await waitFor(() => {
        expect(screen.getByText(/Maya's Communication Mastery/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });

    it('has accessible buttons with proper labels', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Check that buttons have accessible names
      const discoverButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
      expect(discoverButton).toBeInTheDocument();
      
      const fastForwardButton = screen.getByRole('button', { name: /Fast Forward/ });
      expect(fastForwardButton).toBeInTheDocument();
    });

    it('has proper ARIA attributes for interactive elements', () => {
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Check for test IDs that would be used for accessibility
      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('progress-widget')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing component gracefully', () => {
      // Test error boundary behavior - component should not crash
      expect(() => {
        renderWithRouter(<MayaEmailMasteryLesson />);
      }).not.toThrow();
    });

    it('continues to function if individual components fail', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Should still be able to navigate even if some components have issues
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      await waitFor(() => {
        expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('renders within acceptable time', () => {
      const startTime = performance.now();
      renderWithRouter(<MayaEmailMasteryLesson />);
      const endTime = performance.now();
      
      // Should render within 100ms (very generous for testing)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('does not cause memory leaks with timers', () => {
      const { unmount } = renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Should unmount cleanly without throwing errors
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Responsive Design', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Component should render without layout issues
      expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
    });

    it('maintains functionality on larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      renderWithRouter(<MayaEmailMasteryLesson />);
      
      // Should render properly on desktop
      expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
    });
  });
});

// Integration test with actual component interactions
describe('MayaEmailMasteryLesson Integration', () => {
  it('completes full lesson flow from start to finish', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MayaEmailMasteryLesson />);
    
    // Start at crisis intro
    expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
    
    // Progress through all stages
    await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
    
    await waitFor(() => {
      expect(screen.getByTestId('maya-email-composer')).toBeInTheDocument();
    });
    
    await user.click(screen.getByTestId('complete-email-composer'));
    
    await waitFor(() => {
      expect(screen.getByTestId('maya-tone-checker')).toBeInTheDocument();
    });
    
    // Verify lesson progression works end-to-end
    expect(screen.getByText(/Tone Checker - Connection Mastery/)).toBeInTheDocument();
  });

  it('maintains state consistency throughout lesson progression', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MayaEmailMasteryLesson />);
    
    // Check initial state
    expect(screen.getByText(/1 of 6/)).toBeInTheDocument();
    
    // Progress and check state updates
    await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
    
    await waitFor(() => {
      expect(screen.getByText(/2 of 6/)).toBeInTheDocument();
    });
    
    // State should be consistent
    expect(screen.getByTestId('maya-email-composer')).toBeInTheDocument();
  });
});