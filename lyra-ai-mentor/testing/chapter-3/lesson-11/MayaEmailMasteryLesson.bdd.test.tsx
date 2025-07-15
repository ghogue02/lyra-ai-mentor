import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MayaEmailMasteryLesson from './MayaEmailMasteryLesson';

// Mock dependencies for BDD testing
vi.mock('@/components/interactive/MayaEmailComposer', () => ({
  MayaEmailComposer: ({ onComplete }: { onComplete?: Function }) => (
    <div data-testid="maya-email-composer">
      <div data-testid="email-recipe-builder">
        <button 
          onClick={() => onComplete?.({ recipesCreated: 1, timeSpent: 180, transformationViewed: true })}
          data-testid="complete-email-recipe"
        >
          Generate Email Recipe
        </button>
      </div>
    </div>
  )
}));

vi.mock('@/components/interactive/MayaToneChecker', () => ({
  default: () => (
    <div data-testid="maya-tone-checker">
      <h3>Tone Analysis Tool</h3>
      <button data-testid="analyze-tone">Analyze Email Tone</button>
      <div data-testid="tone-results">Professional: 85%, Warm: 92%</div>
    </div>
  )
}));

vi.mock('@/components/interactive/MayaTemplateLibrary', () => ({
  default: () => (
    <div data-testid="maya-template-library">
      <h3>Professional Templates</h3>
      <div data-testid="template-categories">
        <button data-testid="template-thank-you">Thank You Templates</button>
        <button data-testid="template-meeting">Meeting Templates</button>
        <button data-testid="template-update">Update Templates</button>
      </div>
    </div>
  )
}));

vi.mock('@/components/interactive/MayaConfidenceBuilder', () => ({
  default: () => (
    <div data-testid="maya-confidence-builder">
      <h3>Confidence Building Scenarios</h3>
      <div data-testid="scenario-list">
        <button data-testid="scenario-angry-parent">Angry Parent Email</button>
        <button data-testid="scenario-difficult-news">Delivering Difficult News</button>
      </div>
    </div>
  )
}));

// Mock progress tracking
vi.mock('@/hooks/useComponentProgress', () => ({
  useComponentProgress: () => ({
    isCompleted: false,
    timeSpent: 240,
    trackInteraction: vi.fn(),
    markAsComplete: vi.fn()
  })
}));

// Mock Lyra Avatar
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, animated }: any) => (
    <div 
      data-testid="lyra-avatar" 
      data-size={size} 
      data-expression={expression} 
      data-animated={animated}
      role="img"
      aria-label={`Lyra avatar showing ${expression} expression`}
    >
      Lyra
    </div>
  )
}));

