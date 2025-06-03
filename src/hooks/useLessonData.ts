
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  estimated_duration: number;
  chapter: {
    title: string;
    icon: string;
  };
}

interface ContentBlock {
  id: number;
  type: string;
  title: string;
  content: string;
  metadata: any;
  order_index: number;
}

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
}

export const useLessonData = (chapterId?: string, lessonId?: string) => {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());
  const [completedInteractiveElements, setCompletedInteractiveElements] = useState<Set<number>>(new Set());
  const [isChapterCompleted, setIsChapterCompleted] = useState(false);
  const [chatEngagement, setChatEngagement] = useState<{
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }>({
    hasReachedMinimum: false,
    exchangeCount: 0
  });

  // Stable debounced update function to prevent flickering
  const updateChatEngagement = useCallback((engagement: { hasReachedMinimum: boolean; exchangeCount: number; }) => {
    setChatEngagement(prev => {
      // Only update if there's an actual change to prevent unnecessary re-renders
      if (prev.hasReachedMinimum === engagement.hasReachedMinimum && 
          prev.exchangeCount === engagement.exchangeCount) {
        return prev;
      }
      console.log('useLessonData: Updating chat engagement:', engagement);
      return engagement;
    });
  }, []);

  const fetchLessonData = async () => {
    if (!chapterId || !lessonId) return;
    const chapterIdNum = parseInt(chapterId);
    const lessonIdNum = parseInt(lessonId);
    if (isNaN(chapterIdNum) || isNaN(lessonIdNum)) {
      console.error('Invalid chapter or lesson ID');
      setLoading(false);
      return;
    }
    try {
      // Fetch lesson with chapter info
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          subtitle,
          estimated_duration,
          chapters:chapter_id (
            title,
            icon
          )
        `)
        .eq('id', lessonIdNum)
        .eq('chapter_id', chapterIdNum)
        .single();
      if (lessonError) throw lessonError;

      // Fetch content blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', lessonIdNum)
        .order('order_index');
      if (blocksError) throw blocksError;

      // Fetch interactive elements
      const { data: elementsData, error: elementsError } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lessonIdNum)
        .order('order_index');
      if (elementsError) throw elementsError;

      setLesson({
        ...lessonData,
        chapter: lessonData.chapters
      });
      setContentBlocks(blocksData || []);
      setInteractiveElements(elementsData || []);

      // Fetch user progress if authenticated
      if (user) {
        console.log('useLessonData: Fetching progress for user:', user.id, 'lesson:', lessonIdNum);

        // Fetch content block progress
        const { data: progressData } = await supabase
          .from('lesson_progress_detailed')
          .select('content_block_id, completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum);

        const completedBlockIds = new Set(
          progressData?.filter(p => p.completed).map(p => p.content_block_id) || []
        );
        console.log('useLessonData: Completed content blocks:', Array.from(completedBlockIds));
        setCompletedBlocks(completedBlockIds);

        // Fetch interactive element progress
        const { data: interactiveProgressData } = await supabase
          .from('interactive_element_progress')
          .select('interactive_element_id, completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum);

        const completedInteractiveIds = new Set(
          interactiveProgressData?.filter(p => p.completed).map(p => p.interactive_element_id) || []
        );
        console.log('useLessonData: Completed interactive elements:', Array.from(completedInteractiveIds));
        setCompletedInteractiveElements(completedInteractiveIds);

        // Check if chapter is completed
        const { data: chapterProgressData } = await supabase
          .from('lesson_progress')
          .select('chapter_completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum)
          .maybeSingle();
        setIsChapterCompleted(chapterProgressData?.chapter_completed || false);

        // Load chat engagement - consolidated here for single source of truth
        const { data: conversationData } = await supabase
          .from('chat_conversations')
          .select('id, message_count')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum);

        if (conversationData && conversationData.length > 0) {
          const totalExchanges = Math.floor(
            conversationData.reduce((sum, conv) => sum + conv.message_count, 0) / 2
          );
          const hasReachedMinimum = totalExchanges >= 3;
          console.log(`useLessonData: Found ${totalExchanges} chat exchanges, minimum reached: ${hasReachedMinimum}`);
          
          // Use the stable update function
          updateChatEngagement({
            exchangeCount: totalExchanges,
            hasReachedMinimum
          });
        }
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, [chapterId, lessonId, user]);

  // Memoize the return object to prevent unnecessary re-renders
  const memoizedReturn = useMemo(() => ({
    lesson,
    contentBlocks,
    interactiveElements,
    loading,
    completedBlocks,
    setCompletedBlocks,
    completedInteractiveElements,
    setCompletedInteractiveElements,
    isChapterCompleted,
    setIsChapterCompleted,
    chatEngagement,
    updateChatEngagement
  }), [
    lesson,
    contentBlocks,
    interactiveElements,
    loading,
    completedBlocks,
    completedInteractiveElements,
    isChapterCompleted,
    chatEngagement,
    updateChatEngagement
  ]);

  return memoizedReturn;
};
