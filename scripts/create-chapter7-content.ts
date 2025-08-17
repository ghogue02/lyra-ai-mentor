import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createChapter7Content() {
  console.log('Creating Chapter 7: AI-Powered People Management content...');

  // Lesson 1: Bias-Free Performance Excellence
  const lesson1Content = [
    {
      lesson_id: 71,
      title: "Carmen's Performance Review Crisis",
      content: "Dr. Carmen Rodriguez stares at the stack of performance review templates scattered across her desk, each one different from the last. It's 8 PM on a Tuesday, and she's been wrestling with the same problem for months: how do you fairly evaluate 45 diverse team members when every manager seems to have their own interpretation of 'meets expectations'?\n\nThree hours ago, she received another complaint from Jamie, a talented program coordinator who felt blindsided by their 'needs improvement' rating. 'I had no idea my communication skills were an issue,' Jamie had said, frustration clear in their voice. 'My last manager always said I was great at keeping everyone informed.'\n\nCarmen knows Jamie is right to be frustrated. When she reviewed the feedback, she found subjective comments like 'could be more proactive' and 'sometimes seems overwhelmed' – observations that revealed more about the reviewer's biases than Jamie's actual performance. Meanwhile, another coordinator with nearly identical responsibilities received 'exceeds expectations' from a different manager for virtually the same work.\n\nThis inconsistency isn't just unfair to her team – it's creating real problems. Carmen has lost three promising staff members in the past six months, each citing unclear expectations and inconsistent feedback as reasons for leaving. The exit interviews revealed a troubling pattern: high-performing women and team members of color were more likely to receive vague, critical feedback compared to their peers.",
      type: "text",
      order_index: 10,
      metadata: {
        character: "carmen"
      }
    },
    {
      lesson_id: 71,
      title: "The Real Cost of Biased Performance Management",
      content: "Carmen's challenges reflect a sector-wide crisis in nonprofit performance management. Recent research by the Nonprofit Quarterly reveals that **76% of nonprofit employees** report receiving unclear or inconsistent performance feedback, with marginalized groups disproportionately affected.\n\nThe financial impact is staggering:\n\n• **Turnover costs** average $15,000 per departing employee\n• **Productivity loss** from unclear expectations reduces team output by 23%\n• **Legal risks** from biased reviews cost nonprofits an average of $75,000 annually in settlements\n• **Mission impact** suffers as organizations lose institutional knowledge and community connections\n\nBeyond the numbers lies a deeper truth: biased performance management undermines the very values nonprofits champion. How can an organization advocate for equity externally while perpetuating unfair practices internally?\n\nThe traditional approach of annual reviews with subjective ratings has failed to create the development-focused, equitable workplace that both employees and missions deserve. Carmen needs a fundamental transformation in how performance is measured, discussed, and improved – one that removes bias while actually helping her team members grow and thrive.",
      type: "callout_box",
      order_index: 20,
      metadata: {
        variant: "warning",
        title: "The Performance Management Crisis"
      }
    },
    {
      lesson_id: 71,
      title: "Carmen Discovers AI-Powered Performance Frameworks",
      content: "Everything changed for Carmen at the National Nonprofit HR Conference when she attended a session titled 'Beyond Bias: AI-Enhanced Performance Management.' The presenter, Dr. Sarah Kim from TechForGood Solutions, shared case studies of organizations that had transformed their performance cultures using competency-based frameworks powered by artificial intelligence.\n\n'The key insight,' Dr. Kim explained, 'is that AI doesn't replace human judgment – it enhances it by providing structure, consistency, and data-driven insights that remove unconscious bias from the equation.'\n\nCarmen learned about organizations using AI to:\n\n• **Standardize evaluation criteria** across all roles and managers\n• **Analyze feedback patterns** to identify and correct bias in real-time\n• **Generate development plans** tailored to individual growth opportunities\n• **Track progress objectively** using measurable competencies instead of subjective impressions\n\nThe most compelling example was CityCare Nonprofit, similar in size to Carmen's organization. After implementing AI-powered performance management:\n\n• Employee retention increased by **34%**\n• Performance clarity scores jumped from 2.3 to 4.7 out of 5\n• Development goal completion rates reached **89%**\n• Bias complaints dropped to **zero**\n\n'The best part,' shared CityCare's HR Director, 'is that our managers actually enjoy performance conversations now. Instead of dreading awkward annual reviews, they're having meaningful development discussions throughout the year.'",
      type: "text",
      order_index: 40,
      metadata: {
        character: "carmen"
      }
    },
    {
      lesson_id: 71,
      title: "AI Performance Frameworks: Your Bias-Free Foundation",
      content: "AI-powered performance management transforms subjective reviews into objective, growth-focused conversations. These intelligent systems create consistency, fairness, and development opportunities that traditional methods simply cannot match.\n\n**Core Capabilities:**\n\n• **Competency-Based Frameworks**: Define clear, measurable skills and behaviors specific to each role\n• **Bias Detection**: Identify language patterns and rating disparities that indicate unconscious bias\n• **360-Degree Integration**: Synthesize feedback from multiple sources while maintaining anonymity\n• **Development Planning**: Generate personalized growth pathways based on individual strengths and goals\n• **Progress Tracking**: Monitor improvement over time with data-driven insights\n\n**For Nonprofit Leaders:**\n\n• **Compliance Confidence**: Ensure all evaluations meet legal and ethical standards\n• **Cultural Alignment**: Build frameworks that reflect your organization's values and mission\n• **Manager Support**: Provide tools and guidance that make difficult conversations easier\n• **Data-Driven Decisions**: Base promotions and development on objective performance data\n\n**Common Concerns Addressed:**\n\n*'Will AI make performance reviews feel impersonal?'* – AI enhances human connection by providing structure for meaningful conversations and removing anxiety about fairness.\n\n*'What about creativity and soft skills?'* – Modern frameworks excel at measuring collaboration, innovation, and cultural fit through behavioral indicators.\n\n*'Is this too complex for smaller nonprofits?'* – AI platforms scale to any organization size, often simplifying the process compared to manual systems.",
      type: "callout_box",
      order_index: 50,
      metadata: {
        variant: "info",
        title: "Understanding AI Performance Systems"
      }
    },
    {
      lesson_id: 71,
      title: "Challenge #1: Building Your Performance Framework",
      content: "Carmen faces her first practical test: creating a competency-based performance framework for her program coordinators that removes bias and focuses on development. She needs to transform vague job descriptions into clear, measurable performance standards that any manager can apply consistently.\n\nThe challenge is complex: program coordinators wear many hats, from direct service delivery to community outreach to data collection. Previous reviews relied on subjective impressions like 'team player' or 'goes above and beyond' – language that often masked unconscious bias.\n\nCarmen must design a framework that:\n\n• **Measures what matters**: Focus on competencies that directly impact mission outcomes\n• **Eliminates ambiguity**: Define behaviors so clearly that different managers would rate the same performance identically\n• **Promotes growth**: Identify specific development opportunities rather than just highlighting problems\n• **Reflects values**: Ensure the framework aligns with the organization's commitment to equity and inclusion\n\nShe has 90 minutes before her meeting with the program director to present a prototype. The new framework needs to be comprehensive enough to guide fair evaluations while being simple enough for busy managers to use effectively.\n\nThis is Carmen's opportunity to prove that AI-enhanced performance management can work in their real-world nonprofit environment.",
      type: "text",
      order_index: 70,
      metadata: {
        character: "carmen"
      }
    }
  ];

  const lesson1Interactive = [
    {
      lesson_id: 71,
      title: "Performance Framework Builder",
      content: "Work with Carmen to build a comprehensive, bias-free performance evaluation framework for nonprofit program coordinators. This AI-powered tool will help you create measurable competencies, clear behavioral indicators, and development-focused criteria that eliminate subjective bias while promoting meaningful growth conversations.",
      type: "ai_content_generator",
      order_index: 80,
      configuration: {
        generationType: "performance_framework",
        aiInstructions: "Generate a comprehensive performance evaluation framework for nonprofit program coordinators. Include:\n\n1. CORE COMPETENCIES (5-7 key areas):\n   - Technical skills specific to program delivery\n   - Communication and stakeholder engagement\n   - Data collection and analysis capabilities\n   - Problem-solving and adaptability\n   - Mission alignment and values demonstration\n   - Collaboration and teamwork\n   - Professional development and growth mindset\n\n2. BEHAVIORAL INDICATORS for each competency:\n   - Specific, observable behaviors that demonstrate the competency\n   - Measurable actions that can be objectively assessed\n   - Examples of what 'meets expectations' vs 'exceeds expectations' looks like\n\n3. DEVELOPMENT FOCUS:\n   - Growth opportunities for each competency level\n   - Specific action steps for improvement\n   - Resources and support for skill building\n\n4. BIAS-REDUCTION FEATURES:\n   - Objective criteria that minimize subjective interpretation\n   - Inclusive language that doesn't favor particular communication styles\n   - Clear rating scales with specific examples\n\n5. CONVERSATION STARTERS:\n   - Questions managers can ask to facilitate development discussions\n   - Ways to connect individual growth to organizational mission\n   - Strategies for addressing performance gaps supportively\n\nFormat as a practical framework document with clear sections, actionable criteria, and easy-to-use rating scales. Include examples and implementation guidance.",
        fields: [
          {
            name: "position_title",
            label: "Position Title",
            type: "select",
            options: [
              "Program Coordinator",
              "Community Outreach Coordinator", 
              "Case Manager",
              "Youth Program Specialist",
              "Direct Service Provider",
              "Program Assistant",
              "Client Advocate",
              "Education Coordinator"
            ],
            placeholder: "Select the role to evaluate"
          },
          {
            name: "organization_focus",
            label: "Organization Focus Area",
            type: "select", 
            options: [
              "Social Services & Human Services",
              "Education & Youth Development",
              "Health & Wellness",
              "Housing & Homelessness",
              "Environmental Conservation",
              "Arts & Culture",
              "Community Development",
              "Advocacy & Policy",
              "Food Security & Nutrition",
              "Mental Health & Substance Abuse"
            ],
            placeholder: "Select your organization's primary focus"
          },
          {
            name: "team_size",
            label: "Team Size",
            type: "select",
            options: [
              "Small team (2-5 coordinators)",
              "Medium team (6-15 coordinators)", 
              "Large team (16+ coordinators)",
              "Multi-site team",
              "Individual contributor role"
            ],
            placeholder: "Select team structure"
          },
          {
            name: "key_challenges",
            label: "Current Performance Management Challenges",
            type: "select",
            options: [
              "Inconsistent ratings between managers",
              "Unclear expectations and job descriptions",
              "Bias in evaluation criteria",
              "Lack of development planning",
              "Difficult performance conversations",
              "Low employee satisfaction with reviews",
              "Turnover after negative evaluations",
              "Subjective feedback without examples"
            ],
            placeholder: "Select primary challenge to address"
          },
          {
            name: "evaluation_frequency",
            label: "Evaluation Frequency",
            type: "select",
            options: [
              "Annual reviews only",
              "Semi-annual reviews", 
              "Quarterly check-ins",
              "Monthly progress meetings",
              "Continuous feedback model",
              "Project-based evaluations"
            ],
            placeholder: "Select desired review schedule"
          }
        ],
        characterPerspective: "Carmen Rodriguez, HR Director with expertise in bias-free performance management systems"
      },
      is_active: true,
      is_visible: true
    }
  ];

  // Insert content blocks
  for (const block of lesson1Content) {
    const { error } = await supabase
      .from('content_blocks')
      .insert(block);
    
    if (error) {
      console.error('Error inserting content block:', error);
    } else {
      console.log(`Inserted content block: ${block.title}`);
    }
  }

  // Insert interactive elements
  for (const element of lesson1Interactive) {
    const { error } = await supabase
      .from('interactive_elements')
      .insert(element);
    
    if (error) {
      console.error('Error inserting interactive element:', error);
    } else {
      console.log(`Inserted interactive element: ${element.title}`);
    }
  }

  console.log('Chapter 7 Lesson 1 content creation completed!');
}

// Run the script
createChapter7Content().catch(console.error);