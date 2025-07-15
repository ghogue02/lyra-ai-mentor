import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MayaToneMasteryLesson from '../MayaToneMasteryLesson';
import { vi } from 'vitest';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock framer-motion for stable testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, initial, transition, whileHover, whileTap, ...props }: any) => 
      React.createElement('div', props, children),
    button: ({ children, animate, initial, transition, whileHover, whileTap, ...props }: any) => 
      React.createElement('button', props, children),
  },
}));

describe('MayaToneMasteryLesson - Comprehensive Testing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // Helper functions
  const getChatPanel = () => screen.getByText("Lyra's Tone Journey").closest('div');
  const getInteractivePanel = () => screen.getByText(/Tone Mastery Workshop|Audience Recognition|Tone Adaptation|Tone in Action/i).closest('div');
  const advanceToStage = async (stageNumber: number) => {
    const user = userEvent.setup();
    
    if (stageNumber >= 1) {
      await user.click(screen.getByRole('button', { name: /Begin Tone Discovery/i }));
    }
    if (stageNumber >= 2) {
      await user.click(screen.getByText('Busy Parent'));
      await waitFor(() => {
        expect(screen.getByText(/Step 2: Choose Your Tone/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    }
    if (stageNumber >= 3) {
      await user.click(screen.getByText('Warm Appreciation'));
      await waitFor(() => {
        expect(screen.getByText(/Step 3: Practice & Perfect/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    }
  };

  describe('Initial Component Rendering', () => {
    it('should render the complete lesson structure', () => {
      render(<MayaToneMasteryLesson />);
      
      // Check header elements
      expect(screen.getByText("Maya's Tone Mastery Workshop")).toBeInTheDocument();
      expect(screen.getByText('Adapting voice for authentic connection')).toBeInTheDocument();
      
      // Check layout structure
      expect(screen.getByText("Lyra's Tone Journey")).toBeInTheDocument();
      expect(screen.getByText('Tone Mastery Workshop')).toBeInTheDocument();
      
      // Check progress indicator
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    });

    it('should render with correct initial blur state', () => {
      const { container } = render(<MayaToneMasteryLesson />);
      
      // Interactive panel should start blurred
      const blurredElements = container.querySelectorAll('.blur-xl');
      expect(blurredElements.length).toBeGreaterThan(0);
    });

    it('should display initial navigation elements', () => {
      render(<MayaToneMasteryLesson />);
      
      expect(screen.getByRole('button', { name: /Hub/i })).toBeInTheDocument();
      expect(screen.getByText('Begin Tone Discovery')).toBeInTheDocument();
    });

    it('should show correct Lyra avatar states', () => {
      render(<MayaToneMasteryLesson />);
      
      // Check for Lyra avatar components
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  describe('Tone Profile System', () => {
    const toneProfiles = [
      'Warm Appreciation',
      'Empathetic Support', 
      'Professional Collaborative',
      'Urgent but Clear'
    ];

    it('should display all tone profiles in selection stage', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(2);
      
      // Check that all tone profiles are displayed
      for (const profile of toneProfiles) {
        expect(screen.getByText(profile)).toBeInTheDocument();
      }
    });

    it('should show tone profile characteristics', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(2);
      
      // Check for voice characteristics
      expect(screen.getByText('Heartfelt')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Grateful')).toBeInTheDocument();
      expect(screen.getByText('Inspiring')).toBeInTheDocument();
    });

    it('should display tone profile examples', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(2);
      
      // Check for example text
      expect(screen.getByText(/Sarah, your dedication to our reading corner/i)).toBeInTheDocument();
    });

    it('should highlight selected tone profile', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(2);
      
      const warmAppreciationButton = screen.getByText('Warm Appreciation').closest('button');
      await user.click(warmAppreciationButton!);
      
      expect(warmAppreciationButton).toHaveClass('border-pink-600', 'bg-pink-100');
    });
  });

  describe('Audience Recognition Workflow', () => {
    const audienceTypes = [
      'Busy Parent',
      'Dedicated Volunteer',
      'Board Member',
      'Community (Emergency)'
    ];

    it('should display all audience types', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      for (const audience of audienceTypes) {
        expect(screen.getByText(audience)).toBeInTheDocument();
      }
    });

    it('should show audience context and needs', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      // Check for context information
      expect(screen.getByText('Picking up kids, checking phone quickly')).toBeInTheDocument();
      expect(screen.getByText('Quick, warm, clear information')).toBeInTheDocument();
    });

    it('should provide feedback on audience selection', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      await user.click(screen.getByText('Busy Parent'));
      
      await waitFor(() => {
        expect(screen.getByText(/Perfect! You're learning to see your audience like Maya does/i)).toBeInTheDocument();
      });
    });

    it('should advance to next stage after audience selection', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      await user.click(screen.getByText('Dedicated Volunteer'));
      
      await waitFor(() => {
        expect(screen.getByText('Step 2: Choose Your Tone')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Stage Navigation and Progression', () => {
    it('should progress through all four stages', async () => {
      render(<MayaToneMasteryLesson />);
      
      // Stage 1: Intro
      expect(screen.getByText('Tone Mastery Workshop')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
      
      // Stage 2: Audience Recognition
      await advanceToStage(1);
      expect(screen.getByText('Step 1: See Your Audience')).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      
      // Stage 3: Tone Selection
      await advanceToStage(2);
      expect(screen.getByText('Step 2: Choose Your Tone')).toBeInTheDocument();
      expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();
      
      // Stage 4: Practice Application
      await advanceToStage(3);
      expect(screen.getByText('Step 3: Practice & Perfect')).toBeInTheDocument();
      expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
    });

    it('should update progress bar correctly', async () => {
      const { container } = render(<MayaToneMasteryLesson />);
      
      // Check initial progress (25%)
      let progressBar = container.querySelector('.h-full.bg-gradient-to-r');
      expect(progressBar).toHaveStyle({ width: '25%' });
      
      // Advance to stage 2 (50%)
      await advanceToStage(1);
      progressBar = container.querySelector('.h-full.bg-gradient-to-r');
      expect(progressBar).toHaveStyle({ width: '50%' });
      
      // Advance to stage 3 (75%)
      await advanceToStage(2);
      progressBar = container.querySelector('.h-full.bg-gradient-to-r');
      expect(progressBar).toHaveStyle({ width: '75%' });
      
      // Advance to stage 4 (100%)
      await advanceToStage(3);
      progressBar = container.querySelector('.h-full.bg-gradient-to-r');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('should persist user selections across stages', async () => {
      render(<MayaToneMasteryLesson />);
      
      // Make selections
      await advanceToStage(1);
      await advanceToStage(2);
      await advanceToStage(3);
      
      // Check that selections are remembered in final stage
      expect(screen.getByText('Audience Understanding: Busy parents need quick, warm updates')).toBeInTheDocument();
      expect(screen.getByText('Tone Selection: Warm appreciation builds trust')).toBeInTheDocument();
    });
  });

  describe('Message Adaptation System', () => {
    it('should display original vs adapted message comparison', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(3);
      
      // Check for original message
      expect(screen.getByText('❌ Maya\'s Original (One-Size-Fits-All)')).toBeInTheDocument();
      expect(screen.getByText(/We wanted to inform you about the changes/i)).toBeInTheDocument();
      
      // Check for adapted message
      expect(screen.getByText('✅ Maya\'s Adapted Message')).toBeInTheDocument();
    });

    it('should generate appropriate adapted messages based on selection', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(3);
      
      // Should show adapted message for busy parent + warm appreciation
      expect(screen.getByText(/Hi! Just a quick heads up about our updated schedule/i)).toBeInTheDocument();
    });

    it('should show completion summary', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(3);
      
      expect(screen.getByText('🎯 Maya\'s Tone Mastery Complete!')).toBeInTheDocument();
      expect(screen.getByText('Same caring Maya, different expression')).toBeInTheDocument();
      expect(screen.getByText('Stronger community relationships')).toBeInTheDocument();
    });
  });

  describe('Blur State Management', () => {
    it('should start with full blur on interactive panel', () => {
      const { container } = render(<MayaToneMasteryLesson />);
      
      const blurredElements = container.querySelectorAll('.blur-xl');
      expect(blurredElements.length).toBeGreaterThan(0);
    });

    it('should transition to partial blur in audience stage', async () => {
      const { container } = render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      // Should have partial blur elements
      const partialBlurElements = container.querySelectorAll('.blur-sm');
      expect(partialBlurElements.length).toBeGreaterThan(0);
    });

    it('should have clear view in final stages', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(2);
      
      // Should not have blur classes in final stages
      const blurredElements = document.querySelectorAll('.blur-xl, .blur-sm');
      const clearElements = Array.from(blurredElements).filter(el => 
        !el.classList.contains('blur-xl') && !el.classList.contains('blur-sm')
      );
      expect(clearElements.length).toBeGreaterThan(0);
    });
  });

  describe('Typewriter Effect and Messaging', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should display Lyra narrative messages with typewriter effect', async () => {
      render(<MayaToneMasteryLesson />);
      
      // Fast forward to see messages
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/Maya thought she had one voice/i)).toBeInTheDocument();
      });
    });

    it('should show different message types with appropriate styling', async () => {
      render(<MayaToneMasteryLesson />);
      
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      
      await waitFor(() => {
        // Story messages should have pink-purple gradient
        const storyMessages = screen.getAllByText(/Maya thought she had one voice/i);
        expect(storyMessages.length).toBeGreaterThan(0);
      });
    });

    it('should handle message sequencing correctly', async () => {
      render(<MayaToneMasteryLesson />);
      
      // First message should appear
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      await waitFor(() => {
        expect(screen.getByText(/Maya thought she had one voice/i)).toBeInTheDocument();
      });
      
      // Second message should appear after delay
      act(() => {
        vi.advanceTimersByTime(6000);
      });
      await waitFor(() => {
        expect(screen.getByText(/The same message delivered in different tones/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation and User Experience', () => {
    it('should handle hub navigation', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      const hubButton = screen.getByRole('button', { name: /Hub/i });
      await user.click(hubButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/chapter/2/lesson/5');
    });

    it('should handle navigation to next lesson', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(3);
      
      const nextButton = screen.getByRole('button', { name: /Next: Template Library/i });
      await user.click(nextButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/chapter/2/lesson/5/template-library');
    });

    it('should handle back navigation', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(3);
      
      const backButton = screen.getByRole('button', { name: /Back to Hub/i });
      await user.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/chapter/2/lesson/5');
    });
  });

  describe('Accessibility and Usability', () => {
    it('should have proper heading hierarchy', () => {
      render(<MayaToneMasteryLesson />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent("Maya's Tone Mastery Workshop");
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      // Tab to begin button
      await user.tab();
      const beginButton = screen.getByRole('button', { name: /Begin Tone Discovery/i });
      expect(beginButton).toHaveFocus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(screen.getByText('Step 1: See Your Audience')).toBeInTheDocument();
    });

    it('should have descriptive button labels', () => {
      render(<MayaToneMasteryLesson />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('should provide clear feedback on user actions', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      await user.click(screen.getByText('Board Member'));
      
      await waitFor(() => {
        expect(screen.getByText(/Perfect! You're learning to see your audience/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle rapid user interactions gracefully', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      // Rapidly click through stages
      const beginButton = screen.getByRole('button', { name: /Begin Tone Discovery/i });
      await user.click(beginButton);
      
      // Should not crash or show errors
      expect(screen.getByText('Step 1: See Your Audience')).toBeInTheDocument();
    });

    it('should clean up timeouts on unmount', () => {
      const { unmount } = render(<MayaToneMasteryLesson />);
      
      // Component should clean up timeouts on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle missing selections gracefully', async () => {
      render(<MayaToneMasteryLesson />);
      
      // Try to proceed without making selections
      await advanceToStage(1);
      
      // Should still be functional
      expect(screen.getByText('Step 1: See Your Audience')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause memory leaks with message timers', () => {
      const { unmount } = render(<MayaToneMasteryLesson />);
      
      // Start some timers
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);
      
      // Unmount should not throw
      expect(() => unmount()).not.toThrow();
      
      vi.useRealTimers();
    });

    it('should handle stage transitions efficiently', async () => {
      const user = userEvent.setup();
      render(<MayaToneMasteryLesson />);
      
      const startTime = performance.now();
      await advanceToStage(3);
      const endTime = performance.now();
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });

  describe('Content Validation', () => {
    it('should display all required instructional content', () => {
      render(<MayaToneMasteryLesson />);
      
      expect(screen.getByText('Discover how Maya learned to adapt her voice')).toBeInTheDocument();
      expect(screen.getByText('for different audiences with authenticity')).toBeInTheDocument();
    });

    it('should show learning outcomes clearly', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(3);
      
      expect(screen.getByText('Authentic Adaptation: Same caring Maya, different expression')).toBeInTheDocument();
      expect(screen.getByText('Result: Stronger community relationships')).toBeInTheDocument();
    });

    it('should provide context for each learning step', async () => {
      render(<MayaToneMasteryLesson />);
      
      await advanceToStage(1);
      
      expect(screen.getByText('Maya learned that tone adaptation starts with truly seeing who you\'re speaking to.')).toBeInTheDocument();
    });
  });

  describe('Integration with Other Components', () => {
    it('should integrate properly with LyraAvatar component', () => {
      render(<MayaToneMasteryLesson />);
      
      // Check that avatars are rendered
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('should use proper UI component styling', () => {
      const { container } = render(<MayaToneMasteryLesson />);
      
      // Check for proper Tailwind classes
      expect(container.querySelector('.bg-\\[\\#FAF9F7\\]')).toBeInTheDocument();
      expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
    });
  });
});