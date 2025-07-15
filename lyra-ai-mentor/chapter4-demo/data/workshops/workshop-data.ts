// Chapter 4 David Chen - Executive Communication Workshops
// Four intensive workshops for advanced leadership communication

export interface ExecutiveWorkshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: 'advanced' | 'expert';
  prerequisites: string[];
  learningOutcomes: string[];
  modules: {
    id: string;
    title: string;
    content: string;
    activities: string[];
    davidInsights: string[];
  }[];
  practiceScenarios: {
    id: string;
    title: string;
    context: string;
    challenge: string;
    roleplayInstructions: string[];
    coachingTips: string[];
    davidFeedback: string;
  }[];
  assessmentCriteria: {
    skill: string;
    description: string;
    levels: {
      developing: string;
      proficient: string;
      advanced: string;
      expert: string;
    };
  }[];
}

export const executiveWorkshops: ExecutiveWorkshop[] = [
  {
    id: "workshop-1",
    title: "One-on-One Conversation Mastery",
    subtitle: "Building Relationships That Drive Results",
    description: "Master the art of one-on-one conversations that build trust, drive performance, and develop people. Learn to navigate everything from routine check-ins to difficult performance discussions.",
    duration: "2 hours",
    difficulty: "advanced",
    prerequisites: [
      "Completed Lessons 1-4",
      "Experience managing direct reports",
      "Basic understanding of coaching principles"
    ],
    learningOutcomes: [
      "Conduct effective coaching conversations",
      "Give feedback that drives behavior change",
      "Build deep professional relationships",
      "Navigate difficult conversations with confidence",
      "Create development plans that align with business needs"
    ],
    modules: [
      {
        id: "foundations",
        title: "One-on-One Foundations",
        content: "Learn the core principles that make one-on-one conversations effective: psychological safety, active listening, powerful questions, and follow-through.",
        activities: [
          "Practice creating psychological safety in conversations",
          "Learn the GROW coaching model (Goal, Reality, Options, Way Forward)",
          "Master the art of asking questions that drive insight",
          "Practice different conversation structures for different purposes"
        ],
        davidInsights: [
          "The best one-on-ones feel like conversations, not interrogations. Create space for the other person to think and share.",
          "Your job isn't to have all the answers - it's to help the other person find their own answers.",
          "The magic happens when you stop talking and start listening. Really listening."
        ]
      },
      {
        id: "coaching-conversations",
        title: "Coaching for Performance and Development",
        content: "Transform regular check-ins into powerful coaching conversations that develop skills and drive results.",
        activities: [
          "Practice the coaching conversation framework",
          "Learn to identify coaching moments in regular interactions",
          "Master the balance between directive and non-directive coaching",
          "Create development plans that stretch and support"
        ],
        davidInsights: [
          "Coaching isn't about fixing people - it's about helping them discover their own potential.",
          "The best development happens just outside someone's comfort zone. Your job is to help them take that step.",
          "Don't solve problems for people that they can solve themselves. Ask questions instead."
        ]
      },
      {
        id: "difficult-conversations",
        title: "Navigating Difficult Conversations",
        content: "Learn to have the conversations that most managers avoid - performance issues, behavior problems, and career disappointments.",
        activities: [
          "Practice the SBI model (Situation, Behavior, Impact)",
          "Learn to separate person from performance",
          "Master the art of delivering difficult feedback with empathy",
          "Create action plans that drive real change"
        ],
        davidInsights: [
          "Difficult conversations get easier with practice, but they never get easy. That's okay - they're important.",
          "Most performance issues are actually communication issues in disguise.",
          "The longer you wait to have a difficult conversation, the more difficult it becomes."
        ]
      },
      {
        id: "relationship-building",
        title: "Building Deep Professional Relationships",
        content: "Go beyond transactional interactions to build the kind of relationships that drive long-term success.",
        activities: [
          "Practice vulnerability and authenticity in professional relationships",
          "Learn to find common ground and shared values",
          "Master the art of showing genuine interest in others",
          "Create trust through consistency and follow-through"
        ],
        davidInsights: [
          "People don't care how much you know until they know how much you care.",
          "Trust is built in drops and lost in buckets. Every interaction either builds or erodes trust.",
          "The strongest professional relationships have a personal element. Learn about the whole person."
        ]
      }
    ],
    practiceScenarios: [
      {
        id: "underperformer",
        title: "The Struggling High Performer",
        context: "Sarah has been one of your top performers for two years, but her performance has declined significantly over the past three months. She seems disengaged and is missing deadlines.",
        challenge: "Diagnose the root cause and create a plan to get Sarah back on track",
        roleplayInstructions: [
          "Start with open-ended questions about how she's feeling",
          "Listen for clues about what might be causing the performance decline",
          "Avoid jumping to solutions too quickly",
          "Focus on understanding before being understood"
        ],
        coachingTips: [
          "Performance decline often has personal or professional root causes",
          "High performers may be struggling with new challenges or loss of motivation",
          "Create safety for her to share what's really going on",
          "Be prepared to offer support, not just accountability"
        ],
        davidFeedback: "This scenario tests your ability to diagnose problems through conversation. The key is genuine curiosity and patience. Sarah probably knows what's wrong - she just needs someone to listen."
      },
      {
        id: "career-disappointment",
        title: "The Promotion Disappointment",
        context: "Mark applied for a senior engineer position but was passed over for an external candidate. He's clearly disappointed and has been less engaged since the decision was announced.",
        challenge: "Address his disappointment while maintaining his engagement and developing his skills",
        roleplayInstructions: [
          "Acknowledge his disappointment without defending the decision",
          "Focus on his future development and growth opportunities",
          "Create a concrete plan for him to work toward the next opportunity",
          "Be honest about what he needs to develop"
        ],
        coachingTips: [
          "Disappointment is natural - don't minimize it",
          "Focus on what he can control going forward",
          "Be specific about skill gaps and development opportunities",
          "Create timeline and milestones for his growth"
        ],
        davidFeedback: "Career disappointments test your ability to help people process emotions while staying focused on growth. The key is balancing empathy with forward-looking action."
      },
      {
        id: "team-conflict",
        title: "The Team Conflict",
        context: "Two of your team members, Alex and Jordan, have been in conflict for weeks. It's affecting team morale and their work quality. Both have come to you separately to complain about the other.",
        challenge: "Help them resolve their conflict and rebuild their working relationship",
        roleplayInstructions: [
          "Meet with each person individually first to understand their perspective",
          "Focus on behaviors and impacts, not personalities",
          "Help them find common ground and shared goals",
          "Create agreements about how they'll work together going forward"
        ],
        coachingTips: [
          "Most conflicts are about communication, not fundamental incompatibility",
          "Help each person see their role in the conflict",
          "Focus on the future, not relitigating the past",
          "Create structure for how they'll interact going forward"
        ],
        davidFeedback: "Conflict resolution requires you to be a skilled mediator. The goal isn't to determine who's right - it's to help them work together effectively."
      },
      {
        id: "ambitious-developer",
        title: "The Ambitious Developer",
        context: "Jamie is a talented developer who's been pushing for more responsibility and leadership opportunities. She's impatient with the pace of her advancement and has hinted about looking elsewhere.",
        challenge: "Channel her ambition constructively while managing her expectations",
        roleplayInstructions: [
          "Acknowledge her ambition and talent",
          "Be realistic about timelines and opportunities",
          "Create stretch assignments that develop leadership skills",
          "Help her understand what success looks like at the next level"
        ],
        coachingTips: [
          "Ambition is good - help her channel it productively",
          "Be honest about what's realistic in your organization",
          "Create opportunities for her to demonstrate leadership",
          "Help her understand the difference between technical and leadership skills"
        ],
        davidFeedback: "Ambitious team members need challenge and growth. Your job is to provide that while helping them understand what leadership really requires."
      }
    ],
    assessmentCriteria: [
      {
        skill: "Active Listening",
        description: "Ability to truly hear and understand what others are saying",
        levels: {
          developing: "Listens to respond, often interrupts or jumps to solutions",
          proficient: "Listens to understand, asks clarifying questions",
          advanced: "Listens for both content and emotion, reflects back understanding",
          expert: "Listens for what's not said, creates space for deeper sharing"
        }
      },
      {
        skill: "Powerful Questions",
        description: "Ability to ask questions that drive insight and self-discovery",
        levels: {
          developing: "Asks mostly closed-ended or leading questions",
          proficient: "Asks open-ended questions that explore topics",
          advanced: "Asks questions that challenge assumptions and drive insight",
          expert: "Asks questions that help people discover their own answers"
        }
      },
      {
        skill: "Feedback Delivery",
        description: "Ability to give feedback that drives behavior change",
        levels: {
          developing: "Gives vague or emotionally charged feedback",
          proficient: "Gives specific, behavior-focused feedback",
          advanced: "Gives feedback that's timely, specific, and actionable",
          expert: "Gives feedback that inspires growth and strengthens relationships"
        }
      },
      {
        skill: "Difficult Conversations",
        description: "Ability to navigate challenging conversations with confidence",
        levels: {
          developing: "Avoids difficult conversations or handles them poorly",
          proficient: "Can have difficult conversations with preparation",
          advanced: "Handles difficult conversations with empathy and skill",
          expert: "Transforms difficult conversations into growth opportunities"
        }
      }
    ]
  },
  {
    id: "workshop-2",
    title: "Team Meeting Facilitation",
    subtitle: "Transforming Meetings Into Powerful Team Tools",
    description: "Learn to facilitate meetings that energize teams, drive decisions, and build alignment. Transform meetings from time-wasters into your most powerful leadership tool.",
    duration: "2 hours",
    difficulty: "advanced",
    prerequisites: [
      "Completed Lessons 1-4",
      "Experience running team meetings",
      "Basic understanding of group dynamics"
    ],
    learningOutcomes: [
      "Design meetings that achieve specific outcomes",
      "Facilitate productive discussions and decisions",
      "Manage group dynamics and difficult personalities",
      "Create psychological safety in group settings",
      "Build team alignment and commitment"
    ],
    modules: [
      {
        id: "meeting-design",
        title: "Strategic Meeting Design",
        content: "Learn to design meetings that have clear purposes, engage participants, and drive specific outcomes.",
        activities: [
          "Practice different meeting formats for different purposes",
          "Learn to create agendas that drive engagement",
          "Master the art of time management in meetings",
          "Design meetings that build on each other over time"
        ],
        davidInsights: [
          "The best meetings have a clear purpose that everyone understands and cares about.",
          "If you can't articulate why you're having a meeting, you probably shouldn't have it.",
          "Meeting design is like software architecture - get the structure right, and everything else follows."
        ]
      },
      {
        id: "facilitation-skills",
        title: "Advanced Facilitation Techniques",
        content: "Master the skills needed to guide groups through complex discussions, decisions, and problem-solving.",
        activities: [
          "Practice different facilitation techniques (parking lots, dot voting, time boxing)",
          "Learn to read group energy and adjust your approach",
          "Master the art of asking questions that move groups forward",
          "Create safe spaces for disagreement and debate"
        ],
        davidInsights: [
          "Great facilitators are like air traffic controllers - they help everyone get where they need to go safely.",
          "Your job as a facilitator is to serve the group, not dominate it.",
          "The best facilitation is nearly invisible - people leave feeling like they accomplished something together."
        ]
      },
      {
        id: "group-dynamics",
        title: "Managing Group Dynamics",
        content: "Learn to handle the complex interpersonal dynamics that can make or break team meetings.",
        activities: [
          "Practice managing dominant personalities and drawing out quiet team members",
          "Learn to navigate conflict and disagreement constructively",
          "Master the art of building consensus without groupthink",
          "Create inclusion and ensure everyone's voice is heard"
        ],
        davidInsights: [
          "Every group has its own personality. Learn to read the room and adjust accordingly.",
          "The loudest voice in the room isn't always the most important one.",
          "Conflict in meetings isn't bad - it's often where the best ideas come from."
        ]
      },
      {
        id: "decision-making",
        title: "Driving Decisions and Commitment",
        content: "Transform meetings from talking shops into decision-making and commitment-building sessions.",
        activities: [
          "Practice different decision-making frameworks",
          "Learn to build consensus and commitment",
          "Master the art of summarizing and capturing decisions",
          "Create accountability and follow-through systems"
        ],
        davidInsights: [
          "Decisions without commitment are just wishes. Make sure everyone understands and commits to the outcome.",
          "The best decisions come from the group, not from the leader.",
          "Clear decisions create clarity and momentum. Unclear decisions create confusion and paralysis."
        ]
      }
    ],
    practiceScenarios: [
      {
        id: "contentious-decision",
        title: "The Contentious Technical Decision",
        context: "Your team needs to decide on a major architectural change. There are strong opinions on both sides, and the debate has been going on for weeks without resolution.",
        challenge: "Facilitate a meeting that drives to a decision while maintaining team unity",
        roleplayInstructions: [
          "Start by clarifying the decision criteria and process",
          "Ensure all perspectives are heard and understood",
          "Focus on facts and outcomes, not personalities",
          "Drive to a decision that everyone can commit to"
        ],
        coachingTips: [
          "Separate the decision from the people making it",
          "Use data and criteria to make the decision objective",
          "Ensure everyone feels heard before moving to decision",
          "Get explicit commitment from all team members"
        ],
        davidFeedback: "Technical decisions can get emotional because people are invested in their approaches. Your job is to keep the focus on what's best for the team and the project."
      },
      {
        id: "low-energy-team",
        title: "The Disengaged Team",
        context: "Your team meetings have become routine and boring. People show up but don't participate much, and energy is low. You need to re-energize and re-engage the team.",
        challenge: "Transform a low-energy meeting into an engaging, productive session",
        roleplayInstructions: [
          "Start with something that gets people engaged and talking",
          "Change the format from presentation to discussion",
          "Ask questions that require participation",
          "Create opportunities for everyone to contribute"
        ],
        coachingTips: [
          "Energy is contagious - bring your own energy first",
          "People engage when they feel their input matters",
          "Change the format to break people out of routine",
          "Create psychological safety for participation"
        ],
        davidFeedback: "Low energy in meetings usually means people don't feel their participation matters. Change that, and you'll change the energy."
      },
      {
        id: "dominant-personality",
        title: "The Meeting Dominator",
        context: "One team member consistently dominates meetings, talking over others and steering conversations to their preferred topics. Other team members are starting to disengage.",
        challenge: "Manage the dominant personality while ensuring everyone can participate",
        roleplayInstructions: [
          "Set clear ground rules for participation",
          "Use techniques to ensure everyone gets to speak",
          "Redirect dominating behavior diplomatically",
          "Create structure that prevents domination"
        ],
        coachingTips: [
          "Address dominating behavior directly but privately first",
          "Use time boxing and structured formats",
          "Actively invite participation from quieter team members",
          "Don't let one person derail the meeting for everyone"
        ],
        davidFeedback: "Dominant personalities often have good intentions but poor awareness. Your job is to channel their energy while protecting the group dynamic."
      },
      {
        id: "crisis-meeting",
        title: "The Crisis Response Meeting",
        context: "A major production issue has occurred, and you need to coordinate the response across multiple teams. People are stressed, information is incomplete, and pressure is high.",
        challenge: "Facilitate an effective crisis response while managing stress and uncertainty",
        roleplayInstructions: [
          "Start with what you know and what you need to find out",
          "Assign clear roles and responsibilities",
          "Create structure for regular updates and coordination",
          "Keep the focus on solutions, not blame"
        ],
        coachingTips: [
          "Stay calm and project confidence",
          "Be clear about priorities and next steps",
          "Create structure to manage the chaos",
          "Focus on what can be controlled"
        ],
        davidFeedback: "Crisis meetings test your ability to create calm and direction in chaos. Your energy and clarity will set the tone for the entire response."
      }
    ],
    assessmentCriteria: [
      {
        skill: "Meeting Design",
        description: "Ability to design meetings that achieve specific outcomes",
        levels: {
          developing: "Runs meetings without clear purpose or structure",
          proficient: "Creates agendas and follows basic meeting structure",
          advanced: "Designs meetings that engage participants and drive outcomes",
          expert: "Creates meeting experiences that build team effectiveness over time"
        }
      },
      {
        skill: "Facilitation",
        description: "Ability to guide groups through discussions and decisions",
        levels: {
          developing: "Dominates meetings or lets them drift without direction",
          proficient: "Keeps meetings on track and ensures participation",
          advanced: "Facilitates complex discussions and drives decisions",
          expert: "Creates breakthrough moments and builds group capability"
        }
      },
      {
        skill: "Group Dynamics",
        description: "Ability to read and manage interpersonal dynamics",
        levels: {
          developing: "Unaware of or unable to manage group dynamics",
          proficient: "Recognizes and addresses basic group dynamic issues",
          advanced: "Skillfully manages complex group dynamics and personalities",
          expert: "Transforms group dynamics to build stronger team relationships"
        }
      },
      {
        skill: "Decision Making",
        description: "Ability to drive groups to clear decisions and commitment",
        levels: {
          developing: "Meetings end without clear decisions or next steps",
          proficient: "Drives to decisions but may lack full commitment",
          advanced: "Achieves clear decisions with strong group commitment",
          expert: "Builds decision-making capability and ownership in the team"
        }
      }
    ]
  },
  {
    id: "workshop-3",
    title: "Executive Presentation Skills",
    subtitle: "Influencing at the Highest Levels",
    description: "Master the art of presenting to executives and senior leaders. Learn to communicate with gravitas, influence strategic decisions, and establish yourself as a trusted advisor.",
    duration: "2 hours",
    difficulty: "expert",
    prerequisites: [
      "Completed Lessons 1-4",
      "Experience presenting to leadership",
      "Understanding of business strategy and metrics"
    ],
    learningOutcomes: [
      "Structure presentations for executive decision-making",
      "Communicate technical concepts to business audiences",
      "Handle challenging questions and pushback",
      "Build executive presence and credibility",
      "Influence strategic decisions through presentation"
    ],
    modules: [
      {
        id: "executive-mindset",
        title: "Understanding the Executive Mindset",
        content: "Learn how executives think, what they care about, and how to communicate in ways that resonate with their priorities.",
        activities: [
          "Analyze executive communication patterns and preferences",
          "Practice translating technical concepts into business language",
          "Learn to focus on outcomes and decisions, not processes",
          "Master the art of leading with the bottom line"
        ],
        davidInsights: [
          "Executives are paid to make decisions, not to understand technical details. Make their decisions easier.",
          "They care about results, risks, and resources. Everything else is secondary.",
          "The best executive presentations feel like strategic conversations, not technical lectures."
        ]
      },
      {
        id: "presentation-structure",
        title: "Strategic Presentation Structure",
        content: "Learn to structure presentations that drive executive decision-making and action.",
        activities: [
          "Practice the Pyramid Principle for executive communication",
          "Learn to use the SCQA framework (Situation, Complication, Question, Answer)",
          "Master the art of executive summaries that stand alone",
          "Create presentations that work in both formal and informal settings"
        ],
        davidInsights: [
          "Start with your recommendation, not your reasoning. Executives want to know what you think first.",
          "Every slide should answer the question 'So what?' If it doesn't, cut it.",
          "The best presentations can be understood in half the time allocated. Executives appreciate efficiency."
        ]
      },
      {
        id: "executive-presence",
        title: "Building Executive Presence",
        content: "Develop the gravitas and confidence needed to command attention and respect in executive settings.",
        activities: [
          "Practice confident body language and vocal delivery",
          "Learn to manage nerves and project calm confidence",
          "Master the art of storytelling with data and emotion",
          "Build credibility through preparation and follow-through"
        ],
        davidInsights: [
          "Executive presence is about being comfortable with power and responsibility.",
          "Confidence comes from preparation, not just charisma.",
          "The best executives are great storytellers. Learn to tell stories that stick."
        ]
      },
      {
        id: "handling-pushback",
        title: "Managing Questions and Pushback",
        content: "Learn to handle challenging questions, disagreement, and pressure with grace and confidence.",
        activities: [
          "Practice the PREP framework for answering questions (Point, Reason, Example, Point)",
          "Learn to acknowledge concerns while maintaining your position",
          "Master the art of saying 'I don't know' professionally",
          "Create bridge phrases that help you navigate difficult moments"
        ],
        davidInsights: [
          "Pushback isn't personal - it's how executives stress-test ideas.",
          "The best answers acknowledge the question's underlying concern.",
          "If you don't know something, say so. Then explain how you'll find out."
        ]
      }
    ],
    practiceScenarios: [
      {
        id: "budget-request",
        title: "The Critical Budget Request",
        context: "You need to secure $2M in additional budget for infrastructure improvements. The CFO is skeptical about the ROI, and the CEO is focused on cost reduction.",
        challenge: "Present a compelling business case that addresses executive concerns",
        roleplayInstructions: [
          "Start with the business impact and risks",
          "Use data to support your recommendations",
          "Address concerns about ROI and timing",
          "End with a clear ask and next steps"
        ],
        coachingTips: [
          "Frame infrastructure as risk mitigation and competitive advantage",
          "Use business metrics, not technical metrics",
          "Address the ROI question head-on with data",
          "Show you understand the business context"
        ],
        davidFeedback: "Budget requests succeed when they're framed as business investments, not technical necessities. Show the cost of not investing."
      },
      {
        id: "strategic-pivot",
        title: "The Strategic Pivot Presentation",
        context: "You need to recommend a major change in technical direction that will delay current projects but position the company for future success.",
        challenge: "Present a strategic recommendation that requires short-term sacrifice for long-term gain",
        roleplayInstructions: [
          "Start with the strategic context and market changes",
          "Present the recommendation with supporting analysis",
          "Address the costs and timeline implications honestly",
          "End with a phased implementation plan"
        ],
        coachingTips: [
          "Focus on competitive advantage and market positioning",
          "Be honest about costs and timeline impacts",
          "Present options with clear trade-offs",
          "Show you've thought through implementation challenges"
        ],
        davidFeedback: "Strategic pivots require courage and conviction. Present the data clearly, but also help them feel confident in the decision."
      },
      {
        id: "crisis-briefing",
        title: "The Crisis Executive Briefing",
        context: "A major security incident has occurred, and you need to brief the executive team on the situation, impact, and response plan.",
        challenge: "Communicate clearly under pressure while maintaining executive confidence",
        roleplayInstructions: [
          "Start with the current situation and immediate actions taken",
          "Explain the impact on customers and business",
          "Present the response plan and timeline",
          "Address questions about prevention and lessons learned"
        ],
        coachingTips: [
          "Stay calm and project confidence",
          "Be clear about what you know and don't know",
          "Focus on actions and timelines",
          "Address customer and business impact first"
        ],
        davidFeedback: "Crisis briefings test your ability to communicate clearly under pressure. Your calm confidence will help executives make better decisions."
      },
      {
        id: "transformation-proposal",
        title: "The Digital Transformation Proposal",
        context: "You need to propose a major technology transformation that will modernize the company's systems and processes over 18 months.",
        challenge: "Present a complex transformation in a way that builds executive confidence and commitment",
        roleplayInstructions: [
          "Start with the business case for transformation",
          "Present the transformation roadmap with clear phases",
          "Address risks and mitigation strategies",
          "End with resource requirements and success metrics"
        ],
        coachingTips: [
          "Focus on business outcomes, not technical features",
          "Break the transformation into manageable phases",
          "Address change management and organizational impact",
          "Show how you'll measure and communicate success"
        ],
        davidFeedback: "Transformation proposals require both vision and pragmatism. Show the destination clearly, but also show you understand the journey."
      }
    ],
    assessmentCriteria: [
      {
        skill: "Executive Communication",
        description: "Ability to communicate effectively with senior leadership",
        levels: {
          developing: "Focuses on technical details rather than business impact",
          proficient: "Translates technical concepts into business language",
          advanced: "Communicates with executive presence and confidence",
          expert: "Influences strategic decisions and builds trusted advisor relationships"
        }
      },
      {
        skill: "Presentation Structure",
        description: "Ability to structure presentations for maximum impact",
        levels: {
          developing: "Presentations lack clear structure or logical flow",
          proficient: "Creates organized presentations with clear messages",
          advanced: "Structures presentations that drive decision-making",
          expert: "Creates presentation experiences that are memorable and actionable"
        }
      },
      {
        skill: "Handling Pressure",
        description: "Ability to perform under pressure and handle difficult questions",
        levels: {
          developing: "Struggles with difficult questions or high-pressure situations",
          proficient: "Handles basic questions and maintains composure",
          advanced: "Manages challenging questions and pushback skillfully",
          expert: "Transforms pressure situations into opportunities to build credibility"
        }
      },
      {
        skill: "Strategic Thinking",
        description: "Ability to think and communicate strategically",
        levels: {
          developing: "Focuses on tactical issues rather than strategic implications",
          proficient: "Understands and communicates strategic context",
          advanced: "Provides strategic insights and recommendations",
          expert: "Influences strategic direction through communication"
        }
      }
    ]
  },
  {
    id: "workshop-4",
    title: "Change Communication Strategy",
    subtitle: "Leading Organizational Transformation",
    description: "Master the art of communicating change across large organizations. Learn to build understanding, address resistance, and drive adoption of new strategies, processes, and technologies.",
    duration: "2 hours",
    difficulty: "expert",
    prerequisites: [
      "Completed Lessons 1-4",
      "Experience with organizational change",
      "Understanding of change management principles"
    ],
    learningOutcomes: [
      "Design communication strategies for complex change initiatives",
      "Address resistance and build buy-in across organizations",
      "Create cascading communication that reaches all levels",
      "Measure and adjust communication effectiveness",
      "Build change leadership capability in others"
    ],
    modules: [
      {
        id: "change-psychology",
        title: "Understanding Change Psychology",
        content: "Learn why people resist change and how to address the emotional and psychological aspects of organizational transformation.",
        activities: [
          "Analyze the change curve and communication needs at each stage",
          "Practice identifying and addressing different types of resistance",
          "Learn to communicate both rational and emotional aspects of change",
          "Create empathy maps for different stakeholder groups"
        ],
        davidInsights: [
          "Change is emotional, not just logical. Address the heart first, then the mind.",
          "Resistance is usually fear in disguise. Address the fear, and the resistance often disappears.",
          "People don't resist change - they resist being changed. Help them be part of the solution."
        ]
      },
      {
        id: "communication-strategy",
        title: "Strategic Communication Planning",
        content: "Design comprehensive communication strategies that reach all stakeholders with the right message at the right time.",
        activities: [
          "Create stakeholder maps and communication matrices",
          "Design multi-channel communication campaigns",
          "Learn to sequence messages for maximum impact",
          "Build feedback loops to adjust communication strategy"
        ],
        davidInsights: [
          "Communication strategy is like military strategy - you need to think several moves ahead.",
          "The best change communication plans are iterative. Start with a hypothesis and adjust based on feedback.",
          "Different stakeholders need different messages, but the core story must be consistent."
        ]
      },
      {
        id: "cascade-communication",
        title: "Building Communication Cascades",
        content: "Create systems that ensure consistent messages reach everyone in the organization effectively.",
        activities: [
          "Design manager toolkits for cascading communication",
          "Practice training managers to deliver consistent messages",
          "Learn to create feedback loops that ensure message fidelity",
          "Build systems for two-way communication and feedback"
        ],
        davidInsights: [
          "Communication cascades are like a game of telephone - messages get distorted unless you're careful.",
          "Managers are your most important communication partners. Invest in their capability.",
          "The best cascades include feedback loops so you know what's really being heard."
        ]
      },
      {
        id: "measuring-effectiveness",
        title: "Measuring Communication Effectiveness",
        content: "Learn to track and measure whether your communication is actually driving the behavior change you need.",
        activities: [
          "Create communication metrics and dashboards",
          "Practice pulse surveys and feedback collection",
          "Learn to connect communication activities to business outcomes",
          "Build continuous improvement into communication planning"
        ],
        davidInsights: [
          "What gets measured gets managed. If you're not measuring communication effectiveness, you're flying blind.",
          "The best metrics combine leading indicators (awareness, understanding) with lagging indicators (behavior change).",
          "Communication success is ultimately measured by business results, not communication activities."
        ]
      }
    ],
    practiceScenarios: [
      {
        id: "cultural-transformation",
        title: "The Culture Change Initiative",
        context: "Your organization needs to shift from a hierarchical, command-and-control culture to a more collaborative, innovative culture. This affects how everyone works and communicates.",
        challenge: "Design a communication strategy that drives cultural transformation",
        roleplayInstructions: [
          "Start by defining the desired culture in concrete behaviors",
          "Create communication that addresses both rational and emotional aspects",
          "Design ways to reinforce new behaviors through communication",
          "Build systems for feedback and course correction"
        ],
        coachingTips: [
          "Culture change is behavior change scaled up",
          "Use stories and examples to make the new culture tangible",
          "Address the fears and concerns about changing how people work",
          "Create early wins that demonstrate the value of the new culture"
        ],
        davidFeedback: "Cultural transformation is the hardest kind of change because it requires people to change how they think and act. Communication must be consistent, persistent, and authentic."
      },
      {
        id: "merger-integration",
        title: "The Merger Integration",
        context: "Your company is acquiring another company with a different culture and way of working. You need to integrate 500+ people while maintaining productivity and morale.",
        challenge: "Communicate integration plans that address cultural differences and uncertainty",
        roleplayInstructions: [
          "Acknowledge the uncertainty and concerns of both organizations",
          "Create communication that celebrates the strengths of both cultures",
          "Design integration communication that builds excitement about the future",
          "Build feedback systems to address integration challenges"
        ],
        coachingTips: [
          "Mergers create anxiety because people fear losing their identity",
          "Communicate the vision for the combined organization clearly",
          "Address practical concerns about jobs, processes, and culture",
          "Use champions from both organizations to build credibility"
        ],
        davidFeedback: "Merger communication must balance honesty about challenges with optimism about opportunities. People need to know what's changing and what's staying the same."
      },
      {
        id: "technology-transformation",
        title: "The Digital Transformation",
        context: "Your organization is implementing new technologies that will change how everyone works. Some employees are excited, others are anxious about learning new skills.",
        challenge: "Create communication that builds confidence and adoption of new technologies",
        roleplayInstructions: [
          "Address both the opportunities and challenges of new technology",
          "Create communication that reduces anxiety about learning new skills",
          "Design training and support communication that builds confidence",
          "Build feedback systems to address adoption challenges"
        ],
        coachingTips: [
          "Technology anxiety is often really about competence anxiety",
          "Use success stories and peer examples to build confidence",
          "Address the 'what's in it for me' question clearly",
          "Create support systems that make learning feel safe"
        ],
        davidFeedback: "Technology transformation communication must focus on human impact, not just technical features. Help people see how the technology will make their work better."
      },
      {
        id: "restructuring-communication",
        title: "The Organizational Restructuring",
        context: "Your company is restructuring to improve efficiency and customer focus. This involves changing reporting relationships, team structures, and decision-making processes.",
        challenge: "Communicate restructuring plans that maintain morale and productivity",
        roleplayInstructions: [
          "Explain the business rationale for restructuring clearly",
          "Address concerns about job security and role changes",
          "Create communication that helps people understand their new roles",
          "Build systems for ongoing support during the transition"
        ],
        coachingTips: [
          "Restructuring communication must be clear about what's changing and what's not",
          "Address the emotional impact of changing relationships and roles",
          "Use data and examples to show why the change is necessary",
          "Create support systems for managers who are leading the change"
        ],
        davidFeedback: "Restructuring communication requires both strategic clarity and human empathy. People need to understand the why and feel supported through the how."
      }
    ],
    assessmentCriteria: [
      {
        skill: "Strategic Planning",
        description: "Ability to design comprehensive communication strategies",
        levels: {
          developing: "Creates ad hoc communication without overall strategy",
          proficient: "Develops basic communication plans for change initiatives",
          advanced: "Creates comprehensive, multi-channel communication strategies",
          expert: "Designs communication strategies that drive organizational transformation"
        }
      },
      {
        skill: "Stakeholder Management",
        description: "Ability to communicate effectively with diverse stakeholder groups",
        levels: {
          developing: "Uses one-size-fits-all communication approach",
          proficient: "Adapts communication for different stakeholder groups",
          advanced: "Creates targeted communication that resonates with each group",
          expert: "Orchestrates complex stakeholder communication that builds coalition"
        }
      },
      {
        skill: "Resistance Management",
        description: "Ability to address resistance and build buy-in",
        levels: {
          developing: "Ignores or fights resistance directly",
          proficient: "Acknowledges resistance and provides rational responses",
          advanced: "Addresses underlying concerns and builds understanding",
          expert: "Transforms resistance into partnership and advocacy"
        }
      },
      {
        skill: "Change Leadership",
        description: "Ability to lead others through change communication",
        levels: {
          developing: "Focuses only on own communication responsibilities",
          proficient: "Supports others in delivering change communication",
          advanced: "Builds change communication capability in others",
          expert: "Creates change communication systems that scale across the organization"
        }
      }
    ]
  }
];

export default executiveWorkshops;