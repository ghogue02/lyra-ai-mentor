
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from 'lucide-react';

interface AnimatedDataDisplayProps {
  content: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AnimatedDataDisplay: React.FC<AnimatedDataDisplayProps> = ({
  content,
  onComplete,
  autoStart = true
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const lines = content.split('\n');

  useEffect(() => {
    if (!isPlaying || isComplete || currentLineIndex >= lines.length) return;

    const timer = setTimeout(() => {
      const currentLine = lines[currentLineIndex];
      setDisplayedLines(prev => [...prev, currentLine]);
      setCurrentLineIndex(prev => prev + 1);

      if (currentLineIndex + 1 >= lines.length) {
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
      }
    }, getVariableLineDelay(lines[currentLineIndex], currentLineIndex, lines.length));

    return () => clearTimeout(timer);
  }, [currentLineIndex, isPlaying, isComplete, lines, onComplete]);

  const getVariableLineDelay = (line: string, index: number, totalLines: number): number => {
    if (!line || line.trim() === '') return 200;
    
    const progress = index / totalLines;
    
    // Very slow start for dramatic effect and headers
    if (line.includes('===') || line.includes('CSV')) return 1000;
    if (line.includes('Donor,') || line.includes('donor_id,')) return 800; // Column headers
    
    // Variable speed based on progress - start slow, speed up
    if (progress < 0.1) return 600; // Very slow start
    if (progress < 0.2) return 400; // Still slow for absorption
    if (progress < 0.4) return 300; // Building momentum
    if (progress < 0.6) return 200; // Medium speed
    if (progress < 0.8) return 150; // Getting faster
    
    // Check for problematic data (add pauses for messy rows)
    if (line.includes('@@') || line.includes('$USD') || line.includes(';;') || 
        line.includes('  ') || line.includes('$ ') || !line.includes('@')) {
      return Math.max(250, 100); // Pause on problematic data
    }
    
    // Final burst of speed
    return 100;
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleSkip = () => {
    setDisplayedLines(lines);
    setCurrentLineIndex(lines.length);
    setIsComplete(true);
    setIsPlaying(false);
    onComplete?.();
  };

  const handleRestart = () => {
    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);
    setIsPlaying(true);
  };

  return (
    <div className="bg-gray-800 text-green-400 p-3 rounded-lg mb-4 font-mono text-xs overflow-x-auto border border-gray-600 relative">
      {/* Status indicator and controls */}
      <div className="absolute top-2 right-2 flex items-center space-x-2">
        {!isComplete && (
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
            <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        )}
        
        <div className="flex space-x-1">
          {!isComplete && (
            <>
              {!isPlaying ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlay}
                  className="h-5 w-5 p-0 text-green-400 hover:text-green-300"
                >
                  <Play className="w-3 h-3" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePause}
                  className="h-5 w-5 p-0 text-green-400 hover:text-green-300"
                >
                  <Pause className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-5 w-5 p-0 text-green-400 hover:text-green-300"
              >
                <SkipForward className="w-3 h-3" />
              </Button>
            </>
          )}
          
          {isComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="h-6 px-2 text-xs text-green-400 hover:text-green-300"
            >
              Replay
            </Button>
          )}
        </div>
      </div>

      <pre className="whitespace-pre-wrap pr-20">
        {displayedLines.map((line, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {line}
          </div>
        ))}
        {!isComplete && isPlaying && (
          <span className="animate-pulse">▎</span>
        )}
      </pre>

      {/* Progress indicator */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isComplete ? 'Data loaded - Ready for analysis' : `Loading data... ${displayedLines.length}/${lines.length} rows`}
        </span>
        {!isComplete && (
          <div className="flex space-x-1">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
          </div>
        )}
      </div>
    </div>
  );
};
