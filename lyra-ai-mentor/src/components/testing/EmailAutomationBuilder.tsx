import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Zap, Users, Calendar, Send, Filter, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface EmailAutomationBuilderProps {
  onComplete?: () => void;
}

interface EmailStep {
  id: number;
  type: 'trigger' | 'wait' | 'email' | 'condition' | 'action';
  title: string;
  description: string;
  timing?: string;
  content?: {
    subject?: string;
    preview?: string;
    personalization?: string[];
  };
}

interface EmailAutomation {
  name: string;
  purpose: string;
  targetAudience: string;
  expectedResults: string;
  sequence: EmailStep[];
  bestPractices: string[];
  metrics: {
    metric: string;
    benchmark: string;
    trackingMethod: string;
  }[];
  templates: {
    name: string;
    subject: string;
    body: string;
  }[];
}

export const EmailAutomationBuilder: React.FC<EmailAutomationBuilderProps> = ({ onComplete }) => {
  const [automationType, setAutomationType] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [automation, setAutomation] = useState<EmailAutomation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const automationTypes = [
    { value: 'welcome_series', label: 'Welcome Series', description: 'New subscriber onboarding' },
    { value: 'donation_followup', label: 'Donation Follow-up', description: 'Thank and cultivate donors' },
    { value: 'event_promotion', label: 'Event Promotion', description: 'Drive event registrations' },
    { value: 'volunteer_nurture', label: 'Volunteer Nurture', description: 'Engage and retain volunteers' },
    { value: 're_engagement', label: 'Re-engagement Campaign', description: 'Win back inactive contacts' },
    { value: 'monthly_giving', label: 'Monthly Giving Conversion', description: 'Convert to recurring donors' },
    { value: 'impact_updates', label: 'Impact Update Series', description: 'Share program outcomes' },
    { value: 'year_end_campaign', label: 'Year-End Campaign', description: 'Maximize holiday giving' }
  ];

  const audiences = [
    { value: 'new_subscribers', label: 'New Subscribers' },
    { value: 'one_time_donors', label: 'One-Time Donors' },
    { value: 'monthly_donors', label: 'Monthly Donors' },
    { value: 'lapsed_donors', label: 'Lapsed Donors' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'event_attendees', label: 'Event Attendees' },
    { value: 'general_list', label: 'General Email List' }
  ];

  const goals = [
    { value: 'increase_donations', label: 'Increase Donations' },
    { value: 'improve_retention', label: 'Improve Retention' },
    { value: 'drive_engagement', label: 'Drive Engagement' },
    { value: 'educate_audience', label: 'Educate Audience' },
    { value: 'recruit_volunteers', label: 'Recruit Volunteers' },
    { value: 'promote_events', label: 'Promote Events' }
  ];

  const createAutomation = async () => {
    if (!automationType || !audience || !goal) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateEmailAutomation();
      setAutomation(result);
      
      toast.success('Email automation created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create automation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEmailAutomation = (): EmailAutomation => {
    const templates: Record<string, () => EmailAutomation> = {
      welcome_series: () => ({
        name: 'New Subscriber Welcome Journey',
        purpose: 'Build relationship with new subscribers by introducing your mission, sharing impact stories, and encouraging first action within 30 days.',
        targetAudience: 'New email subscribers who signed up via website, events, or campaigns',
        expectedResults: '25% engagement rate, 15% take first action (donate/volunteer), 85% retention after 90 days',
        sequence: [
          {
            id: 1,
            type: 'trigger',
            title: 'Subscription Trigger',
            description: 'Contact subscribes via any channel (website, event, campaign)',
            content: {
              personalization: ['subscription_source', 'first_name']
            }
          },
          {
            id: 2,
            type: 'email',
            title: 'Welcome Email',
            description: 'Immediate welcome with mission overview',
            timing: 'Immediately',
            content: {
              subject: 'Welcome to [Organization]! Here\'s how we\'re changing lives together',
              preview: 'Thank you for joining our community of changemakers',
              personalization: ['first_name', 'subscription_source']
            }
          },
          {
            id: 3,
            type: 'wait',
            title: 'Wait Period',
            description: 'Give subscriber time to read first email',
            timing: '3 days'
          },
          {
            id: 4,
            type: 'email',
            title: 'Impact Story Email',
            description: 'Share powerful beneficiary story',
            timing: 'Day 3',
            content: {
              subject: '[First Name], meet Maria - her story will inspire you',
              preview: 'See how your support changes lives in our community',
              personalization: ['first_name', 'local_program']
            }
          },
          {
            id: 5,
            type: 'wait',
            title: 'Wait Period',
            description: 'Space between emails',
            timing: '4 days'
          },
          {
            id: 6,
            type: 'email',
            title: 'Ways to Help Email',
            description: 'Present volunteer and donation opportunities',
            timing: 'Day 7',
            content: {
              subject: '3 ways you can make a difference this week',
              preview: 'Small actions create big impact',
              personalization: ['first_name', 'nearest_location']
            }
          },
          {
            id: 7,
            type: 'condition',
            title: 'Engagement Check',
            description: 'Did subscriber open/click any emails?',
            timing: 'Day 8'
          },
          {
            id: 8,
            type: 'email',
            title: 'Engaged Path: First Ask',
            description: 'Soft ask for engaged subscribers',
            timing: 'Day 14',
            content: {
              subject: '[First Name], will you help us reach our goal?',
              preview: 'Your first gift makes a lasting impact',
              personalization: ['first_name', 'suggested_amount']
            }
          },
          {
            id: 9,
            type: 'email',
            title: 'Unengaged Path: Re-engagement',
            description: 'Different content for those who haven\'t engaged',
            timing: 'Day 14',
            content: {
              subject: 'We noticed you haven\'t had a chance to explore yet',
              preview: 'Here\'s what you might have missed',
              personalization: ['first_name']
            }
          },
          {
            id: 10,
            type: 'action',
            title: 'Tag and Segment',
            description: 'Tag based on actions taken for future targeting',
            timing: 'Day 30'
          }
        ],
        bestPractices: [
          'Personalize subject lines and content with subscriber name and interests',
          'Use compelling preview text to increase open rates',
          'Include clear, single call-to-action in each email',
          'Optimize for mobile - 60% will read on phones',
          'A/B test subject lines for highest engagement',
          'Monitor unsubscribe rates and adjust frequency if needed',
          'Include social proof and impact metrics',
          'Make unsubscribe option clear to maintain list health'
        ],
        metrics: [
          { metric: 'Open Rate', benchmark: '25-30%', trackingMethod: 'Email platform analytics' },
          { metric: 'Click Rate', benchmark: '3-5%', trackingMethod: 'Link tracking in emails' },
          { metric: 'Conversion Rate', benchmark: '2-3%', trackingMethod: 'Goal tracking in CRM' },
          { metric: 'Unsubscribe Rate', benchmark: '<1%', trackingMethod: 'Email platform reporting' },
          { metric: '30-Day Retention', benchmark: '85%+', trackingMethod: 'Subscriber status in CRM' }
        ],
        templates: [
          {
            name: 'Welcome Email',
            subject: 'Welcome to [Organization]! Here\'s how we\'re changing lives together',
            body: `Dear [First Name],

Welcome! We're thrilled you've joined our community of changemakers.

When you signed up [via source], you joined thousands of compassionate people working to [mission statement]. Together, we're making a real difference in [location].

Here's what you can expect from us:
✓ Monthly impact updates showing how we're changing lives
✓ Inspiring stories from the people we serve
✓ Opportunities to get involved and make a difference
✓ Invitations to special events and volunteer opportunities

Want to dive deeper? Here are three ways to get started:
1. Follow us on [social media links] for daily updates
2. Read our latest impact report: [link]
3. Join us for our next volunteer orientation: [link]

We're so glad you're here. Together, we can [vision statement].

With gratitude,
[Sender Name]
[Title]

P.S. Have questions? Just reply to this email - we'd love to hear from you!`
          },
          {
            name: 'Impact Story Email',
            subject: '[First Name], meet Maria - her story will inspire you',
            body: `Hi [First Name],

Three months ago, Maria was sleeping in her car with her two children. Today, she has a job, an apartment, and hope for the future.

This transformation happened because people like you believe everyone deserves a second chance.

Maria came to our [program name] after losing her job and home. We provided:
• Safe temporary housing for her family
• Job training in medical billing
• Childcare during her classes
• Interview coaching and professional clothes

"I went from feeling invisible to feeling empowered," Maria told us last week. "Now I can provide for my kids and be the mom they deserve."

Stories like Maria's happen every day because of support from our community. In fact:
• 89% of our program participants find employment within 90 days
• 94% maintain stable housing after one year
• 100% report increased confidence and hope

[First Name], you're now part of this life-changing work. Thank you for joining us.

Want to help write more success stories? [Learn about ways to get involved - link]

With hope,
[Sender Name]

P.S. Maria wanted us to tell you: "Thank you for caring about families like mine."`
          }
        ]
      }),

      donation_followup: () => ({
        name: 'Donor Thank You & Cultivation Series',
        purpose: 'Transform one-time donors into loyal supporters through timely acknowledgment, impact reporting, and strategic cultivation.',
        targetAudience: 'New and existing donors at all levels',
        expectedResults: '68% retention rate, 23% make second gift within 90 days, 15% increase average gift size',
        sequence: [
          {
            id: 1,
            type: 'trigger',
            title: 'Donation Received',
            description: 'Donation processed through any channel',
            content: {
              personalization: ['donation_amount', 'donation_date', 'campaign']
            }
          },
          {
            id: 2,
            type: 'email',
            title: 'Instant Tax Receipt',
            description: 'Automated receipt with warm thank you',
            timing: 'Within 5 minutes',
            content: {
              subject: 'Your donation receipt - Thank you, [First Name]!',
              preview: 'Your generosity is already making a difference',
              personalization: ['first_name', 'donation_amount', 'tax_id']
            }
          },
          {
            id: 3,
            type: 'condition',
            title: 'Gift Size Routing',
            description: 'Route based on donation amount',
            timing: 'Immediate'
          },
          {
            id: 4,
            type: 'email',
            title: 'Personal Thank You (<$250)',
            description: 'Warm thank you for smaller gifts',
            timing: '24 hours',
            content: {
              subject: '[First Name], your kindness means everything',
              preview: 'See the immediate impact of your gift',
              personalization: ['first_name', 'donation_amount', 'impact_equivalent']
            }
          },
          {
            id: 5,
            type: 'email',
            title: 'Enhanced Thank You ($250+)',
            description: 'Special recognition for larger gifts',
            timing: '24 hours',
            content: {
              subject: 'A special thank you from our Executive Director',
              preview: 'Your leadership gift is transforming lives',
              personalization: ['first_name', 'donation_amount', 'executive_signature']
            }
          },
          {
            id: 6,
            type: 'action',
            title: 'Major Gift Alert ($1000+)',
            description: 'Notify staff for personal outreach',
            timing: 'Immediate'
          },
          {
            id: 7,
            type: 'wait',
            title: 'Cultivation Period',
            description: 'Let initial thank you resonate',
            timing: '14 days'
          },
          {
            id: 8,
            type: 'email',
            title: 'First Impact Update',
            description: 'Show how their gift is being used',
            timing: '2 weeks',
            content: {
              subject: '[First Name], here\'s what your gift is accomplishing',
              preview: 'Real stories of lives you\'re changing',
              personalization: ['first_name', 'program_update']
            }
          },
          {
            id: 9,
            type: 'wait',
            title: 'Continued Cultivation',
            description: 'Space before next touchpoint',
            timing: '45 days'
          },
          {
            id: 10,
            type: 'email',
            title: 'Quarterly Impact Report',
            description: 'Comprehensive update on outcomes',
            timing: 'End of quarter',
            content: {
              subject: 'Your quarterly impact report is here',
              preview: 'See how you helped us serve 1,234 people',
              personalization: ['first_name', 'cumulative_impact']
            }
          },
          {
            id: 11,
            type: 'condition',
            title: 'Second Gift Check',
            description: 'Has donor made another gift?',
            timing: '90 days'
          },
          {
            id: 12,
            type: 'email',
            title: 'Upgrade Ask (No Second Gift)',
            description: 'Gentle ask for continued support',
            timing: '90 days',
            content: {
              subject: 'Continue your impact with monthly giving',
              preview: 'Sustainable support creates lasting change',
              personalization: ['first_name', 'monthly_ask_amount']
            }
          }
        ],
        bestPractices: [
          'Send tax receipt immediately - within 5 minutes ideal',
          'Personalize based on gift size and designation',
          'Show specific impact, not generic thank yous',
          'Include photos and stories in impact updates',
          'Track email engagement to inform future asks',
          'Coordinate with personal outreach for major donors',
          'Test different ask timings for optimal results',
          'Segment future communications based on giving patterns'
        ],
        metrics: [
          { metric: 'Receipt Open Rate', benchmark: '65%+', trackingMethod: 'Transactional email tracking' },
          { metric: 'Thank You Open Rate', benchmark: '45%+', trackingMethod: 'Email platform analytics' },
          { metric: 'Second Gift Rate', benchmark: '20-25%', trackingMethod: 'CRM donor tracking' },
          { metric: 'Monthly Conversion', benchmark: '5-8%', trackingMethod: 'Recurring donation signups' },
          { metric: 'Donor Satisfaction', benchmark: '4.5+/5', trackingMethod: 'Survey responses' }
        ],
        templates: [
          {
            name: 'Instant Tax Receipt',
            subject: 'Your donation receipt - Thank you, [First Name]!',
            body: `Dear [First Name],

Thank you for your generous gift of $[amount] to [Organization]!

This email serves as your official tax receipt.
Donation Date: [date]
Donation Amount: $[amount]
Tax ID: [ein]

Your support means the world to us and the people we serve. Because of you:
• Families in crisis will find hope
• Children will receive the education they deserve
• Our community will grow stronger

We'll put your gift to work immediately and keep you updated on the impact you're making.

With heartfelt gratitude,
[Organization Name]

P.S. Save this email for your tax records. No goods or services were provided in exchange for this donation.`
          }
        ]
      }),

      monthly_giving: () => ({
        name: 'Monthly Giving Conversion Campaign',
        purpose: 'Convert one-time donors to sustainable monthly supporters through education, social proof, and compelling value proposition.',
        targetAudience: 'Active one-time donors who have given 2+ times',
        expectedResults: '8-12% conversion rate, $35 average monthly gift, 94% annual retention',
        sequence: [
          {
            id: 1,
            type: 'trigger',
            title: 'Eligibility Trigger',
            description: 'Donor makes 2nd gift or gives $100+ once',
            content: {
              personalization: ['giving_history', 'average_gift']
            }
          },
          {
            id: 2,
            type: 'wait',
            title: 'Timing Buffer',
            description: 'Wait after recent donation',
            timing: '30 days'
          },
          {
            id: 3,
            type: 'email',
            title: 'Introduction Email',
            description: 'Introduce monthly giving concept',
            timing: 'Day 30',
            content: {
              subject: 'A special invitation for our loyal supporters',
              preview: 'Join our Changemaker Circle monthly giving program',
              personalization: ['first_name', 'total_given', 'suggested_monthly']
            }
          },
          {
            id: 4,
            type: 'wait',
            title: 'Consideration Period',
            description: 'Time to consider first email',
            timing: '7 days'
          },
          {
            id: 5,
            type: 'email',
            title: 'Social Proof Email',
            description: 'Share monthly donor testimonials',
            timing: 'Day 37',
            content: {
              subject: 'Why Sarah gives $25 every month',
              preview: 'Hear from monthly donors like you',
              personalization: ['first_name', 'monthly_impact']
            }
          },
          {
            id: 6,
            type: 'wait',
            title: 'Follow-up Gap',
            description: 'Space before final ask',
            timing: '5 days'
          },
          {
            id: 7,
            type: 'email',
            title: 'Value Proposition Email',
            description: 'Clear benefits and easy signup',
            timing: 'Day 42',
            content: {
              subject: 'Small monthly gifts create BIG impact',
              preview: 'See what $[amount]/month accomplishes',
              personalization: ['first_name', 'suggested_monthly', 'annual_impact']
            }
          },
          {
            id: 8,
            type: 'condition',
            title: 'Conversion Check',
            description: 'Did donor convert to monthly?',
            timing: 'Day 45'
          },
          {
            id: 9,
            type: 'email',
            title: 'Welcome to Monthly (Converted)',
            description: 'Special welcome for new monthly donors',
            timing: 'Immediate',
            content: {
              subject: 'Welcome to the Changemaker Circle!',
              preview: 'Thank you for your monthly commitment',
              personalization: ['first_name', 'monthly_amount', 'exclusive_benefits']
            }
          },
          {
            id: 10,
            type: 'email',
            title: 'Final Soft Ask (Not Converted)',
            description: 'One more gentle invitation',
            timing: 'Day 60',
            content: {
              subject: 'Is monthly giving right for you?',
              preview: 'No pressure - just wanted to check',
              personalization: ['first_name', 'faq_link']
            }
          }
        ],
        bestPractices: [
          'Target donors with giving history showing commitment',
          'Suggest monthly amount based on average gift ÷ 3',
          'Emphasize convenience and impact over time',
          'Address common concerns (control, cancellation)',
          'Use social proof from similar donors',
          'Make signup process extremely simple',
          'Offer exclusive benefits for monthly donors',
          'Follow up quickly with welcome package'
        ],
        metrics: [
          { metric: 'Email Open Rate', benchmark: '35-40%', trackingMethod: 'Email platform' },
          { metric: 'Conversion Rate', benchmark: '8-12%', trackingMethod: 'Monthly signups' },
          { metric: 'Average Monthly Gift', benchmark: '$35', trackingMethod: 'Payment processor' },
          { metric: 'First Payment Success', benchmark: '95%+', trackingMethod: 'Payment reports' },
          { metric: '12-Month Retention', benchmark: '94%', trackingMethod: 'Donor database' }
        ],
        templates: [
          {
            name: 'Introduction Email',
            subject: 'A special invitation for our loyal supporters',
            body: `Dear [First Name],

Thank you for being such a dedicated supporter! Your [number] gifts totaling $[total] have made a real difference in our community.

Today, I want to invite you to join our Changemaker Circle - a special group of monthly donors who provide steady support that helps us plan ahead and serve more people.

Here's why monthly giving might be perfect for you:

✓ **Bigger Impact**: Your $[suggested monthly]/month = $[annual total]/year
✓ **Easier Budgeting**: Small automatic gifts are easier than writing big checks
✓ **Less Mail**: Fewer donation requests since you're already giving
✓ **Special Updates**: Exclusive monthly donor impact reports
✓ **Total Control**: Change or cancel anytime with one email

For example, just $25/month provides:
• Meals for a family for one week every month
• School supplies for 3 children each semester
• Job training materials for someone seeking employment

Would you consider joining our monthly donors? It takes just 2 minutes:

[Start My Monthly Gift Button]

Thank you for considering this sustainable way to support our mission.

With appreciation,
[Name]
[Title]

P.S. Have questions? Reply to this email or check our FAQ: [link]`
          }
        ]
      }),

      year_end_campaign: () => ({
        name: 'Year-End Giving Campaign Automation',
        purpose: 'Maximize donations during critical year-end period through strategic timing, urgency, and compelling storytelling.',
        targetAudience: 'All donors and engaged subscribers',
        expectedResults: '35% of annual revenue, 28% response rate, $125 average gift',
        sequence: [
          {
            id: 1,
            type: 'trigger',
            title: 'Campaign Launch',
            description: 'November 15 or Giving Tuesday',
            timing: 'November 15'
          },
          {
            id: 2,
            type: 'email',
            title: 'Campaign Announcement',
            description: 'Launch with compelling story and goal',
            timing: 'Day 1',
            content: {
              subject: 'Our year-end campaign begins: You can change lives',
              preview: 'Help us reach our $100,000 goal by December 31',
              personalization: ['first_name', 'past_support', 'campaign_goal']
            }
          },
          {
            id: 3,
            type: 'wait',
            title: 'Initial Response Period',
            description: 'Allow early donors to give',
            timing: '7 days'
          },
          {
            id: 4,
            type: 'email',
            title: 'Progress Update 1',
            description: 'Share early momentum',
            timing: 'Day 8',
            content: {
              subject: 'Amazing! We\'re 25% to our goal',
              preview: 'See who\'s already making a difference',
              personalization: ['first_name', 'progress_bar', 'donor_count']
            }
          },
          {
            id: 5,
            type: 'email',
            title: 'Giving Tuesday Push',
            description: 'Special Giving Tuesday appeal',
            timing: 'Giving Tuesday',
            content: {
              subject: '#GivingTuesday: Your gift DOUBLED today only',
              preview: 'Matching gift opportunity - don\'t miss out',
              personalization: ['first_name', 'match_amount', 'deadline']
            }
          },
          {
            id: 6,
            type: 'condition',
            title: 'Donor Status Check',
            description: 'Has contact donated yet?',
            timing: 'December 1'
          },
          {
            id: 7,
            type: 'email',
            title: 'Thank You (Donors)',
            description: 'Thank donors, suggest additional gift',
            timing: 'December 5',
            content: {
              subject: 'Thank you! Want to double your impact?',
              preview: 'Your gift is already at work',
              personalization: ['first_name', 'donation_amount', 'additional_impact']
            }
          },
          {
            id: 8,
            type: 'email',
            title: 'Urgency Email (Non-Donors)',
            description: 'Create urgency for non-donors',
            timing: 'December 15',
            content: {
              subject: 'Only 16 days left to make your 2024 impact',
              preview: 'Tax-deductible deadline approaching',
              personalization: ['first_name', 'tax_benefits', 'suggested_amount']
            }
          },
          {
            id: 9,
            type: 'email',
            title: 'Final Week Push',
            description: 'Last chance messaging',
            timing: 'December 26',
            content: {
              subject: 'Final week: Help us reach our goal',
              preview: 'Every gift counts before midnight Dec 31',
              personalization: ['first_name', 'amount_needed', 'impact_summary']
            }
          },
          {
            id: 10,
            type: 'email',
            title: 'Last Day Appeal',
            description: 'Final urgent appeal',
            timing: 'December 31, 10 AM',
            content: {
              subject: '14 hours left for your 2024 tax deduction',
              preview: 'Make your gift by midnight tonight',
              personalization: ['first_name', 'quick_donate_link', 'phone_option']
            }
          },
          {
            id: 11,
            type: 'email',
            title: 'Campaign Wrap-Up',
            description: 'Thank everyone and share results',
            timing: 'January 3',
            content: {
              subject: 'We did it! Thank you for an incredible year',
              preview: 'See what we accomplished together',
              personalization: ['first_name', 'final_total', 'impact_preview']
            }
          }
        ],
        bestPractices: [
          'Start campaign before Thanksgiving for maximum duration',
          'Use thermometer graphics to show progress',
          'Leverage matching gifts to create urgency',
          'Segment messages based on giving history',
          'Increase frequency as deadline approaches',
          'Make mobile donating extremely easy',
          'Provide multiple giving options (online, phone, mail)',
          'Plan for December 31 website traffic surge'
        ],
        metrics: [
          { metric: 'Campaign Revenue', benchmark: '35% of annual', trackingMethod: 'Revenue tracking' },
          { metric: 'Email Open Rate', benchmark: '30-35%', trackingMethod: 'Email analytics' },
          { metric: 'Response Rate', benchmark: '25-30%', trackingMethod: 'Donation conversions' },
          { metric: 'Average Gift', benchmark: '$125', trackingMethod: 'Payment processing' },
          { metric: 'New Donor Acquisition', benchmark: '20% new', trackingMethod: 'CRM analysis' }
        ],
        templates: [
          {
            name: 'Campaign Launch Email',
            subject: 'Our year-end campaign begins: You can change lives',
            body: `Dear [First Name],

As 2024 comes to a close, I'm writing with an urgent request and an incredible opportunity.

Right now, families in our community are facing unprecedented challenges. But together, we can ensure that 2025 brings hope, not hardship.

**Our Year-End Goal: $100,000 by December 31**

This isn't just a number. It represents:
• 500 families receiving emergency assistance
• 200 children in our education programs
• 1,000 nutritious meals every week
• 50 adults trained for living-wage jobs

[Past support acknowledgment]

Will you help us reach this critical goal? Your tax-deductible gift today will immediately support families in need.

[Give Now Button - Multiple Amount Options]

Every gift matters:
• $50 feeds a family for a week
• $100 provides job training materials
• $250 keeps a child in after-school programs for a month
• $500 prevents one family's eviction

Together, we can make 2025 a year of hope and transformation.

With gratitude and urgency,
[Name]
[Title]

P.S. Don't forget - all gifts are tax-deductible for 2024 if made by December 31!`
          }
        ]
      })
    };

    const template = templates[automationType] || templates.welcome_series;
    return template();
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'wait': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'condition': return <Filter className="h-4 w-4 text-purple-600" />;
      case 'action': return <Send className="h-4 w-4 text-orange-600" />;
      default: return <ArrowRight className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'wait': return 'bg-gray-100 text-gray-800';
      case 'condition': return 'bg-purple-100 text-purple-800';
      case 'action': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Email Automation Builder
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create powerful email sequences that nurture relationships automatically
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Automation Type</label>
            <Select value={automationType} onValueChange={setAutomationType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose automation to build" />
              </SelectTrigger>
              <SelectContent>
                {automationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Who will receive this?" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((aud) => (
                    <SelectItem key={aud.value} value={aud.value}>
                      {aud.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Goal</label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="What's the objective?" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={createAutomation} 
            disabled={isGenerating || !automationType || !audience || !goal}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Building Automation...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Create Email Automation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {automation && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{automation.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{automation.purpose}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {automation.targetAudience}
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  Expected: {automation.expectedResults}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automation Sequence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automation.sequence.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-full ${getStepColor(step.type)}`}>
                        {getStepIcon(step.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{step.title}</h4>
                        {step.timing && (
                          <Badge variant="outline" className="text-xs">
                            {step.timing}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      
                      {step.content && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                          {step.content.subject && (
                            <p><strong>Subject:</strong> {step.content.subject}</p>
                          )}
                          {step.content.preview && (
                            <p className="text-gray-600"><strong>Preview:</strong> {step.content.preview}</p>
                          )}
                          {step.content.personalization && (
                            <div className="mt-1">
                              <strong>Personalization:</strong>
                              {step.content.personalization.map((field, i) => (
                                <Badge key={i} variant="outline" className="ml-1 text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {index < automation.sequence.length - 1 && (
                        <div className="ml-0 mt-2 mb-2 border-l-2 border-gray-200 h-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {automation.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span className="text-sm">{practice}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automation.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-gray-600">{metric.trackingMethod}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Target: {metric.benchmark}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {automation.templates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Templates</CardTitle>
              </CardHeader>
              <CardContent>
                {automation.templates.map((template, index) => (
                  <div key={index} className="space-y-3 mb-6">
                    <h4 className="font-medium">{template.name}</h4>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <p><strong>Subject:</strong> {template.subject}</p>
                      <div className="mt-3">
                        <strong>Body:</strong>
                        <pre className="whitespace-pre-wrap text-sm mt-2 font-sans">
                          {template.body}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};