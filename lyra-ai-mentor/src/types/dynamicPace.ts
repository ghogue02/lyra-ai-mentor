export interface ChoicePath {
  id: string;
  purpose: PurposeType;
  audience: DynamicAudience; // Primary audience for backward compatibility
  audiences?: DynamicAudience[]; // Multiple audience options
  content: PathSpecificStrategy;
  execution: PersonalizedExecution;
  metadata: PathMetadata;
}

export interface DynamicAudience {
  id: string;
  label: string;
  description: string;
  contextualDescription: string; // Purpose-specific description
  psychographics: {
    motivations: string[];
    painPoints: string[];
    preferredCommunicationStyle: CommunicationStyle;
    decisionMakingStyle: DecisionMakingStyle;
  };
  demographics: {
    role: string;
    experienceLevel: ExperienceLevel;
    timeConstraints: TimeConstraints;
    techComfort: TechComfort;
  };
  adaptiveContext: {
    currentChallenges: string[];
    successTriggers: string[];
    stressFactors: string[];
    confidenceBuilders: string[];
  };
}

export interface PathSpecificStrategy {
  id: string;
  name: string;
  description: string;
  adaptiveDescription: string; // Changes based on P+A combination
  framework: ContentFramework;
  templates: AdaptiveTemplate[];
  approachModifiers: ApproachModifier[];
  personalizedGuidance: PersonalizedGuidance;
}

export interface PersonalizedExecution {
  id: string;
  name: string;
  description: string;
  adaptiveInstructions: string; // Full P+A+C context
  executionVariants: ExecutionVariant[];
  timeOptimizations: TimeOptimization[];
  confidenceSupport: ConfidenceSupport;
  successMetrics: SuccessMetric[];
}

export interface PathMetadata {
  createdAt: Date;
  lastModified: Date;
  completionRate: number;
  averageConfidence: number;
  timeToComplete: number;
  userFeedback: number;
  tags: string[];
  difficulty: DifficultyLevel;
  prerequisites: string[];
}

// Purpose Types (8 core purposes)
export type PurposeType = 
  | 'inform_educate'
  | 'persuade_convince'
  | 'build_relationships'
  | 'solve_problems'
  | 'request_support'
  | 'inspire_motivate'
  | 'establish_authority'
  | 'create_engagement';

// Communication and Decision Making Styles
export type CommunicationStyle = 
  | 'direct_factual'
  | 'warm_personal'
  | 'professional_formal'
  | 'casual_friendly'
  | 'analytical_detailed'
  | 'inspirational_emotional'
  | 'collaborative_inclusive'
  | 'authoritative_confident';

export type DecisionMakingStyle = 
  | 'data_driven'
  | 'intuitive_emotional'
  | 'collaborative_consensus'
  | 'quick_decisive'
  | 'thorough_analytical'
  | 'risk_averse'
  | 'innovative_experimental';

// Experience and Constraints
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TimeConstraints = 'very_limited' | 'moderate' | 'flexible' | 'abundant';
export type TechComfort = 'low' | 'moderate' | 'high' | 'expert';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

// Content Framework
export interface ContentFramework {
  structure: ContentStructure;
  mayaFramework?: MayaFramework; // Selected Maya framework
  toneGuidelines: ToneGuideline[];
  messagingHierarchy: MessagePriority[];
  adaptiveElements: AdaptiveElement[];
}

export interface ContentStructure {
  openingApproach: OpeningApproach;
  bodyFramework: BodyFramework;
  closingStrategy: ClosingStrategy;
  callToAction: CallToActionType;
}

export interface AdaptiveTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  adaptiveFields: AdaptiveField[];
  conditions: TemplateCondition[];
  personalizationLevel: PersonalizationLevel;
}

export interface AdaptiveField {
  fieldName: string;
  fieldType: FieldType;
  adaptationRules: AdaptationRule[];
  fallbackValue: string;
}

export interface AdaptationRule {
  condition: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in_range';
  value: any;
  replacement: string;
}

export interface TemplateCondition {
  audienceAttribute: string;
  contextAttribute: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: any;
  weight: number;
}

