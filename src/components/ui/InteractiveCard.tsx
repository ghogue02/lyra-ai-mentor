import React from 'react';
import { cn } from '@/lib/utils';
import { BrandedIcon } from './BrandedIcon';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'lesson' | 'achievement' | 'chapter' | 'neumorphic' | 'neumorphic-elevated' | 'neumorphic-sunken';
  hover?: boolean;
  onClick?: () => void;
  icon?: 'achievement' | 'learning' | 'growth' | 'mission' | 'network' | 'communication' | 'data' | 'workflow';
  showAnimation?: boolean;
  disabled?: boolean;
}

const CARD_VARIANTS = {
  default: {
    base: "bg-card border border-border shadow-sm",
    hover: "hover:shadow-lg hover:scale-[1.02]"
  },
  premium: {
    base: "bg-gradient-to-br from-white via-purple-50/50 to-cyan-50/50 border border-purple-200/30 shadow-lg",
    hover: "hover:shadow-2xl hover:scale-[1.03] hover:border-purple-300/50"
  },
  lesson: {
    base: "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 shadow-md",
    hover: "hover:shadow-xl hover:scale-[1.02] hover:border-blue-300/50"
  },
  achievement: {
    base: "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 shadow-md",
    hover: "hover:shadow-xl hover:scale-[1.03] hover:border-yellow-300/50"
  },
  chapter: {
    base: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 shadow-md",
    hover: "hover:shadow-xl hover:scale-[1.02] hover:border-green-300/50"
  },
  neumorphic: {
    base: "nm-card",
    hover: "nm-interactive"
  },
  'neumorphic-elevated': {
    base: "nm-card-elevated",
    hover: "nm-interactive"
  },
  'neumorphic-sunken': {
    base: "nm-card-sunken",
    hover: "nm-interactive"
  }
};

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  onClick,
  icon,
  showAnimation = true,
  disabled = false
}) => {
  const cardConfig = CARD_VARIANTS[variant];
  const isClickable = onClick && !disabled;

  return (
    <motion.div
      className={cn(
        "relative p-6 rounded-xl transition-all duration-300",
        cardConfig.base,
        hover && !disabled && cardConfig.hover,
        isClickable && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={isClickable ? onClick : undefined}
      whileHover={hover && !disabled ? { y: -2 } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Icon */}
      {icon && showAnimation && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="absolute -top-3 -right-3 w-12 h-12"
        >
          <OptimizedVideoAnimation
            src={getAnimationUrl(`card-${icon}-glow.mp4`)}
            fallbackIcon={
              <BrandedIcon 
                type={icon} 
                variant="animated" 
                size="lg" 
                context="ui"
              />
            }
            className="w-full h-full"
            context="ui"
            loop={true}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover Effect Animation */}
      {hover && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0"
          style={{
            background: variant === 'premium' 
              ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))'
              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02))'
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Progress Indicator for Achievement/Lesson cards */}
      {(variant === 'achievement' || variant === 'lesson') && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-b-xl",
              variant === 'achievement' 
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : "bg-gradient-to-r from-blue-400 to-indigo-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      )}

      {/* Sparkle Effects for Premium/Achievement */}
      {(variant === 'premium' || variant === 'achievement') && showAnimation && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${20 + (i * 20)}%`,
                top: `${15 + (i % 2) * 70}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                delay: 0.5 + (i * 0.2),
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};