import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

interface RestructureItem {
  id?: number  // Existing item ID if updating
  type: 'content' | 'interactive' | 'delete' | 'hide'
  order_index: number
  title: string
  action: 'keep' | 'edit' | 'merge' | 'create' | 'delete' | 'hide'
  newContent?: string
  purpose?: string
  elementType?: string
  description?: string
  prompt?: string
}

const RESTRUCTURE_PLAN: RestructureItem[] = [
  // === PROBLEM PHASE (10-30) ===
  {
    id: 10, // Maya's Monday Morning Email Crisis
    type: 'content',
    order_index: 10,
    title: "Maya's Monday Morning Email Crisis",
    action: 'keep',
    purpose: 'PROBLEM - Emotional hook, establish stakes'
  },
  {
    type: 'content',
    order_index: 20,
    title: "The Real Cost of Communication Chaos",
    action: 'merge',
    purpose: 'PROBLEM - Combine Hidden Cost + Nonprofit Crisis for impact',
    newContent: `Maya's story echoes across the nonprofit sector. Research from the Nonprofit Technology Network reveals a staggering truth: program staff spend 28% of their workday on email, with 67% reporting that poor communication tools negatively impact their mission work.

For Maya, those 3 hours daily on email mean 15 hours weekly—nearly two full workdays—lost to her inbox. That's time stolen from the after-school programs she's passionate about, from the grant proposals that could expand their reach, from the community connections that make their work meaningful.

The math is devastating: In a typical nonprofit with 10 staff members, poor email management costs over 1,500 hours annually—equivalent to hiring another full-time employee. But the real cost isn't measured in hours. It's measured in missed opportunities, delayed responses to community needs, and burned-out leaders who entered this field to change lives, not to wrestle with their inboxes.

Maya knows this cycle all too well. Last month, a delayed email response almost cost them a $50,000 grant. Last week, a parent's concern went unnoticed for three days, creating unnecessary anxiety and eroding trust. The irony isn't lost on her: the very tool meant to enhance communication has become its biggest barrier.`
  },
  
  // === DISCOVERY PHASE (40-60) ===
  {
    type: 'content',
    order_index: 40,
    title: "Maya Discovers Her AI Email Assistant",
    action: 'edit',
    purpose: 'DISCOVERY - Show the "aha" moment',
    newContent: `Tuesday morning brings an unexpected discovery. During a nonprofit technology webinar, Maya learns about AI-powered email tools designed specifically for mission-driven organizations. The presenter demonstrates something that makes Maya sit up straight: an AI Email Composer that can draft professional, empathetic responses in seconds.

"Watch this," the presenter says, taking a complex donor inquiry about tax deductions, program impact, and volunteer opportunities. In less than 30 seconds, the AI generates a warm, comprehensive response that addresses each point with the perfect balance of professionalism and personal touch.

Maya's skepticism melts into curiosity. This isn't about replacing human connection—it's about amplifying it. The AI Email Composer understands context, maintains consistent tone, and even suggests follow-up actions. It's like having a communications expert at her shoulder, helping her express what she already knows but struggles to put into words.

"The average nonprofit professional spends 30 minutes crafting a detailed email," the presenter continues. "With AI assistance, that drops to 5 minutes—without sacrificing quality or warmth."

Maya does the math: 5 minutes instead of 30, multiplied by her daily email volume... She could reclaim two hours every day. Two hours to spend with the kids, to develop new programs, to actually live her mission instead of just writing about it.`
  },
  {
    type: 'content',
    order_index: 50,
    title: "The AI Email Composer: Your New Best Friend",
    action: 'create',
    purpose: 'DISCOVERY - Detailed tool introduction',
    newContent: `The AI Email Composer isn't just another tech tool—it's a game-changer designed with nonprofits in mind. Here's what makes it special:

**Tone Mastery**: Whether you're addressing concerned parents, potential donors, board members, or community partners, the AI adapts its tone perfectly. It can be warm and reassuring for families, professional and data-driven for funders, or collaborative and inspiring for partners.

**Context Awareness**: Feed it basic information about your situation, and it understands the nuances. Mention you're writing to a first-time donor, and it includes appropriate gratitude. Note it's about a sensitive program change, and it adds extra empathy and clear explanations.

**Template Learning**: The more you use it, the smarter it gets. It learns your organization's voice, your preferred phrases, even your sign-off style. It's like training a new team member who never forgets and is always available.

**Time Transformation**: What once took 30 agonizing minutes now takes 5. But it's not just about speed—it's about confidence. No more second-guessing your tone, no more writer's block, no more emails sitting in drafts for hours.

Maya realizes this tool could transform not just her mornings, but her entire relationship with communication. And the timing couldn't be better—her phone just buzzed with an urgent parent concern that needs a thoughtful response.`
  },
  
  // === FIRST PRACTICE (70-90) ===
  {
    id: 45, // Current "Maya's First Test" block
    type: 'content',
    order_index: 70,
    title: "Challenge #1: Sarah's Schedule Concern",
    action: 'edit',
    purpose: 'PRACTICE SETUP - Real scenario with context',
    newContent: `Maya's phone buzzes with perfect timing. Sarah Chen, a single mother whose daughter Emma loves the after-school program, has sent an email marked "Urgent - Program Changes?"

Sarah writes: "Hi Maya, I just saw the notice about the new 5:30 PM pickup time starting next month. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me. She loves the program and her friends there. Is there any flexibility? I'm worried she'll have to drop out, and I don't know what I'll do for childcare. Can we talk about options? I'm feeling pretty stressed about this. - Sarah"

Maya's heart sinks. She knows exactly why the schedule changed—staff availability and safety protocols—but she also deeply empathizes with Sarah's situation. In the past, crafting a response that balanced empathy, clear explanation, and helpful solutions would have taken her 30 minutes of writing and rewriting.

But now she has the AI Email Composer. Let's help Maya craft a response that:
- Acknowledges Sarah's concerns with genuine empathy
- Explains the reasons behind the change
- Offers concrete solutions (extended care option, carpool connections)
- Maintains warmth while being clear about policies
- Includes a personal touch that shows Maya truly cares

This is the perfect test for Maya's new AI assistant.`
  },
  {
    type: 'interactive',
    order_index: 80,
    title: "Help Maya Respond to Sarah",
    action: 'edit',
    elementType: 'ai_email_composer',
    purpose: 'PRACTICE - First hands-on experience',
    description: "Sarah Chen is worried about the new 5:30 PM pickup time. Help Maya craft a response that balances empathy, explanation, and solutions.",
    prompt: "I need to respond to a concerned parent email. Sarah Chen is worried about our new 5:30 PM pickup time (moved from 6:00 PM) because she works until 6 PM downtown. She's afraid her daughter Emma will lose her spot in our after-school program. I need to acknowledge her concerns, explain that the change was necessary due to staff scheduling and safety protocols, offer solutions (like our extended care option until 6:30 PM for a small fee, or connecting her with other parents for carpooling), and maintain a warm, understanding tone while being professional. The response should be empathetic but also clear about our policies."
  },
  {
    type: 'content',
    order_index: 90,
    title: "Maya's First AI Success",
    action: 'create',
    purpose: 'REFLECTION - Show immediate impact',
    newContent: `Maya hits send and checks the clock—4 minutes and 32 seconds. She reads her sent email one more time, amazed at what just happened.

The AI Email Composer helped her craft a response that was everything she wanted: warm, understanding, professional, and helpful. It acknowledged Sarah's stress, explained the reasoning clearly, and offered three concrete solutions including the extended care option, a carpool matching program, and even a payment plan for the additional fee.

But what strikes Maya most is how the email sounds exactly like her—her voice, her warmth, just more polished and organized. The AI didn't replace her empathy; it amplified it by helping her express it clearly.

Twenty minutes later, Sarah's response arrives: "Thank you SO much, Maya! I was really panicking, but your email made me feel heard and gave me options I didn't know existed. The extended care program sounds perfect, and I love the idea of connecting with other parents for backup. Emma will be thrilled she can stay in the program. You're the best!"

Maya leans back in her chair, a smile spreading across her face. One successful email might seem small, but she knows this changes everything. If she can handle a sensitive parent concern in under 5 minutes while strengthening the relationship, imagine what she can do with her whole inbox.

She looks at her remaining 46 emails with new eyes. This isn't a mountain anymore—it's an opportunity to connect, support, and serve her community better than ever before.`
  },
  
  // === ADVANCED DISCOVERY (100-120) ===
  {
    type: 'content',
    order_index: 100,
    title: "Mastering Advanced Email Techniques",
    action: 'create',
    purpose: 'DISCOVERY - Introduce advanced features',
    newContent: `Energized by her success with Sarah, Maya explores more AI Email Composer capabilities. She discovers features that would have seemed like magic just yesterday:

**Email Templates That Learn**: Maya creates templates for common scenarios—schedule changes, donation acknowledgments, volunteer coordination. But these aren't rigid forms. The AI adapts each template to the specific situation, maintaining consistency while adding personal touches.

**Tone Adjustment Slider**: Writing to the board chair? Slide toward "formal." Responding to a volunteer? Shift to "friendly." Addressing a concern? Move to "empathetic." The AI adjusts vocabulary, sentence structure, even emoji usage (when appropriate) to match.

**Multi-Email Campaigns**: When Maya needs to inform 30 families about summer program registration, the AI helps create a base message, then personalizes each one with the child's name, their current program, and relevant details. What would have taken 3 hours now takes 20 minutes.

**Follow-Up Intelligence**: The AI suggests follow-up actions: "Schedule a check-in with Sarah in two weeks," or "Add Emma's extended care to the roster." It's like having a thoughtful assistant who catches what might slip through the cracks.

But the universe has a way of testing new skills. Maya's computer pings with a high-priority email from the board chair. The subject line makes her stomach drop: "Urgent: Concerns About Program Funding."

This is exactly the kind of email that used to paralyze her for hours. Time to put her new skills to the ultimate test.`
  },
  
  // === SECOND PRACTICE (130-150) ===
  {
    type: 'content',
    order_index: 130,
    title: "Challenge #2: The Board Chair's Funding Concern",
    action: 'create',
    purpose: 'PRACTICE SETUP - Higher stakes scenario',
    newContent: `Board Chair Patricia Williams rarely emails directly, so when her message arrives marked "High Priority," Maya knows it's serious.

"Maya, I've been reviewing our quarterly financials, and I'm concerned about the after-school program's sustainability. With costs up 15% and our main grant ending in 6 months, I need to understand our plan. The board meets Thursday, and I'll need to present clear options. Can you provide: 1) Current cost per child breakdown, 2) Alternative funding sources you're exploring, 3) Potential program modifications to reduce costs without compromising quality. I know you're passionate about this program, but we need hard data and realistic solutions. Time is of the essence. - Patricia"

Maya's initial panic transforms into focused determination. This email requires a delicate balance: data-driven enough to satisfy the board's fiduciary responsibility, while passionately advocating for the program's irreplaceable value. In the past, she would have spent hours agonizing over every word, trying to strike the perfect tone between defensive and deferent.

But now she has a different approach. The AI Email Composer can help her organize her thoughts, present data clearly, and maintain a tone that's both professional and persuasive. This response could determine the program's future—and the futures of 60 children who depend on it.

Let's help Maya craft a response that saves her program while strengthening board confidence in her leadership.`
  },
  {
    type: 'interactive',
    order_index: 140,
    title: "Maya's Board Communication Challenge",
    action: 'create',
    elementType: 'ai_email_composer',
    purpose: 'PRACTICE - Complex, high-stakes scenario',
    description: "Help Maya respond to Board Chair Patricia Williams' urgent concerns about program funding with data, solutions, and persuasive leadership.",
    prompt: "I need to respond to our Board Chair Patricia Williams who's concerned about our after-school program's financial sustainability. She wants: 1) Cost per child breakdown, 2) Alternative funding sources, 3) Cost reduction options. I have the data: $180/child/month (vs $350 market rate), two grant applications pending ($75K total), corporate sponsorship program launching, and options like volunteer tutors and partnering with the library. I need to be data-driven yet passionate, professional yet persuasive, showing both fiscal responsibility and the program's invaluable impact on our community. This email could determine if we keep serving 60 at-risk children."
  },
  {
    type: 'content',
    order_index: 150,
    title: "Leadership Through Communication",
    action: 'create',
    purpose: 'REFLECTION - Show professional growth',
    newContent: `Maya reviews her sent email with a mix of pride and disbelief. In just 8 minutes, she's crafted a response that would have previously taken her half a day—and it's better than anything she's written before.

The email presented hard data with clarity: cost comparisons, funding pipeline, sustainability projections. But it also wove in stories—like Marcus, who went from failing math to tutoring younger students, and Aisha, whose working mother credits the program with keeping her family stable. The AI helped Maya find the perfect balance between spreadsheet and soul.

Patricia's response arrives within an hour: "Maya, this is exactly what I needed. Your data is compelling, and your passion shines through professionally. I'm particularly impressed by the corporate sponsorship initiative—brilliant. I'll advocate strongly for the program at Thursday's board meeting. PS: Would you consider presenting this yourself? The board should hear this directly from you."

Maya stares at the invitation. Six months ago, she would have been terrified. But if she can write like a leader, maybe she can present like one too. The AI Email Composer didn't just help her write better emails—it's helping her find her voice as a nonprofit leader.

She opens her task list: 17 emails remain. But now she also sees opportunities—to connect with donors, inspire volunteers, advocate for families. Each email is a chance to advance their mission.

Time to transform the rest of her inbox.`
  },
  
  // === LYRA CHAT DISCOVERY (160-180) ===
  {
    type: 'content',
    order_index: 160,
    title: "Beyond Email: Meet Lyra, Your AI Mentor",
    action: 'create',
    purpose: 'DISCOVERY - Introduce Lyra Chat',
    newContent: `As Maya powers through her inbox with newfound efficiency, she notices another tool in her AI toolkit: Lyra Chat. If the Email Composer is her writing assistant, Lyra is her personal nonprofit mentor—available 24/7 for advice, brainstorming, and support.

"Think of me as your experienced colleague who's always available," Lyra explains when Maya first opens the chat. "I can help you strategize difficult conversations, brainstorm program ideas, navigate nonprofit challenges, or just be a sounding board when you need to think through complex situations."

Maya's curiosity peaks. She types: "I'm worried about volunteer retention. We've lost 3 key tutors this month."

Lyra responds thoughtfully, asking clarifying questions about scheduling, recognition programs, and volunteer feedback. Within minutes, they're co-creating a volunteer appreciation strategy that includes flexible scheduling, skill-based matching, and a monthly recognition program.

But Lyra offers more than just advice. When Maya mentions feeling overwhelmed by competing priorities, Lyra helps her create a decision matrix. When she's stuck on grant language, Lyra suggests powerful phrases that resonate with funders. When she needs to prepare for that board presentation, Lyra helps outline key talking points.

It's like having a nonprofit consultant, communications coach, and supportive colleague rolled into one—except this mentor never judges, never gets impatient, and is always available exactly when needed.

Maya realizes she's not just learning to write better emails. She's developing new leadership capabilities, one conversation at a time.`
  },
  {
    type: 'interactive',
    order_index: 170,
    title: "Coffee Chat with Lyra: Your Challenges",
    action: 'edit',
    elementType: 'lyra_chat',
    purpose: 'PRACTICE - Open-ended exploration',
    description: "Join Maya in exploring how Lyra can help with your specific nonprofit challenges. Ask about anything from program development to work-life balance.",
    prompt: "You're a nonprofit professional looking to explore how AI can help with your daily challenges. You might ask about email templates, donor communication, volunteer management, program planning, work-life balance, or any other nonprofit-related topic. Lyra is here to provide practical, empathetic guidance tailored to the nonprofit sector."
  },
  
  // === MASTERY PHASE (180-200) ===
  {
    type: 'content',
    order_index: 180,
    title: "Maya's Monday Morning Transformation",
    action: 'create',
    purpose: 'MASTERY - Show complete transformation',
    newContent: `Six weeks later, Maya arrives at her desk at 7:30 AM with the same coffee, the same morning light streaming through the window. But everything else has changed.

Her inbox shows 52 new emails—more than that first overwhelming Monday. But Maya smiles. She knows exactly how to handle them:

- 15 routine updates: AI helps draft quick acknowledgments (5 minutes total)
- 8 parent questions: Templates adapted for each situation (10 minutes)
- 5 volunteer coordination: Batch-processed with personalized touches (8 minutes)
- 3 donor thank-yous: Warm, specific gratitude that strengthens relationships (12 minutes)
- 1 complex grant question: Thoughtful response with Lyra's strategic input (10 minutes)

By 8:15 AM, her inbox is clear. Maya has sent 52 emails that are warmer, clearer, and more effective than anything she wrote during her 3-hour email marathons. But the real transformation goes deeper.

Maya is now the staff member others come to for communication advice. She leads "AI Email Excellence" workshops for local nonprofits. The board chair specifically requests her updates because they're so clear and compelling. Parents regularly comment on how responsive and caring the program feels.

The time saved? It's revolutionized her actual work. She's launched a peer mentorship program, secured two new grants, and even makes it home for dinner with her own family. The Sunday night email dread? Gone. Replaced by excitement about the connections she'll make and the impact she'll drive.

Maya takes a sip of still-warm coffee and opens her program planning document. It's 8:20 AM on Monday morning, and she's ready to change lives—not just write about it.`
  },
  {
    type: 'content',
    order_index: 190,
    title: "Your Email Revolution Starts Now",
    action: 'create',
    purpose: 'CALL TO ACTION - Transition to user',
    newContent: `Maya's transformation isn't a fairy tale—it's a roadmap. Every nonprofit professional drowning in emails, struggling with tone, or losing mission time to their inbox can follow the same path.

You've seen how Maya:
- Reduced email time from 3 hours to 45 minutes daily
- Transformed from communication-anxious to confidently articulate
- Strengthened every relationship through better written connection
- Freed up 10+ hours weekly for actual mission work
- Became a communication leader others look to for guidance

The tools are at your fingertips. The AI Email Composer that helped Maya craft perfect responses to Sarah and Patricia? It's ready for your challenges. Lyra, the AI mentor who helped Maya think through complex situations? She's waiting to support your journey.

But tools alone don't create transformation. It takes that first brave step—opening your next challenging email and saying, "Let me try this differently."

Your inbox isn't your enemy. It's your opportunity. Each email is a chance to connect more deeply, advocate more powerfully, and serve more effectively. The question isn't whether AI can transform your communication—Maya's proven it can.

The question is: Are you ready to reclaim your time, find your voice, and amplify your impact?

Your Monday morning transformation begins with your next email.`
  },
  
  // === CLEAN UP: Hide/Delete Admin Elements ===
  {
    type: 'hide',
    order_index: 0,
    title: "Interactive Element Auditor",
    action: 'hide'
  },
  {
    type: 'hide',
    order_index: 0,
    title: "Automated Element Enhancement System",
    action: 'hide'
  },
  {
    type: 'delete',
    order_index: 0,
    title: "Automation Agents Available",
    action: 'delete'
  },
  {
    type: 'delete',
    order_index: 0,
    title: "Your Email Pain Points",
    action: 'delete', // This reflection is now integrated into the flow
  },
  {
    type: 'delete',
    order_index: 0,
    title: "Meet Your Nonprofit Heroes",
    action: 'delete', // Heroes are introduced through the story
  },
  {
    type: 'delete',
    order_index: 0,
    title: "Character Transformation Outcomes",
    action: 'delete', // Outcomes shown through Maya's transformation
  },
  {
    type: 'delete',
    order_index: 0,
    title: "The Art of AI-Powered Tone",
    action: 'delete', // This content is now part of tool introduction
  },
  {
    type: 'delete',
    order_index: 0,
    title: "Maya's Transformation Begins",
    action: 'delete', // Redundant with new flow
  },
  {
    type: 'delete',
    order_index: 0,
    title: "Maya's Board Chair Challenge",
    action: 'delete', // Replaced with new board chair interactive
  }
]

