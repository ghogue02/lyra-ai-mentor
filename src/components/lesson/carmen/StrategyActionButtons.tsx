import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Building, 
  Download, 
  Share2, 
  BookOpen, 
  Calendar,
  FileText,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

interface StrategyActionButtonsProps {
  generatedStrategy: string;
  selections: { [key: string]: string[] };
  tabConfigs: TabConfig[];
  onComplete: () => void;
}

export const StrategyActionButtons: React.FC<StrategyActionButtonsProps> = ({
  generatedStrategy,
  selections,
  tabConfigs,
  onComplete
}) => {
  const { toast } = useToast();

  const copyStrategy = () => {
    const formattedStrategy = formatStrategyForCopy(generatedStrategy, selections, tabConfigs);
    navigator.clipboard.writeText(formattedStrategy);
    toast({
      title: "Strategy Copied!",
      description: "Your complete hiring strategy has been copied to clipboard.",
    });
  };

  const downloadStrategy = () => {
    const formattedStrategy = formatStrategyForDownload(generatedStrategy, selections, tabConfigs);
    const blob = new Blob([formattedStrategy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiring-strategy-carmen-ai.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started!",
      description: "Your hiring strategy is being downloaded.",
    });
  };

  const shareStrategy = () => {
    if (navigator.share) {
      const formattedStrategy = formatStrategyForShare(generatedStrategy, selections, tabConfigs);
      navigator.share({
        title: 'AI-Generated Hiring Strategy',
        text: formattedStrategy,
      }).then(() => {
        toast({
          title: "Shared Successfully!",
          description: "Your strategy has been shared.",
        });
      }).catch(() => {
        copyStrategy(); // Fallback to copy
      });
    } else {
      copyStrategy(); // Fallback for browsers without share API
    }
  };

  const downloadTemplates = () => {
    const templates = generateAllTemplates(selections, tabConfigs);
    
    // Create a zip-like text file with all templates
    const allTemplates = templates.map(template => 
      `${'='.repeat(50)}\n${template.filename}\n${'='.repeat(50)}\n\n${template.content}\n\n`
    ).join('\n');
    
    const blob = new Blob([allTemplates], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiring-templates-carmen-ai.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Templates Downloaded!",
      description: "All hiring templates have been downloaded.",
    });
  };

  const scheduleFollowUp = () => {
    const calendarEvent = generateCalendarEvent(selections, tabConfigs);
    const calendarUrl = generateCalendarUrl(calendarEvent);
    
    window.open(calendarUrl, '_blank');
    
    toast({
      title: "Calendar Event Created!",
      description: "Follow-up reminders have been added to your calendar.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={copyStrategy}
          >
            <Copy className="w-4 h-4" />
            Copy Strategy
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={downloadStrategy}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={shareStrategy}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-green-600/20 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
          <Button 
            onClick={onComplete}
            size="lg"
            className="relative text-white text-base px-8 py-3 font-semibold"
          >
            <Check className="w-5 h-5 mr-2" />
            Complete Workshop
          </Button>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={downloadTemplates}
        >
          <FileText className="w-3 h-3" />
          Download Templates
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={scheduleFollowUp}
        >
          <Calendar className="w-3 h-3" />
          Schedule Follow-up
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={() => window.open('https://lyra-ai.com/resources/hiring-guide', '_blank')}
        >
          <BookOpen className="w-3 h-3" />
          View Resources
        </Button>
      </div>

      {/* Implementation Hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        delay={1}
        className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200"
      >
        <p className="text-sm text-gray-600">
          💡 <strong>Pro Tip:</strong> Start with the "Immediate Action Items" and schedule your first audit for next week. 
          Small steps lead to big improvements!
        </p>
      </motion.div>
    </div>
  );
};

// Utility functions for formatting and generating content

function formatStrategyForCopy(strategy: string, selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  const selectedItems = getSelectedItems(selections, tabConfigs);
  
  return `HIRING STRATEGY - Generated by Carmen's AI
${'='.repeat(50)}

EXECUTIVE SUMMARY
${strategy.split('\n').slice(0, 3).join('\n')}

YOUR SELECTIONS
${selectedItems.map(item => `• ${item}`).join('\n')}

COMPLETE STRATEGY
${strategy}

NEXT STEPS
1. Review and customize this strategy for your organization
2. Schedule team meetings to discuss implementation
3. Begin with job description audits (Week 1)
4. Implement structured interviews (Week 2-3)
5. Launch candidate experience improvements (Week 4)

Generated with Carmen's Compassionate Hiring Framework
© ${new Date().getFullYear()} Lyra AI`;
}

function formatStrategyForDownload(strategy: string, selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  const selectedItems = getSelectedItems(selections, tabConfigs);
  
  return `COMPASSIONATE HIRING STRATEGY
Generated by Carmen's AI Framework
${new Date().toLocaleDateString()}

TABLE OF CONTENTS
1. Executive Summary
2. Your Selections & Focus Areas
3. Strategic Framework
4. Implementation Timeline
5. Action Items
6. Success Metrics
7. Templates & Resources
8. Common Pitfalls
9. Best Practices

${'='.repeat(60)}

1. EXECUTIVE SUMMARY

Your personalized hiring strategy combines Carmen's compassionate AI approach with industry best practices to create an inclusive, efficient recruitment process.

Key Focus Areas:
${selectedItems.map(item => `• ${item}`).join('\n')}

${'='.repeat(60)}

2. YOUR SELECTIONS & FOCUS AREAS

${tabConfigs.map(tab => {
  const tabSelections = selections[tab.id] || [];
  const selectedOptions = tab.options.filter(opt => tabSelections.includes(opt.id));
  
  if (selectedOptions.length === 0) return '';
  
  return `${tab.label.toUpperCase()}:
${selectedOptions.map(opt => `• ${opt.label} - ${opt.description}`).join('\n')}`;
}).filter(Boolean).join('\n\n')}

${'='.repeat(60)}

3. STRATEGIC FRAMEWORK

${strategy}

${'='.repeat(60)}

4. IMPLEMENTATION TIMELINE

Week 1-2: Foundation Phase
• Audit current job descriptions
• Set up structured interview frameworks
• Train hiring managers on bias-free techniques

Week 3-4: Implementation Phase  
• Launch new screening processes
• Begin structured interviews
• Implement candidate experience improvements

Week 5-6: Optimization Phase
• Monitor early results
• Gather feedback from candidates and team
• Refine processes based on data

Week 7+: Scale Phase
• Expand successful practices to all roles
• Share learnings across departments
• Continuous improvement based on metrics

${'='.repeat(60)}

5. ACTION ITEMS

HIGH PRIORITY (Week 1)
□ Audit current job descriptions for biased language
□ Design structured interview questions
□ Set up anonymous resume screening process
□ Train hiring team on new procedures

MEDIUM PRIORITY (Week 2-3)  
□ Implement candidate feedback system
□ Create evaluation rubrics for consistency
□ Partner with diverse professional organizations
□ Set up pipeline tracking and metrics

ONGOING
□ Monitor diversity metrics monthly
□ Gather candidate experience feedback
□ Refine processes based on data
□ Share best practices with team

${'='.repeat(60)}

6. SUCCESS METRICS

Track these KPIs monthly:
• Diverse candidate pipeline growth (+40% target)
• Time to hire reduction (-25% target)  
• Candidate experience score (4.5/5 target)
• Interview consistency rate (95% target)
• Hiring manager satisfaction (90% target)
• Bias incident reduction (-80% target)

${'='.repeat(60)}

Generated with Carmen's Compassionate Hiring Framework
For support and resources: https://lyra-ai.com/hiring-resources
© ${new Date().getFullYear()} Lyra AI`;
}

function formatStrategyForShare(strategy: string, selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  return `🤖 Just created my personalized hiring strategy with Carmen's AI!

Key focus areas: ${getSelectedItems(selections, tabConfigs).slice(0, 3).join(', ')}

The strategy includes actionable steps, success metrics, and ready-to-use templates. 
Excited to build a more inclusive hiring process! 

#HiringStrategy #AIForGood #InclusiveHiring #LyraAI`;
}

function getSelectedItems(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string[] {
  const items: string[] = [];
  
  tabConfigs.forEach(tab => {
    const tabSelections = selections[tab.id] || [];
    const selectedOptions = tab.options.filter(opt => tabSelections.includes(opt.id));
    selectedOptions.forEach(opt => items.push(opt.label));
  });
  
  return items;
}

function generateAllTemplates(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): Array<{filename: string, content: string}> {
  return [
    {
      filename: 'job-description-template.txt',
      content: generateJobDescriptionTemplate(selections, tabConfigs)
    },
    {
      filename: 'structured-interview-guide.txt', 
      content: generateInterviewGuide()
    },
    {
      filename: 'candidate-evaluation-rubric.txt',
      content: generateEvaluationRubric()
    },
    {
      filename: 'diversity-sourcing-checklist.txt',
      content: generateSourcingChecklist()
    },
    {
      filename: 'candidate-experience-survey.txt',
      content: generateCandidateExperienceSurvey()
    }
  ];
}

function generateJobDescriptionTemplate(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  const rolesTab = tabConfigs.find(tab => tab.id === 'roles');
  const selectedRoles = rolesTab ? rolesTab.options.filter(opt => 
    selections.roles?.includes(opt.id)
  ).map(opt => opt.label) : [];
  
  const primaryRole = selectedRoles[0] || 'Software Engineer';
  
  return `# ${primaryRole} - Inclusive Job Description Template

## About Our Company
[Write 2-3 sentences about your company's mission and values, emphasizing diversity and inclusion]

## Role Overview
We're seeking a talented ${primaryRole} to join our collaborative team. This role offers opportunities for growth, learning, and meaningful impact on our products and users.

## What You'll Do
• [Primary responsibility focused on outcomes and impact]
• [Collaborative responsibility emphasizing teamwork]
• [Growth-oriented responsibility with learning opportunities]
• [Innovation-focused responsibility]

## What You Bring
REQUIRED:
• [Must-have skill/experience - be specific about years if needed]
• [Technical requirement - focus on demonstrable skills]
• [Problem-solving or analytical ability]
• Strong communication and collaboration skills

PREFERRED (Nice to have, but not required):
• [Additional experience that would be helpful]
• [Relevant certification or education]
• [Industry-specific knowledge]

## What We Offer
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements (remote/hybrid options)
• Professional development budget ($X annually)
• [Company-specific benefits]
• Inclusive and supportive work environment

## Our Commitment to Diversity
We are committed to building a diverse and inclusive team. We welcome applications from all qualified candidates regardless of race, gender identity, sexual orientation, religion, age, disability status, veteran status, or other protected characteristics.

## Application Process
To apply, please submit your resume and a brief cover letter explaining your interest in the role. We'll review all applications carefully and respond to every candidate.

If you need any accommodations during our interview process, please don't hesitate to let us know.

---
This template follows Carmen's Compassionate Hiring Framework principles.`;
}

function generateInterviewGuide(): string {
  return `# Structured Interview Guide - 60 Minutes

## Pre-Interview Checklist
□ Review candidate's resume and application
□ Prepare interview space (in-person or virtual setup)
□ Have evaluation rubric ready
□ Brief all interviewers on questions and process

## Interview Structure

### 1. OPENING (5 minutes)
**Goals:** Put candidate at ease, set expectations

• "Thanks for taking the time to meet with us today. I'm [name] and I'll be conducting your interview."
• "I'd like to start with a brief overview of our company and this role..." [2 minutes]
• "The interview will take about 60 minutes. I'll ask about your background, some behavioral questions, and role-specific questions. You'll have time for questions at the end."
• "Do you have any questions before we begin?"

### 2. BACKGROUND & EXPERIENCE (15 minutes)
**Goals:** Understand candidate's journey and motivations

1. "Tell me about your background and what led you to apply for this role."
   - Listen for: Career progression, motivation, alignment with role

2. "Describe a project or accomplishment you're particularly proud of."
   - Listen for: Impact, ownership, problem-solving approach

3. "What interests you most about this opportunity?"
   - Listen for: Research about company/role, genuine interest

### 3. BEHAVIORAL QUESTIONS (20 minutes)
**Goals:** Assess soft skills, culture fit, growth mindset

1. **Learning & Adaptability:**
   "Tell me about a time when you had to learn something completely new for work. How did you approach it?"
   - Listen for: Learning strategy, persistence, resourcefulness

2. **Collaboration:**
   "Describe a situation where you had to work with someone whose working style was very different from yours."
   - Listen for: Flexibility, communication, conflict resolution

3. **Problem-Solving:**
   "Give me an example of a challenging problem you solved. What was your approach?"
   - Listen for: Analytical thinking, creativity, systematic approach

4. **Receiving Feedback:**
   "Tell me about a time you received constructive feedback. How did you handle it?"
   - Listen for: Growth mindset, professionalism, ability to improve

### 4. ROLE-SPECIFIC QUESTIONS (15 minutes)
**Goals:** Assess technical/functional competency

[Customize based on specific role - examples below]

**For Technical Roles:**
• "Walk me through how you would approach [relevant technical challenge]"
• "Tell me about a technical decision you made recently. What factors did you consider?"

**For Non-Technical Roles:**
• "How would you handle [role-specific scenario]?"
• "What tools or methods do you use to [relevant skill area]?"

### 5. CLOSING (5 minutes)
**Goals:** Address candidate questions, set clear expectations

• "What questions do you have about the role, team, or company?"
• "Is there anything else you'd like me to know about your background or qualifications?"
• "Here's what to expect next..." [Explain timeline and process]
• "Thank you for your time today. We'll be in touch by [specific date]."

## Evaluation Criteria
Rate each area 1-5 immediately after the interview:

□ **Technical/Role Skills:** ___/5
   (Demonstrates required competencies)

□ **Problem-Solving:** ___/5  
   (Thinks through challenges systematically)

□ **Communication:** ___/5
   (Clear, concise, good listening skills)

□ **Collaboration:** ___/5
   (Works well with others, handles differences)

□ **Growth Mindset:** ___/5
   (Open to learning, handles feedback well)

□ **Culture Fit:** ___/5
   (Aligns with company values and team dynamics)

**Overall Recommendation:**
□ Strong Yes - Exceeds expectations, would strengthen team
□ Yes - Meets requirements, good addition  
□ No - Does not meet minimum requirements
□ Need More Data - Requires additional assessment

**Key Strengths:**
[2-3 specific strengths with examples]

**Areas of Concern:**
[Any concerns with specific examples]

**Additional Notes:**
[Any other relevant observations]

---
Remember: Ask the same core questions to all candidates for this role to ensure fair comparison.`;
}

function generateEvaluationRubric(): string {
  return `# Candidate Evaluation Rubric

Use this rubric to ensure consistent, fair evaluation of all candidates.

## Scoring Guidelines
**5 = Exceptional** - Far exceeds expectations
**4 = Strong** - Exceeds expectations  
**3 = Meets Expectations** - Solid, competent level
**2 = Below Expectations** - Some concerns, may need support
**1 = Does Not Meet Standards** - Significant concerns

---

## 1. TECHNICAL/FUNCTIONAL SKILLS

**5 - Expert Level**
• Demonstrates mastery of required skills
• Can explain complex concepts clearly to others
• Shows innovative approaches to problems
• Could mentor others in this area

**4 - Advanced Level**
• Strong command of required skills
• Handles complex scenarios independently
• Shows good judgment in technical decisions
• Can guide less experienced team members

**3 - Proficient Level**
• Solid understanding of core requirements
• Can handle most typical challenges
• May need occasional guidance on complex issues
• Shows ability to learn and grow

**2 - Developing Level**  
• Basic understanding of requirements
• Needs support for complex challenges
• Shows potential but requires development
• May slow down team initially

**1 - Insufficient Level**
• Limited understanding of basic concepts
• Cannot handle typical job challenges
• Would require extensive training/support
• Not ready for this role level

---

## 2. PROBLEM-SOLVING

**5 - Strategic Thinker**
• Approaches problems systematically and creatively
• Considers multiple solutions and trade-offs
• Anticipates potential issues and plans accordingly
• Thinks beyond immediate problem to broader impact

**4 - Strong Analytical Skills**
• Breaks down complex problems effectively
• Uses logical approach to find solutions
• Considers most relevant factors
• Communicates reasoning clearly

**3 - Competent Problem Solver**
• Can solve typical work problems independently  
• Uses reasonable approaches most of the time
• Asks good clarifying questions when needed
• Shows logical thinking process

**2 - Needs Guidance**
• Struggles with complex or ambiguous problems
• May need help structuring approach
• Sometimes misses important factors
• Can improve with support and experience

**1 - Limited Problem-Solving**
• Difficulty breaking down problems
• Needs significant guidance for most issues
• May not recognize when help is needed
• Not ready for independent problem-solving

---

## 3. COMMUNICATION

**5 - Exceptional Communicator**
• Articulates ideas clearly and persuasively
• Adapts communication style to audience
• Excellent listener, asks insightful questions
• Could effectively represent team/company

**4 - Strong Communicator**
• Expresses ideas clearly and professionally
• Good listening skills, engages appropriately
• Handles questions and discussion well
• Would communicate effectively with team

**3 - Effective Communicator**
• Generally clear in expression
• Responds appropriately to questions
• Shows active listening
• Would fit well in team discussions

**2 - Needs Improvement**
• Sometimes unclear or hard to follow
• May struggle with complex explanations
• Limited engagement in conversation
• Could improve with practice

**1 - Communication Concerns**
• Difficulty expressing ideas clearly
• Poor listening skills or responsiveness
• Would struggle in collaborative environment
• Significant barrier to team effectiveness

---

## 4. COLLABORATION & TEAMWORK

**5 - Team Leader**
• Natural ability to bring out best in others
• Handles conflict constructively
• Creates inclusive environment
• Others would seek them out for collaboration

**4 - Strong Team Player**  
• Works very effectively with others
• Contributes positively to team dynamics
• Good at building relationships
• Shows empathy and consideration

**3 - Good Collaborator**
• Works well with most people
• Contributes fairly to team efforts
• Open to different perspectives
• Generally positive team member

**2 - Adequate Team Member**
• Can work with others when needed
• May prefer working independently
• Sometimes misses social/team cues
• Could improve collaboration skills

**1 - Team Concerns**
• Prefers working alone
• May create tension or conflict
• Resistant to feedback or other viewpoints
• Could negatively impact team dynamics

---

## 5. GROWTH MINDSET & LEARNING

**5 - Continuous Learner**
• Actively seeks out learning opportunities
• Thrives on challenges and new experiences
• Views failures as learning opportunities
• Could drive innovation and improvement

**4 - Growth-Oriented**
• Open to new challenges and learning
• Handles feedback constructively
• Shows curiosity about industry/role
• Would grow quickly in the role

**3 - Open to Growth**
• Willing to learn new things when needed
• Accepts feedback reasonably well
• Shows some initiative for development
• Would develop steadily over time

**2 - Somewhat Growth-Minded**
• May be hesitant about big changes
• Takes feedback personally sometimes
• Limited evidence of learning initiative
• Might resist development opportunities

**1 - Fixed Mindset**
• Resistant to change or new approaches
• Defensive about feedback or criticism
• Shows little interest in learning/growing
• Could become stuck in current capabilities

---

## FINAL RECOMMENDATION

**Overall Score: ___/25 (Average of 5 categories)**

□ **STRONG HIRE (22-25 points)**
   Exceptional candidate who would significantly strengthen the team

□ **HIRE (18-21 points)**  
   Solid candidate who meets requirements and would be good addition

□ **BORDERLINE (14-17 points)**
   Mixed results - may need additional interview or assessment

□ **NO HIRE (Below 14 points)**
   Does not meet minimum requirements for the role

---

## ADDITIONAL CONSIDERATIONS

**Diversity & Inclusion Impact:**
□ Would add valuable perspective to team
□ Shows awareness of inclusive practices
□ Could help create welcoming environment

**Potential Red Flags:**
□ Concerning responses about teamwork
□ Inappropriate comments or behavior  
□ Significant gaps in required skills
□ Poor cultural alignment

**Special Notes:**
[Any unique circumstances, standout qualities, or additional context]

---

**Interviewer:** _________________ **Date:** _________
**Position:** _________________ **Candidate:** _________________

This rubric ensures fair, consistent evaluation while reducing unconscious bias in hiring decisions.`;
}

function generateSourcingChecklist(): string {
  return `# Diversity Sourcing Checklist

## PRE-SOURCING SETUP

### Job Description Audit
□ Remove biased language (use tools like Textio or Gender Decoder)
□ Focus on skills and outcomes rather than credentials
□ Include diversity statement and accommodation offer
□ Set realistic "nice-to-have" vs "must-have" requirements
□ Use inclusive pronouns and language

### Pipeline Goals
□ Set specific diversity targets (e.g., 40% underrepresented candidates)
□ Identify which underrepresented groups to prioritize
□ Plan sourcing budget allocation
□ Set timeline for sourcing activities

---

## SOURCING CHANNELS

### Professional Organizations & Communities
□ **Women in Tech Organizations**
   - Women Who Code
   - Girls Who Code (for entry-level roles)
   - Women in Data Science
   - AnitaB.org (formerly Anita Borg Institute)

□ **Ethnic & Cultural Organizations**  
   - National Society of Black Engineers (NSBE)
   - Society of Hispanic Professional Engineers (SHPE)
   - Asian American Professional Society
   - Native Americans in Tech

□ **LGBTQ+ Professional Networks**
   - Out in Tech
   - Lesbians Who Tech
   - Pride in STEM
   - Professional Pride Network

□ **Veterans & Military**
   - VetsInTech
   - Corporate Gray
   - Military to Tech programs
   - Veterans Affairs job fairs

□ **Disability & Accessibility**
   - Disabled in Tech
   - National Organization on Disability
   - Lime Connect
   - Accessibility community groups

### Educational Partnerships
□ **Historically Black Colleges & Universities (HBCUs)**
   - Howard University
   - Spelman College  
   - Morehouse College
   - [Add local HBCUs]

□ **Hispanic-Serving Institutions (HSIs)**
   - [Research HSIs in your area]
   - Partner with career services
   - Sponsor student organizations

□ **Community Colleges & Bootcamps**
   - Local community college career centers
   - Coding bootcamps (Lambda School, General Assembly, etc.)
   - Trade schools and technical programs
   - Adult learning/career transition programs

□ **University Diversity Programs**
   - Office of Diversity & Inclusion partnerships
   - Diverse student organizations
   - Mentorship program graduates
   - Diversity scholarship recipients

### Online Communities & Platforms
□ **Social Media Groups**
   - LinkedIn diversity groups
   - Facebook professional communities  
   - Twitter hashtag communities (#BlackTechTwitter, #WomenInTech)
   - Discord/Slack professional communities

□ **Industry-Specific Forums**
   - Stack Overflow for developers
   - Behance for designers
   - Industry conference attendee lists
   - Meetup.com professional groups

□ **Specialized Job Boards**
   - DiversityJobs.com
   - PowerToFly (women in tech)
   - RecruitDisability
   - VetTech.org
   - HireVeterans.com

---

## SOURCING BEST PRACTICES

### Outreach Messages
□ Use inclusive, welcoming language
□ Highlight company diversity & inclusion efforts
□ Mention growth and learning opportunities
□ Avoid assumptions about candidate background
□ Provide clear next steps and timeline

### Message Template Examples:
**Subject: [Role Title] Opportunity - [Company Name] Values Your Perspective**

"Hi [Name],

I hope this message finds you well. I'm reaching out because your background in [specific skill/experience] caught my attention, and I believe you could be a great fit for our [Role Title] position.

At [Company], we're committed to building diverse teams because we know different perspectives make us stronger. This role offers:
• [Key growth opportunity]
• [Learning/development benefit]  
• [Impact/mission alignment]

I'd love to learn more about your career goals and share how this role might align with your interests. Would you be open to a brief conversation this week?

Best regards,
[Your name]"

### Follow-Up Guidelines
□ Respond promptly to candidate inquiries
□ Provide clear timelines and stick to them
□ Send polite follow-ups if no initial response
□ Respect candidates who decline interest
□ Maintain professional relationship for future opportunities

---

## TRACKING & MEASUREMENT

### Pipeline Metrics to Track
□ **Source Effectiveness**
   - Candidates sourced per channel
   - Application rate by source
   - Interview rate by source
   - Hire rate by source

□ **Diversity Metrics**
   - Percentage of diverse candidates at each stage
   - Drop-off rates by demographic (where legally trackable)
   - Time to hire by candidate background
   - Candidate experience scores by group

□ **Sourcing Efficiency**
   - Cost per candidate by channel
   - Time investment per successful hire
   - Response rates to outreach
   - Quality of candidates by source

### Weekly Review Questions
□ Are we hitting diversity pipeline targets?
□ Which sources are most/least effective?
□ Where are we losing diverse candidates in process?
□ What feedback are we getting from candidates?
□ Do we need to adjust our approach?

---

## CONTINUOUS IMPROVEMENT

### Monthly Actions
□ Review sourcing metrics and adjust strategy
□ Gather feedback from recent candidates
□ Research new diversity organizations and communities
□ Update job descriptions based on learnings
□ Share successful practices with hiring team

### Quarterly Actions  
□ Survey hiring managers on candidate quality
□ Analyze year-over-year diversity progress
□ Attend diversity-focused recruiting events
□ Update partnerships with organizations/schools
□ Review and refresh sourcing message templates

### Annual Actions
□ Conduct full diversity recruiting audit
□ Set new diversity goals and targets
□ Evaluate ROI of different sourcing investments
□ Plan diversity recruiting budget for next year
□ Share diversity recruiting wins and learnings company-wide

---

## SOURCING CALENDAR TEMPLATE

**Week 1:**
• Post job on mainstream boards
• Reach out to diversity organizations
• Contact university career centers

**Week 2:**  
• Attend virtual diversity job fairs
• Engage with online communities
• Follow up on initial outreach

**Week 3:**
• Partner organization events/meetups
• LinkedIn outreach to passive candidates
• Referral program activation

**Week 4:**
• Review pipeline metrics
• Adjust sourcing strategy as needed
• Plan next month's sourcing activities

---

Remember: Diversity sourcing is an investment in building stronger, more innovative teams. Consistency and authentic relationship-building are key to long-term success.`;
}

function generateCandidateExperienceSurvey(): string {
  return `# Candidate Experience Survey

**Thank you for interviewing with [Company Name]!**

Your feedback helps us create a better experience for all candidates. This survey takes 3-5 minutes and your responses are confidential.

---

## APPLICATION PROCESS

**1. How did you first learn about this position?**
□ Company website
□ Job board (Indeed, LinkedIn, etc.)
□ Professional organization
□ Referral from current employee
□ Recruiter/sourcing message
□ Social media
□ Other: _______________

**2. How would you rate the job description?**
□ Excellent - Clear, detailed, inclusive
□ Good - Mostly clear and informative  
□ Fair - Some unclear areas
□ Poor - Confusing or incomplete

**What could be improved about the job description?**
_________________________________

**3. How easy was the application process?**
□ Very easy
□ Somewhat easy
□ Neutral
□ Somewhat difficult
□ Very difficult

---

## COMMUNICATION & SCHEDULING

**4. How would you rate communication from our team?**
□ Excellent - Timely, clear, professional
□ Good - Generally good communication
□ Fair - Adequate but could improve
□ Poor - Slow, unclear, or unprofessional

**5. Was scheduling convenient for you?**
□ Very convenient
□ Somewhat convenient
□ Neutral
□ Somewhat inconvenient  
□ Very inconvenient

**6. Did you receive timely updates about your application status?**
□ Yes, always kept informed
□ Mostly, with minor delays
□ Sometimes, but wanted more updates
□ Rarely, left wondering about status
□ No, poor communication

---

## INTERVIEW EXPERIENCE

**7. How would you rate your overall interview experience?**
□ Excellent
□ Good
□ Fair
□ Poor

**8. Did the interviewers seem prepared and professional?**
□ Very prepared and professional
□ Mostly prepared and professional
□ Somewhat prepared
□ Not well prepared
□ Unprofessional

**9. Were you given adequate opportunity to ask questions?**
□ Yes, plenty of time for questions
□ Yes, some time for questions
□ Limited time for questions
□ No opportunity to ask questions

**10. Did you feel the interview questions were fair and relevant?**
□ Very fair and relevant
□ Mostly fair and relevant
□ Somewhat relevant
□ Not very relevant
□ Unfair or inappropriate

**Was there anything about the interview that made you uncomfortable?**
_________________________________

---

## DIVERSITY & INCLUSION

**11. Did you feel welcomed and respected throughout the process?**
□ Absolutely
□ Mostly
□ Somewhat
□ Not really
□ No

**12. Did our team demonstrate commitment to diversity and inclusion?**
□ Strongly demonstrated
□ Somewhat demonstrated
□ Neutral
□ Little demonstration
□ No demonstration

**13. Would you recommend [Company Name] as an employer to others?**
□ Definitely yes
□ Probably yes
□ Maybe
□ Probably no
□ Definitely no

---

## OVERALL FEEDBACK

**14. What was the best part of your interview experience?**
_________________________________

**15. What could we do better?**
_________________________________

**16. Any other comments or suggestions?**
_________________________________

---

## OPTIONAL DEMOGRAPHIC INFORMATION
*This information helps us understand and improve our outreach to diverse candidates. All responses are confidential and optional.*

**Gender Identity:**
□ Man □ Woman □ Non-binary □ Prefer not to say □ Prefer to self-describe: ___

**Race/Ethnicity:** (Select all that apply)
□ American Indian/Alaska Native
□ Asian/Asian American  
□ Black/African American
□ Hispanic/Latino
□ Native Hawaiian/Pacific Islander
□ White/Caucasian
□ Prefer not to say
□ Prefer to self-describe: ___

**Are you a person with a disability?**
□ Yes □ No □ Prefer not to say

**Are you a military veteran?**
□ Yes □ No □ Prefer not to say

---

**Thank you for your time and feedback!**

We appreciate your interest in [Company Name] and wish you the best in your job search. If you have any questions about this survey or our hiring process, please contact us at [email].

---

## FOR INTERNAL USE - SURVEY ANALYSIS TEMPLATE

### Monthly Survey Summary
- **Response Rate:** ___% (target: 60%+)
- **Average Overall Rating:** ___/5 (target: 4.0+)
- **Net Promoter Score:** ___% (target: 70%+)

### Key Themes from Feedback:
**Positive:**
- 
- 
- 

**Areas for Improvement:**
- 
- 
- 

### Action Items:
□ 
□ 
□ 

### Diversity Insights:
- Representation in survey responses
- Any patterns by demographic group
- Specific feedback about inclusion experience

This survey template follows best practices for gathering actionable candidate feedback while respecting privacy and promoting inclusive hiring.`;
}

function generateCalendarEvent(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]) {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const month2 = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  
  return {
    title: 'Hiring Strategy Implementation Review',
    description: `Review progress on Carmen's Hiring Strategy implementation:

WEEK 1 CHECKLIST:
□ Audit job descriptions for biased language
□ Set up structured interview framework  
□ Train hiring team on new processes
□ Begin diverse sourcing outreach

WEEK 2 GOALS:
□ Launch new screening processes
□ Conduct first structured interviews
□ Implement candidate feedback system
□ Monitor pipeline diversity metrics

Resources: Access templates and guides from your hiring strategy download.

Generated with Carmen's Compassionate Hiring Framework`,
    startDate: nextWeek.toISOString().split('T')[0],
    endDate: nextWeek.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00'
  };
}

function generateCalendarUrl(event: any): string {
  const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
  googleCalendarUrl.searchParams.set('text', event.title);
  googleCalendarUrl.searchParams.set('details', event.description);
  googleCalendarUrl.searchParams.set('dates', `${event.startDate.replace(/-/g, '')}T${event.startTime.replace(':', '')}00/${event.endDate.replace(/-/g, '')}T${event.endTime.replace(':', '')}00`);
  
  return googleCalendarUrl.toString();
}