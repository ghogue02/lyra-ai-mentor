import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useWebSpeechRecognition } from '@/hooks/useWebSpeechRecognition';
import { VoiceVisualizer, SimpleVoiceIndicator } from '@/components/lesson/chat/VoiceVisualizer';
import { cn } from '@/lib/utils';

const VoiceTestDemo: React.FC = () => {
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    hasPermission,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    requestPermission,
    getAudioContext,
    getStream,
  } = useWebSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: 'en-US',
  });

  const features = [
    { name: 'Browser Support', status: isSupported, description: 'Web Speech API availability' },
    { name: 'Microphone Permission', status: hasPermission, description: 'Access to audio input' },
    { name: 'Real-time Transcription', status: true, description: 'Live speech-to-text' },
    { name: 'Visual Feedback', status: true, description: 'Audio waveform visualization' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Voice Recognition Test Demo</CardTitle>
            <CardDescription className="text-lg">
              Test the Web Speech API implementation with real-time transcription and visual feedback
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Feature Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Feature Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                  {feature.status ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Voice Input Section */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-600" />
              Voice Input Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visualizer */}
            {isListening && (
              <div className="bg-gray-900 rounded-lg p-4">
                {getAudioContext() && getStream() ? (
                  <VoiceVisualizer
                    isActive={isListening}
                    audioContext={getAudioContext()!}
                    stream={getStream()!}
                    className="w-full h-24"
                  />
                ) : (
                  <SimpleVoiceIndicator isActive={isListening} className="h-24" />
                )}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col items-center gap-4">
              {!hasPermission && (
                <Button
                  onClick={requestPermission}
                  variant="outline"
                  className="mb-2"
                >
                  Grant Microphone Access
                </Button>
              )}

              <Button
                onClick={toggleListening}
                disabled={!isSupported}
                size="lg"
                className={cn(
                  "px-8 py-6 text-lg transition-all duration-200",
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-700'
                )}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>

              {transcript && (
                <Button
                  onClick={clearTranscript}
                  variant="outline"
                  size="sm"
                >
                  Clear Transcript
                </Button>
              )}
            </div>

            {/* Status Messages */}
            {!isSupported && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <p className="text-amber-800">
                  Voice recognition is not supported in your browser.
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  Please use Chrome, Edge, or Safari for voice features.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transcription Output */}
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-cyan-600" />
              Transcription Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Real-time Transcript */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Real-time Transcript
                  {isListening && (
                    <Badge variant="outline" className="animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                      Live
                    </Badge>
                  )}
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg min-h-[100px]">
                  <p className="text-gray-800">
                    {transcript || (
                      <span className="text-gray-400 italic">
                        {isListening ? 'Start speaking...' : 'Click "Start Recording" to begin'}
                      </span>
                    )}
                    {interimTranscript && (
                      <span className="text-gray-500 italic"> {interimTranscript}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Stats */}
              {transcript && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-purple-600 font-medium">Word Count</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {transcript.split(' ').filter(w => w.length > 0).length}
                    </p>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded">
                    <p className="text-cyan-600 font-medium">Character Count</p>
                    <p className="text-2xl font-bold text-cyan-800">
                      {transcript.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Grant Microphone Access" if prompted</li>
              <li>Click "Start Recording" to begin voice recognition</li>
              <li>Speak clearly into your microphone</li>
              <li>Watch the real-time transcription appear</li>
              <li>See the audio visualizer respond to your voice</li>
              <li>Click "Stop Recording" when finished</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceTestDemo;