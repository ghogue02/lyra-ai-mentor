import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Filter,
  Target,
  DollarSign,
  Calendar,
  Heart,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Trophy,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AIService } from '@/services/aiService';

interface SegmentCriteria {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
}

interface DonorSegment {
  id: string;
  name: string;
  criteria: string[];
  size: string;
  characteristics: string[];
  messagingStrategy: string;
  example: string;
}

const segmentCriteria: SegmentCriteria[] = [
  {
    id: 'recency',
    name: 'Last Gift Date',
    description: 'How recently they donated',
    icon: <Calendar className="w-4 h-4" />,
    active: true
  },
  {
    id: 'frequency',
    name: 'Gift Frequency',
    description: 'How often they give',
    icon: <TrendingUp className="w-4 h-4" />,
    active: true
  },
  {
    id: 'amount',
    name: 'Gift Amount',
    description: 'Average donation size',
    icon: <DollarSign className="w-4 h-4" />,
    active: true
  },
  {
    id: 'interests',
    name: 'Program Interests',
    description: 'Which programs they support',
    icon: <Heart className="w-4 h-4" />,
    active: false
  },
  {
    id: 'engagement',
    name: 'Engagement Level',
    description: 'Email opens, event attendance',
    icon: <UserCheck className="w-4 h-4" />,
    active: false
  }
];

const segmentExamples: DonorSegment[] = [
  {
    id: 'loyal-monthly',
    name: 'Loyal Monthly Donors',
    criteria: ['Monthly giving for 12+ months', 'Never missed a payment', 'Opens 80%+ emails'],
    size: '~15% of database',
    characteristics: ['Highly committed', 'Value consistency', 'Want regular updates'],
    messagingStrategy: 'Insider updates, exclusive content, personal thank yous',
    example: 'Sarah has given $25/month for 2 years and reads every update'
  },
  {
    id: 'major-occasional',
    name: 'Major Gift Prospects',
    criteria: ['Single gifts $500+', 'Gives 1-2x per year', 'High capacity indicators'],
    size: '~5% of database',
    characteristics: ['Busy professionals', 'Impact-focused', 'Prefer personal touch'],
    messagingStrategy: 'High-touch cultivation, impact reports, exclusive invitations',
    example: 'Robert gave $5,000 last year and attended the gala'
  },
  {
    id: 'lapsed-engaged',
    name: 'Lapsed but Engaged',
    criteria: ['No gift in 12+ months', 'Still opens emails', 'Past volunteer or event attendee'],
    size: '~25% of database',
    characteristics: ['Still care but lost momentum', 'May have financial changes', 'Need re-inspiration'],
    messagingStrategy: 'Win-back campaigns, impact stories, small ask to restart',
    example: 'Jennifer volunteered last year but hasn\'t donated recently'
  }
];

interface SegmentationChallenge {
  context: string;
  goal: string;
  constraints: string[];
  databaseSize: string;
}

const challenges: SegmentationChallenge[] = [
  {
    context: 'Year-end fundraising campaign',
    goal: 'Maximize donations across all segments',
    constraints: ['Limited staff time', 'Need personalized approach', 'Avoid donor fatigue'],
    databaseSize: '5,000 donors'
  },
  {
    context: 'Monthly giving program launch',
    goal: 'Convert one-time donors to monthly',
    constraints: ['Target best prospects first', 'Clear value proposition needed', 'Simple signup process'],
    databaseSize: '3,000 active donors'
  },
  {
    context: 'Capital campaign quiet phase',
    goal: 'Identify and cultivate major gift prospects',
    constraints: ['Need wealth screening', 'Requires board involvement', 'Confidential approach'],
    databaseSize: '500 qualified prospects'
  }
];

