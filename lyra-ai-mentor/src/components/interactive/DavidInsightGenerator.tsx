import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  RefreshCw, 
  Copy, 
  Download,
  Brain,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

interface DataInsight {
  type: 'trend' | 'correlation' | 'outlier' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface InsightReport {
  id: string;
  title: string;
  dataDescription: string;
  insights: DataInsight[];
  keyFindings: string[];
  recommendations: string[];
  timestamp: Date;
}

const DavidInsightGenerator: React.FC = () => {
  const [dataDescription, setDataDescription] = useState('');
  const [contextInfo, setContextInfo] = useState('');
  const [goals, setGoals] = useState('');
  const [generatedReport, setGeneratedReport] = useState<InsightReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedReports, setSavedReports] = useState<InsightReport[]>([]);

  const exampleDatasets = [
    {
      title: 'Nonprofit Program Performance',
      description: 'Monthly program participation rates, completion rates, and satisfaction scores across 5 different programs over the past year',
      context: 'Community outreach nonprofit looking to optimize program offerings',
      goals: 'Identify which programs are most effective and understand factors driving success'
    },
    {
      title: 'Fundraising Campaign Results',
      description: 'Donation amounts, donor demographics, campaign channels, and timing data from last 3 years of fundraising efforts',
      context: 'Educational nonprofit planning next year\'s fundraising strategy',
      goals: 'Maximize donation revenue and identify the most valuable donor segments'
    },
    {
      title: 'Volunteer Engagement Metrics',
      description: 'Volunteer hours, retention rates, satisfaction surveys, and project outcomes across different volunteer roles',
      context: 'Large nonprofit struggling with volunteer retention',
      goals: 'Improve volunteer satisfaction and increase long-term commitment'
    }
  ];

