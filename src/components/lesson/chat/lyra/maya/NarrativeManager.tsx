import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyraAvatar } from '@/components/LyraAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Clock, AlertCircle, Lightbulb } from 'lucide-react';

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
}

const NarrativeManager: React.FC<NarrativeManagerProps> = ({
  messages,
  onComplete,
  onInteractionPoint,
  interactionPoints = [],
  autoAdvance = false
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInteraction, setShowInteraction] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<string | null>(null);

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
    if (showInteraction) {
      setShowInteraction(false);
      setCurrentInteraction(null);
      if (onInteractionPoint) {
        onInteractionPoint(currentInteraction!);
      }
      return;
    }

    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleGoBack = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(prev => prev - 1);
    }
  };

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
                  <LyraAvatar 
                    size="md" 
                    className="flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-h-[60px]">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">Maya</h3>
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
        </motion.div>
      )}
    </div>
  );
};

export default NarrativeManager;