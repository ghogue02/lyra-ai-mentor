import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Emergency error logging
console.log('🚀 Main.tsx starting...');

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('🔥 Global error:', event.error);
  console.error('🔥 Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔥 Unhandled promise rejection:', event.reason);
});

console.log('🔍 Looking for root element...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ Root element found, creating React root...');
const root = createRoot(rootElement);

console.log('📦 Rendering App component...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ App rendered successfully!');