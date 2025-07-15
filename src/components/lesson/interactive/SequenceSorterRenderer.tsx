
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GripVertical, Shuffle, CheckCircle, Info, Check, X } from 'lucide-react';

interface SequenceSorterRendererProps {
  element: {
    id: number;
    type: string;
    title: string;
    content: string;
    configuration: any;
  };
  isElementCompleted: boolean;
  onComplete: () => void;
}

export const SequenceSorterRenderer: React.FC<SequenceSorterRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const steps = element.configuration?.steps || [];
  
  // Function to create a randomized order that's not the correct sequence
  const createRandomizedOrder = () => {
    const correctOrder = [1, 2, 3, 4, 5, 6];
    let shuffled;
    do {
      shuffled = [...steps].sort(() => Math.random() - 0.5);
    } while (JSON.stringify(shuffled.map(s => s.id)) === JSON.stringify(correctOrder));
    return shuffled;
  };

  const [currentSteps, setCurrentSteps] = useState(() => createRandomizedOrder());
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stepCorrectness, setStepCorrectness] = useState<boolean[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const correctOrder = [1, 2, 3, 4, 5, 6];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    // Clear feedback when user starts dragging
    if (showResult) {
      setShowResult(false);
      setStepCorrectness([]);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newSteps = [...currentSteps];
    const draggedStep = newSteps[draggedItem];
    
    // Remove the dragged item
    newSteps.splice(draggedItem, 1);
    
    // Insert at the new position
    const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    newSteps.splice(insertIndex, 0, draggedStep);
    
    setCurrentSteps(newSteps);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const checkAnswer = () => {
    const currentOrder = currentSteps.map(step => step.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    
    // Check each step's correctness
    const correctnessArray = currentSteps.map((step, index) => {
      return step.id === correctOrder[index];
    });
    
    setIsCorrect(correct);
    setStepCorrectness(correctnessArray);
    setShowResult(true);
    
    if (correct && !isElementCompleted) {
      onComplete();
    }
  };

  const resetSteps = () => {
    setCurrentSteps(createRandomizedOrder());
    setShowResult(false);
    setStepCorrectness([]);
    setIsCorrect(false);
  };

  const correctCount = stepCorrectness.filter(Boolean).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{element.content}</p>

      <div className="space-y-2">
        {currentSteps.map((step, index) => {
          const isStepCorrect = showResult && stepCorrectness[index];
          const isStepIncorrect = showResult && !stepCorrectness[index];
          
          return (
            <Card 
              key={step.id} 
              className={`border transition-all duration-200 ${
                draggedItem === index 
                  ? 'opacity-50 transform rotate-2 shadow-lg border-blue-300' 
                  : dragOverIndex === index 
                  ? 'border-blue-400 bg-blue-50 shadow-md' 
                  : isStepCorrect
                  ? 'border-green-400 bg-green-50'
                  : isStepIncorrect
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 cursor-move'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <GripVertical 
                        className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" 
                        aria-label="Drag handle"
                      />
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                      {showResult && (
                        <div className="flex items-center">
                          {isStepCorrect ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-1">{step.text}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-gray-100"
                        >
                          <Info className="h-3 w-3 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-3 bg-white border shadow-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkAnswer} size="sm" disabled={showResult && isCorrect}>
          <CheckCircle className="w-3 h-3 mr-1" />
          {showResult ? (isCorrect ? "Completed!" : "Check Order") : "Check Order"}
        </Button>
        <Button onClick={resetSteps} variant="outline" size="sm">
          <Shuffle className="w-3 h-3 mr-1" />
          Shuffle
        </Button>
      </div>

      {showResult && (
        <Card className={`border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
          <CardContent className="p-4 text-center">
            {isCorrect ? (
              <div>
                <Badge className="bg-green-100 text-green-700 mb-2">Perfect!</Badge>
                <p className="text-sm text-green-700">
                  Excellent! You've arranged the AI implementation steps in the correct order. This sequence ensures a solid foundation for AI adoption in your nonprofit.
                </p>
              </div>
            ) : (
              <div>
                <Badge className="bg-orange-100 text-orange-700 mb-2">Try Again</Badge>
                <p className="text-sm text-orange-700 mb-3">
                  {correctCount} out of 6 steps are in the correct position. Think about the logical flow: you need to understand your current situation before identifying opportunities, then choose tools before training staff.
                </p>
                <Button onClick={resetSteps} size="sm" variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
