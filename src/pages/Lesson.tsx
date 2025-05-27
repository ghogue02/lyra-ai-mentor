import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from '@/components/Navbar';
import { ContentBlockRenderer } from '@/components/lesson/ContentBlockRenderer';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { LessonProgress } from '@/components/lesson/LessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';

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

export const Lesson = () => {
  const {
    chapterId,
    lessonId
  } = useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    fetchLessonData();
  }, [chapterId, lessonId, user]);

  // Calculate progress whenever completion states change
  useEffect(() => {
    updateProgress(completedBlocks, completedInteractiveElements);
  }, [completedBlocks, completedInteractiveElements, contentBlocks.length, interactiveElements.length]);

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
      const {
        data: lessonData,
        error: lessonError
      } = await supabase.from('lessons').select(`
          id,
          title,
          subtitle,
          estimated_duration,
          chapters:chapter_id (
            title,
            icon
          )
        `).eq('id', lessonIdNum).eq('chapter_id', chapterIdNum).single();
      if (lessonError) throw lessonError;

      // Fetch content blocks
      const {
        data: blocksData,
        error: blocksError
      } = await supabase.from('content_blocks').select('*').eq('lesson_id', lessonIdNum).order('order_index');
      if (blocksError) throw blocksError;

      // Fetch interactive elements
      const {
        data: elementsData,
        error: elementsError
      } = await supabase.from('interactive_elements').select('*').eq('lesson_id', lessonIdNum).order('order_index');
      if (elementsError) throw elementsError;
      
      setLesson({
        ...lessonData,
        chapter: lessonData.chapters
      });
      setContentBlocks(blocksData || []);
      setInteractiveElements(elementsData || []);

      // Fetch user progress if authenticated
      if (user) {
        console.log('Fetching progress for user:', user.id, 'lesson:', lessonIdNum);
        
        // Fetch content block progress
        const { data: progressData } = await supabase
          .from('lesson_progress_detailed')
          .select('content_block_id, completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum);

        const completedBlockIds = new Set(
          progressData?.filter(p => p.completed).map(p => p.content_block_id) || []
        );
        console.log('Completed content blocks:', Array.from(completedBlockIds));
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
        console.log('Completed interactive elements:', Array.from(completedInteractiveIds));
        setCompletedInteractiveElements(completedInteractiveIds);

        // Check if chapter is completed
        const { data: chapterProgressData } = await supabase
          .from('lesson_progress')
          .select('chapter_completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum)
          .maybeSingle();

        setIsChapterCompleted(chapterProgressData?.chapter_completed || false);

        // Load overall chat engagement for this lesson
        const { data: chatData } = await supabase
          .from('user_interactions')
          .select('interactive_element_id')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum)
          .eq('interaction_type', 'chat_engagement');

        if (chatData && chatData.length > 0) {
          const exchangeCount = chatData.length;
          const hasReachedMinimum = exchangeCount >= 3;
          setChatEngagement({
            exchangeCount,
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

  const markBlockCompleted = async (blockId: number) => {
    if (!user || !lessonId || completedBlocks.has(blockId)) return;
    const lessonIdNum = parseInt(lessonId);
    if (isNaN(lessonIdNum)) return;
    
    try {
      console.log(`Marking content block ${blockId} as completed`);
      
      await supabase.from('lesson_progress_detailed').upsert({
        user_id: user.id,
        lesson_id: lessonIdNum,
        content_block_id: blockId,
        completed: true,
        last_accessed: new Date().toISOString()
      });
      
      const newCompleted = new Set([...completedBlocks, blockId]);
      setCompletedBlocks(newCompleted);
      
      console.log(`Content block ${blockId} marked as completed successfully`);
    } catch (error) {
      console.error('Error updating content block progress:', error);
    }
  };

  const handleInteractiveElementComplete = (elementId: number) => {
    if (completedInteractiveElements.has(elementId)) return;
    
    console.log(`Interactive element ${elementId} completed`);
    const newCompleted = new Set([...completedInteractiveElements, elementId]);
    setCompletedInteractiveElements(newCompleted);
  };

  const updateProgress = (blockIds: Set<number>, elementIds: Set<number>) => {
    const totalItems = contentBlocks.length + interactiveElements.length;
    const completedItems = blockIds.size + elementIds.size;
    const newProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    console.log(`Progress update: ${completedItems}/${totalItems} = ${newProgress}%`);
    console.log('Completed blocks:', Array.from(blockIds));
    console.log('Completed elements:', Array.from(elementIds));
    
    setProgress(newProgress);
  };

  const handleMarkChapterComplete = async () => {
    if (!user || !lessonId) return;

    const lessonIdNum = parseInt(lessonId);
    if (isNaN(lessonIdNum)) return;

    try {
      await supabase.from('lesson_progress').upsert({
        user_id: user.id,
        lesson_id: lessonIdNum,
        completed: true,
        progress_percentage: 100,
        chapter_completed: true,
        chapter_completed_at: new Date().toISOString(),
        last_accessed: new Date().toISOString()
      });

      setIsChapterCompleted(true);
      toast({
        title: "Chapter Complete!",
        description: "Congratulations! You can now move on to the next chapter."
      });
    } catch (error) {
      console.error('Error marking chapter complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark chapter as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Merge and sort content blocks and interactive elements
  const allContent = [
    ...contentBlocks.map(block => ({ ...block, contentType: 'block' })),
    ...interactiveElements.map(element => ({ ...element, contentType: 'interactive' }))
  ].sort((a, b) => a.order_index - b.order_index);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>;
  }
  
  if (!lesson) {
    return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar showAuthButtons={false} />
        <div className="container mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson not found</h1>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>;
  }

  // Create lesson context for embedded chat
  const lessonContext = lesson ? {
    chapterTitle: lesson.chapter.title,
    lessonTitle: lesson.title,
    content: contentBlocks.map(block => `${block.title}: ${block.content}`).join('\n\n').substring(0, 1000)
  } : undefined;

  return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={false} />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            {user && progress === 100 && (
              <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
            )}
            {isChapterCompleted && (
              <Badge className="bg-blue-100 text-blue-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Chapter Complete
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            {lesson.title}
          </h1>
          
          <p className="text-gray-500">Chapter: {lesson.chapter.title}</p>
          
          {user && (
            <div className="mt-6">
              <LessonProgress 
                completedBlocks={completedBlocks.size} 
                totalBlocks={contentBlocks.length}
                completedInteractiveElements={completedInteractiveElements.size}
                totalInteractiveElements={interactiveElements.length}
                estimatedDuration={lesson.estimated_duration} 
                isCompleted={isChapterCompleted}
                chatEngagement={chatEngagement}
                onMarkChapterComplete={handleMarkChapterComplete}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mx-auto space-y-8 max-w-4xl">
          {allContent.map(item => <div key={`${item.contentType}-${item.id}`}>
              {item.contentType === 'block' ? <ContentBlockRenderer block={item as ContentBlock} isCompleted={completedBlocks.has(item.id)} onComplete={() => markBlockCompleted(item.id)} /> : <InteractiveElementRenderer element={item as InteractiveElement} lessonId={parseInt(lessonId!)} lessonContext={lessonContext} onChatEngagementChange={setChatEngagement} onElementComplete={handleInteractiveElementComplete} />}
            </div>)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 mx-auto max-w-4xl">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chapters
          </Button>
          
          {user && isChapterCompleted && (
            <Button 
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600" 
              onClick={() => navigate('/dashboard')}
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>;
};

export default Lesson;
