
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Copy, Sparkles, Eye, MousePointer } from 'lucide-react';
import { toast } from 'sonner';

interface AIEmailCampaignWriterProps {
  onComplete?: () => void;
}

interface EmailCampaign {
  subject: string;
  preheader: string;
  content: string;
  callToAction: string;
  estimatedOpenRate: string;
  estimatedClickRate: string;
  tips: string[];
}

export const AIEmailCampaignWriter: React.FC<AIEmailCampaignWriterProps> = ({ onComplete }) => {
  const [campaignType, setCampaignType] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [keyMessage, setKeyMessage] = useState('');
  const [tone, setTone] = useState<string>('');
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const campaignTypes = [
    { value: 'donation_appeal', label: 'Donation Appeal', description: 'Ask for financial support' },
    { value: 'newsletter', label: 'Newsletter', description: 'Regular updates and stories' },
    { value: 'event_invitation', label: 'Event Invitation', description: 'Invite to fundraiser or event' },
    { value: 'volunteer_recruitment', label: 'Volunteer Recruitment', description: 'Recruit new volunteers' },
    { value: 'impact_report', label: 'Impact Report', description: 'Share program outcomes' },
    { value: 'thank_you', label: 'Thank You', description: 'Appreciate donors/volunteers' },
    { value: 'advocacy', label: 'Advocacy Alert', description: 'Call to action on issue' },
    { value: 'year_end', label: 'Year-End Campaign', description: 'End of year giving' }
  ];

  const audiences = [
    { value: 'current_donors', label: 'Current Donors', description: 'Active supporters' },
    { value: 'lapsed_donors', label: 'Lapsed Donors', description: 'Haven\'t given recently' },
    { value: 'major_donors', label: 'Major Donors', description: 'High-value supporters' },
    { value: 'volunteers', label: 'Volunteers', description: 'Active volunteers' },
    { value: 'subscribers', label: 'Newsletter Subscribers', description: 'Email list' },
    { value: 'event_attendees', label: 'Event Attendees', description: 'Past event participants' }
  ];

  const tones = [
    { value: 'inspiring', label: 'Inspiring', description: 'Uplifting and motivational' },
    { value: 'urgent', label: 'Urgent', description: 'Time-sensitive appeal' },
    { value: 'grateful', label: 'Grateful', description: 'Appreciative and warm' },
    { value: 'informative', label: 'Informative', description: 'Educational and factual' },
    { value: 'personal', label: 'Personal', description: 'Intimate and story-driven' }
  ];

  const generateCampaign = async () => {
    if (!campaignType || !audience || !keyMessage.trim() || !tone) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = createEmailCampaign();
      setCampaign(result);
      
      toast.success('Email campaign generated!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate campaign. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createEmailCampaign = (): EmailCampaign => {
    const selectedType = campaignTypes.find(t => t.value === campaignType);
    let subject = '';
    let preheader = '';
    let content = '';
    let callToAction = '';
    let tips: string[] = [];

    switch (campaignType) {
      case 'donation_appeal':
        subject = `[First Name], ${keyMessage}`;
        preheader = 'Your support makes all the difference in NYC communities';
        content = `Dear [First Name],

I hope this message finds you well. ${keyMessage}

Right here in New York City, we're witnessing something remarkable. Despite the challenges our communities face, neighbors are coming together to create real change. And you're a vital part of this movement.

Just last week, Maria from Queens shared how our programs helped her family find stable housing after months of uncertainty. "I didn't know where to turn," she told us. "But you gave us hope when we needed it most."

Stories like Maria's are possible because of supporters like you. Every dollar you contribute stays right here in NYC, directly funding:

• Emergency assistance for families in crisis
• Job training programs that lead to living wages  
• Youth mentorship that breaks cycles of poverty
• Food security initiatives serving all five boroughs

Will you help us continue this vital work?

[DONATION BUTTON: Give Today]

Your gift of:
• $50 provides a week of meals for a family
• $100 funds job training for one adult
• $250 supports a child's after-school program for a month
• $500 helps a family avoid eviction

We know times are challenging for everyone. Any amount you can give makes a real difference in someone's life.

Thank you for being part of our community of changemakers.

With gratitude,
[Your Name]
[Your Title]

P.S. Monthly giving provides steady support for our programs. Consider becoming a monthly donor at [link].`;
        callToAction = 'Give Today';
        tips = [
          'Send on Tuesday or Thursday between 10 AM - 2 PM',
          'Personalize with donor\'s name and giving history',
          'Follow up with non-openers after 3 days',
          'Include impact photos in HTML version',
          'Test subject lines with A/B testing'
        ];
        break;

      case 'newsletter':
        subject = `${keyMessage} | [Organization] Update`;
        preheader = 'Your impact in action across NYC this month';
        content = `Dear [First Name],

${keyMessage}

**This Month's Highlights**

🌟 Program Spotlight: Youth Leadership Initiative
This month, 45 young people graduated from our leadership program. These remarkable teens are already making waves in their communities, from organizing neighborhood cleanups in Brooklyn to mentoring younger students in the Bronx.

📊 By the Numbers
• 1,247 individuals served
• 342 volunteer hours contributed  
• 15 new corporate partnerships formed
• 89% participant satisfaction rate

💡 Did You Know?
Every $1 invested in our programs generates $4.50 in social value for NYC communities. That's the power of smart, community-driven solutions.

**Upcoming Events**

📅 Annual Spring Gala - April 15th
Join us for an unforgettable evening celebrating our community's resilience. 
[BUTTON: Reserve Your Seat]

🏃 5K Run/Walk for Change - May 20th
Lace up your sneakers and run for a cause! Register your team today.
[BUTTON: Sign Up to Run]

**Volunteer Spotlight: James Chen**
"Volunteering here doesn't feel like work—it feels like family," says James, who's been tutoring with us for three years. Read his full story on our blog.

**How You Can Help**
• Volunteer: We need tutors, mentors, and event support
• Donate: Every gift makes a difference
• Share: Forward this newsletter to spread the word

Thank you for being part of our community!

Warmly,
[Your Name]
[Your Title]`;
        callToAction = 'Read More Stories';
        tips = [
          'Include engaging visuals and photos',
          'Keep sections scannable with headers',
          'Balance stories with data',
          'Include multiple engagement options',
          'Mobile-optimize your design'
        ];
        break;

      case 'volunteer_recruitment':
        subject = `[First Name], ${keyMessage}`;
        preheader = 'Join our team of NYC changemakers';
        content = `Dear [First Name],

${keyMessage}

Have you ever wanted to make a real, tangible difference in your community? Now's your chance.

We're looking for passionate individuals like you to join our volunteer team. Whether you have an hour a week or a day a month, there's a meaningful way for you to contribute.

**Current Volunteer Opportunities:**

📚 **Tutoring & Mentorship**
Help NYC students reach their full potential
• When: Weekday afternoons or weekends
• Where: Multiple locations across all boroughs
• Time: 1-2 hours per week

🥘 **Meal Preparation & Distribution**
Fight food insecurity in our communities
• When: Saturday mornings
• Where: Brooklyn and Manhattan sites
• Time: 3-4 hour shifts

💼 **Professional Skills Volunteers**
Share your expertise to strengthen our programs
• Marketing, finance, IT, HR, and more
• Remote and in-person options
• Flexible scheduling

🎨 **Special Events Support**
Help make our fundraising events successful
• Various dates throughout the year
• Fun, social atmosphere
• No experience necessary

**Why Volunteer With Us?**
✓ Make a direct impact in NYC communities
✓ Meet like-minded, passionate people
✓ Develop new skills and experiences
✓ Flexible scheduling to fit your life
✓ Reference letters available
✓ Free volunteer appreciation events

**What Our Volunteers Say:**
"I started volunteering to give back, but I've gotten so much more in return. The connections I've made and the joy of seeing students succeed is priceless." - Sarah M., Tutor

Ready to make a difference?

[BUTTON: Sign Up to Volunteer]

Questions? Reply to this email or call us at (212) 555-0123.

Looking forward to welcoming you to our team!

Best regards,
[Your Name]
Volunteer Coordinator`;
        callToAction = 'Sign Up to Volunteer';
        tips = [
          'Include photos of happy volunteers',
          'Be specific about time commitments',
          'Highlight the social benefits',
          'Make sign-up process simple',
          'Follow up within 24 hours of sign-up'
        ];
        break;

      default:
        subject = `${keyMessage}`;
        preheader = 'Important update from [Organization Name]';
        content = `Dear [First Name],

${keyMessage}

[Your detailed message here, customized for your campaign type and audience]

Best regards,
[Your Name]
[Your Title]`;
        callToAction = 'Learn More';
        tips = [
          'Keep subject lines under 50 characters',
          'Personalize whenever possible',
          'Include a clear call-to-action',
          'Mobile-optimize your content',
          'Track and analyze results'
        ];
    }

    // Calculate estimated metrics based on campaign type and audience
    const baseOpenRate = 22;
    const baseClickRate = 2.5;
    
    let openRateModifier = 1;
    let clickRateModifier = 1;

    // Adjust based on audience
    switch (audience) {
      case 'current_donors':
        openRateModifier = 1.3;
        clickRateModifier = 1.4;
        break;
      case 'major_donors':
        openRateModifier = 1.5;
        clickRateModifier = 1.6;
        break;
      case 'volunteers':
        openRateModifier = 1.4;
        clickRateModifier = 1.3;
        break;
    }

    // Adjust based on campaign type
    switch (campaignType) {
      case 'thank_you':
        openRateModifier *= 1.2;
        break;
      case 'donation_appeal':
        clickRateModifier *= 1.3;
        break;
      case 'event_invitation':
        openRateModifier *= 1.1;
        clickRateModifier *= 1.2;
        break;
    }

    const estimatedOpenRate = `${Math.round(baseOpenRate * openRateModifier)}%`;
    const estimatedClickRate = `${(baseClickRate * clickRateModifier).toFixed(1)}%`;

    return {
      subject,
      preheader,
      content,
      callToAction,
      estimatedOpenRate,
      estimatedClickRate,
      tips
    };
  };

  const copyCampaign = () => {
    const fullEmail = `Subject: ${campaign?.subject}\nPreheader: ${campaign?.preheader}\n\n${campaign?.content}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success('Email campaign copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            AI Email Campaign Writer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create compelling email campaigns that inspire action
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Type</label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  {campaignTypes.map((type) => (
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

            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Who will receive this?" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((aud) => (
                    <SelectItem key={aud.value} value={aud.value}>
                      <div>
                        <div className="font-medium">{aud.label}</div>
                        <div className="text-xs text-gray-500">{aud.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key Message</label>
            <Textarea
              value={keyMessage}
              onChange={(e) => setKeyMessage(e.target.value)}
              placeholder="What's the main point you want to communicate? For example: 'Help us reach our $50,000 goal to expand youth programs' or 'You're invited to our annual gala on March 15th'"
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Choose email tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-gray-500">{t.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateCampaign} 
            disabled={isGenerating || !campaignType || !audience || !keyMessage.trim() || !tone}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Crafting Your Campaign...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Email Campaign
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {campaign && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Email Campaign</CardTitle>
                <Button variant="outline" size="sm" onClick={copyCampaign}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Line</label>
                  <div className="p-3 bg-gray-50 rounded-lg font-medium">
                    {campaign.subject}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preheader Text</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    {campaign.preheader}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Content</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {campaign.content}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm text-gray-600">Est. Open Rate</p>
                  <p className="font-semibold text-blue-600">{campaign.estimatedOpenRate}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <MousePointer className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <p className="text-sm text-gray-600">Est. Click Rate</p>
                  <p className="font-semibold text-green-600">{campaign.estimatedClickRate}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Button className="h-5 w-5 mx-auto mb-1" variant="ghost" size="sm">
                    CTA
                  </Button>
                  <p className="text-sm text-gray-600">Call to Action</p>
                  <p className="font-semibold text-purple-600">{campaign.callToAction}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Best Practices for This Campaign</h4>
                <ul className="space-y-2">
                  {campaign.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Next steps:</strong> Import this into your email platform, add images and branding, 
                  segment your list, and schedule your send. Always test before sending to your full list!
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
