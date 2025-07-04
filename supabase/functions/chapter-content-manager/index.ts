import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, data } = await req.json()

    switch (action) {
      case 'hide-admin-elements': {
        // Hide admin tools across specified lessons
        const { lessonIds, elementTypes } = data
        
        const { error } = await supabase
          .from('interactive_elements')
          .update({ is_active: false })
          .in('type', elementTypes)
          .in('lesson_id', lessonIds)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, message: 'Admin elements hidden' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'delete-james-content': {
        // Delete all James-related content from lesson 6
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
        }
        
        return new Response(
          JSON.stringify({ success: true, message: `Deleted ${jamesBlocks?.length || 0} James-related blocks` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'update-lesson-metadata': {
        // Update lesson titles and descriptions
        const { lessons } = data
        
        for (const lesson of lessons) {
          await supabase
            .from('lessons')
            .update({
              title: lesson.title,
              description: lesson.description
            })
            .eq('id', lesson.id)
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Lesson metadata updated' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'add-maya-content': {
        // Add Maya's content for lessons 6, 7, 8
        const contentBlocks = [
          // Lesson 6: Document Creation
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
          },
          // Lesson 7: Meeting Master
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
          },
          // Lesson 8: Research Pro
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
        
        // Delete existing content and insert new
        for (const block of contentBlocks) {
          await supabase
            .from('content_blocks')
            .insert(block)
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Maya content added successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'add-story-transitions': {
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
        
        return new Response(
          JSON.stringify({ success: true, message: 'Story transitions added' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'add-interactive-elements': {
        // Add interactive elements for Maya's journey
        const { elements } = data
        
        for (const element of elements) {
          await supabase
            .from('interactive_elements')
            .insert(element)
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Interactive elements added' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'fix-element-visibility': {
        // Fix element visibility issues in Chapter 2
        const { deactivateElements, reorderElements } = data
        
        // Deactivate specified elements
        if (deactivateElements && deactivateElements.length > 0) {
          for (const elementId of deactivateElements) {
            await supabase
              .from('interactive_elements')
              .update({ is_active: false, order_index: 9999 })
              .eq('id', elementId)
          }
        }
        
        // Reorder Maya elements
        if (reorderElements && reorderElements.length > 0) {
          for (const update of reorderElements) {
            await supabase
              .from('interactive_elements')
              .update({ 
                is_active: true, 
                order_index: update.order_index 
              })
              .eq('id', update.id)
          }
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Element visibility fixed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})