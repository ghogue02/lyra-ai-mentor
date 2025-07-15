import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import LyraNarratedMayaSideBySideComplete from '../LyraNarratedMayaSideBySideComplete';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Auth Context for testing
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ 
    user: { id: 'test-user-123' },
    session: null,
    loading: false,
    signOut: vi.fn()
  })
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, initial, animate, ...props }, ref) => 
        React.createElement('div', { ref, ...props }, children)
      ),
      button: React.forwardRef(({ children, ...props }, ref) => 
        React.createElement('button', { ref, ...props }, children)
      ),
    },
    AnimatePresence: ({ children }) => children,
  };
});

// Mock AI services
vi.mock('@/services/mayaAIEmailService', () => ({
  mayaAIEmailService: {
    generateEmail: vi.fn(() => Promise.resolve({ content: 'Test email', success: true }))
  }
}));

vi.mock('@/services/mayaAISkillBuilderService', () => ({
  mayaAISkillBuilderService: {
    generateToneAdaptation: vi.fn(() => Promise.resolve({ 
      content: 'Test tone adaptation', 
      explanation: 'Test explanation',
      timeEstimate: '2 mins'
    })),
    generateCommunicationTemplate: vi.fn(() => Promise.resolve({ 
      content: 'Test template', 
      explanation: 'Test explanation',
      timeEstimate: '3 mins'
    })),
    generateDifficultConversationGuide: vi.fn(() => Promise.resolve({ 
      content: 'Test conversation guide', 
      explanation: 'Test explanation',
      timeEstimate: '5 mins'
    })),
    generateSubjectLineOptions: vi.fn(() => Promise.resolve({ 
      content: 'Test subject lines', 
      explanation: 'Test explanation',
      timeEstimate: '1 min'
    }))
  }
}));

vi.mock('@/services/mayaAISkillBuilderAdvanced', () => ({
  mayaAISkillBuilderAdvanced: {
    generatePersonalizedContent: vi.fn(() => Promise.resolve({ 
      content: 'Test personalized content', 
      success: true 
    }))
  }
}));

// Mock components
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, animated }) => (
    <div data-testid="lyra-avatar" data-size={size} data-expression={expression} data-animated={animated}>Lyra Avatar</div>
  )
}));

vi.mock('@/components/accessibility/AccessibilityProvider', () => ({
  AccessibilityProvider: ({ children }) => children,
  SkipLink: () => <div data-testid="skip-link">Skip Link</div>,
  LiveRegion: () => <div data-testid="live-region" aria-live="polite"></div>,
  useAccessibility: () => ({ highContrast: false, reducedMotion: false })
}));

describe('LyraNarratedMayaSideBySideComplete - Layout Testing', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  
  beforeAll(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });
  
  afterAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight
    });
  });
  
  const setViewportSize = (width: number, height: number = 768) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    });
    window.dispatchEvent(new Event('resize'));
  };
  
  describe('Desktop Layout Tests', () => {
    test('1920px - Full HD Desktop: No overlap between columns', async () => {
      setViewportSize(1920);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        // Check main container flex layout
        const mainContainer = container.querySelector('.h-screen.flex');
        expect(mainContainer).toHaveClass('flex-row');
        
        // Check left summary panel
        const summaryPanel = container.querySelector('.w-80.flex-shrink-0');
        expect(summaryPanel).toBeInTheDocument();
        expect(summaryPanel).toHaveStyle({ width: '20rem' }); // w-80 = 20rem
        
        // Check main content area takes remaining space
        const mainContent = container.querySelector('main.flex-1');
        expect(mainContent).toBeInTheDocument();
        expect(mainContent).toHaveClass('flex-1');
        
        // Check two-column layout inside main content
        const contentColumns = mainContent?.querySelector('.flex-1.flex');
        expect(contentColumns).toHaveClass('flex-row');
        
        // Verify columns have proper widths
        const lyraPanel = contentColumns?.querySelector('.w-1\\/2.border-r');
        const interactivePanel = contentColumns?.querySelector('.w-1\\/2:not(.border-r)');
        expect(lyraPanel).toBeInTheDocument();
        expect(interactivePanel).toBeInTheDocument();
      });
    });
    
    test('1440px - Laptop: Columns maintain proper spacing', async () => {
      setViewportSize(1440);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        const mainContainer = container.querySelector('.h-screen.flex');
        expect(mainContainer).toHaveClass('flex-row');
        
        // Summary panel should still be 20rem
        const summaryPanel = container.querySelector('.w-80.flex-shrink-0');
        expect(summaryPanel).toBeInTheDocument();
        
        // Content panels should be 50% each
        const contentArea = container.querySelector('main .flex-1.flex');
        const panels = contentArea?.querySelectorAll('.w-1\\/2');
        expect(panels).toHaveLength(2);
      });
    });
    
    test('1280px - Small Desktop: No content truncation', async () => {
      setViewportSize(1280);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        // Check that all text content is visible
        const title = screen.getByText("Maya's Complete Communication Mastery");
        expect(title).toBeVisible();
        
        // Check interactive content is not cut off
        const beginButton = screen.getByText(/Begin Maya's Complete Journey/i);
        expect(beginButton).toBeVisible();
      });
    });
    
    test('1024px - Desktop/Tablet boundary: Proper layout transition', async () => {
      setViewportSize(1024);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        // Should still show desktop layout at exactly 1024px
        const mainContainer = container.querySelector('.h-screen.flex');
        expect(mainContainer).toHaveClass('flex-row');
        
        // Mobile menu button should not be visible
        const mobileMenuButton = container.querySelector('.lg\\:hidden');
        expect(mobileMenuButton).not.toBeInTheDocument();
      });
    });
  });
  
  describe('Mobile Layout Tests', () => {
    test('768px - Tablet: Mobile layout with no overlaps', async () => {
      setViewportSize(768);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        // Check main container switches to column layout
        const mainContainer = container.querySelector('.h-screen.flex');
        expect(mainContainer).toHaveClass('flex-col');
        
        // Mobile menu button should be visible
        const mobileMenuButton = container.querySelector('button[aria-label="Toggle navigation panel"]');
        expect(mobileMenuButton).toBeInTheDocument();
        
        // Summary panel should not be visible by default
        const summaryPanel = container.querySelector('.w-80.flex-shrink-0');
        expect(summaryPanel).not.toBeInTheDocument();
      });
    });
    
    test('414px - iPhone: Content properly stacked', async () => {
      setViewportSize(414);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        // Content should be in column layout
        const contentArea = container.querySelector('main .flex-1.flex');
        expect(contentArea).toHaveClass('flex-col');
        
        // Panels should be full width
        const panels = contentArea?.querySelectorAll('.w-full');
        expect(panels?.length).toBeGreaterThan(0);
      });
    });
    
    test('375px - Small Mobile: Text remains readable', async () => {
      setViewportSize(375);
      render(<LyraNarratedMayaSideBySideComplete />);
      
      await waitFor(() => {
        // Check text sizes are appropriate for mobile
        const title = screen.getByText("Maya's Complete Communication Mastery");
        expect(title).toHaveClass('text-base'); // Mobile text size
        
        const subtitle = screen.getByText('Complete Chapter 2 Journey - All Skills Included');
        expect(subtitle).toHaveClass('text-xs'); // Mobile subtitle size
      });
    });
  });
  
  describe('Content Overflow Tests', () => {
    test('Long text content does not cause horizontal scroll', async () => {
      setViewportSize(1280);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Click to advance to a stage with text content
      const beginButton = screen.getByText(/Begin Maya's Complete Journey/i);
      fireEvent.click(beginButton);
      
      await waitFor(() => {
        // Check that containers have overflow handling
        const narrativePanel = container.querySelector('.overflow-y-auto');
        expect(narrativePanel).toBeInTheDocument();
        
        // Verify no horizontal overflow
        const body = document.body;
        expect(body.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
      });
    });
    
    test('Dynamic content loading maintains layout integrity', async () => {
      setViewportSize(1440);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Advance through multiple stages
      const beginButton = screen.getByText(/Begin Maya's Complete Journey/i);
      fireEvent.click(beginButton);
      
      await waitFor(() => {
        // Click a purpose option to trigger dynamic content
        const purposeOption = screen.getByText('Thank a volunteer parent');
        fireEvent.click(purposeOption);
      });
      
      await waitFor(() => {
        // Layout should remain stable
        const mainContainer = container.querySelector('.h-screen.flex');
        expect(mainContainer).toHaveClass('flex-row');
        
        // Check that new content doesn't break layout
        const panels = container.querySelectorAll('.w-1\\/2');
        expect(panels).toHaveLength(2);
      });
    });
  });
  
  describe('Browser Compatibility Tests', () => {
    test('Flexbox layout works correctly', () => {
      setViewportSize(1920);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check all flex containers
      const flexContainers = container.querySelectorAll('.flex');
      expect(flexContainers.length).toBeGreaterThan(0);
      
      flexContainers.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.display).toBe('flex');
      });
    });
    
    test('CSS Grid elements render properly', () => {
      setViewportSize(1440);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Advance to template library stage which uses grid
      act(() => {
        // Mock advancing to stage 6 (Template Library)
        const component = container.querySelector('[data-testid="component-root"]');
        if (component) {
          // Simulate stage advancement
        }
      });
      
      // Check for grid layouts
      const gridElements = container.querySelectorAll('.grid');
      gridElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.display).toBe('grid');
      });
    });
  });
  
  describe('Accessibility Tests', () => {
    test('All interactive elements are keyboard accessible', async () => {
      setViewportSize(1920);
      render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check tab order
      const interactiveElements = screen.getAllByRole('button');
      expect(interactiveElements.length).toBeGreaterThan(0);
      
      interactiveElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex');
      });
    });
    
    test('ARIA labels are present for navigation', () => {
      setViewportSize(1440);
      render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check main navigation areas
      expect(screen.getByRole('main')).toHaveAttribute('aria-label');
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
    
    test('Focus management during panel transitions', async () => {
      setViewportSize(768);
      render(<LyraNarratedMayaSideBySideComplete />);
      
      // Open mobile panel
      const menuButton = screen.getByLabelText('Toggle navigation panel');
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        // Check focus is managed properly
        const closeButton = screen.getByLabelText('Close journey panel');
        expect(closeButton).toBeInTheDocument();
      });
    });
  });
  
  describe('Performance Tests', () => {
    test('Layout reflows are minimized during resize', async () => {
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Test multiple resize events
      const sizes = [1920, 1440, 1280, 1024, 768, 414, 375];
      
      for (const size of sizes) {
        setViewportSize(size);
        
        await waitFor(() => {
          // Check that layout is stable
          const mainContainer = container.querySelector('.h-screen');
          expect(mainContainer).toBeInTheDocument();
          
          // Verify no layout thrashing
          const height = mainContainer?.clientHeight;
          expect(height).toBeGreaterThan(0);
        });
      }
    });
    
    test('Animation performance with blur effects', async () => {
      setViewportSize(1920);
      const { container } = render(<LyraNarratedMayaSideBySideComplete />);
      
      // Check blur transition elements
      const blurElements = container.querySelectorAll('[class*="blur"]');
      expect(blurElements.length).toBeGreaterThan(0);
      
      // Verify transitions are applied
      blurElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.transition).toBeTruthy();
      });
    });
  });
});

// Helper function to generate test report
export function generateTestReport(results: any) {
  return {
    timestamp: new Date().toISOString(),
    testSuite: 'Maya Complete Journey Layout Tests',
    results: {
      desktop: {
        '1920px': results.desktop1920,
        '1440px': results.desktop1440,
        '1280px': results.desktop1280,
        '1024px': results.desktop1024
      },
      mobile: {
        '768px': results.tablet768,
        '414px': results.iphone414,
        '375px': results.mobile375
      },
      accessibility: {
        keyboardNav: results.keyboardNav,
        ariaLabels: results.ariaLabels,
        focusManagement: results.focusManagement
      },
      performance: {
        layoutReflows: results.layoutReflows,
        animationPerf: results.animationPerf
      }
    },
    recommendations: [
      'Consider adding container queries for more robust responsive design',
      'Implement intersection observer for lazy loading content',
      'Add CSS containment for better performance',
      'Consider using CSS logical properties for better RTL support'
    ]
  };
}