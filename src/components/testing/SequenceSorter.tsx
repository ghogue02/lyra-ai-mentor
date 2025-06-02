
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GripVertical, Shuffle, CheckCircle, Info } from 'lucide-react';

export const SequenceSorter = () => {
  const initialSteps = [
    { 
      id: 1, 
      text: "Assess current workflows",
      description: "Start by mapping out your current processes - from volunteer onboarding to donor communications. Document time-consuming tasks, identify bottlenecks, and note where staff spend most of their administrative time. This foundation helps you see where AI can make the biggest impact for your mission."
    },
    { 
      id: 2, 
      text: "Identify AI use cases",
      description: "Look for repetitive tasks that follow patterns - email responses, volunteer matching, data entry, or scheduling. Focus on areas where AI can free up your team's time for relationship-building and direct service delivery. Start with one clear problem that affects your daily operations."
    },
    { 
      id: 3, 
      text: "Choose appropriate tools",
      description: "Research AI solutions designed for nonprofits or small organizations. Consider your budget, technical skills, and integration needs. Look for tools with nonprofit pricing, good customer support, and simple interfaces that won't overwhelm your team."
    },
    { 
      id: 4, 
      text: "Train staff",
      description: "Provide hands-on training in small groups, focusing on how AI tools will make their specific jobs easier. Address concerns openly, emphasize that AI enhances their work rather than replacing them, and ensure everyone feels comfortable with the new technology."
    },
    { 
      id: 5, 
      text: "Implement gradually",
      description: "Start with a pilot program using one AI tool for one specific task. Monitor results closely, gather feedback from your team, and make adjustments before expanding. This approach reduces risk and builds confidence throughout your organization."
    },
    { 
      id: 6, 
      text: "Monitor and adjust",
      description: "Track key metrics like time saved, accuracy improvements, and staff satisfaction. Regular check-ins help you optimize the AI tools for your specific needs and demonstrate the value to stakeholders. Be prepared to make changes as your organization grows."
    }
  ];

  // Function to create a randomized order that's not the correct sequence
  const createRandomizedOrder = () => {
    const correctOrder = [1, 2, 3, 4, 5, 6];
    let shuffled;
    do {
      shuffled = [...initialSteps].sort(() => Math.random() - 0.5);
    } while (JSON.stringify(shuffled.map(s => s.id)) === JSON.stringify(correctOrder));
    return shuffled;
  };

  const [steps, setSteps] = useState(() => createRandomizedOrder());
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const correctOrder = [1, 2, 3, 4, 5, 6];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
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

    const newSteps = [...steps];
    const draggedStep = newSteps[draggedItem];
    
    // Remove the dragged item
    newSteps.splice(draggedItem, 1);
    
    // Insert at the new position
    const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    newSteps.splice(insertIndex, 0, draggedStep);
    
    setSteps(newSteps);
    setDraggedItem(null);
    setDragOverIndex(null);
    setShowResult(false);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const checkOrder = () => {
    const currentOrder = steps.map(step => step.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setShowResult(true);
  };

  const shuffleSteps = () => {
    setSteps(createRandomizedOrder());
    setShowResult(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Implementation Sequence</h3>
        <p className="text-sm text-gray-600">Drag the steps to put them in the correct order (click info for details)</p>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`border transition-all duration-200 ${
              draggedItem === index 
                ? 'opacity-50 transform rotate-2 shadow-lg border-blue-300' 
                : dragOverIndex === index 
                ? 'border-blue-400 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
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
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={checkOrder} size="sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Check Order
        </Button>
        <Button onClick={shuffleSteps} variant="outline" size="sm">
          <Shuffle className="w-3 h-3 mr-1" />
          Shuffle
        </Button>
      </div>

      {showResult && (
        <Card className={`border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <CardContent className="p-3 text-center">
            <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 
                "Perfect! You've mastered the AI implementation sequence." : 
                "Not quite right. Try rearranging the steps - think about what should come first!"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
