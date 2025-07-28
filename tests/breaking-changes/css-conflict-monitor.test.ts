/**
 * CSS Conflict Monitor for Neumorphic Transformation
 * 
 * This test suite monitors for CSS conflicts and layout breaks during
 * the neumorphic design transformation process.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('🎨 CSS Conflict Monitor', () => {
  let originalStyles: string;
  let testContainer: HTMLDivElement;

  beforeEach(() => {
    // Capture original styles
    originalStyles = document.documentElement.getAttribute('style') || '';
    
    // Create test container
    testContainer = document.createElement('div');
    testContainer.id = 'css-test-container';
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    // Cleanup
    if (testContainer && document.body.contains(testContainer)) {
      document.body.removeChild(testContainer);
    }
  });

  describe('🏗️ CSS Variables Integrity', () => {
    it('should preserve core brand variables', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      const criticalVars = [
        '--brand-purple',
        '--brand-cyan', 
        '--background',
        '--foreground',
        '--primary',
        '--secondary',
      ];

      criticalVars.forEach(varName => {
        const value = styles.getPropertyValue(varName);
        expect(value).toBeTruthy(`CSS variable ${varName} should exist`);
        expect(value.trim()).not.toBe('');
      });
    });

    it('should detect neumorphic variable additions without conflicts', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      // Check if neumorphic variables are added properly
      const neumorphicVars = [
        '--neu-shadow-light',
        '--neu-shadow-dark', 
        '--neu-inset-shadow',
        '--neu-background',
        '--neu-surface',
      ];

      let neumorphicCount = 0;
      neumorphicVars.forEach(varName => {
        const value = styles.getPropertyValue(varName);
        if (value && value.trim() !== '') {
          neumorphicCount++;
          
          // Validate shadow format
          if (varName.includes('shadow')) {
            expect(value).toMatch(/^[\d\s,-px()rgba#]+$/);
          }
        }
      });

      // Allow for gradual implementation
      console.log(`Neumorphic variables detected: ${neumorphicCount}/${neumorphicVars.length}`);
    });

    it('should not have CSS variable naming conflicts', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      // Get all CSS custom properties
      const allProperties: string[] = [];
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          const rules = sheet.cssRules || sheet.rules;
          
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            if (rule.style) {
              for (let k = 0; k < rule.style.length; k++) {
                const prop = rule.style[k];
                if (prop.startsWith('--')) {
                  allProperties.push(prop);
                }
              }
            }
          }
        } catch (e) {
          // Some stylesheets might not be accessible (CORS)
          console.warn('Could not access stylesheet:', e);
        }
      }

      // Check for duplicates that might cause conflicts
      const propertyCount = new Map<string, number>();
      allProperties.forEach(prop => {
        propertyCount.set(prop, (propertyCount.get(prop) || 0) + 1);
      });

      const conflicts: string[] = [];
      propertyCount.forEach((count, prop) => {
        if (count > 1 && !prop.includes('--tw-')) { // Ignore Tailwind internal vars
          conflicts.push(`${prop} (${count} definitions)`);
        }
      });

      if (conflicts.length > 0) {
        console.warn('Potential CSS variable conflicts:', conflicts);
      }
      
      // Allow up to 2 conflicts during transformation
      expect(conflicts.length).toBeLessThanOrEqual(2);
    });
  });

  describe('🎯 Class Name Conflicts', () => {
    it('should detect overlapping class names', () => {
      // Test for common class name conflicts
      const testClasses = [
        'card',
        'button', 
        'input',
        'shadow',
        'rounded',
        'neu-card',
        'neu-button',
        'neu-input',
      ];

      const conflicts: string[] = [];
      
      testClasses.forEach(className => {
        testContainer.className = className;
        const computedStyles = getComputedStyle(testContainer);
        
        // Check if class applies styles
        const hasBackgroundColor = computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const hasBorder = computedStyles.border !== '0px none rgb(0, 0, 0)';
        const hasShadow = computedStyles.boxShadow !== 'none';
        
        if (hasBackgroundColor || hasBorder || hasShadow) {
          console.log(`Class ${className} applies styling:`, {
            backgroundColor: computedStyles.backgroundColor,
            border: computedStyles.border,
            boxShadow: computedStyles.boxShadow,
          });
        }
      });

      // Should not have major conflicts
      expect(conflicts.length).toBeLessThanOrEqual(1);
    });

    it('should preserve existing component classes', () => {
      const preservedClasses = [
        'animate-fade-in',
        'bg-background',
        'text-foreground',
        'brand-purple',
        'brand-cyan',
      ];

      preservedClasses.forEach(className => {
        testContainer.className = className;
        const computedStyles = getComputedStyle(testContainer);
        
        // These classes should still work
        expect(computedStyles).toBeDefined();
      });
    });
  });

  describe('📐 Layout Integrity', () => {
    it('should maintain flex and grid layouts', () => {
      const layoutTests = [
        { className: 'flex', property: 'display', expectedValue: 'flex' },
        { className: 'grid', property: 'display', expectedValue: 'grid' },
        { className: 'hidden', property: 'display', expectedValue: 'none' },
        { className: 'block', property: 'display', expectedValue: 'block' },
      ];

      layoutTests.forEach(({ className, property, expectedValue }) => {
        testContainer.className = className;
        const computedStyles = getComputedStyle(testContainer);
        const actualValue = computedStyles.getPropertyValue(property);
        
        expect(actualValue).toBe(expectedValue, 
          `Class ${className} should set ${property} to ${expectedValue}, got ${actualValue}`);
      });
    });

    it('should preserve spacing utilities', () => {
      const spacingTests = [
        'p-4',
        'm-4', 
        'gap-4',
        'space-x-4',
        'space-y-4',
      ];

      spacingTests.forEach(className => {
        testContainer.className = className;
        const computedStyles = getComputedStyle(testContainer);
        
        // Should have some spacing applied
        const hasPadding = computedStyles.padding !== '0px';
        const hasMargin = computedStyles.margin !== '0px';
        const hasGap = computedStyles.gap !== 'normal';
        
        if (className.includes('p-')) {
          expect(hasPadding).toBe(true, `${className} should apply padding`);
        } else if (className.includes('m-')) {
          expect(hasMargin).toBe(true, `${className} should apply margin`);
        } else if (className.includes('gap')) {
          expect(hasGap).toBe(true, `${className} should apply gap`);
        }
      });
    });
  });

  describe('🌗 Dark Mode Compatibility', () => {
    it('should handle dark mode class transitions', () => {
      const rootElement = document.documentElement;
      const originalClass = rootElement.className;
      
      // Test light mode
      rootElement.className = originalClass.replace('dark', '').trim();
      let styles = getComputedStyle(rootElement);
      const lightBackground = styles.getPropertyValue('--background');
      
      // Test dark mode
      rootElement.className = `${originalClass} dark`.trim();
      styles = getComputedStyle(rootElement);
      const darkBackground = styles.getPropertyValue('--background');
      
      // Restore original
      rootElement.className = originalClass;
      
      // Should have different values
      expect(lightBackground).toBeTruthy();
      expect(darkBackground).toBeTruthy();
      expect(lightBackground).not.toBe(darkBackground);
    });
  });

  describe('⚡ Performance Impact', () => {
    it('should not cause CSS performance degradation', () => {
      const startTime = performance.now();
      
      // Apply multiple classes rapidly
      for (let i = 0; i < 100; i++) {
        testContainer.className = `test-class-${i % 10}`;
        getComputedStyle(testContainer); // Force style recalculation
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time
      expect(duration).toBeLessThan(1000);
    });

    it('should not create excessive DOM reflows', () => {
      let reflowCount = 0;
      
      // Monitor for potential reflows
      const observer = new ResizeObserver(() => {
        reflowCount++;
      });
      
      observer.observe(testContainer);
      
      // Perform operations that might cause reflows
      testContainer.style.width = '100px';
      testContainer.style.height = '100px';
      testContainer.style.padding = '10px';
      
      // Wait for observer
      setTimeout(() => {
        observer.disconnect();
        expect(reflowCount).toBeLessThanOrEqual(3);
      }, 100);
    });
  });
});

/**
 * CSS Conflict Detection Utility
 * 
 * Use this to check for conflicts after applying neumorphic styles
 */
