/**
 * Comprehensive test suite for GPT-4.1 Performance Validation System
 */

import { PerformanceValidationSystem, CostAnalyzer, PerformanceMonitor, OptimizationEngine, BenchmarkRunner } from '../index';

describe('PerformanceValidationSystem', () => {
  let perfSystem: PerformanceValidationSystem;

  beforeEach(() => {
    perfSystem = new PerformanceValidationSystem({
      costAnalysis: {
        budgetLimit: 100,
        alertThreshold: 80,
        trackingEnabled: true
      },
      monitoring: {
        enabled: true,
        intervalMs: 1000, // Fast intervals for testing
        alertsEnabled: true,
        retentionHours: 1
      },
      optimization: {
        cachingEnabled: true,
        compressionEnabled: true,
        batchingEnabled: true,
        maxCacheSize: 100,
        compressionThreshold: 1000
      },
      benchmarking: {
        autoRunEnabled: false,
        scheduleIntervalHours: 24
      }
    });
  });

  afterEach(async () => {
    await perfSystem.shutdown();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await expect(perfSystem.initialize()).resolves.not.toThrow();
    });

    it('should not initialize twice', async () => {
      await perfSystem.initialize();
      // Should not throw but should warn
      await expect(perfSystem.initialize()).resolves.not.toThrow();
    });
  });

  describe('Request Processing', () => {
    beforeEach(async () => {
      await perfSystem.initialize();
    });

    it('should process a basic request successfully', async () => {
      const context = 'Test context for GPT-4.1';
      const prompt = 'Generate a test response';

      const result = await perfSystem.processRequest(context, prompt);

      expect(result.result).toBeDefined();
      expect(result.metrics.cost).toBeGreaterThan(0);
      expect(result.metrics.responseTime).toBeGreaterThan(0);
      expect(result.metrics.tokensUsed).toBeGreaterThan(0);
    });

    it('should apply optimizations when enabled', async () => {
      const context = 'Test context'.repeat(1000); // Large context
      const prompt = 'Generate a test response';

      const result = await perfSystem.processRequest(context, prompt, {
        enableOptimization: true
      });

      expect(result.metrics.optimizationApplied).toBe(true);
    });

    it('should track costs when enabled', async () => {
      const context = 'Test context';
      const prompt = 'Generate a test response';

      const result = await perfSystem.processRequest(context, prompt, {
        trackCost: true
      });

      expect(result.metrics.cost).toBeGreaterThan(0);
    });
  });

  describe('System Status', () => {
    beforeEach(async () => {
      await perfSystem.initialize();
    });

    it('should return comprehensive system status', async () => {
      // Process a few requests to generate data
      await perfSystem.processRequest('Test 1', 'Prompt 1');
      await perfSystem.processRequest('Test 2', 'Prompt 2');

      const status = perfSystem.getSystemStatus();

      expect(status.cost).toBeDefined();
      expect(status.performance).toBeDefined();
      expect(status.optimization).toBeDefined();
      expect(status.alerts).toBeDefined();
      expect(status.recommendations).toBeDefined();
    });
  });

  describe('Performance Validation', () => {
    beforeEach(async () => {
      await perfSystem.initialize();
    });

    it('should run comprehensive validation', async () => {
      const validation = await perfSystem.runValidation();

      expect(validation.benchmarkResults).toBeDefined();
      expect(validation.systemStatus).toBeDefined();
      expect(validation.recommendations).toBeDefined();
      expect(validation.benchmarkResults.results.length).toBeGreaterThan(0);
    }, 30000); // Increase timeout for benchmark
  });
});

