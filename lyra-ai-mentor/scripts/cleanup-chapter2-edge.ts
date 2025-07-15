import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function cleanupChapter2() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🧹 Starting Chapter 2 Cleanup and Reorganization...\n')
  
  // Step 1: Hide all admin tools across Chapter 2
  console.log('📌 Step 1: Hiding admin tools...')
  
  const adminToolTypes = [
    'interactive_element_auditor',
    'automated_element_enhancer',
    'database_debugger',
    'interactive_element_builder',
    'element_workflow_coordinator',
    'chapter_builder_agent',
    'content_audit_agent',
    'database_content_viewer'
  ]
  
  const { error: hideError } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'hide-admin-elements',
      data: {
        lessonIds: [5, 6, 7, 8],
        elementTypes: adminToolTypes
      }
    }
  })
  
  if (hideError) {
    console.error('❌ Error hiding admin elements:', hideError)
  } else {
    console.log('✅ Admin tools hidden')
  }
  
  // Step 2: Delete James content from Lesson 6
  console.log('\n📌 Step 2: Removing James content from Lesson 6...')
  
  const { error: deleteError } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'delete-james-content',
      data: {}
    }
  })
  
  if (deleteError) {
    console.error('❌ Error deleting James content:', deleteError)
  } else {
    console.log('✅ James content removed')
  }
  
  // Step 3: Add Maya's document journey content
  console.log('\n📌 Step 3: Adding Maya\'s document journey content...')
  
  const { error: mayaError } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'add-maya-content',
      data: {}
    }
  })
  
  if (mayaError) {
    console.error('❌ Error adding Maya content:', mayaError)
  } else {
    console.log('✅ Maya\'s content added for lessons 6, 7, and 8')
  }
  
  // Step 4: Update lesson metadata
  console.log('\n📌 Step 4: Updating lesson metadata...')
  
  const lessonUpdates = [
    {
      id: 5,
      title: "Maya's Email Revolution",
      description: "Transform email overwhelm into connection and confidence"
    },
    {
      id: 6,
      title: "Maya's Document Breakthrough", 
      description: "Master grant proposals, reports, and professional documents"
    },
    {
      id: 7,
      title: "Maya's Meeting Mastery",
      description: "Lead productive meetings that drive decisions and engagement"
    },
    {
      id: 8,
      title: "Maya's Research Revolution",
      description: "Turn information overload into strategic insights"
    }
  ]
  
  const { error: metadataError } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'update-lesson-metadata',
      data: {
        lessons: lessonUpdates
      }
    }
  })
  
  if (metadataError) {
    console.error('❌ Error updating lesson metadata:', metadataError)
  } else {
    console.log('✅ Lesson metadata updated')
  }
  
  // Step 5: Add story transitions
  console.log('\n📌 Step 5: Adding story transitions...')
  
  const { error: transitionError } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'add-story-transitions',
      data: {}
    }
  })
  
  if (transitionError) {
    console.error('❌ Error adding story transitions:', transitionError)
  } else {
    console.log('✅ Story transitions added')
  }
  
  // Final summary
  console.log('\n🎉 Chapter 2 Cleanup Complete!')
  console.log('\nWhat was done:')
  console.log('✅ Hidden all admin/debug tools')
  console.log('✅ Removed James content from Lesson 6')
  console.log('✅ Added Maya\'s journey for Lessons 6, 7, and 8')
  console.log('✅ Updated all lesson titles and descriptions')
  console.log('✅ Added story continuity between lessons')
  console.log('\n📚 Chapter 2 now tells Maya\'s complete transformation story!')
}

cleanupChapter2().catch(console.error)