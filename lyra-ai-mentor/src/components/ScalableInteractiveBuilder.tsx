import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CharacterArchetype } from '../services/contentScalingEngine';

interface ScalableInteractiveBuilderProps {
  characterId: string;
  skillName: string;
  builderStages: BuilderStage[];
  timeMetrics: TimeMetrics;
  practicalScenario: string;
  character: CharacterArchetype;
  onComplete?: (result: BuilderResult) => void;
  customizations?: BuilderCustomizations;
}

interface BuilderStage {
  id: string;
  title: string;
  description: string;
  type: 'selection' | 'input' | 'preview' | 'success';
  options?: StageOption[];
  content?: string;
  validationRules?: ValidationRule[];
}

interface StageOption {
  id: string;
  title: string;
  description: string;
  value: any;
  icon?: string;
  recommended?: boolean;
}

interface TimeMetrics {
  before: string;
  after: string;
  savings: string;
  impactDescription: string;
}

interface BuilderResult {
  selections: Record<string, any>;
  generatedContent: string;
  timeToComplete: number;
  qualityScore: number;
}

interface BuilderCustomizations {
  colorScheme?: string;
  progressStyle?: 'steps' | 'bar' | 'dots';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  contextualHelp?: boolean;
}

interface ValidationRule {
  type: 'required' | 'minLength' | 'pattern';
  value: any;
  message: string;
}

