
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shuffle, ArrowRight } from 'lucide-react';

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
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleMatch = (aiConcept: string, subwayAnalogy: string) => {
    setMatches(prev => ({
      ...prev,
      [aiConcept]: subwayAnalogy
    }));
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
        <p className="text-sm text-gray-600">Click an AI concept, then click its subway analogy</p>
      </div>

      <div className="space-y-3">
        {aiConcepts.map(concept => (
          <div key={concept} className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="w-48 p-2 text-xs justify-start cursor-pointer hover:bg-blue-50"
            >
              {concept}
            </Badge>
            
            {matches[concept] ? (
              <>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge 
                  variant="outline" 
                  className={`w-48 p-2 text-xs justify-start ${getMatchColor(concept, matches[concept])}`}
                >
                  {matches[concept]}
                </Badge>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 text-gray-200" />
                <div className="w-48 h-8 border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">Select analogy</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-orange-600">Available Subway Analogies:</h4>
        <div className="flex flex-wrap gap-2">
          {subwayAnalogies.map(analogy => (
            <Badge 
              key={analogy}
              variant="outline" 
              className={`p-2 cursor-pointer hover:bg-orange-50 text-xs ${
                Object.values(matches).includes(analogy) ? 'opacity-50' : ''
              }`}
              onClick={() => {
                // Find which AI concept is currently selected (last one without a match)
                const unmatched = aiConcepts.find(concept => !matches[concept]);
                if (unmatched && !Object.values(matches).includes(analogy)) {
                  handleMatch(unmatched, analogy);
                }
              }}
            >
              {analogy}
            </Badge>
          ))}
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