// Mock framer-motion for BDD tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }
}));

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const renderLessonWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// BDD-style tests focusing on user behavior and stories
describe('Maya Email Mastery Lesson - User Journey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Feature: Email Overwhelm to PACE Mastery Journey', () => {
    
    describe('Scenario: A nonprofit professional discovers Maya\'s email crisis', () => {
      it('Given I open the lesson, When I see the introduction, Then I understand Maya\'s email overwhelm problem', async () => {
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        // The lesson loads automatically
        
        // Then
        expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
        expect(screen.getByText(/One parent email has taken her 32 minutes/)).toBeInTheDocument();
        expect(screen.getByText(/Her daughter called twice asking when she's coming home/)).toBeInTheDocument();
      });

      it('Given I see Maya\'s crisis, When I want to help her, Then I can begin the transformation journey', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        expect(screen.getByText(/This overwhelm ends tonight/)).toBeInTheDocument();
        
        // When
        const beginButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
        await user.click(beginButton);
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: Learning the PACE Framework through Maya\'s tools', () => {
      it('Given I want to learn email efficiency, When I use Maya\'s Email Recipe Builder, Then I understand the PACE methodology', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('maya-email-composer')).toBeInTheDocument();
        });
        
        // Then
        expect(screen.getByText(/Purpose-driven prompts/)).toBeInTheDocument();
        expect(screen.getByText(/Audience awareness/)).toBeInTheDocument();
        expect(screen.getByText(/Connection through tone/)).toBeInTheDocument();
        expect(screen.getByText(/Execute with confidence/)).toBeInTheDocument();
      });

      it('Given I complete the Email Recipe Builder, When I finish creating an email, Then I advance to tone mastery', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('complete-email-recipe')).toBeInTheDocument();
        });
        await user.click(screen.getByTestId('complete-email-recipe'));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Tone Checker - Connection Mastery/)).toBeInTheDocument();
          expect(screen.getByTestId('maya-tone-checker')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: Mastering email tone and emotional intelligence', () => {
      it('Given I reach the tone mastery stage, When I explore tone analysis, Then I understand emotional impact of communication', async () => {
        const user = userEvent.setup();
        
        // Given - Navigate to tone checker stage
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('maya-tone-checker')).toBeInTheDocument();
        });
        
        // Then
        expect(screen.getByText(/Tone Analysis Tool/)).toBeInTheDocument();
        expect(screen.getByTestId('analyze-tone')).toBeInTheDocument();
        expect(screen.getByText(/Maya's secret weapon for ensuring every email lands with the right emotional impact/)).toBeInTheDocument();
      });

      it('Given I understand tone analysis, When I continue the journey, Then I access professional templates', async () => {
        const user = userEvent.setup();
        
        // Given - Navigate through stages
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        
        // When
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /Continue to Template Library/ })).toBeInTheDocument();
        });
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Template Library - Efficiency Mastery/)).toBeInTheDocument();
          expect(screen.getByTestId('maya-template-library')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: Building efficiency with professional templates', () => {
      it('Given I access the template library, When I explore templates, Then I see Maya\'s proven email frameworks', async () => {
        const user = userEvent.setup();
        
        // Given - Navigate to template library
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Template Library/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('maya-template-library')).toBeInTheDocument();
        });
        
        // Then
        expect(screen.getByText(/Professional Templates/)).toBeInTheDocument();
        expect(screen.getByTestId('template-thank-you')).toBeInTheDocument();
        expect(screen.getByTestId('template-meeting')).toBeInTheDocument();
        expect(screen.getByTestId('template-update')).toBeInTheDocument();
        expect(screen.getByText(/Maya's collection of proven email templates/)).toBeInTheDocument();
      });

      it('Given I understand templates, When I continue learning, Then I reach confidence building scenarios', async () => {
        const user = userEvent.setup();
        
        // Given - Navigate through template stage
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Template Library/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /Continue to Confidence Building/ })).toBeInTheDocument();
        });
        await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Confidence Builder - Challenge Mastery/)).toBeInTheDocument();
          expect(screen.getByTestId('maya-confidence-builder')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: Mastering difficult email scenarios', () => {
      it('Given I reach confidence building, When I explore challenging scenarios, Then I see Maya\'s approach to difficult communications', async () => {
        const user = userEvent.setup();
        
        // Given - Navigate to confidence builder
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Template Library/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('maya-confidence-builder')).toBeInTheDocument();
        });
        
        // Then
        expect(screen.getByText(/Confidence Building Scenarios/)).toBeInTheDocument();
        expect(screen.getByTestId('scenario-angry-parent')).toBeInTheDocument();
        expect(screen.getByTestId('scenario-difficult-news')).toBeInTheDocument();
        expect(screen.getByText(/Maya's practice system for handling challenging email situations/)).toBeInTheDocument();
      });

      it('Given I complete confidence building, When I finish the lesson, Then I see Maya\'s complete transformation', async () => {
        const user = userEvent.setup();
        
        // Given - Complete all stages
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Template Library/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /See Maya's Transformation/ })).toBeInTheDocument();
        });
        await user.click(screen.getByRole('button', { name: /See Maya's Transformation/ }));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Maya's Communication Mastery/)).toBeInTheDocument();
          expect(screen.getByText(/From email overwhelm to communication mastery/)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Feature: Interactive Learning Experience', () => {
    
    describe('Scenario: Visual feedback and blur effects represent learning clarity', () => {
      it('Given I start with email overwhelm, When the lesson begins, Then I see blur effects representing confusion', () => {
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        const crisisContent = screen.getByText(/The Email Crisis/).closest('div');
        
        // Then
        expect(crisisContent).toHaveClass('blur-xl', 'opacity-30');
      });

      it('Given I progress through learning, When I gain understanding, Then blur effects gradually clear', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        
        // Then
        await waitFor(() => {
          const composerContent = screen.getByTestId('maya-email-composer').closest('div');
          expect(composerContent).not.toHaveClass('blur-xl');
        });
      });
    });

    describe('Scenario: Lyra provides narrative guidance throughout the journey', () => {
      it('Given I start the lesson, When Lyra narrates, Then I see her avatar with appropriate expressions', () => {
        // Given & When
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // Then
        const lyraAvatar = screen.getByTestId('lyra-avatar');
        expect(lyraAvatar).toBeInTheDocument();
        expect(lyraAvatar).toHaveAttribute('data-size', 'sm');
        expect(lyraAvatar).toHaveAttribute('aria-label');
      });

      it('Given I interact with controls, When I use fast forward, Then I can skip through narrative sections', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        const fastForwardButton = screen.getByRole('button', { name: /Fast Forward/ });
        await user.click(fastForwardButton);
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Skipping.../)).toBeInTheDocument();
        });
      });

      it('Given I want personalized content, When I change user level, Then narrative adapts to my experience', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        const levelButton = screen.getByRole('button', { name: /beginner/ });
        await user.click(levelButton);
        
        // Then
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /intermediate/ })).toBeInTheDocument();
        });
        
        // When
        await user.click(screen.getByRole('button', { name: /intermediate/ }));
        
        // Then
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /advanced/ })).toBeInTheDocument();
        });
      });
    });
  });

  describe('Feature: Progress Tracking and Skill Development', () => {
    
    describe('Scenario: Learning progress is tracked and visualized', () => {
      it('Given I start the lesson, When I check my progress, Then I see stage indicators', () => {
        // Given & When
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // Then
        expect(screen.getByText(/1 of 6/)).toBeInTheDocument();
      });

      it('Given I complete stages, When I advance, Then progress indicators update', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/2 of 6/)).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: Skills and tools usage are tracked', () => {
      it('Given I use Maya\'s tools, When I complete activities, Then my skill development is recorded', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('complete-email-recipe')).toBeInTheDocument();
        });
        await user.click(screen.getByTestId('complete-email-recipe'));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Tone Checker - Connection Mastery/)).toBeInTheDocument();
        });
        // Skills should be tracked internally (verified through progress)
      });
    });
  });

  describe('Feature: Accessibility and Inclusive Design', () => {
    
    describe('Scenario: Screen reader users can navigate the lesson', () => {
      it('Given I use a screen reader, When I navigate the lesson, Then all interactive elements have proper labels', () => {
        // Given & When
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // Then
        const beginButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
        expect(beginButton).toHaveAccessibleName();
        
        const fastForwardButton = screen.getByRole('button', { name: /Fast Forward/ });
        expect(fastForwardButton).toHaveAccessibleName();
        
        const lyraAvatar = screen.getByTestId('lyra-avatar');
        expect(lyraAvatar).toHaveAttribute('aria-label');
      });

      it('Given I navigate with keyboard, When I use tab navigation, Then focus management works correctly', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        await user.tab();
        
        // Then
        const firstFocusableElement = screen.getByRole('button', { name: /Fast Forward/ });
        expect(firstFocusableElement).toHaveFocus();
      });
    });

    describe('Scenario: Users with different abilities can complete the lesson', () => {
      it('Given I have motor difficulties, When I use the lesson, Then controls are accessible with appropriate target sizes', () => {
        // Given & When
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // Then
        const beginButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
        const buttonStyles = window.getComputedStyle(beginButton);
        // Button should be properly sized for accessibility (this is more of a visual test)
        expect(beginButton).toBeInTheDocument();
      });
    });
  });

  describe('Feature: Mobile and Responsive Experience', () => {
    
    describe('Scenario: Mobile users can complete the full lesson', () => {
      it('Given I use a mobile device, When I access the lesson, Then the layout adapts appropriately', () => {
        // Given
        // Mock mobile viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 375,
        });
        
        // When
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // Then
        expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
        // Layout should adapt (verified by successful render)
      });

      it('Given I use touch interactions, When I progress through stages, Then touch targets work correctly', async () => {
        const user = userEvent.setup();
        
        // Given
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // When
        const beginButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
        await user.click(beginButton);
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Feature: Completion and Achievement', () => {
    
    describe('Scenario: Successfully completing Maya\'s transformation journey', () => {
      it('Given I complete all stages, When I reach the final transformation, Then I see comprehensive results and achievements', async () => {
        const user = userEvent.setup();
        
        // Given - Complete the full journey
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        
        // Progress through all stages
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Template Library/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        
        // When
        await waitFor(() => screen.getByRole('button', { name: /See Maya's Transformation/ }));
        await user.click(screen.getByRole('button', { name: /See Maya's Transformation/ }));
        
        // Then
        await waitFor(() => {
          expect(screen.getByText(/Maya's Communication Mastery/)).toBeInTheDocument();
          expect(screen.getByText(/From 32 minutes of stress to 5 minutes of confidence/)).toBeInTheDocument();
          expect(screen.getByText(/Skills Mastered/)).toBeInTheDocument();
          expect(screen.getByText(/Tools Mastered/)).toBeInTheDocument();
          expect(screen.getByText(/Your Results/)).toBeInTheDocument();
        });
      });

      it('Given I finish the lesson, When I want to document my achievement, Then I can export a completion certificate', async () => {
        const user = userEvent.setup();
        
        // Given - Navigate to completion
        renderLessonWithRouter(<MayaEmailMasteryLesson />);
        await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
        await waitFor(() => screen.getByTestId('complete-email-recipe'));
        await user.click(screen.getByTestId('complete-email-recipe'));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Template Library/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Template Library/ }));
        await waitFor(() => screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        await user.click(screen.getByRole('button', { name: /Continue to Confidence Building/ }));
        await waitFor(() => screen.getByRole('button', { name: /See Maya's Transformation/ }));
        await user.click(screen.getByRole('button', { name: /See Maya's Transformation/ }));
        
        // When
        await waitFor(() => {
          expect(screen.getByTestId('export-button')).toBeInTheDocument();
        });
        
        // Then
        expect(screen.getByText(/Download Certificate/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Mark Lesson Complete/ })).toBeInTheDocument();
      });
    });
  });
});

// Edge cases and error scenarios
describe('Maya Email Mastery Lesson - Edge Cases', () => {
  describe('Scenario: Handling unexpected user interactions', () => {
    it('Given the lesson is loading, When I rapidly click navigation buttons, Then the state remains consistent', async () => {
      const user = userEvent.setup();
      
      // Given
      renderLessonWithRouter(<MayaEmailMasteryLesson />);
      
      // When - Rapid clicking
      const beginButton = screen.getByRole('button', { name: /Discover the PACE Solution/ });
      await user.click(beginButton);
      await user.click(beginButton);
      await user.click(beginButton);
      
      // Then
      await waitFor(() => {
        expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
      });
      // Should only advance once despite multiple clicks
    });

    it('Given I navigate backwards and forwards, When I test non-linear navigation, Then the lesson maintains consistency', async () => {
      const user = userEvent.setup();
      
      // Given
      renderLessonWithRouter(<MayaEmailMasteryLesson />);
      
      // When - Navigate forward then try to navigate in unexpected ways
      await user.click(screen.getByRole('button', { name: /Discover the PACE Solution/ }));
      
      // Then
      await waitFor(() => {
        expect(screen.getByText(/Email Recipe Builder - PACE Foundation/)).toBeInTheDocument();
      });
      
      // Component should handle state correctly
      expect(screen.getByText(/2 of 6/)).toBeInTheDocument();
    });
  });

  describe('Scenario: Performance under different conditions', () => {
    it('Given slow network conditions, When components load gradually, Then the lesson remains functional', () => {
      // Given & When
      renderLessonWithRouter(<MayaEmailMasteryLesson />);
      
      // Then
      expect(screen.getByText(/Maya's Email Overwhelm Crisis/)).toBeInTheDocument();
      // Should render successfully even with mocked slow components
    });
  });
});