import React, { createContext, useContext } from 'react';
import { useErrorNotification } from '@/hooks/error-handling/useErrorNotification';
import { useErrorRecovery } from '@/hooks/error-handling/useErrorRecovery';

interface ErrorBoundaryContextType {
  // Error notification methods
  showErrorNotification: ReturnType<typeof useErrorNotification>['showErrorNotification'];
  showNetworkError: ReturnType<typeof useErrorNotification>['showNetworkError'];
  showInteractionPatternError: ReturnType<typeof useErrorNotification>['showInteractionPatternError'];
  showCarmenComponentError: ReturnType<typeof useErrorNotification>['showCarmenComponentError'];
  showCriticalError: ReturnType<typeof useErrorNotification>['showCriticalError'];
  showRecoverySuccess: ReturnType<typeof useErrorNotification>['showRecoverySuccess'];
  showRecoveryFailed: ReturnType<typeof useErrorNotification>['showRecoveryFailed'];
  
  // Error recovery methods
  recoverFromError: ReturnType<typeof useErrorRecovery>['recoverFromError'];
  recoverFromNetworkError: ReturnType<typeof useErrorRecovery>['recoverFromNetworkError'];
  recoverInteractionPattern: ReturnType<typeof useErrorRecovery>['recoverInteractionPattern'];
  recoverCarmenComponent: ReturnType<typeof useErrorRecovery>['recoverCarmenComponent'];
  progressiveRecovery: ReturnType<typeof useErrorRecovery>['progressiveRecovery'];
  manualRecovery: ReturnType<typeof useErrorRecovery>['manualRecovery'];
  
  // State
  isRecovering: boolean;
  hasActiveNotifications: boolean;
  recoveryStats: ReturnType<typeof useErrorRecovery>['getRecoveryStats'];
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | null>(null);

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
  maxAutoRecoveryAttempts?: number;
  recoveryDelay?: number;
  enableProgressiveRecovery?: boolean;
  notifyUser?: boolean;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({
  children,
  maxAutoRecoveryAttempts = 3,
  recoveryDelay = 1000,
  enableProgressiveRecovery = true,
  notifyUser = true
}) => {
  const errorNotification = useErrorNotification();
  const errorRecovery = useErrorRecovery({
    maxAutoRecoveryAttempts,
    recoveryDelay,
    enableProgressiveRecovery,
    notifyUser
  });

  const value: ErrorBoundaryContextType = {
    // Error notification methods
    showErrorNotification: errorNotification.showErrorNotification,
    showNetworkError: errorNotification.showNetworkError,
    showInteractionPatternError: errorNotification.showInteractionPatternError,
    showCarmenComponentError: errorNotification.showCarmenComponentError,
    showCriticalError: errorNotification.showCriticalError,
    showRecoverySuccess: errorNotification.showRecoverySuccess,
    showRecoveryFailed: errorNotification.showRecoveryFailed,
    
    // Error recovery methods
    recoverFromError: errorRecovery.recoverFromError,
    recoverFromNetworkError: errorRecovery.recoverFromNetworkError,
    recoverInteractionPattern: errorRecovery.recoverInteractionPattern,
    recoverCarmenComponent: errorRecovery.recoverCarmenComponent,
    progressiveRecovery: errorRecovery.progressiveRecovery,
    manualRecovery: errorRecovery.manualRecovery,
    
    // State
    isRecovering: errorRecovery.isRecovering,
    hasActiveNotifications: errorNotification.hasActiveNotifications,
    recoveryStats: errorRecovery.getRecoveryStats
  };

  return (
    <ErrorBoundaryContext.Provider value={value}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};

export const useErrorBoundaryContext = () => {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundaryContext must be used within an ErrorBoundaryProvider');
  }
  return context;
};

// Hook for easy error handling in components
export const useErrorHandler = () => {
  const context = useErrorBoundaryContext();
  
  const handleError = React.useCallback(async (
    error: Error,
    options: {
      type: 'network' | 'state' | 'component' | 'interaction' | 'chunk';
      context?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      enableRecovery?: boolean;
      showNotification?: boolean;
    }
  ) => {
    const {
      type,
      context: errorContext,
      severity = 'medium',
      enableRecovery = true,
      showNotification = true
    } = options;

    // Show notification based on type
    if (showNotification) {
      switch (type) {
        case 'network':
          context.showNetworkError(error, enableRecovery ? () => context.recoverFromNetworkError(error) : undefined);
          break;
        case 'interaction':
          if (errorContext) {
            context.showInteractionPatternError(
              error, 
              errorContext, 
              enableRecovery ? () => context.recoverInteractionPattern(errorContext, error) : undefined
            );
          }
          break;
        case 'component':
          if (errorContext) {
            const [componentType, chapterNumber] = errorContext.split(':');
            context.showCarmenComponentError(
              error,
              componentType,
              enableRecovery ? () => context.recoverCarmenComponent(componentType, chapterNumber ? parseInt(chapterNumber) : undefined, error) : undefined
            );
          }
          break;
        default:
          context.showErrorNotification(error, { severity }, enableRecovery ? {
            onRetry: () => context.recoverFromError(error, type, errorContext)
          } : undefined);
      }
    }

    // Attempt recovery if enabled
    if (enableRecovery) {
      try {
        const recovered = await context.progressiveRecovery(error, type, errorContext);
        return recovered;
      } catch (recoveryError) {
        console.error('Recovery failed:', recoveryError);
        return false;
      }
    }

    return false;
  }, [context]);

  const handleNetworkError = React.useCallback((error: Error, enableRecovery = true) => {
    return handleError(error, { type: 'network', enableRecovery });
  }, [handleError]);

  const handleInteractionPatternError = React.useCallback((error: Error, patternType: string, enableRecovery = true) => {
    return handleError(error, { type: 'interaction', context: patternType, enableRecovery });
  }, [handleError]);

  const handleCarmenComponentError = React.useCallback((error: Error, componentType: string, chapterNumber?: number, enableRecovery = true) => {
    const context = chapterNumber ? `${componentType}:${chapterNumber}` : componentType;
    return handleError(error, { type: 'component', context, enableRecovery });
  }, [handleError]);

  return {
    handleError,
    handleNetworkError,
    handleInteractionPatternError,
    handleCarmenComponentError,
    isRecovering: context.isRecovering,
    hasActiveNotifications: context.hasActiveNotifications,
    manualRecovery: context.manualRecovery
  };
};

export default ErrorBoundaryProvider;