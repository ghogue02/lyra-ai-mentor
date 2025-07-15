import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Mic, Play, Pause, RotateCcw, Users, MessageCircle, Target, TrendingUp, MicOff } from 'lucide-react';
import { useWebSpeechRecognition } from '@/hooks/useWebSpeechRecognition';
import { VoiceVisualizer, SimpleVoiceIndicator } from '@/components/lesson/chat/VoiceVisualizer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CoachingSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  scenario: string;
  coaching_prompts: string[];
}

const MayaCommunicationCoach: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<CoachingSession | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Initialize Web Speech Recognition
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    hasPermission,
    startListening,
    stopListening,
    clearTranscript,
    requestPermission,
    getAudioContext,
    getStream,
  } = useWebSpeechRecognition({
    continuous: true,
    interimResults: true,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setUserResponse(prev => prev + ' ' + text);
        setCurrentTranscript('');
      } else {
        setCurrentTranscript(text);
      }
    },
  });

  // Combine final and interim transcripts for display
  const displayTranscript = userResponse + (currentTranscript ? ' ' + currentTranscript : '');

  const coachingSessions: CoachingSession[] = [
    {
      id: '1',
      title: 'Confident Email Communication',
      description: 'Build confidence in professional email exchanges',
      duration: '15 min',
      difficulty: 'beginner',
      skills: ['Clarity', 'Confidence', 'Professional tone'],
      scenario: 'You need to email your manager about a project delay and propose solutions.',
      coaching_prompts: [
        'Take a deep breath and speak clearly. How would you greet your manager in this email?',
        'Now explain the situation honestly. What caused the delay?',
        'Present your solutions with confidence. What are your proposed next steps?',
        'Close professionally while maintaining accountability. How will you wrap up?'
      ]
    },
    {
      id: '2',
      title: 'Difficult Conversation Navigation',
      description: 'Practice handling challenging workplace discussions',
      duration: '20 min',
      difficulty: 'intermediate',
      skills: ['Empathy', 'Conflict resolution', 'Active listening'],
      scenario: 'A team member consistently misses deadlines, affecting the entire project.',
      coaching_prompts: [
        'Start with empathy. How would you acknowledge their perspective?',
        'Address the issue directly but constructively. What specific behaviors need to change?',
        'Offer support while setting clear expectations. What resources can you provide?',
        'Establish follow-up and accountability. How will you monitor progress together?'
      ]
    },
    {
      id: '3',
      title: 'Persuasive Presentation Skills',
      description: 'Develop compelling presentation delivery techniques',
      duration: '25 min',
      difficulty: 'advanced',
      skills: ['Persuasion', 'Storytelling', 'Audience engagement'],
      scenario: 'You\'re presenting a new initiative to stakeholders who are skeptical about change.',
      coaching_prompts: [
        'Hook your audience with a compelling opening. What story or statistic will grab attention?',
        'Present the problem clearly. Help them feel the pain point you\'re addressing.',
        'Introduce your solution with enthusiasm. Why is this the right approach?',
        'Address objections proactively. What concerns might they have and how do you respond?',
        'Close with a strong call to action. What specific next steps do you want them to take?'
      ]
    }
  ];

  const startSession = (session: CoachingSession) => {
    // Reset all state to ensure clean session start
    setSelectedSession(session);
    setCurrentPrompt(0);
    setFeedback([]);
    setSessionProgress(0);
    setUserResponse('');
    setCurrentTranscript('');
    clearTranscript();
    setShowPermissionPrompt(false);
  };

  const nextPrompt = () => {
    if (!selectedSession) {
      console.warn('No session selected');
      return;
    }
    
    // Validate user has responded before allowing progression
    if (!userResponse.trim()) {
      toast.error('Please provide a response before continuing');
      return;
    }
    
    if (currentPrompt < selectedSession.coaching_prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setSessionProgress(((currentPrompt + 1) / selectedSession.coaching_prompts.length) * 100);
      
      // Add mock feedback
      const mockFeedback = [
        'Great job maintaining a professional tone!',
        'Your clarity improved with that response.',
        'Consider adding more specific examples.',
        'Excellent use of the CARE framework principles.'
      ];
      setFeedback([...feedback, mockFeedback[Math.floor(Math.random() * mockFeedback.length)]]);
      
      // Clear response for next prompt
      setUserResponse('');
      setCurrentTranscript('');
      clearTranscript();
    }
  };

  const handleStartListening = async () => {
    if (!isSupported) {
      setShowPermissionPrompt(true);
      return;
    }

    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setShowPermissionPrompt(true);
        return;
      }
    }

    // Clear previous response when starting new recording
    setUserResponse('');
    setCurrentTranscript('');
    clearTranscript();
    await startListening();
  };

  const handleStopListening = () => {
    stopListening();
    // Final transcript is already in userResponse
  };

  const completeSession = () => {
    if (!selectedSession) {
      console.warn('No session selected');
      return;
    }
    
    // Validate user has completed all prompts
    if (currentPrompt < selectedSession.coaching_prompts.length - 1) {
      toast.error('Please complete all coaching prompts first');
      return;
    }
    
    // Validate current response
    if (!userResponse.trim()) {
      toast.error('Please provide a response to the final prompt');
      return;
    }
    
    setSessionProgress(100);
    setFeedback([...feedback, 'Session completed! You\'ve made excellent progress in your communication skills.']);
  };

  const resetSession = () => {
    // Confirm before resetting if session is in progress
    if (sessionProgress > 0 && sessionProgress < 100) {
      if (!window.confirm('Are you sure you want to reset? Your progress will be lost.')) {
        return;
      }
    }
    
    setSelectedSession(null);
    setCurrentPrompt(0);
    setFeedback([]);
    setSessionProgress(0);
    setUserResponse('');
    setCurrentTranscript('');
    clearTranscript();
    setShowPermissionPrompt(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Maya's Communication Coach</CardTitle>
              <CardDescription>
                AI-powered voice coaching for professional communication skills
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedSession ? (
            // Session Selection
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Coaching Session</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {coachingSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    onClick={() => startSession(session)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <Badge className={getDifficultyColor(session.difficulty)}>
                          {session.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{session.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        {session.duration}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Skills Developed:</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {session.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200">
                          Start Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Active Coaching Session
            <div className="space-y-6">
              {/* Session Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedSession.title}</h3>
                  <p className="text-gray-600">{selectedSession.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(selectedSession.difficulty)}>
                    {selectedSession.difficulty}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={resetSession}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(sessionProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sessionProgress}%` }}
                  />
                </div>
              </div>

              {/* Scenario */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Scenario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">{selectedSession.scenario}</p>
                </CardContent>
              </Card>

              {/* Current Coaching Prompt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-purple-600" />
                    Coaching Prompt {currentPrompt + 1} of {selectedSession.coaching_prompts.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800 font-medium">
                      {selectedSession.coaching_prompts[currentPrompt]}
                    </p>
                  </div>

                  {/* Voice Input */}
                  <div className="space-y-4">
                    {/* Voice Visualizer */}
                    {isListening && (
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-xs sm:max-w-md h-12 sm:h-16 bg-gray-50 rounded-lg p-1 sm:p-2">
                          {getAudioContext() && getStream() ? (
                            <VoiceVisualizer
                              isActive={isListening}
                              audioContext={getAudioContext()!}
                              stream={getStream()!}
                              className="w-full h-full"
                            />
                          ) : (
                            <SimpleVoiceIndicator isActive={isListening} className="h-full" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Voice Button */}
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={isListening ? handleStopListening : handleStartListening}
                        className={cn(
                          "px-4 sm:px-8 py-3 sm:py-4 transition-all duration-200",
                          isListening 
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        )}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-5 h-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            Respond with Voice
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Browser Support Notice */}
                    {!isSupported && (
                      <div className="text-center text-sm text-amber-600">
                        <p>Voice recognition is not supported in your browser.</p>
                        <p>Please use Chrome, Edge, or Safari for voice features.</p>
                      </div>
                    )}

                    {/* Permission Prompt */}
                    {showPermissionPrompt && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800 mb-2">
                          Microphone access is required for voice coaching.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const granted = await requestPermission();
                            if (granted) {
                              setShowPermissionPrompt(false);
                            }
                          }}
                          className="text-amber-700 border-amber-300 hover:bg-amber-100"
                        >
                          Grant Microphone Access
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Real-time Transcription Display */}
                  {(userResponse || currentTranscript || isListening) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Your Response:</label>
                        {isListening && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs text-red-600">Recording...</span>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <p className="mt-1 text-gray-800 min-h-[2rem] sm:min-h-[3rem] text-sm sm:text-base">
                          {displayTranscript || (
                            <span className="text-gray-400 italic">
                              {isListening ? 'Start speaking...' : 'Your response will appear here'}
                            </span>
                          )}
                        </p>
                        {currentTranscript && (
                          <span className="absolute bottom-0 right-0 text-xs text-gray-500">
                            (listening...)
                          </span>
                        )}
                      </div>
                      {userResponse && !isListening && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setUserResponse('');
                            setCurrentTranscript('');
                            clearTranscript();
                          }}
                          className="mt-2 text-xs"
                        >
                          Clear Response
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                    <Button 
                      variant="outline"
                      disabled={currentPrompt === 0}
                      onClick={() => {
                        // Allow going back but clear current response
                        setCurrentPrompt(currentPrompt - 1);
                        setUserResponse('');
                        setCurrentTranscript('');
                        clearTranscript();
                        setSessionProgress(((currentPrompt - 1) / selectedSession.coaching_prompts.length) * 100);
                      }}
                    >
                      Previous
                    </Button>
                    {currentPrompt < selectedSession.coaching_prompts.length - 1 ? (
                      <Button onClick={nextPrompt}>
                        Next Prompt
                      </Button>
                    ) : (
                      <Button onClick={completeSession} className="bg-green-600 hover:bg-green-700">
                        Complete Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Feedback */}
              {feedback.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Coaching Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                      {feedback.map((item, index) => (
                        <div key={index} className="bg-white p-2 sm:p-3 rounded border flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-green-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaCommunicationCoach;