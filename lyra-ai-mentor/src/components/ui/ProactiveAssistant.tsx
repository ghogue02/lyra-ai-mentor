import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface ProactiveAssistantProps {
  enabled: boolean;
  suggestions: string[];
  onDismiss: () => void;
  onAccept: (suggestion: string) => void;
}

const ProactiveAssistant: React.FC<ProactiveAssistantProps> = ({
  enabled,
  suggestions,
  onDismiss,
  onAccept
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (enabled && suggestions.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [enabled, suggestions]);

  if (!suggestions.length) return null;

  return (
    <div className={`proactive-help ${isVisible ? 'visible' : ''}`}>
      {/* Close button */}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Dismiss help"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      {/* Assistant icon and header */}
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Need a hand?</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedSuggestion(index);
              onAccept(suggestion);
            }}
            onMouseEnter={() => setSelectedSuggestion(index)}
            onMouseLeave={() => setSelectedSuggestion(null)}
            className={`
              w-full text-left text-sm p-2 rounded-md transition-all
              ${selectedSuggestion === index 
                ? 'bg-purple-50 text-purple-700' 
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Subtle animation indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
      </div>
    </div>
  );
};

export default ProactiveAssistant;