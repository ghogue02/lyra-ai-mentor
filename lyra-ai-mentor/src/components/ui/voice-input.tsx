import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff } from 'lucide-react';
import { useWebSpeechRecognition } from '@/hooks/useWebSpeechRecognition';
import { VoiceVisualizer, SimpleVoiceIndicator } from '@/components/lesson/chat/VoiceVisualizer';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript?: (transcript: string) => void;
  onInterimTranscript?: (transcript: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  visualizerClassName?: string;
  showTranscript?: boolean;
  autoStart?: boolean;
  continuous?: boolean;
  language?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onInterimTranscript,
  placeholder = 'Click to start speaking...',
  className,
  buttonClassName,
  visualizerClassName,
  showTranscript = true,
  autoStart = false,
  continuous = true,
  language = 'en-US',
}) => {
  const [localTranscript, setLocalTranscript] = React.useState('');
  const [localInterimTranscript, setLocalInterimTranscript] = React.useState('');

  const {
    isListening,
    isSupported,
    hasPermission,
    startListening,
    stopListening,
    clearTranscript,
    requestPermission,
    getAudioContext,
    getStream,
  } = useWebSpeechRecognition({
    continuous,
    interimResults: true,
    language,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setLocalTranscript(prev => prev + ' ' + text);
        setLocalInterimTranscript('');
        onTranscript?.(text);
      } else {
        setLocalInterimTranscript(text);
        onInterimTranscript?.(text);
      }
    },
  });

  React.useEffect(() => {
    if (autoStart && isSupported && hasPermission) {
      startListening();
    }
  }, [autoStart, isSupported, hasPermission, startListening]);

  const handleStart = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    
    setLocalTranscript('');
    setLocalInterimTranscript('');
    clearTranscript();
    await startListening();
  };

  const handleStop = () => {
    stopListening();
  };

  const displayText = localTranscript + (localInterimTranscript ? ' ' + localInterimTranscript : '');

  if (!isSupported) {
    return (
      <div className={cn("text-center text-sm text-amber-600", className)}>
        <p>Voice recognition is not supported in your browser.</p>
        <p>Please use Chrome, Edge, or Safari for voice features.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Voice Visualizer */}
      {isListening && (
        <div className="flex items-center justify-center">
          <div className={cn(
            "w-full max-w-md h-16 bg-gray-50 rounded-lg p-2",
            visualizerClassName
          )}>
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
          onClick={isListening ? handleStop : handleStart}
          className={cn(
            "transition-all duration-200",
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-purple-600 hover:bg-purple-700',
            buttonClassName
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
              Start Recording
            </>
          )}
        </Button>
      </div>

      {/* Transcript Display */}
      {showTranscript && (localTranscript || localInterimTranscript || isListening) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Transcript:</label>
            {isListening && (
              <Badge variant="outline" className="animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                Recording
              </Badge>
            )}
          </div>
          <div className="relative">
            <p className="text-gray-800 min-h-[2rem]">
              {displayText || (
                <span className="text-gray-400 italic">
                  {isListening ? 'Start speaking...' : placeholder}
                </span>
              )}
            </p>
            {localInterimTranscript && (
              <span className="absolute bottom-0 right-0 text-xs text-gray-500">
                (listening...)
              </span>
            )}
          </div>
          {localTranscript && !isListening && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setLocalTranscript('');
                setLocalInterimTranscript('');
                clearTranscript();
              }}
              className="mt-2 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Permission Prompt */}
      {!hasPermission && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-sm text-amber-800 mb-2">
            Microphone access is required for voice input.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={requestPermission}
            className="text-amber-700 border-amber-300 hover:bg-amber-100"
          >
            Grant Access
          </Button>
        </div>
      )}
    </div>
  );
};