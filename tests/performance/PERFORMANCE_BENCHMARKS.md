# Chat System Performance Benchmarks & Quality Gates
*QA_Engineer Agent - Performance standards for chat system components*

## Performance Requirements Overview

### Critical Performance Metrics

| Component | Metric | Target | Maximum | Measurement Method |
|-----------|--------|--------|---------|-------------------|
| **Initial Render** | Time to Interactive | < 100ms | < 200ms | Performance.now() |
| **Chat Expansion** | Animation Duration | < 300ms | < 500ms | Animation frame tracking |
| **Message Send** | Response Time | < 1s | < 3s | API timing |
| **Typewriter Effect** | Frame Rate | 60fps | 30fps | RequestAnimationFrame |
| **Scroll Performance** | Smooth Scrolling | 60fps | 30fps | Scroll event timing |
| **Memory Usage** | Component Memory | < 25MB | < 50MB | Performance.memory |
| **Bundle Impact** | Size Increase | < 50KB | < 100KB | Bundle analysis |

## Detailed Performance Benchmarks

### 1. Rendering Performance

#### 1.1 Component Mount Times
```typescript
// tests/performance/rendering-benchmarks.test.ts

describe('Chat Component Rendering Performance', () => {
  test('ContextualLyraChat initial render', async () => {
    const monitor = new PerformanceMonitor();
    
    monitor.start('initial-render');
    
    render(
      <ContextualLyraChat lessonContext={mockLessonContext} />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    const duration = monitor.end('initial-render');
    
    expect(duration).toBeLessThan(100); // Target: < 100ms
    expect(duration).toBeLessThan(200); // Maximum: < 200ms
    
    console.log(`ContextualLyraChat render time: ${duration.toFixed(2)}ms`);
  });

  test('FloatingLyraAvatar initial render', async () => {
    const monitor = new PerformanceMonitor();
    
    monitor.start('avatar-render');
    
    render(
      <FloatingLyraAvatar lessonContext={mockLessonContext} />
    );
    
    const duration = monitor.end('avatar-render');
    
    expect(duration).toBeLessThan(50); // Target: < 50ms
    expect(duration).toBeLessThan(100); // Maximum: < 100ms
  });

  test('NarrativeManager initial render', async () => {
    const messages = [
      { id: '1', content: 'Test message for performance testing' }
    ];
    
    const monitor = new PerformanceMonitor();
    
    monitor.start('narrative-render');
    
    render(<NarrativeManager messages={messages} />);
    
    const duration = monitor.end('narrative-render');
    
    expect(duration).toBeLessThan(75); // Target: < 75ms
    expect(duration).toBeLessThan(150); // Maximum: < 150ms
  });
});
```

#### 1.2 Re-render Performance
```typescript
describe('Chat Re-render Performance', () => {
  test('State updates trigger efficient re-renders', async () => {
    const monitor = new PerformanceMonitor();
    let renderCount = 0;
    
    const TestComponent = () => {
      renderCount++;
      const [expanded, setExpanded] = useState(false);
      
      return (
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      );
    };
    
    const { rerender } = render(<TestComponent />);
    
    // Measure re-render performance
    monitor.start('re-render');
    
    rerender(<TestComponent />);
    
    const duration = monitor.end('re-render');
    
    expect(duration).toBeLessThan(16); // Target: < 16ms (60fps)
    expect(duration).toBeLessThan(33); // Maximum: < 33ms (30fps)
    expect(renderCount).toBeLessThan(3); // Should minimize re-renders
  });

  test('Large message history re-render performance', async () => {
    const largeMessageHistory = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      content: `Performance test message ${i} with sufficient content to simulate real usage patterns and ensure the component can handle substantial message histories efficiently.`,
      isUser: i % 2 === 0,
      timestamp: Date.now() - (100 - i) * 1000
    }));
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: largeMessageHistory,
      sendMessage: vi.fn(),
      clearChat: vi.fn(),
      isLoading: false
    });
    
    const monitor = new PerformanceMonitor();
    
    monitor.start('large-history-render');
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    const duration = monitor.end('large-history-render');
    
    expect(duration).toBeLessThan(500); // Target: < 500ms for 100 messages
    expect(duration).toBeLessThan(1000); // Maximum: < 1s for 100 messages
  });
});
```

