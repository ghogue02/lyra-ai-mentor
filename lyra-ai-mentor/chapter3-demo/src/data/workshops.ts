import { SofiaWorkshop } from '../types/sofia';
import { voiceExercises, presentationScenarios } from './voice-exercises';

export const sofiaWorkshops: SofiaWorkshop[] = [
  {
    id: "vocal-technique-mastery",
    title: "Vocal Technique Mastery",
    focus_area: "Advanced vocal skills and voice control",
    duration: 120,
    skill_level: "advanced",
    learning_objectives: [
      "Master advanced breathing techniques for sustained speaking",
      "Develop precise pitch and tone control",
      "Learn vocal recovery and maintenance techniques",
      "Build stamina for long presentations",
      "Eliminate vocal strain and tension"
    ],
    modules: [
      {
        id: "breathing-mastery",
        title: "Advanced Breathing Techniques",
        content: "Master the breath support that professional speakers use for hours of speaking without fatigue.",
        exercises: [
          voiceExercises.find(e => e.id === "breathing-foundation")!,
          voiceExercises.find(e => e.id === "resonance-building")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "conference-keynote")!
        ]
      },
      {
        id: "voice-control",
        title: "Pitch and Tone Mastery",
        content: "Develop the ability to use your voice as a dynamic instrument that enhances your message.",
        exercises: [
          voiceExercises.find(e => e.id === "vocal-warm-up-basic")!,
          voiceExercises.find(e => e.id === "articulation-drill")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "boardroom-presentation")!
        ]
      },
      {
        id: "vocal-health",
        title: "Vocal Health and Recovery",
        content: "Learn how to maintain your voice health and recover quickly from vocal strain.",
        exercises: [
          voiceExercises.find(e => e.id === "vocal-warm-up-basic")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "team-meeting")!
        ]
      }
    ],
    sofia_coaching_tips: [
      "Your voice is your instrument - treat it with the respect it deserves",
      "Professional speakers know that vocal technique is what separates good from great",
      "I used to lose my voice after every presentation. These techniques changed everything for me",
      "The audience can hear confidence in your voice before you even say your first word"
    ]
  },
  {
    id: "slide-design-workshop",
    title: "Slide Design Workshop",
    focus_area: "Creating visually compelling presentations that support your speech",
    duration: 90,
    skill_level: "intermediate",
    learning_objectives: [
      "Master visual hierarchy and design principles",
      "Create slides that enhance rather than distract from your message",
      "Learn to use color, typography, and imagery effectively",
      "Develop templates that support your speaking style",
      "Handle technical difficulties with confidence"
    ],
    modules: [
      {
        id: "design-principles",
        title: "Visual Design Fundamentals",
        content: "Learn the core principles that make slides both beautiful and functional for speakers.",
        exercises: [
          voiceExercises.find(e => e.id === "projection-practice")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "team-meeting")!
        ]
      },
      {
        id: "storytelling-slides",
        title: "Slides That Tell Stories",
        content: "Create slide sequences that support narrative flow and help you remember your key points.",
        exercises: [
          voiceExercises.find(e => e.id === "articulation-drill")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "conference-keynote")!
        ]
      },
      {
        id: "technical-mastery",
        title: "Technical Confidence",
        content: "Master the technical aspects of presentations and prepare for when things go wrong.",
        exercises: [
          voiceExercises.find(e => e.id === "breathing-foundation")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "boardroom-presentation")!
        ]
      }
    ],
    sofia_coaching_tips: [
      "Your slides should be your speaking partner, not your crutch",
      "Great design isn't about making things pretty - it's about making them clear",
      "I learned that simple slides give me more confidence because there's less to go wrong",
      "The best slides make the audience focus on you, not the screen"
    ]
  },
  {
    id: "qa-handling-guide",
    title: "Q&A Handling Guide",
    focus_area: "Mastering question and answer sessions with confidence",
    duration: 75,
    skill_level: "intermediate",
    learning_objectives: [
      "Handle difficult questions with poise and professionalism",
      "Turn hostile questions into opportunities to build trust",
      "Manage time effectively during Q&A sessions",
      "Admit knowledge gaps gracefully and professionally",
      "Create engaging Q&A experiences that serve your audience"
    ],
    modules: [
      {
        id: "question-types",
        title: "Understanding Question Types",
        content: "Learn to quickly identify and categorize different types of questions to respond appropriately.",
        exercises: [
          voiceExercises.find(e => e.id === "breathing-foundation")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "boardroom-presentation")!
        ]
      },
      {
        id: "difficult-questions",
        title: "Handling Difficult Questions",
        content: "Master techniques for responding to challenging, hostile, or off-topic questions.",
        exercises: [
          voiceExercises.find(e => e.id === "projection-practice")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "conference-keynote")!
        ]
      },
      {
        id: "qa-facilitation",
        title: "Q&A Facilitation",
        content: "Learn to create engaging Q&A sessions that serve your audience and enhance your credibility.",
        exercises: [
          voiceExercises.find(e => e.id === "articulation-drill")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "team-meeting")!
        ]
      }
    ],
    sofia_coaching_tips: [
      "Q&A sessions are where you really build trust with your audience",
      "The phrase 'I don't know, but I'll find out' is incredibly powerful",
      "I used to dread questions - now they're my favorite part of any presentation",
      "Your response to difficult questions shows more about your character than your prepared content"
    ]
  },
  {
    id: "stage-presence-training",
    title: "Stage Presence Training",
    focus_area: "Developing commanding physical presence and stage confidence",
    duration: 100,
    skill_level: "advanced",
    learning_objectives: [
      "Master purposeful movement and gesture",
      "Develop authentic stage presence that matches your personality",
      "Use physical space effectively in different venues",
      "Build confidence for large audience presentations",
      "Recover gracefully from physical mistakes or equipment failures"
    ],
    modules: [
      {
        id: "physical-presence",
        title: "Commanding Physical Presence",
        content: "Learn to use your body language, posture, and movement to enhance your message.",
        exercises: [
          voiceExercises.find(e => e.id === "projection-practice")!,
          voiceExercises.find(e => e.id === "resonance-building")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "conference-keynote")!
        ]
      },
      {
        id: "space-management",
        title: "Stage and Space Management",
        content: "Master the art of using different spaces effectively, from small meeting rooms to large stages.",
        exercises: [
          voiceExercises.find(e => e.id === "vocal-warm-up-basic")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "boardroom-presentation")!
        ]
      },
      {
        id: "authentic-presence",
        title: "Authentic Stage Presence",
        content: "Develop a stage presence that feels natural and authentic to who you are.",
        exercises: [
          voiceExercises.find(e => e.id === "breathing-foundation")!
        ],
        practice_scenarios: [
          presentationScenarios.find(s => s.id === "team-meeting")!
        ]
      }
    ],
    sofia_coaching_tips: [
      "Stage presence isn't about being someone you're not - it's about being the best version of yourself",
      "Your physical presence starts the moment you walk into the room",
      "I learned that confident speakers own their space without dominating it",
      "The stage is your home for those minutes - make your audience feel welcome there"
    ]
  }
];