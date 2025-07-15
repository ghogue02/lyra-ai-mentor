import ContentScalingEngine, { CharacterArchetype, ContentTemplate } from './contentScalingEngine';
import ContentAutomationPipeline from './contentAutomationPipeline';
import { 
  getChapterConfiguration, 
  getCharacterSkillForChapter, 
  prioritizeGenerationJobs,
  getRecommendedBatchSize 
} from '../utils/contentScalingUtils';

// Cross-chapter scaling orchestration service
export class CrossChapterScalingService {
  private scalingEngine: ContentScalingEngine;
  private automationPipeline: ContentAutomationPipeline;

  constructor() {
    this.scalingEngine = new ContentScalingEngine();
    this.automationPipeline = new ContentAutomationPipeline();
  }

  // Scale Maya's communication patterns to other chapters
  async scaleMayaPatterns(targetChapters: number[]): Promise<string[]> {
    const mayaArchetype = this.scalingEngine.getCharacterArchetype('maya');
    if (!mayaArchetype) throw new Error('Maya archetype not found');

    const jobIds: string[] = [];

    for (const chapterNumber of targetChapters) {
      const crossChapterSkill = getCharacterSkillForChapter('maya', chapterNumber);
      const chapterConfig = getChapterConfiguration(chapterNumber);

      if (crossChapterSkill && chapterConfig) {
        // Adapt Maya's communication framework to the chapter's focus
        const adaptedVariables = {
          skillName: this.getSkillNameForChapter(crossChapterSkill, chapterConfig),
          practicalScenario: this.adaptScenarioForChapter(mayaArchetype, chapterConfig),
          timeMetrics: this.adaptTimeMetricsForChapter(mayaArchetype, chapterConfig),
          chapterSpecificContext: {
            focusArea: chapterConfig.title,
            primaryCharacter: chapterConfig.primaryCharacter,
            learningObjectives: chapterConfig.learningObjectives
          }
        };

        const jobId = await this.automationPipeline.createJob(
          'single_component',
          {
            templateIds: ['interactive-builder', 'character-journey'],
            characterIds: ['maya'],
            chapterNumbers: [chapterNumber],
            customVariables: adaptedVariables,
            qualityThreshold: 0.90
          },
          'medium'
        );

        jobIds.push(jobId);
      }
    }

    return jobIds;
  }

  // Apply proven Chapter 2 patterns across all chapters
  async scaleChapter2Patterns(targetChapters: number[]): Promise<ScalingResult> {
    const chapter2Patterns = await this.extractChapter2Patterns();
    const allCharacters = this.scalingEngine.getAllCharacterArchetypes();
    const jobIds: string[] = [];
    const errors: string[] = [];

    for (const chapterNumber of targetChapters) {
      const chapterConfig = getChapterConfiguration(chapterNumber);
      if (!chapterConfig) {
        errors.push(`Configuration not found for chapter ${chapterNumber}`);
        continue;
      }

      try {
        // Apply patterns to each character with chapter-specific adaptations
        for (const character of allCharacters) {
          const adaptedPatterns = await this.adaptPatternsForCharacterChapter(
            chapter2Patterns,
            character,
            chapterConfig
          );

          const jobId = await this.automationPipeline.createJob(
            'template_application',
            {
              templateIds: Object.keys(adaptedPatterns),
              characterIds: [character.id],
              chapterNumbers: [chapterNumber],
              customVariables: adaptedPatterns,
              qualityThreshold: 0.85,
              autoApprove: false
            },
            this.calculateJobPriority(character, chapterConfig)
          );

          jobIds.push(jobId);
        }
      } catch (error) {
        errors.push(`Failed to scale patterns for chapter ${chapterNumber}: ${error}`);
      }
    }

    return { jobIds, errors, totalJobs: jobIds.length };
  }

  // Create comprehensive chapter content with character coordination
  async createChapterWithAllCharacters(chapterNumber: number): Promise<ChapterCreationResult> {
    const chapterConfig = getChapterConfiguration(chapterNumber);
    if (!chapterConfig) {
      throw new Error(`Configuration not found for chapter ${chapterNumber}`);
    }

    const allCharacters = this.scalingEngine.getAllCharacterArchetypes();
    const allTemplates = this.scalingEngine.getAllContentTemplates();

    // Prioritize characters based on chapter focus
    const prioritizedCharacters = this.prioritizeCharactersForChapter(allCharacters, chapterConfig);
    
    // Create character-specific content with cross-character coordination
    const characterJobs: CharacterJob[] = [];

    for (const character of prioritizedCharacters) {
      const characterRole = this.determineCharacterRole(character, chapterConfig);
      const applicableTemplates = this.getApplicableTemplatesForCharacterRole(allTemplates, characterRole);
      
      const characterVariables = {
        ...this.getCharacterBaseVariables(character, chapterNumber),
        roleInChapter: characterRole,
        coordinationContext: this.getCoordinationContext(character, prioritizedCharacters, chapterConfig),
        crossCharacterInteractions: this.generateCrossCharacterInteractions(character, prioritizedCharacters, chapterConfig)
      };

      const jobId = await this.automationPipeline.createJob(
        'single_component',
        {
          templateIds: applicableTemplates.map(t => t.id),
          characterIds: [character.id],
          chapterNumbers: [chapterNumber],
          customVariables: characterVariables,
          qualityThreshold: characterRole === 'primary' ? 0.92 : 0.85
        },
        characterRole === 'primary' ? 'high' : 'medium'
      );

      characterJobs.push({
        characterId: character.id,
        role: characterRole,
        jobId,
        priority: characterRole === 'primary' ? 3 : characterRole === 'supporting' ? 2 : 1
      });
    }

    // Create chapter overview and coordination content
    const overviewJobId = await this.createChapterOverview(chapterNumber, chapterConfig, prioritizedCharacters);

    return {
      chapterNumber,
      overviewJobId,
      characterJobs,
      totalCharacters: prioritizedCharacters.length,
      estimatedCompletion: this.estimateChapterCompletion(characterJobs.length)
    };
  }

  // Scale interactive patterns with progressive complexity
  async scaleInteractivePatterns(
    basePattern: string,
    targetChapters: number[],
    complexityProgression: 'linear' | 'exponential' | 'adaptive' = 'adaptive'
  ): Promise<string[]> {
    const baseTemplate = this.scalingEngine.getContentTemplate(basePattern);
    if (!baseTemplate) {
      throw new Error(`Base pattern '${basePattern}' not found`);
    }

    const jobIds: string[] = [];

    for (let i = 0; i < targetChapters.length; i++) {
      const chapterNumber = targetChapters[i];
      const complexityLevel = this.calculateComplexityLevel(i, targetChapters.length, complexityProgression);
      
      const enhancedVariables = {
        complexityLevel,
        progressiveFeatures: this.getProgressiveFeatures(complexityLevel),
        chapterPosition: i + 1,
        totalChapters: targetChapters.length,
        buildUponPrevious: i > 0 ? targetChapters[i - 1] : null
      };

      const jobId = await this.automationPipeline.createJob(
        'template_application',
        {
          templateIds: [basePattern],
          characterIds: this.getApplicableCharactersForChapter(chapterNumber),
          chapterNumbers: [chapterNumber],
          customVariables: enhancedVariables,
          qualityThreshold: 0.88
        },
        'medium'
      );

      jobIds.push(jobId);
    }

    return jobIds;
  }

  // Create learning path across multiple chapters
  async createLearningPath(
    pathName: string,
    chapters: number[],
    focusSkills: string[],
    targetCharacters?: string[]
  ): Promise<LearningPathResult> {
    const pathId = `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pathJobs: PathJob[] = [];

    // Create progressive skill building across chapters
    for (let i = 0; i < chapters.length; i++) {
      const chapterNumber = chapters[i];
      const currentSkills = focusSkills.slice(0, i + 1); // Progressive skill accumulation
      const previousSkills = i > 0 ? focusSkills.slice(0, i) : [];

      const pathVariables = {
        pathId,
        pathName,
        chapterPosition: i + 1,
        totalChapters: chapters.length,
        currentSkills,
        previousSkills,
        skillProgression: this.calculateSkillProgression(currentSkills, focusSkills),
        pathContext: {
          learningObjectives: this.generatePathObjectives(currentSkills),
          prerequisites: previousSkills,
          outcomes: this.generatePathOutcomes(currentSkills)
        }
      };

      const applicableCharacters = targetCharacters || this.getApplicableCharactersForChapter(chapterNumber);

      const jobId = await this.automationPipeline.createJob(
        'chapter_batch',
        {
          chapterNumbers: [chapterNumber],
          characterIds: applicableCharacters,
          customVariables: pathVariables,
          qualityThreshold: 0.87
        },
        'medium'
      );

      pathJobs.push({
        chapterNumber,
        skills: currentSkills,
        jobId,
        dependencies: i > 0 ? [pathJobs[i - 1].jobId] : []
      });
    }

    return {
      pathId,
      pathName,
      chapters,
      focusSkills,
      pathJobs,
      totalJobs: pathJobs.length
    };
  }

  // Monitor cross-chapter scaling progress
  async getScalingProgress(jobIds: string[]): Promise<ScalingProgress> {
    const jobStatuses = await Promise.all(
      jobIds.map(id => this.automationPipeline.getJobStatus(id))
    );

    const validJobs = jobStatuses.filter(job => job !== null);
    const completed = validJobs.filter(job => job.status === 'completed').length;
    const failed = validJobs.filter(job => job.status === 'failed').length;
    const processing = validJobs.filter(job => job.status === 'processing').length;
    const queued = validJobs.filter(job => job.status === 'queued').length;

    const totalProgress = validJobs.reduce((sum, job) => sum + job.progress, 0) / validJobs.length;

    return {
      totalJobs: validJobs.length,
      completed,
      failed,
      processing,
      queued,
      overallProgress: Math.round(totalProgress),
      estimatedTimeRemaining: this.estimateRemainingTime(validJobs),
      qualityMetrics: this.calculateAggregateQuality(validJobs)
    };
  }

  // Private helper methods

  private async extractChapter2Patterns(): Promise<Record<string, any>> {
    // Extract proven patterns from Chapter 2 analysis
    return {
      'interactive-builder': {
        stageProgression: ['intro', 'build', 'preview', 'success'],
        engagementFeatures: ['progressive_disclosure', 'character_integration', 'time_metrics'],
        successPatterns: ['clear_outcomes', 'practical_scenarios', 'celebration_moments']
      },
      'character-journey': {
        transformationArc: ['challenge', 'discovery', 'practice', 'mastery'],
        emotionalElements: ['anxiety_to_confidence', 'struggle_to_success'],
        practicalApplication: ['real_scenarios', 'measurable_outcomes']
      }
    };
  }

  private async adaptPatternsForCharacterChapter(
    patterns: Record<string, any>,
    character: CharacterArchetype,
    chapterConfig: any
  ): Promise<Record<string, any>> {
    const adaptedPatterns: Record<string, any> = {};

    for (const [patternId, pattern] of Object.entries(patterns)) {
      adaptedPatterns[patternId] = {
        ...pattern,
        characterAdaptation: {
          name: character.name,
          profession: character.profession,
          challengePattern: character.challengePattern,
          chapterSpecificChallenge: this.generateChapterSpecificChallenge(character, chapterConfig)
        },
        chapterAdaptation: {
          title: chapterConfig.title,
          focusSkills: chapterConfig.focusSkills,
          learningObjectives: chapterConfig.learningObjectives
        }
      };
    }

    return adaptedPatterns;
  }

  private prioritizeCharactersForChapter(
    characters: CharacterArchetype[],
    chapterConfig: any
  ): CharacterArchetype[] {
    return characters.sort((a, b) => {
      // Primary character first
      if (a.id === chapterConfig.primaryCharacter) return -1;
      if (b.id === chapterConfig.primaryCharacter) return 1;

      // Characters with cross-chapter skills next
      const aHasSkill = getCharacterSkillForChapter(a.id, 3) !== null; // Using chapter 3 as example
      const bHasSkill = getCharacterSkillForChapter(b.id, 3) !== null;

      if (aHasSkill && !bHasSkill) return -1;
      if (!aHasSkill && bHasSkill) return 1;

      return 0; // Maintain original order for equal priority
    });
  }

  private determineCharacterRole(character: CharacterArchetype, chapterConfig: any): CharacterRole {
    if (character.id === chapterConfig.primaryCharacter) {
      return 'primary';
    }

    const hasRelevantSkill = chapterConfig.focusSkills.some((skill: string) => 
      character.primarySkill.includes(skill) || 
      getCharacterSkillForChapter(character.id, 3) // Using chapter 3 as example
    );

    return hasRelevantSkill ? 'supporting' : 'guest';
  }

  private getCoordinationContext(
    character: CharacterArchetype,
    allCharacters: CharacterArchetype[],
    chapterConfig: any
  ): any {
    const otherCharacters = allCharacters.filter(c => c.id !== character.id);
    
    return {
      collaborations: otherCharacters.map(other => ({
        characterId: other.id,
        name: other.name,
        sharedSkills: this.findSharedSkills(character, other),
        collaborationOpportunities: this.generateCollaborationOpportunities(character, other, chapterConfig)
      })),
      teamDynamics: {
        leadership: character.id === chapterConfig.primaryCharacter,
        supportRole: this.determineCharacterRole(character, chapterConfig),
        contributionAreas: this.identifyContributionAreas(character, chapterConfig)
      }
    };
  }

  private generateCrossCharacterInteractions(
    character: CharacterArchetype,
    allCharacters: CharacterArchetype[],
    chapterConfig: any
  ): any[] {
    return allCharacters
      .filter(other => other.id !== character.id)
      .map(other => ({
        withCharacter: other.id,
        interactionType: this.determineInteractionType(character, other, chapterConfig),
        scenario: this.generateInteractionScenario(character, other, chapterConfig),
        learningOutcome: this.generateInteractionLearningOutcome(character, other)
      }));
  }

  // Additional helper methods for calculations and utilities
  private calculateJobPriority(character: CharacterArchetype, chapterConfig: any): 'low' | 'medium' | 'high' {
    if (character.id === chapterConfig.primaryCharacter) return 'high';
    if (getCharacterSkillForChapter(character.id, 3)) return 'medium';
    return 'low';
  }

  private calculateComplexityLevel(
    position: number,
    total: number,
    progression: 'linear' | 'exponential' | 'adaptive'
  ): number {
    switch (progression) {
      case 'linear':
        return (position + 1) / total;
      case 'exponential':
        return Math.pow((position + 1) / total, 2);
      case 'adaptive':
        return 0.3 + (0.7 * (position + 1) / total); // Start at 30%, grow to 100%
      default:
        return 0.5;
    }
  }

  private getProgressiveFeatures(complexityLevel: number): string[] {
    const features = [];
    
    if (complexityLevel >= 0.3) features.push('basic_interaction');
    if (complexityLevel >= 0.5) features.push('advanced_validation');
    if (complexityLevel >= 0.7) features.push('custom_workflows');
    if (complexityLevel >= 0.9) features.push('expert_mode');

    return features;
  }

  private getApplicableCharactersForChapter(chapterNumber: number): string[] {
    const chapterConfig = getChapterConfiguration(chapterNumber);
    if (!chapterConfig) return [];

    const allCharacters = this.scalingEngine.getAllCharacterArchetypes();
    return allCharacters
      .filter(char => 
        char.id === chapterConfig.primaryCharacter ||
        getCharacterSkillForChapter(char.id, chapterNumber)
      )
      .map(char => char.id);
  }

  private estimateRemainingTime(jobs: any[]): number {
    const processingJobs = jobs.filter(job => job.status === 'processing');
    const queuedJobs = jobs.filter(job => job.status === 'queued');
    
    const avgProcessingTime = 60000; // 1 minute average
    return (processingJobs.length * 0.5 + queuedJobs.length) * avgProcessingTime;
  }

  private calculateAggregateQuality(jobs: any[]): any {
    const completedJobs = jobs.filter(job => job.status === 'completed' && job.results);
    
    if (completedJobs.length === 0) return null;

    const totalQuality = completedJobs.reduce((sum, job) => {
      const avgQuality = job.results.reduce((s: number, r: any) => s + r.qualityScore, 0) / job.results.length;
      return sum + avgQuality;
    }, 0);

    return {
      averageQuality: totalQuality / completedJobs.length,
      completedJobs: completedJobs.length,
      totalAssessed: completedJobs.length
    };
  }

  // Placeholder methods for additional functionality
  private getSkillNameForChapter(skill: string, chapterConfig: any): string {
    return `${chapterConfig.title} - ${skill.replace('_', ' ')}`;
  }

  private adaptScenarioForChapter(character: CharacterArchetype, chapterConfig: any): string {
    return `${character.name} applying ${character.primarySkill} skills in ${chapterConfig.title.toLowerCase()}`;
  }

  private adaptTimeMetricsForChapter(character: CharacterArchetype, chapterConfig: any): any {
    return {
      ...character.transformationArc.timeMetrics,
      context: chapterConfig.title
    };
  }

  private generateChapterSpecificChallenge(character: CharacterArchetype, chapterConfig: any): string {
    return `${character.challengePattern} in the context of ${chapterConfig.title.toLowerCase()}`;
  }

  private getCharacterBaseVariables(character: CharacterArchetype, chapterNumber: number): any {
    return {
      characterName: character.name,
      profession: character.profession,
      primarySkill: character.primarySkill,
      chapterNumber,
      transformationArc: character.transformationArc
    };
  }

  private getApplicableTemplatesForCharacterRole(templates: ContentTemplate[], role: CharacterRole): ContentTemplate[] {
    // Filter templates based on character role
    return templates.filter(template => {
      if (role === 'primary') return true; // Primary characters can use all templates
      if (role === 'supporting') return template.category !== 'advanced'; // Supporting characters use basic/intermediate
      return template.category === 'basic'; // Guest characters use basic templates only
    });
  }

  private async createChapterOverview(chapterNumber: number, chapterConfig: any, characters: CharacterArchetype[]): Promise<string> {
    return await this.automationPipeline.createJob(
      'single_component',
      {
        templateIds: ['chapter-overview'],
        characterIds: [chapterConfig.primaryCharacter],
        chapterNumbers: [chapterNumber],
        customVariables: {
          chapterTitle: chapterConfig.title,
          allCharacters: characters.map(c => ({ id: c.id, name: c.name, role: this.determineCharacterRole(c, chapterConfig) })),
          learningObjectives: chapterConfig.learningObjectives
        }
      },
      'high'
    );
  }

  private estimateChapterCompletion(jobCount: number): number {
    return jobCount * 45000; // 45 seconds per job average
  }

  private calculateSkillProgression(currentSkills: string[], allSkills: string[]): number {
    return currentSkills.length / allSkills.length;
  }

  private generatePathObjectives(skills: string[]): string[] {
    return skills.map(skill => `Master ${skill.replace('_', ' ')} through practical application`);
  }

  private generatePathOutcomes(skills: string[]): string[] {
    return skills.map(skill => `Demonstrate proficiency in ${skill.replace('_', ' ')}`);
  }

  private findSharedSkills(char1: CharacterArchetype, char2: CharacterArchetype): string[] {
    // Find overlapping skills between characters
    return char1.personalityTraits.filter(trait => char2.personalityTraits.includes(trait));
  }

  private generateCollaborationOpportunities(char1: CharacterArchetype, char2: CharacterArchetype, chapterConfig: any): string[] {
    return [`${char1.primarySkill} + ${char2.primarySkill} collaboration in ${chapterConfig.title}`];
  }

  private identifyContributionAreas(character: CharacterArchetype, chapterConfig: any): string[] {
    return chapterConfig.focusSkills.filter((skill: string) => 
      character.primarySkill.includes(skill) || character.personalityTraits.some((trait: string) => skill.includes(trait))
    );
  }

  private determineInteractionType(char1: CharacterArchetype, char2: CharacterArchetype, chapterConfig: any): string {
    if (char1.id === chapterConfig.primaryCharacter || char2.id === chapterConfig.primaryCharacter) {
      return 'mentorship';
    }
    return 'collaboration';
  }

  private generateInteractionScenario(char1: CharacterArchetype, char2: CharacterArchetype, chapterConfig: any): string {
    return `${char1.name} and ${char2.name} working together on ${chapterConfig.title.toLowerCase()}`;
  }

  private generateInteractionLearningOutcome(char1: CharacterArchetype, char2: CharacterArchetype): string {
    return `Understanding how ${char1.primarySkill} complements ${char2.primarySkill}`;
  }
}

// Supporting interfaces
interface ScalingResult {
  jobIds: string[];
  errors: string[];
  totalJobs: number;
}

interface CharacterJob {
  characterId: string;
  role: CharacterRole;
  jobId: string;
  priority: number;
}

interface ChapterCreationResult {
  chapterNumber: number;
  overviewJobId: string;
  characterJobs: CharacterJob[];
  totalCharacters: number;
  estimatedCompletion: number;
}

interface PathJob {
  chapterNumber: number;
  skills: string[];
  jobId: string;
  dependencies: string[];
}

interface LearningPathResult {
  pathId: string;
  pathName: string;
  chapters: number[];
  focusSkills: string[];
  pathJobs: PathJob[];
  totalJobs: number;
}

interface ScalingProgress {
  totalJobs: number;
  completed: number;
  failed: number;
  processing: number;
  queued: number;
  overallProgress: number;
  estimatedTimeRemaining: number;
  qualityMetrics: any;
}

type CharacterRole = 'primary' | 'supporting' | 'guest';

export default CrossChapterScalingService;