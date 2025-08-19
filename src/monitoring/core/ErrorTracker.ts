/**
 * Comprehensive Error Tracking System
 * Handles error collection, categorization, and reporting with full context
 */

import { ErrorInfo, MonitoringEvent } from '../types';

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorInfo[] = [];
  private errorHandlers: Map<string, (error: ErrorInfo) => void> = new Map();
  private isTracking = false;
  private maxErrors = 1000;
  
  // Error categorization patterns
  private errorPatterns = {
    network: [/network/i, /fetch/i, /axios/i, /request/i, /connection/i],
    component: [/component/i, /render/i, /react/i, /jsx/i, /hook/i],
    api: [/api/i, /endpoint/i, /server/i, /backend/i, /supabase/i],
    memory: [/memory/i, /heap/i, /allocation/i, /leak/i],
    bundle: [/chunk/i, /module/i, /import/i, /dynamic/i, /webpack/i],
    ai: [/ai/i, /openai/i, /claude/i, /chat/i, /llm/i, /prompt/i]
  };

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Start error tracking
   */
  startTracking(): void {
    if (this.isTracking) return;
    
    this.isTracking = true;
    console.log('🚨 Error tracking started');
  }

  /**
   * Stop error tracking
   */
  stopTracking(): void {
    this.isTracking = false;
    console.log('🚨 Error tracking stopped');
  }

  /**
   * Track an error with full context
   */
  trackError(error: Error | string, context: {
    sessionId: string;
    userId?: string;
    component?: string;
    action?: string;
    metadata?: Record<string, any>;
    severity?: ErrorInfo['severity'];
    source?: ErrorInfo['source'];
  }): string {
    const errorInfo: ErrorInfo = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      type: this.categorizeErrorType(error),
      severity: context.severity || this.determineSeverity(error),
      source: context.source || this.determineSource(error),
      componentStack: this.captureComponentStack(),
      userId: context.userId,
      sessionId: context.sessionId,
      context: {
        component: context.component,
        action: context.action,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        viewport: this.getViewportInfo(),
        ...context.metadata
      },
      timestamp: new Date(),
      resolved: false,
      tags: this.generateTags(error, context)
    };

    this.errors.push(errorInfo);
    
    // Limit memory usage
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-Math.floor(this.maxErrors * 0.8));
    }

    // Notify handlers
    this.notifyErrorHandlers(errorInfo);

    // Log critical errors immediately
    if (errorInfo.severity === 'critical') {
      console.error('🚨 CRITICAL ERROR:', errorInfo);
    }

    return errorInfo.id;
  }

  /**
   * Track React error boundary errors
   */
  trackReactError(error: Error, errorInfo: { componentStack: string }, context: {
    sessionId: string;
    userId?: string;
    componentName?: string;
  }): string {
    return this.trackError(error, {
      ...context,
      component: context.componentName,
      source: 'component',
      severity: 'high',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });
  }

  /**
   * Track network errors
   */
  trackNetworkError(error: Error, request: {
    url: string;
    method: string;
    status?: number;
    statusText?: string;
  }, context: {
    sessionId: string;
    userId?: string;
  }): string {
    return this.trackError(error, {
      ...context,
      source: 'network',
      severity: request.status && request.status >= 500 ? 'high' : 'medium',
      metadata: {
        url: request.url,
        method: request.method,
        status: request.status,
        statusText: request.statusText,
        networkError: true
      }
    });
  }

  /**
   * Track AI/LLM related errors
   */
  trackAIError(error: Error, context: {
    sessionId: string;
    userId?: string;
    model?: string;
    promptLength?: number;
    operation?: string;
  }): string {
    return this.trackError(error, {
      ...context,
      source: 'api',
      severity: 'medium',
      metadata: {
        model: context.model,
        promptLength: context.promptLength,
        operation: context.operation,
        aiError: true
      }
    });
  }

  /**
   * Get errors with filtering
   */
  getErrors(filters?: {
    sessionId?: string;
    userId?: string;
    severity?: ErrorInfo['severity'][];
    source?: ErrorInfo['source'][];
    resolved?: boolean;
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): ErrorInfo[] {
    let filteredErrors = this.errors;

    if (filters) {
      filteredErrors = this.errors.filter(error => {
        const matchesSession = !filters.sessionId || error.sessionId === filters.sessionId;
        const matchesUser = !filters.userId || error.userId === filters.userId;
        const matchesSeverity = !filters.severity || filters.severity.includes(error.severity);
        const matchesSource = !filters.source || filters.source.includes(error.source);
        const matchesResolved = filters.resolved === undefined || error.resolved === filters.resolved;
        const matchesTimeRange = !filters.timeRange || (
          error.timestamp >= filters.timeRange.start && 
          error.timestamp <= filters.timeRange.end
        );

        return matchesSession && matchesUser && matchesSeverity && 
               matchesSource && matchesResolved && matchesTimeRange;
      });
    }

    // Sort by timestamp (newest first)
    filteredErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (filters?.limit) {
      filteredErrors = filteredErrors.slice(0, filters.limit);
    }

    return filteredErrors;
  }

  /**
   * Get error statistics
   */
  getErrorStats(timeRange?: { start: Date; end: Date }): {
    total: number;
    bySeverity: Record<ErrorInfo['severity'], number>;
    bySource: Record<ErrorInfo['source'], number>;
    byType: Record<ErrorInfo['type'], number>;
    resolved: number;
    unresolved: number;
    errorRate: number; // errors per hour
    topErrors: Array<{ message: string; count: number; severity: string }>;
  } {
    const errors = timeRange ? this.getErrors({ timeRange }) : this.errors;
    
    const stats = {
      total: errors.length,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      bySource: { component: 0, api: 0, network: 0, system: 0 },
      byType: { error: 0, warning: 0, info: 0 },
      resolved: 0,
      unresolved: 0,
      errorRate: 0,
      topErrors: [] as Array<{ message: string; count: number; severity: string }>
    };

    // Count by categories
    errors.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.bySource[error.source]++;
      stats.byType[error.type]++;
      
      if (error.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }
    });

    // Calculate error rate
    if (timeRange) {
      const hours = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60);
      stats.errorRate = errors.length / Math.max(hours, 1);
    }

    // Top errors by frequency
    const errorCounts = new Map<string, { count: number; severity: string }>();
    errors.forEach(error => {
      const existing = errorCounts.get(error.message);
      if (existing) {
        existing.count++;
      } else {
        errorCounts.set(error.message, { count: 1, severity: error.severity });
      }
    });

    stats.topErrors = Array.from(errorCounts.entries())
      .map(([message, data]) => ({ message, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  /**
   * Resolve an error
   */
  resolveError(errorId: string, resolution?: string): boolean {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      if (resolution) {
        error.context.resolution = resolution;
        error.context.resolvedAt = new Date().toISOString();
      }
      return true;
    }
    return false;
  }

  /**
   * Add error handler
   */
  addErrorHandler(name: string, handler: (error: ErrorInfo) => void): void {
    this.errorHandlers.set(name, handler);
  }

  /**
   * Remove error handler
   */
  removeErrorHandler(name: string): void {
    this.errorHandlers.delete(name);
  }

  /**
   * Export errors for analysis
   */
  exportErrors(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.convertErrorsToCSV(this.errors);
    }
    
    return JSON.stringify({
      errors: this.errors,
      stats: this.getErrorStats(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Clear resolved errors
   */
  clearResolvedErrors(): number {
    const originalLength = this.errors.length;
    this.errors = this.errors.filter(error => !error.resolved);
    return originalLength - this.errors.length;
  }

  // Private methods
  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error || new Error(event.message), {
        sessionId: 'global',
        source: 'system',
        severity: 'high',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          global: true
        }
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        sessionId: 'global',
        source: 'system',
        severity: 'high',
        metadata: {
          promiseRejection: true,
          reason: event.reason
        }
      });
    });

    // Handle console errors (optional)
    if (typeof console !== 'undefined') {
      const originalError = console.error;
      console.error = (...args) => {
        originalError.apply(console, args);
        
        const message = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        
        this.trackError(new Error(message), {
          sessionId: 'console',
          source: 'system',
          severity: 'low',
          metadata: {
            consoleError: true,
            args: args
          }
        });
      };
    }
  }

  private categorizeErrorType(error: Error | string): ErrorInfo['type'] {
    const message = typeof error === 'string' ? error : error.message;
    
    if (message.toLowerCase().includes('warning')) return 'warning';
    if (message.toLowerCase().includes('info')) return 'info';
    return 'error';
  }

  private determineSeverity(error: Error | string): ErrorInfo['severity'] {
    const message = typeof error === 'string' ? error : error.message;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('critical') || 
        lowerMessage.includes('fatal') ||
        lowerMessage.includes('crash')) {
      return 'critical';
    }
    
    if (lowerMessage.includes('error') || 
        lowerMessage.includes('failed') ||
        lowerMessage.includes('exception')) {
      return 'high';
    }
    
    if (lowerMessage.includes('warning') || 
        lowerMessage.includes('deprecated')) {
      return 'medium';
    }
    
    return 'low';
  }

  private determineSource(error: Error | string): ErrorInfo['source'] {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'object' ? error.stack : '';
    const fullText = message + ' ' + stack;
    
    for (const [source, patterns] of Object.entries(this.errorPatterns)) {
      if (patterns.some(pattern => pattern.test(fullText))) {
        return source as ErrorInfo['source'];
      }
    }
    
    return 'system';
  }

  private captureComponentStack(): string | undefined {
    if (typeof Error !== 'undefined') {
      const stack = new Error().stack;
      if (stack) {
        // Extract React component names from stack trace
        const componentLines = stack
          .split('\n')
          .filter(line => line.includes('at ') && (
            line.includes('.tsx') || 
            line.includes('.jsx') || 
            line.includes('Component')
          ))
          .slice(0, 5); // Top 5 components in stack
        
        return componentLines.join('\n');
      }
    }
    return undefined;
  }

  private getViewportInfo(): { width: number; height: number } | undefined {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
    return undefined;
  }

  private generateTags(error: Error | string, context: any): string[] {
    const tags: string[] = [];
    const message = typeof error === 'string' ? error : error.message;
    
    // Add severity tag
    tags.push(`severity:${this.determineSeverity(error)}`);
    
    // Add source tag
    tags.push(`source:${this.determineSource(error)}`);
    
    // Add component tag if available
    if (context.component) {
      tags.push(`component:${context.component}`);
    }
    
    // Add browser tag
    if (typeof navigator !== 'undefined') {
      if (navigator.userAgent.includes('Chrome')) tags.push('browser:chrome');
      else if (navigator.userAgent.includes('Firefox')) tags.push('browser:firefox');
      else if (navigator.userAgent.includes('Safari')) tags.push('browser:safari');
    }
    
    // Add environment tag
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
      tags.push(`env:${process.env.NODE_ENV}`);
    }
    
    return tags;
  }

  private notifyErrorHandlers(error: ErrorInfo): void {
    this.errorHandlers.forEach((handler, name) => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error(`Error handler '${name}' failed:`, handlerError);
      }
    });
  }

  private convertErrorsToCSV(errors: ErrorInfo[]): string {
    if (errors.length === 0) return '';
    
    const headers = [
      'id', 'message', 'type', 'severity', 'source', 'timestamp',
      'resolved', 'userId', 'sessionId', 'component'
    ];
    
    const rows = errors.map(error => [
      error.id,
      `"${error.message.replace(/"/g, '""')}"`,
      error.type,
      error.severity,
      error.source,
      error.timestamp.toISOString(),
      error.resolved,
      error.userId || '',
      error.sessionId,
      error.context.component || ''
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}