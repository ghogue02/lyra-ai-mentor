
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from '@/components/Navbar';
import { ContentBlockRenderer } from '@/components/lesson/ContentBlockRenderer';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  const { chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchLessonData();
  }, [chapterId, lessonId, user]);

  const fetchLessonData = async () => {
    if (!chapterId || !lessonId) return;

    // Convert string params to numbers
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
        const { data: progressData } = await supabase
          .from('lesson_progress_detailed')
          .select('content_block_id, completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonIdNum);

        const completed = new Set(
          progressData?.filter(p => p.completed).map(p => p.content_block_id) || []
        );
        setCompletedBlocks(completed);
        setProgress((completed.size / (blocksData?.length || 1)) * 100);
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
      await supabase
        .from('lesson_progress_detailed')
        .upsert({
          user_id: user.id,
          lesson_id: lessonIdNum,
          content_block_id: blockId,
          completed: true,
          last_accessed: new Date().toISOString()
        });

      const newCompleted = new Set([...completedBlocks, blockId]);
      setCompletedBlocks(newCompleted);
      setProgress((newCompleted.size / contentBlocks.length) * 100);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Merge and sort content blocks and interactive elements
  const allContent = [
    ...contentBlocks.map(block => ({ ...block, contentType: 'block' })),
    ...interactiveElements.map(element => ({ ...element, contentType: 'interactive' }))
  ].sort((a, b) => a.order_index - b.order_index);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={false} />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {lesson.estimated_duration} min
            </Badge>
            {user && progress === 100 && (
              <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            {lesson.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {lesson.subtitle}
          </p>
          <p className="text-gray-500">Chapter: {lesson.chapter.title}</p>
          
          {user && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full max-w-md" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mx-auto space-y-8 max-w-4xl">
          {allContent.map((item) => (
            <div key={`${item.contentType}-${item.id}`}>
              {item.contentType === 'block' ? (
                <ContentBlockRenderer
                  block={item as ContentBlock}
                  isCompleted={completedBlocks.has(item.id)}
                  onComplete={() => markBlockCompleted(item.id)}
                />
              ) : (
                <InteractiveElementRenderer
                  element={item as InteractiveElement}
                  lessonId={parseInt(lessonId!)}
                  lessonContext={lessonContext}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 mx-auto max-w-4xl">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chapters
          </Button>
          
          {user && progress === 100 && (
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
    </div>
  );
};

export default Lesson;
