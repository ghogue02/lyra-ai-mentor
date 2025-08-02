import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Heart, Lightbulb, Zap, Users, Star, ChevronRight, FastForward, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LyraAvatar } from '@/components/LyraAvatar';
import PromptLearning from './PromptLearning';
import PromptComparison from './PromptComparison';

// ============= HYBRID STORAGE APPROACH =============
// Core storyline hardcoded for consistency, structured for reusability

interface MayaJourneyState {
  purpose: string;
  audience: string;
  tone: string;
  generated: string;
  selectedConsiderations: string[];
  selectedAudience: string;
  finalPrompt: string;
  paceFramework: {
    purpose: string;
    audience: string;
    connection: string;
    engagement: string;
  };
}

interface StoryPhase {
  id: string;
  content: string;
  delay?: number;
}

// ============= MAYA'S STORYLINE MODULES =============
// Character-specific content that flows naturally

const MAYA_CHARACTER = {
  name: "Maya Rodriguez",
  role: "Communications Director",
  organization: "Hope Valley Youth Center",
  challenge: "Board email about summer program success",
  mentor: "Lyra Martinez",
  transformation: "From 3-hour struggle to 20-minute clarity"
};

const MAYA_STORYLINE = {
  problem: "It's 9 PM on a Wednesday. Maya Rodriguez stares at her laptop screen, cursor blinking in an empty email draft. She's been trying to write a board update for two hours. Tomorrow's board meeting could determine next year's funding, and she knows this email needs to be perfect.",
  
  mentorIntroduction: "Maya remembers Lyra Martinez, the communications consultant who visited last month. Lyra had said something that stuck: 'Maya, you're not failing at communication - you're just starting with the wrong question. Instead of asking what to write, ask why it matters to you personally.'",
  
  breakthrough: "Maya takes a deep breath and starts with Lyra's question: 'Why does this matter to me?' Suddenly, she sees Jordan's face - the shy 12-year-old who finally smiled after weeks in their program. That's her why. That's where she needs to start.",
  
  transformation: "Three months later, Maya's emails are getting 3x more responses. Board members ask follow-up questions. Donors schedule meetings. Parents send thank-you notes. Lyra's PACE framework didn't just change Maya's writing - it changed her entire approach to connection."
};

