import { useState, useEffect, useCallback, useRef } from 'react';
import { voiceService, VoiceSettings } from '@/services/voiceService';
import { toast } from '@/hooks/use-toast';

interface UseVoiceChatOptions {
  onTranscriptionComplete?: (text: string) => void;
  onRecordingStart?: () => void;
  onRecordingEnd?: () => void;
  autoPlayResponses?: boolean;
  defaultVoice?: string;
  defaultSpeed?: number;
  defaultVolume?: number;
}

export interface VoiceChatState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  inputMode: 'text' | 'voice';
  voiceSettings: VoiceSettings;
  transcription: string;
  voiceActivityDetected: boolean;
}

export const useVoiceChat = (options: UseVoiceChatOptions = {}) => {
  const {
    onTranscriptionComplete,
    onRecordingStart,
    onRecordingEnd,
    autoPlayResponses = true,
    defaultVoice = 'alloy',
    defaultSpeed = 1.0,
    defaultVolume = 1.0,
  } = options;

  // Load saved settings from localStorage
  const loadSettings = (): VoiceSettings => {
    const saved = localStorage.getItem('voiceSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load voice settings:', e);
      }
    }
    return {
      autoPlayResponses,
      voiceSpeed: defaultSpeed,
      voiceVolume: defaultVolume,
      selectedVoice: defaultVoice,
      inputMode: 'text',
    };
  };

  const [state, setState] = useState<VoiceChatState>({
    isRecording: false,
    isProcessing: false,
    isPlaying: false,
    inputMode: loadSettings().inputMode,
    voiceSettings: loadSettings(),
    transcription: '',
    voiceActivityDetected: false,
  });

  const voiceActivityCleanup = useRef<(() => void) | null>(null);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voiceSettings', JSON.stringify(state.voiceSettings));
  }, [state.voiceSettings]);

  // Voice activity detection listener
  useEffect(() => {
    const handleVoiceActivity = (event: CustomEvent) => {
      setState(prev => ({
        ...prev,
        voiceActivityDetected: event.detail.active,
      }));
    };

    window.addEventListener('voiceactivity', handleVoiceActivity as EventListener);
    return () => {
      window.removeEventListener('voiceactivity', handleVoiceActivity as EventListener);
    };
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isRecording: true, transcription: '' }));
      onRecordingStart?.();
      
      await voiceService.startRecording();
      
      // Auto-stop recording after 60 seconds
      recordingTimeout.current = setTimeout(() => {
        stopRecording();
      }, 60000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setState(prev => ({ ...prev, isRecording: false }));
      toast({
        title: "Recording Failed",
        description: "Could not start recording. Please check your microphone.",
        variant: "destructive",
      });
    }
  }, [onRecordingStart]);

  // Stop recording and transcribe
  const stopRecording = useCallback(async () => {
    if (recordingTimeout.current) {
      clearTimeout(recordingTimeout.current);
      recordingTimeout.current = null;
    }

    setState(prev => ({ ...prev, isRecording: false, isProcessing: true }));
    onRecordingEnd?.();

    try {
      const audioBlob = await voiceService.stopRecording();
      if (!audioBlob) {
        setState(prev => ({ ...prev, isProcessing: false }));
        return;
      }

      // Transcribe the audio
      const transcription = await voiceService.speechToText(audioBlob);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        transcription 
      }));
      
      onTranscriptionComplete?.(transcription);
      
    } catch (error) {
      console.error('Failed to process recording:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
      toast({
        title: "Processing Failed",
        description: "Could not process your voice input. Please try again.",
        variant: "destructive",
      });
    }
  }, [onRecordingEnd, onTranscriptionComplete]);

  // Toggle recording
  const toggleRecording = useCallback(async () => {
    if (state.isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [state.isRecording, startRecording, stopRecording]);

  // Play text as speech
  const playText = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setState(prev => ({ ...prev, isPlaying: true }));

    try {
      const audio = await voiceService.textToSpeech(
        text,
        state.voiceSettings.selectedVoice,
        state.voiceSettings.voiceSpeed
      );
      
      await voiceService.playAudio(audio, state.voiceSettings.voiceVolume);
      
    } catch (error) {
      console.error('Failed to play audio:', error);
      
      // Try fallback browser TTS
      try {
        await voiceService.fallbackTextToSpeech(text, state.voiceSettings.voiceSpeed);
      } catch (fallbackError) {
        toast({
          title: "Playback Failed",
          description: "Could not play audio. Please check your settings.",
          variant: "destructive",
        });
      }
    } finally {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [state.voiceSettings]);

  // Queue text for speech (for multiple responses)
  const queueText = useCallback(async (text: string) => {
    if (!text.trim() || !state.voiceSettings.autoPlayResponses) return;

    try {
      const audio = await voiceService.textToSpeech(
        text,
        state.voiceSettings.selectedVoice,
        state.voiceSettings.voiceSpeed
      );
      
      await voiceService.queueAudio(audio);
      
    } catch (error) {
      console.error('Failed to queue audio:', error);
    }
  }, [state.voiceSettings]);

  // Stop all audio playback
  const stopPlayback = useCallback(() => {
    voiceService.clearAudioQueue();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Toggle input mode
  const toggleInputMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      inputMode: prev.inputMode === 'text' ? 'voice' : 'text',
      voiceSettings: {
        ...prev.voiceSettings,
        inputMode: prev.inputMode === 'text' ? 'voice' : 'text',
      },
    }));
  }, []);

  // Update voice settings
  const updateVoiceSettings = useCallback((updates: Partial<VoiceSettings>) => {
    setState(prev => ({
      ...prev,
      voiceSettings: {
        ...prev.voiceSettings,
        ...updates,
      },
    }));
  }, []);

  // Set API key for voice service
  const setApiKey = useCallback((apiKey: string) => {
    voiceService.setApiKey(apiKey);
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = useCallback(async () => {
    return await voiceService.requestMicrophonePermission();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceActivityCleanup.current) {
        voiceActivityCleanup.current();
      }
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
      stopPlayback();
    };
  }, [stopPlayback]);

  return {
    // State
    ...state,
    
    // Actions
    startRecording,
    stopRecording,
    toggleRecording,
    playText,
    queueText,
    stopPlayback,
    toggleInputMode,
    updateVoiceSettings,
    setApiKey,
    requestMicrophonePermission,
  };
};