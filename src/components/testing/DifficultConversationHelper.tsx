import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Copy, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface DifficultConversationHelperProps {
  onComplete?: () => void;
}

export const DifficultConversationHelper: React.FC<DifficultConversationHelperProps> = ({ onComplete }) => {
  const [scenario, setScenario] = useState<string>('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState<string>('professional_warm');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [guidelines, setGuidelines] = useState<string[]>([]);

  const scenarioTypes = [
    { 
      value: 'decline_request', 
      label: 'Decline a Request', 
      description: 'Say no while maintaining relationships',
      examples: ['Partnership decline', 'Volunteer role decline', 'Speaking engagement decline']
    },
    { 
      value: 'address_complaint', 
      label: 'Address a Complaint', 
      description: 'Respond to concerns professionally',
      examples: ['Program dissatisfaction', 'Service complaint', 'Policy disagreement']
    },
    { 
      value: 'budget_cuts', 
      label: 'Communicate Budget Cuts', 
      description: 'Deliver difficult financial news',
      examples: ['Program reduction', 'Staff changes', 'Service limitations']
    },
    { 
      value: 'policy_change', 
      label: 'Announce Policy Changes', 
      description: 'Explain unpopular but necessary changes',
      examples: ['New requirements', 'Process changes', 'Eligibility updates']
    },
    { 
      value: 'performance_issue', 
      label: 'Address Performance', 
      description: 'Discuss concerns with staff or volunteers',
      examples: ['Missed deadlines', 'Quality concerns', 'Attendance issues']
    },
    { 
      value: 'funding_rejection', 
      label: 'Deliver Funding News', 
      description: 'Communicate grant or funding decisions',
      examples: ['Grant denial', 'Reduced funding', 'Application feedback']
    }
  ];

  const toneOptions = [
    { value: 'professional_warm', label: 'Professional & Warm', description: 'Maintains professionalism with empathy' },
    { value: 'direct_respectful', label: 'Direct & Respectful', description: 'Clear and straightforward while courteous' },
    { value: 'empathetic_firm', label: 'Empathetic & Firm', description: 'Understanding but maintains boundaries' },
    { value: 'collaborative', label: 'Collaborative', description: 'Invites dialogue and solutions' }
  ];

  const generateEmail = async () => {
    if (!scenario || !context.trim()) {
      toast.error('Please select a scenario and provide context');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = createDifficultEmail(scenario, context, tone);
      setGeneratedEmail(result.email);
      setGuidelines(result.guidelines);
      
      toast.success('Difficult conversation email generated!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createDifficultEmail = (scenarioType: string, userContext: string, selectedTone: string): { email: string; guidelines: string[] } => {
    const selectedScenario = scenarioTypes.find(s => s.value === scenarioType);
    const toneInfo = toneOptions.find(t => t.value === selectedTone);
    
    let email = '';
    let guidelines: string[] = [];

    switch (scenarioType) {
      case 'decline_request':
        email = `Subject: Re: [Request/Partnership Opportunity]

Dear [Name],

Thank you for thinking of [Organization Name] for this opportunity. We appreciate your interest in partnering with us.

After careful consideration, we've determined that we won't be able to move forward with this request at this time. This decision comes after reviewing our current capacity and strategic priorities for the year.

Context: ${userContext}

While we can't participate in this particular initiative, we'd like to suggest some alternatives that might be helpful:
• [Alternative resource or organization]
• [Different timing suggestion]
• [Modified scope possibility]

We value the relationship with your organization and hope there may be opportunities to collaborate in the future under different circumstances.

Thank you again for considering us, and we wish you success with this initiative.

Best regards,
[Your name]
[Your title]
[Organization name]`;

        guidelines = [
          'Express genuine appreciation for being considered',
          'Be clear about the decision without over-explaining',
          'Offer alternatives when possible',
          'Keep the door open for future opportunities',
          'Maintain a warm, professional tone throughout'
        ];
        break;

      case 'address_complaint':
        email = `Subject: Your Concerns About [Program/Service]

Dear [Name],

Thank you for bringing your concerns to our attention. We take all feedback seriously as it helps us improve our services.

I understand that you experienced: ${userContext}

First, I want to acknowledge how frustrating this must have been for you. This is not the experience we want anyone to have with our organization.

Here's what we're doing to address this:
• [Immediate action taken]
• [Process improvement implemented]
• [Follow-up steps planned]

We would welcome the opportunity to discuss this further. Would you be available for a brief phone call this week? I'd like to ensure we fully understand your experience and that you feel heard.

Please don't hesitate to reach out if you have any additional concerns or suggestions.

Sincerely,
[Your name]
[Your title]
[Direct phone number]`;

        guidelines = [
          'Acknowledge their feelings and validate their experience',
          'Take responsibility without making excuses',
          'Outline specific steps being taken',
          'Offer direct communication and follow-up',
          'Express genuine commitment to improvement'
        ];
        break;

      case 'budget_cuts':
        email = `Subject: Important Update Regarding [Program/Service]

Dear [Stakeholder/Participant],

I'm writing to inform you of some necessary changes to [Program Name] due to budget constraints we're currently facing.

The situation: ${userContext}

Effective [Date], we will need to [specific change - reduce hours/services/capacity]. This was not an easy decision, and we understand the impact this may have on you and others who depend on our services.

What this means for you:
• [Specific impact on recipient]
• [Available alternatives or resources]
• [Timeline for changes]

What we're doing to minimize impact:
• [Mitigation efforts]
• [Alternative resources being explored]
• [Future planning information]

We are committed to continuing to serve our community in the best way possible within our current resources. If you have questions or concerns, please don't hesitate to contact me directly.

Thank you for your understanding during this challenging time.

With appreciation,
[Your name]
[Your title]`;

        guidelines = [
          'Be transparent about the situation',
          'Explain the impact clearly and honestly',
          'Show you understand the difficulty this creates',
          'Provide concrete information about alternatives',
          'Maintain hope while being realistic'
        ];
        break;

      case 'policy_change':
        email = `Subject: Important Policy Update - [Program/Service Name]

Dear [Participants/Stakeholders],

We're writing to inform you of an important policy change that will take effect on [Date].

Background: ${userContext}

The change: [Specific policy modification]

Why this change is necessary:
• [Reason 1 - compliance, safety, efficiency, etc.]
• [Reason 2]
• [Reason 3]

How this affects you:
• [Impact 1]
• [Impact 2]
• [Support available during transition]

We understand that changes can be challenging, and we're committed to making this transition as smooth as possible. We'll be hosting an information session on [Date] to answer questions and provide additional support.

If you have immediate concerns or questions, please contact [Contact information].

Thank you for your patience as we implement this change to better serve our community.

Best regards,
[Your name]
[Organization name]`;

        guidelines = [
          'Provide clear rationale for the change',
          'Explain the benefits to the community',
          'Offer support during the transition',
          'Create opportunities for questions and dialogue',
          'Express appreciation for their understanding'
        ];
        break;

      case 'performance_issue':
        email = `Subject: Let's Schedule a Conversation

Dear [Name],

I hope this email finds you well. I'd like to schedule some time to meet with you this week to discuss your work with [Program/Project].

Context: ${userContext}

I believe it would be helpful for us to have an open conversation about expectations, challenges, and how we can best support your success in this role.

Could we meet for about 30 minutes sometime this week? I'm available:
• [Time option 1]
• [Time option 2]
• [Time option 3]

Please let me know what works best for you, or suggest an alternative time if none of these work.

I'm looking forward to our conversation.

Best regards,
[Your name]
[Your title]`;

        guidelines = [
          'Keep the initial email brief and non-threatening',
          'Focus on scheduling rather than detailing issues',
          'Frame it as a supportive conversation',
          'Offer multiple meeting time options',
          'Save detailed discussion for the in-person meeting'
        ];
        break;

      case 'funding_rejection':
        email = `Subject: Update on Your [Grant/Funding] Application

Dear [Applicant Name],

Thank you for submitting your application for [Grant/Funding Program]. We appreciate the time and effort you put into your proposal.

Context: ${userContext}

After careful review by our selection committee, we regret to inform you that we will not be able to fund your project at this time. This was a highly competitive process, and we received many excellent proposals.

While we cannot provide funding for this particular request, we'd like to offer some feedback that may be helpful for future applications:
• [Constructive feedback point 1]
• [Constructive feedback point 2]
• [Suggestion for improvement]

We encourage you to apply for future funding opportunities. Our next application cycle will open on [Date], and we'd welcome a revised proposal.

If you'd like to discuss this feedback in more detail, please feel free to schedule a brief call with me.

Thank you again for your interest in partnering with us, and we wish you success in securing funding for this important work.

Sincerely,
[Your name]
[Your title]
[Program name]`;

        guidelines = [
          'Acknowledge the effort they put into their application',
          'Provide constructive, specific feedback when possible',
          'Encourage future applications',
          'Offer additional support or conversation',
          'End on an encouraging, supportive note'
        ];
        break;

      default:
        email = `Subject: [Subject Line]

Dear [Name],

Context: ${userContext}

[Generated email content based on your scenario]

Best regards,
[Your name]`;
        guidelines = ['Review and personalize the message', 'Ensure tone matches your intent'];
    }

    return { email, guidelines };
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard!');
  };

  const selectedScenario = scenarioTypes.find(s => s.value === scenario);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            Difficult Conversation Helper
          </CardTitle>
          <p className="text-sm text-gray-600">
            Navigate challenging communications with professionalism and empathy
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Conversation Type</label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger>
                <SelectValue placeholder="What type of difficult conversation?" />
              </SelectTrigger>
              <SelectContent>
                {scenarioTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedScenario && (
              <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Examples:</strong> {selectedScenario.examples.join(', ')}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Situation Context
            </label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the specific situation. For example: 'A community member is upset about our new volunteer background check policy' or 'We need to reduce our food pantry hours due to staffing shortages'"
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Communication Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((toneOption) => (
                  <SelectItem key={toneOption.value} value={toneOption.value}>
                    <div>
                      <div className="font-medium">{toneOption.label}</div>
                      <div className="text-xs text-gray-500">{toneOption.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateEmail} 
            disabled={isGenerating || !scenario || !context.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Crafting Email...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Generate Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedEmail && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Difficult Conversation Email
              </CardTitle>
              <Button variant="outline" size="sm" onClick={copyEmail}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <Badge variant="secondary" className="w-fit">
              {selectedScenario?.label} - {toneOptions.find(t => t.value === tone)?.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-80">
                {generatedEmail}
              </pre>
            </div>

            {guidelines.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">💡 Best Practices for This Conversation:</h4>
                <ul className="space-y-1">
                  {guidelines.map((guideline, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Adapt this message to your specific situation and organization's voice. Consider following up with a phone call for particularly sensitive conversations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};