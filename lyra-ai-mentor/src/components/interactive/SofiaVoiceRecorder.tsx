import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Download, 
  Volume2,
  TrendingUp,
  Heart,
  Target,
  BarChart
} from 'lucide-react';

interface VoiceAnalysis {
  pace: number; // words per minute
  clarity: number; // 0-100 score
  energy: number; // 0-100 score
  authenticity: number; // 0-100 score
  emotionalTone: string[];
  recommendations: string[];
  strengths: string[];
}

interface Recording {
  id: string;
  name: string;
  duration: number;
  timestamp: Date;
  analysis?: VoiceAnalysis;
  audioBlob?: Blob;
}

const SofiaVoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStory, setSelectedStory] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const storyPrompts = [
    {
      id: 'childhood-memory',
      title: 'Childhood Memory',
      prompt: 'Share a vivid memory from your childhood that shaped who you are today. Focus on the sensory details and emotions you felt.'
    },
    {
      id: 'overcoming-fear',
      title: 'Overcoming Fear',
      prompt: 'Tell about a time you faced a fear and overcame it. What gave you the courage, and how did it change you?'
    },
    {
      id: 'moment-of-kindness',
      title: 'Moment of Kindness',
      prompt: 'Describe a moment when someone\'s kindness made a significant impact on your life. How did it feel, and how did you pay it forward?'
    },
    {
      id: 'personal-growth',
      title: 'Personal Growth',
      prompt: 'Share a story about a time you learned something important about yourself. What was the situation and the insight you gained?'
    },
    {
      id: 'community-impact',
      title: 'Community Impact',
      prompt: 'Tell about a time you made a difference in your community. What motivated you, and what was the outcome?'
    }
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: selectedStory ? storyPrompts.find(p => p.id === selectedStory)?.title || 'Recording' : `Recording ${recordings.length + 1}`,
          duration: recordingDuration,
          timestamp: new Date(),
          audioBlob: blob
        };
        setCurrentRecording(newRecording);
        setRecordings(prev => [newRecording, ...prev]);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = (recording: Recording) => {
    if (recording.audioBlob) {
      const audioUrl = URL.createObjectURL(recording.audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);

      audio.play();
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const analyzeVoice = async (recording: Recording) => {
    setIsAnalyzing(true);
    
    // Simulate AI voice analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis: VoiceAnalysis = {
      pace: 145 + Math.random() * 30, // 145-175 WPM
      clarity: 75 + Math.random() * 20, // 75-95%
      energy: 60 + Math.random() * 30, // 60-90%
      authenticity: 80 + Math.random() * 15, // 80-95%
      emotionalTone: ['Warm', 'Confident', 'Genuine', 'Engaging'],
      recommendations: [
        'Your natural warmth comes through beautifully in your voice',
        'Consider slowing down slightly during emotional moments for greater impact',
        'Your authenticity is a real strength - lean into personal stories',
        'Practice pausing before key points to build anticipation'
      ],
      strengths: [
        'Natural conversational tone that builds trust',
        'Good use of vocal variety to maintain interest',
        'Authentic emotion that connects with listeners',
        'Clear articulation and easy to understand'
      ]
    };

    const updatedRecording = { ...recording, analysis: mockAnalysis };
    setCurrentRecording(updatedRecording);
    setRecordings(prev => prev.map(r => r.id === recording.id ? updatedRecording : r));
    setIsAnalyzing(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const downloadRecording = (recording: Recording) => {
    if (recording.audioBlob) {
      const url = URL.createObjectURL(recording.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recording.name}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Voice Recorder & Analyzer</CardTitle>
              <CardDescription>
                Record and analyze your storytelling voice for authentic delivery
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recording Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Story Recording</CardTitle>
                  <CardDescription>Choose a story prompt or record freely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Story Prompt Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Story Prompt (Optional):</label>
                    <select 
                      className="w-full p-2 border rounded-md text-sm"
                      value={selectedStory}
                      onChange={(e) => setSelectedStory(e.target.value)}
                      disabled={isRecording}
                    >
                      <option value="">Free recording (no prompt)</option>
                      {storyPrompts.map((prompt) => (
                        <option key={prompt.id} value={prompt.id}>{prompt.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Prompt Display */}
                  {selectedStory && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        {storyPrompts.find(p => p.id === selectedStory)?.title}
                      </h4>
                      <p className="text-sm text-yellow-700">
                        {storyPrompts.find(p => p.id === selectedStory)?.prompt}
                      </p>
                    </div>
                  )}

                  {/* Recording Controls */}
                  <div className="flex flex-col items-center space-y-4">
                    {/* Recording Status */}
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-mono text-lg">{formatDuration(recordingDuration)}</span>
                      </div>
                    )}

                    {/* Main Record Button */}
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                      {isRecording ? 'Click to stop recording' : 'Click to start recording'}
                    </p>
                  </div>

                  {/* Recording Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Recording Tips:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Find a quiet space with minimal echo</li>
                      <li>• Speak naturally, as if talking to a friend</li>
                      <li>• Don't worry about perfection - authenticity matters more</li>
                      <li>• Take your time with emotional moments</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Section */}
            <div className="space-y-6">
              {currentRecording ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Recording</CardTitle>
                    <CardDescription>{currentRecording.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => playRecording(currentRecording)}
                        disabled={isPlaying}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      {isPlaying && (
                        <Button variant="outline" onClick={pausePlayback}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => downloadRecording(currentRecording)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <div className="text-center">
                      <Badge variant="outline">
                        Duration: {formatDuration(currentRecording.duration)}
                      </Badge>
                    </div>

                    {/* Analysis Button */}
                    {!currentRecording.analysis && (
                      <Button
                        onClick={() => analyzeVoice(currentRecording)}
                        disabled={isAnalyzing}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Voice...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Analyze Voice
                          </>
                        )}
                      </Button>
                    )}

                    {/* Analysis Results */}
                    {currentRecording.analysis && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-green-800">Voice Analysis Results</h3>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className={`text-lg font-bold ${getScoreColor(currentRecording.analysis.pace)}`}>
                              {Math.round(currentRecording.analysis.pace)}
                            </div>
                            <div className="text-xs text-gray-600">WPM</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className={`text-lg font-bold ${getScoreColor(currentRecording.analysis.clarity)}`}>
                              {Math.round(currentRecording.analysis.clarity)}%
                            </div>
                            <div className="text-xs text-gray-600">Clarity</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className={`text-lg font-bold ${getScoreColor(currentRecording.analysis.energy)}`}>
                              {Math.round(currentRecording.analysis.energy)}%
                            </div>
                            <div className="text-xs text-gray-600">Energy</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className={`text-lg font-bold ${getScoreColor(currentRecording.analysis.authenticity)}`}>
                              {Math.round(currentRecording.analysis.authenticity)}%
                            </div>
                            <div className="text-xs text-gray-600">Authenticity</div>
                          </div>
                        </div>

                        {/* Emotional Tone */}
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Emotional Tone:</h4>
                          <div className="flex flex-wrap gap-1">
                            {currentRecording.analysis.emotionalTone.map((tone, index) => (
                              <Badge key={index} variant="secondary">
                                {tone}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Strengths */}
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Your Strengths:</h4>
                          <ul className="space-y-1">
                            {currentRecording.analysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Recommendations:</h4>
                          <ul className="space-y-1">
                            {currentRecording.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Record</h3>
                    <p className="text-center">
                      Record your voice to get<br />
                      personalized storytelling feedback
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Recording History */}
          {recordings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recording History</CardTitle>
                <CardDescription>Your voice journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recordings.slice(0, 5).map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{recording.name}</h4>
                        <p className="text-sm text-gray-600">
                          {recording.timestamp.toLocaleDateString()} • {formatDuration(recording.duration)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => playRecording(recording)}>
                          <Play className="w-3 h-3" />
                        </Button>
                        {recording.analysis && (
                          <Badge className="bg-green-100 text-green-800">
                            Analyzed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SofiaVoiceRecorder;