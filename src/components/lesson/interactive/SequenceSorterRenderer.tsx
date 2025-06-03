
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  const [currentSteps, setCurrentSteps] = useState(steps.sort(() => Math.random() - 0.5));
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination || showResult) return;

    const items = Array.from(currentSteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCurrentSteps(items);
  };

  const checkAnswer = () => {
    const correct = currentSteps.every((step, index) => step.id === index + 1);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct && !isElementCompleted) {
      onComplete();
    }
  };

  const resetSteps = () => {
    setCurrentSteps(steps.sort(() => Math.random() - 0.5));
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{element.content}</p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {currentSteps.map((step, index) => (
                <Draggable 
                  key={step.id} 
                  draggableId={step.id.toString()} 
                  index={index}
                  isDragDisabled={showResult}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all ${
                        snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                      } ${
                        showResult
                          ? step.id === index + 1
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'hover:shadow-md cursor-move'
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{step.text}</h4>
                            <p className="text-xs text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
                  Not quite right. Think about the logical flow: you need to understand your current situation before identifying opportunities, then choose tools before training staff.
                </p>
                <Button onClick={resetSteps} size="sm" variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button 
          onClick={showResult ? resetSteps : checkAnswer} 
          size="sm"
          disabled={showResult && isCorrect}
        >
          {showResult ? (isCorrect ? "Completed!" : "Try Again") : "Check Order"}
        </Button>
      </div>
    </div>
  );
};
