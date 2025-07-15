import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, BarChart3, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LyraAvatar } from '@/components/LyraAvatar';
import AlexChapter3InteractiveBuilder from '@/components/generated/AlexChapter3InteractiveBuilder';

/**
 * Chapter 3: Alex's Strategic Planning & Leadership Journey
 * Character: Alex Chen - Executive Director
 * Focus: Transform from scattered priorities to clear strategic focus
 */
const Chapter3Demo: React.FC = () => {
  const navigate = useNavigate();

  const alexLessons = [
    {
      id: 'strategic-planning',
      title: 'Strategic Planning Builder',
      description: 'Create a comprehensive 3-year organizational strategy with AI guidance',
      icon: <Target className="w-6 h-6" />,
      component: 'strategic-planning',
      duration: '25 min'
    },
    {
      id: 'vision-alignment',
      title: 'Vision & Mission Alignment',
      description: 'Align team priorities with organizational vision and values',
      icon: <Users className="w-6 h-6" />,
      component: 'vision-alignment',
      duration: '20 min'
    },
    {
      id: 'resource-planning',
      title: 'Resource Planning & Allocation',
      description: 'Optimize resource allocation for maximum impact and efficiency',
      icon: <BarChart3 className="w-6 h-6" />,
      component: 'resource-planning',
      duration: '18 min'
    },
    {
      id: 'performance-tracking',
      title: 'Strategic Performance Tracking',
      description: 'Measure and track strategic initiatives with clear metrics',
      icon: <TrendingUp className="w-6 h-6" />,
      component: 'performance-tracking',
      duration: '15 min'
    }
  ];

  const [selectedLesson, setSelectedLesson] = React.useState<string>('strategic-planning');

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'strategic-planning':
        return (
          <div className="bg-white rounded-lg">
            <AlexChapter3InteractiveBuilder />
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Component Coming Soon</h3>
            <p className="text-gray-600">This lesson is being enhanced with AI-powered strategic planning features.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="helping" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chapter 3: Strategic Planning & Leadership</h1>
              <p className="text-lg text-gray-600">Alex's Journey from Overwhelm to Clarity</p>
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-green-100 to-blue-100">
            <CardHeader>
              <CardTitle>Meet Alex Chen</CardTitle>
              <CardDescription className="text-base">
                Executive Director who transformed from scattered priorities to clear strategic focus. 
                Alex leads Harbor Community Services with a vision-driven approach that aligns teams, 
                optimizes resources, and delivers measurable community impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <div className="text-left">
                  <p className="font-semibold text-green-700">Key Focus Areas:</p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Strategic planning & execution</li>
                    <li>• Vision alignment & team coordination</li>
                    <li>• Resource optimization</li>
                    <li>• Performance measurement</li>
                  </ul>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-green-700">Transformation:</p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Before: 3 hours planning sessions</li>
                    <li>• After: 45 minutes focused planning</li>
                    <li>• <strong>Savings: 2h 15m per session</strong></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lesson Navigation */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {alexLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedLesson === lesson.id 
                    ? 'border-green-500 shadow-lg' 
                    : 'hover:border-green-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                    {lesson.icon}
                  </div>
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                  <CardDescription className="text-xs">{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{lesson.duration}</span>
                    {selectedLesson === lesson.id && (
                      <ArrowRight className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lesson Content Area */}
        <motion.div
          key={selectedLesson}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderLessonContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/chapter/2/lesson/5')}
            >
              Previous Chapter
            </Button>
            <Button 
              onClick={() => navigate('/chapter4-demo')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Next Chapter
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter3Demo;