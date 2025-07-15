import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wrench, BarChart3, Lightbulb, RefreshCw } from 'lucide-react';

export default function AIRefinePage() {
  const navigate = useNavigate();

  const refineTools = [
    {
      title: "Prompt Optimizer",
      description: "Automatically improve your AI prompts",
      icon: Wrench,
      color: "bg-teal-100 text-teal-600"
    },
    {
      title: "Performance Analytics",
      description: "Analyze AI response quality and speed",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Smart Suggestions",
      description: "Get AI-powered optimization recommendations",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Iterative Improvement",
      description: "Continuously refine based on feedback",
      icon: RefreshCw,
      color: "bg-violet-100 text-violet-600"
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
            AI Refinement Lab
          </h1>
          <p className="text-xl text-gray-600">
            Optimize and refine your AI interactions for better results
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {refineTools.map((tool, index) => (
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
                  Start Refining
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}