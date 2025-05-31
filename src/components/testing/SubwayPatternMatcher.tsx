
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shuffle } from 'lucide-react';

const matches = [
  { ai: "Machine Learning", subway: "Route Planning System", correct: true },
  { ai: "Pattern Recognition", subway: "MetroCard Usage Analysis", correct: true },
  { ai: "Predictive Analytics", subway: "Rush Hour Forecasting", correct: true },
  { ai: "Natural Language Processing", subway: "Station Announcements", correct: false },
  { ai: "Computer Vision", subway: "Security Camera Analysis", correct: true },
  { ai: "Data Mining", subway: "Passenger Flow Optimization", correct: false }
];

export const SubwayPatternMatcher = () => {
  const [selectedMatches, setSelectedMatches] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleMatch = (aiConcept: string, subwayAnalogy: string) => {
    setSelectedMatches(prev => ({
      ...prev,
      [aiConcept]: subwayAnalogy
    }));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    matches.forEach(match => {
      if (match.correct && selectedMatches[match.ai] === match.subway) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const reset = () => {
    setSelectedMatches({});
    setShowResults(false);
    setScore(0);
  };

  const aiConcepts = matches.map(m => m.ai);
  const subwayAnalogies = matches.map(m => m.subway);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Match AI concepts to NYC subway analogies</h3>
        <p className="text-sm text-gray-600">Drag and drop or click to match</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-600">AI Concepts</h4>
          {aiConcepts.map(concept => (
            <Badge 
              key={concept}
              variant="outline" 
              className="w-full p-2 cursor-pointer hover:bg-blue-50 text-xs"
              onClick={() => console.log('Selected:', concept)}
            >
              {concept}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-orange-600">Subway Systems</h4>
          {subwayAnalogies.map(analogy => (
            <Badge 
              key={analogy}
              variant="outline" 
              className="w-full p-2 cursor-pointer hover:bg-orange-50 text-xs"
            >
              {analogy}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={checkAnswers} size="sm" disabled={Object.keys(selectedMatches).length < 3}>
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
              Score: {score}/3 correct matches
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
