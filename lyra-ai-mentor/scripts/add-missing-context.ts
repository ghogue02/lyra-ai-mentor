import { ContentManager } from './content-manager'

async function addMissingContext() {
  console.log('🔧 Adding missing context for Maya\'s parent response scenario...\n')
  
  try {
    // First, let's create the missing context block using Edge Function
    const result = await ContentManager.batchUpdate([
      {
        table: 'content_blocks',
        data: {
          lesson_id: 5,
          title: "Maya's First Test: The Concerned Parent Email",
          content: `Just as Maya finishes reading about the AI Email Composer's capabilities, her phone buzzes with an urgent notification. Sarah Chen, a parent whose daughter Emma attends the after-school program, has sent a concerned email about the new pickup schedule that was announced last week.

Sarah's message is polite but clearly worried: "I just saw the notice about the new 5:30 PM pickup time. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me. Is there any flexibility? I don't want her to lose her spot in the program..."

This is exactly the kind of email that usually takes Maya 30 minutes to craft - she needs to balance empathy for Sarah's situation, clearly explain the reasons for the change, offer practical solutions, and maintain professional boundaries while keeping that warm, personal touch parents appreciate.

In the past, Maya would have stared at the blank screen, typed and deleted several openings, worried about sounding too rigid or too casual, and probably put it off until after lunch. But now, with AI assistance, she can respond thoughtfully and effectively in just minutes. Let's help Maya craft the perfect response...`,
          order_index: 45,
          type: 'text'
        },
        match: {
          lesson_id: 5,
          title: "Maya's First Test: The Concerned Parent Email"
        }
      }
    ])
    
    if (result.success) {
      console.log('✅ Context block added successfully!')
      console.log('\n📝 What was added:')
      console.log('- Sets up Sarah Chen as a concerned parent')
      console.log('- Explains the specific issue (pickup time change)')
      console.log('- Shows why this email is challenging for Maya')
      console.log('- Creates natural transition to the interactive element')
      
      // Now update the interactive element description to match
      await ContentManager.updateInteractiveElement(23, {
        description: "Sarah Chen is worried about the new 5:30 PM pickup time. Help Maya craft a response that acknowledges Sarah's concerns, explains the reasons for the change, and offers practical solutions while maintaining warmth and professionalism."
      })
      
      console.log('\n✅ Interactive element description updated to match the scenario!')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

addMissingContext()