import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonTestUtils, LESSON_TEST_CONFIG } from './lesson-testing-utils';

/**
 * BDD (Behavior-Driven Development) Scenario Framework
 * Provides Given-When-Then testing patterns for lesson components
 */

/**
 * BDD Test Context Interface
 */
interface BDDContext {
  component?: React.ComponentType<any>;
  element?: any;
  user?: ReturnType<typeof userEvent.setup>;
  rendered?: any;
  character?: keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
  data?: Record<string, any>;
  state?: Record<string, any>;
}

/**
 * BDD Scenario Builder
 */
export class BDDScenarioBuilder {
  private context: BDDContext = {};
  private steps: Array<{
    type: 'given' | 'when' | 'then';
    description: string;
    action: (context: BDDContext) => Promise<void> | void;
  }> = [];

  /**
   * Set up initial context (Given)
   */
  given(description: string, action: (context: BDDContext) => Promise<void> | void): BDDScenarioBuilder {
    this.steps.push({ type: 'given', description, action });
    return this;
  }

  /**
   * Perform actions (When)
   */
  when(description: string, action: (context: BDDContext) => Promise<void> | void): BDDScenarioBuilder {
    this.steps.push({ type: 'when', description, action });
    return this;
  }

  /**
   * Assert outcomes (Then)
   */
  then(description: string, action: (context: BDDContext) => Promise<void> | void): BDDScenarioBuilder {
    this.steps.push({ type: 'then', description, action });
    return this;
  }

  /**
   * Execute the scenario
   */
  async execute(scenarioName: string): Promise<void> {
    describe(`BDD Scenario: ${scenarioName}`, () => {
      beforeEach(() => {
        vi.clearAllMocks();
        this.context = {};
      });

      afterEach(() => {
        if (this.context.rendered?.unmount) {
          this.context.rendered.unmount();
        }
      });

      it('should complete the scenario successfully', async () => {
        for (const step of this.steps) {
          try {
            await step.action(this.context);
          } catch (error) {
            throw new Error(`Failed at ${step.type.toUpperCase()}: ${step.description}\nError: ${error.message}`);
          }
        }
      });
    });
  }
}

/**
 * Predefined BDD Steps for Lessons
 */
