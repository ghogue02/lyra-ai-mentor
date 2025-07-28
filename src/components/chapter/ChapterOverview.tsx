import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play, 
  User,
  Building,
  Target,
  Trophy
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  order_index: number;
  progress?: number;
  is_completed?: boolean;
}

interface Chapter {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  icon?: string;
}

interface NarrativeArc {
  overallJourney: string;
  currentMilestone: string;
}

interface ChapterOverviewProps {
  chapter: Chapter;
  lessons: Lesson[];
  characterName?: string;
  characterRole?: string;
  characterOrganization?: string;
  narrativeArc?: NarrativeArc;
}

export const ChapterOverview: React.FC<ChapterOverviewProps> = ({
  chapter,
  lessons,
  characterName,
  characterRole,
  characterOrganization,
  narrativeArc
}) => {
  const navigate = useNavigate();

  const completedLessons = lessons.filter(lesson => lesson.is_completed).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleLessonClick = (lessonId: number) => {
    navigate(`/chapter/${chapter.id}/lesson/${lessonId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackToDashboard}
        className="mb-6 hover:bg-white/50"
      >
        ← Back to Dashboard
      </Button>

      {/* Chapter Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {chapter.icon && (
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
              {chapter.icon}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{chapter.title}</h1>
            {chapter.description && (
              <p className="text-gray-600 mt-2 text-lg">{chapter.description}</p>
            )}
            {chapter.duration && (
              <Badge variant="outline" className="mt-2">
                <Clock className="w-3 h-3 mr-1" />
                {chapter.duration}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="neu-card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Chapter Progress</h2>
            <div className="neu-text-container px-4 py-2 flex items-center gap-3">
              <div className="neu-character w-8 h-8 bg-yellow-50 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-700">{completedLessons} / {totalLessons} completed</span>
            </div>
          </div>
          <div className="neu-progress p-2 h-6 mb-3">
            <div 
              className="neu-progress-fill h-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 font-medium">{overallProgress}% complete</p>
        </div>
      </div>

      {/* Character Profile (if provided) */}
      {characterName && (
        <div className="neu-card p-8 mb-8 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="neu-character w-10 h-10 bg-blue-50 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Meet Your Learning Companion</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="neu-text-container p-6">
              <h3 className="font-bold text-lg mb-3 text-gray-800">{characterName}</h3>
              <p className="text-gray-600 mb-3 font-medium">{characterRole}</p>
              {characterOrganization && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="neu-character w-6 h-6 bg-gray-50 flex items-center justify-center">
                    <Building className="w-3 h-3" />
                  </div>
                  <span>{characterOrganization}</span>
                </div>
              )}
            </div>
            {narrativeArc && (
              <div className="neu-text-container p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="neu-character w-6 h-6 bg-purple-50 flex items-center justify-center">
                    <Target className="w-3 h-3 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Your Journey</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{narrativeArc.overallJourney}</p>
                <div className="neu-inset p-3">
                  <p className="text-sm text-purple-700 font-semibold">{narrativeArc.currentMilestone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lessons</h2>
        
        {lessons.length > 0 ? (
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={cn(
                  "neu-card neu-card-hover p-6 cursor-pointer transition-all duration-300",
                  lesson.is_completed && "border-l-4 border-l-green-500"
                )}
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "neu-character w-14 h-14 flex items-center justify-center font-bold text-lg",
                      lesson.is_completed 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-gray-50 text-gray-600'
                    )}>
                      {lesson.is_completed ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{lesson.title}</h3>
                      {lesson.subtitle && (
                        <p className="text-gray-600 text-sm mb-3">{lesson.subtitle}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {lesson.progress !== undefined && !lesson.is_completed && (
                      <div className="text-right">
                        <div className="neu-progress w-24 h-3 p-0.5 mb-2">
                          <div 
                            className="neu-progress-fill h-full transition-all duration-300"
                            style={{ width: `${lesson.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{lesson.progress}%</span>
                      </div>
                    )}
                    <button 
                      className={cn(
                        "neu-button px-4 py-2 font-semibold flex items-center gap-2",
                        lesson.is_completed 
                          ? "text-blue-700 bg-blue-50" 
                          : "text-green-700 bg-green-50"
                      )}
                    >
                      {lesson.is_completed ? (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No lessons available</h3>
            <p className="text-gray-500">This chapter is still being prepared.</p>
          </div>
        )}
      </div>
    </div>
  );
};