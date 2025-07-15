import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Timer, 
  TrendingUp,
  Eye,
  Users,
  Target,
  CheckCircle2,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface PresentationMetrics {
  clarity: number;
  pace: number;
  confidence: number;
  engagement: number;
  dataStory: number;
  overall: number;
}

interface PracticeSession {
  id: string;
  title: string;
  duration: number;
  keyPoints: string[];
  metrics: PresentationMetrics;
  feedback: string[];
  improvements: string[];
  timestamp: Date;
}

interface CoachingTip {
  category: 'voice' | 'pacing' | 'clarity' | 'confidence' | 'data';
  tip: string;
  exercise: string;
}

const DavidPresentationCoach: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [presentationTitle, setPresentationTitle] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);

  const presentationTypes = [
    {
      id: 'board-presentation',
      title: 'Board Presentation',
      description: 'Quarterly reports and strategic updates',
      keyFocus: ['Financial data', 'Impact metrics', 'Strategic recommendations'],
      duration: '15-20 min'
    },
    {
      id: 'donor-pitch',
      title: 'Donor Pitch',
      description: 'Securing funding with compelling data',
      keyFocus: ['Impact stories', 'ROI data', 'Future projections'],
      duration: '10-15 min'
    },
    {
      id: 'team-briefing',
      title: 'Team Briefing',
      description: 'Internal data sharing and insights',
      keyFocus: ['Operational metrics', 'Performance trends', 'Action items'],
      duration: '5-10 min'
    },
    {
      id: 'public-speaking',
      title: 'Public Speaking',
      description: 'Conference or community presentations',
      keyFocus: ['Key insights', 'Broader implications', 'Call to action'],
      duration: '20-30 min'
    }
  ];

  const coachingTips: CoachingTip[] = [
    {
      category: 'voice',
      tip: 'Vary your vocal pitch to maintain engagement',
      exercise: 'Practice saying numbers with different emphasis: "We served 1,200 families" vs "We served ONE THOUSAND TWO HUNDRED families"'
    },
    {
      category: 'pacing',
      tip: 'Slow down when presenting key data points',
      exercise: 'Read your most important statistic, then pause for 3 seconds before explaining what it means'
    },
    {
      category: 'clarity',
      tip: 'Define technical terms immediately',
      exercise: 'Practice: "Our retention rate - that\'s the percentage of participants who stay in our program - increased by 15%"'
    },
    {
      category: 'confidence',
      tip: 'Use confident language when presenting data',
      exercise: 'Replace "I think" or "maybe" with "The data shows" or "Evidence indicates"'
    },
    {
      category: 'data',
      tip: 'Connect every number to human impact',
      exercise: 'For each statistic, add: "What this means for the people we serve is..."'
    }
  ];

  const startPractice = () => {
    if (!presentationTitle.trim()) return;
    
    const newSession: PracticeSession = {
      id: Date.now().toString(),
      title: presentationTitle,
      duration: 0,
      keyPoints: keyPoints.split('\n').filter(point => point.trim()),
      metrics: {
        clarity: 0,
        pace: 0,
        confidence: 0,
        engagement: 0,
        dataStory: 0,
        overall: 0
      },
      feedback: [],
      improvements: [],
      timestamp: new Date()
    };
    
    setCurrentSession(newSession);
    setIsRecording(true);
    setSessionTime(0);
    
    // Start timer
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    // Store timer reference (in real app, would need proper cleanup)
    setTimeout(() => clearInterval(timer), 300000); // 5 min max
  };

  const stopPractice = () => {
    if (!currentSession) return;
    
    setIsRecording(false);
    
    // Generate AI feedback (mock)
    const duration = sessionTime;
    const wordsPerMinute = Math.floor(Math.random() * 50) + 150; // 150-200 WPM
    
    const metrics: PresentationMetrics = {
      clarity: Math.floor(Math.random() * 20) + 75, // 75-95
      pace: wordsPerMinute > 180 ? 65 : Math.floor(Math.random() * 20) + 80,
      confidence: Math.floor(Math.random() * 25) + 70, // 70-95
      engagement: Math.floor(Math.random() * 20) + 75, // 75-95
      dataStory: Math.floor(Math.random() * 25) + 70, // 70-95
      overall: 0
    };
    
    metrics.overall = Math.round(
      (metrics.clarity + metrics.pace + metrics.confidence + metrics.engagement + metrics.dataStory) / 5
    );
    
    const feedback = [];
    const improvements = [];
    
    if (metrics.pace < 75) {
      feedback.push('Speaking pace was too fast - slow down when presenting key data');
      improvements.push('Practice pausing after each major point');
    } else if (metrics.pace > 90) {
      feedback.push('Good pacing - data was easy to follow');
    }
    
    if (metrics.clarity < 80) {
      feedback.push('Some technical terms could be explained more clearly');
      improvements.push('Define jargon immediately when introduced');
    } else {
      feedback.push('Clear communication of complex concepts');
    }
    
    if (metrics.confidence < 75) {
      feedback.push('Voice showed some uncertainty - practice with confidence phrases');
      improvements.push('Replace hesitant language with data-backed statements');
    } else {
      feedback.push('Confident delivery that builds trust');
    }
    
    if (metrics.engagement < 80) {
      feedback.push('Could use more vocal variety to maintain interest');
      improvements.push('Vary tone when highlighting different data points');
    } else {
      feedback.push('Engaging presentation style that holds attention');
    }
    
    if (metrics.dataStory < 80) {
      feedback.push('Data presentation could tell a clearer story');
      improvements.push('Connect each statistic to human impact');
    } else {
      feedback.push('Strong data storytelling that connects numbers to meaning');
    }
    
    const completedSession: PracticeSession = {
      ...currentSession,
      duration,
      metrics,
      feedback,
      improvements
    };
    
    setCurrentSession(completedSession);
    setPracticeHistory(prev => [completedSession, ...prev.slice(0, 4)]);
  };

  const resetSession = () => {
    setCurrentSession(null);
    setIsRecording(false);
    setIsPaused(false);
    setSessionTime(0);
    setPresentationTitle('');
    setKeyPoints('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRandomTip = () => {
    return coachingTips[Math.floor(Math.random() * coachingTips.length)];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Data Presentation Coach</CardTitle>
              <CardDescription>
                Practice and perfect your data presentation skills with AI-powered feedback
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentSession ? (
            /* Setup Phase */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Presentation Setup */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Presentation Setup</CardTitle>
                    <CardDescription>Prepare your practice session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Presentation Title:</label>
                      <Input
                        placeholder="e.g., Q3 Impact Report, Fundraising Overview"
                        value={presentationTitle}
                        onChange={(e) => setPresentationTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Key Points (one per line):</label>
                      <Textarea
                        placeholder="• 40% increase in program participation
• $50,000 raised through new donor channel
• 95% satisfaction rate from participants"
                        value={keyPoints}
                        onChange={(e) => setKeyPoints(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={startPractice}
                  disabled={!presentationTitle.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Practice Session
                </Button>
              </div>

              {/* Presentation Types */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Presentation Types</CardTitle>
                    <CardDescription>Common data presentation scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {presentationTypes.map((type) => (
                      <div key={type.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{type.title}</h4>
                          <Badge variant="outline">{type.duration}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-700">Key Focus Areas:</div>
                          {type.keyFocus.map((focus, index) => (
                            <div key={index} className="text-xs text-gray-600">• {focus}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Practice Session */
            <div className="space-y-6">
              {!currentSession.metrics.overall ? (
                /* Recording Phase */
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-800">{currentSession.title}</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Timer className="w-5 h-5 text-green-600" />
                          <span className="font-mono text-lg text-green-700">
                            {formatTime(sessionTime)}
                          </span>
                        </div>
                        {isRecording && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-700">Recording</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Your Key Points:</h4>
                        <ul className="space-y-1">
                          {currentSession.keyPoints.map((point, index) => (
                            <li key={index} className="text-sm text-green-700">
                              • {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={() => setIsPaused(!isPaused)}
                          variant="outline"
                          disabled={!isRecording}
                        >
                          {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                          {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button
                          onClick={stopPractice}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Finish & Get Feedback
                        </Button>
                        <Button variant="outline" onClick={resetSession}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Results Phase */
                <div className="space-y-4">
                  {/* Session Results */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Practice Session Results</CardTitle>
                        <div className="text-sm text-gray-600">
                          Duration: {formatTime(currentSession.duration)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Metrics */}
                        <div>
                          <h4 className="font-medium mb-4">Performance Metrics</h4>
                          <div className="space-y-4">
                            {Object.entries(currentSession.metrics).filter(([key]) => key !== 'overall').map(([key, value]) => (
                              <div key={key} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  <span className={`font-bold ${getScoreColor(value)}`}>
                                    {value}%
                                  </span>
                                </div>
                                <Progress value={value} className="h-2" />
                              </div>
                            ))}
                            <div className="pt-2 border-t">
                              <div className="flex justify-between text-base">
                                <span className="font-medium">Overall Score</span>
                                <span className={`text-xl font-bold ${getScoreColor(currentSession.metrics.overall)}`}>
                                  {currentSession.metrics.overall}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div>
                          <h4 className="font-medium mb-4">AI Feedback</h4>
                          <div className="space-y-3">
                            {currentSession.feedback.map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                          
                          {currentSession.improvements.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Areas for Improvement:</h5>
                              <div className="space-y-2">
                                {currentSession.improvements.map((item, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 justify-center mt-6">
                        <Button
                          onClick={resetSession}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Practice Again
                        </Button>
                        <Button variant="outline" onClick={resetSession}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Presentation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Practice History */}
          {practiceHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice History</CardTitle>
                <CardDescription>Track your presentation improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {practiceHistory.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{formatTime(session.duration)}</Badge>
                          <span className={`text-lg font-bold ${getScoreColor(session.metrics.overall)}`}>
                            {session.metrics.overall}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                        <div className="text-center">
                          <div className={getScoreColor(session.metrics.clarity)}>
                            {session.metrics.clarity}%
                          </div>
                          <div className="text-xs text-gray-600">Clarity</div>
                        </div>
                        <div className="text-center">
                          <div className={getScoreColor(session.metrics.pace)}>
                            {session.metrics.pace}%
                          </div>
                          <div className="text-xs text-gray-600">Pace</div>
                        </div>
                        <div className="text-center">
                          <div className={getScoreColor(session.metrics.confidence)}>
                            {session.metrics.confidence}%
                          </div>
                          <div className="text-xs text-gray-600">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className={getScoreColor(session.metrics.engagement)}>
                            {session.metrics.engagement}%
                          </div>
                          <div className="text-xs text-gray-600">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className={getScoreColor(session.metrics.dataStory)}>
                            {session.metrics.dataStory}%
                          </div>
                          <div className="text-xs text-gray-600">Data Story</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {session.timestamp.toLocaleDateString()} • {session.keyPoints.length} key points
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coaching Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">David's Coaching Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coachingTips.slice(0, 4).map((tip, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                        {tip.category}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-blue-800">{tip.tip}</h4>
                    <p className="text-sm text-blue-700">
                      <strong>Try this:</strong> {tip.exercise}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidPresentationCoach;