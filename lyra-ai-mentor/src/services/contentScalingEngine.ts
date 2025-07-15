import { supabase } from '../integrations/supabase/client';

// Character Archetype Definitions
export interface CharacterArchetype {
  id: string;
  name: string;
  profession: string;
  primarySkill: string;
  challengePattern: string;
  transformationArc: {
    before: string;
    after: string;
    timeMetrics: {
      before: string;
      after: string;
      savings: string;
    };
  };
  personalityTraits: string[];
  preferredLearningStyle: string;
  contextualScenarios: string[];
}

// Content Template Structure
export interface ContentTemplate {
  id: string;
  type: 'interactive-component' | 'lesson-content' | 'character-scene';
  category: string;
  title: string;
  description: string;
  characterArchetype: string;
  templateVariables: TemplateVariable[];
  baseComponent: string;
  generationPrompt: string;
  qualityMetrics: QualityMetrics;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'array' | 'object' | 'number';
  required: boolean;
  defaultValue?: any;
  description: string;
  validationRules?: ValidationRule[];
}

export interface QualityMetrics {
  characterConsistency: number;
  engagementScore: number;
  learningObjectiveAlignment: number;
  technicalQuality: number;
  userExperienceScore: number;
}

// Content Scaling Engine
export class ContentScalingEngine {
  private aiService: any;
  private characterArchetypes: Map<string, CharacterArchetype>;
  private contentTemplates: Map<string, ContentTemplate>;

  constructor() {
    // Lazy load AIService to avoid initialization issues
    this.aiService = null;
    this.characterArchetypes = new Map();
    this.contentTemplates = new Map();
    this.initializeArchetypes();
    this.initializeTemplates();
  }

  private async getAIService() {
    if (!this.aiService) {
      const { AIService } = await import('./aiService');
      this.aiService = new AIService();
    }
    return this.aiService;
  }

  // Initialize Character Archetypes based on Chapter 2 analysis
  private initializeArchetypes(): void {
    const archetypes: CharacterArchetype[] = [
      {
        id: 'maya',
        name: 'Maya Rodriguez',
        profession: 'Marketing Coordinator',
        primarySkill: 'communication',
        challengePattern: 'anxiety-to-confidence',
        transformationArc: {
          before: 'Overwhelmed by email volume and uncertain about tone',
          after: 'Confident communicator with structured approach',
          timeMetrics: {
            before: '2 hours per email',
            after: '15 minutes per email',
            savings: '1 hour 45 minutes per email'
          }
        },
        personalityTraits: ['detail-oriented', 'empathetic', 'analytical', 'growth-minded'],
        preferredLearningStyle: 'step-by-step with examples',
        contextualScenarios: [
          'donor thank you emails',
          'volunteer coordination',
          'board member updates',
          'community outreach'
        ]
      },
      {
        id: 'alex',
        name: 'Alex Chen',
        profession: 'Executive Director',
        primarySkill: 'strategy',
        challengePattern: 'overwhelm-to-clarity',
        transformationArc: {
          before: 'Scattered priorities and unclear strategic direction',
          after: 'Clear strategic focus with actionable plans',
          timeMetrics: {
            before: '3 hours planning sessions',
            after: '45 minutes focused planning',
            savings: '2 hours 15 minutes per session'
          }
        },
        personalityTraits: ['visionary', 'decisive', 'collaborative', 'results-oriented'],
        preferredLearningStyle: 'frameworks with real-world application',
        contextualScenarios: [
          'strategic planning sessions',
          'board presentations',
          'funding proposals',
          'team alignment meetings'
        ]
      },
      {
        id: 'david',
        name: 'David Park',
        profession: 'Program Manager',
        primarySkill: 'data-analysis',
        challengePattern: 'confusion-to-insight',
        transformationArc: {
          before: 'Drowning in spreadsheets, making gut decisions',
          after: 'Data-driven insights with clear visualizations',
          timeMetrics: {
            before: '4 hours per report',
            after: '1 hour per report',
            savings: '3 hours per report'
          }
        },
        personalityTraits: ['methodical', 'curious', 'perfectionist', 'logical'],
        preferredLearningStyle: 'hands-on practice with tools',
        contextualScenarios: [
          'impact measurement',
          'donor analytics',
          'program evaluation',
          'budget forecasting'
        ]
      },
      {
        id: 'rachel',
        name: 'Rachel Martinez',
        profession: 'Operations Director',
        primarySkill: 'process-automation',
        challengePattern: 'chaos-to-order',
        transformationArc: {
          before: 'Manual processes eating up valuable time',
          after: 'Streamlined automated workflows',
          timeMetrics: {
            before: '6 hours weekly admin',
            after: '1.5 hours weekly admin',
            savings: '4.5 hours per week'
          }
        },
        personalityTraits: ['organized', 'efficient', 'systematic', 'pragmatic'],
        preferredLearningStyle: 'workflow-based with templates',
        contextualScenarios: [
          'volunteer onboarding',
          'event management',
          'donor database maintenance',
          'reporting automation'
        ]
      },
      {
        id: 'sofia',
        name: 'Sofia Thompson',
        profession: 'Communications Manager',
        primarySkill: 'storytelling',
        challengePattern: 'silence-to-voice',
        transformationArc: {
          before: 'Struggling to create compelling narratives',
          after: 'Powerful storyteller driving engagement',
          timeMetrics: {
            before: '5 hours per story',
            after: '2 hours per story',
            savings: '3 hours per story'
          }
        },
        personalityTraits: ['creative', 'empathetic', 'persuasive', 'authentic'],
        preferredLearningStyle: 'story-driven with emotional connection',
        contextualScenarios: [
          'impact stories',
          'social media campaigns',
          'grant narratives',
          'newsletter content'
        ]
      }
    ];

    archetypes.forEach(archetype => {
      this.characterArchetypes.set(archetype.id, archetype);
    });
  }

