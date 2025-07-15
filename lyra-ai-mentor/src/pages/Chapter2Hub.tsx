import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Target, Mail, Heart, MessageCircle, CheckCircle, PlayCircle, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  estimated_time: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  unlocked: boolean;
}

const Chapter2Hub: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  // Maya's complete email mastery journey micro-lessons
  const microLessons: MicroLesson[] = [
    {
      id: 'pace-framework',
      title: 'PACE Framework Foundation',
      description: 'Master the core framework: Purpose → Audience → Context → Execute',
      icon: <Target className="w-6 h-6" />,
      route: '/lyra-maya-demo',
      estimated_time: '12 min',
      difficulty: 'Beginner',
      completed: true, // Already implemented
      unlocked: true
    },
    {
      id: 'tone-mastery',
      title: 'Tone Mastery Workshop',
      description: 'Adapt your voice for different audiences with confidence and authenticity',
      icon: <Heart className="w-6 h-6" />,
      route: '/chapter/2/lesson/5/tone-mastery',
      estimated_time: '15 min',
      difficulty: 'Intermediate',
      completed: true,
      unlocked: true
    },
    {
      id: 'template-library',
      title: 'Template Library Builder',
      description: 'Create reusable email templates for organizational efficiency',
      icon: <Mail className="w-6 h-6" />,
      route: '/chapter/2/lesson/5/template-library',
      estimated_time: '18 min',
      difficulty: 'Intermediate',
      completed: true,
      unlocked: true
    },
    {
      id: 'difficult-conversations',
      title: 'Difficult Conversations Guide',
      description: 'Handle challenging communications with empathy and skill',
      icon: <MessageCircle className="w-6 h-6" />,
      route: '/chapter/2/lesson/5/difficult-conversations',
      estimated_time: '20 min',
      difficulty: 'Advanced',
      completed: true,
      unlocked: true
    },
    {
      id: 'subject-workshop',
      title: 'Subject Line Workshop',
      description: 'Craft compelling email openings that get opened and read',
      icon: <Star className="w-6 h-6" />,
      route: '/chapter/2/lesson/5/subject-workshop',
      estimated_time: '14 min',
      difficulty: 'Intermediate',
      completed: true,
      unlocked: true
    }
  ];

  const completedCount = microLessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedCount / microLessons.length) * 100;

  const handleLessonSelect = (lesson: MicroLesson) => {
    if (!lesson.unlocked) return;
    
    setSelectedLesson(lesson.id);
    setTimeout(() => {
      navigate(lesson.route);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Maya's Journey Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="helping" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maya's Communication Mastery</h1>
              <p className="text-lg text-gray-600">Complete Email Transformation Journey</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-purple-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Journey Progress</span>
              <span className="text-sm text-purple-600 font-semibold">{completedCount}/{microLessons.length} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500">Following Maya Rodriguez's transformation at Hope Gardens Community Center</p>
          </div>
        </motion.div>

        {/* Micro-Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {microLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative group cursor-pointer",
                !lesson.unlocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleLessonSelect(lesson)}
            >
              <div className={cn(
                "bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300",
                "hover:shadow-xl hover:scale-105 hover:border-purple-300",
                selectedLesson === lesson.id && "ring-4 ring-purple-200 border-purple-500",
                lesson.completed && "border-green-300 bg-green-50",
                !lesson.unlocked && "border-gray-200 bg-gray-50"
              )}>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : lesson.unlocked ? (
                    <PlayCircle className="w-6 h-6 text-purple-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Lesson Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  lesson.completed ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                )}>
                  {lesson.icon}
                </div>

                {/* Lesson Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{lesson.description}</p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs">
                  <span className={cn(
                    "px-2 py-1 rounded-full",
                    lesson.difficulty === 'Beginner' && "bg-green-100 text-green-700",
                    lesson.difficulty === 'Intermediate' && "bg-yellow-100 text-yellow-700",
                    lesson.difficulty === 'Advanced' && "bg-red-100 text-red-700"
                  )}>
                    {lesson.difficulty}
                  </span>
                  <span className="text-gray-500">{lesson.estimated_time}</span>
                </div>

                {/* Call to Action */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {lesson.completed ? 'Review Journey' : lesson.unlocked ? 'Start Lesson' : 'Locked'}
                    </span>
                    {lesson.unlocked && (
                      <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Maya's Story Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Maya's Transformation Story</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Follow Maya Rodriguez as she transforms from email overwhelm to confident communication mastery. 
            Each micro-lesson builds on her real experiences at Hope Gardens Community Center, showing you 
            practical techniques that work in the real world of nonprofit communications.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/lyra-maya-demo')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start with PACE Framework
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chapter2Hub;