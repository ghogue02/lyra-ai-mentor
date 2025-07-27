import React from 'react';
import { motion } from 'framer-motion';
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
  duration: number; // in minutes
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
  duration,
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
    <InteractiveCard
      variant={getCardVariant()}
      hover={!locked}
      onClick={locked ? undefined : onClick}
      icon={iconType}
      showAnimation={showAnimation}
      disabled={locked}
      className="h-full"
    >
      <div className="space-y-4">
        {/* Header with Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
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
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
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
              <span className="text-xs text-muted-foreground font-medium">
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
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-primary to-brand-cyan h-1.5 rounded-full"
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
            className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
          >
            <OptimizedVideoAnimation
              src={getAnimationUrl('micro-lesson-complete.mp4')}
              fallbackIcon={<CheckCircle className="w-4 h-4" />}
              className="w-4 h-4"
              context="celebration"
              loop={false}
            />
            <span className="text-sm font-medium">Completed!</span>
          </motion.div>
        )}

        {/* Locked State */}
        {locked && (
          <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Complete previous lessons to unlock</span>
          </div>
        )}
      </div>
    </InteractiveCard>
  );
};