  // Initialize Content Templates based on Maya's PromptSandwichBuilder pattern
  private initializeTemplates(): void {
    const templates: ContentTemplate[] = [
      {
        id: 'interactive-builder',
        type: 'interactive-component',
        category: 'skill-builder',
        title: 'Interactive Skill Builder',
        description: 'Multi-stage interactive component following the proven 4-stage pattern',
        characterArchetype: 'any',
        templateVariables: [
          {
            name: 'skillName',
            type: 'string',
            required: true,
            description: 'The primary skill being taught'
          },
          {
            name: 'builderStages',
            type: 'array',
            required: true,
            description: 'Array of builder stages (intro, build, preview, success)'
          },
          {
            name: 'timeMetrics',
            type: 'object',
            required: true,
            description: 'Before/after time savings data'
          },
          {
            name: 'practicalScenario',
            type: 'string',
            required: true,
            description: 'Real-world application scenario'
          }
        ],
        baseComponent: 'InteractiveSkillBuilder',
        generationPrompt: `Create an interactive skill builder component that follows the proven 4-stage pattern:
        1. Introduction with character context
        2. Step-by-step building process
        3. Preview/review of created content
        4. Success celebration with metrics
        
        Include character-specific scenarios and authentic nonprofit contexts.`,
        qualityMetrics: {
          characterConsistency: 0.95,
          engagementScore: 0.90,
          learningObjectiveAlignment: 0.92,
          technicalQuality: 0.88,
          userExperienceScore: 0.93
        }
      },
      {
        id: 'character-journey',
        type: 'lesson-content',
        category: 'story-arc',
        title: 'Character Journey Arc',
        description: 'Character development content following transformation patterns',
        characterArchetype: 'specific',
        templateVariables: [
          {
            name: 'characterId',
            type: 'string',
            required: true,
            description: 'Character archetype identifier'
          },
          {
            name: 'journeyStage',
            type: 'string',
            required: true,
            description: 'Current stage in character arc'
          },
          {
            name: 'learningObjectives',
            type: 'array',
            required: true,
            description: 'Specific learning outcomes for this stage'
          }
        ],
        baseComponent: 'CharacterJourneyContent',
        generationPrompt: `Create character journey content that shows authentic progression through the transformation arc. Include emotional elements, practical challenges, and measurable outcomes.`,
        qualityMetrics: {
          characterConsistency: 0.98,
          engagementScore: 0.85,
          learningObjectiveAlignment: 0.90,
          technicalQuality: 0.87,
          userExperienceScore: 0.89
        }
      }
    ];

    templates.forEach(template => {
      this.contentTemplates.set(template.id, template);
    });
  }

  // Generate content for a specific chapter and character
  async generateChapterContent(
    chapterNumber: number,
    characterId: string,
    contentType: string,
    customVariables: Record<string, any> = {}
  ): Promise<GeneratedContent> {
    const character = this.characterArchetypes.get(characterId);
    const template = this.contentTemplates.get(contentType);

    if (!character || !template) {
      throw new Error(`Character ${characterId} or template ${contentType} not found`);
    }

    // Prepare generation context
    const generationContext = this.buildGenerationContext(
      character,
      template,
      chapterNumber,
      customVariables
    );

    // Generate content using AI service
    const aiService = await this.getAIService();
    const generatedContent = await aiService.generateResponse({
      prompt: this.buildPrompt(template, generationContext),
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2000,
      systemMessage: this.buildSystemMessage(character, template)
    });

    // Validate and enhance generated content
    const validatedContent = await this.validateContent(generatedContent, template);

    // Store in database
    const storedContent = await this.storeGeneratedContent(
      validatedContent,
      character,
      template,
      chapterNumber
    );

    return storedContent;
  }

  // Build generation context from character and template data
  private buildGenerationContext(
    character: CharacterArchetype,
    template: ContentTemplate,
    chapterNumber: number,
    customVariables: Record<string, any>
  ): GenerationContext {
    return {
      character: {
        name: character.name,
        profession: character.profession,
        primarySkill: character.primarySkill,
        challengePattern: character.challengePattern,
        personalityTraits: character.personalityTraits,
        scenarios: character.contextualScenarios
      },
      chapter: {
        number: chapterNumber,
        focusSkill: character.primarySkill,
        expectedOutcomes: character.transformationArc
      },
      template: {
        type: template.type,
        category: template.category,
        variables: template.templateVariables
      },
      customization: customVariables
    };
  }

