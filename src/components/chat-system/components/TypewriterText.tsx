import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
  paused?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  delay = 0,
  showCursor = false,
  className,
  onComplete,
  paused = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);

  // RAF-based typing animation for smooth performance
  useEffect(() => {
    if (!text || isComplete) return;

    // Reset if text changes
    if (displayedText === '' || !text.startsWith(displayedText)) {
      setDisplayedText('');
      setIsTyping(false);
      setIsComplete(false);
      currentIndexRef.current = 0;
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    }

    const animate = (timestamp: number) => {
      if (paused) {
        pausedTimeRef.current += 16; // Approximate frame time
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedTimeRef.current;
      }

      const elapsed = timestamp - startTimeRef.current - delay;
      
      if (elapsed < 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!isTyping) {
        setIsTyping(true);
      }

      const targetIndex = Math.floor(elapsed / speed);
      const actualIndex = Math.min(targetIndex, text.length);

      if (actualIndex > currentIndexRef.current) {
        currentIndexRef.current = actualIndex;
        setDisplayedText(text.substring(0, actualIndex));
      }

      if (actualIndex >= text.length) {
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text, speed, delay, paused, isComplete, displayedText, isTyping, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && isTyping && !paused && (
        <span
          className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse"
        />
      )}
    </span>
  );
};