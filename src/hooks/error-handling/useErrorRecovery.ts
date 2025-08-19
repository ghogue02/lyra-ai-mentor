import { useCallback, useRef, useState } from 'react';
import { ErrorRecoveryManager } from '@/utils/error-handling/ErrorRecoveryManager';
import { NetworkErrorHandler } from '@/utils/error-handling/NetworkErrorHandler';
import { useErrorNotification } from './useErrorNotification';

interface RecoveryState {
  isRecovering: boolean;
  lastRecoveryAttempt: number | null;
  recoveryStrategy: string | null;
  recoveryCount: number;
}

interface RecoveryOptions {
  maxAutoRecoveryAttempts?: number;
  recoveryDelay?: number;
  enableProgressiveRecovery?: boolean;
  notifyUser?: boolean;
}

export const useErrorRecovery = (options: RecoveryOptions = {}) => {
  const {
    maxAutoRecoveryAttempts = 3,
    recoveryDelay = 1000,
    enableProgressiveRecovery = true,
    notifyUser = true
  } = options;

  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRecovering: false,
    lastRecoveryAttempt: null,
    recoveryStrategy: null,
    recoveryCount: 0
  });

  const recoveryManagerRef = useRef<ErrorRecoveryManager>(new ErrorRecoveryManager());
  const networkHandlerRef = useRef<NetworkErrorHandler>(new NetworkErrorHandler());
  const {
    showRecoverySuccess,
    showRecoveryFailed,
    showProgressiveError
  } = useErrorNotification();

  // Generic error recovery
  const recoverFromError = useCallback(async (
    error: Error,
    errorType: 'network' | 'state' | 'component' | 'interaction' | 'chunk',
    context?: string
  ): Promise<boolean> => {
    if (recoveryState.isRecovering) {
      return false; // Already recovering
    }

    setRecoveryState(prev => ({
      ...prev,
      isRecovering: true,
      lastRecoveryAttempt: Date.now(),
      recoveryCount: prev.recoveryCount + 1
    }));

    try {
      let recoveryResult;
      let strategyName: string;

      switch (errorType) {
        case 'network':
          recoveryResult = await recoveryManagerRef.current.attemptNetworkRecovery();
          strategyName = 'Network Recovery';
          break;
        
        case 'chunk':
          recoveryResult = await recoveryManagerRef.current.clearChunkCache();
          strategyName = 'Chunk Cache Clear';
          break;
        
        case 'state':
          recoveryResult = await recoveryManagerRef.current.resetApplicationState();
          strategyName = 'State Reset';
          break;
        
        case 'interaction':
          if (context) {
            recoveryResult = await recoveryManagerRef.current.resetInteractionPattern(context);
            strategyName = `${context} Pattern Reset`;
          } else {
            throw new Error('Context required for interaction recovery');
          }
          break;
        
        case 'component':
          if (context) {
            const [componentType, chapterNumber] = context.split(':');
            recoveryResult = await recoveryManagerRef.current.resetCarmenComponent(
              componentType, 
              chapterNumber ? parseInt(chapterNumber) : undefined
            );
            strategyName = `${componentType} Component Reset`;
          } else {
            throw new Error('Context required for component recovery');
          }
          break;
        
        default:
          throw new Error(`Unknown error type: ${errorType}`);
      }

      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        recoveryStrategy: strategyName
      }));

      if (recoveryResult.success && notifyUser) {
        showRecoverySuccess(
          `${strategyName} Successful`,
          `Recovered in ${recoveryResult.duration}ms`
        );
      }

      return recoveryResult.success;
    } catch (recoveryError) {
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        recoveryStrategy: null
      }));

      if (notifyUser) {
        showRecoveryFailed(recoveryError as Error, () => {
          // Offer manual recovery options
          window.location.reload();
        });
      }

      return false;
    }
  }, [recoveryState.isRecovering, recoveryState.recoveryCount, notifyUser, showRecoverySuccess, showRecoveryFailed]);

  // Network-specific recovery
  const recoverFromNetworkError = useCallback(async (error: Error): Promise<boolean> => {
    try {
      await networkHandlerRef.current.attemptRecovery();
      
      if (notifyUser) {
        showRecoverySuccess('Connection Restored', 'Network connectivity has been restored.');
      }
      
      return true;
    } catch (networkError) {
      return recoverFromError(error, 'network');
    }
  }, [recoverFromError, notifyUser, showRecoverySuccess]);

  // Progressive recovery with escalation
  const progressiveRecovery = useCallback(async (
    error: Error,
    errorType: 'network' | 'state' | 'component' | 'interaction' | 'chunk',
    context?: string
  ): Promise<boolean> => {
    if (!enableProgressiveRecovery) {
      return recoverFromError(error, errorType, context);
    }

    const { recoveryCount } = recoveryState;
    
    // Show progressive error notification
    if (notifyUser) {
      showProgressiveError(
        error,
        recoveryCount + 1,
        maxAutoRecoveryAttempts,
        () => progressiveRecovery(error, errorType, context),
        () => window.location.reload()
      );
    }

    // Stop if max attempts reached
    if (recoveryCount >= maxAutoRecoveryAttempts) {
      return false;
    }

    // Progressive delay based on attempt count
    const delay = recoveryDelay * Math.pow(2, recoveryCount);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Escalate recovery strategy based on attempt count
    switch (recoveryCount) {
      case 0:
        // First attempt: targeted recovery
        return recoverFromError(error, errorType, context);
      
      case 1:
        // Second attempt: broader state reset
        return recoverFromError(error, 'state');
      
      case 2:
        // Third attempt: full cache clear
        const cacheResult = await recoveryManagerRef.current.clearAllCaches();
        if (cacheResult.success) {
          setTimeout(() => window.location.reload(), 1000);
          return true;
        }
        return false;
      
      default:
        // Final attempt: full page reload
        window.location.reload();
        return true;
    }
  }, [
    enableProgressiveRecovery,
    recoveryState.recoveryCount,
    maxAutoRecoveryAttempts,
    recoveryDelay,
    notifyUser,
    showProgressiveError,
    recoverFromError
  ]);

  // Interaction pattern recovery
  const recoverInteractionPattern = useCallback(async (
    patternType: string,
    error: Error
  ): Promise<boolean> => {
    return recoverFromError(error, 'interaction', patternType);
  }, [recoverFromError]);

  // Carmen component recovery
  const recoverCarmenComponent = useCallback(async (
    componentType: string,
    chapterNumber: number | undefined,
    error: Error
  ): Promise<boolean> => {
    const context = chapterNumber ? `${componentType}:${chapterNumber}` : componentType;
    return recoverFromError(error, 'component', context);
  }, [recoverFromError]);

  // Manual recovery actions
  const manualRecovery = useCallback(async (action: 'reload' | 'clear-cache' | 'reset-state' | 'go-home') => {
    setRecoveryState(prev => ({
      ...prev,
      isRecovering: true,
      lastRecoveryAttempt: Date.now()
    }));

    try {
      switch (action) {
        case 'reload':
          window.location.reload();
          break;
        
        case 'clear-cache':
          await recoveryManagerRef.current.clearAllCaches();
          setTimeout(() => window.location.reload(), 500);
          break;
        
        case 'reset-state':
          await recoveryManagerRef.current.resetApplicationState();
          if (notifyUser) {
            showRecoverySuccess('State Reset', 'Application state has been reset.');
          }
          break;
        
        case 'go-home':
          window.location.href = '/dashboard';
          break;
      }
      
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false
      }));
      
      return true;
    } catch (error) {
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false
      }));
      
      if (notifyUser) {
        showRecoveryFailed(error as Error);
      }
      
      return false;
    }
  }, [notifyUser, showRecoverySuccess, showRecoveryFailed]);

  // Reset recovery state
  const resetRecoveryState = useCallback(() => {
    setRecoveryState({
      isRecovering: false,
      lastRecoveryAttempt: null,
      recoveryStrategy: null,
      recoveryCount: 0
    });
  }, []);

  // Get recovery statistics
  const getRecoveryStats = useCallback(() => {
    return recoveryManagerRef.current.getRecoveryStats();
  }, []);

  // Check if we should attempt automatic recovery
  const shouldAttemptRecovery = useCallback((error: Error): boolean => {
    const { recoveryCount, lastRecoveryAttempt } = recoveryState;
    
    // Don't recover if already recovering
    if (recoveryState.isRecovering) {
      return false;
    }
    
    // Don't recover if max attempts reached
    if (recoveryCount >= maxAutoRecoveryAttempts) {
      return false;
    }
    
    // Don't recover too frequently
    if (lastRecoveryAttempt && Date.now() - lastRecoveryAttempt < 5000) {
      return false;
    }
    
    // Don't recover from certain critical errors
    const message = error.message.toLowerCase();
    if (message.includes('maximum update depth') || 
        message.includes('invariant violation')) {
      return false;
    }
    
    return true;
  }, [recoveryState, maxAutoRecoveryAttempts]);

  return {
    // State
    recoveryState,
    isRecovering: recoveryState.isRecovering,
    
    // Basic recovery
    recoverFromError,
    progressiveRecovery,
    
    // Specialized recovery
    recoverFromNetworkError,
    recoverInteractionPattern,
    recoverCarmenComponent,
    
    // Manual actions
    manualRecovery,
    
    // Utilities
    shouldAttemptRecovery,
    resetRecoveryState,
    getRecoveryStats
  };
};