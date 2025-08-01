/**
 * GPT-4.1 Performance Validation System Usage Examples
 * Comprehensive examples demonstrating all system capabilities
 */

import { 
  PerformanceValidationSystem, 
  CostAnalyzer, 
  PerformanceMonitor, 
  OptimizationEngine, 
  BenchmarkRunner 
} from '../index';

/**
 * Example 1: Basic Setup and Usage
 */
export async function basicUsageExample(): Promise<void> {
  console.log('🚀 Basic Usage Example');
  console.log('=' .repeat(40));

  // Initialize the performance validation system
  const perfSystem = new PerformanceValidationSystem({
    costAnalysis: {
      enabled: true,
      budgetLimits: { monthly: 1000 },
      trackingEnabled: true
    },
    monitoring: {
      enabled: true,
      intervalMs: 30000,
      alertsEnabled: true
    },
    optimization: {
      cachingEnabled: true,
      compressionEnabled: true
    }
  });

  await perfSystem.initialize();

  // Process a sample request
  const context = `
    You are an AI tutor helping students learn about machine learning.
    The student is working on understanding neural networks and backpropagation.
    Previous lesson covered perceptrons and basic neural network architecture.
    
    Student's current question: "How does backpropagation actually update the weights?"
  `;

  const prompt = 'Explain backpropagation in simple terms with a practical example';

  const result = await perfSystem.processRequest(context, prompt, {
    model: 'gpt-4.1',
    enableOptimization: true,
    trackCost: true,
    trackPerformance: true
  });

  console.log('📊 Request Results:');
  console.log(`  Cost: $${result.metrics.cost.toFixed(6)}`);
  console.log(`  Response Time: ${result.metrics.responseTime}ms`);
  console.log(`  Tokens Used: ${result.metrics.tokensUsed}`);
  console.log(`  Optimization Applied: ${result.metrics.optimizationApplied}`);
  console.log(`  Cache Hit: ${result.metrics.cacheHit}`);

  await perfSystem.shutdown();
}

/**
 * Example 2: Cost Analysis and Budget Management
 */
export async function costAnalysisExample(): Promise<void> {
  console.log('\n💰 Cost Analysis Example');
  console.log('=' .repeat(40));

  const costAnalyzer = new CostAnalyzer();

  // Simulate multiple API calls with different models
  const testCalls = [
    { input: 50000, output: 2000, model: 'gpt-4.1', context: 'lesson-generation' },
    { input: 100000, output: 3000, model: 'gpt-4.1', context: 'detailed-explanation' },
    { input: 200000, output: 5000, model: 'gpt-4.1', context: 'comprehensive-tutorial' },
    { input: 50000, output: 2000, model: 'gpt-4', context: 'comparison-test' }
  ];

  console.log('📈 Logging usage data...');
  testCalls.forEach(call => {
    costAnalyzer.logUsage({
      inputTokens: call.input,
      outputTokens: call.output,
      timestamp: new Date(),
      model: call.model,
      context: call.context
    });
  });

  // Analyze costs
  const dailyMetrics = costAnalyzer.getCostMetrics('day');
  console.log('\n💸 Daily Cost Metrics:');
  console.log(`  Total Cost: $${dailyMetrics.totalCost.toFixed(4)}`);
  console.log(`  Average Cost per Request: $${dailyMetrics.averageCostPerRequest.toFixed(6)}`);
  console.log(`  Token Efficiency: $${dailyMetrics.tokenEfficiency.toFixed(8)} per 1k tokens`);

  // Compare model costs
  const comparison = costAnalyzer.compareModelCosts(100000, 2000);
  console.log('\n🔄 Model Cost Comparison (100k input, 2k output):');
  comparison.forEach((cost, model) => {
    console.log(`  ${model}: $${cost.toFixed(4)}`);
  });

  // Calculate savings
  const gpt41Cost = comparison.get('gpt-4.1') || 0;
  const gpt4Cost = comparison.get('gpt-4') || 0;
  const savings = ((gpt4Cost - gpt41Cost) / gpt4Cost) * 100;
  console.log(`  💰 GPT-4.1 Savings: ${savings.toFixed(1)}%`);

  // Budget forecasting
  const forecast = costAnalyzer.forecastMonthlyBudget(500);
  console.log('\n📊 Budget Forecast (Monthly limit: $500):');
  console.log(`  Projected Cost: $${forecast.projectedCost.toFixed(2)}`);
  console.log(`  Budget Status: ${forecast.budgetStatus}`);
  console.log(`  Days Remaining: ${forecast.daysRemaining}`);
  console.log(`  Recommended Daily Limit: $${forecast.recommendedDailyLimit.toFixed(2)}`);

  // Get optimization recommendations
  const recommendations = costAnalyzer.getOptimizationRecommendations();
  console.log('\n💡 Cost Optimization Recommendations:');
  recommendations.forEach(rec => console.log(`  - ${rec}`));
}

