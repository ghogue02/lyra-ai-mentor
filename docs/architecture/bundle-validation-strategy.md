# Bundle Validation Strategy

## Overview

Comprehensive strategy for validating Vite bundle integrity and preventing React API availability issues in production.

---

## Bundle Content Validation

### Build-time Validation

```typescript
// scripts/bundle-validator.ts
import { readFileSync } from 'fs';
import { glob } from 'glob';

interface BundleValidationResult {
  bundle: string;
  valid: boolean;
  issues: string[];
  exports: string[];
}

class BundleValidator {
  private requiredReactExports = [
    'createContext',
    'useState', 
    'useEffect',
    'useContext',
    'createElement',
    'Fragment'
  ];

  async validateReactBundle(): Promise<BundleValidationResult> {
    const reactBundles = glob.sync('dist/assets/vendor-react-*.js');
    
    if (reactBundles.length === 0) {
      return {
        bundle: 'vendor-react',
        valid: false,
        issues: ['React vendor bundle not found'],
        exports: []
      };
    }

    const bundlePath = reactBundles[0];
    const content = readFileSync(bundlePath, 'utf-8');
    
    const issues: string[] = [];
    const foundExports: string[] = [];

    // Validate React exports
    for (const exportName of this.requiredReactExports) {
      const patterns = [
        `m.${exportName}=`,           // Direct export
        `${exportName}:function`,     // Object method
        `"${exportName}":`            // String key
      ];

      const found = patterns.some(pattern => content.includes(pattern));
      
      if (found) {
        foundExports.push(exportName);
      } else {
        issues.push(`Missing React export: ${exportName}`);
      }
    }

    // Check for React version
    const versionMatch = content.match(/m\.version="([^"]+)"/);
    if (!versionMatch) {
      issues.push('React version not found');
    } else {
      console.log(`React version: ${versionMatch[1]}`);
    }

    return {
      bundle: bundlePath,
      valid: issues.length === 0,
      issues,
      exports: foundExports
    };
  }

  async validateAllBundles(): Promise<BundleValidationResult[]> {
    const results: BundleValidationResult[] = [];
    
    // Validate React bundle
    results.push(await this.validateReactBundle());
    
    // Validate other critical bundles
    const bundles = {
      'vendor-ui': ['forwardRef', 'memo'],
      'vendor-animation': ['motion'],
      'vendor-query': ['useQuery']
    };

    for (const [bundleType, requiredExports] of Object.entries(bundles)) {
      const bundlePaths = glob.sync(`dist/assets/${bundleType}-*.js`);
      
      if (bundlePaths.length > 0) {
        const content = readFileSync(bundlePaths[0], 'utf-8');
        const issues: string[] = [];
        const foundExports: string[] = [];

        for (const exportName of requiredExports) {
          if (content.includes(exportName)) {
            foundExports.push(exportName);
          } else {
            issues.push(`Missing ${bundleType} export: ${exportName}`);
          }
        }

        results.push({
          bundle: bundlePaths[0],
          valid: issues.length === 0,
          issues,
          exports: foundExports
        });
      }
    }

    return results;
  }
}

// Usage in build process
export default async function validateBundles() {
  const validator = new BundleValidator();
  const results = await validator.validateAllBundles();
  
  const failures = results.filter(r => !r.valid);
  
  if (failures.length > 0) {
    console.error('❌ Bundle validation failed:');
    failures.forEach(failure => {
      console.error(`  Bundle: ${failure.bundle}`);
      failure.issues.forEach(issue => console.error(`    - ${issue}`));
    });
    process.exit(1);
  }
  
  console.log('✅ All bundles validated successfully');
  results.forEach(result => {
    console.log(`  ${result.bundle}: ${result.exports.length} exports found`);
  });
}
```

### Runtime Validation

```typescript
// src/utils/bundle-health-check.ts
export interface BundleHealthResult {
  healthy: boolean;
  issues: string[];
  reactVersion?: string;
}

export class BundleHealthChecker {
  private criticalReactAPIs = [
    'createContext',
    'useState',
    'useEffect', 
    'createElement',
    'Fragment'
  ] as const;

  checkReactHealth(): BundleHealthResult {
    const issues: string[] = [];

    // Check if React is available
    if (typeof React === 'undefined') {
      return {
        healthy: false,
        issues: ['React is not available globally']
      };
    }

    // Check critical React APIs
    for (const api of this.criticalReactAPIs) {
      if (typeof React[api] === 'undefined') {
        issues.push(`React.${api} is undefined`);
      }
    }

    // Check React version
    const version = React.version;
    if (!version) {
      issues.push('React version not available');
    }

    return {
      healthy: issues.length === 0,
      issues,
      reactVersion: version
    };
  }

  performHealthCheck(): BundleHealthResult {
    try {
      return this.checkReactHealth();
    } catch (error) {
      return {
        healthy: false,
        issues: [`Health check failed: ${error.message}`]
      };
    }
  }

  // Automatic health check on app start
  static initializeHealthCheck(): void {
    const checker = new BundleHealthChecker();
    const result = checker.performHealthCheck();
    
    if (!result.healthy) {
      console.error('🚨 Bundle health check failed:', result.issues);
      
      // Report to monitoring service
      if (window.gtag) {
        window.gtag('event', 'bundle_health_failure', {
          custom_parameter_1: result.issues.join(', ')
        });
      }
      
      // Show user-friendly error
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; background: #ff4444; color: white; padding: 16px; z-index: 10000;">
          ⚠️ Application loading issue detected. Please refresh the page.
        </div>
      `;
      document.body.prepend(errorDiv);
    } else {
      console.log(`✅ Bundle health check passed (React ${result.reactVersion})`);
    }
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    BundleHealthChecker.initializeHealthCheck();
  });
}
```

---

## Vite Configuration Enhancements

### Enhanced Bundle Validation

```typescript
// vite.config.ts - Enhanced configuration
import { defineConfig } from 'vite';
import validateBundles from './scripts/bundle-validator';

