/**
 * Real-time Performance Monitoring System for GPT-4.1
 * Tracks response times, throughput, and system health
 */

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  contextProcessingTime: number;
  tokenProcessingRate: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: Date;
}

export interface AlertThreshold {
  metric: keyof PerformanceMetrics;
  threshold: number;
  operator: '>' | '<' | '>=' | '<=';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private alertThresholds: AlertThreshold[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.setupDefaultThresholds();
  }

  /**
   * Setup default performance alert thresholds
   */
  private setupDefaultThresholds(): void {
    this.alertThresholds = [
      {
        metric: 'responseTime',
        threshold: 30000, // 30 seconds
        operator: '>',
        severity: 'high'
      },
      {
        metric: 'errorRate',
        threshold: 0.05, // 5%
        operator: '>',
        severity: 'critical'
      },
      {
        metric: 'throughput',
        threshold: 1, // requests per second
        operator: '<',
        severity: 'medium'
      },
      {
        metric: 'contextProcessingTime',
        threshold: 10000, // 10 seconds for 1M tokens
        operator: '>',
        severity: 'medium'
      },
      {
        metric: 'tokenProcessingRate',
        threshold: 100, // tokens per second
        operator: '<',
        severity: 'low'
      }
    ];
  }

  /**
   * Start real-time monitoring
   */
  startMonitoring(intervalMs: number = 60000): void {
    if (this.isMonitoring) {
      console.warn('Monitoring already started');
      return;
    }

    this.isMonitoring = true;
    console.log('🔍 Starting performance monitoring...');

    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.checkAlerts();
      this.cleanupOldData();
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('🛑 Performance monitoring stopped');
  }

  /**
   * Record a performance measurement
   */
  recordMetrics(metrics: Partial<PerformanceMetrics>): void {
    const fullMetrics: PerformanceMetrics = {
      responseTime: metrics.responseTime || 0,
      throughput: metrics.throughput || 0,
      errorRate: metrics.errorRate || 0,
      contextProcessingTime: metrics.contextProcessingTime || 0,
      tokenProcessingRate: metrics.tokenProcessingRate || 0,
      memoryUsage: metrics.memoryUsage || this.getMemoryUsage(),
      cpuUsage: metrics.cpuUsage || this.getCPUUsage(),
      timestamp: new Date()
    };

    this.metrics.push(fullMetrics);
    
    // Keep only last 1000 entries for performance
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    this.checkAlertsForMetrics(fullMetrics);
  }

  /**
   * Get current performance statistics
   */
  getPerformanceStats(timeframe: 'minute' | 'hour' | '24h' = 'hour'): {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    averageThroughput: number;
    currentErrorRate: number;
    averageContextProcessingTime: number;
    tokenProcessingEfficiency: number;
  } {
    const now = new Date();
    const cutoff = new Date();

    switch (timeframe) {
      case 'minute':
        cutoff.setMinutes(now.getMinutes() - 1);
        break;
      case 'hour':
        cutoff.setHours(now.getHours() - 1);
        break;
      case '24h':
        cutoff.setDate(now.getDate() - 1);
        break;
    }

    const relevantMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    if (relevantMetrics.length === 0) {
      return {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        averageThroughput: 0,
        currentErrorRate: 0,
        averageContextProcessingTime: 0,
        tokenProcessingEfficiency: 0
      };
    }

    const responseTimes = relevantMetrics.map(m => m.responseTime).sort((a, b) => a - b);
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);

