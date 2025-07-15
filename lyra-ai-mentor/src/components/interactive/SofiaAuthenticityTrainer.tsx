import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Volume2, 
  Mic, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  RefreshCw,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AuthenticityCheck {
  authenticity: number;
  vulnerability: number;
  specificity: number;
  emotion: number;
  universality: number;
  feedback: string[];
  suggestions: string[];
}

interface TrainingExercise {
  id: string;
  title: string;
  description: string;
  prompt: string;
  focusArea: 'vulnerability' | 'emotion' | 'specificity' | 'connection';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const SofiaAuthenticityTrainer: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<TrainingExercise | null>(null);
  const [writtenResponse, setWrittenResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AuthenticityCheck | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const trainingExercises: TrainingExercise[] = [
    {
      id: 'first-vulnerability',
      title: 'First Steps in Vulnerability',
      description: 'Practice sharing something personal in a safe way',
      prompt: 'Share a small mistake you made recently and what you learned from it. Focus on being honest about your feelings without overwhelming detail.',
      focusArea: 'vulnerability',
      difficulty: 'beginner'
    },
    {
      id: 'emotional-honesty',
      title: 'Emotional Honesty',
      description: 'Express genuine emotions without filtering',
      prompt: 'Describe a moment when you felt truly proud of yourself. Let your genuine emotion come through in your voice and words.',
      focusArea: 'emotion',
      difficulty: 'beginner'
    },
    {
      id: 'specific-details',
      title: 'Power of Specificity',
      description: 'Use concrete details to create authentic connection',
      prompt: 'Tell about your morning routine, but include specific sensory details that only you would notice. What makes your experience unique?',
      focusArea: 'specificity',
      difficulty: 'intermediate'
    },
    {
      id: 'difficult-truth',
      title: 'Sharing Difficult Truths',
      description: 'Practice authentic vulnerability with challenging topics',
      prompt: 'Share about a time you disappointed someone important to you. How did it feel, and what did you do about it?',
      focusArea: 'vulnerability',
      difficulty: 'intermediate'
    },
    {
      id: 'universal-connection',
      title: 'Finding Universal Connection',
      description: 'Connect personal experience to shared human experiences',
      prompt: 'Describe a moment of loneliness, but help others see how your specific experience reflects something universal about being human.',
      focusArea: 'connection',
      difficulty: 'advanced'
    },
    {
      id: 'authentic-strength',
      title: 'Authentic Strength',
      description: 'Share accomplishments without losing authenticity',
      prompt: 'Tell about something you\'re genuinely proud of, including the doubts and struggles that made it meaningful.',
      focusArea: 'emotion',
      difficulty: 'advanced'
    }
  ];

  const startExercise = (exercise: TrainingExercise) => {
    setSelectedExercise(exercise);
    setWrittenResponse('');
    setAnalysis(null);
    setHasRecording(false);
  };

  const analyzeAuthenticity = async () => {
    if (!writtenResponse.trim() && !hasRecording) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const wordCount = writtenResponse.split(' ').length;
    const personalPronouns = (writtenResponse.match(/\b(I|me|my|myself)\b/gi) || []).length;
    const emotionWords = (writtenResponse.match(/\b(felt|feel|emotion|heart|afraid|happy|sad|angry|excited|nervous)\b/gi) || []).length;
    const specificDetails = (writtenResponse.match(/\b(exactly|specifically|precisely|literally|actually)\b/gi) || []).length;
    
    const authenticity = Math.min(100, 60 + (personalPronouns / wordCount * 100) * 2 + (emotionWords / wordCount * 100) * 3);
    const vulnerability = Math.min(100, 50 + (emotionWords * 8) + (personalPronouns * 2));
    const specificity = Math.min(100, 40 + (specificDetails * 15) + (wordCount > 50 ? 20 : 0));
    const emotion = Math.min(100, 45 + (emotionWords * 10) + (personalPronouns * 3));
    const universality = Math.min(100, 55 + Math.random() * 30);
    
    const feedback = [];
    const suggestions = [];
    
    if (authenticity >= 80) {
      feedback.push('Your authentic voice shines through clearly');
    } else if (authenticity >= 60) {
      feedback.push('Good authenticity with room for deeper connection');
      suggestions.push('Try sharing more specific personal details');
    } else {
      feedback.push('Consider being more personally vulnerable');
      suggestions.push('Use more "I" statements and personal experiences');
    }
    
    if (vulnerability >= 75) {
      feedback.push('Excellent vulnerability - you\'re being genuinely open');
    } else {
      suggestions.push('Practice sharing something that feels slightly uncomfortable');
    }
    
    if (emotion >= 70) {
      feedback.push('Strong emotional connection in your storytelling');
    } else {
      suggestions.push('Include more emotion words and feelings');
    }
    
    if (specificity >= 65) {
      feedback.push('Great use of specific details that feel real');
    } else {
      suggestions.push('Add more concrete, sensory details that only you would know');
    }
    
    const mockAnalysis: AuthenticityCheck = {
      authenticity: Math.round(authenticity),
      vulnerability: Math.round(vulnerability),
      specificity: Math.round(specificity),
      emotion: Math.round(emotion),
      universality: Math.round(universality),
      feedback,
      suggestions
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const completeExercise = () => {
    if (selectedExercise && !completedExercises.includes(selectedExercise.id)) {
      setCompletedExercises(prev => [...prev, selectedExercise.id]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFocusIcon = (focus: string) => {
    switch (focus) {
      case 'vulnerability': return Heart;
      case 'emotion': return Star;
      case 'specificity': return CheckCircle2;
      case 'connection': return Volume2;
      default: return Heart;
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

  const mockStartRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);
    }, 3000);
  };

  const progressPercentage = (completedExercises.length / trainingExercises.length) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Authenticity Trainer</CardTitle>
              <CardDescription>
                Build confidence in sharing your authentic voice through guided practice
              </CardDescription>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training Progress</span>
              <span>{completedExercises.length}/{trainingExercises.length} exercises completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedExercise ? (
            /* Exercise Selection */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Training Exercise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingExercises.map((exercise) => {
                  const Icon = getFocusIcon(exercise.focusArea);
                  const isCompleted = completedExercises.includes(exercise.id);
                  
                  return (
                    <Card
                      key={exercise.id}
                      className={`cursor-pointer hover:shadow-lg transition-all ${
                        isCompleted ? 'border-green-300 bg-green-50' : 'hover:border-yellow-300'
                      }`}
                      onClick={() => startExercise(exercise)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className="w-5 h-5 text-yellow-600" />
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {exercise.difficulty}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {exercise.focusArea}
                            </Badge>
                          </div>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            {isCompleted ? 'Practice Again' : 'Start'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Exercise */
            <div className="space-y-6">
              {/* Exercise Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedExercise.title}</h3>
                  <p className="text-gray-600">{selectedExercise.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                    {selectedExercise.difficulty}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExercise(null)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                </div>
              </div>

              {/* Exercise Prompt */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">Exercise Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 font-medium">{selectedExercise.prompt}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Response Input */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Response</CardTitle>
                      <CardDescription>Write or record your authentic response</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Written Response */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Written Response:</label>
                        <Textarea
                          placeholder="Share your authentic response here..."
                          value={writtenResponse}
                          onChange={(e) => setWrittenResponse(e.target.value)}
                          rows={8}
                          className="min-h-[200px]"
                        />
                        <div className="text-sm text-gray-600">
                          {writtenResponse.length} characters • {writtenResponse.split(' ').filter(w => w.length > 0).length} words
                        </div>
                      </div>

                      {/* Voice Recording Option */}
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium mb-2 block">Or Record Your Voice:</label>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={mockStartRecording}
                            disabled={isRecording}
                            className={`w-16 h-16 rounded-full ${
                              isRecording ? 'bg-red-500' : hasRecording ? 'bg-green-500' : 'bg-yellow-600'
                            }`}
                          >
                            {isRecording ? (
                              <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                            ) : hasRecording ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : (
                              <Mic className="w-6 h-6 text-white" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 text-center mt-2">
                          {isRecording ? 'Recording...' : hasRecording ? 'Recording saved' : 'Click to record'}
                        </p>
                      </div>

                      {/* Analyze Button */}
                      <Button
                        onClick={analyzeAuthenticity}
                        disabled={(!writtenResponse.trim() && !hasRecording) || isAnalyzing}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Authenticity...
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Check Authenticity
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Analysis Results */}
                <div className="space-y-4">
                  {analysis ? (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Authenticity Analysis</CardTitle>
                        <CardDescription className="text-green-600">
                          How authentic and vulnerable is your storytelling?
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Scores Grid */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Authenticity</span>
                            <div className={`text-lg font-bold ${getScoreColor(analysis.authenticity)}`}>
                              {analysis.authenticity}%
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Vulnerability</span>
                            <div className={`text-lg font-bold ${getScoreColor(analysis.vulnerability)}`}>
                              {analysis.vulnerability}%
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Specificity</span>
                            <div className={`text-lg font-bold ${getScoreColor(analysis.specificity)}`}>
                              {analysis.specificity}%
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Emotion</span>
                            <div className={`text-lg font-bold ${getScoreColor(analysis.emotion)}`}>
                              {analysis.emotion}%
                            </div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">What's Working:</h4>
                          <ul className="space-y-1">
                            {analysis.feedback.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-green-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Suggestions */}
                        {analysis.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">Growth Areas:</h4>
                            <ul className="space-y-1">
                              {analysis.suggestions.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Complete Exercise */}
                        <Button
                          onClick={completeExercise}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Complete Exercise
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Ready for Analysis</h3>
                        <p className="text-center">
                          Share your authentic response<br />
                          to receive personalized feedback
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              {/* Authenticity Tips */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Sofia's Authenticity Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <h4 className="font-semibold mb-2">What Makes Stories Authentic:</h4>
                      <ul className="space-y-1">
                        <li>• Personal details only you would know</li>
                        <li>• Honest emotions, including uncomfortable ones</li>
                        <li>• Specific moments rather than general themes</li>
                        <li>• Your real voice, not what you think people want to hear</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Building Vulnerability Safely:</h4>
                      <ul className="space-y-1">
                        <li>• Start small and build comfort gradually</li>
                        <li>• Focus on growth, not just pain</li>
                        <li>• Share what you've learned, not just what happened</li>
                        <li>• Trust your instinct about how much to share</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SofiaAuthenticityTrainer;