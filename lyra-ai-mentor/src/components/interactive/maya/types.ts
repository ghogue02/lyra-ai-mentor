// Maya-specific types for progress tracking and journey state

export interface MayaStage {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  order: number;
}

export interface MayaSkills {
  pace: boolean;
  tone: boolean;
  templates: boolean;
  conversations: boolean;
  subjects: boolean;
}

export interface MayaJourneyProgress {
  currentStageIndex: number;
  totalStages: number;
  completedSkills: number;
  totalSkills: number;
  stages?: MayaStage[];
  skills?: MayaSkills;
}

// Maya journey state (existing in components)
export interface MayaJourneyState {
  purpose?: string;
  audience?: string;
  tone?: string;
  selectedAudience?: string;
  templateCategory?: string;
  conversationScenario?: string;
  subjectStrategy?: string;
  // Add other Maya-specific state properties as needed
}

// Utility to calculate progress from journey state
export function calculateMayaProgress(journeyState: MayaJourneyState): MayaJourneyProgress {
  const skills: MayaSkills = {
    pace: Boolean(journeyState.purpose && journeyState.audience && journeyState.tone),
    tone: Boolean(journeyState.selectedAudience),
    templates: Boolean(journeyState.templateCategory),
    conversations: Boolean(journeyState.conversationScenario),
    subjects: Boolean(journeyState.subjectStrategy)
  };

  const completedSkills = Object.values(skills).filter(Boolean).length;
  
  // Define stages based on Maya's journey
  const stages: MayaStage[] = [
    { id: 'intro', name: 'Getting Started', completed: true, order: 0 },
    { id: 'pace', name: 'PACE Framework', completed: skills.pace, order: 1 },
    { id: 'tone', name: 'Tone Mastery', completed: skills.tone, order: 2 },
    { id: 'templates', name: 'Template Library', completed: skills.templates, order: 3 },
    { id: 'conversations', name: 'Difficult Conversations', completed: skills.conversations, order: 4 },
    { id: 'subjects', name: 'Subject Excellence', completed: skills.subjects, order: 5 }
  ];

  const currentStageIndex = stages.findIndex(stage => !stage.completed) || stages.length - 1;
  
  return {
    currentStageIndex: currentStageIndex === -1 ? stages.length - 1 : currentStageIndex,
    totalStages: stages.length,
    completedSkills,
    totalSkills: 5,
    stages,
    skills
  };
}

// Progress persistence utilities
export interface MayaProgressData {
  userId: string;
  componentId: string;
  progress: MayaJourneyProgress;
  journeyState: MayaJourneyState;
  lastUpdated: Date;
}

export function createProgressData(
  userId: string,
  componentId: string,
  journeyState: MayaJourneyState
): MayaProgressData {
  return {
    userId,
    componentId,
    progress: calculateMayaProgress(journeyState),
    journeyState,
    lastUpdated: new Date()
  };
}