// Lazy load faker to reduce initial bundle size - only loaded when synthetic data is generated
let fakerInstance: any = null;

// Types and Interfaces
export interface NonprofitProfile {
  id: string;
  name: string;
  options: DataGenerationOptions;
  createdAt: string;
}

export interface DataGenerationOptions {
  organizationType: string;
  budgetRange: string;
  staffSize: string;
  geographicScope: string;
  programDescription?: string;
  donorTypes: string[];
  dataTypes: string[];
}

export interface GeneratedData {
  organization?: Organization;
  donors?: Donor[];
  volunteers?: Volunteer[];
  programs?: Program[];
  financials?: FinancialTransaction[];
  grants?: Grant[];
  events?: Event[];
  board?: BoardMember[];
  staff?: StaffMember[];
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  mission: string;
  founded: number;
  ein: string;
  address: Address;
  website: string;
  email: string;
  phone: string;
  annualBudget: number;
  staffCount: number;
  volunteerCount: number;
  programCount: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Donor {
  id: string;
  type: 'individual' | 'foundation' | 'corporate' | 'government';
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  firstGiftDate: string;
  lastGiftDate: string;
  totalGiving: number;
  giftCount: number;
  averageGift: number;
  donorLevel: string;
  interests: string[];
  communicationPreference: string;
  retentionRisk: 'low' | 'medium' | 'high';
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string[];
  hoursContributed: number;
  startDate: string;
  programs: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  startDate: string;
  endDate?: string;
  budget: number;
  participantCount: number;
  outcomes: string[];
  staffLead: string;
  volunteers: number;
  impactMetrics: {
    metric: string;
    value: number;
    unit: string;
  }[];
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  subcategory: string;
  amount: number;
  description: string;
  paymentMethod?: string;
  vendor?: string;
  program?: string;
  grantId?: string;
  approvedBy?: string;
}

export interface Grant {
  id: string;
  funder: string;
  program: string;
  amount: number;
  status: 'pending' | 'approved' | 'denied' | 'reporting';
  applicationDate: string;
  decisionDate?: string;
  startDate?: string;
  endDate?: string;
  reportingRequirements: string[];
  restrictions?: string[];
}

export interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  budget: number;
  revenue: number;
  attendeeTarget: number;
  actualAttendees?: number;
  description: string;
  sponsors: string[];
}

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  occupation: string;
  employer: string;
  joinDate: string;
  termEnd: string;
  committees: string[];
  skills: string[];
  givingLevel: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  startDate: string;
  salary: number;
  fullTime: boolean;
  supervisor?: string;
  directReports: string[];
}

// Budget range mappings
const budgetRanges = {
  micro: { min: 10000, max: 50000 },
  small: { min: 50000, max: 250000 },
  medium: { min: 250000, max: 1000000 },
  large: { min: 1000000, max: 10000000 },
  major: { min: 10000000, max: 50000000 },
  enterprise: { min: 50000000, max: 500000000 }
};

// Staff size mappings
const staffSizes = {
  volunteer: { min: 0, max: 0 },
  minimal: { min: 1, max: 5 },
  small: { min: 6, max: 20 },
  medium: { min: 21, max: 50 },
  large: { min: 51, max: 200 },
  enterprise: { min: 201, max: 1000 }
};

// Organization type templates
const orgTypeTemplates: Record<string, any> = {
  arts: {
    programs: ['Gallery Exhibitions', 'Art Classes', 'Community Workshops', 'Artist Residencies'],
    donorInterests: ['Visual Arts', 'Performing Arts', 'Cultural Preservation', 'Youth Arts Education'],
    missionKeywords: ['creativity', 'culture', 'expression', 'community', 'arts education']
  },
  education: {
    programs: ['Tutoring', 'STEM Programs', 'Literacy Initiatives', 'College Prep', 'Adult Education'],
    donorInterests: ['Youth Development', 'Academic Achievement', 'STEM Education', 'Educational Equity'],
    missionKeywords: ['learning', 'achievement', 'opportunity', 'education', 'empowerment']
  },
  health: {
    programs: ['Health Screenings', 'Mental Health Services', 'Nutrition Programs', 'Fitness Classes'],
    donorInterests: ['Public Health', 'Mental Health', 'Healthcare Access', 'Disease Prevention'],
    missionKeywords: ['health', 'wellness', 'care', 'healing', 'prevention']
  },
  humanServices: {
    programs: ['Food Pantry', 'Housing Assistance', 'Job Training', 'Emergency Services'],
    donorInterests: ['Poverty Alleviation', 'Housing', 'Food Security', 'Social Services'],
    missionKeywords: ['support', 'dignity', 'assistance', 'community', 'empowerment']
  },
  environment: {
    programs: ['Conservation Projects', 'Environmental Education', 'Clean-up Initiatives', 'Wildlife Protection'],
    donorInterests: ['Conservation', 'Climate Action', 'Sustainability', 'Wildlife Protection'],
    missionKeywords: ['environment', 'conservation', 'sustainability', 'nature', 'future']
  }
};

