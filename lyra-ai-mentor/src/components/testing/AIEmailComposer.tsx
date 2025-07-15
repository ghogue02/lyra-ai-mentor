import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface EmailScenario {
  id: string;
  title: string;
  context: string;
  recipient: string;
  purpose: string;
}

const emailScenarios: EmailScenario[] = [
  {
    id: 'program_update',
    title: 'Program Update',
    context: 'You need to inform your team about the successful launch of a new after-school program in Brooklyn that served 50 kids in its first week.',
    recipient: 'Your program team',
    purpose: 'Share positive program update and next steps'
  },
  {
    id: 'donor_thank_you',
    title: 'Donor Thank You',
    context: 'Ms. Rodriguez from Queens just donated $500 to your youth mentorship program. She specifically requested updates on how her gift will be used.',
    recipient: 'Ms. Rodriguez (Donor)',
    purpose: 'Thank donor and explain impact'
  },
  {
    id: 'volunteer_recruitment',
    title: 'Volunteer Recruitment',
    context: 'You need volunteers for your upcoming food distribution event in the Bronx next Saturday. You need 20 volunteers for a 4-hour shift.',
    recipient: 'Your volunteer email list',
    purpose: 'Recruit volunteers for specific event'
  },
  {
    id: 'board_update',
    title: 'Board Update',
    context: 'The board meeting is next week. You need to send a brief update on Q3 fundraising progress (85% of goal reached) and highlight key wins.',
    recipient: 'Board of Directors',
    purpose: 'Provide quarterly update before meeting'
  },
  {
    id: 'partner_outreach',
    title: 'Partnership Request',
    context: 'You want to partner with a local Staten Island restaurant to donate surplus food to your meal program. This is your first outreach.',
    recipient: 'Restaurant owner',
    purpose: 'Propose new partnership opportunity'
  }
];

