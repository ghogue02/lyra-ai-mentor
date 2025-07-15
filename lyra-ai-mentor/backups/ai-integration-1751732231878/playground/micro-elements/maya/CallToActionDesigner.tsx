import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer, 
  Sparkles, 
  Target,
  Gift,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Trophy,
  Clock,
  Zap,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AIService } from '@/services/aiService';

interface CTAType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  bestFor: string;
}

const ctaTypes: CTAType[] = [
  {
    id: 'donate',
    name: 'Donation CTA',
    description: 'Inspire financial support',
    icon: <Gift className="w-4 h-4" />,
    examples: ['Donate Now', 'Give Today', 'Support Our Mission'],
    bestFor: 'Fundraising campaigns'
  },
  {
    id: 'volunteer',
    name: 'Volunteer CTA',
    description: 'Recruit helpers',
    icon: <Users className="w-4 h-4" />,
    examples: ['Join Our Team', 'Volunteer Today', 'Make a Difference'],
    bestFor: 'Volunteer recruitment'
  },
  {
    id: 'event',
    name: 'Event CTA',
    description: 'Drive registrations',
    icon: <Calendar className="w-4 h-4" />,
    examples: ['Register Now', 'Save Your Spot', 'RSVP Today'],
    bestFor: 'Event promotion'
  },
  {
    id: 'learn',
    name: 'Information CTA',
    description: 'Encourage engagement',
    icon: <Heart className="w-4 h-4" />,
    examples: ['Learn More', 'See Our Impact', 'Read Their Story'],
    bestFor: 'Awareness campaigns'
  }
];

interface CTAScenario {
  context: string;
  goal: string;
  urgency: 'low' | 'medium' | 'high';
  audience: string;
}

const scenarios: CTAScenario[] = [
  {
    context: 'Year-end giving campaign email',
    goal: 'Increase donations before Dec 31',
    urgency: 'high',
    audience: 'Past donors'
  },
  {
    context: 'Spring volunteer fair announcement',
    goal: 'Recruit 50 new volunteers',
    urgency: 'medium',
    audience: 'Community members'
  },
  {
    context: 'Monthly impact newsletter',
    goal: 'Drive traffic to success stories',
    urgency: 'low',
    audience: 'Email subscribers'
  }
];

