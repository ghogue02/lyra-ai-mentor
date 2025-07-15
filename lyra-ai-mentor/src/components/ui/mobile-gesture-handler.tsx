import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface MobileGestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
  className?: string;
}

export const MobileGestureHandler: React.FC<MobileGestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const { offset } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);
    
    // Determine if this was primarily a horizontal or vertical swipe
    if (absX > absY && absX > swipeThreshold) {
      // Horizontal swipe
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (absY > absX && absY > swipeThreshold) {
      // Vertical swipe
      if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
  };

  return (
    <div ref={constraintsRef} className={className}>
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 0.98 }}
        className={`cursor-grab active:cursor-grabbing ${isDragging ? 'select-none' : ''}`}
        style={{ x: 0, y: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Touch-friendly button component
interface TouchButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md'
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-300'
  };

  const sizeClasses = {
    sm: 'min-h-[44px] px-3 py-2 text-sm',
    md: 'min-h-[48px] px-4 py-3 text-base',
    lg: 'min-h-[52px] px-6 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        ${baseClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95 select-none
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      style={{
        transform: isPressed && !disabled ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.1s ease-in-out'
      }}
    >
      {children}
    </motion.button>
  );
};

export default MobileGestureHandler;