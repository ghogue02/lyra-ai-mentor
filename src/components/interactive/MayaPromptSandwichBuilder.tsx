import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sandwich, Sparkles, Eye, Copy, RefreshCw, Zap, Target, User, MessageCircle, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface MayaPromptSandwichBuilderProps {
  onComplete?: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
}

export const MayaPromptSandwichBuilder: React.FC<MayaPromptSandwichBuilderProps> = ({
  onComplete,
  lessonContext
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptData, setPromptData] = useState({
    purpose: '',
    audience: '',
    context: '',
    tone: '',
    keyPoints: '',
    constraints: ''
  });
  const [livePrompt, setLivePrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Live prompt generation as user types
  const generateLivePrompt = useCallback(() => {
    if (!promptData.purpose && !promptData.audience && !promptData.context) {
      setLivePrompt('');
      return;
    }

    const sections = [];
    
    // Opening instruction
    sections.push("Write a professional email that:");
    
    // Purpose section
    if (promptData.purpose) {
      sections.push(`• Achieves this goal: ${promptData.purpose}`);
    }
    
    // Audience section
    if (promptData.audience) {
      sections.push(`• Is written for: ${promptData.audience}`);
    }
    
    // Context section
    if (promptData.context) {
      sections.push(`• Includes this context: ${promptData.context}`);
    }
    
    // Tone section
    if (promptData.tone) {
      const toneDescriptions = {
        professional: 'formal and business-appropriate',
        friendly: 'warm and approachable',
        urgent: 'direct and time-sensitive',
        grateful: 'appreciative and thankful',
        informative: 'educational and clear',
        persuasive: 'compelling and convincing'
      };
      sections.push(`• Uses a ${toneDescriptions[promptData.tone as keyof typeof toneDescriptions] || promptData.tone} tone`);
    }
    
    // Key points section
    if (promptData.keyPoints) {
      sections.push(`• Covers these key points: ${promptData.keyPoints}`);
    }
    
    // Constraints section
    if (promptData.constraints) {
      sections.push(`• Follows these guidelines: ${promptData.constraints}`);
    }
    
    // Closing instruction
    sections.push("\nThe email should be:");
    sections.push("• Professional yet warm");
    sections.push("• Clear and actionable");
    sections.push("• Appropriate for a nonprofit environment");
    sections.push("• 150-250 words in length");
    
    setLivePrompt(sections.join('\n'));
  }, [promptData]);

  // Update live prompt when any field changes
  useEffect(() => {
    generateLivePrompt();
  }, [generateLivePrompt]);

  const generateEmail = async () => {
    if (!livePrompt.trim()) {
      toast({
        title: "Add Some Details",
        description: "Fill in at least the purpose and audience to generate your email.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-testing-assistant', {
        body: {
          type: 'email_response',
          prompt: livePrompt,
          context: lessonContext?.content || 'Professional email composition using Maya\'s PACE framework'
        }
      });

      if (error) throw error;
      
      setGeneratedEmail(data.result);
      
      toast({
        title: "Email Generated!",
        description: "Maya has crafted your email using your custom prompt sandwich.",
      });
    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const isComplete = generatedEmail.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Sandwich className="w-6 h-6 text-orange-600" />
            Maya's Prompt Sandwich Builder
          </CardTitle>
          <p className="text-gray-600">
            Build your perfect AI prompt layer by layer - watch it update in real-time as you type!
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="text-orange-700">
              <User className="w-3 h-3 mr-1" />
              Maya Rodriguez
            </Badge>
            <Badge variant="outline" className="text-blue-700">
              <Zap className="w-3 h-3 mr-1" />
              Live Updates
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Fields */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Build Your Prompt Sandwich
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Layer 1: Purpose */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 1</span>
                  Purpose - What do you want to achieve?
                </Label>
                <Textarea
                  placeholder="e.g., Get board approval for new program, Schedule meeting with donors, Respond to parent concern..."
                  value={promptData.purpose}
                  onChange={(e) => setPromptData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              {/* Layer 2: Audience */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 2</span>
                  Audience - Who are you writing to?
                </Label>
                <Textarea
                  placeholder="e.g., Board members who need financial details, Busy parents who want quick updates, Potential donors..."
                  value={promptData.audience}
                  onChange={(e) => setPromptData(prev => ({ ...prev, audience: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              {/* Layer 3: Context */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 3</span>
                  Context - What background is important?
                </Label>
                <Textarea
                  placeholder="e.g., Recent program changes, Budget constraints, Success story from last quarter..."
                  value={promptData.context}
                  onChange={(e) => setPromptData(prev => ({ ...prev, context: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              {/* Layer 4: Tone */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 4</span>
                  Tone - How should it sound?
                </Label>
                <Select value={promptData.tone} onValueChange={(value) => setPromptData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose the right tone..." />
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
              </div>

              {/* Layer 5: Key Points */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 5</span>
                  Key Points - What must be included?
                </Label>
                <Textarea
                  placeholder="e.g., New pickup time 5:30 PM, Cost is $15/week, Registration deadline March 15..."
                  value={promptData.keyPoints}
                  onChange={(e) => setPromptData(prev => ({ ...prev, keyPoints: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              {/* Layer 6: Constraints */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 6</span>
                  Constraints - Any special requirements?
                </Label>
                <Input
                  placeholder="e.g., Keep under 200 words, Include call-to-action, Add contact info..."
                  value={promptData.constraints}
                  onChange={(e) => setPromptData(prev => ({ ...prev, constraints: e.target.value }))}
                />
              </div>

              <Button 
                onClick={generateEmail} 
                disabled={!livePrompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Email...
                  </>
                ) : (
                  <>
                    <Sandwich className="w-4 h-4 mr-2" />
                    Generate Email with My Prompt Sandwich
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <div className="space-y-4">
          {/* Live Prompt Preview */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Live Prompt Preview
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                >
                  {showLivePreview ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            <AnimatePresence>
              {showLivePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Updates as you type
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(livePrompt)}
                          disabled={!livePrompt.trim()}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Prompt
                        </Button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <pre className="text-sm text-blue-900 whitespace-pre-wrap font-mono leading-relaxed">
                          {livePrompt || 'Start filling in the fields above to see your prompt sandwich build in real-time!'}
                        </pre>
                      </div>
                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        💡 This is your custom AI prompt! Copy it and use it in ChatGPT, Claude, or any AI tool.
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Generated Email */}
          {generatedEmail && (
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Generated Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready to send
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(generatedEmail)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Email
                    </Button>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-900 whitespace-pre-wrap leading-relaxed">
                      {generatedEmail}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Maya's Tips */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Maya's Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-purple-800">
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Start with purpose and audience - these are your foundation layers</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Be specific with context - the more detail, the better the AI result</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Watch the live preview update as you type - it's your custom prompt!</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Copy your prompt sandwich to reuse with any AI tool</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion */}
      {isComplete && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Prompt Sandwich Mastery Complete!
              </h3>
              <p className="text-green-700 mb-4">
                You've learned Maya's technique for building perfect AI prompts layer by layer.
              </p>
              <Button 
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Workshop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};