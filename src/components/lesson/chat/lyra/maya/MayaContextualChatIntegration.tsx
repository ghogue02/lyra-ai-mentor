import React, { useState, useEffect, useCallback } from 'react';
import ContextualLyraChat, { LessonContext } from '../ContextualLyraChat';
import { getMayaContextualQuestions, getStageSpecificQuestions, MayaJourneyState } from './Chapter2ContextualQuestions';

interface MayaContextualChatIntegrationProps {
  mayaJourneyState: MayaJourneyState;
  onJourneyStateUpdate: (newState: MayaJourneyState) => void;
  currentPhase: 'intro' | 'narrative' | 'workshop' | 'completion';
  lessonTitle: string;
  isVisible?: boolean;
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
}

/**
 * Maya-specific contextual chat integration that adapts to her journey progress
 * and provides PACE framework-focused assistance
 */
export const MayaContextualChatIntegration: React.FC<MayaContextualChatIntegrationProps> = ({
  mayaJourneyState,
  onJourneyStateUpdate,
  currentPhase,
  lessonTitle,
  isVisible = true,
  onEngagementChange,
  onNarrativePause,
  onNarrativeResume
}) => {
  const [chatExpanded, setChatExpanded] = useState(false);
  const [engagementLevel, setEngagementLevel] = useState<'passive' | 'curious' | 'active'>('passive');
  const [timeInPhase, setTimeInPhase] = useState(0);

  // Create Maya-specific lesson context
  const mayaLessonContext: LessonContext = {
    chapterNumber: 2,
    chapterTitle: "Maya's Communication Mastery", 
    lessonTitle: lessonTitle,
    phase: currentPhase,
    content: `Maya Rodriguez's journey from email overwhelm to systematic communication mastery using the PACE framework. Current focus: ${getCurrentPhaseDescription(currentPhase)}`,
    objectives: [
      "Master the PACE framework for donor communication",
      "Create personalized email templates with AI assistance", 
      "Develop audience-specific communication strategies",
      "Build sustainable email workflow systems"
    ],
    keyTerms: [
      "PACE Framework (Purpose, Audience, Context, Execution)",
      "Donor Segmentation",
      "Personalization at Scale",
      "Communication Templates",
      "Email Workflow Optimization"
    ],
    difficulty: "intermediate"
  };

  // Track time in current phase for engagement escalation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInPhase(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  // Reset timer when phase changes
  useEffect(() => {
    setTimeInPhase(0);
  }, [currentPhase]);

  // Progressive engagement logic
  useEffect(() => {
    if (timeInPhase < 120) { // 0-2 minutes
      setEngagementLevel('passive');
    } else if (timeInPhase < 300) { // 2-5 minutes  
      setEngagementLevel('curious');
    } else { // 5+ minutes
      setEngagementLevel('active');
    }
  }, [timeInPhase]);

  // Handle Maya journey stage completion
  const handleStageCompletion = useCallback((stageName: string) => {
    const updatedState = {
      ...mayaJourneyState,
      completedStages: [...mayaJourneyState.completedStages, stageName],
      currentStage: getNextStage(stageName)
    };
    onJourneyStateUpdate(updatedState);
  }, [mayaJourneyState, onJourneyStateUpdate]);

  // Enhanced engagement tracking
  const handleEngagementChange = useCallback((isEngaged: boolean, exchangeCount: number) => {
    onEngagementChange?.(isEngaged, exchangeCount);
    
    // Update Maya journey state based on engagement
    if (isEngaged && exchangeCount > 0) {
      const updatedState = {
        ...mayaJourneyState,
        // Track that user has engaged with chat for this phase
        completedStages: mayaJourneyState.completedStages.includes(`${currentPhase}-chat-engaged`) 
          ? mayaJourneyState.completedStages
          : [...mayaJourneyState.completedStages, `${currentPhase}-chat-engaged`]
      };
      onJourneyStateUpdate(updatedState);
    }
  }, [mayaJourneyState, onJourneyStateUpdate, currentPhase, onEngagementChange]);

  // Determine chat visibility based on phase and engagement level
  const shouldShowChat = () => {
    if (!isVisible) return false;
    
    switch (currentPhase) {
      case 'intro':
        return false; // Let users connect with Maya's story first
      case 'narrative':
        return engagementLevel !== 'passive'; // Show after 2 minutes
      case 'workshop':
        return true; // Always available during hands-on work
      case 'completion':
        return true; // Available for reflection and next steps
      default:
        return false;
    }
  };

  // Get contextual questions with Maya journey filtering
  const getContextualQuestions = useCallback(() => {
    const baseQuestions = getMayaContextualQuestions(mayaLessonContext, mayaJourneyState);
    const stageQuestions = getStageSpecificQuestions(mayaJourneyState.currentStage);
    
    return [...stageQuestions, ...baseQuestions];
  }, [mayaLessonContext, mayaJourneyState]);

  if (!shouldShowChat()) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ContextualLyraChat
          lessonContext={mayaLessonContext}
          onChatOpen={() => {
            setChatExpanded(true);
            onNarrativePause?.();
          }}
          onChatClose={() => {
            setChatExpanded(false);
            onNarrativeResume?.();
          }}
          onEngagementChange={handleEngagementChange}
          onNarrativePause={onNarrativePause}
          onNarrativeResume={onNarrativeResume}
          className={getEngagementClassName(engagementLevel)}
          isFloating={true}
          expanded={chatExpanded}
          onExpandedChange={setChatExpanded}
        />
        
        {/* Maya-specific engagement indicators */}
        {renderMayaEngagementIndicators(engagementLevel, currentPhase, mayaJourneyState)}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Get description of current phase for context
 */
function getCurrentPhaseDescription(phase: string): string {
  const descriptions = {
    intro: "Introduction to Maya's email challenges at Hope Gardens Community Center",
    narrative: "Maya's discovery and learning of the PACE framework for effective communication",
    workshop: "Hands-on practice with Maya's template creation and personalization techniques",
    completion: "Reflection on Maya's transformation and planning next steps"
  };
  return descriptions[phase as keyof typeof descriptions] || phase;
}

/**
 * Determine next stage in Maya's journey
 */
function getNextStage(currentStage: string): string {
  const stageFlow = {
    'intro-complete': 'pace-introduction',
    'pace-introduction': 'purpose-identification',
    'purpose-identification': 'audience-analysis',
    'audience-analysis': 'context-awareness',
    'context-awareness': 'execution-planning', 
    'execution-planning': 'template-creation',
    'template-creation': 'personalization-practice',
    'personalization-practice': 'maya-mastery-complete'
  };
  return stageFlow[currentStage as keyof typeof stageFlow] || currentStage;
}

/**
 * Get CSS classes based on engagement level
 */
function getEngagementClassName(level: 'passive' | 'curious' | 'active'): string {
  const baseClasses = "transition-all duration-300";
  
  switch (level) {
    case 'passive':
      return `${baseClasses} opacity-0 pointer-events-none`;
    case 'curious':
      return `${baseClasses} opacity-70 hover:opacity-100`;
    case 'active':
      return `${baseClasses} opacity-100`;
    default:
      return baseClasses;
  }
}

/**
 * Render Maya-specific engagement indicators
 */
function renderMayaEngagementIndicators(
  level: 'passive' | 'curious' | 'active',
  phase: string,
  journeyState: MayaJourneyState
) {
  if (level === 'passive') return null;

  return (
    <motion.div
      className="fixed bottom-20 right-8 z-40 pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/30">
        <div className="text-xs text-purple-700 font-medium">
          Maya's PACE Progress
        </div>
        <div className="flex gap-1 mt-1">
          {Object.entries(journeyState.paceFrameworkProgress).map(([component, completed]) => (
            <div
              key={component}
              className={`w-2 h-2 rounded-full ${
                completed ? 'bg-green-400' : 'bg-gray-300'
              }`}
              title={component}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default MayaContextualChatIntegration;