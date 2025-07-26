import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Lightbulb, MessageSquare, Shield, Cog, Brain, CheckCircle, PlayCircle, ArrowRight, Sparkles } from 'lucide-react';
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

const Chapter1Hub: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  // Lyra's AI foundations journey micro-lessons
  const microLessons: MicroLesson[] = [
    {
      id: 'lyra-foundations',
      title: 'Meet Lyra & AI Foundations',
      description: 'Your first AI companion and the fundamentals that will change everything',
      icon: <Sparkles className="w-6 h-6" />,
      route: '/chapter/1/interactive/lyra-foundations',
      estimated_time: '10 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'prompting-fundamentals',
      title: 'AI Prompting Fundamentals',
      description: 'Master the art of communicating with AI for powerful results',
      icon: <MessageSquare className="w-6 h-6" />,
      route: '/chapter/1/interactive/prompting-fundamentals',
      estimated_time: '12 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'understanding-models',
      title: 'Understanding AI Models',
      description: 'Discover different AI types and choose the right tool for each task',
      icon: <Brain className="w-6 h-6" />,
      route: '/chapter/1/interactive/understanding-models',
      estimated_time: '15 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'ai-ethics',
      title: 'AI Ethics for Nonprofits',
      description: 'Navigate responsible AI use in mission-driven organizations',
      icon: <Shield className="w-6 h-6" />,
      route: '/chapter/1/interactive/ai-ethics',
      estimated_time: '14 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'ai-toolkit-setup',
      title: 'Setting Up Your AI Toolkit',
      description: 'Build your personal AI workspace for maximum productivity',
      icon: <Cog className="w-6 h-6" />,
      route: '/chapter/1/interactive/ai-toolkit-setup',
      estimated_time: '18 min',
      difficulty: 'Beginner',
      completed: false,
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Lyra's Journey Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="helping" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Foundations with Lyra</h1>
              <p className="text-lg text-gray-600">Your Essential AI Learning Journey</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Learning Progress</span>
              <span className="text-sm text-cyan-600 font-semibold">{completedCount}/{microLessons.length} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-cyan-600 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500">Building your AI foundation with your guide Lyra</p>
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
                "hover:shadow-xl hover:scale-105 hover:border-cyan-300",
                selectedLesson === lesson.id && "ring-4 ring-cyan-200 border-cyan-500",
                lesson.completed && "border-green-300 bg-green-50",
                !lesson.unlocked && "border-gray-200 bg-gray-50"
              )}>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : lesson.unlocked ? (
                    <PlayCircle className="w-6 h-6 text-cyan-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Lesson Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  lesson.completed ? "bg-green-100 text-green-600" : "bg-cyan-100 text-cyan-600"
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
                      <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lyra's Introduction Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-cyan-100 to-purple-100 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your AI Learning Journey Begins</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Meet Lyra, your AI learning companion who will guide you through the essential foundations of artificial intelligence. 
            Together, you'll build confidence with AI tools, understand best practices, and create your personal AI toolkit 
            for transforming your nonprofit work.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/chapter/1/interactive/lyra-foundations')}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
            >
              Meet Lyra & Start Learning
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chapter1Hub;