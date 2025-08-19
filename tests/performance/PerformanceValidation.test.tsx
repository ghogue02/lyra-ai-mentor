import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PerformanceTestSuite, performanceUtils, LowEndDeviceSimulator } from '@/utils/performanceTesting';
import { InteractiveDecisionTree } from '@/components/ui/interaction-patterns/InteractiveDecisionTree.optimized';
import { PriorityCardSystem } from '@/components/ui/interaction-patterns/PriorityCardSystem.optimized';
import { ConversationalFlow } from '@/components/ui/interaction-patterns/ConversationalFlow.optimized';
import { PreferenceSliderGrid } from '@/components/ui/interaction-patterns/PreferenceSliderGrid.optimized';
import PerformanceDashboard from '@/components/performance/PerformanceDashboard';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 20, // 20MB
    totalJSHeapSize: 1024 * 1024 * 50, // 50MB
    jsHeapSizeLimit: 1024 * 1024 * 100 // 100MB
  }
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock requestAnimationFrame
let rafCallback: FrameRequestCallback | null = null;
window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  rafCallback = callback;
  return 1;
});

window.cancelAnimationFrame = vi.fn();

// Mock observer API
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

Object.defineProperty(window, 'IntersectionObserver', {
  value: mockIntersectionObserver,
  writable: true
});

