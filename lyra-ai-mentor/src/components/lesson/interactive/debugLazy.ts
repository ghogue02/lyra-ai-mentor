/**
 * Debug utilities for lazy loading issues
 */
import React from 'react';

// Global error interceptor
const originalConsoleError = console.error;
const errorLog: Array<{ timestamp: number; error: any; stack?: string }> = [];

export function initializeDebugger() {
  console.log('[DebugLazy] Initializing error interceptor...');
  
  // Intercept console.error to catch React's internal errors
  console.error = function(...args: any[]) {
    // Log to our debug array
    errorLog.push({
      timestamp: Date.now(),
      error: args,
      stack: new Error().stack
    });
    
    // Check if this is the object-to-primitive error
    if (args.some(arg => String(arg).includes('Cannot convert object to primitive value'))) {
      console.log('[DebugLazy] CAUGHT OBJECT-TO-PRIMITIVE ERROR!');
      console.log('[DebugLazy] Arguments:', args);
      console.log('[DebugLazy] Trying to identify the problematic object...');
      
      // Try to find what React was trying to convert
      args.forEach((arg, index) => {
        console.log(`[DebugLazy] Arg ${index} type:`, typeof arg);
        if (typeof arg === 'object' && arg !== null) {
          console.log(`[DebugLazy] Arg ${index} keys:`, Object.keys(arg));
          console.log(`[DebugLazy] Arg ${index} constructor:`, arg.constructor?.name);
          
          // Check if it's a React element or component
          if (arg.$$typeof) {
            console.log(`[DebugLazy] Arg ${index} is a React element with $$typeof:`, arg.$$typeof);
          }
          
          // Try to identify common problematic patterns
          if (arg._payload) {
            console.log(`[DebugLazy] Arg ${index} has _payload (lazy component):`, arg._payload);
          }
          
          if (arg.type && typeof arg.type === 'object') {
            console.log(`[DebugLazy] Arg ${index} has object type:`, arg.type);
          }
        }
      });
      
      // Log the call stack
      console.log('[DebugLazy] Call stack:', new Error().stack);
    }
    
    // Call original console.error
    originalConsoleError.apply(console, args);
  };
}

export function getErrorLog() {
  return errorLog;
}

export function clearErrorLog() {
  errorLog.length = 0;
}

// Wrap React.lazy to add debugging
const originalReactLazy = React.lazy;

export function debugLazy<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
): React.LazyExoticComponent<T> {
  console.log(`[DebugLazy] Creating lazy component: ${componentName}`);
  
  return originalReactLazy(() => {
    console.log(`[DebugLazy] Loading component: ${componentName}`);
    
    return importFunc()
      .then(module => {
        console.log(`[DebugLazy] Successfully loaded: ${componentName}`);
        return module;
      })
      .catch(error => {
        console.log(`[DebugLazy] Error loading ${componentName}:`, error);
        console.log(`[DebugLazy] Error type:`, typeof error);
        console.log(`[DebugLazy] Error constructor:`, error?.constructor?.name);
        
        // Create a safe error that won't cause object-to-primitive issues
        const safeError = new Error(
          `Failed to load component ${componentName}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        
        console.log(`[DebugLazy] Created safe error:`, safeError.message);
        
        // Return a fallback component
        return {
          default: (() => {
            const FallbackComponent: React.FC = () => {
              console.log(`[DebugLazy] Rendering fallback for ${componentName}`);
              return React.createElement('div', {
                style: { padding: '20px', color: 'red', border: '1px solid red' }
              }, `Error loading ${componentName}`);
            };
            FallbackComponent.displayName = `${componentName}Fallback`;
            return FallbackComponent;
          })() as T
        };
      });
  });
}

// Enhanced error boundary that prevents object-to-primitive errors
export class SafeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): { hasError: boolean; error: Error } {
    console.log('[SafeErrorBoundary] Caught error:', error);
    console.log('[SafeErrorBoundary] Error type:', typeof error);
    
    // Ensure error is a proper Error object
    let safeError: Error;
    if (error instanceof Error) {
      safeError = error;
    } else if (typeof error === 'string') {
      safeError = new Error(error);
    } else {
      // Convert any object to a safe string
      safeError = new Error('Component error (details logged to console)');
      console.log('[SafeErrorBoundary] Original error object:', error);
    }
    
    return { hasError: true, error: safeError };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('[SafeErrorBoundary] Error details:', {
      error,
      errorInfo,
      errorType: typeof error,
      errorConstructor: error?.constructor?.name
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement('div', {
        style: { padding: '20px', color: 'red', border: '1px solid red' }
      },
        React.createElement('h3', {}, 'Component Error'),
        React.createElement('p', {}, this.state.error?.message || 'An error occurred')
      );
    }

    return this.props.children;
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  initializeDebugger();
}