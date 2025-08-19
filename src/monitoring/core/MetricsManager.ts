/**
 * Central Metrics Management System
 * Handles collection, storage, and processing of all monitoring metrics
 */

import { 
  PerformanceMetrics, 
  RealTimeMetrics, 
  MemoryLeakInfo, 
  BundleMetrics,
  MonitoringSession,
  MetricType 
} from '../types';

export class MetricsManager {
  private static instance: MetricsManager;
  private metrics: RealTimeMetrics[] = [];
  private memoryLeaks: MemoryLeakInfo[] = [];
  private bundleMetrics: BundleMetrics[] = [];
  private sessions: Map<string, MonitoringSession> = new Map();
  private isCollecting = false;
  private collectionInterval?: NodeJS.Timeout;
  private memoryInterval?: NodeJS.Timeout;
  
  // Performance observer for browser APIs
  private performanceObserver?: PerformanceObserver;
  private memoryObserver?: PerformanceObserver;

  private constructor() {
    this.initializePerformanceObservers();
    this.startMemoryMonitoring();
  }

  static getInstance(): MetricsManager {
    if (!MetricsManager.instance) {
      MetricsManager.instance = new MetricsManager();
    }
    return MetricsManager.instance;
  }

  /**
   * Start real-time metrics collection
   */
  startCollection(intervalMs: number = 5000): void {
    if (this.isCollecting) return;

    this.isCollecting = true;
    console.log('📊 Starting metrics collection...');

    this.collectionInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.detectPerformanceIssues();
      this.cleanupOldMetrics();
    }, intervalMs);
  }

  /**
   * Stop metrics collection
   */
  stopCollection(): void {
    this.isCollecting = false;
    
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = undefined;
    }

    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = undefined;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.memoryObserver) {
      this.memoryObserver.disconnect();
    }

    console.log('📊 Metrics collection stopped');
  }

  /**
   * Record a performance metric
   */
  recordMetric(sessionId: string, metrics: Partial<PerformanceMetrics>, context?: {
    userId?: string;
    componentName?: string;
    interactionType?: string;
  }): void {
    const metric: RealTimeMetrics = {
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId: context?.userId,
      componentName: context?.componentName,
      interactionType: context?.interactionType,
      responseTime: metrics.responseTime || 0,
      throughput: metrics.throughput || 0,
      errorRate: metrics.errorRate || 0,
      contextProcessingTime: metrics.contextProcessingTime || 0,
      tokenProcessingRate: metrics.tokenProcessingRate || 0,
      memoryUsage: metrics.memoryUsage || this.getCurrentMemoryUsage(),
      cpuUsage: metrics.cpuUsage || this.estimateCPUUsage(),
      bundleSize: metrics.bundleSize,
      fps: metrics.fps || this.getCurrentFPS(),
      renderTime: metrics.renderTime,
      loadTime: metrics.loadTime,
      networkLatency: metrics.networkLatency,
      payloadSize: metrics.payloadSize,
      cacheHitRate: metrics.cacheHitRate,
      timestamp: new Date()
    };

    this.metrics.push(metric);
    this.updateSession(sessionId, metric);

    // Trigger real-time analysis
    this.analyzeMetricInRealTime(metric);

    // Limit memory usage
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-5000);
    }
  }

  /**
   * Get metrics for a specific time range
   */
  getMetrics(timeRange: {
    start: Date;
    end: Date;
  }, filters?: {
    sessionId?: string;
    userId?: string;
    componentName?: string;
    metricTypes?: MetricType[];
  }): RealTimeMetrics[] {
    return this.metrics.filter(metric => {
      const inTimeRange = metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end;
      const matchesSession = !filters?.sessionId || metric.sessionId === filters.sessionId;
      const matchesUser = !filters?.userId || metric.userId === filters.userId;
      const matchesComponent = !filters?.componentName || metric.componentName === filters.componentName;
      
      return inTimeRange && matchesSession && matchesUser && matchesComponent;
    });
  }

  /**
   * Get aggregated metrics
   */
  getAggregatedMetrics(timeRange: {
    start: Date;
    end: Date;
  }): {
    averages: Record<MetricType, number>;
    percentiles: Record<MetricType, { p50: number; p95: number; p99: number }>;
    totals: Record<MetricType, number>;
    trends: Record<MetricType, 'improving' | 'degrading' | 'stable'>;
  } {
    const metrics = this.getMetrics(timeRange);
    
    if (metrics.length === 0) {
      return this.getEmptyAggregation();
    }

    const metricKeys: MetricType[] = [
      'responseTime', 'throughput', 'errorRate', 'contextProcessingTime',
      'tokenProcessingRate', 'memoryUsage', 'cpuUsage', 'fps',
      'renderTime', 'loadTime', 'networkLatency', 'payloadSize', 'cacheHitRate'
    ];

    const averages: Record<string, number> = {};
    const percentiles: Record<string, { p50: number; p95: number; p99: number }> = {};
    const totals: Record<string, number> = {};
    const trends: Record<string, 'improving' | 'degrading' | 'stable'> = {};

    metricKeys.forEach(key => {
      const values = metrics.map(m => m[key]).filter((v): v is number => typeof v === 'number');
      
      if (values.length > 0) {
        averages[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
        totals[key] = values.reduce((sum, val) => sum + val, 0);
        
        const sorted = values.sort((a, b) => a - b);
        percentiles[key] = {
          p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
          p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
          p99: sorted[Math.floor(sorted.length * 0.99)] || 0
        };

        trends[key] = this.calculateTrend(values);
      } else {
        averages[key] = 0;
        totals[key] = 0;
        percentiles[key] = { p50: 0, p95: 0, p99: 0 };
        trends[key] = 'stable';
      }
    });

    return { averages, percentiles, totals, trends } as any;
  }

  /**
   * Detect memory leaks
   */
  detectMemoryLeaks(): MemoryLeakInfo[] {
    const currentMemory = this.getCurrentMemoryUsage();
    const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
    
    if (recentMetrics.length < 10) return [];

    // Analyze memory growth trend
    const memoryValues = recentMetrics.map(m => m.memoryUsage);
    const growthRate = this.calculateGrowthRate(memoryValues);
    
    // If memory is growing consistently
    if (growthRate > 1.0) { // More than 1MB per minute
      const leak: MemoryLeakInfo = {
        id: `leak-${Date.now()}`,
        component: 'system',
        severity: growthRate > 5 ? 'severe' : growthRate > 2 ? 'moderate' : 'minor',
        leakType: 'memory',
        growthRate,
        detectedAt: new Date(),
        currentSize: currentMemory,
        maxSize: Math.max(...memoryValues),
        resolved: false,
        mitigationSteps: [
          'Check for uncleaned event listeners',
          'Verify component cleanup in useEffect',
          'Monitor large object allocations',
          'Review caching strategies'
        ]
      };

      this.memoryLeaks.push(leak);
      return [leak];
    }

    return [];
  }

  /**
   * Get bundle size metrics
   */
  getBundleMetrics(): BundleMetrics | null {
    return this.bundleMetrics[this.bundleMetrics.length - 1] || null;
  }

  /**
   * Record bundle analysis
   */
  recordBundleMetrics(metrics: Omit<BundleMetrics, 'timestamp'>): void {
    const bundleMetric: BundleMetrics = {
      ...metrics,
      timestamp: new Date()
    };

    this.bundleMetrics.push(bundleMetric);

    // Keep only last 10 bundle analyses
    if (this.bundleMetrics.length > 10) {
      this.bundleMetrics = this.bundleMetrics.slice(-10);
    }
  }

  /**
   * Get session data
   */
  getSession(sessionId: string): MonitoringSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.convertToCSV(this.metrics);
    }
    
    return JSON.stringify({
      metrics: this.metrics,
      memoryLeaks: this.memoryLeaks,
      bundleMetrics: this.bundleMetrics,
      sessions: Array.from(this.sessions.values()),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Private methods
  private initializePerformanceObservers(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      // Observe navigation and resource timing
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          } else if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'measure', 'paint'] 
      });

      // Observe memory if available
      if ('memory' in performance) {
        this.memoryObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.recordMemoryMetrics(entry);
          });
        });
      }
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const loadTime = entry.loadEventEnd - entry.navigationStart;
    const renderTime = entry.domContentLoadedEventEnd - entry.navigationStart;
    
    this.recordMetric('navigation', {
      loadTime,
      renderTime,
      networkLatency: entry.responseStart - entry.requestStart
    });
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    const loadTime = entry.responseEnd - entry.startTime;
    const payloadSize = entry.transferSize || 0;
    
    if (entry.name.includes('.js') || entry.name.includes('.css')) {
      this.recordMetric('resource', {
        loadTime,
        payloadSize,
        networkLatency: entry.responseStart - entry.requestStart
      });
    }
  }

  private recordMemoryMetrics(entry: PerformanceEntry): void {
    const memory = (performance as any).memory;
    if (memory) {
      this.recordMetric('memory', {
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
      });
    }
  }

  private startMemoryMonitoring(): void {
    this.memoryInterval = setInterval(() => {
      this.detectMemoryLeaks();
    }, 60000); // Check every minute
  }

  private collectSystemMetrics(): void {
    const sessionId = 'system';
    
    this.recordMetric(sessionId, {
      memoryUsage: this.getCurrentMemoryUsage(),
      cpuUsage: this.estimateCPUUsage(),
      fps: this.getCurrentFPS(),
      timestamp: new Date()
    });
  }

  private getCurrentMemoryUsage(): number {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private estimateCPUUsage(): number {
    // Simple CPU usage estimation based on timing
    const start = performance.now();
    const iterations = 100000;
    
    for (let i = 0; i < iterations; i++) {
      Math.random();
    }
    
    const duration = performance.now() - start;
    // Normalize to 0-100 scale (rough approximation)
    return Math.min(100, (duration / 10) * 100);
  }

  private getCurrentFPS(): number {
    if (typeof window === 'undefined') return 0;
    
    return new Promise<number>((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      const countFrame = () => {
        frames++;
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(countFrame);
        } else {
          resolve(frames);
        }
      };
      
      requestAnimationFrame(countFrame);
    }) as any; // Simplified for sync call
  }

  private updateSession(sessionId: string, metric: RealTimeMetrics): void {
    let session = this.sessions.get(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        userId: metric.userId,
        startTime: new Date(),
        metrics: [],
        interactions: [],
        errors: [],
        patterns: [],
        metadata: {}
      };
      this.sessions.set(sessionId, session);
    }
    
    session.metrics.push(metric);
    
    // Limit session metric history
    if (session.metrics.length > 1000) {
      session.metrics = session.metrics.slice(-500);
    }
  }

  private analyzeMetricInRealTime(metric: RealTimeMetrics): void {
    // Check for performance anomalies
    if (metric.responseTime > 5000) {
      console.warn('⚠️ High response time detected:', metric.responseTime);
    }
    
    if (metric.memoryUsage > 100) { // 100MB
      console.warn('⚠️ High memory usage detected:', metric.memoryUsage);
    }
    
    if (metric.fps && metric.fps < 30) {
      console.warn('⚠️ Low FPS detected:', metric.fps);
    }
  }

  private detectPerformanceIssues(): void {
    const recentMetrics = this.metrics.slice(-50);
    if (recentMetrics.length < 10) return;

    // Check for performance degradation
    const responseTimeTrend = this.calculateTrend(
      recentMetrics.map(m => m.responseTime)
    );
    
    if (responseTimeTrend === 'degrading') {
      console.warn('📉 Performance degradation detected in response times');
    }

    // Check for memory leaks
    const memoryLeaks = this.detectMemoryLeaks();
    if (memoryLeaks.length > 0) {
      console.warn('🧠 Memory leaks detected:', memoryLeaks.length);
    }
  }

  private cleanupOldMetrics(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    this.metrics = this.metrics.filter(m => m.timestamp > oneDayAgo);
    this.memoryLeaks = this.memoryLeaks.filter(m => m.detectedAt > oneDayAgo);
    
    // Clean up old sessions
    this.sessions.forEach((session, sessionId) => {
      if (session.startTime < oneDayAgo) {
        this.sessions.delete(sessionId);
      }
    });
  }

  private calculateTrend(values: number[]): 'improving' | 'degrading' | 'stable' {
    if (values.length < 5) return 'stable';
    
    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint);
    const secondHalf = values.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (Math.abs(changePercent) < 5) return 'stable';
    return changePercent > 0 ? 'degrading' : 'improving';
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;
    
    const timeSpan = values.length; // Assume 1 minute between measurements
    const growth = values[values.length - 1] - values[0];
    
    return growth / timeSpan; // MB per minute
  }

  private getEmptyAggregation(): any {
    const empty = {
      averages: {},
      percentiles: {},
      totals: {},
      trends: {}
    };
    
    const keys: MetricType[] = [
      'responseTime', 'throughput', 'errorRate', 'contextProcessingTime',
      'tokenProcessingRate', 'memoryUsage', 'cpuUsage', 'fps',
      'renderTime', 'loadTime', 'networkLatency', 'payloadSize', 'cacheHitRate'
    ];
    
    keys.forEach(key => {
      (empty.averages as any)[key] = 0;
      (empty.percentiles as any)[key] = { p50: 0, p95: 0, p99: 0 };
      (empty.totals as any)[key] = 0;
      (empty.trends as any)[key] = 'stable';
    });
    
    return empty;
  }

  private convertToCSV(metrics: RealTimeMetrics[]): string {
    if (metrics.length === 0) return '';
    
    const headers = Object.keys(metrics[0]).join(',');
    const rows = metrics.map(metric => 
      Object.values(metric).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}