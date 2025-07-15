import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Edit, 
  Copy, 
  Download, 
  Share2, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Wand2,
  FileText,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  Target,
  BarChart3,
  Clock,
  Zap,
  Settings,
  RefreshCw,
  Save,
  Eye,
  Code,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AIService } from '@/services/aiService';

// Template and execution types
interface ExecutionTemplate {
  id: string;
  name: string;
  type: 'email' | 'social' | 'letter' | 'proposal' | 'newsletter' | 'flyer';
  description: string;
  content: string;
  subject?: string;
  personalizedFields: PersonalizationField[];
  tone: 'professional' | 'warm' | 'urgent' | 'celebratory' | 'informative';
  length: 'short' | 'medium' | 'long';
  channel: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  aiOptimized: boolean;
}

interface PersonalizationField {
  id: string;
  name: string;
  placeholder: string;
  description: string;
  required: boolean;
  type: 'text' | 'number' | 'date' | 'email' | 'select';
  options?: string[];
  defaultValue?: string;
  example: string;
}

interface ExecutionSettings {
  autoPersonalize: boolean;
  aiAssistance: boolean;
  previewMode: boolean;
  batchMode: boolean;
  schedulingEnabled: boolean;
  analyticsTracking: boolean;
}

interface AdaptiveExecutionPanelProps {
  strategy: string;
  audience: string;
  purpose: string;
  onExecute: (template: ExecutionTemplate, settings: ExecutionSettings) => void;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

// Template library based on strategy and audience
const generateExecutionTemplates = (
  strategy: string, 
  audience: string, 
  purpose: string
): ExecutionTemplate[] => {
  const templates: ExecutionTemplate[] = [];

  // Major donor templates
  if (audience === 'major-donors') {
    templates.push({
      id: 'major-donor-cultivation-email',
      name: 'Major Donor Cultivation Email',
      type: 'email',
      description: 'Personalized email to cultivate major donor relationships',
      subject: 'An update on the impact of your generous support',
      content: `Dear {{firstName}},

I hope this message finds you well. I wanted to personally reach out to share some exciting updates about {{organizationName}} and the incredible impact your support has made possible.

Your gift of {{lastGiftAmount}} has truly been transformational. Because of your generosity, we've been able to {{specificImpact}}. I thought you'd be particularly interested to know that {{personalizedUpdate}}.

{{currentInitiative}}

I would love the opportunity to share more about our work and discuss how we might expand our impact together. Would you be available for a brief conversation in the coming weeks? I'm happy to work around your schedule.

Thank you again for your partnership in our mission. Your support means more than words can express.

With deep gratitude,

{{senderName}}
{{title}}
{{organizationName}}
{{contactInfo}}

P.S. {{personalNote}}`,
      personalizedFields: [
        {
          id: 'firstName',
          name: 'First Name',
          placeholder: '{{firstName}}',
          description: 'Donor\'s first name',
          required: true,
          type: 'text',
          example: 'Robert'
        },
        {
          id: 'organizationName',
          name: 'Organization Name',
          placeholder: '{{organizationName}}',
          description: 'Your organization\'s name',
          required: true,
          type: 'text',
          example: 'Future Leaders Foundation'
        },
        {
          id: 'lastGiftAmount',
          name: 'Last Gift Amount',
          placeholder: '{{lastGiftAmount}}',
          description: 'Amount of their most recent gift',
          required: true,
          type: 'text',
          example: '$5,000'
        },
        {
          id: 'specificImpact',
          name: 'Specific Impact',
          placeholder: '{{specificImpact}}',
          description: 'Concrete outcome of their support',
          required: true,
          type: 'text',
          example: 'provide scholarships for 10 students'
        },
        {
          id: 'personalizedUpdate',
          name: 'Personalized Update',
          placeholder: '{{personalizedUpdate}}',
          description: 'News relevant to their interests',
          required: true,
          type: 'text',
          example: 'one of our scholarship recipients was just accepted to medical school'
        },
        {
          id: 'currentInitiative',
          name: 'Current Initiative',
          placeholder: '{{currentInitiative}}',
          description: 'New project or opportunity',
          required: false,
          type: 'text',
          example: 'We\'re excited to launch our new mentorship program this fall...'
        },
        {
          id: 'senderName',
          name: 'Sender Name',
          placeholder: '{{senderName}}',
          description: 'Your full name',
          required: true,
          type: 'text',
          example: 'Sarah Johnson'
        },
        {
          id: 'title',
          name: 'Your Title',
          placeholder: '{{title}}',
          description: 'Your job title',
          required: true,
          type: 'text',
          example: 'Executive Director'
        },
        {
          id: 'contactInfo',
          name: 'Contact Information',
          placeholder: '{{contactInfo}}',
          description: 'Phone and email',
          required: true,
          type: 'text',
          example: 'sarah@futureleaders.org | (555) 123-4567'
        },
        {
          id: 'personalNote',
          name: 'Personal Note',
          placeholder: '{{personalNote}}',
          description: 'Personal touch or shared interest',
          required: false,
          type: 'text',
          example: 'I hope your recent trip to Italy was wonderful!'
        }
      ],
      tone: 'professional',
      length: 'medium',
      channel: 'email',
      estimatedTime: '15 minutes',
      difficulty: 'medium',
      aiOptimized: true
    });

    templates.push({
      id: 'major-donor-proposal',
      name: 'Major Gift Proposal Letter',
      type: 'proposal',
      description: 'Formal proposal for a major gift opportunity',
      content: `Dear {{firstName}},

Thank you for taking the time to learn more about {{organizationName}} and our mission to {{mission}}. Your questions during our recent conversation demonstrated your deep commitment to {{sharedValues}}.

THE OPPORTUNITY

{{organizationName}} is at a pivotal moment. We have an unprecedented opportunity to {{opportunityDescription}}. This initiative will {{expectedOutcome}}.

YOUR INVESTMENT

We are seeking a transformational gift of {{proposedAmount}} to {{specificUse}}. This investment will:

• {{benefit1}}
• {{benefit2}}
• {{benefit3}}

RECOGNITION & STEWARDSHIP

Your generous support will be recognized through {{recognitionPlan}}. We are committed to providing you with:

• {{stewardshipPlan}}

NEXT STEPS

I would be honored to discuss this opportunity with you further. Please don't hesitate to reach out with any questions.

Thank you for considering this investment in our shared vision.

Sincerely,

{{senderName}}
{{title}}`,
      personalizedFields: [
        {
          id: 'firstName',
          name: 'First Name',
          placeholder: '{{firstName}}',
          description: 'Donor\'s first name',
          required: true,
          type: 'text',
          example: 'Elizabeth'
        },
        {
          id: 'organizationName',
          name: 'Organization Name',
          placeholder: '{{organizationName}}',
          description: 'Your organization\'s name',
          required: true,
          type: 'text',
          example: 'Community Arts Center'
        },
        {
          id: 'mission',
          name: 'Mission Statement',
          placeholder: '{{mission}}',
          description: 'Brief mission statement',
          required: true,
          type: 'text',
          example: 'make the arts accessible to everyone in our community'
        },
        {
          id: 'sharedValues',
          name: 'Shared Values',
          placeholder: '{{sharedValues}}',
          description: 'Values you share with the donor',
          required: true,
          type: 'text',
          example: 'ensuring every child has access to creative expression'
        },
        {
          id: 'opportunityDescription',
          name: 'Opportunity Description',
          placeholder: '{{opportunityDescription}}',
          description: 'Description of the funding opportunity',
          required: true,
          type: 'text',
          example: 'renovate our theater space and expand our youth programs'
        },
        {
          id: 'expectedOutcome',
          name: 'Expected Outcome',
          placeholder: '{{expectedOutcome}}',
          description: 'What will be achieved',
          required: true,
          type: 'text',
          example: 'double our capacity and serve 500 more children annually'
        },
        {
          id: 'proposedAmount',
          name: 'Proposed Gift Amount',
          placeholder: '{{proposedAmount}}',
          description: 'Specific amount being requested',
          required: true,
          type: 'text',
          example: '$250,000'
        },
        {
          id: 'specificUse',
          name: 'Specific Use of Funds',
          placeholder: '{{specificUse}}',
          description: 'How the gift will be used',
          required: true,
          type: 'text',
          example: 'fund the complete theater renovation'
        },
        {
          id: 'benefit1',
          name: 'Key Benefit 1',
          placeholder: '{{benefit1}}',
          description: 'First major benefit/outcome',
          required: true,
          type: 'text',
          example: 'Create a state-of-the-art performance space'
        },
        {
          id: 'benefit2',
          name: 'Key Benefit 2',
          placeholder: '{{benefit2}}',
          description: 'Second major benefit/outcome',
          required: true,
          type: 'text',
          example: 'Expand programming to serve 500 additional youth annually'
        },
        {
          id: 'benefit3',
          name: 'Key Benefit 3',
          placeholder: '{{benefit3}}',
          description: 'Third major benefit/outcome',
          required: true,
          type: 'text',
          example: 'Generate $100,000 annually in rental income'
        },
        {
          id: 'recognitionPlan',
          name: 'Recognition Plan',
          placeholder: '{{recognitionPlan}}',
          description: 'How the donor will be recognized',
          required: true,
          type: 'text',
          example: 'naming the renovated theater in your honor'
        },
        {
          id: 'stewardshipPlan',
          name: 'Stewardship Plan',
          placeholder: '{{stewardshipPlan}}',
          description: 'Ongoing relationship and reporting',
          required: true,
          type: 'text',
          example: 'Quarterly impact reports and annual donor appreciation events'
        },
        {
          id: 'senderName',
          name: 'Sender Name',
          placeholder: '{{senderName}}',
          description: 'Your full name',
          required: true,
          type: 'text',
          example: 'Michael Chen'
        },
        {
          id: 'title',
          name: 'Your Title',
          placeholder: '{{title}}',
          description: 'Your job title',
          required: true,
          type: 'text',
          example: 'Development Director'
        }
      ],
      tone: 'professional',
      length: 'long',
      channel: 'letter',
      estimatedTime: '45 minutes',
      difficulty: 'hard',
      aiOptimized: true
    });
  }

  // Monthly donor templates
  if (audience === 'monthly-donors') {
    templates.push({
      id: 'monthly-donor-newsletter',
      name: 'Monthly Donor Newsletter',
      type: 'newsletter',
      description: 'Engaging newsletter for monthly donors showing cumulative impact',
      subject: '{{month}} Impact Update: Your {{monthlyAmount}} is changing lives',
      content: `Dear {{firstName}},

Thank you for being a faithful monthly supporter of {{organizationName}}! Your consistent generosity of {{monthlyAmount}} each month is making a real difference.

THIS MONTH'S IMPACT

Thanks to monthly donors like you, this month we were able to:
• {{achievement1}}
• {{achievement2}}
• {{achievement3}}

YOUR CUMULATIVE IMPACT

Since you started giving in {{startDate}}, your total support of {{cumulativeAmount}} has helped us:
• {{cumulativeImpact1}}
• {{cumulativeImpact2}}

SPOTLIGHT: {{spotlightTitle}}

{{spotlightStory}}

COMING UP

{{upcomingEvents}}

Thank you for being such an important part of our community. Your steady support allows us to plan ahead and make long-term commitments to those we serve.

With gratitude,
{{senderName}}

P.S. {{personalTouch}}`,
      personalizedFields: [
        {
          id: 'firstName',
          name: 'First Name',
          placeholder: '{{firstName}}',
          description: 'Donor\'s first name',
          required: true,
          type: 'text',
          example: 'Maria'
        },
        {
          id: 'month',
          name: 'Current Month',
          placeholder: '{{month}}',
          description: 'Current month name',
          required: true,
          type: 'text',
          example: 'March'
        },
        {
          id: 'monthlyAmount',
          name: 'Monthly Gift Amount',
          placeholder: '{{monthlyAmount}}',
          description: 'Their monthly giving amount',
          required: true,
          type: 'text',
          example: '$50'
        },
        {
          id: 'organizationName',
          name: 'Organization Name',
          placeholder: '{{organizationName}}',
          description: 'Your organization\'s name',
          required: true,
          type: 'text',
          example: 'Hope Animal Shelter'
        },
        {
          id: 'achievement1',
          name: 'This Month\'s Achievement 1',
          placeholder: '{{achievement1}}',
          description: 'First achievement this month',
          required: true,
          type: 'text',
          example: 'Rescued and placed 45 animals in loving homes'
        },
        {
          id: 'achievement2',
          name: 'This Month\'s Achievement 2',
          placeholder: '{{achievement2}}',
          description: 'Second achievement this month',
          required: true,
          type: 'text',
          example: 'Provided free spay/neuter services for 120 pets'
        },
        {
          id: 'achievement3',
          name: 'This Month\'s Achievement 3',
          placeholder: '{{achievement3}}',
          description: 'Third achievement this month',
          required: true,
          type: 'text',
          example: 'Launched new volunteer training program'
        },
        {
          id: 'startDate',
          name: 'Giving Start Date',
          placeholder: '{{startDate}}',
          description: 'When they started monthly giving',
          required: true,
          type: 'text',
          example: 'January 2022'
        },
        {
          id: 'cumulativeAmount',
          name: 'Cumulative Gift Amount',
          placeholder: '{{cumulativeAmount}}',
          description: 'Total amount given to date',
          required: true,
          type: 'text',
          example: '$1,200'
        },
        {
          id: 'cumulativeImpact1',
          name: 'Cumulative Impact 1',
          placeholder: '{{cumulativeImpact1}}',
          description: 'First long-term impact',
          required: true,
          type: 'text',
          example: 'Help rescue over 500 animals'
        },
        {
          id: 'cumulativeImpact2',
          name: 'Cumulative Impact 2',
          placeholder: '{{cumulativeImpact2}}',
          description: 'Second long-term impact',
          required: true,
          type: 'text',
          example: 'Support our daily operations for 2+ years'
        },
        {
          id: 'spotlightTitle',
          name: 'Spotlight Story Title',
          placeholder: '{{spotlightTitle}}',
          description: 'Title for featured story',
          required: true,
          type: 'text',
          example: 'Max\'s Second Chance'
        },
        {
          id: 'spotlightStory',
          name: 'Spotlight Story',
          placeholder: '{{spotlightStory}}',
          description: 'Featured impact story',
          required: true,
          type: 'text',
          example: 'When Max arrived, he was scared and injured. Thanks to donors like you, we were able to provide the medical care and love he needed. Today, Max is thriving in his new home with the Johnson family!'
        },
        {
          id: 'upcomingEvents',
          name: 'Upcoming Events',
          placeholder: '{{upcomingEvents}}',
          description: 'Events and opportunities to engage',
          required: false,
          type: 'text',
          example: 'Join us for our Spring Adoption Fair on April 15th!'
        },
        {
          id: 'senderName',
          name: 'Sender Name',
          placeholder: '{{senderName}}',
          description: 'Your name or organization',
          required: true,
          type: 'text',
          example: 'The Team at Hope Animal Shelter'
        },
        {
          id: 'personalTouch',
          name: 'Personal Touch',
          placeholder: '{{personalTouch}}',
          description: 'Personal note or update',
          required: false,
          type: 'text',
          example: 'We loved seeing your photos from the adoption fair!'
        }
      ],
      tone: 'warm',
      length: 'medium',
      channel: 'email',
      estimatedTime: '20 minutes',
      difficulty: 'easy',
      aiOptimized: true
    });
  }

  // Volunteer templates
  if (audience === 'volunteers') {
    templates.push({
      id: 'volunteer-opportunity-invitation',
      name: 'Volunteer Opportunity Invitation',
      type: 'email',
      description: 'Personalized invitation to a volunteer opportunity',
      subject: 'Perfect volunteer opportunity for someone with your {{skills}}!',
      content: `Hi {{firstName}},

I hope you're doing well! I'm reaching out because I have an exciting volunteer opportunity that I think would be perfect for you.

Based on your background in {{skills}} and your passion for {{interests}}, I'd love to invite you to help with {{eventName}}.

EVENT DETAILS:
• What: {{eventDescription}}
• When: {{eventDateTime}}
• Where: {{eventLocation}}
• Time Commitment: {{timeCommitment}}
• What You'll Do: {{volunteerRole}}

WHY YOU'D BE GREAT:
{{personalizedWhy}}

WHAT WE'LL PROVIDE:
• {{support1}}
• {{support2}}
• {{support3}}

This is a wonderful opportunity to {{benefit}} while {{impact}}.

Are you interested? Please let me know by {{rsvpDeadline}}. I'm happy to answer any questions you might have.

Thanks for all you do for our community!

Best regards,
{{senderName}}
{{title}}
{{contactInfo}}`,
      personalizedFields: [
        {
          id: 'firstName',
          name: 'First Name',
          placeholder: '{{firstName}}',
          description: 'Volunteer\'s first name',
          required: true,
          type: 'text',
          example: 'Jessica'
        },
        {
          id: 'skills',
          name: 'Volunteer Skills',
          placeholder: '{{skills}}',
          description: 'Relevant skills or experience',
          required: true,
          type: 'text',
          example: 'teaching and mentoring'
        },
        {
          id: 'interests',
          name: 'Volunteer Interests',
          placeholder: '{{interests}}',
          description: 'Areas of interest or passion',
          required: true,
          type: 'text',
          example: 'youth development'
        },
        {
          id: 'eventName',
          name: 'Event/Program Name',
          placeholder: '{{eventName}}',
          description: 'Name of the volunteer opportunity',
          required: true,
          type: 'text',
          example: 'Summer Reading Program'
        },
        {
          id: 'eventDescription',
          name: 'Event Description',
          placeholder: '{{eventDescription}}',
          description: 'Brief description of the event',
          required: true,
          type: 'text',
          example: 'Help children improve their reading skills during summer break'
        },
        {
          id: 'eventDateTime',
          name: 'Event Date and Time',
          placeholder: '{{eventDateTime}}',
          description: 'When the event takes place',
          required: true,
          type: 'text',
          example: 'Tuesdays and Thursdays, 2:00-4:00 PM, starting June 15th'
        },
        {
          id: 'eventLocation',
          name: 'Event Location',
          placeholder: '{{eventLocation}}',
          description: 'Where the event takes place',
          required: true,
          type: 'text',
          example: 'Community Library, 123 Main Street'
        },
        {
          id: 'timeCommitment',
          name: 'Time Commitment',
          placeholder: '{{timeCommitment}}',
          description: 'Expected time commitment',
          required: true,
          type: 'text',
          example: '4 hours per week for 6 weeks'
        },
        {
          id: 'volunteerRole',
          name: 'Volunteer Role',
          placeholder: '{{volunteerRole}}',
          description: 'What the volunteer will do',
          required: true,
          type: 'text',
          example: 'Work one-on-one with 2-3 children to practice reading'
        },
        {
          id: 'personalizedWhy',
          name: 'Why They\'d Be Great',
          placeholder: '{{personalizedWhy}}',
          description: 'Personal reason why they\'re perfect for this role',
          required: true,
          type: 'text',
          example: 'Your experience as a former teacher and your patient, encouraging approach would be perfect for helping children build confidence'
        },
        {
          id: 'support1',
          name: 'Support Item 1',
          placeholder: '{{support1}}',
          description: 'First thing you\'ll provide',
          required: true,
          type: 'text',
          example: 'Comprehensive volunteer training'
        },
        {
          id: 'support2',
          name: 'Support Item 2',
          placeholder: '{{support2}}',
          description: 'Second thing you\'ll provide',
          required: true,
          type: 'text',
          example: 'All materials and resources'
        },
        {
          id: 'support3',
          name: 'Support Item 3',
          placeholder: '{{support3}}',
          description: 'Third thing you\'ll provide',
          required: true,
          type: 'text',
          example: 'On-site support and coordination'
        },
        {
          id: 'benefit',
          name: 'Personal Benefit',
          placeholder: '{{benefit}}',
          description: 'What the volunteer will gain',
          required: true,
          type: 'text',
          example: 'use your teaching skills in a meaningful way'
        },
        {
          id: 'impact',
          name: 'Community Impact',
          placeholder: '{{impact}}',
          description: 'Impact on the community',
          required: true,
          type: 'text',
          example: 'helping children stay engaged with learning over the summer'
        },
        {
          id: 'rsvpDeadline',
          name: 'RSVP Deadline',
          placeholder: '{{rsvpDeadline}}',
          description: 'When they need to respond by',
          required: true,
          type: 'text',
          example: 'May 30th'
        },
        {
          id: 'senderName',
          name: 'Sender Name',
          placeholder: '{{senderName}}',
          description: 'Your full name',
          required: true,
          type: 'text',
          example: 'Amanda Rodriguez'
        },
        {
          id: 'title',
          name: 'Your Title',
          placeholder: '{{title}}',
          description: 'Your job title',
          required: true,
          type: 'text',
          example: 'Volunteer Coordinator'
        },
        {
          id: 'contactInfo',
          name: 'Contact Information',
          placeholder: '{{contactInfo}}',
          description: 'How they can reach you',
          required: true,
          type: 'text',
          example: 'amanda@communitylibrary.org | (555) 987-6543'
        }
      ],
      tone: 'warm',
      length: 'medium',
      channel: 'email',
      estimatedTime: '12 minutes',
      difficulty: 'easy',
      aiOptimized: true
    });
  }

  // Default template if no specific match
  if (templates.length === 0) {
    templates.push({
      id: 'general-outreach',
      name: 'General Outreach Email',
      type: 'email',
      description: 'Flexible template for general audience outreach',
      subject: 'Important update from {{organizationName}}',
      content: `Dear {{firstName}},

I hope this message finds you well. I'm writing to share some important updates about {{organizationName}} and how your support continues to make a difference.

{{mainMessage}}

{{callToAction}}

Thank you for being part of our community.

Best regards,
{{senderName}}`,
      personalizedFields: [
        {
          id: 'firstName',
          name: 'First Name',
          placeholder: '{{firstName}}',
          description: 'Recipient\'s first name',
          required: true,
          type: 'text',
          example: 'Alex'
        },
        {
          id: 'organizationName',
          name: 'Organization Name',
          placeholder: '{{organizationName}}',
          description: 'Your organization\'s name',
          required: true,
          type: 'text',
          example: 'Community Foundation'
        },
        {
          id: 'mainMessage',
          name: 'Main Message',
          placeholder: '{{mainMessage}}',
          description: 'The main content of your message',
          required: true,
          type: 'text',
          example: 'This year we\'ve been able to...'
        },
        {
          id: 'callToAction',
          name: 'Call to Action',
          placeholder: '{{callToAction}}',
          description: 'What you want them to do next',
          required: true,
          type: 'text',
          example: 'We hope you\'ll consider supporting our upcoming campaign.'
        },
        {
          id: 'senderName',
          name: 'Sender Name',
          placeholder: '{{senderName}}',
          description: 'Your full name',
          required: true,
          type: 'text',
          example: 'Jordan Smith'
        }
      ],
      tone: 'professional',
      length: 'short',
      channel: 'email',
      estimatedTime: '8 minutes',
      difficulty: 'easy',
      aiOptimized: false
    });
  }

  return templates;
};

export const AdaptiveExecutionPanel: React.FC<AdaptiveExecutionPanelProps> = ({
  strategy,
  audience,
  purpose,
  onExecute,
  userSkillLevel = 'intermediate'
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ExecutionTemplate | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<string>('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [executionSettings, setExecutionSettings] = useState<ExecutionSettings>({
    autoPersonalize: true,
    aiAssistance: true,
    previewMode: true,
    batchMode: false,
    schedulingEnabled: false,
    analyticsTracking: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [completionScore, setCompletionScore] = useState(0);
  const [activeTab, setActiveTab] = useState('templates');

  const aiService = AIService.getInstance();

  // Generate templates based on current context
  const availableTemplates = useMemo(() => {
    return generateExecutionTemplates(strategy, audience, purpose);
  }, [strategy, audience, purpose]);

  // Initialize with first template
  useEffect(() => {
    if (availableTemplates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(availableTemplates[0]);
    }
  }, [availableTemplates, selectedTemplate]);

  // Initialize field values with examples when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const newFieldValues: Record<string, string> = {};
      selectedTemplate.personalizedFields.forEach(field => {
        newFieldValues[field.id] = field.defaultValue || field.example;
      });
      setFieldValues(newFieldValues);
    }
  }, [selectedTemplate]);

