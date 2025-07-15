import { useState, useEffect, useCallback, useRef } from 'react';

interface AdaptiveUIState {
  readingSpeed: number; // words per minute
  engagementLevel: 'high' | 'medium' | 'low';
  emotionalState: 'confident' | 'uncertain' | 'frustrated' | 'neutral';
  preferredPace: 'fast' | 'normal' | 'slow';
  pausePatterns: PausePattern[];
  interactionHistory: InteractionEvent[];
}

interface PausePattern {
  timestamp: number;
  duration: number;
  context: string;
  action?: string;
}

interface InteractionEvent {
  type: 'click' | 'hover' | 'scroll' | 'type' | 'pause';
  timestamp: number;
  target?: string;
  value?: any;
}

interface TypewriterConfig {
  baseSpeed: number;
  variability: number;
  pauseOnPunctuation: number;
}

interface ProactiveHelpConfig {
  enabled: boolean;
  threshold: number;
  suggestions: string[];
}

export const useAdaptiveUI = (userId?: string) => {
  const [state, setState] = useState<AdaptiveUIState>({
    readingSpeed: 200,
    engagementLevel: 'high',
    emotionalState: 'neutral',
    preferredPace: 'normal',
    pausePatterns: [],
    interactionHistory: []
  });

  const [typewriterConfig, setTypewriterConfig] = useState<TypewriterConfig>({
    baseSpeed: 55, // Comfortable storytelling pace
    variability: 25, // Natural human variation
    pauseOnPunctuation: 350 // Dramatic storyteller pauses
  });

  const [proactiveHelp, setProactiveHelp] = useState<ProactiveHelpConfig>({
    enabled: false,
    threshold: 5000, // 5 seconds of inactivity
    suggestions: []
  });

  const lastInteractionRef = useRef<number>(Date.now());
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingStartRef = useRef<number>(0);
  const wordCountRef = useRef<number>(0);

  // Track reading speed
  const startReading = useCallback((wordCount: number) => {
    readingStartRef.current = Date.now();
    wordCountRef.current = wordCount;
  }, []);

  const endReading = useCallback(() => {
    if (readingStartRef.current && wordCountRef.current) {
      const duration = (Date.now() - readingStartRef.current) / 1000 / 60; // minutes
      const speed = Math.round(wordCountRef.current / duration);
      
      setState(prev => ({
        ...prev,
        readingSpeed: Math.round((prev.readingSpeed * 0.7) + (speed * 0.3)) // weighted average
      }));

      // Adjust typewriter speed based on reading speed (storytelling range)
      const speedRatio = speed / 200; // 200 WPM is average
      setTypewriterConfig(prev => ({
        ...prev,
        baseSpeed: Math.max(45, Math.min(80, 55 / speedRatio)) // Keep in storytelling range
      }));
    }
  }, []);

  // Track interactions
  const trackInteraction = useCallback((event: InteractionEvent) => {
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionRef.current;
    
    // Detect pause patterns
    if (timeSinceLastInteraction > 2000) {
      setState(prev => ({
        ...prev,
        pausePatterns: [
          ...prev.pausePatterns.slice(-9), // Keep last 10
          {
            timestamp: lastInteractionRef.current,
            duration: timeSinceLastInteraction,
            context: event.target || 'unknown',
            action: event.type
          }
        ],
        interactionHistory: [...prev.interactionHistory.slice(-49), event] // Keep last 50
      }));
    }

    lastInteractionRef.current = now;

    // Reset pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Set new pause timer for proactive help
    pauseTimerRef.current = setTimeout(() => {
      analyzeUserState();
    }, proactiveHelp.threshold);

  }, [proactiveHelp.threshold]);

  // Analyze user state based on patterns
  const analyzeUserState = useCallback(() => {
    const recentPauses = state.pausePatterns.filter(
      p => p.timestamp > Date.now() - 60000 // Last minute
    );

    const avgPauseDuration = recentPauses.reduce((sum, p) => sum + p.duration, 0) / (recentPauses.length || 1);
    const pauseFrequency = recentPauses.length;

    // Determine emotional state
    let emotionalState: AdaptiveUIState['emotionalState'] = 'neutral';
    if (avgPauseDuration > 10000 || pauseFrequency > 5) {
      emotionalState = 'frustrated';
    } else if (avgPauseDuration > 5000 || pauseFrequency > 3) {
      emotionalState = 'uncertain';
    } else if (avgPauseDuration < 2000 && pauseFrequency < 2) {
      emotionalState = 'confident';
    }

    // Determine engagement level
    const recentInteractions = state.interactionHistory.filter(
      i => i.timestamp > Date.now() - 30000 // Last 30 seconds
    );
    
    let engagementLevel: AdaptiveUIState['engagementLevel'] = 'medium';
    if (recentInteractions.length > 10) {
      engagementLevel = 'high';
    } else if (recentInteractions.length < 3) {
      engagementLevel = 'low';
    }

    setState(prev => ({
      ...prev,
      emotionalState,
      engagementLevel
    }));

    // Generate proactive help suggestions
    if (emotionalState === 'frustrated' || emotionalState === 'uncertain') {
      generateProactiveHelp(emotionalState, state.pausePatterns);
    }
  }, [state.pausePatterns, state.interactionHistory]);

  // Generate context-aware help suggestions
  const generateProactiveHelp = useCallback((
    emotionalState: AdaptiveUIState['emotionalState'],
    pausePatterns: PausePattern[]
  ) => {
    const lastPause = pausePatterns[pausePatterns.length - 1];
    const suggestions: string[] = [];
    const recentInteractionTypes = state.interactionHistory.slice(-5).map(i => i.type);

    if (emotionalState === 'frustrated') {
      suggestions.push("I notice you might be stuck. Would a hint help?");
      suggestions.push("Sometimes a different approach works better. Want to try?");
      suggestions.push("This can be challenging. Let me break it down step by step.");
    } else if (emotionalState === 'uncertain') {
      suggestions.push("Taking your time is wise! Need any clarification?");
      suggestions.push("Would seeing this from Maya's perspective help?");
      suggestions.push("I can provide more examples if that would be useful.");
    }

    // Context-specific suggestions based on pause location and interaction patterns
    if (lastPause?.context.includes('email') || lastPause?.context.includes('response')) {
      suggestions.push("Email writing can feel overwhelming. Want some quick tips?");
      suggestions.push("Consider Maya's audience and tone - that often helps!");
    } else if (lastPause?.context.includes('practice') || lastPause?.context.includes('apply')) {
      suggestions.push("Practice makes perfect! Want to see a sample approach?");
    }

    // Pattern-based suggestions
    if (recentInteractionTypes.filter(t => t === 'pause').length > 2) {
      suggestions.push("I see you're thinking carefully. That's great! Need any guidance?");
    }

    setProactiveHelp(prev => ({
      ...prev,
      enabled: true,
      suggestions: [...new Set(suggestions)].slice(0, 3) // Deduplicate and max 3
    }));
  }, [state.interactionHistory]);

  // Adaptive storytelling rhythm
  const getTypewriterSpeed = useCallback((char: string, position: number) => {
    const { baseSpeed, variability, pauseOnPunctuation } = typewriterConfig;
    
    // Natural storytelling variation
    let speed = baseSpeed + (Math.random() - 0.5) * variability;
    
    // Dramatic storytelling pauses
    if (['.', '!', '?'].includes(char)) {
      speed += pauseOnPunctuation; // Long pause like a storyteller's breath
    } else if ([',', ';'].includes(char)) {
      speed += pauseOnPunctuation * 0.6; // Natural speech rhythm
    } else if ([':'].includes(char)) {
      speed += pauseOnPunctuation * 0.8; // Building anticipation
    }
    
    // Emphasis and pacing
    if (position === 0) {
      speed += baseSpeed * 0.8; // Thoughtful start
    }
    
    // Emphasize important words (capitals)
    if (char === char.toUpperCase() && char !== char.toLowerCase() && position > 0) {
      speed += baseSpeed * 0.5; // Slow down for emphasis
    }
    
    // Emotional storytelling adjustments
    if (state.emotionalState === 'frustrated') {
      speed *= 1.2; // Slower, more patient pace
    } else if (state.emotionalState === 'uncertain') {
      speed *= 1.1; // Slightly slower, reassuring
    } else if (state.emotionalState === 'confident') {
      speed *= 0.95; // Confident but not rushed
    }
    
    // Engagement-based pacing
    if (state.engagementLevel === 'high') {
      speed *= 0.9; // Slightly faster for engaged listeners
    } else if (state.engagementLevel === 'low') {
      speed *= 1.3; // Slower, more deliberate to re-engage
    }
    
    // Keep in storytelling range (40-120ms)
    return Math.max(40, Math.min(120, speed));
  }, [typewriterConfig, state.emotionalState, state.engagementLevel]);

  // Get ambient background based on time and state
  const getAmbientClass = useCallback(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'ambient-morning';
    if (hour >= 12 && hour < 17) return 'ambient-afternoon';
    return 'ambient-evening';
  }, []);

  // Predictive next action
  const predictNextAction = useCallback(() => {
    const recentInteractions = state.interactionHistory.slice(-10);
    const patterns = new Map<string, number>();
    
    // Count interaction patterns
    for (let i = 0; i < recentInteractions.length - 1; i++) {
      const current = recentInteractions[i];
      const next = recentInteractions[i + 1];
      const pattern = `${current.type}-${next.type}`;
      patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
    }
    
    // Find most common pattern
    let mostCommon = '';
    let maxCount = 0;
    patterns.forEach((count, pattern) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = pattern;
      }
    });
    
    // Return predicted next action
    if (mostCommon) {
      const [, nextAction] = mostCommon.split('-');
      return nextAction;
    }
    
    return null;
  }, [state.interactionHistory]);

  // Clean up
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    readingSpeed: state.readingSpeed,
    engagementLevel: state.engagementLevel,
    emotionalState: state.emotionalState,
    
    // Actions
    trackInteraction,
    startReading,
    endReading,
    
    // Adaptive features
    getTypewriterSpeed,
    getAmbientClass,
    predictNextAction,
    
    // Proactive help
    proactiveHelp: {
      enabled: proactiveHelp.enabled,
      suggestions: proactiveHelp.suggestions,
      dismiss: () => setProactiveHelp(prev => ({ ...prev, enabled: false }))
    },
    
    // UI adjustments
    shouldSimplify: state.emotionalState === 'frustrated',
    shouldSlowDown: state.emotionalState === 'uncertain',
    shouldHighlightProgress: state.engagementLevel === 'low'
  };
};