const ScalableInteractiveBuilder: React.FC<ScalableInteractiveBuilderProps> = ({
  characterId,
  skillName,
  builderStages,
  timeMetrics,
  practicalScenario,
  character,
  onComplete,
  customizations = {}
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime] = useState(Date.now());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const currentStage = builderStages[currentStageIndex];
  const isLastStage = currentStageIndex === builderStages.length - 1;
  const progressPercentage = ((currentStageIndex + 1) / builderStages.length) * 100;

  // Character-specific theming
  const getCharacterTheme = () => {
    const themes = {
      maya: {
        primary: 'bg-blue-500',
        secondary: 'bg-blue-100',
        accent: 'text-blue-700',
        gradient: 'from-blue-500 to-indigo-600'
      },
      alex: {
        primary: 'bg-green-500',
        secondary: 'bg-green-100',
        accent: 'text-green-700',
        gradient: 'from-green-500 to-emerald-600'
      },
      david: {
        primary: 'bg-purple-500',
        secondary: 'bg-purple-100',
        accent: 'text-purple-700',
        gradient: 'from-purple-500 to-violet-600'
      },
      rachel: {
        primary: 'bg-orange-500',
        secondary: 'bg-orange-100',
        accent: 'text-orange-700',
        gradient: 'from-orange-500 to-red-600'
      },
      sofia: {
        primary: 'bg-pink-500',
        secondary: 'bg-pink-100',
        accent: 'text-pink-700',
        gradient: 'from-pink-500 to-rose-600'
      }
    };
    return themes[characterId as keyof typeof themes] || themes.maya;
  };

  const theme = getCharacterTheme();

  // Validate current stage
  const validateCurrentStage = (): boolean => {
    if (!currentStage.validationRules) return true;

    const errors: Record<string, string> = {};
    const stageValue = selections[currentStage.id];

    currentStage.validationRules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (!stageValue) {
            errors[currentStage.id] = rule.message;
          }
          break;
        case 'minLength':
          if (typeof stageValue === 'string' && stageValue.length < rule.value) {
            errors[currentStage.id] = rule.message;
          }
          break;
        case 'pattern':
          if (typeof stageValue === 'string' && !new RegExp(rule.value).test(stageValue)) {
            errors[currentStage.id] = rule.message;
          }
          break;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle stage selection
  const handleStageSelection = (value: any) => {
    setSelections(prev => ({
      ...prev,
      [currentStage.id]: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      [currentStage.id]: ''
    }));
  };

  // Move to next stage
  const handleNextStage = async () => {
    if (!validateCurrentStage()) return;

    if (isLastStage) {
      await handleComplete();
    } else {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  // Handle completion
  const handleComplete = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate content generation (replace with actual AI service call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: BuilderResult = {
        selections,
        generatedContent: `Generated ${skillName} content based on ${character.name}'s preferences`,
        timeToComplete: Date.now() - startTime,
        qualityScore: 0.92
      };

      setGeneratedContent(result.generatedContent);
      onComplete?.(result);
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Render progress indicator
  const renderProgress = () => {
    const progressStyle = customizations.progressStyle || 'steps';

    switch (progressStyle) {
      case 'bar':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className={`${theme.primary} h-2 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex justify-center space-x-2 mb-6">
            {builderStages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStageIndex ? theme.primary : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        );
      
      default: // steps
        return (
          <div className="flex justify-between items-center mb-6">
            {builderStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                  index < currentStageIndex
                    ? `${theme.primary} text-white`
                    : index === currentStageIndex
                    ? `border-2 border-current ${theme.accent}`
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  {index < currentStageIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < builderStages.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStageIndex ? theme.primary : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  // Render stage content
  const renderStageContent = () => {
    switch (currentStage.type) {
      case 'selection':
        return (
          <div className="space-y-3">
            {currentStage.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleStageSelection(option.value)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                  selections[currentStage.id] === option.value
                    ? `border-current ${theme.accent} ${theme.secondary}`
                    : 'border-gray-200 hover:border-gray-300'
                } ${option.recommended ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{option.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                  {option.recommended && (
                    <Badge variant="secondary" className="ml-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'input':
        return (
          <div className="space-y-4">
            <textarea
              value={selections[currentStage.id] || ''}
              onChange={(e) => handleStageSelection(e.target.value)}
              placeholder={`Enter your ${skillName.toLowerCase()} content...`}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {validationErrors[currentStage.id] && (
              <p className="text-red-600 text-sm">{validationErrors[currentStage.id]}</p>
            )}
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="text-sm text-gray-700">
                {JSON.stringify(selections, null, 2)}
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-16 h-16 border-4 border-t-transparent ${theme.primary} rounded-full animate-spin`} />
                <p className="text-gray-600">Generating your {skillName.toLowerCase()}...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className={`w-16 h-16 mx-auto text-green-500`} />
                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                <p className="text-gray-600">Your {skillName.toLowerCase()} has been created.</p>
                
                {/* Time Savings Display */}
                <div className={`${theme.secondary} p-4 rounded-lg`}>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                      <p className="text-sm text-gray-600">Before</p>
                      <p className="font-bold text-lg">{timeMetrics.before}</p>
                    </div>
                    <ArrowRight className="text-gray-400" />
                    <div className="text-center">
                      <CheckCircle className="w-6 h-6 mx-auto text-green-500 mb-1" />
                      <p className="text-sm text-gray-600">After</p>
                      <p className="font-bold text-lg text-green-600">{timeMetrics.after}</p>
                    </div>
                  </div>
                  <p className="text-center mt-2 font-medium text-green-700">
                    You saved {timeMetrics.savings}!
                  </p>
                  <p className="text-center text-sm text-gray-600 mt-1">
                    {timeMetrics.impactDescription}
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
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full ${theme.primary} flex items-center justify-center text-white font-bold text-lg`}>
            {character.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{character.name}'s {skillName} Builder</span>
              <Badge variant="outline">{character.profession}</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {practicalScenario}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderProgress()}
        
        <div className="min-h-[300px]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStage.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {currentStage.description}
            </p>
          </div>
          
          {renderStageContent()}
        </div>
        
        {currentStage.type !== 'success' && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStageIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStageIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNextStage}
              disabled={!selections[currentStage.id] || Object.keys(validationErrors).length > 0}
              className={`${theme.primary} hover:opacity-90`}
            >
              {isLastStage ? 'Generate' : 'Next'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScalableInteractiveBuilder;