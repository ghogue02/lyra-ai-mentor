import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LyraNarratedMayaSideBySide from '../LyraNarratedMayaSideBySide';

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button'
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: () => <div data-testid="lyra-avatar">Lyra</div>
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));

jest.mock('@/services/mayaAIEmailService', () => ({
  mayaAIEmailService: {
    generateEmailWithPACE: jest.fn(),
    demonstratePromptComparison: jest.fn()
  }
}));

/**
 * BDD-Style Tests for Maya's PACE Framework Journey
 * 
 * These tests follow Behavior-Driven Development principles:
 * - Given (initial context)
 * - When (action performed)
 * - Then (expected outcome)
 */

describe('Maya\'s PACE Framework Journey - BDD Tests', () => {
  
  describe('Feature: Fast Forward Testing Functionality', () => {
    describe('Scenario: Developer wants to test the complete flow without waiting', () => {
      it('Given I am viewing Maya\'s journey, When I click Fast Forward, Then I should see the complete stage immediately', async () => {
        // Given: I am viewing Maya's journey
        render(<LyraNarratedMayaSideBySide />);
        const fastForwardButton = screen.getByText('Fast Forward');
        
        // When: I click Fast Forward
        fireEvent.click(fastForwardButton);
        
        // Then: I should see the complete stage immediately
        expect(screen.getByText('Skipping...')).toBeInTheDocument();
        
        await waitFor(() => {
          expect(screen.getByText('Fast Forward')).toBeInTheDocument();
        }, { timeout: 1000 });
      });

      it('Given I am in any stage, When I fast forward, Then all typing animations should complete instantly', async () => {
        // Given: I am in any stage
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I fast forward
        const fastForwardButton = screen.getByText('Fast Forward');
        fireEvent.click(fastForwardButton);
        
        // Then: All typing animations should complete instantly
        await waitFor(() => {
          // Fast forward should be re-enabled, indicating completion
          expect(screen.getByText('Fast Forward')).not.toBeDisabled();
        }, { timeout: 1000 });
      });
    });
  });

  describe('Feature: PACE Framework Progress Tracking', () => {
    describe('Scenario: User progresses through the PACE framework', () => {
      it('Given I start the journey, When I have not selected anything, Then all PACE items should show "Pending..."', () => {
        // Given: I start the journey
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I have not selected anything
        // (Initial state)
        
        // Then: All PACE items should show "Pending..."
        const pendingElements = screen.getAllByText('Pending...');
        expect(pendingElements.length).toBeGreaterThanOrEqual(4);
      });

      it('Given I am on the Purpose step, When I select a purpose, Then the PURPOSE section should update and turn green', async () => {
        // Given: I am on the Purpose step
        render(<LyraNarratedMayaSideBySide />);
        const beginButton = screen.getByText('Begin Maya\'s Journey');
        fireEvent.click(beginButton);
        
        await waitFor(() => {
          expect(screen.getByText('P - Prompt Foundation')).toBeInTheDocument();
        });
        
        // When: I select a purpose
        const purposeButton = screen.getByText('Thank a volunteer parent');
        fireEvent.click(purposeButton);
        
        // Then: The PURPOSE section should update and turn green
        await waitFor(() => {
          expect(screen.getByText('Thank a volunteer parent')).toBeInTheDocument();
          const purposeSection = screen.getByText('PURPOSE:').closest('div');
          expect(purposeSection).toHaveClass('bg-green-50');
        });
      });
    });

    describe('Scenario: PACE panel provides real-time feedback', () => {
      it('Given I have selected items, When I view the PACE panel, Then completed items should be green and pending items should be gray', async () => {
        // Given: I have selected items
        render(<LyraNarratedMayaSideBySide />);
        
        // Navigate to purpose selection
        const beginButton = screen.getByText('Begin Maya\'s Journey');
        fireEvent.click(beginButton);
        
        await waitFor(() => {
          const purposeButton = screen.getByText('Thank a volunteer parent');
          fireEvent.click(purposeButton);
        });
        
        // When: I view the PACE panel
        // (Panel is always visible)
        
        // Then: Completed items should be green and pending items should be gray
        await waitFor(() => {
          const purposeSection = screen.getByText('PURPOSE:').closest('div');
          expect(purposeSection).toHaveClass('bg-green-50', 'text-green-800');
          
          const audienceSection = screen.getByText('AUDIENCE:').closest('div');
          expect(audienceSection).toHaveClass('bg-gray-50', 'text-gray-500');
        });
      });
    });
  });

  describe('Feature: Blur Effect Storytelling', () => {
    describe('Scenario: Panel represents Maya\'s confusion to clarity journey', () => {
      it('Given the story begins, When I see the right panel, Then it should be heavily blurred', () => {
        // Given: The story begins
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I see the right panel
        // Then: It should be heavily blurred
        const blurredElement = document.querySelector('.blur-xl');
        expect(blurredElement).toBeInTheDocument();
      });

      it('Given Lyra mentions the transformation, When the blur trigger activates, Then the panel should become clear', async () => {
        // Given: Lyra mentions the transformation
        render(<LyraNarratedMayaSideBySide />);
        
        // When: The blur trigger activates (via fast forward)
        const fastForwardButton = screen.getByText('Fast Forward');
        fireEvent.click(fastForwardButton);
        
        // Then: The panel should become clear
        await waitFor(() => {
          const blurredElement = document.querySelector('.blur-xl');
          expect(blurredElement).not.toBeInTheDocument();
        }, { timeout: 1000 });
      });
    });
  });

  describe('Feature: User Experience Adaptability', () => {
    describe('Scenario: Different user levels get appropriate content', () => {
      it('Given I am a beginner, When I switch to intermediate, Then the mode should update', () => {
        // Given: I am a beginner
        render(<LyraNarratedMayaSideBySide />);
        expect(screen.getByText('beginner mode')).toBeInTheDocument();
        
        // When: I switch to intermediate
        const levelButton = screen.getByText('beginner mode');
        fireEvent.click(levelButton);
        
        // Then: The mode should update
        expect(screen.getByText('intermediate mode')).toBeInTheDocument();
      });

      it('Given I cycle through all levels, When I reach advanced and click again, Then it should return to beginner', () => {
        // Given: I cycle through all levels
        render(<LyraNarratedMayaSideBySide />);
        
        const getButton = () => screen.getByText(/mode$/);
        
        fireEvent.click(getButton()); // beginner -> intermediate
        fireEvent.click(getButton()); // intermediate -> advanced
        
        // When: I reach advanced and click again
        fireEvent.click(getButton()); // advanced -> beginner
        
        // Then: It should return to beginner
        expect(screen.getByText('beginner mode')).toBeInTheDocument();
      });
    });
  });

  describe('Feature: Progress Visualization', () => {
    describe('Scenario: User tracks their journey progress', () => {
      it('Given I start the journey, When I view the progress, Then it should show Step 1 of 4', () => {
        // Given: I start the journey
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I view the progress
        // Then: It should show Step 1 of 4
        expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
      });

      it('Given I navigate to the next stage, When I check the progress, Then the step counter should increment', async () => {
        // Given: I navigate to the next stage
        render(<LyraNarratedMayaSideBySide />);
        const beginButton = screen.getByText('Begin Maya\'s Journey');
        fireEvent.click(beginButton);
        
        // When: I check the progress
        // Then: The step counter should increment
        await waitFor(() => {
          expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
        });
      });
    });
  });

  describe('Feature: Email Generation Workflow', () => {
    describe('Scenario: Complete PACE framework enables email generation', () => {
      it('Given I have not completed all PACE steps, When I check for generation options, Then the generate button should not be available', () => {
        // Given: I have not completed all PACE steps
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I check for generation options
        // Then: The generate button should not be available
        const generateButton = screen.queryByText('Generate Email');
        expect(generateButton).not.toBeInTheDocument();
      });
    });
  });

  describe('Feature: Accessibility and Usability', () => {
    describe('Scenario: Component is accessible to all users', () => {
      it('Given I use keyboard navigation, When I focus the fast forward button, Then it should be properly focusable', () => {
        // Given: I use keyboard navigation
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I focus the fast forward button
        const fastForwardButton = screen.getByText('Fast Forward');
        fastForwardButton.focus();
        
        // Then: It should be properly focusable
        expect(fastForwardButton).toHaveFocus();
      });

      it('Given I need help understanding controls, When I hover over fast forward, Then I should see a helpful tooltip', () => {
        // Given: I need help understanding controls
        render(<LyraNarratedMayaSideBySide />);
        
        // When: I hover over fast forward
        const fastForwardButton = screen.getByText('Fast Forward');
        
        // Then: I should see a helpful tooltip
        expect(fastForwardButton).toHaveAttribute('title', 'Skip to end of current stage');
      });
    });
  });

  describe('Feature: Error Resilience', () => {
    describe('Scenario: Component handles edge cases gracefully', () => {
      it('Given the component encounters an error, When I interact with it, Then it should not crash the application', () => {
        // Given: The component encounters an error
        // When: I interact with it
        // Then: It should not crash the application
        expect(() => {
          render(<LyraNarratedMayaSideBySide />);
          const fastForwardButton = screen.getByText('Fast Forward');
          fireEvent.click(fastForwardButton);
        }).not.toThrow();
      });
    });
  });
});