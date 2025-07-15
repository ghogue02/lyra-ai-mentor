import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Image, FileText, Code } from 'lucide-react';

export default function AIPlaygroundPage() {
  const navigate = useNavigate();

  const playgroundTools = [
    {
      title: "Chat Assistant",
      description: "Interactive chat with AI for various tasks",
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Image Generation",
      description: "Create images from text descriptions",
      icon: Image,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Content Writer",
      description: "Generate articles, emails, and documents",
      icon: FileText,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Code Assistant",
      description: "Get help with programming and debugging",
      icon: Code,
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
            AI Playground
          </h1>
          <p className="text-xl text-gray-600">
            Practice with real AI tools tailored to your learning journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {playgroundTools.map((tool, index) => (
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
                  Try Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}