import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { BrandedIcon } from './BrandedIcon';

interface ProgressCelebrationProps {
  isVisible: boolean;
  onComplete?: () => void;
  type: 'milestone' | 'chapter' | 'lesson' | 'toolkit' | 'achievement';
  title?: string;
  subtitle?: string;
  duration?: number;
  characterType?: 'lyra' | 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
}

const CELEBRATION_CONFIGS = {
  milestone: {
    animation: 'level-up-animation.mp4',
    icon: 'achievement' as const,
    defaultTitle: 'Milestone Reached!',
    bgGradient: 'from-purple-500/20 to-blue-500/20'
  },
  chapter: {
    animation: 'chapter-complete.mp4',
    icon: 'achievement' as const,
    defaultTitle: 'Chapter Complete!',
    bgGradient: 'from-green-500/20 to-emerald-500/20'
  },
  lesson: {
    animation: 'lesson-complete.mp4',
    icon: 'learning' as const,
    defaultTitle: 'Lesson Complete!',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  toolkit: {
    animation: 'toolkit-unlock.mp4',
    icon: 'achievement' as const,
    defaultTitle: 'Toolkit Unlocked!',
    bgGradient: 'from-orange-500/20 to-yellow-500/20'
  },
  achievement: {
    animation: 'trophy-celebration.mp4',
    icon: 'achievement' as const,
    defaultTitle: 'Achievement Unlocked!',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  }
};

export const ProgressCelebration: React.FC<ProgressCelebrationProps> = ({
  isVisible,
  onComplete,
  type,
  title,
  subtitle,
  duration = 3000,
  characterType = 'lyra'
}) => {
  const [showCharacter, setShowCharacter] = useState(false);
  const config = CELEBRATION_CONFIGS[type];

  useEffect(() => {
    if (isVisible) {
      const characterTimer = setTimeout(() => setShowCharacter(true), 500);
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(characterTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowCharacter(false);
    }
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`bg-gradient-to-br ${config.bgGradient} bg-white/90 backdrop-blur-md rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl border border-white/20`}
          >
            {/* Main Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className="w-24 h-24 mx-auto mb-6"
            >
              <OptimizedVideoAnimation
                src={getAnimationUrl(config.animation)}
                fallbackIcon={
                  <BrandedIcon 
                    type={config.icon} 
                    variant="animated" 
                    size="xl" 
                    context="celebration"
                  />
                }
                className="w-full h-full"
                context="celebration"
                loop={false}
              />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {title || config.defaultTitle}
            </motion.h2>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-4"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Character Celebration */}
            <AnimatePresence>
              {showCharacter && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 mx-auto"
                >
                  <OptimizedVideoAnimation
                    src={getAnimationUrl(`${characterType}-celebration.mp4`)}
                    fallbackIcon={
                      <BrandedIcon 
                        type="achievement" 
                        variant="static" 
                        size="lg" 
                      />
                    }
                    className="w-full h-full"
                    context="celebration"
                    loop={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + (i * 0.1),
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};