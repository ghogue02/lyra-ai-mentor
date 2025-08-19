import React, { useEffect, useState } from 'react';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { BrandedIcon } from './BrandedIcon';
import { CharacterType } from '@/types/characters';

// CSS animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes sparkle {
    0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1) rotate(180deg); opacity: 1; }
  }
  
  @keyframes bounceIn {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    50% { transform: scale(1.1) rotate(-90deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
  .animate-sparkle { animation: sparkle 2s infinite; }
  .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
`;

interface ProgressCelebrationProps {
  isVisible: boolean;
  onComplete?: () => void;
  type: 'milestone' | 'chapter' | 'lesson' | 'toolkit' | 'achievement';
  title?: string;
  subtitle?: string;
  duration?: number;
  characterType?: CharacterType;
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
    <>
      <style>{animationStyles}</style>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className={`bg-gradient-to-br ${config.bgGradient} bg-white/90 backdrop-blur-md rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl border border-white/20 animate-scale-in`}>
            {/* Main Animation */}
            <div className="w-24 h-24 mx-auto mb-6 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
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
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {title || config.defaultTitle}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-gray-600 mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                {subtitle}
              </p>
            )}

            {/* Character Celebration */}
            {showCharacter && (
              <div className="w-16 h-16 mx-auto animate-bounce-in" style={{ animationDelay: '0.5s' }}>
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
              </div>
            )}

            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${0.5 + (i * 0.1)}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};