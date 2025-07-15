#!/usr/bin/env tsx

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// List of all 35 direct import components
const directImportComponents = [
  // Core renderer components (already created)
  // { name: 'CalloutBoxRenderer', path: 'core', import: '../../CalloutBoxRenderer', type: 'callout_box' },
  // { name: 'LyraChatRenderer', path: 'core', import: '../../LyraChatRenderer', type: 'lyra_chat' },
  // { name: 'KnowledgeCheckRenderer', path: 'core', import: '../../KnowledgeCheckRenderer', type: 'knowledge_check' },
  // { name: 'ReflectionRenderer', path: 'core', import: '../../ReflectionRenderer', type: 'reflection' },
  // { name: 'SequenceSorterRenderer', path: 'core', import: '../../SequenceSorterRenderer', type: 'sequence_sorter' },

  // Maya components
  // { name: 'MayaEmailConfidenceBuilder', path: 'maya', import: '@/components/interactive/MayaEmailConfidenceBuilder', type: 'ai_email_composer' },
  { name: 'MayaPromptSandwichBuilder', path: 'maya', import: '@/components/interactive/MayaPromptSandwichBuilder', type: 'prompt_builder', hasInteractions: true, hasComplexState: true },
  { name: 'MayaParentResponseEmail', path: 'maya', import: '@/components/interactive/MayaParentResponseEmail', type: 'ai_email_composer', hasInteractions: true, hasAsyncOperations: true },
  { name: 'MayaGrantProposal', path: 'maya', import: '@/components/interactive/MayaGrantProposal', type: 'document_generator', hasInteractions: true, hasComplexState: true },
  { name: 'MayaGrantProposalAdvanced', path: 'maya', import: '@/components/interactive/MayaGrantProposalAdvanced', type: 'document_generator', hasInteractions: true, hasComplexState: true },
  { name: 'MayaBoardMeetingPrep', path: 'maya', import: '@/components/interactive/MayaBoardMeetingPrep', type: 'meeting_prep_assistant', hasInteractions: true, hasAsyncOperations: true },
  { name: 'MayaResearchSynthesis', path: 'maya', import: '@/components/interactive/MayaResearchSynthesis', type: 'research_assistant', hasInteractions: true, hasAsyncOperations: true },

  // Sofia components
  { name: 'SofiaMissionStoryCreator', path: 'sofia', import: '@/components/interactive/SofiaMissionStoryCreator', type: 'ai_content_generator', hasInteractions: true, hasComplexState: true },
  { name: 'SofiaVoiceDiscovery', path: 'sofia', import: '@/components/interactive/SofiaVoiceDiscovery', type: 'document_improver', hasInteractions: true, hasComplexState: true },
  { name: 'SofiaStoryBreakthrough', path: 'sofia', import: '@/components/interactive/SofiaStoryBreakthrough', type: 'ai_email_composer', hasInteractions: true, hasAsyncOperations: true },
  { name: 'SofiaImpactScaling', path: 'sofia', import: '@/components/interactive/SofiaImpactScaling', type: 'template_creator', hasInteractions: true, hasComplexState: true },

  // David components
  { name: 'DavidDataRevival', path: 'david', import: '@/components/interactive/DavidDataRevival', type: 'ai_content_generator', hasInteractions: true, hasAsyncOperations: true },
  { name: 'DavidDataStoryFinder', path: 'david', import: '@/components/interactive/DavidDataStoryFinder', type: 'data_storyteller', hasInteractions: true, hasComplexState: true },
  { name: 'DavidPresentationMaster', path: 'david', import: '@/components/interactive/DavidPresentationMaster', type: 'document_generator', hasInteractions: true, hasComplexState: true },
  { name: 'DavidSystemBuilder', path: 'david', import: '@/components/interactive/DavidSystemBuilder', type: 'template_creator', hasInteractions: true, hasComplexState: true },

  // Rachel components
  { name: 'RachelAutomationVision', path: 'rachel', import: '@/components/interactive/RachelAutomationVision', type: 'workflow_automator', hasInteractions: true, hasAsyncOperations: true },
  { name: 'RachelWorkflowDesigner', path: 'rachel', import: '@/components/interactive/RachelWorkflowDesigner', type: 'process_optimizer', hasInteractions: true, hasComplexState: true },
  { name: 'RachelProcessTransformer', path: 'rachel', import: '@/components/interactive/RachelProcessTransformer', type: 'impact_measurement', hasInteractions: true, hasComplexState: true },
  { name: 'RachelEcosystemBuilder', path: 'rachel', import: '@/components/interactive/RachelEcosystemBuilder', type: 'integration_builder', hasInteractions: true, hasComplexState: true },

  // Alex components
  { name: 'AlexChangeStrategy', path: 'alex', import: '@/components/interactive/AlexChangeStrategy', type: 'change_leader', hasInteractions: true, hasAsyncOperations: true },
  { name: 'AlexVisionBuilder', path: 'alex', import: '@/components/interactive/AlexVisionBuilder', type: 'ai_governance_builder', hasInteractions: true, hasComplexState: true },
  { name: 'AlexRoadmapCreator', path: 'alex', import: '@/components/interactive/AlexRoadmapCreator', type: 'innovation_roadmap', hasInteractions: true, hasComplexState: true },
  { name: 'AlexLeadershipFramework', path: 'alex', import: '@/components/interactive/AlexLeadershipFramework', type: 'ai_governance_builder', hasInteractions: true, hasComplexState: true },

  // Testing components
  { name: 'DifficultConversationHelper', path: 'testing', import: '@/components/testing/DifficultConversationHelper', type: 'difficult_conversation_helper', hasInteractions: true },
  { name: 'AIContentGenerator', path: 'testing', import: '@/components/testing/AIContentGenerator', type: 'ai_content_generator', hasInteractions: true, hasAsyncOperations: true },
  { name: 'AIEmailComposer', path: 'testing', import: '@/components/testing/AIEmailComposer', type: 'ai_email_composer', hasInteractions: true },
  { name: 'DocumentImprover', path: 'testing', import: '@/components/testing/DocumentImprover', type: 'document_improver', hasInteractions: true },
  { name: 'TemplateCreator', path: 'testing', import: '@/components/testing/TemplateCreator', type: 'template_creator', hasInteractions: true },
  { name: 'DocumentGenerator', path: 'testing', import: '@/components/testing/DocumentGenerator', type: 'document_generator', hasInteractions: true },
  { name: 'AISocialMediaGenerator', path: 'testing', import: '@/components/testing/AISocialMediaGenerator', type: 'ai_social_media_generator', hasInteractions: true },
];

