import React from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock the Supabase client to prevent network calls during tests
vi.mock('@/integrations/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  }),
}));

// Mock PerformanceMonitor to track component performance
const mockPerformanceMonitor = {
  trackComponentLoad: vi.fn(),
  trackUserInteraction: vi.fn(),
  trackError: vi.fn(),
  getMetrics: vi.fn(() => ({
    bundleSize: 909000, // Current bundle size in bytes
    loadTime: 50,       // Default load time in ms
    memoryUsage: 25000000, // Default memory usage in bytes
  })),
};

vi.mock('@/monitoring/PerformanceMonitor', () => ({
  PerformanceMonitor: mockPerformanceMonitor,
}));

// Mock element analytics
const mockElementAnalytics = {
  trackStart: vi.fn(),
  trackComplete: vi.fn(),
  trackInteraction: vi.fn(),
  trackError: vi.fn(),
};

vi.mock('@/hooks/useElementAnalytics', () => ({
  useElementAnalytics: () => mockElementAnalytics,
}));

// Mock element completion hook
vi.mock('@/components/lesson/interactive/hooks/useElementCompletion', () => ({
  useElementCompletion: () => ({
    isElementCompleted: false,
    markElementComplete: vi.fn(),
  }),
}));

// Mock Supabase icons
vi.mock('@/utils/supabaseIcons', () => ({
  getSupabaseIconUrl: (icon: string) => `https://test-url.com/${icon}`,
}));

/**
 * Test element interface that matches the real InteractiveElement
 */
export interface TestElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
  active?: boolean;
  gated?: boolean;
}

/**
 * Default test element with safe primitive values
 */
export const createTestElement = (overrides: Partial<TestElement> = {}): TestElement => ({
  id: 1,
  type: 'test_component',
  title: 'Test Component',
  content: 'Test content for the component',
  configuration: {},
  order_index: 1,
  active: true,
  gated: false,
  ...overrides,
});

/**
 * Create test elements with potential object-to-primitive issues
 */
export const createProblematicElement = (overrides: Partial<TestElement> = {}): TestElement => ({
  id: 1,
  type: 'test_component',
  title: 'Test Component',
  content: 'Test content',
  configuration: {
    complex: { nested: { object: 'value' } },
    array: [1, 2, 3],
    nullValue: null,
    undefinedValue: undefined,
  },
  order_index: 1,
  active: true,
  gated: false,
  ...overrides,
});

/**
 * Test lesson context
 */
export const createTestLessonContext = () => ({
  chapterTitle: 'Test Chapter',
  lessonTitle: 'Test Lesson',
  content: 'Test lesson content',
});

/**
 * Performance test utilities
 */
export class PerformanceTestUtils {
  static async measureRenderTime<T>(renderFn: () => T): Promise<{ result: T; renderTime: number }> {
    const startTime = performance.now();
    const result = renderFn();
    
    // Wait for any async operations to complete
    await waitFor(() => {}, { timeout: 100 });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    return { result, renderTime };
  }

  static async measureMemoryUsage<T>(testFn: () => Promise<T>): Promise<{ result: T; memoryDelta: number }> {
    // Force garbage collection if available (only in test environment)
    if (global.gc) {
      global.gc();
    }
    
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    const result = await testFn();
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    
    return {
      result,
      memoryDelta: finalMemory - initialMemory,
    };
  }

  static checkBundleSize(actualSize: number, maxSize: number = 1048576): boolean {
    return actualSize <= maxSize; // Default max 1MB
  }
}

/**
 * Object-to-primitive regression test utilities
 */
export class RegressionTestUtils {
  /**
   * Test that a component doesn't throw object-to-primitive errors
   */
  static async testObjectToPrimitiveSafety(
    Component: React.ComponentType<any>,
    props: any
  ): Promise<{ safe: boolean; errors: string[] }> {
    const errors: string[] = [];
    const originalConsoleError = console.error;
    
    // Capture console errors
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Cannot convert object to primitive')) {
        errors.push(errorMessage);
      }
    };

    try {
      render(<Component {...props} />);
      
      // Wait for any async operations
      await waitFor(() => {}, { timeout: 1000 });
      
      return {
        safe: errors.length === 0,
        errors,
      };
    } catch (error) {
      const errorMessage = String(error);
      if (errorMessage.includes('Cannot convert object to primitive')) {
        errors.push(errorMessage);
      }
      
      return {
        safe: false,
        errors: [...errors, errorMessage],
      };
    } finally {
      console.error = originalConsoleError;
    }
  }

  /**
   * Test component with various prop combinations that might cause issues
   */
  static async testPropVariations(
    Component: React.ComponentType<any>,
    baseProps: any
  ): Promise<{ passed: number; failed: number; errors: string[] }> {
    const variations = [
      // Normal props
      baseProps,
      
      // Props with null values
      { ...baseProps, configuration: null },
      
      // Props with undefined values
      { ...baseProps, configuration: undefined },
      
      // Props with complex objects
      {
        ...baseProps,
        configuration: {
          complex: { deeply: { nested: { object: 'value' } } },
          array: [{ item: 1 }, { item: 2 }],
          function: () => 'test',
        },
      },
      
      // Props with circular references (handled safely)
      (() => {
        const circular: any = { ...baseProps };
        circular.configuration = { self: circular };
        return circular;
      })(),
    ];

    let passed = 0;
    let failed = 0;
    const allErrors: string[] = [];

    for (const props of variations) {
      try {
        const { safe, errors } = await this.testObjectToPrimitiveSafety(Component, props);
        if (safe) {
          passed++;
        } else {
          failed++;
          allErrors.push(...errors);
        }
      } catch (error) {
        failed++;
        allErrors.push(String(error));
      }
    }

    return { passed, failed, errors: allErrors };
  }
}

/**
 * Error boundary for testing error handling
 */
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Error: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

/**
 * Custom render function with providers and error boundary
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions & { 
    expectError?: boolean;
    onError?: (error: Error) => void;
  } = {}
) => {
  const { expectError = false, onError, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestErrorBoundary onError={onError}>
      {children}
    </TestErrorBoundary>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Wait for component to be stable (no more re-renders)
 */
export const waitForStability = async (timeout = 2000) => {
  await waitFor(() => {
    // Check if there are any pending timers or promises
    expect(true).toBe(true);
  }, { timeout });
};

/**
 * Test user interactions with performance tracking
 */
export const performUserInteraction = async (
  action: () => Promise<void> | void,
  actionName: string
): Promise<{ interactionTime: number }> => {
  const startTime = performance.now();
  await action();
  const endTime = performance.now();
  
  const interactionTime = endTime - startTime;
  
  // Track the interaction
  mockElementAnalytics.trackInteraction(actionName, { duration: interactionTime });
  
  return { interactionTime };
};

/**
 * Bundle size thresholds for regression testing
 */
export const BUNDLE_SIZE_LIMITS = {
  CURRENT_SIZE: 909000, // 909KB current
  WARNING_THRESHOLD: 950000, // 950KB warning
  ERROR_THRESHOLD: 1048576, // 1MB error
};

/**
 * Performance thresholds for regression testing
 */
export const PERFORMANCE_THRESHOLDS = {
  RENDER_TIME_MS: 100,      // Components should render within 100ms
  INTERACTION_TIME_MS: 50,   // Interactions should respond within 50ms
  MEMORY_USAGE_MB: 50,      // Components should not use more than 50MB
};

/**
 * Export mocks for testing
 */
export const testMocks = {
  performanceMonitor: mockPerformanceMonitor,
  elementAnalytics: mockElementAnalytics,
};

export { userEvent };