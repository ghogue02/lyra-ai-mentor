import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Export everything from testing-library/react for convenience
export * from '@testing-library/react';

// Create a custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };

// Common test utilities
export const createMockProps = <T,>(overrides: Partial<T> = {}): T => {
  return {
    ...overrides
  } as T;
};

export const mockFunction = () => vi.fn();

// Mock implementations for common hooks  
export const mockUseNavigate = () => vi.fn();
export const mockUseLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
});

// Helper for async testing
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock component for testing
export const MockComponent: React.FC<{ testId?: string; children?: React.ReactNode }> = ({ 
  testId = 'mock-component', 
  children 
}) => (
  <div data-testid={testId}>{children}</div>
);