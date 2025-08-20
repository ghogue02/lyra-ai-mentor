// 🔧 React setup with minimal logging
import './react-global-setup';
import './emergency-debug';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clean React initialization
const initializeApp = async (): Promise<void> => {
  try {
    // Verify React is available
    if (!React || !React.createContext) {
      throw new Error('React.createContext not available');
    }
    
    // Get DOM element
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    // Initialize React
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.log(`✅ App initialized with React ${React.version}`);
    }
    
  } catch (error) {
    console.error('🚨 React initialization failed:', error.message);
    
    // Fallback UI
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: system-ui;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      ">
        <div>
          <h1>🔄 Loading...</h1>
          <p>Initializing React...</p>
          <button onclick="window.location.reload()" style="
            margin-top: 20px;
            padding: 10px 20px;
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            border-radius: 5px;
            cursor: pointer;
          ">Retry</button>
        </div>
      </div>
    `;
  }
};

// Start app
initializeApp();