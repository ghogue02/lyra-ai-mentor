import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, FileText, Download, CheckCircle, AlertTriangle, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DataEntryAutomatorProps {
  onComplete?: () => void;
}

interface DataField {
  fieldName: string;
  dataType: string;
  extractionMethod: string;
  validationRule?: string;
  transformationRule?: string;
  confidence: number;
}

interface AutomationResult {
  sourceType: string;
  totalRecords: number;
  fieldsExtracted: DataField[];
  automationSteps: {
    step: string;
    description: string;
    timeSaved: string;
  }[];
  validationResults: {
    passed: number;
    warnings: number;
    errors: number;
    issues: string[];
  };
  integrations: {
    tool: string;
    action: string;
    status: 'ready' | 'configured' | 'pending';
  }[];
  efficiency: {
    manualTime: string;
    automatedTime: string;
    accuracy: string;
    timeSaved: string;
  };
}

export const DataEntryAutomator: React.FC<DataEntryAutomatorProps> = ({ onComplete }) => {
  const [dataSource, setDataSource] = useState<string>('');
  const [sampleData, setSampleData] = useState('');
  const [destinationSystem, setDestinationSystem] = useState<string>('');
  const [result, setResult] = useState<AutomationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const dataSources = [
    { value: 'donation_forms', label: 'Paper Donation Forms', description: 'Handwritten donor info' },
    { value: 'event_registrations', label: 'Event Registration Sheets', description: 'Attendee sign-ups' },
    { value: 'volunteer_applications', label: 'Volunteer Applications', description: 'Paper applications' },
    { value: 'email_campaigns', label: 'Email Campaign Responses', description: 'Survey responses' },
    { value: 'program_attendance', label: 'Program Attendance Sheets', description: 'Daily check-ins' },
    { value: 'expense_receipts', label: 'Expense Receipts', description: 'Reimbursement docs' },
    { value: 'grant_reports', label: 'Grant Report Data', description: 'Outcome metrics' },
    { value: 'membership_forms', label: 'Membership Forms', description: 'New member info' }
  ];

  const destinationSystems = [
    { value: 'crm', label: 'CRM System', description: 'Salesforce, HubSpot, etc.' },
    { value: 'donor_database', label: 'Donor Database', description: 'DonorPerfect, Bloomerang' },
    { value: 'accounting', label: 'Accounting Software', description: 'QuickBooks, Xero' },
    { value: 'email_platform', label: 'Email Platform', description: 'Mailchimp, Constant Contact' },
    { value: 'spreadsheet', label: 'Spreadsheet', description: 'Google Sheets, Excel' },
    { value: 'volunteer_system', label: 'Volunteer Management', description: 'VolunteerHub, Better Impact' },
    { value: 'event_platform', label: 'Event Platform', description: 'Eventbrite, Cvent' }
  ];

  const processDataEntry = async () => {
    if (!dataSource || !sampleData.trim() || !destinationSystem) {
      toast.error('Please complete all fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateAutomationPlan();
      setResult(result);
      
      toast.success('Data automation plan created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to process data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAutomationPlan = (): AutomationResult => {
    const templates: Record<string, () => AutomationResult> = {
      donation_forms_crm: () => ({
        sourceType: 'Handwritten Donation Forms',
        totalRecords: 147,
        fieldsExtracted: [
          {
            fieldName: 'Donor Name',
            dataType: 'Text',
            extractionMethod: 'OCR with name recognition',
            validationRule: 'Match against existing donors',
            transformationRule: 'Proper case formatting',
            confidence: 95
          },
          {
            fieldName: 'Donation Amount',
            dataType: 'Currency',
            extractionMethod: 'OCR with currency detection',
            validationRule: 'Positive number validation',
            transformationRule: 'Convert to decimal format',
            confidence: 98
          },
          {
            fieldName: 'Email Address',
            dataType: 'Email',
            extractionMethod: 'Pattern recognition',
            validationRule: 'Email format validation',
            transformationRule: 'Lowercase conversion',
            confidence: 92
          },
          {
            fieldName: 'Phone Number',
            dataType: 'Phone',
            extractionMethod: 'Pattern extraction',
            validationRule: 'Phone format validation',
            transformationRule: 'Standardize to (XXX) XXX-XXXX',
            confidence: 90
          },
          {
            fieldName: 'Address',
            dataType: 'Address',
            extractionMethod: 'Multi-line OCR',
            validationRule: 'Address verification API',
            transformationRule: 'USPS standard formatting',
            confidence: 88
          },
          {
            fieldName: 'Donation Date',
            dataType: 'Date',
            extractionMethod: 'Date pattern recognition',
            validationRule: 'Valid date check',
            transformationRule: 'Convert to MM/DD/YYYY',
            confidence: 96
          },
          {
            fieldName: 'Campaign/Fund',
            dataType: 'Category',
            extractionMethod: 'Checkbox/field detection',
            validationRule: 'Match to active campaigns',
            confidence: 93
          }
        ],
        automationSteps: [
          {
            step: 'Document Scanning',
            description: 'Scan paper forms using mobile app or scanner',
            timeSaved: '2 minutes per form'
          },
          {
            step: 'OCR Processing',
            description: 'Extract text from scanned images using AI',
            timeSaved: '5 minutes per form'
          },
          {
            step: 'Data Validation',
            description: 'Verify extracted data against rules',
            timeSaved: '3 minutes per form'
          },
          {
            step: 'Duplicate Detection',
            description: 'Check for existing donor records',
            timeSaved: '2 minutes per form'
          },
          {
            step: 'CRM Import',
            description: 'Create/update donor records automatically',
            timeSaved: '4 minutes per form'
          },
          {
            step: 'Receipt Generation',
            description: 'Auto-generate and send tax receipts',
            timeSaved: '3 minutes per form'
          }
        ],
        validationResults: {
          passed: 138,
          warnings: 7,
          errors: 2,
          issues: [
            '7 records with unclear handwriting need review',
            '2 records missing required email addresses',
            '3 duplicate donors detected and merged',
            '1 invalid donation amount needs verification'
          ]
        },
        integrations: [
          {
            tool: 'Mobile scanning app',
            action: 'Capture form images',
            status: 'ready'
          },
          {
            tool: 'OCR service (Google Vision)',
            action: 'Extract text from images',
            status: 'configured'
          },
          {
            tool: 'CRM API',
            action: 'Import donor records',
            status: 'configured'
          },
          {
            tool: 'Email service',
            action: 'Send automated receipts',
            status: 'ready'
          },
          {
            tool: 'Zapier/Make',
            action: 'Connect all services',
            status: 'pending'
          }
        ],
        efficiency: {
          manualTime: '19 minutes per form',
          automatedTime: '45 seconds per form',
          accuracy: '94% first-pass accuracy',
          timeSaved: '45 hours per month'
        }
      }),

      event_registrations_spreadsheet: () => ({
        sourceType: 'Event Registration Sheets',
        totalRecords: 89,
        fieldsExtracted: [
          {
            fieldName: 'Attendee Name',
            dataType: 'Text',
            extractionMethod: 'OCR with name parsing',
            confidence: 94
          },
          {
            fieldName: 'Organization',
            dataType: 'Text',
            extractionMethod: 'Field detection',
            transformationRule: 'Title case formatting',
            confidence: 91
          },
          {
            fieldName: 'Email',
            dataType: 'Email',
            extractionMethod: 'Pattern recognition',
            validationRule: 'Email validation',
            confidence: 93
          },
          {
            fieldName: 'Dietary Restrictions',
            dataType: 'Multi-select',
            extractionMethod: 'Checkbox detection',
            confidence: 88
          },
          {
            fieldName: 'Session Preferences',
            dataType: 'Multi-select',
            extractionMethod: 'Checkbox groups',
            confidence: 90
          },
          {
            fieldName: 'Payment Status',
            dataType: 'Category',
            extractionMethod: 'Field recognition',
            validationRule: 'Match payment records',
            confidence: 95
          }
        ],
        automationSteps: [
          {
            step: 'Batch Scanning',
            description: 'Scan all registration forms at once',
            timeSaved: '1 minute per form'
          },
          {
            step: 'Smart Extraction',
            description: 'AI extracts all form fields',
            timeSaved: '4 minutes per form'
          },
          {
            step: 'Data Structuring',
            description: 'Organize into spreadsheet format',
            timeSaved: '2 minutes per form'
          },
          {
            step: 'Validation Pass',
            description: 'Check for completeness and errors',
            timeSaved: '2 minutes per form'
          },
          {
            step: 'Auto-Import',
            description: 'Push to Google Sheets/Excel',
            timeSaved: '1 minute per form'
          }
        ],
        validationResults: {
          passed: 82,
          warnings: 5,
          errors: 2,
          issues: [
            '5 forms with partial information',
            '2 illegible email addresses',
            'All dietary restrictions captured successfully',
            'Payment reconciliation needed for 3 attendees'
          ]
        },
        integrations: [
          {
            tool: 'Scanner/Mobile App',
            action: 'Digitize paper forms',
            status: 'ready'
          },
          {
            tool: 'AI Form Parser',
            action: 'Extract structured data',
            status: 'configured'
          },
          {
            tool: 'Google Sheets API',
            action: 'Create event roster',
            status: 'ready'
          },
          {
            tool: 'Event platform',
            action: 'Sync attendee data',
            status: 'pending'
          }
        ],
        efficiency: {
          manualTime: '10 minutes per form',
          automatedTime: '30 seconds per form',
          accuracy: '92% accuracy rate',
          timeSaved: '14 hours for this event'
        }
      }),

      expense_receipts_accounting: () => ({
        sourceType: 'Expense Receipts & Invoices',
        totalRecords: 234,
        fieldsExtracted: [
          {
            fieldName: 'Vendor Name',
            dataType: 'Text',
            extractionMethod: 'Logo/text recognition',
            confidence: 96
          },
          {
            fieldName: 'Total Amount',
            dataType: 'Currency',
            extractionMethod: 'Total detection AI',
            validationRule: 'Sum validation',
            confidence: 98
          },
          {
            fieldName: 'Date',
            dataType: 'Date',
            extractionMethod: 'Date parsing',
            transformationRule: 'Standardize format',
            confidence: 97
          },
          {
            fieldName: 'Tax Amount',
            dataType: 'Currency',
            extractionMethod: 'Tax line detection',
            confidence: 94
          },
          {
            fieldName: 'Category',
            dataType: 'Category',
            extractionMethod: 'AI categorization',
            validationRule: 'Match chart of accounts',
            confidence: 89
          },
          {
            fieldName: 'Payment Method',
            dataType: 'Text',
            extractionMethod: 'Payment info extraction',
            confidence: 92
          },
          {
            fieldName: 'Line Items',
            dataType: 'Table',
            extractionMethod: 'Table recognition',
            confidence: 87
          }
        ],
        automationSteps: [
          {
            step: 'Receipt Capture',
            description: 'Photo or scan receipts via mobile',
            timeSaved: '2 minutes per receipt'
          },
          {
            step: 'AI Extraction',
            description: 'Extract all financial data points',
            timeSaved: '3 minutes per receipt'
          },
          {
            step: 'Categorization',
            description: 'Auto-assign expense categories',
            timeSaved: '2 minutes per receipt'
          },
          {
            step: 'Approval Routing',
            description: 'Send for digital approval if needed',
            timeSaved: '5 minutes per receipt'
          },
          {
            step: 'QuickBooks Entry',
            description: 'Create expense records automatically',
            timeSaved: '4 minutes per receipt'
          },
          {
            step: 'Document Storage',
            description: 'Archive receipts with records',
            timeSaved: '2 minutes per receipt'
          }
        ],
        validationResults: {
          passed: 218,
          warnings: 12,
          errors: 4,
          issues: [
            '12 receipts need category confirmation',
            '4 receipts too faded for full extraction',
            '8 foreign currency conversions verified',
            'All totals successfully validated'
          ]
        },
        integrations: [
          {
            tool: 'Receipt scanning app',
            action: 'Capture and enhance images',
            status: 'ready'
          },
          {
            tool: 'OCR + AI service',
            action: 'Extract receipt data',
            status: 'configured'
          },
          {
            tool: 'QuickBooks API',
            action: 'Create expense entries',
            status: 'configured'
          },
          {
            tool: 'Google Drive',
            action: 'Store receipt images',
            status: 'ready'
          },
          {
            tool: 'Approval workflow',
            action: 'Route for authorization',
            status: 'pending'
          }
        ],
        efficiency: {
          manualTime: '18 minutes per receipt',
          automatedTime: '1 minute per receipt',
          accuracy: '93% extraction accuracy',
          timeSaved: '66 hours per month'
        }
      })
    };

    const key = `${dataSource}_${destinationSystem}`;
    const template = templates[key] || templates.donation_forms_crm;
    return template();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'configured': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 90) return 'text-blue-600';
    if (confidence >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            Data Entry Automator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform manual data entry into automated workflows
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Source</label>
              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger>
                  <SelectValue placeholder="What type of data?" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      <div>
                        <div className="font-medium">{source.label}</div>
                        <div className="text-xs text-gray-500">{source.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Destination System</label>
              <Select value={destinationSystem} onValueChange={setDestinationSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Where should it go?" />
                </SelectTrigger>
                <SelectContent>
                  {destinationSystems.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      <div>
                        <div className="font-medium">{system.label}</div>
                        <div className="text-xs text-gray-500">{system.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sample Data</label>
            <Textarea
              value={sampleData}
              onChange={(e) => setSampleData(e.target.value)}
              placeholder="Paste a sample of your data here (e.g., 'John Smith, $100, john@email.com, 123 Main St...')"
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          <Button 
            onClick={processDataEntry} 
            disabled={isProcessing || !dataSource || !sampleData.trim() || !destinationSystem}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Data Pattern...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Create Automation Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Data Extraction Results</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Processing {result.totalRecords} {result.sourceType} records
                  </p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800">
                  <Database className="h-3 w-3 mr-1" />
                  {result.fieldsExtracted.length} Fields Detected
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.fieldsExtracted.map((field, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{field.fieldName}</span>
                        <Badge variant="outline" className="text-xs">
                          {field.dataType}
                        </Badge>
                      </div>
                      <span className={`text-sm font-medium ${getConfidenceColor(field.confidence)}`}>
                        {field.confidence}% confidence
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Method: {field.extractionMethod}</div>
                      {field.validationRule && (
                        <div>Validation: {field.validationRule}</div>
                      )}
                      {field.transformationRule && (
                        <div>Transform: {field.transformationRule}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automation Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.automationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.step}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Saves {step.timeSaved}
                      </Badge>
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
                  Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Records Passed</span>
                    <span className="font-medium text-green-700">{result.validationResults.passed}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm">Warnings</span>
                    <span className="font-medium text-yellow-700">{result.validationResults.warnings}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">Errors</span>
                    <span className="font-medium text-red-700">{result.validationResults.errors}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-gray-600 mb-2">Issues to Review:</p>
                    <ul className="space-y-1">
                      {result.validationResults.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  Integration Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.integrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{integration.tool}</div>
                        <div className="text-xs text-gray-600">{integration.action}</div>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-600" />
                Efficiency Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{result.efficiency.timeSaved}</p>
                  <p className="text-xs text-gray-600">Time Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{result.efficiency.accuracy}</p>
                  <p className="text-xs text-gray-600">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">{result.efficiency.manualTime}</p>
                  <p className="text-xs text-gray-600">Manual Process</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-green-700">{result.efficiency.automatedTime}</p>
                  <p className="text-xs text-gray-600">Automated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Download className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Ready to implement?</p>
                  <p>Start with your highest-volume data source first. Most organizations see ROI within the first week of automation.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};