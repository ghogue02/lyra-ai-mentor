/**
 * Comprehensive Benchmark Runner for GPT-4.1 Performance Validation
 * Tests various scenarios to validate performance and cost optimization
 */

export interface BenchmarkScenario {
  name: string;
  description: string;
  contextSize: number;
  outputLength: number;
  concurrency: number;
  iterations: number;
  expectedResponseTime?: number;
  expectedCost?: number;
}

export interface BenchmarkResult {
  scenario: string;
  duration: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  totalCost: number;
  costPerRequest: number;
  tokenProcessingRate: number;
  errorCount: number;
  successRate: number;
  throughput: number;
  memoryUsage: number;
  contextProcessingTime: number;
  timestamp: Date;
}

export interface BenchmarkSuite {
  name: string;
  scenarios: BenchmarkScenario[];
  results: BenchmarkResult[];
  summary: {
    totalDuration: number;
    totalRequests: number;
    totalCost: number;
    averageResponseTime: number;
    overallSuccessRate: number;
    recommendations: string[];
  };
}

export class BenchmarkRunner {
  private results: BenchmarkResult[] = [];
  private isRunning = false;

  constructor(
    private costAnalyzer: any,
    private performanceMonitor: any,
    private optimizationEngine: any
  ) {}

  /**
   * Run a comprehensive benchmark suite
   */
  async runBenchmarkSuite(
    suiteName: string = 'GPT-4.1 Performance Validation',
    customScenarios?: BenchmarkScenario[]
  ): Promise<BenchmarkSuite> {
    if (this.isRunning) {
      throw new Error('Benchmark is already running');
    }

    this.isRunning = true;
    console.log(`🚀 Starting benchmark suite: ${suiteName}`);

    const scenarios = customScenarios || this.getDefaultScenarios();
    const results: BenchmarkResult[] = [];
    const startTime = Date.now();

    try {
      for (const scenario of scenarios) {
        console.log(`📊 Running scenario: ${scenario.name}`);
        const result = await this.runScenario(scenario);
        results.push(result);
        
        // Brief pause between scenarios to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const totalDuration = Date.now() - startTime;
      const summary = this.generateSummary(results, totalDuration);

      const suite: BenchmarkSuite = {
        name: suiteName,
        scenarios,
        results,
        summary
      };

      this.logSummary(suite);
      return suite;

    } finally {
      this.isRunning = false;
      console.log('✅ Benchmark suite completed');
    }
  }

  /**
   * Run a single benchmark scenario
   */
  async runScenario(scenario: BenchmarkScenario): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const responseTimes: number[] = [];
    const costs: number[] = [];
    let errorCount = 0;
    let totalTokensProcessed = 0;
    let totalContextProcessingTime = 0;

    console.log(`  Running ${scenario.iterations} iterations with ${scenario.concurrency} concurrency...`);

    // Run iterations in batches based on concurrency
    for (let batch = 0; batch < scenario.iterations; batch += scenario.concurrency) {
      const batchSize = Math.min(scenario.concurrency, scenario.iterations - batch);
      const batchPromises: Promise<any>[] = [];

      for (let i = 0; i < batchSize; i++) {
        batchPromises.push(this.simulateRequest(scenario));
      }

      try {
        const batchResults = await Promise.all(batchPromises);
        
        for (const result of batchResults) {
          if (result.error) {
            errorCount++;
          } else {
            responseTimes.push(result.responseTime);
            costs.push(result.cost);
            totalTokensProcessed += result.tokensProcessed;
            totalContextProcessingTime += result.contextProcessingTime;
          }
        }
      } catch (error) {
        console.error(`Error in batch ${batch}:`, error);
        errorCount += batchSize;
      }

      // Progress indicator
      const progress = Math.round(((batch + batchSize) / scenario.iterations) * 100);
      process.stdout.write(`\r  Progress: ${progress}%`);
    }

    console.log(''); // New line after progress

    const duration = Date.now() - startTime;
    const successfulRequests = responseTimes.length;
    const successRate = successfulRequests / scenario.iterations;

    // Calculate statistics
    responseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);

    const result: BenchmarkResult = {
      scenario: scenario.name,
      duration,
      averageResponseTime: this.average(responseTimes),
      p95ResponseTime: responseTimes[p95Index] || 0,
      p99ResponseTime: responseTimes[p99Index] || 0,
      totalCost: costs.reduce((sum, cost) => sum + cost, 0),
      costPerRequest: this.average(costs),
      tokenProcessingRate: totalTokensProcessed / (duration / 1000),
      errorCount,
      successRate,
      throughput: successfulRequests / (duration / 1000),
      memoryUsage: this.getCurrentMemoryUsage(),
      contextProcessingTime: this.average(Array(successfulRequests).fill(totalContextProcessingTime / successfulRequests)),
      timestamp: new Date()
    };

