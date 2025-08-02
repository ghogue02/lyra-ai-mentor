import '@testing-library/jest-dom';
import { expect, afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { createSupabaseAuthMock, resetAuthMocks } from './authHelpers';
import './globals';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Reset all mocks before each test
beforeEach(() => {
  resetAuthMocks();
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Supabase client globally for all tests
vi.mock('@/integrations/supabase/client', () => {
  const mockSubscription = {
    unsubscribe: vi.fn()
  };

  return {
    supabase: {
      auth: {
        onAuthStateChange: vi.fn().mockImplementation((callback) => {
          // Simulate initial auth state - no user by default
          setTimeout(() => callback('INITIAL_SESSION', null), 0);
          return {
            data: { subscription: mockSubscription }
          };
        }),
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: null
        }),
        signUp: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: null
        }),
        user: null
      },
      functions: {
        invoke: vi.fn().mockResolvedValue({
          data: { content: 'Mock generated content' },
          error: null
        })
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        then: vi.fn().mockResolvedValue({ data: [], error: null })
      })
    }
  };
});