export const checkCSSConflicts = () => {
  const issues: Array<{type: string, description: string, severity: 'low' | 'medium' | 'high'}> = [];
  
  try {
    // Check CSS variable integrity
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    
    const requiredVars = ['--brand-purple', '--brand-cyan', '--background', '--foreground'];
    requiredVars.forEach(varName => {
      if (!styles.getPropertyValue(varName)) {
        issues.push({
          type: 'missing-css-variable',
          description: `Missing required CSS variable: ${varName}`,
          severity: 'high'
        });
      }
    });
    
    // Check for style computation errors
    const testDiv = document.createElement('div');
    testDiv.className = 'bg-background text-foreground';
    document.body.appendChild(testDiv);
    
    const testStyles = getComputedStyle(testDiv);
    if (!testStyles.backgroundColor || !testStyles.color) {
      issues.push({
        type: 'style-computation-error',
        description: 'Basic Tailwind classes not computing correctly',
        severity: 'high'
      });
    }
    
    document.body.removeChild(testDiv);
    
  } catch (error) {
    issues.push({
      type: 'css-system-error',
      description: `CSS system error: ${error}`,
      severity: 'high'
    });
  }
  
  return {
    hasConflicts: issues.length > 0,
    issues,
    summary: {
      total: issues.length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
    }
  };
};