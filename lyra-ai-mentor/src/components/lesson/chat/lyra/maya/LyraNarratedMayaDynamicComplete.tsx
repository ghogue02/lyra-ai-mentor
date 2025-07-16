import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Volume2, MessageCircle, Star, FileText, Shield, Menu, X, Eye, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';
import { TypewriterText } from '@/components/lesson/TypewriterText';
import '@/styles/minimal-ui.css';
import '@/styles/accessibility.css';
import '@/styles/maya-journey-layout.css';

// Local imports
import { type MayaJourneyState, type LyraNarrativeMessage, type PersonalizationProfile } from './types';
import { createDynamicMayaStages } from './dynamicStages';
import { getMessageStyles, getTextStyles, getCursorStyles } from './helpers';
import { useTypewriter, useMessageProcessor, useFastForward, useMobileDetection } from './hooks';
import { HeaderIntegratedProgress } from './ProgressAlternatives';
import { PromptBuilder } from './PromptBuilder';
// Animation imports removed - keeping pure storytelling focus

// Dynamic PACE imports
import { dynamicChoiceService, type UserContext } from '@/services/dynamicChoiceService';
import { type ChoicePath, type PurposeType } from '@/types/dynamicPace';

/**
 * Enhanced Maya Component with Dynamic PACE Integration
 * Combines lesson narrative structure with dynamic choice generation
 */
