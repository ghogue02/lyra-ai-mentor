import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message?: string;
}

// TypeScript doesn't have built-in types for Web Speech API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export interface UseWebSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export interface WebSpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  hasPermission: boolean;
}

export const useWebSpeechRecognition = (options: UseWebSpeechRecognitionOptions = {}) => {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US',
    onTranscript,
    onError,
  } = options;

  const [state, setState] = useState<WebSpeechRecognitionState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    hasPermission: false,
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check if Web Speech API is supported
  useEffect(() => {
    const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setState(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      console.warn('Web Speech API is not supported in this browser');
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!state.isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: prev.transcript + finalTranscript,
        interimTranscript,
      }));

      if (onTranscript) {
        if (finalTranscript) {
          onTranscript(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          onTranscript(interimTranscript, false);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error';

      switch (event.error) {
        case 'network':
          errorMessage = 'Network error occurred';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied';
          setState(prev => ({ ...prev, hasPermission: false }));
          break;
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition aborted';
          break;
        default:
          errorMessage = event.error;
      }

      setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
      onError?.(errorMessage);

      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [state.isSupported, continuous, interimResults, language, onTranscript, onError]);

  // Request microphone permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Initialize audio context for visualizer
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      setState(prev => ({ ...prev, hasPermission: true }));
      
      // Stop the stream after getting permission (we'll start a new one when recording)
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setState(prev => ({ ...prev, hasPermission: false }));
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    if (!state.isSupported || !recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    // Check permission first
    if (!state.hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      // Get fresh audio stream for visualizer
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      streamRef.current = stream;

      // Clear previous transcripts
      setState(prev => ({
        ...prev,
        transcript: '',
        interimTranscript: '',
        error: null,
      }));

      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setState(prev => ({ ...prev, error: 'Failed to start voice recognition' }));
    }
  }, [state.isSupported, state.hasPermission, requestPermission]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
      
      // Stop audio stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [state.isListening]);

  // Toggle listening
  const toggleListening = useCallback(async () => {
    if (state.isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
    }));
  }, []);

  // Get audio context and stream for visualizer
  const getAudioContext = useCallback(() => audioContextRef.current, []);
  const getStream = useCallback(() => streamRef.current, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    requestPermission,
    
    // For visualizer
    getAudioContext,
    getStream,
  };
};