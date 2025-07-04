// Performance Monitoring System exports
export { PerformanceMonitor } from './PerformanceMonitor';
export { 
  PerformanceMonitorComponent, 
  PerformanceErrorBoundary,
  withPerformanceTracking,
  usePerformanceTracking 
} from './PerformanceMonitor';
export { 
  createAxiosPerformanceInterceptor,
  createReactQueryPerformanceLogger,
  reduxPerformanceMiddleware,
  performanceTrackedFetch,
  createSupabasePerformanceWrapper,
  trackWebVitals
} from './middleware';
export { 
  useComponentLoadTracking,
  createTrackedComponent,
  useImportPerformanceMonitoring,
  useBatchComponentTracking,
  useRenderPatternAnalysis,
  TRACKED_COMPONENTS
} from './hooks/useComponentTracking';
export type {
  PerformanceMetric,
  PerformanceAlert,
  PerformanceThresholds,
  ComponentPerformanceData,
  MemorySnapshot,
  ErrorMetric,
  PerformanceReport
} from './types';