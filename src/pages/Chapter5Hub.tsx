import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter5Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'rachel-automation-vision',
      title: 'Meet Rachel & Automation Vision',
      description: 'Discover how to map and automate your nonprofit\'s key processes',
      iconType: 'workflow' as const,
      route: '/chapter/5/interactive/rachel-automation-vision',
      estimated_time: '14 min',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'vision',
      tags: ['automation', 'mapping', 'processes']
    },
    {
      id: 'human-centered-design',
      title: 'Human-Centered Design Workshop',
      description: 'Build automation that enhances rather than replaces human connection',
      iconType: 'communication' as const,
      route: '/chapter/5/interactive/human-centered-design',
      estimated_time: '16 min',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'workshop',
      tags: ['human-centered', 'design', 'connection']
    },
    {
      id: 'automation-planning',
      title: 'Automation Planning Lab',
      description: 'Create step-by-step implementation roadmaps with AI guidance',
      iconType: 'growth' as const,
      route: '/chapter/5/interactive/automation-planning',
      estimated_time: '20 min',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'lab',
      tags: ['planning', 'roadmaps', 'AI']
    },
    {
      id: 'change-management',
      title: 'Change Management Mastery',
      description: 'Lead organizational transformation with AI-powered communication',
      iconType: 'achievement' as const,
      route: '/chapter/5/interactive/workflow-design',
      estimated_time: '18 min',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'mastery',
      tags: ['change', 'management', 'transformation']
    },
    {
      id: 'scaling-systems',
      title: 'Scaling Systems Strategy',
      description: 'Build a comprehensive AI automation ecosystem for your organization',
      iconType: 'data' as const,
      route: '/chapter/5/interactive/scaling-systems',
      estimated_time: '25 min',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'strategy',
      tags: ['scaling', 'systems', 'ecosystem']
    },
    {
      id: 'ecosystem-builder',
      title: 'Ecosystem Builder',
      description: 'Create comprehensive AI ecosystem for lasting organizational transformation',
      iconType: 'workflow' as const,
      route: '/chapter/5/interactive/ecosystem-builder',
      estimated_time: '28 min',
      difficulty: 'Advanced' as const,
      completed: false,
      unlocked: true,
      progress: 0,
      category: 'ecosystem',
      tags: ['ecosystem', 'transformation', 'comprehensive']
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={5}
      title="Rachel's Workflow Automation Mastery"
      description="Follow Rachel Thompson as she transforms chaotic manual processes into streamlined, human-centered workflows. Each micro-lesson builds on her journey at Green Future Alliance, showing you AI-powered techniques for automation that enhances rather than replaces human connection."
      characterName="Rachel"
      characterType="rachel"
      bgGradient="from-teal-50 via-white to-emerald-50"
      microLessons={microLessons}
      completionRoute="/chapter/5/interactive/automation-completion"
    />
  );
};

export default Chapter5Hub;