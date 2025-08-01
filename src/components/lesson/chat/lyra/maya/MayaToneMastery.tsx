import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles, Play, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ToolkitService } from '@/services/toolkitService';
import { useToast } from '@/hooks/use-toast';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

import NarrativeManager from './NarrativeManager';
import InteractionGateway from './InteractionGateway';
import ToneGuidedPractice from './ToneGuidedPractice';
import MayaToneSuccessStory from './MayaToneSuccessStory';
import GlobalNavigation, { JourneyPhase } from './GlobalNavigation';

interface ToneAdaptedPACE {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
  tone: 'professional' | 'empathetic' | 'reassuring';
  audienceType: 'board' | 'staff' | 'community';
}

interface MultiAudienceToneResult {
  board: ToneAdaptedPACE;
  staff: ToneAdaptedPACE;
  community: ToneAdaptedPACE;
  prompts: {
    board: string;
    staff: string;
    community: string;
  };
}

type ToneMasteryPhase = 'intro' | 'maya-tone-challenge' | 'elena-tone-guidance' | 'tone-practice' | 'maya-tone-success' | 'personal-toolkit';

const MayaToneMastery: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<ToneMasteryPhase>('intro');
  const [toneResult, setToneResult] = useState<MultiAudienceToneResult | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [isUnlockingToolkit, setIsUnlockingToolkit] = useState(false);

  // Clear any stale state from previous sessions on mount
  React.useEffect(() => {
    const clearStaleState = () => {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('tone-narrative-') || key.startsWith('maya-tone-')) {
          sessionStorage.removeItem(key);
        }
      });
    };

    clearStaleState();
    console.log('Fresh Maya Tone Mastery session started');
  }, []);

  // Maya's tone challenge scenario
  const mayaToneChallenge = "Hope Gardens Community Center is facing budget cuts that will affect several programs. I need to communicate this to three different audiences with completely different communication styles and emotional needs.";

  // Maya's narrative messages
  const mayaToneChallengeMessages = [
    {
      id: 'tone-challenge-1',
      content: "Remember when I mastered the PACE framework? I thought I had communication figured out!",
      emotion: 'hopeful' as const,
      showAvatar: true
    },
    {
      id: 'tone-challenge-2', 
      content: "But then I faced a new challenge: I needed to share difficult news about budget cuts affecting our programs.",
      emotion: 'worried' as const
    },
    {
      id: 'tone-challenge-3',
      content: "The same message needed to go to our board members, my staff team, AND our community members.",
      emotion: 'anxious' as const
    },
    {
      id: 'tone-challenge-4',
      content: "I used my PACE framework and created what I thought was the perfect message... but something was wrong.",
      emotion: 'disappointed' as const
    },
    {
      id: 'tone-challenge-5',
      content: "The board thought I wasn't serious enough. My staff felt I was too cold. The community seemed scared.",
      emotion: 'frustrated' as const
    },
    {
      id: 'tone-challenge-6',
      content: "That's when I realized: the same words can create completely different reactions depending on your TONE.",
      emotion: 'thoughtful' as const
    }
  ];

  const elenaToneGuidanceMessages = [
    {
      id: 'elena-tone-1',
      content: "Lyra helped me understand that tone isn't just HOW you say something - it's the bridge between your message and your audience's heart.",
      emotion: 'enlightened' as const
    },
    {
      id: 'elena-tone-2',
      content: "She showed me how to adapt the PACE framework for different tones while keeping the same core message.",
      emotion: 'excited' as const
    },
    {
      id: 'elena-tone-3',
      content: "Board members need professional, data-driven language. Staff need empathetic, supportive tone. Community needs reassuring, hopeful words.",
      emotion: 'thoughtful' as const
    },
    {
      id: 'elena-tone-4',
      content: "The magic isn't changing WHAT you say - it's adapting HOW you say it for each audience's emotional needs.",
      emotion: 'amazed' as const
    }
  ];

  const handleTonePracticeComplete = (result: MultiAudienceToneResult) => {
    setToneResult(result);
    setCurrentPhase('maya-tone-success');
  };

  const handleToneSuccessComplete = () => {
    setCurrentPhase('personal-toolkit');
  };

  const handlePhaseChange = (phase: ToneMasteryPhase) => {
    console.log('Tone phase change requested:', phase);
    setCurrentPhase(phase);
    
    // Clear session storage for the target phase to ensure clean start
    sessionStorage.removeItem(`tone-narrative-${phase}`);
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const handleGlobalReset = () => {
    console.log('Performing tone mastery global reset');
    
    // Clear ALL tone journey related state from sessionStorage
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('tone-narrative-') || key.startsWith('maya-tone-') || key.startsWith('tone-journey-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Reset all component state
    setCurrentPhase('intro');
    setToneResult(null);
    
    // Force a brief loading state to ensure clean reset
    setTimeout(() => {
      console.log('Tone mastery global reset complete');
    }, 100);
  };

  const handleBuildToolkit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to unlock your toolkit items.",
        variant: "default"
      });
      return;
    }

    try {
      setIsUnlockingToolkit(true);
      
      // Unlock journey-specific toolkit items with user's tone mastery result
      await ToolkitService.unlockJourneyRewards(
        user.id, 
        'maya-tone-mastery',
        {
          toneResults: toneResult,
          completedAt: new Date().toISOString(),
          audiencesCompleted: ['board', 'staff', 'community']
        }
      );

      toast({
        title: "Tone Toolkit Unlocked! 🎉",
        description: "Your tone mastery templates and multi-audience guides have been added to your toolkit.",
        variant: "default"
      });

      // Navigate to toolkit to show the unlocked items
      navigate('/toolkit');
    } catch (error) {
      console.error('Error unlocking tone toolkit:', error);
      toast({
        title: "Error",
        description: "Failed to unlock toolkit items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUnlockingToolkit(false);
    }
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
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mb-8 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Volume2 className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            
            <h1 className="text-5xl font-bold mb-6 brand-gradient-text">
              Maya's Tone Mastery Workshop
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl font-medium leading-relaxed">
              Join Maya as she discovers how to adapt her communication tone for different audiences - the missing piece that transforms good messages into powerful connections.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8">
              {[
                { title: 'Tone Dilemma', desc: 'Same message, wrong reactions', color: 'from-pink-500/10 to-pink-500/5', icon: '😤' },
                { title: 'Lyra\'s Guidance', desc: 'Discover tone adaptation secrets', color: 'from-emerald-500/10 to-emerald-500/5', icon: '🎯' },
                { title: 'Multi-Audience Success', desc: 'Master tone for any audience', color: 'from-brand-cyan/10 to-brand-cyan/5', icon: '🚀' }
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
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <Button
                onClick={() => setCurrentPhase('maya-tone-challenge')}
                size="lg"
                className="relative premium-button-primary text-lg px-8 py-4 font-semibold interactive-hover brand-shadow-md"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Tone Mastery Journey
              </Button>
            </div>
          </div>
        );

      case 'maya-tone-challenge':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Premium backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-80" />
              
              {/* Main content container */}
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                
                <div className="relative z-10 p-8">
                  <NarrativeManager
                    messages={mayaToneChallengeMessages}
                    onComplete={() => setCurrentPhase('elena-tone-guidance')}
                    autoAdvance={false}
                    phaseId="maya-tone-challenge"
                    onReset={handleGlobalReset}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'elena-tone-guidance':
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
                    messages={elenaToneGuidanceMessages}
                    onComplete={() => setCurrentPhase('tone-practice')}
                    autoAdvance={false}
                    phaseId="elena-tone-guidance"
                    onReset={handleGlobalReset}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'tone-practice':
        return (
          <InteractionGateway
            title="Master Multi-Audience Tone Adaptation"
            description="Help Maya craft the same message with three different tones for her diverse audiences."
            stage="practice"
            showHeader={false}
          >
            <ToneGuidedPractice
              challenge={mayaToneChallenge}
              onPracticeComplete={handleTonePracticeComplete}
            />
          </InteractionGateway>
        );

      case 'maya-tone-success':
        if (!toneResult) return null;
        return (
          <MayaToneSuccessStory
            toneResult={toneResult}
            onContinue={handleToneSuccessComplete}
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
                <h2 className="text-3xl font-bold mb-4">Tone Mastery Achieved!</h2>
                <p className="text-xl text-gray-600 mb-8">
                  You've helped Maya master tone adaptation! Now you can communicate the same message effectively to any audience by adjusting your tone while maintaining your core purpose.
                </p>
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-green-800">Tone Skills Mastered:</h3>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Professional tone for executives</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Empathetic tone for teams</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Reassuring tone for communities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Tone-adapted PACE framework</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-green-800">Your Advanced Toolkit:</h3>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Multi-audience templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Tone adaptation guide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Emotional connection strategies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-green-600" />
                          <span>Audience-specific examples</span>
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
                  onClick={handleBuildToolkit}
                  disabled={isUnlockingToolkit}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isUnlockingToolkit ? 'Unlocking...' : 'Build My Toolkit'}
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
      <MicroLessonNavigator
        chapterNumber={2}
        chapterTitle="Maya's Tone Mastery Workshop"
        lessonTitle="Multi-Audience Communication"
        characterName="Maya"
        progress={currentPhase === 'personal-toolkit' ? 100 : 50}
        showCelebration={currentPhase === 'personal-toolkit'}
      />
      {/* Fixed Global Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/95 backdrop-blur-sm border-b border-border">
        <GlobalNavigation
          currentPhase={currentPhase as any}
          onPhaseChange={handlePhaseChange as any}
          onExit={handleExit}
          onReset={handleGlobalReset}
        />
      </div>

      {/* Main Content with top padding for fixed nav */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MayaToneMastery;