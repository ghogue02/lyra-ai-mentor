import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Workflow, Zap, Settings, Repeat, GitBranch, CheckCircle, PlayCircle, ArrowRight, Cpu } from 'lucide-react';
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

const Chapter5Hub: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  // Rachel's automation journey micro-lessons
  const microLessons: MicroLesson[] = [
    {
      id: 'rachel-automation-vision',
      title: 'Meet Rachel & Automation Vision',
      description: 'Discover how to map and automate your nonprofit\'s key processes',
      icon: <Workflow className="w-6 h-6" />,
      route: '/chapter/5/interactive/rachel-automation-vision',
      estimated_time: '14 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'human-centered-design',
      title: 'Human-Centered Design Workshop',
      description: 'Build automation that enhances rather than replaces human connection',
      icon: <Zap className="w-6 h-6" />,
      route: '/chapter/5/interactive/human-centered-design',
      estimated_time: '16 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'automation-planning',
      title: 'Automation Planning Lab',
      description: 'Create step-by-step implementation roadmaps with AI guidance',
      icon: <GitBranch className="w-6 h-6" />,
      route: '/chapter/5/interactive/automation-planning',
      estimated_time: '20 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'change-management',
      title: 'Change Management Mastery',
      description: 'Lead organizational transformation with AI-powered communication',
      icon: <Repeat className="w-6 h-6" />,
      route: '/chapter/5/interactive/change-management',
      estimated_time: '18 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'scaling-systems',
      title: 'Scaling Systems Strategy',
      description: 'Build a comprehensive AI automation ecosystem for your organization',
      icon: <Cpu className="w-6 h-6" />,
      route: '/chapter/5/interactive/scaling-systems',
      estimated_time: '25 min',
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Rachel's Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Automation with Rachel</h1>
              <p className="text-lg text-gray-600">Transform operations through intelligent automation</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-teal-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Automation Progress</span>
              <span className="text-sm text-teal-600 font-semibold">{completedCount}/{microLessons.length} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-teal-600 to-emerald-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500">Build systems that free time for what matters most</p>
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
                "hover:shadow-xl hover:scale-105 hover:border-teal-300",
                selectedLesson === lesson.id && "ring-4 ring-teal-200 border-teal-500",
                lesson.completed && "border-green-300 bg-green-50",
                !lesson.unlocked && "border-gray-200 bg-gray-50"
              )}>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : lesson.unlocked ? (
                    <PlayCircle className="w-6 h-6 text-teal-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Lesson Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  lesson.completed ? "bg-green-100 text-green-600" : "bg-teal-100 text-teal-600"
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
                      <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rachel's Introduction Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-teal-100 to-emerald-100 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet Rachel Thompson - Your Automation Guide</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Rachel is an Operations Manager who transformed chaotic manual processes into streamlined, 
            human-centered workflows. She'll show you how to identify automation opportunities, implement 
            changes thoughtfully, and build systems that enhance your team's impact while preserving the 
            personal connections that make nonprofit work meaningful.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/chapter/5/interactive/rachel-automation-vision')}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
            >
              Meet Rachel & Envision Automation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chapter5Hub;