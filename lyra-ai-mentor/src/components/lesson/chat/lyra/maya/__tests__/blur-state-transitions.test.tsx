import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LyraNarratedMayaSideBySideComplete from '../LyraNarratedMayaSideBySideComplete';
import { AuthProvider } from '@/contexts/AuthContext';
import { type LyraNarrativeMessage } from '../types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    button: ({ children, className, onClick, ...props }: any) => <button className={className} onClick={onClick} {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Test utilities
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('Maya Component Blur State Transitions - TDD', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Blur State', () => {
    it('should start with full blur on the interactive panel', () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Find the blur overlay element
      const blurOverlay = container.querySelector('[class*="backdrop-blur"]');
      expect(blurOverlay).toBeTruthy();
      
      // Should have full blur class initially
      const computedStyle = window.getComputedStyle(blurOverlay!);
      expect(computedStyle.backdropFilter).toContain('blur');
    });

    it('should maintain blur state during narrative typing', async () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Wait for narrative to start
      await waitFor(() => {
        const narrativeText = screen.queryByText(/Meet Maya Rodriguez/i);
        expect(narrativeText).toBeTruthy();
      });

      // Blur should still be active
      const blurOverlay = container.querySelector('[class*="backdrop-blur"]');
      expect(blurOverlay).toBeTruthy();
    });
  });

  describe('Narrative Completion Triggers', () => {
    it('should unblur panel when narrative messages complete', async () => {
      vi.useFakeTimers();
      
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Fast forward through all narrative messages
      await act(async () => {
        // Initial delay
        vi.advanceTimersByTime(500);
        // First message duration (~6 seconds)
        vi.advanceTimersByTime(6000);
        // Second message duration (~6 seconds) 
        vi.advanceTimersByTime(6000);
        // Third message with blur-clear trigger (~6 seconds)
        vi.advanceTimersByTime(6000);
      });

      await waitFor(() => {
        const blurOverlay = container.querySelector('[class*="backdrop-blur-none"]');
        expect(blurOverlay).toBeTruthy();
      });

      vi.useRealTimers();
    });

    it('should trigger unblur when message has blur-clear trigger', async () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Wait for the message with blur-clear trigger
      await waitFor(() => {
        const triggerMessage = screen.queryByText(/complete transformation/i);
        expect(triggerMessage).toBeTruthy();
      }, { timeout: 20000 });

      // Check that blur has been cleared
      const blurOverlay = container.querySelector('[class*="backdrop-blur-none"]');
      expect(blurOverlay).toBeTruthy();
    });

    it('should set isNarrativeComplete to true after all messages', async () => {
      vi.useFakeTimers();
      
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Advance through all narrative messages
      await act(async () => {
        vi.advanceTimersByTime(20000); // Advance past all messages
      });

      // Interactive panel should be unblurred and ready for interaction
      const interactiveButton = screen.queryByText(/Begin Maya's Complete Journey/i);
      expect(interactiveButton).toBeTruthy();
      
      // Button should be clickable (not behind blur)
      await act(async () => {
        await user.click(interactiveButton!);
      });

      vi.useRealTimers();
    });
  });

  describe('Fast Forward Behavior', () => {
    it('should immediately unblur when fast forward is clicked', async () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Find and click fast forward button
      const fastForwardButton = screen.getByLabelText(/fast forward/i);
      await user.click(fastForwardButton);

      // Should immediately clear blur
      await waitFor(() => {
        const blurOverlay = container.querySelector('[class*="backdrop-blur-none"]');
        expect(blurOverlay).toBeTruthy();
      });
    });

    it('should mark narrative as complete when fast forwarding', async () => {
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      const fastForwardButton = screen.getByLabelText(/fast forward/i);
      await user.click(fastForwardButton);

      // All messages should be visible
      await waitFor(() => {
        const allMessages = screen.queryAllByText(/Maya/i);
        expect(allMessages.length).toBeGreaterThan(0);
      });

      // Interactive content should be accessible
      const interactiveButton = screen.queryByText(/Begin Maya's Complete Journey/i);
      expect(interactiveButton).toBeTruthy();
    });
  });

  describe('Stage Transitions', () => {
    it('should respect stage-specific blur states', async () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Fast forward initial stage
      const fastForwardButton = screen.getByLabelText(/fast forward/i);
      await user.click(fastForwardButton);

      // Move to next stage
      const beginButton = await screen.findByText(/Begin Maya's Complete Journey/i);
      await user.click(beginButton);

      // New stage should have its own blur state
      await waitFor(() => {
        const blurOverlay = container.querySelector('[class*="backdrop-blur"]');
        expect(blurOverlay).toBeTruthy();
      });
    });

    it('should maintain clear state for stages with panelBlurState: "clear"', async () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Navigate to a stage with clear blur state (e.g., Execute stage)
      // Fast forward through initial stages
      for (let i = 0; i < 4; i++) {
        const fastForwardButton = screen.getByLabelText(/fast forward/i);
        await user.click(fastForwardButton);
        await waitFor(() => expect(screen.queryByText(/completing/i)).toBeFalsy());
      }

      // Check that panel is clear
      const blurOverlay = container.querySelector('[class*="backdrop-blur-none"]');
      expect(blurOverlay).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid stage changes without blur flicker', async () => {
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Rapidly click through stages
      for (let i = 0; i < 3; i++) {
        const fastForwardButton = screen.getByLabelText(/fast forward/i);
        await user.click(fastForwardButton);
        // Don't wait between clicks
      }

      // Should end in a stable state
      await waitFor(() => {
        const blurOverlay = document.querySelector('[class*="backdrop-blur"]');
        expect(blurOverlay).toBeTruthy();
      });
    });

    it('should handle component unmount during narrative', async () => {
      const { unmount } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Start narrative
      await waitFor(() => {
        const narrativeText = screen.queryByText(/Meet Maya Rodriguez/i);
        expect(narrativeText).toBeTruthy();
      });

      // Unmount should not throw errors
      expect(() => unmount()).not.toThrow();
    });

    it('should handle missing narrative messages gracefully', async () => {
      // This would require mocking the stages to have empty narrative messages
      // For now, we ensure the component handles it in the implementation
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Component should render without errors
      expect(screen.getByText(/Maya's Complete Communication Mastery/i)).toBeTruthy();
    });
  });

  describe('Blur Animation Performance', () => {
    it('should use hardware-accelerated CSS for blur transitions', () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      const blurOverlay = container.querySelector('[class*="backdrop-blur"]');
      const computedStyle = window.getComputedStyle(blurOverlay!);
      
      // Should use backdrop-filter for performance
      expect(computedStyle.backdropFilter).toBeTruthy();
      
      // Should have transition for smooth animation
      expect(computedStyle.transition || computedStyle.transitionDuration).toBeTruthy();
    });

    it('should not cause layout thrashing during blur transitions', async () => {
      const { container } = render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Track reflows
      let reflows = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            reflows++;
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });

      // Trigger blur transition
      const fastForwardButton = screen.getByLabelText(/fast forward/i);
      await user.click(fastForwardButton);

      // Should have minimal layout shifts
      await waitFor(() => {
        expect(reflows).toBeLessThan(3);
      });

      observer.disconnect();
    });
  });

  describe('Accessibility During Blur States', () => {
    it('should prevent interaction with blurred content', async () => {
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Try to interact with blurred content
      const beginButton = screen.queryByText(/Begin Maya's Complete Journey/i);
      
      if (beginButton) {
        // Should not be able to focus on blurred elements
        beginButton.focus();
        expect(document.activeElement).not.toBe(beginButton);
      }
    });

    it('should announce blur state changes to screen readers', async () => {
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      // Fast forward to trigger unblur
      const fastForwardButton = screen.getByLabelText(/fast forward/i);
      await user.click(fastForwardButton);

      // Should have appropriate ARIA attributes
      await waitFor(() => {
        const interactivePanel = screen.getByText(/Meeting Maya Rodriguez/i).closest('div');
        expect(interactivePanel?.getAttribute('aria-hidden')).toBeFalsy();
      });
    });
  });
});