import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Palette, Mic, Heart, Video, Sparkles, CheckCircle, PlayCircle, ArrowRight, Users } from 'lucide-react';
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

const Chapter3Hub: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  // Sofia's storytelling journey micro-lessons
  const microLessons: MicroLesson[] = [
    {
      id: 'mission-story-creator',
      title: 'Mission Story Creator',
      description: 'Discover your organization\'s unique narrative voice with Sofia Martinez',
      icon: <Sparkles className="w-6 h-6" />,
      route: '/chapter/3/sofia-mission-story-creator',
      estimated_time: '12 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'voice-discovery',
      title: 'Voice Discovery Workshop',
      description: 'Master the art of compelling storytelling with AI-powered story building',
      icon: <Palette className="w-6 h-6" />,
      route: '/chapter/3/sofia-voice-discovery',
      estimated_time: '15 min',
      difficulty: 'Beginner',
      completed: false,
      unlocked: true
    },
    {
      id: 'story-breakthrough',
      title: 'Story Breakthrough Lab',
      description: 'Create stunning presentations with AI-generated visual assets',
      icon: <Video className="w-6 h-6" />,
      route: '/chapter/3/sofia-story-breakthrough',
      estimated_time: '18 min',
      difficulty: 'Intermediate',
      completed: false,
      unlocked: true
    },
    {
      id: 'impact-scaling',
      title: 'Impact Scaling Mastery',
      description: 'Use AI to analyze and connect with different audience types',
      icon: <Users className="w-6 h-6" />,
      route: '/chapter/3/sofia-impact-scaling',
      estimated_time: '16 min',
      difficulty: 'Intermediate',
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Sofia's Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Storytelling Mastery with Sofia</h1>
              <p className="text-lg text-gray-600">Transform your mission into compelling narratives</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-rose-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Storytelling Progress</span>
              <span className="text-sm text-rose-600 font-semibold">{completedCount}/{microLessons.length} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-rose-600 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500">Master storytelling that moves hearts and minds</p>
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
                "hover:shadow-xl hover:scale-105 hover:border-rose-300",
                selectedLesson === lesson.id && "ring-4 ring-rose-200 border-rose-500",
                lesson.completed && "border-green-300 bg-green-50",
                !lesson.unlocked && "border-gray-200 bg-gray-50"
              )}>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : lesson.unlocked ? (
                    <PlayCircle className="w-6 h-6 text-rose-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Lesson Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  lesson.completed ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-600"
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
                      <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sofia's Introduction Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-rose-100 to-purple-100 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet Sofia Martinez - Your Storytelling Guide</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Sofia is a Creative Communications Coordinator who discovered how AI can amplify authentic storytelling. 
            She'll show you how to craft narratives that resonate deeply with your audience, create compelling 
            presentations, and spread your impact stories across multiple channels with confidence and creativity.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/chapter/3/sofia-mission-story-creator')}
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
            >
              Meet Sofia & Discover Your Story
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chapter3Hub;