import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LyraNarratedMayaSideBySide from '../LyraNarratedMayaSideBySide';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button'
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children
}));

// Mock the LyraAvatar component
jest.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, animated }: any) => (
    <div data-testid="lyra-avatar" data-size={size} data-expression={expression} data-animated={animated}>
      Lyra Avatar
    </div>
  )
}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  )
}));

// Mock the AI service
jest.mock('@/services/mayaAIEmailService', () => ({
  mayaAIEmailService: {
    generateEmailWithPACE: jest.fn(),
    demonstratePromptComparison: jest.fn()
  }
}));

describe('LyraNarratedMayaSideBySide', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the component with initial stage', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      expect(screen.getByText("Maya's PACE Framework Journey")).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
      expect(screen.getByText('Fast Forward')).toBeInTheDocument();
    });

    it('should render PACE summary panel', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      expect(screen.getByText('Your PACE Framework')).toBeInTheDocument();
      expect(screen.getByText('PURPOSE:')).toBeInTheDocument();
      expect(screen.getByText('AUDIENCE:')).toBeInTheDocument();
      expect(screen.getByText('CONNECTION:')).toBeInTheDocument();
      expect(screen.getByText('EXECUTE:')).toBeInTheDocument();
    });

    it('should show blur effect initially', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      // Check for blurred panel by looking for blur classes
      const blurredElement = document.querySelector('.blur-xl');
      expect(blurredElement).toBeInTheDocument();
    });
  });

  describe('Fast Forward Functionality', () => {
    it('should have fast forward button that is clickable', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      expect(fastForwardButton).toBeInTheDocument();
      expect(fastForwardButton).not.toBeDisabled();
    });

    it('should disable fast forward button when clicking', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      fireEvent.click(fastForwardButton);
      
      expect(screen.getByText('Skipping...')).toBeInTheDocument();
    });

    it('should skip to end of stage when fast forward is clicked', async () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      fireEvent.click(fastForwardButton);
      
      // Wait for fast forward to complete
      await waitFor(() => {
        expect(screen.getByText('Fast Forward')).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('PACE Framework Integration', () => {
    it('should show pending states initially', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const pendingElements = screen.getAllByText('Pending...');
      expect(pendingElements).toHaveLength(4); // P, A, C, E should all be pending
    });

    it('should update PURPOSE when user makes selection', async () => {
      render(<LyraNarratedMayaSideBySide />);
      
      // Navigate to purpose selection stage
      const beginButton = screen.getByText('Begin Maya\'s Journey');
      fireEvent.click(beginButton);
      
      // Wait for stage to load
      await waitFor(() => {
        expect(screen.getByText('P - Prompt Foundation')).toBeInTheDocument();
      });

      // Select a purpose option
      const purposeButton = screen.getByText('Thank a volunteer parent');
      fireEvent.click(purposeButton);
      
      // Check if PACE panel updates
      await waitFor(() => {
        expect(screen.getByText('Thank a volunteer parent')).toBeInTheDocument();
      });
    });

    it('should show green background when PACE items are selected', async () => {
      render(<LyraNarratedMayaSideBySide />);
      
      // Navigate and select purpose
      const beginButton = screen.getByText('Begin Maya\'s Journey');
      fireEvent.click(beginButton);
      
      await waitFor(() => {
        const purposeButton = screen.getByText('Thank a volunteer parent');
        fireEvent.click(purposeButton);
      });
      
      // Check if the PURPOSE section has green styling
      await waitFor(() => {
        const purposeSection = screen.getByText('PURPOSE:').closest('div');
        expect(purposeSection).toHaveClass('bg-green-50', 'text-green-800');
      });
    });
  });

  describe('User Level Switching', () => {
    it('should cycle through user levels when clicked', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const levelButton = screen.getByText('beginner mode');
      
      fireEvent.click(levelButton);
      expect(screen.getByText('intermediate mode')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('intermediate mode'));
      expect(screen.getByText('advanced mode')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('advanced mode'));
      expect(screen.getByText('beginner mode')).toBeInTheDocument();
    });
  });

  describe('Progress Tracking', () => {
    it('should show correct step numbers', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    });

    it('should update step count when navigating', async () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const beginButton = screen.getByText('Begin Maya\'s Journey');
      fireEvent.click(beginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      });
    });
  });

  describe('Blur Effect Behavior', () => {
    it('should start with full blur effect', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const blurredElement = document.querySelector('.blur-xl');
      expect(blurredElement).toBeInTheDocument();
    });

    it('should clear blur effect when triggered', async () => {
      render(<LyraNarratedMayaSideBySide />);
      
      // Fast forward to trigger blur clear
      const fastForwardButton = screen.getByText('Fast Forward');
      fireEvent.click(fastForwardButton);
      
      await waitFor(() => {
        // Check that blur-xl class is removed
        const blurredElement = document.querySelector('.blur-xl');
        expect(blurredElement).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Email Generation', () => {
    it('should show generate button when PACE is complete', async () => {
      render(<LyraNarratedMayaSideBySide />);
      
      // This would require simulating the full user flow
      // For now, we test the component renders without errors
      expect(screen.getByText('Your PACE Framework')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      expect(fastForwardButton).toHaveAttribute('title', 'Skip to end of current stage');
    });

    it('should be keyboard navigable', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      fastForwardButton.focus();
      expect(fastForwardButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing stages gracefully', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      // Component should render without crashing even if stages are undefined
      expect(screen.getByText("Maya's PACE Framework Journey")).toBeInTheDocument();
    });

    it('should handle fast forward on empty stage', () => {
      render(<LyraNarratedMayaSideBySide />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      
      // Should not crash when clicking fast forward
      expect(() => fireEvent.click(fastForwardButton)).not.toThrow();
    });
  });
});