### 2. Animation Performance

#### 2.1 Expansion Animation
```typescript
describe('Chat Animation Performance', () => {
  test('Chat expansion animation maintains 60fps', async () => {
    const user = userEvent.setup();
    let frameCount = 0;
    let animationStart = 0;
    let animationEnd = 0;
    
    // Monitor frame rate during animation
    const frameMonitor = () => {
      frameCount++;
      if (animationStart && !animationEnd) {
        requestAnimationFrame(frameMonitor);
      }
    };
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={false}
      />
    );
    
    const avatar = screen.getByRole('button');
    
    // Start monitoring before animation
    animationStart = performance.now();
    frameMonitor();
    
    await user.click(avatar);
    
    // Wait for animation to complete
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    animationEnd = performance.now();
    const duration = animationEnd - animationStart;
    const fps = (frameCount / duration) * 1000;
    
    expect(fps).toBeGreaterThan(30); // Minimum acceptable
    expect(fps).toBeGreaterThan(50); // Target performance
    expect(duration).toBeLessThan(500); // Animation should complete quickly
    
    console.log(`Expansion animation: ${fps.toFixed(1)}fps over ${duration.toFixed(2)}ms`);
  });

  test('Typewriter animation performance', async () => {
    const longMessage = 'This is a very long message that will test the typewriter animation performance to ensure it maintains smooth frame rates during the entire typing sequence without dropping frames or causing performance issues for the user.';
    
    const messages = [{ id: '1', content: longMessage }];
    
    let frameCount = 0;
    const animationStart = performance.now();
    
    const frameMonitor = () => {
      frameCount++;
      const elapsed = performance.now() - animationStart;
      if (elapsed < 3000) { // Monitor for 3 seconds
        requestAnimationFrame(frameMonitor);
      }
    };
    
    frameMonitor();
    
    render(<NarrativeManager messages={messages} />);
    
    // Wait for typing to complete
    await waitFor(() => {
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    const elapsed = performance.now() - animationStart;
    const fps = (frameCount / elapsed) * 1000;
    
    expect(fps).toBeGreaterThan(30); // Minimum acceptable frame rate
    expect(fps).toBeGreaterThan(50); // Target frame rate
    
    console.log(`Typewriter animation: ${fps.toFixed(1)}fps over ${elapsed.toFixed(2)}ms`);
  });
});
```

### 3. Memory Performance

#### 3.1 Memory Usage Tracking
```typescript
describe('Chat Memory Performance', () => {
  test('Component memory usage stays within limits', () => {
    const initialMemory = measureMemoryUsage();
    
    // Mount multiple chat components
    const components = [];
    for (let i = 0; i < 5; i++) {
      components.push(
        render(
          <ContextualLyraChat 
            lessonContext={{
              ...mockLessonContext,
              lessonTitle: `Performance Test Lesson ${i}`
            }}
          />
        )
      );
    }
    
    const afterMountMemory = measureMemoryUsage();
    
    // Unmount all components
    components.forEach(component => component.unmount());
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const afterUnmountMemory = measureMemoryUsage();
    
    if (initialMemory && afterMountMemory && afterUnmountMemory) {
      const mountIncrease = afterMountMemory.used - initialMemory.used;
      const finalIncrease = afterUnmountMemory.used - initialMemory.used;
      
      expect(mountIncrease).toBeLessThan(25 * 1024 * 1024); // < 25MB for 5 components
      expect(finalIncrease).toBeLessThan(5 * 1024 * 1024); // < 5MB after cleanup
      
      console.log(`Memory usage - Mount: +${(mountIncrease / 1024 / 1024).toFixed(2)}MB, Final: +${(finalIncrease / 1024 / 1024).toFixed(2)}MB`);
    }
  });

  test('Large message history memory efficiency', () => {
    const initialMemory = measureMemoryUsage();
    
    // Create progressively larger message histories
    const testSizes = [10, 50, 100, 200];
    const memoryUsages = [];
    
    testSizes.forEach(size => {
      const messages = Array.from({ length: size }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        isUser: i % 2 === 0,
        timestamp: Date.now() - (size - i) * 1000
      }));
      
      vi.mocked(useLyraChat).mockReturnValue({
        messages,
        sendMessage: vi.fn(),
        clearChat: vi.fn(),
        isLoading: false
      });
      
      const { unmount } = render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );
      
      const currentMemory = measureMemoryUsage();
      if (initialMemory && currentMemory) {
        memoryUsages.push({
          size,
          memory: currentMemory.used - initialMemory.used
        });
      }
      
      unmount();
    });
    
    // Memory usage should scale reasonably with message count
    memoryUsages.forEach(({ size, memory }) => {
      const memoryPerMessage = memory / size;
      expect(memoryPerMessage).toBeLessThan(50 * 1024); // < 50KB per message
      
      console.log(`${size} messages: ${(memory / 1024 / 1024).toFixed(2)}MB (${(memoryPerMessage / 1024).toFixed(2)}KB per message)`);
    });
  });
});
```

