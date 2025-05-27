
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonProgress } from './LessonProgress';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  estimated_duration: number;
  chapter: {
    title: string;
    icon: string;
  };
}

interface LessonHeaderProps {
  lesson: Lesson;
  user: any;
  progress: number;
  isChapterCompleted: boolean;
  completedBlocks: number;
  totalBlocks: number;
  completedInteractiveElements: number;
  totalInteractiveElements: number;
  chatEngagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  onMarkChapterComplete: () => void;
  hasContentBlocking: boolean;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lesson,
  user,
  progress,
  isChapterCompleted,
  completedBlocks,
  totalBlocks,
  completedInteractiveElements,
  totalInteractiveElements,
  chatEngagement,
  onMarkChapterComplete,
  hasContentBlocking
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center gap-3 mb-4">
        {user && progress === 100}
        {isChapterCompleted && (
          <Badge className="bg-blue-100 text-blue-700 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Chapter Complete
          </Badge>
        )}
      </div>
      
      <h1 className="text-4xl font-bold mb-2 text-purple-600">
        {lesson.title}
      </h1>
      
      <p className="text-gray-500 mb-6">Chapter: {lesson.chapter.title}</p>
      
      {user && (
        <div className="mt-6">
          <LessonProgress 
            completedBlocks={completedBlocks}
            totalBlocks={totalBlocks}
            completedInteractiveElements={completedInteractiveElements}
            totalInteractiveElements={totalInteractiveElements}
            estimatedDuration={lesson.estimated_duration}
            isCompleted={isChapterCompleted}
            chatEngagement={chatEngagement}
            onMarkChapterComplete={onMarkChapterComplete}
            hasContentBlocking={hasContentBlocking}
          />
        </div>
      )}
    </div>
  );
};
