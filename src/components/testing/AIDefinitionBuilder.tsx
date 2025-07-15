
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { Loader2, Wand2, Info } from 'lucide-react';

const wordBlocks = [
  "computer", "systems", "learn", "data", "patterns", "without", "explicit", 
  "programming", "mimic", "human", "intelligence", "automate", "tasks", 
  "make", "decisions", "analyze", "predict", "optimize", "process", "information"
];

const MAX_WORDS = 5;

export const AIDefinitionBuilder = () => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [definition, setDefinition] = useState<string>('');
  const { callAI, loading } = useAITestingAssistant();

  const addWord = (word: string) => {
    if (!selectedWords.includes(word) && selectedWords.length < MAX_WORDS) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const removeWord = (word: string) => {
    setSelectedWords(selectedWords.filter(w => w !== word));
  };

  const createDefinition = async () => {
    const selectedWordsText = selectedWords.join(', ');
    try {
      const result = await callAI(
        'definition_builder',
        `Create a clear, one-paragraph definition of AI for nonprofit organizations using ONLY these selected words: ${selectedWordsText}. 
        
        The definition should:
        - Use only the words I've selected (you can use connecting words like "is", "are", "that", "can", "to", "by", "and", "or", "from", "with")
        - Be written for nonprofit staff who are learning about AI
        - Show how AI can benefit nonprofit work
        - Be exactly one paragraph
        - Be practical and accessible
        
        Selected words to use: ${selectedWordsText}`,
        'This is for nonprofit staff learning about AI basics through a definition-building exercise.'
      );
      
      setDefinition(result);
    } catch (error) {
      setDefinition('Sorry, there was an error creating your definition. Please try again!');
    }
  };

  const reset = () => {
    setSelectedWords([]);
    setDefinition('');
  };

  const remainingWords = MAX_WORDS - selectedWords.length;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Definition Creator</h3>
        <p className="text-sm text-gray-600">Select up to {MAX_WORDS} words and AI will create a definition for you</p>
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
              <p className="text-gray-400 text-sm">Select words for your AI definition...</p>
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
            <p className="font-medium mb-1">How it works:</p>
            <p>Select words that relate to AI, then click "Create Definition" and our AI will craft a nonprofit-focused definition using only your selected words!</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={createDefinition} 
          size="sm" 
          disabled={selectedWords.length < 2 || loading}
        >
          {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
          Create Definition
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          Clear
        </Button>
      </div>

      {definition && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Your AI Definition:</span>
          </div>
          <p className="text-sm text-green-800 leading-relaxed">{definition}</p>
        </div>
      )}
    </div>
  );
};
