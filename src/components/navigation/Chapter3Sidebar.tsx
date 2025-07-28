import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, Lock, Heart, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BrandedButton } from '@/components/ui/BrandedButton';

interface Chapter3SidebarProps {
  currentLessonId: number;
  onLessonChange?: (lessonId: number) => void;
}

interface LessonProgress {
  lessonId: number;
  completed: boolean;
  progress: number;
}

const lessons = [
  { 
    id: 11, 
    title: "The Silent Crisis",
    subtitle: "Sofia's storytelling awakening",
    icon: "💔",
    color: "rose"
  },
  { 
    id: 12, 
    title: "Finding Her Voice",
    subtitle: "Discovering authentic stories",
    icon: "🎭",
    color: "purple"
  },
  { 
    id: 13, 
    title: "The Breakthrough Story",
    subtitle: "Charlie's transformation",
    icon: "✨",
    color: "indigo"
  },
  { 
    id: 14, 
    title: "Scaling Impact",
    subtitle: "Stories that multiply",
    icon: "🚀",
    color: "blue"
  }
];

export const Chapter3Sidebar: React.FC<Chapter3SidebarProps> = ({ 
  currentLessonId,
  onLessonChange 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed, progress_percentage')
        .eq('user_id', user.id)
        .in('lesson_id', lessons.map(l => l.id));

      if (data) {
        setProgress(data.map(d => ({
          lessonId: d.lesson_id,
          completed: d.completed || false,
          progress: d.progress_percentage || 0
        })));
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = (lessonId: number) => {
    if (onLessonChange) {
      onLessonChange(lessonId);
    } else {
      navigate(`/chapter/3/lesson/${lessonId}`);
    }
  };

  const getLessonStatus = (lessonId: number) => {
    const lessonProgress = progress.find(p => p.lessonId === lessonId);
    
    if (lessonProgress?.completed) {
      return 'completed';
    } else {
      return 'available';
    }
  };

  return (
    <div className="w-80 h-screen bg-gradient-to-b from-rose-50 to-purple-50 border-r border-rose-200 flex flex-col">
      {/* Neumorphic Chapter Header */}
      <div className="p-6 border-b border-rose-200 bg-white rounded-b-2xl shadow-[0_4px_8px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <h2 className="text-lg font-bold text-gray-900">Chapter 3</h2>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
          Communication & Storytelling
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Join Sofia as she transforms from data-focused to story-driven
        </p>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson.id);
          const isActive = currentLessonId === lesson.id;
          const lessonProgress = progress.find(p => p.lessonId === lesson.id);
          
          return (
            <button
              key={lesson.id}
              onClick={() => handleLessonClick(lesson.id)}
              disabled={false}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all duration-300",
                "border-2 backdrop-blur-sm",
                isActive ? [
                  "bg-white shadow-[8px_8px_16px_#e5e7eb,-8px_-8px_16px_#ffffff] scale-[1.02]",
                  lesson.color === 'rose' && "border-rose-400",
                  lesson.color === 'purple' && "border-purple-400",
                  lesson.color === 'indigo' && "border-indigo-400",
                  lesson.color === 'blue' && "border-blue-400"
                ] : [
                  "hover:bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[8px_8px_16px_#e5e7eb,-8px_-8px_16px_#ffffff]",
                  status === 'completed' ? "border-green-300" : "border-gray-200",
                  false
                ]
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{lesson.icon}</span>
                    <h4 className={cn(
                      "font-semibold",
                      isActive ? "text-gray-900" : "text-gray-700"
                    )}>
                      {lesson.title}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {lesson.subtitle}
                  </p>
                  
                  {lessonProgress && lessonProgress.progress > 0 && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            status === 'completed' ? "bg-green-500" : "bg-rose-500"
                          )}
                          style={{ width: `${lessonProgress.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {status === 'completed' ? 'Completed' : `${lessonProgress.progress}% complete`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Neumorphic Chapter Progress Summary */}
      <div className="p-4 border-t border-rose-200 bg-white rounded-t-2xl shadow-[inset_4px_4px_8px_#e5e7eb,inset_-4px_-4px_8px_#ffffff] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Chapter Progress</span>
          <span className="text-sm text-gray-600">
            {progress.filter(p => p.completed).length}/{lessons.length} lessons
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-500"
            style={{ 
              width: `${(progress.filter(p => p.completed).length / lessons.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="p-4 border-t border-rose-200">
        <BrandedButton 
          onClick={() => navigate('/dashboard')} 
          variant="outline" 
          className="w-full flex items-center gap-2 hover:bg-rose-50 border-rose-200"
          icon="mission"
          animated={true}
        >
          Return to Dashboard
        </BrandedButton>
      </div>

      {/* Character Quote */}
      <div className="p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-t border-rose-200">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm italic text-gray-700">
            "Facts tell, but stories sell. Let me show you how to find the heart in every number."
          </p>
        </div>
        <p className="text-xs text-gray-600 mt-1 text-right">— Sofia Martinez</p>
      </div>
    </div>
  );
};