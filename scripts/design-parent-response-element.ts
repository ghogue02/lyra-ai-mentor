// Interactive Element Design: "Turn Maya's Email Anxiety into Connection"

interface InteractiveElementDesign {
  title: string
  type: string
  description: string
  config: {
    scenario: {
      context: string
      senderEmail: string
      emotionalState: string
    }
    scaffoldedTemplate: {
      sections: TemplateSection[]
    }
    snippetLibrary: {
      toneProfiles: ToneProfile[]
      keyPhrases: PhraseCategory[]
      smartSuggestions: SmartSuggestion[]
    }
    transformation: {
      showRealTime: boolean
      highlightChanges: boolean
      animationStyle: string
    }
    successExperience: {
      timeComparison: TimeMetric
      recipientReply: string
      lyraFeedback: LyraMessage
      personalApplication: string
    }
  }
}

interface TemplateSection {
  id: string
  label: string
  placeholder: string
  defaultOptions: string[]
  userEditable: boolean
  aiEnhanced: boolean
}

interface ToneProfile {
  name: string
  description: string
  example: string
  whenToUse: string
}

interface PhraseCategory {
  category: string
  phrases: string[]
  purpose: string
}

interface SmartSuggestion {
  trigger: string
  suggestion: string
  reasoning: string
}

interface TimeMetric {
  before: string
  after: string
  saved: string
  visual: string
}

interface LyraMessage {
  greeting: string
  tips: string[]
  encouragement: string
  nextSteps: string
}

