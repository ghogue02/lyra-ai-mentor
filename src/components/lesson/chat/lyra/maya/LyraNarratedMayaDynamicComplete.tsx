import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Volume2, MessageCircle, Star, FileText, Shield, Menu, X, Eye, Target, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { InteractiveElementRenderer } from '@/components/lesson/interactive/InteractiveElementRenderer';
import { PromptBuilder } from './PromptBuilder';
import { TypewriterText } from '@/components/lesson/TypewriterText';

/**
 * Enhanced Maya Component with Dynamic PACE Integration
 * Combines lesson narrative structure with dynamic choice generation
 */
const LyraNarratedMayaDynamicComplete: React.FC = () => {
  // Core state management
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping'>('default');
  const [canFastForward, setCanFastForward] = useState(false);
  const [fastForwardMode, setFastForwardMode] = useState(false);
  
  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  
  // Journey state for advanced PACE integration
  const [mayaJourney, setMayaJourney] = useState({
    purpose: '', 
    selectedAudience: null, 
    tone: '', 
    generated: '', 
    aiPrompt: ''
  });
  
  // Dynamic path state for real-time prompt building
  const [dynamicPath, setDynamicPath] = useState(null);
  
  // Interactive element completion state
  const [isElementCompleted, setIsElementCompleted] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced stages with Maya's detailed story progression
  const stages = [
    {
      id: 'introduction',
      title: 'Meet Maya: The Communication Challenge',
      subtitle: 'Phase 1 of 6',
      messages: [
        {
          id: 'intro-1',
          type: 'lyra' as const,
          content: 'Meet Maya Rodriguez, coordinator at Hope Gardens Community Center. Like many mission-driven leaders, Maya\'s inbox is a whirlwind of worried parents, enthusiastic volunteers, and formal board communications.',
          delay: 0
        },
        {
          id: 'intro-2', 
          type: 'lyra' as const,
          content: 'Every email feels critical, but crafting the perfect response often leaves Maya staring at a blank screen for precious minutes she doesn\'t have. Sound familiar?',
          delay: 2000
        },
        {
          id: 'intro-3', 
          type: 'lyra' as const,
          content: 'Today, we\'re going to follow Maya as she discovers the PACE framework - a simple yet powerful method that transforms overwhelming communication into confident, effective emails.',
          delay: 2000
        }
      ]
    },
    {
      id: 'maya-challenge',
      title: 'The Monday Morning Crisis',
      subtitle: 'Phase 2 of 6', 
      messages: [
        {
          id: 'challenge-1',
          type: 'lyra' as const,
          content: 'It\'s 8:47 AM on Monday. Maya opens her laptop to find 47 unread emails and an urgent request from the board chair: "Can you send an update on our new literacy program by noon?"',
          delay: 0
        },
        {
          id: 'challenge-2',
          type: 'lyra' as const,
          content: 'Maya clicks "Compose" and freezes. Should she lead with statistics? Personal stories? Budget details? After 20 minutes of typing and deleting, she realizes she needs a better approach.',
          delay: 2000
        },
        {
          id: 'challenge-3',
          type: 'lyra' as const,
          content: 'That\'s when Maya remembers her colleague mentioning something called the PACE framework. "Four simple steps," she recalls, "**P**urpose → **A**udience → **C**ontent → **E**xecute."',
          delay: 2000
        }
      ]
    },
    {
      id: 'pace-discovery',
      title: 'Maya Discovers PACE',
      subtitle: 'Phase 3 of 6',
      messages: [
        {
          id: 'discovery-1',
          type: 'lyra' as const,
          content: 'Maya opens a fresh email and takes a deep breath. Instead of jumping into writing, she decides to try this PACE framework. First step: **Purpose** - What exactly does she want to achieve?',
          delay: 0
        },
        {
          id: 'discovery-2',
          type: 'lyra' as const,
          content: 'Next comes **Audience** - Who is she really writing to? The board chair, yes, but what does he care about? What keeps him up at night regarding the literacy program?',
          delay: 2000
        },
        {
          id: 'discovery-3',
          type: 'lyra' as const,
          content: 'Now it\'s your turn to help Maya! Use the interactive PACE workshop to guide her through creating her board update. Watch how each decision builds into a powerful email.',
          delay: 2000
        }
      ]
    },
    {
      id: 'pace-practice',
      title: 'Your Turn: Master PACE with Maya',
      subtitle: 'Phase 4 of 6',
      messages: [
        {
          id: 'practice-1',
          type: 'lyra' as const,
          content: 'Time for hands-on practice! In the interactive workshop, you\'ll work through Maya\'s exact scenario. Each PACE step you complete will build Maya\'s confidence and her email.',
          delay: 0
        },
        {
          id: 'practice-2',
          type: 'lyra' as const,
          content: 'Notice how the AI Prompt Builder updates in real-time as you progress. This isn\'t just about Maya\'s email - you\'re learning to create powerful AI prompts for your own communications!',
          delay: 2000
        }
      ]
    },
    {
      id: 'transformation',
      title: 'Maya\'s Email Transformation',
      subtitle: 'Phase 5 of 6',
      messages: [
        {
          id: 'transform-1',
          type: 'lyra' as const,
          content: '🎉 Look at that! Maya\'s board update is clear, compelling, and written with confidence. What used to take her 45 stressful minutes now took just 12 focused minutes.',
          delay: 0
        },
        {
          id: 'transform-2',
          type: 'lyra' as const,
          content: 'The board chair responds within an hour: "Maya, this is exactly what we needed. Clear impact, next steps included, and I can see the passion behind the work. Excellent update!"',
          delay: 2000
        },
        {
          id: 'transform-3',
          type: 'lyra' as const,
          content: 'Maya sits back in her chair, amazed. For the first time in months, writing an important email felt... manageable. Even energizing.',
          delay: 2000
        }
      ]
    },
    {
      id: 'mastery',
      title: 'Your PACE Mastery Journey',
      subtitle: 'Phase 6 of 6',
      messages: [
        {
          id: 'mastery-1',
          type: 'lyra' as const,
          content: 'Six months later, Maya\'s colleagues ask her secret. "How do your emails always hit the right note?" They want to know her framework for turning complex ideas into clear, actionable communications.',
          delay: 0
        },
        {
          id: 'mastery-2',
          type: 'lyra' as const,
          content: 'Maya\'s answer is always the same: "PACE changed everything. **Purpose** grounds me, **Audience** guides me, **Content** structures me, and **Execute** empowers me."',
          delay: 2000
        },
        {
          id: 'mastery-3',
          type: 'lyra' as const,
          content: 'Now you have Maya\'s secret too. The PACE framework isn\'t just for emails - it\'s your blueprint for any communication that matters. Ready to transform your own messaging?',
          delay: 2000
        }
      ]
    }
  ];

  // Handle message progression
  const handleNextMessage = () => {
    const currentStage = stages[currentStageIndex];
    if (currentMessageIndex < currentStage.messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setCurrentMessageIndex(0);
    }
  };

  const handleFastForward = () => {
    setFastForwardMode(true);
    const currentStage = stages[currentStageIndex];
    setCurrentMessageIndex(currentStage.messages.length - 1);
  };

  // Auto-progression for messages
  useEffect(() => {
    if (fastForwardMode) return;
    
    const currentStage = stages[currentStageIndex];
    const currentMessage = currentStage.messages[currentMessageIndex];
    
    if (currentMessage && currentMessageIndex < currentStage.messages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentMessageIndex(currentMessageIndex + 1);
      }, currentMessage.delay + 3000); // Add reading time
      
      return () => clearTimeout(timer);
    }
  }, [currentStageIndex, currentMessageIndex, fastForwardMode, stages]);

  // Enable fast forward after first message
  useEffect(() => {
    setCanFastForward(currentMessageIndex > 0 || currentStageIndex > 0);
  }, [currentStageIndex, currentMessageIndex]);

  // Handle email composer completion
  const handleEmailComposerComplete = () => {
    setIsElementCompleted(true);
    setCurrentStageIndex(2); // Move to completion stage
  };

  // Lesson context for the interactive component
  const lessonContext = {
    chapterTitle: "Maya's Communication Mastery",
    lessonTitle: "PACE Framework Foundation",
    content: "Learn the PACE framework through Maya's story: Purpose → Audience → Context → Execute"
  };

  const currentStage = stages[currentStageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 relative overflow-hidden">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full p-3 shadow-xl transition-all duration-300"
        >
          {isMobilePanelOpen ? <X className="w-6 h-6" /> : <Target className="w-6 h-6" />}
        </motion.button>
      )}

      {/* Main Two-Panel Layout */}
      <div className="flex h-screen">
        {/* Left Panel - Maya's Story with Streaming Text */}
        <div className="flex-1 flex flex-col border-r border-purple-200/60">
          {/* Story Header with Progress */}
          <div className="bg-white/90 backdrop-blur-md border-b border-purple-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LyraAvatar size="md" expression={lyraExpression} animated />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                    Maya's Email Mastery
                  </h1>
                  <p className="text-muted-foreground">Master the PACE Framework through Maya's journey</p>
                </div>
              </div>
              
              {/* Phase Progress Indicator */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
                <span className="text-sm font-medium text-purple-700">
                  {currentStage.subtitle || `Phase ${currentStageIndex + 1} of ${stages.length}`}
                </span>
                <div className="flex gap-1">
                  {stages.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index <= currentStageIndex 
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500" 
                          : "bg-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Maya's Story Area with Streaming Text */}
          <div className="flex-1 p-8 overflow-y-auto relative">
            {/* Skip Animation Button */}
            {canFastForward && !fastForwardMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-6 right-6 z-30"
              >
                <Button
                  onClick={handleFastForward}
                  variant="outline"
                  size="sm"
                  className="bg-white/95 backdrop-blur-md border-purple-300 text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FastForward className="w-4 h-4 mr-2" />
                  Skip Animation
                </Button>
              </motion.div>
            )}

            <div className="max-w-4xl mx-auto space-y-8">
              <motion.div
                key={currentStageIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                {/* Stage Card with Enhanced Design */}
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5" />
                  <CardHeader className="relative bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                          {currentStage.title}
                        </CardTitle>
                        {currentStage.subtitle && (
                          <p className="text-sm text-purple-600 font-medium mt-1">{currentStage.subtitle}</p>
                        )}
                      </div>
                      {currentStageIndex >= 2 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs font-medium text-green-700">Interactive Mode</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative p-8 space-y-8">
                    <AnimatePresence mode="wait">
                      {currentStage.messages.slice(0, currentMessageIndex + 1).map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ 
                            duration: 0.5,
                            delay: index * 0.15,
                            ease: "easeOut"
                          }}
                          className="flex items-start gap-6"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                          >
                            <LyraAvatar size="md" expression="helping" animated />
                          </motion.div>
                          <div className="flex-1">
                            <motion.div
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.15 + 0.4 }}
                              className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-2xl p-6 shadow-md border border-purple-100/50"
                            >
                              <div className="absolute -left-3 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-purple-100" />
                              {index === currentMessageIndex && !fastForwardMode ? (
                                <TypewriterText
                                  text={message.content}
                                  speed={25}
                                  className="text-gray-800 leading-relaxed font-medium"
                                  onComplete={() => setIsTyping(null)}
                                />
                              ) : (
                                <p className="text-gray-800 leading-relaxed font-medium">{message.content}</p>
                              )}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Mobile Call-to-Action for Interactive Phases */}
                {isMobile && currentStageIndex >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-purple-900">Ready to Practice PACE?</h4>
                            <p className="text-sm text-purple-700 mt-1">Help Maya master email communication</p>
                          </div>
                          <Button
                            onClick={() => setIsMobilePanelOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Start Workshop
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
          {/* Navigation Footer */}
          <div className="bg-white/90 backdrop-blur-md border-t border-purple-100 p-6 shadow-sm">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={() => {
                  const newStageIndex = Math.max(0, currentStageIndex - 1);
                  setCurrentStageIndex(newStageIndex);
                  setCurrentMessageIndex(0);
                  setFastForwardMode(false);
                }}
                disabled={currentStageIndex === 0}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Previous Phase
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer relative",
                        index === currentStageIndex 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 scale-125 shadow-lg" 
                          : index < currentStageIndex 
                            ? "bg-gradient-to-r from-purple-400 to-indigo-400 hover:scale-110" 
                            : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                      )}
                      onClick={() => {
                        setCurrentStageIndex(index);
                        setCurrentMessageIndex(0);
                        setFastForwardMode(false);
                      }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {index === currentStageIndex && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-30"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm font-medium text-purple-700 px-3 py-1 bg-purple-100 rounded-full">
                  Phase {currentStageIndex + 1} of {stages.length}
                </span>
              </div>

              <Button
                onClick={() => {
                  const newStageIndex = Math.min(stages.length - 1, currentStageIndex + 1);
                  setCurrentStageIndex(newStageIndex);
                  setCurrentMessageIndex(0);
                  setFastForwardMode(false);
                }}
                disabled={currentStageIndex === stages.length - 1}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              >
                Next Phase
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Split Layout with Interactive Components */}
        <div className={cn(
          "w-1/2 bg-white/95 backdrop-blur-md border-l border-purple-200/60 overflow-hidden flex flex-col",
          isMobile && "fixed inset-y-0 right-0 z-40 transform transition-transform w-full",
          isMobile && !isMobilePanelOpen && "translate-x-full"
        )}>
          {/* Top Section: Interactive PACE Workshop */}
          <div className="flex-1 flex flex-col border-b border-purple-200/60">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Interactive PACE Workshop</h3>
                    <p className="text-sm text-purple-600">Master Maya's communication framework</p>
                  </div>
                </div>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobilePanelOpen(false)}
                    className="text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <InteractiveElementRenderer
                element={{
                  id: 1,
                  type: 'ai_email_composer',
                  title: 'Maya\'s Email Workshop',
                  content: 'Practice the PACE framework with Maya\'s guidance',
                  configuration: {
                    character: 'maya',
                    framework: 'pace',
                    showPromptBuilder: true,
                    storyIntegration: true
                  },
                  order_index: 1,
                  is_visible: true,
                  is_active: true,
                  is_gated: false
                }}
                lessonContext={lessonContext}
                isElementCompleted={isElementCompleted}
                onComplete={async () => {
                  handleEmailComposerComplete();
                  setMayaJourney(prev => ({
                    ...prev,
                    purpose: 'completed'
                  }));
                }}
              />
            </div>
          </div>

          {/* Bottom Section: Enhanced AI Prompt Builder */}
          <div className="h-80 flex flex-col">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-purple-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Prompt Builder</h3>
                  <p className="text-sm text-indigo-600">Watch your PACE framework build powerful prompts</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <PromptBuilder
                mayaJourney={mayaJourney}
                dynamicPath={dynamicPath}
                currentStageIndex={currentStageIndex}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyraNarratedMayaDynamicComplete;