
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChapterProgress {
  chapterId: number;
  isCompleted: boolean;
  progress: number;
}

export const useChapterProgress = () => {
  const { user } = useAuth();
  const [chapterProgress, setChapterProgress] = useState<Record<number, ChapterProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChapterProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchChapterProgress = async () => {
    if (!user) return;

    try {
      // Get lesson progress for all chapters
      const { data: lessonProgress, error } = await supabase
        .from('lesson_progress')
        .select(`
          lesson_id,
          completed,
          progress_percentage,
          chapter_completed,
          lessons(chapter_id)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching chapter progress:', error);
        return;
      }

      // Group by chapter and calculate progress
      const progressByChapter: Record<number, ChapterProgress> = {};
      
      lessonProgress?.forEach((progress: any) => {
        const chapterId = progress.lessons?.chapter_id;
        if (chapterId) {
          if (!progressByChapter[chapterId]) {
            progressByChapter[chapterId] = {
              chapterId,
              isCompleted: false,
              progress: 0
            };
          }
          
          // If any lesson in the chapter is marked as chapter_completed, mark chapter as completed
          if (progress.chapter_completed) {
            progressByChapter[chapterId].isCompleted = true;
            progressByChapter[chapterId].progress = 100;
          } else if (progress.progress_percentage > progressByChapter[chapterId].progress) {
            progressByChapter[chapterId].progress = progress.progress_percentage;
          }
        }
      });

      setChapterProgress(progressByChapter);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { chapterProgress, loading };
};
