import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonData {
  id: number;
  title: string;
  subtitle: string;
  chapter_id: number;
  order_index: number;
  estimated_duration: number;
  is_published: boolean;
}

interface ContentBlock {
  id: number;
  type: string;
  title: string;
  content: string;
  order_index: number;
  is_visible: boolean;
  is_active: boolean;
  metadata: any;
}

interface LessonProgress {
  completed: boolean;
  progress_percentage: number;
  last_accessed: string;
}

export const Lesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  useEffect(() => {
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  const fetchLessonData = async () => {
    if (!lessonId) return;
    
    try {
      // Fetch lesson details
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', parseInt(lessonId))
        .eq('is_published', true)
        .single();

      if (lessonError) {
        console.error('Error fetching lesson:', lessonError);
        toast({
          title: "Error",
          description: "Failed to load lesson.",
          variant: "destructive"
        });
        return;
      }

      // Fetch content blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', parseInt(lessonId))
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('order_index');

      if (blocksError) {
        console.error('Error fetching content blocks:', blocksError);
      }

      // Fetch progress if user is logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', parseInt(lessonId))
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error fetching progress:', progressError);
        } else if (progressData) {
          setProgress(progressData);
        }
      }

      setLesson(lessonData);
      setContentBlocks(blocksData || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong loading the lesson.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progressPercentage: number) => {
    if (!user || !lessonId) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: parseInt(lessonId),
          progress_percentage: progressPercentage,
          last_accessed: new Date().toISOString(),
          completed: progressPercentage >= 100
        });

      if (error) {
        console.error('Error updating progress:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNextBlock = () => {
    if (currentBlockIndex < contentBlocks.length - 1) {
      const nextIndex = currentBlockIndex + 1;
      setCurrentBlockIndex(nextIndex);
      const progressPercentage = Math.round(((nextIndex + 1) / contentBlocks.length) * 100);
      updateProgress(progressPercentage);
    }
  };

  const handlePrevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const handleBackToChapter = () => {
    if (lesson?.chapter_id) {
      navigate(`/chapter/${lesson.chapter_id}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentBlock = contentBlocks[currentBlockIndex];
  const progressPercentage = contentBlocks.length > 0 ? 
    Math.round(((currentBlockIndex + 1) / contentBlocks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToChapter}
            className="mb-4 hover:bg-white/50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Chapter
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
              {lesson.subtitle && (
                <p className="text-gray-600 mt-2">{lesson.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {lesson.estimated_duration && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.estimated_duration} min
                </Badge>
              )}
              {progress?.completed && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Content */}
        {contentBlocks.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {currentBlock?.title || `Section ${currentBlockIndex + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-purple max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentBlock?.content || '' }} />
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevBlock}
                disabled={currentBlockIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                {currentBlockIndex + 1} of {contentBlocks.length}
              </span>
              
              <Button
                onClick={handleNextBlock}
                disabled={currentBlockIndex === contentBlocks.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No content available</h2>
            <p className="text-gray-500">This lesson is still being prepared.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;