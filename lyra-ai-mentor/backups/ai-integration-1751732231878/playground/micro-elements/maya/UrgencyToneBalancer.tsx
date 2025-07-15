import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  AlertTriangle,
  Heart,
  Clock,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Trophy,
  Zap,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AIService } from '@/services/aiService';

interface ToneExample {
  level: number;
  example: string;
  analysis: string;
  appropriate: boolean;
}

const toneExamples: ToneExample[] = [
  {
    level: 20,
    example: "We hope you'll consider supporting our programs when you have a chance.",
    analysis: "Too passive - lacks clear call to action",
    appropriate: false
  },
  {
    level: 50,
    example: "Your gift today will help provide meals for families in need this month.",
    analysis: "Balanced - clear need with respectful ask",
    appropriate: true
  },
  {
    level: 80,
    example: "URGENT: Only 24 hours left! We're still $5,000 short of our critical goal!",
    analysis: "High pressure - may cause donor fatigue",
    appropriate: false
  },
  {
    level: 100,
    example: "FINAL NOTICE!!! This is your LAST CHANCE! Children will GO HUNGRY without your help NOW!!!",
    analysis: "Manipulative - damages trust and relationships",
    appropriate: false
  }
];

interface UrgencyScenario {
  context: string;
  timeline: string;
  stakes: string;
  audience: string;
  recommendedRange: { min: number; max: number };
}

const scenarios: UrgencyScenario[] = [
  {
    context: 'Year-end giving deadline',
    timeline: '48 hours until December 31',
    stakes: 'Tax-deductible giving deadline',
    audience: 'Active donors',
    recommendedRange: { min: 60, max: 80 }
  },
  {
    context: 'Monthly newsletter update',
    timeline: 'No specific deadline',
    stakes: 'General program support',
    audience: 'Email subscribers',
    recommendedRange: { min: 20, max: 40 }
  },
  {
    context: 'Emergency disaster response',
    timeline: 'Immediate need',
    stakes: 'Lives at risk, urgent aid needed',
    audience: 'Full database',
    recommendedRange: { min: 70, max: 90 }
  },
  {
    context: 'Matching gift campaign',
    timeline: '1 week remaining',
    stakes: 'Double impact opportunity',
    audience: 'Mid-level donors',
    recommendedRange: { min: 50, max: 70 }
  }
];