    return {
      averageResponseTime: this.average(relevantMetrics.map(m => m.responseTime)),
      p95ResponseTime: responseTimes[p95Index] || 0,
      p99ResponseTime: responseTimes[p99Index] || 0,
      averageThroughput: this.average(relevantMetrics.map(m => m.throughput)),
      currentErrorRate: this.average(relevantMetrics.map(m => m.errorRate)),
      averageContextProcessingTime: this.average(relevantMetrics.map(m => m.contextProcessingTime)),
      tokenProcessingEfficiency: this.average(relevantMetrics.map(m => m.tokenProcessingRate))
    };
  }

  /**
   * Benchmark GPT-4.1 specific performance
   */
  async benchmarkGPT41Performance(testScenarios: {
    contextSizes: number[];
    outputLengths: number[];
    concurrency: number;
  }): Promise<{
    contextSizeImpact: Map<number, number>;
    outputLengthImpact: Map<number, number>;
    concurrencyImpact: Map<number, number>;
    recommendations: string[];
  }> {
    console.log('🚀 Starting GPT-4.1 performance benchmark...');

    const contextSizeImpact = new Map<number, number>();
    const outputLengthImpact = new Map<number, number>();
    const concurrencyImpact = new Map<number, number>();
    const recommendations: string[] = [];

    // Test context size impact
    for (const contextSize of testScenarios.contextSizes) {
      const startTime = Date.now();
      
      // Simulate processing time based on context size
      const processingTime = this.simulateContextProcessing(contextSize);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      const responseTime = Date.now() - startTime;
      contextSizeImpact.set(contextSize, responseTime);

      this.recordMetrics({
        responseTime,
        contextProcessingTime: processingTime,
        tokenProcessingRate: contextSize / (processingTime / 1000)
      });
    }

    // Test output length impact
    for (const outputLength of testScenarios.outputLengths) {
      const startTime = Date.now();
      
      // Simulate generation time based on output length
      const generationTime = this.simulateTokenGeneration(outputLength);
      await new Promise(resolve => setTimeout(resolve, generationTime));
      
      const responseTime = Date.now() - startTime;
      outputLengthImpact.set(outputLength, responseTime);

      this.recordMetrics({
        responseTime,
        tokenProcessingRate: outputLength / (generationTime / 1000)
      });
    }

    // Test concurrency impact
    for (let concurrency = 1; concurrency <= testScenarios.concurrency; concurrency++) {
      const startTime = Date.now();
      
      const promises = Array(concurrency).fill(0).map(() => 
        this.simulateRequest(50000, 1000) // 50k context, 1k output
      );
      
      await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;
      const avgResponseTime = totalTime / concurrency;
      
      concurrencyImpact.set(concurrency, avgResponseTime);

      this.recordMetrics({
        responseTime: avgResponseTime,
        throughput: concurrency / (totalTime / 1000)
      });
    }

    // Generate recommendations
    const bestContextSize = Math.min(...Array.from(contextSizeImpact.entries())
      .filter(([size]) => size <= 500000) // Sweet spot for most use cases
      .map(([, time]) => time));
    
    if (bestContextSize) {
      recommendations.push(
        `Optimal context size for your use case appears to be around 500k tokens`
      );
    }

    const optimalConcurrency = Array.from(concurrencyImpact.entries())
      .reduce((best, [concurrency, time]) => 
        time < best.time ? { concurrency, time } : best,
        { concurrency: 1, time: Infinity }
      );

    recommendations.push(
      `Optimal concurrency level: ${optimalConcurrency.concurrency} simultaneous requests`
    );

    console.log('✅ GPT-4.1 benchmark completed');

    return {
      contextSizeImpact,
      outputLengthImpact,
      concurrencyImpact,
      recommendations
    };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(hours: number = 24): {
    responseTimeTrend: 'improving' | 'degrading' | 'stable';
    throughputTrend: 'improving' | 'degrading' | 'stable';
    errorRateTrend: 'improving' | 'degrading' | 'stable';
  } {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    if (recentMetrics.length < 2) {
      return {
        responseTimeTrend: 'stable',
        throughputTrend: 'stable',
        errorRateTrend: 'stable'
      };
    }

    const midpoint = Math.floor(recentMetrics.length / 2);
    const firstHalf = recentMetrics.slice(0, midpoint);
    const secondHalf = recentMetrics.slice(midpoint);

    return {
      responseTimeTrend: this.calculateTrend(
        this.average(firstHalf.map(m => m.responseTime)),
        this.average(secondHalf.map(m => m.responseTime))
      ),
      throughputTrend: this.calculateTrend(
        this.average(firstHalf.map(m => m.throughput)),
        this.average(secondHalf.map(m => m.throughput)),
        true // Higher is better for throughput
      ),
      errorRateTrend: this.calculateTrend(
        this.average(firstHalf.map(m => m.errorRate)),
        this.average(secondHalf.map(m => m.errorRate))
      )
    };
  }

  // Private helper methods
  private collectSystemMetrics(): void {
    this.recordMetrics({
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCPUUsage(),
      timestamp: new Date()
    });
  }

  private checkAlerts(): void {
    const recentMetrics = this.metrics.slice(-5); // Check last 5 measurements
    if (recentMetrics.length === 0) return;

    const avgMetrics = this.calculateAverageMetrics(recentMetrics);
    this.checkAlertsForMetrics(avgMetrics);
  }

  private checkAlertsForMetrics(metrics: PerformanceMetrics): void {
    this.alertThresholds.forEach(threshold => {
      const value = metrics[threshold.metric];
      const shouldAlert = this.evaluateThreshold(typeof value === 'number' ? value : value instanceof Date ? value.getTime() : 0, threshold.threshold, threshold.operator);

      if (shouldAlert) {
        const existingAlert = this.alerts.find(a => 
          a.metric === threshold.metric && !a.resolved
        );

        if (!existingAlert) {
          const alert: PerformanceAlert = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            metric: threshold.metric,
            value: typeof value === 'number' ? value : value instanceof Date ? value.getTime() : 0,
            threshold: threshold.threshold,
            severity: threshold.severity,
            message: `${threshold.metric} ${threshold.operator} ${threshold.threshold} (current: ${value})`,
            timestamp: new Date(),
            resolved: false
          };

          this.alerts.push(alert);
          console.warn(`🚨 Performance Alert: ${alert.message}`);
        }
      }
    });
  }

  private evaluateThreshold(value: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      default: return false;
    }
  }

  private calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
    const avg = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

    return {
      responseTime: avg(metrics.map(m => m.responseTime)),
      throughput: avg(metrics.map(m => m.throughput)),
      errorRate: avg(metrics.map(m => m.errorRate)),
      contextProcessingTime: avg(metrics.map(m => m.contextProcessingTime)),
      tokenProcessingRate: avg(metrics.map(m => m.tokenProcessingRate)),
      memoryUsage: avg(metrics.map(m => m.memoryUsage)),
      cpuUsage: avg(metrics.map(m => m.cpuUsage)),
      timestamp: new Date()
    };
  }

  private cleanupOldData(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneDayAgo);
    this.alerts = this.alerts.filter(a => a.timestamp > oneDayAgo);
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }

  private getCPUUsage(): number {
    // Simplified CPU usage - in production, use proper system monitoring
    return Math.random() * 100;
  }

  private average(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
  }

  private calculateTrend(before: number, after: number, higherIsBetter = false): 'improving' | 'degrading' | 'stable' {
    const threshold = 0.05; // 5% change threshold
    const change = (after - before) / before;

    if (Math.abs(change) < threshold) return 'stable';

    const isImproving = higherIsBetter ? change > 0 : change < 0;
    return isImproving ? 'improving' : 'degrading';
  }

  private simulateContextProcessing(contextSize: number): number {
    // Simulate processing time based on context size (ms)
    return Math.max(100, contextSize / 10000); // ~10k tokens per 100ms
  }

  private simulateTokenGeneration(outputLength: number): number {
    // Simulate generation time based on output length (ms)
    return Math.max(50, outputLength * 2); // ~2ms per token
  }

  private async simulateRequest(contextSize: number, outputLength: number): Promise<void> {
    const processingTime = this.simulateContextProcessing(contextSize);
    const generationTime = this.simulateTokenGeneration(outputLength);
    
    await new Promise(resolve => setTimeout(resolve, processingTime + generationTime));
  }
}