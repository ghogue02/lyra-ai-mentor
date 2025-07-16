import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Volume2, MessageCircle, Star, FileText, Shield, Menu, X, Eye, Target, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { InteractiveElementRenderer } from '@/components/lesson/interactive/InteractiveElementRenderer';
import { TypewriterText } from '@/components/lesson/TypewriterText';
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced Maya Component with Dynamic PACE Integration
 * Loads content from database and provides real interactive elements
 */
const LyraNarratedMayaDynamicComplete: React.FC = () => {
  // Core state management
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping'>('default');
  const [canFastForward, setCanFastForward] = useState(false);
  const [fastForwardMode, setFastForwardMode] = useState(false);
  
  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  
  // Database content state
  const [contentBlocks, setContentBlocks] = useState([]);
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive element completion state
  const [isElementCompleted, setIsElementCompleted] = useState(false);

  // Load content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load content blocks for lesson 5 (Maya's story)
        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('lesson_id', 5)
          .eq('is_active', true)
          .eq('is_visible', true)
          .order('order_index');

        if (blocksError) throw blocksError;

        // Load interactive elements for lesson 5
        const { data: elements, error: elementsError } = await supabase
          .from('interactive_elements')
          .select('*')
          .eq('lesson_id', 5)
          .eq('is_active', true)
          .eq('is_visible', true)
          .order('order_index');

        if (elementsError) throw elementsError;

        setContentBlocks(blocks || []);
        setInteractiveElements(elements || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert database content to story stages
  const stages = contentBlocks.map((block, index) => ({
    id: `stage-${index}`,
    title: block.title || `Maya's Journey - Phase ${index + 1}`,
    subtitle: `Phase ${index + 1} of ${contentBlocks.length}`,
    content: block.content,
    metadata: block.metadata
  }));

  // Handle message progression
  const handleNextMessage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handleFastForward = () => {
    setFastForwardMode(true);
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(stages.length - 1);
    }
  };

  // Auto-progression for stages  
  useEffect(() => {
    if (fastForwardMode || stages.length === 0) return;
    
    const timer = setTimeout(() => {
      if (currentStageIndex < stages.length - 1) {
        setCurrentStageIndex(currentStageIndex + 1);
      }
    }, 12000); // Time to read current content
    
    return () => clearTimeout(timer);
  }, [currentStageIndex, fastForwardMode, stages]);

  // Enable fast forward after first message
  useEffect(() => {
    setCanFastForward(currentStageIndex > 0 || stages.length > 1);
  }, [currentStageIndex, stages]);

  // Handle email composer completion
  const handleEmailComposerComplete = () => {
    setIsElementCompleted(true);
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const currentStage = stages[currentStageIndex];
  
  // Get interactive elements for right panel
  const emailComposer = interactiveElements.find(el => el.type === 'ai_email_composer');
  const promptBuilder = interactiveElements.find(el => el.type === 'prompt_builder');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading Maya's story...</p>
        </div>
      </div>
    );
  }

  if (!currentStage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-600">No content available</p>
        </div>
      </div>
    );
  }

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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex items-start gap-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <LyraAvatar size="md" expression="helping" animated />
                      </motion.div>
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-2xl p-6 shadow-md border border-purple-100/50"
                        >
                          <div className="absolute -left-3 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-purple-100" />
                          {!fastForwardMode ? (
                            <TypewriterText
                              text={currentStage.content}
                              speed={25}
                              className="text-gray-800 leading-relaxed font-medium"
                              onComplete={() => setIsTyping(null)}
                            />
                          ) : (
                            <p className="text-gray-800 leading-relaxed font-medium">{currentStage.content}</p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Progress to next stage button */}
                    {currentStageIndex < stages.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex justify-center pt-6"
                      >
                        <Button
                          onClick={handleNextMessage}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Continue Maya's Journey
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Panel - Split Interactive Section */}
        <div className={cn(
          "w-full transition-all duration-300 bg-white border-l border-purple-200/60 flex flex-col",
          isMobile ? (isMobilePanelOpen ? "fixed inset-0 z-40" : "hidden") : "flex-1"
        )}>
          {/* Interactive Panel Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-purple-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  Interactive PACE Workshop
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Follow Maya's journey with real AI tools
                </p>
              </div>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="text-purple-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Split Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Section: Email Composer Interactive Element */}
            <div className="flex-1 border-b border-purple-100 overflow-y-auto">
              {emailComposer ? (
                <InteractiveElementRenderer
                  element={emailComposer}
                  lessonContext={{
                    chapterTitle: "Maya's Email Mastery",
                    lessonTitle: "PACE Framework in Action",
                    content: "Help Maya craft the perfect response using AI"
                  }}
                  isElementCompleted={false}
                  onComplete={async () => {
                    console.log('Email composer completed');
                    setIsElementCompleted(true);
                  }}
                />
              ) : (
                <Card className="h-full bg-gradient-to-br from-white to-indigo-50/30 border-indigo-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200">
                    <CardTitle className="flex items-center gap-3 text-indigo-700">
                      <Target className="w-5 h-5" />
                      Loading Workshop...
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                      <p className="text-indigo-600 text-sm">Preparing interactive elements...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Bottom Section: Prompt Builder Interactive Element */}
            <div className="flex-1 overflow-y-auto">
              {promptBuilder ? (
                <InteractiveElementRenderer
                  element={promptBuilder}
                  lessonContext={{
                    chapterTitle: "Maya's Email Mastery", 
                    lessonTitle: "AI Prompt Building",
                    content: "Learn Maya's prompt building technique"
                  }}
                  isElementCompleted={false}
                  onComplete={async () => {
                    console.log('Prompt builder completed');
                  }}
                />
              ) : (
                <Card className="h-full bg-gradient-to-br from-white to-purple-50/30 border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200">
                    <CardTitle className="flex items-center gap-3 text-purple-700">
                      <MessageCircle className="w-5 h-5" />
                      AI Prompt Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-purple-600 text-sm">Loading prompt builder...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyraNarratedMayaDynamicComplete;