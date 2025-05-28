
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
    <Card className="p-4 bg-white border border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-spin"></div>
          <h3 className="text-gray-700 font-medium">{title}</h3>
        </div>
        
        <Progress value={progress} className="h-2 bg-gray-200" />
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                index === currentStep && isProcessing
                  ? 'text-gray-900 scale-105' 
                  : index < currentStep 
                  ? 'text-green-600' 
                  : 'text-gray-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                index === currentStep && isProcessing
                  ? 'bg-blue-500 animate-pulse' 
                  : index < currentStep 
                  ? 'bg-green-500' 
                  : 'bg-gray-300'
              }`}></div>
              
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                <div className="text-xs opacity-75">{step.description}</div>
              </div>
              
              {index < currentStep && (
                <div className="text-green-500 text-sm">✓</div>
              )}
              {index === currentStep && isProcessing && (
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-gray-500">
          Processing {Math.round(progress)}% complete
        </div>
      </div>
    </Card>
  );
};
