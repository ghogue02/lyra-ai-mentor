/**
 * Fixed Usage Examples for GPT-4.1 Performance Validation System
 * Demonstrates proper implementation patterns with corrected interfaces
 */

import { PerformanceConfig } from '../index';
import { CostAnalyzer, PerformanceMonitor, OptimizationEngine, BenchmarkRunner } from '../stubs';

// Example 1: Basic Setup with Corrected Configuration
export const basicSetupExample = (): PerformanceConfig => {
  return {
    costAnalysis: {
      budgetLimit: 1000,
      alertThreshold: 80,
      trackingEnabled: true
    },
    monitoring: {
      enabled: true,
      intervalMs: 60000,
      alertsEnabled: true,
      retentionHours: 24
    },
    optimization: {
      cachingEnabled: true,
      compressionEnabled: true,
      batchingEnabled: true,
      maxCacheSize: 1000,
      compressionThreshold: 500000
    },
    benchmarking: {
      autoRunEnabled: false,
      scheduleIntervalHours: 24
    }
  };
};

// Example 2: Production Configuration
export const productionConfigExample = (): PerformanceConfig => {
  return {
    costAnalysis: {
      budgetLimit: 5000,
      alertThreshold: 70,
      trackingEnabled: true
    },
    monitoring: {
      enabled: true,
      intervalMs: 30000,
      alertsEnabled: true,
      retentionHours: 168 // 7 days
    },
    optimization: {
      cachingEnabled: true,
      compressionEnabled: true,
      batchingEnabled: true,
      maxCacheSize: 10000,
      compressionThreshold: 1000000
    },
    benchmarking: {
      autoRunEnabled: true,
      scheduleIntervalHours: 12
    }
  };
};

// Example 3: Simple Cost Analysis
export const costAnalysisExample = () => {
  const costAnalyzer = new CostAnalyzer();
  
  // Log some usage
  costAnalyzer.logUsage({
    inputTokens: 1000,
    outputTokens: 500,
    timestamp: new Date(),
    model: 'gpt-4.1',
    context: 'Test request'
  });
  
  // Get metrics
  const metrics = costAnalyzer.getCostMetrics('day');
  console.log('Daily cost metrics:', metrics);
  
  // Get recommendations
  const recommendations = costAnalyzer.getOptimizationRecommendations();
  console.log('Cost optimization recommendations:', recommendations);
};

// Example 4: Performance Monitoring
export const performanceMonitoringExample = () => {
  const monitor = new PerformanceMonitor();
  
  // Start monitoring
  monitor.startMonitoring(60000);
  
  // Record some metrics
  monitor.recordMetrics({
    responseTime: 2500,
    throughput: 1.5,
    errorRate: 0.02
  });
  
  // Get performance stats
  const stats = monitor.getPerformanceStats('hour');
  console.log('Performance stats:', stats);
  
  // Check for alerts
  const alerts = monitor.getActiveAlerts();
  console.log('Active alerts:', alerts);
};

// Example 5: Optimization Engine Usage
export const optimizationExample = async () => {
  const optimizer = new OptimizationEngine();
  
  // Optimize a request
  const result = await optimizer.optimizeRequest(
    'Large context content here...',
    'Generate a summary',
    { enableCaching: true, enableCompression: true }
  );
  
  console.log('Optimization result:', result);
  
  // Get optimization metrics
  const metrics = optimizer.getOptimizationMetrics();
  console.log('Optimization metrics:', metrics);
};

// Example 6: Benchmark Runner
export const benchmarkExample = async () => {
  const costAnalyzer = new CostAnalyzer();
  const monitor = new PerformanceMonitor();
  const optimizer = new OptimizationEngine();
  const benchmarkRunner = new BenchmarkRunner(costAnalyzer, monitor, optimizer);
  
  // Run benchmark suite
  const results = await benchmarkRunner.runBenchmarkSuite('Standard Performance Test');
  console.log('Benchmark results:', results);
};

// Example 7: Real-world Integration
export const realWorldExample = async () => {
  // Initialize components
  const costAnalyzer = new CostAnalyzer();
  const monitor = new PerformanceMonitor();
  const optimizer = new OptimizationEngine();
  
  // Start monitoring
  monitor.startMonitoring(30000);
  
  // Simulate API request processing
  const context = "This is a sample context for testing purposes...";
  const prompt = "Please summarize the key points";
  
  try {
    // Start timing
    const startTime = Date.now();
    
    // Optimize request
    const optimized = await optimizer.optimizeRequest(context, prompt);
    
    // Simulate API call (in real implementation, this would be actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate metrics
    const responseTime = Date.now() - startTime;
    const tokensUsed = 1500; // Simulated
    
    // Log cost
    costAnalyzer.logUsage({
      inputTokens: 1000,
      outputTokens: 500,
      timestamp: new Date(),
      model: 'gpt-4.1',
      context: 'Real-world example'
    });
    
    // Record performance
    monitor.recordMetrics({
      responseTime,
      throughput: 1000 / responseTime,
      errorRate: 0
    });
    
    console.log('Request completed successfully', {
      responseTime,
      tokensUsed,
      optimized: optimized.tokensSaved > 0
    });
    
  } catch (error) {
    // Record error
    monitor.recordMetrics({
      responseTime: Date.now() - performance.now(),
      errorRate: 1,
      throughput: 0
    });
    
    console.error('Request failed:', error);
  }
};

// Example 8: Configuration with All Options
export const comprehensiveConfigExample = (): PerformanceConfig => {
  return {
    costAnalysis: {
      budgetLimit: 1000,
      alertThreshold: 80,
      trackingEnabled: true
    },
    monitoring: {
      enabled: true,
      intervalMs: 30000,
      alertsEnabled: true,
      retentionHours: 48
    },
    optimization: {
      cachingEnabled: true,
      compressionEnabled: true,
      batchingEnabled: true,
      maxCacheSize: 5000,
      compressionThreshold: 750000
    },
    benchmarking: {
      autoRunEnabled: true,
      scheduleIntervalHours: 24,
      customScenarios: [
        {
          name: 'Large Context Test',
          description: 'Test with large context windows',
          contextSize: 500000,
          outputLength: 2000,
          concurrency: 3,
          iterations: 10
        }
      ]
    }
  };
};