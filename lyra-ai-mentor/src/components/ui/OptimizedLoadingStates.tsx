import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  className?: string;
  message?: string;
  variant?: 'default' | 'minimal' | 'fancy';
}

// Skeleton loader with shimmer effect
export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-muted relative overflow-hidden",
      "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
      "after:translate-x-[-100%] after:animate-[shimmer_2s_infinite]",
      className
    )}
  />
);

// Optimized loading spinner
export const LoadingSpinner = ({ 
  className, 
  message = "Loading...", 
  variant = 'default' 
}: LoadingStateProps) => {
  if (variant === 'minimal') {
    return <Loader2 className={cn("animate-spin", className)} />;
  }

  if (variant === 'fancy') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className={cn("w-8 h-8 text-primary", className)} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          {message}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Loader2 className={cn("animate-spin", className)} />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};

// Content loader with multiple skeletons
export const ContentLoader = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        style={{ width: `${100 - (i * 15)}%` }}
      />
    ))}
  </div>
);

// Card skeleton loader
export const CardSkeleton = () => (
  <div className="rounded-lg border bg-card p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <ContentLoader lines={4} />
  </div>
);

// List skeleton loader
export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Progress loader
export const ProgressLoader = ({ 
  progress = 0, 
  message = "Processing..." 
}: { 
  progress?: number; 
  message?: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{message}</span>
      <span className="font-medium">{Math.round(progress)}%</span>
    </div>
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
        className="h-full bg-primary"
      />
    </div>
  </div>
);

// Add shimmer animation to globals.css
const shimmerKeyframes = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;