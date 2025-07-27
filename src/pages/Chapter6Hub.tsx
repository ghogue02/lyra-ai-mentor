import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter6Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'alex-leadership-challenges',
      title: 'Meet Alex & Leadership Challenges',
      description: 'Navigate the complexities of leading AI transformation in nonprofits',
      iconType: 'mission',
      route: '/chapter/6/interactive/alex-leadership-challenges',
      estimated_time: '15 min',
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
      iconType: 'achievement',
      route: '/chapter/6/interactive/vision-building',
      estimated_time: '18 min',
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
      iconType: 'growth',
      route: '/chapter/6/alex-change-strategy',
      estimated_time: '22 min',
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
      iconType: 'network',
      route: '/chapter/6/alex-vision-builder',
      estimated_time: '20 min',
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
      iconType: 'achievement',
      route: '/chapter/6/alex-roadmap-creator',
      estimated_time: '25 min',
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
      iconType: 'mission',
      route: '/chapter/6/alex-leadership-framework',
      estimated_time: '28 min',
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
      microLessons={microLessons}
      completionRoute="/chapter/6/interactive/alex-leadership"
    />
  );
};

export default Chapter6Hub;