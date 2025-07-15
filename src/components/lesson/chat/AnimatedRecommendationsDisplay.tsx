
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from 'lucide-react';

interface AnimatedRecommendationsDisplayProps {
  content: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AnimatedRecommendationsDisplay: React.FC<AnimatedRecommendationsDisplayProps> = ({
  content,
  onComplete,
  autoStart = true
}) => {
  const [displayedGroups, setDisplayedGroups] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Parse content into recommendation groups
  const parseRecommendations = () => {
    const lines = content.split('\n').filter(line => line.trim());
    const groups: string[] = [];
    
    let currentGroup = '';
    for (const line of lines) {
      if (line.includes('🎯') || line.includes('📧') || line.includes('💰') || line.includes('🤖') || line.includes('Expected Results')) {
        if (currentGroup) {
          groups.push(currentGroup.trim());
        }
        currentGroup = line;
      } else if (currentGroup && (line.includes('1.') || line.includes('2.') || line.includes('3.') || line.includes('•') || line.includes('📈') || line.includes('⚡'))) {
        currentGroup += '\n' + line;
      } else if (currentGroup && line.trim()) {
        currentGroup += '\n' + line;
      }
    }
    
    if (currentGroup) {
      groups.push(currentGroup.trim());
    }
    
    return groups;
  };

  const groups = parseRecommendations();

  useEffect(() => {
    if (!isPlaying || isComplete || currentGroupIndex >= groups.length) return;

    const timer = setTimeout(() => {
      const currentGroup = groups[currentGroupIndex];
      setDisplayedGroups(prev => [...prev, currentGroup]);
      setCurrentGroupIndex(prev => prev + 1);

      if (currentGroupIndex + 1 >= groups.length) {
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
      }
    }, getGroupDelay(groups[currentGroupIndex]));

    return () => clearTimeout(timer);
  }, [currentGroupIndex, isPlaying, isComplete, groups, onComplete]);

  const getGroupDelay = (group: string): number => {
    if (group.includes('🎯') && group.includes('This Week')) return 1500; // High impact items
    if (group.includes('📧') || group.includes('💰')) return 1200; // Time-based actions
    if (group.includes('🤖')) return 1000; // Automation
    if (group.includes('Expected Results')) return 1800; // Final results
    return 800; // Default
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleSkip = () => {
    setDisplayedGroups(groups);
    setCurrentGroupIndex(groups.length);
    setIsComplete(true);
    setIsPlaying(false);
    onComplete?.();
  };

  const handleRestart = () => {
    setDisplayedGroups([]);
    setCurrentGroupIndex(0);
    setIsComplete(false);
    setIsPlaying(true);
  };

  const getGroupStyle = (group: string) => {
    if (group.includes('🎯')) return 'border-l-4 border-red-500 bg-red-900/20';
    if (group.includes('📧')) return 'border-l-4 border-blue-500 bg-blue-900/20';
    if (group.includes('💰')) return 'border-l-4 border-yellow-500 bg-yellow-900/20';
    if (group.includes('🤖')) return 'border-l-4 border-purple-500 bg-purple-900/20';
    if (group.includes('Expected Results')) return 'border-l-4 border-green-500 bg-green-900/20';
    return 'border-l-4 border-gray-500 bg-gray-900/20';
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm border border-gray-600 relative">
      {/* Controls */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        {!isComplete && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
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

      <div className="pr-24 space-y-4">
        {displayedGroups.map((group, index) => (
          <div
            key={index}
            className={`animate-fade-in p-3 rounded ${getGroupStyle(group)}`}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {group.split('\n').map((line, lineIndex) => {
              let className = 'mb-1';
              
              if (lineIndex === 0) {
                className += ' font-bold text-base mb-2';
              } else if (line.includes('1.') || line.includes('2.') || line.includes('3.')) {
                className += ' ml-2 text-sm font-medium';
              } else if (line.includes('•') || line.includes('📈') || line.includes('⚡')) {
                className += ' ml-4 text-xs';
              } else {
                className += ' ml-2 text-sm';
              }

              return (
                <div key={lineIndex} className={className}>
                  {line}
                </div>
              );
            })}
          </div>
        ))}
        
        {!isComplete && isPlaying && (
          <div className="flex items-center space-x-2">
            <span className="animate-pulse text-green-400">🚀</span>
            <span className="animate-pulse text-blue-400">Generating recommendations...</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isComplete ? 'Recommendations ready' : `Generating... ${displayedGroups.length}/${groups.length} action groups`}
        </span>
        {!isComplete && (
          <div className="flex space-x-1">
            <span className="animate-bounce text-green-400">🎯</span>
            <span className="animate-bounce text-blue-400" style={{ animationDelay: '0.1s' }}>📧</span>
            <span className="animate-bounce text-yellow-400" style={{ animationDelay: '0.2s' }}>💰</span>
          </div>
        )}
      </div>
    </div>
  );
};
