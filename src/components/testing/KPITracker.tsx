import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface KPITrackerProps {
  onComplete?: () => void;
}

interface KPI {
  name: string;
  category: string;
  current: number | string;
  target: number | string;
  previous: number | string;
  trend: 'up' | 'down' | 'stable';
  status: 'on-track' | 'at-risk' | 'off-track' | 'exceeded';
  percentToGoal: number;
  insights: string[];
  actions: string[];
}

interface KPIDashboard {
  period: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  summary: string;
  kpis: KPI[];
  achievements: string[];
  concerns: string[];
  recommendations: string[];
}

export const KPITracker: React.FC<KPITrackerProps> = ({ onComplete }) => {
  const [organizationType, setOrganizationType] = useState<string>('');
  const [reportingPeriod, setReportingPeriod] = useState<string>('');
  const [focusArea, setFocusArea] = useState<string>('');
  const [dashboard, setDashboard] = useState<KPIDashboard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const organizationTypes = [
    { value: 'education', label: 'Education & Youth', description: 'Schools, tutoring, youth programs' },
    { value: 'health', label: 'Health & Wellness', description: 'Healthcare, mental health services' },
    { value: 'social_services', label: 'Social Services', description: 'Food, housing, general assistance' },
    { value: 'arts', label: 'Arts & Culture', description: 'Museums, theaters, cultural programs' },
    { value: 'environment', label: 'Environmental', description: 'Conservation, sustainability' },
    { value: 'general', label: 'General Nonprofit', description: 'Multiple program areas' }
  ];

  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annual', label: 'Annual' },
    { value: 'ytd', label: 'Year-to-Date' }
  ];

  const focusAreas = [
    { value: 'all', label: 'All KPIs', description: 'Comprehensive view' },
    { value: 'financial', label: 'Financial Health', description: 'Revenue, expenses, sustainability' },
    { value: 'program', label: 'Program Impact', description: 'Service delivery, outcomes' },
    { value: 'fundraising', label: 'Fundraising', description: 'Donor metrics, campaigns' },
    { value: 'operations', label: 'Operations', description: 'Efficiency, capacity' },
    { value: 'engagement', label: 'Engagement', description: 'Volunteers, community' }
  ];

  const generateDashboard = async () => {
    if (!organizationType || !reportingPeriod || !focusArea) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = createKPIDashboard();
      setDashboard(result);
      
      toast.success('KPI dashboard generated!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate dashboard. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createKPIDashboard = (): KPIDashboard => {
    const templates: Record<string, () => KPIDashboard> = {
      comprehensive: () => ({
        period: 'Q3 2024',
        overallHealth: 'good',
        summary: 'Organization performing well overall with 73% of KPIs meeting or exceeding targets. Strong program growth and donor retention offset challenges in volunteer recruitment and operational efficiency. Financial position remains stable with positive trends.',
        kpis: [
          // Financial KPIs
          {
            name: 'Total Revenue',
            category: 'Financial',
            current: '$892,450',
            target: '$850,000',
            previous: '$756,320',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 105,
            insights: [
              'Major gift campaign overperformed by 23%',
              'Monthly giving up 34% year-over-year',
              'Grant revenue on target'
            ],
            actions: [
              'Maintain donor stewardship momentum',
              'Prepare Q4 year-end campaign',
              'Apply for 3 new foundation grants'
            ]
          },
          {
            name: 'Operating Expense Ratio',
            category: 'Financial',
            current: '78%',
            target: '75%',
            previous: '72%',
            trend: 'down',
            status: 'at-risk',
            percentToGoal: 96,
            insights: [
              'Program expenses healthy at 78%',
              'Admin costs increased due to new hires',
              'Still within acceptable range'
            ],
            actions: [
              'Review admin expenses for efficiency',
              'Ensure new hires drive program growth',
              'Target 80% by year-end'
            ]
          },
          {
            name: 'Cash Reserves (months)',
            category: 'Financial',
            current: '3.2',
            target: '3.0',
            previous: '2.8',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 107,
            insights: [
              'Reserves building as planned',
              'Cash flow management improved',
              'Target of 4 months by 2025'
            ],
            actions: [
              'Continue reserve building strategy',
              'Invest excess in high-yield savings',
              'Update reserve policy for board'
            ]
          },
          // Program KPIs
          {
            name: 'Individuals Served',
            category: 'Program',
            current: '3,847',
            target: '3,500',
            previous: '3,156',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 110,
            insights: [
              'Youth programs driving growth',
              'New locations increasing reach',
              'Capacity becoming constraint'
            ],
            actions: [
              'Plan facility expansion',
              'Hire additional program staff',
              'Optimize scheduling for capacity'
            ]
          },
          {
            name: 'Program Completion Rate',
            category: 'Program',
            current: '84%',
            target: '80%',
            previous: '79%',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 105,
            insights: [
              'New retention strategies working',
              'Strong staff-participant relationships',
              'Transportation support helping'
            ],
            actions: [
              'Document best practices',
              'Expand transportation assistance',
              'Set stretch goal of 87%'
            ]
          },
          {
            name: 'Client Satisfaction Score',
            category: 'Program',
            current: '4.6/5.0',
            target: '4.5/5.0',
            previous: '4.5/5.0',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 102,
            insights: [
              'Consistently high satisfaction',
              'Staff training paying off',
              'Facility improvements noted'
            ],
            actions: [
              'Maintain quality standards',
              'Address minor pain points',
              'Celebrate team success'
            ]
          },
          // Fundraising KPIs
          {
            name: 'Donor Retention Rate',
            category: 'Fundraising',
            current: '68%',
            target: '65%',
            previous: '62%',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 105,
            insights: [
              'Stewardship program effective',
              'Personal touchpoints increased',
              'Monthly donors highly retained'
            ],
            actions: [
              'Expand stewardship activities',
              'Launch loyalty recognition',
              'Focus on first-year retention'
            ]
          },
          {
            name: 'Average Gift Size',
            category: 'Fundraising',
            current: '$287',
            target: '$250',
            previous: '$234',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 115,
            insights: [
              'Upgrade asks successful',
              'Major donor growth contributing',
              'Online giving amounts rising'
            ],
            actions: [
              'Continue upgrade campaigns',
              'Test suggested gift amounts',
              'Cultivate mid-level donors'
            ]
          },
          {
            name: 'Cost to Raise $1',
            category: 'Fundraising',
            current: '$0.18',
            target: '$0.20',
            previous: '$0.22',
            trend: 'down',
            status: 'exceeded',
            percentToGoal: 110,
            insights: [
              'Efficiency improving',
              'Digital channels cost-effective',
              'Events ROI strong'
            ],
            actions: [
              'Maintain efficiency focus',
              'Invest savings in acquisition',
              'Document successful tactics'
            ]
          },
          // Operations KPIs
          {
            name: 'Volunteer Hours',
            category: 'Operations',
            current: '2,156',
            target: '2,500',
            previous: '2,489',
            trend: 'down',
            status: 'off-track',
            percentToGoal: 86,
            insights: [
              'Summer decline expected',
              'Need corporate partnerships',
              'Retention challenges'
            ],
            actions: [
              'Launch fall recruitment',
              'Create corporate program',
              'Improve volunteer experience'
            ]
          },
          {
            name: 'Staff Turnover Rate',
            category: 'Operations',
            current: '12%',
            target: '15%',
            previous: '18%',
            trend: 'down',
            status: 'exceeded',
            percentToGoal: 120,
            insights: [
              'Culture improvements working',
              'Competitive salaries helping',
              'Professional development valued'
            ],
            actions: [
              'Continue culture initiatives',
              'Expand PD opportunities',
              'Conduct stay interviews'
            ]
          },
          {
            name: 'Technology Adoption',
            category: 'Operations',
            current: '78%',
            target: '85%',
            previous: '65%',
            trend: 'up',
            status: 'at-risk',
            percentToGoal: 92,
            insights: [
              'CRM adoption strong',
              'Some resistance to new tools',
              'Training needs identified'
            ],
            actions: [
              'Provide additional training',
              'Create user champions',
              'Simplify workflows'
            ]
          }
        ],
        achievements: [
          'Exceeded service delivery targets by 10%',
          'Achieved highest donor retention rate in organization history',
          'Reduced fundraising costs while increasing revenue',
          'Maintained high program quality scores',
          'Successfully reduced staff turnover'
        ],
        concerns: [
          'Volunteer engagement declining - need recruitment strategy',
          'Facility capacity constraining program growth',
          'Technology adoption below target despite improvements',
          'Operating expense ratio creeping up',
          'Dependence on major gift success'
        ],
        recommendations: [
          'Invest in volunteer program overhaul with dedicated coordinator',
          'Begin facility expansion planning for 2025',
          'Accelerate technology training with incentives',
          'Review and optimize administrative costs',
          'Diversify revenue with monthly giving focus'
        ]
      }),

      financial_focus: () => ({
        period: reportingPeriod === 'quarterly' ? 'Q3 2024' : 'September 2024',
        overallHealth: 'good',
        summary: 'Financial KPIs show strong revenue performance with total income 8% above budget. Expense management remains disciplined with positive cash flow trends. Reserve building on track to reach 4-month target by mid-2025.',
        kpis: [
          {
            name: 'Total Revenue',
            category: 'Revenue',
            current: '$312,450',
            target: '$290,000',
            previous: '$278,900',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 108,
            insights: [
              'Individual giving up 23%',
              'Foundation grants on target',
              'Corporate support growing'
            ],
            actions: [
              'Capitalize on momentum',
              'Submit Q4 grant proposals',
              'Steward major donors'
            ]
          },
          {
            name: 'Monthly Recurring Revenue',
            category: 'Revenue',
            current: '$12,340',
            target: '$10,000',
            previous: '$8,950',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 123,
            insights: [
              '142 active monthly donors',
              'Average gift $87/month',
              'Churn rate only 3%'
            ],
            actions: [
              'Launch upgrade campaign',
              'Add 20 monthly donors',
              'Prevent payment failures'
            ]
          },
          {
            name: 'Total Expenses',
            category: 'Expense',
            current: '$298,230',
            target: '$305,000',
            previous: '$289,450',
            trend: 'up',
            status: 'on-track',
            percentToGoal: 98,
            insights: [
              'Under budget by 2%',
              'Program costs as planned',
              'Admin costs controlled'
            ],
            actions: [
              'Maintain discipline',
              'Review Q4 projections',
              'Identify savings'
            ]
          },
          {
            name: 'Net Income',
            category: 'Profit',
            current: '$14,220',
            target: '$5,000',
            previous: '-$10,550',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 284,
            insights: [
              'Strong positive margin',
              'Ahead of budget',
              'Building reserves'
            ],
            actions: [
              'Allocate to reserves',
              'Plan strategic investments',
              'Update board'
            ]
          },
          {
            name: 'Days Cash on Hand',
            category: 'Liquidity',
            current: '98',
            target: '90',
            previous: '84',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 109,
            insights: [
              'Liquidity improving',
              'Collections accelerated',
              'Expenses well-managed'
            ],
            actions: [
              'Target 120 days',
              'Optimize investments',
              'Monitor closely'
            ]
          },
          {
            name: 'Accounts Receivable Days',
            category: 'Efficiency',
            current: '28',
            target: '30',
            previous: '35',
            trend: 'down',
            status: 'exceeded',
            percentToGoal: 107,
            insights: [
              'Collections improved',
              'Grant payments timely',
              'Pledge follow-up working'
            ],
            actions: [
              'Maintain processes',
              'Automate reminders',
              'Thank prompt payers'
            ]
          }
        ],
        achievements: [
          'Revenue exceeded budget for 5 consecutive months',
          'Monthly giving program surpassed annual goal in Q3',
          'Reduced AR days by 20% through better processes',
          'Maintained positive cash flow throughout period',
          'Built reserves to 3.2 months of operations'
        ],
        concerns: [
          'Q4 revenue highly dependent on year-end campaign',
          'Rising personnel costs may pressure margins',
          'Grant pipeline needs strengthening for 2025',
          'Investment returns below assumptions'
        ],
        recommendations: [
          'Begin year-end campaign planning immediately',
          'Conduct salary benchmarking study',
          'Dedicate resources to grant writing',
          'Review investment policy with finance committee',
          'Create multi-year financial projections'
        ]
      }),

      program_focus: () => ({
        period: reportingPeriod === 'quarterly' ? 'Q3 2024' : 'September 2024',
        overallHealth: 'excellent',
        summary: 'Program KPIs demonstrate exceptional performance with all key metrics exceeding targets. Service delivery expanded 22% while maintaining quality scores above 90%. Strong outcomes positioning organization for growth funding.',
        kpis: [
          {
            name: 'Total Participants Served',
            category: 'Reach',
            current: '1,234',
            target: '1,000',
            previous: '987',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 123,
            insights: [
              'New programs driving growth',
              'Referral partnerships working',
              'Capacity nearly maxed'
            ],
            actions: [
              'Plan expansion',
              'Hire program staff',
              'Optimize scheduling'
            ]
          },
          {
            name: 'Program Completion Rate',
            category: 'Quality',
            current: '87%',
            target: '80%',
            previous: '82%',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 109,
            insights: [
              'Engagement strategies effective',
              'Barrier removal helping',
              'Staff relationships strong'
            ],
            actions: [
              'Document best practices',
              'Train all staff',
              'Set 90% goal'
            ]
          },
          {
            name: 'Outcome Achievement',
            category: 'Impact',
            current: '91%',
            target: '85%',
            previous: '88%',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 107,
            insights: [
              'Evidence-based approach working',
              'Continuous improvement culture',
              'Strong funder metrics'
            ],
            actions: [
              'Share success stories',
              'Apply for outcome funding',
              'Expand evaluation'
            ]
          },
          {
            name: 'Cost Per Participant',
            category: 'Efficiency',
            current: '$234',
            target: '$275',
            previous: '$298',
            trend: 'down',
            status: 'exceeded',
            percentToGoal: 115,
            insights: [
              'Scale efficiencies realized',
              'Group model effective',
              'Volunteer support helps'
            ],
            actions: [
              'Maintain efficiency',
              'Invest savings in quality',
              'Track by program'
            ]
          },
          {
            name: 'Wait List Size',
            category: 'Demand',
            current: '89',
            target: '<50',
            previous: '45',
            trend: 'up',
            status: 'off-track',
            percentToGoal: 56,
            insights: [
              'Demand exceeding capacity',
              'Youth programs full',
              'Need expansion'
            ],
            actions: [
              'Add program sessions',
              'Explore partnerships',
              'Prioritize high-need'
            ]
          },
          {
            name: 'Partner Referrals',
            category: 'Collaboration',
            current: '145',
            target: '120',
            previous: '98',
            trend: 'up',
            status: 'exceeded',
            percentToGoal: 121,
            insights: [
              'Strong partner network',
              'Trusted in community',
              'Referral system smooth'
            ],
            actions: [
              'Thank partners',
              'Add capacity',
              'Track outcomes'
            ]
          }
        ],
        achievements: [
          'Served 23% more participants than target',
          'Achieved highest completion rate in organization history',
          'Reduced cost per participant by 22% through efficiency',
          'Maintained quality scores above 90%',
          'Strengthened partnerships with 45% more referrals'
        ],
        concerns: [
          'Growing wait lists indicating unmet demand',
          'Staff capacity stretched with current volume',
          'Space constraints limiting expansion',
          'Outcome tracking systems need upgrade'
        ],
        recommendations: [
          'Develop expansion plan to address wait lists',
          'Hire 2-3 additional program staff immediately',
          'Explore satellite locations or partner spaces',
          'Invest in outcome management software',
          'Apply for capacity-building grants'
        ]
      })
    };

    if (focusArea === 'financial') {
      return templates.financial_focus();
    } else if (focusArea === 'program') {
      return templates.program_focus();
    } else {
      return templates.comprehensive();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'on-track': return <Target className="h-4 w-4 text-blue-600" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'off-track': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'off-track': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-600 text-white';
      case 'good': return 'bg-blue-600 text-white';
      case 'fair': return 'bg-yellow-600 text-white';
      case 'poor': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 100) return 'bg-green-600';
    if (percent >= 80) return 'bg-blue-600';
    if (percent >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            KPI Tracker
          </CardTitle>
          <p className="text-sm text-gray-600">
            Monitor your key performance indicators in real-time
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Type</label>
              <Select value={organizationType} onValueChange={setOrganizationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Reporting Period</label>
              <Select value={reportingPeriod} onValueChange={setReportingPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Focus Area</label>
              <Select value={focusArea} onValueChange={setFocusArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select focus" />
                </SelectTrigger>
                <SelectContent>
                  {focusAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      <div>
                        <div className="font-medium">{area.label}</div>
                        <div className="text-xs text-gray-500">{area.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateDashboard} 
            disabled={isGenerating || !organizationType || !reportingPeriod || !focusArea}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating KPI Dashboard...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Generate Dashboard
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {dashboard && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">KPI Dashboard - {dashboard.period}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{dashboard.summary}</p>
                </div>
                <Badge className={getHealthColor(dashboard.overallHealth)}>
                  {dashboard.overallHealth.toUpperCase()} HEALTH
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.kpis.map((kpi, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{kpi.name}</h3>
                    {getStatusIcon(kpi.status)}
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">
                    {kpi.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-end justify-between mb-1">
                      <span className="text-2xl font-bold">{kpi.current}</span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Target</div>
                        <div className="text-sm font-medium">{kpi.target}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Previous: {kpi.previous}</span>
                      {kpi.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {kpi.trend === 'stable' && <span>→</span>}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress to Goal</span>
                      <span className="font-medium">{kpi.percentToGoal}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressBarColor(kpi.percentToGoal)}`}
                        style={{ width: `${Math.min(kpi.percentToGoal, 100)}%` }}
                      />
                    </div>
                  </div>

                  <Badge className={getStatusColor(kpi.status)}>
                    {kpi.status.replace('-', ' ')}
                  </Badge>

                  <div className="space-y-2 pt-2 border-t">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Insights</p>
                      <ul className="space-y-1">
                        {kpi.insights.slice(0, 2).map((insight, i) => (
                          <li key={i} className="text-xs text-gray-600">• {insight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Actions</p>
                      <ul className="space-y-1">
                        {kpi.actions.slice(0, 2).map((action, i) => (
                          <li key={i} className="text-xs text-gray-600">→ {action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dashboard.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Areas of Concern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dashboard.concerns.map((concern, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">!</span>
                      <span className="text-sm">{concern}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dashboard.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 font-bold">{index + 1}.</span>
                    <span className="text-sm">{rec}</span>
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