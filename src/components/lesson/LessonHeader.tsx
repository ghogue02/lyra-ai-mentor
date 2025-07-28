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
      <button 
        onClick={() => navigate('/dashboard')} 
        className="neu-button mb-6 px-4 py-2 font-medium text-gray-700 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
      
      <div className="neu-card p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="neu-character w-16 h-16 bg-purple-50 flex items-center justify-center">
            <span className="text-2xl">{lesson.chapter.icon || '📚'}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-purple-700">
              {lesson.title}
            </h1>
            <div className="neu-text-container inline-flex items-center px-4 py-2">
              <p className="text-sm font-medium text-gray-600">Chapter: {lesson.chapter.title}</p>
            </div>
          </div>
          {(user && progress === 100) || isChapterCompleted ? (
            <div className="neu-character w-12 h-12 bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          ) : null}
        </div>
      </div>
      
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
            lessonTitle={lesson.title}
          />
        </div>
      )}
    </div>
  );
};