### 4. Network Performance

#### 4.1 API Response Time Testing
```typescript
describe('Chat Network Performance', () => {
  test('Message sending performance under normal conditions', async () => {
    const user = userEvent.setup();
    const responseTime = 100; // Simulate 100ms response time
    
    const mockSendMessage = vi.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          id: 'response-1',
          content: 'Response message',
          isUser: false
        }), responseTime)
      )
    );
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const startTime = performance.now();
    
    // Send a message
    const input = screen.getByPlaceholderText('Ask about this lesson...');
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    // Wait for response
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
    
    const totalTime = performance.now() - startTime;
    
    expect(totalTime).toBeLessThan(1000); // Target: < 1 second
    expect(totalTime).toBeLessThan(3000); // Maximum: < 3 seconds
    
    console.log(`Message send total time: ${totalTime.toFixed(2)}ms`);
  });

  test('Performance under slow network conditions', async () => {
    const user = userEvent.setup();
    const slowResponseTime = 2000; // Simulate 2s response time
    
    const mockSendMessage = vi.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          id: 'response-1',
          content: 'Slow response message',
          isUser: false
        }), slowResponseTime)
      )
    );
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: true // Show loading state
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Should show loading indicator
    expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    
    // UI should remain responsive during slow network
    const input = screen.getByPlaceholderText('Ask about this lesson...');
    expect(input).toBeDisabled(); // Should disable input during loading
    
    // Close button should still work
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).not.toBeDisabled();
  });

  test('Concurrent request handling', async () => {
    const user = userEvent.setup();
    let requestCount = 0;
    
    const mockSendMessage = vi.fn().mockImplementation(() => {
      requestCount++;
      return new Promise(resolve => 
        setTimeout(() => resolve({
          id: `response-${requestCount}`,
          content: `Response ${requestCount}`,
          isUser: false
        }), 100)
      );
    });
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const startTime = performance.now();
    
    // Send multiple messages quickly
    const questions = screen.getAllByRole('button').filter(btn => 
      btn.textContent?.includes('AI') || btn.textContent?.includes('help')
    );
    
    // Click first 3 questions rapidly
    for (let i = 0; i < Math.min(3, questions.length); i++) {
      await user.click(questions[i]);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should handle concurrent requests gracefully
    expect(mockSendMessage).toHaveBeenCalledTimes(3);
    expect(totalTime).toBeLessThan(500); // Should queue quickly
    
    console.log(`Concurrent requests handled in: ${totalTime.toFixed(2)}ms`);
  });
});
```

### 5. Scroll Performance

