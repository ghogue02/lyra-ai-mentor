import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    reporters: ['verbose', 'json'],
    testTimeout: 10000, // 10 seconds for performance tests
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 90,
          statements: 90,
        },
      },
      include: [
        'src/components/interactive/**/*.tsx',
        'src/components/lesson/**/*.tsx',
        'src/hooks/**/*.ts',
        'src/utils/**/*.ts',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.type.ts',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
        'src/components/testing/**', // Exclude testing components from coverage
      ],
    },
    // Performance test configuration
    benchmark: {
      outputFile: './test-reports/benchmark.json',
      reporters: ['verbose', 'json'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/integrations': path.resolve(__dirname, './src/integrations'),
    },
  },
});