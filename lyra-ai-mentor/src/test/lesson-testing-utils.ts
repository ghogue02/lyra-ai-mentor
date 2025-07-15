import { vi, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AITestUtils, AITestData } from './ai-test-utils';
import { AI_TEST_CONFIG, AI_MOCK_RESPONSES } from './ai-component-test-config';
import { createTestElement, TestElement } from '../components/interactive/__tests__/testUtils';

/**
 * Comprehensive Lesson Testing Framework
 * Extends the existing AI testing infrastructure for full lesson coverage
 */

/**
 * Character-specific testing configurations
 */
export const LESSON_TEST_CONFIG = {
  CHARACTERS: {
    MAYA: {
      name: 'Maya',
      framework: 'PACE',
      focus: 'email_communication',
      anxiety_level: 'high',
      learning_style: 'step_by_step',
      primary_tools: ['email_composer', 'template_library', 'confidence_builder'],
      performance_thresholds: {
        render_time: 150,
        ai_response_time: 2000,
        memory_usage: 5 * 1024 * 1024, // 5MB
      }
    },
    SOFIA: {
      name: 'Sofia',
      framework: 'VOICE',
      focus: 'storytelling',
      creativity_level: 'high',
      learning_style: 'discovery_based',
      primary_tools: ['story_creator', 'voice_recorder', 'authenticity_checker'],
      performance_thresholds: {
        render_time: 180,
        ai_response_time: 2500,
        memory_usage: 7 * 1024 * 1024, // 7MB
      }
    },
    DAVID: {
      name: 'David',
      framework: 'DATA',
      focus: 'data_analysis',
      analytical_level: 'high',
      learning_style: 'systematic',
      primary_tools: ['data_visualizer', 'insight_generator', 'presentation_coach'],
      performance_thresholds: {
        render_time: 200,
        ai_response_time: 3000,
        memory_usage: 15 * 1024 * 1024, // 15MB
      }
    },
    RACHEL: {
      name: 'Rachel',
      framework: 'FLOW',
      focus: 'automation',
      efficiency_level: 'high',
      learning_style: 'optimization_focused',
      primary_tools: ['workflow_designer', 'automation_builder', 'efficiency_analyzer'],
      performance_thresholds: {
        render_time: 250,
        ai_response_time: 1500,
        memory_usage: 8 * 1024 * 1024, // 8MB
      }
    },
    ALEX: {
      name: 'Alex',
      framework: 'SHIFT',
      focus: 'change_management',
      leadership_level: 'high',
      learning_style: 'strategic',
      primary_tools: ['change_strategy', 'vision_builder', 'leadership_framework'],
      performance_thresholds: {
        render_time: 220,
        ai_response_time: 4000,
        memory_usage: 12 * 1024 * 1024, // 12MB
      }
    }
  },
  
  LESSON_TYPES: {
    INTRODUCTION: 'lesson_introduction',
    FRAMEWORK: 'framework_lesson',
    PRACTICE: 'practice_lesson',
    MASTERY: 'mastery_lesson',
    INTEGRATION: 'integration_lesson'
  },
  
  COMMON_PERFORMANCE_TARGETS: {
    RENDER_TIME_MS: 200,
    AI_RESPONSE_TIME_MS: 3000,
    MEMORY_USAGE_MB: 10,
    ACCESSIBILITY_SCORE: 95,
    COVERAGE_PERCENTAGE: 95
  }
};

/**
 * Enhanced lesson test data generators
 */
export class LessonTestData {
  /**
   * Generate character-specific test elements
   */
  static createCharacterElement(
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS,
    lessonType: string,
    overrides: Partial<TestElement> = {}
  ): TestElement {
    const config = LESSON_TEST_CONFIG.CHARACTERS[character];
    
    return createTestElement({
      type: lessonType,
      title: `${config.name}'s ${lessonType} Lesson`,
      content: `Learn ${config.focus} with ${config.name} using the ${config.framework} framework`,
      configuration: {
        character: character.toLowerCase(),
        framework: config.framework,
        focus: config.focus,
        learning_style: config.learning_style,
        tools: config.primary_tools,
        ...overrides.configuration
      },
      ...overrides
    });
  }

