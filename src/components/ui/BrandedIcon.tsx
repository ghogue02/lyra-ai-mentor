import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import VideoAnimation from './VideoAnimation';
import { getAnimationUrl, getSupabaseIconUrl } from '@/utils/supabaseIcons';

interface BrandedIconProps {
  type: 'ethics' | 'data' | 'workflow' | 'communication' | 'achievement' | 'growth' | 'mission' | 'network' | 'learning';
  variant?: 'static' | 'animated';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackIcon?: LucideIcon;
  context?: 'ui' | 'progress' | 'character' | 'celebration';
  loop?: boolean;
}

const ICON_MAPPING = {
  ethics: {
    static: 'lyra-avatar.png',
    animated: 'lyra-shield.mp4'
  },
  data: {
    static: 'data-analytics.png',
    animated: 'data-analytics-animated.mp4'
  },
  workflow: {
    static: 'workflow-process.png',
    animated: 'workflow-animation.mp4'
  },
  communication: {
    static: 'communication.png',
    animated: 'communication-animation.mp4'
  },
  achievement: {
    static: 'achievement-trophy.png',
    animated: 'trophy-celebration.mp4'
  },
  growth: {
    static: 'growth-plant.png',
    animated: 'growth-animation.mp4'
  },
  mission: {
    static: 'mission-heart.png',
    animated: 'mission-heart-animation.mp4'
  },
  network: {
    static: 'network-connection.png',
    animated: 'network-animation.mp4'
  },
  learning: {
    static: 'learning-target.png',
    animated: 'learning-animation.mp4'
  }
};

export const BrandedIcon: React.FC<BrandedIconProps> = ({
  type,
  variant = 'static',
  size = 'md',
  className,
  fallbackIcon: FallbackIcon,
  context = 'ui',
  loop = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const iconConfig = ICON_MAPPING[type];
  
  if (variant === 'animated') {
    return (
      <div className={cn(sizeClasses[size], className)}>
        <VideoAnimation
          src={getAnimationUrl(iconConfig.animated)}
          fallbackIcon={
            FallbackIcon ? (
              <FallbackIcon className={cn(sizeClasses[size], 'text-primary')} />
            ) : (
              <img 
                src={getSupabaseIconUrl(iconConfig.static)} 
                alt={`${type} icon`}
                className={cn(sizeClasses[size], 'object-contain')}
              />
            )
          }
          className="w-full h-full"
          context={context}
          loop={loop}
        />
      </div>
    );
  }

  return (
    <img 
      src={getSupabaseIconUrl(iconConfig.static)} 
      alt={`${type} icon`}
      className={cn(sizeClasses[size], 'object-contain', className)}
    />
  );
};