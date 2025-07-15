
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const restaurants = [
  {
    id: 1,
    name: "Tony's Pizza (Times Square)",
    data: "Friday 8PM, tourist area, weather: clear, events: Broadway shows ending",
    prediction: "high",
    confidence: 89,
    reasoning: "High foot traffic area + show ending times = leftover food"
  },
  {
    id: 2,
    name: "Corner Deli (Financial District)",
    data: "Saturday 2PM, business district, weather: rainy, events: none",
    prediction: "low",
    confidence: 76,
    reasoning: "Weekend + business area + bad weather = fewer customers"
  },
  {
    id: 3,
    name: "Family Restaurant (Queens)",
    data: "Sunday 6PM, residential area, weather: sunny, events: local festival",
    prediction: "medium",
    confidence: 82,
    reasoning: "Festival brings crowds but also increases restaurant prep"
  }
];

export const RestaurantSurplusPredictor = () => {
  const [predictions, setPredictions] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const makePrediction = (restaurantId: number, prediction: string) => {
    setPredictions(prev => ({
      ...prev,
      [restaurantId]: prediction
    }));
  };

  const checkPredictions = () => {
    let correct = 0;
    restaurants.forEach(restaurant => {
      if (predictions[restaurant.id] === restaurant.prediction) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const reset = () => {
    setPredictions({});
    setShowResults(false);
    setScore(0);
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'high': return TrendingUp;
      case 'low': return TrendingDown;
      case 'medium': return Minus;
      default: return Minus;
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Predict Food Surplus</h3>
        <p className="text-sm text-gray-600">Help Carmen predict which restaurants will have leftover food</p>
      </div>

      <div className="space-y-3">
        {restaurants.map(restaurant => {
          const userPrediction = predictions[restaurant.id];
          const isCorrect = userPrediction === restaurant.prediction;
          const PredictionIcon = getPredictionIcon(restaurant.prediction);
          
          return (
            <Card key={restaurant.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{restaurant.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {restaurant.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600">{restaurant.data}</p>
                  
                  {!showResults ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Surplus prediction:</p>
                      <div className="flex gap-2">
                        {['high', 'medium', 'low'].map(level => (
                          <Button
                            key={level}
                            onClick={() => makePrediction(restaurant.id, level)}
                            size="sm"
                            variant={userPrediction === level ? "default" : "outline"}
                            className="text-xs capitalize"
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`p-2 rounded border ${getPredictionColor(restaurant.prediction)}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <PredictionIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {isCorrect ? '✓ Correct!' : '✗ Incorrect'} Answer: {restaurant.prediction}
                        </span>
                      </div>
                      <p className="text-xs opacity-75">{restaurant.reasoning}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={checkPredictions} 
          size="sm" 
          disabled={Object.keys(predictions).length < restaurants.length || showResults}
        >
          Check Predictions
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          Reset
        </Button>
      </div>

      {showResults && (
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-800">
            Score: {score}/{restaurants.length} correct predictions
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {score === restaurants.length ? 
              "Perfect! You understand how AI analyzes patterns for food rescue." : 
              "Good try! AI considers location, timing, weather, and events together."
            }
          </p>
        </div>
      )}
    </div>
  );
};
