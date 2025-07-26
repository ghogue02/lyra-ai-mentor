import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Crown, Target, Users, Lightbulb, Rocket, CheckCircle, PlayCircle, ArrowRight, Trophy } from 'lucide-react';
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

const Chapter6Hub: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  // Alex's leadership journey micro-lessons
  const microLessons: MicroLesson[] = [
    {
      id: 'alex-leadership-challenges',
      title: 'Meet Alex & Leadership Challenges',
      description: 'Navigate the complexities of leading AI transformation in nonprofits',
      icon: <Crown className="w-6 h-6" />,
      route: '/chapter/6/interactive/alex-leadership-challenges',
      estimated_time: '15 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'vision-building',
      title: 'Vision Building Workshop',
      description: 'Create compelling AI transformation visions with strategic facilitation',
      icon: <Target className="w-6 h-6" />,
      route: '/chapter/6/interactive/vision-building',
      estimated_time: '18 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'transformation-planning',
      title: 'Transformation Planning Lab',
      description: 'Design comprehensive change management strategies with AI guidance',
      icon: <Lightbulb className="w-6 h-6" />,
      route: '/chapter/6/alex-change-strategy',
      estimated_time: '22 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'team-alignment',
      title: 'Team Alignment Mastery',
      description: 'Unite your organization around AI adoption with communication tools',
      icon: <Users className="w-6 h-6" />,
      route: '/chapter/6/alex-vision-builder',
      estimated_time: '20 min',
      difficulty: 'Advanced',
      completed: false,
      unlocked: true
    },
    {
      id: 'future-leadership',
      title: 'Future Leadership Strategy',
      description: 'Build a sustainable AI-powered organizational roadmap for lasting impact',
      icon: <Rocket className="w-6 h-6" />,
      route: '/chapter/6/alex-roadmap-creator',
      estimated_time: '25 min',
      difficulty: 'Advanced',
      completed: false,
      unlocked: true
    },
    {
      id: 'leadership-framework',
      title: 'Leadership Framework Mastery',
      description: 'Develop comprehensive AI leadership skills for lasting organizational transformation',
      icon: <Crown className="w-6 h-6" />,
      route: '/chapter/6/alex-leadership-framework',
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Alex's Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Leadership with Alex</h1>
              <p className="text-lg text-gray-600">Transform organizations through strategic AI adoption</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-indigo-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Leadership Progress</span>
              <span className="text-sm text-indigo-600 font-semibold">{completedCount}/{microLessons.length} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500">Lead transformation that amplifies your mission</p>
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
                "hover:shadow-xl hover:scale-105 hover:border-indigo-300",
                selectedLesson === lesson.id && "ring-4 ring-indigo-200 border-indigo-500",
                lesson.completed && "border-green-300 bg-green-50",
                !lesson.unlocked && "border-gray-200 bg-gray-50"
              )}>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : lesson.unlocked ? (
                    <PlayCircle className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Lesson Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  lesson.completed ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600"
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
                      <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alex's Introduction Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-indigo-100 to-violet-100 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet Alex Rivera - Your Leadership Guide</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Alex is an Executive Director who successfully led their organization through comprehensive AI transformation. 
            They'll share strategies for building organizational vision, managing change resistance, aligning teams 
            around new technologies, and creating sustainable systems that amplify your nonprofit's impact for years to come.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/chapter/6/alex-change-strategy')}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
            >
              Meet Alex & Begin Leadership Journey
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chapter6Hub;