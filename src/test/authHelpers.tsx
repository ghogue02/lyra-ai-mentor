import React from 'react';
import { vi } from 'vitest';
import { User, Session } from '@supabase/supabase-js';

// Mock user data for testing
export const mockUser: User = {
  id: 'test-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  email_confirmed_at: '2024-01-01T00:00:00.000Z',
  phone: '',
  confirmed_at: '2024-01-01T00:00:00.000Z',
  last_sign_in_at: '2024-01-01T00:00:00.000Z',
  app_metadata: {},
  user_metadata: {
    name: 'Test User'
  },
  identities: [],
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
};

// Mock session data for testing
export const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user: mockUser
};

// Mock AuthContext values
export const mockAuthContextValue = {
  user: mockUser,
  session: mockSession,
  loading: false,
  signOut: vi.fn().mockResolvedValue(undefined)
};

export const mockAuthContextValueNoUser = {
  user: null,
  session: null,
  loading: false,
  signOut: vi.fn().mockResolvedValue(undefined)
};

export const mockAuthContextValueLoading = {
  user: null,
  session: null,
  loading: true,
  signOut: vi.fn().mockResolvedValue(undefined)
};

// Mock AuthProvider component for testing
export const MockAuthProvider: React.FC<{ 
  children: React.ReactNode;
  value?: typeof mockAuthContextValue;
}> = ({ children, value = mockAuthContextValue }) => {
  const AuthContext = React.createContext(value);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock useAuth hook
export const createMockUseAuth = (contextValue = mockAuthContextValue) => {
  return vi.fn().mockReturnValue(contextValue);
};

// Helper to create comprehensive Supabase auth mocks
export const createSupabaseAuthMock = (options: {
  user?: User | null;
  session?: Session | null;
  authError?: string | null;
} = {}) => {
  const { user = null, session = null, authError = null } = options;
  
  const mockSubscription = {
    unsubscribe: vi.fn()
  };

  return {
    auth: {
      onAuthStateChange: vi.fn().mockImplementation((callback) => {
        // Simulate initial auth state
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
      signIn: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError ? new Error(authError) : null
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError ? new Error(authError) : null
      }),
      user
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
  };
};

// Helper to reset all auth mocks
export const resetAuthMocks = () => {
  vi.clearAllMocks();
};