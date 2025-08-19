// 🚨 IMMEDIATE DEBUG: Log before ANY other code runs
console.log('🚨 [IMMEDIATE] main.tsx entry point - timestamp:', new Date().toISOString());
console.log('🚨 [IMMEDIATE] typeof React before import:', typeof React);
console.log('🚨 [IMMEDIATE] window.React before import:', window.React);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🚨 POST-IMPORT DEBUG: Check React after import
console.log('🚨 [POST-IMPORT] typeof React after import:', typeof React);
console.log('🚨 [POST-IMPORT] React object after import:', React);
console.log('🚨 [POST-IMPORT] React.createContext after import:', React?.createContext);
if (React) {
  console.log('🚨 [POST-IMPORT] React keys:', Object.keys(React));
} else {
  console.error('🚨 [POST-IMPORT] React is undefined after import!');
}

// 🔍 COMPREHENSIVE REACT DEBUG LOGGING
const logReactDebugInfo = () => {
  console.group('🔍 [REACT DEBUG] Initialization Analysis');
  
  // Global React object inspection
  console.log('🔍 [REACT DEBUG] window.React:', window.React);
  console.log('🔍 [REACT DEBUG] imported React:', React);
  console.log('🔍 [REACT DEBUG] React === window.React:', React === window.React);
  
  // React object properties
  if (React) {
    console.log('🔍 [REACT DEBUG] React.version:', React.version);
    console.log('🔍 [REACT DEBUG] React.createContext:', React.createContext);
    console.log('🔍 [REACT DEBUG] React.createElement:', React.createElement);
    console.log('🔍 [REACT DEBUG] React.useState:', React.useState);
    console.log('🔍 [REACT DEBUG] React.useEffect:', React.useEffect);
    console.log('🔍 [REACT DEBUG] React keys:', Object.keys(React));
  } else {
    console.error('🚨 [REACT DEBUG] React object is undefined!');
  }
  
  // ReactDOM inspection
  console.log('🔍 [REACT DEBUG] createRoot:', createRoot);
  console.log('🔍 [REACT DEBUG] createRoot type:', typeof createRoot);
  
  // Bundle analysis
  console.log('🔍 [REACT DEBUG] All script tags:', document.scripts.length);
  Array.from(document.scripts).forEach((script, index) => {
    if (script.src.includes('react') || script.src.includes('vendor')) {
      console.log(`🔍 [REACT DEBUG] Script ${index}:`, script.src);
    }
  });
  
  // Module system check
  console.log('🔍 [REACT DEBUG] typeof module:', typeof module);
  console.log('🔍 [REACT DEBUG] typeof exports:', typeof exports);
  console.log('🔍 [REACT DEBUG] typeof require:', typeof require);
  console.log('🔍 [REACT DEBUG] import meta available:', typeof import.meta);
  
  console.groupEnd();
};

