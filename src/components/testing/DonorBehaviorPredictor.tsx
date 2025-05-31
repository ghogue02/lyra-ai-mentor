
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, EyeOff } from 'lucide-react';

const donorProfiles = [
  {
    id: 1,
    name: "Sarah (recurring donor)",
    data: "Donates $50 monthly, opens 80% of emails, clicks donation links",
    pattern: "High engagement, predictable giving",
    prediction: "Likely to increase donation during year-end campaign",
    confidence: 92
  },
  {
    id: 2,
    name: "Michael (event donor)",
    data: "Donates only during galas, large amounts ($500+), social media active",
    pattern: "Event-driven, high-value, social influence",
    prediction: "Will donate to next major event but skip smaller asks",
    confidence: 87
  },
  {
    id: 3,
    name: "Lisa (cause-specific)",
    data: "Donates to education programs only, reads all newsletters, volunteers",
    pattern: "Mission-focused, multi-channel engagement",
    prediction: "Will respond to education program funding appeals",
    confidence: 95
  }
];

export const DonorBehaviorPredictor = () => {
  const [revealedPatterns, setRevealedPatterns] = useState<{[key: number]: boolean}>({});
  const [score, setScore] = useState(0);

  const revealPattern = (donorId: number) => {
    if (!revealedPatterns[donorId]) {
      setScore(prev => prev + 1);
    }
    setRevealedPatterns(prev => ({
      ...prev,
      [donorId]: true
    }));
  };

  const hidePattern = (donorId: number) => {
    setRevealedPatterns(prev => ({
      ...prev,
      [donorId]: false
    }));
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Predict Donor Behavior Patterns</h3>
        <p className="text-sm text-gray-600">Click to reveal AI insights about each donor</p>
      </div>

      <div className="space-y-3">
        {donorProfiles.map(donor => (
          <Card key={donor.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{donor.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {donor.confidence}% confidence
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">{donor.data}</p>
              
              {!revealedPatterns[donor.id] ? (
                <Button 
                  onClick={() => revealPattern(donor.id)}
                  size="sm" 
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Reveal AI Prediction
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-800">Pattern:</span>
                    </div>
                    <p className="text-xs text-green-700">{donor.pattern}</p>
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-xs font-medium text-blue-800">Prediction:</span>
                    <p className="text-xs text-blue-700">{donor.prediction}</p>
                  </div>
                  
                  <Button 
                    onClick={() => hidePattern(donor.id)}
                    size="sm" 
                    variant="ghost"
                    className="text-xs"
                  >
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {score > 0 && (
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-800">
            Patterns Discovered: {score}/{donorProfiles.length}
          </p>
          <p className="text-xs text-purple-600">
            {score === donorProfiles.length ? "You've mastered donor pattern recognition!" : "Keep exploring to see all patterns"}
          </p>
        </div>
      )}
    </div>
  );
};
