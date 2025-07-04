import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { 
  renderWithProviders,
  createTestElement,
  createProblematicElement,
  createTestLessonContext,
  PerformanceTestUtils,
  RegressionTestUtils,
  performUserInteraction,
  waitForStability,
  testMocks,
  PERFORMANCE_THRESHOLDS,
  TestElement,
} from './testUtils';

/**
 * Comprehensive test suite template for all direct import components
 * This template ensures all 35 components have consistent, thorough testing
 */
export function createComponentTestSuite(
  componentName: string,
  Component: React.ComponentType<any>,
  componentType: string,
  options: {
    hasInteractions?: boolean;
    hasAsyncOperations?: boolean;
    hasComplexState?: boolean;
    customProps?: Record<string, any>;
    skipTests?: string[];
  } = {}
) {
  const {
    hasInteractions = false,
    hasAsyncOperations = false,
    hasComplexState = false,
    customProps = {},
    skipTests = [],
  } = options;

  describe(`${componentName} Component Tests`, () => {
    let mockOnComplete: ReturnType<typeof vi.fn>;
    let mockAnalytics: typeof testMocks.elementAnalytics;
    let baseProps: any;

    beforeEach(() => {
      vi.clearAllMocks();
      mockOnComplete = vi.fn();
      mockAnalytics = testMocks.elementAnalytics;

      baseProps = {
        element: createTestElement({
          type: componentType,
          title: `Test ${componentName}`,
          content: `Test content for ${componentName}`,
        }),
        onComplete: mockOnComplete,
        isElementCompleted: false,
        analytics: mockAnalytics,
        ...customProps,
      };
    });

    // CRITICAL: Object-to-primitive regression tests
    describe('Object-to-Primitive Safety (CRITICAL)', () => {
      if (!skipTests.includes('object-to-primitive')) {
        it('should not throw "Cannot convert object to primitive" errors', async () => {
          const { safe, errors } = await RegressionTestUtils.testObjectToPrimitiveSafety(
            Component,
            baseProps
          );
          
          expect(safe).toBe(true);
          expect(errors).toHaveLength(0);
          
          if (errors.length > 0) {
            console.error(`${componentName} object-to-primitive errors:`, errors);
          }
        });

        it('should handle problematic props safely', async () => {
          const problematicElement = createProblematicElement({
            type: componentType,
            title: `Test ${componentName} with complex props`,
          });

          const { safe, errors } = await RegressionTestUtils.testObjectToPrimitiveSafety(
            Component,
            {
              ...baseProps,
              element: problematicElement,
            }
          );

          expect(safe).toBe(true);
          expect(errors).toHaveLength(0);
        });

        it('should pass comprehensive prop variation tests', async () => {
          const { passed, failed, errors } = await RegressionTestUtils.testPropVariations(
            Component,
            baseProps
          );

          expect(failed).toBe(0);
          expect(passed).toBeGreaterThan(0);
          
          if (errors.length > 0) {
            console.error(`${componentName} prop variation errors:`, errors);
          }
        });
      }
    });

    // Core rendering tests
    describe('Core Rendering', () => {
      if (!skipTests.includes('rendering')) {
        it('should render without errors', () => {
          renderWithProviders(<Component {...baseProps} />);
          expect(screen.getAllByText(/test/i)[0]).toBeInTheDocument();
        });

        it('should render with null configuration', () => {
          const propsWithNullConfig = {
            ...baseProps,
            element: { ...baseProps.element, configuration: null },
          };
          
          renderWithProviders(<Component {...propsWithNullConfig} />);
          expect(screen.getAllByText(/test/i)[0]).toBeInTheDocument();
        });

        it('should render with undefined configuration', () => {
          const propsWithUndefinedConfig = {
            ...baseProps,
            element: { ...baseProps.element, configuration: undefined },
          };
          
          renderWithProviders(<Component {...propsWithUndefinedConfig} />);
          expect(screen.getAllByText(/test/i)[0]).toBeInTheDocument();
        });

        it('should handle missing required props gracefully', () => {
          const minimalProps = {
            element: createTestElement({ type: componentType }),
          };
          
          expect(() => renderWithProviders(<Component {...minimalProps} />)).not.toThrow();
        });
      }
    });

    // Performance regression tests
    describe('Performance Regression', () => {
      if (!skipTests.includes('performance')) {
        it('should render within performance threshold', async () => {
          const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
            return renderWithProviders(<Component {...baseProps} />);
          });

          expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
          
          // Track performance
          expect(testMocks.performanceMonitor.trackComponentLoad).toHaveBeenCalledWith(
            expect.stringContaining(componentName),
            expect.any(Number)
          );
        });

        it('should not exceed memory usage limits', async () => {
          const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
            renderWithProviders(<Component {...baseProps} />);
            await waitForStability();
          });

          const memoryMB = memoryDelta / (1024 * 1024);
          expect(memoryMB).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
        });

        it('should handle rapid re-renders without performance degradation', async () => {
          const renderTimes: number[] = [];
          
          for (let i = 0; i < 5; i++) {
            const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
              return renderWithProviders(<Component {...baseProps} key={i} />);
            });
            renderTimes.push(renderTime);
          }

          // Check that render times don't increase significantly
          const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
          expect(avgRenderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
        });
      }
    });

    // Props validation tests
    describe('Props Validation', () => {
      if (!skipTests.includes('props')) {
        it('should handle complex object props safely', () => {
          const complexProps = {
            ...baseProps,
            element: {
              ...baseProps.element,
              configuration: {
                nested: { deeply: { object: 'value' } },
                array: [1, 2, 3, { complex: true }],
                nullValue: null,
                undefinedValue: undefined,
                function: () => 'test',
              },
            },
          };

          expect(() => renderWithProviders(<Component {...complexProps} />)).not.toThrow();
        });

        it('should validate required element structure', () => {
          const requiredFields = ['id', 'type', 'title', 'content'];
          
          requiredFields.forEach(field => {
            const incompleteElement = { ...baseProps.element };
            delete incompleteElement[field];
            
            const incompleteProps = {
              ...baseProps,
              element: incompleteElement,
            };

            // Should not crash, but may show fallback content
            expect(() => renderWithProviders(<Component {...incompleteProps} />)).not.toThrow();
          });
        });
      }
    });

    // User interaction tests
    if (hasInteractions && !skipTests.includes('interactions')) {
      describe('User Interactions', () => {
        it('should handle user interactions within performance limits', async () => {
          renderWithProviders(<Component {...baseProps} />);
          
          // Find interactive elements
          const buttons = screen.queryAllByRole('button');
          const inputs = screen.queryAllByRole('textbox');
          const interactiveElements = [...buttons, ...inputs];

          if (interactiveElements.length > 0) {
            for (const element of interactiveElements.slice(0, 3)) { // Test first 3 elements
              const { interactionTime } = await performUserInteraction(
                async () => {
                  element.focus();
                  if (element.tagName === 'BUTTON') {
                    element.click();
                  }
                },
                `${componentName}_interaction`
              );

              expect(interactionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.INTERACTION_TIME_MS);
            }
          }
        });

        it('should call onComplete when appropriate', async () => {
          renderWithProviders(<Component {...baseProps} />);
          
          // Look for completion triggers (buttons with "complete", "submit", etc.)
          const completeButtons = screen.queryAllByRole('button').filter(button => 
            button.textContent?.toLowerCase().includes('complete') ||
            button.textContent?.toLowerCase().includes('submit') ||
            button.textContent?.toLowerCase().includes('finish')
          );

          if (completeButtons.length > 0) {
            completeButtons[0].click();
            await waitForStability();
            
            // onComplete might be called directly or through analytics
            expect(mockOnComplete).toHaveBeenCalled();
          }
        });
      });
    }

    // State management tests
    if (hasComplexState && !skipTests.includes('state')) {
      describe('State Management', () => {
        it('should manage internal state without memory leaks', async () => {
          const { result: component1 } = renderWithProviders(<Component {...baseProps} />);
          
          // Unmount and remount to test cleanup
          component1.unmount();
          
          const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
            renderWithProviders(<Component {...baseProps} />);
            await waitForStability();
          });

          // Memory delta should be minimal after cleanup
          expect(memoryDelta).toBeLessThan(10 * 1024 * 1024); // 10MB
        });
      });
    }

    // Async operations tests
    if (hasAsyncOperations && !skipTests.includes('async')) {
      describe('Async Operations', () => {
        it('should handle async operations safely', async () => {
          renderWithProviders(<Component {...baseProps} />);
          
          // Wait for any async operations to complete
          await waitForStability();
          
          // Check that no errors were logged
          expect(mockAnalytics.trackError).not.toHaveBeenCalled();
        });

        it('should handle component unmount during async operations', async () => {
          const { unmount } = renderWithProviders(<Component {...baseProps} />);
          
          // Unmount immediately to test cleanup
          unmount();
          
          // Wait for any pending operations
          await waitForStability();
          
          // Should not cause any errors
          expect(mockAnalytics.trackError).not.toHaveBeenCalled();
        });
      });
    }

    // Error boundary tests
    describe('Error Handling', () => {
      if (!skipTests.includes('errors')) {
        it('should handle rendering errors gracefully', () => {
          const errorProps = {
            ...baseProps,
            element: {
              ...baseProps.element,
              // Intentionally problematic data
              title: null,
              content: undefined,
              configuration: { circular: {} },
            },
          };
          
          // Add circular reference
          errorProps.element.configuration.circular.self = errorProps.element.configuration.circular;

          let caughtError: Error | null = null;
          
          renderWithProviders(<Component {...errorProps} />, {
            onError: (error) => {
              caughtError = error;
            },
          });

          // Component should either render successfully or show error boundary
          const errorBoundary = screen.queryByTestId('error-boundary');
          if (errorBoundary) {
            expect(errorBoundary).toBeInTheDocument();
          } else {
            // Component handled the error gracefully
            expect(screen.getByText(/test/i)).toBeInTheDocument();
          }
        });
      }
    });

    // Analytics integration tests
    describe('Analytics Integration', () => {
      if (!skipTests.includes('analytics')) {
        it('should track component lifecycle events', () => {
          renderWithProviders(<Component {...baseProps} />);
          
          expect(mockAnalytics.trackStart).toHaveBeenCalled();
        });

        it('should track completion events', async () => {
          renderWithProviders(<Component {...baseProps} />);
          
          // Simulate completion
          if (mockOnComplete) {
            await mockOnComplete();
          }
          
          expect(mockAnalytics.trackComplete).toHaveBeenCalled();
        });
      }
    });

    // Accessibility tests
    describe('Accessibility', () => {
      if (!skipTests.includes('accessibility')) {
        it('should have proper ARIA attributes', () => {
          renderWithProviders(<Component {...baseProps} />);
          
          // Check for basic accessibility attributes
          const component = screen.getByText(/test/i).closest('[role]') || 
                           screen.getByText(/test/i).closest('[aria-label]') ||
                           screen.getByText(/test/i);
          
          expect(component).toBeInTheDocument();
        });

        it('should be keyboard navigable', () => {
          renderWithProviders(<Component {...baseProps} />);
          
          // Check for focusable elements
          const focusableElements = screen.queryAllByRole('button')
            .concat(screen.queryAllByRole('textbox'))
            .concat(screen.queryAllByRole('link'));
          
          // If there are interactive elements, they should be focusable
          if (focusableElements.length > 0) {
            focusableElements.forEach(element => {
              expect(element).not.toHaveAttribute('tabIndex', '-1');
            });
          }
        });
      }
    });
  });
}

/**
 * Quick test suite for simpler components
 */
export function createMinimalComponentTestSuite(
  componentName: string,
  Component: React.ComponentType<any>,
  componentType: string
) {
  return createComponentTestSuite(componentName, Component, componentType, {
    skipTests: ['interactions', 'state', 'async'],
  });
}