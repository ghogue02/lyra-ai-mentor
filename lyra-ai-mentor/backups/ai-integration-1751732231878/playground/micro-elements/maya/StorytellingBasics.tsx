import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Heart,
  Target,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Trophy,
  Clock,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AIService } from '@/services/aiService';

interface StoryElement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  example: string;
}

const storyElements: StoryElement[] = [
  {
    id: 'character',
    name: 'Character',
    description: 'Introduce a real person',
    icon: <Users className="w-4 h-4" />,
    example: 'Maria, a single mother of three'
  },
  {
    id: 'challenge',
    name: 'Challenge',
    description: 'Present the problem',
    icon: <Target className="w-4 h-4" />,
    example: 'struggling to afford school supplies'
  },
  {
    id: 'transformation',
    name: 'Transformation',
    description: 'Show the change',
    icon: <TrendingUp className="w-4 h-4" />,
    example: 'received backpacks full of supplies from our program'
  },
  {
    id: 'impact',
    name: 'Impact',
    description: 'Reveal the outcome',
    icon: <Heart className="w-4 h-4" />,
    example: 'her children started the school year with confidence'
  }
];

interface StoryPrompt {
  context: string;
  goal: string;
  audience: string;
  facts: string[];
}

const storyPrompts: StoryPrompt[] = [
  {
    context: 'Food bank donation appeal',
    goal: 'Increase monthly donors',
    audience: 'Current one-time donors',
    facts: [
      '1 in 8 families face food insecurity',
      'Served 5,000 families last month',
      '$50 provides a week of groceries',
      'Need 100 new monthly donors'
    ]
  },
  {
    context: 'Youth mentorship program',
    goal: 'Recruit volunteer mentors',
    audience: 'Local professionals',
    facts: [
      '200 kids on waiting list',
      '2 hours per week commitment',
      '85% of mentored youth graduate',
      'Training provided'
    ]
  },
  {
    context: 'Housing support services',
    goal: 'Year-end fundraising',
    audience: 'Major donors',
    facts: [
      'Prevented 150 evictions this year',
      'Average family stays housed',
      '$1,000 keeps family in home',
      'Goal: raise $100,000'
    ]
  }
];

