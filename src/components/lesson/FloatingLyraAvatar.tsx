import React from 'react';
import { ChatSimple } from '@/components/chat-system/ChatSimple';

export interface FloatingLyraAvatarProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

export const FloatingLyraAvatar: React.FC<FloatingLyraAvatarProps> = ({
  position = 'bottom-right',
  disabled = false,
  className
}) => {
  return (
    <ChatSimple
      position={position}
      className={className}
      disabled={disabled}
    />
  );
};

export default FloatingLyraAvatar;