import React from 'react';
import { MayaMicroLessonHub } from '@/components/maya/MayaMicroLessonHub';

export const MicroLessonTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Maya Micro-Lesson Test Page
        </h1>
        <p className="text-gray-600 mb-6">
          Testing the auto-continue functionality and glassmorphism UI
        </p>
        <MayaMicroLessonHub chapterId={2} lessonId={5} />
      </div>
    </div>
  );
};

export default MicroLessonTest;