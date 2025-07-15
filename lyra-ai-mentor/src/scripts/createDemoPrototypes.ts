/**
 * DEMO PROTOTYPE CREATION SCRIPT
 * Creates 5 strategic lesson prototypes for testing
 */

export interface DemoPrototypeTemplate {
  name: string;
  character: string;
  concept: string;
  objectives: string[];
  testInteractions: Array<{
    type: 'email-composer' | 'data-analyzer' | 'automation-builder' | 'voice-interface' | 'conversation-handler';
    prompt: string;
    expectedFocus: string;
  }>;
}

export const DEMO_PROTOTYPES: DemoPrototypeTemplate[] = [
  {
    name: "Maya Chapter 3: Advanced Tone Mastery & Relationship Building",
    character: "Maya",
    concept: "Advanced lesson focusing on sophisticated tone adaptation for different stakeholder relationships. Maya guides users through complex communication scenarios including board presentations, donor relations, community outreach, and crisis communication. Builds on Chapter 2's foundation with nuanced relationship management.",
    objectives: [
      "Master tone adaptation for different stakeholder types (donors, board, community, media)",
      "Navigate complex relationship dynamics in nonprofit communications",
      "Handle sensitive and crisis communications with appropriate tone",
      "Build long-term stakeholder relationships through consistent communication style",
      "Integrate emotional intelligence with professional communication strategies"
    ],
    testInteractions: [
      {
        type: 'email-composer',
        prompt: "Write a delicate email to a major donor who expressed concerns about our program effectiveness after reading negative media coverage",
        expectedFocus: "Sophisticated tone that acknowledges concerns while rebuilding confidence"
      },
      {
        type: 'conversation-handler',
        prompt: "Handle a tense board meeting where members are questioning leadership decisions and budget allocation",
        expectedFocus: "Professional, transparent communication that maintains authority while showing accountability"
      },
      {
        type: 'email-composer',
        prompt: "Craft a community announcement about program changes that some stakeholders oppose",
        expectedFocus: "Balanced tone that respects concerns while communicating necessary changes"
      }
    ]
  },

  {
    name: "Sofia Voice Revolution Lab",
    character: "Sofia",
    concept: "Interactive workshop where Sofia demonstrates cutting-edge AI voice tools for nonprofit accessibility and outreach. Users learn to implement voice interfaces, automated phone systems, and audio content creation. Focus on breaking down barriers and reaching underserved communities through voice technology.",
    objectives: [
      "Implement AI voice tools for accessibility (visually impaired, elderly, non-English speakers)",
      "Create automated voice systems for volunteer coordination and donor outreach",
      "Develop multilingual voice content for diverse communities",
      "Design voice-first user experiences for nonprofit services",
      "Measure and improve voice interaction effectiveness"
    ],
    testInteractions: [
      {
        type: 'voice-interface',
        prompt: "Design a voice-activated volunteer check-in system for a food bank that serves Spanish and English speaking communities",
        expectedFocus: "Multilingual accessibility with clear, warm voice interactions"
      },
      {
        type: 'automation-builder',
        prompt: "Create an automated phone system that helps elderly clients navigate our transportation services",
        expectedFocus: "Patient, clear voice automation designed for older adults"
      },
      {
        type: 'voice-interface',
        prompt: "Build a voice interface for blind and visually impaired users to access our resource database",
        expectedFocus: "Comprehensive accessibility with intuitive voice navigation"
      }
    ]
  },

  {
    name: "David Data Detective Challenge",
    character: "David",
    concept: "Mystery-solving adventure where David teaches data analysis through investigating nonprofit impact questions. Users become 'data detectives' uncovering insights about program effectiveness, donor behavior, and community needs. Combines storytelling with practical data skills using real nonprofit scenarios.",
    objectives: [
      "Investigate program impact using data analysis techniques",
      "Uncover hidden patterns in donor and volunteer behavior",
      "Solve community needs assessment puzzles through data",
      "Create compelling data stories that drive organizational decisions",
      "Build confidence in data interpretation and presentation"
    ],
    testInteractions: [
      {
        type: 'data-analyzer',
        prompt: "Investigate why our youth mentoring program shows great attendance but poor long-term outcomes - what does the data reveal?",
        expectedFocus: "Detective-style data exploration revealing correlation vs causation insights"
      },
      {
        type: 'email-composer',
        prompt: "Present data findings about declining volunteer retention to the board in a way that motivates action rather than blame",
        expectedFocus: "Data storytelling that transforms numbers into compelling narratives"
      },
      {
        type: 'data-analyzer',
        prompt: "Analyze donation patterns to predict which donors are at risk of lapsing and why",
        expectedFocus: "Predictive analysis with actionable insights for donor relations"
      }
    ]
  },

  {
    name: "Rachel Automation Academy",
    character: "Rachel",
    concept: "Comprehensive training program where Rachel systematically transforms nonprofit operations through intelligent automation. Users learn to identify automation opportunities, design workflows, and implement systems that free up time for mission-critical work. Focus on practical, implementable solutions.",
    objectives: [
      "Identify high-impact automation opportunities in nonprofit operations",
      "Design and implement donor management automation workflows",
      "Create volunteer coordination and communication systems",
      "Automate reporting and compliance processes",
      "Build scalable systems that grow with organizational needs"
    ],
    testInteractions: [
      {
        type: 'automation-builder',
        prompt: "Design a complete new donor onboarding automation that personalizes the experience based on donation source and amount",
        expectedFocus: "Systematic workflow design with personalization and follow-up sequences"
      },
      {
        type: 'automation-builder',
        prompt: "Create an automated volunteer scheduling system that handles availability, skills matching, and reminder communications",
        expectedFocus: "Complex automation balancing human needs with operational efficiency"
      },
      {
        type: 'email-composer',
        prompt: "Write documentation for staff on how to maintain and update the new automation systems",
        expectedFocus: "Clear, step-by-step guidance for non-technical staff"
      }
    ]
  },

  {
    name: "Alex Change Leadership Clinic",
    character: "Alex",
    concept: "Strategic change management workshop where Alex guides leaders through organizational AI adoption challenges. Focus on overcoming resistance, building buy-in, and creating sustainable change culture. Addresses real fears and concerns while demonstrating practical benefits.",
    objectives: [
      "Assess organizational readiness for AI tool adoption",
      "Design change management strategies for technology implementation",
      "Handle resistance and fears about AI in nonprofit work",
      "Build coalition and buy-in across different stakeholder groups",
      "Create sustainable practices for ongoing technology adaptation"
    ],
    testInteractions: [
      {
        type: 'conversation-handler',
        prompt: "Handle a staff meeting where long-term employees express fear that AI tools will replace their jobs or devalue their experience",
        expectedFocus: "Empathetic leadership that addresses fears while showing value of human+AI collaboration"
      },
      {
        type: 'email-composer',
        prompt: "Communicate a new AI tools policy to the board that addresses ethical concerns while showing potential impact",
        expectedFocus: "Strategic communication balancing innovation with organizational values"
      },
      {
        type: 'conversation-handler',
        prompt: "Facilitate a difficult conversation between tech-enthusiastic younger staff and change-resistant senior leadership",
        expectedFocus: "Diplomatic mediation that bridges generational and technological divides"
      }
    ]
  }
];

/**
 * Creates demo prototypes in the system
 */
export async function createDemoPrototypes(): Promise<void> {
  console.log('🚀 Creating 5 strategic demo prototypes...');
  
  for (const prototype of DEMO_PROTOTYPES) {
    console.log(`Creating: ${prototype.name}`);
    
    // This would integrate with the actual prototype creation system
    // For now, providing the structured data for manual creation
  }
}