
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from 'lucide-react';

interface AnimatedInsightsDisplayProps {
  content: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AnimatedInsightsDisplay: React.FC<AnimatedInsightsDisplayProps> = ({
  content,
  onComplete,
  autoStart = true
}) => {
  const [displayedSections, setDisplayedSections] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Parse content into insight sections
  const parseInsights = () => {
    const lines = content.split('\n').filter(line => line.trim());
    const sections: string[] = [];
    
    let currentSection = '';
    for (const line of lines) {
      if (line.includes('🎯') || line.includes('📈') || line.includes('🔮') || line.includes('⚠️') || line.includes('🚀')) {
        if (currentSection) {
          sections.push(currentSection.trim());
        }
        currentSection = line;
      } else if (currentSection) {
        currentSection += '\n' + line;
      }
    }
    
    if (currentSection) {
      sections.push(currentSection.trim());
    }
    
    return sections;
  };

  const sections = parseInsights();

  useEffect(() => {
    if (!isPlaying || isComplete || currentSectionIndex >= sections.length) return;

    const timer = setTimeout(() => {
      const currentSection = sections[currentSectionIndex];
      setDisplayedSections(prev => [...prev, currentSection]);
      setCurrentSectionIndex(prev => prev + 1);

      if (currentSectionIndex + 1 >= sections.length) {
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
      }
    }, getSectionDelay(sections[currentSectionIndex]));

    return () => clearTimeout(timer);
  }, [currentSectionIndex, isPlaying, isComplete, sections, onComplete]);

  const getSectionDelay = (section: string): number => {
    if (section.includes('🎯')) return 1200; // Revenue opportunities need time
    if (section.includes('⚠️')) return 1000; // Risk alerts are important
    if (section.includes('🚀')) return 900; // Growth accelerators
    if (section.includes('🔮')) return 800; // Predictive analysis
    return 700; // Default
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleSkip = () => {
    setDisplayedSections(sections);
    setCurrentSectionIndex(sections.length);
    setIsComplete(true);
    setIsPlaying(false);
    onComplete?.();
  };

  const handleRestart = () => {
    setDisplayedSections([]);
    setCurrentSectionIndex(0);
    setIsComplete(false);
    setIsPlaying(true);
  };

  const getSectionStyle = (section: string) => {
    if (section.includes('🎯')) return 'border-l-4 border-green-500 bg-green-900/20';
    if (section.includes('⚠️')) return 'border-l-4 border-red-500 bg-red-900/20';
    if (section.includes('🚀')) return 'border-l-4 border-purple-500 bg-purple-900/20';
    if (section.includes('🔮')) return 'border-l-4 border-cyan-500 bg-cyan-900/20';
    return 'border-l-4 border-gray-500 bg-gray-900/20';
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm border border-gray-600 relative">
      {/* Controls */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        {!isComplete && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
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
        {displayedSections.map((section, index) => (
          <div
            key={index}
            className={`animate-fade-in p-3 rounded ${getSectionStyle(section)}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {section.split('\n').map((line, lineIndex) => (
              <div key={lineIndex} className={`${lineIndex === 0 ? 'font-bold text-base mb-2' : 'ml-2 text-sm'}`}>
                {line}
              </div>
            ))}
          </div>
        ))}
        
        {!isComplete && isPlaying && (
          <div className="flex items-center space-x-2">
            <span className="animate-pulse text-purple-400">🔍</span>
            <span className="animate-pulse text-cyan-400">Discovering insights...</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isComplete ? 'Insights revealed' : `Revealing insights... ${displayedSections.length}/${sections.length} sections`}
        </span>
        {!isComplete && (
          <div className="flex space-x-1">
            <span className="animate-bounce text-purple-400">💡</span>
            <span className="animate-bounce text-cyan-400" style={{ animationDelay: '0.1s' }}>💡</span>
            <span className="animate-bounce text-green-400" style={{ animationDelay: '0.2s' }}>💡</span>
          </div>
        )}
      </div>
    </div>
  );
};
