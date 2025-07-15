import { toast } from "@/hooks/use-toast";

export interface VoiceServiceConfig {
  apiKey?: string;
  language?: string;
  voiceModel?: string;
  transcriptionModel?: string;
}

export interface VoiceSettings {
  autoPlayResponses: boolean;
  voiceSpeed: number;
  voiceVolume: number;
  selectedVoice: string;
  inputMode: 'text' | 'voice';
}

export class VoiceService {
  private static instance: VoiceService;
  private audioContext: AudioContext | null = null;
  private audioQueue: HTMLAudioElement[] = [];
  private currentAudio: HTMLAudioElement | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private config: VoiceServiceConfig;
  
  private constructor(config: VoiceServiceConfig = {}) {
    this.config = {
      language: 'en',
      voiceModel: 'tts-1',
      transcriptionModel: 'whisper-1',
      ...config
    };
    
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
    }
  }
  
  static getInstance(config?: VoiceServiceConfig): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService(config);
    }
    return VoiceService.instance;
  }
  
  private initializeAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
  
  // Text-to-Speech using OpenAI API
  async textToSpeech(
    text: string, 
    voice: string = 'alloy',
    speed: number = 1.0
  ): Promise<HTMLAudioElement> {
    try {
      if (!this.config.apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.voiceModel,
          input: text,
          voice: voice,
          speed: speed,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`TTS failed: ${response.statusText}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Clean up blob URL when audio ends
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
      
      return audio;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Voice Error",
        description: "Failed to generate audio. Please check your settings.",
        variant: "destructive",
      });
      throw error;
    }
  }
  
  // Speech-to-Text using OpenAI Whisper API
  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      if (!this.config.apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', this.config.transcriptionModel || 'whisper-1');
      if (this.config.language) {
        formData.append('language', this.config.language);
      }
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Speech-to-text error:', error);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
  
  // Audio playback controls
  async playAudio(audio: HTMLAudioElement, volume: number = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stopCurrentAudio();
      
      audio.volume = Math.max(0, Math.min(1, volume));
      this.currentAudio = audio;
      
      audio.addEventListener('ended', () => {
        this.currentAudio = null;
        resolve();
      });
      
      audio.addEventListener('error', (error) => {
        this.currentAudio = null;
        reject(error);
      });
      
      audio.play().catch(reject);
    });
  }
  
  // Queue audio for sequential playback
  async queueAudio(audio: HTMLAudioElement): Promise<void> {
    this.audioQueue.push(audio);
    if (this.audioQueue.length === 1) {
      await this.processAudioQueue();
    }
  }
  
  private async processAudioQueue(): Promise<void> {
    while (this.audioQueue.length > 0) {
      const audio = this.audioQueue[0];
      try {
        await this.playAudio(audio);
      } catch (error) {
        console.error('Error playing queued audio:', error);
      }
      this.audioQueue.shift();
    }
  }
  
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
  
  clearAudioQueue(): void {
    this.audioQueue = [];
    this.stopCurrentAudio();
  }
  
  // Microphone permission and recording
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
      return false;
    }
  }
  
  async startRecording(): Promise<void> {
    if (this.isRecording) return;
    
    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check your microphone.",
        variant: "destructive",
      });
      throw error;
    }
  }
  
  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording || !this.mediaRecorder) return null;
    
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        
        // Stop all tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        resolve(audioBlob);
      };
      
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.mediaRecorder = null;
    });
  }
  
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
  
  // Voice activity detection (simple volume-based)
  async detectVoiceActivity(stream: MediaStream): Promise<() => void> {
    this.initializeAudioContext();
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const analyser = this.audioContext.createAnalyser();
    const microphone = this.audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    microphone.connect(analyser);
    
    let voiceDetected = false;
    const checkVoice = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Simple threshold-based voice detection
      const newVoiceDetected = average > 30;
      if (newVoiceDetected !== voiceDetected) {
        voiceDetected = newVoiceDetected;
        window.dispatchEvent(new CustomEvent('voiceactivity', { 
          detail: { active: voiceDetected } 
        }));
      }
    };
    
    const interval = setInterval(checkVoice, 100);
    
    // Return cleanup function
    return () => {
      clearInterval(interval);
      microphone.disconnect();
    };
  }
  
  // Fallback to browser's built-in speech synthesis
  async fallbackTextToSpeech(text: string, rate: number = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);
      
      window.speechSynthesis.speak(utterance);
    });
  }
  
  // Set API configuration
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }
  
  setLanguage(language: string): void {
    this.config.language = language;
  }
}

// Export singleton instance
export const voiceService = VoiceService.getInstance();