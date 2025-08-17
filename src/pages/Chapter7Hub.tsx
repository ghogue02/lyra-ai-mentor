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
      progress: 0,
      category: 'recruitment',
      tags: ['hiring', 'screening', 'AI-powered']
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
      progress: 0,
      category: 'workshop',
      tags: ['performance', 'analytics', 'development']
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
      progress: 0,
      category: 'lab',
      tags: ['engagement', 'personalization', 'analytics']
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
      progress: 0,
      category: 'mastery',
      tags: ['retention', 'strategy', 'human-centered']
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={7}
      title="Carmen's AI-Powered People Management"
      description="Join Carmen Rodriguez as she revolutionizes HR practices by blending AI efficiency with human empathy. Learn to transform recruitment, performance management, and employee engagement while ensuring every person feels valued and heard."
      characterName="Carmen"
      characterType="alex"
      bgGradient="from-orange-50 via-white to-amber-50"
      microLessons={microLessons}
      completionRoute="/chapter/7/interactive/people-management-completion"
    />
  );
};

export default Chapter7Hub;