const StorytellingBasics: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [storyDraft, setStoryDraft] = useState<{[key: string]: string}>({
    character: '',
    challenge: '',
    transformation: '',
    impact: ''
  });
  const [activeElement, setActiveElement] = useState('character');
  const [aiEnhancement, setAiEnhancement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const prompt = storyPrompts[currentPrompt];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateAIEnhancement = async () => {
    setIsGenerating(true);
    try {
      const fullStory = Object.values(storyDraft).join(' ');
      const response = await aiService.generateResponse({
        prompt: `Enhance this nonprofit story for a ${prompt.context}. Make it more emotionally compelling while keeping it under 150 words:
        
        Current story: ${fullStory}
        
        Context: ${prompt.context}
        Goal: ${prompt.goal}
        
        Keep the same structure but make it more vivid and impactful.`,
        context: "You are an expert nonprofit storyteller who creates emotionally resonant narratives.",
        temperature: 0.8
      });

      setAiEnhancement(response.content);
    } catch (error) {
      console.error('Error generating enhancement:', error);
      setAiEnhancement("When Maria walked into our food bank last Tuesday, her eyes told a story of sleepless nights and tough choices. As a single mother of three, she'd been skipping meals so her children could eat. But that day, everything changed. Our volunteers filled her cart with fresh produce, proteins, and pantry staples - a week's worth of nutritious food. 'I can breathe again,' Maria whispered, tears in her eyes. That night, for the first time in months, the whole family sat down to a full dinner together. Your monthly gift makes moments like these possible.");
    }
    setIsGenerating(false);
  };

  const analyzeStory = () => {
    setShowReview(true);
    
    let currentScore = 0;
    const fullStory = Object.values(storyDraft).join(' ');
    
    // Has all elements filled
    if (Object.values(storyDraft).every(element => element.length > 10)) currentScore += 25;
    
    // Good length (100-200 words ideal)
    const wordCount = fullStory.split(' ').length;
    if (wordCount >= 50 && wordCount <= 200) currentScore += 25;
    
    // Emotional language
    const emotionalWords = ['hope', 'dream', 'struggle', 'joy', 'grateful', 'transform', 'impact', 'change', 'together'];
    const emotionalCount = emotionalWords.filter(word => fullStory.toLowerCase().includes(word)).length;
    if (emotionalCount >= 2) currentScore += 25;
    
    // Specific details
    if (/\d+|monday|tuesday|names|specific/i.test(fullStory)) currentScore += 25;
    
    setScore(currentScore);
    setProgress(((currentPrompt + 1) / storyPrompts.length) * 100);
    
    if (currentScore >= 75) {
      setSavedStories(prev => [...prev, fullStory]);
    }
  };

  const moveToNext = () => {
    if (currentPrompt < storyPrompts.length - 1) {
      setCurrentPrompt(prev => prev + 1);
      setStoryDraft({
        character: '',
        challenge: '',
        transformation: '',
        impact: ''
      });
      setActiveElement('character');
      setAiEnhancement('');
      setShowReview(false);
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

  const getFullStory = () => {
    return `${storyDraft.character} ${storyDraft.challenge}. ${storyDraft.transformation}, and ${storyDraft.impact}.`;
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
              <h2 className="text-xl font-semibold">Storytelling Basics</h2>
              <p className="text-sm text-muted-foreground">Transform facts into compelling narratives</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Story {currentPrompt + 1} / {storyPrompts.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showReview ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Your Story Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Campaign:</span>
                      <p className="text-sm text-muted-foreground">{prompt.context}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Goal:</span>
                      <p className="text-sm text-muted-foreground">{prompt.goal}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Key Facts to Include:</span>
                    <ul className="mt-1 space-y-1">
                      {prompt.facts.map((fact, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {fact}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Build Your Story</CardTitle>
                <CardDescription>Click each element to add details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storyElements.map((element, index) => (
                    <motion.div
                      key={element.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => setActiveElement(element.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          activeElement === element.id
                            ? 'border-primary bg-primary/5'
                            : storyDraft[element.id]
                            ? 'border-green-500 bg-green-50'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${
                            storyDraft[element.id] ? 'bg-green-500 text-white' : 'bg-muted'
                          }`}>
                            {element.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{element.name}</h4>
                              {storyDraft[element.id] && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{element.description}</p>
                            {storyDraft[element.id] ? (
                              <p className="text-sm mt-2 italic">{storyDraft[element.id]}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground mt-1">Example: {element.example}</p>
                            )}
                          </div>
                        </div>
                      </button>

                      {activeElement === element.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 px-4"
                        >
                          <Textarea
                            placeholder={`Write your ${element.name.toLowerCase()}...`}
                            value={storyDraft[element.id]}
                            onChange={(e) => setStoryDraft(prev => ({
                              ...prev,
                              [element.id]: e.target.value
                            }))}
                            className="min-h-[80px]"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {Object.values(storyDraft).every(element => element.length > 5) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-primary/5 rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Your Complete Story:</h4>
                    <p className="text-sm italic">{getFullStory()}</p>
                  </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={generateAIEnhancement}
                    variant="outline"
                    disabled={!Object.values(storyDraft).every(element => element.length > 5) || isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <Camera className="w-4 h-4 mr-2 animate-pulse" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Polish
                  </Button>
                  <Button
                    onClick={analyzeStory}
                    disabled={!Object.values(storyDraft).every(element => element.length > 5)}
                    className="flex-1"
                  >
                    Review Story
                  </Button>
                </div>

                {aiEnhancement && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong>AI-Enhanced Version:</strong>
                        <p className="mt-2 italic">{aiEnhancement}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => {
                            // In a real app, this would intelligently parse and update
                            const enhanced = aiEnhancement.split('. ');
                            if (enhanced.length >= 4) {
                              setStoryDraft({
                                character: enhanced[0],
                                challenge: enhanced[1],
                                transformation: enhanced[2],
                                impact: enhanced[3]
                              });
                            }
                          }}
                        >
                          Use This Version
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Alert className="mt-4">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Storytelling Formula:</strong> Character + Challenge + Transformation + Impact = 
                    Emotional connection that inspires action
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Story Analysis</CardTitle>
                <CardDescription>
                  How effective is your narrative?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Your Story:</p>
                  <p className="text-sm italic">{getFullStory()}</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${Object.values(storyDraft).every(element => element.length > 10) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">All story elements included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 50 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Appropriate length and pacing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 75 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Emotional resonance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/\d+/.test(getFullStory()) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Specific details included</span>
                  </div>
                </div>

                {score >= 75 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Powerful story! This narrative will connect with readers and inspire action.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Camera className="h-4 w-4" />
                    <AlertDescription>
                      Good foundation! Consider adding more specific details and emotional elements to strengthen the impact.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentPrompt < storyPrompts.length - 1 ? (
                    <>
                      Next Story Challenge
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Workshop
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedStories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Story Bank</CardTitle>
              <CardDescription>Stories ready to use in campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedStories.map((story, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <p className="text-sm italic">{story}</p>
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

export default StorytellingBasics;