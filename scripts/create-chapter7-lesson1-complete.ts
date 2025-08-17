import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createLesson1Complete() {
  console.log('Creating remaining Lesson 1 content...');

  // Continue from order_index 90
  const remainingContent = [
    {
      lesson_id: 71,
      title: "Carmen's Framework Success",
      content: "Carmen's hands trembled slightly as she opened her laptop to present the performance framework she'd built using AI assistance. The program director, Marcus, had been skeptical about moving away from their traditional rating system, but Carmen was confident this new approach would address their persistent evaluation problems.\n\n'Here's what we created,' Carmen began, sharing her screen. 'Instead of vague categories like 'communication skills,' we now have specific competencies with clear behavioral indicators.'\n\nMarcus leaned forward as Carmen walked through the framework:\n\n**Technical Program Delivery**: *'Demonstrates proficiency in case management software, maintains accurate client records, and meets documentation deadlines 95% of the time'*\n\n**Stakeholder Engagement**: *'Builds rapport with clients within first two meetings, receives positive feedback from 80% of community partners, and effectively navigates difficult conversations'*\n\n**Mission Alignment**: *'Consistently demonstrates organizational values in client interactions, advocates for social justice in program delivery, and connects individual work to broader organizational goals'*\n\n'This is remarkable,' Marcus said, scrolling through the detailed criteria. 'For the first time, I can see exactly what good performance looks like in every area. And look at these development suggestions – they're actually actionable.'\n\nCarmen felt a surge of relief and excitement. The AI-powered framework had transformed abstract concepts into concrete, measurable standards that would ensure every coordinator received fair, consistent evaluation regardless of who their manager was.",
      type: "text",
      order_index: 90,
      metadata: {
        character: "carmen"
      }
    },
    {
      lesson_id: 71,
      title: "Advanced Performance Analytics",
      content: "With the basic framework established, Carmen discovers how AI can provide ongoing insights into performance patterns and development opportunities. These advanced tools transform performance management from a once-a-year event into a continuous improvement system.\n\n**Key Advanced Features:**\n\n• **Trend Analysis**: Track performance patterns over time to identify improvement trajectories and potential issues\n• **Bias Detection**: Algorithmic analysis of feedback language to flag potentially biased evaluations\n• **Development Matching**: AI recommendations for training, mentoring, and growth opportunities based on individual performance data\n• **Peer Comparison**: Anonymous benchmarking against similar roles to ensure fair expectations\n• **Predictive Insights**: Early warning systems for performance decline or flight risk\n\n**Implementation Strategies:**\n\n• **Continuous Feedback Loops**: Quarterly mini-reviews using consistent competency frameworks\n• **360-Degree Integration**: Structured input from clients, colleagues, and supervisors\n• **Goal Tracking**: Automated progress monitoring for development objectives\n• **Manager Training**: AI-powered coaching for supervisors on conducting effective performance conversations\n\n**Organizational Benefits:**\n\n• **Legal Protection**: Consistent, documented evaluation processes reduce discrimination risk\n• **Employee Satisfaction**: Clear expectations and fair treatment improve retention\n• **Mission Impact**: Better performance management leads to improved program outcomes\n• **Efficiency Gains**: Automated insights save managers time while improving review quality",
      type: "callout_box",
      order_index: 100,
      metadata: {
        variant: "info",
        title: "Continuous Performance Excellence"
      }
    },
    {
      lesson_id: 71,
      title: "Challenge #2: 360-Degree Feedback Integration",
      content: "Six weeks after implementing the competency framework, Carmen faces her next challenge: integrating comprehensive 360-degree feedback into the performance system. The initial framework addressed manager bias, but Carmen realizes she needs input from multiple perspectives to create truly fair evaluations.\n\nThe complexity is significant: program coordinators interact with clients, community partners, peer staff members, and volunteers. Each group sees different aspects of performance, and Carmen needs to gather their insights while maintaining confidentiality and avoiding feedback fatigue.\n\nTraditional 360-degree reviews have failed at her organization because:\n\n• **Survey fatigue**: Long questionnaires with low response rates\n• **Inconsistent feedback**: Different reviewers focusing on different aspects\n• **Anonymous concerns**: Fear of retaliation preventing honest input\n• **Manager overwhelm**: Too much raw feedback data to synthesize effectively\n\nCarmen's new challenge is to design a 360-degree system that:\n\n• **Gathers meaningful input** from diverse stakeholders efficiently\n• **Maintains anonymity** while ensuring feedback quality\n• **Synthesizes insights** automatically into actionable development plans\n• **Identifies patterns** across multiple feedback sources to reveal true performance strengths and gaps\n\nShe has three weeks to pilot this enhanced system with five program coordinators before rolling it out organization-wide. The success of this pilot will determine whether her performance transformation continues or stalls.",
      type: "text",
      order_index: 130,
      metadata: {
        character: "carmen"
      }
    }
  ];

  const remainingInteractive = [
    {
      lesson_id: 71,
      title: "360-Degree Feedback Optimizer",
      content: "Partner with Carmen to design a comprehensive 360-degree feedback system that gathers meaningful insights from multiple stakeholders while maintaining anonymity and reducing survey fatigue. This AI tool will help you create targeted feedback forms, synthesize diverse perspectives, and generate actionable development insights.",
      type: "document_improver",
      order_index: 140,
      configuration: {
        improvementType: "feedback_system",
        aiInstructions: "Analyze the provided performance framework and create an optimized 360-degree feedback system. Provide:\n\n1. STAKEHOLDER-SPECIFIC FEEDBACK FORMS:\n   - Tailored questions for clients/service recipients\n   - Peer evaluation criteria focused on collaboration\n   - Supervisor assessment areas\n   - Community partner feedback forms\n   - Volunteer/intern perspectives\n\n2. FEEDBACK SYNTHESIS FRAMEWORK:\n   - Automated analysis of common themes\n   - Pattern identification across multiple sources\n   - Bias detection in feedback language\n   - Conflict resolution when feedback differs significantly\n\n3. ANONYMITY AND SAFETY MEASURES:\n   - Secure feedback collection processes\n   - Minimum response requirements for anonymity\n   - Guidelines for handling sensitive feedback\n   - Protections against retaliation\n\n4. ACTIONABLE INSIGHTS GENERATION:\n   - Development priority identification\n   - Strength recognition across multiple perspectives\n   - Specific improvement recommendations\n   - Goal-setting guidance based on feedback patterns\n\n5. IMPLEMENTATION TIMELINE:\n   - Rollout schedule for different stakeholder groups\n   - Training requirements for feedback providers\n   - Quality assurance checkpoints\n   - Continuous improvement mechanisms\n\nFormat as a complete 360-degree feedback implementation guide with forms, processes, and analysis frameworks ready for immediate use.",
        fields: [
          {
            name: "primary_stakeholders",
            label: "Primary Stakeholders",
            type: "select",
            options: [
              "Clients/Service Recipients",
              "Community Partners & Vendors",
              "Peer Staff Members",
              "Volunteers & Interns",
              "Board Members",
              "Supervisors & Managers",
              "External Collaborators",
              "Funding Partners"
            ],
            placeholder: "Select main feedback providers"
          },
          {
            name: "feedback_frequency",
            label: "Feedback Collection Frequency",
            type: "select",
            options: [
              "Annual comprehensive review",
              "Semi-annual feedback cycles",
              "Quarterly pulse surveys",
              "Project-based feedback",
              "Continuous rolling feedback",
              "Event-triggered feedback"
            ],
            placeholder: "Select feedback timing"
          },
          {
            name: "anonymity_level",
            label: "Anonymity Requirements",
            type: "select",
            options: [
              "Fully anonymous feedback only",
              "Optional anonymous with identified option",
              "Semi-anonymous (role-based identification)",
              "Transparent feedback with names",
              "Mixed approach by stakeholder type"
            ],
            placeholder: "Select anonymity approach"
          }
        ],
        characterPerspective: "Carmen Rodriguez, HR Director implementing comprehensive performance management systems"
      },
      is_active: true,
      is_visible: true
    },
    {
      lesson_id: 71,
      title: "Carmen's Performance Innovation Chat",
      content: "Discuss your organization's unique performance management challenges with Carmen Rodriguez. She'll help you adapt AI-powered frameworks, address specific evaluation concerns, and create development-focused systems that work for your team's culture and mission.",
      type: "lyra_chat",
      order_index: 170,
      configuration: {
        chatType: "persistent",
        blockingEnabled: true,
        context: {
          character: "Carmen Rodriguez",
          role: "HR Director & Performance Management Expert",
          expertise: [
            "Bias-free performance evaluation systems",
            "Competency-based frameworks",
            "360-degree feedback implementation",
            "AI-powered performance analytics",
            "Development-focused conversations",
            "Legal compliance in evaluations",
            "Manager training and support",
            "Employee retention strategies"
          ],
          personality: "Strategic, empathetic, data-driven, and passionate about creating fair workplace practices",
          context: "After successfully implementing AI-powered performance frameworks that eliminated bias and improved employee satisfaction, Carmen helps other nonprofit leaders transform their evaluation systems."
        }
      },
      is_active: true,
      is_visible: true
    }
  ];

  const finalContent = [
    {
      lesson_id: 71,
      title: "Leadership Through Fair Performance Management",
      content: "Three months after implementing the AI-powered performance system, Carmen reviews the transformation data with amazement. The numbers tell a powerful story of organizational change:\n\n**Measurable Improvements:**\n• **Employee satisfaction** with performance reviews increased from 2.1 to 4.6 out of 5\n• **Manager confidence** in conducting evaluations jumped by 78%\n• **Development goal completion** rates reached 91% (up from 34%)\n• **Performance-related turnover** dropped to zero\n• **Bias complaints** eliminated entirely\n• **Time spent on reviews** decreased by 40% while quality improved dramatically\n\nBut the real transformation goes beyond metrics. Carmen observes fundamental shifts in workplace culture:\n\nManagers now approach performance conversations with confidence rather than dread. 'I actually look forward to these meetings now,' shares Marcus. 'Instead of delivering criticism, I'm coaching growth. The AI framework gives me specific examples and development suggestions that make every conversation productive.'\n\nEmployees express newfound trust in the evaluation process. 'For the first time, I know exactly what success looks like in my role,' says Jamie, the program coordinator who had initially felt blindsided by subjective feedback. 'The development plan from my 360-degree review has helped me grow in ways I never expected.'\n\nCarmen realizes that fair performance management isn't just an HR function – it's a leadership imperative that directly impacts mission effectiveness. When people feel valued, understood, and supported in their growth, they bring their best selves to serving the community.\n\nThe ripple effects extend beyond individual performance. Teams collaborate more effectively when everyone understands their roles and contributions. Client outcomes improve when staff receive consistent, development-focused support. The organization's reputation for being a great place to work attracts higher-quality candidates who want to grow their careers while making a difference.",
      type: "text",
      order_index: 180,
      metadata: {
        character: "carmen"
      }
    },
    {
      lesson_id: 71,
      title: "Your Performance Excellence Journey Starts Now",
      content: "Carmen's transformation from subjective, biased performance reviews to AI-powered, development-focused evaluation systems demonstrates what's possible when nonprofit leaders embrace innovative HR practices. You now have the tools and frameworks to create similar changes in your organization.\n\n**What You've Accomplished:**\n\n✓ **Built competency-based frameworks** that eliminate subjective bias\n✓ **Designed 360-degree feedback systems** that gather meaningful insights\n✓ **Created development-focused processes** that support employee growth\n✓ **Established fair evaluation standards** that protect both employees and organization\n✓ **Implemented AI tools** that make performance management efficient and effective\n\n**Your Next Steps:**\n\n1. **Audit current practices**: Identify bias patterns and inconsistencies in your evaluation processes\n2. **Pilot with one team**: Test your new framework with a small group before organization-wide rollout\n3. **Train managers**: Ensure supervisors understand and can effectively use the new competency-based approach\n4. **Gather feedback**: Continuously improve the system based on employee and manager input\n5. **Track outcomes**: Monitor retention, satisfaction, and development metrics to measure success\n\n**Remember:** Fair performance management is not just about compliance or efficiency – it's about creating workplaces where people can thrive while advancing your mission. When you remove bias and focus on development, you unlock human potential that directly translates to greater community impact.\n\nYour team is waiting for leadership that values their growth as much as their contributions. The frameworks you've built today are the foundation for tomorrow's high-performing, mission-driven culture.",
      type: "callout_box",
      order_index: 190,
      metadata: {
        variant: "success",
        title: "Leading Performance Excellence"
      }
    }
  ];

  // Insert all remaining content
  for (const block of [...remainingContent, ...finalContent]) {
    const { error } = await supabase
      .from('content_blocks')
      .insert(block);
    
    if (error) {
      console.error('Error inserting content block:', error);
    } else {
      console.log(`Inserted content block: ${block.title}`);
    }
  }

  // Insert remaining interactive elements
  for (const element of remainingInteractive) {
    const { error } = await supabase
      .from('interactive_elements')
      .insert(element);
    
    if (error) {
      console.error('Error inserting interactive element:', error);
    } else {
      console.log(`Inserted interactive element: ${element.title}`);
    }
  }

  console.log('Lesson 1 complete content creation finished!');
}

// Run the script
createLesson1Complete().catch(console.error);