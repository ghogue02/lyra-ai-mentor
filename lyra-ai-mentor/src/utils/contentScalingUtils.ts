import { CharacterArchetype, ContentTemplate } from '../services/contentScalingEngine';

// Utility functions for content scaling operations

// Chapter configuration mapping
export const CHAPTER_CONFIGURATIONS = {
  3: {
    title: 'Strategic Planning & Leadership',
    primaryCharacter: 'alex',
    focusSkills: ['strategic_planning', 'leadership', 'vision_setting'],
    learningObjectives: [
      'Develop clear organizational vision',
      'Create actionable strategic plans',
      'Align team around common goals',
      'Balance short-term needs with long-term vision'
    ],
    timeEstimate: '2-3 hours',
    difficulty: 'intermediate'
  },
  4: {
    title: 'Data Analysis & Insights',
    primaryCharacter: 'david',
    focusSkills: ['data_analysis', 'visualization', 'reporting'],
    learningObjectives: [
      'Transform raw data into actionable insights',
      'Create compelling data visualizations',
      'Build automated reporting systems',
      'Make data-driven decisions'
    ],
    timeEstimate: '3-4 hours',
    difficulty: 'intermediate'
  },
  5: {
    title: 'Process Automation & Efficiency',
    primaryCharacter: 'rachel',
    focusSkills: ['process_design', 'automation', 'efficiency'],
    learningObjectives: [
      'Identify automation opportunities',
      'Design efficient workflows',
      'Implement process improvements',
      'Measure and optimize performance'
    ],
    timeEstimate: '2-3 hours',
    difficulty: 'advanced'
  },
  6: {
    title: 'Storytelling & Impact Communication',
    primaryCharacter: 'sofia',
    focusSkills: ['storytelling', 'communication', 'engagement'],
    learningObjectives: [
      'Craft compelling impact narratives',
      'Connect emotionally with audiences',
      'Create engaging content across channels',
      'Measure storytelling effectiveness'
    ],
    timeEstimate: '2-3 hours',
    difficulty: 'intermediate'
  }
} as const;

// Template application rules
export const TEMPLATE_APPLICATION_RULES = {
  'interactive-builder': {
    applicableChapters: [3, 4, 5, 6],
    requiredVariables: ['skillName', 'builderStages', 'timeMetrics', 'practicalScenario'],
    optionalVariables: ['customizations', 'additionalResources'],
    minQualityScore: 0.85
  },
  'character-journey': {
    applicableChapters: [3, 4, 5, 6],
    requiredVariables: ['characterId', 'journeyStage', 'learningObjectives'],
    optionalVariables: ['emotionalContext', 'challenges'],
    minQualityScore: 0.90
  }
} as const;

// Character skill mapping for cross-chapter content
export const CHARACTER_SKILL_MAPPING = {
  maya: {
    primaryChapter: 2,
    applicableChapters: [3, 4, 5, 6],
    crossChapterSkills: {
      3: 'strategic_communication',
      4: 'data_storytelling',
      5: 'process_communication',
      6: 'narrative_strategy'
    }
  },
  alex: {
    primaryChapter: 3,
    applicableChapters: [2, 4, 5, 6],
    crossChapterSkills: {
      2: 'leadership_communication',
      4: 'strategic_analytics',
      5: 'organizational_efficiency',
      6: 'vision_storytelling'
    }
  },
  david: {
    primaryChapter: 4,
    applicableChapters: [2, 3, 5, 6],
    crossChapterSkills: {
      2: 'data_communication',
      3: 'analytical_strategy',
      5: 'metrics_automation',
      6: 'data_storytelling'
    }
  },
  rachel: {
    primaryChapter: 5,
    applicableChapters: [2, 3, 4, 6],
    crossChapterSkills: {
      2: 'efficient_communication',
      3: 'operational_strategy',
      4: 'process_analytics',
      6: 'systematic_storytelling'
    }
  },
  sofia: {
    primaryChapter: 6,
    applicableChapters: [2, 3, 4, 5],
    crossChapterSkills: {
      2: 'narrative_communication',
      3: 'story_strategy',
      4: 'impact_analysis',
      5: 'content_automation'
    }
  }
} as const;

