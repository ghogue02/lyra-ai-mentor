import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, Mail, FileText, Users, Search, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface LessonProgress {
  lessonId: number;
  completed: boolean;
  completedElementsCount: number;
  totalElementsCount: number;
}

interface Chapter2SidebarProps {
  currentLessonId: number;
  onLessonChange?: (lessonId: number) => void;
}

const lessons = [
  { 
    id: 5, 
    title: 'AI Email Assistant', 
    shortTitle: 'Email',
    icon: Mail,
    description: 'Transform email anxiety into confident communication',
    color: 'blue'
  },
  { 
    id: 6, 
    title: 'Document Creation Powerhouse', 
    shortTitle: 'Documents',
    icon: FileText,
    description: 'Master strategic grant proposals and professional documents',
    color: 'purple'
  },
  { 
    id: 7, 
    title: 'Meeting Master', 
    shortTitle: 'Meetings',
    icon: Users,
    description: 'Prepare for high-stakes board meetings with confidence',
    color: 'green'
  },
  { 
    id: 8, 
    title: 'Research & Organization Pro', 
    shortTitle: 'Research',
    icon: Search,
    description: 'Synthesize complex research into actionable insights',
    color: 'orange'
  }
];

export const Chapter2Sidebar: React.FC<Chapter2SidebarProps> = ({
  currentLessonId,
  onLessonChange
}) => {
  const [lessonsProgress, setLessonsProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessonsProgress();
  }, [currentLessonId]);

  const fetchLessonsProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const progressPromises = lessons.map(async (lesson) => {
        // Get total interactive elements for this lesson
        const { data: totalElements } = await supabase
          .from('interactive_elements')
          .select('id')
          .eq('lesson_id', lesson.id)
          .eq('is_active', true);

        // Get completed elements for this lesson
        const { data: completedElements } = await supabase
          .from('interactive_element_progress')
          .select('interactive_element_id')
          .eq('user_id', session.user.id)
          .eq('lesson_id', lesson.id)
          .eq('completed', true);

        const totalCount = totalElements?.length || 0;
        const completedCount = completedElements?.length || 0;
        
        return {
          lessonId: lesson.id,
          completed: completedCount > 0 && completedCount >= totalCount,
          completedElementsCount: completedCount,
          totalElementsCount: totalCount
        };
      });

      const progress = await Promise.all(progressPromises);
      setLessonsProgress(progress);
      
      // Check for automatic progression
      checkAutomaticProgression(progress);
      
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAutomaticProgression = (progress: LessonProgress[]) => {
    // Find current lesson progress
    const currentProgress = progress.find(p => p.lessonId === currentLessonId);
    
    // If current lesson is completed, check if we should auto-progress
    if (currentProgress?.completed) {
      const nextLesson = lessons.find(l => l.id > currentLessonId);
      
      if (nextLesson && currentLessonId < 8) {
        // Auto-progress after a short delay to let user see completion
        setTimeout(() => {
          handleLessonClick(nextLesson.id);
        }, 2000);
      }
    }
  };

  const handleLessonClick = (lessonId: number) => {
    if (onLessonChange) {
      onLessonChange(lessonId);
    } else {
      // Navigate to lesson URL with chapter ID (Chapter 2 lessons are 5-8)
      navigate(`/chapter/2/lesson/${lessonId}`);
    }
  };

  const getLessonProgress = (lessonId: number): LessonProgress | null => {
    return lessonsProgress.find(p => p.lessonId === lessonId) || null;
  };

  const getProgressPercentage = (progress: LessonProgress | null): number => {
    if (!progress || progress.totalElementsCount === 0) return 0;
    return Math.round((progress.completedElementsCount / progress.totalElementsCount) * 100);
  };

  const getColorClasses = (color: string, isActive: boolean, isCompleted: boolean) => {
    const baseClasses = 'transition-all duration-200';
    
    if (isCompleted) {
      return `${baseClasses} bg-green-50 border-green-200 hover:bg-green-100`;
    }
    
    if (isActive) {
      switch (color) {
        case 'blue': return `${baseClasses} bg-blue-50 border-blue-300 shadow-md`;
        case 'purple': return `${baseClasses} bg-purple-50 border-purple-300 shadow-md`;
        case 'green': return `${baseClasses} bg-green-50 border-green-300 shadow-md`;
        case 'orange': return `${baseClasses} bg-orange-50 border-orange-300 shadow-md`;
        default: return `${baseClasses} bg-gray-50 border-gray-300 shadow-md`;
      }
    }
    
    return `${baseClasses} bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300`;
  };

  const getIconColor = (color: string, isActive: boolean, isCompleted: boolean) => {
    if (isCompleted) return 'text-green-600';
    if (isActive) {
      switch (color) {
        case 'blue': return 'text-blue-600';
        case 'purple': return 'text-purple-600';
        case 'green': return 'text-green-600';
        case 'orange': return 'text-orange-600';
        default: return 'text-gray-600';
      }
    }
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="w-80 p-4 space-y-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Neumorphic Header */}
      <div className="text-center mb-6 bg-white rounded-2xl p-6 shadow-[8px_8px_16px_#e5e7eb,-8px_-8px_16px_#ffffff] border border-gray-100/50">
        <h2 className="text-xl font-bold text-gray-800">Chapter 2: AI for Your Daily Work</h2>
        <p className="text-sm text-gray-600 mt-1">Follow Maya's transformation journey</p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => {
          const progress = getLessonProgress(lesson.id);
          const isActive = lesson.id === currentLessonId;
          const isCompleted = progress?.completed || false;
          const progressPercentage = getProgressPercentage(progress);
          const IconComponent = lesson.icon;

          return (
            <Card 
              key={lesson.id}
              className={`cursor-pointer border-2 transition-all duration-300 rounded-2xl ${
                isCompleted 
                  ? 'bg-white shadow-[8px_8px_16px_#e5e7eb,-8px_-8px_16px_#ffffff] border-green-200'
                  : isActive
                  ? 'bg-white shadow-[8px_8px_16px_#e5e7eb,-8px_-8px_16px_#ffffff] border-blue-300'
                  : 'bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] border-gray-200 hover:shadow-[8px_8px_16px_#e5e7eb,-8px_-8px_16px_#ffffff]'
              }`}
              onClick={() => handleLessonClick(lesson.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <IconComponent className={`w-6 h-6 ${getIconColor(lesson.color, isActive, isCompleted)}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        L{lesson.id}: {lesson.shortTitle}
                      </h3>
                      {isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {lesson.description}
                    </p>
                    
                    {progress && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                isCompleted ? 'bg-green-500' : `bg-${lesson.color}-500`
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {progress.completedElementsCount}/{progress.totalElementsCount}
                          </span>
                        </div>
                        
                        {isCompleted && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                            Complete
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isActive && !isCompleted && (
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Neumorphic Dashboard Button */}
      <div className="mt-6">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="outline" 
          className="w-full flex items-center gap-2 bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] border-gray-200 transition-all duration-300"
        >
          <Home className="w-4 h-4" />
          Return to Dashboard
        </Button>
      </div>

      {/* Neumorphic Progress Summary */}
      <div className="mt-4 p-4 bg-white rounded-2xl shadow-[inset_4px_4px_8px_#e5e7eb,inset_-4px_-4px_8px_#ffffff] border border-blue-200/30">
        <div className="text-center">
          <h4 className="text-sm font-semibold text-blue-800 mb-1">Maya's Progress</h4>
          <p className="text-xs text-blue-600">
            {lessonsProgress.filter(p => p.completed).length}/{lessons.length} lessons mastered
          </p>
        </div>
      </div>
    </div>
  );
};