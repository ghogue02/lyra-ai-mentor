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
  Volume2, 
  RefreshCw, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Target,
  Headphones,
  VolumeX,
  Settings
} from 'lucide-react';

interface VoiceExercise {
  id: string;
  title: string;
  description: string;
  category: 'clarity' | 'confidence' | 'pacing' | 'workflow_explanation';
  duration: number; // seconds
  script: string;
  tips: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface VoiceSession {
  id: string;
  exerciseId: string;
  date: Date;
  duration: number;
  scores: {
    clarity: number;
    confidence: number;
    pacing: number;
    workflow_explanation: number;
  };
  feedback: string[];
  improvements: string[];
}

interface VoiceSettings {
  targetWPM: number; // words per minute
  pauseLength: number; // seconds
  volumeLevel: number; // 0-100
  enableRealTimeAnalysis: boolean;
}

const RachelVoiceWorkflowCoach: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<VoiceExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<VoiceSession[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    targetWPM: 150,
    pauseLength: 1.5,
    volumeLevel: 75,
    enableRealTimeAnalysis: true
  });

  const voiceExercises: VoiceExercise[] = [
    {
      id: 'process-explanation',
      title: 'Process Explanation Practice',
      description: 'Practice explaining complex nonprofit workflows clearly and confidently',
      category: 'workflow_explanation',
      duration: 180, // 3 minutes
      difficulty: 'intermediate',
      script: `Let me walk you through our volunteer onboarding process, which we've optimized to be both thorough and efficient.

First, when someone submits a volunteer application through our website, our system automatically sends them a confirmation email within minutes. This includes a welcome packet with our mission, values, and what to expect next.

Within 24 hours, our volunteer coordinator reviews the application. We check for completeness, assess the volunteer's interests against our current needs, and determine if any special skills or background checks are required.

For roles working directly with our participants, we initiate a background check process. This typically takes 3-5 business days, and we keep the volunteer informed at each step.

Once approved, we schedule an orientation session. These happen every other Tuesday and cover our programs, policies, and safety procedures. The volunteer also meets their program supervisor and gets a tour of our facilities.

Finally, new volunteers complete a brief training specific to their role. This might be child safety protocols, food handling basics, or administrative system training, depending on where they'll be helping.

The entire process takes about two weeks from application to active volunteer status. We've found this timeline balances thoroughness with the volunteer's enthusiasm to get started.`,
      tips: [
        'Speak at a measured pace - about 150 words per minute',
        'Pause after each major step to let information sink in',
        'Use transition phrases like "First," "Next," and "Finally"',
        'Vary your tone to emphasize important points',
        'End with a summary of the timeline or next steps'
      ]
    },
    {
      id: 'stakeholder-update',
      title: 'Board Presentation Practice',
      description: 'Practice delivering workflow improvements to board members',
      category: 'confidence',
      duration: 240, // 4 minutes
      difficulty: 'advanced',
      script: `Good evening, board members. I'm excited to share the results of our recent workflow optimization initiative and how it's already improving our operational efficiency.

Over the past quarter, we analyzed our three most time-intensive processes: volunteer onboarding, donor communications, and program reporting. Through careful mapping and stakeholder interviews, we identified significant opportunities for improvement.

For volunteer onboarding, we reduced the average time from application to active volunteer from 3 weeks to 2 weeks. This 33% improvement came from automating background check requests and creating standardized orientation schedules.

Our donor communication workflow now includes automated thank-you emails for donations over $25, which has improved our response time from 3-5 days to immediate. Donor satisfaction scores for prompt acknowledgment increased by 40%.

Program reporting, which previously took our staff 6 hours weekly, now takes just 2 hours thanks to automated data collection and standardized templates. This frees up 4 hours weekly that staff can dedicate directly to program delivery.

These improvements represent $15,000 annually in staff time savings and have measurably improved our stakeholder satisfaction scores. The initial investment in process mapping and system setup was $3,000, giving us a 5-to-1 return on investment in the first year alone.

Moving forward, we're applying these same optimization principles to our fundraising event planning and financial reporting processes. I'm happy to answer any questions about our methodology or results.`,
      tips: [
        'Start with an attention-grabbing opening',
        'Use specific numbers and percentages to show impact',
        'Speak with authority - you are the expert',
        'Make eye contact (imagine board members)',
        'End with a clear call to action or next steps'
      ]
    },
    {
      id: 'training-delivery',
      title: 'Staff Training Session',
      description: 'Practice training staff on new workflow processes',
      category: 'clarity',
      duration: 150, // 2.5 minutes
      difficulty: 'intermediate',
      script: `Hi everyone, thanks for joining today's training on our new donor communication workflow. I know change can feel overwhelming, but I promise this new system will make your daily work much easier.

Let's start with why we made these changes. Our old process had donors waiting 3-5 days for thank-you letters, and staff spending 2 hours daily on manual data entry. The new automated system eliminates both problems.

Here's how it works now: When a donation comes in through our website, the system immediately sends a personalized thank-you email. The donor gets instant gratification, and you get their information automatically added to our CRM system.

For donations over $100, the system also creates a task for you to send a personal follow-up call within 48 hours. You'll find these tasks in your daily dashboard, along with talking points and the donor's giving history.

Let me show you the new dashboard. See how clean and organized it is? Your tasks are prioritized by deadline, and you can mark them complete with one click.

The best part? This system learns from your interactions. If a donor prefers phone calls over emails, the system remembers and adjusts future communications accordingly.

We'll practice with some sample scenarios now, and I'll be available all week for questions as you get comfortable with the new workflow.`,
      tips: [
        'Use "you" language to make it personal',
        'Acknowledge concerns upfront',
        'Break complex processes into simple steps',
        'Use encouraging, supportive tone',
        'Include interactive elements and questions'
      ]
    },
    {
      id: 'quick-update',
      title: 'Quick Process Update',
      description: 'Practice delivering brief workflow status updates',
      category: 'pacing',
      duration: 60, // 1 minute
      difficulty: 'beginner',
      script: `Quick update on our workflow optimization project: We're ahead of schedule and seeing great results.

This week we completed the volunteer onboarding automation. Background checks now process 50% faster, and volunteers are getting orientation invites automatically.

The donor communication system goes live Monday. Staff training is complete, and everyone feels confident with the new process.

Next week we tackle program reporting automation. If all goes well, we'll have this phase done by month-end.

Questions? Concerns? I'm here to help. Thanks for your support on this initiative.`,
      tips: [
        'Get straight to the point',
        'Use short, punchy sentences',
        'Include specific timeline updates',
        'End with an invitation for questions',
        'Keep energy high and positive'
      ]
    },
    {
      id: 'problem-solving',
      title: 'Addressing Workflow Challenges',
      description: 'Practice explaining solutions to workflow problems',
      category: 'confidence',
      duration: 200, // 3.3 minutes
      difficulty: 'advanced',
      script: `I want to address the concerns some of you have raised about our new automated systems and share how we're solving these challenges.

First, the question about what happens when the automation fails. We've built in multiple safeguards. If an email doesn't send within 30 minutes, the system alerts me and creates a manual task for immediate follow-up. We also have daily backup reports that catch anything the automation might miss.

Second, regarding the personal touch in donor communications. I understand this concern. The automated emails are just the first step. They ensure immediate acknowledgment, which donors appreciate. But they also trigger personal follow-up tasks for our development team for significant donations.

Third, about staff feeling replaced by technology. Let me be clear: automation handles the routine tasks so you can focus on relationship building and strategic work. Instead of spending hours on data entry, you now have time for donor visits, program development, and creative problem-solving.

We're also seeing tangible benefits. Donor retention increased 15% since we started immediate thank-you emails. Staff satisfaction scores improved because people feel their time is better used.

That said, this is an evolving process. If you encounter situations where automation doesn't work well, please let me know immediately. We can adjust the rules or add manual override options.

Remember, technology serves our mission, not the other way around. These tools help us serve more people more effectively, which is why we're all here.`,
      tips: [
        'Acknowledge concerns directly and respectfully',
        'Provide specific examples and data',
        'Show empathy while maintaining confidence',
        'Address fears about job security honestly',
        'End with a reminder of shared mission'
      ]
    }
  ];

  const startExercise = (exercise: VoiceExercise) => {
    setCurrentExercise(exercise);
    setIsRecording(false);
    setIsPaused(false);
    setSessionTime(0);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);
      // Start timer
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      
      // Auto-stop after exercise duration + 30 seconds
      setTimeout(() => {
        clearInterval(timer);
        stopRecording();
      }, (currentExercise?.duration || 60) * 1000 + 30000);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (!currentExercise) return;
    
    setIsRecording(false);
    setIsPaused(false);
    
    // Generate AI feedback (mock)
    const scores = {
      clarity: Math.floor(Math.random() * 20) + 75, // 75-95
      confidence: Math.floor(Math.random() * 25) + 70, // 70-95
      pacing: Math.floor(Math.random() * 30) + 65, // 65-95
      workflow_explanation: Math.floor(Math.random() * 20) + 80 // 80-100
    };
    
    const feedback = [];
    const improvements = [];
    
    if (scores.clarity >= 85) {
      feedback.push('Excellent clarity - your explanations were easy to follow');
    } else {
      improvements.push('Practice speaking more slowly and enunciating clearly');
    }
    
    if (scores.confidence >= 80) {
      feedback.push('Strong, confident delivery that builds trust');
    } else {
      improvements.push('Work on reducing filler words and speaking with more authority');
    }
    
    if (scores.pacing >= 75) {
      feedback.push('Good pacing with appropriate pauses');
    } else {
      improvements.push('Try slowing down and adding more strategic pauses');
    }
    
    if (scores.workflow_explanation >= 85) {
      feedback.push('Excellent at breaking down complex processes into clear steps');
    } else {
      improvements.push('Use more transition words and logical sequencing');
    }
    
    const newSession: VoiceSession = {
      id: Date.now().toString(),
      exerciseId: currentExercise.id,
      date: new Date(),
      duration: sessionTime,
      scores,
      feedback,
      improvements
    };
    
    setPracticeHistory(prev => [newSession, ...prev.slice(0, 9)]);
    setSessionTime(0);
  };

  const getAverageScore = () => {
    if (practiceHistory.length === 0) return 0;
    const totalScores = practiceHistory.reduce((sum, session) => {
      return sum + Object.values(session.scores).reduce((s, score) => s + score, 0) / 4;
    }, 0);
    return Math.round(totalScores / practiceHistory.length);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clarity': return Volume2;
      case 'confidence': return TrendingUp;
      case 'pacing': return Clock;
      case 'workflow_explanation': return Users;
      default: return Mic;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Headphones className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Voice Workflow Coach</CardTitle>
              <CardDescription>
                Practice explaining workflows and processes with confidence and clarity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentExercise ? (
            /* Exercise Selection */
            <div className="space-y-6">
              {/* Practice Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{practiceHistory.length}</div>
                    <div className="text-sm text-gray-600">Practice Sessions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{getAverageScore()}%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(practiceHistory.reduce((sum, session) => sum + session.duration, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Total Practice Time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(practiceHistory.length / Math.max(1, Math.ceil((Date.now() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))))}
                    </div>
                    <div className="text-sm text-gray-600">Sessions per Week</div>
                  </CardContent>
                </Card>
              </div>

              {/* Voice Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Voice Settings</CardTitle>
                  <CardDescription>Customize your practice environment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Target Speaking Pace:</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="120"
                          max="180"
                          value={voiceSettings.targetWPM}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, targetWPM: parseInt(e.target.value) }))}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">{voiceSettings.targetWPM} WPM</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pause Length:</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          value={voiceSettings.pauseLength}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, pauseLength: parseFloat(e.target.value) }))}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">{voiceSettings.pauseLength}s</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exercise Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Practice Exercises</CardTitle>
                  <CardDescription>Choose a scenario to practice your workflow communication skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {voiceExercises.map((exercise) => {
                    const Icon = getCategoryIcon(exercise.category);
                    
                    return (
                      <div key={exercise.id} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                           onClick={() => startExercise(exercise)}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{exercise.title}</h4>
                            <p className="text-sm text-gray-600">{exercise.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getDifficultyColor(exercise.difficulty)} variant="secondary">
                              {exercise.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {formatTime(exercise.duration)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 capitalize">
                            Focus: {exercise.category.replace('_', ' ')}
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-1" />
                            Start Practice
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              {practiceHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Practice Sessions</CardTitle>
                    <CardDescription>Your latest voice coaching sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {practiceHistory.slice(0, 5).map((session) => {
                        const exercise = voiceExercises.find(ex => ex.id === session.exerciseId);
                        
                        return (
                          <div key={session.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{exercise?.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {session.date.toLocaleDateString()} • {formatTime(session.duration)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-lg font-bold ${getScoreColor(
                                  Object.values(session.scores).reduce((sum, score) => sum + score, 0) / 4
                                )}`}>
                                  {Math.round(Object.values(session.scores).reduce((sum, score) => sum + score, 0) / 4)}%
                                </div>
                                <div className="text-xs text-gray-600">Overall Score</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                              {Object.entries(session.scores).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className={`font-bold ${getScoreColor(value)}`}>{value}%</div>
                                  <div className="text-xs text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                                </div>
                              ))}
                            </div>
                            
                            {session.feedback.length > 0 && (
                              <div className="text-sm">
                                <h5 className="font-medium text-green-700 mb-1">Strengths:</h5>
                                <ul className="space-y-1">
                                  {session.feedback.slice(0, 2).map((item, index) => (
                                    <li key={index} className="flex items-start gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Practice Session */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{currentExercise.title}</CardTitle>
                      <CardDescription>{currentExercise.description}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentExercise(null)}>
                      Back to Exercises
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-4xl font-mono">
                      {formatTime(sessionTime)}
                    </div>
                    {isRecording && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <Button
                      onClick={toggleRecording}
                      className={isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                      size="lg"
                    >
                      {isRecording ? (
                        isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />
                      ) : (
                        <Mic className="w-5 h-5 mr-2" />
                      )}
                      {isRecording ? (isPaused ? 'Resume' : 'Pause') : 'Start Recording'}
                    </Button>
                    
                    {isRecording && (
                      <Button onClick={stopRecording} variant="outline">
                        Stop & Analyze
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Script & Tips */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Practice Script</CardTitle>
                    <CardDescription>Read this aloud at a natural pace</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        {currentExercise.script.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Coaching Tips</CardTitle>
                    <CardDescription>Keep these in mind while practicing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentExercise.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Target Metrics:</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div>• Speaking pace: {voiceSettings.targetWPM} words per minute</div>
                        <div>• Pause length: {voiceSettings.pauseLength} seconds</div>
                        <div>• Duration: {formatTime(currentExercise.duration)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Voice Coaching Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Voice Coaching Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Workflow Communication:</h4>
                  <ul className="space-y-1">
                    <li>• Use simple, jargon-free language</li>
                    <li>• Break complex processes into clear steps</li>
                    <li>• Include the "why" behind each process</li>
                    <li>• Use transition words to guide listeners</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Voice Technique:</h4>
                  <ul className="space-y-1">
                    <li>• Practice diaphragmatic breathing</li>
                    <li>• Vary your pace to maintain interest</li>
                    <li>• Use pauses strategically for emphasis</li>
                    <li>• Record yourself to identify areas for improvement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RachelVoiceWorkflowCoach;