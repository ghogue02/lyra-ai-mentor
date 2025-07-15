
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const StoryFillInBlanks = () => {
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [showStory, setShowStory] = useState(false);

  const storyTemplate = {
    title: "AI Success Story at Hope Community Center",
    blanks: {
      problem: "Our biggest challenge was ___________",
      solution: "We decided to use AI to ___________", 
      tool: "The AI tool we chose was ___________",
      result: "After implementation, we saw ___________",
      impact: "This helped our community by ___________"
    },
    suggestions: {
      problem: ["volunteer scheduling", "donor communication", "data entry"],
      solution: ["automate repetitive tasks", "improve efficiency", "better organize information"],
      tool: ["a scheduling assistant", "an email automation system", "a data management platform"],
      result: ["20% time savings", "improved volunteer satisfaction", "better donor engagement"],
      impact: ["serving more families", "reducing staff burnout", "increasing program effectiveness"]
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const generateStory = () => {
    setShowStory(true);
  };

  const allFieldsFilled = Object.keys(storyTemplate.blanks).every(key => answers[key]?.trim());

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Success Story Builder</h3>
        <p className="text-sm text-gray-600">Fill in the blanks to create your nonprofit's AI story</p>
      </div>

      {!showStory ? (
        <div className="space-y-3">
          {Object.entries(storyTemplate.blanks).map(([key, prompt]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 block mb-1">{prompt}</label>
              <input
                type="text"
                value={answers[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder={`e.g., ${storyTemplate.suggestions[key as keyof typeof storyTemplate.suggestions][0]}`}
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {storyTemplate.suggestions[key as keyof typeof storyTemplate.suggestions].map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => handleInputChange(key, suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          <Button 
            onClick={generateStory} 
            disabled={!allFieldsFilled}
            className="w-full"
            size="sm"
          >
            Generate My Story
          </Button>
        </div>
      ) : (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 text-green-700">{storyTemplate.title}</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>{storyTemplate.blanks.problem.replace('___________', answers.problem)}.</p>
              <p>{storyTemplate.blanks.solution.replace('___________', answers.solution)}.</p>
              <p>{storyTemplate.blanks.tool.replace('___________', answers.tool)}.</p>
              <p>{storyTemplate.blanks.result.replace('___________', answers.result)}.</p>
              <p>{storyTemplate.blanks.impact.replace('___________', answers.impact)}.</p>
            </div>
            <Button 
              onClick={() => {setShowStory(false); setAnswers({});}} 
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Create Another Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
