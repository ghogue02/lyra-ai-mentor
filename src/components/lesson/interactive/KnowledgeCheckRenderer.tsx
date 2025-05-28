
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const config = element.configuration || {};
  const options = config.options || [];

  const handleKnowledgeCheck = async () => {
    setShowFeedback(true);
    await onComplete();
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed">{element.content}</p>
      
      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <Checkbox 
              id={`option-${index}`} 
              checked={selectedOptions.includes(option)} 
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedOptions([...selectedOptions, option]);
                } else {
                  setSelectedOptions(selectedOptions.filter(o => o !== option));
                }
              }} 
            />
            <label htmlFor={`option-${index}`} className="text-sm leading-relaxed cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleKnowledgeCheck} 
        size="sm" 
        className="mt-4" 
        disabled={isElementCompleted}
      >
        {isElementCompleted ? 'Completed' : 'Check Answers'}
      </Button>
      
      {showFeedback && config.feedback && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">{config.feedback}</p>
        </div>
      )}
    </div>
  );
};
