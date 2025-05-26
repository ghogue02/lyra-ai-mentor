
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyraAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withWave?: boolean;
}

export const LyraAvatar: React.FC<LyraAvatarProps> = ({ 
  className, 
  size = 'md',
  withWave = true 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg",
        sizeClasses[size]
      )}>
        <MessageCircle className={cn(
          "text-white",
          size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'
        )} />
      </div>
      
      {withWave && (
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
          👋
        </div>
      )}
      
      {/* Pulse animation */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse opacity-20",
        sizeClasses[size]
      )} />
    </div>
  );
};
