// Types for Maya's Communication Mastery Journey
export interface LyraNarrativeMessage {
  id: string;
  content: string;
  type: 'lyra-unified';
  emotion?: 'warm' | 'encouraging' | 'excited' | 'proud' | 'thoughtful';
  trigger?: string;
  delay?: number;
  layers?: {
    beginner: string;
    intermediate?: string;
    advanced?: string;
  };
  context?: 'story' | 'guidance' | 'celebration' | 'reflection';
  fourthWallBreak?: boolean;
}

export interface InteractiveStage {
  id: string;
  title: string;
  component: React.ReactNode;
  narrativeMessages: LyraNarrativeMessage[];
  panelBlurState?: 'full' | 'partial' | 'clear';
}

export interface MayaJourneyState {
  // PACE Framework
  purpose: string;
  audience: string;
  tone: string;
  generated: string;
  aiPrompt: string;
  audienceContext: string;
  situationDetails: string;
  finalPrompt: string;
  selectedConsiderations: string[];
  
  // Tone Mastery
  selectedAudience: string;
  adaptedTone: string;
  toneConfidence: number;
  
  // Template Library
  templateCategory: string;
  customTemplate: string;
  savedTemplates: string[];
  
  // Difficult Conversations
  conversationScenario: string;
  empathyResponse: string;
  resolutionStrategy: string;
  
  // Subject Workshop
  subjectStrategy: string;
  testedSubjects: string[];
  finalSubject: string;
}

export interface MayaJourneyPanelProps {
  showSummaryPanel: boolean;
  setShowSummaryPanel: (show: boolean) => void;
  mayaJourney: MayaJourneyState;
  currentStageIndex: number;
  totalStages: number;
  isMobile?: boolean;
}