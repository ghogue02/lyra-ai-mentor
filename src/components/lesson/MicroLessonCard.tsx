import React from 'react';
import { CheckCircle, Clock, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedIcon } from '../ui/BrandedIcon';
import { InteractiveCard } from '../ui/InteractiveCard';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';

interface MicroLessonCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  iconType: 'learning' | 'achievement' | 'growth' | 'mission' | 'network' | 'communication' | 'data' | 'workflow';
  onClick?: () => void;
  characterName?: string;
  progress?: number; // 0-100
  showAnimation?: boolean;
}

const DIFFICULTY_CONFIGS = {
  beginner: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Beginner'
  },
  intermediate: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Intermediate'
  },
  advanced: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Advanced'
  }
};

export const MicroLessonCard: React.FC<MicroLessonCardProps> = ({
  id,
  title,
  description,
  completed,
  locked,
  difficulty,
  iconType,
  onClick,
  characterName,
  progress = 0,
  showAnimation = true
}) => {
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty];

  const getStatusIcon = () => {
    if (locked) return <Lock className="w-4 h-4 text-gray-400" />;
    if (completed) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (progress > 0) return <Play className="w-4 h-4 text-blue-600" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getCardVariant = () => {
    if (completed) return 'achievement';
    if (progress > 0) return 'lesson';
    return 'default';
  };

  return (
    <motion.div
      className={cn(
        "neu-card neu-card-hover h-full p-6 cursor-pointer transition-all duration-300",
        locked && "opacity-60 cursor-not-allowed",
        completed && "border-l-4 border-l-green-500",
        progress > 0 && !completed && "border-l-4 border-l-blue-500"
      )}
      onClick={locked ? undefined : onClick}
      whileHover={!locked ? { scale: 1.02 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
    >
      <div className="space-y-4">
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "neu-surface p-2 rounded-full",
            completed && "bg-green-50",
            progress > 0 && !completed && "bg-blue-50",
            locked && "bg-gray-50"
          )}>
            {getStatusIcon()}
          </div>
          <div className={cn(
            "neu-surface px-3 py-1 rounded-full text-xs font-medium",
            difficultyConfig.color
          )}>
            {difficultyConfig.label}
          </div>
        </div>

        {/* Title and Character */}
        <div className="space-y-2">
          <h3 className={cn(
            "font-semibold text-base leading-tight",
            locked ? "text-gray-400" : "text-foreground"
          )}>
            {title}
          </h3>
          
          {characterName && (
            <div className="flex items-center gap-3 neu-text-container p-3">
              <div className="w-8 h-8 neu-character">
                {showAnimation ? (
                  <OptimizedVideoAnimation
                    src={getAnimationUrl(`${characterName.toLowerCase()}-avatar.mp4`)}
                    fallbackIcon={
                      <BrandedIcon 
                        type={iconType} 
                        variant="static" 
                        size="sm"
                      />
                    }
                    className="w-full h-full rounded-full"
                    context="character"
                  />
                ) : (
                  <BrandedIcon 
                    type={iconType} 
                    variant="static" 
                    size="sm"
                  />
                )}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                with {characterName}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className={cn(
          "text-sm leading-relaxed",
          locked ? "text-gray-400" : "text-muted-foreground"
        )}>
          {description}
        </p>

        {/* Progress Bar */}
        {progress > 0 && !completed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="neu-progress p-1 h-4">
              <motion.div
                className="neu-progress-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {completed && showAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="neu-text-container p-4 border-l-4 border-l-green-500"
          >
            <div className="flex items-center gap-3">
              <div className="neu-character w-8 h-8 bg-green-50 flex items-center justify-center">
                <OptimizedVideoAnimation
                  src={getAnimationUrl('micro-lesson-complete.mp4')}
                  fallbackIcon={<CheckCircle className="w-4 h-4 text-green-600" />}
                  className="w-4 h-4"
                  context="celebration"
                  loop={false}
                />
              </div>
              <span className="text-sm font-semibold text-green-700">Completed!</span>
            </div>
          </motion.div>
        )}

        {/* Locked State */}
        {locked && (
          <div className="neu-inset p-4">
            <div className="flex items-center gap-3">
              <div className="neu-character w-8 h-8 bg-gray-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-500">Complete previous lessons to unlock</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};