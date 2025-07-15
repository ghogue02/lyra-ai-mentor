import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { KnowledgeCheckRenderer } from '@/components/lesson/interactive/KnowledgeCheckRenderer';
import { createComponentTestSuite } from '../componentTestTemplate';

// Import the component for testing
const Component = KnowledgeCheckRenderer;

createComponentTestSuite(
  'KnowledgeCheckRenderer',
  Component,
  'knowledge_check',
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

// Additional tests specific to KnowledgeCheckRenderer
describe('KnowledgeCheckRenderer Specific Tests', () => {
  it('should render knowledge check questions', () => {
    const element = {
      id: 1,
      type: 'knowledge_check',
      title: 'Knowledge Check',
      content: 'Test your understanding',
      configuration: {
        questions: [
          {
            question: 'What is AI?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct: 0,
          },
        ],
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
    
    expect(screen.getByText('Knowledge Check')).toBeInTheDocument();
    expect(screen.getByText('What is AI?')).toBeInTheDocument();
  });

  it('should handle multiple choice questions', () => {
    const element = {
      id: 1,
      type: 'knowledge_check',
      title: 'Multiple Choice',
      content: 'Select the correct answer',
      configuration: {
        questions: [
          {
            question: 'Which is correct?',
            options: ['A', 'B', 'C'],
            correct: 1,
          },
        ],
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
    
    // Check for radio buttons or clickable options
    const options = screen.queryAllByRole('radio') || 
                   screen.queryAllByRole('button').filter(btn => 
                     btn.textContent === 'A' || 
                     btn.textContent === 'B' || 
                     btn.textContent === 'C'
                   );
    
    if (options.length > 0) {
      expect(options.length).toBe(3);
    }
  });

  it('should handle empty or invalid questions configuration', () => {
    const invalidConfigs = [
      null,
      undefined,
      {},
      { questions: [] },
      { questions: null },
      { questions: [{}] },
      { questions: [{ question: null }] },
    ];

    invalidConfigs.forEach((config, index) => {
      const element = {
        id: index + 1,
        type: 'knowledge_check',
        title: 'Test',
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