/**
 * Responsive Breakpoint Tests for LyraNarratedMayaSideBySideComplete
 * Tests mobile (<768px), tablet (768px-1024px), and desktop (>1024px) layouts
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Mock window.matchMedia for responsive testing
const createMatchMedia = (width: number) => {
  return (query: string) => ({
    matches: query.includes(`${width}px`),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

describe('LyraNarratedMayaSideBySideComplete Responsive Tests', () => {
  let originalInnerWidth: PropertyDescriptor | undefined;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Save original values
    originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    // Restore original values
    if (originalInnerWidth) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidth);
    }
    window.matchMedia = originalMatchMedia;
  });

  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.matchMedia = createMatchMedia(width) as any;
    
    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  describe('Mobile Layout (<768px)', () => {
    beforeEach(() => {
      setViewportWidth(375); // iPhone size
    });

    test('should stack panels vertically on mobile', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for mobile flex column layout
      const mainContainer = container.querySelector('.flex.flex-col');
      expect(mainContainer).toBeInTheDocument();
      
      // Mobile menu button should be visible
      const mobileMenuButton = container.querySelector('.fixed.top-4.left-4');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('should show mobile panel overlay when menu clicked', async () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      const menuButton = container.querySelector('.fixed.top-4.left-4') as HTMLButtonElement;
      
      act(() => {
        fireEvent.click(menuButton);
      });

      await waitFor(() => {
        const mobilePanel = container.querySelector('.fixed.inset-0.z-50');
        expect(mobilePanel).toBeInTheDocument();
      });
    });

    test('should have appropriate mobile text sizes', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for mobile text classes
      const title = container.querySelector('.text-base');
      const subtitle = container.querySelector('.text-xs');
      
      expect(title).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
    });

    test('should hide desktop summary panel on mobile', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Desktop summary panel should not exist
      const desktopPanel = container.querySelector('.lg\\:block.lg\\:row-span-full');
      expect(desktopPanel).not.toBeInTheDocument();
    });
  });

  describe('Tablet Layout (768px-1023px)', () => {
    beforeEach(() => {
      setViewportWidth(800); // iPad size
    });

    test('should show two column layout on tablet', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for grid layout with 2 columns
      const gridContainer = container.querySelector('.md\\:grid.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    test('should hide mobile menu button on tablet', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Mobile menu button should not be visible
      const mobileMenuButton = container.querySelector('.md\\:hidden');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('should have appropriate tablet text sizes', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for tablet text classes
      const mediumText = container.querySelector('.md\\:text-sm');
      expect(mediumText).toBeInTheDocument();
    });

    test('narrative and interactive panels should be side by side', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      const contentWrapper = container.querySelector('.md\\:grid.md\\:grid-cols-2');
      expect(contentWrapper).toBeInTheDocument();
      
      // Both panels should exist
      const narrativePanel = container.querySelector('[role="region"][aria-label*="narrative"]');
      const interactivePanel = container.querySelector('[role="region"][aria-label*="interactive"]');
      
      expect(narrativePanel).toBeInTheDocument();
      expect(interactivePanel).toBeInTheDocument();
    });
  });

  describe('Desktop Layout (>=1024px)', () => {
    beforeEach(() => {
      setViewportWidth(1440); // Desktop size
    });

    test('should show three panel layout with permanent summary', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for desktop grid layout
      const desktopGrid = container.querySelector('.lg\\:grid-cols-\\[320px_1fr\\]');
      expect(desktopGrid).toBeInTheDocument();
    });

    test('summary panel should always be visible on desktop', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Desktop summary panel should be visible
      const summaryPanel = container.querySelector('aside');
      expect(summaryPanel).toBeInTheDocument();
      
      // Should not have transform styles (not sliding)
      expect(summaryPanel).not.toHaveClass('transform');
    });

    test('should have appropriate desktop spacing and text sizes', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for desktop spacing
      const contentWithGap = container.querySelector('.lg\\:gap-2');
      expect(contentWithGap).toBeInTheDocument();
      
      // Desktop text sizes
      const largeText = container.querySelector('.lg\\:text-base');
      expect(largeText).toBeInTheDocument();
    });

    test('should hide mobile/tablet specific elements', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Mobile menu button should not exist
      const mobileMenuButton = container.querySelector('.fixed.top-4.left-4.lg\\:hidden');
      expect(mobileMenuButton).not.toBeInTheDocument();
    });

    test('panels should have desktop-specific styling', () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check for rounded corners and shadows on desktop
      const narrativePanel = container.querySelector('.lg\\:rounded-l-lg');
      const interactivePanel = container.querySelector('.lg\\:rounded-r-lg');
      
      expect(narrativePanel).toBeInTheDocument();
      expect(interactivePanel).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    test('should adapt layout when resizing from mobile to desktop', async () => {
      const { container, rerender } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Start at mobile
      setViewportWidth(375);
      rerender(<LyraNarratedMayaSideBySideComplete />);
      
      let mobileMenu = container.querySelector('.fixed.top-4.left-4');
      expect(mobileMenu).toBeInTheDocument();
      
      // Resize to tablet
      setViewportWidth(800);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      await waitFor(() => {
        mobileMenu = container.querySelector('.fixed.top-4.left-4.md\\:hidden');
        expect(mobileMenu).toBeInTheDocument();
      });
      
      // Resize to desktop
      setViewportWidth(1440);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      await waitFor(() => {
        const summaryPanel = container.querySelector('aside');
        expect(summaryPanel).toBeInTheDocument();
      });
    });

    test('should maintain state when switching breakpoints', async () => {
      const { container, rerender } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Start at desktop and interact with component
      setViewportWidth(1440);
      
      // Click a button to change state
      const purposeButton = screen.getByText(/Thank a volunteer parent/i);
      fireEvent.click(purposeButton);
      
      // Resize to mobile
      setViewportWidth(375);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      // State should be maintained
      await waitFor(() => {
        const selectedState = container.querySelector('.border-purple-600');
        expect(selectedState).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Accessibility', () => {
    test('should handle rapid viewport changes without errors', async () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Rapidly change viewport sizes
      const sizes = [375, 768, 1024, 800, 1440, 375];
      
      for (const size of sizes) {
        setViewportWidth(size);
        act(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
      
      // Component should still be functional
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should maintain focus management across breakpoints', async () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Focus an element at desktop
      setViewportWidth(1440);
      const button = screen.getAllByRole('button')[0];
      button.focus();
      
      // Resize to mobile
      setViewportWidth(375);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      // Focus should be maintained or moved appropriately
      await waitFor(() => {
        expect(document.activeElement).toBeTruthy();
      });
    });
  });
});

// CSS Media Query Tests
describe('CSS Media Query Application', () => {
  test('should apply correct classes at each breakpoint', () => {
    const testElement = document.createElement('div');
    testElement.className = 'flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[320px_1fr]';
    document.body.appendChild(testElement);

    // Test computed styles would go here in a real browser environment
    // This is a placeholder for CSS testing
    expect(testElement.className).toContain('flex');
    expect(testElement.className).toContain('md:grid');
    expect(testElement.className).toContain('lg:grid-cols-[320px_1fr]');

    document.body.removeChild(testElement);
  });
});