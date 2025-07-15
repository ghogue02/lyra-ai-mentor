/**
 * LESSON GENERATION RULES ENGINE
 * System of Record for all content generation preferences
 * 
 * This file contains all the rules and preferences that govern
 * how AI generates lesson content, components, and experiences.
 * 
 * Updated through interactive Q&A sessions with Greg.
 */

export interface RulesEngineConfig {
  // Core Mission & Values
  mission: {
    primaryObjective: string;
    targetAudience: string;
    coreValue: string;
  };

  // Character Design Rules
  characters: {
    [key: string]: CharacterRules;
  };

  // Content Generation Rules
  contentGeneration: {
    narrativeStyle: NarrativeStyleRules;
    interactionRules: InteractionRules;
    progressionRules: ProgressionRules;
    aiGenerationRules: AIGenerationRules;
  };

  // UI/UX Design Rules
  designSystem: {
    visualIdentity: VisualIdentityRules;
    userExperience: UserExperienceRules;
    responsiveDesign: ResponsiveDesignRules;
  };

  // Quality & Testing Rules
  qualityAssurance: {
    testingRules: TestingRules;
    validationRules: ValidationRules;
    performanceRules: PerformanceRules;
  };

  // Integration Rules
  integrations: {
    progressTracking: ProgressTrackingRules;
    toolkitIntegration: ToolkitIntegrationRules;
    gamificationRules: GamificationRules;
  };
}

// Character-specific rules and personality traits
interface CharacterRules {
  name: string;
  role: string;
  expertise: string[];
  personality: {
    communicationStyle: string;
    emotionalTone: string;
    teachingApproach: string;
    motivationalStyle: string;
  };
  visualTheme: {
    primaryColor: string;
    secondaryColor: string;
    gradientClass: string;
    iconSet: string;
  };
  contentPreferences: {
    exampleTypes: string[];
    analogies: string[];
    realWorldContexts: string[];
    challengeTypes: string[];
  };
}

// Narrative and storytelling rules
interface NarrativeStyleRules {
  storyStructure: {
    introduction: string;
    conflictType: string;
    resolutionStyle: string;
    emotionalArc: string;
  };
  messagingRules: {
    typewriterSpeed: number;
    delayBetweenMessages: number;
    messageLength: 'short' | 'medium' | 'long';
    emotionalProgression: string[];
  };
  contextualFraming: {
    problemPresentation: string;
    solutionReveal: string;
    celebrationStyle: string;
    reflectionPrompts: string[];
  };
}

// Interactive element behavior rules
interface InteractionRules {
  engagementLevel: 'high' | 'medium' | 'low';
  feedbackTiming: 'immediate' | 'delayed' | 'end-of-stage';
  choicePresentation: 'buttons' | 'cards' | 'list' | 'visual';
  errorHandling: 'gentle-guidance' | 'immediate-correction' | 'learning-moment';
  progressVisibility: 'always-visible' | 'milestone-based' | 'hidden';
}

// Learning progression and difficulty rules
interface ProgressionRules {
  difficultyRamp: {
    startingLevel: 'absolute-beginner' | 'some-familiarity' | 'intermediate';
    progressionSpeed: 'gradual' | 'moderate' | 'accelerated';
    masteryThreshold: number; // percentage
    practiceRepetition: number;
  };
  scaffolding: {
    guidanceLevel: 'high-support' | 'moderate-support' | 'minimal-support';
    exampleQuantity: number;
    practiceVariations: number;
    assessmentFrequency: 'frequent' | 'milestone' | 'end-only';
  };
}

// AI content generation behavior rules
interface AIGenerationRules {
  contentStyle: {
    formalityLevel: 'conversational' | 'professional' | 'academic';
    analogyUsage: 'frequent' | 'moderate' | 'minimal';
    realWorldExamples: 'always' | 'when-helpful' | 'rarely';
    humorLevel: 'light' | 'moderate' | 'serious';
  };
  generationPriorities: {
    accuracy: number; // 1-10
    engagement: number; // 1-10
    practicality: number; // 1-10
    creativity: number; // 1-10
  };
  contentValidation: {
    factChecking: boolean;
    appropriatenessCheck: boolean;
    alignmentToObjectives: boolean;
    readabilityLevel: string;
  };
}