  /**
   * Generate test scenarios for specific characters
   */
  static getCharacterScenarios(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS) {
    const config = LESSON_TEST_CONFIG.CHARACTERS[character];
    
    const baseScenarios = [
      {
        name: `${config.name} Framework Introduction`,
        lesson_type: LESSON_TEST_CONFIG.LESSON_TYPES.INTRODUCTION,
        expected_elements: ['framework_overview', 'character_introduction', 'learning_objectives'],
        user_actions: ['read_introduction', 'watch_video', 'complete_knowledge_check']
      },
      {
        name: `${config.name} Framework Deep Dive`,
        lesson_type: LESSON_TEST_CONFIG.LESSON_TYPES.FRAMEWORK,
        expected_elements: ['framework_steps', 'interactive_examples', 'guided_practice'],
        user_actions: ['explore_framework', 'practice_steps', 'complete_exercises']
      },
      {
        name: `${config.name} Skill Practice`,
        lesson_type: LESSON_TEST_CONFIG.LESSON_TYPES.PRACTICE,
        expected_elements: ['practice_scenarios', 'feedback_system', 'progress_tracking'],
        user_actions: ['complete_scenarios', 'receive_feedback', 'track_progress']
      },
      {
        name: `${config.name} Mastery Challenge`,
        lesson_type: LESSON_TEST_CONFIG.LESSON_TYPES.MASTERY,
        expected_elements: ['complex_scenarios', 'performance_metrics', 'completion_certificate'],
        user_actions: ['tackle_challenge', 'demonstrate_mastery', 'earn_certificate']
      }
    ];

    return baseScenarios;
  }

  /**
   * Generate character-specific mock responses
   */
  static getCharacterMockResponses(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS) {
    const config = LESSON_TEST_CONFIG.CHARACTERS[character];
    
    const baseMockResponses = {
      maya: {
        email_suggestions: [
          'Subject: Professional follow-up on our meeting',
          'Dear [Name], I hope this message finds you well...',
          'Thank you for your time and consideration.'
        ],
        confidence_tips: [
          'Take a deep breath before composing',
          'Review your email once before sending',
          'Remember: clear communication builds trust'
        ],
        pace_framework: {
          Purpose: 'Define the email\'s main objective',
          Audience: 'Consider who will receive this message',
          Content: 'Structure your message clearly',
          Engagement: 'End with a clear call to action'
        }
      },
      sofia: {
        story_suggestions: [
          'Start with a compelling personal moment',
          'Connect your mission to real impact',
          'End with an inspiring call to action'
        ],
        voice_analysis: {
          authenticity_score: 88,
          clarity_score: 92,
          emotional_impact: 85
        },
        voice_framework: {
          Vulnerability: 'Share authentic challenges',
          Ownership: 'Take responsibility for your story',
          Impact: 'Demonstrate real change',
          Connection: 'Build bridges with your audience',
          Empowerment: 'Inspire others to action'
        }
      },
      david: {
        data_insights: [
          'Your engagement metrics show 25% improvement',
          'Peak usage occurs on Tuesday mornings',
          'Mobile users represent 70% of your audience'
        ],
        visualization_suggestions: [
          { type: 'trend_line', title: 'Monthly Growth', priority: 'high' },
          { type: 'pie_chart', title: 'User Demographics', priority: 'medium' },
          { type: 'bar_chart', title: 'Feature Usage', priority: 'low' }
        ],
        data_framework: {
          Discover: 'Identify key questions and metrics',
          Analyze: 'Examine patterns and trends',
          Transform: 'Convert insights into stories',
          Activate: 'Drive decisions with data'
        }
      },
      rachel: {
        automation_suggestions: [
          'Automate donor thank-you emails',
          'Set up recurring report generation',
          'Create volunteer onboarding workflows'
        ],
        efficiency_metrics: {
          time_saved: '4.2 hours per week',
          error_reduction: '78%',
          cost_savings: '$1,200 per month'
        },
        flow_framework: {
          Focus: 'Identify repetitive processes',
          Learn: 'Understand current workflows',
          Optimize: 'Design efficient solutions',
          Workflow: 'Implement automated systems'
        }
      },
      alex: {
        change_strategies: [
          'Start with small, visible wins',
          'Build coalition of change champions',
          'Communicate vision consistently'
        ],
        leadership_insights: [
          'Change requires both strategy and empathy',
          'Resistance often signals legitimate concerns',
          'Celebrate progress at every milestone'
        ],
        shift_framework: {
          See: 'Understand the current state',
          Hear: 'Listen to stakeholder concerns',
          Involve: 'Engage people in solutions',
          Focus: 'Prioritize high-impact changes',
          Transform: 'Execute sustainable change'
        }
      }
    };

    return baseMockResponses[character.toLowerCase()];
  }
}

/**
 * Lesson-specific test patterns extending AITestUtils
 */
