import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Rocket, Target, Lightbulb, Map, Zap, TrendingUp, Users, Star } from 'lucide-react';
import { toast } from 'sonner';

interface InnovationRoadmapProps {
  onComplete?: () => void;
}

interface InnovationPhase {
  phase: string;
  timeline: string;
  focus: string;
  initiatives: {
    name: string;
    description: string;
    impact: string;
    resources: string;
    dependencies: string[];
  }[];
  capabilities: string[];
  milestones: string[];
  risks: string[];
}

interface InnovationRoadmap {
  vision: {
    statement: string;
    timeHorizon: string;
    transformationLevel: string;
    differentiators: string[];
  };
  currentState: {
    strengths: string[];
    gaps: string[];
    opportunities: string[];
    readinessScore: number;
  };
  phases: InnovationPhase[];
  innovationPortfolio: {
    horizon: string;
    description: string;
    examples: {
      initiative: string;
      technology: string;
      expectedImpact: string;
      timeframe: string;
    }[];
    allocation: string;
  }[];
  enablers: {
    category: string;
    requirements: string[];
    investments: string[];
    timeline: string;
  }[];
  successMetrics: {
    category: string;
    metrics: {
      metric: string;
      baseline: string;
      target: string;
      measurement: string;
    }[];
  }[];
  nextSteps: {
    priority: number;
    action: string;
    owner: string;
    deadline: string;
    outcome: string;
  }[];
}

