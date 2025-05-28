import type { UserProfile } from './types.ts';

export function generateStagedDemoResponse(userProfile: UserProfile | null, stage: string): string {
  const role = userProfile?.role || 'nonprofit work';
  const firstName = userProfile?.first_name || '';
  const greeting = firstName ? `${firstName}, ` : '';
  
  switch (stage) {
    case 'intro':
      return `🎯 **AI Magic Demo**

${greeting}ready to see AI transform your ${role} data? This interactive demo will show you step-by-step how AI finds hidden patterns and creates actionable insights.

We'll use sample data so you can see the magic without any setup!

*Click "Start Demo" below to begin your journey into AI-powered insights!*`;

    case 'loading':
      return `📊 **Step 1: Data Ingestion & Preprocessing**

${greeting}watch as our AI system loads and processes realistic ${role} data. Notice how it handles the messy, real-world data that would typically overwhelm traditional analysis tools.

**🔄 Real-time Data Processing:**
- Parsing 1,247 donor records across multiple formats
- Standardizing inconsistent data entries
- Cross-referencing engagement metrics
- Validating data integrity and completeness

**🧹 Data Cleaning Operations:**
- Normalizing name variations (M. Chen → Michael Chen)
- Converting currency formats ($245.00, $89, etc.)
- Standardizing date formats across systems
- Flagging incomplete or suspicious records

**⚡ Processing Speed:** What would take a human analyst 4-6 hours to clean and organize, AI completes in under 30 seconds.

*This is just the beginning - the real magic happens in the analysis phase!*`;

    case 'analysis':
      return `🧠 **Step 2: Advanced AI Analysis Engine**

${greeting}now witness our multi-layered AI analysis system at work. This isn't just data processing - it's intelligent pattern recognition that discovers insights humans would miss.

**🔍 Neural Network Analysis:**
- Donor behavior clustering using machine learning
- Predictive lifetime value calculations
- Retention risk assessment algorithms
- Engagement pattern recognition

**📊 Real-time Discoveries:**

**Donor Segmentation Insights:**
• **Monthly Sustainers:** 23% of donors generating 67% of revenue
• **Event-Driven Donors:** 3.2x higher lifetime value when properly stewarded
• **Digital Natives:** 89% prefer email, respond 45% faster to mobile-optimized content

**Behavioral Pattern Analysis:**
• **Optimal Contact Timing:** Thursday 10-11 AM shows 34% higher response rates
• **Content Preferences:** Personal impact stories convert 2.8x better than statistics
• **Donation Triggers:** 72-hour follow-up window critical for second gifts

**🚨 Predictive Risk Alerts:**
• **47 donors** showing early lapse indicators (confidence: 87%)
• **$18,400** in revenue at risk without intervention in next 60 days
• **3 major donors** haven't been contacted in 90+ days (relationship deterioration risk)

**💰 Hidden Revenue Opportunities:**
• **Quarterly → Monthly conversion potential:** +$127,000 annually
• **Untapped corporate matching:** $34,000 sitting unclaimed
• **Peer-to-peer potential:** 340% ROI based on network analysis

*This level of insight would require a team of analysts weeks to uncover manually!*`;

    case 'insights':
      return `💡 **Step 3: Strategic Insights & Opportunity Mapping**

${greeting}here's where AI transforms raw data into strategic intelligence. These insights represent the difference between guesswork and data-driven growth.

**🎯 Mission-Critical Discoveries:**

**Revenue Optimization Matrix:**
• **High-Impact, Low-Effort:** Convert 67 quarterly donors to monthly (+$89K annually)
• **Medium-Impact, Quick Win:** Optimize email timing for 23% engagement boost
• **High-Impact, Strategic:** Launch major gift program targeting 23 qualified prospects

**🔮 Predictive Intelligence:**
• **Donor Lifecycle Optimization:** AI identified optimal touchpoint sequences
• **Seasonal Giving Patterns:** November campaigns 2.3x more effective than October
• **Channel Performance:** Direct mail + email sequences outperform single-channel by 156%

**⚠️ Risk Mitigation Priorities:**
1. **Immediate Action Required (Next 7 days):**
   - Contact 3 major donors at risk of lapsing
   - Send retention campaign to 47 at-risk donors
   
2. **Strategic Prevention (Next 30 days):**
   - Implement automated lapse prevention workflows
   - Launch re-engagement campaign for dormant supporters

**🚀 Growth Acceleration Opportunities:**
• **Board Network Leverage:** 12 warm introductions to potential major donors identified
• **Corporate Partnership Expansion:** 8 companies with matching programs, employees in your donor base
• **Event ROI Enhancement:** VIP cultivation tracks show 67% higher post-event retention

**📈 Expected Impact Timeline:**
- **Week 1:** +$5,200 from immediate actions
- **Month 1:** +$18,900 from retention campaigns  
- **Quarter 1:** +$47,300 from new acquisition strategies
- **Year 1:** +$127,000 from systematic optimization

*These aren't just numbers - they're strategic insights that transform your entire approach to donor development.*`;

    case 'recommendations':
      return `🚀 **Step 4: AI-Powered Action Plan**

${greeting}now for the transformation moment - AI converts insights into a precise, prioritized action plan that you can implement starting today.

**⚡ IMMEDIATE ACTIONS (This Week - High ROI, Low Effort):**

**Critical Interventions (Complete by Friday):**
1. **Call Patricia Williams** - Major donor, no contact in 94 days, historical $5,200 annual giving
   📞 *Suggested approach: "Patricia, your impact on our literacy program has been transformational..."*

2. **Send personalized email to 47 at-risk donors** - AI generated subject lines and content
   📧 *Template: "We miss you, [Name] - here's how your past support changed lives..."*

3. **Schedule coffee with board member Sarah Chen** - She has 3 warm major donor connections
   ☕ *Talking points: Her network analysis suggests $15K+ potential*

**📧 30-DAY ENGAGEMENT OPTIMIZATION:**

**Email Campaign Transformation:**
• **New Send Time:** Thursdays 10:15 AM (34% higher open rates)
• **Subject Line AI:** Personalized based on donor history and preferences  
• **Content Strategy:** 70% impact stories, 30% organizational updates
• **Mobile Optimization:** 89% of your donors check email on mobile first

**🎯 QUARTERLY STRATEGIC INITIATIVES:**

**Major Gift Pipeline Development:**
1. **Prospect Research:** AI identified 23 donors with $25K+ capacity
2. **Cultivation Sequences:** Personalized 6-touch stewardship tracks
3. **Corporate Matching Outreach:** Target 8 companies with employee donors

**🤖 AUTOMATION IMPLEMENTATIONS:**

**Smart Donor Journey Workflows:**
• **New Donor Series:** 7-touch welcome sequence (increases retention by 67%)
• **Lapse Prevention:** Automatic alerts when engagement drops below threshold
• **Birthday/Anniversary Recognition:** Personalized milestone celebrations
• **Thank You Optimization:** Send timing based on donor's preferred communication windows

**📊 MEASUREMENT & OPTIMIZATION:**

**AI Dashboard Setup:**
• Real-time donor health scores
• Predictive revenue forecasting  
• Campaign performance optimization
• Automated A/B testing for subject lines and content

**🎯 EXPECTED TRANSFORMATION:**

**Financial Impact (12-month projection):**
- **Retention Improvement:** 71% → 83% (+$42,000)
- **Average Gift Increase:** $156 → $203 (+$58,000)  
- **New Major Gifts:** 5 gifts averaging $15,000 (+$75,000)
- **Corporate Matching Activation:** (+$34,000)
- **Total Revenue Impact:** +$209,000 (127% increase)

**Operational Efficiency Gains:**
- **Analysis Time:** 8 hours/week → 30 minutes/week
- **Campaign Planning:** 2 days → 2 hours  
- **Donor Research:** 4 hours/prospect → 15 minutes/prospect
- **Report Generation:** Manual → Automated

**🎉 The Bottom Line:**

${firstName ? firstName + ', you' : 'You'} just witnessed how AI transforms ${role} from reactive to predictive, from manual to automated, from guesswork to precision.

With your actual data, these insights become even more powerful and specific to your unique donor base and mission.

**Ready to implement AI in your organization? Let's discuss how to get started with your real data!**`;

    default:
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
D001,Sarah Johnson,$2450,2024-11-15,quarterly,45-54,email
D002,Michael Chen,$890,2024-10-22,annual,35-44,phone
D003,Patricia Williams,$5200,2024-12-01,monthly,65+,mail
D004,James Rodriguez,$1100,2024-09-18,irregular,25-34,email
D005,Lisa Thompson,$3300,2024-11-28,biannual,55-64,email
D006,Anonymous Donor,$450,2024-10-05,annual,unknown,email
D007,Corporate Match Inc,$12000,2024-11-20,annual,corporate,email

ENGAGEMENT_METRICS.csv
=====================
donor_id,email_open_rate,event_attendance,volunteer_hours,social_media_engagement
D001,78%,3_events,12_hours,high
D002,45%,1_event,0_hours,low
D003,92%,5_events,25_hours,high
D004,23%,0_events,2_hours,medium
D005,67%,2_events,8_hours,medium

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
P004,Job_Training,2024-09-10,completed,38,79,92%
P005,Digital_Literacy,2024-09-20,dropped_out,29,35,45%
P006,Financial_Wellness,2024-10-15,in_progress,41,68,85%

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
V003,2024-01-30,completed,78,2%,10
V004,2024-03-05,not_started,0,50%,1
V005,2024-02-10,completed,156,8%,9

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
Twitter,2024-12-01,quick_update,890,2.1%,23,2
LinkedIn,2024-12-01,thought_leadership,1200,8.5%,156,18
TikTok,2024-12-01,behind_scenes,3400,12.3%,234,15

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
total_revenue,$287450,$268200,$320000,positive
program_participants,1247,1089,1400,positive
staff_productivity,87%,82%,90%,positive
donor_retention,68%,71%,75%,negative
volunteer_hours,2340,2156,2500,positive

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
