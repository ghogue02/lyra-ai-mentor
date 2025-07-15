import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  Sparkles, 
  Target,
  Copy,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Trophy,
  Clock,
  BarChart3,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AIService } from '@/services/aiService';

interface TestElement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: { a: string; b: string; hypothesis: string }[];
}

const testElements: TestElement[] = [
  {
    id: 'subject',
    name: 'Subject Line',
    description: 'Test different email subjects',
    icon: <Copy className="w-4 h-4" />,
    examples: [{
      a: 'Help us reach our goal',
      b: 'You can change Sarah\'s life today',
      hypothesis: 'Personal stories outperform generic appeals'
    }]
  },
  {
    id: 'cta',
    name: 'Call to Action',
    description: 'Test button text and placement',
    icon: <Target className="w-4 h-4" />,
    examples: [{
      a: 'Donate Now',
      b: 'Yes, I\'ll Help!',
      hypothesis: 'Emotional CTAs drive more clicks'
    }]
  },
  {
    id: 'opening',
    name: 'Opening Line',
    description: 'Test different hooks',
    icon: <FlaskConical className="w-4 h-4" />,
    examples: [{
      a: 'Dear Friend,',
      b: 'I have an urgent update for you...',
      hypothesis: 'Urgency increases open rates'
    }]
  },
  {
    id: 'format',
    name: 'Email Format',
    description: 'Test layout and structure',
    icon: <BarChart3 className="w-4 h-4" />,
    examples: [{
      a: 'Long-form story',
      b: 'Bullet points with images',
      hypothesis: 'Visual formats improve engagement'
    }]
  }
];

interface TestScenario {
  context: string;
  metric: string;
  audience: string;
  currentPerformance: string;
  goal: string;
}

const scenarios: TestScenario[] = [
  {
    context: 'Monthly newsletter',
    metric: 'Open rate',
    audience: 'Email subscribers',
    currentPerformance: '22% open rate',
    goal: 'Increase to 30%+'
  },
  {
    context: 'Donation appeal',
    metric: 'Click-through rate',
    audience: 'Past donors',
    currentPerformance: '3.5% CTR',
    goal: 'Reach 5%+ CTR'
  },
  {
    context: 'Event invitation',
    metric: 'Registration rate',
    audience: 'Community members',
    currentPerformance: '8% register',
    goal: 'Get 12%+ registrations'
  }
];

