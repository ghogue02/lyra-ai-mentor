
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { Loader2, Target, Info } from 'lucide-react';

const wordBlocks = [
  "computer", "systems", "learn", "data", "patterns", "without", "explicit", 
  "programming", "mimic", "human", "intelligence", "automate", "tasks", 
  "make", "decisions", "analyze", "predict", "optimize", "process", "information"
];

const connectingWords = ["is", "are", "that", "can", "to", "by", "and", "or", "from", "with"];

const MAX_WORDS = 5;

export const AIDefinitionBuilder = () => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const { callAI, loading } = useAITestingAssistant();

  const addWord = (word: string) => {
    if (!selectedWords.includes(word) && selectedWords.length < MAX_WORDS) {
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
        `Please evaluate this attempt at defining AI using only these selected words: "${definition}". 
        
        The user selected ${selectedWords.length} words to try to build a definition. Please provide:
        1. A score out of 10 based on how well these words could form a coherent AI definition
        2. Specific suggestions on how to arrange these words into a proper sentence
        3. What connecting words (like "is", "that", "can", etc.) they might need to add
        4. Feedback on their word choices and any key concepts missing
        
        Remember this is a learning exercise to help them understand how to construct definitions, not just evaluate a finished definition.`,
        'This is for nonprofit staff learning about AI basics through a word-building exercise.'
      );
      
      // Extract score from result
      const scoreMatch = result.match(/(\d+)\/10|(\d+) out of 10|Score: (\d+)/i);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]));
      }
      setFeedback(result);
    } catch (error) {
      setFeedback('Sorry, there was an error evaluating your word selection. Try again!');
    }
  };

  const reset = () => {
    setSelectedWords([]);
    setFeedback('');
    setScore(null);
  };

  const remainingWords = MAX_WORDS - selectedWords.length;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Build Your AI Definition</h3>
        <p className="text-sm text-gray-600">Select up to {MAX_WORDS} words to build a definition of AI</p>
      </div>

      <Card className="border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Your selected words:</span>
            <Badge variant="outline" className={remainingWords === 0 ? "bg-orange-50 text-orange-700" : ""}>
              {selectedWords.length}/{MAX_WORDS} words
            </Badge>
          </div>
          
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
              <p className="text-gray-400 text-sm">Select words to build your definition...</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {wordBlocks.map(word => (
              <Badge 
                key={word}
                variant="outline" 
                className={`cursor-pointer text-xs transition-all ${
                  selectedWords.includes(word) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : remainingWords === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-100'
                }`}
                onClick={() => addWord(word)}
              >
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Building a definition:</p>
            <p>Try to form a complete sentence! You may need connecting words like: {connectingWords.slice(0, 6).join(', ')}, etc.</p>
            <p className="mt-1 text-xs">Example: "AI <em>is</em> computer systems <em>that</em> learn <em>from</em> data"</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={evaluateDefinition} 
          size="sm" 
          disabled={selectedWords.length < 3 || loading}
        >
          {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Target className="w-3 h-3 mr-1" />}
          Get AI Feedback
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
          <p className="text-sm text-green-800 whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
};