export const InnovationRoadmap: React.FC<InnovationRoadmapProps> = ({ onComplete }) => {
  const [ambitionLevel, setAmbitionLevel] = useState<string>('');
  const [timeHorizon, setTimeHorizon] = useState<string>('');
  const [focusAreas, setFocusAreas] = useState<string>('');
  const [constraints, setConstraints] = useState<string>('');
  const [roadmap, setRoadmap] = useState<InnovationRoadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const ambitionLevels = [
    { value: 'incremental', label: 'Incremental Innovation', description: 'Steady improvements' },
    { value: 'substantial', label: 'Substantial Transformation', description: 'Significant changes' },
    { value: 'breakthrough', label: 'Breakthrough Innovation', description: 'Radical transformation' },
    { value: 'moonshot', label: 'Moonshot Vision', description: 'Revolutionary impact' }
  ];

  const timeHorizons = [
    { value: '1year', label: '1 Year', description: 'Quick wins focus' },
    { value: '3year', label: '3 Years', description: 'Strategic transformation' },
    { value: '5year', label: '5 Years', description: 'Long-term vision' },
    { value: '10year', label: '10 Years', description: 'Generational change' }
  ];

  const focusAreaOptions = [
    { value: 'service_delivery', label: 'Service Delivery', description: 'How we serve beneficiaries' },
    { value: 'operational_excellence', label: 'Operational Excellence', description: 'Internal efficiency' },
    { value: 'stakeholder_engagement', label: 'Stakeholder Engagement', description: 'Donor and volunteer relations' },
    { value: 'impact_measurement', label: 'Impact Measurement', description: 'Proving and improving outcomes' },
    { value: 'sector_leadership', label: 'Sector Leadership', description: 'Leading the field' },
    { value: 'revenue_innovation', label: 'Revenue Innovation', description: 'New funding models' }
  ];

  const generateRoadmap = async () => {
    if (!ambitionLevel || !timeHorizon || !focusAreas.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = createInnovationRoadmap();
      setRoadmap(result);
      
      toast.success('Innovation roadmap created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createInnovationRoadmap = (): InnovationRoadmap => {
    const templates: Record<string, () => InnovationRoadmap> = {
      'substantial_3year': () => ({
        vision: {
          statement: 'Become the most technologically advanced nonprofit in our sector, leveraging AI to triple our impact while maintaining the human touch that defines our mission.',
          timeHorizon: '3 Years',
          transformationLevel: 'Substantial Digital & AI Transformation',
          differentiators: [
            'First nonprofit with fully integrated AI operations',
            'Real-time impact measurement and optimization',
            'Predictive intervention capabilities',
            'Open-source innovation sharing with sector'
          ]
        },
        currentState: {
          strengths: [
            'Strong mission alignment and leadership support',
            'Initial AI pilots showing promising results',
            'Engaged and adaptable team',
            'Solid donor relationships'
          ],
          gaps: [
            'Limited technical infrastructure',
            'Data silos across departments',
            'Inconsistent digital skills',
            'No innovation framework'
          ],
          opportunities: [
            'AI tools becoming more accessible',
            'Donors interested in innovation',
            'Staff eager to learn and grow',
            'Sector ready for leadership'
          ],
          readinessScore: 65
        },
        phases: [
          {
            phase: 'Phase 1: Foundation (Months 1-12)',
            timeline: 'Year 1',
            focus: 'Build core infrastructure and capabilities',
            initiatives: [
              {
                name: 'Data Infrastructure Overhaul',
                description: 'Unify all data systems into cloud-based platform',
                impact: 'Enable AI-ready data foundation',
                resources: '$150K investment, IT team expansion',
                dependencies: ['Leadership approval', 'Vendor selection']
              },
              {
                name: 'AI Center of Excellence',
                description: 'Establish dedicated innovation team',
                impact: 'Drive and coordinate all AI initiatives',
                resources: '3 FTEs, training budget',
                dependencies: ['Hiring approval', 'Space allocation']
              },
              {
                name: 'Quick Win AI Pilots',
                description: 'Deploy 5 high-impact AI tools',
                impact: 'Build confidence and demonstrate value',
                resources: '$50K tools budget',
                dependencies: ['Staff training', 'Process mapping']
              }
            ],
            capabilities: [
              'Basic AI literacy across organization',
              'Unified data platform operational',
              'Innovation governance structure',
              'Initial success stories documented'
            ],
            milestones: [
              'Cloud migration complete',
              'AI CoE operational',
              '100% staff AI-trained',
              '30% efficiency gain in pilot areas'
            ],
            risks: [
              'Technical complexity underestimated',
              'Change resistance from key staff',
              'Budget overruns on infrastructure'
            ]
          },
          {
            phase: 'Phase 2: Acceleration (Months 13-24)',
            timeline: 'Year 2',
            focus: 'Scale successful pilots and launch innovations',
            initiatives: [
              {
                name: 'AI-Powered Service Delivery',
                description: 'Integrate AI into all core programs',
                impact: 'Double program capacity without adding staff',
                resources: '$200K technology, process redesign',
                dependencies: ['Phase 1 infrastructure', 'Program staff buy-in']
              },
              {
                name: 'Predictive Impact Analytics',
                description: 'ML models for outcome prediction',
                impact: 'Proactive interventions, improved success rates',
                resources: 'Data science partnership',
                dependencies: ['Clean historical data', 'Outcome tracking']
              },
              {
                name: 'Automated Donor Journey',
                description: 'AI-driven donor engagement platform',
                impact: '40% increase in donor retention',
                resources: '$75K platform investment',
                dependencies: ['CRM integration', 'Content library']
              },
              {
                name: 'Innovation Lab Launch',
                description: 'Space for continuous experimentation',
                impact: 'Sustained innovation culture',
                resources: 'Dedicated space, $100K annual budget',
                dependencies: ['Board approval', 'Partnership development']
              }
            ],
            capabilities: [
              'AI integrated into daily operations',
              'Predictive analytics capabilities',
              'Automated workflows across departments',
              'Innovation mindset embedded'
            ],
            milestones: [
              '2x service capacity achieved',
              'Predictive models operational',
              '50% processes automated',
              'Innovation lab generating monthly ideas'
            ],
            risks: [
              'Integration complexity',
              'Staff overwhelm with pace of change',
              'Donor concerns about automation'
            ]
          },
          {
            phase: 'Phase 3: Leadership (Months 25-36)',
            timeline: 'Year 3',
            focus: 'Lead sector transformation and scale impact',
            initiatives: [
              {
                name: 'Open Innovation Platform',
                description: 'Share our AI tools and learnings with sector',
                impact: 'Enable 100+ nonprofits to transform',
                resources: '$150K platform development',
                dependencies: ['Proven tool suite', 'Documentation']
              },
              {
                name: 'AI Ethics Framework',
                description: 'Develop and promote sector standards',
                impact: 'Shape responsible AI use across sector',
                resources: 'Research partnership, convenings',
                dependencies: ['Thought leadership credibility', 'Sector relationships']
              },
              {
                name: 'Next-Gen Service Models',
                description: 'Entirely new AI-enabled programs',
                impact: 'Address previously impossible challenges',
                resources: '$300K innovation fund',
                dependencies: ['Mature AI capabilities', 'Risk tolerance']
              },
              {
                name: 'Revenue Innovation Lab',
                description: 'AI-driven funding models',
                impact: 'Sustainable growth, reduced dependency',
                resources: 'Strategic partnerships',
                dependencies: ['Donor innovation appetite', 'Regulatory clarity']
              }
            ],
            capabilities: [
              'Recognized AI leader in sector',
              'Platform supporting other nonprofits',
              'Cutting-edge service delivery',
              'Sustainable innovation model'
            ],
            milestones: [
              '100 nonprofits using our tools',
              'National recognition for innovation',
              '3x impact from baseline',
              'New revenue streams operational'
            ],
            risks: [
              'Overextension of resources',
              'Mission drift concerns',
              'Competitive dynamics'
            ]
          }
        ],
        innovationPortfolio: [
          {
            horizon: 'Horizon 1: Core Enhancement (70%)',
            description: 'Improving existing services with AI',
            examples: [
              {
                initiative: 'Smart Scheduling',
                technology: 'AI optimization algorithms',
                expectedImpact: '30% more efficient resource use',
                timeframe: '6 months'
              },
              {
                initiative: 'Automated Reporting',
                technology: 'Natural language generation',
                expectedImpact: 'Save 20 hours/week',
                timeframe: '3 months'
              },
              {
                initiative: 'Chatbot Support',
                technology: 'Conversational AI',
                expectedImpact: '24/7 beneficiary support',
                timeframe: '9 months'
              }
            ],
            allocation: '70% of innovation resources'
          },
          {
            horizon: 'Horizon 2: Emerging Opportunities (20%)',
            description: 'New capabilities and services',
            examples: [
              {
                initiative: 'Predictive Interventions',
                technology: 'Machine learning models',
                expectedImpact: 'Prevent 40% of crises',
                timeframe: '18 months'
              },
              {
                initiative: 'Personalized Programs',
                technology: 'AI recommendation engine',
                expectedImpact: 'Double program effectiveness',
                timeframe: '12 months'
              },
              {
                initiative: 'Virtual Reality Training',
                technology: 'VR + AI simulation',
                expectedImpact: 'Scale training 10x',
                timeframe: '24 months'
              }
            ],
            allocation: '20% of innovation resources'
          },
          {
            horizon: 'Horizon 3: Transformational (10%)',
            description: 'Breakthrough innovations',
            examples: [
              {
                initiative: 'AI Program Designer',
                technology: 'Advanced AI systems',
                expectedImpact: 'Create entirely new interventions',
                timeframe: '36 months'
              },
              {
                initiative: 'Autonomous Impact Fund',
                technology: 'AI-driven investment',
                expectedImpact: 'Self-sustaining programs',
                timeframe: '36+ months'
              }
            ],
            allocation: '10% of innovation resources'
          }
        ],
        enablers: [
          {
            category: 'Technology Infrastructure',
            requirements: [
              'Cloud-based data platform',
              'API-first architecture',
              'Robust security framework',
              'Scalable computing resources'
            ],
            investments: [
              '$150K cloud migration',
              '$50K security upgrades',
              '$75K integration platform',
              '$25K/year compute budget'
            ],
            timeline: 'Year 1 priority'
          },
          {
            category: 'Talent & Culture',
            requirements: [
              'AI-literate workforce',
              'Innovation mindset',
              'Continuous learning culture',
              'Technical leadership'
            ],
            investments: [
              '$100K annual training',
              '3 technical hires',
              'Innovation incentives',
              'External partnerships'
            ],
            timeline: 'Ongoing, with Year 1 foundation'
          },
          {
            category: 'Partnerships',
            requirements: [
              'Technology vendors',
              'Academic institutions',
              'Peer nonprofits',
              'Innovation funders'
            ],
            investments: [
              'Relationship building',
              'Pilot funding',
              'Knowledge sharing platforms',
              'Joint ventures'
            ],
            timeline: 'Build throughout journey'
          },
          {
            category: 'Governance',
            requirements: [
              'Innovation framework',
              'Risk management',
              'Ethics guidelines',
              'Success metrics'
            ],
            investments: [
              'Board education',
              'Policy development',
              'Monitoring systems',
              'External advisors'
            ],
            timeline: 'Establish Year 1, evolve ongoing'
          }
        ],
        successMetrics: [
          {
            category: 'Impact Metrics',
            metrics: [
              {
                metric: 'Beneficiaries Served',
                baseline: '10,000/year',
                target: '30,000/year',
                measurement: 'Program database'
              },
              {
                metric: 'Outcome Quality',
                baseline: '70% success rate',
                target: '85% success rate',
                measurement: 'Standardized assessments'
              },
              {
                metric: 'Cost per Outcome',
                baseline: '$1,000',
                target: '$400',
                measurement: 'Financial analysis'
              }
            ]
          },
          {
            category: 'Innovation Metrics',
            metrics: [
              {
                metric: 'AI Tools Deployed',
                baseline: '2',
                target: '25+',
                measurement: 'Technology inventory'
              },
              {
                metric: 'Process Automation',
                baseline: '10%',
                target: '60%',
                measurement: 'Process analysis'
              },
              {
                metric: 'Innovation ROI',
                baseline: 'N/A',
                target: '5:1',
                measurement: 'Investment tracking'
              }
            ]
          },
          {
            category: 'Organizational Metrics',
            metrics: [
              {
                metric: 'Staff Satisfaction',
                baseline: '75%',
                target: '90%',
                measurement: 'Annual survey'
              },
              {
                metric: 'Innovation Culture Score',
                baseline: '2.5/5',
                target: '4.5/5',
                measurement: 'Culture assessment'
              },
              {
                metric: 'Sector Leadership',
                baseline: 'Follower',
                target: 'Recognized leader',
                measurement: 'External recognition'
              }
            ]
          }
        ],
        nextSteps: [
          {
            priority: 1,
            action: 'Form Innovation Steering Committee',
            owner: 'CEO',
            deadline: '30 days',
            outcome: 'Governance structure for innovation journey'
          },
          {
            priority: 2,
            action: 'Conduct Technology Infrastructure Audit',
            owner: 'CTO/IT Lead',
            deadline: '45 days',
            outcome: 'Gap analysis and investment plan'
          },
          {
            priority: 3,
            action: 'Launch AI Literacy Program',
            owner: 'HR Director',
            deadline: '60 days',
            outcome: 'All staff enrolled in training'
          },
          {
            priority: 4,
            action: 'Identify Quick Win Pilots',
            owner: 'Innovation Committee',
            deadline: '60 days',
            outcome: '5 pilots selected and resourced'
          },
          {
            priority: 5,
            action: 'Engage Innovation Funding Partners',
            owner: 'Development Director',
            deadline: '90 days',
            outcome: 'Funding pipeline for Year 1'
          }
        ]
      }),

      'moonshot_10year': () => ({
        vision: {
          statement: 'Eliminate our cause area entirely through AI-powered prevention, early intervention, and systemic change, making our traditional services obsolete.',
          timeHorizon: '10 Years',
          transformationLevel: 'Moonshot - Complete Sector Transformation',
          differentiators: [
            'First to achieve prevention at scale through AI',
            'Created self-improving intervention systems',
            'Transformed from service provider to solution architect',
            'Inspired global replication of approach'
          ]
        },
        currentState: {
          strengths: [
            'Visionary leadership willing to reimagine everything',
            'Strong evidence base for interventions',
            'Collaborative culture',
            'Early AI experimentation success'
          ],
          gaps: [
            'Limited moonshot thinking experience',
            'Traditional funding model constraints',
            'Need for radically different skills',
            'No precedent in sector'
          ],
          opportunities: [
            'AI capabilities advancing exponentially',
            'Growing recognition that incremental change insufficient',
            'New generation of impact investors',
            'Global collaboration possibilities'
          ],
          readinessScore: 45
        },
        phases: [
          {
            phase: 'Phase 1: Paradigm Shift (Years 1-2)',
            timeline: 'Years 1-2',
            focus: 'Reimagine the possible and build foundation',
            initiatives: [
              {
                name: 'Moonshot Vision Lab',
                description: 'Think tank to reimagine sector without current constraints',
                impact: 'Breakthrough strategies identified',
                resources: '$500K, external futurists',
                dependencies: ['Board courage', 'Stakeholder alignment']
              },
              {
                name: 'AI Research Partnerships',
                description: 'Collaborate with leading AI labs',
                impact: 'Access to cutting-edge capabilities',
                resources: 'Research agreements, data sharing',
                dependencies: ['Legal frameworks', 'IP strategies']
              },
              {
                name: 'Causal Model Development',
                description: 'Map all factors contributing to problem',
                impact: 'Identify highest-leverage interventions',
                resources: 'Data science team, research',
                dependencies: ['Cross-sector data access', 'Academic partners']
              }
            ],
            capabilities: [
              'Systems thinking mindset',
              'Research partnerships established',
              'Moonshot culture emerging',
              'Early prototypes developed'
            ],
            milestones: [
              'Moonshot strategy approved',
              '3 research partnerships active',
              'Causal model validated',
              'First breakthrough prototype'
            ],
            risks: [
              'Stakeholder skepticism',
              'Funding traditional work while innovating',
              'Talent recruitment challenges'
            ]
          },
          {
            phase: 'Phase 2: Breakthrough Development (Years 3-5)',
            timeline: 'Years 3-5',
            focus: 'Create transformational solutions',
            initiatives: [
              {
                name: 'Prevention AI Platform',
                description: 'Predict and prevent problems before they occur',
                impact: '50% reduction in new cases',
                resources: '$5M development investment',
                dependencies: ['Proven prediction models', 'Intervention capacity']
              },
              {
                name: 'Autonomous Intervention Systems',
                description: 'Self-optimizing support systems',
                impact: 'Infinitely scalable personalized help',
                resources: '$3M technology, partnerships',
                dependencies: ['Ethical frameworks', 'Regulatory approval']
              },
              {
                name: 'Ecosystem Orchestration Platform',
                description: 'Coordinate all sector actors via AI',
                impact: 'Eliminate duplication, maximize impact',
                resources: '$2M platform, convenings',
                dependencies: ['Sector buy-in', 'Data sharing agreements']
              }
            ],
            capabilities: [
              'World-class AI capabilities',
              'Prevention-first operations',
              'Ecosystem leadership',
              'Continuous innovation engine'
            ],
            milestones: [
              'Prevention platform operational',
              '10x impact improvement demonstrated',
              '50% of sector using our tools',
              'Global recognition achieved'
            ],
            risks: [
              'Technology complexity',
              'Ethical challenges',
              'Resistance from traditional actors'
            ]
          },
          {
            phase: 'Phase 3: Scale & Transform (Years 6-8)',
            timeline: 'Years 6-8',
            focus: 'Achieve systemic change at scale',
            initiatives: [
              {
                name: 'Global Replication Engine',
                description: 'Enable worldwide adoption of approach',
                impact: 'Solutions in 50+ countries',
                resources: '$10M scaling fund',
                dependencies: ['Proven model', 'Global partnerships']
              },
              {
                name: 'Policy Transformation Initiative',
                description: 'Embed AI prevention in government systems',
                impact: 'Structural change in how problems addressed',
                resources: 'Advocacy campaign, demonstrations',
                dependencies: ['Evidence base', 'Political will']
              },
              {
                name: 'Self-Sustaining Impact Model',
                description: 'Generate resources through prevention savings',
                impact: 'Financial sustainability through impact',
                resources: 'Economic modeling, partnerships',
                dependencies: ['Measurement systems', 'Payment models']
              }
            ],
            capabilities: [
              'Global influence network',
              'Policy change expertise',
              'Sustainable impact model',
              'Continuous adaptation'
            ],
            milestones: [
              'Active in 50+ countries',
              '5 national policies changed',
              'Self-sustaining financially',
              '75% problem reduction'
            ],
            risks: [
              'Political resistance',
              'Cultural adaptation needs',
              'Sustainability challenges'
            ]
          },
          {
            phase: 'Phase 4: Mission Achievement (Years 9-10)',
            timeline: 'Years 9-10',
            focus: 'Achieve the impossible',
            initiatives: [
              {
                name: 'Final Mile Solutions',
                description: 'Address last 25% of problem',
                impact: 'Near-complete prevention achieved',
                resources: 'Global coalition resources',
                dependencies: ['All systems operational', 'Full adoption']
              },
              {
                name: 'Legacy Transformation',
                description: 'Evolve organization for new purpose',
                impact: 'Model for sector transformation',
                resources: 'Strategic planning, stakeholder engagement',
                dependencies: ['Mission success', 'Board vision']
              },
              {
                name: 'Knowledge Codification',
                description: 'Document and share everything learned',
                impact: 'Enable others to replicate success',
                resources: 'Documentation, training systems',
                dependencies: ['Complete data', 'Reflection time']
              }
            ],
            capabilities: [
              'Problem essentially solved',
              'Organization transformed',
              'Knowledge transferred',
              'New mission identified'
            ],
            milestones: [
              '90%+ problem prevention',
              'Organization successfully pivoted',
              'Methodology replicated globally',
              'New moonshot identified'
            ],
            risks: [
              'Last mile complexity',
              'Organization identity crisis',
              'Maintaining momentum'
            ]
          }
        ],
        innovationPortfolio: [
          {
            horizon: 'Horizon 1: Current Evolution (20%)',
            description: 'Enhance while transforming',
            examples: [
              {
                initiative: 'AI-Enhanced Services',
                technology: 'Current AI tools',
                expectedImpact: 'Maintain quality during transition',
                timeframe: 'Ongoing'
              }
            ],
            allocation: '20% - Sustain current impact'
          },
          {
            horizon: 'Horizon 2: Transformational (60%)',
            description: 'Build the future systems',
            examples: [
              {
                initiative: 'Prevention AI',
                technology: 'Predictive ML, causal inference',
                expectedImpact: 'Stop problems before they start',
                timeframe: '3-5 years'
              },
              {
                initiative: 'Autonomous Support',
                technology: 'AGI-level assistance',
                expectedImpact: 'Unlimited personalized help',
                timeframe: '5-7 years'
              }
            ],
            allocation: '60% - Core transformation'
          },
          {
            horizon: 'Horizon 3: Moonshot (20%)',
            description: 'Pursue the impossible',
            examples: [
              {
                initiative: 'Societal Immune System',
                technology: 'Distributed AI network',
                expectedImpact: 'Society self-corrects problems',
                timeframe: '8-10 years'
              }
            ],
            allocation: '20% - Revolutionary breakthroughs'
          }
        ],
        enablers: [
          {
            category: 'Visionary Leadership',
            requirements: [
              'Boards willing to obsolete organization',
              'Leaders who think in systems',
              'Courage to fail big',
              'Global perspective'
            ],
            investments: [
              'Leadership transformation program',
              'External visionary advisors',
              'Innovation governance',
              'Risk capital'
            ],
            timeline: 'Immediate and ongoing'
          },
          {
            category: 'Breakthrough Partnerships',
            requirements: [
              'Top AI research labs',
              'Government innovation units',
              'Global philanthropists',
              'Affected communities'
            ],
            investments: [
              'Partnership development',
              'Co-creation frameworks',
              'IP agreements',
              'Trust building'
            ],
            timeline: 'Years 1-3 critical'
          },
          {
            category: 'Moonshot Funding',
            requirements: [
              'Patient capital',
              'Risk-tolerant funders',
              'Outcome-based financing',
              'Government backing'
            ],
            investments: [
              '$50M+ over 10 years',
              'Blended finance models',
              'Innovation bonds',
              'Endowment pivot'
            ],
            timeline: 'Secure in phases'
          }
        ],
        successMetrics: [
          {
            category: 'Moonshot Progress',
            metrics: [
              {
                metric: 'Problem Prevalence',
                baseline: '10M affected',
                target: '<1M affected',
                measurement: 'Population studies'
              },
              {
                metric: 'Prevention Rate',
                baseline: '10%',
                target: '90%+',
                measurement: 'Longitudinal tracking'
              },
              {
                metric: 'System Transformation',
                baseline: '0%',
                target: '100%',
                measurement: 'Adoption metrics'
              }
            ]
          }
        ],
        nextSteps: [
          {
            priority: 1,
            action: 'Moonshot Visioning Summit',
            owner: 'Board + CEO',
            deadline: '60 days',
            outcome: 'Aligned on 10-year vision'
          },
          {
            priority: 2,
            action: 'Recruit Chief Innovation Officer',
            owner: 'Search Committee',
            deadline: '6 months',
            outcome: 'Visionary leader onboard'
          },
          {
            priority: 3,
            action: 'Launch Moonshot Fund Campaign',
            owner: 'Development',
            deadline: '9 months',
            outcome: 'First $10M committed'
          }
        ]
      })
    };

    const key = `${ambitionLevel}_${timeHorizon}`;
    const template = templates[key] || templates.substantial_3year;
    
    return template();
  };

  const getHorizonColor = (horizon: string) => {
    if (horizon.includes('Horizon 1')) return 'text-blue-600';
    if (horizon.includes('Horizon 2')) return 'text-purple-600';
    if (horizon.includes('Horizon 3')) return 'text-pink-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            Innovation Roadmap Builder
          </CardTitle>
          <p className="text-sm text-gray-600">
            Chart your AI-powered transformation journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ambition Level</label>
              <Select value={ambitionLevel} onValueChange={setAmbitionLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="How bold is your vision?" />
                </SelectTrigger>
                <SelectContent>
                  {ambitionLevels.map((level) => (
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
              <label className="block text-sm font-medium mb-2">Time Horizon</label>
              <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                <SelectTrigger>
                  <SelectValue placeholder="Planning timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeHorizons.map((horizon) => (
                    <SelectItem key={horizon.value} value={horizon.value}>
                      <div>
                        <div className="font-medium">{horizon.label}</div>
                        <div className="text-xs text-gray-500">{horizon.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Innovation Focus Areas</label>
            <Textarea
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
              placeholder="What aspects of your work do you want to transform? (e.g., service delivery, operations, fundraising)"
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key Constraints (Optional)</label>
            <Textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="What limitations should we consider? (budget, regulations, culture, etc.)"
              rows={2}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generateRoadmap} 
            disabled={isGenerating || !ambitionLevel || !timeHorizon || !focusAreas.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Map className="h-4 w-4 mr-2 animate-pulse" />
                Charting Innovation Journey...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                Create Roadmap
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {roadmap && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Your Innovation Roadmap</CardTitle>
                  <p className="text-sm text-gray-600 mt-2 italic">
                    "{roadmap.vision.statement}"
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {roadmap.vision.timeHorizon}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    {roadmap.vision.transformationLevel}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-4">
                {roadmap.vision.differentiators.map((diff, index) => (
                  <Badge key={index} variant="outline">
                    <Star className="h-3 w-3 mr-1" />
                    {diff}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current State Assessment</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">Readiness Score:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${roadmap.currentState.readinessScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{roadmap.currentState.readinessScore}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {roadmap.currentState.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                        <span className="text-green-600 mt-0.5">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-amber-700 mb-2">Gaps</h4>
                  <ul className="space-y-1">
                    {roadmap.currentState.gaps.map((gap, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                        <span className="text-amber-600 mt-0.5">!</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">Opportunities</h4>
                  <ul className="space-y-1">
                    {roadmap.currentState.opportunities.map((opp, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                        <span className="text-blue-600 mt-0.5">★</span>
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {roadmap.phases.map((phase, phaseIndex) => (
            <Card key={phaseIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{phase.phase}</CardTitle>
                  <Badge variant="outline">{phase.timeline}</Badge>
                </div>
                <p className="text-sm text-gray-600">{phase.focus}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Key Initiatives</h4>
                    <div className="space-y-3">
                      {phase.initiatives.map((initiative, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium">{initiative.name}</h5>
                            <Zap className="h-4 w-4 text-purple-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{initiative.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Impact:</span>
                              <p className="text-gray-600">{initiative.impact}</p>
                            </div>
                            <div>
                              <span className="font-medium">Resources:</span>
                              <p className="text-gray-600">{initiative.resources}</p>
                            </div>
                            <div>
                              <span className="font-medium">Dependencies:</span>
                              <p className="text-gray-600">{initiative.dependencies.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Capabilities Developed</h4>
                      <ul className="space-y-1">
                        {phase.capabilities.map((cap, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">+</Badge>
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Success Milestones</h4>
                      <ul className="space-y-1">
                        {phase.milestones.map((milestone, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <Target className="h-3 w-3 text-green-600 mt-0.5" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {phase.risks.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded">
                      <h4 className="font-medium text-amber-900 mb-2">Key Risks</h4>
                      <ul className="space-y-1">
                        {phase.risks.map((risk, i) => (
                          <li key={i} className="text-sm text-amber-700">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Innovation Portfolio Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roadmap.innovationPortfolio.map((horizon, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className={`font-medium mb-1 ${getHorizonColor(horizon.horizon)}`}>
                      {horizon.horizon}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{horizon.description}</p>
                    
                    <div className="space-y-2">
                      {horizon.examples.map((example, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{example.initiative}</p>
                            <p className="text-xs text-gray-600">
                              {example.technology} • {example.expectedImpact} • {example.timeframe}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Badge variant="secondary" className="mt-3">
                      {horizon.allocation}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Critical Enablers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roadmap.enablers.map((enabler, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{enabler.category}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Requirements:</p>
                        <ul className="space-y-1">
                          {enabler.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-xs text-gray-600">• {req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Investments:</p>
                        <ul className="space-y-1">
                          {enabler.investments.slice(0, 3).map((inv, i) => (
                            <li key={i} className="text-xs text-gray-600">• {inv}</li>
                          ))}
                        </ul>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {enabler.timeline}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roadmap.successMetrics.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-3">{category.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {category.metrics.map((metric, i) => (
                        <div key={i} className="border rounded p-3 bg-gray-50">
                          <h5 className="font-medium text-sm mb-2">{metric.metric}</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Baseline:</span>
                              <span>{metric.baseline}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Target:</span>
                              <span className="font-medium text-green-700">{metric.target}</span>
                            </div>
                            <div className="text-gray-500 mt-1">{metric.measurement}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Immediate Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roadmap.nextSteps.map((step) => (
                  <div key={step.priority} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {step.priority}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{step.action}</h5>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Owner: {step.owner}</span>
                        <span>Due: {step.deadline}</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">{step.outcome}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Rocket className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Innovation Leadership Principles</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                    <li>Think beyond current constraints - imagine the ideal</li>
                    <li>Fail fast, learn faster - celebrate intelligent risks</li>
                    <li>Partner broadly - innovation happens at intersections</li>
                    <li>Measure what matters - focus on transformational metrics</li>
                    <li>Share generously - your innovations can transform the sector</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Building Your Innovation Coalition:</p>
                  <p>Success requires allies. Identify champions at every level - board members who dream big, 
                  staff who embrace change, funders who invest in transformation, and partners who share your vision.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};