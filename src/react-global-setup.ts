// 🔧 React Global Setup - Ensures React is available globally
// This MUST run before any other code that uses React

import React from 'react';
import ReactDOM from 'react-dom/client';

// Force React to be available globally (silent)
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

// Verify React is properly exposed
if (!(window as any).React) {
  throw new Error('CRITICAL: Failed to expose React globally');
}

if (!(window as any).React.createContext) {
  throw new Error('CRITICAL: React.createContext not available after global setup');
}

// Only log success in development
if (import.meta.env.DEV) {
  console.log('✅ React global setup complete');
}