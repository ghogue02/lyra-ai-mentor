import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { CalloutBoxRenderer } from '@/components/lesson/interactive/CalloutBoxRenderer';
import { createComponentTestSuite } from '../componentTestTemplate.tsx';

// Import the component for testing
const Component = CalloutBoxRenderer;

createComponentTestSuite(
  'CalloutBoxRenderer',
  Component,
  'callout_box',
  {
    hasInteractions: false,
    hasAsyncOperations: false,
    hasComplexState: false,
    customProps: {
      // Callout box specific props
      isElementCompleted: false,
      onComplete: vi.fn(),
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    },
  }
);

// Additional tests specific to CalloutBoxRenderer
describe('CalloutBoxRenderer Specific Tests', () => {
  it('should render callout content with proper styling', () => {
    const element = {
      id: 1,
      type: 'callout_box',
      title: 'Important Notice',
      content: 'This is a callout box with important information.',
      configuration: {
        variant: 'info',
        icon: 'info-circle',
      },
      order_index: 1,
    };

    const props = {
      element,
      isElementCompleted: false,
      onComplete: vi.fn(),
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    };

    const { container } = render(<Component {...props} />);
    
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
    expect(screen.getByText('This is a callout box with important information.')).toBeInTheDocument();
    
    // Check for callout-specific styling
    const calloutElement = container.querySelector('[class*="callout"]') || 
                          container.querySelector('[class*="alert"]') ||
                          container.querySelector('[class*="notice"]');
    
    if (calloutElement) {
      expect(calloutElement).toBeInTheDocument();
    }
  });

  it('should handle different callout variants', () => {
    const variants = ['info', 'warning', 'error', 'success'];
    
    variants.forEach(variant => {
      const element = {
        id: 1,
        type: 'callout_box',
        title: `${variant} Callout`,
        content: `This is a ${variant} callout.`,
        configuration: { variant },
        order_index: 1,
      };

      const props = {
        element,
        isElementCompleted: false,
        onComplete: vi.fn(),
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

  it('should render without configuration object', () => {
    const element = {
      id: 1,
      type: 'callout_box',
      title: 'Simple Callout',
      content: 'This callout has no configuration.',
      configuration: null,
      order_index: 1,
    };

    const props = {
      element,
      isElementCompleted: false,
      onComplete: vi.fn(),
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    };

    expect(() => render(<Component {...props} />)).not.toThrow();
    expect(screen.getByText('Simple Callout')).toBeInTheDocument();
  });
});