
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChapterIcon } from '@/utils/chapterIcons';

interface Chapter {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  duration: string;
}

interface ChapterCardProps {
  chapter: Chapter;
  isLocked?: boolean;
  isCompleted?: boolean;
  progress?: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ 
  chapter, 
  isLocked = false, 
  isCompleted = false,
  progress = 0
}) => {
  const chapterIconSrc = getChapterIcon(chapter.id);

  return (
    <Card className={cn(
      "border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105",
      isLocked && "opacity-60"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center p-2",
            isLocked 
              ? "bg-gray-200" 
              : "bg-gradient-to-r from-purple-500 to-cyan-500"
          )}>
            {isLocked ? (
              <Lock className="w-6 h-6 text-gray-500" />
            ) : (
              <img 
                src={chapterIconSrc} 
                alt={`Chapter ${chapter.id} icon`}
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="text-xs">
              {chapter.duration}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                Completed
              </Badge>
            )}
          </div>
        </div>
        
        <CardTitle className="text-lg font-semibold mt-4">
          Chapter {chapter.id}: {chapter.title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {chapter.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {!isLocked && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <Button 
          variant={isLocked ? "secondary" : "default"}
          className={cn(
            "w-full",
            !isLocked && "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          )}
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </>
          ) : isCompleted ? (
            "Review Chapter"
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {progress > 0 ? "Continue" : "Start Chapter"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
