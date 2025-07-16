import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles, Play } from 'lucide-react';

import NarrativeManager from './NarrativeManager';
import InteractionGateway from './InteractionGateway';
import HelpMayaFirstAttempt from './HelpMayaFirstAttempt';
import GuidedPractice from './GuidedPractice';
import MayaSuccessStory from './MayaSuccessStory';


interface PACEFramework {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
}


type JourneyPhase = 
  | 'intro'
  | 'maya-introduction'
  | 'maya-struggle'
  | 'help-maya-first-attempt'
  | 'elena-introduction'
  | 'maya-pace-building'
  | 'maya-success-story'
  | 'personal-toolkit';

const MayaInteractiveJourney: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase>('intro');
  const [mayaFirstAttempt, setMayaFirstAttempt] = useState<string>('');
  const [mayaPaceResult, setMayaPaceResult] = useState<PACEFramework | null>(null);
  const [mayaPrompt, setMayaPrompt] = useState<string>('');

  // Maya's predefined journey data
  const mayaChallenge = "I need to write an email to my manager about missing a critical project deadline";
  
  const mayaFinalPace: PACEFramework = {
    Purpose: "Inform my manager about the delay while maintaining credibility and providing clear next steps",
    Audience: "My direct manager who values transparency and solution-oriented communication",
    Connection: "Acknowledge the impact, show accountability, and demonstrate my commitment to the team",
    Engagement: "Provide specific recovery timeline, concrete actions, and request support if needed"
  };

  const mayaFinalPrompt = `Write a professional email to my manager about missing a project deadline.

Purpose: Inform my manager about the delay while maintaining credibility and providing clear next steps
Audience: My direct manager who values transparency and solution-oriented communication  
Connection: Acknowledge the impact, show accountability, and demonstrate my commitment to the team
Engagement: Provide specific recovery timeline, concrete actions, and request support if needed

Please craft an email that:
1. Clearly states the situation and takes responsibility
2. Addresses the impact on the team and project
3. Shows accountability while maintaining professionalism
4. Includes a specific recovery plan with timelines
5. Requests appropriate support or resources if needed

Keep the tone professional but genuine, and focus on solutions rather than problems.`;

  const narrativeMessages = {
    introduction: [
      {
        id: 'intro-1',
        content: "Hi! I'm Maya, and I want to share something that changed how I communicate forever.",
        emotion: 'hopeful' as const,
        showAvatar: true
      },
      {
        id: 'intro-2',
        content: "Just last month, I was struggling with the same communication challenges you might be facing right now.",
        emotion: 'neutral' as const
      },
      {
        id: 'intro-3',
        content: "But then I discovered something that transformed not just my emails, but my entire approach to AI-powered communication.",
        emotion: 'excited' as const
      }
    ],
    struggle: [
      {
        id: 'struggle-1',
        content: "Picture this: It's 9 PM, and I'm still staring at a blank email. I've been trying to write this message for TWO HOURS.",
        emotion: 'frustrated' as const
      },
      {
        id: 'struggle-2',
        content: "The deadline I missed was embarrassing enough. But trying to explain it to my manager? That felt impossible.",
        emotion: 'worried' as const
      },
      {
        id: 'struggle-3',
        content: "I kept starting over, deleting everything, feeling more anxious with each attempt. Sound familiar?",
        emotion: 'anxious' as const
      }
    ],
    failedAttempt: [
      {
        id: 'failed-1',
        content: "So I tried using AI. I typed: 'Write an email about missing a deadline' and hit enter.",
        emotion: 'hopeful' as const
      },
      {
        id: 'failed-2',
        content: "The result was generic, robotic, and completely wrong for my situation. It made me sound like I didn't care at all.",
        emotion: 'disappointed' as const
      },
      {
        id: 'failed-3',
        content: "That's when I realized: the problem wasn't the AI. It was how I was asking for help.",
        emotion: 'thoughtful' as const
      }
    ],
    elenaIntroduction: [
      {
        id: 'elena-1',
        content: "That's when I met Elena, my AI communication coach. She taught me something called the PACE framework.",
        emotion: 'excited' as const
      },
      {
        id: 'elena-2',
        content: "She explained that great prompts aren't just requests - they're conversations. They need Purpose, Audience, Connection, and Engagement.",
        emotion: 'enlightened' as const
      },
      {
        id: 'elena-3',
        content: "Within 20 minutes of learning PACE, I had created a prompt that generated exactly what I needed.",
        emotion: 'amazed' as const
      }
    ]
  };

  const handleMayaFirstAttempt = (attempt: string) => {
    setMayaFirstAttempt(attempt);
    setCurrentPhase('elena-introduction');
  };

  const handleMayaPaceComplete = (pace: PACEFramework, prompt: string) => {
    setMayaPaceResult(pace);
    setMayaPrompt(prompt);
    setCurrentPhase('maya-success-story');
  };

  const handleMayaSuccessComplete = () => {
    setCurrentPhase('personal-toolkit');
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-8 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Maya's Interactive Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Follow Maya's transformation from communication struggle to prompt engineering mastery - and discover your own path along the way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mb-8">
              {[
                { title: 'Maya\'s Struggle', desc: 'Watch her 2-hour email battle', color: 'from-red-50 to-red-100' },
                { title: 'Help Maya', desc: 'Guide her through AI prompting', color: 'from-blue-50 to-blue-100' },
                { title: 'Learn PACE', desc: 'Master the framework together', color: 'from-green-50 to-green-100' },
                { title: 'Maya\'s Success', desc: 'See her amazing transformation', color: 'from-purple-50 to-purple-100' }
              ].map((item, index) => (
                <Card key={index} className={`bg-gradient-to-br ${item.color} border-0`}>
                  <CardContent className="p-4 text-center">
                    <Badge className="mb-2">{index + 1}</Badge>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button
              onClick={() => setCurrentPhase('maya-introduction')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin Maya's Journey
            </Button>
          </div>
        );

      case 'maya-introduction':
        return (
          <NarrativeManager
            messages={narrativeMessages.introduction}
            onComplete={() => setCurrentPhase('maya-struggle')}
            autoAdvance={false}
          />
        );

      case 'maya-struggle':
        return (
          <NarrativeManager
            messages={narrativeMessages.struggle}
            onComplete={() => setCurrentPhase('help-maya-first-attempt')}
            autoAdvance={false}
          />
        );

      case 'help-maya-first-attempt':
        return (
          <InteractionGateway
            title="Help Maya with Her First Attempt"
            description="Maya is about to try AI for the first time. Let's help her figure out what to ask for."
            stage="practice"
            showEmotionalSupport={true}
            supportMessage="Remember, Maya doesn't know about good prompting yet - she'll try something basic!"
          >
            <HelpMayaFirstAttempt
              onAttemptComplete={handleMayaFirstAttempt}
            />
          </InteractionGateway>
        );

      case 'elena-introduction':
        return (
          <NarrativeManager
            messages={narrativeMessages.elenaIntroduction}
            onComplete={() => setCurrentPhase('maya-pace-building')}
            autoAdvance={false}
          />
        );

      case 'maya-pace-building':
        return (
          <InteractionGateway
            title="Help Maya Build Her PACE Prompt"
            description="Now that you understand the PACE framework, let's help Maya build her solution step by step."
            stage="practice"
          >
            <GuidedPractice
              challenge={mayaChallenge}
              onPracticeComplete={handleMayaPaceComplete}
              showMayaExample={false}
            />
          </InteractionGateway>
        );

      case 'maya-success-story':
        if (!mayaPaceResult || !mayaPrompt) return null;
        return (
          <MayaSuccessStory
            mayaPaceResult={mayaPaceResult}
            mayaPrompt={mayaPrompt}
            onContinue={handleMayaSuccessComplete}
          />
        );

      case 'personal-toolkit':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-4">Your AI Communication Toolkit!</h2>
                <p className="text-xl text-gray-600 mb-8">
                  By helping Maya master the PACE framework, you've learned how to create powerful AI prompts. 
                  Ready to apply this knowledge to your own challenges?
                </p>
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-green-800">What You've Accomplished:</h3>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Followed Maya's journey</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Helped Maya solve her challenge</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Learned the PACE framework</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Witnessed Maya's transformation</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-green-800">Your Toolkit Will Include:</h3>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Custom prompt templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>PACE framework guide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Situation-specific examples</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Advanced techniques</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setCurrentPhase('intro')}
                  variant="outline"
                  size="lg"
                >
                  Experience Again
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Build My Toolkit
                </Button>
              </div>
            </motion.div>
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
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MayaInteractiveJourney;