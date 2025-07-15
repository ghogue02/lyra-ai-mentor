import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  ChevronLeft, 
  Menu, 
  X, 
  Home,
  MoreHorizontal,
  Share2,
  Bookmark,
  Settings,
  HelpCircle,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  useResponsive, 
  useViewportHeight, 
  useKeyboardVisibility, 
  useMobileFeatures,
  useSafeArea,
  useMobileNavigation
} from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EnhancedMobileWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  maxProgress?: number;
  enableSwipeBack?: boolean;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  actionButtons?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
  bottomActions?: React.ReactNode;
  fullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const EnhancedMobileWrapper: React.FC<EnhancedMobileWrapperProps> = ({
  children,
  title,
  subtitle,
  onBack,
  className,
  showProgress = false,
  progress = 0,
  maxProgress = 100,
  enableSwipeBack = true,
  enablePullToRefresh = false,
  onRefresh,
  actionButtons = [],
  bottomActions,
  fullScreen = false,
  onToggleFullScreen
}) => {
  const { isMobile, isTablet, isLandscape } = useResponsive();
  const viewportHeight = useViewportHeight();
  const isKeyboardVisible = useKeyboardVisibility();
  const { canShare, share, vibrate, hasTouch } = useMobileFeatures();
  const safeArea = useSafeArea();
  const { isNavigating, navigate } = useMobileNavigation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullOffset, setPullOffset] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  // Handle scroll detection for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setShowScrollTop(scrollTop > 200);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle swipe back gesture
  const handleSwipe = (info: PanInfo) => {
    if (!enableSwipeBack || !onBack || !isMobile) return;
    
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      vibrate(50);
      navigate(() => onBack());
    }
  };

  // Handle pull to refresh
  const handlePullStart = (event: React.TouchEvent) => {
    if (!enablePullToRefresh || !contentRef.current) return;
    startY.current = event.touches[0].clientY;
  };

  const handlePullMove = (event: React.TouchEvent) => {
    if (!enablePullToRefresh || !contentRef.current) return;
    
    const currentY = event.touches[0].clientY;
    const diff = currentY - startY.current;
    const scrollTop = contentRef.current.scrollTop;
    
    if (scrollTop === 0 && diff > 0) {
      setPullOffset(Math.min(diff * 0.5, 80));
    }
  };

  const handlePullEnd = async () => {
    if (!enablePullToRefresh || pullOffset < 60) {
      setPullOffset(0);
      return;
    }
    
    setIsRefreshing(true);
    vibrate(50);
    
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      setPullOffset(0);
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: subtitle || 'Check out this AI learning experience!',
      url: window.location.href
    };
    
    const shared = await share(shareData);
    if (!shared) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Could show toast notification here
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      vibrate(30);
    }
  };

  if (!isMobile && !isTablet) {
    // Desktop view - render children directly with minimal wrapper
    return (
      <div className={cn("w-full", className)}>
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{title}</span>
              <span>{progress}/{maxProgress}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress / maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden bg-background",
        className
      )}
      style={{ 
        minHeight: `${viewportHeight}px`,
        height: fullScreen ? `${viewportHeight}px` : 'auto',
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right
      }}
    >
      {/* Enhanced Mobile Header */}
      <motion.header 
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ top: safeArea.top }}
        animate={{ y: pullOffset * 0.3 }}
      >
        <div className="flex h-14 items-center px-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(() => onBack())}
              className="mr-2"
              disabled={isNavigating}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Action buttons */}
            {actionButtons.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                className="h-8 w-8"
              >
                {action.icon}
              </Button>
            ))}

            {/* Full screen toggle */}
            {onToggleFullScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFullScreen}
                className="h-8 w-8"
              >
                {fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}

            {/* More options menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="space-y-4 py-4">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  
                  <nav className="space-y-2">
                    {canShare && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={handleShare}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    )}
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save Progress
                    </Button>
                    
                    <Separator />
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help
                    </Button>
                    
                    {onBack && (
                      <>
                        <Separator />
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => navigate(() => onBack())}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          Back to Dashboard
                        </Button>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="px-4 pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}/{maxProgress}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <motion.div 
                className="bg-primary h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / maxProgress) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.header>

      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (
        <AnimatePresence>
          {(pullOffset > 0 || isRefreshing) && (
            <motion.div
              className="absolute top-14 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Card className="p-2 shadow-lg">
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Main Content */}
      <motion.main 
        ref={contentRef}
        className="relative flex-1 overflow-auto"
        style={{
          maxHeight: fullScreen 
            ? `${viewportHeight - 56 - safeArea.top - safeArea.bottom}px`
            : isKeyboardVisible
              ? `${viewportHeight * 0.6}px`
              : 'none',
          paddingBottom: bottomActions ? '80px' : '20px'
        }}
        onTouchStart={handlePullStart}
        onTouchMove={handlePullMove}
        onTouchEnd={handlePullEnd}
        drag={enableSwipeBack && hasTouch ? "x" : false}
        dragConstraints={{ left: 0, right: 300 }}
        dragElastic={{ left: 0, right: 0.2 }}
        onDragEnd={(_, info) => handleSwipe(info)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transform: `translateY(${pullOffset}px)`
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Bottom Actions */}
      {bottomActions && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t"
          style={{ 
            paddingBottom: safeArea.bottom,
            paddingLeft: safeArea.left,
            paddingRight: safeArea.right
          }}
          animate={{ y: isKeyboardVisible ? 100 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            {bottomActions}
          </div>
        </motion.div>
      )}

      {/* Swipe Back Indicator */}
      {enableSwipeBack && onBack && hasTouch && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 flex items-center justify-center pointer-events-none z-10">
          <div className="w-1 h-12 bg-primary/20 rounded-full" />
        </div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            className="fixed bottom-20 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <ChevronLeft className="w-5 h-5 rotate-90" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation feedback overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};