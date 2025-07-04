import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Target, Users, DollarSign, Clock, Heart, Award } from 'lucide-react';
import { toast } from 'sonner';

interface ImpactMeasurementProps {
  onComplete?: () => void;
}

interface MetricDefinition {
  category: string;
  metric: string;
  description: string;
  formula: string;
  dataSource: string;
  frequency: string;
  target: string;
  visualization: string;
}

interface ImpactFramework {
  organizationProfile: {
    type: string;
    size: string;
    missionFocus: string;
    aiMaturity: string;
  };
  impactModel: {
    level: string;
    metrics: MetricDefinition[];
    relationships: string[];
  }[];
  baselineData: {
    metric: string;
    preAI: string;
    current: string;
    improvement: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  dashboardDesign: {
    section: string;
    purpose: string;
    visualizations: {
      type: string;
      metric: string;
      updateFrequency: string;
      interpretation: string;
    }[];
    insights: string[];
  }[];
  storytelling: {
    audience: string;
    keyMessage: string;
    dataPoints: string[];
    narrative: string;
    callToAction: string;
  }[];
  improvementPlan: {
    area: string;
    currentState: string;
    targetState: string;
    actions: string[];
    timeline: string;
    success: string;
  }[];
}

export const ImpactMeasurement: React.FC<ImpactMeasurementProps> = ({ onComplete }) => {
  const [organizationType, setOrganizationType] = useState<string>('');
  const [missionArea, setMissionArea] = useState<string>('');
  const [currentMetrics, setCurrentMetrics] = useState<string>('');
  const [aiUsageLevel, setAiUsageLevel] = useState<string>('');
  const [framework, setFramework] = useState<ImpactFramework | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const orgTypes = [
    { value: 'direct_service', label: 'Direct Service', description: 'Frontline programs' },
    { value: 'advocacy', label: 'Advocacy', description: 'Policy and systems change' },
    { value: 'capacity_building', label: 'Capacity Building', description: 'Supporting other nonprofits' },
    { value: 'grantmaking', label: 'Grantmaking', description: 'Funding distribution' },
    { value: 'hybrid', label: 'Hybrid', description: 'Multiple approaches' }
  ];

  const missionAreas = [
    { value: 'education', label: 'Education', description: 'Learning and development' },
    { value: 'health', label: 'Health & Wellness', description: 'Physical and mental health' },
    { value: 'social_services', label: 'Social Services', description: 'Basic needs and support' },
    { value: 'environment', label: 'Environment', description: 'Conservation and sustainability' },
    { value: 'arts_culture', label: 'Arts & Culture', description: 'Creative expression' },
    { value: 'community_dev', label: 'Community Development', description: 'Local empowerment' },
    { value: 'international', label: 'International', description: 'Global programs' }
  ];

  const metricsLevels = [
    { value: 'basic', label: 'Basic Tracking', description: 'Outputs only' },
    { value: 'intermediate', label: 'Some Outcomes', description: 'Mix of outputs and outcomes' },
    { value: 'advanced', label: 'Comprehensive', description: 'Full logic model metrics' },
    { value: 'none', label: 'Limited/None', description: 'Starting from scratch' }
  ];

  const aiLevels = [
    { value: 'exploring', label: 'Exploring', description: 'Just starting with AI' },
    { value: 'piloting', label: 'Piloting', description: '1-3 AI tools in use' },
    { value: 'scaling', label: 'Scaling', description: 'Multiple departments using AI' },
    { value: 'transforming', label: 'Transforming', description: 'AI integral to operations' }
  ];

  const generateFramework = async () => {
    if (!organizationType || !missionArea || !currentMetrics || !aiUsageLevel) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = createImpactFramework();
      setFramework(result);
      
      toast.success('Impact framework created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate framework. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createImpactFramework = (): ImpactFramework => {
    const templates: Record<string, () => ImpactFramework> = {
      'direct_service_education': () => ({
        organizationProfile: {
          type: 'Direct Service - Education',
          size: 'Medium',
          missionFocus: 'Student achievement and life outcomes',
          aiMaturity: aiUsageLevel === 'transforming' ? 'Advanced' : 'Developing'
        },
        impactModel: [
          {
            level: 'Outputs (Activities)',
            metrics: [
              {
                category: 'Service Delivery',
                metric: 'Students Served',
                description: 'Total unique students receiving services',
                formula: 'Count of unique student IDs',
                dataSource: 'Program database',
                frequency: 'Monthly',
                target: '10% annual increase',
                visualization: 'Trend line with YoY comparison'
              },
              {
                category: 'Service Delivery',
                metric: 'Tutoring Hours',
                description: 'Total hours of tutoring provided',
                formula: 'Sum of session durations',
                dataSource: 'Scheduling system',
                frequency: 'Weekly',
                target: '5,000 hours/month',
                visualization: 'Bar chart by program'
              },
              {
                category: 'AI Efficiency',
                metric: 'Automated Tasks',
                description: 'Tasks completed by AI vs manual',
                formula: 'AI tasks / Total tasks × 100',
                dataSource: 'Process logs',
                frequency: 'Weekly',
                target: '40% automation rate',
                visualization: 'Donut chart'
              }
            ],
            relationships: [
              'More students served → Greater potential impact',
              'AI automation → More time for direct service',
              'Efficient operations → Lower cost per student'
            ]
          },
          {
            level: 'Outcomes (Short-term)',
            metrics: [
              {
                category: 'Academic Progress',
                metric: 'Grade Improvement',
                description: 'Average grade level improvement',
                formula: 'Post-test - Pre-test scores',
                dataSource: 'Assessment platform',
                frequency: 'Quarterly',
                target: '1.5 grade levels/year',
                visualization: 'Box plot with distributions'
              },
              {
                category: 'Engagement',
                metric: 'Attendance Rate',
                description: 'Program attendance consistency',
                formula: 'Attended sessions / Scheduled × 100',
                dataSource: 'Attendance system',
                frequency: 'Monthly',
                target: '85% attendance',
                visualization: 'Heat map by student'
              },
              {
                category: 'Quality',
                metric: 'Personalization Index',
                description: 'Degree of AI-enabled personalization',
                formula: 'Personalized elements / Total elements',
                dataSource: 'AI platform analytics',
                frequency: 'Monthly',
                target: '70% personalized',
                visualization: 'Gauge chart'
              }
            ],
            relationships: [
              'Higher attendance → Better outcomes',
              'AI personalization → Increased engagement',
              'Better engagement → Improved grades'
            ]
          },
          {
            level: 'Impact (Long-term)',
            metrics: [
              {
                category: 'Life Outcomes',
                metric: 'High School Graduation',
                description: 'Students graduating on time',
                formula: 'Graduates / Cohort × 100',
                dataSource: 'School district data',
                frequency: 'Annual',
                target: '95% graduation rate',
                visualization: 'Cohort tracking chart'
              },
              {
                category: 'Life Outcomes',
                metric: 'College Enrollment',
                description: 'Students entering post-secondary',
                formula: 'Enrolled / Graduates × 100',
                dataSource: 'National Clearinghouse',
                frequency: 'Annual',
                target: '80% enrollment',
                visualization: 'Funnel chart'
              },
              {
                category: 'System Change',
                metric: 'Model Replication',
                description: 'Other orgs adopting AI methods',
                formula: 'Count of replication sites',
                dataSource: 'Partnership tracking',
                frequency: 'Annual',
                target: '5 new sites/year',
                visualization: 'Map visualization'
              }
            ],
            relationships: [
              'Academic success → Graduation rates',
              'AI-enhanced programs → Scalable impact',
              'Proven model → Sector transformation'
            ]
          }
        ],
        baselineData: [
          {
            metric: 'Students Served',
            preAI: '500/year',
            current: '850/year',
            improvement: '+70%',
            trend: 'up'
          },
          {
            metric: 'Cost per Student',
            preAI: '$2,500',
            current: '$1,800',
            improvement: '-28%',
            trend: 'down'
          },
          {
            metric: 'Grade Improvement',
            preAI: '0.8 levels/year',
            current: '1.3 levels/year',
            improvement: '+62%',
            trend: 'up'
          },
          {
            metric: 'Staff Burnout',
            preAI: '45% annual turnover',
            current: '22% annual turnover',
            improvement: '-51%',
            trend: 'down'
          },
          {
            metric: 'Data Analysis Time',
            preAI: '40 hours/month',
            current: '5 hours/month',
            improvement: '-87%',
            trend: 'down'
          }
        ],
        dashboardDesign: [
          {
            section: 'Executive Summary',
            purpose: 'High-level impact overview for board and funders',
            visualizations: [
              {
                type: 'KPI Cards',
                metric: 'Students Served, Cost per Student, Graduation Rate',
                updateFrequency: 'Real-time',
                interpretation: 'Green/yellow/red based on targets'
              },
              {
                type: 'Impact Timeline',
                metric: 'Cumulative students impacted',
                updateFrequency: 'Monthly',
                interpretation: 'Shows acceleration since AI adoption'
              },
              {
                type: 'ROI Calculator',
                metric: 'Investment vs outcomes value',
                updateFrequency: 'Quarterly',
                interpretation: 'Dollar value of improved outcomes'
              }
            ],
            insights: [
              'AI adoption led to 70% increase in students served',
              'Cost per outcome decreased by 40%',
              'On track to exceed 5-year impact goals'
            ]
          },
          {
            section: 'Program Performance',
            purpose: 'Detailed metrics for program managers',
            visualizations: [
              {
                type: 'Cohort Progress',
                metric: 'Academic improvement by cohort',
                updateFrequency: 'Weekly',
                interpretation: 'Track each group\'s journey'
              },
              {
                type: 'Engagement Heatmap',
                metric: 'Attendance and participation',
                updateFrequency: 'Daily',
                interpretation: 'Identify at-risk students'
              },
              {
                type: 'AI Insights Feed',
                metric: 'AI-generated observations',
                updateFrequency: 'Real-time',
                interpretation: 'Actionable recommendations'
              }
            ],
            insights: [
              'Tuesday/Thursday slots show highest engagement',
              'AI tutoring supplements increase outcomes 40%',
              'Personalized content drives 25% better retention'
            ]
          },
          {
            section: 'Operational Efficiency',
            purpose: 'Resource optimization for operations team',
            visualizations: [
              {
                type: 'Automation Dashboard',
                metric: 'Tasks automated vs manual',
                updateFrequency: 'Real-time',
                interpretation: 'Track efficiency gains'
              },
              {
                type: 'Staff Utilization',
                metric: 'Time allocation by activity',
                updateFrequency: 'Weekly',
                interpretation: 'Optimize staff deployment'
              },
              {
                type: 'Cost Analysis',
                metric: 'Cost per outcome over time',
                updateFrequency: 'Monthly',
                interpretation: 'ROI trending'
              }
            ],
            insights: [
              'AI saves 30 hours/week of admin time',
              'Staff spending 50% more time with students',
              'Operating costs down 25% with better outcomes'
            ]
          }
        ],
        storytelling: [
          {
            audience: 'Major Donors',
            keyMessage: 'Your investment is transforming more lives than ever',
            dataPoints: [
              '70% more students served with same budget',
              'Grade improvements up 62%',
              '95% of students now graduate on time'
            ],
            narrative: 'When Maria joined our program, she was 2 years behind in math. Our AI-powered personalized learning path identified exactly where she needed help. Today, she\'s ahead of grade level and tutoring other students. We\'ve replicated Maria\'s success with 850 students this year alone - 70% more than before AI.',
            callToAction: 'Help us reach 1,500 students next year with expanded AI capabilities'
          },
          {
            audience: 'Board of Directors',
            keyMessage: 'AI transformation positions us as sector leaders',
            dataPoints: [
              'Cost per student down 28%',
              'Staff retention up 51%',
              '5 organizations replicating our model'
            ],
            narrative: 'Our strategic investment in AI has not only improved our direct impact but positioned us as innovators in education. We\'re now consulting with 5 other nonprofits to help them implement similar transformations. Our efficient model attracts top talent and major funders.',
            callToAction: 'Approve Phase 2 AI expansion to maintain leadership position'
          },
          {
            audience: 'Program Staff',
            keyMessage: 'AI makes your incredible work even more impactful',
            dataPoints: [
              '30 hours/week saved on admin tasks',
              'Student engagement up 40%',
              'Personalized plans for every student'
            ],
            narrative: 'Remember spending hours on progress reports? Now AI handles that in minutes, giving you 30 more hours each week to work directly with students. Your expertise guides the AI to create personalized learning plans that are showing remarkable results.',
            callToAction: 'Share your success stories to inspire continued innovation'
          }
        ],
        improvementPlan: [
          {
            area: 'Data Quality',
            currentState: 'Some inconsistent data entry',
            targetState: '99% data accuracy',
            actions: [
              'Implement automated data validation',
              'Train staff on data standards',
              'Regular data quality audits',
              'AI-powered anomaly detection'
            ],
            timeline: '3 months',
            success: 'Clean data enabling better AI insights'
          },
          {
            area: 'Predictive Capabilities',
            currentState: 'Basic trend analysis',
            targetState: 'Predictive risk indicators',
            actions: [
              'Develop early warning system',
              'Train predictive models',
              'Create intervention protocols',
              'Test and refine algorithms'
            ],
            timeline: '6 months',
            success: 'Proactive support for at-risk students'
          },
          {
            area: 'Impact Attribution',
            currentState: 'Correlation tracking',
            targetState: 'Causal impact analysis',
            actions: [
              'Implement control group studies',
              'Partner with researchers',
              'Develop attribution models',
              'Publish findings'
            ],
            timeline: '12 months',
            success: 'Proven causal link between AI and outcomes'
          }
        ]
      }),

      'advocacy_environment': () => ({
        organizationProfile: {
          type: 'Advocacy - Environment',
          size: 'Large',
          missionFocus: 'Policy change and public awareness for climate action',
          aiMaturity: 'Scaling'
        },
        impactModel: [
          {
            level: 'Outputs (Activities)',
            metrics: [
              {
                category: 'Campaign Reach',
                metric: 'Message Impressions',
                description: 'Total views of campaign content',
                formula: 'Sum across all channels',
                dataSource: 'Analytics platforms',
                frequency: 'Daily',
                target: '10M monthly impressions',
                visualization: 'Multi-channel dashboard'
              },
              {
                category: 'Engagement',
                metric: 'Action Takers',
                description: 'People taking campaign actions',
                formula: 'Unique individuals taking action',
                dataSource: 'Campaign platform',
                frequency: 'Weekly',
                target: '50K actions/month',
                visualization: 'Funnel chart'
              },
              {
                category: 'AI Efficiency',
                metric: 'Content Generation Speed',
                description: 'Time to create campaign content',
                formula: 'Pre-AI time / Current time',
                dataSource: 'Project tracking',
                frequency: 'Per campaign',
                target: '10x faster',
                visualization: 'Comparison bars'
              }
            ],
            relationships: [
              'Broader reach → More engagement',
              'AI speed → More campaigns possible',
              'Better targeting → Higher conversion'
            ]
          },
          {
            level: 'Outcomes (Short-term)',
            metrics: [
              {
                category: 'Policy Influence',
                metric: 'Bills Influenced',
                description: 'Legislation with our input',
                formula: 'Count of bills with amendments',
                dataSource: 'Policy tracking system',
                frequency: 'Quarterly',
                target: '15 bills/year',
                visualization: 'Timeline with outcomes'
              },
              {
                category: 'Public Opinion',
                metric: 'Awareness Shift',
                description: 'Public understanding of issues',
                formula: 'Post-campaign - baseline surveys',
                dataSource: 'Polling data',
                frequency: 'Per campaign',
                target: '+10% awareness',
                visualization: 'Before/after comparison'
              },
              {
                category: 'Coalition Building',
                metric: 'Partner Organizations',
                description: 'Groups joining campaigns',
                formula: 'Active coalition members',
                dataSource: 'Partnership database',
                frequency: 'Monthly',
                target: '200 active partners',
                visualization: 'Network graph'
              }
            ],
            relationships: [
              'Public awareness → Political pressure',
              'Coalition size → Policy influence',
              'AI insights → Strategic targeting'
            ]
          },
          {
            level: 'Impact (Long-term)',
            metrics: [
              {
                category: 'Environmental',
                metric: 'Carbon Reduction',
                description: 'Emissions reduced via policy',
                formula: 'Modeled impact of policies',
                dataSource: 'Environmental models',
                frequency: 'Annual',
                target: '1M tons CO2/year',
                visualization: 'Impact projection chart'
              },
              {
                category: 'Systems Change',
                metric: 'Policy Adoption',
                description: 'Policies enacted and implemented',
                formula: 'Enacted policies with enforcement',
                dataSource: 'Government records',
                frequency: 'Annual',
                target: '5 major policies',
                visualization: 'Policy tracker map'
              },
              {
                category: 'Movement Building',
                metric: 'Activated Citizens',
                description: 'Long-term engaged advocates',
                formula: 'Repeat action takers',
                dataSource: 'Engagement platform',
                frequency: 'Annual',
                target: '500K active advocates',
                visualization: 'Growth trajectory'
              }
            ],
            relationships: [
              'Policy wins → Measurable env impact',
              'Citizen activation → Sustained pressure',
              'AI amplification → Movement scale'
            ]
          }
        ],
        baselineData: [
          {
            metric: 'Campaign Reach',
            preAI: '2M/month',
            current: '8.5M/month',
            improvement: '+325%',
            trend: 'up'
          },
          {
            metric: 'Content Creation Time',
            preAI: '40 hours/campaign',
            current: '4 hours/campaign',
            improvement: '-90%',
            trend: 'down'
          },
          {
            metric: 'Targeting Accuracy',
            preAI: '15% conversion',
            current: '42% conversion',
            improvement: '+180%',
            trend: 'up'
          },
          {
            metric: 'Policy Wins',
            preAI: '3/year',
            current: '11/year',
            improvement: '+267%',
            trend: 'up'
          },
          {
            metric: 'Cost per Action',
            preAI: '$12',
            current: '$3.50',
            improvement: '-71%',
            trend: 'down'
          }
        ],
        dashboardDesign: [
          {
            section: 'Campaign Command Center',
            purpose: 'Real-time campaign monitoring and optimization',
            visualizations: [
              {
                type: 'Live Activity Map',
                metric: 'Actions by geography',
                updateFrequency: 'Real-time',
                interpretation: 'Hot spots and gaps'
              },
              {
                type: 'Sentiment Analysis',
                metric: 'Public response sentiment',
                updateFrequency: 'Hourly',
                interpretation: 'AI-analyzed reactions'
              },
              {
                type: 'Influencer Tracker',
                metric: 'Key voice amplification',
                updateFrequency: 'Real-time',
                interpretation: 'Virality indicators'
              }
            ],
            insights: [
              'AI-optimized messaging increases engagement 3x',
              'Real-time pivots improve campaign success 45%',
              'Micro-targeting reaches key decision makers'
            ]
          },
          {
            section: 'Policy Impact Tracker',
            purpose: 'Monitor legislative and regulatory progress',
            visualizations: [
              {
                type: 'Bill Progress Pipeline',
                metric: 'Legislation status',
                updateFrequency: 'Daily',
                interpretation: 'Track from draft to law'
              },
              {
                type: 'Influence Network',
                metric: 'Decision maker engagement',
                updateFrequency: 'Weekly',
                interpretation: 'Relationship mapping'
              },
              {
                type: 'Win Probability',
                metric: 'AI prediction models',
                updateFrequency: 'Daily',
                interpretation: 'Focus resource allocation'
              }
            ],
            insights: [
              'AI identifies 73% of winning strategies',
              'Predictive models guide resource allocation',
              'Network analysis reveals key influencers'
            ]
          }
        ],
        storytelling: [
          {
            audience: 'Foundation Funders',
            keyMessage: 'AI multiplies our advocacy impact exponentially',
            dataPoints: [
              '325% increase in reach',
              '267% more policy wins',
              '71% lower cost per action'
            ],
            narrative: 'The Clean Air Act amendment seemed impossible until our AI-powered campaign identified 50,000 constituents in key districts who cared deeply but weren\'t engaged. Within 48 hours, they generated 35,000 calls to Congress. The bill passed by 3 votes. This is how AI transforms advocacy.',
            callToAction: 'Fund our next-gen AI advocacy platform to scale nationwide'
          },
          {
            audience: 'Coalition Partners',
            keyMessage: 'Join us in revolutionizing environmental advocacy',
            dataPoints: [
              '10x faster campaign deployment',
              '42% action conversion rate',
              '200 organizations already benefiting'
            ],
            narrative: 'When wildfire smoke blanketed the midwest, our AI platform created targeted campaigns for 15 cities in 2 hours - what used to take 2 weeks. Each message was localized, compelling, and effective. Partners using our shared platform see 3x better results.',
            callToAction: 'Access our AI tools to amplify your advocacy'
          }
        ],
        improvementPlan: [
          {
            area: 'Predictive Modeling',
            currentState: 'Basic trend analysis',
            targetState: 'AI predicts policy outcomes',
            actions: [
              'Gather historical policy data',
              'Train ML models on outcomes',
              'Test predictions in real campaigns',
              'Refine based on results'
            ],
            timeline: '6 months',
            success: 'Accurately predict policy success probability'
          },
          {
            area: 'Cross-Campaign Learning',
            currentState: 'Siloed campaign data',
            targetState: 'AI learns across all campaigns',
            actions: [
              'Create unified data platform',
              'Implement transfer learning',
              'Build insight repository',
              'Automate best practice application'
            ],
            timeline: '9 months',
            success: 'Each campaign builds on all previous learnings'
          }
        ]
      })
    };

    const key = `${organizationType}_${missionArea}`;
    const template = templates[key] || templates.direct_service_education;
    
    return template();
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  };

  const getTrendColor = (trend: string, metric: string) => {
    const positiveWhenUp = !metric.toLowerCase().includes('cost') && 
                          !metric.toLowerCase().includes('turnover') &&
                          !metric.toLowerCase().includes('time');
    
    if (trend === 'up') {
      return positiveWhenUp ? 'text-green-600' : 'text-red-600';
    } else if (trend === 'down') {
      return positiveWhenUp ? 'text-red-600' : 'text-green-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Impact Measurement Framework
          </CardTitle>
          <p className="text-sm text-gray-600">
            Design comprehensive metrics to demonstrate AI transformation impact
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Type</label>
              <Select value={organizationType} onValueChange={setOrganizationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Primary approach" />
                </SelectTrigger>
                <SelectContent>
                  {orgTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Mission Area</label>
              <Select value={missionArea} onValueChange={setMissionArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Focus area" />
                </SelectTrigger>
                <SelectContent>
                  {missionAreas.map((area) => (
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

          <div>
            <label className="block text-sm font-medium mb-2">Current Metrics Sophistication</label>
            <Select value={currentMetrics} onValueChange={setCurrentMetrics}>
              <SelectTrigger>
                <SelectValue placeholder="How do you measure impact now?" />
              </SelectTrigger>
              <SelectContent>
                {metricsLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Usage Level</label>
            <Select value={aiUsageLevel} onValueChange={setAiUsageLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Current AI adoption stage" />
              </SelectTrigger>
              <SelectContent>
                {aiLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateFramework} 
            disabled={isGenerating || !organizationType || !missionArea || !currentMetrics || !aiUsageLevel}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                Building Impact Framework...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Create Framework
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {framework && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Impact Measurement Framework</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {framework.organizationProfile.type} • {framework.organizationProfile.aiMaturity} AI Maturity
                  </p>
                </div>
                <Badge variant="secondary">
                  {framework.organizationProfile.missionFocus}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impact Model: Theory of Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {framework.impactModel.map((level, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-3 text-indigo-900">{level.level}</h4>
                    <div className="space-y-3">
                      {level.metrics.map((metric, i) => (
                        <div key={i} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium">{metric.metric}</h5>
                              <p className="text-sm text-gray-600">{metric.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {metric.category}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Formula:</span>
                              <p className="text-gray-600">{metric.formula}</p>
                            </div>
                            <div>
                              <span className="font-medium">Source:</span>
                              <p className="text-gray-600">{metric.dataSource}</p>
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span>
                              <p className="text-gray-600">{metric.frequency}</p>
                            </div>
                            <div>
                              <span className="font-medium">Target:</span>
                              <p className="text-gray-600">{metric.target}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {level.relationships.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-xs font-medium text-blue-900 mb-1">Relationships:</p>
                        <div className="space-y-1">
                          {level.relationships.map((rel, i) => (
                            <p key={i} className="text-xs text-blue-700">• {rel}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                AI Transformation Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {framework.baselineData.map((data, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">{data.metric}</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Before AI:</span>
                        <span>{data.preAI}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium">{data.current}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className={`text-lg font-bold ${getTrendColor(data.trend, data.metric)}`}>
                          {data.improvement}
                        </span>
                        <span className="text-2xl">{getTrendIcon(data.trend)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impact Dashboard Design</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.dashboardDesign.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">{section.section}</h4>
                    <p className="text-sm text-gray-600 mb-3">{section.purpose}</p>
                    
                    <div className="space-y-2 mb-3">
                      {section.visualizations.map((viz, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {viz.type}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-gray-700">{viz.metric}</p>
                            <p className="text-xs text-gray-500">
                              Updates: {viz.updateFrequency} • {viz.interpretation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {section.insights.length > 0 && (
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-xs font-medium text-green-900 mb-1">Key Insights:</p>
                        {section.insights.map((insight, i) => (
                          <p key={i} className="text-xs text-green-700">• {insight}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-600" />
                Impact Storytelling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.storytelling.map((story, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">For: {story.audience}</h4>
                      <Badge variant="secondary">{story.keyMessage}</Badge>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Data Points:</p>
                      <div className="flex flex-wrap gap-2">
                        {story.dataPoints.map((point, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded mb-3">
                      <p className="text-sm text-gray-700 italic">"{story.narrative}"</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-medium text-purple-900">{story.callToAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Continuous Improvement Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {framework.improvementPlan.map((improvement, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-medium mb-2">{improvement.area}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Current:</span> {improvement.currentState}
                      </div>
                      <div>
                        <span className="text-gray-600">Target:</span> {improvement.targetState}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Actions:</p>
                        <ul className="space-y-1">
                          {improvement.actions.map((action, i) => (
                            <li key={i} className="text-xs text-gray-600">• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <Badge variant="outline">Timeline: {improvement.timeline}</Badge>
                        <span className="text-gray-600">Success: {improvement.success}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <BarChart3 className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Measurement Best Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                    <li>Start measuring before AI implementation for baselines</li>
                    <li>Focus on outcomes, not just outputs</li>
                    <li>Use both quantitative and qualitative data</li>
                    <li>Share impact stories alongside metrics</li>
                    <li>Iterate your metrics as you learn</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">ROI Calculation Tip:</p>
                  <p>Value of outcomes achieved ÷ Total AI investment = ROI multiplier. 
                  Include both financial and social returns in your calculations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};