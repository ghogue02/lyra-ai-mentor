// Export all error handling utilities
export { ErrorLogger } from './ErrorLogger';
export { ErrorRecoveryManager } from './ErrorRecoveryManager';
export { NetworkErrorHandler } from './NetworkErrorHandler';

// Export error boundary components
export * from '@/components/error-boundaries';

// Export hooks
export { useErrorNotification } from '@/hooks/error-handling/useErrorNotification';
export { useErrorRecovery } from '@/hooks/error-handling/useErrorRecovery';

// Export wrapper components
export { InteractionPatternWrapper } from '@/components/wrappers/InteractionPatternWrapper';
export { CarmenComponentWrapper } from '@/components/wrappers/CarmenComponentWrapper';

// Export provider
export { ErrorBoundaryProvider, useErrorBoundaryContext, useErrorHandler } from '@/components/error-boundaries/ErrorBoundaryProvider';

// Type definitions
export interface ErrorHandlingConfig {
  enableAutoRecovery: boolean;
  maxRetries: number;
  showDetails: boolean;
  enableFallbackMode: boolean;
  enableChapterRecovery: boolean;
  notifyUser: boolean;
  enableProgressiveRecovery: boolean;
  maxAutoRecoveryAttempts: number;
  recoveryDelay: number;
}

export interface ErrorContext {
  type: 'application' | 'interaction-pattern' | 'carmen-component' | 'network' | 'async';
  component?: string;
  chapter?: number;
  pattern?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  successRate: number;
  estimatedTime: number;
}

// Utility functions
export const createErrorContext = (
  type: ErrorContext['type'],
  options: Partial<Omit<ErrorContext, 'type'>> = {}
): ErrorContext => ({
  type,
  severity: 'medium',
  ...options
});

export const getErrorSeverity = (error: Error): ErrorContext['severity'] => {
  const message = error.message.toLowerCase();
  
  if (message.includes('maximum update depth') || 
      message.includes('invariant violation') ||
      message.includes('critical')) {
    return 'critical';
  }
  
  if (message.includes('network') || 
      message.includes('timeout') ||
      message.includes('chunk')) {
    return 'high';
  }
  
  if (message.includes('state') || 
      message.includes('interaction') ||
      message.includes('component')) {
    return 'medium';
  }
  
  return 'low';
};

export const isRecoverableError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  
  // Non-recoverable errors
  if (message.includes('maximum update depth') ||
      message.includes('invariant violation') ||
      message.includes('out of memory')) {
    return false;
  }
  
  return true;
};

// Error boundary factory functions
export const createApplicationErrorBoundary = (config: Partial<ErrorHandlingConfig> = {}) => {
  const defaultConfig: ErrorHandlingConfig = {
    enableAutoRecovery: true,
    maxRetries: 3,
    showDetails: process.env.NODE_ENV === 'development',
    enableFallbackMode: true,
    enableChapterRecovery: true,
    notifyUser: true,
    enableProgressiveRecovery: true,
    maxAutoRecoveryAttempts: 3,
    recoveryDelay: 1000
  };
  
  return { ...defaultConfig, ...config };
};

export const createInteractionPatternErrorBoundary = (
  patternType: string,
  config: Partial<ErrorHandlingConfig> = {}
) => {
  const baseConfig = createApplicationErrorBoundary(config);
  return {
    ...baseConfig,
    patternType,
    enableFallbackMode: true
  };
};

export const createCarmenComponentErrorBoundary = (
  componentType: string,
  chapterNumber?: number,
  config: Partial<ErrorHandlingConfig> = {}
) => {
  const baseConfig = createApplicationErrorBoundary(config);
  return {
    ...baseConfig,
    componentType,
    chapterNumber,
    enableChapterRecovery: true
  };
};

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // Could send to error tracking service
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Could send to error tracking service
  });
};

// Error tracking integration
export const trackError = (
  error: Error,
  context: ErrorContext,
  additionalData: Record<string, any> = {}
) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalData
  };
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: errorData });
    console.log('Error tracked:', errorData);
  } else {
    console.error('Error details:', errorData);
  }
};