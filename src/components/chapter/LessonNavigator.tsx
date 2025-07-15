import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  order_index: number;
  is_completed?: boolean;
}

interface LessonNavigatorProps {
  currentLessonId: number;
  chapterId: number;
  lessons: Lesson[];
  chapterTitle: string;
}

export const LessonNavigator: React.FC<LessonNavigatorProps> = ({
  currentLessonId,
  chapterId,
  lessons,
  chapterTitle
}) => {
  const navigate = useNavigate();
  
  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
  const currentLesson = lessons[currentLessonIndex];
  const previousLesson = lessons[currentLessonIndex - 1];
  const nextLesson = lessons[currentLessonIndex + 1];

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/chapter/${chapterId}/lesson/${previousLesson.id}`);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/chapter/${chapterId}/lesson/${nextLesson.id}`);
    }
  };

  const handleBackToChapter = () => {
    navigate(`/chapter/${chapterId}`);
  };

  if (!currentLesson) {
    return null;
  }

  return (
    <div className="sticky top-20 z-10 bg-white/95 backdrop-blur-lg border-b border-purple-100/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Chapter info and back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBackToChapter}
              className="hover:bg-white/50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {chapterTitle}
            </Button>
            <div className="hidden sm:block text-gray-400">|</div>
            <div className="hidden sm:flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Lesson {currentLessonIndex + 1} of {lessons.length}
              </span>
            </div>
          </div>

          {/* Center - Current lesson title */}
          <div className="flex items-center gap-2 mx-4">
            <h2 className="font-semibold text-gray-800 truncate max-w-xs">
              {currentLesson.title}
            </h2>
            {currentLesson.is_completed && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Right side - Navigation buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousLesson}
              disabled={!previousLesson}
              className="hidden sm:flex"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNextLesson}
              disabled={!nextLesson}
              className="hidden sm:flex"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            
            {/* Mobile navigation */}
            <div className="flex sm:hidden gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousLesson}
                disabled={!previousLesson}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleNextLesson}
                disabled={!nextLesson}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-3">
          <div className="flex space-x-1">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                  index < currentLessonIndex
                    ? 'bg-green-500' // Completed
                    : index === currentLessonIndex
                    ? 'bg-purple-500' // Current
                    : 'bg-gray-200' // Not started
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};