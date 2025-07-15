// PACE System Integration for Leadership Communication
// Adapted for Chapter 4 David Chen's Leadership Context

export interface LeadershipPACEConfig {
  id: string;
  title: string;
  description: string;
  context: 'leadership' | 'team' | 'executive' | 'crisis';
  phases: {
    prepare: LeadershipPreparePhase;
    assess: LeadershipAssessPhase;
    communicate: LeadershipCommunicatePhase;
    evaluate: LeadershipEvaluatePhase;
  };
  adaptations: {
    audienceLevel: 'team' | 'peer' | 'executive' | 'board';
    communicationStyle: 'directive' | 'collaborative' | 'coaching' | 'inspiring';
    urgency: 'low' | 'medium' | 'high' | 'crisis';
    complexity: 'simple' | 'moderate' | 'complex' | 'transformational';
  };
}

export interface LeadershipPreparePhase {
  title: string;
  description: string;
  activities: {
    stakeholderMapping: {
      description: string;
      tools: string[];
      davidGuidance: string;
    };
    messageFraming: {
      description: string;
      frameworks: string[];
      davidGuidance: string;
    };
    contextAnalysis: {
      description: string;
      considerations: string[];
      davidGuidance: string;
    };
    outcomeDefinition: {
      description: string;
      criteria: string[];
      davidGuidance: string;
    };
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface LeadershipAssessPhase {
  title: string;
  description: string;
  activities: {
    audienceReadiness: {
      description: string;
      indicators: string[];
      davidGuidance: string;
    };
    environmentalFactors: {
      description: string;
      factors: string[];
      davidGuidance: string;
    };
    riskAssessment: {
      description: string;
      risks: string[];
      davidGuidance: string;
    };
    opportunityIdentification: {
      description: string;
      opportunities: string[];
      davidGuidance: string;
    };
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface LeadershipCommunicatePhase {
  title: string;
  description: string;
  activities: {
    openingImpact: {
      description: string;
      techniques: string[];
      davidGuidance: string;
    };
    coreMessageDelivery: {
      description: string;
      structures: string[];
      davidGuidance: string;
    };
    engagementTechniques: {
      description: string;
      methods: string[];
      davidGuidance: string;
    };
    closingCommitment: {
      description: string;
      approaches: string[];
      davidGuidance: string;
    };
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export interface LeadershipEvaluatePhase {
  title: string;
  description: string;
  activities: {
    impactMeasurement: {
      description: string;
      metrics: string[];
      davidGuidance: string;
    };
    feedbackCollection: {
      description: string;
      sources: string[];
      davidGuidance: string;
    };
    behaviorChange: {
      description: string;
      indicators: string[];
      davidGuidance: string;
    };
    continuousImprovement: {
      description: string;
      processes: string[];
      davidGuidance: string;
    };
  };
  checkpoints: string[];
  timeEstimate: string;
  davidInsights: string[];
}

export const leadershipPACEConfigs: LeadershipPACEConfig[] = [
  {
    id: "team-leadership-pace",
    title: "Team Leadership Communication PACE",
    description: "PACE system adapted for leading and communicating with your direct team",
    context: "team",
    phases: {
      prepare: {
        title: "Prepare: Strategic Team Communication Planning",
        description: "Prepare for effective team communication by understanding your team's needs, context, and the outcomes you want to achieve.",
        activities: {
          stakeholderMapping: {
            description: "Map your team members and their communication preferences, motivations, and concerns",
            tools: ["Team assessment matrix", "Communication preference survey", "Stakeholder influence map"],
            davidGuidance: "Each team member is unique. Understanding their communication style, motivations, and current state is crucial for effective leadership communication."
          },
          messageFraming: {
            description: "Frame your message in a way that resonates with your team's values and goals",
            frameworks: ["WIIFM (What's In It For Me)", "Simon Sinek's Golden Circle", "Before-After-Bridge"],
            davidGuidance: "The best team communication connects individual goals to team goals. Help each person see how the message relates to their success."
          },
          contextAnalysis: {
            description: "Analyze the current team context, including morale, workload, recent events, and dynamics",
            considerations: ["Team morale and energy", "Recent successes and failures", "Current workload and stress", "Interpersonal dynamics"],
            davidGuidance: "Context is everything in team communication. The same message can land completely differently based on what's happening in the team."
          },
          outcomeDefinition: {
            description: "Define specific, measurable outcomes you want from the communication",
            criteria: ["Behavior change expected", "Decisions to be made", "Alignment to be achieved", "Energy and motivation impact"],
            davidGuidance: "Be clear about what success looks like. Are you informing, persuading, aligning, or inspiring? Each requires different preparation."
          }
        },
        checkpoints: [
          "Team member communication preferences documented",
          "Message framed for team context and values",
          "Current team context and dynamics assessed",
          "Specific communication outcomes defined"
        ],
        timeEstimate: "15-30 minutes",
        davidInsights: [
          "The preparation phase is where leadership communication wins or loses. Invest the time upfront.",
          "Your team will sense if you're unprepared. Preparation demonstrates respect for their time and attention.",
          "The best team leaders are also the best team communicators. They make preparation a habit."
        ]
      },
      assess: {
        title: "Assess: Team Readiness and Context",
        description: "Assess your team's readiness to receive and act on your communication",
        activities: {
          audienceReadiness: {
            description: "Evaluate your team's readiness to receive and engage with your message",
            indicators: ["Attention and engagement levels", "Openness to feedback", "Current stress and workload", "Previous communication effectiveness"],
            davidGuidance: "Timing is crucial in team communication. If the team isn't ready, even the best message will fail."
          },
          environmentalFactors: {
            description: "Assess the environment and context that might affect your communication",
            factors: ["Meeting format and setting", "Time constraints", "Competing priorities", "Recent organizational changes"],
            davidGuidance: "The environment shapes the message. Choose your communication channel, timing, and setting deliberately."
          },
          riskAssessment: {
            description: "Identify potential risks and challenges that could derail your communication",
            risks: ["Misunderstandings", "Emotional reactions", "Resistance to change", "Information overload"],
            davidGuidance: "Great leaders anticipate problems. Think through what could go wrong and have contingency plans."
          },
          opportunityIdentification: {
            description: "Identify opportunities to enhance your communication impact",
            opportunities: ["Teaching moments", "Team building opportunities", "Innovation catalyst", "Trust building"],
            davidGuidance: "Every communication is an opportunity to strengthen relationships and build team capability."
          }
        },
        checkpoints: [
          "Team readiness and engagement assessed",
          "Environmental factors and constraints identified",
          "Potential risks and mitigation strategies defined",
          "Opportunities for enhanced impact identified"
        ],
        timeEstimate: "5-15 minutes",
        davidInsights: [
          "Assessment is about reading the room before you enter it. It's a skill that improves with practice.",
          "The best leaders are also the best observers. They notice what others miss.",
          "When you assess well, you can adapt your communication in real-time for maximum impact."
        ]
      },
      communicate: {
        title: "Communicate: Engage and Inspire Your Team",
        description: "Deliver your message in a way that engages, inspires, and drives action",
        activities: {
          openingImpact: {
            description: "Start with impact - grab attention and set the tone for the conversation",
            techniques: ["Personal story or example", "Thought-provoking question", "Surprising statistic or fact", "Vision of the future"],
            davidGuidance: "The first 30 seconds determine whether people will really listen. Make them count."
          },
          coreMessageDelivery: {
            description: "Deliver your core message clearly and memorably",
            structures: ["Problem-Solution-Benefit", "Situation-Action-Result", "Past-Present-Future", "Challenge-Response-Outcome"],
            davidGuidance: "Clarity is kindness. Make your message so clear that it's impossible to misunderstand."
          },
          engagementTechniques: {
            description: "Keep your team engaged throughout the communication",
            methods: ["Interactive discussion", "Real-world examples", "Analogies and metaphors", "Emotional connection"],
            davidGuidance: "Engagement is not about entertainment - it's about connection. Connect with both hearts and minds."
          },
          closingCommitment: {
            description: "End with clear next steps and commitment",
            approaches: ["Specific action items", "Mutual commitments", "Timeline and accountability", "Follow-up plan"],
            davidGuidance: "Strong closings create momentum. People should leave knowing exactly what they need to do."
          }
        },
        checkpoints: [
          "Opening captured attention and set clear expectations",
          "Core message delivered with clarity and impact",
          "Team remained engaged throughout the communication",
          "Closing secured commitment and clear next steps"
        ],
        timeEstimate: "Variable based on format",
        davidInsights: [
          "Communication is performance. Bring your energy and authenticity to every interaction.",
          "The best communicators are also the best listeners. Make space for team input and questions.",
          "Your team mirrors your energy. If you're passionate and committed, they will be too."
        ]
      },
      evaluate: {
        title: "Evaluate: Measure Impact and Improve",
        description: "Evaluate the effectiveness of your communication and make improvements",
        activities: {
          impactMeasurement: {
            description: "Measure the impact of your communication on team behavior and outcomes",
            metrics: ["Behavior change indicators", "Goal achievement", "Engagement levels", "Quality of questions and feedback"],
            davidGuidance: "You can't improve what you don't measure. Track both immediate and long-term impact."
          },
          feedbackCollection: {
            description: "Gather feedback from your team about communication effectiveness",
            sources: ["Direct feedback", "Anonymous surveys", "Observation of behavior", "Peer feedback"],
            davidGuidance: "The best feedback comes from honest, ongoing dialogue. Create safe spaces for team members to share."
          },
          behaviorChange: {
            description: "Assess whether your communication drove the desired behavior changes",
            indicators: ["Action item completion", "Changed processes or practices", "Improved team dynamics", "Increased initiative"],
            davidGuidance: "Behavior change is the ultimate measure of communication effectiveness. Watch what people do, not just what they say."
          },
          continuousImprovement: {
            description: "Use insights to improve future team communication",
            processes: ["Reflection and analysis", "Skill development", "Process refinement", "Relationship building"],
            davidGuidance: "Great leaders are always learning. Each communication is a chance to get better."
          }
        },
        checkpoints: [
          "Communication impact measured against defined outcomes",
          "Team feedback collected and analyzed",
          "Behavior change indicators assessed",
          "Insights captured for continuous improvement"
        ],
        timeEstimate: "10-20 minutes",
        davidInsights: [
          "Evaluation is where good leaders become great leaders. It's the difference between experience and learning.",
          "The best team leaders create feedback loops that make everyone better communicators.",
          "Continuous improvement in communication pays dividends across all aspects of leadership."
        ]
      }
    },
    adaptations: {
      audienceLevel: "team",
      communicationStyle: "collaborative",
      urgency: "medium",
      complexity: "moderate"
    }
  },
  {
    id: "executive-leadership-pace",
    title: "Executive Leadership Communication PACE",
    description: "PACE system adapted for communicating with executives and senior leadership",
    context: "executive",
    phases: {
      prepare: {
        title: "Prepare: Executive Communication Strategy",
        description: "Prepare for high-stakes executive communication that influences strategic decisions",
        activities: {
          stakeholderMapping: {
            description: "Map executive stakeholders, their priorities, concerns, and decision-making styles",
            tools: ["Executive influence map", "Priority assessment matrix", "Decision-making style analysis"],
            davidGuidance: "Executives are busy and focused on results. Understand what they care about most and how they make decisions."
          },
          messageFraming: {
            description: "Frame your message in terms of business impact, strategic alignment, and executive priorities",
            frameworks: ["Business case structure", "Strategic alignment model", "Risk-opportunity matrix"],
            davidGuidance: "Lead with business impact. Executives want to know the so what and what's next before they care about the how."
          },
          contextAnalysis: {
            description: "Analyze the business context, competitive landscape, and organizational priorities",
            considerations: ["Current business priorities", "Competitive pressures", "Market conditions", "Organizational changes"],
            davidGuidance: "Executive communication must be grounded in business reality. Show you understand the bigger picture."
          },
          outcomeDefinition: {
            description: "Define specific decisions, approvals, or strategic alignment you need from executives",
            criteria: ["Specific decisions required", "Resource approvals needed", "Strategic alignment sought", "Timeline for action"],
            davidGuidance: "Be crystal clear about what you need from executives. Ambiguity kills executive communication."
          }
        },
        checkpoints: [
          "Executive stakeholder priorities and styles mapped",
          "Message framed for maximum business impact",
          "Business context and competitive landscape analyzed",
          "Specific executive outcomes and decisions defined"
        ],
        timeEstimate: "30-60 minutes",
        davidInsights: [
          "Executive communication requires more preparation, not less. The stakes are too high to wing it.",
          "The best executive communicators think like executives. They understand the business, not just the technology.",
          "Preparation for executive communication is an investment in your leadership credibility."
        ]
      },
      assess: {
        title: "Assess: Executive Readiness and Business Context",
        description: "Assess executive readiness and the business context for your communication",
        activities: {
          audienceReadiness: {
            description: "Evaluate executive attention, priorities, and receptiveness to your message",
            indicators: ["Executive calendar and priorities", "Recent business performance", "Strategic initiatives in flight", "Stakeholder relationships"],
            davidGuidance: "Executives have limited attention. Make sure they can focus on your message when you deliver it."
          },
          environmentalFactors: {
            description: "Assess the business environment and organizational context",
            factors: ["Market conditions", "Competitive pressures", "Organizational changes", "Resource constraints"],
            davidGuidance: "The business environment shapes executive priorities. Align your message with current realities."
          },
          riskAssessment: {
            description: "Identify risks that could undermine your executive communication",
            risks: ["Competing priorities", "Resource constraints", "Political dynamics", "Timing issues"],
            davidGuidance: "Executive communication can be derailed by organizational politics and competing priorities. Plan accordingly."
          },
          opportunityIdentification: {
            description: "Identify opportunities to enhance your impact and build executive relationships",
            opportunities: ["Strategic alignment", "Problem-solving", "Innovation catalyst", "Leadership development"],
            davidGuidance: "Every executive interaction is a chance to build your reputation and influence. Look for ways to add value."
          }
        },
        checkpoints: [
          "Executive attention and priorities assessed",
          "Business environment and context analyzed",
          "Political and competitive risks identified",
          "Opportunities for enhanced impact and relationship building identified"
        ],
        timeEstimate: "15-30 minutes",
        davidInsights: [
          "Executive assessment is about reading the business environment, not just the room.",
          "The best executive communicators are also the best business observers. They see patterns others miss.",
          "When you assess the executive context well, you can position your message for maximum impact."
        ]
      },
      communicate: {
        title: "Communicate: Executive Presence and Influence",
        description: "Deliver your message with executive presence and strategic influence",
        activities: {
          openingImpact: {
            description: "Start with strategic impact - the business case, the problem, or the opportunity",
            techniques: ["Bottom-line impact", "Strategic opportunity", "Competitive threat", "Market reality"],
            davidGuidance: "Executives want to know the bottom line first. Lead with impact, not background."
          },
          coreMessageDelivery: {
            description: "Deliver your core message with clarity, confidence, and strategic context",
            structures: ["Pyramid Principle", "SCQA (Situation-Complication-Question-Answer)", "Options-Recommendation-Next Steps"],
            davidGuidance: "Executive communication is about making their decisions easier. Present options, recommend a path, and show next steps."
          },
          engagementTechniques: {
            description: "Engage executives through strategic discussion and decision-making",
            methods: ["Strategic questions", "Scenario planning", "Decision frameworks", "Data-driven insights"],
            davidGuidance: "Executives engage when they can contribute their strategic thinking. Create opportunities for them to add value."
          },
          closingCommitment: {
            description: "End with clear decisions, commitments, and next steps",
            approaches: ["Decision summary", "Resource commitments", "Timeline and milestones", "Accountability structure"],
            davidGuidance: "Executive meetings should end with decisions and commitments. Be clear about who will do what by when."
          }
        },
        checkpoints: [
          "Opening established strategic importance and urgency",
          "Core message delivered with executive presence and clarity",
          "Executives engaged in strategic discussion and decision-making",
          "Closing secured clear decisions and commitments"
        ],
        timeEstimate: "Variable based on format",
        davidInsights: [
          "Executive communication is about presence, not just content. Project confidence and strategic thinking.",
          "The best executive communicators are also the best strategic thinkers. They see the big picture.",
          "Your executive communication reflects your leadership potential. Make every interaction count."
        ]
      },
      evaluate: {
        title: "Evaluate: Strategic Impact and Relationship Building",
        description: "Evaluate the strategic impact of your executive communication and build on relationships",
        activities: {
          impactMeasurement: {
            description: "Measure the strategic impact of your executive communication",
            metrics: ["Decisions made", "Resources allocated", "Strategic alignment achieved", "Relationship strength"],
            davidGuidance: "Executive communication success is measured by business impact. Track decisions, resources, and strategic alignment."
          },
          feedbackCollection: {
            description: "Gather feedback from executives and their teams about communication effectiveness",
            sources: ["Direct executive feedback", "Chief of staff insights", "Peer observation", "Business results"],
            davidGuidance: "Executive feedback is often indirect. Pay attention to actions, resource allocation, and follow-up meetings."
          },
          behaviorChange: {
            description: "Assess whether your communication influenced executive behavior and decisions",
            indicators: ["Strategy changes", "Resource allocation shifts", "Priority adjustments", "Organizational changes"],
            davidGuidance: "Executive behavior change shows up in strategy, resources, and organizational priorities. Look for these indicators."
          },
          continuousImprovement: {
            description: "Use insights to improve future executive communication and relationships",
            processes: ["Executive coaching", "Presentation skills development", "Strategic thinking enhancement", "Relationship building"],
            davidGuidance: "Executive communication skills are developed over time. Invest in coaching and continuous improvement."
          }
        },
        checkpoints: [
          "Strategic impact measured against business outcomes",
          "Executive feedback collected and analyzed",
          "Influence on executive behavior and decisions assessed",
          "Insights captured for continuous improvement and relationship building"
        ],
        timeEstimate: "20-30 minutes",
        davidInsights: [
          "Executive communication evaluation is about strategic impact, not just communication effectiveness.",
          "The best executive communicators build long-term relationships that compound over time.",
          "Your reputation as an executive communicator affects your career trajectory. Invest in getting better."
        ]
      }
    },
    adaptations: {
      audienceLevel: "executive",
      communicationStyle: "directive",
      urgency: "high",
      complexity: "complex"
    }
  },
  {
    id: "crisis-leadership-pace",
    title: "Crisis Leadership Communication PACE",
    description: "PACE system adapted for crisis communication and high-pressure leadership situations",
    context: "crisis",
    phases: {
      prepare: {
        title: "Prepare: Crisis Communication Response",
        description: "Rapidly prepare for crisis communication that maintains confidence and drives coordinated response",
        activities: {
          stakeholderMapping: {
            description: "Quickly map all stakeholders who need crisis communication and their information needs",
            tools: ["Crisis stakeholder matrix", "Communication priority matrix", "Escalation contact lists"],
            davidGuidance: "In crisis, stakeholder mapping is about triage. Who needs what information when? Prioritize ruthlessly."
          },
          messageFraming: {
            description: "Frame crisis messages to maintain confidence while being transparent about challenges",
            frameworks: ["Crisis communication template", "Transparency-confidence balance", "Action-oriented messaging"],
            davidGuidance: "Crisis communication balances transparency with confidence. People need to know what's happening and what you're doing about it."
          },
          contextAnalysis: {
            description: "Rapidly assess the crisis context, impact, and response requirements",
            considerations: ["Crisis severity and scope", "Stakeholder impact", "Response capabilities", "Timeline pressures"],
            davidGuidance: "Crisis context changes rapidly. What you know now may be different in 30 minutes. Build in flexibility."
          },
          outcomeDefinition: {
            description: "Define immediate communication outcomes needed to manage the crisis",
            criteria: ["Stakeholder confidence maintained", "Coordinated response achieved", "Accurate information shared", "Panic prevented"],
            davidGuidance: "Crisis communication outcomes are about maintaining confidence and coordinating response. Everything else is secondary."
          }
        },
        checkpoints: [
          "Crisis stakeholders and information needs identified",
          "Crisis message framed for transparency and confidence",
          "Crisis context and impact rapidly assessed",
          "Immediate communication outcomes defined"
        ],
        timeEstimate: "5-15 minutes",
        davidInsights: [
          "Crisis preparation is about speed and accuracy. You don't have time for perfection.",
          "The best crisis communicators have practiced and prepared frameworks. They don't start from scratch.",
          "In crisis, your preparation shows up as calm confidence under pressure."
        ]
      },
      assess: {
        title: "Assess: Crisis Impact and Response Capability",
        description: "Rapidly assess the crisis situation and your team's response capability",
        activities: {
          audienceReadiness: {
            description: "Assess stakeholder emotional state and information needs during crisis",
            indicators: ["Stress and anxiety levels", "Information hunger", "Rumor and speculation", "Confidence in leadership"],
            davidGuidance: "Crisis assessment is about emotional state, not just information needs. People are stressed and need reassurance."
          },
          environmentalFactors: {
            description: "Assess the crisis environment and constraints on communication",
            factors: ["Information accuracy and completeness", "Time pressures", "Communication channels available", "External pressures"],
            davidGuidance: "Crisis environments are chaotic and information is incomplete. Communicate what you know and when you'll know more."
          },
          riskAssessment: {
            description: "Identify risks that could make the crisis communication worse",
            risks: ["Misinformation spread", "Panic and overreaction", "Stakeholder confidence loss", "Response coordination failure"],
            davidGuidance: "Crisis communication risks are about making a bad situation worse. Be especially careful about accuracy and tone."
          },
          opportunityIdentification: {
            description: "Identify opportunities to strengthen leadership and team cohesion through crisis communication",
            opportunities: ["Leadership demonstration", "Team building under pressure", "Stakeholder trust building", "Process improvement"],
            davidGuidance: "Crisis communication, done well, can actually strengthen relationships and build confidence in leadership."
          }
        },
        checkpoints: [
          "Stakeholder emotional state and information needs assessed",
          "Crisis environment and communication constraints identified",
          "Risk of communication making crisis worse evaluated",
          "Opportunities to strengthen leadership through crisis identified"
        ],
        timeEstimate: "3-10 minutes",
        davidInsights: [
          "Crisis assessment is about reading both the situation and the people. Both are critical.",
          "The best crisis leaders assess quickly and adjust as new information emerges.",
          "Your assessment skills in crisis will determine your effectiveness as a leader."
        ]
      },
      communicate: {
        title: "Communicate: Crisis Leadership and Coordination",
        description: "Deliver crisis communication that maintains confidence and drives coordinated response",
        activities: {
          openingImpact: {
            description: "Start with clear, calm acknowledgment of the crisis and your response",
            techniques: ["Situation acknowledgment", "Response summary", "Confidence projection", "Timeline commitment"],
            davidGuidance: "Crisis communication opens with acknowledgment and action. People need to know you understand and are responding."
          },
          coreMessageDelivery: {
            description: "Deliver core crisis information with clarity and confidence",
            structures: ["What-When-Why-What Next", "Situation-Action-Timeline", "Problem-Response-Support"],
            davidGuidance: "Crisis communication is about facts and actions. Be clear about what you know, what you're doing, and what happens next."
          },
          engagementTechniques: {
            description: "Engage stakeholders in crisis response and maintain their confidence",
            methods: ["Q&A sessions", "Regular updates", "Direct support", "Coordination activities"],
            davidGuidance: "Crisis engagement is about involvement and support. Give people ways to help and stay informed."
          },
          closingCommitment: {
            description: "End with clear next steps, timeline, and commitment to updates",
            approaches: ["Next update commitment", "Action item assignment", "Support availability", "Confidence reinforcement"],
            davidGuidance: "Crisis communication closes with commitment and support. People need to know what happens next and how to get help."
          }
        },
        checkpoints: [
          "Crisis situation acknowledged clearly and calmly",
          "Core information delivered with accuracy and confidence",
          "Stakeholders engaged in response and given support",
          "Next steps and update commitments clearly communicated"
        ],
        timeEstimate: "Variable based on crisis",
        davidInsights: [
          "Crisis communication is about projecting calm confidence even when you don't feel it.",
          "The best crisis communicators are also the best crisis leaders. They inspire confidence through communication.",
          "Your crisis communication will be remembered long after the crisis is over."
        ]
      },
      evaluate: {
        title: "Evaluate: Crisis Response and Recovery",
        description: "Evaluate crisis communication effectiveness and learn for future crisis leadership",
        activities: {
          impactMeasurement: {
            description: "Measure the impact of crisis communication on stakeholder confidence and response coordination",
            metrics: ["Stakeholder confidence levels", "Response coordination effectiveness", "Information accuracy", "Panic prevention"],
            davidGuidance: "Crisis communication success is measured by stakeholder confidence and response effectiveness."
          },
          feedbackCollection: {
            description: "Gather feedback about crisis communication effectiveness from all stakeholders",
            sources: ["Direct stakeholder feedback", "Team response assessment", "External observer input", "Media coverage analysis"],
            davidGuidance: "Crisis communication feedback comes from multiple sources. Pay attention to what people say and do."
          },
          behaviorChange: {
            description: "Assess whether crisis communication drove the coordinated response needed",
            indicators: ["Team coordination improvement", "Stakeholder support actions", "Reduced panic and speculation", "Improved information sharing"],
            davidGuidance: "Crisis communication behavior change shows up in coordination, support, and reduced panic."
          },
          continuousImprovement: {
            description: "Use crisis communication lessons to improve future crisis leadership",
            processes: ["Crisis communication debrief", "Process improvement", "Skill development", "Preparation enhancement"],
            davidGuidance: "Every crisis is a learning opportunity. Capture lessons and improve your crisis communication capability."
          }
        },
        checkpoints: [
          "Crisis communication impact on confidence and coordination measured",
          "Stakeholder feedback about crisis communication collected",
          "Behavior change and response coordination assessed",
          "Lessons learned captured for future crisis leadership improvement"
        ],
        timeEstimate: "15-30 minutes",
        davidInsights: [
          "Crisis communication evaluation is about learning and improving for the next crisis.",
          "The best crisis leaders use each crisis to build better crisis communication capabilities.",
          "Your crisis communication skills will define your reputation as a leader under pressure."
        ]
      }
    },
    adaptations: {
      audienceLevel: "team",
      communicationStyle: "directive",
      urgency: "crisis",
      complexity: "complex"
    }
  }
];

export default leadershipPACEConfigs;