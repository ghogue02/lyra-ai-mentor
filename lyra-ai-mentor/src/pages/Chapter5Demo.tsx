import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Workflow, Clock, Target, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LyraAvatar } from '@/components/LyraAvatar';
import { RachelAutomationVision } from '@/components/interactive/RachelAutomationVision';

/**
 * Chapter 5: Rachel's Automation & Efficiency Journey
 * Character: Rachel Martinez - From Burned Out to Balanced
 * Focus: Build AI-powered workflows that create time for what matters
 */
const Chapter5Demo: React.FC = () => {
  const navigate = useNavigate();

  const rachelLessons = [
    {
      id: 'automation-vision',
      title: 'Automation Vision Builder',
      description: 'Design your ideal workflow and identify automation opportunities',
      icon: <Target className="w-6 h-6" />,
      component: 'automation-vision',
      duration: '18 min'
    },
    {
      id: 'workflow-designer',
      title: 'Smart Workflow Designer',
      description: 'Create AI-powered workflows that handle routine tasks',
      icon: <Workflow className="w-6 h-6" />,
      component: 'workflow-designer',
      duration: '22 min'
    },
    {
      id: 'process-transformer',
      title: 'Process Transformation',
      description: 'Transform manual processes into automated systems',
      icon: <Zap className="w-6 h-6" />,
      component: 'process-transformer',
      duration: '20 min'
    },
    {
      id: 'ecosystem-builder',
      title: 'Automation Ecosystem',
      description: 'Connect tools and build a complete automation ecosystem',
      icon: <Clock className="w-6 h-6" />,
      component: 'ecosystem-builder',
      duration: '25 min'
    }
  ];

  const [selectedLesson, setSelectedLesson] = React.useState<string>('automation-vision');

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'automation-vision':
        return <RachelAutomationVision onComplete={() => console.log('Automation Vision completed')} />;
      default:
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Component Coming Soon</h3>
            <p className="text-gray-600">This lesson is being enhanced with AI-powered features.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              <h1 className="text-3xl font-bold text-gray-900">Chapter 5: Automation & Efficiency</h1>
              <p className="text-lg text-gray-600">Rachel's Journey from Burnout to Balance</p>
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-green-100 to-emerald-100">
            <CardHeader>
              <CardTitle>Meet Rachel Martinez</CardTitle>
              <CardDescription className="text-base">
                Operations Manager at Community Health Alliance who transformed from working 70-hour weeks
                to achieving work-life balance through AI automation. Rachel proves that technology can
                create more time for human connection and strategic thinking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <div className="text-left">
                  <p className="font-semibold text-green-700">Key Focus Areas:</p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Workflow automation design</li>
                    <li>• Time-saving AI tools</li>
                    <li>• Process optimization</li>
                    <li>• Work-life balance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lesson Navigation */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {rachelLessons.map((lesson, index) => (
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
              onClick={() => navigate('/chapter4-demo')}
            >
              Previous Chapter
            </Button>
            <Button 
              onClick={() => navigate('/chapter6-demo')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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

export default Chapter5Demo;