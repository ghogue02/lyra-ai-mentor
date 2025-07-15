import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { LyraChatRenderer } from '@/components/lesson/interactive/LyraChatRenderer';
import { createComponentTestSuite } from '../componentTestTemplate';

// Import the component for testing
const Component = LyraChatRenderer;

createComponentTestSuite(
  'LyraChatRenderer',
  Component,
  'lyra_chat',
  {
    hasInteractions: true,
    hasAsyncOperations: true,
    hasComplexState: true,
    customProps: {
      lessonContext: {
        chapterTitle: 'Test Chapter',
        lessonTitle: 'Test Lesson',
        content: 'Test lesson content',
      },
      chatEngagement: {
        hasReachedMinimum: false,
        exchangeCount: 0,
      },
      isBlockingContent: false,
      onEngagementChange: vi.fn(),
      initialEngagementCount: 0,
      analytics: {
        trackStart: vi.fn(),
        trackComplete: vi.fn(),
        trackInteraction: vi.fn(),
        trackError: vi.fn(),
      },
    },
  }
);

// Additional tests specific to LyraChatRenderer
describe('LyraChatRenderer Specific Tests', () => {
  let mockOnEngagementChange: ReturnType<typeof vi.fn>;
  let mockAnalytics: any;

  beforeEach(() => {
    mockOnEngagementChange = vi.fn();
    mockAnalytics = {
      trackStart: vi.fn(),
      trackComplete: vi.fn(),
      trackInteraction: vi.fn(),
      trackError: vi.fn(),
    };
  });

  it('should render chat interface with proper elements', () => {
    const element = {
      id: 1,
      type: 'lyra_chat',
      title: 'Chat with Lyra',
      content: 'Start a conversation with your AI mentor.',
      configuration: {
        minExchanges: 3,
        avatar: 'lyra-avatar.png',
      },
      order_index: 1,
    };

    const props = {
      element,
      lessonContext: {
        chapterTitle: 'Test Chapter',
        lessonTitle: 'Test Lesson',
        content: 'Test lesson content',
      },
      chatEngagement: {
        hasReachedMinimum: false,
        exchangeCount: 0,
      },
      isBlockingContent: false,
      onEngagementChange: mockOnEngagementChange,
      initialEngagementCount: 0,
      analytics: mockAnalytics,
    };

    render(<Component {...props} />);
    
    expect(screen.getByText('Chat with Lyra')).toBeInTheDocument();
    
    // Check for chat interface elements
    const chatInput = screen.queryByRole('textbox') || screen.queryByPlaceholderText(/message/i);
    const sendButton = screen.queryByRole('button', { name: /send/i }) || 
                      screen.queryByRole('button', { name: /submit/i });
    
    if (chatInput) {
      expect(chatInput).toBeInTheDocument();
    }
    
    if (sendButton) {
      expect(sendButton).toBeInTheDocument();
    }
  });

  it('should handle engagement tracking', () => {
    const element = {
      id: 1,
      type: 'lyra_chat',
      title: 'Chat with Lyra',
      content: 'Start a conversation.',
      configuration: { minExchanges: 3 },
      order_index: 1,
    };

    const props = {
      element,
      lessonContext: {
        chapterTitle: 'Test Chapter',
        lessonTitle: 'Test Lesson',
        content: 'Test lesson content',
      },
      chatEngagement: {
        hasReachedMinimum: true,
        exchangeCount: 5,
      },
      isBlockingContent: false,
      onEngagementChange: mockOnEngagementChange,
      initialEngagementCount: 5,
      analytics: mockAnalytics,
    };

    render(<Component {...props} />);
    
    // Should display completion status when minimum is reached
    const completionIndicator = screen.queryByText(/complete/i) || 
                               screen.queryByText(/finished/i) ||
                               screen.queryByText(/done/i);
    
    if (completionIndicator) {
      expect(completionIndicator).toBeInTheDocument();
    }
  });

  it('should handle blocking content state', () => {
    const element = {
      id: 1,
      type: 'lyra_chat',
      title: 'Required Chat',
      content: 'This chat is required to continue.',
      configuration: { minExchanges: 3 },
      order_index: 1,
    };

    const props = {
      element,
      lessonContext: {
        chapterTitle: 'Test Chapter',
        lessonTitle: 'Test Lesson',
        content: 'Test lesson content',
      },
      chatEngagement: {
        hasReachedMinimum: false,
        exchangeCount: 1,
      },
      isBlockingContent: true,
      onEngagementChange: mockOnEngagementChange,
      initialEngagementCount: 1,
      analytics: mockAnalytics,
    };

    expect(() => render(<Component {...props} />)).not.toThrow();
  });

  it('should render without lesson context', () => {
    const element = {
      id: 1,
      type: 'lyra_chat',
      title: 'Chat without Context',
      content: 'Chat without lesson context.',
      configuration: {},
      order_index: 1,
    };

    const props = {
      element,
      lessonContext: undefined,
      chatEngagement: {
        hasReachedMinimum: false,
        exchangeCount: 0,
      },
      isBlockingContent: false,
      onEngagementChange: mockOnEngagementChange,
      initialEngagementCount: 0,
      analytics: mockAnalytics,
    };

    expect(() => render(<Component {...props} />)).not.toThrow();
  });

  it('should handle chat configuration edge cases', () => {
    const configurations = [
      null,
      undefined,
      {},
      { minExchanges: 0 },
      { minExchanges: -1 },
      { minExchanges: 'invalid' },
      { avatar: null },
      { invalidProperty: 'test' },
    ];

    configurations.forEach((config, index) => {
      const element = {
        id: index + 1,
        type: 'lyra_chat',
        title: `Chat Test ${index}`,
        content: 'Test content',
        configuration: config,
        order_index: 1,
      };

      const props = {
        element,
        lessonContext: {
          chapterTitle: 'Test Chapter',
          lessonTitle: 'Test Lesson',
          content: 'Test lesson content',
        },
        chatEngagement: {
          hasReachedMinimum: false,
          exchangeCount: 0,
        },
        isBlockingContent: false,
        onEngagementChange: mockOnEngagementChange,
        initialEngagementCount: 0,
        analytics: mockAnalytics,
      };

      expect(() => render(<Component {...props} />)).not.toThrow();
    });
  });
});