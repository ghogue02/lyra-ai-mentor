import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';

const getAnimationUrl = (filename: string) => {
  return `https://zkwwjzbrygxqrfxkxozk.supabase.co/storage/v1/object/public/app-icons/animations/${filename}`;
};

interface AnimatedCheckmarkProps {
  isCompleted: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showAnimation?: boolean;
}

const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  isCompleted,
  size = 'md',
  className = '',
  showAnimation = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (!isCompleted) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full rounded-full border-2 border-muted-foreground/30" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.1
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      {showAnimation ? (
        <OptimizedVideoAnimation
          src={getAnimationUrl('completion-checkmark.mp4')}
          fallbackIcon={<CheckCircle className="w-full h-full text-green-500" />}
          className="w-full h-full"
          context="ui"
          loop={false}
        />
      ) : (
        <CheckCircle className="w-full h-full text-green-500" />
      )}
    </motion.div>
  );
};

export default AnimatedCheckmark;