export interface ApproachModifier {
  name: string;
  description: string;
  conditions: string[];
  modifications: ContentModification[];
}

export interface ContentModification {
  element: ContentElement;
  modificationType: ModificationType;
  value: string;
  weight: number;
}

export interface PersonalizedGuidance {
  preparationSteps: GuidanceStep[];
  writingProcess: GuidanceStep[];
  reviewChecklist: GuidanceStep[];
  adaptiveHints: AdaptiveHint[];
}

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  adaptiveDescription: string;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  tips: string[];
}

export interface AdaptiveHint {
  trigger: HintTrigger;
  conditions: HintCondition[];
  message: string;
  urgency: HintUrgency;
  timing: HintTiming;
}

// Execution Variants
export interface ExecutionVariant {
  id: string;
  name: string;
  description: string;
  conditions: ExecutionCondition[];
  timeline: ExecutionTimeline;
  steps: ExecutionStep[];
  adaptiveFeatures: AdaptiveFeature[];
}

export interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  adaptiveInstructions: string;
  estimatedTime: number;
  requiredTools: string[];
  successCriteria: string[];
  troubleshooting: TroubleshootingTip[];
}

export interface ExecutionCondition {
  attribute: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in_range';
  value: any;
  weight: number;
}

export interface ExecutionTimeline {
  totalTime: number;
  urgentMode: number;
  thoroughMode: number;
  adaptiveFactors: TimelineFactor[];
}

export interface TimelineFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface AdaptiveFeature {
  name: string;
  description: string;
  triggers: FeatureTrigger[];
  benefits: string[];
  implementation: FeatureImplementation;
}

export interface FeatureTrigger {
  condition: string;
  threshold: number;
  action: TriggerAction;
}

export interface FeatureImplementation {
  method: ImplementationMethod;
  parameters: Record<string, any>;
  fallback: string;
}

// Time and Confidence Support
export interface TimeOptimization {
  name: string;
  description: string;
  conditions: OptimizationCondition[];
  timeSaved: number;
  effortReduction: number;
  qualityImpact: QualityImpact;
}

export interface OptimizationCondition {
  attribute: string;
  value: any;
  operator: 'equals' | 'greater' | 'less' | 'contains';
}

export interface ConfidenceSupport {
  preparation: ConfidenceBooster[];
  execution: ConfidenceBooster[];
  review: ConfidenceBooster[];
  adaptiveSupport: AdaptiveSupport[];
}

export interface ConfidenceBooster {
  name: string;
  description: string;
  triggers: ConfidenceTrigger[];
  impact: ConfidenceImpact;
  implementation: BoosterImplementation;
}

