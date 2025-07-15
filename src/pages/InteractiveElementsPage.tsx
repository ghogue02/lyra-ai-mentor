import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MousePointer, Puzzle, Gamepad2, BookOpen } from 'lucide-react';

export default function InteractiveElementsPage() {
  const navigate = useNavigate();

  const elements = [
    {
      title: "Click & Drag",
      description: "Interactive drag-and-drop components",
      icon: MousePointer,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Puzzle Elements",
      description: "Educational puzzles and brain teasers",
      icon: Puzzle,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Gamification",
      description: "Game-like elements for engagement",
      icon: Gamepad2,
      color: "bg-pink-100 text-pink-600"
    },
    {
      title: "Learning Modules",
      description: "Step-by-step interactive lessons",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600"
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
            Interactive Elements
          </h1>
          <p className="text-xl text-gray-600">
            Browse our collection of interactive learning components
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {elements.map((element, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${element.color}`}>
                  <element.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{element.title}</CardTitle>
                <CardDescription>{element.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}