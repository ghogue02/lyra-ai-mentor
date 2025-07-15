
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';

export const GrantWritingAssistantDemo = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [generatedParagraph, setGeneratedParagraph] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!projectDescription) return;
    setIsLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      const generatedText = `Based on the project description, "${projectDescription}", our initiative aims to address a critical need in the community. We will leverage our unique approach to deliver a measurable impact, building on our past successes and partnerships to create a sustainable solution. This program is designed to empower individuals and strengthen the community fabric, and we are confident that with your support, we can achieve these ambitious goals.`
      setGeneratedParagraph(generatedText);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI Grant Writing Assistant Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
          <Textarea
            id="project-description"
            placeholder="e.g., A community garden to provide fresh produce and educational workshops for low-income families."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading || !projectDescription}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Opening Paragraph
        </Button>
        {generatedParagraph && (
          <div className="p-4 bg-gray-50 rounded-md border">
            <h4 className="font-semibold mb-2">Generated Opening Paragraph:</h4>
            <p className="text-gray-700">{generatedParagraph}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
