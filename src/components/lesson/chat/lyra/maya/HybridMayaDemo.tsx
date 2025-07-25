import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, Users, Heart, Zap, Play, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import ChallengeDefinition from './ChallengeDefinition';
import InteractivePromptBuilder from './InteractivePromptBuilder';

interface UserChallenge {
  description: string;
  type: string;
  audience: string;
  stakes: string;
  timeframe: string;
  context: string;
}

interface PaceFramework {
  purpose: string;
  audience: string;
  connection: string;
  engagement: string;
}

const HybridMayaDemo: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<'intro' | 'challenge' | 'story' | 'builder' | 'iteration' | 'toolkit'>('intro');
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(null);
  const [adaptedStory, setAdaptedStory] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [paceFramework, setPaceFramework] = useState<PaceFramework | null>(null);
  const [coachingFeedback, setCoachingFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChallengeSubmit = async (challenge: UserChallenge) => {
    setUserChallenge(challenge);
    setIsLoading(true);
    
    try {
      // Start AI session
      const { data, error } = await supabase.functions.invoke('maya-ai-mentor', {
        body: {
          action: 'start_session',
          userChallenge: challenge.description,
          userId: 'demo-user' // In real app, get from auth
        }
      });

      if (error) throw error;

      setSessionId(data.sessionId);
      setAdaptedStory(data.adaptedStory);
      setCurrentStage('story');
      
      toast({
        title: "Challenge Defined!",
        description: "Maya's story is being adapted to your situation.",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start your personalized journey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptGenerated = (prompt: string, pace: PaceFramework) => {
    setCurrentPrompt(prompt);
    setPaceFramework(pace);
    setCurrentStage('iteration');
  };

  const handleCoachingRequest = async (prompt: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('maya-ai-mentor', {
        body: {
          action: 'coaching',
          currentPrompt: prompt,
          sessionId: sessionId,
          userId: 'demo-user'
        }
      });

      if (error) throw error;

      setCoachingFeedback(data.coaching);
      
      toast({
        title: "Lyra's Feedback",
        description: "Your AI coach has provided personalized guidance.",
      });
    } catch (error) {
      console.error('Error getting coaching:', error);
      toast({
        title: "Error",
        description: "Failed to get coaching feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Maya's Interactive Prompt Lab</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Experience Maya's transformation through your own communication challenge. 
              Build prompts, get AI coaching, and create your personal toolkit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Your Challenge</h3>
                  </div>
                  <p className="text-sm text-gray-600">Define your real communication challenge</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">AI Coaching</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get personalized feedback from Lyra</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold">PACE Builder</h3>
                  </div>
                  <p className="text-sm text-gray-600">Interactive prompt construction</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold">Personal Toolkit</h3>
                  </div>
                  <p className="text-sm text-gray-600">Custom templates for your success</p>
                </CardContent>
              </Card>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Button 
                onClick={() => setCurrentStage('challenge')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                Start Your Journey <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        );

      case 'challenge':
        return (
          <ChallengeDefinition 
            onChallengeSubmit={handleChallengeSubmit}
          />
        );

      case 'story':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <LyraAvatar size="lg" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Maya's Story - Adapted for You</h2>
              <p className="text-gray-600">
                Maya faces the same challenge you do. Watch her transformation unfold.
              </p>
            </motion.div>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Maya's Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {adaptedStory}
                </p>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Your Challenge:</h4>
                  <p className="text-sm text-gray-700">{userChallenge?.description}</p>
                </div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <Button 
                onClick={() => setCurrentStage('builder')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                Begin Building Your Prompt <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        );

      case 'builder':
        return (
          <InteractivePromptBuilder
            userChallenge={userChallenge?.description || ''}
            onPromptGenerated={handlePromptGenerated}
            onCoachingRequest={handleCoachingRequest}
          />
        );

      case 'iteration':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Prompt is Ready!</h2>
              <p className="text-gray-600">
                Test it, iterate it, and perfect it with Lyra's guidance.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    Your Generated Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {currentPrompt}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      onClick={() => handleCoachingRequest(currentPrompt)}
                      variant="outline"
                      className="text-purple-600 border-purple-300"
                    >
                      Get Lyra's Feedback
                    </Button>
                    <Button 
                      onClick={() => setCurrentStage('toolkit')}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Create My Toolkit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {coachingFeedback && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Lyra's Coaching
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {coachingFeedback}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 'toolkit':
        return (
          <div className="max-w-2xl mx-auto p-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Your Personal Toolkit</h2>
              <p className="text-gray-600 mb-8">
                Congratulations! You've completed Maya's journey and created your personalized prompt engineering toolkit.
              </p>
            </motion.div>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Journey Complete!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">✓</Badge>
                    <span>Challenge defined and personalized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">✓</Badge>
                    <span>PACE framework mastered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">✓</Badge>
                    <span>AI coaching received</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">✓</Badge>
                    <span>Personal toolkit created</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setCurrentStage('intro')}
              className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              Start New Journey
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto py-8">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
            >
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span>Processing your request...</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStage()}
        </motion.div>
      </div>
    </div>
  );
};

export default HybridMayaDemo;