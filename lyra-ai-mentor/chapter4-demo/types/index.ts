// Chapter 4 David Chen Type Definitions
// Leadership Communication Types

export interface DavidChenCharacter {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  background: string;
  personality: {
    traits: string[];
    communicationStyle: string;
    leadership: string;
    strengths: string[];
    challenges: string[];
  };
  story: {
    background: string;
    journey: string;
    current: string;
    goals: string[];
  };
  quotes: {
    opening: string;
    motivation: string;
    wisdom: string[];
    closing: string;
  };
  voiceCharacteristics: {
    tone: string;
    pace: string;
    style: string;
    examples: string[];
  };
}

export interface LeadershipLesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: LeadershipConcept[];
  scenarios: LeadershipScenario[];
  practiceActivities: PracticeActivity[];
  assessments: Assessment[];
}

export interface LeadershipConcept {
  id: string;
  title: string;
  description: string;
  examples: string[];
  exercises: string[];
}

export interface LeadershipScenario {
  id: string;
  title: string;
  context: string;
  challenge: string;
  solution: string;
  davidInsight: string;
}

export interface PracticeActivity {
  id: string;
  title: string;
  type: 'roleplay' | 'simulation' | 'reflection' | 'practice';
  description: string;
  instructions: string[];
  feedback: string;
}

export interface Assessment {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scenario' | 'reflection';
  options?: string[];
  feedback: string;
}

export interface ExecutiveWorkshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: 'advanced' | 'expert';
  prerequisites: string[];
  learningOutcomes: string[];
  modules: WorkshopModule[];
  practiceScenarios: WorkshopScenario[];
  assessmentCriteria: AssessmentCriteria[];
}

export interface WorkshopModule {
  id: string;
  title: string;
  content: string;
  activities: string[];
  davidInsights: string[];
}

export interface WorkshopScenario {
  id: string;
  title: string;
  context: string;
  challenge: string;
  roleplayInstructions: string[];
  coachingTips: string[];
  davidFeedback: string;
}

export interface AssessmentCriteria {
  skill: string;
  description: string;
  levels: {
    developing: string;
    proficient: string;
    advanced: string;
    expert: string;
  };
}

export interface LeadershipPACEConfig {
  id: string;
  title: string;
  description: string;
  context: 'leadership' | 'team' | 'executive' | 'crisis';
  phases: {
    prepare: LeadershipPreparePhase;
    assess: LeadershipAssessPhase;
    communicate: LeadershipCommunicatePhase;
    evaluate: LeadershipEvaluatePhase;
  };
  adaptations: {
    audienceLevel: 'team' | 'peer' | 'executive' | 'board';
    communicationStyle: 'directive' | 'collaborative' | 'coaching' | 'inspiring';
    urgency: 'low' | 'medium' | 'high' | 'crisis';
    complexity: 'simple' | 'moderate' | 'complex' | 'transformational';
  };
}

export interface LeadershipPreparePhase {
  title: string;
  description: string;
  activities: {
    stakeholderMapping: PACEActivity;
    messageFraming: PACEActivity;
    contextAnalysis: PACEActivity;
    outcomeDefinition: PACEActivity;
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface LeadershipAssessPhase {
  title: string;
  description: string;
  activities: {
    audienceReadiness: PACEActivity;
    environmentalFactors: PACEActivity;
    riskAssessment: PACEActivity;
    opportunityIdentification: PACEActivity;
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface LeadershipCommunicatePhase {
  title: string;
  description: string;
  activities: {
    openingImpact: PACEActivity;
    coreMessageDelivery: PACEActivity;
    engagementTechniques: PACEActivity;
    closingCommitment: PACEActivity;
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface LeadershipEvaluatePhase {
  title: string;
  description: string;
  activities: {
    impactMeasurement: PACEActivity;
    feedbackCollection: PACEActivity;
    behaviorChange: PACEActivity;
    continuousImprovement: PACEActivity;
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface PACEActivity {
  description: string;
  tools?: string[];
  frameworks?: string[];
  considerations?: string[];
  criteria?: string[];
  indicators?: string[];
  factors?: string[];
  risks?: string[];
  opportunities?: string[];
  techniques?: string[];
  structures?: string[];
  methods?: string[];
  approaches?: string[];
  metrics?: string[];
  sources?: string[];
  processes?: string[];
  davidGuidance: string;
}

export interface UserProgress {
  lessonsCompleted: number[];
  workshopsCompleted: number[];
  conceptsCompleted: string[];
  exercisesCompleted: string[];
  assessmentsCompleted: string[];
  overallProgress: number;
  currentStep: number;
  timeSpent: number;
  lastAccessed: Date;
}

export interface Chapter4Props {
  currentLesson?: number;
  currentWorkshop?: number;
  userProgress?: UserProgress;
  onProgressUpdate?: (progress: UserProgress) => void;
  onLessonComplete?: (lessonId: number) => void;
  onWorkshopComplete?: (workshopId: number) => void;
}

export interface NavigationState {
  activeLesson: number | null;
  activeWorkshop: number | null;
  activeSection: 'overview' | 'lessons' | 'workshops' | 'progress';
  sidebarOpen: boolean;
}

export interface LeadershipContext {
  character: DavidChenCharacter;
  lessons: LeadershipLesson[];
  workshops: ExecutiveWorkshop[];
  paceConfigs: LeadershipPACEConfig[];
  userProgress: UserProgress;
  navigationState: NavigationState;
}

export type CommunicationStyle = 'directive' | 'collaborative' | 'coaching' | 'inspiring';
export type AudienceLevel = 'team' | 'peer' | 'executive' | 'board';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'crisis';
export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'transformational';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LeadershipCommunicationContext {
  audienceLevel: AudienceLevel;
  communicationStyle: CommunicationStyle;
  urgency: UrgencyLevel;
  complexity: ComplexityLevel;
  stakeholders: string[];
  objectives: string[];
  constraints: string[];
  successMetrics: string[];
}

export interface DavidFeedback {
  content: string;
  type: 'insight' | 'guidance' | 'encouragement' | 'correction';
  context: string;
  actionItems?: string[];
  resources?: string[];
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  description: string;
  context: string;
  structure: string[];
  examples: string[];
  davidGuidance: string;
  adaptations: {
    [key in AudienceLevel]?: string;
  };
}

export interface LeadershipMetrics {
  communicationEffectiveness: number;
  teamEngagement: number;
  stakeholderSatisfaction: number;
  decisionQuality: number;
  conflictResolution: number;
  changeManagement: number;
  overallLeadership: number;
}

export interface SkillAssessment {
  skillId: string;
  skillName: string;
  currentLevel: 'developing' | 'proficient' | 'advanced' | 'expert';
  targetLevel: 'developing' | 'proficient' | 'advanced' | 'expert';
  assessmentDate: Date;
  evidence: string[];
  developmentPlan: string[];
  davidFeedback: string;
}

export default {};