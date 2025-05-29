
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChapterIconUrl, getUIStateIconUrl } from '@/utils/supabaseIcons';

interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
}

interface ChapterCardProps {
  chapter: Chapter;
  isLocked?: boolean;
  isCompleted?: boolean;
  progress?: number;
  isPlaceholder?: boolean;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ 
  chapter, 
  isLocked = false, 
  isCompleted = false,
  progress = 0,
  isPlaceholder = false
}) => {
  const chapterIconSrc = getChapterIconUrl(chapter.id);
  const lockIconSrc = getUIStateIconUrl('lockState');

  const getButtonText = () => {
    if (isPlaceholder) {
      return "Coming Soon";
    }
    if (isLocked) {
      return "Complete Previous Chapter";
    }
    if (isCompleted) {
      return "Review Chapter";
    }
    if (progress > 0) {
      return "Continue";
    }
    return "Start Chapter";
  };

  const getButtonIcon = () => {
    if (isPlaceholder) {
      return <Lock className="w-4 h-4 mr-2" />;
    }
    if (!isLocked) {
      return <Play className="w-4 h-4 mr-2" />;
    }
    return null;
  };

  return (
    <Card className={cn(
      "border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300",
      (isLocked || isPlaceholder) ? "opacity-60" : "transform hover:scale-105"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-20 h-20 rounded-xl flex items-center justify-center shadow-md border",
            (isLocked || isPlaceholder)
              ? "bg-white border-gray-200" 
              : "bg-white border-gray-100"
          )}>
            {(isLocked || isPlaceholder) ? (
              <img 
                src={lockIconSrc} 
                alt="Locked chapter"
                className="w-12 h-12 object-contain opacity-60"
              />
            ) : (
              <img 
                src={chapterIconSrc} 
                alt={`Chapter ${chapter.id} icon`}
                className="w-16 h-16 object-contain rounded-lg"
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
            {isPlaceholder && (
              <Badge variant="outline" className="text-xs">
                Preview
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
        {!isLocked && !isPlaceholder && progress > 0 && (
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
          variant={isLocked || isPlaceholder ? "secondary" : "default"}
          className={cn(
            "w-full",
            !isLocked && !isPlaceholder && "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          )}
          disabled={isLocked || isPlaceholder}
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
};
