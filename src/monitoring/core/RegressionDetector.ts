/**
 * Performance Regression Detection System
 * Identifies performance degradations and anomalies automatically
 */

import { RegressionInfo, PerformanceMetrics, MetricType } from '../types';

interface BaselineData {
  metric: MetricType;
  value: number;
  timestamp: Date;
  confidence: number; // 0-1 score
  sampleSize: number;
}

interface TrendData {
  metric: MetricType;
  values: number[];
  timestamps: Date[];
  trend: 'improving' | 'degrading' | 'stable';
  slope: number;
  correlation: number;
}

export class RegressionDetector {
  private static instance: RegressionDetector;
  private baselines: Map<MetricType, BaselineData> = new Map();
  private trends: Map<MetricType, TrendData> = new Map();
  private regressions: RegressionInfo[] = [];
  private isEnabled = false;
  private sensitivity = 0.15; // 15% change threshold
  private minSampleSize = 10;
  private maxTrendLength = 100;

  private constructor() {}

  static getInstance(): RegressionDetector {
    if (!RegressionDetector.instance) {
      RegressionDetector.instance = new RegressionDetector();
    }
    return RegressionDetector.instance;
  }

  /**
   * Enable regression detection
   */
  enable(): void {
    this.isEnabled = true;
    console.log('📈 Regression detection enabled');
  }

  /**
   * Disable regression detection
   */
  disable(): void {
    this.isEnabled = false;
    console.log('📈 Regression detection disabled');
  }

  /**
   * Update sensitivity threshold
   */
  setSensitivity(sensitivity: number): void {
    this.sensitivity = Math.max(0.01, Math.min(1.0, sensitivity));
    console.log(`📈 Regression sensitivity set to ${(this.sensitivity * 100).toFixed(1)}%`);
  }

  /**
   * Process new metrics and detect regressions
   */
  processMetrics(metrics: PerformanceMetrics): RegressionInfo[] {
    if (!this.isEnabled) return [];

    const detectedRegressions: RegressionInfo[] = [];
    const metricKeys: MetricType[] = [
      'responseTime', 'throughput', 'errorRate', 'memoryUsage', 
      'cpuUsage', 'fps', 'renderTime', 'loadTime', 'networkLatency'
    ];

    metricKeys.forEach(metricKey => {
      const value = metrics[metricKey];
      if (typeof value === 'number') {
        this.updateTrend(metricKey, value, metrics.timestamp);
        const regression = this.checkForRegression(metricKey, value);
        if (regression) {
          detectedRegressions.push(regression);
        }
      }
    });

    return detectedRegressions;
  }

  /**
   * Establish baselines from historical data
   */
  establishBaselines(historicalMetrics: PerformanceMetrics[]): void {
    if (historicalMetrics.length < this.minSampleSize) {
      console.warn('Insufficient data to establish baselines');
      return;
    }

    const metricKeys: MetricType[] = [
      'responseTime', 'throughput', 'errorRate', 'memoryUsage', 
      'cpuUsage', 'fps', 'renderTime', 'loadTime', 'networkLatency'
    ];

    metricKeys.forEach(metricKey => {
      const values = historicalMetrics
        .map(m => m[metricKey])
        .filter((v): v is number => typeof v === 'number');

      if (values.length >= this.minSampleSize) {
        const baseline = this.calculateBaseline(metricKey, values);
        this.baselines.set(metricKey, baseline);
      }
    });

    console.log(`📈 Established baselines for ${this.baselines.size} metrics`);
  }

  /**
   * Get current baselines
   */
  getBaselines(): Map<MetricType, BaselineData> {
    return new Map(this.baselines);
  }

  /**
   * Get trend data
   */
  getTrends(): Map<MetricType, TrendData> {
    return new Map(this.trends);
  }

