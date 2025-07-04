// Jest setup for interactive component tests
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import fetch from 'node-fetch';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.fetch = fetch as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Suppress console errors during tests (unless debugging)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || 
       args[0].includes('ReactDOM.render is no longer supported'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        getPublicUrl: jest.fn(() => ({ publicUrl: 'mock-url' })),
      })),
    },
  },
}));

// Performance monitoring setup
if (!('memory' in performance)) {
  (performance as any).memory = {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  };
}

// Ensure all async operations complete
afterEach(() => {
  jest.clearAllMocks();
});

// Increase timeout for complex component tests
jest.setTimeout(10000);