export const AIEmailComposer = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('professional');
  const [userDraft, setUserDraft] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scenario = emailScenarios.find(s => s.id === selectedScenario);

  const handleGenerate = () => {
    if (!selectedScenario) return;
    
    setIsLoading(true);
    setHasInteracted(true);
    
    // Simulate AI generation
    setTimeout(() => {
      let email = '';
      const currentScenario = emailScenarios.find(s => s.id === selectedScenario);
      
      if (currentScenario) {
        switch (selectedScenario) {
          case 'program_update':
            email = selectedTone === 'professional' 
              ? `Subject: Exciting Update: Brooklyn After-School Program Successfully Launched

Dear Team,

I'm pleased to share that our new after-school program in Brooklyn has successfully launched, serving 50 children in its first week of operation.

Key Highlights:
• 50 students enrolled (125% of initial target)
• 8 volunteer tutors recruited and trained
• Partnership established with PS 123 for facility use
• 95% parent satisfaction in initial survey

Next Steps:
• Staff meeting Tuesday at 3pm to discuss expansion plans
• Parent orientation scheduled for next Thursday
• Grant report due by month-end

Thank you all for your dedication in making this launch a success. Your hard work is creating real impact in our Brooklyn community.

Best regards,
[Your Name]`
              : `Subject: 🎉 Amazing News from Brooklyn!

Hi Team!

I just had to share this incredible news – our Brooklyn after-school program is off to an AMAZING start! We welcomed 50 kids this week, and the energy has been absolutely electric!

The kids are loving it, parents are thrilled, and our volunteers are doing fantastic work. We even had more signups than expected (we planned for 40 but got 50!).

Quick wins to celebrate:
• Kids are already asking if we'll be open during school breaks 
• Parents volunteered to help with snacks
• Principal wants to refer more students

Let's chat Tuesday at 3pm about how we can keep this momentum going. Bring your ideas!

So proud of this team! 🌟

[Your Name]`;
            break;
            
          case 'donor_thank_you':
            email = selectedTone === 'professional'
              ? `Subject: Thank You for Your Generous Support of Our Youth Mentorship Program

Dear Ms. Rodriguez,

On behalf of our entire organization, I want to express our sincere gratitude for your generous donation of $500 to our youth mentorship program.

Your gift will directly support 10 young people in Queens by providing:
• One-on-one mentoring sessions for 3 months
• Educational supplies and resources
• Transportation assistance for program participants
• Healthy snacks during after-school sessions

As requested, I'll send you monthly updates on the program's progress. Our next update will include stories from the mentees and mentors whose lives you're helping to transform.

Your investment in our community's youth makes a lasting difference. Thank you for believing in their potential.

With appreciation,
[Your Name]
[Your Title]`
              : `Subject: Your Gift is Already Making a Difference! 

Dear Ms. Rodriguez,

I just received word about your wonderful $500 donation, and I had to reach out immediately to say THANK YOU! Your generosity means the world to us and the young people we serve.

I'm excited to share exactly how your gift will help:
• Maria, 16, will get matched with a mentor who shares her passion for engineering
• José and 9 other teens will have transportation to our career workshops
• Every student will have the supplies they need to succeed

You mentioned wanting updates – I'll be sending you stories and photos each month showing the real impact of your support. The kids are already planning their first community service project!

Thank you for joining our mission to empower Queens youth. Together, we're changing lives!

Warmly,
[Your Name]`;
            break;
            
          case 'volunteer_recruitment':
            email = selectedTone === 'professional'
              ? `Subject: Volunteer Opportunity: Food Distribution Event - Saturday, [Date]

Dear Valued Volunteers,

We need your help for an important food distribution event in the Bronx next Saturday, [Date].

Event Details:
• Date: Saturday, [Date]
• Time: 9:00 AM - 1:00 PM (4-hour shift)
• Location: [Venue Name], Bronx
• Volunteers Needed: 20

Volunteer Responsibilities:
• Set up distribution stations
• Sort and pack food items
• Assist families with food selection
• Help with cleanup

Requirements:
• Ability to lift up to 25 pounds
• Comfortable standing for extended periods
• Enthusiasm for serving our community

Please RSVP by Wednesday to confirm your participation. Light refreshments will be provided.

Thank you for your continued support.

[Your Name]
[Volunteer Coordinator]`
              : `Subject: Join Us Next Saturday – Your Neighbors Need You! 🍎

Hi Amazing Volunteers!

We've got a special opportunity coming up, and we need YOUR help to make it happen!

Next Saturday, we're hosting a food distribution event in the Bronx, and we need 20 compassionate volunteers to help us serve our neighbors in need.

Here's the scoop:
📅 When: Saturday [Date], 9 AM - 1 PM
📍 Where: [Venue Name] in the Bronx
🍎 What: Help distribute fresh food to 200+ families
☕ Perks: Free coffee, snacks, and lots of grateful smiles!

It's going to be energizing, meaningful, and fun – I promise! Last time, volunteers told me it was the highlight of their month.

Can you join us? Just reply to this email or click [RSVP link].

Together, we can make sure no family in our community goes hungry this weekend.

With gratitude and hope,
[Your Name]`;
            break;
            
          case 'board_update':
            email = `Subject: Q3 Fundraising Update – 85% of Goal Achieved

Dear Board Members,

I'm pleased to provide this brief update ahead of next week's board meeting.

Q3 Fundraising Highlights:
• Total Raised: $425,000 (85% of $500,000 goal)
• New Donors: 127 
• Donor Retention Rate: 78% (up from 72% last quarter)
• Major Gifts: 3 gifts of $10,000+

Key Wins:
• Successful virtual gala raised $85,000
• New monthly giving program launched with 45 members
• Corporate partnership with NYC Tech Corp secured

Areas of Focus:
• Final Q3 push to reach 100% of goal
• Year-end campaign planning underway
• Grant applications submitted for 2024 funding

I look forward to discussing these results and our Q4 strategy at next week's meeting.

Best regards,
[Your Name]
[Your Title]`;
            break;
            
          case 'partner_outreach':
            email = selectedTone === 'professional'
              ? `Subject: Partnership Opportunity – Help Fight Food Insecurity in Staten Island

Dear [Restaurant Owner Name],

I hope this message finds you well. My name is [Your Name] from [Organization Name], a non-profit dedicated to addressing food insecurity in Staten Island.

I'm reaching out because we admire [Restaurant Name]'s commitment to our community, and I believe we share a common goal of ensuring no neighbor goes hungry.

Partnership Proposal:
We're seeking restaurant partners to donate surplus food that would otherwise go to waste. This food would go directly to families in need through our meal distribution program.

Benefits to [Restaurant Name]:
• Tax-deductible donations
• Reduced food waste disposal costs
• Positive community impact and PR
• Monthly impact reports showing your contribution

We currently serve 300+ families weekly and your participation would help us expand our reach.

Would you be available for a brief 15-minute call next week to discuss this opportunity? I'm confident we can create a partnership that works seamlessly with your operations.

Thank you for considering this opportunity to make a difference together.

Sincerely,
[Your Name]
[Your Title]`
              : `Subject: Let's Team Up to Feed Staten Island Families! 🍝

Hi [Restaurant Owner Name]!

I'm [Your Name] from [Organization Name], and I have an idea that I think you'll love.

Every week, we see families in Staten Island struggling to put food on the table. Meanwhile, great restaurants like yours sometimes have perfectly good food that doesn't get sold. What if we could connect the dots?

Here's my simple proposal:
• You donate surplus food (whatever works for you)
• We pick it up on your schedule
• Families get nutritious meals
• You get tax benefits + amazing karma! 

No pressure, no complicated contracts – just neighbors helping neighbors.

Plus, imagine telling your customers that their favorite restaurant is helping feed local families. Talk about a win-win! 

Got 15 minutes next week for a quick coffee chat? I'd love to hear your thoughts and answer any questions.

Looking forward to potentially partnering with you!

Cheers,
[Your Name]`;
            break;
        }
      }
      
      setGeneratedEmail(email);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleCopyAndEdit = () => {
    setUserDraft(generatedEmail);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            AI Email Composer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scenario">Choose an email scenario:</Label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger id="scenario">
                <SelectValue placeholder="Select a scenario to practice" />
              </SelectTrigger>
              <SelectContent>
                {emailScenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {scenario && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-blue-900">Scenario Context:</p>
              <p className="text-sm text-blue-800">{scenario.context}</p>
              <div className="flex gap-4 text-xs text-blue-700">
                <span><strong>To:</strong> {scenario.recipient}</span>
                <span><strong>Purpose:</strong> {scenario.purpose}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tone">Select tone:</Label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly & Warm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!selectedScenario || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Email...
              </>
            ) : (
              'Generate Email'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Email Display */}
      {generatedEmail && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Email</span>
              {showSuccess && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Generated successfully!
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">{generatedEmail}</pre>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRegenerate} size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button variant="outline" onClick={handleCopyAndEdit} size="sm">
                Copy to Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Draft Area */}
      {userDraft && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={userDraft}
              onChange={(e) => setUserDraft(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Edit the generated email to add your personal touch..."
            />
            <p className="text-sm text-gray-600 mt-2">
              ✏️ Add personal touches, specific details, and ensure it matches your organization's voice.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Learning Tips */}
      {hasInteracted && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-purple-900 mb-2">💡 Email Writing Tips:</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Always personalize AI-generated content with specific details</li>
              <li>• Match the tone to your relationship with the recipient</li>
              <li>• Keep subject lines clear and action-oriented</li>
              <li>• Review for accuracy before sending</li>
              <li>• Add a personal sign-off that reflects your organization's culture</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};