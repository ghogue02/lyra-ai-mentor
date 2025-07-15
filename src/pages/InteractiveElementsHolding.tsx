
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SequenceSorterRenderer } from '@/components/lesson/interactive/SequenceSorterRenderer';
import { MultipleChoiceScenarios } from '@/components/testing/MultipleChoiceScenarios';

export const InteractiveElementsHolding = () => {
  const navigate = useNavigate();

  // Mock interactive elements data that were removed from Chapter 1
  const sequenceSorterElement = {
    id: 9,
    type: 'sequence_sorter',
    title: 'Practice: AI Implementation Steps',
    content: 'Arrange these steps in the correct order for implementing AI in a nonprofit organization. Think about the logical flow from assessment to deployment.',
    configuration: {
      steps: [
        {
          id: 1,
          text: "Assess Current Operations",
          description: "Evaluate your current processes, identify pain points, and understand your organization's readiness for AI adoption."
        },
        {
          id: 2,
          text: "Identify AI Opportunities",
          description: "Look for repetitive tasks, data analysis needs, and areas where AI could improve efficiency or effectiveness."
        },
        {
          id: 3,
          text: "Choose the Right Tools",
          description: "Research and select AI tools that match your needs, budget, and technical capabilities."
        },
        {
          id: 4,
          text: "Train Your Team",
          description: "Provide training and support to help your staff understand and effectively use the new AI tools."
        },
        {
          id: 5,
          text: "Start Small & Test",
          description: "Begin with pilot projects to test the AI tools and refine your approach before full implementation."
        },
        {
          id: 6,
          text: "Scale & Optimize",
          description: "Gradually expand AI usage across your organization and continuously optimize based on results and feedback."
        }
      ]
    },
    order_index: 9
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={false} />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <Archive className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Interactive Elements Archive</h1>
          </div>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> These interactive elements were previously part of Chapter 1 but have been moved here for potential future use. 
                They are fully functional and can be integrated back into lessons or used as reference materials.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Sequence Sorter Element */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {sequenceSorterElement.title}
                </CardTitle>
                <Badge variant="outline">Sequence Sorter</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Originally from Chapter 1 - Removed on {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <SequenceSorterRenderer
                element={sequenceSorterElement}
                isElementCompleted={false}
                onComplete={() => console.log('Sequence sorter completed in holding page')}
              />
            </CardContent>
          </Card>

          {/* Multiple Choice Scenarios Element */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Test Your Understanding: AI Scenarios
                </CardTitle>
                <Badge variant="outline">Multiple Choice</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Originally from Chapter 1 - Removed on {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <MultipleChoiceScenarios />
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Development Notes</h3>
              <p className="text-sm text-gray-600">
                These components maintain their original functionality and can be easily reintegrated into lessons. 
                The component code remains in the codebase at:
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• SequenceSorterRenderer: /src/components/lesson/interactive/SequenceSorterRenderer.tsx</li>
                <li>• MultipleChoiceScenarios: /src/components/testing/MultipleChoiceScenarios.tsx</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveElementsHolding;