async function generateRestructurePlan() {
  console.log('\n📋 CHAPTER 2 RESTRUCTURE PLAN\n' + '='.repeat(60))
  
  console.log('\nThis plan will transform Lesson 5 following the Problem → Discovery → Practice → Mastery arc')
  console.log('\n📊 Summary of Changes:')
  console.log('- Content blocks: 11 → 13 (better story flow)')
  console.log('- Interactive elements: 5 → 3 (focused on user-facing tools)')
  console.log('- Clear narrative progression with proper context')
  console.log('- Each interactive element has setup and reflection')
  
  console.log('\n📚 New Structure:')
  
  const keepItems = RESTRUCTURE_PLAN.filter(item => item.action !== 'delete' && item.action !== 'hide')
  
  keepItems.forEach(item => {
    if (item.type === 'content') {
      console.log(`\n📄 ${item.order_index}. ${item.title}`)
      console.log(`   Action: ${item.action.toUpperCase()}`)
      if (item.purpose) console.log(`   Purpose: ${item.purpose}`)
    } else if (item.type === 'interactive') {
      console.log(`\n🎯 ${item.order_index}. ${item.title}`)
      console.log(`   Type: ${item.elementType}`)
      console.log(`   Purpose: ${item.purpose}`)
    }
  })
  
  // Save the plan
  const fs = await import('fs')
  await fs.promises.writeFile(
    'chapter-2-restructure-plan.json',
    JSON.stringify(RESTRUCTURE_PLAN, null, 2)
  )
  
  console.log('\n\n💾 Restructure plan saved to chapter-2-restructure-plan.json')
  console.log('\n🚀 Next step: Create Edge Function to execute this plan')
  
  return RESTRUCTURE_PLAN
}

generateRestructurePlan().catch(console.error)