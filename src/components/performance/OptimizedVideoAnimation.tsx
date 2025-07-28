import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Image as ImageIcon, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  usePerformance, 
  useIntersectionObserver, 
  useAssetPreloader,
  getCachedAssetUrl,
  shouldLoadAsset
} from './PerformanceOptimizer';

interface OptimizedVideoAnimationProps {
  src: string;
  fallbackIcon?: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  onError?: () => void;
  onLoad?: () => void;
  trigger?: 'hover' | 'visible' | 'always';
  context?: 'progress' | 'character' | 'ui' | 'celebration';
  priority?: 'high' | 'medium' | 'low';
  maxRetries?: number;
  enableAccessibility?: boolean;
  ariaLabel?: string;
  alt?: string;
}

const OptimizedVideoAnimation: React.FC<OptimizedVideoAnimationProps> = memo(({
  src,
  fallbackIcon = <Play className="w-12 h-12 text-primary" />,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'metadata',
  onError,
  onLoad,
  trigger = 'always',
  context = 'ui',
  priority = 'medium',
  maxRetries = 3,
  enableAccessibility = true,
  ariaLabel,
  alt
}) => {
  const { config, canAnimate, endAnimation, getAssetState, setAssetState } = usePerformance();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationId = React.useMemo(() => `video-${src}-${Date.now()}`, [src]);
  
  // Asset state management
  const assetState = getAssetState(src);
  const [isVisible, setIsVisible] = React.useState(trigger === 'always');
  const [isHovered, setIsHovered] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [shouldPlay, setShouldPlay] = React.useState(false);

  // Determine if we should load this asset
  const shouldLoad = useMemo(() => shouldLoadAsset(src), [src]);
  
  // Get optimized URL
  const optimizedSrc = useMemo(() => {
    if (!shouldLoad) return '';
    return getCachedAssetUrl(src);
  }, [src, shouldLoad]);

  // Preload critical assets
  useAssetPreloader(priority === 'high' ? [optimizedSrc] : []);

  // Intersection observer for visibility-based loading
  const observerRef = useIntersectionObserver(
    useCallback((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, []),
    { threshold: 0.1, id: `video-observer-${animationId}` }
  );

  // Determine play state based on trigger and conditions
  const shouldPlayVideo = useMemo(() => {
    if (!config.enableAnimations || config.prefersReducedMotion) return false;
    if (!shouldLoad || !optimizedSrc) return false;
    if (!isVisible) return false;
    
    switch (trigger) {
      case 'hover':
        return isHovered;
      case 'visible':
        return isVisible;
      case 'always':
        return true;
      default:
        return false;
    }
  }, [config, shouldLoad, optimizedSrc, isVisible, trigger, isHovered]);

  // Handle video loading and playback
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlayVideo) return;

    const handleLoadStart = () => {
      setAssetState(src, { loading: true, error: false });
    };

    const handleLoadedData = () => {
      setAssetState(src, { loading: false, loaded: true, error: false });
      setShouldPlay(true);
      onLoad?.();
    };

    const handleError = () => {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      if (newRetryCount <= maxRetries) {
        // Retry after a delay
        setTimeout(() => {
          if (video) {
            video.load();
          }
        }, 1000 * newRetryCount);
      } else {
        setAssetState(src, { loading: false, error: true });
        onError?.();
      }
    };

    const handleCanPlay = () => {
      if (shouldPlayVideo && canAnimate(animationId)) {
        video.play().catch((error) => {
          console.warn('Video autoplay failed:', error);
          // Silently handle autoplay restrictions
        });
      }
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      endAnimation(animationId);
    };
  }, [shouldPlayVideo, canAnimate, animationId, endAnimation, src, setAssetState, onLoad, onError, retryCount, maxRetries]);

  // Handle play/pause based on state
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay && shouldPlayVideo) {
      video.play().catch(() => {
        // Handle autoplay restrictions gracefully
      });
    } else {
      video.pause();
    }
  }, [shouldPlay, shouldPlayVideo]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      endAnimation(animationId);
    };
  }, [endAnimation, animationId]);

  // Handle hover events
  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      setIsHovered(true);
    }
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      setIsHovered(false);
    }
  }, [trigger]);

  // Ref callback that combines container ref and observer ref
  const containerRefCallback = useCallback((element: HTMLDivElement | null) => {
    containerRef.current = element;
    if (trigger === 'visible' && element) {
      observerRef(element);
    }
  }, [observerRef, trigger]);

  // Handle reduced motion or disabled animations
  if (!config.enableAnimations || config.prefersReducedMotion || !shouldLoad) {
    return (
      <div 
        className={cn("flex items-center justify-center", className)}
        role={enableAccessibility ? "img" : undefined}
        aria-label={enableAccessibility ? (ariaLabel || alt || "Decorative animation") : undefined}
      >
        <motion.div
          animate={config.enableAnimations ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {fallbackIcon}
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRefCallback}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={enableAccessibility ? "img" : undefined}
      aria-label={enableAccessibility ? (ariaLabel || alt || "Video animation") : undefined}
    >
      {/* Loading State */}
      {assetState.loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </motion.div>
      )}

      {/* Error State */}
      {assetState.error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
        >
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs text-center">
            Animation unavailable
            {retryCount > 0 && (
              <div className="text-xs opacity-70">
                Retry {retryCount}/{maxRetries}
              </div>
            )}
          </span>
        </motion.div>
      )}

      {/* Fallback while not visible or loading */}
      {(!isVisible || (!assetState.loaded && !assetState.loading)) && (
        <motion.div
          animate={config.enableAnimations ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center w-full h-full"
        >
          {fallbackIcon}
        </motion.div>
      )}

      {/* Video Element */}
      {optimizedSrc && isVisible && (
        <video
          ref={videoRef}
          src={optimizedSrc}
          autoPlay={false} // Controlled manually
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            assetState.loaded && shouldPlay ? 'opacity-100' : 'opacity-0',
            className.includes('nm-mascot-video') ? 'nm-mascot-video' : ''
          )}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover'
          }}
          // Accessibility attributes
          aria-hidden={!enableAccessibility}
          tabIndex={enableAccessibility ? 0 : -1}
        />
      )}

      {/* Play/Pause Indicator for hover trigger */}
      {trigger === 'hover' && config.enableAnimations && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.8 : 0 }}
          className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
        >
          {shouldPlay ? (
            <Pause className="w-3 h-3 text-white" />
          ) : (
            <Play className="w-3 h-3 text-white" />
          )}
        </motion.div>
      )}
    </div>
  );
});

OptimizedVideoAnimation.displayName = 'OptimizedVideoAnimation';

export { OptimizedVideoAnimation };