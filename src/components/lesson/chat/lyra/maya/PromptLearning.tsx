import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Users, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptLearningProps {
  mayaJourney: {
    purpose: string;
    selectedAudience: string;
    selectedConsiderations: string[];
  };
  onContinue: () => void;
}

const PromptLearning: React.FC<PromptLearningProps> = ({ mayaJourney, onContinue }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const paceSteps = [
    {
      letter: 'P',
      title: 'Purpose',
      description: 'What do you want to achieve?',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800',
      mayaExample: 'Maya wants to celebrate program success AND secure continued funding',
      improvement: 'Instead of "write an email," specify the exact goal and outcome desired'
    },
    {
      letter: 'A',
      title: 'Audience',
      description: 'Who are you talking to?',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800',
      mayaExample: 'Dr. Williams (data-focused), Sarah (story-focused), Marcus (ROI-focused)',
      improvement: 'Include specific details about audience motivations and communication preferences'
    },
    {
      letter: 'C',
      title: 'Connection',
      description: 'What matters to them?',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800',
      mayaExample: `${mayaJourney.selectedConsiderations.join(', ')}`,
      improvement: 'Tell the AI exactly what motivates your audience and what they care about'
    },
    {
      letter: 'E',
      title: 'Engagement',
      description: 'How do you want them to respond?',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-800',
      mayaExample: 'Schedule follow-up meetings, ask questions, feel excited about the mission',
      improvement: 'Specify the exact tone, format, and response you want to inspire'
    }
  ];

  const currentPaceStep = paceSteps[currentStep];

  return (
    <div className="space-y-6">
      {/* Elena's Introduction */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle>Elena's PACE Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            "Maya, the problem isn't your writing—it's your prompting. You're giving the AI a destination 
            without a map. Let me show you the PACE method that transforms everything."
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Lightbulb className="w-4 h-4" />
            <span>Each letter of PACE builds a more powerful prompt</span>
          </div>
        </CardContent>
      </Card>

      {/* PACE Step Learning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Badge className={currentPaceStep.color}>{currentPaceStep.letter}</Badge>
            <span>{currentPaceStep.title}</span>
            <span className="text-sm text-muted-foreground">
              ({currentStep + 1} of {paceSteps.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {currentPaceStep.icon}
              <h3 className="font-semibold">{currentPaceStep.description}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-2">❌ Maya's Basic Approach</h4>
                <p className="text-sm text-red-700">
                  {currentStep === 0 && "No clear purpose specified"}
                  {currentStep === 1 && "Generic 'board members' - no specifics"}
                  {currentStep === 2 && "Assumes AI knows what matters to them"}
                  {currentStep === 3 && "No engagement strategy or tone guidance"}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 mb-2">✅ Elena's PACE Method</h4>
                <p className="text-sm text-green-700">
                  {currentPaceStep.mayaExample}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Key Insight</h4>
              <p className="text-sm text-blue-700">
                {currentPaceStep.improvement}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {paceSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep ? 'bg-purple-500' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {currentStep < paceSteps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Next Step <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            See the Transformation <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Complete PACE Preview */}
      {currentStep === paceSteps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Maya's Complete PACE Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {paceSteps.map((step, index) => (
                  <div key={step.letter} className="text-center">
                    <Badge className={step.color}>{step.letter}</Badge>
                    <h4 className="font-semibold mt-2">{step.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <p className="text-sm text-center text-purple-800">
                  <strong>Ready to see the magic?</strong> Watch how the same information becomes a completely different email when Maya uses Elena's PACE method.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PromptLearning;