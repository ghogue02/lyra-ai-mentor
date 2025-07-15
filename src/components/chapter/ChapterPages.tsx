import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { ChapterOverview } from './ChapterOverview';
import { LessonNavigator } from './LessonNavigator';
import Lesson from '@/pages/Lesson';

// Chapter Overview Page Component
export const ChapterOverviewPage = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { user } = useAuth();
  const [chapter, setChapter] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchChapterData = async () => {
      if (!chapterId) return;
      
      try {
        // Fetch chapter details
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', parseInt(chapterId))
          .eq('is_published', true)
          .single();

        if (chapterError) {
          console.error('Error fetching chapter:', chapterError);
          setLoading(false);
          return;
        }
        
        // Fetch lessons for this chapter
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('chapter_id', parseInt(chapterId))
          .eq('is_published', true)
          .order('order_index');

        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
        }
        
        // Get progress for each lesson if user is logged in
        if (user && lessonsData) {
          const lessonIds = lessonsData.map(l => l.id);
          const { data: progressData, error: progressError } = await supabase
            .from('lesson_progress')
            .select('lesson_id, progress_percentage, completed')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds);
          
          if (progressError) {
            console.error('Error fetching progress:', progressError);
          }
          
          // Merge progress data with lessons
          const lessonsWithProgress = lessonsData.map(lesson => {
            const progress = progressData?.find(p => p.lesson_id === lesson.id);
            return {
              ...lesson,
              progress: progress?.progress_percentage || 0,
              is_completed: progress?.completed || false
            };
          });
          
          setLessons(lessonsWithProgress);
        } else {
          setLessons(lessonsData || []);
        }
        
        setChapter(chapterData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChapterData();
  }, [chapterId, user]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Chapter not found</h1>
          <p className="text-gray-600">The chapter you're looking for doesn't exist or isn't published yet.</p>
        </div>
      </div>
    );
  }
  
  // Get character info based on chapter
  const characterProfiles = {
    2: {
      name: "Maya Rodriguez",
      role: "Program Director",
      organization: "Hope Gardens Community Center",
      narrativeArc: {
        overallJourney: "Transform from overwhelmed administrator to confident AI-powered leader",
        currentMilestone: "Ready to revolutionize daily workflows"
      }
    },
    3: {
      name: "Sofia Martinez",
      role: "Development Director",
      organization: "Community Arts Foundation",
      narrativeArc: {
        overallJourney: "From struggling storyteller to master communicator",
        currentMilestone: "Ready to amplify your mission's voice"
      }
    },
    // Add more chapters as needed
  };
  
  const profile = characterProfiles[chapter.id] || {};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar />
      <ChapterOverview
        chapter={chapter}
        lessons={lessons}
        characterName={profile.name}
        characterRole={profile.role}
        characterOrganization={profile.organization}
        narrativeArc={profile.narrativeArc}
      />
    </div>
  );
};

// Chapter Lesson Page Component
export const ChapterLessonPage = () => {
  const { chapterId, lessonId } = useParams<{ chapterId: string; lessonId: string }>();
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLessons = async () => {
      if (!chapterId) return;
      
      try {
        const { data: lessonsData, error } = await supabase
          .from('lessons')
          .select('id, title, order_index')
          .eq('chapter_id', parseInt(chapterId))
          .eq('is_published', true)
          .order('order_index');
        
        if (error) {
          console.error('Error fetching lessons:', error);
          setLoading(false);
          return;
        }
        
        // Get completion status if user is logged in
        if (user && lessonsData) {
          const lessonIds = lessonsData.map(l => l.id);
          const { data: progressData, error: progressError } = await supabase
            .from('lesson_progress')
            .select('lesson_id, completed')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds);
          
          if (progressError) {
            console.error('Error fetching progress:', progressError);
          }
          
          const lessonsWithProgress = lessonsData.map(lesson => {
            const progress = progressData?.find(p => p.lesson_id === lesson.id);
            return {
              ...lesson,
              is_completed: progress?.completed || false
            };
          });
          
          setLessons(lessonsWithProgress);
        } else {
          setLessons(lessonsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLessons();
  }, [chapterId, user]);
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar />
      <LessonNavigator
        currentLessonId={parseInt(lessonId || '0')}
        chapterId={parseInt(chapterId || '0')}
        lessons={lessons}
        chapterTitle={`Chapter ${chapterId}`}
      />
      <Lesson />
    </div>
  );
};