import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, PlayCircle, ArrowRight, Lock, ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BrandedIcon } from '@/components/ui/BrandedIcon';
import { OptimizedVideoAnimation } from '@/components/performance/OptimizedVideoAnimation';
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
  const [isScrolledToTop, setIsScrolledToTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const completedCount = microLessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedCount / microLessons.length) * 100;
  const isChapterComplete = completedCount === microLessons.length;

  // Hover navigation logic
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolledToTop(scrollTop <= 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300);
    setHideTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  const shouldShowNavigation = (!isMobile && isHovered) || (isMobile && isScrolledToTop);

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
      {/* Hover Navigation */}
      <>
        {/* Visual indicator - subtle edge hint */}
        {!isMobile && !shouldShowNavigation && (
          <div 
            className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent z-20 opacity-50"
            onMouseEnter={handleMouseEnter}
          />
        )}
        
        {/* Larger hover zone for desktop */}
        {!isMobile && (
          <div 
            className="fixed top-0 left-0 w-full h-8 z-35 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
        
        {/* Fallback trigger - small always-visible button */}
        {!isMobile && !shouldShowNavigation && (
          <button
            onClick={() => setIsHovered(true)}
            className="nm-button nm-button-ghost fixed top-2 right-4 z-30 opacity-30 hover:opacity-100 transition-opacity duration-200 px-2 py-2"
          >
            <ChevronLeft className="w-4 h-4 rotate-90" />
          </button>
        )}
        
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 w-full z-40"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border/50 transform transition-transform duration-300 ease-in-out ${
            shouldShowNavigation ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="nm-button nm-button-ghost hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </button>
                </div>
                
                <div className="flex items-center">
                  <h2 className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
                    Chapter {chapterNumber}: {title}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
      
      <div className="max-w-6xl mx-auto p-6 pt-16 sm:pt-20 lg:pt-6">
        {/* Header with Character & Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Character Avatar - Centered and Larger */}
          <div className="flex justify-center mb-6 mt-4 sm:mt-2 lg:mt-0">
            <div className="w-28 h-28">
              <OptimizedVideoAnimation
                src={getAnimationUrl(`${characterType}-avatar-animated.mp4`)}
                fallbackIcon={
                  <img 
                    src={getLyraIconUrl('default')} 
                    alt={characterName}
                    className="w-full h-full rounded-full object-cover"
                  />
                }
                className="w-full h-full rounded-full"
                loop={true}
              />
            </div>
          </div>
          
          {/* Chapter Info - Centered */}
          <div className="max-w-3xl mx-auto mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Chapter {chapterNumber}: {title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{description}</p>
            
            {/* Progress Section */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 max-w-md">
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
                  <OptimizedVideoAnimation
                    src={getAnimationUrl('chapter-complete.mp4')}
                    fallbackIcon={<CheckCircle className="w-8 h-8 text-green-600" />}
                    className="w-full h-full"
                    loop={false}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Micro-Lessons Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {microLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: lesson.unlocked ? 1.02 : 1 }}
              className={cn(
                "group cursor-pointer",
                !lesson.unlocked && "cursor-not-allowed opacity-50"
              )}
              onClick={() => handleLessonSelect(lesson)}
            >
               <div className={cn(
                "nm-card h-full min-h-[180px] transition-all duration-300",
                lesson.completed && "bg-green-50/50 border-green-200",
                selectedLesson === lesson.id && "ring-2 ring-primary",
                lesson.unlocked && "hover:nm-shadow-floating hover:shadow-primary/10",
                !lesson.unlocked && "bg-muted/30 opacity-50"
              )}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      {lesson.unlocked ? (
                        <div className="group-hover:scale-110 transition-transform duration-300">
                          <OptimizedVideoAnimation
                            src={getAnimationUrl('button-hover-glow.mp4')}
                            fallbackIcon={
                              <BrandedIcon 
                                type={lesson.iconType} 
                                variant="static" 
                                size="lg"
                              />
                            }
                            className="w-full h-full"
                            trigger="hover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                          <Lock className="w-7 h-7 text-muted-foreground" />
                        </div>
                      )}
                      {lesson.completed && (
                        <div className="absolute -top-2 -right-2 w-7 h-7">
                          <OptimizedVideoAnimation
                            src={getAnimationUrl('completion-checkmark.mp4')}
                            fallbackIcon={<CheckCircle className="w-7 h-7 text-green-600" />}
                            className="w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                     <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-3 leading-tight">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                    {lesson.unlocked ? (
                      <button 
                        className="nm-button nm-button-primary px-6 py-2 text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                      >
                        {lesson.completed ? 'Review' : 'Start'} 
                        <PlayCircle className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button className="nm-button nm-button-ghost px-6 py-2 text-sm font-medium" disabled>
                        Locked <Lock className="w-4 h-4 ml-2" />
                      </button>
                    )}
                    
                    {lesson.completed && (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </span>
                    )}
                  </div>
              </div>
            </div>
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
          <button 
            onClick={() => navigate('/dashboard')} 
            className="nm-button nm-button-ghost px-8 py-3 text-lg font-semibold"
          >
            Back to Dashboard
          </button>
          
          {isChapterComplete && nextChapterRoute && (
            <button 
              onClick={() => navigate(nextChapterRoute)}
              className="nm-button nm-button-primary px-8 py-3 text-lg font-semibold"
            >
              Next Chapter <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
          
          {completionRoute && (
            <button 
              onClick={() => navigate(completionRoute)}
              className="nm-button nm-button-ghost px-8 py-3 text-lg font-semibold"
            >
              Chapter Summary
            </button>
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