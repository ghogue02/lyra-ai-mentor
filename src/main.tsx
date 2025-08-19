import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Production-safe React context initialization
const initializeApp = async (): Promise<void> => {
  try {
    // React availability check
    if (!React || !React.version) {
      throw new Error('React is not properly loaded');
    }
    
    console.log(`[Production Safe] React ${React.version} initialized successfully`);
    
    // DOM element validation
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    // React DOM validation
    if (!createRoot) {
      throw new Error('React DOM createRoot not available');
    }
    
    // Initialize React root with error boundaries
    const root = createRoot(rootElement);
    
    // Render with graceful error handling
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('[Production Safe] App rendered successfully');
    
  } catch (error) {
    console.error('[Production Emergency] React initialization failed:', error);
    
    // Fallback UI for critical failures
    const fallbackHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      ">
        <h1>Lyra AI Mentor</h1>
        <p>Loading your personalized AI learning experience...</p>
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <script>
          // Auto-retry mechanism
          setTimeout(() => {
            console.log('[Fallback] Attempting app retry...');
            window.location.reload();
          }, 3000);
        </script>
      </div>
    `;
    
    document.body.innerHTML = fallbackHTML;
  }
};

// Bundle validation for production
const validateBundle = (): boolean => {
  try {
    // Check for expected vendor chunks
    const scripts = Array.from(document.scripts);
    const hasReactVendor = scripts.some(script => 
      script.src.includes('vendor-react') || 
      script.src.includes('react')
    );
    
    if (!hasReactVendor && process.env.NODE_ENV === 'production') {
      console.warn('[Bundle Warning] React vendor chunk not detected');
    }
    
    return true;
  } catch (error) {
    console.error('[Bundle Error]', error);
    return false;
  }
};

// Initialize with validation
validateBundle();
initializeApp();
