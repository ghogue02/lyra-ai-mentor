import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MayaMicroLesson, MicroLessonData } from '../MayaMicroLesson';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/hooks/useAdaptiveAI', () => ({
  useAdaptiveAI: () => ({
    personalityProfile: { communicationStyle: 'warm-professional' },
    trackMayaProgress: vi.fn()
  })
}));

const mockOnComplete = vi.fn();
const mockOnBack = vi.fn();

const testLesson: MicroLessonData = {
  id: 'test-1',
  lessonNumber: 1,
  title: 'Test Lesson',
  estimatedTime: 120,
  objective: 'Test objective',
  type: 'chat',
  chatFlow: [
    {
      id: 'msg-1',
      sender: 'maya',
      text: 'Test message from Maya',
      emotion: 'hopeful',
      delay: 100
    },
    {
      id: 'msg-2',
      sender: 'maya',
      text: 'Choose an option',
      emotion: 'confident',
      choices: ['Option 1', 'Option 2']
    }
  ],
  successMetric: 'Test completion'
};

describe('MayaMicroLesson Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockOnComplete.mockClear();
    mockOnBack.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Lesson Flow Tests', () => {
    it('should auto-continue to next lesson after success modal', async () => {
      // GIVEN a user completes a lesson
      const { rerender } = render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLesson 
              lessonData={testLesson} 
              onComplete={mockOnComplete}
              onBack={mockOnBack}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for first message to appear
      await vi.advanceTimersByTimeAsync(1200);
      expect(screen.getByText('Test message from Maya')).toBeInTheDocument();
      
      // Wait for second message with choices
      await vi.advanceTimersByTimeAsync(2000);
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
      
      // Click a choice to trigger completion
      const choice = screen.getByText('Option 1');
      fireEvent.click(choice);
      
      // This should trigger lesson completion
      await vi.advanceTimersByTimeAsync(100);
      
      // WHEN the success modal appears
      await waitFor(() => {
        expect(screen.getByText(/Micro-Win Unlocked!/)).toBeInTheDocument();
      });
      
      // THEN it should auto-dismiss after 1.4s and hide
      await vi.advanceTimersByTimeAsync(1400);
      
      // Wait for the modal to be hidden and onComplete to be called
      await vi.advanceTimersByTimeAsync(100);
      
      // AND call onComplete with autoContinue flag
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
        autoContinue: true,
        completed: true
      }));
    });

    it('should show typing indicator before Maya messages', async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLesson 
              lessonData={testLesson} 
              onComplete={mockOnComplete}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      // Should show typing indicator
      await vi.advanceTimersByTimeAsync(100);
      // Look for typing dots by their container
      const typingContainer = screen.getByText((content, element) => {
        return element?.className?.includes('flex gap-1') ?? false;
      });
      expect(typingContainer).toBeInTheDocument();
      
      // After typing delay, message should appear
      await vi.advanceTimersByTimeAsync(1000);
      expect(screen.getByText('Test message from Maya')).toBeInTheDocument();
    });

    it('should handle user choices correctly', async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLesson 
              lessonData={testLesson} 
              onComplete={mockOnComplete}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for second message with choices
      await vi.advanceTimersByTimeAsync(3000);
      
      // Click a choice
      const choice = screen.getByText('Option 1');
      fireEvent.click(choice);
      
      // Should continue to next message
      await vi.advanceTimersByTimeAsync(2000);
      expect(mockOnComplete).not.toHaveBeenCalled(); // Still processing
    });
  });

  describe('Typewriter Effect Tests', () => {
    it('should animate text with correct speed (27ms per character)', async () => {
      const shortMessage = {
        ...testLesson,
        chatFlow: [{
          id: 'msg-1',
          sender: 'maya',
          text: 'Hi!', // 3 characters
          emotion: 'hopeful'
        }]
      };

      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLesson 
              lessonData={shortMessage} 
              onComplete={mockOnComplete}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for typing indicator
      await vi.advanceTimersByTimeAsync(800);
      
      // Should take 3 * 27ms = 81ms for full text
      await vi.advanceTimersByTimeAsync(27);
      expect(screen.getByText('H')).toBeInTheDocument();
      
      await vi.advanceTimersByTimeAsync(27);
      expect(screen.getByText('Hi')).toBeInTheDocument();
      
      await vi.advanceTimersByTimeAsync(27);
      expect(screen.getByText('Hi!')).toBeInTheDocument();
    });
  });

  describe('Progress Tracking Tests', () => {
    it('should track progress with correct metrics', async () => {
      const { getByText } = render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLesson 
              lessonData={testLesson} 
              onComplete={mockOnComplete}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      // Complete the lesson
      await vi.advanceTimersByTimeAsync(5000);
      
      // Check progress bar exists
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness Tests', () => {
    it('should have proper touch targets', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <MayaMicroLesson 
              lessonData={testLesson} 
              onComplete={mockOnComplete}
              onBack={mockOnBack}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      const styles = window.getComputedStyle(backButton);
      
      // Check minimum touch target size (44x44px)
      expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
    });
  });
});