// Generate organization data
function generateOrganization(options: DataGenerationOptions): Organization {
  const template = orgTypeTemplates[options.organizationType] || orgTypeTemplates.humanServices;
  const budgetRange = budgetRanges[options.budgetRange];
  const staffRange = staffSizes[options.staffSize];
  const budget = fakerInstance.number.int({ min: budgetRange.min, max: budgetRange.max });
  const staffCount = fakerInstance.number.int({ min: staffRange.min, max: staffRange.max });

  const orgName = generateOrgName(options.organizationType);
  
  return {
    id: fakerInstance.string.uuid(),
    name: orgName,
    type: options.organizationType,
    mission: generateMission(template.missionKeywords, options.organizationType),
    founded: fakerInstance.number.int({ min: 1950, max: 2020 }),
    ein: generateEIN(),
    address: {
      street: fakerInstance.location.streetAddress(),
      city: fakerInstance.location.city(),
      state: fakerInstance.location.state({ abbreviated: true }),
      zip: fakerInstance.location.zipCode(),
      country: 'USA'
    },
    website: `www.${orgName.toLowerCase().replace(/\s+/g, '')}.org`,
    email: `info@${orgName.toLowerCase().replace(/\s+/g, '')}.org`,
    phone: fakerInstance.phone.number('###-###-####'),
    annualBudget: budget,
    staffCount: staffCount,
    volunteerCount: Math.floor(staffCount * fakerInstance.number.float({ min: 2, max: 10 })),
    programCount: fakerInstance.number.int({ min: 3, max: 15 })
  };
}

// Generate realistic nonprofit names
function generateOrgName(type: string): string {
  const prefixes = {
    arts: ['Creative', 'Cultural', 'Artistic', 'Community Arts'],
    education: ['Learning', 'Academy', 'Educational', 'Scholar'],
    health: ['Health', 'Wellness', 'Care', 'Medical'],
    humanServices: ['Community', 'Hope', 'Helping Hands', 'United'],
    environment: ['Green', 'Earth', 'Conservation', 'Environmental']
  };

  const suffixes = {
    arts: ['Center', 'Alliance', 'Collective', 'Foundation'],
    education: ['Institute', 'Foundation', 'Center', 'Academy'],
    health: ['Clinic', 'Center', 'Services', 'Foundation'],
    humanServices: ['Services', 'Foundation', 'Alliance', 'Network'],
    environment: ['Initiative', 'Alliance', 'Trust', 'Foundation']
  };

  const prefix = fakerInstance.helpers.arrayElement(prefixes[type] || prefixes.humanServices);
  const suffix = fakerInstance.helpers.arrayElement(suffixes[type] || suffixes.humanServices);
  const location = fakerInstance.location.city();

  return `${prefix} ${location} ${suffix}`;
}

// Generate mission statement
function generateMission(keywords: string[], type: string): string {
  const templates = [
    `Our mission is to enhance {keyword1} and promote {keyword2} in our community through innovative programs and dedicated service.`,
    `We are committed to advancing {keyword1} and fostering {keyword2} for all members of our community.`,
    `Dedicated to {keyword1} and {keyword2}, we work to create lasting positive change in the lives we touch.`,
    `We believe in the power of {keyword1} to transform lives and build stronger communities through {keyword2}.`
  ];

  const template = fakerInstance.helpers.arrayElement(templates);
  const keyword1 = fakerInstance.helpers.arrayElement(keywords);
  const keyword2 = fakerInstance.helpers.arrayElement(keywords.filter(k => k !== keyword1));

  return template.replace('{keyword1}', keyword1).replace('{keyword2}', keyword2);
}

// Generate EIN
function generateEIN(): string {
  return `${fakerInstance.number.int({ min: 10, max: 99 })}-${fakerInstance.number.int({ min: 1000000, max: 9999999 })}`;
}

