import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Play, 
  BookOpen, 
  BarChart3,
  Sparkles,
  ChevronRight,
  Users,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TutorialList } from '@/components/tutorial/TutorialList';
import { TutorialDashboard } from '@/components/tutorial/TutorialDashboard';
import { useTutorial } from '@/contexts/TutorialContext';

const TutorialShowcase: React.FC = () => {
  const { startTutorial } = useTutorial();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Interactive Spotlights',
      description: 'Highlights specific UI elements with smooth animations and contextual guidance',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Step-by-Step Guidance',
      description: 'Clear instructions with next/previous navigation and progress tracking',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Character-Specific Tutorials',
      description: 'Tailored tutorials for each AI assistant matching their expertise',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Progress Analytics',
      description: 'Track completion rates, time spent, and engagement metrics',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const demoTutorials = [
    {
      character: 'Maya',
      title: 'Email Composer Tutorial',
      description: 'Learn to craft effective emails with AI assistance',
      tutorialId: 'maya-email-composer',
      gradient: 'from-purple-600 to-indigo-600',
    },
    {
      character: 'Sofia',
      title: 'Voice Discovery Tutorial',
      description: 'Find your authentic communication style',
      tutorialId: 'sofia-voice-discovery',
      gradient: 'from-pink-600 to-rose-600',
    },
    {
      character: 'David',
      title: 'Data Story Finder Tutorial',
      description: 'Transform data into compelling narratives',
      tutorialId: 'david-data-story-finder',
      gradient: 'from-blue-600 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Interactive Tutorial System
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Guided learning experiences with spotlight effects, progress tracking, and character-specific content
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setActiveTab('tutorials')}
              >
                <Play className="w-5 h-5 mr-2" />
                Browse Tutorials
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-purple-700"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Tutorial System Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className={`${feature.color} mb-4`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Tutorials */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Try a Demo Tutorial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {demoTutorials.map((demo, index) => (
              <motion.div
                key={demo.tutorialId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all cursor-pointer group">
                  <div className={`h-2 bg-gradient-to-r ${demo.gradient}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {demo.character}
                      </span>
                      <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                    </div>
                    <CardTitle className="text-lg">
                      {demo.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {demo.description}
                    </p>
                    <Button
                      onClick={() => startTutorial(demo.tutorialId)}
                      className="w-full group-hover:shadow-md transition-all"
                      variant="outline"
                    >
                      Start Tutorial
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tutorials">All Tutorials</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">1. Choose a Tutorial</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Browse our library of character-specific tutorials. Each one is designed to teach you how to use a specific AI tool effectively.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">2. Follow the Spotlight</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      The tutorial system highlights exactly what you need to focus on with smooth spotlight effects and dim overlays.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">3. Learn at Your Pace</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Navigate forward and backward through steps, skip tutorials if needed, or take actions directly from the tutorial interface.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">4. Track Your Progress</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your progress is automatically saved. Come back anytime to continue where you left off or review completed tutorials.
                    </p>
                  </div>
                  <div className="pt-6">
                    <Button
                      onClick={() => setActiveTab('tutorials')}
                      size="lg"
                      className="w-full"
                    >
                      Get Started with Tutorials
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutorials">
              <TutorialList />
            </TabsContent>

            <TabsContent value="analytics">
              <TutorialDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default TutorialShowcase;