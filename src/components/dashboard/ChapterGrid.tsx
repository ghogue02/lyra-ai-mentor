
import React from 'react';
import { ChapterCard } from '@/components/ChapterCard';
import { Brain, Settings, Heart, Scale, Target, BookOpen } from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  duration: string;
}

interface ChapterGridProps {
  onboardingComplete: boolean;
  onChapterClick: (chapterId: number) => void;
}

export const ChapterGrid: React.FC<ChapterGridProps> = ({
  onboardingComplete,
  onChapterClick
}) => {
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "What Is AI Anyway?",
      icon: Brain,
      description: "Demystify artificial intelligence with real-world examples",
      duration: "15 min"
    },
    {
      id: 2,
      title: "How Machines Learn",
      icon: Settings,
      description: "ML basics without the technical jargon",
      duration: "20 min"
    },
    {
      id: 3,
      title: "From Data to Insight",
      icon: Target,
      description: "Practical AI tools you can use today",
      duration: "25 min"
    },
    {
      id: 4,
      title: "AI Ethics & Impact",
      icon: Scale,
      description: "Navigate the ethical landscape responsibly",
      duration: "18 min"
    },
    {
      id: 5,
      title: "Non-Profit Playbook",
      icon: Heart,
      description: "Grant writing, donor outreach, and operations",
      duration: "30 min"
    },
    {
      id: 6,
      title: "Your Action Plan",
      icon: BookOpen,
      description: "Create your AI-powered workflow",
      duration: "20 min"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {chapters.map(chapter => {
        const isLocked = !onboardingComplete && chapter.id > 1;
        return (
          <div key={chapter.id} onClick={() => onChapterClick(chapter.id)}>
            <ChapterCard chapter={chapter} isLocked={isLocked} />
          </div>
        );
      })}
    </div>
  );
};
