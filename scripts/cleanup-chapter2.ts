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
  
  const { error: hideError } = await supabase.functions.invoke('content-manager', {
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
  
  // Step 2: Update Lesson 6 to be Maya's story (remove James)
  console.log('\n📌 Step 2: Converting Lesson 6 to Maya\'s document journey...')
  
  // First, delete all James content blocks
  const { data: jamesBlocks } = await supabase
    .from('content_blocks')
    .select('id')
    .eq('lesson_id', 6)
    .ilike('content', '%James%')
  
  if (jamesBlocks && jamesBlocks.length > 0) {
    for (const block of jamesBlocks) {
      await supabase
        .from('content_blocks')
        .delete()
        .eq('id', block.id)
    }
    console.log(`✅ Removed ${jamesBlocks.length} James-related content blocks`)
  }
  
  // Create Maya's document journey content
  const mayaDocumentContent = [
    {
      lesson_id: 6,
      title: "Maya's Document Crisis",
      content: `Fresh from her email victory, Maya faces a new challenge. The youth mentorship program she's been dreaming about needs funding, and the Morrison Foundation grant application is due in 48 hours. 

The blank document stares back at her, cursor blinking mockingly. She has all the ideas, the passion, the data—but translating that into a compelling grant proposal feels like climbing Mount Everest in flip-flops.

Last year, she spent three weeks on a similar proposal, only to be rejected for "lack of clarity in program objectives." The feedback stung because she knew exactly what she wanted to achieve; she just couldn't articulate it in grant-speak.

But this morning is different. Maya has discovered AI document tools designed for nonprofits like hers.`,
      order_index: 10,
      type: 'text'
    },
    {
      lesson_id: 6,
      title: "The Hidden Cost of Document Struggles",
      content: `Maya's grant proposal paralysis is costing more than time. The Morrison Foundation's $75,000 could fund her youth mentorship program for two years, serving 100 at-risk teens. Every day of delay is a day those kids don't get the support they need.

Across the nonprofit sector, organizations lose millions in funding due to poorly written proposals. It's not lack of merit—it's the inability to translate passion into persuasive prose. Maya's seen colleagues spend 40+ hours on single proposals, sacrificing program time for paperwork.

But what if Maya could create compelling documents in hours, not weeks? What if AI could help her articulate her vision as clearly as she sees it in her heart?`,
      order_index: 20,
      type: 'text'
    },
    {
      lesson_id: 6,
      title: "Maya Discovers Document AI",
      content: `During lunch with Patricia (who was impressed by Maya's board email), Maya learns about AI document creation tools. Patricia shows her how she used AI to create the annual report that won board acclaim.

"Watch this," Patricia says, pulling up the AI Document Generator. She inputs basic program information, key outcomes, and target audience. Within minutes, the AI creates a structured, compelling narrative that weaves data with human impact stories.

Maya's eyes widen. This isn't just about saving time—it's about finally having the words to match her vision. The AI understands grant language, nonprofit terminology, and most importantly, how to connect mission with money.`,
      order_index: 30,
      type: 'text'
    },
    {
      lesson_id: 6,
      title: "Document Tools That Transform",
      content: `The AI Document Generator offers Maya superpowers she never imagined:

• **Grant Proposal Templates**: Pre-structured with funder priorities, just add your specifics
• **Impact Story Weaving**: Seamlessly blend data with human narratives
• **Budget Justification**: Transform numbers into compelling investment opportunities
• **Executive Summaries**: Distill 20 pages into 1 powerful page

The Document Improver takes it further, polishing rough drafts into professional submissions. It's like having a grant writing consultant available 24/7, one who never judges and always helps.

Maya realizes she's about to transform from someone who dreads document creation to someone who wields it as a tool for change.`,
      order_index: 40,
      type: 'text'
    }
  ]
  
  // Insert Maya's content using batch update
  for (const block of mayaDocumentContent) {
    const { error } = await supabase
      .from('content_blocks')
      .insert(block)
    
    if (error) {
      console.error(`Error inserting block "${block.title}":`, error)
    }
  }
  
  console.log('✅ Created Maya\'s document journey content')
  
  // Update lesson description
  await supabase
    .from('lessons')
    .update({
      description: "Maya conquers document creation, from grant proposals to board reports"
    })
    .eq('id', 6)
  
  // Step 3: Create content for Lessons 7 & 8
  console.log('\n📌 Step 3: Creating content for Lessons 7 & 8...')
  
  // Lesson 7: Meeting Master
  const lesson7Content = [
    {
      lesson_id: 7,
      title: "Maya's Meeting Mayhem",
      content: `Tuesday morning. Maya checks her calendar and her heart sinks. Five meetings today: staff check-in, volunteer orientation, budget committee, parent advisory, and emergency board session about the funding crisis.

Each meeting needs an agenda, materials, and clear objectives. Last month, she walked into the budget meeting unprepared and watched it derail into a 2-hour complaint session. The board chair's words still sting: "Maya, we need more structure in these discussions."

She's brilliant with people one-on-one, but meetings feel like herding cats while juggling flaming torches. The worst part? Most meetings end without clear decisions or next steps.

Today, that changes. Maya's about to discover AI meeting tools that transform chaos into productivity.`,
      order_index: 10,
      type: 'text'
    },
    {
      lesson_id: 7,
      title: "The Meeting Productivity Crisis",
      content: `Studies show nonprofit professionals spend 23 hours per week in meetings, with 71% rated as unproductive. For Maya, that's three full days lost to circular discussions and unclear outcomes.

The ripple effects are devastating: delayed decisions, frustrated teams, and missed opportunities. When meetings fail, missions suffer. Maya's volunteer retention has dropped 30% partly due to disorganized orientations that leave new helpers confused and uncommitted.

But what if every meeting had a clear agenda, engaged participants, and ended with concrete action items? What if Maya could lead meetings that people actually looked forward to?

The AI Meeting Master suite is about to make that transformation possible.`,
      order_index: 20,
      type: 'text'
    }
  ]
  
  // Lesson 8: Research Pro
  const lesson8Content = [
    {
      lesson_id: 8,
      title: "Maya's Information Overload",
      content: `With email tamed, documents flowing, and meetings productive, Maya faces her final frontier: the avalanche of information needed to run effective programs.

She needs to research best practices for youth mentorship, analyze competitor programs, synthesize community needs assessments, and stay current with grant opportunities. Her desktop has 47 browser tabs open, 23 PDFs downloaded, and sticky notes covering her monitor like digital wallpaper.

Last week, she spent 6 hours researching mentorship models, only to realize she'd gone down a rabbit hole that wasn't even relevant to her target age group. The information exists—she just can't organize and synthesize it efficiently.

Enter AI research tools designed to turn information chaos into strategic insights.`,
      order_index: 10,
      type: 'text'
    },
    {
      lesson_id: 8,
      title: "The Research Revolution",
      content: `Maya discovers AI research tools that transform how she gathers and processes information:

• **Research Assistant**: Synthesizes multiple sources into cohesive summaries
• **Information Summarizer**: Distills 50-page reports into 2-page actionable insights  
• **Project Planner**: Transforms research into structured implementation plans
• **Trend Identifier**: Spots patterns across data sources Maya would miss

These aren't just search engines—they're thinking partners that help Maya connect dots, identify opportunities, and make data-driven decisions. The same research that took days now takes hours, with better results.

Maya realizes she's completing her transformation: from overwhelmed administrator to strategic leader powered by AI.`,
      order_index: 20,
      type: 'text'
    }
  ]
  
  // Insert content for lessons 7 & 8
  for (const block of [...lesson7Content, ...lesson8Content]) {
    const { error } = await supabase
      .from('content_blocks')
      .insert(block)
    
    if (error) {
      console.error(`Error inserting block "${block.title}":`, error)
    }
  }
  
  console.log('✅ Created content for Lessons 7 & 8')
  
  // Step 4: Update lesson titles and descriptions
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
  
  for (const update of lessonUpdates) {
    await supabase
      .from('lessons')
      .update({
        title: update.title,
        description: update.description
      })
      .eq('id', update.id)
  }
  
  console.log('✅ Updated lesson metadata')
  
  // Step 5: Create continuity elements
  console.log('\n📌 Step 5: Adding story continuity...')
  
  // Add transition blocks between lessons
  const transitions = [
    {
      lesson_id: 5,
      title: "Ready for the Next Challenge",
      content: "With her inbox under control and relationships strengthened through better communication, Maya faces a new test. The grant proposal she's been avoiding can't wait any longer. But this time, she's ready with new AI tools...",
      order_index: 200,
      type: 'text'
    },
    {
      lesson_id: 6,
      title: "Momentum Building",
      content: "Grant submitted, board impressed, templates created. Maya's confidence soars as she realizes each AI tool builds on the last. Next up: those back-to-back meetings that used to derail her entire day...",
      order_index: 200,
      type: 'text'
    },
    {
      lesson_id: 7,
      title: "The Final Frontier",
      content: "Meetings transformed from time-wasters to decision-drivers. Maya has one more challenge: making sense of all the information needed to launch her youth mentorship program. Time to master research...",
      order_index: 200,
      type: 'text'
    },
    {
      lesson_id: 8,
      title: "Full Circle Transformation",
      content: "From Monday morning email dread to Friday afternoon strategic planning. Maya's journey shows what's possible when nonprofit professionals embrace AI as their productivity partner. Your transformation starts now...",
      order_index: 200,
      type: 'text'
    }
  ]
  
  for (const transition of transitions) {
    await supabase
      .from('content_blocks')
      .insert(transition)
  }
  
  console.log('✅ Added story continuity elements')
  
  // Final summary
  console.log('\n🎉 Chapter 2 Cleanup Complete!')
  console.log('\nWhat was done:')
  console.log('✅ Hidden all admin/debug tools')
  console.log('✅ Converted Lesson 6 from James to Maya\'s document journey')
  console.log('✅ Created full content for Lessons 7 & 8')
  console.log('✅ Updated all lesson titles and descriptions')
  console.log('✅ Added story continuity between lessons')
  console.log('\n📚 Chapter 2 now tells Maya\'s complete transformation story!')
}

cleanupChapter2().catch(console.error)