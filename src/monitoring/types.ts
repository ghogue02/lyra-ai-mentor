export interface PerformanceMetric {
  id: string;
  type: 'component-load' | 'render' | 'bundle-size' | 'error' | 'memory' | 'api-call';
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceAlert {
  id: string;
  type: 'bundle-size' | 'component-load' | 'error-rate' | 'memory-leak';
  severity: 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
}

export interface PerformanceThresholds {
  bundleSizeKB: number;
  componentLoadTimeMs: number;
  errorRatePercentage: number;
  memoryUsageMB: number;
  renderTimeMs: number;
}

export interface ComponentPerformanceData {
  componentName: string;
  loadTime: number;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  errorCount: number;
}

export interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface ErrorMetric {
  timestamp: number;
  errorType: string;
  errorMessage: string;
  componentStack?: string;
  count: number;
}

export interface PerformanceReport {
  startTime: number;
  endTime: number;
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  componentData: Record<string, ComponentPerformanceData>;
  memorySnapshots: MemorySnapshot[];
  errors: ErrorMetric[];
  bundleSize?: number;
}