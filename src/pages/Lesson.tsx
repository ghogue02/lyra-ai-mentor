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
import { TypewriterText } from '@/components/lesson/TypewriterText';
import { InteractiveElementRenderer } from '@/components/lesson/interactive/InteractiveElementRenderer';

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

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
  is_visible: boolean;
  is_active: boolean;
  is_gated: boolean;
}

interface LessonItem {
  id: number;
  type: 'content' | 'interactive';
  order_index: number;
  data: ContentBlock | InteractiveElement;
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
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [elementProgress, setElementProgress] = useState<{[key: number]: boolean}>({});

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

      // Fetch interactive elements
      const { data: elementsData, error: elementsError } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', parseInt(lessonId))
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('order_index');

      if (elementsError) {
        console.error('Error fetching interactive elements:', elementsError);
      }

      // Fetch interactive element progress if user is logged in
      if (user && elementsData) {
        const { data: progressData, error: progressError } = await supabase
          .from('interactive_element_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', parseInt(lessonId));

        if (progressError) {
          console.error('Error fetching element progress:', progressError);
        } else {
          const progressMap = progressData.reduce((acc, item) => {
            acc[item.interactive_element_id] = item.completed;
            return acc;
          }, {} as {[key: number]: boolean});
          setElementProgress(progressMap);
        }
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
      setInteractiveElements(elementsData || []);
      
      // Combine and sort content blocks and interactive elements
      const allItems: LessonItem[] = [
        ...(blocksData || []).map(block => ({
          id: block.id,
          type: 'content' as const,
          order_index: block.order_index,
          data: block
        })),
        ...(elementsData || []).map(element => ({
          id: element.id,
          type: 'interactive' as const,
          order_index: element.order_index,
          data: element
        }))
      ].sort((a, b) => a.order_index - b.order_index);
      
      setLessonItems(allItems);
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

  const handleNextItem = () => {
    if (currentItemIndex < lessonItems.length - 1) {
      const nextIndex = currentItemIndex + 1;
      setCurrentItemIndex(nextIndex);
      const progressPercentage = Math.round(((nextIndex + 1) / lessonItems.length) * 100);
      updateProgress(progressPercentage);
    }
  };

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleElementComplete = async (elementId: number) => {
    if (!user || !lessonId) return;

    try {
      await supabase
        .from('interactive_element_progress')
        .upsert({
          user_id: user.id,
          lesson_id: parseInt(lessonId),
          interactive_element_id: elementId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      setElementProgress(prev => ({
        ...prev,
        [elementId]: true
      }));
    } catch (error) {
      console.error('Error updating element progress:', error);
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

  const currentItem = lessonItems[currentItemIndex];
  const progressPercentage = lessonItems.length > 0 ? 
    Math.round(((currentItemIndex + 1) / lessonItems.length) * 100) : 0;

  // Check if this is lesson 5 (Maya's lesson) for special layout
  const isMayaLesson = lesson?.id === 5;

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
        {lessonItems.length > 0 ? (
          isMayaLesson ? (
            /* Maya's Lesson - Split Screen Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Left Side - Maya's Story */}
              <div className="space-y-6">
                <div className="nm-card nm-surface-purple p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold nm-text-accent">Maya's Story</h2>
                  </div>
                  <div>
                    {currentItem?.type === 'content' ? (
                      <div className="nm-card-subtle p-4">
                        <h3 className="text-lg font-semibold mb-3 nm-text-accent">
                          {(currentItem.data as ContentBlock).title}
                        </h3>
                        <TypewriterText
                          text={(currentItem.data as ContentBlock).content}
                          speed={20}
                          className="nm-text-secondary leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="nm-card-sunken p-8 text-center">
                        <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <p className="nm-text-accent">Interactive element active</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Interactive Elements */}
              <div className="space-y-6">
                {currentItem?.type === 'interactive' ? (
                  <InteractiveElementRenderer
                    element={currentItem.data as InteractiveElement}
                    lessonContext={{
                      chapterTitle: "AI for Your Daily Work",
                      lessonTitle: lesson.title,
                      content: "Maya's Email Assistant Journey"
                    }}
                    isElementCompleted={elementProgress[(currentItem.data as InteractiveElement).id] || false}
                    onComplete={() => handleElementComplete((currentItem.data as InteractiveElement).id)}
                  />
                ) : (
                  <div className="nm-card nm-surface-cyan p-8">
                    <div className="text-center">
                      <div className="nm-surface-elevated w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-cyan-600" />
                      </div>
                      <h3 className="text-lg font-semibold nm-text-cyan mb-2">
                        Continue Reading
                      </h3>
                      <p className="nm-text-secondary">
                        Follow Maya's journey with AI-powered email communication
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Regular Lesson Layout */
            <div className="max-w-4xl mx-auto">
              <div className="nm-card mb-6 p-6">
                <div className="mb-4">
                  <h2 className="flex items-center gap-3 text-lg font-semibold nm-text-primary">
                    <div className="nm-surface-elevated p-2 rounded-full">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    {currentItem?.type === 'content' 
                      ? (currentItem.data as ContentBlock).title || `Section ${currentItemIndex + 1}`
                      : (currentItem.data as InteractiveElement).title || `Interactive ${currentItemIndex + 1}`
                    }
                  </h2>
                </div>
                <div className="nm-card-subtle p-4">
                  {currentItem?.type === 'content' ? (
                    <div className="prose prose-purple max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: (currentItem.data as ContentBlock).content || '' }} />
                    </div>
                  ) : (
                    <InteractiveElementRenderer
                      element={currentItem.data as InteractiveElement}
                      lessonContext={{
                        chapterTitle: "Course Content",
                        lessonTitle: lesson.title,
                        content: "Interactive Learning"
                      }}
                      isElementCompleted={elementProgress[(currentItem.data as InteractiveElement).id] || false}
                      onComplete={() => handleElementComplete((currentItem.data as InteractiveElement).id)}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No content available</h2>
            <p className="text-gray-500">This lesson is still being prepared.</p>
          </div>
        )}

        {/* Navigation with Neumorphic Design */}
        {lessonItems.length > 0 && (
          <div className="nm-nav max-w-4xl mx-auto mt-8 justify-between">
            <button
              className={`nm-nav-item ${currentItemIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'nm-interactive'}`}
              onClick={handlePrevItem}
              disabled={currentItemIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <div className="nm-badge flex items-center gap-2">
              <span className="nm-text-secondary text-sm">
                {currentItemIndex + 1} of {lessonItems.length}
              </span>
            </div>
            
            <button
              className={`nm-nav-item ${currentItemIndex === lessonItems.length - 1 ? 'opacity-50 cursor-not-allowed' : 'nm-interactive'}`}
              onClick={handleNextItem}
              disabled={currentItemIndex === lessonItems.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;