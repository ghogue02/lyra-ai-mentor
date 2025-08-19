// 🚨 EMERGENCY DEBUGGING - This file loads FIRST to catch React issues

console.log('🚨 [EMERGENCY] emergency-debug.ts loaded at:', new Date().toISOString());
console.log('🚨 [EMERGENCY] Document readyState:', document.readyState);
console.log('🚨 [EMERGENCY] Scripts loaded:', document.scripts.length);

// Global React debugging
(window as any).__REACT_DEBUG__ = {
  originalCreateContext: null,
  createContextCalls: 0,
  errors: []
};

// Monitor for React becoming available
const checkReactInterval = setInterval(() => {
  const reactAvailable = !!(window as any).React;
  console.log('🚨 [EMERGENCY] React availability check:', reactAvailable);
  
  if (reactAvailable) {
    const React = (window as any).React;
    console.log('🚨 [EMERGENCY] React found! Version:', React.version);
    console.log('🚨 [EMERGENCY] React.createContext:', React.createContext);
    
    // Wrap createContext to catch issues
    if (React.createContext && !(window as any).__REACT_DEBUG__.originalCreateContext) {
      (window as any).__REACT_DEBUG__.originalCreateContext = React.createContext;
      React.createContext = function(...args: any[]) {
        (window as any).__REACT_DEBUG__.createContextCalls++;
        console.log('🚨 [EMERGENCY] createContext called #', (window as any).__REACT_DEBUG__.createContextCalls);
        try {
          return (window as any).__REACT_DEBUG__.originalCreateContext.apply(this, args);
        } catch (error) {
          console.error('🚨 [EMERGENCY] createContext error:', error);
          (window as any).__REACT_DEBUG__.errors.push(error);
          throw error;
        }
      };
    }
    clearInterval(checkReactInterval);
  }
}, 10);

// Clear interval after 10 seconds to avoid infinite checking
setTimeout(() => {
  clearInterval(checkReactInterval);
  console.log('🚨 [EMERGENCY] React check timeout - Final state:', {
    reactAvailable: !!(window as any).React,
    createContextCalls: (window as any).__REACT_DEBUG__.createContextCalls,
    errors: (window as any).__REACT_DEBUG__.errors.length
  });
}, 10000);

// Catch all errors
window.addEventListener('error', (event) => {
  if (event.message.includes('createContext')) {
    console.error('🚨 [EMERGENCY] createContext error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack
    });
  }
});

console.log('🚨 [EMERGENCY] emergency-debug.ts setup complete');