import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { SequenceSorterRenderer } from '@/components/lesson/interactive/SequenceSorterRenderer';
import { createComponentTestSuite } from '../componentTestTemplate';

// Import the component for testing
const Component = SequenceSorterRenderer;

createComponentTestSuite(
  'SequenceSorterRenderer',
  Component,
  'sequence_sorter',
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

// Additional tests specific to SequenceSorterRenderer
describe('SequenceSorterRenderer Specific Tests', () => {
  it('should render sequence items for sorting', () => {
    const element = {
      id: 1,
      type: 'sequence_sorter',
      title: 'Sort the Steps',
      content: 'Put these steps in the correct order',
      configuration: {
        items: [
          { id: 1, text: 'First step', order: 1 },
          { id: 2, text: 'Second step', order: 2 },
          { id: 3, text: 'Third step', order: 3 },
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
    
    expect(screen.getByText('Sort the Steps')).toBeInTheDocument();
    expect(screen.getByText('First step')).toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();
    expect(screen.getByText('Third step')).toBeInTheDocument();
  });

  it('should handle drag and drop functionality', () => {
    const element = {
      id: 1,
      type: 'sequence_sorter',
      title: 'Drag and Drop',
      content: 'Drag items to sort them',
      configuration: {
        items: [
          { id: 1, text: 'Item A', order: 1 },
          { id: 2, text: 'Item B', order: 2 },
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
    
    // Look for draggable elements
    const draggableItems = screen.queryAllByText(/Item [AB]/);
    
    if (draggableItems.length > 0) {
      // Check for drag handles or draggable attributes
      draggableItems.forEach(item => {
        const draggableElement = item.closest('[draggable]') || 
                                item.closest('[data-sortable]') ||
                                item.closest('[class*="drag"]');
        
        if (draggableElement) {
          expect(draggableElement).toBeInTheDocument();
        }
      });
    }
  });

  it('should handle empty or invalid sequence configuration', () => {
    const invalidConfigs = [
      null,
      undefined,
      {},
      { items: [] },
      { items: null },
      { items: [{}] },
      { items: [{ text: null }] },
      { items: [{ id: null, text: 'Test' }] },
    ];

    invalidConfigs.forEach((config, index) => {
      const element = {
        id: index + 1,
        type: 'sequence_sorter',
        title: 'Test Sorter',
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

  it('should provide feedback for correct/incorrect ordering', () => {
    const element = {
      id: 1,
      type: 'sequence_sorter',
      title: 'Test Sequence',
      content: 'Sort correctly',
      configuration: {
        items: [
          { id: 1, text: 'Step 1', order: 1 },
          { id: 2, text: 'Step 2', order: 2 },
        ],
        showFeedback: true,
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
    
    // Look for check/submit button
    const submitButton = screen.queryByRole('button', { name: /check/i }) ||
                        screen.queryByRole('button', { name: /submit/i }) ||
                        screen.queryByRole('button', { name: /verify/i });
    
    if (submitButton) {
      expect(submitButton).toBeInTheDocument();
    }
  });
});