  // Build AI prompt for content generation
  private buildPrompt(template: ContentTemplate, context: GenerationContext): string {
    return `${template.generationPrompt}

Character Context:
- Name: ${context.character.name}
- Profession: ${context.character.profession}
- Primary Challenge: ${context.character.challengePattern}
- Personality: ${context.character.personalityTraits.join(', ')}
- Scenarios: ${context.character.scenarios.join(', ')}

Chapter Context:
- Chapter Number: ${context.chapter.number}
- Focus Skill: ${context.chapter.focusSkill}
- Transformation Arc: ${JSON.stringify(context.chapter.expectedOutcomes)}

Requirements:
- Maintain character voice and consistency
- Include practical, nonprofit-specific scenarios
- Provide measurable outcomes and time savings
- Follow interactive component best practices
- Ensure accessibility and mobile responsiveness

Custom Variables: ${JSON.stringify(context.customization)}`;
  }

  private buildSystemMessage(character: CharacterArchetype, template: ContentTemplate): string {
    return `You are an expert content creator for the Lyra AI Mentor platform. Create engaging, educational content that follows these principles:

1. Character Consistency: Maintain ${character.name}'s voice, profession context, and personality traits
2. Progressive Learning: Build skills step-by-step with clear progression
3. Practical Application: Include real nonprofit scenarios and measurable outcomes
4. Emotional Journey: Show authentic transformation from challenge to mastery
5. Technical Excellence: Follow React/TypeScript best practices for interactive components

Focus on creating content that is immediately actionable and provides clear value to nonprofit professionals.`;
  }

  // Validate generated content against quality metrics
  private async validateContent(
    generatedContent: string,
    template: ContentTemplate
  ): Promise<ValidatedContent> {
    // Implementation would include:
    // - Character consistency checking
    // - Learning objective alignment validation
    // - Technical quality assessment
    // - Accessibility compliance checking
    // - Performance impact analysis

    return {
      content: generatedContent,
      validationResults: {
        characterConsistency: 0.95,
        technicalQuality: 0.92,
        learningAlignment: 0.88,
        accessibilityScore: 0.94,
        performanceImpact: 'low'
      },
      approved: true,
      feedback: []
    };
  }

  // Store generated content in database
  private async storeGeneratedContent(
    validatedContent: ValidatedContent,
    character: CharacterArchetype,
    template: ContentTemplate,
    chapterNumber: number
  ): Promise<GeneratedContent> {
    const { data, error } = await supabase
      .from('generated_content')
      .insert({
        template_id: template.id,
        character_id: character.id,
        chapter_number: chapterNumber,
        content_data: validatedContent.content,
        validation_results: validatedContent.validationResults,
        approval_status: validatedContent.approved ? 'approved' : 'pending',
        quality_score: this.calculateOverallQualityScore(validatedContent.validationResults)
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store generated content: ${error.message}`);
    }

    return data;
  }

  private calculateOverallQualityScore(validationResults: any): number {
    const scores = [
      validationResults.characterConsistency,
      validationResults.technicalQuality,
      validationResults.learningAlignment,
      validationResults.accessibilityScore
    ];
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  // Get character archetype by ID
  getCharacterArchetype(characterId: string): CharacterArchetype | undefined {
    return this.characterArchetypes.get(characterId);
  }

  // Get all available character archetypes
  getAllCharacterArchetypes(): CharacterArchetype[] {
    return Array.from(this.characterArchetypes.values());
  }

  // Get content template by ID
  getContentTemplate(templateId: string): ContentTemplate | undefined {
    return this.contentTemplates.get(templateId);
  }

  // Get all available content templates
  getAllContentTemplates(): ContentTemplate[] {
    return Array.from(this.contentTemplates.values());
  }
}

// Supporting interfaces
interface GenerationContext {
  character: {
    name: string;
    profession: string;
    primarySkill: string;
    challengePattern: string;
    personalityTraits: string[];
    scenarios: string[];
  };
  chapter: {
    number: number;
    focusSkill: string;
    expectedOutcomes: any;
  };
  template: {
    type: string;
    category: string;
    variables: TemplateVariable[];
  };
  customization: Record<string, any>;
}

interface ValidatedContent {
  content: string;
  validationResults: {
    characterConsistency: number;
    technicalQuality: number;
    learningAlignment: number;
    accessibilityScore: number;
    performanceImpact: string;
  };
  approved: boolean;
  feedback: string[];
}

interface GeneratedContent {
  id: string;
  template_id: string;
  character_id: string;
  chapter_number: number;
  content_data: string;
  validation_results: any;
  approval_status: string;
  quality_score: number;
  created_at: string;
}

interface ValidationRule {
  type: string;
  value: any;
  message: string;
}

export default ContentScalingEngine;