
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
      
    </div>
  );
};