  // Calculate completion score
  useEffect(() => {
    if (selectedTemplate) {
      const requiredFields = selectedTemplate.personalizedFields.filter(f => f.required);
      const completedFields = requiredFields.filter(f => fieldValues[f.id]?.trim());
      const score = (completedFields.length / requiredFields.length) * 100;
      setCompletionScore(score);
    }
  }, [selectedTemplate, fieldValues]);

  // Update personalized content when field values change
  useEffect(() => {
    if (selectedTemplate) {
      let content = selectedTemplate.content;
      selectedTemplate.personalizedFields.forEach(field => {
        const value = fieldValues[field.id] || field.placeholder;
        content = content.replace(new RegExp(field.placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
      });
      setPersonalizedContent(content);
    }
  }, [selectedTemplate, fieldValues]);

  // Handle field value change
  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Generate AI suggestions
  const generateAISuggestions = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Improve this ${selectedTemplate.type} template for ${audience} in ${purpose} context:

Template: ${selectedTemplate.name}
Content: ${selectedTemplate.content}

Provide 3 specific suggestions to make this template more effective:
1. Content improvements
2. Personalization enhancements  
3. Call-to-action optimization

Keep suggestions practical and actionable.`,
        context: "You are an expert in nonprofit communications and direct response marketing.",
        temperature: 0.7
      });

      setAiSuggestions(response.content);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setAiSuggestions('AI suggestions temporarily unavailable. Consider reviewing the template for clarity, personalization opportunities, and clear calls to action.');
    }
    setIsGenerating(false);
  };

  // Auto-fill fields with AI
  const autoFillFields = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Generate realistic example values for these personalization fields for a ${selectedTemplate.type} targeting ${audience}:

${selectedTemplate.personalizedFields.map(f => `${f.name}: ${f.description}`).join('\n')}

Return only the values in the format:
fieldId: "example value"`,
        context: "You are helping create realistic examples for nonprofit communications.",
        temperature: 0.8
      });

      // Parse response and update field values
      const lines = response.content.split('\n');
      const newValues: Record<string, string> = {};
      
      lines.forEach(line => {
        const [fieldId, value] = line.split(': ');
        if (fieldId && value) {
          const cleanValue = value.replace(/['"]/g, '');
          if (selectedTemplate.personalizedFields.find(f => f.id === fieldId.trim())) {
            newValues[fieldId.trim()] = cleanValue;
          }
        }
      });

      setFieldValues(prev => ({ ...prev, ...newValues }));
    } catch (error) {
      console.error('Error auto-filling fields:', error);
    }
    setIsGenerating(false);
  };

  // Handle template execution
  const handleExecute = () => {
    if (selectedTemplate) {
      onExecute(selectedTemplate, executionSettings);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(personalizedContent);
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Adaptive Execution Panel</h1>
            <p className="text-muted-foreground">
              Customized templates for {audience} • {purpose}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Progress value={completionScore} className="w-20 h-2" />
            <span>{Math.round(completionScore)}% complete</span>
          </div>
          <Badge variant={userSkillLevel === 'advanced' ? 'default' : 'secondary'}>
            {userSkillLevel} mode
          </Badge>
          <Badge variant="outline">
            {availableTemplates.length} templates
          </Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="personalize">Personalize</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTemplates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all h-full ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'hover:border-muted-foreground hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {template.type === 'email' && <Mail className="w-5 h-5" />}
                          {template.type === 'proposal' && <FileText className="w-5 h-5" />}
                          {template.type === 'newsletter' && <MessageSquare className="w-5 h-5" />}
                          <Badge variant={template.aiOptimized ? 'default' : 'secondary'}>
                            {template.type}
                          </Badge>
                          {template.aiOptimized && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Enhanced
                            </Badge>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {template.estimatedTime}
                            </div>
                            <Badge variant="outline">{template.difficulty}</Badge>
                          </div>
                          <Badge variant="outline">{template.tone}</Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Personalization Fields:</p>
                          <div className="text-xs text-muted-foreground">
                            {template.personalizedFields.length} fields • {template.personalizedFields.filter(f => f.required).length} required
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="personalize" className="space-y-4">
          {selectedTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Field Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Personalization Fields</CardTitle>
                      <CardDescription>
                        Fill in the details to customize your {selectedTemplate.type}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={autoFillFields}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      Auto-fill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTemplate.personalizedFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="flex items-center gap-2">
                        {field.name}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.type === 'text' && (
                        <Input
                          id={field.id}
                          value={fieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.example}
                        />
                      )}
                      {field.type === 'select' && field.options && (
                        <Select
                          value={fieldValues[field.id] || ''}
                          onValueChange={(value) => handleFieldChange(field.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Live Preview</CardTitle>
                      <CardDescription>See how your content will look</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateAISuggestions}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        AI Improve
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTemplate.subject && (
                      <div>
                        <Label className="text-sm font-medium">Subject Line:</Label>
                        <div className="p-3 bg-muted/50 rounded border text-sm font-medium">
                          {selectedTemplate.subject.replace(/\{\{(\w+)\}\}/g, (match, field) => {
                            return fieldValues[field] || match;
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium">Content:</Label>
                      <div className="p-4 bg-muted/50 rounded border max-h-64 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {personalizedContent}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Suggestions */}
          {aiSuggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">
                  {aiSuggestions}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Final Preview
                </CardTitle>
                <CardDescription>
                  How your {selectedTemplate.type} will appear to recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Email Preview */}
                  {selectedTemplate.type === 'email' && (
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="border-b pb-3 mb-4">
                        <div className="text-sm text-muted-foreground mb-1">Subject:</div>
                        <div className="font-medium">
                          {selectedTemplate.subject?.replace(/\{\{(\w+)\}\}/g, (match, field) => {
                            return fieldValues[field] || match;
                          })}
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">
                          {personalizedContent}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Letter Preview */}
                  {selectedTemplate.type === 'proposal' && (
                    <div className="border rounded-lg p-8 bg-white shadow-sm max-w-2xl mx-auto">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">
                          {personalizedContent}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Newsletter Preview */}
                  {selectedTemplate.type === 'newsletter' && (
                    <div className="border rounded-lg p-6 bg-gradient-to-b from-blue-50 to-white shadow-sm">
                      <div className="border-b pb-3 mb-4">
                        <div className="text-sm text-muted-foreground mb-1">Newsletter Subject:</div>
                        <div className="font-bold text-lg">
                          {selectedTemplate.subject?.replace(/\{\{(\w+)\}\}/g, (match, field) => {
                            return fieldValues[field] || match;
                          })}
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">
                          {personalizedContent}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics Preview */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <div className="text-sm text-muted-foreground">Predicted Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">12%</div>
                      <div className="text-sm text-muted-foreground">Expected Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">8.5</div>
                      <div className="text-sm text-muted-foreground">Personalization Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Settings</CardTitle>
              <CardDescription>Configure how your content will be processed and sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-personalize">Auto-personalization</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically personalize content for each recipient
                      </p>
                    </div>
                    <Switch
                      id="auto-personalize"
                      checked={executionSettings.autoPersonalize}
                      onCheckedChange={(checked) =>
                        setExecutionSettings(prev => ({ ...prev, autoPersonalize: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ai-assistance">AI Assistance</Label>
                      <p className="text-sm text-muted-foreground">
                        Use AI to optimize content for better engagement
                      </p>
                    </div>
                    <Switch
                      id="ai-assistance"
                      checked={executionSettings.aiAssistance}
                      onCheckedChange={(checked) =>
                        setExecutionSettings(prev => ({ ...prev, aiAssistance: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics-tracking">Analytics Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track opens, clicks, and engagement metrics
                      </p>
                    </div>
                    <Switch
                      id="analytics-tracking"
                      checked={executionSettings.analyticsTracking}
                      onCheckedChange={(checked) =>
                        setExecutionSettings(prev => ({ ...prev, analyticsTracking: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="batch-mode">Batch Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Process multiple recipients at once
                      </p>
                    </div>
                    <Switch
                      id="batch-mode"
                      checked={executionSettings.batchMode}
                      onCheckedChange={(checked) =>
                        setExecutionSettings(prev => ({ ...prev, batchMode: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="scheduling">Scheduling</Label>
                      <p className="text-sm text-muted-foreground">
                        Schedule content for optimal send times
                      </p>
                    </div>
                    <Switch
                      id="scheduling"
                      checked={executionSettings.schedulingEnabled}
                      onCheckedChange={(checked) =>
                        setExecutionSettings(prev => ({ ...prev, schedulingEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="preview-mode">Preview Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Send test versions before full deployment
                      </p>
                    </div>
                    <Switch
                      id="preview-mode"
                      checked={executionSettings.previewMode}
                      onCheckedChange={(checked) =>
                        setExecutionSettings(prev => ({ ...prev, previewMode: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('templates')}>
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Templates
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Content
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleExecute}
            disabled={completionScore < 80}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Execute Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveExecutionPanel;