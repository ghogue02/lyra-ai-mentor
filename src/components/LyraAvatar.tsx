
import React from 'react';
import { cn } from '@/lib/utils';
import { getLyraIconUrl } from '@/utils/supabaseIcons';

interface LyraAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withWave?: boolean;
  expression?: 'default' | 'thinking' | 'celebrating' | 'helping' | 'loading';
  animated?: boolean;
}

export const LyraAvatar: React.FC<LyraAvatarProps> = ({ 
  className, 
  size = 'md',
  withWave = true,
  expression = 'default',
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const waveSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg p-2",
        sizeClasses[size],
        animated && "transition-transform duration-300 hover:scale-105"
      )}>
        <img 
          src={getLyraIconUrl(expression)} 
          alt={`Lyra AI Assistant - ${expression}`}
          className={cn(
            "object-contain rounded-lg",
            iconSizeClasses[size],
            expression === 'loading' && "animate-pulse"
          )}
        />
      </div>
      
      {withWave && expression !== 'loading' && (
        <div className={cn(
          "absolute -top-2 -right-2 animate-bounce",
          waveSize[size]
        )}>
          {expression === 'celebrating' ? '🎉' : 
           expression === 'thinking' ? '💭' : 
           expression === 'helping' ? '💡' : '👋'}
        </div>
      )}
      
      {/* Enhanced pulse animation */}
      {animated && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl animate-pulse opacity-20",
          sizeClasses[size]
        )} />
      )}
    </div>
  );
};
