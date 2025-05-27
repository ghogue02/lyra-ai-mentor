import { supabase } from '@/integrations/supabase/client';

// Simplified icon categories using only existing icons in Supabase Storage
export const SUPABASE_ICONS = {
  // Core application icons
  lyraAvatar: 'lyra-avatar.png',
  heroMain: 'hero-main.png',
  dashboardMeditation: 'dashboard-meditation.png',
  
  // Navbar and branding (using uploaded navbar logo)
  navbar: {
    logo: 'navbar-logo.png', // now using the uploaded brain/lightbulb logo
    logoCompact: 'navbar-logo.png'
  },
  
  // Lyra expressions (using specialized icons)
  lyra: {
    default: 'lyra-avatar.png',
    thinking: 'lyra-thinking.png',
    celebrating: 'lyra-celebrating.png',
    helping: 'lyra-helping.png',
    loading: 'lyra-avatar.png'
  },
  
  // User role specific avatars (using correct role-specific icons)
  userRoles: {
    fundraising: 'user-role-fundraising.png',
    programs: 'user-role-programs.png',
    operations: 'user-role-operations.png',
    marketing: 'user-role-marketing.png',
    it: 'user-role-it.png',
    leadership: 'user-role-leadership.png',
    other: 'user-role-other.png'
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
  
  // UI state icons (using specialized icons)
  uiStates: {
    loading: 'lyra-avatar.png',
    errorFriendly: 'lyra-avatar.png',
    successCompletion: 'badge-course-complete.png',
    emptyWelcome: 'onboarding-welcome.png',
    lockState: 'lyra-avatar.png'
  },
  
  // Achievement badges (using specialized badge icons)
  achievements: {
    firstChapter: 'badge-first-chapter.png',
    courseComplete: 'badge-course-complete.png',
    profileComplete: 'achievement-trophy.png'
  },
  
  // Onboarding and progress icons (using specialized icons)
  onboarding: {
    profileCompletion: 'onboarding-profile.png',
    welcome: 'onboarding-welcome.png',
    progress: 'chapter-progress.png'
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

// Role-specific messaging and examples
export const ROLE_MESSAGING = {
  fundraising: {
    examples: 'AI for grant writing and donor research',
    successMetric: 'Increase funding efficiency by 40%',
    welcomeMessage: 'Master AI tools for fundraising success'
  },
  programs: {
    examples: 'AI for program evaluation and service delivery',
    successMetric: 'Improve program outcomes tracking',
    welcomeMessage: 'Enhance your programs with AI insights'
  },
  operations: {
    examples: 'AI for workflow optimization and admin tasks',
    successMetric: 'Reduce administrative overhead by 30%',
    welcomeMessage: 'Streamline operations with AI automation'
  },
  marketing: {
    examples: 'AI for content creation and audience engagement',
    successMetric: 'Double your content output quality',
    welcomeMessage: 'Amplify your mission with AI-powered marketing'
  },
  it: {
    examples: 'AI for system optimization and tech implementation',
    successMetric: 'Accelerate digital transformation',
    welcomeMessage: 'Lead your organization\'s AI adoption'
  },
  leadership: {
    examples: 'AI for strategic planning and decision making',
    successMetric: 'Make data-driven strategic decisions',
    welcomeMessage: 'Guide your organization into the AI era'
  },
  other: {
    examples: 'AI tools tailored to your unique role',
    successMetric: 'Enhance your impact with AI',
    welcomeMessage: 'Discover AI applications for your work'
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
    
    // Add cache busting parameter to force refresh for updated files
    const url = new URL(data.publicUrl);
    url.searchParams.set('t', Date.now().toString());
    
    return url.toString();
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
 * Get role-specific onboarding icon URL
 */
export const getRoleOnboardingIconUrl = (role: string): string => {
  const iconPath = SUPABASE_ICONS.userRoles[role as keyof typeof SUPABASE_ICONS.userRoles] || SUPABASE_ICONS.onboarding.profileCompletion;
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

/**
 * Get role-specific messaging
 */
export const getRoleMessaging = (role: string) => {
  return ROLE_MESSAGING[role as keyof typeof ROLE_MESSAGING] || ROLE_MESSAGING.other;
};
