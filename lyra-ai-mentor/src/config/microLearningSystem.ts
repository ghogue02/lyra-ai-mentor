/**
 * MICRO-LEARNING SYSTEM CONFIGURATION
 * Updated approach: Granular, AI-powered micro-lessons with scaffolded learning
 */

export interface MicroLearningConfig {
  approach: 'micro-skills-based';
  aiPowered: true;
  noMockData: true;
  scoring: ScoringSystem;
  scaffolding: ScaffoldingSystem;
  toolkit: ToolkitSystem;
  contextPersonalization: ContextSystem;
}

export interface ScoringSystem {
  scale: '1-10';
  retryThreshold: 7.5;
  rubricMeasures: string[];
  skillTracking: boolean;
  progressIntegration: boolean;
}

export interface ScaffoldingSystem {
  progression: ['multiple-choice', 'fill-in-blank', 'guided-template', 'free-form-with-hints'];
  readinessDetection: 'ai-scoring-based';
  guidanceReduction: 'progressive';
}

export interface ToolkitSystem {
  saves: ['templates', 'best-responses', 'skills-checklists', 'scoring-history'];
  masteryTracking: boolean;
  skillGaps: boolean;
}

export interface ContextSystem {
  orgInput: boolean;
  webSearchContext?: boolean; // Optional if too complex
  stakeholderOptions: ['actual-input', 'scenario-based'];
  dynamicAdaptation: boolean;
}

export interface MicroLesson {
  id: string;
  title: string;
  skillFocus: string; // Single specific skill/concept
  character: string;
  aiIntegration: AIIntegrationConfig;
  scaffoldingStage: 'multiple-choice' | 'fill-in-blank' | 'guided-template' | 'free-form-with-hints';
  rubric: LessonRubric;
  context: LessonContext;
  prerequisites?: string[]; // Other micro-lessons needed first
  unlocks?: string[]; // Micro-lessons this enables
}

export interface UserAttempt {
  id: string;
  lessonId: string;
  userId: string;
  attempt: number;
  userResponse: string;
  aiGeneratedOutput?: string;
  scores: AttemptScores;
  feedback: string[];
  passed: boolean;
  timestamp: Date;
  scaffoldingLevel: string;
}

export interface AttemptScores {
  overall: number;
  criteria: Record<string, number>;
  needsRetry: boolean;
  readyForNext: boolean;
}

export interface UserContext {
  organizationName?: string;
  organizationType?: string;
  role?: string;
  stakeholders?: string[];
  currentSkillLevel?: Record<string, number>;
}

export interface AIIntegrationConfig {
  primaryTool: 'prompting' | 'data-analysis' | 'automation-builder' | 'voice-interface';
  aiModel: 'openai-gpt4o';
  realTimeGeneration: true;
  userAIInteraction: 'collaborative-problem-solving';
  outputGeneration: true;
}

export interface LessonRubric {
  criteria: RubricCriterion[];
  passingScore: 7.5;
  retryRequired: boolean;
  skillSpecific: boolean;
}

export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
  measurement: 'quality-assessment' | 'deterministic-output' | 'prompt-effectiveness';
}

export interface LessonContext {
  orgPersonalization: boolean;
  stakeholderType: 'actual' | 'scenario';
  realWorldApplication: string;
  nonprofitFocus: boolean;
}

// Example Micro-Lessons Configuration
export const MICRO_LEARNING_EXAMPLES: MicroLesson[] = [
  {
    id: 'maya_subject_line_mastery',
    title: 'Email Subject Line Mastery',
    skillFocus: 'Writing compelling, action-oriented email subject lines',
    character: 'Maya',
    aiIntegration: {
      primaryTool: 'prompting',
      aiModel: 'openai-gpt4o',
      realTimeGeneration: true,
      userAIInteraction: 'collaborative-problem-solving',
      outputGeneration: true
    },
    scaffoldingStage: 'multiple-choice',
    rubric: {
      criteria: [
        {
          name: 'Clarity',
          description: 'Subject line clearly indicates email purpose',
          weight: 0.3,
          measurement: 'quality-assessment'
        },
        {
          name: 'Action Orientation',
          description: 'Encourages recipient to open and read',
          weight: 0.3,
          measurement: 'quality-assessment'
        },
        {
          name: 'Professional Tone',
          description: 'Appropriate for nonprofit stakeholder communication',
          weight: 0.2,
          measurement: 'quality-assessment'
        },
        {
          name: 'Brevity',
          description: 'Concise while being informative',
          weight: 0.2,
          measurement: 'deterministic-output'
        }
      ],
      passingScore: 7.5,
      retryRequired: true,
      skillSpecific: true
    },
    context: {
      orgPersonalization: true,
      stakeholderType: 'actual',
      realWorldApplication: 'Donor communication, board updates, volunteer coordination',
      nonprofitFocus: true
    }
  },
  
  {
    id: 'david_data_question_crafting',
    title: 'AI Data Analysis Question Crafting',
    skillFocus: 'Writing effective prompts to get AI to analyze nonprofit data',
    character: 'David',
    aiIntegration: {
      primaryTool: 'data-analysis',
      aiModel: 'openai-gpt4o',
      realTimeGeneration: true,
      userAIInteraction: 'collaborative-problem-solving',
      outputGeneration: true
    },
    scaffoldingStage: 'fill-in-blank',
    rubric: {
      criteria: [
        {
          name: 'Specificity',
          description: 'Question targets specific data insights needed',
          weight: 0.4,
          measurement: 'quality-assessment'
        },
        {
          name: 'Actionability',
          description: 'Results will inform concrete decisions',
          weight: 0.3,
          measurement: 'quality-assessment'
        },
        {
          name: 'AI Understanding',
          description: 'Prompt is clear enough for AI to process effectively',
          weight: 0.3,
          measurement: 'deterministic-output'
        }
      ],
      passingScore: 7.5,
      retryRequired: true,
      skillSpecific: true
    },
    context: {
      orgPersonalization: true,
      stakeholderType: 'scenario',
      realWorldApplication: 'Program evaluation, donor analysis, impact measurement',
      nonprofitFocus: true
    },
    prerequisites: ['basic_prompt_structure']
  }
];

export const RUBRIC_GUIDELINES = {
  scoring: {
    '9-10': 'Exceptional - Ready for advanced practice',
    '7.5-8.9': 'Proficient - Can proceed to next micro-lesson',
    '6-7.4': 'Developing - Retry required with hints',
    'Below 6': 'Retry required with additional scaffolding'
  },
  
  measurements: {
    'quality-assessment': 'AI evaluates against rubric criteria using natural language processing',
    'deterministic-output': 'Specific measurable criteria (length, structure, includes required elements)',
    'prompt-effectiveness': 'AI tests the user\'s prompt and measures output quality'
  },
  
  retryGuidance: {
    belowThreshold: 'Provide specific feedback on each rubric criterion that fell short',
    scaffoldingIncrease: 'Offer more structured guidance for retry attempt',
    hintProgression: 'Progressive hints that don\'t give away the answer'
  }
};

export default MicroLearningConfig;