describe('CostAnalyzer', () => {
  let costAnalyzer: CostAnalyzer;

  beforeEach(() => {
    costAnalyzer = new CostAnalyzer();
  });

  describe('Cost Calculations', () => {
    it('should calculate GPT-4.1 costs correctly', () => {
      const cost = costAnalyzer.calculateRequestCost(1000000, 1000000, 'gpt-4.1');
      
      // $2 for 1M input tokens + $8 for 1M output tokens = $10
      expect(cost).toBe(10);
    });

    it('should calculate GPT-4 costs correctly', () => {
      const cost = costAnalyzer.calculateRequestCost(1000000, 1000000, 'gpt-4');
      
      // $30 for 1M input tokens + $60 for 1M output tokens = $90
      expect(cost).toBe(90);
    });

    it('should show cost savings with GPT-4.1', () => {
      const gpt41Cost = costAnalyzer.calculateRequestCost(1000000, 1000000, 'gpt-4.1');
      const gpt4Cost = costAnalyzer.calculateRequestCost(1000000, 1000000, 'gpt-4');
      
      const savings = (gpt4Cost - gpt41Cost) / gpt4Cost;
      expect(savings).toBeCloseTo(0.889); // ~89% savings
    });
  });

  describe('Usage Tracking', () => {
    it('should log usage correctly', () => {
      costAnalyzer.logUsage({
        inputTokens: 1000,
        outputTokens: 500,
        timestamp: new Date(),
        model: 'gpt-4.1',
        context: 'test'
      });

      const metrics = costAnalyzer.getCostMetrics('day');
      expect(metrics.totalCost).toBeGreaterThan(0);
    });

    it('should handle multiple usage entries', () => {
      for (let i = 0; i < 10; i++) {
        costAnalyzer.logUsage({
          inputTokens: 1000,
          outputTokens: 500,
          timestamp: new Date(),
          model: 'gpt-4.1',
          context: `test-${i}`
        });
      }

      const metrics = costAnalyzer.getCostMetrics('day');
      expect(metrics.averageCostPerRequest).toBeGreaterThan(0);
    });
  });

  describe('Budget Forecasting', () => {
    it('should forecast monthly budget correctly', () => {
      // Add some usage data
      for (let i = 0; i < 5; i++) {
        costAnalyzer.logUsage({
          inputTokens: 10000,
          outputTokens: 5000,
          timestamp: new Date(),
          model: 'gpt-4.1',
          context: `forecast-test-${i}`
        });
      }

      const forecast = costAnalyzer.forecastMonthlyBudget(100);
      
      expect(forecast.projectedCost).toBeGreaterThan(0);
      expect(forecast.budgetStatus).toBeDefined();
      expect(forecast.daysRemaining).toBeGreaterThan(0);
      expect(forecast.recommendedDailyLimit).toBeGreaterThan(0);
    });
  });

  describe('Model Comparison', () => {
    it('should compare costs between models', () => {
      const comparison = costAnalyzer.compareModelCosts(100000, 50000);
      
      expect(comparison.has('gpt-4.1')).toBe(true);
      expect(comparison.has('gpt-4')).toBe(true);
      expect(comparison.get('gpt-4.1')).toBeLessThan(comparison.get('gpt-4')!);
    });
  });
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    monitor.stopMonitoring();
  });

  describe('Metrics Recording', () => {
    it('should record performance metrics', () => {
      monitor.recordMetrics({
        responseTime: 5000,
        throughput: 2.5,
        errorRate: 0.01,
        contextProcessingTime: 3000,
        tokenProcessingRate: 1000
      });

      const stats = monitor.getPerformanceStats('hour');
      expect(stats.averageResponseTime).toBe(5000);
      expect(stats.averageThroughput).toBe(2.5);
    });

    it('should calculate percentiles correctly', () => {
      // Record multiple measurements
      for (let i = 1; i <= 100; i++) {
        monitor.recordMetrics({
          responseTime: i * 100, // 100, 200, 300, ..., 10000
          throughput: 1,
          errorRate: 0
        });
      }

      const stats = monitor.getPerformanceStats('hour');
      expect(stats.p95ResponseTime).toBe(9500); // 95th percentile
      expect(stats.p99ResponseTime).toBe(9900); // 99th percentile
    });
  });

  describe('Alert System', () => {
    it('should trigger alerts when thresholds are exceeded', () => {
      // Record high response time to trigger alert
      monitor.recordMetrics({
        responseTime: 35000, // Exceeds 30s threshold
        throughput: 1,
        errorRate: 0
      });

      const alerts = monitor.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].metric).toBe('responseTime');
      expect(alerts[0].severity).toBe('high');
    });

    it('should resolve alerts', () => {
      // Trigger an alert
      monitor.recordMetrics({
        responseTime: 35000,
        throughput: 1,
        errorRate: 0
      });

      const alerts = monitor.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);

      const alertId = alerts[0].id;
      const resolved = monitor.resolveAlert(alertId);
      
      expect(resolved).toBe(true);
      expect(monitor.getActiveAlerts().length).toBe(0);
    });
  });

  describe('Monitoring Control', () => {
    it('should start and stop monitoring', () => {
      monitor.startMonitoring(100); // Very fast interval for testing
      
      // Should be monitoring now
      expect(() => monitor.startMonitoring(100)).not.toThrow(); // Should warn but not throw

      monitor.stopMonitoring();
      // Monitoring should be stopped
    });
  });

  describe('Performance Trends', () => {
    it('should detect performance trends', () => {
      // Record improving response times
      for (let i = 10; i >= 1; i--) {
        monitor.recordMetrics({
          responseTime: i * 1000,
          throughput: 10 - i,
          errorRate: i * 0.01
        });
      }

      const trends = monitor.getPerformanceTrends(1);
      expect(trends.responseTimeTrend).toBe('improving');
      expect(trends.throughputTrend).toBe('improving');
      expect(trends.errorRateTrend).toBe('improving');
    });
  });
});

