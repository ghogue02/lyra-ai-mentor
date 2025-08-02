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

  // CSS animations replace framer-motion variants

  return (
    <>
      {!hidden && (
        <div
          className={cn(
            // Fixed positioning - bottom right corner
            "fixed bottom-6 right-6 z-50",
            // Mobile responsive positioning
            "sm:bottom-8 sm:right-8",
            // Cursor and interaction
            "cursor-pointer",
            // Focus styles for accessibility
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-full",
            // CSS animations
            "animate-scale-in-spring hover:scale-105 active:scale-95 transition-transform duration-200",
            className
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Lyra AI Assistant - ${state === 'active' ? 'Chat is active' : state === 'pulsing' ? 'Click to interact' : 'Click to start chat'}`}
          aria-pressed={state === 'active'}
        >
          {/* Outer container with state-based animations */}
          <div
            className={cn(
              "relative rounded-full transition-all duration-300",
              state === 'pulsing' && "animate-pulse",
              state === 'active' && "scale-110 brightness-115"
            )}
            style={{
              boxShadow: state === 'active' 
                ? '0 15px 35px rgba(139, 92, 246, 0.25), 0 25px 55px rgba(139, 92, 246, 0.15)'
                : '0 10px 25px rgba(0, 0, 0, 0.1), 0 20px 48px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Background glow effect for pulsing state */}
            {state === 'pulsing' && (
              <div className="absolute inset-0 rounded-full bg-purple-400 blur-lg opacity-20 animate-pulse" />
            )}

            {/* Avatar container with breathing animation for idle state */}
            <div
              className={cn(
                "relative",
                state === 'idle' && "animate-pulse"
              )}
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
              <div
                className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-scale-in",
                  state === 'active' && "bg-green-500",
                  state === 'pulsing' && "bg-yellow-500",
                  state === 'idle' && "bg-gray-400"
                )}
                style={{ animationDelay: '0.2s' }}
              >
                {/* Pulse animation for active and pulsing states */}
                {(state === 'active' || state === 'pulsing') && (
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full animate-ping",
                      state === 'active' && "bg-green-500",
                      state === 'pulsing' && "bg-yellow-500"
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Tooltip-like hint for pulsing state */}
          {state === 'pulsing' && (
            <div
              className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg whitespace-nowrap animate-slide-up"
              style={{ animationDelay: '1s' }}
            >
              Click to chat with Lyra
              <div className="absolute top-full right-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const FloatingLyraAvatar = memo(FloatingLyraAvatarComponent);