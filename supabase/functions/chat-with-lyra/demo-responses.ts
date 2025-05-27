
import type { UserProfile } from './types.ts';

export function generateStagedDemoResponse(userProfile: UserProfile | null, stage: string): string {
  const role = userProfile?.role || 'nonprofit work';
  const firstName = userProfile?.first_name || '';
  const greeting = firstName ? `${firstName}, ` : '';
  
  switch (stage) {
    case 'loading':
      return `${greeting}let me load some realistic ${role} data that shows how AI handles messy, real-world information...

📊 **SAMPLE DATA LOADING...**

Here's what messy ${role} data typically looks like:

\`\`\`
DONOR_EXPORT_Q4_2024.csv
========================
Name,Amount,Date,Method,Notes
Sarah Johnson,$245,"11/15/24",Online,"Recurring donor, loves events"
M. Chen,$89,"10/22/24",Check,"First time, met at fundraiser"
Patricia W.,$520,"12/01/24",Online,"Major donor, board connection"
...incomplete_record,$,"09/18/24",,
\`\`\`

**🔍 This is exactly the kind of messy data AI excels at!**

Notice the inconsistencies? Different name formats, missing data, various payment methods? This would take hours to clean manually.

*Ready for the next step? Click "Continue" to see how AI analyzes this chaos!*`;

    case 'analysis':
      return `${greeting}now watch AI work its magic on that messy data...

🧠 **AI ANALYSIS IN PROGRESS...**

*Processing 1,247 donor records...*
*Identifying patterns...*
*Cross-referencing engagement data...*
*Calculating predictive metrics...*

**✨ PATTERNS DISCOVERED:**

🎯 **Donor Segmentation:**
- Monthly sustainers: 23% of donors, 67% of revenue
- Event-driven donors: 45% higher lifetime value
- Online vs. offline preference patterns identified

📈 **Behavioral Insights:**
- Thursday emails: 34% higher open rates
- Personal stories: 2.8x better conversion
- Follow-up timing: 48-72 hours optimal

🔮 **Predictive Analysis:**
- 47 donors likely to lapse next month
- 23 donors showing major gift potential
- $18,400 revenue at risk without intervention

*This analysis would take a human analyst 2-3 days. AI did it in seconds!*

*Ready to see the actionable insights? Click "Continue"!*`;

    case 'insights':
      return `${greeting}here are the game-changing insights AI discovered in your data...

💡 **KEY INSIGHTS REVEALED**

**🎯 Hidden Revenue Opportunities:**
- Convert quarterly donors to monthly = +$127,000 annually
- Optimize email timing = +23% open rates
- Target 'almost major' donors = +$89,000 potential

**⚠️ Risk Alerts:**
- 47 donors showing lapse patterns (prevention needed)
- $18,400 revenue at risk in next 60 days
- 3 major donors haven't been contacted in 90+ days

**🚀 Growth Accelerators:**
- Peer-to-peer campaigns: 340% ROI potential
- Corporate matching untapped: $34,000 sitting there
- Board connections: 12 warm introductions available

**🎪 Event Strategy Gold:**
- VIP attendees give 3.2x more within 30 days
- Silent auctions outperform live by 23%
- Follow-up parties increase retention by 67%

*These insights transform guesswork into strategy!*

*Ready for specific action steps? Click "Continue" for recommendations!*`;

    case 'recommendations':
      return `${greeting}now for the best part - here's exactly what to do with these insights...

🚀 **YOUR AI-POWERED ACTION PLAN**

**🎯 This Week (High Impact, Quick Wins):**
1. **Call these 3 major donors** who haven't been contacted in 90+ days
2. **Send retention emails** to the 47 at-risk donors (templates generated)
3. **Schedule follow-up** with 12 warm board connections

**📧 Next 30 Days (Revenue Boosters):**
1. **Launch monthly conversion campaign** targeting quarterly donors
2. **Optimize email timing** - switch to Thursday 10 AM sends
3. **Create peer-to-peer campaign** for your top 25 advocates

**💰 Next Quarter (Growth Drivers):**
1. **Major gift cultivation** for 23 identified prospects
2. **Corporate matching outreach** to unlock $34,000
3. **VIP stewardship program** for high-value event attendees

**🤖 Automation Opportunities:**
- Set up automatic lapse prevention alerts
- Create smart donor journey workflows
- Implement predictive engagement scoring

**Expected Results:**
- 📈 +$127,000 annual revenue increase
- 🎯 +23% donor retention improvement
- ⚡ 75% reduction in manual analysis time

*This is what AI does - transforms data into dollars and impact!*

${firstName ? firstName + ', imagine' : 'Imagine'} having insights like this for YOUR actual data. Ready to explore how AI could revolutionize your ${role} work?`;

    default: // complete demo
      return generateDummyDataResponse(userProfile);
  }
}

