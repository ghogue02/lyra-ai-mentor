import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function JourneyShowcase() {
  const navigate = useNavigate();

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
            Your AI Learning Journey
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress across all character journeys
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Characters Met</CardTitle>
              <CardDescription>5 inspiring nonprofit professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3/5</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Skills Learned</CardTitle>
              <CardDescription>AI tools mastered</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12/25</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Time Saved</CardTitle>
              <CardDescription>Through AI automation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">47 hrs</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6 text-center">
            <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Continue?</h2>
            <p className="text-gray-600 mb-4">
              Visit the AI Playground to practice with real tools
            </p>
            <Button onClick={() => navigate('/ai-playground')}>
              Go to AI Playground
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}