#### 5.1 Smooth Scrolling Tests
```typescript
describe('Chat Scroll Performance', () => {
  test('Message list scroll performance', async () => {
    // Create large message list
    const messages = Array.from({ length: 50 }, (_, i) => ({
      id: `msg-${i}`,
      content: `Message ${i}: This is a test message with enough content to test scrolling performance in the chat interface.`,
      isUser: i % 2 === 0,
      timestamp: Date.now() - (50 - i) * 1000
    }));
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages,
      sendMessage: vi.fn(),
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const scrollArea = screen.getByTestId('chat-scroll-area') || 
                     screen.getByRole('log') ||
                     screen.getByRole('dialog').querySelector('[data-radix-scroll-area-viewport]');
    
    let frameCount = 0;
    const scrollStart = performance.now();
    
    const frameMonitor = () => {
      frameCount++;
      const elapsed = performance.now() - scrollStart;
      if (elapsed < 1000) { // Monitor for 1 second
        requestAnimationFrame(frameMonitor);
      }
    };
    
    // Start monitoring
    frameMonitor();
    
    // Simulate scrolling
    if (scrollArea) {
      fireEvent.scroll(scrollArea, { target: { scrollTop: 1000 } });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const elapsed = performance.now() - scrollStart;
    const fps = (frameCount / elapsed) * 1000;
    
    expect(fps).toBeGreaterThan(30); // Minimum acceptable
    expect(fps).toBeGreaterThan(50); // Target performance
    
    console.log(`Scroll performance: ${fps.toFixed(1)}fps`);
  });

  test('Auto-scroll to bottom performance', async () => {
    const messages = [
      { id: '1', content: 'First message' }
    ];
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages,
      sendMessage: vi.fn(),
      clearChat: vi.fn(),
      isLoading: false
    });
    
    const { rerender } = render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const scrollStart = performance.now();
    
    // Add new message to trigger auto-scroll
    const updatedMessages = [
      ...messages,
      { id: '2', content: 'New message that should trigger auto-scroll' }
    ];
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: updatedMessages,
      sendMessage: vi.fn(),
      clearChat: vi.fn(),
      isLoading: false
    });
    
    rerender(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Wait for auto-scroll to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const scrollDuration = performance.now() - scrollStart;
    
    expect(scrollDuration).toBeLessThan(300); // Should scroll quickly
    
    console.log(`Auto-scroll duration: ${scrollDuration.toFixed(2)}ms`);
  });
});
```

## Quality Gates Definition

### 1. Performance Gates
```typescript
// tests/quality-gates/performance-gates.ts

export const PERFORMANCE_GATES = {
  // Rendering Performance
  INITIAL_RENDER_MAX: 200, // ms
  INITIAL_RENDER_TARGET: 100, // ms
  RE_RENDER_MAX: 33, // ms (30fps)
  RE_RENDER_TARGET: 16, // ms (60fps)
  
  // Animation Performance
  ANIMATION_FPS_MIN: 30,
  ANIMATION_FPS_TARGET: 60,
  EXPANSION_DURATION_MAX: 500, // ms
  EXPANSION_DURATION_TARGET: 300, // ms
  
  // Memory Performance
  COMPONENT_MEMORY_MAX: 50 * 1024 * 1024, // 50MB
  COMPONENT_MEMORY_TARGET: 25 * 1024 * 1024, // 25MB
  MEMORY_PER_MESSAGE_MAX: 100 * 1024, // 100KB
  MEMORY_PER_MESSAGE_TARGET: 50 * 1024, // 50KB
  
  // Network Performance
  MESSAGE_SEND_MAX: 3000, // ms
  MESSAGE_SEND_TARGET: 1000, // ms
  API_TIMEOUT: 10000, // ms
  
  // Scroll Performance
  SCROLL_FPS_MIN: 30,
  SCROLL_FPS_TARGET: 60,
  AUTO_SCROLL_MAX: 500, // ms
  AUTO_SCROLL_TARGET: 300, // ms
};

export const validatePerformanceGate = (
  metric: keyof typeof PERFORMANCE_GATES,
  value: number,
  isHigherBetter: boolean = false
): {
  passed: boolean;
  level: 'excellent' | 'good' | 'acceptable' | 'poor';
  message: string;
} => {
  const target = PERFORMANCE_GATES[metric];
  
  if (typeof target !== 'number') {
    throw new Error(`Invalid performance metric: ${metric}`);
  }
  
  let passed: boolean;
  let level: 'excellent' | 'good' | 'acceptable' | 'poor';
  
  if (isHigherBetter) {
    // For metrics where higher is better (like FPS)
    passed = value >= target;
    if (value >= target * 1.2) level = 'excellent';
    else if (value >= target) level = 'good';
    else if (value >= target * 0.8) level = 'acceptable';
    else level = 'poor';
  } else {
    // For metrics where lower is better (like response time)
    passed = value <= target;
    if (value <= target * 0.5) level = 'excellent';
    else if (value <= target * 0.8) level = 'good';
    else if (value <= target) level = 'acceptable';
    else level = 'poor';
  }
  
  const message = `${metric}: ${value} (${isHigherBetter ? 'min' : 'max'}: ${target}) - ${level.toUpperCase()}`;
  
  return { passed, level, message };
};
```