const LyraNarratedMayaDynamicComplete: React.FC = () => {
  // Core state management
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<LyraNarrativeMessage[]>([]);
  const [typedContent, setTypedContent] = useState<{[key: string]: string}>({});
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [panelBlurLevel, setPanelBlurLevel] = useState<'full' | 'partial' | 'clear'>('clear');
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping'>('default');
  
  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  
  // Journey state with dynamic fields
  const [mayaJourney, setMayaJourney] = useState<MayaJourneyState>({
    purpose: '', audience: '', tone: '', generated: '', aiPrompt: '',
    audienceContext: '', situationDetails: '', finalPrompt: '', selectedConsiderations: [],
    selectedAudience: '', adaptedTone: '', toneConfidence: 0,
    templateCategory: '', customTemplate: '', savedTemplates: [],
    conversationScenario: '', empathyResponse: '', resolutionStrategy: '',
    subjectStrategy: '', testedSubjects: [], finalSubject: ''
  });
  
  // Dynamic PACE state
  const [dynamicPath, setDynamicPath] = useState<ChoicePath | null>(null);
  const [availablePaths, setAvailablePaths] = useState<ChoicePath[]>([]);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);
  
  // Track narrative completion state
  const [isNarrativeComplete, setIsNarrativeComplete] = useState(false);
  
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResults, setAIResults] = useState<{[key: string]: any}>({});
  
  // Animation state removed - focusing on storytelling
  
  // User context
  const { user } = useAuth();
  
  // Custom hooks
  const { checkMobile } = useMobileDetection();
  const { typeMessage, clearTypewriter } = useTypewriter();
  const { processMessages, clearMessages, initializeProcessing, isInitializedRef } = useMessageProcessor();
  const { fastForward } = useFastForward();
  
  // Refs
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(checkMobile());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkMobile]);
  
  // Animation preloading removed - pure storytelling focus

  // Enhanced user profile for AI personalization
  const userProfile: PersonalizationProfile = {
    userId: user?.id || 'anonymous',
    organizationType: 'medium_nonprofit',
    roleFocus: 'communications',
    preferredComplexity: 'moderate',
    timeConstraints: 'moderate',
    priorAIExperience: 'basic',
    learningGoals: ['communication_mastery', 'ai_efficiency', 'nonprofit_impact'],
    contextualPreferences: {
      exampleTypes: ['nonprofit_scenarios', 'community_examples'],
      scenarioPreferences: ['real_situations', 'step_by_step_guidance'],
      communicationStyle: 'warm_professional'
    }
  };

  // Create dynamic user context for choice generation
  const createUserContext = (): UserContext => ({
    userId: user?.id || 'anonymous',
    currentSkillLevel: 'intermediate',
    timeAvailable: 20,
    stressLevel: 5,
    confidenceLevel: 6,
    preferredCommunicationStyle: 'warm_personal',
    pastPerformance: [],
    currentGoals: ['improve_email_communication', 'save_time', 'build_relationships'],
    activeConstraints: ['time_limited', 'nonprofit_context'],
    learningPreferences: [
      { aspect: 'format', preference: 'step_by_step', strength: 0.8, adaptability: 0.6 },
      { aspect: 'examples', preference: 'real_world', strength: 0.9, adaptability: 0.7 }
    ]
  });

  // Generate dynamic path when purpose is selected
  const generateDynamicPath = async (purpose: PurposeType) => {
    setIsLoadingDynamic(true);
    try {
      const userContext = createUserContext();
      const path = await dynamicChoiceService.generateDynamicPath({
        purpose,
        context: userContext,
        constraints: {
          maxTime: 20,
          difficultyLevel: 'medium',
          requiredFeatures: ['nonprofit_examples', 'maya_narrative']
        }
      });
      
      setDynamicPath(path);
      
      // Update Maya journey with dynamic values
      setMayaJourney(prev => ({
        ...prev,
        purpose,
        audience: path.audience.label,
        audienceContext: path.audience.contextualDescription,
        tone: path.content.framework.toneGuidelines[0]?.tone || 'warm_professional'
      }));
      
      return path;
    } catch (error) {
      console.error('Error generating dynamic path:', error);
    } finally {
      setIsLoadingDynamic(false);
    }
  };

  // Create stages with dynamic integration
  const stages = React.useMemo(() => createDynamicMayaStages({
    panelBlurLevel: () => panelBlurLevel,
    mayaJourney,
    setMayaJourney,
    setCurrentStageIndex,
    setLyraExpression,
    user,
    setIsGeneratingAI,
    isGeneratingAI,
    aiResults,
    setAIResults,
    generateDynamicPath,
    dynamicPath,
    isLoadingDynamic,
    userProfile
  }), [mayaJourney, user, aiResults, dynamicPath, isLoadingDynamic, panelBlurLevel, isGeneratingAI]);

  // Animation handling removed - pure storytelling focus

  // Enhanced typewriter for storytelling
  const typeMessageWithDeps = React.useCallback((message: LyraNarrativeMessage, onComplete?: () => void) => {
    // Animation triggers removed - focusing on narrative
    
    typeMessage(message, 'intermediate', setIsTyping, setTypedContent, () => {}, onComplete);
  }, [typeMessage]);

  // Process messages with dependencies
  const processMessagesWithDeps = React.useCallback((messages: LyraNarrativeMessage[], index: number = 0, onNarrativeComplete?: () => void) => {
    processMessages(messages, typeMessageWithDeps, setVisibleMessages, index, onNarrativeComplete);
  }, [processMessages, typeMessageWithDeps]);

  // Load messages and manage state
  useEffect(() => {
    isInitializedRef.current = false;
    clearMessages();
    clearTypewriter();
    
    setVisibleMessages([]);
    setTypedContent({});
    setIsTyping(null);
    setIsNarrativeComplete(false);
    
    const stage = stages[currentStageIndex];
    if (!stage) return;
    
    const timeoutId = setTimeout(() => {
      initializeProcessing();
      if (stage.narrativeMessages && stage.narrativeMessages.length > 0) {
        processMessagesWithDeps(stage.narrativeMessages, 0, () => {
          console.log('🎯 Dynamic PACE: Narrative complete, enabling dynamic choices');
          setIsNarrativeComplete(true);
          setLyraExpression('helping');
        });
      } else {
        setIsNarrativeComplete(true);
      }
    }, 300);
    
    return () => {
      clearTimeout(timeoutId);
      clearMessages();
      clearTypewriter();
    };
  }, [currentStageIndex, stages, clearMessages, clearTypewriter, initializeProcessing, processMessagesWithDeps]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current && visibleMessages.length > 0) {
      const scrollToBottom = () => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      };
      requestAnimationFrame(scrollToBottom);
    }
  }, [visibleMessages.length, Object.keys(typedContent).length]);

  // Fast-forward function with dependencies
  const fastForwardStage = React.useCallback(() => {
    fastForward(
      stages, currentStageIndex, 'intermediate', setIsFastForwarding,
      setVisibleMessages, setTypedContent, setIsTyping, () => {},
      clearMessages, clearTypewriter
    );
    setIsNarrativeComplete(true);
    setLyraExpression('helping');
  }, [fastForward, stages, currentStageIndex, clearMessages, clearTypewriter]);

  const currentStage = stages[currentStageIndex] || stages[0];

  return (
    <AccessibilityProvider>
      <SkipLink />
      <LiveRegion />
      
      <div className="minimal-ui min-h-screen bg-[#FAF9F7]">
        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border lg:hidden"
            onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle navigation panel"
          >
            {isMobilePanelOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        )}
        
        {/* Enhanced Mobile Overlay */}
        {isMobile && isMobilePanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobilePanelOpen(false)}
          />
        )}
        
        {/* Clean Two-Column Layout - CSS Grid Container */}
        <div className={cn(
          "h-screen overflow-hidden",
          isMobile ? "flex flex-col" : "grid grid-cols-2 gap-0"
        )}>
        
          {/* Column 1: Lyra Chat Panel (Desktop - 50%) */}
          <div className={cn(
            "h-screen flex flex-col bg-white overflow-hidden border-r border-gray-200",
            isMobile && "hidden"
          )}>
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b bg-white" role="banner">
              <div className="flex items-center gap-3">
                <LyraAvatar size="sm" expression={lyraExpression} animated />
                <div className="min-w-0 flex-1">
                  <h1 className="font-semibold truncate text-lg">Maya's Dynamic Communication Journey</h1>
                  <p className="text-gray-600 truncate text-sm">Complete Chapter 2 with Dynamic PACE</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Header-Integrated Progress */}
                <HeaderIntegratedProgress 
                  currentStageIndex={currentStageIndex}
                  totalStages={stages.length}
                  mayaJourney={mayaJourney}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fastForwardStage}
                  disabled={isFastForwarding}
                  className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  title="Complete current stage typing"
                  aria-label="Fast forward to complete current stage typing animation"
                  type="button"
                >
                  <FastForward className="w-4 h-4 inline mr-1" />
                  {isFastForwarding ? 'Completing...' : 'Fast Forward'}
                </motion.button>
              </div>
            </header>

            {/* Lyra's Enhanced Narrative Panel */}
            <div className="flex flex-col bg-white overflow-hidden flex-1">
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 border-b bg-gradient-to-r from-purple-100/80 to-indigo-100/80"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-purple-900">Maya's Story</h2>
                    <p className="text-sm text-purple-700/80">Learning through real experiences</p>
                  </div>
                </div>
              </motion.div>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {visibleMessages.map((message) => (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <LyraAvatar 
                          size="md" 
                          expression={lyraExpression} 
                          animated={isTyping === message.id} 
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className={cn(
                          getMessageStyles(message.context),
                          "p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/50 shadow-sm"
                        )}>
                          <div className={getTextStyles(message.context)}>
                            <TypewriterText
                              text={message.content}
                              speed={25}
                              className="leading-relaxed"
                              startDelay={message.id === visibleMessages[0]?.id ? 500 : 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Content Panel (Desktop - 50%) */}
          <div className={cn(
            "h-screen flex flex-col bg-gradient-to-br from-purple-50/30 to-indigo-50/30 overflow-hidden",
            isMobile && "hidden"
          )}>
            {/* Enhanced Header with Better Styling */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 border-b bg-white/90 backdrop-blur-md shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Interactive Workshop</h2>
                    <p className="text-sm text-gray-600">{currentStage.title}</p>
                  </div>
                </div>
                {isLoadingDynamic && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 rounded-full"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </motion.div>
                    <span className="text-sm font-medium text-purple-700">
                      Generating personalized choices...
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Content Area with Better Layout */}
            <div className="flex-1 overflow-hidden relative">
              <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Main Interactive Component with Better Styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden"
                  >
                    <MayaEmailComposer
                      onComplete={(data) => {
                        console.log('Maya Email Composer completed:', data);
                      }}
                      lessonContext={{
                        chapterId: 2,
                        lessonId: 5,
                        userId: user?.id,
                        currentStage: currentStageIndex,
                        mayaJourney
                      }}
                    />
                  </motion.div>
                  
                  {/* Enhanced Prompt Builder - Shows from step 2 with better integration */}
                  <AnimatePresence>
                    {currentStageIndex >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ 
                          delay: 0.6, 
                          duration: 0.5,
                          type: "spring",
                          damping: 20
                        }}
                        className="relative"
                      >
                        {/* Animated Connection Line */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "24px" }}
                          transition={{ delay: 0.8, duration: 0.3 }}
                          className="w-px bg-gradient-to-b from-purple-300 to-transparent absolute left-6 -top-6 z-10"
                        />
                        
                        {/* Connection Dot */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, duration: 0.2 }}
                          className="w-3 h-3 bg-purple-400 rounded-full absolute left-5 -top-7 z-10"
                        />
                        
                        <PromptBuilder
                          mayaJourney={mayaJourney}
                          dynamicPath={dynamicPath}
                          currentStageIndex={currentStageIndex}
                          className="relative z-0"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Full Screen */}
          {isMobile && (
            <div className="h-screen flex flex-col bg-white overflow-hidden pt-16 col-span-3">
              <div className="flex-1 p-8 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Mobile Layout</h2>
                  <p className="text-gray-600">Responsive design optimized for mobile devices</p>
                </div>
              </div>
            </div>
          )}

        {/* Enhanced Progress Bar with Stage Indicators */}
        <div className="h-3 bg-gray-200 relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 relative"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
          <div className="absolute inset-0 flex justify-between items-center px-2">
            {Array.from({ length: stages.length }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full border-2",
                  i <= currentStageIndex ? "bg-white border-purple-600" : "bg-gray-300 border-gray-400"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
      
      {/* Animation modal removed - pure storytelling focus */}
    </AccessibilityProvider>
  );
};

export default LyraNarratedMayaDynamicComplete;