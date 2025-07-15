import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  X, 
  MessageCircle, 
  Trash2, 
  Minimize2, 
  Maximize2,
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Move,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { ProfileCompletionReminder } from '@/components/ProfileCompletionReminder';
import { cn } from '@/lib/utils';
import { useLyraChat } from '@/hooks/useLyraChat';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { 
  basePersonality, 
  characterAdaptations, 
  toneModulations,
  blendPersonality,
  generateContextualGreeting,
  getCharacterQuickActions,
  applyPersonalityToResponse
} from './LyraPersonality';

interface LyraChatProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  characterContext?: string; // maya, sofia, david, rachel, alex
  className?: string;
}

export const LyraChat: React.FC<LyraChatProps> = ({ 
  isExpanded = false, 
  onToggleExpanded,
  lessonContext,
  characterContext,
  className
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<'right' | 'float'>('right');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const { getStory } = useCharacterStory();
  const characterStory = characterContext ? getStory(characterContext) : undefined;
  
  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    userProfile,
    engagement
  } = useLyraChat(lessonContext);

  // Get personality based on character context
  const currentPersonality = blendPersonality(
    basePersonality,
    characterContext ? characterAdaptations[characterContext]?.personalityOverrides : undefined,
    toneModulations.greeting.modifier // Default to greeting tone
  );

  // Generate contextual greeting
  useEffect(() => {
    if (messages.length === 0 && userProfile) {
      const greeting = generateContextualGreeting(
        userProfile.first_name,
        characterContext,
        lessonContext?.lessonTitle,
        false
      );
      
      // This would typically be sent as an initial message
      console.log('Generated greeting:', greeting);
    }
  }, [userProfile, characterContext, lessonContext, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Voice input toggle
  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setVoiceEnabled(true);
    }
  }, [isListening]);

  // Text-to-speech for AI responses
  const speakMessage = useCallback((text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Use a friendly female voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  }, [audioEnabled]);

  // Speak new AI messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser && audioEnabled) {
        speakMessage(lastMessage.content);
      }
    }
  }, [messages, audioEnabled, speakMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get quick actions based on character context
  const quickActions = characterContext 
    ? getCharacterQuickActions(characterContext)
    : [
        "Explain this concept",
        "Give me an example",
        "What's the key takeaway?",
        "How does this apply in practice?"
      ];

  // Typing indicator with personality
  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start gap-2">
        <LyraAvatar size="sm" withWave={false} className="mt-1" />
        <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              />
            </div>
            <span className="text-xs text-gray-500 italic">Lyra is thinking...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Message component with animations
  const MessageBubble = ({ message }: { message: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex",
        message.isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex items-start gap-2 max-w-[85%]",
        message.isUser && "flex-row-reverse"
      )}>
        {!message.isUser && (
          <LyraAvatar size="sm" withWave={false} className="mt-1" />
        )}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={cn(
            "p-3 rounded-lg text-sm leading-relaxed",
            message.isUser
              ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none shadow-sm"
          )}
        >
          {message.content}
        </motion.div>
      </div>
    </motion.div>
  );

  // Floating chat button when collapsed
  if (!isExpanded) {
    return (
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggleExpanded}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300"
          aria-label="Open chat with Lyra"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.div>
        </Button>
        
        {/* Notification badge for engagement */}
        {engagement.exchangeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white">{engagement.exchangeCount}</span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggleExpanded}
          />
        )}
      </AnimatePresence>
      
      {/* Chat Interface */}
      <motion.div
        initial={{ x: position === 'right' ? '100%' : 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: position === 'right' ? '100%' : '-100%', opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed h-full z-50",
          position === 'right' ? 'right-0 top-0' : 'left-0 bottom-0',
          position === 'float' && 'h-[600px] w-[400px] rounded-lg shadow-2xl',
          className
        )}
        style={{ width: position === 'right' ? '380px' : '400px' }}
      >
        <Card className="h-full border-0 border-l shadow-2xl bg-white/95 backdrop-blur-md rounded-none md:rounded-l-lg overflow-hidden">
          {/* Header */}
          <motion.div 
            className={cn(
              "flex items-center justify-between p-4 border-b",
              characterStory 
                ? `bg-gradient-to-r from-${characterStory.color} to-${characterStory.color}/80`
                : "bg-gradient-to-r from-purple-600 to-cyan-500",
              "text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <LyraAvatar size="sm" withWave={false} />
              <div>
                <h3 className="font-semibold flex items-center gap-1">
                  Lyra
                  <Sparkles className="w-4 h-4" />
                </h3>
                <p className="text-xs text-white/90">
                  {characterStory 
                    ? `Helping with ${characterStory.skills[0]}`
                    : lessonContext?.lessonTitle || 'Your AI Mentor'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Voice Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="text-white hover:bg-white/20"
                aria-label={voiceEnabled ? "Disable voice input" : "Enable voice input"}
              >
                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-white hover:bg-white/20"
                aria-label={audioEnabled ? "Mute responses" : "Unmute responses"}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 hidden md:flex"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-white hover:bg-white/20"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpanded}
                className="text-white hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="flex flex-col h-full"
              >
                <CardContent className="flex flex-col h-full p-0">
                  {/* Profile Completion Reminder */}
                  {userProfile && !userProfile.profile_completed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border-b"
                    >
                      <ProfileCompletionReminder userProfile={userProfile} compact />
                    </motion.div>
                  )}

                  {/* Quick Actions */}
                  <AnimatePresence>
                    {showQuickActions && quickActions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 border-b bg-gray-50/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-600">Quick actions:</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowQuickActions(false)}
                            className="h-5 w-5 p-0"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action, index) => (
                            <motion.div
                              key={action}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendMessage(action)}
                                className="text-xs hover:bg-purple-50 hover:border-purple-300"
                              >
                                {action}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    
                    {isTyping && <TypingIndicator />}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input */}
                  <motion.div 
                    className="border-t p-4 bg-white"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                  >
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={
                            isListening 
                              ? "Listening..." 
                              : characterStory 
                                ? `Ask about ${characterStory.skills[0].toLowerCase()}...`
                                : "Ask me anything about AI..."
                          }
                          className={cn(
                            "flex-1 pr-10",
                            isListening && "border-purple-500"
                          )}
                          disabled={isTyping || isListening}
                          aria-label="Chat input"
                        />
                        {voiceEnabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleVoiceInput}
                            className={cn(
                              "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                              isListening && "text-purple-600"
                            )}
                            aria-label={isListening ? "Stop listening" : "Start voice input"}
                          >
                            <Mic className={cn("w-4 h-4", isListening && "animate-pulse")} />
                          </Button>
                        )}
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Press Enter to send • Esc to close
                      </p>
                      {engagement.exchangeCount > 0 && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-purple-600"
                        >
                          {engagement.exchangeCount} exchanges
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </>
  );
};