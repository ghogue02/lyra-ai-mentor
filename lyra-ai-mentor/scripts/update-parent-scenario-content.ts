import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function updateParentScenarioContent() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('📝 Updating content block to perfectly set up the interactive element...\n')
  
  const enhancedContent = `Maya's coffee has just reached the perfect temperature when her phone buzzes with an email notification. The sender name makes her sit up straight: Sarah Chen, one of her most involved parents.

**Subject: Urgent - Program Changes?**

Maya's stomach drops slightly. Sarah is Emma's mom—Emma, the 8-year-old who went from shy newcomer to confident helper in just three months. Sarah never emails unless something's really bothering her.

As Maya reads, she can feel Sarah's stress through the screen:

*"I just saw the notice about the new 5:30 PM pickup time starting next month. As a single parent working until 6 PM downtown, I'm really concerned... Is there any flexibility? I'm worried she'll have to drop out..."*

Maya's cursor hovers over the reply button. In the past, this email would have paralyzed her for half an hour. She'd write and rewrite, trying to balance empathy with policy, warmth with professionalism. She'd worry about sounding too rigid or too wishy-washy, too formal or too casual.

But this morning is different. Maya has the AI Email Composer open in another tab—the tool she learned about yesterday. Her fingers tingle with a mix of nervousness and excitement. This is her chance to use AI for something that really matters: keeping Emma in the program while supporting a stressed single parent.

"Okay," Maya whispers to herself, "let's see if AI can help me turn anxiety into connection."

She takes a deep breath and clicks reply. Instead of a blank screen mocking her, she now has a powerful assistant ready to help her find the perfect words. The transformation begins...`

  // Update via Edge Function
  const { data, error } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'update-content-block',
      data: {
        lessonId: 5,
        title: "Maya's First Test: The Concerned Parent Email",
        content: enhancedContent
      }
    }
  })
  
  if (error) {
    console.error('❌ Error updating content:', error)
  } else {
    console.log('✅ Content block updated!')
    console.log('\n📖 What this accomplishes:')
    console.log('- Creates emotional investment in Emma and Sarah')
    console.log('- Shows Maya\'s internal struggle vividly')
    console.log('- Builds anticipation for using the AI tool')
    console.log('- Sets up the transformation moment')
    console.log('- Makes the stakes personal and relatable')
  }
  
  // Also create the follow-up content block if it doesn't exist
  console.log('\n📝 Ensuring follow-up reflection content exists...')
  
  const reflectionContent = `Maya leans back in her chair, a smile spreading across her face as she reads Sarah's grateful reply. Her coffee is still warm—a first for Monday mornings.

**The Transformation in Numbers:**
- Time to write this email: 4 minutes 18 seconds
- Time it usually takes Maya: 30+ minutes of agonizing
- Quality of response: Better than anything she's written before
- Sarah's stress level: Transformed from panic to relief
- Emma's program status: Secured with multiple options

But the real transformation goes deeper. Maya realizes she didn't just write an email—she:
- Validated a parent's feelings without defensiveness
- Explained policy changes as protection, not restriction  
- Offered concrete solutions that showed genuine care
- Strengthened a relationship instead of just solving a problem

The AI Email Composer didn't replace Maya's empathy—it amplified it. It took her caring heart and gave it a confident voice. It transformed her scattered thoughts into structured solutions.

Maya opens her task list and looks at the remaining parent emails with new eyes. Each one is no longer a source of dread but an opportunity to connect, support, and strengthen her program community.

She opens the next email, from a grandmother worried about her grandson's reading progress. This time, Maya doesn't hesitate. She knows exactly how to begin: with understanding, with solutions, and with the confidence that AI has given her the words to match her intentions.

The email anxiety that haunted her Mondays? It's been replaced by something powerful: the joy of meaningful connection, one transformed message at a time.`
  
  // Try to update or create the reflection block
  const { error: reflectionError } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'batch-update',
      data: {
        updates: [{
          table: 'content_blocks',
          data: {
            lesson_id: 5,
            title: "The Email That Changed Everything",
            content: reflectionContent,
            order_index: 85,
            type: 'text'
          },
          match: {
            lesson_id: 5,
            title: "The Email That Changed Everything"
          }
        }]
      }
    }
  })
  
  if (!reflectionError) {
    console.log('✅ Reflection content ready!')
  }
}

updateParentScenarioContent().catch(console.error)