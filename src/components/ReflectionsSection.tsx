
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PenTool, Calendar, BookOpen } from 'lucide-react';

interface Reflection {
  id: string;
  content: string;
  created_at: string;
  metadata: {
    question: string;
    element_title: string;
  };
  lesson_id: number;
}

interface LessonInfo {
  id: number;
  title: string;
  chapter: {
    title: string;
  };
}

export const ReflectionsSection = () => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [lessons, setLessons] = useState<Record<number, LessonInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReflections();
    }
  }, [user]);

  const fetchReflections = async () => {
    if (!user) return;

    try {
      // Fetch reflections
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('interaction_type', 'reflection')
        .order('created_at', { ascending: false });

      if (reflectionsError) throw reflectionsError;

      if (reflectionsData && reflectionsData.length > 0) {
        setReflections(reflectionsData);

        // Get unique lesson IDs
        const lessonIds = [...new Set(reflectionsData.map(r => r.lesson_id))];

        // Fetch lesson info for context
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            chapters:chapter_id (
              title
            )
          `)
          .in('id', lessonIds);

        if (lessonsError) throw lessonsError;

        if (lessonsData) {
          const lessonsMap = lessonsData.reduce((acc, lesson) => {
            acc[lesson.id] = {
              id: lesson.id,
              title: lesson.title,
              chapter: lesson.chapters
            };
            return acc;
          }, {} as Record<number, LessonInfo>);
          setLessons(lessonsMap);
        }
      }
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-purple-600" />
            <CardTitle>My Learning Reflections</CardTitle>
          </div>
          <CardDescription>Loading your reflections...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (reflections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-purple-600" />
            <CardTitle>My Learning Reflections</CardTitle>
          </div>
          <CardDescription>Your personal learning journal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reflections yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Complete lessons with reflection exercises to build your learning journal
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-purple-600" />
          <CardTitle>My Learning Reflections</CardTitle>
        </div>
        <CardDescription>
          Your personal learning journal - {reflections.length} reflection{reflections.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {reflections.map((reflection) => {
          const lesson = lessons[reflection.lesson_id];
          return (
            <div key={reflection.id} className="border-l-4 border-purple-200 pl-4 py-2">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {lesson && (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>{lesson.chapter.title}: {lesson.title}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reflection.created_at)}
                </div>
              </div>
              
              {reflection.metadata?.element_title && (
                <h4 className="font-medium text-gray-800 mb-2">
                  {reflection.metadata.element_title}
                </h4>
              )}
              
              {reflection.metadata?.question && (
                <p className="text-sm text-gray-600 mb-3 italic">
                  "{reflection.metadata.question}"
                </p>
              )}
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {reflection.content}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
