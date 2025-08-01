import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';

// Export comprehensive mock factory
export const createSupabaseMock = (options: {
  user?: User | null;
  session?: Session | null;
  authError?: string | null;
} = {}) => {
  const { user = null, session = null, authError = null } = options;
  
  const mockSubscription = {
    unsubscribe: vi.fn()
  };

  const authStateCallback = vi.fn();

  return {
    auth: {
      onAuthStateChange: vi.fn().mockImplementation((callback) => {
        authStateCallback.mockImplementation(callback);
        // Simulate initial auth state after a microtask
        setTimeout(() => {
          callback('INITIAL_SESSION', session);
        }, 0);
        
        return {
          data: { subscription: mockSubscription }
        };
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session },
        error: authError ? new Error(authError) : null
      }),
      signOut: vi.fn().mockResolvedValue({ 
        error: authError ? new Error(authError) : null 
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError ? new Error(authError) : null
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError ? new Error(authError) : null
      }),
      user,
      // Additional auth methods for completeness
      refreshSession: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError ? new Error(authError) : null
      }),
      updateUser: vi.fn().mockResolvedValue({
        data: { user },
        error: authError ? new Error(authError) : null
      })
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
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      csv: vi.fn().mockResolvedValue({ data: null, error: null }),
      explain: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn().mockResolvedValue({ data: [], error: null })
    }),
    // Storage methods
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        move: vi.fn().mockResolvedValue({ data: null, error: null }),
        copy: vi.fn().mockResolvedValue({ data: null, error: null }),
        createSignedUrl: vi.fn().mockResolvedValue({ data: null, error: null }),
        createSignedUrls: vi.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'mock-url' } })
      })
    },
    // Real-time methods
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn().mockReturnThis()
    }),
    removeChannel: vi.fn(),
    removeAllChannels: vi.fn(),
    getChannels: vi.fn().mockReturnValue([])
  };
};

// Default mock instance
export const defaultSupabaseMock = createSupabaseMock();