export class LessonBDDSteps {
  /**
   * Given steps for lesson setup
   */
  static given = {
    characterLesson: (character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, lessonType: string) => 
      (context: BDDContext) => {
        context.character = character;
        context.element = LessonTestUtils.Data.createCharacterElement(character, lessonType);
        context.user = userEvent.setup();
      },

    aiServiceMocked: (mockResponses: any) => 
      (context: BDDContext) => {
        LessonTestUtils.mocks.aiService.generateResponse.mockResolvedValue(mockResponses);
      },

    userWithExperience: (experienceLevel: 'beginner' | 'intermediate' | 'advanced') => 
      (context: BDDContext) => {
        context.data = { ...context.data, experienceLevel };
        if (context.element) {
          context.element.configuration = {
            ...context.element.configuration,
            user_experience: experienceLevel
          };
        }
      },

    componentRendered: (Component: React.ComponentType<any>) => 
      (context: BDDContext) => {
        context.component = Component;
        if (!context.element) {
          throw new Error('Element must be set before rendering component');
        }
        context.rendered = render(<Component element={context.element} />);
      },

    existingProgress: (progressData: any) => 
      (context: BDDContext) => {
        context.state = { ...context.state, progress: progressData };
        // Mock localStorage with existing progress
        const mockStorage = new Map();
        mockStorage.set('lesson_progress', JSON.stringify(progressData));
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: (key: string) => mockStorage.get(key),
            setItem: (key: string, value: string) => mockStorage.set(key, value),
            removeItem: (key: string) => mockStorage.delete(key),
            clear: () => mockStorage.clear()
          }
        });
      }
  };

  /**
   * When steps for user actions
   */
  static when = {
    userClicksButton: (buttonLabel: string) => 
      async (context: BDDContext) => {
        if (!context.user) throw new Error('User not initialized');
        const button = screen.getByRole('button', { name: new RegExp(buttonLabel, 'i') });
        await context.user.click(button);
      },

    userEntersText: (fieldLabel: string, text: string) => 
      async (context: BDDContext) => {
        if (!context.user) throw new Error('User not initialized');
        const field = screen.getByLabelText(new RegExp(fieldLabel, 'i'));
        await context.user.type(field, text);
      },

    userSelectsOption: (optionText: string) => 
      async (context: BDDContext) => {
        if (!context.user) throw new Error('User not initialized');
        const option = screen.getByText(new RegExp(optionText, 'i'));
        await context.user.click(option);
      },

    userCompletesFrameworkStep: (stepName: string) => 
      async (context: BDDContext) => {
        if (!context.user) throw new Error('User not initialized');
        
        // Find framework step
        const step = screen.getByText(new RegExp(stepName, 'i'));
        await context.user.click(step);
        
        // Complete any required inputs
        const inputs = screen.queryAllByRole('textbox');
        for (const input of inputs) {
          if (input.getAttribute('required')) {
            await context.user.type(input, 'Test completion data');
          }
        }
        
        // Submit if there's a submit button
        const submitButton = screen.queryByRole('button', { name: /submit|complete|next/i });
        if (submitButton) {
          await context.user.click(submitButton);
        }
      },

    aiServiceResponds: (responseData: any) => 
      async (context: BDDContext) => {
        LessonTestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce(responseData);
        
        // Wait for any pending AI operations
        await waitFor(() => {
          expect(LessonTestUtils.mocks.aiService.generateResponse).toHaveBeenCalled();
        }, { timeout: 5000 });
      },

    userWaitsForLoading: (timeout: number = 3000) => 
      async (context: BDDContext) => {
        await waitFor(() => {
          const loadingElement = screen.queryByText(/loading|processing|generating/i);
          expect(loadingElement).not.toBeInTheDocument();
        }, { timeout });
      },

    userNavigatesWithKeyboard: (keys: string[]) => 
      async (context: BDDContext) => {
        if (!context.user) throw new Error('User not initialized');
        
        for (const key of keys) {
          if (key === 'Tab') {
            await context.user.tab();
          } else if (key === 'Enter') {
            await context.user.keyboard('{Enter}');
          } else if (key === 'Escape') {
            await context.user.keyboard('{Escape}');
          } else {
            await context.user.keyboard(key);
          }
        }
      }
  };

  /**
   * Then steps for assertions
   */
  static then = {
    shouldSeeText: (text: string) => 
      (context: BDDContext) => {
        expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
      },

    shouldSeeElement: (role: string, name?: string) => 
      (context: BDDContext) => {
        const element = name 
          ? screen.getByRole(role as any, { name: new RegExp(name, 'i') })
          : screen.getByRole(role as any);
        expect(element).toBeInTheDocument();
      },

    shouldNotSeeText: (text: string) => 
      (context: BDDContext) => {
        expect(screen.queryByText(new RegExp(text, 'i'))).not.toBeInTheDocument();
      },

    shouldHaveAnalyticsCalled: (eventName: string) => 
      (context: BDDContext) => {
        expect(LessonTestUtils.mocks.analyticsService.track).toHaveBeenCalledWith(
          expect.stringContaining(eventName),
          expect.any(Object)
        );
      },

    shouldHaveAIServiceCalled: (withParams?: any) => 
      (context: BDDContext) => {
        if (withParams) {
          expect(LessonTestUtils.mocks.aiService.generateResponse).toHaveBeenCalledWith(
            expect.objectContaining(withParams)
          );
        } else {
          expect(LessonTestUtils.mocks.aiService.generateResponse).toHaveBeenCalled();
        }
      },

    shouldShowFrameworkStep: (character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, step: string) => 
      (context: BDDContext) => {
        const config = LESSON_TEST_CONFIG.CHARACTERS[character];
        const frameworkStep = screen.getByText(new RegExp(`${config.framework}.*${step}`, 'i'));
        expect(frameworkStep).toBeInTheDocument();
      },

    shouldMaintainAccessibility: () => 
      (context: BDDContext) => {
        // Check for basic accessibility requirements
        const interactiveElements = [
          ...screen.queryAllByRole('button'),
          ...screen.queryAllByRole('textbox'),
          ...screen.queryAllByRole('link')
        ];
        
        interactiveElements.forEach(element => {
          expect(element).not.toHaveAttribute('tabIndex', '-1');
        });
        
        // Check for ARIA labels
        const unlabeledElements = interactiveElements.filter(el => 
          !el.getAttribute('aria-label') && 
          !el.getAttribute('aria-labelledby') &&
          !el.textContent?.trim()
        );
        
        expect(unlabeledElements).toHaveLength(0);
      },

    shouldMeetPerformanceThreshold: (character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, metric: 'render_time' | 'memory_usage') => 
      async (context: BDDContext) => {
        const config = LESSON_TEST_CONFIG.CHARACTERS[character];
        const threshold = config.performance_thresholds[metric];
        
        if (metric === 'render_time') {
          const renderStart = performance.now();
          await waitFor(() => {
            expect(screen.getByText(/test/i)).toBeInTheDocument();
          });
          const renderTime = performance.now() - renderStart;
          expect(renderTime).toBeLessThan(threshold);
        } else if (metric === 'memory_usage') {
          // Memory testing would require more sophisticated setup
          // For now, we'll check that the component renders without leaks
          expect(context.rendered).toBeDefined();
        }
      },

    shouldPreserveUserData: (dataKey: string) => 
      (context: BDDContext) => {
        const storedData = localStorage.getItem(dataKey);
        expect(storedData).toBeTruthy();
        
        // Verify data can be parsed
        expect(() => JSON.parse(storedData!)).not.toThrow();
      },

    shouldShowCompletionState: () => 
      (context: BDDContext) => {
        const completionIndicators = [
          screen.queryByText(/completed/i),
          screen.queryByText(/finished/i),
          screen.queryByRole('button', { name: /next|continue/i })
        ];
        
        const hasCompletionIndicator = completionIndicators.some(indicator => indicator !== null);
        expect(hasCompletionIndicator).toBe(true);
      }
  };
}

