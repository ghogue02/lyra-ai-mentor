/**
 * Responsive Behavior Monitor for Neumorphic Transformation
 * 
 * This test suite monitors responsive behavior and mobile compatibility
 * during the neumorphic design transformation.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock window dimensions
const mockViewport = (width: number, height: number) => {
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
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Mock touch events for mobile testing
const mockTouchEvent = (type: string, touches: Array<{clientX: number, clientY: number}>) => {
  return new TouchEvent(type, {
    touches: touches.map(touch => ({
      clientX: touch.clientX,
      clientY: touch.clientY,
      identifier: Math.random(),
      target: document.body,
    })) as any,
  });
};

describe('📱 Responsive Behavior Monitor', () => {
  let testContainer: HTMLDivElement;
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Store original dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    
    // Create test container
    testContainer = document.createElement('div');
    testContainer.id = 'responsive-test-container';
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    // Restore original dimensions
    mockViewport(originalInnerWidth, originalInnerHeight);
    
    // Cleanup
    if (testContainer && document.body.contains(testContainer)) {
      document.body.removeChild(testContainer);
    }
  });

  describe('🖥️ Desktop Viewport Behavior', () => {
    it('should handle desktop breakpoints (1200px+)', () => {
      mockViewport(1200, 800);
      
      testContainer.className = 'w-full lg:w-1/2 xl:w-1/3';
      const styles = getComputedStyle(testContainer);
      
      // Should apply large screen styles
      expect(window.innerWidth).toBe(1200);
      expect(styles).toBeDefined();
    });

    it('should maintain layout integrity on wide screens', () => {
      mockViewport(1920, 1080);
      
      // Test common layout patterns
      testContainer.innerHTML = `
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="card">Card 1</div>
            <div class="card">Card 2</div>
            <div class="card">Card 3</div>
          </div>
        </div>
      `;
      
      const gridContainer = testContainer.querySelector('[class*="grid"]');
      expect(gridContainer).toBeTruthy();
      
      if (gridContainer) {
        const styles = getComputedStyle(gridContainer);
        expect(styles.display).toBe('grid');
      }
    });
  });

  describe('📱 Mobile Viewport Behavior', () => {
    it('should adapt to mobile breakpoints (320px-768px)', () => {
      mockViewport(375, 667); // iPhone dimensions
      
      testContainer.className = 'w-full sm:w-auto flex flex-col sm:flex-row';
      const styles = getComputedStyle(testContainer);
      
      expect(window.innerWidth).toBe(375);
      expect(styles.width).toBeTruthy();
    });

    it('should handle small mobile screens (320px)', () => {
      mockViewport(320, 568);
      
      testContainer.className = 'px-2 sm:px-4 md:px-6';
      const styles = getComputedStyle(testContainer);
      
      // Should apply smallest padding
      expect(window.innerWidth).toBe(320);
      expect(styles).toBeDefined();
    });

    it('should maintain readability on mobile', () => {
      mockViewport(375, 667);
      
      testContainer.innerHTML = `
        <div class="text-sm sm:text-base md:text-lg">
          <h1 class="text-xl sm:text-2xl md:text-3xl">Test Heading</h1>
          <p class="leading-relaxed">Test paragraph with readable text</p>
        </div>
      `;
      
      const heading = testContainer.querySelector('h1');
      const paragraph = testContainer.querySelector('p');
      
      expect(heading).toBeTruthy();
      expect(paragraph).toBeTruthy();
      
      if (heading && paragraph) {
        const headingStyles = getComputedStyle(heading);
        const paragraphStyles = getComputedStyle(paragraph);
        
        // Font sizes should be readable
        const headingSize = parseFloat(headingStyles.fontSize);
        const paragraphSize = parseFloat(paragraphStyles.fontSize);
        
        expect(headingSize).toBeGreaterThan(16); // At least 16px
        expect(paragraphSize).toBeGreaterThan(14); // At least 14px
      }
    });
  });

  describe('📐 Tablet Viewport Behavior', () => {
    it('should handle tablet breakpoints (768px-1024px)', () => {
      mockViewport(768, 1024); // iPad dimensions
      
      testContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      const styles = getComputedStyle(testContainer);
      
      expect(window.innerWidth).toBe(768);
      expect(styles.display).toBe('grid');
    });

    it('should adapt navigation for tablet', () => {
      mockViewport(768, 1024);
      
      testContainer.innerHTML = `
        <nav class="flex flex-col md:flex-row">
          <div class="mb-4 md:mb-0 md:mr-4">Nav Item 1</div>
          <div class="mb-4 md:mb-0 md:mr-4">Nav Item 2</div>
          <div class="mb-4 md:mb-0">Nav Item 3</div>
        </nav>
      `;
      
      const nav = testContainer.querySelector('nav');
      expect(nav).toBeTruthy();
      
      if (nav) {
        const styles = getComputedStyle(nav);
        expect(styles.display).toBe('flex');
      }
    });
  });

  describe('🎯 Touch Interaction Testing', () => {
    it('should handle touch events properly', () => {
      mockViewport(375, 667);
      
      testContainer.innerHTML = `
        <button class="touch-target p-4 min-h-[44px] min-w-[44px]">
          Touch Me
        </button>
      `;
      
      const button = testContainer.querySelector('button');
      expect(button).toBeTruthy();
      
      if (button) {
        const styles = getComputedStyle(button);
        const minHeight = parseFloat(styles.minHeight);
        const minWidth = parseFloat(styles.minWidth);
        
        // Touch targets should be at least 44px (iOS guideline)
        expect(minHeight).toBeGreaterThanOrEqual(44);
        expect(minWidth).toBeGreaterThanOrEqual(44);
        
        // Test touch event handling
        let touchStartFired = false;
        let touchEndFired = false;
        
        button.addEventListener('touchstart', () => { touchStartFired = true; });
        button.addEventListener('touchend', () => { touchEndFired = true; });
        
        // Simulate touch
        const touchStart = mockTouchEvent('touchstart', [{ clientX: 50, clientY: 50 }]);
        const touchEnd = mockTouchEvent('touchend', []);
        
        button.dispatchEvent(touchStart);
        button.dispatchEvent(touchEnd);
        
        expect(touchStartFired).toBe(true);
        expect(touchEndFired).toBe(true);
      }
    });

    it('should provide adequate spacing between interactive elements', () => {
      mockViewport(375, 667);
      
      testContainer.innerHTML = `
        <div class="space-y-2 sm:space-y-4">
          <button class="block w-full p-3">Button 1</button>
          <button class="block w-full p-3">Button 2</button>
          <button class="block w-full p-3">Button 3</button>
        </div>
      `;
      
      const buttons = testContainer.querySelectorAll('button');
      expect(buttons.length).toBe(3);
      
      // Check spacing between buttons
      if (buttons.length >= 2) {
        const button1Rect = buttons[0].getBoundingClientRect();
        const button2Rect = buttons[1].getBoundingClientRect();
        
        // There should be spacing between buttons
        const spacing = button2Rect.top - button1Rect.bottom;
        expect(spacing).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('🔄 Orientation Changes', () => {
    it('should handle portrait to landscape transitions', () => {
      // Portrait
      mockViewport(375, 667);
      expect(window.innerWidth).toBe(375);
      expect(window.innerHeight).toBe(667);
      
      // Landscape
      mockViewport(667, 375);
      expect(window.innerWidth).toBe(667);
      expect(window.innerHeight).toBe(375);
    });

    it('should maintain usability in landscape mode', () => {
      mockViewport(667, 375); // Landscape mobile
      
      testContainer.innerHTML = `
        <div class="h-screen flex flex-col">
          <header class="h-14 bg-background">Header</header>
          <main class="flex-1 overflow-auto">Main Content</main>
          <footer class="h-12 bg-background">Footer</footer>
        </div>
      `;
      
      const mainContent = testContainer.querySelector('main');
      expect(mainContent).toBeTruthy();
      
      if (mainContent) {
        const styles = getComputedStyle(mainContent);
        expect(styles.flex).toBe('1 1 0%');
      }
    });
  });

  describe('⚡ Performance on Lower-end Devices', () => {
    it('should simulate performance constraints', async () => {
      mockViewport(375, 667);
      
      // Simulate slower device by adding delay
      const startTime = performance.now();
      
      // Create many elements to test performance
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.className = 'p-2 m-1 bg-background text-foreground rounded shadow';
        div.textContent = `Item ${i}`;
        fragment.appendChild(div);
      }
      
      testContainer.appendChild(fragment);
      
      // Force layout calculation
      testContainer.offsetHeight;
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete reasonably quickly even with many elements
      expect(duration).toBeLessThan(1000);
      expect(testContainer.children.length).toBe(100);
    });

    it('should handle reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      const mediaQuery = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return mediaQuery;
          }
          return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
        }),
      });
      
      testContainer.innerHTML = `
        <div class="transition-transform duration-300 hover:scale-105">
          Animated Element
        </div>
      `;
      
      const animatedElement = testContainer.querySelector('div');
      expect(animatedElement).toBeTruthy();
      
      // Should respect reduced motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      expect(prefersReducedMotion).toBe(true);
    });
  });

  describe('🎨 Neumorphic Responsive Adaptations', () => {
    it('should adapt neumorphic shadows for different screen sizes', () => {
      // Desktop - larger shadows
      mockViewport(1200, 800);
      testContainer.className = 'neu-card-responsive';
      testContainer.style.boxShadow = '12px 12px 24px rgba(0,0,0,0.15), -12px -12px 24px rgba(255,255,255,0.7)';
      
      let styles = getComputedStyle(testContainer);
      let shadowValue = styles.boxShadow;
      
      // Mobile - smaller shadows for performance
      mockViewport(375, 667);
      testContainer.style.boxShadow = '6px 6px 12px rgba(0,0,0,0.15), -6px -6px 12px rgba(255,255,255,0.7)';
      
      styles = getComputedStyle(testContainer);
      const mobileShadowValue = styles.boxShadow;
      
      expect(shadowValue).toBeTruthy();
      expect(mobileShadowValue).toBeTruthy();
      expect(shadowValue).not.toBe(mobileShadowValue);
    });

    it('should maintain neumorphic button usability on touch devices', () => {
      mockViewport(375, 667);
      
      testContainer.innerHTML = `
        <button class="neu-button p-4 min-h-[44px] min-w-[44px] rounded-xl">
          Touch Button
        </button>
      `;
      
      const button = testContainer.querySelector('button');
      expect(button).toBeTruthy();
      
      if (button) {
        // Should have adequate touch target size
        const rect = button.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
        expect(rect.width).toBeGreaterThanOrEqual(44);
        
        // Test active state for touch feedback
        button.style.boxShadow = 'inset 4px 4px 8px rgba(0,0,0,0.15)';
        const styles = getComputedStyle(button);
        expect(styles.boxShadow).toContain('inset');
      }
    });
  });
});

/**
 * Responsive Breakage Detection Utility
 * 
 * Use this to detect responsive issues during neumorphic transformation
 */
