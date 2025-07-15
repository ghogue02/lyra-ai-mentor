import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Menu, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useResponsive, useSwipeGestures, useViewportHeight } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface MobilePlaygroundWrapperProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  className?: string;
}

export const MobilePlaygroundWrapper: React.FC<MobilePlaygroundWrapperProps> = ({
  children,
  title,
  onBack,
  className
}) => {
  const { isMobile, isTablet, orientation } = useResponsive();
  const viewportHeight = useViewportHeight();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Handle swipe gestures for navigation
  useSwipeGestures({
    onSwipeRight: () => {
      if (isMobile && onBack) {
        onBack();
      }
    }
  });
  
  // Close menu on orientation change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [orientation]);
  
  if (!isMobile && !isTablet) {
    // Desktop view - render children directly
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden bg-background",
        className
      )}
      style={{ 
        minHeight: `${viewportHeight}px`,
        height: orientation === 'landscape' ? `${viewportHeight}px` : 'auto'
      }}
    >
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          <h1 className="flex-1 text-lg font-semibold truncate">{title}</h1>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="space-y-4 py-4">
                <h2 className="text-lg font-semibold">AI Playground</h2>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                  {/* Add more navigation items as needed */}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Main Content */}
      <main 
        className="relative flex-1 overflow-auto"
        style={{
          maxHeight: orientation === 'landscape' 
            ? `${viewportHeight - 56}px` 
            : 'none'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Swipe Indicator (for iOS) */}
      {isMobile && onBack && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 flex items-center justify-center pointer-events-none">
          <div className="w-1 h-12 bg-primary/10 rounded-full" />
        </div>
      )}
    </div>
  );
};