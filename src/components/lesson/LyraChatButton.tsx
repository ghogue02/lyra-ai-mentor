
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { LyraAvatar } from '@/components/LyraAvatar';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyraChatButtonProps {
  onClick: () => void;
  lessonTitle?: string;
}

const LyraChatButtonComponent: React.FC<LyraChatButtonProps> = ({ 
  onClick, 
  lessonTitle 
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "w-full h-auto p-3 sm:p-4 md:p-6 bg-white hover:bg-gray-50",
        "border-2 border-transparent hover:border-purple-200",
        "rounded-lg shadow-lg hover:shadow-xl",
        "transition-all duration-300"
      )}
      variant="outline"
    >
      <div className="flex items-start gap-3 sm:gap-4 w-full min-w-0">
        {/* Avatar with simplified animation */}
        <div className="relative flex-shrink-0">
          <LyraAvatar size="md" withWave={false} animated={false} />
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex-1 text-left min-w-0 overflow-hidden">
          <div className="flex items-start gap-2 mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-purple-600 leading-tight flex-1 min-w-0">
              Try Chatting with Lyra!
            </h3>
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-1 sm:mb-2 break-words">
            AI learning companion with nonprofit examples
          </p>
          <p className="text-xs text-purple-500 font-medium leading-tight break-words">
            Click to start chatting →
          </p>
        </div>
      </div>
    </Button>
  );
};

export const LyraChatButton = memo(LyraChatButtonComponent);
