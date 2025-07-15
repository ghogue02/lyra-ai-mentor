import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, Clock, Target, CheckCircle2, Copy, RefreshCw, 
  Sparkles, Heart, AlertCircle, Users, FileText, ChevronRight,
  ArrowRight, Eye, EyeOff, PlayCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MayaConfidenceMeter } from '@/components/magical/MayaConfidenceMeter';
import { StreamingTextArea } from '@/components/ui/StreamingTextArea';
import { optimizedAIService } from '@/services/optimizedAIService';
import { useComponentProgress } from '@/hooks/useComponentProgress';
import { ProgressWidget } from '@/components/ProgressWidget';
import { StoryIntegration } from '@/components/StoryIntegration';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { characterHelpContent } from '@/utils/helpContent';
import { ExportButton } from '@/components/ui/ExportButton';
import { UseInSuggestions } from '@/components/ui/UseInSuggestions';
import { ExportData } from '@/services/exportService';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { AIComponentErrorBoundary } from '@/components/ai-playground/AIComponentErrorBoundary';
import { ExampleSelector } from '@/components/ai-playground/ExampleSelector';
import { AIExample } from '@/services/aiExamplesService';
import { handleAIError, retryWithBackoff } from '@/services/aiErrorHandler';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { useTutorialElement } from '@/hooks/useTutorial';
import { MayaHeaderProgress, useMayaProgress, type MayaJourneyState } from './interactive/maya';
import { useDebounce, usePerformanceTracking } from '@/hooks/usePerformanceOptimization';

// Memoized animation variants
const stepVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: -30, 
    scale: 0.98,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Memoized components
const OptimizedSuggestionItem = memo(({ 
  suggestion, 
  onClick 
}: { 
  suggestion: string; 
  onClick: () => void 
}) => (
  <motion.button
    onClick={onClick}
    className="w-full text-left p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-all text-sm border border-transparent hover:border-primary/20"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {suggestion}
  </motion.button>
));

OptimizedSuggestionItem.displayName = 'OptimizedSuggestionItem';

// Types
interface EmailData {
  audience: string;
  tone: string;
  purpose: string;
  keyPoints: string;
  context: string;
}

