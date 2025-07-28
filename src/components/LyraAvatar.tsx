
import React, { useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { getLyraIconUrl } from '@/utils/supabaseIcons';

interface LyraAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withWave?: boolean;
  expression?: 'default' | 'thinking' | 'celebrating' | 'helping' | 'loading';
  animated?: boolean;
}

const LyraAvatarComponent: React.FC<LyraAvatarProps> = ({ 
  className, 
  size = 'md',
  withWave = false,
  expression = 'default',
  animated = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-32 h-32'
  };

  const iconSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28'
  };

  const waveSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const iconUrl = getLyraIconUrl(expression);

  const handleImageError = () => {
    console.error(`Failed to load Lyra image for expression: ${expression}, URL: ${iconUrl}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100",
        sizeClasses[size],
        animated && "transition-transform duration-300 hover:scale-105"
      )}>
        {imageError ? (
          // Fallback content when image fails to load
          <div className={cn(
            "bg-gradient-to-br from-purple-100 to-cyan-100 rounded-lg flex items-center justify-center text-purple-600 font-bold",
            iconSizeClasses[size]
          )}>
            <span className="text-xl">🤖</span>
          </div>
        ) : (
          <img 
            src={iconUrl} 
            alt={`Lyra AI Assistant - ${expression}`}
            className={cn(
              "object-contain rounded-lg",
              iconSizeClasses[size],
              expression === 'loading' && "animate-pulse",
              !imageLoaded && "opacity-0",
              imageLoaded && "opacity-100 transition-opacity duration-300"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="eager"
          />
        )}
      </div>
      
      {withWave && expression !== 'loading' && !imageError && (
        <div className={cn(
          "absolute -top-2 -right-2",
          waveSize[size]
        )}>
          {expression === 'celebrating' ? '🎉' : 
           expression === 'thinking' ? '💭' : 
           expression === 'helping' ? '💡' : '👋'}
        </div>
      )}
    </div>
  );
};

export const LyraAvatar = memo(LyraAvatarComponent);
