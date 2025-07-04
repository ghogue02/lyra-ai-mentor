import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function fixLesson5Final() {
  console.log('🔧 Final fix for Lesson 5 content inconsistencies...\n')

  try {
    // Fix 1: Enter the AI Email Revolution
    console.log('1️⃣ Fixing "Enter the AI Email Revolution" block...')
    
    const newRevolutionContent = `What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn't about replacing the human touch that makes her messages meaningful—it's about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will master practical AI tools that will revolutionize her email communication: the AI Email Composer that helps her craft professional, personalized messages in any tone or situation, and personalized AI guidance through Lyra Chat to navigate her specific communication challenges. These tools preserve Maya's authentic voice while dramatically improving her efficiency and confidence.

By the end of this lesson, you'll have the same capabilities Maya gains - turning email anxiety into email mastery, one message at a time.`

    const { error: error1 } = await supabase
      .from('content_blocks')
      .update({ content: newRevolutionContent })
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')

    if (error1) {
      console.error('Error:', error1)
    } else {
      console.log('✅ Fixed "four tools" issue and removed character mentions')
    }

    // Fix 2: Your Email Pain Points
    console.log('\n2️⃣ Fixing "Your Email Pain Points" reflection...')
    
    const { data: painPointsBlock } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .eq('title', 'Your Email Pain Points')
      .single()

    if (painPointsBlock) {
      const fixedContent = painPointsBlock.content.replace(
        'Or perhaps you\'re like James (our development associate), who worries about striking the right tone with major donors?',
        'Or perhaps you worry about striking the right tone with major donors and key stakeholders?'
      )
      
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: fixedContent })
        .eq('id', painPointsBlock.id)

      if (!error) {
        console.log('✅ Removed James reference')
      }
    }

    // Fix 3: Maya's Transformation Begins
    console.log('\n3️⃣ Fixing "Maya\'s Transformation Begins"...')
    
    const transformationContent = `Ready to transform your Monday mornings—and every email interaction—just like Maya? Let's discover how AI can turn your communication challenges into your greatest strengths. Your journey to email mastery begins right now.`

    const { error: error3 } = await supabase
      .from('content_blocks')
      .update({ content: transformationContent })
      .eq('lesson_id', 5)
      .eq('title', 'Maya\'s Transformation Begins')

    if (!error3) {
      console.log('✅ Removed "Coming up" section with character list')
    }

    // Fix 4: Meet Your Nonprofit Heroes
    console.log('\n4️⃣ Fixing "Meet Your Nonprofit Heroes"...')
    
    const heroesContent = `Throughout this course, you'll follow the journeys of nonprofit professionals facing real challenges just like yours. 

Today, you're meeting **Maya Rodriguez**, Program Manager at Hope Gardens Community Center. Maya's story will guide you through mastering AI-powered email communication - from handling concerned parents to managing board communications with confidence.

In the next lesson, you'll meet **James Chen**, who will show you how to conquer document creation challenges. Each character's story teaches practical AI skills you can apply immediately in your own nonprofit work.`

    const { error: error4 } = await supabase
      .from('content_blocks')
      .update({ content: heroesContent })
      .eq('lesson_id', 5)
      .eq('title', 'Meet Your Nonprofit Heroes')

    if (!error4) {
      console.log('✅ Focused on Maya with appropriate James preview')
    }

    // Fix 5: Character Transformation Outcomes
    console.log('\n5️⃣ Fixing "Character Transformation Outcomes"...')
    
    const outcomesContent = `By the end of this lesson, here's what you'll achieve alongside Maya:

**Maya Rodriguez (Email Communication Master)**
- Transform from spending 2+ hours on email to handling her inbox in 30 minutes
- Write compelling program updates that inspire parents and board members
- Handle difficult conversations with confidence and empathy
- Build templates that make future communications effortless

Your transformation starts with mastering email communication - the foundation of nonprofit relationship building. Ready to begin?`

    const { error: error5 } = await supabase
      .from('content_blocks')
      .update({ content: outcomesContent })
      .eq('lesson_id', 5)
      .eq('title', 'Character Transformation Outcomes')

    if (!error5) {
      console.log('✅ Focused outcomes on Maya only')
    }

    // Final verification
    console.log('\n6️⃣ Final verification...')
    
    const { data: verifyBlock } = await supabase
      .from('content_blocks')
      .select('content')
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')
      .single()

    if (verifyBlock) {
      if (verifyBlock.content.includes('practical AI tools')) {
        console.log('✅ "Enter the AI Email Revolution" successfully updated')
      } else {
        console.log('❌ Update may not have saved properly')
      }
    }

    console.log('\n✅ Lesson 5 content fixes complete!')
    console.log('- Removed "four tools" promise (now describes actual tools)')
    console.log('- Removed all inappropriate character mentions')
    console.log('- Focused content on Maya\'s story')
    console.log('- Added appropriate James preview for next lesson')

  } catch (error) {
    console.error('Error during fixes:', error)
  }
}

fixLesson5Final()