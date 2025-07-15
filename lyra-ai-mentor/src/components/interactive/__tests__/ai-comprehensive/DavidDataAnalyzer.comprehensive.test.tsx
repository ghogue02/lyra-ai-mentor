import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DavidDataStoryFinder } from '../../DavidDataStoryFinder';
import { AITestUtils, AITestData } from '../../../../test/ai-test-utils';
import { AI_TEST_CONFIG, AI_MOCK_RESPONSES, AI_ERROR_SCENARIOS } from '../../../../test/ai-component-test-config';
import { createTestElement, PerformanceTestUtils } from '../testUtils';

describe('DavidDataAnalyzer - Comprehensive Test Suite', () => {
  const mockElement = createTestElement({
    type: 'david_data_analyzer',
    title: 'Data Story Finder',
    content: 'Discover compelling stories hidden in your data',
    configuration: {
      data_sources: ['csv', 'database', 'api'],
      analysis_types: ['trend', 'correlation', 'anomaly'],
      visualization_types: ['chart', 'graph', 'heatmap'],
      ai_insights: true
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    AITestUtils.mocks.aiService.analyzeContent.mockReset();
    AITestUtils.mocks.analyticsService.track.mockReset();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Data Upload and Processing', () => {
    it('should handle CSV file upload', async () => {
      const user = userEvent.setup();
      const csvContent = 'date,value\n2023-01-01,100\n2023-01-02,150';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

      render(<DavidDataStoryFinder element={mockElement} />);

      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText('test.csv uploaded successfully')).toBeInTheDocument();
        expect(screen.getByText('2 rows detected')).toBeInTheDocument();
      });
    });

    it('should validate data format', async () => {
      const user = userEvent.setup();
      const invalidFile = new File(['invalid content'], 'test.txt', { type: 'text/plain' });

      render(<DavidDataStoryFinder element={mockElement} />);

      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, invalidFile);

      await waitFor(() => {
        expect(screen.getByText(/unsupported file format/i)).toBeInTheDocument();
      });
    });

    it('should process large datasets efficiently', async () => {
      const user = userEvent.setup();
      const largeDataset = Array.from({ length: 10000 }, (_, i) => 
        `${i},${Math.random() * 100}`
      ).join('\n');
      const file = new File([`id,value\n${largeDataset}`], 'large.csv', { type: 'text/csv' });

      const { memoryUsage } = await AITestUtils.Performance.testAIMemoryUsage({
        component: () => <DavidDataStoryFinder element={mockElement} />,
        operation: async () => {
          const fileInput = screen.getByLabelText(/upload.*data/i);
          await user.upload(fileInput, file);
          await waitFor(() => screen.getByText(/10000 rows/i));
        }
      });

      expect(memoryUsage).toBeLessThan(20971520); // 20MB for large dataset
    });
  });

  describe('AI-Powered Analysis', () => {
    it('should generate data insights', async () => {
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce(
        AI_MOCK_RESPONSES.DATA_ANALYZER
      );

      await AITestUtils.Patterns.testAIAnalytics({
        component: () => <DavidDataStoryFinder element={mockElement} />,
        data: AITestData.analyticsData,
        expectedInsights: AI_MOCK_RESPONSES.DATA_ANALYZER.insights
      });
    });

    it('should detect trends in time series data', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        trends: [
          { type: 'increasing', confidence: 0.95, period: 'last_30_days' },
          { type: 'seasonal', confidence: 0.82, period: 'weekly' }
        ],
        insights: ['Strong upward trend detected', 'Weekly cyclical pattern observed']
      });

      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload time series data
      const timeSeriesData = 'date,value\n2023-01-01,100\n2023-01-02,105\n2023-01-03,110';
      const file = new File([timeSeriesData], 'timeseries.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      // Trigger trend analysis
      await user.click(screen.getByRole('button', { name: /analyze trends/i }));

      await waitFor(() => {
        expect(screen.getByText('Strong upward trend detected')).toBeInTheDocument();
        expect(screen.getByText('Weekly cyclical pattern observed')).toBeInTheDocument();
      });
    });

    it('should identify anomalies in data', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        anomalies: [
          { index: 5, value: 1000, expected_range: [80, 120], severity: 'high' },
          { index: 12, value: 45, expected_range: [80, 120], severity: 'medium' }
        ],
        insights: ['Significant spike detected at position 5', 'Unusual dip at position 12']
      });

      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload data with anomalies
      const anomalyData = Array.from({ length: 20 }, (_, i) => {
        if (i === 5) return `${i},1000`; // Anomaly
        if (i === 12) return `${i},45`; // Anomaly
        return `${i},${100 + Math.random() * 20}`;
      }).join('\n');
      
      const file = new File([`index,value\n${anomalyData}`], 'anomaly.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      await user.click(screen.getByRole('button', { name: /detect anomalies/i }));

      await waitFor(() => {
        expect(screen.getByText('Significant spike detected at position 5')).toBeInTheDocument();
        expect(screen.getByText('Unusual dip at position 12')).toBeInTheDocument();
      });
    });
  });

  describe('Data Visualization', () => {
    it('should generate appropriate chart types', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        recommended_charts: [
          { type: 'line', reason: 'Time series data best shown as line chart' },
          { type: 'bar', reason: 'Categorical comparison suits bar chart' }
        ]
      });

      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload data
      const data = 'category,value\nA,100\nB,150\nC,120';
      const file = new File([data], 'categories.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      await user.click(screen.getByRole('button', { name: /suggest charts/i }));

      await waitFor(() => {
        expect(screen.getByText('line')).toBeInTheDocument();
        expect(screen.getByText('bar')).toBeInTheDocument();
      });
    });

    it('should render interactive charts', async () => {
      const user = userEvent.setup();
      
      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload data and create chart
      const data = 'x,y\n1,10\n2,20\n3,15';
      const file = new File([data], 'chart.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      await user.click(screen.getByRole('button', { name: /create chart/i }));

      await waitFor(() => {
        expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument();
      });

      // Test chart interactivity
      const chartContainer = screen.getByTestId('chart-container');
      fireEvent.mouseOver(chartContainer);
      
      expect(screen.getByText('Hover for details')).toBeInTheDocument();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle real-time data updates', async () => {
      const user = userEvent.setup();
      
      render(<DavidDataStoryFinder element={mockElement} />);

      // Simulate real-time data stream
      const performanceStart = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent(window, new CustomEvent('data-update', {
          detail: { timestamp: Date.now(), value: Math.random() * 100 }
        }));
        
        if (i % 10 === 0) {
          await waitFor(() => {}, { timeout: 10 });
        }
      }
      
      const performanceEnd = performance.now();
      const updateTime = performanceEnd - performanceStart;
      
      expect(updateTime).toBeLessThan(1000); // Should handle 100 updates in under 1 second
    });

    it('should efficiently process multiple analysis requests', async () => {
      const user = userEvent.setup();
      
      // Mock multiple analysis responses
      const analysisPromises = Array.from({ length: 5 }, (_, i) => 
        AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
          analysis_id: i,
          insights: [`Insight ${i}`]
        })
      );

      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload data
      const data = 'value\n100\n150\n120';
      const file = new File([data], 'test.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      // Trigger multiple analyses simultaneously
      const analysisButtons = screen.getAllByRole('button', { name: /analyze/i });
      await Promise.all(analysisButtons.slice(0, 5).map(button => user.click(button)));

      // Verify all analyses complete
      await waitFor(() => {
        for (let i = 0; i < 5; i++) {
          expect(screen.getByText(`Insight ${i}`)).toBeInTheDocument();
        }
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle corrupted data files', async () => {
      const user = userEvent.setup();
      const corruptedData = 'date,value\n2023-01-01,\n2023-01-02,not_a_number';
      const file = new File([corruptedData], 'corrupted.csv', { type: 'text/csv' });

      render(<DavidDataStoryFinder element={mockElement} />);

      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText(/data quality issues detected/i)).toBeInTheDocument();
        expect(screen.getByText(/2 invalid values found/i)).toBeInTheDocument();
      });
    });

    it('should handle empty datasets', async () => {
      const user = userEvent.setup();
      const emptyData = 'column1,column2\n';
      const file = new File([emptyData], 'empty.csv', { type: 'text/csv' });

      render(<DavidDataStoryFinder element={mockElement} />);

      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText(/no data rows found/i)).toBeInTheDocument();
      });
    });

    it('should handle analysis timeout', async () => {
      AITestUtils.mocks.aiService.analyzeContent.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT + 1000))
      );

      const user = userEvent.setup();
      
      render(<DavidDataStoryFinder element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /analyze/i }));

      await waitFor(() => {
        expect(screen.getByText(/analysis timed out/i)).toBeInTheDocument();
      }, { timeout: AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT + 2000 });
    });
  });

  describe('Data Export and Sharing', () => {
    it('should export analysis results', async () => {
      const user = userEvent.setup();
      
      // Mock successful analysis
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        insights: ['Key insight 1', 'Key insight 2'],
        charts: [{ type: 'line', data: [1, 2, 3] }]
      });

      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload data and analyze
      const data = 'value\n100\n150\n120';
      const file = new File([data], 'test.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);
      
      await user.click(screen.getByRole('button', { name: /analyze/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Key insight 1')).toBeInTheDocument();
      });

      // Export results
      await user.click(screen.getByRole('button', { name: /export/i }));

      // Verify export options
      expect(screen.getByText(/export as pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/export as excel/i)).toBeInTheDocument();
    });

    it('should generate shareable reports', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        report: {
          title: 'Data Analysis Report',
          summary: 'Executive summary of findings',
          sections: [
            { title: 'Overview', content: 'Data overview content' },
            { title: 'Key Findings', content: 'Important discoveries' }
          ]
        }
      });

      render(<DavidDataStoryFinder element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /generate report/i }));

      await waitFor(() => {
        expect(screen.getByText('Data Analysis Report')).toBeInTheDocument();
        expect(screen.getByText('Executive summary of findings')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Testing', () => {
    it('should integrate with database sources', async () => {
      await AITestUtils.Integration.testAIDatabaseIntegration({
        component: () => <DavidDataStoryFinder element={mockElement} />,
        mockData: AITestData.analyticsData,
        expectedQueries: ['analytics_data', 'user_events']
      });
    });

    it('should work with external API data sources', async () => {
      const user = userEvent.setup();
      
      // Mock API response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(AITestData.analyticsData)
      });

      render(<DavidDataStoryFinder element={mockElement} />);

      await user.type(screen.getByLabelText(/api url/i), 'https://api.example.com/data');
      await user.click(screen.getByRole('button', { name: /connect api/i }));

      await waitFor(() => {
        expect(screen.getByText(/api data loaded successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should provide keyboard navigation for charts', async () => {
      const user = userEvent.setup();
      
      render(<DavidDataStoryFinder element={mockElement} />);

      // Upload data and create chart
      const data = 'x,y\n1,10\n2,20';
      const file = new File([data], 'chart.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);
      await user.click(screen.getByRole('button', { name: /create chart/i }));

      await waitFor(() => {
        const chart = screen.getByRole('img', { name: /chart/i });
        expect(chart).toHaveAttribute('tabindex', '0');
      });
    });

    it('should provide alternative text for data visualizations', async () => {
      const user = userEvent.setup();
      
      render(<DavidDataStoryFinder element={mockElement} />);

      const data = 'category,value\nA,100\nB,150';
      const file = new File([data], 'data.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload.*data/i);
      await user.upload(fileInput, file);
      await user.click(screen.getByRole('button', { name: /create chart/i }));

      await waitFor(() => {
        const chart = screen.getByRole('img', { name: /chart/i });
        expect(chart).toHaveAttribute('alt', expect.stringContaining('Chart showing'));
      });
    });
  });
});