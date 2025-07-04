import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  order_index: number;
  is_completed?: boolean;
  progress?: number;
}

interface Chapter {
  id: number;
  title: string;
  description?: string;
}

interface ChapterOverviewProps {
  chapter: Chapter;
  lessons: Lesson[];
  characterName?: string;
  characterRole?: string;
  characterOrganization?: string;
  narrativeArc?: {
    overallJourney: string;
    currentMilestone?: string;
  };
}

export const ChapterOverview: React.FC<ChapterOverviewProps> = ({
  chapter,
  lessons,
  characterName = "Maya Rodriguez",
  characterRole = "Program Director",
  characterOrganization = "Hope Gardens Community Center",
  narrativeArc
}) => {
  const navigate = useNavigate();
  
  // Calculate overall chapter progress
  const completedLessons = lessons.filter(l => l.is_completed).length;
  const totalLessons = lessons.length;
  const chapterProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  // Calculate total time
  const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
  
  const handleLessonClick = (lessonId: number) => {
    navigate(`/chapter/${chapter.id}/lesson/${lessonId}`);
  };
  
  const getStoryPhase = (index: number): string => {
    const phases = ['The Challenge', 'The Discovery', 'The Practice', 'The Transformation'];
    return phases[index] || `Part ${index + 1}`;
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Chapter Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{chapter.title}</h1>
        {chapter.description && (
          <p className="text-lg text-muted-foreground">{chapter.description}</p>
        )}
      </div>
      
      {/* Character Introduction Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">Your Guide: {characterName}</CardTitle>
          <CardDescription className="text-base">
            {characterRole} at {characterOrganization}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {narrativeArc && (
            <div className="space-y-3">
              <p className="text-base">{narrativeArc.overallJourney}</p>
              <div className="flex items-center gap-4">
                <Progress value={chapterProgress} className="flex-1" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {completedLessons} of {totalLessons} lessons
                </span>
              </div>
              {narrativeArc.currentMilestone && (
                <p className="text-sm text-purple-700 font-medium">
                  Current: {narrativeArc.currentMilestone}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Lessons Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Learning Journey</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{totalDuration} minutes total</span>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.sort((a, b) => a.order_index - b.order_index).map((lesson, index) => {
            const isAccessible = index === 0 || lessons[index - 1].is_completed;
            const storyPhase = getStoryPhase(index);
            
            return (
              <Card 
                key={lesson.id}
                className={cn(
                  "transition-all cursor-pointer hover:shadow-lg",
                  lesson.is_completed && "border-green-200 bg-green-50/50",
                  !isAccessible && "opacity-60 cursor-not-allowed"
                )}
                onClick={() => isAccessible && handleLessonClick(lesson.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-purple-600">{storyPhase}</p>
                      <CardTitle className="text-xl">{lesson.title}</CardTitle>
                    </div>
                    <div className="ml-4">
                      {lesson.is_completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : !isAccessible ? (
                        <Lock className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {lesson.description && (
                    <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {lesson.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{lesson.duration} min</span>
                        </div>
                      )}
                      {lesson.progress !== undefined && lesson.progress > 0 && !lesson.is_completed && (
                        <span className="text-purple-600 font-medium">{lesson.progress}% complete</span>
                      )}
                    </div>
                    
                    <Button
                      variant={lesson.is_completed ? "outline" : "default"}
                      size="sm"
                      disabled={!isAccessible}
                      onClick={(e) => {
                        e.stopPropagation();
                        isAccessible && handleLessonClick(lesson.id);
                      }}
                    >
                      {lesson.is_completed ? 'Review' : index === 0 || lessons[index - 1].is_completed ? 'Start' : 'Locked'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Story Preview */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>What You'll Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Skills You'll Master:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>AI-powered email communication</li>
                <li>Rapid document creation</li>
                <li>Efficient meeting management</li>
                <li>Smart research techniques</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Real Impact:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Save 2+ hours daily</li>
                <li>Strengthen stakeholder relationships</li>
                <li>Increase program effectiveness</li>
                <li>Lead with confidence</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};