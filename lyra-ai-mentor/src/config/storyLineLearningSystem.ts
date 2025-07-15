/**
 * STORYLINE-DRIVEN LEARNING SYSTEM
 * Complete lessons with DreamWorks storytelling + AI prompting practice
 */

export interface StorylineLesson {
  id: string;
  title: string;
  character: string;
  estimatedDuration: number; // minutes
  narrative: StorylineNarrative;
  practiceFlow: PracticeStage[];
  learningObjectives: string[];
  takeawaySkills: string[];
  evaluation: LessonEvaluation;
}

export interface StorylineNarrative {
  setup: StorySetup;
  conflict: StoryConflict;
  resolution: StoryResolution;
  characterArc: CharacterArc;
}

export interface StorySetup {
  context: string;
  characterSituation: string;
  stakeholders: string[];
  timeConstraint?: string;
  organizationContext: string;
}

export interface StoryConflict {
  primaryChallenge: string;
  complications: string[];
  stakeholderNeeds: Record<string, string>;
  successCriteria: string[];
}

export interface StoryResolution {
  approach: string;
  keyInsights: string[];
  applicableSkills: string[];
}

export interface CharacterArc {
  initialState: string;
  struggle: string;
  breakthrough: string;
  growth: string;
}

export interface PracticeStage {
  id: string;
  type: 'static-choice' | 'template-building' | 'ai-prompting' | 'output-review' | 'branching-decision';
  title: string;
  description: string;
  content: StageContent;
  evaluation?: StageEvaluation;
  branchingLogic?: BranchingLogic;
}

export interface StageContent {
  // Static Choice Content
  question?: string;
  options?: ChoiceOption[];
  
  // Template Building Content
  template?: string;
  fillableFields?: TemplateField[];
  
  // AI Prompting Content
  promptExample?: string;
  promptTemplate?: string;
  contextualHints?: string[];
  freeformGuidance?: string;
  
  // Output Review Content
  sampleOutputs?: string[];
  qualityCriteria?: string[];
  
  // Branching Decision Content
  scenario?: string;
  consequences?: Record<string, string>;
}

export interface ChoiceOption {
  id: string;
  text: string;
  feedback: string;
  isOptimal: boolean;
  leadsToStage?: string;
}

export interface TemplateField {
  name: string;
  placeholder: string;
  required: boolean;
  hint?: string;
}

export interface StageEvaluation {
  type: 'immediate' | 'ai-assisted' | 'rubric-based';
  criteria: string[];
  feedback: EvaluationFeedback;
}

export interface EvaluationFeedback {
  onSuccess: string;
  onPartial: string;
  onNeedsWork: string;
  improvementTips: string[];
}

export interface BranchingLogic {
  condition: string;
  branches: Record<string, string>; // choice_id -> next_stage_id
  convergenceStage?: string; // where branches reconverge
}

export interface LessonEvaluation {
  finalAICheck: boolean;
  promptQualityWeight: number; // 0-1
  outputQualityWeight: number; // 0-1
  rubricCriteria: RubricCriterion[];
  passingThreshold: number;
  retryLogic: RetryConfiguration;
}

export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
  evaluationType: 'prompt-effectiveness' | 'output-quality' | 'decision-making';
}

export interface RetryConfiguration {
  maxAttempts: number;
  scaffoldingIncrease: boolean;
  hintProgression: string[];
  fallbackGuidance: string;
}

