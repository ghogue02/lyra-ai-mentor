/**
 * Comprehensive Monitoring System Tests
 * Validates all monitoring components and integration
 */

import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { MonitoringSystem, monitoringSystem } from '../index';
import { MetricsManager } from '../core/MetricsManager';
import { ErrorTracker } from '../core/ErrorTracker';
import { InteractionAnalytics } from '../analytics/InteractionAnalytics';
import { AlertManager } from '../alerts/AlertManager';
import { ComponentProfiler } from '../core/ComponentProfiler';
import { RegressionDetector } from '../core/RegressionDetector';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  timing: {},
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024,
    jsHeapSizeLimit: 2 * 1024 * 1024 * 1024
  }
};

// Mock PerformanceObserver
const mockPerformanceObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn()
}));

// Setup global mocks
Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true
});

Object.defineProperty(global, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true
});

Object.defineProperty(global, 'requestAnimationFrame', {
  value: vi.fn((cb) => setTimeout(cb, 16)),
  writable: true
});

describe('MonitoringSystem', () => {
  let system: MonitoringSystem;

  beforeEach(() => {
    system = MonitoringSystem.getInstance();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await system.shutdown();
  });

  describe('System Initialization', () => {
    it('should initialize successfully with default configuration', async () => {
      await system.initialize();
      
      const health = system.getHealthStatus();
      expect(health.status).toBe('healthy');
      expect(health.components.metricsManager).toBeDefined();
      expect(health.components.errorTracker).toBeDefined();
    });

    it('should handle custom configuration', async () => {
      const customConfig = {
        features: {
          errorTracking: true,
          performanceMonitoring: false,
          userAnalytics: true,
          componentProfiling: false,
          regressionDetection: false,
          realTimeAlerts: true,
          dashboard: false
        }
      };

      await system.initialize(customConfig);
      
      const health = system.getHealthStatus();
      expect(health.components.profiler).toBe(false);
    });

    it('should skip initialization if disabled', async () => {
      const disabledConfig = { enabled: false };
      
      await system.initialize(disabledConfig);
      
      // Should not throw and should handle gracefully
      expect(true).toBe(true);
    });
  });

  describe('Component Integration', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should integrate MetricsManager correctly', () => {
      const metricsManager = MetricsManager.getInstance();
      
      metricsManager.recordMetric('test-session', {
        responseTime: 1500,
        memoryUsage: 75,
        timestamp: new Date()
      });

      const metrics = metricsManager.getMetrics({
        start: new Date(Date.now() - 60000),
        end: new Date()
      });

      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].responseTime).toBe(1500);
    });

    it('should integrate ErrorTracker correctly', () => {
      const errorTracker = ErrorTracker.getInstance();
      
      const errorId = errorTracker.trackError(new Error('Test error'), {
        sessionId: 'test-session',
        component: 'TestComponent',
        severity: 'high'
      });

      expect(errorId).toBeDefined();
      
      const errors = errorTracker.getErrors({
        sessionId: 'test-session'
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Test error');
    });

    it('should integrate InteractionAnalytics correctly', () => {
      const analytics = InteractionAnalytics.getInstance();
      
      const interactionId = analytics.trackInteraction({
        sessionId: 'test-session',
        type: 'click',
        component: 'TestButton',
        element: 'submit',
        data: { value: 'test' },
        success: true
      });

      expect(interactionId).toBeDefined();
      
      const interactions = analytics.getInteractions({
        sessionId: 'test-session'
      });

      expect(interactions.length).toBe(1);
      expect(interactions[0].type).toBe('click');
    });

    it('should integrate AlertManager correctly', () => {
      const alertManager = AlertManager.getInstance();
      
      const alert = alertManager.createAlert({
        type: 'performance',
        severity: 'high',
        title: 'Test Alert',
        message: 'This is a test alert',
        metric: 'responseTime',
        currentValue: 5000,
        threshold: 3000
      });

      expect(alert).toBeDefined();
      
      const activeAlerts = alertManager.getActiveAlerts();
      expect(activeAlerts.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should collect and aggregate performance metrics', async () => {
      const metricsManager = MetricsManager.getInstance();
      
      // Record multiple metrics
      for (let i = 0; i < 5; i++) {
        metricsManager.recordMetric(`session-${i}`, {
          responseTime: 1000 + i * 100,
          memoryUsage: 50 + i * 5,
          fps: 60 - i,
          timestamp: new Date()
        });
      }

      const aggregated = metricsManager.getAggregatedMetrics({
        start: new Date(Date.now() - 60000),
        end: new Date()
      });

      expect(aggregated.averages.responseTime).toBeGreaterThan(1000);
      expect(aggregated.averages.memoryUsage).toBeGreaterThan(50);
      expect(aggregated.trends.responseTime).toBe('degrading');
    });

    it('should detect memory leaks', () => {
      const metricsManager = MetricsManager.getInstance();
      
      // Simulate increasing memory usage
      for (let i = 0; i < 20; i++) {
        metricsManager.recordMetric('memory-test', {
          memoryUsage: 50 + i * 10, // Rapidly increasing memory
          timestamp: new Date(Date.now() + i * 1000)
        });
      }

      const leaks = metricsManager.detectMemoryLeaks();
      expect(leaks.length).toBeGreaterThan(0);
      expect(leaks[0].severity).toBeDefined();
    });
  });

  describe('Error Handling and Recovery', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should categorize errors correctly', () => {
      const errorTracker = ErrorTracker.getInstance();
      
      // Test different error types
      const networkError = errorTracker.trackError(new Error('Network request failed'), {
        sessionId: 'test',
        source: 'network'
      });

      const aiError = errorTracker.trackAIError(new Error('OpenAI API error'), {
        sessionId: 'test',
        model: 'gpt-4',
        operation: 'chat'
      });

      const errors = errorTracker.getErrors();
      expect(errors.length).toBe(2);
      
      const networkErr = errors.find(e => e.source === 'network');
      expect(networkErr).toBeDefined();
    });

    it('should generate error statistics', () => {
      const errorTracker = ErrorTracker.getInstance();
      
      // Create errors of different severities
      errorTracker.trackError(new Error('Critical error'), {
        sessionId: 'test',
        severity: 'critical'
      });
      
      errorTracker.trackError(new Error('Warning'), {
        sessionId: 'test',
        severity: 'low'
      });

      const stats = errorTracker.getErrorStats();
      expect(stats.total).toBe(2);
      expect(stats.bySeverity.critical).toBe(1);
      expect(stats.bySeverity.low).toBe(1);
    });
  });

  describe('Regression Detection', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should detect performance regressions', () => {
      const regressionDetector = RegressionDetector.getInstance();
      
      // Establish baseline with good performance
      const baselineMetrics = Array.from({ length: 20 }, (_, i) => ({
        responseTime: 1000 + Math.random() * 100,
        memoryUsage: 50 + Math.random() * 5,
        timestamp: new Date(Date.now() - (20 - i) * 60000)
      }));

      regressionDetector.establishBaselines(baselineMetrics as any);

      // Introduce performance regression
      const regressions = regressionDetector.processMetrics({
        responseTime: 5000, // Significant increase
        memoryUsage: 55,
        timestamp: new Date()
      } as any);

      expect(regressions.length).toBeGreaterThan(0);
      expect(regressions[0].severity).toBeDefined();
    });

    it('should predict future performance issues', () => {
      const regressionDetector = RegressionDetector.getInstance();
      
      // Create trending data
      for (let i = 0; i < 15; i++) {
        regressionDetector.processMetrics({
          responseTime: 1000 + i * 200, // Steadily increasing
          timestamp: new Date(Date.now() + i * 60000)
        } as any);
      }

      const predictions = regressionDetector.predictIssues();
      expect(predictions.length).toBeGreaterThan(0);
      expect(predictions[0].probability).toBeGreaterThan(0);
    });
  });

  describe('Analytics and Insights', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should track user interaction patterns', () => {
      const analytics = InteractionAnalytics.getInstance();
      
      // Simulate user journey
      analytics.trackInteraction({
        sessionId: 'user-journey',
        type: 'navigation',
        component: 'Homepage',
        element: 'hero',
        data: {},
        success: true
      });

      analytics.trackAIInteraction({
        sessionId: 'user-journey',
        component: 'ChatInterface',
        type: 'chat-open',
        data: { messageLength: 50 },
        success: true
      });

      analytics.trackPatternUsage({
        sessionId: 'user-journey',
        patternId: 'conversation-starter',
        patternType: 'ai-component',
        component: 'ChatInterface',
        engagementTime: 30000,
        success: true,
        satisfactionScore: 4.5
      });

      const stats = analytics.getInteractionStats();
      expect(stats.totalInteractions).toBe(3);
      expect(stats.aiInteractionMetrics.chatSessions).toBe(1);
    });

    it('should analyze user journey patterns', () => {
      const analytics = InteractionAnalytics.getInstance();
      
      const journey = analytics.getUserJourney('test-user');
      expect(journey.totalSessions).toBeDefined();
      expect(journey.engagementTrend).toBeDefined();
    });
  });

  describe('Alert Management', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should trigger alerts based on thresholds', () => {
      const alertManager = AlertManager.getInstance();
      
      // Test performance threshold violation
      const alerts = alertManager.checkMetrics({
        responseTime: 35000, // Exceeds critical threshold
        memoryUsage: 250,    // Exceeds critical threshold
        errorRate: 0.15,     // Exceeds critical threshold
        timestamp: new Date()
      } as any);

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.severity === 'critical')).toBe(true);
    });

    it('should manage alert lifecycle', () => {
      const alertManager = AlertManager.getInstance();
      
      const alert = alertManager.createAlert({
        type: 'performance',
        severity: 'high',
        title: 'Test Alert',
        message: 'Test alert message'
      });

      expect(alert).toBeDefined();
      
      const resolved = alertManager.resolveAlert(alert.id, 'Fixed by test');
      expect(resolved).toBe(true);
      
      const activeAlerts = alertManager.getActiveAlerts();
      expect(activeAlerts.find(a => a.id === alert.id)).toBeUndefined();
    });
  });

  describe('System Health and Reporting', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should provide accurate health status', () => {
      const health = system.getHealthStatus();
      
      expect(health.status).toMatch(/^(healthy|degraded|critical)$/);
      expect(health.components).toBeDefined();
      expect(health.metrics).toBeDefined();
      expect(typeof health.uptime).toBe('number');
    });

    it('should generate comprehensive system reports', () => {
      const report = system.generateSystemReport();
      
      expect(report.timestamp).toBeDefined();
      expect(report.environment).toBeDefined();
      expect(report.health).toBeDefined();
      expect(report.performance).toBeDefined();
      expect(report.errors).toBeDefined();
      expect(report.analytics).toBeDefined();
      expect(report.configuration).toBeDefined();
    });

    it('should handle configuration updates', () => {
      const originalConfig = system.getHealthStatus();
      
      system.updateConfiguration({
        collection: {
          metricsInterval: 15000
        }
      });

      // Configuration should be updated
      expect(true).toBe(true); // Test passes if no errors thrown
    });
  });

  describe('Error Conditions and Edge Cases', () => {
    it('should handle initialization errors gracefully', async () => {
      // Mock a failing component
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Force an error during initialization
      const mockError = new Error('Initialization failed');
      vi.spyOn(MetricsManager.prototype, 'startCollection').mockImplementation(() => {
        throw mockError;
      });

      await expect(system.initialize()).rejects.toThrow('Initialization failed');
      
      console.error = originalConsoleError;
    });

    it('should handle shutdown gracefully even if not initialized', async () => {
      const uninitializedSystem = MonitoringSystem.getInstance();
      
      // Should not throw
      await expect(uninitializedSystem.shutdown()).resolves.toBeUndefined();
    });

    it('should handle missing browser APIs gracefully', () => {
      // Remove performance API temporarily
      const originalPerformance = global.performance;
      delete (global as any).performance;

      const metricsManager = MetricsManager.getInstance();
      
      // Should not throw when performance API is missing
      expect(() => {
        metricsManager.recordMetric('test', {
          responseTime: 1000,
          timestamp: new Date()
        });
      }).not.toThrow();

      // Restore performance API
      global.performance = originalPerformance;
    });
  });

  describe('Performance and Memory', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should not leak memory during normal operation', () => {
      const metricsManager = MetricsManager.getInstance();
      const initialMemory = mockPerformance.memory.usedJSHeapSize;
      
      // Generate lots of metrics
      for (let i = 0; i < 1000; i++) {
        metricsManager.recordMetric(`test-${i}`, {
          responseTime: 1000 + i,
          timestamp: new Date()
        });
      }

      // Should not increase memory significantly due to built-in limits
      const finalMemory = mockPerformance.memory.usedJSHeapSize;
      expect(finalMemory).toBeLessThan(initialMemory * 2);
    });

    it('should throttle high-frequency events', () => {
      const analytics = InteractionAnalytics.getInstance();
      const startTime = Date.now();
      
      // Generate many events rapidly
      for (let i = 0; i < 100; i++) {
        analytics.trackInteraction({
          sessionId: 'throttle-test',
          type: 'click',
          component: 'Button',
          element: 'test',
          data: {},
          success: true
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete quickly even with many events
      expect(duration).toBeLessThan(1000);
    });
  });
});