// Visual design and branding rules
interface VisualIdentityRules {
  brandConsistency: {
    colorPalette: string[];
    typography: string;
    iconStyle: string;
    imageStyle: string;
  };
  layoutPrinciples: {
    whitespaceUsage: 'generous' | 'moderate' | 'compact';
    visualHierarchy: 'clear' | 'subtle' | 'minimal';
    componentSpacing: string;
    borderRadius: string;
  };
  animations: {
    transitionSpeed: 'fast' | 'moderate' | 'slow';
    animationStyle: 'subtle' | 'moderate' | 'dynamic';
    motionPrinciples: string[];
  };
}

// User experience and interaction rules
interface UserExperienceRules {
  navigation: {
    backButtonBehavior: 'always-available' | 'stage-dependent' | 'disabled';
    progressSaving: 'auto-save' | 'manual-save' | 'checkpoint-save';
    exitConfirmation: boolean;
  };
  accessibility: {
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
    colorContrastCompliance: 'AA' | 'AAA';
    textScaling: boolean;
  };
  performanceExpectations: {
    loadTimeTarget: number; // milliseconds
    responsivenessPriority: 'speed' | 'smoothness' | 'both';
    offlineCapability: boolean;
  };
}

// Responsive design behavior rules
interface ResponsiveDesignRules {
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    largeDesktop: string;
  };
  layoutAdaptation: {
    mobileStrategy: 'stack' | 'collapse' | 'simplify';
    tabletStrategy: 'hybrid' | 'desktop-like' | 'mobile-like';
    contentPrioritization: string[];
  };
}

// Testing and validation rules
interface TestingRules {
  coverage: {
    unitTestCoverage: number; // percentage
    integrationTestCoverage: number; // percentage
    e2eTestCoverage: number; // percentage
  };
  testTypes: {
    userInteractionTests: boolean;
    accessibilityTests: boolean;
    performanceTests: boolean;
    visualRegressionTests: boolean;
  };
  automationLevel: 'full' | 'partial' | 'manual';
}

// Validation and quality control rules
interface ValidationRules {
  contentValidation: {
    spellingGrammarCheck: boolean;
    factualAccuracyCheck: boolean;
    brandVoiceConsistency: boolean;
    learningObjectiveAlignment: boolean;
  };
  technicalValidation: {
    codeQualityStandards: string[];
    performanceBenchmarks: { [key: string]: number };
    securityChecks: boolean;
    accessibilityCompliance: boolean;
  };
}

// Performance optimization rules
interface PerformanceRules {
  bundleOptimization: {
    codeSplitting: 'route-level' | 'component-level' | 'both';
    lazyLoading: 'aggressive' | 'moderate' | 'conservative';
    caching: 'aggressive' | 'standard' | 'minimal';
  };
  runtime: {
    memoryManagement: 'strict' | 'moderate' | 'relaxed';
    renderOptimization: 'react-memo' | 'manual' | 'none';
    stateManagement: 'context' | 'hooks' | 'external';
  };
}

// Progress tracking integration rules
interface ProgressTrackingRules {
  granularity: 'action-level' | 'stage-level' | 'lesson-level';
  pointsSystem: {
    pointsPerInteraction: number;
    bonusThresholds: { [key: string]: number };
    completionMultiplier: number;
  };
  persistenceRules: {
    saveFrequency: 'immediate' | 'batched' | 'manual';
    dataRetention: number; // days
    anonymization: boolean;
  };
}

// MyToolkit integration rules
interface ToolkitIntegrationRules {
  savingBehavior: {
    autoSuggestSave: boolean;
    requiredMetadata: string[];
    categoryMapping: { [key: string]: string };
  };
  contentFormat: {
    includeInstructions: boolean;
    includeExamples: boolean;
    includeReferences: boolean;
    exportFormats: string[];
  };
}

// Gamification system rules
interface GamificationRules {
  achievementRules: {
    unlockCriteria: { [key: string]: any };
    celebrationStyle: 'subtle' | 'moderate' | 'enthusiastic';
    progressVisibility: 'always' | 'milestone' | 'hidden';
  };
  motivationSystem: {
    encouragementFrequency: 'high' | 'moderate' | 'minimal';
    challengeRating: 'easy' | 'moderate' | 'challenging';
    competitiveElements: boolean;
  };
}

