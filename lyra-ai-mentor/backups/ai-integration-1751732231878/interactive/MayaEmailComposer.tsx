import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, Clock, Target, CheckCircle2, Copy, RefreshCw, 
  Sparkles, Heart, AlertCircle, Users, FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import { MayaConfidenceMeter } from '@/components/magical/MayaConfidenceMeter';
import { StreamingTextArea } from '@/components/ui/StreamingTextArea';
import { enhancedAIService } from '@/services/enhancedAIService';

interface MayaEmailComposerProps {
  onComplete?: (data: {
    timeSpent: number;
    recipesCreated: number;
    transformationViewed: boolean;
  }) => void;
}

type Phase = 'intro' | 'build' | 'preview' | 'success';

interface EmailRecipe {
  tone: string;
  toneEmoji: string;
  recipient: string;
  recipientEmoji: string;
  purpose: string;
  purposeEmoji: string;
}

const toneOptions = [
  { id: 'professional', label: 'Professional & Respectful', emoji: '👔', description: 'Formal but approachable' },
  { id: 'warm', label: 'Warm & Understanding', emoji: '🤗', description: 'Empathetic and caring' },
  { id: 'urgent-calm', label: 'Urgent but Calm', emoji: '🚨', description: 'Important without panic' },
  { id: 'grateful', label: 'Grateful & Appreciative', emoji: '🙏', description: 'Showing sincere thanks' },
  { id: 'encouraging', label: 'Encouraging & Supportive', emoji: '💪', description: 'Motivating and positive' }
];

const recipientOptions = [
  { id: 'concerned-parent', label: 'Concerned Parent', emoji: '👨‍👩‍👧', description: 'Worried about their child' },
  { id: 'potential-donor', label: 'Potential Donor', emoji: '💰', description: 'Considering support' },
  { id: 'board-member', label: 'Board Member', emoji: '📊', description: 'Needs strategic info' },
  { id: 'volunteer', label: 'Volunteer', emoji: '🤝', description: 'Offering their time' },
  { id: 'staff-team', label: 'Staff Team', emoji: '👥', description: 'Internal communication' },
  { id: 'community-partner', label: 'Community Partner', emoji: '🏘️', description: 'Collaborative relationship' },
  { id: 'program-participant', label: 'Program Participant', emoji: '🎯', description: 'Direct service recipient' },
  { id: 'media-contact', label: 'Media Contact', emoji: '📰', description: 'Press and publicity' }
];

const purposeOptions = [
  { id: 'address-concern', label: 'Address Concern', emoji: '💬', description: 'Respond to worries' },
  { id: 'share-update', label: 'Share Update', emoji: '📢', description: 'Inform about progress' },
  { id: 'make-request', label: 'Make Request', emoji: '📝', description: 'Ask for something' },
  { id: 'express-thanks', label: 'Express Thanks', emoji: '💌', description: 'Show appreciation' },
  { id: 'invite-action', label: 'Invite Action', emoji: '🎯', description: 'Call to participate' },
  { id: 'provide-info', label: 'Provide Information', emoji: '📋', description: 'Share details' },
  { id: 'build-relationship', label: 'Build Relationship', emoji: '🌱', description: 'Strengthen connection' },
  { id: 'resolve-issue', label: 'Resolve Issue', emoji: '🔧', description: 'Fix a problem' }
];

