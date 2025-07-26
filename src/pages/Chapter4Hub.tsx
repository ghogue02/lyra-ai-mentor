import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, TrendingUp, PieChart, Presentation, Brain, CheckCircle, PlayCircle, ArrowRight, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const Chapter4Hub: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  // David's data storytelling journey micro-lessons
  const microLessons: MicroLesson[] = [
    {
      id: 'david-data-awakening',
      title: 'Meet David & Data Awakening',
      description: 'Transform from data-overwhelmed to data-empowered with David Chen',
      icon: <Brain className="w-6 h-6" />,
      route: '/chapter/4/interactive/david-data-awakening',
      estimated_time: '12 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'numbers-to-narratives',
      title: 'Numbers to Narratives Workshop',
      description: 'Turn raw data into compelling stories with AI interpretation tools',
      icon: <TrendingUp className="w-6 h-6" />,
      route: '/chapter/4/interactive/numbers-to-narratives',
      estimated_time: '16 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'visualization-mastery',
      title: 'Visualization Mastery Lab',
      description: 'Create stunning charts and dashboards with AI-powered design tools',
      icon: <PieChart className="w-6 h-6" />,
      route: '/chapter/4/david-data-revival',
      estimated_time: '18 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'executive-presentations',
      title: 'Executive Presentation Builder',
      description: 'Craft board-ready presentations that drive decision-making',
      icon: <Presentation className="w-6 h-6" />,
      route: '/chapter/4/david-data-story-finder',
      estimated_time: '20 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'data-strategy-framework',
      title: 'Data Strategy Framework',
      description: 'Build a comprehensive AI-guided data storytelling system',
      icon: <Database className="w-6 h-6" />,
      route: '/chapter/4/david-presentation-master',
      estimated_time: '22 min',
      difficulty: 'Advanced',
      completed: false,
      unlocked: true
    },
    {
      id: 'system-builder',
      title: 'System Builder Mastery',
      description: 'Build comprehensive data storytelling systems that scale organizational insights',
      icon: <Database className="w-6 h-6" />,
      route: '/chapter/4/david-system-builder',
      estimated_time: '28 min',
      difficulty: 'Advanced',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with David's Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Storytelling with David</h1>
              <p className="text-lg text-gray-600">Transform numbers into compelling insights</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-blue-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Data Mastery Progress</span>
              <span className="text-sm text-blue-600 font-semibold">{completedCount}/{microLessons.length} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500">Turn data confusion into clarity and confidence</p>
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
                "hover:shadow-xl hover:scale-105 hover:border-blue-300",
                selectedLesson === lesson.id && "ring-4 ring-blue-200 border-blue-500",
                lesson.completed && "border-green-300 bg-green-50",
                !lesson.unlocked && "border-gray-200 bg-gray-50"
              )}>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : lesson.unlocked ? (
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Lesson Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  lesson.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
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
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* David's Introduction Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet David Chen - Your Data Storytelling Guide</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            David is a Data Analyst who went from drowning in spreadsheets to creating compelling data stories 
            that drive organizational decisions. He'll teach you how to use AI to uncover insights, create 
            beautiful visualizations, and present data in ways that inspire action and secure funding.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/chapter/4/david-data-revival')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Meet David & Awaken Your Data
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chapter4Hub;