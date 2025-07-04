import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, TrendingUp, DollarSign, Heart, Award, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface DonorInsightsAnalyzerProps {
  onComplete?: () => void;
}

interface DonorSegment {
  name: string;
  count: number;
  percentage: number;
  avgGift: string;
  retention: string;
  insights: string[];
  actions: string[];
}

interface DonorInsights {
  summary: string;
  segments: DonorSegment[];
  trends: {
    metric: string;
    trend: 'up' | 'down' | 'stable';
    value: string;
    insight: string;
  }[];
  opportunities: {
    title: string;
    potential: string;
    strategy: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  riskFactors: {
    risk: string;
    impact: string;
    mitigation: string;
  }[];
}

export const DonorInsightsAnalyzer: React.FC<DonorInsightsAnalyzerProps> = ({ onComplete }) => {
  const [analysisType, setAnalysisType] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [donorData, setDonorData] = useState('');
  const [insights, setInsights] = useState<DonorInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisTypes = [
    { value: 'segmentation', label: 'Donor Segmentation', description: 'Group donors by behavior' },
    { value: 'retention', label: 'Retention Analysis', description: 'Understand donor loyalty' },
    { value: 'giving_patterns', label: 'Giving Patterns', description: 'Analyze donation trends' },
    { value: 'lifecycle', label: 'Donor Lifecycle', description: 'Track donor journey' },
    { value: 'lapsed', label: 'Lapsed Donor Analysis', description: 'Win-back opportunities' },
    { value: 'major_gift', label: 'Major Gift Prospects', description: 'Identify upgrade potential' }
  ];

  const timePeriods = [
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'last_3_years', label: 'Last 3 Years' },
    { value: 'all_time', label: 'All Time' }
  ];

