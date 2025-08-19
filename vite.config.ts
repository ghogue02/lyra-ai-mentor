import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: [],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        },
        // Force cache invalidation with timestamp
        entryFileNames: (chunkInfo) => {
          const timestamp = Date.now().toString(36);
          return `assets/[name]-${timestamp}-[hash].js`;
        },
        chunkFileNames: (chunkInfo) => {
          const timestamp = Date.now().toString(36);
          return `assets/[name]-${timestamp}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const timestamp = Date.now().toString(36);
          return `assets/[name]-${timestamp}-[hash].[ext]`;
        },
        manualChunks: (id) => {
          // 🔍 DEBUG: Enhanced React bundling with logging
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              console.log('🔍 [VITE DEBUG] Bundling React module:', id);
              // Force React into main vendor bundle to ensure global exposure
              return 'vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'vendor-form';
            }
            return 'vendor';
          }
          
          // Feature-based chunks
          if (id.includes('src/components/chat-system') || id.includes('src/contexts/GlobalChatContext')) {
            return 'chat-system';
          }
          if (id.includes('src/components/lesson/carmen')) {
            return 'carmen-components';
          }
          if (id.includes('src/components/lesson')) {
            return 'lesson-components';
          }
          if (id.includes('src/components/ui/interaction-patterns')) {
            return 'ui-patterns';
          }
          if (id.includes('src/pages/Chapter')) {
            return 'chapter-pages';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: mode === 'production' ? 'terser' : false,
    // 🔍 DEBUG: DISABLE console removal to see debug logs in production
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: false, // Keep console for debugging
          drop_debugger: false, // Keep debugger for debugging
          pure_funcs: [] // Don't remove any console methods
        }
      }
    })
  }
}));