### 2. Bundle Size Gates
```typescript
// tests/quality-gates/bundle-gates.ts

export const BUNDLE_GATES = {
  // Total bundle size limits
  TOTAL_JS_MAX: 500 * 1024, // 500KB gzipped
  TOTAL_CSS_MAX: 50 * 1024, // 50KB gzipped
  
  // Component-specific limits
  CHAT_COMPONENT_MAX: 100 * 1024, // 100KB for chat components
  ANIMATION_ASSETS_MAX: 200 * 1024, // 200KB for animations
  
  // Chunk limits
  VENDOR_CHUNK_MAX: 200 * 1024, // 200KB for vendor code
  APP_CHUNK_MAX: 300 * 1024, // 300KB for app code
};

export const validateBundleSize = async (
  buildPath: string
): Promise<{
  passed: boolean;
  results: Array<{
    file: string;
    size: number;
    limit: number;
    passed: boolean;
  }>;
}> => {
  // This would integrate with your build tools to analyze bundle sizes
  // Implementation would depend on your specific build setup
  
  return {
    passed: true,
    results: []
  };
};
```

### 3. Accessibility Gates
```typescript
// tests/quality-gates/accessibility-gates.ts

export const ACCESSIBILITY_GATES = {
  // WCAG Compliance
  WCAG_LEVEL: 'AA' as const,
  VIOLATIONS_MAX: 0,
  
  // Color Contrast
  CONTRAST_RATIO_MIN: 4.5, // WCAG AA standard
  CONTRAST_RATIO_TARGET: 7, // WCAG AAA standard
  
  // Keyboard Navigation
  FOCUSABLE_ELEMENTS_MIN: 1,
  TAB_ORDER_LOGICAL: true,
  FOCUS_VISIBLE: true,
  
  // Screen Reader
  ARIA_LABELS_REQUIRED: true,
  LIVE_REGIONS_REQUIRED: true,
  SEMANTIC_MARKUP: true,
};

export const validateAccessibility = async (
  component: HTMLElement
): Promise<{
  passed: boolean;
  violations: Array<{
    rule: string;
    severity: 'error' | 'warning';
    message: string;
    elements: HTMLElement[];
  }>;
}> => {
  const results = await axe(component, {
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-visible': { enabled: true },
      'aria-labels': { enabled: true },
    }
  });
  
  const violations = results.violations.map(violation => ({
    rule: violation.id,
    severity: violation.impact as 'error' | 'warning',
    message: violation.description,
    elements: violation.nodes.map(node => node.element)
  }));
  
  const passed = violations.filter(v => v.severity === 'error').length === 0;
  
  return { passed, violations };
};
```

## Automated Performance Monitoring

