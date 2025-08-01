import React from 'react';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';

const getAnimationUrl = (filename: string) => {
  return `https://zkwwjzbrygxqrfxkxozk.supabase.co/storage/v1/object/public/app-icons/animations/${filename}`;
};

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className = '',
  showAnimation = true,
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-surface-secondary rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-brand-cyan rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {showAnimation && percentage > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 -mr-3">
              <OptimizedVideoAnimation
                src={getAnimationUrl('progress-bar-filling.mp4')}
                fallbackIcon={<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                className="w-full h-full"
                context="progress"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedProgress;