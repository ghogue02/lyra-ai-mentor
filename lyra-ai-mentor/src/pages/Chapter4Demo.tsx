import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, LineChart, PieChart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LyraAvatar } from '@/components/LyraAvatar';
import { DavidDataStoryFinder } from '@/components/interactive/DavidDataStoryFinder';

/**
 * Chapter 4: David's Data & Decision Making Journey
 * Character: David Kim - From Paralyzed to Platform Advocate
 * Focus: Transform overwhelming data into actionable insights
 */
const Chapter4Demo: React.FC = () => {
  const navigate = useNavigate();

  const davidLessons = [
    {
      id: 'data-revival',
      title: 'Data Revival Workshop',
      description: 'Bring your data to life with compelling visualizations',
      icon: <BarChart3 className="w-6 h-6" />,
      component: 'data-revival',
      duration: '20 min'
    },
    {
      id: 'story-finder',
      title: 'Finding Stories in Data',
      description: 'Discover hidden insights and narratives in your numbers',
      icon: <LineChart className="w-6 h-6" />,
      component: 'story-finder',
      duration: '18 min'
    },
    {
      id: 'presentation-master',
      title: 'Presentation Mastery',
      description: 'Create data presentations that inspire action',
      icon: <TrendingUp className="w-6 h-6" />,
      component: 'presentation-master',
      duration: '22 min'
    },
    {
      id: 'system-builder',
      title: 'Analytics System Builder',
      description: 'Build automated dashboards for continuous insights',
      icon: <PieChart className="w-6 h-6" />,
      component: 'system-builder',
      duration: '25 min'
    }
  ];

  const [selectedLesson, setSelectedLesson] = React.useState<string>('story-finder');

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'story-finder':
        return <DavidDataStoryFinder onComplete={() => console.log('Data Story Finder completed')} />;
      default:
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Component Coming Soon</h3>
            <p className="text-gray-600">This lesson is being enhanced with AI-powered features.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="thinking" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chapter 4: Data & Decision Making</h1>
              <p className="text-lg text-gray-600">David's Journey from Analysis Paralysis to Action</p>
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-100 to-cyan-100">
            <CardHeader>
              <CardTitle>Meet David Kim</CardTitle>
              <CardDescription className="text-base">
                Program Director at Urban Youth Initiative who transformed from being overwhelmed by data
                to becoming the organization's "Data Whisperer." David shows how AI can turn complex
                analytics into clear insights that drive program improvements and funding success.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <div className="text-left">
                  <p className="font-semibold text-blue-700">Key Focus Areas:</p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Data visualization mastery</li>
                    <li>• Finding stories in numbers</li>
                    <li>• Impact measurement</li>
                    <li>• Automated reporting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lesson Navigation */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {davidLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedLesson === lesson.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                    {lesson.icon}
                  </div>
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                  <CardDescription className="text-xs">{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{lesson.duration}</span>
                    {selectedLesson === lesson.id && (
                      <ArrowRight className="w-4 h-4 text-blue-600" />
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
              onClick={() => navigate('/chapter3-demo')}
            >
              Previous Chapter
            </Button>
            <Button 
              onClick={() => navigate('/chapter5-demo')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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

export default Chapter4Demo;