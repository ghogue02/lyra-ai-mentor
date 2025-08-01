import React, { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { LyraAvatar } from '@/components/LyraAvatar';

interface FloatingLyraAvatarProps {
  /** Callback when avatar is clicked */
  onAvatarClick?: () => void;
  /** Current state of the avatar */
  state?: 'idle' | 'pulsing' | 'active';
  /** Lesson context for future context-aware behavior */
  lessonContext?: {
    lessonId?: string;
    currentStep?: number;
    totalSteps?: number;
    hasActiveChat?: boolean;
  };
  /** Optional styling override */
  className?: string;
  /** Hide the avatar completely */
  hidden?: boolean;
}

const FloatingLyraAvatarComponent: React.FC<FloatingLyraAvatarProps> = ({
  onAvatarClick,
  state = 'idle',
  lessonContext,
  className,
  hidden = false
}) => {
  const handleClick = useCallback(() => {
    onAvatarClick?.();
  }, [onAvatarClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onAvatarClick?.();
    }
  }, [onAvatarClick]);

  // Determine avatar expression based on state
  const getAvatarExpression = () => {
    switch (state) {
      case 'active':
        return 'helping';
      case 'pulsing':
        return 'thinking';
      default:
        return 'default';
    }
  };

  // Animation variants for different states
  const avatarVariants = {
    idle: {
      scale: 1,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 20px 48px rgba(0, 0, 0, 0.1)',
      filter: 'brightness(1)',
    },
    pulsing: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 10px 25px rgba(0, 0, 0, 0.1), 0 20px 48px rgba(0, 0, 0, 0.1)',
        '0 10px 25px rgba(139, 92, 246, 0.3), 0 20px 48px rgba(139, 92, 246, 0.2)',
        '0 10px 25px rgba(0, 0, 0, 0.1), 0 20px 48px rgba(0, 0, 0, 0.1)'
      ],
      filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
    },
    active: {
      scale: 1.1,
      boxShadow: '0 15px 35px rgba(139, 92, 246, 0.25), 0 25px 55px rgba(139, 92, 246, 0.15)',
      filter: 'brightness(1.15)',
    }
  };

  // Breathing animation for idle state
  const breathingVariants = {
    idle: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className={cn(
            // Fixed positioning - bottom right corner
            "fixed bottom-6 right-6 z-50",
            // Mobile responsive positioning
            "sm:bottom-8 sm:right-8",
            // Cursor and interaction
            "cursor-pointer",
            // Focus styles for accessibility
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-full",
            className
          )}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.3 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Lyra AI Assistant - ${state === 'active' ? 'Chat is active' : state === 'pulsing' ? 'Click to interact' : 'Click to start chat'}`}
          aria-pressed={state === 'active'}
        >
          {/* Outer container with state-based animations */}
          <motion.div
            className="relative rounded-full"
            variants={avatarVariants}
            animate={state}
            transition={{
              duration: state === 'pulsing' ? 2 : 0.3,
              repeat: state === 'pulsing' ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Background glow effect for pulsing state */}
            {state === 'pulsing' && (
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-400 blur-lg opacity-20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Avatar container with breathing animation for idle state */}
            <motion.div
              variants={breathingVariants}
              animate={state === 'idle' ? 'idle' : undefined}
              className="relative"
            >
              {/* Avatar component with responsive sizing */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                <LyraAvatar
                  size="lg"
                  expression={getAvatarExpression()}
                  animated={true}
                  withWave={state === 'pulsing'}
                  className="w-full h-full"
                />
              </div>

              {/* Status indicator dot */}
              <motion.div
                className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                  state === 'active' && "bg-green-500",
                  state === 'pulsing' && "bg-yellow-500",
                  state === 'idle' && "bg-gray-400"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Pulse animation for active and pulsing states */}
                {(state === 'active' || state === 'pulsing') && (
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-full",
                      state === 'active' && "bg-green-500",
                      state === 'pulsing' && "bg-yellow-500"
                    )}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Tooltip-like hint for pulsing state */}
          {state === 'pulsing' && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 1 }}
            >
              Click to chat with Lyra
              <div className="absolute top-full right-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FloatingLyraAvatar = memo(FloatingLyraAvatarComponent);