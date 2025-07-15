export interface RachelPersonality {
  name: string;
  role: string;
  expertise: string[];
  background: string;
  currentFocus: string;
  communicationStyle: string;
  creativePhilosophy: string;
  favoriteTools: string[];
  inspiration: string[];
}

export interface StorytellingFramework {
  structure: string[];
  elements: string[];
  techniques: string[];
  applications: string[];
}

export interface BrandVoice {
  tone: string;
  personality: string[];
  values: string[];
  audience: string;
  messaging: string[];
  examples: string[];
}

export interface CreativeProject {
  id: string;
  title: string;
  type: 'story' | 'brand' | 'campaign' | 'content';
  description: string;
  objectives: string[];
  targetAudience: string;
  brandVoice: BrandVoice;
  status: 'planning' | 'development' | 'review' | 'completed';
  timeline: string;
  deliverables: string[];
}

export interface WorkshopActivity {
  id: string;
  title: string;
  type: 'individual' | 'collaborative' | 'presentation';
  duration: string;
  description: string;
  materials: string[];
  steps: string[];
  outcomes: string[];
}

export interface PACEStorytellingConfig {
  preview: {
    title: string;
    description: string;
    objectives: string[];
    estimatedTime: string;
  };
  analyze: {
    title: string;
    description: string;
    activities: WorkshopActivity[];
    reflectionQuestions: string[];
  };
  create: {
    title: string;
    description: string;
    projects: CreativeProject[];
    templates: string[];
  };
  evaluate: {
    title: string;
    description: string;
    criteria: string[];
    feedbackMethods: string[];
  };
}

export interface RachelLessonConfig {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  materials: string[];
  pace: PACEStorytellingConfig;
  rachelInsights: string[];
  practicalApplications: string[];
  successMetrics: string[];
}