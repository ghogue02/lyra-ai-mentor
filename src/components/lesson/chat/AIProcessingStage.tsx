
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProcessingStep {
  name: string;
  description: string;
  duration: number;
}

interface AIProcessingStageProps {
  title: string;
  steps: ProcessingStep[];
  isVisible: boolean;
  onComplete?: () => void;
}

export const AIProcessingStage: React.FC<AIProcessingStageProps> = ({
  title,
  steps,
  isVisible,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    
    const processSteps = async () => {
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        setCurrentStep(stepIndex);
        
        const step = steps[stepIndex];
        const stepDuration = step.duration;
        const progressSteps = 20;
        const progressIncrement = 100 / progressSteps;
        
        // Animate progress for this step
        for (let i = 0; i <= progressSteps; i++) {
          const stepProgress = (stepIndex * 100 + i * progressIncrement) / steps.length;
          setProgress(stepProgress);
          await new Promise(resolve => setTimeout(resolve, stepDuration / progressSteps));
        }
      }
      
      setIsProcessing(false);
      onComplete?.();
    };

    processSteps();
  }, [isVisible, steps, onComplete]);

  if (!isVisible) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-spin"></div>
          <h3 className="text-purple-300 font-semibold">{title}</h3>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                index === currentStep && isProcessing
                  ? 'text-white scale-105' 
                  : index < currentStep 
                  ? 'text-green-400' 
                  : 'text-gray-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                index === currentStep && isProcessing
                  ? 'bg-purple-400 animate-pulse' 
                  : index < currentStep 
                  ? 'bg-green-400' 
                  : 'bg-gray-600'
              }`}></div>
              
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                <div className="text-xs opacity-70">{step.description}</div>
              </div>
              
              {index < currentStep && (
                <div className="text-green-400">✓</div>
              )}
              {index === currentStep && isProcessing && (
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-purple-300/70">
          Processing {Math.round(progress)}% complete
        </div>
      </div>
    </Card>
  );
};
