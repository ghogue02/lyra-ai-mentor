import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, CheckCircle, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';

interface AIPromptPracticeRendererProps {
  element: {
    id: number;
    configuration: {
      scenarios: Array<{
        context: string;
        bad_prompt: string;
        good_prompt: string;
      }>;
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AIPromptPracticeRenderer: React.FC<AIPromptPracticeRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);

  const scenarios = element.configuration?.scenarios || [];

  const analyzePrompt = useCallback((prompt: string) => {
    const current = scenarios[currentScenario];
    if (!current) return { score: 0, feedback: 'No scenario available' };

    // Simple scoring based on key elements
    let promptScore = 0;
    const feedback: string[] = [];

    // Check for specificity
    if (prompt.length > 20) {
      promptScore += 2;
      feedback.push('✓ Good length and detail');
    } else {
      feedback.push('✗ Could be more specific');
    }

    // Check for context
    const contextWords = ['for', 'about', 'regarding', 'to help', 'that'];
    if (contextWords.some(word => prompt.toLowerCase().includes(word))) {
      promptScore += 2;
      feedback.push('✓ Includes context');
    } else {
      feedback.push('✗ Add more context about the purpose');
    }

    // Check for clear action
    const actionWords = ['write', 'create', 'generate', 'make', 'develop', 'design'];
    if (actionWords.some(word => prompt.toLowerCase().includes(word))) {
      promptScore += 2;
      feedback.push('✓ Clear action requested');
    } else {
      feedback.push('✗ Be more specific about what you want');
    }

    // Check for target audience mention
    const audienceWords = ['volunteer', 'donor', 'community', 'member', 'supporter'];
    if (audienceWords.some(word => prompt.toLowerCase().includes(word))) {
      promptScore += 2;
      feedback.push('✓ Specifies target audience');
    } else {
      feedback.push('✗ Consider mentioning your target audience');
    }

    // Check for tone/style guidance
    const toneWords = ['warm', 'professional', 'friendly', 'compelling', 'inspiring'];
    if (toneWords.some(word => prompt.toLowerCase().includes(word))) {
      promptScore += 2;
      feedback.push('✓ Includes tone guidance');
    } else {
      feedback.push('✗ Consider specifying the desired tone');
    }

    return {
      score: Math.min(promptScore, 10),
      feedback: feedback.join('\n')
    };
  }, [scenarios, currentScenario]);

  const handleSubmitPrompt = useCallback(async () => {
    if (!userPrompt.trim()) return;

    const analysis = analyzePrompt(userPrompt);
    setScore(analysis.score);
    setShowFeedback(true);

    // Mark scenario as completed
    const newCompleted = new Set(completedScenarios);
    newCompleted.add(currentScenario);
    setCompletedScenarios(newCompleted);

    // Check if all scenarios are completed
    if (newCompleted.size === scenarios.length && !isElementCompleted) {
      await onComplete();
    }
  }, [userPrompt, analyzePrompt, completedScenarios, scenarios.length, currentScenario, isElementCompleted, onComplete]);

  const nextScenario = useCallback(() => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setUserPrompt('');
      setShowFeedback(false);
      setScore(0);
    }
  }, [currentScenario, scenarios.length]);

  const resetScenario = useCallback(() => {
    setUserPrompt('');
    setShowFeedback(false);
    setScore(0);
  }, []);

  if (scenarios.length === 0) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Practice scenarios not found.</p>
        </CardContent>
      </Card>
    );
  }

  const current = scenarios[currentScenario];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="premium-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Prompt Practice Playground</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Scenario {currentScenario + 1} of {scenarios.length}
                </p>
              </div>
            </div>
            <Badge variant="outline">
              {completedScenarios.size}/{scenarios.length} Complete
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-primary to-brand-cyan rounded-full transition-all duration-500"
              style={{ width: `${(completedScenarios.size / scenarios.length) * 100}%` }}
            />
          </div>

          {/* Scenario */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Scenario:</h3>
            <p className="text-muted-foreground">{current.context}</p>
          </div>

          {/* Examples */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <h4 className="font-medium text-destructive">Poor Prompt Example</h4>
              </div>
              <p className="text-sm text-muted-foreground italic">"{current.bad_prompt}"</p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-primary">Good Prompt Example</h4>
              </div>
              <p className="text-sm text-muted-foreground italic">"{current.good_prompt}"</p>
            </div>
          </div>

          {/* User Input */}
          <div className="space-y-3">
            <Label htmlFor="user-prompt">Now you try! Write your own prompt for this scenario:</Label>
            <Textarea
              id="user-prompt"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type your prompt here..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-primary/10 to-brand-cyan/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h4 className="font-medium">Your Score: {score}/10</h4>
                </div>
                <div className="text-sm space-y-1">
                  {analyzePrompt(userPrompt).feedback.split('\n').map((line, index) => (
                    <p key={index} className={line.startsWith('✓') ? 'text-primary' : 'text-muted-foreground'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {currentScenario < scenarios.length - 1 ? (
                  <Button onClick={nextScenario} className="flex-1">
                    Next Scenario
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex-1 text-center">
                    <Badge className="bg-primary/10 text-primary px-6 py-2">
                      All Scenarios Complete! 🎉
                    </Badge>
                  </div>
                )}
                <Button onClick={resetScenario} variant="outline">
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

          {!showFeedback && (
            <Button 
              onClick={handleSubmitPrompt}
              disabled={!userPrompt.trim()}
              className="w-full"
            >
              <Target className="w-4 h-4 mr-2" />
              Get Feedback on My Prompt
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};