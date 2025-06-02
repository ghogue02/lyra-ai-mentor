import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const MultipleChoiceScenarios = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const scenarios = [
    {
      question: "Your nonprofit wants to use AI for donor outreach. What's the first step?",
      options: [
        "Buy the most expensive AI tool available",
        "Assess current donor communication processes", 
        "Replace all staff with AI systems",
        "Wait for AI to become cheaper"
      ],
      correct: 1,
      explanation: "Always start by understanding your current processes before implementing any AI solution."
    },
    {
      question: "When choosing an AI tool for your nonprofit, what matters most?",
      options: [
        "The tool has the most features",
        "It's the same tool big corporations use",
        "It fits your budget and staff capabilities",
        "It's the newest technology available"
      ],
      correct: 2,
      explanation: "The best AI tool is one your team can actually use effectively within your resources."
    },
    {
      question: "How should you introduce AI to hesitant staff members?",
      options: [
        "Implement it without telling them",
        "Force them to use it immediately",
        "Provide training and address their concerns",
        "Replace them with AI-friendly staff"
      ],
      correct: 2,
      explanation: "Change management requires empathy, training, and open communication about concerns."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const currentQ = scenarios[currentScenario];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600">Choose the best approach for each situation</p>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              Scenario {currentScenario + 1} of {scenarios.length}
            </Badge>
            <h4 className="font-medium mb-3">{currentQ.question}</h4>
          </div>

          <div className="space-y-2">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-3 ${
                  showResult
                    ? index === currentQ.correct
                      ? "bg-green-100 border-green-500 text-green-700"
                      : selectedAnswer === index
                      ? "bg-red-100 border-red-500 text-red-700"
                      : ""
                    : ""
                }`}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                <span className="text-sm">{option}</span>
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                <strong>Explanation:</strong> {currentQ.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={nextScenario} size="sm">
          {showResult ? "Next Scenario" : "Skip"}
        </Button>
      </div>
    </div>
  );
};
