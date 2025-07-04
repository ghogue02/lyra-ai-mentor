import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Workflow, Clock, ArrowRight, CheckCircle, AlertCircle, Zap, Settings, Play } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowAutomatorProps {
  onComplete?: () => void;
}

interface WorkflowStep {
  id: number;
  name: string;
  type: 'trigger' | 'action' | 'condition' | 'notification';
  description: string;
  timing?: string;
  dependencies?: number[];
}

interface AutomatedWorkflow {
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  timeSaved: string;
  frequency: string;
  benefits: string[];
  setupInstructions: string[];
  tools: string[];
}

export const WorkflowAutomator: React.FC<WorkflowAutomatorProps> = ({ onComplete }) => {
  const [workflowType, setWorkflowType] = useState<string>('');
  const [currentProcess, setCurrentProcess] = useState('');
  const [painPoints, setPainPoints] = useState<string>('');
  const [workflow, setWorkflow] = useState<AutomatedWorkflow | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const workflowTypes = [
    { value: 'donor_journey', label: 'Donor Journey', description: 'Thank you to stewardship' },
    { value: 'volunteer_onboarding', label: 'Volunteer Onboarding', description: 'Application to first shift' },
    { value: 'grant_management', label: 'Grant Management', description: 'Application to reporting' },
    { value: 'event_coordination', label: 'Event Coordination', description: 'Planning to follow-up' },
    { value: 'program_enrollment', label: 'Program Enrollment', description: 'Inquiry to participation' },
    { value: 'financial_processes', label: 'Financial Processes', description: 'Invoice to payment' },
    { value: 'communications', label: 'Communications', description: 'Content to distribution' },
    { value: 'data_management', label: 'Data Management', description: 'Collection to reporting' }
  ];

  const createWorkflow = async () => {
    if (!workflowType || !currentProcess.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateAutomatedWorkflow();
      setWorkflow(result);
      
      toast.success('Automated workflow created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create workflow. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAutomatedWorkflow = (): AutomatedWorkflow => {
    const templates: Record<string, () => AutomatedWorkflow> = {
      donor_journey: () => ({
        name: 'Automated Donor Stewardship Journey',
        description: 'Transform manual donor follow-ups into an automated system that ensures every donor receives timely, personalized acknowledgment and ongoing cultivation.',
        category: 'Fundraising',
        steps: [
          {
            id: 1,
            name: 'Donation Received Trigger',
            type: 'trigger',
            description: 'System detects new donation via payment processor webhook or manual entry'
          },
          {
            id: 2,
            name: 'Instant Email Receipt',
            type: 'action',
            description: 'Send automated tax receipt and initial thank you within 5 minutes',
            timing: 'Immediate',
            dependencies: [1]
          },
          {
            id: 3,
            name: 'Gift Size Evaluation',
            type: 'condition',
            description: 'Route donor based on gift amount: <$100, $100-999, $1000+',
            dependencies: [1]
          },
          {
            id: 4,
            name: 'Personalized Thank You',
            type: 'action',
            description: 'Send gift-size appropriate thank you: Email (<$100), Personal email ($100-999), Phone call task ($1000+)',
            timing: '24-48 hours',
            dependencies: [3]
          },
          {
            id: 5,
            name: 'Add to CRM Segments',
            type: 'action',
            description: 'Tag donor in CRM, update giving history, assign to cultivation track',
            timing: 'Immediate',
            dependencies: [1]
          },
          {
            id: 6,
            name: 'Monthly Update Series',
            type: 'action',
            description: 'Enroll in automated monthly impact updates for 6 months',
            timing: 'Monthly',
            dependencies: [5]
          },
          {
            id: 7,
            name: 'Upgrade Ask Timing',
            type: 'condition',
            description: 'After 3 successful gifts, trigger upgrade ask campaign',
            timing: '90+ days',
            dependencies: [5]
          },
          {
            id: 8,
            name: 'Annual Report Send',
            type: 'action',
            description: 'Automatically include in annual report mailing list',
            timing: 'Annual',
            dependencies: [5]
          },
          {
            id: 9,
            name: 'Lapse Prevention',
            type: 'notification',
            description: 'Alert staff if donor hasn\'t given in 11 months',
            timing: '11 months',
            dependencies: [5]
          }
        ],
        timeSaved: '15 hours per week',
        frequency: 'Continuous',
        benefits: [
          'Donors thanked within minutes, not days',
          'Zero donors fall through the cracks',
          'Consistent stewardship for all gift levels',
          'Staff focus on major donor relationships',
          'Improved donor retention through timely touchpoints',
          'Automatic tracking and reporting'
        ],
        setupInstructions: [
          'Connect payment processor to CRM via API or Zapier',
          'Create email templates for each donor segment',
          'Set up CRM tags and segments for routing',
          'Configure phone call tasks for major gifts',
          'Build monthly update email series',
          'Test with small batch before full launch',
          'Train staff on workflow monitoring'
        ],
        tools: ['CRM (Salesforce/HubSpot)', 'Email platform (Mailchimp/Constant Contact)', 'Zapier or Make', 'Payment processor API', 'Task management system']
      }),

      volunteer_onboarding: () => ({
        name: 'Volunteer Onboarding Automation',
        description: 'Streamline the volunteer journey from initial interest to first shift, ensuring consistent communication and reducing administrative burden.',
        category: 'Volunteer Management',
        steps: [
          {
            id: 1,
            name: 'Application Submitted',
            type: 'trigger',
            description: 'Online volunteer application form submitted'
          },
          {
            id: 2,
            name: 'Welcome Email',
            type: 'action',
            description: 'Send immediate welcome email with next steps',
            timing: 'Within 5 minutes',
            dependencies: [1]
          },
          {
            id: 3,
            name: 'Application Review',
            type: 'notification',
            description: 'Create task for staff to review within 48 hours',
            timing: 'Immediate',
            dependencies: [1]
          },
          {
            id: 4,
            name: 'Background Check',
            type: 'action',
            description: 'Automatically send background check link if approved',
            timing: 'After approval',
            dependencies: [3]
          },
          {
            id: 5,
            name: 'Orientation Scheduling',
            type: 'action',
            description: 'Send calendar link for next orientation session',
            timing: '1 day after background check',
            dependencies: [4]
          },
          {
            id: 6,
            name: 'Pre-Orientation Materials',
            type: 'action',
            description: 'Email handbook, policies, and parking info',
            timing: '3 days before orientation',
            dependencies: [5]
          },
          {
            id: 7,
            name: 'Orientation Reminder',
            type: 'notification',
            description: 'Send reminder email and text',
            timing: '24 hours before',
            dependencies: [5]
          },
          {
            id: 8,
            name: 'Post-Orientation Survey',
            type: 'action',
            description: 'Send feedback survey after orientation',
            timing: '1 day after orientation',
            dependencies: [5]
          },
          {
            id: 9,
            name: 'First Shift Scheduling',
            type: 'action',
            description: 'Send available shifts for sign-up',
            timing: '2 days after orientation',
            dependencies: [8]
          },
          {
            id: 10,
            name: '30-Day Check-in',
            type: 'action',
            description: 'Automated satisfaction survey and support offer',
            timing: '30 days',
            dependencies: [9]
          }
        ],
        timeSaved: '20 hours per week',
        frequency: 'Per volunteer',
        benefits: [
          'Reduce time-to-first-shift by 50%',
          'Eliminate manual follow-up tasks',
          'Ensure consistent onboarding experience',
          'Improve volunteer retention with timely communication',
          'Track bottlenecks in onboarding process',
          'Free staff for relationship building'
        ],
        setupInstructions: [
          'Create online application form with auto-response',
          'Set up email templates for each stage',
          'Configure background check integration',
          'Build orientation scheduling system',
          'Create automated reminder sequences',
          'Design feedback surveys',
          'Test full workflow with staff volunteers'
        ],
        tools: ['Volunteer management system', 'Form builder (Google Forms/Typeform)', 'Calendar scheduling tool', 'Email automation', 'SMS platform', 'Survey tool']
      }),

      grant_management: () => ({
        name: 'Grant Lifecycle Automation',
        description: 'Manage grants from opportunity identification through final reporting with automated reminders, task creation, and document management.',
        category: 'Grant Management',
        steps: [
          {
            id: 1,
            name: 'Grant Opportunity Added',
            type: 'trigger',
            description: 'New grant entered into tracking system'
          },
          {
            id: 2,
            name: 'Deadline Reminders',
            type: 'notification',
            description: 'Set automatic reminders at 60, 30, and 14 days before deadline',
            timing: 'Variable',
            dependencies: [1]
          },
          {
            id: 3,
            name: 'Team Task Assignment',
            type: 'action',
            description: 'Create and assign tasks: budget, narrative, attachments',
            timing: '45 days before deadline',
            dependencies: [1]
          },
          {
            id: 4,
            name: 'Document Collection',
            type: 'action',
            description: 'Request standard documents from finance and programs',
            timing: '30 days before deadline',
            dependencies: [3]
          },
          {
            id: 5,
            name: 'Review Scheduling',
            type: 'notification',
            description: 'Schedule leadership review 1 week before submission',
            timing: '14 days before deadline',
            dependencies: [3]
          },
          {
            id: 6,
            name: 'Submission Confirmation',
            type: 'action',
            description: 'Log submission, update CRM, notify team',
            timing: 'Upon submission',
            dependencies: [5]
          },
          {
            id: 7,
            name: 'Award Notification',
            type: 'trigger',
            description: 'Update system with award/decline status'
          },
          {
            id: 8,
            name: 'Reporting Schedule',
            type: 'action',
            description: 'Create recurring tasks for required reports',
            timing: 'Upon award',
            dependencies: [7]
          },
          {
            id: 9,
            name: 'Report Reminders',
            type: 'notification',
            description: 'Alert team 30 days before each report due',
            timing: 'Recurring',
            dependencies: [8]
          },
          {
            id: 10,
            name: 'Renewal Prompt',
            type: 'notification',
            description: 'Flag for renewal 90 days before grant end',
            timing: '90 days before end',
            dependencies: [7]
          }
        ],
        timeSaved: '25 hours per month',
        frequency: 'Per grant',
        benefits: [
          'Never miss a grant deadline',
          'Standardize grant processes across team',
          'Reduce last-minute scrambles',
          'Improve grant success rate with better planning',
          'Automatic compliance tracking',
          'Clear visibility into grant pipeline'
        ],
        setupInstructions: [
          'Build grant tracking database/spreadsheet',
          'Create task templates for each grant stage',
          'Set up automated email reminders',
          'Design document request templates',
          'Configure calendar integrations',
          'Build reporting dashboard',
          'Train team on system usage'
        ],
        tools: ['Project management tool (Asana/Monday)', 'CRM or grant tracking system', 'Document management (Google Drive/SharePoint)', 'Calendar system', 'Email automation', 'Reporting tools']
      }),

      event_coordination: () => ({
        name: 'Event Planning Automation System',
        description: 'Coordinate all aspects of event planning from initial setup through post-event follow-up with automated tasks and communications.',
        category: 'Event Management',
        steps: [
          {
            id: 1,
            name: 'Event Created',
            type: 'trigger',
            description: 'New event added to system with date and type'
          },
          {
            id: 2,
            name: 'Planning Timeline',
            type: 'action',
            description: 'Generate task timeline based on event date and type',
            timing: 'Immediate',
            dependencies: [1]
          },
          {
            id: 3,
            name: 'Venue Booking Tasks',
            type: 'action',
            description: 'Create tasks for venue research, booking, contracts',
            timing: '90 days before',
            dependencies: [2]
          },
          {
            id: 4,
            name: 'Marketing Calendar',
            type: 'action',
            description: 'Schedule social posts, emails, press release dates',
            timing: '60 days before',
            dependencies: [2]
          },
          {
            id: 5,
            name: 'Registration Opening',
            type: 'action',
            description: 'Launch registration page, send announcement',
            timing: '45 days before',
            dependencies: [4]
          },
          {
            id: 6,
            name: 'Vendor Coordination',
            type: 'notification',
            description: 'Reminders for catering, AV, printing deadlines',
            timing: '30 days before',
            dependencies: [2]
          },
          {
            id: 7,
            name: 'Attendee Communications',
            type: 'action',
            description: 'Send confirmation, reminder, logistics emails',
            timing: 'Multiple touchpoints',
            dependencies: [5]
          },
          {
            id: 8,
            name: 'Day-of Checklist',
            type: 'notification',
            description: 'Send final checklist to event team',
            timing: '24 hours before',
            dependencies: [2]
          },
          {
            id: 9,
            name: 'Thank You Sequence',
            type: 'action',
            description: 'Send attendee thank you with photos, survey',
            timing: '24-48 hours after',
            dependencies: [1]
          },
          {
            id: 10,
            name: 'Follow-up Actions',
            type: 'action',
            description: 'Create tasks for sponsor thank yous, vendor payments',
            timing: '3 days after',
            dependencies: [1]
          }
        ],
        timeSaved: '30 hours per event',
        frequency: 'Per event',
        benefits: [
          'Never miss critical event deadlines',
          'Consistent attendee experience',
          'Reduce event coordinator stress',
          'Improve attendance through timely marketing',
          'Standardize events across organization',
          'Better vendor relationships through timely communication'
        ],
        setupInstructions: [
          'Create event template checklists by event type',
          'Build automated email sequences',
          'Set up registration system integration',
          'Configure vendor contact database',
          'Create social media scheduling templates',
          'Design post-event survey',
          'Test with small internal event first'
        ],
        tools: ['Event management platform (Eventbrite/Cvent)', 'Project management system', 'Email marketing tool', 'Social media scheduler', 'Survey platform', 'Payment processing']
      }),

      communications: () => ({
        name: 'Content Production & Distribution Workflow',
        description: 'Automate the content creation process from ideation through multi-channel distribution with approval workflows and performance tracking.',
        category: 'Communications',
        steps: [
          {
            id: 1,
            name: 'Content Calendar Alert',
            type: 'trigger',
            description: 'Monthly content planning reminder'
          },
          {
            id: 2,
            name: 'Topic Assignment',
            type: 'action',
            description: 'Create content tasks based on calendar',
            timing: 'Start of month',
            dependencies: [1]
          },
          {
            id: 3,
            name: 'Draft Reminders',
            type: 'notification',
            description: 'Alert writers 1 week before due date',
            timing: 'Weekly',
            dependencies: [2]
          },
          {
            id: 4,
            name: 'Approval Routing',
            type: 'action',
            description: 'Send draft to approvers when submitted',
            timing: 'Upon completion',
            dependencies: [2]
          },
          {
            id: 5,
            name: 'Visual Asset Request',
            type: 'action',
            description: 'Trigger design request for approved content',
            timing: 'After approval',
            dependencies: [4]
          },
          {
            id: 6,
            name: 'Multi-Channel Prep',
            type: 'action',
            description: 'Create versions for blog, social, email',
            timing: '3 days before publish',
            dependencies: [5]
          },
          {
            id: 7,
            name: 'Scheduling Queue',
            type: 'action',
            description: 'Load content into scheduling tools',
            timing: '1 day before',
            dependencies: [6]
          },
          {
            id: 8,
            name: 'Publication Alerts',
            type: 'notification',
            description: 'Notify team when content goes live',
            timing: 'At publication',
            dependencies: [7]
          },
          {
            id: 9,
            name: 'Performance Tracking',
            type: 'action',
            description: 'Pull analytics after 1 week',
            timing: '7 days after',
            dependencies: [8]
          },
          {
            id: 10,
            name: 'Content Repurposing',
            type: 'notification',
            description: 'Flag high-performing content for reuse',
            timing: '30 days after',
            dependencies: [9]
          }
        ],
        timeSaved: '15 hours per week',
        frequency: 'Continuous',
        benefits: [
          'Maintain consistent publishing schedule',
          'Eliminate content bottlenecks',
          'Improve content quality through process',
          'Track content ROI automatically',
          'Reduce last-minute content scrambles',
          'Scale content production efficiently'
        ],
        setupInstructions: [
          'Build editorial calendar template',
          'Create content brief templates',
          'Set up approval workflow in project tool',
          'Configure multi-channel scheduling',
          'Integrate analytics tracking',
          'Design performance dashboard',
          'Document style guide and processes'
        ],
        tools: ['Content calendar tool', 'Project management system', 'Social media scheduler', 'Email platform', 'Analytics tools', 'Design request system']
      })
    };

    const template = templates[workflowType] || templates.donor_journey;
    return template();
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Play className="h-4 w-4 text-green-600" />;
      case 'action': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'condition': return <Settings className="h-4 w-4 text-purple-600" />;
      case 'notification': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <ArrowRight className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-green-100 text-green-800';
      case 'action': return 'bg-blue-100 text-blue-800';
      case 'condition': return 'bg-purple-100 text-purple-800';
      case 'notification': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-indigo-600" />
            Workflow Automator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Design automated workflows to save time and ensure consistency
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Workflow Type</label>
            <Select value={workflowType} onValueChange={setWorkflowType}>
              <SelectTrigger>
                <SelectValue placeholder="Select workflow to automate" />
              </SelectTrigger>
              <SelectContent>
                {workflowTypes.map((type) => (
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
            <label className="block text-sm font-medium mb-2">Current Process</label>
            <Input
              value={currentProcess}
              onChange={(e) => setCurrentProcess(e.target.value)}
              placeholder="Briefly describe how you handle this process now"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pain Points (Optional)</label>
            <Input
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              placeholder="What challenges do you face with the current process?"
            />
          </div>

          <Button 
            onClick={createWorkflow} 
            disabled={isGenerating || !workflowType || !currentProcess.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Designing Workflow...
              </>
            ) : (
              <>
                <Workflow className="h-4 w-4 mr-2" />
                Create Automated Workflow
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {workflow && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{workflow.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">{workflow.category}</Badge>
                <Badge className="bg-green-100 text-green-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Saves {workflow.timeSaved}
                </Badge>
                <Badge variant="outline">
                  Runs: {workflow.frequency}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-full ${getStepColor(step.type)}`}>
                        {getStepIcon(step.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{step.name}</h4>
                        {step.timing && (
                          <Badge variant="outline" className="text-xs">
                            {step.timing}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {index < workflow.steps.length - 1 && (
                        <div className="ml-0 mt-2 mb-2 border-l-2 border-gray-200 h-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {workflow.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Required Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workflow.tools.map((tool, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-sm">{tool}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {workflow.setupInstructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="pt-6">
              <p className="text-sm text-indigo-800">
                <strong>Pro tip:</strong> Start with one workflow and perfect it before automating others. 
                Document each step clearly and involve your team in the design process for better adoption.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};