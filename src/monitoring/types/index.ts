/**
 * Comprehensive monitoring system types
 * Central type definitions for performance monitoring, error tracking, and analytics
 */

// Core Performance Metrics
export interface PerformanceMetrics {
  // Core metrics
  responseTime: number;
  throughput: number;
  errorRate: number;
  
  // AI-specific metrics
  contextProcessingTime: number;
  tokenProcessingRate: number;
  
  // System metrics
  memoryUsage: number;
  cpuUsage: number;
  bundleSize?: number;
  
  // Frontend metrics
  fps?: number;
  renderTime?: number;
  loadTime?: number;
  
  // Network metrics
  networkLatency?: number;
  payloadSize?: number;
  cacheHitRate?: number;
  
  timestamp: Date;
}

// Real-time Performance Data
export interface RealTimeMetrics extends PerformanceMetrics {
  id: string;
  sessionId: string;
  userId?: string;
  componentName?: string;
  interactionType?: string;
}

// Error Tracking
export interface ErrorInfo {
  id: string;
  message: string;
  stack?: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: 'component' | 'api' | 'network' | 'system';
  componentStack?: string;
  userId?: string;
  sessionId: string;
  context: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  tags?: string[];
}

// User Interaction Analytics
export interface InteractionEvent {
  id: string;
  sessionId: string;
  userId?: string;
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'ai-interaction' | 'pattern-usage';
  component: string;
  element?: string;
  data: Record<string, any>;
  timestamp: Date;
  duration?: number;
  success: boolean;
}

// Pattern Usage Analytics
export interface PatternUsageMetrics {
  patternId: string;
  patternType: 'ai-component' | 'interaction-pattern' | 'ux-pattern';
  usageCount: number;
  avgEngagementTime: number;
  successRate: number;
  dropoffRate: number;
  userSatisfactionScore?: number;
  lastUsed: Date;
  trends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}

// Memory Leak Detection
export interface MemoryLeakInfo {
  id: string;
  component: string;
  severity: 'minor' | 'moderate' | 'severe';
  leakType: 'memory' | 'event-listeners' | 'timers' | 'dom-nodes';
  growthRate: number; // MB per minute
  detectedAt: Date;
  currentSize: number;
  maxSize: number;
  resolved: boolean;
  mitigationSteps?: string[];
}

// Bundle Analysis
export interface BundleMetrics {
  totalSize: number;
  compressedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: number;
  }>;
  duplicateModules: string[];
  unusedModules: string[];
  largestModules: Array<{
    path: string;
    size: number;
  }>;
  loadingTime: number;
  cacheEfficiency: number;
  timestamp: Date;
}

// Alert System
export interface Alert {
  id: string;
  type: 'performance' | 'error' | 'memory' | 'bundle' | 'user-experience';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metric?: string;
  currentValue?: number;
  threshold?: number;
  trend?: 'improving' | 'degrading' | 'stable';
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actions?: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'automatic' | 'manual';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
}

// Dashboard Configuration
export interface DashboardConfig {
  refreshInterval: number;
  timeRange: '5m' | '15m' | '1h' | '24h' | '7d';
  enableRealTime: boolean;
  widgets: DashboardWidget[];
  alerts: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'alert' | 'table';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  dataSource: string;
}

// Monitoring Thresholds
export interface MonitoringThresholds {
  performance: {
    responseTime: { warning: number; critical: number };
    fps: { warning: number; critical: number };
    memoryUsage: { warning: number; critical: number };
    bundleSize: { warning: number; critical: number };
    errorRate: { warning: number; critical: number };
  };
  userExperience: {
    engagementTime: { minimum: number };
    dropoffRate: { warning: number; critical: number };
    satisfactionScore: { minimum: number };
  };
  system: {
    cpuUsage: { warning: number; critical: number };
    networkLatency: { warning: number; critical: number };
    cacheHitRate: { minimum: number };
  };
}

// Analytics Report
export interface AnalyticsReport {
  id: string;
  type: 'performance' | 'usage' | 'errors' | 'comprehensive';
  timeRange: {
    start: Date;
    end: Date;
  };
  data: {
    summary: Record<string, any>;
    trends: Record<string, any>;
    insights: string[];
    recommendations: string[];
  };
  generatedAt: Date;
  version: string;
}

// Regression Detection
export interface RegressionInfo {
  id: string;
  metric: string;
  component?: string;
  severity: 'minor' | 'moderate' | 'severe';
  currentValue: number;
  previousValue: number;
  changePercent: number;
  detectedAt: Date;
  affectedUsers?: number;
  rootCause?: string;
  mitigationPlan?: string[];
}

// Monitoring Session
export interface MonitoringSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  metrics: PerformanceMetrics[];
  interactions: InteractionEvent[];
  errors: ErrorInfo[];
  patterns: PatternUsageMetrics[];
  metadata: Record<string, any>;
}

// Health Check
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  uptime: number;
  details?: Record<string, any>;
}

// Monitoring Event
export interface MonitoringEvent {
  id: string;
  type: 'metric' | 'error' | 'interaction' | 'alert' | 'health';
  source: string;
  data: any;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

// Export utilities
export type MetricType = keyof PerformanceMetrics;
export type AlertSeverity = Alert['severity'];
export type ErrorSeverity = ErrorInfo['severity'];
export type MonitoringEventType = MonitoringEvent['type'];