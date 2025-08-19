import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterHubLayout } from '@/components/chapter/ChapterHubLayout';

const Chapter7Hub: React.FC = () => {
  const navigate = useNavigate();
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
      tags: ['hiring', 'screening', 'AI-powered'],
      estimatedTime: '15-20 min'
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
      tags: ['performance', 'analytics', 'development'],
      estimatedTime: '20-25 min'
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
      tags: ['engagement', 'personalization', 'analytics'],
      estimatedTime: '25-30 min'
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
      tags: ['retention', 'strategy', 'human-centered'],
      estimatedTime: '30-35 min'
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
      progress: 0,
      category: 'optimization',
      tags: ['teamwork', 'collaboration', 'dynamics'],
      estimatedTime: '20-25 min'
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
      progress: 0,
      category: 'culture',
      tags: ['diversity', 'inclusion', 'cultural-awareness'],
      estimatedTime: '30-35 min'
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
      progress: 0,
      category: 'development',
      tags: ['leadership', 'coaching', 'development'],
      estimatedTime: '35-40 min'
    }
  ];

  const handleLessonSelect = (lesson: any) => {
    navigate(lesson.route);
  };

  const completedCount = microLessons.filter(lesson => lesson.completed).length;

  return (
    <ChapterHubLayout
      title="Carmen's AI-Powered People Management"
      description="Join Carmen Rodriguez as she revolutionizes HR practices by blending AI efficiency with human empathy. Learn to transform recruitment, performance management, and employee engagement while ensuring every person feels valued and heard."
      characterName="Carmen"
      microLessons={microLessons}
      onLessonSelect={handleLessonSelect}
      completedCount={completedCount}
      totalCount={microLessons.length}
    />
  );
};

export default Chapter7Hub;