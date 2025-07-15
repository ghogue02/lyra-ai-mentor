import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ToolkitService, ToolkitCategory, ToolkitItem } from '../toolkitService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
    })),
    rpc: vi.fn(),
    raw: vi.fn((value) => value),
  },
}));

describe('ToolkitService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Required Categories', () => {
    it('should have email category available', async () => {
      // Arrange
      const mockCategories: ToolkitCategory[] = [
        {
          id: '1',
          category_key: 'email',
          name: 'Email Templates',
          description: 'Professional email templates',
          icon: 'Mail',
          gradient: 'from-blue-500 to-purple-600',
          order_index: 1,
        },
      ];

      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: mockCategories,
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const categories = await ToolkitService.getCategories();

      // Assert
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories.find(c => c.category_key === 'email')).toBeDefined();
    });

    it('should have grants category available', async () => {
      // Arrange
      const mockCategories: ToolkitCategory[] = [
        {
          id: '2',
          category_key: 'grants',
          name: 'Grant Templates',
          description: 'Grant writing templates and tools',
          icon: 'FileText',
          gradient: 'from-green-500 to-teal-600',
          order_index: 2,
        },
      ];

      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: mockCategories,
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const categories = await ToolkitService.getCategories();

      // Assert
      expect(categories.find(c => c.category_key === 'grants')).toBeDefined();
    });

    it('should have data category available', async () => {
      // Arrange
      const mockCategories: ToolkitCategory[] = [
        {
          id: '3',
          category_key: 'data',
          name: 'Data & Analytics',
          description: 'Data visualization and analysis tools',
          icon: 'BarChart',
          gradient: 'from-orange-500 to-red-600',
          order_index: 3,
        },
      ];

      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: mockCategories,
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const categories = await ToolkitService.getCategories();

      // Assert
      expect(categories.find(c => c.category_key === 'data')).toBeDefined();
    });

    it('should fail when required categories are missing', async () => {
      // Arrange
      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [], // Empty categories
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const categories = await ToolkitService.getCategories();

      // Assert
      expect(categories).toEqual([]);
      expect(categories.find(c => c.category_key === 'email')).toBeUndefined();
    });
  });

  describe('Category Structure', () => {
    it('should have correct structure for toolkit categories', async () => {
      // Arrange
      const mockCategory: ToolkitCategory = {
        id: '1',
        category_key: 'email',
        name: 'Email Templates',
        description: 'Professional email templates',
        icon: 'Mail',
        gradient: 'from-blue-500 to-purple-600',
        order_index: 1,
      };

      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [mockCategory],
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const categories = await ToolkitService.getCategories();
      const emailCategory = categories[0];

      // Assert
      expect(emailCategory).toHaveProperty('id');
      expect(emailCategory).toHaveProperty('category_key');
      expect(emailCategory).toHaveProperty('name');
      expect(emailCategory).toHaveProperty('description');
      expect(emailCategory).toHaveProperty('icon');
      expect(emailCategory).toHaveProperty('gradient');
      expect(emailCategory).toHaveProperty('order_index');
    });

    it('should validate category data types', async () => {
      // Arrange
      const mockCategory: ToolkitCategory = {
        id: '1',
        category_key: 'email',
        name: 'Email Templates',
        description: 'Professional email templates',
        icon: 'Mail',
        gradient: 'from-blue-500 to-purple-600',
        order_index: 1,
      };

      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [mockCategory],
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const categories = await ToolkitService.getCategories();
      const emailCategory = categories[0];

      // Assert
      expect(typeof emailCategory.id).toBe('string');
      expect(typeof emailCategory.category_key).toBe('string');
      expect(typeof emailCategory.name).toBe('string');
      expect(typeof emailCategory.description).toBe('string');
      expect(typeof emailCategory.icon).toBe('string');
      expect(typeof emailCategory.gradient).toBe('string');
      expect(typeof emailCategory.order_index).toBe('number');
    });
  });

  describe('Database Connection', () => {
    it('should handle database connection errors gracefully', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');
      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: null,
              error: mockError,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act & Assert
      await expect(ToolkitService.getCategories()).rejects.toThrow('Database connection failed');
    });

    it('should use correct table names for queries', async () => {
      // Arrange
      const fromMock = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [],
              error: null,
            })),
          })),
        })),
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      await ToolkitService.getCategories();

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('toolkit_categories');
    });

    it('should filter by active status', async () => {
      // Arrange
      const eqMock = vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      }));

      const selectMock = vi.fn(() => ({
        eq: eqMock,
      }));

      const fromMock = vi.fn(() => ({
        select: selectMock,
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      await ToolkitService.getCategories();

      // Assert
      expect(eqMock).toHaveBeenCalledWith('is_active', true);
    });
  });

  describe('Data Creation and Retrieval', () => {
    it('should create a new toolkit item', async () => {
      // Arrange
      const userId = 'test-user-id';
      const itemId = 'test-item-id';
      
      const insertMock = vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: itemId, user_id: userId, toolkit_item_id: itemId },
            error: null,
          })),
        })),
      }));

      const fromMock = vi.fn((table: string) => {
        if (table === 'user_toolkit_unlocks') {
          return { insert: insertMock };
        }
        return {
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        };
      });

      (supabase.from as any).mockImplementation(fromMock);
      (supabase.rpc as any).mockResolvedValue({ data: [], error: null });

      // Act
      const result = await ToolkitService.unlockToolkitItem(userId, itemId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(itemId);
      expect(insertMock).toHaveBeenCalledWith({
        user_id: userId,
        toolkit_item_id: itemId,
      });
    });

    it('should retrieve toolkit items with user unlock status', async () => {
      // Arrange
      const userId = 'test-user-id';
      const mockItems: ToolkitItem[] = [
        {
          id: '1',
          name: 'Email Template 1',
          category_id: '1',
          description: 'Test template',
          is_new: true,
          is_featured: false,
          is_premium: false,
          is_active: true,
          download_count: 0,
          unlock_count: 0,
          average_rating: 0,
          rating_count: 0,
          created_at: new Date().toISOString(),
          user_unlock: {
            id: 'unlock-1',
            user_id: userId,
            toolkit_item_id: '1',
            unlocked_at: new Date().toISOString(),
            download_count: 0,
          },
        },
      ];

      const eqMock = vi.fn(() => ({
        data: mockItems.map(item => ({
          ...item,
          user_unlock: item.user_unlock ? [item.user_unlock] : [],
        })),
        error: null,
      }));

      const orderMock = vi.fn(() => ({
        eq: eqMock,
      }));

      const selectMock = vi.fn(() => ({
        eq: vi.fn(() => ({
          order: orderMock,
        })),
      }));

      const fromMock = vi.fn(() => ({
        select: selectMock,
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const items = await ToolkitService.getToolkitItems(userId);

      // Assert
      expect(items).toBeDefined();
      expect(items.length).toBe(1);
      expect(items[0].user_unlock).toBeDefined();
      expect(items[0].user_unlock?.user_id).toBe(userId);
    });

    it('should handle toolkit item search', async () => {
      // Arrange
      const searchQuery = 'email';
      const mockItems: ToolkitItem[] = [
        {
          id: '1',
          name: 'Email Template 1',
          category_id: '1',
          description: 'Test email template',
          is_new: true,
          is_featured: false,
          is_premium: false,
          is_active: true,
          download_count: 0,
          unlock_count: 0,
          average_rating: 0,
          rating_count: 0,
          created_at: new Date().toISOString(),
        },
      ];

      const orderMock = vi.fn(() => ({
        data: mockItems.map(item => ({
          ...item,
          user_unlock: [],
        })),
        error: null,
      }));

      const ilikeMock = vi.fn(() => ({
        order: orderMock,
      }));

      const eqMock = vi.fn(() => ({
        ilike: ilikeMock,
      }));

      const selectMock = vi.fn(() => ({
        eq: eqMock,
      }));

      const fromMock = vi.fn(() => ({
        select: selectMock,
      }));

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const items = await ToolkitService.searchToolkitItems(searchQuery);

      // Assert
      expect(items).toBeDefined();
      expect(items.length).toBe(1);
      expect(ilikeMock).toHaveBeenCalledWith('name', `%${searchQuery}%`);
    });
  });

  describe('Achievement System', () => {
    it('should check and update achievements after unlocking items', async () => {
      // Arrange
      const userId = 'test-user-id';
      const mockAchievements = [
        {
          achievement_id: 'ach-1',
          achievement_name: 'First Unlock',
          newly_unlocked: true,
        },
      ];

      (supabase.rpc as any).mockResolvedValue({
        data: mockAchievements,
        error: null,
      });

      // Act
      const achievements = await ToolkitService.checkAndUpdateAchievements(userId);

      // Assert
      expect(achievements).toBeDefined();
      expect(achievements.length).toBe(1);
      expect(achievements[0].newly_unlocked).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('check_toolkit_achievements', {
        p_user_id: userId,
      });
    });

    it('should get user toolkit statistics', async () => {
      // Arrange
      const userId = 'test-user-id';
      
      // Mock total tools count
      const fromMock = vi.fn((table: string) => {
        if (table === 'toolkit_items') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                count: 10,
                error: null,
              })),
            })),
          };
        } else if (table === 'user_toolkit_unlocks') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                data: [
                  {
                    id: '1',
                    download_count: 5,
                    rating: 4,
                    toolkit_item: { category_id: 'cat-1' },
                  },
                  {
                    id: '2',
                    download_count: 3,
                    rating: 5,
                    toolkit_item: { category_id: 'cat-2' },
                  },
                ],
                error: null,
              })),
            })),
          };
        }
      });

      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const stats = await ToolkitService.getUserToolkitStats(userId);

      // Assert
      expect(stats).toBeDefined();
      expect(stats.totalTools).toBe(10);
      expect(stats.unlockedTools).toBe(2);
      expect(stats.totalDownloads).toBe(8);
      expect(stats.categoriesExplored).toBe(2);
      expect(stats.averageRating).toBe(4.5);
    });
  });
});