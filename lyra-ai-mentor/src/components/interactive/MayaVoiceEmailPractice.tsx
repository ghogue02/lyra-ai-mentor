import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Pause, Volume2, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

interface VoiceFeedback {
  pace: 'too-fast' | 'too-slow' | 'good';
  clarity: 'unclear' | 'moderate' | 'clear';
  tone: 'monotone' | 'varied' | 'engaging';
  confidence: 'low' | 'moderate' | 'high';
  suggestions: string[];
}

const MayaVoiceEmailPractice: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<VoiceFeedback | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState('project-update');
  const [showEmailContent, setShowEmailContent] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const emailTemplates = {
    'project-update': {
      title: 'Project Status Update',
      content: `Hi Sarah,

I wanted to give you a quick update on the marketing campaign project. We've completed the research phase and identified our target audience segments. The creative team has developed three concept directions that align with our brand guidelines.

Next week, we'll be presenting these concepts to stakeholders and gathering feedback. I expect we'll have a final direction chosen by Friday, which will keep us on track for our launch timeline.

Is there anything specific you'd like me to address in the stakeholder presentation?

Best regards,
Maya`
    },
    'meeting-request': {
      title: 'Meeting Request',
      content: `Dear Mr. Johnson,

I hope this email finds you well. I would like to schedule a 30-minute meeting to discuss the upcoming product launch strategy and how our teams can collaborate effectively.

I'm available Tuesday through Thursday next week, either in the morning between 9-11 AM or in the afternoon after 2 PM. The meeting can be in-person in the conference room or via video call, whichever works better for your schedule.

Please let me know your preferred time, and I'll send a calendar invitation with the agenda.

Thank you for your time.

Best regards,
Maya Rodriguez`
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setFeedback(null);
    
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

    // Auto-stop after 2 minutes
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
        clearInterval(timer);
      }
    }, 120000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const playRecording = () => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const analyzeVoice = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI voice analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockFeedback: VoiceFeedback = {
      pace: 'good',
      clarity: 'clear',
      tone: 'engaging',
      confidence: 'high',
      suggestions: [
        'Great job maintaining a professional yet warm tone',
        'Your pace was well-suited for business communication',
        'Consider adding a slight pause before key points for emphasis',
        'Excellent clarity - your message was easy to follow'
      ]
    };
    
    setFeedback(mockFeedback);
    setIsAnalyzing(false);
  };

  const resetPractice = () => {
    setHasRecording(false);
    setIsRecording(false);
    setIsPlaying(false);
    setFeedback(null);
    setRecordingDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFeedbackColor = (rating: string) => {
    switch (rating) {
      case 'good':
      case 'clear':
      case 'engaging':
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'moderate':
      case 'varied':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl md:text-2xl truncate">Voice Email Practice</CardTitle>
              <CardDescription className="text-sm">
                {isMobile ? 'AI voice coaching' : 'Practice your email delivery with AI-powered voice coaching'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Choose Email to Practice:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {Object.entries(emailTemplates).map(([key, template]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all min-h-[80px] active:scale-[0.98] ${
                    selectedEmail === key ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedEmail(key);
                    if (isMobile) {
                      setShowEmailContent(true);
                    }
                  }}
                >
                  <CardContent className="p-3 md:p-4">
                    <h4 className="font-semibold text-sm md:text-base">{template.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                      {template.content.substring(0, 80)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Email Content Display - Collapsible on mobile */}
          {(!isMobile || showEmailContent) && (
            <Card className="border-purple-200">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-base md:text-lg truncate">
                      {emailTemplates[selectedEmail as keyof typeof emailTemplates].title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {isMobile ? 'Read aloud' : 'Read this email aloud for practice'}
                    </CardDescription>
                  </div>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailContent(false)}
                      className="ml-2"
                    >
                      Hide
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg max-h-[50vh] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
                    {emailTemplates[selectedEmail as keyof typeof emailTemplates].content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recording Controls */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Voice Recording</CardTitle>
              <CardDescription className="text-sm">
                {isMobile ? 'Record your voice' : 'Record yourself reading the email aloud'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {!isRecording && !hasRecording && (
                  <Button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-4 md:py-4 text-base md:text-lg touch-target w-full sm:w-auto max-w-[250px]"
                  >
                    <Mic className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-base md:text-lg font-mono">{formatTime(recordingDuration)}</span>
                    </div>
                    <Button
                      onClick={stopRecording}
                      variant="outline"
                      className="px-6 py-3 touch-target w-full sm:w-auto"
                    >
                      <MicOff className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}

                {hasRecording && !isRecording && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        onClick={playRecording}
                        disabled={isPlaying}
                        variant="outline"
                        className="px-4 md:px-6 py-3 touch-target flex-1 sm:flex-initial"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            <span className="hidden sm:inline">Playing...</span>
                            <span className="sm:hidden">Playing</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            <span className="hidden sm:inline">Play Recording</span>
                            <span className="sm:hidden">Play</span>
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={analyzeVoice}
                        disabled={isAnalyzing}
                        className="bg-purple-600 hover:bg-purple-700 px-4 md:px-6 py-3 touch-target flex-1 sm:flex-initial"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                      </Button>
                    </div>
                    <Button
                      onClick={resetPractice}
                      variant="outline"
                      size="sm"
                      className="touch-target"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="ml-2 sm:hidden">Reset</span>
                    </Button>
                  </div>
                )}
              </div>

              {hasRecording && (
                <div className="text-center text-sm text-gray-600">
                  Recording duration: {formatTime(recordingDuration)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Analysis Results */}
          {feedback && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5" />
                  Voice Analysis Results
                </CardTitle>
                <CardDescription className="text-green-600">
                  AI-powered feedback on your email delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Metrics - Responsive grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="text-center">
                    <div className={`text-xs md:text-sm font-medium p-2 rounded ${getFeedbackColor(feedback.pace)}`}>
                      <span className="hidden sm:inline">Pace: </span>
                      <span className="capitalize">{feedback.pace.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs md:text-sm font-medium p-2 rounded ${getFeedbackColor(feedback.clarity)}`}>
                      <span className="hidden sm:inline">Clarity: </span>
                      <span className="capitalize">{feedback.clarity}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs md:text-sm font-medium p-2 rounded ${getFeedbackColor(feedback.tone)}`}>
                      <span className="hidden sm:inline">Tone: </span>
                      <span className="capitalize">{feedback.tone}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs md:text-sm font-medium p-2 rounded ${getFeedbackColor(feedback.confidence)}`}>
                      <span className="hidden sm:inline">Confidence: </span>
                      <span className="capitalize">{feedback.confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Coaching Suggestions:</h4>
                  <div className="space-y-2">
                    {feedback.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white rounded border">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall Score */}
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Performance:</span>
                    <Badge className="bg-green-600 text-white">Excellent</Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Your email delivery demonstrates strong professional communication skills. 
                    Continue practicing to maintain this level of quality.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaVoiceEmailPractice;