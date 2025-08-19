import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// React Context Validation for Production Safety
interface ReactValidationState {
  isReactLoaded: boolean;
  reactVersion: string | null;
  contextErrors: string[];
  retryCount: number;
}

interface ReactValidatorContextType {
  state: ReactValidationState;
  validateReactContext: () => boolean;
  reportError: (error: string) => void;
  clearErrors: () => void;
}

const ReactValidatorContext = createContext<ReactValidatorContextType | null>(null);

export const useReactValidator = () => {
  const context = useContext(ReactValidatorContext);
  if (!context) {
    throw new Error('useReactValidator must be used within ReactValidatorProvider');
  }
  return context;
};

interface ReactValidatorProviderProps {
  children: ReactNode;
  maxRetries?: number;
}

export const ReactValidatorProvider: React.FC<ReactValidatorProviderProps> = ({ 
  children, 
  maxRetries = 3 
}) => {
  const [state, setState] = useState<ReactValidationState>({
    isReactLoaded: false,
    reactVersion: null,
    contextErrors: [],
    retryCount: 0
  });

  const validateReactContext = (): boolean => {
    try {
      console.group('🔍 [CONTEXT VALIDATOR] Detailed React Validation');
      console.log('🔍 [CONTEXT VALIDATOR] Timestamp:', new Date().toISOString());
      console.log('🔍 [CONTEXT VALIDATOR] React object:', React);
      console.log('🔍 [CONTEXT VALIDATOR] typeof React:', typeof React);
      
      // Core React validation
      if (!React || typeof React !== 'object') {
        console.error('🚨 [CONTEXT VALIDATOR] React object validation failed');
        console.error('🚨 [CONTEXT VALIDATOR] React value:', React);
        console.error('🚨 [CONTEXT VALIDATOR] React type:', typeof React);
        throw new Error('React object not available');
      }
      console.log('✅ [CONTEXT VALIDATOR] React object validation passed');

      if (!React.version) {
        console.error('🚨 [CONTEXT VALIDATOR] React version missing');
        console.error('🚨 [CONTEXT VALIDATOR] React keys:', Object.keys(React));
        throw new Error('React version not available');
      }
      console.log('✅ [CONTEXT VALIDATOR] React version validation passed:', React.version);

      // Context API validation
      console.log('🔍 [CONTEXT VALIDATOR] Checking createContext...');
      console.log('🔍 [CONTEXT VALIDATOR] React.createContext:', React.createContext);
      console.log('🔍 [CONTEXT VALIDATOR] typeof React.createContext:', typeof React.createContext);
      
      if (!React.createContext || typeof React.createContext !== 'function') {
        console.error('🚨 [CONTEXT VALIDATOR] createContext validation failed');
        console.error('🚨 [CONTEXT VALIDATOR] createContext value:', React.createContext);
        console.error('🚨 [CONTEXT VALIDATOR] createContext type:', typeof React.createContext);
        console.error('🚨 [CONTEXT VALIDATOR] Available React methods:', Object.keys(React).filter(key => typeof React[key] === 'function'));
        throw new Error('React.createContext not available');
      }
      console.log('✅ [CONTEXT VALIDATOR] createContext validation passed');

      if (!React.useContext || typeof React.useContext !== 'function') {
        throw new Error('React.useContext not available');
      }

      // Hook validation
      if (!React.useState || typeof React.useState !== 'function') {
        throw new Error('React.useState not available');
      }

      if (!React.useEffect || typeof React.useEffect !== 'function') {
        throw new Error('React.useEffect not available');
      }

      // JSX runtime validation
      if (!React.createElement || typeof React.createElement !== 'function') {
        throw new Error('React.createElement not available');
      }

      setState(prev => ({
        ...prev,
        isReactLoaded: true,
        reactVersion: React.version,
        contextErrors: []
      }));

      // Final success validation
      console.log('✅ [CONTEXT VALIDATOR] All React validation checks passed');
      console.groupEnd();
      
      setState(prev => ({
        ...prev,
        isReactLoaded: true,
        reactVersion: React.version,
        contextErrors: []
      }));

      console.log(`✅ [CONTEXT VALIDATOR] React ${React.version} context validated successfully`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown React validation error';
      
      console.error('🚨 [CONTEXT VALIDATOR] Validation failed with error:', errorMessage);
      console.error('🚨 [CONTEXT VALIDATOR] Error stack:', error.stack);
      console.groupEnd();
      
      setState(prev => ({
        ...prev,
        isReactLoaded: false,
        contextErrors: [...prev.contextErrors, errorMessage],
        retryCount: prev.retryCount + 1
      }));

      console.error('🚨 [CONTEXT VALIDATOR] React context validation failed:', errorMessage);
      return false;
    }
  };

  const reportError = (error: string) => {
    setState(prev => ({
      ...prev,
      contextErrors: [...prev.contextErrors, error]
    }));
  };

  const clearErrors = () => {
    setState(prev => ({
      ...prev,
      contextErrors: []
    }));
  };

  useEffect(() => {
    const isValid = validateReactContext();
    
    if (!isValid && state.retryCount < maxRetries) {
      console.log(`[React Validator] Retrying validation (${state.retryCount + 1}/${maxRetries})...`);
      
      const timeout = setTimeout(() => {
        validateReactContext();
      }, 1000 * Math.pow(2, state.retryCount)); // Exponential backoff

      return () => clearTimeout(timeout);
    }
  }, [state.retryCount, maxRetries]);

  const contextValue: ReactValidatorContextType = {
    state,
    validateReactContext,
    reportError,
    clearErrors
  };

  // Render fallback if React context is not valid and max retries exceeded
  if (!state.isReactLoaded && state.retryCount >= maxRetries) {
    return (
      <div className="react-context-error">
        <h1>React Context Error</h1>
        <p>Unable to validate React context after {maxRetries} attempts.</p>
        <details>
          <summary>Error Details</summary>
          <ul>
            {state.contextErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </details>
        <button onClick={() => window.location.reload()}>
          Reload Application
        </button>
      </div>
    );
  }

  return (
    <ReactValidatorContext.Provider value={contextValue}>
      {children}
    </ReactValidatorContext.Provider>
  );
};

// Higher-order component for React context validation
export const withReactValidation = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <ReactValidatorProvider>
      <Component {...props} />
    </ReactValidatorProvider>
  );
};

export default ReactValidatorProvider;