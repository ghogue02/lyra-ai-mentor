import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { ToolkitService } from '@/services/toolkitService';

// Integration test configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'test-key';

// Create test client
const testSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

describe('Toolkit Data Dependencies Integration Tests', () => {
  let testUserId: string;
  let testCategoryIds: Record<string, string> = {};

  beforeAll(async () => {
    // Create a test user
    const { data: authData, error: authError } = await testSupabase.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
    });

    if (authError || !authData.user) {
      throw new Error('Failed to create test user');
    }

    testUserId = authData.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      // Delete test user's toolkit unlocks
      await testSupabase
        .from('user_toolkit_unlocks')
        .delete()
        .eq('user_id', testUserId);

      // Delete test user's achievements
      await testSupabase
        .from('user_toolkit_achievements')
        .delete()
        .eq('user_id', testUserId);

      // Sign out
      await testSupabase.auth.signOut();
    }
  });

  describe('Required Categories Existence', () => {
    it('should have email category in database', async () => {
      // Act
      const { data: categories, error } = await testSupabase
        .from('toolkit_categories')
        .select('*')
        .eq('category_key', 'email')
        .single();

      // Assert
      expect(error).toBeNull();
      expect(categories).toBeDefined();
      expect(categories.category_key).toBe('email');
      expect(categories.name).toBeDefined();
      expect(categories.is_active).toBe(true);
      
      testCategoryIds.email = categories.id;
    });

    it('should have grants category in database', async () => {
      // Act
      const { data: categories, error } = await testSupabase
        .from('toolkit_categories')
        .select('*')
        .eq('category_key', 'grants')
        .single();

      // Assert
      expect(error).toBeNull();
      expect(categories).toBeDefined();
      expect(categories.category_key).toBe('grants');
      expect(categories.name).toBeDefined();
      expect(categories.is_active).toBe(true);
      
      testCategoryIds.grants = categories.id;
    });

    it('should have data category in database', async () => {
      // Act
      const { data: categories, error } = await testSupabase
        .from('toolkit_categories')
        .select('*')
        .eq('category_key', 'data')
        .single();

      // Assert
      expect(error).toBeNull();
      expect(categories).toBeDefined();
      expect(categories.category_key).toBe('data');
      expect(categories.name).toBeDefined();
      expect(categories.is_active).toBe(true);
      
      testCategoryIds.data = categories.id;
    });

    it('should have all required fields in categories', async () => {
      // Act
      const { data: categories, error } = await testSupabase
        .from('toolkit_categories')
        .select('*')
        .eq('is_active', true);

      // Assert
      expect(error).toBeNull();
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);

      categories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('category_key');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('gradient');
        expect(category).toHaveProperty('order_index');
        expect(category).toHaveProperty('is_active');
        expect(category).toHaveProperty('created_at');
      });
    });
  });

  describe('Database Schema Validation', () => {
    it('should have correct schema for toolkit_items table', async () => {
      // Create a test item to validate schema
      const testItem = {
        name: `Test Item ${Date.now()}`,
        category_id: testCategoryIds.email,
        description: 'Test description',
        file_type: 'test',
        is_new: true,
        is_featured: false,
        is_premium: false,
        is_active: true,
      };

      // Act
      const { data, error } = await testSupabase
        .from('toolkit_items')
        .insert(testItem)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('download_count');
      expect(data).toHaveProperty('unlock_count');
      expect(data).toHaveProperty('average_rating');
      expect(data).toHaveProperty('rating_count');
      expect(data).toHaveProperty('created_at');
      expect(data).toHaveProperty('updated_at');

      // Clean up
      await testSupabase
        .from('toolkit_items')
        .delete()
        .eq('id', data.id);
    });

    it('should have correct schema for user_toolkit_unlocks table', async () => {
      // Create a test item first
      const { data: testItem } = await testSupabase
        .from('toolkit_items')
        .insert({
          name: `Test Item ${Date.now()}`,
          category_id: testCategoryIds.email,
          file_type: 'test',
          is_active: true,
        })
        .select()
        .single();

      // Act
      const { data, error } = await testSupabase
        .from('user_toolkit_unlocks')
        .insert({
          user_id: testUserId,
          toolkit_item_id: testItem.id,
        })
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('user_id');
      expect(data).toHaveProperty('toolkit_item_id');
      expect(data).toHaveProperty('unlocked_at');
      expect(data).toHaveProperty('download_count');
      expect(data).toHaveProperty('last_downloaded_at');
      expect(data).toHaveProperty('rating');
      expect(data).toHaveProperty('rated_at');
      expect(data).toHaveProperty('user_notes');

      // Clean up
      await testSupabase
        .from('user_toolkit_unlocks')
        .delete()
        .eq('id', data.id);
      await testSupabase
        .from('toolkit_items')
        .delete()
        .eq('id', testItem.id);
    });
  });

  describe('Data Relationships', () => {
    it('should enforce foreign key relationship between items and categories', async () => {
      // Act - Try to create item with invalid category
      const { error } = await testSupabase
        .from('toolkit_items')
        .insert({
          name: 'Test Item',
          category_id: 'invalid-category-id',
          file_type: 'test',
        });

      // Assert
      expect(error).toBeDefined();
      expect(error.code).toBe('23503'); // Foreign key violation
    });

    it('should cascade properly when handling toolkit items', async () => {
      // Create test item
      const { data: testItem } = await testSupabase
        .from('toolkit_items')
        .insert({
          name: `Cascade Test ${Date.now()}`,
          category_id: testCategoryIds.email,
          file_type: 'test',
          is_active: true,
        })
        .select()
        .single();

      // Create unlock
      await testSupabase
        .from('user_toolkit_unlocks')
        .insert({
          user_id: testUserId,
          toolkit_item_id: testItem.id,
        });

      // Act - Delete the item
      const { error: deleteError } = await testSupabase
        .from('toolkit_items')
        .delete()
        .eq('id', testItem.id);

      // Assert - Should handle cascade properly
      expect(deleteError).toBeNull();

      // Verify unlock was also deleted
      const { data: unlocks } = await testSupabase
        .from('user_toolkit_unlocks')
        .select('*')
        .eq('toolkit_item_id', testItem.id);

      expect(unlocks).toEqual([]);
    });
  });

  describe('RPC Functions', () => {
    it('should increment download count correctly', async () => {
      // Create test item
      const { data: testItem } = await testSupabase
        .from('toolkit_items')
        .insert({
          name: `Download Test ${Date.now()}`,
          category_id: testCategoryIds.email,
          file_type: 'test',
          is_active: true,
        })
        .select()
        .single();

      // Create unlock
      await testSupabase
        .from('user_toolkit_unlocks')
        .insert({
          user_id: testUserId,
          toolkit_item_id: testItem.id,
        });

      // Act
      const { error } = await testSupabase
        .rpc('increment_toolkit_download', {
          p_user_id: testUserId,
          p_item_id: testItem.id,
        });

      // Assert
      expect(error).toBeNull();

      // Verify counts were incremented
      const { data: updatedItem } = await testSupabase
        .from('toolkit_items')
        .select('download_count')
        .eq('id', testItem.id)
        .single();

      expect(updatedItem.download_count).toBe(1);

      // Clean up
      await testSupabase
        .from('user_toolkit_unlocks')
        .delete()
        .eq('toolkit_item_id', testItem.id);
      await testSupabase
        .from('toolkit_items')
        .delete()
        .eq('id', testItem.id);
    });

    it('should handle rating updates correctly', async () => {
      // Create test item
      const { data: testItem } = await testSupabase
        .from('toolkit_items')
        .insert({
          name: `Rating Test ${Date.now()}`,
          category_id: testCategoryIds.email,
          file_type: 'test',
          is_active: true,
        })
        .select()
        .single();

      // Create unlock
      await testSupabase
        .from('user_toolkit_unlocks')
        .insert({
          user_id: testUserId,
          toolkit_item_id: testItem.id,
        });

      // Act
      const { error } = await testSupabase
        .rpc('rate_toolkit_item', {
          p_user_id: testUserId,
          p_item_id: testItem.id,
          p_rating: 5,
        });

      // Assert
      expect(error).toBeNull();

      // Verify rating was updated
      const { data: updatedItem } = await testSupabase
        .from('toolkit_items')
        .select('average_rating, rating_count')
        .eq('id', testItem.id)
        .single();

      expect(updatedItem.average_rating).toBe(5);
      expect(updatedItem.rating_count).toBe(1);

      // Clean up
      await testSupabase
        .from('user_toolkit_unlocks')
        .delete()
        .eq('toolkit_item_id', testItem.id);
      await testSupabase
        .from('toolkit_items')
        .delete()
        .eq('id', testItem.id);
    });
  });

  describe('Achievement System', () => {
    it('should have toolkit achievements configured', async () => {
      // Act
      const { data: achievements, error } = await testSupabase
        .from('toolkit_achievements')
        .select('*')
        .order('order_index');

      // Assert
      expect(error).toBeNull();
      expect(achievements).toBeDefined();
      expect(achievements.length).toBeGreaterThan(0);

      achievements.forEach(achievement => {
        expect(achievement).toHaveProperty('achievement_key');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('criteria_type');
        expect(achievement).toHaveProperty('achievement_tier');
      });
    });

    it('should track user achievement progress', async () => {
      // Get first achievement
      const { data: achievements } = await testSupabase
        .from('toolkit_achievements')
        .select('*')
        .limit(1)
        .single();

      // Act - Check initial state
      const { data: progress, error } = await testSupabase
        .from('user_toolkit_achievements')
        .select('*')
        .eq('user_id', testUserId)
        .eq('achievement_id', achievements.id);

      // Assert
      expect(error).toBeNull();
      // Progress might not exist yet, which is fine
      if (progress && progress.length > 0) {
        expect(progress[0]).toHaveProperty('current_value');
        expect(progress[0]).toHaveProperty('is_unlocked');
      }
    });
  });

  describe('Service Integration', () => {
    beforeEach(() => {
      // Mock the supabase client in ToolkitService to use our test client
      vi.mock('@/integrations/supabase/client', () => ({
        supabase: testSupabase,
      }));
    });

    it('should retrieve categories through ToolkitService', async () => {
      // Act
      const categories = await ToolkitService.getCategories();

      // Assert
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories.find(c => c.category_key === 'email')).toBeDefined();
      expect(categories.find(c => c.category_key === 'grants')).toBeDefined();
      expect(categories.find(c => c.category_key === 'data')).toBeDefined();
    });

    it('should handle full workflow: create, unlock, and track', async () => {
      // Create a test item
      const { data: testItem } = await testSupabase
        .from('toolkit_items')
        .insert({
          name: `Full Workflow Test ${Date.now()}`,
          category_id: testCategoryIds.email,
          description: 'Testing full workflow',
          file_type: 'pace_email',
          is_active: true,
          metadata: JSON.stringify({
            pace_data: {
              purpose: 'test',
              audience: { label: 'Test Audience' },
            },
          }),
        })
        .select()
        .single();

      // Act - Unlock the item
      const unlock = await ToolkitService.unlockToolkitItem(testUserId, testItem.id);

      // Assert
      expect(unlock).toBeDefined();
      expect(unlock.user_id).toBe(testUserId);
      expect(unlock.toolkit_item_id).toBe(testItem.id);

      // Verify item unlock count was incremented
      const { data: updatedItem } = await testSupabase
        .from('toolkit_items')
        .select('unlock_count')
        .eq('id', testItem.id)
        .single();

      expect(updatedItem.unlock_count).toBe(1);

      // Clean up
      await testSupabase
        .from('user_toolkit_unlocks')
        .delete()
        .eq('toolkit_item_id', testItem.id);
      await testSupabase
        .from('toolkit_items')
        .delete()
        .eq('id', testItem.id);
    });
  });
});