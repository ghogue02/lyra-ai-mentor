import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimpleVoiceIndicator } from './VoiceVisualizer';

interface MobileVoiceButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  voiceActivityDetected: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
  className?: string;
}

export const MobileVoiceButton: React.FC<MobileVoiceButtonProps> = ({
  isRecording,
  isProcessing,
  voiceActivityDetected,
  onToggleRecording,
  disabled,
  className
}) => {
  const [touchStart, setTouchStart] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Handle press-to-talk functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isProcessing) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setTouchStart(true);
    
    // Add ripple effect
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    
    // Start recording after a short delay
    const timer = setTimeout(() => {
      if (!isRecording) {
        onToggleRecording();
      }
    }, 100);
    
    setHoldTimer(timer);
  };

  const handleTouchEnd = () => {
    setTouchStart(false);
    
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    
    // Stop recording if currently recording
    if (isRecording) {
      onToggleRecording();
    }
  };

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
      }
    };
  }, [holdTimer]);

  return (
    <div className={cn("relative", className)}>
      {/* Pulse animation when recording */}
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" style={{ animationDelay: '0.5s' }} />
        </>
      )}
      
      <Button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => {
          if (!('ontouchstart' in window)) {
            e.preventDefault();
            if (!disabled && !isProcessing && !isRecording) {
              onToggleRecording();
            }
          }
        }}
        onMouseUp={(e) => {
          if (!('ontouchstart' in window)) {
            e.preventDefault();
            if (isRecording) {
              onToggleRecording();
            }
          }
        }}
        disabled={disabled || isProcessing}
        className={cn(
          "relative w-20 h-20 rounded-full transition-all duration-300 overflow-hidden",
          "shadow-lg hover:shadow-xl active:scale-95",
          isRecording 
            ? "bg-red-600 hover:bg-red-700" 
            : "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600",
          touchStart && "scale-110",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: ripple.x - 5,
              top: ripple.y - 5,
              width: 10,
              height: 10,
            }}
          />
        ))}

        {/* Icon */}
        <div className="relative z-10">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          ) : isRecording ? (
            <MicOff className="w-8 h-8 text-white animate-pulse" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Voice activity indicator */}
        {isRecording && voiceActivityDetected && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <SimpleVoiceIndicator isActive={true} className="h-3" />
          </div>
        )}
      </Button>

      {/* Instructions */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <p className="text-xs text-gray-500">
          {isProcessing ? "Processing..." : isRecording ? "Release to stop" : "Hold to speak"}
        </p>
      </div>
    </div>
  );
};

// Add ripple animation to global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
  
  .animate-ripple {
    animation: ripple 0.6s ease-out;
  }
`;
document.head.appendChild(style);