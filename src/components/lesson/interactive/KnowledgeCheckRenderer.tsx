
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface KnowledgeCheckRendererProps {
  element: {
    content: string;
    configuration: any;
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const KnowledgeCheckRenderer: React.FC<KnowledgeCheckRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const config = element.configuration || {};
  const options = config.options || [];
  const correctAnswer = config.correctAnswer;
  const explanation = config.explanation;

  // Handle both single correct answer (number) and multiple correct answers (array)
  const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

  const handleKnowledgeCheck = async () => {
    setShowFeedback(true);
    await onComplete();
  };

  const toggleOption = (index: number) => {
    if (selectedOptions.includes(index)) {
      setSelectedOptions(selectedOptions.filter(i => i !== index));
    } else {
      setSelectedOptions([...selectedOptions, index]);
    }
  };

  // Check if selected answers match correct answers
  const isCorrect = showFeedback && 
    selectedOptions.length === correctAnswers.length &&
    selectedOptions.every(selected => correctAnswers.includes(selected));

  return (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed">{element.content}</p>
      
      <div className="space-y-3">
        {options.map((option: string, index: number) => {
          const isSelected = selectedOptions.includes(index);
          const isCorrectOption = correctAnswers.includes(index);
          
          return (
            <div key={index} className="flex items-center space-x-3">
              <Checkbox 
                id={`option-${index}`} 
                checked={isSelected}
                onCheckedChange={() => toggleOption(index)}
                disabled={isElementCompleted}
                className={showFeedback ? (
                  isCorrectOption ? 'border-green-500' : 
                  isSelected ? 'border-red-500' : ''
                ) : ''}
              />
              <label 
                htmlFor={`option-${index}`} 
                className={`text-sm leading-relaxed cursor-pointer flex-1 ${
                  showFeedback ? (
                    isCorrectOption ? 'text-green-700 font-medium' :
                    isSelected ? 'text-red-600' : 'text-gray-600'
                  ) : ''
                }`}
              >
                {option}
              </label>
              {showFeedback && isCorrectOption && (
                <span className="text-green-600 text-sm">✓</span>
              )}
              {showFeedback && isSelected && !isCorrectOption && (
                <span className="text-red-600 text-sm">✗</span>
              )}
            </div>
          );
        })}
      </div>
      
      <Button 
        onClick={handleKnowledgeCheck} 
        size="sm" 
        className="mt-4" 
        disabled={isElementCompleted || selectedOptions.length === 0}
      >
        {isElementCompleted ? 'Completed' : 'Check Answers'}
      </Button>
      
      {showFeedback && explanation && (
        <div className={`mt-4 p-3 border rounded-md ${
          isCorrect 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-sm ${
            isCorrect ? 'text-green-800' : 'text-blue-800'
          }`}>
            {isCorrect && '✓ Correct! '}
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
