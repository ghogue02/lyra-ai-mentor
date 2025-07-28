import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter4Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'david-data-foundations',
      title: 'Meet David & Data Foundations',
      description: 'Transform raw nonprofit data into compelling impact narratives',
      iconType: 'data' as const,
      route: '/chapter/4/interactive/david-data-foundations',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'foundations',
      tags: ['data', 'foundations', 'impact']
    },
    {
      id: 'visual-storytelling',
      title: 'Visual Storytelling Workshop',
      description: 'Create stunning data visualizations that communicate impact clearly',
      iconType: 'achievement' as const,
      route: '/chapter/4/interactive/visual-storytelling',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'workshop',
      tags: ['visual', 'storytelling', 'visualization']
    },
    {
      id: 'narrative-construction',
      title: 'Data Narrative Construction Lab',
      description: 'Build compelling stories from complex datasets with AI assistance',
      iconType: 'growth' as const,
      route: '/chapter/4/interactive/data-revival',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'lab',
      tags: ['narrative', 'construction', 'AI']
    },
    {
      id: 'stakeholder-communication',
      title: 'Stakeholder Communication Mastery',
      description: 'Tailor data presentations for different audience types and contexts',
      iconType: 'communication' as const,
      route: '/chapter/4/interactive/stakeholder-communication',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'mastery',
      tags: ['stakeholder', 'communication', 'presentation']
    },
    {
      id: 'predictive-insights',
      title: 'Predictive Insights Strategy',
      description: 'Use AI to forecast trends and create forward-looking impact reports',
      iconType: 'data' as const,
      route: '/chapter/4/interactive/predictive-insights',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'strategy',
      tags: ['predictive', 'insights', 'AI']
    },
    {
      id: 'data-ecosystem',
      title: 'Data Ecosystem Builder',
      description: 'Create comprehensive data systems for ongoing impact measurement',
      iconType: 'data' as const,
      route: '/chapter/4/interactive/data-ecosystem',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'ecosystem',
      tags: ['ecosystem', 'systems', 'measurement']
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={4}
      title="David's Data Storytelling Mastery"
      description="Follow David Chen as he transforms from spreadsheet overwhelm to data storytelling mastery. Each micro-lesson builds on his journey at Riverside Children's Foundation, showing you AI-powered techniques for turning complex data into compelling impact narratives."
      characterName="David"
      characterType="david"
      bgGradient="from-blue-50 via-white to-cyan-50"
      microLessons={microLessons}
      completionRoute="/chapter/4/interactive/data-storytelling-completion"
    />
  );
};

export default Chapter4Hub;