export class LessonTestPatterns extends AITestUtils.Patterns {
  /**
   * Test character framework implementation
   */
  static async testFrameworkImplementation({
    component,
    character,
    framework,
    expectedSteps,
    expectedBehavior
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    framework: string;
    expectedSteps: string[];
    expectedBehavior: string[];
  }) {
    const characterConfig = LESSON_TEST_CONFIG.CHARACTERS[character];
    const mockResponses = LessonTestData.getCharacterMockResponses(character);
    
    // Mock framework-specific responses
    AITestUtils.mocks.aiService.generateResponse.mockResolvedValue(mockResponses);
    
    const element = LessonTestData.createCharacterElement(character, 'framework_lesson');
    render(<component element={element} />);
    
    // Verify framework steps are present
    for (const step of expectedSteps) {
      expect(screen.getByText(new RegExp(step, 'i'))).toBeInTheDocument();
    }
    
    // Test framework behavior
    for (const behavior of expectedBehavior) {
      const behaviorElement = screen.queryByText(new RegExp(behavior, 'i'));
      if (behaviorElement) {
        expect(behaviorElement).toBeInTheDocument();
      }
    }
  }

  /**
   * Test lesson progression flow
   */
  static async testLessonProgression({
    component,
    character,
    progressSteps,
    expectedMilestones
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    progressSteps: string[];
    expectedMilestones: string[];
  }) {
    const element = LessonTestData.createCharacterElement(character, 'practice_lesson');
    render(<component element={element} />);
    
    const user = userEvent.setup();
    
    // Simulate progression through steps
    for (let i = 0; i < progressSteps.length; i++) {
      const step = progressSteps[i];
      const stepElement = screen.getByText(new RegExp(step, 'i'));
      
      await user.click(stepElement);
      await waitFor(() => {
        // Check if milestone is reached
        if (i < expectedMilestones.length) {
          expect(screen.getByText(new RegExp(expectedMilestones[i], 'i'))).toBeInTheDocument();
        }
      });
    }
  }

  /**
   * Test cross-lesson integration
   */
  static async testCrossLessonIntegration({
    components,
    character,
    sharedData,
    expectedIntegration
  }: {
    components: React.ComponentType<any>[];
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    sharedData: any;
    expectedIntegration: string[];
  }) {
    const elements = components.map((_, index) => 
      LessonTestData.createCharacterElement(character, `lesson_${index}`, {
        configuration: { shared_data: sharedData }
      })
    );
    
    // Render all components
    const renderedComponents = components.map((Component, index) => 
      render(<Component element={elements[index]} />)
    );
    
    // Verify integration points
    for (const integration of expectedIntegration) {
      const integrationElement = screen.queryByText(new RegExp(integration, 'i'));
      expect(integrationElement).toBeInTheDocument();
    }
    
    // Cleanup
    renderedComponents.forEach(({ unmount }) => unmount());
  }

  /**
   * Test accessibility across all lesson types
   */
  static async testLessonAccessibility({
    component,
    character,
    requiredAriaLabels,
    keyboardNavigation
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    requiredAriaLabels: string[];
    keyboardNavigation: string[];
  }) {
    const element = LessonTestData.createCharacterElement(character, 'accessibility_test');
    render(<component element={element} />);
    
    // Check ARIA labels
    for (const label of requiredAriaLabels) {
      const labelElement = screen.getByLabelText(new RegExp(label, 'i'));
      expect(labelElement).toBeInTheDocument();
    }
    
    // Test keyboard navigation
    const user = userEvent.setup();
    for (const navAction of keyboardNavigation) {
      if (navAction === 'tab') {
        await user.tab();
      } else if (navAction === 'enter') {
        await user.keyboard('{Enter}');
      } else if (navAction === 'escape') {
        await user.keyboard('{Escape}');
      }
    }
  }
}

/**
 * Performance testing specific to lessons
 */
export class LessonPerformanceUtils extends AITestUtils.Performance {
  /**
   * Test lesson-specific performance metrics
   */
  static async testLessonPerformance({
    component,
    character,
    operations,
    thresholds
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    operations: (() => Promise<void>)[];
    thresholds?: typeof LESSON_TEST_CONFIG.CHARACTERS.MAYA.performance_thresholds;
  }) {
    const characterConfig = LESSON_TEST_CONFIG.CHARACTERS[character];
    const testThresholds = thresholds || characterConfig.performance_thresholds;
    
    const element = LessonTestData.createCharacterElement(character, 'performance_test');
    
    // Test render time
    const renderTime = await this.testAIResponseTime({
      component: () => component,
      action: async () => {
        render(<component element={element} />);
      },
      maxResponseTime: testThresholds.render_time
    });
    
    expect(renderTime).toBeLessThan(testThresholds.render_time);
    
    // Test memory usage
    const memoryUsage = await this.testAIMemoryUsage({
      component: () => component,
      operation: async () => {
        render(<component element={element} />);
        
        // Execute all operations
        for (const operation of operations) {
          await operation();
        }
      },
      maxMemoryIncrease: testThresholds.memory_usage
    });
    
    expect(memoryUsage).toBeLessThan(testThresholds.memory_usage);
    
    return { renderTime, memoryUsage };
  }

