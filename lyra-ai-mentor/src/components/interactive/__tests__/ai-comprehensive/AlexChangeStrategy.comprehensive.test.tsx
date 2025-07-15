import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlexChangeStrategy } from '../../AlexChangeStrategy';
import { AITestUtils, AITestData } from '../../../../test/ai-test-utils';
import { AI_TEST_CONFIG, AI_MOCK_RESPONSES } from '../../../../test/ai-component-test-config';
import { createTestElement, PerformanceTestUtils } from '../testUtils';

describe('AlexChangeStrategy - Comprehensive Test Suite', () => {
  const mockElement = createTestElement({
    type: 'alex_change_strategy',
    title: 'Strategic Change Management',
    content: 'Develop comprehensive change management strategies',
    configuration: {
      strategy_types: ['digital_transformation', 'cultural_change', 'process_improvement'],
      stakeholder_analysis: true,
      risk_assessment: true,
      timeline_planning: true,
      success_metrics: true
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    AITestUtils.mocks.aiService.generateResponse.mockReset();
    AITestUtils.mocks.analyticsService.track.mockReset();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Strategy Development', () => {
    it('should develop comprehensive change strategy', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce(
        AI_MOCK_RESPONSES.CHANGE_STRATEGY
      );

      render(<AlexChangeStrategy element={mockElement} />);

      // Input change initiative details
      await user.type(screen.getByLabelText(/initiative name/i), 'Digital Transformation');
      await user.selectOptions(screen.getByLabelText(/timeline/i), '6_months');
      await user.selectOptions(screen.getByLabelText(/scope/i), 'organization_wide');
      
      await user.click(screen.getByRole('button', { name: /develop strategy/i }));

      await waitFor(() => {
        expect(screen.getByText('Planning')).toBeInTheDocument();
        expect(screen.getByText('Execution')).toBeInTheDocument();
        expect(screen.getByText('Monitoring')).toBeInTheDocument();
      });
    });

    it('should perform stakeholder analysis', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        stakeholders: AI_MOCK_RESPONSES.CHANGE_STRATEGY.stakeholder_analysis
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /analyze stakeholders/i }));

      await waitFor(() => {
        expect(screen.getByText('Leadership')).toBeInTheDocument();
        expect(screen.getByText('high influence')).toBeInTheDocument();
        expect(screen.getByText('strong support')).toBeInTheDocument();
      });
    });

    it('should assess risks and mitigation strategies', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        risk_assessment: {
          high_risks: [
            { risk: 'User resistance to new system', probability: 0.7, impact: 'high' },
            { risk: 'Budget overrun', probability: 0.4, impact: 'medium' }
          ],
          mitigation_strategies: AI_MOCK_RESPONSES.CHANGE_STRATEGY.risk_mitigation
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /assess risks/i }));

      await waitFor(() => {
        expect(screen.getByText('User resistance to new system')).toBeInTheDocument();
        expect(screen.getByText('Develop comprehensive training programs')).toBeInTheDocument();
      });
    });
  });

  describe('Implementation Planning', () => {
    it('should create detailed implementation timeline', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        implementation_plan: AI_MOCK_RESPONSES.CHANGE_STRATEGY.implementation_plan
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.type(screen.getByLabelText(/project duration/i), '6 months');
      await user.click(screen.getByRole('button', { name: /create timeline/i }));

      await waitFor(() => {
        expect(screen.getByText('Planning')).toBeInTheDocument();
        expect(screen.getByText('2 weeks')).toBeInTheDocument();
        expect(screen.getByText('Requirements gathering')).toBeInTheDocument();
      });
    });

    it('should assign responsibilities and resources', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        resource_allocation: {
          team_assignments: [
            { role: 'Project Manager', person: 'Sarah Johnson', capacity: '100%' },
            { role: 'Technical Lead', person: 'Mike Chen', capacity: '75%' },
            { role: 'Change Champion', person: 'Lisa Rodriguez', capacity: '50%' }
          ],
          budget_breakdown: {
            technology: 60000,
            training: 25000,
            consulting: 15000
          }
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /allocate resources/i }));

      await waitFor(() => {
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Project Manager')).toBeInTheDocument();
        expect(screen.getByText('$60,000')).toBeInTheDocument();
      });
    });

    it('should define success metrics and KPIs', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        success_metrics: {
          quantitative: [
            { metric: 'User adoption rate', target: '95%', timeframe: '3 months' },
            { metric: 'Process efficiency gain', target: '40%', timeframe: '6 months' }
          ],
          qualitative: [
            { metric: 'User satisfaction', target: '4.5/5', method: 'survey' },
            { metric: 'Cultural alignment', target: 'High', method: 'assessment' }
          ]
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /define metrics/i }));

      await waitFor(() => {
        expect(screen.getByText('User adoption rate')).toBeInTheDocument();
        expect(screen.getByText('95%')).toBeInTheDocument();
        expect(screen.getByText('User satisfaction')).toBeInTheDocument();
      });
    });
  });

  describe('Communication Strategy', () => {
    it('should develop communication plan', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        communication_plan: {
          stakeholder_groups: [
            {
              group: 'Senior Leadership',
              frequency: 'Weekly',
              channel: 'Executive briefing',
              content: 'Progress updates, decision points'
            },
            {
              group: 'End Users',
              frequency: 'Bi-weekly',
              channel: 'Team meetings',
              content: 'Training updates, benefit highlights'
            }
          ],
          key_messages: [
            'This change will improve our service delivery',
            'Everyone will receive comprehensive training',
            'We are committed to supporting you through this transition'
          ]
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /communication plan/i }));

      await waitFor(() => {
        expect(screen.getByText('Senior Leadership')).toBeInTheDocument();
        expect(screen.getByText('Weekly')).toBeInTheDocument();
        expect(screen.getByText('Everyone will receive comprehensive training')).toBeInTheDocument();
      });
    });

    it('should generate stakeholder-specific messages', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        targeted_messages: {
          executives: {
            tone: 'strategic',
            focus: 'ROI and competitive advantage',
            sample: 'This initiative will position us as industry leaders...'
          },
          managers: {
            tone: 'supportive',
            focus: 'team support and resources',
            sample: 'We are providing all the tools and training your team needs...'
          },
          employees: {
            tone: 'reassuring',
            focus: 'personal benefits and job security',
            sample: 'These changes will make your work more efficient and rewarding...'
          }
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.selectOptions(screen.getByLabelText(/audience/i), 'executives');
      await user.click(screen.getByRole('button', { name: /generate message/i }));

      await waitFor(() => {
        expect(screen.getByText(/position us as industry leaders/i)).toBeInTheDocument();
      });
    });
  });

  describe('Change Readiness Assessment', () => {
    it('should assess organizational readiness', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        readiness_assessment: {
          overall_score: 75,
          dimensions: {
            leadership_commitment: 85,
            organizational_capacity: 70,
            change_history: 65,
            culture_alignment: 80
          },
          recommendations: [
            'Strengthen project management capabilities',
            'Address concerns from previous change initiatives',
            'Increase communication about benefits'
          ]
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /assess readiness/i }));

      await waitFor(() => {
        expect(screen.getByText('Overall Readiness: 75%')).toBeInTheDocument();
        expect(screen.getByText('Leadership Commitment: 85%')).toBeInTheDocument();
        expect(screen.getByText('Strengthen project management capabilities')).toBeInTheDocument();
      });
    });

    it('should identify change barriers', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        barriers: [
          {
            category: 'Cultural',
            description: 'Resistance to new technology',
            severity: 'high',
            solutions: ['Gradual introduction', 'Peer champions', 'Success stories']
          },
          {
            category: 'Resource',
            description: 'Limited training budget',
            severity: 'medium',
            solutions: ['Phased training approach', 'Internal trainer program']
          }
        ]
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /identify barriers/i }));

      await waitFor(() => {
        expect(screen.getByText('Resistance to new technology')).toBeInTheDocument();
        expect(screen.getByText('Gradual introduction')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should track change progress in real-time', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        progress_metrics: {
          overall_progress: 65,
          milestones: [
            { name: 'Planning Complete', status: 'completed', date: '2024-01-15' },
            { name: 'Training Started', status: 'in_progress', progress: 40 },
            { name: 'System Deployment', status: 'pending', planned_date: '2024-03-01' }
          ],
          risk_indicators: [
            { indicator: 'Budget variance', status: 'green', value: '+2%' },
            { indicator: 'Timeline adherence', status: 'yellow', value: '-5 days' }
          ]
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /view dashboard/i }));

      await waitFor(() => {
        expect(screen.getByText('Overall Progress: 65%')).toBeInTheDocument();
        expect(screen.getByText('Planning Complete')).toBeInTheDocument();
        expect(screen.getByText('Budget variance')).toBeInTheDocument();
      });
    });

    it('should generate progress reports', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        progress_report: {
          executive_summary: 'Change initiative is progressing well with 65% completion',
          key_achievements: [
            'All stakeholder workshops completed',
            'Training program launched successfully',
            '40% of users have completed initial training'
          ],
          challenges: [
            'Some resistance in the finance department',
            'Minor delays in system integration'
          ],
          next_steps: [
            'Complete remaining user training',
            'Address finance department concerns',
            'Begin pilot testing with selected users'
          ]
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /generate report/i }));

      await waitFor(() => {
        expect(screen.getByText('Change initiative is progressing well')).toBeInTheDocument();
        expect(screen.getByText('All stakeholder workshops completed')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle complex organizational structures', async () => {
      const { memoryUsage } = await AITestUtils.Performance.testAIMemoryUsage({
        component: () => <AlexChangeStrategy element={mockElement} />,
        operation: async () => {
          const user = userEvent.setup();
          
          // Simulate large organization with many stakeholders
          const stakeholders = Array.from({ length: 50 }, (_, i) => ({
            name: `Stakeholder ${i}`,
            role: `Role ${i}`,
            influence: Math.random() > 0.5 ? 'high' : 'low'
          }));
          
          AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
            stakeholders: stakeholders
          });
          
          await user.click(screen.getByRole('button', { name: /analyze stakeholders/i }));
          await waitFor(() => screen.getByText('Stakeholder 0'));
        }
      });

      expect(memoryUsage).toBeLessThan(AI_TEST_CONFIG.MAX_MEMORY_USAGE);
    });

    it('should efficiently process multiple strategy scenarios', async () => {
      const user = userEvent.setup();
      
      // Mock multiple scenario responses
      for (let i = 0; i < 5; i++) {
        AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
          scenario: `Scenario ${i}`,
          success_probability: Math.random(),
          estimated_timeline: `${6 + i} months`
        });
      }

      render(<AlexChangeStrategy element={mockElement} />);

      // Generate multiple scenarios
      const promises = Array.from({ length: 5 }, async (_, i) => {
        await user.click(screen.getByRole('button', { name: /generate scenario/i }));
      });

      await Promise.all(promises);

      // Verify all scenarios are processed
      await waitFor(() => {
        for (let i = 0; i < 5; i++) {
          expect(screen.getByText(`Scenario ${i}`)).toBeInTheDocument();
        }
      });
    });
  });

  describe('Integration and Export', () => {
    it('should integrate with project management tools', async () => {
      const user = userEvent.setup();
      
      // Mock API integration
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ project_id: '12345', status: 'created' })
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /export to project tool/i }));
      await user.selectOptions(screen.getByLabelText(/project tool/i), 'asana');
      await user.click(screen.getByRole('button', { name: /create project/i }));

      await waitFor(() => {
        expect(screen.getByText('Project created successfully')).toBeInTheDocument();
      });
    });

    it('should export strategy documents', async () => {
      const user = userEvent.setup();
      
      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /export strategy/i }));

      // Check export options
      expect(screen.getByText(/export as pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/export as powerpoint/i)).toBeInTheDocument();
      expect(screen.getByText(/export as word/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should support keyboard navigation for complex interfaces', async () => {
      await AITestUtils.Accessibility.testKeyboardNavigation(
        () => <AlexChangeStrategy element={mockElement} />
      );
    });

    it('should provide screen reader support for data visualizations', async () => {
      const user = userEvent.setup();
      
      render(<AlexChangeStrategy element={mockElement} />);

      // Generate strategy with charts
      await user.click(screen.getByRole('button', { name: /develop strategy/i }));

      await waitFor(() => {
        const chart = screen.getByRole('img', { name: /strategy timeline/i });
        expect(chart).toHaveAttribute('alt', expect.stringContaining('timeline'));
      });
    });

    it('should maintain responsive design across devices', async () => {
      // Test different viewport sizes
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      for (const viewport of viewports) {
        Object.defineProperty(window, 'innerWidth', { value: viewport.width });
        Object.defineProperty(window, 'innerHeight', { value: viewport.height });
        
        render(<AlexChangeStrategy element={mockElement} />);
        
        // Verify key elements are accessible
        expect(screen.getByRole('button', { name: /develop strategy/i })).toBeInTheDocument();
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle incomplete strategy inputs', async () => {
      const user = userEvent.setup();
      
      render(<AlexChangeStrategy element={mockElement} />);

      // Try to develop strategy without required inputs
      await user.click(screen.getByRole('button', { name: /develop strategy/i }));

      expect(screen.getByText(/initiative name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/timeline must be selected/i)).toBeInTheDocument();
    });

    it('should handle AI service timeouts gracefully', async () => {
      AITestUtils.mocks.aiService.generateResponse.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT + 1000))
      );

      const user = userEvent.setup();
      
      render(<AlexChangeStrategy element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /develop strategy/i }));

      await waitFor(() => {
        expect(screen.getByText(/strategy generation timed out/i)).toBeInTheDocument();
      }, { timeout: AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT + 2000 });
    });

    it('should handle large-scale change initiatives', async () => {
      const user = userEvent.setup();
      
      // Test with enterprise-scale parameters
      const enterpriseData = {
        employees: 10000,
        departments: 25,
        locations: 15,
        systems: 50
      };

      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        complexity_analysis: {
          scale: 'enterprise',
          recommended_approach: 'phased_rollout',
          estimated_duration: '18 months',
          risk_level: 'high'
        }
      });

      render(<AlexChangeStrategy element={mockElement} />);

      await user.type(screen.getByLabelText(/organization size/i), String(enterpriseData.employees));
      await user.click(screen.getByRole('button', { name: /analyze complexity/i }));

      await waitFor(() => {
        expect(screen.getByText('enterprise')).toBeInTheDocument();
        expect(screen.getByText('phased_rollout')).toBeInTheDocument();
      });
    });
  });
});