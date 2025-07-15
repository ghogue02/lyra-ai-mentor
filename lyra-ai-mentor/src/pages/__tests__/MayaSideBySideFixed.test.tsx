import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MayaSideBySideFixed from '../MayaSideBySideFixed';
import { vi } from 'vitest';

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('MayaSideBySideFixed - Comprehensive Tests', () => {
  // Helper to get chat panel
  const getChatPanel = () => screen.getByText("Maya's Guidance").closest('.bg-white');
  const getInteractivePanel = () => screen.getByText(/Welcome|Define Your Purpose|Know Your Audience|Set the Tone|Your Email/i).closest('.bg-gradient-to-br');
  
  describe('Layout & Responsiveness', () => {
    it('should render side-by-side layout correctly', () => {
      render(<MayaSideBySideFixed />);
      
      // Check header
      expect(screen.getByText('Email Recipe Method')).toBeInTheDocument();
      expect(screen.getByText('Interactive Learning with Maya')).toBeInTheDocument();
      
      // Check both panels exist
      expect(screen.getByText("Maya's Guidance")).toBeInTheDocument();
      expect(screen.getByText('Ready to Transform Your Email Writing?')).toBeInTheDocument();
    });

    it('should show progress indicator', () => {
      render(<MayaSideBySideFixed />);
      
      expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    });

    it('should have correct panel widths (50/50 split)', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      const panels = container.querySelectorAll('.w-1\\/2');
      expect(panels).toHaveLength(2);
    });

    it('should maintain responsive classes for mobile compatibility', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      // Check for responsive container
      expect(container.querySelector('.max-w-7xl.mx-auto')).toBeInTheDocument();
      
      // Check flex layout
      expect(container.querySelector('.flex.overflow-hidden')).toBeInTheDocument();
    });

    it('should have scrollable content areas', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      const scrollableAreas = container.querySelectorAll('.overflow-y-auto');
      expect(scrollableAreas.length).toBeGreaterThan(0);
    });
  });

  describe('Stage Progression', () => {
    it('should start at intro stage', () => {
      render(<MayaSideBySideFixed />);
      
      expect(screen.getByText('Ready to Transform Your Email Writing?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Let's Begin/i })).toBeInTheDocument();
    });

    it('should progress to purpose stage when clicking begin', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      const beginButton = screen.getByRole('button', { name: /Let's Begin/i });
      await user.click(beginButton);
      
      expect(screen.getByText("Step 1: What's Your Purpose?")).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
    });

    it('should progress through all stages sequentially', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Stage 1: Intro -> Purpose
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      expect(screen.getByText("Step 1: What's Your Purpose?")).toBeInTheDocument();
      
      // Stage 2: Purpose -> Audience
      await user.click(screen.getByText('Inform about an update'));
      await waitFor(() => {
        expect(screen.getByText("Step 2: Who's Your Audience?")).toBeInTheDocument();
      });
      
      // Stage 3: Audience -> Tone
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Parent');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      expect(screen.getByText('Step 3: Choose Your Tone')).toBeInTheDocument();
      
      // Stage 4: Tone -> Result
      await user.click(screen.getByText('Warm & Friendly'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      expect(screen.getByText('Your AI-Generated Email')).toBeInTheDocument();
    });

    it('should update progress bar as stages advance', async () => {
      const user = userEvent.setup();
      const { container } = render(<MayaSideBySideFixed />);
      
      // Initial progress (20%)
      let progressBar = container.querySelector('.h-full.bg-gradient-to-r');
      expect(progressBar).toHaveStyle({ width: '20%' });
      
      // After clicking begin (40%)
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      progressBar = container.querySelector('.h-full.bg-gradient-to-r');
      expect(progressBar).toHaveStyle({ width: '40%' });
    });

    it('should save selections across stages', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Make selections
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Thank someone'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Volunteer');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      await user.click(screen.getByText('Grateful'));
      
      // Check recipe shows all selections
      expect(screen.getByText('Purpose: Thank someone')).toBeInTheDocument();
      expect(screen.getByText('Audience: Volunteer')).toBeInTheDocument();
      expect(screen.getByText('Tone: Grateful')).toBeInTheDocument();
    });
  });

  describe('Chat Guidance & Typewriter Effect', () => {
    it('should display Maya chat messages with typewriter effect', async () => {
      vi.useFakeTimers();
      render(<MayaSideBySideFixed />);
      
      // Initial message should start appearing
      await waitFor(() => {
        expect(screen.getByText(/Hi! I'm Maya Rodriguez/i)).toBeInTheDocument();
      });
      
      // Fast forward to see full message
      vi.advanceTimersByTime(10000);
      
      await waitFor(() => {
        expect(screen.getByText(/Just 6 months ago/i)).toBeInTheDocument();
      });
      
      vi.useRealTimers();
    });

    it('should show appropriate chat messages for each stage', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Progress to purpose stage
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Check for purpose-related chat messages
      await waitFor(() => {
        expect(screen.getByText(/First ingredient: PURPOSE/i)).toBeInTheDocument();
      });
    });

    it('should display hint messages with different styling', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Wait for hint message
      await waitFor(() => {
        const hintElement = screen.getByText(/Pro tip:/i).closest('div');
        expect(hintElement).toHaveClass('bg-blue-50');
      }, { timeout: 15000 });
    });

    it('should auto-scroll chat as new messages appear', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      const chatPanel = screen.getByText("Maya's Guidance").parentElement?.parentElement;
      const scrollableDiv = chatPanel?.querySelector('.overflow-y-auto');
      
      // Mock scrollHeight and scrollTop
      if (scrollableDiv) {
        Object.defineProperty(scrollableDiv, 'scrollHeight', { value: 1000, writable: true });
        Object.defineProperty(scrollableDiv, 'scrollTop', { value: 0, writable: true });
      }
      
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Wait for messages to appear and check scroll
      await waitFor(() => {
        expect(scrollableDiv?.scrollTop).toBeGreaterThan(0);
      });
    });
  });

  describe('Email Generation', () => {
    it('should generate email based on recipe selections', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Complete recipe
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Thank someone'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Donor');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      await user.click(screen.getByText('Grateful'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      
      // Check generated email contains expected elements
      await waitFor(() => {
        expect(screen.getByText(/Subject: Thank You!/i)).toBeInTheDocument();
        expect(screen.getByText(/Dear Donor/i)).toBeInTheDocument();
      });
    });

    it('should adjust email content based on tone selection', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Complete recipe with urgent tone
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Request something'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Board Member');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      await user.click(screen.getByText('Urgent'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      
      // Check for urgent language
      await waitFor(() => {
        expect(screen.getByText(/urgently need to/i)).toBeInTheDocument();
      });
    });

    it('should show copy and try again buttons after generation', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Generate email
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Inform about an update'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Staff');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      await user.click(screen.getByText('Professional'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      
      // Check action buttons
      expect(screen.getByRole('button', { name: /Copy Email/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Another/i })).toBeInTheDocument();
    });

    it('should reset flow when clicking try another', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Complete a flow
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Inform about an update'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Parent');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      await user.click(screen.getByText('Warm & Friendly'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      
      // Click try another
      await user.click(screen.getByRole('button', { name: /Try Another/i }));
      
      // Should be back at purpose stage
      expect(screen.getByText("Step 1: What's Your Purpose?")).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should highlight selected options', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      const purposeButton = screen.getByText('Invite to an event');
      await user.click(purposeButton);
      
      // Check button has selected styling
      expect(purposeButton.parentElement).toHaveClass('border-purple-600', 'bg-purple-100');
    });

    it('should show success message after purpose selection', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Make Request'));
      
      expect(screen.getByText(/Great choice!/i)).toBeInTheDocument();
    });

    it('should show audience considerations after input', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Share Update'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Community Partner');
      
      // Should show considerations
      expect(screen.getByText('Knowledge level')).toBeInTheDocument();
      expect(screen.getByText('Time constraints')).toBeInTheDocument();
      expect(screen.getByText('Relationship to you')).toBeInTheDocument();
      expect(screen.getByText('Communication style')).toBeInTheDocument();
    });

    it('should disable generate button until all fields complete', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Navigate to tone stage without completing all fields
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Thank someone'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Volunteer');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      // Generate button should not appear until tone is selected
      expect(screen.queryByRole('button', { name: /Generate My Email/i })).not.toBeInTheDocument();
      
      // Select tone
      await user.click(screen.getByText('Celebratory'));
      
      // Now generate button should appear
      expect(screen.getByRole('button', { name: /Generate My Email/i })).toBeInTheDocument();
    });
  });

  describe('Time Savings Display', () => {
    it('should show time savings message in result stage', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Complete full flow
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Express Thanks'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Donor');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      
      await user.click(screen.getByText('Grateful'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      
      // Check time savings display
      expect(screen.getByText(/Time saved: ~27 minutes!/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MayaSideBySideFixed />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Email Recipe Method');
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Tab to begin button
      await user.tab();
      const beginButton = screen.getByRole('button', { name: /Let's Begin/i });
      expect(beginButton).toHaveFocus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(screen.getByText("Step 1: What's Your Purpose?")).toBeInTheDocument();
    });

    it('should have descriptive button labels', () => {
      render(<MayaSideBySideFixed />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('should announce stage changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Check for live region updates
      const statusElements = screen.getAllByRole('status');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing selections gracefully', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Try to proceed without selection
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Should still be on purpose stage
      expect(screen.getByText("Step 1: What's Your Purpose?")).toBeInTheDocument();
    });

    it('should maintain state on component re-render', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<MayaSideBySideFixed />);
      
      // Make some selections
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Invite to an event'));
      
      // Re-render component
      rerender(<MayaSideBySideFixed />);
      
      // Selection should persist
      const selectedButton = screen.getByText('Invite to an event').parentElement;
      expect(selectedButton).toHaveClass('border-purple-600');
    });
  });

  describe('Performance', () => {
    it('should not create memory leaks with timeouts', () => {
      const { unmount } = render(<MayaSideBySideFixed />);
      
      // Component should clean up timeouts on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid stage transitions', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Rapidly click through stages
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Request something'));
      
      // Should handle without errors
      expect(screen.getByText("Step 2: Who's Your Audience?")).toBeInTheDocument();
    });
  });
});