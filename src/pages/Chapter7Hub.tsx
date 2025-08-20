import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter7Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'talent-acquisition',
      title: 'AI-Powered Talent Acquisition',
      description: 'Transform your hiring process with Carmen\'s compassionate approach to AI-enhanced recruitment',
      iconType: 'mission' as const,
      route: '/chapter/7/interactive/talent-acquisition',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0
    },
    {
      id: 'performance-insights',
      title: 'Performance Insights Workshop',
      description: 'Master data-driven performance management while maintaining human connection',
      iconType: 'communication' as const,
      route: '/chapter/7/interactive/performance-insights',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0
    },
    {
      id: 'engagement-builder',
      title: 'Employee Engagement Builder',
      description: 'Create personalized engagement strategies using AI-powered people analytics',
      iconType: 'achievement' as const,
      route: '/chapter/7/interactive/engagement-builder',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0
    },
    {
      id: 'retention-mastery',
      title: 'Retention Strategy Mastery',
      description: 'Develop AI-enhanced retention strategies that honor both data and humanity',
      iconType: 'network' as const,
      route: '/chapter/7/interactive/retention-mastery',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0
    },
    {
      id: 'team-dynamics',
      title: 'Team Dynamics Optimizer',
      description: 'Build stronger, more cohesive teams using AI-powered insights and human understanding',
      iconType: 'achievement' as const,
      route: '/chapter/7/interactive/team-dynamics',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0
    },
    {
      id: 'cultural-intelligence',
      title: 'Cultural Intelligence Hub',
      description: 'Foster inclusive workplace cultures by combining AI analytics with cultural sensitivity',
      iconType: 'growth' as const,
      route: '/chapter/7/interactive/cultural-intelligence',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0
    },
    {
      id: 'leadership-development',
      title: 'Leadership Development Lab',
      description: 'Develop next-generation leaders using personalized AI coaching and human mentorship',
      iconType: 'mission' as const,
      route: '/chapter/7/interactive/leadership-development',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={7}
      title="Carmen's AI-Powered People Management"
      description="Join Carmen Rodriguez as she revolutionizes HR practices by blending AI efficiency with human empathy. Learn to transform recruitment, performance management, and employee engagement while ensuring every person feels valued and heard."
      characterName="Carmen"
      characterType="carmen"
      bgGradient="from-orange-50 via-white to-amber-50"
      microLessons={microLessons}
      completionRoute="/chapter/7/interactive/people-management-completion"
    />
  );
};

export default Chapter7Hub;