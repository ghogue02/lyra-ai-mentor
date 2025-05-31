
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { Loader2, Target } from 'lucide-react';

const wordBlocks = [
  "computer", "systems", "learn", "data", "patterns", "without", "explicit", 
  "programming", "mimic", "human", "intelligence", "automate", "tasks", 
  "make", "decisions", "analyze", "predict", "optimize", "process", "information"
];

export const AIDefinitionBuilder = () => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const { callAI, loading } = useAITestingAssistant();

  const addWord = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const removeWord = (word: string) => {
    setSelectedWords(selectedWords.filter(w => w !== word));
  };

  const evaluateDefinition = async () => {
    const definition = selectedWords.join(' ');
    try {
      const result = await callAI(
        'definition_builder',
        `Please evaluate this AI definition: "${definition}". Provide a score out of 10 and specific feedback.`,
        'This is for nonprofit staff learning about AI basics.'
      );
      
      // Extract score from result
      const scoreMatch = result.match(/(\d+)\/10|(\d+) out of 10|Score: (\d+)/i);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]));
      }
      setFeedback(result);
    } catch (error) {
      setFeedback('Sorry, there was an error evaluating your definition. Try again!');
    }
  };

  const reset = () => {
    setSelectedWords([]);
    setFeedback('');
    setScore(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Build Your AI Definition</h3>
        <p className="text-sm text-gray-600">Select words to create a definition of AI</p>
      </div>

      <Card className="border border-blue-200">
        <CardContent className="p-4">
          <div className="min-h-[60px] border-2 border-dashed border-gray-300 rounded p-3 mb-3">
            {selectedWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <Badge 
                    key={index} 
                    className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                    onClick={() => removeWord(word)}
                  >
                    {word} ×
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Your definition will appear here...</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {wordBlocks.map(word => (
              <Badge 
                key={word}
                variant="outline" 
                className={`cursor-pointer hover:bg-gray-100 text-xs ${
                  selectedWords.includes(word) ? 'opacity-50' : ''
                }`}
                onClick={() => addWord(word)}
              >
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button 
          onClick={evaluateDefinition} 
          size="sm" 
          disabled={selectedWords.length < 3 || loading}
        >
          {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Target className="w-3 h-3 mr-1" />}
          Get AI Evaluation
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          Clear
        </Button>
      </div>

      {feedback && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          {score && (
            <div className="flex items-center gap-2 mb-2">
              <Badge className={score >= 7 ? "bg-green-600" : score >= 5 ? "bg-yellow-600" : "bg-red-600"}>
                Score: {score}/10
              </Badge>
            </div>
          )}
          <p className="text-sm text-green-800">{feedback}</p>
        </div>
      )}
    </div>
  );
};
