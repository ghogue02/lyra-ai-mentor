import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Navbar } from '@/components/Navbar';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { LessonContent } from '@/components/lesson/LessonContent';
import { ChapterCompletion } from '@/components/lesson/ChapterCompletion';
import { LessonNavigation } from '@/components/lesson/LessonNavigation';
import { LessonWithPlacement } from '@/components/lesson/LessonWithPlacement';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLessonData } from '@/hooks/useLessonData';
import { Chapter3Sidebar } from '@/components/navigation/Chapter3Sidebar';
import { Chapter4Sidebar } from '@/components/navigation/Chapter4Sidebar';
import { Chapter5Sidebar } from '@/components/navigation/Chapter5Sidebar';
import { Chapter6Sidebar } from '@/components/navigation/Chapter6Sidebar';

export const Lesson = () => {
  const { chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  // Call all hooks unconditionally at the top level
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
    updateChatEngagement
  } = useLessonData(chapterId, lessonId);

  // Define handlers before any conditional logic
  const updateProgress = useCallback((completedBlocksSet: Set<number>, completedElementsSet: Set<number>) => {
    const totalItems = contentBlocks.length + interactiveElements.length;
    if (totalItems === 0) return;
    
    const completedItems = completedBlocksSet.size + completedElementsSet.size;
    const newProgress = Math.round((completedItems / totalItems) * 100);
    setProgress(newProgress);
  }, [contentBlocks.length, interactiveElements.length]);

  const handleInteractiveElementComplete = useCallback((elementId: number) => {
    if (completedInteractiveElements.has(elementId)) return;
    console.log(`Lesson.tsx: Interactive element ${elementId} completed`);
    const newCompleted = new Set([...completedInteractiveElements, elementId]);
    setCompletedInteractiveElements(newCompleted);
  }, [completedInteractiveElements, setCompletedInteractiveElements]);

  const handleChatEngagementChange = useCallback((engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => {
    console.log('Lesson.tsx: Chat engagement changed:', engagement);
    updateChatEngagement(engagement);
  }, [updateChatEngagement]);

  // Calculate progress whenever completion states change
  useEffect(() => {
    updateProgress(completedBlocks, completedInteractiveElements);
  }, [completedBlocks, completedInteractiveElements, updateProgress]);

  // Check for placement system usage
  const usePlacementSystem = lessonId && parseInt(lessonId) >= 1;
  
  // Use placement system for ALL lessons to ensure consistent styling
  if (usePlacementSystem && lessonId) {
    const chapterMap: Record<number, string> = {
      // Chapter 1 lessons
      1: '1', 2: '1', 3: '1', 4: '1',
      // Chapter 2 lessons  
      5: '2', 6: '2', 7: '2', 8: '2',
      // Bridge lessons (if any)
      9: '2', 10: '2',
      // Chapter 3 lessons
      11: '3', 12: '3', 13: '3', 14: '3',
      // Chapter 4 lessons
      15: '4', 16: '4', 17: '4', 18: '4',
      // Chapter 5 lessons
      19: '5', 20: '5', 21: '5', 22: '5',
      // Chapter 6 lessons
      23: '6', 24: '6', 25: '6', 26: '6'
    };
    const effectiveChapterId = chapterId || chapterMap[parseInt(lessonId)];
    return <LessonWithPlacement chapterId={effectiveChapterId} lessonId={lessonId} />;
  }

  // Helper functions that don't use hooks
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

  const renderNavigation = () => {
    const numChapterId = parseInt(chapterId || '1');
    switch (numChapterId) {
      case 3:
        return <Chapter3Sidebar currentLessonId={parseInt(lessonId || '0')} />;
      case 4:
        return <Chapter4Sidebar currentLessonId={parseInt(lessonId || '0')} />;
      case 5:
        return <Chapter5Sidebar currentLessonId={parseInt(lessonId || '0')} />;
      case 6:
        return <Chapter6Sidebar currentLessonId={parseInt(lessonId || '0')} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || !chapterId || !lessonId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const lessonContext = {
    chapterTitle: `Chapter ${chapterId}`,
    lessonTitle: lesson.title,
    content: contentBlocks.map(block => block.content).join(' ')
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isChapterCompleted && (
        <ChapterCompletion 
          chapterNumber={parseInt(chapterId)} 
          onClose={() => setIsChapterCompleted(false)}
        />
      )}
      <div className="flex">
        {/* Chapter-specific navigation */}
        {renderNavigation()}
        
        {/* Main content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <LessonHeader
              chapterNumber={parseInt(chapterId)}
              lessonTitle={lesson.title}
              progress={progress}
            />
            
            <LessonContent
              contentBlocks={contentBlocks}
              interactiveElements={interactiveElements}
              completedBlocks={completedBlocks}
              onBlockComplete={markBlockCompleted}
              lessonId={parseInt(lessonId)}
              lessonContext={lessonContext}
              onInteractiveElementComplete={handleInteractiveElementComplete}
              chatEngagement={chatEngagement}
              onChatEngagementChange={handleChatEngagementChange}
            />
            
            <LessonNavigation
              currentLessonId={parseInt(lessonId)}
              chapterId={parseInt(chapterId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;