// Quality assessment criteria
export const QUALITY_CRITERIA = {
  characterConsistency: {
    weight: 0.25,
    criteria: [
      'Voice and tone match character personality',
      'Professional context is appropriate',
      'Transformation arc is respected',
      'Personality traits are evident'
    ]
  },
  technicalQuality: {
    weight: 0.20,
    criteria: [
      'React component syntax is valid',
      'TypeScript types are correct',
      'Accessibility standards are met',
      'Performance impact is minimal'
    ]
  },
  learningAlignment: {
    weight: 0.25,
    criteria: [
      'Learning objectives are clear',
      'Skill progression is logical',
      'Practical application is evident',
      'Measurable outcomes are defined'
    ]
  },
  userExperience: {
    weight: 0.20,
    criteria: [
      'Interface is intuitive',
      'Feedback is immediate',
      'Progress is clear',
      'Engagement is maintained'
    ]
  },
  contentQuality: {
    weight: 0.10,
    criteria: [
      'Content is accurate',
      'Examples are relevant',
      'Language is clear',
      'Format is appropriate'
    ]
  }
} as const;

// Utility functions

export function getChapterConfiguration(chapterNumber: number) {
  return CHAPTER_CONFIGURATIONS[chapterNumber as keyof typeof CHAPTER_CONFIGURATIONS];
}

export function getApplicableTemplatesForChapter(chapterNumber: number, templates: ContentTemplate[]) {
  return templates.filter(template => {
    const rules = TEMPLATE_APPLICATION_RULES[template.id as keyof typeof TEMPLATE_APPLICATION_RULES];
    return rules ? rules.applicableChapters.includes(chapterNumber) : true;
  });
}

export function getCharacterSkillForChapter(characterId: string, chapterNumber: number) {
  const mapping = CHARACTER_SKILL_MAPPING[characterId as keyof typeof CHARACTER_SKILL_MAPPING];
  if (!mapping) return null;

  if (mapping.primaryChapter === chapterNumber) {
    return `primary_${characterId}_skill`;
  }

  return mapping.crossChapterSkills[chapterNumber as keyof typeof mapping.crossChapterSkills] || null;
}