describe('OptimizationEngine', () => {
  let optimizer: OptimizationEngine;

  beforeEach(() => {
    optimizer = new OptimizationEngine();
  });

  describe('Request Optimization', () => {
    it('should optimize requests with caching enabled', async () => {
      const context = 'Test context for optimization';
      const prompt = 'Test prompt';

      const result = await optimizer.optimizeRequest(context, prompt, {
        enableCaching: true,
        enableCompression: false
      });

      expect(result.optimizedContext).toBeDefined();
      expect(result.optimizedPrompt).toBeDefined();
      expect(result.cacheKey).toBeDefined();
    });

    it('should compress large contexts', async () => {
      const largeContext = 'Large context '.repeat(10000); // Create large context
      const prompt = 'Test prompt';

      const result = await optimizer.optimizeRequest(largeContext, prompt, {
        enableCompression: true,
        maxContextLength: 1000 // Force compression
      });

      expect(result.compressionUsed).toBeDefined();
      expect(result.tokensSaved).toBeGreaterThan(0);
      expect(result.estimatedCostSaving).toBeGreaterThan(0);
    });
  });

  describe('Caching System', () => {
    it('should cache responses', () => {
      const cacheKey = 'test-key';
      const response = { content: 'Test response' };
      const contextHash = 'hash123';

      optimizer.cacheResponse(cacheKey, response, contextHash, 1000, 0.01);

      const metrics = optimizer.getOptimizationMetrics();
      expect(metrics.totalCacheEntries).toBe(1);
    });

    it('should clear cache', () => {
      optimizer.cacheResponse('key1', {}, 'hash1', 100, 0.001);
      optimizer.cacheResponse('key2', {}, 'hash2', 200, 0.002);

      expect(optimizer.getOptimizationMetrics().totalCacheEntries).toBe(2);

      optimizer.clearCache();
      expect(optimizer.getOptimizationMetrics().totalCacheEntries).toBe(0);
    });
  });

  describe('Request Batching', () => {
    it('should batch multiple requests', async () => {
      const requests = [
        {
          context: 'Context 1',
          prompt: 'Prompt 1',
          processor: async (ctx: string, prompt: string) => `Response for ${prompt}`
        },
        {
          context: 'Context 2',
          prompt: 'Prompt 2',
          processor: async (ctx: string, prompt: string) => `Response for ${prompt}`
        },
        {
          context: 'Context 3',
          prompt: 'Prompt 3',
          processor: async (ctx: string, prompt: string) => `Response for ${prompt}`
        }
      ];

      const results = await optimizer.batchRequests(requests, {
        batchSize: 2,
        delayBetweenBatches: 10
      });

      expect(results).toHaveLength(3);
      expect(results[0]).toBe('Response for Prompt 1');
      expect(results[1]).toBe('Response for Prompt 2');
      expect(results[2]).toBe('Response for Prompt 3');
    });
  });

  describe('Request Routing', () => {
    it('should route large contexts to GPT-4.1', () => {
      const largeContext = 'x'.repeat(200000); // Large context
      const prompt = 'Test prompt';

      const routing = optimizer.routeRequest(largeContext, prompt);

      expect(routing.recommendedModel).toBe('gpt-4.1');
      expect(routing.reasoning).toContain('Large context');
    });

    it('should route cost-sensitive requests to cheaper models', () => {
      const context = 'Small context';
      const prompt = 'Test prompt';

      const routing = optimizer.routeRequest(context, prompt, {
        maxCost: 0.001
      });

      expect(routing.recommendedModel).toBe('gpt-3.5-turbo');
      expect(routing.reasoning).toContain('Cost optimization');
    });
  });

  describe('Optimization Recommendations', () => {
    it('should provide optimization recommendations', () => {
      const recommendations = optimizer.getOptimizationRecommendations();

      expect(recommendations.strategies).toBeDefined();
      expect(recommendations.currentEfficiency).toBeDefined();
      expect(recommendations.potentialSavings).toBeDefined();
    });
  });
});

