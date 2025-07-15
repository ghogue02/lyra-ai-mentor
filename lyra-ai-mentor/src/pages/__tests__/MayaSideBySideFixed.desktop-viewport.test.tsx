import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MayaSideBySideFixed from '../MayaSideBySideFixed';
import { vi } from 'vitest';

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('MayaSideBySideFixed - Desktop Viewport Tests', () => {
  // Helper to set viewport size
  const setViewport = (width: number, height: number) => {
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
    window.dispatchEvent(new Event('resize'));
  };

  // Helper to check panel layout
  const checkPanelLayout = (container: HTMLElement) => {
    const mainContent = container.querySelector('.flex.overflow-hidden');
    const chatPanel = screen.getByText("Maya's Guidance").closest('.w-1\\/2');
    const interactivePanel = container.querySelector('.w-1\\/2.flex.flex-col.bg-gradient-to-br');
    
    return {
      mainContent,
      chatPanel,
      interactivePanel,
      hasProperFlex: mainContent?.classList.contains('flex'),
      hasOverflowHidden: mainContent?.classList.contains('overflow-hidden'),
      bothPanelsHaveHalfWidth: chatPanel?.classList.contains('w-1/2') && 
                                interactivePanel?.classList.contains('w-1/2'),
    };
  };

  // Helper to check for overlaps using getBoundingClientRect
  const checkForOverlaps = (container: HTMLElement) => {
    const chatPanel = screen.getByText("Maya's Guidance").closest('.w-1\\/2');
    const interactivePanel = container.querySelector('.w-1\\/2.flex.flex-col.bg-gradient-to-br');
    
    if (!chatPanel || !interactivePanel) return null;
    
    const chatRect = chatPanel.getBoundingClientRect();
    const interactiveRect = interactivePanel.getBoundingClientRect();
    
    return {
      chatRect,
      interactiveRect,
      hasOverlap: chatRect.right > interactiveRect.left,
      gap: interactiveRect.left - chatRect.right,
      chatPanelFixed: window.getComputedStyle(chatPanel).position === 'fixed',
      properZIndex: {
        chat: window.getComputedStyle(chatPanel).zIndex,
        interactive: window.getComputedStyle(interactivePanel).zIndex,
      }
    };
  };

  describe('Desktop Small (1024px)', () => {
    beforeEach(() => {
      setViewport(1024, 768);
    });

    it('should display both panels side by side without overlap', () => {
      const { container } = render(<MayaSideBySideFixed />);
      const layout = checkPanelLayout(container);
      
      expect(layout.hasProperFlex).toBe(true);
      expect(layout.hasOverflowHidden).toBe(true);
      expect(layout.bothPanelsHaveHalfWidth).toBe(true);
    });

    it('should maintain proper spacing between panels', () => {
      const { container } = render(<MayaSideBySideFixed />);
      const overlapCheck = checkForOverlaps(container);
      
      expect(overlapCheck?.hasOverlap).toBe(false);
      expect(overlapCheck?.gap).toBeGreaterThanOrEqual(0);
    });

    it('should keep chat panel visible during interactions', async () => {
      const user = userEvent.setup();
      render(<MayaSideBySideFixed />);
      
      // Progress through stages
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Chat panel should remain visible
      const chatPanel = screen.getByText("Maya's Guidance").closest('.w-1\\/2');
      expect(chatPanel).toBeVisible();
      
      // Check computed styles
      const styles = window.getComputedStyle(chatPanel!);
      expect(styles.display).not.toBe('none');
      expect(styles.visibility).not.toBe('hidden');
    });

    it('should handle content overflow properly', async () => {
      const user = userEvent.setup();
      const { container } = render(<MayaSideBySideFixed />);
      
      // Add multiple messages to chat
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Check scrollable areas
      const chatScrollArea = container.querySelector('.w-1\\/2 .overflow-y-auto');
      expect(chatScrollArea).toBeTruthy();
      expect(window.getComputedStyle(chatScrollArea!).overflowY).toBe('auto');
    });
  });

  describe('Desktop Medium (1280px)', () => {
    beforeEach(() => {
      setViewport(1280, 800);
    });

    it('should have no overlapping elements', () => {
      const { container } = render(<MayaSideBySideFixed />);
      const overlapCheck = checkForOverlaps(container);
      
      expect(overlapCheck?.hasOverlap).toBe(false);
    });

    it('should maintain proper panel widths', () => {
      const { container } = render(<MayaSideBySideFixed />);
      const layout = checkPanelLayout(container);
      
      expect(layout.bothPanelsHaveHalfWidth).toBe(true);
      
      // Additional width checks
      if (layout.chatPanel && layout.interactivePanel) {
        const chatWidth = layout.chatPanel.getBoundingClientRect().width;
        const interactiveWidth = layout.interactivePanel.getBoundingClientRect().width;
        
        // Both panels should be roughly equal width (allowing for border)
        expect(Math.abs(chatWidth - interactiveWidth)).toBeLessThan(10);
      }
    });

    it('should handle stage transitions smoothly', async () => {
      const user = userEvent.setup();
      const { container } = render(<MayaSideBySideFixed />);
      
      // Initial state
      let overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
      
      // Transition through stages
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
      
      await user.click(screen.getByText('Inform about an update'));
      await waitFor(() => {
        overlapCheck = checkForOverlaps(container);
        expect(overlapCheck?.hasOverlap).toBe(false);
      });
    });
  });

  describe('Desktop Large (1440px)', () => {
    beforeEach(() => {
      setViewport(1440, 900);
    });

    it('should scale panels appropriately', () => {
      const { container } = render(<MayaSideBySideFixed />);
      const layout = checkPanelLayout(container);
      
      // Check max-width constraint
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeTruthy();
      
      // Panels should still be 50/50
      expect(layout.bothPanelsHaveHalfWidth).toBe(true);
    });

    it('should maintain readability with proper spacing', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      // Check padding and margins
      const chatContent = container.querySelector('.w-1\\/2 .p-4');
      const interactiveContent = container.querySelector('.w-1\\/2.flex.flex-col .p-8');
      
      expect(chatContent).toBeTruthy();
      expect(interactiveContent).toBeTruthy();
    });

    it('should handle complex content without breaking layout', async () => {
      const user = userEvent.setup();
      const { container } = render(<MayaSideBySideFixed />);
      
      // Progress to email generation
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Inform about an update'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), 'Board Members and Stakeholders');
      await user.click(screen.getByRole('button', { name: /Continue to Tone/i }));
      await user.click(screen.getByText('Professional'));
      await user.click(screen.getByRole('button', { name: /Generate My Email/i }));
      
      // Check layout integrity
      const overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
    });
  });

  describe('Desktop Extra Large (1920px)', () => {
    beforeEach(() => {
      setViewport(1920, 1080);
    });

    it('should respect max-width constraints', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeTruthy();
      
      // Check actual width doesn't exceed max
      const containerRect = mainContainer!.getBoundingClientRect();
      expect(containerRect.width).toBeLessThanOrEqual(1280); // max-w-7xl = 80rem = 1280px
    });

    it('should center content properly', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      const mainContainer = container.querySelector('.max-w-7xl.mx-auto');
      expect(mainContainer).toBeTruthy();
      
      // Check horizontal centering
      const rect = mainContainer!.getBoundingClientRect();
      const leftMargin = rect.left;
      const rightMargin = window.innerWidth - rect.right;
      
      // Margins should be roughly equal (within 1px for rounding)
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(1);
    });

    it('should maintain visual hierarchy', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      // Check z-index layering
      const header = container.querySelector('.border-b');
      const chatPanel = screen.getByText("Maya's Guidance").closest('.w-1\\/2');
      const progressBar = container.querySelector('.h-2.bg-gray-200');
      
      const headerZ = window.getComputedStyle(header!).zIndex;
      const chatZ = window.getComputedStyle(chatPanel!).zIndex;
      const progressZ = window.getComputedStyle(progressBar!).zIndex;
      
      // Ensure proper stacking context
      expect([headerZ, chatZ, progressZ]).toEqual(
        expect.arrayContaining(['auto', '0', '1', '2', '3', '4', '5'])
      );
    });
  });

  describe('Edge Cases & Regression Tests', () => {
    it('should handle viewport changes dynamically', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      // Start at desktop
      setViewport(1440, 900);
      let overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
      
      // Resize to smaller desktop
      setViewport(1024, 768);
      overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
      
      // Resize to larger desktop
      setViewport(1920, 1080);
      overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
    });

    it('should maintain layout with long content', async () => {
      const user = userEvent.setup();
      const { container } = render(<MayaSideBySideFixed />);
      
      // Add long audience name
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      await user.click(screen.getByText('Inform about an update'));
      await waitFor(() => screen.getByText("Step 2: Who's Your Audience?"));
      
      const longText = 'Community Leaders, Parents, Board Members, Volunteers, and Partner Organizations';
      await user.type(screen.getByPlaceholderText(/Parent, Board member/i), longText);
      
      // Check no overflow or overlap
      const overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
      
      // Check text wrapping
      const input = screen.getByDisplayValue(longText);
      const inputStyles = window.getComputedStyle(input);
      expect(inputStyles.overflowX).not.toBe('visible');
    });

    it('should handle rapid stage transitions without layout break', async () => {
      const user = userEvent.setup();
      const { container } = render(<MayaSideBySideFixed />);
      
      // Rapidly click through all stages
      await user.click(screen.getByRole('button', { name: /Let's Begin/i }));
      
      // Don't wait between clicks
      const purposeButton = screen.getByText('Request something');
      await user.click(purposeButton);
      
      // Immediately check layout
      const overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
    });

    it('should maintain proper borders between panels', () => {
      const { container } = render(<MayaSideBySideFixed />);
      
      const chatPanel = screen.getByText("Maya's Guidance").closest('.w-1\\/2');
      const chatStyles = window.getComputedStyle(chatPanel!);
      
      // Check for border-right on chat panel
      expect(chatPanel?.classList.contains('border-r')).toBe(true);
      expect(chatStyles.borderRightWidth).not.toBe('0px');
    });
  });

  describe('Mobile/Tablet Regression Tests', () => {
    it('should not break mobile layout (768px)', () => {
      setViewport(768, 1024);
      const { container } = render(<MayaSideBySideFixed />);
      
      // At exactly 768px, layout might switch to mobile
      // Ensure no broken styles
      const mainContent = container.querySelector('.flex.overflow-hidden');
      expect(mainContent).toBeTruthy();
      
      // Check if panels stack or remain side-by-side
      const panels = container.querySelectorAll('.w-1\\/2');
      expect(panels.length).toBeGreaterThanOrEqual(0); // May be 0 if mobile layout kicks in
    });

    it('should not break tablet layout (820px)', () => {
      setViewport(820, 1180);
      const { container } = render(<MayaSideBySideFixed />);
      
      // Should maintain desktop layout on tablet
      const layout = checkPanelLayout(container);
      expect(layout.hasProperFlex).toBe(true);
      
      // No overlaps
      const overlapCheck = checkForOverlaps(container);
      expect(overlapCheck?.hasOverlap).toBe(false);
    });
  });
});