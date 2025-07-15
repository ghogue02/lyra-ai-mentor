import { auditContent } from './content-audit-tool'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Master script to transform Chapter 2
 * 
 * This runs all necessary operations in sequence:
 * 1. Pre-audit to understand current state
 * 2. Cleanup and reorganization
 * 3. Post-audit to verify success
 * 4. Generate summary report
 */

async function runChapter2Transformation() {
  console.log('🚀 Starting Chapter 2 Complete Transformation\n')
  console.log('This will:')
  console.log('- Audit current content state')
  console.log('- Hide all admin/debug tools')
  console.log('- Convert Lesson 6 from James to Maya')
  console.log('- Create content for empty Lessons 7 & 8')
  console.log('- Add story continuity elements')
  console.log('- Verify the transformation\n')
  
  try {
    // Step 1: Pre-transformation audit
    console.log('📊 Step 1: Running pre-transformation audit...')
    const preAudit = await auditContent()
    
    // Find Chapter 2 in the audit
    const chapter2Pre = preAudit.chapters.find(c => c.id === 2)
    if (chapter2Pre) {
      console.log(`\nChapter 2 current state:`)
      console.log(`- Character consistency: ${chapter2Pre.characterConsistency ? '✅' : '❌'}`)
      console.log(`- Lessons with content: ${chapter2Pre.lessons.filter(l => l.contentBlocks.total > 0).length}/${chapter2Pre.lessons.length}`)
      console.log(`- Total admin tools visible: ${chapter2Pre.lessons.reduce((sum, l) => sum + l.interactiveElements.adminTools.length, 0)}`)
      
      // Show character mentions
      const allCharacters = new Set<string>()
      chapter2Pre.lessons.forEach(lesson => {
        Object.keys(lesson.contentBlocks.characterMentions).forEach(char => allCharacters.add(char))
      })
      console.log(`- Characters mentioned: ${Array.from(allCharacters).join(', ')}`)
    }
    
    // Step 2: Run the cleanup
    console.log('\n\n🧹 Step 2: Running Chapter 2 cleanup...\n')
    const { stdout, stderr } = await execAsync('npx tsx scripts/cleanup-chapter2.ts')
    
    if (stderr) {
      console.error('Cleanup errors:', stderr)
    } else {
      console.log(stdout)
    }
    
    // Wait a moment for database updates to settle
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Step 3: Post-transformation audit
    console.log('\n\n📊 Step 3: Running post-transformation audit...')
    const postAudit = await auditContent()
    
    // Compare results
    const chapter2Post = postAudit.chapters.find(c => c.id === 2)
    if (chapter2Post) {
      console.log(`\nChapter 2 after transformation:`)
      console.log(`- Character consistency: ${chapter2Post.characterConsistency ? '✅' : '❌'}`)
      console.log(`- Lessons with content: ${chapter2Post.lessons.filter(l => l.contentBlocks.total > 0).length}/${chapter2Post.lessons.length}`)
      console.log(`- Total admin tools visible: ${chapter2Post.lessons.reduce((sum, l) => sum + l.interactiveElements.adminTools.length, 0)}`)
      
      // Show character mentions
      const allCharactersPost = new Set<string>()
      chapter2Post.lessons.forEach(lesson => {
        Object.keys(lesson.contentBlocks.characterMentions).forEach(char => allCharactersPost.add(char))
      })
      console.log(`- Characters mentioned: ${Array.from(allCharactersPost).join(', ')}`)
    }
    
    // Step 4: Generate summary report
    console.log('\n\n📝 Step 4: Generating transformation summary...\n')
    
    if (chapter2Pre && chapter2Post) {
      const improvements = []
      
      // Check character consistency
      if (!chapter2Pre.characterConsistency && chapter2Post.characterConsistency) {
        improvements.push('✅ Achieved character consistency (all Maya)')
      }
      
      // Check content coverage
      const preContentLessons = chapter2Pre.lessons.filter(l => l.contentBlocks.total > 0).length
      const postContentLessons = chapter2Post.lessons.filter(l => l.contentBlocks.total > 0).length
      if (postContentLessons > preContentLessons) {
        improvements.push(`✅ Added content to ${postContentLessons - preContentLessons} empty lessons`)
      }
      
      // Check admin tool removal
      const preAdminTools = chapter2Pre.lessons.reduce((sum, l) => sum + l.interactiveElements.adminTools.length, 0)
      const postAdminTools = chapter2Post.lessons.reduce((sum, l) => sum + l.interactiveElements.adminTools.length, 0)
      if (preAdminTools > postAdminTools) {
        improvements.push(`✅ Hidden ${preAdminTools - postAdminTools} admin tools`)
      }
      
      // Check narrative flow
      if (chapter2Post.narrativeFlow === 'complete' && chapter2Pre.narrativeFlow !== 'complete') {
        improvements.push('✅ Established complete narrative flow')
      }
      
      console.log('🎉 Transformation Summary:')
      improvements.forEach(improvement => console.log(`   ${improvement}`))
      
      // Show lesson titles
      console.log('\n📚 Chapter 2 Lessons:')
      chapter2Post.lessons.forEach(lesson => {
        const charMentions = Object.entries(lesson.contentBlocks.characterMentions)
          .filter(([_, count]) => count > 0)
          .map(([char, count]) => `${char} (${count})`)
          .join(', ')
        console.log(`   Lesson ${lesson.id}: ${lesson.title}`)
        if (charMentions) {
          console.log(`      Characters: ${charMentions}`)
        }
      })
    }
    
    // Step 5: Next steps
    console.log('\n\n🎯 Next Steps:')
    console.log('1. Update route configuration to use new chapter navigation')
    console.log('2. Add interactive elements to lessons 6, 7, and 8')
    console.log('3. Test the complete Maya journey flow')
    console.log('4. Apply similar structure to other chapters')
    
    console.log('\n✨ Chapter 2 transformation complete!')
    
  } catch (error) {
    console.error('❌ Transformation failed:', error)
    process.exit(1)
  }
}

// Run the transformation
runChapter2Transformation()