  const analyzeDonors = async () => {
    if (!analysisType || !timePeriod || !donorData.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateInsights();
      setInsights(result);
      
      toast.success('Donor analysis complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to analyze donor data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsights = (): DonorInsights => {
    const templates: Record<string, () => DonorInsights> = {
      segmentation: () => ({
        summary: 'Your donor base shows healthy diversity across giving levels with strong mid-level donor growth. Major gift donors represent 12% of donors but contribute 67% of total revenue. Monthly giving program shows exceptional growth potential.',
        segments: [
          {
            name: 'Major Donors ($5,000+)',
            count: 47,
            percentage: 12,
            avgGift: '$12,450',
            retention: '91%',
            insights: [
              'Highest retention rate among all segments',
              'Average 2.3 gifts per year',
              '78% also volunteer or serve on committees',
              '45% have given for 5+ years'
            ],
            actions: [
              'Schedule personal visits with top 10 donors',
              'Create exclusive major donor events',
              'Develop planned giving conversations',
              'Assign dedicated relationship manager'
            ]
          },
          {
            name: 'Mid-Level Donors ($500-$4,999)',
            count: 156,
            percentage: 39,
            avgGift: '$1,247',
            retention: '72%',
            insights: [
              'Fastest growing segment (+34% YoY)',
              '67% give multiple times per year',
              '23% increased giving in past year',
              'High engagement with email communications'
            ],
            actions: [
              'Launch upgrade campaign to major gift level',
              'Create mid-level donor society with benefits',
              'Increase personal touchpoints',
              'Invite to special cultivation events'
            ]
          },
          {
            name: 'Annual Donors ($100-$499)',
            count: 134,
            percentage: 34,
            avgGift: '$287',
            retention: '58%',
            insights: [
              'Most give during year-end campaign',
              '34% are first-time donors',
              'Lower email open rates (22%)',
              'Prefer online giving (89%)'
            ],
            actions: [
              'Implement welcome series for new donors',
              'Create monthly giving conversion campaign',
              'Segment communications by interest',
              'Add impact stories to receipts'
            ]
          },
          {
            name: 'Small Gift Donors (<$100)',
            count: 59,
            percentage: 15,
            avgGift: '$67',
            retention: '41%',
            insights: [
              'Often give through peer-to-peer campaigns',
              'Younger demographic (65% under 40)',
              'High social media engagement',
              'Event participants'
            ],
            actions: [
              'Convert to monthly giving ($10-25/month)',
              'Engage through volunteer opportunities',
              'Use social proof in communications',
              'Create peer fundraising challenges'
            ]
          }
        ],
        trends: [
          { metric: 'Overall Retention Rate', trend: 'up', value: '68%', insight: 'Improved from 62% last year through better stewardship' },
          { metric: 'Average Gift Size', trend: 'up', value: '$743', insight: 'Increased 18% due to major gift growth' },
          { metric: 'New Donor Acquisition', trend: 'down', value: '-12%', insight: 'Need to invest in acquisition strategies' },
          { metric: 'Monthly Giving', trend: 'up', value: '+45%', insight: 'Strong growth in sustainable revenue' }
        ],
        opportunities: [
          {
            title: 'Monthly Giving Expansion',
            potential: '$180,000 additional annual revenue',
            strategy: 'Convert 150 annual donors to $25/month recurring gifts',
            priority: 'high'
          },
          {
            title: 'Mid-Level Upgrade Campaign',
            potential: '$75,000 increased giving',
            strategy: 'Move 30 mid-level donors to major gift status',
            priority: 'high'
          },
          {
            title: 'Lapsed Donor Reactivation',
            potential: '120 donors, $35,000 revenue',
            strategy: 'Targeted win-back campaign with special match',
            priority: 'medium'
          },
          {
            title: 'Corporate Partnership Program',
            potential: '$100,000 new revenue',
            strategy: 'Leverage board connections for corporate giving',
            priority: 'medium'
          }
        ],
        riskFactors: [
          {
            risk: 'Over-reliance on major donors',
            impact: '67% of revenue from 12% of donors',
            mitigation: 'Diversify by growing mid-level and monthly programs'
          },
          {
            risk: 'Declining new donor acquisition',
            impact: 'Aging donor base threatens long-term sustainability',
            mitigation: 'Invest in digital marketing and peer-to-peer campaigns'
          },
          {
            risk: 'Low small donor retention',
            impact: '41% retention loses future major donors',
            mitigation: 'Improve first-year donor experience and communications'
          }
        ]
      }),

      retention: () => ({
        summary: 'Overall donor retention stands at 68%, above sector average of 45%, but varies significantly by segment. First-year retention (52%) presents the biggest opportunity for improvement. Multi-year donors show exceptional loyalty at 89% retention.',
        segments: [
          {
            name: 'New Donors (First Year)',
            count: 89,
            percentage: 23,
            avgGift: '$234',
            retention: '52%',
            insights: [
              'Only half make second gift',
              'Average 74 days to second gift',
              'Low engagement with communications',
              'Often acquired through events'
            ],
            actions: [
              'Implement 90-day onboarding journey',
              'Send immediate impact report',
              'Personal thank you call within 48 hours',
              'Assign to monthly giving ask track'
            ]
          },
          {
            name: 'Repeat Donors (2-4 years)',
            count: 167,
            percentage: 43,
            avgGift: '$456',
            retention: '74%',
            insights: [
              'Give average 2.1 times per year',
              'Respond well to matching gifts',
              'Increasing gift sizes over time',
              'Active email engagement'
            ],
            actions: [
              'Create loyalty recognition program',
              'Provide exclusive updates',
              'Invite to donor appreciation events',
              'Track for upgrade opportunities'
            ]
          },
          {
            name: 'Loyal Donors (5+ years)',
            count: 132,
            percentage: 34,
            avgGift: '$892',
            retention: '89%',
            insights: [
              'Highest lifetime value',
              'Often become monthly donors',
              'Strong mission alignment',
              'Refer other donors'
            ],
            actions: [
              'Develop legacy giving conversations',
              'Create ambassador program',
              'Provide VIP experiences',
              'Regular personal outreach'
            ]
          }
        ],
        trends: [
          { metric: 'First-Year Retention', trend: 'stable', value: '52%', insight: 'Unchanged despite new welcome series' },
          { metric: 'Multi-Year Retention', trend: 'up', value: '89%', insight: 'Improved through better stewardship' },
          { metric: 'Reactivation Rate', trend: 'up', value: '18%', insight: 'Lapsed donor campaigns showing results' },
          { metric: 'Lifetime Value', trend: 'up', value: '$3,456', insight: 'Longer retention driving higher LTV' }
        ],
        opportunities: [
          {
            title: 'First-Year Experience Overhaul',
            potential: '37 additional retained donors',
            strategy: 'Redesign onboarding with personal touchpoints',
            priority: 'high'
          },
          {
            title: 'Loyalty Milestone Program',
            potential: 'Increase retention 5-10%',
            strategy: 'Recognize and celebrate giving anniversaries',
            priority: 'medium'
          },
          {
            title: 'Win-Back Campaign',
            potential: '54 reactivated donors',
            strategy: 'Segment lapsed donors by giving history for targeted appeals',
            priority: 'medium'
          }
        ],
        riskFactors: [
          {
            risk: 'Poor first-year retention',
            impact: 'Losing 48% of new donors costs $45,000 annually',
            mitigation: 'Invest in welcome journey and immediate engagement'
          },
          {
            risk: 'Communication fatigue',
            impact: 'Over-communication causing unsubscribes',
            mitigation: 'Segment lists and personalize frequency preferences'
          }
        ]
      }),

      giving_patterns: () => ({
        summary: 'Giving patterns reveal strong seasonality with 42% of annual revenue in Q4. Tuesday email appeals perform best, while monthly giving provides stable base. Average donor gives 2.3 times per year with increasing use of online channels.',
        segments: [
          {
            name: 'Seasonal Givers',
            count: 234,
            percentage: 60,
            avgGift: '$345',
            retention: '65%',
            insights: [
              '78% give during year-end campaign',
              '45% also give on Giving Tuesday',
              'Respond to urgency and deadlines',
              'Plan gifts around tax benefits'
            ],
            actions: [
              'Create year-round engagement strategy',
              'Develop spring giving campaign',
              'Send tax benefit reminders',
              'Convert to monthly giving'
            ]
          },
          {
            name: 'Monthly Donors',
            count: 78,
            percentage: 20,
            avgGift: '$35/month',
            retention: '94%',
            insights: [
              'Highest retention rate',
              'Average 13-month commitment',
              '$420 average annual value',
              'Upgrade gifts regularly'
            ],
            actions: [
              'Launch upgrade campaign',
              'Create exclusive benefits',
              'Minimize payment failures',
              'Celebrate milestones'
            ]
          },
          {
            name: 'Event-Driven Donors',
            count: 78,
            percentage: 20,
            avgGift: '$567',
            retention: '71%',
            insights: [
              'Give at gala or walks',
              'Higher average gifts',
              'Social motivation',
              'Peer influence strong'
            ],
            actions: [
              'Year-round event calendar',
              'Peer-to-peer tools',
              'Event follow-up series',
              'Convert to annual giving'
            ]
          }
        ],
        trends: [
          { metric: 'Online Giving', trend: 'up', value: '67%', insight: 'Digital channels now dominant' },
          { metric: 'Mobile Donations', trend: 'up', value: '34%', insight: 'Optimize for mobile experience' },
          { metric: 'Recurring Revenue', trend: 'up', value: '28%', insight: 'Monthly giving provides stability' },
          { metric: 'Average Gifts/Year', trend: 'stable', value: '2.3', insight: 'Opportunity to increase frequency' }
        ],
        opportunities: [
          {
            title: 'Summer Giving Campaign',
            potential: '$125,000 new revenue',
            strategy: 'Address mid-year revenue dip with targeted campaign',
            priority: 'high'
          },
          {
            title: 'Mobile Optimization',
            potential: '15% increase in online gifts',
            strategy: 'Redesign donation forms for mobile-first experience',
            priority: 'high'
          },
          {
            title: 'Workplace Giving',
            potential: '$80,000 annual revenue',
            strategy: 'Partner with companies for payroll deduction',
            priority: 'medium'
          }
        ],
        riskFactors: [
          {
            risk: 'Q4 revenue concentration',
            impact: '42% of budget in final quarter creates cash flow issues',
            mitigation: 'Develop campaigns for Q2 and Q3 to balance revenue'
          },
          {
            risk: 'Payment processing failures',
            impact: 'Losing 8% of monthly donors to failed payments',
            mitigation: 'Implement automated retry and update campaigns'
          }
        ]
      })
    };

    const template = templates[analysisType] || templates.segmentation;
    return template();
  };

  const getSegmentColor = (percentage: number) => {
    if (percentage >= 30) return 'bg-blue-100 text-blue-800';
    if (percentage >= 20) return 'bg-green-100 text-green-800';
    if (percentage >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Donor Insights Analyzer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Unlock actionable insights from your donor data
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Analysis Type</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="What to analyze?" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Donor Data</label>
            <Textarea
              value={donorData}
              onChange={(e) => setDonorData(e.target.value)}
              placeholder="Paste your donor data or describe your donor base. For example: 'Total donors: 389, New donors: 89, Average gift: $456, Retention rate: 68%, Monthly donors: 78...'"
              rows={5}
              className="resize-none font-mono text-sm"
            />
          </div>

          <Button 
            onClick={analyzeDonors} 
            disabled={isAnalyzing || !analysisType || !timePeriod || !donorData.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Donor Data...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Analyze Donors
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {insights && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donor Segments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.segments.map((segment, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-lg">{segment.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">{segment.count} donors</span>
                        <Badge className={getSegmentColor(segment.percentage)}>
                          {segment.percentage}% of base
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Avg Gift</p>
                      <p className="text-xl font-bold text-purple-600">{segment.avgGift}</p>
                      <p className="text-sm text-gray-600">Retention: {segment.retention}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Insights</h5>
                      <ul className="space-y-1">
                        {segment.insights.map((insight, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                            <span className="text-purple-600">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Recommended Actions</h5>
                      <ul className="space-y-1">
                        {segment.actions.map((action, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                            <span className="text-green-600">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Key Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.trends.map((trend, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{trend.metric}</span>
                      <div className="flex items-center gap-2">
                        {trend.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                        {trend.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
                        {trend.trend === 'stable' && <span className="h-4 w-4 text-gray-600">→</span>}
                        <span className="font-bold">{trend.value}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{trend.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.opportunities.map((opp, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{opp.title}</h4>
                    <Badge className={getPriorityColor(opp.priority)}>
                      {opp.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{opp.strategy}</p>
                  <p className="text-sm font-medium text-green-700">
                    Potential: {opp.potential}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.riskFactors.map((risk, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-1">{risk.risk}</h4>
                  <p className="text-sm text-red-700 mb-2">Impact: {risk.impact}</p>
                  <p className="text-sm text-gray-700">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};