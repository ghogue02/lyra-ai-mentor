interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  context: string;
  errorType?: string;
  patternType?: string;
  componentType?: string;
  chapterNumber?: number;
  characterName?: string;
  userAgent: string;
  timestamp: string;
  url: string;
  errorId: string;
  userId?: string;
  sessionId?: string;
}

interface ErrorLogEntry extends ErrorDetails {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'render' | 'network' | 'state' | 'interaction' | 'data' | 'unknown';
  recoverable: boolean;
  userImpact: 'minimal' | 'moderate' | 'severe';
}

export class ErrorLogger {
  private logQueue: ErrorLogEntry[] = [];
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicFlush();
    this.setupUnloadHandler();
  }

  async logError(details: ErrorDetails): Promise<void> {
    const logEntry = this.createLogEntry(details);
    
    // Add to queue
    this.logQueue.push(logEntry);
    
    // Prevent queue overflow
    if (this.logQueue.length > this.MAX_QUEUE_SIZE) {
      this.logQueue = this.logQueue.slice(-this.MAX_QUEUE_SIZE);
    }

    // Immediately log critical errors
    if (logEntry.severity === 'critical') {
      await this.flushLogs();
    }

    // Store in localStorage for persistence
    this.persistError(logEntry);
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(logEntry);
    }
  }

  private createLogEntry(details: ErrorDetails): ErrorLogEntry {
    const category = this.categorizeError(details);
    const severity = this.determineSeverity(details, category);
    const userImpact = this.assessUserImpact(category, severity);
    const recoverable = this.isRecoverable(details, category);

    return {
      ...details,
      category,
      severity,
      userImpact,
      recoverable
    };
  }

  private categorizeError(details: ErrorDetails): ErrorLogEntry['category'] {
    const message = details.message.toLowerCase();
    const stack = details.stack?.toLowerCase() || '';
    const context = details.context.toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('xhr')) {
      return 'network';
    }
    if (context.includes('interactionpattern') || details.patternType) {
      return 'interaction';
    }
    if (message.includes('state') || message.includes('reducer') || message.includes('context')) {
      return 'state';
    }
    if (message.includes('data') || message.includes('parse') || message.includes('json')) {
      return 'data';
    }
    if (stack.includes('render') || message.includes('react') || message.includes('component')) {
      return 'render';
    }
    return 'unknown';
  }

  private determineSeverity(details: ErrorDetails, category: ErrorLogEntry['category']): ErrorLogEntry['severity'] {
    const message = details.message.toLowerCase();

    // Critical errors that break core functionality
    if (message.includes('maximum update depth') || 
        message.includes('invariant violation') ||
        category === 'render' && message.includes('hook')) {
      return 'critical';
    }

    // High severity for user-blocking issues
    if (category === 'network' && message.includes('timeout') ||
        category === 'state' && message.includes('undefined') ||
        details.context.includes('Application')) {
      return 'high';
    }

    // Medium severity for feature-specific issues
    if (category === 'interaction' || 
        details.context.includes('Carmen') ||
        details.context.includes('Pattern')) {
      return 'medium';
    }

    return 'low';
  }

  private assessUserImpact(category: ErrorLogEntry['category'], severity: ErrorLogEntry['severity']): ErrorLogEntry['userImpact'] {
    if (severity === 'critical') return 'severe';
    if (severity === 'high') return 'severe';
    if (category === 'network' || category === 'render') return 'moderate';
    return 'minimal';
  }

  private isRecoverable(details: ErrorDetails, category: ErrorLogEntry['category']): boolean {
    const message = details.message.toLowerCase();
    
    // Non-recoverable errors
    if (message.includes('maximum update depth') ||
        message.includes('invariant violation')) {
      return false;
    }

    // Most network and interaction errors are recoverable
    if (category === 'network' || category === 'interaction') {
      return true;
    }

    // State errors might be recoverable with reset
    if (category === 'state') {
      return !message.includes('hook');
    }

    return true;
  }

  private persistError(logEntry: ErrorLogEntry): void {
    try {
      const existingLogs = this.getPersistedErrors();
      existingLogs.push(logEntry);
      
      // Keep only last 50 errors in localStorage
      const recentLogs = existingLogs.slice(-50);
      localStorage.setItem('error_logs', JSON.stringify(recentLogs));
    } catch (e) {
      console.warn('Failed to persist error log:', e);
    }
  }

  private getPersistedErrors(): ErrorLogEntry[] {
    try {
      const logs = localStorage.getItem('error_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  private logToConsole(logEntry: ErrorLogEntry): void {
    const style = this.getConsoleStyle(logEntry.severity);
    console.group(`%c🚨 Error Logger [${logEntry.severity.toUpperCase()}]`, style);
    console.log('Error ID:', logEntry.errorId);
    console.log('Category:', logEntry.category);
    console.log('Context:', logEntry.context);
    console.log('Message:', logEntry.message);
    console.log('User Impact:', logEntry.userImpact);
    console.log('Recoverable:', logEntry.recoverable);
    if (logEntry.stack) {
      console.log('Stack:', logEntry.stack);
    }
    console.groupEnd();
  }

  private getConsoleStyle(severity: ErrorLogEntry['severity']): string {
    switch (severity) {
      case 'critical':
        return 'color: white; background-color: #dc2626; font-weight: bold; padding: 2px 6px; border-radius: 3px;';
      case 'high':
        return 'color: white; background-color: #ea580c; font-weight: bold; padding: 2px 6px; border-radius: 3px;';
      case 'medium':
        return 'color: white; background-color: #d97706; font-weight: bold; padding: 2px 6px; border-radius: 3px;';
      default:
        return 'color: white; background-color: #065f46; font-weight: bold; padding: 2px 6px; border-radius: 3px;';
    }
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.logQueue.length > 0) {
        this.flushLogs();
      }
    }, this.FLUSH_INTERVAL);
  }

  private setupUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      if (this.logQueue.length > 0) {
        this.flushLogs();
      }
    });
  }

  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const batch = this.logQueue.splice(0, this.BATCH_SIZE);
    
    try {
      // In production, send to your error tracking service
      if (process.env.NODE_ENV === 'production') {
        await this.sendToErrorService(batch);
      }
      
      // Always send to Supabase for analytics
      await this.sendToSupabase(batch);
    } catch (error) {
      console.warn('Failed to flush error logs:', error);
      // Put logs back in queue if sending failed
      this.logQueue.unshift(...batch);
    }
  }

  private async sendToErrorService(logs: ErrorLogEntry[]): Promise<void> {
    // Example integration with external error tracking service
    // Replace with your actual error tracking service (Sentry, LogRocket, etc.)
    
    /*
    if (window.errorTracker) {
      logs.forEach(log => {
        window.errorTracker.captureException(new Error(log.message), {
          tags: {
            category: log.category,
            severity: log.severity,
            context: log.context
          },
          extra: log
        });
      });
    }
    */
  }

  private async sendToSupabase(logs: ErrorLogEntry[]): Promise<void> {
    try {
      // Note: In a real application, you would import supabase here
      // and send the logs to a dedicated error_logs table
      
      /*
      const { error } = await supabase
        .from('error_logs')
        .insert(logs.map(log => ({
          error_id: log.errorId,
          message: log.message,
          category: log.category,
          severity: log.severity,
          context: log.context,
          user_id: log.userId,
          session_id: log.sessionId,
          user_impact: log.userImpact,
          recoverable: log.recoverable,
          metadata: {
            stack: log.stack,
            componentStack: log.componentStack,
            userAgent: log.userAgent,
            url: log.url,
            errorType: log.errorType,
            patternType: log.patternType,
            componentType: log.componentType,
            chapterNumber: log.chapterNumber,
            characterName: log.characterName
          },
          created_at: log.timestamp
        })));

      if (error) {
        throw error;
      }
      */
      
      // For now, just log that we would send to Supabase
      console.log('Would send to Supabase:', logs.length, 'error logs');
    } catch (error) {
      console.warn('Failed to send error logs to Supabase:', error);
      throw error;
    }
  }

  // Public methods for error analysis
  public getErrorStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    recentErrors: ErrorLogEntry[];
  } {
    const persistedErrors = this.getPersistedErrors();
    const allErrors = [...persistedErrors, ...this.logQueue];
    
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    
    allErrors.forEach(error => {
      byCategory[error.category] = (byCategory[error.category] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });
    
    return {
      total: allErrors.length,
      byCategory,
      bySeverity,
      recentErrors: allErrors.slice(-10)
    };
  }

  public clearLogs(): void {
    this.logQueue = [];
    localStorage.removeItem('error_logs');
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flushLogs();
  }
}