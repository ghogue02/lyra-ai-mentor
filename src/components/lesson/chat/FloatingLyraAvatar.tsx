import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingLyraAvatarProps } from '@/types/ContextualChat';
import { ContextualLyraChat } from './ContextualLyraChat';

type AvatarState = 'idle' | 'pulsing' | 'active' | 'chatOpen';

export const FloatingLyraAvatar: React.FC<FloatingLyraAvatarProps> = ({
  lessonContext,
  config,
  integration,
  className,
  position = 'bottom-right',
  disabled = false,
  initialExpanded = false,
  onEngagementChange,
  onNarrativePause,
  onNarrativeResume
}) => {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Auto-trigger pulsing state based on lesson phase
  useEffect(() => {
    if (disabled) return;

    const shouldPulse = () => {
      // Pulse during specific phases that encourage interaction
      const pulseTriggerPhases = [
        'introduction',
        'learning',
        'practice',
        'capabilities-demo',
        'lyra-introduction'
      ];
      
      return pulseTriggerPhases.includes(lessonContext.phase);
    };

    if (shouldPulse() && !hasUserInteracted && avatarState === 'idle') {
      // Start pulsing after a delay
      const timer = setTimeout(() => {
        setAvatarState('pulsing');
        setShowTooltip(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lessonContext.phase, hasUserInteracted, avatarState, disabled]);

  // Handle avatar click
  const handleAvatarClick = () => {
    if (disabled) return;

    setHasUserInteracted(true);
    setShowTooltip(false);

    if (isExpanded) {
      if (isMinimized) {
        setIsMinimized(false);
      } else {
        setIsExpanded(false);
        setAvatarState('idle');
        onNarrativeResume?.();
        integration?.onResume?.();
      }
    } else {
      setIsExpanded(true);
      setAvatarState('chatOpen');
      onNarrativePause?.();
      integration?.onPause?.();
    }
  };

  // Handle chat engagement
  const handleEngagementChange = (isEngaged: boolean, exchangeCount: number) => {
    onEngagementChange?.(isEngaged, exchangeCount);
    
    if (isEngaged) {
      setAvatarState('active');
    }
  };

  // Handle minimize/maximize
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setIsMinimized(false);
    setAvatarState('idle');
    onNarrativeResume?.();
    integration?.onResume?.();
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  // Avatar animation variants
  const avatarVariants = {
    idle: {
      scale: 1,
      boxShadow: '0 4px 20px rgba(124, 58, 237, 0.2)'
    },
    pulsing: {
      scale: [1, 1.1, 1],
      boxShadow: [
        '0 4px 20px rgba(124, 58, 237, 0.2)',
        '0 8px 30px rgba(124, 58, 237, 0.4)',
        '0 4px 20px rgba(124, 58, 237, 0.2)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    active: {
      scale: 1.05,
      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)'
    },
    chatOpen: {
      scale: 1,
      boxShadow: '0 4px 20px rgba(124, 58, 237, 0.2)'
    }
  };

  // Chat panel animation variants
  const chatVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transformOrigin: position.includes('bottom') ? 'bottom' : 'top'
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    minimized: {
      opacity: 0,
      scale: 0.8,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  if (disabled) return null;

  return (
    <>
      <style>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <div className={cn('fixed z-50', getPositionClasses(), className)}>
        {/* Chat Panel */}
        <AnimatePresence>
          {isExpanded && !isMinimized && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={chatVariants}
              className={cn(
                'absolute',
                position.includes('right') ? 'right-0' : 'left-0',
                position.includes('bottom') ? 'bottom-20' : 'top-20'
              )}
            >
              <div className="relative">
                {/* Chat Header with Controls */}
                <div className="absolute -top-2 right-2 flex gap-1 z-10">
                  <button
                    onClick={handleMinimize}
                    className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-white text-xs transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-xs transition-colors"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Chat Component */}
                <ContextualLyraChat
                  lessonContext={lessonContext}
                  config={config}
                  onEngagementChange={handleEngagementChange}
                  onNarrativePause={onNarrativePause}
                  onNarrativeResume={onNarrativeResume}
                  className="shadow-2xl border-2 border-primary/20"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Avatar */}
        <motion.button
          onClick={handleAvatarClick}
          className={cn(
            'relative w-16 h-16 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-primary to-brand-cyan',
            'hover:shadow-lg transition-all duration-300',
            'focus:outline-none focus:ring-4 focus:ring-primary/30',
            'group cursor-pointer',
            isExpanded && !isMinimized && 'ring-4 ring-primary/30'
          )}
          variants={avatarVariants}
          animate={avatarState}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Avatar Icon */}
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="chat-icon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="heart-icon"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse effect for pulsing state */}
          {avatarState === 'pulsing' && (
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          )}

          {/* Breathing effect overlay */}
          {avatarState === 'idle' && (
            <div 
              className="absolute inset-0 rounded-full bg-white/10"
              style={{
                animation: 'breathing 3s ease-in-out infinite'
              }}
            />
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && avatarState === 'pulsing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute whitespace-nowrap px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg',
                position.includes('right') ? 'right-0' : 'left-0',
                position.includes('bottom') ? 'bottom-20' : 'top-20'
              )}
            >
              <div className="relative">
                Click me to ask questions about this lesson!
                {/* Tooltip arrow */}
                <div 
                  className={cn(
                    'absolute w-2 h-2 bg-gray-900 transform rotate-45',
                    position.includes('bottom') ? '-bottom-1' : '-top-1',
                    position.includes('right') ? 'right-4' : 'left-4'
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized indicator */}
        {isExpanded && isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-brand-cyan rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default FloatingLyraAvatar;