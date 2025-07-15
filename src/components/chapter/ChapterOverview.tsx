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
  estimated_duration?: number;
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
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Chapter Progress</h2>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">{completedLessons} / {totalLessons} completed</span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">{overallProgress}% complete</p>
        </div>
      </div>

      {/* Character Profile (if provided) */}
      {characterName && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Meet Your Learning Companion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{characterName}</h3>
                <p className="text-gray-600 mb-2">{characterRole}</p>
                {characterOrganization && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {characterOrganization}
                  </p>
                )}
              </div>
              {narrativeArc && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Your Journey
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{narrativeArc.overallJourney}</p>
                  <p className="text-sm text-purple-600 font-medium">{narrativeArc.currentMilestone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lessons</h2>
        
        {lessons.length > 0 ? (
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <Card 
                key={lesson.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  lesson.is_completed ? 'bg-green-50/50 border-green-200' : 'bg-white/80 hover:bg-white/90'
                }`}
                onClick={() => handleLessonClick(lesson.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        lesson.is_completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {lesson.is_completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{lesson.title}</h3>
                        {lesson.subtitle && (
                          <p className="text-gray-600 text-sm mt-1">{lesson.subtitle}</p>
                        )}
                        {lesson.estimated_duration && (
                          <Badge variant="outline" className="mt-2">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.estimated_duration} min
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {lesson.progress !== undefined && !lesson.is_completed && (
                        <div className="text-right">
                          <Progress value={lesson.progress} className="w-24 h-2 mb-1" />
                          <span className="text-xs text-gray-500">{lesson.progress}%</span>
                        </div>
                      )}
                      <Button 
                        variant={lesson.is_completed ? "outline" : "default"}
                        size="sm"
                        className="flex items-center gap-2"
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
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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