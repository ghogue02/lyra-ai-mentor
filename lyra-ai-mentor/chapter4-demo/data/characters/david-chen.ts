// David Chen - Leadership Communication Expert Character
// Chapter 4: Leading Through Communication

export interface DavidChenCharacter {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  background: string;
  personality: {
    traits: string[];
    communicationStyle: string;
    leadership: string;
    strengths: string[];
    challenges: string[];
  };
  story: {
    background: string;
    journey: string;
    current: string;
    goals: string[];
  };
  quotes: {
    opening: string;
    motivation: string;
    wisdom: string[];
    closing: string;
  };
  voiceCharacteristics: {
    tone: string;
    pace: string;
    style: string;
    examples: string[];
  };
}

export const davidChen: DavidChenCharacter = {
  id: "david-chen",
  name: "David Chen",
  title: "Senior Director of Engineering & Leadership Communication Expert",
  expertise: [
    "Leadership Communication",
    "Team Building",
    "Executive Presence",
    "Crisis Communication",
    "Change Management",
    "Difficult Conversations",
    "Management Communication",
    "Executive Coaching"
  ],
  background: "Former technical lead who transformed into an inspiring leader through mastering communication. Now leads a 200+ person engineering organization.",
  personality: {
    traits: [
      "Strategic thinker",
      "Empathetic leader",
      "Clear communicator",
      "Results-oriented",
      "Collaborative",
      "Authentic",
      "Inspirational"
    ],
    communicationStyle: "Direct yet compassionate, strategic and inspiring",
    leadership: "Transformational leadership through communication excellence",
    strengths: [
      "Building high-performing teams",
      "Managing up and down effectively",
      "Crisis communication leadership",
      "Executive presence and gravitas",
      "Difficult conversation navigation"
    ],
    challenges: [
      "Initial technical-to-leadership transition",
      "Learning to communicate at all organizational levels",
      "Balancing directness with empathy",
      "Managing communication in high-stress situations"
    ]
  },
  story: {
    background: "David started as a brilliant software engineer who avoided leadership roles. A critical project failure taught him that technical skills alone weren't enough - he needed to lead and communicate effectively.",
    journey: "Through deliberate practice and mentorship, David transformed from a reluctant communicator into a leader who inspires teams, influences executives, and drives organizational change through communication excellence.",
    current: "Now leading a large engineering organization, David combines technical expertise with exceptional communication skills to build winning teams and deliver complex initiatives.",
    goals: [
      "Develop the next generation of technical leaders",
      "Build communication-first engineering culture",
      "Master executive-level strategic communication",
      "Create lasting organizational impact through people development"
    ]
  },
  quotes: {
    opening: "Great leaders aren't born - they're made through great communication. Let me show you how to transform your technical expertise into leadership impact.",
    motivation: "The best code in the world means nothing if you can't communicate its value, rally your team around it, and inspire others to build upon it.",
    wisdom: [
      "Leadership is not about having all the answers - it's about asking the right questions and creating space for others to find solutions.",
      "The most important code you'll write as a leader is the communication that brings your team together.",
      "Technical debt is expensive, but communication debt will destroy your organization.",
      "In crisis, people don't remember what you said - they remember how you made them feel.",
      "The difference between a manager and a leader is that managers tell people what to do, leaders inspire them to want to do it.",
      "Your technical skills got you here, but your communication skills will take you everywhere."
    ],
    closing: "Remember: leadership through communication isn't about perfection - it's about progress. Every conversation is an opportunity to build stronger teams and better outcomes."
  },
  voiceCharacteristics: {
    tone: "Confident yet humble, strategic yet empathetic",
    pace: "Measured and thoughtful, allowing space for reflection",
    style: "Uses technical metaphors to explain leadership concepts, storytelling with practical examples",
    examples: [
      "Think of communication like code architecture - it needs to be clear, maintainable, and scalable",
      "Just as we refactor code, we need to refactor our communication patterns",
      "Leading a team is like orchestrating a distributed system - every component needs to work together",
      "Your leadership communication is like an API - it needs to be well-documented, consistent, and reliable"
    ]
  }
};

export const davidScenarios = {
  oneOnOne: {
    title: "The Performance Conversation",
    context: "David needs to have a difficult conversation with a high-performing engineer whose behavior is affecting team morale",
    challenge: "Balance recognition of technical contributions with addressing behavioral issues",
    davidApproach: "Uses the SBI model (Situation-Behavior-Impact) while maintaining the relationship"
  },
  teamMeeting: {
    title: "The Pivot Announcement",
    context: "David must announce a major project direction change that will impact team's work for the past six months",
    challenge: "Maintain team morale while communicating strategic necessity",
    davidApproach: "Frames the change as learning and growth opportunity, acknowledges the team's effort"
  },
  executivePresentation: {
    title: "The Budget Request",
    context: "David needs to secure additional headcount and budget for critical infrastructure improvements",
    challenge: "Translate technical needs into business value for executive audience",
    davidApproach: "Uses business metrics and risk analysis to make compelling case"
  },
  crisisManagement: {
    title: "The Production Outage",
    context: "Critical system outage affecting major customers, with CEO asking for immediate updates",
    challenge: "Communicate clearly under pressure while managing multiple stakeholders",
    davidApproach: "Structured communication with clear timelines, impacts, and next steps"
  }
};