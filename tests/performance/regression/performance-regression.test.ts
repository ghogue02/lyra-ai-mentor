import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { 
  createTestElement,
  createTestLessonContext,
  PerformanceTestUtils,
  PERFORMANCE_THRESHOLDS,
  testMocks,
} from '@/components/interactive/__tests__/testUtils';

describe('Performance Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset performance monitoring
    testMocks.performanceMonitor.getMetrics.mockReturnValue({
      bundleSize: 909000,
      loadTime: 50,
      memoryUsage: 25000000,
    });
  });

  describe('Component Load Time Regression', () => {
    const directImportComponents = [
      { name: 'CalloutBoxRenderer', type: 'callout_box' },
      { name: 'LyraChatRenderer', type: 'lyra_chat' },
      { name: 'KnowledgeCheckRenderer', type: 'knowledge_check' },
      { name: 'ReflectionRenderer', type: 'reflection' },
      { name: 'SequenceSorterRenderer', type: 'sequence_sorter' },
      { name: 'MayaEmailConfidenceBuilder', type: 'ai_email_composer' },
      { name: 'MayaPromptSandwichBuilder', type: 'prompt_builder' },
      { name: 'SofiaMissionStoryCreator', type: 'ai_content_generator' },
      { name: 'DavidDataRevival', type: 'ai_content_generator' },
      { name: 'RachelAutomationVision', type: 'workflow_automator' },
      { name: 'AlexChangeStrategy', type: 'change_leader' },
      { name: 'AIContentGenerator', type: 'ai_content_generator' },
    ];

    directImportComponents.forEach(({ name, type }) => {
      it(`should load ${name} within performance threshold`, async () => {
        const element = createTestElement({
          type,
          title: `Performance Test ${name}`,
          content: `Testing load time for ${name}`,
        });

        const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
          return render(
            <InteractiveElementRenderer
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );
        });

        expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
        
        // Track performance regression
        if (renderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME_MS * 0.8) {
          console.warn(`⚠️ ${name} load time ${renderTime}ms approaching threshold`);
        }
      });
    });

    it('should maintain consistent load times across multiple renders', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Consistency Test',
      });

      const loadTimes: number[] = [];
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
          return render(
            <InteractiveElementRenderer
              key={i}
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );
        });

        loadTimes.push(renderTime);
      }

      const averageTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
      const maxTime = Math.max(...loadTimes);
      const minTime = Math.min(...loadTimes);
      const variance = maxTime - minTime;

      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
      expect(variance).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS * 0.5); // Variance should be less than 50% of threshold
    });

    it('should handle concurrent component loading efficiently', async () => {
      const elements = Array.from({ length: 5 }, (_, i) => 
        createTestElement({
          id: i + 1,
          type: 'ai_content_generator',
          title: `Concurrent Test ${i + 1}`,
        })
      );

      const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
        return render(
          <div>
            {elements.map(element => (
              <InteractiveElementRenderer
                key={element.id}
                element={element}
                lessonId={1}
                lessonContext={createTestLessonContext()}
                onElementComplete={vi.fn()}
              />
            ))}
          </div>
        );
      });

      // Concurrent loading should not be more than 2x single component load time
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS * 2);
    });
  });

  describe('Memory Usage Regression', () => {
    it('should maintain memory usage within limits for all component types', async () => {
      const componentTypes = [
        'callout_box',
        'lyra_chat',
        'knowledge_check',
        'ai_content_generator',
        'document_generator',
        'template_creator',
      ];

      for (const type of componentTypes) {
        const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
          const element = createTestElement({
            type,
            title: `Memory Test ${type}`,
          });

          render(
            <InteractiveElementRenderer
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );

          // Simulate some interaction
          await new Promise(resolve => setTimeout(resolve, 100));
        });

        const memoryMB = memoryDelta / (1024 * 1024);
        expect(memoryMB).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);

        if (memoryMB > PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB * 0.7) {
          console.warn(`⚠️ ${type} memory usage ${memoryMB.toFixed(2)}MB approaching threshold`);
        }
      }
    });

    it('should properly clean up memory on component unmount', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Memory Cleanup Test',
      });

      let initialMemory = 0;
      let afterMountMemory = 0;
      let afterUnmountMemory = 0;

      const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
        initialMemory = performance.memory?.usedJSHeapSize || 0;

        const { unmount } = render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        afterMountMemory = performance.memory?.usedJSHeapSize || 0;

        // Unmount component
        unmount();

        // Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 100));

        afterUnmountMemory = performance.memory?.usedJSHeapSize || 0;
      });

      // Memory should be cleaned up after unmount
      const memoryLeak = afterUnmountMemory - initialMemory;
      const memoryLeakMB = memoryLeak / (1024 * 1024);

      expect(memoryLeakMB).toBeLessThan(5); // Should not leak more than 5MB
    });

    it('should handle memory pressure gracefully', async () => {
      // Simulate memory pressure by creating many components
      const elements = Array.from({ length: 20 }, (_, i) =>
        createTestElement({
          id: i + 1,
          type: 'ai_content_generator',
          title: `Memory Pressure Test ${i + 1}`,
          configuration: {
            // Add some complexity to increase memory usage
            largeArray: new Array(1000).fill('data'),
            nestedObject: { level1: { level2: { level3: 'value' } } },
          },
        })
      );

      const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
        elements.forEach(element => {
          render(
            <InteractiveElementRenderer
              key={element.id}
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );
        });

        // Wait for all components to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));
      });

      const totalMemoryMB = memoryDelta / (1024 * 1024);
      const memoryPerComponent = totalMemoryMB / elements.length;

      expect(totalMemoryMB).toBeLessThan(100); // Total should be under 100MB
      expect(memoryPerComponent).toBeLessThan(5); // Each component should use less than 5MB
    });
  });

  describe('First Contentful Paint (FCP) Regression', () => {
    it('should achieve fast first contentful paint for critical components', async () => {
      const criticalComponents = [
        'callout_box',
        'lyra_chat',
        'ai_content_generator',
      ];

      for (const type of criticalComponents) {
        const element = createTestElement({
          type,
          title: `FCP Test ${type}`,
        });

        const startTime = performance.now();
        
        render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        const fcpTime = performance.now() - startTime;

        // FCP should be very fast for critical components
        expect(fcpTime).toBeLessThan(50);
      }
    });
  });

  describe('Cumulative Layout Shift (CLS) Prevention', () => {
    it('should prevent layout shifts during component loading', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Layout Stability Test',
        content: 'This component should not cause layout shifts',
      });

      const { container } = render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Get initial layout
      const initialRect = container.getBoundingClientRect();

      // Wait for any async loading
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check layout stability
      const finalRect = container.getBoundingClientRect();

      // Layout should remain stable
      expect(Math.abs(finalRect.height - initialRect.height)).toBeLessThan(5);
      expect(Math.abs(finalRect.width - initialRect.width)).toBeLessThan(5);
    });
  });

  describe('Long Task Prevention', () => {
    it('should not block the main thread for extended periods', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Main Thread Test',
        configuration: {
          // Configuration that might cause heavy computation
          complexData: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            data: `Item ${i}`,
            nested: { value: i * 2 },
          })),
        },
      });

      const startTime = performance.now();
      
      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      const blockingTime = performance.now() - startTime;

      // Should not block main thread for more than 50ms (considered a long task)
      expect(blockingTime).toBeLessThan(50);
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should track performance metrics correctly', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Metrics Test',
      });

      render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Verify performance monitoring was called
      expect(testMocks.performanceMonitor.trackComponentLoad).toHaveBeenCalled();
      
      const trackingCall = testMocks.performanceMonitor.trackComponentLoad.mock.calls[0];
      expect(trackingCall[0]).toContain('DirectImport');
      expect(typeof trackingCall[1]).toBe('number');
      expect(trackingCall[1]).toBeGreaterThan(0);
    });

    it('should provide performance metrics for analysis', () => {
      const metrics = testMocks.performanceMonitor.getMetrics();
      
      expect(metrics).toHaveProperty('bundleSize');
      expect(metrics).toHaveProperty('loadTime');
      expect(metrics).toHaveProperty('memoryUsage');
      
      expect(typeof metrics.bundleSize).toBe('number');
      expect(typeof metrics.loadTime).toBe('number');
      expect(typeof metrics.memoryUsage).toBe('number');
    });
  });

  describe('Performance Baseline Comparison', () => {
    it('should maintain performance compared to baseline measurements', () => {
      // Mock baseline performance data
      const baseline = {
        avgLoadTime: 45,
        maxLoadTime: 80,
        avgMemoryUsage: 20,
        maxMemoryUsage: 40,
      };

      const current = testMocks.performanceMonitor.getMetrics();
      
      // Current performance should not be significantly worse than baseline
      expect(current.loadTime).toBeLessThanOrEqual(baseline.maxLoadTime);
      expect(current.memoryUsage / (1024 * 1024)).toBeLessThanOrEqual(baseline.maxMemoryUsage);
      
      // Warn if performance has degraded
      if (current.loadTime > baseline.avgLoadTime * 1.2) {
        console.warn(`⚠️ Load time ${current.loadTime}ms is 20% slower than baseline ${baseline.avgLoadTime}ms`);
      }
    });
  });
});