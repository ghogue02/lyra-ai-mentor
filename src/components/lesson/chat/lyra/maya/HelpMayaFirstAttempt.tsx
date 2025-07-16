import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, AlertCircle, Users, Target, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HelpMayaFirstAttemptProps {
  onAttemptComplete: (prompt: string) => void;
}

const HelpMayaFirstAttempt: React.FC<HelpMayaFirstAttemptProps> = ({
  onAttemptComplete
}) => {
  const [userSuggestion, setUserSuggestion] = useState('');
  const [step, setStep] = useState<'instruction' | 'input' | 'result'>('instruction');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const mayaChallenge = "I need to write an email to my manager about missing a critical project deadline";

  const generateBasicEmail = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('maya-prompt-builder', {
        body: {
          purpose: 'addressing a missed deadline',
          audience: 'my manager',
          selectedConsiderations: ['professional tone', 'accountability'],
          promptType: 'basic',
          userPrompt: prompt
        }
      });

      if (error) throw error;
      
      setGeneratedEmail(data.email || 'Error generating email');
    } catch (error) {
      console.error('Error generating email:', error);
      setGeneratedEmail('Sorry, I apologize for the delay. I will submit the project soon.');
    } finally {
      setIsGenerating(false);
      // Show continue button after 5 seconds or when user finishes reading
      setTimeout(() => setShowContinueButton(true), 5000);
    }
  };

  const handleSubmit = () => {
    if (userSuggestion.trim()) {
      setStep('result');
      generateBasicEmail(userSuggestion);
    }
  };

  const handleContinue = () => {
    onAttemptComplete(userSuggestion);
  };

  const renderStep = () => {
    switch (step) {
      case 'instruction':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Help Maya Try Her First Prompt</h3>
              <p className="text-gray-600">
                Maya is stuck staring at her blank email. She wants to try using AI but doesn't know how to ask for help effectively.
              </p>
            </div>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">Maya's Challenge:</h4>
                  </div>
                  <p className="text-sm text-purple-700 bg-white p-3 rounded-lg">
                    "{mayaChallenge}"
                  </p>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <p className="text-sm text-purple-800">
                      💭 <strong>Maya's thinking:</strong> "I heard AI can help with writing, but I have no idea what to ask for. I'll just try something simple..."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={() => setStep('input')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Help Maya Create Her First Prompt
            </Button>
          </div>
        );

      case 'input':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">What Should Maya Ask the AI?</h3>
              <p className="text-gray-600">
                Maya is about to type her first prompt. What would you suggest she ask for?
              </p>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Maya's First AI Prompt</CardTitle>
                <p className="text-sm text-gray-600">
                  Remember: Maya doesn't know about frameworks yet. She'll try something basic.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Help Maya write her prompt:
                    </label>
                    <Input
                      placeholder="e.g., 'Write an email about missing a deadline'"
                      value={userSuggestion}
                      onChange={(e) => setUserSuggestion(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">💡 Common first attempts:</h4>
                    <div className="space-y-2">
                      {[
                        "Write an email about missing a deadline",
                        "Help me write a professional email",
                        "Create an email to my manager about being late",
                        "Write an apology email for missed deadline"
                      ].map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setUserSuggestion(example)}
                          className="text-sm text-blue-600 hover:text-blue-800 block text-left"
                        >
                          "{example}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!userSuggestion.trim()}
                    className="w-full"
                  >
                    Let Maya Try This Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'result':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {isGenerating ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {isGenerating ? "Generating Maya's Email..." : "Maya's Result... Not Great"}
              </h3>
              <p className="text-gray-600">
                {isGenerating ? "The AI is working on Maya's basic prompt..." : "Let's see what happened when Maya tried her basic prompt"}
              </p>
            </div>

            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-red-600" />
                  Maya's Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-3 rounded-lg mb-4">
                  <p className="text-sm font-mono">"{userSuggestion}"</p>
                </div>
                
                {!isGenerating && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">AI Generated Result:</h4>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {generatedEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-red-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">😰 Maya's reaction:</h4>
                      <p className="text-sm text-red-700">
                        "This is terrible! It's so generic and cold. It doesn't explain WHY I'm late, what I'm doing about it, or show that I care about the team. My manager will think I don't take this seriously!"
                      </p>
                    </div>

                    <div className="bg-yellow-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">🤔 What went wrong:</h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• No context about Maya's specific situation</p>
                        <p>• No information about her manager's communication style</p>
                        <p>• No emotional connection or accountability</p>
                        <p>• No specific next steps or solutions</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {!isGenerating && (
              <div className="text-center space-y-4">
                <Badge className="bg-blue-100 text-blue-800">
                  Maya is learning that basic prompts give basic results...
                </Badge>
                
                {showContinueButton ? (
                  <Button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Continue to Learn Better Prompting
                  </Button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Take your time to read Maya's experience...
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HelpMayaFirstAttempt;