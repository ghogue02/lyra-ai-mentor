import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface MobilePerformanceWrapperProps {
  children: ReactNode;
  className?: string;
  reduceAnimations?: boolean;
  lazyLoad?: boolean;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
}

export const MobilePerformanceWrapper: React.FC<MobilePerformanceWrapperProps> = ({
  children,
  className,
  reduceAnimations = true,
  lazyLoad = true,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder = <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
}) => {
  const [isInView, setIsInView] = useState(!lazyLoad);
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useResponsive();
  
  // Check device performance
  useEffect(() => {
    if (!reduceAnimations) return;
    
    const checkPerformance = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const isLowEndDevice = deviceMemory && deviceMemory < 4;
      
      // Check connection speed
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.saveData === true
      );
      
      // Reduce animations on mobile/tablet with low performance indicators
      setShouldReduceAnimations(
        (isMobile || isTablet) && (
          prefersReducedMotion || 
          isLowEndDevice || 
          isSlowConnection
        )
      );
    };
    
    checkPerformance();
    
    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', checkPerformance);
      return () => connection.removeEventListener('change', checkPerformance);
    }
  }, [isMobile, isTablet, reduceAnimations]);
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !elementRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );
    
    observer.observe(elementRef.current);
    
    return () => observer.disconnect();
  }, [lazyLoad, threshold, rootMargin]);
  
  // Apply performance optimizations
  const performanceClasses = cn(
    shouldReduceAnimations && 'motion-reduce',
    className
  );
  
  // Add performance CSS
  useEffect(() => {
    if (!shouldReduceAnimations) return;
    
    const style = document.createElement('style');
    style.textContent = `
      .motion-reduce * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .motion-reduce::before,
      .motion-reduce::after,
      .motion-reduce *::before,
      .motion-reduce *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [shouldReduceAnimations]);
  
  return (
    <div ref={elementRef} className={performanceClasses}>
      {isInView ? children : placeholder}
    </div>
  );
};

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isMobile } = useResponsive();
  
  // Generate optimized src based on device
  const getOptimizedSrc = () => {
    if (!isMobile) return src;
    
    // If using a CDN that supports image optimization
    const url = new URL(src, window.location.origin);
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('w', window.innerWidth.toString());
    
    return url.toString();
  };
  
  useEffect(() => {
    if (!imgRef.current || priority) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = getOptimizedSrc();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, [priority]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={priority ? getOptimizedSrc() : undefined}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          error && "hidden"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading={priority ? "eager" : "lazy"}
      />
      
      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Offline-capable content wrapper
interface OfflineContentProps {
  children: ReactNode;
  storageKey: string;
  fallbackContent?: ReactNode;
}

export const OfflineContent: React.FC<OfflineContentProps> = ({
  children,
  storageKey,
  fallbackContent = <div className="p-4 text-center text-gray-500">Content unavailable offline</div>
}) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cachedContent, setCachedContent] = useState<string | null>(null);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load cached content
    if (isOffline) {
      const cached = localStorage.getItem(`offline_${storageKey}`);
      setCachedContent(cached);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [storageKey]);
  
  // Save content when online
  useEffect(() => {
    if (!isOffline && children) {
      try {
        localStorage.setItem(`offline_${storageKey}`, JSON.stringify(children));
      } catch (e) {
        console.error('Failed to cache content:', e);
      }
    }
  }, [isOffline, children, storageKey]);
  
  if (isOffline && !cachedContent) {
    return <>{fallbackContent}</>;
  }
  
  return <>{children}</>;
};