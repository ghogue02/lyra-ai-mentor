import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter3Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'mission-story-creator',
      title: 'Mission Story Creator',
      description: 'Discover your organization\'s unique narrative voice with Sofia Martinez',
      iconType: 'mission' as const,
      route: '/chapter/3/sofia-mission-story-creator',
      estimated_time: '12 min',
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
      route: '/chapter/3/sofia-voice-discovery',
      estimated_time: '15 min',
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
      route: '/chapter/3/sofia-story-breakthrough',
      estimated_time: '18 min',
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
      route: '/chapter/3/sofia-impact-scaling',
      estimated_time: '16 min',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'mastery',
      tags: ['audience', 'scaling', 'impact']
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={3}
      title="Sofia's Storytelling Mastery"
      description="Follow Sofia Martinez as she transforms from basic communications to compelling storytelling mastery. Each micro-lesson builds on her journey at Hope Gardens Community Center, showing you AI-powered techniques for crafting narratives that move hearts and minds."
      characterName="Sofia"
      characterType="sofia"
      microLessons={microLessons}
      completionRoute="/chapter/3/interactive/sofia-storytelling"
    />
  );
};

export default Chapter3Hub;