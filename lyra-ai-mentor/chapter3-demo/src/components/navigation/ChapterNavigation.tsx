import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mic, Target, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { sofiaLessons } from '../../data/lessons';
import { sofiaWorkshops } from '../../data/workshops';
import { SofiaCharacter } from '../character/SofiaCharacter';

interface ChapterNavigationProps {
  onSelectLesson: (lessonId: string) => void;
  onSelectWorkshop: (workshopId: string) => void;
  completedLessons: string[];
  completedWorkshops: string[];
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  onSelectLesson,
  onSelectWorkshop,
  completedLessons,
  completedWorkshops
}) => {
  const getLessonIcon = (lessonId: string) => {
    switch (lessonId) {
      case 'lesson-1': return Mic;
      case 'lesson-2': return BookOpen;
      case 'lesson-3': return Users;
      case 'lesson-4': return Target;
      case 'lesson-5': return Star;
      default: return BookOpen;
    }
  };

  const getWorkshopIcon = (workshopId: string) => {
    switch (workshopId) {
      case 'vocal-technique-mastery': return Mic;
      case 'slide-design-workshop': return BookOpen;
      case 'qa-handling-guide': return Users;
      case 'stage-presence-training': return Star;
      default: return Target;
    }
  };

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    return completedLessons.includes(sofiaLessons[lessonIndex - 1].id);
  };

  const areWorkshopsUnlocked = () => {
    return completedLessons.length >= 4; // Need to complete first 4 lessons
  };

  const calculateProgress = () => {
    const totalLessons = sofiaLessons.length;
    const totalWorkshops = sofiaWorkshops.length;
    const completed = completedLessons.length + completedWorkshops.length;
    const total = totalLessons + totalWorkshops;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Chapter 3: Voice Mastery</h1>
              <p className="text-gray-600 mt-1">Master the art of confident speaking with Sofia Martinez</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-600">{calculateProgress()}%</p>
              </div>
              <SofiaCharacter mood="welcoming" showQuote={true} showStats={true} interactive={true} />
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Learning Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Lessons Completed</h3>
              <p className="text-2xl font-bold text-blue-600">{completedLessons.length}/{sofiaLessons.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Workshops Completed</h3>
              <p className="text-2xl font-bold text-green-600">{completedWorkshops.length}/{sofiaWorkshops.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Total Progress</h3>
              <p className="text-2xl font-bold text-purple-600">{calculateProgress()}%</p>
            </div>
          </div>
        </div>

        {/* Core Lessons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Core Lessons</h2>
          <div className="space-y-4">
            {sofiaLessons.map((lesson, index) => {
              const IconComponent = getLessonIcon(lesson.id);
              const isCompleted = completedLessons.includes(lesson.id);
              const isUnlocked = isLessonUnlocked(index);
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isUnlocked 
                        ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isUnlocked 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <IconComponent className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                        <p className="text-gray-600 text-sm">{lesson.objective}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {lesson.duration} min
                          </span>
                          {isCompleted && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Completed
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isUnlocked && (
                        <button
                          onClick={() => onSelectLesson(lesson.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            isCompleted 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isCompleted ? 'Review' : 'Start'}
                        </button>
                      )}
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Advanced Workshops */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Advanced Workshops</h2>
            {!areWorkshopsUnlocked() && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Complete first 4 lessons to unlock
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sofiaWorkshops.map((workshop, index) => {
              const IconComponent = getWorkshopIcon(workshop.id);
              const isCompleted = completedWorkshops.includes(workshop.id);
              const isUnlocked = areWorkshopsUnlocked();
              
              return (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isUnlocked 
                        ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isUnlocked 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{workshop.title}</h3>
                      <p className="text-gray-600 text-sm">{workshop.focus_area}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {workshop.skill_level}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {workshop.duration} min
                      </span>
                      {isCompleted && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    {isUnlocked && (
                      <button
                        onClick={() => onSelectWorkshop(workshop.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          isCompleted 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation;