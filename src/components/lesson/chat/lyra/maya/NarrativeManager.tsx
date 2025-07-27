import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyraAvatar } from '@/components/LyraAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Clock, AlertCircle, Lightbulb } from 'lucide-react';
import VideoAnimation from '@/components/ui/VideoAnimation';

interface NarrativeMessage {
  id: string;
  content: string;
  emotion?: 'neutral' | 'frustrated' | 'excited' | 'worried' | 'hopeful' | 'anxious' | 'disappointed' | 'thoughtful' | 'enlightened' | 'amazed';
  delay?: number;
  showAvatar?: boolean;
}

interface NarrativeManagerProps {
  messages: NarrativeMessage[];
  onComplete?: () => void;
  onInteractionPoint?: (pointId: string) => void;
  interactionPoints?: {
    id: string;
    afterMessage: number;
    content: React.ReactNode;
  }[];
  autoAdvance?: boolean;
  phaseId?: string; // For state persistence
  onReset?: () => void;
  characterName?: string; // Character name for display
}

const NarrativeManager: React.FC<NarrativeManagerProps> = ({
  messages,
  onComplete,
  onInteractionPoint,
  interactionPoints = [],
  autoAdvance = false,
  phaseId = 'default',
  onReset,
  characterName = 'Maya'
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInteraction, setShowInteraction] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stuckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State persistence - only restore if within same session (< 5 minutes old)
  useEffect(() => {
    const savedState = sessionStorage.getItem(`narrative-${phaseId}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const timeSinceStore = Date.now() - (parsed.timestamp || 0);
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        // Only restore if state is recent (same session)
        if (timeSinceStore < maxAge && parsed.currentMessageIndex !== undefined) {
          console.log('Restoring narrative state for', phaseId, 'at index', parsed.currentMessageIndex);
          setCurrentMessageIndex(parsed.currentMessageIndex);
        } else {
          console.log('Clearing stale narrative state for', phaseId);
          sessionStorage.removeItem(`narrative-${phaseId}`);
        }
      } catch (error) {
        console.warn('Failed to parse saved narrative state:', error);
        sessionStorage.removeItem(`narrative-${phaseId}`);
      }
    }
  }, [phaseId]);

  useEffect(() => {
    const stateToSave = {
      currentMessageIndex,
      timestamp: Date.now()
    };
    sessionStorage.setItem(`narrative-${phaseId}`, JSON.stringify(stateToSave));
  }, [currentMessageIndex, phaseId]);

  // Debug logging with stuck detection
  useEffect(() => {
    console.log('NarrativeManager render:', {
      currentMessageIndex,
      isTyping,
      showInteraction,
      shouldShowBackButton: currentMessageIndex > 0,
      messagesLength: messages.length,
      phaseId
    });

    // Clear previous timeout
    if (stuckTimeoutRef.current) {
      clearTimeout(stuckTimeoutRef.current);
    }

    // If we're on the last message and not typing, start stuck detection
    if (currentMessageIndex === messages.length - 1 && !isTyping && !showInteraction) {
      stuckTimeoutRef.current = setTimeout(() => {
        setIsStuck(true);
        console.warn('Narrative appears to be stuck, enabling reset option');
      }, 5000); // 5 seconds on last message = stuck
    }

    return () => {
      if (stuckTimeoutRef.current) {
        clearTimeout(stuckTimeoutRef.current);
      }
    };
  }, [currentMessageIndex, isTyping, showInteraction, messages.length, phaseId]);

  const currentMessage = messages[currentMessageIndex];
  const isLastMessage = currentMessageIndex === messages.length - 1;

  // Check for interaction points
  useEffect(() => {
    const interactionPoint = interactionPoints.find(
      point => point.afterMessage === currentMessageIndex
    );
    
    if (interactionPoint && !isTyping) {
      setCurrentInteraction(interactionPoint.id);
      setShowInteraction(true);
    }
  }, [currentMessageIndex, isTyping, interactionPoints]);

  // Typing effect
  useEffect(() => {
    if (!currentMessage?.content) return;

    setIsTyping(true);
    setDisplayedText('');
    
    const text = currentMessage.content;
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        if (autoAdvance && !isLastMessage) {
          setTimeout(() => {
            handleAdvance();
          }, currentMessage.delay || 1500);
        }
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentMessage, autoAdvance, isLastMessage]);

  const handleAdvance = () => {
    console.log('handleAdvance called:', { 
      currentMessageIndex, 
      showInteraction, 
      messagesLength: messages.length 
    });
    
    setIsStuck(false); // Reset stuck state on interaction
    
    if (showInteraction) {
      setShowInteraction(false);
      setCurrentInteraction(null);
      if (onInteractionPoint) {
        onInteractionPoint(currentInteraction!);
      }
      return;
    }

    if (currentMessageIndex < messages.length - 1) {
      console.log('Advancing to next message:', currentMessageIndex + 1);
      setCurrentMessageIndex(prev => prev + 1);
    } else if (onComplete) {
      console.log('Completing narrative');
      
      // Clear any existing timeout
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      
      // Delay completion slightly to prevent race conditions
      completionTimeoutRef.current = setTimeout(() => {
        onComplete();
      }, 100);
    }
  };

  const handleGoBack = () => {
    console.log('handleGoBack called:', { 
      currentMessageIndex, 
      canGoBack: currentMessageIndex > 0 
    });
    
    setIsStuck(false); // Reset stuck state on interaction
    
    if (currentMessageIndex > 0) {
      console.log('Going back to message:', currentMessageIndex - 1);
      setCurrentMessageIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    console.log('Resetting narrative manager for phase:', phaseId);
    
    // Reset all component state
    setCurrentMessageIndex(0);
    setDisplayedText('');
    setIsTyping(false);
    setShowInteraction(false);
    setCurrentInteraction(null);
    setIsStuck(false);
    
    // Clear session storage for this phase
    sessionStorage.removeItem(`narrative-${phaseId}`);
    
    // Call parent reset if provided
    if (onReset) {
      onReset();
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      if (stuckTimeoutRef.current) {
        clearTimeout(stuckTimeoutRef.current);
      }
    };
  }, []);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'frustrated':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'excited':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'worried':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'hopeful':
        return <Lightbulb className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'frustrated':
        return 'from-red-50 to-red-100 border-red-200';
      case 'excited':
        return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'worried':
        return 'from-orange-50 to-orange-100 border-orange-200';
      case 'hopeful':
        return 'from-green-50 to-green-100 border-green-200';
      default:
        return 'from-purple-50 to-pink-50 border-purple-200';
    }
  };

  const getAnimationUrl = (filename: string) => {
    return `https://zkwwjzbrygxqrfxkxozk.supabase.co/storage/v1/object/public/app-icons/animations/${filename}`;
  };

  const getLyraEmotionAnimation = (emotion: string) => {
    switch (emotion) {
      case 'excited':
      case 'amazed':
        return 'lyra-excited-discovery.mp4';
      case 'hopeful':
      case 'enlightened':
        return 'lyra-encouraging-gesture.mp4';
      case 'thoughtful':
        return 'lyra-thoughtful-pause.mp4';
      case 'frustrated':
      case 'disappointed':
        return 'lyra-gentle-correction.mp4';
      default:
        return 'lyra-nodding-approval.mp4';
    }
  };

  if (!currentMessage) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className={`bg-gradient-to-r ${getEmotionColor(currentMessage.emotion || 'neutral')}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {currentMessage.showAvatar !== false && (
                  <div className="w-20 h-20 flex-shrink-0">
                    <VideoAnimation
                      src={getAnimationUrl(getLyraEmotionAnimation(currentMessage.emotion || 'neutral'))}
                      fallbackIcon={<LyraAvatar size="md" />}
                      className="w-full h-full"
                      context="character"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-h-[60px]">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{characterName}</h3>
                    {getEmotionIcon(currentMessage.emotion || 'neutral')}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-5 bg-purple-500 ml-1"
                      />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Interaction Point */}
      <AnimatePresence>
        {showInteraction && currentInteraction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            {interactionPoints.find(p => p.id === currentInteraction)?.content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      {!isTyping && !showInteraction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-center gap-3"
        >
          {currentMessageIndex > 0 && (
            <Button
              onClick={handleGoBack}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm"
              size="icon"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </Button>
          )}
          
          <Button
            onClick={handleAdvance}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm"
            size="icon"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button>

          {/* Reset button when stuck */}
          {isStuck && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="ml-2 text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              Reset
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NarrativeManager;