// Example: Maya's Multi-Stakeholder Email Challenge
export const MAYA_EMAIL_STORYLINE_LESSON: StorylineLesson = {
  id: 'maya_multi_stakeholder_email',
  title: 'Maya\'s Triple Email Challenge',
  character: 'Maya',
  estimatedDuration: 15,
  
  narrative: {
    setup: {
      context: "Hope Gardens Community Center just completed their biggest food drive ever",
      characterSituation: "Maya needs to announce the incredible results but realizes each stakeholder group needs completely different messaging",
      stakeholders: ["major donors", "weekly volunteers", "board members"],
      timeConstraint: "Board meeting is tomorrow, donors expect updates today, volunteers are asking questions",
      organizationContext: "Small community nonprofit with diverse stakeholder relationships"
    },
    
    conflict: {
      primaryChallenge: "Same great news, but three totally different audiences with different motivations and communication preferences",
      complications: [
        "Donors care about impact metrics and ROI",
        "Volunteers want celebration and recognition", 
        "Board needs strategic implications and next steps",
        "Maya has never written emails this targeted before"
      ],
      stakeholderNeeds: {
        "donors": "Proof their money made a difference with specific numbers",
        "volunteers": "Appreciation for their hard work and community celebration",
        "board": "Strategic success analysis and scaling opportunities"
      },
      successCriteria: [
        "Each email feels personally relevant to its audience",
        "Tone and content match stakeholder relationship",
        "Clear action items appropriate for each group",
        "Maya learns reusable prompting patterns"
      ]
    },
    
    resolution: {
      approach: "Maya learns to craft audience-specific AI prompts that capture context, relationship, and desired outcome",
      keyInsights: [
        "AI works best when given clear audience context",
        "Good prompts specify tone, purpose, and relationship level",
        "Templates can be personalized through smart prompting",
        "Same information can be reframed for different motivations"
      ],
      applicableSkills: [
        "Stakeholder-specific AI prompting",
        "Tone and relationship calibration",
        "Impact messaging optimization",
        "Reusable prompt templates for nonprofit communication"
      ]
    },
    
    characterArc: {
      initialState: "Overwhelmed by having to write three different emails with the same information",
      struggle: "Doesn't know how to make the same news feel relevant and engaging to such different audiences",
      breakthrough: "Discovers that AI can help adapt her voice and message when given proper context and audience insight",
      growth: "Gains confidence in stakeholder communication and learns prompt patterns she can use for future campaigns"
    }
  },
  
  practiceFlow: [
    {
      id: 'stakeholder_analysis',
      type: 'static-choice',
      title: 'Choose Your Starting Stakeholder',
      description: 'Maya realizes each group needs different messaging. Which audience should she tackle first?',
      content: {
        question: "Given Maya's time pressure and relationship dynamics, which email should she write first?",
        options: [
          {
            id: 'donors',
            text: 'Major Donors - They funded the food drive and expect immediate updates',
            feedback: 'Smart choice! Donors often expect quick turnaround and formal communication.',
            isOptimal: true,
            leadsToStage: 'donor_prompt_example'
          },
          {
            id: 'volunteers', 
            text: 'Weekly Volunteers - They did the work and deserve first recognition',
            feedback: 'Great thinking! Starting with appreciation builds goodwill, though donors may expect faster updates.',
            isOptimal: false,
            leadsToStage: 'volunteer_prompt_example'
          },
          {
            id: 'board',
            text: 'Board Members - The meeting is tomorrow so this is most urgent',
            feedback: 'Good prioritization! Though you might want to have donor and volunteer input before strategic discussion.',
            isOptimal: false,
            leadsToStage: 'board_prompt_example'
          }
        ]
      },
      evaluation: {
        type: 'immediate',
        criteria: ['Strategic thinking', 'Stakeholder prioritization'],
        feedback: {
          onSuccess: 'Excellent stakeholder analysis!',
          onPartial: 'Good thinking, though consider timing dynamics.',
          onNeedsWork: 'Think about urgency and relationship expectations.',
          improvementTips: ['Consider who expects fastest response', 'Think about information dependencies between groups']
        }
      }
    },
    
    {
      id: 'donor_prompt_example',
      type: 'template-building', 
      title: 'Learn from a Good Prompt Example',
      description: 'See how Maya would prompt AI for donor communication, then build your own version.',
      content: {
        promptExample: `Generate a professional email to major donors about our food drive results. 

Context:
- Hope Gardens Community Center, small nonprofit
- Just completed biggest food drive ever
- Donors funded this specific initiative
- Need to show clear impact and ROI

Audience: Major donors who gave $500+ to food drive
Relationship: Formal but warm, appreciate their partnership
Purpose: Results announcement + stewardship
Tone: Grateful, professional, impact-focused
Length: 2-3 paragraphs
Include: Specific numbers, community impact, their role in success

Action: Invite to volunteer appreciation event as VIP guests`,

        template: `Generate a [TONE] email to [AUDIENCE] about [TOPIC].

Context:
- [ORGANIZATION_INFO]
- [SITUATION_DETAILS]
- [RELATIONSHIP_CONTEXT]

Audience: [SPECIFIC_AUDIENCE_DESCRIPTION]
Relationship: [RELATIONSHIP_LEVEL]
Purpose: [PRIMARY_PURPOSE]
Tone: [DESIRED_TONE]
Length: [LENGTH_SPECIFICATION]
Include: [REQUIRED_ELEMENTS]

Action: [DESIRED_NEXT_STEP]`,

        fillableFields: [
          { name: 'TONE', placeholder: 'professional, warm, celebratory', required: true, hint: 'How should AI write to this audience?' },
          { name: 'AUDIENCE', placeholder: 'weekly volunteers, board members, etc.', required: true, hint: 'Be specific about who' },
          { name: 'TOPIC', placeholder: 'food drive results, program update, etc.', required: true, hint: 'What\'s the main subject?' },
          { name: 'ORGANIZATION_INFO', placeholder: 'Hope Gardens Community Center, mission, size', required: true, hint: 'Help AI understand your context' },
          { name: 'RELATIONSHIP_LEVEL', placeholder: 'formal, casual, partnership-based', required: true, hint: 'How do you normally interact?' }
        ]
      },
      evaluation: {
        type: 'ai-assisted',
        criteria: ['Prompt completeness', 'Context clarity', 'Audience specification'],
        feedback: {
          onSuccess: 'Great prompt structure! AI will have clear guidance.',
          onPartial: 'Good start, consider adding more context for AI.',
          onNeedsWork: 'AI needs more specific guidance to write effectively.',
          improvementTips: ['Specify exact relationship dynamic', 'Include desired outcome', 'Give AI your organization context']
        }
      }
    },
    
    {
      id: 'generate_and_review',
      type: 'ai-prompting',
      title: 'Generate Your Email with AI',
      description: 'Use your prompt to generate the actual email, then review the quality.',
      content: {
        freeformGuidance: 'Paste your completed prompt from the previous step and see what AI generates. Then we\'ll evaluate both your prompt effectiveness and the output quality.',
        contextualHints: [
          'Make sure your prompt includes all the template fields',
          'Be specific about tone and relationship level',
          'Include the desired action/next step',
          'Give AI context about your organization and situation'
        ]
      },
      evaluation: {
        type: 'rubric-based',
        criteria: [
          'Prompt provides clear context',
          'Audience specification is detailed',
          'Output matches stakeholder needs',
          'Tone is appropriate for relationship'
        ],
        feedback: {
          onSuccess: 'Excellent! Your prompt generated stakeholder-appropriate content.',
          onPartial: 'Good progress! Some refinement could improve AI output.',
          onNeedsWork: 'Let\'s improve your prompt to get better results.',
          improvementTips: [
            'Add more specific audience context',
            'Clarify the relationship dynamic',
            'Specify desired tone more precisely',
            'Include organization background for AI'
          ]
        }
      }
    },
    
    {
      id: 'branching_next_stakeholder',
      type: 'branching-decision',
      title: 'Choose Your Next Challenge',
      description: 'Great job on the first email! Maya is gaining confidence. Which stakeholder should she tackle next?',
      content: {
        scenario: 'Maya\'s first email was a success! She\'s starting to see how AI can adapt her message for different audiences. Two more emails to go.',
        consequences: {
          'continue_systematic': 'Tackle each remaining stakeholder methodically',
          'practice_advanced': 'Try a more complex multi-audience approach',
          'refine_first': 'Perfect the first email before moving on'
        }
      },
      branchingLogic: {
        condition: 'user_confidence_level',
        branches: {
          'continue_systematic': 'volunteer_prompt_practice',
          'practice_advanced': 'multi_audience_challenge',
          'refine_first': 'prompt_refinement_workshop'
        },
        convergenceStage: 'final_evaluation'
      }
    }
  ],
  
  learningObjectives: [
    'Master audience-specific AI prompting for nonprofit communication',
    'Learn to adapt tone and message for different stakeholder relationships',
    'Practice iterative prompt refinement based on output quality',
    'Develop reusable prompt templates for common communication scenarios'
  ],
  
  takeawaySkills: [
    'Stakeholder-specific prompting template',
    'Tone calibration techniques for AI',
    'Context-setting strategies for organizational communication',
    'Quality evaluation criteria for AI-generated content'
  ],
  
  evaluation: {
    finalAICheck: true,
    promptQualityWeight: 0.4,
    outputQualityWeight: 0.6,
    rubricCriteria: [
      {
        name: 'Prompt Effectiveness',
        description: 'How well the user\'s prompts guide AI to produce appropriate content',
        weight: 0.4,
        evaluationType: 'prompt-effectiveness'
      },
      {
        name: 'Stakeholder Appropriateness', 
        description: 'How well the final outputs match each audience\'s needs and relationship',
        weight: 0.3,
        evaluationType: 'output-quality'
      },
      {
        name: 'Communication Strategy',
        description: 'Understanding of why different approaches work for different stakeholders',
        weight: 0.3,
        evaluationType: 'decision-making'
      }
    ],
    passingThreshold: 7.5,
    retryLogic: {
      maxAttempts: 3,
      scaffoldingIncrease: true,
      hintProgression: [
        'Consider what motivates each stakeholder group',
        'Think about the relationship level and communication style',
        'Focus on giving AI specific context about your organization and situation'
      ],
      fallbackGuidance: 'Let\'s work together to build a prompt step by step...'
    }
  }
};

