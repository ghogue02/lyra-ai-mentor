import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Copy, 
  RefreshCw, 
  Sparkles,
  FileText,
  Users,
  Target,
  ChevronRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { LearningPath } from '@/components/learning/LearningPath';
import { StreamingTextArea } from '@/components/ui/StreamingTextArea';
import { enhancedAIService } from '@/services/enhancedAIService';

interface EmailIngredient {
  type: 'tone' | 'recipient' | 'purpose';
  label: string;
  emoji: string;
  description: string;
}

const toneOptions: EmailIngredient[] = [
  { type: 'tone', label: 'Professional & Friendly', emoji: '🤝', description: 'Warm but respectful' },
  { type: 'tone', label: 'Empathetic & Caring', emoji: '💗', description: 'Shows understanding' },
  { type: 'tone', label: 'Clear & Direct', emoji: '🎯', description: 'Gets to the point' },
];

const recipientOptions: EmailIngredient[] = [
  { type: 'recipient', label: 'Concerned Parent', emoji: '👨‍👩‍👧', description: 'Needs reassurance' },
  { type: 'recipient', label: 'Potential Donor', emoji: '💰', description: 'Interested in impact' },
  { type: 'recipient', label: 'Team Member', emoji: '👥', description: 'Internal communication' },
];

const purposeOptions: EmailIngredient[] = [
  { type: 'purpose', label: 'Address Concern', emoji: '💬', description: 'Respond to worries' },
  { type: 'purpose', label: 'Share Update', emoji: '📢', description: 'Inform progress' },
  { type: 'purpose', label: 'Express Thanks', emoji: '🙏', description: 'Show appreciation' },
];