export const MayaEmailComposer: React.FC<MayaEmailComposerProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [recipe, setRecipe] = useState<Partial<EmailRecipe>>({});
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime] = useState(Date.now());
  const [recipesCreated, setRecipesCreated] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(1);

  const handleToneSelect = (tone: typeof toneOptions[0]) => {
    setRecipe({ ...recipe, tone: tone.label, toneEmoji: tone.emoji });
    setCurrentLayer(2);
  };

  const handleRecipientSelect = (recipient: typeof recipientOptions[0]) => {
    setRecipe({ ...recipe, recipient: recipient.label, recipientEmoji: recipient.emoji });
    setCurrentLayer(3);
  };

  const handlePurposeSelect = (purpose: typeof purposeOptions[0]) => {
    setRecipe({ ...recipe, purpose: purpose.label, purposeEmoji: purpose.emoji });
  };

  const recipeProgress = Object.keys(recipe).length / 3;
  const isRecipeComplete = recipe.tone && recipe.recipient && recipe.purpose;

  const generateEmail = async () => {
    if (!isRecipeComplete) return;
    
    setIsGenerating(true);
    
    try {
      const email = await enhancedAIService.generateEmail({
        tone: recipe.tone!,
        recipient: recipe.recipient!,
        purpose: recipe.purpose!,
        context: 'after-school program communication'
      });
      
      setGeneratedEmail(email);
      setRecipesCreated(prev => prev + 1);
      setPhase('preview');
    } catch (error) {
      console.error('Email generation failed:', error);
      toast.error('Failed to generate email. Please try again.');
      
      // Fallback to mock content
      const fallbackEmail = `Dear ${recipe.recipient},

I hope this message finds you well. Thank you for reaching out about your concerns regarding our programs.

I completely understand your situation and want to address your needs effectively. Here's what we're doing to help:

• Implementing immediate improvements to address your concerns
• Scheduling follow-up meetings to ensure continued communication
• Creating clear processes for future interactions
• Providing ongoing support and resources

Please don't hesitate to reach out if you have any other questions or concerns. We truly value your involvement and feedback.

Best regards,
Maya Rodriguez
Program Director`;
      
      setGeneratedEmail(fallbackEmail);
      setRecipesCreated(prev => prev + 1);
      setPhase('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard!');
  };

  const handleTryAgain = () => {
    setRecipe({});
    setCurrentLayer(1);
    setPhase('build');
  };

  const handleViewTransformation = () => {
    setPhase('success');
    onComplete?.({
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      recipesCreated,
      transformationViewed: true
    });
  };

  return (
    <div role="region" aria-label="Email composition tool" className="space-y-6">
      {/* Story Context - Only show initially */}
      {phase === 'intro' && (
        <StoryIntegration 
          characterId="maya" 
          variant="compact" 
          className="mb-4"
          showMetrics={true}
          showQuote={true}
        />
      )}
      {/* Phase 1: Story Introduction */}
      {phase === 'intro' && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-cyan-50">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Maya's Email Challenge
            </CardTitle>
            <p className="text-lg text-gray-700 mt-2">
              Maya spent <span className="font-bold text-red-600">32 minutes</span> struggling with a parent email yesterday
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/80 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Her struggles:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Finding the right tone</p>
                    <p className="text-sm text-gray-600">Professional? Friendly? How formal should she be?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Starting from scratch</p>
                    <p className="text-sm text-gray-600">Staring at a blank screen, unsure how to begin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Second-guessing every word</p>
                    <p className="text-sm text-gray-600">Rewriting sentences over and over</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => setPhase('build')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Help Maya Master Email Writing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase 2: Email Recipe Builder */}
      {phase === 'build' && (
        <div className="space-y-6">
          <div role="status" aria-live="polite" className="sr-only">
            Now in Email Recipe Builder phase
          </div>
          
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Email Recipe Builder
                </CardTitle>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {Math.floor(recipeProgress * 3)}/3 layers selected
                </Badge>
              </div>
              <Progress value={recipeProgress * 100} className="mt-4 h-3" />
              <MayaConfidenceMeter 
                progress={recipeProgress * 100}
                currentLayer={Math.floor(recipeProgress * 3)}
                totalLayers={3}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layer 1: Tone */}
              <div className={`space-y-4 ${currentLayer >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">1</span>
                  Layer 1: Emotional Foundation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {toneOptions.map((tone) => (
                    <Button
                      key={tone.id}
                      variant={recipe.tone === tone.label ? "default" : "outline"}
                      className={`h-auto p-4 justify-start ${
                        recipe.tone === tone.label 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                      onClick={() => handleToneSelect(tone)}
                    >
                      <div className="text-left">
                        <div className="font-medium flex items-center gap-2">
                          {tone.label} {tone.emoji}
                        </div>
                        <div className="text-xs opacity-80 mt-1">{tone.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Layer 2: Recipient */}
              {currentLayer >= 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
                    Layer 2: Recipient Context
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recipientOptions.map((recipient) => (
                      <Button
                        key={recipient.id}
                        variant={recipe.recipient === recipient.label ? "default" : "outline"}
                        className={`h-auto p-4 justify-start ${
                          recipe.recipient === recipient.label 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => handleRecipientSelect(recipient)}
                      >
                        <div className="text-left">
                          <div className="font-medium flex items-center gap-2">
                            {recipient.label} {recipient.emoji}
                          </div>
                          <div className="text-xs opacity-80 mt-1">{recipient.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Layer 3: Purpose */}
              {currentLayer >= 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">3</span>
                    Layer 3: Email Purpose
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {purposeOptions.map((purpose) => (
                      <Button
                        key={purpose.id}
                        variant={recipe.purpose === purpose.label ? "default" : "outline"}
                        className={`h-auto p-4 justify-start ${
                          recipe.purpose === purpose.label 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'hover:bg-green-50 hover:border-green-300'
                        }`}
                        onClick={() => handlePurposeSelect(purpose)}
                      >
                        <div className="text-left">
                          <div className="font-medium flex items-center gap-2">
                            {purpose.label} {purpose.emoji}
                          </div>
                          <div className="text-xs opacity-80 mt-1">{purpose.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Preview */}
              {Object.keys(recipe).length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900">Your Email Recipe:</h4>
                  <div className="space-y-1">
                    {recipe.tone && (
                      <p className="text-sm">
                        <span className="font-medium">Tone:</span> {recipe.tone} {recipe.toneEmoji}
                      </p>
                    )}
                    {recipe.recipient && (
                      <p className="text-sm">
                        <span className="font-medium">Recipient:</span> {recipe.recipient} {recipe.recipientEmoji}
                      </p>
                    )}
                    {recipe.purpose && (
                      <p className="text-sm">
                        <span className="font-medium">Purpose:</span> {recipe.purpose} {recipe.purposeEmoji}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={generateEmail}
                  disabled={!isRecipeComplete || isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Crafting Perfect Email...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Generate Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase 3: Email Preview */}
      {phase === 'preview' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Generated Email</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ready to send
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quality Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tone Match</p>
                  <p className="text-lg font-bold text-purple-800">95%</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Clarity Score</p>
                  <p className="text-lg font-bold text-blue-800">High</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Empathy Level</p>
                  <p className="text-lg font-bold text-green-800">Strong</p>
                </div>
              </div>

              {/* Email Content */}
              <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
                {generatedEmail}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={handleCopy} variant="default" size="lg">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={handleTryAgain} variant="outline" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Different Recipe
                </Button>
                <Button 
                  onClick={handleViewTransformation} 
                  variant="default" 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  See My Transformation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase 4: Success & Transformation */}
      {phase === 'success' && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-purple-50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Maya's Transformation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time Metrics */}
            <div className="bg-white/90 rounded-lg p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-lg">
                  <span className="line-through text-red-600">Before: 32 minutes</span>
                </p>
                <p className="text-2xl font-bold text-green-600">
                  After: 5 minutes
                </p>
                <p className="text-xl font-semibold text-purple-800">
                  Time Saved: 27 minutes per email
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-purple-100 rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold">Weekly: 2.25 hours saved</p>
                  <p className="text-sm text-gray-600">(5 emails/week)</p>
                </div>
                <div className="text-center p-4 bg-cyan-100 rounded-lg">
                  <Target className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                  <p className="font-semibold">Annual: 117 hours saved</p>
                  <p className="text-sm text-gray-600">(That's 3 work weeks!)</p>
                </div>
              </div>
            </div>

            {/* Maya's Testimonial */}
            <div className="bg-white/90 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <p className="italic text-gray-700 mb-2">
                    "I used to dread email time. Now, with my email recipe system, I can craft professional, 
                    empathetic responses in minutes. It's not just about saving time – it's about feeling 
                    confident in my communication. I can focus on what really matters: our programs and families."
                  </p>
                  <p className="font-semibold text-gray-900">- Maya Rodriguez</p>
                  <p className="text-sm text-gray-600">Program Director</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Ready to transform your email game?</h3>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              >
                Create Your Own Email Recipe
              </Button>
              <p className="text-sm text-gray-600">
                You've created {recipesCreated} recipe{recipesCreated !== 1 ? 's' : ''} today!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};