import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug, Shield } from 'lucide-react';

interface ReactValidationState {
  isValid: boolean;
  errors: string[];
  retryCount: number;
  lastValidation: Date | null;
}

interface ReactValidatorContextType {
  state: ReactValidationState;
  validate: () => boolean;
  retry: () => void;
}

const ReactValidatorContext = createContext<ReactValidatorContextType | null>(null);

/**
 * React Context Validator - Ensures React APIs are available for Chapter 7 interactive lessons
 * This prevents the "Cannot read properties of undefined (reading 'filter')" errors
 */
export const ReactContextValidator: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ReactValidationState>({
    isValid: false,
    errors: [],
    retryCount: 0,
    lastValidation: null
  });

  const validateReact = (): boolean => {
    console.log('🔍 [REACT VALIDATOR] Starting React validation...');
    const errors: string[] = [];
    const timestamp = new Date();

    try {
      // Core React validation
      if (typeof React === 'undefined') {
        errors.push('React is undefined');
      } else {
        // Check essential React APIs
        if (typeof React.createContext !== 'function') {
          errors.push('React.createContext is not a function');
        }
        if (typeof React.useContext !== 'function') {
          errors.push('React.useContext is not a function');
        }
        if (typeof React.useState !== 'function') {
          errors.push('React.useState is not a function');
        }
        if (typeof React.useEffect !== 'function') {
          errors.push('React.useEffect is not a function');
        }
        if (typeof React.createElement !== 'function') {
          errors.push('React.createElement is not a function');
        }

        // Test createContext functionality
        try {
          const testContext = React.createContext(null);
          if (!testContext || typeof testContext.Provider !== 'function') {
            errors.push('React.createContext does not return valid context');
          }
        } catch (contextError) {
          errors.push(`React.createContext test failed: ${contextError.message}`);
        }
      }

      const isValid = errors.length === 0;
      
      setState(prev => ({
        isValid,
        errors,
        retryCount: prev.retryCount,
        lastValidation: timestamp
      }));

      if (isValid) {
        console.log('✅ [REACT VALIDATOR] React validation passed');
      } else {
        console.error('❌ [REACT VALIDATOR] React validation failed:', errors);
      }

      return isValid;
    } catch (error) {
      errors.push(`Validation exception: ${error.message}`);
      setState(prev => ({
        isValid: false,
        errors,
        retryCount: prev.retryCount,
        lastValidation: timestamp
      }));
      console.error('❌ [REACT VALIDATOR] Validation exception:', error);
      return false;
    }
  };

  const retry = () => {
    console.log('🔄 [REACT VALIDATOR] Retrying React validation...');
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1
    }));
    
    // Use exponential backoff for retries
    const delay = Math.min(1000 * Math.pow(2, state.retryCount), 10000);
    setTimeout(() => {
      validateReact();
    }, delay);
  };

  // Initial validation and periodic re-validation
  useEffect(() => {
    validateReact();

    // Set up periodic validation (every 30 seconds)
    const interval = setInterval(() => {
      if (!state.isValid) {
        validateReact();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-retry on failure
  useEffect(() => {
    if (!state.isValid && state.retryCount < 5) {
      const timeout = setTimeout(retry, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.isValid, state.retryCount]);

  const contextValue: ReactValidatorContextType = {
    state,
    validate: validateReact,
    retry
  };

  // If validation failed and we've exhausted retries, show error UI
  if (!state.isValid && state.retryCount >= 5) {
    return (
      <ReactValidationErrorUI 
        errors={state.errors} 
        retryCount={state.retryCount}
        onRetry={retry}
        lastValidation={state.lastValidation}
      />
    );
  }

  return (
    <ReactValidatorContext.Provider value={contextValue}>
      {state.isValid ? children : <ReactValidationLoadingUI onRetry={retry} />}
    </ReactValidatorContext.Provider>
  );
};

export const useReactValidator = () => {
  const context = useContext(ReactValidatorContext);
  if (!context) {
    throw new Error('useReactValidator must be used within ReactContextValidator');
  }
  return context;
};

interface ReactValidationErrorUIProps {
  errors: string[];
  retryCount: number;
  onRetry: () => void;
  lastValidation: Date | null;
}

const ReactValidationErrorUI: React.FC<ReactValidationErrorUIProps> = ({
  errors,
  retryCount,
  onRetry,
  lastValidation
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border-2 border-red-200 overflow-hidden">
        <div className="bg-red-600 text-white p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold">React Context Validation Failed</h1>
              <p className="text-red-100 text-sm">Critical system components are not available</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-600" />
              Detected Issues
            </h2>
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              What This Means
            </h3>
            <p className="text-yellow-700 text-sm leading-relaxed">
              The Chapter 7 interactive lessons require specific React functionality that isn't currently available. 
              This typically occurs when there's a bundle version mismatch or caching issue. The system has 
              attempted {retryCount} automatic fixes.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Troubleshooting Steps</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                <span>Clear your browser cache and reload the page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                <span>Try using an incognito/private browsing window</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                <span>If the issue persists, wait 5-10 minutes and try again</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRetry}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again ({retryCount}/5)
            </button>
            
            <button
              onClick={() => {
                // Clear all caches and force reload
                if ('caches' in window) {
                  caches.keys().then(keys => 
                    Promise.all(keys.map(key => caches.delete(key)))
                  ).then(() => window.location.reload(true));
                } else {
                  window.location.reload(true);
                }
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Clear Cache & Reload
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">Technical Details</summary>
              <div className="mt-2 p-3 bg-gray-50 rounded border font-mono text-xs">
                <div>Last Validation: {lastValidation?.toISOString() || 'Never'}</div>
                <div>Retry Count: {retryCount}</div>
                <div>User Agent: {navigator.userAgent}</div>
                <div>React Available: {typeof React !== 'undefined' ? 'Yes' : 'No'}</div>
                <div>React Version: {React?.version || 'Unknown'}</div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReactValidationLoadingUIProps {
  onRetry: () => void;
}

const ReactValidationLoadingUI: React.FC<ReactValidationLoadingUIProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-blue-200 overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Validating System Components
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Ensuring React APIs are ready for Chapter 7 interactive lessons...
          </p>
          <button
            onClick={onRetry}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
          >
            Skip validation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactContextValidator;