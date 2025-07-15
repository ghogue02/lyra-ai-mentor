import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Play, 
  Pause, 
  Volume2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  Heart,
  Target
} from 'lucide-react';

interface VoiceExercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'breathing' | 'resonance' | 'storytelling' | 'authenticity';
  instructions: string[];
  tips: string[];
}

interface SessionData {
  exercise: VoiceExercise;
  startTime: Date;
  completed: boolean;
  notes?: string;
}

const SofiaVoiceCoach: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<VoiceExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<SessionData[]>([]);

  const voiceExercises: VoiceExercise[] = [
    {
      id: 'breathing-foundation',
      title: 'Breathing Foundation',
      description: 'Build the breath support needed for confident speaking',
      duration: '5 min',
      type: 'breathing',
      instructions: [
        'Sit comfortably with your back straight',
        'Place one hand on your chest, one on your belly',
        'Breathe slowly so only your bottom hand moves',
        'Inhale for 4 counts, hold for 2, exhale for 6',
        'Focus on filling your lower lungs completely'
      ],
      tips: [
        'Your chest should barely move - all breathing from the diaphragm',
        'If you feel dizzy, slow down the breathing pace',
        'Practice this daily to build muscle memory'
      ]
    },
    {
      id: 'warm-resonance',
      title: 'Warm Resonance',
      description: 'Develop rich, warm vocal tones that build connection',
      duration: '4 min',
      type: 'resonance',
      instructions: [
        'Start with gentle humming to warm up your voice',
        'Say "Mah-May-My-Moh-Moo" with rich, full tones',
        'Feel the vibrations in your chest and face',
        'Practice scales with "Lah" sounds, focusing on warmth',
        'End with a few "Mmm-hmm" affirmations'
      ],
      tips: [
        'Think of honey when you speak - warm and flowing',
        'Lower tones generally sound more trustworthy',
        'Smile slightly while speaking to add warmth'
      ]
    },
    {
      id: 'storytelling-rhythm',
      title: 'Storytelling Rhythm',
      description: 'Practice pacing and emphasis for compelling narratives',
      duration: '6 min',
      type: 'storytelling',
      instructions: [
        'Choose a simple childhood memory',
        'Tell it first at normal speed',
        'Retell it, slowing down during emotional moments',
        'Practice emphasizing key words with volume or pitch',
        'Add strategic pauses before important points'
      ],
      tips: [
        'Slow down 20% more than feels natural',
        'Pause after questions to let them sink in',
        'Vary your pace to match the emotional content'
      ]
    },
    {
      id: 'authentic-vulnerability',
      title: 'Authentic Vulnerability',
      description: 'Practice sharing personal truths with confidence',
      duration: '8 min',
      type: 'authenticity',
      instructions: [
        'Share something small you\'re working on personally',
        'Focus on how it feels to be vulnerable',
        'Practice saying "I don\'t know" with confidence',
        'Tell about a time you changed your mind about something',
        'Practice asking for help or support'
      ],
      tips: [
        'Vulnerability isn\'t about oversharing - it\'s about honesty',
        'Let your voice soften naturally during vulnerable moments',
        'Breathe deeply before sharing something personal'
      ]
    },
    {
      id: 'confidence-building',
      title: 'Confidence Building',
      description: 'Strengthen your vocal presence and authority',
      duration: '5 min',
      type: 'authenticity',
      instructions: [
        'Stand tall and speak your name with pride',
        'Practice saying "I believe..." statements',
        'Share an accomplishment you\'re genuinely proud of',
        'Practice making a point without apologizing',
        'End with three things you\'re confident about'
      ],
      tips: [
        'Confidence comes from preparation and authenticity',
        'Ground yourself physically for vocal grounding',
        'Speak from your values, not your fears'
      ]
    },
    {
      id: 'empathy-expression',
      title: 'Empathy Expression',
      description: 'Learn to convey understanding and connection through voice',
      duration: '4 min',
      type: 'storytelling',
      instructions: [
        'Practice saying "I understand how you feel" with genuine warmth',
        'Tell about someone who showed you kindness',
        'Practice acknowledging different perspectives',
        'Share how someone\'s story affected you',
        'Practice active listening responses'
      ],
      tips: [
        'Match your vocal energy to the other person\'s emotional state',
        'Use a slightly slower pace when showing empathy',
        'Let genuine care come through in your tone'
      ]
    }
  ];

  const startSession = (exercise: VoiceExercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setSessionTime(0);
    setIsSessionActive(true);
    
    // Start timer
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    // Auto-stop after exercise duration
    const durationMinutes = parseInt(exercise.duration);
    setTimeout(() => {
      clearInterval(timer);
      completeSession();
    }, durationMinutes * 60 * 1000);
  };

  const completeSession = () => {
    if (selectedExercise) {
      const sessionData: SessionData = {
        exercise: selectedExercise,
        startTime: new Date(),
        completed: true
      };
      setCompletedSessions(prev => [sessionData, ...prev.slice(0, 4)]);
    }
    setIsSessionActive(false);
  };

  const nextStep = () => {
    if (selectedExercise && currentStep < selectedExercise.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'bg-blue-100 text-blue-800';
      case 'resonance': return 'bg-purple-100 text-purple-800';
      case 'storytelling': return 'bg-yellow-100 text-yellow-800';
      case 'authenticity': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breathing': return Volume2;
      case 'resonance': return TrendingUp;
      case 'storytelling': return Play;
      case 'authenticity': return Heart;
      default: return Mic;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!selectedExercise) return 0;
    return ((currentStep + 1) / selectedExercise.instructions.length) * 100;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Voice Coach</CardTitle>
              <CardDescription>
                Micro voice discovery sessions to strengthen your authentic speaking presence
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedExercise ? (
            /* Exercise Selection */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Voice Exercise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceExercises.map((exercise) => {
                  const Icon = getTypeIcon(exercise.type);
                  
                  return (
                    <Card
                      key={exercise.id}
                      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-yellow-300"
                      onClick={() => startSession(exercise)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-yellow-600" />
                          <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        </div>
                        <CardDescription>{exercise.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge className={getTypeColor(exercise.type)}>
                              {exercise.type}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exercise.duration}
                            </Badge>
                          </div>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            Start Session
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Session */
            <div className="space-y-6">
              {/* Session Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedExercise.title}</h3>
                  <p className="text-gray-600">{selectedExercise.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-mono">{formatTime(sessionTime)}</div>
                    <div className="text-xs text-gray-600">Session Time</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExercise(null)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    End Session
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exercise Progress</span>
                  <span>Step {currentStep + 1} of {selectedExercise.instructions.length}</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>

              {/* Current Instruction */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Step {currentStep + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <p className="text-lg font-medium text-gray-800">
                      {selectedExercise.instructions[currentStep]}
                    </p>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      Previous Step
                    </Button>
                    {currentStep < selectedExercise.instructions.length - 1 ? (
                      <Button
                        onClick={nextStep}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        onClick={completeSession}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Exercise Tips */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Sofia's Tips for {selectedExercise.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recording Option */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Practice Recording</CardTitle>
                  <CardDescription>Record yourself to track progress</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <Button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-16 h-16 rounded-full ${
                      isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {isRecording ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Session History */}
          {completedSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
                <CardDescription>Your voice training progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedSessions.map((session, index) => {
                    const Icon = getTypeIcon(session.exercise.type);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-yellow-600" />
                          <div>
                            <h4 className="font-medium">{session.exercise.title}</h4>
                            <p className="text-sm text-gray-600">
                              {session.startTime.toLocaleDateString()} • {session.exercise.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(session.exercise.type)}>
                            {session.exercise.type}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voice Development Tips */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Building Your Authentic Voice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <h4 className="font-semibold mb-2">Daily Practice:</h4>
                  <ul className="space-y-1">
                    <li>• 5 minutes of breathing exercises</li>
                    <li>• Practice storytelling with family/friends</li>
                    <li>• Record yourself reading aloud</li>
                    <li>• Notice and celebrate small improvements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Voice Confidence:</h4>
                  <ul className="space-y-1">
                    <li>• Your voice is unique - embrace it</li>
                    <li>• Slow down to show confidence</li>
                    <li>• Speak from your values and experiences</li>
                    <li>• Remember: authenticity &gt; perfection</li>
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

export default SofiaVoiceCoach;