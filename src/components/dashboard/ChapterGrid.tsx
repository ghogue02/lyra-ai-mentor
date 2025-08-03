
import React from 'react';
import { ChapterCard } from '@/components/ChapterCard';
import { useChapters } from '@/hooks/useChapters';
import { useChapterProgress } from '@/hooks/useChapterProgress';

interface Chapter {
  id: number;
  title: string;
  description: string;
}

interface ChapterGridProps {
  onboardingComplete: boolean;
  onChapterClick: (chapterId: number) => void;
}

// Placeholder chapters for future content
const placeholderChapters: Chapter[] = [
  {
    id: 3,
    title: "Sofia's Storytelling Mastery",
    description: "Master AI-enhanced storytelling with Sofia to create compelling narratives that engage donors, inspire volunteers, and amplify your mission's impact.",
  },
  {
    id: 4,
    title: "David's Data Storytelling Mastery",
    description: "Transform spreadsheets into compelling narratives with David's proven strategies for data visualization, funding proposals, and strategic decision-making.",
  },
  {
    id: 5,
    title: "Rachel's Workflow Automation Mastery",
    description: "Build human-centered automation systems with Rachel to streamline operations while preserving the personal touch that makes nonprofits special.",
  },
  {
    id: 6,
    title: "Alex's AI Leadership Mastery",
    description: "Lead sustainable AI transformation with Alex's proven framework for organizational change, team adoption, and strategic vision implementation.",
  }
];

export const ChapterGrid: React.FC<ChapterGridProps> = ({
  onboardingComplete,
  onChapterClick
}) => {
  const { chapters: dbChapters, loading: chaptersLoading, error } = useChapters();
  const { chapterProgress, loading: progressLoading } = useChapterProgress();

  // DEBUGGING: Log what we get from database
  console.log('🔍 CHAPTER LOADING DEBUG:');
  console.log('📊 Database chapters:', dbChapters);
  console.log('📝 Placeholder chapters:', placeholderChapters);
  console.log('⚠️ Loading states:', { chaptersLoading, progressLoading });
  console.log('❌ Error:', error);

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

  // FIXED: Only use placeholders for chapters that don't exist in database
  const dbChapterIds = new Set(dbChapters.map(c => c.id));
  const neededPlaceholders = placeholderChapters.filter(p => !dbChapterIds.has(p.id));
  
  console.log('🔧 DUPLICATE PREVENTION:');
  console.log('📋 DB Chapter IDs:', Array.from(dbChapterIds));
  console.log('🔄 Needed placeholders:', neededPlaceholders.map(p => ({ id: p.id, title: p.title })));
  
  // Combine database chapters with only needed placeholders
  const allChapters = [...dbChapters, ...neededPlaceholders].sort((a, b) => a.id - b.id);
  
  console.log('📚 FINAL CHAPTER LIST:');
  console.log('Total chapters:', allChapters.length);
  allChapters.forEach(c => {
    console.log(`  Chapter ${c.id}: ${c.title} (${dbChapterIds.has(c.id) ? 'DATABASE' : 'PLACEHOLDER'})`);
  });

  if (allChapters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
      {allChapters.map((chapter, index) => {
        const progress = chapterProgress[chapter.id];
        const isCompleted = progress?.isCompleted || false;
        const progressPercentage = progress?.progress || 0;
        
        // Check if this is a database chapter or placeholder
        const isPlaceholder = !dbChapterIds.has(chapter.id);
        
        console.log(`📖 Chapter ${chapter.id} (${chapter.title}):`, {
          isPlaceholder,
          fromDatabase: dbChapterIds.has(chapter.id),
          progress: progressPercentage,
          isCompleted
        });
        
        // All chapters are unlocked - automation agents will build content as needed
        let isLocked = false;
        
        // All chapters are now accessible - placeholders will show "under construction" 
        // and direct users to Chapter Builder Agent

        // Debug for chapter navigation
        if (chapter.id === 2) {
          console.log('Chapter 2 Debug:', {
            chapterId: chapter.id,
            title: chapter.title,
            isLocked,
            isPlaceholder
          });
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
