import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MayaMicroLessonHub } from '../MayaMicroLessonHub';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks and components
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/hooks/useAdaptiveAI', () => ({
  useAdaptiveAI: () => ({
    mayaMetrics: {
      emailEfficiencyImprovement: 50,
      timeReclaimed: 180,
      confidenceGrowth: 5,
      weeklyImpact: {
        emailsSent: 15,
        avgTimePerEmail: 5,
        familyTimeReclaimed: 180
      }
    },
    refreshMayaMetrics: vi.fn()
  })
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock as any;

describe('MayaMicroLessonHub Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('BDD: Lesson Progression', () => {
    it('GIVEN a user on the hub WHEN they click continue THEN the first lesson should start', async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      // Find and click the continue button
      const continueButton = screen.getByRole('button', { name: /Continue Journey/i });
      fireEvent.click(continueButton);

      // Should transition to lesson view
      await waitFor(() => {
        expect(screen.queryByText(/Maya's Email Confidence Journey/i)).not.toBeInTheDocument();
      });
    });

    it('GIVEN a completed lesson WHEN auto-continue triggers THEN next lesson should load', async () => {
      // Set up localStorage to show lesson 1 is complete
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        completed: ['ml-2-5-1'],
        totalTime: 120
      }));

      const { rerender } = render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      // Should show 1 lesson completed
      expect(screen.getByText('1 of 5 completed')).toBeInTheDocument();

      // Click to start lesson 2
      const lessonCards = screen.getAllByRole('button');
      const lesson2Card = lessonCards.find(card => card.textContent?.includes('Lesson 2'));
      
      if (lesson2Card) {
        fireEvent.click(lesson2Card);
        
        // Should transition to lesson 2
        await waitFor(() => {
          expect(screen.queryByText(/Maya's Email Confidence Journey/i)).not.toBeInTheDocument();
        });
      }
    });

    it('GIVEN all lessons complete WHEN viewing hub THEN celebration should show', () => {
      // Set up localStorage to show all lessons complete
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        completed: ['ml-2-5-1', 'ml-2-5-2', 'ml-2-5-3', 'ml-2-5-4', 'ml-2-5-5'],
        totalTime: 720
      }));

      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      // Should show completion celebration
      expect(screen.getByText(/All Micro-Lessons Complete!/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue to Next Chapter/i })).toBeInTheDocument();
    });
  });

  describe('Progress Persistence Tests', () => {
    it('should save progress to localStorage after lesson completion', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      // Verify localStorage is called with correct key
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'maya-micro-progress-2-5',
        expect.any(String)
      );
    });

    it('should calculate correct progress percentage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        completed: ['ml-2-5-1', 'ml-2-5-2'],
        totalTime: 300
      }));

      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      // 2 of 5 lessons = 40%
      expect(screen.getByText('40%')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      // Check for progress bar
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      
      // Check for buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should maintain focus management during transitions', async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLessonHub chapterId={2} lessonId={5} />
          </AuthProvider>
        </BrowserRouter>
      );

      const continueButton = screen.getByRole('button', { name: /Continue Journey/i });
      continueButton.focus();
      
      expect(document.activeElement).toBe(continueButton);
    });
  });
});