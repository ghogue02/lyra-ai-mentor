
import React from 'react';
import { ChapterCard } from '@/components/ChapterCard';
import { useChapters } from '@/hooks/useChapters';
import { useChapterProgress } from '@/hooks/useChapterProgress';

interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
}

interface ChapterGridProps {
  onboardingComplete: boolean;
  onChapterClick: (chapterId: number) => void;
}

// Placeholder chapters for future content
const placeholderChapters: Chapter[] = [
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of machine learning algorithms and applications.",
    duration: "20 min"
  },
  {
    id: 4,
    title: "Natural Language Processing",
    description: "Discover how AI understands and processes human language.",
    duration: "25 min"
  },
  {
    id: 5,
    title: "Computer Vision",
    description: "Explore how AI can see and interpret visual information.",
    duration: "22 min"
  },
  {
    id: 6,
    title: "AI Ethics & Future",
    description: "Understand the ethical implications and future of AI technology.",
    duration: "18 min"
  }
];

export const ChapterGrid: React.FC<ChapterGridProps> = ({
  onboardingComplete,
  onChapterClick
}) => {
  const { chapters: dbChapters, loading: chaptersLoading, error } = useChapters();
  const { chapterProgress, loading: progressLoading } = useChapterProgress();

  if (chaptersLoading || progressLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading chapters...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading chapters: {error}</p>
      </div>
    );
  }

  // Combine database chapters with placeholders
  const allChapters = [...dbChapters, ...placeholderChapters].sort((a, b) => a.id - b.id);

  if (allChapters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {allChapters.map((chapter, index) => {
        const progress = chapterProgress[chapter.id];
        const isCompleted = progress?.isCompleted || false;
        const progressPercentage = progress?.progress || 0;
        
        // Check if this is a database chapter or placeholder
        const isPlaceholder = chapter.id > 2;
        
        // Determine if chapter is locked
        let isLocked = false;
        
        if (isPlaceholder) {
          // Placeholder chapters (3-6) are always locked
          isLocked = true;
        } else if (!onboardingComplete && chapter.id > 1) {
          // If onboarding not complete, only chapter 1 is unlocked
          isLocked = true;
        } else if (chapter.id > 1) {
          // For chapter 2+, check if previous chapter is completed
          const previousChapterId = chapter.id - 1;
          const previousChapterProgress = chapterProgress[previousChapterId];
          isLocked = !previousChapterProgress?.isCompleted;
        }

        const handleChapterClick = () => {
          if (!isLocked && !isPlaceholder) {
            onChapterClick(chapter.id);
          }
        };

        return (
          <div key={chapter.id} onClick={handleChapterClick}>
            <ChapterCard 
              chapter={{
                id: chapter.id,
                title: chapter.title,
                description: chapter.description || '',
                duration: chapter.duration || '15 min'
              }}
              isLocked={isLocked}
              isCompleted={isCompleted}
              progress={progressPercentage}
              isPlaceholder={isPlaceholder}
            />
          </div>
        );
      })}
    </div>
  );
};
