
import React from 'react';
import { ChapterGrid } from './ChapterGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JourneyTabProps {
  onboardingComplete: boolean;
  onChapterClick: (chapterId: number) => void;
}

export const JourneyTab: React.FC<JourneyTabProps> = ({
  onboardingComplete,
  onChapterClick
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-cyan-600">
          Your Learning Journey
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Six focused chapters designed to take you from AI curious to AI confident
        </p>
      </div>
      
      <ChapterGrid 
        onboardingComplete={onboardingComplete}
        onChapterClick={onChapterClick}
      />
      
      {/* AI Playground Section */}
      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-purple-600">
            Practice & Explore
          </h3>
          <p className="text-gray-600">
            Apply your learning with hands-on AI tools
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-purple-200 hover:shadow-lg transition-all cursor-pointer" 
                onClick={() => navigate('/ai-playground')}>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">AI Playground</CardTitle>
              <CardDescription>
                Practice with real AI tools tailored to each character's challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Start Practicing
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/journey-showcase')}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Journey Progress</CardTitle>
              <CardDescription>
                Track your learning journey across all characters and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Progress
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/skills-dashboard')}>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Skills Dashboard</CardTitle>
              <CardDescription>
                See your AI skills growth and mastery levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Skills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