const parentResponseElement: InteractiveElementDesign = {
  title: "Turn Maya's Email Anxiety into Connection",
  type: "ai_email_composer",
  description: "Transform Sarah's worried message into an opportunity to strengthen trust. Watch as your words become a bridge of understanding.",
  
  config: {
    scenario: {
      context: "Monday 8:47 AM - Maya's inbox shows Sarah Chen's email marked 'Urgent'",
      senderEmail: `Subject: Urgent - Program Changes?

Hi Maya,

I just saw the notice about the new 5:30 PM pickup time starting next month. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me. 

She loves the program and her friends there. Is there any flexibility? I'm worried she'll have to drop out, and I don't know what I'll do for childcare. Can we talk about options?

I'm feeling pretty stressed about this.

Thanks,
Sarah Chen`,
      emotionalState: "Maya feels the weight of Sarah's stress. She wants to help but needs to balance empathy with policy requirements."
    },
    
    scaffoldedTemplate: {
      sections: [
        {
          id: "opening",
          label: "Start with understanding",
          placeholder: "Acknowledge Sarah's concern with warmth",
          defaultOptions: [
            "Hi Sarah, I completely understand your concern about the pickup time change, and I want you to know that Emma's place in our program is important to us.",
            "Dear Sarah, Thank you for reaching out. I can absolutely hear the stress in your message, and I want to assure you that we're here to find a solution together.",
            "Hi Sarah, First, let me say how much we value having Emma in our program. I understand this schedule change creates a real challenge for your family."
          ],
          userEditable: true,
          aiEnhanced: true
        },
        {
          id: "explanation",
          label: "Explain with transparency",
          placeholder: "Share the 'why' behind the change",
          defaultOptions: [
            "The change to 5:30 PM was necessary due to new staff scheduling requirements and enhanced safety protocols during darker evening hours.",
            "We had to adjust our hours to ensure proper staff coverage and maintain the high-quality supervision that keeps all our kids safe.",
            "This decision came after careful consideration of staff availability and child safety requirements, especially as daylight hours shorten."
          ],
          userEditable: true,
          aiEnhanced: true
        },
        {
          id: "solutions",
          label: "Offer concrete options",
          placeholder: "Present practical solutions",
          defaultOptions: [
            "Here are three options that might work for you: 1) Our extended care program runs until 6:30 PM for a small additional fee, 2) We're creating a parent carpool network, or 3) We offer a sliding scale for the extended care based on need.",
            "I'm happy to share that we have several solutions: Extended care until 6:30 PM ($5/day), our new carpool matching program, and possible work-study options for Emma to help with younger kids.",
            "Let's explore these possibilities: Our affordable extended care option, connecting you with other downtown-working parents for pickup sharing, or discussing a modified schedule that might work better."
          ],
          userEditable: true,
          aiEnhanced: true
        },
        {
          id: "closing",
          label: "End with partnership",
          placeholder: "Reinforce support and next steps",
          defaultOptions: [
            "Emma is such a bright light in our program, and we'll do everything we can to keep her with us. Could we chat this afternoon to discuss which option works best for your family?",
            "Please know that we're committed to finding a solution that works for you. Would you be available for a quick call today or tomorrow to go over these options in detail?",
            "We're in this together, Sarah. Emma's well-being is our shared priority. Let me know when you're free to talk, and we'll create a plan that gives you peace of mind."
          ],
          userEditable: true,
          aiEnhanced: true
        }
      ]
    },
    
    snippetLibrary: {
      toneProfiles: [
        {
          name: "Warm & Understanding",
          description: "Like a supportive friend who happens to run a program",
          example: "I totally get it - juggling work and pickup times is so stressful!",
          whenToUse: "For parents you know well or who are showing vulnerability"
        },
        {
          name: "Professional & Caring",
          description: "Balanced warmth with clear information",
          example: "I understand your concerns and want to assure you we have several options available.",
          whenToUse: "Standard tone for most parent communications"
        },
        {
          name: "Solution-Focused & Upbeat",
          description: "Positive and action-oriented",
          example: "Great news - we have multiple options that can work with your schedule!",
          whenToUse: "When you want to quickly ease anxiety and show flexibility"
        }
      ],
      
      keyPhrases: [
        {
          category: "Empathy Starters",
          phrases: [
            "I completely understand your concern",
            "Your stress about this is so valid",
            "I can imagine how worried you must feel",
            "Thank you for trusting me with your concerns"
          ],
          purpose: "Build immediate connection and trust"
        },
        {
          category: "Soft Explanations",
          phrases: [
            "We needed to make this change because",
            "The decision was carefully considered to",
            "This adjustment helps us ensure",
            "We know this impacts families, which is why"
          ],
          purpose: "Explain without sounding defensive"
        },
        {
          category: "Solution Bridges",
          phrases: [
            "Here's what we can do together",
            "I'm excited to share these options",
            "Let's explore what works best for Emma",
            "We've created solutions specifically for families like yours"
          ],
          purpose: "Transition from problem to possibilities"
        },
        {
          category: "Partnership Language",
          phrases: [
            "We're in this together",
            "Your input helps us serve families better",
            "Emma's success is our shared goal",
            "We value your family's participation"
          ],
          purpose: "Reinforce collaborative relationship"
        }
      ],
      
      smartSuggestions: [
        {
          trigger: "User types 'sorry'",
          suggestion: "Instead of apologizing, try acknowledging: 'I understand this creates a challenge'",
          reasoning: "Acknowledgment builds connection without admitting fault"
        },
        {
          trigger: "User types 'policy'",
          suggestion: "Soften with: 'To ensure all children's safety, we...'",
          reasoning: "Frames policies as protection, not restriction"
        },
        {
          trigger: "User types 'can't'",
          suggestion: "Reframe as: 'We're working to find a way to...'",
          reasoning: "Positive framing maintains hope and partnership"
        }
      ]
    },
    
    transformation: {
      showRealTime: true,
      highlightChanges: true,
      animationStyle: "gentle-glow"
    },
    
    successExperience: {
      timeComparison: {
        before: "Maya's usual time: 32 minutes of writing and rewriting",
        after: "With AI assistance: 4 minutes 18 seconds",
        saved: "27 minutes saved for actual program work!",
        visual: "⏱️ [====|........................] 4:18 vs 32:00"
      },
      
      recipientReply: `Subject: Re: Urgent - Program Changes?

Maya,

I can't tell you how relieved I am! When I sent that email this morning, I was in such a panic. Your response made me feel heard and gave me real options.

The extended care program sounds perfect - I had no idea it was so affordable. And I love the idea of connecting with other downtown parents for backup coverage.

Thank you for caring about Emma and our family. This is why we love Hope Gardens so much.

Can we talk tomorrow afternoon?

Gratefully,
Sarah`,
      
      lyraFeedback: {
        greeting: "Wow, Maya! That was masterful communication! 🌟",
        tips: [
          "Notice how you validated feelings before explaining? That's emotional intelligence in action.",
          "Your solution sandwich (acknowledge-explain-solve) is a technique you can use for any difficult conversation.",
          "By offering multiple options, you gave Sarah agency - that transforms anxiety into empowerment.",
          "Save this as a template! You'll face similar schedule concerns again."
        ],
        encouragement: "You just turned a potential program loss into a stronger family relationship. That's the power of thoughtful communication!",
        nextSteps: "Ready to tackle that board chair email? You've got the skills now! 💪"
      },
      
      personalApplication: "💡 **Your Turn**: Think about a difficult email in YOUR inbox. Could you use Maya's approach? Try the acknowledge-explain-solve formula with your next challenging message."
    }
  }
}

// UI Flow Description
const userExperience = {
  step1: "User sees Sarah's email with emotional context",
  step2: "Scaffolded template appears with smart defaults",
  step3: "User can click phrases to insert or type their own",
  step4: "AI enhances their words in real-time with gentle highlighting",
  step5: "Preview shows polished email with 'Send with Confidence' button",
  step6: "Success sequence: time saved → Sarah's reply → Lyra's insights",
  step7: "Prompt to apply learning to user's own emails"
}

// This design eliminates all friction by:
// 1. Starting with a template so no blank page
// 2. Offering multiple options so no uncertainty
// 3. Showing transformation live so no surprises
// 4. Providing immediate validation through Sarah's response
// 5. Connecting to personal use immediately

export { parentResponseElement, userExperience }