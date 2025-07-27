import React from 'react';
import { EnhancedChapterHub } from '@/components/chapter/EnhancedChapterHub';

const Chapter1Hub: React.FC = () => {
  const microLessons = [
    {
      id: 'lyra-foundations',
      title: 'Meet Lyra & AI Foundations',
      description: 'Your first AI companion and the fundamentals that will change everything',
      iconType: 'learning' as const,
      estimated_time: '10 min',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      route: '/chapter/1/interactive/lyra-foundations'
    },
    {
      id: 'prompting-fundamentals',
      title: 'AI Prompting Fundamentals',
      description: 'Master the art of communicating with AI for powerful results',
      iconType: 'communication' as const,
      estimated_time: '12 min',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      route: '/chapter/1/interactive/prompting-fundamentals'
    },
    {
      id: 'understanding-models',
      title: 'Understanding AI Models',
      description: 'Discover different AI types and choose the right tool for each task',
      iconType: 'data' as const,
      estimated_time: '15 min',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      route: '/chapter/1/interactive/understanding-models'
    },
    {
      id: 'ai-ethics',
      title: 'AI Ethics for Nonprofits',
      description: 'Navigate responsible AI use in mission-driven organizations',
      iconType: 'ethics' as const,
      estimated_time: '14 min',
      difficulty: 'Intermediate' as const,
      completed: false,
      unlocked: true,
      route: '/chapter/1/interactive/ai-ethics'
    },
    {
      id: 'ai-toolkit-setup',
      title: 'Setting Up Your AI Toolkit',
      description: 'Build your personal AI workspace for maximum productivity',
      iconType: 'workflow' as const,
      estimated_time: '18 min',
      difficulty: 'Beginner' as const,
      completed: false,
      unlocked: true,
      route: '/chapter/1/interactive/ai-toolkit-setup'
    }
  ];

  return (
    <EnhancedChapterHub
      chapterNumber={1}
      title="AI Foundations with Lyra"
      description="Meet Lyra, your AI learning companion who will guide you through the essential foundations of artificial intelligence. Together, you'll build confidence with AI tools, understand best practices, and create your personal AI toolkit for transforming your nonprofit work."
      characterName="Lyra"
      characterType="lyra"
      microLessons={microLessons}
      bgGradient="from-cyan-50 via-white to-purple-50"
      completionRoute="/chapter/1/interactive/lyra-foundations"
    />
  );
};

export default Chapter1Hub;