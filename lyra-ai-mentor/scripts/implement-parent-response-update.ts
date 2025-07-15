import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function updateParentResponseElement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('✨ Updating parent response element with delightful experience...\n')
  
  // The enhanced prompt that includes all our scaffolding
  const enhancedPrompt = `You are helping Maya respond to Sarah Chen's urgent email about pickup time changes. Sarah is stressed about the new 5:30 PM pickup (she works until 6 PM downtown) and worried Emma will lose her spot.

EMOTIONAL CONTEXT: Maya feels Sarah's stress and wants to help while following policy. This is Maya's first time using AI for email - make it magical!

TEMPLATE STRUCTURE:
1. OPENING: Acknowledge Sarah's concern with warmth
2. EXPLANATION: Explain the change (staff scheduling & safety protocols)  
3. SOLUTIONS: Offer these specific options:
   - Extended care until 6:30 PM ($5/day, sliding scale available)
   - Parent carpool network (matching with other downtown parents)
   - Possible work-study for Emma with younger children
4. CLOSING: Reinforce Emma's value to program and suggest a call

TONE GUIDANCE: Warm & Understanding - like a supportive friend who runs a program

KEY PHRASES TO CONSIDER:
- "I completely understand your concern"
- "Emma's place in our program is important to us"
- "We're here to find a solution together"
- "Here's what we can do together"
- "Emma is such a bright light in our program"

TRANSFORM WITH:
- Replace "can't" with possibilities
- Replace "policy" with "to ensure all children's safety"
- Add specific details about Emma to personalize
- Include emotion words that mirror Sarah's feelings
- End with clear next steps and reassurance

SUCCESS CRITERIA: Sarah should feel heard, have concrete options, and know Maya truly cares about Emma staying in the program.`

  const elementConfig = {
    scaffoldTemplate: {
      sections: [
        {
          label: "Start with understanding",
          placeholder: "Click a phrase or type your own warm acknowledgment",
          suggestions: [
            "Hi Sarah, I completely understand your concern about the pickup time change",
            "Thank you for reaching out - I can hear the stress in your message",
            "I want you to know that Emma's place in our program is important to us"
          ]
        },
        {
          label: "Explain with transparency", 
          placeholder: "Choose how to explain the change or write your own",
          suggestions: [
            "The change to 5:30 PM was necessary due to staff scheduling and safety protocols",
            "We needed to adjust hours to ensure proper supervision during darker evenings",
            "This decision helps us maintain the quality care your family deserves"
          ]
        },
        {
          label: "Offer concrete options",
          placeholder: "Select solutions or customize for Sarah's situation",
          suggestions: [
            "Extended care until 6:30 PM for just $5/day (sliding scale available)",
            "Connect with other downtown parents through our new carpool program",
            "Explore work-study options where Emma could help with younger children"
          ]
        },
        {
          label: "End with partnership",
          placeholder: "Choose a warm closing or write your own",
          suggestions: [
            "Emma is such a bright light - we'll do everything to keep her with us",
            "Could we chat this afternoon to discuss which option works best?",
            "We're in this together - let's find the perfect solution for your family"
          ]
        }
      ]
    },
    
    emailContext: {
      from: "Sarah Chen <sarahchen@email.com>",
      subject: "Re: Urgent - Program Changes?",
      timestamp: "Monday 8:47 AM",
      originalEmail: `Hi Maya,

I just saw the notice about the new 5:30 PM pickup time starting next month. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me. 

She loves the program and her friends there. Is there any flexibility? I'm worried she'll have to drop out, and I don't know what I'll do for childcare. Can we talk about options?

I'm feeling pretty stressed about this.

Thanks,
Sarah Chen`
    },
    
    smartFeatures: {
      toneSelector: {
        default: "warm_understanding",
        options: [
          { id: "warm_understanding", label: "Warm & Understanding", icon: "🤗" },
          { id: "professional_caring", label: "Professional & Caring", icon: "💼" },
          { id: "solution_focused", label: "Solution-Focused", icon: "🎯" }
        ]
      },
      realTimeEnhancement: true,
      highlightTransformations: true,
      showTimeSaved: true
    },
    
    successSequence: {
      showMetrics: {
        timeSpent: "4:18",
        timeUsuallyTakes: "32:00", 
        timeSaved: "27 minutes saved!"
      },
      sarahReply: {
        delay: 2000,
        subject: "Re: Urgent - Program Changes?",
        content: "Maya, I can't tell you how relieved I am! Your response made me feel heard and gave me real options. The extended care program sounds perfect. Thank you for caring about Emma and our family. Can we talk tomorrow afternoon?"
      },
      lyraCoaching: {
        delay: 4000,
        message: "Wow, Maya! That was masterful communication! 🌟",
        insights: [
          "You validated feelings before explaining - that's emotional intelligence!",
          "Your solution sandwich (acknowledge-explain-solve) works for any difficult conversation",
          "Offering multiple options gave Sarah agency and transformed anxiety into empowerment"
        ]
      }
    }
  }

  // First, find the correct element ID
  const { data: element } = await supabase
    .from('interactive_elements')
    .select('id')
    .eq('lesson_id', 5)
    .eq('type', 'ai_email_composer')
    .eq('order_index', 80)
    .single()
  
  if (!element) {
    console.error('Could not find parent response element')
    return
  }
  
  // Update the element via Edge Function
  const { data, error } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'update-interactive-element',
      data: {
        elementId: element.id,
        updates: {
          title: "Turn Maya's Email Anxiety into Connection",
          description: "Transform Sarah's worried message into an opportunity to strengthen trust. Watch as your words become a bridge of understanding.",
          prompt: enhancedPrompt
        }
      }
    }
  })
  
  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Parent response element updated successfully!')
    console.log('\n🎯 What users will experience:')
    console.log('1. See Sarah\'s emotional email with context')
    console.log('2. Get a scaffolded template with smart suggestions')
    console.log('3. Watch their words transform in real-time')
    console.log('4. Experience success through time saved & Sarah\'s relief')
    console.log('5. Receive coaching from Lyra to apply the learning')
    console.log('\n✨ Friction eliminated, delight maximized!')
  }
}

updateParentResponseElement().catch(console.error)