### 1. Continuous Performance Testing
```typescript
// tests/monitoring/performance-monitor.ts

export class ContinuousPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private thresholds: Map<string, number> = new Map();
  
  constructor() {
    // Set up default thresholds
    Object.entries(PERFORMANCE_GATES).forEach(([key, value]) => {
      this.thresholds.set(key, value);
    });
  }
  
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(value);
    
    // Keep only last 100 measurements
    const measurements = this.metrics.get(name)!;
    if (measurements.length > 100) {
      measurements.splice(0, measurements.length - 100);
    }
  }
  
  getMetricStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    trend: 'improving' | 'stable' | 'degrading';
  } | null {
    const measurements = this.metrics.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    
    // Calculate trend
    let trend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (measurements.length >= 10) {
      const firstHalf = measurements.slice(0, measurements.length / 2);
      const secondHalf = measurements.slice(measurements.length / 2);
      
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      const improvementThreshold = 0.1; // 10% improvement
      const degradationThreshold = 0.1; // 10% degradation
      
      if (secondAvg < firstAvg * (1 - improvementThreshold)) {
        trend = 'improving';
      } else if (secondAvg > firstAvg * (1 + degradationThreshold)) {
        trend = 'degrading';
      }
    }
    
    return { count: measurements.length, avg, min, max, trend };
  }
  
  checkThresholds(): Array<{
    metric: string;
    value: number;
    threshold: number;
    status: 'pass' | 'warn' | 'fail';
  }> {
    const results = [];
    
    for (const [metric, threshold] of this.thresholds.entries()) {
      const stats = this.getMetricStats(metric);
      if (stats) {
        let status: 'pass' | 'warn' | 'fail' = 'pass';
        
        if (stats.avg > threshold) {
          status = stats.avg > threshold * 1.2 ? 'fail' : 'warn';
        }
        
        results.push({
          metric,
          value: stats.avg,
          threshold,
          status
        });
      }
    }
    
    return results;
  }
  
  generateReport(): {
    summary: { pass: number; warn: number; fail: number };
    details: Array<{
      metric: string;
      stats: ReturnType<typeof this.getMetricStats>;
      threshold: number;
      status: 'pass' | 'warn' | 'fail';
    }>;
  } {
    const thresholdResults = this.checkThresholds();
    const summary = { pass: 0, warn: 0, fail: 0 };
    
    const details = thresholdResults.map(result => {
      summary[result.status]++;
      
      return {
        metric: result.metric,
        stats: this.getMetricStats(result.metric),
        threshold: result.threshold,
        status: result.status
      };
    });
    
    return { summary, details };
  }
}
```

### 2. Performance Regression Detection
```typescript
// tests/monitoring/regression-detector.ts

export class PerformanceRegressionDetector {
  private baseline: Map<string, number> = new Map();
  private regressionThreshold = 0.2; // 20% regression threshold
  
  setBaseline(metrics: Record<string, number>): void {
    this.baseline.clear();
    Object.entries(metrics).forEach(([key, value]) => {
      this.baseline.set(key, value);
    });
  }
  
  detectRegressions(currentMetrics: Record<string, number>): Array<{
    metric: string;
    baseline: number;
    current: number;
    regression: number;
    severity: 'minor' | 'major' | 'critical';
  }> {
    const regressions = [];
    
    for (const [metric, currentValue] of Object.entries(currentMetrics)) {
      const baselineValue = this.baseline.get(metric);
      
      if (baselineValue && currentValue > baselineValue) {
        const regression = (currentValue - baselineValue) / baselineValue;
        
        if (regression > this.regressionThreshold) {
          let severity: 'minor' | 'major' | 'critical' = 'minor';
          
          if (regression > 0.5) severity = 'critical';
          else if (regression > 0.3) severity = 'major';
          
          regressions.push({
            metric,
            baseline: baselineValue,
            current: currentValue,
            regression,
            severity
          });
        }
      }
    }
    
    return regressions;
  }
}
```

## Implementation Guidelines

### 1. Test Execution Strategy
```bash
# Development workflow
npm run test:performance         # Run all performance tests
npm run test:performance:quick   # Run critical performance tests only
npm run test:performance:full    # Run comprehensive performance suite

# CI/CD workflow
npm run test:performance:ci      # Performance tests for CI
npm run test:performance:baseline # Establish performance baseline
npm run test:performance:regression # Check for regressions
```

### 2. Performance Monitoring Integration
```yaml
# .github/workflows/performance-monitoring.yml
name: Performance Monitoring

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance tests
        run: npm run test:performance:ci
      
      - name: Check performance gates
        run: npm run test:performance:gates
      
      - name: Upload performance report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: performance-report/
      
      - name: Comment PR with performance results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('performance-report/summary.json'));
            
            const comment = `## Performance Test Results
            
            | Metric | Current | Target | Status |
            |--------|---------|--------|--------|
            ${report.results.map(r => 
              `| ${r.metric} | ${r.value} | ${r.target} | ${r.passed ? '✅' : '❌'} |`
            ).join('\n')}
            
            ${report.regressions.length > 0 ? 
              `⚠️ **${report.regressions.length} performance regressions detected**` : 
              '✅ No performance regressions detected'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

This comprehensive performance benchmarking strategy ensures the chat system maintains excellent performance standards while providing automated monitoring and regression detection.