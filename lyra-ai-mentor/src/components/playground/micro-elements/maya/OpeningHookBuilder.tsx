import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Trophy,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIService } from '@/services/aiService';

interface HookType {
  id: string;
  name: string;
  description: string;
  example: string;
  template: string;
  icon: React.ReactNode;
}

const hookTypes: HookType[] = [
  {
    id: 'story',
    name: 'Story Hook',
    description: 'Start with a personal narrative',
    example: 'Last Tuesday, Maria stood in her empty classroom, wondering how she\'d teach science without any supplies...',
    template: '[Time], [Person] [Action], [Emotional detail]...',
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: 'question',
    name: 'Question Hook',
    description: 'Engage with a thought-provoking question',
    example: 'What if every child in our community had access to music education?',
    template: 'What if [desired outcome]? / Have you ever [relatable experience]?',
    icon: <AlertCircle className="w-4 h-4" />
  },
  {
    id: 'statistic',
    name: 'Statistic Hook',
    description: 'Lead with surprising data',
    example: '73% of students in our district don\'t have access to after-school programs. That\'s 4,500 kids.',
    template: '[Percentage/Number] of [group] [surprising fact]. That\'s [humanized number].',
    icon: <Target className="w-4 h-4" />
  },
  {
    id: 'urgency',
    name: 'Urgency Hook',
    description: 'Create time-sensitive importance',
    example: 'In just 48 hours, we\'ll know if our youth center can stay open for another year.',
    template: 'In just [timeframe], [important outcome will be decided].',
    icon: <Zap className="w-4 h-4" />
  }
];

interface Scenario {
  context: string;
  audience: string;
  goal: string;
}

const scenarios: Scenario[] = [
  {
    context: 'End-of-year fundraising campaign',
    audience: 'Regular donors',
    goal: 'Inspire year-end giving'
  },
  {
    context: 'Volunteer recruitment for tutoring program',
    audience: 'Parents and professionals',
    goal: 'Get 20 new volunteer tutors'
  },
  {
    context: 'Emergency appeal for natural disaster',
    audience: 'Full donor database',
    goal: 'Raise immediate relief funds'
  }
];

const OpeningHookBuilder: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedHookType, setSelectedHookType] = useState<string>('story');
  const [userHook, setUserHook] = useState('');
  const [aiVariations, setAiVariations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedHooks, setSavedHooks] = useState<{hook: string, type: string}[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const scenario = scenarios[currentScenario];
  const currentHookType = hookTypes.find(h => h.id === selectedHookType);

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
        prompt: `Generate 3 variations of a ${currentHookType?.name} for this email:
        Context: ${scenario.context}
        Audience: ${scenario.audience}
        Goal: ${scenario.goal}
        
        Use this template: ${currentHookType?.template}
        
        Make each variation compelling and different. Format as a JSON array of strings.`,
        context: "You are an expert nonprofit copywriter specializing in engaging email openings.",
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
        "When Sarah walked into our food pantry last week, she whispered something that stopped me cold...",
        "Yesterday, a 7-year-old asked me why some kids don't have breakfast. Here's what I told him...",
        "Three months ago, this neighborhood didn't have a safe place for kids to play. Today..."
      ]);
    }
    setIsGenerating(false);
  };

  const analyzeHook = () => {
    setShowFeedback(true);
    
    let currentScore = 0;
    const hook = userHook.toLowerCase();
    
    // Length check (20-100 chars ideal for opening)
    if (userHook.length >= 20 && userHook.length <= 100) currentScore += 20;
    
    // Specificity (contains numbers, names, or specific details)
    if (/\d+|monday|tuesday|wednesday|thursday|friday|last week|yesterday/i.test(userHook)) currentScore += 20;
    
    // Emotional/sensory language
    const emotionalWords = ['wondered', 'surprised', 'amazed', 'worried', 'hoped', 'dreamed', 'felt', 'saw', 'heard'];
    if (emotionalWords.some(word => hook.includes(word))) currentScore += 20;
    
    // Creates curiosity (questions, ellipsis, incomplete thought)
    if (hook.includes('?') || hook.includes('...') || hook.includes('but')) currentScore += 20;
    
    // Relevance to hook type
    if (selectedHookType === 'question' && hook.includes('?')) currentScore += 20;
    else if (selectedHookType === 'statistic' && /\d+/.test(hook)) currentScore += 20;
    else if (selectedHookType === 'story' && emotionalWords.some(word => hook.includes(word))) currentScore += 20;
    else if (selectedHookType === 'urgency' && /hour|day|week|time|now|today/i.test(hook)) currentScore += 20;
    else currentScore += 10;
    
    setScore(currentScore);
    setProgress(((currentScenario + 1) / scenarios.length) * 100);
    
    if (currentScore >= 60) {
      setSavedHooks(prev => [...prev, { hook: userHook, type: currentHookType?.name || '' }]);
    }
  };

  const moveToNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setUserHook('');
      setAiVariations([]);
      setShowFeedback(false);
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
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Opening Hook Builder</h2>
              <p className="text-sm text-muted-foreground">Craft attention-grabbing email openings</p>
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
        {!showFeedback ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Your Email Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Campaign:</span>
                    <p className="text-sm text-muted-foreground">{scenario.context}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Audience:</span>
                    <p className="text-sm text-muted-foreground">{scenario.audience}</p>
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
                <CardTitle className="text-lg">Choose Your Hook Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {hookTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedHookType(type.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedHookType === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {type.icon}
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </motion.button>
                  ))}
                </div>

                {currentHookType && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <p className="text-sm font-medium mb-2">Example:</p>
                    <p className="text-sm italic">{currentHookType.example}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Template: {currentHookType.template}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Write Your Opening Hook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="write">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="examples">AI Examples</TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="space-y-4">
                    <Textarea
                      placeholder={`Write your ${currentHookType?.name} here...`}
                      value={userHook}
                      onChange={(e) => setUserHook(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="text-sm text-muted-foreground">
                      {userHook.length} characters (aim for 20-100)
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    <Button
                      onClick={generateVariations}
                      variant="outline"
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Generate AI Examples
                    </Button>

                    {aiVariations.map((variation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                        onClick={() => setUserHook(variation)}
                      >
                        <p className="text-sm">{variation}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to use</p>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> The best hooks create curiosity while being specific. 
                    Use concrete details (names, numbers, times) to make your opening feel real and immediate.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={analyzeHook}
                  disabled={userHook.length < 10}
                  className="w-full"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Analyze My Hook
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Hook Analysis</CardTitle>
                <CardDescription>
                  How compelling is your opening?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Your Hook ({currentHookType?.name}):</p>
                  <p className="italic">{userHook}</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${userHook.length >= 20 && userHook.length <= 100 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Good length (20-100 characters)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/\d+|monday|tuesday|wednesday|thursday|friday|last week|yesterday/i.test(userHook) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Contains specific details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 60 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Creates emotional connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${userHook.includes('?') || userHook.includes('...') ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Builds curiosity</span>
                  </div>
                </div>

                {score >= 60 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Excellent hook! This will grab attention and encourage readers to continue.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Good start! Try adding more specific details or emotional elements to increase engagement.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Try Next Scenario
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Builder
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedHooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Hook Collection</CardTitle>
              <CardDescription>Opening hooks ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedHooks.map((item, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <p className="text-sm">{item.hook}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.type}</p>
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

export default OpeningHookBuilder;