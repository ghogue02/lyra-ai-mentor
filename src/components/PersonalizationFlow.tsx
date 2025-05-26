
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Heart, Users, Settings, Megaphone, Code, Briefcase } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';

interface PersonalizationFlowProps {
  onComplete: () => void;
}

export const PersonalizationFlow: React.FC<PersonalizationFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    role: '',
    techComfort: '',
    aiExperience: '',
    learningStyle: ''
  });

  const steps = [
    {
      title: "What's your primary role?",
      subtitle: "Help us tailor your learning experience",
      options: [
        { id: 'fundraising', label: 'Fundraising & Development', icon: Heart },
        { id: 'programs', label: 'Programs & Services', icon: Users },
        { id: 'operations', label: 'Operations & Admin', icon: Settings },
        { id: 'marketing', label: 'Marketing & Communications', icon: Megaphone },
        { id: 'it', label: 'IT & Technology', icon: Code },
        { id: 'other', label: 'Other', icon: Briefcase }
      ],
      key: 'role'
    },
    {
      title: "How comfortable are you with new technology?",
      subtitle: "Be honest—there's no wrong answer!",
      options: [
        { id: 'beginner', label: 'I avoid new tools when possible', description: 'Beginner-friendly pace' },
        { id: 'intermediate', label: 'I dabble and experiment sometimes', description: 'Balanced approach' },
        { id: 'advanced', label: 'I enjoy trying new tech weekly', description: 'Fast-paced learning' }
      ],
      key: 'techComfort'
    },
    {
      title: "Any prior experience with AI tools?",
      subtitle: "This helps us set the right starting point",
      options: [
        { id: 'none', label: 'None at all', description: 'We\'ll start from the very beginning' },
        { id: 'little', label: 'A little experimentation', description: 'Quick refresher then dive deeper' },
        { id: 'lots', label: 'I use AI tools regularly', description: 'Focus on advanced applications' }
      ],
      key: 'aiExperience'
    },
    {
      title: "How do you learn best?",
      subtitle: "Let's match your natural learning style",
      options: [
        { id: 'visual', label: 'Visual learner', description: 'Diagrams, charts, and infographics' },
        { id: 'hands-on', label: 'Hands-on practice', description: 'Try things immediately' },
        { id: 'conceptual', label: 'Conceptual understanding', description: 'Deep dives into how things work' },
        { id: 'story', label: 'Story-based examples', description: 'Real scenarios and case studies' }
      ],
      key: 'learningStyle'
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [steps[currentStep].key]: value };
    setAnswers(newAnswers);
    
    setTimeout(() => setCurrentStep(currentStep + 1), 200);
  };

  const currentStepData = steps[currentStep];
  const isComplete = currentStep === steps.length;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <LyraAvatar className="mx-auto mb-6" />
            
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Perfect! I'm excited to be your AI mentor 🎉
            </h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Your Personalized Learning Path:</h3>
              <div className="grid gap-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <Badge variant="secondary">{answers.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tech Comfort:</span>
                  <Badge variant="secondary">{answers.techComfort}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Experience:</span>
                  <Badge variant="secondary">{answers.aiExperience}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Learning Style:</span>
                  <Badge variant="secondary">{answers.learningStyle}</Badge>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8">
              I've tailored the entire course to match your preferences. Ready to unlock AI's potential for your mission?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold"
                onClick={onComplete}
              >
                Start Learning Journey
              </Button>
              
              <Button variant="outline" size="lg" onClick={() => setCurrentStep(0)}>
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <LyraAvatar />
          </div>
          
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <CardTitle className="text-2xl font-bold mb-2">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {currentStepData.subtitle}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentStepData.options.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.id}
                variant="outline"
                className="w-full p-6 h-auto text-left justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 hover:border-purple-300 transition-all duration-200"
                onClick={() => handleAnswer(option.id)}
              >
                <div className="flex items-start gap-4 w-full">
                  {IconComponent && (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-base mb-1">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600">{option.description}</div>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                </div>
              </Button>
            );
          })}
          
          {currentStep > 0 && (
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
