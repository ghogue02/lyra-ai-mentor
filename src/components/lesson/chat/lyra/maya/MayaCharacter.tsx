import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

interface MayaCharacterProps {
  mood?: 'happy' | 'encouraging' | 'thinking' | 'excited';
  size?: 'sm' | 'md' | 'lg';
  showSparkles?: boolean;
  className?: string;
}

const MayaCharacter: React.FC<MayaCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  showSparkles = true,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-12 h-12';
      case 'md':
        return 'w-16 h-16';
      case 'lg':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  };

  const getMoodIcon = () => {
    switch (mood) {
      case 'happy':
        return <Heart className="w-full h-full text-primary" />;
      case 'encouraging':
        return <Heart className="w-full h-full text-primary animate-pulse" />;
      case 'thinking':
        return <Heart className="w-full h-full text-primary opacity-80" />;
      case 'excited':
        return <Star className="w-full h-full text-primary" />;
      default:
        return <Heart className="w-full h-full text-primary" />;
    }
  };

  const getMoodAnimation = () => {
    switch (mood) {
      case 'happy':
        return { scale: [1, 1.05, 1], rotate: [0, 2, 0] };
      case 'encouraging':
        return { scale: [1, 1.1, 1], y: [0, -2, 0] };
      case 'thinking':
        return { rotate: [0, 5, -5, 0] };
      case 'excited':
        return { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] };
      default:
        return { scale: [1, 1.05, 1] };
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Maya Avatar Container */}
      <motion.div
        className={`${getSizeClasses()} rounded-2xl glass-effect flex items-center justify-center shadow-lg brand-shadow-glow relative overflow-hidden`}
        animate={getMoodAnimation()}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 brand-gradient-glow rounded-2xl" />
        
        {/* Character Icon */}
        <div className="relative z-10 p-2">
          {getMoodIcon()}
        </div>
        
        {/* Mood Indicator */}
        <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
      </motion.div>

      {/* Sparkles Animation */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-1 -left-1"
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Sparkles className="w-3 h-3 text-brand-cyan" />
          </motion.div>
        </div>
      )}

      {/* Maya Label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-primary/10 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs font-semibold text-primary">Maya</span>
        </div>
      </div>
    </div>
  );
};

export default MayaCharacter;