import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, VolumeX, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceChat } from '@/hooks/useVoiceChat';

interface VoiceChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (text?: string) => void;
  onDataInsights?: () => void;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  engagement?: {
    exchangeCount: number;
    hasReachedMinimum: boolean;
  };
  apiKey?: string;
}

export const VoiceChatInput: React.FC<VoiceChatInputProps> = ({
  inputValue,
  setInputValue,
  onSendMessage,
  onDataInsights,
  isTyping,
  inputRef,
  apiKey
}) => {
  const {
    isRecording,
    isProcessing,
    isPlaying,
    inputMode,
    voiceActivityDetected,
    transcription,
    toggleRecording,
    toggleInputMode,
    stopPlayback,
    setApiKey,
    requestMicrophonePermission,
    voiceSettings,
  } = useVoiceChat({
    onTranscriptionComplete: (text) => {
      setInputValue(text);
      // Auto-send if enabled
      if (voiceSettings.autoPlayResponses) {
        onSendMessage(text);
      }
    },
  });

  const [hasMicPermission, setHasMicPermission] = useState(false);

  // Set API key when provided
  useEffect(() => {
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, [apiKey, setApiKey]);

  // Check microphone permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasMicPermission(result.state === 'granted');
      } catch (error) {
        // Permissions API not supported
        console.log('Permissions API not supported');
      }
    };
    checkPermission();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleVoiceClick = async () => {
    if (!hasMicPermission && !isRecording) {
      const granted = await requestMicrophonePermission();
      setHasMicPermission(granted);
      if (!granted) return;
    }
    toggleRecording();
  };

  const handleSendClick = () => {
    if (inputValue.trim() || transcription.trim()) {
      onSendMessage(inputValue || transcription);
      setInputValue('');
    }
  };

  return (
    <div className="flex-shrink-0 bg-gray-800">
      {/* Voice Mode Indicator */}
      {inputMode === 'voice' && (
        <div className="bg-purple-900/20 border-t border-purple-700/50 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isRecording ? "bg-red-500 animate-pulse" : "bg-gray-500"
              )} />
              <span className="text-xs text-purple-300">
                {isRecording ? 'Recording...' : 'Voice mode active'}
              </span>
              {voiceActivityDetected && (
                <span className="text-xs text-green-400">Voice detected</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleInputMode}
              className="text-xs text-purple-300 hover:text-purple-200"
            >
              Switch to text
            </Button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="spacing-mobile spacing-mobile-y border-t border-gray-700 safe-bottom">
        <div className="flex gap-2 sm:gap-3">
          {/* Voice/Text Toggle Button */}
          <Button
            variant={inputMode === 'voice' ? 'default' : 'outline'}
            size="sm"
            onClick={inputMode === 'voice' ? handleVoiceClick : toggleInputMode}
            disabled={isTyping || isProcessing}
            className={cn(
              "h-10 sm:h-12 w-10 sm:w-12 p-0 flex-shrink-0",
              inputMode === 'voice' 
                ? isRecording 
                  ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                  : "bg-purple-600 hover:bg-purple-700"
                : "border-gray-600 hover:bg-gray-700"
            )}
            title={inputMode === 'voice' ? 'Click to record' : 'Switch to voice input'}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>

          {/* Text Input */}
          <Input
            ref={inputRef}
            value={inputValue || transcription}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              inputMode === 'voice' 
                ? "Click the mic to speak or type here..." 
                : "Ask Lyra anything about this lesson..."
            }
            className="mobile-input flex-1 h-10 sm:h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 text-sm sm:text-base"
            disabled={isTyping || isRecording || isProcessing}
          />

          {/* Send Button */}
          <Button
            onClick={handleSendClick}
            disabled={(!inputValue.trim() && !transcription.trim()) || isTyping || isRecording}
            className="mobile-button h-10 sm:h-12 w-10 sm:w-12 p-0 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Audio Control Button */}
          {isPlaying && (
            <Button
              onClick={stopPlayback}
              variant="outline"
              size="sm"
              className="h-10 sm:h-12 w-10 sm:w-12 p-0 border-gray-600 hover:bg-gray-700 flex-shrink-0"
              title="Stop audio playback"
            >
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}

          {/* Data Insights Button */}
          {onDataInsights && (
            <Button
              onClick={onDataInsights}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white border-none h-10 sm:h-12 w-auto px-3 flex-shrink-0"
              title="Get Data Insights"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span className="hidden sm:inline text-xs">Data Insights</span>
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mt-2 text-center leading-relaxed">
          {inputMode === 'voice' 
            ? isRecording 
              ? "Click mic to stop • Speaking will auto-send" 
              : "Click mic to speak • Press Enter to send"
            : "Press Enter to send • Click 🎤 for voice input"
          }
          {onDataInsights && " • Click 📊 for Data Insights"}
        </p>
      </div>
    </div>
  );
};