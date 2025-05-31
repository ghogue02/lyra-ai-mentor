
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

const myths = [
  { statement: "AI will replace all nonprofit staff", isMyth: true, explanation: "AI augments human work but cannot replace the empathy, creativity, and relationship-building that nonprofit work requires." },
  { statement: "AI can help nonprofits be more efficient", isMyth: false, explanation: "True! AI can automate repetitive tasks, analyze data faster, and help nonprofits focus more time on their mission." },
  { statement: "Only large nonprofits can afford AI", isMyth: true, explanation: "Many AI tools are free or low-cost. Even small nonprofits can benefit from tools like automated email responses or data analysis." },
  { statement: "AI requires extensive technical knowledge", isMyth: true, explanation: "Modern AI tools are designed to be user-friendly. Many require no coding and can be used by anyone comfortable with basic computer skills." },
  { statement: "AI can improve donor engagement", isMyth: false, explanation: "True! AI can personalize communications, predict giving patterns, and help nonprofits reach donors more effectively." },
  { statement: "AI will make nonprofits lose their human touch", isMyth: true, explanation: "AI handles routine tasks so staff can spend more time on meaningful human interactions and mission-critical work." }
];

export const AIMythsSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: boolean}>({});
  const [showResult, setShowResult] = useState<{[key: number]: boolean}>({});
  const [score, setScore] = useState(0);

  const handleSwipe = (isMyth: boolean) => {
    const correct = myths[currentIndex].isMyth === isMyth;
    setAnswers(prev => ({ ...prev, [currentIndex]: correct }));
    setShowResult(prev => ({ ...prev, [currentIndex]: true }));
    
    if (correct && !answers[currentIndex]) {
      setScore(prev => prev + 1);
    }
  };

  const nextCard = () => {
    if (currentIndex < myths.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult({});
    setScore(0);
  };

  const currentMyth = myths[currentIndex];
  const hasAnswered = showResult[currentIndex];
  const isCorrect = answers[currentIndex];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Myths vs Reality</h3>
        <p className="text-sm text-gray-600">Swipe or click: Is this a myth or reality?</p>
        <Badge variant="outline" className="mt-1">
          {currentIndex + 1} of {myths.length}
        </Badge>
      </div>

      <Card className="border border-gray-200 min-h-[200px]">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-medium mb-4">{currentMyth.statement}</p>
          
          {!hasAnswered ? (
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => handleSwipe(true)}
                variant="outline"
                className="border-red-300 hover:bg-red-50"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Myth
              </Button>
              <Button 
                onClick={() => handleSwipe(false)}
                variant="outline"
                className="border-green-300 hover:bg-green-50"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Reality
              </Button>
            </div>
          ) : (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </span>
              </div>
              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {currentMyth.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button 
          onClick={prevCard} 
          variant="outline" 
          size="sm" 
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        
        <div className="text-center">
          <Badge className="bg-purple-100 text-purple-700">
            Score: {score}/{Object.keys(showResult).length}
          </Badge>
        </div>
        
        {currentIndex < myths.length - 1 ? (
          <Button 
            onClick={nextCard} 
            size="sm"
            disabled={!hasAnswered}
          >
            Next
          </Button>
        ) : (
          <Button onClick={reset} variant="outline" size="sm">
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
