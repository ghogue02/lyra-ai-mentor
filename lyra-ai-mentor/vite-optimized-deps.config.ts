// Optimized Vite Dependency Configuration
// This configuration fixes 504 errors for React jsx-dev-runtime and react-dom/client

export const optimizeDepsConfig = {
  // Force inclusion of all React-related modules
  include: [
    // Core React packages
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-dom/client',
    'react-dom/server',
    
    // React Router
    'react-router-dom',
    'react-router',
    
    // All Radix UI components (comprehensive list)
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-label',
    '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-tooltip',
    
    // Radix UI internal dependencies
    '@radix-ui/react-compose-refs',
    '@radix-ui/react-context',
    '@radix-ui/react-primitive',
    '@radix-ui/react-use-callback-ref',
    '@radix-ui/react-use-controllable-state',
    '@radix-ui/react-use-layout-effect',
    '@radix-ui/react-use-previous',
    '@radix-ui/react-use-size',
    '@radix-ui/react-id',
    '@radix-ui/react-presence',
    '@radix-ui/react-portal',
    '@radix-ui/react-focus-scope',
    '@radix-ui/react-focus-guards',
    '@radix-ui/react-dismissable-layer',
    '@radix-ui/react-use-escape-keydown',
    '@radix-ui/react-visually-hidden',
    '@radix-ui/react-roving-focus',
    '@radix-ui/react-collection',
    '@radix-ui/react-direction',
    '@radix-ui/react-arrow',
    '@radix-ui/react-popper',
    '@radix-ui/react-use-rect',
    '@radix-ui/react-menu',
    
    // UI Libraries
    '@tanstack/react-query',
    'framer-motion',
    'lucide-react',
    'cmdk',
    'next-themes',
    'sonner',
    'vaul',
    'embla-carousel-react',
    'input-otp',
    'react-day-picker',
    'react-hook-form',
    'react-resizable-panels',
    'recharts',
    'recharts-scale',
    'react-smooth',
    
    // Utilities and data processing
    'date-fns',
    'date-fns/locale',
    'clsx',
    'class-variance-authority',
    'tailwind-merge',
    'zod',
    
    // PDF and document generation
    'jspdf',
    'jspdf-autotable',
    'docx',
    'file-saver',
    
    // Other critical dependencies
    'openai',
    '@supabase/supabase-js',
    '@supabase/functions-js',
    '@supabase/postgrest-js',
    '@supabase/realtime-js',
    '@supabase/storage-js',
    '@faker-js/faker',
    'canvas-confetti',
    
    // React ecosystem utilities
    'react-remove-scroll',
    'react-remove-scroll-bar',
    'react-style-singleton',
    'use-callback-ref',
    'use-sidecar',
    'react-transition-group',
    
    // Floating UI
    '@floating-ui/react-dom',
    '@floating-ui/dom',
    '@floating-ui/core',
    
    // Form utilities
    '@hookform/resolvers',
    '@hookform/resolvers/zod'
  ],
  
  // Exclude nothing - let Vite handle all dependencies
  exclude: [],
  
  // Force pre-bundling of dependencies even if they're already cached
  force: true,
  
  // Additional esbuild options for better compatibility
  esbuildOptions: {
    target: 'es2020',
    // Ensure JSX is properly transformed
    jsx: 'automatic',
    // Keep names for better debugging
    keepNames: true,
    // Handle CommonJS modules properly
    format: 'esm',
    // Platform-specific handling
    platform: 'browser',
    // Define process.env for compatibility
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  },
  
  // Entries to scan for dependencies (in addition to index.html)
  entries: [
    'src/main.tsx',
    'src/App.tsx',
    // Include entry points that might import React differently
    'src/**/*.tsx',
    'src/**/*.jsx'
  ],
  
  // Extensions to consider when scanning
  extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  
  // Hold off serving requests until initial pre-bundling is done
  holdUntilCrawlEnd: true,
  
  // Disable dependency optimization caching in development for consistency
  // This ensures fresh pre-bundling on each dev server start
  disabled: false,
  
  // Additional options for specific problematic packages
  needsInterop: [
    // Add packages that need CommonJS interop here if needed
  ]
};

// Cache busting configuration for development
export const devCacheConfig = {
  // Custom cache directory name with timestamp to force fresh cache
  cacheDir: '.vite-cache',
  
  // Clear cache on server start
  clearCache: true,
  
  // Force dependency discovery
  forceDependencyDiscovery: true
};

// Performance optimization settings
export const performanceConfig = {
  // Number of threads for esbuild
  esbuildThreads: true,
  
  // Increase the limit for inline assets to reduce requests
  assetsInlineLimit: 4096,
  
  // Preload strategy
  modulePreload: {
    polyfill: true,
    // Preload critical React modules
    resolveDependencies: (filename, deps, { hostId, importer }) => {
      // Always preload React core modules
      if (deps.some(dep => dep.includes('react'))) {
        return deps;
      }
      // Otherwise use default behavior
      return deps;
    }
  }
};