export interface AIExample {
  id: string;
  title: string;
  description: string;
  data: Record<string, any>;
  tags?: string[];
}

export interface CharacterExamples {
  maya: AIExample[];
  sofia: AIExample[];
  david: AIExample[];
  rachel: AIExample[];
  alex: AIExample[];
}

export const AI_EXAMPLES: CharacterExamples = {
  maya: [
    {
      id: 'maya-fundraising',
      title: 'Annual Fundraising Campaign',
      description: 'Craft a compelling email for your year-end giving campaign',
      data: {
        purpose: 'fundraising',
        recipient: 'past donors',
        tone: 'warm',
        context: 'We\'re launching our annual giving campaign to support youth education programs. Last year, donors like them helped us reach 500 students. This year, we aim to double our impact.',
        keyPoints: [
          'Highlight last year\'s achievements',
          'Share a student success story',
          'Clear call-to-action for donation',
          'Multiple giving levels'
        ]
      },
      tags: ['fundraising', 'donors', 'annual campaign']
    },
    {
      id: 'maya-volunteer',
      title: 'Volunteer Recruitment Drive',
      description: 'Invite community members to join your volunteer program',
      data: {
        purpose: 'volunteer recruitment',
        recipient: 'community members',
        tone: 'inspiring',
        context: 'Spring is here and we need volunteers for our community garden project. No experience needed - just enthusiasm! We provide training and flexible scheduling.',
        keyPoints: [
          'Describe the volunteer opportunity',
          'Emphasize community impact',
          'Mention training and support',
          'Include signup link'
        ]
      },
      tags: ['volunteers', 'recruitment', 'community']
    },
    {
      id: 'maya-donor-thank',
      title: 'Donor Thank You Letter',
      description: 'Express gratitude to a major donor for their contribution',
      data: {
        purpose: 'donor appreciation',
        recipient: 'major donor',
        tone: 'grateful',
        context: 'A donor just made a $10,000 contribution to our scholarship fund. This is their third year of support, and their generosity has helped 15 students attend college.',
        keyPoints: [
          'Personal acknowledgment of their gift',
          'Specific impact of their donation',
          'Recognition of continued support',
          'Invitation to see programs in action'
        ]
      },
      tags: ['donors', 'thank you', 'stewardship']
    },
    {
      id: 'maya-event-invite',
      title: 'Gala Event Invitation',
      description: 'Invite supporters to your annual fundraising gala',
      data: {
        purpose: 'event invitation',
        recipient: 'supporters and prospects',
        tone: 'elegant',
        context: 'Our "Hearts for Hope" gala is on May 15th at the Grand Ballroom. Evening includes dinner, silent auction, and inspiring stories from program participants. Black-tie optional.',
        keyPoints: [
          'Event details and dress code',
          'Highlight special program',
          'Ticket information',
          'RSVP deadline'
        ]
      },
      tags: ['events', 'gala', 'fundraising']
    },
    {
      id: 'maya-newsletter',
      title: 'Monthly Impact Newsletter',
      description: 'Share program updates and success stories',
      data: {
        purpose: 'newsletter update',
        recipient: 'all supporters',
        tone: 'informative',
        context: 'March was incredible! We launched our new literacy program, welcomed 20 new volunteers, and celebrated our 100th graduate. Plus, exciting news about our summer programs.',
        keyPoints: [
          'Program milestone celebration',
          'Volunteer spotlight',
          'Upcoming opportunities',
          'Call-to-action for involvement'
        ]
      },
      tags: ['newsletter', 'updates', 'engagement']
    }
  ],
  
  sofia: [
    {
      id: 'sofia-impact',
      title: 'Program Impact Story',
      description: 'Share how your programs changed a beneficiary\'s life',
      data: {
        storyType: 'impact',
        audience: 'donors and supporters',
        protagonist: 'Maria, a single mother of two',
        challenge: 'Lost her job during the pandemic and faced eviction',
        journey: 'Found our emergency assistance program through a friend. Received rent support, job training, and childcare assistance.',
        transformation: 'Now employed full-time as a medical assistant, moved to stable housing, and volunteers to help other families.',
        callToAction: 'Your support makes stories like Maria\'s possible'
      },
      tags: ['impact', 'beneficiary', 'transformation']
    },
    {
      id: 'sofia-donor-spotlight',
      title: 'Donor Spotlight Story',
      description: 'Highlight a donor\'s journey and motivation for giving',
      data: {
        storyType: 'donor spotlight',
        audience: 'potential major donors',
        protagonist: 'The Johnson Family Foundation',
        challenge: 'Wanted to make a meaningful difference in education but unsure where to start',
        journey: 'Visited our after-school programs, met with students and teachers, saw the need for STEM resources.',
        transformation: 'Funded a complete computer lab and coding program, now 200 students learn programming annually.',
        callToAction: 'Join other visionary donors in transforming lives'
      },
      tags: ['donors', 'philanthropy', 'partnership']
    },
    {
      id: 'sofia-volunteer-hero',
      title: 'Volunteer Hero Story',
      description: 'Celebrate a volunteer\'s dedication and impact',
      data: {
        storyType: 'volunteer spotlight',
        audience: 'volunteer prospects',
        protagonist: 'Tom, retired engineer',
        challenge: 'Felt disconnected after retirement, wanted to use his skills meaningfully',
        journey: 'Started tutoring math twice a week, developed a hands-on engineering club for middle schoolers.',
        transformation: 'Now leads 30 volunteer tutors, his engineering club has inspired 50 students to pursue STEM careers.',
        callToAction: 'Discover how your skills can change lives'
      },
      tags: ['volunteers', 'community', 'skills']
    },
    {
      id: 'sofia-mission-moment',
      title: 'Mission Moment Story',
      description: 'Connect daily work to your organization\'s mission',
      data: {
        storyType: 'mission story',
        audience: 'staff and board',
        protagonist: 'Our homeless outreach team',
        challenge: 'Record-breaking cold snap threatened lives of unsheltered individuals',
        journey: 'Mobilized emergency response: extended shelter hours, distributed 500 warm meals, provided transportation to warming centers.',
        transformation: 'No lives lost during crisis, connected 15 individuals to permanent housing resources.',
        callToAction: 'This is why our mission matters every single day'
      },
      tags: ['mission', 'team', 'emergency response']
    },
    {
      id: 'sofia-vision-future',
      title: 'Vision for the Future',
      description: 'Paint a picture of what\'s possible with support',
      data: {
        storyType: 'vision story',
        audience: 'campaign supporters',
        protagonist: 'Our community in 2030',
        challenge: 'Current: 40% of children lack access to quality early education',
        journey: 'With new education center: serve 1,000 more children annually, provide parent education, offer teacher training.',
        transformation: 'Every child in our community will have access to quality early education, breaking cycles of poverty.',
        callToAction: 'Help us build this future together'
      },
      tags: ['vision', 'campaign', 'future']
    }
  ],
  
  david: [
    {
      id: 'david-donation-trends',
      title: 'Annual Donation Analysis',
      description: 'Analyze year-over-year donation trends and patterns',
      data: {
        dataType: 'donations',
        metrics: ['Total donations', 'Average gift size', 'Donor retention rate', 'New vs returning donors'],
        timeframe: 'Last 3 years',
        keyQuestions: [
          'What months show highest giving?',
          'How has average gift size changed?',
          'Which donor segments are growing?',
          'What campaigns performed best?'
        ],
        context: 'Board presentation on fundraising effectiveness',
        visualizations: ['Line chart of monthly totals', 'Pie chart of donor segments', 'Bar chart of campaign performance']
      },
      tags: ['donations', 'trends', 'fundraising']
    },
    {
      id: 'david-event-roi',
      title: 'Event ROI Dashboard',
      description: 'Compare costs and revenue across fundraising events',
      data: {
        dataType: 'events',
        metrics: ['Gross revenue', 'Net profit', 'Cost per attendee', 'Sponsorship revenue'],
        timeframe: 'Last 5 events',
        keyQuestions: [
          'Which events have highest ROI?',
          'How do virtual vs in-person compare?',
          'What drives sponsorship success?',
          'Where can we reduce costs?'
        ],
        context: 'Planning next year\'s event calendar',
        visualizations: ['ROI comparison chart', 'Cost breakdown', 'Attendance trends']
      },
      tags: ['events', 'ROI', 'analysis']
    },
    {
      id: 'david-volunteer-metrics',
      title: 'Volunteer Engagement Report',
      description: 'Track volunteer hours, retention, and impact',
      data: {
        dataType: 'volunteers',
        metrics: ['Total volunteer hours', 'Active volunteers', 'Retention rate', 'Hours by program'],
        timeframe: 'Current year',
        keyQuestions: [
          'Which programs attract most volunteers?',
          'What\'s our volunteer lifetime value?',
          'How do we compare to sector benchmarks?',
          'What drives volunteer retention?'
        ],
        context: 'Grant application requiring volunteer data',
        visualizations: ['Hours by month', 'Volunteer demographics', 'Program distribution']
      },
      tags: ['volunteers', 'engagement', 'hours']
    },
    {
      id: 'david-impact-metrics',
      title: 'Program Impact Dashboard',
      description: 'Measure and visualize program outcomes',
      data: {
        dataType: 'program impact',
        metrics: ['Beneficiaries served', 'Services delivered', 'Outcome achievement', 'Cost per outcome'],
        timeframe: 'Quarterly comparison',
        keyQuestions: [
          'Are we meeting our targets?',
          'Which programs are most efficient?',
          'How do outcomes vary by demographic?',
          'What\'s our year-over-year growth?'
        ],
        context: 'Quarterly impact report for funders',
        visualizations: ['Impact heat map', 'Outcome trends', 'Demographic breakdown']
      },
      tags: ['impact', 'outcomes', 'programs']
    },
    {
      id: 'david-growth-forecast',
      title: 'Growth Projection Model',
      description: 'Forecast revenue and program growth scenarios',
      data: {
        dataType: 'financial projections',
        metrics: ['Revenue projections', 'Expense forecasts', 'Program capacity', 'Staffing needs'],
        timeframe: 'Next 3 years',
        keyQuestions: [
          'What growth rate is sustainable?',
          'When do we need more staff?',
          'How much reserves do we need?',
          'What are our funding gaps?'
        ],
        context: 'Strategic planning session',
        visualizations: ['Growth scenarios', 'Budget projections', 'Capacity planning']
      },
      tags: ['forecasting', 'growth', 'strategy']
    }
  ],
  
  rachel: [
    {
      id: 'rachel-donor-onboarding',
      title: 'New Donor Welcome Series',
      description: 'Automate the perfect welcome experience for new donors',
      data: {
        workflowType: 'donor onboarding',
        triggers: ['First-time donation received'],
        steps: [
          'Immediate: Thank you email with tax receipt',
          'Day 3: Welcome packet with impact stories',
          'Week 2: Phone call from development team',
          'Month 1: Newsletter subscription and survey',
          'Month 3: Invitation to facility tour'
        ],
        goals: ['Build donor connection', 'Increase retention', 'Gather preferences'],
        tools: ['CRM automation', 'Email platform', 'Task management'],
        metrics: ['Email open rates', 'Survey completion', 'Second gift rate']
      },
      tags: ['onboarding', 'donors', 'automation']
    },
    {
      id: 'rachel-grant-reporting',
      title: 'Grant Reporting Workflow',
      description: 'Streamline quarterly and annual grant reports',
      data: {
        workflowType: 'grant reporting',
        triggers: ['30 days before deadline', 'Data collection needed'],
        steps: [
          'Day -30: Alert program managers',
          'Day -25: Collect program data',
          'Day -20: Financial report generation',
          'Day -15: Draft narrative sections',
          'Day -10: Review and approval process',
          'Day -5: Final submission prep'
        ],
        goals: ['Never miss deadlines', 'Improve data accuracy', 'Reduce last-minute stress'],
        tools: ['Project management', 'Data dashboards', 'Document templates'],
        metrics: ['On-time submission rate', 'Time per report', 'Revision requests']
      },
      tags: ['grants', 'reporting', 'compliance']
    },
    {
      id: 'rachel-volunteer-scheduling',
      title: 'Volunteer Shift Management',
      description: 'Automate volunteer scheduling and communications',
      data: {
        workflowType: 'volunteer coordination',
        triggers: ['New volunteer signup', 'Shift opening', 'No-show alert'],
        steps: [
          'Volunteer signs up: Send welcome and training info',
          'Weekly: Send shift availability',
          'Match made: Confirmation and reminder emails',
          'Day before: SMS reminder',
          'Post-shift: Thank you and feedback request',
          'Monthly: Hours summary and recognition'
        ],
        goals: ['Reduce no-shows', 'Improve volunteer satisfaction', 'Save coordinator time'],
        tools: ['Scheduling software', 'SMS platform', 'Volunteer database'],
        metrics: ['Fill rate', 'No-show rate', 'Volunteer retention']
      },
      tags: ['volunteers', 'scheduling', 'coordination']
    },
    {
      id: 'rachel-event-planning',
      title: 'Event Planning Timeline',
      description: 'Create a comprehensive event workflow from start to finish',
      data: {
        workflowType: 'event management',
        triggers: ['Event date set', 'Milestone deadlines'],
        steps: [
          'Month 3: Venue and vendor booking',
          'Month 2: Marketing launch and sponsor outreach',
          'Month 1: Registration open, volunteer recruitment',
          'Week 2: Final preparations, run of show',
          'Week 1: Last-minute tasks, briefings',
          'Post-event: Thank yous, surveys, wrap-up'
        ],
        goals: ['Nothing falls through cracks', 'Clear accountability', 'Reusable template'],
        tools: ['Event platform', 'Task assignments', 'Communication hub'],
        metrics: ['Task completion rate', 'Budget variance', 'Attendee satisfaction']
      },
      tags: ['events', 'planning', 'timeline']
    },
    {
      id: 'rachel-donor-renewal',
      title: 'Annual Donor Renewal Campaign',
      description: 'Systematic approach to donor renewal outreach',
      data: {
        workflowType: 'donor renewal',
        triggers: ['60 days before gift anniversary', 'Lapsed donor alert'],
        steps: [
          'Day -60: Segment donors by giving level',
          'Day -45: Personalized impact report',
          'Day -30: Renewal letter/email',
          'Day -15: Follow-up call for major donors',
          'Day -7: Final appeal with urgency',
          'Lapsed: Re-engagement series'
        ],
        goals: ['Increase renewal rate', 'Upgrade gift amounts', 'Reduce lapsed donors'],
        tools: ['CRM segments', 'Mail merge', 'Call tracking'],
        metrics: ['Renewal rate', 'Average gift increase', 'Cost per renewal']
      },
      tags: ['renewal', 'donors', 'campaigns']
    }
  ],
  
  alex: [
    {
      id: 'alex-digital-transformation',
      title: 'Digital Transformation Roadmap',
      description: 'Create a strategy for modernizing nonprofit operations',
      data: {
        strategyType: 'digital transformation',
        currentState: 'Paper-based processes, disconnected systems, limited online presence',
        desiredState: 'Integrated digital ecosystem, data-driven decisions, strong online engagement',
        timeframe: '18 months',
        keyInitiatives: [
          'Phase 1: Cloud migration and CRM implementation',
          'Phase 2: Digital fundraising platform',
          'Phase 3: Program delivery digitization',
          'Phase 4: Data analytics and reporting'
        ],
        successMetrics: ['Cost savings', 'Staff efficiency', 'Donor engagement', 'Program reach'],
        challenges: ['Change resistance', 'Budget constraints', 'Training needs'],
        budget: '$150,000 over 18 months'
      },
      tags: ['digital', 'transformation', 'technology']
    },
    {
      id: 'alex-culture-change',
      title: 'Building a Data-Driven Culture',
      description: 'Strategy for embedding data use across the organization',
      data: {
        strategyType: 'culture change',
        currentState: 'Decisions based on intuition, limited data literacy, siloed information',
        desiredState: 'Data-informed decisions at all levels, shared metrics, continuous learning',
        timeframe: '12 months',
        keyInitiatives: [
          'Leadership data champions program',
          'Monthly data storytelling workshops',
          'Department dashboard rollout',
          'Data literacy training series',
          'Celebrate data wins publicly'
        ],
        successMetrics: ['Dashboard usage', 'Data requests', 'Decision quality', 'Staff confidence'],
        challenges: ['Technical barriers', 'Time constraints', 'Skepticism'],
        budget: '$50,000 for training and tools'
      },
      tags: ['culture', 'data', 'change management']
    },
    {
      id: 'alex-growth-strategy',
      title: 'Scaling Impact Strategy',
      description: 'Plan for expanding programs to new communities',
      data: {
        strategyType: 'growth and scaling',
        currentState: 'Serving 1,000 beneficiaries in 2 locations',
        desiredState: 'Serving 5,000 beneficiaries in 10 locations',
        timeframe: '3 years',
        keyInitiatives: [
          'Year 1: Replicate model in 3 new sites',
          'Year 2: Develop franchise/partner model',
          'Year 3: Launch in 5 additional markets',
          'Ongoing: Quality assurance system',
          'Ongoing: Impact measurement framework'
        ],
        successMetrics: ['Beneficiaries served', 'Cost per outcome', 'Quality scores', 'Partner satisfaction'],
        challenges: ['Maintaining quality', 'Funding growth', 'Leadership capacity'],
        budget: '$2M additional funding needed'
      },
      tags: ['growth', 'scaling', 'expansion']
    },
    {
      id: 'alex-sustainability-plan',
      title: 'Financial Sustainability Strategy',
      description: 'Diversify revenue and build long-term stability',
      data: {
        strategyType: 'financial sustainability',
        currentState: '70% dependent on single government grant',
        desiredState: 'Diversified revenue with 6+ streams, 12-month reserves',
        timeframe: '2 years',
        keyInitiatives: [
          'Launch monthly giving program',
          'Develop earned income stream',
          'Build major donor pipeline',
          'Create corporate partnership program',
          'Establish endowment fund'
        ],
        successMetrics: ['Revenue diversity index', 'Recurring revenue %', 'Reserve months', 'Revenue growth'],
        challenges: ['Market competition', 'Initial investment', 'Board buy-in'],
        budget: '$100,000 investment for $500,000 return'
      },
      tags: ['sustainability', 'revenue', 'fundraising']
    },
    {
      id: 'alex-innovation-framework',
      title: 'Innovation and R&D Strategy',
      description: 'Build capacity for continuous innovation',
      data: {
        strategyType: 'innovation framework',
        currentState: 'Traditional service delivery, limited experimentation',
        desiredState: 'Innovation pipeline, rapid prototyping, evidence-based iteration',
        timeframe: '6 months to launch',
        keyInitiatives: [
          'Create innovation committee',
          'Dedicate 10% time for experiments',
          'Partner with universities',
          'Launch internal idea platform',
          'Quarterly innovation challenges'
        ],
        successMetrics: ['Ideas generated', 'Pilots launched', 'Successful implementations', 'Staff engagement'],
        challenges: ['Risk aversion', 'Resource allocation', 'Measuring success'],
        budget: '$75,000 annual innovation fund'
      },
      tags: ['innovation', 'R&D', 'experimentation']
    }
  ]
};

// Helper function to get examples for a specific character
export function getCharacterExamples(character: keyof CharacterExamples): AIExample[] {
  return AI_EXAMPLES[character] || [];
}

// Helper function to get a specific example by ID
export function getExampleById(character: keyof CharacterExamples, exampleId: string): AIExample | undefined {
  return AI_EXAMPLES[character]?.find(example => example.id === exampleId);
}

// Helper function to get examples by tag
export function getExamplesByTag(character: keyof CharacterExamples, tag: string): AIExample[] {
  return AI_EXAMPLES[character]?.filter(example => 
    example.tags?.includes(tag)
  ) || [];
}

// Helper function to get random example for a character
export function getRandomExample(character: keyof CharacterExamples): AIExample | undefined {
  const examples = AI_EXAMPLES[character];
  if (!examples || examples.length === 0) return undefined;
  
  const randomIndex = Math.floor(Math.random() * examples.length);
  return examples[randomIndex];
}