import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions based on our schema
export interface ToolkitCategory {
  id: string;
  category_key: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  order_index: number;
}

export interface ToolkitItem {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  preview_url?: string;
  download_url?: string;
  file_size?: number;
  file_type?: string;
  is_new: boolean;
  is_featured: boolean;
  is_premium: boolean;
  is_active: boolean;
  download_count: number;
  unlock_count: number;
  average_rating: number;
  rating_count: number;
  created_at: string;
  // Joined data
  category?: ToolkitCategory;
  user_unlock?: UserToolkitUnlock;
}

export interface UserToolkitUnlock {
  id: string;
  user_id: string;
  toolkit_item_id: string;
  unlocked_at: string;
  download_count: number;
  last_downloaded_at?: string;
  rating?: number;
  rated_at?: string;
  user_notes?: string;
}

export interface ToolkitAchievement {
  id: string;
  achievement_key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria_type: string;
  criteria_value?: number;
  order_index: number;
  achievement_tier: string;
  // Joined data
  user_progress?: UserAchievementProgress;
}

export interface UserAchievementProgress {
  id: string;
  user_id: string;
  achievement_id: string;
  current_value: number;
  target_value?: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  notification_shown: boolean;
}

// Service class for toolkit operations
export class ToolkitService {
  // Get all categories
  static async getCategories(): Promise<ToolkitCategory[]> {
    const { data, error } = await supabase
      .from('toolkit_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (error) {
      console.error('Error fetching toolkit categories:', error);
      throw error;
    }

    return data || [];
  }

  // Get all toolkit items with user unlock status
  static async getToolkitItems(userId?: string): Promise<ToolkitItem[]> {
    let query = supabase
      .from('toolkit_items')
      .select(`
        *,
        category:toolkit_categories!toolkit_items_category_id_fkey(*),
        user_unlock:user_toolkit_unlocks!left(*)
      `)
      .eq('is_active', true)
      .order('name');

    // If user is logged in, filter unlocks by user
    if (userId) {
      query = query.eq('user_unlock.user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching toolkit items:', error);
      throw error;
    }

    // Transform the data to match our interface
    return (data || []).map(item => ({
      ...item,
      user_unlock: item.user_unlock?.[0] || null
    }));
  }

  // Get toolkit items by category
  static async getToolkitItemsByCategory(categoryKey: string, userId?: string): Promise<ToolkitItem[]> {
    // First get the category
    const { data: categoryData, error: categoryError } = await supabase
      .from('toolkit_categories')
      .select('id')
      .eq('category_key', categoryKey)
      .single();

    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      throw categoryError;
    }

    let query = supabase
      .from('toolkit_items')
      .select(`
        *,
        category:toolkit_categories!toolkit_items_category_id_fkey(*),
        user_unlock:user_toolkit_unlocks!left(*)
      `)
      .eq('category_id', categoryData.id)
      .eq('is_active', true)
      .order('name');

    // If user is logged in, filter unlocks by user
    if (userId) {
      query = query.eq('user_unlock.user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching toolkit items by category:', error);
      throw error;
    }

