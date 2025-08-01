import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Mail, Clock, User, Target, Sparkles, Send, CheckCircle, Lightbulb, MessageSquare, PenTool, Copy, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

interface MayaEmailComposerProps {
  onComplete?: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
}

interface EmailStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  content?: string;
  aiSuggestions?: string[];
}

export const MayaEmailComposer: React.FC<MayaEmailComposerProps> = ({
  onComplete,
  lessonContext
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailData, setEmailData] = useState({
    purpose: '',
    audience: '',
    context: '',
    tone: '',
    keyPoints: '',
    generatedEmail: '',
    refinedEmail: ''
  });

  const [steps, setSteps] = useState<EmailStep[]>([
    {
      id: 'purpose',
      title: 'Define Purpose',
      description: 'What specific outcome do you want from this email?',
      icon: Target,
      completed: false
    },
    {
      id: 'audience',
      title: 'Analyze Audience',
      description: 'Who are you writing to and what do they need?',
      icon: User,
      completed: false
    },
    {
      id: 'context',
      title: 'Gather Context',
      description: 'What background information is essential?',
      icon: MessageSquare,
      completed: false
    },
    {
      id: 'tone',
      title: 'Choose Tone',
      description: 'What tone will resonate with your audience?',
      icon: Lightbulb,
      completed: false
    },
    {
      id: 'generate',
      title: 'AI Generation',
      description: 'Let AI craft your email using the PACE framework',
      icon: Sparkles,
      completed: false
    },
    {
      id: 'refine',
      title: 'Refine & Execute',
      description: 'Review, refine, and finalize your email',
      icon: PenTool,
      completed: false
    }
  ]);

  const generateAISuggestions = async (stepId: string, userInput: string) => {
    if (!userInput.trim()) return [];

    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'email_suggestions',
          topic: `For the "${stepId}" step of email writing, provide 3 specific, actionable suggestions based on this input: "${userInput}". Focus on practical advice Maya Rodriguez would give.`,
          context: lessonContext?.content || 'Email composition using PACE framework',
          targetAudience: 'learners'
        }
      });

      if (error) throw error;
      
      if (data && data.success && data.content) {
        const suggestions = data.content.split('\n').filter((s: string) => s.trim().length > 0).slice(0, 3);
        return suggestions;
      } else {
        throw new Error(data?.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return [];
    }
  };

  const generateFullEmail = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'email',
          topic: `Professional email with Purpose: ${emailData.purpose}, Audience: ${emailData.audience}, Context: ${emailData.context}, Tone: ${emailData.tone}`,
          targetAudience: emailData.audience
        }
      });

      if (error) throw error;

      const generatedContent = data.content;
      setEmailData(prev => ({ ...prev, generatedEmail: generatedContent }));
      
      // Update step completion
      setSteps(prev => prev.map(step => 
        step.id === 'generate' ? { ...step, completed: true, content: generatedContent } : step
      ));

      toast({
        title: "Email Generated!",
        description: "Maya has crafted your email using the PACE framework.",
      });

      return generatedContent;
    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate email. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepCompletion = async (stepId: string, value: string) => {
    // Update email data
    setEmailData(prev => ({ ...prev, [stepId]: value }));
    
    // Generate AI suggestions for next step
    const suggestions = await generateAISuggestions(stepId, value);
    
    // Mark step as completed
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, completed: true, content: value, aiSuggestions: suggestions }
        : step
    ));

    // Auto-advance to next step
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 500);
    }
  };

  const handleGenerateStep = async () => {
    const email = await generateFullEmail();
    if (email) {
      setTimeout(() => setCurrentStep(currentStep + 1), 1000);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Email copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Email Mastery Complete!",
      description: "You've mastered Maya's PACE framework for email composition.",
    });
    onComplete?.();
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="neumorph-card bg-gradient-to-r from-purple-50 to-pink-50 p-6">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold">
            <Mail className="w-6 h-6 text-purple-600" />
            Maya's Email Mastery Workshop
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <div className="neumorph-badge text-purple-700">
              <User className="w-3 h-3 mr-1" />
              Maya Rodriguez
            </div>
            <div className="neumorph-badge text-green-700">
              <Clock className="w-3 h-3 mr-1" />
              15-20 minutes
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="neumorph-progress">
          <div 
            className="neumorph-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center gap-2 ${
              index <= currentStep ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : index === currentStep 
                  ? 'bg-purple-500 border-purple-500 text-white' 
                  : 'bg-gray-100 border-gray-300'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs font-medium text-center max-w-16">
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="neumorph-card border-2 border-purple-200 p-6">
            <div className="mb-6">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <currentStepData.icon className="w-6 h-6 text-purple-600" />
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mt-2">{currentStepData.description}</p>
            </div>
            <div className="space-y-4">
              {/* Step-specific content */}
              {currentStepData.id === 'purpose' && (
                <div className="space-y-3">
                  <Label htmlFor="purpose">What specific outcome do you want from this email?</Label>
                  <textarea
                    id="purpose"
                    placeholder="e.g., Get board approval for new program, Schedule a meeting with donors, Respond to parent concern..."
                    value={emailData.purpose}
                    onChange={(e) => setEmailData(prev => ({ ...prev, purpose: e.target.value }))}
                    className="neumorph-textarea w-full"
                  />
                  <button 
                    onClick={() => handleStepCompletion('purpose', emailData.purpose)}
                    disabled={!emailData.purpose.trim()}
                    className="w-full px-4 py-2 font-medium neumorph-button-primary text-white"
                  >
                    Analyze Purpose
                  </button>
                </div>
              )}

              {currentStepData.id === 'audience' && (
                <div className="space-y-3">
                  <Label htmlFor="audience">Who are you writing to and what do they need?</Label>
                  <textarea
                    id="audience"
                    placeholder="e.g., Board members who need financial details, Busy parents who want quick updates, Donors who want impact stories..."
                    value={emailData.audience}
                    onChange={(e) => setEmailData(prev => ({ ...prev, audience: e.target.value }))}
                    className="neumorph-textarea w-full"
                  />
                  <button 
                    onClick={() => handleStepCompletion('audience', emailData.audience)}
                    disabled={!emailData.audience.trim()}
                    className="w-full px-4 py-2 font-medium neumorph-button-primary text-white"
                  >
                    Analyze Audience
                  </button>
                </div>
              )}

              {currentStepData.id === 'context' && (
                <div className="space-y-3">
                  <Label htmlFor="context">What background information is essential?</Label>
                  <textarea
                    id="context"
                    placeholder="e.g., New policy changes, Budget constraints, Recent program success, Upcoming deadline..."
                    value={emailData.context}
                    onChange={(e) => setEmailData(prev => ({ ...prev, context: e.target.value }))}
                    className="neumorph-textarea w-full"
                  />
                  <button 
                    onClick={() => handleStepCompletion('context', emailData.context)}
                    disabled={!emailData.context.trim()}
                    className="w-full px-4 py-2 font-medium neumorph-button-primary text-white"
                  >
                    Set Context
                  </button>
                </div>
              )}

              {currentStepData.id === 'tone' && (
                <div className="space-y-3">
                  <Label htmlFor="tone">What tone will resonate with your audience?</Label>
                  <Select value={emailData.tone} onValueChange={(value) => setEmailData(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger className="neumorph-select">
                      <SelectValue placeholder="Choose the appropriate tone..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional & Formal</SelectItem>
                      <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                      <SelectItem value="urgent">Urgent & Direct</SelectItem>
                      <SelectItem value="grateful">Grateful & Appreciative</SelectItem>
                      <SelectItem value="informative">Informative & Educational</SelectItem>
                      <SelectItem value="persuasive">Persuasive & Compelling</SelectItem>
                    </SelectContent>
                  </Select>
                  <button 
                    onClick={() => handleStepCompletion('tone', emailData.tone)}
                    disabled={!emailData.tone}
                    className="w-full px-4 py-2 font-medium neumorph-button-primary text-white"
                  >
                    Set Tone
                  </button>
                </div>
              )}

              {currentStepData.id === 'generate' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Ready to Generate!</h4>
                    <div className="space-y-2 text-sm text-purple-800">
                      <p><strong>Purpose:</strong> {emailData.purpose}</p>
                      <p><strong>Audience:</strong> {emailData.audience}</p>
                      <p><strong>Context:</strong> {emailData.context}</p>
                      <p><strong>Tone:</strong> {emailData.tone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateStep}
                    disabled={isProcessing}
                    className={`w-full px-6 py-3 font-semibold text-white ${
                      isProcessing ? 'neumorph-loading' : ''
                    } neumorph-button-primary`}
                    style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Maya is crafting your email...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Email with AI
                      </>
                    )}
                  </button>
                </div>
              )}

              {currentStepData.id === 'refine' && emailData.generatedEmail && (
                <div className="space-y-4">
                  <div className="neumorph-card-inset p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="neumorph-badge bg-green-100 text-green-800">
                        <Star className="w-3 h-3 mr-1" />
                        AI Generated Email
                      </div>
                      <button 
                        onClick={() => copyToClipboard(emailData.generatedEmail)}
                        className="neumorph-button px-3 py-1 text-sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </button>
                    </div>
                    <TemplateContentFormatter 
                      content={emailData.generatedEmail}
                      variant="preview"
                      showMergeFieldTypes={true}
                      className="formatted-ai-content"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="refinedEmail">Refine your email (optional):</Label>
                    <textarea
                      id="refinedEmail"
                      placeholder="Make any adjustments to the generated email..."
                      value={emailData.refinedEmail}
                      onChange={(e) => setEmailData(prev => ({ ...prev, refinedEmail: e.target.value }))}
                      className="neumorph-textarea w-full min-h-[150px]"
                    />
                    <button 
                      onClick={handleComplete}
                      className="w-full px-6 py-3 font-semibold text-white neumorph-button-primary"
                      style={{ background: 'linear-gradient(135deg, var(--neumorph-success), #34d399)' }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Complete Email Workshop
                    </button>
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {currentStepData.aiSuggestions && currentStepData.aiSuggestions.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Maya's AI Suggestions
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    {currentStepData.aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          className="neumorph-button px-4 py-2"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-purple-600' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          className="neumorph-button-primary px-4 py-2 text-white font-medium"
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1 || !currentStepData.completed}
        >
          Next
        </button>
      </div>
    </div>
  );
};