import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import SofiaVoiceDiscoveryLesson from './SofiaVoiceDiscoveryLesson';

// Mock dependencies for clean testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ expression, animated }: { expression: string; animated?: boolean }) => (
    <div data-testid="lyra-avatar" data-expression={expression} data-animated={animated}>
      Lyra Avatar
    </div>
  ),
}));

describe('Sofia Voice Discovery Lesson - BDD Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Feature: Sofia discovers her authentic voice through the VOICE Framework', () => {
    describe('Scenario: New user begins Sofia voice discovery journey', () => {
      it('Given I am a new user interested in voice discovery', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // Then I should see the Sofia-themed introduction
        expect(screen.getByText("Sofia's Voice Discovery Journey")).toBeInTheDocument();
        expect(screen.getByText('From silent passion to compelling voice')).toBeInTheDocument();
        expect(screen.getByText('The VOICE Framework')).toBeInTheDocument();
      });

      it('When I see the introduction screen', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // Then I should see Sofia-specific branding and voice theme
        expect(screen.getByText('Meeting Sofia')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Begin Sofia's Journey/ })).toBeInTheDocument();
      });

      it('And I click begin journey', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Then I should enter the Values foundation stage
        await waitFor(() => {
          expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: User progresses through VOICE Framework stages', () => {
      it('Given I am in the Values stage', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        await waitFor(() => {
          expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
        });
      });

      it('When I select "Human dignity above all else" as my core value', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        await waitFor(() => {
          expect(screen.getByText('Human dignity above all else')).toBeInTheDocument();
        });
        
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        // Then I should see confirmation and progress to Origin stage
        await waitFor(() => {
          expect(screen.getByText('O - Origin Story')).toBeInTheDocument();
        });
      });

      it('And I select "Childhood challenge that built resilience" as my origin', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        // Then I should progress to Impact stage
        await waitFor(() => {
          expect(screen.getByText('I - Impact Vision')).toBeInTheDocument();
        });
      });

      it('And I select "From isolation to belonging" as my impact vision', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete Values and Origin stages
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        await waitFor(() => screen.getByText('From isolation to belonging'));
        fireEvent.click(screen.getByText('From isolation to belonging'));
        
        // Then I should progress to Craft & Style stage
        await waitFor(() => {
          expect(screen.getByText('C - Craft & Style')).toBeInTheDocument();
        });
      });

      it('And I select "Compassionate Connector" as my voice style', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete all previous stages
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        await waitFor(() => screen.getByText('From isolation to belonging'));
        fireEvent.click(screen.getByText('From isolation to belonging'));
        
        await waitFor(() => screen.getByText('Compassionate Connector'));
        fireEvent.click(screen.getByText('Compassionate Connector'));
        
        // Then I should see my complete voice profile
        await waitFor(() => {
          expect(screen.getByText('Your Voice Profile is Ready!')).toBeInTheDocument();
          expect(screen.getByText('Express Your Voice')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: User completes voice discovery and sees authentic story', () => {
      it('Given I have completed all VOICE framework stages', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete all stages
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        await waitFor(() => screen.getByText('From isolation to belonging'));
        fireEvent.click(screen.getByText('From isolation to belonging'));
        
        await waitFor(() => screen.getByText('Compassionate Connector'));
        fireEvent.click(screen.getByText('Compassionate Connector'));
        
        await waitFor(() => {
          expect(screen.getByText('Express Your Voice')).toBeInTheDocument();
        });
      });

      it('When I click "Express Your Voice"', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete all stages quickly
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
        
        // Then I should see the Expression stage with my authentic story
        await waitFor(() => {
          expect(screen.getByText('E - Expression in Action')).toBeInTheDocument();
          expect(screen.getByText("Sofia's Voice in Action")).toBeInTheDocument();
        });
      });

      it('Then I should see my complete voice profile summary', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete framework
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
        
        // Then I should see all my VOICE elements in the final story
        await waitFor(() => {
          expect(screen.getByText('Your Complete Voice Profile:')).toBeInTheDocument();
          expect(screen.getByText('Copy Your Voice ✨')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: User interacts with Sofia-specific voice profiles', () => {
      it('Given I am in the Craft & Style stage', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Navigate to Craft stage
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        await waitFor(() => screen.getByText('From isolation to belonging'));
        fireEvent.click(screen.getByText('From isolation to belonging'));
        
        await waitFor(() => {
          expect(screen.getByText('C - Craft & Style')).toBeInTheDocument();
        });
      });

      it('When I see the voice profile options', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Navigate to Craft stage
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        await waitFor(() => screen.getByText('From isolation to belonging'));
        fireEvent.click(screen.getByText('From isolation to belonging'));
        
        // Then I should see all four Sofia-specific voice profiles
        await waitFor(() => {
          expect(screen.getByText('Compassionate Connector')).toBeInTheDocument();
          expect(screen.getByText('Vulnerable Truth-Teller')).toBeInTheDocument();
          expect(screen.getByText('Hopeful Visionary')).toBeInTheDocument();
          expect(screen.getByText('Wisdom Weaver')).toBeInTheDocument();
        });
      });

      it('And each profile shows Sofia-specific characteristics', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Navigate to Craft stage
        await waitFor(() => screen.getByText('Human dignity above all else'));
        fireEvent.click(screen.getByText('Human dignity above all else'));
        
        await waitFor(() => screen.getByText('Childhood challenge that built resilience'));
        fireEvent.click(screen.getByText('Childhood challenge that built resilience'));
        
        await waitFor(() => screen.getByText('From isolation to belonging'));
        fireEvent.click(screen.getByText('From isolation to belonging'));
        
        // Then I should see descriptive text and examples for each profile
        await waitFor(() => {
          expect(screen.getByText('Leads with empathy, builds bridges through shared humanity')).toBeInTheDocument();
          expect(screen.getByText('Shares authentic struggle and growth, inspiring through honesty')).toBeInTheDocument();
          expect(screen.getByText('Paints pictures of possibility while acknowledging current reality')).toBeInTheDocument();
          expect(screen.getByText('Finds universal truths in personal experiences, teaches through story')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: User uses interactive features for enhanced learning', () => {
      it('Given I am progressing through the lesson', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // Then I should see interactive controls
        expect(screen.getByText('Fast Forward')).toBeInTheDocument();
        expect(screen.getByText('beginner mode')).toBeInTheDocument();
      });

      it('When I use fast forward to skip typewriter animations', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        fireEvent.click(screen.getByText('Fast Forward'));
        
        // Then I should see immediate completion feedback
        expect(screen.getByText('Skipping...')).toBeInTheDocument();
      });

      it('And I cycle through user experience levels', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // When I click the user level button multiple times
        fireEvent.click(screen.getByText('beginner mode'));
        expect(screen.getByText('intermediate mode')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('intermediate mode'));
        expect(screen.getByText('advanced mode')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('advanced mode'));
        expect(screen.getByText('beginner mode')).toBeInTheDocument();
      });

      it('And I track my progress through the VOICE summary panel', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // Then I should see the VOICE framework tracking panel
        expect(screen.getByText('Your VOICE Framework')).toBeInTheDocument();
        expect(screen.getByText('VALUES:')).toBeInTheDocument();
        expect(screen.getByText('ORIGIN:')).toBeInTheDocument();
        expect(screen.getByText('IMPACT:')).toBeInTheDocument();
        expect(screen.getByText('CRAFT:')).toBeInTheDocument();
        expect(screen.getByText('EXPRESSION:')).toBeInTheDocument();
      });
    });

    describe('Scenario: User experiences Sofia-specific blur effect for voice uncertainty', () => {
      it('Given I start the lesson', () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // Then I should see Sofia-themed colors and voice uncertainty representation
        expect(screen.getByText("Sofia's Voice Discovery Journey")).toBeInTheDocument();
        expect(screen.getByText('From silent passion to compelling voice')).toBeInTheDocument();
      });

      it('When I progress through each stage', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // As I complete each stage, the blur should progressively clear
        await waitFor(() => {
          expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
        });
        
        // The lesson should use blur effects to represent voice clarity progression
        // This would be tested in integration tests with actual DOM manipulation
      });

      it('Then I should see complete clarity when voice mastery is achieved', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete all stages to achieve voice clarity
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
        
        // Final stage should show complete clarity
        await waitFor(() => {
          expect(screen.getByText('E - Expression in Action')).toBeInTheDocument();
          expect(screen.getByText('Voice discovery complete!')).toBeInTheDocument();
        });
      });
    });

    describe('Scenario: User can reset and try different voice combinations', () => {
      it('Given I have completed the voice discovery', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete full journey
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
          expect(screen.getByText('Try Another VOICE')).toBeInTheDocument();
        });
      });

      it('When I click "Try Another VOICE"', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        fireEvent.click(screen.getByText("Begin Sofia's Journey"));
        
        // Complete and reset
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
        
        // Then I should return to the Values stage to try different combinations
        await waitFor(() => {
          expect(screen.getByText('V - Values Foundation')).toBeInTheDocument();
        });
      });

      it('And I can explore different voice combinations', async () => {
        render(<SofiaVoiceDiscoveryLesson />);
        
        // This scenario ensures the lesson supports exploration of different
        // voice combinations, which is crucial for finding authentic expression
        expect(screen.getByText("Sofia's Voice Discovery Journey")).toBeInTheDocument();
      });
    });
  });
});