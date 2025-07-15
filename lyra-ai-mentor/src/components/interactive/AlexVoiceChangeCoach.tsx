import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Target,
  TrendingUp,
  Award,
  Clock,
  Users,
  MessageSquare,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

interface VoiceSession {
  id: string;
  title: string;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  objectives: string[];
  keyPhrases: string[];
  feedback: VoiceFeedback[];
  completedAt?: Date;
  score?: number;
}

interface VoiceFeedback {
  id: string;
  timestamp: number; // seconds into recording
  type: 'tone' | 'pace' | 'clarity' | 'confidence' | 'empathy';
  issue: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

interface VoiceMetrics {
  tonalConsistency: number; // 0-100
  speakingPace: number; // words per minute
  clarityScore: number; // 0-100
  confidenceLevel: number; // 0-100
  empathyIndicators: number; // 0-100
  overallScore: number; // 0-100
}

interface ChangeScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  stakeholders: string[];
  challenges: string[];
  successCriteria: string[];
  practicePrompts: string[];
}

const AlexVoiceChangeCoach: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<ChangeScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const changeScenarios: ChangeScenario[] = [
    {
      id: 'budget-cuts',
      title: 'Announcing Budget Cuts',
      description: 'Communicate necessary budget reductions while maintaining team morale',
      context: 'Your nonprofit faces a 20% funding reduction and must cut programs',
      stakeholders: ['Staff members', 'Program participants', 'Board members', 'Funders'],
      challenges: [
        'Delivering difficult news compassionately',
        'Maintaining team motivation during uncertainty',
        'Explaining rationale without blame',
        'Focusing on future possibilities'
      ],
      successCriteria: [
        'Clear communication of changes and timeline',
        'Acknowledgment of impact on people',
        'Transparent explanation of decision process',
        'Commitment to support affected individuals'
      ],
      practicePrompts: [
        'Explain the situation to your direct reports',
        'Address concerns from a long-term volunteer',
        'Communicate with program participants',
        'Present to the board about implementation'
      ]
    },
    {
      id: 'digital-transformation',
      title: 'Digital System Migration',
      description: 'Lead organization through technology platform change',
      context: 'Implementing new CRM and database system affecting all staff workflows',
      stakeholders: ['All staff', 'Volunteers', 'Data managers', 'IT support'],
      challenges: [
        'Overcoming technology resistance',
        'Managing learning curve anxiety',
        'Ensuring data security concerns are addressed',
        'Coordinating training schedules'
      ],
      successCriteria: [
        'Clear vision of benefits and outcomes',
        'Comprehensive training and support plan',
        'Phased implementation with milestones',
        'Open feedback channels for concerns'
      ],
      practicePrompts: [
        'Introduce the change at an all-staff meeting',
        'Respond to a skeptical veteran employee',
        'Address data security concerns',
        'Motivate participation in training sessions'
      ]
    },
    {
      id: 'program-expansion',
      title: 'New Program Launch',
      description: 'Build excitement and buy-in for expanding services',
      context: 'Launching youth mentorship program requiring significant staff involvement',
      stakeholders: ['Current staff', 'Potential mentors', 'Community partners', 'Participants'],
      challenges: [
        'Creating enthusiasm for additional work',
        'Addressing resource allocation concerns',
        'Building confidence in new approach',
        'Coordinating multiple stakeholder groups'
      ],
      successCriteria: [
        'Compelling vision of impact and opportunity',
        'Clear role definitions and expectations',
        'Adequate support and resources',
        'Recognition of current achievements'
      ],
      practicePrompts: [
        'Pitch the program to current staff',
        'Recruit community mentors',
        'Explain benefits to potential participants',
        'Secure partner organization commitment'
      ]
    }
  ];

  const sampleSessions: VoiceSession[] = [
    {
      id: 'session-1',
      title: 'Budget Communication Practice',
      scenario: 'budget-cuts',
      difficulty: 'intermediate',
      duration: 15,
      objectives: [
        'Deliver difficult news with empathy',
        'Maintain professional tone throughout',
        'Provide clear next steps',
        'Invite questions and concerns'
      ],
      keyPhrases: [
        '"I understand this is difficult news"',
        '"We\'re committed to supporting you through this transition"',
        '"Let me explain the reasoning behind this decision"',
        '"Your questions and concerns are important to me"'
      ],
      feedback: [
        {
          id: 'feedback-1',
          timestamp: 45,
          type: 'tone',
          issue: 'Tone became defensive when explaining rationale',
          suggestion: 'Maintain calm, empathetic tone even when providing justification',
          severity: 'medium'
        },
        {
          id: 'feedback-2',
          timestamp: 120,
          type: 'pace',
          issue: 'Speaking too quickly during important details',
          suggestion: 'Slow down when delivering key information, allow for processing',
          severity: 'high'
        }
      ],
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      score: 78
    }
  ];

  const sampleMetrics: VoiceMetrics = {
    tonalConsistency: 82,
    speakingPace: 145, // WPM
    clarityScore: 88,
    confidenceLevel: 75,
    empathyIndicators: 90,
    overallScore: 81
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const analyzeRecording = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newFeedback: VoiceFeedback[] = [
      {
        id: `feedback-${Date.now()}`,
        timestamp: Math.floor(Math.random() * recordingTime),
        type: 'confidence',
        issue: 'Voice pitch dropped during key message delivery',
        suggestion: 'Maintain confident vocal projection throughout important statements',
        severity: 'medium'
      },
      {
        id: `feedback-${Date.now() + 1}`,
        timestamp: Math.floor(Math.random() * recordingTime),
        type: 'empathy',
        issue: 'Could benefit from more emotional acknowledgment',
        suggestion: 'Include phrases that validate stakeholder feelings and concerns',
        severity: 'low'
      }
    ];

    console.log('Voice analysis completed:', newFeedback);
    setIsAnalyzing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFeedbackColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Voice Change Coach</CardTitle>
              <CardDescription>
                Practice communicating change with AI-powered voice coaching and feedback
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentSession ? (
            /* Scenario Selection */
            <div className="space-y-6">
              {/* Voice Metrics Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Voice Leadership Metrics</CardTitle>
                  <CardDescription>Overall communication effectiveness scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getScoreColor(sampleMetrics.overallScore)}`}>
                        {sampleMetrics.overallScore}
                      </div>
                      <div className="text-sm text-purple-600">Overall Score</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{sampleMetrics.speakingPace}</div>
                      <div className="text-sm text-blue-600">Words/Minute</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{sampleMetrics.empathyIndicators}</div>
                      <div className="text-sm text-green-600">Empathy Score</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence Level</span>
                        <span>{sampleMetrics.confidenceLevel}%</span>
                      </div>
                      <Progress value={sampleMetrics.confidenceLevel} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clarity Score</span>
                        <span>{sampleMetrics.clarityScore}%</span>
                      </div>
                      <Progress value={sampleMetrics.clarityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tonal Consistency</span>
                        <span>{sampleMetrics.tonalConsistency}%</span>
                      </div>
                      <Progress value={sampleMetrics.tonalConsistency} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Change Scenarios */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Practice Scenarios</CardTitle>
                  <CardDescription>Choose a change communication scenario to practice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {changeScenarios.map((scenario) => (
                    <div key={scenario.id} 
                         className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => setSelectedScenario(scenario)}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{scenario.title}</h4>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSession({
                              id: `session-${Date.now()}`,
                              title: `${scenario.title} Practice`,
                              scenario: scenario.id,
                              difficulty: 'intermediate',
                              duration: 15,
                              objectives: scenario.successCriteria,
                              keyPhrases: [],
                              feedback: []
                            });
                          }}
                        >
                          Start Practice
                        </Button>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{scenario.description}</p>
                      
                      <div className="bg-blue-50 p-3 rounded mb-3">
                        <div className="text-sm font-medium text-blue-800 mb-1">Context:</div>
                        <div className="text-sm text-blue-700">{scenario.context}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium mb-2">Key Challenges:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {scenario.challenges.slice(0, 3).map((challenge, index) => (
                              <li key={index}>• {challenge}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-2">Stakeholders:</div>
                          <div className="flex flex-wrap gap-1">
                            {scenario.stakeholders.map((stakeholder, index) => (
                              <Badge key={index} variant="outline">{stakeholder}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Practice Sessions</CardTitle>
                  <CardDescription>Review your past coaching sessions and progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sampleSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{session.title}</h4>
                        <div className="flex items-center gap-2">
                          {session.score && (
                            <Badge className={getScoreColor(session.score) + ' bg-transparent'} variant="outline">
                              {session.score}% Score
                            </Badge>
                          )}
                          <Badge className={getDifficultyColor(session.difficulty)} variant="secondary">
                            {session.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span> {session.duration} minutes
                        </div>
                        <div>
                          <span className="font-medium">Completed:</span> {session.completedAt?.toLocaleDateString()}
                        </div>
                      </div>
                      
                      {session.feedback.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Key Feedback:</div>
                          <div className="space-y-1">
                            {session.feedback.slice(0, 2).map((feedback) => (
                              <div key={feedback.id} className="text-xs bg-gray-50 p-2 rounded">
                                <Badge className={getFeedbackColor(feedback.severity)} variant="secondary">
                                  {feedback.type}
                                </Badge>
                                <span className="ml-2">{feedback.suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Active Session */
            <div className="space-y-6">
              {/* Session Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentSession.title}</CardTitle>
                      <CardDescription>
                        {currentSession.difficulty} level • {currentSession.duration} minutes
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentSession(null)}>
                      End Session
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Recording Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Voice Practice</CardTitle>
                  <CardDescription>Record your change communication and receive AI feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recording Controls */}
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                      {isRecording ? (
                        <div className="w-6 h-6 bg-red-500 rounded animate-pulse"></div>
                      ) : (
                        <Mic className="w-8 h-8 text-purple-600" />
                      )}
                    </div>
                    
                    <div className="text-2xl font-mono font-bold">
                      {formatTime(recordingTime)}
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      {!isRecording ? (
                        <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button onClick={stopRecording} variant="outline">
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                      
                      {recordingTime > 0 && !isRecording && (
                        <Button onClick={analyzeRecording} disabled={isAnalyzing}>
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-2" />
                              Get Feedback
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Practice Objectives */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Session Objectives:</h4>
                    <ul className="space-y-2">
                      {currentSession.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2 text-blue-700">
                          <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Practice Prompts */}
                  {selectedScenario && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">Practice Prompts:</h4>
                      <div className="space-y-2">
                        {selectedScenario.practicePrompts.map((prompt, index) => (
                          <div key={index} className="flex items-start gap-2 text-green-700">
                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{prompt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Feedback Section */}
              {currentSession.feedback.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Coaching Feedback</CardTitle>
                    <CardDescription>Personalized suggestions to improve your change communication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentSession.feedback.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getFeedbackColor(feedback.severity)} variant="secondary">
                            {feedback.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            @ {formatTime(feedback.timestamp)}
                          </span>
                        </div>
                        <div className="mb-2">
                          <div className="font-medium text-sm text-gray-800">Issue:</div>
                          <div className="text-sm text-gray-600">{feedback.issue}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="font-medium text-sm text-blue-800">Suggestion:</div>
                          <div className="text-sm text-blue-700">{feedback.suggestion}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tips and Coaching */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Voice Coaching Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Voice Leadership:</h4>
                  <ul className="space-y-1">
                    <li>• Maintain consistent tone throughout difficult conversations</li>
                    <li>• Use pauses strategically to emphasize key points</li>
                    <li>• Match your energy to the emotional needs of the moment</li>
                    <li>• Practice active listening cues in your vocal responses</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Change Communication:</h4>
                  <ul className="space-y-1">
                    <li>• Lead with empathy before explaining rationale</li>
                    <li>• Use inclusive language that builds connection</li>
                    <li>• Acknowledge concerns before addressing solutions</li>
                    <li>• End with clear next steps and support commitments</li>
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

export default AlexVoiceChangeCoach;