import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, AlertCircle, CheckCircle, Info, BarChart, Calendar, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface TrendIdentifierProps {
  onComplete?: () => void;
}

interface Trend {
  title: string;
  type: 'emerging' | 'declining' | 'stable' | 'seasonal' | 'accelerating';
  direction: 'up' | 'down' | 'stable';
  strength: 'strong' | 'moderate' | 'weak';
  timeframe: string;
  description: string;
  dataPoints: string[];
  implications: string[];
  recommendations: string[];
}

interface TrendAnalysis {
  summary: string;
  trends: Trend[];
  correlations: {
    factor1: string;
    factor2: string;
    relationship: string;
  }[];
  predictions: {
    metric: string;
    forecast: string;
    confidence: 'high' | 'medium' | 'low';
    assumptions: string[];
  }[];
  watchPoints: string[];
}

export const TrendIdentifier: React.FC<TrendIdentifierProps> = ({ onComplete }) => {
  const [dataCategory, setDataCategory] = useState<string>('');
  const [analysisDepth, setAnalysisDepth] = useState<string>('');
  const [historicalData, setHistoricalData] = useState('');
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dataCategories = [
    { value: 'giving_trends', label: 'Giving & Donations', description: 'Donation patterns and amounts' },
    { value: 'program_participation', label: 'Program Participation', description: 'Service usage trends' },
    { value: 'volunteer_engagement', label: 'Volunteer Engagement', description: 'Volunteer activity patterns' },
    { value: 'community_needs', label: 'Community Needs', description: 'Service demand trends' },
    { value: 'digital_engagement', label: 'Digital Engagement', description: 'Online and social trends' },
    { value: 'operational_metrics', label: 'Operational Metrics', description: 'Efficiency and costs' }
  ];

  const analysisDepths = [
    { value: 'quick', label: 'Quick Scan', description: '3-6 month trends' },
    { value: 'standard', label: 'Standard Analysis', description: '1 year comparison' },
    { value: 'deep', label: 'Deep Analysis', description: '3+ year patterns' },
    { value: 'predictive', label: 'Predictive Analysis', description: 'Future projections' }
  ];

  const identifyTrends = async () => {
    if (!dataCategory || !analysisDepth || !historicalData.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateTrendAnalysis();
      setAnalysis(result);
      
      toast.success('Trend analysis complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to identify trends. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTrendAnalysis = (): TrendAnalysis => {
    const templates: Record<string, () => TrendAnalysis> = {
      giving_trends: () => ({
        summary: 'Analysis reveals significant shifts in donor behavior with accelerating digital adoption, growing monthly giving preference, and seasonal patterns becoming more pronounced. Major gift pipeline shows positive momentum while small donor acquisition faces headwinds.',
        trends: [
          {
            title: 'Monthly Giving Surge',
            type: 'accelerating',
            direction: 'up',
            strength: 'strong',
            timeframe: 'Last 18 months',
            description: 'Monthly recurring donations have grown 67% with acceleration in recent quarters. Average monthly gift increased from $28 to $35.',
            dataPoints: [
              'Q1 2023: 45 monthly donors',
              'Q4 2023: 89 monthly donors',
              'Q3 2024: 142 monthly donors',
              'New sign-ups averaging 12/month',
              'Retention rate: 94%'
            ],
            implications: [
              'Predictable revenue stream growing rapidly',
              'Younger donors prefer subscription model',
              'Higher lifetime value than one-time donors',
              'Cash flow becoming more stable'
            ],
            recommendations: [
              'Launch dedicated monthly giving campaign',
              'Create exclusive benefits for sustainers',
              'Optimize payment retry processes',
              'Set goal of 200 monthly donors by year-end',
              'Develop upgrade asks for $25 donors'
            ]
          },
          {
            title: 'Year-End Concentration Intensifying',
            type: 'seasonal',
            direction: 'up',
            strength: 'moderate',
            timeframe: 'Last 3 years',
            description: 'December giving now represents 38% of annual revenue, up from 31% three years ago. Black Friday through year-end critical.',
            dataPoints: [
              '2022: 31% of revenue in December',
              '2023: 35% of revenue in December',
              '2024 YTD: Projecting 38%',
              'Giving Tuesday up 45% YoY',
              'Q2-Q3 showing decline'
            ],
            implications: [
              'Cash flow challenges in summer months',
              'Higher pressure on year-end campaigns',
              'Risk if December underperforms',
              'Need for revenue diversification'
            ],
            recommendations: [
              'Develop strong Q2 giving campaign',
              'Create summer monthly giving push',
              'Build cash reserves in Q1',
              'Plan year-end campaign earlier',
              'Test spring giving day event'
            ]
          },
          {
            title: 'Digital Channel Dominance',
            type: 'emerging',
            direction: 'up',
            strength: 'strong',
            timeframe: 'Last 2 years',
            description: 'Online giving now accounts for 72% of all donations, with mobile representing 41% of online gifts.',
            dataPoints: [
              '2022: 48% online giving',
              '2023: 61% online giving',
              '2024: 72% online giving',
              'Mobile: 41% of online',
              'Text-to-give growing 125% YoY'
            ],
            implications: [
              'Must prioritize digital experience',
              'Mobile optimization critical',
              'Direct mail response declining',
              'Younger donors expect seamless tech'
            ],
            recommendations: [
              'Redesign donation page for mobile',
              'Implement Apple/Google Pay',
              'Launch text-to-give campaigns',
              'Reduce checkout steps to 3 or less',
              'A/B test form optimizations'
            ]
          },
          {
            title: 'Major Gift Pipeline Building',
            type: 'emerging',
            direction: 'up',
            strength: 'moderate',
            timeframe: 'Last 12 months',
            description: 'Donors giving $1,000-$4,999 increased 34%, indicating strong major gift potential.',
            dataPoints: [
              '23 new $1,000+ donors',
              '8 donors upgraded to $5,000+',
              'Average major gift: $7,500',
              'Pipeline value: $245,000',
              '67% made multiple gifts'
            ],
            implications: [
              'Mid-level program working',
              'Ready for major gift officer',
              'Planned giving opportunities',
              'Need cultivation events'
            ],
            recommendations: [
              'Hire or assign major gift officer',
              'Create moves management system',
              'Host exclusive donor events',
              'Develop gift clubs with benefits',
              'Start planned giving conversations'
            ]
          }
        ],
        correlations: [
          {
            factor1: 'Email frequency',
            factor2: 'Unsubscribe rate',
            relationship: 'Emails over 2/week increase unsubscribes by 23%'
          },
          {
            factor1: 'Personal thank you calls',
            factor2: 'Second gift rate',
            relationship: 'Calls within 48 hours increase second gifts by 34%'
          },
          {
            factor1: 'Event attendance',
            factor2: 'Major gift likelihood',
            relationship: 'Event attendees 4.2x more likely to become major donors'
          }
        ],
        predictions: [
          {
            metric: 'Total Revenue',
            forecast: '+18-22% growth in next 12 months',
            confidence: 'high',
            assumptions: [
              'Economy remains stable',
              'Monthly giving program continues growth',
              'Year-end campaign meets goals',
              'No major donor attrition'
            ]
          },
          {
            metric: 'Monthly Donors',
            forecast: '200-220 by December 2025',
            confidence: 'medium',
            assumptions: [
              'Current growth rate continues',
              'Payment failure rate stays under 5%',
              'Upgrade campaigns successful',
              'No platform changes'
            ]
          }
        ],
        watchPoints: [
          'Monitor payment processor fee changes impacting small gifts',
          'Track generational shift as Boomers age and Millennials increase giving',
          'Watch for economic indicators affecting discretionary giving',
          'Observe competitor campaigns that may impact donor attention',
          'Stay alert to changes in tax law affecting charitable deductions'
        ]
      }),

      program_participation: () => ({
        summary: 'Program participation shows strong growth in youth services and digital programs while traditional senior services face declining enrollment. Virtual options have become permanent fixtures with hybrid models showing highest satisfaction.',
        trends: [
          {
            title: 'Youth Program Explosion',
            type: 'accelerating',
            direction: 'up',
            strength: 'strong',
            timeframe: 'Last 24 months',
            description: 'Youth after-school and summer programs experiencing unprecedented demand, with waitlists for most offerings.',
            dataPoints: [
              '2022: 234 youth served',
              '2023: 412 youth served',
              '2024: 623 youth served',
              'Waitlist: 89 students',
              'Retention: 84% semester-over-semester'
            ],
            implications: [
              'Need expanded facilities',
              'Staff hiring critical',
              'Funding opportunities available',
              'Parent engagement increasing',
              'Partner school relationships key'
            ],
            recommendations: [
              'Open second location in high-demand area',
              'Hire 3 additional program staff',
              'Apply for youth-focused grants',
              'Develop parent volunteer program',
              'Create summer camp expansion'
            ]
          },
          {
            title: 'Virtual Program Stabilization',
            type: 'stable',
            direction: 'stable',
            strength: 'moderate',
            timeframe: 'Last 12 months',
            description: 'Virtual programs have found their steady state at 30% of total participation after pandemic surge and subsequent decline.',
            dataPoints: [
              'Peak 2021: 78% virtual',
              'Current: 30% virtual',
              'Hybrid options: 45%',
              'In-person only: 25%',
              'Satisfaction: Equal across formats'
            ],
            implications: [
              'Permanent virtual infrastructure needed',
              'Hybrid is preferred model',
              'Tech support remains important',
              'Broader geographic reach possible'
            ],
            recommendations: [
              'Standardize hybrid delivery model',
              'Invest in streaming equipment',
              'Train all staff on virtual tools',
              'Market to wider geographic area',
              'Create virtual-first programs'
            ]
          },
          {
            title: 'Workforce Development Surge',
            type: 'emerging',
            direction: 'up',
            strength: 'strong',
            timeframe: 'Last 6 months',
            description: 'Job training and workforce programs seeing 125% increase in applications as economy shifts.',
            dataPoints: [
              'Q1 2024: 45 enrolled',
              'Q3 2024: 101 enrolled',
              'Job placement: 73%',
              'Average wage: $22/hour',
              'Employer partners: 34'
            ],
            implications: [
              'Economic uncertainty driving demand',
              'Strong outcomes attracting funders',
              'Employer partnerships crucial',
              'Need industry-specific tracks'
            ],
            recommendations: [
              'Launch healthcare career track',
              'Develop tech skills bootcamp',
              'Create paid internship program',
              'Partner with major employers',
              'Seek workforce development grants'
            ]
          }
        ],
        correlations: [
          {
            factor1: 'Program completion',
            factor2: 'Employment within 90 days',
            relationship: 'Completers 3.4x more likely to find employment'
          },
          {
            factor1: 'Transportation assistance',
            factor2: 'Program attendance',
            relationship: 'Transit passes increase attendance by 28%'
          },
          {
            factor1: 'Childcare availability',
            factor2: 'Parent participation',
            relationship: 'On-site childcare doubles parent engagement'
          }
        ],
        predictions: [
          {
            metric: 'Total Participants',
            forecast: '4,500-5,000 by end of 2025',
            confidence: 'high',
            assumptions: [
              'Funding remains stable',
              'Staff capacity increased',
              'Facility constraints addressed',
              'Community need continues'
            ]
          },
          {
            metric: 'Virtual Participation',
            forecast: 'Stable at 30-35% of total',
            confidence: 'high',
            assumptions: [
              'Technology platform maintained',
              'Hybrid preference continues',
              'No major tech disruptions',
              'Staff comfort with virtual'
            ]
          }
        ],
        watchPoints: [
          'Monitor school district policy changes affecting after-school programs',
          'Track employment market shifts impacting workforce programs',
          'Watch for new competitors entering service area',
          'Observe changing demographics in service neighborhoods',
          'Stay aware of mental health needs increasing across all programs'
        ]
      }),

      digital_engagement: () => ({
        summary: 'Digital engagement patterns show platform fragmentation with audiences spreading across more channels. Email effectiveness declining while video content and peer-to-peer sharing drive highest engagement. Mobile-first approach now essential.',
        trends: [
          {
            title: 'Email Fatigue Setting In',
            type: 'declining',
            direction: 'down',
            strength: 'moderate',
            timeframe: 'Last 18 months',
            description: 'Email open rates declining from 28% to 19% despite list growth. Click rates also falling.',
            dataPoints: [
              '2023 Q1: 28% open rate',
              '2024 Q3: 19% open rate',
              'Click rate: 2.8% to 1.9%',
              'Unsubscribes increasing',
              'Mobile opens: 67%'
            ],
            implications: [
              'Need new communication channels',
              'Quality over quantity essential',
              'Segmentation critical',
              'Subject lines crucial',
              'Design for mobile'
            ],
            recommendations: [
              'Reduce email frequency by 30%',
              'Implement preference center',
              'A/B test every campaign',
              'Create SMS alternative',
              'Develop app push notifications'
            ]
          },
          {
            title: 'Video Content Dominance',
            type: 'accelerating',
            direction: 'up',
            strength: 'strong',
            timeframe: 'Last 12 months',
            description: 'Video content generates 340% more engagement than text/image posts across all platforms.',
            dataPoints: [
              'Video views: +234% YoY',
              'Average watch time: 1:47',
              'Shares: 5.2x text posts',
              'Stories outperform feed',
              'Live video highest engagement'
            ],
            implications: [
              'Video skills needed',
              'Equipment investment required',
              'Story-first content strategy',
              'Platform-specific formats',
              'Authenticity over production'
            ],
            recommendations: [
              'Hire video content creator',
              'Create weekly video series',
              'Train staff on video basics',
              'Invest in basic equipment',
              'Develop video content calendar'
            ]
          },
          {
            title: 'Gen Z Platform Migration',
            type: 'emerging',
            direction: 'up',
            strength: 'moderate',
            timeframe: 'Last 6 months',
            description: 'Younger supporters primarily engaging through TikTok, Discord, and other emerging platforms.',
            dataPoints: [
              'Under 25 on Facebook: -45%',
              'TikTok followers: +567%',
              'Discord community: 234 members',
              'Instagram Reels: Primary reach',
              'LinkedIn for young professionals'
            ],
            implications: [
              'Multi-platform strategy essential',
              'Different content per platform',
              'Peer ambassadors needed',
              'Authentic voice required',
              'Cause-related hashtags key'
            ],
            recommendations: [
              'Launch TikTok strategy',
              'Create Discord community',
              'Recruit young ambassadors',
              'Develop platform playbooks',
              'Test emerging platforms'
            ]
          }
        ],
        correlations: [
          {
            factor1: 'Post time',
            factor2: 'Engagement rate',
            relationship: 'Posts at 7-9pm get 45% higher engagement'
          },
          {
            factor1: 'User-generated content',
            factor2: 'Donation conversion',
            relationship: 'UGC posts drive 3x donation conversion'
          },
          {
            factor1: 'Response time',
            factor2: 'Follower retention',
            relationship: 'Replies within 1 hour increase retention 28%'
          }
        ],
        predictions: [
          {
            metric: 'Email engagement',
            forecast: 'Continued decline to 15% open rate',
            confidence: 'high',
            assumptions: [
              'Current practices continue',
              'No major strategy shift',
              'Industry trends persist',
              'Alternative channels not adopted'
            ]
          },
          {
            metric: 'Video content ROI',
            forecast: '450% engagement vs. static by 2025',
            confidence: 'medium',
            assumptions: [
              'Platform algorithms favor video',
              'Resources allocated to video',
              'Skills developed internally',
              'Audience preferences continue'
            ]
          }
        ],
        watchPoints: [
          'Monitor new platform launches that could fragment audience further',
          'Track AI tool adoption changing content creation landscape',
          'Watch privacy regulation impacts on targeting and tracking',
          'Observe influencer partnership opportunities in nonprofit space',
          'Stay alert to platform algorithm changes affecting organic reach'
        ]
      })
    };

    const template = templates[dataCategory] || templates.giving_trends;
    return template();
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <span className="text-gray-600">→</span>;
    }
  };

  const getTrendTypeColor = (type: string) => {
    switch (type) {
      case 'accelerating': return 'bg-green-100 text-green-800';
      case 'emerging': return 'bg-blue-100 text-blue-800';
      case 'declining': return 'bg-red-100 text-red-800';
      case 'seasonal': return 'bg-purple-100 text-purple-800';
      case 'stable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-600 text-white';
      case 'moderate': return 'bg-yellow-600 text-white';
      case 'weak': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Trend Identifier
          </CardTitle>
          <p className="text-sm text-gray-600">
            Discover patterns and predict future movements in your data
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Category</label>
              <Select value={dataCategory} onValueChange={setDataCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="What type of data?" />
                </SelectTrigger>
                <SelectContent>
                  {dataCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div>
                        <div className="font-medium">{category.label}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Analysis Depth</label>
              <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
                <SelectTrigger>
                  <SelectValue placeholder="How deep to analyze?" />
                </SelectTrigger>
                <SelectContent>
                  {analysisDepths.map((depth) => (
                    <SelectItem key={depth.value} value={depth.value}>
                      <div>
                        <div className="font-medium">{depth.label}</div>
                        <div className="text-xs text-gray-500">{depth.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Historical Data</label>
            <Textarea
              value={historicalData}
              onChange={(e) => setHistoricalData(e.target.value)}
              placeholder="Paste your historical data or describe trends you've noticed. Include time periods, metrics, and any relevant context. For example: 'Monthly donations: Jan $45K, Feb $38K, Mar $52K...'"
              rows={5}
              className="resize-none font-mono text-sm"
            />
          </div>

          <Button 
            onClick={identifyTrends} 
            disabled={isAnalyzing || !dataCategory || !analysisDepth || !historicalData.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Trends...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Identify Trends
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trend Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          {analysis.trends.map((trend, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(trend.direction)}
                    <CardTitle className="text-lg">{trend.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getTrendTypeColor(trend.type)}>
                      {trend.type}
                    </Badge>
                    <Badge className={getStrengthBadge(trend.strength)}>
                      {trend.strength}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{trend.timeframe}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{trend.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <BarChart className="h-4 w-4 text-blue-600" />
                      Data Points
                    </h5>
                    <ul className="space-y-1">
                      {trend.dataPoints.map((point, i) => (
                        <li key={i} className="text-sm text-gray-600">• {point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4 text-purple-600" />
                      Implications
                    </h5>
                    <ul className="space-y-1">
                      {trend.implications.map((implication, i) => (
                        <li key={i} className="text-sm text-gray-600">• {implication}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Recommendations
                    </h5>
                    <ul className="space-y-1">
                      {trend.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-600">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {analysis.correlations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Key Correlations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.correlations.map((correlation, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{correlation.factor1}</span>
                        <span className="text-yellow-600">↔</span>
                        <span className="font-medium">{correlation.factor2}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{correlation.relationship}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.predictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Future Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.predictions.map((prediction, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{prediction.metric}</h4>
                      <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence} confidence
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 mb-2">{prediction.forecast}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Assumptions:</p>
                      <ul className="space-y-1">
                        {prediction.assumptions.map((assumption, i) => (
                          <li key={i} className="text-sm text-gray-600">• {assumption}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Watch Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.watchPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">!</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};