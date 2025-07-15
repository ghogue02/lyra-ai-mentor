import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { 
  createTestElement,
  createProblematicElement,
  createTestLessonContext,
  RegressionTestUtils,
} from '@/components/interactive/__tests__/testUtils';

describe('Object-to-Primitive Regression Tests', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console methods to catch any object-to-primitive errors
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Core Object-to-Primitive Error Prevention', () => {
    it('should never throw "Cannot convert object to primitive value" errors', async () => {
      const problematicConfigurations = [
        // Circular references
        (() => {
          const circular: any = { type: 'circular' };
          circular.self = circular;
          return circular;
        })(),
        
        // Complex nested objects
        {
          level1: {
            level2: {
              level3: {
                level4: { value: 'deep' },
                array: [{ nested: true }],
              },
            },
          },
        },
        
        // Objects with functions
        {
          method: () => 'test',
          arrow: () => ({ result: 'value' }),
          asyncMethod: async () => 'async',
        },
        
        // Objects with symbols
        {
          [Symbol('test')]: 'symbol value',
          [Symbol.iterator]: function* () { yield 1; },
        },
        
        // Objects with getters/setters
        (() => {
          const obj: any = {};
          Object.defineProperty(obj, 'computed', {
            get() { return this; }, // Returns self, potential for issues
            set(value) { this._value = value; },
          });
          return obj;
        })(),
        
        // Arrays with complex objects
        [
          { item: 1, self: null },
          { item: 2, nested: { deep: { value: true } } },
          function() { return 'function in array'; },
        ],
        
        // Date objects and other built-ins
        {
          date: new Date(),
          regexp: /test/gi,
          map: new Map([['key', { complex: 'value' }]]),
          set: new Set([{ unique: 'item' }]),
        },
        
        // Null and undefined edge cases
        {
          nullValue: null,
          undefinedValue: undefined,
          emptyString: '',
          zero: 0,
          false: false,
        },
      ];

      for (const [index, config] of problematicConfigurations.entries()) {
        const element = createTestElement({
          id: index + 1,
          type: 'ai_content_generator',
          title: `Object-to-Primitive Test ${index + 1}`,
          content: 'Testing problematic configuration',
          configuration: config,
        });

        const { safe, errors } = await RegressionTestUtils.testObjectToPrimitiveSafety(
          InteractiveElementRenderer,
          {
            element,
            lessonId: 1,
            lessonContext: createTestLessonContext(),
            onElementComplete: vi.fn(),
          }
        );

        expect(safe).toBe(true);
        expect(errors).toHaveLength(0);

        if (errors.length > 0) {
          console.error(`Object-to-primitive errors in configuration ${index + 1}:`, errors);
        }
      }
    });

    it('should handle string coercion safely in all component types', () => {
      const componentTypes = [
        'callout_box',
        'lyra_chat',
        'knowledge_check',
        'reflection',
        'sequence_sorter',
        'ai_content_generator',
        'ai_email_composer',
        'document_generator',
        'template_creator',
        'meeting_prep_assistant',
        'research_assistant',
        'workflow_automator',
        'change_leader',
      ];

      componentTypes.forEach(type => {
        const problematicProps = {
          // Props that might cause string coercion issues
          title: { toString: () => 'Complex Title Object' },
          content: { valueOf: () => 'Complex Content Object' },
          configuration: {
            stringLike: { toString: () => 'string-like' },
            numberLike: { valueOf: () => 42 },
            mixed: { toString: () => 'mixed', valueOf: () => 99 },
          },
        };

        const element = createTestElement({
          type,
          ...problematicProps,
        });

        expect(() => {
          render(
            <InteractiveElementRenderer
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );
        }).not.toThrow();

        // Check that no object-to-primitive errors were logged
        const errorCalls = consoleErrorSpy.mock.calls.filter(call =>
          call.join(' ').includes('Cannot convert object to primitive')
        );
        expect(errorCalls).toHaveLength(0);
      });
    });
  });

  describe('Element Property Safety', () => {
    it('should safely handle non-string element properties', () => {
      const problematicElements = [
        // Title as object
        createTestElement({
          title: { value: 'Object Title', toString: () => 'Object Title' },
          type: 'callout_box',
        }),
        
        // Content as object
        createTestElement({
          content: { text: 'Object Content', toString: () => 'Object Content' },
          type: 'ai_content_generator',
        }),
        
        // Type as object (edge case)
        createTestElement({
          type: { value: 'callout_box', toString: () => 'callout_box' },
        }),
        
        // Order index as object
        createTestElement({
          order_index: { value: 1, valueOf: () => 1 },
          type: 'knowledge_check',
        }),
        
        // ID as object
        createTestElement({
          id: { value: 999, valueOf: () => 999 },
          type: 'reflection',
        }),
      ];

      problematicElements.forEach((element, index) => {
        expect(() => {
          render(
            <InteractiveElementRenderer
              element={element as any}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );
        }).not.toThrow();

        // Verify no object-to-primitive errors
        const errorCalls = consoleErrorSpy.mock.calls.filter(call =>
          call.join(' ').includes('Cannot convert object to primitive')
        );
        expect(errorCalls).toHaveLength(0);
      });
    });
  });

  describe('Configuration Object Safety', () => {
    it('should handle deeply nested configuration objects', () => {
      const deepConfig = {};
      let current = deepConfig;
      
      // Create a deeply nested object (20 levels deep)
      for (let i = 0; i < 20; i++) {
        current.level = { value: i };
        current = current.level;
      }

      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Deep Config Test',
        configuration: deepConfig,
      });

      expect(() => {
        render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );
      }).not.toThrow();
    });

    it('should handle configuration with mixed data types', () => {
      const mixedConfig = {
        string: 'normal string',
        number: 42,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 'two', { three: 3 }],
        object: { nested: { value: 'deep' } },
        date: new Date(),
        regexp: /pattern/,
        function: () => 'function',
        symbol: Symbol('test'),
        map: new Map([['key', 'value']]),
        set: new Set([1, 2, 3]),
        buffer: Buffer.from('test') || new Uint8Array([1, 2, 3]),
      };

      const element = createTestElement({
        type: 'document_generator',
        title: 'Mixed Config Test',
        configuration: mixedConfig,
      });

      expect(() => {
        render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Template Literal Safety', () => {
    it('should safely handle objects in template literals', () => {
      const objectWithToString = {
        value: 'test',
        toString: () => 'custom string representation',
      };

      const objectWithoutToString = {
        value: 'test',
        // No toString method - should use default [object Object]
      };

      const element = createTestElement({
        type: 'callout_box',
        title: `Title with object: ${objectWithToString}`,
        content: `Content with object: ${objectWithoutToString}`,
        configuration: {
          template: `Template with object: ${objectWithToString}`,
        },
      });

      expect(() => {
        render(
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should catch object-to-primitive errors in error boundaries', () => {
      const problematicElement = createTestElement({
        type: 'knowledge_check',
        title: 'Error Boundary Test',
        configuration: {
          // This configuration might cause issues in string concatenation
          questions: [
            {
              question: { text: 'What is AI?', toString: () => { throw new Error('Cannot convert object to primitive'); } },
              options: ['A', 'B', 'C'],
              correct: 0,
            },
          ],
        },
      });

      // Should not crash the entire application
      expect(() => {
        render(
          <InteractiveElementRenderer
            element={problematicElement}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Character Component Safety', () => {
    const characterComponents = [
      { character: 'maya', type: 'ai_email_composer', lessonId: 6 },
      { character: 'sofia', type: 'ai_content_generator', lessonId: 12 },
      { character: 'david', type: 'data_storyteller', lessonId: 16 },
      { character: 'rachel', type: 'workflow_automator', lessonId: 19 },
      { character: 'alex', type: 'change_leader', lessonId: 23 },
    ];

    characterComponents.forEach(({ character, type, lessonId }) => {
      it(`should handle ${character} component object-to-primitive safety`, () => {
        const element = createTestElement({
          type,
          title: `${character} Safety Test`,
          configuration: {
            character,
            scenario: { type: 'complex', data: { nested: 'value' } },
            options: [
              { label: { toString: () => 'Option 1' }, value: 'opt1' },
              { label: { toString: () => 'Option 2' }, value: 'opt2' },
            ],
          },
        });

        expect(() => {
          render(
            <InteractiveElementRenderer
              element={element}
              lessonId={lessonId}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          );
        }).not.toThrow();

        // Verify no errors were logged
        const errorCalls = consoleErrorSpy.mock.calls.filter(call =>
          call.join(' ').includes('Cannot convert object to primitive')
        );
        expect(errorCalls).toHaveLength(0);
      });
    });
  });

  describe('Automated Regression Detection', () => {
    it('should run comprehensive prop variation tests on all direct import components', async () => {
      const directImportTypes = [
        'callout_box',
        'lyra_chat',
        'knowledge_check',
        'reflection',
        'sequence_sorter',
        'ai_email_composer',
        'prompt_builder',
        'document_generator',
        'meeting_prep_assistant',
        'research_assistant',
        'ai_content_generator',
        'document_improver',
        'template_creator',
        'data_storyteller',
        'workflow_automator',
        'process_optimizer',
        'impact_measurement',
        'integration_builder',
        'change_leader',
        'ai_governance_builder',
        'innovation_roadmap',
        'difficult_conversation_helper',
        'ai_social_media_generator',
      ];

      const results = [];

      for (const type of directImportTypes) {
        const baseProps = {
          element: createTestElement({ type }),
          lessonId: 1,
          lessonContext: createTestLessonContext(),
          onElementComplete: vi.fn(),
        };

        const { passed, failed, errors } = await RegressionTestUtils.testPropVariations(
          InteractiveElementRenderer,
          baseProps
        );

        results.push({ type, passed, failed, errors });

        expect(failed).toBe(0);
        
        if (errors.length > 0) {
          console.error(`Object-to-primitive errors in ${type}:`, errors);
        }
      }

      // Summary report
      const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
      const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
      const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

      console.log(`Regression test summary: ${totalPassed} passed, ${totalFailed} failed, ${totalErrors} errors`);
      
      expect(totalFailed).toBe(0);
      expect(totalErrors).toBe(0);
    });
  });
});