const UrgencyToneBalancer: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState<number[]>([50]);
  const [emailDraft, setEmailDraft] = useState('');
  const [toneChoice, setToneChoice] = useState<'respect' | 'urgency' | 'balanced'>('balanced');
  const [aiRevision, setAiRevision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedExamples, setSavedExamples] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const scenario = scenarios[currentScenario];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateRevision = async () => {
    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Revise this email to achieve ${urgencyLevel[0]}% urgency level (0=no urgency, 100=extreme urgency):
        
        Context: ${scenario.context}
        Timeline: ${scenario.timeline}
        Current draft: ${emailDraft}
        
        Maintain respect for donors while conveying appropriate urgency. The tone should prioritize ${toneChoice}.`,
        context: "You are an expert at balancing urgency with donor respect in nonprofit communications.",
        temperature: 0.7
      });

      setAiRevision(response.content);
    } catch (error) {
      console.error('Error generating revision:', error);
      setAiRevision("Friends, we have just 48 hours to reach our year-end goal. Your support today—in any amount—makes a real difference for families in our community. If you've been considering a gift, now is the perfect time. Thank you for all you do.");
    }
    setIsGenerating(false);
  };

  const getUrgencyColor = (level: number) => {
    if (level < 30) return 'text-green-600';
    if (level < 60) return 'text-yellow-600';
    if (level < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUrgencyLabel = (level: number) => {
    if (level < 30) return 'Gentle';
    if (level < 60) return 'Moderate';
    if (level < 80) return 'Strong';
    return 'Extreme';
  };

  const analyzeBalance = () => {
    setShowAnalysis(true);
    
    let currentScore = 0;
    const level = urgencyLevel[0];
    const draft = emailDraft.toLowerCase();
    
    // Within recommended range
    if (level >= scenario.recommendedRange.min && level <= scenario.recommendedRange.max) {
      currentScore += 30;
    } else if (Math.abs(level - scenario.recommendedRange.min) <= 10 || 
               Math.abs(level - scenario.recommendedRange.max) <= 10) {
      currentScore += 20;
    }
    
    // Has clear call to action
    if (draft.includes('donate') || draft.includes('give') || draft.includes('support') || draft.includes('help')) {
      currentScore += 20;
    }
    
    // Respects donor (uses please, thank you, appreciation)
    if (draft.includes('please') || draft.includes('thank') || draft.includes('grateful') || draft.includes('appreciate')) {
      currentScore += 20;
    }
    
    // Explains impact/reason
    if (draft.includes('will') || draft.includes('help') || draft.includes('provide') || draft.includes('support')) {
      currentScore += 15;
    }
    
    // Avoids manipulation (no excessive caps, multiple exclamation points)
    const capsWords = (draft.match(/[A-Z]{4,}/g) || []).length;
    const exclamations = (draft.match(/!/g) || []).length;
    if (capsWords <= 1 && exclamations <= 2) currentScore += 15;
    
    setScore(currentScore);
    setProgress(((currentScenario + 1) / scenarios.length) * 100);
    
    if (currentScore >= 70) {
      setSavedExamples(prev => [...prev, {
        scenario: scenario.context,
        urgencyLevel: level,
        draft: emailDraft,
        score: currentScore
      }]);
    }
  };

  const moveToNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setUrgencyLevel([50]);
      setEmailDraft('');
      setToneChoice('balanced');
      setAiRevision('');
      setShowAnalysis(false);
      setScore(0);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Urgency Tone Balancer</h2>
              <p className="text-sm text-muted-foreground">Balance urgency with respect</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Scenario {currentScenario + 1} / {scenarios.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="balancer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Urgency Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Situation:</span>
                      <p className="text-sm text-muted-foreground">{scenario.context}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Timeline:</span>
                      <p className="text-sm text-muted-foreground">{scenario.timeline}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">What's at Stake:</span>
                    <p className="text-sm text-muted-foreground">{scenario.stakes}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Recommended Urgency:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        {scenario.recommendedRange.min}-{scenario.recommendedRange.max}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({getUrgencyLabel((scenario.recommendedRange.min + scenario.recommendedRange.max) / 2)})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Set Your Tone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-medium">Urgency Level</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getUrgencyColor(urgencyLevel[0])}`}>
                        {urgencyLevel[0]}%
                      </span>
                      <Badge variant="outline" className={getUrgencyColor(urgencyLevel[0])}>
                        {getUrgencyLabel(urgencyLevel[0])}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                      <Slider
                        value={urgencyLevel}
                        onValueChange={setUrgencyLevel}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
                      <span>Gentle</span>
                      <span>Moderate</span>
                      <span>Strong</span>
                      <span>Extreme</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3">Primary Focus</Label>
                  <RadioGroup value={toneChoice} onValueChange={(value: any) => setToneChoice(value)}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="respect" id="respect" />
                        <Label htmlFor="respect" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>Donor Respect First</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urgency" id="urgency" />
                        <Label htmlFor="urgency" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>Urgency First</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4" />
                            <span>Balanced Approach</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">Write Your Message</Label>
                  <Textarea
                    placeholder="Write your email message here, balancing urgency with respect..."
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    className="mt-2 min-h-[150px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {emailDraft.split(' ').length} words
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateRevision}
                    variant="outline"
                    disabled={emailDraft.length < 50 || isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Tone Revision
                  </Button>
                  <Button
                    onClick={analyzeBalance}
                    disabled={emailDraft.length < 50}
                    className="flex-1"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Analyze Balance
                  </Button>
                </div>

                {aiRevision && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong>AI-Balanced Version ({urgencyLevel[0]}% urgency):</strong>
                        <p className="mt-2">{aiRevision}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => setEmailDraft(aiRevision)}
                        >
                          Use This Version
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Balance Tip:</strong> Even in urgent situations, respect and gratitude 
                    build stronger long-term relationships than pressure and guilt.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Tone Examples</CardTitle>
                <CardDescription>See how different urgency levels sound</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {toneExamples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        example.appropriate ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={example.appropriate ? 'default' : 'destructive'}>
                          {example.level}% Urgency
                        </Badge>
                        {example.appropriate ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm italic mb-2">{example.example}</p>
                      <p className="text-xs text-muted-foreground">{example.analysis}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tone Balance Analysis</CardTitle>
                <CardDescription>
                  How well did you balance urgency with respect?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Your Urgency Level:</p>
                    <Badge className={getUrgencyColor(urgencyLevel[0])}>
                      {urgencyLevel[0]}% - {getUrgencyLabel(urgencyLevel[0])}
                    </Badge>
                  </div>
                  <p className="text-sm italic">{emailDraft}</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${urgencyLevel[0] >= scenario.recommendedRange.min && urgencyLevel[0] <= scenario.recommendedRange.max ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Within recommended range ({scenario.recommendedRange.min}-{scenario.recommendedRange.max}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${emailDraft.toLowerCase().includes('donate') || emailDraft.toLowerCase().includes('give') ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Clear call to action</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${emailDraft.toLowerCase().includes('thank') || emailDraft.toLowerCase().includes('grateful') ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Shows respect and gratitude</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 70 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Avoids manipulation tactics</span>
                  </div>
                </div>

                {score >= 70 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Excellent balance! This message conveys appropriate urgency while maintaining donor trust.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Scale className="h-4 w-4" />
                    <AlertDescription>
                      Good effort! Consider adjusting your urgency level to better match the situation.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Next Scenario
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Balancer
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedExamples.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Balanced Messages</CardTitle>
              <CardDescription>Well-balanced urgency examples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedExamples.map((example, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{example.scenario}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getUrgencyColor(example.urgencyLevel)}>
                          {example.urgencyLevel}%
                        </Badge>
                        <Badge variant="outline">{example.score}%</Badge>
                      </div>
                    </div>
                    <p className="text-sm italic line-clamp-2">{example.draft}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default UrgencyToneBalancer;