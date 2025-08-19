/**
 * Comprehensive Alert Management System
 * Handles performance alerts, threshold monitoring, and notification dispatch
 */

import { Alert, AlertAction, MonitoringThresholds, PerformanceMetrics } from '../types';

export class AlertManager {
  private static instance: AlertManager;
  private alerts: Alert[] = [];
  private thresholds: MonitoringThresholds;
  private alertHandlers: Map<string, (alert: Alert) => void> = new Map();
  private isMonitoring = false;
  private suppressedAlerts: Set<string> = new Set();

  private constructor() {
    this.thresholds = this.getDefaultThresholds();
  }

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  /**
   * Start alert monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🚨 Alert monitoring started');
  }

  /**
   * Stop alert monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('🚨 Alert monitoring stopped');
  }

  /**
   * Check metrics against thresholds and trigger alerts
   */
  checkMetrics(metrics: PerformanceMetrics): Alert[] {
    if (!this.isMonitoring) return [];

    const triggeredAlerts: Alert[] = [];

    // Response time alerts
    if (metrics.responseTime > this.thresholds.performance.responseTime.critical) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'critical',
        title: 'Critical Response Time',
        message: `Response time ${metrics.responseTime}ms exceeds critical threshold`,
        metric: 'responseTime',
        currentValue: metrics.responseTime,
        threshold: this.thresholds.performance.responseTime.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.responseTime > this.thresholds.performance.responseTime.warning) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'medium',
        title: 'High Response Time',
        message: `Response time ${metrics.responseTime}ms exceeds warning threshold`,
        metric: 'responseTime',
        currentValue: metrics.responseTime,
        threshold: this.thresholds.performance.responseTime.warning
      });
      triggeredAlerts.push(alert);
    }

    // Memory usage alerts
    if (metrics.memoryUsage > this.thresholds.performance.memoryUsage.critical) {
      const alert = this.createAlert({
        type: 'memory',
        severity: 'critical',
        title: 'Critical Memory Usage',
        message: `Memory usage ${metrics.memoryUsage.toFixed(1)}MB exceeds critical threshold`,
        metric: 'memoryUsage',
        currentValue: metrics.memoryUsage,
        threshold: this.thresholds.performance.memoryUsage.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.memoryUsage > this.thresholds.performance.memoryUsage.warning) {
      const alert = this.createAlert({
        type: 'memory',
        severity: 'medium',
        title: 'High Memory Usage',
        message: `Memory usage ${metrics.memoryUsage.toFixed(1)}MB exceeds warning threshold`,
        metric: 'memoryUsage',
        currentValue: metrics.memoryUsage,
        threshold: this.thresholds.performance.memoryUsage.warning
      });
      triggeredAlerts.push(alert);
    }

    // FPS alerts
    if (metrics.fps && metrics.fps < this.thresholds.performance.fps.critical) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'high',
        title: 'Critical FPS Drop',
        message: `FPS ${metrics.fps} below critical threshold`,
        metric: 'fps',
        currentValue: metrics.fps,
        threshold: this.thresholds.performance.fps.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.fps && metrics.fps < this.thresholds.performance.fps.warning) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'medium',
        title: 'Low FPS',
        message: `FPS ${metrics.fps} below warning threshold`,
        metric: 'fps',
        currentValue: metrics.fps,
        threshold: this.thresholds.performance.fps.warning
      });
      triggeredAlerts.push(alert);
    }

    // Error rate alerts
    if (metrics.errorRate > this.thresholds.performance.errorRate.critical) {
      const alert = this.createAlert({
        type: 'error',
        severity: 'critical',
        title: 'Critical Error Rate',
        message: `Error rate ${(metrics.errorRate * 100).toFixed(1)}% exceeds critical threshold`,
        metric: 'errorRate',
        currentValue: metrics.errorRate,
        threshold: this.thresholds.performance.errorRate.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.errorRate > this.thresholds.performance.errorRate.warning) {
      const alert = this.createAlert({
        type: 'error',
        severity: 'high',
        title: 'High Error Rate',
        message: `Error rate ${(metrics.errorRate * 100).toFixed(1)}% exceeds warning threshold`,
        metric: 'errorRate',
        currentValue: metrics.errorRate,
        threshold: this.thresholds.performance.errorRate.warning
      });
      triggeredAlerts.push(alert);
    }

    // Bundle size alerts
    if (metrics.bundleSize && metrics.bundleSize > this.thresholds.performance.bundleSize.critical) {
      const alert = this.createAlert({
        type: 'bundle',
        severity: 'high',
        title: 'Large Bundle Size',
        message: `Bundle size ${(metrics.bundleSize / 1024 / 1024).toFixed(1)}MB exceeds critical threshold`,
        metric: 'bundleSize',
        currentValue: metrics.bundleSize,
        threshold: this.thresholds.performance.bundleSize.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.bundleSize && metrics.bundleSize > this.thresholds.performance.bundleSize.warning) {
      const alert = this.createAlert({
        type: 'bundle',
        severity: 'medium',
        title: 'Growing Bundle Size',
        message: `Bundle size ${(metrics.bundleSize / 1024 / 1024).toFixed(1)}MB exceeds warning threshold`,
        metric: 'bundleSize',
        currentValue: metrics.bundleSize,
        threshold: this.thresholds.performance.bundleSize.warning
      });
      triggeredAlerts.push(alert);
    }

    // CPU usage alerts
    if (metrics.cpuUsage > this.thresholds.system.cpuUsage.critical) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'critical',
        title: 'Critical CPU Usage',
        message: `CPU usage ${metrics.cpuUsage.toFixed(1)}% exceeds critical threshold`,
        metric: 'cpuUsage',
        currentValue: metrics.cpuUsage,
        threshold: this.thresholds.system.cpuUsage.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.cpuUsage > this.thresholds.system.cpuUsage.warning) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'medium',
        title: 'High CPU Usage',
        message: `CPU usage ${metrics.cpuUsage.toFixed(1)}% exceeds warning threshold`,
        metric: 'cpuUsage',
        currentValue: metrics.cpuUsage,
        threshold: this.thresholds.system.cpuUsage.warning
      });
      triggeredAlerts.push(alert);
    }

    // Network latency alerts
    if (metrics.networkLatency && metrics.networkLatency > this.thresholds.system.networkLatency.critical) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'high',
        title: 'High Network Latency',
        message: `Network latency ${metrics.networkLatency}ms exceeds critical threshold`,
        metric: 'networkLatency',
        currentValue: metrics.networkLatency,
        threshold: this.thresholds.system.networkLatency.critical
      });
      triggeredAlerts.push(alert);
    } else if (metrics.networkLatency && metrics.networkLatency > this.thresholds.system.networkLatency.warning) {
      const alert = this.createAlert({
        type: 'performance',
        severity: 'medium',
        title: 'Elevated Network Latency',
        message: `Network latency ${metrics.networkLatency}ms exceeds warning threshold`,
        metric: 'networkLatency',
        currentValue: metrics.networkLatency,
        threshold: this.thresholds.system.networkLatency.warning
      });
      triggeredAlerts.push(alert);
    }

    return triggeredAlerts;
  }

  /**
   * Create a custom alert
   */
  createAlert(alertData: {
    type: Alert['type'];
    severity: Alert['severity'];
    title: string;
    message: string;
    metric?: string;
    currentValue?: number;
    threshold?: number;
    trend?: Alert['trend'];
  }): Alert {
    const alertKey = `${alertData.type}-${alertData.metric}-${alertData.severity}`;
    
    // Check if this type of alert is suppressed
    if (this.suppressedAlerts.has(alertKey)) {
      return null as any; // Skip suppressed alerts
    }

    // Check for existing unresolved alert of the same type
    const existingAlert = this.alerts.find(alert => 
      !alert.resolved && 
      alert.type === alertData.type && 
      alert.metric === alertData.metric &&
      alert.severity === alertData.severity
    );

    if (existingAlert) {
      // Update existing alert
      existingAlert.currentValue = alertData.currentValue;
      existingAlert.timestamp = new Date();
      return existingAlert;
    }

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: alertData.type,
      severity: alertData.severity,
      title: alertData.title,
      message: alertData.message,
      metric: alertData.metric,
      currentValue: alertData.currentValue,
      threshold: alertData.threshold,
      trend: alertData.trend,
      timestamp: new Date(),
      resolved: false,
      actions: this.generateAlertActions(alertData)
    };

    this.alerts.push(alert);
    this.notifyAlertHandlers(alert);

    // Auto-resolve low severity alerts after some time
    if (alert.severity === 'low') {
      setTimeout(() => {
        this.resolveAlert(alert.id, 'Auto-resolved after timeout');
      }, 300000); // 5 minutes
    }

    // Limit number of alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-500);
    }

    return alert;
  }

  /**
   * Get alerts with filtering
   */
  getAlerts(filters?: {
    type?: Alert['type'][];
    severity?: Alert['severity'][];
    resolved?: boolean;
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): Alert[] {
    let filtered = this.alerts;

    if (filters) {
      filtered = this.alerts.filter(alert => {
        const matchesType = !filters.type || filters.type.includes(alert.type);
        const matchesSeverity = !filters.severity || filters.severity.includes(alert.severity);
        const matchesResolved = filters.resolved === undefined || alert.resolved === filters.resolved;
        const matchesTimeRange = !filters.timeRange || (
          alert.timestamp >= filters.timeRange.start && 
          alert.timestamp <= filters.timeRange.end
        );

        return matchesType && matchesSeverity && matchesResolved && matchesTimeRange;
      });
    }

    filtered.sort((a, b) => {
      // Sort by severity first, then by timestamp
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Get active (unresolved) alerts
   */
  getActiveAlerts(): Alert[] {
    return this.getAlerts({ resolved: false });
  }

  /**
   * Get alert statistics
   */
  getAlertStats(timeRange?: { start: Date; end: Date }): {
    total: number;
    active: number;
    resolved: number;
    bySeverity: Record<Alert['severity'], number>;
    byType: Record<Alert['type'], number>;
    avgResolutionTime: number;
    alertRate: number; // alerts per hour
  } {
    const alerts = timeRange ? this.getAlerts({ timeRange }) : this.alerts;
    
    const stats = {
      total: alerts.length,
      active: 0,
      resolved: 0,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      byType: { performance: 0, error: 0, memory: 0, bundle: 0, 'user-experience': 0 },
      avgResolutionTime: 0,
      alertRate: 0
    };

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    alerts.forEach(alert => {
      stats.bySeverity[alert.severity]++;
      stats.byType[alert.type]++;
      
      if (alert.resolved) {
        stats.resolved++;
        if (alert.resolvedAt) {
          totalResolutionTime += alert.resolvedAt.getTime() - alert.timestamp.getTime();
          resolvedCount++;
        }
      } else {
        stats.active++;
      }
    });

    stats.avgResolutionTime = resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0;

    // Calculate alert rate
    if (timeRange) {
      const hours = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60);
      stats.alertRate = alerts.length / Math.max(hours, 1);
    }

    return stats;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string, resolution?: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      
      if (resolution) {
        if (!alert.actions) alert.actions = [];
        alert.actions.push({
          id: `action-${Date.now()}`,
          label: 'Resolved',
          type: 'manual',
          status: 'completed',
          result: resolution
        });
      }

      console.log(`✅ Alert resolved: ${alert.title}`);
      return true;
    }
    return false;
  }

  /**
   * Suppress alerts of a specific type
   */
  suppressAlert(type: Alert['type'], metric?: string, severity?: Alert['severity'], duration?: number): void {
    const key = `${type}-${metric || 'all'}-${severity || 'all'}`;
    this.suppressedAlerts.add(key);
    
    console.log(`🔇 Suppressing alerts: ${key}`);
    
    if (duration) {
      setTimeout(() => {
        this.suppressedAlerts.delete(key);
        console.log(`🔊 Alert suppression expired: ${key}`);
      }, duration);
    }
  }

  /**
   * Clear alert suppression
   */
  clearSuppression(type?: Alert['type'], metric?: string, severity?: Alert['severity']): void {
    if (type) {
      const key = `${type}-${metric || 'all'}-${severity || 'all'}`;
      this.suppressedAlerts.delete(key);
    } else {
      this.suppressedAlerts.clear();
    }
  }

  /**
   * Update monitoring thresholds
   */
  updateThresholds(newThresholds: Partial<MonitoringThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('📊 Monitoring thresholds updated');
  }

  /**
   * Get current thresholds
   */
  getThresholds(): MonitoringThresholds {
    return { ...this.thresholds };
  }

  /**
   * Add alert handler
   */
  addAlertHandler(name: string, handler: (alert: Alert) => void): void {
    this.alertHandlers.set(name, handler);
  }

  /**
   * Remove alert handler
   */
  removeAlertHandler(name: string): void {
    this.alertHandlers.delete(name);
  }

  /**
   * Execute an alert action
   */
  async executeAction(alertId: string, actionId: string): Promise<boolean> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert || !alert.actions) return false;

    const action = alert.actions.find(a => a.id === actionId);
    if (!action) return false;

    action.status = 'running';
    
    try {
      const result = await this.performAction(action, alert);
      action.status = 'completed';
      action.result = result;
      return true;
    } catch (error) {
      action.status = 'failed';
      action.result = error instanceof Error ? error.message : 'Action failed';
      return false;
    }
  }

  /**
   * Export alerts data
   */
  exportAlerts(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.convertAlertsToCSV(this.alerts);
    }
    
    return JSON.stringify({
      alerts: this.alerts,
      stats: this.getAlertStats(),
      thresholds: this.thresholds,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Private methods
  private getDefaultThresholds(): MonitoringThresholds {
    return {
      performance: {
        responseTime: { warning: 5000, critical: 15000 },
        fps: { warning: 45, critical: 30 },
        memoryUsage: { warning: 100, critical: 200 }, // MB
        bundleSize: { warning: 5 * 1024 * 1024, critical: 10 * 1024 * 1024 }, // bytes
        errorRate: { warning: 0.05, critical: 0.1 } // 5% and 10%
      },
      userExperience: {
        engagementTime: { minimum: 30000 }, // 30 seconds
        dropoffRate: { warning: 0.3, critical: 0.5 }, // 30% and 50%
        satisfactionScore: { minimum: 3.5 } // out of 5
      },
      system: {
        cpuUsage: { warning: 70, critical: 90 }, // percentage
        networkLatency: { warning: 1000, critical: 3000 }, // ms
        cacheHitRate: { minimum: 0.8 } // 80%
      }
    };
  }

  private generateAlertActions(alertData: {
    type: Alert['type'];
    metric?: string;
    severity: Alert['severity'];
  }): AlertAction[] {
    const actions: AlertAction[] = [];

    // Common actions
    actions.push({
      id: `resolve-${Date.now()}`,
      label: 'Mark as Resolved',
      type: 'manual',
      status: 'pending'
    });

    // Type-specific actions
    switch (alertData.type) {
      case 'performance':
        if (alertData.metric === 'responseTime') {
          actions.push({
            id: `optimize-${Date.now()}`,
            label: 'Run Performance Optimization',
            type: 'automatic',
            status: 'pending'
          });
        }
        break;
        
      case 'memory':
        actions.push({
          id: `gc-${Date.now()}`,
          label: 'Force Garbage Collection',
          type: 'automatic',
          status: 'pending'
        });
        break;
        
      case 'bundle':
        actions.push({
          id: `analyze-bundle-${Date.now()}`,
          label: 'Analyze Bundle Size',
          type: 'automatic',
          status: 'pending'
        });
        break;
        
      case 'error':
        actions.push({
          id: `investigate-${Date.now()}`,
          label: 'Investigate Error Pattern',
          type: 'manual',
          status: 'pending'
        });
        break;
    }

    // Severity-specific actions
    if (alertData.severity === 'critical') {
      actions.push({
        id: `escalate-${Date.now()}`,
        label: 'Escalate to Team',
        type: 'manual',
        status: 'pending'
      });
    }

    return actions;
  }

  private async performAction(action: AlertAction, alert: Alert): Promise<string> {
    switch (action.label) {
      case 'Run Performance Optimization':
        // Simulate performance optimization
        await new Promise(resolve => setTimeout(resolve, 2000));
        return 'Performance optimization completed';
        
      case 'Force Garbage Collection':
        if (typeof window !== 'undefined' && (window as any).gc) {
          (window as any).gc();
          return 'Garbage collection forced';
        }
        return 'Garbage collection not available';
        
      case 'Analyze Bundle Size':
        // Simulate bundle analysis
        await new Promise(resolve => setTimeout(resolve, 3000));
        return 'Bundle analysis completed - check console for details';
        
      default:
        return 'Action completed';
    }
  }

  private notifyAlertHandlers(alert: Alert): void {
    this.alertHandlers.forEach((handler, name) => {
      try {
        handler(alert);
      } catch (error) {
        console.error(`Alert handler '${name}' failed:`, error);
      }
    });

    // Built-in console notification
    const emoji = this.getSeverityEmoji(alert.severity);
    console.warn(`${emoji} ALERT [${alert.severity.toUpperCase()}]: ${alert.title} - ${alert.message}`);
  }

  private getSeverityEmoji(severity: Alert['severity']): string {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🟡';
      case 'low': return 'ℹ️';
      default: return '📊';
    }
  }

  private convertAlertsToCSV(alerts: Alert[]): string {
    if (alerts.length === 0) return '';
    
    const headers = [
      'id', 'type', 'severity', 'title', 'message', 'metric',
      'currentValue', 'threshold', 'timestamp', 'resolved', 'resolvedAt'
    ];
    
    const rows = alerts.map(alert => [
      alert.id,
      alert.type,
      alert.severity,
      `"${alert.title.replace(/"/g, '""')}"`,
      `"${alert.message.replace(/"/g, '""')}"`,
      alert.metric || '',
      alert.currentValue || '',
      alert.threshold || '',
      alert.timestamp.toISOString(),
      alert.resolved,
      alert.resolvedAt?.toISOString() || ''
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}