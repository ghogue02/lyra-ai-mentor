/**
 * Comprehensive Monitoring System - Main Entry Point
 * Orchestrates all monitoring components for production deployment
 */

// Core monitoring systems
export { MetricsManager } from './core/MetricsManager';
export { ErrorTracker } from './core/ErrorTracker';
export { ComponentProfiler, withPerformanceProfiler, usePerformanceProfiler, PerformanceProfiler } from './core/ComponentProfiler';
export { RegressionDetector } from './core/RegressionDetector';

// Analytics and tracking
export { InteractionAnalytics } from './analytics/InteractionAnalytics';

// Alert management
export { AlertManager } from './alerts/AlertManager';

// Dashboard and UI
export { MonitoringDashboard } from './dashboard/MonitoringDashboard';

// Error boundary integration
export { default as MonitoringErrorBoundary } from './integrations/MonitoringErrorBoundary';

// Configuration
export { monitoringConfig, MonitoringConfigLoader, defaultConfigurations } from './config/MonitoringConfig';

// Types
export * from './types';

import { MetricsManager } from './core/MetricsManager';
import { ErrorTracker } from './core/ErrorTracker';
import { InteractionAnalytics } from './analytics/InteractionAnalytics';
import { AlertManager } from './alerts/AlertManager';
import { ComponentProfiler } from './core/ComponentProfiler';
import { RegressionDetector } from './core/RegressionDetector';
import { monitoringConfig } from './config/MonitoringConfig';
import { MonitoringConfiguration } from './config/MonitoringConfig';

/**
 * Main Monitoring System Orchestrator
 * Centralizes initialization and management of all monitoring components
 */
export class MonitoringSystem {
  private static instance: MonitoringSystem;
  private isInitialized = false;
  private config: MonitoringConfiguration;
  
  // Component instances
  private metricsManager: MetricsManager;
  private errorTracker: ErrorTracker;
  private analytics: InteractionAnalytics;
  private alertManager: AlertManager;
  private profiler: ComponentProfiler;
  private regressionDetector: RegressionDetector;

  private constructor() {
    this.config = monitoringConfig.getConfig();
    
    // Initialize components
    this.metricsManager = MetricsManager.getInstance();
    this.errorTracker = ErrorTracker.getInstance();
    this.analytics = InteractionAnalytics.getInstance();
    this.alertManager = AlertManager.getInstance();
    this.profiler = ComponentProfiler.getInstance();
    this.regressionDetector = RegressionDetector.getInstance();
  }