  const generateInsights = async () => {
    if (!dataDescription.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI insight generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock insights based on input
    const insights: DataInsight[] = [
      {
        type: 'trend',
        title: 'Consistent Growth Pattern',
        description: 'Data shows a steady 15% month-over-month increase in key metrics over the past 6 months',
        confidence: 92,
        impact: 'high',
        actionable: true
      },
      {
        type: 'correlation',
        title: 'Strong Engagement-Outcome Relationship',
        description: 'Participants with higher initial engagement scores are 3x more likely to complete programs successfully',
        confidence: 87,
        impact: 'high',
        actionable: true
      },
      {
        type: 'outlier',
        title: 'Exceptional Performance Period',
        description: 'March showed unusually high performance (40% above average) - likely due to spring outreach campaign',
        confidence: 78,
        impact: 'medium',
        actionable: true
      },
      {
        type: 'pattern',
        title: 'Seasonal Variation Detected',
        description: 'Clear seasonal patterns with 25% higher participation in fall months compared to summer',
        confidence: 84,
        impact: 'medium',
        actionable: true
      },
      {
        type: 'recommendation',
        title: 'Optimization Opportunity',
        description: 'Reallocating 20% of resources from lowest-performing to highest-performing initiatives could increase overall impact by 30%',
        confidence: 81,
        impact: 'high',
        actionable: true
      }
    ];

    const keyFindings = [
      'Programs with initial engagement activities show 65% higher completion rates',
      'Fall season generates consistently strong participation across all age groups',
      'Satisfaction scores strongly correlate with long-term participant retention',
      'Digital outreach channels outperform traditional methods by 40%'
    ];

    const recommendations = [
      'Implement engagement pre-screening for all new program participants',
      'Focus major campaign launches in September-November for maximum impact',
      'Develop retention-focused check-ins at 30-day intervals',
      'Increase digital marketing budget by 35% while reducing print advertising',
      'Create cross-program referral system to leverage high-performing initiatives'
    ];

    const report: InsightReport = {
      id: Date.now().toString(),
      title: `Insight Report ${savedReports.length + 1}`,
      dataDescription,
      insights,
      keyFindings,
      recommendations,
      timestamp: new Date()
    };

    setGeneratedReport(report);
    setIsGenerating(false);
  };

  const saveReport = () => {
    if (generatedReport) {
      setSavedReports(prev => [generatedReport, ...prev.slice(0, 4)]);
    }
  };

  const loadExample = (example: typeof exampleDatasets[0]) => {
    setDataDescription(example.description);
    setContextInfo(example.context);
    setGoals(example.goals);
    setGeneratedReport(null);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'correlation': return BarChart3;
      case 'outlier': return Target;
      case 'pattern': return Brain;
      case 'recommendation': return Lightbulb;
      default: return Zap;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportReport = () => {
    if (!generatedReport) return;
    
    const reportText = `
INSIGHT REPORT: ${generatedReport.title}
Generated: ${generatedReport.timestamp.toLocaleString()}

DATA ANALYZED:
${generatedReport.dataDescription}

KEY INSIGHTS:
${generatedReport.insights.map((insight, i) => 
  `${i + 1}. ${insight.title} (${insight.confidence}% confidence)
   ${insight.description}`
).join('\n\n')}

KEY FINDINGS:
${generatedReport.keyFindings.map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

RECOMMENDATIONS:
${generatedReport.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(reportText.trim());
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Insight Generator</CardTitle>
              <CardDescription>
                Transform data into actionable insights and strategic recommendations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Context</CardTitle>
                  <CardDescription>Describe your data for AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Example Datasets */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Try example datasets:</label>
                    <div className="space-y-2">
                      {exampleDatasets.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => loadExample(example)}
                        >
                          <div>
                            <div className="font-medium">{example.title}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {example.description.substring(0, 80)}...
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Data Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Description:</label>
                    <Textarea
                      placeholder="Describe your data: what it contains, time period, key variables, etc."
                      value={dataDescription}
                      onChange={(e) => setDataDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Context */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Context & Background:</label>
                    <Textarea
                      placeholder="What's the situation? Who is this for? What challenges are you facing?"
                      value={contextInfo}
                      onChange={(e) => setContextInfo(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Goals */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Analysis Goals:</label>
                    <Textarea
                      placeholder="What do you want to learn? What decisions need to be made?"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateInsights}
                disabled={!dataDescription.trim() || isGenerating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {generatedReport ? (
                <div className="space-y-4">
                  {/* Report Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Insight Report</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={saveReport}>
                            <Download className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={exportReport}>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Generated {generatedReport.timestamp.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Key Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {generatedReport.insights.map((insight, index) => {
                        const Icon = getInsightIcon(insight.type);
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold">{insight.title}</h4>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getImpactColor(insight.impact)}>
                                  {insight.impact} impact
                                </Badge>
                                <Badge variant="outline">
                                  <span className={getConfidenceColor(insight.confidence)}>
                                    {insight.confidence}%
                                  </span>
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="capitalize text-xs">
                                {insight.type}
                              </Badge>
                              {insight.actionable && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  Actionable
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Key Findings */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedReport.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800">Strategic Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {generatedReport.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-center">
                      Describe your data to get<br />
                      AI-powered insights and recommendations
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Saved Reports */}
          {savedReports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Reports</CardTitle>
                <CardDescription>Your insight analysis history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedReports.map((report) => (
                    <Card key={report.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{report.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {report.insights.length} insights
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {report.dataDescription.substring(0, 60)}...
                        </p>
                        <div className="text-xs text-gray-500">
                          {report.timestamp.toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Tips */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800">David's Analysis Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div>
                  <h4 className="font-semibold mb-2">For Better Insights:</h4>
                  <ul className="space-y-1">
                    <li>• Include data timeframes and sample sizes</li>
                    <li>• Describe what each metric represents</li>
                    <li>• Mention any known external factors</li>
                    <li>• Be specific about your goals</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Making Data Actionable:</h4>
                  <ul className="space-y-1">
                    <li>• Focus on insights you can act upon</li>
                    <li>• Consider implementation feasibility</li>
                    <li>• Look for patterns across multiple metrics</li>
                    <li>• Validate insights with stakeholders</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidInsightGenerator;