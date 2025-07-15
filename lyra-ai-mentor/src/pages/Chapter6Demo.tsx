import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Users, Rocket, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LyraAvatar } from '@/components/LyraAvatar';
import { AlexChangeStrategy } from '@/components/interactive/AlexChangeStrategy';

/**
 * Chapter 6: Alex's Organizational Transformation Journey
 * Character: Alex Thompson - From Skeptic to AI Champion
 * Focus: Lead AI transformation across your entire organization
 */
const Chapter6Demo: React.FC = () => {
  const navigate = useNavigate();

  const alexLessons = [
    {
      id: 'change-strategy',
      title: 'Change Strategy Builder',
      description: 'Design your organization\'s AI transformation roadmap',
      icon: <Lightbulb className="w-6 h-6" />,
      component: 'change-strategy',
      duration: '20 min'
    },
    {
      id: 'vision-builder',
      title: 'AI Vision Workshop',
      description: 'Create a compelling vision for AI-powered impact',
      icon: <Rocket className="w-6 h-6" />,
      component: 'vision-builder',
      duration: '18 min'
    },
    {
      id: 'roadmap-creator',
      title: 'Implementation Roadmap',
      description: 'Build a practical plan for organizational adoption',
      icon: <Users className="w-6 h-6" />,
      component: 'roadmap-creator',
      duration: '22 min'
    },
    {
      id: 'leadership-framework',
      title: 'AI Leadership Framework',
      description: 'Develop skills to champion AI across your organization',
      icon: <Shield className="w-6 h-6" />,
      component: 'leadership-framework',
      duration: '25 min'
    }
  ];

  const [selectedLesson, setSelectedLesson] = React.useState<string>('change-strategy');

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'change-strategy':
        return <AlexChangeStrategy onComplete={() => console.log('Change Strategy completed')} />;
      default:
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Component Coming Soon</h3>
            <p className="text-gray-600">This lesson is being enhanced with AI-powered features.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="celebrating" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chapter 6: Organizational Transformation</h1>
              <p className="text-lg text-gray-600">Alex's Journey from AI Skeptic to Champion</p>
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-orange-100 to-amber-100">
            <CardHeader>
              <CardTitle>Meet Alex Thompson</CardTitle>
              <CardDescription className="text-base">
                Executive Director at Riverside Arts Collective who transformed from AI skeptic to
                organizational champion. Alex shows how to lead AI adoption that enhances human
                creativity rather than replacing it, resulting in 3x impact growth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <div className="text-left">
                  <p className="font-semibold text-orange-700">Key Focus Areas:</p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Organizational AI strategy</li>
                    <li>• Change management</li>
                    <li>• Team empowerment</li>
                    <li>• Ethical AI leadership</li>
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
                    ? 'border-orange-500 shadow-lg' 
                    : 'hover:border-orange-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                    {lesson.icon}
                  </div>
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                  <CardDescription className="text-xs">{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{lesson.duration}</span>
                    {selectedLesson === lesson.id && (
                      <ArrowRight className="w-4 h-4 text-orange-600" />
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
              onClick={() => navigate('/chapter5-demo')}
            >
              Previous Chapter
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
            >
              Complete Journey
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter6Demo;