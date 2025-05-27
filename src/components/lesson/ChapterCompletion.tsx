
import React from 'react';
import { Button } from "@/components/ui/button";

interface ChapterCompletionProps {
  user: any;
  isFullyComplete: boolean;
  isChapterCompleted: boolean;
  onMarkChapterComplete: () => void;
}

export const ChapterCompletion: React.FC<ChapterCompletionProps> = ({
  user,
  isFullyComplete,
  isChapterCompleted,
  onMarkChapterComplete
}) => {
  if (!user || !isFullyComplete || isChapterCompleted) return null;

  return (
    <div className="mx-auto max-w-4xl mt-8 mb-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-green-800">Chapter Complete!</h4>
            <p className="text-sm text-green-600 mt-1">
              You've finished all sections. Mark this chapter as complete to continue.
            </p>
          </div>
          <Button 
            onClick={onMarkChapterComplete} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Mark Chapter Complete
          </Button>
        </div>
      </div>
    </div>
  );
};
