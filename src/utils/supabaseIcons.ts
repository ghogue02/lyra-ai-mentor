
import { supabase } from '@/integrations/supabase/client';

// Icon categories and their corresponding file names in Supabase Storage
export const SUPABASE_ICONS = {
  // Core application icons
  lyraAvatar: 'lyra-avatar.png',
  heroMain: 'hero-main.png',
  dashboardMeditation: 'dashboard-meditation.png',
  
  // Chapter icons (mapped by chapter ID)
  chapters: {
    1: 'lyra-avatar.png',          // What Is AI Anyway?
    2: 'learning-target.png',      // How Machines Learn
    3: 'data-analytics.png',       // From Data to Insight
    4: 'mission-heart.png',        // AI Ethics & Impact
    5: 'network-connection.png',   // Non-Profit Playbook
    6: 'workflow-process.png',     // Your Action Plan
    7: 'data-analytics.png',       // Advanced Analytics
    8: 'communication.png',        // Communication & Outreach
    9: 'achievement-trophy.png',   // Security & Privacy
    10: 'growth-plant.png'         // Growth & Scaling
  },
  
  // Onboarding and progress icons
  onboarding: {
    profileCompletion: 'profile-completion.png',
    welcome: 'onboarding-welcome.png',
    progress: 'chapter-progress.png'
  },
  
  // Feature icons
  features: {
    learningTarget: 'learning-target.png',
    missionHeart: 'mission-heart.png',
    achievementTrophy: 'achievement-trophy.png',
    networkConnection: 'network-connection.png',
    workflowProcess: 'workflow-process.png',
    dataAnalytics: 'data-analytics.png',
    communication: 'communication.png',
    growthPlant: 'growth-plant.png',
    successCelebration: 'success-celebration.png'
  }
} as const;

/**
 * Get the full Supabase Storage URL for an icon
 */
export const getSupabaseIconUrl = (iconPath: string): string => {
  const { data } = supabase.storage
    .from('app-icons')
    .getPublicUrl(iconPath);
  
  return data.publicUrl;
};

/**
 * Get chapter icon URL by chapter ID
 */
export const getChapterIconUrl = (chapterId: number): string => {
  const iconPath = SUPABASE_ICONS.chapters[chapterId as keyof typeof SUPABASE_ICONS.chapters] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get feature icon URL by feature name
 */
export const getFeatureIconUrl = (featureName: keyof typeof SUPABASE_ICONS.features): string => {
  const iconPath = SUPABASE_ICONS.features[featureName];
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get onboarding icon URL by step name
 */
export const getOnboardingIconUrl = (stepName: keyof typeof SUPABASE_ICONS.onboarding): string => {
  const iconPath = SUPABASE_ICONS.onboarding[stepName];
  return getSupabaseIconUrl(iconPath);
};