export function calculateQualityScore(assessmentResults: Record<string, number>): number {
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(QUALITY_CRITERIA).forEach(([criterionName, criterion]) => {
    const score = assessmentResults[criterionName] || 0;
    totalScore += score * criterion.weight;
    totalWeight += criterion.weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

export function validateTemplateVariables(
  template: ContentTemplate,
  variables: Record<string, any>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  template.templateVariables.forEach(templateVar => {
    const value = variables[templateVar.name];

    // Check required variables
    if (templateVar.required && (value === undefined || value === null || value === '')) {
      errors.push(`Required variable '${templateVar.name}' is missing`);
      return;
    }

    // Skip validation for optional missing variables
    if (!templateVar.required && (value === undefined || value === null)) {
      return;
    }

    // Type validation
    switch (templateVar.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Variable '${templateVar.name}' must be a string`);
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`Variable '${templateVar.name}' must be a valid number`);
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`Variable '${templateVar.name}' must be an array`);
        }
        break;
      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push(`Variable '${templateVar.name}' must be an object`);
        }
        break;
    }

    // Validation rules
    if (templateVar.validationRules && value !== undefined) {
      templateVar.validationRules.forEach(rule => {
        switch (rule.type) {
          case 'minLength':
            if (typeof value === 'string' && value.length < rule.value) {
              errors.push(rule.message || `Variable '${templateVar.name}' is too short`);
            }
            break;
          case 'pattern':
            if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
              errors.push(rule.message || `Variable '${templateVar.name}' format is invalid`);
            }
            break;
          case 'required':
            if (!value) {
              errors.push(rule.message || `Variable '${templateVar.name}' is required`);
            }
            break;
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function generateComponentFileName(
  templateId: string,
  characterId: string,
  chapterNumber: number
): string {
  const template = templateId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  const character = characterId.charAt(0).toUpperCase() + characterId.slice(1);
  
  return `${character}Chapter${chapterNumber}${template}.tsx`;
}

export function generateComponentName(
  templateId: string,
  characterId: string,
  chapterNumber: number
): string {
  const template = templateId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  const character = characterId.charAt(0).toUpperCase() + characterId.slice(1);
  
  return `${character}Chapter${chapterNumber}${template}`;
}

export function getDefaultVariablesForCharacter(
  character: CharacterArchetype,
  chapterNumber: number
): Record<string, any> {
  const chapterConfig = getChapterConfiguration(chapterNumber);
  const characterSkill = getCharacterSkillForChapter(character.id, chapterNumber);

  return {
    characterName: character.name,
    profession: character.profession,
    primarySkill: character.primarySkill,
    chapterSkill: characterSkill,
    chapterNumber,
    chapterTitle: chapterConfig?.title,
    practicalScenarios: character.contextualScenarios,
    personalityTraits: character.personalityTraits,
    transformationMetrics: character.transformationArc.timeMetrics,
    learningStyle: character.preferredLearningStyle,
    challengePattern: character.challengePattern
  };
}

export function estimateGenerationTime(
  templateIds: string[],
  characterIds: string[],
  chapterNumbers: number[]
): number {
  const baseTimePerComponent = 30000; // 30 seconds
  const complexityMultiplier = 1.2; // Account for AI generation complexity
  
  const totalComponents = templateIds.length * characterIds.length * chapterNumbers.length;
  
  return Math.round(totalComponents * baseTimePerComponent * complexityMultiplier);
}

export function formatGenerationTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function getRecommendedBatchSize(
  templateCount: number,
  characterCount: number,
  chapterCount: number
): number {
  const totalJobs = templateCount * characterCount * chapterCount;
  
  if (totalJobs <= 5) return totalJobs;
  if (totalJobs <= 20) return 5;
  if (totalJobs <= 50) return 10;
  
  return 15; // Maximum batch size for performance
}

export function prioritizeGenerationJobs(
  chapterNumbers: number[],
  characterIds: string[]
): Array<{ chapterNumber: number; characterId: string; priority: number }> {
  const priorities: Array<{ chapterNumber: number; characterId: string; priority: number }> = [];

  chapterNumbers.forEach(chapterNumber => {
    const chapterConfig = getChapterConfiguration(chapterNumber);
    
    characterIds.forEach(characterId => {
      let priority = 1; // Default priority

      // Higher priority for primary character in their chapter
      if (chapterConfig?.primaryCharacter === characterId) {
        priority = 3;
      }
      // Medium priority for characters with cross-chapter skills
      else if (getCharacterSkillForChapter(characterId, chapterNumber)) {
        priority = 2;
      }

      priorities.push({ chapterNumber, characterId, priority });
    });
  });

  return priorities.sort((a, b) => b.priority - a.priority);
}

export default {
  CHAPTER_CONFIGURATIONS,
  TEMPLATE_APPLICATION_RULES,
  CHARACTER_SKILL_MAPPING,
  QUALITY_CRITERIA,
  getChapterConfiguration,
  getApplicableTemplatesForChapter,
  getCharacterSkillForChapter,
  calculateQualityScore,
  validateTemplateVariables,
  generateComponentFileName,
  generateComponentName,
  getDefaultVariablesForCharacter,
  estimateGenerationTime,
  formatGenerationTime,
  getRecommendedBatchSize,
  prioritizeGenerationJobs
};