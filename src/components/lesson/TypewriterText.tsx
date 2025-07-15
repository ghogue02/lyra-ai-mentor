import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  startDelay?: number;
  preserveHTML?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  className = '',
  onComplete,
  startDelay = 0,
  preserveHTML = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (startDelay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
        setIsComplete(false);
      }, startDelay);
      return () => clearTimeout(delayTimer);
    }
  }, [startDelay]);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  if (preserveHTML) {
    return (
      <div 
        className={`${className} ${isComplete ? '' : 'after:content-[""] after:inline-block after:w-0.5 after:h-5 after:bg-current after:animate-pulse after:ml-0.5'}`}
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
    );
  }

  return (
    <div className={`${className} ${isComplete ? '' : 'after:content-[""] after:inline-block after:w-0.5 after:h-5 after:bg-current after:animate-pulse after:ml-0.5'}`}>
      {displayText}
    </div>
  );
};