// Generate donors
function generateDonors(count: number, organization: Organization, donorTypes: string[]): Donor[] {
  const donors: Donor[] = [];
  const donorLevels = [
    { name: 'Platinum', min: 10000, max: 100000 },
    { name: 'Gold', min: 5000, max: 9999 },
    { name: 'Silver', min: 1000, max: 4999 },
    { name: 'Bronze', min: 500, max: 999 },
    { name: 'Friend', min: 1, max: 499 }
  ];

  for (let i = 0; i < count; i++) {
    const type = fakerInstance.helpers.arrayElement(donorTypes.filter(t => 
      ['individuals', 'foundations', 'corporations', 'government'].includes(t)
    ).map(t => t.replace('individuals', 'individual'))) as Donor['type'];
    
    const level = fakerInstance.helpers.arrayElement(donorLevels);
    const totalGiving = fakerInstance.number.int({ min: level.min, max: level.max });
    const giftCount = fakerInstance.number.int({ min: 1, max: 20 });

    donors.push({
      id: fakerInstance.string.uuid(),
      type,
      name: type === 'individual' ? fakerInstance.person.fullName() : fakerInstance.company.name() + ' Foundation',
      email: type === 'individual' ? fakerInstance.internet.email() : undefined,
      phone: fakerInstance.phone.number('###-###-####'),
      address: {
        street: fakerInstance.location.streetAddress(),
        city: fakerInstance.location.city(),
        state: fakerInstance.location.state({ abbreviated: true }),
        zip: fakerInstance.location.zipCode(),
        country: 'USA'
      },
      firstGiftDate: fakerInstance.date.past({ years: 5 }).toISOString(),
      lastGiftDate: fakerInstance.date.recent({ days: 365 }).toISOString(),
      totalGiving,
      giftCount,
      averageGift: Math.floor(totalGiving / giftCount),
      donorLevel: level.name,
      interests: fakerInstance.helpers.arrayElements(
        orgTypeTemplates[organization.type]?.donorInterests || ['General Support'],
        fakerInstance.number.int({ min: 1, max: 3 })
      ),
      communicationPreference: fakerInstance.helpers.arrayElement(['Email', 'Mail', 'Phone', 'No Contact']),
      retentionRisk: fakerInstance.helpers.weightedArrayElement([
        { value: 'low', weight: 60 },
        { value: 'medium', weight: 30 },
        { value: 'high', weight: 10 }
      ]) as 'low' | 'medium' | 'high'
    });
  }

  return donors;
}

// Generate volunteers
function generateVolunteers(count: number, programs: Program[]): Volunteer[] {
  const volunteers: Volunteer[] = [];
  const skills = [
    'Event Planning', 'Fundraising', 'Teaching', 'Mentoring', 'Administrative',
    'Marketing', 'Social Media', 'Photography', 'Grant Writing', 'Data Entry',
    'Cooking', 'Transportation', 'Translation', 'IT Support', 'Graphic Design'
  ];

  const availability = [
    'Monday Morning', 'Monday Afternoon', 'Monday Evening',
    'Tuesday Morning', 'Tuesday Afternoon', 'Tuesday Evening',
    'Wednesday Morning', 'Wednesday Afternoon', 'Wednesday Evening',
    'Thursday Morning', 'Thursday Afternoon', 'Thursday Evening',
    'Friday Morning', 'Friday Afternoon', 'Friday Evening',
    'Saturday Morning', 'Saturday Afternoon',
    'Sunday Morning', 'Sunday Afternoon'
  ];

  for (let i = 0; i < count; i++) {
    volunteers.push({
      id: fakerInstance.string.uuid(),
      name: fakerInstance.person.fullName(),
      email: fakerInstance.internet.email(),
      phone: fakerInstance.phone.number('###-###-####'),
      skills: fakerInstance.helpers.arrayElements(skills, fakerInstance.number.int({ min: 1, max: 5 })),
      availability: fakerInstance.helpers.arrayElements(availability, fakerInstance.number.int({ min: 2, max: 8 })),
      hoursContributed: fakerInstance.number.int({ min: 10, max: 500 }),
      startDate: fakerInstance.date.past({ years: 3 }).toISOString(),
      programs: fakerInstance.helpers.arrayElements(
        programs.map(p => p.name),
        fakerInstance.number.int({ min: 1, max: Math.min(3, programs.length) })
      ),
      emergencyContact: {
        name: fakerInstance.person.fullName(),
        phone: fakerInstance.phone.number('###-###-####'),
        relationship: fakerInstance.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
      }
    });
  }

  return volunteers;
}