const CallToActionDesigner: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedType, setSelectedType] = useState('donate');
  const [ctaText, setCtaText] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<number[]>([50]);
  const [personalization, setPersonalization] = useState<number[]>([50]);
  const [aiVariations, setAiVariations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedCTAs, setSavedCTAs] = useState<{text: string, type: string, score: number}[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const scenario = scenarios[currentScenario];
  const selectedCTAType = ctaTypes.find(t => t.id === selectedType);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateVariations = async () => {
    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Generate 5 compelling call-to-action variations for:
        Context: ${scenario.context}
        Goal: ${scenario.goal}
        Type: ${selectedCTAType?.name}
        Urgency: ${urgencyLevel[0]}% (0=low, 100=high)
        Personalization: ${personalization[0]}% (0=generic, 100=highly personal)
        
        Make them action-oriented, clear, and compelling. Format as a JSON array of strings.`,
        context: "You are an expert conversion copywriter specializing in nonprofit CTAs.",
        temperature: 0.9
      });

      try {
        const variations = JSON.parse(response.content);
        setAiVariations(Array.isArray(variations) ? variations : [response.content]);
      } catch {
        setAiVariations(response.content.split('\n').filter(s => s.trim()));
      }
    } catch (error) {
      console.error('Error generating variations:', error);
      setAiVariations([
        "Double Your Impact Before Midnight",
        "Yes! I Want to Help Feed Families",
        "Join 500+ Donors Making History Today",
        "Complete Your Year-End Gift Now →",
        "Transform a Life with One Click"
      ]);
    }
    setIsGenerating(false);
  };

  const analyzeCTA = () => {
    setShowAnalysis(true);
    
    let currentScore = 0;
    const cta = ctaText.toLowerCase();
    
    // Length check (2-7 words is ideal)
    const wordCount = ctaText.split(' ').length;
    if (wordCount >= 2 && wordCount <= 7) currentScore += 20;
    
    // Action verb at start
    const actionVerbs = ['donate', 'give', 'join', 'help', 'support', 'register', 'save', 'transform', 'make', 'start'];
    if (actionVerbs.some(verb => cta.startsWith(verb))) currentScore += 20;
    
    // Urgency alignment
    const hasUrgency = /now|today|before|last|final|midnight|limited|only/i.test(cta);
    if ((scenario.urgency === 'high' && hasUrgency) || (scenario.urgency === 'low' && !hasUrgency)) {
      currentScore += 20;
    } else if (scenario.urgency === 'medium') {
      currentScore += 10;
    }
    
    // Personalization
    const hasPersonal = /you|your|i|my|we|our/i.test(cta);
    if (hasPersonal) currentScore += 20;
    
    // Value proposition
    const hasValue = /impact|difference|help|save|transform|change|support/i.test(cta);
    if (hasValue) currentScore += 20;
    
    setScore(currentScore);
    setProgress(((currentScenario + 1) / scenarios.length) * 100);
    
    if (currentScore >= 60) {
      setSavedCTAs(prev => [...prev, {
        text: ctaText,
        type: selectedCTAType?.name || '',
        score: currentScore
      }]);
    }
  };

  const moveToNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setCtaText('');
      setAiVariations([]);
      setShowAnalysis(false);
      setScore(0);
      setUrgencyLevel([50]);
      setPersonalization([50]);
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
              <MousePointer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Call-to-Action Designer</h2>
              <p className="text-sm text-muted-foreground">Create CTAs that drive action</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              CTA {currentScenario + 1} / {scenarios.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="designer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Scenario Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Context:</span>
                    <p className="text-sm text-muted-foreground">{scenario.context}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Goal:</span>
                    <p className="text-sm text-muted-foreground">{scenario.goal}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Audience:</span>
                    <p className="text-sm text-muted-foreground">{scenario.audience}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Urgency:</span>
                    <Badge variant={scenario.urgency === 'high' ? 'destructive' : scenario.urgency === 'medium' ? 'default' : 'secondary'}>
                      {scenario.urgency}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Design Your CTA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3">1. Choose CTA Type</Label>
                  <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                    <div className="grid grid-cols-2 gap-3">
                      {ctaTypes.map((type) => (
                        <div key={type.id} className="flex items-start space-x-2">
                          <RadioGroupItem value={type.id} id={type.id} />
                          <Label htmlFor={type.id} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              {type.icon}
                              <span>{type.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{type.bestFor}</p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">2. Adjust Urgency Level</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Low</span>
                    <Slider
                      value={urgencyLevel}
                      onValueChange={setUrgencyLevel}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: {urgencyLevel[0]}% urgency
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">3. Personalization Level</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Generic</span>
                    <Slider
                      value={personalization}
                      onValueChange={setPersonalization}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Personal</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: {personalization[0]}% personalized
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">4. Write Your CTA</Label>
                  <Input
                    placeholder="e.g., 'Donate Now to Double Your Impact'"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="text-lg font-medium"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{ctaText.split(' ').length} words</span>
                    <span className="text-green-600">Ideal: 2-7 words</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateVariations}
                    variant="outline"
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get AI Variations
                  </Button>
                  <Button
                    onClick={analyzeCTA}
                    disabled={ctaText.length < 5}
                    className="flex-1"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Test My CTA
                  </Button>
                </div>

                {aiVariations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-sm font-medium">AI Variations:</p>
                    {aiVariations.map((variation, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors text-left"
                        onClick={() => setCtaText(variation)}
                      >
                        <p className="font-medium">{variation}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to use</p>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>CTA Best Practices:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Start with a strong action verb</li>
                      <li>• Create urgency when appropriate</li>
                      <li>• Focus on the value to the reader</li>
                      <li>• Keep it short and scannable</li>
                    </ul>
                  </AlertDescription>
                </Alert>
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
                <CardTitle>CTA Performance Analysis</CardTitle>
                <CardDescription>
                  How effective is your call-to-action?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-6 bg-muted/50 rounded-lg text-center">
                  <p className="text-xl font-bold">{ctaText}</p>
                  <p className="text-sm text-muted-foreground mt-2">{selectedCTAType?.name}</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${ctaText.split(' ').length >= 2 && ctaText.split(' ').length <= 7 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Optimal length (2-7 words)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/^(donate|give|join|help|support|register|save|transform|make|start)/i.test(ctaText) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Starts with action verb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 60 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Appropriate urgency level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/you|your|i|my|we|our/i.test(ctaText) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Personal connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/impact|difference|help|save|transform|change|support/i.test(ctaText) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Clear value proposition</span>
                  </div>
                </div>

                {score >= 60 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Strong CTA! This will effectively drive action from your audience.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <MousePointer className="h-4 w-4" />
                    <AlertDescription>
                      Good effort! Try incorporating more action-oriented language and clear value.
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
                      Complete Designer
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedCTAs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your CTA Collection</CardTitle>
              <CardDescription>High-performing CTAs ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedCTAs.map((cta, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <p className="font-medium">{cta.text}</p>
                      <p className="text-xs text-muted-foreground">{cta.type}</p>
                    </div>
                    <Badge variant="outline">{cta.score}%</Badge>
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

export default CallToActionDesigner;