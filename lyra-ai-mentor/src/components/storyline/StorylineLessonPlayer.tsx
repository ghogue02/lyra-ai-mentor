/**
 * STORYLINE LESSON PLAYER
 * Complete storyline-driven lessons with DreamWorks narrative + AI prompting practice
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, ArrowRight, RotateCcw, CheckCircle, AlertTriangle, 
  Lightbulb, Target, BookOpen, MessageSquare, Wand2
} from 'lucide-react';
import { 
  StorylineLesson, 
  PracticeStage, 
  ChoiceOption, 
  TemplateField
} from '@/config/storyLineLearningSystem';
import { LiveAIService } from '@/services/liveAIService';
import { toast } from '@/hooks/use-toast';

interface StorylineLessonPlayerProps {
  lesson: StorylineLesson;
  onComplete: (results: LessonResults) => void;
}

interface LessonResults {
  lessonId: string;
  completed: boolean;
  score: number;
  promptQuality: number;
  outputQuality: number;
  decisions: Record<string, string>;
  generatedContent: string[];
  timeSpent: number;
  retryCount: number;
}

interface StageState {
  currentStageIndex: number;
  userChoices: Record<string, string>;
  generatedOutputs: Record<string, string>;
  promptAttempts: Record<string, string[]>;
  evaluationResults: Record<string, any>;
}

export const StorylineLessonPlayer: React.FC<StorylineLessonPlayerProps> = ({
  lesson,
  onComplete
}) => {
  const [showNarrative, setShowNarrative] = useState(true);
  const [stageState, setStageState] = useState<StageState>({
    currentStageIndex: 0,
    userChoices: {},
    generatedOutputs: {},
    promptAttempts: {},
    evaluationResults: {}
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime] = useState(Date.now());
  const [retryCount, setRetryCount] = useState(0);
  const [liveAI] = useState(() => LiveAIService.getInstance());

  const currentStage = lesson.practiceFlow[stageState.currentStageIndex];
  const isLastStage = stageState.currentStageIndex === lesson.practiceFlow.length - 1;
  const progressPercentage = ((stageState.currentStageIndex + 1) / lesson.practiceFlow.length) * 100;

  const handleStartLesson = () => {
    setShowNarrative(false);
    toast({
      title: "Lesson Started! 🎬",
      description: `Beginning ${lesson.title} with ${lesson.character}`,
      variant: "default"
    });
  };

  const handleStaticChoice = (option: ChoiceOption) => {
    const newChoices = {
      ...stageState.userChoices,
      [currentStage.id]: option.id
    };
    
    setStageState(prev => ({
      ...prev,
      userChoices: newChoices
    }));

    // Show immediate feedback
    toast({
      title: option.isOptimal ? "Great Choice! ✅" : "Interesting Choice 🤔",
      description: option.feedback,
      variant: option.isOptimal ? "default" : "default"
    });

    // Auto-advance after brief delay
    setTimeout(() => {
      if (option.leadsToStage) {
        // Handle branching logic
        const targetStageIndex = lesson.practiceFlow.findIndex(s => s.id === option.leadsToStage);
        if (targetStageIndex !== -1) {
          setStageState(prev => ({ ...prev, currentStageIndex: targetStageIndex }));
          return;
        }
      }
      
      // Default: advance to next stage
      setStageState(prev => ({ 
        ...prev, 
        currentStageIndex: Math.min(prev.currentStageIndex + 1, lesson.practiceFlow.length - 1)
      }));
    }, 2000);
  };

  const handleTemplateSubmit = (templateData: Record<string, string>) => {
    const completedTemplate = currentStage.content.template || '';
    let filledTemplate = completedTemplate;
    
    // Replace template fields with user input
    Object.entries(templateData).forEach(([field, value]) => {
      filledTemplate = filledTemplate.replace(new RegExp(`\\[${field}\\]`, 'g'), value);
    });

    setStageState(prev => ({
      ...prev,
      userChoices: { ...prev.userChoices, [currentStage.id]: filledTemplate },
      generatedOutputs: { ...prev.generatedOutputs, [currentStage.id]: filledTemplate }
    }));

    toast({
      title: "Template Completed! 📝",
      description: "Your prompt template is ready for AI generation.",
      variant: "default"
    });

    // Auto-advance
    setTimeout(() => {
      setStageState(prev => ({ 
        ...prev, 
        currentStageIndex: Math.min(prev.currentStageIndex + 1, lesson.practiceFlow.length - 1)
      }));
    }, 1500);
  };

  const handleAIPrompting = async (userPrompt: string) => {
    setIsProcessing(true);
    
    try {
      // Generate AI output based on user's prompt
      const aiResponse = await liveAI.executeInteraction({
        id: `storyline_ai_${Date.now()}`,
        type: 'email-composer', // Use email composer for text generation
        prompt: userPrompt,
        character: lesson.character,
        timestamp: new Date()
      });

      // Store both prompt and output
      setStageState(prev => ({
        ...prev,
        userChoices: { ...prev.userChoices, [currentStage.id]: userPrompt },
        generatedOutputs: { ...prev.generatedOutputs, [currentStage.id]: aiResponse },
        promptAttempts: {
          ...prev.promptAttempts,
          [currentStage.id]: [...(prev.promptAttempts[currentStage.id] || []), userPrompt]
        }
      }));

      // Evaluate prompt quality and output
      const evaluation = await evaluateStage(currentStage, userPrompt, aiResponse);
      
      setStageState(prev => ({
        ...prev,
        evaluationResults: { ...prev.evaluationResults, [currentStage.id]: evaluation }
      }));

      toast({
        title: "AI Generation Complete! 🤖",
        description: `Generated content ready for review. Quality score: ${evaluation.score}/10`,
        variant: "default"
      });

    } catch (error) {
      console.error('AI prompting failed:', error);
      toast({
        title: "Generation Failed",
        description: "AI generation failed. Please try again with a different prompt.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const evaluateStage = async (stage: PracticeStage, userPrompt: string, aiOutput: string) => {
    // Simple evaluation logic - in real implementation, this would use AI evaluation
    const promptQuality = userPrompt.length > 100 ? 8 : userPrompt.length > 50 ? 6 : 4;
    const outputQuality = aiOutput.length > 200 ? 8 : aiOutput.length > 100 ? 6 : 4;
    const overallScore = (promptQuality + outputQuality) / 2;

    return {
      score: overallScore,
      promptQuality,
      outputQuality,
      feedback: overallScore >= 7 ? "Excellent work!" : overallScore >= 5 ? "Good progress!" : "Needs improvement",
      suggestions: overallScore < 7 ? ["Add more context to your prompt", "Be more specific about desired outcome"] : []
    };
  };

  const handleAdvanceStage = () => {
    if (isLastStage) {
      handleCompleteLesson();
    } else {
      setStageState(prev => ({ 
        ...prev, 
        currentStageIndex: prev.currentStageIndex + 1
      }));
    }
  };

  const handleCompleteLesson = () => {
    const timeSpent = (Date.now() - startTime) / 1000 / 60; // minutes
    const evaluations = Object.values(stageState.evaluationResults);
    const avgScore = evaluations.length > 0 
      ? evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.score, 0) / evaluations.length
      : 8;

    const results: LessonResults = {
      lessonId: lesson.id,
      completed: true,
      score: avgScore,
      promptQuality: evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.promptQuality, 0) / evaluations.length || 8,
      outputQuality: evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.outputQuality, 0) / evaluations.length || 8,
      decisions: stageState.userChoices,
      generatedContent: Object.values(stageState.generatedOutputs),
      timeSpent,
      retryCount
    };

    onComplete(results);
  };

  if (showNarrative) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <NarrativeIntro lesson={lesson} onStart={handleStartLesson} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600">with {lesson.character} • Stage {stageState.currentStageIndex + 1} of {lesson.practiceFlow.length}</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Current Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StageIcon type={currentStage.type} />
            {currentStage.title}
          </CardTitle>
          <p className="text-gray-600">{currentStage.description}</p>
        </CardHeader>
        <CardContent>
          <StageRenderer 
            stage={currentStage}
            onStaticChoice={handleStaticChoice}
            onTemplateSubmit={handleTemplateSubmit}
            onAIPrompting={handleAIPrompting}
            onAdvance={handleAdvanceStage}
            isProcessing={isProcessing}
            stageResults={stageState.evaluationResults[currentStage.id]}
            generatedOutput={stageState.generatedOutputs[currentStage.id]}
          />
        </CardContent>
      </Card>

      {/* Previous Outputs Preview */}
      {Object.keys(stageState.generatedOutputs).length > 0 && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Your Work So Far</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(stageState.generatedOutputs).map(([stageId, output]) => (
                <div key={stageId} className="bg-white p-3 rounded border text-sm">
                  <strong>{lesson.practiceFlow.find(s => s.id === stageId)?.title}:</strong>
                  <p className="mt-1 text-gray-700 line-clamp-3">{output}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StageIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'static-choice': return <Target className="h-5 w-5 text-blue-600" />;
    case 'template-building': return <BookOpen className="h-5 w-5 text-green-600" />;
    case 'ai-prompting': return <Wand2 className="h-5 w-5 text-purple-600" />;
    case 'output-review': return <CheckCircle className="h-5 w-5 text-orange-600" />;
    case 'branching-decision': return <MessageSquare className="h-5 w-5 text-pink-600" />;
    default: return <Play className="h-5 w-5 text-gray-600" />;
  }
};

const NarrativeIntro: React.FC<{ lesson: StorylineLesson; onStart: () => void }> = ({ lesson, onStart }) => (
  <Card className="border-2 border-purple-200">
    <CardHeader className="text-center">
      <CardTitle className="text-3xl text-purple-800">{lesson.title}</CardTitle>
      <p className="text-purple-600">A {lesson.estimatedDuration}-minute storyline lesson with {lesson.character}</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📖 The Situation</h3>
          <p className="text-gray-700">{lesson.narrative.setup.context}</p>
          <p className="text-gray-700 mt-2">{lesson.narrative.setup.characterSituation}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 You'll Learn</h3>
          <ul className="space-y-1">
            {lesson.takeawaySkills.map((skill, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-600">•</span>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">🎭 The Challenge</h3>
        <p className="text-purple-800">{lesson.narrative.conflict.primaryChallenge}</p>
      </div>

      <div className="text-center">
        <Button onClick={onStart} size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Play className="h-4 w-4 mr-2" />
          Start {lesson.character}'s Story
        </Button>
      </div>
    </CardContent>
  </Card>
);

const StageRenderer: React.FC<{
  stage: PracticeStage;
  onStaticChoice: (option: ChoiceOption) => void;
  onTemplateSubmit: (data: Record<string, string>) => void;
  onAIPrompting: (prompt: string) => void;
  onAdvance: () => void;
  isProcessing: boolean;
  stageResults?: any;
  generatedOutput?: string;
}> = ({ stage, onStaticChoice, onTemplateSubmit, onAIPrompting, onAdvance, isProcessing, stageResults, generatedOutput }) => {
  const [templateData, setTemplateData] = useState<Record<string, string>>({});
  const [userPrompt, setUserPrompt] = useState('');

  switch (stage.type) {
    case 'static-choice':
      return (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">{stage.content.question}</p>
          <div className="grid gap-3">
            {stage.content.options?.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="text-left justify-start h-auto p-4"
                onClick={() => onStaticChoice(option)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      );

    case 'template-building':
      return (
        <div className="space-y-4">
          {stage.content.promptExample && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📚 Example Prompt:</h4>
              <pre className="text-sm text-blue-800 whitespace-pre-wrap">{stage.content.promptExample}</pre>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">🛠️ Build Your Prompt:</h4>
            <div className="space-y-3">
              {stage.content.fillableFields?.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.name.replace(/_/g, ' ')}:
                  </label>
                  <Input
                    placeholder={field.placeholder}
                    value={templateData[field.name] || ''}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  />
                  {field.hint && <p className="text-xs text-gray-500 mt-1">{field.hint}</p>}
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => onTemplateSubmit(templateData)}
              className="mt-4"
              disabled={stage.content.fillableFields?.some(f => f.required && !templateData[f.name])}
            >
              Complete Template
            </Button>
          </div>
        </div>
      );

    case 'ai-prompting':
      return (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">🎯 Your Task:</h4>
            <p className="text-purple-800">{stage.content.freeformGuidance}</p>
          </div>

          {stage.content.contextualHints && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">💡 Hints:</h4>
              <ul className="space-y-1">
                {stage.content.contextualHints.map((hint, index) => (
                  <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                    <Lightbulb className="h-3 w-3 mt-1 flex-shrink-0" />
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Textarea
            placeholder="Enter your AI prompt here..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="min-h-32"
          />

          <div className="flex gap-3">
            <Button 
              onClick={() => onAIPrompting(userPrompt)}
              disabled={!userPrompt.trim() || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>

          {generatedOutput && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">✨ AI Generated Content:</h4>
              <div className="text-sm text-green-800 whitespace-pre-wrap">{generatedOutput}</div>
              
              {stageResults && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Quality Score:</strong> {stageResults.score}/10 ({stageResults.feedback})
                  </p>
                  {stageResults.suggestions?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600 font-medium">Suggestions:</p>
                      <ul className="text-xs text-green-600 ml-4">
                        {stageResults.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <Button onClick={onAdvance} className="mt-3">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to Next Stage
              </Button>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Stage type not implemented yet.</p>
          <Button onClick={onAdvance} className="mt-4">
            Continue
          </Button>
        </div>
      );
  }
};

export default StorylineLessonPlayer;