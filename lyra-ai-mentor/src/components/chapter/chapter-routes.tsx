import { Routes, Route } from 'react-router-dom';
import { ChapterOverview } from './ChapterOverview';
import { Lesson } from '@/pages/Lesson';

/**
 * Chapter Routing Configuration
 * 
 * This establishes the pattern for multi-lesson chapter navigation:
 * - /chapter/:chapterId - Shows chapter overview with all lessons
 * - /chapter/:chapterId/lesson/:lessonId - Shows specific lesson
 * 
 * The existing /lesson/:lessonId route remains for backward compatibility
 */

export const ChapterRoutes = () => {
  return (
    <Routes>
      {/* Chapter overview - shows all lessons in a chapter */}
      <Route path="/:chapterId" element={<ChapterOverviewPage />} />
      
      {/* Specific lesson within a chapter */}
      <Route path="/:chapterId/lesson/:lessonId" element={<ChapterLessonPage />} />
    </Routes>
  );
};

// Wrapper components to fetch data and pass to presentation components

const ChapterOverviewPage = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchChapterData = async () => {
      if (!chapterId) return;
      
      // Fetch chapter details
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', parseInt(chapterId))
        .single();
      
      // Fetch lessons for this chapter
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('chapter_id', parseInt(chapterId))
        .order('order_index');
      
      // Get progress for each lesson if user is logged in
      if (user) {
        const lessonIds = lessonsData?.map(l => l.id) || [];
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('lesson_id, progress_percentage, completed')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds);
        
        // Merge progress data with lessons
        const lessonsWithProgress = lessonsData?.map(lesson => {
          const progress = progressData?.find(p => p.lesson_id === lesson.id);
          return {
            ...lesson,
            progress: progress?.progress_percentage || 0,
            is_completed: progress?.completed || false
          };
        });
        
        setLessons(lessonsWithProgress || []);
      } else {
        setLessons(lessonsData || []);
      }
      
      setChapter(chapterData);
      setLoading(false);
    };
    
    fetchChapterData();
  }, [chapterId, user]);
  
  if (loading) {
    return <div>Loading chapter...</div>;
  }
  
  if (!chapter) {
    return <div>Chapter not found</div>;
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
    <div>
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

const ChapterLessonPage = () => {
  const { chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // Special handling for Chapter 1 - render LyraIntroductionJourney directly
  if (chapterId === '1') {
    return (
      <div>
        <Navbar />
        <LyraIntroductionJourney />
      </div>
    );
  }
  
  // For other chapters, use the regular lesson flow
  const [lessons, setLessons] = useState([]);
  
  useEffect(() => {
    const fetchLessons = async () => {
      if (!chapterId) return;
      
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, title, order_index')
        .eq('chapter_id', parseInt(chapterId))
        .order('order_index');
      
      // Get completion status if user is logged in
      if (user && lessonsData) {
        const lessonIds = lessonsData.map(l => l.id);
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds);
        
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
    };
    
    fetchLessons();
  }, [chapterId, user]);
  
  return (
    <div>
      <Navbar />
      <LessonNavigator
        currentLessonId={parseInt(lessonId)}
        chapterId={parseInt(chapterId)}
        lessons={lessons}
        chapterTitle={`Chapter ${chapterId}`}
      />
      <Lesson />
    </div>
  );
};

// Update imports needed
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { LessonNavigator } from './LessonNavigator';
import LyraIntroductionJourney from '@/components/lesson/chat/lyra/LyraIntroductionJourney';