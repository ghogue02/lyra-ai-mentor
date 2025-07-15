import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function testStoryFormatting() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🎨 TESTING STORY FORMATTING')
  console.log('=' * 30)
  
  // Get Maya's story blocks from Lesson 5
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('id, title, content, order_index')
    .eq('lesson_id', 5)
    .order('order_index')
  
  if (!contentBlocks) return
  
  console.log('\n📚 Content Blocks in Lesson 5:')
  
  contentBlocks.forEach(block => {
    const wordCount = block.content.split(' ').length
    const hasDialogue = block.content.includes('"') || block.content.includes('"')
    const storyIndicators = [
      'Monday morning',
      'Maya',
      'anxiety',
      'email crisis',
      'thought she\'d',
      'imagined',
      'doesn\'t know yet',
      'about to change'
    ]
    
    const hasStoryElements = storyIndicators.some(indicator => 
      block.content.toLowerCase().includes(indicator.toLowerCase()) || 
      block.title.toLowerCase().includes(indicator.toLowerCase())
    )
    
    const isStoryBlock = (wordCount > 150 && hasStoryElements) || hasDialogue
    
    console.log(`\n📝 "${block.title}"`)
    console.log(`   - Order: ${block.order_index}`)
    console.log(`   - Word Count: ${wordCount}`)
    console.log(`   - Has Dialogue: ${hasDialogue}`)
    console.log(`   - Has Story Elements: ${hasStoryElements}`)
    console.log(`   - Will Use Story Formatting: ${isStoryBlock ? '✅ YES' : '❌ NO'}`)
    
    if (isStoryBlock) {
      // Show what type of segments would be detected
      const segments = []
      if (block.content.includes('Monday morning') || block.content.includes('7:30 AM')) {
        segments.push('🎯 Hook')
      }
      if (block.content.includes('anxiety') || block.content.includes('wrestling')) {
        segments.push('⚡ Tension')
      }
      if (hasDialogue) {
        segments.push('💬 Dialogue')
      }
      if (block.content.includes('imagined') || block.content.includes('feeling')) {
        segments.push('💗 Emotion')
      }
      if (block.content.includes('doesn\'t know yet') || block.content.includes('about to change')) {
        segments.push('✨ Revelation')
      }
      
      if (segments.length > 0) {
        console.log(`   - Detected Segments: ${segments.join(', ')}`)
      }
    }
  })
  
  console.log('\n\n✅ STORY FORMATTING TEST COMPLETE')
  console.log('\n📌 Key Points:')
  console.log('   • Long narrative blocks (150+ words) with story elements will use enhanced formatting')
  console.log('   • Blocks with dialogue will always use story formatting')
  console.log('   • Different visual treatments for hooks, tension, emotion, dialogue, and revelations')
  console.log('   • Improved spacing, typography, and visual hierarchy')
  console.log('   • Icons and color coding to guide pacing')
}

testStoryFormatting().catch(console.error)