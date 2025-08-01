export { FloatingLyraAvatar } from './FloatingLyraAvatar';
export { FloatingLyraAvatarExample } from './FloatingLyraAvatar.example';

// Re-export the type for easier importing
export interface FloatingLyraAvatarProps {
  onAvatarClick?: () => void;
  state?: 'idle' | 'pulsing' | 'active';
  lessonContext?: {
    lessonId?: string;
    currentStep?: number;
    totalSteps?: number;
    hasActiveChat?: boolean;
  };
  className?: string;
  hidden?: boolean;
}