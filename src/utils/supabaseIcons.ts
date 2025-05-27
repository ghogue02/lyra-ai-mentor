
import { supabase } from '@/integrations/supabase/client';

// Enhanced icon categories and their corresponding file names in Supabase Storage
export const SUPABASE_ICONS = {
  // Core application icons
  lyraAvatar: 'lyra-avatar.png',
  heroMain: 'hero-main.png',
  dashboardMeditation: 'dashboard-meditation.png',
  
  // Navbar and branding
  navbar: {
    logo: 'navbar-logo.png',
    logoCompact: 'navbar-logo-compact.png'
  },
  
  // Lyra expressions for different states
  lyra: {
    default: 'lyra-avatar.png',
    thinking: 'lyra-thinking.png',
    celebrating: 'lyra-celebrating.png',
    helping: 'lyra-helping.png',
    loading: 'loading-lyra.png'
  },
  
  // User role specific avatars
  userRoles: {
    fundraising: 'user-role-fundraising.png',
    programs: 'user-role-programs.png',
    operations: 'user-role-operations.png',
    marketing: 'user-role-marketing.png',
    it: 'user-role-it.png',
    leadership: 'user-role-leadership.png',
    other: 'user-role-other.png'
  },
  
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
  
  // UI state icons
  uiStates: {
    loading: 'loading-lyra.png',
    errorFriendly: 'error-state-friendly.png',
    successCompletion: 'success-completion.png',
    emptyWelcome: 'empty-state-welcome.png',
    lockState: 'lock-state.png'
  },
  
  // Achievement badges
  achievements: {
    firstChapter: 'badge-first-chapter.png',
    courseComplete: 'badge-course-complete.png',
    profileComplete: 'badge-profile-complete.png'
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

/**
 * Get Lyra expression icon URL by state
 */
export const getLyraIconUrl = (state: keyof typeof SUPABASE_ICONS.lyra = 'default'): string => {
  const iconPath = SUPABASE_ICONS.lyra[state];
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get user role avatar URL by role
 */
export const getUserRoleIconUrl = (role: keyof typeof SUPABASE_ICONS.userRoles): string => {
  const iconPath = SUPABASE_ICONS.userRoles[role];
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get UI state icon URL by state
 */
export const getUIStateIconUrl = (state: keyof typeof SUPABASE_ICONS.uiStates): string => {
  const iconPath = SUPABASE_ICONS.uiStates[state];
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get achievement badge URL by achievement type
 */
export const getAchievementIconUrl = (achievement: keyof typeof SUPABASE_ICONS.achievements): string => {
  const iconPath = SUPABASE_ICONS.achievements[achievement];
  return getSupabaseIconUrl(iconPath);
};

/**
 * Get navbar icon URL by type
 */
export const getNavbarIconUrl = (type: keyof typeof SUPABASE_ICONS.navbar): string => {
  const iconPath = SUPABASE_ICONS.navbar[type];
  return getSupabaseIconUrl(iconPath);
};
