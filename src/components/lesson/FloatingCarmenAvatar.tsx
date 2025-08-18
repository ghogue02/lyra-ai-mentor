import React from 'react';
import { EnhancedCarmenAvatar } from '@/components/lesson/ai-interaction/EnhancedCarmenAvatar';
import { cn } from '@/lib/utils';

export interface FloatingCarmenAvatarProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
}

export const FloatingCarmenAvatar: React.FC<FloatingCarmenAvatarProps> = ({
  position = 'bottom-right',
  disabled = false,
  className
}) => {
  if (disabled) return null;

  return (
    <EnhancedCarmenAvatar
      position={position}
      mode="floating"
      className={cn("nm-interactive", className)}
      lessonContext={{
        chapterTitle: "People Management with AI",
        lessonTitle: "Carmen's HR Workshop",
        content: "Interactive HR learning session with Carmen focusing on compassionate, AI-powered people management",
        phase: "learning",
        hrTopic: "default"
      }}
      showPersonalityModes={true}
      contextualQuestions={[
        "How can I balance AI efficiency with human empathy in HR?",
        "What are the best practices for AI-powered people management?",
        "How do I ensure fairness in AI-assisted HR decisions?",
        "What should I know about AI ethics in HR?"
      ]}
    />
  );
};

export default FloatingCarmenAvatar;