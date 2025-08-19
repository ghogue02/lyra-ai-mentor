import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, Users, Target, BookOpen, ArrowLeft, CheckCircle2, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  iconType: string;
  route: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  unlocked: boolean;
  progress?: number;
  category?: string;
  tags?: string[];
  estimatedTime?: string;
}

interface ChapterHubLayoutProps {
  title: string;
  description: string;
  characterName: string;
  microLessons: MicroLesson[];
  onLessonSelect: (lesson: MicroLesson) => void;
  completedCount: number;
  totalCount: number;
}

export const ChapterHubLayout: React.FC<ChapterHubLayoutProps> = ({
  title,
  description,
  characterName,
  microLessons,
  onLessonSelect,
  completedCount,
  totalCount
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'lessons'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [guidedMode, setGuidedMode] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  const progressPercentage = (completedCount / totalCount) * 100;
  const categories = [...new Set(microLessons.map(lesson => lesson.category).filter(Boolean))];
  
  const filteredLessons = selectedCategory 
    ? microLessons.filter(lesson => lesson.category === selectedCategory)
    : microLessons;

  // Guided mode logic
  const nextUncompletedLesson = microLessons.find(lesson => !lesson.completed && lesson.unlocked);
  const suggestedLesson = guidedMode ? nextUncompletedLesson || microLessons[currentLessonIndex] : null;

  useEffect(() => {
    if (guidedMode && nextUncompletedLesson) {
      const index = microLessons.findIndex(lesson => lesson.id === nextUncompletedLesson.id);
      setCurrentLessonIndex(index);
    }
  }, [guidedMode, nextUncompletedLesson, microLessons]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '🌱';
      case 'Intermediate': return '🚀';
      case 'Advanced': return '💎';
      default: return '📝';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'recruitment': '👥',
      'workshop': '🛠️',
      'lab': '🔬',
      'mastery': '🎯',
      'optimization': '⚡',
      'culture': '🌍',
      'development': '📈'
    };
    return icons[category] || '📚';
  };

  if (activeView === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Hero Section with Clear Hierarchy */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Primary Title */}
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {title}
            </h1>
            
            {/* Secondary Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
            
            {/* Progress Overview Card */}
            <Card className="max-w-2xl mx-auto mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-gray-900">Your Progress</h3>
                    <p className="text-gray-600">with {characterName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">{completedCount}/{totalCount}</div>
                    <p className="text-sm text-gray-500">lessons completed</p>
                  </div>
                </div>
                
                <Progress value={progressPercentage} className="h-3 mb-4" />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{Math.round(progressPercentage)}% complete</span>
                  <span>{totalCount - completedCount} remaining</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Primary CTA with Guided Mode */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
              <Button 
                onClick={() => setActiveView('lessons')}
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
              >
                Browse All Lessons
                <BookOpen className="ml-2 w-5 h-5" />
              </Button>
              
              {nextUncompletedLesson && (
                <Button 
                  onClick={() => {
                    setGuidedMode(true);
                    setActiveView('lessons');
                  }}
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  Continue Learning
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Time Investment</h3>
                <p className="text-gray-600">~2-3 hours total</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Learning Style</h3>
                <p className="text-gray-600">Interactive & Practical</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Real Impact</h3>
                <p className="text-gray-600">Immediate application</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Enhanced Header with Navigation and Guided Mode */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setActiveView('overview');
                  setGuidedMode(false);
                }}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{characterName}'s Lessons</h1>
                  {guidedMode && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      Guided Mode
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{completedCount} of {totalCount} completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          
          {/* Guided Mode Banner */}
          {guidedMode && suggestedLesson && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">Next Recommended</p>
                    <p className="text-sm text-orange-700">{suggestedLesson.title}</p>
                  </div>
                </div>
                <Button
                  onClick={() => onLessonSelect(suggestedLesson)}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Start Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Controls: Category Filter + View Options */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant={!guidedMode ? "default" : "outline"}
                onClick={() => setGuidedMode(false)}
                size="sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Mode
              </Button>
              <Button
                variant={guidedMode ? "default" : "outline"}
                onClick={() => setGuidedMode(true)}
                size="sm"
              >
                <Target className="w-4 h-4 mr-2" />
                Guided Mode
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full text-sm"
              size="sm"
            >
              All Lessons ({microLessons.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full capitalize text-sm"
                size="sm"
              >
                {getCategoryIcon(category)} {category} ({microLessons.filter(l => l.category === category).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Responsive Lessons Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredLessons.map((lesson, index) => (
            <Card 
              key={lesson.id}
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                "bg-white/80 backdrop-blur-sm border-0 shadow-md",
                lesson.completed && "bg-green-50/80 border-green-200",
                !lesson.unlocked && "opacity-50 cursor-not-allowed",
                guidedMode && suggestedLesson?.id === lesson.id && "ring-2 ring-orange-400 ring-offset-2",
                "min-h-[280px] sm:min-h-[320px]" // Responsive height
              )}
              onClick={() => lesson.unlocked && onLessonSelect(lesson)}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                {/* Enhanced Lesson Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getDifficultyColor(lesson.difficulty))}
                      >
                        {getDifficultyIcon(lesson.difficulty)} {lesson.difficulty}
                      </Badge>
                      {lesson.category && (
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryIcon(lesson.category)} {lesson.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {guidedMode && suggestedLesson?.id === lesson.id && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                        Recommended
                      </Badge>
                    )}
                    {lesson.completed && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {lesson.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                {/* Progress Bar */}
                {lesson.progress && lesson.progress > 0 && (
                  <div className="mb-4">
                    <Progress value={lesson.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{lesson.progress}% complete</p>
                  </div>
                )}

                {/* Tags */}
                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lesson.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                    {lesson.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        +{lesson.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Enhanced Action Section */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {lesson.estimatedTime || '15-20 min'}
                      </span>
                    </div>
                    {lesson.unlocked ? (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    ) : (
                      <span className="text-xs text-gray-400">Coming Soon</span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Button
                    className={cn(
                      "w-full text-sm",
                      lesson.completed
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : guidedMode && suggestedLesson?.id === lesson.id
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                    disabled={!lesson.unlocked}
                    variant="ghost"
                  >
                    {lesson.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Review Lesson
                      </>
                    ) : guidedMode && suggestedLesson?.id === lesson.id ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Now
                      </>
                    ) : lesson.unlocked ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Lesson
                      </>
                    ) : (
                      'Locked'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};