import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { 
  createTestElement, 
  createTestLessonContext, 
  TestErrorBoundary,
  renderWithProviders 
} from '@/components/interactive/__tests__/testUtils';

// Mock network failures
const mockNetworkFailure = () => {
  global.fetch = vi.fn(() => 
    Promise.reject(new Error('Network Error: Unable to connect'))
  );
};

const mockDatabaseFailure = () => {
  vi.mocked(fetch).mockRejectedValueOnce(new Error('Database connection failed'));
};

describe('Error Handling Testing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)
    );
  });

  describe('API Failure Scenarios', () => {
    it('should handle network connectivity issues gracefully', async () => {
      mockNetworkFailure();
      
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Network Failure Test',
        content: 'Test content for network failure handling',
      });

      const onError = vi.fn();
      
      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />,
        { onError }
      );

      // Wait for component to attempt network request
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      // Should show error message or fallback content
      const errorMessage = await screen.findByText(/network error|connection failed|try again/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('should handle API response errors', async () => {
      global.fetch = vi.fn(() => 
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)
      );

      const element = createTestElement({
        type: 'lyra_chat',
        title: 'API Error Test',
        content: 'Test content for API error handling',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      // Should handle error gracefully
      const errorIndicator = await screen.findByText(/error|unavailable|try again/i);
      expect(errorIndicator).toBeInTheDocument();
    });

    it('should handle API timeout scenarios', async () => {
      global.fetch = vi.fn(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      const element = createTestElement({
        type: 'document_generator',
        title: 'Timeout Test',
        content: 'Test content for timeout handling',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      // Should show timeout error
      const timeoutMessage = await screen.findByText(/timeout|taking too long|try again/i);
      expect(timeoutMessage).toBeInTheDocument();
    });
  });

  describe('Database Connection Failures', () => {
    it('should handle database connection failures', async () => {
      mockDatabaseFailure();

      const element = createTestElement({
        type: 'knowledge_check',
        title: 'Database Failure Test',
        content: 'Test content for database failure handling',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      // Should show database error message
      const dbErrorMessage = await screen.findByText(/database|connection|temporarily unavailable/i);
      expect(dbErrorMessage).toBeInTheDocument();
    });

    it('should provide retry mechanism for failed database operations', async () => {
      let callCount = 0;
      global.fetch = vi.fn(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Database connection failed'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);
      });

      const element = createTestElement({
        type: 'reflection',
        title: 'Retry Test',
        content: 'Test content for retry mechanism',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Wait for initial failure
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      // Look for retry button
      const retryButton = await screen.findByText(/retry|try again/i);
      expect(retryButton).toBeInTheDocument();

      // Click retry
      await userEvent.click(retryButton);

      // Should retry the operation
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Invalid User Input Handling', () => {
    it('should validate user input and show appropriate error messages', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Input Validation Test',
        content: 'Test content for input validation',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Find input field
      const inputField = screen.getByRole('textbox');
      expect(inputField).toBeInTheDocument();

      // Enter invalid input
      await userEvent.clear(inputField);
      await userEvent.type(inputField, '');

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /submit|generate|create/i });
      await userEvent.click(submitButton);

      // Should show validation error
      const validationError = await screen.findByText(/required|invalid|empty/i);
      expect(validationError).toBeInTheDocument();
    });

    it('should handle special characters and XSS attempts', async () => {
      const element = createTestElement({
        type: 'template_creator',
        title: 'XSS Prevention Test',
        content: 'Test content for XSS prevention',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Find input field
      const inputField = screen.getByRole('textbox');
      expect(inputField).toBeInTheDocument();

      // Enter potentially malicious input
      const maliciousInput = '<script>alert("XSS")</script>';
      await userEvent.clear(inputField);
      await userEvent.type(inputField, maliciousInput);

      // Submit
      const submitButton = screen.getByRole('button', { name: /submit|generate|create/i });
      await userEvent.click(submitButton);

      // Should not execute script, should be sanitized
      expect(document.querySelector('script')).not.toBeInTheDocument();
      
      // Should show sanitized or error message
      const output = await screen.findByText(/invalid|not allowed|sanitized/i);
      expect(output).toBeInTheDocument();
    });
  });

  describe('Component Error Boundaries', () => {
    it('should catch and handle component rendering errors', async () => {
      // Create a component that will throw an error
      const ProblematicComponent = () => {
        throw new Error('Component rendering error');
      };

      const onError = vi.fn();
      
      renderWithProviders(
        <ProblematicComponent />,
        { onError }
      );

      // Error boundary should catch the error
      const errorBoundary = await screen.findByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
      expect(errorBoundary).toHaveTextContent('Component rendering error');
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle async errors in components', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Async Error Test',
        content: 'Test content for async error handling',
        configuration: {
          // This might cause async errors
          asyncOperation: true,
        },
      });

      // Mock async operation to fail
      global.fetch = vi.fn(() => 
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Async operation failed' }),
        } as Response)
      );

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Wait for async operation to complete
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      // Should show error state
      const errorState = await screen.findByText(/error|failed|try again/i);
      expect(errorState).toBeInTheDocument();
    });
  });

  describe('Memory and Performance Error Handling', () => {
    it('should handle memory exhaustion gracefully', async () => {
      // Mock memory pressure
      const originalMemory = performance.memory;
      (performance as any).memory = {
        usedJSHeapSize: 1000000000, // 1GB
        totalJSHeapSize: 1100000000, // 1.1GB
        jsHeapSizeLimit: 1073741824, // 1GB limit
      };

      const element = createTestElement({
        type: 'document_generator',
        title: 'Memory Pressure Test',
        content: 'Test content for memory pressure handling',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Should handle memory pressure
      await waitFor(() => {
        expect(screen.getByText(/memory|performance|slower/i)).toBeInTheDocument();
      });

      // Restore original memory
      (performance as any).memory = originalMemory;
    });
  });

  describe('Concurrent Error Scenarios', () => {
    it('should handle multiple simultaneous errors', async () => {
      // Mock multiple failing requests
      global.fetch = vi.fn(() => 
        Promise.reject(new Error('Multiple request failures'))
      );

      const elements = Array.from({ length: 5 }, (_, i) => 
        createTestElement({
          id: i + 1,
          type: 'ai_content_generator',
          title: `Concurrent Error Test ${i + 1}`,
          content: 'Test content for concurrent error handling',
        })
      );

      renderWithProviders(
        <div>
          {elements.map(element => (
            <InteractiveElementRenderer
              key={element.id}
              element={element}
              lessonId={1}
              lessonContext={createTestLessonContext()}
              onElementComplete={vi.fn()}
            />
          ))}
        </div>
      );

      // Wait for all requests to fail
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(5);
      });

      // Should handle all errors gracefully
      const errorMessages = await screen.findAllByText(/error|failed|try again/i);
      expect(errorMessages).toHaveLength(5);
    });
  });

  describe('Error Recovery and Fallbacks', () => {
    it('should provide fallback content when main content fails', async () => {
      global.fetch = vi.fn(() => 
        Promise.reject(new Error('Content loading failed'))
      );

      const element = createTestElement({
        type: 'lyra_chat',
        title: 'Fallback Test',
        content: 'Test content for fallback handling',
      });

      renderWithProviders(
        <InteractiveElementRenderer
          element={element}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Should show fallback content
      const fallbackContent = await screen.findByText(/fallback|alternative|offline/i);
      expect(fallbackContent).toBeInTheDocument();
    });

    it('should maintain app stability after component errors', async () => {
      const onError = vi.fn();
      
      // Render a component that will error
      const { rerender } = renderWithProviders(
        <InteractiveElementRenderer
          element={createTestElement({ type: 'invalid_type' })}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />,
        { onError }
      );

      // Wait for error to be caught
      await waitFor(() => {
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });

      // Rerender with valid component
      rerender(
        <InteractiveElementRenderer
          element={createTestElement({ type: 'callout_box' })}
          lessonId={1}
          lessonContext={createTestLessonContext()}
          onElementComplete={vi.fn()}
        />
      );

      // Should recover and render normally
      await waitFor(() => {
        expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
      });
    });
  });
});
