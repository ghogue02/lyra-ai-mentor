import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, HelpCircle, Target } from 'lucide-react';

interface StepGuidanceProps {
  title: string;
  description: string;
  tips?: string[];
  currentStep: number;
  totalSteps: number;
  stepType?: 'weighting' | 'scoring' | 'setup' | 'analysis';
  characterName?: string;
}

export const StepGuidance: React.FC<StepGuidanceProps> = ({
  title,
  description,
  tips = [],
  currentStep,
  totalSteps,
  stepType,
  characterName = 'Sofia'
}) => {
  const getStepTypeInfo = () => {
    switch (stepType) {
      case 'weighting':
        return {
          icon: <Target className="w-5 h-5 text-primary" />,
          color: 'bg-primary/10 border-primary/20',
          explanation: "This is weighting - how important each criterion is compared to others. Think priority level."
        };
      case 'scoring':
        return {
          icon: <HelpCircle className="w-5 h-5 text-blue-600" />,
          color: 'bg-blue-50 border-blue-200',
          explanation: "This is scoring - how well each option performs on this specific criterion. Think performance rating."
        };
      case 'setup':
        return {
          icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
          color: 'bg-amber-50 border-amber-200',
          explanation: "Choose a realistic scenario to understand how this tool applies to your work."
        };
      case 'analysis':
        return {
          icon: <Target className="w-5 h-5 text-green-600" />,
          color: 'bg-green-50 border-green-200',
          explanation: "Review the results and generate actionable recommendations for your team."
        };
      default:
        return {
          icon: <Lightbulb className="w-5 h-5 text-primary" />,
          color: 'bg-primary/10 border-primary/20',
          explanation: ""
        };
    }
  };

  const { icon, color, explanation } = getStepTypeInfo();

  return (
    <Card className={`border-2 ${color} mb-6`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{icon}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{title}</h3>
              <Badge variant="outline" className="text-xs">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
            
            {explanation && (
              <div className="text-sm font-medium text-foreground bg-background/50 p-2 rounded border border-dashed">
                💡 {explanation}
              </div>
            )}
            
            {tips.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">{characterName}'s Tips:</span>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};