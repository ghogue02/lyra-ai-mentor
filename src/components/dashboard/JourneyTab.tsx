
import React from 'react';
import { ChapterGrid } from './ChapterGrid';

interface JourneyTabProps {
  onboardingComplete: boolean;
  onChapterClick: (chapterId: number) => void;
}

export const JourneyTab: React.FC<JourneyTabProps> = ({
  onboardingComplete,
  onChapterClick
}) => {
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
