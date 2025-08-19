import React, { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorNotificationConfig {
  showRetryAction: boolean;
  showReportAction: boolean;
  autoHide: boolean;
  hideDelay: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
}

interface ErrorNotification {
  id: string;
  title: string;
  description: string;
  config: ErrorNotificationConfig;
  timestamp: number;
  onRetry?: () => void;
  onReport?: () => void;
  onDismiss?: () => void;
}

const defaultConfig: ErrorNotificationConfig = {
  showRetryAction: true,
  showReportAction: false,
  autoHide: true,
  hideDelay: 5000,
  severity: 'medium'
};

export const useErrorNotification = () => {
  const { toast } = useToast();
  const [activeNotifications, setActiveNotifications] = useState<ErrorNotification[]>([]);

  const showErrorNotification = useCallback((
    error: Error,
    customConfig: Partial<ErrorNotificationConfig> = {},
    actions?: {
      onRetry?: () => void;
      onReport?: () => void;
    }
  ) => {
    const config = { ...defaultConfig, ...customConfig };
    const id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { title, description } = getErrorMessageContent(error, config);
    
    const notification: ErrorNotification = {
      id,
      title,
      description,
      config,
      timestamp: Date.now(),
      onRetry: actions?.onRetry,
      onReport: actions?.onReport,
      onDismiss: () => dismissNotification(id)
    };

    // Add to active notifications
    setActiveNotifications(prev => [...prev, notification]);

    // Show toast notification
    const toastConfig = getToastConfig(notification);
    toast(toastConfig);

    // Auto-hide if configured
    if (config.autoHide) {
      setTimeout(() => {
        dismissNotification(id);
      }, config.hideDelay);
    }

    return id;
  }, [toast]);

  const dismissNotification = useCallback((id: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAllNotifications = useCallback(() => {
    setActiveNotifications([]);
  }, []);

  const getErrorMessageContent = (
    error: Error, 
    config: ErrorNotificationConfig
  ): { title: string; description: string } => {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('offline')) {
      return {
        title: 'Connection Issue',
        description: 'Unable to connect to our servers. Please check your internet connection and try again.'
      };
    }
    
    // Chunk loading errors
    if (message.includes('chunk') || message.includes('loading')) {
      return {
        title: 'Loading Issue',
        description: 'A component failed to load. This is usually temporary - please refresh the page.'
      };
    }
    
    // Interaction pattern errors
    if (config.context?.includes('InteractionPattern')) {
      return {
        title: 'Interactive Feature Unavailable',
        description: 'An interactive component encountered an issue. You can try again or use the simplified version.'
      };
    }
    
    // Carmen component errors
    if (config.context?.includes('Carmen')) {
      return {
        title: 'Carmen\'s Workshop Issue',
        description: 'Carmen\'s workshop encountered a problem. Don\'t worry - your progress is saved and you can restart the lesson.'
      };
    }
    
    // State/data errors
    if (message.includes('state') || message.includes('undefined') || message.includes('data')) {
      return {
        title: 'Data Sync Issue',
        description: 'There was a problem with your data. We\'re working to recover automatically.'
      };
    }
    
    // Critical rendering errors
    if (config.severity === 'critical') {
      return {
        title: 'Critical Error',
        description: 'A serious error occurred. Please refresh the page or contact support if this continues.'
      };
    }
    
    // Generic error
    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again or refresh the page.'
    };
  };

  const getToastConfig = (notification: ErrorNotification) => {
    const { config, onRetry, onReport } = notification;
    
    // Base configuration
    const toastConfig: any = {
      title: notification.title,
      description: notification.description,
      variant: getSeverityVariant(config.severity),
      duration: config.autoHide ? config.hideDelay : undefined
    };

    // Add action buttons
    if (config.showRetryAction || config.showReportAction) {
      toastConfig.action = React.createElement('div', 
        { className: 'flex gap-2' },
        config.showRetryAction && onRetry && React.createElement('button', 
          {
            onClick: onRetry,
            className: 'px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors'
          },
          'Try Again'
        ),
        config.showReportAction && onReport && React.createElement('button',
          {
            onClick: onReport,
            className: 'px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors'
          },
          'Report'
        )
      );
    }

    return toastConfig;
  };

  const getSeverityVariant = (severity: ErrorNotificationConfig['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  // Specialized notification methods
  const showNetworkError = useCallback((error: Error, onRetry?: () => void) => {
    return showErrorNotification(error, {
      severity: 'high',
      context: 'Network',
      showRetryAction: true,
      showReportAction: false,
      hideDelay: 7000
    }, { onRetry });
  }, [showErrorNotification]);

  const showInteractionPatternError = useCallback((
    error: Error, 
    patternType: string,
    onRetry?: () => void,
    onFallback?: () => void
  ) => {
    return showErrorNotification(error, {
      severity: 'medium',
      context: `InteractionPattern:${patternType}`,
      showRetryAction: true,
      showReportAction: false,
      hideDelay: 6000
    }, { 
      onRetry: onRetry || onFallback 
    });
  }, [showErrorNotification]);

  const showCarmenComponentError = useCallback((
    error: Error,
    componentType: string,
    onRetry?: () => void,
    onRestart?: () => void
  ) => {
    return showErrorNotification(error, {
      severity: 'medium',
      context: `Carmen:${componentType}`,
      showRetryAction: true,
      showReportAction: true,
      hideDelay: 8000
    }, { 
      onRetry: onRetry || onRestart,
      onReport: () => reportCarmenError(error, componentType)
    });
  }, [showErrorNotification]);

  const showCriticalError = useCallback((error: Error, onReload?: () => void) => {
    return showErrorNotification(error, {
      severity: 'critical',
      context: 'Critical',
      showRetryAction: true,
      showReportAction: true,
      autoHide: false // Don't auto-hide critical errors
    }, { 
      onRetry: onReload || (() => window.location.reload()),
      onReport: () => reportCriticalError(error)
    });
  }, [showErrorNotification]);

  const showRecoverySuccess = useCallback((message: string, details?: string) => {
    toast({
      title: "✅ " + message,
      description: details || "The issue has been resolved and you can continue.",
      variant: "default",
      duration: 4000
    });
  }, [toast]);

  const showRecoveryFailed = useCallback((error: Error, onManualAction?: () => void) => {
    return showErrorNotification(error, {
      severity: 'high',
      context: 'Recovery',
      showRetryAction: true,
      showReportAction: true,
      autoHide: false
    }, {
      onRetry: onManualAction,
      onReport: () => reportRecoveryFailure(error)
    });
  }, [showErrorNotification]);

  // Helper functions for reporting
  const reportCarmenError = (error: Error, componentType: string) => {
    const reportData = {
      type: 'carmen_component_error',
      component: componentType,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    // Send to support system or create mailto
    const subject = encodeURIComponent(`Carmen Component Error: ${componentType}`);
    const body = encodeURIComponent(`Error in Carmen's ${componentType} component:\n\n${JSON.stringify(reportData, null, 2)}`);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  const reportCriticalError = (error: Error) => {
    const reportData = {
      type: 'critical_application_error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    const subject = encodeURIComponent('Critical Application Error');
    const body = encodeURIComponent(`Critical error occurred:\n\n${JSON.stringify(reportData, null, 2)}`);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  const reportRecoveryFailure = (error: Error) => {
    const reportData = {
      type: 'recovery_failure',
      error: error.message,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    const subject = encodeURIComponent('Error Recovery Failed');
    const body = encodeURIComponent(`Automatic error recovery failed:\n\n${JSON.stringify(reportData, null, 2)}`);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  // Progressive error escalation
  const showProgressiveError = useCallback((
    error: Error,
    attemptCount: number,
    maxAttempts: number,
    onRetry?: () => void,
    onGiveUp?: () => void
  ) => {
    if (attemptCount >= maxAttempts) {
      return showCriticalError(error, onGiveUp);
    }
    
    const severity: ErrorNotificationConfig['severity'] = 
      attemptCount === 1 ? 'low' : 
      attemptCount === 2 ? 'medium' : 'high';
    
    return showErrorNotification(error, {
      severity,
      context: 'Progressive',
      showRetryAction: true,
      showReportAction: attemptCount >= 2,
      hideDelay: Math.min(3000 + (attemptCount * 2000), 10000)
    }, { onRetry });
  }, [showErrorNotification, showCriticalError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dismissAllNotifications();
    };
  }, [dismissAllNotifications]);

  return {
    // Basic methods
    showErrorNotification,
    dismissNotification,
    dismissAllNotifications,
    
    // Specialized methods
    showNetworkError,
    showInteractionPatternError,
    showCarmenComponentError,
    showCriticalError,
    showRecoverySuccess,
    showRecoveryFailed,
    showProgressiveError,
    
    // State
    activeNotifications,
    hasActiveNotifications: activeNotifications.length > 0
  };
};