const LyraNarratedMayaDynamicComplete: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping' | 'loading'>('default');
  const [mayaJourney, setMayaJourney] = useState<MayaJourneyState>({
    purpose: '',
    audience: '',
    tone: '',
    generated: '',
    selectedConsiderations: [],
    selectedAudience: '',
    finalPrompt: '',
    paceFramework: {
      purpose: '',
      audience: '',
      connection: '',
      engagement: ''
    }
  });
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Maya's Board Email Scenario - Specific Purpose Options
  const mayaBoardEmailPurposes = [
    {
      id: 'celebrate_success',
      label: 'Celebrate program success',
      description: 'Share the incredible wins from the summer program',
      icon: <Star className="w-5 h-5" />,
      contextHint: 'Perfect for Maya\'s board email about program achievements',
      mayaStory: 'When I saw Jordan finally smile after weeks in our program, I knew we had something special to celebrate with the board.'
    },
    {
      id: 'request_continued_support',
      label: 'Request continued funding',
      description: 'Show the board why this program deserves ongoing investment',
      icon: <Target className="w-5 h-5" />,
      contextHint: 'Ideal for Maya\'s funding conversation with the board',
      mayaStory: 'Numbers tell one story, but real transformation happens in moments like Jordan\'s breakthrough - that\'s what I need to share.'
    },
    {
      id: 'build_board_connection',
      label: 'Strengthen board relationships',
      description: 'Help board members feel personally connected to the impact',
      icon: <Heart className="w-5 h-5" />,
      contextHint: 'Great for Maya\'s relationship-building with board members',
      mayaStory: 'Dr. Williams cares about data, but Sarah joined because of her daughter\'s experience. I need to speak to both hearts.'
    },
    {
      id: 'inspire_future_vision',
      label: 'Inspire future possibilities',
      description: 'Paint a picture of what\'s possible with continued support',
      icon: <Lightbulb className="w-5 h-5" />,
      contextHint: 'Perfect for Maya\'s vision-casting to the board',
      mayaStory: 'If 127 kids can transform in one summer, imagine what we could do with year-round programming. That\'s the vision I need to share.'
    }
  ];

  // Create dynamic stages
  const dynamicStages = [
    // Stage 1: Introduction
    {
      id: 'intro',
      title: 'Meeting Maya Rodriguez',
      component: (
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
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          <h2 className="text-2xl font-semibold mb-4">Maya's Prompt Engineering Journey</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            From basic prompts to PACE mastery<br/>
            <span className="text-purple-600 font-semibold">Learn the method that transforms everything</span>
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 italic mb-4"
          >
            "Bad prompts = Generic results • Good prompts = Genuine connection"
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button 
              onClick={() => setCurrentStageIndex(1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              Begin Your Journey <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'intro-maya-1',
          content: MAYA_STORYLINE.problem,
          delay: 500,
        }
      ]
    },

    // Stage 2: The Problem
    {
      id: 'problem',
      title: 'The Communication Struggle',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center mb-6 shadow-lg"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-4">The Endless Cycle</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sound familiar? You're not alone in this struggle.
          </p>
          <Button 
            onClick={() => setCurrentStageIndex(2)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            Continue <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'problem-1',
          content: MAYA_STORYLINE.mentorIntroduction,
          delay: 500,
        }
      ]
    },

    // Stage 3: Quick Setup for Prompt Demo
    {
      id: 'setup',
      title: 'Maya\'s Board Email Challenge',
      component: (
        <div className="flex flex-col h-full p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Maya's Challenge: Board Email Success
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-3">
              Maya needs to write a board email about her summer program's success. 
              127 kids participated, incredible transformations happened, and funding depends on this email.
            </p>
            <p className="text-sm text-purple-600 font-medium italic">
              Watch how prompt engineering transforms the exact same information into completely different results.
            </p>
          </motion.div>

          {/* Quick Setup */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maya's Context (Pre-filled for demo)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm"><strong>Purpose:</strong> Celebrate success & secure funding</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm"><strong>Audience:</strong> Board members (mixed motivations)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-sm"><strong>Key Info:</strong> 127 kids, Jordan's transformation story</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => {
                setMayaJourney(prev => ({ 
                  ...prev, 
                  purpose: 'celebrate_success',
                  selectedAudience: 'combined_board',
                  selectedConsiderations: ['Impact stories', 'Data & metrics', 'Future vision']
                }));
                setCurrentStageIndex(3);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              See Maya's First Attempt <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'setup-1',
          content: "Maya faces every communicator's nightmare: a blank page, a critical audience, and a ticking clock. She has all the information - 127 kids in the program, incredible success stories like Jordan's transformation, and board members who need to feel confident about continued funding. But how do you turn information into inspiration?",
          delay: 500,
        }
      ]
    },

    // Stage 4: Maya's Failed Prompt Attempt
    {
      id: 'maya-basic-prompt',
      title: 'Maya\'s First Attempt',
      component: (
        <div className="h-full flex flex-col p-6 space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500">
            <h3 className="font-semibold text-red-800 mb-2">Maya's Frustration</h3>
            <p className="text-sm text-red-700">
              "I've been staring at this blank email for two hours. Maybe I'll just ask the AI to write a board email about our summer program success. That should work, right?"
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Maya's Basic Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-mono text-red-800">
                  "Write a board email about summer program"
                </p>
              </div>
              <p className="text-muted-foreground mb-4">
                This is exactly what Maya typed. Simple, direct, but missing so much context...
              </p>
              <Button 
                onClick={() => setCurrentStageIndex(4)}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                See What Happened <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <h4 className="font-semibold text-yellow-800 mb-2">Coming Up Next</h4>
            <p className="text-sm text-yellow-700">
              You'll see exactly what Maya's basic prompt generated, then learn Lyra's PACE method that transforms everything.
            </p>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'maya-basic-1',
          content: "Maya rubs her temples. It's 9 PM and she's been staring at a blank email draft for two hours. Tomorrow's board meeting could determine next year's funding. She decides to try something new - maybe AI can help. 'I'll just ask it to write a board email about our summer program,' she thinks. 'How hard can it be?'",
          delay: 500,
        }
      ]
    },

    // Stage 5: Elena's Prompt Engineering Masterclass
    {
      id: 'elena-masterclass',
      title: 'Elena\'s PACE Method',
      component: (
        <div className="h-full flex flex-col p-6 space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500">
            <h3 className="font-semibold text-purple-800 mb-2">Lyra's Teaching Moment</h3>
            <p className="text-sm text-purple-700">
              "Maya, your basic prompt failed because you gave the AI a destination without a map. 
              Let me show you my PACE method - it's the difference between generic content and genuine connection."
            </p>
          </div>

          <PromptLearning 
            mayaJourney={mayaJourney}
            onContinue={() => setCurrentStageIndex(5)}
          />
        </div>
      ),
      narrativeMessages: [
        {
          id: 'elena-masterclass-1',
          content: "Maya remembers Lyra Martinez, the communications consultant who visited last month. 'Maya,' Lyra had said, 'you're not failing at communication - you're just starting with the wrong question. Instead of asking what to write, ask why it matters to you personally. Then let me teach you the PACE method that transforms everything.'",
          delay: 500,
        }
      ]
    },

    // Stage 6: The Dramatic Transformation
    {
      id: 'prompt-comparison',
      title: 'The Transformation',
      component: (
        <div className="h-full flex flex-col p-6">
          <PromptComparison 
            purpose={mayaJourney.purpose}
            audience={mayaJourney.selectedAudience}
            selectedConsiderations={mayaJourney.selectedConsiderations}
            onCompletion={() => setCurrentStageIndex(6)}
          />
        </div>
      ),
      narrativeMessages: [
        {
          id: 'prompt-comparison-1',
          content: "Maya watches as Lyra demonstrates both approaches side by side. The basic prompt generates generic, uninspiring content. But the PACE method... Maya's eyes widen as she sees the same information transformed into something powerful, personal, and persuasive. 'I can't believe this is the same information,' she whispers.",
          delay: 500,
        }
      ]
    },

    // Stage 7: Final Success
    {
      id: 'completion',
      title: 'Maya\'s Success Story',
      component: (
        <div className="h-full flex flex-col p-6 space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800 mb-2">Maya's Complete Transformation</h3>
            <p className="text-sm text-green-700">
              "Three months later, my emails get 3x more responses. Board members schedule follow-up meetings. 
              Donors want to get involved. Lyra's PACE framework didn't just change my writing—it changed my entire approach to connection."
            </p>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Your Journey Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">Before</div>
                    <div className="text-sm text-gray-600">3 hours per email</div>
                    <div className="text-sm text-gray-600">Generic content</div>
                    <div className="text-sm text-gray-600">Low engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">After</div>
                    <div className="text-sm text-gray-600">20 minutes per email</div>
                    <div className="text-sm text-gray-600">Personal connection</div>
                    <div className="text-sm text-gray-600">3x more responses</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">You've mastered the PACE Framework:</h4>
                  <div className="flex justify-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">Purpose</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Audience</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">Connection</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded">Engagement</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 fill-current" />
              <h4 className="font-semibold">Congratulations!</h4>
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-sm">
              You've transformed from overwhelmed to confident communicator - just like Maya! 
              Every email you write now has the power to create genuine connections.
            </p>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'completion',
          content: MAYA_STORYLINE.transformation,
          delay: 500,
        }
      ]
    }
  ];

  // Current stage and narrative messages
  const currentStage = dynamicStages[currentStageIndex];
  const currentNarrativeMessage = currentStage?.narrativeMessages?.[0];

  // Story phases based on the current narrative message
  const storyPhases: StoryPhase[] = currentNarrativeMessage ? [
    {
      id: currentStage.id,
      content: currentNarrativeMessage.content,
      delay: currentNarrativeMessage.delay || 2000
    }
  ] : [
    {
      id: 'intro',
      content: `Hi there! I'm Maya Rodriguez, a communications strategist who's helped hundreds of professionals transform their email presence. Today, I want to share something personal with you.

Five years ago, I was that person who would stare at a blank email for 20 minutes, second-guessing every word. I'd write, delete, rewrite, and still hit send feeling uncertain. Sound familiar?

The breakthrough came when I realized that great communication isn't about perfect words—it's about understanding your purpose, knowing your audience, and having a clear strategy. That's when I developed what I call the PACE framework.

Let me show you exactly how this works through my own story...`,
      delay: 2000
    }
  ];

  // Initialize with the first stage
  useEffect(() => {
    if (currentStage?.narrativeMessages?.[0]) {
      startTyping(currentStage.narrativeMessages[0].content);
    }
  }, [currentStageIndex]);

  // Typewriter effect
  const startTyping = (text: string) => {
    setDisplayedText('');
    setIsTyping(true);
    setShowSkipButton(true);
    
    let index = 0;
    const typeSpeed = 30; // milliseconds per character
    
    const typeWriter = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        typingRef.current = setTimeout(typeWriter, typeSpeed);
      } else {
        setIsTyping(false);
        setShowSkipButton(false);
      }
    };
    
    typeWriter();
  };

  const skipTyping = () => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    setDisplayedText(currentNarrativeMessage?.content || storyPhases[0].content);
    setIsTyping(false);
    setShowSkipButton(false);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, []);

  const currentPhase = storyPhases[0];
  const totalStages = dynamicStages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex">
      {/* Left Panel - Maya's Story */}
      <div className="lg:w-3/5 flex flex-col">
        <Card className="flex-1 rounded-none border-0 bg-white shadow-xl">
          <CardHeader className="border-b border-border bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LyraAvatar 
                  size="md" 
                  expression={lyraExpression}
                  withWave={false}
                  className="flex-shrink-0 shadow-lg"
                />
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Maya's Dynamic Communication Journey
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete Chapter 2 with Dynamic PACE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-purple-600">
                    {currentStageIndex + 1}/{totalStages}
                  </span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-green-600">0/5 skills</span>
                </div>
                {showSkipButton && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipTyping}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-orange-500 hover:border-orange-600 shadow-lg"
                  >
                    <FastForward className="w-4 h-4 mr-2" />
                    Fast Forward
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          {/* Progress indicator */}
          <div className="px-8 pt-6 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-purple-600">
                🌟 Lyra's Dynamic Journey Guidance
              </span>
              <span className="text-sm text-muted-foreground">
                Meeting Maya Rodriguez
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${((currentStageIndex + 1) / totalStages) * 100}%` }}
              />
            </div>
          </div>
          
          <CardContent className="flex-1 p-8 space-y-6">
            {/* Story Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200 shadow-lg">
                <div className="prose prose-lg max-w-none">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-3 h-6 bg-purple-500 ml-1 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator orientation="vertical" className="h-full" />

      {/* Right Panel - Interactive Workshop */}
      <div className="lg:w-2/5 bg-card border-l border-border flex flex-col">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentStage?.title || 'Interactive Workshop'}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Stage {currentStageIndex + 1} of {totalStages}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-6 overflow-y-auto">
          {currentStage?.component || (
            <div className="text-center text-muted-foreground">
              <p>Workshop will begin soon...</p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default LyraNarratedMayaDynamicComplete;