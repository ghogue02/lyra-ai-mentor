import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SaveToToolkit } from '@/components/lesson/chat/lyra/maya/SaveToToolkit';
import { ToolkitService } from '@/services/toolkitService';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          maybeSingle: vi.fn()
        })),
        single: vi.fn(),
        maybeSingle: vi.fn()
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } },
        error: null
      }))
    }
  }
}));

describe('Toolkit Save Functionality', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      React.createElement(QueryClientProvider, { client: queryClient }, component)
    );
  };

  describe('SaveToToolkit Component', () => {
    const mockEmailData = {
      subject: 'Test Email Subject',
      content: 'Test email content with PACE framework',
      framework: 'PACE'
    };

    it('should render save to toolkit button', () => {
      renderWithProvider(<SaveToToolkit emailData={mockEmailData} />);
      
      const button = screen.getByRole('button', { name: /save to mytoolkit/i });
      expect(button).toBeInTheDocument();
    });

    it('should show success message after successful save', async () => {
      // Mock successful responses
      const mockCategories = vi.fn().mockResolvedValue({
        data: [{ id: 'cat-1', category_key: 'email' }],
        error: null
      });
      
      const mockExisting = vi.fn().mockResolvedValue({
        data: null,
        error: null
      });
      
      const mockUnlock = vi.fn().mockResolvedValue({
        data: { id: 'unlock-1', user_id: 'test-user', toolkit_item_id: 'item-1' },
        error: null
      });

      const mockSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockCategories,
          maybeSingle: mockExisting
        }))
      }));

      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => ({
          single: mockUnlock
        }))
      }));

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'toolkit_categories') {
          return { select: mockSelect };
        }
        if (table === 'user_toolkit_unlocks') {
          return { 
            select: mockSelect,
            insert: mockInsert
          };
        }
        return {
          select: mockSelect,
          insert: mockInsert,
          update: vi.fn(() => ({ eq: vi.fn() }))
        };
      });

      renderWithProvider(<SaveToToolkit emailData={mockEmailData} />);
      
      const button = screen.getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/saved to toolkit/i)).toBeInTheDocument();
      });
    });

    it('should handle duplicate save gracefully', async () => {
      // Mock existing unlock
      const mockExisting = vi.fn().mockResolvedValue({
        data: { id: 'existing-unlock', user_id: 'test-user', toolkit_item_id: 'item-1' },
        error: null
      });

      const mockSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockExisting
        }))
      }));

      (supabase.from as any).mockImplementation(() => ({
        select: mockSelect
      }));

      renderWithProvider(<SaveToToolkit emailData={mockEmailData} />);
      
      const button = screen.getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(button);

      // Should not show error for duplicate save
      await waitFor(() => {
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('ToolkitService', () => {
    it('should return existing unlock if item already unlocked', async () => {
      const existingUnlock = { 
        id: 'existing', 
        user_id: 'user-1', 
        toolkit_item_id: 'item-1',
        unlocked_at: new Date().toISOString()
      };

      const mockSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: existingUnlock,
            error: null
          })
        }))
      }));

      (supabase.from as any).mockReturnValue({
        select: mockSelect
      });

      const result = await ToolkitService.unlockToolkitItem('user-1', 'item-1');
      expect(result).toEqual(existingUnlock);
    });

    it('should create new unlock if item not previously unlocked', async () => {
      const newUnlock = { 
        id: 'new-unlock', 
        user_id: 'user-1', 
        toolkit_item_id: 'item-1',
        unlocked_at: new Date().toISOString()
      };

      // Mock no existing unlock, then successful insert
      const mockExistingSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null
          })
        }))
      }));

      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: newUnlock,
            error: null
          })
        }))
      }));

      const mockCountSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { unlock_count: 5 },
            error: null
          })
        }))
      }));

      const mockUpdate = vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }));

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'user_toolkit_unlocks') {
          return {
            select: mockExistingSelect,
            insert: mockInsert
          };
        }
        if (table === 'toolkit_items') {
          return {
            select: mockCountSelect,
            update: mockUpdate
          };
        }
        return { select: vi.fn(), insert: vi.fn(), update: vi.fn() };
      });

      const result = await ToolkitService.unlockToolkitItem('user-1', 'item-1');
      expect(result).toEqual(newUnlock);
    });
  });
});