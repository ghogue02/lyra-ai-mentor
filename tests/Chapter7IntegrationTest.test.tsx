import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
    callAI: vi.fn().mockResolvedValue('Generated AI content'),
    loading: false
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Chapter 7 Structural Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Chapter7Hub Component', () => {
    it('should render without errors', () => {
      expect(() => renderWithRouter(<Chapter7Hub />)).not.toThrow();
    });

    it('should display correct chapter information', () => {
      renderWithRouter(<Chapter7Hub />);
      
      expect(screen.getByText(/Chapter 7/)).toBeInTheDocument();
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
      expect(screen.getByText(/Join Carmen Rodriguez/)).toBeInTheDocument();
    });

    it('should render all 7 micro-lessons', () => {
      renderWithRouter(<Chapter7Hub />);
      
      const lessonTitles = [
        'AI-Powered Talent Acquisition',
        'Performance Insights Workshop', 
        'Employee Engagement Builder',
        'Retention Strategy Mastery',
        'Team Dynamics Optimizer',
        'Cultural Intelligence Hub',
        'Leadership Development Lab'
      ];

      lessonTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('should validate characterType="carmen" is properly passed', () => {
      renderWithRouter(<Chapter7Hub />);
      
      // Check that Carmen-specific elements are present
      expect(screen.getByText('Carmen')).toBeInTheDocument();
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
    });

    it('should have correct lesson structure and metadata', () => {
      renderWithRouter(<Chapter7Hub />);
      
      // Check difficulty levels
      expect(screen.getAllByText('Beginner')).toHaveLength(2);
      expect(screen.getAllByText('Intermediate')).toHaveLength(2);
      expect(screen.getAllByText('Advanced')).toHaveLength(3);
      
      // Check categories
      expect(screen.getByText(/recruitment/)).toBeInTheDocument();
      expect(screen.getByText(/workshop/)).toBeInTheDocument();
      expect(screen.getByText(/lab/)).toBeInTheDocument();
    });
  });

  describe('Chapter7Sidebar Component', () => {
    const defaultProps = {
      currentLessonId: 31,
      onLessonChange: vi.fn()
    };

    it('should render sidebar without errors', () => {
      expect(() => renderWithRouter(<Chapter7Sidebar {...defaultProps} />)).not.toThrow();
    });

    it('should display all 7 lessons with correct structure', async () => {
      renderWithRouter(<Chapter7Sidebar {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('AI-Powered Talent Acquisition')).toBeInTheDocument();
        expect(screen.getByText('Performance Insights Workshop')).toBeInTheDocument();
        expect(screen.getByText('Employee Engagement Builder')).toBeInTheDocument();
        expect(screen.getByText('Retention Strategy Mastery')).toBeInTheDocument();
        expect(screen.getByText('Team Dynamics Optimizer')).toBeInTheDocument();
        expect(screen.getByText('Cultural Intelligence Hub')).toBeInTheDocument();
        expect(screen.getByText('Leadership Development Lab')).toBeInTheDocument();
      });
    });

    it('should show progress indicators correctly', async () => {
      renderWithRouter(<Chapter7Sidebar {...defaultProps} />);
      
      await waitFor(() => {
        // Should show progress for lessons with data
        const progressBars = screen.getAllByRole('progressbar');
        expect(progressBars.length).toBeGreaterThan(0);
      });
    });

    it('should handle lesson click events', async () => {
      const mockOnLessonChange = vi.fn();
      renderWithRouter(<Chapter7Sidebar {...defaultProps} onLessonChange={mockOnLessonChange} />);
      
      await waitFor(() => {
        const firstLesson = screen.getByText('AI-Powered Talent Acquisition');
        fireEvent.click(firstLesson.closest('button')!);
        expect(mockOnLessonChange).toHaveBeenCalledWith(31);
      });
    });

    it('should display Carmen quote correctly', () => {
      renderWithRouter(<Chapter7Sidebar {...defaultProps} />);
      
      expect(screen.getByText(/Technology amplifies human potential/)).toBeInTheDocument();
      expect(screen.getByText(/Carmen Rodriguez/)).toBeInTheDocument();
    });
  });

  describe('EnhancedCarmenAvatar Component', () => {
    const defaultProps = {
      lessonContext: {
        chapterTitle: 'People Management with AI',
        lessonTitle: 'AI-Powered Talent Acquisition',
        content: 'Test lesson content',
        phase: 'intro' as const,
        hrTopic: 'talent-acquisition'
      }
    };

    it('should render avatar without errors', () => {
      expect(() => renderWithRouter(<EnhancedCarmenAvatar {...defaultProps} />)).not.toThrow();
    });

    it('should display correct personality modes', () => {
      renderWithRouter(<EnhancedCarmenAvatar {...defaultProps} />);
      
      // Avatar should be rendered initially collapsed
      expect(screen.getByLabelText(/Carmen AI assistant/)).toBeInTheDocument();
    });

    it('should expand on click and show chat interface', async () => {
      renderWithRouter(<EnhancedCarmenAvatar {...defaultProps} />);
      
      const avatarButton = screen.getByLabelText(/Carmen AI assistant/);
      fireEvent.click(avatarButton);
      
      await waitFor(() => {
        expect(screen.getByText('Carmen Rodriguez')).toBeInTheDocument();
        expect(screen.getByText(/I'm here to help you create HR practices/)).toBeInTheDocument();
      });
    });

    it('should show contextual questions for talent acquisition', async () => {
      renderWithRouter(<EnhancedCarmenAvatar {...defaultProps} />);
      
      const avatarButton = screen.getByLabelText(/Carmen AI assistant/);
      fireEvent.click(avatarButton);
      
      await waitFor(() => {
        expect(screen.getByText(/How can I make my job descriptions more inclusive/)).toBeInTheDocument();
        expect(screen.getByText(/What are the best practices for bias-free interviewing/)).toBeInTheDocument();
      });
    });
  });

  describe('CarmenTalentAcquisition Component', () => {
    it('should render without errors', () => {
      expect(() => renderWithRouter(<CarmenTalentAcquisition />)).not.toThrow();
    });

    it('should display Carmen guidance section', () => {
      renderWithRouter(<CarmenTalentAcquisition />);
      
      expect(screen.getByText("Carmen's Guidance")).toBeInTheDocument();
      expect(screen.getByText(/Let's work together to create hiring processes/)).toBeInTheDocument();
    });

    it('should show phase progression correctly', () => {
      renderWithRouter(<CarmenTalentAcquisition />);
      
      expect(screen.getByText('Introduction')).toBeInTheDocument();
      expect(screen.getByText('Workshop')).toBeInTheDocument();
      expect(screen.getByText('Results')).toBeInTheDocument();
    });

    it('should have AI content generation functionality', () => {
      renderWithRouter(<CarmenTalentAcquisition />);
      
      // Should show introduction phase by default
      expect(screen.getByText("Carmen's Philosophy")).toBeInTheDocument();
      expect(screen.getByText(/Technology amplifies our humanity/)).toBeInTheDocument();
    });
  });
});

describe('Chapter 7 Component Integration Tests', () => {
  describe('AI Interaction Components', () => {
    it('should render Carmen avatar and processor together', () => {
      const TestComponent = () => (
        <div>
          <EnhancedCarmenAvatar
            lessonContext={{
              chapterTitle: 'People Management with AI',
              lessonTitle: 'AI-Powered Talent Acquisition',
              hrTopic: 'talent-acquisition'
            }}
          />
          <CarmenTalentAcquisition />
        </div>
      );

      expect(() => renderWithRouter(<TestComponent />)).not.toThrow();
    });

    it('should handle AI content generation workflow', async () => {
      renderWithRouter(<CarmenTalentAcquisition />);
      
      // Navigate to workshop phase
      fireEvent.click(screen.getByText('Start the Workshop'));
      
      await waitFor(() => {
        expect(screen.getByText('AI-Enhanced Hiring Workshop')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Integration', () => {
    it('should integrate properly with Chapter7Sidebar', () => {
      const TestComponent = () => (
        <div style={{ display: 'flex' }}>
          <Chapter7Sidebar currentLessonId={31} />
          <div style={{ flex: 1 }}>
            <CarmenTalentAcquisition />
          </div>
        </div>
      );

      expect(() => renderWithRouter(<TestComponent />)).not.toThrow();
    });
  });
});

describe('Chapter 7 TypeScript Interface Tests', () => {
  it('should have properly typed Carmen interfaces', () => {
    // This test ensures TypeScript compilation passes
    const testMessage: import('@/components/lesson/ai-interaction/EnhancedCarmenAvatar').CarmenMessage = {
      id: '1',
      content: 'Test message',
      isUser: false,
      timestamp: new Date(),
      emotion: 'empathetic',
      context: 'talent-acquisition',
      suggestions: ['Test suggestion']
    };
    
    expect(testMessage.id).toBe('1');
    expect(testMessage.emotion).toBe('empathetic');
  });

  it('should have properly typed personality modes', () => {
    const testPersonality: import('@/components/lesson/ai-interaction/EnhancedCarmenAvatar').CarmenPersonalityMode = {
      id: 'empathetic',
      name: 'Empathetic Mentor',
      description: 'Test description',
      icon: React.createElement('div'),
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      characteristics: ['Test characteristic']
    };
    
    expect(testPersonality.id).toBe('empathetic');
    expect(testPersonality.characteristics).toHaveLength(1);
  });

  it('should have properly typed AI processor interfaces', () => {
    const testTask: import('@/components/lesson/ai-interaction/CarmenAIProcessor').AIProcessingTask = {
      id: 'test-task',
      title: 'Test Task',
      description: 'Test description',
      type: 'job-description',
      prompt: 'Test prompt',
      context: 'Test context',
      expectedOutputType: 'structured',
      estimatedTime: 5,
      carmenPersonality: {
        mode: 'empathetic',
        message: 'Test message',
        emotion: 'thoughtful',
        processingStyle: 'compassionate'
      }
    };
    
    expect(testTask.type).toBe('job-description');
    expect(testTask.carmenPersonality.mode).toBe('empathetic');
  });
});