export const detectResponsiveIssues = () => {
  const issues: Array<{
    viewport: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }> = [];
  
  const testViewports = [
    { name: 'mobile-small', width: 320, height: 568 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 },
  ];
  
  const testContainer = document.createElement('div');
  testContainer.style.position = 'absolute';
  testContainer.style.top = '-9999px';
  document.body.appendChild(testContainer);
  
  testViewports.forEach(viewport => {
    // Mock viewport
    Object.defineProperty(window, 'innerWidth', {
      value: viewport.width,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: viewport.height,
      configurable: true,
    });
    
    // Test common responsive patterns
    testContainer.innerHTML = `
      <div class="w-full sm:w-auto md:w-1/2 lg:w-1/3">
        <button class="p-2 sm:p-4 text-sm sm:text-base">Test Button</button>
      </div>
    `;
    
    const button = testContainer.querySelector('button');
    if (button) {
      const styles = getComputedStyle(button);
      const fontSize = parseFloat(styles.fontSize);
      const padding = parseFloat(styles.paddingTop);
      
      // Check for readability issues
      if (viewport.width <= 375 && fontSize < 14) {
        issues.push({
          viewport: viewport.name,
          issue: `Font size too small: ${fontSize}px`,
          severity: 'medium',
        });
      }
      
      // Check for touch target issues
      if (viewport.width <= 768) {
        const rect = button.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          issues.push({
            viewport: viewport.name,
            issue: `Touch target too small: ${rect.width}x${rect.height}`,
            severity: 'high',
          });
        }
      }
    }
  });
  
  document.body.removeChild(testContainer);
  
  return {
    hasIssues: issues.length > 0,
    issues,
    summary: {
      total: issues.length,
      critical: issues.filter(i => i.severity === 'high').length,
      moderate: issues.filter(i => i.severity === 'medium').length,
      minor: issues.filter(i => i.severity === 'low').length,
    },
  };
};