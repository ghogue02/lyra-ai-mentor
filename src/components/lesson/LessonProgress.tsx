
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Trophy, Target } from 'lucide-react';
import { BrandedIcon } from '@/components/ui/BrandedIcon';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';

interface LessonProgressProps {
  completedBlocks: number;
  totalBlocks: number;
  completedInteractiveElements: number;
  totalInteractiveElements: number;
  isCompleted?: boolean;
  chatEngagement?: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  onMarkChapterComplete?: () => void;
  hasContentBlocking?: boolean;
  showAnimation?: boolean;
  lessonTitle?: string;
  characterName?: string;
}

const LessonProgressComponent: React.FC<LessonProgressProps> = ({
  completedBlocks,
  totalBlocks,
  completedInteractiveElements,
  totalInteractiveElements,
  isCompleted = false,
  chatEngagement,
  onMarkChapterComplete,
  showAnimation = true,
  lessonTitle,
  characterName
}) => {
  // Memoize calculations to prevent unnecessary re-renders
  const progressData = useMemo(() => {
    const totalItems = totalBlocks + totalInteractiveElements;
    const completedItems = completedBlocks + completedInteractiveElements;
    const contentComplete = completedItems === totalItems;
    const chatComplete = chatEngagement?.hasReachedMinimum || false;
    const isFullyComplete = contentComplete && chatComplete;

    return {
      totalItems,
      completedItems,
      contentComplete,
      chatComplete,
      isFullyComplete
    };
  }, [
    totalBlocks,
    totalInteractiveElements,
    completedBlocks,
    completedInteractiveElements,
    chatEngagement?.hasReachedMinimum
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Lesson Header with Character */}
      {(lessonTitle || characterName) && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-brand-cyan/5 rounded-lg border border-primary/10">
          {characterName && showAnimation && (
            <div className="w-8 h-8">
              <OptimizedVideoAnimation
                src={getAnimationUrl(`${characterName.toLowerCase()}-avatar.mp4`)}
                fallbackIcon={
                  <BrandedIcon 
                    type="learning" 
                    variant="static" 
                    size="lg"
                  />
                }
                className="w-full h-full rounded-full"
                context="character"
              />
            </div>
          )}
          <div>
            {lessonTitle && (
              <h3 className="font-semibold text-foreground">{lessonTitle}</h3>
            )}
            {characterName && (
              <p className="text-sm text-muted-foreground">with {characterName}</p>
            )}
          </div>
        </div>
      )}

      {/* Progress Badges with Enhanced Animation */}
      <div className="flex items-center gap-4 flex-wrap">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className={cn(
            "neu-text-container p-4 flex items-center gap-3",
            progressData.contentComplete && "border-l-4 border-l-green-500"
          )}
        >
          <div className={cn(
            "neu-character w-8 h-8 flex items-center justify-center",
            progressData.contentComplete ? "bg-green-50" : "bg-gray-50"
          )}>
            {progressData.contentComplete && showAnimation ? (
              <OptimizedVideoAnimation
                src={getAnimationUrl('content-complete-check.mp4')}
                fallbackIcon={<CheckCircle className="w-4 h-4 text-green-600" />}
                className="w-4 h-4"
                context="ui"
              />
            ) : progressData.contentComplete ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Target className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div>
            <div className={cn(
              "font-semibold text-sm",
              progressData.contentComplete ? "text-green-700" : "text-gray-700"
            )}>
              {progressData.contentComplete ? 'Content Complete' : 'Reading Progress'}
            </div>
            <div className="text-xs text-muted-foreground">
              {progressData.completedItems}/{progressData.totalItems} items
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={cn(
            "neu-text-container p-4 flex items-center gap-3",
            progressData.chatComplete && "border-l-4 border-l-purple-500"
          )}
        >
          <div className={cn(
            "neu-character w-8 h-8 flex items-center justify-center",
            progressData.chatComplete ? "bg-purple-50" : "bg-gray-50"
          )}>
            {progressData.chatComplete && showAnimation ? (
              <OptimizedVideoAnimation
                src={getAnimationUrl('chat-complete-check.mp4')}
                fallbackIcon={<CheckCircle className="w-4 h-4 text-purple-600" />}
                className="w-4 h-4"
                context="ui"
              />
            ) : progressData.chatComplete ? (
              <CheckCircle className="w-4 h-4 text-purple-600" />
            ) : (
              <Clock className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div>
            <div className={cn(
              "font-semibold text-sm",
              progressData.chatComplete ? "text-purple-700" : "text-gray-700"
            )}>
              {progressData.chatComplete ? 'Chat Complete' : 'Chat Pending'}
            </div>
            {chatEngagement && (
              <div className="text-xs text-muted-foreground">
                {chatEngagement.exchangeCount} exchanges
              </div>
            )}
          </div>
        </motion.div>
        
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            <Badge className="bg-blue-100 text-blue-700 flex items-center gap-2 px-3 py-2">
              {showAnimation ? (
                <OptimizedVideoAnimation
                  src={getAnimationUrl('chapter-complete-trophy.mp4')}
                  fallbackIcon={<Trophy className="w-3 h-3" />}
                  className="w-3 h-3"
                  context="celebration"
                />
              ) : (
                <Trophy className="w-3 h-3" />
              )}
              Chapter Complete
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Enhanced Chapter Completion Section */}
      {progressData.isFullyComplete && !isCompleted && onMarkChapterComplete && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {showAnimation && (
                <div className="w-12 h-12">
                  <OptimizedVideoAnimation
                    src={getAnimationUrl('chapter-complete-celebration.mp4')}
                    fallbackIcon={
                      <BrandedIcon 
                        type="achievement" 
                        variant="animated" 
                        size="xl"
                        context="celebration"
                      />
                    }
                    className="w-full h-full"
                    context="celebration"
                  />
                </div>
              )}
              <div>
                <h4 className="font-bold text-green-800 text-lg">Chapter Complete!</h4>
                <p className="text-sm text-green-600 mt-1">
                  You've finished all sections. Mark this chapter as complete to continue your journey.
                </p>
              </div>
            </div>
            <Button
              onClick={onMarkChapterComplete}
              variant="gradient"
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Mark Chapter Complete
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const LessonProgress = memo(LessonProgressComponent);