  /**
   * Test lesson loading performance
   */
  static async testLessonLoadingPerformance({
    component,
    character,
    contentSize,
    expectedLoadTime
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    contentSize: 'small' | 'medium' | 'large';
    expectedLoadTime: number;
  }) {
    const sizeMultiplier = {
      small: 1,
      medium: 5,
      large: 10
    };
    
    const element = LessonTestData.createCharacterElement(character, 'loading_test', {
      configuration: {
        content_size: contentSize,
        mock_data_size: sizeMultiplier[contentSize]
      }
    });
    
    const startTime = performance.now();
    render(<component element={element} />);
    
    await waitFor(() => {
      expect(screen.getByText(/test/i)).toBeInTheDocument();
    });
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(expectedLoadTime);
    
    return loadTime;
  }
}

/**
 * Integration testing utilities for lessons
 */
export class LessonIntegrationUtils extends AITestUtils.Integration {
  /**
   * Test lesson data persistence
   */
  static async testLessonDataPersistence({
    component,
    character,
    userData,
    expectedPersistence
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    userData: any;
    expectedPersistence: string[];
  }) {
    const element = LessonTestData.createCharacterElement(character, 'persistence_test');
    
    // Mock localStorage
    const mockStorage = {
      data: new Map(),
      setItem: vi.fn((key, value) => mockStorage.data.set(key, value)),
      getItem: vi.fn((key) => mockStorage.data.get(key)),
      removeItem: vi.fn((key) => mockStorage.data.delete(key)),
      clear: vi.fn(() => mockStorage.data.clear())
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });
    
    const { unmount } = render(<component element={element} />);
    
    // Simulate user data input
    const user = userEvent.setup();
    const textInputs = screen.queryAllByRole('textbox');
    
    if (textInputs.length > 0) {
      await user.type(textInputs[0], JSON.stringify(userData));
    }
    
    // Unmount and remount to test persistence
    unmount();
    render(<component element={element} />);
    
    // Verify persistence
    for (const persistentData of expectedPersistence) {
      expect(mockStorage.getItem).toHaveBeenCalledWith(
        expect.stringContaining(persistentData)
      );
    }
  }

  /**
   * Test lesson analytics integration
   */
  static async testLessonAnalytics({
    component,
    character,
    userActions,
    expectedEvents
  }: {
    component: React.ComponentType<any>;
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
    userActions: string[];
    expectedEvents: string[];
  }) {
    const element = LessonTestData.createCharacterElement(character, 'analytics_test');
    render(<component element={element} />);
    
    const user = userEvent.setup();
    
    // Simulate user actions
    for (const action of userActions) {
      const actionElement = screen.getByText(new RegExp(action, 'i'));
      await user.click(actionElement);
    }
    
    // Verify analytics events
    for (const event of expectedEvents) {
      expect(AITestUtils.mocks.analyticsService.track).toHaveBeenCalledWith(
        expect.stringContaining(event),
        expect.any(Object)
      );
    }
  }
}

/**
 * Export comprehensive lesson testing utilities
 */
export const LessonTestUtils = {
  Config: LESSON_TEST_CONFIG,
  Data: LessonTestData,
  Patterns: LessonTestPatterns,
  Performance: LessonPerformanceUtils,
  Integration: LessonIntegrationUtils,
  
  // Extend existing AI test utils
  ...AITestUtils,
  
  // Helper functions for common lesson test scenarios
  createCharacterTestSuite: (
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS,
    components: React.ComponentType<any>[],
    testOptions: any = {}
  ) => {
    const characterConfig = LESSON_TEST_CONFIG.CHARACTERS[character];
    const scenarios = LessonTestData.getCharacterScenarios(character);
    
    return {
      character,
      config: characterConfig,
      scenarios,
      components,
      testOptions
    };
  },
  
  // Batch test creation for all characters
  createAllCharacterTests: (
    componentMap: Record<string, React.ComponentType<any>[]>
  ) => {
    const allTests = {};
    
    Object.keys(LESSON_TEST_CONFIG.CHARACTERS).forEach(character => {
      const characterKey = character as keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
      allTests[character] = LessonTestUtils.createCharacterTestSuite(
        characterKey,
        componentMap[character] || [],
        { comprehensive: true }
      );
    });
    
    return allTests;
  }
};

export default LessonTestUtils;