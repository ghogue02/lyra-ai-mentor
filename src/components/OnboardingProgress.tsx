
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from 'lucide-react';

interface OnboardingProgressProps {
  profileCompleted: boolean;
  firstChapterStarted: boolean;
  firstChapterCompleted: boolean;
  onboardingStep: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  profileCompleted,
  firstChapterStarted,
  firstChapterCompleted,
  onboardingStep
}) => {
  const steps = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Fill out your personal and organization details",
      iconSrc: "/lovable-uploads/6ded9c9c-9b78-4ce7-b2d9-fa4c8b0b2f3e.png",
      completed: profileCompleted,
      current: onboardingStep === 1 && !profileCompleted
    },
    {
      id: 2,
      title: "Start Your First Chapter",
      description: "Begin your AI learning journey",
      iconSrc: "/lovable-uploads/c4ca451a-4e36-4b11-8d9b-e4e0bf70bb95.png",
      completed: firstChapterStarted,
      current: onboardingStep === 2 && profileCompleted && !firstChapterStarted
    },
    {
      id: 3,
      title: "Complete Your First Chapter",
      description: "Finish Chapter 1: What Is AI Anyway?",
      iconSrc: "/lovable-uploads/77c0e73b-e754-4a08-aefb-96be00aac64a.png",
      completed: firstChapterCompleted,
      current: onboardingStep === 3 && firstChapterStarted && !firstChapterCompleted
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Getting Started</h3>
            <p className="text-sm text-gray-600">Complete these steps to unlock your full learning experience</p>
          </div>
          <Badge variant={completedSteps === 3 ? "default" : "secondary"} className="px-3 py-1">
            {completedSteps} of 3 Complete
          </Badge>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            return (
              <div 
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  step.current 
                    ? 'bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200' 
                    : step.completed 
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  step.completed 
                    ? 'bg-green-100' 
                    : step.current 
                      ? 'bg-gradient-to-r from-purple-100 to-cyan-100'
                      : 'bg-gray-100'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <img 
                      src={step.iconSrc} 
                      alt={step.title}
                      className={`w-4 h-4 object-contain ${
                        step.current ? 'opacity-100' : 'opacity-40'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${
                    step.completed ? 'text-green-800' : step.current ? 'text-purple-800' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    step.completed ? 'text-green-600' : step.current ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {completedSteps === 3 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">🎉 Congratulations! You've completed onboarding!</p>
            <p className="text-green-600 text-sm mt-1">All chapters are now unlocked. Continue your AI learning journey!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
