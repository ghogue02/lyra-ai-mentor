
import React from 'react';
import { Button } from "@/components/ui/button";
import { LyraAvatar } from '@/components/LyraAvatar';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyraChatButtonProps {
  onClick: () => void;
  lessonTitle?: string;
}

export const LyraChatButton: React.FC<LyraChatButtonProps> = ({ 
  onClick, 
  lessonTitle 
}) => {
  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      {/* Main button */}
      <Button
        onClick={onClick}
        className={cn(
          "relative w-full h-auto p-6 bg-white hover:bg-gray-50",
          "border-2 border-transparent hover:border-purple-200",
          "rounded-lg shadow-lg hover:shadow-xl",
          "transition-all duration-300 transform hover:scale-[1.02]",
          "group-hover:shadow-purple-500/25"
        )}
        variant="outline"
      >
        <div className="flex items-center gap-4 w-full">
          {/* Avatar with animation */}
          <div className="relative">
            <LyraAvatar size="md" withWave={true} />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Try Chatting with Lyra!
              </h3>
              <MessageCircle className="w-5 h-5 text-purple-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-600">
              Your friendly AI learning companion who explains AI concepts in simple terms with real nonprofit examples.
            </p>
            <p className="text-xs text-purple-500 mt-1 font-medium">
              Click to start an interactive conversation →
            </p>
          </div>
        </div>
      </Button>
    </div>
  );
};
