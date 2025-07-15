// Critical fixes for LyraNarratedMayaSideBySide infinite loop issue

// FIX 1: Stabilize processMessages with ref pattern
const processMessagesRef = useRef<(messages: LyraNarrativeMessage[], index?: number) => void>();

// Create stable processMessages that doesn't trigger re-renders
const processMessagesStable = useCallback((messages: LyraNarrativeMessage[], index: number = 0) => {
  if (!messages || index >= messages.length) return;

  const message = messages[index];
  if (!message) return;
  
  const delay = index === 0 ? (message.delay || 500) : 0;

  const timeoutId = setTimeout(() => {
    setVisibleMessages(prev => {
      const exists = prev.find(m => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });
    
    // Use ref to call current typeMessage
    typeMessageRef.current?.(message, () => {
      processMessagesStable(messages, index + 1);
    });
  }, delay);

  messageTimeoutsRef.current.push(timeoutId);
}, []); // No dependencies - stable function

// Store current version in ref
processMessagesRef.current = processMessagesStable;

// FIX 2: Separate stages structure from reactive state
const stagesStructure = useMemo(() => [
  // ... stage definitions without panelBlurLevel or mayaJourney in render
  // Move dynamic content to separate render logic
], []); // No dependencies - static structure

// FIX 3: Fixed useEffect without circular dependencies
useEffect(() => {
  // Prevent re-initialization on strict mode double render
  if (isInitializedRef.current && React.StrictMode) {
    return;
  }
  
  // Comprehensive cleanup
  const cleanup = () => {
    messageTimeoutsRef.current.forEach(clearTimeout);
    messageTimeoutsRef.current = [];
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
    }
  };
  
  cleanup();
  
  setVisibleMessages([]);
  setTypedContent({});
  setIsTyping(null);
  
  const stage = stagesStructure[currentStageIndex];
  if (!stage) return;
  
  // Handle blur state separately to prevent loops
  if (stage.panelBlurState && stage.panelBlurState !== panelBlurLevel) {
    setPanelBlurLevel(stage.panelBlurState);
  }
  
  // Small delay to ensure DOM is ready
  const initTimeout = setTimeout(() => {
    isInitializedRef.current = true;
    processMessagesStable(stage.narrativeMessages);
  }, 100);
  
  return () => {
    clearTimeout(initTimeout);
    cleanup();
    isInitializedRef.current = false;
  };
}, [currentStageIndex, processMessagesStable]); // Stable dependencies only

// FIX 4: Optimized auto-scroll with debouncing
const scrollTimeoutRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  if (chatRef.current && visibleMessages.length > 0) {
    // Clear previous scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
  
  return () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };
}, [visibleMessages.length]); // Only depend on message count

// FIX 5: Prevent blur state loops with previous value check
const prevBlurLevelRef = useRef(panelBlurLevel);

useEffect(() => {
  if (prevBlurLevelRef.current !== panelBlurLevel) {
    prevBlurLevelRef.current = panelBlurLevel;
  }
}, [panelBlurLevel]);

// FIX 6: Batch state updates for performance
import { unstable_batchedUpdates } from 'react-dom';

const handleTryAgain = () => {
  unstable_batchedUpdates(() => {
    setRecipe({});
    setCurrentLayer(1);
    setPhase('build');
    setGeneratedEmail('');
    setAdditionalContext('');
    setKeyPoints([]);
    clearTranscript?.();
  });
};

// FIX 7: Use state reducer for complex state transitions
const mayaJourneyReducer = (state: MayaJourneyState, action: any) => {
  switch (action.type) {
    case 'RESET':
      return initialMayaJourneyState;
    case 'UPDATE_PACE':
      return { ...state, ...action.payload };
    case 'SET_AUDIENCE':
      return { ...state, selectedAudience: action.payload };
    default:
      return state;
  }
};

const [mayaJourney, dispatchMaya] = useReducer(mayaJourneyReducer, initialMayaJourneyState);

// Additional performance optimizations
const MemoizedStageComponent = React.memo(({ stage, panelBlur }: any) => {
  return <div>{stage.component}</div>;
}, (prevProps, nextProps) => {
  return prevProps.stage.id === nextProps.stage.id && 
         prevProps.panelBlur === nextProps.panelBlur;
});