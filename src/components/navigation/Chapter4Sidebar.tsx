import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, Lock, BarChart, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BrandedButton } from '@/components/ui/BrandedButton';

interface Chapter4SidebarProps {
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
    id: 15, 
    title: "The Data Graveyard",
    subtitle: "David's awakening moment",
    icon: "💀",
    color: "gray"
  },
  { 
    id: 16, 
    title: "Finding the Story in Numbers",
    subtitle: "Data becomes narrative",
    icon: "📈",
    color: "blue"
  },
  { 
    id: 17, 
    title: "The Million-Dollar Presentation",
    subtitle: "Marcus's transformation",
    icon: "💰",
    color: "green"
  },
  { 
    id: 18, 
    title: "Building the Data Storytelling System",
    subtitle: "Scaling insights",
    icon: "🏗️",
    color: "indigo"
  }
];

export const Chapter4Sidebar: React.FC<Chapter4SidebarProps> = ({ 
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
      navigate(`/chapter/4/lesson/${lessonId}`);
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
    <div className="w-80 h-screen bg-gradient-to-b from-blue-50 to-indigo-50 border-r border-blue-200 flex flex-col">
      {/* Chapter Header */}
      <div className="p-6 border-b border-blue-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <BarChart className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">Chapter 4</h2>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Data & Decision Making
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Join David as he transforms numbers into narratives
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
                "w-full text-left p-4 rounded-lg transition-all duration-200",
                "border-2 backdrop-blur-sm",
                isActive ? [
                  "bg-white shadow-lg scale-[1.02]",
                  lesson.color === 'gray' && "border-gray-400 bg-gray-50",
                  lesson.color === 'blue' && "border-blue-400 bg-blue-50",
                  lesson.color === 'green' && "border-green-400 bg-green-50",
                  lesson.color === 'indigo' && "border-indigo-400 bg-indigo-50"
                ] : [
                  "hover:bg-white/80 hover:shadow-md",
                  status === 'completed' ? "border-green-300 bg-green-50/50" : "border-gray-200 bg-white/50",
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
                            status === 'completed' ? "bg-green-500" : "bg-blue-500"
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

      {/* Chapter Progress Summary */}
      <div className="p-4 border-t border-blue-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Chapter Progress</span>
          <span className="text-sm text-gray-600">
            {progress.filter(p => p.completed).length}/{lessons.length} lessons
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ 
              width: `${(progress.filter(p => p.completed).length / lessons.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="p-4 border-t border-blue-200">
        <BrandedButton 
          onClick={() => navigate('/dashboard')} 
          variant="outline" 
          className="w-full flex items-center gap-2 hover:bg-blue-50 border-blue-200"
          icon="mission"
          animated={true}
        >
          Return to Dashboard
        </BrandedButton>
      </div>

      {/* Character Quote */}
      <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-t border-blue-200">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm italic text-gray-700">
            "Data without story is just noise. Story without data is just opinion. Together, they drive decisions."
          </p>
        </div>
        <p className="text-xs text-gray-600 mt-1 text-right">— David Chen</p>
      </div>
    </div>
  );
};