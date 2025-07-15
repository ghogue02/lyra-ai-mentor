import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MayaEmailComposer } from '../MayaEmailComposer';
import { vi } from 'vitest';

describe('MayaEmailComposer - TDD Tests', () => {
  const mockOnComplete = vi.fn();
  
  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  describe('Phase 1: Story Introduction', () => {
    it('should display Maya\'s email struggle story on initial load', () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      expect(screen.getByText(/Maya's Email Challenge/i)).toBeInTheDocument();
      expect(screen.getByText(/32 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/struggling with a parent email/i)).toBeInTheDocument();
    });

    it('should show relatable pain points', () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      expect(screen.getByText(/Finding the right tone/i)).toBeInTheDocument();
      expect(screen.getByText(/Starting from scratch/i)).toBeInTheDocument();
      expect(screen.getByText(/Second-guessing every word/i)).toBeInTheDocument();
    });

    it('should have a clear CTA to start building', () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      const startButton = screen.getByRole('button', { name: /Help Maya Master Email Writing/i });
      expect(startButton).toBeInTheDocument();
      expect(startButton).toHaveClass('bg-gradient-to-r', 'from-purple-600', 'to-cyan-500');
    });
  });

  describe('Phase 2: Email Recipe Builder', () => {
    it('should transition to builder phase when start is clicked', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      const startButton = screen.getByRole('button', { name: /Help Maya Master Email Writing/i });
      await userEvent.click(startButton);
      
      expect(screen.getByText(/Email Recipe Builder/i)).toBeInTheDocument();
      expect(screen.getByText(/Layer 1: Emotional Foundation/i)).toBeInTheDocument();
    });

    it('should show progress indicator (0/3 layers)', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      
      expect(screen.getByText(/0\/3 layers selected/i)).toBeInTheDocument();
    });

    it('should display tone options with emoji indicators', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      
      expect(screen.getByRole('button', { name: /Professional & Respectful 👔/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Warm & Understanding 🤗/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Urgent but Calm 🚨/i })).toBeInTheDocument();
    });

    it('should update progress when tone is selected', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      
      expect(screen.getByText(/1\/3 layers selected/i)).toBeInTheDocument();
    });

    it('should show recipient layer after tone selection', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      
      expect(screen.getByText(/Layer 2: Recipient Context/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Concerned Parent/i })).toBeInTheDocument();
    });

    it('should show purpose layer after recipient selection', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      
      expect(screen.getByText(/Layer 3: Email Purpose/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Address Concern/i })).toBeInTheDocument();
    });

    it('should show live recipe preview as selections are made', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      
      expect(screen.getByText(/Your Email Recipe:/i)).toBeInTheDocument();
      expect(screen.getByText(/Tone: Warm & Understanding/i)).toBeInTheDocument();
    });

    it('should enable generate button only when all layers selected', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      
      const generateButton = screen.getByRole('button', { name: /Generate Email/i });
      expect(generateButton).toBeDisabled();
      
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      
      expect(generateButton).toBeEnabled();
    });
  });

  describe('Phase 3: Email Preview & Customization', () => {
    it('should show generated email after clicking generate', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Navigate through all phases
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Generated Email/i)).toBeInTheDocument();
        expect(screen.getByText(/Dear Parent/i)).toBeInTheDocument();
      });
    });

    it('should show customization options', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Navigate to preview
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Copy to Clipboard/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Try Different Recipe/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /See My Transformation/i })).toBeInTheDocument();
      });
    });

    it('should show email quality indicators', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Navigate to preview
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Tone Match: 95%/i)).toBeInTheDocument();
        expect(screen.getByText(/Clarity Score: High/i)).toBeInTheDocument();
        expect(screen.getByText(/Empathy Level: Strong/i)).toBeInTheDocument();
      });
    });
  });

  describe('Phase 4: Success & Transformation', () => {
    it('should show time transformation metrics', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Navigate to success phase
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(async () => {
        await userEvent.click(screen.getByRole('button', { name: /See My Transformation/i }));
      });
      
      expect(screen.getByText(/Maya's Transformation/i)).toBeInTheDocument();
      expect(screen.getByText(/Before: 32 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/After: 5 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/Time Saved: 27 minutes per email/i)).toBeInTheDocument();
    });

    it('should show weekly and annual projections', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Navigate to success phase
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(async () => {
        await userEvent.click(screen.getByRole('button', { name: /See My Transformation/i }));
      });
      
      expect(screen.getByText(/Weekly: 2.25 hours saved/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual: 117 hours saved/i)).toBeInTheDocument();
    });

    it('should display Maya\'s testimonial', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Navigate to success phase
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(async () => {
        await userEvent.click(screen.getByRole('button', { name: /See My Transformation/i }));
      });
      
      expect(screen.getByText(/I used to dread email time/i)).toBeInTheDocument();
    });

    it('should call onComplete when finished', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Complete full journey
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      await userEvent.click(screen.getByRole('button', { name: /Warm & Understanding/i }));
      await userEvent.click(screen.getByRole('button', { name: /Concerned Parent/i }));
      await userEvent.click(screen.getByRole('button', { name: /Address Concern/i }));
      await userEvent.click(screen.getByRole('button', { name: /Generate Email/i }));
      
      await waitFor(async () => {
        await userEvent.click(screen.getByRole('button', { name: /See My Transformation/i }));
      });
      
      expect(mockOnComplete).toHaveBeenCalledWith({
        timeSpent: expect.any(Number),
        recipesCreated: 1,
        transformationViewed: true
      });
    });
  });

  describe('Accessibility', () => {
    it('should be fully keyboard navigable', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      // Tab to start button and activate with Enter
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');
      
      expect(screen.getByText(/Email Recipe Builder/i)).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      expect(screen.getByRole('region', { name: /Email composition tool/i })).toBeInTheDocument();
    });

    it('should announce phase changes to screen readers', async () => {
      render(<MayaEmailComposer onComplete={mockOnComplete} />);
      
      await userEvent.click(screen.getByRole('button', { name: /Help Maya/i }));
      
      expect(screen.getByRole('status')).toHaveTextContent(/Now in Email Recipe Builder phase/i);
    });
  });
});