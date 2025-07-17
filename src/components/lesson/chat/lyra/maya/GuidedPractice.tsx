import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Lightbulb, Target, Users, Heart, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface PACEFramework {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
}

interface GuidedPracticeProps {
  challenge: string;
  onPracticeComplete: (pace: PACEFramework, finalPrompt: string) => void;
  showMayaExample?: boolean;
  mayaExample?: {
    challenge: string;
    pace: PACEFramework;
    prompt: string;
  };
}

const GuidedPractice: React.FC<GuidedPracticeProps> = ({
  challenge,
  onPracticeComplete,
  showMayaExample = false,
  mayaExample
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'purpose' | 'audience' | 'connection' | 'engagement' | 'generate' | 'review'>('intro');
  const [pace, setPace] = useState<PACEFramework>({
    Purpose: '',
    Audience: '',
    Connection: '',
    Engagement: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const paceSteps = [
    {
      key: 'Purpose' as keyof PACEFramework,
      title: 'Purpose',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      description: 'What specific outcome do you want to achieve?',
      placeholder: 'e.g., "I want to inform my team about project delays while maintaining their confidence and providing clear next steps"',
      examples: [
        'I want to inform my team about project delays while maintaining their confidence and providing clear recovery steps',
        'I want to persuade stakeholders to approve additional budget by demonstrating clear ROI and risk mitigation',
        'I want to explain technical concepts to non-technical clients while ensuring they feel informed and confident',
        'I want to request deadline extensions from my manager while showing accountability and alternative solutions'
      ]
    },
    {
      key: 'Audience' as keyof PACEFramework,
      title: 'Audience',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      description: 'Who exactly are you communicating with?',
      placeholder: 'e.g., "My direct manager and team members who are expecting deliverables this week"',
      examples: [
        'Busy executives who need quick decisions and focus primarily on business impact and bottom-line results',
        'Technical team members who appreciate detailed specifications and prefer thorough analysis before implementation',
        'External clients who value transparency and need reassurance about project progress and deliverable quality',
        'Concerned stakeholders who are invested in project success and need regular updates to maintain confidence'
      ]
    },
    {
      key: 'Connection' as keyof PACEFramework,
      title: 'Connection',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      description: 'How should you connect emotionally and build rapport?',
      placeholder: 'e.g., "Acknowledge their concerns, show accountability, and demonstrate that I understand the impact"',
      examples: [
        'Show empathy by acknowledging their concerns and demonstrating that I understand the impact on their work',
        'Acknowledge their expertise by referencing their past successes and asking for their insights on solutions',
        'Demonstrate shared values by emphasizing our common goals and commitment to delivering quality results',
        'Build trust by being transparent about challenges, taking accountability, and showing consistent follow-through'
      ]
    },
    {
      key: 'Engagement' as keyof PACEFramework,
      title: 'Engagement',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      description: 'How will you make it compelling and actionable?',
      placeholder: 'e.g., "Use clear structure, specific timelines, and end with concrete next steps they can take"',
      examples: [
        'End with a clear call-to-action that specifies exactly what I need from them and by when',
        'Include specific examples and concrete data points that make the situation tangible and relatable',
        'Highlight compelling benefits that directly address their priorities and show clear value proposition',
        'Provide easy next steps with specific timelines and clear ownership to ensure smooth execution'
      ]
    }
  ];

  const getCurrentStepData = () => {
    return paceSteps.find(step => step.key.toLowerCase() === currentStep);
  };

  const handleStepComplete = (value: string) => {
    setPace(prev => ({
      ...prev,
      [currentStep.charAt(0).toUpperCase() + currentStep.slice(1)]: value
    }));

    const currentIndex = paceSteps.findIndex(step => step.key.toLowerCase() === currentStep);
    if (currentIndex < paceSteps.length - 1) {
      setCurrentStep(paceSteps[currentIndex + 1].key.toLowerCase() as any);
    } else {
      setCurrentStep('generate');
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prompt = `Write a professional communication about: ${challenge}

Purpose: ${pace.Purpose}
Audience: ${pace.Audience}
Connection: ${pace.Connection}
Engagement: ${pace.Engagement}

Please craft a message that:
1. Clearly states the purpose and main points
2. Addresses the specific audience's needs and concerns
3. Builds appropriate emotional connection and rapport
4. Includes engaging elements and clear next steps
5. Maintains a professional yet personable tone

Structure the response with clear sections and make it actionable.`;

    setGeneratedPrompt(prompt);
    setIsGenerating(false);
    setCurrentStep('review');
  };

  const handleComplete = () => {
    onPracticeComplete(pace, generatedPrompt);
  };

  const renderStep = () => {
    if (currentStep === 'intro') {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Let's Build Your PACE Prompt</h3>
            <p className="text-gray-600">
              Just like Elena taught Maya, we'll work through each element of the PACE framework to create your perfect prompt.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Your Challenge:</h4>
            <p className="text-sm text-purple-700">{challenge}</p>
          </div>
          <Button
            onClick={() => setCurrentStep('purpose')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Start with Purpose
          </Button>
        </div>
      );
    }

    if (currentStep === 'generate') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">PACE Framework Complete!</h3>
            <p className="text-gray-600">Ready to generate your personalized prompt?</p>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">Your PACE Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paceSteps.map((step, index) => (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.bgColor.replace('from-', 'from-').replace('to-', 'to-').replace('50', '500').replace('100', '600')} flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-600">{pace[step.key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={generatePrompt}
            disabled={isGenerating}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isGenerating ? 'Generating Your Prompt...' : 'Generate My Prompt'}
          </Button>
        </div>
      );
    }

    if (currentStep === 'review') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your Prompt is Ready!</h3>
            <p className="text-gray-600">Review and use your personalized AI prompt</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Generated Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {generatedPrompt}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Perfect! Let's Continue
          </Button>
        </div>
      );
    }

    const stepData = getCurrentStepData();
    if (!stepData) return null;

    const StepIcon = stepData.icon;
    const currentValue = pace[stepData.key];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${stepData.bgColor.replace('50', '500').replace('100', '600')} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">{stepData.title}</h3>
          <p className="text-gray-600">{stepData.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Define your {stepData.title.toLowerCase()}:
            </label>
            <Textarea
              placeholder={stepData.placeholder}
              value={currentValue}
              onChange={(e) => setPace(prev => ({ ...prev, [stepData.key]: e.target.value }))}
              className="min-h-24"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Need inspiration? Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {stepData.examples.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setPace(prev => ({ ...prev, [stepData.key]: example }))}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleStepComplete(currentValue)}
            disabled={!currentValue.trim()}
            size="lg"
            className="w-full"
          >
            Continue to {paceSteps.find(s => s.key.toLowerCase() === currentStep)?.title === 'Engagement' ? 'Generate' : paceSteps[paceSteps.findIndex(s => s.key.toLowerCase() === currentStep) + 1]?.title}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      {currentStep !== 'intro' && currentStep !== 'generate' && currentStep !== 'review' && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {paceSteps.map((step, index) => (
              <div
                key={step.key}
                className={`w-3 h-3 rounded-full ${
                  step.key.toLowerCase() === currentStep
                    ? 'bg-purple-600'
                    : pace[step.key]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Maya's Example */}
      {showMayaExample && mayaExample && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Maya's Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Challenge:</h4>
                  <p className="text-sm text-gray-700">{mayaExample.challenge}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {paceSteps.map((step) => (
                    <div key={step.key} className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-xs text-purple-800">{step.title}:</h4>
                      <p className="text-xs text-gray-600">{mayaExample.pace[step.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default GuidedPractice;