// Generate programs
function generatePrograms(organization: Organization, options: DataGenerationOptions): Program[] {
  const programs: Program[] = [];
  const template = orgTypeTemplates[organization.type];
  const programNames = template?.programs || ['General Program'];
  
  const categories = {
    arts: ['Visual Arts', 'Performing Arts', 'Literary Arts', 'Media Arts'],
    education: ['Academic Support', 'STEM', 'Life Skills', 'Career Development'],
    health: ['Physical Health', 'Mental Health', 'Preventive Care', 'Health Education'],
    humanServices: ['Basic Needs', 'Housing', 'Employment', 'Family Services'],
    environment: ['Conservation', 'Education', 'Advocacy', 'Research']
  };

  const programCategories = categories[organization.type] || categories.humanServices;

  for (let i = 0; i < Math.min(programNames.length, organization.programCount); i++) {
    const budget = organization.annualBudget * fakerInstance.number.float({ min: 0.05, max: 0.3 });
    
    programs.push({
      id: fakerInstance.string.uuid(),
      name: programNames[i],
      description: generateProgramDescription(programNames[i], organization.type),
      category: fakerInstance.helpers.arrayElement(programCategories),
      startDate: fakerInstance.date.past({ years: 2 }).toISOString(),
      endDate: fakerInstance.helpers.maybe(() => fakerInstance.date.future({ years: 1 }).toISOString(), { probability: 0.3 }),
      budget: Math.floor(budget),
      participantCount: fakerInstance.number.int({ min: 10, max: 500 }),
      outcomes: generateOutcomes(organization.type),
      staffLead: fakerInstance.person.fullName(),
      volunteers: fakerInstance.number.int({ min: 2, max: 20 }),
      impactMetrics: generateImpactMetrics(organization.type)
    });
  }

  // Add custom programs from description if provided
  if (options.programDescription) {
    const customPrograms = options.programDescription.split(',').map(p => p.trim());
    customPrograms.forEach(programName => {
      if (programs.length < organization.programCount) {
        const budget = organization.annualBudget * fakerInstance.number.float({ min: 0.05, max: 0.3 });
        programs.push({
          id: fakerInstance.string.uuid(),
          name: programName,
          description: `${programName} is a vital program that serves our community's needs.`,
          category: fakerInstance.helpers.arrayElement(programCategories),
          startDate: fakerInstance.date.past({ years: 2 }).toISOString(),
          budget: Math.floor(budget),
          participantCount: fakerInstance.number.int({ min: 10, max: 500 }),
          outcomes: generateOutcomes(organization.type),
          staffLead: fakerInstance.person.fullName(),
          volunteers: fakerInstance.number.int({ min: 2, max: 20 }),
          impactMetrics: generateImpactMetrics(organization.type)
        });
      }
    });
  }

  return programs;
}

// Generate program description
function generateProgramDescription(programName: string, orgType: string): string {
  const descriptions = {
    arts: `${programName} provides creative opportunities for community members to explore and develop their artistic talents through hands-on experiences and professional instruction.`,
    education: `${programName} offers comprehensive educational support to help participants achieve academic success and reach their full potential.`,
    health: `${programName} delivers essential health services and education to improve the well-being of our community members.`,
    humanServices: `${programName} addresses critical needs in our community by providing direct services and support to those who need it most.`,
    environment: `${programName} works to protect and preserve our natural environment through education, advocacy, and direct action.`
  };

  return descriptions[orgType] || descriptions.humanServices;
}

// Generate outcomes
function generateOutcomes(orgType: string): string[] {
  const outcomeTemplates = {
    arts: [
      'Increased creative expression and confidence',
      'Development of artistic skills and techniques',
      'Greater community engagement with the arts',
      'Cultural enrichment and preservation'
    ],
    education: [
      'Improved academic performance',
      'Increased graduation rates',
      'Enhanced critical thinking skills',
      'Greater college and career readiness'
    ],
    health: [
      'Improved health outcomes',
      'Increased access to care',
      'Better health literacy',
      'Reduced health disparities'
    ],
    humanServices: [
      'Increased housing stability',
      'Improved food security',
      'Enhanced employment opportunities',
      'Stronger family relationships'
    ],
    environment: [
      'Reduced environmental impact',
      'Increased conservation awareness',
      'Protected natural habitats',
      'Sustainable community practices'
    ]
  };

  const outcomes = outcomeTemplates[orgType] || outcomeTemplates.humanServices;
  return fakerInstance.helpers.arrayElements(outcomes, fakerInstance.number.int({ min: 2, max: 4 }));
}

