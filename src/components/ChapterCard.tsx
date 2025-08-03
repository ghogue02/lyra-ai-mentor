
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
    <div className={cn(
      "nm-card min-h-96 flex flex-col p-6", // Increased minimum height for full descriptions
      (isLocked || isPlaceholder) ? "opacity-60" : ""
    )}>
      <div className="pb-4 flex-shrink-0">
        <div className="flex flex-col items-center">
          <div className={cn(
            "nm-icon w-20 h-20 flex items-center justify-center mb-2",
            (isLocked || isPlaceholder) ? "opacity-60" : ""
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
          
          <div className="flex flex-col items-center gap-2">
            {isCompleted && (
              <div className="nm-badge-secondary text-xs px-2 py-1">
                Completed
              </div>
            )}
            {isPlaceholder && (
              <div className="nm-badge text-xs px-2 py-1">
                Preview
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mt-4 leading-tight">
          Chapter {chapter.id}: {chapter.title}
        </h3>
        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
          {chapter.description}
        </p>
      </div>
      
      <div className="pt-0 flex flex-col justify-end flex-grow">
        {!isLocked && !isPlaceholder && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="nm-progress w-full h-2">
              <div 
                className="nm-progress-fill h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <button 
          className={cn(
            "w-full mt-auto",
            isLocked || isPlaceholder 
              ? "nm-button opacity-60 cursor-not-allowed" 
              : "nm-button nm-button-primary"
          )}
          disabled={isLocked || isPlaceholder}
        >
          {getButtonIcon()}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};
