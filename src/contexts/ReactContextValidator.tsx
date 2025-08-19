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
      // Core React validation
      if (!React || typeof React !== 'object') {
        throw new Error('React object not available');
      }

      if (!React.version) {
        throw new Error('React version not available');
      }

      // Context API validation
      if (!React.createContext || typeof React.createContext !== 'function') {
        throw new Error('React.createContext not available');
      }

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

      console.log(`[React Validator] ✅ React ${React.version} context validated successfully`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown React validation error';
      
      setState(prev => ({
        ...prev,
        isReactLoaded: false,
        contextErrors: [...prev.contextErrors, errorMessage],
        retryCount: prev.retryCount + 1
      }));

      console.error('[React Validator] ❌ React context validation failed:', errorMessage);
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