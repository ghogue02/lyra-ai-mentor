import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { 
  createTestElement, 
  createTestLessonContext,
  PerformanceTestUtils,
  PERFORMANCE_THRESHOLDS,
} from '@/components/interactive/__tests__/testUtils';

// Mock the lesson data hook
vi.mock('@/hooks/useLessonData', () => ({
  useLessonData: () => ({
    lesson: {
      id: 1,
      title: 'Test Lesson',
      content: 'Test lesson content',
      interactive_elements: [],
    },
    isLoading: false,
    error: null,
  }),
}));

describe('Full Lesson Loading Integration Tests', () => {
  const directImportComponents = [
    'CalloutBoxRenderer',
    'LyraChatRenderer',
    'KnowledgeCheckRenderer',
    'ReflectionRenderer',
    'SequenceSorterRenderer',
    'MayaEmailConfidenceBuilder',
    'MayaPromptSandwichBuilder',
    'MayaParentResponseEmail',
    'MayaGrantProposal',
    'MayaGrantProposalAdvanced',
    'MayaBoardMeetingPrep',
    'MayaResearchSynthesis',
    'SofiaMissionStoryCreator',
    'SofiaVoiceDiscovery',
    'SofiaStoryBreakthrough',
    'SofiaImpactScaling',
    'DavidDataRevival',
    'DavidDataStoryFinder',
    'DavidPresentationMaster',
    'DavidSystemBuilder',
    'RachelAutomationVision',
    'RachelWorkflowDesigner',
    'RachelProcessTransformer',
    'RachelEcosystemBuilder',
    'AlexChangeStrategy',
    'AlexVisionBuilder',
    'AlexRoadmapCreator',
    'AlexLeadershipFramework',
    'DifficultConversationHelper',
    'AIContentGenerator',
    'AIEmailComposer',
    'DocumentImprover',
    'TemplateCreator',
    'DocumentGenerator',
    'AISocialMediaGenerator',
  ];

  const componentTypeMap: Record<string, string> = {
    'CalloutBoxRenderer': 'callout_box',
    'LyraChatRenderer': 'lyra_chat',
    'KnowledgeCheckRenderer': 'knowledge_check',
    'ReflectionRenderer': 'reflection',
    'SequenceSorterRenderer': 'sequence_sorter',
    'MayaEmailConfidenceBuilder': 'ai_email_composer',
    'MayaPromptSandwichBuilder': 'prompt_builder',
    'MayaParentResponseEmail': 'ai_email_composer',
    'MayaGrantProposal': 'document_generator',
    'MayaGrantProposalAdvanced': 'document_generator',
    'MayaBoardMeetingPrep': 'meeting_prep_assistant',
    'MayaResearchSynthesis': 'research_assistant',
    'SofiaMissionStoryCreator': 'ai_content_generator',
    'SofiaVoiceDiscovery': 'document_improver',
    'SofiaStoryBreakthrough': 'ai_email_composer',
    'SofiaImpactScaling': 'template_creator',
    'DavidDataRevival': 'ai_content_generator',
    'DavidDataStoryFinder': 'data_storyteller',
    'DavidPresentationMaster': 'document_generator',
    'DavidSystemBuilder': 'template_creator',
    'RachelAutomationVision': 'workflow_automator',
    'RachelWorkflowDesigner': 'process_optimizer',
    'RachelProcessTransformer': 'impact_measurement',
    'RachelEcosystemBuilder': 'integration_builder',
    'AlexChangeStrategy': 'change_leader',
    'AlexVisionBuilder': 'ai_governance_builder',
    'AlexRoadmapCreator': 'innovation_roadmap',
    'AlexLeadershipFramework': 'ai_governance_builder',
    'DifficultConversationHelper': 'difficult_conversation_helper',
    'AIContentGenerator': 'ai_content_generator',
    'AIEmailComposer': 'ai_email_composer',
    'DocumentImprover': 'document_improver',
    'TemplateCreator': 'template_creator',
    'DocumentGenerator': 'document_generator',
    'AISocialMediaGenerator': 'ai_social_media_generator',
  };

  describe('Individual Component Loading', () => {
    directImportComponents.forEach(componentName => {
      it(`should load ${componentName} without object-to-primitive errors`, async () => {
        const elementType = componentTypeMap[componentName];
        const element = createTestElement({
          type: elementType,
          title: `Test ${componentName}`,
          content: `Testing ${componentName} component`,
        });

        const lessonContext = createTestLessonContext();

        const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
          return render(
            <InteractiveElementRenderer
              element={element}
              lessonId={1}
              lessonContext={lessonContext}
              onElementComplete={vi.fn()}
            />
          );
        });

        // Check that component rendered
        const componentElement = screen.getByText(/test/i);
        expect(componentElement).toBeInTheDocument();

        // Check performance
        expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
      });
    });
  });

  describe('Batch Component Loading', () => {
    it('should load multiple components simultaneously without degradation', async () => {
      const elements = directImportComponents.slice(0, 10).map((componentName, index) => 
        createTestElement({
          id: index + 1,
          type: componentTypeMap[componentName],
          title: `Batch Test ${componentName}`,
          content: `Batch testing ${componentName}`,
        })
      );

      const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
        return render(
          <div>
            {elements.map(element => (
              <InteractiveElementRenderer
                key={element.id}
                element={element}
                lessonId={1}
                lessonContext={createTestLessonContext()}
                onElementComplete={vi.fn()}
              />
            ))}
          </div>
        );
      });

      // Should render all components
      elements.forEach(element => {
        expect(screen.getByText(element.title)).toBeInTheDocument();
      });

      // Batch loading should still be reasonably fast
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS * 2);
    });

    it('should handle mixed component types without interference', async () => {
      const mixedElements = [
        createTestElement({ 
          id: 1, 
          type: 'callout_box', 
          title: 'Callout Test',
          configuration: { variant: 'info' }
        }),
        createTestElement({ 
          id: 2, 
          type: 'lyra_chat', 
          title: 'Chat Test',
          configuration: { minExchanges: 3 }
        }),
        createTestElement({ 
          id: 3, 
          type: 'knowledge_check', 
          title: 'Quiz Test',
          configuration: { 
            questions: [{ 
              question: 'Test?', 
              options: ['A', 'B'], 
              correct: 0 
            }] 
          }
        }),
        createTestElement({ 
          id: 4, 
          type: 'ai_content_generator', 
          title: 'Maya Content Test',
          configuration: { character: 'maya' }
        }),
      ];

      render(
        <div>
          {mixedElements.map(element => (
            <InteractiveElementRenderer
              key={element.id}
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          ))}
        </div>
      );

      // All should render without interference
      mixedElements.forEach(element => {
        expect(screen.getByText(element.title)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Context Integration', () => {
    it('should pass lesson context to components that need it', () => {
      const chatElement = createTestElement({
        type: 'lyra_chat',
        title: 'Context Chat Test',
      });

      const lessonContext = {
        chapterTitle: 'Integration Test Chapter',
        lessonTitle: 'Integration Test Lesson',
        content: 'This lesson tests context passing.',
      };

      render(
        <InteractiveElementRenderer
          element={chatElement}
          lessonId={1}
          lessonContext={lessonContext}
          onElementComplete={vi.fn()}
        />
      );

      expect(screen.getByText('Context Chat Test')).toBeInTheDocument();
    });

    it('should handle missing lesson context gracefully', () => {
      const element = createTestElement({
        type: 'lyra_chat',
        title: 'No Context Test',
      });

      expect(() => render(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={undefined}
          onElementComplete={vi.fn()}
        />
      )).not.toThrow();
    });
  });

  describe('Error Recovery Integration', () => {
    it('should recover from component errors without affecting other components', () => {
      const goodElement = createTestElement({
        id: 1,
        type: 'callout_box',
        title: 'Good Component',
      });

      const problematicElement = createTestElement({
        id: 2,
        type: 'knowledge_check',
        title: 'Problematic Component',
        configuration: { 
          questions: null, // This might cause issues
        },
      });

      render(
        <div>
          <InteractiveElementRenderer
            element={goodElement}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
          <InteractiveElementRenderer
            element={problematicElement}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        </div>
      );

      // Good component should still render
      expect(screen.getByText('Good Component')).toBeInTheDocument();
      
      // Problematic component should either render or show error boundary
      expect(screen.getByText(/problematic/i) || screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  describe('Memory Management', () => {
    it('should properly clean up components on unmount', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Memory Test Component',
      });

      const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
        const { unmount } = render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );

        // Wait for component to stabilize
        await waitFor(() => {
          expect(screen.getByText('Memory Test Component')).toBeInTheDocument();
        });

        // Unmount component
        unmount();

        // Wait for cleanup
        await waitFor(() => {}, { timeout: 100 });
      });

      // Memory usage should be reasonable
      const memoryMB = memoryDelta / (1024 * 1024);
      expect(memoryMB).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
    });
  });
});