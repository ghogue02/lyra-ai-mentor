import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedIcon } from './BrandedIcon';
import VideoAnimation from './VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';

interface BrandedToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  description?: string;
  onClose?: () => void;
  showAnimation?: boolean;
  duration?: number;
  className?: string;
}

const TOAST_CONFIGS = {
  success: {
    icon: CheckCircle,
    brandedIcon: 'achievement' as const,
    animation: 'success-checkmark.mp4',
    className: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-600"
  },
  error: {
    icon: XCircle,
    brandedIcon: 'workflow' as const,
    animation: 'error-warning.mp4',
    className: "bg-red-50 border-red-200 text-red-800",
    iconColor: "text-red-600"
  },
  warning: {
    icon: AlertCircle,
    brandedIcon: 'data' as const,
    animation: 'warning-alert.mp4',
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    iconColor: "text-yellow-600"
  },
  info: {
    icon: Info,
    brandedIcon: 'learning' as const,
    animation: 'info-notification.mp4',
    className: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-600"
  },
  achievement: {
    icon: CheckCircle,
    brandedIcon: 'achievement' as const,
    animation: 'trophy-celebration.mp4',
    className: "bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200 text-purple-800",
    iconColor: "text-purple-600"
  }
};

export const BrandedToast: React.FC<BrandedToastProps> = ({
  type,
  title,
  description,
  onClose,
  showAnimation = true,
  duration = 5000,
  className
}) => {
  const config = TOAST_CONFIGS[type];
  const FallbackIcon = config.icon;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md",
        config.className,
        className
      )}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
        className="flex-shrink-0 w-6 h-6 mt-0.5"
      >
        {showAnimation ? (
          <VideoAnimation
            src={getAnimationUrl(config.animation)}
            fallbackIcon={
              <BrandedIcon 
                type={config.brandedIcon} 
                variant="animated" 
                size="sm" 
                context="ui"
              />
            }
            className="w-full h-full"
            context="ui"
            loop={type === 'achievement'}
          />
        ) : (
          <FallbackIcon className={cn("w-full h-full", config.iconColor)} />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.h4
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-semibold leading-tight"
        >
          {title}
        </motion.h4>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs mt-1 opacity-90 leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onClose}
          className="flex-shrink-0 w-5 h-5 rounded-full opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
        >
          <X className="w-full h-full" />
        </motion.button>
      )}

      {/* Progress Bar for Timed Toasts */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-lg overflow-hidden"
        >
          <motion.div
            className="h-full bg-current opacity-50"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Sparkle Effect for Achievement */}
      {type === 'achievement' && showAnimation && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${30 + (i * 25)}%`,
                top: `${20 + (i % 2) * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + (i * 0.2),
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};