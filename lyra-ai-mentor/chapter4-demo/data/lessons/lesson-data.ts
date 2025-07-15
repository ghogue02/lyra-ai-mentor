// Chapter 4 David Chen - Leadership Communication Lessons
// Complete lesson structure for all 5 lessons

export interface LeadershipLesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: {
    id: string;
    title: string;
    description: string;
    examples: string[];
    exercises: string[];
  }[];
  scenarios: {
    id: string;
    title: string;
    context: string;
    challenge: string;
    solution: string;
    davidInsight: string;
  }[];
  practiceActivities: {
    id: string;
    title: string;
    type: 'roleplay' | 'simulation' | 'reflection' | 'practice';
    description: string;
    instructions: string[];
    feedback: string;
  }[];
  assessments: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'scenario' | 'reflection';
    options?: string[];
    feedback: string;
  }[];
}

export const chapter4Lessons: LeadershipLesson[] = [
  {
    id: "lesson-1",
    title: "Leadership Communication Foundations",
    subtitle: "Building Your Leadership Voice",
    description: "Master the fundamental principles of leadership communication, developing your authentic leadership voice while learning to adapt your communication style to different audiences and contexts.",
    objectives: [
      "Understand the core principles of leadership communication",
      "Develop your authentic leadership voice and presence",
      "Learn to adapt communication style to different audiences",
      "Master the art of influential messaging",
      "Build confidence in leadership communication"
    ],
    duration: "45 minutes",
    difficulty: "beginner",
    concepts: [
      {
        id: "leadership-voice",
        title: "Developing Your Leadership Voice",
        description: "Your leadership voice is the unique combination of your values, expertise, and communication style that inspires others to follow you.",
        examples: [
          "Steve Jobs' visionary and demanding style",
          "Oprah's empathetic and inspiring approach",
          "Bill Gates' analytical and data-driven communication",
          "Sheryl Sandberg's collaborative and authentic style"
        ],
        exercises: [
          "Record yourself giving a team update and analyze your natural speaking patterns",
          "Write your leadership values and practice articulating them clearly",
          "Practice telling your professional story in 2 minutes",
          "Get feedback on your communication style from trusted colleagues"
        ]
      },
      {
        id: "audience-adaptation",
        title: "Adapting to Your Audience",
        description: "Effective leaders adjust their communication style, content, and delivery based on their audience's needs, expertise level, and context.",
        examples: [
          "Technical deep-dive for engineering team vs. high-level overview for executives",
          "Formal presentation for board vs. casual check-in with direct reports",
          "Crisis communication for different stakeholder groups",
          "Change announcement tailored to impact on each team"
        ],
        exercises: [
          "Prepare the same message for three different audiences",
          "Practice code-switching between technical and business language",
          "Role-play difficult conversations with different personality types",
          "Create audience personas for key stakeholders"
        ]
      },
      {
        id: "influential-messaging",
        title: "Crafting Influential Messages",
        description: "Learn to structure your communication for maximum impact using proven frameworks and persuasion techniques.",
        examples: [
          "The STAR method for storytelling (Situation, Task, Action, Result)",
          "The Pyramid Principle for executive communication",
          "The Before-After-Bridge framework for change communication",
          "The Problem-Solution-Benefit structure for proposals"
        ],
        exercises: [
          "Rewrite a recent email using the Pyramid Principle",
          "Practice delivering bad news using the SPIKES framework",
          "Create a compelling vision statement for your team",
          "Structure a persuasive business case using data and emotion"
        ]
      }
    ],
    scenarios: [
      {
        id: "new-leader",
        title: "The New Leader Introduction",
        context: "You've just been promoted to lead a team of 15 engineers, some of whom were your peers last week.",
        challenge: "Establish credibility and authority while maintaining relationships",
        solution: "Focus on shared goals, acknowledge the transition, and demonstrate value through actions",
        davidInsight: "The key is to acknowledge the change honestly while focusing on the team's success. I learned that trying to pretend nothing changed actually made things worse."
      },
      {
        id: "skeptical-audience",
        title: "The Skeptical Stakeholder",
        context: "You need to present a technical initiative to business stakeholders who don't understand the technical details but control the budget.",
        challenge: "Translate technical complexity into business value and risk",
        solution: "Use business metrics, analogies, and focus on outcomes rather than implementation details",
        davidInsight: "I learned to speak their language first - ROI, risk mitigation, competitive advantage. The technical details come only if they ask."
      },
      {
        id: "resistance-to-change",
        title: "The Change Resistance",
        context: "Your team is resistant to a new process that will improve efficiency but requires learning new tools.",
        challenge: "Address emotional concerns while maintaining the business need for change",
        solution: "Acknowledge concerns, involve the team in solution design, and create quick wins",
        davidInsight: "Resistance is usually fear in disguise. Address the fear first, then the facts become easier to accept."
      }
    ],
    practiceActivities: [
      {
        id: "leadership-pitch",
        title: "Your Leadership Pitch",
        type: "practice",
        description: "Develop and practice your personal leadership pitch - a compelling 2-minute introduction that establishes your credibility and leadership style.",
        instructions: [
          "Write your professional story highlighting leadership moments",
          "Practice delivering it with confidence and authenticity",
          "Include your values, expertise, and vision",
          "Get feedback and refine your delivery"
        ],
        feedback: "Strong leaders can articulate their value proposition clearly and inspire confidence in their ability to lead."
      },
      {
        id: "difficult-message",
        title: "Delivering Difficult Messages",
        type: "roleplay",
        description: "Practice delivering challenging news while maintaining trust and team morale.",
        instructions: [
          "Choose a realistic difficult message scenario",
          "Structure your communication using proven frameworks",
          "Practice your delivery, tone, and body language",
          "Prepare for questions and emotional responses"
        ],
        feedback: "The best leaders don't avoid difficult conversations - they prepare for them thoroughly and approach them with empathy."
      },
      {
        id: "vision-communication",
        title: "Communicating Vision",
        type: "simulation",
        description: "Practice communicating a compelling vision that motivates and aligns your team.",
        instructions: [
          "Create a vision for your team or project",
          "Practice different delivery styles and formats",
          "Focus on emotion and inspiration, not just facts",
          "Connect the vision to individual team member goals"
        ],
        feedback: "Visions that stick are simple, memorable, and personally meaningful to each team member."
      }
    ],
    assessments: [
      {
        id: "assessment-1",
        question: "What is the most important factor in developing your leadership voice?",
        type: "multiple-choice",
        options: [
          "Copying successful leaders' styles",
          "Being authentic while adapting to context",
          "Always being the loudest voice in the room",
          "Using complex vocabulary to sound intelligent"
        ],
        feedback: "Authenticity builds trust, but great leaders adapt their style to be most effective with their audience."
      },
      {
        id: "assessment-2",
        question: "How would you communicate a technical project delay to both your engineering team and executive leadership?",
        type: "scenario",
        feedback: "Strong answers show different messaging for different audiences while maintaining consistency in facts and commitment to solutions."
      },
      {
        id: "assessment-3",
        question: "Reflect on a time when your communication style didn't match your audience. What would you do differently?",
        type: "reflection",
        feedback: "Self-awareness and the ability to adapt based on feedback are hallmarks of great leadership communication."
      }
    ]
  },
  {
    id: "lesson-2",
    title: "Team Building Through Communication",
    subtitle: "Creating High-Performing Teams",
    description: "Learn how to use communication as a tool for building trust, fostering collaboration, and creating psychological safety within your team.",
    objectives: [
      "Build trust through transparent communication",
      "Foster collaboration and psychological safety",
      "Master team meeting facilitation",
      "Handle team conflicts effectively",
      "Create communication norms that drive performance"
    ],
    duration: "50 minutes",
    difficulty: "intermediate",
    concepts: [
      {
        id: "psychological-safety",
        title: "Building Psychological Safety",
        description: "Create an environment where team members feel safe to take risks, make mistakes, and speak up with ideas or concerns.",
        examples: [
          "Admitting your own mistakes and learning from them",
          "Asking for feedback and acting on it",
          "Celebrating intelligent failures and learning",
          "Encouraging diverse perspectives and dissenting opinions"
        ],
        exercises: [
          "Practice saying 'I don't know' and 'I was wrong' in team settings",
          "Create a team charter that includes communication norms",
          "Implement regular retrospectives focused on communication",
          "Model vulnerability by sharing your own learning experiences"
        ]
      },
      {
        id: "team-meetings",
        title: "Effective Team Meeting Facilitation",
        description: "Transform meetings from time-wasters into powerful team building and decision-making sessions.",
        examples: [
          "Starting with personal check-ins to build connection",
          "Using structured decision-making frameworks",
          "Ensuring everyone has a voice in discussions",
          "Ending with clear action items and ownership"
        ],
        exercises: [
          "Practice different meeting formats (stand-ups, retrospectives, brainstorming)",
          "Learn to redirect tangential discussions back to objectives",
          "Master the art of asking powerful questions",
          "Create meeting templates that drive engagement"
        ]
      },
      {
        id: "conflict-resolution",
        title: "Navigating Team Conflicts",
        description: "Address team conflicts constructively to strengthen relationships and improve team dynamics.",
        examples: [
          "Mediating disagreements between team members",
          "Addressing performance issues affecting team morale",
          "Managing personality clashes and communication styles",
          "Resolving technical disagreements and architectural debates"
        ],
        exercises: [
          "Practice active listening and empathy in conflict situations",
          "Learn to separate people from problems",
          "Master the art of finding common ground",
          "Create processes for healthy debate and decision-making"
        ]
      }
    ],
    scenarios: [
      {
        id: "team-dysfunction",
        title: "The Dysfunctional Team",
        context: "Your team has low morale, poor communication, and missed deadlines. Team members avoid taking initiative and blame each other for problems.",
        challenge: "Transform team culture through communication changes",
        solution: "Start with psychological safety, implement structured communication processes, and model the behavior you want to see",
        davidInsight: "I learned that fixing team dysfunction starts with fixing team communication. You can't solve technical problems if you can't solve human problems first."
      },
      {
        id: "remote-team",
        title: "The Remote Team Challenge",
        context: "Your team has been remote for months, and you're noticing decreased collaboration, innovation, and team cohesion.",
        challenge: "Rebuild team connection and collaboration in a virtual environment",
        solution: "Create more structured touchpoints, use video effectively, and build in informal interaction time",
        davidInsight: "Remote teams need more intentional communication, not just more meetings. The informal conversations that build trust don't happen naturally online."
      },
      {
        id: "high-performer",
        title: "The Brilliant Jerk",
        context: "You have a technically brilliant team member whose abrasive communication style is hurting team morale and collaboration.",
        challenge: "Address behavior issues while retaining technical talent",
        solution: "Have direct conversations about impact, provide coaching, and set clear expectations",
        davidInsight: "Technical brilliance doesn't excuse poor communication. The cost of keeping a brilliant jerk is usually higher than the cost of losing them."
      }
    ],
    practiceActivities: [
      {
        id: "team-charter",
        title: "Creating Team Communication Norms",
        type: "practice",
        description: "Develop a team charter that establishes communication norms and expectations for collaboration.",
        instructions: [
          "Facilitate a team discussion about communication preferences",
          "Document agreed-upon norms for meetings, decisions, and feedback",
          "Create processes for addressing communication breakdowns",
          "Regularly review and update the charter"
        ],
        feedback: "The best team charters are created collaboratively and revisited regularly to ensure they're still serving the team."
      },
      {
        id: "difficult-conversation",
        title: "The Difficult Team Conversation",
        type: "roleplay",
        description: "Practice having difficult conversations with team members while maintaining relationships.",
        instructions: [
          "Choose a realistic scenario (performance, behavior, conflict)",
          "Practice using the SBI framework (Situation, Behavior, Impact)",
          "Focus on specific behaviors rather than personality",
          "End with clear expectations and support"
        ],
        feedback: "Difficult conversations get easier with practice. The key is preparation, empathy, and focusing on solutions."
      },
      {
        id: "meeting-facilitation",
        title: "Meeting Facilitation Mastery",
        type: "simulation",
        description: "Practice facilitating different types of team meetings to drive engagement and outcomes.",
        instructions: [
          "Practice different meeting formats and facilitation techniques",
          "Learn to manage dominant personalities and quiet team members",
          "Create psychological safety for sharing ideas and concerns",
          "Master the art of time management and staying on topic"
        ],
        feedback: "Great meeting facilitators make everyone feel heard while keeping the group focused on outcomes."
      }
    ],
    assessments: [
      {
        id: "assessment-1",
        question: "What is the foundation of psychological safety in teams?",
        type: "multiple-choice",
        options: [
          "Never criticizing team members",
          "Leader vulnerability and consistency",
          "Avoiding difficult conversations",
          "Always agreeing with the team"
        ],
        feedback: "Psychological safety is built when leaders model vulnerability and respond consistently to team members' contributions."
      },
      {
        id: "assessment-2",
        question: "How would you handle a situation where two team members are in constant conflict about technical approaches?",
        type: "scenario",
        feedback: "Effective responses focus on the underlying issues, create structured ways to evaluate options, and establish decision-making processes."
      },
      {
        id: "assessment-3",
        question: "Describe a team communication norm that has significantly improved team performance in your experience.",
        type: "reflection",
        feedback: "The best communication norms are specific, measurable, and directly tied to team performance outcomes."
      }
    ]
  },
  {
    id: "lesson-3",
    title: "Managing Up and Down",
    subtitle: "Multi-Directional Leadership",
    description: "Master the art of communicating effectively with executives, peers, and direct reports - tailoring your approach for maximum impact at every level.",
    objectives: [
      "Communicate effectively with senior leadership",
      "Influence without authority across peer groups",
      "Provide clear direction to direct reports",
      "Navigate complex organizational dynamics",
      "Build relationships that drive results"
    ],
    duration: "55 minutes",
    difficulty: "advanced",
    concepts: [
      {
        id: "executive-communication",
        title: "Communicating with Executives",
        description: "Learn to communicate with senior leaders in a way that demonstrates strategic thinking and drives decision-making.",
        examples: [
          "Leading with the bottom line and key decisions needed",
          "Using data and metrics to support recommendations",
          "Anticipating questions and preparing concise answers",
          "Framing technical issues in business terms"
        ],
        exercises: [
          "Practice the elevator pitch for complex technical projects",
          "Create executive summaries that drive action",
          "Learn to present options with clear recommendations",
          "Master the art of saying 'no' to executive requests"
        ]
      },
      {
        id: "peer-influence",
        title: "Influencing Peers and Cross-Functional Partners",
        description: "Build influence across the organization when you don't have direct authority.",
        examples: [
          "Collaborating with product managers on feature prioritization",
          "Working with other engineering teams on shared infrastructure",
          "Influencing design and user experience decisions",
          "Building consensus on technical standards and practices"
        ],
        exercises: [
          "Practice finding win-win solutions in cross-functional conflicts",
          "Learn to build coalitions for important initiatives",
          "Master the art of asking for help and resources",
          "Create influence maps for key organizational relationships"
        ]
      },
      {
        id: "direct-report-management",
        title: "Leading Direct Reports",
        description: "Provide clear direction, support, and development opportunities for your team members.",
        examples: [
          "Setting clear expectations and providing regular feedback",
          "Coaching for performance and career development",
          "Delegating effectively while maintaining accountability",
          "Creating growth opportunities and stretch assignments"
        ],
        exercises: [
          "Practice different coaching conversation styles",
          "Learn to delegate based on skill level and motivation",
          "Master the art of giving both positive and constructive feedback",
          "Create development plans that align with business needs"
        ]
      }
    ],
    scenarios: [
      {
        id: "budget-request",
        title: "The Critical Budget Request",
        context: "You need to request additional budget for critical infrastructure improvements. The executive team is focused on cost-cutting and may not understand the technical risks.",
        challenge: "Translate technical needs into business language and demonstrate ROI",
        solution: "Focus on risk mitigation, competitive advantage, and quantifiable business outcomes",
        davidInsight: "I learned that executives don't care about technical elegance - they care about business impact. Frame every technical decision in terms of business value."
      },
      {
        id: "cross-functional-conflict",
        title: "The Product Partnership Problem",
        context: "You're in constant conflict with the product team about technical feasibility and timeline estimates. The relationship is affecting team morale and project success.",
        challenge: "Rebuild the relationship while maintaining technical standards",
        solution: "Create structured communication processes, shared metrics, and collaborative planning",
        davidInsight: "The best partnerships are built on mutual respect and understanding. I had to learn to see the product team as partners, not obstacles."
      },
      {
        id: "underperforming-manager",
        title: "The Struggling Manager",
        context: "One of your direct reports was recently promoted to management but is struggling with the transition. Their team is starting to complain about lack of direction.",
        challenge: "Provide coaching and support while ensuring team performance",
        solution: "Intensive coaching, clear expectations, and potential team restructuring if needed",
        davidInsight: "Not everyone who's a great individual contributor will be a great manager. The key is recognizing this early and providing the right support."
      }
    ],
    practiceActivities: [
      {
        id: "executive-presentation",
        title: "Executive Presentation Skills",
        type: "practice",
        description: "Practice presenting complex technical information to executive audiences in a compelling way.",
        instructions: [
          "Choose a complex technical initiative to present",
          "Structure your presentation for executive decision-making",
          "Practice handling challenging questions and pushback",
          "Focus on business outcomes and strategic alignment"
        ],
        feedback: "Executive presentations succeed when they make the decision easy and obvious for the audience."
      },
      {
        id: "peer-negotiation",
        title: "Cross-Functional Negotiation",
        type: "simulation",
        description: "Practice negotiating with peers when you need their support but don't have authority over them.",
        instructions: [
          "Identify a realistic cross-functional challenge",
          "Prepare your negotiation strategy and alternatives",
          "Practice finding mutual benefit and common ground",
          "Learn to build long-term relationships, not just win arguments"
        ],
        feedback: "The best negotiations result in stronger relationships and better outcomes for everyone involved."
      },
      {
        id: "coaching-conversation",
        title: "Coaching Your Direct Reports",
        type: "roleplay",
        description: "Practice coaching conversations that develop your team members' skills and career growth.",
        instructions: [
          "Practice different coaching scenarios (performance, development, career)",
          "Learn to ask powerful questions rather than giving answers",
          "Focus on the person's growth, not just task completion",
          "Create action plans with clear accountability"
        ],
        feedback: "Great coaches help people discover their own solutions while providing support and guidance."
      }
    ],
    assessments: [
      {
        id: "assessment-1",
        question: "What's the most important principle when communicating with executives?",
        type: "multiple-choice",
        options: [
          "Show them how smart you are with technical details",
          "Always agree with their proposals",
          "Lead with business impact and decisions needed",
          "Use lots of data and charts"
        ],
        feedback: "Executives want to understand business impact and make decisions quickly. Lead with what matters most to them."
      },
      {
        id: "assessment-2",
        question: "How would you handle a situation where a peer team's priorities conflict with your team's needs?",
        type: "scenario",
        feedback: "Effective responses focus on finding shared goals, creating win-win solutions, and building long-term relationships."
      },
      {
        id: "assessment-3",
        question: "Describe a time when you had to give difficult feedback to a direct report. What approach did you take?",
        type: "reflection",
        feedback: "The best feedback conversations are specific, timely, and focused on behavior and impact rather than personality."
      }
    ]
  },
  {
    id: "lesson-4",
    title: "Crisis Communication Leadership",
    subtitle: "Leading Through Uncertainty",
    description: "Learn to communicate effectively during crises, maintaining team confidence and stakeholder trust while managing uncertainty and pressure.",
    objectives: [
      "Communicate clearly under pressure",
      "Maintain team confidence during crises",
      "Manage stakeholder expectations effectively",
      "Make decisions with incomplete information",
      "Build organizational resilience through communication"
    ],
    duration: "60 minutes",
    difficulty: "advanced",
    concepts: [
      {
        id: "crisis-communication-principles",
        title: "Crisis Communication Principles",
        description: "Master the fundamental principles of communicating during high-pressure, high-stakes situations.",
        examples: [
          "Communicating with transparency while managing sensitive information",
          "Providing regular updates even when there's no new information",
          "Balancing urgency with accuracy in communications",
          "Managing multiple stakeholder groups with different needs"
        ],
        exercises: [
          "Practice the crisis communication template (What, When, Why, What Next)",
          "Learn to communicate uncertainty without creating panic",
          "Master the art of saying 'I don't know' professionally",
          "Create communication cascades for different crisis scenarios"
        ]
      },
      {
        id: "stakeholder-management",
        title: "Multi-Stakeholder Management",
        description: "Navigate complex stakeholder relationships during crises when everyone wants different information at different times.",
        examples: [
          "Coordinating with executives, customers, and internal teams",
          "Managing external communications and media relations",
          "Balancing transparency with competitive sensitivity",
          "Creating consistent messaging across all channels"
        ],
        exercises: [
          "Create stakeholder communication matrices for crisis scenarios",
          "Practice triage decision-making under pressure",
          "Learn to delegate communication responsibilities effectively",
          "Master the art of saying 'no' to information requests"
        ]
      },
      {
        id: "team-leadership-under-pressure",
        title: "Leading Teams Under Pressure",
        description: "Keep your team focused, motivated, and effective when everything is falling apart around you.",
        examples: [
          "Maintaining team morale during extended outages",
          "Making rapid decisions with incomplete information",
          "Coordinating response efforts across multiple teams",
          "Managing team stress and preventing burnout"
        ],
        exercises: [
          "Practice calm, confident communication during simulated crises",
          "Learn to break down complex problems into manageable tasks",
          "Master the art of quick team coordination and task assignment",
          "Create team support systems for high-stress situations"
        ]
      }
    ],
    scenarios: [
      {
        id: "major-outage",
        title: "The Major Production Outage",
        context: "Your company's main service is down, affecting thousands of customers. The CEO is getting calls from major clients, and your team is scrambling to identify the root cause.",
        challenge: "Coordinate response efforts while keeping all stakeholders informed",
        solution: "Establish clear communication protocols, assign roles, and provide regular updates",
        davidInsight: "In crisis, people don't need perfect information - they need consistent, honest communication and confidence that you're in control."
      },
      {
        id: "security-breach",
        title: "The Security Incident",
        context: "Your security team has detected a potential breach. You don't know the extent of the damage yet, but you need to inform executives and potentially customers.",
        challenge: "Balance transparency with the need to investigate fully",
        solution: "Communicate what you know, when you'll know more, and what actions are being taken",
        davidInsight: "Security incidents require careful communication - too much information can cause panic, too little can damage trust."
      },
      {
        id: "team-crisis",
        title: "The Team Meltdown",
        context: "Your team is burned out from months of crunch time. Two key people have just quit, and the remaining team members are talking about leaving. You have critical deadlines approaching.",
        challenge: "Rebuild team morale and retention while meeting business commitments",
        solution: "Address the underlying issues, provide support, and reset expectations",
        davidInsight: "Team crises often have communication at their root. People leave managers, not companies - and managers who don't communicate well."
      }
    ],
    practiceActivities: [
      {
        id: "crisis-simulation",
        title: "Crisis Communication Simulation",
        type: "simulation",
        description: "Practice managing communications during a simulated crisis scenario with multiple stakeholders.",
        instructions: [
          "Work through a realistic crisis scenario step by step",
          "Practice communicating with different stakeholder groups",
          "Learn to manage information flow and decision-making",
          "Debrief on communication effectiveness and lessons learned"
        ],
        feedback: "Crisis communication improves with practice. The key is staying calm and maintaining clear, consistent messaging."
      },
      {
        id: "pressure-communication",
        title: "Communicating Under Pressure",
        type: "practice",
        description: "Practice delivering clear, confident communication when you're stressed and under pressure.",
        instructions: [
          "Practice speaking clearly when you're stressed or anxious",
          "Learn breathing and centering techniques for high-pressure situations",
          "Master the art of projecting confidence even when you're uncertain",
          "Practice pivot phrases for unexpected questions or challenges"
        ],
        feedback: "Your team takes their cues from you. If you're calm and confident, they will be too."
      },
      {
        id: "stakeholder-coordination",
        title: "Multi-Stakeholder Coordination",
        type: "roleplay",
        description: "Practice coordinating communications across multiple stakeholder groups with different needs and concerns.",
        instructions: [
          "Identify different stakeholder groups and their communication needs",
          "Practice adapting your message for different audiences",
          "Learn to coordinate messaging across multiple channels",
          "Master the art of saying 'no' to unrealistic requests"
        ],
        feedback: "Effective stakeholder management requires understanding each group's needs and communicating accordingly."
      }
    ],
    assessments: [
      {
        id: "assessment-1",
        question: "What's the most important principle of crisis communication?",
        type: "multiple-choice",
        options: [
          "Always wait until you have complete information",
          "Communicate frequently and consistently, even with partial information",
          "Only communicate with the most senior stakeholders",
          "Focus on assigning blame quickly"
        ],
        feedback: "People need regular communication during crises, even if you don't have complete information. Silence creates anxiety."
      },
      {
        id: "assessment-2",
        question: "How would you handle a situation where you need to communicate about a problem but don't yet know the full extent or cause?",
        type: "scenario",
        feedback: "Effective responses acknowledge uncertainty while providing what is known, next steps, and timelines for more information."
      },
      {
        id: "assessment-3",
        question: "Reflect on a crisis situation you've managed. What communication strategies worked well, and what would you do differently?",
        type: "reflection",
        feedback: "The best crisis leaders learn from each experience and build better communication systems for future challenges."
      }
    ]
  },
  {
    id: "lesson-5",
    title: "Executive Communication Workshops",
    subtitle: "Mastering Advanced Leadership Communication",
    description: "Four intensive workshops focusing on advanced leadership communication skills: one-on-one mastery, team meeting facilitation, executive presentation skills, and change communication strategy.",
    objectives: [
      "Master one-on-one conversation skills",
      "Facilitate engaging and productive team meetings",
      "Deliver compelling executive presentations",
      "Lead organizational change through communication",
      "Integrate all leadership communication skills"
    ],
    duration: "90 minutes",
    difficulty: "advanced",
    concepts: [
      {
        id: "workshop-integration",
        title: "Integrating Leadership Communication Skills",
        description: "Combine all the leadership communication skills learned in previous lessons into a cohesive leadership approach.",
        examples: [
          "Using different communication styles for different situations",
          "Adapting your leadership voice to various contexts",
          "Building communication systems that scale with your organization",
          "Creating feedback loops that improve communication over time"
        ],
        exercises: [
          "Create a personal communication playbook",
          "Practice switching between different communication modes",
          "Build systems for consistent communication across your organization",
          "Develop metrics for measuring communication effectiveness"
        ]
      },
      {
        id: "advanced-facilitation",
        title: "Advanced Facilitation Techniques",
        description: "Master sophisticated facilitation skills that can handle complex group dynamics and challenging conversations.",
        examples: [
          "Managing dominant personalities and ensuring everyone participates",
          "Facilitating difficult conversations about performance and behavior",
          "Leading strategic planning and vision-setting sessions",
          "Navigating conflict and building consensus"
        ],
        exercises: [
          "Practice advanced facilitation techniques like parking lots and decision trees",
          "Learn to read group energy and adjust your approach accordingly",
          "Master the art of asking powerful questions that drive insight",
          "Create safe spaces for difficult conversations"
        ]
      },
      {
        id: "organizational-influence",
        title: "Building Organizational Influence",
        description: "Learn to influence at the organizational level, driving change and building alignment across large groups.",
        examples: [
          "Creating communication strategies for organizational change",
          "Building coalitions and influence networks",
          "Communicating vision and strategy across the organization",
          "Managing resistance and building buy-in"
        ],
        exercises: [
          "Map your influence network and identify key relationships",
          "Practice crafting messages that resonate across different organizational levels",
          "Learn to build consensus among diverse stakeholder groups",
          "Create communication cascades that reach everyone effectively"
        ]
      }
    ],
    scenarios: [
      {
        id: "organizational-change",
        title: "The Major Organizational Change",
        context: "Your company is going through a significant restructuring that will affect every team. You need to communicate the changes while maintaining morale and productivity.",
        challenge: "Lead communication for complex organizational change",
        solution: "Create a comprehensive communication strategy that addresses different stakeholder needs",
        davidInsight: "Organizational change fails when communication fails. You need to over-communicate and address emotions, not just facts."
      },
      {
        id: "cultural-transformation",
        title: "The Culture Transformation",
        context: "Your engineering organization needs to shift from a command-and-control culture to a more collaborative, innovative culture. This requires changing how everyone communicates.",
        challenge: "Use communication to drive cultural change",
        solution: "Model the new behaviors, create new communication norms, and reinforce the change consistently",
        davidInsight: "Culture change is communication change. If you want people to collaborate more, you need to communicate more collaboratively."
      },
      {
        id: "merger-integration",
        title: "The Merger Integration",
        context: "Your company is acquiring another company with a different culture and communication style. You need to integrate the teams while preserving the best of both cultures.",
        challenge: "Communicate across different organizational cultures",
        solution: "Create bridges between cultures, find common ground, and build new shared norms",
        davidInsight: "Mergers are really about merging communication styles. The technical integration is often easier than the cultural integration."
      }
    ],
    practiceActivities: [
      {
        id: "workshop-1-oneOnOne",
        title: "Workshop 1: One-on-One Conversation Mastery",
        type: "practice",
        description: "Master the art of one-on-one conversations that build relationships, drive performance, and develop people.",
        instructions: [
          "Practice different types of one-on-one conversations (coaching, feedback, career development)",
          "Learn to create psychological safety in individual conversations",
          "Master active listening and powerful questioning techniques",
          "Practice having difficult conversations with empathy and clarity"
        ],
        feedback: "One-on-one conversations are the foundation of leadership. Get these right, and everything else becomes easier."
      },
      {
        id: "workshop-2-meetings",
        title: "Workshop 2: Team Meeting Facilitation",
        type: "practice",
        description: "Transform team meetings from time-wasters into powerful tools for alignment, decision-making, and team building.",
        instructions: [
          "Practice different meeting formats and when to use each",
          "Learn to manage group dynamics and ensure everyone participates",
          "Master the art of keeping meetings focused and productive",
          "Create meeting templates and processes that drive results"
        ],
        feedback: "Great meetings energize teams and drive results. Poor meetings drain energy and waste time."
      },
      {
        id: "workshop-3-presentations",
        title: "Workshop 3: Executive Presentation Skills",
        type: "practice",
        description: "Deliver presentations that influence executive decisions and drive organizational action.",
        instructions: [
          "Practice structuring presentations for executive decision-making",
          "Learn to handle challenging questions and pushback",
          "Master the art of storytelling with data and emotion",
          "Create presentations that are memorable and actionable"
        ],
        feedback: "Executive presentations succeed when they make the decision easy and obvious for the audience."
      },
      {
        id: "workshop-4-change",
        title: "Workshop 4: Change Communication Strategy",
        type: "practice",
        description: "Lead organizational change through strategic communication that builds understanding and commitment.",
        instructions: [
          "Practice creating communication strategies for complex change initiatives",
          "Learn to address resistance and build buy-in",
          "Master the art of communicating vision and urgency",
          "Create communication cascades that reach everyone effectively"
        ],
        feedback: "Change communication is about hearts and minds, not just facts and figures. Address emotions first."
      }
    ],
    assessments: [
      {
        id: "assessment-1",
        question: "What's the key to effective one-on-one conversations?",
        type: "multiple-choice",
        options: [
          "Always having an agenda and sticking to it",
          "Doing most of the talking to share your wisdom",
          "Creating psychological safety and asking powerful questions",
          "Focusing only on work-related topics"
        ],
        feedback: "One-on-ones work best when there's psychological safety and the conversation goes where it needs to go."
      },
      {
        id: "assessment-2",
        question: "How would you design a communication strategy for a major organizational change that affects 500+ employees?",
        type: "scenario",
        feedback: "Effective strategies consider different stakeholder needs, multiple communication channels, and feedback loops."
      },
      {
        id: "assessment-3",
        question: "Reflect on your growth as a leadership communicator. What's been your biggest transformation?",
        type: "reflection",
        feedback: "The best leaders are always learning and growing their communication skills. Self-awareness is key."
      }
    ]
  }
];