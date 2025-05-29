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

export const ChapterGrid: React.FC<ChapterGridProps> = ({
  onboardingComplete,
  onChapterClick
}) => {
  const { chapters, loading: chaptersLoading, error } = useChapters();
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

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {chapters.map((chapter, index) => {
        const progress = chapterProgress[chapter.id];
        const isCompleted = progress?.isCompleted || false;
        const progressPercentage = progress?.progress || 0;
        
        // Chapter 1 is always unlocked if onboarding is complete
        // Other chapters are unlocked if the previous chapter is completed
        let isLocked = false;
        if (!onboardingComplete && chapter.id > 1) {
          isLocked = true;
        } else if (chapter.id > 1) {
          // Check if previous chapter is completed
          const previousChapterId = chapters[index - 1]?.id;
          const previousChapterProgress = chapterProgress[previousChapterId];
          isLocked = !previousChapterProgress?.isCompleted;
        }

        return (
          <div key={chapter.id} onClick={() => onChapterClick(chapter.id)}>
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
            />
          </div>
        );
      })}
    </div>
  );
};
