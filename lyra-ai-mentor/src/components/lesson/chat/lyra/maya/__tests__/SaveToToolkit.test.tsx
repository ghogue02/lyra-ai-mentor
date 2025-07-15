import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaveToToolkit } from '../SaveToToolkit';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ToolkitService } from '@/services/toolkitService';
import { supabase } from '@/integrations/supabase/client';
import { type ChoicePath } from '@/types/dynamicPace';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('react-router-dom');
vi.mock('sonner');
vi.mock('@/services/toolkitService', () => ({
  ToolkitService: {
    unlockToolkitItem: vi.fn(),
  },
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('SaveToToolkit Component', () => {
  const mockNavigate = vi.fn();
  const mockToast = {
    error: vi.fn(),
    success: vi.fn(),
  };

  const mockDynamicPath: ChoicePath = {
    purpose: 'inform_educate',
    audience: {
      id: 'board',
      label: 'Board Members',
      tone: 'professional',
    },
    content: {
      id: 'framework-1',
      name: 'STAR Framework',
      framework: {
        mayaFramework: {
          id: 'star',
          name: 'STAR',
          description: 'Situation, Task, Action, Result',
        },
      },
    },
    execute: {
      id: 'exec-1',
      label: 'Execute',
    },
  };

  const mockPromptBuilder = {
    purpose: 'Purpose: Inform about project progress',
    audience: 'Audience: Board members',
    content: 'Content: Using STAR framework',
    execute: 'Execute: Send by end of week',
  };

  const mockEmailContent = 'Dear Board Members, I wanted to update you on our project...';

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (toast.error as any) = mockToast.error;
    (toast.success as any) = mockToast.success;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Authentication Requirements', () => {
    it('should show error and redirect to login when user is not authenticated', async () => {
      // Arrange
      (useAuth as any).mockReturnValue({ user: null });

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Please sign in to save to your toolkit');
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login?redirect=/lyra-maya-demo');
      });
    });

    it('should allow saving when user is authenticated', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });

      const mockFromChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'cat-1' },
          error: null,
        }),
        insert: vi.fn().mockReturnThis(),
      };

      (supabase.from as any).mockReturnValue(mockFromChain);
      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockToast.error).not.toHaveBeenCalledWith('Please sign in to save to your toolkit');
      });
    });
  });

  describe('Required Data Validation', () => {
    beforeEach(() => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });
    });

    it('should show error when dynamicPath is missing', async () => {
      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={null}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Missing required data to save');
      });
    });

    it('should show error when emailContent is missing', async () => {
      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent=""
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Missing required data to save');
      });
    });
  });

  describe('Category Dependencies', () => {
    beforeEach(() => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });
    });

    it('should fail when email category does not exist', async () => {
      // Arrange
      const mockFromChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Category not found'),
        }),
      };

      (supabase.from as any).mockReturnValue(mockFromChain);

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to save to toolkit');
      });
    });

    it('should query for email category by category_key', async () => {
      // Arrange
      const mockFromChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'cat-1' },
          error: null,
        }),
        insert: vi.fn().mockReturnThis(),
      };

      (supabase.from as any).mockReturnValue(mockFromChain);
      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('toolkit_categories');
        expect(mockFromChain.eq).toHaveBeenCalledWith('category_key', 'email');
      });
    });
  });

  describe('Toolkit Item Creation', () => {
    beforeEach(() => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });
    });

    it('should create toolkit item with correct metadata structure', async () => {
      // Arrange
      let capturedItem: any;
      const mockFromChain = {
        select: vi.fn().mockImplementation((fields?: string) => {
          if (fields === 'id') {
            // Checking for existing items
            return {
              eq: vi.fn().mockReturnThis(),
              data: [],
              error: null,
            };
          }
          return mockFromChain;
        }),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'cat-1' },
          error: null,
        }),
        insert: vi.fn().mockImplementation((item) => {
          capturedItem = item;
          return {
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: 'item-1', ...item },
              error: null,
            }),
          };
        }),
      };

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'toolkit_categories') {
          return mockFromChain;
        } else if (table === 'toolkit_items') {
          return mockFromChain;
        }
        return mockFromChain;
      });

      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(capturedItem).toBeDefined();
        expect(capturedItem.name).toBe('Share important news - Board Members');
        expect(capturedItem.category_id).toBe('cat-1');
        expect(capturedItem.file_type).toBe('pace_email');
        expect(capturedItem.is_new).toBe(true);
        
        const metadata = JSON.parse(capturedItem.metadata);
        expect(metadata.pace_data).toBeDefined();
        expect(metadata.pace_data.purpose).toBe('inform_educate');
        expect(metadata.pace_data.audience).toEqual(mockDynamicPath.audience);
        expect(metadata.pace_data.email_content).toBe(mockEmailContent);
        expect(metadata.pace_data.prompt).toContain('Purpose: Inform about project progress');
      });
    });

    it('should handle existing toolkit items', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });
      
      const mockFromChain = {
        select: vi.fn().mockImplementation((fields?: string) => {
          if (fields === 'id') {
            // Return existing item
            return {
              eq: vi.fn().mockReturnThis(),
              data: [{ id: 'existing-item-1' }],
              error: null,
            };
          }
          return mockFromChain;
        }),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'cat-1' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockFromChain);
      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(ToolkitService.unlockToolkitItem).toHaveBeenCalledWith(mockUser.id, 'existing-item-1');
      });
    });
  });

  describe('UI State Management', () => {
    beforeEach(() => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });

      const mockFromChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'cat-1' },
          error: null,
        }),
        insert: vi.fn().mockReturnThis(),
      };

      (supabase.from as any).mockReturnValue(mockFromChain);
    });

    it('should show loading state while saving', async () => {
      // Arrange
      (ToolkitService.unlockToolkitItem as any).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      // Act
      const { getByRole, getByText } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(getByText('Saving...')).toBeInTheDocument();
      });
    });

    it('should show saved state after successful save', async () => {
      // Arrange
      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});

      // Act
      const { getByRole, getByText } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(getByText('Saved to Toolkit')).toBeInTheDocument();
      });
    });

    it('should disable button after successful save', async () => {
      // Arrange
      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});

      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe('Achievement Integration', () => {
    beforeEach(() => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (useAuth as any).mockReturnValue({ user: mockUser });

      const mockFromChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'cat-1' },
          error: null,
        }),
        insert: vi.fn().mockReturnThis(),
      };

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'user_toolkit_achievements') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            data: [
              {
                achievement: {
                  name: 'First Save',
                  description: 'Save your first toolkit item',
                  criteria_type: 'unlock_count',
                },
                current_value: 0,
                target_value: 1,
                is_unlocked: false,
              },
            ],
            error: null,
          };
        }
        return mockFromChain;
      });

      (ToolkitService.unlockToolkitItem as any).mockResolvedValue({});
    });

    it('should check for achievements after saving', async () => {
      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('user_toolkit_achievements');
      });
    });

    it('should show achievement notification when unlocked', async () => {
      // Act
      const { getByRole } = render(
        <SaveToToolkit
          dynamicPath={mockDynamicPath}
          emailContent={mockEmailContent}
          promptBuilder={mockPromptBuilder}
        />
      );

      const saveButton = getByRole('button', { name: /save to mytoolkit/i });
      fireEvent.click(saveButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Achievement Unlocked: First Save!',
          expect.objectContaining({
            description: 'Save your first toolkit item',
            duration: 5000,
          })
        );
      });
    });
  });
});