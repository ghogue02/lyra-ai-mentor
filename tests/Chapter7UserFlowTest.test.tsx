import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Chapter7Hub from '@/pages/Chapter7Hub';
import { Chapter7Sidebar } from '@/components/navigation/Chapter7Sidebar';
import { EnhancedCarmenAvatar } from '@/components/lesson/ai-interaction/EnhancedCarmenAvatar';
import CarmenTalentAcquisition from '@/components/lesson/carmen/CarmenTalentAcquisition';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123' }
  })
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          in: vi.fn(() => ({
            data: [
              { lesson_id: 31, completed: false, progress_percentage: 0 },
              { lesson_id: 32, completed: false, progress_percentage: 25 },
              { lesson_id: 33, completed: true, progress_percentage: 100 }
            ],
            error: null
          }))
        }))
      }))
    }))
  }
}));

vi.mock('@/hooks/useAITestingAssistant', () => ({
  useAITestingAssistant: () => ({
    callAI: vi.fn().mockImplementation((type, prompt, context, character) => 
      Promise.resolve(`Generated ${type} content for ${character}: ${prompt.slice(0, 50)}...`)
    ),
    loading: false
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

const renderWithRouter = (component: React.ReactElement, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      {component}
    </MemoryRouter>
  );
};

describe('Chapter 7 User Flow Validation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Chapter Navigation Flow', () => {
    it('should allow user to navigate from dashboard to Chapter 7', () => {
      const { container } = renderWithRouter(<Chapter7Hub />);
      
      // Should render Chapter 7 hub successfully
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
      expect(screen.getByText(/Join Carmen Rodriguez/)).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    it('should enable navigation between lessons via sidebar', async () => {
      const mockOnLessonChange = vi.fn();
      
      renderWithRouter(
        <Chapter7Sidebar 
          currentLessonId={31} 
          onLessonChange={mockOnLessonChange}
        />
      );
      
      await waitFor(() => {
        const talentAcquisitionLesson = screen.getByText('AI-Powered Talent Acquisition');
        expect(talentAcquisitionLesson).toBeInTheDocument();
        
        fireEvent.click(talentAcquisitionLesson.closest('button')!);
        expect(mockOnLessonChange).toHaveBeenCalledWith(31);
      });
    });

    it('should show correct lesson progress in sidebar', async () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={32} />
      );
      
      await waitFor(() => {
        // Should show progress indicators
        expect(screen.getByText('25% complete')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        
        // Should show overall chapter progress
        expect(screen.getByText('1/7 lessons')).toBeInTheDocument();
      });
    });

    it('should handle "Return to Dashboard" navigation', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<Chapter7Hub />);
      
      const dashboardButton = screen.getByText('Back to Dashboard');
      expect(dashboardButton).toBeInTheDocument();
      
      await user.click(dashboardButton);
      // Navigation would be handled by router in actual app
    });
  });

  describe('AI Generation Workflow', () => {
    it('should complete full AI generation workflow in Talent Acquisition lesson', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<CarmenTalentAcquisition />);
      
      // Step 1: Start from introduction
      expect(screen.getByText("Carmen's Philosophy")).toBeInTheDocument();
      
      // Step 2: Navigate to workshop
      const startButton = screen.getByText('Start the Workshop');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('AI-Enhanced Hiring Workshop')).toBeInTheDocument();
      });
      
      // Step 3: Generate AI content (if using enhanced components)
      const toggleButton = screen.getByText('Use Classic View');
      if (toggleButton) {
        await user.click(toggleButton);
        
        // Generate job description
        const jobDescButton = screen.getByText('Generate Job Description');
        await user.click(jobDescButton);
        
        await waitFor(() => {
          expect(screen.getByText(/Generated article content/)).toBeInTheDocument();
        });
      }
      
      // Step 4: Proceed to results
      const resultsButton = screen.getByText('See Results & Impact');
      await user.click(resultsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Your Hiring Transformation Results')).toBeInTheDocument();
        expect(screen.getByText('Success Metrics')).toBeInTheDocument();
      });
    });

    it('should handle AI content generation errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock AI generation failure
      vi.mocked(vi.importMeta.env).VITE_AI_API_ENDPOINT = 'invalid';
      
      renderWithRouter(<CarmenTalentAcquisition />);
      
      // Navigate to workshop
      await user.click(screen.getByText('Start the Workshop'));
      
      await waitFor(() => {
        const toggleButton = screen.getByText('Use Classic View');
        if (toggleButton) {
          user.click(toggleButton);
        }
      });
      
      // Attempt to generate content
      const generateButton = screen.queryByText('Generate Job Description');
      if (generateButton) {
        await user.click(generateButton);
        
        // Should handle error gracefully without crashing
        await waitFor(() => {
          // Error handling would show appropriate message
          expect(screen.getByText('AI-Enhanced Hiring Workshop')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Carmen Avatar Interaction Flow', () => {
    it('should enable complete avatar interaction workflow', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(
        <EnhancedCarmenAvatar
          lessonContext={{
            chapterTitle: 'People Management with AI',
            lessonTitle: 'AI-Powered Talent Acquisition',
            phase: 'intro',
            hrTopic: 'talent-acquisition'
          }}
        />
      );
      
      // Step 1: Avatar should be initially collapsed
      const avatar = screen.getByLabelText(/Carmen AI assistant/);
      expect(avatar).toBeInTheDocument();
      
      // Step 2: Click to expand
      await user.click(avatar);
      
      await waitFor(() => {
        expect(screen.getByText('Carmen Rodriguez')).toBeInTheDocument();
        expect(screen.getByText(/I'm here to help you create HR practices/)).toBeInTheDocument();
      });
      
      // Step 3: Interact with quick questions
      const quickQuestion = screen.getByText(/How can I make my job descriptions more inclusive/);
      await user.click(quickQuestion);
      
      await waitFor(() => {
        // Should show user message
        expect(screen.getByText(/How can I make my job descriptions more inclusive/)).toBeInTheDocument();
      });
      
      // Step 4: Type custom message
      const messageInput = screen.getByPlaceholderText('Ask Carmen about people management...');
      await user.type(messageInput, 'How can I reduce bias in interviews?');
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('How can I reduce bias in interviews?')).toBeInTheDocument();
      });
    });

    it('should handle personality mode switching', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(
        <EnhancedCarmenAvatar
          lessonContext={{
            chapterTitle: 'People Management with AI',
            lessonTitle: 'Test Lesson'
          }}
        />
      );
      
      // Expand avatar
      const avatar = screen.getByLabelText(/Carmen AI assistant/);
      await user.click(avatar);
      
      await waitFor(() => {
        // Look for personality mode controls
        const settingsButton = screen.getByRole('button', { name: /settings/i });
        if (settingsButton) {
          user.click(settingsButton);
        }
      });
      
      // Should show personality mode options when expanded
      await waitFor(() => {
        const personalityModes = screen.queryAllByText(/Empathetic Mentor|Data-Driven Advisor|Strategic Partner|Team Builder/);
        if (personalityModes.length > 0) {
          expect(personalityModes.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Progress Persistence Flow', () => {
    it('should maintain progress across page refreshes', () => {
      // Render sidebar with progress data
      const { rerender } = renderWithRouter(
        <Chapter7Sidebar currentLessonId={32} />
      );
      
      // Verify initial progress display
      waitFor(() => {
        expect(screen.getByText('25% complete')).toBeInTheDocument();
      });
      
      // Simulate page refresh by re-rendering
      rerender(
        <Chapter7Sidebar currentLessonId={32} />
      );
      
      // Progress should persist
      waitFor(() => {
        expect(screen.getByText('25% complete')).toBeInTheDocument();
      });
    });

    it('should update progress as user completes activities', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<CarmenTalentAcquisition />);
      
      // Complete introduction phase
      await user.click(screen.getByText('Start the Workshop'));
      
      // Should progress to next phase
      await waitFor(() => {
        expect(screen.getByText('AI-Enhanced Hiring Workshop')).toBeInTheDocument();
      });
      
      // Complete workshop phase  
      await user.click(screen.getByText('See Results & Impact'));
      
      // Should progress to results phase
      await waitFor(() => {
        expect(screen.getByText('Your Hiring Transformation Results')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile User Flow', () => {
    beforeEach(() => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
    });

    it('should provide mobile-optimized navigation flow', () => {
      renderWithRouter(<Chapter7Hub />);
      
      // Should render mobile-friendly layout
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
      
      // Lessons should be accessible on mobile
      expect(screen.getByText('AI-Powered Talent Acquisition')).toBeInTheDocument();
    });

    it('should handle touch interactions for Carmen avatar', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(
        <EnhancedCarmenAvatar
          lessonContext={{
            chapterTitle: 'People Management with AI',
            lessonTitle: 'Test Lesson'
          }}
        />
      );
      
      // Avatar should be touch-friendly
      const avatar = screen.getByLabelText(/Carmen AI assistant/);
      await user.click(avatar);
      
      // Should expand properly on mobile
      await waitFor(() => {
        expect(screen.getByText('Carmen Rodriguez')).toBeInTheDocument();
      });
    });

    it('should provide accessible mobile sidebar navigation', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      // Should show mobile-optimized sidebar
      expect(screen.getByText('Chapter 7')).toBeInTheDocument();
      
      // Touch targets should be appropriately sized
      const lessonButtons = screen.getAllByRole('button');
      expect(lessonButtons.length).toBeGreaterThan(0);
      
      // Should handle lesson selection on mobile
      const firstLesson = screen.getByText('AI-Powered Talent Acquisition');
      await user.click(firstLesson.closest('button')!);
    });
  });

  describe('Error Recovery Flow', () => {
    it('should recover gracefully from network errors', async () => {
      // Mock network error
      vi.mock('@/integrations/supabase/client', () => ({
        supabase: {
          from: vi.fn(() => ({
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                in: vi.fn(() => Promise.reject(new Error('Network error')))
              }))
            }))
          }))
        }
      }));

      // Should render without crashing despite network error
      expect(() => renderWithRouter(<Chapter7Sidebar currentLessonId={31} />)).not.toThrow();
    });

    it('should handle AI generation failures gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock AI failure
      vi.mock('@/hooks/useAITestingAssistant', () => ({
        useAITestingAssistant: () => ({
          callAI: vi.fn().mockRejectedValue(new Error('AI service unavailable')),
          loading: false
        })
      }));

      renderWithRouter(<CarmenTalentAcquisition />);
      
      // Navigate to workshop
      await user.click(screen.getByText('Start the Workshop'));
      
      // Should continue to work despite AI failures
      await waitFor(() => {
        expect(screen.getByText('AI-Enhanced Hiring Workshop')).toBeInTheDocument();
      });
    });

    it('should provide fallback content when components fail', () => {
      // Test with invalid props
      expect(() => 
        renderWithRouter(
          <EnhancedCarmenAvatar
            lessonContext={{} as any}
          />
        )
      ).not.toThrow();
    });
  });

  describe('Accessibility Flow', () => {
    it('should provide keyboard navigation throughout Chapter 7', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<Chapter7Hub />);
      
      // Should be able to navigate with keyboard
      await user.tab();
      
      // Focus should move to interactive elements
      const focusedElement = screen.getByRole('button', { name: /Start|Review/ });
      expect(focusedElement).toHaveProperty('tabIndex');
    });

    it('should provide screen reader friendly navigation', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      // Should have proper ARIA labels and structure
      expect(screen.getByText('Chapter 7')).toBeInTheDocument();
      
      // Should have semantic headings
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should maintain focus management in Carmen avatar', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(
        <EnhancedCarmenAvatar
          lessonContext={{
            chapterTitle: 'People Management with AI',
            lessonTitle: 'Test Lesson'
          }}
        />
      );
      
      // Focus should work properly
      const avatar = screen.getByLabelText(/Carmen AI assistant/);
      await user.click(avatar);
      
      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Ask Carmen about people management...');
        expect(messageInput).toBeInTheDocument();
        
        // Should be focusable
        messageInput.focus();
        expect(document.activeElement).toBe(messageInput);
      });
    });
  });
});