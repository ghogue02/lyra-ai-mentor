import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Sparkles, 
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Trophy,
  Clock,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIService } from '@/services/aiService';

interface SubjectLineExample {
  context: string;
  bad: string;
  good: string;
  why: string;
  tips: string[];
}

const examples: SubjectLineExample[] = [
  {
    context: "Annual fundraising campaign email",
    bad: "Donation Request",
    good: "You can help Sarah go to college this year",
    why: "Personal story creates emotional connection",
    tips: [
      "Use specific names or stories",
      "Focus on impact, not the ask",
      "Create urgency without pressure"
    ]
  },
  {
    context: "Volunteer recruitment",
    bad: "We need volunteers",
    good: "Join 50+ neighbors making our park beautiful Saturday",
    why: "Shows community involvement and specific action",
    tips: [
      "Include social proof (numbers)",
      "Be specific about time/place",
      "Use active, inviting language"
    ]
  },
  {
    context: "Event invitation",
    bad: "Gala Invitation",
    good: "Reserve your seat: An evening with Maya Angelou's legacy",
    why: "Creates FOMO and highlights unique value",
    tips: [
      "Start with action verb",
      "Highlight exclusive element",
      "Name drop when relevant"
    ]
  }
];

const SubjectLineWorkshop: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [userSubjectLine, setUserSubjectLine] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [toolkit, setToolkit] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const example = examples[currentExample];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateAISuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Generate 3 compelling email subject lines for this context: "${example.context}". 
        Make them engaging, specific, and action-oriented. Format as a JSON array of strings.`,
        context: "You are an expert email marketing specialist focused on nonprofit communications.",
        temperature: 0.9
      });

      try {
        const suggestions = JSON.parse(response.content);
        setAiSuggestions(Array.isArray(suggestions) ? suggestions : [response.content]);
      } catch {
        // If not valid JSON, split by newlines
        setAiSuggestions(response.content.split('\n').filter(s => s.trim()));
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setAiSuggestions([
        "Help us reach our goal: 100 students, 100 futures",
        "Your impact story inside: Meet the family you helped",
        "Last chance to double your gift this year"
      ]);
    }
    setIsGenerating(false);
  };

  const analyzeSubjectLine = async () => {
    setShowAnalysis(true);
    
    // Simple scoring based on best practices
    let currentScore = 0;
    const line = userSubjectLine.toLowerCase();
    
    // Length check (30-50 chars is ideal)
    if (userSubjectLine.length >= 30 && userSubjectLine.length <= 50) currentScore += 20;
    
    // Has action verb
    const actionVerbs = ['join', 'help', 'discover', 'meet', 'save', 'reserve', 'unlock'];
    if (actionVerbs.some(verb => line.includes(verb))) currentScore += 20;
    
    // Has number/specificity
    if (/\d+/.test(userSubjectLine)) currentScore += 20;
    
    // Personal/emotional element
    const emotionalWords = ['you', 'your', 'story', 'impact', 'together', 'community'];
    if (emotionalWords.some(word => line.includes(word))) currentScore += 20;
    
    // Not using spam triggers
    const spamWords = ['free', 'urgent', 'act now', '!!!', 'click here'];
    if (!spamWords.some(word => line.includes(word))) currentScore += 20;
    
    setScore(currentScore);
    setProgress(((currentExample + 1) / examples.length) * 100);
    
    // Add to toolkit if score is good
    if (currentScore >= 60) {
      setToolkit(prev => [...prev, userSubjectLine]);
    }
  };

  const moveToNext = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(prev => prev + 1);
      setUserSubjectLine('');
      setAiSuggestions([]);
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
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Subject Line Workshop</h2>
              <p className="text-sm text-muted-foreground">Master the art of compelling email subjects</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              {currentExample + 1} / {examples.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="workshop"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Scenario</CardTitle>
                <CardDescription>{example.context}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-900">Weak Example</span>
                    </div>
                    <p className="text-red-800">{example.bad}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">Strong Example</span>
                    </div>
                    <p className="text-green-800">{example.good}</p>
                    <p className="text-sm text-green-700 mt-2 italic">{example.why}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Your Turn: Write a Subject Line</Label>
                  <Input
                    placeholder="Type your subject line here..."
                    value={userSubjectLine}
                    onChange={(e) => setUserSubjectLine(e.target.value)}
                    className="text-lg"
                    maxLength={60}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{userSubjectLine.length} / 60 characters</span>
                    <span className="text-green-600">Ideal: 30-50 chars</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateAISuggestions}
                    variant="outline"
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get AI Suggestions
                  </Button>
                  <Button
                    onClick={analyzeSubjectLine}
                    disabled={userSubjectLine.length < 10}
                    className="flex-1"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Analyze My Subject
                  </Button>
                </div>

                {aiSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Brain className="w-4 h-4 text-primary" />
                      AI Suggestions
                    </div>
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                        onClick={() => setUserSubjectLine(suggestion)}
                      >
                        <p className="text-sm">{suggestion}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to use</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tips:</strong>
                    <ul className="mt-2 space-y-1">
                      {example.tips.map((tip, index) => (
                        <li key={index} className="text-sm">• {tip}</li>
                      ))}
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
                <CardTitle>Subject Line Analysis</CardTitle>
                <CardDescription>
                  Let's see how your subject line performs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Your Subject Line:</p>
                  <p className="text-lg">{userSubjectLine}</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${userSubjectLine.length >= 30 && userSubjectLine.length <= 50 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Optimal length (30-50 characters)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/join|help|discover|meet|save|reserve|unlock/i.test(userSubjectLine) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Contains action verb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/\d+/.test(userSubjectLine) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Includes specific numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${/you|your|story|impact|together|community/i.test(userSubjectLine) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Personal or emotional element</span>
                  </div>
                </div>

                {score >= 60 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Great work! This subject line has been added to your toolkit.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Good effort! Try incorporating more of the elements above to improve your score.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentExample < examples.length - 1 ? (
                    <>
                      Next Scenario
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

      {toolkit.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Subject Line Toolkit</CardTitle>
              <CardDescription>Subject lines you've mastered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {toolkit.map((line, index) => (
                  <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                    {line}
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

export default SubjectLineWorkshop;
export { SubjectLineWorkshop };