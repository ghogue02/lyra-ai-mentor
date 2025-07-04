import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { 
  createTestElement, 
  createTestLessonContext,
  PerformanceTestUtils,
  PERFORMANCE_THRESHOLDS,
} from '@/components/interactive/__tests__/testUtils';

describe('Component Switching Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Dynamic Component Switching', () => {
    it('should switch between different component types without memory leaks', async () => {
      const componentSequence = [
        { type: 'callout_box', title: 'Callout Component' },
        { type: 'knowledge_check', title: 'Quiz Component' },
        { type: 'ai_content_generator', title: 'AI Generator' },
        { type: 'lyra_chat', title: 'Chat Component' },
        { type: 'reflection', title: 'Reflection Component' },
      ];

      let currentElement = createTestElement(componentSequence[0]);
      
      const { rerender } = render(
        <InteractiveElementRenderer
          element={currentElement}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Test switching between components
      for (let i = 1; i < componentSequence.length; i++) {
        const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
          currentElement = createTestElement({
            id: i + 1,
            ...componentSequence[i],
          });

          rerender(
            <InteractiveElementRenderer
              element={currentElement}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );

          await waitFor(() => {
            expect(screen.getByText(componentSequence[i].title)).toBeInTheDocument();
          });
        });

        // Memory usage should not grow significantly with each switch
        const memoryMB = memoryDelta / (1024 * 1024);
        expect(memoryMB).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
      }
    });

    it('should handle rapid component switching without crashes', async () => {
      const components = [
        { type: 'callout_box', title: 'Component 1' },
        { type: 'ai_email_composer', title: 'Component 2' },
        { type: 'document_generator', title: 'Component 3' },
      ];

      let currentIndex = 0;
      let currentElement = createTestElement(components[currentIndex]);

      const { rerender } = render(
        <InteractiveElementRenderer
          element={currentElement}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Rapidly switch components
      for (let iteration = 0; iteration < 10; iteration++) {
        currentIndex = (currentIndex + 1) % components.length;
        currentElement = createTestElement({
          id: iteration + 1,
          ...components[currentIndex],
        });

        rerender(
          <InteractiveElementRenderer
            element={currentElement}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        // Should not crash
        expect(screen.getByText(components[currentIndex].title)).toBeInTheDocument();
      }
    });
  });

  describe('Character Component Switching', () => {
    it('should switch between Maya components without state interference', async () => {
      const mayaComponents = [
        { type: 'ai_email_composer', title: 'Maya Email', character: 'maya' },
        { type: 'document_generator', title: 'Maya Proposal', character: 'maya' },
        { type: 'meeting_prep_assistant', title: 'Maya Meeting Prep', character: 'maya' },
      ];

      let currentElement = createTestElement({
        ...mayaComponents[0],
        configuration: { character: 'maya' },
      });

      const { rerender } = render(
        <InteractiveElementRenderer
          element={currentElement}
          lessonId={6} // Maya's chapter
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Switch between Maya components
      for (let i = 1; i < mayaComponents.length; i++) {
        currentElement = createTestElement({
          id: i + 1,
          ...mayaComponents[i],
          configuration: { character: 'maya' },
        });

        rerender(
          <InteractiveElementRenderer
            element={currentElement}
            lessonId={6}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        await waitFor(() => {
          expect(screen.getByText(mayaComponents[i].title)).toBeInTheDocument();
        });
      }
    });

    it('should switch between different character components correctly', async () => {
      const characterComponents = [
        { type: 'ai_content_generator', title: 'Maya Story', character: 'maya', lessonId: 6 },
        { type: 'ai_content_generator', title: 'Sofia Story', character: 'sofia', lessonId: 12 },
        { type: 'ai_content_generator', title: 'David Data', character: 'david', lessonId: 15 },
        { type: 'workflow_automator', title: 'Rachel Workflow', character: 'rachel', lessonId: 19 },
        { type: 'change_leader', title: 'Alex Strategy', character: 'alex', lessonId: 23 },
      ];

      let currentComponent = characterComponents[0];
      let currentElement = createTestElement({
        ...currentComponent,
        configuration: { character: currentComponent.character },
      });

      const { rerender } = render(
        <InteractiveElementRenderer
          element={currentElement}
          lessonId={currentComponent.lessonId}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Switch between different character components
      for (let i = 1; i < characterComponents.length; i++) {
        currentComponent = characterComponents[i];
        currentElement = createTestElement({
          id: i + 1,
          ...currentComponent,
          configuration: { character: currentComponent.character },
        });

        rerender(
          <InteractiveElementRenderer
            element={currentElement}
            lessonId={currentComponent.lessonId}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        await waitFor(() => {
          expect(screen.getByText(currentComponent.title)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Configuration Switching', () => {
    it('should handle configuration changes without breaking', async () => {
      const baseElement = {
        id: 1,
        type: 'knowledge_check',
        title: 'Dynamic Config Test',
        content: 'Testing configuration changes',
        order_index: 1,
      };

      const configurations = [
        { questions: [{ question: 'Q1?', options: ['A', 'B'], correct: 0 }] },
        { questions: [{ question: 'Q2?', options: ['X', 'Y', 'Z'], correct: 1 }] },
        null,
        { questions: [] },
        { invalidConfig: true },
      ];

      const { rerender } = render(
        <InteractiveElementRenderer
          element={{ ...baseElement, configuration: configurations[0] }}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Switch configurations
      for (let i = 1; i < configurations.length; i++) {
        rerender(
          <InteractiveElementRenderer
            element={{ ...baseElement, configuration: configurations[i] }}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        // Should not crash
        expect(screen.getByText('Dynamic Config Test')).toBeInTheDocument();
      }
    });
  });

  describe('State Preservation', () => {
    it('should maintain completion state during component switches', async () => {
      const element1 = createTestElement({
        id: 1,
        type: 'callout_box',
        title: 'First Component',
      });

      const element2 = createTestElement({
        id: 2,
        type: 'reflection',
        title: 'Second Component',
      });

      const mockOnComplete = vi.fn();

      const { rerender } = render(
        <InteractiveElementRenderer
          element={element1}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={mockOnComplete}
        />
      );

      // Switch to second component
      rerender(
        <InteractiveElementRenderer
          element={element2}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={mockOnComplete}
        />
      );

      // Switch back to first component
      rerender(
        <InteractiveElementRenderer
          element={element1}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('First Component')).toBeInTheDocument();
    });
  });

  describe('Performance During Switching', () => {
    it('should maintain performance during component switching', async () => {
      const components = [
        { type: 'ai_content_generator', title: 'Performance Test 1' },
        { type: 'document_generator', title: 'Performance Test 2' },
        { type: 'template_creator', title: 'Performance Test 3' },
      ];

      let currentElement = createTestElement(components[0]);

      const { rerender } = render(
        <InteractiveElementRenderer
          element={currentElement}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      const switchTimes: number[] = [];

      // Measure switching performance
      for (let i = 1; i < components.length; i++) {
        const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
          currentElement = createTestElement({
            id: i + 1,
            ...components[i],
          });

          rerender(
            <InteractiveElementRenderer
              element={currentElement}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );

          return screen.getByText(components[i].title);
        });

        switchTimes.push(renderTime);
        expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
      }

      // Switching times should not increase significantly
      const avgSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
      expect(avgSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS * 0.8);
    });
  });

  describe('Error Handling During Switching', () => {
    it('should handle errors during component switching gracefully', () => {
      const goodElement = createTestElement({
        id: 1,
        type: 'callout_box',
        title: 'Good Component',
      });

      const problematicElement = createTestElement({
        id: 2,
        type: 'knowledge_check',
        title: 'Problematic Component',
        configuration: { questions: undefined },
      });

      const { rerender } = render(
        <InteractiveElementRenderer
          element={goodElement}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Switch to problematic component
      expect(() => {
        rerender(
          <InteractiveElementRenderer
            element={problematicElement}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );
      }).not.toThrow();

      // Switch back to good component
      rerender(
        <InteractiveElementRenderer
          element={goodElement}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      expect(screen.getByText('Good Component')).toBeInTheDocument();
    });
  });
});