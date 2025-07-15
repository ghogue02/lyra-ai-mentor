import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MayaEmailComposer } from '../../MayaEmailComposer';
import { AITestUtils, AITestData } from '../../../../test/ai-test-utils';
import { AI_TEST_CONFIG, AI_MOCK_RESPONSES, AI_ERROR_SCENARIOS } from '../../../../test/ai-component-test-config';
import { createTestElement, PerformanceTestUtils, RegressionTestUtils } from '../testUtils';

describe('MayaEmailComposer - Comprehensive Test Suite', () => {
  const mockElement = createTestElement({
    type: 'maya_email_composer',
    title: 'Professional Email Composer',
    content: 'Compose professional emails with AI assistance',
    configuration: {
      features: ['tone_analysis', 'subject_suggestions', 'template_library'],
      default_tone: 'professional',
      max_length: 2000
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset AI service mocks
    AITestUtils.mocks.aiService.generateResponse.mockReset();
    AITestUtils.mocks.analyticsService.track.mockReset();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Functionality', () => {
    it('should render email composer with all required elements', () => {
      render(<MayaEmailComposer element={mockElement} />);

      expect(screen.getByRole('textbox', { name: /recipient/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /subject/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('should handle basic email composition', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        subject: 'Professional Meeting Follow-up',
        body: 'Dear [Recipient],\n\nThank you for our productive meeting today...'
      });

      render(<MayaEmailComposer element={mockElement} />);

      // Fill in recipient
      await user.type(screen.getByRole('textbox', { name: /recipient/i }), 'john.doe@example.com');
      
      // Fill in context
      await user.type(screen.getByRole('textbox', { name: /context/i }), 'Follow up on project discussion');
      
      // Generate email
      await user.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByDisplayValue('Professional Meeting Follow-up')).toBeInTheDocument();
      });
    });
  });

  describe('AI Integration', () => {
    it('should generate subject line suggestions', async () => {
      await AITestUtils.Patterns.testAISuggestions({
        component: () => <MayaEmailComposer element={mockElement} />,
        inputText: 'meeting follow-up',
        expectedSuggestions: AI_MOCK_RESPONSES.EMAIL_COMPOSER.subject_suggestions
      });
    });

    it('should analyze email tone', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce(
        AI_MOCK_RESPONSES.EMAIL_COMPOSER.tone_analysis
      );

      render(<MayaEmailComposer element={mockElement} />);

      // Type email content
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      await user.type(messageInput, 'I need this done ASAP!');

      // Trigger tone analysis
      await user.click(screen.getByRole('button', { name: /analyze tone/i }));

      await waitFor(() => {
        expect(screen.getByText('Current tone: professional')).toBeInTheDocument();
        expect(screen.getByText('more casual')).toBeInTheDocument();
      });
    });

    it('should handle AI service errors gracefully', async () => {
      await AITestUtils.Patterns.testAIErrorHandling({
        component: () => <MayaEmailComposer element={mockElement} />,
        triggerError: async () => {
          const user = userEvent.setup();
          await user.click(screen.getByRole('button', { name: /generate/i }));
        },
        expectedErrorMessage: 'Unable to generate email. Please try again.'
      });
    });
  });

  describe('Performance Testing', () => {
    it('should render within performance thresholds', async () => {
      const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
        return render(<MayaEmailComposer element={mockElement} />);
      });

      expect(renderTime).toBeLessThan(AI_TEST_CONFIG.MAX_RENDER_TIME);
    });

    it('should handle AI responses within timeout', async () => {
      const responseTime = await AITestUtils.Performance.testAIResponseTime({
        component: () => <MayaEmailComposer element={mockElement} />,
        action: async () => {
          const user = userEvent.setup();
          await user.click(screen.getByRole('button', { name: /generate/i }));
        },
        maxResponseTime: AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT
      });

      expect(responseTime).toBeLessThan(AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT);
    });

    it('should not exceed memory usage limits', async () => {
      const memoryUsage = await AITestUtils.Performance.testAIMemoryUsage({
        component: () => <MayaEmailComposer element={mockElement} />,
        operation: async () => {
          const user = userEvent.setup();
          // Simulate multiple AI operations
          for (let i = 0; i < 5; i++) {
            await user.type(screen.getByRole('textbox', { name: /context/i }), `Context ${i}`);
            await user.click(screen.getByRole('button', { name: /generate/i }));
            await waitFor(() => {}, { timeout: 100 });
          }
        },
        maxMemoryIncrease: AI_TEST_CONFIG.MAX_MEMORY_USAGE
      });

      expect(memoryUsage).toBeLessThan(AI_TEST_CONFIG.MAX_MEMORY_USAGE);
    });
  });

  describe('Accessibility Testing', () => {
    it('should support keyboard navigation', async () => {
      await AITestUtils.Accessibility.testKeyboardNavigation(() => <MayaEmailComposer element={mockElement} />);
    });

    it('should announce AI operations to screen readers', async () => {
      await AITestUtils.Accessibility.testScreenReaderAnnouncements({
        component: () => <MayaEmailComposer element={mockElement} />,
        action: async () => {
          const user = userEvent.setup();
          await user.click(screen.getByRole('button', { name: /generate/i }));
        },
        expectedAnnouncement: 'Generating email content'
      });
    });

    it('should maintain proper color contrast', () => {
      AITestUtils.Accessibility.testColorContrast(() => <MayaEmailComposer element={mockElement} />);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = AI_ERROR_SCENARIOS.API_ERRORS.find(e => e.type === 'network_error');
      
      AITestUtils.mocks.aiService.generateResponse.mockRejectedValueOnce(
        new Error(networkError!.message)
      );

      render(<MayaEmailComposer element={mockElement} />);

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to connect/i)).toBeInTheDocument();
      });
    });

    it('should handle timeout errors', async () => {
      const timeoutError = AI_ERROR_SCENARIOS.API_ERRORS.find(e => e.type === 'timeout_error');
      
      AITestUtils.mocks.aiService.generateResponse.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(timeoutError!.message)), AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT + 100)
        )
      );

      render(<MayaEmailComposer element={mockElement} />);

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/request timed out/i)).toBeInTheDocument();
      }, { timeout: AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT + 1000 });
    });
  });

  describe('Regression Testing', () => {
    it('should not cause object-to-primitive conversion errors', async () => {
      const result = await RegressionTestUtils.testObjectToPrimitiveSafety(
        MayaEmailComposer,
        { element: mockElement }
      );

      expect(result.safe).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle various prop combinations safely', async () => {
      const result = await RegressionTestUtils.testPropVariations(
        MayaEmailComposer,
        { element: mockElement }
      );

      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Integration Testing', () => {
    it('should integrate with template library', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        templates: [
          { id: 1, name: 'Meeting Follow-up', content: 'Thank you for our meeting...' },
          { id: 2, name: 'Project Update', content: 'I wanted to update you on...' }
        ]
      });

      render(<MayaEmailComposer element={mockElement} />);

      // Open template library
      await user.click(screen.getByRole('button', { name: /templates/i }));

      await waitFor(() => {
        expect(screen.getByText('Meeting Follow-up')).toBeInTheDocument();
        expect(screen.getByText('Project Update')).toBeInTheDocument();
      });
    });

    it('should track analytics events', async () => {
      const user = userEvent.setup();
      
      render(<MayaEmailComposer element={mockElement} />);

      // Trigger various actions
      await user.type(screen.getByRole('textbox', { name: /recipient/i }), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /generate/i }));

      expect(AITestUtils.mocks.analyticsService.track).toHaveBeenCalledWith('email_composer_used', {
        component: 'maya_email_composer',
        action: 'generate_email'
      });
    });
  });

  describe('User Experience', () => {
    it('should provide real-time character count', async () => {
      const user = userEvent.setup();
      
      render(<MayaEmailComposer element={mockElement} />);

      const messageInput = screen.getByRole('textbox', { name: /message/i });
      await user.type(messageInput, 'Hello world!');

      expect(screen.getByText('12 characters')).toBeInTheDocument();
    });

    it('should save draft automatically', async () => {
      const user = userEvent.setup();
      
      render(<MayaEmailComposer element={mockElement} />);

      // Type content
      await user.type(screen.getByRole('textbox', { name: /subject/i }), 'Test Subject');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      // Wait for auto-save
      await waitFor(() => {
        expect(screen.getByText(/draft saved/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should provide tone suggestions', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        tone_suggestions: [
          { tone: 'more professional', reason: 'Add formal language' },
          { tone: 'more friendly', reason: 'Use warmer greeting' }
        ]
      });

      render(<MayaEmailComposer element={mockElement} />);

      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Hey! Can you send me the report?');
      await user.click(screen.getByRole('button', { name: /improve tone/i }));

      await waitFor(() => {
        expect(screen.getByText('more professional')).toBeInTheDocument();
        expect(screen.getByText('more friendly')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input gracefully', async () => {
      const user = userEvent.setup();
      
      render(<MayaEmailComposer element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /generate/i }));

      expect(screen.getByText(/please provide context/i)).toBeInTheDocument();
    });

    it('should handle very long content', async () => {
      const user = userEvent.setup();
      const longContent = 'a'.repeat(3000);
      
      render(<MayaEmailComposer element={mockElement} />);

      await user.type(screen.getByRole('textbox', { name: /message/i }), longContent);

      expect(screen.getByText(/content too long/i)).toBeInTheDocument();
    });

    it('should handle special characters in email addresses', async () => {
      const user = userEvent.setup();
      
      render(<MayaEmailComposer element={mockElement} />);

      await user.type(screen.getByRole('textbox', { name: /recipient/i }), 'test+tag@example.com');
      await user.click(screen.getByRole('button', { name: /generate/i }));

      // Should not show validation error
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });

  describe('Configuration Testing', () => {
    it('should respect configuration settings', () => {
      const configuredElement = {
        ...mockElement,
        configuration: {
          ...mockElement.configuration,
          max_length: 100,
          default_tone: 'casual',
          features: ['tone_analysis']
        }
      };

      render(<MayaEmailComposer element={configuredElement} />);

      expect(screen.getByText(/100 character limit/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('casual')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /templates/i })).not.toBeInTheDocument();
    });
  });
});