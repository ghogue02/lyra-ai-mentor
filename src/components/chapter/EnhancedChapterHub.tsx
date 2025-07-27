import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, PlayCircle, ArrowRight, Lock } from 'lucide-react';
import { BrandedButton } from '@/components/ui/BrandedButton';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { cn } from '@/lib/utils';
import { BrandedIcon } from '@/components/ui/BrandedIcon';
import VideoAnimation from '@/components/ui/VideoAnimation';
import AnimatedProgress from '@/components/ui/AnimatedProgress';
import { ProgressCelebration } from '@/components/ui/ProgressCelebration';
import { getAnimationUrl, getLyraIconUrl } from '@/utils/supabaseIcons';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  iconType: 'ethics' | 'data' | 'workflow' | 'communication' | 'achievement' | 'growth' | 'mission' | 'network' | 'learning';
  route: string;
  estimated_time: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  unlocked: boolean;
}

interface EnhancedChapterHubProps {
  chapterNumber: number;
  title: string;
  description: string;
  characterName: string;
  characterType: 'lyra' | 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  microLessons: MicroLesson[];
  bgGradient: string;
  completionRoute?: string;
  nextChapterRoute?: string;
}

export const EnhancedChapterHub: React.FC<EnhancedChapterHubProps> = ({
  chapterNumber,
  title,
  description,
  characterName,
  characterType,
  microLessons,
  bgGradient,
  completionRoute,
  nextChapterRoute
}) => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const completedCount = microLessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedCount / microLessons.length) * 100;
  const isChapterComplete = completedCount === microLessons.length;

  const handleLessonSelect = (lesson: MicroLesson) => {
    if (!lesson.unlocked) return;
    
    setSelectedLesson(lesson.id);
    setTimeout(() => {
      navigate(lesson.route);
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${bgGradient}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Character & Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-20 h-20">
              <VideoAnimation
                src={getAnimationUrl(`${characterType}-avatar-animated.mp4`)}
                fallbackIcon={
                  <img 
                    src={getLyraIconUrl('default')} 
                    alt={characterName}
                    className="w-full h-full rounded-full object-cover"
                  />
                }
                className="w-full h-full rounded-full"
                context="character"
                loop={true}
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Chapter {chapterNumber}: {title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{description}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <AnimatedProgress 
                    value={progressPercentage} 
                    className="mb-2" 
                    showAnimation={true}
                  />
                  <p className="text-sm text-gray-600">
                    {completedCount} of {microLessons.length} lessons completed
                  </p>
                </div>
                {isChapterComplete && (
                  <div className="w-8 h-8">
                    <VideoAnimation
                      src={getAnimationUrl('chapter-complete.mp4')}
                      fallbackIcon={<CheckCircle className="w-8 h-8 text-green-600" />}
                      className="w-full h-full"
                      context="celebration"
                      loop={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Micro-Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {microLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: lesson.unlocked ? 1.05 : 1 }}
              className={cn(
                "group cursor-pointer",
                !lesson.unlocked && "cursor-not-allowed opacity-50"
              )}
              onClick={() => handleLessonSelect(lesson)}
            >
              <InteractiveCard className={cn(
                "h-full transition-all duration-300",
                lesson.completed && "bg-green-50 border-green-200",
                selectedLesson === lesson.id && "ring-2 ring-primary",
                lesson.unlocked && "hover:shadow-lg",
                !lesson.unlocked && "bg-gray-50"
              )}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 relative">
                      {lesson.unlocked ? (
                        <div className="group-hover:scale-110 transition-transform">
                          <VideoAnimation
                            src={getAnimationUrl('button-hover-glow.mp4')}
                            fallbackIcon={
                              <BrandedIcon 
                                type={lesson.iconType} 
                                variant="static" 
                                size="lg"
                              />
                            }
                            className="w-full h-full"
                            context="ui"
                            loop={false}
                            trigger="hover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      {lesson.completed && (
                        <div className="absolute -top-2 -right-2 w-6 h-6">
                          <VideoAnimation
                            src={getAnimationUrl('completion-checkmark.mp4')}
                            fallbackIcon={<CheckCircle className="w-6 h-6 text-green-600" />}
                            className="w-full h-full"
                            context="ui"
                            loop={false}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lesson.estimated_time}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {lesson.unlocked ? (
                      <BrandedButton 
                        size="sm" 
                        className="group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        {lesson.completed ? 'Review' : 'Start'} 
                        <PlayCircle className="w-4 h-4 ml-2" />
                      </BrandedButton>
                    ) : (
                      <BrandedButton size="sm" disabled variant="ghost">
                        Locked <Lock className="w-4 h-4 ml-2" />
                      </BrandedButton>
                    )}
                    
                    {lesson.completed && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Complete
                      </span>
                    )}
                  </div>
              </div>
            </InteractiveCard>
            </motion.div>
          ))}
        </div>

        {/* Chapter Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <BrandedButton 
            onClick={() => navigate('/dashboard')} 
            variant="outline"
            size="lg"
          >
            Back to Dashboard
          </BrandedButton>
          
          {isChapterComplete && nextChapterRoute && (
            <BrandedButton 
              onClick={() => navigate(nextChapterRoute)}
              size="lg"
              variant="default"
            >
              Next Chapter <ArrowRight className="w-4 h-4 ml-2" />
            </BrandedButton>
          )}
          
          {completionRoute && (
            <BrandedButton 
              onClick={() => navigate(completionRoute)}
              variant="secondary"
              size="lg"
            >
              Chapter Summary
            </BrandedButton>
          )}
        </motion.div>
      </div>

      {/* Celebration Overlay */}
      <ProgressCelebration
        isVisible={showCelebration}
        onComplete={() => setShowCelebration(false)}
        type="chapter"
        title={`Chapter ${chapterNumber} Complete!`}
        subtitle={`Great work with ${characterName}!`}
        characterType={characterType}
      />
    </div>
  );
};