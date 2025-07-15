import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions
const BREAKPOINTS = {
  xs: 375,    // Mobile S
  sm: 640,    // Mobile L / Tablet Portrait
  md: 768,    // Tablet
  lg: 1024,   // Desktop
  xl: 1280,   // Desktop L
  '2xl': 1536 // Desktop XL
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;
type DeviceType = 'mobile' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';

interface ResponsiveState {
  // Device info
  deviceType: DeviceType;
  orientation: Orientation;
  
  // Dimensions
  width: number;
  height: number;
  
  // Breakpoint checks
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Specific breakpoints
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  
  // Utilities
  isTouch: boolean;
  isMouse: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  
  // Helpers
  breakpoint: Breakpoint;
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => getResponsiveState());

  // Get current responsive state
  function getResponsiveState(): ResponsiveState {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';
    
    // Determine device type
    let deviceType: DeviceType = 'desktop';
    if (width < BREAKPOINTS.md) {
      deviceType = 'mobile';
    } else if (width < BREAKPOINTS.lg) {
      deviceType = 'tablet';
    }
    
    // Check breakpoints
    const isXs = width < BREAKPOINTS.sm;
    const isSm = width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
    const isMd = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
    const isLg = width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
    const isXl = width >= BREAKPOINTS.xl && width < BREAKPOINTS['2xl'];
    const is2xl = width >= BREAKPOINTS['2xl'];
    
    // Determine current breakpoint
    let breakpoint: Breakpoint = '2xl';
    if (isXs) breakpoint = 'xs';
    else if (isSm) breakpoint = 'sm';
    else if (isMd) breakpoint = 'md';
    else if (isLg) breakpoint = 'lg';
    else if (isXl) breakpoint = 'xl';
    
    // Check input capabilities
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    return {
      deviceType,
      orientation,
      width,
      height,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isXs,
      isSm,
      isMd,
      isLg,
      isXl,
      is2xl,
      isTouch,
      isMouse,
      isLandscape: orientation === 'landscape',
      isPortrait: orientation === 'portrait',
      breakpoint,
      isAbove: (bp: Breakpoint) => width >= BREAKPOINTS[bp],
      isBelow: (bp: Breakpoint) => width < BREAKPOINTS[bp]
    };
  }

  // Update state on resize
  const handleResize = useCallback(() => {
    setState(getResponsiveState());
  }, []);

  useEffect(() => {
    // Initial setup
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  return state;
}

// Additional hook for detecting swipe gestures
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGestures(handlers: SwipeHandlers) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);
  
  const onTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          handlers.onSwipeLeft?.();
        } else {
          handlers.onSwipeRight?.();
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          handlers.onSwipeUp?.();
        } else {
          handlers.onSwipeDown?.();
        }
      }
    }
  }, [touchStart, touchEnd, handlers]);
  
  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);
}

// Hook for handling viewport height on mobile (accounts for browser chrome)
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(window.innerHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);
  
  return viewportHeight;
}

// Hook for detecting keyboard visibility on mobile
export function useKeyboardVisibility() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { isMobile } = useResponsive();
  
  useEffect(() => {
    if (!isMobile) return;
    
    let timeout: NodeJS.Timeout;
    
    const handleFocusIn = () => {
      timeout = setTimeout(() => setIsKeyboardVisible(true), 300);
    };
    
    const handleFocusOut = () => {
      clearTimeout(timeout);
      setIsKeyboardVisible(false);
    };
    
    const handleResize = () => {
      // More robust keyboard detection
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const standardHeight = window.screen.height;
      const heightDifference = standardHeight - currentHeight;
      
      // If height difference is significant, keyboard is likely visible
      setIsKeyboardVisible(heightDifference > 150);
    };
    
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isMobile]);
  
  return isKeyboardVisible;
}

// Enhanced hook for mobile-specific features
export function useMobileFeatures() {
  const [hasTouch, setHasTouch] = useState(false);
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canShare, setCanShare] = useState(false);
  
  useEffect(() => {
    setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setSupportsPWA('serviceWorker' in navigator);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    setCanShare('share' in navigator);
  }, []);
  
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };
  
  const share = async (data: ShareData) => {
    if (canShare && navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.warn('Share failed:', error);
        return false;
      }
    }
    return false;
  };
  
  return {
    hasTouch,
    supportsPWA,
    isStandalone,
    canShare,
    vibrate,
    share
  };
}

// Hook for handling safe areas (iPhone notch, etc.)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  
  useEffect(() => {
    const updateSafeArea = () => {
      const computed = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computed.getPropertyValue('--sat') || '0'),
        bottom: parseInt(computed.getPropertyValue('--sab') || '0'),
        left: parseInt(computed.getPropertyValue('--sal') || '0'),
        right: parseInt(computed.getPropertyValue('--sar') || '0')
      });
    };
    
    updateSafeArea();
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);
  
  return safeArea;
}

// Hook for mobile navigation patterns
export function useMobileNavigation() {
  const [isNavigating, setIsNavigating] = useState(false);
  const { isMobile } = useResponsive();
  
  const navigate = useCallback((callback: () => void) => {
    if (isMobile) {
      setIsNavigating(true);
      // Add haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      setTimeout(() => {
        callback();
        setIsNavigating(false);
      }, 150); // Brief delay for visual feedback
    } else {
      callback();
    }
  }, [isMobile]);
  
  return {
    isNavigating,
    navigate
  };
}