// CURRENT CONFIGURATION
// This gets updated through our Q&A sessions
export const CURRENT_RULES: RulesEngineConfig = {
  mission: {
    primaryObjective: "Help non-profit workers understand and leverage AI tools for their daily work",
    targetAudience: "Non-profit workers with limited AI experience",
    coreValue: "Practical, immediately applicable AI skills for social impact"
  },

  characters: {
    Maya: {
      name: "Maya Rodriguez",
      role: "Communication & Email Expert",
      expertise: ["Email composition", "Tone adaptation", "Professional communication", "Community engagement"],
      personality: {
        communicationStyle: "Warm and encouraging, speaks from experience",
        emotionalTone: "Empathetic and understanding of nonprofit challenges",
        teachingApproach: "Story-driven with real-world examples",
        motivationalStyle: "Celebrates small wins, acknowledges struggles"
      },
      visualTheme: {
        primaryColor: "#9333ea", // purple-600
        secondaryColor: "#ec4899", // pink-500
        gradientClass: "from-purple-600 to-pink-600",
        iconSet: "Heart, Mail, Users, MessageCircle"
      },
      contentPreferences: {
        exampleTypes: ["Thank you emails", "Program updates", "Volunteer coordination", "Donor communications"],
        analogies: ["Building bridges through words", "Communication as gardening", "Tone as clothing for thoughts"],
        realWorldContexts: ["Hope Gardens Community Center", "Volunteer management", "Parent communications"],
        challengeTypes: ["Difficult conversations", "Time-sensitive communications", "Multi-audience messaging"]
      }
    }
    // Other characters will be configured through Q&A
  },

  contentGeneration: {
    narrativeStyle: {
      storyStructure: {
        introduction: "Character-driven problem introduction",
        conflictType: "Real-world challenge from character's experience", 
        resolutionStyle: "Step-by-step solution with user participation",
        emotionalArc: "Struggle → Discovery → Mastery → Celebration"
      },
      messagingRules: {
        typewriterSpeed: 30, // milliseconds per character
        delayBetweenMessages: 1000, // milliseconds
        messageLength: 'medium',
        emotionalProgression: ["thoughtful", "encouraging", "excited", "proud"]
      },
      contextualFraming: {
        problemPresentation: "Through character's real struggle/failure",
        solutionReveal: "As breakthrough moment character discovered",
        celebrationStyle: "Acknowledging user's achievement alongside character's growth",
        reflectionPrompts: ["How does this apply to your work?", "What would you do differently?", "How will you remember this?"]
      }
    },

    interactionRules: {
      engagementLevel: 'high',
      feedbackTiming: 'immediate',
      choicePresentation: 'cards',
      errorHandling: 'learning-moment',
      progressVisibility: 'always-visible'
    },

    progressionRules: {
      difficultyRamp: {
        startingLevel: 'absolute-beginner',
        progressionSpeed: 'gradual',
        masteryThreshold: 80,
        practiceRepetition: 2
      },
      scaffolding: {
        guidanceLevel: 'high-support',
        exampleQuantity: 3,
        practiceVariations: 2,
        assessmentFrequency: 'milestone'
      }
    },

    aiGenerationRules: {
      contentStyle: {
        formalityLevel: 'conversational',
        analogyUsage: 'moderate',
        realWorldExamples: 'always',
        humorLevel: 'light'
      },
      generationPriorities: {
        accuracy: 9,
        engagement: 8,
        practicality: 10,
        creativity: 7
      },
      contentValidation: {
        factChecking: true,
        appropriatenessCheck: true,
        alignmentToObjectives: true,
        readabilityLevel: "8th grade"
      }
    }
  },

  designSystem: {
    visualIdentity: {
      brandConsistency: {
        colorPalette: ["#9333ea", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"],
        typography: "Inter, system fonts",
        iconStyle: "Lucide React - outline style",
        imageStyle: "Clean, minimal illustrations"
      },
      layoutPrinciples: {
        whitespaceUsage: 'generous',
        visualHierarchy: 'clear',
        componentSpacing: "space-y-6",
        borderRadius: "rounded-lg"
      },
      animations: {
        transitionSpeed: 'moderate',
        animationStyle: 'subtle',
        motionPrinciples: ["Purposeful", "Smooth", "Respectful of user preferences"]
      }
    },

    userExperience: {
      navigation: {
        backButtonBehavior: 'always-available',
        progressSaving: 'auto-save',
        exitConfirmation: true
      },
      accessibility: {
        keyboardNavigation: true,
        screenReaderSupport: true,
        colorContrastCompliance: 'AA',
        textScaling: true
      },
      performanceExpectations: {
        loadTimeTarget: 2000,
        responsivenessPriority: 'both',
        offlineCapability: false
      }
    },

    responsiveDesign: {
      breakpoints: {
        mobile: "640px",
        tablet: "768px", 
        desktop: "1024px",
        largeDesktop: "1280px"
      },
      layoutAdaptation: {
        mobileStrategy: 'stack',
        tabletStrategy: 'hybrid',
        contentPrioritization: ["Core interaction", "Progress tracking", "Navigation", "Secondary content"]
      }
    }
  },

  qualityAssurance: {
    testingRules: {
      coverage: {
        unitTestCoverage: 80,
        integrationTestCoverage: 70,
        e2eTestCoverage: 50
      },
      testTypes: {
        userInteractionTests: true,
        accessibilityTests: true,
        performanceTests: true,
        visualRegressionTests: false
      },
      automationLevel: 'full'
    },

    validationRules: {
      contentValidation: {
        spellingGrammarCheck: true,
        factualAccuracyCheck: true,
        brandVoiceConsistency: true,
        learningObjectiveAlignment: true
      },
      technicalValidation: {
        codeQualityStandards: ["TypeScript strict", "ESLint compliance", "React best practices"],
        performanceBenchmarks: { "load-time": 2000, "interaction-delay": 100 },
        securityChecks: true,
        accessibilityCompliance: true
      }
    },

    performanceRules: {
      bundleOptimization: {
        codeSplitting: 'component-level',
        lazyLoading: 'moderate',
        caching: 'standard'
      },
      runtime: {
        memoryManagement: 'moderate',
        renderOptimization: 'react-memo',
        stateManagement: 'hooks'
      }
    }
  },

  integrations: {
    progressTracking: {
      granularity: 'stage-level',
      pointsSystem: {
        pointsPerInteraction: 25,
        bonusThresholds: { "first-completion": 100, "perfect-score": 50 },
        completionMultiplier: 2
      },
      persistenceRules: {
        saveFrequency: 'immediate',
        dataRetention: 365,
        anonymization: false
      }
    },

    toolkitIntegration: {
      savingBehavior: {
        autoSuggestSave: true,
        requiredMetadata: ["chapter", "lesson", "character", "skill-type"],
        categoryMapping: { "email": "email", "communication": "email", "templates": "email" }
      },
      contentFormat: {
        includeInstructions: true,
        includeExamples: true,
        includeReferences: false,
        exportFormats: ["json", "markdown"]
      }
    },

    gamificationRules: {
      achievementRules: {
        unlockCriteria: { "lesson-completion": "complete all stages", "toolkit-save": "save to toolkit" },
        celebrationStyle: 'moderate',
        progressVisibility: 'always'
      },
      motivationSystem: {
        encouragementFrequency: 'moderate',
        challengeRating: 'moderate',
        competitiveElements: false
      }
    }
  }
};

// RULES ENGINE UPDATE SYSTEM
export class RulesEngineManager {
  private static instance: RulesEngineManager;
  private rules: RulesEngineConfig;

  constructor() {
    this.rules = { ...CURRENT_RULES };
  }

  static getInstance(): RulesEngineManager {
    if (!RulesEngineManager.instance) {
      RulesEngineManager.instance = new RulesEngineManager();
    }
    return RulesEngineManager.instance;
  }

  // Update specific rule category
  updateRules(category: keyof RulesEngineConfig, updates: Partial<any>): void {
    this.rules[category] = { ...this.rules[category], ...updates };
  }

  // Get current rules
  getRules(): RulesEngineConfig {
    return { ...this.rules };
  }

  // Get rules for specific category
  getCategoryRules<T extends keyof RulesEngineConfig>(category: T): RulesEngineConfig[T] {
    return this.rules[category];
  }

  // Validate rules completeness
  validateRules(): { isValid: boolean; missingRules: string[] } {
    const missingRules: string[] = [];
    
    // Add validation logic here
    // Check that all required rules are defined
    
    return {
      isValid: missingRules.length === 0,
      missingRules
    };
  }

  // Export rules for persistence
  exportRules(): string {
    return JSON.stringify(this.rules, null, 2);
  }

  // Import rules from saved state
  importRules(rulesJson: string): void {
    try {
      const importedRules = JSON.parse(rulesJson);
      this.rules = { ...this.rules, ...importedRules };
    } catch (error) {
      console.error('Failed to import rules:', error);
    }
  }
}

export default RulesEngineManager;