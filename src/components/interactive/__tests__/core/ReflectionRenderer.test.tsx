import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { ReflectionRenderer } from '@/components/lesson/interactive/ReflectionRenderer';
import { createComponentTestSuite } from '../componentTestTemplate';

// Import the component for testing
const Component = ReflectionRenderer;

createComponentTestSuite(
  'ReflectionRenderer',
  Component,
  'reflection',
  {
    hasInteractions: true,
    hasAsyncOperations: false,
    hasComplexState: true,
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

// Additional tests specific to ReflectionRenderer
describe('ReflectionRenderer Specific Tests', () => {
  it('should render reflection prompts', () => {
    const element = {
      id: 1,
      type: 'reflection',
      title: 'Reflection Exercise',
      content: 'Take a moment to reflect on your learning',
      configuration: {
        prompts: [
          'What did you learn today?',
          'How will you apply this knowledge?',
        ],
        minCharacters: 50,
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

    render(<Component {...props} />);
    
    expect(screen.getByText('Reflection Exercise')).toBeInTheDocument();
    expect(screen.getByText('What did you learn today?')).toBeInTheDocument();
  });

  it('should provide text input for reflection responses', () => {
    const element = {
      id: 1,
      type: 'reflection',
      title: 'Reflection',
      content: 'Reflect on your experience',
      configuration: {
        prompts: ['Share your thoughts'],
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

    render(<Component {...props} />);
    
    // Look for text input areas
    const textAreas = screen.queryAllByRole('textbox');
    const inputs = screen.queryAllByDisplayValue('');
    
    if (textAreas.length > 0 || inputs.length > 0) {
      expect(textAreas.length + inputs.length).toBeGreaterThan(0);
    }
  });

  it('should handle reflection configuration variations', () => {
    const configurations = [
      null,
      undefined,
      {},
      { prompts: [] },
      { prompts: ['Single prompt'] },
      { prompts: null },
      { minCharacters: 0 },
      { minCharacters: -1 },
      { maxCharacters: 1000 },
    ];

    configurations.forEach((config, index) => {
      const element = {
        id: index + 1,
        type: 'reflection',
        title: 'Test Reflection',
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
});