import { 
  PerformanceMetric, 
  PerformanceAlert, 
  PerformanceThresholds,
  ComponentPerformanceData,
  MemorySnapshot,
  ErrorMetric,
  PerformanceReport
} from './types';

class PerformanceMonitorClass {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private componentData: Map<string, ComponentPerformanceData> = new Map();
  private memorySnapshots: MemorySnapshot[] = [];
  private errors: Map<string, ErrorMetric> = new Map();
  private startTime: number = Date.now();
  private memoryCheckInterval?: NodeJS.Timeout;
  private alertCallbacks: Set<(alert: PerformanceAlert) => void> = new Set();
  
  private thresholds: PerformanceThresholds = {
    bundleSizeKB: 2048, // 2MB for production (accounting for direct imports)
    componentLoadTimeMs: 100,
    errorRatePercentage: 5,
    memoryUsageMB: 512,
    renderTimeMs: 16 // 60fps target
  };

  constructor() {
    this.setupMemoryMonitoring();
    this.setupPerformanceObserver();
  }

  // Component tracking
  trackComponentLoad(componentName: string, loadTime: number) {
    const metric: PerformanceMetric = {
      id: `component-load-${Date.now()}-${Math.random()}`,
      type: 'component-load',
      name: componentName,
      value: loadTime,
      timestamp: Date.now()
    };
    
    this.addMetric(metric);
    
    // Check threshold
    if (loadTime > this.thresholds.componentLoadTimeMs) {
      this.createAlert({
        type: 'component-load',
        severity: loadTime > this.thresholds.componentLoadTimeMs * 2 ? 'error' : 'warning',
        message: `Component ${componentName} took ${loadTime}ms to load (threshold: ${this.thresholds.componentLoadTimeMs}ms)`,
        value: loadTime,
        threshold: this.thresholds.componentLoadTimeMs
      });
    }

    // Update component data
    this.updateComponentData(componentName, { loadTime });
  }

  trackRender(componentName: string, renderTime: number) {
    const metric: PerformanceMetric = {
      id: `render-${Date.now()}-${Math.random()}`,
      type: 'render',
      name: componentName,
      value: renderTime,
      timestamp: Date.now()
    };
    
    this.addMetric(metric);
    
    const componentData = this.componentData.get(componentName) || this.createComponentData(componentName);
    componentData.renderCount++;
    componentData.lastRenderTime = renderTime;
    componentData.averageRenderTime = 
      (componentData.averageRenderTime * (componentData.renderCount - 1) + renderTime) / componentData.renderCount;
    
    this.componentData.set(componentName, componentData);
  }

  trackError(error: Error, componentStack?: string) {
    const errorKey = `${error.name}-${error.message}`;
    const existing = this.errors.get(errorKey);
    
    if (existing) {
      existing.count++;
    } else {
      this.errors.set(errorKey, {
        timestamp: Date.now(),
        errorType: error.name,
        errorMessage: error.message,
        componentStack,
        count: 1
      });
    }

    const metric: PerformanceMetric = {
      id: `error-${Date.now()}-${Math.random()}`,
      type: 'error',
      name: error.name,
      value: 1,
      timestamp: Date.now(),
      metadata: {
        message: error.message,
        stack: error.stack,
        componentStack
      }
    };
    
    this.addMetric(metric);
    this.checkErrorRate();
  }

  trackBundleSize(sizeInKB: number) {
    const metric: PerformanceMetric = {
      id: `bundle-size-${Date.now()}`,
      type: 'bundle-size',
      name: 'main-bundle',
      value: sizeInKB,
      timestamp: Date.now()
    };
    
    this.addMetric(metric);
    
    if (sizeInKB > this.thresholds.bundleSizeKB) {
      this.createAlert({
        type: 'bundle-size',
        severity: sizeInKB > this.thresholds.bundleSizeKB * 1.5 ? 'critical' : 'warning',
        message: `Bundle size (${sizeInKB}KB) exceeds threshold (${this.thresholds.bundleSizeKB}KB)`,
        value: sizeInKB,
        threshold: this.thresholds.bundleSizeKB
      });
    }
  }

  // Memory monitoring
  private setupMemoryMonitoring() {
    if (!performance.memory) {
      console.warn('Performance.memory API not available');
      return;
    }

    // Log if in development mode
    if (import.meta.env.DEV) {
      console.log('[PerformanceMonitor] Memory leak detection is less sensitive in development mode');
    }

    // Check memory every 10 seconds
    this.memoryCheckInterval = setInterval(() => {
      this.captureMemorySnapshot();
    }, 10000);
  }

  private captureMemorySnapshot() {
    if (!performance.memory) return;

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };

    this.memorySnapshots.push(snapshot);
    
