// 🔧 Emergency React monitoring (silent mode)

// Global React debugging
(window as any).__REACT_DEBUG__ = {
  originalCreateContext: null,
  createContextCalls: 0,
  errors: []
};

// Silent monitoring for React becoming available
const checkReactInterval = setInterval(() => {
  if ((window as any).React && (window as any).React.createContext) {
    const React = (window as any).React;
    
    // Wrap createContext for error monitoring only
    if (!((window as any).__REACT_DEBUG__.originalCreateContext)) {
      (window as any).__REACT_DEBUG__.originalCreateContext = React.createContext;
      React.createContext = function(...args: any[]) {
        (window as any).__REACT_DEBUG__.createContextCalls++;
        try {
          return (window as any).__REACT_DEBUG__.originalCreateContext.apply(this, args);
        } catch (error) {
          console.error('🚨 React createContext error:', error);
          (window as any).__REACT_DEBUG__.errors.push(error);
          throw error;
        }
      };
    }
    clearInterval(checkReactInterval);
  }
}, 50);

// Cleanup timeout
setTimeout(() => clearInterval(checkReactInterval), 10000);

// Log errors only
(window as any).addEventListener('error', (event: any) => {
  if (event.message.includes('createContext')) {
    console.error('🚨 React createContext error:', event.message);
    (window as any).__REACT_DEBUG__.errors.push(event.error);
  }
});