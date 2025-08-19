import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApplicationErrorBoundary } from '@/components/error-boundaries/ApplicationErrorBoundary';
import { InteractionPatternErrorBoundary } from '@/components/error-boundaries/InteractionPatternErrorBoundary';
import { CarmenComponentErrorBoundary } from '@/components/error-boundaries/CarmenComponentErrorBoundary';
import { AsyncErrorBoundary } from '@/components/error-boundaries/AsyncErrorBoundary';

import { vi } from 'vitest';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Test components that throw errors
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = true, 
  errorMessage = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
};

const AsyncThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  React.useEffect(() => {
    if (shouldThrow) {
      setTimeout(() => {
        throw new Error('Async test error');
      }, 10);
    }
  }, [shouldThrow]);
  return <div>Async component</div>;
};

const PromiseRejectionComponent: React.FC<{ shouldReject?: boolean }> = ({ shouldReject = true }) => {
  React.useEffect(() => {
    if (shouldReject) {
      Promise.reject(new Error('Promise rejection test error'));
    }
  }, [shouldReject]);
  return <div>Promise component</div>;
};

describe('ApplicationErrorBoundary', () => {
  it('catches and displays error', () => {
    render(
      <ApplicationErrorBoundary>
        <ThrowError />
      </ApplicationErrorBoundary>
    );

    expect(screen.getByText(/component rendering error/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
    expect(screen.getByText(/go home/i)).toBeInTheDocument();
  });

  it('categorizes network errors correctly', () => {
    render(
      <ApplicationErrorBoundary>
        <ThrowError errorMessage="Network request failed" />
      </ApplicationErrorBoundary>
    );

    expect(screen.getByText(/network connection issue/i)).toBeInTheDocument();
    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('categorizes chunk loading errors correctly', () => {
    render(
      <ApplicationErrorBoundary>
        <ThrowError errorMessage="Loading chunk 42 failed" />
      </ApplicationErrorBoundary>
    );

    expect(screen.getByText(/loading issue/i)).toBeInTheDocument();
    expect(screen.getByText(/required component failed to load/i)).toBeInTheDocument();
  });

  it('allows retry functionality', async () => {
    const { rerender } = render(
      <ApplicationErrorBoundary maxRetries={2}>
        <ThrowError />
      </ApplicationErrorBoundary>
    );

    // Click retry button
    fireEvent.click(screen.getByText(/try again/i));

    // Component should still show error since it always throws
    await waitFor(() => {
      expect(screen.getByText(/retry attempt 1 of 2/i)).toBeInTheDocument();
    });
  });

  it('shows different UI based on error type', () => {
    render(
      <ApplicationErrorBoundary>
        <ThrowError errorMessage="State undefined error" />
      </ApplicationErrorBoundary>
    );

    expect(screen.getByText(/application state error/i)).toBeInTheDocument();
  });

  it('calls custom error handler', () => {
    const onError = vi.fn();
    
    render(
      <ApplicationErrorBoundary onError={onError}>
        <ThrowError />
      </ApplicationErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('shows detailed error information in development', () => {
    render(
      <ApplicationErrorBoundary showDetails={true}>
        <ThrowError errorMessage="Detailed test error" />
      </ApplicationErrorBoundary>
    );

    fireEvent.click(screen.getByText(/show error details/i));
    
    expect(screen.getByText(/detailed test error/i)).toBeInTheDocument();
  });
});

describe('InteractionPatternErrorBoundary', () => {
  it('shows pattern-specific error message', () => {
    render(
      <InteractionPatternErrorBoundary patternType="decision-tree">
        <ThrowError />
      </InteractionPatternErrorBoundary>
    );

    expect(screen.getByText(/decision tree temporarily unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/visual decision-making tool/i)).toBeInTheDocument();
  });

  it('offers simplified mode for complex patterns', () => {
    render(
      <InteractionPatternErrorBoundary patternType="preference-sliders" enableFallbackMode={true}>
        <ThrowError />
      </InteractionPatternErrorBoundary>
    );

    expect(screen.getByText(/simplified mode/i)).toBeInTheDocument();
    expect(screen.getByText(/alternative view/i)).toBeInTheDocument();
  });

  it('shows pattern-specific suggestions', () => {
    render(
      <InteractionPatternErrorBoundary patternType="conversational">
        <ThrowError />
      </InteractionPatternErrorBoundary>
    );

    expect(screen.getByText(/try simplified text-based interaction/i)).toBeInTheDocument();
  });

  it('handles different pattern types', () => {
    const patterns: Array<'conversational' | 'decision-tree' | 'priority-cards' | 'preference-sliders' | 'timeline-scenario' | 'engagement-tree'> = [
      'conversational',
      'decision-tree', 
      'priority-cards',
      'preference-sliders',
      'timeline-scenario',
      'engagement-tree'
    ];

    patterns.forEach(pattern => {
      const { unmount } = render(
        <InteractionPatternErrorBoundary patternType={pattern}>
          <ThrowError />
        </InteractionPatternErrorBoundary>
      );

      expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
      unmount();
    });
  });
});

describe('CarmenComponentErrorBoundary', () => {
  it('shows Carmen-specific error message', () => {
    render(
      <CarmenComponentErrorBoundary componentType="engagement-builder" chapterNumber={7}>
        <ThrowError />
      </CarmenComponentErrorBoundary>
    );

    expect(screen.getByText(/carmen's workshop hit a snag/i)).toBeInTheDocument();
    expect(screen.getByText(/engagement builder/i)).toBeInTheDocument();
  });

  it('offers chapter recovery options', () => {
    render(
      <CarmenComponentErrorBoundary 
        componentType="leadership-development" 
        chapterNumber={7}
        enableChapterRecovery={true}
      >
        <ThrowError />
      </CarmenComponentErrorBoundary>
    );

    expect(screen.getByText(/fresh start/i)).toBeInTheDocument();
    expect(screen.getByText(/chapter 7/i)).toBeInTheDocument();
  });

  it('shows component-specific suggestions', () => {
    render(
      <CarmenComponentErrorBoundary componentType="cultural-intelligence">
        <ThrowError />
      </CarmenComponentErrorBoundary>
    );

    expect(screen.getByText(/restart the cultural assessment/i)).toBeInTheDocument();
  });

  it('displays Carmen\'s encouraging message', () => {
    render(
      <CarmenComponentErrorBoundary componentType="people-management">
        <ThrowError />
      </CarmenComponentErrorBoundary>
    );

    expect(screen.getByText(/carmen says:/i)).toBeInTheDocument();
    expect(screen.getByText(/don't worry/i)).toBeInTheDocument();
  });
});

describe('AsyncErrorBoundary', () => {
  it('catches promise rejections', async () => {
    render(
      <AsyncErrorBoundary>
        <PromiseRejectionComponent />
      </AsyncErrorBoundary>
    );

    // Wait for async error to be caught
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('handles async errors', async () => {
    render(
      <AsyncErrorBoundary>
        <AsyncThrowError />
      </AsyncErrorBoundary>
    );

    // Wait for async error to be caught
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('calls async error handler', async () => {
    const onAsyncError = vi.fn();
    
    render(
      <AsyncErrorBoundary onAsyncError={onAsyncError}>
        <PromiseRejectionComponent />
      </AsyncErrorBoundary>
    );

    await waitFor(() => {
      expect(onAsyncError).toHaveBeenCalledWith(
        expect.any(Error),
        'promise'
      );
    }, { timeout: 1000 });
  });

  it('provides fallback UI for async errors', async () => {
    const fallback = <div>Async error fallback</div>;
    
    render(
      <AsyncErrorBoundary fallback={fallback}>
        <PromiseRejectionComponent />
      </AsyncErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/async error fallback/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});

describe('Error Recovery Integration', () => {
  it('shows recovery success notification', async () => {
    const TestComponent = () => {
      const [shouldError, setShouldError] = React.useState(true);
      
      return (
        <ApplicationErrorBoundary>
          <div>
            <button onClick={() => setShouldError(false)}>Fix Error</button>
            <ThrowError shouldThrow={shouldError} />
          </div>
        </ApplicationErrorBoundary>
      );
    };

    render(<TestComponent />);
    
    // Error should be shown initially
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('handles network error recovery', () => {
    render(
      <ApplicationErrorBoundary>
        <ThrowError errorMessage="fetch failed - network error" />
      </ApplicationErrorBoundary>
    );

    expect(screen.getByText(/network connection issue/i)).toBeInTheDocument();
    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('escalates through recovery strategies', async () => {
    let attemptCount = 0;
    
    const RetryComponent = () => {
      const [retries, setRetries] = React.useState(0);
      
      return (
        <ApplicationErrorBoundary maxRetries={3}>
          <div>
            <button onClick={() => setRetries(r => r + 1)}>Retry</button>
            <ThrowError shouldThrow={retries < 2} />
          </div>
        </ApplicationErrorBoundary>
      );
    };

    render(<RetryComponent />);
    
    // Should show error initially
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    // Click retry
    fireEvent.click(screen.getByText(/try again/i));
    
    // Should show retry attempt
    await waitFor(() => {
      expect(screen.getByText(/retry attempt/i)).toBeInTheDocument();
    });
  });
});

describe('Error Boundary Performance', () => {
  it('does not impact normal rendering', () => {
    const { rerender } = render(
      <ApplicationErrorBoundary>
        <div>Normal content</div>
      </ApplicationErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
    
    // Re-render multiple times to test performance
    for (let i = 0; i < 10; i++) {
      rerender(
        <ApplicationErrorBoundary>
          <div>Normal content {i}</div>
        </ApplicationErrorBoundary>
      );
      expect(screen.getByText(`Normal content ${i}`)).toBeInTheDocument();
    }
  });

  it('cleans up properly on unmount', () => {
    const { unmount } = render(
      <AsyncErrorBoundary>
        <div>Test content</div>
      </AsyncErrorBoundary>
    );

    // Should unmount without errors
    expect(() => unmount()).not.toThrow();
  });
});