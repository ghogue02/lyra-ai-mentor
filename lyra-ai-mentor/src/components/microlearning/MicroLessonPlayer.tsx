/**
 * MICRO-LESSON PLAYER
 * Interactive micro-lesson component with scaffolded progression and AI scoring
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ArrowRight, RotateCcw, Trophy, Target } from 'lucide-react';
import { MicroLesson, UserAttempt, UserContext, AttemptScores } from '@/config/microLearningSystem';
import { MicroLearningEngine } from '@/services/microLearningEngine';
import { toast } from '@/hooks/use-toast';

interface MicroLessonPlayerProps {
  lesson: MicroLesson;
  userContext: UserContext;
  onComplete: (attempt: UserAttempt) => void;
  onSkillMastered?: (skillFocus: string, score: number) => void;
}

type StageType = 'multiple-choice' | 'fill-in-blank' | 'guided-template' | 'free-form-with-hints';

interface MultipleChoiceOption {
  id: string;
  text: string;
  feedback?: string;
  correct?: boolean;
}

export const MicroLessonPlayer: React.FC<MicroLessonPlayerProps> = ({
  lesson,
  userContext,
  onComplete,
  onSkillMastered
}) => {
  const [currentStage, setCurrentStage] = useState<StageType>(lesson.scaffoldingStage);
  const [userResponse, setUserResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<UserAttempt | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [engine] = useState(() => MicroLearningEngine.getInstance());

  // Multiple choice options (would normally be generated dynamically)
  const multipleChoiceOptions: MultipleChoiceOption[] = [
    {
      id: 'a',
      text: 'Important Update',
      feedback: 'Too generic - doesn\'t indicate specific value or urgency'
    },
    {
      id: 'b', 
      text: 'Your Impact: 500 Families Fed This Month',
      feedback: 'Excellent! Shows specific impact and creates emotional connection',
      correct: true
    },
    {
      id: 'c',
      text: 'Newsletter #47',
      feedback: 'Administrative tone - doesn\'t inspire opening or engagement'
    },
    {
      id: 'd',
      text: 'Please Read',
      feedback: 'Weak call to action - doesn\'t explain why they should read'
    }
  ];

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) {
      toast({
        title: "Response Required",
        description: "Please provide your response before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🎯 Submitting micro-lesson response:', { lesson: lesson.id, stage: currentStage, attempt: attemptNumber });
      
      const attempt = await engine.executeMicroLesson(
        lesson,
        userResponse,
        userContext,
        attemptNumber
      );

      setCurrentAttempt(attempt);
      setShowFeedback(true);

      if (attempt.passed) {
        toast({
          title: "Great Work! 🎉",
          description: `You scored ${attempt.scores.overall}/10 and passed this micro-lesson!`,
          variant: "default"
        });

        // Check if skill mastered
        if (onSkillMastered && attempt.scores.overall >= 8.5) {
          onSkillMastered(lesson.skillFocus, attempt.scores.overall);
        }

        onComplete(attempt);
      } else {
        toast({
          title: "Keep Practicing",
          description: `Score: ${attempt.scores.overall}/10. Review the feedback and try again!`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Failed to process micro-lesson:', error);
      toast({
        title: "Processing Error",
        description: "Failed to evaluate your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setAttemptNumber(prev => prev + 1);
    setUserResponse('');
    setShowFeedback(false);
    setCurrentAttempt(null);
  };

  const handleMultipleChoiceSelect = (optionId: string) => {
    const option = multipleChoiceOptions.find(o => o.id === optionId);
    if (option) {
      setUserResponse(option.text);
    }
  };

  const getStageTitle = (stage: StageType): string => {
    switch (stage) {
      case 'multiple-choice': return 'Multiple Choice Practice';
      case 'fill-in-blank': return 'Fill in the Blanks';
      case 'guided-template': return 'Guided Template';
      case 'free-form-with-hints': return 'Free-Form Practice';
      default: return 'Practice';
    }
  };

  const getStageProgress = (stage: StageType): number => {
    switch (stage) {
      case 'multiple-choice': return 25;
      case 'fill-in-blank': return 50;
      case 'guided-template': return 75;
      case 'free-form-with-hints': return 100;
      default: return 0;
    }
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Which subject line would be most effective for a donor update email?
            </p>
            <div className="grid gap-3">
              {multipleChoiceOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={userResponse === option.text ? "default" : "outline"}
                  className="text-left justify-start h-auto p-4"
                  onClick={() => handleMultipleChoiceSelect(option.id)}
                >
                  <span className="font-medium mr-2">{option.id.toUpperCase()})</span>
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'fill-in-blank':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Complete this subject line template for your organization:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              "Your [IMPACT] helped us [SPECIFIC ACHIEVEMENT] this [TIME PERIOD]"
            </div>
            <Textarea
              placeholder="Example: Your donation helped us serve 200 hot meals this week"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="min-h-20"
            />
          </div>
        );

      case 'guided-template':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Using the formula [Action] + [Benefit] + [Urgency], write a subject line for your board meeting agenda:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm"><strong>Action:</strong> What you want them to do (Review, Approve, Join, etc.)</p>
              <p className="text-sm"><strong>Benefit:</strong> What's in it for them or the mission</p>
              <p className="text-sm"><strong>Urgency:</strong> Why timing matters (Optional)</p>
            </div>
            <Textarea
              placeholder="Example: Review Q3 Impact Report - See How Your Leadership Drove 40% Growth"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="min-h-20"
            />
          </div>
        );

      case 'free-form-with-hints':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Write 3 subject lines for different stakeholder types at your organization. Use AI to test which ones perform best.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">💡 Hints:</p>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Consider: Donors, Volunteers, Board Members, Staff, Community Partners</li>
                <li>• Tailor tone and content to each audience's interests</li>
                <li>• Use specific numbers and outcomes when possible</li>
                <li>• Test emotional appeals vs. logical appeals</li>
              </ul>
            </div>
            <Textarea
              placeholder="1. For Donors: [Your subject line here]&#10;2. For Volunteers: [Your subject line here]&#10;3. For Board: [Your subject line here]"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="min-h-32"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderScoreBreakdown = (scores: AttemptScores) => (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">Overall Score:</span>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${scores.overall >= 7.5 ? 'text-green-600' : 'text-orange-600'}`}>
            {scores.overall}/10
          </span>
          {scores.overall >= 7.5 ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-orange-600" />
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        {Object.entries(scores.criteria).map(([criterion, score]) => (
          <div key={criterion} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{criterion}:</span>
            <span className={`font-medium ${score >= 7.5 ? 'text-green-600' : 'text-orange-600'}`}>
              {score}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = (attempt: UserAttempt) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Feedback & Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderScoreBreakdown(attempt.scores)}
        
        <div className="mt-6 space-y-3">
          <h4 className="font-medium">Specific Feedback:</h4>
          <ul className="space-y-2">
            {attempt.feedback.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          {attempt.passed ? (
            <Button onClick={() => onComplete(attempt)} className="flex-1">
              <Trophy className="h-4 w-4 mr-2" />
              Continue to Next Micro-Lesson
            </Button>
          ) : (
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again (Attempt #{attemptNumber + 1})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600">with {lesson.character}</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {getStageTitle(currentStage)}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Skill: {lesson.skillFocus}</span>
            <span>{getStageProgress(currentStage)}% Complete</span>
          </div>
          <Progress value={getStageProgress(currentStage)} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Practice Exercise</CardTitle>
          <p className="text-sm text-gray-600">
            Real-world application: {lesson.context.realWorldApplication}
          </p>
        </CardHeader>
        <CardContent>
          {renderStageContent()}
          
          {!showFeedback && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSubmitResponse}
                disabled={!userResponse.trim() || isProcessing}
                className="px-8"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    Submit Response
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {showFeedback && currentAttempt && renderFeedback(currentAttempt)}

      {/* Attempt Counter */}
      {attemptNumber > 1 && (
        <div className="mt-4 text-center">
          <Badge variant="outline">Attempt #{attemptNumber}</Badge>
        </div>
      )}
    </div>
  );
};

export default MicroLessonPlayer;