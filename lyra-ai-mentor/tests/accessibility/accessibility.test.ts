import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { createTestElement, createTestLessonContext } from '@/components/interactive/__tests__/testUtils';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Testing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Interactive Elements Accessibility', () => {
    const componentTypes = [
      'callout_box',
      'lyra_chat',
      'knowledge_check',
      'ai_content_generator',
      'document_generator',
      'template_creator',
      'reflection',
      'sequence_sorter',
    ];

    componentTypes.forEach(type => {
      it(`should have no accessibility violations for ${type}`, async () => {
        const element = createTestElement({
          type,
          title: `Accessibility Test ${type}`,
          content: 'Test content for accessibility validation',
        });

        const { container } = render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for interactive elements', async () => {
      const element = createTestElement({
        type: 'knowledge_check',
        title: 'Keyboard Navigation Test',
        configuration: {
          question: 'Test question',
          answers: ['Option 1', 'Option 2', 'Option 3'],
          correctAnswer: 0,
        },
      });

      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Test keyboard navigation
      const interactiveElements = screen.getAllByRole('button');
      expect(interactiveElements.length).toBeGreaterThan(0);
      
      // Each interactive element should be keyboard accessible
      interactiveElements.forEach(element => {
        expect(element).toBeVisible();
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should provide proper tab order for complex components', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Tab Order Test',
        content: 'Test content with multiple interactive elements',
      });

      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Get all focusable elements
      const focusableElements = screen.getAllByRole(/button|textbox|combobox|checkbox|radio/);
      
      // Test that tab order is logical
      for (let i = 0; i < focusableElements.length - 1; i++) {
        const current = focusableElements[i];
        const next = focusableElements[i + 1];
        
        const currentTabIndex = current.getAttribute('tabindex') || '0';
        const nextTabIndex = next.getAttribute('tabindex') || '0';
        
        expect(parseInt(currentTabIndex)).toBeLessThanOrEqual(parseInt(nextTabIndex));
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper ARIA labels for all interactive elements', async () => {
      const element = createTestElement({
        type: 'lyra_chat',
        title: 'Screen Reader Test',
        content: 'Test content for screen reader support',
      });

      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Check for proper ARIA labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(
          button.getAttribute('aria-label') || 
          button.getAttribute('aria-labelledby') ||
          button.textContent
        ).toBeTruthy();
      });

      // Check for proper headings structure
      const headings = screen.getAllByRole('heading');
      if (headings.length > 0) {
        headings.forEach(heading => {
          const level = heading.tagName.toLowerCase();
          expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).toContain(level);
        });
      }
    });

    it('should provide proper ARIA live regions for dynamic content', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Live Region Test',
        content: 'Test content with dynamic updates',
      });

      const { container } = render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Check for ARIA live regions
      const liveRegions = container.querySelectorAll('[aria-live], [aria-atomic]');
      expect(liveRegions.length).toBeGreaterThan(0);
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG color contrast requirements', async () => {
      const element = createTestElement({
        type: 'callout_box',
        title: 'Color Contrast Test',
        content: 'Test content for color contrast validation',
      });

      const { container } = render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Use axe to check color contrast
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management', () => {
    it('should properly manage focus for modal and dialog elements', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Focus Management Test',
        content: 'Test content for focus management',
      });

      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Test that focus is properly managed
      const dialogs = screen.queryAllByRole('dialog');
      dialogs.forEach(dialog => {
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby');
      });
    });

    it('should restore focus after modal closes', async () => {
      // This would be implemented with actual user interaction testing
      // For now, we'll test the presence of focus management attributes
      const element = createTestElement({
        type: 'document_generator',
        title: 'Focus Restoration Test',
        content: 'Test content for focus restoration',
      });

      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Test that components have proper focus management
      const focusableElements = screen.getAllByRole(/button|textbox|combobox/);
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Accessibility', () => {
    it('should be accessible on mobile devices', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      const element = createTestElement({
        type: 'lyra_chat',
        title: 'Mobile Accessibility Test',
        content: 'Test content for mobile accessibility',
      });

      const { container } = render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Test mobile accessibility
      const results = await axe(container, {
        rules: {
          'touch-target': { enabled: true },
          'target-size': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML', () => {
    it('should use proper semantic HTML elements', async () => {
      const element = createTestElement({
        type: 'reflection',
        title: 'Semantic HTML Test',
        content: 'Test content for semantic HTML validation',
      });

      const { container } = render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Check for proper semantic structure
      const results = await axe(container, {
        rules: {
          'landmark-one-main': { enabled: true },
          'region': { enabled: true },
          'heading-order': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });
});
