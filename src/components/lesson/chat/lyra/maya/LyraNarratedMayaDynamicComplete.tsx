import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Volume2, MessageCircle, Star, FileText, Shield, Menu, X, Eye, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';
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
  
  // Journey state
  const [mayaJourney, setMayaJourney] = useState({
    purpose: '', 
    audience: '', 
    tone: '', 
    generated: '', 
    aiPrompt: ''
  });
  
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

  // Enhanced stages with better Maya story progression
  const stages = [
    {
      id: 'introduction',
      title: 'Meet Maya Rodriguez',
      messages: [
        {
          id: 'intro-1',
          type: 'lyra' as const,
          content: 'Hi there! I\'m Lyra, and I\'d love to introduce you to Maya Rodriguez. 👋',
          delay: 0
        },
        {
          id: 'intro-2', 
          type: 'lyra' as const,
          content: 'Maya coordinates programs at Hope Gardens Community Center, where she juggles emails from worried parents, enthusiastic volunteers, and formal board members. Sound familiar? 😅',
          delay: 1500
        },
        {
          id: 'intro-3', 
          type: 'lyra' as const,
          content: 'Like many of us, Maya used to struggle with email overwhelm. But she discovered something that changed everything: the PACE framework. Let\'s see how it transformed her communication!',
          delay: 1500
        }
      ]
    },
    {
      id: 'maya-challenge',
      title: 'Maya\'s Email Challenge',
      messages: [
        {
          id: 'challenge-1',
          type: 'lyra' as const,
          content: 'Maya\'s story starts on a particularly stressful Monday. Her inbox was overflowing with 47 unread emails, and she had an important message to write to the board about a new literacy program.',
          delay: 0
        },
        {
          id: 'challenge-2',
          type: 'lyra' as const,
          content: 'She stared at a blank email for 20 minutes, typing and deleting, trying to find the right words. "How do I sound professional but passionate? Informative but not boring?" she wondered.',
          delay: 2000
        },
        {
          id: 'challenge-3',
          type: 'lyra' as const,
          content: 'That\'s when Maya remembered the PACE framework her colleague mentioned. **P**urpose → **A**udience → **C**ontext → **E**xecute. Let\'s help Maya use this framework!',
          delay: 2000
        }
      ]
    },
    {
      id: 'pace-workshop',
      title: 'Maya\'s PACE Transformation',
      messages: [
        {
          id: 'workshop-1',
          type: 'lyra' as const,
          content: 'Now it\'s your turn to help Maya! Use the interactive workshop on the right to guide her through the PACE framework.',
          delay: 0
        },
        {
          id: 'workshop-2',
          type: 'lyra' as const,
          content: 'As you work through each step, you\'ll see how Maya transforms from overwhelmed to confident. Each choice you make will help build her perfect email!',
          delay: 1500
        }
      ]
    },
    {
      id: 'completion',
      title: 'Maya\'s Success Story',
      messages: [
        {
          id: 'complete-1',
          type: 'lyra' as const,
          content: '🎉 Amazing! Look how Maya\'s communication has transformed. What used to take her hours now takes minutes, and her emails connect with readers in powerful ways.',
          delay: 0
        },
        {
          id: 'complete-2',
          type: 'lyra' as const,
          content: 'Maya now uses PACE for every important email. Board members tell her how clear her updates are. Parents thank her for making complex information easy to understand.',
          delay: 2000
        },
        {
          id: 'complete-3',
          type: 'lyra' as const,
          content: 'The best part? You can use this same framework! Remember Maya\'s secret: **Purpose** → **Audience** → **Context** → **Execute**. ✨',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
          className="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-colors"
        >
          {isMobilePanelOpen ? <X className="w-6 h-6" /> : <Target className="w-6 h-6" />}
        </button>
      )}

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Left Panel - Story Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 p-6">
            <div className="flex items-center gap-4">
              <LyraAvatar size="sm" expression={lyraExpression} animated />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Maya's Email Mastery Journey</h1>
                <p className="text-gray-600">Learn the PACE Framework through Maya's story</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto relative">
            {/* Fast Forward Button */}
            {canFastForward && !fastForwardMode && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-20 right-6 z-30"
              >
                <Button
                  onClick={handleFastForward}
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm border-purple-300 text-purple-700 hover:bg-purple-50 shadow-lg"
                >
                  <FastForward className="w-4 h-4 mr-2" />
                  Skip Animation
                </Button>
              </motion.div>
            )}

            <div className="max-w-3xl mx-auto space-y-6">
              <motion.div
                key={currentStageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-purple-100"
              >
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-gray-900 mb-6"
                >
                  {currentStage.title}
                </motion.h2>
                
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {currentStage.messages.slice(0, currentMessageIndex + 1).map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ 
                          duration: 0.4,
                          delay: index * 0.1 
                        }}
                        className="flex items-start gap-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <LyraAvatar size="sm" expression="helping" animated />
                        </motion.div>
                        <div className="flex-1">
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 shadow-sm"
                          >
                            {index === currentMessageIndex && !fastForwardMode ? (
                              <TypewriterText
                                text={message.content}
                                speed={30}
                                className="text-gray-800 leading-relaxed"
                                onComplete={() => setIsTyping(null)}
                              />
                            ) : (
                              <p className="text-gray-800 leading-relaxed">{message.content}</p>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Mobile Call-to-Action */}
              {isMobile && currentStageIndex === 1 && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900">Ready to Practice?</h4>
                      <p className="text-sm text-purple-700">Try Maya's interactive email composer</p>
                    </div>
                    <Button
                      onClick={() => setIsMobilePanelOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Workshop
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border-t border-purple-100 p-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <Button
                variant="outline"
                onClick={() => {
                  const newStageIndex = Math.max(0, currentStageIndex - 1);
                  setCurrentStageIndex(newStageIndex);
                  setCurrentMessageIndex(0);
                  setFastForwardMode(false);
                }}
                disabled={currentStageIndex === 0}
              >
                Previous Stage
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer",
                        index === currentStageIndex 
                          ? "bg-purple-600 scale-125 shadow-lg" 
                          : index < currentStageIndex 
                            ? "bg-purple-400 hover:bg-purple-500" 
                            : "bg-gray-300 hover:bg-gray-400"
                      )}
                      onClick={() => {
                        setCurrentStageIndex(index);
                        setCurrentMessageIndex(0);
                        setFastForwardMode(false);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {currentStageIndex + 1} of {stages.length}
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
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next Stage
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Interactive Email Composer */}
        <div className={cn(
          "w-96 bg-white/90 backdrop-blur-sm border-l border-purple-100 p-6 overflow-y-auto",
          isMobile && "fixed inset-y-0 right-0 z-40 transform transition-transform",
          isMobile && !isMobilePanelOpen && "translate-x-full"
        )}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Workshop</h3>
              <MayaEmailComposer
                onComplete={handleEmailComposerComplete}
                lessonContext={lessonContext}
              />
            </div>

            {/* PACE Framework Quick Reference */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">PACE Framework Quick Reference</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-800"><strong>Purpose:</strong> What you want to achieve</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-800"><strong>Audience:</strong> Who you're writing to</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-800"><strong>Context:</strong> Background information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-800"><strong>Execute:</strong> Write with confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyraNarratedMayaDynamicComplete;