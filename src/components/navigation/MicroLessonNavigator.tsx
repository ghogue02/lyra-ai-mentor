import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MicroLessonNavigatorProps {
  chapterNumber: number;
  chapterTitle: string;
  lessonTitle: string;
  characterName?: string;
}

export const MicroLessonNavigator: React.FC<MicroLessonNavigatorProps> = ({
  chapterNumber,
  chapterTitle,
  lessonTitle,
  characterName
}) => {
  const navigate = useNavigate();
  const [isScrolledToTop, setIsScrolledToTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const handleBackToChapter = () => {
    navigate(`/chapter/${chapterNumber}`);
  };

  // Scroll detection for mobile only
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

  return (
    <>
      {/* Visual indicator - subtle edge hint */}
      {!isMobile && !shouldShowNavigation && (
        <div 
          className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent z-30 opacity-50"
          onMouseEnter={handleMouseEnter}
        />
      )}
      
      {/* Larger hover zone for desktop */}
      {!isMobile && (
        <div 
          className="fixed top-0 left-0 w-full h-8 z-40 pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      
      {/* Fallback trigger - small always-visible button */}
      {!isMobile && !shouldShowNavigation && (
        <Button
          onClick={() => setIsHovered(true)}
          variant="ghost"
          size="sm"
          className="fixed top-2 right-4 z-45 opacity-30 hover:opacity-100 transition-opacity duration-200"
        >
          <ChevronLeft className="w-4 h-4 rotate-90" />
        </Button>
      )}
      
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 w-full z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border/50 transform transition-transform duration-300 ease-in-out ${
          shouldShowNavigation ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Back to chapter button */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBackToChapter}
                  className="hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to {chapterTitle}
                </Button>
                
                <div className="hidden sm:block text-muted-foreground">|</div>
                
                <div className="hidden sm:flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    Chapter {chapterNumber}
                  </Badge>
                  {characterName && (
                    <Badge variant="outline" className="text-xs">
                      {characterName}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right side - Lesson title */}
              <div className="flex items-center">
                <h2 className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
                  {lessonTitle}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};