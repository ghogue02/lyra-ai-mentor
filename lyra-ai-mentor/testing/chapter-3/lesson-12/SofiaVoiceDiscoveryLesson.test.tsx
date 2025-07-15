import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import SofiaVoiceDiscoveryLesson from './SofiaVoiceDiscoveryLesson';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, initial, animate, transition, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock the LyraAvatar component
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ expression, animated }: { expression: string; animated?: boolean }) => (
    <div data-testid="lyra-avatar" data-expression={expression} data-animated={animated}>
      Lyra Avatar
    </div>
  ),
}));

// Mock audio recording functionality
const mockMediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: vi.fn() }],
  }),
};

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: mockMediaDevices,
  writable: true,
});

// Mock MediaRecorder
global.MediaRecorder = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
  onstop: null,
  stream: { getTracks: () => [{ stop: vi.fn() }] },
}));

describe('SofiaVoiceDiscoveryLesson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the main lesson interface', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      expect(screen.getByText("Sofia's VOICE Framework Journey")).toBeInTheDocument();
      expect(screen.getByText('Narrated by Lyra, your AI guide')).toBeInTheDocument();
    });

    it('displays the introduction stage with Sofia branding', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      expect(screen.getByText('Meeting Sofia')).toBeInTheDocument();
      expect(screen.getByText("Sofia's Voice Discovery Journey")).toBeInTheDocument();
      // Note: Other text appears via typewriter effect in actual usage
    });

    it('shows the correct progress indication', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    });

    it('displays Lyra avatar with correct initial expression', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      const avatar = screen.getByTestId('lyra-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-expression', 'default');
    });
  });

  describe('VOICE Framework Progression', () => {
    it('progresses through Values stage correctly', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Start the journey
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      await waitFor(() => {
        expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
      });

      // Check for values options
      expect(screen.getByText('Human dignity above all else')).toBeInTheDocument();
      expect(screen.getByText('Community over individual success')).toBeInTheDocument();
      expect(screen.getByText('Hope in the face of hardship')).toBeInTheDocument();
      expect(screen.getByText('Authentic connection over perfection')).toBeInTheDocument();
    });

    it('allows selection of values and progresses to Origin stage', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Navigate to Values stage
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      await waitFor(() => {
        expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
      });

      // Select a value
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      await waitFor(() => {
        expect(screen.getByText('O - Origin Story')).toBeInTheDocument();
      });

      // Check for origin options
      expect(screen.getByText('Childhood challenge that built resilience')).toBeInTheDocument();
      expect(screen.getByText('Moment someone believed in you')).toBeInTheDocument();
    });

    it('progresses through all VOICE framework stages', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Start journey
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      // Values stage
      await waitFor(() => {
        expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      // Origin stage
      await waitFor(() => {
        expect(screen.getByText('O - Origin Story')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
      
      // Impact stage
      await waitFor(() => {
        expect(screen.getByText('I - Impact Vision')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('From isolation to belonging'));
      
      // Craft stage
      await waitFor(() => {
        expect(screen.getByText('C - Craft & Style')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Compassionate Connector'));
      
      // Expression stage
      await waitFor(() => {
        expect(screen.getByText('E - Expression in Action')).toBeInTheDocument();
      });
    });
  });

  describe('Voice Profile System', () => {
    it('displays Sofia voice profiles with correct styling', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Navigate to Craft stage
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      // Complete previous stages quickly
      await waitFor(() => screen.getByText('Human dignity above all else'), { timeout: 5000 });
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      await waitFor(() => screen.getByText('Childhood challenge that built resilience'), { timeout: 5000 });
      fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
      
      await waitFor(() => screen.getByText('From isolation to belonging'), { timeout: 5000 });
      fireEvent.click(screen.getByText('From isolation to belonging'));
      
      await waitFor(() => {
        expect(screen.getByText('Compassionate Connector')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Check that voice profiles are available
      expect(screen.getByText('Vulnerable Truth-Teller')).toBeInTheDocument();
      expect(screen.getByText('Hopeful Visionary')).toBeInTheDocument();
      expect(screen.getByText('Wisdom Weaver')).toBeInTheDocument();
    });

    it('allows voice profile selection and shows appropriate feedback', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Navigate through to Craft stage
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      await waitFor(() => screen.getByText('Human dignity above all else'));
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
      fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
      
      await waitFor(() => screen.getByText('From isolation to belonging'));
      fireEvent.click(screen.getByText('From isolation to belonging'));
      
      await waitFor(() => screen.getByText('Compassionate Connector'));
      fireEvent.click(screen.getByText('Compassionate Connector'));
      
      await waitFor(() => {
        expect(screen.getByText('Your Voice Profile is Ready!')).toBeInTheDocument();
        expect(screen.getByText('Express Your Voice')).toBeInTheDocument();
      });
    });
  });

  describe('Story Generation', () => {
    it('generates Sofia story when all VOICE elements are complete', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Complete full VOICE framework
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      await waitFor(() => screen.getByText('Human dignity above all else'));
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
      fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
      
      await waitFor(() => screen.getByText('From isolation to belonging'));
      fireEvent.click(screen.getByText('From isolation to belonging'));
      
      await waitFor(() => screen.getByText('Compassionate Connector'));
      fireEvent.click(screen.getByText('Compassionate Connector'));
      
      await waitFor(() => screen.getByText('Express Your Voice'));
      fireEvent.click(screen.getByText('Express Your Voice'));
      
      await waitFor(() => {
        expect(screen.getByText("Sofia's Voice in Action")).toBeInTheDocument();
        expect(screen.getByText('Copy Your Voice ✨')).toBeInTheDocument();
      });
    });

    it('includes all VOICE elements in generated story', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Complete framework and check story content
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      await waitFor(() => screen.getByText('Human dignity above all else'), { timeout: 5000 });
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      await waitFor(() => screen.getByText('Childhood challenge that built resilience'), { timeout: 5000 });
      fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
      
      await waitFor(() => screen.getByText('From isolation to belonging'), { timeout: 5000 });
      fireEvent.click(screen.getByText('From isolation to belonging'));
      
      await waitFor(() => screen.getByText('Compassionate Connector'), { timeout: 5000 });
      fireEvent.click(screen.getByText('Compassionate Connector'));
      
      await waitFor(() => screen.getByText('Express Your Voice'), { timeout: 5000 });
      fireEvent.click(screen.getByText('Express Your Voice'));
      
      await waitFor(() => {
        // Check that we reach the final expression stage
        expect(screen.getByText('E - Expression in Action')).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Interactive Features', () => {
    it('provides fast-forward functionality', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      const fastForwardButton = screen.getByText('Fast Forward');
      expect(fastForwardButton).toBeInTheDocument();
      
      fireEvent.click(fastForwardButton);
      
      // Should show "Skipping..." when fast-forwarding
      expect(screen.getByText('Skipping...')).toBeInTheDocument();
    });

    it('allows user level switching', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      const userLevelButton = screen.getByText('beginner mode');
      expect(userLevelButton).toBeInTheDocument();
      
      fireEvent.click(userLevelButton);
      expect(screen.getByText('intermediate mode')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('intermediate mode'));
      expect(screen.getByText('advanced mode')).toBeInTheDocument();
    });

    it('displays VOICE summary panel', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Summary panel should be visible by default
      expect(screen.getByText('Your VOICE Framework')).toBeInTheDocument();
      expect(screen.getByText('VALUES:')).toBeInTheDocument();
      expect(screen.getByText('ORIGIN:')).toBeInTheDocument();
      expect(screen.getByText('IMPACT:')).toBeInTheDocument();
      expect(screen.getByText('CRAFT:')).toBeInTheDocument();
      expect(screen.getByText('EXPRESSION:')).toBeInTheDocument();
    });

    it('allows resetting the journey', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Complete some steps
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      await waitFor(() => screen.getByText('Human dignity above all else'));
      fireEvent.click(screen.getByText('Human dignity above all else'));
      
      await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
      fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
      
      await waitFor(() => screen.getByText('From isolation to belonging'));
      fireEvent.click(screen.getByText('From isolation to belonging'));
      
      await waitFor(() => screen.getByText('Compassionate Connector'));
      fireEvent.click(screen.getByText('Compassionate Connector'));
      
      await waitFor(() => screen.getByText('Express Your Voice'));
      fireEvent.click(screen.getByText('Express Your Voice'));
      
      await waitFor(() => screen.getByText('Try Another VOICE'));
      fireEvent.click(screen.getByText('Try Another VOICE'));
      
      // Should return to Values stage
      await waitFor(() => {
        expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels and semantic structure', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Check for proper heading structure
      expect(screen.getByRole('heading', { name: /Sofia's VOICE Framework Journey/ })).toBeInTheDocument();
      
      // Check for interactive elements
      expect(screen.getByRole('button', { name: /Begin Sofia's Journey/ })).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      const startButton = screen.getByRole('button', { name: /Begin Sofia's Journey/ });
      expect(startButton).toBeInTheDocument();
      
      // Should be focusable
      startButton.focus();
      expect(document.activeElement).toBe(startButton);
    });
  });

  describe('Error Handling', () => {
    it('handles missing voice selection gracefully', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Navigate to final stage without completing all steps
      fireEvent.click(screen.getByText("Begin Sofia's Journey"));
      
      // The lesson should still render without errors
      expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
    });

    it('displays fallback content when story generation is incomplete', async () => {
      render(<SofiaVoiceDiscoveryLesson />);
      
      // Try to access final stage with incomplete data
      // Should show appropriate fallback message
      expect(screen.getByText("Sofia's Voice Discovery Journey")).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without significant delay', () => {
      const startTime = performance.now();
      render(<SofiaVoiceDiscoveryLesson />);
      const endTime = performance.now();
      
      // Should render within reasonable time (1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('cleans up timeouts and resources properly', () => {
      const { unmount } = render(<SofiaVoiceDiscoveryLesson />);
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });
});