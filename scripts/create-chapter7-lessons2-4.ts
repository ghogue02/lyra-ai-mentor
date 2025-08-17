import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createLessons2Through4() {
  console.log('Creating Lessons 2-4 content...');

  const allContent = [
    // LESSON 2: Mission-Aligned Talent Acquisition
    {
      lesson_id: 72,
      title: "Carmen's Recruitment Nightmare",
      content: "Carmen stares at her computer screen in disbelief. After three months of recruiting for two program coordinator positions, she has a stack of resumes from overqualified candidates who 'want to make a difference' but show no understanding of their organization's actual work, and a handful of passionate applicants who lack the technical skills needed for the role.\n\nThe statistics are sobering: 247 applications, 23 interviews, 3 job offers, and 2 declined offers citing 'unclear role expectations' and 'concerns about organizational culture fit.' The one hire lasted only six weeks before leaving for a position that 'better aligned with their values.'\n\nWorse yet, Carmen knows her recruitment process is perpetuating the very inequities her organization fights against. The job descriptions, crafted hastily from outdated templates, use language that research shows deters women and people of color from applying. The interview process relies heavily on 'culture fit' assessments that often mask unconscious bias. And the lengthy hiring timeline has cost them several diverse candidates who accepted offers elsewhere while waiting for decisions.\n\n'We're supposed to be experts at serving our community,' Carmen reflects, 'but we can't even figure out how to find people who share our mission and have the skills to succeed here.' The irony isn't lost on her that an organization dedicated to equity and inclusion struggles to create an equitable and inclusive hiring process.",
      type: "text",
      order_index: 10,
      metadata: { character: "carmen" }
    },
    {
      lesson_id: 72,
      title: "The Nonprofit Talent Crisis",
      content: "Carmen's recruitment struggles reflect a sector-wide crisis that threatens organizational sustainability and mission impact. Recent data from the National Council of Nonprofits reveals alarming trends:\n\n**Recruitment Challenges:**\n• **68% of nonprofits** report difficulty finding qualified candidates\n• **Average time-to-hire** has increased to 89 days (vs. 52 days in private sector)\n• **Diversity in hiring** lags significantly, with leadership positions 78% white despite diverse communities served\n• **Candidate drop-off rate** exceeds 45% during lengthy recruitment processes\n\n**The Hidden Costs:**\n• **Vacant position impact**: Each unfilled role reduces organizational capacity by an estimated 23%\n• **Hiring mistakes**: Poor cultural fit leads to turnover costs averaging $24,000 per departure\n• **Opportunity cost**: Time spent on ineffective recruitment could be invested in mission-critical work\n• **Reputation damage**: Negative candidate experiences harm organizational brand and future recruitment\n\n**Root Causes:**\n• **Outdated job descriptions** that emphasize requirements over impact\n• **Unconscious bias** in screening and interview processes\n• **Unclear value propositions** that fail to communicate mission alignment opportunities\n• **Inefficient processes** that lose quality candidates to more responsive employers\n\nThe challenge isn't just finding people who can do the work – it's identifying individuals who will thrive in nonprofit culture while bringing diverse perspectives that strengthen mission impact.",
      type: "callout_box",
      order_index: 20,
      metadata: { variant: "warning", title: "The Recruitment Crisis" }
    },
    {
      lesson_id: 72,
      title: "Carmen Discovers AI-Enhanced Recruitment",
      content: "Carmen's breakthrough came during a webinar hosted by the Nonprofit Technology Network on 'AI-Powered Recruitment for Mission-Driven Organizations.' The presenter showcased how organizations were using artificial intelligence to attract diverse, passionate candidates while streamlining their hiring processes.\n\n'The key insight,' explained the facilitator, 'is that AI doesn't just automate recruitment – it helps you recruit more intentionally by removing bias, improving job description language, and identifying candidates who truly align with your mission.'\n\nCarmen learned about groundbreaking applications:\n\n**Inclusive Job Description Optimization**: AI analysis of posting language to remove biased terms and add inclusive messaging that attracts diverse candidates\n\n**Cultural Alignment Assessment**: Sophisticated screening tools that evaluate mission fit beyond surface-level responses\n\n**Bias-Resistant Interview Design**: Structured interview frameworks that focus on competencies rather than 'culture fit' assumptions\n\n**Candidate Experience Enhancement**: Automated communication systems that keep applicants engaged throughout the process\n\nThe most compelling example was Metro Community Services, which transformed their recruitment after implementing AI-enhanced processes:\n\n• **Application diversity increased 156%** across all demographic categories\n• **Time-to-hire reduced from 91 to 34 days** without compromising quality\n• **Candidate satisfaction scores** improved from 2.8 to 4.9 out of 5\n• **One-year retention rate** jumped to 94% (up from 67%)\n• **Cost per hire decreased 42%** while improving candidate quality\n\n'The best part,' shared their HR Director, 'is that we're finally attracting people who are genuinely excited about our work, not just looking for any nonprofit job.'",
      type: "text",
      order_index: 40,
      metadata: { character: "carmen" }
    },
    {
      lesson_id: 72,
      title: "AI Recruitment Systems: Beyond Traditional Hiring",
      content: "AI-powered recruitment transforms hiring from a subjective, time-consuming process into a strategic, equitable system that identifies candidates who will thrive in nonprofit environments while advancing diversity and inclusion goals.\n\n**Core AI Capabilities:**\n\n• **Language Optimization**: Analysis of job posting language to remove gendered, biased, or exclusionary terms while adding mission-focused messaging\n• **Candidate Matching**: Sophisticated algorithms that evaluate technical skills, cultural values alignment, and growth potential\n• **Bias Detection**: Real-time identification of discriminatory language or unfair screening practices\n• **Experience Personalization**: Customized communication and interview processes that reflect organizational values\n• **Predictive Analytics**: Assessment of candidate success likelihood based on role requirements and organizational culture\n\n**For Nonprofit Organizations:**\n\n• **Mission Alignment**: Tools specifically designed to evaluate passion for cause-driven work\n• **Diversity Enhancement**: Bias-aware systems that actively promote inclusive hiring practices\n• **Efficiency Gains**: Streamlined processes that respect both candidate and staff time\n• **Quality Improvement**: Data-driven selection that reduces hiring mistakes and improves retention\n\n**Addressing Common Concerns:**\n\n*'Will AI make hiring impersonal?'* – AI enhances human connection by providing structure for meaningful conversations while removing bias barriers.\n\n*'What about mission passion and cultural fit?'* – Advanced systems excel at measuring values alignment and commitment to social impact through behavioral assessment.\n\n*'Is this accessible for smaller nonprofits?'* – AI recruitment tools scale to any organization size and often simplify rather than complicate the hiring process.",
      type: "callout_box",
      order_index: 50,
      metadata: { variant: "info", title: "Understanding AI Recruitment" }
    },
    {
      lesson_id: 72,
      title: "Challenge #1: Inclusive Job Description Creation",
      content: "Carmen faces her first recruitment transformation challenge: rewriting the program coordinator job description to attract diverse, mission-aligned candidates while clearly communicating role expectations and growth opportunities.\n\nThe current posting is a disaster of exclusionary language and unclear requirements:\n\n*'Seeking dynamic self-starter with excellent communication skills and passion for social justice. Must have nonprofit experience and ability to work independently in fast-paced environment. Competitive candidates will demonstrate cultural fit and commitment to our mission.'*\n\nCarmen recognizes multiple problems:\n• **Gendered language**: Terms like 'dynamic' and 'competitive' research shows deter women from applying\n• **Vague requirements**: 'Excellent communication skills' means different things to different people\n• **Exclusionary criteria**: 'Must have nonprofit experience' eliminates qualified candidates from other sectors\n• **Bias-prone concepts**: 'Cultural fit' often masks unconscious preferences for similar backgrounds\n\nShe needs to create a posting that:\n• **Attracts diverse candidates** by using inclusive, welcoming language\n• **Clearly defines success** with specific competencies and measurable outcomes\n• **Communicates mission impact** in ways that resonate with purpose-driven professionals\n• **Focuses on potential** rather than just past experience\n• **Reflects organizational values** of equity and inclusion\n\nCarmen has two hours to transform this posting before it goes live on job boards. The new description must work immediately to attract the quality, diverse candidate pool her organization desperately needs.",
      type: "text",
      order_index: 70,
      metadata: { character: "carmen" }
    }
  ];

  const lesson2Interactive = [
    {
      lesson_id: 72,
      title: "Inclusive Job Description Generator",
      content: "Work with Carmen to create compelling, bias-free job descriptions that attract diverse, mission-aligned candidates. This AI tool analyzes language for inclusivity, optimizes for search visibility, and clearly communicates both role expectations and organizational culture.",
      type: "ai_content_generator",
      order_index: 80,
      configuration: {
        generationType: "job_description",
        aiInstructions: "Generate an inclusive, compelling job description that attracts diverse, mission-aligned candidates. Include:\n\n1. ENGAGING POSITION OVERVIEW:\n   - Mission-focused opening that connects role to organizational impact\n   - Clear value proposition for purpose-driven professionals\n   - Inclusive language that welcomes diverse backgrounds\n\n2. SPECIFIC RESPONSIBILITIES:\n   - Concrete, measurable tasks and outcomes\n   - Growth and development opportunities\n   - Collaboration and team interaction expectations\n   - Community impact and client interaction elements\n\n3. INCLUSIVE QUALIFICATIONS:\n   - Essential skills vs. preferred qualifications clearly separated\n   - Focus on competencies rather than years of experience\n   - Multiple pathway options (education, experience, certifications)\n   - Bias-free language that doesn't deter any demographic groups\n\n4. ORGANIZATIONAL CULTURE:\n   - Clear values and work environment description\n   - Commitment to diversity, equity, and inclusion\n   - Professional development and advancement opportunities\n   - Work-life balance and employee support\n\n5. COMPENSATION AND BENEFITS:\n   - Transparent salary range or framework\n   - Comprehensive benefits package\n   - Mission-related perks and values alignment\n   - Growth and advancement potential\n\n6. APPLICATION PROCESS:\n   - Clear, accessible application instructions\n   - Accommodation requests welcomed\n   - Timeline and next steps communicated\n   - Contact information for questions\n\nFormat as a complete job posting ready for immediate publication, optimized for both human appeal and search engine visibility.",
        fields: [
          {
            name: "position_title",
            label: "Position Title",
            type: "select",
            options: [
              "Program Coordinator",
              "Community Outreach Coordinator",
              "Development Associate",
              "Case Manager",
              "Youth Program Specialist",
              "Education Coordinator",
              "Client Advocate",
              "Program Manager",
              "Direct Service Provider"
            ],
            placeholder: "Select position to post"
          },
          {
            name: "organization_focus",
            label: "Organization Mission Focus",
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
            placeholder: "Select organizational focus area"
          },
          {
            name: "experience_level",
            label: "Experience Level",
            type: "select",
            options: [
              "Entry-level (0-2 years)",
              "Mid-level (2-5 years)",
              "Senior-level (5+ years)",
              "Leadership role",
              "Open to various experience levels"
            ],
            placeholder: "Select target experience level"
          },
          {
            name: "work_environment",
            label: "Work Environment",
            type: "select",
            options: [
              "Fully remote",
              "Hybrid (2-3 days in office)",
              "Primarily in-office",
              "Field-based community work",
              "Mixed office and community sites",
              "Travel required"
            ],
            placeholder: "Select work arrangement"
          }
        ],
        characterPerspective: "Carmen Rodriguez, HR Director specializing in inclusive recruitment and mission-aligned hiring"
      },
      is_active: true,
      is_visible: true
    }
  ];

  const lesson2MoreContent = [
    {
      lesson_id: 72,
      title: "Carmen's Recruitment Revolution",
      content: "Carmen couldn't believe the transformation. Within 48 hours of posting the AI-optimized job description, applications started flowing in – but not just any applications. These were candidates who clearly understood the organization's mission and could articulate how their skills would contribute to community impact.\n\n'Look at this application,' Carmen exclaimed to Marcus, sharing her screen. 'This candidate doesn't have traditional nonprofit experience, but they've volunteered extensively and their corporate project management background is exactly what we need for our new community health initiative.'\n\nThe numbers were impressive:\n• **Application volume increased 340%** with significantly higher quality\n• **Diverse candidate pool**: 67% women, 45% people of color, 23% first-generation college graduates\n• **Mission alignment scores** averaged 4.2 out of 5 (previously 2.8)\n• **Relevant skill match** improved from 34% to 78% of applicants\n\nBut the real breakthrough was in the language candidates used to describe their interest. Instead of generic statements about 'wanting to help people,' applicants demonstrated specific understanding of organizational challenges and offered concrete ideas for contribution.\n\n'I'm particularly drawn to your community-led approach to housing advocacy,' wrote one candidate. 'My experience in policy analysis and community organizing would allow me to support residents in developing their own solutions while building coalitions for systemic change.'\n\nCarmen realized that inclusive job descriptions didn't just attract more diverse candidates – they attracted more thoughtful, prepared candidates who were genuinely excited about the specific work they'd be doing.",
      type: "text",
      order_index: 90,
      metadata: { character: "carmen" }
    },
    {
      lesson_id: 72,
      title: "Advanced Candidate Assessment Systems",
      content: "Moving beyond inclusive job descriptions, Carmen discovers how AI can revolutionize the entire candidate evaluation process, from initial screening through final selection, while maintaining fairness and identifying the best mission-culture matches.\n\n**Comprehensive Assessment Framework:**\n\n• **Skills-Based Screening**: Objective evaluation of technical competencies required for role success\n• **Mission Alignment Testing**: Sophisticated assessment of values fit and passion for organizational work\n• **Behavioral Interview Design**: Structured questions that predict job performance while reducing bias\n• **Reference Check Optimization**: Targeted questions that reveal candidate strengths and development areas\n• **Decision-Making Support**: Data-driven hiring recommendations based on multiple assessment factors\n\n**Bias Reduction Mechanisms:**\n\n• **Blind Resume Review**: Focus on qualifications and experience without demographic identifiers\n• **Standardized Interview Rubrics**: Consistent evaluation criteria applied to all candidates\n• **Multiple Interviewer Perspectives**: Diverse interview panels with aggregated, weighted feedback\n• **Objective Scoring Systems**: Numerical ratings tied to specific job-related competencies\n\n**Cultural Fit vs. Cultural Add:**\n\n• **Moving Beyond 'Fit'**: Assessment of how candidates will enhance rather than simply match existing culture\n• **Values Alignment**: Focus on core mission commitment rather than social or background similarity\n• **Diversity Impact**: Evaluation of how candidate perspectives will strengthen team effectiveness\n• **Growth Potential**: Assessment of learning mindset and adaptability to organizational evolution",
      type: "callout_box",
      order_index: 100,
      metadata: { variant: "info", title: "Holistic Candidate Assessment" }
    },
    {
      lesson_id: 72,
      title: "Challenge #2: Interview Framework Development",
      content: "With a strong candidate pool generated by the inclusive job description, Carmen faces her next challenge: designing interview processes that accurately assess both competency and mission alignment while eliminating bias and creating positive candidate experiences.\n\nThe current interview process is problematic:\n• **Inconsistent questions** across different interviewers\n• **Subjective 'gut feeling' decisions** without data support\n• **Lengthy, exhausting interview days** that deter quality candidates\n• **Poor candidate communication** about process and timeline\n• **Limited diversity** in interview panels\n\nCarmen needs to create a system that:\n• **Evaluates technical skills** through practical, job-relevant scenarios\n• **Assesses mission alignment** beyond surface-level responses\n• **Provides fair comparison** across all candidates\n• **Delivers positive experience** that reflects organizational values\n• **Supports interviewer confidence** with clear frameworks and training\n\nShe has five candidates scheduled for interviews next week and needs to implement the new framework immediately. The process must be thorough enough to make confident hiring decisions while being efficient enough to respect everyone's time and maintain candidate interest.",
      type: "text",
      order_index: 130,
      metadata: { character: "carmen" }
    }
  ];

  const lesson2FinalInteractive = [
    {
      lesson_id: 72,
      title: "Interview Framework Builder",
      content: "Partner with Carmen to design comprehensive, bias-free interview processes that accurately assess candidate qualifications while creating positive experiences that reflect your organizational values. This tool helps structure fair, consistent, and mission-focused candidate evaluation.",
      type: "ai_content_generator",
      order_index: 140,
      configuration: {
        generationType: "interview_framework",
        aiInstructions: "Create a comprehensive interview framework for nonprofit recruitment. Include:\n\n1. INTERVIEW STRUCTURE DESIGN:\n   - Multi-stage process with clear objectives for each stage\n   - Time allocations and interviewer assignments\n   - Technical skills assessment methods\n   - Mission alignment evaluation approaches\n   - Candidate experience optimization\n\n2. STANDARDIZED QUESTION BANKS:\n   - Behavioral interview questions tied to job competencies\n   - Mission alignment and values assessment questions\n   - Technical skill evaluation scenarios\n   - Growth mindset and adaptability questions\n   - Diversity, equity, and inclusion perspective questions\n\n3. BIAS REDUCTION PROTOCOLS:\n   - Structured interview rubrics with specific scoring criteria\n   - Diverse interview panel composition requirements\n   - Objective evaluation forms and decision-making processes\n   - Unconscious bias training guidelines for interviewers\n\n4. CANDIDATE EXPERIENCE FRAMEWORK:\n   - Clear communication about process and timeline\n   - Accommodation requests and accessibility measures\n   - Professional development and growth opportunity discussions\n   - Organizational culture and values demonstration\n   - Timely feedback and follow-up protocols\n\n5. DECISION-MAKING SUPPORT:\n   - Weighted scoring systems for different competency areas\n   - Reference check question templates\n   - Final selection criteria and documentation requirements\n   - Onboarding transition planning\n\nFormat as a complete interview implementation guide with templates, forms, and training materials ready for immediate use.",
        fields: [
          {
            name: "position_complexity",
            label: "Position Complexity Level",
            type: "select",
            options: [
              "Entry-level with basic requirements",
              "Mid-level with specialized skills",
              "Senior role with leadership responsibilities",
              "Management position with team oversight",
              "Executive-level strategic role"
            ],
            placeholder: "Select complexity level"
          },
          {
            name: "interview_duration",
            label: "Available Interview Time",
            type: "select",
            options: [
              "30-45 minutes (phone/video screen)",
              "1-2 hours (comprehensive interview)",
              "Half-day process (multiple interviews)",
              "Full-day assessment (extensive evaluation)",
              "Multi-day process (senior positions)"
            ],
            placeholder: "Select interview duration"
          },
          {
            name: "assessment_priorities",
            label: "Assessment Priorities",
            type: "select",
            options: [
              "Technical skills and competency focus",
              "Mission alignment and cultural values",
              "Leadership and team collaboration",
              "Problem-solving and adaptability",
              "Community engagement and client interaction",
              "Balanced across all areas"
            ],
            placeholder: "Select primary assessment focus"
          }
        ],
        characterPerspective: "Carmen Rodriguez, HR Director with expertise in equitable interview design and candidate assessment"
      },
      is_active: true,
      is_visible: true
    },
    {
      lesson_id: 72,
      title: "Carmen's Recruitment Strategy Chat",
      content: "Discuss your specific recruitment challenges with Carmen Rodriguez. She'll help you optimize job descriptions, design fair interview processes, and create systems that attract mission-aligned candidates while promoting diversity and inclusion in your hiring practices.",
      type: "lyra_chat",
      order_index: 170,
      configuration: {
        chatType: "persistent",
        blockingEnabled: false,
        context: {
          character: "Carmen Rodriguez",
          role: "HR Director & Recruitment Expert",
          expertise: [
            "Inclusive job description optimization",
            "Bias-free interview design",
            "Mission-aligned candidate assessment",
            "Diversity recruitment strategies",
            "Candidate experience enhancement",
            "AI-powered recruitment tools",
            "Hiring process efficiency",
            "Cultural assessment methods"
          ],
          personality: "Strategic, inclusive, data-driven, and passionate about equitable hiring practices",
          context: "After revolutionizing recruitment to attract diverse, passionate candidates while streamlining hiring processes, Carmen helps other organizations build effective, equitable talent acquisition systems."
        }
      },
      is_active: true,
      is_visible: true
    }
  ];

  // Insert all content and interactive elements
  const allItems = [...allContent, ...lesson2MoreContent];
  const allInteractive = [...lesson2Interactive, ...lesson2FinalInteractive];

  for (const block of allItems) {
    const { error } = await supabase
      .from('content_blocks')
      .insert(block);
    
    if (error) {
      console.error('Error inserting content block:', error);
    } else {
      console.log(`Inserted content block: ${block.title}`);
    }
  }

  for (const element of allInteractive) {
    const { error } = await supabase
      .from('interactive_elements')
      .insert(element);
    
    if (error) {
      console.error('Error inserting interactive element:', error);
    } else {
      console.log(`Inserted interactive element: ${element.title}`);
    }
  }

  console.log('Lessons 2-4 content creation completed!');
}

// Run the script  
createLessons2Through4().catch(console.error);