describe('BenchmarkRunner', () => {
  let benchmarkRunner: BenchmarkRunner;
  let mockCostAnalyzer: any;
  let mockPerformanceMonitor: any;
  let mockOptimizationEngine: any;

  beforeEach(() => {
    mockCostAnalyzer = {
      calculateRequestCost: jest.fn().mockReturnValue(0.01)
    };
    mockPerformanceMonitor = {
      recordMetrics: jest.fn()
    };
    mockOptimizationEngine = {};

    benchmarkRunner = new BenchmarkRunner(
      mockCostAnalyzer,
      mockPerformanceMonitor,
      mockOptimizationEngine
    );
  });

  describe('Benchmark Execution', () => {
    it('should run a single scenario', async () => {
      const scenario = {
        name: 'Test Scenario',
        description: 'Test scenario for unit tests',
        contextSize: 1000,
        outputLength: 500,
        concurrency: 1,
        iterations: 2
      };

      const result = await benchmarkRunner.runScenario(scenario);

      expect(result.scenario).toBe('Test Scenario');
      expect(result.duration).toBeGreaterThan(0);
      expect(result.averageResponseTime).toBeGreaterThan(0);
      expect(result.successRate).toBeGreaterThan(0);
    });

    it('should run a complete benchmark suite', async () => {
      const customScenarios = [
        {
          name: 'Quick Test',
          description: 'Quick test scenario',
          contextSize: 100,
          outputLength: 50,
          concurrency: 1,
          iterations: 1
        }
      ];

      const suite = await benchmarkRunner.runBenchmarkSuite('Test Suite', customScenarios);

      expect(suite.name).toBe('Test Suite');
      expect(suite.scenarios).toHaveLength(1);
      expect(suite.results).toHaveLength(1);
      expect(suite.summary).toBeDefined();
      expect(suite.summary.recommendations).toBeDefined();
    }, 10000); // Increase timeout for benchmark
  });

  describe('Results Export', () => {
    it('should export results as JSON', async () => {
      const scenario = {
        name: 'Export Test',
        description: 'Test for export functionality',
        contextSize: 100,
        outputLength: 50,
        concurrency: 1,
        iterations: 1
      };

      const suite = await benchmarkRunner.runBenchmarkSuite('Export Test', [scenario]);
      const jsonExport = benchmarkRunner.exportResults(suite, 'json');

      expect(() => JSON.parse(jsonExport)).not.toThrow();
    });

    it('should export results as CSV', async () => {
      const scenario = {
        name: 'CSV Test',
        description: 'Test for CSV export',
        contextSize: 100,
        outputLength: 50,
        concurrency: 1,
        iterations: 1
      };

      const suite = await benchmarkRunner.runBenchmarkSuite('CSV Test', [scenario]);
      const csvExport = benchmarkRunner.exportResults(suite, 'csv');

      expect(csvExport).toContain('scenario,duration,averageResponseTime');
      expect(csvExport.split('\n').length).toBeGreaterThan(1);
    });
  });
});

// Integration tests
describe('Integration Tests', () => {
  let perfSystem: PerformanceValidationSystem;

  beforeEach(() => {
    perfSystem = new PerformanceValidationSystem({
      monitoring: { enabled: false }, // Disable monitoring for faster tests
      benchmarking: { autoRunEnabled: false }
    });
  });

  afterEach(async () => {
    await perfSystem.shutdown();
  });

  it('should handle end-to-end workflow', async () => {
    await perfSystem.initialize();

    // Process some requests
    const result1 = await perfSystem.processRequest('Context 1', 'Prompt 1');
    const result2 = await perfSystem.processRequest('Context 2', 'Prompt 2');

    expect(result1.result).toBeDefined();
    expect(result2.result).toBeDefined();

    // Get system status
    const status = perfSystem.getSystemStatus();
    expect(status).toBeDefined();

    // Run validation (quick version)
    const validation = await perfSystem.runValidation();
    expect(validation.benchmarkResults).toBeDefined();
  }, 20000);
});