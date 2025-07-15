import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, MessageCircle, Heart, Shield, Brain, Users, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import MayaDifficultConversationsWorkshop from '@/components/interactive/MayaDifficultConversationsWorkshop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const MayaDifficultConversationsLesson: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'story' | 'workshop'>('story');
  const [workshopScore, setWorkshopScore] = useState<number | null>(null);
  const [mayaGrowth, setMayaGrowth] = useState(0);
  
  // PACE Integration: Stress-aware content adaptation
  const conversationChallenges = [
    {
      id: 'anxiety-management',
      title: 'Managing Conversation Anxiety',
      description: 'Tools for staying calm when emotions run high',
      techniques: ['Deep breathing', 'Pause and reflect', 'Reframe the situation'],
      stressLevel: 'high'
    },
    {
      id: 'active-listening',
      title: 'Empathetic Listening Skills',
      description: 'Truly hearing what people are saying and feeling',
      techniques: ['Reflect back', 'Ask clarifying questions', 'Validate emotions'],
      stressLevel: 'medium'
    },
    {
      id: 'solution-finding',
      title: 'Collaborative Problem Solving',
      description: 'Moving from conflict to cooperation',
      techniques: ['Find common ground', 'Brainstorm together', 'Focus on future'],
      stressLevel: 'low'
    }
  ];
  
  useEffect(() => {
    // Simulate Maya's emotional growth
    const timer = setInterval(() => {
      setMayaGrowth(prev => Math.min(prev + 1.5, 100));
    }, 120);
    return () => clearInterval(timer);
  }, []);
  
  const handleWorkshopComplete = (score: number) => {
    setWorkshopScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="helping" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Difficult Conversations Guide</h1>
              <p className="text-lg text-gray-600">Maya's Empathy-Driven Communication</p>
            </div>
          </div>
        </motion.div>

        {currentView === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Maya's Difficult Conversations Story */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  Maya's Empathy Revolution
                </CardTitle>
                <CardDescription>
                  Watch Maya transform her approach to challenging conversations through empathy-driven communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Growth Progress */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <Brain className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Maya's Emotional Growth</p>
                      <Progress value={mayaGrowth} className="mt-2" />
                      <p className="text-sm text-gray-600 mt-1">
                        {mayaGrowth < 30 && "Learning to manage her own emotions first..."}
                        {mayaGrowth >= 30 && mayaGrowth < 70 && "Developing empathy and listening skills..."}
                        {mayaGrowth >= 70 && "Mastering collaborative problem-solving!"}
                      </p>
                    </div>
                  </div>

                  {/* The Crisis Moment */}
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3">The Conversation That Changed Everything</h4>
                    <p className="text-gray-700 mb-3">
                      Maya's biggest test came when an angry parent confronted her at pickup time about new safety procedures. 
                      In front of other parents and children, the situation escalated quickly.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                        <p className="font-medium text-red-700 text-sm mb-2">Maya's First Instinct (What Didn't Work):</p>
                        <ul className="text-xs text-red-600 space-y-1">
                          <li>• Defended the policy immediately</li>
                          <li>• Explained why they were wrong</li>
                          <li>• Felt personally attacked</li>
                          <li>• Made the situation worse</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                        <p className="font-medium text-green-700 text-sm mb-2">Maya's New Approach (What Worked):</p>
                        <ul className="text-xs text-green-600 space-y-1">
                          <li>• Listened to their concerns first</li>
                          <li>• Acknowledged their feelings</li>
                          <li>• Found common ground (child safety)</li>
                          <li>• Collaborated on solutions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-blue-800 text-sm italic">
                        "I realized that difficult conversations aren't about winning or losing - they're about understanding 
                        and finding a path forward together. When I stopped defending and started listening, everything changed."
                      </p>
                      <p className="text-blue-600 text-xs mt-1">- Maya Rodriguez</p>
                    </div>
                  </div>

                  {/* PACE Integration: Stress-Aware Techniques */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Maya's Stress-Aware Communication Toolkit</h4>
                    {conversationChallenges.map((challenge, idx) => (
                      <motion.div 
                        key={challenge.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="p-4 bg-white rounded-lg shadow-sm border"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            challenge.stressLevel === 'high' ? 'bg-red-100' :
                            challenge.stressLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            {challenge.stressLevel === 'high' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                             challenge.stressLevel === 'medium' ? <Target className="w-4 h-4 text-yellow-600" /> :
                             <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-800">{challenge.title}</span>
                              <Badge variant={
                                challenge.stressLevel === 'high' ? 'destructive' :
                                challenge.stressLevel === 'medium' ? 'default' : 'secondary'
                              } className="text-xs">
                                {challenge.stressLevel} stress
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {challenge.techniques.map((technique, techIdx) => (
                                <Badge key={techIdx} variant="outline" className="text-xs">
                                  {technique}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Real Impact */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">The Real Impact</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">89%</p>
                        <p className="text-xs text-gray-600">Conflict resolution success rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">15min</p>
                        <p className="text-xs text-gray-600">Average conversation time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">95%</p>
                        <p className="text-xs text-gray-600">Relationship preservation rate</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => setCurrentView('workshop')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    size="lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Master Empathy-Driven Communication
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
            {/* Interactive Difficult Conversations Workshop */}
            <MayaDifficultConversationsWorkshop onComplete={handleWorkshopComplete} />
            
            {/* Success celebration */}
            {workshopScore && workshopScore >= 80 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <div className="text-center">
                  <Heart className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-xl text-green-800 mb-2">🎉 Empathy Mastery Achieved!</h3>
                  <p className="text-green-700 mb-4">
                    You've mastered Maya's empathy-driven approach to difficult conversations! Score: {workshopScore}/100
                  </p>
                  <Badge className="bg-green-600 text-white">Difficult Conversations Complete</Badge>
                </div>
              </motion.div>
            )}
            
            {/* Navigation */}
            <div className="flex gap-3 justify-center mt-8">
              <Button 
                onClick={() => setCurrentView('story')}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
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
                onClick={() => navigate('/chapter/2/lesson/5/subject-workshop')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Next: Subject Workshop <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MayaDifficultConversationsLesson;