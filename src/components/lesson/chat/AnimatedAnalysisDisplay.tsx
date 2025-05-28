
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from 'lucide-react';

interface AnimatedAnalysisDisplayProps {
  content: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AnimatedAnalysisDisplay: React.FC<AnimatedAnalysisDisplayProps> = ({
  content,
  onComplete,
  autoStart = true
}) => {
  const [displayedItems, setDisplayedItems] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'header' | 'processing' | 'patterns' | 'insights'>('header');

  // Parse content into phases
  const parseContent = () => {
    const lines = content.split('\n').filter(line => line.trim());
    const phases = {
      header: lines.filter(line => line.includes('Analysis in Progress') || line.includes('Processing')),
      processing: lines.filter(line => line.includes('Processing') || line.includes('Identifying') || line.includes('Cross-referencing') || line.includes('Calculating')),
      patterns: lines.filter(line => line.includes('PATTERNS DISCOVERED') || line.includes('INSIGHTS')),
      insights: lines.filter(line => line.includes('•') || line.includes('Segmentation') || line.includes('Behavioral') || line.includes('Predictive'))
    };
    return phases;
  };

  const phases = parseContent();
  const allItems = [
    ...phases.header,
    ...phases.processing,
    ...phases.patterns,
    ...phases.insights
  ];

  useEffect(() => {
    if (!isPlaying || isComplete || currentItemIndex >= allItems.length) return;

    const timer = setTimeout(() => {
      const currentItem = allItems[currentItemIndex];
      setDisplayedItems(prev => [...prev, currentItem]);
      setCurrentItemIndex(prev => prev + 1);

      // Update phase based on content
      if (currentItem.includes('Processing') || currentItem.includes('Identifying')) {
        setCurrentPhase('processing');
      } else if (currentItem.includes('PATTERNS') || currentItem.includes('DISCOVERED')) {
        setCurrentPhase('patterns');
      } else if (currentItem.includes('•') || currentItem.includes('Segmentation')) {
        setCurrentPhase('insights');
      }

      if (currentItemIndex + 1 >= allItems.length) {
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
      }
    }, getItemDelay(allItems[currentItemIndex], currentItemIndex));

    return () => clearTimeout(timer);
  }, [currentItemIndex, isPlaying, isComplete, allItems, onComplete]);

  const getItemDelay = (item: string, index: number): number => {
    if (item.includes('Analysis in Progress')) return 1000; // Header gets more time
    if (item.includes('Processing') || item.includes('Identifying')) return 800; // Processing steps
    if (item.includes('PATTERNS') || item.includes('DISCOVERED')) return 1200; // Big reveals
    if (item.includes('•') && item.length > 50) return 900; // Long insights
    if (item.includes('•')) return 600; // Short insights
    return 500; // Default
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleSkip = () => {
    setDisplayedItems(allItems);
    setCurrentItemIndex(allItems.length);
    setIsComplete(true);
    setIsPlaying(false);
    setCurrentPhase('insights');
    onComplete?.();
  };

  const handleRestart = () => {
    setDisplayedItems([]);
    setCurrentItemIndex(0);
    setIsComplete(false);
    setCurrentPhase('header');
    setIsPlaying(true);
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'header': return 'text-cyan-400';
      case 'processing': return 'text-yellow-400';
      case 'patterns': return 'text-purple-400';
      case 'insights': return 'text-green-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm border border-gray-600 relative">
      {/* Status indicator and controls */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        {!isComplete && (
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full animate-ping ${getPhaseColor().replace('text-', 'bg-')}`}></div>
            <div className={`w-2 h-2 rounded-full animate-ping ${getPhaseColor().replace('text-', 'bg-')}`} style={{ animationDelay: '0.5s' }}></div>
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
                  className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                >
                  <Play className="w-3 h-3" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePause}
                  className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                >
                  <Pause className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
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
              className="h-7 px-2 text-xs text-green-400 hover:text-green-300"
            >
              Replay
            </Button>
          )}
        </div>
      </div>

      <div className="pr-24">
        {displayedItems.map((item, index) => {
          let className = "animate-fade-in mb-2";
          
          if (item.includes('Analysis in Progress')) {
            className += " text-cyan-400 font-bold text-lg";
          } else if (item.includes('Processing') || item.includes('Identifying')) {
            className += " text-yellow-400 flex items-center";
          } else if (item.includes('PATTERNS') || item.includes('DISCOVERED')) {
            className += " text-purple-400 font-bold text-base mt-4 mb-3";
          } else if (item.includes('•')) {
            className += " text-green-300 ml-4";
          }

          return (
            <div
              key={index}
              className={className}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {(item.includes('Processing') || item.includes('Identifying')) && (
                <span className="text-cyan-400 mr-2 animate-pulse">⚡</span>
              )}
              {item.includes('•') && (
                <span className="text-purple-500 mr-2">🎯</span>
              )}
              {item}
            </div>
          );
        })}
        
        {!isComplete && isPlaying && (
          <span className="animate-pulse text-cyan-400">▎</span>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isComplete ? 'Analysis complete' : `Analyzing... ${displayedItems.length}/${allItems.length} steps`}
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
