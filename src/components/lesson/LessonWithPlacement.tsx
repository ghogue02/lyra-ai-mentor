import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { ContentPlacementSystem } from '@/components/lesson/ContentPlacementSystem';
import { Chapter2Sidebar } from '@/components/navigation/Chapter2Sidebar';
import { Chapter3Sidebar } from '@/components/navigation/Chapter3Sidebar';
import { Chapter4Sidebar } from '@/components/navigation/Chapter4Sidebar';
import { Chapter5Sidebar } from '@/components/navigation/Chapter5Sidebar';
import { Chapter6Sidebar } from '@/components/navigation/Chapter6Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLessonData } from '@/hooks/useLessonData';

interface LessonWithPlacementProps {
  chapterId: string;
  lessonId: string;
}

export const LessonWithPlacement: React.FC<LessonWithPlacementProps> = ({ chapterId, lessonId }) => {
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
    updateChatEngagement
  } = useLessonData(chapterId, lessonId);

  // Calculate progress whenever completion states change
  useEffect(() => {
    updateProgress(completedBlocks, completedInteractiveElements);
  }, [completedBlocks, completedInteractiveElements, contentBlocks.length, interactiveElements.length]);

  const updateProgress = (completedBlocks: Set<number>, completedElements: Set<number>) => {
    const totalItems = contentBlocks.length + interactiveElements.length;
    const completedItems = completedBlocks.size + completedElements.size;
    const newProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    console.log(`Lesson.tsx: Progress update: ${completedItems}/${totalItems} = ${newProgress}%`);
    setProgress(newProgress);
    
    // Check if lesson is complete
    if (newProgress === 100 && !isChapterCompleted) {
      setIsChapterCompleted(true);
      toast({
        title: "Lesson Complete! 🎉",
        description: "Great job! You've mastered this lesson.",
      });
    }
  };

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
        completed_at: new Date().toISOString()
      });
      
      setCompletedBlocks(prev => new Set([...prev, blockId]));
    } catch (error) {
      console.error('Error marking block as completed:', error);
    }
  };

  const handleElementComplete = async (elementId: number) => {
    if (!user || completedInteractiveElements.has(elementId)) return;
    
    try {
      console.log(`Lesson.tsx: Interactive element ${elementId} completed`);
      setCompletedInteractiveElements(prev => new Set([...prev, elementId]));
    } catch (error) {
      console.error('Error handling element completion:', error);
    }
  };

  const handleChatEngagementChange = (engagement: { hasReachedMinimum: boolean; exchangeCount: number }) => {
    console.log(`Lesson.tsx: Chat engagement update:`, engagement);
    updateChatEngagement(engagement.hasReachedMinimum, engagement.exchangeCount);
  };

  const handleLessonChange = (newLessonId: number) => {
    navigate(`/lesson/${newLessonId}`);
  };

  // Select appropriate sidebar based on chapter
  const getSidebar = () => {
    switch (parseInt(chapterId)) {
      case 2:
        return <Chapter2Sidebar currentLessonId={parseInt(lessonId)} onLessonChange={handleLessonChange} />;
      case 3:
        return <Chapter3Sidebar currentLessonId={parseInt(lessonId)} onLessonChange={handleLessonChange} />;
      case 4:
        return <Chapter4Sidebar currentLessonId={parseInt(lessonId)} onLessonChange={handleLessonChange} />;
      case 5:
        return <Chapter5Sidebar currentLessonId={parseInt(lessonId)} onLessonChange={handleLessonChange} />;
      case 6:
        return <Chapter6Sidebar currentLessonId={parseInt(lessonId)} onLessonChange={handleLessonChange} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          {getSidebar()}
          <div className="flex-1 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          {getSidebar()}
          <div className="flex-1 p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson Not Found</h1>
              <p className="text-gray-600">The requested lesson could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lessonContext = {
    chapterTitle: lesson.chapter?.title,
    lessonTitle: lesson.title,
    content: lesson.content
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Chapter Sidebar */}
        {getSidebar()}
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <LessonHeader 
              lesson={lesson} 
              progress={progress}
              chatEngagement={chatEngagement}
            />
            
            {/* Content with Smart Placement */}
            <div className="mt-8">
              <ContentPlacementSystem
                contentBlocks={contentBlocks.map(block => ({
                  ...block,
                  onClick: () => markBlockCompleted(block.id)
                }))}
                interactiveElements={interactiveElements}
                lessonId={parseInt(lessonId)}
                lessonContext={lessonContext}
                onChatEngagementChange={handleChatEngagementChange}
                onElementComplete={handleElementComplete}
                chatEngagement={chatEngagement}
              />
            </div>
            
            {/* Chapter Completion */}
            {isChapterCompleted && (
              <div className="mt-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h2 className="text-xl font-bold text-green-800 mb-2">Lesson Complete! 🎉</h2>
                  <p className="text-green-700 mb-4">
                    Great work! You've mastered this lesson.
                  </p>
                  {parseInt(lessonId) < 26 && (
                    <p className="text-sm text-green-600">
                      The next lesson will start automatically, or you can navigate using the sidebar.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};