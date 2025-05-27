
import { supabase } from '@/integrations/supabase/client';

// Simplified icon categories using only existing icons in Supabase Storage
export const SUPABASE_ICONS = {
  // Core application icons
  lyraAvatar: 'lyra-avatar.png',
  heroMain: 'hero-main.png',
  dashboardMeditation: 'dashboard-meditation.png',
  
  // Navbar and branding (using existing icons)
  navbar: {
    logo: 'lyra-avatar.png', // fallback to lyra avatar
    logoCompact: 'lyra-avatar.png'
  },
  
  // Lyra expressions (simplified to use existing icons)
  lyra: {
    default: 'lyra-avatar.png',
    thinking: 'lyra-avatar.png',
    celebrating: 'lyra-avatar.png',
    helping: 'lyra-avatar.png',
    loading: 'lyra-avatar.png'
  },
  
  // User role specific avatars (using existing icons only)
  userRoles: {
    fundraising: 'user-role-it.png', // fallback to existing role icon
    programs: 'user-role-marketing.png', // fallback to existing role icon
    operations: 'user-role-it.png',
    marketing: 'user-role-marketing.png', // using existing icon
    it: 'user-role-it.png', // using existing icon
    leadership: 'user-role-marketing.png', // fallback
    other: 'user-role-it.png' // fallback
  },
  
  // Chapter icons (mapped to existing icons)
  chapters: {
    1: 'lyra-avatar.png',
    2: 'learning-target.png',
    3: 'data-analytics.png',
    4: 'mission-heart.png',
    5: 'network-connection.png',
    6: 'workflow-process.png',
    7: 'data-analytics.png',
    8: 'communication.png',
    9: 'achievement-trophy.png',
    10: 'growth-plant.png'
  },
  
  // UI state icons (using existing icons as fallbacks)
  uiStates: {
    loading: 'lyra-avatar.png',
    errorFriendly: 'lyra-avatar.png',
    successCompletion: 'achievement-trophy.png',
    emptyWelcome: 'hero-main.png',
    lockState: 'lyra-avatar.png'
  },
  
  // Achievement badges (using existing trophy icon)
  achievements: {
    firstChapter: 'achievement-trophy.png',
    courseComplete: 'achievement-trophy.png',
    profileComplete: 'achievement-trophy.png'
  },
  
  // Onboarding and progress icons (using existing icons)
  onboarding: {
    profileCompletion: 'lyra-avatar.png',
    welcome: 'hero-main.png',
    progress: 'learning-target.png'
  },
  
  // Feature icons (all existing)
  features: {
    learningTarget: 'learning-target.png',
    missionHeart: 'mission-heart.png',
    achievementTrophy: 'achievement-trophy.png',
    networkConnection: 'network-connection.png',
    workflowProcess: 'workflow-process.png',
    dataAnalytics: 'data-analytics.png',
    communication: 'communication.png',
    growthPlant: 'growth-plant.png',
    successCelebration: 'achievement-trophy.png'
  }
} as const;

/**
 * Get the full Supabase Storage URL for an icon with error handling
 */
export const getSupabaseIconUrl = (iconPath: string): string => {
  try {
    const { data } = supabase.storage
      .from('app-icons')
      .getPublicUrl(iconPath);
    
    return data.publicUrl;
  } catch (error) {
    console.warn(`Failed to get icon URL for: ${iconPath}`, error);
    // Return a fallback to lyra-avatar if there's an error
    const { data } = supabase.storage
      .from('app-icons')
      .getPublicUrl('lyra-avatar.png');
    return data.publicUrl;
  }
};

/**
 * Get chapter icon URL by chapter ID with fallback
 */
export const getChapterIconUrl = (chapterId: number): string => {
  const iconPath = SUPABASE_ICONS.chapters[chapterId as keyof typeof SUPABASE_ICONS.chapters] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get feature icon URL by feature name with fallback
 */
export const getFeatureIconUrl = (featureName: keyof typeof SUPABASE_ICONS.features): string => {
  const iconPath = SUPABASE_ICONS.features[featureName] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get onboarding icon URL by step name with fallback
 */
export const getOnboardingIconUrl = (stepName: keyof typeof SUPABASE_ICONS.onboarding): string => {
  const iconPath = SUPABASE_ICONS.onboarding[stepName] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get Lyra expression icon URL by state with fallback
 */
export const getLyraIconUrl = (state: keyof typeof SUPABASE_ICONS.lyra = 'default'): string => {
  const iconPath = SUPABASE_ICONS.lyra[state] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get user role avatar URL by role with fallback
 */
export const getUserRoleIconUrl = (role: keyof typeof SUPABASE_ICONS.userRoles): string => {
  const iconPath = SUPABASE_ICONS.userRoles[role] || SUPABASE_ICONS.userRoles.it;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get UI state icon URL by state with fallback
 */
export const getUIStateIconUrl = (state: keyof typeof SUPABASE_ICONS.uiStates): string => {
  const iconPath = SUPABASE_ICONS.uiStates[state] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get achievement badge URL by achievement type with fallback
 */
export const getAchievementIconUrl = (achievement: keyof typeof SUPABASE_ICONS.achievements): string => {
  const iconPath = SUPABASE_ICONS.achievements[achievement] || SUPABASE_ICONS.features.achievementTrophy;
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get navbar icon URL by type with fallback
 */
export const getNavbarIconUrl = (type: keyof typeof SUPABASE_ICONS.navbar): string => {
  const iconPath = SUPABASE_ICONS.navbar[type] || SUPABASE_ICONS.lyraAvatar;
  return getSupabaseIconUrl(iconPath);
};
