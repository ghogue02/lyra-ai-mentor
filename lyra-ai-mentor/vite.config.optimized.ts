import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { UserConfig } from "vite";

// Optimized Vite configuration for production performance
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const config: UserConfig = {
    server: {
      host: "::",
      port: 8080,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      hmr: {
        overlay: true,
        clientPort: 8080,
        timeout: 120000,
      },
      warmup: {
        clientFiles: [
          './src/main.tsx',
          './src/App.tsx',
          './src/components/**/*.tsx',
        ],
      },
      watch: {
        usePolling: false,
        interval: 100,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.vite/**'],
      },
      preTransformRequests: true,
      middlewareMode: false,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __PRODUCTION__: mode === 'production',
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'production' ? 'hidden' : true,
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      target: 'es2020',
      rollupOptions: {
        output: {
          // Optimized manual chunks with better splitting
          manualChunks: (id) => {
            // Core vendor splitting
            if (id.includes('node_modules')) {
              // React ecosystem (essential, keep together)
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-core';
              }
              
              // UI components library (frequently used)
              if (id.includes('@radix-ui')) {
                return 'ui-lib';
              }
              
              // Animation and visuals
              if (id.includes('framer-motion') || id.includes('canvas-confetti')) {
                return 'animation';
              }
              
              // Data visualization
              if (id.includes('recharts') || id.includes('d3')) {
                return 'charts';
              }
              
              // Document generation (lazy loadable)
              if (id.includes('jspdf') || id.includes('docx') || id.includes('file-saver')) {
                return 'documents';
              }
              
              // AI and API services
              if (id.includes('openai') || id.includes('@supabase')) {
                return 'services';
              }
              
              // Icons (can be large)
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              
              // Development/Testing utilities
              if (id.includes('@faker-js') || id.includes('date-fns')) {
                return 'utils';
              }
              
              // Everything else in vendor
              return 'vendor';
            }
            
            // Application code splitting by feature
            if (id.includes('src/')) {
              // Split by character for better caching
              if (id.includes('components/interactive/Maya') || id.includes('components/maya')) {
                return 'feature-maya';
              }
              if (id.includes('components/interactive/Sofia')) {
                return 'feature-sofia';
              }
              if (id.includes('components/interactive/David')) {
                return 'feature-david';
              }
              if (id.includes('components/interactive/Rachel')) {
                return 'feature-rachel';
              }
              if (id.includes('components/interactive/Alex')) {
                return 'feature-alex';
              }
              
              // AI Playground (separate heavy feature)
              if (id.includes('ai-playground') || id.includes('AIPlayground')) {
                return 'ai-playground';
              }
              
              // Testing components (dev only, can be split out)
              if (id.includes('components/testing/')) {
                return 'testing';
              }
              
              // Core components used everywhere
              if (id.includes('components/ui/') || id.includes('components/lesson/')) {
                return 'core-ui';
              }
              
              // Services and utilities
              if (id.includes('services/') || id.includes('utils/')) {
                return 'app-services';
              }
              
              // Routes and pages
              if (id.includes('pages/')) {
                return 'routes';
              }
            }
          },
          
          // Optimize chunk names for better caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `assets/${chunkInfo.name}-${facadeModuleId}-[hash].js`;
          },
          
          // Asset file names with content hash
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/woff2?|ttf|otf|eot/i.test(extType)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          
          // Entry chunk naming
          entryFileNames: 'assets/[name]-[hash].js',
        },
        
        // External dependencies (if using CDN)
        external: mode === 'production' ? [] : [],
        
        // Tree shaking
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      
      // Lower warning limit to encourage smaller chunks
      chunkSizeWarningLimit: 250,
      
      // Enhanced minification for production
      minify: mode === 'production' ? 'terser' : 'esbuild',
      
      // Aggressive terser options
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
          unused: true,
          dead_code: true,
          passes: 3,
          global_defs: {
            "@__PURE__": "/*#__PURE__*/",
          },
          ecma: 2020,
          module: true,
          toplevel: true,
        },
        mangle: {
          safari10: true,
          properties: {
            regex: /^_/,
          },
        },
        format: {
          comments: false,
          ecma: 2020,
        },
        module: true,
        toplevel: true,
      } : undefined,
      
      reportCompressedSize: mode === 'production',
      
      // Module preload optimization
      modulePreload: {
        polyfill: true,
        resolveDependencies: (filename, deps, { hostId, hostType }) => {
          // Only preload critical dependencies
          return deps.filter(dep => {
            return dep.includes('react-core') || 
                   dep.includes('ui-lib') || 
                   dep.includes('core-ui');
          });
        },
      },
    },
    
    // Optimized dependency pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router-dom',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-tabs',
        '@tanstack/react-query',
        'lucide-react',
        'framer-motion',
        'clsx',
        'tailwind-merge',
      ],
      exclude: [
        // Exclude large libraries that should be dynamically imported
        'jspdf',
        'docx',
        'recharts',
        '@faker-js/faker',
      ],
      entries: [
        'src/main.tsx',
        'src/App.tsx',
      ],
      force: true,
      esbuildOptions: {
        target: 'es2020',
        keepNames: true,
      },
      holdUntilCrawlEnd: true,
    },
    
    // Production-ready preview config
    preview: {
      port: 8080,
      host: true,
      headers: {
        'Content-Security-Policy': env.VITE_CSP_ENABLED === 'true' 
          ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com;"
          : '',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    
    // Performance optimizations
    esbuild: {
      legalComments: 'none',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    },
  };
  
  return config;
});