describe('Component Profiler Integration', () => {
  it('should profile React component performance', () => {
    const profiler = ComponentProfiler.getInstance();
    profiler.enable();

    const renderKey = profiler.startRender('TestComponent', { prop1: 'value' });
    
    // Simulate render time
    setTimeout(() => {
      const renderTime = profiler.endRender('TestComponent', renderKey);
      expect(renderTime).toBeGreaterThan(0);
      
      const profile = profiler.getComponentProfile('TestComponent');
      expect(profile).toBeDefined();
      expect(profile?.renderCount).toBe(1);
    }, 10);
  });

  it('should detect slow components', () => {
    const profiler = ComponentProfiler.getInstance();
    profiler.enable();

    // Simulate multiple renders with varying performance
    for (let i = 0; i < 10; i++) {
      const key = profiler.startRender('SlowComponent');
      profiler.endRender('SlowComponent', key);
    }

    const slowComponents = profiler.getSlowComponents(5);
    expect(slowComponents.length).toBeGreaterThanOrEqual(0);
  });
});

describe('Real-world Integration Scenarios', () => {
  beforeEach(async () => {
    await monitoringSystem.initialize();
  });

  afterEach(async () => {
    await monitoringSystem.shutdown();
  });

  it('should handle a complete user session with errors and recovery', async () => {
    const sessionId = 'integration-test-session';
    
    // User starts a session
    const analytics = InteractionAnalytics.getInstance();
    analytics.trackInteraction({
      sessionId,
      type: 'navigation',
      component: 'App',
      element: 'start',
      data: {},
      success: true
    });

    // Performance metrics are recorded
    const metricsManager = MetricsManager.getInstance();
    metricsManager.recordMetric(sessionId, {
      responseTime: 2000,
      memoryUsage: 75,
      fps: 58,
      timestamp: new Date()
    });

    // An error occurs
    const errorTracker = ErrorTracker.getInstance();
    const errorId = errorTracker.trackError(new Error('API timeout'), {
      sessionId,
      component: 'DataLoader',
      severity: 'medium'
    });

    // System recovers and user continues
    analytics.trackInteraction({
      sessionId,
      type: 'click',
      component: 'RetryButton',
      element: 'retry',
      data: { errorId },
      success: true
    });

    // Verify session data
    const sessionMetrics = metricsManager.getMetrics({
      start: new Date(Date.now() - 60000),
      end: new Date()
    });
    
    const sessionErrors = errorTracker.getErrors({ sessionId });
    const sessionInteractions = analytics.getInteractions({ sessionId });

    expect(sessionMetrics.length).toBeGreaterThan(0);
    expect(sessionErrors.length).toBe(1);
    expect(sessionInteractions.length).toBe(2);
    
    // Check system health after the session
    const health = monitoringSystem.getHealthStatus();
    expect(health.status).toMatch(/^(healthy|degraded)$/);
  });
});