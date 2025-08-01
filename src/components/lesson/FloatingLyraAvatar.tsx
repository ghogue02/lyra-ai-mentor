import React, { useState, useCallback } from 'react';
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
      
      {/* All notification elements completely removed per user request */}
    </>
  );
};

export default FloatingLyraAvatar;