import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define the required toolkit categories
const REQUIRED_CATEGORIES = [
  {
    category_key: 'email',
    name: 'Email Templates',
    description: 'Professional email templates for every occasion',
    icon: 'Mail',
    gradient: 'from-blue-500 to-cyan-500',
    order_index: 1
  },
  {
    category_key: 'grants',
    name: 'Grant Proposals',
    description: 'Winning grant proposal templates and guides',
    icon: 'FileText',
    gradient: 'from-purple-500 to-pink-500',
    order_index: 2
  },
  {
    category_key: 'data',
    name: 'Data Visualizations',
    description: 'Interactive charts and data presentation tools',
    icon: 'BarChart3',
    gradient: 'from-green-500 to-emerald-500',
    order_index: 3
  },
  {
    category_key: 'automation',
    name: 'Automation Workflows',
    description: 'Time-saving automation templates',
    icon: 'Workflow',
    gradient: 'from-orange-500 to-red-500',
    order_index: 4
  },
  {
    category_key: 'change',
    name: 'Change Management',
    description: 'Tools for managing organizational change',
    icon: 'Users',
    gradient: 'from-indigo-500 to-purple-500',
    order_index: 5
  },
  {
    category_key: 'social',
    name: 'Social Media Content',
    description: 'Engaging social media templates',
    icon: 'Share2',
    gradient: 'from-pink-500 to-rose-500',
    order_index: 6
  },
  {
    category_key: 'training',
    name: 'Training Materials',
    description: 'Educational resources and training templates',
    icon: 'BookOpen',
    gradient: 'from-teal-500 to-cyan-500',
    order_index: 7
  },
  {
    category_key: 'reports',
    name: 'Reports & Presentations',
    description: 'Professional report and presentation templates',
    icon: 'Presentation',
    gradient: 'from-amber-500 to-orange-500',
    order_index: 8
  }
];

// Define some basic achievements
const REQUIRED_ACHIEVEMENTS = [
  {
    achievement_key: 'first_unlock',
    name: 'First Tool Unlocked',
    description: 'Downloaded your first tool',
    icon: 'Star',
    color: 'text-yellow-500',
    criteria_type: 'unlock_count',
    criteria_value: 1,
    order_index: 1,
    achievement_tier: 'bronze'
  },
  {
    achievement_key: 'category_explorer',
    name: 'Category Explorer',
    description: 'Unlock tools from 3 different categories',
    icon: 'Grid3X3',
    color: 'text-blue-500',
    criteria_type: 'category_count',
    criteria_value: 3,
    order_index: 2,
    achievement_tier: 'silver'
  },
  {
    achievement_key: 'power_user',
    name: 'Power User',
    description: 'Unlock 10 tools',
    icon: 'Zap',
    color: 'text-purple-500',
    criteria_type: 'unlock_count',
    criteria_value: 10,
    order_index: 3,
    achievement_tier: 'gold'
  }
];

export interface EnsureToolkitDataResult {
  success: boolean;
  categoriesCreated: number;
  categoriesUpdated: number;
  achievementsCreated: number;
  errors: string[];
}

/**
 * Ensures all required toolkit categories and achievements exist in the database
 * This is safe to run multiple times (idempotent)
 */
