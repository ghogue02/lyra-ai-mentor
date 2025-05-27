import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonalizationData } from '@/hooks/usePersonalizationData';
import { useNavigate } from 'react-router-dom';
import { getUserRoleIconUrl, getRoleMessaging } from '@/utils/supabaseIcons';

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
  
  const { user } = useAuth();
  const { savePersonalizationData, loading } = usePersonalizationData();
  const navigate = useNavigate();

  const steps = [
    {
      title: "What's your primary role?",
      subtitle: "Help us tailor your learning experience",
      lyraExpression: 'helping' as const,
      options: [
        { id: 'fundraising', label: 'Fundraising & Development', description: 'Grant writing, donor relations, campaigns' },
        { id: 'programs', label: 'Programs & Services', description: 'Direct service delivery, program management' },
        { id: 'operations', label: 'Operations & Admin', description: 'HR, finance, general administration' },
        { id: 'marketing', label: 'Marketing & Communications', description: 'Outreach, social media, content creation' },
        { id: 'it', label: 'IT & Technology', description: 'Tech support, digital infrastructure' },
        { id: 'other', label: 'Leadership & Other', description: 'Executive, board, volunteer roles' }
      ],
      key: 'role'
    },
    {
      title: "How comfortable are you with new technology?",
      subtitle: "Be honest—there's no wrong answer!",
      lyraExpression: 'thinking' as const,
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
      lyraExpression: 'thinking' as const,
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
      lyraExpression: 'helping' as const,
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

  const handleBackToHome = () => {
    onComplete(); // Close the personalization flow to return to home page
  };

  const handleComplete = async () => {
    // Convert answers to match database field names
    const personalizationData = {
      role: answers.role,
      tech_comfort: answers.techComfort,
      ai_experience: answers.aiExperience,
      learning_style: answers.learningStyle
    };

    if (user) {
      // User is logged in, save data and go to dashboard
      await savePersonalizationData(personalizationData, user.id);
      navigate('/dashboard');
    } else {
      // User not logged in, save data temporarily and redirect to auth
      localStorage.setItem('pendingPersonalization', JSON.stringify(personalizationData));
      navigate('/auth');
    }
  };

  const currentStepData = steps[currentStep];
  const isComplete = currentStep === steps.length;
  const roleMessaging = answers.role ? getRoleMessaging(answers.role) : null;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center spacing-mobile">
        <Card className="max-w-2xl w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="mobile-card text-center">
            {/* Back to Home button */}
            <div className="flex justify-start mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </div>

            <LyraAvatar 
              className="mx-auto mb-6" 
              expression="celebrating"
              size="lg"
            />
            
            <h2 className="text-3xl font-bold mb-4 text-purple-600 text-wrap-safe">
              Perfect! Your Learning Path is Ready 🎯
            </h2>
            
            {roleMessaging && (
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg mb-2 text-wrap-safe">{roleMessaging.welcomeMessage}</h3>
                <p className="text-gray-700 mb-2 text-wrap-safe">{roleMessaging.examples}</p>
                <p className="text-sm text-purple-600 font-medium text-wrap-safe">{roleMessaging.successMetric}</p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Your Personalized Learning Path:</h3>
              <div className="grid gap-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Role:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img 
                        src={getUserRoleIconUrl(answers.role as any)} 
                        alt={`${answers.role} role`}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <Badge variant="secondary">{answers.role}</Badge>
                  </div>
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
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium mb-2 text-wrap-safe">
                🚀 Next Step: Create Your Free Account
              </p>
              <p className="text-blue-700 text-sm text-wrap-safe">
                Save your personalized learning path and complete your profile to start your AI journey.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold"
                onClick={handleComplete}
                disabled={loading}
              >
                {loading ? 'Saving...' : (user ? 'Continue to Dashboard' : 'Create Free Account')}
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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center spacing-mobile">
      <Card className="max-w-2xl w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          {/* Back to Home button */}
          <div className="flex justify-start mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </div>

          <div className="flex justify-center mb-4">
            <LyraAvatar expression={currentStepData.lyraExpression} />
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
          
          <CardTitle className="text-2xl font-bold mb-2 text-wrap-safe">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-lg text-wrap-safe">
            {currentStepData.subtitle}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 mobile-card">
          {currentStepData.options.map((option) => {
            const isRoleStep = currentStepData.key === 'role';
            return (
              <Button
                key={option.id}
                variant="outline"
                className="w-full p-4 sm:p-6 h-auto text-left justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 hover:border-purple-300 transition-all duration-200"
                onClick={() => handleAnswer(option.id)}
              >
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  {isRoleStep && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border border-gray-100">
                      <img 
                        src={getUserRoleIconUrl(option.id as any)} 
                        alt={`${option.label} role`}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base mb-1 text-wrap-safe">{option.label}</div>
                    {option.description && (
                      <div className="text-xs sm:text-sm text-gray-600 text-wrap-safe">{option.description}</div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-2" />
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
