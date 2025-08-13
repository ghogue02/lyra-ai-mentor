import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter3Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'mission-story-creator',
      title: 'Mission Story Creator',
      description: 'Discover your organization\'s unique narrative voice with Sofia Martinez',
      iconType: 'mission' as const,
      route: '/chapter/3/interactive/mission-story-creator',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'storytelling',
      tags: ['narrative', 'voice', 'mission']
    },
    {
      id: 'voice-discovery',
      title: 'Voice Discovery Workshop',
      description: 'Master the art of compelling storytelling with AI-powered story building',
      iconType: 'communication' as const,
      route: '/chapter/3/interactive/voice-discovery',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'workshop',
      tags: ['voice', 'AI', 'building']
    },
    {
      id: 'story-breakthrough',
      title: 'Story Breakthrough Lab',
      description: 'Create stunning presentations with AI-generated visual assets',
      iconType: 'achievement' as const,
      route: '/chapter/3/interactive/story-breakthrough',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'lab',
      tags: ['presentations', 'visual', 'AI']
    },
    {
      id: 'impact-scaling',
      title: 'Impact Scaling Mastery',
      description: 'Use AI to analyze and connect with different audience types',
      iconType: 'network' as const,
      route: '/chapter/3/interactive/impact-scaling',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'mastery',
      tags: ['audience', 'scaling', 'impact']
    },
    {
      id: 'decision-matrix',
      title: 'Decision Matrix',
      description: 'Evaluate and prioritize storytelling initiatives with weighted criteria',
      iconType: 'achievement' as const,
      route: '/chapter/3/interactive/decision-matrix',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'workshop',
      tags: ['decision', 'prioritization', 'matrix']
    },
    {
      id: 'team-capacity',
      title: 'Team Capacity Calculator',
      description: 'Validate feasibility and optimize workload for upcoming campaigns',
      iconType: 'growth' as const,
      route: '/chapter/3/interactive/team-capacity',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'tool',
      tags: ['capacity', 'workload', 'planning']
    },
    {
      id: 'project-charter',
      title: 'Project Charter',
      description: 'Draft a clear charter with AI-marked placeholders to review',
      iconType: 'mission' as const,
      route: '/chapter/3/interactive/project-charter',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'builder',
      tags: ['charter', 'planning', 'AI Generated']
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={3}
      title="Sofia's Storytelling Mastery"
      description="Follow Sofia Martinez as she transforms from basic communications to compelling storytelling mastery. Each micro-lesson builds on her journey at Hope Gardens Community Center, showing you AI-powered techniques for crafting narratives that move hearts and minds."
      characterName="Sofia"
      characterType="sofia"
      bgGradient="from-rose-50 via-white to-purple-50"
      microLessons={microLessons}
      completionRoute="/chapter/3/interactive/storytelling-completion"
    />
  );
};

export default Chapter3Hub;