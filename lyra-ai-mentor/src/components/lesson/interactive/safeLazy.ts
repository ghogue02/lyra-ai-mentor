import React from 'react';

/**
 * Safe lazy loading wrapper that prevents object-to-primitive conversion errors
 * This wrapper ensures all error messages are properly stringified before
 * reaching React's internal error handling system
 */
export function safeLazy<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    importFunc().catch((error) => {
      // Ensure error is a proper Error object with string message
      const safeError = new Error(
        `Failed to load component: ${
          typeof error === 'string' 
            ? error 
            : error?.message 
            ? String(error.message) 
            : 'Unknown error'
        }`
      );
      
      // Log the original error for debugging
      console.error('safeLazy: Component import failed', {
        originalError: error,
        safeMessage: safeError.message
      });
      
      // Return a fallback component that renders an error message
      return {
        default: (() => {
          const ErrorComponent: React.FC = () => {
            return React.createElement('div', {
              className: 'p-4 text-red-600 border border-red-200 rounded bg-red-50'
            }, 
              React.createElement('p', { className: 'font-medium' }, 'Component Loading Error'),
              React.createElement('p', { className: 'text-sm mt-1' }, safeError.message)
            );
          };
          ErrorComponent.displayName = 'LazyErrorComponent';
          return ErrorComponent;
        })() as T
      };
    })
  );
}

/**
 * Create a safe version of a component that handles all props safely
 */
export function createSafeComponent<P extends Record<string, any>>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const SafeComponent: React.FC<P> = (props) => {
    // Ensure all props are safe primitives or React elements
    const safeProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (value === null || value === undefined) {
        acc[key] = value;
      } else if (typeof value === 'function') {
        acc[key] = value;
      } else if (React.isValidElement(value)) {
        acc[key] = value;
      } else if (typeof value === 'object') {
        // Convert objects to safe strings for debugging
        try {
          acc[key] = JSON.parse(JSON.stringify(value));
        } catch {
          acc[key] = '[Complex Object]';
        }
      } else {
        acc[key] = String(value);
      }
      return acc;
    }, {} as any);

    return React.createElement(Component, safeProps);
  };

  SafeComponent.displayName = `Safe(${Component.displayName || Component.name || 'Component'})`;
  return SafeComponent as React.ComponentType<P>;
}