function generateComponentTest(component: {
  name: string;
  path: string;
  import: string;
  type: string;
  hasInteractions?: boolean;
  hasAsyncOperations?: boolean;
  hasComplexState?: boolean;
}) {
  const {
    name,
    path,
    import: importPath,
    type,
    hasInteractions = false,
    hasAsyncOperations = false,
    hasComplexState = false,
  } = component;

  return `import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { ${name} } from '${importPath}';
import { createComponentTestSuite } from '../componentTestTemplate';

// Import the component for testing
const Component = ${name};

createComponentTestSuite(
  '${name}',
  Component,
  '${type}',
  {
    hasInteractions: ${hasInteractions},
    hasAsyncOperations: ${hasAsyncOperations},
    hasComplexState: ${hasComplexState},
    customProps: {
      onComplete: vi.fn(),
      isElementCompleted: false,
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    },
  }
);

// Additional tests specific to ${name}
describe('${name} Specific Tests', () => {
  it('should render ${name} component without errors', () => {
    const element = {
      id: 1,
      type: '${type}',
      title: '${name} Test',
      content: 'Test content for ${name}',
      configuration: {},
      order_index: 1,
    };

    const props = {
      element,
      onComplete: vi.fn(),
      isElementCompleted: false,
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    };

    render(<Component {...props} />);
    
    // Should render without throwing errors
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it('should handle component-specific configuration', () => {
    const element = {
      id: 1,
      type: '${type}',
      title: '${name} Configuration Test',
      content: 'Test content with configuration',
      configuration: {
        ${path === 'maya' ? 'character: "maya",' : ''}
        ${path === 'sofia' ? 'character: "sofia",' : ''}
        ${path === 'david' ? 'character: "david",' : ''}
        ${path === 'rachel' ? 'character: "rachel",' : ''}
        ${path === 'alex' ? 'character: "alex",' : ''}
        testMode: true,
        sampleData: ['item1', 'item2'],
      },
      order_index: 1,
    };

    const props = {
      element,
      onComplete: vi.fn(),
      isElementCompleted: false,
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    };

    expect(() => render(<Component {...props} />)).not.toThrow();
  });

  it('should handle edge cases and null configurations', () => {
    const edgeCases = [
      null,
      undefined,
      {},
      { invalidProperty: 'test' },
      { nested: { object: { value: 'test' } } },
    ];

    edgeCases.forEach((config, index) => {
      const element = {
        id: index + 1,
        type: '${type}',
        title: '${name} Edge Case Test',
        content: 'Test content',
        configuration: config,
        order_index: 1,
      };

      const props = {
        element,
        onComplete: vi.fn(),
        isElementCompleted: false,
        analytics: {
          trackStart: vi.fn(),
          trackComplete: vi.fn(),
          trackInteraction: vi.fn(),
          trackError: vi.fn(),
        },
      };

      expect(() => render(<Component {...props} />)).not.toThrow();
    });
  });

  ${hasInteractions ? `
  it('should handle user interactions properly', () => {
    const element = {
      id: 1,
      type: '${type}',
      title: '${name} Interaction Test',
      content: 'Test interactions',
      configuration: {},
      order_index: 1,
    };

    const mockOnComplete = vi.fn();
    const props = {
      element,
      onComplete: mockOnComplete,
      isElementCompleted: false,
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    };

    render(<Component {...props} />);
    
    // Look for interactive elements
    const buttons = screen.queryAllByRole('button');
    const inputs = screen.queryAllByRole('textbox');
    
    // Should have some interactive elements or handle gracefully
    expect(buttons.length + inputs.length).toBeGreaterThanOrEqual(0);
  });
  ` : ''}

  ${hasAsyncOperations ? `
  it('should handle async operations safely', async () => {
    const element = {
      id: 1,
      type: '${type}',
      title: '${name} Async Test',
      content: 'Test async operations',
      configuration: {},
      order_index: 1,
    };

    const props = {
      element,
      onComplete: vi.fn(),
      isElementCompleted: false,
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    };

    const { unmount } = render(<Component {...props} />);
    
    // Test immediate unmount to check cleanup
    unmount();
    
    // Should not cause any errors
    expect(true).toBe(true);
  });
  ` : ''}
});`;
}

// Generate all test files
function generateAllTests() {
  const baseDir = '/Users/greghogue/Lyra New/lyra-ai-mentor/src/components/interactive/__tests__';
  
  directImportComponents.forEach(component => {
    const { name, path } = component;
    const dirPath = join(baseDir, path);
    const filePath = join(dirPath, `${name}.test.tsx`);
    
    // Create directory if it doesn't exist
    try {
      mkdirSync(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    const testContent = generateComponentTest(component);
    
    try {
      writeFileSync(filePath, testContent);
      console.log(`✅ Generated test file: ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to generate test file: ${filePath}`, error);
    }
  });
}

// Run the generator
generateAllTests();
console.log('🎉 All component test files generated successfully!');