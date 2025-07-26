import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Home, RotateCcw, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedProgress from '@/components/ui/AnimatedProgress';

export type JourneyPhase = 
  | 'intro'
  | 'maya-introduction'
  | 'maya-struggle'
  | 'help-maya-first-attempt'
  | 'elena-introduction'
  | 'maya-pace-building'
  | 'maya-success-story'
  | 'personal-toolkit';

interface GlobalNavigationProps {
  currentPhase: JourneyPhase;
  onPhaseChange: (phase: JourneyPhase) => void;
  onExit: () => void;
  isStuck?: boolean;
  onReset?: () => void;
}

const phaseLabels: Record<JourneyPhase, string> = {
  'intro': 'Introduction',
  'maya-introduction': 'Maya\'s Story',
  'maya-struggle': 'Maya\'s Challenge',
  'help-maya-first-attempt': 'Help Maya (First Try)',
  'elena-introduction': 'Meet Lyra',
  'maya-pace-building': 'Building PACE',
  'maya-success-story': 'Maya\'s Success',
  'personal-toolkit': 'Your Toolkit'
};

const phaseOrder: JourneyPhase[] = [
  'intro',
  'maya-introduction',
  'help-maya-first-attempt',
  'elena-introduction',
  'maya-pace-building',
  'maya-success-story',
  'personal-toolkit'
];

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  currentPhase,
  onPhaseChange,
  onExit,
  isStuck = false,
  onReset
}) => {
  const [isScrolledToTop, setIsScrolledToTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const currentIndex = phaseOrder.indexOf(currentPhase);
  const canGoBack = currentIndex > 0;
  
  // Exclude 'intro' from user-facing progress calculations
  const userFacingPhases = phaseOrder.filter(phase => phase !== 'intro') as Exclude<JourneyPhase, 'intro'>[];
  const userFacingIndex = currentPhase === 'intro' ? -1 : userFacingPhases.indexOf(currentPhase as Exclude<JourneyPhase, 'intro'>);
  const progress = userFacingIndex >= 0 ? ((userFacingIndex + 1) / userFacingPhases.length) * 100 : 0;
  const displayIndex = userFacingIndex >= 0 ? userFacingIndex + 1 : 1;
  const totalDisplaySteps = userFacingPhases.length;

  // Scroll detection for mobile only
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolledToTop(scrollTop <= 10); // Show navigation when scrolled very close to top
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleGoBack = () => {
    if (canGoBack) {
      const previousPhase = phaseOrder[currentIndex - 1];
      onPhaseChange(previousPhase);
    }
  };

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
    }, 300); // 300ms delay before hiding
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
          className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 z-30 opacity-50"
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
        <Card className={`bg-white/95 backdrop-blur-sm border-b shadow-sm transform transition-transform duration-300 ease-in-out ${
          shouldShowNavigation ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and breadcrumb */}
            <div className="flex items-center gap-4">
              {canGoBack && (
                <Button
                  onClick={handleGoBack}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {displayIndex} / {totalDisplaySteps}
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  {phaseLabels[currentPhase]}
                </span>
              </div>
            </div>

            {/* Center - Animated Progress bar */}
            <div className="flex-1 max-w-md mx-8">
              <AnimatedProgress
                value={progress}
                size="sm"
                showAnimation={true}
              />
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-2">
              {isStuck && onReset && (
                <Button
                  onClick={onReset}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Reset Section
                </Button>
              )}
              
              <Button
                onClick={() => onPhaseChange('intro')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
              
              <Button
                onClick={onExit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </>
  );
};
export default GlobalNavigation;