export default defineConfig(({ mode }) => ({
  // ... existing config
  
  build: {
    rollupOptions: {
      output: {
        // Consistent naming for better debugging
        entryFileNames: (chunkInfo) => {
          const timestamp = Date.now().toString(36);
          return `assets/[name]-${timestamp}-[hash].js`;
        },
        chunkFileNames: (chunkInfo) => {
          const timestamp = Date.now().toString(36);
          return `assets/[name]-${timestamp}-[hash].js`;
        },
        
        manualChunks: (id) => {
          // Enhanced React bundling with validation
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              // Debug logging for React modules
              if (mode === 'development') {
                console.log('🔍 [VITE] React module:', id);
              }
              return 'vendor-react';
            }
            
            // ... other chunk logic
          }
        }
      }
    },
    
    // Add post-build validation
    target: 'esnext',
    minify: mode === 'production' ? 'terser' : false
  },
  
  plugins: [
    // ... existing plugins
    
    // Custom plugin for bundle validation
    {
      name: 'bundle-validator',
      writeBundle: async () => {
        if (mode === 'production') {
          await validateBundles();
        }
      }
    }
  ]
}));
```

### Bundle Monitoring Plugin

```typescript
// plugins/bundle-monitor.ts
import type { Plugin } from 'vite';

export function bundleMonitorPlugin(): Plugin {
  return {
    name: 'bundle-monitor',
    
    generateBundle(options, bundle) {
      // Analyze bundle composition
      const reactChunks = Object.keys(bundle).filter(name => name.includes('vendor-react'));
      
      if (reactChunks.length === 0) {
        this.warn('No React vendor chunk found');
      }
      
      if (reactChunks.length > 1) {
        this.warn(`Multiple React chunks detected: ${reactChunks.join(', ')}`);
      }
      
      // Check chunk sizes
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && chunk.code) {
          const sizeKB = Math.round(chunk.code.length / 1024);
          
          if (sizeKB > 1000) {
            console.warn(`⚠️ Large chunk detected: ${fileName} (${sizeKB}KB)`);
          }
          
          // Validate React APIs in React chunk
          if (fileName.includes('vendor-react')) {
            const requiredAPIs = ['createContext', 'useState', 'useEffect'];
            const missingAPIs = requiredAPIs.filter(api => !chunk.code.includes(api));
            
            if (missingAPIs.length > 0) {
              this.error(`Missing React APIs in ${fileName}: ${missingAPIs.join(', ')}`);
            } else {
              console.log(`✅ React chunk validated: ${fileName} (${sizeKB}KB)`);
            }
          }
        }
      }
    }
  };
}
```

---

## Monitoring Integration

### Error Boundary for Bundle Issues

```tsx
// src/components/BundleErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class BundleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if error is bundle-related
    const isBundleError = error.message.includes('createContext') ||
                         error.message.includes('undefined') ||
                         error.stack?.includes('vendor-');
    
    if (isBundleError) {
      // Log to monitoring service
      console.error('Bundle-related error detected:', error);
      
      return { hasError: true, error };
    }
    
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Report bundle errors
    if (window.gtag) {
      window.gtag('event', 'bundle_error', {
        custom_parameter_1: error.message,
        custom_parameter_2: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Application Loading Error
            </h1>
            <p className="text-red-700 mb-4">
              There was an issue loading critical application code.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Bundle Analytics

```typescript
// src/utils/bundle-analytics.ts
export class BundleAnalytics {
  static trackBundleLoad(bundleName: string, loadTime: number) {
    if (window.gtag) {
      window.gtag('event', 'bundle_load', {
        bundle_name: bundleName,
        load_time: loadTime,
        custom_parameter_1: navigator.userAgent
      });
    }
  }

  static trackBundleError(bundleName: string, error: string) {
    if (window.gtag) {
      window.gtag('event', 'bundle_error', {
        bundle_name: bundleName,
        error_message: error
      });
    }
  }

  static initializeBundleTracking() {
    // Track when React becomes available
    const startTime = performance.now();
    
    const checkReact = () => {
      if (typeof React !== 'undefined' && React.createContext) {
        const loadTime = performance.now() - startTime;
        this.trackBundleLoad('vendor-react', loadTime);
        console.log(`React bundle loaded in ${loadTime.toFixed(2)}ms`);
      } else {
        // Retry or report error
        setTimeout(checkReact, 100);
      }
    };
    
    checkReact();
  }
}
```

---

## Implementation Checklist

### Phase 1: Immediate Validation
- [ ] Add bundle validator script
- [ ] Implement runtime health checks
- [ ] Add bundle error boundary
- [ ] Test with current bundles

### Phase 2: Enhanced Monitoring
- [ ] Add bundle monitoring plugin
- [ ] Integrate analytics tracking
- [ ] Set up alerts for bundle failures
- [ ] Create bundle health dashboard

### Phase 3: Automated Prevention
- [ ] Add pre-commit bundle validation
- [ ] Implement automated rollback on failures
- [ ] Create bundle diff analysis
- [ ] Set up performance regression detection

---

## Conclusion

This comprehensive bundle validation strategy ensures:

1. **Build-time validation** prevents broken bundles from being deployed
2. **Runtime monitoring** detects issues in production
3. **User experience protection** through error boundaries
4. **Analytics integration** for proactive issue detection
5. **Automated recovery** mechanisms for bundle failures

The combination of these strategies provides multiple layers of protection against React API availability issues and bundle integrity problems.