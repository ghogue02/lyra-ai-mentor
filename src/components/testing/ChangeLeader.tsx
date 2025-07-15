import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Compass, Shield, Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChangeLeaderProps {
  onComplete?: () => void;
}

interface ChangeStrategy {
  organizationType: string;
  currentCulture: string;
  desiredOutcome: string;
  timeframe: string;
  phases: {
    name: string;
    duration: string;
    objectives: string[];
    activities: {
      activity: string;
      owner: string;
      outcome: string;
    }[];
    resistancePoints: string[];
    successIndicators: string[];
  }[];
  stakeholderPlan: {
    group: string;
    currentState: string;
    desiredState: string;
    engagement: string;
    messaging: string[];
  }[];
  communicationPlan: {
    channel: string;
    frequency: string;
    content: string[];
    owner: string;
  }[];
  quickWins: {
    win: string;
    timeline: string;
    impact: string;
    visibility: string;
  }[];
  riskMitigation: {
    risk: string;
    likelihood: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
    owner: string;
  }[];
  cultureShifts: {
    from: string;
    to: string;
    enablers: string[];
    barriers: string[];
  }[];
}

export const ChangeLeader: React.FC<ChangeLeaderProps> = ({ onComplete }) => {
  const [changeType, setChangeType] = useState<string>('');
  const [organizationSize, setOrganizationSize] = useState<string>('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  const [desiredState, setDesiredState] = useState('');
  const [strategy, setStrategy] = useState<ChangeStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const changeTypes = [
    { value: 'ai_adoption', label: 'AI Tool Adoption', description: 'Implement AI across organization' },
    { value: 'digital_transformation', label: 'Digital Transformation', description: 'Modernize all processes' },
    { value: 'culture_innovation', label: 'Innovation Culture', description: 'Build culture of experimentation' },
    { value: 'data_driven', label: 'Data-Driven Culture', description: 'Decision making with data' },
    { value: 'remote_hybrid', label: 'Remote/Hybrid Work', description: 'New ways of working' },
    { value: 'agile_adoption', label: 'Agile Methodologies', description: 'Flexible, iterative approach' },
    { value: 'sustainability', label: 'Sustainability Focus', description: 'Environmental & financial' }
  ];

  const orgSizes = [
    { value: 'small', label: 'Small (1-25)', description: 'Nimble, close-knit team' },
    { value: 'medium', label: 'Medium (26-100)', description: 'Growing complexity' },
    { value: 'large', label: 'Large (100+)', description: 'Multiple departments' },
    { value: 'distributed', label: 'Distributed', description: 'Multiple locations' }
  ];

  const generateStrategy = async () => {
    if (!changeType || !organizationSize || !currentChallenges.trim() || !desiredState.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = createChangeStrategy();
      setStrategy(result);
      
      toast.success('Change strategy created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate strategy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createChangeStrategy = (): ChangeStrategy => {
    const templates: Record<string, () => ChangeStrategy> = {
      'ai_adoption': () => ({
        organizationType: 'AI-Forward Nonprofit',
        currentCulture: 'Traditional, manual processes with AI skepticism',
        desiredOutcome: 'AI-empowered organization with 10x impact',
        timeframe: '6-9 months',
        phases: [
          {
            name: 'Phase 1: Foundation Building (Months 1-2)',
            duration: '8 weeks',
            objectives: [
              'Build leadership alignment on AI vision',
              'Address fears and misconceptions',
              'Identify AI champions across teams',
              'Establish AI governance framework'
            ],
            activities: [
              {
                activity: 'Executive AI Workshop',
                owner: 'CEO + Leadership Team',
                outcome: 'Unified vision and commitment'
              },
              {
                activity: 'All-Hands AI Demo Day',
                owner: 'Innovation Team',
                outcome: 'Excitement and awareness'
              },
              {
                activity: 'AI Ethics Framework',
                owner: 'Cross-functional Committee',
                outcome: 'Clear usage guidelines'
              },
              {
                activity: 'Champion Network Launch',
                owner: 'HR + Early Adopters',
                outcome: '10-15 AI ambassadors'
              }
            ],
            resistancePoints: [
              'Job security fears',
              'Technology overwhelm',
              'Budget concerns',
              'Mission alignment questions'
            ],
            successIndicators: [
              'Leadership actively promoting AI',
              '80% staff attended intro sessions',
              'AI policy approved and shared',
              'Champion network active'
            ]
          },
          {
            name: 'Phase 2: Pilot & Learn (Months 3-4)',
            duration: '8 weeks',
            objectives: [
              'Launch 3-5 pilot AI projects',
              'Generate quick wins and stories',
              'Build hands-on experience',
              'Refine implementation approach'
            ],
            activities: [
              {
                activity: 'Department AI Sprints',
                owner: 'Department Heads',
                outcome: 'Working AI implementations'
              },
              {
                activity: 'Weekly Success Sharing',
                owner: 'Champions',
                outcome: 'Viral adoption stories'
              },
              {
                activity: 'Hands-On Training Labs',
                owner: 'L&D Team',
                outcome: '60% staff AI-capable'
              },
              {
                activity: 'ROI Documentation',
                owner: 'Operations',
                outcome: 'Proven time/cost savings'
              }
            ],
            resistancePoints: [
              'Tool selection paralysis',
              'Integration challenges',
              'Quality concerns',
              'Time investment pushback'
            ],
            successIndicators: [
              'All departments have AI pilots',
              '30+ hours/week saved documented',
              'User satisfaction >80%',
              'Organic tool sharing happening'
            ]
          },
          {
            name: 'Phase 3: Scale & Embed (Months 5-6)',
            duration: '8 weeks',
            objectives: [
              'Scale successful pilots org-wide',
              'Integrate AI into core processes',
              'Build sustainable practices',
              'Celebrate transformation'
            ],
            activities: [
              {
                activity: 'Process Redesign Workshops',
                owner: 'Process Owners',
                outcome: 'AI-first workflows'
              },
              {
                activity: 'Advanced Skills Training',
                owner: 'L&D + External Partners',
                outcome: 'Power users in each team'
              },
              {
                activity: 'AI Innovation Challenge',
                owner: 'Innovation Committee',
                outcome: 'New use cases identified'
              },
              {
                activity: 'Success Celebration',
                owner: 'Leadership',
                outcome: 'Recognition and momentum'
              }
            ],
            resistancePoints: [
              'Change fatigue',
              'Complexity overwhelm',
              'Resource constraints',
              'Competing priorities'
            ],
            successIndicators: [
              'AI used in 80% of workflows',
              '50% efficiency gains achieved',
              'Innovation pipeline active',
              'External recognition received'
            ]
          },
          {
            name: 'Phase 4: Optimize & Innovate (Months 7-9)',
            duration: '12 weeks',
            objectives: [
              'Optimize AI implementations',
              'Launch next-gen innovations',
              'Share knowledge externally',
              'Plan future roadmap'
            ],
            activities: [
              {
                activity: 'AI Optimization Audits',
                owner: 'Tech Team',
                outcome: 'Peak performance achieved'
              },
              {
                activity: 'Innovation Lab Launch',
                owner: 'Cross-functional Team',
                outcome: 'Continuous innovation model'
              },
              {
                activity: 'Sector Leadership',
                owner: 'Leadership',
                outcome: 'Thought leadership position'
              },
              {
                activity: 'Future Roadmap',
                owner: 'Strategy Team',
                outcome: '3-year AI vision'
              }
            ],
            resistancePoints: [
              'Complacency risk',
              'Resource sustainability',
              'Keeping pace with change',
              'Skill gaps emerging'
            ],
            successIndicators: [
              'Industry benchmark performance',
              'Speaking at conferences',
              'Mentoring other nonprofits',
              'Clear future vision'
            ]
          }
        ],
        stakeholderPlan: [
          {
            group: 'Board of Directors',
            currentState: 'Cautiously interested, risk-focused',
            desiredState: 'Active champions and investors',
            engagement: 'Monthly updates, success metrics, peer examples',
            messaging: [
              'AI amplifies mission impact',
              'Competitive advantage in funding',
              'Risk mitigation through innovation',
              'Donor expectations changing'
            ]
          },
          {
            group: 'Leadership Team',
            currentState: 'Mixed readiness, some skepticism',
            desiredState: 'United, leading by example',
            engagement: 'Weekly coaching, hands-on support, peer learning',
            messaging: [
              'AI frees you for strategic work',
              'Your teams need your leadership',
              'Career growth opportunity',
              'Legacy of transformation'
            ]
          },
          {
            group: 'Program Staff',
            currentState: 'Worried about job changes',
            desiredState: 'Empowered to serve more',
            engagement: 'Department workshops, success stories, skill building',
            messaging: [
              'AI helps you help more people',
              'Removes boring tasks',
              'Makes you more valuable',
              'We invest in your growth'
            ]
          },
          {
            group: 'Operations Staff',
            currentState: 'Overwhelmed with manual work',
            desiredState: 'Efficient and innovative',
            engagement: 'Process mapping, automation pilots, recognition',
            messaging: [
              'Finally, tools that work',
              'Your expertise guides AI',
              'More time for improvement',
              'Career advancement path'
            ]
          },
          {
            group: 'Donors & Funders',
            currentState: 'Expect traditional approaches',
            desiredState: 'Excited by innovation',
            engagement: 'Impact reports, innovation updates, exclusive previews',
            messaging: [
              'Your investment goes further',
              'Leading-edge impact',
              'Transparent efficiency',
              'Future-ready organization'
            ]
          }
        ],
        communicationPlan: [
          {
            channel: 'All-Hands Meetings',
            frequency: 'Monthly',
            content: ['Progress updates', 'Success celebrations', 'Q&A sessions', 'Demo new tools'],
            owner: 'CEO'
          },
          {
            channel: 'AI Newsletter',
            frequency: 'Bi-weekly',
            content: ['Tips & tricks', 'Success stories', 'Training opportunities', 'Innovation updates'],
            owner: 'Communications'
          },
          {
            channel: 'Slack #ai-champions',
            frequency: 'Daily',
            content: ['Quick wins', 'Problem solving', 'Resource sharing', 'Peer support'],
            owner: 'Champions'
          },
          {
            channel: 'Department Huddles',
            frequency: 'Weekly',
            content: ['Team progress', 'Local challenges', 'Skill sharing', 'Planning'],
            owner: 'Managers'
          },
          {
            channel: 'Board Reports',
            frequency: 'Quarterly',
            content: ['ROI metrics', 'Strategic progress', 'Risk management', 'Future plans'],
            owner: 'Leadership'
          }
        ],
        quickWins: [
          {
            win: 'Email drafting saves 5 hours/week',
            timeline: 'Week 2',
            impact: 'Immediate time savings',
            visibility: 'Share in all-hands'
          },
          {
            win: 'Grant application 50% faster',
            timeline: 'Month 1',
            impact: 'More grants submitted',
            visibility: 'Board presentation'
          },
          {
            win: 'Donor insights dashboard live',
            timeline: 'Month 2',
            impact: 'Better donor retention',
            visibility: 'Newsletter feature'
          },
          {
            win: 'Social media engagement up 200%',
            timeline: 'Month 2',
            impact: 'Increased visibility',
            visibility: 'External PR'
          },
          {
            win: 'First AI-generated impact report',
            timeline: 'Month 3',
            impact: 'Professional quality',
            visibility: 'Donor mailing'
          }
        ],
        riskMitigation: [
          {
            risk: 'Key staff resistance',
            likelihood: 'high',
            impact: 'high',
            mitigation: 'One-on-one coaching, address specific concerns, find alternative roles',
            owner: 'HR Director'
          },
          {
            risk: 'Technology failures',
            likelihood: 'medium',
            impact: 'medium',
            mitigation: 'Robust testing, backup plans, vendor support contracts',
            owner: 'IT Manager'
          },
          {
            risk: 'Budget overruns',
            likelihood: 'medium',
            impact: 'high',
            mitigation: 'Phased investment, ROI tracking, contingency fund',
            owner: 'CFO'
          },
          {
            risk: 'Mission drift concerns',
            likelihood: 'low',
            impact: 'high',
            mitigation: 'Clear values framework, regular alignment checks, stakeholder input',
            owner: 'CEO'
          },
          {
            risk: 'Data privacy breach',
            likelihood: 'low',
            impact: 'high',
            mitigation: 'Security protocols, training, insurance, vendor vetting',
            owner: 'Compliance Officer'
          }
        ],
        cultureShifts: [
          {
            from: 'Technology as necessary evil',
            to: 'Technology as mission amplifier',
            enablers: ['Success stories', 'Skill building', 'Recognition'],
            barriers: ['Past failures', 'Generational gaps', 'Resource limits']
          },
          {
            from: 'Risk aversion',
            to: 'Calculated experimentation',
            enablers: ['Safe failure spaces', 'Innovation rewards', 'Leadership modeling'],
            barriers: ['Funder expectations', 'Regulatory concerns', 'Historical culture']
          },
          {
            from: 'Efficiency means doing more',
            to: 'Efficiency means greater impact',
            enablers: ['Impact measurement', 'Time reallocation', 'Strategic focus'],
            barriers: ['Workload expectations', 'Metrics fixation', 'Burnout risk']
          },
          {
            from: 'Individual expertise',
            to: 'Collective intelligence',
            enablers: ['Knowledge sharing', 'Collaborative tools', 'Team recognition'],
            barriers: ['Siloed departments', 'Competition', 'Information hoarding']
          }
        ]
      }),

      'digital_transformation': () => ({
        organizationType: 'Digitally Transformed Nonprofit',
        currentCulture: 'Paper-based, manual processes, limited tech adoption',
        desiredOutcome: 'Fully digital, efficient, data-driven organization',
        timeframe: '12-18 months',
        phases: [
          {
            name: 'Phase 1: Digital Foundation (Months 1-3)',
            duration: '12 weeks',
            objectives: [
              'Assess current digital maturity',
              'Build digital strategy and roadmap',
              'Secure resources and support',
              'Address infrastructure gaps'
            ],
            activities: [
              {
                activity: 'Digital Maturity Assessment',
                owner: 'External Consultant + IT',
                outcome: 'Clear baseline and gaps'
              },
              {
                activity: 'Infrastructure Upgrade',
                owner: 'IT Team',
                outcome: 'Cloud-ready systems'
              },
              {
                activity: 'Digital Skills Baseline',
                owner: 'HR + L&D',
                outcome: 'Training needs identified'
              },
              {
                activity: 'Change Coalition',
                owner: 'Cross-functional Leaders',
                outcome: 'United change team'
              }
            ],
            resistancePoints: [
              'Cost concerns',
              'Complexity fears',
              'Loss of personal touch',
              'Technical skill gaps'
            ],
            successIndicators: [
              'Digital strategy approved',
              'Budget allocated',
              'Infrastructure ready',
              'Coalition active'
            ]
          },
          {
            name: 'Phase 2: Core Digitization (Months 4-9)',
            duration: '24 weeks',
            objectives: [
              'Digitize core processes',
              'Implement key platforms',
              'Train all staff',
              'Achieve early wins'
            ],
            activities: [
              {
                activity: 'CRM Implementation',
                owner: 'Development + IT',
                outcome: 'Unified constituent database'
              },
              {
                activity: 'Financial System Upgrade',
                owner: 'Finance + IT',
                outcome: 'Real-time financial data'
              },
              {
                activity: 'Program Delivery Platforms',
                owner: 'Program Teams',
                outcome: 'Digital service delivery'
              },
              {
                activity: 'Staff Digital Bootcamp',
                owner: 'L&D Team',
                outcome: 'Digitally fluent workforce'
              }
            ],
            resistancePoints: [
              'Learning curve stress',
              'Process change resistance',
              'Data migration fears',
              'Workflow disruption'
            ],
            successIndicators: [
              'Core systems operational',
              '80% processes digital',
              'Staff adoption >75%',
              'Efficiency gains visible'
            ]
          },
          {
            name: 'Phase 3: Integration & Optimization (Months 10-15)',
            duration: '24 weeks',
            objectives: [
              'Integrate all systems',
              'Optimize workflows',
              'Build analytics capability',
              'Drive innovation'
            ],
            activities: [
              {
                activity: 'Systems Integration',
                owner: 'IT + Vendors',
                outcome: 'Seamless data flow'
              },
              {
                activity: 'Analytics Platform',
                owner: 'Data Team',
                outcome: 'Real-time insights'
              },
              {
                activity: 'Process Automation',
                owner: 'Operations',
                outcome: 'Automated workflows'
              },
              {
                activity: 'Innovation Labs',
                owner: 'All Departments',
                outcome: 'Continuous improvement'
              }
            ],
            resistancePoints: [
              'Integration complexity',
              'Data quality issues',
              'Change fatigue',
              'Resource strain'
            ],
            successIndicators: [
              'Full integration achieved',
              'Analytics in daily use',
              '50% process automation',
              'Innovation pipeline active'
            ]
          },
          {
            name: 'Phase 4: Digital Excellence (Months 16-18)',
            duration: '12 weeks',
            objectives: [
              'Achieve digital maturity',
              'Lead sector transformation',
              'Plan next evolution',
              'Celebrate success'
            ],
            activities: [
              {
                activity: 'Maturity Reassessment',
                owner: 'Leadership Team',
                outcome: 'Documented transformation'
              },
              {
                activity: 'Knowledge Sharing',
                owner: 'All Teams',
                outcome: 'Sector leadership'
              },
              {
                activity: 'Future Planning',
                owner: 'Strategy Team',
                outcome: 'Next-gen roadmap'
              },
              {
                activity: 'Transformation Celebration',
                owner: 'Everyone',
                outcome: 'Recognition and pride'
              }
            ],
            resistancePoints: [
              'Complacency risk',
              'Continuous change need',
              'Skill evolution',
              'Resource sustainability'
            ],
            successIndicators: [
              'Digital maturity achieved',
              'Sector recognition',
              'Sustained benefits',
              'Future vision clear'
            ]
          }
        ],
        stakeholderPlan: [
          {
            group: 'Board of Directors',
            currentState: 'Limited digital understanding',
            desiredState: 'Digital governance leaders',
            engagement: 'Digital literacy sessions, regular dashboards, peer connections',
            messaging: [
              'Digital is survival necessity',
              'ROI clearly demonstrated',
              'Risk of not changing',
              'Competitive advantage'
            ]
          },
          {
            group: 'Senior Leadership',
            currentState: 'Varying digital comfort',
            desiredState: 'Digital-first leaders',
            engagement: 'Executive coaching, peer mentoring, hands-on training',
            messaging: [
              'Lead by example crucial',
              'Your teams need you',
              'Career relevance',
              'Legacy opportunity'
            ]
          },
          {
            group: 'IT Team',
            currentState: 'Overwhelmed, reactive',
            desiredState: 'Strategic enablers',
            engagement: 'Upskilling, additional resources, recognition',
            messaging: [
              'Central to success',
              'Career growth opportunity',
              'Investment in your skills',
              'Strategic partnership'
            ]
          },
          {
            group: 'Beneficiaries',
            currentState: 'Expect in-person services',
            desiredState: 'Embrace digital options',
            engagement: 'Digital literacy support, gradual transition, maintain choice',
            messaging: [
              'Better, faster service',
              'More convenience',
              'Still personal care',
              'We support you'
            ]
          }
        ],
        communicationPlan: [
          {
            channel: 'Digital Transformation Hub',
            frequency: 'Always available',
            content: ['Progress tracker', 'Resources', 'Training', 'Support'],
            owner: 'PMO'
          },
          {
            channel: 'Town Halls',
            frequency: 'Quarterly',
            content: ['Major milestones', 'Strategy updates', 'Recognition', 'Q&A'],
            owner: 'CEO'
          },
          {
            channel: 'Department Check-ins',
            frequency: 'Bi-weekly',
            content: ['Local progress', 'Challenge solving', 'Peer learning', 'Planning'],
            owner: 'Department Heads'
          },
          {
            channel: 'Success Stories Blog',
            frequency: 'Weekly',
            content: ['Win celebrations', 'Lessons learned', 'Tips shared', 'Recognition'],
            owner: 'Communications'
          }
        ],
        quickWins: [
          {
            win: 'Paper forms eliminated',
            timeline: 'Month 2',
            impact: 'Instant processing',
            visibility: 'Client testimonials'
          },
          {
            win: 'Mobile-enabled field staff',
            timeline: 'Month 3',
            impact: 'Real-time data entry',
            visibility: 'Staff stories'
          },
          {
            win: 'Automated donor receipts',
            timeline: 'Month 4',
            impact: '48hr to instant',
            visibility: 'Donor feedback'
          },
          {
            win: 'Live impact dashboard',
            timeline: 'Month 6',
            impact: 'Real-time decisions',
            visibility: 'Board presentation'
          }
        ],
        riskMitigation: [
          {
            risk: 'Major system failure',
            likelihood: 'medium',
            impact: 'high',
            mitigation: 'Robust backup, disaster recovery, vendor SLAs',
            owner: 'CTO'
          },
          {
            risk: 'Digital divide impact',
            likelihood: 'high',
            impact: 'medium',
            mitigation: 'Multi-channel approach, digital literacy programs, gradual transition',
            owner: 'Program Directors'
          },
          {
            risk: 'Cybersecurity breach',
            likelihood: 'medium',
            impact: 'high',
            mitigation: 'Security training, tools, policies, insurance, audits',
            owner: 'Security Officer'
          },
          {
            risk: 'Staff turnover',
            likelihood: 'medium',
            impact: 'medium',
            mitigation: 'Retention bonuses, career paths, recognition, documentation',
            owner: 'HR Director'
          }
        ],
        cultureShifts: [
          {
            from: 'Paper is permanent',
            to: 'Digital is secure and accessible',
            enablers: ['Security demonstrations', 'Access benefits', 'Backup systems'],
            barriers: ['Trust issues', 'Legal concerns', 'Habit strength']
          },
          {
            from: 'Face-to-face only',
            to: 'Omnichannel engagement',
            enablers: ['Convenience proof', 'Quality maintenance', 'Choice provision'],
            barriers: ['Relationship concerns', 'Digital divide', 'Service quality fears']
          },
          {
            from: 'Data in silos',
            to: 'Integrated intelligence',
            enablers: ['Integration benefits', 'Access democratization', 'Insight generation'],
            barriers: ['Ownership issues', 'Quality concerns', 'Technical challenges']
          }
        ]
      })
    };

    const template = templates[changeType] || templates.ai_adoption;
    return template();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
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
            <Compass className="h-5 w-5 text-purple-600" />
            Change Leadership Navigator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create a comprehensive change management strategy
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type of Change</label>
              <Select value={changeType} onValueChange={setChangeType}>
                <SelectTrigger>
                  <SelectValue placeholder="What transformation?" />
                </SelectTrigger>
                <SelectContent>
                  {changeTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Organization Size</label>
              <Select value={organizationSize} onValueChange={setOrganizationSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Team size & structure" />
                </SelectTrigger>
                <SelectContent>
                  {orgSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div>
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs text-gray-500">{size.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Challenges</label>
            <Textarea
              value={currentChallenges}
              onChange={(e) => setCurrentChallenges(e.target.value)}
              placeholder="What problems are you trying to solve? What's not working?"
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Desired Future State</label>
            <Textarea
              value={desiredState}
              onChange={(e) => setDesiredState(e.target.value)}
              placeholder="What does success look like? How will things be different?"
              rows={3}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generateStrategy} 
            disabled={isGenerating || !changeType || !organizationSize || !currentChallenges.trim() || !desiredState.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Lightbulb className="h-4 w-4 mr-2 animate-pulse" />
                Creating Change Strategy...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Change Strategy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {strategy && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Change Strategy</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {strategy.timeframe} journey to {strategy.desiredOutcome}
                  </p>
                </div>
                <Badge variant="secondary">
                  {strategy.organizationType}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {strategy.phases.map((phase, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{phase.name}</CardTitle>
                <Badge variant="outline" className="w-fit">{phase.duration}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Objectives</h4>
                  <ul className="space-y-1">
                    {phase.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Activities</h4>
                  <div className="space-y-2">
                    {phase.activities.map((activity, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{activity.activity}</p>
                            <p className="text-xs text-gray-600 mt-1">Owner: {activity.owner}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.outcome}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-amber-700">Resistance Points</h4>
                    <ul className="space-y-1">
                      {phase.resistancePoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-green-700">Success Indicators</h4>
                    <ul className="space-y-1">
                      {phase.successIndicators.map((indicator, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                          <span className="text-gray-700">{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Stakeholder Engagement Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategy.stakeholderPlan.map((stakeholder, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{stakeholder.group}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Current: {stakeholder.currentState}</p>
                        <p className="text-green-700 mt-1">Target: {stakeholder.desiredState}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Engagement: {stakeholder.engagement}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Key Messages:</p>
                      <div className="flex flex-wrap gap-1">
                        {stakeholder.messaging.map((msg, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {msg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communication Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {strategy.communicationPlan.map((comm, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{comm.channel}</h4>
                      <Badge variant="outline" className="text-xs">{comm.frequency}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Owner: {comm.owner}</p>
                    <div className="space-y-1">
                      {comm.content.map((item, i) => (
                        <p key={i} className="text-xs text-gray-700">• {item}</p>
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
                Quick Wins Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategy.quickWins.map((win, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{win.win}</p>
                      <p className="text-sm text-green-700">Impact: {win.impact}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">{win.timeline}</Badge>
                      <p className="text-xs text-gray-600 mt-1">{win.visibility}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Risk Mitigation Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategy.riskMitigation.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{risk.risk}</h4>
                      <div className="flex gap-2">
                        <Badge className={getRiskColor(risk.likelihood)}>
                          L: {risk.likelihood}
                        </Badge>
                        <Badge className={getRiskColor(risk.impact)}>
                          I: {risk.impact}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{risk.mitigation}</p>
                    <p className="text-xs text-gray-600">Owner: {risk.owner}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-600" />
                Culture Transformation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategy.cultureShifts.map((shift, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-gray-600">From: {shift.from}</p>
                      <span className="text-purple-600">→</span>
                      <p className="text-sm font-medium text-purple-900">To: {shift.to}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-green-700 mb-1">Enablers:</p>
                        <ul className="space-y-1">
                          {shift.enablers.map((enabler, i) => (
                            <li key={i} className="text-gray-600">• {enabler}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-amber-700 mb-1">Barriers:</p>
                        <ul className="space-y-1">
                          {shift.barriers.map((barrier, i) => (
                            <li key={i} className="text-gray-600">• {barrier}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Compass className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Leading Change Successfully</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                    <li>Communicate the "why" constantly - connect to mission</li>
                    <li>Celebrate every small win publicly</li>
                    <li>Address resistance with empathy and facts</li>
                    <li>Model the change you want to see</li>
                    <li>Invest in your champions and early adopters</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};