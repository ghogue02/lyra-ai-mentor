
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowUp, ArrowDown, Shuffle, CheckCircle, Info } from 'lucide-react';

export const SequenceSorter = () => {
  const [steps, setSteps] = useState([
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
  ]);

  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const correctOrder = [1, 2, 3, 4, 5, 6];

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setSteps(newSteps);
      setShowResult(false);
    }
  };

  const checkOrder = () => {
    const currentOrder = steps.map(step => step.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setShowResult(true);
  };

  const shuffleSteps = () => {
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setSteps(shuffled);
    setShowResult(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Implementation Sequence</h3>
        <p className="text-sm text-gray-600">Put these steps in the correct order (click info for details)</p>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <Card key={step.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{step.text}</span>
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
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
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