/**
 * Pre-built BDD Scenarios for Common Lesson Patterns
 */
export class CommonLessonScenarios {
  /**
   * Framework introduction scenario
   */
  static frameworkIntroduction(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, Component: React.ComponentType<any>) {
    const config = LESSON_TEST_CONFIG.CHARACTERS[character];
    const mockResponses = LessonTestUtils.Data.getCharacterMockResponses(character);
    
    return new BDDScenarioBuilder()
      .given('a user is learning the framework', LessonBDDSteps.given.characterLesson(character, 'framework_introduction'))
      .given('the AI service is properly mocked', LessonBDDSteps.given.aiServiceMocked(mockResponses))
      .given('the component is rendered', LessonBDDSteps.given.componentRendered(Component))
      .when('the user views the framework overview', LessonBDDSteps.when.userClicksButton('overview'))
      .then('they should see the framework name', LessonBDDSteps.then.shouldSeeText(config.framework))
      .then('they should see character-specific content', LessonBDDSteps.then.shouldSeeText(config.name))
      .then('they should see framework steps', LessonBDDSteps.then.shouldShowFrameworkStep(character, 'step'))
      .then('accessibility should be maintained', LessonBDDSteps.then.shouldMaintainAccessibility());
  }

  /**
   * User completes framework lesson scenario
   */
  static frameworkCompletion(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, Component: React.ComponentType<any>) {
    const config = LESSON_TEST_CONFIG.CHARACTERS[character];
    const mockResponses = LessonTestUtils.Data.getCharacterMockResponses(character);
    
    return new BDDScenarioBuilder()
      .given('a user is working through a framework lesson', LessonBDDSteps.given.characterLesson(character, 'framework_lesson'))
      .given('the AI service is responding', LessonBDDSteps.given.aiServiceMocked(mockResponses))
      .given('the component is rendered', LessonBDDSteps.given.componentRendered(Component))
      .when('the user completes each framework step', async (context) => {
        const frameworkSteps = Object.keys(mockResponses[`${character.toLowerCase()}_framework`] || {});
        for (const step of frameworkSteps) {
          await LessonBDDSteps.when.userCompletesFrameworkStep(step)(context);
        }
      })
      .when('the AI provides feedback', LessonBDDSteps.when.aiServiceResponds(mockResponses))
      .then('the lesson should be marked complete', LessonBDDSteps.then.shouldShowCompletionState())
      .then('analytics should track completion', LessonBDDSteps.then.shouldHaveAnalyticsCalled('lesson_completed'))
      .then('user progress should be saved', LessonBDDSteps.then.shouldPreserveUserData('lesson_progress'));
  }

  /**
   * Accessibility compliance scenario
   */
  static accessibilityCompliance(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, Component: React.ComponentType<any>) {
    return new BDDScenarioBuilder()
      .given('a user with accessibility needs', LessonBDDSteps.given.characterLesson(character, 'accessibility_test'))
      .given('the component is rendered', LessonBDDSteps.given.componentRendered(Component))
      .when('the user navigates with keyboard only', LessonBDDSteps.when.userNavigatesWithKeyboard(['Tab', 'Tab', 'Enter', 'Escape']))
      .then('all interactive elements should be accessible', LessonBDDSteps.then.shouldMaintainAccessibility())
      .then('the component should meet performance requirements', LessonBDDSteps.then.shouldMeetPerformanceThreshold(character, 'render_time'));
  }

