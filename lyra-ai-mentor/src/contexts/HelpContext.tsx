import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FloatingHelpButton } from '@/components/ui/ContextualHelp';
import { TutorialOverlay, TutorialStep } from '@/components/ui/TutorialOverlay';

interface HelpMetrics {
  tooltipsViewed: number;
  tutorialsCompleted: string[];
  helpClickCount: number;
  lastHelpAccess: Date | null;
}

interface HelpContextType {
  // Help visibility states
  showFloatingHelp: boolean;
  setShowFloatingHelp: (show: boolean) => void;
  
  // Tutorial management
  activeTutorial: string | null;
  startTutorial: (tutorialId: string, steps: TutorialStep[]) => void;
  endTutorial: () => void;
  
  // Metrics tracking
  metrics: HelpMetrics;
  trackHelpInteraction: (type: 'tooltip' | 'tutorial' | 'help-click') => void;
  
  // User preferences
  helpLevel: 'beginner' | 'intermediate' | 'advanced';
  setHelpLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  
  // Feature discovery
  highlightFeature: (featureId: string) => void;
  dismissFeatureHighlight: (featureId: string) => void;
  highlightedFeatures: string[];
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: ReactNode;
  defaultHelpLevel?: 'beginner' | 'intermediate' | 'advanced';
  showFloatingHelpButton?: boolean;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({
  children,
  defaultHelpLevel = 'beginner',
  showFloatingHelpButton = true
}) => {
  // State management
  const [showFloatingHelp, setShowFloatingHelp] = useState(showFloatingHelpButton);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([]);
  const [helpLevel, setHelpLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(defaultHelpLevel);
  const [highlightedFeatures, setHighlightedFeatures] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<HelpMetrics>(() => {
    const stored = localStorage.getItem('help-metrics');
    return stored ? JSON.parse(stored) : {
      tooltipsViewed: 0,
      tutorialsCompleted: [],
      helpClickCount: 0,
      lastHelpAccess: null
    };
  });

  // Persist metrics
  useEffect(() => {
    localStorage.setItem('help-metrics', JSON.stringify(metrics));
  }, [metrics]);

  // Load user preferences
  useEffect(() => {
    const storedLevel = localStorage.getItem('help-level');
    if (storedLevel) {
      setHelpLevel(storedLevel as 'beginner' | 'intermediate' | 'advanced');
    }

    const storedHighlights = localStorage.getItem('highlighted-features');
    if (storedHighlights) {
      setHighlightedFeatures(JSON.parse(storedHighlights));
    }
  }, []);

  // Tutorial management
  const startTutorial = (tutorialId: string, steps: TutorialStep[]) => {
    setActiveTutorial(tutorialId);
    setTutorialSteps(steps);
  };

  const endTutorial = () => {
    if (activeTutorial) {
      setMetrics(prev => ({
        ...prev,
        tutorialsCompleted: [...prev.tutorialsCompleted, activeTutorial]
      }));
    }
    setActiveTutorial(null);
    setTutorialSteps([]);
  };

  // Metrics tracking
  const trackHelpInteraction = (type: 'tooltip' | 'tutorial' | 'help-click') => {
    setMetrics(prev => {
      const update = { ...prev, lastHelpAccess: new Date() };
      
      switch (type) {
        case 'tooltip':
          update.tooltipsViewed = prev.tooltipsViewed + 1;
          break;
        case 'help-click':
          update.helpClickCount = prev.helpClickCount + 1;
          break;
      }
      
      return update;
    });
  };

  // Feature highlighting
  const highlightFeature = (featureId: string) => {
    setHighlightedFeatures(prev => {
      const updated = [...prev, featureId];
      localStorage.setItem('highlighted-features', JSON.stringify(updated));
      return updated;
    });
  };

  const dismissFeatureHighlight = (featureId: string) => {
    setHighlightedFeatures(prev => {
      const updated = prev.filter(id => id !== featureId);
      localStorage.setItem('highlighted-features', JSON.stringify(updated));
      return updated;
    });
  };

  // Update help level
  const updateHelpLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setHelpLevel(level);
    localStorage.setItem('help-level', level);
  };

  const contextValue: HelpContextType = {
    showFloatingHelp,
    setShowFloatingHelp,
    activeTutorial,
    startTutorial,
    endTutorial,
    metrics,
    trackHelpInteraction,
    helpLevel,
    setHelpLevel: updateHelpLevel,
    highlightFeature,
    dismissFeatureHighlight,
    highlightedFeatures
  };

  return (
    <HelpContext.Provider value={contextValue}>
      {children}
      
      {/* Floating help button */}
      {showFloatingHelp && !activeTutorial && (
        <FloatingHelpButton
          onClick={() => {
            trackHelpInteraction('help-click');
            // You can customize what happens when the help button is clicked
            // For example, open a help modal or start a tutorial
          }}
        />
      )}
      
      {/* Active tutorial overlay */}
      {activeTutorial && tutorialSteps.length > 0 && (
        <TutorialOverlay
          steps={tutorialSteps}
          isActive={true}
          onComplete={endTutorial}
          onSkip={endTutorial}
          persistKey={activeTutorial}
        />
      )}
    </HelpContext.Provider>
  );
};

// Utility hook for smart help suggestions
export const useSmartHelp = (componentId: string) => {
  const help = useHelp();
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);

  useEffect(() => {
    // Check if this is user's first time with this component
    const hasSeenComponent = localStorage.getItem(`seen-${componentId}`);
    
    if (!hasSeenComponent && help.helpLevel === 'beginner') {
      setShouldShowTutorial(true);
    }
    
    // Mark component as seen
    localStorage.setItem(`seen-${componentId}`, 'true');
  }, [componentId, help.helpLevel]);

  const dismissTutorial = () => {
    setShouldShowTutorial(false);
    localStorage.setItem(`tutorial-${componentId}-dismissed`, 'true');
  };

  return {
    shouldShowTutorial,
    dismissTutorial,
    helpLevel: help.helpLevel,
    startTutorial: (steps: TutorialStep[]) => help.startTutorial(componentId, steps)
  };
};

// Feature discovery hook
export const useFeatureDiscovery = (featureId: string) => {
  const help = useHelp();
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    setIsHighlighted(help.highlightedFeatures.includes(featureId));
  }, [help.highlightedFeatures, featureId]);

  const dismiss = () => {
    help.dismissFeatureHighlight(featureId);
  };

  return {
    isHighlighted,
    dismiss
  };
};