import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  MousePointer,
  Mail,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Trophy,
  Target,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AIService } from '@/services/aiService';

interface Metric {
  name: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  benchmark: string;
  description: string;
}

interface AnalyticsScenario {
  campaignName: string;
  sentTo: string;
  metrics: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
    unsubscribeRate: number;
    averageGift: number;
    totalRaised: number;
  };
  benchmarks: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
    unsubscribeRate: number;
  };
  context: string;
}

const scenarios: AnalyticsScenario[] = [
  {
    campaignName: 'Year-End Appeal 2023',
    sentTo: '5,000 donors',
    metrics: {
      openRate: 28.5,
      clickRate: 4.2,
      conversionRate: 2.8,
      unsubscribeRate: 0.5,
      averageGift: 125,
      totalRaised: 17500
    },
    benchmarks: {
      openRate: 25,
      clickRate: 3.5,
      conversionRate: 2.5,
      unsubscribeRate: 0.3
    },
    context: 'Annual fundraising campaign sent to active donors'
  },
  {
    campaignName: 'Monthly Donor Drive',
    sentTo: '2,000 one-time donors',
    metrics: {
      openRate: 22.3,
      clickRate: 2.8,
      conversionRate: 1.5,
      unsubscribeRate: 0.8,
      averageGift: 25,
      totalRaised: 750
    },
    benchmarks: {
      openRate: 25,
      clickRate: 3.5,
      conversionRate: 2.0,
      unsubscribeRate: 0.3
    },
    context: 'Campaign to convert one-time donors to monthly giving'
  },
  {
    campaignName: 'Emergency Relief Appeal',
    sentTo: '10,000 subscribers',
    metrics: {
      openRate: 42.1,
      clickRate: 8.7,
      conversionRate: 5.2,
      unsubscribeRate: 0.2,
      averageGift: 85,
      totalRaised: 44200
    },
    benchmarks: {
      openRate: 25,
      clickRate: 3.5,
      conversionRate: 2.5,
      unsubscribeRate: 0.3
    },
    context: 'Urgent appeal following natural disaster'
  }
];

