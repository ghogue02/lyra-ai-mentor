import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, Lock, Users, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BrandedButton } from '@/components/ui/BrandedButton';

interface Chapter7SidebarProps {
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
    id: 31, 
    title: "AI-Powered Talent Acquisition",
    subtitle: "Transform your hiring process",
    icon: "🎯",
    color: "orange"
  },
  { 
    id: 32, 
    title: "Performance Insights Workshop",
    subtitle: "Data-driven performance management",
    icon: "📊",
    color: "amber"
  },
  { 
    id: 33, 
    title: "Employee Engagement Builder",
    subtitle: "Personalized engagement strategies",
    icon: "💫",
    color: "orange"
  },
  { 
    id: 34, 
    title: "Retention Strategy Mastery",
    subtitle: "Human-centered retention",
    icon: "🤝",
    color: "amber"
  },
  { 
    id: 35, 
    title: "Team Dynamics Optimizer",
    subtitle: "Building stronger teams",
    icon: "🚀",
    color: "orange"
  },
  { 
    id: 36, 
    title: "Cultural Intelligence Hub",
    subtitle: "Fostering inclusive culture",
    icon: "🌍",
    color: "amber"
  },
  { 
    id: 37, 
    title: "Leadership Development Lab",
    subtitle: "Developing future leaders",
    icon: "👑",
    color: "orange"
  }
];

export const Chapter7Sidebar: React.FC<Chapter7SidebarProps> = ({ 
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
      navigate(`/chapter/7/lesson/${lessonId}`);
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
    <div className="w-80 h-screen bg-gradient-to-b from-orange-50 to-amber-50 border-r border-orange-200 flex flex-col">
      {/* Neumorphic Chapter Header */}
      <div className="p-6 border-b border-orange-200 bg-white rounded-b-2xl shadow-[0_4px_8px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">Chapter 7</h2>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          AI-Powered People Management
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Join Carmen as she revolutionizes HR with AI efficiency and human empathy
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
                  lesson.color === 'orange' && "border-orange-400",
                  lesson.color === 'amber' && "border-amber-400"
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
                            status === 'completed' ? "bg-green-500" : "bg-orange-500"
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
      <div className="p-4 border-t border-orange-200 bg-white rounded-t-2xl shadow-[inset_4px_4px_8px_#e5e7eb,inset_-4px_-4px_8px_#ffffff] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Chapter Progress</span>
          <span className="text-sm text-gray-600">
            {progress.filter(p => p.completed).length}/{lessons.length} lessons
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ 
              width: `${(progress.filter(p => p.completed).length / lessons.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="p-4 border-t border-orange-200">
        <BrandedButton 
          onClick={() => navigate('/dashboard')} 
          variant="outline" 
          className="w-full flex items-center gap-2 hover:bg-orange-50 border-orange-200"
          icon="mission"
          animated={true}
        >
          Return to Dashboard
        </BrandedButton>
      </div>

      {/* Character Quote */}
      <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-100 border-t border-orange-200">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm italic text-gray-700">
            "Technology amplifies human potential when we remember that behind every data point is a person with dreams and aspirations."
          </p>
        </div>
        <p className="text-xs text-gray-600 mt-1 text-right">— Carmen Rodriguez</p>
      </div>
    </div>
  );
};