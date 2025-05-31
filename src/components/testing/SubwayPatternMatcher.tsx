
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shuffle, ArrowRight, Hand, Move } from 'lucide-react';

const correctMatches = [
  { ai: "Machine Learning", subway: "Route Planning System" },
  { ai: "Pattern Recognition", subway: "MetroCard Usage Analysis" },
  { ai: "Predictive Analytics", subway: "Rush Hour Forecasting" },
  { ai: "Computer Vision", subway: "Security Camera Analysis" },
  { ai: "Data Mining", subway: "Passenger Flow Optimization" },
  { ai: "Natural Language Processing", subway: "Station Announcements" }
];

export const SubwayPatternMatcher = () => {
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [draggedConcept, setDraggedConcept] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleConceptClick = (concept: string) => {
    if (selectedConcept === concept) {
      setSelectedConcept(null); // Deselect if clicking the same concept
    } else {
      setSelectedConcept(concept);
    }
  };

  const handleAnalogyClick = (analogy: string) => {
    if (selectedConcept && !Object.values(matches).includes(analogy)) {
      setMatches(prev => ({
        ...prev,
        [selectedConcept]: analogy
      }));
      setSelectedConcept(null);
    }
  };

  const handleMatchClick = (concept: string) => {
    // Remove the match and select the concept for re-matching
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[concept];
      return newMatches;
    });
    setSelectedConcept(concept);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, concept: string) => {
    setDraggedConcept(concept);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, analogy: string) => {
    e.preventDefault();
    if (draggedConcept && !Object.values(matches).includes(analogy)) {
      setMatches(prev => ({
        ...prev,
        [draggedConcept]: analogy
      }));
    }
    setDraggedConcept(null);
  };

  const handleDropOnMatch = (e: React.DragEvent, concept: string) => {
    e.preventDefault();
    if (draggedConcept && draggedConcept !== concept) {
      // Replace existing match
      const oldAnalogy = matches[concept];
      setMatches(prev => ({
        ...prev,
        [draggedConcept]: oldAnalogy,
        [concept]: matches[draggedConcept] || ''
      }));
    }
    setDraggedConcept(null);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    correctMatches.forEach(match => {
      if (matches[match.ai] === match.subway) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const reset = () => {
    setMatches({});
    setSelectedConcept(null);
    setDraggedConcept(null);
    setShowResults(false);
    setScore(0);
  };

  const getMatchColor = (aiConcept: string, subwayAnalogy: string) => {
    if (!showResults) return '';
    const correctMatch = correctMatches.find(m => m.ai === aiConcept);
    if (matches[aiConcept] === subwayAnalogy) {
      return correctMatch?.subway === subwayAnalogy ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300';
    }
    return '';
  };

  const aiConcepts = correctMatches.map(m => m.ai);
  const subwayAnalogies = correctMatches.map(m => m.subway);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Match AI concepts to NYC subway analogies</h3>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Hand className="w-3 h-3" />
            <span>Click to select & place</span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="w-3 h-3" />
            <span>Drag & drop</span>
          </div>
        </div>
        {selectedConcept && (
          <p className="text-sm text-blue-600 mt-2">
            "{selectedConcept}" selected - click an analogy to match
          </p>
        )}
      </div>

      <div className="space-y-3">
        {aiConcepts.map(concept => (
          <div key={concept} className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`w-48 p-2 text-xs justify-start cursor-pointer transition-all ${
                selectedConcept === concept 
                  ? 'bg-blue-100 border-blue-400 border-2' 
                  : 'hover:bg-blue-50'
              } ${draggedConcept === concept ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, concept)}
              onClick={() => handleConceptClick(concept)}
            >
              {concept}
            </Badge>
            
            {matches[concept] ? (
              <>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge 
                  variant="outline" 
                  className={`w-48 p-2 text-xs justify-start cursor-pointer hover:bg-gray-50 ${getMatchColor(concept, matches[concept])}`}
                  onClick={() => handleMatchClick(concept)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnMatch(e, concept)}
                >
                  {matches[concept]}
                </Badge>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 text-gray-200" />
                <div 
                  className={`w-48 h-8 border-2 border-dashed rounded flex items-center justify-center transition-colors ${
                    draggedConcept ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    // This is an empty slot, we need to find an available analogy
                    // For now, we'll just provide visual feedback
                  }}
                >
                  <span className="text-xs text-gray-400">
                    {draggedConcept ? 'Drop analogy here' : 'Select analogy'}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-orange-600">Available Subway Analogies:</h4>
        <div className="flex flex-wrap gap-2">
          {subwayAnalogies.map(analogy => {
            const isUsed = Object.values(matches).includes(analogy);
            return (
              <Badge 
                key={analogy}
                variant="outline" 
                className={`p-2 cursor-pointer text-xs transition-all ${
                  isUsed 
                    ? 'opacity-50 cursor-not-allowed' 
                    : draggedConcept 
                      ? 'hover:bg-blue-50 border-blue-200' 
                      : 'hover:bg-orange-50'
                }`}
                onDragOver={!isUsed ? handleDragOver : undefined}
                onDrop={!isUsed ? (e) => handleDrop(e, analogy) : undefined}
                onClick={!isUsed ? () => handleAnalogyClick(analogy) : undefined}
              >
                {analogy}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={checkAnswers} size="sm" disabled={Object.keys(matches).length < 3 || showResults}>
          Check Matches
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <Shuffle className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {showResults && (
        <div className="p-3 bg-blue-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            {score >= 3 ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm font-medium">
              Score: {score}/{correctMatches.length} correct matches
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {score >= 3 ? "Great job! You understand AI patterns." : "Try again to improve your understanding."}
          </p>
        </div>
      )}
    </div>
  );
};
