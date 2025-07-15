import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DataAnalyzerProps {
  onComplete?: () => void;
}

interface AnalysisResult {
  summary: string;
  keyFindings: Finding[];
  trends: Trend[];
  recommendations: string[];
  visualizationSuggestions: string[];
}

interface Finding {
  metric: string;
  value: string;
  insight: string;
  significance: 'high' | 'medium' | 'low';
}

interface Trend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  period: string;
}

export const DataAnalyzer: React.FC<DataAnalyzerProps> = ({ onComplete }) => {
  const [dataType, setDataType] = useState<string>('');
  const [rawData, setRawData] = useState('');
  const [analysisGoal, setAnalysisGoal] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dataTypes = [
    { value: 'donor_data', label: 'Donor Data', description: 'Giving history and patterns' },
    { value: 'program_metrics', label: 'Program Metrics', description: 'Service delivery stats' },
    { value: 'volunteer_data', label: 'Volunteer Data', description: 'Hours and engagement' },
    { value: 'financial_data', label: 'Financial Data', description: 'Revenue and expenses' },
    { value: 'engagement_data', label: 'Engagement Data', description: 'Email, social, website' },
    { value: 'survey_responses', label: 'Survey Responses', description: 'Feedback and satisfaction' }
  ];

  const analysisGoals = [
    { value: 'identify_trends', label: 'Identify Trends', description: 'Find patterns over time' },
    { value: 'find_opportunities', label: 'Find Opportunities', description: 'Discover growth areas' },
    { value: 'measure_impact', label: 'Measure Impact', description: 'Quantify outcomes' },
    { value: 'optimize_performance', label: 'Optimize Performance', description: 'Improve efficiency' },
    { value: 'predict_future', label: 'Predict Future', description: 'Forecast trends' }
  ];

  const analyzeData = async () => {
    if (!dataType || !rawData.trim() || !analysisGoal) {
      toast.error('Please complete all fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = performAnalysis();
      setAnalysis(result);
      
      toast.success('Data analysis complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to analyze data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performAnalysis = (): AnalysisResult => {
    // Simulate different analysis results based on data type
    const analysisTemplates: Record<string, () => AnalysisResult> = {
      donor_data: () => ({
        summary: 'Donor analysis reveals strong retention rates with opportunities for major gift cultivation. Monthly giving has increased 23% year-over-year, while average gift size shows positive trends.',
        keyFindings: [
          {
            metric: 'Donor Retention Rate',
            value: '68%',
            insight: 'Above nonprofit average of 45%, indicating strong donor satisfaction',
            significance: 'high'
          },
          {
            metric: 'Average Gift Size',
            value: '$247',
            insight: 'Increased from $198 last year, showing deeper engagement',
            significance: 'high'
          },
          {
            metric: 'Monthly Donors',
            value: '142',
            insight: '23% growth in recurring giving program',
            significance: 'medium'
          },
          {
            metric: 'Lapsed Donors',
            value: '312',
            insight: 'Opportunity for win-back campaign',
            significance: 'medium'
          }
        ],
        trends: [
          { metric: 'Total Donations', direction: 'up', percentage: 18, period: 'Year-over-Year' },
          { metric: 'New Donors', direction: 'up', percentage: 12, period: 'Quarter-over-Quarter' },
          { metric: 'Major Gifts', direction: 'stable', percentage: 2, period: 'Year-over-Year' },
          { metric: 'Online Giving', direction: 'up', percentage: 34, period: 'Year-over-Year' }
        ],
        recommendations: [
          'Launch a major donor identification campaign targeting donors who have given $1,000+ cumulatively',
          'Implement a lapsed donor win-back campaign with personalized messaging',
          'Expand monthly giving program with targeted upgrade asks to one-time donors',
          'Create donor appreciation events to maintain high retention rate',
          'Develop planned giving materials for loyal long-term donors'
        ],
        visualizationSuggestions: [
          'Line chart showing donation trends over 24 months',
          'Pie chart of donor segments by giving level',
          'Bar chart comparing retention rates by donor segment',
          'Heat map of giving patterns by month and year'
        ]
      }),
      
      program_metrics: () => ({
        summary: 'Program data shows significant impact with 3,847 individuals served this quarter, a 22% increase from last year. Youth programs show the highest growth while maintaining quality metrics.',
        keyFindings: [
          {
            metric: 'Individuals Served',
            value: '3,847',
            insight: '22% increase from same quarter last year',
            significance: 'high'
          },
          {
            metric: 'Program Completion Rate',
            value: '84%',
            insight: 'Strong engagement, above 75% target',
            significance: 'high'
          },
          {
            metric: 'Cost Per Participant',
            value: '$312',
            insight: 'Decreased from $385, showing improved efficiency',
            significance: 'medium'
          },
          {
            metric: 'Satisfaction Score',
            value: '4.6/5.0',
            insight: 'Consistent high quality across programs',
            significance: 'medium'
          }
        ],
        trends: [
          { metric: 'Youth Program Enrollment', direction: 'up', percentage: 34, period: 'Year-over-Year' },
          { metric: 'Adult Education Participation', direction: 'up', percentage: 18, period: 'Year-over-Year' },
          { metric: 'Emergency Services Usage', direction: 'down', percentage: -12, period: 'Quarter-over-Quarter' },
          { metric: 'Job Placement Rate', direction: 'up', percentage: 8, period: 'Year-over-Year' }
        ],
        recommendations: [
          'Scale youth programs to meet growing demand - consider additional sessions',
          'Document and replicate efficiency improvements across all programs',
          'Develop outcome tracking for long-term impact measurement',
          'Create participant success stories for fundraising and awareness',
          'Explore partnerships to expand program capacity'
        ],
        visualizationSuggestions: [
          'Dashboard showing key program metrics with traffic light indicators',
          'Stacked bar chart of participants by program over time',
          'Funnel chart showing program journey from enrollment to completion',
          'Geographic map of service areas with participant density'
        ]
      }),
      
      volunteer_data: () => ({
        summary: 'Volunteer engagement remains strong with 423 active volunteers contributing 8,234 hours this quarter. New volunteer onboarding has improved, but retention after 6 months needs attention.',
        keyFindings: [
          {
            metric: 'Active Volunteers',
            value: '423',
            insight: '15% growth in volunteer base',
            significance: 'high'
          },
          {
            metric: 'Total Hours',
            value: '8,234',
            insight: 'Equivalent to 4.1 full-time staff',
            significance: 'high'
          },
          {
            metric: '6-Month Retention',
            value: '52%',
            insight: 'Below target of 70%, needs improvement',
            significance: 'low'
          },
          {
            metric: 'Skills-Based Volunteers',
            value: '67',
            insight: '45% increase in professional volunteers',
            significance: 'medium'
          }
        ],
        trends: [
          { metric: 'New Volunteer Sign-ups', direction: 'up', percentage: 28, period: 'Quarter-over-Quarter' },
          { metric: 'Average Hours/Volunteer', direction: 'stable', percentage: 3, period: 'Year-over-Year' },
          { metric: 'No-show Rate', direction: 'down', percentage: -15, period: 'Quarter-over-Quarter' },
          { metric: 'Corporate Volunteers', direction: 'up', percentage: 52, period: 'Year-over-Year' }
        ],
        recommendations: [
          'Implement 3-month and 6-month check-ins to improve retention',
          'Create volunteer recognition program with milestone awards',
          'Develop skills-based volunteer opportunities for professionals',
          'Launch volunteer buddy system for new recruits',
          'Build corporate volunteer partnerships for team events'
        ],
        visualizationSuggestions: [
          'Volunteer lifecycle chart from onboarding to long-term engagement',
          'Hour contribution by volunteer segment',
          'Retention curve showing drop-off points',
          'Skills inventory visualization'
        ]
      })
    };

    // Get template or use default
    const template = analysisTemplates[dataType] || analysisTemplates.donor_data;
    return template();
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Data Analyzer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform your raw data into actionable insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Type</label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="What kind of data?" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Analysis Goal</label>
              <Select value={analysisGoal} onValueChange={setAnalysisGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="What do you want to learn?" />
                </SelectTrigger>
                <SelectContent>
                  {analysisGoals.map((goal) => (
                    <SelectItem key={goal.value} value={goal.value}>
                      <div>
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-xs text-gray-500">{goal.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data Input</label>
            <Textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Paste your data here (CSV, numbers, or describe your data set). For example: 'Q1: 1,245 donors, $156,000 raised. Q2: 1,389 donors, $178,000 raised' or paste a spreadsheet excerpt..."
              rows={6}
              className="resize-none font-mono text-sm"
            />
          </div>

          <Button 
            onClick={analyzeData} 
            disabled={isAnalyzing || !dataType || !rawData.trim() || !analysisGoal}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Your Data...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.keyFindings.map((finding, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{finding.metric}</h4>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{finding.value}</p>
                      </div>
                      <Badge className={getSignificanceColor(finding.significance)}>
                        {finding.significance} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{finding.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(trend.direction)}
                      <div>
                        <p className="font-medium">{trend.metric}</p>
                        <p className="text-sm text-gray-600">{trend.period}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${
                      trend.direction === 'up' ? 'text-green-600' : 
                      trend.direction === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visualization Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Create these visualizations to better communicate your findings:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.visualizationSuggestions.map((viz, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">{viz}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};