const ABTestCreator: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedElement, setSelectedElement] = useState('subject');
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [sampleSize, setSampleSize] = useState('1000');
  const [aiVariations, setAiVariations] = useState<{a: string; b: string; hypothesis: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedTests, setSavedTests] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const scenario = scenarios[currentScenario];
  const selectedTestElement = testElements.find(e => e.id === selectedElement);

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
        prompt: `Create 3 A/B test variations for:
        Element: ${selectedTestElement?.name}
        Context: ${scenario.context}
        Goal: ${scenario.goal} (current: ${scenario.currentPerformance})
        Metric: ${scenario.metric}
        
        For each variation provide:
        - Version A (control)
        - Version B (test)
        - Hypothesis (why B might perform better)
        
        Format as JSON array with fields: a, b, hypothesis`,
        context: "You are an expert in email marketing optimization and A/B testing.",
        temperature: 0.9
      });

      try {
        const variations = JSON.parse(response.content);
        setAiVariations(variations);
      } catch {
        // Fallback variations
        setAiVariations([
          {
            a: "Support Our Mission Today",
            b: "Your Gift Changes Lives: See How Inside",
            hypothesis: "Specific impact preview increases curiosity and opens"
          },
          {
            a: "December Newsletter",
            b: "Sarah's Story + Your Year-End Impact Report",
            hypothesis: "Personal story combined with donor recognition drives engagement"
          },
          {
            a: "Help Us Reach Our Goal",
            b: "48 Hours Left: Double Your Impact",
            hypothesis: "Time limit and matching gift create urgency"
          }
        ]);
      }
    } catch (error) {
      console.error('Error generating variations:', error);
    }
    setIsGenerating(false);
  };

  const calculateSampleSize = () => {
    // Simple sample size calculation for email testing
    const currentRate = parseFloat(scenario.currentPerformance) / 100;
    const desiredLift = 0.2; // 20% lift
    const power = 0.8;
    const significance = 0.05;
    
    // Simplified calculation
    const estimatedSize = Math.ceil(16 * (currentRate * (1 - currentRate)) / Math.pow(currentRate * desiredLift, 2));
    return Math.max(500, Math.min(10000, estimatedSize));
  };

  const analyzeTest = () => {
    setShowAnalysis(true);
    
    let currentScore = 0;
    
    // Both versions provided
    if (versionA.length > 10 && versionB.length > 10) currentScore += 25;
    
    // Clear hypothesis
    if (hypothesis.length > 20 && hypothesis.toLowerCase().includes('because')) currentScore += 25;
    
    // Versions are meaningfully different
    const similarity = versionA.toLowerCase() === versionB.toLowerCase() ? 0 : 
                      versionA.split(' ').filter(word => versionB.toLowerCase().includes(word.toLowerCase())).length / versionA.split(' ').length;
    if (similarity < 0.7) currentScore += 25;
    
    // Appropriate sample size
    const sampleNum = parseInt(sampleSize);
    if (sampleNum >= 500 && sampleNum <= 10000) currentScore += 25;
    
    setScore(currentScore);
    setProgress(((currentScenario + 1) / scenarios.length) * 100);
    
    if (currentScore >= 75) {
      setSavedTests(prev => [...prev, {
        element: selectedTestElement?.name,
        versionA,
        versionB,
        hypothesis,
        sampleSize,
        scenario: scenario.context
      }]);
    }
  };

  const moveToNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setVersionA('');
      setVersionB('');
      setHypothesis('');
      setSampleSize('1000');
      setAiVariations([]);
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
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">A/B Test Creator</h2>
              <p className="text-sm text-muted-foreground">Design tests to optimize performance</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Test {currentScenario + 1} / {scenarios.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="creator"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Test Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Context:</span>
                    <p className="text-sm text-muted-foreground">{scenario.context}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Target Metric:</span>
                    <p className="text-sm text-muted-foreground">{scenario.metric}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Current Performance:</span>
                    <p className="text-sm text-muted-foreground">{scenario.currentPerformance}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Goal:</span>
                    <p className="text-sm text-muted-foreground">{scenario.goal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Design Your A/B Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3">1. Choose Element to Test</Label>
                  <RadioGroup value={selectedElement} onValueChange={setSelectedElement}>
                    <div className="grid grid-cols-2 gap-3">
                      {testElements.map((element) => (
                        <div key={element.id} className="flex items-start space-x-2">
                          <RadioGroupItem value={element.id} id={element.id} />
                          <Label htmlFor={element.id} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              {element.icon}
                              <span>{element.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{element.description}</p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">2. Create Variations</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Version A (Control)</Label>
                        <Textarea
                          placeholder="Current version..."
                          value={versionA}
                          onChange={(e) => setVersionA(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Version B (Test)</Label>
                        <Textarea
                          placeholder="New version to test..."
                          value={versionB}
                          onChange={(e) => setVersionB(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. State Your Hypothesis</Label>
                    <Textarea
                      placeholder="I believe Version B will perform better because..."
                      value={hypothesis}
                      onChange={(e) => setHypothesis(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. Sample Size</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        type="number"
                        placeholder="1000"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(e.target.value)}
                        className="w-32"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSampleSize(calculateSampleSize().toString())}
                      >
                        Calculate Recommended
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Emails per variation for statistical significance
                    </p>
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
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get AI Ideas
                  </Button>
                  <Button
                    onClick={analyzeTest}
                    disabled={!versionA || !versionB || !hypothesis}
                    className="flex-1"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Test
                  </Button>
                </div>

                {aiVariations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-medium">AI Test Ideas:</p>
                    {aiVariations.map((variation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setVersionA(variation.a);
                          setVersionB(variation.b);
                          setHypothesis(variation.hypothesis);
                        }}
                      >
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">A:</p>
                            <p className="text-sm">{variation.a}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">B:</p>
                            <p className="text-sm">{variation.b}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic">{variation.hypothesis}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Testing Tip:</strong> Only test one element at a time for clear results. 
                    Run tests for at least 1-2 weeks to account for daily variations.
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
                <CardTitle>Test Analysis</CardTitle>
                <CardDescription>
                  Is your A/B test ready to run?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium mb-2">Test Element: {selectedTestElement?.name}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Version A (Control):</p>
                        <p className="text-sm">{versionA}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Version B (Test):</p>
                        <p className="text-sm">{versionB}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hypothesis:</p>
                    <p className="text-sm italic">{hypothesis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sample Size:</p>
                    <p className="text-sm">{sampleSize} emails per variation</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${versionA.length > 10 && versionB.length > 10 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Both variations provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${hypothesis.length > 20 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Clear hypothesis stated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 75 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Meaningful difference between versions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${parseInt(sampleSize) >= 500 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Adequate sample size</span>
                  </div>
                </div>

                {score >= 75 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Well-designed test! This will provide clear insights into what resonates with your audience.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Good start! Make sure your variations are different enough to test your hypothesis effectively.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Next Test Scenario
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Creator
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedTests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Test Library</CardTitle>
              <CardDescription>A/B tests ready to implement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedTests.map((test, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{test.element} Test</span>
                      <Badge variant="outline">{test.scenario}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{test.hypothesis}</p>
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

export default ABTestCreator;