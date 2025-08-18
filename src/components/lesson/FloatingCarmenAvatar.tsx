import React from 'react';
import ChatLyra from '@/components/chat-system/ChatLyra';
import { cn } from '@/lib/utils';

export interface FloatingCarmenAvatarProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
}

export const FloatingCarmenAvatar: React.FC<FloatingCarmenAvatarProps> = ({
  position = 'bottom-right',
  disabled = false,
  className
}) => {
  if (disabled) return null;

  return (
    <ChatLyra
      lessonContext={{
        chapterTitle: "People Management with AI",
        lessonTitle: "Carmen's HR Workshop",
        content: "Interactive HR learning session with Carmen focusing on compassionate, AI-powered people management",
        phase: "learning"
      }}
      mode="floating"
      position={position}
      className={cn("nm-interactive", className)}
    />
  );
};

export default FloatingCarmenAvatar;