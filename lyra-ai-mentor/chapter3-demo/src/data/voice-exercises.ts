import { VoiceExercise } from '../types/sofia';

export const voiceExercises: VoiceExercise[] = [
  {
    id: "breathing-foundation",
    name: "Diaphragmatic Breathing",
    type: "breathing",
    duration: 5,
    difficulty: "beginner",
    instructions: [
      "Place one hand on your chest and one on your belly",
      "Breathe in slowly through your nose for 4 counts",
      "Feel your belly expand while your chest stays relatively still",
      "Hold for 2 counts",
      "Exhale through your mouth for 6 counts",
      "Repeat 10 times"
    ],
    tips: [
      "Imagine breathing into your lower back",
      "Don't force it - let it flow naturally",
      "This is the foundation of all good speaking"
    ],
    common_mistakes: [
      "Breathing too high in the chest",
      "Forcing the breath",
      "Holding tension in shoulders"
    ]
  },
  {
    id: "vocal-warm-up-basic",
    name: "Gentle Vocal Warm-up",
    type: "vocal_warm_up",
    duration: 8,
    difficulty: "beginner",
    instructions: [
      "Start with gentle humming - mm-mm-mm",
      "Move to lip trills (like a horse sound)",
      "Practice 'ma-me-mi-mo-mu' with clear articulation",
      "Slide from low to high pitch with 'ng' sound",
      "End with gentle 'ah' sounds at comfortable pitch"
    ],
    tips: [
      "Never strain your voice",
      "Keep it gentle and relaxed",
      "Stop if you feel any tension"
    ],
    common_mistakes: [
      "Starting too loud or aggressive",
      "Skipping the warm-up",
      "Forcing high or low notes"
    ]
  },
  {
    id: "projection-practice",
    name: "Voice Projection Training",
    type: "projection",
    duration: 10,
    difficulty: "intermediate",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Imagine speaking to someone across a large room",
      "Use your diaphragm, not your throat",
      "Practice counting 1-10 with increasing volume",
      "Maintain clear articulation as volume increases",
      "Practice the phrase 'Good morning, everyone!' at different volumes"
    ],
    tips: [
      "Volume comes from breath support, not throat strain",
      "Think 'out and forward' not 'up and loud'",
      "Practice regularly in different spaces"
    ],
    common_mistakes: [
      "Shouting instead of projecting",
      "Tensing throat muscles",
      "Losing articulation when speaking louder"
    ]
  },
  {
    id: "articulation-drill",
    name: "Clear Speech Articulation",
    type: "articulation",
    duration: 7,
    difficulty: "intermediate",
    instructions: [
      "Practice tongue twisters slowly and clearly",
      "Focus on consonants: 'Red leather, yellow leather'",
      "Work on vowels: 'The rain in Spain falls mainly on the plain'",
      "Practice with a pen between your teeth",
      "Record yourself and listen back"
    ],
    tips: [
      "Slow and clear beats fast and unclear",
      "Exaggerate mouth movements",
      "Practice little and often"
    ],
    common_mistakes: [
      "Going too fast",
      "Mumbling through difficult parts",
      "Not opening mouth enough"
    ]
  },
  {
    id: "resonance-building",
    name: "Voice Resonance Development",
    type: "resonance",
    duration: 12,
    difficulty: "advanced",
    instructions: [
      "Place hand on chest, feel vibrations while speaking",
      "Practice 'ng' sound in different parts of your range",
      "Speak with your hand cupped behind your ear",
      "Practice speaking with different emotional tones",
      "Record in different acoustic environments"
    ],
    tips: [
      "Rich resonance comes from relaxed vocal tract",
      "Don't force - let your natural voice shine",
      "Different spaces require different approaches"
    ],
    common_mistakes: [
      "Trying to sound like someone else",
      "Over-manipulating voice",
      "Ignoring room acoustics"
    ]
  }
];

export const presentationScenarios = [
  {
    id: "boardroom-presentation",
    title: "Boardroom Presentation",
    context: "You're presenting quarterly results to senior executives",
    audience_type: "Senior leadership, formal setting",
    challenges: [
      "High stakes environment",
      "Intimidating audience",
      "Complex data to communicate",
      "Limited time"
    ],
    solutions: [
      "Prepare extensively with backup slides",
      "Practice your opening 10 times",
      "Use confident body language",
      "Slow down and pause for emphasis"
    ],
    sofia_guidance: [
      "I remember my first boardroom presentation - I was so nervous I forgot my own name! The key is preparation.",
      "These executives want you to succeed. They need the information you're sharing.",
      "Your expertise got you in this room. Trust yourself and your knowledge."
    ]
  },
  {
    id: "conference-keynote",
    title: "Conference Keynote",
    context: "You're the opening speaker at a 500-person industry conference",
    audience_type: "Professional peers, mixed experience levels",
    challenges: [
      "Large audience",
      "Setting the tone for the event",
      "Managing stage fright",
      "Engaging diverse skill levels"
    ],
    solutions: [
      "Arrive early to test microphone and get comfortable on stage",
      "Start with a relatable story or question",
      "Use purposeful movement on stage",
      "Make eye contact with different sections"
    ],
    sofia_guidance: [
      "The bigger the audience, the more energy you need to bring. They're feeding off your enthusiasm.",
      "Remember, they chose YOU to open their event. That's a huge compliment.",
      "Focus on serving your audience, not impressing them."
    ]
  },
  {
    id: "team-meeting",
    title: "Team Meeting Update",
    context: "Weekly team update with your colleagues",
    audience_type: "Peers and direct reports, casual setting",
    challenges: [
      "Maintaining engagement in routine meetings",
      "Balancing detail with time constraints",
      "Encouraging participation",
      "Managing different personality types"
    ],
    solutions: [
      "Start with something positive or interesting",
      "Ask questions to involve others",
      "Use visual aids even for simple updates",
      "End with clear next steps"
    ],
    sofia_guidance: [
      "Even routine meetings are opportunities to build your speaking confidence.",
      "Your colleagues want to hear from you - you're all on the same team.",
      "Practice here pays off in higher-stakes presentations later."
    ]
  }
];