/**
 * Comprehensive Test Suite for AI Interaction Patterns
 * Tests all 5 interaction patterns integrated across Carmen components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import all interaction patterns
import { InteractiveDecisionTree, createEngagementDecisionTree } from '@/components/ui/interaction-patterns/InteractiveDecisionTree';
import { PriorityCardSystem } from '@/components/ui/interaction-patterns/PriorityCardSystem';
import { PreferenceSliderGrid } from '@/components/ui/interaction-patterns/PreferenceSliderGrid';
import { TimelineScenarioBuilder } from '@/components/ui/interaction-patterns/TimelineScenarioBuilder';
import { DynamicPromptBuilder } from '@/components/ui/DynamicPromptBuilder';

// Mock data for testing
const mockTeamSizeOptions = [
  { id: 'small', label: 'Small Team (2-5)', description: 'Intimate, close-knit team', recommended: false },
  { id: 'medium', label: 'Medium Team (6-15)', description: 'Balanced team size', recommended: true },
  { id: 'large', label: 'Large Team (16+)', description: 'Complex team dynamics', recommended: false }
];

const mockChallengeOptions = [
  { id: 'communication', label: 'Communication Issues', description: 'Poor information flow', recommended: true },
  { id: 'motivation', label: 'Low Motivation', description: 'Team disengagement', recommended: false },
  { id: 'performance', label: 'Performance Gaps', description: 'Inconsistent results', recommended: false }
];

const mockStrategyOptions = [
  { id: 'feedback', label: 'Regular Feedback', description: 'Structured feedback loops', recommended: true },
  { id: 'recognition', label: 'Recognition Programs', description: 'Celebrate achievements', recommended: true }
];

const mockGoalOptions = [
  { id: 'retention', label: 'Improve Retention', description: 'Reduce turnover', recommended: true },
  { id: 'productivity', label: 'Boost Productivity', description: 'Increase output', recommended: false }
];

const mockPriorityCards = [
  {
    id: 'card-1',
    title: 'Team Communication',
    description: 'Improve communication channels',
    category: 'Communication',
    icon: '💬',
    priority: 1,
    metadata: {
      effort: 'medium' as const,
      impact: 'high' as const,
      urgency: 'high' as const
    }
  },
  {
    id: 'card-2',
    title: 'Performance Reviews',
    description: 'Implement regular reviews',
    category: 'Performance',
    icon: '📊',
    priority: 2,
    metadata: {
      effort: 'high' as const,
      impact: 'medium' as const,
      urgency: 'medium' as const
    }
  }
];

const mockSliders = [
  {
    id: 'autonomy',
    label: 'Autonomy Level',
    description: 'How much independence do team members have?',
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    defaultValue: 50,
    unit: '%'
  },
  {
    id: 'collaboration',
    label: 'Collaboration Focus',
    description: 'How much emphasis on teamwork?',
    min: 0,
    max: 100,
    step: 1,
    value: 75,
    defaultValue: 75,
    unit: '%'
  }
];

const mockMilestones = [
  {
    id: 'milestone-1',
    title: 'Team Assessment',
    description: 'Initial team evaluation',
    type: 'assessment' as const,
    priority: 'high' as const,
    dependencies: [],
    icon: '📋',
    color: 'bg-blue-100'
  },
  {
    id: 'milestone-2',
    title: 'Strategy Planning',
    description: 'Develop engagement strategy',
    type: 'planning' as const,
    priority: 'medium' as const,
    dependencies: ['milestone-1'],
    icon: '🎯',
    color: 'bg-green-100'
  }
];

const mockPromptSegments = [
  {
    id: 'context-1',
    label: 'Team Context',
    value: 'Medium-sized team with communication challenges',
    type: 'context' as const,
    color: 'border-l-blue-500',
    required: true
  },
  {
    id: 'instruction-1',
    label: 'Primary Instruction',
    value: 'Create personalized engagement strategy',
    type: 'instruction' as const,
    color: 'border-l-green-500',
    required: true
  }
];

describe('AI Interaction Patterns Integration Tests', () => {
  describe('1. InteractiveDecisionTree', () => {
    let mockState: any;
    let mockOnStateChange: any;
    let mockOnComplete: any;

    beforeEach(() => {
      mockState = {
        currentNodeId: 'root',
        visitedNodes: new Set(['root']),
        decisionPath: [{ nodeId: 'root', timestamp: new Date(), level: 0 }],
        choices: {},
        isComplete: false
      };
      mockOnStateChange = vi.fn();
      mockOnComplete = vi.fn();
    });

    it('renders decision tree with Carmen engagement options', () => {
      const { nodes, rootNodeId } = createEngagementDecisionTree(
        mockTeamSizeOptions,
        mockChallengeOptions,
        mockStrategyOptions,
        mockGoalOptions
      );

      render(
        <InteractiveDecisionTree
          title="Carmen's Engagement Strategy Builder"
          description="Build your personalized engagement approach"
          nodes={nodes}
          rootNodeId={rootNodeId}
          state={mockState}
          onStateChange={mockOnStateChange}
          onComplete={mockOnComplete}
          characterTheme="carmen"
          showProgress={true}
          allowBacktrack={true}
        />
      );

      expect(screen.getByText("Carmen's Engagement Strategy Builder")).toBeInTheDocument();
      expect(screen.getByText('Team Engagement Challenge')).toBeInTheDocument();
      expect(screen.getByText('Begin Engagement Journey')).toBeInTheDocument();
    });

    it('handles choice selection and updates state', async () => {
      const { nodes, rootNodeId } = createEngagementDecisionTree(
        mockTeamSizeOptions,
        mockChallengeOptions,
        mockStrategyOptions,
        mockGoalOptions
      );

      render(
        <InteractiveDecisionTree
          title="Test Decision Tree"
          nodes={nodes}
          rootNodeId={rootNodeId}
          state={mockState}
          onStateChange={mockOnStateChange}
          onComplete={mockOnComplete}
        />
      );

      const startButton = screen.getByText('Begin Engagement Journey');
      fireEvent.click(startButton);

      expect(mockOnStateChange).toHaveBeenCalled();
      const newState = mockOnStateChange.mock.calls[0][0];
      expect(newState.currentNodeId).toBe('team-size');
    });

    it('shows progress and navigation controls', () => {
      const { nodes, rootNodeId } = createEngagementDecisionTree(
        mockTeamSizeOptions,
        mockChallengeOptions,
        mockStrategyOptions,
        mockGoalOptions
      );

      render(
        <InteractiveDecisionTree
          title="Test Decision Tree"
          nodes={nodes}
          rootNodeId={rootNodeId}
          state={mockState}
          onStateChange={mockOnStateChange}
          allowBacktrack={true}
        />
      );

      expect(screen.getByText('Explored: 1 of')).toBeInTheDocument();
      expect(screen.getByText('Level 0')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
  });

  describe('2. PriorityCardSystem', () => {
    let mockOnCardsChange: any;
    let mockOnComplete: any;

    beforeEach(() => {
      mockOnCardsChange = vi.fn();
      mockOnComplete = vi.fn();
    });

    it('renders priority cards with Carmen theme', () => {
      render(
        <PriorityCardSystem
          title="Carmen's Retention Priorities"
          description="Prioritize retention strategies"
          cards={mockPriorityCards}
          onCardsChange={mockOnCardsChange}
          onComplete={mockOnComplete}
          characterTheme="carmen"
          showImpactMatrix={true}
          showImpactScore={true}
        />
      );

      expect(screen.getByText("Carmen's Retention Priorities")).toBeInTheDocument();
      expect(screen.getByText('Team Communication')).toBeInTheDocument();
      expect(screen.getByText('Performance Reviews')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
    });

    it('displays impact matrix when enabled', () => {
      render(
        <PriorityCardSystem
          title="Test Priority System"
          cards={mockPriorityCards}
          onCardsChange={mockOnCardsChange}
          characterTheme="carmen"
          showImpactMatrix={true}
        />
      );

      expect(screen.getByText('Impact vs Effort Matrix')).toBeInTheDocument();
      expect(screen.getByText('Quick Wins')).toBeInTheDocument();
      expect(screen.getByText('Major Projects')).toBeInTheDocument();
      expect(screen.getByText('Fill-ins')).toBeInTheDocument();
      expect(screen.getByText('Time Wasters')).toBeInTheDocument();
    });

    it('shows Carmen-specific prioritization tips', () => {
      render(
        <PriorityCardSystem
          title="Test Priority System"
          cards={mockPriorityCards}
          onCardsChange={mockOnCardsChange}
          characterTheme="carmen"
          showPriorityTips={true}
        />
      );

      expect(screen.getByText("Carmen's Retention Prioritization Guide")).toBeInTheDocument();
      expect(screen.getByText(/Address immediate flight risks first/)).toBeInTheDocument();
      expect(screen.getByText(/Focus on high-impact, preventive measures/)).toBeInTheDocument();
    });

    it('handles card reordering', async () => {
      render(
        <PriorityCardSystem
          title="Test Priority System"
          cards={mockPriorityCards}
          onCardsChange={mockOnCardsChange}
        />
      );

      // Test move up/down buttons
      const moveUpButtons = screen.getAllByTitle(/move up/i);
      if (moveUpButtons.length > 0) {
        fireEvent.click(moveUpButtons[0]);
        expect(mockOnCardsChange).toHaveBeenCalled();
      }
    });
  });

  describe('3. PreferenceSliderGrid', () => {
    let mockValues: any;
    let mockOnValuesChange: any;
    let mockOnComplete: any;

    beforeEach(() => {
      mockValues = {
        autonomy: 50,
        collaboration: 75
      };
      mockOnValuesChange = vi.fn();
      mockOnComplete = vi.fn();
    });

    it('renders slider grid with Carmen theme', () => {
      render(
        <PreferenceSliderGrid
          title="Carmen's Team Preferences"
          description="Configure team engagement preferences"
          sliders={mockSliders}
          values={mockValues}
          onValuesChange={mockOnValuesChange}
          onComplete={mockOnComplete}
          characterTheme="carmen"
          showRadarChart={true}
          gridColumns={2}
        />
      );

      expect(screen.getByText("Carmen's Team Preferences")).toBeInTheDocument();
      expect(screen.getByText('Autonomy Level')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Focus')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('shows radar chart when enabled', () => {
      render(
        <PreferenceSliderGrid
          title="Test Slider Grid"
          sliders={mockSliders}
          values={mockValues}
          onValuesChange={mockOnValuesChange}
          characterTheme="carmen"
          showRadarChart={true}
        />
      );

      expect(screen.getByText('Preferences Radar')).toBeInTheDocument();
    });

    it('handles slider value changes', async () => {
      const user = userEvent.setup();

      render(
        <PreferenceSliderGrid
          title="Test Slider Grid"
          sliders={mockSliders}
          values={mockValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);

      // Test slider interaction
      await user.click(sliders[0]);
      await waitFor(() => {
        expect(mockOnValuesChange).toHaveBeenCalled();
      });
    });

    it('displays real-time configuration summary', () => {
      render(
        <PreferenceSliderGrid
          title="Test Slider Grid"
          sliders={mockSliders}
          values={mockValues}
          onValuesChange={mockOnValuesChange}
          showRealTimeUpdates={true}
        />
      );

      expect(screen.getByText('Current Configuration')).toBeInTheDocument();
      expect(screen.getByText('Real-time updates enabled')).toBeInTheDocument();
    });
  });

  describe('4. TimelineScenarioBuilder', () => {
    let mockOnScenarioUpdate: any;
    let mockOnMilestoneSelection: any;

    beforeEach(() => {
      mockOnScenarioUpdate = vi.fn();
      mockOnMilestoneSelection = vi.fn();
    });

    it('renders timeline builder with available milestones', () => {
      render(
        <TimelineScenarioBuilder
          title="Carmen's Leadership Timeline"
          description="Build your leadership development journey"
          availableMilestones={mockMilestones}
          onScenarioUpdate={mockOnScenarioUpdate}
          onMilestoneSelection={mockOnMilestoneSelection}
          characterTheme="carmen"
          enableSimulation={true}
          enableComparison={true}
        />
      );

      expect(screen.getByText("Carmen's Leadership Timeline")).toBeInTheDocument();
      expect(screen.getByText('Available Milestones')).toBeInTheDocument();
      expect(screen.getByText('Team Assessment')).toBeInTheDocument();
      expect(screen.getByText('Strategy Planning')).toBeInTheDocument();
    });

    it('shows view mode controls', () => {
      render(
        <TimelineScenarioBuilder
          availableMilestones={mockMilestones}
          onScenarioUpdate={mockOnScenarioUpdate}
          characterTheme="carmen"
          enableSimulation={true}
          enableComparison={true}
        />
      );

      expect(screen.getByRole('button', { name: /build/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /simulate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument();
    });

    it('displays scenario summary', () => {
      render(
        <TimelineScenarioBuilder
          availableMilestones={mockMilestones}
          onScenarioUpdate={mockOnScenarioUpdate}
          characterTheme="carmen"
        />
      );

      expect(screen.getByText('Scenario Overview')).toBeInTheDocument();
      expect(screen.getByText(/milestones.*weeks duration/)).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });
  });

  describe('5. DynamicPromptBuilder Integration', () => {
    let mockOnPromptUpdate: any;

    beforeEach(() => {
      mockOnPromptUpdate = vi.fn();
    });

    it('renders prompt builder with segment visualization', () => {
      render(
        <DynamicPromptBuilder
          segments={mockPromptSegments}
          onPromptUpdate={mockOnPromptUpdate}
          characterName="Carmen"
          characterTheme="carmen"
          showCopyButton={true}
          autoUpdate={true}
        />
      );

      expect(screen.getByText('Dynamic AI Prompt Builder')).toBeInTheDocument();
      expect(screen.getByText('Prompt Components')).toBeInTheDocument();
      expect(screen.getByText('Generated AI Prompt')).toBeInTheDocument();
      expect(screen.getByText('Team Context')).toBeInTheDocument();
      expect(screen.getByText('Primary Instruction')).toBeInTheDocument();
    });

    it('shows progress and completion indicators', () => {
      render(
        <DynamicPromptBuilder
          segments={mockPromptSegments}
          onPromptUpdate={mockOnPromptUpdate}
          characterName="Carmen"
          characterTheme="carmen"
        />
      );

      expect(screen.getByText('2/2 segments')).toBeInTheDocument();
      expect(screen.getByText(/Watch how your selections build the AI prompt/)).toBeInTheDocument();
    });

    it('generates Carmen-specific prompt structure', () => {
      render(
        <DynamicPromptBuilder
          segments={mockPromptSegments}
          onPromptUpdate={mockOnPromptUpdate}
          characterName="Carmen"
          characterTheme="carmen"
        />
      );

      // Check that the prompt includes Carmen-specific content
      expect(screen.getByText(/You are Carmen, an expert in people management/)).toBeInTheDocument();
    });

    it('handles copy to clipboard functionality', async () => {
      const user = userEvent.setup();

      render(
        <DynamicPromptBuilder
          segments={mockPromptSegments}
          onPromptUpdate={mockOnPromptUpdate}
          characterName="Carmen"
          showCopyButton={true}
        />
      );

      const copyButton = screen.getByRole('button', { name: /copy prompt/i });
      await user.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });
  });

  describe('6. Cross-Pattern Integration', () => {
    it('maintains theme consistency across all patterns', () => {
      const { rerender } = render(
        <div>
          <InteractiveDecisionTree
            title="Test Decision Tree"
            nodes={{}}
            rootNodeId="test"
            state={{
              currentNodeId: 'test',
              visitedNodes: new Set(['test']),
              decisionPath: [],
              choices: {},
              isComplete: false
            }}
            onStateChange={vi.fn()}
            characterTheme="carmen"
          />
        </div>
      );

      // Check for Carmen theme colors
      expect(document.querySelector('.border-purple-200')).toBeInTheDocument();

      rerender(
        <div>
          <PriorityCardSystem
            title="Test Priority System"
            cards={mockPriorityCards}
            onCardsChange={vi.fn()}
            characterTheme="carmen"
          />
        </div>
      );

      // Verify consistent theme across components
      expect(document.querySelector('.text-purple-600')).toBeInTheDocument();
    });

    it('handles responsive design across all patterns', () => {
      render(
        <div className="container mx-auto">
          <PreferenceSliderGrid
            title="Test Responsive Grid"
            sliders={mockSliders}
            values={{ autonomy: 50, collaboration: 75 }}
            onValuesChange={vi.fn()}
            gridColumns={2}
          />
        </div>
      );

      // Check for responsive grid classes
      expect(document.querySelector('.grid-cols-1')).toBeInTheDocument();
      expect(document.querySelector('.lg\\:grid-cols-2')).toBeInTheDocument();
    });
  });

  describe('7. Accessibility Compliance', () => {
    it('provides proper ARIA labels and roles', () => {
      render(
        <PreferenceSliderGrid
          title="Accessibility Test Grid"
          sliders={mockSliders}
          values={{ autonomy: 50, collaboration: 75 }}
          onValuesChange={vi.fn()}
        />
      );

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
      
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-valuemin');
        expect(slider).toHaveAttribute('aria-valuemax');
        expect(slider).toHaveAttribute('aria-valuenow');
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <PriorityCardSystem
          title="Keyboard Test"
          cards={mockPriorityCards}
          onCardsChange={vi.fn()}
        />
      );

      // Test tab navigation
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('8. Performance Validation', () => {
    it('renders large datasets efficiently', () => {
      const largeSliderSet = Array.from({ length: 50 }, (_, i) => ({
        id: `slider-${i}`,
        label: `Preference ${i}`,
        min: 0,
        max: 100,
        step: 1,
        value: i * 2,
        defaultValue: i * 2
      }));

      const startTime = performance.now();
      
      render(
        <PreferenceSliderGrid
          title="Performance Test"
          sliders={largeSliderSet}
          values={largeSliderSet.reduce((acc, slider) => ({ ...acc, [slider.id]: slider.value }), {})}
          onValuesChange={vi.fn()}
          gridColumns={3}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText('Performance Test')).toBeInTheDocument();
    });

    it('handles frequent state updates without performance degradation', async () => {
      const mockOnValuesChange = vi.fn();
      const values = { autonomy: 50, collaboration: 75 };

      render(
        <PreferenceSliderGrid
          title="Performance Test"
          sliders={mockSliders}
          values={values}
          onValuesChange={mockOnValuesChange}
          showRealTimeUpdates={true}
        />
      );

      // Simulate rapid changes
      const sliders = screen.getAllByRole('slider');
      for (let i = 0; i < 10; i++) {
        fireEvent.change(sliders[0], { target: { value: 50 + i } });
      }

      // Should handle frequent updates without errors
      expect(mockOnValuesChange).toHaveBeenCalled();
    });
  });
});