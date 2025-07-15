import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Calendar,
  Users,
  MessageCircle,
  BarChart3,
  Zap,
  Heart,
  Star,
  AlertTriangle,
  Info,
  Sparkles,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AIService } from '@/services/aiService';

// Content strategy types
interface ContentStrategy {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  tactics: ContentTactic[];
  timeline: ContentTimeline;
  channels: ContentChannel[];
  metrics: ContentMetric[];
  personalizationLevel: 'basic' | 'intermediate' | 'advanced';
  expectedOutcomes: string[];
  resources: string[];
  bestPractices: string[];
  commonPitfalls: string[];
  successStories: string[];
}

interface ContentTactic {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  personalizedElements: string[];
  examples: string[];
}

interface ContentTimeline {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

interface ContentChannel {
  id: string;
  name: string;
  effectiveness: number;
  reach: number;
  engagement: number;
  cost: 'low' | 'medium' | 'high';
  personalizedFeatures: string[];
}

interface ContentMetric {
  id: string;
  name: string;
  description: string;
  target: string;
  measurement: string;
  importance: 'high' | 'medium' | 'low';
}

interface PathAwareContentStrategyProps {
  audience: string;
  purpose: string;
  goal: string;
  context: string;
  onStrategySelect: (strategy: ContentStrategy) => void;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
}

// Generate content strategies based on path
const generateContentStrategies = (
  audience: string, 
  purpose: string, 
  goal: string, 
  context: string,
  userExperience: string = 'intermediate'
): ContentStrategy[] => {
  const strategies: ContentStrategy[] = [];

  // Major Donors + Fundraising + Acquire
  if (audience === 'major-donors' && purpose === 'fundraising' && goal === 'acquire') {
    strategies.push({
      id: 'major-donor-acquisition',
      name: 'Major Donor Acquisition Strategy',
      description: 'Comprehensive approach to identifying and cultivating high-value donors',
      objectives: [
        'Identify potential major donors',
        'Build meaningful relationships',
        'Demonstrate transformational impact',
        'Secure significant gifts',
        'Create long-term partnerships'
      ],
      tactics: [
        {
          id: 'prospect-research',
          name: 'Prospect Research & Identification',
          description: 'Use wealth screening and behavioral analysis to identify potential major donors',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          personalizedElements: ['wealth indicators', 'giving history', 'interests alignment'],
          examples: [
            'Analyze donor database for upgrade potential',
            'Research board connections and referrals',
            'Track event attendance and engagement'
          ]
        },
        {
          id: 'personalized-cultivation',
          name: 'Personalized Cultivation Journey',
          description: 'Create unique touchpoints based on donor interests and capacity',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          personalizedElements: ['interest areas', 'communication preferences', 'giving capacity'],
          examples: [
            'Customized impact presentations',
            'Exclusive behind-the-scenes tours',
            'Personal meetings with program beneficiaries'
          ]
        },
        {
          id: 'compelling-case',
          name: 'Compelling Case Development',
          description: 'Craft tailored cases for support that resonate with individual donors',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['donor values', 'impact preferences', 'recognition needs'],
          examples: [
            'Create donor-specific impact scenarios',
            'Develop naming opportunity packages',
            'Design legacy giving options'
          ]
        }
      ],
      timeline: {
        immediate: [
          'Conduct prospect research',
          'Develop donor profiles',
          'Create personalized outreach plan'
        ],
        shortTerm: [
          'Initiate cultivation activities',
          'Schedule donor meetings',
          'Implement stewardship program'
        ],
        longTerm: [
          'Build lasting relationships',
          'Secure major gifts',
          'Develop donor advisory roles'
        ]
      },
      channels: [
        {
          id: 'personal-meetings',
          name: 'Personal Meetings',
          effectiveness: 95,
          reach: 20,
          engagement: 98,
          cost: 'high',
          personalizedFeatures: ['customized agenda', 'relevant materials', 'follow-up actions']
        },
        {
          id: 'personalized-letters',
          name: 'Personalized Letters',
          effectiveness: 85,
          reach: 100,
          engagement: 75,
          cost: 'medium',
          personalizedFeatures: ['handwritten notes', 'specific impact stories', 'tailored asks']
        },
        {
          id: 'exclusive-events',
          name: 'Exclusive Events',
          effectiveness: 90,
          reach: 50,
          engagement: 85,
          cost: 'high',
          personalizedFeatures: ['curated guest lists', 'personalized programs', 'VIP experiences']
        }
      ],
      metrics: [
        {
          id: 'identification-rate',
          name: 'Prospect Identification Rate',
          description: 'Number of qualified prospects identified per month',
          target: '5-10 per month',
          measurement: 'Monthly tracking',
          importance: 'high'
        },
        {
          id: 'engagement-score',
          name: 'Donor Engagement Score',
          description: 'Composite score of donor interactions and responses',
          target: '80+ average',
          measurement: 'Quarterly assessment',
          importance: 'high'
        },
        {
          id: 'conversion-rate',
          name: 'Cultivation to Gift Conversion',
          description: 'Percentage of cultivated prospects who make major gifts',
          target: '25-35%',
          measurement: 'Annual review',
          importance: 'high'
        }
      ],
      personalizationLevel: 'advanced',
      expectedOutcomes: [
        'Identified pipeline of 50+ qualified prospects',
        'Increased average gift size by 40%',
        'Secured 3-5 major gifts per quarter',
        'Improved donor retention rate to 85%'
      ],
      resources: [
        'Prospect research tools',
        'CRM system with wealth screening',
        'Dedicated major gifts officer',
        'Board members as volunteers'
      ],
      bestPractices: [
        'Research thoroughly before any outreach',
        'Focus on donor interests and values',
        'Provide exceptional stewardship',
        'Maintain regular, meaningful contact'
      ],
      commonPitfalls: [
        'Rushing to ask without proper cultivation',
        'Using one-size-fits-all approaches',
        'Neglecting stewardship after the gift',
        'Failing to engage other family members'
      ],
      successStories: [
        'Art museum doubled major gift pipeline through personalized cultivation',
        'Food bank secured $500K gift through strategic donor engagement',
        'Education nonprofit built $2M capital campaign with relationship focus'
      ]
    });
  }

  // Monthly Donors + Fundraising + Retain
  if (audience === 'monthly-donors' && purpose === 'fundraising' && goal === 'retain') {
    strategies.push({
      id: 'monthly-donor-retention',
      name: 'Monthly Donor Retention Strategy',
      description: 'Strengthen relationships with recurring donors to maximize lifetime value',
      objectives: [
        'Reduce monthly donor churn',
        'Increase donor lifetime value',
        'Strengthen donor connection',
        'Encourage gift upgrades',
        'Build donor community'
      ],
      tactics: [
        {
          id: 'impact-storytelling',
          name: 'Continuous Impact Storytelling',
          description: 'Show donors the cumulative impact of their monthly giving',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['cumulative impact', 'giving anniversary', 'donor tenure'],
          examples: [
            'Monthly impact updates with personal touch',
            'Anniversary celebrations of giving journey',
            'Cumulative impact visualizations'
          ]
        },
        {
          id: 'preference-management',
          name: 'Communication Preference Management',
          description: 'Tailor communication frequency and channels to donor preferences',
          priority: 'high',
          effort: 'low',
          impact: 'medium',
          personalizedElements: ['communication preferences', 'frequency settings', 'channel choices'],
          examples: [
            'Opt-in communication preferences',
            'Customizable newsletter frequency',
            'Multi-channel preference centers'
          ]
        },
        {
          id: 'community-building',
          name: 'Donor Community Building',
          description: 'Create sense of belonging among monthly donors',
          priority: 'medium',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['donor interests', 'location', 'giving level'],
          examples: [
            'Monthly donor Facebook group',
            'Local monthly donor meetups',
            'Exclusive volunteer opportunities'
          ]
        }
      ],
      timeline: {
        immediate: [
          'Audit current donor communications',
          'Segment donors by preferences',
          'Launch impact tracking system'
        ],
        shortTerm: [
          'Implement preference management',
          'Create monthly impact content',
          'Launch donor community initiatives'
        ],
        longTerm: [
          'Optimize based on engagement data',
          'Develop upgrade pathways',
          'Build donor advisory programs'
        ]
      },
      channels: [
        {
          id: 'email-newsletters',
          name: 'Personalized Email Newsletters',
          effectiveness: 78,
          reach: 95,
          engagement: 65,
          cost: 'low',
          personalizedFeatures: ['donor name', 'giving history', 'impact stories', 'local content']
        },
        {
          id: 'social-media',
          name: 'Social Media Communities',
          effectiveness: 65,
          reach: 80,
          engagement: 85,
          cost: 'low',
          personalizedFeatures: ['interest-based groups', 'local connections', 'peer recognition']
        },
        {
          id: 'text-messages',
          name: 'Text Message Updates',
          effectiveness: 85,
          reach: 70,
          engagement: 90,
          cost: 'low',
          personalizedFeatures: ['opt-in preferences', 'timing customization', 'urgent updates']
        }
      ],
      metrics: [
        {
          id: 'retention-rate',
          name: 'Monthly Donor Retention Rate',
          description: 'Percentage of monthly donors who continue giving',
          target: '80%+ annually',
          measurement: 'Monthly tracking',
          importance: 'high'
        },
        {
          id: 'engagement-rate',
          name: 'Communication Engagement Rate',
          description: 'Email open rates, click-through rates, and social engagement',
          target: '25%+ click-through',
          measurement: 'Monthly analysis',
          importance: 'high'
        },
        {
          id: 'upgrade-rate',
          name: 'Gift Upgrade Rate',
          description: 'Percentage of donors who increase their monthly giving',
          target: '15%+ annually',
          measurement: 'Quarterly review',
          importance: 'medium'
        }
      ],
      personalizationLevel: 'intermediate',
      expectedOutcomes: [
        'Reduced churn rate by 25%',
        'Increased average monthly gift by 15%',
        'Improved email engagement by 30%',
        'Built active donor community of 500+ members'
      ],
      resources: [
        'Email marketing platform',
        'Social media management tools',
        'Donor database with preferences',
        'Content creation team'
      ],
      bestPractices: [
        'Segment donors by engagement level',
        'Personalize all communications',
        'Celebrate donor milestones',
        'Provide easy preference management'
      ],
      commonPitfalls: [
        'Over-communicating with donors',
        'Generic, impersonal messages',
        'Ignoring donor preferences',
        'Failing to show cumulative impact'
      ],
      successStories: [
        'Animal shelter increased retention to 85% through personalized monthly updates',
        'Environmental nonprofit grew monthly donor base by 40% with community building',
        'Health charity reduced churn by 30% through preference management'
      ]
    });
  }

  // Volunteers + Programs + Engage
  if (audience === 'volunteers' && purpose === 'programs' && goal === 'engage') {
    strategies.push({
      id: 'volunteer-engagement',
      name: 'Volunteer Engagement Strategy',
      description: 'Maximize volunteer satisfaction, retention, and program impact',
      objectives: [
        'Increase volunteer retention',
        'Improve volunteer satisfaction',
        'Enhance program delivery',
        'Build volunteer leadership',
        'Create volunteer advocates'
      ],
      tactics: [
        {
          id: 'skill-matching',
          name: 'Skills-Based Volunteer Matching',
          description: 'Match volunteers with opportunities that utilize their skills and interests',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['skills inventory', 'interest areas', 'availability', 'experience level'],
          examples: [
            'Professional skills assessments',
            'Interest-based opportunity matching',
            'Flexible scheduling options'
          ]
        },
        {
          id: 'recognition-program',
          name: 'Personalized Recognition Program',
          description: 'Acknowledge volunteer contributions in meaningful ways',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['recognition preferences', 'contribution type', 'tenure', 'impact level'],
          examples: [
            'Customized appreciation certificates',
            'Volunteer spotlight features',
            'Milestone celebration events'
          ]
        },
        {
          id: 'development-opportunities',
          name: 'Volunteer Development Opportunities',
          description: 'Provide growth and learning opportunities for volunteers',
          priority: 'medium',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['career goals', 'skill gaps', 'leadership potential', 'interests'],
          examples: [
            'Skills-based training programs',
            'Leadership development tracks',
            'Cross-program exposure'
          ]
        }
      ],
      timeline: {
        immediate: [
          'Conduct volunteer skills assessment',
          'Review current recognition practices',
          'Survey volunteer satisfaction'
        ],
        shortTerm: [
          'Implement skills-based matching',
          'Launch recognition program',
          'Develop training curricula'
        ],
        longTerm: [
          'Build volunteer leadership pipeline',
          'Create volunteer advisory board',
          'Establish volunteer mentorship program'
        ]
      },
      channels: [
        {
          id: 'volunteer-portal',
          name: 'Volunteer Management Portal',
          effectiveness: 85,
          reach: 100,
          engagement: 75,
          cost: 'medium',
          personalizedFeatures: ['personal dashboard', 'opportunity matching', 'progress tracking']
        },
        {
          id: 'group-communications',
          name: 'Volunteer Group Communications',
          effectiveness: 80,
          reach: 90,
          engagement: 85,
          cost: 'low',
          personalizedFeatures: ['team messaging', 'event updates', 'recognition posts']
        },
        {
          id: 'one-on-one-meetings',
          name: 'Regular Check-in Meetings',
          effectiveness: 95,
          reach: 30,
          engagement: 95,
          cost: 'high',
          personalizedFeatures: ['individual feedback', 'goal setting', 'career development']
        }
      ],
      metrics: [
        {
          id: 'volunteer-retention',
          name: 'Volunteer Retention Rate',
          description: 'Percentage of volunteers who continue for 12+ months',
          target: '75%+ annually',
          measurement: 'Quarterly tracking',
          importance: 'high'
        },
        {
          id: 'satisfaction-score',
          name: 'Volunteer Satisfaction Score',
          description: 'Average satisfaction rating from volunteer surveys',
          target: '4.5/5.0',
          measurement: 'Semi-annual surveys',
          importance: 'high'
        },
        {
          id: 'hours-contributed',
          name: 'Total Volunteer Hours',
          description: 'Total hours contributed by volunteer program',
          target: '20% annual increase',
          measurement: 'Monthly tracking',
          importance: 'medium'
        }
      ],
      personalizationLevel: 'intermediate',
      expectedOutcomes: [
        'Increased volunteer retention by 30%',
        'Improved satisfaction scores to 4.5/5',
        'Doubled volunteer leadership pipeline',
        'Achieved 95% volunteer program utilization'
      ],
      resources: [
        'Volunteer management software',
        'Skills assessment tools',
        'Training materials and venues',
        'Recognition budget and materials'
      ],
      bestPractices: [
        'Match volunteers to their strengths',
        'Provide regular feedback and recognition',
        'Offer growth and development opportunities',
        'Create meaningful volunteer experiences'
      ],
      commonPitfalls: [
        'Underutilizing volunteer skills',
        'Lack of recognition and appreciation',
        'Poor communication and coordination',
        'Inadequate training and support'
      ],
      successStories: [
        'Literacy program increased volunteer retention to 85% through skills matching',
        'Food bank doubled volunteer capacity with recognition program',
        'Youth organization built 50+ volunteer leaders through development program'
      ]
    });
  }

  // Default strategy if no specific match
  if (strategies.length === 0) {
    strategies.push({
      id: 'general-engagement',
      name: 'General Engagement Strategy',
      description: 'Flexible approach adaptable to various audiences and purposes',
      objectives: [
        'Build audience awareness',
        'Increase engagement levels',
        'Drive desired actions',
        'Strengthen relationships',
        'Measure and optimize'
      ],
      tactics: [
        {
          id: 'content-personalization',
          name: 'Content Personalization',
          description: 'Tailor content to audience interests and behaviors',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          personalizedElements: ['interests', 'demographics', 'engagement history', 'preferences'],
          examples: [
            'Dynamic content based on user behavior',
            'Personalized email subject lines',
            'Customized landing pages'
          ]
        },
        {
          id: 'multi-channel-approach',
          name: 'Multi-Channel Approach',
          description: 'Reach audience through their preferred channels',
          priority: 'high',
          effort: 'high',
          impact: 'medium',
          personalizedElements: ['channel preferences', 'timing', 'frequency', 'format'],
          examples: [
            'Email, social media, and direct mail integration',
            'Mobile-optimized content',
            'Cross-channel messaging coordination'
          ]
        }
      ],
      timeline: {
        immediate: [
          'Analyze current audience data',
          'Identify key messaging themes',
          'Set up tracking systems'
        ],
        shortTerm: [
          'Launch personalized campaigns',
          'Test different approaches',
          'Gather feedback and iterate'
        ],
        longTerm: [
          'Optimize based on performance data',
          'Scale successful tactics',
          'Build long-term relationships'
        ]
      },
      channels: [
        {
          id: 'email',
          name: 'Email Marketing',
          effectiveness: 70,
          reach: 85,
          engagement: 65,
          cost: 'low',
          personalizedFeatures: ['name', 'interests', 'past behavior', 'location']
        },
        {
          id: 'social-media',
          name: 'Social Media',
          effectiveness: 60,
          reach: 80,
          engagement: 75,
          cost: 'low',
          personalizedFeatures: ['targeted ads', 'interest-based content', 'community building']
        }
      ],
      metrics: [
        {
          id: 'engagement-rate',
          name: 'Overall Engagement Rate',
          description: 'Composite metric of all engagement activities',
          target: '20%+ improvement',
          measurement: 'Monthly review',
          importance: 'high'
        }
      ],
      personalizationLevel: 'basic',
      expectedOutcomes: [
        'Increased engagement by 25%',
        'Improved conversion rates',
        'Better audience understanding',
        'Enhanced content effectiveness'
      ],
      resources: [
        'Content management system',
        'Analytics tools',
        'Basic personalization software'
      ],
      bestPractices: [
        'Start with basic personalization',
        'Test and iterate continuously',
        'Focus on quality over quantity',
        'Measure everything'
      ],
      commonPitfalls: [
        'Trying to do too much at once',
        'Neglecting data analysis',
        'Inconsistent messaging',
        'Ignoring audience feedback'
      ],
      successStories: [
        'Nonprofit increased email engagement by 40% through personalization',
        'Community organization doubled social media following with targeted content'
      ]
    });
  }

  return strategies;
};

export const PathAwareContentStrategy: React.FC<PathAwareContentStrategyProps> = ({
  audience,
  purpose,
  goal,
  context,
  onStrategySelect,
  userExperience = 'intermediate'
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<ContentStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiEnhancement, setAiEnhancement] = useState<string>('');

  const aiService = AIService.getInstance();

  // Generate strategies based on path
  const availableStrategies = useMemo(() => {
    return generateContentStrategies(audience, purpose, goal, context, userExperience);
  }, [audience, purpose, goal, context, userExperience]);

  // Auto-select first strategy
  useEffect(() => {
    if (availableStrategies.length > 0 && !selectedStrategy) {
      setSelectedStrategy(availableStrategies[0]);
    }
  }, [availableStrategies, selectedStrategy]);

  // Generate AI enhancement
  const generateAIEnhancement = async (strategy: ContentStrategy) => {
    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Enhance this content strategy for ${audience} in ${purpose} with goal to ${goal} in ${context} context:

Strategy: ${strategy.name}
Description: ${strategy.description}

Provide 3 specific, actionable recommendations to improve this strategy based on current best practices and emerging trends. Focus on practical implementation steps.`,
        context: "You are a content strategy expert with deep knowledge of nonprofit communications and digital marketing.",
        temperature: 0.7
      });

      setAiEnhancement(response.content);
    } catch (error) {
      console.error('Error generating AI enhancement:', error);
      setAiEnhancement('AI enhancement temporarily unavailable. The strategy recommendations above provide comprehensive guidance for implementation.');
    }
    setIsGenerating(false);
  };

  // Handle strategy selection
  const handleStrategySelect = (strategy: ContentStrategy) => {
    setSelectedStrategy(strategy);
    generateAIEnhancement(strategy);
  };

  // Calculate strategy score
  const calculateStrategyScore = (strategy: ContentStrategy) => {
    const weights = {
      tactics: 0.3,
      channels: 0.2,
      metrics: 0.2,
      personalization: 0.15,
      resources: 0.15
    };

    const tacticsScore = (strategy.tactics.length / 5) * 100;
    const channelsScore = (strategy.channels.length / 4) * 100;
    const metricsScore = (strategy.metrics.length / 5) * 100;
    const personalizationScore = strategy.personalizationLevel === 'advanced' ? 100 : 
                                   strategy.personalizationLevel === 'intermediate' ? 75 : 50;
    const resourcesScore = (strategy.resources.length / 6) * 100;

    return Math.round(
      tacticsScore * weights.tactics +
      channelsScore * weights.channels +
      metricsScore * weights.metrics +
      personalizationScore * weights.personalization +
      resourcesScore * weights.resources
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-500 text-white">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Content Strategy Recommendations</h1>
            <p className="text-muted-foreground">
              Personalized strategies for {audience} • {purpose} • {goal}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableStrategies.map((strategy) => {
          const score = calculateStrategyScore(strategy);
          const isSelected = selectedStrategy?.id === strategy.id;
          
          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all h-full ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'hover:border-muted-foreground hover:shadow-md'
                }`}
                onClick={() => handleStrategySelect(strategy)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={strategy.personalizationLevel === 'advanced' ? 'default' : 'secondary'}
                      >
                        {strategy.personalizationLevel}
                      </Badge>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{score}%</div>
                      <div className="text-xs text-muted-foreground">Strategy Score</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Key Objectives:</p>
                      <div className="space-y-1">
                        {strategy.objectives.slice(0, 3).map((objective, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            {objective}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Expected Outcomes:</p>
                      <div className="space-y-1">
                        {strategy.expectedOutcomes.slice(0, 2).map((outcome, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="w-3 h-3" />
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Strategy Details */}
      {selectedStrategy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedStrategy.name}</CardTitle>
                <CardDescription>{selectedStrategy.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {calculateStrategyScore(selectedStrategy)}%
                </div>
                <div className="text-sm text-muted-foreground">Completeness Score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tactics" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="tactics">Tactics</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="ai-enhancement">AI Enhancement</TabsTrigger>
              </TabsList>

              <TabsContent value="tactics" className="space-y-4">
                <div className="grid gap-4">
                  {selectedStrategy.tactics.map((tactic) => (
                    <Card key={tactic.id} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tactic.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={tactic.priority === 'high' ? 'default' : 'secondary'}>
                              {tactic.priority} priority
                            </Badge>
                            <Badge variant="outline">{tactic.effort} effort</Badge>
                            <Badge variant="outline">{tactic.impact} impact</Badge>
                          </div>
                        </div>
                        <CardDescription>{tactic.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium mb-2">Personalized Elements:</p>
                            <div className="flex flex-wrap gap-2">
                              {tactic.personalizedElements.map((element, index) => (
                                <Badge key={index} variant="secondary">
                                  {element}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Implementation Examples:</p>
                            <div className="space-y-1">
                              {tactic.examples.map((example, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="grid gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-red-500" />
                      <h3 className="font-semibold">Immediate Actions (0-30 days)</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedStrategy.timeline.immediate.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold">Short-term Goals (1-3 months)</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedStrategy.timeline.shortTerm.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold">Long-term Vision (3-12 months)</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedStrategy.timeline.longTerm.map((vision, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {vision}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="channels" className="space-y-4">
                <div className="grid gap-4">
                  {selectedStrategy.channels.map((channel) => (
                    <Card key={channel.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                          <Badge variant={channel.cost === 'low' ? 'default' : 'secondary'}>
                            {channel.cost} cost
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{channel.effectiveness}%</div>
                              <div className="text-sm text-muted-foreground">Effectiveness</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{channel.reach}%</div>
                              <div className="text-sm text-muted-foreground">Reach</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{channel.engagement}%</div>
                              <div className="text-sm text-muted-foreground">Engagement</div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Personalization Features:</p>
                            <div className="flex flex-wrap gap-2">
                              {channel.personalizedFeatures.map((feature, index) => (
                                <Badge key={index} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid gap-4">
                  {selectedStrategy.metrics.map((metric) => (
                    <Card key={metric.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{metric.name}</CardTitle>
                          <Badge variant={metric.importance === 'high' ? 'default' : 'secondary'}>
                            {metric.importance} importance
                          </Badge>
                        </div>
                        <CardDescription>{metric.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm">Target</p>
                            <p className="text-lg font-bold text-primary">{metric.target}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Measurement</p>
                            <p className="text-lg font-bold text-primary">{metric.measurement}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Best Practices
                    </h3>
                    <div className="space-y-2">
                      {selectedStrategy.bestPractices.map((practice, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          {practice}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Common Pitfalls
                    </h3>
                    <div className="space-y-2">
                      {selectedStrategy.commonPitfalls.map((pitfall, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          {pitfall}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Success Stories
                    </h3>
                    <div className="space-y-3">
                      {selectedStrategy.successStories.map((story, index) => (
                        <Alert key={index}>
                          <Info className="h-4 w-4" />
                          <AlertDescription>{story}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-enhancement" className="space-y-4">
                <div className="text-center mb-4">
                  <Button
                    onClick={() => generateAIEnhancement(selectedStrategy)}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        Generating AI Enhancement...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Enhancement
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {aiEnhancement && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI-Enhanced Recommendations:</strong>
                          <p className="mt-2 whitespace-pre-wrap">{aiEnhancement}</p>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {selectedStrategy && (
        <div className="flex justify-center">
          <Button
            onClick={() => onStrategySelect(selectedStrategy)}
            className="bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
          >
            <Target className="w-4 h-4 mr-2" />
            Use This Strategy
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PathAwareContentStrategy;