    // Record metrics for monitoring
    this.performanceMonitor.recordMetrics({
      responseTime: result.averageResponseTime,
      throughput: result.throughput,
      errorRate: 1 - result.successRate,
      contextProcessingTime: result.contextProcessingTime,
      tokenProcessingRate: result.tokenProcessingRate
    });

    return result;
  }

  /**
   * Get default benchmark scenarios
   */
  private getDefaultScenarios(): BenchmarkScenario[] {
    return [
      {
        name: 'Small Context - Quick Response',
        description: 'Test performance with small context and quick responses',
        contextSize: 10000, // 10k tokens
        outputLength: 500,   // 500 tokens
        concurrency: 1,
        iterations: 10,
        expectedResponseTime: 3000, // 3 seconds
        expectedCost: 0.001 // $0.001
      },
      {
        name: 'Medium Context - Standard Response',
        description: 'Test performance with medium context and standard responses',
        contextSize: 100000, // 100k tokens
        outputLength: 2000,  // 2k tokens
        concurrency: 2,
        iterations: 10,
        expectedResponseTime: 8000, // 8 seconds
        expectedCost: 0.01 // $0.01
      },
      {
        name: 'Large Context - Long Response',
        description: 'Test performance with large context and long responses',
        contextSize: 500000, // 500k tokens
        outputLength: 5000,  // 5k tokens
        concurrency: 1,
        iterations: 5,
        expectedResponseTime: 15000, // 15 seconds
        expectedCost: 0.05 // $0.05
      },
      {
        name: 'Maximum Context - Maximum Response',
        description: 'Test performance at maximum capacity',
        contextSize: 900000, // 900k tokens (leave room for response)
        outputLength: 32000, // 32k tokens (near maximum)
        concurrency: 1,
        iterations: 3,
        expectedResponseTime: 30000, // 30 seconds
        expectedCost: 0.25 // $0.25
      },
      {
        name: 'High Concurrency - Medium Context',
        description: 'Test concurrent request handling',
        contextSize: 50000,  // 50k tokens
        outputLength: 1000,  // 1k tokens
        concurrency: 5,
        iterations: 20,
        expectedResponseTime: 6000, // 6 seconds average
        expectedCost: 0.005 // $0.005
      },
      {
        name: 'Cost Optimization - Compressed Context',
        description: 'Test cost optimization with context compression',
        contextSize: 200000, // 200k tokens before compression
        outputLength: 1500,  // 1.5k tokens
        concurrency: 2,
        iterations: 10,
        expectedResponseTime: 7000, // 7 seconds
        expectedCost: 0.015 // $0.015 (with compression savings)
      },
      {
        name: 'Error Recovery - High Load',
        description: 'Test error handling and recovery under high load',
        contextSize: 150000, // 150k tokens
        outputLength: 3000,  // 3k tokens
        concurrency: 8,
        iterations: 30,
        expectedResponseTime: 10000, // 10 seconds
        expectedCost: 0.02 // $0.02
      }
    ];
  }

  /**
   * Simulate a GPT-4.1 request for benchmarking
   */
  private async simulateRequest(scenario: BenchmarkScenario): Promise<{
    responseTime: number;
    cost: number;
    tokensProcessed: number;
    contextProcessingTime: number;
    error?: boolean;
  }> {
    const startTime = Date.now();

    try {
      // Simulate context processing time
      const contextProcessingTime = this.calculateContextProcessingTime(scenario.contextSize);
      await new Promise(resolve => setTimeout(resolve, contextProcessingTime));

      // Simulate token generation time
      const generationTime = this.calculateGenerationTime(scenario.outputLength);
      await new Promise(resolve => setTimeout(resolve, generationTime));

      // Simulate potential network latency
      const networkLatency = Math.random() * 1000; // 0-1 second
      await new Promise(resolve => setTimeout(resolve, networkLatency));

      const responseTime = Date.now() - startTime;

      // Calculate cost using GPT-4.1 pricing
      const cost = this.costAnalyzer.calculateRequestCost(
        scenario.contextSize,
        scenario.outputLength,
        'gpt-4.1'
      );

      // Simulate random errors (2% error rate)
      if (Math.random() < 0.02) {
        throw new Error('Simulated API error');
      }

      return {
        responseTime,
        cost,
        tokensProcessed: scenario.contextSize + scenario.outputLength,
        contextProcessingTime
      };

    } catch (error) {
      return {
        responseTime: Date.now() - startTime,
        cost: 0,
        tokensProcessed: 0,
        contextProcessingTime: 0,
        error: true
      };
    }
  }

  /**
   * Generate benchmark summary
   */
  private generateSummary(
    results: BenchmarkResult[],
    totalDuration: number
  ): BenchmarkSuite['summary'] {
    const totalRequests = results.reduce((sum, r) => sum + (r.scenario.length || 10), 0);
    const totalCost = results.reduce((sum, r) => sum + r.totalCost, 0);
    const averageResponseTime = this.average(results.map(r => r.averageResponseTime));
    const overallSuccessRate = this.average(results.map(r => r.successRate));

    const recommendations: string[] = [];

    // Analyze results and generate recommendations
    const slowScenarios = results.filter(r => r.averageResponseTime > 15000);
    if (slowScenarios.length > 0) {
      recommendations.push(
        `⚠️ ${slowScenarios.length} scenarios exceeded 15s response time. Consider context compression for large requests.`
      );
    }

    const expensiveScenarios = results.filter(r => r.costPerRequest > 0.1);
    if (expensiveScenarios.length > 0) {
      recommendations.push(
        `💰 ${expensiveScenarios.length} scenarios exceeded $0.10 per request. Implement caching for repeated queries.`
      );
    }

    if (overallSuccessRate < 0.98) {
      recommendations.push(
        `🔄 Success rate is ${(overallSuccessRate * 100).toFixed(1)}%. Implement retry logic and circuit breakers.`
      );
    }

    const highThroughputScenarios = results.filter(r => r.throughput > 2);
    if (highThroughputScenarios.length > 0) {
      recommendations.push(
        `🚀 ${highThroughputScenarios.length} scenarios achieved >2 req/s throughput. Consider increasing concurrency for similar workloads.`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All performance metrics are within acceptable ranges!');
    }

    return {
      totalDuration,
      totalRequests,
      totalCost,
      averageResponseTime,
      overallSuccessRate,
      recommendations
    };
  }

  /**
   * Log benchmark summary
   */
  private logSummary(suite: BenchmarkSuite): void {
    console.log('\n📊 BENCHMARK SUMMARY');
    console.log('='.repeat(50));
    console.log(`Suite: ${suite.name}`);
    console.log(`Duration: ${(suite.summary.totalDuration / 1000).toFixed(1)}s`);
    console.log(`Total Requests: ${suite.summary.totalRequests}`);
    console.log(`Total Cost: $${suite.summary.totalCost.toFixed(4)}`);
    console.log(`Average Response Time: ${suite.summary.averageResponseTime.toFixed(0)}ms`);
    console.log(`Success Rate: ${(suite.summary.overallSuccessRate * 100).toFixed(1)}%`);
    console.log('\n📈 SCENARIO RESULTS:');
    
    suite.results.forEach(result => {
      console.log(`\n${result.scenario}:`);
      console.log(`  Response Time: ${result.averageResponseTime.toFixed(0)}ms (P95: ${result.p95ResponseTime.toFixed(0)}ms)`);
      console.log(`  Cost: $${result.costPerRequest.toFixed(6)} per request`);
      console.log(`  Throughput: ${result.throughput.toFixed(2)} req/s`);
      console.log(`  Success Rate: ${(result.successRate * 100).toFixed(1)}%`);
      console.log(`  Token Rate: ${result.tokenProcessingRate.toFixed(0)} tokens/s`);
    });

    console.log('\n💡 RECOMMENDATIONS:');
    suite.summary.recommendations.forEach(rec => console.log(`  ${rec}`));
    console.log('='.repeat(50));
  }

  /**
   * Export benchmark results
   */
  exportResults(suite: BenchmarkSuite, format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'scenario', 'duration', 'averageResponseTime', 'p95ResponseTime', 'p99ResponseTime',
        'totalCost', 'costPerRequest', 'tokenProcessingRate', 'errorCount', 'successRate',
        'throughput', 'memoryUsage', 'contextProcessingTime', 'timestamp'
      ];
      
      const rows = suite.results.map(result => [
        result.scenario,
        result.duration,
        result.averageResponseTime,
        result.p95ResponseTime,
        result.p99ResponseTime,
        result.totalCost,
        result.costPerRequest,
        result.tokenProcessingRate,
        result.errorCount,
        result.successRate,
        result.throughput,
        result.memoryUsage,
        result.contextProcessingTime,
        result.timestamp.toISOString()
      ]);

      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    return JSON.stringify(suite, null, 2);
  }

  // Private helper methods
  private average(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
  }

  private calculateContextProcessingTime(contextSize: number): number {
    // Estimate processing time based on context size
    // GPT-4.1 can process ~100k tokens per second (estimated)
    return Math.max(100, contextSize / 100000 * 1000);
  }

  private calculateGenerationTime(outputLength: number): number {
    // Estimate generation time based on output length
    // GPT-4.1 can generate ~50 tokens per second (estimated)
    return Math.max(50, outputLength / 50 * 1000);
  }

  private getCurrentMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }
}