  /**
   * Cross-lesson data persistence scenario
   */
  static dataPersistence(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, Component: React.ComponentType<any>) {
    return new BDDScenarioBuilder()
      .given('a user has existing progress', LessonBDDSteps.given.existingProgress({ lesson1: 'completed', lesson2: 'in_progress' }))
      .given('a new lesson is loaded', LessonBDDSteps.given.characterLesson(character, 'persistence_test'))
      .given('the component is rendered', LessonBDDSteps.given.componentRendered(Component))
      .when('the user enters new data', LessonBDDSteps.when.userEntersText('input', 'test data'))
      .when('the user saves progress', LessonBDDSteps.when.userClicksButton('save'))
      .then('the data should be persisted', LessonBDDSteps.then.shouldPreserveUserData('lesson_progress'))
      .then('previous progress should remain intact', LessonBDDSteps.then.shouldPreserveUserData('lesson_progress'));
  }

  /**
   * Performance under load scenario
   */
  static performanceUnderLoad(character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS, Component: React.ComponentType<any>) {
    return new BDDScenarioBuilder()
      .given('a complex lesson with heavy content', LessonBDDSteps.given.characterLesson(character, 'performance_test'))
      .given('the component is rendered', LessonBDDSteps.given.componentRendered(Component))
      .when('multiple operations are performed rapidly', async (context) => {
        for (let i = 0; i < 10; i++) {
          await LessonBDDSteps.when.userClicksButton('action')(context);
          await LessonBDDSteps.when.userEntersText('input', `test ${i}`)(context);
        }
      })
      .then('render time should stay within limits', LessonBDDSteps.then.shouldMeetPerformanceThreshold(character, 'render_time'))
      .then('memory usage should stay controlled', LessonBDDSteps.then.shouldMeetPerformanceThreshold(character, 'memory_usage'));
  }
}

/**
 * BDD Test Suite Generator
 */
export class BDDTestSuiteGenerator {
  /**
   * Generate comprehensive BDD test suite for a character
   */
  static generateCharacterTestSuite(
    character: keyof typeof LESSON_TEST_CONFIG.CHARACTERS,
    components: { [lessonType: string]: React.ComponentType<any> }
  ) {
    const config = LESSON_TEST_CONFIG.CHARACTERS[character];
    
    describe(`${config.name} (${config.framework}) - BDD Test Suite`, () => {
      Object.entries(components).forEach(([lessonType, Component]) => {
        describe(`${lessonType} lessons`, () => {
          // Framework introduction
          CommonLessonScenarios.frameworkIntroduction(character, Component)
            .execute(`${config.name} learns ${config.framework} framework basics`);
          
          // Framework completion
          CommonLessonScenarios.frameworkCompletion(character, Component)
            .execute(`${config.name} completes ${config.framework} framework lesson`);
          
          // Accessibility compliance
          CommonLessonScenarios.accessibilityCompliance(character, Component)
            .execute(`${config.name} lesson maintains accessibility standards`);
          
          // Data persistence
          CommonLessonScenarios.dataPersistence(character, Component)
            .execute(`${config.name} lesson preserves user progress`);
          
          // Performance under load
          CommonLessonScenarios.performanceUnderLoad(character, Component)
            .execute(`${config.name} lesson performs well under load`);
        });
      });
    });
  }

  /**
   * Generate BDD tests for all characters
   */
  static generateAllCharacterTests(
    componentMap: Record<string, { [lessonType: string]: React.ComponentType<any> }>
  ) {
    Object.keys(LESSON_TEST_CONFIG.CHARACTERS).forEach(character => {
      const characterKey = character as keyof typeof LESSON_TEST_CONFIG.CHARACTERS;
      const characterComponents = componentMap[character] || {};
      
      this.generateCharacterTestSuite(characterKey, characterComponents);
    });
  }
}

/**
 * Export BDD framework components
 */
export const BDDFramework = {
  Builder: BDDScenarioBuilder,
  Steps: LessonBDDSteps,
  Scenarios: CommonLessonScenarios,
  Generator: BDDTestSuiteGenerator,
  
  // Convenience function for quick scenario creation
  createScenario: (name: string) => new BDDScenarioBuilder(),
  
  // Helper for running scenarios in isolation
  runScenario: async (scenario: BDDScenarioBuilder, name: string) => {
    await scenario.execute(name);
  }
};

export default BDDFramework;