import React from 'react';
import ChatLyra from '@/components/chat-system/ChatLyra';
import { cn } from '@/lib/utils';

export interface FloatingLyraAvatarProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
}


export const FloatingLyraAvatar: React.FC<FloatingLyraAvatarProps> = ({
  position = 'bottom-right',
  disabled = false,
  className
}) => {
  if (disabled) return null;

  return (
    <ChatLyra
      lessonContext={{
        chapterTitle: "AI Learning Session",
        lessonTitle: "Interactive AI Learning",
        content: "Interactive AI learning session with Lyra",
        phase: "learning"
      }}
      mode="floating"
      position={position}
      className={cn("nm-interactive", className)}
    />
  );
};

export default FloatingLyraAvatar;