// Generate impact metrics
function generateImpactMetrics(orgType: string): { metric: string; value: number; unit: string }[] {
  const metricsTemplates = {
    arts: [
      { metric: 'Students Served', min: 50, max: 500, unit: 'students' },
      { metric: 'Performances Held', min: 5, max: 50, unit: 'events' },
      { metric: 'Community Attendance', min: 500, max: 5000, unit: 'attendees' }
    ],
    education: [
      { metric: 'Students Tutored', min: 20, max: 200, unit: 'students' },
      { metric: 'Grade Improvement', min: 1, max: 2, unit: 'grade levels' },
      { metric: 'Graduation Rate', min: 75, max: 95, unit: 'percent' }
    ],
    health: [
      { metric: 'Patients Served', min: 100, max: 1000, unit: 'patients' },
      { metric: 'Screenings Provided', min: 50, max: 500, unit: 'screenings' },
      { metric: 'Health Education Hours', min: 100, max: 1000, unit: 'hours' }
    ],
    humanServices: [
      { metric: 'Meals Provided', min: 1000, max: 10000, unit: 'meals' },
      { metric: 'Families Assisted', min: 50, max: 500, unit: 'families' },
      { metric: 'Housing Placements', min: 10, max: 100, unit: 'placements' }
    ],
    environment: [
      { metric: 'Acres Protected', min: 10, max: 1000, unit: 'acres' },
      { metric: 'Volunteers Engaged', min: 50, max: 500, unit: 'volunteers' },
      { metric: 'Trees Planted', min: 100, max: 5000, unit: 'trees' }
    ]
  };

  const templates = metricsTemplates[orgType] || metricsTemplates.humanServices;
  return templates.map(template => ({
    metric: template.metric,
    value: fakerInstance.number.int({ min: template.min, max: template.max }),
    unit: template.unit
  }));
}

