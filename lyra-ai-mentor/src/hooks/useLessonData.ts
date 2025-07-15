
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

  const fetchLessonData = useCallback(async () => {
    if (!chapterId || !lessonId) return;

    try {
      console.log(`useLessonData: Fetching data for Chapter ${chapterId}, Lesson ${lessonId}`);
      
      const lessonIdNum = parseInt(lessonId);
      const chapterIdNum = parseInt(chapterId);

      // Fetch lesson data with chapter info
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          subtitle,
          estimated_duration,
          chapter:chapters(title, icon)
        `)
        .eq('id', lessonIdNum)
        .eq('chapter_id', chapterIdNum)
        .single();

      if (lessonError) {
        console.error('Error fetching lesson:', lessonError);
        setLoading(false);
        return;
      }

      // Fetch content blocks - only visible ones
      const { data: contentBlocksData, error: contentError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', lessonIdNum)
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('order_index');

      if (contentError) {
        console.error('Error fetching content blocks:', contentError);
      }

      // Fetch interactive elements - only visible, active, non-gated ones
      const { data: interactiveElementsData, error: interactiveError } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lessonIdNum)
        .eq('is_visible', true)
        .eq('is_active', true)
        .eq('is_gated', false)
        .order('order_index');
      
      // Filter out admin/debug/test element types that should not be visible to learners
      const adminElementTypes = [
        'difficult_conversation_helper',
        'interactive_element_auditor', 
        'automated_element_enhancer',
        'database_debugger',
        'interactive_element_builder',
        'element_workflow_coordinator',
        'chapter_builder_agent',
        'content_audit_agent',
        'storytelling_agent'
      ];
      
      const filteredInteractiveElements = interactiveElementsData?.filter(
        element => !adminElementTypes.includes(element.type) && 
                  !element.title?.toLowerCase().includes('test') &&
                  !element.title?.toLowerCase().includes('debug')
      ) || [];

      if (interactiveError) {
        console.error('Error fetching interactive elements:', interactiveError);
      }

      console.log(`useLessonData: Found ${contentBlocksData?.length || 0} content blocks, ${filteredInteractiveElements.length} interactive elements (filtered from ${interactiveElementsData?.length || 0})`);

      setLesson(lessonData);
      setContentBlocks(contentBlocksData || []);
      setInteractiveElements(filteredInteractiveElements);

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
      console.error('Error in fetchLessonData:', error);
    } finally {
      setLoading(false);
    }
  }, [chapterId, lessonId, user?.id, updateChatEngagement]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

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
