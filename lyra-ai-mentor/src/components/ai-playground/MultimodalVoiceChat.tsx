import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Send, FileText, Image, Loader2, X } from 'lucide-react';
import { useMultimodal } from '@/hooks/useMultimodal';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceTranscript {
  text: string;
  timestamp: Date;
  confidence?: number;
}

interface MultimodalVoiceChatProps {
  character?: 'sofia' | 'alex' | 'maya' | 'david' | 'rachel';
  systemPrompt?: string;
  onMessageSent?: (message: string, type: 'text' | 'voice') => void;
}

export const MultimodalVoiceChat: React.FC<MultimodalVoiceChatProps> = ({
  character = 'sofia',
  systemPrompt,
  onMessageSent
}) => {
  const { toast } = useToast();
  const {
    isProcessing,
    lastOutput,
    transcribeAudio,
    synthesizeSpeech,
    generateImage,
    exportDocument,
    process,
    reset
  } = useMultimodal({
    autoCreateSession: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [transcript, setTranscript] = useState<VoiceTranscript | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    inputType?: 'text' | 'voice' | 'image';
    timestamp: Date;
  }>>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Character-specific settings
  const characterSettings = {
    sofia: {
      voice: 'nova',
      speed: 0.95,
      style: 'empathetic and storytelling-focused',
      color: 'purple'
    },
    alex: {
      voice: 'onyx',
      speed: 1.0,
      style: 'strategic and professional',
      color: 'blue'
    },
    maya: {
      voice: 'alloy',
      speed: 0.9,
      style: 'warm and encouraging',
      color: 'green'
    },
    david: {
      voice: 'echo',
      speed: 1.05,
      style: 'analytical and data-driven',
      color: 'orange'
    },
    rachel: {
      voice: 'shimmer',
      speed: 1.1,
      style: 'efficient and solution-oriented',
      color: 'pink'
    }
  };

  const settings = characterSettings[character];

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your message...",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process voice input
  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      const text = await transcribeAudio(audioBlob);
      setTranscript({
        text,
        timestamp: new Date(),
        confidence: 0.95
      });
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: text,
        inputType: 'voice' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      onMessageSent?.(text, 'voice');
      
      // Generate AI response
      await generateAIResponse(text);
    } catch (error) {
      console.error('Voice processing error:', error);
    }
  };

  // Send text message
  const sendTextMessage = async () => {
    if (!textInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: textInput,
      inputType: 'text' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    onMessageSent?.(textInput, 'text');
    
    const messageText = textInput;
    setTextInput('');
    
    await generateAIResponse(messageText);
  };

  // Generate AI response
  const generateAIResponse = async (userInput: string) => {
    try {
      // Use AI service to generate response
      const response = await process(
        {
          type: 'text',
          data: userInput,
          metadata: {
            character,
            systemPrompt: systemPrompt || `You are ${character}, respond in a ${settings.style} manner.`
          }
        },
        {
          inputType: 'text',
          outputType: 'text',
          aiEnhancement: true
        }
      );
      
      const aiMessage = {
        id: Date.now().toString(),
        type: 'assistant' as const,
        content: response.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Synthesize speech for the response
      if (inputMode === 'voice') {
        await playResponse(response.content);
      }
    } catch (error) {
      console.error('AI response error:', error);
    }
  };

  // Play synthesized speech
  const playResponse = async (text: string) => {
    try {
      const audio = await synthesizeSpeech(text, settings.voice, settings.speed);
      currentAudioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        currentAudioRef.current = null;
      };
      
      await audio.play();
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  // Stop audio playback
  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
  };

  // Export conversation
  const exportConversation = async () => {
    const content = messages.map(msg => 
      `${msg.type === 'user' ? 'User' : 'Assistant'} (${msg.timestamp.toLocaleTimeString()}): ${msg.content}`
    ).join('\n\n');
    
    await exportDocument(content, 'pdf', `Conversation with ${character}`);
    
    toast({
      title: "Conversation Exported",
      description: "Your conversation has been saved as a PDF.",
    });
  };

  // Generate image from description
  const generateImageFromPrompt = async (prompt: string) => {
    try {
      const imageUrl = await generateImage(prompt, 'natural');
      
      const imageMessage = {
        id: Date.now().toString(),
        type: 'assistant' as const,
        content: `Generated image: ${imageUrl}`,
        inputType: 'image' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, imageMessage]);
    } catch (error) {
      console.error('Image generation error:', error);
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", `border-${settings.color}-200`)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Multimodal Voice Chat</span>
            <Badge variant="outline" className={cn(`text-${settings.color}-600`)}>
              {character.charAt(0).toUpperCase() + character.slice(1)}
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={inputMode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('text')}
            >
              Text
            </Button>
            <Button
              variant={inputMode === 'voice' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('voice')}
            >
              Voice
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Message History */}
        <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-3 bg-muted/5">
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : `bg-${settings.color}-100 text-${settings.color}-900`
                )}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.inputType && (
                      <Badge variant="ghost" className="text-xs">
                        {message.inputType}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </motion.div>
          )}
        </div>

        {/* Voice Transcript */}
        {transcript && inputMode === 'voice' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-muted/50 rounded-lg p-3"
          >
            <p className="text-sm text-muted-foreground">Transcript:</p>
            <p className="text-sm font-medium">{transcript.text}</p>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          {inputMode === 'text' ? (
            <div className="flex gap-2">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendTextMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
                rows={3}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={sendTextMessage}
                  disabled={!textInput.trim() || isProcessing}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => generateImageFromPrompt(textInput)}
                  disabled={!textInput.trim() || isProcessing}
                  size="icon"
                  variant="outline"
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                size="lg"
                variant={isRecording ? 'destructive' : 'default'}
                className="relative"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Recording
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              
              {isPlaying && (
                <Button
                  onClick={stopAudio}
                  size="icon"
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={exportConversation}
              disabled={messages.length === 0}
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <Button
            onClick={() => {
              setMessages([]);
              setTranscript(null);
              reset();
            }}
            variant="ghost"
            size="sm"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};