export function generateDummyDataResponse(userProfile: UserProfile | null): string {
  const role = userProfile?.role || 'general';
  const firstName = userProfile?.first_name || '';
  
  const dummyDataSets = {
    fundraising: {
      title: "Donor Database Analysis",
      data: `DONOR_DATA_EXPORT_2024.csv
===================================
donor_id,name,total_donated,last_gift_date,gift_frequency,age_bracket,communication_pref
D001,Sarah Johnson,$2,450,2024-11-15,quarterly,45-54,email
D002,Michael Chen,$890,2024-10-22,annual,35-44,phone
D003,Patricia Williams,$5,200,2024-12-01,monthly,65+,mail
D004,James Rodriguez,$1,100,2024-09-18,irregular,25-34,email
D005,Lisa Thompson,$3,300,2024-11-28,biannual,55-64,email

ENGAGEMENT_METRICS.csv
=====================
donor_id,email_open_rate,event_attendance,volunteer_hours,social_media_engagement
D001,78%,3_events,12_hours,high
D002,45%,1_event,0_hours,low
D003,92%,5_events,24_hours,medium
...

Let me analyze this donor data for patterns and insights!`,
      analysis: `**Key Insights Discovered:**

• Monthly donors have 85% higher lifetime value ($3,100 avg vs $1,200)
• Email-preferred donors show 2.3x higher engagement rates
• Donors aged 45+ who attend events give 40% larger gifts
• High social media engagement correlates with volunteer hours

**AI-Powered Recommendations:**
• Target quarterly donors for monthly conversion (potential +$180K annually)
• Create email-first stewardship tracks for under-45 demographics  
• Develop event-to-major-gift pipeline for 45+ attendees
• Launch social volunteer recruitment campaigns

What if we could predict which donors are most likely to become monthly sustainers? I can show you how AI scoring models work with your actual data.`
    },
    programs: {
      title: "Program Outcomes Analysis",
      data: `PROGRAM_PARTICIPANTS_Q4.csv
==============================
participant_id,program,enrollment_date,completion_status,pre_assessment,post_assessment,attendance_rate
P001,Job_Training,2024-09-01,completed,45,82,95%
P002,Digital_Literacy,2024-09-15,in_progress,32,65,78%
P003,Financial_Wellness,2024-10-01,completed,28,71,88%

Uncovering program effectiveness patterns!`,
      analysis: `**Program Performance Insights:**
• Job Training: 78% completion rate with 90% employment success
• Digital Literacy: 67% completion rate with 85% confidence boost
• Financial Wellness: 82% completion rate with avg $8,200 income increase

**Success Predictors Found:**
• 80%+ attendance = 94% likelihood of positive outcomes
• Pre-assessment scores 35+ show 3x better completion rates

What if we could predict which participants need extra support before they struggle? I can show you how AI can spot at-risk patterns in real-time.`
    },
    operations: {
      title: "Operational Workflow Analysis", 
      data: `VOLUNTEER_MANAGEMENT_DATA.csv
===============================
volunteer_id,registration_date,training_completion,hours_logged,no_show_rate,retention_months
V001,2024-01-15,completed,45,5%,11
V002,2024-02-20,pending,12,25%,4

Analyzing operational bottlenecks and efficiency opportunities!`,
      analysis: `**Operational Excellence Insights:**
• Volunteers with completed training: 89% retention vs 23% without
• High-automation processes save 156 hours/month per staff member
• Staff spending 45% time on admin (industry avg: 25%)

Imagine if mundane tasks handled themselves while your team focused purely on mission impact? I can show you exactly how AI transforms daily operations.`
    },
    marketing: {
      title: "Digital Engagement Analysis",
      data: `SOCIAL_MEDIA_PERFORMANCE.csv
==============================
platform,post_date,content_type,reach,engagement_rate,click_through,conversion
Instagram,2024-12-01,story_impact,2450,4.2%,145,8
Facebook,2024-12-01,donor_spotlight,1890,6.1%,89,12

Uncovering digital engagement goldmines!`,
      analysis: `**Digital Storytelling Insights:**
• Behind-scenes content: 2.3x higher engagement than announcements
• Personal impact stories: 40% better conversion rates
• Thursday morning emails: 25% higher open rates

What if every piece of content could be perfectly timed and personalized for maximum impact? I can show you how AI creates content that truly resonates.`
    },
    leadership: {
      title: "Strategic Dashboard Analysis",
      data: `ORGANIZATIONAL_METRICS_Q4.csv
===============================
metric,current_value,previous_quarter,target,trend
total_revenue,$287,450,$268,200,$320,000,positive
program_participants,1,247,1,089,1,400,positive

Revealing strategic positioning and growth opportunities!`,
      analysis: `**Strategic Leadership Insights:**
• Revenue +7.2% but trailing target by 10% (gap: $32,550)
• Program growth +14.5% shows strong mission alignment
• Innovation gap: competitors scoring 20% higher on tech adoption

What if you could predict and prevent organizational challenges before they impact your mission? I can show you how strategic AI creates unshakeable competitive advantage.`
    }
  };

  const dataSet = dummyDataSets[role as keyof typeof dummyDataSets] || dummyDataSets.fundraising;
  
  return `${firstName ? `${firstName}, w` : 'W'}elcome to AI Magic in Action!

I just received some sample ${role} data that looks like a complete mess. Watch me work my AI magic to find patterns and insights you'd never spot manually!

${dataSet.data}

---

AI Analysis in Progress...
Processing patterns...
Cross-referencing metrics...
Identifying opportunities...
Generating insights...

---

${dataSet.analysis}

${firstName ? firstName + ', this' : 'This'} is just a tiny glimpse of what AI can do with YOUR real data!

Ready to see how we can transform your actual ${role} work with AI? What part of this analysis surprised you most?`;
}
