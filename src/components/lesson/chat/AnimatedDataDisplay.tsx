
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
    }, getLineDelay(lines[currentLineIndex]));

    return () => clearTimeout(timer);
  }, [currentLineIndex, isPlaying, isComplete, lines, onComplete]);

  const getLineDelay = (line: string): number => {
    if (!line || line.trim() === '') return 200;
    if (line.includes('===') || line.includes('CSV')) return 800; // Headers need more time
    if (line.includes('Name,') || line.includes('donor_id,')) return 600; // Column headers
    if (line.length > 60) return 400; // Long lines
    return 300; // Regular lines
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
            style={{ animationDelay: `${index * 0.1}s` }}
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
          {isComplete ? 'Data loaded' : `Loading... ${displayedLines.length}/${lines.length} lines`}
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