// Generate financial transactions
function generateFinancialTransactions(
  count: number, 
  organization: Organization, 
  programs: Program[]
): FinancialTransaction[] {
  const transactions: FinancialTransaction[] = [];
  
  const incomeCategories = [
    { category: 'Donations', subcategories: ['Individual', 'Corporate', 'Foundation', 'Major Gift'] },
    { category: 'Grants', subcategories: ['Federal', 'State', 'Local', 'Private Foundation'] },
    { category: 'Events', subcategories: ['Gala', 'Auction', 'Walk/Run', 'Concert'] },
    { category: 'Earned Revenue', subcategories: ['Program Fees', 'Membership', 'Merchandise', 'Services'] }
  ];

  const expenseCategories = [
    { category: 'Personnel', subcategories: ['Salaries', 'Benefits', 'Payroll Taxes', 'Professional Development'] },
    { category: 'Programs', subcategories: ['Supplies', 'Equipment', 'Transportation', 'Contracted Services'] },
    { category: 'Operations', subcategories: ['Rent', 'Utilities', 'Insurance', 'Technology'] },
    { category: 'Fundraising', subcategories: ['Events', 'Materials', 'Consulting', 'Direct Mail'] }
  ];

  for (let i = 0; i < count; i++) {
    const type = fakerInstance.helpers.arrayElement(['income', 'expense']) as 'income' | 'expense';
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const categoryData = fakerInstance.helpers.arrayElement(categories);
    
    transactions.push({
      id: fakerInstance.string.uuid(),
      date: fakerInstance.date.recent({ days: 365 }).toISOString(),
      type,
      category: categoryData.category,
      subcategory: fakerInstance.helpers.arrayElement(categoryData.subcategories),
      amount: fakerInstance.number.int({ 
        min: type === 'income' ? 100 : 50, 
        max: type === 'income' ? 50000 : 10000 
      }),
      description: fakerInstance.lorem.sentence(),
      paymentMethod: type === 'income' 
        ? fakerInstance.helpers.arrayElement(['Check', 'Credit Card', 'ACH', 'Cash', 'Wire Transfer'])
        : fakerInstance.helpers.arrayElement(['Check', 'Credit Card', 'ACH', 'Purchase Order']),
      vendor: type === 'expense' ? fakerInstance.company.name() : undefined,
      program: fakerInstance.helpers.maybe(() => fakerInstance.helpers.arrayElement(programs).name, { probability: 0.6 }),
      approvedBy: type === 'expense' && fakerInstance.number.int({ min: 1, max: 100 }) > 1000 
        ? fakerInstance.person.fullName() 
        : undefined
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate grants
function generateGrants(organization: Organization, programs: Program[]): Grant[] {
  const grants: Grant[] = [];
  const grantCount = fakerInstance.number.int({ min: 2, max: 10 });

  const funders = [
    'Community Foundation', 'State Arts Council', 'Federal Agency',
    'Private Family Foundation', 'Corporate Foundation', 'United Way',
    'National Endowment', 'Regional Foundation', 'Health Foundation'
  ];

  for (let i = 0; i < grantCount; i++) {
    const amount = fakerInstance.number.int({ min: 5000, max: Math.min(500000, organization.annualBudget * 0.3) });
    const status = fakerInstance.helpers.weightedArrayElement([
      { value: 'approved', weight: 50 },
      { value: 'pending', weight: 20 },
      { value: 'reporting', weight: 25 },
      { value: 'denied', weight: 5 }
    ]) as Grant['status'];

    grants.push({
      id: fakerInstance.string.uuid(),
      funder: fakerInstance.helpers.arrayElement(funders),
      program: fakerInstance.helpers.arrayElement(programs).name,
      amount,
      status,
      applicationDate: fakerInstance.date.past({ years: 1 }).toISOString(),
      decisionDate: status !== 'pending' ? fakerInstance.date.recent({ days: 90 }).toISOString() : undefined,
      startDate: status === 'approved' || status === 'reporting' 
        ? fakerInstance.date.recent({ days: 30 }).toISOString() 
        : undefined,
      endDate: status === 'approved' || status === 'reporting'
        ? fakerInstance.date.future({ years: 1 }).toISOString()
        : undefined,
      reportingRequirements: status === 'approved' || status === 'reporting'
        ? fakerInstance.helpers.arrayElements([
            'Quarterly Financial Reports',
            'Annual Impact Report',
            'Program Evaluation',
            'Participant Demographics',
            'Success Stories'
          ], fakerInstance.number.int({ min: 2, max: 4 }))
        : [],
      restrictions: fakerInstance.helpers.maybe(() => 
        fakerInstance.helpers.arrayElements([
          'Program expenses only',
          'No overhead costs',
          'Direct services only',
          'Specific demographic focus'
        ], fakerInstance.number.int({ min: 1, max: 2 })),
        { probability: 0.4 }
      )
    });
  }

  return grants;
}

// Generate events
function generateEvents(organization: Organization): Event[] {
  const events: Event[] = [];
  const eventCount = fakerInstance.number.int({ min: 2, max: 8 });

  const eventTypes = {
    arts: ['Gallery Opening', 'Performance', 'Art Auction', 'Workshop Series'],
    education: ['Graduation Ceremony', 'Science Fair', 'Literacy Night', 'College Fair'],
    health: ['Health Fair', '5K Run/Walk', 'Wellness Workshop', 'Screening Event'],
    humanServices: ['Community Dinner', 'Resource Fair', 'Volunteer Appreciation', 'Holiday Drive'],
    environment: ['Earth Day Festival', 'Clean-up Day', 'Nature Walk', 'Educational Seminar']
  };

  const types = eventTypes[organization.type] || eventTypes.humanServices;

  for (let i = 0; i < eventCount; i++) {
    const budget = fakerInstance.number.int({ min: 1000, max: 50000 });
    const revenueMultiplier = fakerInstance.number.float({ min: 1.5, max: 4 });
    
    events.push({
      id: fakerInstance.string.uuid(),
      name: fakerInstance.helpers.arrayElement(types),
      type: fakerInstance.helpers.arrayElement(['Fundraising', 'Program', 'Community', 'Awareness']),
      date: fakerInstance.date.future({ years: 1 }).toISOString(),
      location: fakerInstance.helpers.arrayElement([
        organization.address.city + ' Convention Center',
        organization.name + ' Main Office',
        'Local Park Pavilion',
        'Community Center',
        'Hotel Ballroom'
      ]),
      budget,
      revenue: Math.floor(budget * revenueMultiplier),
      attendeeTarget: fakerInstance.number.int({ min: 50, max: 500 }),
      actualAttendees: fakerInstance.helpers.maybe(() => 
        fakerInstance.number.int({ min: 30, max: 600 }), 
        { probability: 0.5 }
      ),
      description: fakerInstance.lorem.paragraph(),
      sponsors: fakerInstance.helpers.arrayElements([
        fakerInstance.company.name(),
        fakerInstance.company.name() + ' Bank',
        fakerInstance.company.name() + ' Foundation',
        'Local Business Alliance',
        'Community Partners'
      ], fakerInstance.number.int({ min: 0, max: 5 }))
    });
  }

  return events;
}

// Generate board members
function generateBoardMembers(organization: Organization): BoardMember[] {
  const boardMembers: BoardMember[] = [];
  const boardSize = fakerInstance.number.int({ min: 7, max: 21 });

  const committees = [
    'Executive', 'Finance', 'Development', 'Programs', 
    'Governance', 'Marketing', 'Audit', 'Strategic Planning'
  ];

  const skills = [
    'Financial Management', 'Legal', 'Marketing', 'Fundraising',
    'Strategic Planning', 'Human Resources', 'Technology',
    'Program Expertise', 'Community Relations', 'Government Relations'
  ];

  const titles = ['Board Chair', 'Vice Chair', 'Treasurer', 'Secretary'];
  const remainingTitles = Array(boardSize - titles.length).fill('Board Member');
  const allTitles = [...titles, ...remainingTitles];

  for (let i = 0; i < boardSize; i++) {
    boardMembers.push({
      id: fakerInstance.string.uuid(),
      name: fakerInstance.person.fullName(),
      title: allTitles[i],
      email: fakerInstance.internet.email(),
      phone: fakerInstance.phone.number('###-###-####'),
      occupation: fakerInstance.person.jobTitle(),
      employer: fakerInstance.company.name(),
      joinDate: fakerInstance.date.past({ years: 5 }).toISOString(),
      termEnd: fakerInstance.date.future({ years: 3 }).toISOString(),
      committees: fakerInstance.helpers.arrayElements(committees, fakerInstance.number.int({ min: 1, max: 3 })),
      skills: fakerInstance.helpers.arrayElements(skills, fakerInstance.number.int({ min: 2, max: 4 })),
      givingLevel: fakerInstance.helpers.arrayElement(['Platinum', 'Gold', 'Silver', 'Bronze'])
    });
  }

  return boardMembers;
}

// Generate staff members
function generateStaffMembers(organization: Organization): StaffMember[] {
  const staffMembers: StaffMember[] = [];
  const departments = ['Executive', 'Programs', 'Development', 'Finance', 'Operations', 'Marketing'];
  
  // Executive positions
  const executivePositions = [
    { title: 'Executive Director', salary: { min: 60000, max: 150000 } },
    { title: 'Associate Director', salary: { min: 50000, max: 100000 } }
  ];

  // Department heads
  const departmentHeads = [
    { title: 'Director of Programs', salary: { min: 45000, max: 90000 } },
    { title: 'Director of Development', salary: { min: 45000, max: 90000 } },
    { title: 'Finance Director', salary: { min: 50000, max: 95000 } }
  ];

  // Regular staff
  const staffPositions = [
    { title: 'Program Manager', salary: { min: 35000, max: 65000 } },
    { title: 'Development Associate', salary: { min: 30000, max: 55000 } },
    { title: 'Administrative Assistant', salary: { min: 25000, max: 45000 } },
    { title: 'Communications Coordinator', salary: { min: 32000, max: 58000 } }
  ];

  // Scale salaries based on budget
  const salaryMultiplier = organization.annualBudget > 1000000 ? 1.2 : 
                          organization.annualBudget > 500000 ? 1.0 : 0.8;

  // Add executive staff
  executivePositions.forEach((position, index) => {
    if (index < Math.min(2, organization.staffCount)) {
      staffMembers.push({
        id: fakerInstance.string.uuid(),
        name: fakerInstance.person.fullName(),
        title: position.title,
        department: 'Executive',
        email: fakerInstance.internet.email(),
        phone: fakerInstance.phone.number('###-###-####'),
        startDate: fakerInstance.date.past({ years: 5 }).toISOString(),
        salary: Math.floor(fakerInstance.number.int(position.salary) * salaryMultiplier),
        fullTime: true,
        directReports: []
      });
    }
  });

  // Add remaining staff
  const remainingStaff = organization.staffCount - staffMembers.length;
  for (let i = 0; i < remainingStaff; i++) {
    const isHead = i < departmentHeads.length && organization.staffCount > 10;
    const position = isHead ? departmentHeads[i] : fakerInstance.helpers.arrayElement(staffPositions);
    
    staffMembers.push({
      id: fakerInstance.string.uuid(),
      name: fakerInstance.person.fullName(),
      title: position.title,
      department: fakerInstance.helpers.arrayElement(departments.filter(d => d !== 'Executive')),
      email: fakerInstance.internet.email(),
      phone: fakerInstance.phone.number('###-###-####'),
      startDate: fakerInstance.date.past({ years: 3 }).toISOString(),
      salary: Math.floor(fakerInstance.number.int(position.salary) * salaryMultiplier),
      fullTime: fakerInstance.helpers.weightedArrayElement([
        { value: true, weight: 80 },
        { value: false, weight: 20 }
      ]),
      supervisor: staffMembers.length > 0 ? staffMembers[0].id : undefined,
      directReports: []
    });
  }

  // Set up reporting relationships
  if (staffMembers.length > 2) {
    const executive = staffMembers[0];
    const managers = staffMembers.slice(1, Math.min(4, staffMembers.length));
    
    managers.forEach(manager => {
      executive.directReports.push(manager.id);
      manager.supervisor = executive.id;
    });

    const staff = staffMembers.slice(4);
    staff.forEach(member => {
      const supervisor = fakerInstance.helpers.arrayElement(managers);
      supervisor.directReports.push(member.id);
      member.supervisor = supervisor.id;
    });
  }

  return staffMembers;
}

// Main data generation function
export async function generateSyntheticData(options: DataGenerationOptions): Promise<GeneratedData> {
  // Lazy load faker only when synthetic data is actually needed
  if (!fakerInstance) {
    const { faker } = await import('@faker-js/faker');
    fakerInstance = faker;
  }

  const data: GeneratedData = {};

  // Always generate organization
  const organization = generateOrganization(options);
  data.organization = organization;

  // Generate programs first as other data depends on them
  const programs = generatePrograms(organization, options);
  data.programs = programs;

  // Generate requested data types
  if (options.dataTypes.includes('donors')) {
    const donorCount = Math.floor(organization.annualBudget / 1000);
    data.donors = generateDonors(
      Math.min(donorCount, 1000), 
      organization, 
      options.donorTypes
    );
  }

  if (options.dataTypes.includes('volunteers')) {
    data.volunteers = generateVolunteers(
      fakerInstance.number.int({ min: 20, max: 200 }), 
      programs
    );
  }

  if (options.dataTypes.includes('financials')) {
    data.financials = generateFinancialTransactions(
      fakerInstance.number.int({ min: 50, max: 500 }),
      organization,
      programs
    );
  }

  if (options.dataTypes.includes('grants')) {
    data.grants = generateGrants(organization, programs);
  }

  if (options.dataTypes.includes('events')) {
    data.events = generateEvents(organization);
  }

  if (options.dataTypes.includes('board')) {
    data.board = generateBoardMembers(organization);
  }

  if (options.dataTypes.includes('staff')) {
    data.staff = generateStaffMembers(organization);
  }

  return data;
}

// Save profile to localStorage
export function saveSyntheticProfile(profile: NonprofitProfile): void {
  const profiles = loadSyntheticProfile();
  profiles.push(profile);
  localStorage.setItem('syntheticProfiles', JSON.stringify(profiles));
}

// Load profiles from localStorage
export function loadSyntheticProfile(): NonprofitProfile[] {
  const stored = localStorage.getItem('syntheticProfiles');
  return stored ? JSON.parse(stored) : [];
}

// Export data in different formats
export function exportData(data: GeneratedData, format: 'json' | 'csv'): void {
  if (format === 'json') {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic-nonprofit-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else if (format === 'csv') {
    // For CSV, we'll export each data type as a separate file
    const exportCSV = (dataArray: any[], filename: string) => {
      if (!dataArray || dataArray.length === 0) return;
      
      const headers = Object.keys(dataArray[0]);
      const csvContent = [
        headers.join(','),
        ...dataArray.map(item => 
          headers.map(header => {
            const value = item[header];
            if (typeof value === 'object') {
              return JSON.stringify(value).replace(/"/g, '""');
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // Export each data type
    if (data.donors) exportCSV(data.donors, `donors-${Date.now()}.csv`);
    if (data.volunteers) exportCSV(data.volunteers, `volunteers-${Date.now()}.csv`);
    if (data.programs) exportCSV(data.programs, `programs-${Date.now()}.csv`);
    if (data.financials) exportCSV(data.financials, `financials-${Date.now()}.csv`);
    if (data.grants) exportCSV(data.grants, `grants-${Date.now()}.csv`);
    if (data.events) exportCSV(data.events, `events-${Date.now()}.csv`);
    if (data.board) exportCSV(data.board, `board-${Date.now()}.csv`);
    if (data.staff) exportCSV(data.staff, `staff-${Date.now()}.csv`);
  }
}