
import React from 'react';
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

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg p-2",
        sizeClasses[size]
      )}>
        <img 
          src="/lovable-uploads/89bfb1be-6b72-42a6-b6c1-48c8eccd2034.png" 
          alt="Lyra AI Assistant"
          className={cn("object-contain", iconSizeClasses[size])}
        />
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