// Main optimized component
export const OptimizedMayaEmailComposer = memo(() => {
  usePerformanceTracking('OptimizedMayaEmailComposer');
  
  const navigate = useNavigate();
  const { progress, updateProgress } = useComponentProgress('maya-email-composer');
  const { registerElement } = useTutorialElement();
  
  // State management
  const [currentStage, setCurrentStage] = useState<'welcome' | 'gathering' | 'crafting' | 'refining' | 'final'>('welcome');
  const [emailData, setEmailData] = useState<EmailData>({
    audience: '',
    tone: '',
    purpose: '',
    keyPoints: '',
    context: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedExample, setSelectedExample] = useState<AIExample | null>(null);
  
  // Debounced values for performance
  const debouncedEmailData = useDebounce(emailData, 500);
  
  // Memoized values
  const isReadyToGenerate = useMemo(() => {
    return emailData.audience && emailData.tone && emailData.purpose && emailData.keyPoints;
  }, [emailData]);

  const progressPercentage = useMemo(() => {
    const stages = ['welcome', 'gathering', 'crafting', 'refining', 'final'];
    return ((stages.indexOf(currentStage) + 1) / stages.length) * 100;
  }, [currentStage]);

  // Callbacks
  const handleGenerateEmail = useCallback(async () => {
    if (!isReadyToGenerate) return;

    setIsGenerating(true);
    try {
      const prompt = `Create a professional email with the following details:
        Audience: ${debouncedEmailData.audience}
        Tone: ${debouncedEmailData.tone}
        Purpose: ${debouncedEmailData.purpose}
        Key Points: ${debouncedEmailData.keyPoints}
        Additional Context: ${debouncedEmailData.context || 'None provided'}
        
        Please write a complete, well-structured email that effectively communicates the message.`;

      const response = await retryWithBackoff(async () => {
        return await optimizedAIService.makeAIRequest(
          prompt,
          characterHelpContent.maya.systemMessage,
          'maya-email-composer',
          'maya',
          { temperature: 0.7, maxTokens: 500, priority: 'high' }
        );
      });

      setGeneratedEmail(response);
      setCurrentStage('refining');
      updateProgress('generated_email');
      toast.success("Email generated successfully!");
    } catch (error) {
      handleAIError(error, 'generating email');
    } finally {
      setIsGenerating(false);
    }
  }, [isReadyToGenerate, debouncedEmailData, updateProgress]);

  const handleRefineEmail = useCallback(async (refinementType: string) => {
    if (!generatedEmail) return;

    setIsGenerating(true);
    try {
      const prompt = `Please ${refinementType} the following email while maintaining its core message:
        
        ${generatedEmail}
        
        Original context:
        Audience: ${emailData.audience}
        Tone: ${emailData.tone}`;

      const response = await optimizedAIService.makeAIRequest(
        prompt,
        characterHelpContent.maya.systemMessage,
        'maya-email-refiner',
        'maya',
        { temperature: 0.6, maxTokens: 500, priority: 'normal' }
      );

      setGeneratedEmail(response);
      updateProgress('refined_email');
      toast.success(`Email ${refinementType} successfully!`);
    } catch (error) {
      handleAIError(error, 'refining email');
    } finally {
      setIsGenerating(false);
    }
  }, [generatedEmail, emailData, updateProgress]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success("Email copied to clipboard!");
    updateProgress('copied_email');
  }, [generatedEmail, updateProgress]);

  const handleExampleSelect = useCallback((example: AIExample | null) => {
    if (example && example.inputs) {
      setEmailData({
        audience: example.inputs.audience || '',
        tone: example.inputs.tone || '',
        purpose: example.inputs.purpose || '',
        keyPoints: example.inputs.keyPoints || '',
        context: example.inputs.context || ''
      });
      setSelectedExample(example);
      toast.success("Example loaded!");
    }
  }, []);

  // Preload AI service for this character
  useEffect(() => {
    optimizedAIService.preloadCommonRequests('maya');
  }, []);

  // Export data preparation
  const exportData: ExportData = useMemo(() => ({
    title: "Maya's Email Composition",
    description: "Professional email crafted with AI assistance",
    data: {
      emailData,
      generatedEmail,
      stage: currentStage,
      timestamp: new Date().toISOString()
    },
    generator: 'maya-email-composer'
  }), [emailData, generatedEmail, currentStage]);

  return (
    <AIComponentErrorBoundary componentName="Maya Email Composer">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
        <MayaHeaderProgress 
          currentStage={currentStage}
          progressPercentage={progressPercentage}
        />
        
        <div className="max-w-6xl mx-auto">
          <StoryIntegration character="maya" context="email_composer" />
          
          <AnimatePresence mode="wait">
            {currentStage === 'welcome' && (
              <motion.div
                key="welcome"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <Mail className="w-24 h-24 text-purple-500 mx-auto mb-6" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Welcome to Maya's Email Workshop! 
                  <HelpTooltip content="Maya will guide you through crafting professional emails step by step" />
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Let's craft the perfect email together. I'll guide you through each step to ensure your message hits just the right note!
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setCurrentStage('gathering')}
                  className="gap-2"
                  ref={el => registerElement('start-button', el)}
                >
                  Let's Begin <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {currentStage === 'gathering' && (
              <motion.div
                key="gathering"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      Let's Gather Information
                      <HelpTooltip content="Provide details about your email to help Maya create the perfect message" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ExampleSelector
                      componentType="maya-email-composer"
                      onSelect={handleExampleSelect}
                      selectedExample={selectedExample}
                    />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Form fields with optimized rendering */}
                      <div ref={el => registerElement('audience-field', el)}>
                        <label className="block text-sm font-medium mb-2">
                          Who's your audience? <Users className="w-4 h-4 inline" />
                        </label>
                        <input
                          type="text"
                          value={emailData.audience}
                          onChange={(e) => setEmailData(prev => ({ ...prev, audience: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Team members, Client, Manager"
                        />
                        <UseInSuggestions 
                          value={emailData.audience}
                          onChange={(value) => setEmailData(prev => ({ ...prev, audience: value }))}
                          placeholder="Select an audience type..."
                          category="audience"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          What tone should we use? <Heart className="w-4 h-4 inline" />
                        </label>
                        <select
                          value={emailData.tone}
                          onChange={(e) => setEmailData(prev => ({ ...prev, tone: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select a tone...</option>
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="persuasive">Persuasive</option>
                          <option value="empathetic">Empathetic</option>
                          <option value="formal">Formal</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          What's the purpose? <Target className="w-4 h-4 inline" />
                        </label>
                        <input
                          type="text"
                          value={emailData.purpose}
                          onChange={(e) => setEmailData(prev => ({ ...prev, purpose: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Schedule a meeting, Share project update, Request feedback"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Key points to include <FileText className="w-4 h-4 inline" />
                        </label>
                        <textarea
                          value={emailData.keyPoints}
                          onChange={(e) => setEmailData(prev => ({ ...prev, keyPoints: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 h-24"
                          placeholder="List the main points you want to cover..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Additional context (optional) <AlertCircle className="w-4 h-4 inline" />
                        </label>
                        <textarea
                          value={emailData.context}
                          onChange={(e) => setEmailData(prev => ({ ...prev, context: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 h-20"
                          placeholder="Any additional information that might be helpful..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <MayaConfidenceMeter confidence={isReadyToGenerate ? 85 : 40} />
                      <Button 
                        onClick={() => setCurrentStage('crafting')}
                        disabled={!isReadyToGenerate}
                        className="gap-2"
                      >
                        Generate Email <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {(currentStage === 'crafting' || currentStage === 'refining') && (
              <motion.div
                key="crafting"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-500" />
                        Your Email Draft
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <ExportButton
                          data={exportData}
                          filename="maya-email"
                          format="txt"
                        />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!generatedEmail && (
                      <div className="text-center py-8">
                        <Button 
                          onClick={handleGenerateEmail}
                          disabled={isGenerating}
                          size="lg"
                          className="gap-2"
                        >
                          {isGenerating ? (
                            <>Crafting your email...</>
                          ) : (
                            <>Generate Email <PlayCircle className="w-5 h-5" /></>
                          )}
                        </Button>
                      </div>
                    )}

                    {generatedEmail && (
                      <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg border">
                          <StreamingTextArea
                            text={generatedEmail}
                            isStreaming={isGenerating}
                            className="min-h-[300px] font-mono text-sm"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleRefineEmail('make more concise')}
                            disabled={isGenerating}
                          >
                            Make Concise
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRefineEmail('make more detailed')}
                            disabled={isGenerating}
                          >
                            Add Detail
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRefineEmail('make more formal')}
                            disabled={isGenerating}
                          >
                            More Formal
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRefineEmail('make more friendly')}
                            disabled={isGenerating}
                          >
                            More Friendly
                          </Button>
                          <Button
                            onClick={handleCopyEmail}
                            className="gap-2"
                          >
                            <Copy className="w-4 h-4" /> Copy Email
                          </Button>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                          <Button
                            variant="outline"
                            onClick={handleGenerateEmail}
                            disabled={isGenerating}
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" /> Regenerate
                          </Button>
                          <Button
                            onClick={() => setCurrentStage('final')}
                            className="gap-2"
                          >
                            Finish <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStage === 'final' && (
              <motion.div
                key="final"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Excellent Work! 🎉
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  You've crafted a professional email that's ready to send. Remember, clear communication is a superpower!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentStage('welcome');
                      setEmailData({
                        audience: '',
                        tone: '',
                        purpose: '',
                        keyPoints: '',
                        context: ''
                      });
                      setGeneratedEmail('');
                    }}
                  >
                    Create Another Email
                  </Button>
                  <Button 
                    onClick={() => navigate('/learning-paths')}
                    className="gap-2"
                  >
                    Continue Learning <GraduationCap className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ProgressWidget />
          <TutorialButton />
        </div>
      </div>
    </AIComponentErrorBoundary>
  );
});

OptimizedMayaEmailComposer.displayName = 'OptimizedMayaEmailComposer';