
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface ChatHeaderProps {
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  engagement: {
    exchangeCount: number;
    hasReachedMinimum: boolean;
  };
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  lessonContext,
  onClose
}) => {
  return (
    <DialogHeader className="flex-shrink-0 spacing-mobile py-2 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          {lessonContext?.lessonTitle && (
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {lessonContext.lessonTitle}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white flex-shrink-0 ml-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};
