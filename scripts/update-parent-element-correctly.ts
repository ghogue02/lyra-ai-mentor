import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function updateParentElement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('✨ Updating parent response element with correct schema...\n')
  
  // Enhanced content that includes all our scaffolding and guidance
  const enhancedContent = `Transform Sarah's worried message into an opportunity to strengthen trust. Use AI to craft a response that balances empathy, policy, and solutions.

**The Situation:**
Sarah Chen, a single parent working until 6 PM downtown, just learned about the new 5:30 PM pickup time. She's stressed and worried her daughter Emma will have to drop out of your after-school program.

**Your Mission:**
Help Maya write a response that turns this moment of anxiety into a deeper connection with Sarah's family.

**Scaffolded Approach:**
1. **Start with Understanding** - Acknowledge Sarah's concern with genuine warmth
2. **Explain with Transparency** - Share the reason for changes without defensiveness  
3. **Offer Concrete Options** - Present practical solutions that show you care
4. **End with Partnership** - Reinforce Emma's value and suggest next steps

**Available Solutions:**
• Extended care until 6:30 PM ($5/day, sliding scale available)
• Parent carpool network for downtown families
• Work-study option where Emma helps with younger children

**Tone Guide:** Warm & Understanding - Like a supportive friend who happens to run a program

**Success Criteria:** Sarah should feel heard, have clear options, and know that Maya truly cares about keeping Emma in the program.

💡 As you write, notice how AI transforms your natural empathy into polished, professional communication!`

  const configuration = {
    emailScenario: {
      from: "Sarah Chen",
      subject: "Urgent - Program Changes?",
      originalMessage: `Hi Maya,

I just saw the notice about the new 5:30 PM pickup time starting next month. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me. 

She loves the program and her friends there. Is there any flexibility? I'm worried she'll have to drop out, and I don't know what I'll do for childcare. Can we talk about options?

I'm feeling pretty stressed about this.

Thanks,
Sarah Chen`
    },
    
    guidedTemplates: {
      opening: [
        "Hi Sarah, I completely understand your concern about the pickup time change, and I want you to know that Emma's place in our program is important to us.",
        "Dear Sarah, Thank you for reaching out. I can absolutely hear the stress in your message, and I want to assure you that we're here to find a solution together.",
        "Hi Sarah, First, let me say how much we value having Emma in our program. I understand this schedule change creates a real challenge for your family."
      ],
      explanation: [
        "The change to 5:30 PM was necessary due to new staff scheduling requirements and enhanced safety protocols during darker evening hours.",
        "We had to adjust our hours to ensure proper staff coverage and maintain the high-quality supervision that keeps all our kids safe.",
        "This decision came after careful consideration of staff availability and child safety requirements, especially as daylight hours shorten."
      ],
      solutions: [
        "I'm excited to share that we have several options: Extended care until 6:30 PM for just $5/day (sliding scale available), our new parent carpool network, or a work-study opportunity for Emma.",
        "Here are three ways we can make this work: 1) Affordable extended care, 2) Connection with other downtown parents for pickup sharing, 3) A special helper role for Emma with our younger students.",
        "Let's explore these possibilities together: Our extended care program, carpool matching with families in your area, or discussing a modified schedule that works better for you."
      ],
      closing: [
        "Emma is such a bright light in our program, and we'll do everything we can to keep her with us. Could we chat this afternoon to discuss which option works best for your family?",
        "Please know that we're committed to finding a solution that works for you. Would you be available for a quick call today or tomorrow to go over these options in detail?",
        "We're in this together, Sarah. Emma's well-being is our shared priority. Let me know when you're free to talk, and we'll create a plan that gives you peace of mind."
      ]
    },
    
    successMetrics: {
      typicalTime: "30-45 minutes",
      aiAssistedTime: "4-5 minutes",
      emotionalOutcome: "Relief and gratitude",
      relationshipImpact: "Strengthened trust"
    }
  }
  
  // Update the element
  const { error } = await supabase
    .from('interactive_elements')
    .update({
      title: "Turn Maya's Email Anxiety into Connection",
      content: enhancedContent,
      configuration: configuration
    })
    .eq('lesson_id', 5)
    .eq('type', 'ai_email_composer')
    .eq('order_index', 80)
  
  if (error) {
    console.error('❌ Update failed:', error)
  } else {
    console.log('✅ Parent response element updated successfully!')
    console.log('\n🎯 What users will experience:')
    console.log('1. See Sarah\'s emotional email with full context')
    console.log('2. Get scaffolded templates with multiple options')
    console.log('3. Receive tone guidance and success criteria')
    console.log('4. Have clear solutions to offer')
    console.log('5. Transform anxiety into connection!')
    
    // Verify the update
    const { data: updated } = await supabase
      .from('interactive_elements')
      .select('title, content')
      .eq('lesson_id', 5)
      .eq('type', 'ai_email_composer')
      .eq('order_index', 80)
      .single()
    
    if (updated) {
      console.log('\n📋 Verified update:')
      console.log(`Title: ${updated.title}`)
      console.log(`Content preview: ${updated.content.substring(0, 100)}...`)
    }
  }
}

updateParentElement().catch(console.error)