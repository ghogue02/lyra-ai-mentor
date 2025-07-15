import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileGestureHandler, TouchButton } from './mobile-gesture-handler';

interface MobileResponsiveWrapperProps {
  children: ReactNode;
  currentStage: number;
  totalStages: number;
  onStageChange: (direction: 'next' | 'prev') => void;
  showNavigation?: boolean;
  className?: string;
}

export const MobileResponsiveWrapper: React.FC<MobileResponsiveWrapperProps> = ({
  children,
  currentStage,
  totalStages,
  onStageChange,
  showNavigation = true,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Update orientation
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100); // Delay to get accurate dimensions after rotation
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const handleSwipe = {
    left: () => {
      if (currentStage < totalStages - 1) {
        onStageChange('next');
      }
    },
    right: () => {
      if (currentStage > 0) {
        onStageChange('prev');
      }
    },
    up: () => {
      // Could be used for other actions like expanding content
    },
    down: () => {
      // Could be used for other actions like minimizing content
    }
  };

  const NavigationDots = () => (
    <div className="flex justify-center items-center space-x-2 py-2">
      {Array.from({ length: totalStages }, (_, index) => (
        <motion.button
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            index === currentStage 
              ? "bg-purple-600 w-6" 
              : "bg-gray-300 hover:bg-gray-400"
          )}
          onClick={() => {
            const direction = index > currentStage ? 'next' : 'prev';
            onStageChange(direction);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to stage ${index + 1}`}
        />
      ))}
    </div>
  );

  const MobileNavigation = () => (
    <AnimatePresence>
      {isMobile && showMobileNav && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Navigation</h3>
            <button
              onClick={() => setShowMobileNav(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <TouchButton
              onClick={() => {
                if (currentStage > 0) onStageChange('prev');
                setShowMobileNav(false);
              }}
              disabled={currentStage === 0}
              variant="outline"
              size="md"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </TouchButton>
            
            <TouchButton
              onClick={() => {
                if (currentStage < totalStages - 1) onStageChange('next');
                setShowMobileNav(false);
              }}
              disabled={currentStage === totalStages - 1}
              variant="primary"
              size="md"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </TouchButton>
          </div>
          
          <NavigationDots />
          
          <div className="text-center text-sm text-gray-600 mt-2">
            Stage {currentStage + 1} of {totalStages}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const MobileNavButton = () => (
    isMobile && showNavigation && (
      <motion.button
        className="fixed bottom-4 right-4 z-40 bg-purple-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setShowMobileNav(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open navigation"
      >
        <Menu className="w-6 h-6" />
      </motion.button>
    )
  );

  const SwipeIndicator = () => (
    isMobile && (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/20 text-white px-3 py-1 rounded-full text-xs">
        Swipe to navigate
      </div>
    )
  );

  return (
    <div className={cn(
      "relative w-full h-full",
      isMobile && orientation === 'landscape' && "overflow-hidden",
      className
    )}>
      {/* Swipe gesture handler for mobile */}
      {isMobile ? (
        <MobileGestureHandler
          onSwipeLeft={handleSwipe.left}
          onSwipeRight={handleSwipe.right}
          onSwipeUp={handleSwipe.up}
          onSwipeDown={handleSwipe.down}
          className="w-full h-full"
        >
          <div className="w-full h-full">
            <SwipeIndicator />
            {children}
          </div>
        </MobileGestureHandler>
      ) : (
        <div className="w-full h-full">
          {children}
        </div>
      )}
      
      {/* Mobile navigation components */}
      <MobileNavButton />
      <MobileNavigation />
    </div>
  );
};

// Mobile-optimized loading component
interface MobileLoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const MobileLoading: React.FC<MobileLoadingProps> = ({
  message = 'Loading...',
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      
      <p className="text-gray-600 text-center">{message}</p>
      
      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
};

// Mobile-optimized error component
interface MobileErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const MobileError: React.FC<MobileErrorProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <X className="w-8 h-8 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      
      {showRetry && onRetry && (
        <TouchButton
          onClick={onRetry}
          variant="primary"
          size="md"
        >
          Try Again
        </TouchButton>
      )}
    </div>
  );
};

export default MobileResponsiveWrapper;