import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter6Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'alex-leadership-challenges',
      title: 'Meet Alex & Leadership Challenges',
      description: 'Navigate the complexities of leading AI transformation in nonprofits',
      iconType: 'mission' as const,
      route: '/chapter/6/interactive/alex-leadership-challenges',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'challenges',
      tags: ['leadership', 'challenges', 'transformation']
    },
    {
      id: 'vision-building',
      title: 'Vision Building Workshop',
      description: 'Create compelling AI transformation visions with strategic facilitation',
      iconType: 'achievement' as const,
      route: '/chapter/6/interactive/vision-building',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'workshop',
      tags: ['vision', 'building', 'strategic']
    },
    {
      id: 'transformation-planning',
      title: 'Transformation Planning Lab',
      description: 'Design comprehensive change management strategies with AI guidance',
      iconType: 'growth' as const,
      route: '/chapter/6/interactive/transformation-planning',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'lab',
      tags: ['transformation', 'planning', 'change']
    },
    {
      id: 'team-alignment',
      title: 'Team Alignment Mastery',
      description: 'Unite your organization around AI adoption with communication tools',
      iconType: 'network' as const,
      route: '/chapter/6/interactive/team-alignment',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'mastery',
      tags: ['team', 'alignment', 'communication']
    },
    {
      id: 'future-leadership',
      title: 'Future Leadership Strategy',
      description: 'Build a sustainable AI-powered organizational roadmap for lasting impact',
      iconType: 'achievement' as const,
      route: '/chapter/6/interactive/future-leadership',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'strategy',
      tags: ['future', 'leadership', 'roadmap']
    },
    {
      id: 'leadership-framework',
      title: 'Leadership Framework Mastery',
      description: 'Develop comprehensive AI leadership skills for lasting organizational transformation',
      iconType: 'mission' as const,
      route: '/chapter/6/interactive/leadership-framework',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'framework',
      tags: ['leadership', 'framework', 'comprehensive']
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={6}
      title="Alex's AI Leadership Mastery"
      description="Follow Alex Rivera as they lead their organization through comprehensive AI transformation. Each micro-lesson builds on their journey at National Advocacy Coalition, showing you proven strategies for building vision, managing change, and creating sustainable AI adoption that amplifies your nonprofit's mission."
      characterName="Alex"
      characterType="alex"
      bgGradient="from-indigo-50 via-white to-violet-50"
      microLessons={microLessons}
      completionRoute="/chapter/6/interactive/leadership-completion"
    />
  );
};

export default Chapter6Hub;