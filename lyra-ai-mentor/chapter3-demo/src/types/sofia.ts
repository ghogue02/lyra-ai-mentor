export interface SofiaCharacter {
  name: string;
  role: string;
  expertise: string[];
  personality: {
    traits: string[];
    communication_style: string;
    teaching_approach: string;
  };
  background: {
    story: string;
    challenges_overcome: string[];
    achievements: string[];
  };
  voice_characteristics: {
    tone: string;
    pace: string;
    emphasis: string[];
  };
}

export interface VoiceExercise {
  id: string;
  name: string;
  type: 'breathing' | 'vocal_warm_up' | 'projection' | 'articulation' | 'resonance';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  common_mistakes: string[];
}

export interface PresentationScenario {
  id: string;
  title: string;
  context: string;
  audience_type: string;
  challenges: string[];
  solutions: string[];
  sofia_guidance: string[];
}

export interface ConfidenceActivity {
  id: string;
  name: string;
  category: 'mindset' | 'practice' | 'technique' | 'reflection';
  description: string;
  steps: string[];
  expected_outcome: string;
  sofia_encouragement: string;
}

export interface SofiaLesson {
  id: string;
  title: string;
  objective: string;
  duration: number;
  sections: {
    introduction: {
      sofia_welcome: string;
      lesson_overview: string;
    };
    main_content: {
      theory: string[];
      exercises: VoiceExercise[];
      scenarios?: PresentationScenario[];
    };
    practice: {
      activities: ConfidenceActivity[];
      reflection_questions: string[];
    };
    conclusion: {
      sofia_summary: string;
      key_takeaways: string[];
      next_steps: string;
    };
  };
}

export interface SofiaWorkshop {
  id: string;
  title: string;
  focus_area: string;
  duration: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  modules: {
    id: string;
    title: string;
    content: string;
    exercises: VoiceExercise[];
    practice_scenarios: PresentationScenario[];
  }[];
  sofia_coaching_tips: string[];
}

export interface PACEIntegration {
  pace_assessment: {
    current_skill_level: string;
    learning_preferences: string[];
    confidence_areas: string[];
  };
  adaptive_content: {
    beginner_path: string[];
    intermediate_path: string[];
    advanced_path: string[];
  };
  choice_points: {
    id: string;
    question: string;
    options: {
      text: string;
      leads_to: string;
      sofia_response: string;
    }[];
  }[];
  encouragement_system: {
    milestones: string[];
    celebration_messages: string[];
    support_messages: string[];
  };
}