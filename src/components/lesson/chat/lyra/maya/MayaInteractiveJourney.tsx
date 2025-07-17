import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import NarrativeManager from './NarrativeManager';
import InteractionGateway from './InteractionGateway';
// Removed HelpMayaFirstAttempt - streamlined flow goes directly to PACE framework
import GuidedPractice from './GuidedPractice';
import MayaSuccessStory from './MayaSuccessStory';
import GlobalNavigation, { JourneyPhase } from './GlobalNavigation';


interface PACEFramework {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
}


const MayaInteractiveJourney: React.FC = () => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase>('intro');
  const [mayaPaceResult, setMayaPaceResult] = useState<PACEFramework | null>(null);
  const [mayaPrompt, setMayaPrompt] = useState<string>('');
  const [isStuck, setIsStuck] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Clear any stale state from previous sessions on mount
  React.useEffect(() => {
    const clearStaleState = () => {
      // Clear all Maya journey related sessionStorage
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('narrative-') || key.startsWith('maya-')) {
          sessionStorage.removeItem(key);
        }
      });
    };

    clearStaleState();
    console.log('Fresh Maya journey session started');
  }, []);

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

  // Combined narrative messages for unified experience
  const unifiedNarrativeMessages = [
    // Introduction
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
    },
    // Maya's Struggle
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
    },
    // Failed AI Attempt
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
  ];

  const elenaIntroductionMessages = [
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
  ];

  // Removed redundant first attempt phase - flow goes directly to Elena introduction

  const handleMayaPaceComplete = (pace: PACEFramework, prompt: string) => {
    setMayaPaceResult(pace);
    setMayaPrompt(prompt);
    setCurrentPhase('maya-success-story');
  };

  const handleMayaSuccessComplete = () => {
    setCurrentPhase('personal-toolkit');
  };

  const handlePhaseChange = (phase: JourneyPhase) => {
    console.log('Phase change requested:', phase);
    setCurrentPhase(phase);
    setIsStuck(false);
    
    // Clear session storage for the target phase to ensure clean start
    sessionStorage.removeItem(`narrative-${phase}`);
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const handleGlobalReset = () => {
    console.log('Performing global reset');
    
    // Clear ALL Maya journey related state from sessionStorage
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('narrative-') || key.startsWith('maya-') || key.startsWith('journey-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Reset all component state
    setCurrentPhase('intro');
    setMayaPaceResult(null);
    setMayaPrompt('');
    setIsStuck(false);
    
    // Force a brief loading state to ensure clean reset
    setTimeout(() => {
      console.log('Global reset complete');
    }, 100);
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
            
            <h1 className="text-5xl font-bold mb-6 brand-gradient-text">
              Maya's Interactive Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl font-medium leading-relaxed">
              Follow Maya's transformation from communication struggle to prompt engineering mastery - and discover your own path along the way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8">
              {[
                { title: 'Maya\'s Struggle', desc: 'Experience her communication challenge', color: 'from-primary/10 to-primary/5', icon: '😤' },
                { title: 'Meet Elena', desc: 'Discover the PACE framework', color: 'from-emerald-500/10 to-emerald-500/5', icon: '✨' },
                { title: 'Maya\'s Success', desc: 'Witness her transformation', color: 'from-brand-cyan/10 to-brand-cyan/5', icon: '🚀' }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                  <div className="relative premium-card interactive-hover brand-shadow-md">
                    <div className="absolute inset-0 brand-gradient-glow rounded-2xl" />
                    <div className="relative z-10 p-6 text-center">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <Badge variant="secondary" className="mb-3">{index + 1}</Badge>
                      <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-brand-cyan/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <Button
                onClick={() => setCurrentPhase('maya-introduction')}
                size="lg"
                className="relative premium-button-primary text-lg px-8 py-4 font-semibold interactive-hover brand-shadow-md"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Maya's Journey
              </Button>
            </div>
          </div>
        );

      case 'maya-introduction':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Premium backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-brand-cyan/5 to-primary/5 rounded-3xl blur-2xl opacity-80" />
              
              {/* Main content container */}
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                
                <div className="relative z-10 p-8">
                  <NarrativeManager
                    messages={unifiedNarrativeMessages}
                    onComplete={() => setCurrentPhase('elena-introduction')}
                    autoAdvance={false}
                    phaseId="maya-narrative"
                    onReset={handleGlobalReset}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'elena-introduction':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Premium backdrop with different gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/5 rounded-3xl blur-2xl opacity-80" />
              
              {/* Main content container */}
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                
                <div className="relative z-10 p-8">
                  <NarrativeManager
                    messages={elenaIntroductionMessages}
                    onComplete={() => setCurrentPhase('maya-pace-building')}
                    autoAdvance={false}
                    phaseId="elena-introduction"
                    onReset={handleGlobalReset}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'maya-pace-building':
        return (
          <InteractionGateway
            title="Master the PACE Framework"
            description="Now let's put Elena's teaching into practice. Build Maya's perfect prompt using the PACE framework."
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
    <div className="min-h-screen bg-surface-primary">
      {/* Global Navigation - only show after intro */}
      {currentPhase !== 'intro' && (
        <GlobalNavigation
          currentPhase={currentPhase}
          onPhaseChange={handlePhaseChange}
          onExit={handleExit}
          isStuck={isStuck}
          onReset={handleGlobalReset}
        />
      )}
      
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