
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonNavigationProps {
  user: any;
  isChapterCompleted: boolean;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  user,
  isChapterCompleted
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mt-12 mx-auto max-w-4xl">
      <Button variant="outline" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Chapters
      </Button>
      
      {user && isChapterCompleted && (
        <Button 
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600" 
          onClick={() => navigate('/dashboard')}
        >
          Continue Learning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