    // Transform the data to match our interface
    return (data || []).map(item => ({
      ...item,
      user_unlock: item.user_unlock?.[0] || null
    }));
  }

  // Unlock a toolkit item for a user
  static async unlockToolkitItem(userId: string, itemId: string): Promise<UserToolkitUnlock> {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_toolkit_unlocks')
      .select()
      .eq('user_id', userId)
      .eq('toolkit_item_id', itemId)
      .maybeSingle();

    if (existing) {
      // Already unlocked, return existing record
      return existing;
    }

    // Insert new unlock record
    const { data, error } = await supabase
      .from('user_toolkit_unlocks')
      .insert({
        user_id: userId,
        toolkit_item_id: itemId
      })
      .select()
      .single();

    if (error) {
      console.error('Error unlocking toolkit item:', error);
      throw error;
    }

    return data;
  }

  // Get user's achievements
  static async getUserAchievements(userId: string): Promise<ToolkitAchievement[]> {
    const { data, error } = await supabase
      .from('toolkit_achievements')
      .select(`
        *,
        user_progress:user_toolkit_achievements!left(*)
      `)
      .order('order_index');

    if (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }

    // Transform the data to match our interface
    return (data || []).map(achievement => ({
      ...achievement,
      user_progress: achievement.user_progress?.find(
        (p: any) => p.user_id === userId
      ) || null
    }));
  }

  // Get toolkit statistics for a user
  static async getUserToolkitStats(userId: string): Promise<{
    totalTools: number;
    unlockedTools: number;
    totalDownloads: number;
    categoriesExplored: number;
    averageRating: number;
  }> {
    // Get total tools count
    const { count: totalTools } = await supabase
      .from('toolkit_items')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get user statistics
    const { data: userStats } = await supabase
      .from('user_toolkit_unlocks')
      .select(`
        id,
        download_count,
        rating,
        toolkit_item:toolkit_items!user_toolkit_unlocks_toolkit_item_id_fkey(
          category_id
        )
      `)
      .eq('user_id', userId);

    const unlockedTools = userStats?.length || 0;
    const totalDownloads = userStats?.reduce((sum, unlock) => sum + unlock.download_count, 0) || 0;
    const categoriesExplored = new Set(userStats?.map(u => u.toolkit_item?.category_id)).size;
    const ratings = userStats?.filter(u => u.rating).map(u => u.rating) || [];
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    return {
      totalTools: totalTools || 0,
      unlockedTools,
      totalDownloads,
      categoriesExplored,
      averageRating
    };
  }

  // Search toolkit items
  static async searchToolkitItems(searchQuery: string, userId?: string): Promise<ToolkitItem[]> {
    let query = supabase
      .from('toolkit_items')
      .select(`
        *,
        category:toolkit_categories!toolkit_items_category_id_fkey(*),
        user_unlock:user_toolkit_unlocks!left(*)
      `)
      .eq('is_active', true)
      .ilike('name', `%${searchQuery}%`)
      .order('name');

    // If user is logged in, filter unlocks by user
    if (userId) {
      query = query.eq('user_unlock.user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching toolkit items:', error);
      throw error;
    }

    // Transform the data to match our interface
    return (data || []).map(item => ({
      ...item,
      user_unlock: item.user_unlock?.[0] || null
    }));
  }

  // Unlock journey-specific toolkit items
  static async unlockJourneyRewards(userId: string, journeyId: 'maya-pace' | 'maya-tone-mastery', userContent?: any): Promise<void> {
    try {
      // Get journey-specific toolkit items
      const { data: items, error } = await supabase
        .from('toolkit_items')
        .select('id, name, metadata')
        .eq('is_active', true)
        .contains('metadata', { journey_id: journeyId });

      if (error) {
        console.error('Error fetching journey items:', error);
        throw error;
      }

      // Unlock each journey item
      for (const item of items || []) {
        await this.unlockToolkitItem(userId, item.id);
      }

      // If user content is provided, create personalized template
      if (userContent) {
        await this.createPersonalizedTemplate(userId, journeyId, userContent);
      }

      console.log(`Unlocked ${items?.length || 0} toolkit items for journey: ${journeyId}`);
    } catch (error) {
      console.error('Error unlocking journey rewards:', error);
      throw error;
    }
  }

  // Create personalized template from user's journey work
  static async createPersonalizedTemplate(userId: string, journeyId: string, userContent: any): Promise<void> {
    try {
      // Get personalized templates category
      const { data: category, error: categoryError } = await supabase
        .from('toolkit_categories')
        .select('id')
        .eq('category_key', 'personalized-templates')
        .maybeSingle();

      if (categoryError || !category) {
        console.error('Error fetching personalized templates category:', categoryError);
        return; // Don't throw, just skip personalized template creation
      }

      // Create personalized template name
      const templateName = journeyId === 'maya-pace' 
        ? 'My PACE Framework Template'
        : 'My Tone Mastery Template';

      // Check if template already exists
      const { data: existing } = await supabase
        .from('toolkit_items')
        .select('id')
        .eq('name', templateName)
        .eq('category_id', category.id)
        .maybeSingle();

      if (existing) {
        console.log('Personalized template already exists');
        return;
      }

      // Create personalized template
      const { error } = await supabase
        .from('toolkit_items')
        .insert({
          name: templateName,
          category_id: category.id,
          description: `Your personalized template created from completing ${journeyId === 'maya-pace' ? 'Maya\'s PACE Framework Journey' : 'Maya\'s Tone Mastery Workshop'}.`,
          file_type: 'personalized_template',
          is_new: true,
          is_featured: false,
          is_premium: false,
          is_active: true,
          metadata: {
            journey_id: journeyId,
            created_by: userId,
            user_content: userContent,
            created_at: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error creating personalized template:', error);
      } else {
        console.log(`Created personalized template: ${templateName}`);
      }
    } catch (error) {
      console.error('Error creating personalized template:', error);
    }
  }
}