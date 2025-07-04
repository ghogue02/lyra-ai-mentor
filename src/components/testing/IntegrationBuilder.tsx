import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plug, ArrowRight, Check, AlertCircle, Zap, Settings, Cloud, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationBuilderProps {
  onComplete?: () => void;
}

interface IntegrationStep {
  id: number;
  title: string;
  description: string;
  type: 'setup' | 'mapping' | 'testing' | 'automation';
  status?: 'complete' | 'pending' | 'error';
  timeRequired?: string;
}

interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

interface IntegrationPlan {
  sourceTool: string;
  targetTool: string;
  integrationName: string;
  description: string;
  dataFlow: 'one-way' | 'two-way' | 'sync';
  frequency: string;
  steps: IntegrationStep[];
  dataMappings: DataMapping[];
  triggers: {
    event: string;
    action: string;
    conditions?: string[];
  }[];
  benefits: string[];
  securityConsiderations: string[];
  estimatedSetupTime: string;
  monthlyCost: string;
  alternativeOptions: {
    method: string;
    pros: string[];
    cons: string[];
  }[];
}

export const IntegrationBuilder: React.FC<IntegrationBuilderProps> = ({ onComplete }) => {
  const [sourceSystem, setSourceSystem] = useState<string>('');
  const [targetSystem, setTargetSystem] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [dataVolume, setDataVolume] = useState<string>('');
  const [integration, setIntegration] = useState<IntegrationPlan | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const systems = [
    { value: 'crm_salesforce', label: 'Salesforce (CRM)', category: 'CRM' },
    { value: 'crm_hubspot', label: 'HubSpot', category: 'CRM' },
    { value: 'donor_donorperfect', label: 'DonorPerfect', category: 'Donor Management' },
    { value: 'donor_bloomerang', label: 'Bloomerang', category: 'Donor Management' },
    { value: 'email_mailchimp', label: 'Mailchimp', category: 'Email Marketing' },
    { value: 'email_constantcontact', label: 'Constant Contact', category: 'Email Marketing' },
    { value: 'accounting_quickbooks', label: 'QuickBooks', category: 'Accounting' },
    { value: 'payment_stripe', label: 'Stripe', category: 'Payments' },
    { value: 'event_eventbrite', label: 'Eventbrite', category: 'Events' },
    { value: 'volunteer_volunteerhub', label: 'VolunteerHub', category: 'Volunteer Management' },
    { value: 'forms_googleforms', label: 'Google Forms', category: 'Data Collection' },
    { value: 'sheets_googlesheets', label: 'Google Sheets', category: 'Spreadsheets' },
    { value: 'calendar_googlecalendar', label: 'Google Calendar', category: 'Scheduling' },
    { value: 'social_facebook', label: 'Facebook', category: 'Social Media' },
    { value: 'survey_surveymonkey', label: 'SurveyMonkey', category: 'Surveys' }
  ];

  const useCases = [
    { value: 'donor_sync', label: 'Sync donor information', description: 'Keep donor data consistent' },
    { value: 'email_segmentation', label: 'Email list segmentation', description: 'Auto-update email lists' },
    { value: 'payment_recording', label: 'Payment recording', description: 'Track donations automatically' },
    { value: 'event_registration', label: 'Event registration flow', description: 'Streamline sign-ups' },
    { value: 'volunteer_tracking', label: 'Volunteer hour tracking', description: 'Log hours automatically' },
    { value: 'financial_reporting', label: 'Financial reporting', description: 'Sync financial data' },
    { value: 'form_submission', label: 'Form submission handling', description: 'Process form data' },
    { value: 'calendar_sync', label: 'Calendar synchronization', description: 'Keep schedules aligned' }
  ];

  const buildIntegration = async () => {
    if (!sourceSystem || !targetSystem || !useCase) {
      toast.error('Please complete all required fields');
      return;
    }

    if (sourceSystem === targetSystem) {
      toast.error('Please select different source and target systems');
      return;
    }

    setIsBuilding(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateIntegrationPlan();
      setIntegration(result);
      
      toast.success('Integration plan created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to build integration. Please try again.');
    } finally {
      setIsBuilding(false);
    }
  };

  const generateIntegrationPlan = (): IntegrationPlan => {
    const templates: Record<string, () => IntegrationPlan> = {
      'payment_stripe_to_crm_salesforce': () => ({
        sourceTool: 'Stripe',
        targetTool: 'Salesforce',
        integrationName: 'Donation Payment to CRM Sync',
        description: 'Automatically create or update donor records in Salesforce when payments are processed in Stripe',
        dataFlow: 'one-way',
        frequency: 'Real-time (webhook)',
        steps: [
          {
            id: 1,
            title: 'Connect Stripe Account',
            description: 'Authenticate and grant read access to Stripe payments',
            type: 'setup',
            timeRequired: '10 minutes'
          },
          {
            id: 2,
            title: 'Connect Salesforce',
            description: 'Authenticate and grant create/update access to Contacts and Opportunities',
            type: 'setup',
            timeRequired: '15 minutes'
          },
          {
            id: 3,
            title: 'Map Payment Fields',
            description: 'Define how Stripe data maps to Salesforce fields',
            type: 'mapping',
            timeRequired: '20 minutes'
          },
          {
            id: 4,
            title: 'Configure Triggers',
            description: 'Set up webhook for payment.succeeded events',
            type: 'automation',
            timeRequired: '10 minutes'
          },
          {
            id: 5,
            title: 'Test Integration',
            description: 'Process test payment and verify Salesforce record creation',
            type: 'testing',
            timeRequired: '15 minutes'
          },
          {
            id: 6,
            title: 'Go Live',
            description: 'Enable for production payments',
            type: 'automation',
            timeRequired: '5 minutes'
          }
        ],
        dataMappings: [
          {
            sourceField: 'customer.email',
            targetField: 'Contact.Email',
            required: true
          },
          {
            sourceField: 'customer.name',
            targetField: 'Contact.Name',
            transformation: 'Split into FirstName and LastName',
            required: true
          },
          {
            sourceField: 'amount',
            targetField: 'Opportunity.Amount',
            transformation: 'Divide by 100 (cents to dollars)',
            required: true
          },
          {
            sourceField: 'created',
            targetField: 'Opportunity.CloseDate',
            transformation: 'Convert timestamp to date',
            required: true
          },
          {
            sourceField: 'metadata.campaign',
            targetField: 'Opportunity.CampaignId',
            transformation: 'Match campaign name to ID',
            required: false
          },
          {
            sourceField: 'payment_method_details.type',
            targetField: 'Opportunity.Payment_Method__c',
            required: false
          }
        ],
        triggers: [
          {
            event: 'payment.succeeded',
            action: 'Create/Update Contact and Opportunity',
            conditions: ['Amount > $0', 'Status = succeeded']
          },
          {
            event: 'payment.refunded',
            action: 'Update Opportunity stage to Refunded',
            conditions: ['Refund amount > $0']
          },
          {
            event: 'customer.subscription.created',
            action: 'Create Recurring Donation record',
            conditions: ['Subscription status = active']
          }
        ],
        benefits: [
          'Eliminate manual data entry of donations',
          'Real-time donor records in CRM',
          'Accurate financial reporting',
          'Instant tax receipt generation',
          'Better donor segmentation',
          'Reduced human error'
        ],
        securityConsiderations: [
          'API keys stored securely (encrypted)',
          'Limited scope permissions (read payments, write contacts)',
          'HTTPS encryption for all data transfer',
          'No credit card data transmitted',
          'Audit log of all synced records',
          'GDPR/privacy compliance maintained'
        ],
        estimatedSetupTime: '1.5 hours',
        monthlyCost: '$20-50 (based on volume)',
        alternativeOptions: [
          {
            method: 'Zapier Integration',
            pros: ['No coding required', 'Quick setup', 'Good support'],
            cons: ['Monthly subscription cost', 'Less customization', 'Rate limits']
          },
          {
            method: 'Direct API Integration',
            pros: ['Full control', 'No middleware costs', 'Fastest performance'],
            cons: ['Requires developer', 'Maintenance needed', 'Longer setup']
          },
          {
            method: 'CSV Export/Import',
            pros: ['No integration needed', 'Full data visibility', 'Free'],
            cons: ['Manual process', 'Not real-time', 'Error prone']
          }
        ]
      }),

      'forms_googleforms_to_email_mailchimp': () => ({
        sourceTool: 'Google Forms',
        targetTool: 'Mailchimp',
        integrationName: 'Form Submission to Email List',
        description: 'Automatically add form respondents to specific Mailchimp audiences and tags',
        dataFlow: 'one-way',
        frequency: 'Real-time (on form submit)',
        steps: [
          {
            id: 1,
            title: 'Access Google Form',
            description: 'Open form and go to Responses tab',
            type: 'setup',
            timeRequired: '2 minutes'
          },
          {
            id: 2,
            title: 'Connect to Google Sheets',
            description: 'Link responses to a Google Sheet',
            type: 'setup',
            timeRequired: '3 minutes'
          },
          {
            id: 3,
            title: 'Get Mailchimp API Key',
            description: 'Generate API key in Mailchimp account settings',
            type: 'setup',
            timeRequired: '5 minutes'
          },
          {
            id: 4,
            title: 'Set Up Automation',
            description: 'Configure Google Apps Script or Zapier',
            type: 'automation',
            timeRequired: '20 minutes'
          },
          {
            id: 5,
            title: 'Map Form Fields',
            description: 'Match form questions to Mailchimp fields',
            type: 'mapping',
            timeRequired: '10 minutes'
          },
          {
            id: 6,
            title: 'Test & Deploy',
            description: 'Submit test form and verify list addition',
            type: 'testing',
            timeRequired: '10 minutes'
          }
        ],
        dataMappings: [
          {
            sourceField: 'Email Address',
            targetField: 'email_address',
            required: true
          },
          {
            sourceField: 'First Name',
            targetField: 'merge_fields.FNAME',
            required: false
          },
          {
            sourceField: 'Last Name',
            targetField: 'merge_fields.LNAME',
            required: false
          },
          {
            sourceField: 'Newsletter Preference',
            targetField: 'interests',
            transformation: 'Map Yes/No to interest group IDs',
            required: false
          },
          {
            sourceField: 'Volunteer Interest',
            targetField: 'tags',
            transformation: 'Add "volunteer-interest" tag if Yes',
            required: false
          },
          {
            sourceField: 'Timestamp',
            targetField: 'timestamp_signup',
            required: false
          }
        ],
        triggers: [
          {
            event: 'Form submission',
            action: 'Add subscriber to list',
            conditions: ['Email is valid', 'Consent = Yes']
          },
          {
            event: 'Specific answer given',
            action: 'Apply relevant tags',
            conditions: ['Based on form responses']
          },
          {
            event: 'Duplicate email',
            action: 'Update existing subscriber',
            conditions: ['Email already exists in list']
          }
        ],
        benefits: [
          'Instant email list growth',
          'No manual CSV imports',
          'Automatic segmentation',
          'Reduced data entry errors',
          'Immediate welcome emails',
          'Better conversion tracking'
        ],
        securityConsiderations: [
          'GDPR consent must be explicit',
          'API key security in script',
          'Limited access to form responses',
          'Double opt-in recommended',
          'Data retention policies apply',
          'Unsubscribe link required'
        ],
        estimatedSetupTime: '50 minutes',
        monthlyCost: 'Free (up to 2,000 contacts)',
        alternativeOptions: [
          {
            method: 'Manual CSV Export',
            pros: ['Full control', 'Batch processing', 'Data review'],
            cons: ['Time consuming', 'Delay in adding', 'Human error']
          },
          {
            method: 'Form plugin',
            pros: ['Native integration', 'Easy setup', 'Pre-built'],
            cons: ['Limited customization', 'May cost extra', 'Plugin updates']
          },
          {
            method: 'Webhook to custom API',
            pros: ['Maximum flexibility', 'Custom logic', 'Scalable'],
            cons: ['Requires development', 'Hosting costs', 'Maintenance']
          }
        ]
      }),

      'event_eventbrite_to_crm_hubspot': () => ({
        sourceTool: 'Eventbrite',
        targetTool: 'HubSpot',
        integrationName: 'Event Attendee CRM Sync',
        description: 'Sync event registrations to HubSpot contacts with attendance tracking',
        dataFlow: 'two-way',
        frequency: 'Hourly sync + real-time webhooks',
        steps: [
          {
            id: 1,
            title: 'Install HubSpot App',
            description: 'Add Eventbrite integration from HubSpot marketplace',
            type: 'setup',
            timeRequired: '5 minutes'
          },
          {
            id: 2,
            title: 'Authorize Eventbrite',
            description: 'Connect Eventbrite account to HubSpot',
            type: 'setup',
            timeRequired: '5 minutes'
          },
          {
            id: 3,
            title: 'Configure Sync Settings',
            description: 'Choose which events and fields to sync',
            type: 'mapping',
            timeRequired: '15 minutes'
          },
          {
            id: 4,
            title: 'Set Up Properties',
            description: 'Create custom properties for event data',
            type: 'setup',
            timeRequired: '10 minutes'
          },
          {
            id: 5,
            title: 'Create Workflows',
            description: 'Build automation for post-event follow-up',
            type: 'automation',
            timeRequired: '20 minutes'
          },
          {
            id: 6,
            title: 'Initial Sync',
            description: 'Import existing attendees to HubSpot',
            type: 'testing',
            timeRequired: '15 minutes'
          }
        ],
        dataMappings: [
          {
            sourceField: 'profile.email',
            targetField: 'email',
            required: true
          },
          {
            sourceField: 'profile.first_name',
            targetField: 'firstname',
            required: true
          },
          {
            sourceField: 'profile.last_name',
            targetField: 'lastname',
            required: true
          },
          {
            sourceField: 'event.name',
            targetField: 'last_event_attended',
            required: false
          },
          {
            sourceField: 'created',
            targetField: 'event_registration_date',
            transformation: 'Convert to date property',
            required: false
          },
          {
            sourceField: 'ticket_class.name',
            targetField: 'ticket_type',
            required: false
          },
          {
            sourceField: 'checked_in',
            targetField: 'event_attendance_status',
            transformation: 'Boolean to Yes/No',
            required: false
          }
        ],
        triggers: [
          {
            event: 'attendee.registered',
            action: 'Create/update contact in HubSpot',
            conditions: ['Valid email address']
          },
          {
            event: 'attendee.checked_in',
            action: 'Update attendance status',
            conditions: ['Check-in confirmed']
          },
          {
            event: 'order.refunded',
            action: 'Update contact status',
            conditions: ['Full refund processed']
          },
          {
            event: 'contact.property_changed',
            action: 'Update Eventbrite attendee notes',
            conditions: ['Specific properties modified']
          }
        ],
        benefits: [
          'Complete event attendance history',
          'Automated follow-up sequences',
          'Better event ROI tracking',
          'Segmentation by event participation',
          'No manual attendee imports',
          'Real-time check-in updates'
        ],
        securityConsiderations: [
          'OAuth 2.0 authentication',
          'Encrypted data transfer',
          'Limited permission scopes',
          'GDPR-compliant data handling',
          'Audit trail of all syncs',
          'Regular token refresh'
        ],
        estimatedSetupTime: '1.5 hours',
        monthlyCost: 'Free with HubSpot',
        alternativeOptions: [
          {
            method: 'Zapier Multi-Step',
            pros: ['More customization', 'Filter options', 'Error handling'],
            cons: ['Additional cost', 'More complex', 'Multiple zaps needed']
          },
          {
            method: 'API Development',
            pros: ['Complete control', 'Custom features', 'No limits'],
            cons: ['Developer required', 'Ongoing maintenance', 'Testing needed']
          },
          {
            method: 'Manual Export',
            pros: ['Simple', 'No setup', 'Full visibility'],
            cons: ['Time intensive', 'Delay in data', 'Duplicate management']
          }
        ]
      })
    };

    // Create dynamic key based on selections
    const key = `${sourceSystem.split('_')[0]}_${sourceSystem}_to_${targetSystem.split('_')[0]}_${targetSystem}`;
    
    // Try to find exact match, otherwise use a default template
    if (templates[key]) {
      return templates[key]();
    }
    
    // Default to a generic integration plan
    const sourceLabel = systems.find(s => s.value === sourceSystem)?.label || sourceSystem;
    const targetLabel = systems.find(s => s.value === targetSystem)?.label || targetSystem;
    
    return {
      sourceTool: sourceLabel,
      targetTool: targetLabel,
      integrationName: `${sourceLabel} to ${targetLabel} Integration`,
      description: `Connect ${sourceLabel} with ${targetLabel} to automate data flow`,
      dataFlow: 'one-way',
      frequency: 'Hourly',
      steps: [
        {
          id: 1,
          title: `Connect ${sourceLabel}`,
          description: 'Authenticate and grant necessary permissions',
          type: 'setup',
          timeRequired: '15 minutes'
        },
        {
          id: 2,
          title: `Connect ${targetLabel}`,
          description: 'Authenticate and configure access',
          type: 'setup',
          timeRequired: '15 minutes'
        },
        {
          id: 3,
          title: 'Map Data Fields',
          description: 'Define field mappings between systems',
          type: 'mapping',
          timeRequired: '20 minutes'
        },
        {
          id: 4,
          title: 'Configure Automation',
          description: 'Set up triggers and actions',
          type: 'automation',
          timeRequired: '15 minutes'
        },
        {
          id: 5,
          title: 'Test Integration',
          description: 'Verify data flows correctly',
          type: 'testing',
          timeRequired: '15 minutes'
        }
      ],
      dataMappings: [
        {
          sourceField: 'email',
          targetField: 'email',
          required: true
        },
        {
          sourceField: 'name',
          targetField: 'name',
          required: true
        },
        {
          sourceField: 'created_date',
          targetField: 'date_added',
          transformation: 'Format conversion',
          required: false
        }
      ],
      triggers: [
        {
          event: 'New record created',
          action: 'Create corresponding record',
          conditions: ['Valid data', 'Not duplicate']
        }
      ],
      benefits: [
        'Eliminate manual data entry',
        'Keep systems synchronized',
        'Reduce errors and duplicates',
        'Save staff time',
        'Improve data accuracy',
        'Enable better reporting'
      ],
      securityConsiderations: [
        'Use secure authentication',
        'Limit access permissions',
        'Encrypt data in transit',
        'Regular security reviews',
        'Maintain audit logs',
        'Comply with data regulations'
      ],
      estimatedSetupTime: '1.5 hours',
      monthlyCost: '$20-100 depending on method',
      alternativeOptions: [
        {
          method: 'Integration Platform',
          pros: ['No coding', 'Quick setup', 'Support available'],
          cons: ['Monthly cost', 'Platform limitations', 'Less control']
        },
        {
          method: 'Custom Development',
          pros: ['Full control', 'Custom features', 'No recurring fees'],
          cons: ['High upfront cost', 'Requires maintenance', 'Technical expertise']
        },
        {
          method: 'Manual Process',
          pros: ['No cost', 'Full control', 'No technical setup'],
          cons: ['Time consuming', 'Error prone', 'Not scalable']
        }
      ]
    };
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'setup': return <Settings className="h-4 w-4" />;
      case 'mapping': return <ArrowRight className="h-4 w-4" />;
      case 'testing': return <Check className="h-4 w-4" />;
      case 'automation': return <Zap className="h-4 w-4" />;
      default: return <Plug className="h-4 w-4" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'setup': return 'bg-blue-100 text-blue-800';
      case 'mapping': return 'bg-purple-100 text-purple-800';
      case 'testing': return 'bg-green-100 text-green-800';
      case 'automation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-blue-600" />
            Integration Builder
          </CardTitle>
          <p className="text-sm text-gray-600">
            Connect your tools to automate data flow
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Source System</label>
              <Select value={sourceSystem} onValueChange={setSourceSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Where is your data now?" />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{system.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {system.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target System</label>
              <Select value={targetSystem} onValueChange={setTargetSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Where should it go?" />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{system.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {system.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Use Case</label>
            <Select value={useCase} onValueChange={setUseCase}>
              <SelectTrigger>
                <SelectValue placeholder="What do you want to achieve?" />
              </SelectTrigger>
              <SelectContent>
                {useCases.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    <div>
                      <div className="font-medium">{uc.label}</div>
                      <div className="text-xs text-gray-500">{uc.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data Volume (Optional)</label>
            <Input
              value={dataVolume}
              onChange={(e) => setDataVolume(e.target.value)}
              placeholder="e.g., 100 records per day, 500 contacts"
            />
          </div>

          <Button 
            onClick={buildIntegration} 
            disabled={isBuilding || !sourceSystem || !targetSystem || !useCase}
            className="w-full"
          >
            {isBuilding ? (
              <>
                <Cloud className="h-4 w-4 mr-2 animate-pulse" />
                Building Integration Plan...
              </>
            ) : (
              <>
                <Plug className="h-4 w-4 mr-2" />
                Build Integration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {integration && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{integration.integrationName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {integration.dataFlow}
                  </Badge>
                  <p className="text-xs text-gray-500">{integration.frequency}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Setup Steps
              </CardTitle>
              <p className="text-sm text-gray-600">
                Estimated time: {integration.estimatedSetupTime}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integration.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-full ${getStepColor(step.type)}`}>
                        {getStepIcon(step.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.timeRequired && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {step.timeRequired}
                        </Badge>
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
                <CardTitle className="text-lg">Data Mappings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {integration.dataMappings.map((mapping, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{mapping.sourceField}</span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="font-mono text-xs">{mapping.targetField}</span>
                      </div>
                      {mapping.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Automation Triggers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integration.triggers.map((trigger, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">{trigger.event}</span>
                      </div>
                      <p className="text-xs text-blue-700">→ {trigger.action}</p>
                      {trigger.conditions && (
                        <div className="mt-1 text-xs text-blue-600">
                          If: {trigger.conditions.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {integration.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-600" />
                Security Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {integration.securityConsiderations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Lock className="h-3 w-3 text-amber-600 mt-0.5" />
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alternative Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integration.alternativeOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{option.method}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-green-700 mb-1">Pros:</p>
                        <ul className="space-y-1">
                          {option.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-600">+</span>
                              <span className="text-gray-600">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-700 mb-1">Cons:</p>
                        <ul className="space-y-1">
                          {option.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-red-600">-</span>
                              <span className="text-gray-600">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Estimated Monthly Cost</p>
                  <p className="text-2xl font-bold text-blue-700">{integration.monthlyCost}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-indigo-900">Setup Time</p>
                  <p className="text-2xl font-bold text-indigo-700">{integration.estimatedSetupTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Ready to implement?</p>
                  <p>Start with a test integration using sample data. Most integrations can be set up in under 2 hours with immediate benefits.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};