import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Brain,
  TrendingUp,
  BarChart3,
  Users,
  Lightbulb,
  Star,
  Timer
} from 'lucide-react';

interface MicroLesson {
  id: string;
  title: string;
  category: 'visualization' | 'analysis' | 'storytelling' | 'presentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  description: string;
  objective: string;
  exercise: string;
  tips: string[];
  completed: boolean;
  score?: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  lessons: string[]; // lesson IDs
  progress: number;
  estimatedTime: number;
}

interface CoachingSession {
  id: string;
  type: 'quick-tip' | 'skill-practice' | 'problem-solving';
  topic: string;
  content: string;
  action: string;
  completed: boolean;
  timestamp: Date;
}

const DavidDataCoach: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<MicroLesson | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>([]);
  const [isInSession, setIsInSession] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);

  const microLessons: MicroLesson[] = [
    {
      id: 'viz-basics',
      title: 'Chart Type Selection',
      category: 'visualization',
      difficulty: 'beginner',
      duration: 3,
      description: 'Learn when to use different chart types for maximum impact',
      objective: 'Master the art of choosing the right visualization for your data',
      exercise: 'Given 5 different datasets, select the most appropriate chart type and explain why',
      tips: [
        'Bar charts excel at comparing categories',
        'Line charts show trends over time',
        'Pie charts work best for parts of a whole (under 6 categories)',
        'Scatter plots reveal relationships between variables'
      ],
      completed: false
    },
    {
      id: 'data-story',
      title: 'Data Storytelling Structure',
      category: 'storytelling',
      difficulty: 'intermediate',
      duration: 5,
      description: 'Build compelling narratives around your data insights',
      objective: 'Create data stories that engage and persuade audiences',
      exercise: 'Transform a simple data report into a compelling story with context, conflict, and resolution',
      tips: [
        'Start with context your audience cares about',
        'Present data as the plot twist or revelation',
        'Connect insights to actionable outcomes',
        'End with a clear call to action'
      ],
      completed: false
    },
    {
      id: 'quick-analysis',
      title: 'Rapid Data Analysis',
      category: 'analysis',
      difficulty: 'intermediate',
      duration: 4,
      description: 'Quickly identify patterns, outliers, and key insights',
      objective: 'Develop instincts for spotting important data patterns quickly',
      exercise: 'Analyze a new dataset in under 5 minutes and identify 3 key insights',
      tips: [
        'Look for extreme values first (highest, lowest)',
        'Check for unexpected patterns or breaks in trends',
        'Compare current data to benchmarks or previous periods',
        'Ask "what would surprise my audience?" about this data'
      ],
      completed: false
    },
    {
      id: 'presentation-confidence',
      title: 'Confident Data Presentation',
      category: 'presentation',
      difficulty: 'advanced',
      duration: 6,
      description: 'Present data with authority and handle challenging questions',
      objective: 'Build confidence in presenting complex data to any audience',
      exercise: 'Present your analysis to 3 different audience types (technical, executive, public)',
      tips: [
        'Know your data inside and out before presenting',
        'Prepare for common questions and objections',
        'Use confident language: "The data shows..." not "I think..."',
        'Practice explaining complex concepts in simple terms'
      ],
      completed: false
    },
    {
      id: 'data-cleaning',
      title: 'Quick Data Quality Check',
      category: 'analysis',
      difficulty: 'beginner',
      duration: 3,
      description: 'Rapidly assess and improve data quality before analysis',
      objective: 'Develop habits for ensuring data reliability',
      exercise: 'Review a messy dataset and identify 5 quality issues with solutions',
      tips: [
        'Check for missing values and decide how to handle them',
        'Look for duplicates or inconsistent entries',
        'Verify data ranges make sense (no negative ages, etc.)',
        'Ensure consistent formatting across similar fields'
      ],
      completed: false
    },
    {
      id: 'insight-extraction',
      title: 'From Data to Insights',
      category: 'analysis',
      difficulty: 'advanced',
      duration: 7,
      description: 'Transform raw numbers into actionable business insights',
      objective: 'Bridge the gap between data analysis and strategic recommendations',
      exercise: 'Take operational data and generate 3 strategic recommendations for leadership',
      tips: [
        'Always ask "So what?" about every data point',
        'Connect patterns to business outcomes',
        'Consider what actions the insights suggest',
        'Think about implications for different stakeholders'
      ],
      completed: false
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'beginner-analyst',
      name: 'Data Analysis Foundations',
      description: 'Essential skills for anyone working with data',
      lessons: ['data-cleaning', 'viz-basics', 'quick-analysis'],
      progress: 0,
      estimatedTime: 10
    },
    {
      id: 'storyteller',
      name: 'Data Storytelling Master',
      description: 'Transform data into compelling narratives',
      lessons: ['data-story', 'presentation-confidence', 'insight-extraction'],
      progress: 0,
      estimatedTime: 18
    },
    {
      id: 'quick-insights',
      name: 'Rapid Analysis Skills',
      description: 'Get insights fast for urgent decisions',
      lessons: ['quick-analysis', 'data-cleaning', 'insight-extraction'],
      progress: 0,
      estimatedTime: 14
    }
  ];

  const quickTips = [
    {
      category: 'visualization',
      tip: 'Use color strategically - highlight what matters most',
      detail: 'Don\'t use color just for decoration. Use it to draw attention to key data points or to group related information.'
    },
    {
      category: 'analysis',
      tip: 'Start with the end in mind - what decision needs to be made?',
      detail: 'Before diving into analysis, understand what question you\'re trying to answer or what decision your analysis will inform.'
    },
    {
      category: 'storytelling',
      tip: 'Lead with the punchline, then support with data',
      detail: 'In business contexts, state your key insight upfront, then use data to support and explain it.'
    },
    {
      category: 'presentation',
      tip: 'Practice the 30-second elevator version first',
      detail: 'If you can\'t explain your key insight in 30 seconds, you\'re not ready for a longer presentation.'
    }
  ];

  const startLesson = (lesson: MicroLesson) => {
    setCurrentLesson(lesson);
    setIsInSession(true);
    setSessionTimer(0);
    
    // Start timer
    const timer = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
    
    // Auto-complete after lesson duration (for demo)
    setTimeout(() => {
      clearInterval(timer);
      completeLesson(lesson);
    }, lesson.duration * 60 * 1000); // Convert to milliseconds
  };

  const completeLesson = (lesson: MicroLesson) => {
    const updatedLessons = microLessons.map(l => 
      l.id === lesson.id ? { ...l, completed: true, score: Math.floor(Math.random() * 30) + 70 } : l
    );
    
    setIsInSession(false);
    setSessionTimer(0);
    
    // Update learning path progress
    learningPaths.forEach(path => {
      const pathLessons = updatedLessons.filter(l => path.lessons.includes(l.id));
      const completedCount = pathLessons.filter(l => l.completed).length;
      path.progress = Math.round((completedCount / pathLessons.length) * 100);
    });
  };

  const askQuickQuestion = () => {
    if (!questionText.trim()) return;
    
    // Generate coaching response (mock AI)
    const responses = [
      {
        type: 'quick-tip' as const,
        content: 'For nonprofit program data, focus on outcomes over outputs. Donors care more about impact (lives changed) than activity (events held).',
        action: 'Try creating a simple before/after comparison showing participant progress'
      },
      {
        type: 'skill-practice' as const,
        content: 'Your chart selection is on track! Bar charts work great for comparing program effectiveness across different initiatives.',
        action: 'Practice: Create the same data story with 3 different chart types and see which is clearest'
      },
      {
        type: 'problem-solving' as const,
        content: 'When dealing with small sample sizes, acknowledge the limitation but focus on trends and qualitative feedback to strengthen your story.',
        action: 'Combine your quantitative data with 2-3 participant quotes or case studies'
      }
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const newSession: CoachingSession = {
      id: Date.now().toString(),
      type: response.type,
      topic: questionText,
      content: response.content,
      action: response.action,
      completed: false,
      timestamp: new Date()
    };
    
    setCoachingSessions(prev => [newSession, ...prev.slice(0, 4)]);
    setQuestionText('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visualization': return BarChart3;
      case 'analysis': return Brain;
      case 'storytelling': return Users;
      case 'presentation': return TrendingUp;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'quick-tip': return Lightbulb;
      case 'skill-practice': return Target;
      case 'problem-solving': return Brain;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Data Coach</CardTitle>
              <CardDescription>
                Micro-lessons and personalized coaching for rapid data skill development
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isInSession ? (
            /* Main Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Coaching */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Coaching Session</CardTitle>
                    <CardDescription>Get instant guidance on your data challenges</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What data challenge are you facing? e.g., 'How do I show program impact with limited data?' or 'What's the best way to present declining numbers?'"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={askQuickQuestion}
                      disabled={!questionText.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Get Coaching
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Coaching Sessions */}
                {coachingSessions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Coaching</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {coachingSessions.map((session) => {
                        const Icon = getSessionTypeIcon(session.type);
                        return (
                          <div key={session.id} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Icon className="w-5 h-5 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{session.topic}</h4>
                                <p className="text-sm text-gray-700 mb-2">{session.content}</p>
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                  <div className="text-xs font-medium text-blue-800 mb-1">Action Item:</div>
                                  <div className="text-xs text-blue-700">{session.action}</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                  {session.timestamp.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}

                {/* Daily Tip */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Today's Quick Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const tip = quickTips[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % quickTips.length];
                      return (
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">{tip.tip}</h4>
                          <p className="text-sm text-yellow-700">{tip.detail}</p>
                          <Badge className="mt-2 bg-yellow-100 text-yellow-800" variant="secondary">
                            {tip.category}
                          </Badge>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              {/* Learning Paths & Micro-Lessons */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Paths</CardTitle>
                    <CardDescription>Structured skill development tracks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {learningPaths.map((path) => (
                      <div key={path.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{path.name}</h4>
                          <Badge variant="outline">{path.estimatedTime} min</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => setSelectedPath(path.id)}
                        >
                          {path.progress === 0 ? 'Start Path' : 'Continue'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Micro-Lessons</CardTitle>
                    <CardDescription>3-7 minute skill boosters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {microLessons.slice(0, 3).map((lesson) => {
                      const Icon = getCategoryIcon(lesson.category);
                      return (
                        <div key={lesson.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-green-600" />
                            <div className="flex-1">
                              <h4 className="font-medium">{lesson.title}</h4>
                              <div className="flex gap-2 mt-1">
                                <Badge className={getDifficultyColor(lesson.difficulty)} variant="secondary">
                                  {lesson.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {lesson.duration} min
                                </Badge>
                              </div>
                            </div>
                            {lesson.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startLesson(lesson)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{lesson.description}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Active Lesson Interface */
            currentLesson && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-green-800">{currentLesson.title}</CardTitle>
                      <CardDescription className="text-green-600">
                        {currentLesson.category} • {currentLesson.difficulty} • {currentLesson.duration} minutes
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-green-600" />
                        <span className="font-mono text-lg text-green-700">
                          {formatTime(sessionTimer)}
                        </span>
                      </div>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Lesson Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Learning Objective</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{currentLesson.objective}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Exercise</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">{currentLesson.exercise}</p>
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Exercise
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Key Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentLesson.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsInSession(false);
                        setCurrentLesson(null);
                      }}
                    >
                      Pause Session
                    </Button>
                    <Button
                      onClick={() => completeLesson(currentLesson)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {/* Progress Overview */}
          {!isInSession && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Data Skills Journey</CardTitle>
                <CardDescription>Track your progress across different skill areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['visualization', 'analysis', 'storytelling', 'presentation'].map((category) => {
                    const categoryLessons = microLessons.filter(l => l.category === category);
                    const completed = categoryLessons.filter(l => l.completed).length;
                    const progress = Math.round((completed / categoryLessons.length) * 100);
                    const Icon = getCategoryIcon(category);
                    
                    return (
                      <div key={category} className="text-center">
                        <Icon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-medium capitalize mb-2">{category}</h4>
                        <div className="space-y-1">
                          <Progress value={progress} className="h-2" />
                          <div className="text-sm text-gray-600">
                            {completed}/{categoryLessons.length} lessons
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidDataCoach;