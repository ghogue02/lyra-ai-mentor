import { useCallback, useRef } from 'react';
import { LyraNarrativeMessage } from './types';

/**
 * Custom hook for typewriter effect
 */
export function useTypewriter() {
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const typeMessage = useCallback((
    message: LyraNarrativeMessage,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    setIsTyping: (id: string | null) => void,
    setTypedContent: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
    setPanelBlurLevel: (level: 'full' | 'partial' | 'clear') => void,
    onComplete?: () => void
  ) => {
    if (!message) return;
    
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    setIsTyping(message.id);
    let charIndex = 0;
    
    const content = message.layers?.[userLevel] || message.content;
    if (!content) {
      setIsTyping(null);
      if (onComplete) onComplete();
      return;
    }
    
    setTypedContent(prev => ({ ...prev, [message.id]: '' }));

    const typeChar = () => {
      if (charIndex < content.length) {
        const char = content[charIndex];
        setTypedContent(prev => ({ 
          ...prev, 
          [message.id]: content.slice(0, charIndex + 1) 
        }));
        charIndex++;

        let delay = 20 + Math.random() * 20;
        
        if (['.', '!', '?'].includes(char)) delay += 400;
        else if ([',', ';', ':'].includes(char)) delay += 200;
        else if (char === '\n') delay += 300;
        
        if (message.emotion === 'thoughtful') delay *= 1.2;
        else if (message.emotion === 'excited') delay *= 0.8;

        typewriterTimeoutRef.current = setTimeout(typeChar, delay);
      } else {
        setIsTyping(null);
        
        // Blur trigger functionality removed
        
        if (onComplete) {
          setTimeout(onComplete, 600);
        }
      }
    };

    typewriterTimeoutRef.current = setTimeout(typeChar, 100);
  }, []);

  const clearTypewriter = useCallback(() => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
  }, []);

  return { typeMessage, clearTypewriter };
}

/**
 * Custom hook for message processing
 */
export function useMessageProcessor() {
  const messageTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isInitializedRef = useRef(false);
  const onNarrativeCompleteRef = useRef<(() => void) | null>(null);

  const processMessages = useCallback((
    messages: LyraNarrativeMessage[],
    typeMessage: any,
    setVisibleMessages: React.Dispatch<React.SetStateAction<LyraNarrativeMessage[]>>,
    index: number = 0,
    onNarrativeComplete?: () => void
  ) => {
    // Store the completion callback on first call only
    if (onNarrativeComplete && index === 0) {
      onNarrativeCompleteRef.current = onNarrativeComplete;
    }

    // Check if we've processed all messages
    if (!messages || index >= messages.length) {
      // All messages processed - trigger narrative completion
      if (onNarrativeCompleteRef.current) {
        setTimeout(() => {
          onNarrativeCompleteRef.current?.();
          onNarrativeCompleteRef.current = null;
        }, 500);
      }
      return;
    }

    const message = messages[index];
    if (!message) return;
    
    const delay = index === 0 ? (message.delay || 500) : 0;

    const timeoutId = setTimeout(() => {
      setVisibleMessages(prev => {
        const exists = prev.find(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      
      typeMessage(message, () => {
        // Check if this is the last message
        if (index + 1 >= messages.length) {
          // Last message typed - trigger completion
          console.log('🎯 NARRATIVE COMPLETE: Triggering completion callback');
          if (onNarrativeCompleteRef.current) {
            setTimeout(() => {
              console.log('🎯 EXECUTING: Narrative completion callback');
              onNarrativeCompleteRef.current?.();
              onNarrativeCompleteRef.current = null;
            }, 500);
          }
        } else if (isInitializedRef.current) {
          // Continue to next message (don't pass onNarrativeComplete to avoid re-storing)
          processMessages(messages, typeMessage, setVisibleMessages, index + 1);
        }
      });
    }, delay);

    messageTimeoutsRef.current.push(timeoutId);
  }, []);

  const clearMessages = useCallback(() => {
    messageTimeoutsRef.current.forEach(clearTimeout);
    messageTimeoutsRef.current = [];
    isInitializedRef.current = false;
    onNarrativeCompleteRef.current = null;
  }, []);

  const initializeProcessing = useCallback(() => {
    isInitializedRef.current = true;
  }, []);

  return { 
    processMessages, 
    clearMessages, 
    initializeProcessing,
    isInitializedRef 
  };
}

/**
 * Custom hook for fast forward functionality
 */
export function useFastForward() {
  const fastForward = useCallback((
    stages: any[],
    currentStageIndex: number,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    setIsFastForwarding: (value: boolean) => void,
    setVisibleMessages: React.Dispatch<React.SetStateAction<LyraNarrativeMessage[]>>,
    setTypedContent: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
    setIsTyping: (id: string | null) => void,
    setPanelBlurLevel: () => void, // Deprecated - blur functionality removed
    clearMessages: () => void,
    clearTypewriter: () => void
  ) => {
    setIsFastForwarding(true);
    
    clearMessages();
    clearTypewriter();
    
    const stage = stages[currentStageIndex];
    if (stage && stage.narrativeMessages) {
      setVisibleMessages(stage.narrativeMessages);
      
      const completedContent: {[key: string]: string} = {};
      stage.narrativeMessages.forEach((message: LyraNarrativeMessage) => {
        const content = message.layers?.[userLevel] || message.content;
        completedContent[message.id] = content;
        
        // Blur trigger functionality removed
      });
      
      setTypedContent(completedContent);
      setIsTyping(null);
    }
    
    setTimeout(() => setIsFastForwarding(false), 500);
  }, []);

  return { fastForward };
}

/**
 * Custom hook for mobile detection
 */
export function useMobileDetection() {
  const checkMobile = useCallback(() => {
    return window.innerWidth < 1024; // lg breakpoint
  }, []);

  return { checkMobile };
}