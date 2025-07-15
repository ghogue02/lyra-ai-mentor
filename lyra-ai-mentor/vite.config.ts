import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { UserConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  const config: UserConfig = {
    server: {
      host: "::",
      port: 8080,
      // Add security headers in development
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      // Improved HMR configuration to prevent 504 errors
      hmr: {
        overlay: true,
        clientPort: 8080,
        timeout: 120000, // 2 minutes timeout for HMR
      },
      // Increase timeouts to prevent optimization conflicts
      warmup: {
        clientFiles: [
          './src/main.tsx',
          './src/App.tsx',
          './src/components/**/*.tsx',
        ],
      },
      watch: {
        // Use polling for better compatibility
        usePolling: false,
        interval: 100,
        // Ignore temporary files
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.vite/**'],
      },
      // Force pre-transform on cold start
      preTransformRequests: true,
      // Increase timeouts
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
    
    // Environment-specific defines
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __PRODUCTION__: mode === 'production',
    },
    build: {
      // Output directory
      outDir: 'dist',
      
      // Generate source maps for production debugging (external)
      sourcemap: mode === 'production' ? 'hidden' : true,
      
      // Asset handling
      assetsInlineLimit: 4096, // 4kb
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Target modern browsers for smaller bundles
      target: 'es2020',
      
      rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunking with aggressive size limits to stay under 500KB target
          if (id.includes('node_modules')) {
            // Large libraries get their own chunks
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            if (id.includes('date-fns')) {
              return 'date-vendor';
            }
            if (id.includes('jspdf')) {
              return 'pdf-vendor';
            }
            if (id.includes('docx')) {
              return 'docx-vendor';
            }
            if (id.includes('@faker-js')) {
              return 'faker-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('openai')) {
              return 'openai-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('canvas-confetti')) {
              return 'confetti-vendor';
            }
            if (id.includes('file-saver')) {
              return 'files-vendor';
            }
            // Smaller remaining vendors
            return 'utils-vendor';
          }
          
          // Split AI Playground into smaller chunks
          if (id.includes('AIPlaygroundTest') || id.includes('AIPlayground')) {
            return 'ai-playground';
          }
          
          // Component chunking with size optimization
          if (id.includes('src/components/interactive/Maya')) {
            return 'maya-components';
          }
          if (id.includes('src/components/interactive/Sofia')) {
            return 'sofia-components';
          }
          if (id.includes('src/components/interactive/David')) {
            return 'david-components';
          }
          if (id.includes('src/components/interactive/Rachel')) {
            return 'rachel-components';
          }
          if (id.includes('src/components/interactive/Alex')) {
            return 'alex-components';
          }
          // Split testing components by functionality to reduce chunk size
          if (id.includes('src/components/testing/')) {
            // AI-related testing components (AI in filename)
            if (id.includes('AI') || id.includes('Predictor') || id.includes('Generator')) {
              return 'testing-ai-components';
            }
            // Data and analytics testing components  
            if (id.includes('Data') || id.includes('Analytics') || id.includes('Dashboard') || id.includes('Report') || id.includes('KPI')) {
              return 'testing-data-components';
            }
            // Workflow and automation testing components
            if (id.includes('Workflow') || id.includes('Automation') || id.includes('Process') || id.includes('Task')) {
              return 'testing-workflow-components';
            }
            // Content and communication testing components
            if (id.includes('Content') || id.includes('Email') || id.includes('Social') || id.includes('Subject')) {
              return 'testing-content-components';
            }
            // Admin and management testing components
            if (id.includes('Admin') || id.includes('Management') || id.includes('Governance') || id.includes('Team')) {
              return 'testing-admin-components';
            }
            // Remaining testing components
            return 'testing-misc-components';
          }
          if (id.includes('src/components/lesson/interactive/')) {
            return 'lesson-components';
          }
          if (id.includes('src/components/ai-playground/')) {
            return 'playground-components';
          }
          if (id.includes('src/components/playground/')) {
            return 'playground-tools';
          }
          
          // Split pages
          if (id.includes('src/pages/')) {
            return 'pages';
          }
          
          // Split services
          if (id.includes('src/services/')) {
            return 'services';
          }
        }
      }
    },
      chunkSizeWarningLimit: 400,
      
      // Use different minification based on environment
      minify: mode === 'production' ? 'terser' : 'esbuild',
      
      // Terser options for production
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
          unused: true,
          dead_code: true,
          passes: 2, // Multiple compression passes
        },
        mangle: {
          safari10: true, // Work around Safari 10 bugs
        },
        format: {
          comments: false, // Remove all comments
        },
      } : undefined,
      
      // Report compressed size
      reportCompressedSize: mode === 'production',
      
      // Preload directives
      modulePreload: {
        polyfill: true,
      },
    },
    
    // Optimize deps with improved configuration to prevent 504 errors
    // Including React jsx-runtime deps to fix "Outdated Optimize Dep" errors
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
        '@radix-ui/react-accordion',
        '@radix-ui/react-avatar',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-toast',
        '@radix-ui/react-tooltip',
        '@radix-ui/react-select',
        '@tanstack/react-query',
        'date-fns',
        'openai',
        '@supabase/supabase-js',
        'lucide-react',
        'canvas-confetti',
        'framer-motion',
        'recharts',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        // Core services for optimization
        'sonner',
        'class-variance-authority'
      ],
      exclude: [], // Remove exclusion to allow proper ES module handling
      // Increase the number of chunks to pre-bundle in parallel
      entries: [
        'src/main.tsx',
        'src/App.tsx',
        'src/pages/**/*.tsx',
        'src/components/**/*.tsx',
      ],
      // Force dep optimization to prevent outdated dep errors
      force: true,
      // Disable dynamic import analysis to speed up pre-bundling
      esbuildOptions: {
        target: 'es2020',
        // Increase the optimization threshold
        keepNames: true,
        // Add plugins for better ESM handling
        plugins: [],
      },
      // Increase discovery timeout
      holdUntilCrawlEnd: true,
    },
    
    // Preview server configuration
    preview: {
      port: 8080,
      host: true,
      headers: {
        // Production-like security headers
        'Content-Security-Policy': env.VITE_CSP_ENABLED === 'true' 
          ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com;"
          : '',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  };
  
  return config;
});