    // Keep only last 100 snapshots (about 16 minutes of data)
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots.shift();
    }

    // Check for memory leaks
    this.checkMemoryUsage(snapshot);
  }

  private checkMemoryUsage(snapshot: MemorySnapshot) {
    const usedMB = snapshot.usedJSHeapSize / (1024 * 1024);
    
    if (usedMB > this.thresholds.memoryUsageMB) {
      this.createAlert({
        type: 'memory-leak',
        severity: usedMB > this.thresholds.memoryUsageMB * 1.5 ? 'critical' : 'warning',
        message: `Memory usage (${usedMB.toFixed(2)}MB) exceeds threshold (${this.thresholds.memoryUsageMB}MB)`,
        value: usedMB,
        threshold: this.thresholds.memoryUsageMB
      });
    }

    // Check for potential memory leak pattern with more reasonable thresholds
    if (this.memorySnapshots.length >= 20) {
      const recentSnapshots = this.memorySnapshots.slice(-20);
      const firstSnapshot = recentSnapshots[0];
      const lastSnapshot = recentSnapshots[recentSnapshots.length - 1];
      
      // Calculate the increase
      const startMB = firstSnapshot.usedJSHeapSize / (1024 * 1024);
      const endMB = lastSnapshot.usedJSHeapSize / (1024 * 1024);
      const increaseMB = endMB - startMB;
      const increasePercent = ((endMB - startMB) / startMB) * 100;
      
      // Count how many times memory increased vs decreased
      let increases = 0;
      for (let i = 1; i < recentSnapshots.length; i++) {
        if (recentSnapshots[i].usedJSHeapSize > recentSnapshots[i - 1].usedJSHeapSize) {
          increases++;
        }
      }
      
      // Only alert if:
      // 1. Memory increased by at least 10MB or 25%
      // 2. Memory increased in at least 70% of samples
      // 3. We're not in development mode (where memory patterns are different)
      const significantIncrease = increaseMB > 10 || increasePercent > 25;
      const consistentIncrease = increases > (recentSnapshots.length * 0.7);
      
      if (significantIncrease && consistentIncrease && !import.meta.env.DEV) {
        this.createAlert({
          type: 'memory-leak',
          severity: 'error',
          message: `Potential memory leak - memory increased by ${increaseMB.toFixed(2)}MB (${increasePercent.toFixed(1)}%) over last 20 samples`,
          value: usedMB,
          threshold: this.thresholds.memoryUsageMB
        });
      }
    }
  }

  // Performance Observer for long tasks
  private setupPerformanceObserver() {
    if (!window.PerformanceObserver) {
      console.warn('PerformanceObserver API not available');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
            const metric: PerformanceMetric = {
              id: `perf-${entry.entryType}-${Date.now()}-${Math.random()}`,
              type: 'render',
              name: entry.name,
              value: entry.duration,
              timestamp: Date.now()
            };
            this.addMetric(metric);
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.error('Failed to setup PerformanceObserver:', error);
    }
  }

  // Alert management
  private createAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp'>) {
    const alert: PerformanceAlert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };

    this.alerts.push(alert);
    
    // Notify all alert callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
  }

  onAlert(callback: (alert: PerformanceAlert) => void) {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  // Error rate checking
  private checkErrorRate() {
    const totalMetrics = this.metrics.filter(m => m.type !== 'error').length;
    const errorMetrics = this.metrics.filter(m => m.type === 'error').length;
    
    if (totalMetrics > 0) {
      const errorRate = (errorMetrics / totalMetrics) * 100;
      
      if (errorRate > this.thresholds.errorRatePercentage) {
        this.createAlert({
          type: 'error-rate',
          severity: errorRate > this.thresholds.errorRatePercentage * 2 ? 'critical' : 'error',
          message: `Error rate (${errorRate.toFixed(2)}%) exceeds threshold (${this.thresholds.errorRatePercentage}%)`,
          value: errorRate,
          threshold: this.thresholds.errorRatePercentage
        });
      }
    }
  }

  // Helper methods
  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  private updateComponentData(componentName: string, updates: Partial<ComponentPerformanceData>) {
    const existing = this.componentData.get(componentName) || this.createComponentData(componentName);
    this.componentData.set(componentName, { ...existing, ...updates });
  }

  private createComponentData(componentName: string): ComponentPerformanceData {
    return {
      componentName,
      loadTime: 0,
      renderCount: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      errorCount: 0
    };
  }

  // Public API
  setThresholds(thresholds: Partial<PerformanceThresholds>) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  getReport(): PerformanceReport {
    const componentData: Record<string, ComponentPerformanceData> = {};
    this.componentData.forEach((data, key) => {
      componentData[key] = data;
    });

    return {
      startTime: this.startTime,
      endTime: Date.now(),
      metrics: [...this.metrics],
      alerts: [...this.alerts],
      componentData,
      memorySnapshots: [...this.memorySnapshots],
      errors: Array.from(this.errors.values())
    };
  }

  getRecentMetrics(type?: PerformanceMetric['type'], limit: number = 100): PerformanceMetric[] {
    const filtered = type ? this.metrics.filter(m => m.type === type) : this.metrics;
    return filtered.slice(-limit);
  }

  getAlerts(severity?: PerformanceAlert['severity']): PerformanceAlert[] {
    return severity ? this.alerts.filter(a => a.severity === severity) : [...this.alerts];
  }

  clearMetrics() {
    this.metrics = [];
    this.alerts = [];
    this.componentData.clear();
    this.memorySnapshots = [];
    this.errors.clear();
    this.startTime = Date.now();
  }

  destroy() {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    this.alertCallbacks.clear();
  }
}

// Singleton instance
export const PerformanceMonitor = new PerformanceMonitorClass();