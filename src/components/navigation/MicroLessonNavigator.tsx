import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, BookOpen } from 'lucide-react';

interface MicroLessonNavigatorProps {
  chapterNumber: number;
  chapterTitle: string;
  lessonTitle: string;
  characterName?: string;
}

export const MicroLessonNavigator: React.FC<MicroLessonNavigatorProps> = ({
  chapterNumber,
  chapterTitle,
  lessonTitle,
  characterName
}) => {
  const navigate = useNavigate();

  const handleBackToChapter = () => {
    navigate(`/chapter/${chapterNumber}`);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 mb-6">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back to chapter button */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleBackToChapter}
              className="hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to {chapterTitle}
            </Button>
            
            <div className="hidden sm:block text-muted-foreground">|</div>
            
            <div className="hidden sm:flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs">
                Chapter {chapterNumber}
              </Badge>
              {characterName && (
                <Badge variant="outline" className="text-xs">
                  {characterName}
                </Badge>
              )}
            </div>
          </div>

          {/* Right side - Lesson title */}
          <div className="flex items-center">
            <h2 className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
              {lessonTitle}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};