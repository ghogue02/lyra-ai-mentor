import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ensureToolkitData, verifyToolkitData, getToolkitStats } from '../ensureToolkitData';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }))
      })),
      single: vi.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }))
    })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }))
};

describe('ensureToolkitData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create missing categories', async () => {
    const result = await ensureToolkitData(mockSupabase as any);
    
    expect(result.success).toBe(true);
    expect(result.categoriesCreated).toBe(8); // All 8 categories
    expect(result.errors).toHaveLength(0);
  });

  it('should update existing categories if data changed', async () => {
    // Mock existing category with different data
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              category_key: 'email',
              name: 'Old Name',
              description: 'Old Description',
              icon: 'OldIcon',
              gradient: 'old-gradient',
              order_index: 99
            },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }));

    const result = await ensureToolkitData(mockSupabase as any);
    
    expect(result.categoriesUpdated).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    // Mock database error
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.reject(new Error('Database error')))
        }))
      }))
    }));

    const result = await ensureToolkitData(mockSupabase as any);
    
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Failed to process category');
  });
});

describe('verifyToolkitData', () => {
  it('should detect missing categories', async () => {
    // Mock empty categories
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn(() => Promise.resolve({ data: [] }))
    }));

    const result = await verifyToolkitData(mockSupabase as any);
    
    expect(result.isValid).toBe(false);
    expect(result.missingCategories).toHaveLength(8);
    expect(result.missingCategories).toContain('email');
    expect(result.missingCategories).toContain('grants');
  });

  it('should return valid when all data exists', async () => {
    // Mock all categories and achievements exist
    mockSupabase.from
      .mockImplementationOnce(() => ({
        select: vi.fn(() => Promise.resolve({
          data: [
            { category_key: 'email' },
            { category_key: 'grants' },
            { category_key: 'data' },
            { category_key: 'automation' },
            { category_key: 'change' },
            { category_key: 'social' },
            { category_key: 'training' },
            { category_key: 'reports' }
          ]
        }))
      }))
      .mockImplementationOnce(() => ({
        select: vi.fn(() => Promise.resolve({
          data: [
            { achievement_key: 'first_unlock' },
            { achievement_key: 'category_explorer' },
            { achievement_key: 'power_user' }
          ]
        }))
      }));

    const result = await verifyToolkitData(mockSupabase as any);
    
    expect(result.isValid).toBe(true);
    expect(result.missingCategories).toHaveLength(0);
    expect(result.missingAchievements).toHaveLength(0);
  });
});

describe('getToolkitStats', () => {
  it('should return category statistics', async () => {
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { category_key: 'email', name: 'Email Templates', toolkit_items: [{}, {}] },
            { category_key: 'grants', name: 'Grant Proposals', toolkit_items: [{}] },
            { category_key: 'data', name: 'Data Visualizations', toolkit_items: [] }
          ],
          error: null
        }))
      }))
    }));

    const result = await getToolkitStats(mockSupabase as any);
    
    expect(result.categoryStats).toHaveLength(3);
    expect(result.categoryStats[0]).toEqual({
      category_key: 'email',
      name: 'Email Templates',
      item_count: 2
    });
    expect(result.categoryStats[1].item_count).toBe(1);
    expect(result.categoryStats[2].item_count).toBe(0);
  });
});