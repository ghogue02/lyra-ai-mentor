import { SofiaLesson } from '../types/sofia';
import { voiceExercises, presentationScenarios } from './voice-exercises';
import { confidenceActivities } from './confidence-activities';

export const sofiaLessons: SofiaLesson[] = [
  {
    id: "lesson-1",
    title: "Voice Foundation Workshop",
    objective: "Master the fundamentals of voice projection, breathing techniques, and vocal warm-ups",
    duration: 45,
    sections: {
      introduction: {
        sofia_welcome: "Welcome to our voice foundation workshop! I'm so excited to work with you today. You know, when I started my journey, I had no idea how much power lay hidden in my voice. I thought some people were just 'natural speakers' and others weren't. What I discovered changed everything - your voice is like a muscle that can be trained, strengthened, and refined. Today, we're going to unlock that potential together.",
        lesson_overview: "We'll start with the foundation of all great speaking: proper breathing. Then we'll move into gentle vocal warm-ups that will become your daily routine. Finally, we'll practice basic projection techniques that will help you be heard clearly in any room. Remember, every professional speaker started exactly where you are now."
      },
      main_content: {
        theory: [
          "Breathing is the engine of great speaking. When we're nervous, we breathe shallow and high in our chest. This starves our voice of the power it needs.",
          "Your diaphragm is your best friend for speaking. It's like having a built-in amplifier that never runs out of battery.",
          "Vocal warm-ups aren't just for singers. They're essential for anyone who wants to speak with clarity and confidence.",
          "Projection isn't about volume - it's about clarity and presence. You want to be heard, not just loud."
        ],
        exercises: [
          voiceExercises.find(e => e.id === "breathing-foundation")!,
          voiceExercises.find(e => e.id === "vocal-warm-up-basic")!,
          voiceExercises.find(e => e.id === "projection-practice")!
        ]
      },
      practice: {
        activities: [
          confidenceActivities.find(a => a.id === "power-pose-practice")!,
          confidenceActivities.find(a => a.id === "preparation-ritual")!
        ],
        reflection_questions: [
          "What did you notice about your natural breathing patterns?",
          "How did your voice feel different after the warm-up exercises?",
          "What challenges did you face with the projection exercises?",
          "How can you incorporate these techniques into your daily routine?"
        ]
      },
      conclusion: {
        sofia_summary: "You've just taken the first crucial step in your speaking journey! I can already hear the difference in your voice. Remember, I used to be terrified of my own voice - now I help others find theirs. The exercises we practiced today are your daily foundation. Like building physical fitness, vocal fitness requires consistency, not perfection.",
        key_takeaways: [
          "Proper breathing is the foundation of all great speaking",
          "Vocal warm-ups prevent strain and improve clarity",
          "Projection comes from breath support, not throat strain",
          "Daily practice builds vocal confidence and strength"
        ],
        next_steps: "Tomorrow, we'll dive into presentation design. You'll learn how to create slides and content that support your voice rather than compete with it. Keep practicing these breathing exercises - they're going to serve you well!"
      }
    }
  },
  {
    id: "lesson-2",
    title: "Presentation Design Mastery",
    objective: "Learn to create compelling presentations that engage and support your voice",
    duration: 50,
    sections: {
      introduction: {
        sofia_welcome: "Hello again! How did yesterday's breathing exercises go? I hope you're starting to feel that solid foundation building. Today we're going to talk about something that completely changed my approach to presentations: design that works WITH your voice, not against it. Too many speakers create slides that compete with their message instead of supporting it.",
        lesson_overview: "We'll explore the principles of presentation design that actually help you speak better. You'll learn how to create slides that guide your audience's attention, support your key points, and give you confidence cues. We'll also practice structuring your content so it flows naturally and feels conversational."
      },
      main_content: {
        theory: [
          "Your slides should be your speaking partner, not your teleprompter. They should enhance your message, not replace it.",
          "Less is always more in presentation design. One key idea per slide allows your audience to focus on what you're saying.",
          "Visual hierarchy guides your audience's attention and supports your vocal emphasis.",
          "Stories and examples make your content memorable and give you natural speaking cues."
        ],
        exercises: [
          voiceExercises.find(e => e.id === "articulation-drill")!
        ],
        scenarios: [
          presentationScenarios.find(s => s.id === "team-meeting")!
        ]
      },
      practice: {
        activities: [
          confidenceActivities.find(a => a.id === "micro-presentation-practice")!,
          confidenceActivities.find(a => a.id === "success-story-collection")!
        ],
        reflection_questions: [
          "How do your current slides support or hinder your speaking?",
          "What visual elements help you feel more confident while presenting?",
          "How can you use storytelling to make your content more engaging?",
          "What's one design principle you can apply to your next presentation?"
        ]
      },
      conclusion: {
        sofia_summary: "Beautiful work today! You're learning to think like a confident speaker - someone who uses every tool available to support their message. The design principles we covered aren't just about making pretty slides; they're about creating an environment where your voice can shine. Remember, your slides are there to support you, not the other way around.",
        key_takeaways: [
          "Slides should support your voice, not compete with it",
          "One key idea per slide maintains audience focus",
          "Visual hierarchy guides attention and supports vocal emphasis",
          "Stories and examples make content memorable and speakable"
        ],
        next_steps: "Tomorrow, we'll dive into audience engagement techniques. You'll learn how to read your audience, adapt in real-time, and create that magical connection that makes speaking feel like conversation."
      }
    }
  },
  {
    id: "lesson-3",
    title: "Audience Engagement Techniques",
    objective: "Develop skills to connect with your audience and handle various presentation scenarios",
    duration: 55,
    sections: {
      introduction: {
        sofia_welcome: "Welcome back, my friend! I can see your confidence growing with each lesson. Today we're tackling something that used to terrify me: actually connecting with the people in front of me. For the longest time, I thought the audience was my enemy - judging every word, waiting for me to fail. What I discovered transformed everything: your audience is your ally, not your adversary.",
        lesson_overview: "We'll explore techniques to read your audience, adapt your delivery in real-time, and create genuine connections. You'll learn how to handle questions, manage difficult situations, and turn presentation anxiety into presentation energy. Most importantly, we'll practice seeing your audience as real people who want you to succeed."
      },
      main_content: {
        theory: [
          "Your audience wants you to succeed. They didn't come to watch you fail - they came to learn something valuable.",
          "Reading the room is a skill that can be developed. Body language, energy levels, and engagement cues tell you everything you need to know.",
          "Interaction doesn't have to be scary. Simple techniques can make your presentation feel like a conversation with friends.",
          "Difficult questions are opportunities to demonstrate your expertise and build trust."
        ],
        exercises: [
          voiceExercises.find(e => e.id === "projection-practice")!
        ],
        scenarios: [
          presentationScenarios.find(s => s.id === "conference-keynote")!,
          presentationScenarios.find(s => s.id === "boardroom-presentation")!
        ]
      },
      practice: {
        activities: [
          confidenceActivities.find(a => a.id === "audience-perspective-shift")!,
          confidenceActivities.find(a => a.id === "fear-inventory")!
        ],
        reflection_questions: [
          "How has your perception of audiences changed through this lesson?",
          "What engagement techniques feel most natural to you?",
          "How can you better read and respond to audience energy?",
          "What strategies will you use to handle challenging questions?"
        ]
      },
      conclusion: {
        sofia_summary: "Today you've learned one of the most important secrets of confident speaking: your audience is on your side. This shift in perspective changes everything. When you see friendly faces instead of judges, when you focus on serving instead of impressing, your whole energy changes. And guess what? Your audience feels that change too.",
        key_takeaways: [
          "Audiences want you to succeed, not fail",
          "Reading the room is a learnable skill",
          "Simple interaction techniques create connection",
          "Difficult questions are opportunities to build trust"
        ],
        next_steps: "Tomorrow, we're going to work on the internal game - confidence building systems that will give you unshakeable self-assurance. You're going to love what we discover about your inner strength!"
      }
    }
  },
  {
    id: "lesson-4",
    title: "Confidence Building Systems",
    objective: "Build unshakeable confidence through proven techniques and mindset strategies",
    duration: 60,
    sections: {
      introduction: {
        sofia_welcome: "Here we are at lesson four, and I'm so proud of how far you've come! Today we're diving deep into the inner game of confident speaking. This is where the real magic happens - not just in your voice or your slides, but in your mind and heart. I want to share with you the confidence-building systems that took me from that terrified college student to someone who genuinely loves speaking.",
        lesson_overview: "We'll explore the psychology of confidence, build your personal confidence toolkit, and create systems that work even when you're feeling nervous. You'll learn how to transform anxiety into excitement, how to recover from mistakes gracefully, and how to build a mindset that serves your success. This isn't about fake confidence - it's about real, sustainable self-assurance."
      },
      main_content: {
        theory: [
          "Confidence is not the absence of fear - it's the decision to act despite fear. Even experienced speakers feel nervous sometimes.",
          "Your inner dialogue becomes your outer reality. The way you talk to yourself directly impacts your performance.",
          "Confidence is built through preparation, practice, and perspective. All three are under your control.",
          "Mistakes are not failures - they're proof that you're pushing your comfort zone and growing."
        ],
        exercises: [
          voiceExercises.find(e => e.id === "resonance-building")!
        ]
      },
      practice: {
        activities: [
          confidenceActivities.find(a => a.id === "voice-affirmations")!,
          confidenceActivities.find(a => a.id === "power-pose-practice")!,
          confidenceActivities.find(a => a.id === "preparation-ritual")!
        ],
        reflection_questions: [
          "What beliefs about yourself as a speaker need to be updated?",
          "How can you use your preparation routine to build confidence?",
          "What would you attempt if you knew you couldn't fail?",
          "How will you celebrate your speaking progress and wins?"
        ]
      },
      conclusion: {
        sofia_summary: "You've just built a confidence system that will serve you for life. These aren't just techniques - they're tools for transformation. Remember, confidence isn't something you either have or don't have. It's something you build, day by day, speech by speech, breath by breath. You have everything you need inside you already.",
        key_takeaways: [
          "Confidence is a skill that can be developed",
          "Your inner dialogue shapes your outer performance",
          "Preparation, practice, and perspective build true confidence",
          "Mistakes are opportunities for growth, not evidence of failure"
        ],
        next_steps: "Tomorrow we dive into our advanced workshop series! You'll choose from four specialized workshops that will take your skills to the next level. I'm excited to see which area you want to explore deeper!"
      }
    }
  },
  {
    id: "lesson-5",
    title: "Advanced Speaking Workshops",
    objective: "Master specialized speaking skills through intensive workshops",
    duration: 90,
    sections: {
      introduction: {
        sofia_welcome: "Welcome to our advanced workshop series! You've built such a strong foundation over these past four lessons. Now it's time to specialize and really hone your unique speaking style. I've designed four intensive workshops that address the most common areas where speakers want to excel. Choose the one that excites you most, or work through them all - you're ready for this level of growth!",
        lesson_overview: "Today you'll choose from four specialized workshops: Vocal Technique Mastery, Slide Design Workshop, Q&A Handling Guide, and Stage Presence Training. Each workshop is designed to take you from competent to confident to truly exceptional in that specific area. This is where you develop your signature speaking style."
      },
      main_content: {
        theory: [
          "Mastery comes from focused practice in specific areas. You've built the foundation - now we're adding the specialized skills.",
          "Your speaking style is unique to you. These workshops help you discover and refine what makes you special as a speaker.",
          "Advanced speakers know their strengths and continually develop them. You're not trying to be perfect at everything - you're becoming exceptional at what matters most.",
          "The journey from good to great requires intentional practice and specific skill development."
        ],
        exercises: [
          voiceExercises.find(e => e.id === "resonance-building")!
        ]
      },
      practice: {
        activities: [
          confidenceActivities.find(a => a.id === "micro-presentation-practice")!,
          confidenceActivities.find(a => a.id === "success-story-collection")!
        ],
        reflection_questions: [
          "Which workshop area excites you most and why?",
          "What aspects of your speaking do you want to refine?",
          "How will you apply advanced techniques to your current speaking opportunities?",
          "What does your ideal speaking style look like?"
        ]
      },
      conclusion: {
        sofia_summary: "You've reached an exciting milestone! You're no longer just learning to speak - you're developing your unique voice and style. The workshops ahead will help you find what makes you special as a speaker. Remember, every expert was once a beginner, and every master was once a student. You're exactly where you need to be.",
        key_takeaways: [
          "Specialization builds on your strong foundation",
          "Your unique speaking style is your greatest asset",
          "Advanced skills require focused, intentional practice",
          "Mastery is a journey, not a destination"
        ],
        next_steps: "Choose your workshop and dive deep! Each one will challenge you and help you grow in specific ways. I'll be right there with you, cheering you on every step of the way."
      }
    }
  }
];