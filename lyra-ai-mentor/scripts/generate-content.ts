#!/usr/bin/env tsx

/**
 * Generate Content Script
 * 
 * This script generates content using the scaling system without AI service dependency
 * Usage: npm run generate-content <character> <chapter> <template>
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function generateContent() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Usage: npm run generate-content <character> <chapter> <template>');
    console.error('');
    console.error('Available characters: maya, alex, david, rachel, sofia');
    console.error('Available templates: interactive-builder, character-journey');
    console.error('');
    console.error('Example: npm run generate-content alex 3 interactive-builder');
    process.exit(1);
  }
  
  const [characterId, chapterStr, templateId] = args;
  const chapterNumber = parseInt(chapterStr);
  
  console.log(`🔨 Generating content for ${characterId} in Chapter ${chapterNumber}...`);
  
  try {
    // Character data
    const characters = {
      maya: {
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
      alex: {
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
      david: {
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
      rachel: {
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
      sofia: {
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
    };
    
    // Template data
    const templates = {
      'interactive-builder': {
        id: 'interactive-builder',
        type: 'interactive-component',
        title: 'Interactive Skill Builder',
        description: 'Multi-stage interactive component following the proven 4-stage pattern',
        baseComponent: 'ScalableInteractiveBuilder'
      },
      'character-journey': {
        id: 'character-journey',
        type: 'lesson-content',
        title: 'Character Journey Arc',
        description: 'Character development content following transformation patterns',
        baseComponent: 'CharacterJourneyContent'
      }
    };
    
    // Validate inputs
    const character = characters[characterId as keyof typeof characters];
    const template = templates[templateId as keyof typeof templates];
    
    if (!character) {
      console.error(`❌ Character '${characterId}' not found`);
      console.error('Available characters: maya, alex, david, rachel, sofia');
      process.exit(1);
    }
    
    if (!template) {
      console.error(`❌ Template '${templateId}' not found`);
      console.error('Available templates: interactive-builder, character-journey');
      process.exit(1);
    }
    
    if (chapterNumber < 1 || chapterNumber > 10) {
      console.error(`❌ Chapter number must be between 1 and 10`);
      process.exit(1);
    }
    
    // Generate custom variables
    const customVariables = generateCustomVariables(character, chapterNumber, template);
    
    console.log(`📋 Character: ${character.name} (${character.profession})`);
    console.log(`📖 Chapter: ${chapterNumber}`);
    console.log(`🎯 Template: ${template.title}`);
    console.log(`⚡ Skill: ${customVariables.skillName}`);
    console.log(`📝 Scenario: ${customVariables.practicalScenario}`);
    
    // Generate component
    const componentName = generateComponentName(characterId, chapterNumber, templateId);
    const componentCode = generateComponentCode(componentName, character, template, customVariables);
    
    // Ensure directory exists
    mkdirSync(join(process.cwd(), 'src', 'components', 'generated'), { recursive: true });
    
    // Write component file
    const componentPath = join(process.cwd(), 'src', 'components', 'generated', `${componentName}.tsx`);
    writeFileSync(componentPath, componentCode);
    
    console.log(`✅ Component created: ${componentPath}`);
    
    // Generate test file
    const testCode = generateTestCode(componentName, character, customVariables);
    const testPath = join(process.cwd(), 'src', 'components', 'generated', `${componentName}.test.tsx`);
    writeFileSync(testPath, testCode);
    
    console.log(`🧪 Test file created: ${testPath}`);
    
    // Generate usage example
    const usageExample = generateUsageExample(componentName, character, customVariables);
    console.log('\n📖 Usage Example:');
    console.log(usageExample);
    
    console.log('\n🎉 Content generation completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Import the component in your application');
    console.log('2. Run tests: npm test');
    console.log('3. Start development server: npm run dev');
    
  } catch (error) {
    console.error('❌ Content generation failed:', error);
    process.exit(1);
  }
}

function generateCustomVariables(character: any, chapterNumber: number, template: any): any {
  const chapterConfigs = {
    3: {
      skillName: 'Strategic Planning',
      practicalScenario: 'Creating a 3-year organizational strategy for community impact',
      timeMetrics: {
        before: '3 hours planning sessions',
        after: '45 minutes focused planning',
        savings: '2 hours 15 minutes per session',
        impactDescription: 'More time for execution and team development'
      }
    },
    4: {
      skillName: 'Data Analysis',
      practicalScenario: 'Building an impact measurement dashboard',
      timeMetrics: {
        before: '4 hours per report',
        after: '1 hour per report',
        savings: '3 hours per report',
        impactDescription: 'Faster insights for better decision making'
      }
    },
    5: {
      skillName: 'Process Automation',
      practicalScenario: 'Streamlining volunteer onboarding workflows',
      timeMetrics: {
        before: '6 hours weekly admin',
        after: '1.5 hours weekly admin',
        savings: '4.5 hours per week',
        impactDescription: 'More time for meaningful volunteer engagement'
      }
    },
    6: {
      skillName: 'Impact Storytelling',
      practicalScenario: 'Creating compelling donor impact narratives',
      timeMetrics: {
        before: '5 hours per story',
        after: '2 hours per story',
        savings: '3 hours per story',
        impactDescription: 'More stories shared, greater donor engagement'
      }
    }
  };
  
  const config = chapterConfigs[chapterNumber as keyof typeof chapterConfigs];
  
  return {
    skillName: config?.skillName || `${character.primarySkill} Skills`,
    practicalScenario: config?.practicalScenario || `${character.name} working on ${character.primarySkill}`,
    timeMetrics: config?.timeMetrics || character.transformationArc.timeMetrics,
    builderStages: [
      {
        id: 'intro',
        title: 'Getting Started',
        description: `Let's help ${character.name} with ${config?.skillName || character.primarySkill}`,
        type: 'selection',
        options: [
          {
            id: 'begin',
            title: 'Begin Journey',
            description: 'Start your transformation journey',
            value: 'begin',
            recommended: true
          }
        ]
      },
      {
        id: 'build',
        title: 'Build Your Solution',
        description: 'Create your personalized approach',
        type: 'input'
      },
      {
        id: 'preview',
        title: 'Preview & Refine',
        description: 'Review and improve your work',
        type: 'preview'
      },
      {
        id: 'success',
        title: 'Celebrate Success',
        description: 'See your transformation results',
        type: 'success'
      }
    ]
  };
}

function generateComponentName(characterId: string, chapterNumber: number, templateId: string): string {
  const character = characterId.charAt(0).toUpperCase() + characterId.slice(1);
  const template = templateId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  return `${character}Chapter${chapterNumber}${template}`;
}

function generateComponentCode(componentName: string, character: any, template: any, customVariables: any): string {
  return `import React from 'react';
import ScalableInteractiveBuilder from '../ScalableInteractiveBuilder';

// Generated component for ${character.name} - Chapter ${customVariables.chapterNumber || 'X'}
const ${componentName}: React.FC = () => {
  const character = ${JSON.stringify(character, null, 2)};
  
  const handleComplete = (result: any) => {
    console.log('${componentName} completed:', result);
    // Add your completion logic here
  };

  return (
    <ScalableInteractiveBuilder
      characterId="${character.id}"
      skillName="${customVariables.skillName}"
      builderStages={${JSON.stringify(customVariables.builderStages, null, 2)}}
      timeMetrics={${JSON.stringify(customVariables.timeMetrics, null, 2)}}
      practicalScenario="${customVariables.practicalScenario}"
      character={character}
      onComplete={handleComplete}
    />
  );
};

export default ${componentName};
`;
}

function generateUsageExample(componentName: string, character: any, customVariables: any): string {
  return `import ${componentName} from './components/generated/${componentName}';

// Usage in your application:
function MyPage() {
  return (
    <div>
      <h1>${character.name}'s ${customVariables.skillName} Journey</h1>
      <${componentName} />
    </div>
  );
}`;
}

function generateTestCode(componentName: string, character: any, customVariables: any): string {
  return `import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  test('renders character name and skill', () => {
    render(<${componentName} />);
    
    expect(screen.getByText('${character.name}', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('${customVariables.skillName}', { exact: false })).toBeInTheDocument();
  });
  
  test('displays practical scenario', () => {
    render(<${componentName} />);
    
    expect(screen.getByText('${customVariables.practicalScenario}', { exact: false })).toBeInTheDocument();
  });
  
  test('shows time metrics', () => {
    render(<${componentName} />);
    
    expect(screen.getByText('${customVariables.timeMetrics.before}', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('${customVariables.timeMetrics.after}', { exact: false })).toBeInTheDocument();
  });
  
  test('renders builder stages', () => {
    render(<${componentName} />);
    
    expect(screen.getByText('Getting Started', { exact: false })).toBeInTheDocument();
  });
});
`;
}

generateContent();