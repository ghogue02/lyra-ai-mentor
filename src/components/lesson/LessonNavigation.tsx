
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
      {/* Neumorphic Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] border-gray-200 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Chapters
      </Button>
      
      {user && isChapterCompleted && (
        /* Neumorphic Continue Button */
        <Button 
          className="bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] text-purple-600 hover:text-purple-700 border-0 transition-all duration-300" 
          onClick={() => navigate('/dashboard')}
        >
          Continue Learning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