export const MayaEmailLearningPath: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<{
    tone?: EmailIngredient;
    recipient?: EmailIngredient;
    purpose?: EmailIngredient;
  }>({});
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [practicePrompt, setPracticePrompt] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const objectives = [
    {
      id: '1',
      title: 'Master the Email Recipe Method',
      description: 'Learn how to break down any email into 3 simple ingredients'
    },
    {
      id: '2',
      title: 'Write with AI Confidence',
      description: 'Use AI to generate professional emails in seconds, not minutes'
    },
    {
      id: '3',
      title: 'Personalize Your Voice',
      description: 'Adapt AI suggestions to match your authentic communication style'
    }
  ];

  const steps = [
    {
      id: 'learn',
      title: 'Learn Email Recipe',
      duration: '30 seconds',
      type: 'learn' as const,
      content: null,
      completed: false
    },
    {
      id: 'practice',
      title: 'Build Your Recipe',
      duration: '2 minutes',
      type: 'practice' as const,
      content: null,
      completed: false
    },
    {
      id: 'apply',
      title: 'Generate & Customize',
      duration: '2.5 minutes',
      type: 'apply' as const,
      content: null,
      completed: false
    }
  ];

  const tips = [
    { id: '1', tip: 'Think of AI prompts like recipes - be specific about your ingredients!', emoji: '👩‍🍳' },
    { id: '2', tip: 'Adding "step by step" to prompts helps AI organize thoughts clearly', emoji: '📝' },
    { id: '3', tip: 'Instead of "formal", try "professional but friendly" for better results', emoji: '🎯' },
    { id: '4', tip: 'Always include WHO you\'re writing to - AI adjusts tone automatically', emoji: '👥' },
    { id: '5', tip: 'Start prompts with context: "I\'m a nonprofit director writing to..."', emoji: '💡' }
  ];

  const handleSelectIngredient = (ingredient: EmailIngredient) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [ingredient.type]: ingredient
    }));
  };

  const generateEmail = async () => {
    if (!selectedIngredients.tone || !selectedIngredients.recipient || !selectedIngredients.purpose) {
      toast.error('Please select all three ingredients first!');
      return;
    }

    setIsGenerating(true);
    try {
      const email = await enhancedAIService.generateEmail({
        tone: selectedIngredients.tone.label,
        recipient: selectedIngredients.recipient.label,
        purpose: selectedIngredients.purpose.label,
        context: 'after-school program'
      });
      setGeneratedEmail(email);
      toast.success('Email generated successfully!');
    } catch (error) {
      // Fallback email
      setGeneratedEmail(`Dear ${selectedIngredients.recipient.label},

I hope this message finds you well. I wanted to reach out regarding your recent inquiry about our after-school programs.

[Your AI-powered email content would appear here, perfectly crafted with your selected tone, recipient awareness, and clear purpose]

Thank you for your continued support and interest in our mission.

Best regards,
[Your name]`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard!');
  };

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'learn':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                The Email Recipe Method
              </h3>
              <p className="text-gray-700 mb-4">
                Writing emails doesn't have to be stressful! Think of every email as a simple recipe with just 3 ingredients:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-700">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Tone (How you say it)</p>
                    <p className="text-sm text-gray-600">Like choosing between a handshake or a hug</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Recipient (Who you're talking to)</p>
                    <p className="text-sm text-gray-600">Different people need different approaches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-700">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Purpose (Why you're writing)</p>
                    <p className="text-sm text-gray-600">One clear goal per email works best</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Real Example:</p>
                    <p className="text-sm text-purple-700 mt-1">
                      "I need to email a worried parent (RECIPIENT) to address their concerns (PURPOSE) 
                      in a warm, understanding way (TONE)"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Let's Build Your Email Recipe!</h3>
              <p className="text-gray-600 mt-1">Select one ingredient from each category</p>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-700">1</span>
                </div>
                Choose Your Tone
              </h4>
              <div className="grid gap-2">
                {toneOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedIngredients.tone?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectIngredient(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recipient Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">2</span>
                </div>
                Choose Your Recipient
              </h4>
              <div className="grid gap-2">
                {recipientOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedIngredients.recipient?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectIngredient(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Purpose Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-700">3</span>
                </div>
                Choose Your Purpose
              </h4>
              <div className="grid gap-2">
                {purposeOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedIngredients.purpose?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectIngredient(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recipe Preview */}
            {Object.keys(selectedIngredients).length > 0 && (
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Your Recipe So Far:</h4>
                  <div className="space-y-1 text-sm">
                    {selectedIngredients.tone && (
                      <p>✓ Tone: {selectedIngredients.tone.label} {selectedIngredients.tone.emoji}</p>
                    )}
                    {selectedIngredients.recipient && (
                      <p>✓ Recipient: {selectedIngredients.recipient.label} {selectedIngredients.recipient.emoji}</p>
                    )}
                    {selectedIngredients.purpose && (
                      <p>✓ Purpose: {selectedIngredients.purpose.label} {selectedIngredients.purpose.emoji}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-6">
            {!generatedEmail ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Ready to Generate Your Email!</h3>
                <p className="text-gray-600">
                  Your AI assistant will craft a perfect email using your recipe
                </p>
                
                {/* Show selected recipe */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 max-w-md mx-auto">
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span>Tone:</span>
                        <span className="font-medium">
                          {selectedIngredients.tone?.label} {selectedIngredients.tone?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Recipient:</span>
                        <span className="font-medium">
                          {selectedIngredients.recipient?.label} {selectedIngredients.recipient?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Purpose:</span>
                        <span className="font-medium">
                          {selectedIngredients.purpose?.label} {selectedIngredients.purpose?.emoji}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={generateEmail}
                  disabled={isGenerating || !selectedIngredients.tone || !selectedIngredients.recipient || !selectedIngredients.purpose}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      AI is writing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Generate Email
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>💡 What happens next:</strong> AI will write a complete email based on your recipe. 
                    You can then copy it, customize it, or try a different recipe!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your AI-Generated Email</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ready to use
                  </Badge>
                </div>

                {/* Email Preview */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {generatedEmail}
                    </pre>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={copyEmail} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Email
                  </Button>
                  <Button 
                    onClick={() => {
                      setGeneratedEmail('');
                      setSelectedIngredients({});
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try New Recipe
                  </Button>
                </div>

                {/* Learning Reinforcement */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium text-green-900 mb-2">
                      🎉 You just saved 27 minutes!
                    </h4>
                    <p className="text-sm text-green-800">
                      Traditional email writing: ~32 minutes<br />
                      Your time with AI: ~5 minutes<br />
                      <strong>That's 84% faster!</strong>
                    </p>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 mb-3">Want to make it even better?</p>
                  <p className="text-sm text-gray-500">
                    Try editing the AI's draft to add your personal touch, or generate another version with a different recipe!
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LearningPath
      title="Email Mastery in 5 Minutes"
      skill="AI-Powered Email Writing"
      estimatedMinutes={5}
      objectives={objectives}
      steps={steps}
      tips={tips}
      onComplete={(data) => {
        console.log('Learning path completed:', data);
        toast.success('Congratulations! You\'ve mastered AI email writing!');
      }}
    >
      {renderStepContent(steps.find(s => !s.completed)?.id || 'learn')}
    </LearningPath>
  );
};