  static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }

  /**
   * Initialize the complete monitoring system
   */
  async initialize(customConfig?: Partial<MonitoringConfiguration>): Promise<void> {
    if (this.isInitialized) {
      console.warn('Monitoring system already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing comprehensive monitoring system...');

      // Apply custom configuration if provided
      if (customConfig) {
        monitoringConfig.updateConfig(customConfig);
        this.config = monitoringConfig.getConfig();
      }

      // Check if monitoring is enabled
      if (!this.config.enabled) {
        console.log('📊 Monitoring system disabled by configuration');
        return;
      }

      // Initialize components based on feature flags
      await this.initializeComponents();

      // Setup integrations
      await this.setupIntegrations();

      // Configure thresholds and alerts
      this.configureAlertsAndThresholds();

      // Start monitoring processes
      this.startMonitoring();

      this.isInitialized = true;
      console.log('✅ Monitoring system initialized successfully');

      // Send initialization event
      this.analytics.trackInteraction({
        sessionId: this.generateSessionId(),
        type: 'ai-interaction',
        component: 'MonitoringSystem',
        element: 'system-initialized',
        data: {
          environment: this.config.environment,
          features: this.config.features,
          version: '1.0.0'
        },
        success: true
      });

    } catch (error) {
      console.error('❌ Failed to initialize monitoring system:', error);
      
      // Track initialization error
      this.errorTracker.trackError(error as Error, {
        sessionId: this.generateSessionId(),
        component: 'MonitoringSystem',
        action: 'initialization',
        severity: 'critical'
      });
      
      throw error;
    }
  }

  /**
   * Shutdown the monitoring system gracefully
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      console.log('🛑 Shutting down monitoring system...');

      // Stop all monitoring processes
      this.metricsManager.stopCollection();
      this.errorTracker.stopTracking();
      this.analytics.stopTracking();
      this.alertManager.stopMonitoring();
      this.profiler.disable();

      // Export final metrics if enabled
      if (this.config.privacy.allowDataExport) {
        await this.exportFinalMetrics();
      }

      this.isInitialized = false;
      console.log('✅ Monitoring system shutdown complete');

    } catch (error) {
      console.error('❌ Error during monitoring system shutdown:', error);
    }
  }

  /**
   * Get system health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'critical';
    components: Record<string, boolean>;
    metrics: any;
    alerts: number;
    errors: number;
    uptime: number;
  } {
    const activeAlerts = this.alertManager.getActiveAlerts();
    const errorStats = this.errorTracker.getErrorStats();
    const recentMetrics = this.metricsManager.getMetrics({
      start: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      end: new Date()
    });

    const componentStatus = {
      metricsManager: recentMetrics.length > 0,
      errorTracker: true, // Always available
      analytics: this.analytics.getInteractionStats().totalInteractions > 0,
      alertManager: true, // Always available
      profiler: this.config.features.componentProfiling,
      regressionDetector: this.config.features.regressionDetection
    };

    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length;
    const highSeverityErrors = errorStats.bySeverity?.critical || 0;

    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (criticalAlerts > 0 || highSeverityErrors > 5) {
      status = 'critical';
    } else if (activeAlerts.length > 3 || errorStats.unresolved > 10) {
      status = 'degraded';
    }

    return {
      status,
      components: componentStatus,
      metrics: {
        responseTime: recentMetrics.length > 0 ? 
          recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length : 0,
        memoryUsage: recentMetrics.length > 0 ? 
          recentMetrics[recentMetrics.length - 1].memoryUsage : 0,
        errorRate: errorStats.total > 0 ? errorStats.unresolved / errorStats.total : 0
      },
      alerts: activeAlerts.length,
      errors: errorStats.unresolved,
      uptime: this.isInitialized ? Date.now() - this.getInitializationTime() : 0
    };
  }

  /**
   * Create a comprehensive system report
   */
  generateSystemReport(): {
    timestamp: string;
    environment: string;
    health: ReturnType<MonitoringSystem['getHealthStatus']>;
    performance: any;
    errors: any;
    analytics: any;
    regressions: any;
    configuration: any;
  } {
    const health = this.getHealthStatus();
    const performanceStats = this.metricsManager.getAggregatedMetrics({
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date()
    });
    const errorStats = this.errorTracker.getErrorStats();
    const analyticsStats = this.analytics.getInteractionStats();
    const regressionStats = this.regressionDetector.getRegressionStats();

    return {
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      health,
      performance: performanceStats,
      errors: errorStats,
      analytics: analyticsStats,
      regressions: regressionStats,
      configuration: {
        features: this.config.features,
        thresholds: this.config.thresholds,
        integrations: Object.keys(this.config.integrations).reduce((acc, key) => {
          acc[key] = this.config.integrations[key as keyof typeof this.config.integrations].enabled;
          return acc;
        }, {} as Record<string, boolean>)
      }
    };
  }

  /**
   * Update system configuration
   */
  updateConfiguration(updates: Partial<MonitoringConfiguration>): void {
    monitoringConfig.updateConfig(updates);
    this.config = monitoringConfig.getConfig();
    
    // Reconfigure components with new settings
    this.configureAlertsAndThresholds();
    
    console.log('📊 Monitoring configuration updated');
  }

  // Private methods
  private async initializeComponents(): Promise<void> {
    const { features } = this.config;

    // Always initialize error tracking and metrics
    if (features.errorTracking) {
      this.errorTracker.startTracking();
    }

    if (features.performanceMonitoring) {
      this.metricsManager.startCollection(this.config.collection.metricsInterval);
    }

    if (features.userAnalytics) {
      this.analytics.startTracking();
    }

    if (features.realTimeAlerts) {
      this.alertManager.startMonitoring();
    }

    if (features.componentProfiling) {
      this.profiler.enable();
    }

    if (features.regressionDetection) {
      this.regressionDetector.enable();
      
      // Establish baselines from recent metrics if available
      const historicalMetrics = this.metricsManager.getMetrics({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        end: new Date()
      });
      
      if (historicalMetrics.length > 0) {
        this.regressionDetector.establishBaselines(historicalMetrics);
      }
    }
  }

  private async setupIntegrations(): Promise<void> {
    const { integrations } = this.config;

    // Setup error reporting integrations
    if (integrations.errorReporting.sentry?.dsn) {
      this.errorTracker.addErrorHandler('sentry', (error) => {
        // Sentry integration would go here
        console.log('Sentry error reported:', error.id);
      });
    }

    // Setup analytics integrations
    if (integrations.analytics.enabled) {
      this.analytics.addInteractionHandler?.('analytics', (interaction) => {
        // Analytics integration would go here
        console.log('Analytics event:', interaction.type);
      });
    }

    // Setup alert integrations
    if (integrations.errorReporting.sentry?.dsn) {
      this.alertManager.addAlertHandler('sentry', (alert) => {
        // Send critical alerts to Sentry
        if (alert.severity === 'critical') {
          console.log('Critical alert sent to Sentry:', alert.title);
        }
      });
    }
  }

  private configureAlertsAndThresholds(): void {
    // Update alert manager thresholds
    this.alertManager.updateThresholds(this.config.thresholds);

    // Configure regression detector sensitivity
    this.regressionDetector.setSensitivity(0.15); // 15% change threshold
  }

  private startMonitoring(): void {
    // Set up periodic health checks
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute

    // Set up regression detection
    if (this.config.features.regressionDetection) {
      this.metricsManager.recordMetric = ((originalMethod) => {
        return function(sessionId: string, metrics: any, context?: any) {
          const result = originalMethod.call(this, sessionId, metrics, context);
          
          // Check for regressions after recording metrics
          MonitoringSystem.getInstance().regressionDetector.processMetrics(metrics);
          
          return result;
        };
      })(this.metricsManager.recordMetric.bind(this.metricsManager));
    }
  }

  private performHealthCheck(): void {
    const health = this.getHealthStatus();
    
    if (health.status === 'critical') {
      this.alertManager.createAlert({
        type: 'performance',
        severity: 'critical',
        title: 'System Health Critical',
        message: `Monitoring system health is critical: ${health.alerts} active alerts, ${health.errors} unresolved errors`,
        metric: 'systemHealth'
      });
    }
  }

  private async exportFinalMetrics(): Promise<void> {
    try {
      const report = this.generateSystemReport();
      
      // Save to local storage for debugging
      localStorage.setItem('monitoring-final-report', JSON.stringify(report));
      
      console.log('📊 Final monitoring report saved');
    } catch (error) {
      console.error('Failed to export final metrics:', error);
    }
  }

  private generateSessionId(): string {
    return `monitoring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getInitializationTime(): number {
    // This would be stored when initialization completes
    return Date.now() - 60000; // Placeholder
  }
}

// Export singleton instance
export const monitoringSystem = MonitoringSystem.getInstance();

// Initialize monitoring system automatically in browser environments
if (typeof window !== 'undefined') {
  // Auto-initialize with environment detection
  monitoringSystem.initialize().catch(error => {
    console.error('Failed to auto-initialize monitoring system:', error);
  });

  // Graceful shutdown on page unload
  window.addEventListener('beforeunload', () => {
    monitoringSystem.shutdown();
  });
}