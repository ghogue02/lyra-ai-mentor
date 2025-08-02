import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles, Play, Heart, Star, Lightbulb, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

import NarrativeManager from './maya/NarrativeManager';
import InteractionGateway from './maya/InteractionGateway';
import LyraCharacter from './maya/MayaCharacter'; // Reuse the character component structure
import GlobalNavigation, { JourneyPhase } from './maya/GlobalNavigation';
import { ChatSystem } from '@/components/chat-system/ChatSystem';
import type { LessonContext } from '@/types/ContextualChat';

// Define Lyra-specific journey phases
type LyraJourneyPhase = 'intro' | 'lyra-introduction' | 'capabilities-demo' | 'first-chat' | 'goal-setting' | 'journey-preview' | 'complete';

const LyraIntroductionJourney: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<LyraJourneyPhase>('intro');
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [narrativePaused, setNarrativePaused] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(true);

  // Create lesson context for the floating chat
  const lessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: "Meet Lyra & AI Foundations",
    phase: currentPhase,
    content: "Introduction to Lyra, your AI learning companion and coach for nonprofit professionals. Learn about AI capabilities, set your learning goals, and begin your transformative journey.",
    chapterTitle: "Lyra's Introduction Journey",
    objectives: [
      "Meet Lyra, your AI learning companion",
      "Understand AI's potential for nonprofit work", 
      "Experience AI-powered conversation",
      "Set personalized learning goals",
      "Preview your learning journey"
    ],
    difficulty: 'beginner',
    estimatedDuration: 15,
    keyTerms: ['AI Assistant', 'Machine Learning', 'Nonprofit Technology', 'AI Ethics']
  };

  // Lyra's introduction narrative messages with chat prompting
  const lyraIntroductionMessages = [
    {
      id: 'lyra-intro-1',
      content: "Hello! I'm Lyra, your AI learning companion and coach. I'm here to guide you through the exciting world of AI in nonprofit work.",
      emotion: 'excited' as const,
      showAvatar: true
    },
    {
      id: 'lyra-intro-2',
      content: "I've been designed specifically to understand the unique challenges nonprofit professionals face every day.",
      emotion: 'thoughtful' as const
    },
    {
      id: 'lyra-intro-3',
      content: "Whether you're writing grant proposals, managing donor communications, or coordinating volunteers, I'm here to help you harness AI's power.",
      emotion: 'excited' as const
    },
    {
      id: 'lyra-intro-4',
      content: "But I'm not just any AI assistant. I'm your learning partner, designed to teach you how to work with AI effectively. Notice the floating avatar in the corner? That's me - ready to chat whenever you have questions!",
      emotion: 'hopeful' as const
    }
  ];

  const lyraCapabilitiesMessages = [
    {
      id: 'capabilities-1',
      content: "Let me show you what makes our partnership special. I can help you with strategic thinking, communication, and problem-solving.",
      emotion: 'excited' as const
    },
    {
      id: 'capabilities-2',
      content: "More importantly, I'll teach you how to prompt AI effectively, so you can achieve amazing results even when I'm not around.",
      emotion: 'thoughtful' as const
    },
    {
      id: 'capabilities-3',
      content: "Think of me as your AI literacy coach. Go ahead, click on my avatar and ask me anything about AI for nonprofits!",
      emotion: 'hopeful' as const
    }
  ];

  const lyraPhilosophyMessages = [
    {
      id: 'philosophy-1',
      content: "My approach is simple: learn by doing. We won't just talk about AI theory - we'll dive into practical applications.",
      emotion: 'excited' as const
    },
    {
      id: 'philosophy-2',
      content: "Throughout our journey, you'll meet other nonprofit professionals like Maya, Sofia, David, Rachel, and Alex. Their stories will guide your learning.",
      emotion: 'thoughtful' as const
    },
    {
      id: 'philosophy-3',
      content: "Each chapter focuses on a different character and their AI transformation. You'll see their struggles, learn their solutions, and apply their insights.",
      emotion: 'amazed' as const
    }
  ];

  const handlePhaseChange = (phase: LyraJourneyPhase) => {
    setCurrentPhase(phase);
    // Show floating chat across all main phases
    if (phase === 'intro' || phase === 'lyra-introduction' || phase === 'capabilities-demo' || phase === 'goal-setting') {
      setShowFloatingChat(true);
    }
  };

  const handleNarrativePause = () => {
    console.log('Narrative paused for chat');
    setNarrativePaused(true);
  };

  const handleNarrativeResume = () => {
    console.log('Narrative resumed from chat');
    setNarrativePaused(false);
  };

  const handleChatEngagement = (isEngaged: boolean, exchangeCount: number) => {
    console.log('Chat engagement:', { isEngaged, exchangeCount, phase: currentPhase });
    
    // Auto-advance after meaningful chat engagement in capabilities phase
    if (currentPhase === 'capabilities-demo' && exchangeCount >= 2) {
      setTimeout(() => {
        setCurrentPhase('goal-setting');
      }, 2000);
    }
  };

  const handleGoalSelection = (goals: string[]) => {
    setUserGoals(goals);
    setCurrentPhase('journey-preview');
  };

  const handleJourneyStart = () => {
    toast({
      title: "Welcome to Your AI Journey! 🎉",
      description: "Let's begin with Maya's story in Chapter 2.",
      variant: "default"
    });
    navigate('/chapter/2/lesson/5');
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-brand-cyan flex items-center justify-center mb-8 shadow-lg overflow-hidden animate-scale-in">
              <VideoAnimation
                src={getAnimationUrl('lyra-brightidea.mp4')}
                fallbackIcon={<Heart className="w-12 h-12 text-white" />}
                className="w-full h-full"
              />
            </div>
            
            <h1 className="text-5xl font-bold mb-6 brand-gradient-text">
              Hello, I'm Lyra!
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl font-medium leading-relaxed">
              Your AI learning companion and coach. Let me introduce myself and show you how we'll transform your nonprofit work together.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mb-8">
              {[
                { title: 'Meet Lyra', desc: 'Get to know your AI coach', color: 'from-primary/10 to-primary/5', icon: Heart, animation: 'lyra-smile-circle-handshake.mp4' },
                { title: 'AI Capabilities', desc: 'Discover what we can achieve', color: 'from-brand-cyan/10 to-brand-cyan/5', icon: Sparkles, animation: 'lyra-brightidea.mp4' },
                { title: 'Your Goals', desc: 'Tell me about your work', color: 'from-emerald-500/10 to-emerald-500/5', icon: Target, animation: 'lyra-lightly-thinking.mp4' },
                { title: 'The Journey', desc: 'Preview your learning path', color: 'from-purple-500/10 to-purple-500/5', icon: Star, animation: 'lyra-celebration.mp4' }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                  <div className="relative premium-card interactive-hover brand-shadow-md">
                    <div className="absolute inset-0 brand-gradient-glow rounded-2xl" />
                    <div className="relative z-10 p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-3">
                        <VideoAnimation
                          src={getAnimationUrl(item.animation)}
                          fallbackIcon={<item.icon className="w-8 h-8 text-primary" />}
                          className="w-full h-full"
                        />
                      </div>
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
                onClick={() => setCurrentPhase('lyra-introduction')}
                size="lg"
                className="relative premium-button-primary text-lg px-8 py-4 font-semibold interactive-hover brand-shadow-md"
              >
                <Play className="w-5 h-5 mr-2" />
                Meet Lyra
              </Button>
            </div>
          </div>
        );

      case 'lyra-introduction':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-brand-cyan/5 to-primary/5 rounded-3xl blur-2xl opacity-80" />
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                <div className="relative z-10 p-8">
                  <NarrativeManager
                    messages={lyraIntroductionMessages}
                    onComplete={() => setCurrentPhase('capabilities-demo')}
                    autoAdvance={false}
                    phaseId="lyra-introduction"
                    onReset={() => setCurrentPhase('intro')}
                    characterName="Lyra"
                    paused={narrativePaused}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'capabilities-demo':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-emerald-500/5 to-brand-cyan/5 rounded-3xl blur-2xl opacity-80" />
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                <div className="relative z-10 p-8">
                  <NarrativeManager
                    messages={lyraCapabilitiesMessages}
                    onComplete={() => setCurrentPhase('first-chat')}
                    autoAdvance={false}
                    phaseId="capabilities-demo"
                    onReset={() => setCurrentPhase('intro')}
                    characterName="Lyra"
                    paused={narrativePaused}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'first-chat':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-emerald-500/5 to-brand-cyan/5 rounded-3xl blur-2xl opacity-80" />
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                <div className="relative z-10 p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">Ready to Chat with Lyra?</h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        Choose a conversation starter below or ask me anything about AI for nonprofits!
                      </p>
                    </div>
                    
                    {/* Embedded Chat Component */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <ChatSystem
                        lessonModule={{
                          chapterNumber: 1,
                          title: "Meet Lyra & AI Foundations",
                          chapterTitle: "Meet Lyra & AI Foundations",
                          phase: "first-chat",
                          content: "Introduction to Lyra and AI fundamentals for nonprofit professionals"
                        }}
                        position="bottom-right"
                        initialExpanded={true}
                        className="!relative !bottom-auto !right-auto !w-full !h-[500px] !max-w-none"
                        onEngagementChange={(isEngaged, messageCount) => {
                          if (isEngaged && messageCount >= 2) {
                            // Auto-advance after meaningful engagement
                            setTimeout(() => setCurrentPhase('goal-setting'), 3000);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'goal-setting':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/5 rounded-3xl blur-2xl opacity-80" />
              <div className="relative premium-card brand-shadow-glow">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                <div className="relative z-10 p-8">
                  <NarrativeManager
                    messages={lyraPhilosophyMessages}
                    onComplete={() => setCurrentPhase('journey-preview')}
                    autoAdvance={false}
                    phaseId="goal-setting"
                    onReset={() => setCurrentPhase('intro')}
                    characterName="Lyra"
                    paused={narrativePaused}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'journey-preview':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="space-y-8 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-brand-cyan rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <VideoAnimation
                  src={getAnimationUrl('lyra-celebration.mp4')}
                  fallbackIcon={<Star className="w-12 h-12 text-white" />}
                  className="w-full h-full"
                  context="celebration"
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Begin Your AI Journey!</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  I'm excited to be your guide as we explore AI's potential for nonprofit work. 
                  Let's start with Maya's story and the PACE framework for effective AI communication.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: "Chapter 2: Maya's Email Challenge", desc: "Learn the PACE framework through Maya's communication breakthrough", icon: "📧" },
                  { title: "Chapter 3: Sofia's Presentation", desc: "Master AI-powered storytelling and presentation creation", icon: "🎯" },
                  { title: "Chapter 4: David's Data Story", desc: "Transform complex data into compelling narratives", icon: "📊" }
                ].map((chapter, index) => (
                  <Card key={index} className="premium-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">{chapter.icon}</div>
                      <h3 className="font-bold mb-2">{chapter.title}</h3>
                      <p className="text-sm text-muted-foreground">{chapter.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-brand-cyan/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                <Button
                  onClick={handleJourneyStart}
                  size="lg"
                  className="relative premium-button-primary text-lg px-8 py-4 font-semibold interactive-hover brand-shadow-md"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin with Maya's Story
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <MicroLessonNavigator
        chapterNumber={1}
        chapterTitle="Lyra's Introduction Journey"
        lessonTitle="Meet Your AI Coach"
        characterName="Lyra"
        progress={currentPhase === 'complete' ? 100 : 50}
        showCelebration={currentPhase === 'complete'}
      />
      <div className="container mx-auto px-4 py-8">
        <GlobalNavigation
          currentPhase={currentPhase as JourneyPhase}
          onPhaseChange={handlePhaseChange as (phase: JourneyPhase) => void}
          onExit={() => navigate('/dashboard')}
          onReset={() => setCurrentPhase('intro')}
        />
        
        <div className="animate-fade-in">
          {renderPhase()}
        </div>
        
        {/* Unified ChatSystem - Single source of truth */}
        {showFloatingChat && (
          <ChatSystem
            lessonModule={{
              chapterNumber: lessonContext.chapterNumber,
              title: lessonContext.lessonTitle,
              phase: lessonContext.phase,
              content: lessonContext.content,
              chapterTitle: lessonContext.chapterTitle,
              objectives: lessonContext.objectives,
              keyTerms: lessonContext.keyTerms,
              difficulty: lessonContext.difficulty
            }}
            position="bottom-right"
            onEngagementChange={handleChatEngagement}
            onNarrativePause={handleNarrativePause}
            onNarrativeResume={handleNarrativeResume}
            className="z-50"
          />
        )}
      </div>
    </div>
  );
};

export default LyraIntroductionJourney;