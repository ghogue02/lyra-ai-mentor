
import { useEffect, useRef, useState } from 'react';

interface UseScrollCompletionOptions {
  threshold?: number; // Percentage of element that needs to be visible
  delay?: number; // Time in milliseconds to wait before marking as complete
  onComplete?: () => void;
}

export const useScrollCompletion = ({
  threshold = 0.7,
  delay = 2000,
  onComplete
}: UseScrollCompletionOptions = {}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isCompleted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visibilityRatio = entry.intersectionRatio;
        
        setProgress(Math.min(visibilityRatio / threshold, 1) * 100);

        if (visibilityRatio >= threshold) {
          // Start completion timer
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsCompleted(true);
            onComplete?.();
          }, delay);
        } else {
          // Cancel completion timer if element becomes less visible
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100) // 0 to 1 in 0.01 steps
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [threshold, delay, onComplete, isCompleted]);

  return {
    elementRef,
    isCompleted,
    progress
  };
};