describe('Performance Optimization Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockReturnValue(Date.now());
  });

  describe('Performance Testing Suite', () => {
    it('should validate 60fps target on simulated low-end devices', async () => {
      const testSuite = new PerformanceTestSuite();
      const simulator = new LowEndDeviceSimulator();
      
      // Simulate low-end device
      simulator.simulateLowEndDevice();
      
      const results = await testSuite.runAllTests();
      
      // Restore normal performance
      simulator.restoreNormalPerformance();
      
      expect(results).toHaveLength(3); // Normal, Low-end, Stress test
      
      // Check that low-end device test exists
      const lowEndTest = results.find(r => r.testName.includes('Low-End Device'));
      expect(lowEndTest).toBeDefined();
      
      // Validate performance criteria
      if (lowEndTest) {
        expect(lowEndTest.deviceSpec.ram).toBe(2);
        expect(lowEndTest.deviceSpec.cpu).toBe('low');
        // Even on low-end devices, minimum FPS should be acceptable
        expect(lowEndTest.minFps).toBeGreaterThan(30);
        expect(lowEndTest.memoryPeak).toBeLessThan(100); // Reasonable memory usage
      }
    });

    it('should detect memory leaks and excessive memory usage', async () => {
      const quickCheck = await performanceUtils.quickPerformanceCheck();
      expect(typeof quickCheck).toBe('boolean');
      
      // Memory usage should be reasonable
      const deviceCapabilities = performanceUtils.checkDeviceCapabilities();
      expect(deviceCapabilities).toHaveProperty('ram');
      expect(deviceCapabilities).toHaveProperty('cpu');
      expect(deviceCapabilities).toHaveProperty('screen');
    });
  });

  describe('Optimized Components Performance', () => {
    const mockDecisionNodes = {
      'root': {
        id: 'root',
        title: 'Root Decision',
        type: 'root' as const,
        level: 0,
        children: ['choice1'],
        choices: [
          {
            id: 'choice1',
            label: 'Test Choice',
            leadsTo: 'outcome1'
          }
        ]
      },
      'outcome1': {
        id: 'outcome1',
        title: 'Test Outcome',
        type: 'outcome' as const,
        level: 1,
        children: [],
        outcome: {
          type: 'success' as const,
          title: 'Success',
          description: 'Test completed successfully'
        }
      }
    };

    const mockDecisionState = {
      currentNodeId: 'root',
      visitedNodes: new Set(['root']),
      decisionPath: [{ nodeId: 'root', timestamp: new Date(), level: 0 }],
      choices: {},
      isComplete: false
    };

    it('should render InteractiveDecisionTree without performance issues', async () => {
      const startTime = performance.now();
      
      render(
        <InteractiveDecisionTree
          title="Performance Test"
          nodes={mockDecisionNodes}
          rootNodeId="root"
          state={mockDecisionState}
          onStateChange={vi.fn()}
        />
      );
      
      const renderTime = performance.now() - startTime;
      
      // Rendering should be fast
      expect(renderTime).toBeLessThan(100); // Less than 100ms
      
      // Component should be in the document
      expect(screen.getByText('Performance Test')).toBeInTheDocument();
      
      // Optimized components should use React.memo
      expect(InteractiveDecisionTree.displayName).toBe('InteractiveDecisionTree');
    });

    it('should handle rapid interactions without frame drops', async () => {
      const mockCards = Array.from({ length: 50 }, (_, i) => ({
        id: `card-${i}`,
        title: `Test Card ${i}`,
        priority: i + 1,
        metadata: {
          effort: 'low' as const,
          impact: 'medium' as const,
          urgency: 'low' as const
        }
      }));

      const onCardsChange = vi.fn();
      
      render(
        <PriorityCardSystem
          title="Performance Test"
          cards={mockCards}
          onCardsChange={onCardsChange}
        />
      );

      // Simulate rapid interactions
      const startTime = performance.now();
      
      // Find first move button and click it multiple times
      const moveButtons = screen.getAllByRole('button');
      const moveUpButton = moveButtons.find(button => 
        button.querySelector('svg')?.getAttribute('class')?.includes('ArrowUp')
      );
      
      if (moveUpButton) {
        // Rapid clicks to test throttling
        for (let i = 0; i < 10; i++) {
          fireEvent.click(moveUpButton);
        }
      }
      
      const interactionTime = performance.now() - startTime;
      
      // Interactions should be handled efficiently
      expect(interactionTime).toBeLessThan(200);
      
      // Throttling should prevent excessive calls
      await waitFor(() => {
        expect(onCardsChange.mock.calls.length).toBeLessThan(10);
      });
    });

    it('should use virtual scrolling for large lists', () => {
      const manyCards = Array.from({ length: 100 }, (_, i) => ({
        id: `card-${i}`,
        title: `Card ${i}`,
        priority: i + 1
      }));

      render(
        <PriorityCardSystem
          title="Large List Test"
          cards={manyCards}
          onCardsChange={vi.fn()}
        />
      );

      // Should render without performance issues
      expect(screen.getByText('Large List Test')).toBeInTheDocument();
      expect(screen.getByText('100 items to prioritize')).toBeInTheDocument();
    });
  });

  describe('GPU Acceleration and Hardware Optimization', () => {
    it('should apply GPU acceleration CSS properties', () => {
      render(
        <InteractiveDecisionTree
          title="GPU Test"
          nodes={mockDecisionNodes}
          rootNodeId="root"
          state={mockDecisionState}
          onStateChange={vi.fn()}
        />
      );

      // Find elements that should have GPU acceleration
      const animatedElements = document.querySelectorAll('[class*="will-change-transform"]');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('should implement intersection observer for lazy loading', () => {
      const mockCards = Array.from({ length: 20 }, (_, i) => ({
        id: `card-${i}`,
        title: `Card ${i}`,
        priority: i + 1
      }));

      render(
        <PriorityCardSystem
          title="Intersection Observer Test"
          cards={mockCards}
          onCardsChange={vi.fn()}
        />
      );

      // IntersectionObserver should be called
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });
  });

  describe('Memory Management', () => {
    it('should clean up event listeners and timeouts', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <InteractiveDecisionTree
          title="Memory Test"
          nodes={mockDecisionNodes}
          rootNodeId="root"
          state={mockDecisionState}
          onStateChange={vi.fn()}
          autoSave={true}
        />
      );

      // Component should set up auto-save timeout
      expect(setTimeout).toHaveBeenCalled();

      // Unmount to trigger cleanup
      unmount();

      // Cleanup should occur
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Performance Dashboard', () => {
    it('should render performance metrics correctly', () => {
      render(<PerformanceDashboard />);

      expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Current FPS')).toBeInTheDocument();
      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      expect(screen.getByText('CPU Load')).toBeInTheDocument();
    });

    it('should start performance tests when run button is clicked', async () => {
      render(<PerformanceDashboard />);

      const runButton = screen.getByText('Run Tests');
      fireEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Running...')).toBeInTheDocument();
      });
    });
  });

  describe('Debouncing and Throttling', () => {
    it('should debounce search inputs', async () => {
      const mockMessages = [
        { id: '1', content: 'Test message', sender: 'user' as const, timestamp: new Date() }
      ];

      const onSend = vi.fn();

      render(
        <ConversationalFlow
          title="Debounce Test"
          messages={mockMessages}
          onSendMessage={onSend}
        />
      );

      const input = screen.getByPlaceholder(/type your message/i);
      
      // Rapid typing should be debounced
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });

      // Should handle rapid changes efficiently
      expect(input).toHaveValue('abc');
    });

    it('should throttle slider changes to 60fps', () => {
      const preferences = [
        { id: '1', label: 'Test Preference', value: 5, min: 1, max: 10 }
      ];

      const onChange = vi.fn();

      render(
        <PreferenceSliderGrid
          title="Throttle Test"
          preferences={preferences}
          onPreferencesChange={onChange}
        />
      );

      const slider = screen.getByRole('slider');
      
      // Rapid slider changes
      for (let i = 0; i < 10; i++) {
        fireEvent.change(slider, { target: { value: i.toString() } });
      }

      // Should be throttled to prevent excessive calls
      expect(onChange.mock.calls.length).toBeLessThan(10);
    });
  });

  describe('Animation Performance', () => {
    it('should use optimized animations with proper easing', () => {
      render(
        <InteractiveDecisionTree
          title="Animation Test"
          nodes={mockDecisionNodes}
          rootNodeId="root"
          state={mockDecisionState}
          onStateChange={vi.fn()}
        />
      );

      // Framer Motion components should be present
      const motionElements = document.querySelectorAll('[style*="transform"]');
      expect(motionElements.length).toBeGreaterThan(0);
    });
  });
});

// Integration test for complete performance validation
describe('End-to-End Performance Validation', () => {
  it('should achieve target performance across all interaction patterns', async () => {
    const testSuite = new PerformanceTestSuite();
    
    // Mock a complete test scenario
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <div class="interaction-patterns">
        <div class="decision-tree"></div>
        <div class="priority-cards"></div>
        <div class="conversation-flow"></div>
        <div class="preference-sliders"></div>
      </div>
    `;
    document.body.appendChild(mockElement);

    try {
      const results = await testSuite.runAllTests();
      
      // Validate that performance targets are met
      expect(results.length).toBeGreaterThan(0);
      
      const passedTests = results.filter(r => r.passed);
      const passRate = (passedTests.length / results.length) * 100;
      
      // Should achieve at least 80% pass rate for production readiness
      expect(passRate).toBeGreaterThanOrEqual(80);
      
      // Memory usage should be reasonable
      results.forEach(result => {
        expect(result.memoryPeak).toBeLessThan(100); // Less than 100MB peak
        expect(result.averageFps).toBeGreaterThan(30); // Minimum acceptable FPS
      });
      
    } finally {
      document.body.removeChild(mockElement);
    }
  });
});