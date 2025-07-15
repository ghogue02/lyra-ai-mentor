import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Beaker, Zap, Settings, Target } from 'lucide-react';

export default function AITestingPage() {
  const navigate = useNavigate();

  const testingTools = [
    {
      title: "Prompt Testing",
      description: "Test and refine AI prompts for better results",
      icon: Beaker,
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      title: "Model Comparison",
      description: "Compare different AI models side by side",
      icon: Zap,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Parameter Tuning",
      description: "Adjust model parameters for optimal performance",
      icon: Settings,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "Performance Testing",
      description: "Measure accuracy and response times",
      icon: Target,
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Testing Ground
          </h1>
          <p className="text-xl text-gray-600">
            Experiment with AI models and optimize your prompts
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testingTools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Start Testing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}