// Example: David's Data Detective Challenge
export const DAVID_DATA_STORYLINE_LESSON: StorylineLesson = {
  id: 'david_data_detective_challenge',
  title: 'David\'s Data Detective Mystery',
  character: 'David',
  estimatedDuration: 18,
  
  narrative: {
    setup: {
      context: "David discovered something strange in the monthly donation data - usually reliable donors are showing unusual patterns",
      characterSituation: "David needs to investigate what's happening with donor behavior and create a compelling story from the data for the board meeting",
      stakeholders: ["board members", "development team", "program directors"],
      timeConstraint: "Emergency board meeting in 2 days to discuss potential donation crisis",
      organizationContext: "Mid-size environmental nonprofit heavily dependent on recurring donations"
    },
    
    conflict: {
      primaryChallenge: "The data is messy, patterns are unclear, and David needs to use AI to both clean the data AND extract meaningful insights that tell a story",
      complications: [
        "Donation data is spread across multiple systems with different formats",
        "Board expects clear explanations, not just numbers",
        "Some veteran donors haven't given in months - is this a trend or coincidence?",
        "David has never used AI for data analysis before"
      ],
      stakeholderNeeds: {
        "board": "Clear story about donor health with actionable recommendations",
        "development": "Specific donors to re-engage and strategies that work",
        "programs": "Understanding if this affects program funding sustainability"
      },
      successCriteria: [
        "Clean, analyzable dataset created with AI assistance",
        "Clear insights about donor behavior patterns",
        "Compelling data story that guides decision-making", 
        "David learns reusable AI data analysis techniques"
      ]
    },
    
    resolution: {
      approach: "David learns to prompt AI for data cleaning, analysis, and storytelling - turning raw numbers into actionable insights",
      keyInsights: [
        "AI can help clean and standardize messy data quickly",
        "Good data prompts specify the analysis goal and audience",
        "Data storytelling requires both analysis AND narrative structure",
        "AI can suggest visualizations and recommendations from patterns"
      ],
      applicableSkills: [
        "AI-powered data cleaning and preparation",
        "Prompt engineering for data analysis tasks",
        "Extracting insights and trends from datasets",
        "Creating data-driven narratives for stakeholders"
      ]
    },
    
    characterArc: {
      initialState: "Intimidated by messy data and unsure how to turn numbers into compelling insights",
      struggle: "Doesn't know where to start with data analysis or how to make it meaningful for non-technical stakeholders",
      breakthrough: "Realizes AI can be his data detective partner, helping him ask the right questions and find the story hidden in the numbers",
      growth: "Becomes confident in using AI for data analysis and learns to create compelling data narratives"
    }
  },
  
  practiceFlow: [
    {
      id: 'data_investigation_start',
      type: 'static-choice',
      title: 'Choose Your Data Detective Approach',
      description: 'David has messy donor data from 3 different systems. Where should he start his investigation?',
      content: {
        question: "With limited time and messy data, what's David's best first move?",
        options: [
          {
            id: 'clean_first',
            text: 'Clean and organize the data first - can\'t analyze messy data effectively',
            feedback: 'Excellent detective instinct! Clean data is the foundation of good analysis.',
            isOptimal: true,
            leadsToStage: 'data_cleaning_prompt_example'
          },
          {
            id: 'analyze_raw',
            text: 'Jump into analysis immediately - patterns might emerge from the chaos',
            feedback: 'Bold approach! Though you might find cleaner data gives clearer insights.',
            isOptimal: false,
            leadsToStage: 'raw_analysis_challenge'
          },
          {
            id: 'visualize_first',
            text: 'Create charts first to see what the data looks like visually',
            feedback: 'Visual thinking! Though clean data will make better charts.',
            isOptimal: false,
            leadsToStage: 'visualization_first_path'
          }
        ]
      },
      evaluation: {
        type: 'immediate',
        criteria: ['Data analysis methodology', 'Problem-solving approach'],
        feedback: {
          onSuccess: 'Great data detective reasoning!',
          onPartial: 'Good instincts, though consider the foundation first.',
          onNeedsWork: 'Think about what makes analysis more reliable.',
          improvementTips: ['Clean data leads to clearer insights', 'Foundation before investigation']
        }
      }
    },
    
    {
      id: 'data_cleaning_prompt_example',
      type: 'template-building',
      title: 'Learn Data Cleaning Prompts',
      description: 'See how David would prompt AI to clean donor data, then build your own cleaning prompt.',
      content: {
        promptExample: `Help me clean and standardize this donor data for analysis.

Data Context:
- 3 different donation systems (Stripe, PayPal, check processing)
- Date formats vary: MM/DD/YYYY, DD-MM-YY, "March 2024"  
- Donor names have inconsistent capitalization and duplicates
- Amount formats: "$1,000.00", "1000", "One Thousand Dollars"

Analysis Goal: Identify donor behavior patterns and retention trends

Please help me:
1. Standardize date formats to YYYY-MM-DD
2. Clean and normalize donor names (handle duplicates)
3. Standardize amount formats to numeric values
4. Flag any obvious data quality issues
5. Suggest additional fields that would help with retention analysis

Format the output as a clean CSV with consistent columns.`,

        template: `Help me clean and standardize this [DATA_TYPE] for [ANALYSIS_PURPOSE].

Data Context:
- [DATA_SOURCES_DESCRIPTION]
- [SPECIFIC_QUALITY_ISSUES]
- [FORMAT_INCONSISTENCIES]

Analysis Goal: [WHAT_YOU_WANT_TO_DISCOVER]

Please help me:
1. [CLEANING_TASK_1]
2. [CLEANING_TASK_2] 
3. [CLEANING_TASK_3]
4. [QUALITY_CHECK_REQUEST]
5. [ENHANCEMENT_SUGGESTIONS]

Format the output as [DESIRED_OUTPUT_FORMAT].`,

        fillableFields: [
          { name: 'DATA_TYPE', placeholder: 'donor data, program metrics, survey responses', required: true, hint: 'What kind of data are you working with?' },
          { name: 'ANALYSIS_PURPOSE', placeholder: 'retention analysis, impact measurement, trend identification', required: true, hint: 'What do you want to learn from this data?' },
          { name: 'DATA_SOURCES_DESCRIPTION', placeholder: 'multiple systems, exported files, manual entry', required: true, hint: 'Where did this data come from?' },
          { name: 'SPECIFIC_QUALITY_ISSUES', placeholder: 'duplicate entries, missing values, format inconsistencies', required: true, hint: 'What problems do you see?' },
          { name: 'DESIRED_OUTPUT_FORMAT', placeholder: 'clean CSV, formatted table, structured JSON', required: true, hint: 'How do you want the cleaned data?' }
        ]
      },
      evaluation: {
        type: 'ai-assisted',
        criteria: ['Prompt specificity', 'Data context clarity', 'Task breakdown'],
        feedback: {
          onSuccess: 'Excellent data cleaning prompt! AI will know exactly what to do.',
          onPartial: 'Good foundation, add more specific data context.',
          onNeedsWork: 'AI needs more details about your data and goals.',
          improvementTips: ['Describe specific data quality issues', 'Be clear about desired output format', 'Include your analysis goal']
        }
      }
    },
    
    {
      id: 'data_analysis_prompting',
      type: 'ai-prompting',
      title: 'Generate Your Data Analysis',
      description: 'Use AI to analyze the cleaned donor data and extract meaningful insights.',
      content: {
        freeformGuidance: 'Now that you have your data cleaning prompt, create a follow-up prompt to analyze the cleaned data for donor behavior patterns. Focus on insights that would help the board make decisions.',
        contextualHints: [
          'Ask AI to identify specific trends (increasing/decreasing donations, seasonal patterns)',
          'Request analysis of donor segments (new vs returning, high vs low value)', 
          'Ask for retention rates and risk indicators',
          'Request actionable recommendations based on the patterns found',
          'Ask AI to highlight the most important insights for executive summary'
        ]
      },
      evaluation: {
        type: 'rubric-based',
        criteria: [
          'Analysis scope is appropriate for stakeholders',
          'Prompt asks for actionable insights',
          'Includes request for recommendations',
          'Addresses the specific board meeting need'
        ],
        feedback: {
          onSuccess: 'Fantastic! Your analysis will give the board clear insights and actions.',
          onPartial: 'Good analysis focus, consider what the board needs to decide.',
          onNeedsWork: 'Think about what specific insights would help stakeholders take action.',
          improvementTips: [
            'Focus on trends that affect organizational decisions',
            'Ask for specific recommendations, not just observations',
            'Consider your audience - what do board members need to know?',
            'Request priority ranking of findings'
          ]
        }
      }
    },
    
    {
      id: 'data_story_branching',
      type: 'branching-decision', 
      title: 'Choose Your Data Story Focus',
      description: 'David\'s analysis revealed several concerning patterns. Which story should he lead with for maximum board impact?',
      content: {
        scenario: 'The AI analysis revealed: 1) Major donors giving less frequently, 2) New donor acquisition down 40%, 3) But average gift size up 15%. Multiple stories could be told.',
        consequences: {
          'crisis_narrative': 'Focus on the declining patterns - frame as urgent crisis needing immediate action',
          'opportunity_narrative': 'Focus on increasing gift sizes - frame as donors wanting to give more strategically', 
          'balanced_narrative': 'Present both challenges and opportunities with balanced recommendations'
        }
      },
      branchingLogic: {
        condition: 'narrative_strategy_choice',
        branches: {
          'crisis_narrative': 'crisis_communication_prompt',
          'opportunity_narrative': 'opportunity_framing_prompt',
          'balanced_narrative': 'balanced_analysis_prompt'
        },
        convergenceStage: 'final_data_evaluation'
      }
    },
    
    {
      id: 'crisis_communication_prompt',
      type: 'ai-prompting',
      title: 'Craft Crisis Communication',
      description: 'Help David create urgent but solution-focused messaging about the donor trends.',
      content: {
        freeformGuidance: 'Create a prompt that helps AI frame the data as an urgent situation that requires immediate board action, while still being constructive and solution-oriented.',
        contextualHints: [
          'Use words that convey urgency without causing panic',
          'Frame problems as opportunities for strategic intervention',
          'Request specific timelines and action steps',
          'Ask for messaging that motivates rather than deflates',
          'Include request for risk mitigation strategies'
        ]
      }
    },
    
    {
      id: 'opportunity_framing_prompt', 
      type: 'ai-prompting',
      title: 'Frame as Strategic Opportunity',
      description: 'Help David position the data trends as signs of donor evolution and strategic opportunity.',
      content: {
        freeformGuidance: 'Create a prompt that helps AI frame the data as evidence of changing donor behavior that the organization can capitalize on with the right strategy.',
        contextualHints: [
          'Focus on increasing gift sizes as a positive trend',
          'Frame fewer but larger gifts as donor maturation',
          'Ask for strategies to encourage this trend',
          'Request messaging about donor relationship evolution',
          'Include ideas for deepening donor engagement'
        ]
      }
    },
    
    {
      id: 'balanced_analysis_prompt',
      type: 'ai-prompting', 
      title: 'Create Balanced Analysis',
      description: 'Help David present a nuanced view that acknowledges both challenges and opportunities.',
      content: {
        freeformGuidance: 'Create a prompt that helps AI present a balanced perspective on the data, acknowledging concerns while highlighting positive trends and actionable strategies.',
        contextualHints: [
          'Request both challenge and opportunity framing',
          'Ask for short-term and long-term recommendations',
          'Include request for risk assessment with mitigation strategies',
          'Ask for multiple scenario planning options',
          'Request clear prioritization of actions'
        ]
      }
    },
    
    {
      id: 'raw_analysis_challenge',
      type: 'ai-prompting',
      title: 'Analyze Raw Data Challenge',
      description: 'David decided to dive into messy data immediately. Help him prompt AI to find patterns despite the chaos.',
      content: {
        freeformGuidance: 'Since David chose to analyze raw data without cleaning first, create a prompt that helps AI work with messy donor data while acknowledging quality limitations.',
        contextualHints: [
          'Ask AI to identify patterns while noting data quality issues',
          'Request analysis with confidence levels based on data reliability',
          'Ask for preliminary insights that could guide cleaning priorities',
          'Request identification of data gaps that need to be filled',
          'Ask AI to flag areas where messy data makes conclusions uncertain'
        ]
      },
      evaluation: {
        type: 'rubric-based',
        criteria: [
          'Acknowledges data quality limitations',
          'Asks for pattern identification despite messiness',
          'Requests confidence levels for insights',
          'Plans for data cleaning based on initial findings'
        ],
        feedback: {
          onSuccess: 'Good adaptation! You\'re making the best of messy data while planning improvements.',
          onPartial: 'Consider how data quality affects analysis reliability.',
          onNeedsWork: 'Raw data analysis needs careful handling of uncertainty.',
          improvementTips: [
            'Always acknowledge data quality when working with raw data',
            'Ask AI to rate confidence in findings',
            'Use initial analysis to prioritize cleaning efforts'
          ]
        }
      }
    },
    
    {
      id: 'visualization_first_path',
      type: 'ai-prompting',
      title: 'Visual-First Data Exploration',
      description: 'David wants to see the data visually first. Help him prompt AI to create meaningful charts from the donor patterns.',
      content: {
        freeformGuidance: 'Create a prompt that helps AI generate visualizations that reveal donor behavior patterns, even with imperfect data.',
        contextualHints: [
          'Ask for multiple chart types to reveal different patterns',
          'Request visualizations that highlight trends over time',
          'Ask AI to suggest which visualizations would be most revealing',
          'Request charts that compare donor segments or behaviors',
          'Ask for visual indicators of data quality issues'
        ]
      },
      evaluation: {
        type: 'rubric-based',
        criteria: [
          'Requests appropriate visualization types for donor data',
          'Asks for trend analysis through charts',
          'Considers audience needs for visual communication',
          'Plans for data quality representation in visuals'
        ],
        feedback: {
          onSuccess: 'Excellent visual thinking! Your charts will reveal patterns clearly.',
          onPartial: 'Good visual approach, consider what story the charts should tell.',
          onNeedsWork: 'Think about which visualizations best serve your analysis goals.',
          improvementTips: [
            'Match chart types to the patterns you want to reveal',
            'Consider your audience when choosing visualizations',
            'Include data quality indicators in your visuals'
          ]
        }
      }
    },
    
    {
      id: 'final_data_evaluation',
      type: 'output-review',
      title: 'Final Data Story Review',
      description: 'David has completed his analysis. Let\'s review the final data story and recommendations for the board.',
      content: {
        sampleOutputs: [
          'Board presentation with clear data narrative and recommendations',
          'Executive summary highlighting key insights and actions',
          'Supporting data visualizations and analysis documentation'
        ],
        qualityCriteria: [
          'Data story is compelling and actionable for board members',
          'Recommendations are specific and prioritized',
          'Analysis methodology is sound and transparent',
          'Communication style matches board expectations',
          'Next steps are clear and realistic'
        ]
      },
      evaluation: {
        type: 'rubric-based',
        criteria: [
          'Final output addresses board decision-making needs',
          'Data story is clear and compelling',
          'Recommendations are actionable and prioritized',
          'Analysis demonstrates sound AI prompting skills'
        ],
        feedback: {
          onSuccess: 'Outstanding! David\'s data detective work will give the board clear direction.',
          onPartial: 'Good analysis, ensure recommendations are specific and actionable.',
          onNeedsWork: 'Focus on what the board needs to make decisions.',
          improvementTips: [
            'Make sure every insight leads to a specific action',
            'Prioritize recommendations by impact and feasibility',
            'Frame data stories around stakeholder decision points'
          ]
        }
      }
    }
  ],
  
  learningObjectives: [
    'Master AI-powered data cleaning and preparation techniques',
    'Learn to prompt AI for meaningful data analysis and insight extraction',
    'Practice creating data-driven narratives for different stakeholder needs',
    'Develop skills in using AI for decision-support analytics'
  ],
  
  takeawaySkills: [
    'Data cleaning prompt templates for messy nonprofit data',
    'Analysis prompting strategies for extracting actionable insights',
    'Data storytelling techniques for board and stakeholder communication',
    'AI-assisted recommendation generation from data patterns'
  ],
  
  evaluation: {
    finalAICheck: true,
    promptQualityWeight: 0.5,
    outputQualityWeight: 0.5,
    rubricCriteria: [
      {
        name: 'Data Analysis Methodology',
        description: 'How well the user structures data cleaning and analysis tasks',
        weight: 0.3,
        evaluationType: 'prompt-effectiveness'
      },
      {
        name: 'Insight Extraction',
        description: 'Ability to prompt AI for meaningful, actionable insights',
        weight: 0.3,
        evaluationType: 'output-quality'
      },
      {
        name: 'Stakeholder Communication',
        description: 'How well the analysis addresses specific audience needs',
        weight: 0.4,
        evaluationType: 'decision-making'
      }
    ],
    passingThreshold: 7.5,
    retryLogic: {
      maxAttempts: 3,
      scaffoldingIncrease: true,
      hintProgression: [
        'Think about what specific insights your stakeholders need to make decisions',
        'Consider the data quality foundation before jumping to analysis',
        'Focus on prompts that lead to actionable recommendations, not just observations'
      ],
      fallbackGuidance: 'Let\'s work together to build data analysis prompts step by step...'
    }
  }
};

export default StorylineLesson;