  /**
   * Get detected regressions
   */
  getRegressions(filters?: {
    severity?: RegressionInfo['severity'][];
    metric?: MetricType[];
    timeRange?: { start: Date; end: Date };
  }): RegressionInfo[] {
    let filtered = this.regressions;

    if (filters) {
      filtered = this.regressions.filter(regression => {
        const matchesSeverity = !filters.severity || filters.severity.includes(regression.severity);
        const matchesMetric = !filters.metric || filters.metric.includes(regression.metric as MetricType);
        const matchesTimeRange = !filters.timeRange || (
          regression.detectedAt >= filters.timeRange.start && 
          regression.detectedAt <= filters.timeRange.end
        );

        return matchesSeverity && matchesMetric && matchesTimeRange;
      });
    }

    return filtered.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  /**
   * Get regression statistics
   */
  getRegressionStats(): {
    total: number;
    bySeverity: Record<RegressionInfo['severity'], number>;
    byMetric: Record<string, number>;
    avgImpact: number;
    criticalCount: number;
    resolvedCount: number;
  } {
    const stats = {
      total: this.regressions.length,
      bySeverity: { minor: 0, moderate: 0, severe: 0 },
      byMetric: {} as Record<string, number>,
      avgImpact: 0,
      criticalCount: 0,
      resolvedCount: 0
    };

    this.regressions.forEach(regression => {
      stats.bySeverity[regression.severity]++;
      stats.byMetric[regression.metric] = (stats.byMetric[regression.metric] || 0) + 1;
      
      if (regression.severity === 'severe') {
        stats.criticalCount++;
      }
      
      if (regression.mitigationPlan) {
        stats.resolvedCount++;
      }
    });

    if (this.regressions.length > 0) {
      stats.avgImpact = this.regressions.reduce((sum, r) => sum + Math.abs(r.changePercent), 0) / this.regressions.length;
    }

    return stats;
  }

  /**
   * Predict future performance issues
   */
  predictIssues(): Array<{
    metric: MetricType;
    probability: number;
    timeToIssue: number; // milliseconds
    severity: 'minor' | 'moderate' | 'severe';
    recommendation: string;
  }> {
    const predictions: Array<{
      metric: MetricType;
      probability: number;
      timeToIssue: number;
      severity: 'minor' | 'moderate' | 'severe';
      recommendation: string;
    }> = [];

    this.trends.forEach((trend, metric) => {
      if (trend.trend === 'degrading' && trend.correlation > 0.7) {
        const prediction = this.calculatePrediction(metric, trend);
        if (prediction.probability > 0.5) {
          predictions.push(prediction);
        }
      }
    });

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Analyze metric stability
   */
  analyzeStability(metric: MetricType): {
    isStable: boolean;
    volatility: number;
    coefficient: number;
    recommendations: string[];
  } {
    const trend = this.trends.get(metric);
    if (!trend || trend.values.length < this.minSampleSize) {
      return {
        isStable: false,
        volatility: 0,
        coefficient: 0,
        recommendations: ['Insufficient data for analysis']
      };
    }

    const mean = trend.values.reduce((sum, val) => sum + val, 0) / trend.values.length;
    const variance = trend.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / trend.values.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = mean > 0 ? stdDev / mean : 0;
    const volatility = coefficient * 100;

    const isStable = volatility < 20; // Less than 20% coefficient of variation
    
    const recommendations: string[] = [];
    if (!isStable) {
      recommendations.push(`High volatility detected (${volatility.toFixed(1)}%)`);
      
      if (metric === 'responseTime') {
        recommendations.push('Consider implementing request caching');
        recommendations.push('Review database query performance');
      } else if (metric === 'memoryUsage') {
        recommendations.push('Check for memory leaks');
        recommendations.push('Optimize component cleanup');
      } else if (metric === 'fps') {
        recommendations.push('Optimize rendering performance');
        recommendations.push('Reduce unnecessary re-renders');
      }
    }

    return {
      isStable,
      volatility,
      coefficient,
      recommendations
    };
  }

  /**
   * Clear regression history
   */
  clearRegressions(): void {
    this.regressions = [];
    console.log('📈 Regression history cleared');
  }

  /**
   * Export regression data
   */
  exportData(): string {
    const data = {
      baselines: Array.from(this.baselines.entries()),
      trends: Array.from(this.trends.entries()),
      regressions: this.regressions,
      stats: this.getRegressionStats(),
      predictions: this.predictIssues(),
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  // Private methods
  private updateTrend(metric: MetricType, value: number, timestamp: Date): void {
    let trend = this.trends.get(metric);
    
    if (!trend) {
      trend = {
        metric,
        values: [],
        timestamps: [],
        trend: 'stable',
        slope: 0,
        correlation: 0
      };
      this.trends.set(metric, trend);
    }

    trend.values.push(value);
    trend.timestamps.push(timestamp);

    // Limit trend length
    if (trend.values.length > this.maxTrendLength) {
      trend.values = trend.values.slice(-this.maxTrendLength);
      trend.timestamps = trend.timestamps.slice(-this.maxTrendLength);
    }

    // Update trend analysis
    if (trend.values.length >= this.minSampleSize) {
      this.analyzeTrend(trend);
    }
  }

  private analyzeTrend(trend: TrendData): void {
    const n = trend.values.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    
    // Calculate linear regression
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = trend.values.reduce((sum, y) => sum + y, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = trend.values[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }
    
    trend.slope = denominator !== 0 ? numerator / denominator : 0;
    
    // Calculate correlation coefficient
    let xSquareSum = 0;
    let ySquareSum = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = trend.values[i] - yMean;
      xSquareSum += xDiff * xDiff;
      ySquareSum += yDiff * yDiff;
    }
    
    const correlation = (xSquareSum * ySquareSum) > 0 ? 
      numerator / Math.sqrt(xSquareSum * ySquareSum) : 0;
    
    trend.correlation = Math.abs(correlation);
    
    // Determine trend direction
    if (Math.abs(trend.slope) < 0.01) {
      trend.trend = 'stable';
    } else if (trend.slope > 0) {
      // For some metrics, positive slope is bad (responseTime, errorRate)
      // For others, positive slope is good (throughput, fps)
      const badMetrics = ['responseTime', 'errorRate', 'memoryUsage', 'cpuUsage', 'networkLatency'];
      trend.trend = badMetrics.includes(trend.metric) ? 'degrading' : 'improving';
    } else {
      const badMetrics = ['responseTime', 'errorRate', 'memoryUsage', 'cpuUsage', 'networkLatency'];
      trend.trend = badMetrics.includes(trend.metric) ? 'improving' : 'degrading';
    }
  }

  private checkForRegression(metric: MetricType, currentValue: number): RegressionInfo | null {
    const baseline = this.baselines.get(metric);
    if (!baseline) return null;

    const changePercent = ((currentValue - baseline.value) / baseline.value) * 100;
    const absChangePercent = Math.abs(changePercent);

    // Check if change exceeds threshold
    if (absChangePercent < this.sensitivity * 100) return null;

    // Determine if this is actually a regression based on metric type
    const badMetrics = ['responseTime', 'errorRate', 'memoryUsage', 'cpuUsage', 'networkLatency'];
    const isRegression = badMetrics.includes(metric) ? 
      currentValue > baseline.value : 
      currentValue < baseline.value;

    if (!isRegression) return null;

    // Determine severity
    let severity: RegressionInfo['severity'];
    if (absChangePercent > 50) {
      severity = 'severe';
    } else if (absChangePercent > 25) {
      severity = 'moderate';
    } else {
      severity = 'minor';
    }

    const regression: RegressionInfo = {
      id: `regression-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metric,
      severity,
      currentValue,
      previousValue: baseline.value,
      changePercent,
      detectedAt: new Date(),
      rootCause: this.inferRootCause(metric, changePercent),
      mitigationPlan: this.generateMitigationPlan(metric, severity)
    };

    this.regressions.push(regression);
    
    // Update baseline if the regression is confirmed
    if (baseline.confidence > 0.8) {
      this.updateBaseline(metric, currentValue);
    }

    console.warn(`📈 Performance regression detected: ${metric} changed by ${changePercent.toFixed(1)}%`);
    
    return regression;
  }

  private calculateBaseline(metric: MetricType, values: number[]): BaselineData {
    const sorted = values.slice().sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    // Use median for skewed distributions, mean for normal distributions
    const skew = this.calculateSkewness(values);
    const baselineValue = Math.abs(skew) > 1 ? median : mean;
    
    // Calculate confidence based on sample size and variance
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;
    const confidence = Math.max(0, Math.min(1, (values.length / 100) * (1 - cv)));

    return {
      metric,
      value: baselineValue,
      timestamp: new Date(),
      confidence,
      sampleSize: values.length
    };
  }

  private calculateSkewness(values: number[]): number {
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    const skewness = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n;
    return skewness;
  }

  private updateBaseline(metric: MetricType, newValue: number): void {
    const baseline = this.baselines.get(metric);
    if (!baseline) return;

    // Use exponential moving average to update baseline
    const alpha = 0.1; // Smoothing factor
    baseline.value = alpha * newValue + (1 - alpha) * baseline.value;
    baseline.timestamp = new Date();
  }

  private inferRootCause(metric: MetricType, changePercent: number): string {
    const rootCauses: Record<MetricType, string[]> = {
      responseTime: [
        'Database query performance degradation',
        'Network latency increase',
        'Server resource contention',
        'Inefficient algorithm implementation'
      ],
      memoryUsage: [
        'Memory leak in component lifecycle',
        'Inefficient data structures',
        'Excessive caching',
        'Large object allocations'
      ],
      errorRate: [
        'API endpoint failures',
        'Network connectivity issues',
        'Invalid input handling',
        'Third-party service degradation'
      ],
      fps: [
        'Inefficient rendering logic',
        'Excessive DOM manipulations',
        'Heavy computational tasks',
        'Large dataset rendering'
      ],
      cpuUsage: [
        'Inefficient algorithms',
        'Infinite loops or recursion',
        'Heavy computational tasks',
        'Background process interference'
      ],
      throughput: [
        'Resource bottlenecks',
        'Concurrency limitations',
        'Network bandwidth constraints',
        'Database connection limits'
      ],
      contextProcessingTime: [
        'Large context size',
        'Complex processing logic',
        'Memory allocation overhead',
        'CPU throttling'
      ],
      tokenProcessingRate: [
        'Model performance degradation',
        'Network latency to AI service',
        'Rate limiting enforcement',
        'Resource allocation changes'
      ],
      bundleSize: [
        'New dependencies added',
        'Code not properly tree-shaken',
        'Asset optimization disabled',
        'Build configuration changes'
      ],
      renderTime: [
        'Complex component hierarchy',
        'Inefficient re-rendering',
        'Large state updates',
        'CSS layout thrashing'
      ],
      loadTime: [
        'Increased bundle size',
        'Network performance degradation',
        'CDN issues',
        'Resource loading inefficiencies'
      ],
      networkLatency: [
        'Network congestion',
        'Geographic distance increase',
        'CDN performance issues',
        'ISP routing changes'
      ],
      payloadSize: [
        'API response size increase',
        'Inefficient data serialization',
        'Missing compression',
        'Over-fetching data'
      ],
      cacheHitRate: [
        'Cache invalidation issues',
        'Cache size limitations',
        'Cache key collision',
        'TTL configuration problems'
      ]
    };

    const causes = rootCauses[metric] || ['Unknown cause'];
    
    // Select cause based on severity
    if (Math.abs(changePercent) > 50) {
      return causes[0]; // Most likely critical cause
    } else if (Math.abs(changePercent) > 25) {
      return causes[1] || causes[0]; // Moderate cause
    } else {
      return causes[2] || causes[1] || causes[0]; // Minor cause
    }
  }

  private generateMitigationPlan(metric: MetricType, severity: RegressionInfo['severity']): string[] {
    const mitigationPlans: Record<MetricType, string[]> = {
      responseTime: [
        'Analyze slow database queries',
        'Implement request caching',
        'Optimize API endpoints',
        'Scale server resources'
      ],
      memoryUsage: [
        'Review component lifecycle cleanup',
        'Implement memory leak detection',
        'Optimize data structures',
        'Add garbage collection triggers'
      ],
      errorRate: [
        'Implement better error handling',
        'Add retry mechanisms',
        'Validate input data',
        'Monitor third-party services'
      ],
      fps: [
        'Optimize render cycles',
        'Implement virtual scrolling',
        'Reduce DOM manipulations',
        'Use performance profiling'
      ],
      cpuUsage: [
        'Profile CPU-intensive operations',
        'Optimize algorithms',
        'Implement background processing',
        'Add performance monitoring'
      ],
      throughput: [
        'Scale infrastructure',
        'Optimize database connections',
        'Implement request batching',
        'Add load balancing'
      ],
      contextProcessingTime: [
        'Optimize context size',
        'Implement context compression',
        'Add processing caching',
        'Profile processing pipeline'
      ],
      tokenProcessingRate: [
        'Monitor AI service performance',
        'Implement token caching',
        'Optimize request batching',
        'Add fallback mechanisms'
      ],
      bundleSize: [
        'Implement code splitting',
        'Remove unused dependencies',
        'Optimize asset loading',
        'Enable tree shaking'
      ],
      renderTime: [
        'Implement React.memo',
        'Optimize component hierarchy',
        'Reduce unnecessary re-renders',
        'Use performance profiling'
      ],
      loadTime: [
        'Optimize bundle size',
        'Implement lazy loading',
        'Use CDN optimization',
        'Add resource preloading'
      ],
      networkLatency: [
        'Optimize network requests',
        'Implement request caching',
        'Use CDN services',
        'Add connection pooling'
      ],
      payloadSize: [
        'Implement data compression',
        'Optimize API responses',
        'Add pagination',
        'Remove unnecessary data'
      ],
      cacheHitRate: [
        'Optimize cache configuration',
        'Implement cache warming',
        'Review cache keys',
        'Add cache monitoring'
      ]
    };

    const plans = mitigationPlans[metric] || ['Investigate performance issue'];
    
    // Return different number of steps based on severity
    switch (severity) {
      case 'severe':
        return plans;
      case 'moderate':
        return plans.slice(0, 3);
      case 'minor':
        return plans.slice(0, 2);
      default:
        return plans.slice(0, 1);
    }
  }

  private calculatePrediction(metric: MetricType, trend: TrendData): {
    metric: MetricType;
    probability: number;
    timeToIssue: number;
    severity: 'minor' | 'moderate' | 'severe';
    recommendation: string;
  } {
    const currentValue = trend.values[trend.values.length - 1];
    const baseline = this.baselines.get(metric);
    
    if (!baseline) {
      return {
        metric,
        probability: 0,
        timeToIssue: Infinity,
        severity: 'minor',
        recommendation: 'Establish baseline for prediction'
      };
    }

    // Calculate time to reach critical threshold based on trend
    const criticalThreshold = baseline.value * (1 + this.sensitivity);
    const valueChange = Math.abs(trend.slope);
    const timeToThreshold = valueChange > 0 ? 
      Math.abs(criticalThreshold - currentValue) / valueChange : Infinity;

    // Calculate probability based on trend strength and consistency
    const probability = Math.min(0.95, trend.correlation * 0.8 + (Math.abs(trend.slope) / baseline.value) * 0.2);

    // Determine severity based on projected impact
    let severity: 'minor' | 'moderate' | 'severe' = 'minor';
    const projectedImpact = Math.abs((criticalThreshold - baseline.value) / baseline.value) * 100;
    
    if (projectedImpact > 50) {
      severity = 'severe';
    } else if (projectedImpact > 25) {
      severity = 'moderate';
    }

    return {
      metric,
      probability,
      timeToIssue: timeToThreshold * 60000, // Convert to milliseconds (assuming slope is per minute)
      severity,
      recommendation: `Monitor ${metric} closely - trend suggests ${severity} issue in ${(timeToThreshold / 60).toFixed(1)} hours`
    };
  }
}