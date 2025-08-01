import React from 'react';
import { 
  Target, 
  Users, 
  MessageCircle, 
  Sparkles, 
  FileText, 
  Heart, 
  Clock, 
  AlertTriangle,
  Zap,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { LessonContext } from '../ContextualLyraChat';

export interface MayaJourneyState {
  completedStages: string[];
  currentStage: string;
  paceFrameworkProgress: {
    purpose: boolean;
    audience: boolean; 
    context: boolean;
    execution: boolean;
  };
  templateLibraryProgress: number;
  donorSegmentationComplete: boolean;
}

export interface ContextualQuestion {
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  priority: 'high' | 'medium' | 'low';
  paceComponent?: 'Purpose' | 'Audience' | 'Context' | 'Execution';
  availableAfter?: string;
  contextualDepth: 'comprehensive' | 'practical' | 'tactical';
  toolRecommendations?: string[];
}

/**
 * Get Maya-specific contextual questions based on lesson progress and PACE framework
 */
export const getMayaContextualQuestions = (
  lessonContext: LessonContext, 
  mayaProgress: MayaJourneyState
): ContextualQuestion[] => {
  
  // PACE Framework - Purpose Questions
  const purposeQuestions: ContextualQuestion[] = [
    {
      id: 'maya-pace-purpose',
      text: "How does Maya identify the real purpose behind her emails?",
      icon: Target,
      category: 'PACE Framework - Purpose',
      priority: 'high',
      paceComponent: 'Purpose',
      availableAfter: 'pace-introduction',
      contextualDepth: 'comprehensive'
    },
    {
      id: 'donor-communication-goals',
      text: "What should my main goals be when communicating with donors like Maya?",
      icon: Heart,
      category: 'Donor Relations',
      priority: 'high',
      paceComponent: 'Purpose',
      contextualDepth: 'practical'
    },
    {
      id: 'email-purpose-clarity',
      text: "How can I make my email purposes as clear as Maya's?",
      icon: Lightbulb,
      category: 'Purpose Identification',
      priority: 'high',
      paceComponent: 'Purpose',
      contextualDepth: 'tactical'
    }
  ];

  // PACE Framework - Audience Questions  
  const audienceQuestions: ContextualQuestion[] = [
    {
      id: 'maya-donor-segmentation',
      text: "How does Maya segment her donors for better communication?",
      icon: Users,
      category: 'PACE Framework - Audience',
      priority: 'high',
      paceComponent: 'Audience',
      availableAfter: 'audience-analysis-stage',
      contextualDepth: 'comprehensive'
    },
    {
      id: 'volunteer-vs-donor-messaging',
      text: "How should I communicate differently with volunteers vs. donors like Maya does?",
      icon: Users,
      category: 'Audience Adaptation',
      priority: 'high',
      paceComponent: 'Audience',
      contextualDepth: 'practical'
    },
    {
      id: 'audience-persona-development',
      text: "Can you help me create donor personas like Maya uses at Hope Gardens?",
      icon: Users,
      category: 'Persona Development',
      priority: 'medium',
      paceComponent: 'Audience',
      contextualDepth: 'tactical'
    }
  ];

  // PACE Framework - Context Questions
  const contextQuestions: ContextualQuestion[] = [
    {
      id: 'maya-crisis-communication',
      text: "How does Maya handle crisis communication at Hope Gardens?",
      icon: AlertTriangle,
      category: 'PACE Framework - Context',
      priority: 'high',
      paceComponent: 'Context',
      availableAfter: 'crisis-communication-scenario',
      contextualDepth: 'comprehensive'
    },
    {
      id: 'timing-optimization',
      text: "When does Maya send different types of emails for best results?",
      icon: Clock,
      category: 'Timing Strategy',
      priority: 'medium',
      paceComponent: 'Context',
      contextualDepth: 'practical'
    },
    {
      id: 'situational-adaptation',
      text: "How does Maya adapt her messaging based on current events?",
      icon: MessageCircle,
      category: 'Contextual Adaptation',
      priority: 'medium',
      paceComponent: 'Context',
      contextualDepth: 'tactical'
    }
  ];

  // PACE Framework - Execution Questions
  const executionQuestions: ContextualQuestion[] = [
    {
      id: 'maya-ai-email-tools',
      text: "Which AI tools does Maya use for nonprofit email writing?",
      icon: Zap,
      category: 'PACE Framework - Execution',
      priority: 'high',
      paceComponent: 'Execution',
      contextualDepth: 'practical',
      toolRecommendations: ['ChatGPT', 'Claude', 'Jasper', 'Copy.ai']
    },
    {
      id: 'maya-template-creation',
      text: "How does Maya create her effective email templates?",
      icon: FileText,
      category: 'Template Development',
      priority: 'high',
      paceComponent: 'Execution',
      availableAfter: 'template-discovery',
      contextualDepth: 'comprehensive'
    },
    {
      id: 'maya-personalization-scale',
      text: "How does Maya personalize emails at scale?",
      icon: Sparkles,
      category: 'Personalization',
      priority: 'medium',
      paceComponent: 'Execution',
      availableAfter: 'personalization-challenge',
      contextualDepth: 'tactical'
    }
  ];

  // Email Communication Mastery Questions
  const emailMasteryQuestions: ContextualQuestion[] = [
    {
      id: 'donor-thankyou-strategy',
      text: "Can you show me Maya's donor thank-you email strategy?",
      icon: Heart,
      category: 'Email Templates',
      priority: 'high',
      contextualDepth: 'practical'
    },
    {
      id: 'volunteer-recruitment-messaging',
      text: "How does Maya write compelling volunteer recruitment emails?",
      icon: Users,
      category: 'Volunteer Communication',
      priority: 'high', 
      contextualDepth: 'practical'
    },
    {
      id: 'program-update-communications',
      text: "What's Maya's approach to program update emails?",
      icon: BookOpen,
      category: 'Program Communication',
      priority: 'medium',
      contextualDepth: 'tactical'
    }
  ];

  // Combine all question sets
  const allQuestions = [
    ...purposeQuestions,
    ...audienceQuestions, 
    ...contextQuestions,
    ...executionQuestions,
    ...emailMasteryQuestions
  ];

  // Filter questions based on Maya's journey progress
  const availableQuestions = allQuestions.filter(question => {
    // Always show questions without availability requirements
    if (!question.availableAfter) return true;
    
    // Check if the required stage has been completed
    return mayaProgress.completedStages.includes(question.availableAfter);
  });

  // Sort by priority and relevance
  return availableQuestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

/**
 * Get stage-specific questions for Maya's journey stages
 */
export const getStageSpecificQuestions = (stageId: string): ContextualQuestion[] => {
  const stageQuestionMap: Record<string, ContextualQuestion[]> = {
    'purpose-identification': [
      {
        id: 'stage-purpose-help',
        text: "I'm struggling to identify my email's purpose like Maya did. Can you help?",
        icon: Target,
        category: 'Stage Support',
        priority: 'high',
        contextualDepth: 'practical'
      }
    ],
    'audience-analysis': [
      {
        id: 'stage-audience-help',
        text: "How do I analyze my audience like Maya learned to do?",
        icon: Users,
        category: 'Stage Support', 
        priority: 'high',
        contextualDepth: 'practical'
      }
    ],
    'template-creation': [
      {
        id: 'stage-template-help',
        text: "Can you walk me through Maya's template creation process?",
        icon: FileText,
        category: 'Stage Support',
        priority: 'high',
        contextualDepth: 'comprehensive'
      }
    ]
  };

  return stageQuestionMap[stageId] || [];
};

/**
 * Maya character response patterns for contextual chat
 */
export const mayaChatResponseSystem = {
  characterContext: {
    name: "Maya Rodriguez",
    role: "Email Communication Specialist", 
    organization: "Hope Gardens Community Center",
    expertise: ["PACE Framework", "Donor Communication", "Email Templates", "Nonprofit Outreach"],
    personality: "warm, practical, solutions-oriented, empathetic",
    background: "Transformed from email overwhelm to systematic communication mastery"
  },
  
  responsePatterns: {
    paceFramework: {
      structure: "First explain the PACE component, then show Maya's real example from Hope Gardens, finally provide actionable steps",
      tone: "encouraging and practical", 
      examples: "always include Hope Gardens context and realistic nonprofit scenarios"
    },
    donorCommunication: {
      structure: "Acknowledge the challenge, reference Maya's similar experience, provide specific strategies with examples",
      tone: "empathetic and professional",
      examples: "use diverse donor types (major donors, recurring donors, first-time donors)"
    },
    templateCreation: {
      structure: "Show Maya's template philosophy, provide template structure, include customization tips",
      tone: "systematic yet creative",
      examples: "include merge fields and personalization strategies"
    },
    crisisCommunication: {
      structure: "Emphasize transparency and empathy, reference Hope Gardens crisis example, provide framework",
      tone: "calm, transparent, and compassionate", 
      examples: "realistic nonprofit crisis scenarios with ethical considerations"
    }
  },
  
  contextualPrompts: {
    hopeGardensReferences: [
      "At Hope Gardens Community Center, Maya learned that...",
      "When Maya faced this challenge at Hope Gardens, she...", 
      "Maya's experience with Hope Gardens donors taught her...",
      "The PACE framework helped Maya transform Hope Gardens' communications by..."
    ],
    encouragementPhrases: [
      "You're asking the right questions, just like Maya did when she started.",
      "Maya struggled with this too - here's how she overcame it:",
      "This is exactly the kind of strategic thinking that made Maya successful:",
      "Maya would encourage you to..."
    ]
  }
};