// Production-safe React context initialization
const initializeApp = async (): Promise<void> => {
  try {
    // 🔍 LOG INITIAL STATE
    console.log('🔍 [REACT DEBUG] Starting app initialization...');
    logReactDebugInfo();
    
    // React availability check with detailed debugging
    if (!React) {
      console.error('🚨 [REACT DEBUG] React import is undefined!');
      console.error('🚨 [REACT DEBUG] typeof React:', typeof React);
      console.error('🚨 [REACT DEBUG] React prototype:', React?.prototype);
      throw new Error('React is not imported correctly');
    }
    
    if (!React.version) {
      console.error('🚨 [REACT DEBUG] React.version is missing!');
      console.error('🚨 [REACT DEBUG] React object:', React);
      throw new Error('React version is not available - incomplete React load');
    }
    
    if (!React.createContext) {
      console.error('🚨 [REACT DEBUG] React.createContext is missing!');
      console.error('🚨 [REACT DEBUG] Available React methods:', Object.keys(React));
      throw new Error('React.createContext is not available - this is the root cause!');
    }
    
    console.log(`✅ [REACT DEBUG] React ${React.version} validation successful`);
    console.log(`✅ [REACT DEBUG] React.createContext available:`, typeof React.createContext);
    
    // DOM element validation
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('🚨 [REACT DEBUG] Root DOM element not found!');
      throw new Error('Root element not found');
    }
    console.log('✅ [REACT DEBUG] Root DOM element found:', rootElement);
    
    // React DOM validation
    if (!createRoot) {
      console.error('🚨 [REACT DEBUG] createRoot is not available!');
      console.error('🚨 [REACT DEBUG] createRoot type:', typeof createRoot);
      throw new Error('React DOM createRoot not available');
    }
    console.log('✅ [REACT DEBUG] createRoot available:', typeof createRoot);
    
    // Initialize React root with error boundaries
    console.log('🔍 [REACT DEBUG] Creating React root...');
    const root = createRoot(rootElement);
    console.log('✅ [REACT DEBUG] React root created successfully:', root);
    
    // Test React.createContext before rendering
    console.log('🔍 [REACT DEBUG] Testing React.createContext...');
    try {
      const testContext = React.createContext('test');
      console.log('✅ [REACT DEBUG] React.createContext test successful:', testContext);
    } catch (contextError) {
      console.error('🚨 [REACT DEBUG] React.createContext test failed:', contextError);
      throw new Error(`React.createContext test failed: ${contextError.message}`);
    }
    
    // Render with graceful error handling
    console.log('🔍 [REACT DEBUG] Rendering app...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ [REACT DEBUG] App rendered successfully');
    
  } catch (error) {
    console.group('🚨 [REACT DEBUG] CRITICAL ERROR ANALYSIS');
    console.error('🚨 [REACT DEBUG] React initialization failed:', error);
    console.error('🚨 [REACT DEBUG] Error stack:', error.stack);
    console.error('🚨 [REACT DEBUG] Error name:', error.name);
    console.error('🚨 [REACT DEBUG] Error message:', error.message);
    
    // Re-log React state at failure point
    console.log('🔍 [REACT DEBUG] React state at failure:');
    logReactDebugInfo();
    
    // Additional bundle analysis
    console.log('🔍 [REACT DEBUG] Checking if React loaded after error:');
    setTimeout(() => {
      console.log('🔍 [REACT DEBUG] Delayed React check:', !!React, React?.version);
      if (React && React.createContext) {
        console.warn('⚠️ [REACT DEBUG] React became available after initial failure! Timing issue detected.');
      }
    }, 100);
    
    console.groupEnd();
    
    // Enhanced fallback UI with debug info
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
        <h1>🔍 React Debug Mode</h1>
        <p>Analyzing React initialization failure...</p>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; text-align: left; max-width: 600px;">
          <strong>Error Details:</strong><br>
          ${error.message}<br><br>
          <strong>React Available:</strong> ${!!React}<br>
          <strong>React Version:</strong> ${React?.version || 'undefined'}<br>
          <strong>createContext:</strong> ${!!React?.createContext}<br>
          <strong>Error Time:</strong> ${new Date().toISOString()}<br>
        </div>
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
        <button onclick="window.location.reload()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        ">🔄 Retry Now</button>
        <script>
          // Auto-retry with debug logging
          setTimeout(() => {
            console.log('🔄 [REACT DEBUG] Auto-retry in 5 seconds...');
            console.log('🔍 [REACT DEBUG] Final React state:', window.React, window.React?.createContext);
            window.location.reload();
          }, 5000);
        </script>
      </div>
    `;
    
    document.body.innerHTML = fallbackHTML;
  }
};

// Enhanced bundle validation with detailed analysis
const validateBundle = (): boolean => {
  try {
    console.group('🔍 [BUNDLE DEBUG] Analyzing Bundle State');
    
    // Check for expected vendor chunks
    const scripts = Array.from(document.scripts);
    console.log('🔍 [BUNDLE DEBUG] Total scripts:', scripts.length);
    
    const reactScripts = scripts.filter(script => 
      script.src.includes('vendor') || 
      script.src.includes('react') || 
      script.src.includes('meinkl') // Check for the failing bundle
    );
    
    console.log('🔍 [BUNDLE DEBUG] React-related scripts:', reactScripts.length);
    reactScripts.forEach((script, index) => {
      console.log(`🔍 [BUNDLE DEBUG] Script ${index}:`, {
        src: script.src,
        loaded: script.readyState || 'unknown',
        async: script.async,
        defer: script.defer
      });
    });
    
    // Check the failing bundle specifically
    const failingBundle = scripts.find(script => script.src.includes('vendor-meinkl'));
    if (failingBundle) {
      console.warn('⚠️ [BUNDLE DEBUG] Found potentially problematic bundle:', failingBundle.src);
      console.log('🔍 [BUNDLE DEBUG] Bundle state:', {
        readyState: failingBundle.readyState,
        loaded: failingBundle.onload !== null,
        error: failingBundle.onerror !== null
      });
    }
    
    const hasReactVendor = scripts.some(script => 
      script.src.includes('vendor-react') || 
      script.src.includes('react')
    );
    
    console.log('🔍 [BUNDLE DEBUG] React vendor detected:', hasReactVendor);
    
    if (!hasReactVendor && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ [BUNDLE DEBUG] React vendor chunk not detected in production');
    }
    
    // Check module loading order
    console.log('🔍 [BUNDLE DEBUG] Script loading order analysis:');
    scripts.forEach((script, index) => {
      if (script.src && (script.src.includes('vendor') || script.src.includes('index'))) {
        console.log(`🔍 [BUNDLE DEBUG] Load order ${index}: ${script.src.split('/').pop()}`);
      }
    });
    
    console.groupEnd();
    return true;
  } catch (error) {
    console.error('🚨 [BUNDLE DEBUG] Bundle validation error:', error);
    return false;
  }
};

// 🔍 PRE-INITIALIZATION DEBUGGING
console.log('🔍 [REACT DEBUG] === MAIN.TSX ENTRY POINT ===');
console.log('🔍 [REACT DEBUG] Timestamp:', new Date().toISOString());
console.log('🔍 [REACT DEBUG] Environment:', process.env.NODE_ENV);
console.log('🔍 [REACT DEBUG] User Agent:', navigator.userAgent);

// Wait for DOM to be ready and all scripts loaded
const waitForDOMAndScripts = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      console.log('🔍 [REACT DEBUG] DOM already complete');
      resolve(true);
    } else {
      console.log('🔍 [REACT DEBUG] Waiting for DOM complete...');
      window.addEventListener('load', () => {
        console.log('🔍 [REACT DEBUG] Window load event fired');
        // Give scripts additional time to initialize
        setTimeout(() => {
          console.log('🔍 [REACT DEBUG] Post-load timeout completed');
          resolve(true);
        }, 100);
      });
    }
  });
};

// Enhanced initialization sequence
const startApp = async () => {
  try {
    console.log('🔍 [REACT DEBUG] Starting enhanced initialization sequence...');
    
    // Step 1: Wait for DOM and scripts
    await waitForDOMAndScripts();
    
    // Step 2: Validate bundle
    console.log('🔍 [REACT DEBUG] Step 2: Bundle validation');
    validateBundle();
    
    // Step 3: Wait a bit more for React to be available
    console.log('🔍 [REACT DEBUG] Step 3: Waiting for React availability...');
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      if (React && React.createContext) {
        console.log(`✅ [REACT DEBUG] React available after ${attempts} attempts`);
        break;
      }
      console.log(`🔍 [REACT DEBUG] React not ready, attempt ${attempts + 1}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error(`React not available after ${maxAttempts} attempts. This indicates a bundle loading issue.`);
    }
    
    // Step 4: Initialize app
    console.log('🔍 [REACT DEBUG] Step 4: Initializing app');
    await initializeApp();
    
  } catch (error) {
    console.error('🚨 [REACT DEBUG] Enhanced initialization failed:', error);
    // Fall back to immediate initialization
    console.log('🔄 [REACT DEBUG] Falling back to immediate initialization...');
    initializeApp();
  }
};

// Start the enhanced initialization
startApp();
