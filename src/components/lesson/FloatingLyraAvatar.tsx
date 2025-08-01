import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import ContextualLyraChat, { type LessonContext } from './chat/lyra/ContextualLyraChat';
import { type MayaJourneyState } from './chat/lyra/maya/Chapter2ContextualQuestions';

export interface FloatingLyraAvatarProps {
  lessonContext: LessonContext;
  mayaJourneyState?: MayaJourneyState; // Optional for Maya Chapter 2 integration
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  disabled?: boolean;
  initialExpanded?: boolean;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

export const FloatingLyraAvatar: React.FC<FloatingLyraAvatarProps> = ({
  lessonContext,
  mayaJourneyState,
  className,
  position = 'bottom-right',
  onEngagementChange,
  onNarrativePause,
  onNarrativeResume,
  disabled = false,
  initialExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);

  // Handle chat open/close
  const handleChatOpen = useCallback(() => {
    setHasNewMessage(false);
    onNarrativePause?.();
  }, [onNarrativePause]);

  const handleChatClose = useCallback(() => {
    onNarrativeResume?.();
  }, [onNarrativeResume]);

  // Handle engagement changes
  const handleEngagementChange = useCallback((isEngaged: boolean, exchangeCount: number) => {
    setExchangeCount(exchangeCount);
    onEngagementChange?.(isEngaged, exchangeCount);
    
    // Show notification for new messages when collapsed
    if (!isExpanded && exchangeCount > 0) {
      setHasNewMessage(true);
    }
  }, [isExpanded, onEngagementChange]);

  // Handle expansion state changes
  const handleExpandedChange = useCallback((expanded: boolean) => {
    console.log('FloatingLyraAvatar: expansion state changed to', expanded);
    setIsExpanded(expanded);
    if (expanded) {
      setHasNewMessage(false);
    }
  }, []);

  // Handle avatar click to toggle expansion
  const handleAvatarClick = useCallback(() => {
    console.log('FloatingLyraAvatar: avatar clicked, current expansion:', isExpanded);
    const newExpansion = !isExpanded;
    setIsExpanded(newExpansion);
    handleExpandedChange(newExpansion);
  }, [isExpanded, handleExpandedChange]);

  if (disabled) {
    return null;
  }

  return (
    <>
      {/* Always render the ContextualLyraChat - it handles its own visibility */}
      <ContextualLyraChat
        lessonContext={lessonContext}
        mayaJourneyState={mayaJourneyState}
        onChatOpen={handleChatOpen}
        onChatClose={handleChatClose}
        onEngagementChange={handleEngagementChange}
        onNarrativePause={onNarrativePause}
        onNarrativeResume={onNarrativeResume}
        isFloating={true}
        expanded={isExpanded}
        onExpandedChange={handleExpandedChange}
        onAvatarClick={handleAvatarClick}
        className={cn(
          "fixed z-50",
          positionClasses[position],
          className
        )}
      />
      
      {/* Floating indicator for engagement status when collapsed */}
      {!isExpanded && exchangeCount > 0 && (
        <motion.div
          className={cn(
            "fixed z-40 pointer-events-none",
            position === 'bottom-right' ? 'bottom-20 right-6' :
            position === 'bottom-left' ? 'bottom-20 left-6' :
            position === 'top-right' ? 'top-20 right-6' :
            'top-20 left-6'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-brand-cyan to-brand-purple text-white border-0 shadow-lg"
          >
            {exchangeCount} {exchangeCount === 1 ? 'message' : 'messages'} with Lyra
          </Badge>
        </motion.div>
      )}
      
      {/* New message notification pulse */}
      {!isExpanded && hasNewMessage && (
        <motion.div
          className={cn(
            "fixed z-40 pointer-events-none",
            position === 'bottom-right' ? 'bottom-6 right-6' :
            position === 'bottom-left' ? 'bottom-6 left-6' :
            position === 'top-right' ? 'top-6 right-6' :
            'top-6 left-6'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-brand-cyan/30 to-brand-purple/30 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.2, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </>
  );
};

export default FloatingLyraAvatar;