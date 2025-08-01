import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, CheckCircle } from 'lucide-react';

interface AIPersonalityQuizRendererProps {
  element: {
    id: number;
    configuration: {
      questions: Array<{
        text: string;
        options: string[];
      }>;
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AIPersonalityQuizRenderer: React.FC<AIPersonalityQuizRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<string>('');

  const questions = element.configuration?.questions || [];

  const handleAnswer = useCallback((answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate personality type based on answers
      const personalityTypes = [
        'The Detail-Oriented Communicator: You like to provide comprehensive information and prefer thorough responses.',
        'The Collaborative Explorer: You enjoy interactive conversations and learning through dialogue.',
        'The Creative Visionary: You prefer open-ended discussions and innovative solutions.',
        'The Focused Achiever: You value specific, actionable guidance and clear outcomes.'
      ];
      
      const resultType = personalityTypes[newAnswers[0] % personalityTypes.length];
      setResult(resultType);
      setShowResult(true);
      
      if (!isElementCompleted) {
        onComplete();
      }
    }
  }, [currentQuestion, answers, questions.length, isElementCompleted, onComplete]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult('');
  }, []);

  if (questions.length === 0) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Quiz configuration not found.</p>
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="premium-card border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl">Your AI Communication Style</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-brand-cyan/10 rounded-lg p-6">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-medium text-foreground">{result}</p>
            </div>
            
            <div className="pt-4">
              <Badge className="bg-primary/10 text-primary">
                Quiz Completed!
              </Badge>
            </div>
            
            <Button 
              onClick={resetQuiz}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="premium-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Communication Style Quiz</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <Badge variant="outline">
              {Math.round(((currentQuestion) / questions.length) * 100)}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-primary to-brand-cyan rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              {questions[currentQuestion]?.text}
            </h3>
            
            <div className="grid gap-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleAnswer(index)}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-primary/5 hover:border-primary/30"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};