const DonorSegmentation: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [activeCriteria, setActiveCriteria] = useState<Set<string>>(new Set(['recency', 'frequency', 'amount']));
  const [customSegments, setCustomSegments] = useState<DonorSegment[]>([]);
  const [messagingNotes, setMessagingNotes] = useState('');
  const [aiSegments, setAiSegments] = useState<DonorSegment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedStrategies, setSavedStrategies] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const challenge = challenges[currentChallenge];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCriteria = (criteriaId: string) => {
    setActiveCriteria(prev => {
      const newSet = new Set(prev);
      if (newSet.has(criteriaId)) {
        newSet.delete(criteriaId);
      } else {
        newSet.add(criteriaId);
      }
      return newSet;
    });
  };

  const generateAISegments = async () => {
    setIsGenerating(true);
    try {
      const selectedCriteria = Array.from(activeCriteria).map(id => 
        segmentCriteria.find(c => c.id === id)?.name
      ).join(', ');

      const response = await aiService.generateResponse({
        prompt: `Create 3 donor segments for:
        Context: ${challenge.context}
        Goal: ${challenge.goal}
        Database Size: ${challenge.databaseSize}
        Using criteria: ${selectedCriteria}
        
        For each segment provide:
        - name: Descriptive segment name
        - criteria: Array of 3 specific criteria
        - size: Estimated percentage of database
        - characteristics: Array of 3 key traits
        - messagingStrategy: How to communicate with them
        - example: Brief persona example
        
        Format as JSON array.`,
        context: "You are an expert in donor segmentation and nonprofit fundraising strategy.",
        temperature: 0.8
      });

      try {
        const segments = JSON.parse(response.content);
        setAiSegments(segments.map((seg: any, index: number) => ({
          id: `ai-${index}`,
          ...seg
        })));
      } catch {
        // Fallback segments
        setAiSegments([
          {
            id: 'ai-1',
            name: 'VIP Sustainers',
            criteria: ['Gave 10+ times in past year', '$100+ average gift', 'Opens every email'],
            size: '~8% of database',
            characteristics: ['Deeply committed', 'Want detailed impact', 'Appreciate recognition'],
            messagingStrategy: 'Exclusive updates, personal calls, special recognition events',
            example: 'Mark gives monthly and increased his gift twice this year'
          }
        ]);
      }
    } catch (error) {
      console.error('Error generating segments:', error);
    }
    setIsGenerating(false);
  };

  const addCustomSegment = () => {
    const newSegment: DonorSegment = {
      id: `custom-${Date.now()}`,
      name: 'New Segment',
      criteria: [],
      size: '~10% of database',
      characteristics: [],
      messagingStrategy: '',
      example: ''
    };
    setCustomSegments(prev => [...prev, newSegment]);
  };

  const analyzeSegmentation = () => {
    setShowAnalysis(true);
    
    let currentScore = 0;
    const totalSegments = customSegments.length + segmentExamples.filter((_, i) => i < 2).length;
    
    // Has 3-5 segments (ideal range)
    if (totalSegments >= 3 && totalSegments <= 5) currentScore += 25;
    
    // Uses multiple criteria
    if (activeCriteria.size >= 3) currentScore += 25;
    
    // Has messaging notes
    if (messagingNotes.length > 50) currentScore += 25;
    
    // Segments cover most of database
    const coverage = totalSegments >= 3 ? 25 : 15;
    currentScore += coverage;
    
    setScore(currentScore);
    setProgress(((currentChallenge + 1) / challenges.length) * 100);
    
    if (currentScore >= 75) {
      setSavedStrategies(prev => [...prev, {
        challenge: challenge.context,
        segments: totalSegments,
        criteria: Array.from(activeCriteria),
        notes: messagingNotes
      }]);
    }
  };

  const moveToNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setCustomSegments([]);
      setMessagingNotes('');
      setAiSegments([]);
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
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Donor Segmentation</h2>
              <p className="text-sm text-muted-foreground">Target different audiences effectively</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Challenge {currentChallenge + 1} / {challenges.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="segmentation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Segmentation Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Context:</span>
                    <p className="text-sm text-muted-foreground">{challenge.context}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Goal:</span>
                    <p className="text-sm text-muted-foreground">{challenge.goal}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Database Size:</span>
                    <p className="text-sm text-muted-foreground">{challenge.databaseSize}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Constraints:</span>
                    <ul className="mt-1">
                      {challenge.constraints.map((constraint, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {constraint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Segmentation Criteria</CardTitle>
                <CardDescription>Choose which criteria to use for segmentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {segmentCriteria.map((criteria) => (
                    <div key={criteria.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${activeCriteria.has(criteria.id) ? 'bg-primary text-white' : 'bg-muted'}`}>
                          {criteria.icon}
                        </div>
                        <div>
                          <p className="font-medium">{criteria.name}</p>
                          <p className="text-sm text-muted-foreground">{criteria.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={activeCriteria.has(criteria.id)}
                        onCheckedChange={() => toggleCriteria(criteria.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Example Segments</CardTitle>
                  <Button size="sm" variant="outline" onClick={addCustomSegment}>
                    Add Custom Segment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentExamples.slice(0, 2).map((segment) => (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{segment.name}</h4>
                          <p className="text-sm text-muted-foreground">{segment.size}</p>
                        </div>
                        <Filter className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Criteria:</p>
                          <ul className="text-sm">
                            {segment.criteria.map((c, i) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Messaging Strategy:</p>
                          <p className="text-sm">{segment.messagingStrategy}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {customSegments.map((segment, index) => (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 border-2 border-dashed rounded-lg"
                    >
                      <p className="text-sm text-muted-foreground">Custom Segment {index + 1}</p>
                      <p className="text-xs mt-2">Define your criteria and strategy...</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Messaging Strategy Notes</Label>
                    <Textarea
                      placeholder="How will you tailor your messaging for each segment? What tone, frequency, and content will work best?"
                      value={messagingNotes}
                      onChange={(e) => setMessagingNotes(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={generateAISegments}
                      variant="outline"
                      disabled={isGenerating || activeCriteria.size === 0}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <Target className="w-4 h-4 mr-2 animate-pulse" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      AI Segment Ideas
                    </Button>
                    <Button
                      onClick={analyzeSegmentation}
                      className="flex-1"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Analyze Strategy
                    </Button>
                  </div>
                </div>

                {aiSegments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <p className="text-sm font-medium">AI-Generated Segments:</p>
                    {aiSegments.map((segment) => (
                      <div key={segment.id} className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">{segment.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{segment.messagingStrategy}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                <Alert className="mt-4">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Segmentation Tip:</strong> Start with 3-5 segments maximum. 
                    Too many segments become difficult to manage effectively.
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
                <CardTitle>Segmentation Analysis</CardTitle>
                <CardDescription>
                  How effective is your segmentation strategy?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Your Segmentation Strategy</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Active Criteria:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.from(activeCriteria).map(id => {
                          const criteria = segmentCriteria.find(c => c.id === id);
                          return (
                            <Badge key={id} variant="secondary">
                              {criteria?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Segments:</p>
                      <p className="text-sm text-muted-foreground">
                        {customSegments.length + 2} segments identified
                      </p>
                    </div>
                    {messagingNotes && (
                      <div>
                        <p className="text-sm font-medium">Strategy Notes:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{messagingNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${customSegments.length + 2 >= 3 && customSegments.length + 2 <= 5 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Optimal number of segments (3-5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${activeCriteria.size >= 3 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Multiple criteria used</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${messagingNotes.length > 50 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Messaging strategy defined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 75 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Comprehensive coverage</span>
                  </div>
                </div>

                {score >= 75 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Excellent segmentation! This strategy will help you communicate more effectively with each donor group.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      Good start! Consider adding more detail to your messaging strategy for each segment.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentChallenge < challenges.length - 1 ? (
                    <>
                      Next Challenge
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Segmentation
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedStrategies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Segmentation Strategies</CardTitle>
              <CardDescription>Saved approaches for different campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedStrategies.map((strategy, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{strategy.challenge}</p>
                      <Badge variant="outline">{strategy.segments} segments</Badge>
                    </div>
                    <div className="flex gap-1">
                      {strategy.criteria.map((c: string) => (
                        <Badge key={c} variant="secondary" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                    </div>
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

export default DonorSegmentation;