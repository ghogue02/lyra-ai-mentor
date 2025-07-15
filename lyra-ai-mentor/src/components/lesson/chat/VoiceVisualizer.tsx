import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VoiceVisualizerProps {
  isActive: boolean;
  audioContext?: AudioContext;
  stream?: MediaStream;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive,
  audioContext,
  stream,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();

  useEffect(() => {
    if (!isActive || !audioContext || !stream || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create audio analyser
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const draw = () => {
      if (!isActive) return;
      
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = (canvas.offsetWidth / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.offsetHeight * 0.8;
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.offsetHeight - barHeight, 0, canvas.offsetHeight);
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)'); // purple
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.8)'); // cyan

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.offsetHeight - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      source.disconnect();
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, [isActive, audioContext, stream]);

  if (!isActive) {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-4 bg-gray-300 rounded-full"
          />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{ maxHeight: '60px' }}
    />
  );
};

// Simple animated bars for when we don't have audio context
export const SimpleVoiceIndicator: React.FC<{ isActive: boolean; className?: string }> = ({ 
  isActive, 
  className 
}) => {
  if (!isActive) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-purple-600 to-cyan-500 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};