/**
 * Example 3: Performance Monitoring and Alerting
 */
export async function performanceMonitoringExample(): Promise<void> {
  console.log('\n⚡ Performance Monitoring Example');
  console.log('=' .repeat(40));

  const monitor = new PerformanceMonitor();

  // Start monitoring
  console.log('🔍 Starting performance monitoring...');
  monitor.startMonitoring(5000); // 5 second intervals

  // Simulate various performance scenarios
  const scenarios = [
    { name: 'Fast Response', responseTime: 2000, throughput: 3.0, errorRate: 0 },
    { name: 'Normal Response', responseTime: 5000, throughput: 2.0, errorRate: 0.01 },
    { name: 'Slow Response', responseTime: 12000, throughput: 0.8, errorRate: 0.02 },
    { name: 'Critical Slow', responseTime: 35000, throughput: 0.3, errorRate: 0.08 } // Should trigger alerts
  ];

  console.log('📊 Recording performance metrics...');
  for (const scenario of scenarios) {
    monitor.recordMetrics({
      responseTime: scenario.responseTime,
      throughput: scenario.throughput,
      errorRate: scenario.errorRate,
      contextProcessingTime: scenario.responseTime * 0.6,
      tokenProcessingRate: 1000 / (scenario.responseTime / 1000)
    });
    
    console.log(`  📈 ${scenario.name}: ${scenario.responseTime}ms, ${scenario.throughput} req/s`);
    
    // Brief pause to simulate real-time monitoring
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Wait a bit for alerts to process
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check for alerts
  const alerts = monitor.getActiveAlerts();
  console.log(`\n🚨 Active Alerts: ${alerts.length}`);
  alerts.forEach(alert => {
    console.log(`  - ${alert.severity.toUpperCase()}: ${alert.message}`);
  });

  // Get performance statistics
  const stats = monitor.getPerformanceStats('hour');
  console.log('\n📊 Performance Statistics:');
  console.log(`  Average Response Time: ${stats.averageResponseTime.toFixed(0)}ms`);
  console.log(`  P95 Response Time: ${stats.p95ResponseTime.toFixed(0)}ms`);
  console.log(`  P99 Response Time: ${stats.p99ResponseTime.toFixed(0)}ms`);
  console.log(`  Average Throughput: ${stats.averageThroughput.toFixed(2)} req/s`);
  console.log(`  Current Error Rate: ${(stats.currentErrorRate * 100).toFixed(2)}%`);

  // Analyze trends
  const trends = monitor.getPerformanceTrends(1);
  console.log('\n📈 Performance Trends:');
  console.log(`  Response Time: ${trends.responseTimeTrend}`);
  console.log(`  Throughput: ${trends.throughputTrend}`);
  console.log(`  Error Rate: ${trends.errorRateTrend}`);

  monitor.stopMonitoring();
}

/**
 * Example 4: Optimization Engine Features
 */
export async function optimizationEngineExample(): Promise<void> {
  console.log('\n🎯 Optimization Engine Example');
  console.log('=' .repeat(40));

  const optimizer = new OptimizationEngine();

  // Example 1: Context Compression
  const largeContext = `
    Advanced Machine Learning Course - Deep Learning Module
    
    Chapter 1: Introduction to Neural Networks
    Neural networks are computational models inspired by biological neural networks...
    [This would be a very large educational context - simulated with repetition]
    ${Array(1000).fill('Neural networks are powerful models for pattern recognition. ').join('')}
    
    Chapter 2: Backpropagation Algorithm
    The backpropagation algorithm is fundamental to training neural networks...
    ${Array(500).fill('Gradient descent optimizes network weights through iterative updates. ').join('')}
    
    Chapter 3: Advanced Architectures
    Convolutional Neural Networks (CNNs) are specialized for image processing...
    ${Array(800).fill('CNNs use convolution operations to detect local patterns. ').join('')}
  `;

  const prompt = 'Create a summary quiz for the neural networks chapter';

  console.log('🗜️ Testing context compression...');
  console.log(`  Original context size: ${largeContext.length} characters`);

  const optimized = await optimizer.optimizeRequest(largeContext, prompt, {
    enableCompression: true,
    compressionStrategy: 'semantic',
    maxContextLength: 100000
  });

  console.log(`  Compressed context size: ${optimized.optimizedContext.length} characters`);
  console.log(`  Tokens saved: ${optimized.tokensSaved}`);
  console.log(`  Estimated cost saving: $${optimized.estimatedCostSaving.toFixed(6)}`);

  if (optimized.compressionUsed) {
    console.log(`  Compression ratio: ${(optimized.compressionUsed.compressionRatio * 100).toFixed(1)}%`);
    console.log(`  Quality score: ${(optimized.compressionUsed.qualityScore * 100).toFixed(1)}%`);
  }

  // Example 2: Request Batching
  const batchRequests = [
    {
      context: 'Math lesson context 1',
      prompt: 'Explain quadratic equations',
      processor: async (ctx: string, p: string) => `Response for: ${p}`
    },
    {
      context: 'Science lesson context 2', 
      prompt: 'Explain photosynthesis',
      processor: async (ctx: string, p: string) => `Response for: ${p}`
    },
    {
      context: 'History lesson context 3',
      prompt: 'Explain World War II causes',
      processor: async (ctx: string, p: string) => `Response for: ${p}`
    },
    {
      context: 'Literature lesson context 4',
      prompt: 'Analyze Shakespeare themes',
      processor: async (ctx: string, p: string) => `Response for: ${p}`
    }
  ];

  console.log('\n📦 Testing request batching...');
  const startTime = Date.now();
  
  const batchResults = await optimizer.batchRequests(batchRequests, {
    batchSize: 2,
    delayBetweenBatches: 500
  });

  const batchTime = Date.now() - startTime;
  console.log(`  Batch processing completed in ${batchTime}ms`);
  console.log(`  Results: ${batchResults.length} responses generated`);

  // Example 3: Smart Model Routing
  const routingScenarios = [
    { context: 'Short question', prompt: 'What is 2+2?', maxCost: 0.001 },
    { context: 'x'.repeat(200000), prompt: 'Analyze this large document', maxLatency: 10000 },
    { context: 'Medium context', prompt: 'Explain concept', maxCost: 0.01, maxLatency: 15000 }
  ];

  console.log('\n🎯 Testing smart model routing...');
  routingScenarios.forEach((scenario, index) => {
    const routing = optimizer.routeRequest(scenario.context, scenario.prompt, {
      maxCost: scenario.maxCost,
      maxLatency: scenario.maxLatency
    });
    
    console.log(`  Scenario ${index + 1}:`);
    console.log(`    Recommended Model: ${routing.recommendedModel}`);
    console.log(`    Reasoning: ${routing.reasoning}`);
    console.log(`    Estimated Cost: $${routing.estimatedCost.toFixed(6)}`);
    console.log(`    Estimated Latency: ${routing.estimatedLatency}ms`);
  });

  // Get optimization metrics and recommendations
  const metrics = optimizer.getOptimizationMetrics();
  console.log('\n📊 Optimization Metrics:');
  console.log(`  Total Cost Saved: $${metrics.totalCostSaved.toFixed(6)}`);
  console.log(`  Total Tokens Saved: ${metrics.totalTokensSaved}`);
  console.log(`  Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`  Compression Uses: ${metrics.compressionUses}`);

  const recommendations = optimizer.getOptimizationRecommendations();
  console.log('\n💡 Optimization Recommendations:');
  console.log(`  Current Efficiency: ${recommendations.currentEfficiency.toFixed(1)}%`);
  console.log(`  Potential Savings: ${recommendations.potentialSavings.toFixed(1)}%`);
  recommendations.strategies.forEach(strategy => {
    console.log(`  - ${strategy.name}: ${strategy.expectedSavings}% savings (${strategy.priority} priority)`);
  });
}

/**
 * Example 5: Comprehensive Benchmarking
 */
export async function benchmarkingExample(): Promise<void> {
  console.log('\n📊 Benchmarking Example');
  console.log('=' .repeat(40));

  const mockCostAnalyzer = {
    calculateRequestCost: (input: number, output: number, model: string) => {
      const pricing = model === 'gpt-4.1' ? { input: 2, output: 8 } : { input: 30, output: 60 };
      return (input / 1000000 * pricing.input) + (output / 1000000 * pricing.output);
    }
  };

  const mockMonitor = {
    recordMetrics: (metrics: any) => {
      console.log(`    📈 Recorded: ${metrics.responseTime}ms, ${metrics.throughput} req/s`);
    }
  };

  const benchmarkRunner = new BenchmarkRunner(mockCostAnalyzer, mockMonitor, {});

  // Custom scenarios for educational AI use cases
  const educationalScenarios = [
    {
      name: 'Quick Q&A',
      description: 'Simple student question answering',
      contextSize: 5000,
      outputLength: 500,
      concurrency: 1,
      iterations: 5
    },
    {
      name: 'Lesson Plan Generation',
      description: 'Generate comprehensive lesson plans',
      contextSize: 50000,
      outputLength: 3000,
      concurrency: 1,
      iterations: 3
    },
    {
      name: 'Complex Tutorial Creation',
      description: 'Create detailed tutorials with examples',
      contextSize: 200000,
      outputLength: 8000,
      concurrency: 1,
      iterations: 2
    },
    {
      name: 'Multiple Student Interactions',
      description: 'Handle multiple students simultaneously',
      contextSize: 20000,
      outputLength: 1500,
      concurrency: 4,
      iterations: 8
    }
  ];

  console.log('🚀 Running educational AI benchmark suite...');
  const suite = await benchmarkRunner.runBenchmarkSuite(
    'Educational AI Performance Suite',
    educationalScenarios
  );

  // Export results
  console.log('\n📄 Exporting benchmark results...');
  const jsonResults = benchmarkRunner.exportResults(suite, 'json');
  console.log('JSON export length:', jsonResults.length, 'characters');

  const csvResults = benchmarkRunner.exportResults(suite, 'csv');
  console.log('CSV export preview:');
  console.log(csvResults.split('\n').slice(0, 3).join('\n') + '...');
}

/**
 * Example 6: Full System Integration
 */
export async function fullSystemExample(): Promise<void> {
  console.log('\n🎛️ Full System Integration Example');
  console.log('=' .repeat(40));

  // Initialize complete system
  const perfSystem = new PerformanceValidationSystem({
    costAnalysis: {
      enabled: true,
      budgetLimits: { daily: 50, monthly: 1000 },
      alertThresholds: { percentage: 75 },
      trackingEnabled: true
    },
    monitoring: {
      enabled: true,
      intervalMs: 10000,
      alertsEnabled: true,
      thresholds: {
        responseTime: { warning: 8000, critical: 20000 },
        errorRate: { warning: 0.03, critical: 0.1 },
        throughput: { minimum: 1.0 },
        tokenProcessingRate: { minimum: 100 }
      }
    },
    optimization: {
      cachingEnabled: true,
      compressionEnabled: true,
      batchingEnabled: true,
      maxCacheSize: 1000,
      compressionThreshold: 100000
    },
    dashboard: {
      enabled: true,
      refreshInterval: 15000,
      features: {
        realTimeMetrics: true,
        costTracking: true,
        alertManagement: true,
        benchmarkResults: true,
        optimizationRecommendations: true
      }
    }
  });

  await perfSystem.initialize();

  // Simulate various educational AI interactions
  const interactions = [
    {
      context: 'Student learning algebra, struggling with quadratic equations',
      prompt: 'Help me understand how to solve x² + 5x + 6 = 0'
    },
    {
      context: 'Advanced physics student working on quantum mechanics',
      prompt: 'Explain the uncertainty principle with mathematical examples'
    },
    {
      context: 'Literature class analyzing Shakespeare',
      prompt: 'What are the main themes in Hamlet and how do they interconnect?'
    },
    {
      context: 'Computer science student learning algorithms',
      prompt: 'Explain binary search algorithm with code examples'
    }
  ];

  console.log('🎓 Processing educational interactions...');
  const results = [];

  for (let i = 0; i < interactions.length; i++) {
    const interaction = interactions[i];
    console.log(`\n📚 Processing interaction ${i + 1}: ${interaction.prompt.substring(0, 50)}...`);
    
    const result = await perfSystem.processRequest(
      interaction.context,
      interaction.prompt,
      {
        model: 'gpt-4.1',
        enableOptimization: true,
        trackCost: true,
        trackPerformance: true
      }
    );

    results.push(result);
    
    console.log(`  💰 Cost: $${result.metrics.cost.toFixed(6)}`);
    console.log(`  ⚡ Time: ${result.metrics.responseTime}ms`);
    console.log(`  🎯 Optimized: ${result.metrics.optimizationApplied}`);
    
    // Brief pause between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Get comprehensive system status
  console.log('\n📊 System Status Summary:');
  const status = perfSystem.getSystemStatus();
  
  console.log('\n💰 Cost Summary:');
  console.log(`  Daily Cost: $${status.cost.dailyCost.toFixed(4)}`);
  console.log(`  Average per Request: $${status.cost.averageCostPerRequest.toFixed(6)}`);
  
  console.log('\n⚡ Performance Summary:');
  console.log(`  Average Response Time: ${status.performance.averageResponseTime.toFixed(0)}ms`);
  console.log(`  Throughput: ${status.performance.averageThroughput.toFixed(2)} req/s`);
  console.log(`  Error Rate: ${(status.performance.currentErrorRate * 100).toFixed(2)}%`);
  
  console.log('\n🎯 Optimization Summary:');
  console.log(`  Cache Hit Rate: ${(status.optimization.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`  Total Savings: $${status.optimization.totalCostSaved.toFixed(6)}`);
  
  console.log('\n🚨 Active Alerts:', status.alerts.length);
  status.alerts.forEach(alert => {
    console.log(`  - ${alert.severity}: ${alert.message}`);
  });
  
  console.log('\n💡 Recommendations:');
  status.recommendations.slice(0, 3).forEach(rec => {
    console.log(`  - ${rec}`);
  });

  // Run final validation
  console.log('\n🔍 Running comprehensive validation...');
  const validation = await perfSystem.runValidation();
  
  console.log('\n📈 Validation Results:');
  console.log(`  Scenarios Tested: ${validation.benchmarkResults.scenarios.length}`);
  console.log(`  Total Requests: ${validation.benchmarkResults.summary.totalRequests}`);
  console.log(`  Average Response Time: ${validation.benchmarkResults.summary.averageResponseTime.toFixed(0)}ms`);
  console.log(`  Success Rate: ${(validation.benchmarkResults.summary.overallSuccessRate * 100).toFixed(1)}%`);
  console.log(`  Total Cost: $${validation.benchmarkResults.summary.totalCost.toFixed(4)}`);

  await perfSystem.shutdown();
  console.log('\n✅ Full system example completed successfully!');
}

/**
 * Run all examples
 */
export async function runAllExamples(): Promise<void> {
  console.log('🎯 GPT-4.1 Performance Validation System - Complete Examples');
  console.log('=' .repeat(80));

  try {
    await basicUsageExample();
    await costAnalysisExample();
    await performanceMonitoringExample();
    await optimizationEngineExample();
    await benchmarkingExample();
    await fullSystemExample();
    
    console.log('\n🎉 All examples completed successfully!');
    console.log('\n📚 Summary of demonstrated features:');
    console.log('  ✅ Basic system setup and usage');
    console.log('  ✅ Cost analysis and budget management');
    console.log('  ✅ Performance monitoring and alerting');
    console.log('  ✅ Optimization engine capabilities');
    console.log('  ✅ Comprehensive benchmarking');
    console.log('  ✅ Full system integration');
    
  } catch (error) {
    console.error('❌ Examples failed:', error);
    process.exit(1);
  }
}

// Run examples if called directly
if (require.main === module) {
  runAllExamples();
}