export async function ensureToolkitData(
  supabase: SupabaseClient
): Promise<EnsureToolkitDataResult> {
  const result: EnsureToolkitDataResult = {
    success: true,
    categoriesCreated: 0,
    categoriesUpdated: 0,
    achievementsCreated: 0,
    errors: []
  };

  try {
    // Check and create/update categories
    for (const category of REQUIRED_CATEGORIES) {
      try {
        // Check if category exists
        const { data: existing, error: selectError } = await supabase
          .from('toolkit_categories')
          .select('*')
          .eq('category_key', category.category_key)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          // PGRST116 means no rows found, which is expected
          throw selectError;
        }

        if (!existing) {
          // Create new category
          const { error: insertError } = await supabase
            .from('toolkit_categories')
            .insert(category);

          if (insertError) {
            throw insertError;
          }
          result.categoriesCreated++;
        } else {
          // Check if update is needed
          const needsUpdate = 
            existing.name !== category.name ||
            existing.description !== category.description ||
            existing.icon !== category.icon ||
            existing.gradient !== category.gradient ||
            existing.order_index !== category.order_index;

          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from('toolkit_categories')
              .update({
                name: category.name,
                description: category.description,
                icon: category.icon,
                gradient: category.gradient,
                order_index: category.order_index,
                updated_at: new Date().toISOString()
              })
              .eq('category_key', category.category_key);

            if (updateError) {
              throw updateError;
            }
            result.categoriesUpdated++;
          }
        }
      } catch (error) {
        const errorMessage = `Failed to process category ${category.category_key}: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    // Check and create achievements
    for (const achievement of REQUIRED_ACHIEVEMENTS) {
      try {
        const { data: existing, error: selectError } = await supabase
          .from('toolkit_achievements')
          .select('*')
          .eq('achievement_key', achievement.achievement_key)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          throw selectError;
        }

        if (!existing) {
          const { error: insertError } = await supabase
            .from('toolkit_achievements')
            .insert(achievement);

          if (insertError) {
            throw insertError;
          }
          result.achievementsCreated++;
        }
      } catch (error) {
        const errorMessage = `Failed to process achievement ${achievement.achievement_key}: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    // Create sample items for each category (only if no items exist)
    try {
      const { data: categories } = await supabase
        .from('toolkit_categories')
        .select('id, category_key');

      if (categories) {
        for (const category of categories) {
          // Check if category has any items
          const { count } = await supabase
            .from('toolkit_items')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);

          if (count === 0) {
            // Add a sample item
            const sampleItem = {
              name: `Sample ${category.category_key} Tool`,
              category_id: category.id,
              description: `A sample tool for the ${category.category_key} category`,
              is_active: true
            };

            await supabase
              .from('toolkit_items')
              .insert(sampleItem);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to create sample items:', error);
      // Non-critical error, don't fail the whole operation
    }

    result.success = result.errors.length === 0;
  } catch (error) {
    result.success = false;
    result.errors.push(`General error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * Verifies that all required toolkit data exists
 * Returns true if all data is present, false otherwise
 */
export async function verifyToolkitData(
  supabase: SupabaseClient
): Promise<{ isValid: boolean; missingCategories: string[]; missingAchievements: string[] }> {
  const missingCategories: string[] = [];
  const missingAchievements: string[] = [];

  try {
    // Check categories
    const { data: categories } = await supabase
      .from('toolkit_categories')
      .select('category_key');

    const existingCategoryKeys = new Set(categories?.map(c => c.category_key) || []);
    
    for (const required of REQUIRED_CATEGORIES) {
      if (!existingCategoryKeys.has(required.category_key)) {
        missingCategories.push(required.category_key);
      }
    }

    // Check achievements
    const { data: achievements } = await supabase
      .from('toolkit_achievements')
      .select('achievement_key');

    const existingAchievementKeys = new Set(achievements?.map(a => a.achievement_key) || []);
    
    for (const required of REQUIRED_ACHIEVEMENTS) {
      if (!existingAchievementKeys.has(required.achievement_key)) {
        missingAchievements.push(required.achievement_key);
      }
    }

    return {
      isValid: missingCategories.length === 0 && missingAchievements.length === 0,
      missingCategories,
      missingAchievements
    };
  } catch (error) {
    console.error('Error verifying toolkit data:', error);
    return {
      isValid: false,
      missingCategories: REQUIRED_CATEGORIES.map(c => c.category_key),
      missingAchievements: REQUIRED_ACHIEVEMENTS.map(a => a.achievement_key)
    };
  }
}

/**
 * Get toolkit category statistics
 */
export async function getToolkitStats(
  supabase: SupabaseClient
): Promise<{ categoryStats: Array<{ category_key: string; name: string; item_count: number }> }> {
  try {
    const { data, error } = await supabase
      .from('toolkit_categories')
      .select(`
        category_key,
        name,
        toolkit_items!inner(count)
      `)
      .order('order_index');

    if (error) throw error;

    const categoryStats = data?.map(category => ({
      category_key: category.category_key,
      name: category.name,
      item_count: Array.isArray(category.toolkit_items) ? category.toolkit_items.length : 0
    })) || [];

    return { categoryStats };
  } catch (error) {
    console.error('Error getting toolkit stats:', error);
    return { categoryStats: [] };
  }
}