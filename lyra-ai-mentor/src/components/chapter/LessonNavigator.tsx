import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface Lesson {
  id: number;
  title: string;
  is_completed?: boolean;
  order_index: number;
}

interface LessonNavigatorProps {
  currentLessonId: number;
  chapterId: number;
  lessons: Lesson[];
  chapterTitle?: string;
  onLessonChange?: (lessonId: number) => void;
}

export const LessonNavigator: React.FC<LessonNavigatorProps> = ({
  currentLessonId,
  chapterId,
  lessons,
  chapterTitle = "Chapter",
  onLessonChange
}) => {
  const navigate = useNavigate();
  
  // Sort lessons by order_index
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);
  
  // Find current lesson index
  const currentIndex = sortedLessons.findIndex(l => l.id === currentLessonId);
  const currentLesson = sortedLessons[currentIndex];
  const previousLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
  
  const handleNavigation = (lessonId: number) => {
    if (onLessonChange) {
      onLessonChange(lessonId);
    } else {
      navigate(`/chapter/${chapterId}/lesson/${lessonId}`);
    }
  };
  
  const getStoryHint = (fromLesson: Lesson | null, toLesson: Lesson | null): string => {
    if (!fromLesson || !toLesson) return '';
    
    // Story continuity hints based on lesson progression
    const hints: { [key: string]: string } = {
      "5-6": "With email mastered, Maya faces her next challenge...",
      "6-7": "Documents flowing smoothly, but Maya's calendar tells a different story...",
      "7-8": "Meetings under control, Maya tackles her final frontier..."
    };
    
    return hints[`${fromLesson.id}-${toLesson.id}`] || '';
  };
  
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <div className="flex-1">
            {previousLesson ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(previousLesson.id)}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/chapter/${chapterId}`)}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Chapter Overview</span>
              </Button>
            )}
          </div>
          
          {/* Center Progress Indicator */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Lesson {currentIndex + 1} of {sortedLessons.length}
                  </span>
                  <span className="sm:hidden">{currentIndex + 1}/{sortedLessons.length}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                <DropdownMenuLabel>{chapterTitle}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortedLessons.map((lesson, index) => {
                  const isAccessible = index === 0 || sortedLessons[index - 1].is_completed;
                  const isCurrent = lesson.id === currentLessonId;
                  
                  return (
                    <DropdownMenuItem
                      key={lesson.id}
                      onClick={() => isAccessible && !isCurrent && handleNavigation(lesson.id)}
                      disabled={!isAccessible || isCurrent}
                      className={cn(
                        "cursor-pointer",
                        isCurrent && "bg-primary/10",
                        !isAccessible && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-muted-foreground w-6">
                          {index + 1}.
                        </span>
                        <span className="flex-1 text-sm">{lesson.title}</span>
                        {lesson.is_completed && (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Next Button */}
          <div className="flex-1 flex justify-end">
            {nextLesson ? (
              <div className="flex flex-col items-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(nextLesson.id)}
                  className="gap-2"
                  disabled={!currentLesson?.is_completed}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {currentLesson?.is_completed && (
                  <p className="text-xs text-muted-foreground max-w-[200px] text-right hidden md:block">
                    {getStoryHint(currentLesson, nextLesson)}
                  </p>
                )}
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/chapter/${chapterId}`)}
                className="gap-2"
                disabled={!currentLesson?.is_completed}
              >
                <span className="hidden sm:inline">Complete Chapter</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / sortedLessons.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};