// 🚨 CRITICAL: React Global Setup - Ensures React is available globally
// This MUST run before any other code that uses React

import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('🚨 [REACT-GLOBAL] Setting up React globals...');
console.log('🚨 [REACT-GLOBAL] React object:', React);
console.log('🚨 [REACT-GLOBAL] React.createContext:', React.createContext);

// Force React to be available globally
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

console.log('✅ [REACT-GLOBAL] React globals set successfully');
console.log('✅ [REACT-GLOBAL] window.React:', (window as any).React);
console.log('✅ [REACT-GLOBAL] window.React.createContext:', (window as any).React?.createContext);

// Verify React is properly exposed
if (!(window as any).React) {
  throw new Error('CRITICAL: Failed to expose React globally');
}

if (!(window as any).React.createContext) {
  throw new Error('CRITICAL: React.createContext not available after global setup');
}

console.log('✅ [REACT-GLOBAL] React global setup complete and verified');