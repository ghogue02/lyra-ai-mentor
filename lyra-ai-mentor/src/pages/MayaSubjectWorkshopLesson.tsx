import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Zap, Target, TrendingUp, Users, Brain, CheckCircle } from 'lucide-react';
import MayaSubjectLineWorkshop from '@/components/interactive/MayaSubjectLineWorkshop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const MayaSubjectWorkshopLesson: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'story' | 'workshop'>('story');
  const [workshopScore, setWorkshopScore] = useState<number | null>(null);
  const [mayaProgress, setMayaProgress] = useState(0);
  
  // PACE Integration: Subject line scenarios based on audience
  const subjectLineScenarios = [
    {
      id: 'donor-communication',
      audience: 'Major Donors',
      challenge: 'Getting busy donors to open thank you emails',
      beforeExample: 'Thank you for your donation',
      afterExample: 'Your $500 impact: Meet the student you helped graduate',
      improvement: '87% higher open rate with specific impact'
    },
    {
      id: 'volunteer-recruitment',
      audience: 'Potential Volunteers',
      challenge: 'Standing out in crowded inboxes',
      beforeExample: 'Volunteer opportunity available',
      afterExample: 'Just 2 hours: Help transform a child\'s reading confidence',
      improvement: '156% increase in volunteer applications'
    },
    {
      id: 'board-communications',
      audience: 'Board Members',
      challenge: 'Ensuring critical information gets attention',
      beforeExample: 'Board meeting materials attached',
      afterExample: 'Action needed: Q3 budget approval - Review by Friday',
      improvement: '73% faster response times'
    }
  ];
  
  useEffect(() => {
    // Simulate Maya's learning progression
    const timer = setInterval(() => {
      setMayaProgress(prev => Math.min(prev + 2, 100));
    }, 150);
    return () => clearInterval(timer);
  }, []);
  
  const handleWorkshopComplete = (score: number) => {
    setWorkshopScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="celebrating" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subject Line Workshop</h1>
              <p className="text-lg text-gray-600">Maya's Email Opening Mastery</p>
            </div>
          </div>
        </motion.div>

        {currentView === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Maya's Subject Line Story */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-600" />
                  Maya's Subject Line Mastery Journey
                </CardTitle>
                <CardDescription>
                  Watch Maya discover how the right subject line transforms email engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress indicator */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <Brain className="w-8 h-8 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Maya's Learning Progress</p>
                      <Progress value={mayaProgress} className="mt-2" />
                      <p className="text-sm text-gray-600 mt-1">
                        {mayaProgress < 30 && "Discovering the power of subject lines..."}
                        {mayaProgress >= 30 && mayaProgress < 70 && "Learning audience-specific approaches..."}
                        {mayaProgress >= 70 && "Mastering the art of compelling openings!"}
                      </p>
                    </div>
                  </div>
                  
                  {/* The Awakening */}
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3">The Email That Changed Everything</h4>
                    <p className="text-gray-700 mb-3">
                      Maya sent two identical donor thank you emails with different subject lines. 
                      The results shocked her:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                        <p className="font-medium text-red-700 text-sm">Subject: "Thank you for your donation"</p>
                        <p className="text-red-600 text-xs mt-1">Open rate: 23%</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                        <p className="font-medium text-green-700 text-sm">Subject: "Your $250 impact: Meet Sarah, the student you helped"</p>
                        <p className="text-green-600 text-xs mt-1">Open rate: 67%</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 rounded">
                      <p className="text-yellow-800 text-sm italic">
                        "I couldn't believe it. The same message, but nearly 3x more donors actually read it. 
                        That's when I realized: the subject line isn't just the first line - it's the gateway to connection."
                      </p>
                      <p className="text-yellow-600 text-xs mt-1">- Maya Rodriguez</p>
                    </div>
                  </div>
                  
                  {/* PACE Integration: Scenario Examples */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Maya's Audience-Specific Breakthroughs</h4>
                    {subjectLineScenarios.map((scenario, idx) => (
                      <motion.div 
                        key={scenario.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="p-4 bg-white rounded-lg shadow-sm border"
                      >
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-yellow-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-800">{scenario.audience}</span>
                              <Badge variant="secondary" className="text-xs">{scenario.challenge}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-red-600 font-medium">Before:</span>
                                <span className="text-gray-700 ml-2">"{scenario.beforeExample}"</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-green-600 font-medium">After:</span>
                                <span className="text-gray-700 ml-2">"{scenario.afterExample}"</span>
                              </div>
                              <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Result: {scenario.improvement}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => setCurrentView('workshop')}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                    size="lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Master Subject Lines Like Maya
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {currentView === 'workshop' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Interactive Subject Line Workshop */}
            <MayaSubjectLineWorkshop onComplete={handleWorkshopComplete} />
            
            {/* Success celebration */}
            {workshopScore && workshopScore >= 80 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <div className="text-center">
                  <Star className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-xl text-green-800 mb-2">🎉 Subject Line Mastery Achieved!</h3>
                  <p className="text-green-700 mb-4">
                    You've mastered Maya's subject line techniques! Score: {workshopScore}/100
                  </p>
                  <Badge className="bg-green-600 text-white">Chapter 2 Workshop Complete</Badge>
                </div>
              </motion.div>
            )}
            
            {/* Navigation */}
            <div className="flex gap-3 justify-center mt-8">
              <Button 
                onClick={() => setCurrentView('story')}
                variant="outline"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Story
              </Button>
              <Button 
                onClick={() => navigate('/chapter/2/lesson/5')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Chapter Hub
              </Button>
              <Button 
                onClick={() => navigate('/chapter/2/lesson/6')}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              >
                Complete Chapter 2! <Star className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MayaSubjectWorkshopLesson;