import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter2Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'pace-framework',
      title: 'PACE Framework Foundation',
      description: 'Master the core framework: Purpose → Audience → Context → Execute',
      iconType: 'learning' as const,
      estimated_time: '12 min',
      difficulty: 'Beginner' as const,
      completed: true,
      unlocked: true,
      route: '/chapter/2/interactive/maya-pace'
    },
    {
      id: 'tone-mastery',
      title: 'Tone Mastery Workshop',
      description: 'Adapt your voice for different audiences with confidence and authenticity',
      iconType: 'communication' as const,
      estimated_time: '15 min',
      difficulty: 'Intermediate' as const,
      completed: true,
      unlocked: true,
      route: '/chapter/2/interactive/maya-tone-mastery'
    },
    {
      id: 'template-library',
      title: 'Template Library Builder',
      description: 'Create reusable email templates for organizational efficiency',
      iconType: 'workflow' as const,
      estimated_time: '18 min',
      difficulty: 'Intermediate' as const,
      completed: true,
      unlocked: true,
      route: '/chapter/2/interactive/template-library'
    },
    {
      id: 'difficult-conversations',
      title: 'Difficult Conversations Guide',
      description: 'Handle challenging communications with empathy and skill',
      iconType: 'mission' as const,
      estimated_time: '20 min',
      difficulty: 'Advanced' as const,
      completed: true,
      unlocked: true,
      route: '/chapter/2/interactive/difficult-conversations'
    },
    {
      id: 'subject-workshop',
      title: 'Subject Line Workshop',
      description: 'Craft compelling email openings that get opened and read',
      iconType: 'achievement' as const,
      estimated_time: '14 min',
      difficulty: 'Intermediate' as const,
      completed: true,
      unlocked: true,
      route: '/chapter/2/interactive/subject-workshop'
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={2}
      title="Maya's Communication Mastery"
      description="Follow Maya Rodriguez as she transforms from email overwhelm to confident communication mastery. Each micro-lesson builds on her real experiences at Hope Gardens Community Center, showing you practical techniques that work in the real world of nonprofit communications."
      characterName="Maya"
      characterType="maya"
      microLessons={microLessons}
      bgGradient="from-purple-50 via-white to-pink-50"
      completionRoute="/chapter/2/interactive/maya-pace"
    />
  );
};

export default Chapter2Hub;