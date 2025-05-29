import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Navbar } from '@/components/Navbar';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { LessonContent } from '@/components/lesson/LessonContent';
import { ChapterCompletion } from '@/components/lesson/ChapterCompletion';
import { LessonNavigation } from '@/components/lesson/LessonNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLessonData } from '@/hooks/useLessonData';

export const Lesson = () => {
  const { chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  const {
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
    setChatEngagement
  } = useLessonData(chapterId, lessonId);

  // Calculate progress whenever completion states change
  useEffect(() => {
    updateProgress(completedBlocks, completedInteractiveElements);
  }, [completedBlocks, completedInteractiveElements, contentBlocks.length, interactiveElements.length]);

  const markBlockCompleted = async (blockId: number) => {
    if (!user || !lessonId || completedBlocks.has(blockId)) return;
    const lessonIdNum = parseInt(lessonId);
    if (isNaN(lessonIdNum)) return;
    try {
      console.log(`Lesson.tsx: Marking content block ${blockId} as completed`);
      await supabase.from('lesson_progress_detailed').upsert({
        user_id: user.id,
        lesson_id: lessonIdNum,
        content_block_id: blockId,
        completed: true,
        last_accessed: new Date().toISOString()
      });
      const newCompleted = new Set([...completedBlocks, blockId]);
      setCompletedBlocks(newCompleted);
      console.log(`Lesson.tsx: Content block ${blockId} marked as completed. Total completed: ${newCompleted.size}/${contentBlocks.length}`);
    } catch (error) {
      console.error('Error updating content block progress:', error);
    }
  };

  const handleInteractiveElementComplete = (elementId: number) => {
    if (completedInteractiveElements.has(elementId)) return;
    console.log(`Lesson.tsx: Interactive element ${elementId} completed`);
    const newCompleted = new Set([...completedInteractiveElements, elementId]);
    setCompletedInteractiveElements(newCompleted);
  };

  const handleChatEngagementChange = (engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => {
    console.log('Lesson.tsx: Chat engagement changed:', engagement);
    setChatEngagement(engagement);

    // Force a re-render of content to update blocking state
    if (engagement.hasReachedMinimum && !chatEngagement.hasReachedMinimum) {
      console.log('Lesson.tsx: Chat engagement threshold reached, content should unlock');
    }
  };

  const updateProgress = (blockIds: Set<number>, elementIds: Set<number>) => {
    const totalItems = contentBlocks.length + interactiveElements.length;
    const completedItems = blockIds.size + elementIds.size;
    const newProgress = totalItems > 0 ? completedItems / totalItems * 100 : 0;
    console.log(`Lesson.tsx: Progress update: ${completedItems}/${totalItems} = ${newProgress}%`);
    setProgress(newProgress);
  };

  const handleMarkChapterComplete = async () => {
    if (!user || !lessonId || !chapterId) return;
    const lessonIdNum = parseInt(lessonId);
    const chapterIdNum = parseInt(chapterId);
    if (isNaN(lessonIdNum) || isNaN(chapterIdNum)) return;
    
    try {
      // Update lesson progress
      await supabase.from('lesson_progress').upsert({
        user_id: user.id,
        lesson_id: lessonIdNum,
        completed: true,
        progress_percentage: 100,
        chapter_completed: true,
        chapter_completed_at: new Date().toISOString(),
        last_accessed: new Date().toISOString()
      });

      // If this is Chapter 1, also update the profile to unlock Chapter 2
      if (chapterIdNum === 1) {
        console.log('Lesson.tsx: Updating profile for Chapter 1 completion');
        await supabase
          .from('profiles')
          .update({
            first_chapter_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        console.log('Lesson.tsx: Profile updated - Chapter 2 should now be unlocked');
      }

      setIsChapterCompleted(true);
      toast({
        title: "Chapter Complete!",
        description: "Congratulations! Redirecting you to the dashboard..."
      });
      
      // Redirect to dashboard after a short delay to show the toast
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error marking chapter complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark chapter as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Find the first Lyra chat element to determine blocking point
  const findFirstLyraChatIndex = () => {
    const regularContent = [...contentBlocks.filter(block => block.type !== 'ai_generated_image').map(block => ({
      ...block,
      contentType: 'interactive'
    })), ...interactiveElements.map(element => ({
      ...element,
      contentType: 'interactive'
    }))].sort((a, b) => a.order_index - b.order_index);
    return regularContent.findIndex(item => item.contentType === 'interactive' && item.type === 'lyra_chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar showAuthButtons={false} />
        <div className="container mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson not found</h1>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Create lesson context for embedded chat
  const lessonContext = lesson ? {
    chapterTitle: lesson.chapter.title,
    lessonTitle: lesson.title,
    content: contentBlocks.map(block => `${block.title}: ${block.content}`).join('\n\n').substring(0, 1000)
  } : undefined;

  const firstLyraChatIndex = findFirstLyraChatIndex();
  const hasContentBlocking = firstLyraChatIndex !== -1;

  // Calculate completion status for the bottom button
  const totalItems = contentBlocks.length + interactiveElements.length;
  const completedItems = completedBlocks.size + completedInteractiveElements.size;
  const contentComplete = completedItems === totalItems;
  const chatComplete = chatEngagement?.hasReachedMinimum || false;
  const isFullyComplete = contentComplete && chatComplete;

  console.log('Lesson.tsx: Rendering with chat engagement:', chatEngagement);
  console.log('Lesson.tsx: Content blocking enabled:', hasContentBlocking);
  console.log('Lesson.tsx: First Lyra chat index:', firstLyraChatIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={false} />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <LessonHeader 
          lesson={lesson}
          user={user}
          progress={progress}
          isChapterCompleted={isChapterCompleted}
          completedBlocks={completedBlocks.size}
          totalBlocks={contentBlocks.length}
          completedInteractiveElements={completedInteractiveElements.size}
          totalInteractiveElements={interactiveElements.length}
          chatEngagement={chatEngagement}
          onMarkChapterComplete={handleMarkChapterComplete}
          hasContentBlocking={hasContentBlocking}
        />

        <LessonContent 
          contentBlocks={contentBlocks}
          interactiveElements={interactiveElements}
          completedBlocks={completedBlocks}
          completedInteractiveElements={completedInteractiveElements}
          chatEngagement={chatEngagement}
          lessonId={lessonId!}
          lessonContext={lessonContext}
          onMarkBlockCompleted={markBlockCompleted}
          onChatEngagementChange={handleChatEngagementChange}
          onInteractiveElementComplete={handleInteractiveElementComplete}
        />

        <ChapterCompletion 
          user={user}
          isFullyComplete={isFullyComplete}
          isChapterCompleted={isChapterCompleted}
          onMarkChapterComplete={handleMarkChapterComplete}
        />

        <LessonNavigation 
          user={user}
          isChapterCompleted={isChapterCompleted}
        />
      </div>
    </div>
  );
};

export default Lesson;
