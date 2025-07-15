import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Code, Eye, Palette, Layers } from 'lucide-react';

export default function ShowcasePage() {
  const navigate = useNavigate();

  const showcaseItems = [
    {
      title: "Interactive Components",
      description: "Explore our library of interactive UI components",
      icon: Code,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Visual Elements",
      description: "See animations and visual effects in action",
      icon: Eye,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Design System",
      description: "Comprehensive design tokens and patterns",
      icon: Palette,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Layout Components",
      description: "Responsive layouts and grid systems",
      icon: Layers,
      color: "bg-orange-100 text-orange-600"
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
            Component Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Explore our comprehensive library of interactive components
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Examples
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}