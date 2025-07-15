import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Volume2, MessageCircle, Star, FileText, Shield, Menu, X, Eye, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AIEmailComposerRenderer } from '@/components/lesson/interactive/AIEmailComposerRenderer';

/**
 * Enhanced Maya Component with Dynamic PACE Integration
 * Combines lesson narrative structure with dynamic choice generation
 */
const LyraNarratedMayaDynamicComplete: React.FC = () => {
  // Core state management
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping'>('default');
  
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

  // Sample stages for demonstration
  const stages = [
    {
      id: 'introduction',
      title: 'Welcome to Maya\'s Journey',
      messages: [
        {
          id: 'intro-1',
          type: 'lyra' as const,
          content: 'Hi there! I\'m Lyra, your AI mentor. Today we\'re going to follow Maya Rodriguez, a program coordinator at Hope Gardens Community Center, as she transforms her email communication skills.',
          delay: 0
        },
        {
          id: 'intro-2', 
          type: 'lyra' as const,
          content: 'Maya has been struggling with email overwhelm and wants to communicate more effectively with her diverse stakeholders. Let\'s see how she uses the PACE framework to master her communication.',
          delay: 2000
        }
      ]
    },
    {
      id: 'pace-framework',
      title: 'The PACE Framework',
      messages: [
        {
          id: 'pace-1',
          type: 'lyra' as const,
          content: 'The PACE framework stands for: **Purpose** → **Audience** → **Context** → **Execute**. This systematic approach helps Maya craft emails that are clear, targeted, and effective.',
          delay: 0
        },
        {
          id: 'pace-2',
          type: 'lyra' as const,
          content: 'Let\'s watch Maya apply this framework to a real scenario. She needs to write an email to her board members about a new community program.',
          delay: 2000
        },
        {
          id: 'pace-3',
          type: 'lyra' as const,
          content: 'Use the interactive email composer on the right to help Maya craft her message. Start by describing the email situation Maya needs to address.',
          delay: 4000
        }
      ]
    },
    {
      id: 'completion',
      title: 'Maya\'s Success',
      messages: [
        {
          id: 'complete-1',
          type: 'lyra' as const,
          content: 'Excellent! Maya has successfully transformed her email communication using the PACE framework. She now writes with clarity, confidence, and purpose.',
          delay: 0
        },
        {
          id: 'complete-2',
          type: 'lyra' as const,
          content: 'You can apply the same framework to your own communication challenges. Remember: Purpose → Audience → Context → Execute.',
          delay: 2000
        }
      ]
    }
  ];

  // Configuration for the interactive email composer
  const emailComposerElement = {
    id: 1,
    title: "Maya's Email Mastery Workshop",
    content: "Help Maya craft professional emails using the PACE framework",
    configuration: {
      character: "Maya Rodriguez",
      phases: [
        {
          title: "Context & Purpose",
          description: "Describe the email situation Maya needs to address",
          duration: "5 minutes"
        },
        {
          title: "Audience Analysis", 
          description: "Identify who Maya is writing to and what they need",
          duration: "3 minutes"
        },
        {
          title: "Execution",
          description: "Review and refine Maya's AI-generated email",
          duration: "7 minutes"
        }
      ],
      timeSavings: {
        before: "45 min",
        after: "12 min",
        metric: "73% time saved"
      }
    }
  };

  const handleEmailComposerComplete = async () => {
    setIsElementCompleted(true);
    setCurrentStageIndex(2); // Move to completion stage
  };

  const currentStage = stages[currentStageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
          className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg"
        >
          {isMobilePanelOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentStage.title}</h2>
                <div className="space-y-4">
                  {currentStage.messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-4">
                      <LyraAvatar size="sm" expression="helping" />
                      <div className="flex-1">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="text-gray-800 leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white/80 backdrop-blur-sm border-t border-purple-100 p-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <Button
                variant="outline"
                onClick={() => setCurrentStageIndex(Math.max(0, currentStageIndex - 1))}
                disabled={currentStageIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {stages.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index === currentStageIndex ? "bg-purple-600" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              <Button
                onClick={() => setCurrentStageIndex(Math.min(stages.length - 1, currentStageIndex + 1))}
                disabled={currentStageIndex === stages.length - 1}
              >
                Next
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
              <AIEmailComposerRenderer
                element={emailComposerElement}
                isElementCompleted={isElementCompleted}
                onComplete={handleEmailComposerComplete}
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