import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { MayaEmailConfidenceBuilder } from '@/components/interactive/MayaEmailConfidenceBuilder';
import { createComponentTestSuite } from '../componentTestTemplate';

// Import the component for testing
const Component = MayaEmailConfidenceBuilder;

createComponentTestSuite(
  'MayaEmailConfidenceBuilder',
  Component,
  'ai_email_composer',
  {
    hasInteractions: true,
    hasAsyncOperations: true,
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

// Additional tests specific to MayaEmailConfidenceBuilder
describe('MayaEmailConfidenceBuilder Specific Tests', () => {
  it('should render Maya-specific email confidence building interface', () => {
    const element = {
      id: 1,
      type: 'ai_email_composer',
      title: "Turn Maya's Email Anxiety into Connection",
      content: 'Help Maya build confidence in email communication',
      configuration: {
        character: 'maya',
        scenario: 'email_confidence',
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
    
    expect(screen.getByText(/Maya/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
  });

  it('should handle email template generation', () => {
    const element = {
      id: 1,
      type: 'ai_email_composer',
      title: "Maya's Email Builder",
      content: 'Build confidence through practice',
      configuration: {
        templates: ['professional', 'friendly', 'request'],
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

  it('should provide confidence-building exercises', () => {
    const element = {
      id: 1,
      type: 'ai_email_composer',
      title: 'Confidence Building',
      content: 'Practice makes perfect',
      configuration: {
        exercises: [
          { type: 'tone_practice', difficulty: 'beginner' },
          { type: 'response_time', difficulty: 'intermediate' },
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

    expect(() => render(<Component {...props} />)).not.toThrow();
  });

  it('should handle Maya character-specific configurations', () => {
    const mayaConfigs = [
      { character: 'maya', anxiety_level: 'high' },
      { character: 'maya', previous_experience: 'limited' },
      { character: 'maya', preferred_style: 'formal' },
      { confidence_building: true },
      { step_by_step: true },
    ];

    mayaConfigs.forEach((config, index) => {
      const element = {
        id: index + 1,
        type: 'ai_email_composer',
        title: `Maya Test ${index}`,
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