interface InsightQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const EmailAnalytics: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedInsights, setSavedInsights] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const scenario = scenarios[currentScenario];

  const insightQuestions: InsightQuestion[] = [
    {
      id: 'open-rate',
      question: `The open rate is ${scenario.metrics.openRate}% (benchmark: ${scenario.benchmarks.openRate}%). What should you focus on?`,
      options: [
        'Send more emails to increase visibility',
        'Improve subject lines and sender name',
        'Change the email design',
        'Add more images'
      ],
      correctAnswer: 1,
      explanation: 'Subject lines and sender names are the primary factors affecting open rates. They\'re the first things recipients see.'
    },
    {
      id: 'click-rate',
      question: `The click rate is ${scenario.metrics.clickRate}%. What\'s the best way to improve it?`,
      options: [
        'Add more links throughout the email',
        'Make CTAs clearer and more prominent',
        'Write longer emails with more content',
        'Use smaller fonts to fit more text'
      ],
      correctAnswer: 1,
      explanation: 'Clear, prominent CTAs that stand out visually and communicate value drive higher click rates.'
    },
    {
      id: 'conversion',
      question: `${scenario.metrics.conversionRate}% of recipients donated. How can you increase conversions?`,
      options: [
        'Ask for larger donation amounts',
        'Remove the donation form to reduce friction',
        'Strengthen the value proposition and urgency',
        'Only email major donors'
      ],
      correctAnswer: 2,
      explanation: 'A compelling value proposition that shows impact and appropriate urgency motivates action.'
    }
  ];

  const currentQuestion = insightQuestions[Math.floor(currentScenario % insightQuestions.length)];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Analyze these email campaign metrics and provide 3 actionable insights:
        Campaign: ${scenario.campaignName}
        Open Rate: ${scenario.metrics.openRate}% (benchmark: ${scenario.benchmarks.openRate}%)
        Click Rate: ${scenario.metrics.clickRate}% (benchmark: ${scenario.benchmarks.clickRate}%)
        Conversion Rate: ${scenario.metrics.conversionRate}% (benchmark: ${scenario.benchmarks.conversionRate}%)
        Unsubscribe Rate: ${scenario.metrics.unsubscribeRate}% (benchmark: ${scenario.benchmarks.unsubscribeRate}%)
        
        Provide specific, actionable recommendations. Format as a JSON array of strings.`,
        context: "You are an expert email marketing analyst for nonprofits.",
        temperature: 0.7
      });

      try {
        const parsedInsights = JSON.parse(response.content);
        setInsights(Array.isArray(parsedInsights) ? parsedInsights : [response.content]);
      } catch {
        setInsights([
          "Your open rate exceeds benchmarks - your subject lines are working well. Consider A/B testing to push even higher.",
          "Click-through rate is strong but could improve. Test button colors and placement for better visibility.",
          "Conversion rate is solid. Try adding donor testimonials or matching gift opportunities to boost further."
        ]);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    }
    setIsAnalyzing(false);
  };

  const getMetrics = (): Metric[] => [
    {
      name: 'Open Rate',
      value: `${scenario.metrics.openRate}%`,
      change: ((scenario.metrics.openRate - scenario.benchmarks.openRate) / scenario.benchmarks.openRate) * 100,
      icon: <Mail className="w-4 h-4" />,
      benchmark: `${scenario.benchmarks.openRate}%`,
      description: 'Percentage who opened the email'
    },
    {
      name: 'Click Rate',
      value: `${scenario.metrics.clickRate}%`,
      change: ((scenario.metrics.clickRate - scenario.benchmarks.clickRate) / scenario.benchmarks.clickRate) * 100,
      icon: <MousePointer className="w-4 h-4" />,
      benchmark: `${scenario.benchmarks.clickRate}%`,
      description: 'Percentage who clicked a link'
    },
    {
      name: 'Conversion Rate',
      value: `${scenario.metrics.conversionRate}%`,
      change: ((scenario.metrics.conversionRate - scenario.benchmarks.conversionRate) / scenario.benchmarks.conversionRate) * 100,
      icon: <DollarSign className="w-4 h-4" />,
      benchmark: `${scenario.benchmarks.conversionRate}%`,
      description: 'Percentage who donated'
    },
    {
      name: 'Unsubscribe Rate',
      value: `${scenario.metrics.unsubscribeRate}%`,
      change: ((scenario.metrics.unsubscribeRate - scenario.benchmarks.unsubscribeRate) / scenario.benchmarks.unsubscribeRate) * 100,
      icon: <Users className="w-4 h-4" />,
      benchmark: `${scenario.benchmarks.unsubscribeRate}%`,
      description: 'Percentage who unsubscribed'
    }
  ];

  const checkAnswer = () => {
    setShowExplanation(true);
    const isCorrect = selectedAnswer === currentQuestion.options[currentQuestion.correctAnswer];
    
    if (isCorrect) {
      setScore(prev => prev + 33);
    }
    
    setProgress(((currentScenario + 1) / scenarios.length) * 100);
  };

  const analyzePerformance = () => {
    setShowRecommendations(true);
    
    // Calculate overall performance score
    const metrics = getMetrics();
    let performanceScore = 0;
    
    metrics.forEach(metric => {
      if (metric.name === 'Unsubscribe Rate') {
        // Lower is better for unsubscribe
        if (metric.change <= 0) performanceScore += 25;
        else if (metric.change < 50) performanceScore += 15;
      } else {
        // Higher is better for other metrics
        if (metric.change > 0) performanceScore += 25;
        else if (metric.change > -20) performanceScore += 15;
      }
    });
    
    setScore(performanceScore);
    
    if (performanceScore >= 75) {
      setSavedInsights(prev => [...prev, {
        campaign: scenario.campaignName,
        insights: insights,
        score: performanceScore
      }]);
    }
  };

  const moveToNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setInsights([]);
      setShowRecommendations(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Email Analytics</h2>
              <p className="text-sm text-muted-foreground">Understand performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Campaign {currentScenario + 1} / {scenarios.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showRecommendations ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">{scenario.campaignName}</CardTitle>
                <CardDescription>
                  {scenario.context} • Sent to {scenario.sentTo}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Raised</p>
                              <p className="text-2xl font-bold">{formatCurrency(scenario.metrics.totalRaised)}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Average Gift</p>
                              <p className="text-2xl font-bold">{formatCurrency(scenario.metrics.averageGift)}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-6 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-4">Performance Summary</h4>
                      <div className="space-y-3">
                        {getMetrics().slice(0, 3).map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {metric.icon}
                              <span className="text-sm">{metric.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{metric.value}</span>
                              <Badge variant={metric.change > 0 ? 'default' : 'secondary'}>
                                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    {getMetrics().map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${
                              metric.change > 0 ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {metric.icon}
                            </div>
                            <div>
                              <p className="font-medium">{metric.name}</p>
                              <p className="text-sm text-muted-foreground">{metric.description}</p>
                            </div>
                          </div>
                          {metric.change > 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Your Result</p>
                            <p className="font-medium">{metric.value}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Benchmark</p>
                            <p className="font-medium">{metric.benchmark}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Difference</p>
                            <p className={`font-medium ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Test Your Analysis Skills</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">{currentQuestion.question}</p>
                        
                        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                          {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        {!showExplanation && (
                          <Button 
                            onClick={checkAnswer}
                            disabled={!selectedAnswer}
                            className="w-full"
                          >
                            Check Answer
                          </Button>
                        )}

                        {showExplanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <Alert className={selectedAnswer === currentQuestion.options[currentQuestion.correctAnswer] ? 'border-green-200' : 'border-red-200'}>
                              {selectedAnswer === currentQuestion.options[currentQuestion.correctAnswer] ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                              <AlertDescription>
                                <strong>{selectedAnswer === currentQuestion.options[currentQuestion.correctAnswer] ? 'Correct!' : 'Not quite.'}</strong>
                                <p className="mt-2">{currentQuestion.explanation}</p>
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        onClick={generateInsights}
                        variant="outline"
                        disabled={isAnalyzing}
                        className="flex-1"
                      >
                        {isAnalyzing ? (
                          <Eye className="w-4 h-4 mr-2 animate-pulse" />
                        ) : (
                          <Target className="w-4 h-4 mr-2" />
                        )}
                        Get AI Insights
                      </Button>
                      <Button
                        onClick={analyzePerformance}
                        className="flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Complete Analysis
                      </Button>
                    </div>

                    {insights.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <p className="text-sm font-medium">AI-Generated Insights:</p>
                        {insights.map((insight, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>

                <Alert className="mt-4">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Analytics Tip:</strong> Focus on trends over time rather than individual campaigns. 
                    Look for patterns in what works with your specific audience.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Analytics Summary</CardTitle>
                <CardDescription>
                  Your understanding of email metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Campaign Performance</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Raised</p>
                      <p className="font-bold text-lg">{formatCurrency(scenario.metrics.totalRaised)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Donors</p>
                      <p className="font-bold text-lg">
                        {Math.round(scenario.metrics.totalRaised / scenario.metrics.averageGift)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Key Takeaways:</h4>
                  <div className="space-y-2">
                    {getMetrics().map((metric, index) => {
                      const isPositive = metric.name === 'Unsubscribe Rate' ? metric.change <= 0 : metric.change > 0;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-5 h-5 ${isPositive ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className="text-sm">
                            {metric.name}: {isPositive ? 'Above' : 'Below'} benchmark
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {score >= 75 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Strong performance! You understand how to interpret and act on email metrics.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      Good analysis! Keep monitoring metrics over time to identify trends and opportunities.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Next Campaign
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Analytics
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Analytics Insights</CardTitle>
              <CardDescription>Key learnings from campaign analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedInsights.map((item, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{item.campaign}</p>
                      <Badge variant="outline">{item.score}% performance</Badge>
                    </div>
                    {item.insights.length > 0 && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.insights[0]}
                      </p>
                    )}
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

export default EmailAnalytics;