export interface ConfidenceTrigger {
  condition: string;
  threshold: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface AdaptiveSupport {
  supportType: SupportType;
  conditions: SupportCondition[];
  intervention: SupportIntervention;
  followUp: FollowUpAction[];
}

export interface SupportIntervention {
  method: InterventionMethod;
  timing: InterventionTiming;
  content: string;
  alternatives: string[];
}

export interface FollowUpAction {
  action: string;
  delay: number;
  conditions: string[];
}

// Success Metrics
export interface SuccessMetric {
  name: string;
  description: string;
  measurementMethod: MeasurementMethod;
  targetValue: number;
  weight: number;
  adaptiveThresholds: AdaptiveThreshold[];
}

export interface AdaptiveThreshold {
  condition: string;
  threshold: number;
  adjustment: number;
  description: string;
}

// Hint and Guidance Types
export interface HintCondition {
  attribute: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: any;
  weight: number;
}

export interface TroubleshootingTip {
  problem: string;
  solution: string;
  conditions: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Maya's Framework Types
export type MayaFrameworkType = 'story_arc' | 'teaching_moment' | 'invitation';

export interface MayaFramework {
  type: MayaFrameworkType;
  name: string;
  description: string;
  elements: MayaFrameworkElement[];
  npoContext: string;
  applicationGuidance: string;
}

export interface MayaFrameworkElement {
  id: string;
  name: string;
  description: string;
  naturalLanguage: string; // How Maya would describe it
  npoExample: string;
  purposeSpecific?: string; // Changes based on selected purpose
  audienceSpecific?: string; // Changes based on selected audience
  tips: string[];
}

export interface StoryArcFramework extends MayaFramework {
  type: 'story_arc';
  elements: StoryArcElement[];
}

export interface TeachingMomentFramework extends MayaFramework {
  type: 'teaching_moment';
  elements: TeachingMomentElement[];
}

export interface InvitationFramework extends MayaFramework {
  type: 'invitation';
  elements: InvitationElement[];
}

export type StoryArcElement = MayaFrameworkElement & {
  phase: 'setup' | 'struggle' | 'solution' | 'success';
};

export type TeachingMomentElement = MayaFrameworkElement & {
  phase: 'observation' | 'insight' | 'application';
};

export type InvitationElement = MayaFrameworkElement & {
  phase: 'vision' | 'gap' | 'bridge';
};

// Supporting Enums and Types
export type OpeningApproach = 'direct' | 'warm' | 'question' | 'story' | 'statistic' | 'problem_statement';
export type BodyFramework = 'chronological' | 'problem_solution' | 'compare_contrast' | 'cause_effect' | 'priority_order';
export type ClosingStrategy = 'call_to_action' | 'summary' | 'forward_looking' | 'personal_note' | 'urgency_reminder';
export type CallToActionType = 'direct_request' | 'soft_suggestion' | 'multiple_options' | 'deadline_driven' | 'benefit_focused';

export type PersonalizationLevel = 'basic' | 'moderate' | 'advanced' | 'highly_personalized';
export type FieldType = 'text' | 'number' | 'date' | 'selection' | 'boolean' | 'array' | 'object';
export type ContentElement = 'opening' | 'body' | 'closing' | 'tone' | 'structure' | 'examples' | 'timing';
export type ModificationType = 'replace' | 'append' | 'prepend' | 'modify_tone' | 'adjust_length' | 'change_structure';

export type HintTrigger = 'time_spent' | 'error_count' | 'confidence_low' | 'completion_stalled' | 'user_request';
export type HintUrgency = 'low' | 'medium' | 'high' | 'critical';
export type HintTiming = 'immediate' | 'delayed' | 'on_request' | 'contextual' | 'scheduled';

export type TriggerAction = 'show_hint' | 'adjust_difficulty' | 'provide_example' | 'offer_alternative' | 'suggest_break';
export type ImplementationMethod = 'inline' | 'modal' | 'sidebar' | 'tooltip' | 'notification' | 'voice';
export type QualityImpact = 'none' | 'minimal' | 'moderate' | 'significant' | 'substantial';

export type ConfidenceImpact = 'slight' | 'moderate' | 'significant' | 'major' | 'transformative';
export type BoosterImplementation = 'visual' | 'audio' | 'text' | 'interactive' | 'social' | 'gamified';

export type SupportType = 'encouragement' | 'guidance' | 'alternative_approach' | 'stress_reduction' | 'skill_building';
export type SupportCondition = 'low_confidence' | 'high_stress' | 'time_pressure' | 'repeated_struggle' | 'user_request';
export type InterventionMethod = 'gentle_prompt' | 'structured_break' | 'alternative_path' | 'peer_support' | 'expert_guidance';
export type InterventionTiming = 'immediate' | 'after_attempt' | 'before_deadline' | 'on_schedule' | 'user_initiated';

export type MeasurementMethod = 'completion_rate' | 'time_to_complete' | 'confidence_score' | 'user_rating' | 'outcome_quality';

// Tone Guidelines
export interface ToneGuideline {
  aspect: ToneAspect;
  description: string;
  examples: string[];
  adaptiveRules: ToneAdaptation[];
}

export interface ToneAdaptation {
  condition: string;
  adjustment: ToneAdjustment;
  intensity: number;
}

export interface ToneAdjustment {
  direction: 'increase' | 'decrease' | 'maintain';
  aspect: ToneAspect;
  value: number;
}

export type ToneAspect = 'formality' | 'warmth' | 'urgency' | 'confidence' | 'empathy' | 'clarity' | 'enthusiasm';

// Message Priority
export interface MessagePriority {
  priority: number;
  content: string;
  conditions: PriorityCondition[];
  weight: number;
}

export interface PriorityCondition {
  attribute: string;
  value: any;
  operator: 'equals' | 'contains' | 'greater' | 'less';
}

// Adaptive Elements
export interface AdaptiveElement {
  name: string;
  description: string;
  adaptationRules: ElementAdaptationRule[];
  implementations: ElementImplementation[];
}

export interface ElementAdaptationRule {
  condition: string;
  modification: ElementModification;
  weight: number;
}

export interface ElementModification {
  type: 'content' | 'structure' | 'timing' | 'presentation';
  change: string;
  value: any;
}

export interface ElementImplementation {
  method: string;
  parameters: Record<string, any>;
  fallback: string;
}

// Path Selection and Branching
export interface PathSelection {
  selectedPath: ChoicePath;
  alternativePaths: ChoicePath[];
  selectionReason: string;
  confidence: number;
  adaptiveFactors: SelectionFactor[];
}

export interface SelectionFactor {
  factor: string;
  weight: number;
  impact: number;
  description: string;
}

// Branch Navigation
export interface BranchNavigation {
  currentPath: ChoicePath;
  availableBranches: BranchOption[];
  branchHistory: BranchHistoryEntry[];
  adaptiveRecommendations: BranchRecommendation[];
}

export interface BranchOption {
  choice: ChoicePoint;
  destination: ChoicePath;
  requirements: BranchRequirement[];
  benefits: string[];
  estimatedImpact: BranchImpact;
}

export interface ChoicePoint {
  id: string;
  title: string;
  description: string;
  options: ChoiceOption[];
  defaultOption: string;
  adaptiveLogic: AdaptiveLogic;
}

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  consequences: ChoiceConsequence[];
  requirements: string[];
}

export interface ChoiceConsequence {
  type: 'path_change' | 'content_modification' | 'execution_adjustment' | 'support_activation';
  description: string;
  impact: ConsequenceImpact;
}

export interface BranchRequirement {
  type: 'skill_level' | 'time_available' | 'confidence_level' | 'context_match';
  value: any;
  description: string;
}

export interface BranchImpact {
  timeChange: number;
  difficultyChange: number;
  confidenceChange: number;
  qualityChange: number;
}

export interface BranchHistoryEntry {
  timestamp: Date;
  fromPath: string;
  toPath: string;
  reason: string;
  outcome: BranchOutcome;
}

export interface BranchOutcome {
  success: boolean;
  satisfaction: number;
  timeActual: number;
  confidenceChange: number;
  learningGain: number;
}

export interface BranchRecommendation {
  targetPath: ChoicePath;
  reason: string;
  benefits: string[];
  requirements: string[];
  confidence: number;
  timing: RecommendationTiming;
}

export interface AdaptiveLogic {
  rules: LogicRule[];
  fallback: string;
  contextFactors: ContextFactor[];
}

export interface LogicRule {
  condition: string;
  action: string;
  weight: number;
  description: string;
}

export interface ContextFactor {
  name: string;
  value: any;
  weight: number;
  source: string;
}

export type ConsequenceImpact = 'minimal' | 'moderate' | 'significant' | 'major' | 'transformative';
export type RecommendationTiming = 'immediate' | 'next_step' | 'when_ready' | 'scheduled' | 'on_request';

// Dynamic Choice Engine Configuration
export interface DynamicChoiceConfig {
  adaptationSensitivity: number;
  branchingThreshold: number;
  personalizationLevel: PersonalizationLevel;
  contextualFactors: ContextualFactor[];
  learningFactors: LearningFactor[];
}

export interface ContextualFactor {
  name: string;
  weight: number;
  adaptiveRange: [number, number];
  description: string;
}

export interface LearningFactor {
  attribute: string;
  learningRate: number;
  decayRate: number;
  reinforcementThreshold: number;
}